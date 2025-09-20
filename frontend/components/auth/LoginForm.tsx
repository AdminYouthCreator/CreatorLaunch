import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuthContext } from '../../context/AuthContext';

// ################## ----- LOGIN FORM COMPONENT ----- ##################
// User login form with email and password authentication
// Handles form validation and submission to authentication service
// ####################################################################
export const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuthContext();
  const router = useRouter();
  
  // Check if user was redirected from email verification
  const isVerified = router.query.verified === 'true';

  // ################## ----- FORM SUBMISSION HANDLER ----- ##################
  // Processes login form submission and handles authentication
  // Uses real API authentication through AuthContext
  // ####################################################################
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      
      // Check if user has completed onboarding after login
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      const hasCompletedOnboarding = userData.hasCompletedOnboarding || false;
      
      // Redirect based on onboarding status
      const redirectTo = router.query.redirect as string;
      if (redirectTo) {
        router.push(redirectTo);
      } else if (!hasCompletedOnboarding) {
        router.push('/onboarding');
      } else {
        router.push('/dashboard');
      }
    } catch (error: any) {
      console.error('Login failed:', error);
      setError(error.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="text-center mb-8">
        <h2 className="text-4xl font-black" style={{ color: '#2D3748' }}>Welcome Back</h2>
        <p className="mt-2" style={{ color: '#4A5568' }}>Login to access your CreatorLaunch account.</p>
      </div>

      {isVerified && (
        <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg text-center">
          ✅ Email verified successfully! You can now log in.
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg text-center">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label htmlFor="email" className="block text-left font-bold mb-2" style={{ color: '#2D3748' }}>
            Email Address
          </label>
          <input
            type="email"
            name="email"
            id="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2"
            style={{ 
              backgroundColor: '#F7F9FC', 
              color: '#333',
              fontSize: '16px'
            }}
            placeholder="you@example.com"
          />
        </div>

        <div className="mb-8">
          <label htmlFor="password" className="block text-left font-bold mb-2" style={{ color: '#2D3748' }}>
            Password
          </label>
          <input
            type="password"
            name="password"
            id="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2"
            style={{ 
              backgroundColor: '#F7F9FC', 
              color: '#333',
              fontSize: '16px'
            }}
            placeholder="••••••••"
          />
          <div className="text-right mt-2">
            <Link href="/auth/forgot-password" className="text-sm font-bold hover:underline" style={{ color: '#387ADF' }}>
              Forgot password?
            </Link>
          </div>
        </div>

        <div className="text-center">
          <button
            type="submit"
            disabled={loading}
            className={`w-full px-12 py-4 rounded-lg text-white font-bold text-lg transition-opacity ${
              loading ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'
            }`}
            style={{ backgroundColor: '#F55F55' }}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </div>

        <div className="text-center mt-4">
          <Link href="/auth/forgot-password" className="text-sm font-medium hover:underline" style={{ color: '#387ADF' }}>
            Forgot your password?
          </Link>
        </div>

        <p className="text-center mt-6" style={{ color: '#4A5568' }}>
          Don't have an account?{' '}
          <Link href="/auth/register" className="font-bold hover:underline" style={{ color: '#387ADF' }}>
            Sign up
          </Link>
        </p>
      </form>
    </>
  );
};
