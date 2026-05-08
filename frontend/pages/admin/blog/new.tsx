import React, { useState } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '@/components/admin/AdminLayout';
import { adminAPI } from '@/utils/adminApi';
import { FiSave, FiArrowLeft } from 'react-icons/fi';

const makeSlug = (value: string) => {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

const AdminNewBlogPostPage: React.FC = () => {
  const router = useRouter();

  const [form, setForm] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    coverImageUrl: '',
    authorName: 'The CreatorLaunch Team',
    authorTitle: '',
    status: 'draft',
    scheduledFor: '',
    tags: '',
    seoTitle: '',
    seoDescription: '',
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const updateField = (field: string, value: string) => {
    setForm((prev) => {
      const next = {
        ...prev,
        [field]: value,
      };

      if (field === 'title' && !prev.slug) {
        next.slug = makeSlug(value);
      }

      return next;
    });
  };

  const savePost = async () => {
    try {
      setSaving(true);
      setError('');

      const data = await adminAPI.createBlogPost({
        ...form,
        scheduledFor: form.status === 'scheduled' && form.scheduledFor ? form.scheduledFor : null,
        tags: form.tags,
      });

      router.push(`/admin/blog/${data.post.id}`);
    } catch (err: any) {
      setError(err.message || 'Failed to create blog post.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout>
      <div className="admin-page">
        <div className="admin-page-header">
          <div>
            <button
              onClick={() => router.push('/admin/blog')}
              className="text-blue-600 hover:underline flex items-center gap-2 mb-2"
            >
              <FiArrowLeft />
              Back to Blog
            </button>
            <h1>New Blog Post</h1>
            <p>Create a new CreatorLaunch blog post.</p>
          </div>

          <button onClick={savePost} disabled={saving} className="admin-btn">
            <FiSave />
            {saving ? 'Saving...' : 'Save Post'}
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 mb-6">
            {error}
          </div>
        )}

        <div className="bg-white rounded-lg shadow-sm p-6 space-y-5">
          <div>
            <label className="block text-sm font-semibold mb-1">Title</label>
            <input
              value={form.title}
              onChange={(event) => updateField('title', event.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="Blog post title"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Slug</label>
            <input
              value={form.slug}
              onChange={(event) => updateField('slug', makeSlug(event.target.value))}
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="blog-post-slug"
            />
            <p className="text-xs text-gray-500 mt-1">Public URL: /blog/{form.slug || 'your-slug'}</p>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Excerpt</label>
            <textarea
              value={form.excerpt}
              onChange={(event) => updateField('excerpt', event.target.value)}
              rows={3}
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="Short summary shown on the blog list."
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Content</label>
            <textarea
              value={form.content}
              onChange={(event) => updateField('content', event.target.value)}
              rows={16}
              className="w-full px-4 py-2 border rounded-lg font-mono text-sm"
              placeholder="Write the full blog post here..."
            />
            <p className="text-xs text-gray-500 mt-1">
              Use blank lines to separate paragraphs. Public page will preserve spacing.
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Cover Image URL optional</label>
            <input
              value={form.coverImageUrl}
              onChange={(event) => updateField('coverImageUrl', event.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="https://..."
            />
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold mb-1">Author Name</label>
              <input
                value={form.authorName}
                onChange={(event) => updateField('authorName', event.target.value)}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1">Author Title optional</label>
              <input
                value={form.authorTitle}
                onChange={(event) => updateField('authorTitle', event.target.value)}
                className="w-full px-4 py-2 border rounded-lg"
                placeholder="Founder & Executive Director"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold mb-1">Status</label>
              <select
                value={form.status}
                onChange={(event) => updateField('status', event.target.value)}
                className="w-full px-4 py-2 border rounded-lg"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="scheduled">Scheduled</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1">Scheduled For</label>
              <input
                type="datetime-local"
                value={form.scheduledFor}
                onChange={(event) => updateField('scheduledFor', event.target.value)}
                className="w-full px-4 py-2 border rounded-lg"
                disabled={form.status !== 'scheduled'}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Tags optional</label>
            <input
              value={form.tags}
              onChange={(event) => updateField('tags', event.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="workshops, youth entrepreneurship, funding"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold mb-1">SEO Title optional</label>
              <input
                value={form.seoTitle}
                onChange={(event) => updateField('seoTitle', event.target.value)}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1">SEO Description optional</label>
              <input
                value={form.seoDescription}
                onChange={(event) => updateField('seoDescription', event.target.value)}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminNewBlogPostPage;
