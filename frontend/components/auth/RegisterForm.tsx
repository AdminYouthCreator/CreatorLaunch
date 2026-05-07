import React, { useState, useEffect } from 'react';
import { useAuthContext } from '../../context/AuthContext';
import { useRouter } from 'next/router';
import Link from 'next/link';

export const RegisterForm = () => {
  const { register } = useAuthContext();
  const router = useRouter();

  const inviteFromQuery =
    typeof router.query.invite === 'string' ? router.query.invite : '';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [inviteCode, setInviteCode] = useState(inviteFromQuery);
  const [password, setPassword] = useState('');
  const [dob, setDob] = useState('');
  const [age, setAge] = useState<number | null>(null);
  const [needsConsent, setNeedsConsent] = useState(false);
  const [consentGiven, setConsentGiven] = useState(false);
  const [guardianEmail, setGuardianEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (inviteFromQuery) {
      setInviteCode(inviteFromQuery);
    }
  }, [inviteFromQuery]);

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

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    setError('');
    setLoading(true);

    if (!inviteCode.trim()) {
      setLoading(false);
      return setError('CreatorLaunch is invite-only. Please enter your invite code.');
    }

    if (needsConsent && !consentGiven) {
      setLoading(false);
      return setError('Guardian consent is required for users under 18.');
    }

    if (needsConsent && !guardianEmail) {
      setLoading(false);
      return setError("Please provide your guardian's email.");
    }

    try {
      await register({
        name,
        email,
        password,
        dob,
        guardianEmail: needsConsent ? guardianEmail : undefined,
        inviteCode: inviteCode.trim(),
      });

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

      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>Invite-only access:</strong> CreatorLaunch accounts are currently limited to
          invited students, team members, and approved creators.
        </p>
      </div>

      <div>
        <label htmlFor="inviteCode" className="block text-left font-bold mb-2" style={{ color: '#333' }}>
          Invite Code
        </label>
        <input
          id="inviteCode"
          type="text"
          value={inviteCode}
          onChange={(event) => setInviteCode(event.target.value.toUpperCase())}
          placeholder="ENTER-CODE"
          required
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2"
          style={{
            backgroundColor: '#f8f9fa',
            color: '#333',
            fontSize: '16px',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
          }}
        />
      </div>

      <div>
        <label htmlFor="name" className="block text-left font-bold mb-2" style={{ color: '#333' }}>
          Full Name
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Your full name"
          required
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2"
          style={{
            backgroundColor: '#f8f9fa',
            color: '#333',
            fontSize: '16px',
          }}
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-left font-bold mb-2" style={{ color: '#333' }}>
          Email Address
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@example.com"
          required
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2"
          style={{
            backgroundColor: '#f8f9fa',
            color: '#333',
            fontSize: '16px',
          }}
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-left font-bold mb-2" style={{ color: '#333' }}>
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="••••••••"
          required
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2"
          style={{
            backgroundColor: '#f8f9fa',
            color: '#333',
            fontSize: '16px',
          }}
        />
        <p className="text-xs mt-1" style={{ color: '#666' }}>
          Password must be at least 8 characters and include a number and symbol.
        </p>
      </div>

      <div>
        <label htmlFor="dob" className="block text-left font-bold mb-2" style={{ color: '#333' }}>
          Date of Birth
        </label>
        <input
          id="dob"
          type="date"
          value={dob}
          onChange={(event) => setDob(event.target.value)}
          required
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2"
          style={{
            backgroundColor: '#f8f9fa',
            color: '#333',
            fontSize: '16px',
          }}
        />
      </div>

      {age !== null && age >= 18 && (
        <p className="text-center text-sm" style={{ color: '#666' }}>
          You are <strong>{age}</strong> years old.
        </p>
      )}

      {needsConsent && (
        <div>
          <p className="text-center text-sm mb-4" style={{ color: '#666' }}>
            You are <strong>{age}</strong> years old. Guardian consent is required below.
          </p>

          <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
            <div className="flex items-center">
              <input
                id="guardianConsent"
                type="checkbox"
                checked={consentGiven}
                onChange={(event) => setConsentGiven(event.target.checked)}
                className="h-4 w-4 border-gray-300 rounded"
                style={{ accentColor: '#007bff' }}
              />

              <label htmlFor="guardianConsent" className="ml-3 block text-sm font-medium" style={{ color: '#333' }}>
                I confirm I have my parent&apos;s or guardian&apos;s permission to sign up.
              </label>
            </div>

            {consentGiven && (
              <div className="mt-4">
                <label htmlFor="guardianEmail" className="block text-left font-bold mb-2 text-sm" style={{ color: '#333' }}>
                  Guardian&apos;s Email
                </label>

                <input
                  id="guardianEmail"
                  type="email"
                  value={guardianEmail}
                  onChange={(event) => setGuardianEmail(event.target.value)}
                  placeholder="parent@example.com"
                  required={needsConsent}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2"
                  style={{
                    backgroundColor: '#f8f9fa',
                    color: '#333',
                    fontSize: '16px',
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
