import React from 'react';
import Link from 'next/link';
import Layout from '@/components/common/Layout';

const CONTACT_EMAIL = 'qwentin@youthcreatorlaunch.org';
const programHref = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
  'CreatorLaunch Student Business Program Updates'
)}`;

const AboutPage = () => {
  return (
    <Layout
      title="About | CreatorLaunch"
      description="Learn about CreatorLaunch, a youth-led nonprofit helping students explore entrepreneurship, develop business ideas, and practice real-world skills."
    >
      <main className="min-h-screen bg-white">
        <section className="bg-gradient-to-br from-white via-red-50 to-blue-50 py-20">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
              <div>
                <p className="text-primary font-bold uppercase tracking-widest mb-3">
                  Our Story
                </p>

                <h1 className="text-4xl md:text-6xl font-bold text-dark mb-6 leading-tight">
                  CreatorLaunch started with a simple frustration.
                </h1>

                <p className="text-lg md:text-xl text-medium">
                  Young people are told to dream big, but too often they are not given the
                  tools, support, funding, or real-world spaces to actually build. CreatorLaunch
                  exists to change that.
                </p>
              </div>

              <div className="rounded-3xl overflow-hidden shadow-2xl border border-white bg-white">
                <img
                  src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80"
                  alt="Creative workspace with laptops and planning materials"
                  className="w-full h-[430px] object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="bg-light rounded-3xl p-8 md:p-12 border border-gray-100">
                <p className="text-primary font-bold uppercase tracking-widest mb-3">
                  Why We Exist
                </p>

                <h2 className="text-3xl md:text-4xl font-bold text-dark mb-6">
                  We believe young people should not have to wait until adulthood to build.
                </h2>

                <div className="space-y-5 text-lg text-medium">
                  <p>
                    CreatorLaunch was founded by Qwentin Blassingame, a young entrepreneur who
                    saw how hard it can be for students to access real entrepreneurship support.
                    A lot of programs talk about leadership and business, but not enough give
                    students practical ways to create, test, pitch, and launch.
                  </p>

                  <p>
                    We are building CreatorLaunch to be more than a class. It is a launchpad:
                    a place where students can learn by doing, families can understand the
                    process, and young founders can get practical support to move forward.
                  </p>

                  <p>
                    Our work is personal because we know what it feels like to be young and
                    serious about an idea. CreatorLaunch is here for the student with a business
                    idea in their notes app, the kid who wants to sell something but does not
                    know where to start, and the community that wants to give youth something
                    real to build.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-light">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-10 items-center max-w-6xl mx-auto">
              <div className="rounded-3xl overflow-hidden shadow-xl border border-white bg-white">
                <img
                  src="/assets/qwentin-pfp.png"
                  alt="Qwentin Blassingame"
                  className="w-full h-[520px] object-cover"
                />
              </div>

              <div>
                <p className="text-primary font-bold uppercase tracking-widest mb-3">
                  About the Founder
                </p>

                <h2 className="text-3xl md:text-5xl font-bold text-dark mb-6">
                  Built by someone who understands what young creators are missing.
                </h2>

                <div className="space-y-5 text-lg text-medium">
                  <p>
                    CreatorLaunch was founded by Qwentin Blassingame, a young founder who
                    wanted to create the kind of support system he wished more students had
                    access to. The idea came from a real problem: young people often have
                    creativity, ambition, and business ideas, but they are not always taken
                    seriously or given practical tools to start.
                  </p>

                  <p>
                    Qwentin started CreatorLaunch to help close that gap. Instead of waiting
                    for students to become adults before they are taught entrepreneurship,
                    CreatorLaunch helps them learn now through a structured business program,
                    coaching, creator tools, and hands-on project work.
                  </p>

                  <p>
                    His vision is for CreatorLaunch to become a place where youth can learn
                    how to build brands, understand money, pitch ideas, create products and
                    services, and see entrepreneurship as something they can actually do.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 mt-8">
                  <Link
                    href="/about/team/qwentin-blassingame"
                    className="bg-primary text-white px-8 py-4 rounded-lg font-semibold hover:bg-red-600 transition-colors text-center"
                  >
                    Read Qwentin’s Bio
                  </Link>

                  <a
                    href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
                      'Message for Qwentin'
                    )}`}
                    className="bg-white text-dark border border-gray-200 px-8 py-4 rounded-lg font-semibold hover:bg-gray-50 transition-colors text-center"
                  >
                    Contact CreatorLaunch
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-dark text-white">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6">
              <div className="bg-white/10 rounded-2xl p-6 border border-white/10">
                <div className="text-4xl mb-4">🎯</div>
                <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
                <p className="text-gray-200">
                  To make entrepreneurship education more accessible by helping young people
                  build real ideas, skills, confidence, and launch-ready ventures.
                </p>
              </div>

              <div className="bg-white/10 rounded-2xl p-6 border border-white/10">
                <div className="text-4xl mb-4">🤝</div>
                <h2 className="text-2xl font-bold mb-4">Our Model</h2>
                <p className="text-gray-200">
                  We bring students together in a free, 12-week program with small-group
                  coaching, laptops, project work, and approved business purchases.
                </p>
              </div>

              <div className="bg-white/10 rounded-2xl p-6 border border-white/10">
                <div className="text-4xl mb-4">🚀</div>
                <h2 className="text-2xl font-bold mb-4">Our Future</h2>
                <p className="text-gray-200">
                  We are also building a digital platform where young creators can create
                  stores, products, services, and launch pathways online.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-light">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-10 items-center max-w-6xl mx-auto">
              <div>
                <p className="text-primary font-bold uppercase tracking-widest mb-3">
                  What Makes Us Different
                </p>

                <h2 className="text-3xl md:text-4xl font-bold text-dark mb-6">
                  CreatorLaunch is built from the student perspective.
                </h2>

                <div className="space-y-4">
                  {[
                    'We focus on practical, hands-on entrepreneurship instead of theory-only learning.',
                    'We make the Student Business Program free for students and families.',
                    'We are youth-led, so students see entrepreneurship modeled by people closer to their own experience.',
                    'We keep groups small so students have room to ask questions and get support.',
                    'We provide laptops and can approve up to $500 in direct project purchases.',
                  ].map((item) => (
                    <div key={item} className="bg-white rounded-2xl p-5 border border-gray-100">
                      <p className="text-medium">{item}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl overflow-hidden shadow-xl border border-white bg-white">
                <img
                  src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80"
                  alt="Team planning around laptops"
                  className="w-full h-[520px] object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-primary text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Help us make entrepreneurship real for more young people.
            </h2>

            <p className="text-white/90 text-lg max-w-2xl mx-auto mb-8">
              Students and families can learn about the program now and request updates as
              dates, locations, and enrollment details are finalized.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a
                href={programHref}
                className="bg-white text-primary px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Get Program Updates
              </a>

              <Link
                href="/student-business-program"
                className="bg-red-700 text-white px-8 py-4 rounded-lg font-semibold hover:bg-red-800 transition-colors"
              >
                Explore the Program
              </Link>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
};

export default AboutPage;
