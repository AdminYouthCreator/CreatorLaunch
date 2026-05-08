const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

const getAdminToken = () => {
  if (typeof window === 'undefined') return null;

  return localStorage.getItem('admin_token') || localStorage.getItem('token');
};

const saveAdminToken = (token: string) => {
  localStorage.setItem('admin_token', token);
  localStorage.setItem('token', token);
};

const clearAdminToken = () => {
  localStorage.removeItem('admin_token');
};

const refreshAdminToken = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/refresh-token`, {
      method: 'POST',
      credentials: 'include',
    });

    if (!response.ok) {
      clearAdminToken();
      return null;
    }

    const data = await response.json();
    const newToken = data.accessToken || data.token;

    if (!newToken) {
      clearAdminToken();
      return null;
    }

    saveAdminToken(newToken);
    return newToken;
  } catch (error) {
    console.error('Admin token refresh failed:', error);
    clearAdminToken();
    return null;
  }
};

const readResponseBody = async (response: Response) => {
  const contentType = response.headers.get('content-type') || '';

  if (contentType.includes('application/json')) {
    return response.json().catch(() => ({}));
  }

  const text = await response.text().catch(() => '');
  return { message: text || '' };
};

const adminRequest = async (path: string, options: RequestInit = {}) => {
  let token = getAdminToken();

  const runRequest = async (requestToken: string | null) => {
    return fetch(`${API_BASE_URL}${path}`, {
      ...options,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...(requestToken ? { Authorization: `Bearer ${requestToken}` } : {}),
        ...(options.headers || {}),
      },
    });
  };

  let response = await runRequest(token);

  if (response.status === 401 || response.status === 403) {
    token = await refreshAdminToken();

    if (token) {
      response = await runRequest(token);
    }
  }

  const data = await readResponseBody(response);

  if (!response.ok) {
    const message =
      data.message ||
      data.error ||
      `Admin request failed: ${response.status} ${response.statusText} at ${path}`;

    console.error('Admin API error:', {
      path,
      status: response.status,
      statusText: response.statusText,
      data,
    });

    throw new Error(message);
  }

  return data;
};


export const adminAPI = {
  getOverview: async () => adminRequest('/api/admin/overview'),
  getUsers: async () => adminRequest('/api/admin/users'),
  getStores: async () => adminRequest('/api/admin/stores'),
  getProducts: async () => adminRequest('/api/admin/products'),
  getServices: async () => adminRequest('/api/admin/services'),

  getAnalytics: async (range = '30d') => {
    return adminRequest(`/api/admin/analytics?range=${encodeURIComponent(range)}`);
  },

  getInvites: async () => adminRequest('/api/invites'),

  createInvite: async (payload: {
    email?: string;
    role?: 'Creator' | 'Admin';
    notes?: string;
    expiresInDays?: number;
  }) => {
    return adminRequest('/api/invites', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  revokeInvite: async (inviteId: string) => {
    return adminRequest(`/api/invites/${inviteId}/revoke`, {
      method: 'PATCH',
    });
  },

  updateUserStatus: async (
    userId: string,
    payload: {
      status: 'active' | 'pending_verification' | 'suspended' | 'banned' | 'locked';
      reason?: string;
    }
  ) => {
    return adminRequest(`/api/admin/moderation/users/${userId}/status`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
  },

  updateUserNotes: async (
    userId: string,
    payload: {
      adminNotes: string;
    }
  ) => {
    return adminRequest(`/api/admin/moderation/users/${userId}/notes`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
  },

  forceUserPasswordReset: async (
    userId: string,
    payload: {
      reason?: string;
    } = {}
  ) => {
    return adminRequest(`/api/admin/moderation/users/${userId}/force-password-reset`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
  },

  updateStoreStatus: async (
    brandId: string,
    payload: {
      status: 'active' | 'locked' | 'hidden' | 'suspended' | 'under_review';
      reason?: string;
    }
  ) => {
    return adminRequest(`/api/admin/moderation/stores/${brandId}/status`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
  },

  updateStoreNotes: async (
    brandId: string,
    payload: {
      adminNotes: string;
    }
  ) => {
    return adminRequest(`/api/admin/moderation/stores/${brandId}/notes`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
  },

  adminUpdateProduct: async (
    productId: string,
    payload: {
      name?: string;
      description?: string;
      price?: number;
      retailPrice?: number;
      status?: string;
      reason?: string;
    }
  ) => {
    return adminRequest(`/api/admin/moderation/products/${productId}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },

  adminUpdateService: async (
    serviceId: string,
    payload: {
      title?: string;
      description?: string;
      category?: string;
      price?: number;
      deliveryTime?: string;
      revisions?: number;
      requirements?: string;
      status?: string;
      reason?: string;
    }
  ) => {
    return adminRequest(`/api/admin/moderation/services/${serviceId}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },

  getAuditLogs: async (limit = 100) => {
    return adminRequest(`/api/admin/moderation/audit-logs?limit=${encodeURIComponent(limit)}`);
  },

  getBlogPosts: async () => {
    return adminRequest('/api/admin/blog');
  },

  getBlogPost: async (postId: string) => {
    return adminRequest(`/api/admin/blog/${postId}`);
  },

  createBlogPost: async (payload: any) => {
    return adminRequest('/api/admin/blog', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  updateBlogPost: async (postId: string, payload: any) => {
    return adminRequest(`/api/admin/blog/${postId}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },

  archiveBlogPost: async (postId: string, reason = '') => {
    return adminRequest(`/api/admin/blog/${postId}`, {
      method: 'DELETE',
      body: JSON.stringify({ reason }),

      getBlogPosts: async (sort = 'custom') => {
  return adminRequest(`/api/admin/blog?sort=${encodeURIComponent(sort)}`);
},

reorderBlogPosts: async (orderedIds: string[]) => {
  return adminRequest('/api/admin/blog/reorder', {
    method: 'PATCH',
    body: JSON.stringify({ orderedIds }),
  });
},
    });
  },
};
