import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import Script from 'next/script'
import { Inter } from 'next/font/google'
import { Suspense } from 'react'
import { generateMetadata as genMeta } from '@/lib/seo'
import GoogleAnalytics from '@/components/GoogleAnalytics'
import StructuredData from '@/components/StructuredData'
import DeferredWidgets from '@/components/DeferredWidgets'
import MetaPixelProvider from '@/components/providers/MetaPixelProvider'
import { SiteConfigProvider } from '@/contexts/SiteConfigContext'
import '../globals.css'

const inter = Inter({ subsets: ['latin'], display: 'swap' })

const locales = ['en', 'pt', 'es']

type Props = {
  readonly children: React.ReactNode
  readonly params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params
  return genMeta(locale, 'default')
}

export default async function RootLayout({
  children,
  params
}: Props) {
  const { locale } = await params

  // Validate locale
  if (!locales.includes(locale)) {
    notFound()
  }

  const messages = await getMessages({ locale })
  const { generateStructuredData } = await import('@/lib/seo')
  // Layout-level: organization, website, localBusiness, breadcrumb (home segment)
  const structuredData = generateStructuredData(locale, 'home')

  return (
    <html lang={locale} suppressHydrationWarning data-scroll-behavior="smooth">
      <body className={inter.className} suppressHydrationWarning>
        {/* Workaround Next.js 16 + React 19: performance.measure negative timestamp (issue #86060) */}
        <Script
          id="perf-measure-patch"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var p=window.performance;if(!p||typeof p.measure!=="function"||p.__patched)return;var o=p.measure.bind(p);p.measure=function(){try{return o.apply(p,arguments)}catch(e){var m=(e&&e.message)||"",n=(e&&e.name)||"";if(m.indexOf("negative time stamp")!==-1||n==="InvalidAccessError"||n==="SyntaxError")return;throw e}};p.__patched=true}catch(_){}})();`,
          }}
        />
        <StructuredData
          organization={structuredData.organization}
          website={structuredData.website}
          localBusiness={structuredData.localBusiness}
          breadcrumb={structuredData.breadcrumb}
        />
        <Suspense fallback={null}>
          <GoogleAnalytics />
        </Suspense>
        <MetaPixelProvider pixelId={process.env.NEXT_PUBLIC_META_PIXEL_ID}>
          <NextIntlClientProvider messages={messages} locale={locale}>
            <SiteConfigProvider>
              {children}
            </SiteConfigProvider>
            <DeferredWidgets />
          </NextIntlClientProvider>
        </MetaPixelProvider>
      </body>
    </html>
  )
}

export function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'pt' }, { locale: 'es' }]
}
