const mongoose = require('mongoose');

const toolSubmissionSchema = new mongoose.Schema(
  {
    tool: {
      type: String,
      required: true,
      default: 'build-a-business',
      index: true,
    },
    name: {
      type: String,
      default: '',
      trim: true,
      maxlength: 140,
    },
    email: {
      type: String,
      default: '',
      trim: true,
      lowercase: true,
      maxlength: 180,
    },
    role: {
      type: String,
      default: 'student',
      trim: true,
      maxlength: 50,
    },
    response: {
      type: Object,
      default: {},
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ToolSubmission', toolSubmissionSchema);