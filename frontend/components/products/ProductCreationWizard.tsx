import React, { useEffect, useMemo, useState } from 'react';
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

enum ProductCreationStep {
  SELECT_PRODUCT = 'select_product',
  CUSTOMIZE_DESIGN = 'customize_design',
  SET_PRICING = 'set_pricing',
  PRODUCT_DETAILS = 'product_details',
  PUBLISH = 'publish'
}

interface MockupStyleOption {
  id: number;
  categoryName: string;
  viewName: string;
  restrictedToVariants: number[] | null;
}

interface MockupPlacementOption {
  placement: string;
  displayName: string;
  technique: string;
  printAreaWidth: number;
  printAreaHeight: number;
  printAreaType: string;
  dpi: number;
  mockupStyles: MockupStyleOption[];
}

interface SelectedPlacementData {
  placement: string;
  displayName: string;
  technique: string;
  printAreaWidth: number;
  printAreaHeight: number;
  printAreaType: string;
  dpi: number;
  mockupStyleId: number;
  mockupStyleLabel: string;
  position: {
    width: number;
    height: number;
    top: number;
    left: number;
  };
}

interface ProductCreationData {
  selectedProduct?: PrintfulProduct;
  selectedVariant?: PrintfulVariant;
  selectedPlacement?: SelectedPlacementData;
  designFile?: File;
  designUrl?: string;
  mockupTaskKey?: string;
  mockupUrls?: string[];
  baseCost: number;
  retailPrice: number;
  productName: string;
  productDescription: string;
}

