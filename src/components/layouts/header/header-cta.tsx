'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { dataLayer } from '@/lib/tracking/data-layer';

export function HeaderCta() {
  const pathname = usePathname();

  return (
    <div className="hidden shrink-0 items-center lg:flex">
      <Link
        href="/cotizador"
        onClick={() => {
          dataLayer.push({ name: 'cta_cotizar_nav', params: { page: pathname } });
        }}
        className="group inline-flex h-10 items-center gap-2 rounded-full bg-primary-500 pl-5 pr-2 text-sm font-semibold text-white transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-primary-600 active:scale-[0.98]"
      >
        Cotizar
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/20 transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-1 group-hover:-translate-y-[1px] group-hover:scale-105">
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.7}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
          </svg>
        </span>
      </Link>
    </div>
  );
}
