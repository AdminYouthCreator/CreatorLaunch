import React, { useState } from 'react';
import Layout from '@/components/common/Layout';

const CONTACT_EMAIL = 'qwentin@youthcreatorlaunch.org';

const ContactPage = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    interest: 'Student Business Program updates',
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
    `CreatorLaunch Contact: ${form.interest}`
  )}&body=${encodeURIComponent(
    `Name: ${form.name}\nEmail: ${form.email}\nInterest: ${form.interest}\n\nMessage:\n${form.message}`
  )}`;

  return (
    <Layout
      title="Contact | CreatorLaunch"
      description="Contact CreatorLaunch with questions about the Student Business Program, eligibility, upcoming groups, partnerships, or supporting young entrepreneurs."
    >
      <main className="min-h-screen bg-light">
        <section className="bg-gradient-to-br from-white via-red-50 to-blue-50 py-20">
          <div className="container mx-auto px-4 text-center">
            <p className="text-primary font-bold uppercase tracking-widest mb-3">
              Contact CreatorLaunch
            </p>

            <h1 className="text-4xl md:text-6xl font-bold text-dark mb-6">
              Questions? We&apos;re here to help.
            </h1>

            <p className="text-lg md:text-xl text-medium max-w-3xl mx-auto">
              Students and families can ask about eligibility, upcoming program groups,
              schedules, project purchases, or anything else they want to understand.
            </p>
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm p-8 border border-gray-100">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-dark mb-2">
                      Name
                    </label>
                    <input
                      name="name"
                      type="text"
                      value={form.name}
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
                      How can we help?
                    </label>
                    <select
                      name="interest"
                      value={form.interest}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-primary focus:outline-none"
                    >
                      <option>Student Business Program updates</option>
                      <option>Student eligibility question</option>
                      <option>Parent or family question</option>
                      <option>Program schedule or location question</option>
                      <option>Partnership Inquiry</option>
                      <option>Donation or Sponsorship Inquiry</option>
                      <option>Media / General Question</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-dark mb-2">
                      Message
                    </label>
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      rows={6}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-primary focus:outline-none resize-none"
                      placeholder="Tell us a little more..."
                    />
                  </div>

                  <a
                    href={mailtoHref}
                    className="block w-full text-center bg-primary text-white py-4 rounded-lg font-semibold hover:bg-red-600 transition-colors"
                  >
                    Send Message
                  </a>

                  <p className="text-sm text-medium text-center">
                    This will open your email app and send to {CONTACT_EMAIL}.
                  </p>
                </div>
              </div>

              <aside className="space-y-6">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <h3 className="text-xl font-bold text-dark mb-4">
                    Direct Email
                  </h3>

                  <a
                    href={`mailto:${CONTACT_EMAIL}`}
                    className="text-primary font-semibold break-all"
                  >
                    {CONTACT_EMAIL}
                  </a>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <h3 className="text-xl font-bold text-dark mb-4">
                    Common Requests
                  </h3>

                  <div className="space-y-3 text-medium">
                    <p>Get updates about upcoming groups</p>
                    <p>Ask if a student is eligible</p>
                    <p>Understand approved project purchases</p>
                    <p>Explore a school or organization partnership</p>
                    <p>Support the Student Business Program</p>
                  </div>
                </div>

                <div className="bg-primary text-white rounded-2xl shadow-sm p-6">
                  <h3 className="text-xl font-bold mb-3">
                    Questions are welcome.
                  </h3>

                  <p className="text-white/90">
                    Students do not need to have a business idea or previous experience
                    before asking about the program.
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

export default ContactPage;
