'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { cn, formatPrice } from '@/lib/utils';
import { calculateFinancing } from '@/lib/financing/calculator';
import { dataLayer } from '@/lib/tracking/data-layer';
import { CONTACT } from '@/lib/constants';
import { KeySpecs } from '@/components/composites';
import type { Product } from '@/types';

interface ProductHeroProps {
  product: Product;
}

export function ProductHero({ product }: ProductHeroProps) {
  const [activeImage, setActiveImage] = useState(0);
  const hasGalleryNavigation = product.images.length > 1;

  const goToImage = (index: number) => {
    setActiveImage(index);
    dataLayer.push({
      name: 'product_gallery_interact',
      params: { product_id: product._id, image_index: index },
    });
  };

  const goToPreviousImage = () => {
    if (!hasGalleryNavigation) return;
    const previousIndex = (activeImage - 1 + product.images.length) % product.images.length;
    goToImage(previousIndex);
  };

  const goToNextImage = () => {
    if (!hasGalleryNavigation) return;
    const nextIndex = (activeImage + 1) % product.images.length;
    goToImage(nextIndex);
  };

  useEffect(() => {
    if (!hasGalleryNavigation) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.altKey || event.ctrlKey || event.metaKey) return;

      const target = event.target as HTMLElement | null;
      if (target?.isContentEditable) return;

      const targetTag = target?.tagName;
      if (targetTag === 'INPUT' || targetTag === 'TEXTAREA' || targetTag === 'SELECT') return;

      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        goToPreviousImage();
      }

      if (event.key === 'ArrowRight') {
        event.preventDefault();
        goToNextImage();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeImage, hasGalleryNavigation, product.images.length]);

  const hasDiscount = product.salePrice != null && product.salePrice < product.price;
  const effectivePrice = hasDiscount ? product.salePrice! : product.price;
  const hidePrice = product.category.parentCategory === 'marino' && product.category.slug === 'motores-fuera-de-borda';

  const monthlyEstimate = product.financing.eligible
    ? product.financing.monthlyPayment
      ? product.financing.monthlyPayment
      : calculateFinancing({
          price: effectivePrice,
          downPaymentPercent: product.financing.defaultDownPayment,
          termMonths: product.financing.defaultTerm,
        }).monthlyPayment
    : null;

  const whatsappUrl = `https://wa.me/${CONTACT.whatsappRaw}?text=${encodeURIComponent(
    `Hola, me interesa el modelo ${product.name}. ¿Podrían darme más información?`,
  )}`;

  const sectionBasePath =
    product.category.parentCategory === 'motos'
      ? '/motos'
      : product.category.parentCategory === 'cuadraciclos'
        ? '/cuadraciclos'
        : '/marino';

  const sectionLabel =
    product.category.parentCategory === 'motos'
      ? 'Motos'
      : product.category.parentCategory === 'cuadraciclos'
        ? 'Cuadraciclos & Mulas'
        : 'Marino';

  const categoryHref = product.category.parentCategory === 'cuadraciclos' ? '/cuadraciclos' : `${sectionBasePath}/${product.category.slug}`;

  const productPagePath =
    product.category.parentCategory === 'motos'
      ? `/motos/${product.category.slug}/${product.slug}`
      : product.category.parentCategory === 'cuadraciclos'
        ? `/cuadraciclos/${product.slug}`
        : `/marino/${product.category.slug}/${product.slug}`;

  return (
    <section className="mx-auto min-w-0 max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8 lg:py-14">
      <nav
        aria-label="Breadcrumb"
        className="mb-6 flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1 text-[12px] text-text-muted sm:mb-8 sm:text-[13px]"
      >
        <Link href="/" className="shrink-0 transition-colors-premium hover:text-secondary-500">
          Inicio
        </Link>
        <span className="select-none text-text-muted/40">/</span>
        <Link href={sectionBasePath} className="shrink-0 transition-colors-premium hover:text-secondary-500">
          {sectionLabel}
        </Link>
        <span className="select-none text-text-muted/40">/</span>
        <Link
          href={categoryHref}
          className="min-w-0 max-w-full break-words transition-colors-premium hover:text-secondary-500"
        >
          {product.category.name}
        </Link>
        <span className="select-none text-text-muted/40">/</span>
        <span className="min-w-0 max-w-full break-words font-medium text-text-primary">{product.name}</span>
      </nav>

      <div className="grid min-w-0 gap-8 lg:grid-cols-2 lg:gap-14">
        <div className="flex min-w-0 flex-col gap-3">
          <div className="rounded-[1.5rem] bg-surface-ghost/50 p-1.5 ring-1 ring-black/[0.03]">
            <div className="relative aspect-[4/3] overflow-hidden rounded-[calc(1.5rem-0.375rem)] bg-white">
              <Image
                src={product.images[activeImage]?.url || product.heroImage.url}
                alt={product.images[activeImage]?.alt || product.heroImage.alt}
                fill
                className="object-contain"
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              {hasDiscount && (
                <span className="absolute right-2 top-2 rounded-full bg-red-600 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-elevated sm:right-4 sm:top-4 sm:px-3.5 sm:py-1.5 sm:text-[11px]">
                  Oferta
                </span>
              )}

              {hasGalleryNavigation && (
                <>
                  <button
                    type="button"
                    onClick={goToPreviousImage}
                    aria-label="Imagen anterior"
                    className="absolute left-2 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-text-primary shadow-md ring-1 ring-black/10 transition-premium-fast hover:bg-white sm:left-3 sm:h-10 sm:w-10"
                  >
                    <svg className="h-4 w-4" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                      <path d="M12.5 4.5L7 10l5.5 5.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={goToNextImage}
                    aria-label="Siguiente imagen"
                    className="absolute right-2 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-text-primary shadow-md ring-1 ring-black/10 transition-premium-fast hover:bg-white sm:right-3 sm:h-10 sm:w-10"
                  >
                    <svg className="h-4 w-4" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                      <path d="M7.5 4.5L13 10l-5.5 5.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </>
              )}
            </div>
          </div>

          {hasGalleryNavigation && (
            <div className="-mx-4 flex gap-2 overflow-x-auto overscroll-x-contain px-4 pb-1 [scrollbar-width:none] sm:mx-0 sm:px-0.5 [&::-webkit-scrollbar]:hidden">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => goToImage(i)}
                  className={cn(
                    'relative h-16 w-20 flex-shrink-0 overflow-hidden rounded-xl transition-premium-fast',
                    i === activeImage
                      ? 'ring-2 ring-secondary-500 shadow-sm'
                      : 'opacity-60 ring-1 ring-black/[0.04] hover:opacity-100',
                  )}
                >
                  <Image src={img.url} alt={img.alt} fill className="object-contain" sizes="80px" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex min-w-0 flex-col">
          <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-text-muted">
            Modelo {product.year}
          </span>

          <h1 className="mt-1.5 min-w-0 break-words text-[clamp(1.5rem,5vw,2.5rem)] font-extrabold leading-[1.1] tracking-tight text-text-primary">
            {product.name}
          </h1>

          {product.tagline && (
            <p className="mt-2 min-w-0 break-words text-sm font-medium text-secondary-500">{product.tagline}</p>
          )}

          {product.shortDescription && (
            <p className="mt-3 min-w-0 max-w-2xl break-words text-[15px] leading-relaxed text-text-secondary">
              {product.shortDescription}
            </p>
          )}

          {product.description && product.description !== product.shortDescription && (
            <p className="mt-2 min-w-0 max-w-2xl break-words text-sm leading-relaxed text-text-muted">
              {product.description}
            </p>
          )}

          {product.tags && product.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-1.5">
              {product.tags.map((tag) => (
                <span
                  key={tag}
                  className="max-w-full break-words rounded-full bg-primary-50 px-3 py-1 text-center text-[10px] font-semibold uppercase tracking-[0.12em] text-primary-700 ring-1 ring-primary-200/60"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div className="mt-6">
            {hidePrice ? (
              <>
                <p className="min-w-0 break-words text-[clamp(1.35rem,6vw,2.25rem)] font-extrabold text-text-primary">Consultar precio</p>
                <p className="mt-1 text-[13px] text-text-muted">Precio en punto de venta</p>
              </>
            ) : hasDiscount ? (
              <>
                <div className="flex min-w-0 flex-wrap items-baseline gap-x-3 gap-y-1">
                  <p className="min-w-0 break-words text-[clamp(1.35rem,6vw,2.25rem)] font-extrabold tabular-nums text-red-600">
                    {formatPrice(product.salePrice!, product.currency)}
                  </p>
                  <p className="text-base font-semibold tabular-nums text-text-muted/60 line-through sm:text-lg">
                    {formatPrice(product.price, product.currency)}
                  </p>
                </div>
                <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-red-600/80">
                  Precio de oferta
                </p>
              </>
            ) : (
              <>
                <p className="min-w-0 break-words text-[clamp(1.35rem,6vw,2.25rem)] font-extrabold tabular-nums text-text-primary">
                  {formatPrice(product.price, product.currency)}
                </p>
                <p className="mt-1 text-[13px] text-text-muted">Precio de lista &middot; IVI incluido</p>
              </>
            )}
          </div>

          {!hidePrice && monthlyEstimate && (
            <div className="mt-4 inline-flex max-w-full flex-wrap items-center gap-x-2 gap-y-1 rounded-full bg-secondary-500/10 px-3 py-2 sm:px-4">
              <span className="text-sm font-bold tabular-nums text-secondary-600">
                Desde {formatPrice(monthlyEstimate, product.currency)}/mes
              </span>
              <span className="text-[12px] text-text-muted sm:text-[13px]">
                a {product.financing.termMonths || product.financing.defaultTerm} meses
              </span>
            </div>
          )}

          {product.priceNote && (
            <p className="mt-2.5 min-w-0 break-words text-xs italic text-text-muted">{product.priceNote}</p>
          )}

          {product.keySpecs && product.keySpecs.length > 0 && (
            <div className="mt-7">
              <KeySpecs
                specs={product.keySpecs}
                className="grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 lg:flex-none"
              />
            </div>
          )}

          <div className="mt-7 flex flex-col gap-3">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                dataLayer.push({
                  name: 'whatsapp_click',
                  params: {
                    product_id: product._id,
                    page: productPagePath,
                    position: 'hero',
                  },
                });
              }}
              className="group relative flex min-h-14 w-full flex-wrap items-center justify-center gap-2 rounded-full bg-[#25D366] px-3 py-2.5 text-center text-sm font-bold text-white shadow-md transition-premium hover:-translate-y-0.5 hover:bg-[#1eba59] hover:shadow-lg active:translate-y-0 active:scale-[0.97] sm:min-h-0 sm:flex-nowrap sm:gap-3 sm:py-0 sm:text-[15px]"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/20 transition-premium group-hover:bg-white/30">
                <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.5.5 0 00.611.611l4.458-1.495A11.943 11.943 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.325 0-4.47-.744-6.228-2.01l-.436-.326-2.641.885.885-2.641-.326-.436A9.958 9.958 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
                </svg>
              </span>
              Consultar por WhatsApp
            </a>

            <Link
              href="/cotizador"
              className="flex h-12 w-full items-center justify-center rounded-full bg-primary-500 text-sm font-bold text-white shadow-md transition-premium hover:-translate-y-0.5 hover:bg-primary-400 hover:shadow-glow-primary active:translate-y-0 active:scale-[0.97]"
            >
              Solicitar Cotización
            </Link>
          </div>

          <div className="mt-5 flex flex-wrap gap-2.5">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-ghost/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-text-secondary ring-1 ring-black/[0.04]">
              <svg className="h-3.5 w-3.5 text-primary-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
              Garantía 2 años
            </span>
            {product.financing.eligible && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-ghost/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-text-secondary ring-1 ring-black/[0.04]">
                <svg className="h-3.5 w-3.5 text-secondary-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
                </svg>
                Financiamiento disponible
              </span>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
