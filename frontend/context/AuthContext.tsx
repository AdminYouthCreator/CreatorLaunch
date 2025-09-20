import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authAPI } from '../utils/api';

// ################## ----- USER INTERFACE ----- ##################
// Defines the structure of user data throughout the app
// Contains auth status and onboarding progress info
// ############################################################
interface User {
  id?: string;
  name?: string;
  email: string;
  hasCompletedOnboarding?: boolean;
  brandName?: string;
  storeUrl?: string;
}

// ################## ----- REGISTER DATA INTERFACE ----- ##################
// Data structure for user registration
// Includes optional fields for minor consent handling
// ####################################################################
interface RegisterData {
  name: string;
  email: string;
  password: string;
  dob?: string; 
  guardianEmail?: string; // Required if user is under 18
}

// ################## ----- AUTH CONTEXT TYPE ----- ##################
// Context interface defining all authentication methods
// Provides login, register, logout, and user state
// ################################################################
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

// ################## ----- AUTH PROVIDER ----- ##################
// Main authentication provider component
// Manages user state and authentication methods
// ##########################################################
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // ################## ----- CHECK AUTHENTICATION ----- ##################
  // Check if user is authenticated on app load
  // Validates stored token and gets user profile
  // ################################################################
  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await authAPI.getProfile();
      
      // Check if user has completed onboarding by checking if they have a brand
      let hasCompletedOnboarding = false;
      let brandName = undefined;
      let storeUrl = undefined;
      
      try {
        // Try to fetch user's brand to determine onboarding status
        const brandResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}/api/brands`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        
        console.log('Brand check response status:', brandResponse.status);
        
        // If we get a 200 response, user has a brand (completed onboarding)
        if (brandResponse.status === 200) {
          hasCompletedOnboarding = true;
          const brandData = await brandResponse.json();
          brandName = brandData.brandName;
          storeUrl = `${brandData.subdomain}.${process.env.NEXT_PUBLIC_BASE_DOMAIN || 'youthcreatorlaunch.org'}`;
        }
        
        console.log('Has completed onboarding:', hasCompletedOnboarding);
        console.log('Brand name:', brandName);
      } catch (brandError) {
        console.log('Could not fetch brand data, assuming onboarding not completed');
        hasCompletedOnboarding = false;
      }
      
      const userObject = {
        id: response.user.id,
        name: response.user.username,
        email: response.user.email,
        hasCompletedOnboarding,
        brandName,
        storeUrl
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

  // ################## ----- LOGIN METHOD ----- ##################
  // Handles user login with email and password
  // Stores token and user data in localStorage
  // #########################################################
  const login = async (email: string, password: string) => {
    try {
      const response = await authAPI.login(email, password);
      
      if (response.accessToken) {
        localStorage.setItem('token', response.accessToken);
        
        // After login, get the full user profile to check onboarding status
        try {
          const profileResponse = await authAPI.getProfile();
          
          // Check if user has completed onboarding by checking if they have a brand
          let hasCompletedOnboarding = false;
          let brandName = undefined;
          let storeUrl = undefined;
          
          try {
            const brandResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}/api/brands`, {
              headers: {
                'Authorization': `Bearer ${response.accessToken}`,
                'Content-Type': 'application/json',
              },
            });
            
            console.log('Login brand check response status:', brandResponse.status);
            
            // If we get a 200 response, user has a brand (completed onboarding)
            if (brandResponse.status === 200) {
              hasCompletedOnboarding = true;
              const brandData = await brandResponse.json();
              brandName = brandData.brandName;
              storeUrl = `${brandData.subdomain}.${process.env.NEXT_PUBLIC_BASE_DOMAIN || 'youthcreatorlaunch.org'}`;
            }
            
            console.log('Login - Has completed onboarding:', hasCompletedOnboarding);
            console.log('Login - Brand name:', brandName);
          } catch (brandError) {
            console.log('Could not fetch brand data, assuming onboarding not completed');
            hasCompletedOnboarding = false;
          }
          
          const userObject = {
            id: profileResponse.user.id,
            name: profileResponse.user.username,
            email: profileResponse.user.email,
            hasCompletedOnboarding,
            brandName,
            storeUrl
          };
          localStorage.setItem('user', JSON.stringify(userObject));
          setUser(userObject);
        } catch (profileError) {
          // Fallback if profile fetch fails
          const userObject = {
            email: email,
            name: email.split('@')[0],
            id: response.userId || 'unknown',
            hasCompletedOnboarding: false
          };
          localStorage.setItem('user', JSON.stringify(userObject));
          setUser(userObject);
        }
      } else {
        throw new Error('No token received from server');
      }
    } catch (error: any) {
      console.error('Login failed:', error);
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  };

  // ################## ----- REGISTER METHOD ----- ##################
  // Handles new user registration
  // Validates age and handles guardian consent
  // ############################################################
  const register = async (data: RegisterData) => {
    try {
      const response = await authAPI.register(data);
      
      // Backend registration doesn't automatically log in user due to email verification
      // So we don't set user state here, just return success
      if (response.message) {
        // Registration successful, but user needs to verify email
        return;
      } else {
        throw new Error('Registration response invalid');
      }
    } catch (error: any) {
      console.error('Registration failed:', error);
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  };

  // ################## ----- LOGOUT METHOD ----- ##################
  // Handles user logout and session cleanup
  // Clears user state and invalidates server session
  // #########################################################
  const logout = async () => {
    console.log('AuthContext logout called');
    try {
      console.log('Calling logout API...');
      await authAPI.logout();
      console.log('Logout API successful');
    } catch (error) {
      console.error('Logout API call failed:', error);
    }
    
    console.log('Clearing local storage and user state...');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    console.log('Logout complete');
  };

  // ################## ----- REFRESH TOKEN METHOD ----- ##################
  // Handles token refresh for maintaining user sessions
  // Called automatically by axios interceptor when token expires
  // ################################################################
  const refreshToken = async () => {
    try {
      console.log('Refreshing token...');
      const response = await authAPI.refreshToken();
      localStorage.setItem('token', response.accessToken || response.token);
      console.log('Token refreshed successfully');
    } catch (error) {
      console.error('Token refresh failed:', error);
      // If refresh fails, logout user
      await logout();
      throw error;
    }
  };

  // ################## ----- REFRESH BRAND DATA METHOD ----- ##################
  // Refreshes user's brand information after onboarding completion
  // Can be called to update brand name and store URL in user context
  // ########################################################################
  const refreshBrandData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token || !user) return;

      const brandResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}/api/brands`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (brandResponse.status === 200) {
        const brandData = await brandResponse.json();
        const updatedUser = {
          ...user,
          hasCompletedOnboarding: true,
          brandName: brandData.brandName,
          storeUrl: `${brandData.subdomain}.${process.env.NEXT_PUBLIC_BASE_DOMAIN || 'youthcreatorlaunch.org'}`
        };
        
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        console.log('Brand data refreshed:', brandData.brandName);
      }
    } catch (error) {
      console.error('Failed to refresh brand data:', error);
    }
  };

  // Check authentication on component mount
  useEffect(() => {
    checkAuth();
  }, []);

  // Setup token refresh interval (every 14 minutes - before 15min expiry)
  useEffect(() => {
    if (user) {
      const refreshInterval = setInterval(() => {
        refreshToken().catch(() => {
          // Refresh failed, user will be logged out by the refreshToken function
        });
      }, 14 * 60 * 1000); // 14 minutes

      return () => clearInterval(refreshInterval);
    }
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, checkAuth, refreshToken, refreshBrandData }}>
      {children}
    </AuthContext.Provider>
  );
};

// custom hook to consume AuthContext
export const useAuthContext = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuthContext must be used within AuthProvider');
  }
  return ctx;
};
