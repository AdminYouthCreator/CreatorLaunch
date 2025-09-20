import React from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/common/Layout';
import { useAuth } from '@/hooks/useAuth';

const RestartOnboarding: React.FC = () => {
  const router = useRouter();
  const { user } = useAuth();

  const handleRestart = () => {
    // Clear any existing onboarding data
    localStorage.removeItem('onboarding-progress');
    router.push('/onboarding');
  };

  const handleCancel = () => {
    router.push('/dashboard');
  };

  return (
    <Layout title="Restart Brand Setup | CreatorLaunch">
      <div className="min-h-screen bg-light flex items-center justify-center">
        <div className="max-w-md w-full mx-4">
          <div className="bg-white rounded-lg shadow-xl p-8 text-center">
            {/* Warning Icon */}
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>

            <h1 className="text-2xl font-bold text-dark mb-4">
              Restart Brand Setup?
            </h1>
            
            <p className="text-medium mb-6">
              This will clear your current brand settings and start the setup process from the beginning. 
              You'll need to choose a new store URL and re-enter your brand information.
            </p>

            <div className="bg-orange-50 p-4 rounded-lg mb-6 text-left">
              <h3 className="font-semibold text-dark mb-2">⚠️ What will be reset:</h3>
              <ul className="space-y-1 text-sm text-medium">
                <li>• Store URL/subdomain</li>
                <li>• Brand description</li>
                <li>• Logo (if uploaded)</li>
                <li>• Any saved progress</li>
              </ul>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleRestart}
                className="w-full bg-orange-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-orange-600 transition-colors duration-200"
              >
                Yes, Restart Setup
              </button>
              
              <button
                onClick={handleCancel}
                className="w-full bg-gray-200 text-dark py-3 px-6 rounded-lg font-semibold hover:bg-gray-300 transition-colors duration-200"
              >
                Keep Current Settings
              </button>
            </div>

            <p className="text-xs text-medium mt-4">
              You can always update your brand settings later from your dashboard.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default RestartOnboarding;
