import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Layout from '@/components/common/Layout';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImageUrl?: string;
  coverImageIsPersonFree?: boolean;
  content: string;
  authorName: string;
  authorTitle?: string;
  publishedAt?: string;
  scheduledFor?: string;
  tags: string[];
  seoTitle?: string;
  seoDescription?: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

const BlogPostPage: React.FC = () => {
  const router = useRouter();
  const { slug } = router.query;
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (typeof slug !== 'string') return;
    const loadPost = async () => {
      try {
        setLoading(true);
        setError('');
        const response = await fetch(`${API_BASE_URL}/api/blog/${slug}`);
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Blog post not found.');
        setPost(data.post);
      } catch (err: any) {
        setError(err.message || 'Blog post not found.');
      } finally {
        setLoading(false);
      }
    };
    loadPost();
  }, [slug]);

  const formatDate = (date?: string) => date
    ? new Date(date).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })
    : '';

  const renderContent = (content: string) => content.split('\n').map((line, index) => {
    const trimmed = line.trim();
    if (!trimmed) return <div key={index} className="h-4" />;
    if (trimmed.startsWith('# ')) return <h2 key={index}>{trimmed.replace(/^# /, '')}</h2>;
    if (trimmed.startsWith('## ')) return <h3 key={index}>{trimmed.replace(/^## /, '')}</h3>;
    if (trimmed.startsWith('### ')) return <h4 key={index}>{trimmed.replace(/^### /, '')}</h4>;
    if (trimmed.startsWith('- ')) return <li key={index}>{trimmed.replace(/^- /, '')}</li>;
    return <p key={index}>{trimmed}</p>;
  });

  if (loading) {
    return <Layout title="Loading post | CreatorLaunch"><main className="loading-page">Loading post…</main></Layout>;
  }

  if (error || !post) {
    return (
      <Layout title="Post not found | CreatorLaunch">
        <main className="loading-page"><div><h1>Post not found</h1><p>{error}</p><Link href="/blog" className="site-button site-button-primary">Back to blog</Link></div></main>
      </Layout>
    );
  }

  return (
    <Layout title={`${post.seoTitle || post.title} | CreatorLaunch`} description={post.seoDescription || post.excerpt}>
      <main>
        <article>
          <header className="article-header">
            <div className="container mx-auto px-4">
              <Link href="/blog" className="text-link">← Back to blog</Link>
              <p className="eyebrow">CreatorLaunch blog</p>
              <h1>{post.title}</h1>
              <p className="article-excerpt">{post.excerpt}</p>
              <p className="article-meta">
                {formatDate(post.publishedAt || post.scheduledFor)} · {post.authorName}
                {post.authorTitle ? `, ${post.authorTitle}` : ''}
              </p>
              {post.tags?.length > 0 && <p className="article-tags">{post.tags.join(' · ')}</p>}
              {post.coverImageUrl && post.coverImageIsPersonFree && (
                <img src={post.coverImageUrl} alt="" className="article-cover article-hero-cover" />
              )}
            </div>
          </header>
          <section className="article-body">
            <div className="container mx-auto px-4">{renderContent(post.content)}</div>
          </section>
        </article>
      </main>
    </Layout>
  );
};

export default BlogPostPage;
