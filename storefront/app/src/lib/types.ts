// __define-ocg__: Type definitions for product data and Open Graph configurations
export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
}

export interface OGImageParams {
  title: string;
  price: string;
  image?: string;
}
