import type { Metadata } from 'next';
import fs from 'node:fs';
import path from 'node:path';
import Image from 'next/image';
import Link from 'next/link';
import { WORKSHOPS } from '@/lib/constants';
import { QuickRequestForm } from '@/components/forms/quick-request-form';

export const metadata: Metadata = {
  title: 'Talleres Autorizados Yamaha Costa Rica',
  description: 'Taller Yamaha en La Uruca, Alajuela y Plaza Viquez. Soporte oficial y mecanicos autorizados.',
};

function resolveAsset(dirName: string, baseName: string): string | null {
  const dir = path.join(process.cwd(), 'public', dirName);
  const exts = ['avif', 'webp', 'png', 'jpg', 'jpeg'];
  for (const ext of exts) {
    const file = `${baseName}.${ext}`;
    if (fs.existsSync(path.join(dir, file))) return `/${dirName}/${file}`;
  }
  return null;
}

export default function TallerPage() {
  const flyerSrc = resolveAsset('taller-flyer', 'flyer');
  const sideSrc = resolveAsset('taller-assets', 'side');

  return (
    <>
      <section className="bg-primary-900">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-extrabold text-white sm:text-4xl">Talleres Autorizados Yamaha Costa Rica</h1>
          <p className="mt-2 max-w-2xl text-primary-200">Servicio y mecanicos autorizados Yamaha en sedes oficiales.</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-6 pt-0 sm:px-6 lg:px-8 lg:py-12">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,480px)_minmax(0,1fr)] lg:items-stretch lg:gap-14 xl:grid-cols-[minmax(0,560px)_minmax(0,1fr)]">
          <div className="order-1 -mx-4 flex w-auto min-h-0 flex-col sm:-mx-6 lg:mx-0 lg:w-full lg:order-1 lg:h-full lg:max-w-none">
            <div className="relative h-[46vh] min-h-[280px] max-h-[480px] w-full min-h-0 flex-1 overflow-hidden bg-white lg:aspect-auto lg:h-full lg:min-h-0 lg:max-h-none lg:rounded-2xl">
              {flyerSrc ? (
                <Image src={flyerSrc} alt="Flyer taller Yamaha" width={1080} height={1528} className="h-auto w-full object-contain bg-white lg:h-full" />
              ) : (
                <div className="flex h-[44vh] w-full items-center justify-center bg-surface-ghost text-sm text-text-muted lg:h-full">Subí `flyer.avif`</div>
              )}
            </div>
          </div>

          <div className="order-2 rounded-2xl border border-surface-subtle bg-white p-6 shadow-card sm:p-8 lg:order-2">
            <h2 className="text-xl font-bold text-text-primary">Consúltanos:</h2>
            <div className="mt-5">
              <QuickRequestForm submitLabel="Solicitar Cita" />
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-[minmax(0,480px)_minmax(0,1fr)] lg:items-start lg:gap-14 xl:grid-cols-[minmax(0,560px)_minmax(0,1fr)]">
          <div className="overflow-hidden rounded-2xl lg:self-start">
            <div className="relative h-44 w-full bg-surface-ghost sm:h-52">
              {sideSrc ? (
                <Image src={sideSrc} alt="Servicio de taller" fill className="object-contain" />
              ) : (
                <div className="flex h-full items-center justify-center bg-surface-ghost text-sm text-text-muted">Subí `side.avif`</div>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-surface-subtle bg-white p-5 shadow-card sm:p-6">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-2">
              {WORKSHOPS.map((ws) => (
                <div key={ws.name} className="rounded-xl border border-surface-subtle bg-surface-ghost p-4 text-sm">
                  <p className="text-text-muted">{ws.name}</p>
                  <a href={`tel:${ws.phoneRaw}`} className="mt-1 block font-bold text-text-primary">{ws.phone}</a>
                  {ws.whatsapp && <p className="mt-1 font-semibold text-[#25D366]">WhatsApp {ws.whatsapp}</p>}
                </div>
              ))}
            </div>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link href="/cotizador" className="inline-flex h-11 items-center rounded-full bg-primary-500 px-5 text-sm font-bold text-white">Cotizar</Link>
              <Link href="/sucursales" className="inline-flex h-11 items-center rounded-full border border-surface-border px-5 text-sm font-bold text-text-primary">Distribuidores Click Aquí</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
