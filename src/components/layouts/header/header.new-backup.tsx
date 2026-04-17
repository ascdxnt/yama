 'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { YamahaLogo } from '@/components/primitives';
import { HeaderNav } from './header-nav';

export function Header() {
  const pathname = usePathname();
  const [overHomeHero, setOverHomeHero] = useState(false);

  useEffect(() => {
    if (pathname !== '/') {
      setOverHomeHero(false);
      return;
    }

    let observer: IntersectionObserver | null = null;
    let raf = 0;
    let cancelled = false;

    const attachObserver = () => {
      const hero = document.getElementById('home-hero');
      if (!hero) return false;

      observer = new IntersectionObserver(([entry]) => setOverHomeHero(entry.isIntersecting), {
        threshold: 0.15,
      });

      observer.observe(hero);
      return true;
    };

    if (!attachObserver()) {
      setOverHomeHero(window.scrollY < 120);

      let attempts = 0;
      const retry = () => {
        if (cancelled) return;
        attempts += 1;
        if (attachObserver()) return;
        if (attempts < 120) raf = window.requestAnimationFrame(retry);
      };

      raf = window.requestAnimationFrame(retry);
    }

    return () => {
      cancelled = true;
      if (raf) window.cancelAnimationFrame(raf);
      observer?.disconnect();
    };
  }, [pathname]);

  return (
    <header className="z-nav pointer-events-none fixed inset-x-0 top-0 px-4 pt-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div
          className="pointer-events-auto flex h-16 items-center justify-between rounded-2xl px-4 backdrop-blur-2xl backdrop-saturate-150 transition-all duration-500 ease-out lg:px-5"
          style={{
            border: overHomeHero ? '1px solid rgba(255,255,255,0.26)' : '1px solid rgba(0,0,0,0.08)',
            background: overHomeHero ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.88)',
            color: overHomeHero ? '#ffffff' : '#003e95',
            boxShadow: overHomeHero
              ? 'inset 0 1px 0 rgba(255,255,255,0.35), 0 12px 30px rgba(0,0,0,0.35)'
              : 'inset 0 1px 0 rgba(255,255,255,0.55), 0 10px 24px rgba(0, 40, 100, 0.10)',
          }}
        >
          <Link
            href="/"
            className="flex h-10 shrink-0 items-center transition-premium-fast hover:opacity-80 active:scale-[0.97]"
            aria-label="Yamaha Costa Rica - Inicio"
          >
            <YamahaLogo className="h-7 w-auto sm:h-8" color={overHomeHero ? '#ffffff' : '#003e95'} />
          </Link>

          <div className="mx-4 flex min-w-0 flex-1 items-center justify-center">
            <HeaderNav />
          </div>

          <Link
            href="/cotizador"
            className="hidden h-10 items-center rounded-full px-4 text-sm font-semibold transition-all lg:inline-flex"
            style={{
              border: overHomeHero ? '1px solid rgba(255,255,255,0.30)' : '1px solid rgba(0,62,149,0.22)',
              background: overHomeHero ? 'rgba(255,255,255,0.12)' : 'rgba(0,62,149,0.08)',
              color: overHomeHero ? '#ffffff' : '#003e95',
            }}
          >
            Cotizar
          </Link>
        </div>
      </div>
    </header>
  );
}
