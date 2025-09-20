// ################## ----- LOGIN PAGE ----- ##################
// Authentication page for user login
// Renders the login form within the main layout
// ##########################################################
import React from 'react';
import { LoginForm } from '@/components/auth/LoginForm';
import Layout from '@/components/common/Layout';

// ################## ----- LOGIN PAGE COMPONENT ----- ##################
// Main login page with form and layout wrapper
// Handles user authentication and login flow
// ##########################################################
export default function Login() {
  return (
    <Layout
      title="Login | CreatorLaunch"
      description="Login to your CreatorLaunch account."
      showAnnouncement={false}
    >
      <section 
        style={{ backgroundColor: '#F7F9FC', minHeight: '70vh' }} 
        className="flex items-center justify-center py-20"
      >
        <div className="max-w-md mx-auto px-6">
          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <LoginForm />
          </div>
        </div>
      </section>
    </Layout>
  );
}
