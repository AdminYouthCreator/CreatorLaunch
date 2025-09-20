const { body, query } = require('express-validator');
const reserved = require('../utils/reservedSubdomains');
const slugify = require('../utils/slugify');

const subdomainRule = (val) => /^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/.test(val);

const createBrandValidation = [
  body('brandName')
    .trim().notEmpty().withMessage('Brand name is required')
    .isLength({ max: 80 }).withMessage('Brand name too long'),
  body('subdomain')
    .optional() // if omitted, we’ll derive from brandName/username
    .customSanitizer(v => slugify(v))
    .custom(v => subdomainRule(v)).withMessage('Invalid subdomain format')
    .custom(v => !reserved.has(v)).withMessage('Subdomain is reserved'),
  body('description')
    .optional().trim().isLength({ max: 1000 }).withMessage('Description too long'),
];

const checkAvailabilityValidation = [
  query('name')
    .trim().notEmpty().withMessage('name is required')
    .customSanitizer(v => slugify(v))
    .custom(v => subdomainRule(v)).withMessage('Invalid subdomain format')
    .custom(v => !reserved.has(v)).withMessage('Subdomain is reserved'),
];

module.exports = {
  createBrandValidation,
  checkAvailabilityValidation
};
