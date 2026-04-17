import type { Currency } from '@/lib/utils';

export interface ProductImage {
  url: string;
  alt: string;
  width: number;
  height: number;
  blurDataUrl?: string;
}

export interface KeySpec {
  icon: string;
  value: string;
  label: string;
}

export interface SpecGroup {
  group: string;
  specs: Array<{ name: string; value: string }>;
}

export interface ProductBenefit {
  type: 'emotional' | 'practical';
  title: string;
  description: string;
}

export interface ProductFinancing {
  eligible: boolean;
  defaultDownPayment: number;
  defaultTerm: number;
  monthlyPayment?: number;
  termMonths?: number;
}

export interface ProductCategory {
  name: string;
  slug: string;
  parentCategory: 'motos' | 'cuadraciclos' | 'marino';
}

export interface Product {
  _id: string;
  _updatedAt: string;
  name: string;
  slug: string;
  year: number;
  category: ProductCategory;
  productType: 'moto' | 'cuadraciclo' | 'waverunner' | 'motor_fuera_borda';
  price: number;
  salePrice?: number;
  currency: Currency;
  formattedPrice: string;
  tags?: string[];
  tagline?: string;
  images: ProductImage[];
  heroImage: ProductImage;
  shortDescription: string;
  description?: string;
  keySpecs: KeySpec[];
  fullSpecs: SpecGroup[];
  benefits: ProductBenefit[];
  financing: ProductFinancing;
  relatedProducts?: Product[];
  status: 'active' | 'coming_soon' | 'discontinued';
  featured: boolean;
  sortOrder: number;
  priceNote?: string;
}

export interface ProductCard {
  _id: string;
  name: string;
  slug: string;
  category: ProductCategory;
  price: number;
  salePrice?: number;
  currency: Currency;
  heroImage: ProductImage;
  keySpecs: KeySpec[];
  tags?: string[];
  status: Product['status'];
}
