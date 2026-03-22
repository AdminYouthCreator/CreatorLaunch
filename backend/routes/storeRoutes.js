const express = require('express');
const { getStore, getStoreProduct, getStoreService } = require('../controllers/storeController');

const router = express.Router();

router.get('/:subdomain', getStore);
router.get('/:subdomain/products/:productId', getStoreProduct);
router.get('/:subdomain/services/:serviceId', getStoreService);

module.exports = router;
