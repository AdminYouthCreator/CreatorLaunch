import React, { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import RichTextEditor from '@/components/common/RichTextEditor';
import ImageUpload from '@/components/common/ImageUpload';
import { useBlogManagement, BlogPost } from '@/hooks/useBlogManagement';
import { FiPlus, FiEdit, FiTrash2, FiEye, FiEyeOff, FiSearch, FiFilter } from 'react-icons/fi';

const BlogManagement: React.FC = () => {
  const { 
    blogData, 
    isLoading,
    staticFileSync,
    createPost, 
    updatePost, 
    deletePost, 
    searchPosts,
    getAllCategories,
    resetToDefault,
    exportBlogData,
    importBlogData,
    generateStaticFileContent
  } = useBlogManagement();
  
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [showDataManagement, setShowDataManagement] = useState(false);
  const [importStatus, setImportStatus] = useState<string>('');

  // Handle file import
  const handleFileImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImportStatus('Importing...');
    const success = await importBlogData(file);
    
    if (success) {
      setImportStatus('Import successful!');
      setTimeout(() => setImportStatus(''), 3000);
    } else {
      setImportStatus('Import failed. Please check the file format.');
      setTimeout(() => setImportStatus(''), 5000);
    }
    
    // Reset file input
    event.target.value = '';
  };

  // Handle export
  const handleExport = () => {
    exportBlogData();
    setImportStatus('Blog data exported successfully!');
    setTimeout(() => setImportStatus(''), 3000);
  };

  // Generate static file content for manual replacement
  const handleGenerateStaticFile = () => {
    const content = generateStaticFileContent();
    const blob = new Blob([content], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'blogData.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    setImportStatus('Static file generated! Replace /public/config/blogData.json with this file.');
    setTimeout(() => setImportStatus(''), 7000);
  };

  // Filter posts based on search and filters
  const filteredPosts = React.useMemo(() => {
    let posts = blogData.posts;

    // Apply search
    if (searchQuery.trim()) {
      posts = searchPosts(searchQuery);
    }

    // Apply category filter
    if (selectedCategory) {
      posts = posts.filter(post => post.category === selectedCategory);
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      posts = posts.filter(post => 
        statusFilter === 'published' ? post.published : !post.published
      );
    }

    return posts;
  }, [blogData.posts, searchQuery, selectedCategory, statusFilter, searchPosts]);

  const categories = getAllCategories();

  const handleCreatePost = () => {
    setEditingPost(null);
    setShowCreateForm(true);
  };

  const handleEditPost = (post: BlogPost) => {
    setEditingPost(post);
    setShowCreateForm(true);
  };

  const handleDeletePost = (id: string) => {
    if (confirm('Are you sure you want to delete this blog post?')) {
      deletePost(id);
    }
  };

  const togglePublished = (post: BlogPost) => {
    updatePost(post.id, { published: !post.published });
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
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading blog data...</div>
        </div>
      </AdminLayout>
    );
  }

  if (showCreateForm) {
    return (
      <AdminLayout>
        <BlogPostForm
          post={editingPost}
          onSave={(postData) => {
            if (editingPost) {
              updatePost(editingPost.id, postData);
            } else {
              createPost(postData);
            }
            setShowCreateForm(false);
            setEditingPost(null);
          }}
          onCancel={() => {
            setShowCreateForm(false);
            setEditingPost(null);
          }}
        />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Blog Management</h1>
            <div className="flex items-center gap-4 mt-1">
              <p className="text-gray-600">
                Manage your blog posts and content
              </p>
              {/* Sync Status Indicator */}
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${
                  staticFileSync === 'available' ? 'bg-green-500' : 
                  staticFileSync === 'unavailable' ? 'bg-yellow-500' : 'bg-gray-400'
                }`}></div>
                <span className={`text-xs ${
                  staticFileSync === 'available' ? 'text-green-600' : 
                  staticFileSync === 'unavailable' ? 'text-yellow-600' : 'text-gray-500'
                }`}>
                  {staticFileSync === 'available' ? 'Auto-sync enabled' : 
                   staticFileSync === 'unavailable' ? 'Manual export required' : 'Checking...'}
                </span>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowDataManagement(true)}
              className="px-4 py-2 text-sm border border-blue-300 text-blue-600 rounded-lg hover:bg-blue-50"
            >
              Data Management
            </button>
            <button
              onClick={() => resetToDefault()}
              className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Reset to Default
            </button>
            <button
              onClick={handleCreatePost}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <FiPlus size={16} />
              New Post
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="text-2xl font-bold text-gray-900">
              {blogData.posts.length}
            </div>
            <div className="text-gray-600">Total Posts</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="text-2xl font-bold text-green-600">
              {blogData.posts.filter(p => p.published).length}
            </div>
            <div className="text-gray-600">Published</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="text-2xl font-bold text-yellow-600">
              {blogData.posts.filter(p => !p.published).length}
            </div>
            <div className="text-gray-600">Drafts</div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search posts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Category Filter */}
            <div className="relative">
              <FiFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as 'all' | 'published' | 'draft')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Posts</option>
              <option value="published">Published</option>
              <option value="draft">Drafts</option>
            </select>
          </div>
        </div>

        {/* Blog Posts Table */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold">All Blog Posts</h2>
          </div>
          
          {filteredPosts.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              {searchQuery || selectedCategory || statusFilter !== 'all' ? (
                <>
                  <div className="text-lg mb-2">No posts match your filters</div>
                  <div className="text-sm">Try adjusting your search or filters</div>
                </>
              ) : (
                <>
                  <div className="text-lg mb-2">No blog posts yet</div>
                  <div className="text-sm">Create your first blog post to get started</div>
                </>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left p-4 font-medium text-gray-700">Title</th>
                    <th className="text-left p-4 font-medium text-gray-700">Category</th>
                    <th className="text-left p-4 font-medium text-gray-700">Author</th>
                    <th className="text-left p-4 font-medium text-gray-700">Date</th>
                    <th className="text-left p-4 font-medium text-gray-700">Status</th>
                    <th className="text-left p-4 font-medium text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPosts.map((post) => (
                    <tr key={post.id} className="border-b hover:bg-gray-50">
                      <td className="p-4">
                        <div>
                          <div className="font-medium text-gray-900">
                            {post.title}
                          </div>
                          <div className="text-sm text-gray-500 mt-1">
                            {post.excerpt.slice(0, 80)}...
                          </div>
                          {post.readTime && (
                            <div className="text-xs text-gray-400 mt-1">
                              {post.readTime} min read
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {post.category}
                        </span>
                      </td>
                      <td className="p-4 text-gray-700">{post.author}</td>
                      <td className="p-4 text-gray-700">{formatDate(post.date)}</td>
                      <td className="p-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          post.published 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {post.published ? 'Published' : 'Draft'}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => togglePublished(post)}
                            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded"
                            title={post.published ? 'Unpublish' : 'Publish'}
                          >
                            {post.published ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                          </button>
                          <button
                            onClick={() => handleEditPost(post)}
                            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded"
                            title="Edit"
                          >
                            <FiEdit size={16} />
                          </button>
                          <button
                            onClick={() => handleDeletePost(post.id)}
                            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded"
                            title="Delete"
                          >
                            <FiTrash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Import Status Message */}
        {importStatus && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-blue-700">{importStatus}</p>
          </div>
        )}

        {/* Data Management Modal */}
        {showDataManagement && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">Data Management</h2>
              
              <div className="space-y-4">
                {/* Export Current Data */}
                <div>
                  <h3 className="font-medium mb-2">Export Blog Data</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Download all current blog posts and settings as a backup.
                  </p>
                  <button
                    onClick={handleExport}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Export Data
                  </button>
                </div>

                {/* Generate Static File */}
                <div>
                  <h3 className="font-medium mb-2">Generate Static File</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Generate a new blogData.json file to replace the static file in /public/config/
                  </p>
                  <button
                    onClick={handleGenerateStaticFile}
                    className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    Generate Static File
                  </button>
                </div>

                {/* Force Reload */}
                <div>
                  <h3 className="font-medium mb-2">Force Reload from Static File</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Clear localStorage and reload fresh data from static file
                  </p>
                  <button
                    onClick={() => {
                      localStorage.removeItem('creatorlaunch_blog_data');
                      window.location.reload();
                    }}
                    className="w-full px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
                  >
                    Force Reload
                  </button>
                </div>

                {/* Import Data */}
                <div>
                  <h3 className="font-medium mb-2">Import Blog Data</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Upload a blog data file to import posts and settings.
                  </p>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleFileImport}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="flex justify-end mt-6">
                <button
                  onClick={() => setShowDataManagement(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

// Blog Post Form Component
interface BlogPostFormProps {
  post?: BlogPost | null;
  onSave: (postData: Omit<BlogPost, 'id'>) => void;
  onCancel: () => void;
}

const BlogPostForm: React.FC<BlogPostFormProps> = ({ post, onSave, onCancel }) => {
  const { generateSlug, getAllCategories } = useBlogManagement();
  const [formData, setFormData] = useState({
    title: post?.title || '',
    excerpt: post?.excerpt || '',
    content: post?.content || '',
    author: post?.author || 'Admin',
    slug: post?.slug || '',
    published: post?.published || false,
    featuredImage: post?.featuredImage || '',
    tags: post?.tags?.join(', ') || '',
    metaDescription: post?.metaDescription || '',
    category: post?.category || ''
  });

  const availableCategories = ['Entrepreneurship', 'Youth Development', 'Workshops', 'Success Stories', 'Business Tips', 'Community'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const slug = formData.slug || generateSlug(formData.title);
    
    onSave({
      title: formData.title,
      excerpt: formData.excerpt,
      content: formData.content,
      author: formData.author,
      slug,
      published: formData.published,
      featuredImage: formData.featuredImage,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      metaDescription: formData.metaDescription,
      category: formData.category,
      date: post?.date || new Date().toISOString().split('T')[0]
    });
  };

  const updateSlugFromTitle = () => {
    if (!formData.slug && formData.title) {
      setFormData(prev => ({
        ...prev,
        slug: generateSlug(formData.title)
      }));
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {post ? 'Edit Blog Post' : 'Create New Blog Post'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="max-w-4xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                onBlur={updateSlugFromTitle}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter blog post title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Excerpt *
              </label>
              <textarea
                required
                rows={3}
                value={formData.excerpt}
                onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Brief description of the blog post"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content *
              </label>
              <RichTextEditor
                value={formData.content}
                onChange={(content) => setFormData(prev => ({ ...prev, content }))}
                placeholder="Write your blog post content..."
                height="400px"
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg border">
              <h3 className="text-lg font-medium mb-4">Publish Settings</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.published}
                      onChange={(e) => setFormData(prev => ({ ...prev, published: e.target.checked }))}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm font-medium text-gray-700">
                      Publish immediately
                    </span>
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    required
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select a category</option>
                    {availableCategories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Author
                  </label>
                  <input
                    type="text"
                    value={formData.author}
                    onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Slug
                  </label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="auto-generated-from-title"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border">
              <h3 className="text-lg font-medium mb-4">SEO & Meta</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Meta Description
                  </label>
                  <textarea
                    rows={3}
                    value={formData.metaDescription}
                    onChange={(e) => setFormData(prev => ({ ...prev, metaDescription: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="SEO description for search engines"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Featured Image
                  </label>
                  <ImageUpload
                    value={formData.featuredImage}
                    onChange={(url) => setFormData(prev => ({ ...prev, featuredImage: url }))}
                    label=""
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tags
                  </label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="entrepreneurship, business, workshop"
                  />
                  <p className="text-xs text-gray-500 mt-1">Separate tags with commas</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center mt-8 pt-6 border-t">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          
          <div className="flex gap-3">
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              {post ? 'Update Post' : 'Create Post'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default BlogManagement;
