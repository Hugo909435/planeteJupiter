/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      { protocol: 'https', hostname: 'picsum.photos' },
      { protocol: 'https', hostname: 'fastly.picsum.photos' },
    ],
  },
  // Bundle only what's needed per route
  experimental: {
    optimizePackageImports: ['gsap', 'three'],
  },
}

export default nextConfig
