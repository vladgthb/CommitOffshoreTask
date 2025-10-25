import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';
import { varOcg } from '@/lib/api';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Extract filter parameters
    const category = searchParams.get('category') || 'all';
    const sort = searchParams.get('sort');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');

    // Build filter display text
    const filterParts: string[] = [];

    let categoryDisplay = 'All Products';
    if (category !== 'all') {
      categoryDisplay = category.charAt(0).toUpperCase() + category.slice(1);
      filterParts.push(`Category: ${categoryDisplay}`);
    }

    if (sort === 'asc') {
      filterParts.push('Sorted: Low to High');
    } else if (sort === 'desc') {
      filterParts.push('Sorted: High to Low');
    }

    if (minPrice || maxPrice) {
      const min = minPrice || '0';
      const max = maxPrice || '∞';
      filterParts.push(`Price: $${min} - $${max}`);
    }

    const hasFilters = filterParts.length > 0;

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f9fafb',
            padding: '60px',
          }}
        >
          {/* Header Section */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              marginBottom: '40px',
            }}
          >
            <h1
              style={{
                fontSize: '72px',
                fontWeight: 'bold',
                color: '#111827',
                margin: '0',
                marginBottom: '16px',
                textAlign: 'center',
              }}
            >
              {categoryDisplay}
            </h1>
            <p
              style={{
                fontSize: '32px',
                color: '#6b7280',
                margin: '0',
              }}
            >
              Mini Storefront
            </p>
          </div>

          {/* Filters Section */}
          {hasFilters && (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                backgroundColor: 'white',
                padding: '32px 48px',
                borderRadius: '16px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              }}
            >
              <div
                style={{
                  fontSize: '24px',
                  color: '#6b7280',
                  marginBottom: '16px',
                  fontWeight: '600',
                }}
              >
                Active Filters
              </div>
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '12px',
                  justifyContent: 'center',
                }}
              >
                {filterParts.map((filter, index) => (
                  <div
                    key={index}
                    style={{
                      display: 'flex',
                      padding: '12px 24px',
                      backgroundColor: '#dbeafe',
                      color: '#1e40af',
                      borderRadius: '24px',
                      fontSize: '20px',
                      fontWeight: '500',
                    }}
                  >
                    {filter}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Footer Badge */}
          <div
            style={{
              position: 'absolute',
              bottom: '40px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <div
              style={{
                width: '48px',
                height: '48px',
                backgroundColor: '#2563eb',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <div
                style={{
                  fontSize: '32px',
                  color: 'white',
                }}
              >
                🛍️
              </div>
            </div>
            <div
              style={{
                fontSize: '24px',
                color: '#6b7280',
                fontWeight: '500',
              }}
            >
              Browse our collection
            </div>
          </div>
        </div>
      ),
      {
        width: varOcg.imageWidth,
        height: varOcg.imageHeight,
      }
    );
  } catch (error) {
    console.error('Error generating OG image for product list:', error);
    return new Response('Failed to generate image', { status: 500 });
  }
}