const ProductCreationWizard: React.FC = () => {
  const router = useRouter();
  const { user } = useAuth();

  const [currentStep, setCurrentStep] = useState<ProductCreationStep>(
    ProductCreationStep.SELECT_PRODUCT
  );

  const [productData, setProductData] = useState<ProductCreationData>({
    baseCost: 0,
    retailPrice: 0,
    productName: '',
    productDescription: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [userBrand, setUserBrand] = useState<any>(null);
  const [mockupOptions, setMockupOptions] = useState<MockupPlacementOption[]>([]);

  useEffect(() => {
    if (user) {
      loadInitialData();
    }
  }, [user]);

  const loadInitialData = async () => {
    try {
      setIsLoading(true);
      const brandResponse = await brandAPI.getUserBrand();
      setUserBrand(brandResponse.data || brandResponse);
    } catch (err) {
      console.error(err);
      setError('Failed to load your brand data.');
    } finally {
      setIsLoading(false);
    }
  };

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

  const getCompatibleStyles = (
    option?: MockupPlacementOption,
    variantId?: number
  ): MockupStyleOption[] => {
    if (!option) return [];
    return option.mockupStyles.filter((style) => {
      if (!style.restrictedToVariants || style.restrictedToVariants.length === 0) {
        return true;
      }
      if (!variantId) return false;
      return style.restrictedToVariants.includes(variantId);
    });
  };

  const buildDefaultPosition = (option: MockupPlacementOption) => {
    const width = Math.min(option.printAreaWidth, option.printAreaHeight) * 0.8;
    const height = width;

    return {
      width,
      height,
      top: Math.max((option.printAreaHeight - height) / 2, 0),
      left: Math.max((option.printAreaWidth - width) / 2, 0)
    };
  };

  const buildSelectedPlacement = (
    option: MockupPlacementOption,
    variantId?: number,
    preferredStyleId?: number
  ): SelectedPlacementData | undefined => {
    const compatibleStyles = getCompatibleStyles(option, variantId);
    if (!compatibleStyles.length) return undefined;

    const chosenStyle =
      compatibleStyles.find((style) => style.id === preferredStyleId) || compatibleStyles[0];

    return {
      placement: option.placement,
      displayName: option.displayName,
      technique: option.technique,
      printAreaWidth: option.printAreaWidth,
      printAreaHeight: option.printAreaHeight,
      printAreaType: option.printAreaType,
      dpi: option.dpi,
      mockupStyleId: chosenStyle.id,
      mockupStyleLabel: `${chosenStyle.categoryName} - ${chosenStyle.viewName}`,
      position: buildDefaultPosition(option)
    };
  };

  const selectedPlacementOption = useMemo(
    () =>
      mockupOptions.find(
        (option) => option.placement === productData.selectedPlacement?.placement
      ),
    [mockupOptions, productData.selectedPlacement]
  );

  const compatibleStyles = useMemo(
    () => getCompatibleStyles(selectedPlacementOption, productData.selectedVariant?.id),
    [selectedPlacementOption, productData.selectedVariant]
  );

  const handleProductSelect = async (product: PrintfulProduct) => {
    try {
      setIsLoading(true);
      setError('');

      const [productDetailsResponse, mockupOptionsResponse] = await Promise.all([
        printfulAPI.getProduct(product.id),
        printfulAPI.getMockupOptions(product.id)
      ]);

      const productInfo = productDetailsResponse.result || productDetailsResponse;
      const placementOptions =
        mockupOptionsResponse.data ||
        mockupOptionsResponse.result ||
        mockupOptionsResponse ||
        [];

      if (!placementOptions.length) {
        throw new Error('This product has no supported printable mockup placements.');
      }

      const firstVariant = productInfo.variants?.[0];
      const defaultPlacement = buildSelectedPlacement(placementOptions[0], firstVariant?.id);

      if (!defaultPlacement) {
        throw new Error('No compatible mockup styles were found for this product.');
      }

      setMockupOptions(placementOptions);

      setProductData({
        selectedProduct: product,
        selectedVariant: firstVariant,
        selectedPlacement: defaultPlacement,
        designFile: undefined,
        designUrl: undefined,
        mockupTaskKey: undefined,
        mockupUrls: undefined,
        baseCost: firstVariant ? parseFloat(firstVariant.price) : 0,
        retailPrice: firstVariant ? parseFloat(firstVariant.price) + 5 : 15,
        productName: `Custom ${product.title}`,
        productDescription: ''
      });

      setCurrentStep(ProductCreationStep.CUSTOMIZE_DESIGN);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Failed to load product details.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVariantSelect = (variant: PrintfulVariant) => {
    const nextOption =
      mockupOptions.find(
        (option) => option.placement === productData.selectedPlacement?.placement
      ) || mockupOptions[0];

    const nextPlacement = nextOption
      ? buildSelectedPlacement(
          nextOption,
          variant.id,
          productData.selectedPlacement?.mockupStyleId
        )
      : undefined;

    setProductData((prev) => ({
      ...prev,
      selectedVariant: variant,
      selectedPlacement: nextPlacement,
      baseCost: parseFloat(variant.price),
      retailPrice: parseFloat(variant.price) + 5,
      mockupTaskKey: undefined,
      mockupUrls: undefined
    }));
  };

  const handlePlacementChange = (placementName: string) => {
    const option = mockupOptions.find((item) => item.placement === placementName);
    if (!option) return;

    const nextPlacement = buildSelectedPlacement(option, productData.selectedVariant?.id);

    setProductData((prev) => ({
      ...prev,
      selectedPlacement: nextPlacement,
      mockupTaskKey: undefined,
      mockupUrls: undefined
    }));
  };

  const handleMockupStyleChange = (styleId: number) => {
    if (!selectedPlacementOption) return;

    const style = compatibleStyles.find((item) => item.id === styleId);
    if (!style) return;

    setProductData((prev) => ({
      ...prev,
      selectedPlacement: {
        placement: selectedPlacementOption.placement,
        displayName: selectedPlacementOption.displayName,
        technique: selectedPlacementOption.technique,
        printAreaWidth: selectedPlacementOption.printAreaWidth,
        printAreaHeight: selectedPlacementOption.printAreaHeight,
        printAreaType: selectedPlacementOption.printAreaType,
        dpi: selectedPlacementOption.dpi,
        mockupStyleId: style.id,
        mockupStyleLabel: `${style.categoryName} - ${style.viewName}`,
        position: buildDefaultPosition(selectedPlacementOption)
      },
      mockupTaskKey: undefined,
      mockupUrls: undefined
    }));
  };

  const handleDesignUpload = async (file: File) => {
    if (!productData.selectedProduct || !productData.selectedVariant) {
      setError('Please select a product and variant first.');
      return;
    }

    if (!productData.selectedPlacement) {
      setError('Please select a valid print placement first.');
      return;
    }

    try {
      setIsLoading(true);
      setError('');

      setProductData((prev) => ({
        ...prev,
        designFile: file,
        designUrl: URL.createObjectURL(file),
        mockupTaskKey: undefined,
        mockupUrls: undefined
      }));

      const response = await printfulAPI.generateMockup({
        productId: productData.selectedProduct.id,
        variantIds: [productData.selectedVariant.id],
        artwork: file,
        placementData: productData.selectedPlacement
      });

      const taskKey = String(response.taskId || response.task_key);

      setProductData((prev) => ({
        ...prev,
        designFile: file,
        designUrl: prev.designUrl || URL.createObjectURL(file),
        mockupTaskKey: taskKey,
        mockupUrls: undefined
      }));

      pollMockupStatus(taskKey);
    } catch (err: any) {
      console.error('Failed to upload design:', err);

      let message = 'Failed to upload design file.';
      if (err?.response?.data?.message) {
        message = err.response.data.message;
      } else if (err?.message) {
        message = err.message;
      }

      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const pollMockupStatus = async (taskKey: string) => {
    const checkStatus = async () => {
      try {
        const statusResponse = await printfulAPI.getMockupStatus(taskKey);
        const status = statusResponse.result || statusResponse;

        if (status.status === 'completed') {
          const urls = (status.mockups || [])
            .map((item: any) => item.mockup_url)
            .filter(Boolean);

          if (!urls.length) {
            setError('Mockup finished, but no mockup images were returned.');
            return;
          }

          setProductData((prev) => ({
            ...prev,
            mockupUrls: urls
          }));
          return;
        }

        if (status.status === 'failed') {
          const reason =
            status.failureReasons?.[0]?.detail ||
            'Mockup generation failed.';
          setError(reason);
          return;
        }

        setTimeout(checkStatus, 3000);
      } catch (err) {
        console.error('Failed to check mockup status:', err);
        setError('Failed to check mockup generation status.');
      }
    };

    checkStatus();
  };

  const handlePriceChange = (newPrice: number) => {
    setProductData((prev) => ({
      ...prev,
      retailPrice: newPrice
    }));
  };

  const handleProductDetailsChange = (name: string, description: string) => {
    setProductData((prev) => ({
      ...prev,
      productName: name,
      productDescription: description
    }));
  };

  const handlePublish = async () => {
    try {
      setIsLoading(true);
      setError('');

      if (
        !userBrand ||
        !productData.selectedProduct ||
        !productData.selectedVariant ||
        !productData.mockupUrls?.length
      ) {
        setError('Missing required data for product creation.');
        return;
      }

      const payload = {
        brandId: userBrand._id,
        printfulProductId: productData.selectedProduct.id,
        name: productData.productName,
        description: productData.productDescription,
        variants: [
          {
            printfulVariantId: productData.selectedVariant.id,
            retailPrice: productData.retailPrice.toString(),
            baseCost: productData.selectedVariant.price,
            mockupUrl: productData.mockupUrls[0]
          }
        ]
      };

      await productAPI.createPrintfulProduct(payload);
      router.push('/dashboard?productCreated=true');
    } catch (err) {
      console.error(err);
      setError('Failed to publish product.');
    } finally {
      setIsLoading(false);
    }
  };

  const SelectProductStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-dark mb-2">Step 1: Select Base Product</h2>
        <p className="text-medium">Choose a product from the Printful catalog.</p>
      </div>

      <PrintfulCatalogBrowser onProductSelect={handleProductSelect} searchTerm="" />
    </div>
  );

  const CustomizeDesignStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-dark mb-2">Step 2: Customize Design</h2>
        <p className="text-medium">
          Pick a valid placement/style, upload your artwork, and generate the mockup.
        </p>
      </div>

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

      <div className="bg-white rounded-lg border p-6 space-y-4">
        <h3 className="text-lg font-semibold text-dark">Valid Print Placement</h3>

        {mockupOptions.length === 0 ? (
          <div className="text-sm text-medium">
            No placement options found for this product.
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-dark mb-2">
                  Placement
                </label>
                <select
                  value={productData.selectedPlacement?.placement || ''}
                  onChange={(e) => handlePlacementChange(e.target.value)}
                  className="w-full px-4 py-3 border rounded-lg focus:border-primary focus:outline-none"
                >
                  {mockupOptions.map((option) => (
                    <option key={option.placement} value={option.placement}>
                      {option.displayName} ({option.technique})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-dark mb-2">
                  Mockup Style
                </label>
                <select
                  value={productData.selectedPlacement?.mockupStyleId || ''}
                  onChange={(e) => handleMockupStyleChange(Number(e.target.value))}
                  className="w-full px-4 py-3 border rounded-lg focus:border-primary focus:outline-none"
                >
                  {compatibleStyles.map((style) => (
                    <option key={style.id} value={style.id}>
                      {style.categoryName} - {style.viewName}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {productData.selectedPlacement && (
              <div className="bg-light rounded-lg p-4 text-sm text-medium">
                <p>
                  <span className="font-medium text-dark">Selected placement:</span>{' '}
                  {productData.selectedPlacement.displayName}
                </p>
                <p>
                  <span className="font-medium text-dark">Technique:</span>{' '}
                  {productData.selectedPlacement.technique}
                </p>
                <p>
                  <span className="font-medium text-dark">Print area:</span>{' '}
                  {productData.selectedPlacement.printAreaWidth}" ×{' '}
                  {productData.selectedPlacement.printAreaHeight}"
                </p>
                <p>
                  <span className="font-medium text-dark">Mockup style:</span>{' '}
                  {productData.selectedPlacement.mockupStyleLabel}
                </p>
              </div>
            )}
          </>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-8">
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
                <p className="text-sm text-medium">PNG, JPG, or WEBP up to 15MB</p>
              </div>
            </label>
          ) : (
            <div className="space-y-4">
              <div className="bg-white border rounded-lg p-4">
                <img
                  src={productData.designUrl}
                  alt="Uploaded design"
                  className="w-full h-40 object-contain rounded"
                />
              </div>
              <button
                onClick={() =>
                  setProductData((prev) => ({
                    ...prev,
                    designFile: undefined,
                    designUrl: undefined,
                    mockupTaskKey: undefined,
                    mockupUrls: undefined
                  }))
                }
                className="text-sm text-primary hover:text-red-600"
              >
                Upload a different design
              </button>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-dark">Mockup Preview</h3>

          {productData.mockupUrls?.length ? (
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
          ) : productData.mockupTaskKey ? (
            <div className="bg-gray-50 border rounded-lg p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-medium">Generating mockups...</p>
            </div>
          ) : (
            <div className="bg-gray-50 border rounded-lg p-8 text-center">
              <p className="text-medium">
                Select a valid placement and upload a design to generate a mockup.
              </p>
            </div>
          )}
        </div>
      </div>

      {!!productData.mockupUrls?.length && (
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

  const SetPricingStep = () => {
    const earnings = calculateEarnings(productData.retailPrice, productData.baseCost);
    const isValidPrice = validateRetailPrice(productData.retailPrice, productData.baseCost);

    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-dark mb-2">Step 3: Set Price & View Profit</h2>
          <p className="text-medium">Set your selling price and see your earnings.</p>
        </div>

        <div className="max-w-2xl mx-auto bg-white rounded-lg border p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-dark mb-2">Base Cost</label>
            <div className="bg-gray-50 border rounded-lg p-3">
              <span className="text-lg font-semibold text-dark">
                {formatPrice(productData.baseCost)}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-dark mb-2">Retail Price</label>
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
              />
            </div>
            {!isValidPrice && (
              <p className="text-sm text-red-500 mt-1">
                Retail price must be at least {formatPrice(productData.baseCost)}
              </p>
            )}
          </div>

          <div className="bg-light p-4 rounded-lg">
            <h4 className="font-medium text-dark mb-3">Pricing Breakdown</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-medium">Customer pays:</span>
                <span className="font-medium text-dark">
                  {formatPrice(productData.retailPrice)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-medium">Printful cost:</span>
                <span className="text-red-500">
                  -{formatPrice(productData.baseCost)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-medium">Platform fee (30%):</span>
                <span className="text-red-500">
                  -{formatPrice((productData.retailPrice - productData.baseCost) * 0.3)}
                </span>
              </div>
              <hr className="border-gray-300" />
              <div className="flex justify-between font-semibold">
                <span className="text-dark">Your earnings:</span>
                <span className="text-green-600">{formatPrice(earnings)}</span>
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
      </div>
    );
  };

  const ProductDetailsStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-dark mb-2">Step 4: Add Product Details</h2>
        <p className="text-medium">Add the title and description your customers will see.</p>
      </div>

      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <label className="block text-sm font-medium text-dark mb-2">
            Product Name *
          </label>
          <input
            type="text"
            value={productData.productName}
            onChange={(e) =>
              handleProductDetailsChange(e.target.value, productData.productDescription)
            }
            className="w-full px-4 py-3 border rounded-lg focus:border-primary focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-dark mb-2">
            Product Description *
          </label>
          <textarea
            value={productData.productDescription}
            onChange={(e) =>
              handleProductDetailsChange(productData.productName, e.target.value)
            }
            rows={4}
            className="w-full px-4 py-3 border rounded-lg focus:border-primary focus:outline-none resize-none"
          />
        </div>

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
                  {productData.productDescription || 'Your description will appear here...'}
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

  const PublishStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-dark mb-2">Step 5: Publish Your Product</h2>
        <p className="text-medium">Review and publish your new product.</p>
      </div>

      <div className="max-w-2xl mx-auto">
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
                <h5 className="font-medium text-dark">Product</h5>
                <p className="text-sm text-medium">
                  {productData.selectedProduct?.title} - {productData.selectedProduct?.brand}
                </p>
              </div>

              <div>
                <h5 className="font-medium text-dark">Placement</h5>
                <p className="text-sm text-medium">
                  {productData.selectedPlacement?.displayName} ({productData.selectedPlacement?.mockupStyleLabel})
                </p>
              </div>

              <div>
                <h5 className="font-medium text-dark">Pricing</h5>
                <p className="text-sm text-medium">
                  Retail: {formatPrice(productData.retailPrice)} | Earnings:{' '}
                  {formatPrice(
                    calculateEarnings(productData.retailPrice, productData.baseCost)
                  )}
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
            <div className="mb-8">
              <button
                onClick={() =>
                  currentStep === ProductCreationStep.SELECT_PRODUCT
                    ? router.back()
                    : goToPreviousStep()
                }
                className="flex items-center text-medium hover:text-dark transition-colors mb-4"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                {currentStep === ProductCreationStep.SELECT_PRODUCT
                  ? 'Back to Dashboard'
                  : 'Previous Step'}
              </button>

              <div className="flex items-center space-x-2 mb-4">
                {Object.values(ProductCreationStep).map((step, index) => {
                  const isActive = step === currentStep;
                  const isCompleted =
                    Object.values(ProductCreationStep).indexOf(currentStep) > index;

                  return (
                    <div key={step} className="flex items-center">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                          isActive
                            ? 'bg-primary text-white'
                            : isCompleted
                            ? 'bg-green-500 text-white'
                            : 'bg-gray-200 text-gray-500'
                        }`}
                      >
                        {isCompleted ? '✓' : index + 1}
                      </div>
                      {index < Object.values(ProductCreationStep).length - 1 && (
                        <div
                          className={`w-8 h-1 mx-2 ${
                            isCompleted ? 'bg-green-500' : 'bg-gray-200'
                          }`}
                        />
                      )}
                    </div>
                  );
                })}
              </div>

              <h1 className="text-3xl font-bold text-dark">Create Your Product</h1>
            </div>

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
