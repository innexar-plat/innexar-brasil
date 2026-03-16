import type { MetadataRoute } from 'next'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://innexar.com.br'

const PRIVATE_PATHS = [
  '/api/',
  '/_next/',
  '/admin/',
  '/pt/checkout',
  '/en/checkout',
  '/es/checkout',
  '/pt/dashboard',
  '/en/dashboard',
  '/es/dashboard',
  '/pt/criar-site/checkout',
  '/en/criar-site/checkout',
  '/es/criar-site/checkout',
  '/pt/templates/preview/',
  '/en/templates/preview/',
  '/es/templates/preview/',
]

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: PRIVATE_PATHS,
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
