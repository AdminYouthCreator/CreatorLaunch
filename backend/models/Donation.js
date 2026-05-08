const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema(
  {
    donorName: {
      type: String,
      trim: true,
      default: '',
      maxlength: 120,
    },

    donorEmail: {
      type: String,
      trim: true,
      lowercase: true,
      default: '',
      index: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 1,
    },

    currency: {
      type: String,
      default: 'usd',
      lowercase: true,
    },

    campaign: {
      type: String,
      default: 'General Fund',
      trim: true,
      maxlength: 120,
      index: true,
    },

    message: {
      type: String,
      default: '',
      trim: true,
      maxlength: 1000,
    },

    anonymous: {
      type: Boolean,
      default: false,
    },

    recurring: {
      type: Boolean,
      default: false,
      index: true,
    },

    interval: {
      type: String,
      enum: ['one_time', 'month'],
      default: 'one_time',
    },

    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'expired', 'refunded'],
      default: 'pending',
      index: true,
    },

    stripeCheckoutSessionId: {
      type: String,
      default: '',
      index: true,
    },

    stripePaymentIntentId: {
      type: String,
      default: '',
      index: true,
    },

    stripeCustomerId: {
      type: String,
      default: '',
      index: true,
    },

    stripeSubscriptionId: {
      type: String,
      default: '',
      index: true,
    },

    stripeReceiptUrl: {
      type: String,
      default: '',
    },

    taxReceiptSent: {
      type: Boolean,
      default: false,
    },

    taxReceiptSentAt: {
      type: Date,
      default: null,
    },

    receiptNumber: {
      type: String,
      default: '',
      unique: true,
      sparse: true,
    },

    paidAt: {
      type: Date,
      default: null,
    },

    rawStripeEventIds: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Donation', donationSchema);