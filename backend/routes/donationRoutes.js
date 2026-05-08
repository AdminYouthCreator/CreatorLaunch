const express = require('express');

const {
  createCheckoutSession,
  getDonationBySession,
  getAdminDonations,
  resendDonationReceipt,
} = require('../controllers/donationController');

const { protect, authorizeRoles } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/create-checkout-session', createCheckoutSession);
router.get('/session/:sessionId', getDonationBySession);

router.get('/admin', protect, authorizeRoles('Admin'), getAdminDonations);
router.post('/admin/:donationId/resend-receipt', protect, authorizeRoles('Admin'), resendDonationReceipt);

module.exports = router;