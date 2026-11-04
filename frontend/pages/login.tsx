import React from 'react';
import Link from 'next/link';
import { FiArrowUpRight, FiBriefcase, FiLayers } from 'react-icons/fi';
import Layout from '@/components/common/Layout';

export default function LoginChooser() {
  return (
    <Layout
      title="Choose a program | CreatorLaunch"
      description="Choose which CreatorLaunch program or platform you want to access."
      showAnnouncement={false}
    >
      <main className="portal-picker">
        <div className="portal-picker-inner">
          <p className="eyebrow">CreatorLaunch sign in</p>
          <h1>Where are you signing in?</h1>
          <p className="portal-picker-lede">
            The Student Business Program and the original CreatorLaunch Platform use separate
            accounts. Choose the space you need.
          </p>

          <div className="portal-picker-grid">
            <Link href="/business-program/login" className="portal-choice portal-choice-program">
              <span className="portal-choice-icon"><FiBriefcase aria-hidden="true" /></span>
              <span className="portal-choice-label">Student Business Program</span>
              <h2>Program portal</h2>
              <p>
                For program administrators, coaches, and students managing purchase requests,
                receipts, cards, and project progress.
              </p>
              <span className="portal-choice-action">Continue <FiArrowUpRight aria-hidden="true" /></span>
            </Link>

            <Link href="/auth/login" className="portal-choice portal-choice-platform">
              <span className="portal-choice-icon"><FiLayers aria-hidden="true" /></span>
              <span className="portal-choice-label">CreatorLaunch Platform</span>
              <h2>Original account</h2>
              <p>
                For the original CreatorLaunch dashboard, including stores, products, services,
                orders, certificates, and creator tools.
              </p>
              <span className="portal-choice-action">Continue <FiArrowUpRight aria-hidden="true" /></span>
            </Link>
          </div>

        </div>
      </main>
    </Layout>
  );
}
