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
      default: 0,
    },

    price: {
      type: Number,
      default: 0,
    },

    baseCost: {
      type: Number,
      required: true,
      default: 0,
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

    // Top-level display fields for the frontend product cards
    price: {
      type: Number,
      default: 0,
    },

    retailPrice: {
      type: Number,
      default: 0,
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

    variants: {
      type: [variantSchema],
      default: [],
    },

    status: {
      type: String,
      enum: ['published', 'draft', 'archived', 'active', 'inactive', 'processing'],
      default: 'published',
    },

    isActive: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);
