import { getAllProducts, getProductCategories, getProductsByCategory, varFiltersCg, applyFiltersAndSort, varOcg } from '@/lib/api';
import ProductListWithFilters from '@/components/ProductListWithFilters';
import { Metadata } from 'next';

interface HomePageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

// Generate dynamic metadata based on filters
export async function generateMetadata({ searchParams }: HomePageProps): Promise<Metadata> {
  const params = await searchParams;

  const categoryParam = typeof params.category === 'string' ? params.category : undefined;
  const sortParam = typeof params.sort === 'string' ? params.sort : undefined;
  const minPriceParam = typeof params.minPrice === 'string' ? Number(params.minPrice) : undefined;
  const maxPriceParam = typeof params.maxPrice === 'string' ? Number(params.maxPrice) : undefined;

  // Build dynamic title and description
  let title = 'Mini Storefront - Browse Products';
  let description = 'Browse our collection of quality products';

  const filterParts: string[] = [];

  if (categoryParam && categoryParam !== 'all') {
    const categoryName = categoryParam.charAt(0).toUpperCase() + categoryParam.slice(1);
    filterParts.push(categoryName);
    title = `${categoryName} Products - Mini Storefront`;
    description = `Browse our collection of ${categoryParam} products`;
  }

  if (sortParam === 'asc') {
    filterParts.push('Sorted Low to High');
  } else if (sortParam === 'desc') {
    filterParts.push('Sorted High to Low');
  }

  if (minPriceParam !== undefined || maxPriceParam !== undefined) {
    const min = minPriceParam || 0;
    const max = maxPriceParam === Infinity || maxPriceParam === undefined ? '∞' : maxPriceParam;
    filterParts.push(`$${min}-$${max}`);
  }

  if (filterParts.length > 0) {
    description += ` (${filterParts.join(', ')})`;
  }

  // Generate OG image URL with filter parameters
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL
    || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');

  const ogParams = new URLSearchParams();
  if (categoryParam) ogParams.set('category', categoryParam);
  if (sortParam) ogParams.set('sort', sortParam);
  if (minPriceParam !== undefined) ogParams.set('minPrice', minPriceParam.toString());
  if (maxPriceParam !== undefined && maxPriceParam !== Infinity) ogParams.set('maxPrice', maxPriceParam.toString());

  const ogImageUrl = `${baseUrl}/api/og/list?${ogParams.toString()}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      locale: 'en_US',
      images: [
        {
          url: ogImageUrl,
          width: varOcg.imageWidth,
          height: varOcg.imageHeight,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImageUrl],
    },
  };
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
