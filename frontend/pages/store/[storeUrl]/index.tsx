import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import StoreLayout from '@/components/store/StoreLayout';
import { storeAPI } from '@/utils/api';
import { useCartContext } from '@/context/CartContext';

interface StoreInfo {
  _id: string;
  brandName: string;
  subdomain: string;
  description: string;
  logoUrl: string | null;
  owner: string;
}

interface ProductVariant {
  retailPrice: number;
  price?: number;
  size?: string;
  color?: string;
  mockupUrl?: string;
  imageUrl?: string;
  printfulVariantId?: number;
  baseCost?: number;
}

interface Product {
  _id: string;
  id?: string;
  name: string;
  description?: string;
  price?: number;
  retailPrice?: number;
  imageUrl?: string;
  mockupUrl?: string;
  status?: string;
  variants: ProductVariant[];
}

interface Service {
  _id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  deliveryTime: string;
  revisions: number;
  status: string;
}

interface StoreData {
  store: StoreInfo;
  products: Product[];
  services: Service[];
}

const getProductImage = (product: Product) => {
  const firstVariant = product.variants?.[0] || {};

  return (
    product.imageUrl ||
    product.mockupUrl ||
    firstVariant.mockupUrl ||
    firstVariant.imageUrl ||
    ''
  );
};

const getProductPrice = (product: Product) => {
  const firstVariant = product.variants?.[0] || {};

  const rawPrice =
    product.price ??
    product.retailPrice ??
    firstVariant.retailPrice ??
    firstVariant.price ??
    0;

  const price = Number(rawPrice);
  return Number.isFinite(price) ? price : 0;
};

