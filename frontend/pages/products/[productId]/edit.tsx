import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/common/Layout';
import AuthGuard from '@/components/common/AuthGuard';
import { productAPI } from '@/utils/api';

const EditProductPage = () => {
  const router = useRouter();
  const { productId } = router.query;

  const [form, setForm] = useState({
    name: '',
    description: '',
    price: 0,
    status: 'published',
  });

  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (typeof productId === 'string') {
      loadProduct(productId);
    }
  }, [productId]);

  const loadProduct = async (id: string) => {
    try {
      setLoading(true);
      setError('');

      const response = await productAPI.getById(id);
      const product = response.product || response.data || response;
      const firstVariant = product.variants?.[0] || {};

      const price =
        Number(product.price) ||
        Number(product.retailPrice) ||
        Number(firstVariant.retailPrice) ||
        0;

      setForm({
        name: product.name || '',
        description: product.description || '',
        price,
        status: product.status || 'published',
      });

      setImageUrl(
        product.imageUrl ||
          product.mockupUrl ||
          product.image ||
          product.thumbnail ||
          firstVariant.mockupUrl ||
          ''
      );
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Failed to load product.');
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
      [name]: name === 'price' ? Number(value) : value,
    }));
  };

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();

    if (typeof productId !== 'string') return;

    try {
      setSaving(true);
      setError('');

      await productAPI.update(productId, {
        ...form,
        retailPrice: form.price,
        isActive: form.status === 'active',
      });

      router.push('/products');
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Failed to save product.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AuthGuard>
      <Layout title="Edit Product | CreatorLaunch">
        <div className="min-h-screen bg-light py-8">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-sm p-8">
              <button
                onClick={() => router.push('/products')}
                className="text-medium hover:text-dark transition-colors mb-4"
              >
                ← Back to Products
              </button>

              <h1 className="text-3xl font-bold text-dark mb-6">Edit Product</h1>

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

                  {imageUrl && (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <img
                        src={imageUrl}
                        alt={form.name}
                        className="w-full max-h-72 object-contain rounded"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-semibold text-dark mb-2">
                      Product Name
                    </label>
                    <input
                      name="name"
                      value={form.name}
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
                      rows={5}
                      className="w-full px-4 py-3 border rounded-lg focus:border-primary focus:outline-none resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-dark mb-2">
                      Retail Price
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
                      <option value="published">Published</option>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="draft">Draft</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    disabled={saving}
                    className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-red-600 transition-colors disabled:bg-gray-400"
                  >
                    {saving ? 'Saving...' : 'Save Product'}
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

export default EditProductPage;
