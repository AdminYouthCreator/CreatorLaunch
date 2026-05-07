import axios from 'axios';

// ################## ----- API CONFIGURATION ----- ##################
// Centralized API configuration for backend communication
// Handles authentication headers and base URL setup
// ################################################################

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

// Create axios instance with default configuration
const api = axios.create({
baseURL: API_BASE_URL,
timeout: 10000,
headers: {
'Content-Type': 'application/json',
},
});

// Request interceptor to add auth token
api.interceptors.request.use(
(config) => {
const token = localStorage.getItem('token');
if (token) {
config.headers.Authorization = `Bearer ${token}`;
}
return config;
},
(error) => {
return Promise.reject(error);
}
);

// Response interceptor to handle errors and token refresh
api.interceptors.response.use(
(response) => {
return response;
},
async (error) => {
const originalRequest = error.config;

if (error.response?.status === 401 && !originalRequest._retry) {
originalRequest._retry = true;

try {
// Try to refresh the token
const refreshResponse = await fetch(`${API_BASE_URL}/api/auth/refresh-token`, {
method: 'POST',
credentials: 'include', // Include cookies for refresh token
});

if (refreshResponse.ok) {
const data = await refreshResponse.json();
localStorage.setItem('token', data.accessToken || data.token);

// Retry the original request with new token
originalRequest.headers.Authorization = `Bearer ${data.accessToken || data.token}`;
return api(originalRequest);
}
} catch (refreshError) {
console.error('Token refresh failed:', refreshError);
}

// If refresh fails, logout user
localStorage.removeItem('token');
localStorage.removeItem('user');
window.location.href = '/auth/login';
}

return Promise.reject(error);
}
);

// ################## ----- AUTH API FUNCTIONS ----- ##################
// Authentication related API calls
// ################################################################

export const authAPI = {
// Register new user
register: async (userData: {
name: string;
email: string;
password: string;
dob?: string;
guardianEmail?: string;
}) => {
const response = await api.post('/api/auth/register', {
username: userData.name, // Backend expects 'username', not 'name'
email: userData.email,
password: userData.password,
dob: userData.dob,
parentEmail: userData.guardianEmail, // Backend expects 'parentEmail'
parentalConsent: !!userData.guardianEmail, // Set consent if guardian email provided
});
return response.data;
},

// Login user
login: async (email: string, password: string) => {
const response = await api.post('/api/auth/login', { 
identifier: email, // Backend expects 'identifier', not 'email'
password 
});
return response.data;
},

// Logout user
logout: async () => {
const response = await api.post('/api/auth/logout');
return response.data;
},

// Forgot password
forgotPassword: async (email: string, dob: string) => {
const response = await api.post('/api/auth/forgot-password', { email, dob });
return response.data;
},

// Reset password
resetPassword: async (token: string, password: string) => {
const response = await api.post(`/api/auth/reset-password/${token}`, { password });
return response.data;
},

// Refresh access token
refreshToken: async () => {
const response = await api.post('/api/auth/refresh-token');
return response.data;
},

// Get current user profile
getProfile: async () => {
const response = await api.get('/api/auth/profile');
return response.data;
},

// Update user profile - Note: Backend doesn't have this endpoint yet
updateProfile: async (userData: any) => {
// This endpoint doesn't exist in backend yet, will need to be added
throw new Error('Update profile endpoint not implemented in backend yet');
},
};

// ################## ----- BRAND API FUNCTIONS ----- ##################
// Brand management related API calls
// ################################################################

export const brandAPI = {
// Create new brand
create: async (brandData: {
name: string;
description?: string;
logoUrl?: string;
storeUrl: string;
}) => {
const response = await api.post('/api/brands', {
brandName: brandData.name, // Backend expects 'brandName'
description: brandData.description,
subdomain: brandData.storeUrl, // Backend expects 'subdomain'
});
return response.data;
},

// Get user's brand
getUserBrand: async () => {
const response = await api.get('/api/brands');
return response.data;
},

// Get brand by ID - Note: Backend doesn't have this endpoint yet
getById: async (brandId: string) => {
throw new Error('Get brand by ID endpoint not implemented in backend yet');
},

// Update brand - Note: Backend doesn't have this endpoint yet
update: async (brandId: string, brandData: any) => {
throw new Error('Update brand endpoint not implemented in backend yet');
},

// Delete brand - Note: Backend doesn't have this endpoint yet
delete: async (brandId: string) => {
throw new Error('Delete brand endpoint not implemented in backend yet');
},

// Check store URL availability
checkStoreUrl: async (storeUrl: string) => {
const response = await api.get(`/api/brands/check-subdomain?name=${encodeURIComponent(storeUrl)}`);
return response.data;
},
};

