import { generateMetadata as genMeta } from '@/lib/seo'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ServicesHero from '@/components/services/ServicesHero'
import ServiceDetails from '@/components/services/ServiceDetails'
import ProcessSection from '@/components/services/ProcessSection'
import WhyChooseUs from '@/components/services/WhyChooseUs'
import ServicesCTA from '@/components/services/ServicesCTA'
import { getTranslations } from 'next-intl/server'
import StructuredDataBreadcrumb from '@/components/StructuredDataBreadcrumb'
import StructuredDataServices from '@/components/StructuredDataServices'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://innexar.com.br'

type Props = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params
  return genMeta(locale, 'services')
}

export default async function ServicesPage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations('services')
  const rawItems = (t.raw('items') as { key: string; title: string; description: string }[]) ?? []
  const serviceItems = rawItems.map((item) => ({ name: item.title, description: item.description }))
  const breadcrumbLabel = locale === 'pt' ? 'Serviços' : locale === 'es' ? 'Servicios' : 'Services'
  return (
    <main className="min-h-screen">
      <StructuredDataBreadcrumb
        baseUrl={SITE_URL}
        locale={locale}
        items={[{ name: breadcrumbLabel, slug: 'services' }]}
      />
      <StructuredDataServices
        baseUrl={SITE_URL}
        locale={locale}
        services={serviceItems}
      />
      <Header />
      <ServicesHero />
      <ServiceDetails />
      <ProcessSection />
      <WhyChooseUs />
      <ServicesCTA />
      <Footer />
    </main>
  )
}