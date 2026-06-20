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
        <section className="bg-gradient-to-br from-white via-red-50 to-blue-50 py-20">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
              <div className="rounded-3xl overflow-hidden shadow-xl border border-white bg-white">
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

                <p className="text-primary font-bold uppercase tracking-widest mt-8 mb-3">
                  {member.role}
                </p>

                <h1 className="text-4xl md:text-6xl font-bold text-dark mb-6">
                  {member.name}
                </h1>

                <p className="text-lg text-medium mb-8">
                  {member.extendedDescription}
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                  <a
                    href={emailHref}
                    className="bg-primary text-white px-8 py-4 rounded-lg font-semibold hover:bg-red-600 transition-colors text-center"
                  >
                    Email {member.name.split(' ')[0]}
                  </a>

                  <Link
                    href="/about"
                    className="bg-white text-dark border border-gray-200 px-8 py-4 rounded-lg font-semibold hover:bg-gray-50 transition-colors text-center"
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