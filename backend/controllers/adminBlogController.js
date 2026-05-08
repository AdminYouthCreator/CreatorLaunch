const asyncHandler = require('express-async-handler');
const BlogPost = require('../models/BlogPost');
const AuditLog = require('../models/AuditLog');

const makeSlug = (value) => {
  return String(value || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

const normalizeTags = (tags) => {
  if (Array.isArray(tags)) {
    return tags.map((tag) => String(tag).trim()).filter(Boolean);
  }

  if (typeof tags === 'string') {
    return tags
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean);
  }

  return [];
};

const createAuditLog = async ({
  req,
  action,
  targetId,
  reason = '',
  metadata = {},
}) => {
  await AuditLog.create({
    admin: req.user?._id || req.user?.id || null,
    action,
    targetType: 'BlogPost',
    targetId,
    reason,
    metadata,
    ipAddress: req.ip || '',
    userAgent: req.headers['user-agent'] || '',
  });
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

const normalizeAdminPost = (post) => {
  const obj = post.toObject ? post.toObject() : post;

  return {
    id: obj._id,
    title: obj.title,
    slug: obj.slug,
    excerpt: obj.excerpt,
    content: obj.content,
    coverImageUrl: obj.coverImageUrl || '',
    authorName: obj.authorName,
    authorTitle: obj.authorTitle || '',
    status: obj.status,
    publishedAt: obj.publishedAt,
    scheduledFor: obj.scheduledFor,
    displayOrder: obj.displayOrder || 0,
    tags: obj.tags || [],
    seoTitle: obj.seoTitle || '',
    seoDescription: obj.seoDescription || '',
    createdBy: obj.createdBy,
    updatedBy: obj.updatedBy,
    createdAt: obj.createdAt,
    updatedAt: obj.updatedAt,
  };
};

const ensureUniqueSlug = async (slug, ignoreId = null) => {
  const baseSlug = makeSlug(slug) || 'blog-post';
  let finalSlug = baseSlug;
  let counter = 2;

  while (true) {
    const query = { slug: finalSlug };

    if (ignoreId) {
      query._id = { $ne: ignoreId };
    }

    const existing = await BlogPost.findOne(query).select('_id');

    if (!existing) {
      return finalSlug;
    }

    finalSlug = `${baseSlug}-${counter}`;
    counter += 1;
  }
};

const getNextDisplayOrder = async () => {
  const lastPost = await BlogPost.findOne()
    .sort({ displayOrder: -1 })
    .select('displayOrder');

  return Number(lastPost?.displayOrder || 0) + 1;
};

// @desc    Get all blog posts for admin
// @route   GET /api/admin/blog?sort=custom|newest|oldest
// @access  Admin
exports.getAdminPosts = asyncHandler(async (req, res) => {
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
      scheduledFor: -1,
      createdAt: -1,
    };
  }

  if (sort === 'oldest') {
    sortQuery = {
      publishedAt: 1,
      scheduledFor: 1,
      createdAt: 1,
    };
  }

  const posts = await BlogPost.find()
    .sort(sortQuery)
    .populate('createdBy', 'username email role')
    .populate('updatedBy', 'username email role');

  res.status(200).json({
    posts: posts.map(normalizeAdminPost),
  });
});

// @desc    Get one blog post for admin
// @route   GET /api/admin/blog/:postId
// @access  Admin
exports.getAdminPostById = asyncHandler(async (req, res) => {
  await publishDueScheduledPosts();

  const post = await BlogPost.findById(req.params.postId);

  if (!post) {
    return res.status(404).json({ message: 'Blog post not found.' });
  }

  res.status(200).json({
    post: normalizeAdminPost(post),
  });
});

// @desc    Create blog post
// @route   POST /api/admin/blog
// @access  Admin
exports.createAdminPost = asyncHandler(async (req, res) => {
  const {
    title,
    slug,
    excerpt,
    content,
    coverImageUrl = '',
    authorName,
    authorTitle = '',
    status = 'draft',
    scheduledFor = null,
    tags = [],
    seoTitle = '',
    seoDescription = '',
  } = req.body;

  if (!title || !excerpt || !content || !authorName) {
    return res.status(400).json({
      message: 'Title, excerpt, content, and author name are required.',
    });
  }

  const finalSlug = await ensureUniqueSlug(slug || title);
  const displayOrder = await getNextDisplayOrder();

  const now = new Date();
  const parsedScheduledFor = scheduledFor ? new Date(scheduledFor) : null;

  let finalStatus = status;
  let finalPublishedAt = status === 'published' ? new Date() : null;

  // If a scheduled post is created with a date already in the past,
  // publish it immediately but keep scheduledFor.
  if (status === 'scheduled' && parsedScheduledFor && parsedScheduledFor <= now) {
    finalStatus = 'published';
    finalPublishedAt = parsedScheduledFor;
  }

  const post = await BlogPost.create({
    title,
    slug: finalSlug,
    excerpt,
    content,
    coverImageUrl,
    authorName,
    authorTitle,
    status: finalStatus,
    scheduledFor: parsedScheduledFor,
    tags: normalizeTags(tags),
    seoTitle,
    seoDescription,
    createdBy: req.user?._id || req.user?.id || null,
    updatedBy: req.user?._id || req.user?.id || null,
    publishedAt: finalPublishedAt,
    displayOrder,
  });

  await createAuditLog({
    req,
    action: 'blog.created',
    targetId: post._id,
    metadata: {
      title: post.title,
      slug: post.slug,
      status: post.status,
      scheduledFor: post.scheduledFor,
      publishedAt: post.publishedAt,
      displayOrder: post.displayOrder,
    },
  });

  res.status(201).json({
    message: 'Blog post created.',
    post: normalizeAdminPost(post),
  });
});

