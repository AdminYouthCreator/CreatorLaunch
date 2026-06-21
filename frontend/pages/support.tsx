import React from 'react';
import Link from 'next/link';
import Layout from '@/components/common/Layout';

const CONTACT_EMAIL = 'qwentin@youthcreatorlaunch.org';

const supportOptions = [
  {
    title: 'Donate',
    description:
      'Support workshops, student materials, creator tools, launch resources, and the ongoing mission of CreatorLaunch.',
    action: 'Donate Now',
    href: '/donate',
  },
  {
    title: 'Sponsor a Workshop',
    description:
      'Help bring entrepreneurship learning to a school, summer program, afterschool program, or community organization.',
    action: 'Sponsor a Workshop',
    href: `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
      'Sponsor a CreatorLaunch Workshop'
    )}`,
  },
  {
    title: 'Become a Partner',
    description:
      'Partner with CreatorLaunch to host workshops, connect students to opportunities, or support youth entrepreneurship programming.',
    action: 'Partner With Us',
    href: '/partners',
  },
  {
    title: 'Host CreatorLaunch',
    description:
      'Bring CreatorLaunch to your community so students can explore business ideas, branding, pitching, and financial skills.',
    action: 'Request CreatorLaunch',
    href: '/bring-creatorlaunch',
  },
  {
    title: 'Volunteer',
    description:
      'Support CreatorLaunch through mentoring, events, outreach, operations, workshops, or behind-the-scenes help.',
    action: 'Volunteer Interest',
    href: `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
      'CreatorLaunch Volunteer Interest'
    )}`,
  },
  {
    title: 'Share CreatorLaunch',
    description:
      'Introduce us to a school, program, donor, sponsor, community leader, or organization that supports youth.',
    action: 'Make an Introduction',
    href: `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
      'CreatorLaunch Introduction'
    )}`,
  },
];

const SupportPage = () => {
  return (
    <Layout
      title="Ways to Support | CreatorLaunch"
      description="Support CreatorLaunch through donations, sponsorships, partnerships, volunteering, hosting workshops, and sharing the mission."
    >
      <main className="min-h-screen bg-white">
        <section className="bg-gradient-to-br from-white via-red-50 to-blue-50 py-20">
          <div className="container mx-auto px-4 text-center">
            <p className="text-primary font-bold uppercase tracking-widest mb-3">
              Ways to Support
            </p>

            <h1 className="text-4xl md:text-6xl font-bold text-dark mb-6">
              Help young founders get real support.
            </h1>

            <p className="text-lg md:text-xl text-medium max-w-3xl mx-auto">
              CreatorLaunch grows when donors, schools, programs, volunteers, sponsors,
              and community partners work together to make entrepreneurship more accessible.
            </p>
          </div>
        </section>

        <section className="py-20 bg-light">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
              {supportOptions.map((option) => {
                const isExternal = option.href.startsWith('mailto:');

                const cardContent = (
                  <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 h-full hover:-translate-y-1 transition-transform">
                    <div className="w-12 h-12 rounded-2xl bg-red-50 text-primary flex items-center justify-center font-black text-xl mb-5">
                      +
                    </div>

                    <h2 className="text-2xl font-bold text-dark mb-3">
                      {option.title}
                    </h2>

                    <p className="text-medium mb-6">
                      {option.description}
                    </p>

                    <span className="inline-flex font-bold text-primary">
                      {option.action} →
                    </span>
                  </div>
                );

                if (isExternal) {
                  return (
                    <a key={option.title} href={option.href} className="block">
                      {cardContent}
                    </a>
                  );
                }

                return (
                  <Link key={option.title} href={option.href} className="block">
                    {cardContent}
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-10 items-center max-w-6xl mx-auto">
              <div>
                <p className="text-primary font-bold uppercase tracking-widest mb-3">
                  Donation Impact
                </p>

                <h2 className="text-3xl md:text-5xl font-bold text-dark mb-6">
                  Every kind of support helps students build.
                </h2>

                <p className="text-lg text-medium mb-6">
                  Donations and sponsorships help CreatorLaunch provide practical learning
                  experiences, workshop materials, student resources, CreatorGames activities,
                  and launch support for youth entrepreneurs.
                </p>

                <div className="space-y-4">
                  {[
                    '$25 can help provide basic workshop supplies.',
                    '$50 can help support student learning materials.',
                    '$100 can help support CreatorGames and workshop activities.',
                    '$250 can help support a youth entrepreneurship session.',
                    '$500 can help sponsor a community workshop experience.',
                  ].map((item) => (
                    <div key={item} className="bg-light rounded-2xl p-5 border border-gray-100">
                      <p className="font-semibold text-dark">{item}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl overflow-hidden shadow-xl border border-white bg-white">
                <img
                  src="https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1200&q=80"
                  alt="Community planning and support materials"
                  className="w-full h-[520px] object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-dark text-white">
          <div className="container mx-auto px-4 text-center">
            <p className="text-red-300 font-bold uppercase tracking-widest mb-3">
              Not sure where to start?
            </p>

            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Reach out and we can find the best way to help.
            </h2>

            <p className="text-white/75 text-lg max-w-2xl mx-auto mb-8">
              Whether you want to donate, host a workshop, make an introduction,
              sponsor a program, or volunteer, CreatorLaunch would love to connect.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a
                href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
                  'I want to support CreatorLaunch'
                )}`}
                className="bg-primary text-white px-8 py-4 rounded-lg font-semibold hover:bg-red-600 transition-colors"
              >
                Contact CreatorLaunch
              </a>

              <Link
                href="/donate"
                className="bg-white/10 text-white border border-white/10 px-8 py-4 rounded-lg font-semibold hover:bg-white/15 transition-colors"
              >
                Donate
              </Link>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
};

export default SupportPage;