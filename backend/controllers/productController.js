const asyncHandler = require('express-async-handler');
const { validationResult } = require('express-validator');
const printfulService = require('../services/printfulService');
const Product = require('../models/Product');
const Brand = require('../models/Brand');
const Todo = require('../models/Todo');

// ################## ----- HELPERS ----- ##################

const buildDefaultPosition = (placementData) => {
  const areaWidth = Number(placementData.printAreaWidth || 12);
  const areaHeight = Number(placementData.printAreaHeight || 16);

  const width = Math.min(areaWidth, areaHeight) * 0.8;
  const height = width;

  return {
    width,
    height,
    top: Math.max((areaHeight - height) / 2, 0),
    left: Math.max((areaWidth - width) / 2, 0),
  };
};

const normalizeMockupOptions = (styles) => {
  return (styles || [])
    .filter((style) => Array.isArray(style.mockup_styles) && style.mockup_styles.length > 0)
    .map((style) => ({
      placement: style.placement,
      displayName: style.display_name,
      technique: style.technique,
      printAreaWidth: style.print_area_width,
      printAreaHeight: style.print_area_height,
      printAreaType: style.print_area_type,
      dpi: style.dpi,
      mockupStyles: (style.mockup_styles || []).map((mockupStyle) => ({
        id: mockupStyle.id,
        categoryName: mockupStyle.category_name,
        viewName: mockupStyle.view_name,
        restrictedToVariants: mockupStyle.restricted_to_variants || null,
      })),
    }));
};

const normalizeProductForFrontend = (product) => {
  const productObject = product.toObject ? product.toObject() : product;
  const firstVariant = productObject.variants?.[0] || {};

  const rawPrice =
    productObject.price ??
    productObject.retailPrice ??
    firstVariant.retailPrice ??
    firstVariant.price ??
    0;

  const price = Number(rawPrice);

  const imageUrl =
    productObject.image ||
    productObject.imageUrl ||
    productObject.thumbnail ||
    productObject.mockupUrl ||
    productObject.mockup_url ||
    firstVariant.mockupUrl ||
    firstVariant.mockup_url ||
    firstVariant.image ||
    firstVariant.imageUrl ||
    '';

  return {
    ...productObject,
    id: productObject._id?.toString?.() || productObject.id,
    price: Number.isFinite(price) ? price : 0,
    imageUrl,
    mockupUrl: imageUrl,
    status: productObject.status || (productObject.isActive ? 'active' : 'inactive'),
    isActive: Boolean(productObject.isActive),
  };
};

// ################## ----- PRINTFUL CATALOG ----- ##################

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

exports.getPrintfulMockupOptions = asyncHandler(async (req, res) => {
  const productId = Number(req.params.productId);
  const styles = await printfulService.getProductMockupStyles(productId);
  const options = normalizeMockupOptions(styles);

  res.status(200).json({ data: options });
});

// ################## ----- MOCKUP GENERATION ----- ##################

exports.generateMockup = asyncHandler(async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  if (!req.file) {
    return res.status(400).json({ message: 'Artwork file is required.' });
  }

  const productId = Number(req.body.productId);

  const parsedVariantIds =
    typeof req.body.variantIds === 'string'
      ? JSON.parse(req.body.variantIds)
      : req.body.variantIds;

  const parsedPlacement =
    typeof req.body.placementData === 'string'
      ? JSON.parse(req.body.placementData)
      : req.body.placementData;

  if (!parsedPlacement?.placement) {
    return res.status(400).json({ message: 'A valid placement is required.' });
  }

  if (!parsedPlacement?.technique) {
    return res.status(400).json({ message: 'A valid print technique is required.' });
  }

  if (!parsedPlacement?.mockupStyleId) {
    return res.status(400).json({ message: 'A valid mockup style is required.' });
  }

  const uploadedFile = await printfulService.uploadFile(req.file);

  const task = await printfulService.createMockupTask({
    productId,
    variantIds: parsedVariantIds.map((id) => Number(id)),
    imageUrl: uploadedFile.url,
    placementData: {
      ...parsedPlacement,
      position: parsedPlacement.position || buildDefaultPosition(parsedPlacement),
    },
  });

  if (!task?.id) {
    return res.status(500).json({ message: 'Mockup task was not created successfully.' });
  }

  res.status(202).json({
    task_key: String(task.id),
    taskId: task.id,
    uploadedFileUrl: uploadedFile.url,
  });
});

