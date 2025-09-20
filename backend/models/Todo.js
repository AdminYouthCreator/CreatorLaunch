const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true, required: true },
  signupCompleted: { type: Boolean, default: true },
  brandCreated: { type: Boolean, default: false },
  productCreated: { type: Boolean, default: false },
  firstSale: { type: Boolean, default: false },
}, { timestamps: true });

todoSchema.index({ user: 1 }, { unique: true });

module.exports = mongoose.model('Todo', todoSchema);
