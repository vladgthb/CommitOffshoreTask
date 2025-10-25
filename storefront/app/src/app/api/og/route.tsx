import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const title = searchParams.get('title') || 'Product';
    const price = searchParams.get('price') || '0.00';

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
            backgroundColor: '#fff',
            backgroundImage: 'linear-gradient(to bottom right, #3b82f6, #2563eb)',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '40px',
              backgroundColor: 'white',
              borderRadius: '20px',
              boxShadow: '0 20px 50px rgba(0,0,0,0.2)',
              maxWidth: '900px',
              margin: '0 40px',
            }}
          >
            <h1
              style={{
                fontSize: '60px',
                fontWeight: 'bold',
                color: '#1f2937',
                textAlign: 'center',
                marginBottom: '20px',
                lineHeight: 1.2,
              }}
            >
              {title}
            </h1>
            <p
              style={{
                fontSize: '80px',
                fontWeight: 'bold',
                color: '#2563eb',
                margin: '0',
              }}
            >
              ${price}
            </p>
            <p
              style={{
                fontSize: '24px',
                color: '#6b7280',
                marginTop: '20px',
              }}
            >
              Mini Storefront
            </p>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (error) {
    console.error('Error generating OG image:', error);
    return new Response('Failed to generate image', { status: 500 });
  }
}
