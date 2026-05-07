import React from 'react';
import Link from 'next/link';
import Layout from '@/components/common/Layout';

const AboutPage = () => {
  return (
    <Layout title="About | CreatorLaunch">
      <main className="min-h-screen bg-white">
        {/* Hero */}
        <section className="bg-gradient-to-br from-white via-red-50 to-orange-50 py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <p className="text-primary font-semibold mb-3">
                By a student, for every student.
              </p>
              <h1 className="text-4xl md:text-6xl font-bold text-dark mb-6">
                Real business learning should not wait until college.
              </h1>
              <p className="text-lg md:text-xl text-medium max-w-3xl mx-auto">
                CreatorLaunch was built from a simple belief: young people do not need to
                wait for permission to create, lead, sell, build, and launch.
              </p>
            </div>
          </div>
        </section>

        {/* Origin Story */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center">
              <div className="bg-light rounded-2xl min-h-[360px] flex items-center justify-center border border-gray-100">
                <div className="text-center p-8">
                  <div className="w-24 h-24 bg-primary rounded-full mx-auto mb-4 flex items-center justify-center text-white text-4xl font-bold">
                    CL
                  </div>
                  <p className="text-medium">Founder photo coming soon</p>
                </div>
              </div>

              <div>
                <p className="text-primary font-semibold mb-2">Our Origin Story</p>
                <h2 className="text-3xl md:text-4xl font-bold text-dark mb-6">
                  Founded by a 16-year-old entrepreneur.
                </h2>

                <div className="space-y-4 text-medium text-lg">
                  <p>
                    CreatorLaunch began when our founder, a 16-year-old student with an
                    entrepreneurial mindset, looked at the existing landscape and saw a wall
                    between youth and the business world.
                  </p>

                  <p>
                    High school offered clubs, but not launch capital. It offered theory,
                    but not launchpads. It encouraged ambition, but rarely gave students the
                    tools to turn ideas into real ventures.
                  </p>

                  <p>
                    Driven by the desire to see more youth-run businesses in St. Louis and
                    beyond, CreatorLaunch was built to be the bridge. It is a peer-led movement
                    designed to prove that age is not a barrier to innovation. It can be an
                    advantage.
                  </p>
                </div>

                <blockquote className="mt-6 border-l-4 border-primary pl-4 italic text-dark font-medium">
                  “We are not just waiting for our turn to lead. We are building the businesses
                  of today.”
                </blockquote>
              </div>
            </div>
          </div>
        </section>

        {/* Mission + Vision */}
        <section className="py-20 bg-light">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                <h2 className="text-2xl font-bold text-dark mb-4">
                  The Mission: What We Do Now
                </h2>
                <p className="text-medium text-lg">
                  We empower young creators with hands-on workshops, launch funding, pitch
                  opportunities, and practical tools that help them build real ventures in a
                  low-risk, youth-centered environment.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                <h2 className="text-2xl font-bold text-dark mb-4">
                  The Vision: Where We Are Going
                </h2>
                <p className="text-medium text-lg">
                  We are scaling our St. Louis model into the CreatorLaunch digital platform,
                  making youth entrepreneurship more accessible through guided tools,
                  storefronts, resources, and launch pathways.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* History */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-dark mb-4">
                The History of Entrepreneurship Education in St. Louis
              </h2>
              <p className="text-lg text-medium">
                St. Louis has always been a city of builders. CreatorLaunch is here to make
                sure young founders are included in that future.
              </p>
            </div>

            <div className="max-w-4xl mx-auto space-y-6">
              <div className="bg-light rounded-2xl p-6 border border-gray-100">
                <h3 className="text-xl font-bold text-dark mb-2">The Traditional Era</h3>
                <p className="text-medium">
                  For decades, entrepreneurship was often gate-kept within universities,
                  professional networks, and adult business spaces. High schoolers were often
                  told to wait until college to start thinking like founders.
                </p>
              </div>

              <div className="bg-light rounded-2xl p-6 border border-gray-100">
                <h3 className="text-xl font-bold text-dark mb-2">The Theory Gap</h3>
                <p className="text-medium">
                  As entrepreneurship clubs and school programs became more common, many still
                  focused on business plans, slides, and ideas without giving students real
                  funding, tools, or launch opportunities.
                </p>
              </div>

              <div className="bg-red-50 rounded-2xl p-6 border border-red-100">
                <h3 className="text-xl font-bold text-dark mb-2">
                  2025: The CreatorLaunch Revolution
                </h3>
                <p className="text-medium">
                  CreatorLaunch is rewriting that story by putting youth at the center and
                  focusing on real business creation, launch capital, pitch competitions, and
                  tools that help young founders move from idea to action.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-primary text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Be Part of the History.
            </h2>
            <p className="text-white/90 text-lg max-w-2xl mx-auto mb-8">
              Whether you are a student, parent, educator, partner, or donor, you can help
              make youth entrepreneurship real.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href="/contact"
                className="bg-white text-primary px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Apply Now
              </Link>
              <Link
                href="/donate"
                className="bg-red-700 text-white px-8 py-4 rounded-lg font-semibold hover:bg-red-800 transition-colors"
              >
                Support Our Mission
              </Link>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
};

export default AboutPage;
