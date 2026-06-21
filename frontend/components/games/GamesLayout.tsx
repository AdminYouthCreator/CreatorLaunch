import React, { ReactNode, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ngpfDisclaimer } from '@/data/ngpfGames';

interface GamesLayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
}

const GamesLayout: React.FC<GamesLayoutProps> = ({
  children,
  title = 'CreatorGames | CreatorLaunch',
  description = 'Play entrepreneurship and financial learning games through CreatorGames by CreatorLaunch.',
}) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter();

  const navItems = [
    { label: 'Games Home', href: '/games' },
    { label: 'Entrepreneurship', href: '/games/influencd' },
    { label: 'Budgeting', href: '/games/money-magic' },
    { label: 'Credit', href: '/games/credit-clash' },
    { label: 'Back to CreatorLaunch', href: '/' },
  ];

  const isActive = (href: string) => {
    if (href === '/games') return router.pathname === '/games';
    return router.asPath.startsWith(href);
  };

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
      </Head>

      <div className="min-h-screen bg-slate-950 text-white">
        <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/90 backdrop-blur-xl">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between gap-4">
              <Link href="/games" className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-red-500 to-blue-600 flex items-center justify-center font-black text-xl shadow-lg">
                  G
                </div>

                <div>
                  <p className="text-xl font-black leading-tight">CreatorGames</p>
                  <p className="text-xs text-white/60">
                    Financial games curated by CreatorLaunch
                  </p>
                </div>
              </Link>

              <nav className="hidden md:flex items-center gap-2">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors ${
                      isActive(item.href)
                        ? 'bg-white text-slate-950'
                        : 'text-white/80 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>

              <button
                type="button"
                onClick={() => setMobileOpen((prev) => !prev)}
                className="md:hidden border border-white/15 rounded-xl px-3 py-2 text-sm font-bold"
                aria-label="Toggle games menu"
              >
                Menu
              </button>
            </div>

            {mobileOpen && (
              <nav className="md:hidden grid gap-2 mt-4 pt-4 border-t border-white/10">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`px-4 py-3 rounded-xl text-sm font-bold transition-colors ${
                      isActive(item.href)
                        ? 'bg-white text-slate-950'
                        : 'text-white/80 bg-white/5 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            )}
          </div>
        </header>

        {children}

        <section className="border-t border-white/10 bg-slate-900">
          <div className="container mx-auto px-4 py-6">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/70">
              <p className="font-semibold text-white mb-1">Game Disclaimer</p>
              <p>{ngpfDisclaimer}</p>
            </div>
          </div>
        </section>

        <footer className="border-t border-white/10 bg-slate-950">
          <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row gap-4 items-center justify-between">
            <p className="text-sm text-white/60">
              CreatorGames is part of CreatorLaunch’s youth entrepreneurship learning tools.
            </p>

            <div className="flex flex-wrap justify-center gap-4 text-sm font-semibold">
              <Link href="/" className="text-white/70 hover:text-white">
                Main Site
              </Link>
              <Link href="/bring-creatorlaunch" className="text-white/70 hover:text-white">
                Bring CreatorLaunch
              </Link>
              <Link href="/donate" className="text-white/70 hover:text-white">
                Donate
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default GamesLayout;