const asyncHandler = require('express-async-handler');
const Invite = require('../models/Invite');

const normalizeInvite = (invite) => {
  const obj = invite.toObject ? invite.toObject() : invite;

  return {
    id: obj._id,
    code: obj.code,
    email: obj.email || '',
    role: obj.role,
    status: obj.status,
    notes: obj.notes || '',
    createdBy: obj.createdBy,
    usedBy: obj.usedBy,
    usedAt: obj.usedAt,
    expiresAt: obj.expiresAt,
    createdAt: obj.createdAt,
    updatedAt: obj.updatedAt,
  };
};

// @desc    List invites
// @route   GET /api/invites
// @access  Admin
exports.getInvites = asyncHandler(async (req, res) => {
  const invites = await Invite.find()
    .sort({ createdAt: -1 })
    .populate('usedBy', 'username email role')
    .populate('createdBy', 'username email role');

  res.status(200).json({
    invites: invites.map(normalizeInvite),
  });
});

// @desc    Create invite
// @route   POST /api/invites
// @access  Admin
exports.createInvite = asyncHandler(async (req, res) => {
  const { email = '', role = 'Creator', notes = '', expiresInDays = 30 } = req.body;

  if (!['Creator', 'Admin'].includes(role)) {
    return res.status(400).json({ message: 'Invalid invite role.' });
  }

  const days = Number(expiresInDays);
  const safeDays = Number.isFinite(days) && days > 0 ? Math.min(days, 365) : 30;

  let code = Invite.generateCode();
  let existing = await Invite.findOne({ code });

  while (existing) {
    code = Invite.generateCode();
    existing = await Invite.findOne({ code });
  }

  const invite = await Invite.create({
    code,
    email: String(email || '').toLowerCase().trim(),
    role,
    notes,
    createdBy: req.user?._id || req.user?.id || null,
    expiresAt: new Date(Date.now() + safeDays * 24 * 60 * 60 * 1000),
  });

  res.status(201).json({
    invite: normalizeInvite(invite),
  });
});

// @desc    Revoke invite
// @route   PATCH /api/invites/:inviteId/revoke
// @access  Admin
exports.revokeInvite = asyncHandler(async (req, res) => {
  const invite = await Invite.findById(req.params.inviteId);

  if (!invite) {
    return res.status(404).json({ message: 'Invite not found.' });
  }

  if (invite.status === 'used') {
    return res.status(400).json({ message: 'Used invites cannot be revoked.' });
  }

  invite.status = 'revoked';
  await invite.save();

  res.status(200).json({
    invite: normalizeInvite(invite),
  });
});
