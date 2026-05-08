import React, { useEffect, useMemo, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { adminAPI } from '@/utils/adminApi';
import {
  FiDollarSign,
  FiRefreshCw,
  FiSearch,
  FiMail,
  FiRepeat,
  FiCheckCircle,
  FiClock,
  FiXCircle,
  FiExternalLink,
} from 'react-icons/fi';

interface AdminDonation {
  id: string;
  donorName: string;
  donorEmail: string;
  amount: number;
  currency: string;
  campaign: string;
  message?: string;
  anonymous: boolean;
  recurring: boolean;
  interval: 'one_time' | 'month';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'expired' | 'refunded' | string;
  stripeCheckoutSessionId?: string;
  stripeReceiptUrl?: string;
  taxReceiptSent: boolean;
  taxReceiptSentAt?: string | null;
  receiptNumber?: string;
  paidAt?: string | null;
  createdAt: string;
  updatedAt?: string;
}

interface DonationStats {
  totalPaid: number;
  paidCount: number;
  recurringCount: number;
  totalCount: number;
}

const AdminDonationsPage: React.FC = () => {
  const [donations, setDonations] = useState<AdminDonation[]>([]);
  const [stats, setStats] = useState<DonationStats>({
    totalPaid: 0,
    paidCount: 0,
    recurringCount: 0,
    totalCount: 0,
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [campaignFilter, setCampaignFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  const [loading, setLoading] = useState(true);
  const [resendingId, setResendingId] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadDonations();
  }, []);

  const loadDonations = async () => {
    try {
      setLoading(true);
      setError('');
      setSuccess('');

      const data = await adminAPI.getDonations();

      setDonations(data.donations || []);
      setStats({
        totalPaid: Number(data.stats?.totalPaid || 0),
        paidCount: Number(data.stats?.paidCount || 0),
        recurringCount: Number(data.stats?.recurringCount || 0),
        totalCount: Number(data.stats?.totalCount || 0),
      });
    } catch (err: any) {
      setError(err.message || 'Failed to load donations.');
    } finally {
      setLoading(false);
    }
  };

  const campaigns = useMemo(() => {
    const uniqueCampaigns = new Set(
      donations
        .map((donation) => donation.campaign)
        .filter(Boolean)
    );

    return ['all', ...Array.from(uniqueCampaigns)];
  }, [donations]);

  const filteredDonations = useMemo(() => {
    const search = searchTerm.toLowerCase().trim();

    return donations.filter((donation) => {
      const matchesSearch =
        !search ||
        donation.donorName?.toLowerCase().includes(search) ||
        donation.donorEmail?.toLowerCase().includes(search) ||
        donation.campaign?.toLowerCase().includes(search) ||
        donation.receiptNumber?.toLowerCase().includes(search) ||
        donation.stripeCheckoutSessionId?.toLowerCase().includes(search);

      const matchesStatus =
        statusFilter === 'all' || donation.paymentStatus === statusFilter;

      const matchesCampaign =
        campaignFilter === 'all' || donation.campaign === campaignFilter;

      const matchesType =
        typeFilter === 'all' ||
        (typeFilter === 'recurring' && donation.recurring) ||
        (typeFilter === 'one_time' && !donation.recurring);

      return matchesSearch && matchesStatus && matchesCampaign && matchesType;
    });
  }, [donations, searchTerm, statusFilter, campaignFilter, typeFilter]);

  const pendingCount = donations.filter((donation) => donation.paymentStatus === 'pending').length;
  const failedOrExpiredCount = donations.filter((donation) =>
    ['failed', 'expired'].includes(donation.paymentStatus)
  ).length;

  const formatCurrency = (amount: number, currency = 'usd') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency?.toUpperCase() || 'USD',
    }).format(Number(amount || 0));
  };

  const formatDate = (date?: string | null) => {
    if (!date) return '—';

    return new Date(date).toLocaleDateString();
  };

  const formatDateTime = (date?: string | null) => {
    if (!date) return '—';

    return new Date(date).toLocaleString();
  };

  const getStatusClass = (status: string) => {
    if (status === 'paid') return 'bg-green-100 text-green-700';
    if (status === 'pending') return 'bg-yellow-100 text-yellow-700';
    if (status === 'failed' || status === 'expired') return 'bg-red-100 text-red-700';
    if (status === 'refunded') return 'bg-gray-100 text-gray-700';

    return 'bg-blue-100 text-blue-700';
  };

  const resendReceipt = async (donationId: string) => {
    try {
      setResendingId(donationId);
      setError('');
      setSuccess('');

      const data = await adminAPI.resendDonationReceipt(donationId);

      setDonations((prev) =>
        prev.map((donation) =>
          donation.id === donationId ? data.donation || donation : donation
        )
      );

      setSuccess('Donation receipt resent successfully.');
    } catch (err: any) {
      setError(err.message || 'Failed to resend donation receipt.');
    } finally {
      setResendingId('');
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="admin-loading">
          <div className="admin-spinner"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="admin-page">
        <div className="admin-page-header">
          <div>
            <h1>Donations</h1>
            <p>Track CreatorLaunch donations, campaigns, Stripe status, and tax receipts.</p>
          </div>

          <button onClick={loadDonations} className="admin-btn secondary">
            <FiRefreshCw />
            Refresh
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 mb-6">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 rounded-lg p-4 mb-6">
            {success}
          </div>
        )}

        <div className="admin-stats-grid mb-8">
          <div className="admin-stat-card">
            <div className="admin-stat-header">
              <div className="admin-stat-icon revenue">
                <FiDollarSign />
              </div>
            </div>
            <h3 className="admin-stat-value">{formatCurrency(stats.totalPaid)}</h3>
            <p className="admin-stat-label">Total Paid Donations</p>
            <p className="admin-stat-change">Confirmed Stripe payments</p>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-header">
              <div className="admin-stat-icon users">
                <FiCheckCircle />
              </div>
            </div>
            <h3 className="admin-stat-value">{stats.paidCount}</h3>
            <p className="admin-stat-label">Paid Donations</p>
            <p className="admin-stat-change">Completed contributions</p>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-header">
              <div className="admin-stat-icon stores">
                <FiRepeat />
              </div>
            </div>
            <h3 className="admin-stat-value">{stats.recurringCount}</h3>
            <p className="admin-stat-label">Recurring Donors</p>
            <p className="admin-stat-change">Monthly donation records</p>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-header">
              <div className="admin-stat-icon alerts">
                <FiClock />
              </div>
            </div>
            <h3 className="admin-stat-value">{pendingCount}</h3>
            <p className="admin-stat-label">Pending</p>
            <p className="admin-stat-change">
              {failedOrExpiredCount} failed or expired
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-col xl:flex-row gap-3 xl:items-center xl:justify-between">
            <div className="relative w-full xl:max-w-md">
              <FiSearch className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search donor, email, campaign, receipt..."
                className="pl-10 pr-4 py-2 border rounded-lg w-full"
              />
            </div>

            <div className="flex flex-col md:flex-row gap-3">
              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                className="px-4 py-2 border rounded-lg bg-white"
              >
                <option value="all">All Statuses</option>
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
                <option value="expired">Expired</option>
                <option value="refunded">Refunded</option>
              </select>

              <select
                value={campaignFilter}
                onChange={(event) => setCampaignFilter(event.target.value)}
                className="px-4 py-2 border rounded-lg bg-white"
              >
                {campaigns.map((campaign) => (
                  <option key={campaign} value={campaign}>
                    {campaign === 'all' ? 'All Campaigns' : campaign}
                  </option>
                ))}
              </select>

              <select
                value={typeFilter}
                onChange={(event) => setTypeFilter(event.target.value)}
                className="px-4 py-2 border rounded-lg bg-white"
              >
                <option value="all">All Types</option>
                <option value="one_time">One-time</option>
                <option value="recurring">Monthly</option>
              </select>
            </div>
          </div>
        </div>

        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Donor</th>
                <th>Amount</th>
                <th>Campaign</th>
                <th>Status</th>
                <th>Receipt</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredDonations.map((donation) => (
                <tr key={donation.id}>
                  <td>
                    <div>
                      <p className="font-semibold">
                        {donation.anonymous ? 'Anonymous' : donation.donorName || 'Supporter'}
                      </p>
                      <p className="text-sm text-gray-500">{donation.donorEmail || 'No email'}</p>
                      {donation.message && (
                        <p className="text-xs text-gray-500 mt-1 max-w-xs truncate">
                          “{donation.message}”
                        </p>
                      )}
                    </div>
                  </td>

                  <td>
                    <div>
                      <p className="font-semibold">
                        {formatCurrency(donation.amount, donation.currency)}
                      </p>
                      <p className="text-xs text-gray-500">
                        {donation.recurring ? 'Monthly' : 'One-time'}
                      </p>
                    </div>
                  </td>

                  <td>
                    <span className="text-sm font-medium">
                      {donation.campaign || 'General Fund'}
                    </span>
                  </td>

                  <td>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold capitalize ${getStatusClass(
                        donation.paymentStatus
                      )}`}
                    >
                      {donation.paymentStatus}
                    </span>
                  </td>

                  <td>
                    <div>
                      <p className="text-sm font-medium">
                        {donation.receiptNumber || '—'}
                      </p>

                      {donation.taxReceiptSent ? (
                        <p className="text-xs text-green-600">
                          Sent {formatDate(donation.taxReceiptSentAt)}
                        </p>
                      ) : (
                        <p className="text-xs text-gray-500">Not sent</p>
                      )}
                    </div>
                  </td>

                  <td>
                    <div>
                      <p className="text-sm">
                        {formatDate(donation.paidAt || donation.createdAt)}
                      </p>
                      <p className="text-xs text-gray-500">
                        Created {formatDateTime(donation.createdAt)}
                      </p>
                    </div>
                  </td>

                  <td>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => resendReceipt(donation.id)}
                        disabled={donation.paymentStatus !== 'paid' || resendingId === donation.id}
                        className="admin-btn secondary text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        title={
                          donation.paymentStatus !== 'paid'
                            ? 'Receipts can only be sent for paid donations.'
                            : 'Resend tax receipt'
                        }
                      >
                        <FiMail />
                        {resendingId === donation.id ? 'Sending...' : 'Receipt'}
                      </button>

                      {donation.stripeReceiptUrl && (
                        <a
                          href={donation.stripeReceiptUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="admin-btn secondary text-sm"
                        >
                          <FiExternalLink />
                          Stripe
                        </a>
                      )}
                    </div>
                  </td>
                </tr>
              ))}

              {filteredDonations.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-gray-500">
                    <FiXCircle className="mx-auto mb-2 text-2xl" />
                    No donations match your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-6 bg-blue-50 border border-blue-200 text-blue-800 rounded-lg p-4 text-sm">
          Showing {filteredDonations.length} of {donations.length} loaded donation records. Paid
          totals only count donations with a confirmed <strong>paid</strong> status.
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDonationsPage;