const mongoose = require('mongoose');

const brandSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },

    brandName: {
      type: String,
      required: [true, 'Brand name is required'],
      trim: true,
      maxlength: 80,
    },

    subdomain: {
      type: String,
      required: [true, 'Store URL is required'],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
      match: [/^[a-z0-9-]+$/, 'Subdomain can only contain lowercase letters, numbers, and hyphens.'],
    },

    description: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: '',
    },

    logoUrl: {
      type: String,
      default: '',
    },

    status: {
      type: String,
      enum: ['active', 'locked', 'hidden', 'suspended', 'under_review'],
      default: 'active',
      index: true,
    },

    statusReason: {
      type: String,
      default: '',
      maxlength: 1000,
    },

    statusUpdatedAt: {
      type: Date,
      default: null,
    },

    statusUpdatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },

    adminNotes: {
      type: String,
      default: '',
      maxlength: 3000,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Brand', brandSchema);
