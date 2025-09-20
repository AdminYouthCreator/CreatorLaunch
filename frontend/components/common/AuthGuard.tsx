import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuthContext } from '../../context/AuthContext';

// ################## ----- AUTH GUARD COMPONENT ----- ##################
// Protects routes by checking authentication status
// Redirects unauthenticated users to login page
// ################################################################

interface AuthGuardProps {
  children: React.ReactNode;
  redirectTo?: string;
  requireAuth?: boolean;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ 
  children, 
  redirectTo = '/auth/login', 
  requireAuth = true 
}) => {
  const { user, loading } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (requireAuth && !user) {
        // User is not authenticated, redirect to login
        const currentPath = router.asPath;
        const redirectUrl = redirectTo + (currentPath !== '/' ? `?redirect=${encodeURIComponent(currentPath)}` : '');
        router.push(redirectUrl);
      } else if (!requireAuth && user) {
        // User is authenticated but accessing a public route (like login), redirect to dashboard
        router.push('/dashboard');
      }
    }
  }, [user, loading, router, redirectTo, requireAuth]);

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show content only if authentication requirements are met
  if (requireAuth && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  if (!requireAuth && user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600">Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthGuard;
