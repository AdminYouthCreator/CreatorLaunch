const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { protect } = require('../middlewares/authMiddleware');
const multer = require('multer');
const { generateMockupValidator, createProductValidator } = require('../validators/productValidator');

const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: { fileSize: 15 * 1024 * 1024 }, // 15MB limit
    fileFilter: (req, file, cb) => {
        const allowed = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
        if (!allowed.includes(file.mimetype)) {
            return cb(new Error('Only image files are allowed'), false);
        }
        cb(null, true);
    }
});

// Catalog routes
router.get('/printful/catalog', protect, productController.getPrintfulCatalog);
router.get('/printful/catalog/:productId', protect, productController.getPrintfulProductDetails);
router.get('/printful/categories', protect, productController.getPrintfulCategories);

// Mockup generation routes
router.post('/generate-mockup',
    protect,
    upload.single('artwork'),
    generateMockupValidator,
    productController.generateMockup
);

router.get('/mockup-status/:taskKey', protect, productController.getMockupStatus);

// Product creation route
router.post('/', protect, createProductValidator, productController.createProduct);

module.exports = router;