import React, { useEffect, useState } from 'react';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import Layout from '@/components/common/Layout';
import Link from 'next/link';
import { BlogPost } from '@/hooks/useBlogManagement';
import { FiArrowLeft, FiCalendar, FiUser, FiTag } from 'react-icons/fi';

interface BlogPostPageProps {
  slug: string;
  initialPost?: BlogPost;
}

const BlogPostPage: React.FC<BlogPostPageProps> = ({ slug, initialPost }) => {
  const router = useRouter();
  const [post, setPost] = useState<BlogPost | null>(initialPost || null);
  const [isLoading, setIsLoading] = useState(!initialPost);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    // If we don't have an initial post (404 from server), try loading from localStorage
    if (!initialPost) {
      loadBlogPostFromStorage(slug);
    } else {
      // Check for updated version in localStorage
      const localData = localStorage.getItem('creatorlaunch_blog_data');
      if (localData) {
        try {
          const blogData = JSON.parse(localData);
          const updatedPost = blogData.posts.find((p: BlogPost) => 
            p.slug === slug && p.published
          );
          if (updatedPost) {
            setPost(updatedPost);
          }
        } catch (parseError) {
          console.error('Error parsing localStorage data:', parseError);
          localStorage.removeItem('creatorlaunch_blog_data');
        }
      }
    }
  }, [slug, initialPost]);

  const loadBlogPostFromStorage = async (postSlug: string) => {
    try {
      setIsLoading(true);
      setNotFound(false);
      
      // Try to get from localStorage first (for new posts)
      const localData = localStorage.getItem('creatorlaunch_blog_data');
      let blogData = null;
      
      if (localData) {
        try {
          blogData = JSON.parse(localData);
        } catch (parseError) {
          console.error('Error parsing localStorage data:', parseError);
          localStorage.removeItem('creatorlaunch_blog_data');
        }
      }
      
      if (!blogData) {
        // Fallback to static JSON file
        const response = await fetch('/config/blogData.json');
        if (response.ok) {
          blogData = await response.json();
        }
      }

      if (blogData && blogData.posts) {
        const foundPost = blogData.posts.find((p: BlogPost) => 
          p.slug === postSlug && p.published
        );
        
        if (foundPost) {
          setPost(foundPost);
        } else {
          setNotFound(true);
        }
      } else {
        setNotFound(true);
      }
    } catch (error) {
      console.error('Error loading blog post:', error);
      setNotFound(true);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <Layout title="Loading... | CreatorLaunch Blog">
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="text-lg text-gray-600">Loading blog post...</div>
          </div>
        </div>
      </Layout>
    );
  }

  if (notFound || !post) {
    return (
      <Layout title="Blog Post Not Found | CreatorLaunch">
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Post Not Found</h1>
            <p className="text-gray-600 mb-8">The blog post you're looking for doesn't exist or has been removed.</p>
            <Link
              href="/blog"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <FiArrowLeft className="mr-2" />
              Back to Blog
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout
      title={`${post.title} | CreatorLaunch Blog`}
      description={post.metaDescription || post.excerpt}
    >
      {/* Header Navigation */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-6 py-4">
          <Link
            href="/blog"
            className="inline-flex items-center text-blue-600 hover:text-blue-700"
          >
            <FiArrowLeft className="mr-2" />
            Back to Blog
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-primary text-white py-16 sm:py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center" data-aos="fade-up">
            <h1 className="text-4xl sm:text-5xl font-black mb-6">
              {post.title}
            </h1>
            
            {/* Meta Information */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-red-200 mb-6">
              <div className="flex items-center">
                <FiCalendar className="mr-2" />
                {formatDate(post.date)}
              </div>
              <div className="flex items-center">
                <FiUser className="mr-2" />
                {post.author}
              </div>
              <div className="flex items-center">
                <FiTag className="mr-2" />
                {post.category}
              </div>
              {post.readTime && (
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {post.readTime} min read
                </div>
              )}
            </div>

            <p className="text-lg sm:text-xl font-light max-w-2xl mx-auto">
              {post.excerpt}
            </p>
          </div>
        </div>
      </section>

      {/* Featured Image */}
      {post.featuredImage && (
        <section className="py-0">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <img
                src={post.featuredImage}
                alt={post.title}
                className="w-full h-64 sm:h-96 object-cover rounded-lg shadow-lg"
                data-aos="fade-up"
              />
            </div>
          </div>
        </section>
      )}

      {/* Blog Content */}
      <section className="py-16 sm:py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <article 
              className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-4"
              data-aos="fade-up"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Fallback content styling if prose doesn't work */}
            <style jsx>{`
              article h1, article h2, article h3, article h4, article h5, article h6 {
                font-weight: bold;
                margin: 1.5em 0 0.5em 0;
                color: #1a202c;
              }
              article h1 { font-size: 2em; }
              article h2 { font-size: 1.5em; }
              article h3 { font-size: 1.25em; }
              article p {
                margin-bottom: 1em;
                line-height: 1.6;
                color: #4a5568;
              }
              article ul, article ol {
                margin: 1em 0;
                padding-left: 1.5em;
              }
              article li {
                margin-bottom: 0.5em;
              }
            `}</style>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="mt-12 pt-8 border-t" data-aos="fade-up">
                <h3 className="text-lg font-semibold mb-4">Tags:</h3>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Back to Blog */}
            <div className="mt-12 pt-8 border-t text-center" data-aos="fade-up">
              <Link
                href="/blog"
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <FiArrowLeft className="mr-2" />
                Back to All Posts
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-gray-50 py-16 sm:py-20">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-2xl mx-auto" data-aos="fade-up">
            <h2 className="text-3xl font-bold mb-4">Ready to Start Your Journey?</h2>
            <p className="text-gray-600 mb-8">
              Join CreatorLaunch and turn your creative ideas into a thriving business.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/workshops"
                className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                View Workshops
              </Link>
              <Link
                href="/get-involved"
                className="px-8 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
              >
                Get Involved
              </Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { slug } = context.params!;
  
  try {
    // Load blog data from the static JSON file
    const fs = require('fs');
    const path = require('path');
    const filePath = path.join(process.cwd(), 'public', 'config', 'blogData.json');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const blogData = JSON.parse(fileContents);
    
    // Find the post by slug
    const post = blogData.posts.find((p: any) => 
      p.slug === slug && p.published
    );
    
    // If post exists in static file, return it
    if (post) {
      return {
        props: {
          slug: slug as string,
          initialPost: post,
        },
      };
    }
    
    // If post doesn't exist in static file, let client-side handle it
    // (it might be a new post stored only in localStorage)
    return {
      props: {
        slug: slug as string,
      },
    };
  } catch (error) {
    console.error('Error loading blog post:', error);
    // Don't return 404, let client-side try to load it
    return {
      props: {
        slug: slug as string,
      },
    };
  }
};

export default BlogPostPage;
