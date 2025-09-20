import React, { useState, useEffect } from 'react';
import { printfulAPI } from '@/utils/api';
import { PrintfulProduct, PrintfulVariant, formatPrice } from '@/utils/printful';

// ################## ----- INTERFACES ----- ##################
interface PrintfulVariantSelectorProps {
  product: PrintfulProduct;
  selectedVariant?: PrintfulVariant;
  onVariantSelect: (variant: PrintfulVariant) => void;
  className?: string;
}

interface VariantGroup {
  sizes: string[];
  colors: { name: string; code: string; code2?: string }[];
}

// ################## ----- VARIANT SELECTOR COMPONENT ----- ##################
// Component for selecting product variants (size, color, style)
// Groups variants by size and color for better UX
// ###############################################################
const PrintfulVariantSelector: React.FC<PrintfulVariantSelectorProps> = ({
  product,
  selectedVariant,
  onVariantSelect,
  className = ''
}) => {
  const [variants, setVariants] = useState<PrintfulVariant[]>([]);
  const [variantGroups, setVariantGroups] = useState<VariantGroup>({ sizes: [], colors: [] });
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // ################## ----- LOAD VARIANTS ----- ##################
  useEffect(() => {
    if (product.id) {
      loadProductVariants();
    }
  }, [product.id]);

  // ################## ----- UPDATE SELECTION ----- ##################
  useEffect(() => {
    if (variants.length > 0 && selectedSize && selectedColor) {
      const variant = findVariant(selectedSize, selectedColor);
      if (variant && variant.id !== selectedVariant?.id) {
        onVariantSelect(variant);
      }
    }
  }, [selectedSize, selectedColor, variants]);

  // ################## ----- SYNC WITH EXTERNAL SELECTION ----- ##################
  useEffect(() => {
    if (selectedVariant && variants.length > 0) {
      setSelectedSize(selectedVariant.size);
      setSelectedColor(selectedVariant.color);
    }
  }, [selectedVariant, variants]);

  // ################## ----- LOAD PRODUCT VARIANTS ----- ##################
  const loadProductVariants = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      const response = await printfulAPI.getProduct(product.id);
      const productData = response.result || response;
      const variantsData = productData.variants || [];
      
      setVariants(variantsData);
      processVariantGroups(variantsData);
      
      // Auto-select first available variant if none selected
      if (!selectedVariant && variantsData.length > 0) {
        const firstVariant = variantsData.find((v: PrintfulVariant) => v.in_stock);
        if (firstVariant) {
          setSelectedSize(firstVariant.size);
          setSelectedColor(firstVariant.color);
          onVariantSelect(firstVariant);
        }
      }
    } catch (err: any) {
      setError('Failed to load product variants');
      console.error('Failed to load variants:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // ################## ----- PROCESS VARIANT GROUPS ----- ##################
  const processVariantGroups = (variantsData: PrintfulVariant[]) => {
    const sizes = [...new Set(variantsData.map(v => v.size))].sort();
    const colors = [...new Set(variantsData.map(v => v.color))].map(colorName => {
      const variant = variantsData.find(v => v.color === colorName);
      return {
        name: colorName,
        code: variant?.color_code || '#000',
        code2: variant?.color_code2
      };
    });

    setVariantGroups({ sizes, colors });
  };

  // ################## ----- FIND VARIANT ----- ##################
  const findVariant = (size: string, color: string): PrintfulVariant | undefined => {
    return variants.find(v => v.size === size && v.color === color);
  };

  // ################## ----- CHECK VARIANT AVAILABILITY ----- ##################
  const isVariantAvailable = (size: string, color: string): boolean => {
    const variant = findVariant(size, color);
    return variant ? variant.in_stock : false;
  };

  // ################## ----- GET VARIANT PRICE ----- ##################
  const getVariantPrice = (size: string, color: string): string => {
    const variant = findVariant(size, color);
    return variant ? formatPrice(parseFloat(variant.price)) : '';
  };

  // ################## ----- LOADING STATE ----- ##################
  if (isLoading) {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-16 mb-3"></div>
          <div className="grid grid-cols-4 gap-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-8 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-16 mb-3"></div>
          <div className="grid grid-cols-3 gap-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-8 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ################## ----- ERROR STATE ----- ##################
  if (error) {
    return (
      <div className={`bg-red-50 border border-red-200 rounded-lg p-4 ${className}`}>
        <p className="text-red-800 text-sm">{error}</p>
        <button
          onClick={loadProductVariants}
          className="mt-2 text-sm text-red-600 hover:text-red-800"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Size Selection */}
      {variantGroups.sizes.length > 1 && (
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-3">Size</h4>
          <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-2">
            {variantGroups.sizes.map((size) => {
              const hasAvailableColors = variantGroups.colors.some(color => 
                isVariantAvailable(size, color.name)
              );
              
              return (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  disabled={!hasAvailableColors}
                  className={`px-3 py-2 text-sm font-medium rounded-md border transition-colors ${
                    selectedSize === size
                      ? 'bg-primary text-white border-primary'
                      : hasAvailableColors
                        ? 'bg-white text-gray-900 border-gray-300 hover:bg-gray-50'
                        : 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                  }`}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Color Selection */}
      {variantGroups.colors.length > 1 && (
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-3">Color</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {variantGroups.colors.map((color) => {
              const isAvailable = selectedSize ? isVariantAvailable(selectedSize, color.name) : true;
              const isSelected = selectedColor === color.name;
              
              return (
                <button
                  key={color.name}
                  onClick={() => setSelectedColor(color.name)}
                  disabled={!isAvailable}
                  className={`flex items-center space-x-3 px-3 py-2 text-sm font-medium rounded-lg border transition-colors ${
                    isSelected
                      ? 'bg-primary text-white border-primary'
                      : isAvailable
                        ? 'bg-white text-gray-900 border-gray-300 hover:bg-gray-50'
                        : 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                  }`}
                >
                  {/* Color Swatch */}
                  <div className="flex space-x-1">
                    <div
                      className={`w-4 h-4 rounded-full border-2 ${isSelected ? 'border-white' : 'border-gray-300'}`}
                      style={{ backgroundColor: color.code }}
                    ></div>
                    {color.code2 && (
                      <div
                        className={`w-4 h-4 rounded-full border-2 ${isSelected ? 'border-white' : 'border-gray-300'}`}
                        style={{ backgroundColor: color.code2 }}
                      ></div>
                    )}
                  </div>
                  <span className="truncate">{color.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Selected Variant Info */}
      {selectedSize && selectedColor && (
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <h5 className="font-medium text-gray-900">Selected Variant</h5>
              <p className="text-sm text-gray-600">
                {selectedSize} • {selectedColor}
              </p>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-primary">
                {getVariantPrice(selectedSize, selectedColor)}
              </p>
              <p className="text-xs text-gray-500">Base Cost</p>
            </div>
          </div>
          
          {/* Availability Status */}
          {selectedVariant && (
            <div className="mt-3 pt-3 border-t border-gray-200">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Availability:</span>
                <div className="flex space-x-4">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    selectedVariant.availability_status?.US === 'in_stock'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    US: {selectedVariant.availability_regions?.US || 'Unknown'}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    selectedVariant.availability_status?.EU === 'in_stock'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    EU: {selectedVariant.availability_regions?.EU || 'Unknown'}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Variant Count Info */}
      <div className="text-xs text-gray-500 text-center">
        {variants.length} variant{variants.length !== 1 ? 's' : ''} available • 
        {variants.filter(v => v.in_stock).length} in stock
      </div>
    </div>
  );
};

export default PrintfulVariantSelector;
