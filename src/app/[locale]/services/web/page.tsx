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
  return genMeta(locale, 'servicesWeb')
}

export default async function ServicesWebPage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations('seo')
  const tPage = await getTranslations('servicePage')
  const title = t('servicesWeb.title')
  const breadcrumbLabel = locale === 'pt' ? 'Serviços' : locale === 'es' ? 'Servicios' : 'Services'
  const webLabel = locale === 'pt' ? 'Desenvolvimento Web' : locale === 'es' ? 'Desarrollo Web' : 'Web Development'

  return (
    <main className="min-h-screen">
      <StructuredDataBreadcrumb
        baseUrl={SITE_URL}
        locale={locale}
        items={[
          { name: breadcrumbLabel, slug: 'services' },
          { name: webLabel, slug: 'services/web' },
        ]}
      />
      <Header />
      <ServicePageHero
        title={title}
        subtitle={tPage('web.subtitle')}
        ctaLabel={tPage('web.cta')}
      />
      <ServicesCTA />
      <Footer />
    </main>
  )
}
