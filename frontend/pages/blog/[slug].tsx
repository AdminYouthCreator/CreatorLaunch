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

        <PublicHeader />

        <main className="min-h-screen flex items-center justify-center bg-light">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </main>

        <PublicFooter />
      </>
    );
  }

  if (error || !post) {
    return (
      <>
        <Head>
          <title>Blog Post Not Found | CreatorLaunch</title>
        </Head>

        <PublicHeader />

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

        <PublicFooter />
      </>
    );
  }

  return (
    <>
      <Head>
        <title>{post.seoTitle || post.title} | CreatorLaunch</title>
        <meta name="description" content={post.seoDescription || post.excerpt} />
      </Head>

      <PublicHeader />

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

      <PublicFooter />
    </>
  );
};

export default BlogPostPage;
