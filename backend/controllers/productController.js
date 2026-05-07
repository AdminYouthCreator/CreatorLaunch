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

  try {
    let parsedVariantIds;
    let parsedPlacement;

    try {
      parsedVariantIds = JSON.parse(variantIds);
      parsedPlacement = JSON.parse(placementData);
    } catch (parseError) {
      return res.status(400).json({
        message: 'Invalid mockup request data.',
        details: parseError.message,
      });
    }

    if (!process.env.PRINTFUL_API_KEY_STORE) {
      return res.status(500).json({
        message: 'Printful API key is missing on the backend.',
      });
    }

    console.log('Generating Printful mockup:', {
      productId,
      variantIds: parsedVariantIds,
      fileName: req.file.originalname,
      fileType: req.file.mimetype,
      fileSize: req.file.size,
      placement: parsedPlacement?.placement || 'front',
    });

    const uploadedFile = await printfulService.uploadFile(req.file);

    console.log('Printful file uploaded:', {
      uploadedFileId: uploadedFile?.id,
      uploadedFileUrl: uploadedFile?.url,
      uploadedFileStatus: uploadedFile?.status,
    });

const filesPayload = [
  {
    type: 'default',
    image_url: uploadedFile.url,
    position: parsedPlacement?.position,
  },
];

    const task = await printfulService.createMockupTask(
      Number(productId),
      parsedVariantIds.map(Number),
      filesPayload
    );

    console.log('Printful mockup task created:', task);

    return res.status(202).json({ task_key: task.task_key });
  } catch (error) {
    console.error('Mockup generation failed:', {
      message: error.message,
      stack: error.stack,
    });

    return res.status(500).json({
      message: error.message || 'Server error occurred while generating mockup.',
    });
  }
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
    return res.status(403).json({ message: 'You are not authorized to create a product for this brand.' });
  }

  for (const v of variants) {
    if (parseFloat(v.retailPrice) < parseFloat(v.baseCost)) {
      return res.status(400).json({ message: 'Retail price cannot be less than the base cost.' });
    }
  }

  const printfulPayload = {
    sync_product: { name, thumbnail: variants[0]?.mockupUrl || '' },
    sync_variants: variants.map((v) => ({
      retail_price: v.retailPrice,
      variant_id: v.printfulVariantId,
      files: [{ type: 'default', url: v.mockupUrl }],
    })),
  };

  const printfulProduct = await printfulService.createSyncProduct(printfulPayload);

  const newProduct = new Product({
    brand: brandId,
    printfulProductId,
    printfulSyncProductId: printfulProduct.id,
    name,
    description,
    variants: printfulProduct.sync_variants.map((sv, i) => ({
      ...variants[i],
      printfulVariantId: sv.variant_id,
      printfulSyncVariantId: sv.id,
    })),
  });

  await newProduct.save();

  await Todo.updateOne({ user: req.user.id }, { $set: { productCreated: true } });

  res.status(201).json(newProduct);
});
