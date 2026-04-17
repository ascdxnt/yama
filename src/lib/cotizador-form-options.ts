/** Opciones del cotizador alineadas al formulario original (Wix). */

import type { Product } from '@/types';

export type CotizadorSelectEntry =
  | { kind: 'option'; value: string; label: string }
  | { kind: 'separator' };

const PARENT_ORDER: Record<Product['category']['parentCategory'], number> = {
  motos: 0,
  cuadraciclos: 1,
  marino: 2,
};

export function buildCotizadorModelEntries(products: Product[]): CotizadorSelectEntry[] {
  const sorted = [...products]
    .filter((product) => product.status !== 'discontinued')
    .sort((a, b) => {
      const parentDiff = PARENT_ORDER[a.category.parentCategory] - PARENT_ORDER[b.category.parentCategory];
      if (parentDiff !== 0) return parentDiff;

      const categoryDiff = a.category.name.localeCompare(b.category.name, 'es');
      if (categoryDiff !== 0) return categoryDiff;

      const sortOrderDiff = a.sortOrder - b.sortOrder;
      if (sortOrderDiff !== 0) return sortOrderDiff;

      return a.name.localeCompare(b.name, 'es');
    });

  const entries: CotizadorSelectEntry[] = [];
  let currentParent: Product['category']['parentCategory'] | null = null;

  for (const product of sorted) {
    if (currentParent && currentParent !== product.category.parentCategory) {
      entries.push({ kind: 'separator' });
    }
    currentParent = product.category.parentCategory;

    entries.push({
      kind: 'option',
      value: product.slug,
      label: product.name,
    });
  }

  return entries;
}

export const COTIZADOR_BRANCH_OPTIONS: { value: string; label: string }[] = [
  { value: 'Alajuela', label: 'Alajuela' },
  { value: 'Heredia', label: 'Heredia' },
  { value: 'Liberia', label: 'Liberia' },
  { value: 'San Carlos', label: 'San Carlos' },
  { value: 'San Ramón', label: 'San Ramón' },
  { value: 'Plaza Viquez', label: 'Plaza Viquez' },
  { value: 'Quepos', label: 'Quepos' },
  { value: 'Uruca', label: 'Uruca' },
];
