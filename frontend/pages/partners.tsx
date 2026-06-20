import React from 'react';
import Layout from '@/components/common/Layout';

const CONTACT_EMAIL = 'qwentin@youthcreatorlaunch.org';

const partners = [
  {
    name: 'Future of Music',
    type: 'Youth-Led Nonprofit Partner',
    website: 'https://fomusic.org',
    initials: 'FOM',
    description:
      'A youth-led organization expanding creative opportunities and helping young people access music, media, and community-centered programs.',
  },
  {
    name: 'City of Vinita Park',
    type: 'Community Supporter',
    website: 'https://www.vinitapark.org',
    initials: 'VP',
    description:
      'A local community supporter helping strengthen access to youth opportunities and community impact in the St. Louis area.',
  },
  {
    name: 'Next Prep',
    type: 'Mentoring Program Advising and Sponsorship',
    website: 'https://theopportunitytrust.org/2024/05/27/next-prep-expansion-2024/',
    initials: 'NP',
    description:
      'A youth development and future-readiness initiative connected to career pathways, mentoring, and student opportunity.',
  },
];

const partnerHref = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
  'CreatorLaunch Partnership Inquiry'
)}&body=${encodeURIComponent(
  'Hello CreatorLaunch,\n\nWe are interested in partnering with CreatorLaunch.\n\nOrganization name:\nContact person:\nHow we would like to partner:\n\nMessage:\n'
)}`;

const PartnersPage = () => {
  return (
    <Layout
      title="Partners | CreatorLaunch"
      description="CreatorLaunch partners with schools, programs, nonprofits, donors, sponsors, and community organizations to bring entrepreneurship workshops to young people."
    >
      <main className="min-h-screen bg-white">
        <section className="bg-gradient-to-br from-white via-red-50 to-blue-50 py-20">
          <div className="container mx-auto px-4 text-center">
            <p className="text-primary font-bold uppercase tracking-widest mb-3">
              Our Partners
            </p>

            <h1 className="text-4xl md:text-6xl font-bold text-dark mb-6">
              Building youth entrepreneurship with community.
            </h1>

            <p className="text-lg md:text-xl text-medium max-w-3xl mx-auto">
              CreatorLaunch works with organizations, schools, programs, donors, and
              community partners who believe young people deserve real opportunities to build.
            </p>
          </div>
        </section>

        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold text-dark mb-4">
                Our Partners
              </h2>

              <p className="text-medium">
                Hover to learn more. Click a partner to visit their website.
              </p>
            </div>

            <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 border border-gray-100 bg-white shadow-sm rounded-3xl overflow-hidden">
              {partners.map((partner) => (
                <a
                  key={partner.name}
                  href={partner.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative min-h-[260px] border-b sm:border-r border-gray-100 flex items-center justify-center bg-white hover:bg-light transition-colors"
                >
                  <div className="text-center p-8">
                    <div className="text-4xl font-black text-dark tracking-tight mb-3">
                      {partner.initials}
                    </div>

                    <h3 className="text-xl font-bold text-dark">{partner.name}</h3>

                    <span className="inline-block mt-4 text-xs border border-gray-200 rounded-full px-3 py-1 text-medium">
                      {partner.type}
                    </span>
                  </div>

                  <div className="absolute inset-0 bg-primary text-white p-6 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <p className="text-sm uppercase tracking-widest font-bold text-white/80 mb-2">
                      {partner.type}
                    </p>

                    <h3 className="text-2xl font-bold mb-3">{partner.name}</h3>

                    <p className="text-white/90 mb-6">{partner.description}</p>

                    <span className="font-bold">Visit Website →</span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-light">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-10 items-center max-w-6xl mx-auto">
              <div>
                <p className="text-primary font-bold uppercase tracking-widest mb-3">
                  Partnership Opportunities
                </p>

                <h2 className="text-3xl md:text-4xl font-bold text-dark mb-6">
                  Bring CreatorLaunch to your school, program, or organization.
                </h2>

                <p className="text-lg text-medium mb-6">
                  We partner with summer programs, afterschool programs, schools, nonprofits,
                  libraries, community centers, and youth-serving organizations to bring
                  entrepreneurship workshops directly to young people.
                </p>

                <a
                  href={partnerHref}
                  className="inline-block bg-primary text-white px-8 py-4 rounded-lg font-semibold hover:bg-red-600 transition-colors"
                >
                  Become a Partner
                </a>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  'Host workshops',
                  'Sponsor launch support',
                  'Support student supplies',
                  'Fund youth programs',
                  'Connect community resources',
                  'Help us reach more students',
                ].map((item) => (
                  <div
                    key={item}
                    className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm"
                  >
                    <p className="font-bold text-dark">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-primary text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Partner with CreatorLaunch.
            </h2>

            <p className="text-lg text-white/90 max-w-2xl mx-auto mb-8">
              If your organization wants to help young people build confidence, ideas,
              and real entrepreneurship skills, we would love to connect.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a
                href={partnerHref}
                className="bg-white text-primary px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Start a Partnership
              </a>

              <a
                href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
                  'CreatorLaunch Donation or Sponsorship Inquiry'
                )}`}
                className="bg-red-700 text-white px-8 py-4 rounded-lg font-semibold hover:bg-red-800 transition-colors"
              >
                Sponsor the Mission
              </a>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
};

export default PartnersPage;