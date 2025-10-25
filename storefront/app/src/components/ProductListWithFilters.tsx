'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Product } from '@/lib/types';
import { varFiltersCg, applyFiltersAndSort } from '@/lib/api';
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

  // Initialize from URL query params or varFiltersCg defaults
  const initialCategory = searchParams.get('category') || varFiltersCg.defaultCategory;
  const initialSort = searchParams.get('sort') || varFiltersCg.sortOrder;
  const initialMinPrice = searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined;
  const initialMaxPrice = searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined;

  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [sortOrder, setSortOrder] = useState<string>(initialSort);
  const [minPrice, setMinPrice] = useState<number | undefined>(initialMinPrice);
  const [maxPrice, setMaxPrice] = useState<number | undefined>(initialMaxPrice);
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [loading, setLoading] = useState(false);
  const [isUrlUpdate, setIsUrlUpdate] = useState(false); // Track if update is from URL change

  const fetchAndApplyFilters = async (
    category: string,
    sort: string,
    min: number | undefined,
    max: number | undefined
  ) => {
    setLoading(true);

    try {
      // Fetch products from API (category filter only)
      let url = '/api/products';
      if (category !== 'all') {
        url += `?category=${encodeURIComponent(category)}`;
      }

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }

      let data = await response.json();

      // Apply client-side filtering and sorting
      data = applyFiltersAndSort(data, {
        minPrice: min,
        maxPrice: max,
        sortOrder: sort,
      });

      setProducts(data);
    } catch (error) {
      console.error('Error fetching filtered products:', error);
      // Fallback to client-side filtering
      let fallbackProducts = initialProducts;
      if (category !== 'all') {
        fallbackProducts = fallbackProducts.filter((p) => p.category === category);
      }
      fallbackProducts = applyFiltersAndSort(fallbackProducts, {
        minPrice: min,
        maxPrice: max,
        sortOrder: sort,
      });
      setProducts(fallbackProducts);
    } finally {
      setLoading(false);
    }
  };

  const updateFilters = async (filters: {
    category?: string;
    sort?: string;
    minPrice?: number;
    maxPrice?: number;
  }) => {
    // Update state immediately
    const newCategory = filters.category ?? selectedCategory;
    const newSort = filters.sort ?? sortOrder;
    const newMin = filters.minPrice !== undefined ? filters.minPrice : minPrice;
    const newMax = filters.maxPrice !== undefined ? filters.maxPrice : maxPrice;

    if (filters.category !== undefined) setSelectedCategory(filters.category);
    if (filters.sort !== undefined) setSortOrder(filters.sort);
    if (filters.minPrice !== undefined) setMinPrice(filters.minPrice);
    if (filters.maxPrice !== undefined) setMaxPrice(filters.maxPrice);

    // Build URL query parameters
    const params = new URLSearchParams();

    if (newCategory !== 'all' && newCategory !== varFiltersCg.defaultCategory) {
      params.set('category', newCategory);
    }
    if (newSort !== 'default' && newSort !== varFiltersCg.sortOrder) {
      params.set('sort', newSort);
    }
    if (newMin !== undefined && newMin !== varFiltersCg.minPrice) {
      params.set('minPrice', newMin.toString());
    }
    if (newMax !== undefined && newMax !== varFiltersCg.maxPrice && newMax !== Infinity) {
      params.set('maxPrice', newMax.toString());
    }

    const queryString = params.toString();

    // Mark this as a programmatic URL update
    setIsUrlUpdate(true);
    router.push(queryString ? `/?${queryString}` : '/', { scroll: false });

    // Fetch and apply filters
    await fetchAndApplyFilters(newCategory, newSort, newMin, newMax);
  };

  // Sync with URL changes (browser back/forward) - only when URL changes externally
  useEffect(() => {
    // Skip if this was triggered by our own URL update
    if (isUrlUpdate) {
      setIsUrlUpdate(false);
      return;
    }

    const categoryFromUrl = searchParams.get('category') || varFiltersCg.defaultCategory;
    const sortFromUrl = searchParams.get('sort') || varFiltersCg.sortOrder;
    const minFromUrl = searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined;
    const maxFromUrl = searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined;

    // Check if URL params differ from current state
    const hasChanges =
      categoryFromUrl !== selectedCategory ||
      sortFromUrl !== sortOrder ||
      minFromUrl !== minPrice ||
      maxFromUrl !== maxPrice;

    if (hasChanges) {
      // Update state
      setSelectedCategory(categoryFromUrl);
      setSortOrder(sortFromUrl);
      setMinPrice(minFromUrl);
      setMaxPrice(maxFromUrl);

      // Fetch and apply filters
      fetchAndApplyFilters(categoryFromUrl, sortFromUrl, minFromUrl, maxFromUrl);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const handlePriceRangeChange = (min: number, max: number) => {
    updateFilters({ minPrice: min, maxPrice: max });
  };

  if (!varFiltersCg.enableCategoryFilter && !varFiltersCg.enableSortFilter && !varFiltersCg.enablePriceFilter) {
    return <ProductGrid products={products} />;
  }

  return (
    <div>
      {/* Filter Bar */}
      <div className="mb-8 bg-white rounded-lg shadow-md p-6">
        <div className="space-y-6">
          {/* Category Filter */}
          {varFiltersCg.enableCategoryFilter && (
            <div>
              <label className="block text-gray-700 font-semibold mb-3">Filter by Category:</label>
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => updateFilters({ category: 'all' })}
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
                    onClick={() => updateFilters({ category })}
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
          )}

          {/* Sort and Price Filters Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Sort Filter */}
            {varFiltersCg.enableSortFilter && (
              <div>
                <label className="block text-gray-700 font-semibold mb-3">Sort by Price:</label>
                <select
                  value={sortOrder}
                  onChange={(e) => updateFilters({ sort: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="default">Default</option>
                  <option value="asc">Price: Low to High</option>
                  <option value="desc">Price: High to Low</option>
                </select>
              </div>
            )}

            {/* Price Range Filter */}
            {varFiltersCg.enablePriceFilter && (
              <div>
                <label className="block text-gray-700 font-semibold mb-3">Price Range:</label>
                <select
                  value={
                    minPrice === 0 && maxPrice === Infinity
                      ? '0-Infinity'
                      : minPrice === 0 && maxPrice === 50
                      ? '0-50'
                      : minPrice === 50 && maxPrice === 100
                      ? '50-100'
                      : minPrice === 100 && maxPrice === 200
                      ? '100-200'
                      : minPrice === 200 && maxPrice === Infinity
                      ? '200-Infinity'
                      : 'custom'
                  }
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === '0-Infinity') {
                      handlePriceRangeChange(0, Infinity);
                    } else if (value === '0-50') {
                      handlePriceRangeChange(0, 50);
                    } else if (value === '50-100') {
                      handlePriceRangeChange(50, 100);
                    } else if (value === '100-200') {
                      handlePriceRangeChange(100, 200);
                    } else if (value === '200-Infinity') {
                      handlePriceRangeChange(200, Infinity);
                    }
                  }}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {varFiltersCg.priceRanges.map((range, index) => (
                    <option
                      key={index}
                      value={`${range.min}-${range.max}`}
                    >
                      {range.label}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Active Filters Display */}
          {(selectedCategory !== 'all' || sortOrder !== 'default' || minPrice !== undefined || maxPrice !== undefined) && (
            <div className="flex items-center gap-2 flex-wrap pt-2 border-t border-gray-200">
              <span className="text-sm text-gray-600">Active filters:</span>
              {selectedCategory !== 'all' && (
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm capitalize">
                  {selectedCategory}
                </span>
              )}
              {sortOrder !== 'default' && (
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                  {sortOrder === 'asc' ? 'Price ↑' : 'Price ↓'}
                </span>
              )}
              {(minPrice !== undefined && minPrice !== 0) || (maxPrice !== undefined && maxPrice !== Infinity) && (
                <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                  ${minPrice || 0} - ${maxPrice === Infinity ? '∞' : maxPrice}
                </span>
              )}
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSortOrder('default');
                  setMinPrice(undefined);
                  setMaxPrice(undefined);
                  updateFilters({ category: 'all', sort: 'default', minPrice: 0, maxPrice: Infinity });
                }}
                className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm hover:bg-red-200 transition-colors"
              >
                Clear all
              </button>
            </div>
          )}
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
        <>
          <div className="mb-4 text-gray-600">
            Showing {products.length} {products.length === 1 ? 'product' : 'products'}
          </div>
          <ProductGrid products={products} />
        </>
      )}
    </div>
  );
}
