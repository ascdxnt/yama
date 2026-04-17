import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ProductHero, FinancingCalculator, ProductBenefits, FullSpecs, RelatedProducts, NearestDealership } from '@/components/blocks';
import { StickyCtaBar } from '@/components/patterns/sticky-cta-bar';
import { ProductJsonLd } from '@/components/seo/product-json-ld';
import { BreadcrumbJsonLd } from '@/components/seo/breadcrumb-json-ld';
import { getProduct, getRelatedProducts } from '@/lib/sanity/queries';
import { WHATSAPP_NUMBER } from '@/lib/constants';
import { formatPrice } from '@/lib/utils';

interface ProductPageProps {
  params: Promise<{ category: string; slug: string }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return {};

  return {
    title: `${product.name} ${product.year}`,
    description: product.shortDescription,
    openGraph: {
      title: `${product.name} — Desde ${formatPrice(product.salePrice ?? product.price, product.currency)}`,
      description: product.shortDescription,
      images: [{ url: product.heroImage.url, width: 1200, height: 630 }],
      type: 'website',
    },
    alternates: {
      canonical: `https://yamahacr.com/motos/${product.category.slug}/${product.slug}`,
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) notFound();

  const relatedProducts = await getRelatedProducts(product.category.slug, product._id);
  const hasFinancing = product.financing.eligible;
  const hasBenefits = product.benefits.length > 0;
  const hasFullSpecs = product.fullSpecs.length > 0;

  return (
    <>
      <ProductJsonLd product={product} />
      <BreadcrumbJsonLd
        items={[
          { name: 'Inicio', href: '/' },
          { name: 'Motos', href: '/motos' },
          { name: product.category.name, href: `/motos/${product.category.slug}` },
          { name: product.name, href: `/motos/${product.category.slug}/${product.slug}` },
        ]}
      />

      <article className="relative min-w-0 max-w-full overflow-x-clip pb-[calc(5rem+env(safe-area-inset-bottom,0px))] lg:pb-0">
        <ProductHero product={product} />

        {(hasBenefits || hasFullSpecs) && (
          <section className="relative min-w-0 border-t border-surface-subtle">
            <div className="mx-auto min-w-0 max-w-7xl space-y-12 px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
              {hasBenefits && <ProductBenefits benefits={product.benefits} />}
              {hasFullSpecs && <FullSpecs specGroups={product.fullSpecs} />}
            </div>
          </section>
        )}

        {hasFinancing && (
          <section className="min-w-0 bg-surface-ghost">
            <div className="mx-auto min-w-0 max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
              <div className="grid min-w-0 gap-8 lg:grid-cols-5">
                <div className="min-w-0 lg:col-span-3">
                  <div className="min-w-0 overflow-hidden rounded-[1.5rem] border border-surface-subtle bg-white shadow-card">
                    <FinancingCalculator
                      price={product.salePrice ?? product.price}
                      currency={product.currency}
                      defaultDownPayment={product.financing.defaultDownPayment}
                      defaultTerm={product.financing.defaultTerm}
                      productId={product._id}
                    />
                  </div>
                </div>
                <div className="min-w-0 lg:col-span-2">
                  <div className="min-w-0 overflow-hidden rounded-[1.5rem] border border-surface-subtle bg-white shadow-card">
                    <NearestDealership />
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {!hasFinancing && (
          <section className="min-w-0 bg-surface-ghost py-16 sm:py-20 lg:py-24">
            <div className="mx-auto min-w-0 max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="min-w-0 overflow-hidden rounded-[1.5rem] border border-surface-subtle bg-white shadow-card">
                <NearestDealership />
              </div>
            </div>
          </section>
        )}

        {relatedProducts.length > 0 && (
          <section className="min-w-0 py-16 sm:py-20 lg:py-24">
            <div className="mx-auto min-w-0 max-w-7xl px-4 sm:px-6 lg:px-8">
              <RelatedProducts products={relatedProducts} />
            </div>
          </section>
        )}
      </article>

      <StickyCtaBar
        productName={product.name}
        price={product.price}
        salePrice={product.salePrice}
        currency={product.currency}
        productId={product._id}
        whatsappNumber={WHATSAPP_NUMBER}
        hidePrice={product.category.parentCategory === 'marino' && product.category.slug === 'motores-fuera-de-borda'}
      />
    </>
  );
}
