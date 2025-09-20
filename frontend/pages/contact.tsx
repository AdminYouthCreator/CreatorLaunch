import React, { useState } from 'react';
import Layout from '@/components/common/Layout';

// ################## ----- CONTACT PAGE COMPONENT ----- ##################
// Contact form page for user inquiries and support
// Handles form submission and message processing
// ############################################################
const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // ################## ----- FORM INPUT HANDLER ----- ##################
  // Handles changes to form inputs and updates state
  // Manages all form field updates dynamically
  // ################################################################
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('https://formspree.io/f/mzzgwzqd', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout
      title="Contact Us | CreatorLaunch"
      description="Have a question or want to partner with us? Get in touch with the CreatorLaunch team. We're based in St. Louis and dedicated to empowering young entrepreneurs."
    >
      {/* Hero Section */}
      <section className="bg-light py-20 sm:py-28">
        <div className="container mx-auto px-6 text-center" data-aos="fade-up">
          <h1 className="text-5xl sm:text-6xl font-black">Get in Touch</h1>
          <p className="text-lg text-medium mt-4 max-w-2xl mx-auto">
            Have a question, an idea, or want to partner with us? We'd love to hear from you.
          </p>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-20 sm:py-28">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="bg-white p-8 sm:p-12 rounded-2xl shadow-lg" data-aos="fade-up">
            {submitStatus === 'success' && (
              <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
                Thank you for your message! We'll get back to you soon.
              </div>
            )}

            {submitStatus === 'error' && (
              <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                There was an error sending your message. Please try again.
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="name" className="block text-left font-bold mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="form-input-light"
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-left font-bold mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="form-input-light"
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div className="mb-6">
                <label htmlFor="subject" className="block text-left font-bold mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  name="subject"
                  id="subject"
                  required
                  value={formData.subject}
                  onChange={handleInputChange}
                  className="form-input-light"
                  disabled={isSubmitting}
                />
              </div>

              <div className="mb-8">
                <label htmlFor="message" className="block text-left font-bold mb-2">
                  Message
                </label>
                <textarea
                  name="message"
                  id="message"
                  rows={6}
                  required
                  value={formData.message}
                  onChange={handleInputChange}
                  className="form-input-light"
                  disabled={isSubmitting}
                />
              </div>

              <div className="text-center">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-12 py-4 rounded-lg btn-submit-form font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ContactPage;
