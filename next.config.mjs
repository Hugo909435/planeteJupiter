/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [],
  },
  // Bundle only what's needed per route
  experimental: {
    optimizePackageImports: ['gsap', 'three'],
  },
}

export default nextConfig
