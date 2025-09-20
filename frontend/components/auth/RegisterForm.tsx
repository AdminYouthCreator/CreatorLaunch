import React, { useState, useEffect } from 'react';
import { useAuthContext } from '../../context/AuthContext';
import { useRouter } from 'next/router';
import Link from 'next/link';

// ################## ----- REGISTER FORM COMPONENT ----- ##################
// User registration form with age verification and guardian consent
// Handles both adult and minor registration workflows
// ####################################################################
export const RegisterForm = () => {
  const { register } = useAuthContext();
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [dob, setDob] = useState('');
  const [age, setAge] = useState<number | null>(null);
  const [needsConsent, setNeedsConsent] = useState(false);
  const [consentGiven, setConsentGiven] = useState(false);
  const [guardianEmail, setGuardianEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // ################## ----- AGE CALCULATION AND CONSENT CHECK ----- ##################
  // Effect to calculate user age and determine if guardian consent is needed
  // Automatically handles the consent requirement workflow
  // ##########################################################################
  useEffect(() => {
    if (!dob) {
      setAge(null);
      return;
    }
    const birth = new Date(dob);
    const diffMs = Date.now() - birth.getTime();
    const computed = Math.abs(new Date(diffMs).getUTCFullYear() - 1970);
    setAge(computed);
    setNeedsConsent(computed < 18);
    if (computed >= 18) {
      setConsentGiven(false);
      setGuardianEmail('');
    }
  }, [dob]);

  // ################## ----- FORM SUBMISSION HANDLER ----- ##################
  // Handles registration form submission with validation
  // Checks consent requirements and processes registration
  // ####################################################################
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validate consent requirements for minors
    if (needsConsent && !consentGiven) {
      setLoading(false);
      return setError('Guardian consent is required for users under 18.');
    }
    if (needsConsent && !guardianEmail) {
      setLoading(false);
      return setError('Please provide your guardian\'s email.');
    }

    try {
      await register({
        name,
        email,
        password,
        dob,
        guardianEmail: needsConsent ? guardianEmail : undefined
      });
      
      // Registration successful - show success message instead of redirect
      // User needs to verify email before they can log in
      alert('Registration successful! Please check your email to verify your account before logging in.');
      router.push('/auth/login');
    } catch (error: any) {
      console.error('Registration failed:', error);
      setError(error.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg text-center">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="name" className="block text-left font-bold mb-2" style={{ color: '#333' }}>Full Name</label>
        <input 
          id="name" 
          type="text" 
          value={name} 
          onChange={e => setName(e.target.value)} 
          placeholder="Your full name" 
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
        <label htmlFor="email" className="block text-left font-bold mb-2" style={{ color: '#333' }}>Email Address</label>
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
        <label htmlFor="password" className="block text-left font-bold mb-2" style={{ color: '#333' }}>Password</label>
        <input 
          id="password" 
          type="password" 
          value={password} 
          onChange={e => setPassword(e.target.value)} 
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

      <div>
        <label htmlFor="dob" className="block text-left font-bold mb-2" style={{ color: '#333' }}>Date of Birth</label>
        <input 
          id="dob" 
          type="date" 
          value={dob} 
          onChange={e => setDob(e.target.value)} 
          required 
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2"
          style={{ 
            backgroundColor: '#f8f9fa', 
            color: '#333',
            fontSize: '16px'
          }}
        />
      </div>

      {age !== null && age >= 18 && (
        <p className="text-center text-sm" style={{ color: '#666' }}>
          You are <strong>{age}</strong> years old.
        </p>
      )}

      {/* Guardian consent section - only shows when needed */}
      {needsConsent && (
        <div>
          <p className="text-center text-sm mb-4" style={{ color: '#666' }}>
            You are <strong>{age}</strong> years old - guardian consent is required below.
          </p>
          <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
            <div className="flex items-center">
              <input
                id="guardianConsent"
                type="checkbox"
                checked={consentGiven}
                onChange={e => setConsentGiven(e.target.checked)}
                className="h-4 w-4 border-gray-300 rounded"
                style={{ accentColor: '#007bff' }}
              />
              <label htmlFor="guardianConsent" className="ml-3 block text-sm font-medium" style={{ color: '#333' }}>
                I confirm I have my parent's or guardian's permission to sign up.
              </label>
            </div>
            {consentGiven && (
              <div className="mt-4">
                <label htmlFor="guardianEmail" className="block text-left font-bold mb-2 text-sm" style={{ color: '#333' }}>Guardian's Email</label>
                <input 
                  id="guardianEmail" 
                  type="email" 
                  value={guardianEmail} 
                  onChange={e => setGuardianEmail(e.target.value)} 
                  placeholder="parent@example.com" 
                  required={needsConsent} 
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2"
                  style={{ 
                    backgroundColor: '#f8f9fa', 
                    color: '#333',
                    fontSize: '16px'
                  }}
                />
              </div>
            )}
          </div>
        </div>
      )}

      <div className="text-center pt-4">
        <button
          type="submit"
          className={`w-full px-12 py-4 rounded-lg text-white font-bold text-lg transition-opacity ${
            loading || (needsConsent && !consentGiven) 
              ? 'opacity-50 cursor-not-allowed' 
              : 'hover:opacity-90'
          }`}
          style={{ backgroundColor: '#007bff' }}
          disabled={loading || (needsConsent && !consentGiven)}
        >
          {loading ? 'Creating Account...' : 'Create Account'}
        </button>
      </div>

      <p className="text-center mt-6" style={{ color: '#666' }}>
        Already have an account?{' '}
        <Link href="/auth/login" className="font-bold hover:underline" style={{ color: '#007bff' }}>
          Log in
        </Link>
      </p>
    </form>
  );
};
