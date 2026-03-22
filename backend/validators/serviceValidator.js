const { body } = require('express-validator');

const createServiceValidation = [
  body('title')
    .trim()
    .notEmpty().withMessage('Title is required')
    .isLength({ max: 120 }).withMessage('Title must be under 120 characters'),

  body('description')
    .trim()
    .notEmpty().withMessage('Description is required')
    .isLength({ max: 2000 }).withMessage('Description must be under 2000 characters'),

  body('category')
    .optional()
    .isIn(['design', 'writing', 'tutoring', 'music', 'video', 'coding', 'social-media', 'other'])
    .withMessage('Invalid category'),

  body('price')
    .isFloat({ min: 0 }).withMessage('Price must be a positive number'),

  body('deliveryTime')
    .trim()
    .notEmpty().withMessage('Delivery time is required'),

  body('revisions')
    .optional()
    .isInt({ min: 0, max: 10 }).withMessage('Revisions must be between 0 and 10')
];

module.exports = { createServiceValidation };
