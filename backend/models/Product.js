const mongoose = require('mongoose');

const variantSchema = new mongoose.Schema(
  {
    printfulVariantId: {
      type: Number,
      required: true,
    },

    retailPrice: {
      type: Number,
      required: true,
      min: 0,
    },

    price: {
      type: Number,
      default: 0,
      min: 0,
    },

    baseCost: {
      type: Number,
      required: true,
      min: 0,
    },

    size: {
      type: String,
      default: '',
    },

    color: {
      type: String,
      default: '',
    },

    mockupUrl: {
      type: String,
      default: '',
    },

    imageUrl: {
      type: String,
      default: '',
    },

    printfulSyncVariantId: {
      type: Number,
      default: null,
    },
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Brand',
      required: true,
      index: true,
    },

    printfulProductId: {
      type: Number,
      required: true,
    },

    printfulSyncProductId: {
      type: Number,
      default: null,
      index: true,
    },

    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      maxlength: 120,
    },

    description: {
      type: String,
      trim: true,
      maxlength: 2000,
      default: '',
    },

    price: {
      type: Number,
      default: 0,
      min: 0,
    },

    retailPrice: {
      type: Number,
      default: 0,
      min: 0,
    },

    imageUrl: {
      type: String,
      default: '',
    },

    image: {
      type: String,
      default: '',
    },

    thumbnail: {
      type: String,
      default: '',
    },

    mockupUrl: {
      type: String,
      default: '',
    },

    variants: [variantSchema],

    status: {
      type: String,
      enum: [
        'published',
        'active',
        'inactive',
        'draft',
        'hidden',
        'removed',
        'under_review',
        'archived',
      ],
      default: 'published',
      index: true,
    },

    isActive: {
      type: Boolean,
      default: false,
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

module.exports = mongoose.model('Product', productSchema);
