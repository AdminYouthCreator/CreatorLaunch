import React, { useEffect, useState } from 'react';
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

interface DonationImpact {
  totalRaised: number;
  paidDonationCount: number;
  recurringDonorCount: number;
  manualAcknowledgementCount: number;
  itemDonationCount: number;
  topCampaign: {
    campaign: string;
    totalRaised: number;
    donationCount: number;
  };
  topCampaigns: Array<{
    campaign: string;
    totalRaised: number;
    donationCount: number;
  }>;
  impactEquivalents: {
    workshopSupplyPacks: number;
    studentToolKits: number;
    launchCapitalGrants: number;
  };
  lastUpdated: string | null;
}

const fallbackImpact: DonationImpact = {
  totalRaised: 0,
  paidDonationCount: 0,
  recurringDonorCount: 0,
  manualAcknowledgementCount: 0,
  itemDonationCount: 0,
  topCampaign: {
    campaign: 'General Fund',
    totalRaised: 0,
    donationCount: 0,
  },
  topCampaigns: [],
  impactEquivalents: {
    workshopSupplyPacks: 0,
    studentToolKits: 0,
    launchCapitalGrants: 0,
  },
  lastUpdated: null,
};

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
  const [impactLoading, setImpactLoading] = useState(true);
  const [impact, setImpact] = useState<DonationImpact>(fallbackImpact);
  const [error, setError] = useState('');

  const finalAmount = customAmount ? Number(customAmount) : amount;

  useEffect(() => {
    const loadDonationImpact = async () => {
      try {
        setImpactLoading(true);

        const response = await fetch(`${API_BASE_URL}/api/donations/impact/public`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to load donation impact.');
        }

        setImpact({
          totalRaised: Number(data.totalRaised || 0),
          paidDonationCount: Number(data.paidDonationCount || 0),
          recurringDonorCount: Number(data.recurringDonorCount || 0),
          manualAcknowledgementCount: Number(data.manualAcknowledgementCount || 0),
          itemDonationCount: Number(data.itemDonationCount || 0),
          topCampaign: data.topCampaign || fallbackImpact.topCampaign,
          topCampaigns: Array.isArray(data.topCampaigns) ? data.topCampaigns : [],
          impactEquivalents: data.impactEquivalents || fallbackImpact.impactEquivalents,
          lastUpdated: data.lastUpdated || null,
        });
      } catch (err) {
        console.error('Failed to load public donation impact:', err);
        setImpact(fallbackImpact);
      } finally {
        setImpactLoading(false);
      }
    };

    loadDonationImpact();
  }, []);

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

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: value >= 1000 ? 0 : 2,
    }).format(Number(value || 0));
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('en-US').format(Number(value || 0));
  };

  const formatDate = (value: string | null) => {
    if (!value) return 'No confirmed donations yet';

    return new Date(value).toLocaleDateString();
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

        <section className="bg-light py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8">
                <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-8">
                  <div>
                    <p className="text-primary font-bold uppercase tracking-widest mb-2">
                      Live Donation Impact
                    </p>

                    <h2 className="text-3xl md:text-4xl font-bold text-dark">
                      Real support. Real student launches.
                    </h2>

                    <p className="text-medium mt-3 max-w-2xl">
                      These numbers update from confirmed donation records and issued offline
                      acknowledgement sheets in the CreatorLaunch system.
                    </p>
                  </div>

                  <div className="text-sm text-gray-500">
                    Last updated: {impactLoading ? 'Loading...' : formatDate(impact.lastUpdated)}
                  </div>
                </div>

                <div className="grid md:grid-cols-4 gap-4">
                  <div className="rounded-2xl border border-gray-100 bg-light p-5">
                    <p className="text-sm font-semibold text-medium mb-2">Total Raised</p>
                    <p className="text-3xl font-bold text-dark">
                      {impactLoading ? '...' : formatCurrency(impact.totalRaised)}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      Valid paid donations only
                    </p>
                  </div>

                  <div className="rounded-2xl border border-gray-100 bg-light p-5">
                    <p className="text-sm font-semibold text-medium mb-2">Confirmed Donations</p>
                    <p className="text-3xl font-bold text-dark">
                      {impactLoading ? '...' : formatNumber(impact.paidDonationCount)}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      Online + offline records
                    </p>
                  </div>

                  <div className="rounded-2xl border border-gray-100 bg-light p-5">
                    <p className="text-sm font-semibold text-medium mb-2">Monthly Supporters</p>
                    <p className="text-3xl font-bold text-dark">
                      {impactLoading ? '...' : formatNumber(impact.recurringDonorCount)}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      Recurring giving records
                    </p>
                  </div>

                  <div className="rounded-2xl border border-gray-100 bg-light p-5">
                    <p className="text-sm font-semibold text-medium mb-2">Top Fund</p>
                    <p className="text-xl font-bold text-dark leading-tight">
                      {impactLoading ? 'Loading...' : impact.topCampaign.campaign}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      {impactLoading
                        ? '...'
                        : `${formatCurrency(impact.topCampaign.totalRaised)} raised`}
                    </p>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4 mt-6">
                  <div className="rounded-2xl border border-red-100 bg-red-50 p-5">
                    <p className="text-2xl font-bold text-primary">
                      {impactLoading ? '...' : formatNumber(impact.impactEquivalents.workshopSupplyPacks)}
                    </p>
                    <p className="font-semibold text-dark mt-1">Workshop supply packs</p>
                    <p className="text-sm text-medium mt-2">
                      Based on about $25 per set of hands-on workshop supplies.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-blue-100 bg-blue-50 p-5">
                    <p className="text-2xl font-bold text-blue-700">
                      {impactLoading ? '...' : formatNumber(impact.impactEquivalents.studentToolKits)}
                    </p>
                    <p className="font-semibold text-dark mt-1">Student tool kits</p>
                    <p className="text-sm text-medium mt-2">
                      Based on about $100 per student business tools/resource kit.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
                    <p className="text-2xl font-bold text-dark">
                      {impactLoading ? '...' : formatNumber(impact.impactEquivalents.launchCapitalGrants)}
                    </p>
                    <p className="font-semibold text-dark mt-1">Launch capital equivalents</p>
                    <p className="text-sm text-medium mt-2">
                      Based on about $500 to help fund a student venture launch.
                    </p>
                  </div>
                </div>

                {impact.topCampaigns.length > 0 && (
                  <div className="mt-8">
                    <h3 className="text-xl font-bold text-dark mb-4">Campaign Progress</h3>

                    <div className="space-y-3">
                      {impact.topCampaigns.map((campaignItem) => {
                        const percentage =
                          impact.totalRaised > 0
                            ? Math.min(100, Math.round((campaignItem.totalRaised / impact.totalRaised) * 100))
                            : 0;

                        return (
                          <div key={campaignItem.campaign}>
                            <div className="flex justify-between gap-4 text-sm mb-1">
                              <span className="font-semibold text-dark">{campaignItem.campaign}</span>
                              <span className="text-medium">
                                {formatCurrency(campaignItem.totalRaised)} •{' '}
                                {formatNumber(campaignItem.donationCount)} donation
                                {campaignItem.donationCount === 1 ? '' : 's'}
                              </span>
                            </div>

                            <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-primary rounded-full"
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
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
                  <h3 className="text-xl font-bold text-dark mb-4">Current Progress</h3>

                  <div className="space-y-3 text-medium">
                    <p>
                      <strong>{impactLoading ? '...' : formatCurrency(impact.totalRaised)}</strong>{' '}
                      raised through confirmed donation records.
                    </p>
                    <p>
                      <strong>{impactLoading ? '...' : formatNumber(impact.manualAcknowledgementCount)}</strong>{' '}
                      offline acknowledgement sheet
                      {impact.manualAcknowledgementCount === 1 ? '' : 's'} issued.
                    </p>
                    <p>
                      <strong>{impactLoading ? '...' : formatNumber(impact.itemDonationCount)}</strong>{' '}
                      in-kind item donation record
                      {impact.itemDonationCount === 1 ? '' : 's'} included.
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