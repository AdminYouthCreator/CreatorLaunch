import React from 'react';
import Layout from '@/components/common/Layout';

export default function DonatePage() {
  return (
    <Layout title="Donate | CreatorLaunch">
      <div className="min-h-screen bg-light py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-sm p-8 text-center">
            <h1 className="text-3xl font-bold text-dark mb-4">Donate</h1>
            <p className="text-medium mb-6">
              Donation support is not set up yet. Please check back later.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
