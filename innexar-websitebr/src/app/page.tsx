import type { Metadata } from 'next'
import { routing } from '@/i18n/routing'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
}

export default function RootPage() {
  redirect(`/${routing.defaultLocale}`)
}