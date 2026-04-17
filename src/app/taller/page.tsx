import type { Metadata } from 'next';
import Link from 'next/link';
import { WORKSHOPS } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Taller Autorizado',
  description: 'Talleres autorizados Yamaha Costa Rica. La Uruca, Alajuela y Plaza Viquez. Mantenimiento, reparación y diagnóstico con repuestos originales.',
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

function MapPinIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
    </svg>
  );
}

function WrenchIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75a4.5 4.5 0 01-4.884 4.484c-1.076-.091-2.264.071-2.95.904l-7.152 8.684a2.548 2.548 0 11-3.586-3.586l8.684-7.152c.833-.686.995-1.874.904-2.95a4.5 4.5 0 016.336-4.486l-3.276 3.276a3.004 3.004 0 002.25 2.25l3.276-3.276c.256.565.398 1.192.398 1.852z" />
    </svg>
  );
}

function GearIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
    </svg>
  );
}

function ShieldIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
    </svg>
  );
}

const SERVICES = [
  { title: 'Mantenimiento', description: 'Servicio preventivo según el plan de mantenimiento Yamaha.', Icon: WrenchIcon },
  { title: 'Reparación', description: 'Diagnóstico y reparación con técnicos certificados.', Icon: GearIcon },
  { title: 'Diagnóstico', description: 'Evaluación completa del estado de tu vehículo.', Icon: SearchIcon },
  { title: 'Garantía', description: 'Reparaciones cubiertas por la garantía de fábrica.', Icon: ShieldIcon },
];

export default function TallerPage() {
  return (
    <>
      <section className="relative isolate overflow-hidden bg-primary-900">
        <div className="pointer-events-none absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-secondary-500/20 blur-[120px]" aria-hidden="true" />
        <div className="pointer-events-none absolute -right-32 top-1/2 h-[400px] w-[400px] -translate-y-1/2 rounded-full bg-primary-400/15 blur-[100px]" aria-hidden="true" />
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          <span className="inline-flex items-center rounded-full border border-white/15 bg-white/[0.06] px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-primary-200 backdrop-blur-sm">
            Servicio oficial
          </span>
          <h1 className="mt-5 text-[clamp(2rem,5vw,3.5rem)] font-extrabold leading-[1.1] text-white">Talleres Autorizados</h1>
          <p className="mt-3 max-w-xl text-lg leading-relaxed text-primary-200/80">
            Servicio técnico con repuestos originales y técnicos certificados por Yamaha.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <h2 className="text-2xl font-bold text-text-primary">Ubicaciones</h2>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {WORKSHOPS.map((ws) => (
            <div key={ws.name} className="rounded-[1.5rem] bg-surface-ghost/50 p-1.5 ring-1 ring-black/[0.03] shadow-card transition-premium hover:shadow-card-hover">
              <div className="rounded-[1.25rem] bg-white p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-50">
                    <MapPinIcon className="h-5 w-5 text-primary-500" />
                  </div>
                  <h3 className="text-lg font-bold text-text-primary">{ws.name}</h3>
                </div>
                <div className="mt-5 space-y-3">
                  <a href={`tel:${ws.phoneRaw}`} className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors-premium hover:bg-surface-ghost">
                    <PhoneIcon className="h-4.5 w-4.5 shrink-0 text-text-muted" />
                    <span className="font-medium text-text-primary">{ws.phone}</span>
                  </a>
                  {ws.whatsapp && (
                    <a href={`https://wa.me/${ws.whatsappRaw}?text=${encodeURIComponent(`Hola, necesito agendar una cita en el taller ${ws.name}.`)}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors-premium hover:bg-surface-ghost">
                      <WhatsAppIcon className="h-4.5 w-4.5 shrink-0 text-[#25D366]" />
                      <span className="font-medium text-[#25D366]">{ws.whatsapp}</span>
                    </a>
                  )}
                </div>
                {ws.whatsapp ? (
                  <a href={`https://wa.me/${ws.whatsappRaw}?text=${encodeURIComponent(`Hola, necesito agendar una cita en el taller ${ws.name}.`)}`} target="_blank" rel="noopener noreferrer" className="mt-5 flex h-11 w-full items-center justify-center gap-2 rounded-full bg-[#25D366] text-sm font-bold text-white transition-premium-fast hover:bg-[#20bd5a] hover:-translate-y-0.5 active:scale-[0.97]">
                    <WhatsAppIcon className="h-4 w-4" />
                    Agendar por WhatsApp
                  </a>
                ) : (
                  <a href={`tel:${ws.phoneRaw}`} className="mt-5 flex h-11 w-full items-center justify-center gap-2 rounded-full bg-primary-500 text-sm font-bold text-white transition-premium-fast hover:bg-primary-400 hover:-translate-y-0.5 active:scale-[0.97]">
                    <PhoneIcon className="h-4 w-4" />
                    Llamar
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-surface-subtle bg-surface-ghost">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          <h2 className="text-2xl font-bold text-text-primary">Servicios</h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {SERVICES.map((service) => (
              <div key={service.title} className="rounded-[1.25rem] border border-surface-subtle bg-white p-6 shadow-card transition-premium hover:shadow-card-hover hover:-translate-y-0.5">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary-50">
                  <service.Icon className="h-6 w-6 text-secondary-500" />
                </div>
                <h3 className="mt-3 text-lg font-bold text-text-primary">{service.title}</h3>
                <p className="mt-1 text-sm text-text-secondary">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="noise-overlay relative isolate overflow-hidden rounded-[2rem] bg-primary-900 p-8 text-center sm:p-12">
          <div className="pointer-events-none absolute -left-24 -top-24 h-[350px] w-[350px] rounded-full bg-secondary-500/20 blur-[100px]" aria-hidden="true" />
          <div className="pointer-events-none absolute -right-20 bottom-0 h-[280px] w-[280px] rounded-full bg-primary-400/15 blur-[80px]" aria-hidden="true" />
          <div className="relative">
            <h2 className="text-2xl font-bold text-white">¿Necesitás una cita?</h2>
            <p className="mt-2 text-primary-200/80">Reservá tu cita en línea o contactanos directamente.</p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link href="/taller/reservar" className="group inline-flex items-center gap-3 rounded-full bg-secondary-500 py-3 pl-7 pr-4 text-sm font-bold text-white transition-premium-fast hover:bg-secondary-400 hover:shadow-glow-cta hover:-translate-y-0.5 active:scale-[0.97]">
                Solicitar Cita
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/20 transition-premium-fast group-hover:bg-white/30">
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
                </span>
              </Link>
              <a href={`https://wa.me/${WORKSHOPS[0].whatsappRaw}?text=${encodeURIComponent('Hola, necesito agendar una cita en el taller.')}`} target="_blank" rel="noopener noreferrer" className="inline-flex h-12 items-center justify-center gap-2 rounded-full border-2 border-white/20 px-8 text-sm font-bold text-white transition-colors-premium hover:border-white/40 hover:bg-white/10 active:scale-[0.97]">
                <WhatsAppIcon className="h-4 w-4" />
                WhatsApp Taller
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
