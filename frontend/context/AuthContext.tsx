import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authAPI } from '../utils/api';

interface User {
  id?: string;
  name?: string;
  email: string;
  role?: string;
  hasCompletedOnboarding?: boolean;
  brandName?: string;
  storeUrl?: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  dob?: string;
  guardianEmail?: string;
  inviteCode?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  refreshToken: () => Promise<void>;
  refreshBrandData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const loadBrandStatus = async (token: string) => {
    let hasCompletedOnboarding = false;
    let brandName = undefined;
    let storeUrl = undefined;

    try {
      const brandResponse = await fetch(`${API_BASE_URL}/api/brands`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (brandResponse.status === 200) {
        hasCompletedOnboarding = true;
        const brandData = await brandResponse.json();
        brandName = brandData.brandName;
        storeUrl = `${brandData.subdomain}.${process.env.NEXT_PUBLIC_BASE_DOMAIN || 'youthcreatorlaunch.org'}`;
      }
    } catch (brandError) {
      hasCompletedOnboarding = false;
    }

    return {
      hasCompletedOnboarding,
      brandName,
      storeUrl,
    };
  };

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token');

      if (!token) {
        setLoading(false);
        return;
      }

      const response = await authAPI.getProfile();
      const brandStatus = await loadBrandStatus(token);

      const userObject = {
        id: response.user.id,
        name: response.user.username,
        email: response.user.email,
        role: response.user.role,
        ...brandStatus,
      };

      setUser(userObject);
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await authAPI.login(email, password);

      if (!response.accessToken) {
        throw new Error('No token received from server');
      }

      localStorage.setItem('token', response.accessToken);

      try {
        const profileResponse = await authAPI.getProfile();
        const brandStatus = await loadBrandStatus(response.accessToken);

        const userObject = {
          id: profileResponse.user.id,
          name: profileResponse.user.username,
          email: profileResponse.user.email,
          role: profileResponse.user.role,
          ...brandStatus,
        };

        localStorage.setItem('user', JSON.stringify(userObject));
        setUser(userObject);
      } catch (profileError) {
        const userObject = {
          email,
          name: email.split('@')[0],
          id: response.userId || 'unknown',
          hasCompletedOnboarding: false,
        };

        localStorage.setItem('user', JSON.stringify(userObject));
        setUser(userObject);
      }
    } catch (error: any) {
      console.error('Login failed:', error);
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  };

  const register = async (data: RegisterData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: data.name,
          email: data.email,
          password: data.password,
          dob: data.dob,
          parentEmail: data.guardianEmail,
          parentalConsent: !!data.guardianEmail,
          inviteCode: data.inviteCode,
        }),
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(result.message || result.errors?.[0]?.msg || 'Registration failed');
      }

      if (!result.message) {
        throw new Error('Registration response invalid');
      }
    } catch (error: any) {
      console.error('Registration failed:', error);
      throw new Error(error.message || 'Registration failed');
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout API call failed:', error);
    }

    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const refreshToken = async () => {
    try {
      const response = await authAPI.refreshToken();
      localStorage.setItem('token', response.accessToken || response.token);
    } catch (error) {
      await logout();
      throw error;
    }
  };

  const refreshBrandData = async () => {
    try {
      const token = localStorage.getItem('token');

      if (!token || !user) return;

      const brandStatus = await loadBrandStatus(token);

      if (brandStatus.hasCompletedOnboarding) {
        const updatedUser = {
          ...user,
          ...brandStatus,
        };

        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
    } catch (error) {
      console.error('Failed to refresh brand data:', error);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (user) {
      const refreshInterval = setInterval(() => {
        refreshToken().catch(() => {});
      }, 14 * 60 * 1000);

      return () => clearInterval(refreshInterval);
    }
  }, [user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        checkAuth,
        refreshToken,
        refreshBrandData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = (): AuthContextType => {
  const ctx = useContext(AuthContext);

  if (!ctx) {
    throw new Error('useAuthContext must be used within AuthProvider');
  }

  return ctx;
};