// ################## ----- TODO API FUNCTIONS ----- ##################
// Todo/task management related API calls
// ################################################################

export const todoAPI = {
// Get all todos for user
getAll: async () => {
const response = await api.get('/api/todo'); // Backend uses '/api/todo', not '/api/todos'
return response.data;
},

// Create new todo - Note: Backend doesn't have this endpoint
create: async (todoData: {
title: string;
description?: string;
priority?: 'low' | 'medium' | 'high';
dueDate?: string;
}) => {
throw new Error('Create todo endpoint not implemented in backend yet');
},

// Update todo
update: async (todoId: string, todoData: any) => {
const response = await api.patch('/api/todo', todoData); // Backend uses PATCH to root, not specific ID
return response.data;
},

// Delete todo - Note: Backend doesn't have this endpoint
delete: async (todoId: string) => {
throw new Error('Delete todo endpoint not implemented in backend yet');
},

// Toggle todo completion - Note: Backend doesn't have this endpoint
toggle: async (todoId: string) => {
throw new Error('Toggle todo endpoint not implemented in backend yet');
},
};

// ################## ----- FILE UPLOAD FUNCTIONS ----- ##################
// File upload related API calls
// ################################################################

export const uploadAPI = {
// Upload logo file
uploadLogo: async (file: File) => {
const formData = new FormData();
formData.append('logo', file);

const response = await api.put('/api/brands/logo', formData, { // Backend uses PUT /api/brands/logo
headers: {
'Content-Type': 'multipart/form-data',
},
});
return response.data;
},

// Upload general file - Note: Backend doesn't have this endpoint
uploadFile: async (file: File, type?: string) => {
throw new Error('General file upload endpoint not implemented in backend yet');
},
};

// ################## ----- PRINTFUL API FUNCTIONS ----- ##################
// Printful integration related API calls
// ################################################################

export const printfulAPI = {
// Get Printful categories
getCategories: async () => {
const response = await api.get('/api/products/printful/categories');
return response.data;
},

// Get Printful products by category
getProducts: async (categoryId?: number) => {
const url = categoryId 
? `/api/products/printful/catalog?categoryId=${categoryId}`
: '/api/products/printful/catalog';
const response = await api.get(url);
return response.data;
},

// Get specific Printful product details
getProduct: async (productId: number) => {
const response = await api.get(`/api/products/printful/catalog/${productId}`);
return response.data;
},

// Upload design file and generate mockups
generateMockup: async (mockupRequest: {
productId: number;
variantIds: number[];
artwork: File;
placementData: {
placement: string;
position?: {
area_width: number;
area_height: number;
width: number;
height: number;
top: number;
left: number;
};
};
}) => {
const formData = new FormData();
formData.append('artwork', mockupRequest.artwork);
formData.append('productId', mockupRequest.productId.toString());
formData.append('variantIds', JSON.stringify(mockupRequest.variantIds));
formData.append('placementData', JSON.stringify(mockupRequest.placementData));

const response = await api.post('/api/products/generate-mockup', formData, {
headers: {
'Content-Type': 'multipart/form-data',
},
});
return response.data;
},

// Get mockup generation status
getMockupStatus: async (taskKey: string) => {
const response = await api.get(`/api/products/mockup-status/${taskKey}`);
return response.data;
},
};

// ################## ----- PRODUCT API FUNCTIONS ----- ##################
// Product management related API calls (for user's custom products)
// ################################################################

export const productAPI = {
// Get all products for authenticated user
getAll: async () => {
const response = await api.get('/api/products');
return response.data;
},

// Get specific product by ID
getById: async (productId: string) => {
const response = await api.get(`/api/products/${productId}`);
return response.data;
},

// Create new product
create: async (productData: {
name: string;
description: string;
price: number;
brandId: string;
printfulProductId?: number;
printfulVariantId?: number;
designFileId?: number;
mockupImages?: string[];
}) => {
const response = await api.post('/api/products', productData);
return response.data;
},

// Create product with Printful integration
createPrintfulProduct: async (productData: {
brandId: string;
printfulProductId: number;
name: string;
description: string;
variants: Array<{
printfulVariantId: number;
retailPrice: string;
baseCost: string;
mockupUrl: string;
}>;
}) => {
const response = await api.post('/api/products', productData);
return response.data;
},

// Update existing product
update: async (productId: string, productData: any) => {
const response = await api.put(`/api/products/${productId}`, productData);
return response.data;
},

// Delete product
delete: async (productId: string) => {
const response = await api.delete(`/api/products/${productId}`);
return response.data;
},

// Check mockup generation status
checkMockupStatus: async (productId: string) => {
const response = await api.get(`/api/products/${productId}/mockup-status`);
return response.data;
},
};

