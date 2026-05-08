const mongoose = require('mongoose');

const blogPostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Blog title is required'],
      trim: true,
      maxlength: 160,
    },

    slug: {
      type: String,
      required: [true, 'Blog slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
      match: [/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens.'],
    },

    excerpt: {
      type: String,
      required: [true, 'Blog excerpt is required'],
      trim: true,
      maxlength: 400,
    },

    content: {
      type: String,
      required: [true, 'Blog content is required'],
      trim: true,
      maxlength: 50000,
    },

    coverImageUrl: {
      type: String,
      default: '',
      trim: true,
    },

    authorName: {
      type: String,
      required: [true, 'Author name is required'],
      trim: true,
      maxlength: 120,
    },

    authorTitle: {
      type: String,
      default: '',
      trim: true,
      maxlength: 160,
    },

    status: {
      type: String,
      enum: ['draft', 'published', 'archived', 'scheduled'],
      default: 'draft',
      index: true,
    },

    publishedAt: {
      type: Date,
      default: null,
      index: true,
    },

    scheduledFor: {
      type: Date,
      default: null,
      index: true,
    },

    tags: {
      type: [String],
      default: [],
    },

    seoTitle: {
      type: String,
      default: '',
      trim: true,
      maxlength: 180,
    },

    seoDescription: {
      type: String,
      default: '',
      trim: true,
      maxlength: 300,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },

    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  { timestamps: true }
);

blogPostSchema.pre('validate', function () {
  if (!this.slug && this.title) {
    this.slug = this.title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  if (this.status === 'published' && !this.publishedAt) {
    this.publishedAt = new Date();
  }
});

module.exports = mongoose.model('BlogPost', blogPostSchema);
