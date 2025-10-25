import { getAllProducts, getProductCategories } from '@/lib/api';
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

export default async function HomePage() {
  const [products, categories] = await Promise.all([
    getAllProducts(),
    getProductCategories(),
  ]);

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
