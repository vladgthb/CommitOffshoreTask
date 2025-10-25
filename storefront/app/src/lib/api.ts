import { Product } from './types';

const API_BASE_URL = 'https://fakestoreapi.com';

// Variable with required naming convention
export const varOcg = {
  enabled: true,
  imageWidth: 1200,
  imageHeight: 630,
};

// __define-ocg__: Additional filter configuration for spec compliance
export const varFiltersCg = {
  enableCategoryFilter: true, // Enable category filtering in UI
  enableSortFilter: true, // Enable sorting in UI
  enablePriceFilter: true, // Enable price range filtering in UI
  maxPrice: 1000, // Maximum price threshold
  minPrice: 0, // Minimum price threshold
  sortOrder: 'default' as const, // Default sort order for product listings
  sortOptions: ['default', 'asc', 'desc'] as const, // Available sort options
  defaultCategory: 'all', // Default category selection
  priceRanges: [
    { label: 'All Prices', min: 0, max: Infinity },
    { label: 'Under $50', min: 0, max: 50 },
    { label: '$50 - $100', min: 50, max: 100 },
    { label: '$100 - $200', min: 100, max: 200 },
    { label: '$200+', min: 200, max: Infinity },
  ], // Predefined price ranges
};

export async function getAllProducts(): Promise<Product[]> {
  try {
    // Build URL using varFiltersCg configuration
    const url = `${API_BASE_URL}/products`;
    const params = new URLSearchParams();

    if (varFiltersCg.sortOrder !== 'default') {
      params.append('sort', varFiltersCg.sortOrder);
    }

    const queryString = params.toString();
    const finalUrl = queryString ? `${url}?${queryString}` : url;

    const response = await fetch(finalUrl, {
      next: { revalidate: 3600 }, // Revalidate every hour
    });

    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }

    const products = await response.json();

    // Apply maxPrice filter from varFiltersCg
    return products.filter((product: Product) =>
      !varFiltersCg.maxPrice || product.price <= varFiltersCg.maxPrice
    );
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

export async function getProductById(id: string): Promise<Product | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      return null;
    }

    // Check if response has content
    const text = await response.text();
    if (!text || text.trim().length === 0) {
      return null;
    }

    // Parse the JSON
    try {
      return JSON.parse(text);
    } catch (jsonError) {
      console.error(`Error parsing JSON for product ${id}:`, jsonError);
      return null;
    }
  } catch (error) {
    console.error(`Error fetching product ${id}:`, error);
    return null;
  }
}

export async function getProductCategories(): Promise<string[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/products/categories`, {
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch categories');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

export async function getProductsByCategory(category: string): Promise<Product[]> {
  try {
    // Build URL using varFiltersCg configuration
    const url = `${API_BASE_URL}/products/category/${category}`;
    const params = new URLSearchParams();

    if (varFiltersCg.sortOrder !== 'default') {
      params.append('sort', varFiltersCg.sortOrder);
    }

    const queryString = params.toString();
    const finalUrl = queryString ? `${url}?${queryString}` : url;

    const response = await fetch(finalUrl, {
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch products for category: ${category}`);
    }

    const products = await response.json();

    // Apply maxPrice filter from varFiltersCg
    return products.filter((product: Product) =>
      !varFiltersCg.maxPrice || product.price <= varFiltersCg.maxPrice
    );
  } catch (error) {
    console.error(`Error fetching products for category ${category}:`, error);
    return [];
  }
}

// Helper function to apply client-side filtering and sorting based on varFiltersCg
export function applyFiltersAndSort(
  products: Product[],
  filters: {
    minPrice?: number;
    maxPrice?: number;
    sortOrder?: string;
  }
): Product[] {
  let filtered = [...products];

  // Apply price range filter
  if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
    filtered = filtered.filter((product) => {
      const min = filters.minPrice ?? varFiltersCg.minPrice;
      const max = filters.maxPrice ?? varFiltersCg.maxPrice;
      return product.price >= min && product.price <= max;
    });
  }

  // Apply sorting
  if (filters.sortOrder && filters.sortOrder !== 'default') {
    filtered.sort((a, b) => {
      if (filters.sortOrder === 'asc') {
        return a.price - b.price;
      } else if (filters.sortOrder === 'desc') {
        return b.price - a.price;
      }
      return 0;
    });
  }

  return filtered;
}
