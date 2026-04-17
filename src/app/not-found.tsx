import Link from 'next/link';

export default function NotFound() {
  return (
    <section className="relative min-h-[100dvh] overflow-hidden bg-surface-ghost px-4 py-24 sm:px-6 lg:px-8">
      <div
        className="absolute inset-0 opacity-10"
        style={{
          background:
            'radial-gradient(circle at 10% 20%, rgba(0,62,149,0.18), transparent 42%), radial-gradient(circle at 88% 80%, rgba(14,135,215,0.2), transparent 40%)',
        }}
        aria-hidden="true"
      />

      <div className="relative mx-auto flex max-w-5xl items-center justify-center">
        <div className="w-full rounded-[2rem] bg-white p-1.5 ring-1 ring-black/[0.05]">
          <div className="rounded-[calc(2rem-0.375rem)] bg-white px-6 py-14 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.9)] sm:px-12 sm:py-20">
            <p className="text-[10px] font-semibold tracking-[0.18em] text-text-muted">error 404</p>
            <p className="mt-3 text-7xl font-extrabold leading-none tracking-[-0.04em] text-primary-500 sm:text-8xl">404</p>
            <h1 className="mt-4 text-[clamp(1.65rem,2.7vw,2.4rem)] font-extrabold leading-[1.08] tracking-[-0.02em] text-text-primary">
              Esta página no está disponible
            </h1>
            <p className="mx-auto mt-3 max-w-[46ch] text-base leading-relaxed text-text-secondary">
              Revisá el enlace o volvé al inicio para seguir navegando los modelos y servicios Yamaha.
            </p>
            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/"
                className="group inline-flex h-11 items-center gap-2 rounded-full bg-secondary-500 pl-6 pr-2 text-sm font-semibold text-white transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-secondary-400 active:scale-[0.98]"
              >
                Volver al inicio
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/20 transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-1 group-hover:-translate-y-[1px] group-hover:scale-105">
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.7}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                  </svg>
                </span>
              </Link>
              <Link
                href="/contacto"
                className="inline-flex h-11 items-center rounded-full border border-surface-border px-6 text-sm font-semibold text-text-primary transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:border-secondary-500/40 hover:bg-secondary-500/[0.06] active:scale-[0.98]"
              >
                Ir a contacto
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
