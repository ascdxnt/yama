import type { Metadata } from 'next';
import fs from 'node:fs';
import path from 'node:path';
import Image from 'next/image';
import Link from 'next/link';
import { REPUESTOS } from '@/lib/constants';
import { QuickRequestForm } from '@/components/forms/quick-request-form';

export const metadata: Metadata = {
  title: 'Repuestos Originales Yamaha en Costa Rica',
  description: 'Consulta repuestos originales Yamaha por telefono o WhatsApp.',
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

export default function RepuestosPage() {
  const flyerSrc = resolveAsset('repuestos-flyer', 'flyer');
  const sideSrc = resolveAsset('repuestos-assets', 'side');

  return (
    <>
      <section className="bg-primary-900">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-extrabold text-white sm:text-4xl">Repuestos Originales Yamaha en Costa Rica</h1>
          <p className="mt-2 max-w-2xl text-primary-200">Consultá repuestos originales para motos, cuadraciclos y marino.</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,480px)_minmax(0,1fr)] lg:items-stretch lg:gap-14 xl:grid-cols-[minmax(0,560px)_minmax(0,1fr)]">
          <div className="mx-auto flex w-full max-w-[360px] min-h-0 flex-col sm:max-w-[400px] lg:mx-0 lg:h-full lg:max-w-none">
            <div className="relative aspect-[3/4] w-full min-h-0 flex-1 overflow-hidden rounded-2xl bg-white lg:aspect-auto lg:h-full">
              {flyerSrc ? (
                <Image src={flyerSrc} alt="Flyer repuestos" fill className="object-contain p-2 sm:p-3" />
              ) : (
                <div className="flex h-full items-center justify-center bg-surface-ghost text-sm text-text-muted">Subí `flyer.avif`</div>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-surface-subtle bg-white p-6 shadow-card sm:p-8">
            <h2 className="text-xl font-bold text-text-primary">Consúltanos:</h2>
            <div className="mt-5">
              <QuickRequestForm submitLabel="Solicitar Repuesto" />
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-2">
          <div className="overflow-hidden rounded-2xl border border-surface-subtle bg-white shadow-card">
            <div className="relative h-44 w-full bg-surface-ghost sm:h-52">
              {sideSrc ? (
                <Image src={sideSrc} alt="Productos 100% originales" fill className="object-contain" />
              ) : (
                <div className="flex h-full items-center justify-center bg-surface-ghost text-sm text-text-muted">Subí `side.avif`</div>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-surface-subtle bg-white p-5 shadow-card sm:p-6">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-surface-subtle bg-surface-ghost p-4 text-sm">
                <p className="text-text-muted">Teléfono</p>
                <a href={`tel:${REPUESTOS.phoneRaw}`} className="mt-1 block font-bold text-text-primary">{REPUESTOS.phone}</a>
              </div>
              <div className="rounded-xl border border-[#25D366]/30 bg-[#25D366]/10 p-4 text-sm">
                <p className="text-text-muted">WhatsApp Repuestos Originales Yamaha</p>
                <a href={`https://wa.me/${REPUESTOS.whatsappRaw}`} target="_blank" rel="noopener noreferrer" className="mt-1 block font-bold text-[#25D366]">{REPUESTOS.whatsapp}</a>
              </div>
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
