const mongoose = require('mongoose');

const brandSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true, required: true },
  brandName: { type: String, required: true, trim: true, maxlength: 80 },
  subdomain: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/, 'Invalid subdomain format']
  },
  description: { type: String, trim: true, maxlength: 1000 },
  logoUrl: { type: String, default: null },
}, { timestamps: true });

brandSchema.index({ subdomain: 1 }, { unique: true });
brandSchema.index({ user: 1 }, { unique: true });

module.exports = mongoose.model('Brand', brandSchema);
