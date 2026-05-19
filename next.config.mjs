/** @type {import('next').NextConfig} */

const nextConfig = {
  images: {
    remotePatterns: [
      // CDN personalizado de Riverpar (producción)
      {
        protocol: 'https',
        hostname: 'cdn.riverpar.com',
      },
      // Dominio público de Cloudflare R2 (desarrollo y staging)
      {
        protocol: 'https',
        hostname: '*.r2.dev',
      },
      // Cloudflare R2 Storage directo
      {
        protocol: 'https',
        hostname: '*.r2.cloudflarestorage.com',
      },
      // Supabase Storage
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
      // Imágenes de Unsplash (datos de prueba)
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
}

export default nextConfig
