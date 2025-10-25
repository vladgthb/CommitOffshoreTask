import { getAllProducts, getProductCategories, getProductsByCategory, varFiltersCg, applyFiltersAndSort } from '@/lib/api';
import ProductListWithFilters from '@/components/ProductListWithFilters';

export const metadata = {
  title: 'Mini Storefront - Browse Products',
  description: 'Browse our collection of quality products',
  openGraph: {
    title: 'Mini Storefront - Browse Products',
    description: 'Browse our collection of quality products from top brands',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary',
    title: 'Mini Storefront - Browse Products',
    description: 'Browse our collection of quality products from top brands',
  },
};

interface HomePageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = await searchParams;

  // Extract all filter parameters from URL
  const categoryParam = typeof params.category === 'string' ? params.category : undefined;
  const sortParam = typeof params.sort === 'string' ? params.sort : varFiltersCg.sortOrder;
  const minPriceParam = typeof params.minPrice === 'string' ? Number(params.minPrice) : undefined;
  const maxPriceParam = typeof params.maxPrice === 'string' ? Number(params.maxPrice) : undefined;

  // Fetch products based on category or varFiltersCg default
  const initialCategory = categoryParam || varFiltersCg.defaultCategory;

  const [fetchedProducts, categories] = await Promise.all([
    initialCategory === 'all' || !categoryParam
      ? getAllProducts()
      : getProductsByCategory(categoryParam),
    getProductCategories(),
  ]);

  // Apply server-side filtering and sorting based on URL params
  const products = applyFiltersAndSort(fetchedProducts, {
    minPrice: minPriceParam,
    maxPrice: maxPriceParam,
    sortOrder: sortParam,
  });

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Our Products
          </h1>
          <p className="text-gray-600">
            Discover our collection of quality products
          </p>
        </div>

        <ProductListWithFilters
          initialProducts={products}
          categories={categories}
        />
      </div>
    </main>
  );
}
