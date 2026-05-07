import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import StoreLayout from '@/components/store/StoreLayout';
import { checkoutAPI } from '@/utils/api';

const CheckoutSuccessPage: React.FC = () => {
  const router = useRouter();
  const { session_id } = router.query;

  const [status, setStatus] = useState<'loading' | 'success' | 'pending'>('loading');
  const [email, setEmail] = useState('');

  useEffect(() => {
    if (!router.isReady) return;

    if (!session_id || typeof session_id !== 'string') {
      setStatus('pending');
      return;
    }

    checkoutAPI
      .getSessionStatus(session_id)
      .then((data) => {
        if (data.status === 'paid') {
          setStatus('success');
          setEmail(data.customerEmail || '');
        } else {
          setStatus('pending');
        }
      })
      .catch(() => {
        setStatus('pending');
      });
  }, [router.isReady, session_id]);

  return (
    <StoreLayout title="Order Status | CreatorLaunch">
      <div className="min-h-screen bg-light flex items-center justify-center">
        <div className="max-w-md mx-auto text-center px-4">
          {status === 'loading' ? (
            <>
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-medium">Checking order status...</p>
            </>
          ) : (
            <>
              <div
                className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${
                  status === 'success' ? 'bg-green-100' : 'bg-yellow-100'
                }`}
              >
                {status === 'success' ? (
                  <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-10 h-10 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01" />
                  </svg>
                )}
              </div>

              <h1 className="text-3xl font-bold text-dark mb-3">
                {status === 'success' ? 'Order Confirmed!' : 'Order Status'}
              </h1>

              <p className="text-medium mb-2">
                {status === 'success'
                  ? 'Thank you for your purchase. Your order has been placed successfully.'
                  : 'No completed payment session was found on this page. If you just paid through Stripe, your confirmation may still be processing.'}
              </p>

              {email && (
                <p className="text-sm text-medium mb-6">
                  A confirmation email will be sent to <strong>{email}</strong>.
                </p>
              )}

              <div className="flex flex-col gap-3 mt-6">
                <Link
                  href="/"
                  className="inline-block bg-primary text-white px-8 py-3 rounded-lg font-medium hover:bg-red-600 transition-colors"
                >
                  Go Home
                </Link>

                <Link
                  href="/checkout"
                  className="inline-block text-medium hover:text-dark transition-colors"
                >
                  Back to Checkout
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </StoreLayout>
  );
};

export default CheckoutSuccessPage;
