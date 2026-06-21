import React from 'react';
import Link from 'next/link';
import Layout from '@/components/common/Layout';

const CONTACT_EMAIL = 'qwentin@youthcreatorlaunch.org';

const bringHref = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
  'Bring CreatorLaunch to our community'
)}&body=${encodeURIComponent(
  'Hello CreatorLaunch,\n\nWe are interested in bringing CreatorLaunch entrepreneurship workshops to our community.\n\nOrganization name:\nCommunity served:\nBest contact person:\nPreferred timeline:\n\nMessage:\n'
)}`;

const Homepage = () => {
  return (
    <Layout
      title="CreatorLaunch | Youth Entrepreneurship Workshops & Community Partnerships"
      description="CreatorLaunch is a youth-led 501(c)(3) nonprofit helping schools, summer programs, afterschool programs, and community organizations bring no-cost entrepreneurship workshops to students and families."
      announcementText="Bring CreatorLaunch workshops to your school, summer program, afterschool program, or community organization."
    >
      <main className="min-h-screen bg-white">
        <section className="relative overflow-hidden bg-gradient-to-br from-white via-red-50 to-blue-50">
          <div className="absolute inset-0 opacity-40">
            <div className="absolute -top-24 -right-24 w-80 h-80 bg-red-200 rounded-full blur-3xl" />
            <div className="absolute bottom-0 -left-24 w-80 h-80 bg-blue-200 rounded-full blur-3xl" />
          </div>

          <div className="container mx-auto px-4 py-20 md:py-28 relative">
            <div className="grid lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
              <div>
                <div className="inline-flex items-center bg-white border border-red-100 rounded-full px-4 py-2 mb-6 shadow-sm">
                  <span className="text-sm font-semibold text-primary">
                    Youth-led nonprofit entrepreneurship workshops
                  </span>
                </div>

                <h1 className="text-4xl md:text-6xl font-bold text-dark leading-tight mb-6">
                  Bring CreatorLaunch to your community.
                </h1>

                <p className="text-lg md:text-xl text-medium max-w-2xl mb-8">
                  CreatorLaunch partners with schools, summer programs, afterschool programs,
                  nonprofits, and community organizations to bring hands-on entrepreneurship
                  workshops to students at no cost to students or families.
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                  <a
                    href={bringHref}
                    className="bg-primary text-white px-8 py-4 rounded-lg font-semibold hover:bg-red-600 transition-colors text-center"
                  >
                    Request a Workshop
                  </a>

                  <Link
                    href="/partners"
                    className="bg-white text-dark border border-gray-200 px-8 py-4 rounded-lg font-semibold hover:bg-gray-50 transition-colors text-center"
                  >
                    Partner With Us
                  </Link>
                </div>

                <div className="grid grid-cols-3 gap-4 mt-10 max-w-xl">
                  <div>
                    <p className="text-2xl font-black text-dark">No-cost</p>
                    <p className="text-sm text-medium">for students/families</p>
                  </div>
                  <div>
                    <p className="text-2xl font-black text-dark">Youth-led</p>
                    <p className="text-sm text-medium">real founder energy</p>
                  </div>
                  <div>
                    <p className="text-2xl font-black text-dark">Hands-on</p>
                    <p className="text-sm text-medium">business learning</p>
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="rounded-3xl overflow-hidden shadow-2xl border border-white bg-white">
                  <img
                    src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80"
                    alt="Workshop table with notebooks and planning materials"
                    className="w-full h-[420px] object-cover"
                  />
                </div>

                <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl border border-gray-100 p-5 max-w-xs hidden md:block">
                  <p className="text-primary font-bold mb-1">Built for action</p>
                  <p className="text-sm text-medium">
                    Students learn entrepreneurship by creating real ideas, brands,
                    products, services, and pitch plans.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-14">
              <p className="text-primary font-bold uppercase tracking-widest mb-3">
                What We Bring
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-dark mb-4">
                Entrepreneurship workshops that feel real.
              </h2>
              <p className="text-lg text-medium">
                CreatorLaunch is designed for young people who need more than lectures.
                We help students build confidence, ideas, and practical skills they can
                use right away.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
              <div className="bg-light rounded-2xl p-6 border border-gray-100">
                <div className="text-3xl mb-4">💡</div>
                <h3 className="text-xl font-bold text-dark mb-3">Idea to Action</h3>
                <p className="text-medium">
                  Students identify problems, explore business ideas, understand customers,
                  and learn how ideas become real ventures.
                </p>
              </div>

              <div className="bg-light rounded-2xl p-6 border border-gray-100">
                <div className="text-3xl mb-4">🎨</div>
                <h3 className="text-xl font-bold text-dark mb-3">Brand & Product Basics</h3>
                <p className="text-medium">
                  Students learn naming, branding, pricing, products, services, and how to
                  communicate what they are building.
                </p>
              </div>

              <div className="bg-light rounded-2xl p-6 border border-gray-100">
                <div className="text-3xl mb-4">🚀</div>
                <h3 className="text-xl font-bold text-dark mb-3">Pitch & Launch Skills</h3>
                <p className="text-medium">
                  Students practice pitching, planning next steps, and thinking like founders
                  with support from a youth-led team.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-slate-950 text-white overflow-hidden">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-10 max-w-6xl mx-auto items-center">
              <div>
                <p className="text-red-300 font-bold uppercase tracking-widest mb-3">
                  CreatorGames
                </p>

                <h2 className="text-3xl md:text-5xl font-bold mb-6">
                  Students can practice money and business decisions through games.
                </h2>

                <p className="text-white/75 text-lg mb-6">
                  CreatorGames is our learning arcade with curated financial and
                  entrepreneurship games. Students can explore budgeting, credit, investing,
                  careers, insurance, and entrepreneurship in a fun, interactive way.
                </p>

                <p className="text-white/60 mb-8">
                  It is a great add-on for workshops, classrooms, afterschool programs,
                  and students who want to keep learning outside of a live session.
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    href="/games"
                    className="bg-primary text-white px-8 py-4 rounded-lg font-semibold hover:bg-red-600 transition-colors text-center"
                  >
                    Explore CreatorGames
                  </Link>

                  <Link
                    href="/bring-creatorlaunch"
                    className="bg-white/10 text-white border border-white/10 px-8 py-4 rounded-lg font-semibold hover:bg-white/15 transition-colors text-center"
                  >
                    Use Games in a Workshop
                  </Link>
                </div>
              </div>

              <div className="relative">
                <div className="absolute -top-20 -right-20 w-72 h-72 bg-red-500/25 rounded-full blur-3xl" />
                <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-blue-500/25 rounded-full blur-3xl" />

                <div className="relative bg-white/10 border border-white/10 rounded-3xl p-6 shadow-2xl">
                  <div className="grid gap-4">
                    <div className="bg-white text-slate-950 rounded-2xl p-5">
                      <div className="flex items-center gap-4">
                        <div className="text-4xl">🎮</div>
                        <div>
                          <p className="font-black text-lg">CreatorGames Arcade</p>
                          <p className="text-sm text-slate-600">
                            Financial learning games curated by CreatorLaunch.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      {[
                        'Entrepreneurship',
                        'Budgeting',
                        'Credit',
                        'Investing',
                        'Insurance',
                        'Careers',
                      ].map((item) => (
                        <div
                          key={item}
                          className="bg-white/10 border border-white/10 rounded-2xl p-4"
                        >
                          <p className="font-bold">{item}</p>
                          <p className="text-sm text-white/60 mt-1">
                            Learn by playing
                          </p>
                        </div>
                      ))}
                    </div>

                    <Link
                      href="/games/influencd"
                      className="block bg-red-500 hover:bg-red-600 text-white text-center rounded-2xl p-4 font-black transition-colors"
                    >
                      Featured Game: Influenc’d →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-dark text-white">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-10 max-w-6xl mx-auto items-center">
              <div>
                <p className="text-red-300 font-bold uppercase tracking-widest mb-3">
                  For Schools, Programs & Organizations
                </p>

                <h2 className="text-3xl md:text-5xl font-bold mb-6">
                  We meet young people where they already are.
                </h2>

                <p className="text-gray-200 text-lg mb-6">
                  CreatorLaunch works with summer programs, afterschool programs, schools,
                  libraries, nonprofits, churches, community centers, youth organizations,
                  and local partners who want to bring practical entrepreneurship learning
                  to their community.
                </p>

                <a
                  href={bringHref}
                  className="inline-block bg-primary text-white px-8 py-4 rounded-lg font-semibold hover:bg-red-600 transition-colors"
                >
                  Bring CreatorLaunch to Your Community
                </a>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  'Summer programs',
                  'Afterschool programs',
                  'Schools',
                  'Community centers',
                  'Youth nonprofits',
                  'Libraries',
                  'Churches',
                  'Local organizations',
                ].map((item) => (
                  <div
                    key={item}
                    className="bg-white/10 rounded-2xl p-5 border border-white/10"
                  >
                    <p className="font-bold">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-light">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-10 max-w-6xl mx-auto items-center">
              <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
                <img
                  src="https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=1200&q=80"
                  alt="Planning board with notes and strategy"
                  className="w-full h-72 object-cover rounded-2xl mb-6"
                />

                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                      1
                    </div>
                    <div>
                      <h3 className="font-bold text-dark">Partner requests a workshop</h3>
                      <p className="text-sm text-medium">
                        Tell us about your organization, community, and students.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                      2
                    </div>
                    <div>
                      <h3 className="font-bold text-dark">We plan the right fit</h3>
                      <p className="text-sm text-medium">
                        We align the workshop format with your schedule and group.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                      3
                    </div>
                    <div>
                      <h3 className="font-bold text-dark">Students build and pitch</h3>
                      <p className="text-sm text-medium">
                        Youth leave with practical skills, ideas, and next steps.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-primary font-bold uppercase tracking-widest mb-3">
                  Digital Platform Still Growing
                </p>
                <h2 className="text-3xl md:text-4xl font-bold text-dark mb-4">
                  Workshops first. Platform alongside it.
                </h2>
                <p className="text-lg text-medium mb-6">
                  The CreatorLaunch digital platform is still part of the vision. It will help
                  young creators build stores, products, services, and launch pathways online.
                  But our public focus right now is community partnerships, workshops, and
                  donor support that make youth entrepreneurship more accessible.
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    href="/progress"
                    className="bg-white text-dark border border-gray-200 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors text-center"
                  >
                    View Platform Progress
                  </Link>

                  <Link
                    href="/donate"
                    className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-600 transition-colors text-center"
                  >
                    Support the Mission
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-primary text-white">
          <div className="container mx-auto px-4 text-center">
            <p className="font-bold uppercase tracking-widest text-white/80 mb-3">
              Ready to start?
            </p>

            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Bring youth entrepreneurship to your community.
            </h2>

            <p className="text-lg max-w-2xl mx-auto mb-8 text-white/90">
              If you run a school, summer program, afterschool program, nonprofit,
              or youth-serving organization, we would love to hear from you.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a
                href={bringHref}
                className="bg-white text-primary px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Request CreatorLaunch
              </a>

              <Link
                href="/donate"
                className="bg-red-700 text-white px-8 py-4 rounded-lg font-semibold hover:bg-red-800 transition-colors"
              >
                Donate
              </Link>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
};

export default Homepage;