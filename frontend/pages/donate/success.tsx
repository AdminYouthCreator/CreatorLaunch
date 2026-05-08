import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Header from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

const DonateSuccessPage: React.FC = () => {
  const router = useRouter();
  const { session_id } = router.query;

  const [donation, setDonation] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof session_id === 'string') {
      loadDonation(session_id);
    } else if (router.isReady) {
      setLoading(false);
    }
  }, [session_id, router.isReady]);

  const loadDonation = async (sessionId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/donations/session/${sessionId}`);
      const data = await response.json();

      if (response.ok) {
        setDonation(data.donation);
      }
    } catch (error) {
      console.error('Failed to load donation:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Thank You | CreatorLaunch</title>
      </Head>

      <Header />

      <main className="bg-light min-h-screen py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm p-8 text-center">
            <div className="text-5xl mb-4">🎉</div>

            <h1 className="text-4xl font-bold text-dark mb-4">
              Thank You for Supporting CreatorLaunch!
            </h1>

            <p className="text-lg text-medium mb-6">
              Your donation helps young people build real businesses through workshops,
              tools, and launch support.
            </p>

            {loading ? (
              <p className="text-medium">Confirming your donation...</p>
            ) : donation ? (
              <div className="bg-light rounded-lg p-5 text-left mb-6">
                <p><strong>Amount:</strong> ${Number(donation.amount || 0).toFixed(2)}</p>
                <p><strong>Campaign:</strong> {donation.campaign}</p>
                <p><strong>Status:</strong> {donation.paymentStatus}</p>
                {donation.receiptNumber && (
                  <p><strong>Receipt:</strong> {donation.receiptNumber}</p>
                )}
              </div>
            ) : (
              <p className="text-medium mb-6">
                Stripe is confirming your donation. Your receipt will be emailed shortly.
              </p>
            )}

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/" className="bg-primary text-white px-6 py-3 rounded-lg font-bold">
                Back Home
              </Link>

              <Link href="/blog" className="border border-primary text-primary px-6 py-3 rounded-lg font-bold">
                Read Updates
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default DonateSuccessPage;