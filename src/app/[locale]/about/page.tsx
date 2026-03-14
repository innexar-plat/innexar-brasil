import { generateMetadata as genMeta } from '@/lib/seo'
import Header from '@/components/Header'
import About from '@/components/About'
import Footer from '@/components/Footer'
import AboutHero from '@/components/about/AboutHero'
import AboutContent from '@/components/about/AboutContent'
import { getTranslations } from 'next-intl/server'
import StructuredDataBreadcrumb from '@/components/StructuredDataBreadcrumb'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://innexar.com.br'

type Props = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params
  return genMeta(locale, 'about')
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations('navigation')
  return (
    <main className="min-h-screen">
      <StructuredDataBreadcrumb
        baseUrl={SITE_URL}
        locale={locale}
        items={[{ name: t('about'), slug: 'about' }]}
      />
      <Header />
      <AboutHero />
      <About />
      <AboutContent />
      <Footer />
    </main>
  )
}