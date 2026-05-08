const asyncHandler = require('express-async-handler');
const PlatformSettings = require('../models/PlatformSettings');
const AuditLog = require('../models/AuditLog');

const getOrCreateSettings = async () => {
  let settings = await PlatformSettings.findOne({ singletonKey: 'platform' });

  if (!settings) {
    settings = await PlatformSettings.create({ singletonKey: 'platform' });
  }

  return settings;
};

const createAuditLog = async ({ req, action, reason = '', metadata = {} }) => {
  await AuditLog.create({
    admin: req.user?._id || req.user?.id || null,
    action,
    targetType: 'System',
    targetId: null,
    reason,
    metadata,
    ipAddress: req.ip || '',
    userAgent: req.headers['user-agent'] || '',
  });
};

const normalizeSettings = (settings) => {
  return {
    platformLocked: Boolean(settings.platformLocked),
    platformLockMessage: settings.platformLockMessage || '',
    inviteOnlyEnabled: Boolean(settings.inviteOnlyEnabled),
    siteAnnouncementEnabled: Boolean(settings.siteAnnouncementEnabled),
    siteAnnouncementText: settings.siteAnnouncementText || '',
    updatedAt: settings.updatedAt,
    createdAt: settings.createdAt,
  };
};

// @desc    Public settings for frontend header/auth display
// @route   GET /api/settings/public
// @access  Public
exports.getPublicSettings = asyncHandler(async (req, res) => {
  const settings = await getOrCreateSettings();

  res.status(200).json({
    settings: normalizeSettings(settings),
  });
});

// @desc    Get admin platform settings
// @route   GET /api/admin/settings
// @access  Admin
exports.getAdminSettings = asyncHandler(async (req, res) => {
  const settings = await getOrCreateSettings();

  res.status(200).json({
    settings: normalizeSettings(settings),
  });
});

// @desc    Update admin platform settings
// @route   PATCH /api/admin/settings
// @access  Admin
exports.updateAdminSettings = asyncHandler(async (req, res) => {
  const settings = await getOrCreateSettings();

  const previous = normalizeSettings(settings);

  const {
    platformLocked,
    platformLockMessage,
    inviteOnlyEnabled,
    siteAnnouncementEnabled,
    siteAnnouncementText,
    reason = '',
  } = req.body;

  if (typeof platformLocked === 'boolean') {
    settings.platformLocked = platformLocked;
  }

  if (typeof platformLockMessage === 'string') {
    settings.platformLockMessage = platformLockMessage;
  }

  if (typeof inviteOnlyEnabled === 'boolean') {
    settings.inviteOnlyEnabled = inviteOnlyEnabled;
  }

  if (typeof siteAnnouncementEnabled === 'boolean') {
    settings.siteAnnouncementEnabled = siteAnnouncementEnabled;
  }

  if (typeof siteAnnouncementText === 'string') {
    settings.siteAnnouncementText = siteAnnouncementText;
  }

  settings.updatedBy = req.user?._id || req.user?.id || null;

  await settings.save();

  const next = normalizeSettings(settings);

  await createAuditLog({
    req,
    action: 'settings.updated',
    reason,
    metadata: {
      previous,
      next,
    },
  });

  res.status(200).json({
    message: 'Platform settings updated.',
    settings: next,
  });
});
