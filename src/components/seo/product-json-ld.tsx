import type { Product } from '@/types';

interface ProductJsonLdProps {
  product: Product;
}

export function ProductJsonLd({ product }: ProductJsonLdProps) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: product.images.map((img) => img.url),
    description: product.shortDescription,
    brand: {
      '@type': 'Brand',
      name: 'Yamaha',
    },
    offers: {
      '@type': 'Offer',
      url: `https://yamahacr.com/motos/${product.category.slug}/${product.slug}`,
      priceCurrency: product.currency,
      price: product.salePrice ?? product.price,
      availability:
        product.status === 'active'
          ? 'https://schema.org/InStock'
          : 'https://schema.org/PreOrder',
      seller: {
        '@type': 'Organization',
        name: 'Yamaha Costa Rica',
      },
    },
    ...(product.keySpecs && {
      additionalProperty: product.keySpecs.map((spec) => ({
        '@type': 'PropertyValue',
        name: spec.label,
        value: spec.value,
      })),
    }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
