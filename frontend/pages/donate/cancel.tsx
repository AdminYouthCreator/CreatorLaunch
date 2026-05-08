import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Header from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';

const DonateCancelPage: React.FC = () => {
  return (
    <>
      <Head>
        <title>Donation Cancelled | CreatorLaunch</title>
      </Head>

      <Header />

      <main className="bg-light min-h-screen py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm p-8 text-center">
            <h1 className="text-4xl font-bold text-dark mb-4">
              Donation Cancelled
            </h1>

            <p className="text-lg text-medium mb-6">
              No payment was completed. You can return to the donation page anytime.
            </p>

            <Link href="/donate" className="bg-primary text-white px-6 py-3 rounded-lg font-bold">
              Return to Donate
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default DonateCancelPage;