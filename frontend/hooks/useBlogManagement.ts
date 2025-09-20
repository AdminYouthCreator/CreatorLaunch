import { useState, useEffect } from 'react';

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  author: string;
  slug: string;
  published: boolean;
  featuredImage: string;
  tags: string[];
  metaDescription: string;
  category: string;
  readTime?: number;
}

export interface BlogData {
  posts: BlogPost[];
  categories?: string[];
}

const BLOG_STORAGE_KEY = 'creatorlaunch_blog_data';

export const useBlogManagement = () => {
  const [blogData, setBlogData] = useState<BlogData>({ posts: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [staticFileSync, setStaticFileSync] = useState<'unknown' | 'available' | 'unavailable'>('unknown');

  // Load initial data
  useEffect(() => {
    loadBlogData();
  }, []);

  const loadBlogData = async () => {
    try {
      setIsLoading(true);
      
      // Always load from static file first to get the latest data
      let staticData = null;
      try {
        const response = await fetch('/config/blogData.json');
        if (response.ok) {
          staticData = await response.json();
        }
      } catch (fetchError) {
        console.warn('Could not fetch static file:', fetchError);
      }
      
      // Then check localStorage for any newer edits
      const localData = localStorage.getItem(BLOG_STORAGE_KEY);
      let localParsedData = null;
      
      if (localData) {
        try {
          localParsedData = JSON.parse(localData);
          // Validate data structure
          if (!localParsedData || !localParsedData.posts || !Array.isArray(localParsedData.posts)) {
            console.warn('Invalid localStorage data structure, clearing...');
            localStorage.removeItem(BLOG_STORAGE_KEY);
            localParsedData = null;
          }
        } catch (parseError) {
          console.error('Error parsing localStorage data, clearing it:', parseError);
          localStorage.removeItem(BLOG_STORAGE_KEY);
          localParsedData = null;
        }
      }
      
      // Use the data source with more posts or more recent updates
      let finalData = staticData;
      
      if (localParsedData && staticData) {
        console.log(`📊 Data comparison - Static: ${staticData.posts.length} posts, localStorage: ${localParsedData.posts.length} posts`);
        // If localStorage has more posts or newer posts, use it
        if (localParsedData.posts.length >= staticData.posts.length) {
          finalData = localParsedData;
          console.log('✅ Using localStorage data (more posts)');
        } else {
          console.log('✅ Using static file data (more posts)');
        }
      } else if (localParsedData) {
        console.log('✅ Using localStorage data (static unavailable)');
        finalData = localParsedData;
      } else {
        console.log('✅ Using static file data (localStorage unavailable)');
      }
      
      if (finalData && finalData.posts && Array.isArray(finalData.posts)) {
        console.log(`🎉 Final data loaded: ${finalData.posts.length} posts`);
        setBlogData(finalData);
        // Always sync localStorage with the current data
        localStorage.setItem(BLOG_STORAGE_KEY, JSON.stringify(finalData));
      } else {
        console.error('No valid blog data found');
        setBlogData({ posts: [], categories: [] });
      }
    } catch (error) {
      console.error('Error loading blog data:', error);
      setBlogData({ posts: [], categories: [] });
    } finally {
      setIsLoading(false);
    }
  };

  const saveBlogData = async (data: BlogData) => {
    try {
      setBlogData(data);
      localStorage.setItem(BLOG_STORAGE_KEY, JSON.stringify(data));
      
      // Also update static file via API (if available)
      try {
        const response = await fetch('/api/blog-posts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
        
        if (response.ok) {
          setStaticFileSync('available');
          console.log('✅ Static file updated successfully - posts are now permanent!');
        } else {
          setStaticFileSync('unavailable');
          const errorText = await response.text();
          console.warn('⚠️ Failed to update static file:', errorText);
        }
      } catch (apiError) {
        setStaticFileSync('unavailable');
        console.warn('⚠️ API not available - using localStorage only:', apiError);
      }
    } catch (error) {
      console.error('Error saving blog data:', error);
      // Try to recover by at least saving to localStorage
      try {
        localStorage.setItem(BLOG_STORAGE_KEY, JSON.stringify(data));
      } catch (localError) {
        console.error('Failed to save to localStorage:', localError);
      }
    }
  };

  const createPost = (post: Omit<BlogPost, 'id'>) => {
    const readTime = calculateReadTime(post.content);
    const newPost: BlogPost = {
      ...post,
      id: Date.now().toString(),
      date: post.date || new Date().toISOString().split('T')[0],
      readTime
    };

    console.log('Creating new post:', newPost); // Debug logging

    const updatedData = {
      ...blogData,
      posts: [newPost, ...blogData.posts]
    };

    saveBlogData(updatedData);
    return newPost;
  };

  const updatePost = (id: string, updates: Partial<BlogPost>) => {
    const updatedPosts = blogData.posts.map(post =>
      post.id === id ? { ...post, ...updates } : post
    );

    const updatedData = {
      ...blogData,
      posts: updatedPosts
    };

    saveBlogData(updatedData);
  };

  const deletePost = (id: string) => {
    const updatedPosts = blogData.posts.filter(post => post.id !== id);
    
    const updatedData = {
      ...blogData,
      posts: updatedPosts
    };

    saveBlogData(updatedData);
  };

  const getPostBySlug = (slug: string): BlogPost | undefined => {
    return blogData.posts.find(post => post.slug === slug);
  };

  const getPublishedPosts = (): BlogPost[] => {
    return blogData.posts.filter(post => post.published);
  };

  const getPostsByCategory = (category: string): BlogPost[] => {
    return blogData.posts.filter(post => 
      post.published && post.category === category
    );
  };

  const getAllCategories = (): string[] => {
    try {
      // Get categories from posts
      const postCategories = blogData.posts
        .map(post => post.category)
        .filter(Boolean);
      
      // Get predefined categories from blogData if available
      const predefinedCategories = (blogData as any).categories || [];
      
      // Combine and deduplicate
      const allCategories = [...predefinedCategories, ...postCategories];
      return Array.from(new Set(allCategories));
    } catch (error) {
      console.error('Error getting categories:', error);
      return [];
    }
  };

  const searchPosts = (query: string): BlogPost[] => {
    const lowerQuery = query.toLowerCase();
    return blogData.posts.filter(post => 
      post.published && (
        post.title.toLowerCase().includes(lowerQuery) ||
        post.excerpt.toLowerCase().includes(lowerQuery) ||
        post.content.toLowerCase().includes(lowerQuery) ||
        post.tags.some(tag => tag.toLowerCase().includes(lowerQuery)) ||
        (post.category && post.category.toLowerCase().includes(lowerQuery))
      )
    );
  };

  const calculateReadTime = (content: string): number => {
    const wordsPerMinute = 200;
    const words = content.replace(/<[^>]*>/g, '').split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
  };

  const generateSlug = (title: string): string => {
    const baseSlug = title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
    
    // Check if slug already exists and add number if needed
    let slug = baseSlug;
    let counter = 1;
    
    while (blogData.posts.some(post => post.slug === slug)) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }
    
    return slug;
  };

  const resetToDefault = async () => {
    localStorage.removeItem(BLOG_STORAGE_KEY);
    await loadBlogData();
  };

  // Export current blog data as JSON file for download
  const exportBlogData = () => {
    const dataToExport = {
      posts: blogData.posts,
      categories: getAllCategories(),
      exportDate: new Date().toISOString(),
      version: "1.0"
    };
    
    const dataStr = JSON.stringify(dataToExport, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `blogData-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    return dataToExport;
  };

  // Import blog data from uploaded JSON file
  const importBlogData = async (file: File): Promise<boolean> => {
    try {
      const text = await file.text();
      const importedData = JSON.parse(text);
      
      // Validate the imported data structure
      if (!importedData.posts || !Array.isArray(importedData.posts)) {
        throw new Error('Invalid blog data format: missing posts array');
      }
      
      // Validate each post has required fields
      for (const post of importedData.posts) {
        if (!post.id || !post.title || !post.slug || !post.content) {
          throw new Error(`Invalid post format: missing required fields in post "${post.title || 'unknown'}"`);
        }
      }
      
      // Merge with existing data (imported data takes precedence)
      const mergedData: BlogData = {
        posts: importedData.posts,
        categories: importedData.categories || getAllCategories()
      };
      
      saveBlogData(mergedData);
      return true;
    } catch (error) {
      console.error('Error importing blog data:', error);
      return false;
    }
  };

  // Sync localStorage data to static file format (for manual replacement)
  const generateStaticFileContent = () => {
    const staticData = {
      posts: blogData.posts.map(post => ({
        ...post,
        // Ensure all required fields are present
        id: post.id,
        title: post.title,
        excerpt: post.excerpt,
        content: post.content,
        date: post.date,
        author: post.author,
        slug: post.slug,
        published: post.published,
        featuredImage: post.featuredImage || "",
        tags: post.tags || [],
        metaDescription: post.metaDescription || post.excerpt,
        category: post.category,
        readTime: post.readTime || calculateReadTime(post.content)
      })),
      categories: getAllCategories()
    };
    
    return JSON.stringify(staticData, null, 2);
  };

  return {
    blogData,
    isLoading,
    staticFileSync,
    createPost,
    updatePost,
    deletePost,
    getPostBySlug,
    getPublishedPosts,
    getPostsByCategory,
    getAllCategories,
    searchPosts,
    calculateReadTime,
    generateSlug,
    resetToDefault,
    exportBlogData,
    importBlogData,
    generateStaticFileContent,
    reload: loadBlogData
  };
};
