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

const PublicHeader = () => {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center gap-3">
            <img
              src="/assets/header-logo.png"
              alt="CreatorLaunch"
              className="h-10 w-auto"
            />
            <span className="text-2xl font-bold text-dark">CreatorLaunch</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-dark hover:text-primary font-medium">
              Home
            </Link>
            <Link href="/about" className="text-dark hover:text-primary font-medium">
              About
            </Link>
            <Link href="/about/team" className="text-dark hover:text-primary font-medium">
              Team
            </Link>
            <Link href="/partners" className="text-dark hover:text-primary font-medium">
              Partners
            </Link>
            <Link href="/blog" className="text-primary font-bold">
              Blog
            </Link>
            <Link href="/contact" className="text-dark hover:text-primary font-medium">
              Contact
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/auth/login"
              className="hidden sm:inline-block text-dark hover:text-primary font-medium"
            >
              Login
            </Link>

            <Link
              href="/donate"
              className="bg-primary text-white px-5 py-2 rounded-lg font-bold hover:bg-red-600 transition-colors"
            >
              Donate
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

const PublicFooter = () => {
  return (
    <footer className="bg-dark text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <img
                src="/assets/header-logo.png"
                alt="CreatorLaunch"
                className="h-10 w-auto"
              />
              <span className="text-2xl font-bold">CreatorLaunch</span>
            </div>

            <p className="text-gray-300 max-w-md">
              A St. Louis nonprofit dedicated to youth entrepreneurship. Founded and run by youth.
            </p>
          </div>

          <div>
            <h3 className="font-bold mb-4">Explore</h3>
            <div className="space-y-2">
              <Link href="/about" className="block text-gray-300 hover:text-white">
                About
              </Link>
              <Link href="/about/team" className="block text-gray-300 hover:text-white">
                Team
              </Link>
              <Link href="/partners" className="block text-gray-300 hover:text-white">
                Partners
              </Link>
              <Link href="/blog" className="block text-gray-300 hover:text-white">
                Blog
              </Link>
            </div>
          </div>

          <div>
            <h3 className="font-bold mb-4">Get Involved</h3>
            <div className="space-y-2">
              <Link href="/contact" className="block text-gray-300 hover:text-white">
                Contact
              </Link>
              <Link href="/donate" className="block text-gray-300 hover:text-white">
                Donate
              </Link>
              <Link href="/auth/register" className="block text-gray-300 hover:text-white">
                Join Waitlist
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-10 pt-6 text-gray-400 text-sm">
          © 2025 CreatorLaunch, NPO.
        </div>
      </div>
    </footer>
  );
};

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

      <PublicHeader />

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

      <PublicFooter />
    </>
  );
};

export default BlogPage;
