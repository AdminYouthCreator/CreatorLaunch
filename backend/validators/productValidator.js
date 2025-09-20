const { body, param, query } = require('express-validator');

exports.generateMockupValidator = [
  body('productId').isInt().withMessage('Product ID must be an integer'),
  body('variantIds').isJSON().withMessage('variantIds must be a JSON string array'),
  body('placementData').isJSON().withMessage('placementData must be a JSON string object')
];

exports.createProductValidator = [
  body('brandId').isMongoId().withMessage('Invalid Brand ID'),
  body('printfulProductId').isInt().withMessage('Invalid Printful Product ID'),
  body('name').trim().notEmpty().withMessage('Product name is required'),
  body('description').optional().trim(),
  body('variants').isArray({ min: 1 }).withMessage('At least one variant is required'),
  body('variants.*.retailPrice').isFloat({ gt: 0 }).withMessage('Invalid retail price'),
  body('variants.*.baseCost').isFloat({ gt: 0 }).withMessage('Invalid base cost')
];