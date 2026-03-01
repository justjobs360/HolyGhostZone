/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    // Keep unoptimized so images always load (e.g. /api/images/* or external URLs)
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
