import type { Metadata } from 'next';
import Link from 'next/link';
import { REPUESTOS } from '@/lib/constants';
import { RepuestosForm } from './repuestos-form';

export const metadata: Metadata = {
  title: 'Repuestos Originales',
  description: 'Repuestos originales Yamaha en Costa Rica para motos, cuadraciclos y productos marinos. Consulte disponibilidad.',
};

function PhoneIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
    </svg>
  );
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.5.5 0 00.611.611l4.458-1.495A11.943 11.943 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.325 0-4.47-.744-6.228-2.01l-.436-.326-2.641.885.885-2.641-.326-.436A9.958 9.958 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
    </svg>
  );
}

function BoxIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
    </svg>
  );
}

function ShieldCheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
    </svg>
  );
}

function TruckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
    </svg>
  );
}

function StorefrontIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z" />
    </svg>
  );
}

const BENEFITS = [
  { title: 'Originales Yamaha', description: 'Calidad y compatibilidad garantizada de fábrica.', Icon: ShieldCheckIcon },
  { title: 'Disponibilidad inmediata', description: 'Amplio inventario para motos, cuadraciclos y marinos.', Icon: BoxIcon },
  { title: 'Envío a todo el país', description: 'Recibí tus repuestos en cualquier parte de Costa Rica.', Icon: TruckIcon },
];

export default function RepuestosPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-primary-900">
        <div className="pointer-events-none absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-secondary-500/20 blur-[120px]" aria-hidden="true" />
        <div className="pointer-events-none absolute -right-32 top-1/2 h-[400px] w-[400px] -translate-y-1/2 rounded-full bg-primary-400/15 blur-[100px]" aria-hidden="true" />
        <div className="pointer-events-none absolute bottom-0 left-1/3 h-[300px] w-[300px] rounded-full bg-secondary-600/10 blur-[80px]" aria-hidden="true" />
        <div className="noise-overlay" />

        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          <span className="inline-flex items-center rounded-full border border-white/15 bg-white/[0.06] px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-primary-200 backdrop-blur-sm">
            Repuestos genuinos
          </span>
          <h1 className="mt-5 text-[clamp(2rem,5vw,3.5rem)] font-extrabold leading-[1.1] text-white">
            Repuestos Originales Yamaha
          </h1>
          <p className="mt-3 max-w-xl text-lg leading-relaxed text-primary-200/80">
            Yamaha Costa Rica, repuestos para todos sus productos.
          </p>
        </div>
      </section>

      {/* Contact cards + Form */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="grid gap-8 lg:grid-cols-5">
          {/* Left: Contact + Benefits */}
          <div className="space-y-6 lg:col-span-2">
            {/* Phone */}
            <div className="rounded-[1.25rem] border border-surface-subtle bg-white p-6 shadow-card transition-premium hover:shadow-card-hover">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-50">
                  <PhoneIcon className="h-5 w-5 text-primary-500" />
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-text-muted">Repuestos</p>
                  <a href={`tel:${REPUESTOS.phoneRaw}`} className="text-lg font-bold text-text-primary transition-colors-premium hover:text-secondary-500">
                    {REPUESTOS.phone}
                  </a>
                </div>
              </div>
            </div>

            {/* WhatsApp */}
            <a
              href={`https://wa.me/${REPUESTOS.whatsappRaw}?text=${encodeURIComponent('Hola, necesito consultar disponibilidad de un repuesto.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-[1.25rem] border border-[#25D366]/20 bg-[#25D366]/5 p-6 transition-premium hover:border-[#25D366]/40 hover:shadow-card hover:-translate-y-0.5 active:scale-[0.97]"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#25D366]/10">
                <WhatsAppIcon className="h-5 w-5 text-[#25D366]" />
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-text-muted">WhatsApp Repuestos</p>
                <span className="text-lg font-bold text-[#25D366]">{REPUESTOS.whatsapp}</span>
              </div>
            </a>

            {/* Benefits */}
            <div className="space-y-3 pt-2">
              {BENEFITS.map((b) => (
                <div key={b.title} className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary-50">
                    <b.Icon className="h-4.5 w-4.5 text-secondary-500" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-text-primary">{b.title}</p>
                    <p className="text-xs text-text-secondary">{b.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Distribuidores CTA */}
            <Link
              href="/sucursales"
              className="flex items-center gap-3 rounded-[1.25rem] border border-surface-subtle bg-surface-ghost p-5 transition-premium hover:border-secondary-500/30 hover:shadow-card hover:-translate-y-0.5 active:scale-[0.97]"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-50">
                <StorefrontIcon className="h-5 w-5 text-primary-500" />
              </div>
              <div>
                <p className="text-sm font-bold text-text-primary">Distribuidores</p>
                <p className="text-xs text-text-secondary">Ver distribuidores autorizados</p>
              </div>
              <svg className="ml-auto h-4 w-4 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </Link>
          </div>

          {/* Right: Form */}
          <div className="lg:col-span-3">
            <div className="rounded-[1.25rem] border border-surface-subtle bg-white p-6 shadow-card sm:p-8">
              <h2 className="text-xl font-bold text-text-primary">Solicitar Repuesto</h2>
              <p className="mt-1 text-sm text-text-secondary">
                Completá el formulario con el número de parte o modelo y te confirmamos disponibilidad y precio.
              </p>
              <div className="mt-6">
                <RepuestosForm />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
