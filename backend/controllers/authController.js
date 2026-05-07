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

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public, invite-only
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

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
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

  const accessToken = generateAccessToken(user._id, user.role);
  const refreshToken = generateRefreshToken(user._id, user.role);

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(200).json({
    message: 'Login successful',
    accessToken,
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
    },
  });
});

exports.refreshToken = asyncHandler(async (req, res) => {
  const token = req.cookies.refreshToken;

  if (!token) {
    return res.status(401).json({ message: 'Refresh token not found' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ message: 'Invalid refresh token' });
    }

    const newAccessToken = generateAccessToken(user._id, user.role);
    res.status(200).json({ accessToken: newAccessToken });
  } catch (err) {
    return res.status(403).json({ message: 'Refresh token expired or invalid' });
  }
});

// @route   POST /api/auth/forgot-password
exports.forgotPassword = asyncHandler(async (req, res) => {
  const { email, dob } = req.body;

  const user = await User.findOne({ email: String(email || '').toLowerCase() });

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  const userDob = new Date(user.dob).toISOString().split('T')[0];
  const requestDob = new Date(dob).toISOString().split('T')[0];

  if (userDob !== requestDob) {
    return res.status(400).json({ message: 'Date of Birth does not match our records' });
  }

  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
  const resetUrl = `${frontendUrl}/auth/reset-password?token=${resetToken}`;

  await sendEmail({
    to: user.email,
    subject: 'Password Reset Request',
    text: `You requested a password reset.\n\nReset your password using this link:\n\n${resetUrl}\n\nThis link will expire in 1 hour.`,
  });

  res.status(200).json({ message: 'Reset link sent to your email address' });
});

// @route   POST /api/auth/reset-password/:token
exports.resetPassword = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(400).json({ message: 'Token is invalid or has expired' });
  }

  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;

  await user.save();

  const accessToken = generateAccessToken(user._id, user.role);
  const refreshToken = generateRefreshToken(user._id, user.role);

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(200).json({
    message: 'Password reset successful',
    accessToken,
  });
});

// @route   POST /api/auth/logout
exports.logout = asyncHandler(async (req, res) => {
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  });

  res.status(200).json({ message: 'Logged out successfully' });
});

exports.verifyEmail = asyncHandler(async (req, res) => {
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    emailVerificationToken: hashedToken,
    emailVerificationExpires: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(400).json({ message: 'Invalid or expired verification token' });
  }

  user.emailVerified = true;
  user.emailVerificationToken = undefined;
  user.emailVerificationExpires = undefined;

  await user.save();

  res.status(200).json({ message: 'Email verified successfully. You can now log in.' });
});

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
exports.getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  res.status(200).json({
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      emailVerified: user.emailVerified,
      dob: user.dob,
      parentEmail: user.parentEmail,
      parentalConsent: user.parentalConsent,
      invitedByCode: user.invitedByCode,
      createdAt: user.createdAt,
    },
  });
});
