import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import GamesLayout from '@/components/games/GamesLayout';
import { ngpfGames } from '@/data/ngpfGames';

const GamesHomePage: React.FC = () => {
  const [selectedActivity, setSelectedActivity] = useState('All');

  const activities = useMemo(
    () => ['All', ...Array.from(new Set(ngpfGames.map((game) => game.activity)))],
    [],
  );

  const filteredGames = useMemo(
    () => selectedActivity === 'All'
      ? ngpfGames
      : ngpfGames.filter((game) => game.activity === selectedActivity),
    [selectedActivity],
  );

  return (
    <GamesLayout
      title="CreatorGames | Financial & Entrepreneurship Games"
      description="A curated collection of online games about entrepreneurship, budgeting, credit, investing, insurance, and financial decisions."
    >
      <main className="games-main">
        <section className="games-intro">
          <div className="container mx-auto px-4">
            <p className="games-eyebrow">CreatorGames</p>
            <h1>Practice financial decisions through games.</h1>
            <p>
              Browse free games about entrepreneurship, budgeting, credit, investing,
              insurance, careers, and other real-world choices.
            </p>
          </div>
        </section>

        <section className="games-library">
          <div className="container mx-auto px-4">
            <div className="games-library-heading">
              <div><p className="games-eyebrow">Game library</p><h2>Choose a topic or browse everything.</h2></div>
              <p>If a game cannot load inside CreatorGames, its page includes a link to open it directly.</p>
            </div>

            <div className="games-filters" aria-label="Filter games by topic">
              {activities.map((activity) => (
                <button
                  key={activity}
                  type="button"
                  onClick={() => setSelectedActivity(activity)}
                  className={selectedActivity === activity ? 'active' : ''}
                >
                  {activity}
                </button>
              ))}
            </div>

            <div className="games-list">
              {filteredGames.map((game, index) => (
                <Link key={game.slug} href={`/games/${game.slug}`}>
                  <span className="games-list-number">{String(index + 1).padStart(2, '0')}</span>
                  <div>
                    <p className="games-topic">{game.activity}</p>
                    <h3>{game.name}</h3>
                    <p>{game.description}</p>
                  </div>
                  <span className="games-play">Play game →</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
    </GamesLayout>
  );
};

export default GamesHomePage;
