'use client';

import { useEffect } from 'react';
import { dataLayer } from './data-layer';
import { initGA4 } from './ga4';
import { initMetaPixel } from './meta-pixel';
import { initTikTokPixel } from './tiktok-pixel';

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const unsubGA4 = initGA4();
    const unsubMeta = initMetaPixel();
    const unsubTikTok = initTikTokPixel();
    dataLayer.init();

    return () => {
      unsubGA4();
      unsubMeta();
      unsubTikTok();
    };
  }, []);

  return <>{children}</>;
}
