const express = require('express');
const { protect } = require('../middlewares/authMiddleware');
const { uploadLogo } = require('../middlewares/uploadMiddleware');
const { checkSubdomain, createBrand, getBrand, uploadLogo: uploadLogoCtrl } = require('../controllers/brandController');
const { createBrandValidation, checkAvailabilityValidation } = require('../validators/brandValidator');

const router = express.Router();

router.get('/check-subdomain', checkAvailabilityValidation, checkSubdomain);
router.get('/', protect, getBrand);
router.post('/', protect, createBrandValidation, createBrand);
router.put('/logo', protect, (req, res, next) => {
  // Multer handler with error forwarding
  uploadLogo(req, res, function (err) {
    if (err) return next(err);
    next();
  });
}, uploadLogoCtrl);

module.exports = router;
