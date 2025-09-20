const mongoose = require('mongoose');

const variantSchema = new mongoose.Schema({
  printfulVariantId: { type: Number, required: true },
  retailPrice: { type: Number, required: true },
  baseCost: { type: Number, required: true },
  size: { type: String, required: true },
  color: { type: String },
  mockupUrl: { type: String, required: true },
  printfulSyncVariantId: { type: Number, required: true }
}, { _id: false });

const productSchema = new mongoose.Schema({
  brand: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Brand',
    required: true,
    index: true
  },
  printfulProductId: {
    type: Number,
    required: true
  },
  printfulSyncProductId: {
    type: Number,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: 120
  },
  description: {
    type: String,
    trim: true,
    maxlength: 2000
  },
  variants: [variantSchema],
  status: {
    type: String,
    enum: ['published', 'draft', 'archived'],
    default: 'published'
  }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);