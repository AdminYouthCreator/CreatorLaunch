import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/common/Layout';
import AuthGuard from '@/components/common/AuthGuard';
import { serviceAPI } from '@/utils/api';

const categories = [
  { value: 'design', label: 'Design' },
  { value: 'writing', label: 'Writing' },
  { value: 'tutoring', label: 'Tutoring' },
  { value: 'music', label: 'Music' },
  { value: 'video', label: 'Video' },
  { value: 'coding', label: 'Coding' },
  { value: 'social-media', label: 'Social Media' },
  { value: 'other', label: 'Other' },
];

const EditServicePage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;

  const [form, setForm] = useState({
    title: '',
    description: '',
    category: 'other',
    price: 0,
    deliveryTime: '',
    revisions: 1,
    requirements: '',
    status: 'draft',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (typeof id === 'string') {
      loadService(id);
    }
  }, [id]);

  const loadService = async (serviceId: string) => {
    try {
      setLoading(true);
      setError('');

      const response = await serviceAPI.getById(serviceId);
      const service = response.service || response.data || response;

      setForm({
        title: service.title || '',
        description: service.description || '',
        category: service.category || 'other',
        price: Number(service.price) || 0,
        deliveryTime: service.deliveryTime || '',
        revisions: Number(service.revisions) || 0,
        requirements: service.requirements || '',
        status: service.status || 'draft',
      });
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Failed to load service.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: name === 'price' || name === 'revisions' ? Number(value) : value,
    }));
  };

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();

    if (typeof id !== 'string') return;

    try {
      setSaving(true);
      setError('');

      await serviceAPI.update(id, form);
      router.push('/services');
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Failed to save service.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AuthGuard>
      <Layout title="Edit Service | CreatorLaunch">
        <div className="min-h-screen bg-light py-8">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-sm p-8">
              <button
                onClick={() => router.push('/services')}
                className="text-medium hover:text-dark transition-colors mb-4"
              >
                ← Back to Services
              </button>

              <h1 className="text-3xl font-bold text-dark mb-6">Edit Service</h1>

              {loading ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
                </div>
              ) : (
                <form onSubmit={handleSave} className="space-y-5">
                  {error && (
                    <div className="bg-red-50 text-red-600 border border-red-200 rounded-lg p-4">
                      {error}
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-semibold text-dark mb-2">
                      Service Title
                    </label>
                    <input
                      name="title"
                      value={form.title}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border rounded-lg focus:border-primary focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-dark mb-2">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={form.description}
                      onChange={handleChange}
                      required
                      rows={5}
                      className="w-full px-4 py-3 border rounded-lg focus:border-primary focus:outline-none resize-none"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-dark mb-2">
                        Category
                      </label>
                      <select
                        name="category"
                        value={form.category}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border rounded-lg focus:border-primary focus:outline-none"
                      >
                        {categories.map((category) => (
                          <option key={category.value} value={category.value}>
                            {category.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-dark mb-2">
                        Price
                      </label>
                      <input
                        name="price"
                        type="number"
                        min="0"
                        step="0.01"
                        value={form.price}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border rounded-lg focus:border-primary focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-dark mb-2">
                        Delivery Time
                      </label>
                      <input
                        name="deliveryTime"
                        value={form.deliveryTime}
                        onChange={handleChange}
                        required
                        placeholder="Example: 3-5 days"
                        className="w-full px-4 py-3 border rounded-lg focus:border-primary focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-dark mb-2">
                        Revisions
                      </label>
                      <input
                        name="revisions"
                        type="number"
                        min="0"
                        max="10"
                        value={form.revisions}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border rounded-lg focus:border-primary focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-dark mb-2">
                      Requirements
                    </label>
                    <textarea
                      name="requirements"
                      value={form.requirements}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-4 py-3 border rounded-lg focus:border-primary focus:outline-none resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-dark mb-2">
                      Status
                    </label>
                    <select
                      name="status"
                      value={form.status}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border rounded-lg focus:border-primary focus:outline-none"
                    >
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    disabled={saving}
                    className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-red-600 transition-colors disabled:bg-gray-400"
                  >
                    {saving ? 'Saving...' : 'Save Service'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </Layout>
    </AuthGuard>
  );
};

export default EditServicePage;
