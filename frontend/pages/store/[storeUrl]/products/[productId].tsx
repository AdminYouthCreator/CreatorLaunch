import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/common/Layout';
import { storeAPI } from '@/utils/api';
import { formatPrice } from '@/utils/printful';
import { useCartContext } from '@/context/CartContext';

interface ProductData {
  id: string;
  _id?: string;
  name: string;
  price: number;
  retailPrice?: number;
  description: string;
  images: string[];
  imageUrl?: string;
  mockupUrl?: string;
  variants?: Array<{
    retailPrice: number;
    price?: number;
    size?: string;
    color?: string;
    mockupUrl?: string;
    imageUrl?: string;
    printfulVariantId?: number;
    baseCost?: number;
  }>;
  storeOwner: {
    name: string;
    storeName: string;
    storeUrl: string;
  };
  printfulProduct?: {
    title: string;
    brand: string;
    model: string;
    description: string;
    features: string[];
    materials: string[];
    careInstructions: string[];
  };
}

const StorefrontProductPage: React.FC = () => {
  const router = useRouter();
  const { storeUrl, productId } = router.query;
  const { addItem, toggleCart } = useCartContext();

  const [product, setProduct] = useState<ProductData | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const storePath = typeof storeUrl === 'string' ? `/store/${storeUrl}` : '/';

  useEffect(() => {
    if (storeUrl && productId) {
      loadProductData();
    }
  }, [storeUrl, productId]);

  const normalizeProductResponse = (response: any): ProductData => {
    const productData = response?.data || response?.product || response;
    const storeData = response?.store;

    const firstVariant = productData?.variants?.[0] || {};
    const imageUrl =
      productData?.imageUrl ||
      productData?.mockupUrl ||
      productData?.image ||
      productData?.thumbnail ||
      firstVariant?.mockupUrl ||
      firstVariant?.imageUrl ||
      '';

    const price =
      Number(productData?.price) ||
      Number(productData?.retailPrice) ||
      Number(firstVariant?.retailPrice) ||
      Number(firstVariant?.price) ||
      0;

    return {
      id: productData?.id || productData?._id,
      _id: productData?._id,
      name: productData?.name || 'Untitled Product',
      description: productData?.description || '',
      price,
      retailPrice: price,
      images: productData?.images?.length ? productData.images : [imageUrl].filter(Boolean),
      imageUrl,
      mockupUrl: imageUrl,
      variants: productData?.variants || [],
      storeOwner: productData?.storeOwner || {
        name: storeData?.owner || 'Creator',
        storeName: storeData?.brandName || 'Store',
        storeUrl: storeData?.subdomain || String(storeUrl || ''),
      },
      printfulProduct: productData?.printfulProduct || {
        title: productData?.name || '',
        brand: storeData?.brandName || '',
        model: '',
        description: productData?.description || '',
        features: [],
        materials: [],
        careInstructions: [],
      },
    };
  };

  const loadProductData = async () => {
    try {
      setIsLoading(true);
      setError('');

      const response = await storeAPI.getStoreProduct(storeUrl as string, productId as string);
      setProduct(normalizeProductResponse(response));
    } catch (err: any) {
      setError(err?.response?.data?.message || err.message || 'Failed to load product');
      console.error('Failed to load product:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!product || typeof storeUrl !== 'string') return;

    const firstVariant = product.variants?.[0];

    addItem({
      id: product.id || product._id || String(productId),
      brandId: storeUrl,
      brandSubdomain: storeUrl,
      name: product.name,
      unitPrice: product.price,
      itemType: 'product',
      quantity,
      variant: {
        size: firstVariant?.size || '',
        color: firstVariant?.color || '',
        printfulVariantId: firstVariant?.printfulVariantId,
      },
      mockupUrl: product.imageUrl || product.mockupUrl || product.images?.[0],
    } as any);

    toggleCart();
  };

  if (isLoading) {
    return (
      <Layout title="Loading... | CreatorLaunch">
        <div className="min-h-screen bg-light flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-medium">Loading product...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !product) {
    return (
      <Layout title="Product Not Found | CreatorLaunch">
        <div className="min-h-screen bg-light flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-dark mb-4">Product Not Found</h1>
            <p className="text-medium mb-6">
              {error || "The product you're looking for doesn't exist or has been removed."}
            </p>
            <button
              onClick={() => router.push(storePath)}
              className="bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-red-600 transition-colors"
            >
              Back to Store
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  const mainImage = product.images?.[selectedImage] || product.imageUrl || product.mockupUrl || '';

  return (
    <Layout title={`${product.name} | ${product.storeOwner.storeName}`}>
      <div className="min-h-screen bg-light">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <nav className="mb-8">
              <button
                onClick={() => router.push(storePath)}
                className="text-medium hover:text-primary transition-colors"
              >
                ← Back to {product.storeOwner.storeName}
              </button>
            </nav>

            <div className="grid lg:grid-cols-2 gap-12">
              <div className="space-y-4">
                <div className="bg-white rounded-lg overflow-hidden shadow-sm min-h-[24rem] flex items-center justify-center">
                  {mainImage ? (
                    <img
                      src={mainImage}
                      alt={product.name}
                      className="w-full h-96 object-cover"
                    />
                  ) : (
                    <div className="text-gray-400">No product image</div>
                  )}
                </div>

                {product.images.length > 1 && (
                  <div className="grid grid-cols-4 gap-3">
                    {product.images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={`bg-white rounded-lg overflow-hidden border-2 transition-colors ${
                          selectedImage === index
                            ? 'border-primary'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <img
                          src={image}
                          alt={`${product.name} view ${index + 1}`}
                          className="w-full h-20 object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-6">
                <div>
                  <h1 className="text-3xl font-bold text-dark mb-4">{product.name}</h1>
                  <p className="text-3xl font-bold text-primary mb-6">
                    {formatPrice(product.price)}
                  </p>
                  <p className="text-medium leading-relaxed">
                    {product.description || 'No description available.'}
                  </p>
                </div>

                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <div className="flex items-center space-x-4 mb-6">
                    <label className="text-dark font-medium">Quantity:</label>
                    <div className="flex items-center border rounded-lg">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="px-3 py-2 text-medium hover:text-dark transition-colors"
                      >
                        -
                      </button>
                      <span className="px-4 py-2 border-x text-dark font-medium">{quantity}</span>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="px-3 py-2 text-medium hover:text-dark transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={handleAddToCart}
                    className="w-full bg-primary text-white py-3 px-6 rounded-lg font-semibold hover:bg-red-600 transition-colors"
                  >
                    Add to Cart - {formatPrice(product.price * quantity)}
                  </button>
                </div>

                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <h3 className="font-semibold text-dark mb-2">Sold by</h3>
                  <p className="text-medium">{product.storeOwner.name}</p>
                  <button
                    onClick={() => router.push(storePath)}
                    className="text-primary hover:text-red-600 transition-colors mt-2"
                  >
                    Visit {product.storeOwner.storeName} →
                  </button>
                </div>
              </div>
            </div>

            <hr className="my-12 border-gray-300" />

            <div className="bg-white rounded-lg p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-dark mb-4">Product Details</h2>
              <p className="text-medium">
                This product is sold through a CreatorLaunch student storefront.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default StorefrontProductPage;
