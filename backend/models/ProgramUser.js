const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const programUserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false,
    },
    role: {
      type: String,
      enum: ['admin', 'coach', 'student'],
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
      index: true,
    },
    assignedCoach: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ProgramUser',
      default: null,
    },
    budgetLimit: {
      type: Number,
      min: 0,
      default: 300,
    },
    creatorResourceEmail: {
      type: String,
      trim: true,
      lowercase: true,
      default: '',
    },
    forcePasswordReset: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ProgramUser',
      default: null,
    },
  },
  { timestamps: true },
);

programUserSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 12);
});

programUserSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('ProgramUser', programUserSchema);
