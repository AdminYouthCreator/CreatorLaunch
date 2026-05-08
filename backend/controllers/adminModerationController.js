const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Brand = require('../models/Brand');
const Product = require('../models/Product');
const Service = require('../models/Service');
const AuditLog = require('../models/AuditLog');

const createAuditLog = async ({
  req,
  action,
  targetType,
  targetId,
  reason = '',
  metadata = {},
}) => {
  await AuditLog.create({
    admin: req.user?._id || req.user?.id || null,
    action,
    targetType,
    targetId,
    reason,
    metadata,
    ipAddress: req.ip || '',
    userAgent: req.headers['user-agent'] || '',
  });
};

const getAdminId = (req) => req.user?._id || req.user?.id || null;

// ################## ----- USERS ----- ##################

exports.updateUserStatus = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { status, reason = '' } = req.body;

  const allowedStatuses = ['active', 'pending_verification', 'suspended', 'banned', 'locked'];

  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({ message: 'Invalid user status.' });
  }

  if (String(userId) === String(getAdminId(req)) && status !== 'active') {
    return res.status(400).json({ message: 'You cannot restrict your own admin account.' });
  }

  const user = await User.findById(userId);

  if (!user) {
    return res.status(404).json({ message: 'User not found.' });
  }

  const previousStatus = user.accountStatus || 'active';

  user.accountStatus = status;
  user.accountStatusReason = reason;
  user.accountStatusUpdatedAt = new Date();
  user.accountStatusUpdatedBy = getAdminId(req);

  await user.save({ validateBeforeSave: false });

  await createAuditLog({
    req,
    action: `user.status.${status}`,
    targetType: 'User',
    targetId: user._id,
    reason,
    metadata: {
      previousStatus,
      nextStatus: status,
      userEmail: user.email,
    },
  });

  res.status(200).json({
    message: `User status updated to ${status}.`,
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      accountStatus: user.accountStatus,
      accountStatusReason: user.accountStatusReason,
    },
  });
});

exports.updateUserAdminNotes = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { adminNotes = '' } = req.body;

  const user = await User.findById(userId);

  if (!user) {
    return res.status(404).json({ message: 'User not found.' });
  }

  user.adminNotes = adminNotes;
  await user.save({ validateBeforeSave: false });

  await createAuditLog({
    req,
    action: 'user.notes.updated',
    targetType: 'User',
    targetId: user._id,
    metadata: {
      userEmail: user.email,
    },
  });

  res.status(200).json({
    message: 'User admin notes updated.',
    user: {
      id: user._id,
      adminNotes: user.adminNotes,
    },
  });
});

exports.forceUserPasswordReset = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { reason = '' } = req.body;

  const user = await User.findById(userId);

  if (!user) {
    return res.status(404).json({ message: 'User not found.' });
  }

  user.forcePasswordReset = true;
  await user.save({ validateBeforeSave: false });

  await createAuditLog({
    req,
    action: 'user.force_password_reset',
    targetType: 'User',
    targetId: user._id,
    reason,
    metadata: {
      userEmail: user.email,
    },
  });

  res.status(200).json({
    message: 'User has been marked for password reset.',
  });
});

// ################## ----- STORES ----- ##################

exports.updateStoreStatus = asyncHandler(async (req, res) => {
  const { brandId } = req.params;
  const { status, reason = '' } = req.body;

  const allowedStatuses = ['active', 'locked', 'hidden', 'suspended', 'under_review'];

  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({ message: 'Invalid store status.' });
  }

  const brand = await Brand.findById(brandId).populate('user', 'username email');

  if (!brand) {
    return res.status(404).json({ message: 'Store not found.' });
  }

  const previousStatus = brand.status || 'active';

  brand.status = status;
  brand.statusReason = reason;
  brand.statusUpdatedAt = new Date();
  brand.statusUpdatedBy = getAdminId(req);

  await brand.save();

  await createAuditLog({
    req,
    action: `store.status.${status}`,
    targetType: 'Brand',
    targetId: brand._id,
    reason,
    metadata: {
      previousStatus,
      nextStatus: status,
      brandName: brand.brandName,
      subdomain: brand.subdomain,
      ownerEmail: brand.user?.email || '',
    },
  });

  res.status(200).json({
    message: `Store status updated to ${status}.`,
    store: {
      id: brand._id,
      brandName: brand.brandName,
      subdomain: brand.subdomain,
      status: brand.status,
      statusReason: brand.statusReason,
    },
  });
});

