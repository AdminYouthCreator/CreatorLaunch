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
  'CreatorLaunch Inquiry'
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

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
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
    { name: 'Team', href: '/about/team' },
    { name: 'FAQ', href: '/faq' },
    { name: 'Blog', href: '/blog' },
    { name: 'Contact', href: '/contact' },
  ];

  const isActiveLink = (href: string) => {
    if (href === '/' && router.pathname === '/') return true;
    if (href !== '/' && router.pathname.startsWith(href)) return true;
    return false;
  };

  const isAboutActive = aboutNavigation.some((item) => isActiveLink(item.href));

  return (
    <>
      {isAnnouncementVisible && announcementText && (
        <div className="announcement-banner show">
          <p>{announcementText}</p>
          <button
            className="announcement-close-btn"
            onClick={() => setIsAnnouncementVisible(false)}
            aria-label="Close announcement"
          >
            &times;
          </button>
        </div>
      )}

      <header className="p-4 glass-nav shadow-sm sticky top-0 z-50">
        <nav className="container mx-auto flex items-center">
          <Link href="/" aria-label="CreatorLaunch home">
            <img
              src="/assets/header-logo.png"
              alt="CreatorLaunch Logo"
              className="h-12"
            />
          </Link>

          <div className="flex-1 flex justify-center">
            <div className="hidden lg:flex items-center gap-5 font-semibold">
              {mainNavigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`nav-link text-medium hover:text-primary transition-colors ${
                    isActiveLink(item.href) ? 'active' : ''
                  }`}
                >
                  {item.name}
                </Link>
              ))}

              <div className="relative" ref={aboutMenuRef}>
                <button
                  type="button"
                  onClick={() => setShowAboutMenu((prev) => !prev)}
                  className={`nav-link text-medium hover:text-primary transition-colors flex items-center gap-1 ${
                    isAboutActive ? 'active' : ''
                  }`}
                >
                  About
                  <svg
                    className={`w-4 h-4 transition-transform ${
                      showAboutMenu ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {showAboutMenu && (
                  <div className="absolute top-full left-0 mt-3 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50">
                    <div className="p-2">
                      {aboutNavigation.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setShowAboutMenu(false)}
                          className={`block px-4 py-3 rounded-xl text-sm font-bold transition-colors ${
                            isActiveLink(item.href)
                              ? 'bg-red-50 text-primary'
                              : 'text-gray-700 hover:bg-gray-50 hover:text-primary'
                          }`}
                        >
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-2 ml-4">
            <a
              href={contactHref}
              className="px-3 py-2 rounded-lg font-bold text-sm whitespace-nowrap transition-colors border border-gray-200 hover:border-primary hover:text-primary"
            >
              Contact
            </a>

            <Link
              href="/donate"
              className="px-3 py-2 rounded-lg font-bold text-sm whitespace-nowrap transition-colors"
              style={{
                display: 'flex',
                alignItems: 'center',
                height: '40px',
                backgroundColor: 'var(--color-primary)',
                color: 'white',
              }}
            >
              Donate
            </Link>

            {loading ? (
              <div className="flex items-center space-x-3">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600" />
              </div>
            ) : user ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {user.name
                      ? user.name.charAt(0).toUpperCase()
                      : user.email.charAt(0).toUpperCase()}
                  </div>

                  <span className="font-medium text-gray-700 hidden sm:block">
                    {user.name || user.email.split('@')[0]}
                  </span>

                  <svg
                    className="w-4 h-4 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                    <div className="px-4 py-3 border-b border-gray-200">
                      <p className="text-sm font-medium text-gray-700">
                        {user.name || 'User'}
                      </p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>

                    <div className="py-1">
                      <Link
                        href="/dashboard"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                        onClick={() => setShowUserMenu(false)}
                      >
                        Dashboard
                      </Link>

                      <Link
                        href="/products"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                        onClick={() => setShowUserMenu(false)}
                      >
                        Products
                      </Link>

                      <Link
                        href="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                        onClick={() => setShowUserMenu(false)}
                      >
                        Profile
                      </Link>

                      <Link
                        href="/onboarding"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                        onClick={() => setShowUserMenu(false)}
                      >
                        Onboarding
                      </Link>

                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  href="/auth/login"
                  className="px-3 py-2 rounded-lg font-bold text-sm transition-colors whitespace-nowrap"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    height: '40px',
                    border: '2px solid var(--color-accent)',
                    color: 'var(--color-accent)',
                    backgroundColor: 'white',
                  }}
                >
                  Login
                </Link>
              </div>
            )}
          </div>

          <div className="lg:hidden ml-auto">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-medium hover:text-primary transition-colors"
              aria-label="Toggle mobile menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </nav>

        {isMobileMenuOpen && (
          <div className="lg:hidden mt-4 pb-4 border-t border-gray-200">
            <div className="flex flex-col space-y-4 pt-4">
              {mainNavigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`nav-link text-medium hover:text-primary transition-colors ${
                    isActiveLink(item.href) ? 'active' : ''
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}

              <div className="border-t border-gray-100 pt-4">
                <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-3">
                  About
                </p>

                <div className="grid gap-2">
                  {aboutNavigation.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`px-4 py-3 rounded-xl text-sm font-bold transition-colors ${
                        isActiveLink(item.href)
                          ? 'bg-red-50 text-primary'
                          : 'bg-gray-50 text-gray-700 hover:text-primary'
                      }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="flex flex-col space-y-3 pt-4 border-t border-gray-100">
                <a
                  href={contactHref}
                  className="px-5 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 font-bold text-center transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Contact
                </a>

                <Link
                  href="/donate"
                  className="px-5 py-2 rounded-lg btn-primary-solid font-bold text-center"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Donate
                </Link>

                {loading ? (
                  <div className="flex justify-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600" />
                  </div>
                ) : user ? (
                  <div className="flex flex-col space-y-3">
                    <div className="px-5 py-3 bg-gray-50 rounded-lg">
                      <p className="font-medium text-gray-700">
                        {user.name || 'User'}
                      </p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>

                    <Link
                      href="/dashboard"
                      className="px-5 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 font-bold text-center transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Dashboard
                    </Link>

                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        handleLogout();
                      }}
                      className="px-5 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 font-bold text-center transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <Link
                    href="/auth/login"
                    className="px-5 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 font-bold text-center transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
};

export default Header;