import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Link from 'next/link';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImageUrl?: string;
  authorName: string;
  authorTitle?: string;
  publishedAt?: string;
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
    if (typeof slug === 'string') {
      loadPost(slug);
    }
  }, [slug]);

  const loadPost = async (postSlug: string) => {
    try {
      setLoading(true);
      setError('');

      const response = await fetch(`${API_BASE_URL}/api/blog/${postSlug}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Blog post not found.');
      }

      setPost(data.post);
    } catch (err: any) {
      setError(err.message || 'Blog post not found.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date?: string) => {
    if (!date) return '';

    return new Date(date).toLocaleDateString(undefined, {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const renderContent = (content: string) => {
    return content.split('\n').map((line, index) => {
      const trimmed = line.trim();

      if (!trimmed) {
        return <div key={index} className="h-4" />;
      }

      if (trimmed.startsWith('# ')) {
        return (
          <h2 key={index} className="text-3xl font-bold text-dark mt-8 mb-4">
            {trimmed.replace(/^# /, '')}
          </h2>
        );
      }

      if (trimmed.startsWith('## ')) {
        return (
          <h3 key={index} className="text-2xl font-bold text-dark mt-8 mb-3">
            {trimmed.replace(/^## /, '')}
          </h3>
        );
      }

      if (trimmed.startsWith('### ')) {
        return (
          <h4 key={index} className="text-xl font-bold text-dark mt-6 mb-2">
            {trimmed.replace(/^### /, '')}
          </h4>
        );
      }

      return (
        <p key={index} className="text-lg text-medium leading-relaxed mb-4">
          {trimmed}
        </p>
      );
    });
  };

  if (loading) {
    return (
      <>
        <Head>
          <title>Loading Blog Post | CreatorLaunch</title>
        </Head>

        <main className="min-h-screen flex items-center justify-center bg-light">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </main>
      </>
    );
  }

  if (error || !post) {
    return (
      <>
        <Head>
          <title>Blog Post Not Found | CreatorLaunch</title>
        </Head>

        <main className="min-h-screen flex items-center justify-center bg-light">
          <div className="text-center px-4">
            <h1 className="text-4xl font-bold text-dark mb-4">
              Blog Post Not Found
            </h1>

            <p className="text-medium mb-6">{error}</p>

            <Link href="/blog" className="bg-primary text-white px-6 py-3 rounded-lg font-bold">
              Back to Blog
            </Link>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>{post.seoTitle || post.title} | CreatorLaunch</title>
        <meta name="description" content={post.seoDescription || post.excerpt} />
      </Head>

      <main>
        <article className="bg-white">
          <section className="py-16 border-b">
            <div className="container mx-auto px-4 max-w-4xl">
              <Link href="/blog" className="text-primary font-bold hover:text-red-600">
                ← Back to Blog
              </Link>

              <p className="text-primary font-bold uppercase tracking-widest mt-8 mb-3">
                CreatorLaunch Blog
              </p>

              <h1 className="text-4xl md:text-6xl font-bold text-dark mb-6">
                {post.title}
              </h1>

              <p className="text-xl text-medium mb-6">
                {post.excerpt}
              </p>

              <div className="text-medium">
                <p>
                  {formatDate(post.publishedAt)} | {post.authorName}
                  {post.authorTitle ? `, ${post.authorTitle}` : ''}
                </p>
              </div>

              {post.tags?.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-6">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </section>

          {post.coverImageUrl && (
            <div className="container mx-auto px-4 max-w-5xl py-10">
              <img
                src={post.coverImageUrl}
                alt={post.title}
                className="w-full rounded-2xl shadow-sm object-cover max-h-[500px]"
              />
            </div>
          )}

          <section className="py-12">
            <div className="container mx-auto px-4 max-w-3xl">
              {renderContent(post.content)}
            </div>
          </section>
        </article>
      </main>
    </>
  );
};

export default BlogPostPage;
