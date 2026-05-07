import React from 'react';
import Link from 'next/link';
import Layout from '@/components/common/Layout';

const teamMembers = [
  {
    name: 'Qwentin Blassingame',
    role: 'Founder & Executive Director',
    bio: 'Driven by a passion for youth empowerment, entrepreneurship, and technology, Qwentin founded CreatorLaunch to give young people the tools, confidence, and launch support to bring their creative and business ideas to life.',
    initials: 'QB',
  },
  {
    name: 'Aereon Robinson',
    role: 'Co-Founder & Executive Manager',
    bio: "With a background in operations and strategic growth, Aereon helps CreatorLaunch run smoothly and ensures programs create meaningful impact for every participant. He is also the founder and operator of Future of Music, another nonprofit organization.",
    initials: 'AR',
  },
  {
    name: 'Rose Blassingame',
    role: 'Financial Manager',
    bio: 'With a strong background in financial strategy and managing finances for her own business, Rose supports the long-term sustainability and responsible growth of CreatorLaunch, helping maximize impact for young entrepreneurs.',
    initials: 'RB',
  },
];

const TeamPage = () => {
  return (
    <Layout title="Team | CreatorLaunch">
      <main className="min-h-screen bg-white">
        {/* Hero */}
        <section className="bg-gradient-to-br from-white via-red-50 to-orange-50 py-20">
          <div className="container mx-auto px-4 text-center">
            <p className="text-primary font-semibold mb-3">
              Youth-led from the beginning.
            </p>
            <h1 className="text-4xl md:text-6xl font-bold text-dark mb-6">
              The Innovators
            </h1>
            <p className="text-lg md:text-xl text-medium max-w-3xl mx-auto">
              Meet the team dismantling barriers and building a future where young people
              can launch real businesses before they graduate.
            </p>
          </div>
        </section>

        {/* Team Cards */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {teamMembers.map((member) => (
                <div
                  key={member.name}
                  className="bg-light rounded-2xl p-6 border border-gray-100 shadow-sm"
                >
                  <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center text-white text-2xl font-bold mb-5">
                    {member.initials}
                  </div>

                  <h2 className="text-xl font-bold text-dark mb-1">{member.name}</h2>
                  <p className="text-primary font-semibold mb-4">{member.role}</p>
                  <p className="text-medium">{member.bio}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Youth-Led Section */}
        <section className="py-20 bg-dark text-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Founded by youth. Run by youth. Built for youth.
              </h2>
              <p className="text-lg text-gray-200">
                CreatorLaunch is not just a program for young people. It is a movement led by
                young people who understand the barriers, ideas, energy, and urgency of the
                next generation of founders.
              </p>
            </div>
          </div>
        </section>

        {/* Join CTA */}
        <section className="py-20 bg-light">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-3xl mx-auto bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <h2 className="text-3xl font-bold text-dark mb-4">
                Want to Join the Team?
              </h2>
              <p className="text-lg text-medium mb-8">
                We are looking for ambitious youth, advisors, partners, and community members
                who want to help scale the CreatorLaunch movement.
              </p>

              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link
                  href="/contact"
                  className="bg-primary text-white px-8 py-4 rounded-lg font-semibold hover:bg-red-600 transition-colors"
                >
                  Apply to Join
                </Link>
                <Link
                  href="/about"
                  className="bg-white text-dark border border-gray-200 px-8 py-4 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                >
                  Read Our Story
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
};

export default TeamPage;
