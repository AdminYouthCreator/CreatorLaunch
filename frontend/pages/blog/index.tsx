import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImageUrl?: string;
  authorName: string;
  authorTitle?: string;
  publishedAt?: string;
  tags: string[];
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

const BlogPage: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await fetch(`${API_BASE_URL}/api/blog`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to load blog posts.');
      }

      setPosts(data.posts || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load blog posts.');
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

  return (
    <>
      <Head>
        <title>Blog | CreatorLaunch</title>
        <meta
          name="description"
          content="Stories, updates, and founder notes from CreatorLaunch."
        />
      </Head>

      <main>
        <section className="bg-white py-20">
          <div className="container mx-auto px-4 text-center">
            <p className="text-primary font-bold uppercase tracking-widest mb-3">
              CreatorLaunch Blog
            </p>

            <h1 className="text-4xl md:text-6xl font-bold text-dark mb-6">
              Stories, Updates, and Founder Notes
            </h1>

            <p className="text-xl text-medium max-w-3xl mx-auto">
              Follow our journey as we build a youth-led platform helping students launch real businesses.
            </p>
          </div>
        </section>

        <section className="bg-light py-16 min-h-screen">
          <div className="container mx-auto px-4">
            {loading ? (
              <div className="text-center py-16">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                <p className="text-medium mt-4">Loading posts...</p>
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-6 max-w-2xl mx-auto">
                {error}
              </div>
            ) : posts.length === 0 ? (
              <div className="text-center py-16">
                <h2 className="text-2xl font-bold text-dark mb-3">
                  More insights coming soon.
                </h2>
                <p className="text-medium">No blog posts have been published yet.</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {posts.map((post) => (
                  <article
                    key={post.id}
                    className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                  >
                    {post.coverImageUrl ? (
                      <img
                        src={post.coverImageUrl}
                        alt={post.title}
                        className="w-full h-48 object-cover"
                      />
                    ) : (
                      <div className="w-full h-48 bg-gradient-to-br from-blue-100 to-red-100 flex items-center justify-center">
                        <span className="text-4xl">🚀</span>
                      </div>
                    )}

                    <div className="p-6">
                      <p className="text-sm text-medium mb-3">
                        {formatDate(post.publishedAt)} | {post.authorName}
                      </p>

                      <h2 className="text-2xl font-bold text-dark mb-3">
                        {post.title}
                      </h2>

                      <p className="text-medium mb-5">
                        {post.excerpt}
                      </p>

                      <Link
                        href={`/blog/${post.slug}`}
                        className="font-bold text-primary hover:text-red-600"
                      >
                        Read More →
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
    </>
  );
};

export default BlogPage;
