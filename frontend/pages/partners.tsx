import React from 'react';
import Link from 'next/link';
import { FiArrowDown, FiArrowUpRight, FiBookOpen, FiHeart, FiMapPin } from 'react-icons/fi';
import Layout from '@/components/common/Layout';

const CONTACT_EMAIL = 'qwentin@youthcreatorlaunch.org';

const partners = [
  {
    name: 'Future of Music',
    type: 'Youth-Led Nonprofit Partner',
    website: 'https://fomusic.org',
    initials: 'FOM',
    description:
      'A youth-led organization expanding creative opportunities and helping young people access music, media, and community-centered programs.',
  },
  {
    name: 'City of Vinita Park',
    type: 'Community Supporter',
    website: 'https://www.vinitapark.org',
    initials: 'VP',
    description:
      'A local community supporter helping strengthen access to youth opportunities and community-centered programming.',
  },
];

const partnerHref = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
  'CreatorLaunch Partnership Inquiry',
)}&body=${encodeURIComponent(
  'Hello CreatorLaunch,\n\nWe are interested in exploring a partnership.\n\nOrganization name:\nContact person:\nType of partnership we are interested in:\n\nMessage:\n',
)}`;

const partnershipOptions = [
  {
    icon: FiMapPin,
    title: 'Help host a program group',
    description:
      'Schools and youth-serving organizations can explore providing a welcoming, accessible location for a future student group.',
  },
  {
    icon: FiHeart,
    title: 'Support student projects',
    description:
      'Sponsors and donors can help cover coaching, materials, laptops, and approved purchases students need to develop their ideas.',
  },
  {
    icon: FiBookOpen,
    title: 'Share useful experience',
    description:
      'Entrepreneurs and professionals can explore age-appropriate ways to help students understand real business decisions and career paths.',
  },
];

const PartnersPage = () => {
  return (
    <Layout
      title="Partners | CreatorLaunch"
      description="Explore ways schools, youth organizations, sponsors, and community supporters can help CreatorLaunch serve students and families."
      announcementText="Looking for the student program? Explore the free CreatorLaunch Student Business Program."
    >
      <main className="min-h-screen bg-white">
        <section className="program-page-hero py-20 md:py-28">
          <div className="container relative mx-auto px-4">
            <div className="mx-auto max-w-4xl text-center">
              <span className="hero-kicker">
                <span className="hero-kicker-dot" />
                Partners
              </span>
              <h1 className="mt-7 text-5xl font-bold leading-tight text-dark md:text-7xl">
                Help create a strong place for students to build.
              </h1>
              <p className="mx-auto mt-6 max-w-3xl text-lg font-medium leading-8 text-medium md:text-xl">
                CreatorLaunch is designed around students and families. Partnerships help
                us provide the space, equipment, guidance, and project support that make the
                Student Business Program possible.
              </p>
              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <a href="#partnership-options" className="site-button site-button-primary">
                  Explore partnerships <FiArrowDown aria-hidden="true" />
                </a>
                <Link href="/student-business-program" className="site-button site-button-secondary">
                  View the student program
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white py-20 md:py-28">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-6xl">
              <div className="mb-10 text-center">
                <span className="section-kicker">Current partners</span>
                <h2 className="mt-6 text-4xl font-bold text-dark md:text-5xl">
                  Organizations connected to our work.
                </h2>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                {partners.map((partner) => (
                  <a
                    key={partner.name}
                    href={partner.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group rounded-3xl border border-slate-100 bg-light p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                  >
                    <div className="flex items-start gap-5">
                      <span className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-dark text-sm font-black text-white">
                        {partner.initials}
                      </span>
                      <div>
                        <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-primary">
                          {partner.type}
                        </p>
                        <h3 className="mt-2 text-2xl font-bold text-dark">{partner.name}</h3>
                        <p className="mt-3 text-sm font-medium leading-7 text-medium">
                          {partner.description}
                        </p>
                        <span className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-cyan-700">
                          Visit website <FiArrowUpRight aria-hidden="true" />
                        </span>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="partnership-options" className="bg-light py-20 md:py-28">
          <div className="container mx-auto px-4">
            <div className="mx-auto mb-12 max-w-3xl text-center">
              <span className="section-kicker">Partnership options</span>
              <h2 className="mt-6 text-4xl font-bold leading-tight text-dark md:text-6xl">
                Support the parts students can&apos;t build alone.
              </h2>
              <p className="mx-auto mt-5 max-w-2xl text-base font-medium leading-8 text-medium md:text-lg">
                We are developing upcoming program groups and welcome conversations with
                organizations that can help remove practical barriers for students.
              </p>
            </div>

            <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-3">
              {partnershipOptions.map(({ icon: Icon, title, description }) => (
                <article key={title} className="learning-card">
                  <span aria-hidden="true"><Icon /></span>
                  <h3>{title}</h3>
                  <p>{description}</p>
                </article>
              ))}
            </div>

            <div className="mx-auto mt-12 max-w-4xl rounded-[32px] bg-dark p-8 text-center text-white md:p-12">
              <h2 className="text-3xl font-bold md:text-4xl">Have another partnership idea?</h2>
              <p className="mx-auto mt-4 max-w-2xl font-medium leading-7 text-white/75">
                Tell us what your organization does, who you serve, and how you would like
                to support students. We will respond with the most useful next step.
              </p>
              <a href={partnerHref} className="site-button mt-7 bg-white text-dark hover:bg-amber-50">
                Start a conversation <FiArrowUpRight aria-hidden="true" />
              </a>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
};

export default PartnersPage;
