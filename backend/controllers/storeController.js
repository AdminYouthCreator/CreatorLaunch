const asyncHandler = require('express-async-handler');
const Brand = require('../models/Brand');
const Product = require('../models/Product');
const Service = require('../models/Service');

const PUBLIC_STORE_STATUSES = ['active'];
const PUBLIC_PRODUCT_STATUSES = ['published', 'active'];
const PUBLIC_SERVICE_STATUSES = ['published'];

const normalizeProduct = (product) => {
  const productObject = product.toObject ? product.toObject() : product;
  const firstVariant = productObject.variants?.[0] || {};

  const imageUrl =
    productObject.imageUrl ||
    productObject.image ||
    productObject.thumbnail ||
    productObject.mockupUrl ||
    firstVariant.mockupUrl ||
    firstVariant.imageUrl ||
    '';

  const rawPrice =
    productObject.price ??
    productObject.retailPrice ??
    firstVariant.retailPrice ??
    firstVariant.price ??
    0;

  const price = Number(rawPrice);

  return {
    ...productObject,
    id: productObject._id?.toString?.() || productObject.id,
    imageUrl,
    mockupUrl: imageUrl,
    price: Number.isFinite(price) ? price : 0,
    retailPrice: Number.isFinite(price) ? price : 0,
  };
};

const getPublicBrandBySubdomain = async (subdomain) => {
  return Brand.findOne({
    subdomain,
    status: { $in: PUBLIC_STORE_STATUSES },
  }).populate('user', 'username email');
};

// @desc    Get public store by subdomain
// @route   GET /api/store/:subdomain
// @access  Public
exports.getStore = asyncHandler(async (req, res) => {
  const { subdomain } = req.params;

  const brand = await getPublicBrandBySubdomain(subdomain);

  if (!brand) {
    return res.status(404).json({ message: 'Store not found or unavailable.' });
  }

  const products = await Product.find({
    brand: brand._id,
    status: { $in: PUBLIC_PRODUCT_STATUSES },
  }).sort({ createdAt: -1 });

  const services = await Service.find({
    brand: brand._id,
    status: { $in: PUBLIC_SERVICE_STATUSES },
  }).sort({ createdAt: -1 });

  res.status(200).json({
    store: {
      _id: brand._id,
      brandName: brand.brandName,
      subdomain: brand.subdomain,
      description: brand.description,
      logoUrl: brand.logoUrl,
      owner: brand.user?.username || brand.user?.email || 'Creator',
    },
    products: products.map(normalizeProduct),
    services,
  });
});

// @desc    Get single product from a public store
// @route   GET /api/store/:subdomain/products/:productId
// @access  Public
exports.getStoreProduct = asyncHandler(async (req, res) => {
  const { subdomain, productId } = req.params;

  const brand = await getPublicBrandBySubdomain(subdomain);

  if (!brand) {
    return res.status(404).json({ message: 'Store not found or unavailable.' });
  }

  const product = await Product.findOne({
    _id: productId,
    brand: brand._id,
    status: { $in: PUBLIC_PRODUCT_STATUSES },
  });

  if (!product) {
    return res.status(404).json({ message: 'Product not found or unavailable.' });
  }

  const normalizedProduct = normalizeProduct(product);

  res.status(200).json({
    product: normalizedProduct,
    data: {
      id: normalizedProduct.id,
      _id: normalizedProduct._id,
      name: normalizedProduct.name,
      description: normalizedProduct.description,
      price: normalizedProduct.price,
      retailPrice: normalizedProduct.retailPrice,
      images: [normalizedProduct.imageUrl].filter(Boolean),
      imageUrl: normalizedProduct.imageUrl,
      mockupUrl: normalizedProduct.mockupUrl,
      variants: normalizedProduct.variants || [],
      storeOwner: {
        name: brand.user?.username || brand.user?.email || 'Creator',
        storeName: brand.brandName,
        storeUrl: brand.subdomain,
      },
      printfulProduct: {
        title: normalizedProduct.name,
        brand: brand.brandName,
        model: '',
        description: normalizedProduct.description || '',
        features: [],
        materials: [],
        careInstructions: [],
      },
    },
    store: {
      _id: brand._id,
      brandName: brand.brandName,
      subdomain: brand.subdomain,
      logoUrl: brand.logoUrl,
      owner: brand.user?.username || brand.user?.email || 'Creator',
    },
  });
});

// @desc    Get single service from a public store
// @route   GET /api/store/:subdomain/services/:serviceId
// @access  Public
exports.getStoreService = asyncHandler(async (req, res) => {
  const { subdomain, serviceId } = req.params;

  const brand = await getPublicBrandBySubdomain(subdomain);

  if (!brand) {
    return res.status(404).json({ message: 'Store not found or unavailable.' });
  }

  const service = await Service.findOne({
    _id: serviceId,
    brand: brand._id,
    status: { $in: PUBLIC_SERVICE_STATUSES },
  });

  if (!service) {
    return res.status(404).json({ message: 'Service not found or unavailable.' });
  }

  res.status(200).json({
    service,
    store: {
      _id: brand._id,
      brandName: brand.brandName,
      subdomain: brand.subdomain,
      logoUrl: brand.logoUrl,
      owner: brand.user?.username || brand.user?.email || 'Creator',
    },
  });
});
