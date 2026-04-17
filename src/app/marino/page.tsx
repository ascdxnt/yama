import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
export const metadata: Metadata = {
  title: 'Marino',
  description: 'Productos marinos Yamaha en Costa Rica. Waverunners, motores fuera de borda y servicio técnico marino.',
};

const MARINE_CATEGORIES = [
  {
    slug: 'waverunner',
    label: 'Waverunner',
    tagline: 'Adrenalina sobre el agua',
    image: '/categories/marino/waverunner/cover.avif',
  },
  {
    slug: 'motores-fuera-de-borda',
    label: 'Motores Fuera de Borda',
    tagline: 'Potencia confiable en el mar',
    image: '/categories/marino/motores-fuera-de-borda/cover.avif',
  },
  {
    slug: 'taller-marino',
    label: 'Taller Marino',
    tagline: 'Servicio técnico especializado',
    image: '/categories/marino/taller-marino/cover.avif',
  },
  {
    slug: 'repuestos-y-accesorios',
    label: 'Repuestos y Accesorios',
    tagline: 'Repuestos originales y accesorios marinos Yamaha',
    image: '/categories/marino/repuestos-y-accesorios/cover.avif',
  },
];

export default function MarinoPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-primary-900">
        <div className="pointer-events-none absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-secondary-500/20 blur-[120px]" aria-hidden="true" />
        <div className="pointer-events-none absolute -right-32 top-1/2 h-[400px] w-[400px] -translate-y-1/2 rounded-full bg-primary-400/15 blur-[100px]" aria-hidden="true" />
        <div className="pointer-events-none absolute bottom-0 left-1/3 h-[300px] w-[300px] rounded-full bg-secondary-600/10 blur-[80px]" aria-hidden="true" />

        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          <span className="inline-flex items-center rounded-full border border-white/15 bg-white/[0.06] px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-primary-200 backdrop-blur-sm">
            División marina
          </span>
          <h1 className="mt-5 text-[clamp(2rem,5vw,3.5rem)] font-extrabold leading-[1.1] text-white">
            Productos Marinos
          </h1>
          <p className="mt-3 max-w-xl text-lg leading-relaxed text-primary-200/80">
            Waverunners, motores fuera de borda y servicio técnico marino especializado.
          </p>
        </div>
      </section>

      {/* Bento category grid — 3 categories: Waverunner large, other two stacked */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="mb-12">
          <span className="inline-block rounded-full bg-primary-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.15em] text-primary-500">
            Categorías
          </span>
          <h2 className="mt-3 text-[clamp(1.75rem,3vw,2.25rem)] font-extrabold tracking-tight text-text-primary">
            Explorá por categoría
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
          {MARINE_CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/marino/${cat.slug}`}
              className="group flex flex-col overflow-hidden rounded-[1.5rem] bg-white shadow-card ring-1 ring-black/[0.04] transition-premium hover:-translate-y-1 hover:shadow-card-hover active:scale-[0.98]"
            >
              <div className="relative aspect-[4/3] bg-white">
                <Image
                  src={cat.image}
                  alt={cat.label}
                  fill
                  className="object-contain transition-transform group-hover:scale-[1.03]"
                  style={{
                    transitionDuration: 'var(--duration-glacial)',
                    transitionTimingFunction: 'var(--ease-out-expo)',
                  }}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </div>

              <div className="flex flex-1 flex-col p-5 sm:p-6">
                <h3 className="text-lg font-extrabold text-text-primary transition-colors-premium group-hover:text-secondary-500 sm:text-xl">
                  {cat.label}
                </h3>
                <p className="mt-1.5 text-[13px] text-text-secondary">
                  {cat.tagline}
                </p>
                <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-secondary-500 transition-colors-premium group-hover:text-secondary-400">
                  Ver modelos
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-secondary-500/10 transition-premium group-hover:bg-secondary-500/20">
                    <svg
                      className="h-3 w-3 transition-transform group-hover:translate-x-0.5"
                      style={{ transitionDuration: 'var(--duration-normal)', transitionTimingFunction: 'var(--ease-out-expo)' }}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
