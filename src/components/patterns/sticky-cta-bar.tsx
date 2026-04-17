'use client';

import { useState, useEffect } from 'react';
import { cn, formatPrice, buildWhatsAppUrl } from '@/lib/utils';
import type { Currency } from '@/lib/utils';
import { dataLayer } from '@/lib/tracking/data-layer';

interface StickyCtaBarProps {
  productName: string;
  price: number;
  salePrice?: number;
  currency: Currency;
  productId: string;
  whatsappNumber: string;
  hidePrice?: boolean;
}

export function StickyCtaBar({ productName, price, salePrice, currency, productId, whatsappNumber, hidePrice = false }: StickyCtaBarProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const trigger = document.querySelector('article > *:first-child');
    if (!trigger) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setVisible(!entry.isIntersecting);
      },
      {
        threshold: 0,
        rootMargin: '-120px 0px 0px 0px',
      }
    );

    observer.observe(trigger);
    return () => observer.disconnect();
  }, []);

  const whatsappHref = buildWhatsAppUrl(
    whatsappNumber,
    `Hola, me interesa el modelo ${productName}. ¿Podrían darme más información?`
  );

  return (
    <div
      className={cn(
        'fixed inset-x-0 bottom-0 z-40 border-t border-surface-subtle bg-white/95 pb-[env(safe-area-inset-bottom,0px)] backdrop-blur-md transition-transform duration-300 lg:hidden',
        visible ? 'translate-y-0' : 'translate-y-full'
      )}
    >
      <div className="mx-auto flex h-16 max-w-lg items-center justify-between gap-2 pl-4 pr-[calc(1rem+5.5rem)] sm:gap-3">
        <div className="min-w-0 pr-1">
          <p className="truncate text-sm font-bold text-text-primary" title={productName}>
            {productName}
          </p>
          {hidePrice ? (
            <p className="truncate text-sm font-extrabold text-text-primary">Consultar precio</p>
          ) : salePrice != null && salePrice < price ? (
            <div className="flex min-w-0 flex-wrap items-baseline gap-x-1.5 gap-y-0.5">
              <p className="truncate text-sm font-extrabold text-red-600">{formatPrice(salePrice, currency)}</p>
              <p className="truncate text-xs text-text-muted line-through">{formatPrice(price, currency)}</p>
            </div>
          ) : (
            <p className="truncate text-sm font-extrabold text-text-primary">{formatPrice(price, currency)}</p>
          )}
        </div>
        <div className="flex shrink-0 gap-2">
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => {
              dataLayer.push({
                name: 'whatsapp_click',
                params: { product_id: productId, page: window.location.pathname, position: 'sticky' },
              });
            }}
            className="flex h-10 items-center gap-1.5 rounded-lg bg-whatsapp px-4 text-sm font-bold text-white transition-colors hover:bg-whatsapp-hover"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
              <path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.5.5 0 00.611.611l4.458-1.495A11.943 11.943 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.325 0-4.47-.744-6.228-2.01l-.436-.326-2.641.885.885-2.641-.326-.436A9.958 9.958 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
            </svg>
            WA
          </a>
          <a
            href="/cotizador"
            className="flex h-10 items-center rounded-lg bg-secondary-500 px-4 text-sm font-bold text-white transition-colors hover:bg-secondary-400"
          >
            Cotizar
          </a>
        </div>
      </div>
    </div>
  );
}
