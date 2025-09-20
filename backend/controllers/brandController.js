const { validationResult } = require('express-validator');
const Brand = require('../models/Brand');
const Todo = require('../models/Todo');
const slugify = require('../utils/slugify');
const reserved = require('../utils/reservedSubdomains');

const BASE_DOMAIN = process.env.BASE_DOMAIN || 'youthcreatorlaunch.org';

// GET /api/brands/check-subdomain?name=foo
exports.checkSubdomain = async (req, res, next) => {
  try {
    const errors = validationResult(req); if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const candidate = slugify(req.query.name);
    if (reserved.has(candidate)) {
      return res.status(409).json({ available: false, reason: 'reserved' });
    }
    const exists = await Brand.exists({ subdomain: candidate });
    return res.json({ available: !exists, fullUrl: `${candidate}.${BASE_DOMAIN}` });
  } catch (err) { next(err); }
};

// POST /api/brands
exports.createBrand = async (req, res, next) => {
  try {
    const errors = validationResult(req); if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { brandName, description } = req.body;
    let { subdomain } = req.body;

    const existingForUser = await Brand.findOne({ user: req.user._id });
    if (existingForUser) {
      return res.status(409).json({ message: 'Brand already created for this account' });
    }

    if (!subdomain) {
      subdomain = slugify(brandName || req.user.username);
    }
    if (reserved.has(subdomain)) {
      return res.status(409).json({ message: 'This subdomain is reserved' });
    }

    const exists = await Brand.exists({ subdomain });
    if (exists) return res.status(409).json({ message: 'Subdomain already taken' });

    const brand = await Brand.create({
      user: req.user._id,
      brandName,
      subdomain,
      description: description || ''
    });

    await Todo.updateOne(
      { user: req.user._id },
      { $setOnInsert: { user: req.user._id }, $set: { brandCreated: true } },
      { upsert: true }
    );

    return res.status(201).json({
      message: 'Brand created',
      brand,
      fullUrl: `${brand.subdomain}.${BASE_DOMAIN}`
    });
  } catch (err) { next(err); }
};

// GET /api/brands
exports.getBrand = async (req, res, next) => {
  try {
    const brand = await Brand.findOne({ user: req.user._id });
    if (!brand) {
      return res.status(404).json({ message: 'Brand not found' });
    }
    return res.json(brand);
  } catch (err) { 
    next(err); 
  }
};

// PUT /api/brands/logo  
exports.uploadLogo = async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'Logo file is required' });

    const brand = await Brand.findOne({ user: req.user._id });
    if (!brand) return res.status(404).json({ message: 'Brand not found' });

    const logoUrl = `/static/${req.file.filename}`;

    brand.logoUrl = logoUrl;
    await brand.save();

    return res.json({ message: 'Logo uploaded', logoUrl });
  } catch (err) { next(err); }
};
