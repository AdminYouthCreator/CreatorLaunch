import React from 'react';
import Link from 'next/link';
import Layout from '@/components/common/Layout';
import { blogPosts } from '@/data/blogPosts';

const BlogIndexPage = () => {
  const featuredPost = blogPosts[0];
  const remainingPosts = blogPosts.slice(1);

  return (
    <Layout title="Blog | CreatorLaunch">
      <main className="min-h-screen bg-white">
        <section className="bg-gradient-to-br from-white via-red-50 to-orange-50 py-20">
          <div className="container mx-auto px-4 text-center">
            <p className="text-primary font-semibold mb-3">
              Stories from the launchpad.
            </p>
            <h1 className="text-4xl md:text-6xl font-bold text-dark mb-6">
              CreatorLaunch Blog
            </h1>
            <p className="text-lg md:text-xl text-medium max-w-3xl mx-auto">
              Updates, founder notes, workshop insights, and stories about youth
              entrepreneurship, launch capital, and building real ventures.
            </p>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              {featuredPost && (
                <Link
                  href={`/blog/${featuredPost.slug}`}
                  className="block bg-dark text-white rounded-2xl p-8 md:p-10 mb-10 hover:shadow-lg transition-shadow"
                >
                  <div className="max-w-3xl">
                    <p className="text-red-200 font-semibold mb-3">
                      Featured Post
                    </p>
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                      {featuredPost.title}
                    </h2>
                    <p className="text-gray-300 mb-4">
                      {featuredPost.displayDate} | {featuredPost.author}
                    </p>
                    <p className="text-lg text-gray-100 mb-6">
                      {featuredPost.excerpt}
                    </p>
                    <span className="inline-block bg-primary text-white px-5 py-3 rounded-lg font-semibold">
                      Read More
                    </span>
                  </div>
                </Link>
              )}

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {remainingPosts.map((post) => (
                  <Link
                    key={post.slug}
                    href={`/blog/${post.slug}`}
                    className="bg-light rounded-2xl p-6 border border-gray-100 hover:shadow-md transition-shadow"
                  >
                    <p className="text-sm text-primary font-semibold mb-3">
                      {post.displayDate}
                    </p>
                    <h2 className="text-xl font-bold text-dark mb-3">
                      {post.title}
                    </h2>
                    <p className="text-sm text-medium mb-3">
                      {post.author}
                    </p>
                    <p className="text-medium mb-5">
                      {post.excerpt}
                    </p>
                    <span className="text-primary font-semibold">
                      Read More →
                    </span>
                  </Link>
                ))}
              </div>

              <div className="text-center mt-14">
                <p className="text-medium text-lg">
                  More insights and stories coming soon!
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
};

export default BlogIndexPage;
