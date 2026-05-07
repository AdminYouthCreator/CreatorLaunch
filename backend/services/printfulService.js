const axios = require('axios');
const rateLimit = require('axios-rate-limit');
const NodeCache = require('node-cache');
const cloudinary = require('cloudinary').v2;

const printfulCache = new NodeCache({ stdTTL: 21600 }); // 6 hours

// ################## ----- CLOUDINARY CONFIG ----- ##################
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// ################## ----- PRINTFUL API CLIENTS ----- ##################
const httpV1 = rateLimit(
  axios.create({
    baseURL: process.env.PRINTFUL_BASE_API_ENDPOINT || 'https://api.printful.com',
    headers: {
      Authorization: `Bearer ${process.env.PRINTFUL_API_KEY_STORE}`,
      'Content-Type': 'application/json'
    }
  }),
  { maxRequests: 100, perMilliseconds: 60000 }
);

const httpV2 = rateLimit(
  axios.create({
    baseURL: 'https://api.printful.com/v2',
    headers: {
      Authorization: `Bearer ${process.env.PRINTFUL_API_KEY_STORE}`,
      'Content-Type': 'application/json'
    }
  }),
  { maxRequests: 100, perMilliseconds: 60000 }
);

// ################## ----- ERROR HANDLER ----- ##################
const handleApiError = (error) => {
  if (error.response) {
    const data = error.response.data || {};
    const message =
      data?.error?.message ||
      data?.detail ||
      data?.result ||
      data?.message ||
      `Printful API Error: ${error.response.status}`;

    console.error('Printful API Error:', data);
    return new Error(message);
  }

  if (error.request) {
    console.error('Printful Network Error:', error.request);
    return new Error('Could not connect to Printful API.');
  }

  console.error('Axios Error:', error.message);
  return new Error(error.message || 'An unexpected error occurred.');
};

// ################## ----- CATALOG ----- ##################
const getCatalog = async (categoryId = null) => {
  const cacheKey = categoryId ? `printful-catalog-${categoryId}` : 'printful-catalog-all';

  if (printfulCache.has(cacheKey)) {
    return printfulCache.get(cacheKey);
  }

  try {
    const params = {};
    if (categoryId) {
      params.category_id = categoryId;
    }

    const response = await httpV1.get('/products', { params });
    const result = response.data.result;

    printfulCache.set(cacheKey, result);
    return result;
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
    const response = await httpV1.get('/categories');
    const result = response.data.result;

    printfulCache.set(cacheKey, result);
    return result;
  } catch (error) {
    throw handleApiError(error);
  }
};

const getProductDetails = async (productId) => {
  const cacheKey = `printful-product-${productId}`;

  if (printfulCache.has(cacheKey)) {
    return printfulCache.get(cacheKey);
  }

  try {
    const response = await httpV1.get(`/products/${productId}`);
    const result = response.data.result;

    printfulCache.set(cacheKey, result);
    return result;
  } catch (error) {
    throw handleApiError(error);
  }
};

// ################## ----- MOCKUP STYLE / PLACEMENT DATA ----- ##################
const getProductMockupStyles = async (productId) => {
  const cacheKey = `printful-v2-mockup-styles-${productId}`;

  if (printfulCache.has(cacheKey)) {
    return printfulCache.get(cacheKey);
  }

  try {
    const response = await httpV2.get(`/catalog-products/${productId}/mockup-styles`);
    const result = response.data.data || [];

    printfulCache.set(cacheKey, result);
    return result;
  } catch (error) {
    throw handleApiError(error);
  }
};

// ################## ----- FILE UPLOAD ----- ##################
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
        resource_type: 'image'
      },
      (error, result) => {
        if (error) {
          console.error('Cloudinary upload failed:', error);
          return reject(new Error('Failed to upload artwork to Cloudinary.'));
        }

        resolve({
          id: result.public_id,
          url: result.secure_url,
          status: 'ok'
        });
      }
    );

    uploadStream.end(file.buffer);
  });
};

// ################## ----- MOCKUP GENERATION ----- ##################
const createMockupTask = async ({
  productId,
  variantIds,
  imageUrl,
  placementData
}) => {
  const layer = {
    type: 'file',
    url: imageUrl
  };

  if (placementData.position) {
    layer.position = placementData.position;
  }

  const placement = {
    placement: placementData.placement,
    technique: placementData.technique,
    print_area_type: placementData.printAreaType || 'simple',
    layers: [layer]
  };

  const payload = {
    format: 'png',
    mockup_width_px: 1000,
    products: [
      {
        source: 'catalog',
        catalog_product_id: Number(productId),
        catalog_variant_ids: variantIds.map((id) => Number(id)),
        mockup_style_ids: [Number(placementData.mockupStyleId)],
        placements: [placement]
      }
    ]
  };

  try {
    const response = await httpV2.post('/mockup-tasks', payload);
    const tasks = response.data.data || [];
    return tasks[0];
  } catch (error) {
    throw handleApiError(error);
  }
};

const getMockupResult = async (taskId) => {
  try {
    const response = await httpV2.get('/mockup-tasks', {
      params: { id: taskId }
    });

    const tasks = response.data.data || [];
    return tasks[0] || null;
  } catch (error) {
    throw handleApiError(error);
  }
};

// ################## ----- SYNC PRODUCT CREATION ----- ##################
const createSyncProduct = async (payload) => {
  try {
    const response = await httpV1.post('/store/products', payload);
    return response.data.result;
  } catch (error) {
    throw handleApiError(error);
  }
};

module.exports = {
  getCatalog,
  getCategories,
  getProductDetails,
  getProductMockupStyles,
  uploadFile,
  createMockupTask,
  getMockupResult,
  createSyncProduct
};
