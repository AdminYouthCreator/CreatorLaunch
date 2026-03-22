import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Layout from '@/components/common/Layout';
import { checkoutAPI } from '@/utils/api';

const CheckoutSuccessPage: React.FC = () => {
  const router = useRouter();
  const { session_id } = router.query;
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [email, setEmail] = useState('');

  useEffect(() => {
    if (!session_id || typeof session_id !== 'string') return;
    checkoutAPI.getSessionStatus(session_id)
      .then(data => {
        if (data.status === 'paid') {
          setStatus('success');
          setEmail(data.customerEmail || '');
        } else {
          setStatus('error');
        }
      })
      .catch(() => setStatus('success'));
  }, [session_id]);

  return (
    <Layout title="Order Confirmed | CreatorLaunch">
      <div className="min-h-screen bg-light flex items-center justify-center">
        <div className="max-w-md mx-auto text-center px-4">
          {status === 'loading' ? (
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          ) : (
            <>
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-dark mb-3">Order Confirmed!</h1>
              <p className="text-medium mb-2">
                Thank you for your purchase. Your order has been placed successfully.
              </p>
              {email && (
                <p className="text-sm text-medium mb-6">
                  A confirmation email will be sent to <strong>{email}</strong>.
                </p>
              )}
              <Link
                href="/"
                className="inline-block bg-primary text-white px-8 py-3 rounded-lg font-medium hover:bg-red-600 transition-colors"
              >
                Continue Shopping
              </Link>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default CheckoutSuccessPage;
