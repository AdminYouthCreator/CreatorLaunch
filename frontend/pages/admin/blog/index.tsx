import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import AdminLayout from '@/components/admin/AdminLayout';
import { adminAPI } from '@/utils/adminApi';
import {
  FiRefreshCw,
  FiSearch,
  FiEdit3,
  FiPlus,
  FiArchive,
  FiExternalLink,
  FiArrowUp,
  FiArrowDown,
} from 'react-icons/fi';

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
  displayOrder?: number;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

const AdminBlogPage: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortMode, setSortMode] = useState('custom');
  const [loading, setLoading] = useState(true);
  const [archivingId, setArchivingId] = useState('');
  const [reordering, setReordering] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadPosts();
  }, [sortMode]);

  const loadPosts = async () => {
    try {
      setLoading(true);
      setError('');
      setSuccess('');

      const data = await adminAPI.getBlogPosts(sortMode);
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

  const movePost = async (postId: string, direction: 'up' | 'down') => {
    if (sortMode !== 'custom') {
      setError('Switch sorting to Custom Order before moving posts.');
      return;
    }

    const currentIndex = posts.findIndex((post) => post.id === postId);
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;

    if (currentIndex < 0 || targetIndex < 0 || targetIndex >= posts.length) return;

    const nextPosts = [...posts];
    const current = nextPosts[currentIndex];
    const target = nextPosts[targetIndex];

    nextPosts[currentIndex] = target;
    nextPosts[targetIndex] = current;

    try {
      setReordering(true);
      setError('');
      setSuccess('');

      setPosts(nextPosts);

      await adminAPI.reorderBlogPosts(nextPosts.map((post) => post.id));

      setSuccess('Blog order updated.');
      await loadPosts();
    } catch (err: any) {
      setError(err.message || 'Failed to reorder posts.');
      await loadPosts();
    } finally {
      setReordering(false);
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
            <p>Create, edit, publish, schedule, archive, and order CreatorLaunch blog posts.</p>
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
              {posts.filter((post) => post.status === 'scheduled').length}
            </h3>
            <p className="admin-stat-label">Scheduled</p>
            <p className="admin-stat-change">Auto-publishes after date</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-3 lg:items-center lg:justify-between">
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

            <div className="flex flex-col sm:flex-row gap-3">
              <select
                value={sortMode}
                onChange={(event) => setSortMode(event.target.value)}
                className="px-4 py-2 border rounded-lg"
              >
                <option value="custom">Custom Order</option>
                <option value="newest">Newest Published First</option>
                <option value="oldest">Oldest Published First</option>
              </select>

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

          {sortMode !== 'custom' && (
            <p className="text-sm text-gray-500 mt-3">
              Switch to <strong>Custom Order</strong> to move posts up or down manually.
            </p>
          )}
        </div>

        <div className="admin-table-container">
          {loading ? (
            <div className="p-8 text-center">Loading blog posts...</div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Post</th>
                  <th>Author</th>
                  <th>Status</th>
                  <th>Published/Scheduled</th>
                  <th>Updated</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredPosts.map((post) => {
                  const realIndex = posts.findIndex((p) => p.id === post.id);

                  return (
                    <tr key={post.id}>
                      <td>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{post.displayOrder || realIndex + 1}</span>

                          <div className="flex flex-col gap-1">
                            <button
                              type="button"
                              disabled={sortMode !== 'custom' || realIndex === 0 || reordering}
                              onClick={() => movePost(post.id, 'up')}
                              className="admin-btn secondary"
                              style={{ padding: '0.25rem 0.5rem' }}
                            >
                              <FiArrowUp />
                            </button>

                            <button
                              type="button"
                              disabled={sortMode !== 'custom' || realIndex === posts.length - 1 || reordering}
                              onClick={() => movePost(post.id, 'down')}
                              className="admin-btn secondary"
                              style={{ padding: '0.25rem 0.5rem' }}
                            >
                              <FiArrowDown />
                            </button>
                          </div>
                        </div>
                      </td>

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
                  );
                })}

                {filteredPosts.length === 0 && (
                  <tr>
                    <td colSpan={7} className="text-center p-8">
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
