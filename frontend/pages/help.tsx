import React from 'react';
import Layout from '@/components/common/Layout';

// ################## ----- HELP PAGE COMPONENT ----- ##################
// Support and FAQ page for CreatorLaunch users
// Provides help resources and contact information
// ############################################################
const Help: React.FC = () => {
  return (
    <Layout title="Help & Support | CreatorLaunch">
      <div className="min-h-screen bg-light">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-dark mb-4">Help & Support</h1>
              <p className="text-lg text-medium">
                Find answers to common questions and get help with your CreatorLaunch store
              </p>
            </div>

            {/* Quick Help Cards */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-dark mb-2">Getting Started Guide</h3>
                <p className="text-medium text-sm mb-4">
                  Learn the basics of setting up your store and adding products
                </p>
                <button className="text-primary font-medium text-sm hover:text-red-600 transition-colors">
                  Read Guide →
                </button>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-dark mb-2">FAQs</h3>
                <p className="text-medium text-sm mb-4">
                  Frequently asked questions about stores, products, and payments
                </p>
                <button className="text-primary font-medium text-sm hover:text-red-600 transition-colors">
                  View FAQs →
                </button>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-dark mb-2">Contact Support</h3>
                <p className="text-medium text-sm mb-4">
                  Get personalized help from our support team
                </p>
                <button className="text-primary font-medium text-sm hover:text-red-600 transition-colors">
                  Contact Us →
                </button>
              </div>
            </div>

            {/* Common Questions */}
            <div className="bg-white rounded-lg shadow-sm p-8">
              <h2 className="text-2xl font-bold text-dark mb-6">Common Questions</h2>
              
              <div className="space-y-6">
                <div className="border-b border-gray-200 pb-6">
                  <h3 className="text-lg font-semibold text-dark mb-2">
                    How do I add products to my store?
                  </h3>
                  <p className="text-medium">
                    Go to your dashboard and click "Add Product" in the Getting Started section, or navigate to Products → Add New Product. Fill in your product details, upload images, and set your price.
                  </p>
                </div>

                <div className="border-b border-gray-200 pb-6">
                  <h3 className="text-lg font-semibold text-dark mb-2">
                    Can I change my store URL after creating it?
                  </h3>
                  <p className="text-medium">
                    Currently, store URLs cannot be changed after creation to maintain consistency for your customers. Choose carefully during the onboarding process.
                  </p>
                </div>

                <div className="border-b border-gray-200 pb-6">
                  <h3 className="text-lg font-semibold text-dark mb-2">
                    How do customers pay for products?
                  </h3>
                  <p className="text-medium">
                    CreatorLaunch integrates with secure payment processors to handle all transactions. Customers can pay with credit cards, debit cards, and other popular payment methods.
                  </p>
                </div>

                <div className="border-b border-gray-200 pb-6">
                  <h3 className="text-lg font-semibold text-dark mb-2">
                    What happens after I make a sale?
                  </h3>
                  <p className="text-medium">
                    You'll receive an email notification and the sale will appear in your dashboard. You'll then need to fulfill the order (ship physical products or deliver digital products) according to your store policies.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-dark mb-2">
                    How do I customize my store's appearance?
                  </h3>
                  <p className="text-medium">
                    You can update your store's logo, description, and colors from your dashboard. More advanced customization options are available in the Store Settings section.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Help;
