'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Reveal } from '@/components/patterns/reveal';

const BACKGROUND_IMAGE_URL = '/hero/backgrounds/hero-bg.avif';
const DEFAULT_FLYERS = [
  '/hero/flyers/flyer-1.avif',
  '/hero/flyers/flyer-2.avif',
  '/hero/flyers/flyer-3.avif',
  '/hero/flyers/flyer-4.avif',
  '/hero/flyers/flyer-5.avif',
];

type HeroSectionProps = {
  flyers?: string[];
};

export function HeroSection({ flyers = DEFAULT_FLYERS }: HeroSectionProps) {
  const [current, setCurrent] = useState(0);
  const [flyerCount, setFlyerCount] = useState(0);

  useEffect(() => {
    let count = 0;
    const checks = flyers.map((src) =>
      fetch(src, { method: 'HEAD' })
        .then((res) => {
          if (res.ok) count++;
        })
        .catch(() => {})
    );
    Promise.all(checks).then(() => setFlyerCount(count));
  }, [flyers]);

  const next = useCallback(() => {
    if (flyerCount > 0) setCurrent((c) => (c + 1) % flyerCount);
  }, [flyerCount]);

  const prev = useCallback(() => {
    if (flyerCount > 0) setCurrent((c) => (c - 1 + flyerCount) % flyerCount);
  }, [flyerCount]);

  useEffect(() => {
    if (flyerCount <= 1) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [flyerCount, next]);

  useEffect(() => {
    if (flyerCount === 0) {
      setCurrent(0);
      return;
    }
    if (current >= flyerCount) {
      setCurrent(0);
    }
  }, [current, flyerCount]);

  return (
    <section id="home-hero" className="noise-overlay relative overflow-hidden bg-transparent pt-[65px] lg:bg-primary-900 lg:pt-0">
      <div className="absolute inset-0 hidden bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 lg:block" />

      <div className="absolute inset-0 hidden lg:block">
        <div
          className="absolute inset-y-0 right-0 w-[70%] bg-cover bg-center"
          style={{
            backgroundImage: `url('${BACKGROUND_IMAGE_URL}')`,
            clipPath: 'polygon(30% 0, 100% 0, 100% 100%, 22% 100%)',
          }}
        />
        <div className="absolute inset-y-0 right-0 w-[70%] bg-[linear-gradient(110deg,rgba(3,18,46,0.34)_0%,rgba(3,23,58,0.16)_38%,rgba(3,17,42,0.3)_100%)] [clip-path:polygon(30%_0,100%_0,100%_100%,22%_100%)]" />
      </div>

      <div
        className="absolute -left-[15%] -top-[10%] hidden h-[70vh] w-[70vh] rounded-full opacity-25 blur-[120px] lg:block"
        style={{ background: 'radial-gradient(circle, var(--color-primary-400), transparent 70%)' }}
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-[5%] right-[5%] hidden h-[50vh] w-[50vh] rounded-full opacity-15 blur-[100px] lg:block"
        style={{ background: 'radial-gradient(circle, var(--color-secondary-400), transparent 70%)' }}
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto hidden max-w-7xl grid-cols-1 items-center gap-10 px-4 py-20 sm:px-6 sm:py-24 lg:grid lg:grid-cols-2 lg:gap-10 lg:px-8 lg:py-28">
        <Reveal className="lg:order-1 lg:justify-self-start lg:-translate-x-8">
          <span className="inline-block rounded-full bg-secondary-400/16 px-3 py-1 text-[11px] font-semibold tracking-[0.15em] text-secondary-100 [text-shadow:0_4px_18px_rgba(0,0,0,0.5)]">
            Distribuidor autorizado Yamaha
          </span>

          <h1 className="mt-6 max-w-[16ch] text-[clamp(2.5rem,5vw,4.7rem)] font-extrabold leading-[1.03] tracking-[-0.03em] text-white [text-shadow:0_8px_30px_rgba(0,0,0,0.72)]">
            La experiencia Yamaha{' '}
            <span className="bg-gradient-to-r from-[#0038a8] via-[#ffffff] to-[#ce1126] bg-clip-text text-transparent">
              en Costa Rica
            </span>
          </h1>

          <p className="mt-6 max-w-[50ch] text-base leading-relaxed text-white/92 [text-shadow:0_6px_22px_rgba(0,0,0,0.65)] sm:text-lg">
            Motos, cuadraciclos y productos marinos. Financiamiento disponible, servicio
            t&eacute;cnico autorizado y repuestos originales.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
            <Link
              href="/motos"
              className="group inline-flex items-center justify-center gap-3 rounded-full bg-secondary-500 px-7 py-3.5 text-base font-semibold text-white transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-0.5 hover:bg-secondary-400 hover:shadow-glow-cta active:translate-y-0 active:scale-[0.98] sm:pl-7 sm:pr-4"
            >
              Ver motos
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-1 group-hover:-translate-y-[1px] group-hover:scale-105 group-hover:bg-white/30">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </span>
            </Link>

            <Link
              href="/cotizador"
              className="inline-flex items-center justify-center rounded-full border border-white/35 bg-white/10 px-7 py-3.5 text-base font-semibold text-white transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:border-white/60 hover:bg-white/18 active:scale-[0.98]"
            >
              Cotizar ahora
            </Link>
          </div>
        </Reveal>

        <Reveal className="hidden lg:order-2 lg:flex lg:items-center lg:justify-end lg:translate-x-8" delay={120}>
          {flyerCount > 0 ? (
            <div className="relative w-full">
              <div className="relative aspect-[3/4] overflow-hidden drop-shadow-[0_26px_55px_rgba(0,0,0,0.42)]">
                {flyers.slice(0, flyerCount).map((src, i) => (
                  <div
                    key={src}
                    className="absolute inset-0 transition-all"
                    style={{
                      opacity: i === current ? 1 : 0,
                      transform: i === current ? 'scale(1)' : 'scale(0.95)',
                      transitionDuration: 'var(--duration-slow)',
                      transitionTimingFunction: 'var(--ease-out-expo)',
                    }}
                  >
                    <Image
                      src={src}
                      alt={`Promoción Yamaha ${i + 1}`}
                      fill
                      className="object-contain"
                      sizes="(max-width: 1280px) 50vw, 600px"
                    />
                  </div>
                ))}
              </div>

              {flyerCount > 1 && (
                <div className="mt-4 flex items-center justify-center gap-3">
                  <button
                    onClick={prev}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white/70 transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-white/20 hover:text-white active:scale-[0.98]"
                    aria-label="Anterior"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.7}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>

                  <div className="flex gap-1.5">
                    {flyers.slice(0, flyerCount).map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrent(i)}
                        className={`h-1.5 rounded-full transition-all ${
                          i === current ? 'w-6 bg-secondary-400' : 'w-1.5 bg-white/30 hover:bg-white/50'
                        }`}
                        style={{
                          transitionDuration: 'var(--duration-normal)',
                          transitionTimingFunction: 'var(--ease-out-expo)',
                        }}
                        aria-label={`Flyer ${i + 1}`}
                      />
                    ))}
                  </div>

                  <button
                    onClick={next}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white/70 transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-white/20 hover:text-white active:scale-[0.98]"
                    aria-label="Siguiente"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.7}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="relative h-80 w-80" aria-hidden="true">
              <div
                className="absolute inset-0 animate-pulse rounded-full opacity-20 blur-[80px]"
                style={{
                  background: 'radial-gradient(circle, var(--color-secondary-400), transparent 70%)',
                  animationDuration: '4s',
                }}
              />
            </div>
          )}
        </Reveal>
      </div>

      <div className="relative z-10 -mt-px px-0 pb-0 pt-0 lg:hidden">
        {flyerCount > 0 ? (
          <div className="w-full">
            <div className="relative w-full overflow-hidden">
              <Image
                key={`mobile-current-${current}`}
                src={flyers[current]}
                alt={`Promoción Yamaha ${current + 1}`}
                width={1080}
                height={1528}
                className="h-auto w-full object-contain"
                sizes="100vw"
                priority
              />

              {flyerCount > 1 && (
                <>
                  <button
                    onClick={prev}
                    className="absolute left-2 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/35 bg-black/58 text-white shadow-[0_6px_18px_rgba(0,0,0,0.45)] transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-black/70 active:scale-[0.98]"
                    aria-label="Anterior"
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>

                  <button
                    onClick={next}
                    className="absolute right-2 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/35 bg-black/58 text-white shadow-[0_6px_18px_rgba(0,0,0,0.45)] transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-black/70 active:scale-[0.98]"
                    aria-label="Siguiente"
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </>
              )}
            </div>

            {flyerCount > 1 && (
              <div className="mt-3 flex items-center justify-center gap-1.5 pb-3">
                {flyers.slice(0, flyerCount).map((_, i) => (
                  <button
                    key={`mobile-full-dot-${i}`}
                    onClick={() => setCurrent(i)}
                    className={`h-1.5 rounded-full transition-all ${
                      i === current ? 'w-6 bg-secondary-500' : 'w-1.5 bg-white/45 hover:bg-white/70'
                    }`}
                    style={{
                      transitionDuration: 'var(--duration-normal)',
                      transitionTimingFunction: 'var(--ease-out-expo)',
                    }}
                    aria-label={`Flyer ${i + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="h-[56svh] w-full" />
        )}
      </div>
    </section>
  );
}
