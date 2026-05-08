import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '@/components/admin/AdminLayout';
import { adminAPI } from '@/utils/adminApi';
import { FiSave, FiArrowLeft, FiExternalLink } from 'react-icons/fi';

const makeSlug = (value: string) => {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

const toDatetimeLocal = (value?: string | null) => {
  if (!value) return '';

  const date = new Date(value);
  const offset = date.getTimezoneOffset();
  const local = new Date(date.getTime() - offset * 60000);

  return local.toISOString().slice(0, 16);
};

const AdminEditBlogPostPage: React.FC = () => {
  const router = useRouter();
  const { postId } = router.query;

  const [form, setForm] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    coverImageUrl: '',
    authorName: '',
    authorTitle: '',
    status: 'draft',
    scheduledFor: '',
    tags: '',
    seoTitle: '',
    seoDescription: '',
    reason: '',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (typeof postId === 'string') {
      loadPost(postId);
    }
  }, [postId]);

  const loadPost = async (id: string) => {
    try {
      setLoading(true);
      setError('');
      setSuccess('');

      const data = await adminAPI.getBlogPost(id);
      const post = data.post;

      setForm({
        title: post.title || '',
        slug: post.slug || '',
        excerpt: post.excerpt || '',
        content: post.content || '',
        coverImageUrl: post.coverImageUrl || '',
        authorName: post.authorName || '',
        authorTitle: post.authorTitle || '',
        status: post.status || 'draft',
        scheduledFor: toDatetimeLocal(post.scheduledFor),
        tags: Array.isArray(post.tags) ? post.tags.join(', ') : '',
        seoTitle: post.seoTitle || '',
        seoDescription: post.seoDescription || '',
        reason: '',
      });
    } catch (err: any) {
      setError(err.message || 'Failed to load blog post.');
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field: string, value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: field === 'slug' ? makeSlug(value) : value,
    }));
  };

  const savePost = async () => {
    if (typeof postId !== 'string') return;

    try {
      setSaving(true);
      setError('');
      setSuccess('');

      await adminAPI.updateBlogPost(postId, {
        ...form,
        scheduledFor: form.status === 'scheduled' && form.scheduledFor ? form.scheduledFor : null,
        tags: form.tags,
      });

      setSuccess('Blog post saved.');
      await loadPost(postId);
    } catch (err: any) {
      setError(err.message || 'Failed to save blog post.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="admin-loading">
          <div className="admin-spinner"></div>
        </div>
      </AdminLayout>
    );
  }

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
            <h1>Edit Blog Post</h1>
            <p>Update blog content, publishing status, and SEO details.</p>
          </div>

          <div className="flex gap-3">
            {form.status === 'published' && (
              <a href={`/blog/${form.slug}`} target="_blank" rel="noreferrer" className="admin-btn secondary">
                <FiExternalLink />
                View Public
              </a>
            )}

            <button onClick={savePost} disabled={saving} className="admin-btn">
              <FiSave />
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 mb-6">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 rounded-lg p-4 mb-6">
            {success}
          </div>
        )}

        <div className="bg-white rounded-lg shadow-sm p-6 space-y-5">
          <div>
            <label className="block text-sm font-semibold mb-1">Title</label>
            <input
              value={form.title}
              onChange={(event) => updateField('title', event.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Slug</label>
            <input
              value={form.slug}
              onChange={(event) => updateField('slug', event.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
            />
            <p className="text-xs text-gray-500 mt-1">Public URL: /blog/{form.slug}</p>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Excerpt</label>
            <textarea
              value={form.excerpt}
              onChange={(event) => updateField('excerpt', event.target.value)}
              rows={3}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Content</label>
            <textarea
              value={form.content}
              onChange={(event) => updateField('content', event.target.value)}
              rows={18}
              className="w-full px-4 py-2 border rounded-lg font-mono text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Cover Image URL optional</label>
            <input
              value={form.coverImageUrl}
              onChange={(event) => updateField('coverImageUrl', event.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
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

          <div>
            <label className="block text-sm font-semibold mb-1">Reason for audit log optional</label>
            <textarea
              value={form.reason}
              onChange={(event) => updateField('reason', event.target.value)}
              rows={3}
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="Example: Updated article to reflect current workshop model."
            />
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminEditBlogPostPage;
