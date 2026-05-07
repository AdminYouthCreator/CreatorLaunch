const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema(
  {
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
      index: true,
    },

    action: {
      type: String,
      required: true,
      index: true,
    },

    targetType: {
      type: String,
      required: true,
      enum: ['User', 'Brand', 'Product', 'Service', 'BlogPost', 'Invite', 'Order', 'System'],
      index: true,
    },

    targetId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
      index: true,
    },

    reason: {
      type: String,
      default: '',
      maxlength: 1000,
    },

    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },

    ipAddress: {
      type: String,
      default: '',
    },

    userAgent: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('AuditLog', auditLogSchema);
