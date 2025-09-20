import React from 'react';
import { PrintfulProduct, PrintfulVariant, formatPrice } from '@/utils/printful';

// ################## ----- INTERFACES ----- ##################
interface ProductPreviewProps {
  product: PrintfulProduct;
  variant?: PrintfulVariant;
  designUrl?: string;
  mockupUrls?: string[];
  onClick?: () => void;
  isSelected?: boolean;
  showPrice?: boolean;
  showVariantCount?: boolean;
  className?: string;
}

// ################## ----- PRODUCT PREVIEW COMPONENT ----- ##################
// Reusable component for displaying Printful products with pricing and details
// Used in catalog browser, product selection, and product management
// ##########################################################################
const PrintfulProductPreview: React.FC<ProductPreviewProps> = ({
  product,
  variant,
  designUrl,
  mockupUrls,
  onClick,
  isSelected = false,
  showPrice = true,
  showVariantCount = true,
  className = ''
}) => {
  // ################## ----- GET DISPLAY IMAGE ----- ##################
  const getDisplayImage = (): string => {
    // Priority: Custom mockup > Design overlay > Variant image > Product image
    if (mockupUrls && mockupUrls.length > 0) {
      return mockupUrls[0];
    }
    if (variant?.image) {
      return variant.image;
    }
    return product.image;
  };

  // ################## ----- GET PRODUCT TITLE ----- ##################
  const getProductTitle = (): string => {
    if (variant) {
      return `${product.title} - ${variant.name}`;
    }
    return product.title;
  };

  // ################## ----- GET PRODUCT SUBTITLE ----- ##################
  const getProductSubtitle = (): string => {
    let subtitle = `${product.brand}`;
    if (product.model) {
      subtitle += ` • ${product.model}`;
    }
    if (variant) {
      subtitle += ` • ${variant.size} • ${variant.color}`;
    }
    return subtitle;
  };

  return (
    <div
      onClick={onClick}
      className={`
        bg-white rounded-lg border transition-all duration-200
        ${onClick ? 'cursor-pointer hover:shadow-md' : ''}
        ${isSelected ? 'border-primary ring-2 ring-primary ring-opacity-50' : 'border-gray-200 hover:border-gray-300'}
        ${className}
      `}
    >
      {/* Product Image */}
      <div className="relative overflow-hidden rounded-t-lg bg-gray-100">
        <img
          src={getDisplayImage()}
          alt={getProductTitle()}
          className={`w-full h-48 object-cover transition-transform duration-300 ${
            onClick ? 'group-hover:scale-105' : ''
          }`}
        />
        
        {/* Custom Design Overlay Indicator */}
        {designUrl && (
          <div className="absolute top-2 left-2 bg-primary text-white px-2 py-1 rounded-md text-xs font-medium">
            Custom Design
          </div>
        )}

        {/* Stock Status */}
        {variant && (
          <div className="absolute top-2 right-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              variant.in_stock
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}>
              {variant.in_stock ? 'In Stock' : 'Out of Stock'}
            </span>
          </div>
        )}

        {/* Multiple Images Indicator */}
        {mockupUrls && mockupUrls.length > 1 && (
          <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded-md text-xs">
            +{mockupUrls.length - 1} more
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="p-4">
        {/* Title */}
        <h3 className={`font-semibold text-gray-900 mb-1 line-clamp-2 ${
          onClick ? 'group-hover:text-primary' : ''
        }`}>
          {getProductTitle()}
        </h3>

        {/* Subtitle */}
        <p className="text-sm text-gray-600 mb-3 line-clamp-1">
          {getProductSubtitle()}
        </p>

        {/* Product Type Badge */}
        <div className="mb-3">
          <span className="inline-block bg-gray-100 text-gray-700 px-2 py-1 rounded-md text-xs font-medium">
            {product.type_name || product.type}
          </span>
        </div>

        {/* Bottom Section */}
        <div className="flex items-center justify-between">
          {/* Variant Count or Additional Info */}
          <div className="text-xs text-gray-500">
            {showVariantCount && (
              <span>
                {product.variant_count} variant{product.variant_count !== 1 ? 's' : ''}
              </span>
            )}
            {variant && (
              <div className="flex items-center space-x-2 mt-1">
                {/* Color Swatch */}
                {variant.color_code && (
                  <div className="flex space-x-1">
                    <div
                      className="w-3 h-3 rounded-full border border-gray-300"
                      style={{ backgroundColor: variant.color_code }}
                    ></div>
                    {variant.color_code2 && (
                      <div
                        className="w-3 h-3 rounded-full border border-gray-300"
                        style={{ backgroundColor: variant.color_code2 }}
                      ></div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Price */}
          {showPrice && variant && (
            <div className="text-right">
              <p className="text-lg font-bold text-primary">
                {formatPrice(parseFloat(variant.price))}
              </p>
              <p className="text-xs text-gray-500">Base Cost</p>
            </div>
          )}
        </div>

        {/* Availability Regions (if variant selected) */}
        {variant && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-600">Available in:</span>
              <div className="flex space-x-2">
                {variant.availability_regions?.US && (
                  <span className={`px-1 py-0.5 rounded text-xs ${
                    variant.availability_status?.US === 'in_stock'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}>
                    US
                  </span>
                )}
                {variant.availability_regions?.EU && (
                  <span className={`px-1 py-0.5 rounded text-xs ${
                    variant.availability_status?.EU === 'in_stock'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}>
                    EU
                  </span>
                )}
                {variant.availability_regions?.MX && (
                  <span className={`px-1 py-0.5 rounded text-xs ${
                    variant.availability_status?.MX === 'in_stock'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}>
                    MX
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Action Button (if clickable) */}
        {onClick && (
          <div className="mt-4">
            <button className={`w-full py-2 px-4 rounded-md font-medium text-sm transition-colors ${
              isSelected
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}>
              {isSelected ? 'Selected' : 'Select Product'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PrintfulProductPreview;
