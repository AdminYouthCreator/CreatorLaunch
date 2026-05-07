// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30,
  },

  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
  },

  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 8,
    select: false,
  },

  dob: {
    type: Date,
    required: [true, 'Date of Birth is required'],
  },

  parentEmail: {
    type: String,
    validate: {
      validator: function (v) {
        if (this.isMinor()) {
          return /\S+@\S+\.\S+/.test(v);
        }
        return true;
      },
      message: 'Parent/Guardian Email is required for users under 18.',
    },
  },

  parentalConsent: {
    type: Boolean,
    default: false,
  },

  role: {
    type: String,
    enum: ['Creator', 'Admin'],
    default: 'Creator',
  },

  invitedByCode: {
    type: String,
    default: null,
  },

  inviteId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Invite',
    default: null,
  },

  emailVerified: {
    type: Boolean,
    default: false,
  },

  emailVerificationToken: String,
  emailVerificationExpires: Date,

  createdAt: {
    type: Date,
    default: Date.now,
  },

  resetPasswordToken: String,
  resetPasswordExpires: Date,
});

// Check if user is a minor
userSchema.methods.isMinor = function () {
  const age = Math.floor(
    (Date.now() - new Date(this.dob).getTime()) / (1000 * 60 * 60 * 24 * 365.25)
  );

  return age < 18;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  this.resetPasswordExpires = Date.now() + 60 * 60 * 1000;
  return resetToken;
};

userSchema.methods.createEmailVerificationToken = function () {
  const token = crypto.randomBytes(32).toString('hex');
  this.emailVerificationToken = crypto.createHash('sha256').update(token).digest('hex');
  this.emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000;
  return token;
};

// Hash password before saving
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;

  this.password = await bcrypt.hash(this.password, 12);
});

module.exports = mongoose.model('User', userSchema);
