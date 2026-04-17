import type { Metadata } from 'next';
import Link from 'next/link';
import { WORKSHOPS } from '@/lib/constants';
import { AppointmentForm } from './appointment-form';

export const metadata: Metadata = {
  title: 'Solicitar Cita — Taller',
  description: 'Solicitá una cita en el taller autorizado Yamaha. Seleccioná el servicio, ubicación y horario.',
};

export default function ReservarPage() {
  return (
    <>
      <section className="bg-primary-900">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <nav className="mb-4 flex items-center gap-1.5 text-sm text-primary-300">
            <Link href="/taller" className="hover:text-white transition-colors">Taller</Link>
            <span>/</span>
            <span className="text-white">Solicitar cita</span>
          </nav>
          <h1 className="text-3xl font-extrabold text-white sm:text-4xl">Solicitar Cita</h1>
          <p className="mt-2 text-lg text-primary-200">
            Completá el formulario y nos pondremos en contacto para confirmar tu cita.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-surface-subtle bg-white p-6 shadow-card sm:p-8">
          <AppointmentForm workshops={WORKSHOPS.map((w) => w.name)} />
        </div>

        <div className="mt-6 rounded-2xl border border-surface-subtle bg-surface-ghost p-6 text-center sm:p-8">
          <p className="text-sm text-text-secondary">
            ¿Preferís agendar directamente?
          </p>
          <div className="mt-4 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <a
              href={`https://wa.me/${WORKSHOPS[0].whatsappRaw}?text=${encodeURIComponent('Hola, necesito agendar una cita en el taller.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-11 items-center gap-2 rounded-xl bg-[#25D366] px-6 text-sm font-bold text-white hover:bg-[#20bd5a]"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.5.5 0 00.611.611l4.458-1.495A11.943 11.943 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.325 0-4.47-.744-6.228-2.01l-.436-.326-2.641.885.885-2.641-.326-.436A9.958 9.958 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
              </svg>
              WhatsApp Taller
            </a>
            <a
              href={`tel:${WORKSHOPS[0].phoneRaw}`}
              className="inline-flex h-11 items-center rounded-xl border-2 border-surface-border px-6 text-sm font-bold text-text-primary hover:border-secondary-500 hover:text-secondary-500"
            >
              Llamar: {WORKSHOPS[0].phone}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
