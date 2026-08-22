import React from 'react';
import Link from 'next/link';
import { FiArrowUpRight, FiCheck, FiChevronRight, FiPlay, FiStar } from 'react-icons/fi';
import Layout from '@/components/common/Layout';
import MoxMascot from '@/components/common/MoxMascot';

const CONTACT_EMAIL = 'qwentin@youthcreatorlaunch.org';

const bringHref = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
  'Bring CreatorLaunch to our community',
)}&body=${encodeURIComponent(
  'Hello CreatorLaunch,\n\nWe are interested in bringing CreatorLaunch entrepreneurship workshops to our community.\n\nOrganization name:\nCommunity served:\nBest contact person:\nPreferred timeline:\n\nMessage:\n',
)}`;

const workshopCards = [
  {
    number: '01',
    icon: '✦',
    title: 'Spot the spark',
    description:
      'Students find problems worth solving, explore possible customers, and choose an idea they care about.',
  },
  {
    number: '02',
    icon: '✎',
    title: 'Shape the idea',
    description:
      'They create a name, brand, offer, price, and simple plan that turns a thought into something tangible.',
  },
  {
    number: '03',
    icon: '↗',
    title: 'Share the launch',
    description:
      'Students practice a real pitch, get encouraging feedback, and leave knowing their next move.',
  },
];

const audiences = [
  'Summer programs',
  'Afterschool programs',
  'Schools',
  'Community centers',
  'Youth nonprofits',
  'Libraries',
  'Churches',
  'Local organizations',
];

const gameTopics = [
  ['🚀', 'Entrepreneurship'],
  ['💸', 'Budgeting'],
  ['💳', 'Credit'],
  ['📈', 'Investing'],
  ['🛡️', 'Insurance'],
  ['🧭', 'Careers'],
];

const processSteps = [
  {
    title: 'Tell us about your community',
    description: 'Share your organization, group, age range, and the experience you want to create.',
  },
  {
    title: 'We shape the right workshop',
    description: 'We align the format, activities, timing, and goals around your students.',
  },
  {
    title: 'Young creators build',
    description: 'Students make decisions, create something real, and finish with a clear next step.',
  },
];

const Homepage = () => {
  return (
    <Layout
      title="CreatorLaunch | Youth Entrepreneurship Workshops & Community Partnerships"
      description="CreatorLaunch is a youth-led 501(c)(3) nonprofit helping schools, summer programs, afterschool programs, and community organizations bring no-cost entrepreneurship workshops to students and families."
      announcementText="Bring CreatorLaunch workshops to your school, summer program, afterschool program, or community organization."
    >
      <div className="min-h-screen bg-white">
        <section className="playful-hero">
          <div className="hero-orb hero-orb-one" />
          <div className="hero-orb hero-orb-two" />

          <div className="container relative mx-auto px-4 py-16 md:py-24 lg:py-28">
            <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.08fr_0.92fr] lg:gap-8">
              <div className="relative z-10">
                <div className="hero-kicker mb-7">
                  <span className="hero-kicker-dot" />
                  Youth-led entrepreneurship workshops
                </div>

                <h1 className="display-heading text-dark">
                  Big ideas belong in{' '}
                  <span className="marker-word">every community.</span>
                </h1>

                <p className="mt-7 max-w-2xl text-base font-medium leading-8 text-medium md:text-lg">
                  CreatorLaunch brings playful, hands-on entrepreneurship workshops to
                  schools and community organizations—at no cost to students or families.
                  Young people do more than listen. They imagine, build, and pitch.
                </p>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <a href={bringHref} className="site-button site-button-primary">
                    Request a workshop <FiArrowUpRight aria-hidden="true" />
                  </a>
                  <Link href="/bring-creatorlaunch" className="site-button site-button-secondary">
                    See how it works <FiPlay className="text-accent" aria-hidden="true" />
                  </Link>
                </div>

                <div className="hero-trust-grid mt-9">
                  <div className="trust-chip">
                    <strong>No-cost</strong>
                    <span>for students and families</span>
                  </div>
                  <div className="trust-chip">
                    <strong>Youth-led</strong>
                    <span>with real founder energy</span>
                  </div>
                  <div className="trust-chip">
                    <strong>Hands-on</strong>
                    <span>made for active learning</span>
                  </div>
                </div>
              </div>

              <div className="hero-visual">
                <div className="hero-note">
                  Ideas do not have to be perfect to be worth starting.
                  <small>A note from Mox</small>
                </div>

                <span className="hero-spark" aria-hidden="true">✦</span>

                <div className="hero-photo-panel">
                  <img
                    src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1400&q=85"
                    alt="Young people collaborating around a workshop table"
                    className="hero-photo"
                  />
                </div>

                <div className="hero-mox-card">
                  <p className="mb-1 text-center text-[10px] font-extrabold uppercase tracking-[0.16em] text-violet-600">
                    Your idea buddy
                  </p>
                  <MoxMascot className="mx-auto w-full" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white py-20 md:py-28">
          <div className="container mx-auto px-4">
            <div className="mx-auto mb-14 max-w-3xl text-center">
              <span className="section-kicker">What students actually do</span>
              <h2 className="mt-6 text-4xl font-bold leading-tight text-dark md:text-6xl">
                A workshop with momentum.
              </h2>
              <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-medium md:text-lg">
                No long lectures. No pretending there is only one right answer. Every
                activity moves a young creator from curiosity toward action.
              </p>
            </div>

            <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-3">
              {workshopCards.map((card) => (
                <article key={card.number} className="play-card">
                  <span className="play-card-number">{card.number}</span>
                  <span className="play-card-icon" aria-hidden="true">{card.icon}</span>
                  <h3 className="text-2xl font-bold text-dark">{card.title}</h3>
                  <p className="mt-3 text-sm font-medium leading-7 text-medium">
                    {card.description}
                  </p>
                </article>
              ))}
            </div>

            <div className="mx-auto mt-16 flex max-w-4xl flex-wrap items-center justify-center gap-x-8 gap-y-3 rounded-3xl border border-slate-100 bg-slate-50 px-6 py-5">
              {['Built for participation', 'Flexible formats', 'Practical next steps'].map((item) => (
                <span key={item} className="flex items-center gap-2 text-xs font-extrabold text-dark md:text-sm">
                  <span className="grid h-6 w-6 place-items-center rounded-full bg-cyan-100 text-cyan-800">
                    <FiCheck aria-hidden="true" />
                  </span>
                  {item}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white px-4 pb-20 md:pb-28">
          <div className="games-stage mx-auto max-w-7xl px-6 py-12 md:px-12 md:py-16 lg:px-16">
            <div className="relative z-10 grid items-center gap-12 lg:grid-cols-[1fr_0.95fr]">
              <div>
                <span className="inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-2 text-[11px] font-extrabold uppercase tracking-[0.18em] text-cyan-200">
                  CreatorGames
                </span>
                <h2 className="mt-6 max-w-2xl text-4xl font-bold leading-tight md:text-6xl">
                  Money skills meet game night.
                </h2>
                <p className="mt-5 max-w-xl text-base font-medium leading-8 text-white/70 md:text-lg">
                  Our learning arcade lets students practice business and financial
                  decisions through play—during workshops, in classrooms, or on their own.
                </p>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Link href="/games" className="site-button bg-primary text-white hover:bg-red-600">
                    Explore CreatorGames <FiArrowUpRight aria-hidden="true" />
                  </Link>
                  <Link href="/bring-creatorlaunch" className="site-button border border-white/15 bg-white/10 text-white hover:bg-white/15">
                    Add games to a workshop
                  </Link>
                </div>
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

                <Link
                  href="/games/influencd"
                  className="game-chip border-primary/40 bg-primary text-white sm:col-span-2"
                >
                  <span>
                    <span className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-white/70">
                      Featured game
                    </span>
                    <strong className="mt-1 block font-[var(--font-display)] text-xl">
                      Influenc&apos;d
                    </strong>
                  </span>
                  <FiArrowUpRight className="text-xl" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#fffdf9] px-4 py-20 md:py-28">
          <div className="mox-stage mx-auto max-w-7xl px-6 py-12 md:px-12 md:py-16">
            <div className="relative z-10 grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
              <div className="rounded-[32px] border border-white/70 bg-white/80 p-5 shadow-xl shadow-violet-900/5 backdrop-blur md:p-9">
                <MoxMascot showWordmark className="mx-auto max-w-[390px]" />
              </div>

              <div>
                <span className="section-kicker border-violet-200 text-violet-700">Meet Mox</span>
                <h2 className="mt-6 text-4xl font-bold leading-tight text-dark md:text-6xl">
                  The tiny spark behind every “what if?”
                </h2>
                <p className="mt-5 text-base font-medium leading-8 text-medium md:text-lg">
                  Mox is CreatorLaunch&apos;s interactive idea buddy. He shows up when a
                  young creator starts thinking, sketching, building, or getting brave
                  enough to share.
                </p>
                <p className="mt-4 text-sm font-semibold leading-7 text-violet-700">
                  Try clicking Mox—or press <kbd className="rounded-lg border border-violet-200 bg-white px-2 py-1 font-bold shadow-sm">M</kbd> anywhere on the site.
                </p>
                <Link href="/meet-mox" className="site-button mt-8 bg-dark text-white hover:bg-slate-800">
                  Meet Mox properly <FiStar className="text-sun" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white py-20 md:py-28">
          <div className="container mx-auto px-4">
            <div className="mx-auto grid max-w-7xl items-start gap-12 lg:grid-cols-[0.9fr_1.1fr]">
              <div className="lg:sticky lg:top-32">
                <span className="section-kicker">Built for communities</span>
                <h2 className="mt-6 text-4xl font-bold leading-tight text-dark md:text-6xl">
                  We meet young people where they already are.
                </h2>
                <p className="mt-5 max-w-xl text-base font-medium leading-8 text-medium md:text-lg">
                  CreatorLaunch works with the organizations young people already know
                  and trust. We shape the workshop around your schedule, setting, and group.
                </p>
                <a href={bringHref} className="site-button site-button-primary mt-8">
                  Bring us to your community <FiArrowUpRight aria-hidden="true" />
                </a>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {audiences.map((audience) => (
                  <div key={audience} className="audience-pill">{audience}</div>
                ))}

                <div className="mt-3 rounded-[28px] bg-dark p-7 text-white sm:col-span-2">
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-cyan-300">
                    A flexible partner
                  </p>
                  <h3 className="mt-3 text-2xl font-bold">
                    Your community already has the young creators. We bring the launch energy.
                  </h3>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-light py-20 md:py-28">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-7xl">
              <div className="mx-auto mb-12 max-w-3xl text-center">
                <span className="section-kicker">Simple from the start</span>
                <h2 className="mt-6 text-4xl font-bold leading-tight text-dark md:text-5xl">
                  From first hello to first pitch.
                </h2>
              </div>

              <div className="grid gap-5 md:grid-cols-3">
                {processSteps.map((step, index) => (
                  <article key={step.title} className="process-card">
                    <span className="number-bubble">{index + 1}</span>
                    <h3 className="text-xl font-bold text-dark">{step.title}</h3>
                    <p className="mt-3 text-sm font-medium leading-7 text-medium">
                      {step.description}
                    </p>
                  </article>
                ))}
              </div>

              <div className="platform-card mt-12 grid items-center gap-8 p-7 md:grid-cols-[1fr_auto] md:p-12">
                <div className="relative z-10">
                  <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-white/75">
                    The bigger vision
                  </p>
                  <h2 className="mt-3 text-3xl font-bold md:text-5xl">
                    Workshops first. A digital launchpad alongside them.
                  </h2>
                  <p className="mt-4 max-w-3xl text-sm font-medium leading-7 text-white/80 md:text-base">
                    CreatorLaunch is growing a digital platform where young creators can
                    develop products, services, stores, and launch plans. Right now, our
                    public focus is building thoughtful workshops and community partnerships.
                  </p>
                </div>

                <div className="relative z-10 flex flex-col gap-3">
                  <Link href="/progress" className="site-button bg-white text-primary hover:bg-amber-50">
                    Follow our progress
                  </Link>
                  <Link href="/donate" className="site-button border border-white/20 bg-white/10 text-white hover:bg-white/15">
                    Support the vision
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white px-4 py-20 md:py-28">
          <div className="final-cta mx-auto max-w-7xl px-6 py-14 text-center text-white md:px-12 md:py-20">
            <div className="relative z-10 mx-auto max-w-3xl">
              <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-white/75">
                Ready when you are
              </p>
              <h2 className="mt-4 text-4xl font-bold leading-tight md:text-6xl">
                Let&apos;s give young ideas somewhere to go.
              </h2>
              <p className="mx-auto mt-5 max-w-2xl text-base font-medium leading-8 text-white/85 md:text-lg">
                Tell us about your school, program, or organization. We&apos;ll start
                with your community and build the right experience together.
              </p>

              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <a href={bringHref} className="site-button bg-white text-primary hover:bg-amber-50">
                  Request CreatorLaunch <FiArrowUpRight aria-hidden="true" />
                </a>
                <Link href="/donate" className="site-button border border-white/20 bg-white/10 text-white hover:bg-white/15">
                  Donate to the mission
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
