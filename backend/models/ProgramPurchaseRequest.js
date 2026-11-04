const mongoose = require('mongoose');

const receiptSchema = new mongoose.Schema(
  {
    fileName: { type: String, trim: true },
    url: { type: String, trim: true },
    publicId: { type: String, trim: true },
    uploadedAt: { type: Date },
  },
  { _id: false },
);

const programPurchaseRequestSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ProgramUser',
      required: true,
      index: true,
    },
    vendor: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    item: {
      type: String,
      required: true,
      trim: true,
      maxlength: 180,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1200,
    },
    amount: {
      type: Number,
      required: true,
      min: 0.01,
    },
    purchaseType: {
      type: String,
      enum: ['one-time', 'recurring'],
      default: 'one-time',
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'denied'],
      default: 'pending',
      index: true,
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ProgramUser',
      default: null,
    },
    reviewedAt: {
      type: Date,
      default: null,
    },
    reviewNote: {
      type: String,
      trim: true,
      maxlength: 1200,
      default: '',
    },
    receipt: {
      type: receiptSchema,
      default: null,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model('ProgramPurchaseRequest', programPurchaseRequestSchema);
