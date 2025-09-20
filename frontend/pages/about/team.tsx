import React from 'react';
import Layout from '@/components/common/Layout';

// ################## ----- TEAM PAGE COMPONENT ----- ##################
// Page showcasing the CreatorLaunch team members
// Displays team bios, photos, and role information
// ############################################################
const TeamPage: React.FC = () => {
  return (
    <Layout
      title="Our Team | CreatorLaunch"
      description="Meet the team behind CreatorLaunch."
    >
      <section className="py-20 sm:py-28">
        <div className="container mx-auto px-6 text-center max-w-4xl" data-aos="fade-up">
          <h1 className="text-5xl sm:text-6xl font-black text-dark">
            Our Team
          </h1>
          <p className="text-lg text-medium mt-6 max-w-3xl mx-auto leading-relaxed">
            Meet the passionate individuals behind CreatorLaunch.
          </p>
        </div>
      </section>
    </Layout>
  );
};

export default TeamPage;
