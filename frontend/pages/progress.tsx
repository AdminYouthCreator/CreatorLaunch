import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Header from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';
import {
  FiCheckCircle,
  FiClock,
  FiCode,
  FiGlobe,
  FiLock,
  FiSettings,
  FiShoppingBag,
  FiUsers,
  FiZap,
  FiArrowRight,
} from 'react-icons/fi';

const completedItems = [
  {
    icon: FiGlobe,
    title: 'Public Website Relaunch',
    description:
      'CreatorLaunch now has an updated public website focused on our youth-led mission, St. Louis workshops, seed funding, and platform vision.',
  },
  {
    icon: FiLock,
    title: 'Invite-Only Platform Access',
    description:
      'The platform is being prepared for private beta access so we can safely invite early creators before opening more broadly.',
  },
  {
    icon: FiSettings,
    title: 'Admin Dashboard Foundation',
    description:
      'The admin portal now supports user management, store management, security tools, audit logs, blog management, and platform settings.',
  },
  {
    icon: FiShoppingBag,
    title: 'Creator Store System',
    description:
      'Creators can build stores, add products and services, generate product mockups, and manage their storefront presence.',
  },
  {
    icon: FiCode,
    title: 'Dynamic Blog System',
    description:
      'Blog posts are now managed through the admin portal instead of being hardcoded, making updates easier and faster.',
  },
  {
    icon: FiZap,
    title: 'Custom Domain + API Setup',
    description:
      'The public website and backend API are being connected through CreatorLaunch-owned domains for a more professional experience.',
  },
];

const inProgressItems = [
  {
    title: 'Private Beta Testing',
    description:
      'We are testing the creator dashboard, store pages, admin tools, and product creation flow before inviting more users.',
  },
  {
    title: 'Platform Lock + Safety Controls',
    description:
      'We are strengthening admin controls for suspending accounts, locking stores, reviewing products, and keeping the platform safe.',
  },
  {
    title: 'Storefront Experience',
    description:
      'We are improving public store pages so each creator has a clean, consistent, customer-friendly storefront.',
  },
  {
    title: 'Workshop Readiness',
    description:
      'We are aligning the digital platform with our in-person workshop model so students can go from idea to launch.',
  },
];

const nextSteps = [
  {
    phase: 'Phase 1',
    title: 'Private Platform Beta',
    items: [
      'Invite a small group of test creators',
      'Test store creation from start to finish',
      'Review admin moderation tools',
      'Collect feedback from early users',
    ],
  },
  {
    phase: 'Phase 2',
    title: 'Workshop Launch Preparation',
    items: [
      'Finalize workshop curriculum',
      'Prepare student onboarding materials',
      'Build pitch competition structure',
      'Confirm launch capital and sponsor needs',
    ],
  },
  {
    phase: 'Phase 3',
    title: 'Public CreatorLaunch Platform',
    items: [
      'Open access to more invited creators',
      'Improve checkout and order processing',
      'Add stronger creator analytics',
      'Prepare for broader public launch',
    ],
  },
];

