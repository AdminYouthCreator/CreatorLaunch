import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import AdminLayout from '@/components/admin/AdminLayout';
import { adminAPI } from '@/utils/adminApi';
import { FiRefreshCw, FiSearch, FiEdit3, FiPlus, FiArchive, FiExternalLink } from 'react-icons/fi';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  authorName: string;
  authorTitle?: string;
  status: 'draft' | 'published' | 'archived' | 'scheduled';
  publishedAt?: string | null;
  scheduledFor?: string | null;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

const AdminBlogPage: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [archivingId, setArchivingId] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      setLoading(true);
      setError('');
      setSuccess('');

      const data = await adminAPI.getBlogPosts();
      setPosts(data.posts || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load blog posts.');
    } finally {
      setLoading(false);
    }
  };

  const filteredPosts = useMemo(() => {
    const search = searchTerm.toLowerCase();

    return posts.filter((post) => {
      const matchesSearch =
        post.title?.toLowerCase().includes(search) ||
        post.excerpt?.toLowerCase().includes(search) ||
        post.authorName?.toLowerCase().includes(search) ||
        post.slug?.toLowerCase().includes(search);

      const matchesStatus = statusFilter === 'all' || post.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [posts, searchTerm, statusFilter]);

  const archivePost = async (postId: string) => {
    const reason = window.prompt('Reason for archiving this blog post?') || '';

    const confirmed = window.confirm('Archive this blog post?');

    if (!confirmed) return;

    try {
      setArchivingId(postId);
      setError('');
      setSuccess('');

      await adminAPI.archiveBlogPost(postId, reason);

      setSuccess('Blog post archived.');
      await loadPosts();
    } catch (err: any) {
      setError(err.message || 'Failed to archive blog post.');
    } finally {
      setArchivingId('');
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-700';
      case 'scheduled':
        return 'bg-blue-100 text-blue-700';
      case 'archived':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const formatDate = (date?: string | null) => {
    if (!date) return '—';
    return new Date(date).toLocaleDateString();
  };

  return (
    <AdminLayout>
      <div className="admin-page">
        <div className="admin-page-header">
          <div>
            <h1>Blog</h1>
            <p>Create, edit, publish, schedule, or archive CreatorLaunch blog posts.</p>
          </div>

          <div className="flex gap-3">
            <Link href="/admin/blog/new" className="admin-btn">
              <FiPlus />
              New Post
            </Link>

            <button onClick={loadPosts} className="admin-btn secondary">
              <FiRefreshCw />
              Refresh
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

        <div className="admin-stats-grid mb-8">
          <div className="admin-stat-card">
            <h3 className="admin-stat-value">{posts.length}</h3>
            <p className="admin-stat-label">Total Posts</p>
            <p className="admin-stat-change">All blog content</p>
          </div>

          <div className="admin-stat-card">
            <h3 className="admin-stat-value">
              {posts.filter((post) => post.status === 'published').length}
            </h3>
            <p className="admin-stat-label">Published</p>
            <p className="admin-stat-change positive">Visible publicly</p>
          </div>

          <div className="admin-stat-card">
            <h3 className="admin-stat-value">
              {posts.filter((post) => post.status === 'draft').length}
            </h3>
            <p className="admin-stat-label">Drafts</p>
            <p className="admin-stat-change">Internal only</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
            <div className="relative">
              <FiSearch className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search blog posts..."
                className="pl-10 pr-4 py-2 border rounded-lg"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="px-4 py-2 border rounded-lg"
            >
              <option value="all">All Statuses</option>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="scheduled">Scheduled</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>

        <div className="admin-table-container">
          {loading ? (
            <div className="p-8 text-center">Loading blog posts...</div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Post</th>
                  <th>Author</th>
                  <th>Status</th>
                  <th>Published</th>
                  <th>Updated</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredPosts.map((post) => (
                  <tr key={post.id}>
                    <td>
                      <div>
                        <div className="font-semibold">{post.title}</div>
                        <div className="text-sm text-gray-500 max-w-md truncate">
                          {post.excerpt}
                        </div>
                        <div className="text-xs text-gray-500">/{post.slug}</div>
                      </div>
                    </td>

                    <td>
                      <div>{post.authorName}</div>
                      {post.authorTitle && (
                        <div className="text-sm text-gray-500">{post.authorTitle}</div>
                      )}
                    </td>

                    <td>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold capitalize ${getStatusClass(post.status)}`}>
                        {post.status}
                      </span>
                    </td>

                    <td>{formatDate(post.publishedAt || post.scheduledFor)}</td>
                    <td>{formatDate(post.updatedAt)}</td>

                    <td>
                      <div className="flex flex-wrap gap-2">
                        <Link href={`/admin/blog/${post.id}`} className="admin-btn secondary">
                          <FiEdit3 />
                          Edit
                        </Link>

                        {post.status === 'published' && (
                          <Link href={`/blog/${post.slug}`} target="_blank" className="admin-btn secondary">
                            <FiExternalLink />
                            View
                          </Link>
                        )}

                        {post.status !== 'archived' && (
                          <button
                            onClick={() => archivePost(post.id)}
                            disabled={archivingId === post.id}
                            className="admin-btn danger"
                          >
                            <FiArchive />
                            Archive
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}

                {filteredPosts.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center p-8">
                      No blog posts found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminBlogPage;
