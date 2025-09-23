/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost'],
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
    NEXT_PUBLIC_RESTAURANT_ID: process.env.NEXT_PUBLIC_RESTAURANT_ID || 'restaurant-1',
  },
}

module.exports = nextConfig
