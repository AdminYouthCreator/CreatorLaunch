import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAuthContext } from '../../context/AuthContext';

// ################## ----- HEADER PROPS INTERFACE ----- ##################
// Props for the header component
// Controls announcement banner display and messaging
// ####################################################################
interface HeaderProps {
  showAnnouncement?: boolean;
  announcementText?: string;
}

// ################## ----- HEADER COMPONENT ----- ##################
// Main navigation header with announcement banner
// Handles mobile menu toggle and active link highlighting
// ##########################################################
const Header: React.FC<HeaderProps> = ({
  showAnnouncement = true,
  announcementText = 'CreatorLaunch is building the next generation of founders.',
}) => {
  const [isAnnouncementVisible, setIsAnnouncementVisible] = useState(showAnnouncement);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const router = useRouter();
  const { user, logout, loading } = useAuthContext();
  const userMenuRef = useRef<HTMLDivElement>(null);

  // ################## ----- SYNC ANNOUNCEMENT VISIBILITY ----- ##################
  // Keeps banner behavior correct if parent props change
  // ###########################################################################
  useEffect(() => {
    setIsAnnouncementVisible(showAnnouncement);
  }, [showAnnouncement, announcementText]);

  // ################## ----- CLOSE DROPDOWN ON OUTSIDE CLICK ----- ##################
  // Closes the user dropdown when clicking outside of it
  // ###########################################################################
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    if (showUserMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUserMenu]);

  // ################## ----- LOGOUT HANDLER ----- ##################
  // Logs out current user and returns them to public homepage
  // ################################################################
  const handleLogout = async () => {
    try {
      setShowUserMenu(false);
      await logout();
      router.push('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // ################## ----- NAVIGATION ITEMS ----- ##################
  // Main public navigation menu items
  // ################################################################
  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Team', href: '/about/team' },
    { name: 'Partners', href: '/partners' },
    { name: 'Blog', href: '/blog' },
    { name: 'Platform Progress', href: '/progress' },
    { name: 'Contact', href: '/contact' },
  ];

  // ################## ----- ACTIVE LINK CHECKER ----- ##################
  // Highlights the current page in the navbar
  // ###################################################################
  const isActiveLink = (href: string) => {
    if (href === '/' && router.pathname === '/') return true;
    if (href !== '/' && router.pathname.startsWith(href)) return true;
    return false;
  };

  return (
    <>
      {/* Announcement Banner */}
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

      {/* Main Header */}
      <header className="p-4 glass-nav shadow-sm sticky top-0 z-50">
        <nav className="container mx-auto flex items-center">
          {/* Logo */}
          <Link href="/" aria-label="CreatorLaunch home">
            <img
              src="/assets/header-logo.png"
              alt="CreatorLaunch Logo"
              className="h-12"
            />
          </Link>

          {/* Centered Navigation */}
          <div className="flex-1 flex justify-center">
            <div className="hidden md:flex items-center gap-6 font-semibold">
              {navigation.map((item) => (
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
            </div>
          </div>

          {/* Right-aligned Button Group */}
          <div className="hidden md:flex items-center gap-2 ml-4">
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

            {/* Authentication Section */}
            {loading ? (
              <div className="flex items-center space-x-3">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
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

                {/* User Dropdown Menu */}
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

                <Link
                  href="/auth/register"
                  className="px-3 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-bold text-sm transition-colors whitespace-nowrap"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    height: '40px',
                  }}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden ml-auto">
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

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-200">
            <div className="flex flex-col space-y-4 pt-4">
              {navigation.map((item) => (
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

              {/* Mobile Button Group */}
              <div className="flex flex-col space-y-3 pt-4 border-t border-gray-100">
                <Link
                  href="/donate"
                  className="px-5 py-2 rounded-lg btn-primary-solid font-bold text-center"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Donate
                </Link>

                {/* Mobile Authentication Section */}
                {loading ? (
                  <div className="flex justify-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
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

                    <Link
                      href="/products"
                      className="px-5 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 font-bold text-center transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Products
                    </Link>

                    <Link
                      href="/onboarding"
                      className="px-5 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 font-bold text-center transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Onboarding
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
                  <div className="flex flex-col space-y-3">
                    <Link
                      href="/auth/login"
                      className="px-5 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 font-bold text-center transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Login
                    </Link>

                    <Link
                      href="/auth/register"
                      className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-bold text-center transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Sign Up
                    </Link>
                  </div>
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
