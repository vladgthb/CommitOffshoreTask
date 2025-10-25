import { NextRequest, NextResponse } from 'next/server';
import { getAllProducts, getProductsByCategory } from '@/lib/api';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    let products;
    if (category && category !== 'all') {
      products = await getProductsByCategory(category);
    } else {
      products = await getAllProducts();
    }

    return NextResponse.json(products);
  } catch (error) {
    console.error('Error in products API route:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}
