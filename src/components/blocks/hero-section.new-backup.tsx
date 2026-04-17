'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const BACKGROUND_IMAGE_URL = '/hero/backgrounds/hero-bg.avif';
const FLYERS = [
  '/hero/flyers/flyer-1.avif',
  '/hero/flyers/flyer-2.avif',
  '/hero/flyers/flyer-3.avif',
  '/hero/flyers/flyer-4.avif',
  '/hero/flyers/flyer-5.avif',
];

export function HeroSection() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (FLYERS.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % FLYERS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section id="home-hero" className="relative min-h-[88dvh] overflow-hidden bg-[#08090b] pt-24 sm:min-h-[86dvh] sm:pt-28 lg:min-h-[84dvh] lg:pt-32">
      <div className="absolute inset-0">
        <div
          className="h-full w-full bg-cover bg-center"
          style={{
            backgroundImage: `url('${BACKGROUND_IMAGE_URL}')`,
          }}
        />
      </div>

      <div
        className="pointer-events-none absolute inset-0 opacity-[0.1]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.22) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.22) 1px, transparent 1px)',
          backgroundSize: '36px 36px',
          maskImage: 'radial-gradient(circle at 70% 40%, rgba(0,0,0,0.9), rgba(0,0,0,0.15) 70%)',
        }}
      />

      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[10%] top-[18%] h-2 w-2 rounded-full bg-white/65 shadow-[0_0_20px_rgba(255,255,255,0.45)]" />
        <div className="absolute left-[26%] top-[34%] h-1.5 w-1.5 rounded-full bg-white/70 shadow-[0_0_12px_rgba(255,255,255,0.7)]" />
        <div className="absolute right-[20%] top-[24%] h-2 w-2 rounded-full bg-white/65 shadow-[0_0_20px_rgba(255,255,255,0.45)]" />
        <div className="absolute right-[14%] top-[46%] h-1.5 w-1.5 rounded-full bg-white/70 shadow-[0_0_12px_rgba(255,255,255,0.7)]" />
      </div>

      <div className="relative z-10 mx-auto grid min-h-[calc(88dvh-8rem)] max-w-7xl grid-cols-1 gap-10 px-4 pb-10 sm:min-h-[calc(86dvh-8rem)] sm:px-6 lg:min-h-[calc(84dvh-8rem)] lg:grid-cols-[0.98fr_1.02fr] lg:items-center lg:gap-4 lg:px-8 lg:pb-14">
        <div className="max-w-xl">
          <h1 className="text-balance text-[clamp(2.1rem,5.2vw,4.7rem)] font-extrabold leading-[1.03] tracking-[-0.03em] text-white">
            La experiencia Yamaha en{' '}
            <span className="bg-gradient-to-r from-[#0052B4] via-white to-[#D80027] bg-clip-text text-transparent">
              Costa Rica
            </span>
          </h1>
          <p className="mt-5 max-w-[52ch] text-pretty text-base leading-relaxed text-slate-200 sm:text-lg">
            Motos, cuadraciclos y productos marinos. Financiamiento disponible, servicio tecnico autorizado y repuestos originales.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Link
              href="/motos"
              className="inline-flex h-11 items-center gap-2 rounded-full border border-white/34 bg-white/14 px-5 text-sm font-semibold text-white shadow-[0_8px_22px_rgba(0,0,0,0.24)] transition-all hover:-translate-y-0.5 hover:bg-white/20"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-4.35-4.35m1.6-5.15a7.5 7.5 0 1 1-15 0 7.5 7.5 0 0 1 15 0Z" />
              </svg>
              Ver motos
            </Link>
            <Link
              href="/cotizador"
              className="inline-flex h-11 items-center gap-2 rounded-full border border-white/40 bg-white/12 px-5 text-sm font-semibold text-white shadow-[0_0_16px_rgba(255,255,255,0.2)] transition-all hover:-translate-y-0.5 hover:border-white/60 hover:bg-white/18"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.5h4.5v7.5H3v-7.5Zm6.75-4.5h4.5V21h-4.5V9Zm6.75-6h4.5v18h-4.5V3Z" />
              </svg>
              Cotizar ahora
            </Link>
          </div>

          <div className="mt-8 h-1.5 w-full max-w-xs overflow-hidden rounded-full bg-white/20">
            <div className="h-full w-[42%] rounded-full bg-white/75 shadow-[0_0_14px_rgba(255,255,255,0.45)]" />
          </div>
        </div>

        <div className="relative min-h-[620px] sm:min-h-[660px] lg:min-h-[720px]">
          <div className="absolute inset-x-0 top-[1%] z-20 mx-auto w-[102%] max-w-[760px] overflow-visible lg:right-[-3%] lg:mx-0 lg:w-[108%]">
            <div className="relative aspect-[3/4] w-full overflow-visible">
              <div className="pointer-events-none absolute -inset-x-12 -inset-y-16 -z-10 rounded-[40px] bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.22)_0%,rgba(255,255,255,0.08)_38%,rgba(8,9,11,0)_72%)] blur-2xl" />
              {FLYERS.map((src, i) => (
                <div
                  key={src}
                  className="absolute inset-0 transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]"
                  style={{ opacity: i === current ? 1 : 0, transform: i === current ? 'scale(1)' : 'scale(0.972)' }}
                >
                  <Image src={src} alt={`Promoción Yamaha ${i + 1}`} fill className="object-contain drop-shadow-[0_26px_55px_rgba(0,0,0,0.44)]" sizes="(max-width: 1280px) 55vw, 760px" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
