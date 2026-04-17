import { ProductGrid } from './product-grid';
import type { Product } from '@/types';

interface RelatedProductsProps {
  products: Product[];
}

export function RelatedProducts({ products }: RelatedProductsProps) {
  return (
    <div className="min-w-0">
      <h2 className="text-2xl font-bold text-text-primary">También te puede interesar</h2>
      <div className="mt-8">
        <ProductGrid products={products} columns={3} />
      </div>
    </div>
  );
}
