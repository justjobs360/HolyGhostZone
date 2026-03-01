/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  experimental: {
    // Allow large video/audio uploads (up to 100MB) in teachings admin
    serverActions: {
      bodySizeLimit: '100mb',
    },
  },
}

export default nextConfig
