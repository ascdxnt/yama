import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { FilterableProductGrid } from '@/components/blocks';
import { BreadcrumbJsonLd } from '@/components/seo/breadcrumb-json-ld';
import { getProductsByCategory } from '@/lib/data/queries';

const MARINO_CATEGORY_MAP = {
  waverunner: { label: 'Waverunner' },
  'motores-fuera-de-borda': { label: 'Motores Fuera de Borda' },
} as const;

interface MarinoCategoryPageProps {
  params: Promise<{ category: string }>;
}

export async function generateMetadata({ params }: MarinoCategoryPageProps): Promise<Metadata> {
  const { category } = await params;
  const cat = MARINO_CATEGORY_MAP[category as keyof typeof MARINO_CATEGORY_MAP];
  if (!cat) return {};
  return {
    title: `Marino ${cat.label}`,
    description: `Explorá la línea Yamaha ${cat.label} en Costa Rica.`,
  };
}

export default async function MarinoCategoryPage({ params }: MarinoCategoryPageProps) {
  const { category } = await params;
  const cat = MARINO_CATEGORY_MAP[category as keyof typeof MARINO_CATEGORY_MAP];
  if (!cat) notFound();

  const products = (await getProductsByCategory(category)).filter((p) => p.category.parentCategory === 'marino');

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Inicio', href: '/' },
          { name: 'Marino', href: '/marino' },
          { name: cat.label, href: `/marino/${category}` },
        ]}
      />

      <section className="relative border-b border-surface-subtle bg-surface-ghost">
        <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
          <nav className="mb-4 flex items-center gap-1.5 text-sm text-text-muted">
            <Link href="/" className="transition-colors-premium hover:text-secondary-500">Inicio</Link>
            <span className="text-text-muted/40">/</span>
            <Link href="/marino" className="transition-colors-premium hover:text-secondary-500">Marino</Link>
            <span className="text-text-muted/40">/</span>
            <span className="font-medium text-text-primary">{cat.label}</span>
          </nav>
          <h1 className="text-2xl font-extrabold text-text-primary sm:text-3xl">{cat.label}</h1>
          <p className="mt-1.5 text-text-secondary">
            {products.length} {products.length === 1 ? 'modelo disponible' : 'modelos disponibles'}
          </p>
          {category === 'motores-fuera-de-borda' && (
            <div className="mt-4 rounded-xl border border-surface-subtle bg-white p-4 text-sm text-text-secondary sm:inline-flex sm:items-center sm:gap-4">
              <span className="font-semibold text-text-primary">+506 2211 5900</span>
              <a
                href="https://wa.me/50683027848?text=Hola%2C%20necesito%20asesoria%20de%20Yamaha%20Marino."
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 inline-flex items-center gap-1.5 text-[#25D366] hover:underline sm:mt-0"
              >
                WhatsApp Yamaha Marino
                <span className="font-semibold">+506 8302-7848</span>
              </a>
            </div>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <FilterableProductGrid
          products={products}
          columns={3}
          allowCategoryFilter={false}
          tagFilterOptions={category === 'motores-fuera-de-borda' ? ['4 Tiempos', '2 Tiempos'] : []}
        />
      </section>
    </>
  );
}
