import React from 'react';
import Link from 'next/link';
import GamesLayout from '@/components/games/GamesLayout';

const GamesHomePage: React.FC = () => {
  return (
    <GamesLayout
      title="CreatorGames | Learn Entrepreneurship by Playing"
      description="CreatorGames is a section of CreatorLaunch with simple online entrepreneurship games for young creators."
    >
      <main>
        <section className="relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute -top-40 -right-40 w-96 h-96 bg-red-500/25 rounded-full blur-3xl" />
            <div className="absolute top-40 -left-40 w-96 h-96 bg-blue-500/25 rounded-full blur-3xl" />
          </div>

          <div className="container mx-auto px-4 py-20 md:py-28 relative">
            <div className="max-w-5xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-bold text-white/90 mb-6">
                <span className="w-2.5 h-2.5 rounded-full bg-red-400 animate-pulse" />
                New CreatorLaunch learning section
              </div>

              <h1 className="text-5xl md:text-7xl font-black leading-tight mb-6">
                Learn business by playing.
              </h1>

              <p className="text-lg md:text-xl text-white/70 max-w-3xl mx-auto mb-10">
                CreatorGames are simple entrepreneurship games that help young people
                practice pricing, budgeting, marketing, decision-making, and profit.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/games/lemonade-stand"
                  className="bg-red-500 hover:bg-red-600 text-white px-8 py-4 rounded-2xl font-black transition-colors"
                >
                  Play Lemonade Stand
                </Link>

                <Link
                  href="/"
                  className="bg-white/10 hover:bg-white/15 text-white px-8 py-4 rounded-2xl font-black border border-white/10 transition-colors"
                >
                  Back to CreatorLaunch
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white text-slate-950 py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <p className="text-red-600 uppercase tracking-widest font-black mb-3">
                Featured Game
              </p>

              <h2 className="text-3xl md:text-5xl font-black mb-4">
                Start your first tiny business.
              </h2>

              <p className="text-slate-600 text-lg">
                The first CreatorGames release is a simple Lemonade Stand simulator.
                Make decisions, sell lemonade, and learn what affects profit.
              </p>
            </div>

            <div className="max-w-5xl mx-auto">
              <Link href="/games/lemonade-stand" className="group block">
                <div className="grid lg:grid-cols-2 gap-0 rounded-3xl overflow-hidden shadow-2xl border border-slate-100 bg-slate-950 text-white">
                  <div className="p-8 md:p-10 flex flex-col justify-center">
                    <div className="text-6xl mb-6">🍋</div>

                    <p className="text-red-300 uppercase tracking-widest font-black mb-3">
                      Play Now
                    </p>

                    <h3 className="text-3xl md:text-4xl font-black mb-4">
                      CreatorGames: Lemonade Stand
                    </h3>

                    <p className="text-white/70 mb-6">
                      Buy supplies, set your price, spend on marketing, respond to
                      weather, and see if you can make a profit in 7 days.
                    </p>

                    <div className="grid grid-cols-2 gap-3 mb-8">
                      <div className="rounded-2xl bg-white/10 border border-white/10 p-4">
                        <p className="font-black">Skill</p>
                        <p className="text-sm text-white/60">Pricing</p>
                      </div>

                      <div className="rounded-2xl bg-white/10 border border-white/10 p-4">
                        <p className="font-black">Skill</p>
                        <p className="text-sm text-white/60">Budgeting</p>
                      </div>

                      <div className="rounded-2xl bg-white/10 border border-white/10 p-4">
                        <p className="font-black">Skill</p>
                        <p className="text-sm text-white/60">Marketing</p>
                      </div>

                      <div className="rounded-2xl bg-white/10 border border-white/10 p-4">
                        <p className="font-black">Skill</p>
                        <p className="text-sm text-white/60">Profit</p>
                      </div>
                    </div>

                    <span className="inline-flex w-fit bg-red-500 group-hover:bg-red-600 text-white px-6 py-3 rounded-2xl font-black transition-colors">
                      Launch Game →
                    </span>
                  </div>

                  <div className="bg-gradient-to-br from-yellow-300 via-orange-300 to-red-400 p-8 md:p-10 flex items-center justify-center">
                    <div className="bg-white/90 text-slate-950 rounded-3xl p-8 shadow-2xl max-w-sm w-full">
                      <div className="text-center">
                        <div className="text-7xl mb-4">🍋</div>
                        <h4 className="text-2xl font-black mb-2">Lemonade Stand</h4>
                        <p className="text-slate-600 mb-6">
                          7-day business challenge
                        </p>

                        <div className="grid gap-3 text-left">
                          <div className="flex justify-between border-b border-slate-100 pb-2">
                            <span>Starting Cash</span>
                            <strong>$25</strong>
                          </div>
                          <div className="flex justify-between border-b border-slate-100 pb-2">
                            <span>Goal</span>
                            <strong>Profit</strong>
                          </div>
                          <div className="flex justify-between">
                            <span>Lesson</span>
                            <strong>Business Basics</strong>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </section>

        <section className="py-20 bg-slate-900">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto text-center">
              <p className="text-red-300 uppercase tracking-widest font-black mb-3">
                Coming Later
              </p>

              <h2 className="text-3xl md:text-5xl font-black mb-10">
                More CreatorGames ideas
              </h2>

              <div className="grid md:grid-cols-3 gap-4">
                {[
                  'T-Shirt Brand Simulator',
                  'Food Truck Startup',
                  'Pitch Competition Game',
                  'Pop-Up Shop Challenge',
                  'Social Media Agency Game',
                  'Budget Builder Game',
                ].map((game) => (
                  <div
                    key={game}
                    className="rounded-2xl border border-white/10 bg-white/5 p-6 text-left"
                  >
                    <p className="font-black text-lg">{game}</p>
                    <p className="text-white/60 text-sm mt-2">Planned future game</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
    </GamesLayout>
  );
};

export default GamesHomePage;