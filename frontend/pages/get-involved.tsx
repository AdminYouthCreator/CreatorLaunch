import React from 'react';
import Layout from '@/components/common/Layout';

// ################## ----- GET INVOLVED PAGE COMPONENT ----- ##################
// Page for community involvement and volunteer opportunities
// Shows ways people can support and participate in CreatorLaunch
// ######################################################################
const GetInvolvedPage: React.FC = () => {
  return (
    <Layout
      title="Get Involved | CreatorLaunch"
      description="Learn how you can get involved with CreatorLaunch."
    >
      <section className="py-20 sm:py-28">
        <div className="container mx-auto px-6 text-center max-w-4xl" data-aos="fade-up">
          <h1 className="text-5xl sm:text-6xl font-black text-dark">
            Get Involved
          </h1>
          <p className="text-lg text-medium mt-6 max-w-3xl mx-auto leading-relaxed">
            Join us in empowering the next generation of entrepreneurs.
          </p>
        </div>
      </section>
    </Layout>
  );
};

export default GetInvolvedPage;
