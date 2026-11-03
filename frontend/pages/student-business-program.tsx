import React from 'react';
import Link from 'next/link';
import {
  FiArrowUpRight,
  FiCheck,
  FiClock,
  FiDollarSign,
  FiMapPin,
  FiMonitor,
  FiUsers,
} from 'react-icons/fi';
import Layout from '@/components/common/Layout';

const CONTACT_EMAIL = 'qwentin@youthcreatorlaunch.org';

const updatesHref = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
  'CreatorLaunch Student Business Program Inquiry',
)}&body=${encodeURIComponent(
  'Hello CreatorLaunch,\n\nI would like to learn more about the CreatorLaunch Student Business Program.\n\nI am a: Student / Parent or guardian / School representative / Other\nStudent age (if applicable):\nCity or ZIP code:\nBest way to contact me:\n\nQuestions:\n',
)}`;

const learningAreas = [
  {
    title: 'Develop a business idea',
    description:
      'Explore your interests and strengths, identify a problem you could solve, and decide what product or service you want to offer.',
  },
  {
    title: 'Understand your customers',
    description:
      'Think about who would use your product or service, ask useful questions, and use feedback to improve your idea.',
  },
  {
    title: 'Manage money',
    description:
      'Build a budget, understand expenses and revenue, set prices, and keep track of purchases.',
  },
  {
    title: 'Build your brand',
    description:
      'Choose how to present your business and create materials that clearly explain what you offer.',
  },
  {
    title: 'Market your work',
    description:
      'Practice reaching potential customers and communicating the value of your product or service.',
  },
  {
    title: 'Plan your next steps',
    description:
      'Set realistic goals, organize tasks, and work through challenges as your project develops.',
  },
];

const programFacts = [
  { icon: FiClock, title: '12 weeks', detail: '24 two-hour sessions, meeting twice each week' },
  { icon: FiUsers, title: 'Groups of eight', detail: 'A small cohort with coaching and peer support' },
  { icon: FiMapPin, title: 'St. Louis County', detail: 'For students ages 14–18 who live in the county' },
  { icon: FiDollarSign, title: 'Free to participate', detail: 'Instruction, materials, and approved support are included' },
];

const StudentBusinessProgramPage = () => {
  return (
    <Layout
      title="CreatorLaunch Student Business Program | Free 12-Week Program"
      description="A free, 12-week entrepreneurship program for St. Louis County students ages 14–18, with coaching, laptops, and up to $500 in approved business purchases."
      announcementText="Program groups are being developed now. Contact us to receive enrollment updates."
    >
      <main className="min-h-screen bg-white">
        <section className="program-page-hero">
          <div className="container relative mx-auto px-4 py-16 md:py-24">
            <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.08fr_0.92fr]">
              <div>
                <span className="hero-kicker">
                  <span className="hero-kicker-dot" />
                  Free · Ages 14–18 · St. Louis County
                </span>

                <h1 className="mt-7 max-w-4xl text-5xl font-bold leading-[0.98] text-dark md:text-7xl">
                  CreatorLaunch Student Business Program
                </h1>

                <p className="mt-7 max-w-2xl text-lg font-medium leading-8 text-medium md:text-xl">
                  Explore entrepreneurship, develop a business idea, and put what you
                  learn into practice—with guidance, equipment, and support along the way.
                </p>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <a href={updatesHref} className="site-button site-button-primary">
                    Get enrollment updates <FiArrowUpRight aria-hidden="true" />
                  </a>
                  <a href="#program-details" className="site-button site-button-secondary">
                    See program details
                  </a>
                </div>
              </div>

              <div className="program-overview-panel">
                <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-cyan-700">
                  Who can join?
                </p>
                <h2 className="mt-3 text-3xl font-bold text-dark">Curiosity is enough to start.</h2>
                <p className="mt-4 leading-7 text-medium">
                  You can join with a business idea, a hobby you want to explore, or no
                  idea yet. No previous entrepreneurship experience is required.
                </p>

                <div className="mt-7 grid gap-3">
                  {[
                    'Students ages 14–18',
                    'Must live in St. Louis County',
                    'Ready to meet twice a week for 12 weeks',
                    'Willing to ask questions, try ideas, and follow through',
                  ].map((item) => (
                    <p key={item} className="flex items-start gap-3 font-semibold text-dark">
                      <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-cyan-100 text-cyan-800">
                        <FiCheck aria-hidden="true" />
                      </span>
                      {item}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="program-details" className="bg-white py-20 md:py-28">
          <div className="container mx-auto px-4">
            <div className="mx-auto grid max-w-6xl gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {programFacts.map(({ icon: Icon, title, detail }) => (
                <article key={title} className="program-detail-card">
                  <Icon aria-hidden="true" />
                  <h2>{title}</h2>
                  <p>{detail}</p>
                </article>
              ))}
            </div>

            <div className="mx-auto mt-16 max-w-4xl text-center">
              <span className="section-kicker">How the program works</span>
              <h2 className="mt-6 text-4xl font-bold leading-tight text-dark md:text-6xl">
                Instruction and project time in every session.
              </h2>
              <div className="mt-7 space-y-5 text-left text-base font-medium leading-8 text-medium md:text-lg">
                <p>
                  Students participate in a small group of eight, meeting twice a week for
                  two-hour sessions. Across 24 sessions, you will work with coaches and other
                  young people to develop your idea, make decisions, test your approach, and
                  prepare to share your work.
                </p>
                <p>
                  Coaches help you think through decisions, answer questions, and turn larger
                  goals into manageable steps. You will also exchange ideas with other students,
                  practice presenting your work, and learn from one another.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="what-youll-learn" className="bg-light py-20 md:py-28">
          <div className="container mx-auto px-4">
            <div className="mx-auto mb-12 max-w-3xl text-center">
              <span className="section-kicker">What you&apos;ll learn</span>
              <h2 className="mt-6 text-4xl font-bold leading-tight text-dark md:text-6xl">
                Business skills you can practice right away.
              </h2>
            </div>

            <div className="mx-auto grid max-w-6xl gap-5 md:grid-cols-2 lg:grid-cols-3">
              {learningAreas.map((area, index) => (
                <article key={area.title} className="learning-card">
                  <span className="learning-number" aria-hidden="true">{index + 1}</span>
                  <h3>{area.title}</h3>
                  <p>{area.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white py-20 md:py-28">
          <div className="container mx-auto px-4">
            <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">
              <div className="rounded-[36px] bg-dark p-8 text-white shadow-2xl shadow-slate-900/15 md:p-12">
                <FiDollarSign className="text-4xl text-sun" aria-hidden="true" />
                <p className="mt-5 text-xs font-extrabold uppercase tracking-[0.18em] text-cyan-300">
                  Project purchases
                </p>
                <h2 className="mt-3 text-4xl font-bold md:text-5xl">
                  Up to $500 in approved business purchases.
                </h2>
                <div className="mt-6 space-y-4 font-medium leading-7 text-white/75">
                  <p>
                    Depending on the business, approved purchases may include supplies,
                    materials, a website domain, or other tools needed to develop and test an idea.
                  </p>
                  <p>
                    Students submit purchase requests, explain how each item supports their
                    project, and work with staff to make spending decisions. CreatorLaunch
                    purchases approved items directly; this support is not a cash payment.
                  </p>
                </div>
              </div>

              <div>
                <span className="section-kicker">Equipment and support</span>
                <h2 className="mt-6 text-4xl font-bold leading-tight text-dark md:text-6xl">
                  A computer should not be the barrier.
                </h2>
                <p className="mt-5 text-base font-medium leading-8 text-medium md:text-lg">
                  Laptops are provided for use during program sessions, so students do not
                  need to own a computer. Instruction, coaching, program materials, and
                  approved project purchases are provided at no cost.
                </p>
                <div className="mt-7 rounded-3xl border border-cyan-100 bg-cyan-50 p-6">
                  <FiMonitor className="text-3xl text-cyan-700" aria-hidden="true" />
                  <h3 className="mt-3 text-2xl font-bold text-dark">Laptops provided</h3>
                  <p className="mt-2 font-medium leading-7 text-medium">
                    Students can complete digital work during program sessions without
                    bringing their own device.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#fffdf9] py-20 md:py-28">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-5xl">
              <div className="text-center">
                <span className="section-kicker">More than a business idea</span>
                <h2 className="mt-6 text-4xl font-bold leading-tight text-dark md:text-6xl">
                  Skills for school, work, and everyday life.
                </h2>
                <p className="mx-auto mt-5 max-w-3xl text-base font-medium leading-8 text-medium md:text-lg">
                  Students practice communicating clearly, managing time, solving problems,
                  handling feedback, and following through on responsibilities. The program
                  is a place to ask questions, try something unfamiliar, and make changes
                  when an idea does not work as expected.
                </p>
              </div>

              <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                {['Communication', 'Time management', 'Problem solving', 'Using feedback', 'Follow-through'].map((skill) => (
                  <div key={skill} className="rounded-2xl border border-slate-100 bg-white p-5 text-center font-bold text-dark shadow-sm">
                    {skill}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white py-20 md:py-28">
          <div className="container mx-auto px-4">
            <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]">
              <div>
                <span className="section-kicker">The final showcase</span>
                <h2 className="mt-6 text-4xl font-bold leading-tight text-dark md:text-6xl">
                  Share what you created and what you learned.
                </h2>
                <p className="mt-5 text-base font-medium leading-8 text-medium md:text-lg">
                  The program ends with a showcase where students present their business
                  ideas. You will work toward leaving with a business plan, a project budget,
                  experience making business decisions, and a clearer understanding of what
                  you want to do next.
                </p>
                <p className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-5 font-bold leading-7 text-dark">
                  Starting a profitable business is not a requirement for success. Progress,
                  learning, and thoughtful effort matter.
                </p>
              </div>

              <div className="rounded-[36px] border border-slate-100 bg-light p-8 md:p-12">
                <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-primary">
                  What students work toward
                </p>
                <div className="mt-6 grid gap-4">
                  {[
                    'A clearer business idea',
                    'A simple business plan',
                    'A project budget',
                    'Experience making and explaining decisions',
                    'A presentation of their work',
                    'Realistic next steps after the program',
                  ].map((item) => (
                    <p key={item} className="flex items-center gap-3 rounded-2xl bg-white p-4 font-semibold text-dark shadow-sm">
                      <FiCheck className="shrink-0 text-cyan-700" aria-hidden="true" />
                      {item}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white px-4 pb-20 md:pb-28">
          <div className="final-cta mx-auto max-w-7xl px-6 py-14 text-center text-white md:px-12 md:py-20">
            <div className="relative z-10 mx-auto max-w-3xl">
              <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-white/75">
                Dates and locations coming soon
              </p>
              <h2 className="mt-4 text-4xl font-bold leading-tight md:text-6xl">
                Be the first to hear about upcoming groups.
              </h2>
              <p className="mx-auto mt-5 max-w-2xl text-base font-medium leading-8 text-white/85 md:text-lg">
                CreatorLaunch is developing upcoming program groups. Students, families,
                and schools can contact us now for updates or to ask a question.
              </p>
              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <a href={updatesHref} className="site-button bg-white text-primary hover:bg-amber-50">
                  Contact CreatorLaunch <FiArrowUpRight aria-hidden="true" />
                </a>
                <Link href="/faq" className="site-button border border-white/20 bg-white/10 text-white hover:bg-white/15">
                  Read our FAQ
                </Link>
              </div>
              <p className="mt-6 text-sm font-semibold text-white/75">
                {CONTACT_EMAIL}
              </p>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
};

export default StudentBusinessProgramPage;