const StorePage: React.FC = () => {
  const router = useRouter();
  const { storeUrl } = router.query;
  const { addItem } = useCartContext();

  const [data, setData] = useState<StoreData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'products' | 'services'>('products');

  useEffect(() => {
    if (!storeUrl || typeof storeUrl !== 'string') return;

    loadStore(storeUrl);
  }, [storeUrl]);

  const loadStore = async (subdomain: string) => {
    try {
      setLoading(true);
      setError('');

      const response = await storeAPI.getStore(subdomain);
      setData(response);
    } catch (err: any) {
      console.error('Failed to load store:', err);
      setError(err?.response?.data?.message || 'Store not found');
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = (product: Product) => {
    if (!data?.store?._id) {
      setError('Store is missing a valid brand ID.');
      return;
    }

    const firstVariant = product.variants?.[0] || {};
    const price = getProductPrice(product);
    const imageUrl = getProductImage(product);

    addItem({
      id: product._id || product.id || '',
      brandId: data.store._id,
      brandSubdomain: data.store.subdomain,
      brandName: data.store.brandName,
      brandLogoUrl: data.store.logoUrl,
      name: product.name,
      unitPrice: price,
      itemType: 'product',
      variant: {
        size: firstVariant.size || '',
        color: firstVariant.color || '',
        printfulVariantId: firstVariant.printfulVariantId,
      },
      mockupUrl: imageUrl,
    });
  };

  const handleAddService = (service: Service) => {
    if (!data?.store?._id) {
      setError('Store is missing a valid brand ID.');
      return;
    }

    addItem({
      id: service._id,
      brandId: data.store._id,
      brandSubdomain: data.store.subdomain,
      brandName: data.store.brandName,
      brandLogoUrl: data.store.logoUrl,
      name: service.title,
      unitPrice: Number(service.price) || 0,
      itemType: 'service',
    });
  };

  if (loading) {
    return (
      <StoreLayout title="Loading Store | CreatorLaunch">
        <div className="min-h-screen flex items-center justify-center bg-light">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </StoreLayout>
    );
  }

  if (error || !data) {
    return (
      <StoreLayout title="Store Not Found | CreatorLaunch">
        <div className="min-h-screen flex items-center justify-center bg-light">
          <div className="text-center px-4">
            <h1 className="text-4xl font-bold text-dark mb-4">Store Not Found</h1>
            <p className="text-medium mb-6">
              {error || "The store you're looking for doesn't exist."}
            </p>
            <Link
              href="/"
              className="bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-red-600 transition-colors"
            >
              Go Home
            </Link>
          </div>
        </div>
      </StoreLayout>
    );
  }

  const { store, products, services } = data;

  return (
    <StoreLayout
      store={store}
      title={`${store.brandName} | CreatorLaunch`}
      description={store.description || `Shop at ${store.brandName}`}
    >
      <section className="bg-white border-b">
        <div className="container mx-auto px-4 py-12 text-center">
          {store.logoUrl ? (
            <img
              src={store.logoUrl}
              alt={store.brandName}
              className="w-24 h-24 rounded-full object-cover mx-auto mb-4 shadow-md"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center text-white font-bold text-4xl mx-auto mb-4 shadow-md">
              {store.brandName.charAt(0).toUpperCase()}
            </div>
          )}

          <h1 className="text-3xl font-bold text-dark mb-2">{store.brandName}</h1>

          {store.description && (
            <p className="text-medium max-w-2xl mx-auto mb-4">{store.description}</p>
          )}

          <p className="text-sm text-medium">Created by {store.owner}</p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-8">
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg p-1 shadow-sm">
            <button
              onClick={() => setActiveTab('products')}
              className={`px-6 py-2 rounded-md font-medium transition-colors ${
                activeTab === 'products'
                  ? 'bg-primary text-white'
                  : 'text-medium hover:text-dark'
              }`}
            >
              Products ({products.length})
            </button>

            <button
              onClick={() => setActiveTab('services')}
              className={`px-6 py-2 rounded-md font-medium transition-colors ${
                activeTab === 'services'
                  ? 'bg-primary text-white'
                  : 'text-medium hover:text-dark'
              }`}
            >
              Services ({services.length})
            </button>
          </div>
        </div>

        {activeTab === 'products' && (
          <>
            {products.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-medium text-lg">No products available yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => {
                  const imageUrl = getProductImage(product);
                  const price = getProductPrice(product);

                  return (
                    <div
                      key={product._id}
                      className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow group"
                    >
                      <Link href={`/store/${store.subdomain}/products/${product._id}`}>
                        <div className="aspect-square bg-gray-100 relative overflow-hidden">
                          {imageUrl ? (
                            <img
                              src={imageUrl}
                              alt={product.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-300">
                              <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                              </svg>
                            </div>
                          )}
                        </div>
                      </Link>

                      <div className="p-4">
                        <h3 className="font-semibold text-dark mb-1">{product.name}</h3>

                        {product.description && (
                          <p className="text-sm text-medium line-clamp-2 mb-2">
                            {product.description}
                          </p>
                        )}

                        <div className="flex items-center justify-between mt-3">
                          <span className="text-lg font-bold text-primary">
                            ${price.toFixed(2)}
                          </span>

                          <div className="flex items-center gap-2">
                            <Link
                              href={`/store/${store.subdomain}/products/${product._id}`}
                              className="bg-gray-100 text-dark px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
                            >
                              View
                            </Link>

                            <button
                              onClick={() => handleAddProduct(product)}
                              className="bg-primary text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-red-600 transition-colors"
                            >
                              Add
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {activeTab === 'services' && (
          <>
            {services.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-medium text-lg">No services available yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map((service) => (
                  <div
                    key={service._id}
                    className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <span className="text-xs font-medium bg-blue-100 text-blue-700 px-2 py-1 rounded capitalize">
                        {service.category.replace('-', ' ')}
                      </span>

                      <span className="text-lg font-bold text-primary">
                        ${Number(service.price || 0).toFixed(2)}
                      </span>
                    </div>

                    <h3 className="font-semibold text-dark text-lg mb-2">{service.title}</h3>
                    <p className="text-sm text-medium line-clamp-3 mb-4">{service.description}</p>

                    <div className="flex items-center gap-4 text-xs text-medium mb-4">
                      <span>📦 {service.deliveryTime}</span>
                      <span>
                        🔄 {service.revisions} revision{service.revisions !== 1 ? 's' : ''}
                      </span>
                    </div>

                    <button
                      onClick={() => handleAddService(service)}
                      className="w-full bg-primary text-white py-2 rounded-lg text-sm font-medium hover:bg-red-600 transition-colors"
                    >
                      Add to Cart
                    </button>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </section>
    </StoreLayout>
  );
};

export default StorePage;
