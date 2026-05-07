import React, { createContext, useState, ReactNode, useEffect } from 'react';

interface Admin {
  id: string;
  email: string;
  name: string;
  role: 'Admin';
  permissions: string[];
}

interface AdminAuthContextType {
  admin: Admin | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  hasPermission: (permission: string) => boolean;
  getAdminToken: () => string | null;
  refreshAdminToken: () => Promise<string | null>;
}

export const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

const adminPermissions = [
  'users.read',
  'users.write',
  'users.delete',
  'stores.read',
  'stores.write',
  'analytics.read',
  'settings.read',
  'settings.write',
  'invites.read',
  'invites.write',
];

const saveAdminToken = (token: string) => {
  localStorage.setItem('admin_token', token);

  // Also save as normal token so shared auth utilities stay consistent.
  localStorage.setItem('token', token);
};

const clearAdminToken = () => {
  localStorage.removeItem('admin_token');
};

export const AdminAuthProvider = ({ children }: { children: ReactNode }) => {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAdminSession();
  }, []);

  const getAdminToken = () => {
    if (typeof window === 'undefined') return null;

    return localStorage.getItem('admin_token') || localStorage.getItem('token');
  };

  const normalizeAdmin = (user: any): Admin => {
    return {
      id: user.id || user._id,
      email: user.email,
      name: user.username || user.name || user.email,
      role: 'Admin',
      permissions: adminPermissions,
    };
  };

  const refreshAdminToken = async (): Promise<string | null> => {
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
      console.error('Failed to refresh admin token:', error);
      clearAdminToken();
      return null;
    }
  };

  const fetchAdminProfile = async (token: string) => {
    return fetch(`${API_BASE_URL}/api/auth/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      credentials: 'include',
    });
  };

  const checkAdminSession = async () => {
    try {
      if (typeof window === 'undefined') return;

      let token = getAdminToken();

      if (!token) {
        setAdmin(null);
        return;
      }

      let response = await fetchAdminProfile(token);

      // Access tokens can expire. Try refreshing once before forcing login.
      if (response.status === 401 || response.status === 403) {
        token = await refreshAdminToken();

        if (!token) {
          setAdmin(null);
          return;
        }

        response = await fetchAdminProfile(token);
      }

      if (!response.ok) {
        clearAdminToken();
        setAdmin(null);
        return;
      }

      const data = await response.json();

      if (data.user?.role !== 'Admin') {
        clearAdminToken();
        setAdmin(null);
        return;
      }

      setAdmin(normalizeAdmin(data.user));
    } catch (error) {
      console.error('Failed to check admin session:', error);
      clearAdminToken();
      setAdmin(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);

      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          identifier: email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.accessToken) {
        return false;
      }

      if (data.user?.role !== 'Admin') {
        return false;
      }

      saveAdminToken(data.accessToken);
      setAdmin(normalizeAdmin(data.user));

      return true;
    } catch (error) {
      console.error('Admin login failed:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setAdmin(null);

    if (typeof window !== 'undefined') {
      clearAdminToken();
    }
  };

  const hasPermission = (permission: string): boolean => {
    return admin?.permissions.includes(permission) || false;
  };

  return (
    <AdminAuthContext.Provider
      value={{
        admin,
        isAuthenticated: !!admin,
        isLoading,
        login,
        logout,
        hasPermission,
        getAdminToken,
        refreshAdminToken,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};