// @desc    Update blog post
// @route   PUT /api/admin/blog/:postId
// @access  Admin
exports.updateAdminPost = asyncHandler(async (req, res) => {
  const post = await BlogPost.findById(req.params.postId);

  if (!post) {
    return res.status(404).json({ message: 'Blog post not found.' });
  }

  const previous = {
    title: post.title,
    slug: post.slug,
    status: post.status,
    scheduledFor: post.scheduledFor,
    publishedAt: post.publishedAt,
    displayOrder: post.displayOrder,
  };

  const {
    title,
    slug,
    excerpt,
    content,
    coverImageUrl,
    authorName,
    authorTitle,
    status,
    scheduledFor,
    displayOrder,
    tags,
    seoTitle,
    seoDescription,
    reason = '',
  } = req.body;

  if (typeof title === 'string') post.title = title;
  if (typeof excerpt === 'string') post.excerpt = excerpt;
  if (typeof content === 'string') post.content = content;
  if (typeof coverImageUrl === 'string') post.coverImageUrl = coverImageUrl;
  if (typeof authorName === 'string') post.authorName = authorName;
  if (typeof authorTitle === 'string') post.authorTitle = authorTitle;
  if (typeof seoTitle === 'string') post.seoTitle = seoTitle;
  if (typeof seoDescription === 'string') post.seoDescription = seoDescription;

  if (slug || title) {
    post.slug = await ensureUniqueSlug(slug || post.slug || title, post._id);
  }

  if (typeof displayOrder === 'number' && Number.isFinite(displayOrder)) {
    post.displayOrder = displayOrder;
  }

  let parsedScheduledFor = post.scheduledFor;

  if (scheduledFor) {
    parsedScheduledFor = new Date(scheduledFor);
    post.scheduledFor = parsedScheduledFor;
  } else if (scheduledFor === null || scheduledFor === '') {
    parsedScheduledFor = null;
    post.scheduledFor = null;
  }

  if (typeof status === 'string') {
    const now = new Date();

    if (status === 'scheduled' && parsedScheduledFor && parsedScheduledFor <= now) {
      post.status = 'published';

      if (!post.publishedAt) {
        post.publishedAt = parsedScheduledFor;
      }
    } else {
      const wasPublished = post.status === 'published';

      post.status = status;

      if (status === 'published' && !wasPublished && !post.publishedAt) {
        post.publishedAt = new Date();
      }

      // If moving back to draft/archived/scheduled, keep publishedAt as historical record.
      // scheduledFor is preserved unless explicitly cleared above.
    }
  }

  if (tags !== undefined) {
    post.tags = normalizeTags(tags);
  }

  post.updatedBy = req.user?._id || req.user?.id || null;

  await post.save();

  await createAuditLog({
    req,
    action: 'blog.updated',
    targetId: post._id,
    reason,
    metadata: {
      previous,
      next: {
        title: post.title,
        slug: post.slug,
        status: post.status,
        scheduledFor: post.scheduledFor,
        publishedAt: post.publishedAt,
        displayOrder: post.displayOrder,
      },
    },
  });

  res.status(200).json({
    message: 'Blog post updated.',
    post: normalizeAdminPost(post),
  });
});

// @desc    Reorder blog posts
// @route   PATCH /api/admin/blog/reorder
// @access  Admin
exports.reorderAdminPosts = asyncHandler(async (req, res) => {
  const { orderedIds = [] } = req.body;

  if (!Array.isArray(orderedIds) || orderedIds.length === 0) {
    return res.status(400).json({
      message: 'orderedIds must be a non-empty array.',
    });
  }

  await Promise.all(
    orderedIds.map((postId, index) => {
      return BlogPost.findByIdAndUpdate(postId, {
        displayOrder: index + 1,
        updatedBy: req.user?._id || req.user?.id || null,
      });
    })
  );

  await createAuditLog({
    req,
    action: 'blog.reordered',
    targetId: null,
    metadata: {
      orderedIds,
    },
  });

  const posts = await BlogPost.find()
    .sort({
      displayOrder: 1,
      publishedAt: -1,
      createdAt: -1,
    })
    .populate('createdBy', 'username email role')
    .populate('updatedBy', 'username email role');

  res.status(200).json({
    message: 'Blog posts reordered.',
    posts: posts.map(normalizeAdminPost),
  });
});

// @desc    Delete/archive blog post
// @route   DELETE /api/admin/blog/:postId
// @access  Admin
exports.archiveAdminPost = asyncHandler(async (req, res) => {
  const post = await BlogPost.findById(req.params.postId);

  if (!post) {
    return res.status(404).json({ message: 'Blog post not found.' });
  }

  post.status = 'archived';
  post.updatedBy = req.user?._id || req.user?.id || null;

  await post.save();

  await createAuditLog({
    req,
    action: 'blog.archived',
    targetId: post._id,
    reason: req.body?.reason || '',
    metadata: {
      title: post.title,
      slug: post.slug,
      scheduledFor: post.scheduledFor,
      publishedAt: post.publishedAt,
    },
  });

  res.status(200).json({
    message: 'Blog post archived.',
    post: normalizeAdminPost(post),
  });
});
