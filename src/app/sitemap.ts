import type { MetadataRoute } from 'next';
import { getAllProducts, getAllCategories } from '@/lib/sanity/queries';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://yamahacr.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getAllProducts();
  const categories = await getAllCategories();

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'weekly', priority: 1.0 },
    { url: `${BASE_URL}/motos`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/cuadraciclos`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/marino`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/cotizador`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/cotizadormarino`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/repuestos`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/taller`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/sucursales`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/contacto`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
  ];

  const categoryPages: MetadataRoute.Sitemap = categories.map((cat) => {
    const basePath =
      cat.parentCategory === 'motos'
        ? '/motos'
        : cat.parentCategory === 'cuadraciclos'
          ? '/cuadraciclos'
          : '/marino';

    return {
      url: `${BASE_URL}${basePath}/${cat.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    };
  });

  const productPages: MetadataRoute.Sitemap = products.map((product) => {
    const productUrl =
      product.category.parentCategory === 'motos'
        ? `${BASE_URL}/motos/${product.category.slug}/${product.slug}`
        : product.category.parentCategory === 'cuadraciclos'
          ? `${BASE_URL}/cuadraciclos/${product.slug}`
          : `${BASE_URL}/marino/${product.category.slug}/${product.slug}`;

    return {
      url: productUrl,
      lastModified: new Date(product._updatedAt),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    };
  });

  return [...staticPages, ...categoryPages, ...productPages];
}
