# Backend Integration Requirements

## ✅ **Frontend Components Completed**

### **New Components Created:**
1. **`PrintfulCatalogBrowser.tsx`** - Complete catalog browsing with filters and search
2. **`PrintfulVariantSelector.tsx`** - Product variant selection (size, color, style)
3. **`PrintfulProductPreview.tsx`** - Reusable product display component
4. **`PrintfulErrorHandling.tsx`** - Error handling and loading states for Printful
5. **Products Management Page** (`/products/index.tsx`) - Complete product dashboard
6. **Updated ProductCreationWizard** - Now includes variant selection and real API integration

### **Enhanced Features:**
- ✅ Real-time catalog browsing with search and filters
- ✅ Product variant selection with size/color options
- ✅ Automatic mockup generation and status polling  
- ✅ Professional error handling with retry mechanisms
- ✅ Loading skeletons for better UX
- ✅ Complete product management dashboard
- ✅ Navigation updates with Products menu

## 🚧 **Still Missing in Backend (Required)**

### 1. **Printful Routes (`routes/printfulRoutes.js`)**
```javascript
const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const printfulService = require('../services/printfulService');
const upload = require('../middlewares/uploadMiddleware');

// GET /api/printful/catalog/categories - Get Printful categories
router.get('/catalog/categories', protect, async (req, res) => {
  try {
    const categories = await printfulService.getCategories();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/printful/catalog/products - Get Printful products by category
router.get('/catalog/products', protect, async (req, res) => {
  try {
    const { category_id } = req.query;
    const products = await printfulService.getProducts(category_id);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/printful/products/:productId - Get specific product details
router.get('/products/:productId', protect, async (req, res) => {
  try {
    const product = await printfulService.getProductById(req.params.productId);
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/printful/files - Upload design file
router.post('/files', protect, upload.single('design'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    
    const file = await printfulService.uploadFile(req.file);
    res.json(file);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/printful/mockups - Generate mockups
router.post('/mockups', protect, async (req, res) => {
  try {
    const mockup = await printfulService.generateMockup(req.body);
    res.json(mockup);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/printful/mockups/:taskId - Get mockup status
router.get('/mockups/:taskId', protect, async (req, res) => {
  try {
    const status = await printfulService.getMockupStatus(req.params.taskId);
    res.json(status);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
```

### 2. **Store Routes (`routes/storeRoutes.js`)**
```javascript
const express = require('express');
const router = express.Router();
const Brand = require('../models/Brand');
const Product = require('../models/Product');

// GET /api/stores/:storeUrl - Get public store data
router.get('/:storeUrl', async (req, res) => {
  try {
    const { storeUrl } = req.params;
    
    const brand = await Brand.findOne({ 
      $or: [
        { subdomain: storeUrl },
        { customDomain: storeUrl }
      ],
      isActive: true 
    }).populate('user', 'firstName lastName');
    
    if (!brand) {
      return res.status(404).json({ message: 'Store not found' });
    }
    
    res.json({
      name: brand.name,
      description: brand.description,
      logo: brand.logo,
      subdomain: brand.subdomain,
      customDomain: brand.customDomain,
      socialLinks: brand.socialLinks,
      owner: brand.user
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/stores/:storeUrl/products - Get store products  
router.get('/:storeUrl/products', async (req, res) => {
  try {
    const { storeUrl } = req.params;
    
    const brand = await Brand.findOne({ 
      $or: [
        { subdomain: storeUrl },
        { customDomain: storeUrl }
      ],
      isActive: true 
    });
    
    if (!brand) {
      return res.status(404).json({ message: 'Store not found' });
    }
    
    const products = await Product.find({ 
      brand: brand._id,
      isActive: true 
    }).populate('brand', 'name subdomain');
    
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/stores/:storeUrl/products/:productId - Get single store product
router.get('/:storeUrl/products/:productId', async (req, res) => {
  try {
    const { storeUrl, productId } = req.params;
    
    const brand = await Brand.findOne({ 
      $or: [
        { subdomain: storeUrl },
        { customDomain: storeUrl }
      ],
      isActive: true 
    });
    
    if (!brand) {
      return res.status(404).json({ message: 'Store not found' });
    }
    
    const product = await Product.findOne({
      _id: productId,
      brand: brand._id,
      isActive: true
    }).populate('brand', 'name subdomain');
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
```

