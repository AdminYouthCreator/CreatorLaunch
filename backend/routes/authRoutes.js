const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');

let authValidators = {};

try {
  authValidators = require('../validators/authValidator');
} catch (error) {
  console.warn('authValidator file could not be loaded. Continuing without route validators.');
}

const noopValidator = (req, res, next) => next();

const registerValidator = authValidators.registerValidator || noopValidator;
const loginValidator = authValidators.loginValidator || noopValidator;
const forgotPasswordValidator = authValidators.forgotPasswordValidator || noopValidator;
const resetPasswordValidator = authValidators.resetPasswordValidator || noopValidator;

// ################## ----- AUTH ROUTES ----- ##################

// Register new user
router.post('/register', registerValidator, authController.register);

// Login user
router.post('/login', loginValidator, authController.login);

// Refresh access token
router.post('/refresh-token', authController.refreshToken);

// Forgot password
router.post('/forgot-password', forgotPasswordValidator, authController.forgotPassword);

// Reset password
router.post('/reset-password/:token', resetPasswordValidator, authController.resetPassword);

// Logout user
router.post('/logout', authController.logout);

// Verify email
router.get('/verify-email/:token', authController.verifyEmail);

// Get current user profile
router.get('/profile', protect, authController.getProfile);

module.exports = router;
