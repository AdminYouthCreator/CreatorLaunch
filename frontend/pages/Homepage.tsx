import React from 'react';
import Link from 'next/link';
import Layout from '@/components/common/Layout';

const Homepage = () => {
  return (
    <Layout title="CreatorLaunch | Building the Next Generation of Founders">
      <main className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-white via-red-50 to-orange-50">
          <div className="container mx-auto px-4 py-20 md:py-28">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center bg-white border border-red-100 rounded-full px-4 py-2 mb-6 shadow-sm">
                <span className="text-sm font-semibold text-primary">
                  Youth-founded. Youth-run. Built for youth entrepreneurs.
                </span>
              </div>

              <h1 className="text-4xl md:text-6xl font-bold text-dark leading-tight mb-6">
                Building the Next Generation of Founders.
              </h1>

              <p className="text-lg md:text-xl text-medium max-w-3xl mx-auto mb-8">
                CreatorLaunch is a youth-led nonprofit helping young entrepreneurs turn ideas
                into real ventures through free workshops, launch funding, pitch competitions,
                and a digital platform built for youth creators.
              </p>

              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link
                  href="/contact"
                  className="bg-primary text-white px-8 py-4 rounded-lg font-semibold hover:bg-red-600 transition-colors"
                >
                  Join The Waitlist
                </Link>
                <Link
                  href="/about"
                  className="bg-white text-dark border border-gray-200 px-8 py-4 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                >
                  Learn About Us
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Learning by Doing */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-bold text-dark mb-4">
                Learning by Doing
              </h2>
              <p className="text-lg text-medium">
                We believe the best way to learn entrepreneurship is to live it. Our model
                replaces theory-only learning with action, guiding students through real-world
                business building.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
              <div className="bg-light rounded-2xl p-6 border border-gray-100">
                <div className="text-3xl mb-4">🛠️</div>
                <h3 className="text-xl font-bold text-dark mb-3">Hands-On Skills</h3>
                <p className="text-medium">
                  No experience needed. We walk students through market research, branding,
                  product creation, store setup, and business basics in a risk-free environment.
                </p>
              </div>

              <div className="bg-light rounded-2xl p-6 border border-gray-100">
                <div className="text-3xl mb-4">🤝</div>
                <h3 className="text-xl font-bold text-dark mb-3">Youth-Led Support</h3>
                <p className="text-medium">
                  Founded and run by youth, CreatorLaunch understands the real challenges
                  young people face when trying to start something before adulthood.
                </p>
              </div>

              <div className="bg-light rounded-2xl p-6 border border-gray-100">
                <div className="text-3xl mb-4">🚀</div>
                <h3 className="text-xl font-bold text-dark mb-3">Real Launch</h3>
                <p className="text-medium">
                  We do not just talk about ideas. We help youth prepare to launch ventures
                  through workshops, tools, pitch opportunities, and seed funding.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Mission + Vision */}
        <section className="py-20 bg-dark text-white">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
              <div className="bg-white/10 rounded-2xl p-8 border border-white/10">
                <div className="text-4xl mb-4">🎯</div>
                <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
                <p className="text-gray-200">
                  To help young creators build real businesses by providing hands-on
                  entrepreneurship education, seed funding, pitch opportunities, and digital
                  tools designed specifically for youth founders.
                </p>
              </div>

              <div className="bg-white/10 rounded-2xl p-8 border border-white/10">
                <div className="text-4xl mb-4">🌐</div>
                <h2 className="text-2xl font-bold mb-4">Our Vision</h2>
                <p className="text-gray-200">
                  To make youth entrepreneurship accessible everywhere by combining local
                  workshops, launch capital, and a digital platform where young founders can
                  build, launch, and grow their ventures.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Platform Preview */}
        <section className="py-20 bg-light">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-dark mb-4">
                  Workshops Today. Platform Tomorrow.
                </h2>
                <p className="text-lg text-medium mb-6">
                  CreatorLaunch is starting in St. Louis with in-person workshops and pitch
                  opportunities. As we grow, we are building a digital platform that helps
                  young entrepreneurs create stores, publish products, track progress, and
                  launch with confidence.
                </p>
                <Link
                  href="/partners"
                  className="inline-block bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-600 transition-colors"
                >
                  Partner With Us
                </Link>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                      💡
                    </div>
                    <div>
                      <h3 className="font-bold text-dark">Idea to Business</h3>
                      <p className="text-sm text-medium">Guided steps from concept to launch.</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                      🛒
                    </div>
                    <div>
                      <h3 className="font-bold text-dark">Digital Storefronts</h3>
                      <p className="text-sm text-medium">Tools for youth to publish and sell.</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                      🏆
                    </div>
                    <div>
                      <h3 className="font-bold text-dark">Pitch Competitions</h3>
                      <p className="text-sm text-medium">Opportunities to earn launch capital.</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                      📍
                    </div>
                    <div>
                      <h3 className="font-bold text-dark">St. Louis First</h3>
                      <p className="text-sm text-medium">Built locally, designed to scale.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-20 bg-primary text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Launch Your First Venture?
            </h2>
            <p className="text-lg max-w-2xl mx-auto mb-8 text-white/90">
              Join our next St. Louis cohort. Free workshops. Real launch support. Youth-led
              energy. Pure ambition.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href="/contact"
                className="bg-white text-primary px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Join The Waitlist
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

export default Homepage;
