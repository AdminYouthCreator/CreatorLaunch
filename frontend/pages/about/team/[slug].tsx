import React from 'react';
import { GetStaticPaths, GetStaticProps } from 'next';
import Link from 'next/link';
import Layout from '@/components/common/Layout';
import { teamMembers } from '@/data/teamMembers';

interface TeamBioPageProps {
  member: {
    slug: string;
    name: string;
    role: string;
    email: string;
    image: string;
    shortDescription: string;
    extendedDescription: string;
  };
}

const TeamBioPage: React.FC<TeamBioPageProps> = ({ member }) => {
  const emailHref = `mailto:${member.email}?subject=${encodeURIComponent(
    `CreatorLaunch message for ${member.name}`
  )}`;

  return (
    <Layout title={`${member.name} | CreatorLaunch Team`}>
      <main className="min-h-screen bg-white">
        <section className="page-hero py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
              <div className="story-frame">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-[520px] object-cover"
                />
              </div>

              <div>
                <Link
                  href="/about/team"
                  className="text-primary font-semibold hover:underline"
                >
                  ← Back to Team
                </Link>

                <p className="section-kicker mt-8 mb-5">
                  {member.role}
                </p>

                <h1 className="page-title text-dark mb-6">
                  {member.name}
                </h1>

                <p className="text-lg text-medium mb-8">
                  {member.extendedDescription}
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                  <a
                    href={emailHref}
                    className="site-button site-button-primary text-center"
                  >
                    Email {member.name.split(' ')[0]}
                  </a>

                  <Link
                    href="/about"
                    className="site-button site-button-secondary text-center"
                  >
                    About CreatorLaunch
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: teamMembers.map((member) => ({
      params: {
        slug: member.slug,
      },
    })),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const member = teamMembers.find((item) => item.slug === params?.slug);

  return {
    props: {
      member,
    },
  };
};

export default TeamBioPage;