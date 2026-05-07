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

export const AdminAuthProvider = ({ children }: { children: ReactNode }) => {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAdminSession();
  }, []);

  const getAdminToken = () => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('admin_token');
  };

  const checkAdminSession = async () => {
    try {
      if (typeof window === 'undefined') return;

      const token = localStorage.getItem('admin_token');

      if (!token) {
        setAdmin(null);
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/auth/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        localStorage.removeItem('admin_token');
        setAdmin(null);
        return;
      }

      const data = await response.json();

      if (data.user?.role !== 'Admin') {
        localStorage.removeItem('admin_token');
        setAdmin(null);
        return;
      }

      setAdmin({
        id: data.user.id,
        email: data.user.email,
        name: data.user.username || data.user.email,
        role: 'Admin',
        permissions: adminPermissions,
      });
    } catch (error) {
      console.error('Failed to check admin session:', error);
      localStorage.removeItem('admin_token');
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

      localStorage.setItem('admin_token', data.accessToken);

      setAdmin({
        id: data.user.id,
        email: data.user.email,
        name: data.user.username || data.user.email,
        role: 'Admin',
        permissions: adminPermissions,
      });

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
      localStorage.removeItem('admin_token');
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
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};
