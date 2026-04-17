'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { NAV_ITEMS, CATEGORIES, CONTACT } from '@/lib/constants';
import { useUIStore } from '@/stores/ui-store';

function getSubcategoryHref(baseHref: string, categoryKey: string, sub: { slug: string; href?: string }) {
  if (sub.href) return sub.href;
  if (categoryKey === 'marino') return `/marino/${sub.slug}`;
  return `${baseHref}/${sub.slug}`;
}

export function HeaderNav() {
  const pathname = usePathname();
  const { activeMegaMenu, setActiveMegaMenu, mobileMenuOpen, setMobileMenuOpen, closeAll } = useUIStore();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const closeTimerRef = useRef<NodeJS.Timeout | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [mobileMenuMounted, setMobileMenuMounted] = useState(false);
  const [mobileMenuVisible, setMobileMenuVisible] = useState(false);

  useEffect(() => {
    closeAll();
  }, [pathname, closeAll]);

  useEffect(() => {
    if (!mobileMenuMounted) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileMenuMounted]);

  useEffect(() => {
    return () => {
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    };
  }, []);

  const openMobileMenu = useCallback(() => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }

    setMobileMenuMounted(true);
    setMobileMenuOpen(true);
    requestAnimationFrame(() => setMobileMenuVisible(true));
  }, [setMobileMenuOpen]);

  const closeMobileMenu = useCallback(() => {
    setMobileMenuVisible(false);
    setMobileMenuOpen(false);

    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    closeTimerRef.current = setTimeout(() => {
      setMobileMenuMounted(false);
      closeTimerRef.current = null;
    }, 720);
  }, [setMobileMenuOpen]);

  useEffect(() => {
    if (!mobileMenuMounted) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeMobileMenu();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [mobileMenuMounted, closeMobileMenu]);

  const handleMouseEnter = useCallback(
    (key: string | null) => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (key) setActiveMegaMenu(key);
    },
    [setActiveMegaMenu]
  );

  const handleMouseLeave = useCallback(() => {
    timeoutRef.current = setTimeout(() => setActiveMegaMenu(null), 200);
  }, [setActiveMegaMenu]);

  return (
    <>
      <nav className="hidden lg:flex lg:items-center lg:justify-center lg:gap-0.5" ref={menuRef}>
        {NAV_ITEMS.map((item) => (
          <div
            key={item.href}
            onMouseEnter={() => handleMouseEnter(item.hasMegaMenu ? item.key : null)}
            onMouseLeave={handleMouseLeave}
            className="relative"
          >
            <Link
              href={item.href}
              className={cn(
                'relative inline-flex items-center rounded-full px-2.5 py-2 text-sm font-semibold transition-colors-premium',
                pathname.startsWith(item.href)
                  ? 'bg-primary-500/[0.10] text-primary-700'
                  : 'text-[#4b5563] hover:bg-slate-100 hover:text-[#0f172a]'
              )}
            >
              {item.label}
              {pathname.startsWith(item.href) && (
                <span
                  className="absolute -bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full"
                  style={{ background: '#003e95' }}
                />
              )}
              {item.hasMegaMenu && (
                  <svg
                    className={cn(
                    'ml-1 h-3.5 w-3.5 transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]',
                    activeMegaMenu === item.key && 'rotate-180'
                  )}
                  fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              )}
            </Link>

            {item.hasMegaMenu && item.key && activeMegaMenu === item.key && (
              <div
                className="z-overlay absolute left-1/2 top-full w-[480px] -translate-x-1/2 pt-2"
                onMouseEnter={() => handleMouseEnter(item.key)}
                onMouseLeave={handleMouseLeave}
              >
                <div className="overflow-hidden rounded-[1.25rem] border border-black/[0.05] bg-white shadow-elevated">
                  <div className="p-5">
                    <h3 className="text-[11px] font-semibold tracking-[0.16em] text-text-muted">
                      {CATEGORIES[item.key as keyof typeof CATEGORIES]?.label}
                    </h3>
                    <div className="mt-3 grid grid-cols-2 gap-0.5">
                      {CATEGORIES[item.key as keyof typeof CATEGORIES]?.subcategories.map((sub) => (
                        <Link
                          key={sub.slug}
                          href={getSubcategoryHref(item.href, item.key, sub)}
                          className="group flex items-center rounded-lg px-3 py-2.5 text-sm font-medium text-text-primary transition-colors-premium hover:bg-surface-ghost hover:text-secondary-500"
                          onClick={() => setActiveMegaMenu(null)}
                        >
                          {sub.label}
                          <svg
                            className="ml-auto h-3.5 w-3.5 text-text-muted opacity-0 transition-opacity group-hover:opacity-100"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                          </svg>
                        </Link>
                      ))}
                    </div>
                    <div className="mt-3 border-t border-black/[0.06] pt-3">
                      <Link
                        href={item.href}
                        className="text-sm font-semibold text-secondary-500 transition-colors-premium hover:text-secondary-600"
                        onClick={() => setActiveMegaMenu(null)}
                      >
                        Ver todo {CATEGORIES[item.key as keyof typeof CATEGORIES]?.label.toLowerCase()} →
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </nav>

      <button
        type="button"
        onClick={() => (mobileMenuOpen ? closeMobileMenu() : openMobileMenu())}
        className="relative ml-auto inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-text-secondary transition-premium-fast hover:bg-surface-ghost lg:hidden"
        aria-label={mobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
      >
        <span className="relative block h-5 w-5">
          <span
            className={cn(
              'absolute left-0 top-[6px] h-[1.5px] w-5 rounded-full bg-current transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]',
              mobileMenuOpen && 'top-[9px] rotate-45'
            )}
          />
          <span
            className={cn(
              'absolute left-0 top-[12px] h-[1.5px] w-5 rounded-full bg-current transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]',
              mobileMenuOpen && 'top-[9px] -rotate-45'
            )}
          />
        </span>
      </button>

      {mobileMenuMounted &&
        createPortal(
          <div
            className="z-overlay fixed inset-x-0 bottom-0 top-[5.25rem] overflow-y-auto bg-white/84 pt-6 pb-[env(safe-area-inset-bottom,0px)] backdrop-blur-3xl transition-[opacity,transform,clip-path] duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] lg:hidden"
            style={{
              opacity: mobileMenuVisible ? 1 : 0,
              transform: mobileMenuVisible ? 'translate3d(0,0,0) scale(1)' : 'translate3d(0,-8px,0) scale(0.985)',
              clipPath: mobileMenuVisible
                ? 'circle(180% at calc(100% - 1.5rem) 0.25rem)'
                : 'circle(0.8rem at calc(100% - 1.5rem) 0.25rem)',
              pointerEvents: mobileMenuVisible ? 'auto' : 'none',
            }}
            role="dialog"
            aria-modal="true"
            aria-label="Menú principal"
          >
            <nav className="mx-auto max-w-lg px-4 pb-8">
              {NAV_ITEMS.map((item) => (
                <MobileNavItem
                  key={item.href}
                  label={item.label}
                  href={item.href}
                  categoryKey={item.hasMegaMenu ? item.key : null}
                  isActive={pathname.startsWith(item.href)}
                  onNavigate={closeMobileMenu}
                  stagger={item.href === '/motos' ? 100 : item.href === '/cuadraciclos' ? 140 : item.href === '/marino' ? 180 : item.href === '/repuestos' ? 220 : item.href === '/taller' ? 260 : 300}
                />
              ))}

              <div className="mt-8 space-y-3 border-t border-surface-subtle pt-6">
                <Link
                  href="/cotizador"
                  onClick={closeMobileMenu}
                  className="group flex h-12 w-full items-center justify-center gap-2 rounded-full bg-secondary-500 px-2 text-sm font-semibold text-white transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.98]"
                >
                  Cotizar Ahora
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/20 transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-1 group-hover:-translate-y-[1px] group-hover:scale-105">
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.7}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                    </svg>
                  </span>
                </Link>
                <a
                  href={`https://wa.me/${CONTACT.whatsappRaw}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={closeMobileMenu}
                  className="flex h-12 w-full items-center justify-center gap-2 rounded-full border border-emerald-300/30 bg-emerald-500 text-sm font-semibold text-white transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.98]"
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.5.5 0 00.611.611l4.458-1.495A11.943 11.943 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.325 0-4.47-.744-6.228-2.01l-.436-.326-2.641.885.885-2.641-.326-.436A9.958 9.958 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
                  </svg>
                  WhatsApp
                </a>
              </div>
            </nav>
          </div>,
          document.body
        )}
    </>
  );
}

function MobileNavItem({
  label,
  href,
  categoryKey,
  isActive,
  onNavigate,
  stagger,
}: {
  label: string;
  href: string;
  categoryKey: string | null;
  isActive: boolean;
  onNavigate: () => void;
  stagger: number;
}) {
  const [expanded, setExpanded] = useState(false);

  if (!categoryKey) {
    return (
      <Link
        href={href}
        onClick={onNavigate}
        className={cn(
          'flex h-12 items-center rounded-2xl px-3 text-base font-medium transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]',
          isActive ? 'text-secondary-500' : 'text-text-primary hover:bg-surface-ghost'
        )}
        style={{
          animation: 'mobileMenuReveal 800ms both',
          animationDelay: `${stagger}ms`,
          animationTimingFunction: 'cubic-bezier(0.32,0.72,0,1)',
        }}
      >
        {label}
      </Link>
    );
  }

  const category = CATEGORIES[categoryKey as keyof typeof CATEGORIES];

  return (
    <div>
      <button
        onClick={() => setExpanded(!expanded)}
        className={cn(
          'flex h-12 w-full items-center justify-between rounded-2xl px-3 text-base font-medium transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]',
          isActive ? 'text-secondary-500' : 'text-text-primary hover:bg-surface-ghost'
        )}
        style={{
          animation: 'mobileMenuReveal 800ms both',
          animationDelay: `${stagger}ms`,
          animationTimingFunction: 'cubic-bezier(0.32,0.72,0,1)',
        }}
      >
        {label}
        <svg
          className={cn('h-4 w-4 transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]', expanded && 'rotate-180')}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {expanded && category && (
        <div className="mb-2 ml-3 border-l-2 border-surface-subtle pl-3">
          {category.subcategories.map((sub) => (
            <Link
              key={sub.slug}
              href={getSubcategoryHref(href, categoryKey, sub)}
              onClick={onNavigate}
              className="flex h-10 items-center rounded-lg px-3 text-sm font-medium text-text-secondary transition-colors-premium hover:bg-secondary-500/[0.06] hover:text-secondary-500"
            >
              {sub.label}
            </Link>
          ))}
          <Link
            href={href}
            onClick={onNavigate}
            className="flex h-10 items-center rounded-lg px-3 text-sm font-semibold text-secondary-500 transition-colors-premium"
          >
            Ver todo →
          </Link>
        </div>
      )}
    </div>
  );
}
