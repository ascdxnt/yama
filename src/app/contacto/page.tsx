import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { CONTACT, DEALERSHIP, SOCIALS } from '@/lib/constants';
import { ContactForm } from './contact-form';

export const metadata: Metadata = {
  title: 'Contacto',
  description:
    'Distribuidores, concesionarios y tiendas Yamaha en Costa Rica. WhatsApp, teléfono, email. La Uruca, frente a Capris, San José.',
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

function MailIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
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

function ClockIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  );
}

function TikTokIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
    </svg>
  );
}

const SOCIAL_ICONS: Record<string, React.FC> = {
  Facebook: FacebookIcon,
  Instagram: InstagramIcon,
  TikTok: TikTokIcon,
};

export default function ContactoPage() {
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
            Estamos para ayudarte
          </span>
          <h1 className="mt-5 text-[clamp(2rem,5vw,3.5rem)] font-extrabold leading-[1.1] text-white">
            Contacto
          </h1>
          <p className="mt-3 max-w-lg text-lg leading-relaxed text-primary-200/80">
            Distribuidores, concesionarios y tiendas Yamaha en Costa Rica
          </p>
        </div>
      </section>

      {/* Top: Flyer + Form side by side */}
      <section className="mx-auto max-w-7xl px-4 pb-6 pt-0 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Flyer */}
          <div className="order-1 -mx-4 flex w-auto min-h-0 flex-col sm:-mx-6 lg:mx-0 lg:w-full lg:order-1 lg:h-full lg:max-w-none">
            <div className="relative h-[46vh] min-h-[280px] max-h-[480px] w-full min-h-0 flex-1 overflow-hidden bg-white lg:h-auto lg:min-h-0 lg:max-h-none lg:rounded-[1.25rem] lg:border lg:border-surface-subtle lg:shadow-card">
              <Image
                src="/YAMAHA_CostaRica_banner_Contacto.avif"
                alt="Yamaha Costa Rica"
                width={1080}
                height={1528}
                className="h-auto w-full object-contain bg-white lg:h-full"
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>

          {/* Form */}
          <div className="order-2 rounded-[1.25rem] border border-surface-subtle bg-white p-6 shadow-card sm:p-8 lg:order-2">
            <h2 className="text-xl font-bold text-text-primary">Consúltanos</h2>
            <p className="mt-1 text-sm text-text-secondary">
              Completá el formulario y te contactamos a la brevedad.
            </p>
            <div className="mt-6">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      {/* Bottom: Contact info row */}
      <section className="border-t border-surface-subtle bg-surface-ghost">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {/* Phone */}
            <a
              href={`tel:${CONTACT.phoneRaw}`}
              className="flex items-center gap-4 rounded-[1.25rem] border border-surface-subtle bg-white p-5 shadow-card transition-premium hover:shadow-card-hover hover:-translate-y-0.5 active:scale-[0.97]"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-50">
                <PhoneIcon className="h-5 w-5 text-primary-500" />
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-text-muted">Teléfono</p>
                <p className="text-base font-bold text-text-primary">{CONTACT.phone}</p>
              </div>
            </a>

            {/* WhatsApp */}
            <a
              href={`https://wa.me/${CONTACT.whatsappRaw}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 rounded-[1.25rem] border border-[#25D366]/20 bg-[#25D366]/5 p-5 transition-premium hover:border-[#25D366]/40 hover:shadow-card hover:-translate-y-0.5 active:scale-[0.97]"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#25D366]/10">
                <WhatsAppIcon className="h-5 w-5 text-[#25D366]" />
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-text-muted">WhatsApp</p>
                <p className="text-base font-bold text-[#25D366]">{CONTACT.whatsapp}</p>
              </div>
            </a>

            {/* Email */}
            <a
              href={`mailto:${CONTACT.email}`}
              className="flex items-center gap-4 rounded-[1.25rem] border border-surface-subtle bg-white p-5 shadow-card transition-premium hover:shadow-card-hover hover:-translate-y-0.5 active:scale-[0.97]"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-secondary-50">
                <MailIcon className="h-5 w-5 text-secondary-500" />
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-text-muted">Email</p>
                <p className="text-sm font-bold text-text-primary">{CONTACT.email}</p>
              </div>
            </a>

            {/* Location */}
            <div className="flex items-center gap-4 rounded-[1.25rem] border border-surface-subtle bg-white p-5 shadow-card transition-premium">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-50">
                <MapPinIcon className="h-5 w-5 text-primary-500" />
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-text-muted">Sucursal</p>
                <p className="text-sm font-bold text-text-primary">{DEALERSHIP.name}</p>
              </div>
            </div>
          </div>

          {/* Hours + Map + Links row */}
          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            {/* Hours */}
            <div className="rounded-[1.25rem] border border-surface-subtle bg-white p-6 shadow-card transition-premium">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-50">
                  <ClockIcon className="h-4 w-4 text-primary-500" />
                </div>
                <h3 className="text-sm font-bold text-text-primary">Horario</h3>
              </div>
              <p className="text-sm text-text-secondary">{DEALERSHIP.address}</p>
              <div className="mt-3 space-y-1.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-text-muted">Lunes a Viernes</span>
                  <span className="font-semibold text-text-primary">8:00am &ndash; 5:30pm</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Sábado</span>
                  <span className="font-semibold text-text-primary">9:00am &ndash; 1:00pm</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Domingo</span>
                  <span className="font-semibold text-text-muted">Cerrado</span>
                </div>
              </div>
            </div>

            {/* Map */}
            <div className="overflow-hidden rounded-[1.25rem] border border-surface-subtle shadow-card">
              <div className="relative h-full min-h-[220px]">
                <iframe
                  src={DEALERSHIP.mapsEmbedUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0, position: 'absolute', inset: 0, pointerEvents: 'none' }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Ubicación Yamaha Costa Rica"
                />
                <a
                  href={DEALERSHIP.directionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Abrir ubicación en Google Maps"
                  className="absolute inset-0"
                />
              </div>
            </div>

            {/* Quick links */}
            <div className="space-y-4">
              <Link
                href="/sucursales"
                className="flex items-center gap-4 rounded-[1.25rem] border border-surface-subtle bg-white p-5 shadow-card transition-premium hover:border-secondary-500/30 hover:shadow-card-hover hover:-translate-y-0.5 active:scale-[0.97]"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-50">
                  <svg className="h-5 w-5 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-bold text-text-primary">Agencias</p>
                  <p className="text-xs text-text-secondary">Ver ubicaciones</p>
                </div>
                <svg className="ml-auto h-4 w-4 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </Link>

              <Link
                href="/sucursales"
                className="flex items-center gap-4 rounded-[1.25rem] border border-surface-subtle bg-white p-5 shadow-card transition-premium hover:border-secondary-500/30 hover:shadow-card-hover hover:-translate-y-0.5 active:scale-[0.97]"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-50">
                  <svg className="h-5 w-5 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-bold text-text-primary">Distribuidores</p>
                  <p className="text-xs text-text-secondary">Ver distribuidores autorizados</p>
                </div>
                <svg className="ml-auto h-4 w-4 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </Link>

              <a
                href={DEALERSHIP.directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 rounded-[1.25rem] border border-surface-subtle bg-white p-5 shadow-card transition-premium hover:border-secondary-500/30 hover:shadow-card-hover hover:-translate-y-0.5 active:scale-[0.97]"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-50">
                  <MapPinIcon className="h-5 w-5 text-primary-500" />
                </div>
                <div>
                  <p className="text-sm font-bold text-text-primary">Cómo llegar</p>
                  <p className="text-xs text-text-secondary">Abrir en Google Maps</p>
                </div>
                <svg className="ml-auto h-4 w-4 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </a>

              {/* Socials */}
              <div className="flex gap-2 pt-1">
                {SOCIALS.map((social) => {
                  const Icon = SOCIAL_ICONS[social.name];
                  return (
                    <a
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.name}
                      className="flex h-10 w-10 items-center justify-center rounded-xl bg-white border border-surface-subtle text-primary-700 shadow-sm transition-premium hover:bg-primary-50 hover:-translate-y-0.5"
                    >
                      {Icon && <Icon />}
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
