import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/common/Layout';
import AuthGuard from '@/components/common/AuthGuard';
import { serviceAPI } from '@/utils/api';

const CATEGORIES = [
  { value: 'design', label: 'Design' },
  { value: 'writing', label: 'Writing' },
  { value: 'tutoring', label: 'Tutoring' },
  { value: 'music', label: 'Music' },
  { value: 'video', label: 'Video' },
  { value: 'coding', label: 'Coding' },
  { value: 'social-media', label: 'Social Media' },
  { value: 'other', label: 'Other' },
];

const NewServicePage: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: 'other',
    price: '',
    deliveryTime: '',
    revisions: '1',
    requirements: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await serviceAPI.create({
        title: form.title,
        description: form.description,
        category: form.category,
        price: parseFloat(form.price),
        deliveryTime: form.deliveryTime,
        revisions: parseInt(form.revisions),
        requirements: form.requirements || undefined,
      });
      router.push('/services');
    } catch (err: any) {
      const msg = err.response?.data?.errors
        ? err.response.data.errors.map((e: any) => e.msg).join(', ')
        : err.response?.data?.message || 'Failed to create service';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthGuard>
      <Layout title="Create Service | CreatorLaunch">
        <div className="min-h-screen bg-light">
          <div className="container mx-auto px-4 py-8">
            <div className="max-w-2xl mx-auto">
              <button
                onClick={() => router.back()}
                className="text-medium hover:text-dark mb-4 flex items-center gap-1 text-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Services
              </button>

              <h1 className="text-3xl font-bold text-dark mb-2">Create a New Service</h1>
              <p className="text-medium mb-8">Offer your skills and talents as a digital service.</p>

              <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-dark mb-1">Service Title</label>
                  <input
                    type="text"
                    name="title"
                    required
                    maxLength={120}
                    value={form.title}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="e.g., Custom Logo Design"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-dark mb-1">Description</label>
                  <textarea
                    name="description"
                    required
                    maxLength={2000}
                    rows={4}
                    value={form.description}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                    placeholder="Describe what you're offering, what's included, and why someone should hire you..."
                  />
                  <p className="text-xs text-medium mt-1">{form.description.length}/2000</p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-dark mb-1">Category</label>
                    <select
                      name="category"
                      value={form.category}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white"
                    >
                      {CATEGORIES.map(cat => (
                        <option key={cat.value} value={cat.value}>{cat.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-dark mb-1">Price ($)</label>
                    <input
                      type="number"
                      name="price"
                      required
                      min="0"
                      step="0.01"
                      value={form.price}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="25.00"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-dark mb-1">Delivery Time</label>
                    <input
                      type="text"
                      name="deliveryTime"
                      required
                      maxLength={50}
                      value={form.deliveryTime}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="e.g., 3 days"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-dark mb-1">Revisions Included</label>
                    <input
                      type="number"
                      name="revisions"
                      min="0"
                      max="10"
                      value={form.revisions}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-dark mb-1">
                    Requirements from Buyer <span className="text-medium font-normal">(optional)</span>
                  </label>
                  <textarea
                    name="requirements"
                    maxLength={1000}
                    rows={3}
                    value={form.requirements}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                    placeholder="What info do you need from the buyer to get started?"
                  />
                </div>

                {error && (
                  <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm">{error}</div>
                )}

                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-primary text-white py-3 rounded-lg font-semibold hover:bg-red-600 transition-colors disabled:opacity-50"
                  >
                    {loading ? 'Creating...' : 'Create Service'}
                  </button>
                  <button
                    type="button"
                    onClick={() => router.back()}
                    className="px-6 py-3 border rounded-lg text-medium hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </Layout>
    </AuthGuard>
  );
};

export default NewServicePage;
