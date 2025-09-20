// ################## ----- PRINTFUL API UTILITIES ----- ##################
// Utility functions for interacting with the Printful API
// Handles product catalog, design uploads, and mockup generation
// #######################################################################

const PRINTFUL_API_BASE = 'https://api.printful.com';

// ################## ----- PRINTFUL PRODUCT INTERFACE ----- ##################
// Data structure for Printful products and variants
export interface PrintfulProduct {
  id: number;
  main_category_id: number;
  type: string;
  type_name: string;
  title: string;
  brand: string;
  model: string;
  image: string;
  variant_count: number;
  currency: string;
  dimensions?: {
    width: string;
    height: string;
  };
}

export interface PrintfulVariant {
  id: number;
  product_id: number;
  name: string;
  size: string;
  color: string;
  color_code: string;
  color_code2?: string;
  image: string;
  price: string;
  in_stock: boolean;
  availability_regions: {
    US: string;
    EU: string;
    MX: string;
  };
  availability_status: {
    US: string;
    EU: string;
    MX: string;
  };
}

export interface PrintfulCategory {
  id: number;
  parent_id: number;
  image_url: string;
  catalog_position: number;
  size: string;
  title: string;
}

// ################## ----- DESIGN FILE INTERFACE ----- ##################
// Structure for design files and mockup generation
export interface DesignFile {
  id?: number;
  name: string;
  type: 'default' | 'mockup' | 'template';
  url: string;
  filename: string;
  visible: boolean;
  position?: {
    area_width: number;
    area_height: number;
    width: number;
    height: number;
    top: number;
    left: number;
  };
}

export interface MockupGenerationRequest {
  variant_ids: number[];
  format: 'jpg' | 'png';
  files: Array<{
    placement: string;
    image_url: string;
    position?: {
      area_width: number;
      area_height: number;
      width: number;
      height: number;
      top: number;
      left: number;
    };
  }>;
}

export interface MockupGenerationResponse {
  code: number;
  result: {
    task_key: string;
    status: string;
  };
  extra: any[];
}

