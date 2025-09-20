// pages/auth/forgot-password.tsx
import React from 'react';
import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm';
import Layout from '@/components/common/Layout';

export default function ForgotPasswordPage() {
  return (
    <Layout
      title="Forgot Password | CreatorLaunch"
      description="Reset your CreatorLaunch account password."
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
            <ForgotPasswordForm />
          </div>
        </div>
      </section>
    </Layout>
  );
}