exports.getMockupStatus = asyncHandler(async (req, res) => {
  const taskId = req.params.taskKey;
  const result = await printfulService.getMockupResult(taskId);

  if (!result) {
    return res.status(404).json({ message: 'Mockup task not found.' });
  }

  const mockups = (result.catalog_variant_mockups || []).flatMap((variantGroup) =>
    (variantGroup.mockups || []).map((mockup) => ({
      catalogVariantId: variantGroup.catalog_variant_id,
      placement: mockup.placement,
      displayName: mockup.display_name,
      technique: mockup.technique,
      styleId: mockup.style_id,
      mockup_url: mockup.mockup_url,
    }))
  );

  res.status(200).json({
    status: result.status,
    mockups,
    failureReasons: result.failure_reasons || [],
  });
});

// ################## ----- PRODUCT CRUD ----- ##################

exports.getProducts = asyncHandler(async (req, res) => {
  const userBrands = await Brand.find({ user: req.user.id }).select('_id');
  const brandIds = userBrands.map((brand) => brand._id);

  const products = await Product.find({ brand: { $in: brandIds } })
    .populate('brand')
    .sort({ createdAt: -1 });

  const normalizedProducts = products.map(normalizeProductForFrontend);

  res.status(200).json({
    products: normalizedProducts,
    data: normalizedProducts,
  });
});

exports.getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.productId).populate('brand');

  if (!product) {
    return res.status(404).json({ message: 'Product not found.' });
  }

  const brand = await Brand.findById(product.brand?._id || product.brand);

  if (!brand || brand.user.toString() !== req.user.id) {
    return res.status(403).json({ message: 'You are not authorized to view this product.' });
  }

  const normalizedProduct = normalizeProductForFrontend(product);

  res.status(200).json({
    product: normalizedProduct,
    data: normalizedProduct,
  });
});

exports.updateProductStatus = asyncHandler(async (req, res) => {
  const { status, isActive } = req.body;

  const product = await Product.findById(req.params.productId).populate('brand');

  if (!product) {
    return res.status(404).json({ message: 'Product not found.' });
  }

  const brand = await Brand.findById(product.brand?._id || product.brand);

  if (!brand || brand.user.toString() !== req.user.id) {
    return res.status(403).json({ message: 'You are not authorized to update this product.' });
  }

  let nextStatus = status;

  if (!nextStatus) {
    nextStatus = isActive ? 'active' : 'inactive';
  }

  product.status = nextStatus;
  product.isActive = nextStatus === 'active';

  await product.save();

  const normalizedProduct = normalizeProductForFrontend(product);

  res.status(200).json({
    product: normalizedProduct,
    data: normalizedProduct,
  });
});

exports.deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.productId).populate('brand');

  if (!product) {
    return res.status(404).json({ message: 'Product not found.' });
  }

  const brand = await Brand.findById(product.brand?._id || product.brand);

  if (!brand || brand.user.toString() !== req.user.id) {
    return res.status(403).json({ message: 'You are not authorized to delete this product.' });
  }

  await Product.deleteOne({ _id: product._id });

  res.status(200).json({ message: 'Product deleted successfully.' });
});

