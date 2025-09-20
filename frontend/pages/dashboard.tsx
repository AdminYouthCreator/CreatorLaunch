import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/common/Layout';
import AuthGuard from '@/components/common/AuthGuard';
import { useAuth } from '@/hooks/useAuth';
import { GettingStarted, PolicyNotificationWidget } from '@/components/dashboard';

// ################## ----- DASHBOARD COMPONENT ----- ##################
// Main dashboard page for authenticated users
// Shows getting started tasks and account overview
// ################################################################
const Dashboard: React.FC = () => {
  const { user, loading } = useAuth();
  const router = useRouter();

  // Redirect to onboarding if user hasn't completed it
  useEffect(() => {
    if (!loading && user && !user.hasCompletedOnboarding) {
      router.push('/onboarding');
    }
  }, [user, loading, router]);

  // ################## ----- TASK COMPLETION HANDLER ----- ##################
  // Handles when users complete onboarding or setup tasks
  // Will integrate with backend to track progress
  // ####################################################################
  const handleTaskComplete = (taskId: string) => {
    console.log('Task completed:', taskId);
    // TODO: Update task completion status in backend
  };

  return (
    <AuthGuard>
      <Layout title="Dashboard | CreatorLaunch">
        <div className="min-h-screen bg-light">
          <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
              {/* Welcome Header */}
              <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
                <h1 className="text-3xl font-bold text-dark mb-2">
                  Welcome to your dashboard{user?.name ? `, ${user.name}` : ''}!
                </h1>
                <p className="text-medium">
                  Your brand is now set up and ready to go. Complete the tasks below to get started.
                </p>
              </div>

            {/* Policy Notification Widget */}
            <div className="mb-8">
              <PolicyNotificationWidget />
            </div>

            {/* Getting Started Widget */}
            <GettingStarted 
              onTaskComplete={handleTaskComplete}
              className="mb-8"
            />

            {/* Quick Actions */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M8 11v6h8v-6M8 11H6a2 2 0 00-2 2v6a2 2 0 002 2h12a2 2 0 002-2v-6a2 2 0 00-2-2h-2" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-dark mb-2">Customize Your Store</h3>
                <p className="text-medium text-sm mb-4">
                  Add products, update your branding, and make your store uniquely yours.
                </p>
                <button className="text-primary font-medium text-sm hover:text-red-600 transition-colors">
                  Get Started →
                </button>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-dark mb-2">View Analytics</h3>
                <p className="text-medium text-sm mb-4">
                  Track your store's performance, visitor stats, and sales data.
                </p>
                <button className="text-primary font-medium text-sm hover:text-red-600 transition-colors">
                  View Reports →
                </button>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-dark mb-2">Learn & Grow</h3>
                <p className="text-medium text-sm mb-4">
                  Access workshops, tutorials, and resources to grow your business.
                </p>
                <button className="text-primary font-medium text-sm hover:text-red-600 transition-colors">
                  Explore →
                </button>
              </div>
            </div>

            {/* Store Preview */}
            <div className="bg-white rounded-lg shadow-sm p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-dark mb-2">Your Store Preview</h2>
                  <p className="text-medium">
                    Here's how your store looks to visitors
                  </p>
                </div>
                <button className="bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-red-600 transition-colors">
                  Visit Store
                </button>
              </div>

              <div className="border-2 border-gray-200 rounded-lg p-8 bg-gray-50">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gray-300 rounded-full mx-auto mb-4"></div>
                  <h3 className="text-lg font-semibold text-dark mb-2">
                    {user?.brandName || 'Your Brand Name'}
                  </h3>
                  <p className="text-medium mb-4">
                    Your brand description will appear here
                  </p>
                  <p className="text-sm text-gray-500">
                    URL: {user?.storeUrl || 'your-brand.youthcreatorlaunch.org'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
    </AuthGuard>
  );
};

export default Dashboard;
