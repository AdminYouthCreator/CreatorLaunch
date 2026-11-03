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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wdth,wght@12..96,75..100,400..800&family=DM+Sans:opsz,wght@9..40,400..800&display=swap"
          rel="stylesheet"
        />
      </Head>

      <div className="min-h-screen bg-slate-950 text-white">
        <header className="games-header">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between gap-4">
              <Link href="/games" className="flex items-center gap-3">
                <div className="games-mark" aria-hidden="true">
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
                    className={`games-nav-link ${isActive(item.href) ? 'active' : ''}`}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>

              <button
                type="button"
                onClick={() => setMobileOpen((prev) => !prev)}
                className="games-menu-button"
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
                    className={`games-nav-link ${isActive(item.href) ? 'active' : ''}`}
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
            <div className="border-l-2 border-white/20 pl-4 text-sm text-white/70">
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
