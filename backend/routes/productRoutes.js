const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { protect } = require('../middlewares/authMiddleware');
const multer = require('multer');
const {
  generateMockupValidator,
  createProductValidator,
} = require('../validators/productValidator');

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 15 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];

    if (!allowed.includes(file.mimetype)) {
      return cb(new Error('Only image files are allowed'), false);
    }

    cb(null, true);
  },
});

// ################## ----- PRINTFUL CATALOG ROUTES ----- ##################

router.get('/printful/catalog', protect, productController.getPrintfulCatalog);

router.get(
  '/printful/catalog/:productId',
  protect,
  productController.getPrintfulProductDetails
);

router.get(
  '/printful/catalog/:productId/mockup-options',
  protect,
  productController.getPrintfulMockupOptions
);

router.get('/printful/categories', protect, productController.getPrintfulCategories);

// ################## ----- MOCKUP GENERATION ROUTES ----- ##################

router.post(
  '/generate-mockup',
  protect,
  upload.single('artwork'),
  generateMockupValidator,
  productController.generateMockup
);

router.get('/mockup-status/:taskKey', protect, productController.getMockupStatus);

// ################## ----- PRODUCT CRUD ROUTES ----- ##################
// Keep these AFTER the /printful and /mockup routes, so :productId does not catch those routes.

router.get('/', protect, productController.getProducts);

router.get('/:productId', protect, productController.getProductById);

router.patch('/:productId/status', protect, productController.updateProductStatus);

router.patch('/:productId', protect, productController.updateProductStatus);

router.put('/:productId', protect, productController.updateProduct);

router.delete('/:productId', protect, productController.deleteProduct);

router.post('/', protect, createProductValidator, productController.createProduct);

module.exports = router;
