import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { FilterableProductGrid } from '@/components/blocks';
import { getAllProducts } from '@/lib/sanity/queries';
export const metadata: Metadata = {
  title: 'Motos',
  description: 'Explorá toda la línea de motos Yamaha disponibles en Costa Rica. Scooter, urbanas, montañero, alta cilindrada, motocross y enduro.',
};

const CATEGORY_CARDS = [
  {
    slug: 'scooter',
    label: 'Scooter',
    tagline: 'Movilidad urbana inteligente',
    image: '/categories/motos/scooter/cover.avif',
  },
  {
    slug: 'urbanas',
    label: 'Urbanas / Street',
    tagline: 'Dominio del asfalto diario',
    image: '/categories/motos/urbanas/cover.avif',
  },
  {
    slug: 'montanero',
    label: 'Montañero',
    tagline: 'Sin límites en cualquier terreno',
    image: '/categories/motos/montanero/cover.avif',
  },
  {
    slug: 'alta-cilindrada',
    label: 'Alta Cilindrada',
    tagline: 'Potencia y adrenalina pura',
    image: '/categories/motos/alta-cilindrada/cover.avif',
  },
  {
    slug: 'motocross',
    label: 'Motocross',
    tagline: 'Competición al máximo nivel',
    image: '/categories/motos/motocross/cover.avif',
  },
  {
    slug: 'enduro',
    label: 'Enduro',
    tagline: 'Aventura sin fronteras',
    image: '/categories/motos/enduro/cover.avif',
  },
];

export default async function MotosPage() {
  const products = await getAllProducts();
  const motos = products.filter((product) => product.category.parentCategory === 'motos');

  return (
    <>
      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-primary-900">
        <div className="pointer-events-none absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-secondary-500/20 blur-[120px]" aria-hidden="true" />
        <div className="pointer-events-none absolute -right-32 top-1/2 h-[400px] w-[400px] -translate-y-1/2 rounded-full bg-primary-400/15 blur-[100px]" aria-hidden="true" />
        <div className="pointer-events-none absolute bottom-0 left-1/3 h-[300px] w-[300px] rounded-full bg-secondary-600/10 blur-[80px]" aria-hidden="true" />

        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          <span className="inline-flex items-center rounded-full border border-white/15 bg-white/[0.06] px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-primary-200 backdrop-blur-sm">
            Catálogo completo
          </span>
          <h1 className="mt-5 text-[clamp(2rem,5vw,3.5rem)] font-extrabold leading-[1.1] text-white">
            Motos Yamaha
          </h1>
          <p className="mt-3 max-w-xl text-lg leading-relaxed text-primary-200/80">
            Encontrá tu próxima moto. Desde scooters urbanos hasta máquinas de competición.
          </p>
        </div>
      </section>

      {/* Bento category grid */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="mb-12">
          <span className="inline-block rounded-full bg-primary-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.15em] text-primary-500">
            Categorías
          </span>
          <h2 className="mt-3 text-[clamp(1.75rem,3vw,2.25rem)] font-extrabold tracking-tight text-text-primary">
            Explorá por categoría
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 sm:gap-5">
          {CATEGORY_CARDS.map((cat) => (
            <Link
              key={cat.slug}
              href={`/motos/${cat.slug}`}
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

      {motos.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 sm:pb-20 lg:px-8 lg:pb-24">
          <div className="mb-8">
            <span className="inline-block rounded-full bg-primary-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.15em] text-primary-500">
              Catálogo
            </span>
            <h2 className="mt-3 text-[clamp(1.75rem,3vw,2.25rem)] font-extrabold tracking-tight text-text-primary">
              Filtrá todos los modelos
            </h2>
          </div>
          <FilterableProductGrid products={motos} columns={3} allowCategoryFilter />
        </section>
      )}
    </>
  );
}
