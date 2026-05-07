const User = require('../models/User');
const Invite = require('../models/Invite');
const asyncHandler = require('express-async-handler');
const { validationResult } = require('express-validator');
const sendEmail = require('../utils/sendEmail');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { generateAccessToken, generateRefreshToken } = require('../utils/generateToken');

const isInviteOnlyEnabled = () => {
  return process.env.INVITE_ONLY !== 'false';
};

const isBootstrapAdminEmail = (email) => {
  return (
    process.env.BOOTSTRAP_ADMIN_EMAIL &&
    String(email || '').toLowerCase() === process.env.BOOTSTRAP_ADMIN_EMAIL.toLowerCase()
  );
};

const getRefreshSecret = () => {
  return process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET;
};

const sendRefreshCookie = (res, refreshToken) => {
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

exports.register = asyncHandler(async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const {
    username,
    email,
    password,
    dob,
    parentEmail,
    parentalConsent,
    inviteCode,
  } = req.body;

  const normalizedEmail = String(email || '').toLowerCase().trim();
  const normalizedUsername = String(username || '').trim();

  const existingUser = await User.findOne({
    $or: [{ email: normalizedEmail }, { username: normalizedUsername }],
  });

  if (existingUser) {
    return res.status(400).json({ message: 'Username or Email already in use' });
  }

  let invite = null;
  let assignedRole = 'Creator';
  const bootstrapAdmin = isBootstrapAdminEmail(normalizedEmail);

  if (isInviteOnlyEnabled() && !bootstrapAdmin) {
    if (!inviteCode) {
      return res.status(403).json({
        message: 'CreatorLaunch is currently invite-only. Please enter a valid invite code.',
      });
    }

    invite = await Invite.findOne({
      code: String(inviteCode).trim().toUpperCase(),
    });

    if (!invite || !invite.isUsableForEmail(normalizedEmail)) {
      return res.status(403).json({
        message: 'Invalid, expired, or already used invite code.',
      });
    }

    assignedRole = invite.role || 'Creator';
  }

  if (bootstrapAdmin) {
    assignedRole = 'Admin';
  }

  const user = new User({
    username: normalizedUsername,
    email: normalizedEmail,
    password,
    dob,
    parentEmail,
    parentalConsent,
    role: assignedRole,
    accountStatus: 'active',
    invitedByCode: invite?.code || null,
    inviteId: invite?._id || null,
  });

  const emailToken = user.createEmailVerificationToken();
  await user.save({ validateBeforeSave: false });

  if (invite) {
    invite.status = 'used';
    invite.usedBy = user._id;
    invite.usedAt = new Date();
    await invite.save();
  }

  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
  const verifyUrl = `${frontendUrl}/auth/verify-email?token=${emailToken}`;

  try {
    await sendEmail({
      to: normalizedEmail,
      subject: 'Verify Your Email',
      text: `Please verify your email by clicking the following link:\n\n${verifyUrl}\n\nThis link is valid for 24 hours.`,
    });

    if (user.isMinor() && parentEmail) {
      await sendEmail({
        to: parentEmail,
        subject: 'Your child signed up for CreatorLaunch',
        text: `Your child ${normalizedUsername} signed up for CreatorLaunch.`,
      });
    }
  } catch (emailError) {
    console.error('Registration email failed:', emailError.message);
  }

  res.status(201).json({
    message: 'Registration successful. Please verify your email.',
  });
});

exports.login = asyncHandler(async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { identifier, password } = req.body;

  const user = await User.findOne({
    $or: [
      { email: String(identifier || '').toLowerCase() },
      { username: identifier },
    ],
  }).select('+password');

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  if (typeof user.canLogin === 'function' && !user.canLogin()) {
    return res.status(403).json({
      message: `Account access denied. Your account is currently ${user.accountStatus}.`,
      accountStatus: user.accountStatus,
      reason: user.accountStatusReason || '',
    });
  }

  if (['suspended', 'banned', 'locked'].includes(user.accountStatus)) {
    return res.status(403).json({
      message: `Account access denied. Your account is currently ${user.accountStatus}.`,
      accountStatus: user.accountStatus,
      reason: user.accountStatusReason || '',
    });
  }

  const accessToken = generateAccessToken(user._id, user.role);
  const refreshToken = generateRefreshToken(user._id, user.role);

  sendRefreshCookie(res, refreshToken);

  res.status(200).json({
    message: 'Login
