import React from 'react';
import Head from 'next/head';
import Header from './Header';
import {Footer} from './Footer';

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
  title = 'CreatorLaunch | Student Business Program',
  description = 'CreatorLaunch helps St. Louis County students ages 14–18 explore entrepreneurship through a free, 12-week business program with coaching, laptops, and project support.',
  showAnnouncement = true,
  announcementText = 'Upcoming groups are being planned for the free CreatorLaunch Student Business Program.'
}) => {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wdth,wght@12..96,75..100,400..800&family=DM+Sans:opsz,wght@9..40,400..800&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" type="image/png" href="/assets/images/favicon.png" />
      </Head>

      <div className="public-shell text-dark">
        <Header 
          showAnnouncement={showAnnouncement}
          announcementText={announcementText}
        />
        
        <main className="site-main">
          {children}
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default Layout;
