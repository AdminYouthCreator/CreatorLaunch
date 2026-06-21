import React from 'react';
import Link from 'next/link';
import Layout from '@/components/common/Layout';

const CONTACT_EMAIL = 'qwentin@youthcreatorlaunch.org';

const DonationPolicyPage = () => {
  return (
    <Layout
      title="Donation Policy | CreatorLaunch"
      description="CreatorLaunch donation policy for donors, supporters, sponsorships, acknowledgements, and donation use."
    >
      <main className="min-h-screen bg-white">
        <section className="bg-gradient-to-br from-white via-red-50 to-blue-50 py-20">
          <div className="container mx-auto px-4 text-center">
            <p className="text-primary font-bold uppercase tracking-widest mb-3">
              Donation Policy
            </p>

            <h1 className="text-4xl md:text-6xl font-bold text-dark mb-6">
              How donations support CreatorLaunch.
            </h1>

            <p className="text-lg md:text-xl text-medium max-w-3xl mx-auto">
              Donations help CreatorLaunch make youth entrepreneurship education more
              accessible through workshops, partnerships, creator tools, and student support.
            </p>
          </div>
        </section>

        <section className="py-20 bg-light">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto bg-white rounded-3xl border border-gray-100 shadow-sm p-8 md:p-12">
              <p className="text-sm text-medium mb-8">
                Last updated: 2026
              </p>

              <div className="space-y-8 text-medium leading-relaxed">
                <section>
                  <h2 className="text-2xl font-bold text-dark mb-3">
                    1. Nonprofit Status
                  </h2>
                  <p>
                    CreatorLaunch is a nationally recognized 501(c)(3) nonprofit organization.
                    EIN: 39-2689174. Donations may be tax-deductible as allowed by law.
                    Donors should consult a tax professional for personal tax advice.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-dark mb-3">
                    2. How Donations Are Used
                  </h2>
                  <p>
                    Donations may support workshop supplies, student learning materials,
                    CreatorGames activities, youth entrepreneurship programming, launch
                    resources, platform development, operations, outreach, and other mission-
                    aligned needs.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-dark mb-3">
                    3. Restricted and Unrestricted Gifts
                  </h2>
                  <p>
                    Unless clearly agreed upon in writing, donations are generally considered
                    unrestricted and may be used where CreatorLaunch determines they are most
                    needed to support the mission.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-dark mb-3">
                    4. Donation Acknowledgements
                  </h2>
                  <p>
                    CreatorLaunch may provide donation acknowledgements or receipts when
                    available. Donors should keep their own records and contact CreatorLaunch
                    with questions about donation documentation.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-dark mb-3">
                    5. Refunds
                  </h2>
                  <p>
                    Donations are generally final. If a donor believes a donation was made in
                    error, they should contact CreatorLaunch as soon as possible. Refunds may be
                    reviewed case by case.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-dark mb-3">
                    6. Third-Party Donation Platforms
                  </h2>
                  <p>
                    CreatorLaunch may use third-party platforms to accept donations. These
                    platforms may have their own terms, privacy policies, processing timelines,
                    and optional contribution settings.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-dark mb-3">
                    7. Questions
                  </h2>
                  <p>
                    Donation questions can be sent to{' '}
                    <a
                      href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
                        'CreatorLaunch Donation Question'
                      )}`}
                      className="text-primary font-semibold"
                    >
                      {CONTACT_EMAIL}
                    </a>
                    .
                  </p>
                </section>

                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Link
                    href="/donate"
                    className="bg-primary text-white px-8 py-4 rounded-lg font-semibold hover:bg-red-600 transition-colors text-center"
                  >
                    Donate
                  </Link>

                  <Link
                    href="/support"
                    className="bg-white text-dark border border-gray-200 px-8 py-4 rounded-lg font-semibold hover:bg-gray-50 transition-colors text-center"
                  >
                    Ways to Support
                  </Link>
                </div>

                <div className="bg-red-50 border border-red-100 rounded-2xl p-5">
                  <p className="text-sm text-medium">
                    CreatorLaunch may update this policy as we grow.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
};

export default DonationPolicyPage;