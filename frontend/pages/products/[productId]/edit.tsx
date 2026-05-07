import React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Layout from '@/components/common/Layout';

export default function EditProductPage() {
  const router = useRouter();
  const { productId } = router.query;

  return (
    <Layout title="Edit Product | CreatorLaunch">
      <div className="min-h-screen bg-light py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-sm p-8">
            <h1 className="text-3xl font-bold text-dark mb-4">Edit Product</h1>

            <p className="text-medium mb-4">
              Product editing is not fully built yet.
            </p>

            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-medium">
                Product ID:
              </p>
              <p className="font-mono text-sm text-dark break-all">
                {typeof productId === 'string' ? productId : 'Loading...'}
              </p>
            </div>

            <Link
              href="/products"
              className="inline-block bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-red-600 transition-colors"
            >
              Back to Products
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}
