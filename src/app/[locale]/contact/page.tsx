import { generateMetadata as genMeta } from '@/lib/seo'
import Header from '@/components/Header'
import Contact from '@/components/Contact'
import Footer from '@/components/Footer'
import ContactHero from '@/components/contact/ContactHero'
import { getTranslations } from 'next-intl/server'
import StructuredDataBreadcrumb from '@/components/StructuredDataBreadcrumb'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://innexar.com.br'

type Props = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params
  return genMeta(locale, 'contact')
}

export default async function ContactPage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations('navigation')
  return (
    <main className="min-h-screen">
      <StructuredDataBreadcrumb
        baseUrl={SITE_URL}
        locale={locale}
        items={[{ name: t('contact'), slug: 'contact' }]}
      />
      <Header />
      <ContactHero />
      <div className="bg-white">
        <Contact />
      </div>
      <Footer />
    </main>
  )
}