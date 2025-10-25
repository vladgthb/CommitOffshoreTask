import { getAllProducts } from '@/lib/api';
import ProductGrid from '@/components/ProductGrid';

export const metadata = {
  title: 'Mini Storefront - Browse Products',
  description: 'Browse our collection of quality products',
};

export default async function HomePage() {
  const products = await getAllProducts();

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

        <ProductGrid products={products} />
      </div>
    </main>
  );
}
