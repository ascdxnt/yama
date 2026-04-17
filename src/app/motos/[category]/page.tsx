import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { FilterableProductGrid } from '@/components/blocks';
import { BreadcrumbJsonLd } from '@/components/seo/breadcrumb-json-ld';
import { getProductsByCategory } from '@/lib/data/queries';
import { CATEGORIES } from '@/lib/constants';

interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category } = await params;
  const subcategory = CATEGORIES.motos.subcategories.find((s) => s.slug === category);
  if (!subcategory) return {};

  return {
    title: `Motos ${subcategory.label}`,
    description: `Explorá la línea de motos Yamaha ${subcategory.label} disponibles en Costa Rica. Precios, especificaciones y financiamiento.`,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;
  const subcategory = CATEGORIES.motos.subcategories.find((s) => s.slug === category);
  if (!subcategory) notFound();

  const products = await getProductsByCategory(category);

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Inicio', href: '/' },
          { name: 'Motos', href: '/motos' },
          { name: subcategory.label, href: `/motos/${category}` },
        ]}
      />

      <section className="relative border-b border-surface-subtle bg-surface-ghost">
        <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
          <nav className="mb-4 flex items-center gap-1.5 text-sm text-text-muted">
            <Link href="/" className="transition-colors-premium hover:text-secondary-500">Inicio</Link>
            <span className="text-text-muted/40">/</span>
            <Link href="/motos" className="transition-colors-premium hover:text-secondary-500">Motos</Link>
            <span className="text-text-muted/40">/</span>
            <span className="font-medium text-text-primary">{subcategory.label}</span>
          </nav>
          <h1 className="text-2xl font-extrabold text-text-primary sm:text-3xl">
            {subcategory.label}
          </h1>
          <p className="mt-1.5 text-text-secondary">
            {products.length} {products.length === 1 ? 'modelo disponible' : 'modelos disponibles'}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <FilterableProductGrid products={products} columns={3} />
      </section>
    </>
  );
}
