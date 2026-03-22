const asyncHandler = require('express-async-handler');
const Brand = require('../models/Brand');
const Product = require('../models/Product');
const Service = require('../models/Service');

// @desc    Get public store by subdomain
// @route   GET /api/store/:subdomain
// @access  Public
exports.getStore = asyncHandler(async (req, res) => {
  const { subdomain } = req.params;

  const brand = await Brand.findOne({ subdomain }).populate('user', 'username');
  if (!brand) {
    return res.status(404).json({ message: 'Store not found' });
  }

  const products = await Product.find({ brand: brand._id, status: 'published' });
  const services = await Service.find({ brand: brand._id, status: 'published' });

  res.status(200).json({
    store: {
      brandName: brand.brandName,
      subdomain: brand.subdomain,
      description: brand.description,
      logoUrl: brand.logoUrl,
      owner: brand.user?.username
    },
    products,
    services
  });
});

// @desc    Get single product from a public store
// @route   GET /api/store/:subdomain/products/:productId
// @access  Public
exports.getStoreProduct = asyncHandler(async (req, res) => {
  const { subdomain, productId } = req.params;

  const brand = await Brand.findOne({ subdomain });
  if (!brand) {
    return res.status(404).json({ message: 'Store not found' });
  }

  const product = await Product.findOne({ _id: productId, brand: brand._id, status: 'published' });
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }

  res.status(200).json({ product, store: { brandName: brand.brandName, subdomain: brand.subdomain, logoUrl: brand.logoUrl } });
});

// @desc    Get single service from a public store
// @route   GET /api/store/:subdomain/services/:serviceId
// @access  Public
exports.getStoreService = asyncHandler(async (req, res) => {
  const { subdomain, serviceId } = req.params;

  const brand = await Brand.findOne({ subdomain });
  if (!brand) {
    return res.status(404).json({ message: 'Store not found' });
  }

  const service = await Service.findOne({ _id: serviceId, brand: brand._id, status: 'published' });
  if (!service) {
    return res.status(404).json({ message: 'Service not found' });
  }

  res.status(200).json({ service, store: { brandName: brand.brandName, subdomain: brand.subdomain, logoUrl: brand.logoUrl } });
});
