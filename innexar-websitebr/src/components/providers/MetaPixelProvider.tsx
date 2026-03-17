'use client';

import { useEffect } from 'react';
import { initMetaPixel, trackPageView } from '@/lib/meta-pixel';
import { usePathname, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function MetaPixelInner({ pixelId }: { pixelId?: string }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!pixelId) return;
    initMetaPixel(pixelId);
  }, [pixelId]);

  useEffect(() => {
    if (!pixelId) return;
    trackPageView();
  }, [pathname, searchParams, pixelId]);

  return null;
}

interface MetaPixelProviderProps {
  children: React.ReactNode;
  pixelId?: string;
}

export default function MetaPixelProvider({ children, pixelId }: MetaPixelProviderProps) {
  return (
    <>
      <Suspense fallback={null}>
        <MetaPixelInner pixelId={pixelId} />
      </Suspense>
      {children}
    </>
  );
}
