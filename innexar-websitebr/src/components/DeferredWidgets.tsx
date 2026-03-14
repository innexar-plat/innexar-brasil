'use client'

import dynamic from 'next/dynamic'

const AIChat = dynamic(() => import('@/components/ai-chat/AIChat'), { ssr: false })
const CookieConsent = dynamic(() => import('@/components/CookieConsent'), { ssr: false })

export default function DeferredWidgets() {
  return (
    <>
      <AIChat />
      <CookieConsent />
    </>
  )
}
