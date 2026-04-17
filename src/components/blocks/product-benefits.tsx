import type { ProductBenefit } from '@/types';

interface ProductBenefitsProps {
  benefits: ProductBenefit[];
}

export function ProductBenefits({ benefits }: ProductBenefitsProps) {
  if (benefits.length === 0) return null;

  return (
    <div className="min-w-0">
      <h2 className="text-xl font-bold text-text-primary">¿Por qué elegir este modelo?</h2>
      <div className="mt-4 grid min-w-0 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {benefits.map((b) => (
          <div
            key={b.title}
            className="flex min-w-0 gap-3 rounded-xl border border-surface-subtle bg-white p-4 shadow-sm"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary-50">
              {b.type === 'emotional' ? (
                <svg className="h-4.5 w-4.5 text-secondary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925 3.546 5.974 5.974 0 01-2.133-1.001A3.75 3.75 0 0012 18z" />
                </svg>
              ) : (
                <svg className="h-4.5 w-4.5 text-secondary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                </svg>
              )}
            </div>
            <div className="min-w-0">
              <h3 className="break-words text-sm font-bold text-text-primary">{b.title}</h3>
              <p className="mt-0.5 break-words text-xs leading-relaxed text-text-secondary">{b.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
