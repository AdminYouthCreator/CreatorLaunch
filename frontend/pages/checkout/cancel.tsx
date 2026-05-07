import React from 'react';
import Link from 'next/link';
import StoreLayout from '@/components/store/StoreLayout';

const CheckoutCancelPage: React.FC = () => {
  return (
    <StoreLayout title="Checkout Cancelled | CreatorLaunch">
      <div className="min-h-screen bg-light flex items-center justify-center">
        <div className="max-w-md mx-auto text-center px-4">
          <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>

          <h1 className="text-3xl font-bold text-dark mb-3">Checkout Cancelled</h1>

          <p className="text-medium mb-6">
            Your payment was not processed. Your cart items are still saved.
          </p>

          <div className="flex flex-col gap-3">
            <Link
              href="/checkout"
              className="inline-block bg-primary text-white px-8 py-3 rounded-lg font-medium hover:bg-red-600 transition-colors"
            >
              Try Again
            </Link>

            <Link
              href="/"
              className="inline-block text-medium hover:text-dark transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </StoreLayout>
  );
};

export default CheckoutCancelPage;
