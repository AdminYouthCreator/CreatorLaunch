import React from 'react';
import Link from 'next/link';
import Layout from '@/components/common/Layout';
import { teamMembers } from '@/data/teamMembers';

const TeamPage = () => {
  return (
    <Layout
      title="Team | CreatorLaunch"
      description="Meet the youth-led CreatorLaunch team building entrepreneurship workshops, partnerships, and digital tools for young founders."
    >
      <main className="min-h-screen bg-white">
        <section className="page-hero py-16 md:py-24">
          <div className="container mx-auto px-4 text-center">
            <p className="section-kicker mb-5">
              The Team
            </p>

            <h1 className="page-title mx-auto text-dark mb-6">
              The people building CreatorLaunch.
            </h1>

            <p className="text-lg md:text-xl text-medium max-w-3xl mx-auto">
              CreatorLaunch is youth-led, community-focused, and built by people who believe
              young founders deserve real opportunities to learn, create, and launch.
            </p>
          </div>
        </section>

        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {teamMembers.map((member) => (
                <Link
                  key={member.slug}
                  href={`/about/team/${member.slug}`}
                  className="group block"
                >
                  <div className="story-frame relative min-h-[420px] border-0">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-[420px] object-cover transition-transform duration-500 group-hover:scale-105"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                      <h2 className="text-2xl font-bold mb-1">{member.name}</h2>
                      <p className="text-red-200 font-semibold">{member.role}</p>
                    </div>

                    <div className="absolute inset-0 bg-primary/95 text-white p-6 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <p className="text-sm uppercase tracking-widest font-bold text-white/80 mb-2">
                        {member.role}
                      </p>

                      <h3 className="text-2xl font-bold mb-4">{member.name}</h3>

                      <p className="text-white/90 mb-6">
                        {member.shortDescription}
                      </p>

                      <span className="inline-flex items-center font-bold">
                        View Bio →
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-slate-50">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-10">
                <p className="section-kicker mb-5">
                  Leadership &amp; Governance
                </p>

                <h2 className="text-3xl md:text-5xl font-bold text-dark mb-4">
                  Board of Directors
                </h2>
              </div>

              <div className="soft-card relative overflow-hidden px-6 py-14 text-center md:px-12">
                <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-primary/10 blur-2xl" />
                <div className="absolute -bottom-20 -left-16 h-52 w-52 rounded-full bg-blue-500/10 blur-2xl" />

                <div className="relative mx-auto max-w-2xl">
                  <span className="inline-flex rounded-full border border-primary/20 bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-primary shadow-sm">
                    Coming Soon
                  </span>

                  <h3 className="mt-6 text-2xl md:text-3xl font-bold text-dark">
                    We are forming our inaugural board.
                  </h3>

                  <p className="mt-4 text-base md:text-lg leading-relaxed text-medium">
                    CreatorLaunch is currently building its first Board of Directors. Our board
                    will help guide the organization, strengthen community partnerships, and
                    support our mission as we grow.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 band-dark">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Founded by youth. Built with community.
              </h2>

              <p className="text-lg text-gray-200">
                CreatorLaunch is not just a program for young people. It is a youth-led
                nonprofit built around the idea that young people should have access to the
                tools, spaces, and support they need to create now.
              </p>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
};

export default TeamPage;
