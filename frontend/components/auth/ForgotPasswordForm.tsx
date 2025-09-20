import React, { useState } from 'react';
import Link from 'next/link';
import { authAPI } from '../../utils/api';

// ################## ----- FORGOT PASSWORD FORM COMPONENT ----- ##################
// Password reset request form with email and DOB verification
// Handles the initial step of the password recovery process
// ##########################################################################
export const ForgotPasswordForm = () => {
  const [email, setEmail] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // ################## ----- PASSWORD RESET REQUEST HANDLER ----- ##################
  // Processes forgot password form submission
  // Validates user info and sends password reset email
  // ####################################################################
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await authAPI.forgotPassword(email, dateOfBirth);
      setIsSubmitted(true);
    } catch (err: any) {
      console.error('Forgot password error:', err);
      setError(err.response?.data?.message || 'Failed to send reset email. Please check your email address and date of birth.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="text-center">
        <div className="mb-8">
          <div 
            className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
            style={{ backgroundColor: '#e7f3ff' }}
          >
            <svg 
              className="w-8 h-8" 
              style={{ color: '#007bff' }} 
              fill="currentColor" 
              viewBox="0 0 20 20"
            >
              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-2" style={{ color: '#2D3748' }}>
            Check Your Email
          </h2>
          <p style={{ color: '#4A5568' }} className="mb-6">
            We've sent a password reset link to <strong>{email}</strong>
          </p>
        </div>

        <div className="space-y-4">
          <p className="text-sm" style={{ color: '#666' }}>
            Didn't receive the email? Check your spam folder or{' '}
            <button 
              onClick={() => {
                setIsSubmitted(false);
                setEmail('');
                setDateOfBirth('');
              }}
              className="font-bold hover:underline"
              style={{ color: '#007bff' }}
            >
              try again
            </button>
          </p>
          
          <Link 
            href="/auth/login" 
            className="inline-block w-full px-6 py-3 rounded-lg border font-bold hover:opacity-90 transition-opacity"
            style={{ 
              borderColor: '#007bff', 
              color: '#007bff',
              backgroundColor: 'transparent'
            }}
          >
            Back to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg text-center">
          {error}
        </div>
      )}

      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2" style={{ color: '#2D3748' }}>
          Forgot Password?
        </h2>
        <p style={{ color: '#4A5568' }}>
          Enter your email address and date of birth to verify your identity and we'll send you a link to reset your password.
        </p>
      </div>

      <div>
        <label htmlFor="email" className="block text-left font-bold mb-2" style={{ color: '#333' }}>
          Email Address
        </label>
        <input 
          id="email" 
          type="email" 
          value={email} 
          onChange={e => setEmail(e.target.value)} 
          placeholder="you@example.com" 
          required 
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2"
          style={{ 
            backgroundColor: '#f8f9fa', 
            color: '#333',
            fontSize: '16px'
          }}
        />
      </div>

      <div>
        <label htmlFor="dateOfBirth" className="block text-left font-bold mb-2" style={{ color: '#333' }}>
          Date of Birth
        </label>
        <input 
          id="dateOfBirth" 
          type="date" 
          value={dateOfBirth} 
          onChange={e => setDateOfBirth(e.target.value)} 
          required 
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2"
          style={{ 
            backgroundColor: '#f8f9fa', 
            color: '#333',
            fontSize: '16px'
          }}
        />
      </div>

      <div className="text-center pt-4">
        <button
          type="submit"
          disabled={isLoading}
          className="w-full px-12 py-4 rounded-lg text-white font-bold text-lg hover:opacity-90 transition-opacity disabled:opacity-50"
          style={{ backgroundColor: '#007bff' }}
        >
          {isLoading ? 'Sending...' : 'Send Reset Link'}
        </button>
      </div>

      <div className="text-center space-y-4">
        <Link 
          href="/auth/login" 
          className="block font-bold hover:underline" 
          style={{ color: '#007bff' }}
        >
          Back to Login
        </Link>
        
        <p style={{ color: '#666' }}>
          Don't have an account?{' '}
          <Link href="/auth/register" className="font-bold hover:underline" style={{ color: '#007bff' }}>
            Sign up
          </Link>
        </p>
      </div>
    </form>
  );
};
