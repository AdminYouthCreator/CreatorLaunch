const mongoose = require('mongoose');
const crypto = require('crypto');

const inviteSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
      index: true,
    },

    email: {
      type: String,
      lowercase: true,
      trim: true,
      default: '',
    },

    role: {
      type: String,
      enum: ['Creator', 'Admin'],
      default: 'Creator',
    },

    status: {
      type: String,
      enum: ['active', 'used', 'revoked', 'expired'],
      default: 'active',
      index: true,
    },

    notes: {
      type: String,
      default: '',
      maxlength: 500,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },

    usedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },

    usedAt: {
      type: Date,
      default: null,
    },

    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      index: true,
    },
  },
  { timestamps: true }
);

inviteSchema.statics.generateCode = function () {
  return crypto.randomBytes(4).toString('hex').toUpperCase();
};

inviteSchema.methods.isUsableForEmail = function (email) {
  const now = new Date();

  if (this.status !== 'active') return false;
  if (this.expiresAt && this.expiresAt < now) return false;

  if (this.email && this.email.toLowerCase() !== String(email || '').toLowerCase()) {
    return false;
  }

  return true;
};

module.exports = mongoose.model('Invite', inviteSchema);
