import React from 'react';
import Link from 'next/link';
import { FiArrowDown, FiArrowUpRight } from 'react-icons/fi';
import Layout from '@/components/common/Layout';

const CONTACT_EMAIL = 'qwentin@youthcreatorlaunch.org';

const partners = [
  {
    name: 'Future of Music',
    type: 'Youth-led nonprofit partner',
    website: 'https://fomusic.org',
    description: 'Expands creative opportunities in music, media, and community programs for young people.',
  },
  {
    name: 'City of Vinita Park',
    type: 'Community supporter',
    website: 'https://www.vinitapark.org',
    description: 'Supports local access to youth opportunities and community programming.',
  },
];

const partnerHref = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
  'CreatorLaunch Partnership Inquiry',
)}&body=${encodeURIComponent(
  'Hello CreatorLaunch,\n\nWe are interested in exploring a partnership.\n\nOrganization name:\nContact person:\nType of partnership:\n\nMessage:\n',
)}`;

const partnershipOptions = [
  ['Host a program group', 'Discuss an accessible location where a future group could meet.'],
  ['Support student projects', 'Help cover coaching, equipment, materials, or approved project purchases.'],
  ['Share professional experience', 'Help students understand business decisions or career paths in an age-appropriate setting.'],
];

const PartnersPage = () => {
  return (
    <Layout
      title="Partners | CreatorLaunch"
      description="Explore ways schools, youth organizations, sponsors, and community supporters can help CreatorLaunch serve students and families."
      announcementText="Looking for the student program? Read about the free CreatorLaunch Student Business Program."
    >
      <main>
        <section className="page-intro">
          <div className="container mx-auto px-4">
            <p className="eyebrow">Partners</p>
            <h1>Help make the Student Business Program possible.</h1>
            <p>
              CreatorLaunch welcomes conversations with schools, youth organizations,
              funders, and professionals who can reduce practical barriers for students.
            </p>
            <div className="button-row">
              <a href="#partnership-options" className="site-button site-button-primary">
                Explore partnerships <FiArrowDown aria-hidden="true" />
              </a>
              <Link href="/student-business-program" className="site-button site-button-secondary">View the student program</Link>
            </div>
          </div>
        </section>

        <section className="editorial-section">
          <div className="container mx-auto px-4">
            <div className="section-heading split-heading">
              <div><p className="eyebrow">Current partners</p><h2>Organizations connected to our work.</h2></div>
            </div>
            <div className="partner-list">
              {partners.map((partner) => (
                <a key={partner.name} href={partner.website} target="_blank" rel="noopener noreferrer">
                  <div><p className="eyebrow">{partner.type}</p><h3>{partner.name}</h3><p>{partner.description}</p></div>
                  <span>Visit website <FiArrowUpRight aria-hidden="true" /></span>
                </a>
              ))}
            </div>
          </div>
        </section>

        <section id="partnership-options" className="editorial-section section-tint">
          <div className="container mx-auto px-4">
            <div className="section-heading split-heading">
              <div><p className="eyebrow">Partnership options</p><h2>Three useful ways to get involved.</h2></div>
              <p>These are starting points. We are open to other practical ideas that fit the program.</p>
            </div>
            <div className="three-column-rules">
              {partnershipOptions.map(([title, description], index) => (
                <div key={title}><span>{String(index + 1).padStart(2, '0')}</span><h3>{title}</h3><p>{description}</p></div>
              ))}
            </div>
          </div>
        </section>

        <section className="quiet-cta">
          <div className="container mx-auto px-4">
            <div><p className="eyebrow">Partnership inquiry</p><h2>Tell us about your organization and your idea.</h2></div>
            <a href={partnerHref} className="site-button site-button-primary">Start a conversation</a>
          </div>
        </section>
      </main>
    </Layout>
  );
};

export default PartnersPage;
