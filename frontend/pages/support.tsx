import React from 'react';
import Link from 'next/link';
import { FiArrowUpRight } from 'react-icons/fi';
import Layout from '@/components/common/Layout';

const CONTACT_EMAIL = 'qwentin@youthcreatorlaunch.org';

const supportOptions = [
  ['Donate', 'Support program materials, equipment, coaching, and student project purchases.', '/donate', 'Donate'],
  ['Sponsor a program', 'Help cover the practical costs of a future Student Business Program group.', `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent('Sponsor the CreatorLaunch Student Business Program')}`, 'Ask about sponsorship'],
  ['Partner with us', 'Explore hosting, student referrals, professional support, or another community partnership.', '/partners', 'Partnership information'],
  ['Volunteer', 'Tell us about the experience and time you may be able to contribute.', `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent('CreatorLaunch Volunteer Interest')}`, 'Share your interest'],
  ['Make an introduction', 'Connect CreatorLaunch with a school, youth program, funder, or community organization.', `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent('CreatorLaunch Introduction')}`, 'Make an introduction'],
];

const SupportPage = () => {
  return (
    <Layout
      title="Ways to Support | CreatorLaunch"
      description="Donate, sponsor a program, volunteer, or partner with CreatorLaunch to support entrepreneurship education for young people."
    >
      <main>
        <section className="page-intro">
          <div className="container mx-auto px-4">
            <p className="eyebrow">Ways to support</p>
            <h1>Help CreatorLaunch provide a free program for students.</h1>
            <p>
              Financial support, useful introductions, volunteers, and community partners
              all help us prepare future program groups.
            </p>
          </div>
        </section>

        <section className="editorial-section">
          <div className="container mx-auto px-4">
            <div className="link-list">
              {supportOptions.map(([title, description, href, action], index) => {
                const content = (
                  <>
                    <span className="link-list-number">{String(index + 1).padStart(2, '0')}</span>
                    <div><h2>{title}</h2><p>{description}</p></div>
                    <span className="link-list-action">{action} <FiArrowUpRight aria-hidden="true" /></span>
                  </>
                );
                return href.startsWith('mailto:') ? (
                  <a key={title} href={href}>{content}</a>
                ) : (
                  <Link key={title} href={href}>{content}</Link>
                );
              })}
            </div>
          </div>
        </section>

        <section className="editorial-section section-tint">
          <div className="container mx-auto px-4">
            <div className="content-split align-start">
              <div className="section-heading">
                <p className="eyebrow">What support covers</p>
                <h2>Direct costs connected to student participation.</h2>
              </div>
              <div className="ruled-list compact">
                <div><h3>Program materials</h3><p>Supplies and resources used during the 24 program sessions.</p></div>
                <div><h3>Equipment and technology</h3><p>Laptops, software, and other tools students use while working.</p></div>
                <div><h3>Student project purchases</h3><p>Approved materials and tools connected to individual business ideas.</p></div>
                <div><h3>Instruction and coaching</h3><p>Small-group support throughout the 12-week program.</p></div>
              </div>
            </div>
          </div>
        </section>

        <section className="quiet-cta">
          <div className="container mx-auto px-4">
            <div>
              <p className="eyebrow">Not sure where to start?</p>
              <h2>Tell us how you would like to help.</h2>
              <p>We can respond with the most useful next step.</p>
            </div>
            <a
              href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent('I want to support CreatorLaunch')}`}
              className="site-button site-button-primary"
            >
              Email CreatorLaunch
            </a>
          </div>
        </section>
      </main>
    </Layout>
  );
};

export default SupportPage;
