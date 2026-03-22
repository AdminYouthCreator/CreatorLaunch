import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { storeAPI } from '@/utils/api';
import { useCartContext } from '@/context/CartContext';
import CartDrawer from '@/components/cart/CartDrawer';

interface StoreData {
  store: {
    brandName: string;
    subdomain: string;
    description: string;
    logoUrl: string | null;
    owner: string;
  };
  products: Array<{
    _id: string;
    name: string;
    description: string;
    variants: Array<{
      retailPrice: number;
      size: string;
      color: string;
      mockupUrl: string;
      printfulVariantId: number;
      baseCost: number;
    }>;
    status: string;
  }>;
  services: Array<{
    _id: string;
    title: string;
    description: string;
    category: string;
    price: number;
    deliveryTime: string;
    revisions: number;
    status: string;
  }>;
}

const StorePage: React.FC = () => {
  const router = useRouter();
  const { storeUrl } = router.query;
  const { addItem, itemCount, toggleCart } = useCartContext();

  const [data, setData] = useState<StoreData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'products' | 'services'>('products');

  useEffect(() => {
    if (!storeUrl || typeof storeUrl !== 'string') return;
    setLoading(true);
    storeAPI.getStore(storeUrl)
      .then(res => { setData(res); setError(''); })
      .catch(() => setError('Store not found'))
      .finally(() => setLoading(false));
  }, [storeUrl]);

  const handleAddProduct = (product: StoreData['products'][0], variant: StoreData['products'][0]['variants'][0]) => {
    if (!data) return;
    addItem({
      id: product._id,
      brandId: data.store.subdomain,
      brandSubdomain: data.store.subdomain,
      name: `${product.name} - ${variant.size}`,
      unitPrice: variant.retailPrice,
      itemType: 'product',
      variant: { size: variant.size, color: variant.color, printfulVariantId: variant.printfulVariantId },
      mockupUrl: variant.mockupUrl,
    });
  };

  const handleAddService = (service: StoreData['services'][0]) => {
    if (!data) return;
    addItem({
      id: service._id,
      brandId: data.store.subdomain,
      brandSubdomain: data.store.subdomain,
      name: service.title,
      unitPrice: service.price,
      itemType: 'service',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-light">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-light">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-dark mb-4">Store Not Found</h1>
          <p className="text-medium mb-6">The store you&apos;re looking for doesn&apos;t exist.</p>
          <Link href="/" className="bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-red-600 transition-colors">
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  const { store, products, services } = data;

  return (
    <>
      <Head>
        <title>{store.brandName} | CreatorLaunch</title>
        <meta name="description" content={store.description || `Shop at ${store.brandName}`} />
      </Head>

      <CartDrawer />

      <div className="min-h-screen bg-light">
        {/* Nav Bar */}
        <nav className="bg-white shadow-sm sticky top-0 z-30">
          <div className="container mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {store.logoUrl ? (
                <img src={store.logoUrl} alt={store.brandName} className="w-10 h-10 rounded-full object-cover" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold text-lg">
                  {store.brandName.charAt(0).toUpperCase()}
                </div>
              )}
              <span className="text-xl font-bold text-dark">{store.brandName}</span>
            </div>

            <button onClick={toggleCart} className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <svg className="w-6 h-6 text-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
              </svg>
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </nav>

        {/* Hero */}
        <div className="bg-white border-b">
          <div className="container mx-auto px-4 py-12 text-center">
            {store.logoUrl ? (
              <img src={store.logoUrl} alt={store.brandName} className="w-24 h-24 rounded-full object-cover mx-auto mb-4 shadow-md" />
            ) : (
              <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center text-white font-bold text-4xl mx-auto mb-4 shadow-md">
                {store.brandName.charAt(0).toUpperCase()}
              </div>
            )}
            <h1 className="text-3xl font-bold text-dark mb-2">{store.brandName}</h1>
            {store.description && (
              <p className="text-medium max-w-lg mx-auto">{store.description}</p>
            )}
            <p className="text-sm text-gray-400 mt-2">by @{store.owner}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="container mx-auto px-4 py-6">
          <div className="flex gap-4 mb-8 border-b">
            <button
              onClick={() => setActiveTab('products')}
              className={`pb-3 px-1 font-semibold text-sm transition-colors border-b-2 ${
                activeTab === 'products'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-medium hover:text-dark'
              }`}
            >
              Products ({products.length})
            </button>
            <button
              onClick={() => setActiveTab('services')}
              className={`pb-3 px-1 font-semibold text-sm transition-colors border-b-2 ${
                activeTab === 'services'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-medium hover:text-dark'
              }`}
            >
              Services ({services.length})
            </button>
          </div>

          {/* Products Grid */}
          {activeTab === 'products' && (
            <>
              {products.length === 0 ? (
                <div className="text-center py-16">
                  <p className="text-medium text-lg">No products available yet.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map(product => {
                    const firstVariant = product.variants[0];
                    const minPrice = Math.min(...product.variants.map(v => v.retailPrice));
                    return (
                      <div key={product._id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow group">
                        <div className="aspect-square bg-gray-100 relative overflow-hidden">
                          {firstVariant?.mockupUrl ? (
                            <img src={firstVariant.mockupUrl} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-300">
                              <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                              </svg>
                            </div>
                          )}
                        </div>
                        <div className="p-4">
                          <h3 className="font-semibold text-dark mb-1">{product.name}</h3>
                          {product.description && (
                            <p className="text-sm text-medium line-clamp-2 mb-2">{product.description}</p>
                          )}
                          <div className="flex items-center justify-between mt-3">
                            <span className="text-lg font-bold text-primary">
                              {product.variants.length > 1 ? `From $${minPrice.toFixed(2)}` : `$${minPrice.toFixed(2)}`}
                            </span>
                            <Link
                              href={`/store/${storeUrl}/products/${product._id}`}
                              className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-600 transition-colors"
                            >
                              View
                            </Link>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}

          {/* Services Grid */}
          {activeTab === 'services' && (
            <>
              {services.length === 0 ? (
                <div className="text-center py-16">
                  <p className="text-medium text-lg">No services available yet.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {services.map(service => (
                    <div key={service._id} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-3">
                        <span className="text-xs font-medium bg-blue-100 text-blue-700 px-2 py-1 rounded capitalize">
                          {service.category.replace('-', ' ')}
                        </span>
                        <span className="text-lg font-bold text-primary">${service.price.toFixed(2)}</span>
                      </div>
                      <h3 className="font-semibold text-dark text-lg mb-2">{service.title}</h3>
                      <p className="text-sm text-medium line-clamp-3 mb-4">{service.description}</p>
                      <div className="flex items-center gap-4 text-xs text-medium mb-4">
                        <span>📦 {service.deliveryTime}</span>
                        <span>🔄 {service.revisions} revision{service.revisions !== 1 ? 's' : ''}</span>
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
        </div>

        {/* Footer */}
        <footer className="bg-white border-t mt-16">
          <div className="container mx-auto px-4 py-6 text-center text-sm text-medium">
            <p>Powered by <span className="font-semibold text-primary">CreatorLaunch</span></p>
          </div>
        </footer>
      </div>
    </>
  );
};

export default StorePage;
