const { body } = require('express-validator');

const registerValidation = [
  body('username')
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be between 3 and 30 characters'),

  body('email')
    .isEmail()
    .withMessage('Invalid email address'),

  body('password')
    .isStrongPassword({ minLength: 8, minNumbers: 1, minSymbols: 1 })
    .withMessage('Password must be at least 8 characters long and include a number and symbol'),

  body('dob')
    .isISO8601()
    .withMessage('Date of Birth must be a valid date'),

  body('parentEmail')
    .if((value, { req }) => {
      const dob = new Date(req.body.dob);
      const age = Math.floor((Date.now() - dob.getTime()) / (1000 * 60 * 60 * 24 * 365.25));
      return age < 18;
    })
    .isEmail()
    .withMessage('Valid parent/guardian email is required for minors'),

  body('parentalConsent')
    .if((value, { req }) => {
      const dob = new Date(req.body.dob);
      const age = Math.floor((Date.now() - dob.getTime()) / (1000 * 60 * 60 * 24 * 365.25));
      return age < 18;
    })
    .equals('true')
    .withMessage('Parental consent is required for minors')
];

const loginValidation = [
  body('identifier')
    .notEmpty()
    .withMessage('Username or Email is required'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];


module.exports = {
  registerValidation,
  loginValidation
};

