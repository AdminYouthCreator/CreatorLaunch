const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

const getAdminToken = () => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('admin_token');
};

const adminRequest = async (path: string, options: RequestInit = {}) => {
  const token = getAdminToken();

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...(options.headers || {}),
    },
  });

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
