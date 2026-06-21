import React from 'react';
import Layout from '@/components/common/Layout';

const CONTACT_EMAIL = 'qwentin@youthcreatorlaunch.org';

const CommunityGuidelinesPage = () => {
  return (
    <Layout
      title="Community Guidelines | CreatorLaunch"
      description="CreatorLaunch community guidelines for workshops, CreatorGames, digital tools, programs, and youth entrepreneurship spaces."
    >
      <main className="min-h-screen bg-white">
        <section className="bg-gradient-to-br from-white via-red-50 to-blue-50 py-20">
          <div className="container mx-auto px-4 text-center">
            <p className="text-primary font-bold uppercase tracking-widest mb-3">
              Community Guidelines
            </p>

            <h1 className="text-4xl md:text-6xl font-bold text-dark mb-6">
              A respectful space for young creators.
            </h1>

            <p className="text-lg md:text-xl text-medium max-w-3xl mx-auto">
              CreatorLaunch is built to help young people learn, create, and launch.
              These guidelines help keep our workshops, programs, and digital spaces safe,
              respectful, and mission-focused.
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
                    1. Be Respectful
                  </h2>
                  <p>
                    Treat students, staff, volunteers, partners, and community members with
                    respect. CreatorLaunch is a place for learning, encouragement, and growth.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-dark mb-3">
                    2. Keep It Safe and Appropriate
                  </h2>
                  <p>
                    Do not share harmful, threatening, hateful, harassing, explicit, or unsafe
                    content in CreatorLaunch spaces. This applies to workshops, events, digital
                    tools, and community communications.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-dark mb-3">
                    3. Support Young Creators
                  </h2>
                  <p>
                    Feedback should help people improve. Do not mock, pressure, shame, or
                    discourage students for their ideas, skill level, background, or experience.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-dark mb-3">
                    4. Protect Privacy
                  </h2>
                  <p>
                    Do not share someone else’s personal information, photos, stories, contact
                    details, or private messages without permission.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-dark mb-3">
                    5. Use CreatorLaunch for Its Mission
                  </h2>
                  <p>
                    CreatorLaunch tools and programs should be used for learning, creativity,
                    entrepreneurship, community impact, and mission-aligned activities.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-dark mb-3">
                    6. Follow Partner Rules
                  </h2>
                  <p>
                    When CreatorLaunch is hosted by a school, program, organization, or
                    community partner, participants should also follow that partner’s rules,
                    safety expectations, and supervision requirements.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-dark mb-3">
                    7. Reporting Concerns
                  </h2>
                  <p>
                    Concerns about behavior, safety, or misuse can be sent to{' '}
                    <a
                      href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
                        'CreatorLaunch Community Guidelines Concern'
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
                    CreatorLaunch may update these guidelines as programs, partnerships,
                    and digital tools grow.
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

export default CommunityGuidelinesPage;