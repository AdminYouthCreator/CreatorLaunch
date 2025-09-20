const express = require('express');
const {
  register,
  login,
  refreshToken,
  forgotPassword,
  resetPassword,
  logout,
  verifyEmail,
  getProfile
} = require('../controllers/authController');
const { registerValidation, loginValidation } = require('../validators/authValidator');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.post('/refresh-token', refreshToken);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);
router.post('/logout', logout);
router.get('/verify-email/:token', verifyEmail);
router.get('/profile', protect, getProfile);

module.exports = router;