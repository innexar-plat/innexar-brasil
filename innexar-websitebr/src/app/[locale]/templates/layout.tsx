import type { Metadata } from 'next'

type Props = {
  readonly children: React.ReactNode
  readonly params: Promise<{ locale: string }>
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://innexar.com.br'

const byLocale: Record<string, { title: string; description: string }> = {
  pt: {
    title: 'Galeria de Templates | Innexar',
    description: 'Explore templates profissionais para criacao de sites por assinatura.',
  },
  en: {
    title: 'Template Gallery | Innexar',
    description: 'Browse professional templates for subscription-based websites.',
  },
  es: {
    title: 'Galeria de Plantillas | Innexar',
    description: 'Explora plantillas profesionales para sitios por suscripcion.',
  },
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const meta = byLocale[locale] || byLocale.pt
  const path = '/templates'

  return {
    title: meta.title,
    description: meta.description,
    alternates: {
      canonical: `${SITE_URL}/${locale}${path}`,
      languages: {
        'x-default': `${SITE_URL}/pt${path}`,
        pt: `${SITE_URL}/pt${path}`,
        en: `${SITE_URL}/en${path}`,
        es: `${SITE_URL}/es${path}`,
      },
    },
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: `${SITE_URL}/${locale}${path}`,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: meta.title,
      description: meta.description,
    },
    robots: {
      index: true,
      follow: true,
    },
  }
}

export default async function TemplatesLayout({ children }: Props) {
  return children
}
