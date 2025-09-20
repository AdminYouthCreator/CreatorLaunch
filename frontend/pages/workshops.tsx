import React from 'react';
import Layout from '@/components/common/Layout'
import Link from 'next/link';

// ################## ----- WORKSHOP INTERFACE ----- ##################
// Structure for workshop data and information
// Includes details about upcoming workshop programs
// ##########################################################
interface Workshop {
  title: string;
  description: string;
  link: string;
  linkText: string;
}

// ################## ----- WORKSHOPS PAGE COMPONENT ----- ##################
// Main workshops page showing upcoming programs and opportunities
// Displays workshop details and application information
// ####################################################################
const WorkshopsPage: React.FC = () => {
  // ################## ----- UPCOMING WORKSHOPS DATA ----- ##################
  // Configuration for currently available workshop programs
  // Updated as new workshops are scheduled and opened for applications
  // ####################################################################
  const upcomingWorkshops: Workshop[] = [
    {
      title: 'Winter 2025 Workshop',
      description: 'A transformative six-week program guiding young entrepreneurs through every step of building their own businesses. Participants receive seed funding, professional mentorship, and hands-on experience launching a real online store.',
      link: '/workshops/2025/Winter/',
      linkText: 'Learn More →'
    }
  ];

  // Placeholder data for workshop images gallery
  const placeholderImages = Array(6).fill('Image Coming Soon');

  return (
    <Layout
      title="Workshops | CreatorLaunch"
      description="Explore upcoming and past entrepreneurship workshops from CreatorLaunch. Find details on our free programs designed to help St. Louis teens build and launch a real business."
    >
      {/* Hero Section */}
      <section className="py-20 sm:py-28 bg-light text-center">
        <div className="container mx-auto px-6 max-w-4xl" data-aos="fade-up">
          <h1 className="text-5xl sm:text-6xl font-black text-primary">CreatorLaunch Workshops</h1>
          <p className="text-lg sm:text-xl font-light mt-4 text-medium">
            Your journey from idea to income starts here. Explore our programs designed to empower 
            the next generation of entrepreneurs.
          </p>
        </div>
      </section>

      {/* Upcoming Workshops */}
      <section className="py-20 sm:py-28 bg-white">
        <div className="container mx-auto px-6 max-w-5xl">
          <div data-aos="fade-up">
            <h2 className="text-4xl font-bold text-dark mb-6 text-center">Upcoming Workshops</h2>
            
            {upcomingWorkshops.map((workshop, index) => (
              <div key={index} className="content-card mb-8">
                <h3 className="text-2xl font-bold text-primary mb-2">{workshop.title}</h3>
                <p className="text-medium leading-relaxed">{workshop.description}</p>
                <Link
                  href={workshop.link}
                  className="text-accent font-bold hover:underline mt-4 inline-block"
                >
                  {workshop.linkText}
                </Link>
              </div>
            ))}
            
            <div className="text-center mt-12">
              <p className="text-medium text-lg">Check back soon for more exciting workshop announcements!</p>
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-20 sm:py-28 bg-light">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="text-center" data-aos="fade-up">
            <h2 className="text-4xl font-bold text-dark mb-6">Our Philosophy: Learning by Doing</h2>
            <p className="text-lg text-medium leading-relaxed max-w-3xl mx-auto">
              We believe entrepreneurship isn't taught in a textbook—it's learned through action. Our workshops 
              are built on a foundation of real-world application. We provide the safety net (funding and mentorship) 
              so our students can take creative risks, make mistakes, and learn the practical skills needed to run 
              a business in a live environment.
            </p>
          </div>
        </div>
      </section>

      {/* Past Workshops Gallery */}
      <section className="py-20 sm:py-28 bg-white">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="text-center" data-aos="fade-up">
            <h2 className="text-4xl font-bold text-dark mb-6">Past Workshops & Gallery</h2>
            <p className="text-medium text-lg">
              See what our previous cohorts have built! Photos and project highlights from our past workshops 
              will be featured here soon.
            </p>
            <div className="mt-8 grid grid-cols-2 md:grid-cols-3 gap-4">
              {placeholderImages.map((text, index) => (
                <div
                  key={index}
                  className="bg-gray-200 h-48 rounded-lg flex items-center justify-center text-gray-500"
                >
                  {text}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default WorkshopsPage;
