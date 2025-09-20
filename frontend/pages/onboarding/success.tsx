import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/common/Layout';
import { useAuthContext } from '@/context/AuthContext';

const OnboardingSuccess: React.FC = () => {
  const router = useRouter();
  const { user, refreshBrandData } = useAuthContext();

  useEffect(() => {
    // Refresh brand data when component mounts to get latest info
    refreshBrandData();
    
    // Auto-redirect to dashboard after 5 seconds
    const timer = setTimeout(() => {
      router.push('/dashboard');
    }, 5000);

    return () => clearTimeout(timer);
  }, [router, refreshBrandData]);

  const handleContinue = () => {
    router.push('/dashboard');
  };

  return (
    <Layout title="Welcome to CreatorLaunch! | Brand Setup Complete">
      <div className="min-h-screen bg-light flex items-center justify-center">
        <div className="max-w-md w-full mx-4">
          <div className="bg-white rounded-lg shadow-xl p-8 text-center">
            {/* Success Icon */}
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>

            {/* Success Message */}
            <h1 className="text-2xl font-bold text-dark mb-4">
              🎉 Congratulations!
            </h1>
            
            <p className="text-medium text-lg mb-6">
              Your brand setup is complete and your store is ready to launch! Complete the getting started tasks to make your first sale.
            </p>

            {/* Brand Summary */}
            <div className="bg-light p-4 rounded-lg mb-6 text-left">
              <h3 className="font-semibold text-dark mb-2">What you've set up:</h3>
              <ul className="space-y-1 text-sm text-medium">
                <li>✓ Store URL: {user?.storeUrl || 'your-store.youthcreatorlaunch.org'}</li>
                <li>✓ Brand description</li>
                <li>✓ Logo (uploaded or will design later)</li>
              </ul>
            </div>

            {/* Next Steps */}
            <div className="bg-accent/10 p-4 rounded-lg mb-6 text-left">
              <h3 className="font-semibold text-dark mb-2">Next steps:</h3>
              <ul className="space-y-1 text-sm text-medium">
                <li>• Add your first products</li>
                <li>• Customize your store design</li>
                <li>• Share your store with friends</li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleContinue}
                className="w-full bg-primary text-white py-3 px-6 rounded-lg font-semibold hover:bg-red-600 transition-colors duration-200"
              >
                Go to Dashboard
              </button>
              
              <p className="text-xs text-medium">
                Redirecting automatically in 5 seconds...
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default OnboardingSuccess;
