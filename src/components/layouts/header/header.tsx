'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { YamahaLogo } from '@/components/primitives';
import { cn } from '@/lib/utils';
import { HeaderNav } from './header-nav';
import { HeaderCta } from './header-cta';

export function Header() {
  const [isAtTop, setIsAtTop] = useState(true);

  useEffect(() => {
    const onScroll = () => setIsAtTop(window.scrollY <= 4);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={cn(
        'z-nav pointer-events-none fixed inset-x-0 top-0 transition-[padding] duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]',
        isAtTop ? 'px-0 pt-0 lg:px-8 lg:pt-4' : 'px-4 pt-3 sm:px-6 lg:px-8 lg:pt-4'
      )}
    >
      <div className="mx-auto max-w-7xl">
        <div
          className={cn(
            'pointer-events-auto flex h-16 items-center justify-between bg-white/92 backdrop-blur-2xl backdrop-saturate-150 transition-[border-radius,border-color,box-shadow,background-color,padding] duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]',
            isAtTop
              ? 'rounded-none border-0 px-4 shadow-none lg:rounded-full lg:border lg:border-black/[0.10] lg:px-5 lg:shadow-float'
              : 'rounded-full border border-black/[0.10] px-4 shadow-float lg:px-5'
          )}
          style={{
            boxShadow: isAtTop
              ? '0 8px 20px rgba(0, 40, 100, 0.08), inset 0 1px 0 rgba(255,255,255,0.45)'
              : '0 10px 24px rgba(0, 40, 100, 0.08), 0 2px 8px rgba(0, 40, 100, 0.04), inset 0 1px 0 rgba(255,255,255,0.55)',
          }}
        >
          <Link
            href="/"
            className="flex shrink-0 items-center transition-premium-fast hover:opacity-80 active:scale-[0.97]"
            aria-label="Yamaha Costa Rica - Inicio"
          >
            <YamahaLogo className="h-7 w-auto sm:h-8" color="#003e95" />
          </Link>

          <div className="mx-3 flex min-w-0 flex-1 items-center justify-end lg:mx-6 lg:justify-center">
            <HeaderNav />
          </div>

          <HeaderCta />
        </div>
      </div>
    </header>
  );
}
