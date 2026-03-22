const express = require('express');
const { protect } = require('../middlewares/authMiddleware');
const { createService, getServices, getService, updateService, deleteService } = require('../controllers/serviceController');
const { createServiceValidation } = require('../validators/serviceValidator');

const router = express.Router();

router.post('/', protect, createServiceValidation, createService);
router.get('/', protect, getServices);
router.get('/:id', protect, getService);
router.put('/:id', protect, updateService);
router.delete('/:id', protect, deleteService);

module.exports = router;
