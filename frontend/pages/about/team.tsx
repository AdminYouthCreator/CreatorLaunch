import React from 'react';
import Link from 'next/link';
import Layout from '@/components/common/Layout';
import { teamMembers } from '@/data/teamMembers';

const TeamPage = () => {
  return (
    <Layout
      title="Team | CreatorLaunch"
      description="Meet the youth-led CreatorLaunch team building programs and practical support for young entrepreneurs."
    >
      <main>
        <section className="page-intro">
          <div className="container mx-auto px-4">
            <p className="eyebrow">Team</p>
            <h1>The people working on CreatorLaunch.</h1>
            <p>CreatorLaunch is youth-led and supported by people who care about practical access to entrepreneurship education.</p>
          </div>
        </section>

        <section className="editorial-section">
          <div className="container mx-auto px-4">
            <div className="team-grid">
              {teamMembers.map((member) => (
                <Link key={member.slug} href={`/about/team/${member.slug}`}>
                  <img src={member.image} alt={member.name} />
                  <div><h2>{member.name}</h2><p>{member.role}</p><span>View bio →</span></div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="editorial-section section-tint">
          <div className="container mx-auto px-4">
            <div className="content-split align-start">
              <div className="section-heading"><p className="eyebrow">Leadership and governance</p><h2>Board of Directors</h2></div>
              <div className="body-copy callout-rule">
                <h3>CreatorLaunch is forming its inaugural board.</h3>
                <p>The board will help guide the organization, strengthen oversight, and support the mission as the program grows.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
};

export default TeamPage;
