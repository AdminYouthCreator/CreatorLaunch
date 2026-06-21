import React from 'react';
import Layout from '@/components/common/Layout';

const CONTACT_EMAIL = 'qwentin@youthcreatorlaunch.org';

const YouthSafetyPage = () => {
  return (
    <Layout
      title="Youth Safety | CreatorLaunch"
      description="CreatorLaunch youth safety commitments for workshops, community programs, digital tools, and student participation."
    >
      <main className="min-h-screen bg-white">
        <section className="bg-gradient-to-br from-white via-red-50 to-blue-50 py-20">
          <div className="container mx-auto px-4 text-center">
            <p className="text-primary font-bold uppercase tracking-widest mb-3">
              Youth Safety
            </p>

            <h1 className="text-4xl md:text-6xl font-bold text-dark mb-6">
              Student safety comes first.
            </h1>

            <p className="text-lg md:text-xl text-medium max-w-3xl mx-auto">
              CreatorLaunch is built for young people, which means our programs, partnerships,
              communications, and digital tools should be handled with care and responsibility.
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
                    1. Our Commitment
                  </h2>
                  <p>
                    CreatorLaunch is committed to creating a safe, respectful, and supportive
                    environment for students. We want young people to feel encouraged, protected,
                    and taken seriously while learning entrepreneurship.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-dark mb-3">
                    2. Partnered Youth Programming
                  </h2>
                  <p>
                    CreatorLaunch workshops are usually hosted with schools, summer programs,
                    afterschool programs, nonprofits, or community organizations. These partners
                    may provide supervision, space, registration support, and participant
                    guidelines.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-dark mb-3">
                    3. Respectful Learning Environment
                  </h2>
                  <p>
                    Students, staff, volunteers, and partners are expected to treat each other
                    with respect. Bullying, harassment, discrimination, threats, or unsafe
                    behavior should not be allowed in CreatorLaunch spaces.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-dark mb-3">
                    4. Youth Communication
                  </h2>
                  <p>
                    Communication with youth should be appropriate, program-related, and
                    transparent. When needed, CreatorLaunch may involve parents, guardians,
                    schools, or partner organizations in communication.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-dark mb-3">
                    5. Media and Student Stories
                  </h2>
                  <p>
                    CreatorLaunch should only use identifiable student photos, videos, names,
                    or stories with appropriate permission. Youth should not be pressured to
                    appear in media or share personal stories publicly.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-dark mb-3">
                    6. Digital Safety
                  </h2>
                  <p>
                    CreatorLaunch’s digital tools should be designed to reduce unnecessary data
                    collection, limit unsafe interactions, and protect youth users as the
                    platform grows.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-dark mb-3">
                    7. Reporting a Concern
                  </h2>
                  <p>
                    Safety concerns can be reported to{' '}
                    <a
                      href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
                        'CreatorLaunch Youth Safety Concern'
                      )}`}
                      className="text-primary font-semibold"
                    >
                      {CONTACT_EMAIL}
                    </a>
                    . If there is an immediate emergency, contact local emergency services.
                  </p>
                </section>

                <div className="bg-red-50 border border-red-100 rounded-2xl p-5">
                  <p className="text-sm text-medium">
                    This page is a public-facing safety commitment. As CreatorLaunch expands
                    programming, it should be reviewed and strengthened with adult leadership,
                    partner organizations, and appropriate legal or youth-safety guidance.
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

export default YouthSafetyPage;