// ################## ----- API CLIENT CLASS ----- ##################
// Main class for Printful API interactions
export class PrintfulClient {
  private apiKey: string;
  private baseUrl: string;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.NEXT_PUBLIC_PRINTFUL_API_KEY || '';
    this.baseUrl = PRINTFUL_API_BASE;
  }

  // ################## ----- HTTP REQUEST HELPER ----- ##################
  // Generic method for making authenticated API requests
  private async makeRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.apiKey}`,
      ...options.headers,
    };

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      throw new Error(`Printful API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.result || data;
  }

  // ################## ----- PRODUCT CATALOG METHODS ----- ##################
  // Methods for fetching products and categories from Printful

  /**
   * Get all available categories
   */
  async getCategories(): Promise<PrintfulCategory[]> {
    return this.makeRequest<PrintfulCategory[]>('/categories');
  }

  /**
   * Get all products in a specific category
   */
  async getProductsByCategory(categoryId: number): Promise<PrintfulProduct[]> {
    return this.makeRequest<PrintfulProduct[]>(`/products?category_id=${categoryId}`);
  }

  /**
   * Get all available products
   */
  async getAllProducts(): Promise<PrintfulProduct[]> {
    return this.makeRequest<PrintfulProduct[]>('/products');
  }

  /**
   * Get detailed information about a specific product
   */
  async getProduct(productId: number): Promise<PrintfulProduct> {
    return this.makeRequest<PrintfulProduct>(`/products/${productId}`);
  }

  /**
   * Get all variants for a specific product
   */
  async getProductVariants(productId: number): Promise<PrintfulVariant[]> {
    return this.makeRequest<PrintfulVariant[]>(`/products/${productId}`);
  }

  // ################## ----- FILE UPLOAD METHODS ----- ##################
  // Methods for uploading design files to Printful

  /**
   * Upload a design file to Printful
   */
  async uploadFile(file: File): Promise<DesignFile> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${this.baseUrl}/files`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`File upload failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.result;
  }

  /**
   * Upload design file from URL
   */
  async uploadFileFromUrl(url: string, filename: string): Promise<DesignFile> {
    const body = {
      url,
      filename,
    };

    return this.makeRequest<DesignFile>('/files', {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  // ################## ----- MOCKUP GENERATION METHODS ----- ##################
  // Methods for generating product mockups with designs

  /**
   * Generate mockup images for a product with design
   */
  async generateMockup(request: MockupGenerationRequest): Promise<MockupGenerationResponse> {
    return this.makeRequest<MockupGenerationResponse>('/mockup-generator/create-task', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  /**
   * Check the status of a mockup generation task
   */
  async getMockupTaskResult(taskKey: string): Promise<any> {
    return this.makeRequest(`/mockup-generator/task?task_key=${taskKey}`);
  }

  /**
   * Get available print files for a product (for design placement)
   */
  async getProductPrintFiles(productId: number): Promise<any> {
    return this.makeRequest(`/products/${productId}/printfiles`);
  }
}

// ################## ----- PROFIT CALCULATION UTILITIES ----- ##################
// Helper functions for calculating pricing and profits

/**
 * Calculate user earnings from retail price and base cost
 * Formula: (Retail Price - Base Cost) * 0.70
 */
export function calculateEarnings(retailPrice: number, baseCost: number): number {
  if (retailPrice < baseCost) {
    return 0;
  }
  return (retailPrice - baseCost) * 0.70;
}

/**
 * Calculate minimum retail price based on base cost
 */
export function getMinimumRetailPrice(baseCost: number): number {
  return baseCost;
}

/**
 * Validate retail price against base cost
 */
export function validateRetailPrice(retailPrice: number, baseCost: number): boolean {
  return retailPrice >= baseCost;
}

/**
 * Format price for display
 */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);
}

// ################## ----- MOCK DATA FOR DEVELOPMENT ----- ##################
// Mock data for development when API is not available

export const MOCK_CATEGORIES: PrintfulCategory[] = [
  {
    id: 24,
    parent_id: 0,
    image_url: "https://files.cdn.printful.com/categories/unisex-premium-t-shirt.jpg",
    catalog_position: 1,
    size: "medium",
    title: "T-Shirts"
  },
  {
    id: 26,
    parent_id: 0,
    image_url: "https://files.cdn.printful.com/categories/unisex-premium-hoodie.jpg",
    catalog_position: 2,
    size: "medium",
    title: "Hoodies & Sweatshirts"
  },
  {
    id: 77,
    parent_id: 0,
    image_url: "https://files.cdn.printful.com/categories/11oz-mug.jpg",
    catalog_position: 3,
    size: "medium",
    title: "Mugs"
  },
  {
    id: 29,
    parent_id: 0,
    image_url: "https://files.cdn.printful.com/categories/poster.jpg",
    catalog_position: 4,
    size: "medium",
    title: "Posters & Prints"
  }
];

export const MOCK_PRODUCTS: PrintfulProduct[] = [
  {
    id: 71,
    main_category_id: 24,
    type: "t-shirt",
    type_name: "T-Shirt",
    title: "Unisex Jersey Short Sleeve Tee",
    brand: "Bella + Canvas",
    model: "3001",
    image: "https://files.cdn.printful.com/products/71/product_1581412973.jpg",
    variant_count: 54,
    currency: "USD"
  },
  {
    id: 146,
    main_category_id: 26,
    type: "hoodie",
    type_name: "Hoodie",
    title: "Unisex Heavy Blend™ Hooded Sweatshirt",
    brand: "Gildan",
    model: "18500",
    image: "https://files.cdn.printful.com/products/146/product_1581413271.jpg",
    variant_count: 45,
    currency: "USD"
  },
  {
    id: 19,
    main_category_id: 77,
    type: "mug",
    type_name: "Mug",
    title: "White glossy mug",
    brand: "Generic brand",
    model: "11oz",
    image: "https://files.cdn.printful.com/products/19/product_1581412454.jpg",
    variant_count: 1,
    currency: "USD"
  }
];

export default PrintfulClient;
