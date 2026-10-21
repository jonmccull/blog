import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  // Next 16 serves only quality 75 unless listed; the image components ask for 85.
  images: {
    qualities: [75, 85],
  },
}

export default nextConfig
