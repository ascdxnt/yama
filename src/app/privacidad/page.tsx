import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Política de privacidad',
  description:
    'Política de privacidad de Yamaha Costa Rica. Explica cómo recopilamos, usamos y protegemos tus datos personales.',
};

export default function PrivacyPage() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-28">
      <p className="text-[11px] font-semibold tracking-[0.16em] text-text-muted">Legal</p>
      <h1 className="mt-3 text-[clamp(1.8rem,3vw,2.8rem)] font-extrabold leading-[1.08] tracking-[-0.02em] text-text-primary">
        Política de privacidad
      </h1>
      <p className="mt-4 max-w-[60ch] text-base leading-relaxed text-text-secondary">
        Tratamos tu información para responder consultas comerciales, cotizaciones y solicitudes de servicio.
        Solo usamos los datos necesarios y aplicamos medidas de seguridad razonables para protegerlos.
      </p>

      <div className="mt-10 space-y-7 text-sm leading-relaxed text-text-secondary">
        <div>
          <h2 className="text-base font-semibold text-text-primary">Datos que recopilamos</h2>
          <p className="mt-2">
            Nombre, correo electrónico, teléfono, interés de producto y datos que compartís en formularios o
            canales de contacto.
          </p>
        </div>
        <div>
          <h2 className="text-base font-semibold text-text-primary">Uso de la información</h2>
          <p className="mt-2">
            Utilizamos tus datos para preparar cotizaciones, coordinar seguimiento comercial, agendar servicios y
            mejorar la atención al cliente.
          </p>
        </div>
        <div>
          <h2 className="text-base font-semibold text-text-primary">Tus derechos</h2>
          <p className="mt-2">
            Podés solicitar acceso, corrección o eliminación de tus datos escribiendo a
            <a className="ml-1 text-secondary-600 hover:text-secondary-500" href="mailto:mercadeo@yamahacr.com">
              mercadeo@yamahacr.com
            </a>
            .
          </p>
        </div>
      </div>
    </section>
  );
}
