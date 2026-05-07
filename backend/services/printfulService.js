const axios = require('axios');
const rateLimit = require('axios-rate-limit');
const FormData = require('form-data');
const NodeCache = require('node-cache');

const printfulCache = new NodeCache({ stdTTL: 21600 }); // Cache for 6 hours

const http = rateLimit(axios.create({
  baseURL: process.env.PRINTFUL_BASE_API_ENDPOINT || 'https://api.printful.com',
  headers: {
    'Authorization': `Bearer ${process.env.PRINTFUL_API_KEY_STORE}`,
    'Content-Type': 'application/json'
  }
}), { maxRequests: 100, perMilliseconds: 60000 });

const handleApiError = (error) => {
  if (error.response) {
    const message = error.response.data.error?.message || `Printful API Error: ${error.response.status}`;
    console.error('Printful API Error:', error.response.data);
    return new Error(message);
  } else if (error.request) {
    console.error('Printful Network Error:', error.request);
    return new Error('Could not connect to Printful API.');
  } else {
    console.error('Axios Error:', error.message);
    return new Error('An unexpected error occurred.');
  }
};

const getCatalog = async (categoryId = null) => {
  const cacheKey = categoryId ? `printful-catalog-${categoryId}` : 'printful-catalog-all';
  if (printfulCache.has(cacheKey)) {
    console.log(`Serving catalog from cache for key: ${cacheKey}`);
    return printfulCache.get(cacheKey);
  }

  try {
    const params = {};
    if (categoryId) {
      params.category_id = categoryId;
    }

    const response = await http.get('/products', { params });
    
    printfulCache.set(cacheKey, response.data.result);
    return response.data.result;
  } catch (error) {
    throw handleApiError(error);
  }
};

const getCategories = async () => {
    const cacheKey = 'printful-categories';
    if (printfulCache.has(cacheKey)) {
        return printfulCache.get(cacheKey);
    }
    try {
        const response = await http.get('/categories');
        printfulCache.set(cacheKey, response.data.result);
        return response.data.result;
    } catch (error) {
        throw handleApiError(error);
    }
};

const getProductDetails = async (productId) => {
    const cacheKey = `printful-product-${productId}`;
    if (printfulCache.has(cacheKey)) return printfulCache.get(cacheKey);
    try {
        const response = await http.get(`/products/${productId}`);
        printfulCache.set(cacheKey, response.data.result);
        return response.data.result;
    } catch (error) {
        throw handleApiError(error);
    }
};

const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadFile = async (file) => {
  if (
    !process.env.CLOUDINARY_CLOUD_NAME ||
    !process.env.CLOUDINARY_API_KEY ||
    !process.env.CLOUDINARY_API_SECRET
  ) {
    throw new Error('Cloudinary environment variables are missing.');
  }

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'creatorlaunch/designs',
        resource_type: 'image',
      },
      (error, result) => {
        if (error) {
          console.error('Cloudinary upload error:', error);
          return reject(new Error(error.message || 'Cloudinary upload failed.'));
        }

        return resolve({
          url: result.secure_url,
          public_id: result.public_id,
        });
      }
    );

    uploadStream.end(file.buffer);
  });
};
const createMockupTask = async (productId, variantIds, filesPayload) => {
  const payload = { variant_ids: variantIds, format: 'jpg', files: filesPayload };
  try {
    const response = await http.post(`/mockup-generator/create-task/${productId}`, payload);
    return response.data.result;
  } catch (error) {
    throw handleApiError(error);
  }
};

const getMockupResult = async (taskKey) => {
  try {
    const response = await http.get(`/mockup-generator/task?task_key=${taskKey}`);
    return response.data.result;
  } catch (error) {
    throw handleApiError(error);
  }
};

const createSyncProduct = async (payload) => {
  try {
    const response = await http.post('/store/products', payload);
    return response.data.result;
  } catch (error) {
    throw handleApiError(error);
  }
};

module.exports = {
  getCatalog,
  getProductDetails,
  uploadFile,
  createMockupTask,
  getMockupResult,
  createSyncProduct,
  getCategories
};
