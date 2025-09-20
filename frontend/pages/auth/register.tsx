// ################## ----- REGISTER PAGE ----- ##################
// User registration page with account creation form
// Handles new user signup and age verification
// ############################################################
import React from 'react';
import { RegisterForm } from '@/components/auth/RegisterForm';
import Layout from '@/components/common/Layout';

// ################## ----- REGISTER PAGE COMPONENT ----- ##################
// Main registration page with form and layout wrapper
// Manages user account creation and onboarding entry
// ##########################################################
export default function RegisterPage() {
  return (
    <Layout
      title="Register | CreatorLaunch"
      description="Create an account to join CreatorLaunch workshops."
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
            <div className="text-center mb-8">
              <h2 className="text-4xl font-black" style={{ color: '#2D3748' }}>Create Your Account</h2>
              <p className="mt-2" style={{ color: '#4A5568' }}>Join our community of young entrepreneurs.</p>
            </div>
            <RegisterForm />
          </div>
        </div>
      </section>
    </Layout>
  );
}
