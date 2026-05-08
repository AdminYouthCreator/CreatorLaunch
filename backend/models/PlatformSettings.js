const mongoose = require('mongoose');

const platformSettingsSchema = new mongoose.Schema(
  {
    singletonKey: {
      type: String,
      default: 'platform',
      unique: true,
      index: true,
    },

    platformLocked: {
      type: Boolean,
      default: false,
      index: true,
    },

    platformLockMessage: {
      type: String,
      default: 'CreatorLaunch is currently in private maintenance mode.',
      maxlength: 500,
    },

    inviteOnlyEnabled: {
      type: Boolean,
      default: true,
      index: true,
    },

    siteAnnouncementEnabled: {
      type: Boolean,
      default: true,
    },

    siteAnnouncementText: {
      type: String,
      default: 'CreatorLaunch is building the next generation of founders.',
      maxlength: 300,
    },

    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('PlatformSettings', platformSettingsSchema);
