import React from 'react';
import Link from 'next/link';
import { GetStaticPaths, GetStaticProps } from 'next';
import Layout from '@/components/common/Layout';
import { blogPosts, BlogPost, getBlogPostBySlug } from '@/data/blogPosts';

interface BlogPostPageProps {
  post: BlogPost | null;
}

const BlogPostPage: React.FC<BlogPostPageProps> = ({ post }) => {
  if (!post) {
    return (
      <Layout title="Post Not Found | CreatorLaunch">
        <main className="min-h-screen bg-light py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold text-dark mb-4">
              Post Not Found
            </h1>
            <p className="text-medium mb-8">
              The blog post you are looking for does not exist.
            </p>
            <Link
              href="/blog"
              className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-600 transition-colors"
            >
              Back to Blog
            </Link>
          </div>
        </main>
      </Layout>
    );
  }

  return (
    <Layout title={`${post.title} | CreatorLaunch Blog`}>
      <main className="min-h-screen bg-white">
        <section className="bg-gradient-to-br from-white via-red-50 to-orange-50 py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <Link
                href="/blog"
                className="text-primary font-semibold hover:text-red-600 transition-colors"
              >
                ← Back to Blog
              </Link>

              <h1 className="text-4xl md:text-5xl font-bold text-dark mt-6 mb-4">
                {post.title}
              </h1>

              <p className="text-medium text-lg">
                {post.displayDate} | {post.author}
              </p>
            </div>
          </div>
        </section>

        <article className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <div className="prose prose-lg max-w-none">
                {post.content.map((paragraph, index) => (
                  <p key={index} className="text-lg text-medium leading-relaxed mb-6">
                    {paragraph}
                  </p>
                ))}
              </div>

              {post.ctaText && post.ctaHref && (
                <div className="mt-12 bg-light rounded-2xl p-8 border border-gray-100 text-center">
                  <h2 className="text-2xl font-bold text-dark mb-4">
                    Ready to take the next step?
                  </h2>
                  <p className="text-medium mb-6">
                    CreatorLaunch helps young founders move from idea to action.
                  </p>
                  <Link
                    href={post.ctaHref}
                    className="inline-block bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-600 transition-colors"
                  >
                    {post.ctaText}
                  </Link>
                </div>
              )}
            </div>
          </div>
        </article>
      </main>
    </Layout>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: blogPosts.map((post) => ({
      params: { slug: post.slug },
    })),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<BlogPostPageProps> = async (context) => {
  const slug = context.params?.slug as string;
  const post = getBlogPostBySlug(slug) || null;

  return {
    props: {
      post,
    },
  };
};

export default BlogPostPage;
