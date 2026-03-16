import type { Metadata } from 'next'
import { redirect } from 'next/navigation'

const PORTAL_URL = process.env.NEXT_PUBLIC_PORTAL_URL || 'https://portal.innexar.com.br'

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

export default async function LaunchLayout({
  params,
}: {
  readonly params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  redirect(`${PORTAL_URL}/${locale}`)
}
