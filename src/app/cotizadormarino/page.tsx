import type { Metadata } from 'next';
import fs from 'node:fs';
import path from 'node:path';
import Image from 'next/image';
import { CotizadorMarinoForm } from './cotizador-marino-form';

export const metadata: Metadata = {
  title: 'Cotizador Marino',
  description: 'Solicitá una cotización para motores fuera de borda y productos marinos Yamaha.',
};

function getCotizadorMarinoFlyerSrc(): string | null {
  const dir = path.join(process.cwd(), 'public', 'cotizador-marino-flyer');
  if (fs.existsSync(path.join(dir, 'flyer.avif'))) return '/cotizador-marino-flyer/flyer.avif';
  if (fs.existsSync(path.join(dir, 'flyer.webp'))) return '/cotizador-marino-flyer/flyer.webp';
  if (fs.existsSync(path.join(dir, 'flyer.png'))) return '/cotizador-marino-flyer/flyer.png';
  return null;
}

function getCotizadorMarinoSideSrc(): string | null {
  const dir = path.join(process.cwd(), 'public', 'cotizador-marino-assets');
  if (fs.existsSync(path.join(dir, 'side.avif'))) return '/cotizador-marino-assets/side.avif';
  if (fs.existsSync(path.join(dir, 'side.webp'))) return '/cotizador-marino-assets/side.webp';
  if (fs.existsSync(path.join(dir, 'side.png'))) return '/cotizador-marino-assets/side.png';
  return null;
}

export default function CotizadorMarinoPage() {
  const flyerSrc = getCotizadorMarinoFlyerSrc();
  const sideSrc = getCotizadorMarinoSideSrc();

  return (
    <>
      <section className="bg-primary-900">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <h1 className="text-3xl font-extrabold text-white sm:text-4xl">Cotizador Marino</h1>
          <p className="mt-2 max-w-xl text-lg text-primary-200">
            Completá el formulario y te contactamos con una cotización de Yamaha Marino.
          </p>
        </div>
      </section>

      <section className="mx-auto flex max-w-7xl flex-col px-4 pb-6 pt-0 sm:px-6 lg:px-8 lg:py-16">
        <div
          className={
            flyerSrc
              ? 'order-1 -mx-4 flex w-auto min-h-0 flex-col sm:-mx-6 lg:hidden'
              : 'hidden'
          }
        >
          {flyerSrc && (
            <div className="relative h-[46vh] min-h-[280px] max-h-[480px] w-full min-h-0 flex-1 overflow-hidden bg-white">
              <Image
                src={flyerSrc}
                alt="Promoción — cotización Yamaha Marino"
                width={1080}
                height={1528}
                className="h-auto w-full object-contain bg-white lg:h-full"
                sizes="100vw"
                priority
              />
            </div>
          )}
        </div>

        <div className="order-2 mb-8 mt-6 grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-surface-subtle bg-surface-ghost p-4 text-sm">
            <p className="text-text-muted">Teléfono</p>
            <p className="font-bold text-text-primary">+506 2211 5900</p>
          </div>
          <a href="https://wa.me/50683027848" target="_blank" rel="noopener noreferrer" className="rounded-xl border border-[#25D366]/30 bg-[#25D366]/10 p-4 text-sm">
            <p className="text-text-muted">WhatsApp Yamaha Marino</p>
            <p className="font-bold text-[#25D366]">+506 8302-7848</p>
          </a>
          <a href="mailto:mercadeo@yamahacr.com" className="rounded-xl border border-surface-subtle bg-surface-ghost p-4 text-sm">
            <p className="text-text-muted">Correo</p>
            <p className="font-bold text-text-primary">mercadeo@yamahacr.com</p>
          </a>
        </div>

        <div
          className={
            flyerSrc
              ? 'order-3 grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,480px)_minmax(0,1fr)] lg:items-stretch lg:gap-14 xl:grid-cols-[minmax(0,560px)_minmax(0,1fr)]'
              : 'mx-auto max-w-2xl'
          }
        >
          {flyerSrc && (
            <div className="order-2 mx-auto hidden w-full max-w-[360px] min-h-0 flex-col sm:max-w-[400px] lg:order-1 lg:flex lg:mx-0 lg:h-full lg:max-w-none">
              <div className="relative aspect-[3/4] w-full min-h-0 flex-1 overflow-hidden rounded-2xl bg-white lg:aspect-auto lg:h-full">
                <Image
                  src={flyerSrc}
                  alt="Promoción — cotización Yamaha Marino"
                  fill
                  className="object-contain p-2 sm:p-3"
                  sizes="(max-width: 1024px) 90vw, (max-width: 1280px) 50vw, 560px"
                  priority
                />
              </div>
            </div>
          )}

          <div className={flyerSrc ? 'order-1 flex min-h-0 min-w-0 flex-col lg:order-2 lg:max-w-xl lg:self-stretch' : ''}>
            <CotizadorMarinoForm />
          </div>
        </div>

        {sideSrc && (
          <div className="order-3 mx-auto mt-8 max-w-3xl overflow-hidden rounded-2xl bg-white">
            <div className="relative aspect-[16/9] w-full">
              <Image
                src={sideSrc}
                alt="Imagen secundaria Yamaha Marino"
                fill
                className="object-contain"
                sizes="(max-width: 1024px) 100vw, 768px"
              />
            </div>
          </div>
        )}
      </section>
    </>
  );
}