const ProgressPage: React.FC = () => {
  return (
    <>
      <Head>
        <title>Platform Progress & Next Steps | CreatorLaunch</title>
        <meta
          name="description"
          content="See CreatorLaunch platform progress, current development priorities, and what is coming next for our youth entrepreneurship program."
        />
      </Head>

      <div className="public-shell">
      <Header />

      <main className="site-main">
        {/* Hero */}
        <section className="page-hero py-16 md:py-24">
          <div className="container mx-auto px-4 text-center">
            <p className="section-kicker mb-5">
              Platform Progress
            </p>

            <h1 className="page-title mx-auto text-dark mb-6">
              Building CreatorLaunch in Public
            </h1>

            <p className="text-xl text-medium max-w-3xl mx-auto mb-8">
              We are building a youth-led platform that helps students turn ideas into real
              businesses through workshops, seed funding, storefront tools, and hands-on support.
              Here is what is finished, what is in progress, and what is coming next.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href="/blog"
                className="site-button site-button-primary"
              >
                Read Updates
              </Link>

              <Link
                href="/contact"
                className="site-button site-button-secondary"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </section>

        {/* Status Snapshot */}
        <section className="bg-light py-16">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="soft-card p-8 text-center">
                <FiCheckCircle className="text-green-600 text-4xl mx-auto mb-4" />
                <h2 className="text-3xl font-bold text-dark mb-2">Built</h2>
                <p className="text-medium">
                  Core public site, admin portal, blog system, and early creator store tools.
                </p>
              </div>

              <div className="soft-card p-8 text-center">
                <FiClock className="text-blue-600 text-4xl mx-auto mb-4" />
                <h2 className="text-3xl font-bold text-dark mb-2">Testing</h2>
                <p className="text-medium">
                  Private beta tools, store flows, moderation, and creator dashboard features.
                </p>
              </div>

              <div className="soft-card p-8 text-center">
                <FiUsers className="text-purple-600 text-4xl mx-auto mb-4" />
                <h2 className="text-3xl font-bold text-dark mb-2">Next</h2>
                <p className="text-medium">
                  More creator invites, workshop launch preparation, and public platform expansion.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Completed */}
        <section className="bg-white py-20">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <p className="section-kicker mb-5">
                Current Progress
              </p>
              <h2 className="text-3xl md:text-5xl font-bold text-dark mb-4">
                What Has Been Built So Far
              </h2>
              <p className="text-lg text-medium">
                These are the main pieces currently in place as CreatorLaunch moves toward private beta.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {completedItems.map((item) => (
                <div key={item.title} className="soft-card bg-light p-6">
                  <item.icon className="text-primary text-3xl mb-4" />
                  <h3 className="text-xl font-bold text-dark mb-3">{item.title}</h3>
                  <p className="text-medium">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* In Progress */}
        <section className="bg-light py-20">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <p className="section-kicker mb-5">
                In Progress
              </p>
              <h2 className="text-3xl md:text-5xl font-bold text-dark mb-4">
                What We Are Working On Now
              </h2>
              <p className="text-lg text-medium">
                Our current focus is making sure the platform is stable, safe, and useful before opening it to more young creators.
              </p>
            </div>

            <div className="max-w-4xl mx-auto space-y-5">
              {inProgressItems.map((item) => (
                <div key={item.title} className="soft-card flex gap-4 p-6">
                  <div className="mt-1">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <FiClock className="text-blue-600" />
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-dark mb-2">{item.title}</h3>
                    <p className="text-medium">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Roadmap */}
        <section className="bg-white py-20">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <p className="section-kicker mb-5">
                Roadmap
              </p>
              <h2 className="text-3xl md:text-5xl font-bold text-dark mb-4">
                What Comes Next
              </h2>
              <p className="text-lg text-medium">
                This roadmap may change as we learn from students, partners, and early users, but this is the current direction.
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              {nextSteps.map((step) => (
                <div key={step.phase} className="soft-card bg-light p-8">
                  <p className="text-primary font-bold mb-2">{step.phase}</p>
                  <h3 className="text-2xl font-bold text-dark mb-5">{step.title}</h3>

                  <ul className="space-y-3">
                    {step.items.map((item) => (
                      <li key={item} className="flex gap-3 text-medium">
                        <FiCheckCircle className="text-green-600 mt-1 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Transparency CTA */}
        <section className="band-dark py-20">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              We Are Building This With the Community
            </h2>

            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              CreatorLaunch is youth-led, community-supported, and built around real student needs.
              If you want to support, partner, sponsor, or give feedback, we would love to hear from you.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href="/partners"
                className="site-button bg-white text-dark hover:bg-amber-50"
              >
                Partner With Us
                <FiArrowRight />
              </Link>

              <Link
                href="/donate"
                className="site-button border border-white/20 bg-white/10 text-white hover:bg-white/15"
              >
                Support the Mission
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      </div>
    </>
  );
};

export default ProgressPage;