// ################## ----- STORE API FUNCTIONS ----- ##################
// Public store access related API calls
// ################################################################

export const storeAPI = {
  // Get public store information
  // Get public store information (products + services)
getStore: async (storeUrl: string) => {
    const response = await api.get(`/api/stores/${storeUrl}`);
    const response = await api.get(`/api/store/${storeUrl}`);
return response.data;
},

  // Get all products from a store
  getStoreProducts: async (storeUrl: string) => {
    const response = await api.get(`/api/stores/${storeUrl}/products`);
  // Get specific product from a store
  getStoreProduct: async (storeUrl: string, productId: string) => {
    const response = await api.get(`/api/store/${storeUrl}/products/${productId}`);
return response.data;
},

  // Get specific product from a store
  getStoreProduct: async (storeUrl: string, productId: string) => {
    const response = await api.get(`/api/stores/${storeUrl}/products/${productId}`);
  // Get specific service from a store
  getStoreService: async (storeUrl: string, serviceId: string) => {
    const response = await api.get(`/api/store/${storeUrl}/services/${serviceId}`);
    return response.data;
  },
};

// ################## ----- SERVICE API FUNCTIONS ----- ##################
// Service management related API calls
// ################################################################

export const serviceAPI = {
  // Get all services for authenticated user's brand
  getAll: async () => {
    const response = await api.get('/api/services');
    return response.data;
  },

  // Get single service
  getById: async (id: string) => {
    const response = await api.get(`/api/services/${id}`);
    return response.data;
  },

  // Create a new service
  create: async (serviceData: {
    title: string;
    description: string;
    category: string;
    price: number;
    deliveryTime: string;
    revisions?: number;
    requirements?: string;
  }) => {
    const response = await api.post('/api/services', serviceData);
    return response.data;
  },

  // Update a service
  update: async (id: string, serviceData: any) => {
    const response = await api.put(`/api/services/${id}`, serviceData);
    return response.data;
  },

  // Delete a service
  delete: async (id: string) => {
    const response = await api.delete(`/api/services/${id}`);
    return response.data;
  },
};

// ################## ----- ORDER API FUNCTIONS ----- ##################
// Order management related API calls
// ################################################################

export const orderAPI = {
  // Get all orders for authenticated user's brand
  getAll: async (page?: number, status?: string) => {
    const params = new URLSearchParams();
    if (page) params.append('page', page.toString());
    if (status) params.append('status', status);
    const response = await api.get(`/api/orders?${params.toString()}`);
    return response.data;
  },

  // Get single order
  getById: async (orderId: string) => {
    const response = await api.get(`/api/orders/${orderId}`);
    return response.data;
  },

  // Update order fulfillment
  updateFulfillment: async (orderId: string, data: {
    fulfillmentStatus?: string;
    trackingNumber?: string;
    trackingUrl?: string;
  }) => {
    const response = await api.patch(`/api/orders/${orderId}/fulfillment`, data);
    return response.data;
  },

  // Get revenue metrics
  getMetrics: async () => {
    const response = await api.get('/api/orders/metrics');
    return response.data;
  },
};

// ################## ----- CHECKOUT API FUNCTIONS ----- ##################
// Checkout and payment related API calls
// ################################################################

export const checkoutAPI = {
  // Create a Stripe checkout session
  createSession: async (data: {
    items: Array<{
      name: string;
      unitPrice: number;
      quantity: number;
      variant?: { size?: string; color?: string };
      mockupUrl?: string;
      itemType: 'product' | 'service';
    }>;
    brandId: string;
    buyer: { name: string; email: string };
  }) => {
    const response = await api.post('/api/checkout/create-session', data);
    return response.data;
  },

  // Get checkout session status
  getSessionStatus: async (sessionId: string) => {
    const response = await api.get(`/api/checkout/session/${sessionId}`);
return response.data;
},
};
