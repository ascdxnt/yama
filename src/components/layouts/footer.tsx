import Link from 'next/link';
import { YamahaLogo } from '@/components/primitives';
import { CATEGORIES, SITE_NAME, CONTACT, DEALERSHIP, SOCIALS } from '@/lib/constants';
import { Reveal } from '@/components/patterns/reveal';

const currentYear = new Date().getFullYear();

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 1.092.044 1.545.094v3.24h-1.286c-1.471 0-1.927.7-1.927 2.022v2.202h3.127l-.537 3.667h-2.59v7.98" />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
    </svg>
  );
}

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.66a8.21 8.21 0 0 0 4.76 1.52v-3.4a4.85 4.85 0 0 1-1-.09z" />
    </svg>
  );
}

const socialIcons: Record<string, React.FC<{ className?: string }>> = {
  Facebook: FacebookIcon,
  Instagram: InstagramIcon,
  TikTok: TikTokIcon,
};

export function Footer() {
  return (
    <footer className="noise-overlay relative bg-primary-900 text-white">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px"
        style={{
          background:
            'linear-gradient(90deg, transparent, rgba(14,135,215,0.4) 20%, rgba(0,62,149,0.6) 50%, rgba(14,135,215,0.4) 80%, transparent)',
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <Reveal>
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">
            <div className="sm:col-span-2 lg:col-span-5">
              <YamahaLogo className="h-8 w-auto" color="#ffffff" />
              <p className="mt-5 max-w-sm text-[15px] leading-relaxed text-primary-300/90">
                Distribuidor autorizado Yamaha. Motos, cuadraciclos, productos marinos, repuestos y servicio técnico.
              </p>

              <div className="mt-6 space-y-2.5 text-sm text-primary-300">
                <p>{DEALERSHIP.address}</p>
                <p>
                  Tel:{' '}
                  <a href={`tel:${CONTACT.phoneRaw}`} className="text-primary-200 transition-colors-premium hover:text-white">
                    {CONTACT.phone}
                  </a>
                </p>
                <p>
                  WA:{' '}
                  <a
                    href={`https://wa.me/${CONTACT.whatsappRaw}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-200 transition-colors-premium hover:text-white"
                  >
                    {CONTACT.whatsapp}
                  </a>
                </p>
                <p>
                  <a href={`mailto:${CONTACT.email}`} className="text-primary-200 transition-colors-premium hover:text-white">
                    {CONTACT.email}
                  </a>
                </p>
                <p className="text-primary-400">{CONTACT.hours.short}</p>
              </div>

              <div className="mt-8 flex items-center gap-3">
                {SOCIALS.map((social) => {
                  const Icon = socialIcons[social.name];
                  return (
                    <a
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.name}
                      className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-800/80 text-primary-300 transition-premium hover:-translate-y-1 hover:bg-primary-700 hover:text-white active:scale-[0.95]"
                    >
                      {Icon && <Icon className="h-[18px] w-[18px]" />}
                    </a>
                  );
                })}
              </div>
            </div>

            <div className="lg:col-span-2 lg:col-start-7">
              <h3 className="text-[11px] font-semibold tracking-[0.15em] text-primary-400">Motos</h3>
              <ul className="mt-5 space-y-3">
                {CATEGORIES.motos.subcategories.map((sub) => (
                  <li key={sub.slug}>
                    <Link
                      href={`/motos/${sub.slug}`}
                      className="inline-block text-sm text-primary-200/90 transition-all duration-300 hover:translate-x-0.5 hover:text-white"
                      style={{ transitionTimingFunction: 'var(--ease-out-expo)' }}
                    >
                      {sub.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="lg:col-span-2">
              <h3 className="text-[11px] font-semibold tracking-[0.15em] text-primary-400">Marino</h3>
              <ul className="mt-5 space-y-3">
                {CATEGORIES.marino.subcategories.map((sub) => (
                  <li key={sub.slug}>
                    <Link
                      href={('href' in sub ? sub.href : undefined) ?? `/marino/${sub.slug}`}
                      className="inline-block text-sm text-primary-200/90 transition-all duration-300 hover:translate-x-0.5 hover:text-white"
                      style={{ transitionTimingFunction: 'var(--ease-out-expo)' }}
                    >
                      {sub.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="lg:col-span-2">
              <h3 className="text-[11px] font-semibold tracking-[0.15em] text-primary-400">Enlaces</h3>
              <ul className="mt-5 space-y-3">
                {[
                  { label: 'Cotizar', href: '/cotizador' },
                  { label: 'Repuestos', href: '/repuestos' },
                  { label: 'Taller', href: '/taller' },
                  { label: 'Sucursales', href: '/sucursales' },
                  { label: 'Contacto', href: '/contacto' },
                  { label: 'Política de privacidad', href: '/privacidad' },
                  { label: 'Términos de servicio', href: '/terminos' },
                ].map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="inline-block text-sm text-primary-200/90 transition-all duration-300 hover:translate-x-0.5 hover:text-white"
                      style={{ transitionTimingFunction: 'var(--ease-out-expo)' }}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-primary-800/60 pt-8 sm:flex-row">
            <p className="text-xs text-primary-400/80">
              &copy; {currentYear} {SITE_NAME}. Todos los derechos reservados.
            </p>
            <p className="text-xs text-primary-400/80">
              Distribuidor autorizado Yamaha Motor Co., Ltd.
            </p>
            <p className="text-xs text-primary-400/80">
              Powered by{' '}
              <a
                href="https://www.tridnio.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-200 transition-colors-premium hover:text-white"
              >
                Tridnio
              </a>
            </p>
          </div>
        </Reveal>
      </div>
    </footer>
  );
}
