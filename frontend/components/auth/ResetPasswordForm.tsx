import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { authAPI } from '../../utils/api';

// ################## ----- RESET PASSWORD FORM PROPS ----- ##################
// Props interface for the password reset form component
// Accepts a token for validating the reset request
// ####################################################################
interface ResetPasswordFormProps {
  token?: string;
}

// ################## ----- RESET PASSWORD FORM COMPONENT ----- ##################
// Form for setting a new password using a reset token
// Handles password validation and confirmation matching
// ######################################################################
export const ResetPasswordForm = ({ token }: ResetPasswordFormProps) => {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // ################## ----- PASSWORD RESET SUBMISSION HANDLER ----- ##################
  // Processes new password submission with validation
  // Validates password strength and confirmation matching
  // ######################################################################
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Password strength validation
    if (password.length < 8) {
      return setError('Password must be at least 8 characters long.');
    }

    // Password confirmation validation
    if (password !== confirmPassword) {
      return setError('Passwords do not match.');
    }

    // Token validation
    if (!token) {
      return setError('Invalid reset token. Please request a new password reset.');
    }

    setIsLoading(true);

    try {
      await authAPI.resetPassword(token, password);
      setIsSubmitted(true);
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        router.push('/auth/login');
      }, 3000);
    } catch (err: any) {
      console.error('Reset password error:', err);
      setError(err.response?.data?.message || 'Failed to reset password. Please try again or request a new reset link.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="text-center">
        <div className="mb-8">
          <div 
            className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
            style={{ backgroundColor: '#fed7d7' }}
          >
            <svg 
              className="w-8 h-8" 
              style={{ color: '#e53e3e' }} 
              fill="currentColor" 
              viewBox="0 0 20 20"
            >
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-2" style={{ color: '#2D3748' }}>
            Invalid Reset Link
          </h2>
          <p style={{ color: '#4A5568' }} className="mb-6">
            This password reset link is invalid or has expired.
          </p>
        </div>

        <div className="space-y-4">
          <Link 
            href="/auth/forgot-password" 
            className="inline-block w-full px-6 py-3 rounded-lg text-white font-bold hover:opacity-90 transition-opacity"
            style={{ backgroundColor: '#007bff' }}
          >
            Request New Reset Link
          </Link>
          
          <Link 
            href="/auth/login" 
            className="block font-bold hover:underline" 
            style={{ color: '#007bff' }}
          >
            Back to Login
          </Link>
        </div>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="text-center">
        <div className="mb-8">
          <div 
            className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
            style={{ backgroundColor: '#c6f6d5' }}
          >
            <svg 
              className="w-8 h-8" 
              style={{ color: '#38a169' }} 
              fill="currentColor" 
              viewBox="0 0 20 20"
            >
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-2" style={{ color: '#2D3748' }}>
            Password Reset Successful
          </h2>
          <p style={{ color: '#4A5568' }} className="mb-6">
            Your password has been successfully reset. You'll be redirected to the login page in a moment.
          </p>
        </div>

        <Link 
          href="/auth/login" 
          className="inline-block w-full px-6 py-3 rounded-lg text-white font-bold hover:opacity-90 transition-opacity"
          style={{ backgroundColor: '#007bff' }}
        >
          Go to Login
        </Link>
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
          Reset Password
        </h2>
        <p style={{ color: '#4A5568' }}>
          Enter your new password below.
        </p>
      </div>

      <div>
        <label htmlFor="password" className="block text-left font-bold mb-2" style={{ color: '#333' }}>
          New Password
        </label>
        <input 
          id="password" 
          type="password" 
          value={password} 
          onChange={e => setPassword(e.target.value)} 
          placeholder="••••••••" 
          required 
          minLength={8}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2"
          style={{ 
            backgroundColor: '#f8f9fa', 
            color: '#333',
            fontSize: '16px'
          }}
        />
        <p className="text-sm mt-1" style={{ color: '#666' }}>
          Must be at least 8 characters long
        </p>
      </div>

      <div>
        <label htmlFor="confirmPassword" className="block text-left font-bold mb-2" style={{ color: '#333' }}>
          Confirm New Password
        </label>
        <input 
          id="confirmPassword" 
          type="password" 
          value={confirmPassword} 
          onChange={e => setConfirmPassword(e.target.value)} 
          placeholder="••••••••" 
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
          {isLoading ? 'Resetting...' : 'Reset Password'}
        </button>
      </div>

      <div className="text-center">
        <Link 
          href="/auth/login" 
          className="font-bold hover:underline" 
          style={{ color: '#007bff' }}
        >
          Back to Login
        </Link>
      </div>
    </form>
  );
};
