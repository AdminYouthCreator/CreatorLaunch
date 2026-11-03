import React from 'react';
import Link from 'next/link';
import Layout from '@/components/common/Layout';

const CONTACT_EMAIL = 'qwentin@youthcreatorlaunch.org';
const programHref = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
  'CreatorLaunch Student Business Program Updates',
)}`;

const AboutPage = () => {
  return (
    <Layout
      title="About | CreatorLaunch"
      description="Learn about CreatorLaunch, a youth-led nonprofit helping students explore entrepreneurship, develop business ideas, and practice real-world skills."
    >
      <main>
        <section className="page-intro">
          <div className="container mx-auto px-4">
            <p className="eyebrow">About CreatorLaunch</p>
            <h1>Young people deserve a practical place to learn how business works.</h1>
            <p>
              CreatorLaunch is a youth-led nonprofit that helps students explore
              entrepreneurship, develop an idea, and practice making real business decisions.
            </p>
          </div>
        </section>

        <section className="editorial-section">
          <div className="container mx-auto px-4">
            <div className="content-split align-start">
              <div className="section-heading">
                <p className="eyebrow">Why we exist</p>
                <h2>Business education should include time to build.</h2>
              </div>
              <div className="body-copy">
                <p>
                  Students are often encouraged to be creative and ambitious without
                  being given the tools, guidance, or room to test an idea. CreatorLaunch
                  was created to help close that gap.
                </p>
                <p>
                  Our work combines instruction with project time. Students can ask
                  questions, make decisions, revise an idea, and explain what they learned.
                  Families get clear information about the process and what support is included.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="editorial-section section-tint">
          <div className="container mx-auto px-4">
            <div className="founder-layout">
              <img src="/assets/qwentin-pfp.png" alt="Qwentin Blassingame" />
              <div className="section-heading">
                <p className="eyebrow">Founder</p>
                <h2>Qwentin Blassingame</h2>
                <div className="body-copy">
                  <p>
                    Qwentin founded CreatorLaunch after seeing how difficult it can be for
                    students to find serious, practical entrepreneurship support. Young
                    people may have strong ideas and the motivation to work, but still lack
                    access to equipment, guidance, or startup materials.
                  </p>
                  <p>
                    He created CreatorLaunch to give students structured time to learn,
                    work on a project, and make decisions with support close by.
                  </p>
                </div>
                <div className="button-row">
                  <Link href="/about/team/qwentin-blassingame" className="site-button site-button-primary">Read Qwentin’s bio</Link>
                  <a href={`mailto:${CONTACT_EMAIL}`} className="site-button site-button-secondary">Contact CreatorLaunch</a>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="editorial-section">
          <div className="container mx-auto px-4">
            <div className="section-heading split-heading">
              <div><p className="eyebrow">The organization</p><h2>What CreatorLaunch is building.</h2></div>
              <p>Our current focus is the Student Business Program and accessible learning resources.</p>
            </div>
            <div className="three-column-rules">
              <div>
                <h3>Mission</h3>
                <p>Help young people learn entrepreneurship by developing and testing their own ideas.</p>
              </div>
              <div>
                <h3>Program model</h3>
                <p>A free, 12-week small-group program with coaching, laptops, and approved project purchases.</p>
              </div>
              <div>
                <h3>Learning resources</h3>
                <p>Free games and practical tools that help students understand business and financial decisions.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="editorial-section section-ink">
          <div className="container mx-auto px-4">
            <div className="content-split align-start">
              <div className="section-heading">
                <p className="eyebrow">Our approach</p>
                <h2>Clear expectations, small groups, and useful support.</h2>
              </div>
              <ul className="plain-list ruled">
                <li>Students spend time working on their own project.</li>
                <li>The Student Business Program is free for students and families.</li>
                <li>Groups are kept small so students can ask questions.</li>
                <li>Laptops are available during program sessions.</li>
                <li>Students may receive up to $500 in approved direct purchases.</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="quiet-cta">
          <div className="container mx-auto px-4">
            <div>
              <p className="eyebrow">Student Business Program</p>
              <h2>Learn what students will do during the 12-week program.</h2>
            </div>
            <div className="button-row">
              <Link href="/student-business-program" className="site-button site-button-primary">Program details</Link>
              <a href={programHref} className="site-button site-button-secondary">Request updates</a>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
};

export default AboutPage;
