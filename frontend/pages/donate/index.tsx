import React, { useState } from 'react';
import Head from 'next/head';
import Header from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

const presetAmounts = [10, 25, 50, 100, 500];

const campaigns = [
  'General Fund',
  'Launch Capital Fund',
  'Workshop Supplies',
  'Student Business Starter Kits',
  'Pitch Competition Fund',
];

const DonatePage: React.FC = () => {
  const [amount, setAmount] = useState<number>(50);
  const [customAmount, setCustomAmount] = useState('');
  const [campaign, setCampaign] = useState('Launch Capital Fund');
  const [donorName, setDonorName] = useState('');
  const [donorEmail, setDonorEmail] = useState('');
  const [message, setMessage] = useState('');
  const [anonymous, setAnonymous] = useState(false);
  const [recurring, setRecurring] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const finalAmount = customAmount ? Number(customAmount) : amount;

  const submitDonation = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      setLoading(true);
      setError('');

      if (!finalAmount || finalAmount < 1) {
        throw new Error('Please enter a donation amount of at least $1.');
      }

      if (!donorEmail) {
        throw new Error('Please enter your email so we can send your receipt.');
      }

      const response = await fetch(`${API_BASE_URL}/api/donations/create-checkout-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: finalAmount,
          campaign,
          donorName,
          donorEmail,
          message,
          anonymous,
          recurring,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to start donation checkout.');
      }

      if (!data.checkoutUrl) {
        throw new Error('Stripe checkout URL was not returned.');
      }

      window.location.href = data.checkoutUrl;
    } catch (err: any) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Donate | CreatorLaunch</title>
        <meta
          name="description"
          content="Support CreatorLaunch and help fund youth entrepreneurship, workshops, student launch capital, and creator tools."
        />
      </Head>

      <Header />

      <main>
        <section className="bg-white py-20">
          <div className="container mx-auto px-4 text-center">
            <p className="text-primary font-bold uppercase tracking-widest mb-3">
              Support the Mission
            </p>

            <h1 className="text-4xl md:text-6xl font-bold text-dark mb-6">
              Fuel the Next Big Idea.
            </h1>

            <p className="text-xl text-medium max-w-3xl mx-auto">
              Your contribution helps CreatorLaunch provide workshops, tools, and launch capital
              for young entrepreneurs building real businesses.
            </p>
          </div>
        </section>

        <section className="bg-light py-16">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm p-8">
                <h2 className="text-2xl font-bold text-dark mb-6">Make a Donation</h2>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 mb-6">
                    {error}
                  </div>
                )}

                <form onSubmit={submitDonation} className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold mb-3">Donation Amount</label>

                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-3">
                      {presetAmounts.map((preset) => (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => {
                            setAmount(preset);
                            setCustomAmount('');
                          }}
                          className={`px-4 py-3 rounded-lg font-bold border transition-colors ${
                            !customAmount && amount === preset
                              ? 'bg-primary text-white border-primary'
                              : 'bg-white text-dark border-gray-300 hover:border-primary'
                          }`}
                        >
                          ${preset}
                        </button>
                      ))}
                    </div>

                    <input
                      type="number"
                      min="1"
                      step="1"
                      value={customAmount}
                      onChange={(event) => setCustomAmount(event.target.value)}
                      placeholder="Custom amount"
                      className="w-full px-4 py-3 border rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">Campaign</label>
                    <select
                      value={campaign}
                      onChange={(event) => setCampaign(event.target.value)}
                      className="w-full px-4 py-3 border rounded-lg"
                    >
                      {campaigns.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2">Name</label>
                      <input
                        value={donorName}
                        onChange={(event) => setDonorName(event.target.value)}
                        placeholder="Your name"
                        className="w-full px-4 py-3 border rounded-lg"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold mb-2">Email *</label>
                      <input
                        type="email"
                        value={donorEmail}
                        onChange={(event) => setDonorEmail(event.target.value)}
                        placeholder="you@example.com"
                        className="w-full px-4 py-3 border rounded-lg"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">Message optional</label>
                    <textarea
                      value={message}
                      onChange={(event) => setMessage(event.target.value)}
                      rows={4}
                      placeholder="Leave a note of encouragement for young founders."
                      className="w-full px-4 py-3 border rounded-lg"
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={recurring}
                        onChange={(event) => setRecurring(event.target.checked)}
                      />
                      <span className="font-medium">Make this a monthly donation</span>
                    </label>

                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={anonymous}
                        onChange={(event) => setAnonymous(event.target.checked)}
                      />
                      <span className="font-medium">Make my donation anonymous publicly</span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-primary text-white px-6 py-4 rounded-lg font-bold hover:bg-red-600 transition-colors disabled:opacity-60"
                  >
                    {loading
                      ? 'Redirecting to Stripe...'
                      : `Donate $${Number(finalAmount || 0).toFixed(0)}${recurring ? '/month' : ''}`}
                  </button>

                  <p className="text-sm text-gray-500 text-center">
                    Secure checkout powered by Stripe. A donation acknowledgement receipt will be emailed after payment.
                  </p>
                </form>
              </div>

              <aside className="space-y-6">
                <div className="bg-white rounded-2xl shadow-sm p-6">
                  <h3 className="text-xl font-bold text-dark mb-4">Your Impact</h3>

                  <div className="space-y-4 text-medium">
                    <p>
                      <strong>$25</strong> helps cover workshop supplies.
                    </p>
                    <p>
                      <strong>$100</strong> supports student business tools and resources.
                    </p>
                    <p>
                      <strong>$500</strong> can help fund launch capital for a student venture.
                    </p>
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm p-6">
                  <h3 className="text-xl font-bold text-dark mb-4">Tax Acknowledgement</h3>
                  <p className="text-medium">
                    CreatorLaunch is tax-exempt. After your donation is confirmed, we will email a
                    charitable contribution acknowledgement for your records.
                  </p>
                </div>
              </aside>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default DonatePage;