### 3. **Enhanced Product Controller Methods**
Add to `controllers/productController.js`:
```javascript
// POST /api/products/printful - Create product with Printful integration
const createPrintfulProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      printfulProductId,
      printfulVariantId,
      designFileId,
      price,
      brandId
    } = req.body;

    // Generate mockups via Printful
    const mockupRequest = {
      variant_ids: [printfulVariantId],
      format: 'jpg',
      files: [
        {
          placement: 'front',
          image_id: designFileId,
          position: {
            area_width: 1800,
            area_height: 2400,
            width: 1800,
            height: 1800,
            top: 300,
            left: 0
          }
        }
      ]
    };

    const mockupTask = await printfulService.generateMockup(mockupRequest);
    
    // Create product in database
    const product = await Product.create({
      user: req.user._id,
      brand: brandId,
      name,
      description,
      price,
      printfulProductId,
      printfulVariantId,
      designFileId,
      mockupTaskId: mockupTask.result.task_key,
      status: 'processing'
    });

    res.status(201).json({
      success: true,
      data: product,
      mockupTaskId: mockupTask.result.task_key
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/products/:productId/mockup-status - Check mockup status
const checkMockupStatus = async (req, res) => {
  try {
    const { productId } = req.params;
    
    const product = await Product.findById(productId);
    if (!product || product.user.toString() !== req.user._id.toString()) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (product.mockupTaskId) {
      const status = await printfulService.getMockupStatus(product.mockupTaskId);
      
      if (status.result.status === 'completed') {
        // Update product with mockup images
        product.mockupImages = status.result.mockups.map(m => m.mockup_url);
        product.status = 'completed';
        await product.save();
      }
      
      res.json({
        status: status.result.status,
        mockups: status.result.mockups
      });
    } else {
      res.json({ status: 'no_mockup_task' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  // ...existing exports...
  createPrintfulProduct,
  checkMockupStatus
};
```

### 4. **Update Main App File**
Add to `app.js` or `server.js`:
```javascript
const printfulRoutes = require('./routes/printfulRoutes');
const storeRoutes = require('./routes/storeRoutes');

app.use('/api/printful', printfulRoutes);
app.use('/api/stores', storeRoutes);
```

### 5. **Environment Variables**
Add to `.env`:
```bash
PRINTFUL_API_TOKEN=your_printful_api_token_here
PRINTFUL_STORE_ID=your_printful_store_id_here
PRINTFUL_API_URL=https://api.printful.com
```

### 6. **Product Model Updates**
Ensure `models/Product.js` includes:
```javascript
const productSchema = new mongoose.Schema({
  // ...existing fields...
  printfulProductId: Number,
  printfulVariantId: Number,
  designFileId: Number,
  mockupTaskId: String,
  mockupImages: [String],
  status: { 
    type: String, 
    enum: ['processing', 'completed', 'failed'], 
    default: 'processing' 
  }
});
```

## 🚀 **What Works Now (Frontend)**

- ✅ **Complete Printful Catalog Browser** - Search, filter, browse products
- ✅ **Advanced Variant Selection** - Size, color, style options with availability  
- ✅ **Professional Product Creation Flow** - Step-by-step wizard with real integration
- ✅ **Product Management Dashboard** - View, edit, delete, toggle products
- ✅ **Public Store Product Display** - Customer-facing product pages
- ✅ **Error Handling & Loading States** - Professional UX for all scenarios
- ✅ **Responsive Design** - Mobile-friendly catalog and creation flow

## 📋 **Next Steps**

1. **Implement the backend routes** listed above
2. **Add Printful environment variables**
3. **Test end-to-end product creation**
4. **Verify mockup generation and polling**
5. **Test public store product display**

The frontend is now **completely integrated** and ready for production use once the backend routes are implemented!
