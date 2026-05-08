import React from 'react';
import Link from 'next/link';

const PublicHeader: React.FC = () => {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center gap-3">
            <img src="/assets/header-logo.png" alt="CreatorLaunch" className="h-10 w-auto" />
            <span className="text-2xl font-bold text-dark">CreatorLaunch</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-dark hover:text-primary font-medium">Home</Link>
            <Link href="/about" className="text-dark hover:text-primary font-medium">About</Link>
            <Link href="/about/team" className="text-dark hover:text-primary font-medium">Team</Link>
            <Link href="/partners" className="text-dark hover:text-primary font-medium">Partners</Link>
            <Link href="/blog" className="text-dark hover:text-primary font-medium">Blog</Link>
            <Link href="/contact" className="text-dark hover:text-primary font-medium">Contact</Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/auth/login" className="hidden sm:inline-block text-dark hover:text-primary font-medium">
              Login
            </Link>

            <Link href="/donate" className="bg-primary text-white px-5 py-2 rounded-lg font-bold hover:bg-red-600 transition-colors">
              Donate
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default PublicHeader;
