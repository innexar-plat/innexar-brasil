'use client';

import dynamic from 'next/dynamic';

const CookieConsent = dynamic(() => import('@/components/CookieConsent'), { ssr: false });
const WhatsAppIcon = dynamic(() => import('@/components/WhatsAppIcon'), { ssr: false });

export default function DeferredWidgets() {
  return (
    <>
      <CookieConsent />
      <WhatsAppIcon />
    </>
  );
}
