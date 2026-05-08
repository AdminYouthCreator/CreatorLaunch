import React from 'react';
import Link from 'next/link';

const PublicFooter: React.FC = () => {
  return (
    <footer className="bg-dark text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <img src="/assets/header-logo.png" alt="CreatorLaunch" className="h-10 w-auto" />
              <span className="text-2xl font-bold">CreatorLaunch</span>
            </div>

            <p className="text-gray-300 max-w-md">
              A St. Louis nonprofit dedicated to youth entrepreneurship. Founded and run by youth.
            </p>
          </div>

          <div>
            <h3 className="font-bold mb-4">Explore</h3>
            <div className="space-y-2">
              <Link href="/about" className="block text-gray-300 hover:text-white">About</Link>
              <Link href="/about/team" className="block text-gray-300 hover:text-white">Team</Link>
              <Link href="/partners" className="block text-gray-300 hover:text-white">Partners</Link>
              <Link href="/blog" className="block text-gray-300 hover:text-white">Blog</Link>
            </div>
          </div>

          <div>
            <h3 className="font-bold mb-4">Get Involved</h3>
            <div className="space-y-2">
              <Link href="/contact" className="block text-gray-300 hover:text-white">Contact</Link>
              <Link href="/donate" className="block text-gray-300 hover:text-white">Donate</Link>
              <Link href="/auth/register" className="block text-gray-300 hover:text-white">Join Waitlist</Link>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-10 pt-6 text-gray-400 text-sm">
          © 2025 CreatorLaunch, NPO.
        </div>
      </div>
    </footer>
  );
};

export default PublicFooter;
