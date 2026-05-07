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
};
