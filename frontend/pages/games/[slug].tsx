import React, { useRef, useState } from 'react';
import { GetStaticPaths, GetStaticProps } from 'next';
import Link from 'next/link';
import GamesLayout from '@/components/games/GamesLayout';
import { NgpfGame, getNgpfGameBySlug, ngpfGames, ngpfDisclaimer } from '@/data/ngpfGames';

interface GamePageProps {
  game: NgpfGame;
}

const GamePage: React.FC<GamePageProps> = ({ game }) => {
  const gameFrameWrapperRef = useRef<HTMLDivElement | null>(null);
  const [hasStartedGame, setHasStartedGame] = useState(false);

  const enterFullscreen = async () => {
    setHasStartedGame(true);

    const element = gameFrameWrapperRef.current;

    if (!element) {
      return;
    }

    try {
      if (element.requestFullscreen) {
        await element.requestFullscreen();
      }
    } catch (error) {
      console.error('Fullscreen request failed:', error);
    }
  };

  const startWithoutFullscreen = () => {
    setHasStartedGame(true);
  };

  return (
    <GamesLayout
      title={`${game.name} | CreatorGames`}
      description={game.description}
    >
      <main>
        <section className="relative overflow-hidden border-b border-white/10">
          <div className="absolute inset-0">
            <div className="absolute -top-40 -right-40 w-96 h-96 bg-red-500/20 rounded-full blur-3xl" />
            <div className="absolute top-40 -left-40 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />
          </div>

          <div className="container mx-auto px-4 py-10 md:py-14 relative">
            <Link href="/games" className="text-red-300 font-bold hover:text-red-200">
              ← Back to Games
            </Link>

            <div className="grid lg:grid-cols-3 gap-8 mt-6 items-center">
              <div className="lg:col-span-2">
                <span className="inline-flex bg-red-500 text-white text-xs font-black uppercase tracking-widest rounded-full px-3 py-1 mb-4">
                  {game.activity}
                </span>

                <h1 className="text-4xl md:text-6xl font-black leading-tight mb-5">
                  {game.name}
                </h1>

                <p className="text-lg text-white/70 max-w-3xl mb-5">
                  {game.description}
                </p>

                {game.extraDisclaimer && (
                  <div className="rounded-2xl border border-yellow-300/20 bg-yellow-300/10 p-4 text-sm text-yellow-100 mb-5">
                    {game.extraDisclaimer}
                  </div>
                )}

                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/70 mb-6">
                  <p className="font-semibold text-white mb-1">Game Disclaimer</p>
                  <p>{ngpfDisclaimer}</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    type="button"
                    onClick={enterFullscreen}
                    className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-2xl font-black text-center transition-colors"
                  >
                    Start Fullscreen
                  </button>

                  <a
                    href={game.embedUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white/10 hover:bg-white/15 text-white px-6 py-3 rounded-2xl font-black text-center border border-white/10 transition-colors"
                  >
                    Open Game in New Tab
                  </a>

                  <Link
                    href="/games"
                    className="bg-white/10 hover:bg-white/15 text-white px-6 py-3 rounded-2xl font-black text-center border border-white/10 transition-colors"
                  >
                    Choose Another Game
                  </Link>
                </div>
              </div>

              <div className="rounded-3xl overflow-hidden border border-white/10 bg-white/5 shadow-2xl">
                <img
                  src={game.thumbnailUrl}
                  alt={`${game.name} thumbnail`}
                  className="w-full h-72 object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="bg-slate-900 py-6 md:py-8">
          <div className="container mx-auto px-2 md:px-4">
            <div
              ref={gameFrameWrapperRef}
              className="rounded-3xl overflow-hidden border border-white/10 bg-slate-950 shadow-2xl fullscreen:bg-slate-950 fullscreen:rounded-none fullscreen:border-0"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 p-4 border-b border-white/10 bg-slate-950">
                <div>
                  <p className="font-black">{game.name}</p>
                  <p className="text-sm text-white/50">
                    Click Start Fullscreen for the best experience. If you exit fullscreen,
                    you can keep playing here.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <button
                    type="button"
                    onClick={enterFullscreen}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl font-black text-sm text-center transition-colors"
                  >
                    Fullscreen
                  </button>

                  <a
                    href={game.embedUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white text-slate-950 px-4 py-2 rounded-xl font-black text-sm text-center hover:bg-slate-100 transition-colors"
                  >
                    Open Game
                  </a>
                </div>
              </div>

              <div className="relative bg-white" style={{ height: '80vh', minHeight: '620px' }}>
                {!hasStartedGame ? (
                  <div className="absolute inset-0 bg-slate-950 text-white flex items-center justify-center p-6">
                    <div className="max-w-lg text-center">
                      <div className="text-6xl mb-5">🎮</div>

                      <p className="text-red-300 font-black uppercase tracking-widest mb-3">
                        Ready to Play
                      </p>

                      <h2 className="text-3xl md:text-4xl font-black mb-4">
                        Start {game.name}
                      </h2>

                      <p className="text-white/70 mb-8">
                        For the best experience, start the game in fullscreen. You can exit
                        fullscreen anytime and continue playing on the page.
                      </p>

                      <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <button
                          type="button"
                          onClick={enterFullscreen}
                          className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-2xl font-black transition-colors"
                        >
                          Start Fullscreen
                        </button>

                        <button
                          type="button"
                          onClick={startWithoutFullscreen}
                          className="bg-white/10 hover:bg-white/15 text-white px-6 py-3 rounded-2xl font-black border border-white/10 transition-colors"
                        >
                          Play on Page
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <iframe
                    title={`${game.name} game`}
                    src={game.embedUrl}
                    className="absolute inset-0 w-full h-full border-0"
                    allow="fullscreen; autoplay; encrypted-media"
                    allowFullScreen
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
    </GamesLayout>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: ngpfGames.map((game) => ({
      params: {
        slug: game.slug,
      },
    })),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<GamePageProps> = async ({ params }) => {
  const game = getNgpfGameBySlug(String(params?.slug || ''));

  return {
    props: {
      game: game as NgpfGame,
    },
  };
};

export default GamePage;