import React, { useState } from 'react';
import Layout from '@/components/common/Layout';

const ContactPage = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    interest: 'Interested in Applying',
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

  const mailtoHref = `mailto:contact@youthcreatorlaunch.org?subject=${encodeURIComponent(
    `CreatorLaunch Contact: ${form.interest}`
  )}&body=${encodeURIComponent(
    `Name: ${form.name}\nEmail: ${form.email}\nInterest: ${form.interest}\n\nMessage:\n${form.message}`
  )}`;

  return (
    <Layout title="Contact | CreatorLaunch">
      <main className="min-h-screen bg-light">
        {/* Hero */}
        <section className="bg-gradient-to-br from-white via-red-50 to-orange-50 py-20">
          <div className="container mx-auto px-4 text-center">
            <p className="text-primary font-semibold mb-3">
              Let’s build something.
            </p>
            <h1 className="text-4xl md:text-6xl font-bold text-dark mb-6">
              Get In Touch
            </h1>
            <p className="text-lg md:text-xl text-medium max-w-3xl mx-auto">
              Interested in applying, partnering, donating, volunteering, or learning more?
              Send us a message.
            </p>
          </div>
        </section>

        {/* Contact Form */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm p-8 border border-gray-100">
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
                    <option>Interested in Applying</option>
                    <option>Interested in Donating</option>
                    <option>Interested in Partnering</option>
                    <option>Interested in Volunteering</option>
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
                  This will open your email app with your message filled in.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
};

export default ContactPage;
