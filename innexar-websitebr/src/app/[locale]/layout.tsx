import type { Metadata } from 'next'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import GoogleAnalytics from '@/components/GoogleAnalytics'
import CookieConsent from '@/components/CookieConsent'
import WhatsAppButton from '@/components/WhatsAppButton'
import { SiteConfigProvider } from '@/contexts/SiteConfigContext'
import '../globals.css'

const locales = ['pt', 'en', 'es']

export const metadata: Metadata = {
  title: {
    default: 'Innexar — Sites, Apps e IA para seu Negócio',
    template: '%s | Innexar',
  },
  description: 'Agência digital especializada em criação de sites profissionais, aplicativos e soluções com inteligência artificial. Transforme seu negócio digital com a Innexar.',
  keywords: ['criação de sites', 'agência digital', 'desenvolvimento web', 'aplicativos', 'inteligência artificial', 'SEO', 'Praia Grande', 'São Paulo'],
  authors: [{ name: 'Innexar', url: 'https://innexar.com.br' }],
  creator: 'Innexar',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://innexar.com.br'),
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: 'https://innexar.com.br',
    siteName: 'Innexar',
    title: 'Innexar — Sites, Apps e IA para seu Negócio',
    description: 'Agência digital especializada em sites profissionais, apps e IA.',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Innexar' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Innexar — Sites, Apps e IA para seu Negócio',
    description: 'Agência digital especializada em sites profissionais, apps e IA.',
    images: ['/og-image.jpg'],
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
}

type Props = {
  readonly children: React.ReactNode
  readonly params: Promise<{ locale: string }>
}

export function generateStaticParams() {
  return locales.map(locale => ({ locale }))
}

export default async function RootLayout({ children, params }: Props) {
  const { locale } = await params
  if (!locales.includes(locale)) notFound()
  const messages = await getMessages({ locale })

  return (
    <html lang={locale} suppressHydrationWarning>
      <body suppressHydrationWarning>
        <NextIntlClientProvider messages={messages} locale={locale}>
          <SiteConfigProvider>
            <Suspense fallback={null}>
              <GoogleAnalytics />
            </Suspense>
            {children}
            <CookieConsent />
            <WhatsAppButton />
          </SiteConfigProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
