import React from 'react';
import Layout from '@/components/common/Layout';

const DonatePage: React.FC = () => {
  return (
    <Layout
      title="Donate | CreatorLaunch"
      description="Support the free CreatorLaunch Student Business Program, including coaching, equipment, materials, and approved student project purchases."
    >
      <main>
        <section className="page-intro">
          <div className="container mx-auto px-4">
            <p className="eyebrow">Donate</p>
            <h1>Support a free business program for students.</h1>
            <p>
              Donations help cover instruction, equipment, program materials, and approved
              purchases connected to student projects.
            </p>
          </div>
        </section>

        <section className="editorial-section section-tint">
          <div className="container mx-auto px-4">
            <div className="donate-layout">
              <div className="donation-form-panel">
                <p className="eyebrow">Secure donation form</p>
                <h2>Donate through Zeffy.</h2>
                <p>Zeffy processes donations for CreatorLaunch. The form appears below.</p>
                <iframe
                  title="Donate to CreatorLaunch through Zeffy"
                  src="https://www.zeffy.com/embed/donation-form/donate-to-support-a-young-ceo"
                  allowTransparency={true}
                />
              </div>

              <aside>
                <div className="aside-panel">
                  <h3>What donations support</h3>
                  <ul className="plain-list ruled">
                    <li>Program materials</li>
                    <li>Laptops and other equipment</li>
                    <li>Small-group instruction and coaching</li>
                    <li>Approved student project purchases</li>
                  </ul>
                </div>
                <div className="aside-panel">
                  <h3>About Zeffy</h3>
                  <p>Zeffy provides donation processing for nonprofit organizations without charging CreatorLaunch a platform fee.</p>
                </div>
              </aside>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
};

export default DonatePage;
