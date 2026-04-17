'use client';

import { useCallback } from 'react';
import { cn, buildWhatsAppUrl } from '@/lib/utils';
import { dataLayer } from '@/lib/tracking/data-layer';

interface WhatsAppCtaProps {
  phoneNumber: string;
  message?: string;
  productId?: string;
  productName?: string;
  page: string;
  position: 'hero' | 'sticky' | 'fab';
  variant?: 'primary' | 'compact';
  className?: string;
}

export function WhatsAppCta({
  phoneNumber,
  message,
  productId,
  productName,
  page,
  position,
  variant = 'primary',
  className,
}: WhatsAppCtaProps) {
  const defaultMessage = productName
    ? `Hola, me interesa el modelo ${productName}. ¿Podrían darme más información?`
    : 'Hola, me gustaría recibir información sobre sus productos.';

  const href = buildWhatsAppUrl(phoneNumber, message || defaultMessage);

  const handleClick = useCallback(() => {
    dataLayer.push({
      name: 'whatsapp_click',
      params: { product_id: productId, page, position },
    });
  }, [productId, page, position]);

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className={cn(
        'inline-flex items-center justify-center gap-2 font-bold transition-all',
        variant === 'primary' && [
          'rounded-xl bg-whatsapp px-6 py-4 text-white shadow-md',
          'hover:bg-whatsapp-hover hover:shadow-lg hover:-translate-y-0.5',
          'active:translate-y-0 active:shadow-md',
        ],
        variant === 'compact' && [
          'rounded-lg bg-whatsapp px-4 py-2.5 text-sm text-white',
          'hover:bg-whatsapp-hover',
        ],
        className
      )}
    >
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className={cn(variant === 'primary' ? 'h-5 w-5' : 'h-4 w-4')}
        aria-hidden="true"
      >
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
        <path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.5.5 0 00.611.611l4.458-1.495A11.943 11.943 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.325 0-4.47-.744-6.228-2.01l-.436-.326-2.641.885.885-2.641-.326-.436A9.958 9.958 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
      </svg>
      {variant === 'primary' ? 'Consultar por WhatsApp' : 'WhatsApp'}
    </a>
  );
}
