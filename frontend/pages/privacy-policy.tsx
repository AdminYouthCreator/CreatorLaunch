import React from 'react';
import Layout from '@/components/common/Layout';

const CONTACT_EMAIL = 'qwentin@youthcreatorlaunch.org';

const PrivacyPolicyPage = () => {
  return (
    <Layout
      title="Privacy Policy | CreatorLaunch"
      description="CreatorLaunch privacy policy for website visitors, students, partners, donors, and community members."
    >
      <main className="min-h-screen bg-white">
        <section className="bg-gradient-to-br from-white via-red-50 to-blue-50 py-20">
          <div className="container mx-auto px-4 text-center">
            <p className="text-primary font-bold uppercase tracking-widest mb-3">
              Privacy Policy
            </p>

            <h1 className="text-4xl md:text-6xl font-bold text-dark mb-6">
              How CreatorLaunch handles information.
            </h1>

            <p className="text-lg md:text-xl text-medium max-w-3xl mx-auto">
              CreatorLaunch respects privacy and aims to collect only the information needed
              to operate programs, respond to inquiries, support donors, and improve our work.
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
                    1. Information We May Collect
                  </h2>
                  <p>
                    CreatorLaunch may collect information that you choose to provide, such as
                    your name, email address, organization name, message, donation-related
                    information, program request details, volunteer interest, or partnership
                    inquiry information.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-dark mb-3">
                    2. How We Use Information
                  </h2>
                  <p>
                    We may use information to respond to messages, coordinate workshops,
                    manage partnerships, process donation-related communications, support
                    programming, improve the website, and operate CreatorLaunch services.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-dark mb-3">
                    3. Youth Information
                  </h2>
                  <p>
                    CreatorLaunch works with youth and takes youth privacy seriously. We aim
                    to avoid collecting unnecessary personal information from students. When
                    youth participation requires information, we may request appropriate
                    parent, guardian, school, or partner organization involvement.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-dark mb-3">
                    4. Donations and Third-Party Platforms
                  </h2>
                  <p>
                    CreatorLaunch may use third-party platforms, such as donation or form
                    services, to collect information. Those platforms may have their own
                    privacy practices. Donors and users should review the privacy policies of
                    any third-party platforms they use.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-dark mb-3">
                    5. Sharing Information
                  </h2>
                  <p>
                    CreatorLaunch does not sell personal information. We may share limited
                    information only when needed to operate programs, comply with legal
                    requirements, coordinate with trusted partners, or protect the safety of
                    participants and the organization.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-dark mb-3">
                    6. Photos, Stories, and Media
                  </h2>
                  <p>
                    CreatorLaunch should only use identifiable youth photos, stories, or
                    media with appropriate permission. Public student stories or images should
                    be handled carefully and respectfully.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-dark mb-3">
                    7. Contact Us
                  </h2>
                  <p>
                    Questions about privacy can be sent to{' '}
                    <a
                      href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
                        'CreatorLaunch Privacy Question'
                      )}`}
                      className="text-primary font-semibold"
                    >
                      {CONTACT_EMAIL}
                    </a>
                    .
                  </p>
                </section>

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

export default PrivacyPolicyPage;