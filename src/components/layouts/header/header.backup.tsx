import Link from 'next/link';
import { YamahaLogo } from '@/components/primitives';
import { HeaderNav } from './header-nav';
import { HeaderCta } from './header-cta';

export function Header() {
  return (
    <header className="z-nav pointer-events-none fixed inset-x-0 top-0 px-4 pt-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div
          className="pointer-events-auto flex h-16 items-center gap-3 rounded-full border border-black/[0.06] bg-white/84 px-4 shadow-float backdrop-blur-2xl backdrop-saturate-150 lg:gap-6"
          style={{
            boxShadow:
              '0 10px 24px rgba(0, 40, 100, 0.08), 0 2px 8px rgba(0, 40, 100, 0.04), inset 0 1px 0 rgba(255,255,255,0.55)',
          }}
        >
          <Link
            href="/"
            className="mr-2 flex shrink-0 items-center transition-premium-fast hover:opacity-80 active:scale-[0.97] sm:mr-4 lg:mr-6"
            aria-label="Yamaha Costa Rica - Inicio"
          >
            <YamahaLogo className="h-7 w-auto sm:h-8" color="#003e95" />
          </Link>

          <div className="flex min-w-0 flex-1 items-center justify-end lg:justify-start">
            <HeaderNav />
          </div>

          <HeaderCta />
        </div>
      </div>
    </header>
  );
}
