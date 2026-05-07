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

  // If the access token expired, refresh once and retry.
  if (response.status === 401 || response.status === 403) {
    token = await refreshAdminToken();

    if (token) {
      response = await runRequest(token);
    }
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || 'Admin request failed.');
  }

  return data;
};

export const adminAPI = {
  // ################## ----- OVERVIEW / DATA ----- ##################

  getOverview: async () => {
    return adminRequest('/api/admin/overview');
  },

  getUsers: async () => {
    return adminRequest('/api/admin/users');
  },

  getStores: async () => {
    return adminRequest('/api/admin/stores');
  },

  getAnalytics: async (range = '30d') => {
    return adminRequest(`/api/admin/analytics?range=${encodeURIComponent(range)}`);
  },

  // ################## ----- INVITES ----- ##################

  getInvites: async () => {
    return adminRequest('/api/invites');
  },

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

  // ################## ----- USER MODERATION ----- ##################

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

  // ################## ----- STORE MODERATION ----- ##################

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

  // ################## ----- PRODUCT / SERVICE MODERATION ----- ##################

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

  // ################## ----- AUDIT LOGS ----- ##################

  getAuditLogs: async (limit = 100) => {
    return adminRequest(`/api/admin/moderation/audit-logs?limit=${encodeURIComponent(limit)}`);
  },
};
