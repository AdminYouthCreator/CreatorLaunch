import React from 'react';
import Head from 'next/head';
import { maintenanceConfig } from '@/config/maintenance';

const MaintenancePage: React.FC = () => {
  return (
    <>
      <Head>
        <title>Maintenance | CreatorLaunch</title>
        <meta
          name="description"
          content="CreatorLaunch is temporarily under maintenance while we improve the platform."
        />
      </Head>

      <main className="min-h-screen bg-gradient-to-br from-white via-red-50 to-blue-50 flex items-center justify-center px-4 py-12">
        <div className="max-w-5xl w-full">
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="h-3 bg-gradient-to-r from-red-500 via-blue-600 to-gray-900" />

            <div className="grid lg:grid-cols-2 gap-0">
              <section className="p-8 md:p-12 flex flex-col justify-center">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-14 h-14 rounded-2xl bg-primary text-white flex items-center justify-center font-black text-2xl shadow-md">
                    C
                  </div>

                  <div>
                    <h1 className="text-xl font-black text-dark leading-tight">
                      CreatorLaunch
                    </h1>
                    <p className="text-sm text-medium">
                      Founded by youth. Built for youth.
                    </p>
                  </div>
                </div>

                <div className="inline-flex items-center gap-2 bg-red-50 border border-red-100 text-primary rounded-full px-4 py-2 text-sm font-bold w-fit mb-6">
                  <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
                  {maintenanceConfig.statusLabel}
                </div>

                <h2 className="text-4xl md:text-5xl font-black text-dark leading-tight mb-5">
                  {maintenanceConfig.title}
                </h2>

                <p className="text-lg text-medium leading-relaxed mb-6">
                  {maintenanceConfig.subtitle}
                </p>

                <div className="bg-light rounded-2xl border border-gray-100 p-5 mb-8">
                  <p className="text-dark font-bold mb-2">
                    What is happening?
                  </p>

                  <p className="text-medium leading-relaxed">
                    {maintenanceConfig.message}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <a
                    href={`mailto:${maintenanceConfig.contactEmail}`}
                    className="bg-primary text-white px-6 py-3 rounded-xl font-bold hover:bg-red-600 transition-colors text-center"
                  >
                    Contact CreatorLaunch
                  </a>

                  <button
                    type="button"
                    onClick={() => window.location.reload()}
                    className="border-2 border-primary text-primary px-6 py-3 rounded-xl font-bold hover:bg-primary hover:text-white transition-colors"
                  >
                    Refresh Page
                  </button>
                </div>
              </section>

              <section className="bg-dark text-white p-8 md:p-12 flex flex-col justify-center relative overflow-hidden">
                <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/20 rounded-full blur-3xl" />
                <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl" />

                <div className="relative z-10">
                  <p className="text-red-300 font-bold uppercase tracking-widest mb-4">
                    Building in Public
                  </p>

                  <h3 className="text-3xl font-black leading-tight mb-5">
                    We are improving the platform for young founders.
                  </h3>

                  <p className="text-white/75 leading-relaxed mb-8">
                    CreatorLaunch is building tools for youth creators to create brands,
                    launch stores, share products, offer services, and grow real business
                    ideas safely.
                  </p>

                  <div className="grid gap-4">
                    <div className="bg-white/10 border border-white/10 rounded-2xl p-5">
                      <p className="font-bold text-white mb-1">
                        Safer creator tools
                      </p>
                      <p className="text-white/70 text-sm">
                        We are improving the experience for creators, admins, and visitors.
                      </p>
                    </div>

                    <div className="bg-white/10 border border-white/10 rounded-2xl p-5">
                      <p className="font-bold text-white mb-1">
                        Better platform stability
                      </p>
                      <p className="text-white/70 text-sm">
                        We are checking pages, routes, dashboards, and platform features.
                      </p>
                    </div>

                    <div className="bg-white/10 border border-white/10 rounded-2xl p-5">
                      <p className="font-bold text-white mb-1">
                        More launch-ready features
                      </p>
                      <p className="text-white/70 text-sm">
                        Every update brings CreatorLaunch closer to public release.
                      </p>
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-white/10">
                    <p className="text-sm text-white/60">
                      {maintenanceConfig.estimatedReturn}
                    </p>
                  </div>
                </div>
              </section>
            </div>
          </div>

          <p className="text-center text-sm text-gray-500 mt-6">
            CreatorLaunch is temporarily unavailable while maintenance mode is enabled.
          </p>
        </div>
      </main>
    </>
  );
};

export default MaintenancePage;