exports.updateStoreAdminNotes = asyncHandler(async (req, res) => {
  const { brandId } = req.params;
  const { adminNotes = '' } = req.body;

  const brand = await Brand.findById(brandId);

  if (!brand) {
    return res.status(404).json({ message: 'Store not found.' });
  }

  brand.adminNotes = adminNotes;
  await brand.save();

  await createAuditLog({
    req,
    action: 'store.notes.updated',
    targetType: 'Brand',
    targetId: brand._id,
    metadata: {
      brandName: brand.brandName,
      subdomain: brand.subdomain,
    },
  });

  res.status(200).json({
    message: 'Store admin notes updated.',
    store: {
      id: brand._id,
      adminNotes: brand.adminNotes,
    },
  });
});

// ################## ----- PRODUCTS ----- ##################

exports.adminUpdateProduct = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const { name, description, price, retailPrice, status, reason = '' } = req.body;

  const product = await Product.findById(productId).populate('brand', 'brandName subdomain');

  if (!product) {
    return res.status(404).json({ message: 'Product not found.' });
  }

  const previousProduct = {
    name: product.name,
    description: product.description,
    price: product.price,
    retailPrice: product.retailPrice,
    status: product.status,
  };

  if (typeof name === 'string') product.name = name;
  if (typeof description === 'string') product.description = description;

  const nextPrice = Number(price ?? retailPrice);

  if (Number.isFinite(nextPrice) && nextPrice >= 0) {
    product.price = nextPrice;
    product.retailPrice = nextPrice;

    if (product.variants?.[0]) {
      product.variants[0].retailPrice = nextPrice;
      product.variants[0].price = nextPrice;
    }
  }

if (typeof status === 'string') {
  product.status = status;
  product.isActive = status === 'active' || status === 'published';
  product.moderationReason = reason;
  product.moderationUpdatedAt = new Date();
  product.moderationUpdatedBy = getAdminId(req);
}

  await product.save();

  await createAuditLog({
    req,
    action: 'product.updated_by_admin',
    targetType: 'Product',
    targetId: product._id,
    reason,
    metadata: {
      previousProduct,
      nextProduct: {
        name: product.name,
        description: product.description,
        price: product.price,
        retailPrice: product.retailPrice,
        status: product.status,
      },
      store: product.brand,
    },
  });

  res.status(200).json({
    message: 'Product updated.',
    product,
  });
});

// ################## ----- SERVICES ----- ##################

exports.adminUpdateService = asyncHandler(async (req, res) => {
  const { serviceId } = req.params;
  const {
    title,
    description,
    category,
    price,
    deliveryTime,
    revisions,
    requirements,
    status,
    reason = '',
  } = req.body;

  const service = await Service.findById(serviceId).populate('brand', 'brandName subdomain');

  if (!service) {
    return res.status(404).json({ message: 'Service not found.' });
  }

  const previousService = {
    title: service.title,
    description: service.description,
    category: service.category,
    price: service.price,
    deliveryTime: service.deliveryTime,
    revisions: service.revisions,
    requirements: service.requirements,
    status: service.status,
  };

  if (typeof title === 'string') service.title = title;
  if (typeof description === 'string') service.description = description;
  if (typeof category === 'string') service.category = category;
  if (typeof deliveryTime === 'string') service.deliveryTime = deliveryTime;
  if (typeof requirements === 'string') service.requirements = requirements;
  if (typeof status === 'string') {
  service.status = status;
  service.moderationReason = reason;
  service.moderationUpdatedAt = new Date();
  service.moderationUpdatedBy = getAdminId(req);
}

  const nextPrice = Number(price);
  if (Number.isFinite(nextPrice) && nextPrice >= 0) {
    service.price = nextPrice;
  }

  const nextRevisions = Number(revisions);
  if (Number.isFinite(nextRevisions) && nextRevisions >= 0) {
    service.revisions = nextRevisions;
  }

  await service.save();

  await createAuditLog({
    req,
    action: 'service.updated_by_admin',
    targetType: 'Service',
    targetId: service._id,
    reason,
    metadata: {
      previousService,
      nextService: {
        title: service.title,
        description: service.description,
        category: service.category,
        price: service.price,
        deliveryTime: service.deliveryTime,
        revisions: service.revisions,
        requirements: service.requirements,
        status: service.status,
      },
      store: service.brand,
    },
  });

  res.status(200).json({
    message: 'Service updated.',
    service,
  });
});

// ################## ----- AUDIT LOGS ----- ##################

exports.getAuditLogs = asyncHandler(async (req, res) => {
  const limit = Math.min(Number(req.query.limit) || 100, 250);

  const logs = await AuditLog.find()
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate('admin', 'username email role');

  res.status(200).json({
    logs: logs.map((log) => ({
      id: log._id,
      admin: log.admin,
      action: log.action,
      targetType: log.targetType,
      targetId: log.targetId,
      reason: log.reason,
      metadata: log.metadata,
      ipAddress: log.ipAddress,
      userAgent: log.userAgent,
      createdAt: log.createdAt,
    })),
  });
});
