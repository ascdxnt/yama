import Link from 'next/link';
import { DEALERSHIP, CONTACT } from '@/lib/constants';

export function NearestDealership() {
  return (
    <div className="flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border border-surface-subtle bg-white shadow-card">
      {/* Map embed */}
      <div className="relative min-h-[200px] bg-surface-ghost">
        <iframe
          src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3929.8!2d-84.1107!3d9.9516!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2s${encodeURIComponent('Yamaha Costa Rica')}!5e0!3m2!1ses!2scr`}
          width="100%"
          height="100%"
          style={{ border: 0, position: 'absolute', inset: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Ubicación Yamaha Costa Rica"
        />
      </div>

      {/* Info */}
      <div className="min-w-0 flex-1 p-4 sm:p-5">
        <h3 className="text-lg font-bold text-text-primary">Visitá nuestra sucursal</h3>
        <p className="mt-0.5 text-xs text-text-muted">{DEALERSHIP.name}</p>

        <div className="mt-4 space-y-2.5 text-sm text-text-secondary">
          <div className="flex gap-2.5">
            <svg className="mt-0.5 h-4 w-4 shrink-0 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="min-w-0 break-words">{DEALERSHIP.address}</span>
          </div>
          <div className="flex gap-2.5">
            <svg className="mt-0.5 h-4 w-4 shrink-0 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="min-w-0 break-words">{CONTACT.hours.short}</span>
          </div>
          <div className="flex gap-2.5">
            <svg className="mt-0.5 h-4 w-4 shrink-0 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
            </svg>
            <span>{CONTACT.phone}</span>
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-2">
          <a
            href={`https://wa.me/${CONTACT.whatsappRaw}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#25D366] text-sm font-bold text-white shadow-md transition-all hover:bg-[#20bd5a] hover:-translate-y-0.5 active:translate-y-0"
          >
            WhatsApp
          </a>
          <div className="grid min-w-0 grid-cols-2 gap-2">
            <a
              href={DEALERSHIP.directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-10 min-w-0 items-center justify-center rounded-xl bg-primary-500 px-2 text-center text-xs font-bold text-white transition-all hover:bg-primary-400 sm:text-sm"
            >
              Cómo llegar
            </a>
            <a
              href={`tel:${CONTACT.phoneRaw}`}
              className="inline-flex min-h-10 min-w-0 items-center justify-center rounded-xl border-2 border-surface-border px-2 text-center text-xs font-bold text-text-primary transition-all hover:border-secondary-500 hover:text-secondary-500 sm:text-sm"
            >
              Llamar
            </a>
          </div>
        </div>

        <div className="mt-3">
          <Link
            href="/sucursales"
            className="text-sm font-semibold text-secondary-500 transition-colors hover:text-secondary-400"
          >
            Ver todas las sucursales
          </Link>
        </div>
      </div>
    </div>
  );
}
