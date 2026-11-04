const mongoose = require('mongoose');

const programCardSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ProgramUser',
      required: true,
      index: true,
    },
    nickname: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80,
    },
    lastFour: {
      type: String,
      required: true,
      match: /^\d{4}$/,
    },
    status: {
      type: String,
      enum: ['active', 'frozen', 'replaced'],
      default: 'active',
      index: true,
    },
    issuedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ProgramUser',
      required: true,
    },
    issuedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model('ProgramCard', programCardSchema);
