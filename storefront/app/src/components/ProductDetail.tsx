import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/lib/types';

interface ProductDetailProps {
  product: Product;
}

export default function ProductDetail({ product }: ProductDetailProps) {
  return (
    <div className="max-w-6xl mx-auto">
      <Link
        href="/"
        className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6"
      >
        ← Back to Products
      </Link>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
          {/* Product Image */}
          <div className="relative h-96 bg-gray-100 rounded-lg">
            <Image
              src={product.image}
              alt={product.title}
              fill
              className="object-contain p-8"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            <div className="mb-4">
              <span className="inline-block px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded-full capitalize mb-2">
                {product.category}
              </span>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {product.title}
              </h1>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center">
                  <span className="text-yellow-500 text-xl">★</span>
                  <span className="ml-1 text-gray-700 font-medium">
                    {product.rating.rate}
                  </span>
                </div>
                <span className="text-gray-500">
                  ({product.rating.count} reviews)
                </span>
              </div>
            </div>

            <p className="text-gray-600 leading-relaxed mb-6">
              {product.description}
            </p>

            <div className="mt-auto">
              <div className="mb-6">
                <span className="text-4xl font-bold text-blue-600">
                  ${product.price.toFixed(2)}
                </span>
              </div>

              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200">
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
