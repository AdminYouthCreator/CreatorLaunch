const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema(
  {
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Brand',
      required: true,
      index: true,
    },

    title: {
      type: String,
      required: [true, 'Service title is required'],
      trim: true,
      maxlength: 120,
    },

    description: {
      type: String,
      required: [true, 'Service description is required'],
      trim: true,
      maxlength: 2000,
    },

    category: {
      type: String,
      enum: [
        'graphic-design',
        'video-editing',
        'social-media',
        'web-design',
        'music',
        'writing',
        'photography',
        'other',
      ],
      default: 'other',
      index: true,
    },

    price: {
      type: Number,
      required: [true, 'Service price is required'],
      min: 0,
    },

    deliveryTime: {
      type: String,
      required: [true, 'Delivery time is required'],
      trim: true,
      maxlength: 80,
    },

    revisions: {
      type: Number,
      default: 0,
      min: 0,
    },

    requirements: {
      type: String,
      trim: true,
      maxlength: 2000,
      default: '',
    },

    status: {
      type: String,
      enum: [
        'published',
        'draft',
        'hidden',
        'removed',
        'under_review',
        'archived',
      ],
      default: 'draft',
      index: true,
    },

    adminNotes: {
      type: String,
      default: '',
      maxlength: 3000,
    },

    moderationReason: {
      type: String,
      default: '',
      maxlength: 1000,
    },

    moderationUpdatedAt: {
      type: Date,
      default: null,
    },

    moderationUpdatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Service', serviceSchema);
