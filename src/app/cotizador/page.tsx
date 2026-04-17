import type { Metadata } from 'next';
import fs from 'node:fs';
import path from 'node:path';
import Image from 'next/image';
import { getAllProducts } from '@/lib/sanity/queries';
import { buildCotizadorModelEntries } from '@/lib/cotizador-form-options';
import { CotizadorForm } from './cotizador-form';

export const metadata: Metadata = {
  title: 'Cotizar',
  description: 'Solicitá una cotización para cualquier producto Yamaha. Respuesta rápida y financiamiento disponible.',
};

function getCotizadorFlyerSrc(): string | null {
  const dir = path.join(process.cwd(), 'public', 'cotizador-flyer');
  if (fs.existsSync(path.join(dir, 'flyer.avif'))) return '/cotizador-flyer/flyer.avif';
  if (fs.existsSync(path.join(dir, 'flyer.webp'))) return '/cotizador-flyer/flyer.webp';
  if (fs.existsSync(path.join(dir, 'flyer.png'))) return '/cotizador-flyer/flyer.png';
  return null;
}

export default async function CotizadorPage() {
  const flyerSrc = getCotizadorFlyerSrc();
  const products = await getAllProducts();
  const modelEntries = buildCotizadorModelEntries(products);

  return (
    <>
      <section className="bg-primary-900">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <h1 className="text-3xl font-extrabold text-white sm:text-4xl">Cotizar</h1>
          <p className="mt-2 max-w-xl text-lg text-primary-200">
            Completá el formulario y te contactamos con una cotización personalizada.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div
          className={
            flyerSrc
              ? 'grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,480px)_minmax(0,1fr)] lg:items-stretch lg:gap-14 xl:grid-cols-[minmax(0,560px)_minmax(0,1fr)]'
              : 'mx-auto max-w-2xl'
          }
        >
          {flyerSrc && (
            <div className="mx-auto flex w-full max-w-[360px] min-h-0 flex-col sm:max-w-[400px] lg:mx-0 lg:h-full lg:max-w-none">
              <div className="relative aspect-[3/4] w-full min-h-0 flex-1 overflow-hidden rounded-2xl bg-white lg:aspect-auto lg:h-full">
                <Image
                  src={flyerSrc}
                  alt="Promoción — cotización Yamaha Costa Rica"
                  fill
                  className="object-contain p-2 sm:p-3"
                  sizes="(max-width: 1024px) 90vw, (max-width: 1280px) 50vw, 560px"
                  priority
                />
              </div>
            </div>
          )}

          <div className={flyerSrc ? 'flex min-h-0 min-w-0 flex-col lg:max-w-xl' : ''}>
            <CotizadorForm modelEntries={modelEntries} />
          </div>
        </div>
      </section>
    </>
  );
}
