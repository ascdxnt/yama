import { ProductCard } from '@/components/composites';
import type { Product } from '@/types';

interface ProductGridProps {
  products: Product[];
  columns?: 2 | 3 | 4;
}

const columnClasses = {
  2: 'grid-cols-1 sm:grid-cols-2',
  3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
};

export function ProductGrid({ products, columns = 3 }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <p className="text-lg font-semibold text-text-secondary">No se encontraron productos</p>
        <p className="mt-1 text-sm text-text-muted">Intentá con otra categoría o contactanos directamente.</p>
      </div>
    );
  }

  return (
    <div className={`grid min-w-0 gap-4 sm:gap-6 ${columnClasses[columns]}`}>
      {products.map((product) => (
        <ProductCard
          key={product._id}
          name={product.name}
          slug={product.slug}
          categorySlug={product.category.slug}
          parentCategory={product.category.parentCategory}
          price={product.price}
          salePrice={product.salePrice}
          currency={product.currency}
          image={product.heroImage}
          specs={product.keySpecs.slice(0, 2).map((s) => ({ label: s.label, value: s.value }))}
          tags={product.tags}
          status={product.status}
        />
      ))}
    </div>
  );
}
