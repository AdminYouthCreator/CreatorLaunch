const express = require('express');
const router = express.Router();

const {
  register,
  login,
  refreshToken,
  forgotPassword,
  resetPassword,
  logout,
  verifyEmail,
  getProfile,
} = require('../controllers/authController');

const { protect } = require('../middlewares/authMiddleware');

const {
  registerValidator,
  loginValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
} = require('../validators/authValidator');

// ################## ----- AUTH ROUTES ----- ##################

// Register new user
router.post('/register', registerValidator, register);

// Login user
router.post('/login', loginValidator, login);

// Refresh access token
router.post('/refresh-token', refreshToken);

// Forgot password
router.post('/forgot-password', forgotPasswordValidator, forgotPassword);

// Reset password
router.post('/reset-password/:token', resetPasswordValidator, resetPassword);

// Logout user
router.post('/logout', logout);

// Verify email
router.get('/verify-email/:token', verifyEmail);

// Get current user profile
router.get('/profile', protect, getProfile);

module.exports = router;
