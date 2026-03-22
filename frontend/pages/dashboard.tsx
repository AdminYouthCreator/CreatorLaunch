import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/common/Layout';
import AuthGuard from '@/components/common/AuthGuard';
import { useAuth } from '@/hooks/useAuth';
import { GettingStarted, MetricsCards, PolicyNotificationWidget } from '@/components/dashboard';

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

            {/* Revenue Metrics */}
            <MetricsCards className="mb-8" />

            {/* Quick Actions */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <a href="/products" className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow block">
                <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-dark mb-2">Products</h3>
                <p className="text-medium text-sm">Manage your product catalog</p>
              </a>

              <a href="/services" className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow block">
                <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.193 23.193 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-dark mb-2">Services</h3>
                <p className="text-medium text-sm">Offer digital services</p>
              </a>

              <a href="/orders" className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow block">
                <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-dark mb-2">Orders</h3>
                <p className="text-medium text-sm">Track customer orders</p>
              </a>

              <a href="/store/share" className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow block">
                <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-dark mb-2">Share Store</h3>
                <p className="text-medium text-sm">Promote your store</p>
              </a>
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
