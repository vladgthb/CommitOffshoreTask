import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/lib/types';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Link
      href={`/products/${product.id}`}
      className="group block bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden"
    >
      <div className="relative h-64 w-full bg-gray-100">
        <Image
          src={product.image}
          alt={product.title}
          fill
          className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg text-gray-800 line-clamp-2 mb-2">
          {product.title}
        </h3>
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-blue-600">
            ${product.price.toFixed(2)}
          </span>
          <div className="flex items-center gap-1">
            <span className="text-yellow-500">★</span>
            <span className="text-sm text-gray-600">
              {product.rating.rate} ({product.rating.count})
            </span>
          </div>
        </div>
        <p className="text-sm text-gray-500 mt-2 capitalize">
          {product.category}
        </p>
      </div>
    </Link>
  );
}
