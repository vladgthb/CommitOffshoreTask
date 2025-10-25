import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Mini Storefront",
  description: "A modern storefront built with Next.js",
  metadataBase: new URL('https://commit-offshore-task.vercel.app'), // Replace with your actual domain
  openGraph: {
    title: "Mini Storefront",
    description: "A modern storefront built with Next.js",
    url: 'https://commit-offshore-task.vercel.app', // Replace with your actual domain
    siteName: 'Mini Storefront',
    type: 'website',
    images: [
      {
        url: '/og-image.jpg', // Add your Open Graph image
        width: 1200,
        height: 630,
        alt: 'Mini Storefront',
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <header className="bg-white shadow-sm">
          <div className="container mx-auto px-4 py-4">
            <h1 className="text-2xl font-bold text-gray-900">
              Mini Storefront
            </h1>
          </div>
        </header>
        {children}
        <footer className="bg-gray-800 text-white mt-12 py-6">
          <div className="container mx-auto px-4 text-center">
            <p>© 2025 Mini Storefront. All rights reserved.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
