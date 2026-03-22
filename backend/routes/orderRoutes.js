const express = require('express');
const { protect } = require('../middlewares/authMiddleware');
const { createOrder, getOrders, getOrder, updateFulfillment, getMetrics } = require('../controllers/orderController');

const router = express.Router();

router.get('/metrics', protect, getMetrics);
router.post('/', createOrder);
router.get('/', protect, getOrders);
router.get('/:orderId', protect, getOrder);
router.patch('/:orderId/fulfillment', protect, updateFulfillment);

module.exports = router;
