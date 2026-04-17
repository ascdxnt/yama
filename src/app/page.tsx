import type { Metadata } from 'next';
import { HeroSection, CategoryShowcase, ProductGrid } from '@/components/blocks';
import { getFeaturedProducts } from '@/lib/sanity/queries';
import { CONTACT } from '@/lib/constants';
import { Reveal } from '@/components/patterns/reveal';

export const metadata: Metadata = {
  title: 'Yamaha Costa Rica — Motos, Cuadraciclos & Marino',
  description:
    'Distribuidor autorizado Yamaha en Costa Rica. Explorá motos, cuadraciclos y productos marinos. Cotizá en línea con financiamiento disponible.',
};

export default async function HomePage() {
  const featuredProducts = await getFeaturedProducts();

  return (
    <>
      <HeroSection />

      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8 lg:py-40">
        <Reveal className="mb-14 lg:mb-20">
          <span className="inline-block rounded-full bg-primary-500/10 px-3 py-1 text-[11px] font-semibold tracking-[0.16em] text-primary-500">
            Categorías
          </span>
          <h2 className="mt-4 max-w-[16ch] text-[clamp(1.85rem,3vw,2.85rem)] font-extrabold leading-[1.08] tracking-[-0.02em] text-text-primary">
            Explorá nuestras categorías
          </h2>
          <p className="mt-2 max-w-[52ch] text-base text-text-secondary sm:text-lg">
            Encontrá el producto Yamaha que se ajusta a tu forma de moverte.
          </p>
        </Reveal>
        <Reveal delay={100}>
          <CategoryShowcase />
        </Reveal>
      </section>

      <section className="border-t border-surface-subtle bg-surface-ghost">
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8 lg:py-40">
          <Reveal className="mb-14 lg:mb-20">
            <span className="inline-block rounded-full bg-secondary-500/10 px-3 py-1 text-[11px] font-semibold tracking-[0.16em] text-secondary-600">
              Destacados
            </span>
            <h2 className="mt-4 max-w-[14ch] text-[clamp(1.85rem,3vw,2.85rem)] font-extrabold leading-[1.08] tracking-[-0.02em] text-text-primary">
              Modelos destacados
            </h2>
            <p className="mt-2 max-w-[50ch] text-base text-text-secondary sm:text-lg">
              Los más buscados por nuestros clientes
            </p>
          </Reveal>
          <div>
            <ProductGrid products={featuredProducts} columns={3} />
          </div>
        </div>
      </section>

      <section className="px-4 py-24 sm:px-6 sm:py-32 lg:px-8 lg:py-40">
        <Reveal>
          <div className="noise-overlay relative mx-auto max-w-7xl rounded-[2rem] bg-primary-900 p-1.5 ring-1 ring-black/[0.06]">
            <div className="relative overflow-hidden rounded-[calc(2rem-0.375rem)] bg-primary-900 shadow-[inset_0_1px_0_rgba(255,255,255,0.18)]">
              <div
                className="absolute -right-[10%] -top-[20%] h-[50vh] w-[50vh] rounded-full opacity-20 blur-[100px]"
                style={{ background: 'radial-gradient(circle, var(--color-secondary-400), transparent 70%)' }}
                aria-hidden="true"
              />
              <div
                className="absolute -bottom-[15%] -left-[10%] h-[40vh] w-[40vh] rounded-full opacity-15 blur-[80px]"
                style={{ background: 'radial-gradient(circle, var(--color-primary-300), transparent 70%)' }}
                aria-hidden="true"
              />

              <div className="relative z-10 grid grid-cols-1 items-center gap-10 p-8 sm:p-12 lg:grid-cols-5 lg:p-16">
                <div className="lg:col-span-3">
                  <h2 className="max-w-[15ch] text-[clamp(1.8rem,3vw,2.7rem)] font-extrabold leading-[1.08] tracking-[-0.02em] text-white">
                    ¿Listo para tu próxima Yamaha?
                  </h2>
                  <p className="mt-4 max-w-[50ch] text-base leading-relaxed text-primary-200 sm:text-lg">
                    Cotizá en línea, recibí asesoría por WhatsApp o visitá la sucursal más cercana.
                  </p>
                </div>

                <div className="flex flex-col gap-4 sm:flex-row lg:col-span-2 lg:flex-col lg:items-end">
                  <a
                    href="/cotizador"
                    className="group inline-flex items-center gap-3 rounded-full bg-secondary-500 py-3.5 pl-7 pr-4 text-base font-semibold text-white transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-0.5 hover:bg-secondary-400 hover:shadow-glow-cta active:translate-y-0 active:scale-[0.98]"
                  >
                    Cotizar ahora
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-1 group-hover:-translate-y-[1px] group-hover:scale-105 group-hover:bg-white/30">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                      </svg>
                    </span>
                  </a>
                  <a
                    href={`https://wa.me/${CONTACT.whatsappRaw}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2.5 rounded-full border border-white/20 px-7 py-3.5 text-base font-semibold text-white transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:border-white/40 hover:bg-white/10 active:scale-[0.98]"
                  >
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.5.5 0 00.611.611l4.458-1.495A11.943 11.943 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.325 0-4.47-.744-6.228-2.01l-.436-.326-2.641.885.885-2.641-.326-.436A9.958 9.958 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
                    </svg>
                    WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
