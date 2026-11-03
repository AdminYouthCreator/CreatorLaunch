import React from 'react';
import Link from 'next/link';
import Layout from '@/components/common/Layout';
import { boardMembers, teamMembers } from '@/data/teamMembers';

const TeamPage = () => {
  return (
    <Layout
      title="Team & Board | CreatorLaunch"
      description="Meet the CreatorLaunch team and Board of Directors supporting young entrepreneurs and their families."
    >
      <main>
        <section className="page-intro">
          <div className="container mx-auto px-4">
            <p className="eyebrow">Team &amp; Board</p>
            <h1>The people behind CreatorLaunch.</h1>
            <p>CreatorLaunch is youth-led and supported by people who care about practical entrepreneurship education for students.</p>
          </div>
        </section>

        <section className="editorial-section">
          <div className="container mx-auto px-4">
            <div className="team-section-heading">
              <p className="eyebrow">Staff</p>
              <h2>Building the program.</h2>
            </div>
            <div className="team-grid">
              {teamMembers.map((member) => (
                <Link key={member.slug} href={`/about/team/${member.slug}`}>
                  <img src={member.image} alt={member.name} />
                  <div><h3>{member.name}</h3><p>{member.role}</p><span>View bio →</span></div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="editorial-section section-tint">
          <div className="container mx-auto px-4">
            <div className="split-heading">
              <div className="section-heading"><p className="eyebrow">Leadership and governance</p><h2>Board of Directors</h2></div>
              <p>Board members provide oversight, strategic guidance, and support as CreatorLaunch builds programs for students and families.</p>
            </div>
            <div className="team-grid team-grid-board">
              {boardMembers.map((member) => (
                <Link key={member.slug} href={`/about/team/${member.slug}`}>
                  <img src={member.image} alt={member.name} />
                  <div>
                    <h3>{member.name}</h3>
                    <p>{member.role}</p>
                    {member.organizationTitle && <p className="team-organization-title">{member.organizationTitle}</p>}
                    <span>View bio →</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
};

export default TeamPage;
