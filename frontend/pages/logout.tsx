import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuthContext } from '../context/AuthContext';
import Layout from '../components/common/Layout';

// ################## ----- LOGOUT PAGE ----- ##################
// Handles user logout and redirects to home page
// Clears authentication state and shows logout confirmation
// ##########################################################

const LogoutPage: React.FC = () => {
  const { logout } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    // Perform logout immediately when page loads
    const performLogout = async () => {
      try {
        await logout();
      } catch (error) {
        console.error('Logout failed:', error);
      }
      
      // Redirect to home page after logout
      const timer = setTimeout(() => {
        router.push('/');
      }, 2000);

      return () => clearTimeout(timer);
    };

    performLogout();
  }, [logout, router]);

  return (
    <Layout
      title="Logout | CreatorLaunch"
      description="You have been logged out successfully."
      showAnnouncement={false}
    >
      <section style={{ backgroundColor: '#F7F9FC', minHeight: '70vh' }} className="flex items-center justify-center py-20">
        <div className="max-w-md mx-auto px-6 text-center">
          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <div className="mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Logged Out Successfully</h2>
              <p className="text-gray-600 mb-6">
                You have been securely logged out of your CreatorLaunch account.
              </p>
            </div>

            <div className="space-y-4">
              <p className="text-sm text-gray-500">
                Redirecting you to the home page...
              </p>
              
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => router.push('/')}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Go to Home
                </button>
                <button
                  onClick={() => router.push('/auth/login')}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Login Again
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default LogoutPage;
