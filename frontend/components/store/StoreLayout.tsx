import React from 'react';
import Link from 'next/link';
import Head from 'next/head';
import CartDrawer from '@/components/cart/CartDrawer';
import { useCartContext } from '@/context/CartContext';

interface StoreInfo {
  _id?: string;
  brandName?: string;
  subdomain?: string;
  description?: string;
  logoUrl?: string | null;
  owner?: string;
}

interface StoreLayoutProps {
  children: React.ReactNode;
  store?: StoreInfo | null;
  title?: string;
  description?: string;
}

const StoreLayout: React.FC<StoreLayoutProps> = ({
  children,
  store,
  title = 'CreatorLaunch Store',
  description,
}) => {
  const { itemCount, toggleCart } = useCartContext();

  const storeHref = store?.subdomain ? `/store/${store.subdomain}` : '/';
  const brandName = store?.brandName || 'Creator Store';
  const logoUrl = store?.logoUrl || null;

  return (
    <>
      <Head>
        <title>{title}</title>
        {description && <meta name="description" content={description} />}
      </Head>

      <CartDrawer />

      <div className="min-h-screen bg-light">
        <header className="bg-white border-b sticky top-0 z-40">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <Link href={storeHref} className="flex items-center gap-3">
              {logoUrl ? (
                <img
                  src={logoUrl}
                  alt={brandName}
                  className="w-11 h-11 rounded-full object-cover border border-gray-200"
                />
              ) : (
                <div className="w-11 h-11 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                  {brandName.charAt(0).toUpperCase()}
                </div>
              )}

              <div>
                <p className="font-bold text-dark leading-tight">{brandName}</p>
                <p className="text-xs text-medium">Powered by CreatorLaunch</p>
              </div>
            </Link>

            <button
              onClick={toggleCart}
              className="relative bg-primary text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-600 transition-colors"
            >
              Cart
              {itemCount > 0 && (
                <span className="ml-2 bg-white text-primary rounded-full px-2 py-0.5 text-xs font-bold">
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </header>

        <main>{children}</main>

        <footer className="bg-white border-t mt-16">
          <div className="container mx-auto px-4 py-6 text-center text-sm text-medium">
            <p>
              Powered by{' '}
              <Link href="/" className="font-semibold text-primary hover:text-red-600">
                CreatorLaunch
              </Link>
            </p>
          </div>
        </footer>
      </div>
    </>
  );
};

export default StoreLayout;
