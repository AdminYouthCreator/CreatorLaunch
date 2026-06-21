import React, { useEffect, useMemo, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import AdminLogin from '@/components/admin/AdminLogin';
import api from '@/utils/api';

interface Certificate {
  id: string;
  code: string;
  recipientName: string;
  recipientEmail: string;
  certificateTitle: string;
  issuedFor: string;
  description: string;
  issueDate: string;
  issuedByName: string;
  issuedByEmail: string;
  status: 'active' | 'revoked';
  statusReason?: string;
  createdAt: string;
}

const emptyForm = {
  recipientName: '',
  recipientEmail: '',
  certificateTitle: '',
  issuedFor: '',
  description: '',
  issueDate: new Date().toISOString().slice(0, 10),
  issuedByName: 'CreatorLaunch Staff',
  issuedByEmail: 'qwentin@youthcreatorlaunch.org',
};

const AdminCertificatesPage: React.FC = () => {
  const { isLoading, isAuthenticated } = useAdminAuth();
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);

  const fetchCertificates = async () => {
    try {
      const response = await api.get('/api/certificates/admin', {
        params: {
          q: search,
          status: statusFilter,
        },
      });
      setCertificates(response.data.certificates || []);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to load certificates.');
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchCertificates();
    }
  }, [isAuthenticated]);

  const createCertificate = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await api.post('/api/certificates/admin', form);
      const certificate = response.data.certificate as Certificate;
      setMessage('Certificate created successfully.');
      setSelectedCertificate(certificate);
      setForm(emptyForm);
      setCertificates((current) => [certificate, ...current]);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Could not create certificate.');
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (certificate: Certificate) => {
    const nextStatus = certificate.status === 'active' ? 'revoked' : 'active';
    const statusReason =
      nextStatus === 'revoked'
        ? window.prompt('Optional reason for revoking this certificate:', certificate.statusReason || '') || ''
        : '';

    try {
      const response = await api.patch(`/api/certificates/admin/${certificate.id}/status`, {
        status: nextStatus,
        statusReason,
      });
      const updated = response.data.certificate as Certificate;
      setCertificates((current) => current.map((item) => (item.id === updated.id ? updated : item)));
      if (selectedCertificate?.id === updated.id) {
        setSelectedCertificate(updated);
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Could not update certificate status.');
    }
  };

  const filteredSummary = useMemo(() => {
    const total = certificates.length;
    const active = certificates.filter((item) => item.status === 'active').length;
    const revoked = certificates.filter((item) => item.status === 'revoked').length;
    return { total, active, revoked };
  }, [certificates]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-20 w-20 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminLogin />;
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="grid xl:grid-cols-[1.05fr_0.95fr] gap-8">
          <div className="admin-card">
            <div className="admin-card-header">
              <div>
                <h3>Create Certificate</h3>
                <p>Generate an official CreatorLaunch certificate with a public verification code.</p>
              </div>
            </div>

            <form onSubmit={createCertificate} className="space-y-4 mt-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium mb-2">Recipient Name</label>
                  <input className="w-full border rounded-lg px-4 py-3" value={form.recipientName} onChange={(e) => setForm((current) => ({ ...current, recipientName: e.target.value }))} required />
                </div>
                <div>
                  <label className="block font-medium mb-2">Recipient Email</label>
                  <input className="w-full border rounded-lg px-4 py-3" value={form.recipientEmail} onChange={(e) => setForm((current) => ({ ...current, recipientEmail: e.target.value }))} />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium mb-2">Certificate Title</label>
                  <input className="w-full border rounded-lg px-4 py-3" value={form.certificateTitle} onChange={(e) => setForm((current) => ({ ...current, certificateTitle: e.target.value }))} required />
                </div>
                <div>
                  <label className="block font-medium mb-2">Issued For</label>
                  <input className="w-full border rounded-lg px-4 py-3" value={form.issuedFor} onChange={(e) => setForm((current) => ({ ...current, issuedFor: e.target.value }))} placeholder="Workshop, bootcamp, cohort, etc." />
                </div>
              </div>

              <div>
                <label className="block font-medium mb-2">Description</label>
                <textarea rows={4} className="w-full border rounded-lg px-4 py-3" value={form.description} onChange={(e) => setForm((current) => ({ ...current, description: e.target.value }))} placeholder="What did they complete or earn?" />
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block font-medium mb-2">Issue Date</label>
                  <input type="date" className="w-full border rounded-lg px-4 py-3" value={form.issueDate} onChange={(e) => setForm((current) => ({ ...current, issueDate: e.target.value }))} />
                </div>
                <div>
                  <label className="block font-medium mb-2">Issued By</label>
                  <input className="w-full border rounded-lg px-4 py-3" value={form.issuedByName} onChange={(e) => setForm((current) => ({ ...current, issuedByName: e.target.value }))} />
                </div>
                <div>
                  <label className="block font-medium mb-2">Issuer Email</label>
                  <input className="w-full border rounded-lg px-4 py-3" value={form.issuedByEmail} onChange={(e) => setForm((current) => ({ ...current, issuedByEmail: e.target.value }))} />
                </div>
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                <button type="submit" className="px-6 py-3 rounded-lg bg-red-500 text-white font-semibold" disabled={loading}>
                  {loading ? 'Creating...' : 'Create Certificate'}
                </button>
                <button type="button" className="px-6 py-3 rounded-lg border font-semibold" onClick={() => setForm(emptyForm)}>
                  Reset
                </button>
              </div>

              {message ? <p className="text-green-700 font-medium">{message}</p> : null}
              {error ? <p className="text-red-600 font-medium">{error}</p> : null}
            </form>
          </div>

          <div className="space-y-6">
            <div className="admin-card">
              <div className="admin-card-header">
                <div>
                  <h3>Certificate Summary</h3>
                  <p>Track what has been issued and what is currently valid.</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 mt-6">
                <div className="rounded-2xl bg-slate-50 p-4 border">
                  <p className="text-sm text-gray-500">Total</p>
                  <p className="text-3xl font-bold">{filteredSummary.total}</p>
                </div>
                <div className="rounded-2xl bg-green-50 p-4 border border-green-100">
                  <p className="text-sm text-green-700">Active</p>
                  <p className="text-3xl font-bold text-green-800">{filteredSummary.active}</p>
                </div>
                <div className="rounded-2xl bg-red-50 p-4 border border-red-100">
                  <p className="text-sm text-red-700">Revoked</p>
                  <p className="text-3xl font-bold text-red-800">{filteredSummary.revoked}</p>
                </div>
              </div>
            </div>

            <div className="admin-card">
              <div className="admin-card-header">
                <div>
                  <h3>Printable Preview</h3>
                  <p>Use this after generating a certificate.</p>
                </div>
              </div>
              {!selectedCertificate ? (
                <p className="text-gray-500 mt-6">Create a certificate or select one from the list to preview it.</p>
              ) : (
                <div className="mt-6 border rounded-2xl p-8 bg-gradient-to-br from-white to-red-50">
                  <p className="text-center text-sm uppercase tracking-[0.25em] text-primary font-semibold">CreatorLaunch Certificate</p>
                  <h2 className="text-center text-3xl font-bold mt-4 text-slate-900">Certificate of Achievement</h2>
                  <p className="text-center text-gray-500 mt-3">This certifies that</p>
                  <p className="text-center text-3xl font-black mt-4 text-slate-900">{selectedCertificate.recipientName}</p>
                  <p className="text-center text-lg mt-4 text-slate-700">has been awarded</p>
                  <p className="text-center text-2xl font-bold mt-2 text-primary">{selectedCertificate.certificateTitle}</p>
                  {selectedCertificate.issuedFor ? (
                    <p className="text-center text-slate-700 mt-3">for <strong>{selectedCertificate.issuedFor}</strong></p>
                  ) : null}
                  {selectedCertificate.description ? (
                    <p className="text-center text-slate-600 mt-4 max-w-xl mx-auto">{selectedCertificate.description}</p>
                  ) : null}
                  <div className="grid md:grid-cols-2 gap-4 mt-8 text-sm">
                    <div>
                      <p className="font-semibold text-slate-900">Issued by</p>
                      <p className="text-slate-600">{selectedCertificate.issuedByName}</p>
                    </div>
                    <div className="text-left md:text-right">
                      <p className="font-semibold text-slate-900">Verification code</p>
                      <p className="text-slate-600">{selectedCertificate.code}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-3 mt-6">
                    <button type="button" className="px-5 py-3 rounded-lg bg-slate-900 text-white font-semibold" onClick={() => window.print()}>
                      Print Certificate
                    </button>
                    <a href={`/verify-certificate?code=${encodeURIComponent(selectedCertificate.code)}`} target="_blank" rel="noreferrer" className="px-5 py-3 rounded-lg border font-semibold">
                      Open Public Verification
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="admin-card">
          <div className="admin-card-header">
            <div>
              <h3>Saved Certificates</h3>
              <p>Search, review, select, and revoke or reactivate certificates.</p>
            </div>
          </div>

          <div className="grid md:grid-cols-[1fr_220px_auto] gap-4 mt-6">
            <input className="border rounded-lg px-4 py-3" placeholder="Search by name, code, title, or email" value={search} onChange={(e) => setSearch(e.target.value)} />
            <select className="border rounded-lg px-4 py-3" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="">All statuses</option>
              <option value="active">Active</option>
              <option value="revoked">Revoked</option>
            </select>
            <button className="px-6 py-3 rounded-lg bg-slate-900 text-white font-semibold" onClick={fetchCertificates}>Refresh</button>
          </div>

          <div className="overflow-x-auto mt-6">
            <table className="min-w-full text-left border-separate border-spacing-y-3">
              <thead>
                <tr className="text-sm text-gray-500">
                  <th className="px-4">Recipient</th>
                  <th className="px-4">Title</th>
                  <th className="px-4">Code</th>
                  <th className="px-4">Status</th>
                  <th className="px-4">Issued</th>
                  <th className="px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {certificates.map((certificate) => (
                  <tr key={certificate.id} className="bg-white shadow-sm border">
                    <td className="px-4 py-4 align-top">
                      <p className="font-semibold text-slate-900">{certificate.recipientName}</p>
                      <p className="text-sm text-gray-500">{certificate.recipientEmail || 'No email provided'}</p>
                    </td>
                    <td className="px-4 py-4 align-top">
                      <p className="font-semibold text-slate-900">{certificate.certificateTitle}</p>
                      <p className="text-sm text-gray-500">{certificate.issuedFor || '—'}</p>
                    </td>
                    <td className="px-4 py-4 align-top font-mono text-sm">{certificate.code}</td>
                    <td className="px-4 py-4 align-top">
                      <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${certificate.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-700'}`}>
                        {certificate.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 align-top text-sm text-gray-600">{new Date(certificate.issueDate).toLocaleDateString()}</td>
                    <td className="px-4 py-4 align-top">
                      <div className="flex flex-wrap gap-2">
                        <button className="px-3 py-2 rounded-lg border text-sm font-semibold" onClick={() => setSelectedCertificate(certificate)}>Preview</button>
                        <button className="px-3 py-2 rounded-lg border text-sm font-semibold" onClick={() => toggleStatus(certificate)}>
                          {certificate.status === 'active' ? 'Revoke' : 'Reactivate'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!certificates.length ? <p className="text-gray-500 mt-4">No certificates found yet.</p> : null}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminCertificatesPage;