import React from 'react';
import Link from 'next/link';
import Layout from '@/components/common/Layout';

const CONTACT_EMAIL = 'qwentin@youthcreatorlaunch.org';

const bringHref = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
  'CreatorLaunch Question'
)}`;

const faqSections = [
  {
    title: 'General Questions',
    questions: [
      {
        question: 'What is CreatorLaunch?',
        answer:
          'CreatorLaunch is a youth-led 501(c)(3) nonprofit that helps young people learn entrepreneurship through workshops, community partnerships, creator tools, and practical learning experiences.',
      },
      {
        question: 'Who does CreatorLaunch serve?',
        answer:
          'CreatorLaunch serves young people who want to learn entrepreneurship, explore business ideas, build confidence, and practice real-world skills. We work through schools, summer programs, afterschool programs, nonprofits, and community organizations.',
      },
      {
        question: 'Is CreatorLaunch only a digital platform?',
        answer:
          'No. The digital platform is part of the long-term vision, but CreatorLaunch is currently focused on community workshops, partnerships, donor support, and youth entrepreneurship programming. The platform supports the mission, but it is not the only part of CreatorLaunch.',
      },
    ],
  },
  {
    title: 'Workshops and Programs',
    questions: [
      {
        question: 'Can CreatorLaunch come to our school, program, or organization?',
        answer:
          'Yes. CreatorLaunch works with schools, summer programs, afterschool programs, nonprofits, libraries, community centers, churches, and youth-serving organizations that want to bring entrepreneurship workshops to their community.',
      },
      {
        question: 'Do students or families have to pay?',
        answer:
          'CreatorLaunch is designed so students and families do not have to pay to participate in community workshops hosted through partner organizations.',
      },
      {
        question: 'What do students learn in a CreatorLaunch workshop?',
        answer:
          'Students can learn entrepreneurship basics, idea development, branding, product and service planning, pricing, customers, budgeting, pitching, and launch planning. Workshops are hands-on and built around helping students create something real.',
      },
      {
        question: 'What ages are CreatorLaunch workshops for?',
        answer:
          'CreatorLaunch is mainly designed for youth and students. The exact age range can depend on the partner organization, workshop format, and student group.',
      },
    ],
  },
  {
    title: 'Partners and Donors',
    questions: [
      {
        question: 'How can an organization partner with CreatorLaunch?',
        answer:
          'Organizations can partner with CreatorLaunch by requesting workshops, sponsoring youth programming, helping host community sessions, connecting students to opportunities, or supporting supplies and launch resources.',
      },
      {
        question: 'How do donations help?',
        answer:
          'Donations help support workshop materials, student creator tools, program supplies, platform development, youth launch support, and the overall mission of making entrepreneurship education more accessible.',
      },
      {
        question: 'Is CreatorLaunch a nonprofit?',
        answer:
          'Yes. CreatorLaunch is a nationally recognized 501(c)(3) nonprofit organization. EIN: 39-2689174.',
      },
    ],
  },
  {
    title: 'CreatorGames',
    questions: [
      {
        question: 'What is CreatorGames?',
        answer:
          'CreatorGames is a learning arcade on the CreatorLaunch website with curated financial and entrepreneurship games. It helps students practice money and business decisions in a more interactive way.',
      },
      {
        question: 'Did CreatorLaunch create every game in CreatorGames?',
        answer:
          'No. Some games are embedded or linked from educational partners and outside creators. Each game page includes a disclaimer and credit when a game comes from another organization.',
      },
      {
        question: 'Can CreatorGames be used during workshops?',
        answer:
          'Yes. CreatorGames can be used as a workshop activity, classroom extension, or independent learning tool for students who want to keep exploring business and financial topics.',
      },
    ],
  },
];

const FAQPage = () => {
  return (
    <Layout
      title="FAQ | CreatorLaunch"
      description="Frequently asked questions about CreatorLaunch workshops, partnerships, donations, CreatorGames, and youth entrepreneurship programming."
    >
      <main className="min-h-screen bg-white">
        <section className="bg-gradient-to-br from-white via-red-50 to-blue-50 py-20">
          <div className="container mx-auto px-4 text-center">
            <p className="text-primary font-bold uppercase tracking-widest mb-3">
              Frequently Asked Questions
            </p>

            <h1 className="text-4xl md:text-6xl font-bold text-dark mb-6">
              Questions about CreatorLaunch?
            </h1>

            <p className="text-lg md:text-xl text-medium max-w-3xl mx-auto">
              Learn more about our workshops, community partnerships, donations,
              CreatorGames, and the CreatorLaunch mission.
            </p>
          </div>
        </section>

        <section className="py-20 bg-light">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto space-y-10">
              {faqSections.map((section) => (
                <div
                  key={section.title}
                  className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 md:p-8"
                >
                  <h2 className="text-2xl md:text-3xl font-bold text-dark mb-6">
                    {section.title}
                  </h2>

                  <div className="space-y-4">
                    {section.questions.map((item) => (
                      <details
                        key={item.question}
                        className="group rounded-2xl border border-gray-100 bg-light p-5"
                      >
                        <summary className="cursor-pointer list-none flex items-start justify-between gap-4">
                          <span className="font-bold text-dark text-lg">
                            {item.question}
                          </span>

                          <span className="text-primary font-black text-xl group-open:rotate-45 transition-transform">
                            +
                          </span>
                        </summary>

                        <p className="text-medium mt-4 leading-relaxed">
                          {item.answer}
                        </p>
                      </details>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-dark text-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <p className="text-red-300 font-bold uppercase tracking-widest mb-3">
                Still have a question?
              </p>

              <h2 className="text-3xl md:text-5xl font-bold mb-4">
                We would love to hear from you.
              </h2>

              <p className="text-white/75 text-lg mb-8">
                Whether you are a school, donor, sponsor, parent, student, or community
                organization, you can reach out directly.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href={bringHref}
                  className="bg-primary text-white px-8 py-4 rounded-lg font-semibold hover:bg-red-600 transition-colors text-center"
                >
                  Email CreatorLaunch
                </a>

                <Link
                  href="/bring-creatorlaunch"
                  className="bg-white/10 text-white border border-white/10 px-8 py-4 rounded-lg font-semibold hover:bg-white/15 transition-colors text-center"
                >
                  Bring CreatorLaunch
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
};

export default FAQPage;