import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Layout from '@/components/common/Layout';
import AuthGuard from '@/components/common/AuthGuard';
import { useAuth } from '@/hooks/useAuth';
import { productAPI } from '@/utils/api';
import { formatPrice } from '@/utils/printful';

// ################## ----- PRODUCT INTERFACE ----- ##################
interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  mockupImages: string[];
  status: 'processing' | 'completed' | 'failed';
  isActive: boolean;
  createdAt: string;
  printfulProductId?: number;
  printfulVariantId?: number;
}

// ################## ----- PRODUCTS PAGE COMPONENT ----- ##################
// Main products management page for authenticated users
// Shows all user's products with options to create, edit, or delete
// ##################################################################
const ProductsPage: React.FC = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // ################## ----- LOAD PRODUCTS ----- ##################
  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setIsLoading(true);
      setError('');
      const response = await productAPI.getAll();
      setProducts(response.data || response);
    } catch (err: any) {
      setError(err.message || 'Failed to load products');
      console.error('Failed to load products:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // ################## ----- DELETE PRODUCT ----- ##################
  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      await productAPI.delete(productId);
      setProducts(products.filter(p => p._id !== productId));
    } catch (err: any) {
      alert('Failed to delete product: ' + err.message);
    }
  };

  // ################## ----- TOGGLE PRODUCT STATUS ----- ##################
  const handleToggleStatus = async (productId: string, isActive: boolean) => {
    try {
      await productAPI.update(productId, { isActive: !isActive });
      setProducts(products.map(p => 
        p._id === productId ? { ...p, isActive: !isActive } : p
      ));
    } catch (err: any) {
      alert('Failed to update product status: ' + err.message);
    }
  };

  // ################## ----- LOADING STATE ----- ##################
  if (isLoading) {
    return (
      <AuthGuard>
        <Layout title="Products | CreatorLaunch">
          <div className="min-h-screen bg-light flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-medium">Loading products...</p>
            </div>
          </div>
        </Layout>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <Layout title="Products | CreatorLaunch">
        <div className="min-h-screen bg-light">
          <div className="container mx-auto px-4 py-8">
            <div className="max-w-6xl mx-auto">
              
              {/* Header */}
              <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-3xl font-bold text-dark mb-2">Your Products</h1>
                    <p className="text-medium">
                      Manage your product catalog and track sales performance.
                    </p>
                  </div>
                  <Link 
                    href="/products/new"
                    className="bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-red-600 transition-colors"
                  >
                    Create New Product
                  </Link>
                </div>
              </div>

              {/* Error State */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                  <p className="text-red-800">{error}</p>
                  <button 
                    onClick={loadProducts}
                    className="mt-2 text-sm text-red-600 hover:text-red-800"
                  >
                    Try Again
                  </button>
                </div>
              )}

              {/* Products Grid */}
              {products.length === 0 ? (
                <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                  <div className="max-w-md mx-auto">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-dark mb-2">No products yet</h3>
                    <p className="text-medium mb-6">
                      Create your first product to start selling on your store.
                    </p>
                    <Link 
                      href="/products/new"
                      className="bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-red-600 transition-colors inline-block"
                    >
                      Create First Product
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <div key={product._id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                      {/* Product Image */}
                      <div className="h-48 bg-gray-100 relative">
                        {product.mockupImages && product.mockupImages.length > 0 ? (
                          <img 
                            src={product.mockupImages[0]}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                        )}
                        
                        {/* Status Badge */}
                        <div className="absolute top-2 right-2">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            product.status === 'completed' ? 'bg-green-100 text-green-800' :
                            product.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {product.status}
                          </span>
                        </div>
                      </div>

                      {/* Product Details */}
                      <div className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold text-dark truncate flex-1">{product.name}</h3>
                          <span className="text-lg font-bold text-primary ml-2">
                            {formatPrice(product.price)}
                          </span>
                        </div>
                        
                        <p className="text-sm text-medium mb-4 line-clamp-2">
                          {product.description || 'No description'}
                        </p>

                        <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                          <span>Created: {new Date(product.createdAt).toLocaleDateString()}</span>
                          <span className={`px-2 py-1 rounded-full ${
                            product.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {product.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex space-x-2">
                          <Link
                            href={`/products/edit/${product._id}`}
                            className="flex-1 bg-gray-100 text-gray-700 text-center py-2 px-3 rounded text-sm font-medium hover:bg-gray-200 transition-colors"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => handleToggleStatus(product._id, product.isActive)}
                            className={`flex-1 py-2 px-3 rounded text-sm font-medium transition-colors ${
                              product.isActive 
                                ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200' 
                                : 'bg-green-100 text-green-700 hover:bg-green-200'
                            }`}
                          >
                            {product.isActive ? 'Deactivate' : 'Activate'}
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product._id)}
                            className="px-3 py-2 bg-red-100 text-red-700 rounded text-sm font-medium hover:bg-red-200 transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Quick Stats */}
              {products.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm p-6 mt-8">
                  <h3 className="text-lg font-semibold text-dark mb-4">Quick Stats</h3>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary mb-1">{products.length}</div>
                      <div className="text-sm text-medium">Total Products</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600 mb-1">
                        {products.filter(p => p.isActive).length}
                      </div>
                      <div className="text-sm text-medium">Active Products</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-yellow-600 mb-1">
                        {products.filter(p => p.status === 'processing').length}
                      </div>
                      <div className="text-sm text-medium">Processing</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600 mb-1">
                        {formatPrice(products.reduce((sum, p) => sum + (p.isActive ? p.price : 0), 0))}
                      </div>
                      <div className="text-sm text-medium">Avg Price</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </Layout>
    </AuthGuard>
  );
};

export default ProductsPage;
