import React from 'react';
import Link from 'next/link';
import Layout from '@/components/common/Layout';

const partners = [
  {
    name: 'Future of Music',
    type: 'Community Partner',
    description:
      'A youth-led nonprofit helping expand creative opportunities and community-centered programming.',
  },
  {
    name: 'City of Vinita Park',
    type: 'Community Support',
    description:
      'A local community supporter helping strengthen opportunities for young people in the St. Louis area.',
  },
  {
    name: 'Next Prep',
    type: 'Mentoring Program Advising and Sponsorship',
    description:
      'A program of The Opportunity Trust supporting student growth, opportunity, and future readiness.',
  },
];

const PartnersPage = () => {
  return (
    <Layout title="Partners | CreatorLaunch">
      <main className="min-h-screen bg-white">
        {/* Hero */}
        <section className="bg-gradient-to-br from-white via-red-50 to-orange-50 py-20">
          <div className="container mx-auto px-4 text-center">
            <p className="text-primary font-semibold mb-3">
              Building with community.
            </p>
            <h1 className="text-4xl md:text-6xl font-bold text-dark mb-6">
              Our Partners
            </h1>
            <p className="text-lg md:text-xl text-medium max-w-3xl mx-auto">
              We are proud to collaborate with organizations committed to the success of
              St. Louis’s young founders.
            </p>
          </div>
        </section>

        {/* Partner Cards */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {partners.map((partner) => (
                <div
                  key={partner.name}
                  className="bg-light rounded-2xl p-6 border border-gray-100 shadow-sm"
                >
                  <div className="w-14 h-14 bg-primary rounded-xl flex items-center justify-center text-white text-2xl mb-5">
                    🤝
                  </div>
                  <h2 className="text-xl font-bold text-dark mb-2">{partner.name}</h2>
                  <p className="text-primary font-semibold mb-4">{partner.type}</p>
                  <p className="text-medium">{partner.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Partnership Opportunities */}
        <section className="py-20 bg-light">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-dark mb-4">
                  How Partners Can Help
                </h2>
                <p className="text-lg text-medium">
                  CreatorLaunch works best when the community helps youth founders move from
                  idea to action.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl p-6 border border-gray-100">
                  <h3 className="text-xl font-bold text-dark mb-3">Sponsor Launch Capital</h3>
                  <p className="text-medium">
                    Help fund student seed grants, pitch competition awards, and startup costs
                    for youth ventures.
                  </p>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-gray-100">
                  <h3 className="text-xl font-bold text-dark mb-3">Host or Support Workshops</h3>
                  <p className="text-medium">
                    Provide space, materials, technology, food, transportation support, or
                    workshop resources.
                  </p>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-gray-100">
                  <h3 className="text-xl font-bold text-dark mb-3">Share Professional Skills</h3>
                  <p className="text-medium">
                    Help students learn business basics like branding, finance, marketing,
                    product creation, and customer discovery.
                  </p>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-gray-100">
                  <h3 className="text-xl font-bold text-dark mb-3">Invest in the Platform</h3>
                  <p className="text-medium">
                    Support the development of CreatorLaunch’s digital tools for youth
                    entrepreneurs.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-primary text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Support the Next Generation.
            </h2>
            <p className="text-lg text-white/90 max-w-2xl mx-auto mb-8">
              Does your organization want to help dismantle barriers for young entrepreneurs?
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href="/contact"
                className="bg-white text-primary px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Become a Partner
              </Link>
              <Link
                href="/donate"
                className="bg-red-700 text-white px-8 py-4 rounded-lg font-semibold hover:bg-red-800 transition-colors"
              >
                Individual Donation
              </Link>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
};

export default PartnersPage;