exports.createProduct = asyncHandler(async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { brandId, printfulProductId, name, description, variants } = req.body;

  const brand = await Brand.findById(brandId);

  if (!brand || brand.user.toString() !== req.user.id) {
    return res
      .status(403)
      .json({ message: 'You are not authorized to create a product for this brand.' });
  }

  if (!Array.isArray(variants) || variants.length === 0) {
    return res.status(400).json({ message: 'At least one product variant is required.' });
  }

  const parseMoney = (value) => {
    if (typeof value === 'number') return value;

    if (typeof value === 'string') {
      const cleaned = value.replace(/[^0-9.]/g, '');
      const parsed = Number(cleaned);
      return Number.isFinite(parsed) ? parsed : 0;
    }

    return 0;
  };

  const normalizedVariants = variants.map((variant) => {
    const retailPrice = parseMoney(variant.retailPrice ?? variant.price);
    const baseCost = parseMoney(variant.baseCost);

    return {
      ...variant,
      retailPrice,
      price: retailPrice,
      baseCost,
      size: variant.size || '',
      color: variant.color || '',
      mockupUrl: variant.mockupUrl || variant.mockup_url || '',
      imageUrl: variant.mockupUrl || variant.mockup_url || '',
    };
  });

  for (const variant of normalizedVariants) {
    if (variant.retailPrice < variant.baseCost) {
      return res
        .status(400)
        .json({ message: 'Retail price cannot be less than the base cost.' });
    }
  }

  const firstVariant = normalizedVariants[0];
  const firstRetailPrice = firstVariant.retailPrice || 0;
  const firstMockupUrl = firstVariant.mockupUrl || '';

  const printfulPayload = {
    sync_product: {
      name,
      thumbnail: firstMockupUrl,
    },
    sync_variants: normalizedVariants.map((variant) => ({
      retail_price: variant.retailPrice.toString(),
      variant_id: variant.printfulVariantId,
      files: [
        {
          type: 'default',
          url: variant.mockupUrl,
        },
      ],
    })),
  };

  let printfulProduct = null;

  try {
    printfulProduct = await printfulService.createSyncProduct(printfulPayload);
  } catch (error) {
    console.error('Printful sync product creation failed:', error.message);

    printfulProduct = {
      id: null,
      sync_product: {
        id: null,
      },
      sync_variants: normalizedVariants.map((variant) => ({
        id: null,
        variant_id: variant.printfulVariantId,
      })),
    };
  }

  const newProduct = new Product({
    brand: brandId,
    printfulProductId,
    printfulSyncProductId:
      printfulProduct?.sync_product?.id || printfulProduct?.id || null,

    name,
    description,

    price: firstRetailPrice,
    retailPrice: firstRetailPrice,

    imageUrl: firstMockupUrl,
    image: firstMockupUrl,
    thumbnail: firstMockupUrl,
    mockupUrl: firstMockupUrl,

    status: 'published',
    isActive: false,

    variants: normalizedVariants.map((variant, index) => ({
      ...variant,
      printfulVariantId:
        printfulProduct?.sync_variants?.[index]?.variant_id || variant.printfulVariantId,
      printfulSyncVariantId: printfulProduct?.sync_variants?.[index]?.id || null,
    })),
  });

  await newProduct.save();

await Todo.findOneAndUpdate(
  { user: req.user.id },
  {
    $set: {
      productCreated: true,
      firstProductCreated: true,
      createProduct: true,
      productStepCompleted: true,
      updatedAt: new Date(),
    },
  },
  { upsert: true, new: true }
);

  exports.updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.productId).populate('brand');

  if (!product) {
    return res.status(404).json({ message: 'Product not found.' });
  }

  const brand = await Brand.findById(product.brand?._id || product.brand);

  if (!brand || brand.user.toString() !== req.user.id) {
    return res.status(403).json({ message: 'You are not authorized to update this product.' });
  }

  const { name, description, price, retailPrice, status, isActive } = req.body;

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
    product.isActive = status === 'active';
  } else if (typeof isActive === 'boolean') {
    product.isActive = isActive;
    product.status = isActive ? 'active' : 'inactive';
  }

  await product.save();

  const normalizedProduct = normalizeProductForFrontend(product);

  res.status(200).json({
    product: normalizedProduct,
    data: normalizedProduct,
  });
});
  
  const normalizedProduct = normalizeProductForFrontend(newProduct);

  res.status(201).json({
    product: normalizedProduct,
    data: normalizedProduct,
  });
});
