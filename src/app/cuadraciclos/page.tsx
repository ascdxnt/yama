import type { Metadata } from 'next';
import { FilterableProductGrid } from '@/components/blocks';
import { getAllProducts } from '@/lib/data/queries';

export const metadata: Metadata = {
  title: 'Cuadraciclos & Mulas',
  description: 'Cuadraciclos y vehículos utilitarios Yamaha en Costa Rica. Recreativos y de trabajo.',
};

export default async function CuadraciclosPage() {
  const products = await getAllProducts();
  const cuadraciclos = products.filter((p) => p.category.parentCategory === 'cuadraciclos');

  return (
    <>
      <section className="bg-primary-900">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <h1 className="text-3xl font-extrabold text-white sm:text-4xl">Cuadraciclos & Mulas</h1>
          <p className="mt-2 max-w-xl text-lg text-primary-200">
            Vehículos todo terreno para trabajo y aventura.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {cuadraciclos.length > 0 ? (
          <FilterableProductGrid products={cuadraciclos} columns={3} />
        ) : (
          <div className="rounded-2xl border border-surface-subtle bg-surface-ghost p-8 text-center">
            <p className="text-lg font-semibold text-text-secondary">Próximamente</p>
            <p className="mt-1 text-sm text-text-muted">Estamos actualizando nuestro catálogo de cuadraciclos.</p>
          </div>
        )}
      </section>
    </>
  );
}
