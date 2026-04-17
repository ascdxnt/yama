import Image from 'next/image';
import Link from 'next/link';

const CATEGORIES_DISPLAY = [
  {
    name: 'Motocicletas',
    href: '/motos',
    description: 'Scooter, urbanas, montañero, alta cilindrada y más',
    image: '/categories/home/motocicletas/cover.avif',
  },
  {
    name: 'Cuadraciclos',
    href: '/cuadraciclos',
    description: 'Vehículos recreativos todo terreno',
    image: '/categories/home/cuadraciclos/cover.avif',
  },
  {
    name: 'Side by Side',
    href: '/cuadraciclos',
    description: 'Vehículos utilitarios multipasajero',
    image: '/categories/home/side-by-side/cover.avif',
  },
  {
    name: 'WaveRunner',
    href: '/marino/waverunner',
    description: 'Motos acuáticas de alto rendimiento',
    image: '/categories/home/waverunner/cover.avif',
  },
  {
    name: 'Motores Fuera de Borda',
    href: '/marino/motores-fuera-de-borda',
    description: 'Potencia confiable en el agua',
    image: '/categories/home/motores-fuera-de-borda/cover.avif',
  },
  {
    name: 'Repuestos y Accesorios',
    href: '/repuestos',
    description: 'Repuestos originales y accesorios Yamaha',
    image: '/categories/home/repuestos-y-accesorios/cover.avif',
  },
];

export function CategoryShowcase() {
  const cardLayout = [
    'lg:col-span-2 lg:row-span-2',
    'lg:col-span-1 lg:row-span-1',
    'lg:col-span-1 lg:row-span-1',
    'lg:col-span-2 lg:row-span-1',
    'lg:col-span-1 lg:row-span-1',
    'lg:col-span-1 lg:row-span-1',
  ];

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4 lg:auto-rows-[minmax(14rem,auto)] lg:gap-6">
      {CATEGORIES_DISPLAY.map((cat, index) => (
        <Link
          key={cat.href + cat.name}
          href={cat.href}
          className={`group flex flex-col overflow-hidden rounded-[1.5rem] bg-white shadow-card ring-1 ring-black/[0.04] transition-premium hover:-translate-y-1 hover:shadow-card-hover active:scale-[0.98] ${cardLayout[index]}`}
        >
          <div className="relative aspect-[4/3] bg-white lg:aspect-auto lg:min-h-44">
            <Image
              src={cat.image}
              alt={cat.name}
              fill
              className="object-contain transition-transform group-hover:scale-[1.03]"
              style={{
                transitionDuration: 'var(--duration-glacial)',
                transitionTimingFunction: 'var(--ease-out-expo)',
              }}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          </div>

          <div className="flex flex-1 flex-col p-5 sm:p-6">
            <h3 className="text-lg font-extrabold leading-tight tracking-[-0.01em] text-text-primary transition-colors-premium group-hover:text-secondary-500 sm:text-xl">
              {cat.name}
            </h3>
            <p className="mt-1.5 max-w-[42ch] text-[13px] leading-relaxed text-text-secondary">
              {cat.description}
            </p>

            <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-secondary-500 transition-colors-premium group-hover:text-secondary-400">
              Explorar
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-secondary-500/10 transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-1 group-hover:-translate-y-[1px] group-hover:scale-105 group-hover:bg-secondary-500/20">
                <svg
                  className="h-3 w-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.7}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
