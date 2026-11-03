import React, { useState } from 'react';
import Layout from '@/components/common/Layout';

const CONTACT_EMAIL = 'qwentin@youthcreatorlaunch.org';

const BringCreatorLaunchPage = () => {
  const [form, setForm] = useState({
    organizationName: '',
    contactName: '',
    email: '',
    phone: '',
    organizationType: 'School',
    communityServed: '',
    estimatedStudents: '',
    preferredTimeline: '',
    message: '',
  });

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const mailtoHref = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
    'Bring CreatorLaunch to our community'
  )}&body=${encodeURIComponent(
    `Organization Name: ${form.organizationName}
Contact Name: ${form.contactName}
Email: ${form.email}
Phone: ${form.phone}
Organization Type: ${form.organizationType}
Community Served: ${form.communityServed}
Estimated Students: ${form.estimatedStudents}
Preferred Timeline: ${form.preferredTimeline}

Message:
${form.message}`
  )}`;

  return (
    <Layout
      title="Bring CreatorLaunch to Your Community | CreatorLaunch"
      description="Request CreatorLaunch entrepreneurship workshops for your school, summer program, afterschool program, nonprofit, or community organization."
      announcementText="CreatorLaunch workshops are designed to be no-cost for students and families."
    >
      <main className="min-h-screen bg-white">
        <section className="page-intro">
          <div className="container mx-auto px-4">
            <p className="eyebrow">Bring CreatorLaunch</p>
            <h1>Ask about entrepreneurship programming for your students.</h1>
            <p>
              Schools, summer programs, afterschool programs, nonprofits, and community
              organizations can contact CreatorLaunch to discuss a program or workshop.
              Participation should remain free for students and families.
            </p>
          </div>
        </section>

        <section className="editorial-section section-tint">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 form-panel">
                <h2 className="text-3xl font-bold text-dark mb-3">
                  Request CreatorLaunch
                </h2>

                <p className="text-medium mb-8">
                  Fill this out and your email app will open with the request ready to send.
                </p>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-dark mb-2">
                      Organization Name
                    </label>
                    <input
                      name="organizationName"
                      value={form.organizationName}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-primary focus:outline-none"
                      placeholder="Organization, school, or program"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-dark mb-2">
                      Contact Name
                    </label>
                    <input
                      name="contactName"
                      value={form.contactName}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-primary focus:outline-none"
                      placeholder="Your name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-dark mb-2">
                      Email
                    </label>
                    <input
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-primary focus:outline-none"
                      placeholder="you@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-dark mb-2">
                      Phone
                    </label>
                    <input
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-primary focus:outline-none"
                      placeholder="Optional"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-dark mb-2">
                      Organization Type
                    </label>
                    <select
                      name="organizationType"
                      value={form.organizationType}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-primary focus:outline-none"
                    >
                      <option>School</option>
                      <option>Summer Program</option>
                      <option>Afterschool Program</option>
                      <option>Community Organization</option>
                      <option>Nonprofit</option>
                      <option>Church / Faith Community</option>
                      <option>Library</option>
                      <option>Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-dark mb-2">
                      Estimated Students
                    </label>
                    <input
                      name="estimatedStudents"
                      value={form.estimatedStudents}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-primary focus:outline-none"
                      placeholder="Example: 15–25"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-semibold text-dark mb-2">
                    Community Served
                  </label>
                  <input
                    name="communityServed"
                    value={form.communityServed}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-primary focus:outline-none"
                    placeholder="Neighborhood, city, school community, or youth group"
                  />
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-semibold text-dark mb-2">
                    Preferred Timeline
                  </label>
                  <input
                    name="preferredTimeline"
                    value={form.preferredTimeline}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-primary focus:outline-none"
                    placeholder="Example: Summer 2026, Fall semester, afterschool"
                  />
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-semibold text-dark mb-2">
                    Message
                  </label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-primary focus:outline-none resize-none"
                    placeholder="Tell us about your students, goals, schedule, or what you want CreatorLaunch to bring."
                  />
                </div>

                <a
                  href={mailtoHref}
                  className="block w-full text-center bg-primary text-white py-4 rounded-lg font-semibold hover:bg-red-600 transition-colors mt-6"
                >
                    Open email request
                </a>
              </div>

              <aside className="space-y-6">
                <div className="aside-panel">
                  <h3 className="text-xl font-bold text-dark mb-4">
                    Best Fit For
                  </h3>

                  <div className="space-y-3 text-medium">
                    <p>Summer programs</p>
                    <p>Afterschool programs</p>
                    <p>Schools and classrooms</p>
                    <p>Youth-serving nonprofits</p>
                    <p>Community centers</p>
                    <p>Libraries and local programs</p>
                  </div>
                </div>

                <div className="aside-panel">
                  <h3 className="text-xl font-bold text-dark mb-4">
                    Workshop Topics
                  </h3>

                  <div className="space-y-3 text-medium">
                    <p>Entrepreneurship basics</p>
                    <p>Branding and identity</p>
                    <p>Product and service ideas</p>
                    <p>Pricing and customers</p>
                    <p>Pitch practice</p>
                    <p>Launch planning</p>
                  </div>
                </div>

                <div className="aside-panel aside-panel-accent">
                  <h3 className="text-xl font-bold mb-3">
                    Program questions are welcome.
                  </h3>

                  <p className="text-white/90">
                    Share your group, goals, schedule, and what kind of support you need.
                  </p>
                </div>
              </aside>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
};

export default BringCreatorLaunchPage;
