import React from 'react';
import Link from 'next/link';
import { FiArrowUpRight, FiCheck } from 'react-icons/fi';
import Layout from '@/components/common/Layout';

const CONTACT_EMAIL = 'qwentin@youthcreatorlaunch.org';

const updatesHref = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
  'CreatorLaunch Student Business Program Inquiry',
)}&body=${encodeURIComponent(
  'Hello CreatorLaunch,\n\nI would like to learn more about the CreatorLaunch Student Business Program.\n\nI am a: Student / Parent or guardian / School representative / Other\nStudent age (if applicable):\nCity or ZIP code:\nBest way to contact me:\n\nQuestions:\n',
)}`;

const learningAreas = [
  ['Develop a business idea', 'Explore your interests and strengths, identify a problem, and decide what product or service you want to offer.'],
  ['Understand your customers', 'Think about who would use your product or service, ask useful questions, and use feedback to improve your idea.'],
  ['Manage money', 'Build a budget, understand expenses and revenue, set prices, and keep track of purchases.'],
  ['Build your brand', 'Choose how to present your business and create materials that explain what you offer.'],
  ['Market your work', 'Practice reaching potential customers and communicating the value of your product or service.'],
  ['Plan your next steps', 'Set realistic goals, organize tasks, and work through challenges as your project develops.'],
];

const StudentBusinessProgramPage = () => {
  return (
    <Layout
      title="CreatorLaunch Student Business Program | Free 12-Week Program"
      description="A free, 12-week entrepreneurship program for St. Louis County students ages 14–18, with coaching, laptops, and up to $500 in approved business purchases."
      announcementText="Program groups are being developed now. Contact us to receive enrollment updates."
    >
      <main>
        <section className="editorial-hero program-hero">
          <div className="container mx-auto px-4">
            <div className="hero-layout">
              <div className="hero-copy">
                <p className="eyebrow">Free · Ages 14–18 · St. Louis County</p>
                <h1>CreatorLaunch Student Business Program</h1>
                <p className="hero-lede">
                  A 12-week program where students develop a business idea and put what
                  they learn into practice with coaching, equipment, and project support.
                </p>
                <div className="button-row">
                  <a href={updatesHref} className="site-button site-button-primary">
                    Ask about upcoming groups <FiArrowUpRight aria-hidden="true" />
                  </a>
                  <a href="#details" className="site-button site-button-secondary">See program details</a>
                </div>
              </div>

              <aside className="program-brief" aria-label="Eligibility">
                <p className="program-brief-title">Who can join</p>
                <ul className="plain-list">
                  <li>Students ages 14–18</li>
                  <li>Residents of St. Louis County</li>
                  <li>No previous business experience required</li>
                  <li>An existing idea is optional</li>
                </ul>
              </aside>
            </div>
          </div>
        </section>

        <section id="details" className="fact-strip">
          <div className="container mx-auto px-4">
            <dl>
              <div><dt>12 weeks</dt><dd>Program length</dd></div>
              <div><dt>24 sessions</dt><dd>Two 2-hour meetings each week</dd></div>
              <div><dt>8 students</dt><dd>Per program group</dd></div>
              <div><dt>$0</dt><dd>Cost to students and families</dd></div>
            </dl>
          </div>
        </section>

        <section className="editorial-section">
          <div className="container mx-auto px-4">
            <div className="content-split align-start">
              <div className="section-heading">
                <p className="eyebrow">How it works</p>
                <h2>Instruction and project work happen in every session.</h2>
              </div>
              <div className="body-copy">
                <p>
                  Students meet in a group of eight twice a week. Across 24 sessions,
                  they develop an idea, make decisions, test their approach, and prepare
                  to explain their work.
                </p>
                <p>
                  Coaches answer questions and help students turn large goals into smaller
                  tasks. Students also exchange feedback, practice presenting, and learn
                  from the other people in their group.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="what-youll-learn" className="editorial-section section-tint">
          <div className="container mx-auto px-4">
            <div className="section-heading split-heading">
              <div><p className="eyebrow">What students learn</p><h2>Six parts of building a business idea.</h2></div>
              <p>Students apply each topic to their own project during program sessions.</p>
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

        <section className="editorial-section">
          <div className="container mx-auto px-4">
            <div className="content-split align-start">
              <div className="section-heading">
                <p className="eyebrow">Project purchases</p>
                <h2>Up to $500 in approved business purchases.</h2>
                <p>
                  Depending on the project, purchases may include supplies, materials, a
                  website domain, or other tools needed to develop and test the idea.
                </p>
              </div>
              <div className="body-copy callout-rule">
                <p>
                  Students submit purchase requests and explain how each item supports
                  their project. Staff and students make spending decisions together.
                </p>
                <p>
                  CreatorLaunch purchases approved items directly. The support is not a
                  cash payment.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="editorial-section section-ink">
          <div className="container mx-auto px-4">
            <div className="content-split align-start">
              <div className="section-heading">
                <p className="eyebrow">Equipment and support</p>
                <h2>Students do not need to own a computer.</h2>
              </div>
              <div className="body-copy">
                <p>
                  Laptops are available during program sessions. Instruction, coaching,
                  materials, and approved project purchases are also provided at no cost.
                </p>
                <ul className="check-list compact">
                  <li><FiCheck aria-hidden="true" /><span>Laptop access during sessions</span></li>
                  <li><FiCheck aria-hidden="true" /><span>Small-group coaching</span></li>
                  <li><FiCheck aria-hidden="true" /><span>Program materials</span></li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="editorial-section">
          <div className="container mx-auto px-4">
            <div className="content-split align-start">
              <div className="section-heading">
                <p className="eyebrow">Final showcase</p>
                <h2>Students present what they built and learned.</h2>
                <p>
                  The program ends with a showcase. Students work toward a business plan,
                  project budget, presentation, and realistic next steps.
                </p>
              </div>
              <div className="ruled-list compact">
                {[
                  'A clearer business idea',
                  'A simple business plan',
                  'A project budget',
                  'Experience making and explaining decisions',
                  'A presentation of their work',
                ].map((item) => <div key={item}><h3>{item}</h3></div>)}
              </div>
            </div>
            <p className="program-note">
              Starting a profitable business is not required. Progress, learning, and
              thoughtful effort are valid outcomes.
            </p>
          </div>
        </section>

        <section className="quiet-cta">
          <div className="container mx-auto px-4">
            <div>
              <p className="eyebrow">Enrollment updates</p>
              <h2>Upcoming dates and locations are still being finalized.</h2>
              <p>Students, families, and schools are welcome to contact CreatorLaunch now.</p>
            </div>
            <div className="button-row">
              <a href={updatesHref} className="site-button site-button-primary">Contact CreatorLaunch</a>
              <Link href="/faq" className="site-button site-button-secondary">Read the FAQ</Link>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
};

export default StudentBusinessProgramPage;
