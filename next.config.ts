import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const PORTAL_URL = process.env.NEXT_PUBLIC_PORTAL_URL || "https://portal.innexar.com.br";
const WORKSPACE_URL = process.env.NEXT_PUBLIC_WORKSPACE_URL || "https://app.innexar.com.br";

const nextConfig: NextConfig = {
  reactCompiler: true,
  output: "standalone",
  // Reduz bundle: importa só os ícones usados de lucide e heroicons
  experimental: {
    optimizePackageImports: ['lucide-react', '@heroicons/react'],
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
  },
  async redirects() {
    return [
      { source: "/portal", destination: `${PORTAL_URL}/pt`, permanent: true },
      { source: "/portal/:path*", destination: `${PORTAL_URL}/pt/:path*`, permanent: true },
      {
        source: "/:locale(pt|en|es)/portal",
        destination: `${PORTAL_URL}/:locale`,
        permanent: true,
      },
      {
        source: "/:locale(pt|en|es)/portal/:path*",
        destination: `${PORTAL_URL}/:locale/:path*`,
        permanent: true,
      },
      { source: "/workspace", destination: `${WORKSPACE_URL}/pt`, permanent: true },
      { source: "/workspace/:path*", destination: `${WORKSPACE_URL}/pt/:path*`, permanent: true },
      {
        source: "/:locale(pt|en|es)/workspace",
        destination: `${WORKSPACE_URL}/:locale`,
        permanent: true,
      },
      {
        source: "/:locale(pt|en|es)/workspace/:path*",
        destination: `${WORKSPACE_URL}/:locale/:path*`,
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()'
          }
        ]
      }
    ];
  },
};

export default withNextIntl(nextConfig);
