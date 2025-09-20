import React from 'react';
import Head from 'next/head';
import Header from './Header';
import {Footer} from './Footer';
import { useAOS } from '@/hooks/useAOS';

// ################## ----- LAYOUT PROPS INTERFACE ----- ##################
// Props interface for the main layout component
// Handles page metadata and announcement banner settings
// ####################################################################
interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  showAnnouncement?: boolean;
  announcementText?: string;
}

// ################## ----- LAYOUT COMPONENT ----- ##################
// Main layout wrapper for all pages
// Includes Head metadata, Header, Footer, and AOS initialization
// ################################################################
const Layout: React.FC<LayoutProps> = ({
  children,
  title = 'CreatorLaunch | Hands-On Workshops for Young Entrepreneurs',
  description = 'CreatorLaunch offers free, hands-on workshops in St. Louis for teens ready to launch their first venture. Learn real-world business skills with seed funding and mentorship.',
  showAnnouncement = true,
  announcementText = 'Welcome to our new website!'
}) => {
  // Initialize AOS (Animate On Scroll) library
  useAOS();
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" type="image/png" href="/assets/images/favicon.png" />
      </Head>

      <div className="text-dark">
        <Header 
          showAnnouncement={showAnnouncement}
          announcementText={announcementText}
        />
        
        <main>
          {children}
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default Layout;
