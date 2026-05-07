import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Layout from '@/components/common/Layout';
import { productAPI } from '@/utils/api';

interface ProductVariant {
  retailPrice?: string | number;
  price?: string | number;
  mockupUrl?: string;
  mockup_url?: string;
  image?: string;
  imageUrl?: string;
  size?: string;
  color?: string;
}

interface Product {
  _id: string;
  id?: string;
  name?: string;
  title?: string;
  description?: string;
  productDescription?: string;
  price?: string | number;
  retailPrice?: string | number;
  image?: string;
  imageUrl?: string;
  thumbnail?: string;
  mockupUrl?: string;
  mockup_url?: string;
  variants?: ProductVariant[];
  status?: string;
  isActive?: boolean;
  active?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

const getProductId = (product: Product) => product._id || product.id || '';

const getProductName = (product: Product) => {
  return product.name || product.title || 'Untitled Product';
};

const getProductDescription = (product: Product) => {
  return product.description || product.productDescription || 'No description yet';
};

const getProductImage = (product: Product) => {
  return (
    product.image ||
    product.imageUrl ||
    product.thumbnail ||
    product.mockupUrl ||
    product.mockup_url ||
    product.variants?.[0]?.mockupUrl ||
    product.variants?.[0]?.mockup_url ||
    product.variants?.[0]?.image ||
    product.variants?.[0]?.imageUrl ||
    ''
  );
};

const getProductPrice = (product: Product) => {
  const rawPrice =
    product.price ??
    product.retailPrice ??
    product.variants?.[0]?.retailPrice ??
    product.variants?.[0]?.price ??
    0;

  const price = Number(rawPrice);
  return Number.isFinite(price) ? price : 0;
};

const getProductStatus = (product: Product) => {
  if (product.status) return product.status.toLowerCase();
  if (product.isActive === true || product.active === true) return 'active';
  if (product.isActive === false || product.active === false) return 'inactive';
  return 'inactive';
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

const formatDate = (date?: string) => {
  if (!date) return 'Unknown';

  const parsedDate = new Date(date);
  if (Number.isNaN(parsedDate.getTime())) return 'Unknown';

  return parsedDate.toLocaleDateString('en-US', {
    month: 'numeric',
    day: 'numeric',
    year: 'numeric',
  });
};

const truncateText = (text: string, maxLength: number) => {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trim()}...`;
};

const ProductImagePlaceholder = () => (
  <div className="w-full h-full flex items-center justify-center text-gray-400">
    <svg
      className="w-10 h-10"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
      />
    </svg>
  </div>
);

const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      setError('');

      const response = await productAPI.getAll();

      let productList: Product[] = [];
      if (Array.isArray(response)) {
        productList = response;
      } else if (Array.isArray(response?.products)) {
        productList = response.products;
      } else if (Array.isArray(response?.data)) {
        productList = response.data;
      } else if (Array.isArray(response?.data?.products)) {
        productList = response.data.products;
      }

      setProducts(productList);
    } catch (err: any) {
      console.error('Failed to load products:', err);
      setError(err?.response?.data?.message || err?.message || 'Failed to load products.');
    } finally {
      setIsLoading(false);
    }
  };

  const stats = useMemo(() => {
    const totalProducts = products.length;
    const activeProducts = products.filter((product) => getProductStatus(product) === 'active').length;
    const processingProducts = products.filter(
      (product) => getProductStatus(product) === 'processing'
    ).length;
    const avgPrice = totalProducts
      ? products.reduce((sum, product) => sum + getProductPrice(product), 0) / totalProducts
      : 0;

    return {
      totalProducts,
      activeProducts,
      processingProducts,
      avgPrice,
    };
  }, [products]);

const handleActivate = async (productId: string) => {
  const product = products.find((item) => getProductId(item) === productId);
  if (!product) return;

  const currentStatus = getProductStatus(product);
  const nextStatus = currentStatus === 'active' ? 'inactive' : 'active';

  try {
    const response = await productAPI.updateStatus(productId, {
      status: nextStatus,
      isActive: nextStatus === 'active',
    });

    const updatedProduct = response.product || response.data;

    setProducts((prev) =>
      prev.map((item) =>
        getProductId(item) === productId
          ? {
              ...item,
              ...updatedProduct,
              status: nextStatus,
              isActive: nextStatus === 'active',
            }
          : item
      )
    );
  } catch (err: any) {
    console.error('Failed to update product status:', err);
    setError(
      err?.response?.data?.message ||
        err?.message ||
        'Failed to update product status.'
    );
  }
};

  const handleDelete = async (productId: string) => {
    const confirmed = window.confirm('Are you sure you want to delete this product?');
    if (!confirmed) return;

    try {
      await productAPI.delete(productId);
      setProducts((prev) => prev.filter((product) => getProductId(product) !== productId));
    } catch (err: any) {
      console.error('Failed to delete product:', err);
      setError(err?.response?.data?.message || err?.message || 'Failed to delete product.');
    }
  };

  return (
    <Layout title="Products | CreatorLaunch">
      <div className="min-h-screen bg-light py-8">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-dark mb-2">Your Products</h1>
                <p className="text-medium">Manage your product catalog and track sales performance.</p>
              </div>

              <Link
                href="/products/new"
                className="bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-red-600 transition-colors text-center"
              >
                Create New Product
              </Link>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-600">{error}</p>
              <button
                onClick={fetchProducts}
                className="text-red-500 text-sm underline hover:no-underline mt-1"
              >
                Try again
              </button>
            </div>
          )}

          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="bg-white rounded-lg shadow-sm overflow-hidden animate-pulse">
                  <div className="h-48 bg-gray-200" />
                  <div className="p-4 space-y-3">
                    <div className="h-5 bg-gray-200 rounded w-3/4" />
                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                    <div className="h-8 bg-gray-200 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-10 text-center mb-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 13V7a2 2 0 00-2-2h-3.586a1 1 0 01-.707-.293l-1.414-1.414A1 1 0 0011.586 3H6a2 2 0 00-2 2v14a2 2 0 002 2h12a2 2 0 002-2v-6z"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-dark mb-2">No products yet</h2>
              <p className="text-medium mb-6">Create your first product to start building your store.</p>
              <Link
                href="/products/new"
                className="inline-block bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-red-600 transition-colors"
              >
                Create Your First Product
              </Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {products.map((product) => {
                const productId = getProductId(product);
                const imageUrl = getProductImage(product);
                const price = getProductPrice(product);
                const status = getProductStatus(product);
                const isActive = status === 'active';

                return (
                  <div key={productId} className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <div className="relative h-48 bg-gray-100">
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={getProductName(product)}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <ProductImagePlaceholder />
                      )}

                      <span className="absolute top-3 right-3 bg-red-50 text-red-600 text-xs px-2 py-1 rounded-full capitalize">
                        {product.status || 'published'}
                      </span>
                    </div>

                    <div className="p-4">
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <h2 className="font-semibold text-dark leading-snug">
                          {truncateText(getProductName(product), 32)}
                        </h2>
                        <p className="font-bold text-primary whitespace-nowrap">
                          {formatCurrency(price)}
                        </p>
                      </div>

                      <p className="text-medium text-sm mb-4">
                        {truncateText(getProductDescription(product), 64)}
                      </p>

                      <div className="flex items-center justify-between text-xs text-medium mb-4">
                        <span>Created: {formatDate(product.createdAt || product.updatedAt)}</span>
                        <span className="bg-gray-50 px-2 py-1 rounded-full capitalize">
                          {isActive ? 'active' : status}
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        <Link
                          href={`/products/${productId}/edit`}
                          className="bg-gray-100 text-dark text-center px-3 py-2 rounded hover:bg-gray-200 transition-colors"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleActivate(productId)}
                          className="bg-green-100 text-green-700 px-3 py-2 rounded hover:bg-green-200 transition-colors"
                        >
                          {isActive ? 'Active' : 'Activate'}
                        </button>
                        <button
                          onClick={() => handleDelete(productId)}
                          className="bg-red-50 text-red-600 px-3 py-2 rounded hover:bg-red-100 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-dark mb-6">Quick Stats</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-2xl font-bold text-primary mb-1">{stats.totalProducts}</div>
                <div className="text-sm text-medium">Total Products</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600 mb-1">{stats.activeProducts}</div>
                <div className="text-sm text-medium">Active Products</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-yellow-600 mb-1">{stats.processingProducts}</div>
                <div className="text-sm text-medium">Processing</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600 mb-1">
                  {formatCurrency(stats.avgPrice)}
                </div>
                <div className="text-sm text-medium">Avg Price</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProductsPage;
