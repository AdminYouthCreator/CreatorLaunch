import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Layout from '@/components/common/Layout';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  authorName: string;
  publishedAt?: string;
  scheduledFor?: string;
  tags: string[];
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

const BlogPage: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadPosts = async () => {
      try {
        setLoading(true);
        setError('');
        const response = await fetch(`${API_BASE_URL}/api/blog?sort=custom`);
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to load blog posts.');
        setPosts(data.posts || []);
      } catch (err: any) {
        setError(err.message || 'Failed to load blog posts.');
      } finally {
        setLoading(false);
      }
    };
    loadPosts();
  }, []);

  const formatDate = (date?: string) => date
    ? new Date(date).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })
    : '';

  return (
    <Layout title="Blog | CreatorLaunch" description="Program updates and notes from CreatorLaunch.">
      <main>
        <section className="page-intro">
          <div className="container mx-auto px-4">
            <p className="eyebrow">Blog</p>
            <h1>Updates from CreatorLaunch.</h1>
            <p>Program news, organizational updates, and notes from the team.</p>
          </div>
        </section>

        <section className="editorial-section">
          <div className="container mx-auto px-4">
            {loading ? (
              <p className="status-message">Loading posts…</p>
            ) : error ? (
              <p className="status-message error">{error}</p>
            ) : posts.length === 0 ? (
              <div className="empty-state"><h2>No posts have been published yet.</h2><p>Check back for program updates.</p></div>
            ) : (
              <div className="article-list">
                {posts.map((post) => (
                  <article key={post.id}>
                    <p className="article-meta">{formatDate(post.publishedAt || post.scheduledFor)} · {post.authorName}</p>
                    <h2><Link href={`/blog/${post.slug}`}>{post.title}</Link></h2>
                    <p>{post.excerpt}</p>
                    {post.tags?.length > 0 && <p className="article-tags">{post.tags.slice(0, 3).join(' · ')}</p>}
                    <Link href={`/blog/${post.slug}`} className="text-link">Read post →</Link>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
    </Layout>
  );
};

export default BlogPage;
