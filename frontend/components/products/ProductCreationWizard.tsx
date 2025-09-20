import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/common/Layout';
import { useAuth } from '@/hooks/useAuth';
import { printfulAPI, productAPI, brandAPI } from '@/utils/api';
import { 
  PrintfulProduct, 
  PrintfulVariant, 
  calculateEarnings,
  validateRetailPrice,
  formatPrice 
} from '@/utils/printful';
import PrintfulVariantSelector from './PrintfulVariantSelector';
import PrintfulCatalogBrowser from './PrintfulCatalogBrowser';

// ################## ----- PRODUCT CREATION STEPS ----- ##################
// Enum for the different steps in the product creation flow
enum ProductCreationStep {
  SELECT_PRODUCT = 'select_product',
  CUSTOMIZE_DESIGN = 'customize_design',
  SET_PRICING = 'set_pricing',
  PRODUCT_DETAILS = 'product_details',
  PUBLISH = 'publish'
}

// ################## ----- INTERFACES ----- ##################
interface ProductCreationData {
  selectedProduct?: PrintfulProduct;
  selectedVariant?: PrintfulVariant;
  designFile?: File;
  designUrl?: string;
  mockupTaskKey?: string;
  mockupUrls?: string[];
  baseCost: number;
  retailPrice: number;
  productName: string;
  productDescription: string;
}

