const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  brand: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Brand',
    required: true,
    index: true
  },
  title: {
    type: String,
    required: [true, 'Service title is required'],
    trim: true,
    maxlength: 120
  },
  description: {
    type: String,
    required: [true, 'Service description is required'],
    trim: true,
    maxlength: 2000
  },
  category: {
    type: String,
    enum: ['design', 'writing', 'tutoring', 'music', 'video', 'coding', 'social-media', 'other'],
    default: 'other'
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: 0
  },
  deliveryTime: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  revisions: {
    type: Number,
    default: 1,
    min: 0,
    max: 10
  },
  requirements: {
    type: String,
    trim: true,
    maxlength: 1000
  },
  status: {
    type: String,
    enum: ['published', 'draft', 'archived'],
    default: 'published'
  }
}, { timestamps: true });

module.exports = mongoose.model('Service', serviceSchema);
