import { getProductById, getAllProducts, varOcg } from '@/lib/api';
import ProductDetail from '@/components/ProductDetail';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

interface ProductPageProps {
  params: {
    id: string;
  };
}

// Generate static params for all products
export async function generateStaticParams() {
  const products = await getAllProducts();

  return products.map((product) => ({
    id: product.id.toString(),
  }));
}

// Generate dynamic metadata including Open Graph tags
export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const product = await getProductById(params.id);

  if (!product) {
    return {
      title: 'Product Not Found',
    };
  }

  // __define-ocg__: Open Graph configuration for social media previews
  return {
    title: product.title,
    description: product.description,
    openGraph: {
      title: product.title,
      description: product.description,
      images: [
        {
          url: `/api/og?title=${encodeURIComponent(product.title)}&price=${product.price}`,
          width: varOcg.imageWidth,
          height: varOcg.imageHeight,
          alt: product.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: product.title,
      description: product.description,
      images: [`/api/og?title=${encodeURIComponent(product.title)}&price=${product.price}`],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await getProductById(params.id);

  if (!product) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <ProductDetail product={product} />
      </div>
    </main>
  );
}
