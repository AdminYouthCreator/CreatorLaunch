import React from 'react';
import Layout from '@/components/common/Layout';
import HeroSection from '@/sections/HeroSection';
import FeaturesSection from '@/sections/FeaturesSection';
import CTASection from '@/sections/CTASection';

// ################## ----- HOMEPAGE COMPONENT ----- ##################
// Main landing page for the CreatorLaunch website
// Combines hero, features, and CTA sections
// ##########################################################
const Homepage: React.FC = () => {
  // ################## ----- FEATURES DATA ----- ##################
  // Configuration for the features section
  // Defines what CreatorLaunch offers to participants
  // ##########################################################
  const features = [
    {
      icon: 'fa-solid fa-hand-holding-dollar',
      title: 'Seed Funding',
      description: 'Receive up to $500 to fund your business idea, from product samples to marketing.',
      delay: 100
    },
    {
      icon: 'fa-solid fa-handshake-angle',
      title: 'Pro Mentorship',
      description: 'Learn directly from local entrepreneurs, designers, and business leaders.',
      delay: 200
    },
    {
      icon: 'fa-solid fa-store',
      title: 'Launch a Real Store',
      description: 'Build and launch a real online store on an industry-leading platform like Shopify.',
      delay: 300
    },
    {
      icon: 'fa-solid fa-file-certificate',
      title: 'Real-World Skills',
      description: 'Leave with an operating business and a portfolio of work for college and career applications.',
      delay: 400
    }
  ];

  return (
    <Layout
      title="CreatorLaunch | Hands-On Workshops for Young Entrepreneurs"
      description="CreatorLaunch offers free, hands-on workshops in St. Louis for teens ready to launch their first venture. No experience needed."
    >
      <HeroSection
        title="Build a Real Business. It Starts Here."
        subtitle="CreatorLaunch offers free, hands-on workshops in St. Louis for teens ready to launch their first venture. No experience needed."
        ctaText="Explore Our Workshops"
        ctaLink="/workshops/"
      />
      
      <FeaturesSection
        title="What You Get"
        subtitle="Hands-on support and real resources to turn your idea into a business."
        features={features}
      />
      
      <CTASection
        title="Ready to Launch Your Legacy?"
        subtitle="Spots for our Winter Workshop are limited. Apply today to secure your place."
        ctaText="Apply Now"
        ctaLink="/workshops/2025/Winter/apply"
      />
    </Layout>
  );
};

export default Homepage;
