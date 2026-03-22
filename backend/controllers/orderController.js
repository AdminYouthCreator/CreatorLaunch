const asyncHandler = require('express-async-handler');
const Order = require('../models/Order');
const Brand = require('../models/Brand');

// @desc    Create a new order (called after successful payment)
// @route   POST /api/orders
// @access  Public
exports.createOrder = asyncHandler(async (req, res) => {
  const { buyer, brandId, items, subtotal, shipping, tax, total, stripePaymentIntentId } = req.body;

  const brand = await Brand.findById(brandId);
  if (!brand) {
    return res.status(404).json({ message: 'Store not found' });
  }

  const order = await Order.create({
    buyer,
    brand: brand._id,
    items,
    subtotal,
    shipping,
    tax,
    total,
    stripePaymentIntentId,
    paymentStatus: 'paid'
  });

  res.status(201).json({ order });
});

// @desc    Get orders for the authenticated user's brand
// @route   GET /api/orders
// @access  Private
exports.getOrders = asyncHandler(async (req, res) => {
  const brand = await Brand.findOne({ user: req.user._id });
  if (!brand) {
    return res.status(404).json({ message: 'No brand found for this user' });
  }

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  const filter = { brand: brand._id };
  if (req.query.status) filter.paymentStatus = req.query.status;

  const [orders, total] = await Promise.all([
    Order.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Order.countDocuments(filter)
  ]);

  res.status(200).json({
    orders,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) }
  });
});

// @desc    Get single order
// @route   GET /api/orders/:orderId
// @access  Private
exports.getOrder = asyncHandler(async (req, res) => {
  const brand = await Brand.findOne({ user: req.user._id });
  if (!brand) {
    return res.status(404).json({ message: 'No brand found' });
  }

  const order = await Order.findOne({ _id: req.params.orderId, brand: brand._id });
  if (!order) {
    return res.status(404).json({ message: 'Order not found' });
  }

  res.status(200).json({ order });
});

// @desc    Update order fulfillment status
// @route   PATCH /api/orders/:orderId/fulfillment
// @access  Private
exports.updateFulfillment = asyncHandler(async (req, res) => {
  const { fulfillmentStatus, trackingNumber, trackingUrl } = req.body;

  const brand = await Brand.findOne({ user: req.user._id });
  if (!brand) {
    return res.status(404).json({ message: 'No brand found' });
  }

  const order = await Order.findOne({ _id: req.params.orderId, brand: brand._id });
  if (!order) {
    return res.status(404).json({ message: 'Order not found' });
  }

  if (fulfillmentStatus) order.fulfillmentStatus = fulfillmentStatus;
  if (trackingNumber) order.trackingNumber = trackingNumber;
  if (trackingUrl) order.trackingUrl = trackingUrl;

  await order.save();
  res.status(200).json({ order });
});

// @desc    Get revenue metrics for the authenticated user's brand
// @route   GET /api/orders/metrics
// @access  Private
exports.getMetrics = asyncHandler(async (req, res) => {
  const brand = await Brand.findOne({ user: req.user._id });
  if (!brand) {
    return res.status(200).json({
      totalRevenue: 0,
      totalProfit: 0,
      totalOrders: 0,
      recentOrders: []
    });
  }

  const [metrics] = await Order.aggregate([
    { $match: { brand: brand._id, paymentStatus: 'paid' } },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: '$total' },
        totalProfit: { $sum: '$profit' },
        totalOrders: { $sum: 1 }
      }
    }
  ]);

  const recentOrders = await Order.find({ brand: brand._id, paymentStatus: 'paid' })
    .sort({ createdAt: -1 })
    .limit(5);

  res.status(200).json({
    totalRevenue: metrics?.totalRevenue || 0,
    totalProfit: metrics?.totalProfit || 0,
    totalOrders: metrics?.totalOrders || 0,
    recentOrders
  });
});
