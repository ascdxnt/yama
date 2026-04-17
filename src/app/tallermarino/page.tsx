import type { Metadata } from 'next';
import fs from 'node:fs';
import path from 'node:path';
import Image from 'next/image';
import Link from 'next/link';
import { QuickRequestForm } from '@/components/forms/quick-request-form';

export const metadata: Metadata = {
  title: 'Taller Marino Yamaha',
  description: 'Taller y mecanicos autorizados Yamaha Marino en Costa Rica.',
};

const MARINE_WORKSHOPS = [
  { label: 'Of. Centrales, La Uruca', phone: '+506 2211-5946', href: 'tel:+50622115946' },
  { label: 'WhatsApp, Of. Centrales', phone: '+506 8302-7848', href: 'https://wa.me/50683027848' },
  { label: 'Carrillo Guanacaste', phone: '+506 84498022', href: 'tel:+50684498022' },
  { label: 'Cieneguita, Limon', phone: '+506 6172-4545', href: 'tel:+50661724545' },
];

function resolveAsset(dirName: string, baseName: string): string | null {
  const dir = path.join(process.cwd(), 'public', dirName);
  const exts = ['avif', 'webp', 'png', 'jpg', 'jpeg'];
  for (const ext of exts) {
    const file = `${baseName}.${ext}`;
    if (fs.existsSync(path.join(dir, file))) return `/${dirName}/${file}`;
  }
  return null;
}

export default function TallerMarinoPage() {
  const flyerSrc = resolveAsset('tallermarino-flyer', 'flyer');
  const sideSrc = resolveAsset('tallermarino-assets', 'side');

  return (
    <>
      <section className="bg-primary-900">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-extrabold text-white sm:text-4xl">Taller y Mecanicos Autorizados Yamaha Marino</h1>
          <p className="mt-3 max-w-3xl text-primary-200">
            Liderando el mar, los motores fuera de borda preferidos en el mundo y en Costa Rica, por su respaldo y calidad.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,480px)_minmax(0,1fr)] lg:items-stretch lg:gap-14 xl:grid-cols-[minmax(0,560px)_minmax(0,1fr)]">
          <div className="mx-auto flex w-full max-w-[360px] min-h-0 flex-col sm:max-w-[400px] lg:mx-0 lg:h-full lg:max-w-none">
            <div className="relative aspect-[3/4] w-full min-h-0 flex-1 overflow-hidden rounded-2xl bg-white lg:aspect-auto lg:h-full">
              {flyerSrc ? (
                <Image src={flyerSrc} alt="Flyer taller marino" fill className="object-contain p-2 sm:p-3" />
              ) : (
                <div className="flex h-full items-center justify-center bg-surface-ghost text-sm text-text-muted">Subí `flyer.avif`</div>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-surface-subtle bg-white p-6 shadow-card sm:p-8">
            <h2 className="text-xl font-bold text-text-primary">Consúltanos</h2>
            <div className="mt-5">
              <QuickRequestForm submitLabel="Solicitar Servicio" />
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-2">
          <div className="overflow-hidden rounded-2xl border border-surface-subtle bg-white shadow-card">
            <div className="relative h-44 w-full bg-surface-ghost sm:h-52">
              {sideSrc ? (
                <Image src={sideSrc} alt="Servicio taller marino" fill className="object-contain" />
              ) : (
                <div className="flex h-full items-center justify-center bg-surface-ghost text-sm text-text-muted">Subí `side.avif`</div>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-surface-subtle bg-white p-5 shadow-card sm:p-6">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-2">
              {MARINE_WORKSHOPS.map((ws) => (
                <div key={ws.phone} className="rounded-xl border border-surface-subtle bg-surface-ghost p-4 text-sm">
                  <p className="text-text-muted">{ws.label}</p>
                  <a href={ws.href} target={ws.href.startsWith('http') ? '_blank' : undefined} rel={ws.href.startsWith('http') ? 'noopener noreferrer' : undefined} className="mt-1 block font-bold text-text-primary">
                    {ws.phone}
                  </a>
                </div>
              ))}
            </div>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link href="/cotizadormarino" className="inline-flex h-11 items-center rounded-full bg-primary-500 px-5 text-sm font-bold text-white">Cotizar</Link>
              <Link href="/sucursales" className="inline-flex h-11 items-center rounded-full border border-surface-border px-5 text-sm font-bold text-text-primary">Distribuidores Click Aquí</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
