import React from 'react';
import Link from 'next/link';
import {
  FiArrowUpRight,
  FiCheck,
  FiChevronRight,
  FiDollarSign,
  FiMonitor,
  FiUsers,
} from 'react-icons/fi';
import Layout from '@/components/common/Layout';

const CONTACT_EMAIL = 'qwentin@youthcreatorlaunch.org';

const updatesHref = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
  'CreatorLaunch Student Business Program Updates',
)}&body=${encodeURIComponent(
  'Hello CreatorLaunch,\n\nPlease keep me updated about upcoming CreatorLaunch Student Business Program groups.\n\nStudent name (optional):\nStudent age:\nCity or ZIP code:\nBest contact name:\nBest contact email or phone:\n\nQuestions:\n',
)}`;

const programMetrics = [
  { value: '12 weeks', label: 'A focused program with time to build' },
  { value: '24 sessions', label: 'Two two-hour sessions each week' },
  { value: '8 students', label: 'Small groups with room for support' },
  { value: 'Free', label: 'No program cost for students or families' },
];

const learningAreas = [
  {
    icon: '💡',
    title: 'Develop an idea',
    description: 'Explore your interests, identify a problem, and shape a product or service.',
  },
  {
    icon: '🗣️',
    title: 'Understand customers',
    description: 'Ask useful questions, listen to feedback, and improve what you plan to offer.',
  },
  {
    icon: '💵',
    title: 'Manage money',
    description: 'Build a budget, understand expenses and revenue, and make pricing decisions.',
  },
  {
    icon: '✦',
    title: 'Build a brand',
    description: 'Choose how your business should look, sound, and explain what it offers.',
  },
  {
    icon: '📣',
    title: 'Market your work',
    description: 'Practice reaching customers and communicating why your idea is useful.',
  },
  {
    icon: '🧭',
    title: 'Plan what comes next',
    description: 'Set realistic goals, organize tasks, and work through challenges as you build.',
  },
];

const gameTopics = [
  ['🚀', 'Entrepreneurship'],
  ['💸', 'Budgeting'],
  ['💳', 'Credit'],
  ['📈', 'Investing'],
  ['🛡️', 'Insurance'],
  ['🧭', 'Careers'],
];

const Homepage = () => {
  return (
    <Layout
      title="CreatorLaunch | A Free Student Business Program in St. Louis County"
      description="CreatorLaunch is a free, 12-week business program for students ages 14–18 in St. Louis County, with coaching, laptops, and up to $500 in approved project purchases."
      announcementText="Upcoming groups are being planned for the free CreatorLaunch Student Business Program."
    >
      <div className="min-h-screen bg-white">
        <section className="playful-hero">
          <div className="hero-orb hero-orb-one" />
          <div className="hero-orb hero-orb-two" />

          <div className="container relative mx-auto px-4 py-16 md:py-24 lg:py-28">
            <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.06fr_0.94fr] lg:gap-10">
              <div className="relative z-10">
                <div className="hero-kicker mb-7">
                  <span className="hero-kicker-dot" />
                  Free for St. Louis County students ages 14–18
                </div>

                <h1 className="display-heading text-dark">
                  Build an idea. Learn the business.{' '}
                  <span className="marker-word">Take your next step.</span>
                </h1>

                <p className="mt-7 max-w-2xl text-base font-medium leading-8 text-medium md:text-lg">
                  The CreatorLaunch Student Business Program gives young people 12 weeks
                  of coaching, hands-on project time, equipment, and practical support to
                  explore entrepreneurship and develop a business idea.
                </p>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Link href="/student-business-program" className="site-button site-button-primary">
                    Explore the program <FiArrowUpRight aria-hidden="true" />
                  </Link>
                  <a href={updatesHref} className="site-button site-button-secondary">
                    Get program updates
                  </a>
                </div>

                <div className="hero-trust-grid mt-9">
                  <div className="trust-chip">
                    <strong>No experience needed</strong>
                    <span>Bring an idea, a hobby, or just your curiosity</span>
                  </div>
                  <div className="trust-chip">
                    <strong>Laptops provided</strong>
                    <span>Students do not need to own a computer</span>
                  </div>
                  <div className="trust-chip">
                    <strong>Project support</strong>
                    <span>Up to $500 in approved business purchases</span>
                  </div>
                </div>
              </div>

              <div className="hero-visual">
                <div className="hero-note">
                  You do not need the perfect idea before you begin.
                  <small>Start with curiosity</small>
                </div>

                <span className="hero-spark" aria-hidden="true">✦</span>

                <div className="hero-photo-panel">
                  <img
                    src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1400&q=85"
                    alt="Students collaborating around a table"
                    className="hero-photo"
                  />
                </div>

                <div className="program-fact-card">
                  <span className="program-fact-icon" aria-hidden="true">12</span>
                  <div>
                    <p>weeks to build</p>
                    <small>Learn, test, improve, and present</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white py-20 md:py-28">
          <div className="container mx-auto px-4">
            <div className="mx-auto mb-12 max-w-3xl text-center">
              <span className="section-kicker">Program at a glance</span>
              <h2 className="mt-6 text-4xl font-bold leading-tight text-dark md:text-6xl">
                Small group. Real work. Practical support.
              </h2>
              <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-medium md:text-lg">
                Students meet twice a week and move from exploring an idea to making
                decisions, testing their approach, and preparing to share what they built.
              </p>
            </div>

            <div className="mx-auto grid max-w-6xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {programMetrics.map((metric) => (
                <article key={metric.value} className="program-metric">
                  <strong>{metric.value}</strong>
                  <p>{metric.label}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#fffdf9] py-20 md:py-28">
          <div className="container mx-auto px-4">
            <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.78fr_1.22fr]">
              <div className="lg:sticky lg:top-32 lg:self-start">
                <span className="section-kicker">What students learn</span>
                <h2 className="mt-6 text-4xl font-bold leading-tight text-dark md:text-6xl">
                  Learn it by building it.
                </h2>
                <p className="mt-5 max-w-xl text-base font-medium leading-8 text-medium md:text-lg">
                  Each session combines clear instruction with time to work on your own
                  project. Coaches help turn big goals into manageable next steps.
                </p>
                <Link href="/student-business-program#what-youll-learn" className="site-button site-button-secondary mt-8">
                  See the full program <FiArrowUpRight aria-hidden="true" />
                </Link>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                {learningAreas.map((area) => (
                  <article key={area.title} className="learning-card">
                    <span aria-hidden="true">{area.icon}</span>
                    <h3>{area.title}</h3>
                    <p>{area.description}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white px-4 py-20 md:py-28">
          <div className="program-stage mx-auto max-w-7xl px-6 py-12 md:px-12 md:py-16 lg:px-16">
            <div className="relative z-10 grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
              <div>
                <span className="inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-2 text-[11px] font-extrabold uppercase tracking-[0.18em] text-cyan-200">
                  Support included
                </span>
                <h2 className="mt-6 text-4xl font-bold leading-tight text-white md:text-6xl">
                  You bring the effort. We help with the tools.
                </h2>
                <p className="mt-5 max-w-xl text-base font-medium leading-8 text-white/75 md:text-lg">
                  Instruction, coaching, laptops, program materials, and approved project
                  purchases are provided at no cost. Students can focus on learning and building.
                </p>
              </div>

              <div className="grid gap-4">
                {[
                  [FiDollarSign, 'Up to $500 in approved purchases', 'CreatorLaunch buys approved supplies, materials, domains, or tools directly. This is not a cash payment.'],
                  [FiMonitor, 'Laptops during every session', 'Students do not need to own a computer to participate.'],
                  [FiUsers, 'Coaches and a group of eight', 'Ask questions, work through decisions, and learn alongside other students.'],
                ].map(([Icon, title, description]) => {
                  const CardIcon = Icon as typeof FiCheck;
                  return (
                    <article key={title as string} className="program-support-card">
                      <CardIcon aria-hidden="true" />
                      <div>
                        <h3>{title as string}</h3>
                        <p>{description as string}</p>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-light py-20 md:py-28">
          <div className="container mx-auto px-4">
            <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]">
              <div>
                <span className="section-kicker">For students and families</span>
                <h2 className="mt-6 text-4xl font-bold leading-tight text-dark md:text-6xl">
                  Progress matters more than perfection.
                </h2>
                <p className="mt-5 text-base font-medium leading-8 text-medium md:text-lg">
                  The program is for students with a business idea, a hobby they may want
                  to grow, or no idea yet. Starting a profitable business is not required
                  for success. Learning, thoughtful effort, and following through matter.
                </p>
                <div className="mt-7 grid gap-3">
                  {[
                    'Open to ages 14–18 who live in St. Louis County',
                    'No previous business experience required',
                    'Ends with a showcase of each student’s work and learning',
                    'Students leave with a plan, budget, decision-making experience, and next steps',
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

              <div className="rounded-[36px] border border-white bg-white p-4 shadow-2xl shadow-slate-900/10 md:p-6">
                <img
                  src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1400&q=85"
                  alt="Young people working together with laptops"
                  className="h-[420px] w-full rounded-[28px] object-cover md:h-[520px]"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white px-4 py-20 md:py-28">
          <div className="games-stage mx-auto max-w-7xl px-6 py-12 md:px-12 md:py-16 lg:px-16">
            <div className="relative z-10 grid items-center gap-12 lg:grid-cols-[1fr_0.95fr]">
              <div>
                <span className="inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-2 text-[11px] font-extrabold uppercase tracking-[0.18em] text-cyan-200">
                  CreatorGames
                </span>
                <h2 className="mt-6 max-w-2xl text-4xl font-bold leading-tight md:text-6xl">
                  Practice money decisions through play.
                </h2>
                <p className="mt-5 max-w-xl text-base font-medium leading-8 text-white/70 md:text-lg">
                  Explore free games that make entrepreneurship, careers, and financial
                  choices easier to understand.
                </p>
                <Link href="/games" className="site-button mt-8 bg-primary text-white hover:bg-red-600">
                  Explore CreatorGames <FiArrowUpRight aria-hidden="true" />
                </Link>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {gameTopics.map(([icon, topic]) => (
                  <div key={topic} className="game-chip">
                    <div>
                      <span className="text-2xl" aria-hidden="true">{icon}</span>
                      <p className="mt-2 text-sm font-extrabold">{topic}</p>
                    </div>
                    <FiChevronRight className="text-white/40" aria-hidden="true" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white px-4 pb-20 md:pb-28">
          <div className="final-cta mx-auto max-w-7xl px-6 py-14 text-center text-white md:px-12 md:py-20">
            <div className="relative z-10 mx-auto max-w-3xl">
              <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-white/75">
                Upcoming groups
              </p>
              <h2 className="mt-4 text-4xl font-bold leading-tight md:text-6xl">
                Want to know when enrollment opens?
              </h2>
              <p className="mx-auto mt-5 max-w-2xl text-base font-medium leading-8 text-white/85 md:text-lg">
                Session dates, locations, and enrollment details will be announced as
                arrangements are finalized. Students and families can contact us now to
                ask questions or request updates.
              </p>

              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <a href={updatesHref} className="site-button bg-white text-primary hover:bg-amber-50">
                  Get program updates <FiArrowUpRight aria-hidden="true" />
                </a>
                <Link href="/student-business-program" className="site-button border border-white/20 bg-white/10 text-white hover:bg-white/15">
                  Read program details
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Homepage;
