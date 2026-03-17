import { MetadataRoute } from 'next'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://innexar.com.br'
const locales = ['pt', 'en', 'es']
// Only include URLs that render content (exclude redirects: portfolio, saas, launch → home or external)
const pages = [
  '',
  'about',
  'services',
  'services/apps',
  'services/web',
  'services/marketing',
  'services/infra',
  'blockchain',
  'checklist',
  'contact',
  'criar-site',
  'prospector-ai',
  'promo',
  'privacy-policy',
  'terms-of-service',
]

export default function sitemap(): MetadataRoute.Sitemap {
  const routes: MetadataRoute.Sitemap = []

  locales.forEach((locale) => {
    pages.forEach((page) => {
      routes.push({
        url: `${SITE_URL}/${locale}${page ? `/${page}` : ''}`,
        lastModified: new Date(),
        changeFrequency: page === '' ? 'daily' : 'weekly',
        priority: page === '' ? 1.0 : page.startsWith('saas') ? 0.9 : 0.8,
        alternates: {
          languages: {
            'x-default': `${SITE_URL}/pt${page ? `/${page}` : ''}`,
            pt: `${SITE_URL}/pt${page ? `/${page}` : ''}`,
            en: `${SITE_URL}/en${page ? `/${page}` : ''}`,
            es: `${SITE_URL}/es${page ? `/${page}` : ''}`,
          },
        },
      })
    })
  })

  return routes
}

