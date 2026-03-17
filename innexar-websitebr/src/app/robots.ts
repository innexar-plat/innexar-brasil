import type { MetadataRoute } from 'next'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://innexar.com.br'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/_next/', '/admin/', '/pt/criar-site/checkout', '/en/criar-site/checkout', '/es/criar-site/checkout'],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
