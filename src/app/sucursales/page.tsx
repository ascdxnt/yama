import type { Metadata } from 'next';
import { AGENCIAS, DISTRIBUIDORES } from '@/lib/locations';
import { LocationTabs } from './location-tabs';

export const metadata: Metadata = {
  title: 'Agencias y Distribuidores',
  description:
    'Agencias y distribuidores autorizados Yamaha en todo Costa Rica. San José, Alajuela, Heredia, Cartago, Guanacaste, Puntarenas, Limón.',
};

export default function SucursalesPage() {
  return (
    <>
      <section className="relative isolate overflow-hidden bg-primary-900">
        <div className="pointer-events-none absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-secondary-500/20 blur-[120px]" aria-hidden="true" />
        <div className="pointer-events-none absolute -right-32 top-1/2 h-[400px] w-[400px] -translate-y-1/2 rounded-full bg-primary-400/15 blur-[100px]" aria-hidden="true" />
        <div className="pointer-events-none absolute bottom-0 left-1/3 h-[300px] w-[300px] rounded-full bg-secondary-600/10 blur-[80px]" aria-hidden="true" />
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          <span className="inline-flex items-center rounded-full border border-white/15 bg-white/[0.06] px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-primary-200 backdrop-blur-sm">
            Red nacional
          </span>
          <h1 className="mt-5 text-[clamp(2rem,5vw,3.5rem)] font-extrabold leading-[1.1] text-white">
            Agencias y Distribuidores
          </h1>
          <p className="mt-3 max-w-xl text-lg leading-relaxed text-primary-200/80">
            Yamaha presente en todo Costa Rica. Encontrá la agencia o distribuidor más cercano.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <LocationTabs agencias={AGENCIAS} distribuidores={DISTRIBUIDORES} />
      </section>
    </>
  );
}
