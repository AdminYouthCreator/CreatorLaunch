import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAuthContext } from '../../context/AuthContext';

interface HeaderProps {
  showAnnouncement?: boolean;
  announcementText?: string;
}

const CONTACT_EMAIL = 'qwentin@youthcreatorlaunch.org';
const contactHref = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
  'CreatorLaunch Inquiry',
)}`;

const Header: React.FC<HeaderProps> = ({
  showAnnouncement = true,
  announcementText = 'Bring CreatorLaunch workshops to your school, summer program, or community organization.',
}) => {
  const [isAnnouncementVisible, setIsAnnouncementVisible] = useState(showAnnouncement);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showAboutMenu, setShowAboutMenu] = useState(false);

  const router = useRouter();
  const { user, logout, loading } = useAuthContext();
  const userMenuRef = useRef<HTMLDivElement>(null);
  const aboutMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsAnnouncementVisible(showAnnouncement);
  }, [showAnnouncement, announcementText]);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setShowAboutMenu(false);
    setShowUserMenu(false);
  }, [router.asPath]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }

      if (aboutMenuRef.current && !aboutMenuRef.current.contains(event.target as Node)) {
        setShowAboutMenu(false);
      }
    };

    if (showUserMenu || showAboutMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showUserMenu, showAboutMenu]);

  const handleLogout = async () => {
    try {
      setShowUserMenu(false);
      await logout();
      router.push('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const mainNavigation = [
    { name: 'Home', href: '/' },
    { name: 'Bring CreatorLaunch', href: '/bring-creatorlaunch' },
    { name: 'Games', href: '/games' },
    { name: 'Partners', href: '/partners' },
    { name: 'Support', href: '/support' },
  ];

  const aboutNavigation = [
    { name: 'About CreatorLaunch', href: '/about' },
    { name: 'Team & Board', href: '/about/team' },
    { name: 'FAQ', href: '/faq' },
    { name: 'Blog', href: '/blog' },
    { name: 'Contact', href: '/contact' },
  ];

  const isActiveLink = (href: string) => {
    if (href === '/' && router.pathname === '/') return true;
    return href !== '/' && router.pathname.startsWith(href);
  };

  const isAboutActive = aboutNavigation.some((item) => isActiveLink(item.href));
  const initials = user ? (user.name || user.email).charAt(0).toUpperCase() : '';

  return (
    <>
      {isAnnouncementVisible && announcementText && (
        <div className="site-announcement">
          <div className="site-announcement-inner">
            <span className="site-announcement-badge">Let&apos;s launch</span>
            <p>{announcementText}</p>
            <Link href="/bring-creatorlaunch" className="site-announcement-link">
              Start here →
            </Link>
          </div>

          <button
            type="button"
            className="site-announcement-close"
            onClick={() => setIsAnnouncementVisible(false)}
            aria-label="Close announcement"
          >
            ×
          </button>
        </div>
      )}

      <header className="site-header">
        <nav className="site-nav" aria-label="Main navigation">
          <Link href="/" aria-label="CreatorLaunch home">
            <img
              src="/assets/header-logo.png"
              alt="CreatorLaunch Logo"
              className="site-logo"
            />
          </Link>

          <div className="site-nav-links">
            {mainNavigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`site-nav-link ${isActiveLink(item.href) ? 'active' : ''}`}
              >
                {item.name}
              </Link>
            ))}

            <div className="relative" ref={aboutMenuRef}>
              <button
                type="button"
                onClick={() => setShowAboutMenu((current) => !current)}
                className={`site-nav-link ${isAboutActive ? 'active' : ''}`}
                aria-expanded={showAboutMenu}
              >
                About
                <svg
                  className={`h-4 w-4 transition-transform ${showAboutMenu ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.3} d="m6 9 6 6 6-6" />
                </svg>
              </button>

              {showAboutMenu && (
                <div className="site-menu">
                  {aboutNavigation.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`site-menu-link ${isActiveLink(item.href) ? 'active' : ''}`}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="site-nav-actions">
            <a href={contactHref} className="site-nav-action site-nav-contact">
              Contact
            </a>

            <Link href="/donate" className="site-nav-action site-nav-donate">
              Donate
            </Link>

            {loading ? (
              <div className="mx-3 h-5 w-5 animate-spin rounded-full border-2 border-cyan-100 border-t-accent" />
            ) : user ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  type="button"
                  onClick={() => setShowUserMenu((current) => !current)}
                  className="site-user-button"
                  aria-expanded={showUserMenu}
                >
                  <span className="site-user-avatar">{initials}</span>
                  <span className="max-w-[100px] truncate text-xs font-bold">
                    {user.name || user.email.split('@')[0]}
                  </span>
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m6 9 6 6 6-6" />
                  </svg>
                </button>

                {showUserMenu && (
                  <div className="site-menu right-0 left-auto">
                    <div className="border-b border-slate-100 px-3 py-3">
                      <p className="text-sm font-bold text-dark">{user.name || 'Creator'}</p>
                      <p className="mt-1 truncate text-xs text-medium">{user.email}</p>
                    </div>

                    <div className="pt-1">
                      <Link href="/dashboard" className="site-menu-link">Dashboard</Link>
                      <Link href="/products" className="site-menu-link">Products</Link>
                      <Link href="/profile" className="site-menu-link">Profile</Link>
                      <Link href="/onboarding" className="site-menu-link">Onboarding</Link>
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="site-menu-link w-full text-left text-red-600"
                      >
                        Log out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/auth/login" className="site-nav-action site-nav-login">
                Login
              </Link>
            )}
          </div>

          <button
            type="button"
            onClick={() => setIsMobileMenuOpen((current) => !current)}
            className="site-mobile-toggle lg:hidden"
            aria-label="Toggle mobile menu"
            aria-expanded={isMobileMenuOpen}
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.3} d="M6 18 18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.3} d="M4 7h16M4 12h16M4 17h16" />
              )}
            </svg>
          </button>
        </nav>

        {isMobileMenuOpen && (
          <div className="site-mobile-menu lg:hidden">
            <div className="grid gap-1">
              {mainNavigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`site-nav-link ${isActiveLink(item.href) ? 'active' : ''}`}
                >
                  {item.name}<span aria-hidden="true">→</span>
                </Link>
              ))}
            </div>

            <div className="my-3 h-px bg-slate-100" />
            <p className="px-3 pb-2 text-[10px] font-extrabold uppercase tracking-[0.18em] text-slate-400">
              About
            </p>

            <div className="grid grid-cols-2 gap-1">
              {aboutNavigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`site-menu-link ${isActiveLink(item.href) ? 'active' : ''}`}
                >
                  {item.name}
                </Link>
              ))}
            </div>

            <div className="my-3 h-px bg-slate-100" />
            <div className="grid grid-cols-2 gap-2">
              <a href={contactHref} className="site-button site-button-secondary min-h-[46px] px-4 py-2">
                Contact
              </a>
              <Link href="/donate" className="site-button site-button-primary min-h-[46px] px-4 py-2">
                Donate
              </Link>
            </div>

            {user ? (
              <div className="mt-2 grid gap-2 rounded-2xl bg-slate-50 p-3">
                <p className="text-sm font-bold text-dark">{user.name || user.email}</p>
                <Link href="/dashboard" className="site-menu-link bg-white">Dashboard</Link>
                <button type="button" onClick={handleLogout} className="site-menu-link bg-white text-left text-red-600">
                  Log out
                </button>
              </div>
            ) : (
              <Link href="/auth/login" className="site-menu-link mt-2 bg-cyan-50 text-center text-cyan-800">
                Creator login
              </Link>
            )}
          </div>
        )}
      </header>
    </>
  );
};

export default Header;
