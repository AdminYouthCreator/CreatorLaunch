const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema(
  {
    source: {
      type: String,
      enum: ['stripe', 'manual'],
      default: 'stripe',
      index: true,
    },

    donationKind: {
      type: String,
      enum: ['cash', 'item'],
      default: 'cash',
      index: true,
    },

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

    donorPhone: {
      type: String,
      trim: true,
      default: '',
      maxlength: 50,
    },

    donorAddress: {
      type: String,
      trim: true,
      default: '',
      maxlength: 500,
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
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
      enum: ['pending', 'paid', 'failed', 'expired', 'refunded', 'invalidated'],
      default: 'pending',
      index: true,
    },

    paymentMethod: {
      type: String,
      enum: ['stripe', 'cash', 'check', 'money_order', 'item', 'other'],
      default: 'stripe',
      index: true,
    },

    itemDescription: {
      type: String,
      trim: true,
      default: '',
      maxlength: 2000,
    },

    estimatedValue: {
      type: Number,
      min: 0,
      default: 0,
    },

    receivedDate: {
      type: Date,
      default: null,
      index: true,
    },

    acknowledgementNotes: {
      type: String,
      trim: true,
      default: '',
      maxlength: 2000,
    },

    internalNotes: {
      type: String,
      trim: true,
      default: '',
      maxlength: 2000,
    },

    issuedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },

    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },

    invalidatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },

    invalidatedAt: {
      type: Date,
      default: null,
    },

    invalidationReason: {
      type: String,
      trim: true,
      default: '',
      maxlength: 1000,
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
      trim: true,
      default: undefined,
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

donationSchema.pre('save', function cleanEmptyReceiptNumber() {
  if (this.receiptNumber === '') {
    this.receiptNumber = undefined;
  }
});

donationSchema.index(
  { receiptNumber: 1 },
  {
    unique: true,
    sparse: true,
    partialFilterExpression: {
      receiptNumber: {
        $type: 'string',
        $ne: '',
      },
    },
  }
);

module.exports = mongoose.model('Donation', donationSchema);