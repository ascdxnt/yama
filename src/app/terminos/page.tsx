import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Términos de servicio',
  description:
    'Términos de servicio de Yamaha Costa Rica para el uso del sitio, formularios de contacto y solicitudes de cotización.',
};

export default function TermsPage() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-28">
      <p className="text-[11px] font-semibold tracking-[0.16em] text-text-muted">Legal</p>
      <h1 className="mt-3 text-[clamp(1.8rem,3vw,2.8rem)] font-extrabold leading-[1.08] tracking-[-0.02em] text-text-primary">
        Términos de servicio
      </h1>
      <p className="mt-4 max-w-[60ch] text-base leading-relaxed text-text-secondary">
        Al usar este sitio, aceptás los términos de uso de contenido, envío de formularios y comunicación comercial.
      </p>

      <div className="mt-10 space-y-7 text-sm leading-relaxed text-text-secondary">
        <div>
          <h2 className="text-base font-semibold text-text-primary">Información del sitio</h2>
          <p className="mt-2">
            El contenido tiene fines informativos y puede cambiar sin aviso. Precios, disponibilidad y promociones se
            confirman en sucursal o con el equipo comercial.
          </p>
        </div>
        <div>
          <h2 className="text-base font-semibold text-text-primary">Uso de formularios</h2>
          <p className="mt-2">
            Al completar formularios, declarás que la información es correcta y autorizás contacto por correo,
            teléfono o mensajería para gestionar tu solicitud.
          </p>
        </div>
        <div>
          <h2 className="text-base font-semibold text-text-primary">Responsabilidad</h2>
          <p className="mt-2">
            Yamaha Costa Rica no se responsabiliza por interrupciones temporales del sitio o por decisiones tomadas
            únicamente con base en información publicada sin confirmación comercial.
          </p>
        </div>
      </div>
    </section>
  );
}
