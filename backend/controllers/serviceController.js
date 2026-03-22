const asyncHandler = require('express-async-handler');
const { validationResult } = require('express-validator');
const Service = require('../models/Service');
const Brand = require('../models/Brand');

// @desc    Create a new service
// @route   POST /api/services
// @access  Private
exports.createService = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const brand = await Brand.findOne({ user: req.user._id });
  if (!brand) {
    return res.status(400).json({ message: 'Please create a brand first' });
  }

  const { title, description, category, price, deliveryTime, revisions, requirements } = req.body;

  const service = await Service.create({
    brand: brand._id,
    title,
    description,
    category,
    price,
    deliveryTime,
    revisions,
    requirements
  });

  res.status(201).json({ service });
});

// @desc    Get all services for authenticated user's brand
// @route   GET /api/services
// @access  Private
exports.getServices = asyncHandler(async (req, res) => {
  const brand = await Brand.findOne({ user: req.user._id });
  if (!brand) {
    return res.status(200).json({ services: [] });
  }

  const services = await Service.find({ brand: brand._id }).sort({ createdAt: -1 });
  res.status(200).json({ services });
});

// @desc    Get single service
// @route   GET /api/services/:id
// @access  Private
exports.getService = asyncHandler(async (req, res) => {
  const brand = await Brand.findOne({ user: req.user._id });
  if (!brand) {
    return res.status(404).json({ message: 'No brand found' });
  }

  const service = await Service.findOne({ _id: req.params.id, brand: brand._id });
  if (!service) {
    return res.status(404).json({ message: 'Service not found' });
  }

  res.status(200).json({ service });
});

// @desc    Update a service
// @route   PUT /api/services/:id
// @access  Private
exports.updateService = asyncHandler(async (req, res) => {
  const brand = await Brand.findOne({ user: req.user._id });
  if (!brand) {
    return res.status(404).json({ message: 'No brand found' });
  }

  const service = await Service.findOneAndUpdate(
    { _id: req.params.id, brand: brand._id },
    req.body,
    { new: true, runValidators: true }
  );

  if (!service) {
    return res.status(404).json({ message: 'Service not found' });
  }

  res.status(200).json({ service });
});

// @desc    Delete a service
// @route   DELETE /api/services/:id
// @access  Private
exports.deleteService = asyncHandler(async (req, res) => {
  const brand = await Brand.findOne({ user: req.user._id });
  if (!brand) {
    return res.status(404).json({ message: 'No brand found' });
  }

  const service = await Service.findOneAndDelete({ _id: req.params.id, brand: brand._id });
  if (!service) {
    return res.status(404).json({ message: 'Service not found' });
  }

  res.status(200).json({ message: 'Service deleted' });
});
