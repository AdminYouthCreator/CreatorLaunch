import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/common/Layout';
import { storeAPI } from '@/utils/api';
import { formatPrice } from '@/utils/printful';

// ################## ----- PRODUCT INTERFACES ----- ##################
interface ProductData {
  id: string;
  name: string;
  price: number;
  description: string;
  images: string[];
  storeOwner: {
    name: string;
    storeName: string;
    storeUrl: string;
  };
  printfulProduct: {
    title: string;
    brand: string;
    model: string;
    description: string;
    features: string[];
    materials: string[];
    careInstructions: string[];
    sizing?: {
      chart: string;
      guide: string;
    };
  };
}

// ################## ----- STOREFRONT PRODUCT PAGE COMPONENT ----- ##################
// Public product page shown on user's storefront
// Follows the specified layout: user content, then Printful product info
// ########################################################################
const StorefrontProductPage: React.FC = () => {
  const router = useRouter();
  const { storeUrl, productId } = router.query;
  const [product, setProduct] = useState<ProductData | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // ################## ----- LOAD PRODUCT DATA ----- ##################
  useEffect(() => {
    if (storeUrl && productId) {
      loadProductData();
    }
  }, [storeUrl, productId]);

  const loadProductData = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      // Load product data from store API
      const response = await storeAPI.getStoreProduct(storeUrl as string, productId as string);
      setProduct(response.data || response);
    } catch (err: any) {
      setError(err.message || 'Failed to load product');
      console.error('Failed to load product:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // ################## ----- ADD TO CART HANDLER ----- ##################
  const handleAddToCart = () => {
    // TODO: Implement add to cart functionality
    console.log('Adding to cart:', { productId, quantity });
    alert(`Added ${quantity} item(s) to cart!`);
  };

  // ################## ----- LOADING STATE ----- ##################
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

  // ################## ----- ERROR STATE ----- ##################
  if (error || !product) {
    return (
      <Layout title="Product Not Found | CreatorLaunch">
        <div className="min-h-screen bg-light flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-dark mb-4">Product Not Found</h1>
            <p className="text-medium mb-6">
              {error || 'The product you\'re looking for doesn\'t exist or has been removed.'}
            </p>
            <button
              onClick={() => router.push(`https://${storeUrl}`)}
              className="bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-red-600 transition-colors"
            >
              Back to Store
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  // ################## ----- MAIN RENDER ----- ##################
  return (
    <Layout title={`${product.name} | ${product.storeOwner.storeName}`}>
      <div className="min-h-screen bg-light">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            {/* Breadcrumb */}
            <nav className="mb-8">
              <button
                onClick={() => router.push(`https://${storeUrl}`)}
                className="text-medium hover:text-primary transition-colors"
              >
                ← Back to {product.storeOwner.storeName}
              </button>
            </nav>

            <div className="grid lg:grid-cols-2 gap-12">
              {/* Product Images */}
              <div className="space-y-4">
                {/* Main Image */}
                <div className="bg-white rounded-lg overflow-hidden shadow-sm">
                  <img
                    src={product.images[selectedImage]}
                    alt={product.name}
                    className="w-full h-96 object-cover"
                  />
                </div>

                {/* Thumbnail Gallery */}
                {product.images.length > 1 && (
                  <div className="grid grid-cols-4 gap-3">
                    {product.images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={`bg-white rounded-lg overflow-hidden border-2 transition-colors ${
                          selectedImage === index ? 'border-primary' : 'border-gray-200 hover:border-gray-300'
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

              {/* Product Information */}
              <div className="space-y-6">
                {/* User's Product Information */}
                <div>
                  <h1 className="text-3xl font-bold text-dark mb-4">{product.name}</h1>
                  <p className="text-3xl font-bold text-primary mb-6">{formatPrice(product.price)}</p>
                  <div className="prose prose-gray max-w-none">
                    <p className="text-medium leading-relaxed">{product.description}</p>
                  </div>
                </div>

                {/* Quantity and Add to Cart */}
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

                {/* Store Owner Info */}
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <h3 className="font-semibold text-dark mb-2">Sold by</h3>
                  <p className="text-medium">{product.storeOwner.name}</p>
                  <button
                    onClick={() => router.push(`https://${storeUrl}`)}
                    className="text-primary hover:text-red-600 transition-colors mt-2"
                  >
                    Visit {product.storeOwner.storeName} →
                  </button>
                </div>
              </div>
            </div>

            {/* Horizontal Rule Separator */}
            <hr className="my-12 border-gray-300" />

            {/* About This Product Section */}
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-dark mb-8">About This Product</h2>
              
              <div className="bg-white rounded-lg shadow-sm p-8 space-y-8">
                {/* Product Details */}
                <div>
                  <h3 className="text-xl font-semibold text-dark mb-4">{product.printfulProduct.title}</h3>
                  <p className="text-medium mb-4">{product.printfulProduct.description}</p>
                  <p className="text-sm text-medium">
                    <strong>Brand:</strong> {product.printfulProduct.brand} | 
                    <strong> Model:</strong> {product.printfulProduct.model}
                  </p>
                </div>

                {/* Features & Materials */}
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="font-semibold text-dark mb-3">Features</h4>
                    <ul className="space-y-2">
                      {product.printfulProduct.features.map((feature, index) => (
                        <li key={index} className="text-sm text-medium flex items-start">
                          <span className="w-1.5 h-1.5 bg-primary rounded-full mr-3 mt-2 flex-shrink-0"></span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-dark mb-3">Materials</h4>
                    <ul className="space-y-2">
                      {product.printfulProduct.materials.map((material, index) => (
                        <li key={index} className="text-sm text-medium flex items-start">
                          <span className="w-1.5 h-1.5 bg-primary rounded-full mr-3 mt-2 flex-shrink-0"></span>
                          {material}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Care Instructions */}
                <div>
                  <h4 className="font-semibold text-dark mb-3">Care Instructions</h4>
                  <ul className="grid md:grid-cols-2 gap-2">
                    {product.printfulProduct.careInstructions.map((instruction, index) => (
                      <li key={index} className="text-sm text-medium flex items-start">
                        <span className="w-1.5 h-1.5 bg-primary rounded-full mr-3 mt-2 flex-shrink-0"></span>
                        {instruction}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Sizing Information */}
                {product.printfulProduct.sizing && (
                  <div>
                    <h4 className="font-semibold text-dark mb-3">Sizing</h4>
                    <p className="text-sm text-medium mb-4">{product.printfulProduct.sizing.guide}</p>
                    <button
                      onClick={() => product.printfulProduct.sizing?.chart && window.open(product.printfulProduct.sizing.chart, '_blank')}
                      className="text-primary hover:text-red-600 transition-colors text-sm font-medium"
                    >
                      View Size Chart →
                    </button>
                  </div>
                )}

                {/* Fulfillment Info */}
                <div className="bg-light p-4 rounded-lg">
                  <h4 className="font-semibold text-dark mb-2">Fulfillment & Shipping</h4>
                  <p className="text-sm text-medium">
                    This product is made-to-order and printed just for you! Orders typically ship within 2-7 business days. 
                    Each item is printed with care using high-quality materials and processes.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default StorefrontProductPage;
