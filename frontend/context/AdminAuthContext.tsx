import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

// ################## ----- ADMIN INTERFACE ----- ##################
// Defines the structure of admin user data
// Contains admin permissions and access levels
// ############################################################
interface Admin {
  id: string;
  email: string;
  name: string;
  role: 'super_admin' | 'admin' | 'moderator';
  permissions: string[];
  lastLogin?: Date;
}

// ################## ----- ADMIN AUTH CONTEXT TYPE ----- ##################
// Context interface defining all admin authentication methods
// Provides admin login, logout, and permission checking
// ####################################################################
interface AdminAuthContextType {
  admin: Admin | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  hasPermission: (permission: string) => boolean;
}

export const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

// ################## ----- ADMIN AUTH PROVIDER ----- ##################
// Main admin authentication provider component
// Manages admin state and authentication methods
// ##########################################################
export const AdminAuthProvider = ({ children }: { children: ReactNode }) => {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing admin session on mount
    checkAdminSession();
  }, []);

  const checkAdminSession = async () => {
    try {
      // Only access localStorage on client-side
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('admin_token');
        if (token) {
          // In a real app, verify token with backend
          // For now, we'll use mock data
          const mockAdmin: Admin = {
            id: '1',
            email: 'admin@youthcreator.com',
            name: 'Admin User',
            role: 'super_admin',
            permissions: ['users.read', 'users.write', 'users.delete', 'stores.read', 'stores.write', 'analytics.read']
          };
          setAdmin(mockAdmin);
        }
      }
    } catch (error) {
      console.error('Failed to check admin session:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // Mock authentication - replace with real API call
      if (email === 'admin@youthcreator.com' && password === 'admin123') {
        const mockAdmin: Admin = {
          id: '1',
          email: 'admin@youthcreator.com',
          name: 'Admin User',
          role: 'super_admin',
          permissions: ['users.read', 'users.write', 'users.delete', 'stores.read', 'stores.write', 'analytics.read'],
          lastLogin: new Date()
        };
        
        setAdmin(mockAdmin);
        if (typeof window !== 'undefined') {
          localStorage.setItem('admin_token', 'mock_admin_token');
        }
        return true;
      }
      
      return false;
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

  const value: AdminAuthContextType = {
    admin,
    isAuthenticated: !!admin,
    isLoading,
    login,
    logout,
    hasPermission
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
};
