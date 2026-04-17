'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Reveal } from '@/components/patterns/reveal';

const FLYERS = [
  '/hero/flyers/flyer-1.avif',
  '/hero/flyers/flyer-2.avif',
  '/hero/flyers/flyer-3.avif',
  '/hero/flyers/flyer-4.avif',
  '/hero/flyers/flyer-5.avif',
];

export function HeroSection() {
  const [current, setCurrent] = useState(0);
  const [flyerCount, setFlyerCount] = useState(0);

  useEffect(() => {
    let count = 0;
    const checks = FLYERS.map((src) =>
      fetch(src, { method: 'HEAD' })
        .then((res) => {
          if (res.ok) count++;
        })
        .catch(() => {})
    );
    Promise.all(checks).then(() => setFlyerCount(count));
  }, []);

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

  return (
    <section className="noise-overlay relative overflow-hidden bg-primary-900">
      <div className="absolute inset-0 bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700" />

      <div
        className="absolute -left-[15%] -top-[10%] h-[70vh] w-[70vh] rounded-full opacity-25 blur-[120px]"
        style={{ background: 'radial-gradient(circle, var(--color-primary-400), transparent 70%)' }}
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-[5%] right-[5%] h-[50vh] w-[50vh] rounded-full opacity-15 blur-[100px]"
        style={{ background: 'radial-gradient(circle, var(--color-secondary-400), transparent 70%)' }}
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-4 py-20 sm:px-6 sm:py-24 lg:grid-cols-2 lg:gap-10 lg:px-8 lg:py-28">
        <Reveal>
          <span className="inline-block rounded-full bg-secondary-500/15 px-3 py-1 text-[11px] font-semibold tracking-[0.15em] text-secondary-300">
            Distribuidor autorizado Yamaha
          </span>

          <h1 className="mt-6 max-w-[16ch] text-[clamp(2.5rem,5vw,4.7rem)] font-extrabold leading-[1.03] tracking-[-0.03em] text-white">
            La experiencia Yamaha{' '}
            <span className="bg-gradient-to-r from-[#002b7f] via-[#ffffff] to-[#ce1126] bg-clip-text text-transparent">
              en Costa Rica
            </span>
          </h1>

          <p className="mt-6 max-w-[50ch] text-base leading-relaxed text-primary-200 sm:text-lg">
            Motos, cuadraciclos y productos marinos. Financiamiento disponible, servicio
            t&eacute;cnico autorizado y repuestos originales.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
            <Link
              href="/motos"
              className="group inline-flex items-center gap-3 rounded-full bg-secondary-500 py-3.5 pl-7 pr-4 text-base font-semibold text-white transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-0.5 hover:bg-secondary-400 hover:shadow-glow-cta active:translate-y-0 active:scale-[0.98]"
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
              className="inline-flex items-center justify-center rounded-full border border-white/20 px-7 py-3.5 text-base font-semibold text-white transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:border-white/40 hover:bg-white/10 active:scale-[0.98]"
            >
              Cotizar ahora
            </Link>
          </div>
        </Reveal>

        <Reveal className="hidden lg:flex lg:items-center lg:justify-end" delay={120}>
          {flyerCount > 0 ? (
            <div className="relative w-full">
              <div className="relative aspect-[3/4] overflow-hidden">
                {FLYERS.slice(0, flyerCount).map((src, i) => (
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
                    {FLYERS.slice(0, flyerCount).map((_, i) => (
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
    </section>
  );
}
