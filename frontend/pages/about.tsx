import React from 'react';
import Layout from '@/components/common/Layout';

// ################## ----- ABOUT PAGE COMPONENT ----- ##################
// Main about page showcasing CreatorLaunch's mission and vision
// Details the organization's purpose and impact for young entrepreneurs
// ####################################################################
const AboutPage: React.FC = () => {
  return (
    <Layout
      title="About Us | CreatorLaunch"
      description="Learn about CreatorLaunch, a youth-led nonprofit dedicated to empowering the next generation of entrepreneurs through immersive, in-person workshops in St. Louis."
    >
      {/* Hero Section */}
      <section className="py-20 sm:py-28">
        <div className="container mx-auto px-6 text-center max-w-4xl" data-aos="fade-up">
          <h1 className="text-5xl sm:text-6xl font-black text-dark">
            We're Building the Next Generation of Founders.
          </h1>
          <p className="text-lg text-medium mt-6 max-w-3xl mx-auto leading-relaxed">
            CreatorLaunch is a youth-led nonprofit dedicated to dismantling barriers for young entrepreneurs. 
            We provide free, hands-on workshops that guide St. Louis teens through the entire process of 
            building and launching their own businesses.
          </p>
        </div>
      </section>

      {/* Mission and Vision */}
      <section className="py-20 sm:py-28 bg-white">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-primary/10 p-8 rounded-2xl" data-aos="fade-up" data-aos-delay="100">
              <h3 className="text-2xl font-bold text-primary mb-3">Our Mission (The "Now")</h3>
              <p className="text-medium leading-relaxed">
                To empower young creators with the skills, funding, and mentorship to launch their own 
                ventures through immersive, risk-free educational workshops.
              </p>
            </div>
            <div className="bg-accent/10 p-8 rounded-2xl" data-aos="fade-up" data-aos-delay="200">
              <h3 className="text-2xl font-bold text-accent mb-3">Our Vision (The "Future")</h3>
              <p className="text-medium leading-relaxed">
                Our workshops are just the beginning. Our long-term vision is to develop the CreatorLaunch 
                digital platform, taking the lessons from our hands-on programs to build a scalable, 
                accessible resource for young entrepreneurs everywhere.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Learning Model */}
      <section className="py-20 sm:py-28">
        <div className="container mx-auto px-6 max-w-5xl text-center" data-aos="fade-up">
          <h2 className="text-4xl sm:text-5xl font-bold">Our Model: Learning by Doing</h2>
          <p className="text-lg text-medium mt-4 max-w-2xl mx-auto">
            We believe the best way to learn entrepreneurship is to live it. Our workshop model 
            replaces theory with action, guiding students through a real-world launch.
          </p>
        </div>
      </section>
    </Layout>
  );
};

export default AboutPage;
