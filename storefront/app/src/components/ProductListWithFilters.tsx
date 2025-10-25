'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Product } from '@/lib/types';
import { varFiltersCg } from '@/lib/api';
import ProductGrid from './ProductGrid';

interface ProductListWithFiltersProps {
  initialProducts: Product[];
  categories: string[];
}

export default function ProductListWithFilters({
  initialProducts,
  categories,
}: ProductListWithFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Initialize from URL query params or varFiltersCg default
  const initialCategory = searchParams.get('category') || varFiltersCg.defaultCategory;

  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [loading, setLoading] = useState(false);

  const handleCategoryChange = async (category: string) => {
    setSelectedCategory(category);
    setLoading(true);

    // Update URL with new category filter
    const params = new URLSearchParams();
    if (category !== 'all' && category !== varFiltersCg.defaultCategory) {
      params.set('category', category);
    }
    const queryString = params.toString();
    router.push(queryString ? `/?${queryString}` : '/', { scroll: false });

    try {
      let url = '/api/products';
      if (category !== 'all') {
        url += `?category=${encodeURIComponent(category)}`;
      }

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }

      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching filtered products:', error);
      // Fallback to client-side filtering if API fails
      if (category === 'all') {
        setProducts(initialProducts);
      } else {
        setProducts(
          initialProducts.filter((p) => p.category === category)
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // Sync with URL changes (e.g., browser back/forward)
  useEffect(() => {
    const categoryFromUrl = searchParams.get('category') || varFiltersCg.defaultCategory;
    if (categoryFromUrl !== selectedCategory) {
      handleCategoryChange(categoryFromUrl);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  if (!varFiltersCg.enableCategoryFilter) {
    return <ProductGrid products={products} />;
  }

  return (
    <div>
      {/* Filter Bar */}
      <div className="mb-8 bg-white rounded-lg shadow-md p-4">
        <div className="flex items-center gap-4 flex-wrap">
          <label className="text-gray-700 font-semibold">Filter by Category:</label>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => handleCategoryChange('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                selectedCategory === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              All Products
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 capitalize ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Products Grid with Loading State */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse"
            >
              <div className="h-64 bg-gray-300"></div>
              <div className="p-4">
                <div className="h-6 bg-gray-300 rounded mb-2"></div>
                <div className="h-6 bg-gray-300 rounded w-3/4 mb-4"></div>
                <div className="flex items-center justify-between">
                  <div className="h-8 bg-gray-300 rounded w-24"></div>
                  <div className="h-4 bg-gray-300 rounded w-16"></div>
                </div>
                <div className="h-4 bg-gray-300 rounded w-32 mt-2"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <ProductGrid products={products} />
      )}
    </div>
  );
}
