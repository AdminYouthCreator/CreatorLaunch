import React, { FormEvent, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FiArrowLeft, FiArrowRight, FiBookOpen, FiLock, FiUsers } from 'react-icons/fi';
import Layout from '@/components/common/Layout';
import { useBusinessProgram } from '@/context/BusinessProgramContext';

export default function BusinessProgramLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { login } = useBusinessProgram();
  const router = useRouter();

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await login(email, password);
      await router.push('/business-program/portal');
    } catch (loginError: any) {
      setError(loginError.message || 'Sign in failed.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Layout
      title="Student Business Program login | CreatorLaunch"
      description="Sign in to the CreatorLaunch Student Business Program portal."
      showAnnouncement={false}
    >
      <main className="bp-login-page">
        <div className="bp-login-layout">
          <section className="bp-login-intro">
            <Link href="/login" className="bp-back-link"><FiArrowLeft /> All login options</Link>
            <p className="eyebrow">Student Business Program</p>
            <h1>Your project, purchases, and next steps in one place.</h1>
            <p>
              Program accounts are issued by CreatorLaunch. Students can request approved
              purchases and upload receipts; coaches and administrators can review activity.
            </p>
            <div className="bp-login-points">
              <span><FiLock /> Separate, role-based access</span>
              <span><FiUsers /> Admin, Coach, and Student workspaces</span>
              <span><FiBookOpen /> Guided training environment included</span>
            </div>
          </section>

          <section className="bp-login-card" aria-label="Business Program sign in">
            <div>
              <span className="bp-login-card-kicker">Program account</span>
              <h2>Sign in</h2>
              <p>Use the email and temporary password provided by CreatorLaunch.</p>
            </div>

            {error && <div className="bp-form-alert" role="alert">{error}</div>}

            <form onSubmit={handleSubmit} className="bp-form-stack">
              <label>
                Email address
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  autoComplete="email"
                  placeholder="name@example.org"
                  required
                />
              </label>
              <label>
                Password
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  minLength={8}
                  required
                />
              </label>
              <button type="submit" className="bp-primary-button" disabled={submitting}>
                {submitting ? 'Signing in…' : 'Sign in to program'} <FiArrowRight aria-hidden="true" />
              </button>
            </form>

            <div className="bp-training-callout">
              <div>
                <strong>Just exploring?</strong>
                <span>Training mode uses sample data and does not affect live records.</span>
              </div>
              <Link href="/business-program/portal?training=1&role=admin">
                Open training mode
              </Link>
            </div>

            <p className="bp-login-help">
              Need account help? Email{' '}
              <a href="mailto:qwentin@youthcreatorlaunch.org">qwentin@youthcreatorlaunch.org</a>.
            </p>
          </section>
        </div>
      </main>
    </Layout>
  );
}
