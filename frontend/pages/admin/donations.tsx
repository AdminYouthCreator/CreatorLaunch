import React, { useEffect, useMemo, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { adminAPI } from '@/utils/adminApi';
import {
  FiDollarSign,
  FiRefreshCw,
  FiSearch,
  FiMail,
  FiCheckCircle,
  FiClock,
  FiXCircle,
  FiExternalLink,
  FiFileText,
  FiPlusCircle,
  FiEdit2,
  FiPrinter,
  FiEye,
  FiSlash,
} from 'react-icons/fi';

interface AdminDonation {
  id: string;
  source: 'stripe' | 'manual';
  donationKind: 'cash' | 'item';
  donorName: string;
  donorEmail: string;
  donorPhone?: string;
  donorAddress?: string;
  amount: number;
  currency: string;
  campaign: string;
  message?: string;
  anonymous: boolean;
  recurring: boolean;
  interval: 'one_time' | 'month';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'expired' | 'refunded' | 'invalidated' | string;
  paymentMethod?: string;
  itemDescription?: string;
  estimatedValue?: number;
  receivedDate?: string | null;
  acknowledgementNotes?: string;
  internalNotes?: string;
  invalidatedAt?: string | null;
  invalidationReason?: string;
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
  manualSheetCount: number;
  invalidatedCount: number;
  totalCount: number;
}

interface ManualDonationForm {
  donationKind: 'cash' | 'item';
  donorName: string;
  donorEmail: string;
  donorPhone: string;
  donorAddress: string;
  amount: string;
  campaign: string;
  paymentMethod: 'cash' | 'check' | 'money_order' | 'other';
  itemDescription: string;
  estimatedValue: string;
  receivedDate: string;
  acknowledgementNotes: string;
  internalNotes: string;
  anonymous: boolean;
}

const emptyManualForm: ManualDonationForm = {
  donationKind: 'cash',
  donorName: '',
  donorEmail: '',
  donorPhone: '',
  donorAddress: '',
  amount: '',
  campaign: 'General Fund',
  paymentMethod: 'cash',
  itemDescription: '',
  estimatedValue: '',
  receivedDate: new Date().toISOString().slice(0, 10),
  acknowledgementNotes: '',
  internalNotes: '',
  anonymous: false,
};

const AdminDonationsPage: React.FC = () => {
  const [donations, setDonations] = useState<AdminDonation[]>([]);
  const [stats, setStats] = useState<DonationStats>({
    totalPaid: 0,
    paidCount: 0,
    recurringCount: 0,
    manualSheetCount: 0,
    invalidatedCount: 0,
    totalCount: 0,
  });

  const [viewMode, setViewMode] = useState<'payments' | 'sheets'>('payments');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [campaignFilter, setCampaignFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  const [loading, setLoading] = useState(true);
  const [resendingId, setResendingId] = useState('');
  const [savingManual, setSavingManual] = useState(false);
  const [invalidatingId, setInvalidatingId] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [showManualModal, setShowManualModal] = useState(false);
  const [editingDonation, setEditingDonation] = useState<AdminDonation | null>(null);
  const [viewingSheet, setViewingSheet] = useState<AdminDonation | null>(null);
  const [manualForm, setManualForm] = useState<ManualDonationForm>(emptyManualForm);

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
        manualSheetCount: Number(data.stats?.manualSheetCount || 0),
        invalidatedCount: Number(data.stats?.invalidatedCount || 0),
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

  const baseDonations = useMemo(() => {
    if (viewMode === 'sheets') {
      return donations.filter((donation) => donation.source === 'manual' || Boolean(donation.receiptNumber));
    }

    return donations;
  }, [donations, viewMode]);

  const filteredDonations = useMemo(() => {
    const search = searchTerm.toLowerCase().trim();

    return baseDonations.filter((donation) => {
      const matchesSearch =
        !search ||
        donation.donorName?.toLowerCase().includes(search) ||
        donation.donorEmail?.toLowerCase().includes(search) ||
        donation.campaign?.toLowerCase().includes(search) ||
        donation.receiptNumber?.toLowerCase().includes(search) ||
        donation.stripeCheckoutSessionId?.toLowerCase().includes(search) ||
        donation.itemDescription?.toLowerCase().includes(search);

      const matchesStatus =
        statusFilter === 'all' || donation.paymentStatus === statusFilter;

      const matchesCampaign =
        campaignFilter === 'all' || donation.campaign === campaignFilter;

      const matchesType =
        typeFilter === 'all' ||
        (typeFilter === 'stripe' && donation.source === 'stripe') ||
        (typeFilter === 'manual' && donation.source === 'manual') ||
        (typeFilter === 'recurring' && donation.recurring) ||
        (typeFilter === 'one_time' && !donation.recurring && donation.source === 'stripe') ||
        (typeFilter === 'cash' && donation.donationKind === 'cash') ||
        (typeFilter === 'item' && donation.donationKind === 'item');

      return matchesSearch && matchesStatus && matchesCampaign && matchesType;
    });
  }, [baseDonations, searchTerm, statusFilter, campaignFilter, typeFilter]);

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

  const escapeHtml = (value?: string | number | null) => {
    return String(value ?? '')
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');
  };

  const getStatusClass = (status: string) => {
    if (status === 'paid') return 'bg-green-100 text-green-700';
    if (status === 'pending') return 'bg-yellow-100 text-yellow-700';
    if (status === 'failed' || status === 'expired' || status === 'invalidated') {
      return 'bg-red-100 text-red-700';
    }
    if (status === 'refunded') return 'bg-gray-100 text-gray-700';

    return 'bg-blue-100 text-blue-700';
  };

  const updateDonationInList = (updatedDonation: AdminDonation) => {
    setDonations((prev) =>
      prev.map((donation) => (donation.id === updatedDonation.id ? updatedDonation : donation))
    );
  };

  const openCreateManualModal = () => {
    setEditingDonation(null);
    setManualForm({
      ...emptyManualForm,
      receivedDate: new Date().toISOString().slice(0, 10),
    });
    setShowManualModal(true);
  };

  const openEditManualModal = (donation: AdminDonation) => {
    setEditingDonation(donation);
    setManualForm({
      donationKind: donation.donationKind || 'cash',
      donorName: donation.anonymous ? '' : donation.donorName || '',
      donorEmail: donation.donorEmail || '',
      donorPhone: donation.donorPhone || '',
      donorAddress: donation.donorAddress || '',
      amount: donation.donationKind === 'cash' ? String(donation.amount || '') : '',
      campaign: donation.campaign || 'General Fund',
      paymentMethod:
        donation.paymentMethod === 'check' ||
        donation.paymentMethod === 'money_order' ||
        donation.paymentMethod === 'other'
          ? donation.paymentMethod
          : 'cash',
      itemDescription: donation.itemDescription || '',
      estimatedValue: donation.donationKind === 'item' ? String(donation.estimatedValue || donation.amount || '') : '',
      receivedDate: donation.receivedDate
        ? new Date(donation.receivedDate).toISOString().slice(0, 10)
        : new Date().toISOString().slice(0, 10),
      acknowledgementNotes: donation.acknowledgementNotes || '',
      internalNotes: donation.internalNotes || '',
      anonymous: Boolean(donation.anonymous),
    });
    setShowManualModal(true);
  };

  const saveManualDonation = async () => {
    try {
      setSavingManual(true);
      setError('');
      setSuccess('');

      const payload = {
        ...manualForm,
        amount: Number(manualForm.amount || 0),
        estimatedValue: Number(manualForm.estimatedValue || 0),
      };

      const data = editingDonation
        ? await adminAPI.updateManualDonation(editingDonation.id, payload)
        : await adminAPI.createManualDonation(payload);

      if (editingDonation) {
        updateDonationInList(data.donation);
        setSuccess('Acknowledgement sheet updated.');
      } else {
        setDonations((prev) => [data.donation, ...prev]);
        setStats((prev) => ({
          ...prev,
          manualSheetCount: prev.manualSheetCount + 1,
          paidCount: prev.paidCount + 1,
          totalCount: prev.totalCount + 1,
          totalPaid: Number((prev.totalPaid + Number(data.donation.amount || 0)).toFixed(2)),
        }));
        setSuccess('Manual acknowledgement sheet created.');
      }

      setShowManualModal(false);
      setEditingDonation(null);
      setManualForm(emptyManualForm);
      setViewMode('sheets');
    } catch (err: any) {
      setError(err.message || 'Failed to save manual acknowledgement sheet.');
    } finally {
      setSavingManual(false);
    }
  };

  const invalidateDonation = async (donation: AdminDonation) => {
    const defaultReason =
      donation.paymentStatus === 'pending'
        ? 'Pending payment did not go through.'
        : 'Invalidated by admin.';

    const reason = window.prompt('Reason for invalidating this record:', defaultReason);

    if (reason === null) {
      return;
    }

    try {
      setInvalidatingId(donation.id);
      setError('');
      setSuccess('');

      const data = await adminAPI.invalidateDonation(donation.id, { reason });

      updateDonationInList(data.donation);
      setSuccess('Donation record invalidated.');
    } catch (err: any) {
      setError(err.message || 'Failed to invalidate donation.');
    } finally {
      setInvalidatingId('');
    }
  };

  const resendReceipt = async (donationId: string) => {
    try {
      setResendingId(donationId);
      setError('');
      setSuccess('');

      const data = await adminAPI.resendDonationReceipt(donationId);

      updateDonationInList(data.donation);
      setSuccess('Donation receipt resent successfully.');
    } catch (err: any) {
      setError(err.message || 'Failed to resend donation receipt.');
    } finally {
      setResendingId('');
    }
  };

  const buildPrintableSheet = (donation: AdminDonation) => {
    const legalName = 'CreatorLaunch';
    const isItem = donation.donationKind === 'item';
    const receiptNumber = donation.receiptNumber || 'Pending Receipt Number';
    const displayAmount = formatCurrency(donation.amount || donation.estimatedValue || 0);
    const donationDate = formatDate(donation.receivedDate || donation.paidAt || donation.createdAt);

    return `
<!doctype html>
<html>
<head>
  <title>${escapeHtml(receiptNumber)} - CreatorLaunch Donation Acknowledgement</title>
  <style>
    * {
      box-sizing: border-box;
    }

    body {
      font-family: Arial, Helvetica, sans-serif;
      color: #111827;
      padding: 40px;
      line-height: 1.5;
      background: #f3f4f6;
    }

    .sheet {
      max-width: 850px;
      margin: 0 auto;
      background: #ffffff;
      border: 1px solid #d1d5db;
      border-radius: 18px;
      overflow: hidden;
      box-shadow: 0 20px 50px rgba(15, 23, 42, 0.12);
    }

    .brand-bar {
      height: 12px;
      background: linear-gradient(90deg, #dc2626, #1d4ed8, #111827);
    }

    .content {
      padding: 42px;
    }

    .top {
      display: flex;
      justify-content: space-between;
      gap: 28px;
      border-bottom: 2px solid #111827;
      padding-bottom: 24px;
      margin-bottom: 28px;
    }

    .brand-title {
      font-size: 13px;
      text-transform: uppercase;
      letter-spacing: 0.14em;
      color: #dc2626;
      font-weight: 800;
      margin-bottom: 8px;
    }

    h1 {
      margin: 0;
      font-size: 30px;
      line-height: 1.15;
      color: #111827;
    }

    .subtitle {
      color: #4b5563;
      margin-top: 10px;
      font-size: 15px;
      max-width: 520px;
    }

    .receipt-box {
      min-width: 210px;
      border: 1px solid #e5e7eb;
      border-radius: 12px;
      padding: 16px;
      background: #f9fafb;
      text-align: right;
    }

    .receipt-label {
      font-size: 11px;
      color: #6b7280;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      font-weight: 800;
    }

    .receipt-number {
      margin-top: 4px;
      font-size: 17px;
      font-weight: 900;
      color: #111827;
    }

    .mission-card {
      background: linear-gradient(135deg, #fff1f2, #eff6ff);
      border: 1px solid #fee2e2;
      border-radius: 14px;
      padding: 20px;
      margin-bottom: 26px;
    }

    .mission-card h2 {
      margin: 0 0 8px 0;
      font-size: 20px;
      color: #111827;
    }

    .mission-card p {
      margin: 0;
      color: #374151;
      font-size: 14px;
    }

    .impact-line {
      margin-top: 12px;
      font-weight: 800;
      color: #b91c1c;
    }

    .grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px 30px;
      margin-top: 20px;
    }

    .field {
      border-bottom: 1px solid #f3f4f6;
      padding-bottom: 10px;
    }

    .field-label {
      font-size: 11px;
      text-transform: uppercase;
      color: #6b7280;
      font-weight: 800;
      letter-spacing: 0.06em;
    }

    .field-value {
      font-size: 15px;
      margin-top: 3px;
      font-weight: 600;
      color: #111827;
      word-break: break-word;
    }

    .section {
      margin-top: 28px;
      padding-top: 22px;
      border-top: 1px solid #e5e7eb;
    }

    .section h3 {
      margin: 0 0 10px 0;
      font-size: 17px;
      color: #111827;
    }

    .paragraph {
      color: #374151;
      font-size: 14px;
      margin: 0;
      white-space: pre-wrap;
    }

    .notice {
      margin-top: 28px;
      padding: 18px;
      background: #f9fafb;
      border: 1px solid #e5e7eb;
      border-radius: 12px;
      font-size: 13.5px;
      color: #374151;
    }

    .notice strong {
      color: #111827;
    }

    .invalidated {
      color: #991b1b;
      font-weight: 900;
      border: 2px solid #991b1b;
      background: #fef2f2;
      padding: 12px;
      text-align: center;
      margin-bottom: 24px;
      border-radius: 10px;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }

    .signature {
      margin-top: 34px;
      display: flex;
      justify-content: space-between;
      gap: 24px;
      align-items: flex-end;
    }

    .signature-message {
      color: #374151;
      font-size: 14px;
    }

    .signature-name {
      margin-top: 10px;
      font-size: 18px;
      font-weight: 900;
      color: #111827;
    }

    .tagline {
      font-size: 12px;
      color: #6b7280;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      font-weight: 800;
      text-align: right;
    }

    .footer {
      margin-top: 30px;
      padding-top: 18px;
      border-top: 1px solid #e5e7eb;
      color: #6b7280;
      font-size: 12px;
      text-align: center;
    }

    @media print {
      body {
        padding: 0;
        background: #ffffff;
      }

      .sheet {
        border: none;
        box-shadow: none;
        border-radius: 0;
      }

      .content {
        padding: 32px;
      }
    }
  </style>
</head>
<body>
  <div class="sheet">
    <div class="brand-bar"></div>

    <div class="content">
      ${
        donation.paymentStatus === 'invalidated'
          ? `<div class="invalidated">Invalidated Record — ${escapeHtml(donation.invalidationReason || 'No reason provided')}</div>`
          : ''
      }

      <div class="top">
        <div>
          <div class="brand-title">CreatorLaunch</div>
          <h1>Donation Receipt & Charitable Contribution Acknowledgement</h1>
          <div class="subtitle">
            Thank you for helping us build a youth-led launchpad where young founders can learn, create, pitch, and launch real ventures.
          </div>
        </div>

        <div class="receipt-box">
          <div class="receipt-label">Receipt Number</div>
          <div class="receipt-number">${escapeHtml(receiptNumber)}</div>
          <div style="margin-top: 12px;" class="receipt-label">Status</div>
          <div class="receipt-number" style="font-size: 14px; text-transform: capitalize;">
            ${escapeHtml(donation.paymentStatus)}
          </div>
        </div>
      </div>

      <div class="mission-card">
        <h2>Founded by youth. Run by youth. Built for youth.</h2>
        <p>
          CreatorLaunch exists to remove the barriers that stop students from turning ideas into real businesses.
          Your support helps provide hands-on workshops, business tools, student launch resources, pitch opportunities,
          and the platform we are building for the next generation of founders.
        </p>
        <div class="impact-line">
          This is more than a donation — it is fuel for a young creator's first launch.
        </div>
      </div>

      <div class="grid">
        <div class="field">
          <div class="field-label">Donor Name</div>
          <div class="field-value">${escapeHtml(donation.anonymous ? 'Anonymous' : donation.donorName || 'Supporter')}</div>
        </div>

        <div class="field">
          <div class="field-label">Donor Email</div>
          <div class="field-value">${escapeHtml(donation.donorEmail || '—')}</div>
        </div>

        <div class="field">
          <div class="field-label">Donor Phone</div>
          <div class="field-value">${escapeHtml(donation.donorPhone || '—')}</div>
        </div>

        <div class="field">
          <div class="field-label">Donation Date</div>
          <div class="field-value">${escapeHtml(donationDate)}</div>
        </div>

        <div class="field">
          <div class="field-label">Campaign / Fund</div>
          <div class="field-value">${escapeHtml(donation.campaign || 'General Fund')}</div>
        </div>

        <div class="field">
          <div class="field-label">Donation Type</div>
          <div class="field-value">${escapeHtml(isItem ? 'In-kind item donation' : 'Monetary donation')}</div>
        </div>

        <div class="field">
          <div class="field-label">Payment / Contribution Method</div>
          <div class="field-value">${escapeHtml(donation.paymentMethod || donation.source)}</div>
        </div>

        <div class="field">
          <div class="field-label">${escapeHtml(isItem ? 'Estimated Value Entered' : 'Donation Amount')}</div>
          <div class="field-value">${escapeHtml(displayAmount)}</div>
        </div>
      </div>

      ${
        donation.donorAddress
          ? `<div class="section">
              <h3>Donor Address</h3>
              <p class="paragraph">${escapeHtml(donation.donorAddress)}</p>
            </div>`
          : ''
      }

      ${
        isItem
          ? `<div class="section">
              <h3>In-Kind Donation Description</h3>
              <p class="paragraph">${escapeHtml(donation.itemDescription || 'In-kind contribution')}</p>
            </div>`
          : ''
      }

      ${
        donation.acknowledgementNotes
          ? `<div class="section">
              <h3>Additional Acknowledgement Notes</h3>
              <p class="paragraph">${escapeHtml(donation.acknowledgementNotes)}</p>
            </div>`
          : ''
      }

      <div class="section">
        <h3>Your Impact</h3>
        <p class="paragraph">
Your contribution supports CreatorLaunch programs that help young people move from idea to action. It helps us create practical entrepreneurship experiences, provide access to tools and resources, support student business launches, and build a platform where youth creators can grow safely and confidently.
        </p>
      </div>

      <div class="notice">
        <strong>Tax acknowledgement:</strong> CreatorLaunch is a tax-exempt nonprofit organization.
        No goods or services were provided in exchange for this contribution.
        ${
          isItem
            ? ' For in-kind contributions, the donor is responsible for determining the tax-deductible value of donated goods.'
            : ''
        }
        Please keep this acknowledgement for your records.
      </div>

      <div class="signature">
        <div>
          <div class="signature-message">With gratitude,</div>
          <div class="signature-name">The CreatorLaunch Team</div>
        </div>

        <div class="tagline">
          Building the next<br />
          generation of founders
        </div>
      </div>

      <div class="footer">
        ${escapeHtml(legalName)} • Donation acknowledgement generated by CreatorLaunch Admin • ${escapeHtml(receiptNumber)}
      </div>
    </div>
  </div>
</body>
</html>
`;
  };

  const printSheet = (donation: AdminDonation) => {
    const printWindow = window.open('', '_blank');

    if (!printWindow) {
      setError('Popup blocked. Please allow popups to print acknowledgement sheets.');
      return;
    }

    printWindow.document.write(buildPrintableSheet(donation));
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
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
            <p>Track Stripe donations, invalidate records, and issue numbered acknowledgement sheets.</p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button onClick={openCreateManualModal} className="admin-btn">
              <FiPlusCircle />
              New Acknowledgement Sheet
            </button>

            <button onClick={loadDonations} className="admin-btn secondary">
              <FiRefreshCw />
              Refresh
            </button>
          </div>
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
            <p className="admin-stat-label">Total Valid Paid Donations</p>
            <p className="admin-stat-change">Invalidated records excluded</p>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-header">
              <div className="admin-stat-icon users">
                <FiCheckCircle />
              </div>
            </div>
            <h3 className="admin-stat-value">{stats.paidCount}</h3>
            <p className="admin-stat-label">Paid / Issued Records</p>
            <p className="admin-stat-change">Stripe + manual</p>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-header">
              <div className="admin-stat-icon stores">
                <FiFileText />
              </div>
            </div>
            <h3 className="admin-stat-value">{stats.manualSheetCount}</h3>
            <p className="admin-stat-label">Manual Sheets</p>
            <p className="admin-stat-change">Cash and item acknowledgements</p>
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
              {failedOrExpiredCount} failed/expired • {stats.invalidatedCount} invalidated
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-col xl:flex-row gap-4 xl:items-center xl:justify-between">
            <div className="flex rounded-lg border overflow-hidden w-full xl:w-auto">
              <button
                type="button"
                onClick={() => setViewMode('payments')}
                className={`px-4 py-2 font-semibold ${
                  viewMode === 'payments' ? 'bg-primary text-white' : 'bg-white text-gray-700'
                }`}
              >
                Payment Records
              </button>
              <button
                type="button"
                onClick={() => setViewMode('sheets')}
                className={`px-4 py-2 font-semibold ${
                  viewMode === 'sheets' ? 'bg-primary text-white' : 'bg-white text-gray-700'
                }`}
              >
                Issued Sheets
              </button>
            </div>

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
                <option value="paid">Paid / Issued</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
                <option value="expired">Expired</option>
                <option value="refunded">Refunded</option>
                <option value="invalidated">Invalidated</option>
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
                <option value="stripe">Stripe</option>
                <option value="manual">Manual</option>
                <option value="cash">Cash</option>
                <option value="item">Items</option>
                <option value="recurring">Monthly</option>
                <option value="one_time">One-time</option>
              </select>
            </div>
          </div>
        </div>

        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>{viewMode === 'sheets' ? 'Sheet / Donor' : 'Donor'}</th>
                <th>Amount / Type</th>
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
                      {viewMode === 'sheets' && (
                        <p className="font-semibold text-primary">
                          {donation.receiptNumber || 'No receipt number'}
                        </p>
                      )}
                      <p className="font-semibold">
                        {donation.anonymous ? 'Anonymous' : donation.donorName || 'Supporter'}
                      </p>
                      <p className="text-sm text-gray-500">{donation.donorEmail || 'No email'}</p>
                      {donation.itemDescription && (
                        <p className="text-xs text-gray-500 mt-1 max-w-xs truncate">
                          {donation.itemDescription}
                        </p>
                      )}
                    </div>
                  </td>

                  <td>
                    <div>
                      <p className="font-semibold">
                        {formatCurrency(donation.amount || donation.estimatedValue || 0, donation.currency)}
                      </p>
                      <p className="text-xs text-gray-500 capitalize">
                        {donation.source} • {donation.donationKind}
                        {donation.recurring ? ' • monthly' : ''}
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
                    {donation.paymentStatus === 'invalidated' && (
                      <p className="text-xs text-red-600 mt-1 max-w-xs truncate">
                        {donation.invalidationReason || 'Invalidated'}
                      </p>
                    )}
                  </td>

                  <td>
                    <div>
                      <p className="text-sm font-medium">
                        {donation.receiptNumber || '—'}
                      </p>

                      {donation.taxReceiptSent ? (
                        <p className="text-xs text-green-600">
                          Emailed {formatDate(donation.taxReceiptSentAt)}
                        </p>
                      ) : (
                        <p className="text-xs text-gray-500">Not emailed</p>
                      )}
                    </div>
                  </td>

                  <td>
                    <div>
                      <p className="text-sm">
                        {formatDate(donation.receivedDate || donation.paidAt || donation.createdAt)}
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
                        onClick={() => setViewingSheet(donation)}
                        className="admin-btn secondary text-sm"
                      >
                        <FiEye />
                        Open
                      </button>

                      <button
                        type="button"
                        onClick={() => printSheet(donation)}
                        className="admin-btn secondary text-sm"
                      >
                        <FiPrinter />
                        Print
                      </button>

                      {donation.source === 'manual' && donation.paymentStatus !== 'invalidated' && (
                        <button
                          type="button"
                          onClick={() => openEditManualModal(donation)}
                          className="admin-btn secondary text-sm"
                        >
                          <FiEdit2 />
                          Edit
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => resendReceipt(donation.id)}
                        disabled={
                          donation.paymentStatus !== 'paid' ||
                          !donation.donorEmail ||
                          resendingId === donation.id
                        }
                        className="admin-btn secondary text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <FiMail />
                        {resendingId === donation.id ? 'Sending...' : 'Email'}
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

                      {donation.paymentStatus !== 'invalidated' && (
                        <button
                          type="button"
                          onClick={() => invalidateDonation(donation)}
                          disabled={invalidatingId === donation.id}
                          className="admin-btn danger text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <FiSlash />
                          {invalidatingId === donation.id ? 'Invalidating...' : 'Invalidate'}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}

              {filteredDonations.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-gray-500">
                    <FiXCircle className="mx-auto mb-2 text-2xl" />
                    No donation records match your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-6 bg-blue-50 border border-blue-200 text-blue-800 rounded-lg p-4 text-sm">
          Showing {filteredDonations.length} of {baseDonations.length} records in{' '}
          <strong>{viewMode === 'payments' ? 'Payment Records' : 'Issued Sheets'}</strong> view.
          Invalidated records stay stored for audit/history but are excluded from valid paid totals.
        </div>

        {showManualModal && (
          <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">
                    {editingDonation ? 'Edit Acknowledgement Sheet' : 'New Acknowledgement Sheet'}
                  </h2>
                  <p className="text-gray-500 text-sm">
                    For cash, check, item, or other offline donations.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowManualModal(false)}
                  className="text-gray-500 hover:text-gray-800"
                >
                  <FiXCircle size={24} />
                </button>
              </div>

              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-1">Donation Kind</label>
                  <select
                    value={manualForm.donationKind}
                    onChange={(event) =>
                      setManualForm((prev) => ({
                        ...prev,
                        donationKind: event.target.value as 'cash' | 'item',
                      }))
                    }
                    className="w-full border rounded-lg px-3 py-2"
                  >
                    <option value="cash">Cash / Money</option>
                    <option value="item">Item / In-kind</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-1">Received Date</label>
                  <input
                    type="date"
                    value={manualForm.receivedDate}
                    onChange={(event) =>
                      setManualForm((prev) => ({ ...prev, receivedDate: event.target.value }))
                    }
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-1">Donor Name</label>
                  <input
                    type="text"
                    value={manualForm.donorName}
                    onChange={(event) =>
                      setManualForm((prev) => ({ ...prev, donorName: event.target.value }))
                    }
                    className="w-full border rounded-lg px-3 py-2"
                    placeholder="Donor name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-1">Donor Email</label>
                  <input
                    type="email"
                    value={manualForm.donorEmail}
                    onChange={(event) =>
                      setManualForm((prev) => ({ ...prev, donorEmail: event.target.value }))
                    }
                    className="w-full border rounded-lg px-3 py-2"
                    placeholder="Optional, needed for email receipt"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-1">Donor Phone</label>
                  <input
                    type="text"
                    value={manualForm.donorPhone}
                    onChange={(event) =>
                      setManualForm((prev) => ({ ...prev, donorPhone: event.target.value }))
                    }
                    className="w-full border rounded-lg px-3 py-2"
                    placeholder="Optional"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-1">Campaign / Fund</label>
                  <input
                    type="text"
                    value={manualForm.campaign}
                    onChange={(event) =>
                      setManualForm((prev) => ({ ...prev, campaign: event.target.value }))
                    }
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>

                {manualForm.donationKind === 'cash' ? (
                  <>
                    <div>
                      <label className="block text-sm font-semibold mb-1">Amount</label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={manualForm.amount}
                        onChange={(event) =>
                          setManualForm((prev) => ({ ...prev, amount: event.target.value }))
                        }
                        className="w-full border rounded-lg px-3 py-2"
                        placeholder="0.00"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold mb-1">Payment Method</label>
                      <select
                        value={manualForm.paymentMethod}
                        onChange={(event) =>
                          setManualForm((prev) => ({
                            ...prev,
                            paymentMethod: event.target.value as ManualDonationForm['paymentMethod'],
                          }))
                        }
                        className="w-full border rounded-lg px-3 py-2"
                      >
                        <option value="cash">Cash</option>
                        <option value="check">Check</option>
                        <option value="money_order">Money Order</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <label className="block text-sm font-semibold mb-1">Estimated Value</label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={manualForm.estimatedValue}
                        onChange={(event) =>
                          setManualForm((prev) => ({ ...prev, estimatedValue: event.target.value }))
                        }
                        className="w-full border rounded-lg px-3 py-2"
                        placeholder="Optional"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold mb-1">Item Description</label>
                      <textarea
                        value={manualForm.itemDescription}
                        onChange={(event) =>
                          setManualForm((prev) => ({ ...prev, itemDescription: event.target.value }))
                        }
                        className="w-full border rounded-lg px-3 py-2 min-h-[90px]"
                        placeholder="Describe the donated item(s)."
                      />
                    </div>
                  </>
                )}

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold mb-1">Donor Address</label>
                  <textarea
                    value={manualForm.donorAddress}
                    onChange={(event) =>
                      setManualForm((prev) => ({ ...prev, donorAddress: event.target.value }))
                    }
                    className="w-full border rounded-lg px-3 py-2 min-h-[70px]"
                    placeholder="Optional"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold mb-1">Acknowledgement Notes</label>
                  <textarea
                    value={manualForm.acknowledgementNotes}
                    onChange={(event) =>
                      setManualForm((prev) => ({ ...prev, acknowledgementNotes: event.target.value }))
                    }
                    className="w-full border rounded-lg px-3 py-2 min-h-[80px]"
                    placeholder="Optional notes shown on the sheet."
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold mb-1">Internal Notes</label>
                  <textarea
                    value={manualForm.internalNotes}
                    onChange={(event) =>
                      setManualForm((prev) => ({ ...prev, internalNotes: event.target.value }))
                    }
                    className="w-full border rounded-lg px-3 py-2 min-h-[80px]"
                    placeholder="Private admin notes."
                  />
                </div>

                <label className="md:col-span-2 flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={manualForm.anonymous}
                    onChange={(event) =>
                      setManualForm((prev) => ({ ...prev, anonymous: event.target.checked }))
                    }
                  />
                  Mark donor as anonymous publicly/admin display
                </label>
              </div>

              <div className="p-6 border-t flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowManualModal(false)}
                  className="admin-btn secondary"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={saveManualDonation}
                  disabled={savingManual}
                  className="admin-btn disabled:opacity-50"
                >
                  <FiFileText />
                  {savingManual ? 'Saving...' : editingDonation ? 'Save Sheet' : 'Create Numbered Sheet'}
                </button>
              </div>
            </div>
          </div>
        )}

        {viewingSheet && (
          <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">Acknowledgement Sheet</h2>
                  <p className="text-primary font-semibold">
                    {viewingSheet.receiptNumber || 'No receipt number'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setViewingSheet(null)}
                  className="text-gray-500 hover:text-gray-800"
                >
                  <FiXCircle size={24} />
                </button>
              </div>

              <div className="p-6 space-y-4">
                {viewingSheet.paymentStatus === 'invalidated' && (
                  <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 font-semibold">
                    INVALIDATED: {viewingSheet.invalidationReason || 'No reason provided.'}
                  </div>
                )}

                <div className="bg-gradient-to-br from-red-50 to-blue-50 border border-red-100 rounded-xl p-5">
                  <h3 className="text-xl font-bold mb-2">Thank you for supporting young founders.</h3>
                  <p className="text-gray-700 text-sm">
                    This acknowledgement helps document support for CreatorLaunch’s youth-led mission:
                    helping students learn real business skills, build real ventures, and launch with confidence.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs uppercase text-gray-500 font-bold">Donor</p>
                    <p>{viewingSheet.anonymous ? 'Anonymous' : viewingSheet.donorName || 'Supporter'}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase text-gray-500 font-bold">Email</p>
                    <p>{viewingSheet.donorEmail || '—'}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase text-gray-500 font-bold">Amount / Value</p>
                    <p>{formatCurrency(viewingSheet.amount || viewingSheet.estimatedValue || 0)}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase text-gray-500 font-bold">Type</p>
                    <p className="capitalize">
                      {viewingSheet.source} • {viewingSheet.donationKind}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs uppercase text-gray-500 font-bold">Campaign</p>
                    <p>{viewingSheet.campaign || 'General Fund'}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase text-gray-500 font-bold">Date</p>
                    <p>{formatDate(viewingSheet.receivedDate || viewingSheet.paidAt || viewingSheet.createdAt)}</p>
                  </div>
                </div>

                {viewingSheet.itemDescription && (
                  <div>
                    <p className="text-xs uppercase text-gray-500 font-bold">Item Description</p>
                    <p>{viewingSheet.itemDescription}</p>
                  </div>
                )}

                {viewingSheet.acknowledgementNotes && (
                  <div>
                    <p className="text-xs uppercase text-gray-500 font-bold">Acknowledgement Notes</p>
                    <p>{viewingSheet.acknowledgementNotes}</p>
                  </div>
                )}

                {viewingSheet.internalNotes && (
                  <div>
                    <p className="text-xs uppercase text-gray-500 font-bold">Internal Notes</p>
                    <p>{viewingSheet.internalNotes}</p>
                  </div>
                )}
              </div>

              <div className="p-6 border-t flex flex-wrap justify-end gap-3">
                <button
                  type="button"
                  onClick={() => printSheet(viewingSheet)}
                  className="admin-btn secondary"
                >
                  <FiPrinter />
                  Print
                </button>

                {viewingSheet.source === 'manual' && viewingSheet.paymentStatus !== 'invalidated' && (
                  <button
                    type="button"
                    onClick={() => {
                      setViewingSheet(null);
                      openEditManualModal(viewingSheet);
                    }}
                    className="admin-btn secondary"
                  >
                    <FiEdit2 />
                    Edit
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setViewingSheet(null)}
                  className="admin-btn"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminDonationsPage;