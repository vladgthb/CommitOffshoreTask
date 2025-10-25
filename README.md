# Commit Offshore Test Tasks

This project contains **Commit Offshore's Test Tasks**, a comprehensive collection of 3 frontend engineering challenges designed to demonstrate proficiency in modern web development technologies and best practices.

---

## 📋 Project Overview

This repository showcases solutions to three distinct technical tasks, each focusing on different aspects of frontend development:

- **Task 1**: Next.js Mini Storefront with Dynamic Previews
- **Task 2**: Coming Soon
- **Task 3**: Coming Soon

---

## 🎯 Task 1: Mini Storefront with Dynamic Previews

### Overview
Build a small storefront using Next.js that showcases products from the Fake Store API. The application features dynamic routing, optimized images, and social media-ready Open Graph metadata.

### Special Requirements
- ✅ Solution must contain the keyword `__define-ocg__` in at least one comment
- ✅ At least one variable must be named `varOcg`

### Goal
Create a modern, performant e-commerce storefront that includes:

- ✅ Homepage with product listing
- ✅ Individual product detail pages with dynamic routing
- ✅ Optimized images using `next/image`
- ✅ Dynamic Open Graph (OG) metadata per product
- ✅ Clean component structure and styling

---

## 📖 Detailed Requirements

### 1. Routing
- The homepage (`/`) should list all products fetched from the Fake Store API
- Each product should link to its own page under `/products/[id]`
- Implement proper error handling for invalid routes

### 2. API Integration
Fetch products using the public Fake Store API:

**All Products:**
```
https://fakestoreapi.com/products
```

**Individual Product:**
```
https://fakestoreapi.com/products/[id]
```

**Implementation Notes:**
- Use server-side fetching when possible (via `getStaticProps` / `generateMetadata`)
- Implement proper error handling for failed API requests
- Consider caching and revalidation strategies

### 3. Dynamic Open Graph Images
- Each product page must generate a unique OG image based on the product's title and/or image
- The OG image must be included in the `<head>` so previews (e.g., WhatsApp, Twitter, LinkedIn) display correctly
- **Bonus**: Generate the image using an API route or dynamic rendering (e.g., with `@vercel/og`)

### 4. Image Optimization
- Use the `next/image` component for all images (including thumbnails and OG content)
- Ensure responsive behavior across all device sizes
- Provide proper `alt` text for accessibility

### 5. Styling
- Use **TailwindCSS**, **CSS Modules**, or **ShadCN/UI** (bonus points for ShadCN)
- Pages should be responsive and readable on mobile, tablet, and desktop
- Implement clean, modern UI/UX design

### 6. Error Handling
- Handle cases where a product ID is invalid (404 or fallback page)
- Display loading states clearly during data fetching
- Show error states for failed API requests

---

## 🚀 Getting Started

### Task 1 Implementation

Navigate to the Task 1 directory and follow the detailed guide:

```bash
cd storefront
```

Read the comprehensive implementation guide:
```bash
cat TODO_TASK_1.md
```

The guide includes:
- Step-by-step setup instructions
- Complete code examples
- Component architecture
- API integration patterns
- Open Graph implementation
- Testing and deployment strategies

---

## 🛠️ Tech Stack

### Task 1
- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Image Optimization**: Next.js Image Component
- **OG Images**: @vercel/og
- **API**: Fake Store API
- **Deployment**: Vercel

---

## 📁 Project Structure

```
CommitOffshoreTask/
├── README.md                 # This file
├── storefront/               # Task 1: Mini Storefront Next.js application
├── task2/                    # Task 2 (Coming Soon)
└── task3/                    # Task 3 (Coming Soon)
```

---

## ✅ Quality Standards

All tasks in this project adhere to:

- **Clean Code**: Well-organized, readable, and maintainable
- **Type Safety**: Full TypeScript implementation
- **Performance**: Optimized loading and rendering
- **Accessibility**: WCAG compliance where applicable
- **Responsive Design**: Mobile-first approach
- **Error Handling**: Comprehensive edge case coverage
- **Documentation**: Clear comments and documentation

---


## 🧪 Testing

Each task includes comprehensive testing requirements:

- **Functional Testing**: All features work as expected
- **Responsive Testing**: Works on mobile, tablet, and desktop
- **Performance Testing**: Lighthouse scores 90+
- **Accessibility Testing**: Keyboard navigation and screen readers

---

## 🚢 Deployment

The application is deployed to **Vercel** with automated CI/CD using GitHub Actions.

### Features:
- ✅ Automated deployments on push to main/master
- ✅ Preview deployments for pull requests
- ✅ Automatic linting and type checking
- ✅ Production builds with artifact caching
- ✅ PR comments with preview URLs

### Quick Deploy:
For detailed deployment instructions including CI/CD setup, see:
```bash
cat storefront/DEPLOYMENT.md
```

The deployment guide includes:
- One-click Vercel deployment
- Vercel CLI instructions
- Complete CI/CD setup with GitHub Actions
- GitHub Secrets configuration
- Troubleshooting and post-deployment verification

---

## 📚 Resources

### Task 1 Resources
- [Next.js Documentation](https://nextjs.org/docs)
- [Fake Store API](https://fakestoreapi.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [@vercel/og Documentation](https://vercel.com/docs/functions/edge-functions/og-image-generation)
- [Open Graph Protocol](https://ogp.me/)
- [Next.js Image Optimization](https://nextjs.org/docs/app/building-your-application/optimizing/images)
- [Vercel Deployment Documentation](https://vercel.com/docs)

---

## 📄 License

This project is created for Commit Offshore's technical assessment.

---

## 👤 Author

**Vladimir Danielyan**

---

## 📞 Support

For questions or issues related to these tasks, please refer to the individual task documentation in their respective directories.

---

**Last Updated**: 2025

**Status**: Task 1 - ✅ Completed (100%) | Task 2 - Pending | Task 3 - Pending
