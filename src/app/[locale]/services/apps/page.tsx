import { generateMetadata as genMeta } from '@/lib/seo'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ServicePageHero from '@/components/services/ServicePageHero'
import ServicesCTA from '@/components/services/ServicesCTA'
import StructuredDataBreadcrumb from '@/components/StructuredDataBreadcrumb'
import { getTranslations } from 'next-intl/server'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://innexar.com.br'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props) {
  const { locale } = await params
  return genMeta(locale, 'servicesApps')
}

export default async function ServicesAppsPage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations('seo')
  const tPage = await getTranslations('servicePage')
  const title = t('servicesApps.title')
  const breadcrumbLabel = locale === 'pt' ? 'Serviços' : locale === 'es' ? 'Servicios' : 'Services'
  const appsLabel = locale === 'pt' ? 'Desenvolvimento de Apps' : locale === 'es' ? 'Desarrollo de Apps' : 'App Development'

  return (
    <main className="min-h-screen">
      <StructuredDataBreadcrumb
        baseUrl={SITE_URL}
        locale={locale}
        items={[
          { name: breadcrumbLabel, slug: 'services' },
          { name: appsLabel, slug: 'services/apps' },
        ]}
      />
      <Header />
      <ServicePageHero
        title={title}
        subtitle={tPage('apps.subtitle')}
        ctaLabel={tPage('apps.cta')}
      />
      <ServicesCTA />
      <Footer />
    </main>
  )
}
