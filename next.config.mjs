/** @type {import('next').NextConfig} */

function parseCdnHostname() {
  const url = process.env.NEXT_PUBLIC_CDN_BASE_URL
  if (!url) return 'cdn.riverpar.com'
  try {
    return new URL(url).hostname
  } catch {
    return 'cdn.riverpar.com'
  }
}

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: parseCdnHostname(),
      },
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
      {
        protocol: 'https',
        hostname: '*.r2.dev',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
}

export default nextConfig
