import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import GamesLayout from '@/components/games/GamesLayout';
import { ngpfGames } from '@/data/ngpfGames';

const GamesHomePage: React.FC = () => {
  const [selectedActivity, setSelectedActivity] = useState('All');

  const activities = useMemo(() => {
    return ['All', ...Array.from(new Set(ngpfGames.map((game) => game.activity)))];
  }, []);

  const filteredGames = useMemo(() => {
    if (selectedActivity === 'All') return ngpfGames;

    return ngpfGames.filter((game) => game.activity === selectedActivity);
  }, [selectedActivity]);

  return (
    <GamesLayout
      title="CreatorGames | Financial & Entrepreneurship Games"
      description="CreatorGames is a curated section of CreatorLaunch featuring online games that teach entrepreneurship, budgeting, credit, investing, insurance, and financial decision-making."
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
                CreatorLaunch learning arcade
              </div>

              <h1 className="text-5xl md:text-7xl font-black leading-tight mb-6">
                Play your way into smarter money decisions.
              </h1>

              <p className="text-lg md:text-xl text-white/70 max-w-3xl mx-auto mb-10">
                CreatorGames is a curated collection of financial and entrepreneurship
                games that help young people practice budgeting, credit, investing,
                insurance, careers, and business decision-making.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/games/influencd"
                  className="bg-red-500 hover:bg-red-600 text-white px-8 py-4 rounded-2xl font-black transition-colors"
                >
                  Play Entrepreneurship Game
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

        <section className="bg-white text-slate-950 py-16 md:py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-10">
              <p className="text-red-600 uppercase tracking-widest font-black mb-3">
                Game Library
              </p>

              <h2 className="text-3xl md:text-5xl font-black mb-4">
                Choose a game and start learning.
              </h2>

              <p className="text-slate-600 text-lg">
                Each game opens inside CreatorGames when possible. If a game does not load
                inside the page, use the open game button on that game page.
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-2 mb-10">
              {activities.map((activity) => (
                <button
                  key={activity}
                  type="button"
                  onClick={() => setSelectedActivity(activity)}
                  className={`px-4 py-2 rounded-full text-sm font-black transition-colors ${
                    selectedActivity === activity
                      ? 'bg-red-500 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {activity}
                </button>
              ))}
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
              {filteredGames.map((game) => (
                <Link
                  key={game.slug}
                  href={`/games/${game.slug}`}
                  className="group block rounded-3xl overflow-hidden bg-slate-950 text-white shadow-lg border border-slate-100 hover:-translate-y-1 transition-transform"
                >
                  <div className="relative h-52 bg-slate-900 overflow-hidden">
                    <img
                      src={game.thumbnailUrl}
                      alt={`${game.name} thumbnail`}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/10 to-transparent" />

                    <div className="absolute top-4 left-4">
                      <span className="bg-red-500 text-white text-xs font-black uppercase tracking-wider rounded-full px-3 py-1">
                        {game.activity}
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-2xl font-black mb-3">{game.name}</h3>

                    <p className="text-white/70 text-sm mb-5">
                      {game.description}
                    </p>

                    <span className="inline-flex text-red-300 font-black group-hover:text-red-200">
                      Play Game →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-slate-900">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-8 items-center">
              <div>
                <p className="text-red-300 uppercase tracking-widest font-black mb-3">
                  Why CreatorGames?
                </p>

                <h2 className="text-3xl md:text-5xl font-black mb-6">
                  Financial decisions are easier to understand when you can practice them.
                </h2>

                <p className="text-white/70 text-lg">
                  CreatorGames gives students a fun way to explore real-world money and
                  business choices before they face them in real life.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  'Budgeting',
                  'Entrepreneurship',
                  'Credit',
                  'Investing',
                  'Insurance',
                  'Career Decisions',
                ].map((item) => (
                  <div
                    key={item}
                    className="rounded-2xl border border-white/10 bg-white/5 p-6"
                  >
                    <p className="font-black text-lg">{item}</p>
                    <p className="text-white/60 text-sm mt-2">
                      Practice through interactive gameplay.
                    </p>
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