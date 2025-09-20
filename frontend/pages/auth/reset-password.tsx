// pages/auth/reset-password.tsx
import React from 'react';
import { useRouter } from 'next/router';
import { ResetPasswordForm } from '@/components/auth/ResetPasswordForm';
import Layout from '@/components/common/Layout';

export default function ResetPasswordPage() {
  const router = useRouter();
  const { token } = router.query;

  return (
    <Layout
      title="Reset Password | CreatorLaunch"
      description="Create a new password for your CreatorLaunch account."
      showAnnouncement={false}
    >
      <section style={{ backgroundColor: '#F7F9FC', minHeight: '70vh' }} className="flex items-center justify-center py-20">
        <div className="max-w-4xl mx-auto px-6">
          <div 
            className="bg-white p-8 rounded-2xl shadow-lg"
            style={{
              width: '800px',
              maxWidth: '540px',
              minWidth: '540px',
              height: 'auto',
              margin: '0 auto'
            }}
          >
            <ResetPasswordForm token={token as string} />
          </div>
        </div>
      </section>
    </Layout>
  );
}
