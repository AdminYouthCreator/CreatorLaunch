import React from 'react';
import Head from 'next/head';
import Header from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';

const DonatePage: React.FC = () => {
  return (
    <>
      <Head>
        <title>Donate | CreatorLaunch</title>
        <meta
          name="description"
          content="Support CreatorLaunch and help fund youth entrepreneurship, workshops, student launch capital, and creator tools."
        />
      </Head>

      <Header />

      <main>
        <section className="bg-gradient-to-br from-white via-red-50 to-blue-50 py-20">
          <div className="container mx-auto px-4 text-center">
            <p className="text-primary font-bold uppercase tracking-widest mb-3">
              Support CreatorLaunch
            </p>

            <h1 className="text-4xl md:text-6xl font-bold text-dark mb-6">
              Help Young Founders Launch.
            </h1>

            <p className="text-xl text-medium max-w-3xl mx-auto">
              Your support helps CreatorLaunch provide youth entrepreneurship resources,
              creator tools, student business support, and launch opportunities for young
              founders.
            </p>
          </div>
        </section>

        <section className="bg-light py-16">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <div className="lg:col-span-2">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8">
                  <p className="text-primary font-bold uppercase tracking-widest mb-3">
                    Donation Progress
                  </p>

                  <h2 className="text-3xl md:text-4xl font-bold text-dark mb-4">
                    See the campaign grow.
                  </h2>

                  <p className="text-medium mb-6">
                    CreatorLaunch uses Zeffy to collect donations with no platform fees,
                    helping more of each contribution go toward supporting young creators.
                  </p>

                  <div className="rounded-2xl border border-gray-100 bg-light p-4">
                    <div
                      style={{
                        position: 'relative',
                        overflow: 'hidden',
                        width: '100%',
                        paddingTop: '120px',
                      }}
                    >
                      <iframe
                        title="Donation form powered by Zeffy"
                        style={{
                          position: 'absolute',
                          border: 0,
                          top: 0,
                          left: 0,
                          bottom: 0,
                          right: 0,
                          width: '100%',
                          height: '120px',
                        }}
                        src="https://www.zeffy.com/embed/thermometer/donate-to-support-a-young-ceo"
                        allowTransparency={true}
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                  <p className="text-primary font-bold uppercase tracking-widest mb-3">
                    Make a Donation
                  </p>

                  <h2 className="text-3xl md:text-4xl font-bold text-dark mb-4">
                    Donate through Zeffy.
                  </h2>

                  <p className="text-medium mb-6">
                    Use the secure Zeffy donation form below to support CreatorLaunch.
                    Donations help us continue building tools, programs, and opportunities
                    for young entrepreneurs.
                  </p>

                  <div className="rounded-2xl border border-gray-100 overflow-hidden bg-white">
                    <iframe
                      title="Donate to support CreatorLaunch through Zeffy"
                      src="https://www.zeffy.com/embed/donation-form/donate-to-support-a-young-ceo"
                      allowTransparency={true}
                      style={{
                        width: '100%',
                        minHeight: '900px',
                        border: 0,
                      }}
                    />
                  </div>

                  <p className="text-sm text-gray-500 text-center mt-4">
                    Donation form powered by Zeffy.
                  </p>
                </div>
              </div>

              <aside className="space-y-6">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <h3 className="text-xl font-bold text-dark mb-4">
                    What Your Support Helps Fund
                  </h3>

                  <div className="space-y-4 text-medium">
                    <p>
                      <strong>Workshops</strong> that teach young people how to build,
                      brand, and launch business ideas.
                    </p>

                    <p>
                      <strong>Creator tools</strong> that help students create stores,
                      products, services, and real business plans.
                    </p>

                    <p>
                      <strong>Launch support</strong> for youth-led ventures that need
                      materials, supplies, or startup help.
                    </p>

                    <p>
                      <strong>Platform development</strong> so CreatorLaunch can continue
                      building a safer online launchpad for young founders.
                    </p>
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <h3 className="text-xl font-bold text-dark mb-4">
                    Why Zeffy?
                  </h3>

                  <p className="text-medium">
                    Zeffy helps nonprofits accept donations without platform fees. That
                    means more support can go directly toward CreatorLaunch’s mission.
                  </p>
                </div>

                <div className="bg-primary text-white rounded-2xl shadow-sm p-6">
                  <h3 className="text-xl font-bold mb-3">
                    Founded by youth. Built for youth.
                  </h3>

                  <p className="text-white/90">
                    CreatorLaunch is building a platform where young creators can turn
                    ideas into brands, stores, products, services, and real opportunities.
                  </p>
                </div>
              </aside>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default DonatePage;
