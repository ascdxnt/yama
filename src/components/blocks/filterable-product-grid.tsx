'use client';

import { useMemo, useState } from 'react';
import { ProductGrid } from './product-grid';
import type { Product } from '@/types';

interface FilterableProductGridProps {
  products: Product[];
  columns?: 2 | 3 | 4;
  allowCategoryFilter?: boolean;
  tagFilterOptions?: string[];
}

type SortOption = 'featured' | 'price_asc' | 'price_desc' | 'name_asc' | 'year_desc';
type AvailabilityFilter = 'all' | 'active' | 'coming_soon';
type FinancingFilter = 'all' | 'yes' | 'no';
type PriceFilter = 'all' | 'low' | 'mid' | 'high' | 'premium';

function getEffectivePrice(product: Product) {
  return product.salePrice != null && product.salePrice < product.price ? product.salePrice : product.price;
}

function getSortablePrice(product: Product) {
  const price = getEffectivePrice(product);
  return price > 0 ? price : Number.MAX_SAFE_INTEGER;
}

function matchesPriceFilter(price: number, filter: PriceFilter) {
  switch (filter) {
    case 'low':
      return price <= 1500000;
    case 'mid':
      return price > 1500000 && price <= 3000000;
    case 'high':
      return price > 3000000 && price <= 5000000;
    case 'premium':
      return price > 5000000;
    default:
      return true;
  }
}

