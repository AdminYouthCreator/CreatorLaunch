import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/common/Layout';
import api from '@/utils/api';

interface CertificateResult {
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
}

const VerifyCertificatePage = () => {
  const router = useRouter();
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [valid, setValid] = useState<boolean | null>(null);
  const [certificate, setCertificate] = useState<CertificateResult | null>(null);

  useEffect(() => {
    const queryCode = typeof router.query.code === 'string' ? router.query.code : '';
    if (queryCode) {
      setCode(queryCode.toUpperCase());
    }
  }, [router.query.code]);

  useEffect(() => {
    const queryCode = typeof router.query.code === 'string' ? router.query.code : '';
    if (!queryCode) return;

    const verifyFromQuery = async () => {
      setLoading(true);
      setMessage('');
      setValid(null);
      setCertificate(null);
      try {
        const response = await api.get(`/api/certificates/verify/${encodeURIComponent(queryCode.trim().toUpperCase())}`);
        setValid(Boolean(response.data.valid));
        setMessage(response.data.message || 'Verification complete.');
        setCertificate(response.data.certificate || null);
      } catch (error: any) {
        setValid(false);
        setMessage(error?.response?.data?.message || 'We could not verify that certificate code.');
        setCertificate(error?.response?.data?.certificate || null);
      } finally {
        setLoading(false);
      }
    };

    verifyFromQuery();
  }, [router.query.code]);

  const handleVerify = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!code.trim()) return;

    setLoading(true);
    setMessage('');
    setValid(null);
    setCertificate(null);

    try {
      const response = await api.get(`/api/certificates/verify/${encodeURIComponent(code.trim().toUpperCase())}`);
      setValid(Boolean(response.data.valid));
      setMessage(response.data.message || 'Verification complete.');
      setCertificate(response.data.certificate || null);
    } catch (error: any) {
      setValid(false);
      setMessage(error?.response?.data?.message || 'We could not verify that certificate code.');
      setCertificate(error?.response?.data?.certificate || null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title="Verify a CreatorLaunch Certificate" description="Verify whether a certificate code was officially issued by CreatorLaunch.">
      <main className="min-h-screen bg-white">
        <section className="bg-gradient-to-br from-white via-red-50 to-orange-50 py-20">
          <div className="container mx-auto px-4 text-center">
            <p className="text-primary font-semibold mb-3">CreatorLaunch Certificate Verification</p>
            <h1 className="text-4xl md:text-6xl font-bold text-dark mb-6">Verify a Certificate</h1>
            <p className="text-lg md:text-xl text-medium max-w-3xl mx-auto">
              Enter the certificate code to confirm whether it is an official CreatorLaunch certificate.
            </p>
          </div>
        </section>

        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto grid lg:grid-cols-[0.95fr_1.05fr] gap-8">
              <div className="bg-light rounded-3xl p-8 border border-gray-100 shadow-sm">
                <h2 className="text-2xl font-bold text-dark mb-4">Enter Certificate Code</h2>
                <form onSubmit={handleVerify} className="space-y-4">
                  <input
                    className="w-full rounded-xl border border-gray-200 px-4 py-4 text-lg uppercase"
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    placeholder="Example: CL-2026-ABC123"
                  />
                  <button type="submit" disabled={loading} className="w-full bg-primary text-white px-6 py-4 rounded-xl font-semibold hover:bg-red-600 transition-colors disabled:opacity-70">
                    {loading ? 'Verifying...' : 'Verify Certificate'}
                  </button>
                </form>

                {message ? (
                  <div className={`mt-6 rounded-2xl p-4 ${valid ? 'bg-green-50 text-green-800 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
                    <p className="font-medium">{message}</p>
                  </div>
                ) : null}
              </div>

              <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
                <h2 className="text-2xl font-bold text-dark mb-4">Verification Result</h2>
                {!certificate ? (
                  <p className="text-medium">When a valid code is entered, the certificate details will appear here.</p>
                ) : (
                  <div className="space-y-4">
                    <div className={`inline-flex px-4 py-2 rounded-full text-sm font-semibold ${certificate.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-700'}`}>
                      {certificate.status === 'active' ? 'Valid Certificate' : 'Inactive Certificate'}
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="bg-light rounded-2xl p-4">
                        <p className="text-xs uppercase tracking-wide text-medium mb-1">Recipient</p>
                        <p className="font-semibold text-dark">{certificate.recipientName}</p>
                      </div>
                      <div className="bg-light rounded-2xl p-4">
                        <p className="text-xs uppercase tracking-wide text-medium mb-1">Certificate Title</p>
                        <p className="font-semibold text-dark">{certificate.certificateTitle}</p>
                      </div>
                      <div className="bg-light rounded-2xl p-4">
                        <p className="text-xs uppercase tracking-wide text-medium mb-1">Issued For</p>
                        <p className="font-semibold text-dark">{certificate.issuedFor || '—'}</p>
                      </div>
                      <div className="bg-light rounded-2xl p-4">
                        <p className="text-xs uppercase tracking-wide text-medium mb-1">Issue Date</p>
                        <p className="font-semibold text-dark">{new Date(certificate.issueDate).toLocaleDateString()}</p>
                      </div>
                    </div>

                    <div className="bg-light rounded-2xl p-4">
                      <p className="text-xs uppercase tracking-wide text-medium mb-1">Description</p>
                      <p className="text-dark">{certificate.description || 'No description provided.'}</p>
                    </div>

                    {certificate.statusReason ? (
                      <div className="bg-red-50 rounded-2xl p-4 border border-red-100 text-red-700">
                        <p className="font-semibold mb-1">Status Note</p>
                        <p>{certificate.statusReason}</p>
                      </div>
                    ) : null}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
};

export default VerifyCertificatePage;