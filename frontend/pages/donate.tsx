import React from 'react';
import Link from 'next/link';
import Layout from '@/components/common/Layout';

const DonatePage = () => {
  return (
    <Layout title="Donate | CreatorLaunch">
      <main className="min-h-screen bg-white">
        {/* Hero */}
        <section className="bg-gradient-to-br from-white via-red-50 to-orange-50 py-20">
          <div className="container mx-auto px-4 text-center">
            <p className="text-primary font-semibold mb-3">
              Fuel the next big idea.
            </p>
            <h1 className="text-4xl md:text-6xl font-bold text-dark mb-6">
              Help Youth Founders Launch.
            </h1>
            <p className="text-lg md:text-xl text-medium max-w-3xl mx-auto">
              Your contribution supports launch capital, workshops, pitch competitions,
              tools, and resources for St. Louis teens building real ventures.
            </p>
          </div>
        </section>

        {/* Donation Impact */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
              <div className="bg-light rounded-2xl p-8 border border-gray-100 text-center">
                <div className="text-4xl font-bold text-primary mb-2">100%</div>
                <p className="font-semibold text-dark mb-2">Youth Impact Focus</p>
                <p className="text-medium">
                  Donations help support student seed grants, workshops, and launch resources.
                </p>
              </div>

              <div className="bg-light rounded-2xl p-8 border border-gray-100 text-center">
                <div className="text-4xl font-bold text-primary mb-2">$475</div>
                <p className="font-semibold text-dark mb-2">Average Launch Support Goal</p>
                <p className="text-medium">
                  Around this amount can help cover basic startup needs for a youth venture.
                </p>
              </div>

              <div className="bg-light rounded-2xl p-8 border border-gray-100 text-center">
                <div className="text-4xl font-bold text-primary mb-2">Youth-Run</div>
                <p className="font-semibold text-dark mb-2">Led by Young Founders</p>
                <p className="text-medium">
                  CreatorLaunch is founded and run by youth, with support from trusted adults
                  and community partners.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Donation Placeholder */}
        <section className="py-20 bg-light">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center">
              <h2 className="text-3xl font-bold text-dark mb-4">
                Donation Processing Coming Soon
              </h2>
              <p className="text-lg text-medium mb-8">
                Online donations are being set up. For now, contact us directly if you are
                interested in supporting CreatorLaunch.
              </p>

              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link
                  href="/contact"
                  className="bg-primary text-white px-8 py-4 rounded-lg font-semibold hover:bg-red-600 transition-colors"
                >
                  Contact Us to Give
                </Link>
                <Link
                  href="/partners"
                  className="bg-white text-dark border border-gray-200 px-8 py-4 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                >
                  Partner With Us
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Other Ways to Give */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-dark mb-4">
                  Other Ways to Give
                </h2>
                <p className="text-lg text-medium">
                  Funding is powerful, but support can come in many forms.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-light rounded-2xl p-6 border border-gray-100">
                  <h3 className="text-xl font-bold text-dark mb-3">Corporate Matching</h3>
                  <p className="text-medium">
                    Check if your employer matches donations to nonprofits to help double
                    your impact.
                  </p>
                </div>

                <div className="bg-light rounded-2xl p-6 border border-gray-100">
                  <h3 className="text-xl font-bold text-dark mb-3">Equipment & Tech</h3>
                  <p className="text-medium">
                    We accept donated laptops, software licenses, and professional equipment
                    for workshops and youth founder labs.
                  </p>
                </div>

                <div className="bg-light rounded-2xl p-6 border border-gray-100">
                  <h3 className="text-xl font-bold text-dark mb-3">Workshop Sponsorship</h3>
                  <p className="text-medium">
                    Help cover meals, transportation support, materials, and space for
                    youth entrepreneurship workshops.
                  </p>
                </div>

                <div className="bg-light rounded-2xl p-6 border border-gray-100">
                  <h3 className="text-xl font-bold text-dark mb-3">Launch Capital</h3>
                  <p className="text-medium">
                    Sponsor seed grants or pitch competition awards that help students
                    launch real ventures.
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

export default DonatePage;
