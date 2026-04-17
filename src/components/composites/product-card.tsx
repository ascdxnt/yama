import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { formatPrice, type Currency } from '@/lib/utils';
import { Badge } from '@/components/primitives';

interface ProductCardProps {
  name: string;
  slug: string;
  categorySlug: string;
  parentCategory: string;
  price: number;
  salePrice?: number;
  currency: Currency;
  image: {
    url: string;
    alt: string;
    width: number;
    height: number;
    blurDataUrl?: string;
  };
  specs?: Array<{ label: string; value: string }>;
  tags?: string[];
  status?: 'active' | 'coming_soon' | 'discontinued';
  className?: string;
}

export function ProductCard({
  name,
  slug,
  categorySlug,
  parentCategory,
  price,
  salePrice,
  currency,
  image,
  specs,
  tags,
  status = 'active',
  className,
}: ProductCardProps) {
  const href =
    parentCategory === 'cuadraciclos'
      ? `/cuadraciclos/${slug}`
      : parentCategory === 'marino'
        ? `/marino/${categorySlug}/${slug}`
        : `/motos/${categorySlug}/${slug}`;

  const hasDiscount = salePrice != null && salePrice < price;
  const displayPrice = hasDiscount ? salePrice : price;

  return (
    <Link
      href={href}
      className={cn(
        'group relative flex min-w-0 max-w-full flex-col rounded-[1.5rem] bg-surface-ghost/50 p-1.5 ring-1 ring-black/[0.03]',
        'transition-all active:scale-[0.98]',
        className,
      )}
      style={{
        transitionProperty: 'transform, box-shadow',
        transitionDuration: 'var(--duration-slow)',
        transitionTimingFunction: 'var(--ease-out-expo)',
      }}
    >
      <div
        className="relative flex flex-1 flex-col overflow-hidden rounded-[calc(1.5rem-0.375rem)] bg-white shadow-card group-hover:-translate-y-0.5 group-hover:shadow-card-hover"
        style={{
          boxShadow: 'var(--shadow-card), inset 0 1px 1px rgba(255,255,255,0.5)',
          transitionProperty: 'transform, box-shadow',
          transitionDuration: 'var(--duration-slow)',
          transitionTimingFunction: 'var(--ease-out-expo)',
        }}
      >
        <div className="relative aspect-[4/3] overflow-hidden bg-white">
          <Image
            src={image.url}
            alt={image.alt}
            width={image.width}
            height={image.height}
            className="h-full w-full object-contain transition-transform group-hover:scale-[1.03]"
            style={{
              transitionDuration: 'var(--duration-glacial)',
              transitionTimingFunction: 'var(--ease-out-expo)',
            }}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            {...(image.blurDataUrl && {
              placeholder: 'blur' as const,
              blurDataURL: image.blurDataUrl,
            })}
          />
          {status === 'coming_soon' && (
            <Badge variant="warning" className="absolute left-3 top-3">
              Próximamente
            </Badge>
          )}
          {hasDiscount && (
            <span className="absolute right-3 top-3 rounded-full bg-red-600 px-2.5 py-1 text-xs font-bold text-white shadow-md">
              Oferta
            </span>
          )}
        </div>

        <div className="flex min-w-0 flex-1 flex-col p-4 sm:p-5">
          <h3 className="break-words text-base font-semibold leading-tight tracking-[-0.01em] text-text-primary transition-colors-premium group-hover:text-secondary-500 sm:text-lg">
            {name}
          </h3>

          {tags && tags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-primary-50 px-2.5 py-0.5 text-[10px] font-semibold tracking-[0.12em] text-primary-700"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {specs && specs.length > 0 && (
            <div className="mt-2.5 flex flex-wrap gap-x-3 gap-y-1">
              {specs.slice(0, 3).map((spec) => (
                <span key={spec.label} className="text-xs text-text-muted">
                  <span className="font-medium text-text-secondary">{spec.value}</span>
                </span>
              ))}
            </div>
          )}

          <div className="mt-auto pt-4">
            {hasDiscount ? (
              <div className="flex min-w-0 flex-wrap items-baseline gap-x-2 gap-y-0.5">
                <p className="min-w-0 text-lg font-extrabold tabular-nums text-red-600">
                  {formatPrice(displayPrice, currency)}
                </p>
                <p className="min-w-0 text-sm font-medium tabular-nums text-text-muted line-through">
                  {formatPrice(price, currency)}
                </p>
              </div>
            ) : (
              <p className="text-lg font-extrabold tabular-nums text-text-primary">
                {formatPrice(price, currency)}
              </p>
            )}

            <span className="mt-2.5 inline-flex items-center gap-2 text-sm font-semibold text-secondary-500 transition-colors-premium group-hover:text-secondary-400">
              Ver modelo
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-secondary-500/10 transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-1 group-hover:-translate-y-[1px] group-hover:scale-105 group-hover:bg-secondary-500/20">
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
        </div>
      </div>
    </Link>
  );
}
