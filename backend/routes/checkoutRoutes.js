const express = require('express');
const { createCheckoutSession, getSessionStatus } = require('../controllers/checkoutController');

const router = express.Router();

router.post('/create-session', createCheckoutSession);
router.get('/session/:sessionId', getSessionStatus);

module.exports = router;
