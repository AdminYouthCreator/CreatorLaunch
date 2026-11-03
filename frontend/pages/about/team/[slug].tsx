import React from 'react';
import { GetStaticPaths, GetStaticProps } from 'next';
import Link from 'next/link';
import Layout from '@/components/common/Layout';
import { creatorLaunchPeople, CreatorLaunchPerson } from '@/data/teamMembers';

interface TeamBioPageProps {
  member: CreatorLaunchPerson;
}

const TeamBioPage: React.FC<TeamBioPageProps> = ({ member }) => {
  const emailHref = member.email
    ? `mailto:${member.email}?subject=${encodeURIComponent(`CreatorLaunch message for ${member.name}`)}`
    : `mailto:qwentin@youthcreatorlaunch.org?subject=${encodeURIComponent('Question about the CreatorLaunch Board')}`;

  return (
    <Layout
      title={`${member.name} | CreatorLaunch ${member.group === 'board' ? 'Board' : 'Team'}`}
      description={member.shortDescription}
    >
      <main>
        <section className="team-bio">
          <div className="container mx-auto px-4">
            <Link href="/about/team" className="text-link">← Team &amp; Board</Link>
            <div className="team-bio-layout">
              <div className="team-bio-photo">
                <img src={member.image} alt={member.name} />
              </div>
              <div className="team-bio-copy">
                <p className="eyebrow">{member.role}</p>
                <h1>{member.name}</h1>
                {member.organizationTitle && <p className="team-bio-title">{member.organizationTitle}</p>}
                <p className="team-bio-description">{member.extendedDescription}</p>
                <div className="button-row">
                  <a href={emailHref} className="site-button site-button-primary">
                    {member.email ? `Email ${member.name.split(' ')[0]}` : 'Contact CreatorLaunch'}
                  </a>
                  <Link href="/about" className="site-button site-button-secondary">About CreatorLaunch</Link>
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
    paths: creatorLaunchPeople.map((member) => ({
      params: {
        slug: member.slug,
      },
    })),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const member = creatorLaunchPeople.find((item) => item.slug === params?.slug);

  if (!member) {
    return { notFound: true };
  }

  return {
    props: {
      member,
    },
  };
};

export default TeamBioPage;
