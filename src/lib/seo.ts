import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://innexar.com.br'
const SITE_NAME = 'Innexar'

/**
 * Area served: São Paulo, litoral, Campinas, Curitiba, Brasília.
 * Optional branch offices: set NEXT_PUBLIC_CURITIBA_ADDRESS / NEXT_PUBLIC_BRASILIA_ADDRESS
 * when the company has physical offices there; then extend layout to emit additional LocalBusiness JSON-LD.
 */
/** Area served for contactPoint (string array) and localBusiness (Place array). */
const AREA_SERVED_STRINGS = [
  'Praia Grande',
  'Santos',
  'São Vicente',
  'Cubatão',
  'São Paulo',
  'Região Metropolitana de São Paulo',
  'Litoral Paulista',
  'Campinas',
  'Região de Campinas',
  'Curitiba',
  'Região Metropolitana de Curitiba',
  'Brasília',
  'Região Integrada de Desenvolvimento do Distrito Federal e Entorno',
] as const

/** Schema.org Place/City/AdministrativeArea for localBusiness.areaServed */
const AREA_SERVED_PLACES = [
  { '@type': 'City' as const, name: 'Praia Grande' },
  { '@type': 'City' as const, name: 'Santos' },
  { '@type': 'City' as const, name: 'São Vicente' },
  { '@type': 'City' as const, name: 'Cubatão' },
  { '@type': 'City' as const, name: 'São Paulo' },
  { '@type': 'AdministrativeArea' as const, name: 'Região Metropolitana de São Paulo' },
  { '@type': 'AdministrativeArea' as const, name: 'Litoral Paulista' },
  { '@type': 'City' as const, name: 'Campinas' },
  { '@type': 'AdministrativeArea' as const, name: 'Região de Campinas' },
  { '@type': 'City' as const, name: 'Curitiba' },
  { '@type': 'AdministrativeArea' as const, name: 'Região Metropolitana de Curitiba' },
  { '@type': 'City' as const, name: 'Brasília' },
  { '@type': 'AdministrativeArea' as const, name: 'Região Integrada de Desenvolvimento do Distrito Federal e Entorno' },
]

const SERVICE_PAGE_PATHS: Record<string, string> = {
  servicesApps: 'services/apps',
  servicesWeb: 'services/web',
  servicesMarketing: 'services/marketing',
  servicesInfra: 'services/infra',
}

function getPathForPage(page: string): string {
  if (page === 'home') return ''
  return SERVICE_PAGE_PATHS[page] ?? page
}

export async function generateMetadata(
  locale: string,
  page: string = 'home'
): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'seo' })

  const title = t(`${page}.title`, { defaultValue: t('default.title') })
  const description = t(`${page}.description`, { defaultValue: t('default.description') })
  const keywords = t(`${page}.keywords`, { defaultValue: t('default.keywords') })

  const pathSegment = getPathForPage(page)
  const cleanPath = pathSegment ? `/${pathSegment}` : ''
  const url = `${SITE_URL}/${locale}${cleanPath}`
  const ogImageByPage: Record<string, string> = {
    home: 'og-image.jpg',
    'criar-site': 'og-criar-site.jpg',
    'prospector-ai': 'og-prospector-ai.jpg',
    services: 'og-services.jpg',
    servicesApps: 'og-services.jpg',
    servicesWeb: 'og-services.jpg',
    servicesMarketing: 'og-services.jpg',
    servicesInfra: 'og-services.jpg',
  }
  const ogImage = `${SITE_URL}/${ogImageByPage[page] || 'og-image.jpg'}`
  const ogLocale = locale === 'pt' ? 'pt_BR' : locale === 'es' ? 'es_ES' : 'en_US'
  const ogAlternateLocales = (['pt', 'en', 'es'] as const).filter((l) => l !== locale).map((l) => (l === 'pt' ? 'pt_BR' : l === 'es' ? 'es_ES' : 'en_US'))

  return {
    title: {
      default: title,
      template: `%s | ${SITE_NAME}`,
    },
    description,
    keywords: keywords.split(',').map(k => k.trim()),
    icons: {
      icon: '/favicon.png',
      shortcut: '/favicon.png',
      apple: '/favicon.png', // Fallback to favicon if apple-touch-icon is missing
    },
    authors: [{ name: 'Innexar' }],
    creator: 'Innexar',
    publisher: 'Innexar',
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL(SITE_URL),
    alternates: {
      canonical: url,
      languages: {
        'x-default': `${SITE_URL}/pt${cleanPath}`,
        'pt': `${SITE_URL}/pt${cleanPath}`,
        'en': `${SITE_URL}/en${cleanPath}`,
        'es': `${SITE_URL}/es${cleanPath}`,
      },
    },
    openGraph: {
      type: 'website',
      locale: ogLocale,
      alternateLocale: ogAlternateLocales,
      url: url,
      title: title,
      description: description,
      siteName: SITE_NAME,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: title,
      description: description,
      images: [ogImage],
      creator: '@innexar',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    verification: {
      google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION,
    },
  }
}

export function generateStructuredData(
  locale: string,
  page: string = 'home'
) {
  const baseUrl = SITE_URL
  const pathSegment = getPathForPage(page)
  const url = `${baseUrl}/${locale}${pathSegment ? `/${pathSegment}` : ''}`

  const address = {
    '@type': 'PostalAddress' as const,
    addressLocality: 'Praia Grande',
    addressRegion: 'SP',
    addressCountry: 'BR',
    ...(process.env.NEXT_PUBLIC_SITE_ADDRESS && { streetAddress: process.env.NEXT_PUBLIC_SITE_ADDRESS }),
    ...(process.env.NEXT_PUBLIC_SITE_POSTAL_CODE && { postalCode: process.env.NEXT_PUBLIC_SITE_POSTAL_CODE }),
  }

  const organization = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Innexar',
    url: baseUrl,
    logo: {
      '@type': 'ImageObject',
      url: `${baseUrl}/favicon.png`,
      width: '512',
      height: '512'
    },
    image: `${baseUrl}/og-image.jpg`,
    description: 'Criação de sites profissionais, desenvolvimento de aplicativos e soluções com inteligência artificial. Praia Grande, Santos, São Paulo e Campinas.',
    address,
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+55-13-99182-1557',
      contactType: 'sales',
      areaServed: [...AREA_SERVED_STRINGS],
      availableLanguage: ['Portuguese', 'English', 'Spanish'],
    },
    sameAs: [
      'https://www.linkedin.com/company/innexar',
      'https://twitter.com/innexar',
      'https://www.instagram.com/innexar.com.br',
    ],
  }

  const localBusiness = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'Innexar',
    url: baseUrl,
    telephone: '+55-13-99182-1557',
    address,
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '09:00',
      closes: '18:00',
    },
    areaServed: AREA_SERVED_PLACES,
  }

  const website = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Innexar',
    url: baseUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${baseUrl}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }

  const pathSeg = getPathForPage(page)
  const breadcrumbSegments =
    page === 'home'
      ? []
      : pathSeg?.includes('/')
        ? [
            { position: 2, name: 'Serviços', item: `${baseUrl}/${locale}/services` },
            { position: 3, name: pathSeg.split('/').pop() ?? pathSeg, item: url },
          ]
        : [{ position: 2, name: page.charAt(0).toUpperCase() + page.slice(1), item: url }]

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${baseUrl}/${locale}` },
      ...breadcrumbSegments.map((s) => ({
        '@type': 'ListItem' as const,
        position: s.position,
        name: s.name,
        item: s.item,
      })),
    ],
  }

  return {
    organization,
    website,
    breadcrumb,
    localBusiness,
  }
}

