const asyncHandler = require('express-async-handler');
const { validationResult } = require('express-validator');
const printfulService = require('../services/printfulService');
const Product = require('../models/Product');
const Brand = require('../models/Brand');
const Todo = require('../models/Todo');

exports.getPrintfulCatalog = asyncHandler(async (req, res) => {

  const { categoryId } = req.query; 
  const catalog = await printfulService.getCatalog(categoryId);

  res.status(200).json(catalog);
});

exports.getPrintfulCategories = asyncHandler(async (req, res) => {
    const categories = await printfulService.getCategories();
    res.status(200).json(categories);
});

exports.getPrintfulProductDetails = asyncHandler(async (req, res) => {
    const details = await printfulService.getProductDetails(req.params.productId);
    res.status(200).json(details);
});

exports.generateMockup = asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    if (!req.file) {
      return res.status(400).json({ message: 'Artwork file is required.' });
    }

    const { productId, variantIds, placementData } = req.body;
    
    const uploadedFile = await printfulService.uploadFile(req.file);
    const parsedPlacement = JSON.parse(placementData);

    const filesPayload = [{
      file_id: uploadedFile.id,
      placement: parsedPlacement.placement || 'front',
      position: parsedPlacement.position
    }];

    const task = await printfulService.createMockupTask(productId, JSON.parse(variantIds), filesPayload);
    res.status(202).json({ task_key: task.task_key });
});


exports.getMockupStatus = asyncHandler(async (req, res) => {
    const { taskKey } = req.params;
    const result = await printfulService.getMockupResult(taskKey);
    res.status(200).json(result);
});

exports.createProduct = asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { brandId, printfulProductId, name, description, variants } = req.body;

    const brand = await Brand.findById(brandId);
    if (!brand || brand.user.toString() !== req.user.id) {
        return next(new AppError('You are not authorized to create a product for this brand.', 403));
    }

    for (const v of variants) {
        if (parseFloat(v.retailPrice) < parseFloat(v.baseCost)) {
            return next(new AppError('Retail price cannot be less than the base cost.', 400));
         }
    }
    const printfulPayload = {
      sync_product: { name, thumbnail: variants[0]?.mockupUrl || '' },
      sync_variants: variants.map(v => ({
        retail_price: v.retailPrice,
        variant_id: v.printfulVariantId,
        files: [{ type: 'default', url: v.mockupUrl }]
      }))
    };
    
    const printfulProduct = await printfulService.createSyncProduct(printfulPayload);

    const newProduct = new Product({
      brand: brandId,
      printfulProductId,
      printfulSyncProductId: printfulProduct.id,
      name, description,
      variants: printfulProduct.sync_variants.map((sv, i) => ({
        ...variants[i],
        printfulVariantId: sv.variant_id,
        printfulSyncVariantId: sv.id,
      }))
    });

    await newProduct.save();

    // Update the user's Todo list
    await Todo.updateOne({ user: req.user.id }, { $set: { productCreated: true } });

    res.status(201).json(newProduct);
});