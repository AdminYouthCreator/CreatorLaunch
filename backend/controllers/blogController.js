const asyncHandler = require('express-async-handler');
const BlogPost = require('../models/BlogPost');

const normalizePublicPost = (post, includeContent = false) => {
  const obj = post.toObject ? post.toObject() : post;

  const normalized = {
    id: obj._id,
    title: obj.title,
    slug: obj.slug,
    excerpt: obj.excerpt,
    coverImageUrl: obj.coverImageUrl || '',
    authorName: obj.authorName,
    authorTitle: obj.authorTitle || '',
    status: obj.status,
    publishedAt: obj.publishedAt,
    scheduledFor: obj.scheduledFor,
    displayOrder: obj.displayOrder || 0,
    tags: obj.tags || [],
    seoTitle: obj.seoTitle || obj.title,
    seoDescription: obj.seoDescription || obj.excerpt,
    createdAt: obj.createdAt,
    updatedAt: obj.updatedAt,
  };

  if (includeContent) {
    normalized.content = obj.content;
  }

  return normalized;
};

// ################## ----- SCHEDULED POST AUTO-PUBLISH ----- ##################
// Mongoose update pipelines caused this error:
// "Cannot pass an array to query updates unless the updatePipeline option is set."
// So this uses find + save instead.
// ###########################################################################
const publishDueScheduledPosts = async () => {
  const now = new Date();

  const duePosts = await BlogPost.find({
    status: 'scheduled',
    scheduledFor: { $lte: now },
  });

  await Promise.all(
    duePosts.map(async (post) => {
      post.status = 'published';

      // Keep the original scheduled date as the published date.
      if (!post.publishedAt) {
        post.publishedAt = post.scheduledFor || now;
      }

      await post.save();
    })
  );
};

const getPublicQuery = () => {
  return {
    status: 'published',
  };
};

// @desc    Get public blog posts
// @route   GET /api/blog?sort=custom|newest|oldest
// @access  Public
exports.getPublicPosts = asyncHandler(async (req, res) => {
  await publishDueScheduledPosts();

  const sort = req.query.sort || 'custom';

  let sortQuery = {
    displayOrder: 1,
    publishedAt: -1,
    createdAt: -1,
  };

  if (sort === 'newest') {
    sortQuery = {
      publishedAt: -1,
      createdAt: -1,
    };
  }

  if (sort === 'oldest') {
    sortQuery = {
      publishedAt: 1,
      createdAt: 1,
    };
  }

  const posts = await BlogPost.find(getPublicQuery())
    .sort(sortQuery)
    .select('-content');

  res.status(200).json({
    posts: posts.map((post) => normalizePublicPost(post, false)),
  });
});

// @desc    Get public blog post by slug
// @route   GET /api/blog/:slug
// @access  Public
exports.getPublicPostBySlug = asyncHandler(async (req, res) => {
  await publishDueScheduledPosts();

  const { slug } = req.params;

  const post = await BlogPost.findOne({
    slug,
    ...getPublicQuery(),
  });

  if (!post) {
    return res.status(404).json({ message: 'Blog post not found.' });
  }

  res.status(200).json({
    post: normalizePublicPost(post, true),
  });
});
