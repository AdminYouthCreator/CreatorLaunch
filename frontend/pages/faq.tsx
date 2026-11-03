import React from 'react';
import Link from 'next/link';
import Layout from '@/components/common/Layout';

const CONTACT_EMAIL = 'qwentin@youthcreatorlaunch.org';

const questionHref = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
  'CreatorLaunch Student Business Program Question',
)}`;

const faqSections = [
  {
    title: 'About the Program',
    questions: [
      {
        question: 'What is the CreatorLaunch Student Business Program?',
        answer:
          'It is a free, 12-week program where students explore entrepreneurship, develop a business idea, and practice making real business decisions with coaching, equipment, and project support.',
      },
      {
        question: 'Who can participate?',
        answer:
          'The program is designed for students ages 14–18 who live in St. Louis County.',
      },
      {
        question: 'Does a student need a business idea or previous experience?',
        answer:
          'No. Students can join with an idea, a hobby they may want to grow, or no idea yet. Previous business experience is not required.',
      },
      {
        question: 'How much does the program cost?',
        answer:
          'There is no cost to students or families. Instruction, coaching, program materials, laptops used during sessions, and approved project purchases are provided at no cost.',
      },
    ],
  },
  {
    title: 'Schedule and Sessions',
    questions: [
      {
        question: 'How long is the program?',
        answer:
          'The program lasts 12 weeks. Students meet twice a week for two-hour sessions, for a total of 24 sessions.',
      },
      {
        question: 'How large is each group?',
        answer:
          'Each group is designed for eight students so there is time for coaching, questions, independent project work, and learning from one another.',
      },
      {
        question: 'When and where will sessions take place?',
        answer:
          'CreatorLaunch is currently developing upcoming program groups. Dates, locations, and enrollment details will be announced after arrangements are finalized.',
      },
      {
        question: 'Does a student need to bring a laptop?',
        answer:
          'No. Laptops are provided for use during program sessions, so students do not need to own a computer to participate.',
      },
    ],
  },
  {
    title: 'Project Purchases and Outcomes',
    questions: [
      {
        question: 'How does the “up to $500” support work?',
        answer:
          'Students can submit requests for business purchases and explain how each item supports their project. CreatorLaunch reviews the request and purchases approved items directly. This support is not a cash payment.',
      },
      {
        question: 'What kinds of purchases may be approved?',
        answer:
          'Depending on the business, approved purchases may include supplies, materials, a website domain, or other tools needed to develop and test the idea.',
      },
      {
        question: 'What will students leave with?',
        answer:
          'Students work toward a business plan, a project budget, experience making business decisions, a presentation of their work, and a clearer understanding of their next steps.',
      },
      {
        question: 'Does a student have to start a profitable business to succeed?',
        answer:
          'No. Starting a profitable business is not required. Progress, learning, thoughtful effort, and following through on responsibilities are what matter.',
      },
    ],
  },
  {
    title: 'Other Ways to Explore',
    questions: [
      {
        question: 'What is CreatorGames?',
        answer:
          'CreatorGames is a free learning arcade with financial and entrepreneurship games that help students practice money and business decisions in an interactive way.',
      },
      {
        question: 'How can a school or organization work with CreatorLaunch?',
        answer:
          'Schools, youth organizations, sponsors, and community supporters can visit the Partners page to explore ways to host a future group, support student projects, or share useful experience.',
      },
      {
        question: 'Is CreatorLaunch a nonprofit?',
        answer:
          'Yes. CreatorLaunch is a nationally recognized 501(c)(3) nonprofit organization. EIN: 39-2689174.',
      },
    ],
  },
];

const FAQPage = () => {
  return (
    <Layout
      title="Student Business Program FAQ | CreatorLaunch"
      description="Answers for students and families about eligibility, schedules, costs, laptops, approved project purchases, and upcoming CreatorLaunch program groups."
      announcementText="Upcoming program dates, locations, and enrollment details will be announced when arrangements are finalized."
    >
      <main className="min-h-screen bg-white">
        <section className="page-intro">
          <div className="container mx-auto px-4">
            <p className="eyebrow">Student and family FAQ</p>
            <h1>Answers about the Student Business Program.</h1>
            <p>
              Find clear answers about the Student Business Program, who can join, what
              is included, and what students will work toward.
            </p>
          </div>
        </section>

        <section className="editorial-section section-tint">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-5xl space-y-10">
              {faqSections.map((section) => (
                <div
                  key={section.title}
                  className="faq-section"
                >
                  <h2 className="mb-6 text-2xl font-bold text-dark md:text-3xl">
                    {section.title}
                  </h2>

                  <div className="space-y-4">
                    {section.questions.map((item) => (
                      <details
                        key={item.question}
                        className="faq-item group"
                      >
                        <summary className="flex cursor-pointer list-none items-start justify-between gap-4">
                          <span className="text-lg font-bold text-dark">{item.question}</span>
                          <span className="text-xl font-black text-primary transition-transform group-open:rotate-45">+</span>
                        </summary>
                        <p className="mt-4 leading-relaxed text-medium">{item.answer}</p>
                      </details>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="quiet-cta section-ink">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-4xl text-center">
              <p className="mb-3 font-bold uppercase tracking-widest text-cyan-300">
                Still have a question?
              </p>
              <h2 className="mb-4 text-3xl font-bold md:text-5xl">
                Students and families are welcome to ask.
              </h2>
              <p className="mb-8 text-lg text-white/75">
                Contact CreatorLaunch for program updates, eligibility questions, or help
                understanding how the program works.
              </p>
              <div className="flex flex-col justify-center gap-4 sm:flex-row">
                <a href={questionHref} className="site-button bg-primary text-white hover:bg-red-600">
                  Email CreatorLaunch
                </a>
                <Link href="/student-business-program" className="site-button border border-white/10 bg-white/10 text-white hover:bg-white/15">
                  Explore the Program
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
