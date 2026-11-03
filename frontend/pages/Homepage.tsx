import React from 'react';
import Link from 'next/link';
import { FiArrowUpRight, FiCheck } from 'react-icons/fi';
import Layout from '@/components/common/Layout';

const CONTACT_EMAIL = 'qwentin@youthcreatorlaunch.org';

const updatesHref = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
  'CreatorLaunch Student Business Program Updates',
)}&body=${encodeURIComponent(
  'Hello CreatorLaunch,\n\nPlease keep me updated about upcoming CreatorLaunch Student Business Program groups.\n\nStudent age:\nCity or ZIP code:\nBest contact name:\nBest contact email or phone:\n\nQuestions:\n',
)}`;

const learningAreas = [
  ['Develop an idea', 'Choose a problem to solve and shape a product or service around your interests.'],
  ['Understand customers', 'Ask useful questions, listen to feedback, and adjust your idea.'],
  ['Manage money', 'Build a budget, track expenses, understand revenue, and set prices.'],
  ['Build a brand', 'Decide how to present the business and explain what it offers.'],
  ['Market your work', 'Practice reaching potential customers and communicating value.'],
  ['Plan next steps', 'Set realistic goals, organize tasks, and work through problems.'],
];

const Homepage = () => {
  return (
    <Layout
      title="CreatorLaunch | Free Business Program for St. Louis County Students"
      description="A free, 12-week business program for students ages 14–18 in St. Louis County, with coaching, laptops, and up to $500 in approved project purchases."
      announcementText="Upcoming Student Business Program groups are being planned now."
    >
      <main>
        <section className="editorial-hero">
          <div className="container mx-auto px-4">
            <div className="hero-layout">
              <div className="hero-copy">
                <p className="eyebrow">Free · Ages 14–18 · St. Louis County</p>
                <h1>A business program where students build their own idea.</h1>
                <p className="hero-lede">
                  CreatorLaunch is a free, 12-week program with coaching, project time,
                  laptops, and approved business purchases. Students can arrive with an
                  idea, a hobby, or simple curiosity about entrepreneurship.
                </p>
                <div className="button-row">
                  <Link href="/student-business-program" className="site-button site-button-primary">
                    Read about the program <FiArrowUpRight aria-hidden="true" />
                  </Link>
                  <a href={updatesHref} className="site-button site-button-secondary">
                    Request updates
                  </a>
                </div>
              </div>

              <aside className="program-brief" aria-label="Program summary">
                <p className="program-brief-title">Program summary</p>
                <dl>
                  <div><dt>Length</dt><dd>12 weeks</dd></div>
                  <div><dt>Schedule</dt><dd>Two 2-hour sessions each week</dd></div>
                  <div><dt>Group size</dt><dd>8 students</dd></div>
                  <div><dt>Cost</dt><dd>Free</dd></div>
                  <div><dt>Experience</dt><dd>None required</dd></div>
                </dl>
              </aside>
            </div>
          </div>
        </section>

        <section className="editorial-section">
          <div className="container mx-auto px-4">
            <div className="section-heading split-heading">
              <div>
                <p className="eyebrow">What students do</p>
                <h2>Work on a real project every week.</h2>
              </div>
              <p>
                Each session includes instruction and time to apply it. Coaches help
                students make decisions, test an approach, and break large tasks into
                manageable steps.
              </p>
            </div>

            <ol className="numbered-list">
              {learningAreas.map(([title, description], index) => (
                <li key={title}>
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <div><h3>{title}</h3><p>{description}</p></div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="editorial-section section-tint">
          <div className="container mx-auto px-4">
            <div className="content-split">
              <div className="section-heading">
                <p className="eyebrow">Included at no cost</p>
                <h2>Students get the tools and support they need to participate.</h2>
                <p>
                  Families do not pay for instruction, coaching, program materials, or
                  laptop use during sessions.
                </p>
              </div>

              <div className="ruled-list">
                <div>
                  <h3>Up to $500 in approved purchases</h3>
                  <p>
                    Students can request supplies, materials, a website domain, or other
                    project tools. CreatorLaunch buys approved items directly; this is not
                    a cash payment.
                  </p>
                </div>
                <div>
                  <h3>Laptops during sessions</h3>
                  <p>Students do not need to own a computer to take part.</p>
                </div>
                <div>
                  <h3>Coaching in a small group</h3>
                  <p>Eight students work alongside coaches and learn from one another.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="editorial-section">
          <div className="container mx-auto px-4">
            <div className="content-split">
              <div className="section-heading">
                <p className="eyebrow">For students and families</p>
                <h2>No finished business plan is expected.</h2>
                <p>
                  The program is designed for students who are ready to ask questions,
                  try an idea, listen to feedback, and keep working when something needs
                  to change.
                </p>
              </div>

              <ul className="check-list">
                {[
                  'Open to students ages 14–18 who live in St. Louis County',
                  'No previous business experience required',
                  'Ends with a showcase of each student’s work',
                  'Students leave with a plan, budget, and practical decision-making experience',
                ].map((item) => (
                  <li key={item}><FiCheck aria-hidden="true" /><span>{item}</span></li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="compact-feature">
          <div className="container mx-auto px-4">
            <div className="compact-feature-inner">
              <div>
                <p className="eyebrow">CreatorGames</p>
                <h2>Practice money and business decisions through games.</h2>
              </div>
              <div>
                <p>
                  Explore free games about budgeting, credit, investing, careers,
                  insurance, and entrepreneurship.
                </p>
                <Link href="/games" className="text-link">Browse the games <FiArrowUpRight aria-hidden="true" /></Link>
              </div>
            </div>
          </div>
        </section>

        <section className="quiet-cta">
          <div className="container mx-auto px-4">
            <div>
              <p className="eyebrow">Upcoming groups</p>
              <h2>Dates and locations will be announced as they are confirmed.</h2>
              <p>Students, families, and schools can contact us now with questions or to request updates.</p>
            </div>
            <div className="button-row">
              <a href={updatesHref} className="site-button site-button-primary">Request updates</a>
              <Link href="/faq" className="site-button site-button-secondary">Read the FAQ</Link>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
};

export default Homepage;
