const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
      index: true,
    },
    recipientName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 140,
    },
    recipientEmail: {
      type: String,
      default: '',
      trim: true,
      lowercase: true,
      maxlength: 180,
    },
    certificateTitle: {
      type: String,
      required: true,
      trim: true,
      maxlength: 180,
    },
    issuedFor: {
      type: String,
      default: '',
      trim: true,
      maxlength: 180,
    },
    description: {
      type: String,
      default: '',
      trim: true,
      maxlength: 2000,
    },
    issueDate: {
      type: Date,
      default: Date.now,
    },
    issuedByName: {
      type: String,
      default: 'CreatorLaunch Staff',
      trim: true,
      maxlength: 140,
    },
    issuedByEmail: {
      type: String,
      default: 'qwentin@youthcreatorlaunch.org',
      trim: true,
      lowercase: true,
      maxlength: 180,
    },
    status: {
      type: String,
      enum: ['active', 'revoked'],
      default: 'active',
      index: true,
    },
    statusReason: {
      type: String,
      default: '',
      trim: true,
      maxlength: 1000,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Certificate', certificateSchema);