// ################## ----- PRODUCT CREATION WIZARD COMPONENT ----- ##################
// Main component for the complete product creation and publishing flow
const ProductCreationWizard: React.FC = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState<ProductCreationStep>(ProductCreationStep.SELECT_PRODUCT);
  const [productData, setProductData] = useState<ProductCreationData>({
    baseCost: 0,
    retailPrice: 0,
    productName: '',
    productDescription: ''
  });
  
  // Loading and error states
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  // User brand data
  const [userBrand, setUserBrand] = useState<any>(null);
  
  // ################## ----- EFFECT: LOAD INITIAL DATA ----- ##################
  useEffect(() => {
    if (user) {
      loadInitialData();
    }
  }, [user]);

  // ################## ----- LOAD INITIAL DATA ----- ##################
  const loadInitialData = async () => {
    try {
      setIsLoading(true);
      // Load user's brand
      const brandResponse = await brandAPI.getUserBrand();
      setUserBrand(brandResponse.data);
    } catch (err) {
      setError('Failed to load initial data');
      console.error('Failed to load initial data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // ################## ----- STEP NAVIGATION ----- ##################
  const goToNextStep = () => {
    const steps = Object.values(ProductCreationStep);
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
    }
  };

  const goToPreviousStep = () => {
    const steps = Object.values(ProductCreationStep);
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
    }
  };

  // ################## ----- PRODUCT SELECTION HANDLERS ----- ##################
  const handleProductSelect = async (product: PrintfulProduct) => {
    try {
      setIsLoading(true);
      setError('');
      
      // Get detailed product information including variants
      const productDetails = await printfulAPI.getProduct(product.id);
      const productInfo = productDetails.result || productDetails;
      
      // Select the first available variant by default
      const firstVariant = productInfo.variants?.[0];
      
      setProductData(prev => ({
        ...prev,
        selectedProduct: product,
        selectedVariant: firstVariant,
        baseCost: firstVariant ? parseFloat(firstVariant.price) : 0,
        retailPrice: firstVariant ? parseFloat(firstVariant.price) + 5 : 15, // Add $5 markup
        productName: `Custom ${product.title}`,
      }));
      
      goToNextStep();
    } catch (err) {
      setError('Failed to load product details');
      console.error('Failed to load product details:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // ################## ----- VARIANT SELECTION HANDLER ----- ##################
  const handleVariantSelect = (variant: PrintfulVariant) => {
    setProductData(prev => ({
      ...prev,
      selectedVariant: variant,
      baseCost: parseFloat(variant.price),
      retailPrice: parseFloat(variant.price) + 5 // Maintain $5 markup
    }));
  };

  // ################## ----- DESIGN UPLOAD HANDLERS ----- ##################
  const handleDesignUpload = async (file: File) => {
    try {
      setIsLoading(true);
      setError('');
      
      // Generate mockups if we have a selected variant and product
      if (productData.selectedVariant && productData.selectedProduct && file) {
        const mockupRequest = {
          productId: productData.selectedProduct.id,
          variantIds: [productData.selectedVariant.id],
          artwork: file,
          placementData: {
            placement: 'front',
            position: {
              area_width: 1800,
              area_height: 2400,
              width: 1800,
              height: 1800,
              top: 300,
              left: 0
            }
          }
        };
        
        const mockupResponse = await printfulAPI.generateMockup(mockupRequest);
        const taskKey = mockupResponse.task_key;
        
        // Store the data and move to next step
        setProductData(prev => ({
          ...prev,
          designFile: file,
          designUrl: URL.createObjectURL(file),
          mockupTaskKey: taskKey
        }));
        
        // Start polling for mockup completion
        pollMockupStatus(taskKey);
      } else {
        // Just store the file for now
        setProductData(prev => ({
          ...prev,
          designFile: file,
          designUrl: URL.createObjectURL(file)
        }));
      }
      
    } catch (err: any) {
      let errorMessage = 'Failed to upload design file';
      
      if (err?.response?.status === 500) {
        errorMessage = 'Server error occurred while generating mockup. Please try again or contact support.';
      } else if (err?.response?.status === 400) {
        errorMessage = err?.response?.data?.message || 'Invalid file or request. Please check your design file and try again.';
      } else if (err?.response?.status === 401) {
        errorMessage = 'Authentication failed. Please login again.';
      } else if (err?.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err?.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      console.error('Failed to upload design:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // ################## ----- MOCKUP STATUS POLLING ----- ##################
  const pollMockupStatus = async (taskKey: string) => {
    const checkStatus = async () => {
      try {
        const statusResponse = await printfulAPI.getMockupStatus(taskKey);
        const status = statusResponse.result || statusResponse;
        
        if (status.status === 'completed') {
          setProductData(prev => ({
            ...prev,
            mockupUrls: status.mockups?.map((m: any) => m.mockup_url) || []
          }));
        } else if (status.status === 'failed') {
          setError('Mockup generation failed');
        } else {
          // Still processing, check again in 3 seconds
          setTimeout(checkStatus, 3000);
        }
      } catch (err) {
        console.error('Failed to check mockup status:', err);
        setError('Failed to generate mockups');
      }
    };
    
    checkStatus();
  };

  // ################## ----- PRICING HANDLERS ----- ##################
  const handlePriceChange = (newPrice: number) => {
    setProductData(prev => ({
      ...prev,
      retailPrice: newPrice
    }));
  };

  // ################## ----- PRODUCT DETAILS HANDLERS ----- ##################
  const handleProductDetailsChange = (name: string, description: string) => {
    setProductData(prev => ({
      ...prev,
      productName: name,
      productDescription: description
    }));
  };

  // ################## ----- PUBLISH HANDLER ----- ##################
  const handlePublish = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      if (!userBrand || !productData.selectedProduct || !productData.selectedVariant || !productData.designFile) {
        setError('Missing required data for product creation');
        return;
      }
      
      // Create product using Printful integration
      const productPayload = {
        brandId: userBrand._id,
        printfulProductId: productData.selectedProduct.id,
        name: productData.productName,
        description: productData.productDescription,
        variants: [
          {
            printfulVariantId: productData.selectedVariant.id,
            retailPrice: productData.retailPrice.toString(),
            baseCost: productData.selectedVariant.price, // Use the base cost from the variant
            mockupUrl: productData.mockupUrls?.[0] || ''
          }
        ]
      };
      
      const response = await productAPI.createPrintfulProduct(productPayload);
      
      // Redirect to success page or dashboard
      router.push('/dashboard?productCreated=true');
    } catch (err) {
      setError('Failed to publish product');
      console.error('Failed to publish product:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // ################## ----- STEP COMPONENTS ----- ##################
  const renderStepContent = () => {
    switch (currentStep) {
      case ProductCreationStep.SELECT_PRODUCT:
        return <SelectProductStep />;
      case ProductCreationStep.CUSTOMIZE_DESIGN:
        return <CustomizeDesignStep />;
      case ProductCreationStep.SET_PRICING:
        return <SetPricingStep />;
      case ProductCreationStep.PRODUCT_DETAILS:
        return <ProductDetailsStep />;
      case ProductCreationStep.PUBLISH:
        return <PublishStep />;
      default:
        return <SelectProductStep />;
    }
  };

  // ################## ----- SELECT PRODUCT STEP ----- ##################
  const SelectProductStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-dark mb-2">Step 1: Select Base Product</h2>
        <p className="text-medium">Choose a product from our Printful catalog to customize</p>
      </div>

      {/* Use the existing PrintfulCatalogBrowser component */}
      <PrintfulCatalogBrowser
        onProductSelect={handleProductSelect}
        searchTerm=""
      />
    </div>
  );

  // ################## ----- CUSTOMIZE DESIGN STEP ----- ##################
  const CustomizeDesignStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-dark mb-2">Step 2: Customize Design</h2>
        <p className="text-medium">Select product options and upload your artwork</p>
      </div>

      {/* Product Variant Selection */}
      {productData.selectedProduct && (
        <div className="bg-white rounded-lg border p-6">
          <h3 className="text-lg font-semibold text-dark mb-4">Product Options</h3>
          <PrintfulVariantSelector
            product={productData.selectedProduct}
            selectedVariant={productData.selectedVariant}
            onVariantSelect={handleVariantSelect}
          />
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-8">
        {/* Design Upload */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-dark">Upload Your Design</h3>
          
          {!productData.designUrl ? (
            <label className="block">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => e.target.files?.[0] && handleDesignUpload(e.target.files[0])}
                className="hidden"
              />
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <p className="text-dark font-medium mb-1">Click to upload your design</p>
                <p className="text-sm text-medium">PNG, JPG, or SVG files up to 10MB</p>
              </div>
            </label>
          ) : (
            <div className="space-y-4">
              <div className="bg-white border rounded-lg p-4">
                <img
                  src={productData.designUrl}
                  alt="Uploaded design"
                  className="w-full h-32 object-contain rounded"
                />
              </div>
              <button
                onClick={() => setProductData(prev => ({ ...prev, designUrl: undefined, designFile: undefined }))}
                className="text-sm text-primary hover:text-red-600"
              >
                Upload different design
              </button>
            </div>
          )}
        </div>

        {/* Live Mockup Preview */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-dark">Live Product Mockup</h3>
          
          {productData.mockupUrls ? (
            <div className="grid grid-cols-2 gap-4">
              {productData.mockupUrls.map((url, index) => (
                <div key={index} className="bg-white border rounded-lg p-4">
                  <img
                    src={url}
                    alt={`Mockup ${index + 1}`}
                    className="w-full h-32 object-cover rounded"
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gray-50 border rounded-lg p-8 text-center">
              <p className="text-medium">Upload a design to see the live mockup</p>
            </div>
          )}
        </div>
      </div>

      {productData.designUrl && (
        <div className="flex justify-center">
          <button
            onClick={goToNextStep}
            className="bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-red-600 transition-colors"
          >
            Continue to Pricing
          </button>
        </div>
      )}
    </div>
  );

  // ################## ----- SET PRICING STEP ----- ##################
  const SetPricingStep = () => {
    const earnings = calculateEarnings(productData.retailPrice, productData.baseCost);
    const isValidPrice = validateRetailPrice(productData.retailPrice, productData.baseCost);

    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-dark mb-2">Step 3: Set Price & View Profit</h2>
          <p className="text-medium">Set your selling price and see your potential earnings</p>
        </div>

        <div className="max-w-2xl mx-auto bg-white rounded-lg border p-6 space-y-6">
          {/* Base Cost (Non-editable) */}
          <div>
            <label className="block text-sm font-medium text-dark mb-2">
              Base Cost (Fixed)
            </label>
            <div className="bg-gray-50 border rounded-lg p-3">
              <span className="text-lg font-semibold text-dark">
                {formatPrice(productData.baseCost)}
              </span>
              <p className="text-xs text-medium mt-1">
                This is the cost of the product from Printful
              </p>
            </div>
          </div>

          {/* Retail Price (Editable) */}
          <div>
            <label className="block text-sm font-medium text-dark mb-2">
              Your Retail Price *
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-medium">$</span>
              <input
                type="number"
                value={productData.retailPrice || ''}
                onChange={(e) => handlePriceChange(parseFloat(e.target.value) || 0)}
                min={productData.baseCost}
                step="0.01"
                className={`w-full pl-8 pr-4 py-3 border rounded-lg focus:outline-none ${
                  isValidPrice 
                    ? 'border-gray-300 focus:border-primary' 
                    : 'border-red-500 focus:border-red-500'
                }`}
                placeholder="0.00"
              />
            </div>
            {!isValidPrice && (
              <p className="text-sm text-red-500 mt-1">
                Retail price must be at least {formatPrice(productData.baseCost)}
              </p>
            )}
          </div>

          {/* Your Earnings (Calculated) */}
          <div>
            <label className="block text-sm font-medium text-dark mb-2">
              Your Earnings (70% of profit)
            </label>
            <div className={`border rounded-lg p-3 ${
              earnings > 0 ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
            }`}>
              <span className={`text-lg font-semibold ${
                earnings > 0 ? 'text-green-600' : 'text-gray-500'
              }`}>
                {formatPrice(earnings)}
              </span>
              <p className="text-xs text-medium mt-1">
                Per sale after Printful costs and platform fee
              </p>
            </div>
          </div>

          {/* Pricing Breakdown */}
          <div className="bg-light p-4 rounded-lg">
            <h4 className="font-medium text-dark mb-3">Pricing Breakdown</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-medium">Customer pays:</span>
                <span className="font-medium text-dark">{formatPrice(productData.retailPrice)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-medium">- Printful cost:</span>
                <span className="text-red-500">-{formatPrice(productData.baseCost)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-medium">- Platform fee (30%):</span>
                <span className="text-red-500">-{formatPrice((productData.retailPrice - productData.baseCost) * 0.30)}</span>
              </div>
              <hr className="border-gray-300" />
              <div className="flex justify-between font-semibold">
                <span className="text-dark">Your earnings:</span>
                <span className="text-green-600">{formatPrice(earnings)}</span>
              </div>
            </div>
          </div>
        </div>

        {isValidPrice && (
          <div className="flex justify-center">
            <button
              onClick={goToNextStep}
              className="bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-red-600 transition-colors"
            >
              Continue to Product Details
            </button>
          </div>
        )}
      </div>
    );
  };

  // ################## ----- PRODUCT DETAILS STEP ----- ##################
  const ProductDetailsStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-dark mb-2">Step 4: Add Product Details</h2>
        <p className="text-medium">Provide information about your product for customers</p>
      </div>

      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <label className="block text-sm font-medium text-dark mb-2">
            Product Name *
          </label>
          <input
            type="text"
            value={productData.productName}
            onChange={(e) => handleProductDetailsChange(e.target.value, productData.productDescription)}
            placeholder="e.g., My Awesome Custom T-Shirt"
            className="w-full px-4 py-3 border rounded-lg focus:border-primary focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-dark mb-2">
            Product Description *
          </label>
          <textarea
            value={productData.productDescription}
            onChange={(e) => handleProductDetailsChange(productData.productName, e.target.value)}
            placeholder="Describe your product and what makes it special..."
            rows={4}
            className="w-full px-4 py-3 border rounded-lg focus:border-primary focus:outline-none resize-none"
          />
        </div>

        {/* Preview of how it will look on store */}
        <div className="bg-light p-4 rounded-lg">
          <h4 className="font-medium text-dark mb-3">Store Preview</h4>
          <div className="bg-white border rounded-lg p-4">
            <div className="flex space-x-4">
              {productData.mockupUrls?.[0] && (
                <img
                  src={productData.mockupUrls[0]}
                  alt="Product preview"
                  className="w-24 h-24 object-cover rounded"
                />
              )}
              <div className="flex-1">
                <h5 className="font-semibold text-dark">
                  {productData.productName || 'Your Product Name'}
                </h5>
                <p className="text-lg font-bold text-primary mb-2">
                  {formatPrice(productData.retailPrice)}
                </p>
                <p className="text-sm text-medium line-clamp-2">
                  {productData.productDescription || 'Your product description will appear here...'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {productData.productName && productData.productDescription && (
          <div className="flex justify-center">
            <button
              onClick={goToNextStep}
              className="bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-red-600 transition-colors"
            >
              Continue to Publish
            </button>
          </div>
        )}
      </div>
    </div>
  );

  // ################## ----- PUBLISH STEP ----- ##################
  const PublishStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-dark mb-2">Step 5: Publish Your Product</h2>
        <p className="text-medium">Review your product and publish it to your store</p>
      </div>

      <div className="max-w-2xl mx-auto">
        {/* Final Product Summary */}
        <div className="bg-white border rounded-lg p-6 space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-dark mb-3">Product Preview</h4>
              {productData.mockupUrls?.[0] && (
                <img
                  src={productData.mockupUrls[0]}
                  alt="Final product"
                  className="w-full h-48 object-cover rounded"
                />
              )}
            </div>
            
            <div className="space-y-4">
              <div>
                <h5 className="font-medium text-dark">Product Details</h5>
                <p className="text-sm text-medium">
                  {productData.selectedProduct?.title} - {productData.selectedProduct?.brand}
                </p>
              </div>
              
              <div>
                <h5 className="font-medium text-dark">Your Title</h5>
                <p className="text-sm text-medium">{productData.productName}</p>
              </div>
              
              <div>
                <h5 className="font-medium text-dark">Pricing</h5>
                <p className="text-sm text-medium">
                  Retail: {formatPrice(productData.retailPrice)} | 
                  Your earnings: {formatPrice(calculateEarnings(productData.retailPrice, productData.baseCost))}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <div className="bg-green-500 text-white rounded-full p-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h5 className="font-medium text-dark">Ready to Publish!</h5>
                <p className="text-sm text-medium">
                  Your product will be added to your storefront and available for purchase immediately.
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={handlePublish}
            disabled={isLoading}
            className="w-full bg-primary text-white py-3 px-6 rounded-lg font-semibold hover:bg-red-600 transition-colors disabled:bg-gray-400"
          >
            {isLoading ? 'Publishing...' : 'Publish Product'}
          </button>
        </div>
      </div>
    </div>
  );

  // ################## ----- MAIN RENDER ----- ##################
  // Show loading while authentication is being determined
  if (!user) {
    return (
      <Layout title="Create New Product | CreatorLaunch">
        <div className="min-h-screen bg-light flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-medium">Loading...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Create New Product | CreatorLaunch">
      <div className="min-h-screen bg-light">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Header with Back Button */}
            <div className="mb-8">
              <button
                onClick={() => currentStep === ProductCreationStep.SELECT_PRODUCT ? router.back() : goToPreviousStep()}
                className="flex items-center text-medium hover:text-dark transition-colors mb-4"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                {currentStep === ProductCreationStep.SELECT_PRODUCT ? 'Back to Dashboard' : 'Previous Step'}
              </button>

              {/* Progress Indicator */}
              <div className="flex items-center space-x-2 mb-4">
                {Object.values(ProductCreationStep).map((step, index) => {
                  const isActive = step === currentStep;
                  const isCompleted = Object.values(ProductCreationStep).indexOf(currentStep) > index;
                  
                  return (
                    <div key={step} className="flex items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                        isActive ? 'bg-primary text-white' :
                        isCompleted ? 'bg-green-500 text-white' :
                        'bg-gray-200 text-gray-500'
                      }`}>
                        {isCompleted ? '✓' : index + 1}
                      </div>
                      {index < Object.values(ProductCreationStep).length - 1 && (
                        <div className={`w-8 h-1 mx-2 ${
                          isCompleted ? 'bg-green-500' : 'bg-gray-200'
                        }`} />
                      )}
                    </div>
                  );
                })}
              </div>

              <h1 className="text-3xl font-bold text-dark">Create Your Product</h1>
            </div>

            {/* Error Display */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <p className="text-red-600">{error}</p>
                <button
                  onClick={() => setError('')}
                  className="text-red-500 text-sm underline hover:no-underline mt-1"
                >
                  Dismiss
                </button>
              </div>
            )}

            {/* Step Content */}
            <div className="bg-white rounded-lg shadow-sm p-8">
              {renderStepContent()}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProductCreationWizard;
