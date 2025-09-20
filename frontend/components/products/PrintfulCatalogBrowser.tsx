import React, { useState, useEffect } from 'react';
import { printfulAPI } from '@/utils/api';
import { PrintfulCategory, PrintfulProduct, formatPrice } from '@/utils/printful';
import PrintfulProductPreview from './PrintfulProductPreview';
import { PrintfulErrorHandler, PrintfulLoadingSkeleton } from './PrintfulErrorHandling';

// ################## ----- INTERFACES ----- ##################
interface PrintfulCatalogBrowserProps {
  onProductSelect: (product: PrintfulProduct) => void;
  selectedCategoryId?: number;
  searchTerm?: string;
}

interface FilterState {
  categoryIds: number[];
  priceRange: 'all' | 'low' | 'medium' | 'high';
  searchTerm: string;
}

// ################## ----- CATALOG BROWSER COMPONENT ----- ##################
// Standalone component for browsing the Printful product catalog
// Features: category filtering, search, price filtering, product preview
// #########################################################################
const PrintfulCatalogBrowser: React.FC<PrintfulCatalogBrowserProps> = ({
  onProductSelect,
  selectedCategoryId,
  searchTerm = ''
}) => {
  const [categories, setCategories] = useState<PrintfulCategory[]>([]);
  const [products, setProducts] = useState<PrintfulProduct[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<PrintfulProduct[]>([]);
  const [filters, setFilters] = useState<FilterState>({
    categoryIds: selectedCategoryId ? [selectedCategoryId] : [],
    priceRange: 'all',
    searchTerm
  });
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [error, setError] = useState('');

  // ################## ----- LOAD INITIAL DATA ----- ##################
  useEffect(() => {
    loadCategories();
  }, []);

  // ################## ----- UPDATE FILTERS EFFECT ----- ##################
  useEffect(() => {
    if (filters.categoryIds.length > 0) {
      loadProductsByCategories(filters.categoryIds);
    } else {
      // When no categories selected, show no products
      setProducts([]);
    }
  }, [filters.categoryIds]);

  // ################## ----- FILTER PRODUCTS EFFECT ----- ##################
  useEffect(() => {
    applyFilters();
  }, [products, filters.searchTerm, filters.priceRange]);

  // ################## ----- LOAD CATEGORIES ----- ##################
  const loadCategories = async () => {
    try {
      setIsLoadingCategories(true);
      setError('');
      const response = await printfulAPI.getCategories();
      
      // Handle different possible response structures for categories
      let categoriesData = [];
      if (response?.categories && Array.isArray(response.categories)) {
        categoriesData = response.categories;
      } else if (response?.data?.categories && Array.isArray(response.data.categories)) {
        categoriesData = response.data.categories;
      } else if (response?.result && Array.isArray(response.result)) {
        categoriesData = response.result;
      } else if (response?.data && Array.isArray(response.data)) {
        categoriesData = response.data;
      } else if (Array.isArray(response)) {
        categoriesData = response;
      } else {
        console.warn('Unexpected categories response structure:', response);
        categoriesData = [];
      }
      
      setCategories(categoriesData);
      
      // Don't auto-select any categories - let user choose
    } catch (err: any) {
      setError('Failed to load categories');
      console.error('Failed to load categories:', err);
    } finally {
      setIsLoadingCategories(false);
    }
  };

  // ################## ----- LOAD PRODUCTS BY CATEGORIES ----- ##################
  const loadProductsByCategories = async (categoryIds: number[]) => {
    try {
      setIsLoadingProducts(true);
      setError('');
      
      if (categoryIds.length === 0) {
        setProducts([]);
        return;
      }
      
      // Load products from all selected categories in parallel
      const productPromises = categoryIds.map(categoryId => 
        printfulAPI.getProducts(categoryId)
      );
      
      const responses = await Promise.all(productPromises);
      
      // Combine all products from different categories
      const allProducts: PrintfulProduct[] = [];
      responses.forEach(response => {
        let productsData = [];
        if (response?.products && Array.isArray(response.products)) {
          productsData = response.products;
        } else if (response?.data?.products && Array.isArray(response.data.products)) {
          productsData = response.data.products;
        } else if (response?.result && Array.isArray(response.result)) {
          productsData = response.result;
        } else if (response?.data && Array.isArray(response.data)) {
          productsData = response.data;
        } else if (Array.isArray(response)) {
          productsData = response;
        } else {
          console.warn('Unexpected products response structure:', response);
          productsData = [];
        }
        allProducts.push(...productsData);
      });
      
      // Remove duplicates based on product id
      const uniqueProducts = allProducts.filter((product, index, self) =>
        index === self.findIndex(p => p.id === product.id)
      );
      
      setProducts(uniqueProducts);
    } catch (err: any) {
      setError('Failed to load products');
      console.error('Failed to load products:', err);
    } finally {
      setIsLoadingProducts(false);
    }
  };

  // ################## ----- LOAD PRODUCTS BY CATEGORY ----- ##################
  const loadProductsByCategory = async (categoryId: number) => {
    try {
      setIsLoadingProducts(true);
      setError('');
      const response = await printfulAPI.getProducts(categoryId);
      
      // Handle different possible response structures for products
      let productsData = [];
      if (response?.products && Array.isArray(response.products)) {
        productsData = response.products;
      } else if (response?.data?.products && Array.isArray(response.data.products)) {
        productsData = response.data.products;
      } else if (response?.result && Array.isArray(response.result)) {
        productsData = response.result;
      } else if (response?.data && Array.isArray(response.data)) {
        productsData = response.data;
      } else if (Array.isArray(response)) {
        productsData = response;
      } else {
        console.warn('Unexpected products response structure:', response);
        productsData = [];
      }
      
      setProducts(productsData);
    } catch (err: any) {
      setError('Failed to load products');
      console.error('Failed to load products:', err);
    } finally {
      setIsLoadingProducts(false);
    }
  };

  // ################## ----- APPLY FILTERS ----- ##################
  const applyFilters = () => {
    let filtered = [...products];

    // Search filter
    if (filters.searchTerm.trim()) {
      const searchLower = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(product =>
        product.title.toLowerCase().includes(searchLower) ||
        product.brand.toLowerCase().includes(searchLower) ||
        product.type_name.toLowerCase().includes(searchLower)
      );
    }

    // Price range filter (mock implementation - would need actual pricing data)
    if (filters.priceRange !== 'all') {
      // This would need to be implemented with actual pricing data from Printful
      // For now, we'll keep all products
    }

    setFilteredProducts(filtered);
  };

  // ################## ----- FILTER HANDLERS ----- ##################
  const handleCategoryToggle = (categoryId: number) => {
    setFilters(prev => {
      const isSelected = prev.categoryIds.includes(categoryId);
      const newCategoryIds = isSelected
        ? prev.categoryIds.filter(id => id !== categoryId)
        : [...prev.categoryIds, categoryId];
      return { ...prev, categoryIds: newCategoryIds };
    });
  };

  const handleSearchChange = (searchTerm: string) => {
    setFilters(prev => ({ ...prev, searchTerm }));
  };

  const handlePriceRangeChange = (priceRange: FilterState['priceRange']) => {
    setFilters(prev => ({ ...prev, priceRange }));
  };

  // ################## ----- LOADING STATE ----- ##################
  if (isLoadingCategories) {
    return (
      <div className="space-y-6">
        <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
        <div className="flex flex-wrap gap-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-8 w-20 bg-gray-200 rounded animate-pulse"></div>
          ))}
        </div>
        <PrintfulLoadingSkeleton type="category" count={8} />
      </div>
    );
  }

  // ################## ----- ERROR STATE ----- ##################
  if (error && !categories.length) {
    return (
      <PrintfulErrorHandler
        error={error}
        onRetry={loadCategories}
        context="load catalog"
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Searchable Category Multiselect */}
      <div className="relative">
        <div className="relative">
          <input
            type="text"
            placeholder="Search products or click to select categories..."
            value={filters.searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
          <svg className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <button
            onClick={() => setIsSearchFocused(!isSearchFocused)}
            className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
          >
            <svg className={`w-5 h-5 transition-transform ${isSearchFocused ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        {/* Category Dropdown */}
        {isSearchFocused && (
          <>
            <div 
              className="fixed inset-0 z-10" 
              onClick={() => setIsSearchFocused(false)}
            />
            <div className="absolute top-full left-0 right-0 z-20 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-64 overflow-y-auto">
              <div className="p-2">
                <div className="text-xs font-medium text-gray-500 uppercase tracking-wider px-2 py-1">
                  Categories ({filters.categoryIds.length} selected)
                </div>
                {Array.isArray(categories) && categories.map((category) => {
                  const isSelected = filters.categoryIds.includes(category.id);
                  return (
                    <label
                      key={category.id}
                      className="flex items-center px-2 py-2 hover:bg-gray-50 cursor-pointer rounded"
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleCategoryToggle(category.id)}
                        className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                      />
                      <span className="ml-3 text-sm text-gray-900">{category.title}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Selected Categories Display */}
      {filters.categoryIds.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {filters.categoryIds.map(categoryId => {
            const category = categories.find(c => c.id === categoryId);
            return category ? (
              <span
                key={categoryId}
                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary text-white"
              >
                {category.title}
                <button
                  onClick={() => handleCategoryToggle(categoryId)}
                  className="ml-2 text-white hover:text-gray-200"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            ) : null;
          })}
        </div>
      )}

      {/* Price Range Filter and Results Count */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium text-gray-700">Price:</label>
          <select
            value={filters.priceRange}
            onChange={(e) => handlePriceRangeChange(e.target.value as FilterState['priceRange'])}
            className="border border-gray-300 rounded px-3 py-1 text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="all">All Prices</option>
            <option value="low">Under $15</option>
            <option value="medium">$15 - $30</option>
            <option value="high">Over $30</option>
          </select>
        </div>

        {/* Results Count */}
        <div className="text-sm text-gray-500">
          {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
        </div>
      </div>

      {/* Products Grid */}
      {isLoadingProducts ? (
        <PrintfulLoadingSkeleton type="grid" count={6} />
      ) : Array.isArray(filteredProducts) && filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProducts.map((product) => (
            <PrintfulProductPreview
              key={product.id}
              product={product}
              onClick={() => onProductSelect(product)}
              showPrice={false}
              showVariantCount={true}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.5-.881-6.172-2.328C5.92 12.672 6 12.84 6 13c0 .828.448 1.5 1 1.5s1-.672 1-1.5c0-.16.08-.328.172-.328z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {filters.categoryIds.length === 0 ? 'Select categories to browse products' : 'No products found'}
          </h3>
          <p className="text-gray-600">
            {filters.categoryIds.length === 0 
              ? 'Click on the search bar above to choose product categories'
              : filters.searchTerm 
                ? 'Try adjusting your search terms or selecting different categories' 
                : 'No products available in the selected categories'}
          </p>
        </div>
      )}

      {/* Error Display */}
      {error && products.length > 0 && (
        <PrintfulErrorHandler
          error={error}
          onRetry={() => filters.categoryIds.length > 0 && loadProductsByCategories(filters.categoryIds)}
          context="load products"
          className="mb-6"
        />
      )}
    </div>
  );
};

export default PrintfulCatalogBrowser;