export function FilterableProductGrid({
  products,
  columns = 3,
  allowCategoryFilter = true,
  tagFilterOptions = [],
}: FilterableProductGridProps) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [availability, setAvailability] = useState<AvailabilityFilter>('all');
  const [financing, setFinancing] = useState<FinancingFilter>('all');
  const [tagFilter, setTagFilter] = useState('all');
  const [priceRange, setPriceRange] = useState<PriceFilter>('all');
  const [sortBy, setSortBy] = useState<SortOption>('price_asc');

  const categories = useMemo(
    () =>
      [...new Map(products.map((product) => [product.category.slug, product.category.name])).entries()]
        .map(([slug, name]) => ({ slug, name }))
        .sort((a, b) => a.name.localeCompare(b.name, 'es')),
    [products],
  );

  const filteredProducts = useMemo(() => {
    const q = search.trim().toLowerCase();

    const filtered = products.filter((product) => {
      if (category !== 'all' && product.category.slug !== category) return false;
      if (availability !== 'all' && product.status !== availability) return false;
      if (financing === 'yes' && !product.financing.eligible) return false;
      if (financing === 'no' && product.financing.eligible) return false;
      if (tagFilter !== 'all' && !(product.tags ?? []).includes(tagFilter)) return false;
      if (!matchesPriceFilter(getEffectivePrice(product), priceRange)) return false;

      if (!q) return true;

      const haystack = [product.name, product.category.name, ...(product.tags ?? [])].join(' ').toLowerCase();
      return haystack.includes(q);
    });

    filtered.sort((a, b) => {
      if (sortBy === 'featured') {
        if (a.featured !== b.featured) return a.featured ? -1 : 1;
        if (a.sortOrder !== b.sortOrder) return a.sortOrder - b.sortOrder;
        return a.name.localeCompare(b.name, 'es');
      }

      if (sortBy === 'price_asc') return getSortablePrice(a) - getSortablePrice(b);
      if (sortBy === 'price_desc') return getSortablePrice(b) - getSortablePrice(a);
      if (sortBy === 'name_asc') return a.name.localeCompare(b.name, 'es');
      return b.year - a.year;
    });

    return filtered;
  }, [availability, category, financing, priceRange, products, search, sortBy, tagFilter]);

  const resetFilters = () => {
    setSearch('');
    setCategory('all');
    setAvailability('all');
    setFinancing('all');
    setTagFilter('all');
    setPriceRange('all');
    setSortBy('price_asc');
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-surface-subtle bg-surface-ghost/60 p-4 sm:p-5">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          <label className="flex flex-col gap-1 text-xs font-semibold uppercase tracking-wide text-text-muted">
            Buscar
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Modelo o tag"
              className="h-10 rounded-xl border border-surface-border bg-white px-3 text-sm normal-case tracking-normal text-text-primary outline-none transition-colors focus:border-secondary-500 focus:ring-2 focus:ring-secondary-500/20"
            />
          </label>

          {allowCategoryFilter && categories.length > 1 && (
            <label className="flex flex-col gap-1 text-xs font-semibold uppercase tracking-wide text-text-muted">
              Categoría
              <select
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                className="h-10 rounded-xl border border-surface-border bg-white px-3 text-sm normal-case tracking-normal text-text-primary outline-none transition-colors focus:border-secondary-500 focus:ring-2 focus:ring-secondary-500/20"
              >
                <option value="all">Todas</option>
                {categories.map((entry) => (
                  <option key={entry.slug} value={entry.slug}>
                    {entry.name}
                  </option>
                ))}
              </select>
            </label>
          )}

          <label className="flex flex-col gap-1 text-xs font-semibold uppercase tracking-wide text-text-muted">
            Precio
            <select
              value={priceRange}
              onChange={(event) => setPriceRange(event.target.value as PriceFilter)}
              className="h-10 rounded-xl border border-surface-border bg-white px-3 text-sm normal-case tracking-normal text-text-primary outline-none transition-colors focus:border-secondary-500 focus:ring-2 focus:ring-secondary-500/20"
            >
              <option value="all">Todos</option>
              <option value="low">Hasta ₡1.500.000</option>
              <option value="mid">₡1.500.001 - ₡3.000.000</option>
              <option value="high">₡3.000.001 - ₡5.000.000</option>
              <option value="premium">Más de ₡5.000.000</option>
            </select>
          </label>

          <label className="flex flex-col gap-1 text-xs font-semibold uppercase tracking-wide text-text-muted">
            Disponibilidad
            <select
              value={availability}
              onChange={(event) => setAvailability(event.target.value as AvailabilityFilter)}
              className="h-10 rounded-xl border border-surface-border bg-white px-3 text-sm normal-case tracking-normal text-text-primary outline-none transition-colors focus:border-secondary-500 focus:ring-2 focus:ring-secondary-500/20"
            >
              <option value="all">Todos</option>
              <option value="active">Disponibles</option>
              <option value="coming_soon">Proximamente</option>
            </select>
          </label>

          <label className="flex flex-col gap-1 text-xs font-semibold uppercase tracking-wide text-text-muted">
            Financiamiento
            <select
              value={financing}
              onChange={(event) => setFinancing(event.target.value as FinancingFilter)}
              className="h-10 rounded-xl border border-surface-border bg-white px-3 text-sm normal-case tracking-normal text-text-primary outline-none transition-colors focus:border-secondary-500 focus:ring-2 focus:ring-secondary-500/20"
            >
              <option value="all">Todos</option>
              <option value="yes">Disponible</option>
              <option value="no">No disponible</option>
            </select>
          </label>

          {tagFilterOptions.length > 0 && (
            <label className="flex flex-col gap-1 text-xs font-semibold uppercase tracking-wide text-text-muted">
              Tipo
              <select
                value={tagFilter}
                onChange={(event) => setTagFilter(event.target.value)}
                className="h-10 rounded-xl border border-surface-border bg-white px-3 text-sm normal-case tracking-normal text-text-primary outline-none transition-colors focus:border-secondary-500 focus:ring-2 focus:ring-secondary-500/20"
              >
                <option value="all">Todos</option>
                {tagFilterOptions.map((tag) => (
                  <option key={tag} value={tag}>
                    {tag}
                  </option>
                ))}
              </select>
            </label>
          )}

          <label className="flex flex-col gap-1 text-xs font-semibold uppercase tracking-wide text-text-muted">
            Ordenar por
            <select
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value as SortOption)}
              className="h-10 rounded-xl border border-surface-border bg-white px-3 text-sm normal-case tracking-normal text-text-primary outline-none transition-colors focus:border-secondary-500 focus:ring-2 focus:ring-secondary-500/20"
            >
              <option value="featured">Destacados</option>
              <option value="price_asc">Precio: menor a mayor</option>
              <option value="price_desc">Precio: mayor a menor</option>
              <option value="name_asc">Nombre A-Z</option>
              <option value="year_desc">Mas recientes</option>
            </select>
          </label>
        </div>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-text-secondary">
            {filteredProducts.length} {filteredProducts.length === 1 ? 'modelo encontrado' : 'modelos encontrados'}
          </p>
          <button
            type="button"
            onClick={resetFilters}
            className="inline-flex h-9 items-center justify-center rounded-full border border-surface-border bg-white px-4 text-xs font-semibold uppercase tracking-wide text-text-secondary transition-colors hover:border-secondary-500/40 hover:text-secondary-500"
          >
            Limpiar filtros
          </button>
        </div>
      </div>

      <ProductGrid products={filteredProducts} columns={columns} />
    </div>
  );
}
