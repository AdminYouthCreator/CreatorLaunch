import React, { useEffect, useState } from 'react';
import Layout from '@/components/common/Layout';
import Link from 'next/link';
import { useBlogManagement, BlogPost } from '@/hooks/useBlogManagement';

// ################## ----- BLOG PAGE COMPONENT ----- ##################
// Main blog listing page showing featured articles
// Displays blog posts in a responsive grid layout
// ##########################################################
const BlogPage: React.FC = () => {
  const { blogData, isLoading, getAllCategories, getPublishedPosts, reload } = useBlogManagement();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  // Ensure data is fresh when component mounts or when returning from other pages
  useEffect(() => {
    reload();
  }, []);

  // Get published posts and categories from the hook
  const blogPosts = getPublishedPosts();
  const categories = getAllCategories();

  // Filter posts based on search and category
  const filteredPosts = React.useMemo(() => {
    let posts = blogPosts;

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      posts = posts.filter(post => 
        post.title.toLowerCase().includes(query) ||
        post.excerpt.toLowerCase().includes(query) ||
        post.tags.some(tag => tag.toLowerCase().includes(query)) ||
        (post.category && post.category.toLowerCase().includes(query))
      );
    }

    if (selectedCategory) {
      posts = posts.filter(post => post.category === selectedCategory);
    }

    return posts;
  }, [blogPosts, searchQuery, selectedCategory]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Layout
      title="Blog | CreatorLaunch"
      description="CreatorLaunch blog for entrepreneurship tips, program updates, and community stories."
    >
      {/* Hero Section */}
      <section className="bg-primary text-white py-20 sm:py-28">
        <div className="container mx-auto px-6 text-center" data-aos="fade-up">
          <h1 className="text-5xl sm:text-6xl font-black">CreatorLaunch Insights</h1>
          <p className="text-lg sm:text-xl font-light mt-4 max-w-2xl mx-auto text-red-200">
            Our blog for entrepreneurship tips, program updates, and community stories.
          </p>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search blog posts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <svg 
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          {/* Active Filters */}
          {(searchQuery || selectedCategory) && (
            <div className="mt-4 flex flex-wrap gap-2">
              {searchQuery && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                  Search: "{searchQuery}"
                  <button
                    onClick={() => setSearchQuery('')}
                    className="ml-2 text-blue-600 hover:text-blue-800"
                  >
                    ×
                  </button>
                </span>
              )}
              {selectedCategory && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
                  Category: {selectedCategory}
                  <button
                    onClick={() => setSelectedCategory('')}
                    className="ml-2 text-green-600 hover:text-green-800"
                  >
                    ×
                  </button>
                </span>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-20 sm:py-28">
        <div className="container mx-auto px-6 max-w-6xl">
          {isLoading ? (
            <div className="text-center py-20">
              <div className="text-lg text-gray-600">Loading blog posts...</div>
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="text-center py-20">
              {searchQuery || selectedCategory ? (
                <>
                  <div className="text-lg text-gray-600 mb-4">No posts match your search.</div>
                  <p className="text-gray-500">Try adjusting your search terms or browse all posts.</p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('');
                    }}
                    className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Clear Filters
                  </button>
                </>
              ) : (
                <>
                  <div className="text-lg text-gray-600 mb-4">No blog posts available yet.</div>
                  <p className="text-gray-500">Check back soon for new content!</p>
                </>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-center">
              {filteredPosts.map((post, index) => (
                <div
                  key={post.id}
                  className="blog-post-card"
                  data-aos="fade-up"
                  data-aos-delay={100 * (index + 1)}
                >
                  {post.featuredImage && (
                    <img
                      src={post.featuredImage}
                      alt={post.title}
                      className="w-full h-48 object-cover rounded-lg mb-4"
                    />
                  )}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {post.category}
                      </span>
                      {post.readTime && (
                        <span className="text-xs text-gray-500">
                          {post.readTime} min read
                        </span>
                      )}
                    </div>
                    <h3 className="text-2xl font-bold mb-3">{post.title}</h3>
                    <p className="text-sm text-gray-500 mb-4">
                      {formatDate(post.date)} | {post.author}
                    </p>
                    <p className="text-medium leading-relaxed flex-grow">
                      {post.excerpt}
                    </p>
                    {post.tags && post.tags.length > 0 && (
                      <div className="mt-4">
                        <div className="flex flex-wrap gap-1">
                          {post.tags.slice(0, 3).map((tag, tagIndex) => (
                            <span
                              key={tagIndex}
                              className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded"
                            >
                              #{tag}
                            </span>
                          ))}
                          {post.tags.length > 3 && (
                            <span className="text-xs text-gray-500">
                              +{post.tags.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="mt-6 inline-flex items-center font-bold text-accent hover:underline"
                  >
                    Read More 
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="h-4 w-4 ml-1" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth="2" 
                        d="M9 5l7 7-7 7" 
                      />
                    </svg>
                  </Link>
                </div>
              ))}
            </div>
          )}
          
          <div className="text-center mt-16" data-aos="fade-up">
            <p className="text-medium text-lg">More insights and stories coming soon!</p>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default BlogPage;
