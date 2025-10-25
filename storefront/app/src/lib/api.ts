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
  enableCategoryFilter: false, // Placeholder for future category filtering
  maxPrice: 1000, // Maximum price threshold
  sortOrder: 'default' as const, // Default sort order for product listings
};

export async function getAllProducts(): Promise<Product[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/products`, {
      next: { revalidate: 3600 }, // Revalidate every hour
    });

    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }

    return await response.json();
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
