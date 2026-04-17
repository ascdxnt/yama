import fs from 'node:fs';
import path from 'node:path';
import type { Product, ProductCard } from '@/types';
import { sanityFetch } from './client';

const PRODUCT_IMAGE_FOLDER_OVERRIDES: Record<string, string> = {
  'xmax-300': 'products/motos/scooter/x-max300',
  'fzn150-fi': 'products/motos/urbanas/fzn150-fl',
  'fzn150-4-fi-abs-tcs': 'products/motos/urbanas/fzn150-4.0-fl-abs-tcs',
  'mt-07-yamt': 'products/motos/alta-cilindrada/mt-07-y-amt',
  'mt-09-yamt': 'products/motos/alta-cilindrada/mt-09-y-amt',
  'mt-10-sp': 'products/motos/alta-cilindrada/mt10-sp',
  'tracer-9-gt-plus': 'products/motos/alta-cilindrada/tracer-9-gt+',
  yfz50: 'products/cuadraciclos/cuadraciclos/yfz50',
  raptor110: 'products/cuadraciclos/cuadraciclos/raptor110',
  yfz450r: 'products/cuadraciclos/cuadraciclos/yfz450r',
  'raptor-700r-se': 'products/cuadraciclos/cuadraciclos/raptor-700r-se',
  'kodiak-450-std': 'products/cuadraciclos/cuadraciclos/kodiak-450-std',
  'kodiak-450-eps': 'products/cuadraciclos/cuadraciclos/kodiak-450-eps',
  'grizzly-700-xtr': 'products/cuadraciclos/cuadraciclos/grizzly-700-xtr',
  'wolverine-x4-850-xtr': 'products/cuadraciclos/mulas/wolverine-x4-850-xtr',
  'wolverine-x4-1000-xtr': 'products/cuadraciclos/mulas/wolverine-x4-1000-xtr',
};

const PRODUCT_IMAGE_FALLBACKS: Record<string, string[]> = {
  'fx-cruiser-svho': ['/categories/marino/waverunner/cover.avif', '/categories/home/waverunner/cover.avif'],
  'vx1050-c': ['/categories/home/waverunner/cover.avif', '/categories/marino/waverunner/cover.avif'],
};

const IMAGE_EXTENSIONS = ['avif', 'webp', 'png', 'jpg', 'jpeg'] as const;
const PUBLIC_ROOT = path.join(process.cwd(), 'public');

function resolveLocalFallbackImage(slug: string): string | null {
  const candidates = PRODUCT_IMAGE_FALLBACKS[slug];
  if (!candidates || candidates.length === 0) return null;

  for (const candidate of candidates) {
    const absolute = path.join(PUBLIC_ROOT, candidate.replace(/^\//, ''));
    if (fs.existsSync(absolute)) return candidate;
  }

  return candidates[0] ?? null;
}

function hasGalleryOne(dirAbsolute: string): boolean {
  return IMAGE_EXTENSIONS.some((ext) => fs.existsSync(path.join(dirAbsolute, `gallery-1.${ext}`)));
}

function collectGalleryFolders(currentDirAbsolute: string, relativeFromPublic: string, out: Map<string, string>) {
  const entries = fs.readdirSync(currentDirAbsolute, { withFileTypes: true });

  if (hasGalleryOne(currentDirAbsolute)) {
    const folderName = path.basename(currentDirAbsolute).toLowerCase();
    if (!out.has(folderName)) {
      out.set(folderName, relativeFromPublic.replace(/\\/g, '/'));
    }
    return;
  }

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    collectGalleryFolders(path.join(currentDirAbsolute, entry.name), path.join(relativeFromPublic, entry.name), out);
  }
}

function buildGalleryFolderIndex(): Map<string, string> {
  const productsRoot = path.join(PUBLIC_ROOT, 'products');
  const index = new Map<string, string>();

  if (!fs.existsSync(productsRoot)) return index;
  collectGalleryFolders(productsRoot, 'products', index);
  return index;
}

const GALLERY_FOLDER_INDEX = buildGalleryFolderIndex();

function findGalleryDirRuntime(currentDirAbsolute: string, relativeFromPublic: string, slug: string): string | null {
  let entries: fs.Dirent[] = [];
  try {
    entries = fs.readdirSync(currentDirAbsolute, { withFileTypes: true });
  } catch {
    return null;
  }

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;

    const childAbsolute = path.join(currentDirAbsolute, entry.name);
    const childRelative = path.join(relativeFromPublic, entry.name);

    if (entry.name.toLowerCase() === slug.toLowerCase() && hasGalleryOne(childAbsolute)) {
      return childRelative.replace(/\\/g, '/');
    }

    const found = findGalleryDirRuntime(childAbsolute, childRelative, slug);
    if (found) return found;
  }

  return null;
}

function resolveProductGalleryDir(slug: string): string | null {
  const override = PRODUCT_IMAGE_FOLDER_OVERRIDES[slug];
  if (override) return override;

  const fromIndex = GALLERY_FOLDER_INDEX.get(slug.toLowerCase()) ?? null;
  if (fromIndex) {
    const absolute = path.join(PUBLIC_ROOT, fromIndex);
    if (hasGalleryOne(absolute)) return fromIndex;
  }

  const productsRoot = path.join(PUBLIC_ROOT, 'products');
  if (!fs.existsSync(productsRoot)) return null;
  return findGalleryDirRuntime(productsRoot, 'products', slug);
}

function findGalleryImageUrl(relativeDir: string, index: number): string | null {
  for (const ext of IMAGE_EXTENSIONS) {
    const filename = `gallery-${index}.${ext}`;
    const absolutePath = path.join(PUBLIC_ROOT, relativeDir, filename);
    if (fs.existsSync(absolutePath)) {
      return `/${relativeDir}/${filename}`.replace(/\\/g, '/');
    }
  }
  return null;
}

function getGalleryImages(model: string, slug: string) {
  const galleryDir = resolveProductGalleryDir(slug);
  if (!galleryDir) return null;

  const images = [];
  for (let i = 1; i <= 40; i += 1) {
    const url = findGalleryImageUrl(galleryDir, i);
    if (!url) break;
    images.push({
      url,
      alt: `Yamaha ${model} — foto ${i}`,
      width: 800,
      height: 600,
    });
  }

  return images.length > 0 ? images : null;
}

function img(model: string, slug: string) {
  const detected = getGalleryImages(model, slug);
  if (detected) {
    return {
      ...detected[0],
      alt: `Yamaha ${model}`,
    };
  }

  const fallbackBySlug = resolveLocalFallbackImage(slug);
  if (fallbackBySlug) {
    return {
      url: fallbackBySlug,
      alt: `Yamaha ${model}`,
      width: 800,
      height: 600,
    };
  }

  return {
    url: '/images/placeholder-product.avif',
    alt: `Yamaha ${model}`,
    width: 800,
    height: 600,
  };
}

function imgs(model: string, slug: string) {
  const detected = getGalleryImages(model, slug);
  if (detected) return detected;
  const i = img(model, slug);
  return [i];
}

const PRODUCTS: Product[] = [
  // ─────────────────────────────────────────────
  // SCOOTER
  // ─────────────────────────────────────────────
  {
    _id: 'ray-zr',
    _updatedAt: '2026-01-15T00:00:00.000Z',
    name: 'Ray-ZR',
    slug: 'ray-zr',
    year: 2026,
    category: { name: 'Scooter', slug: 'scooter', parentCategory: 'motos' },
    productType: 'moto',
    price: 1195000,
    currency: 'CRC',
    formattedPrice: '₡1.195.000',
    tags: ['BlueCore'],
    tagline: 'Ray-ZR con tecnología BlueCore',
    images: imgs('Ray-ZR', 'ray-zr'),
    heroImage: img('Ray-ZR', 'ray-zr'),
    shortDescription: 'Scooter ágil y eficiente con tecnología BlueCore. La opción perfecta para moverse por la ciudad con estilo.',
    description: 'El Ray-ZR de Yamaha combina tecnología BlueCore con un diseño deportivo y compacto, ideal para el tránsito urbano diario. Su motor carburado de 113cc ofrece un excelente rendimiento de combustible sin sacrificar potencia.',
    keySpecs: [
      { icon: 'engine', value: '113cc', label: 'Motor' },
      { icon: 'power', value: '7.1 HP', label: 'Potencia' },
      { icon: 'weight', value: '104 kg', label: 'Peso' },
      { icon: 'transmission', value: 'Automática', label: 'Transmisión' },
    ],
    fullSpecs: [
      {
        group: 'Motor',
        specs: [
          { name: 'Tipo', value: 'Carburado, SOHC, enfriado por aire, 2 válvulas' },
          { name: 'Cilindrada', value: '113 cc' },
          { name: 'Potencia máxima', value: '7.1 HP' },
          { name: 'Arranque', value: 'Eléctrico y pedal' },
          { name: 'Transmisión', value: 'Automática' },
        ],
      },
      {
        group: 'Chasis / Suspensión',
        specs: [
          { name: 'Suspensión delantera', value: 'Telescópica' },
          { name: 'Suspensión trasera', value: 'Compensador' },
          { name: 'Llanta delantera', value: '90/100-10' },
          { name: 'Llanta trasera', value: '90/100-10' },
        ],
      },
      {
        group: 'Frenos',
        specs: [
          { name: 'Freno delantero', value: 'Disco' },
          { name: 'Freno trasero', value: 'Tambor' },
        ],
      },
      {
        group: 'Dimensiones',
        specs: [
          { name: 'Peso', value: '104 kg' },
        ],
      },
    ],
    benefits: [
      { type: 'practical', title: 'Tecnología BlueCore', description: 'Motor eficiente que maximiza la potencia y minimiza el consumo de combustible.' },
      { type: 'emotional', title: 'Libertad urbana', description: 'Compacto y ágil, perfecto para moverte por la ciudad sin estrés.' },
      { type: 'practical', title: 'Doble arranque', description: 'Arranque eléctrico y pedal para mayor confiabilidad en cualquier situación.' },
    ],
    financing: { eligible: true, defaultDownPayment: 20, defaultTerm: 60, monthlyPayment: 35000, termMonths: 60 },
    status: 'active',
    featured: false,
    sortOrder: 1,
  },
  {
    _id: 'nmax',
    _updatedAt: '2026-01-15T00:00:00.000Z',
    name: 'NMAX',
    slug: 'nmax',
    year: 2024,
    category: { name: 'Scooter', slug: 'scooter', parentCategory: 'motos' },
    productType: 'moto',
    price: 2950000,
    salePrice: 2850000,
    currency: 'CRC',
    formattedPrice: '₡2.950.000',
    tags: ['ABS', 'Conectividad'],
    tagline: 'La visión de Yamaha de una nueva movilidad',
    images: imgs('NMAX', 'nmax'),
    heroImage: img('NMAX', 'nmax'),
    shortDescription: 'El scooter premium de Yamaha con ABS, conectividad y motor de 155cc refrigerado por líquido. Tecnología y confort al máximo nivel.',
    description: 'El NMAX redefine la movilidad urbana con su motor inyectado de 155cc refrigerado por líquido, sistema ABS de serie y conectividad Bluetooth. Su diseño aerodinámico y espacio de almacenamiento generoso lo convierten en el compañero ideal para el día a día.',
    keySpecs: [
      { icon: 'engine', value: '155cc', label: 'Motor' },
      { icon: 'power', value: '15.15 HP', label: 'Potencia' },
      { icon: 'weight', value: '131 kg', label: 'Peso' },
      { icon: 'transmission', value: 'Automática', label: 'Transmisión' },
    ],
    fullSpecs: [
      {
        group: 'Motor',
        specs: [
          { name: 'Tipo', value: 'Inyectado, 4 válvulas, monocilíndrico, enfriado por líquido, SOHC' },
          { name: 'Cilindrada', value: '155 cc' },
          { name: 'Potencia máxima', value: '15.15 HP' },
          { name: 'Arranque', value: 'Eléctrico' },
          { name: 'Transmisión', value: 'Automática' },
        ],
      },
      {
        group: 'Chasis / Suspensión',
        specs: [
          { name: 'Suspensión delantera', value: 'Horquilla telescópica' },
          { name: 'Suspensión trasera', value: 'Monoamortiguador' },
          { name: 'Llanta delantera', value: '110/70-13' },
          { name: 'Llanta trasera', value: '130/70-13' },
        ],
      },
      {
        group: 'Frenos',
        specs: [
          { name: 'Freno delantero', value: 'Disco con ABS' },
          { name: 'Freno trasero', value: 'Disco con ABS' },
        ],
      },
      {
        group: 'Dimensiones',
        specs: [
          { name: 'Peso', value: '131 kg' },
        ],
      },
    ],
    benefits: [
      { type: 'emotional', title: 'Conectividad total', description: 'Conectá tu smartphone y accedé a información del vehículo en tiempo real.' },
      { type: 'practical', title: 'Seguridad ABS', description: 'Sistema de frenos antibloqueo para mayor confianza en cualquier condición.' },
      { type: 'practical', title: 'Motor eficiente', description: 'Motor inyectado de 4 válvulas refrigerado por líquido para máxima eficiencia.' },
      { type: 'emotional', title: 'Diseño premium', description: 'Líneas aerodinámicas y acabados de alta calidad que destacan en la ciudad.' },
    ],
    financing: { eligible: true, defaultDownPayment: 20, defaultTerm: 60, monthlyPayment: 79000, termMonths: 60 },
    status: 'active',
    featured: true,
    sortOrder: 2,
  },
  {
    _id: 'xmax-300',
    _updatedAt: '2026-01-15T00:00:00.000Z',
    name: 'X-MAX 300',
    slug: 'xmax-300',
    year: 2026,
    category: { name: 'Scooter', slug: 'scooter', parentCategory: 'motos' },
    productType: 'moto',
    price: 4190000,
    currency: 'CRC',
    formattedPrice: '₡4.190.000',
    tags: ['ABS', 'TCS'],
    tagline: 'El maxi-scooter con actitud deportiva',
    images: imgs('X-MAX 300', 'xmax-300'),
    heroImage: img('X-MAX 300', 'xmax-300'),
    shortDescription: 'Maxi-scooter de 292cc con ABS y control de tracción. Potencia y estabilidad para viajes largos y ciudad.',
    description: 'El X-MAX 300 ofrece lo mejor de ambos mundos: la comodidad de un maxi-scooter y el rendimiento de una moto deportiva. Con motor de 292cc inyectado, ABS, TCS y una posición de manejo relajada, es perfecto tanto para el trayecto diario como para escapadas de fin de semana.',
    keySpecs: [
      { icon: 'engine', value: '292cc', label: 'Motor' },
      { icon: 'power', value: '28 HP', label: 'Potencia' },
      { icon: 'weight', value: '179 kg', label: 'Peso' },
      { icon: 'transmission', value: 'Automática', label: 'Transmisión' },
    ],
    fullSpecs: [
      {
        group: 'Motor',
        specs: [
          { name: 'Tipo', value: 'Inyectado, 4 válvulas, monocilíndrico, enfriado por líquido, SOHC' },
          { name: 'Cilindrada', value: '292 cc' },
          { name: 'Potencia máxima', value: '28 HP' },
          { name: 'Arranque', value: 'Eléctrico' },
          { name: 'Transmisión', value: 'Automática' },
        ],
      },
      {
        group: 'Chasis / Suspensión',
        specs: [
          { name: 'Suspensión delantera', value: 'Horquilla telescópica' },
          { name: 'Suspensión trasera', value: 'Monoamortiguador' },
          { name: 'Llanta delantera', value: '120/70-15' },
          { name: 'Llanta trasera', value: '140/70-14' },
        ],
      },
      {
        group: 'Frenos',
        specs: [
          { name: 'Freno delantero', value: 'Disco 267mm con ABS y TCS' },
          { name: 'Freno trasero', value: 'Disco 245mm con ABS y TCS' },
        ],
      },
      {
        group: 'Dimensiones',
        specs: [
          { name: 'Peso', value: '179 kg' },
        ],
      },
    ],
    benefits: [
      { type: 'emotional', title: 'Presencia imponente', description: 'Diseño maxi-scooter que impone respeto en la carretera.' },
      { type: 'practical', title: 'Doble seguridad', description: 'ABS y control de tracción (TCS) para máxima seguridad en todo momento.' },
      { type: 'practical', title: 'Potencia generosa', description: '292cc que aseguran adelantamientos seguros y crucero en autopista.' },
      { type: 'emotional', title: 'Confort superior', description: 'Asiento amplio y posición relajada para viajes largos sin fatiga.' },
    ],
    financing: { eligible: true, defaultDownPayment: 20, defaultTerm: 60, monthlyPayment: 115000, termMonths: 60 },
    status: 'active',
    featured: false,
    sortOrder: 3,
  },

  // ─────────────────────────────────────────────
  // URBANAS / STREET
  // ─────────────────────────────────────────────
  {
    _id: 'crux-rev',
    _updatedAt: '2026-01-15T00:00:00.000Z',
    name: 'Crux-REV',
    slug: 'crux-rev',
    year: 2026,
    category: { name: 'Urbanas / Street', slug: 'urbanas', parentCategory: 'motos' },
    productType: 'moto',
    price: 935000,
    currency: 'CRC',
    formattedPrice: '₡935.000',
    tags: ['BlueCore'],
    tagline: 'Eficiencia BlueCore al mejor precio',
    images: imgs('Crux-REV', 'crux-rev'),
    heroImage: img('Crux-REV', 'crux-rev'),
    shortDescription: 'La moto urbana más accesible de Yamaha con tecnología BlueCore. Económica, confiable y perfecta para el día a día.',
    description: 'La Crux-REV es la entrada perfecta al mundo Yamaha. Con motor 4T BlueCore de 110cc, ofrece un consumo mínimo de combustible y mantenimiento accesible, sin renunciar a la calidad y confiabilidad Yamaha.',
    keySpecs: [
      { icon: 'engine', value: '110cc', label: 'Motor' },
      { icon: 'power', value: '7.5 HP', label: 'Potencia' },
      { icon: 'weight', value: '97 kg', label: 'Peso' },
      { icon: 'transmission', value: 'Pedal y Eléctrico', label: 'Arranque' },
    ],
    fullSpecs: [
      {
        group: 'Motor',
        specs: [
          { name: 'Tipo', value: '4T carburado BlueCore' },
          { name: 'Cilindrada', value: '110 cc' },
          { name: 'Potencia máxima', value: '7.5 HP' },
          { name: 'Arranque', value: 'Pedal y Eléctrico' },
        ],
      },
      {
        group: 'Chasis / Suspensión',
        specs: [
          { name: 'Suspensión delantera', value: 'Telescópica' },
          { name: 'Suspensión trasera', value: 'Doble compensador' },
          { name: 'Llanta delantera', value: '2.75x17' },
          { name: 'Llanta trasera', value: '3.00x17' },
        ],
      },
      {
        group: 'Frenos',
        specs: [
          { name: 'Freno delantero', value: 'Tambor' },
          { name: 'Freno trasero', value: 'Tambor' },
        ],
      },
      {
        group: 'Dimensiones',
        specs: [
          { name: 'Peso', value: '97 kg' },
        ],
      },
    ],
    benefits: [
      { type: 'practical', title: 'Máxima economía', description: 'Motor BlueCore con el menor consumo de combustible de su clase.' },
      { type: 'emotional', title: 'Tu primera Yamaha', description: 'La forma más accesible de experimentar la calidad y confiabilidad Yamaha.' },
      { type: 'practical', title: 'Mantenimiento mínimo', description: 'Componentes duraderos y repuestos accesibles en todo el país.' },
    ],
    financing: { eligible: true, defaultDownPayment: 20, defaultTerm: 60, monthlyPayment: 28000, termMonths: 60 },
    status: 'active',
    featured: false,
    sortOrder: 1,
  },
  {
    _id: 'ys125-ed',
    _updatedAt: '2026-01-15T00:00:00.000Z',
    name: 'YS125-ED',
    slug: 'ys125-ed',
    year: 2026,
    category: { name: 'Urbanas / Street', slug: 'urbanas', parentCategory: 'motos' },
    productType: 'moto',
    price: 1365000,
    currency: 'CRC',
    formattedPrice: '₡1.365.000',
    tags: ['Llanta Tubular'],
    tagline: 'Confiabilidad probada para el trabajo diario',
    images: imgs('YS125-ED', 'ys125-ed'),
    heroImage: img('YS125-ED', 'ys125-ed'),
    shortDescription: 'Moto de trabajo confiable con motor 4T de 123cc. Robusta, económica y con llantas tubulares para cualquier terreno.',
    description: 'La YS125-ED es la moto de trabajo por excelencia. Su motor carburado de 123cc ofrece potencia suficiente para el día a día, mientras que sus llantas tubulares y su chasis robusto garantizan durabilidad en cualquier condición.',
    keySpecs: [
      { icon: 'engine', value: '123cc', label: 'Motor' },
      { icon: 'power', value: '9.9 HP', label: 'Potencia' },
      { icon: 'weight', value: '121 kg', label: 'Peso' },
      { icon: 'transmission', value: 'Eléctrico y Pedal', label: 'Arranque' },
    ],
    fullSpecs: [
      {
        group: 'Motor',
        specs: [
          { name: 'Tipo', value: '4T carburado' },
          { name: 'Cilindrada', value: '123 cc' },
          { name: 'Potencia máxima', value: '9.9 HP' },
          { name: 'Arranque', value: 'Eléctrico y Pedal' },
        ],
      },
      {
        group: 'Chasis / Suspensión',
        specs: [
          { name: 'Suspensión delantera', value: 'Telescópica' },
          { name: 'Suspensión trasera', value: 'Doble compensador' },
          { name: 'Llanta delantera', value: '2.75-18' },
          { name: 'Llanta trasera', value: '90/90-18' },
        ],
      },
      {
        group: 'Frenos',
        specs: [
          { name: 'Freno delantero', value: 'Tambor' },
          { name: 'Freno trasero', value: 'Tambor' },
        ],
      },
      {
        group: 'Dimensiones',
        specs: [
          { name: 'Peso', value: '121 kg' },
        ],
      },
    ],
    benefits: [
      { type: 'practical', title: 'Llantas tubulares', description: 'Mayor resistencia a pinchazos y reparación sencilla en cualquier lugar.' },
      { type: 'emotional', title: 'Compañera de trabajo', description: 'Diseñada para el uso diario intenso sin comprometer la confiabilidad.' },
      { type: 'practical', title: 'Bajo consumo', description: 'Motor 4T eficiente que maximiza cada litro de combustible.' },
    ],
    financing: { eligible: true, defaultDownPayment: 20, defaultTerm: 60, monthlyPayment: 39000, termMonths: 60 },
    status: 'active',
    featured: false,
    sortOrder: 2,
  },
  {
    _id: 'fzn150-fi',
    _updatedAt: '2026-01-15T00:00:00.000Z',
    name: 'FZN150 FI',
    slug: 'fzn150-fi',
    year: 2026,
    category: { name: 'Urbanas / Street', slug: 'urbanas', parentCategory: 'motos' },
    productType: 'moto',
    price: 1750000,
    currency: 'CRC',
    formattedPrice: '₡1.750.000',
    tags: ['FI', 'BlueCore'],
    tagline: 'Inyección y BlueCore en diseño urbano',
    images: imgs('FZN150 FI', 'fzn150-fi'),
    heroImage: img('FZN150 FI', 'fzn150-fi'),
    shortDescription: 'Naked urbana con inyección electrónica y tecnología BlueCore. 149cc de eficiencia y estilo deportivo.',
    description: 'La FZN150 FI combina la eficiencia del sistema de inyección electrónica con la tecnología BlueCore de Yamaha. Su diseño naked agresivo, suspensión mono-cross y llanta trasera ancha le dan un carácter deportivo único en su segmento.',
    keySpecs: [
      { icon: 'engine', value: '149cc', label: 'Motor' },
      { icon: 'power', value: '13 HP', label: 'Potencia' },
      { icon: 'weight', value: '132 kg', label: 'Peso' },
      { icon: 'transmission', value: 'Eléctrico', label: 'Arranque' },
    ],
    fullSpecs: [
      {
        group: 'Motor',
        specs: [
          { name: 'Tipo', value: 'Inyectado, SOHC, enfriado por aire, 2 válvulas' },
          { name: 'Cilindrada', value: '149 cc' },
          { name: 'Potencia máxima', value: '13 HP' },
          { name: 'Arranque', value: 'Eléctrico' },
        ],
      },
      {
        group: 'Chasis / Suspensión',
        specs: [
          { name: 'Suspensión delantera', value: 'Telescópica' },
          { name: 'Suspensión trasera', value: 'Mono-cross' },
          { name: 'Llanta delantera', value: '100/80-17' },
          { name: 'Llanta trasera', value: '140/60 R17' },
        ],
      },
      {
        group: 'Frenos',
        specs: [
          { name: 'Freno delantero', value: 'Disco' },
          { name: 'Freno trasero', value: 'Tambor' },
        ],
      },
      {
        group: 'Dimensiones',
        specs: [
          { name: 'Peso', value: '132 kg' },
        ],
      },
    ],
    benefits: [
      { type: 'practical', title: 'Inyección electrónica', description: 'Respuesta inmediata del acelerador y consumo optimizado en todo momento.' },
      { type: 'emotional', title: 'Estilo naked', description: 'Diseño agresivo inspirado en las MT de alta cilindrada.' },
      { type: 'practical', title: 'Suspensión mono-cross', description: 'Mayor estabilidad y confort superior al de la competencia.' },
    ],
    financing: { eligible: true, defaultDownPayment: 20, defaultTerm: 60, monthlyPayment: 50000, termMonths: 60 },
    status: 'active',
    featured: false,
    sortOrder: 3,
  },
  {
    _id: 'fzn150-4-fi-abs-tcs',
    _updatedAt: '2026-01-15T00:00:00.000Z',
    name: 'FZN150 4.0 FI ABS TCS',
    slug: 'fzn150-4-fi-abs-tcs',
    year: 2026,
    category: { name: 'Urbanas / Street', slug: 'urbanas', parentCategory: 'motos' },
    productType: 'moto',
    price: 1860000,
    currency: 'CRC',
    formattedPrice: '₡1.860.000',
    tags: ['FI', 'ABS', 'TCS', 'Y-Connect'],
    tagline: 'La FZ más equipada con ABS, TCS y conectividad',
    images: imgs('FZN150 4.0 FI ABS TCS', 'fzn150-4-fi-abs-tcs'),
    heroImage: img('FZN150 4.0 FI ABS TCS', 'fzn150-4-fi-abs-tcs'),
    shortDescription: 'La versión tope de línea con ABS, control de tracción, inyección y conectividad Y-Connect. Seguridad y tecnología en 149cc.',
    description: 'La FZN150 4.0 lleva la seguridad al siguiente nivel con ABS, TCS y conectividad Y-Connect. Motor BlueCore inyectado de 149cc, llantas tubulares y un equipamiento que no tiene rival en su segmento.',
    keySpecs: [
      { icon: 'engine', value: '149cc', label: 'Motor' },
      { icon: 'power', value: '13 HP', label: 'Potencia' },
      { icon: 'weight', value: '136 kg', label: 'Peso' },
      { icon: 'transmission', value: 'Eléctrico', label: 'Arranque' },
    ],
    fullSpecs: [
      {
        group: 'Motor',
        specs: [
          { name: 'Tipo', value: 'Inyectado, SOHC, enfriado por aire, 2 válvulas, Blue Core' },
          { name: 'Cilindrada', value: '149 cc' },
          { name: 'Potencia máxima', value: '13 HP' },
          { name: 'Arranque', value: 'Eléctrico' },
        ],
      },
      {
        group: 'Chasis / Suspensión',
        specs: [
          { name: 'Suspensión delantera', value: 'Telescópica' },
          { name: 'Suspensión trasera', value: 'Monocompensador' },
          { name: 'Llanta delantera', value: '100/80-17 tubular' },
          { name: 'Llanta trasera', value: '140/60 R17 tubular' },
        ],
      },
      {
        group: 'Frenos',
        specs: [
          { name: 'Freno delantero', value: 'Disco con ABS' },
          { name: 'Freno trasero', value: 'Disco' },
        ],
      },
      {
        group: 'Dimensiones',
        specs: [
          { name: 'Peso', value: '136 kg' },
        ],
      },
    ],
    benefits: [
      { type: 'practical', title: 'ABS + TCS', description: 'Doble sistema de seguridad activa para frenado y tracción en cualquier condición.' },
      { type: 'emotional', title: 'Conectividad Y-Connect', description: 'Conectá tu smartphone y recibí notificaciones, navegación y más desde el panel.' },
      { type: 'practical', title: 'Llantas tubulares', description: 'Mayor resistencia y durabilidad para el uso urbano diario.' },
    ],
    financing: { eligible: true, defaultDownPayment: 20, defaultTerm: 60, monthlyPayment: 53000, termMonths: 60 },
    status: 'active',
    featured: false,
    sortOrder: 4,
  },
  {
    _id: 'fz-250-fi',
    _updatedAt: '2026-01-15T00:00:00.000Z',
    name: 'FZ 250 FI',
    slug: 'fz-250-fi',
    year: 2026,
    category: { name: 'Urbanas / Street', slug: 'urbanas', parentCategory: 'motos' },
    productType: 'moto',
    price: 2450000,
    salePrice: 2350000,
    currency: 'CRC',
    formattedPrice: '₡2.450.000',
    tags: ['Y-Connect', 'BlueCore'],
    tagline: 'El naked de cuarto litro con alma BlueCore',
    images: imgs('FZ 250 FI', 'fz-250-fi'),
    heroImage: img('FZ 250 FI', 'fz-250-fi'),
    shortDescription: 'Naked de 249cc con inyección, ABS, conectividad Y-Connect y motor BlueCore. La combinación perfecta de potencia y tecnología.',
    description: 'La FZ 250 FI es la naked ideal para quienes buscan más potencia sin sacrificar la eficiencia. Motor monocilíndrico BlueCore de 249cc con inyección electrónica, frenos ABS de doble disco y conectividad Y-Connect para una experiencia completa.',
    keySpecs: [
      { icon: 'engine', value: '249cc', label: 'Motor' },
      { icon: 'power', value: '21 HP', label: 'Potencia' },
      { icon: 'weight', value: '151 kg', label: 'Peso' },
      { icon: 'transmission', value: '5 velocidades', label: 'Transmisión' },
    ],
    fullSpecs: [
      {
        group: 'Motor',
        specs: [
          { name: 'Tipo', value: 'Inyección electrónica, monocilíndrico, 2 válvulas, SOHC, aire y aceite, Blue Core' },
          { name: 'Cilindrada', value: '249 cc' },
          { name: 'Potencia máxima', value: '21 HP' },
          { name: 'Arranque', value: 'Eléctrico' },
          { name: 'Transmisión', value: '5 velocidades' },
        ],
      },
      {
        group: 'Chasis / Suspensión',
        specs: [
          { name: 'Llanta delantera', value: '100/80-17' },
          { name: 'Llanta trasera', value: '140/70-17' },
        ],
      },
      {
        group: 'Frenos',
        specs: [
          { name: 'Freno delantero', value: 'Disco ABS 282mm' },
          { name: 'Freno trasero', value: 'Disco ABS 220mm' },
        ],
      },
      {
        group: 'Dimensiones',
        specs: [
          { name: 'Peso', value: '151 kg' },
        ],
      },
    ],
    benefits: [
      { type: 'practical', title: 'ABS de doble disco', description: 'Frenado con confianza total gracias a discos de 282mm y 220mm con ABS.' },
      { type: 'emotional', title: 'Conectividad Y-Connect', description: 'Mantené el control con notificaciones y datos del vehículo en tu smartphone.' },
      { type: 'practical', title: 'Motor BlueCore', description: 'Tecnología de eficiencia que reduce consumo y emisiones sin perder potencia.' },
      { type: 'emotional', title: 'ADN de las MT', description: 'Diseño naked agresivo heredado de la familia MT de Yamaha.' },
    ],
    financing: { eligible: true, defaultDownPayment: 20, defaultTerm: 60, monthlyPayment: 66000, termMonths: 60 },
    status: 'active',
    featured: true,
    sortOrder: 5,
  },
  {
    _id: 'mt-15-fi',
    _updatedAt: '2026-01-15T00:00:00.000Z',
    name: 'MT-15 FI',
    slug: 'mt-15-fi',
    year: 2025,
    category: { name: 'Urbanas / Street', slug: 'urbanas', parentCategory: 'motos' },
    productType: 'moto',
    price: 2850000,
    salePrice: 2590000,
    currency: 'CRC',
    formattedPrice: '₡2.850.000',
    tags: ['FI', 'DeltaBox'],
    tagline: 'El Dark Side en su forma más pura',
    images: imgs('MT-15 FI', 'mt-15-fi'),
    heroImage: img('MT-15 FI', 'mt-15-fi'),
    shortDescription: 'La MT más compacta con chasis DeltaBox, suspensión invertida y motor líquido de 155cc. El ADN hyper naked de Yamaha.',
    description: 'La MT-15 trae el espíritu de la familia MT a un formato compacto y accesible. Chasis DeltaBox, suspensión invertida, motor de 155cc refrigerado por líquido con 4 válvulas y un diseño que intimida. La verdadera experiencia naked.',
    keySpecs: [
      { icon: 'engine', value: '155cc', label: 'Motor' },
      { icon: 'power', value: '19 HP', label: 'Potencia' },
      { icon: 'weight', value: '133 kg', label: 'Peso' },
      { icon: 'transmission', value: '6 velocidades', label: 'Transmisión' },
    ],
    fullSpecs: [
      {
        group: 'Motor',
        specs: [
          { name: 'Tipo', value: 'Inyectado, SOHC, refrigerado por líquido, 4 válvulas' },
          { name: 'Cilindrada', value: '155 cc' },
          { name: 'Potencia máxima', value: '19 HP' },
          { name: 'Arranque', value: 'Eléctrico' },
          { name: 'Transmisión', value: '6 velocidades' },
        ],
      },
      {
        group: 'Chasis / Suspensión',
        specs: [
          { name: 'Chasis', value: 'DeltaBox' },
          { name: 'Suspensión delantera', value: 'Invertidas' },
          { name: 'Suspensión trasera', value: 'Mono-cross' },
          { name: 'Llanta delantera', value: '110/70-17 tubular' },
          { name: 'Llanta trasera', value: '140/70-17 tubular' },
        ],
      },
      {
        group: 'Frenos',
        specs: [
          { name: 'Freno delantero', value: 'Disco' },
          { name: 'Freno trasero', value: 'Disco' },
        ],
      },
      {
        group: 'Dimensiones',
        specs: [
          { name: 'Peso', value: '133 kg' },
        ],
      },
    ],
    benefits: [
      { type: 'emotional', title: 'ADN Hyper Naked', description: 'El diseño icónico de la familia MT que impone presencia en la calle.' },
      { type: 'practical', title: 'Chasis DeltaBox', description: 'La misma tecnología de chasis de las YZF-R para máxima rigidez y agilidad.' },
      { type: 'practical', title: 'Suspensión invertida', description: 'Mayor estabilidad y precisión en curvas, tecnología de motos de mayor categoría.' },
      { type: 'emotional', title: 'Motor líquido 4V', description: 'Rendimiento superior con la suavidad de la refrigeración líquida.' },
    ],
    financing: { eligible: true, defaultDownPayment: 20, defaultTerm: 60, monthlyPayment: 72000, termMonths: 60 },
    priceNote: 'Precio válido para modelo 2025, hasta agotar existencias.',
    status: 'active',
    featured: true,
    sortOrder: 6,
  },
  {
    _id: 'mt-03-fi',
    _updatedAt: '2026-01-15T00:00:00.000Z',
    name: 'MT-03 FI',
    slug: 'mt-03-fi',
    year: 2026,
    category: { name: 'Urbanas / Street', slug: 'urbanas', parentCategory: 'motos' },
    productType: 'moto',
    price: 4495000,
    salePrice: 3895000,
    currency: 'CRC',
    formattedPrice: '₡4.495.000',
    tags: ['FI', 'ABS'],
    tagline: 'El siguiente nivel del Dark Side',
    images: imgs('MT-03 FI', 'mt-03-fi'),
    heroImage: img('MT-03 FI', 'mt-03-fi'),
    shortDescription: 'Bicilíndrica de 321cc con 42hp, ABS y diseño hyper naked. La puerta de entrada al mundo de media cilindrada.',
    description: 'La MT-03 lleva la experiencia hyper naked a 321cc con un motor bicilíndrico DOHC de 4 válvulas que entrega 42hp. Frenos ABS de doble disco, llantas tubulares y un carácter que supera su cilindrada. El paso natural hacia las grandes MT.',
    keySpecs: [
      { icon: 'engine', value: '321cc', label: 'Motor' },
      { icon: 'power', value: '42 HP', label: 'Potencia' },
      { icon: 'weight', value: '168 kg', label: 'Peso' },
      { icon: 'transmission', value: '6 velocidades', label: 'Transmisión' },
    ],
    fullSpecs: [
      {
        group: 'Motor',
        specs: [
          { name: 'Tipo', value: 'Inyección electrónica, bi-cilíndrico, 4 válvulas, DOHC, refrigerado por líquido' },
          { name: 'Cilindrada', value: '321 cc' },
          { name: 'Potencia máxima', value: '42 HP' },
          { name: 'Arranque', value: 'Eléctrico' },
          { name: 'Transmisión', value: '6 velocidades' },
        ],
      },
      {
        group: 'Chasis / Suspensión',
        specs: [
          { name: 'Llanta delantera', value: '110/70-17 M-C tubular' },
          { name: 'Llanta trasera', value: '140/70-17 M-C tubular' },
        ],
      },
      {
        group: 'Frenos',
        specs: [
          { name: 'Freno delantero', value: 'Disco ABS 298mm' },
          { name: 'Freno trasero', value: 'Disco ABS 220mm' },
        ],
      },
      {
        group: 'Dimensiones',
        specs: [
          { name: 'Peso', value: '168 kg' },
        ],
      },
    ],
    benefits: [
      { type: 'emotional', title: 'Motor bicilíndrico', description: 'El carácter y la entrega de potencia que solo un motor twin puede ofrecer.' },
      { type: 'practical', title: 'ABS de serie', description: 'Seguridad activa con frenos antibloqueo en ambas ruedas para máxima confianza.' },
      { type: 'emotional', title: 'Presencia MT', description: 'El diseño hyper naked más agresivo de su segmento que no pasa desapercibido.' },
      { type: 'practical', title: '42 HP reales', description: 'Potencia suficiente para ciudad y carretera con total versatilidad.' },
    ],
    financing: { eligible: true, defaultDownPayment: 20, defaultTerm: 60, monthlyPayment: 107000, termMonths: 60 },
    status: 'active',
    featured: true,
    sortOrder: 7,
  },
  {
    _id: 'yzf-r3-fi',
    _updatedAt: '2026-01-15T00:00:00.000Z',
    name: 'YZF-R3 FI',
    slug: 'yzf-r3-fi',
    year: 2026,
    category: { name: 'Urbanas / Street', slug: 'urbanas', parentCategory: 'motos' },
    productType: 'moto',
    price: 4490000,
    salePrice: 3990000,
    currency: 'CRC',
    formattedPrice: '₡4.490.000',
    tags: ['FI', 'ABS'],
    tagline: 'ADN de competición para la calle',
    images: imgs('YZF-R3 FI', 'yzf-r3-fi'),
    heroImage: img('YZF-R3 FI', 'yzf-r3-fi'),
    shortDescription: 'Supersport de 321cc con suspensión invertida KYB, ABS y diseño inspirado en la YZF-R1. Pura deportividad accesible.',
    description: 'La YZF-R3 es la deportiva de entrada con alma de competición. Motor bicilíndrico de 321cc con 42hp, suspensión invertida KYB de 37mm, frenos ABS de doble disco y un carenado inspirado en la legendaria R1. La pista nunca estuvo tan cerca.',
    keySpecs: [
      { icon: 'engine', value: '321cc', label: 'Motor' },
      { icon: 'power', value: '42 HP', label: 'Potencia' },
      { icon: 'weight', value: '169 kg', label: 'Peso' },
      { icon: 'transmission', value: '6 velocidades', label: 'Transmisión' },
    ],
    fullSpecs: [
      {
        group: 'Motor',
        specs: [
          { name: 'Tipo', value: 'Inyección electrónica, bi-cilíndrico, 4 válvulas, DOHC, refrigerado por líquido' },
          { name: 'Cilindrada', value: '321 cc' },
          { name: 'Potencia máxima', value: '42 HP' },
          { name: 'Arranque', value: 'Eléctrico' },
          { name: 'Transmisión', value: '6 velocidades' },
        ],
      },
      {
        group: 'Chasis / Suspensión',
        specs: [
          { name: 'Suspensión delantera', value: 'Invertida KYB 37mm' },
          { name: 'Suspensión trasera', value: 'Monoamortiguador' },
          { name: 'Llanta delantera', value: '110/70-17 M/C 54H (Tubeless)' },
          { name: 'Llanta trasera', value: '140/70-17 M/C 66H (Tubeless)' },
        ],
      },
      {
        group: 'Frenos',
        specs: [
          { name: 'Freno delantero', value: 'Disco ABS 298mm' },
          { name: 'Freno trasero', value: 'Disco ABS 220mm' },
        ],
      },
      {
        group: 'Dimensiones',
        specs: [
          { name: 'Peso', value: '169 kg' },
        ],
      },
    ],
    benefits: [
      { type: 'emotional', title: 'Diseño de competición', description: 'Carenado aerodinámico inspirado en la YZF-R1 que corta el viento con estilo.' },
      { type: 'practical', title: 'Suspensión KYB invertida', description: 'Horquillas invertidas de 37mm para precisión y estabilidad en cada curva.' },
      { type: 'practical', title: 'Frenos ABS', description: 'Discos de 298mm y 220mm con ABS para frenadas seguras en cualquier condición.' },
      { type: 'emotional', title: 'Sonido twin', description: 'El inconfundible rugido del motor bicilíndrico que pide más revoluciones.' },
    ],
    financing: { eligible: true, defaultDownPayment: 20, defaultTerm: 60, monthlyPayment: 110000, termMonths: 60 },
    status: 'active',
    featured: false,
    sortOrder: 8,
  },

  // ─────────────────────────────────────────────
  // MONTAÑERO
  // ─────────────────────────────────────────────
  {
    _id: 'ys125-g',
    _updatedAt: '2026-01-15T00:00:00.000Z',
    name: 'YS125-G',
    slug: 'ys125-g',
    year: 2026,
    category: { name: 'Montañero', slug: 'montanero', parentCategory: 'motos' },
    productType: 'moto',
    price: 1395000,
    currency: 'CRC',
    formattedPrice: '₡1.395.000',
    tags: ['Llanta Tubular'],
    tagline: 'Robustez para caminos difíciles',
    images: imgs('YS125-G', 'ys125-g'),
    heroImage: img('YS125-G', 'ys125-g'),
    shortDescription: 'Moto montañera de 124cc con llantas tubulares, disco delantero y doble compensador. Hecha para los caminos más exigentes.',
    description: 'La YS125-G es la montañera confiable que no le teme a ningún camino. Motor carburado de 124cc, llantas tubulares 3.00-18 en ambas ruedas, freno de disco delantero y suspensión de doble compensador para enfrentar cualquier terreno con seguridad.',
    keySpecs: [
      { icon: 'engine', value: '124cc', label: 'Motor' },
      { icon: 'power', value: '10 HP', label: 'Potencia' },
      { icon: 'weight', value: '124 kg', label: 'Peso' },
      { icon: 'transmission', value: 'Eléctrico y Pedal', label: 'Arranque' },
    ],
    fullSpecs: [
      {
        group: 'Motor',
        specs: [
          { name: 'Tipo', value: '4T carburado' },
          { name: 'Cilindrada', value: '124 cc' },
          { name: 'Potencia máxima', value: '10 HP' },
          { name: 'Arranque', value: 'Eléctrico y Pedal' },
        ],
      },
      {
        group: 'Chasis / Suspensión',
        specs: [
          { name: 'Suspensión delantera', value: 'Telescópica' },
          { name: 'Suspensión trasera', value: 'Doble compensador' },
          { name: 'Llanta delantera', value: '3.00-18-4PR tubular' },
          { name: 'Llanta trasera', value: '3.00-18-4PR tubular' },
        ],
      },
      {
        group: 'Frenos',
        specs: [
          { name: 'Freno delantero', value: 'Disco' },
          { name: 'Freno trasero', value: 'Tambor' },
        ],
      },
      {
        group: 'Dimensiones',
        specs: [
          { name: 'Peso', value: '124 kg' },
        ],
      },
    ],
    benefits: [
      { type: 'practical', title: 'Llantas tubulares', description: 'Llantas 3.00-18 en ambas ruedas para máxima tracción en terreno irregular.' },
      { type: 'emotional', title: 'Conquistá cualquier camino', description: 'Diseñada para las zonas rurales y montañosas de Costa Rica.' },
      { type: 'practical', title: 'Disco delantero', description: 'Mayor poder de frenado en descensos y terreno difícil.' },
    ],
    financing: { eligible: true, defaultDownPayment: 20, defaultTerm: 60, monthlyPayment: 40000, termMonths: 60 },
    status: 'active',
    featured: false,
    sortOrder: 1,
  },
  {
    _id: 'xtz-125',
    _updatedAt: '2026-01-15T00:00:00.000Z',
    name: 'XTZ 125',
    slug: 'xtz-125',
    year: 2026,
    category: { name: 'Montañero', slug: 'montanero', parentCategory: 'motos' },
    productType: 'moto',
    price: 1595000,
    salePrice: 1495000,
    currency: 'CRC',
    formattedPrice: '₡1.595.000',
    tagline: 'Aventura todoterreno de entrada',
    images: imgs('XTZ 125', 'xtz-125'),
    heroImage: img('XTZ 125', 'xtz-125'),
    shortDescription: 'Doble propósito de 124cc con llanta delantera de 21", suspensión mono-cross y freno de disco. Aventura sin límites.',
    description: 'La XTZ 125 es la doble propósito perfecta para iniciarse en la aventura. Con llanta delantera de 21 pulgadas, suspensión mono-cross trasera y motor carburado de 124cc, ofrece capacidad todoterreno real en un paquete accesible y fácil de manejar.',
    keySpecs: [
      { icon: 'engine', value: '124cc', label: 'Motor' },
      { icon: 'power', value: '9.8 HP', label: 'Potencia' },
      { icon: 'weight', value: '118 kg', label: 'Peso' },
      { icon: 'transmission', value: 'Eléctrico y Pedal', label: 'Arranque' },
    ],
    fullSpecs: [
      {
        group: 'Motor',
        specs: [
          { name: 'Tipo', value: '4T carburada' },
          { name: 'Cilindrada', value: '124 cc' },
          { name: 'Potencia máxima', value: '9.8 HP' },
          { name: 'Arranque', value: 'Eléctrico y pedal' },
        ],
      },
      {
        group: 'Chasis / Suspensión',
        specs: [
          { name: 'Suspensión delantera', value: 'Telescópica' },
          { name: 'Suspensión trasera', value: 'Mono-cross' },
          { name: 'Llanta delantera', value: '80/90-21' },
          { name: 'Llanta trasera', value: '110/80-18' },
        ],
      },
      {
        group: 'Frenos',
        specs: [
          { name: 'Freno delantero', value: 'Disco' },
          { name: 'Freno trasero', value: 'Tambor' },
        ],
      },
      {
        group: 'Dimensiones',
        specs: [
          { name: 'Peso', value: '118 kg' },
        ],
      },
    ],
    benefits: [
      { type: 'emotional', title: 'Espíritu aventurero', description: 'Llanta delantera de 21" que conquista cualquier sendero o camino rural.' },
      { type: 'practical', title: 'Suspensión mono-cross', description: 'Tecnología de suspensión superior para absorber los terrenos más difíciles.' },
      { type: 'practical', title: 'Liviana y ágil', description: 'Solo 118kg para máxima maniobrabilidad en terreno técnico.' },
    ],
    financing: { eligible: true, defaultDownPayment: 20, defaultTerm: 60, monthlyPayment: 43000, termMonths: 60 },
    status: 'active',
    featured: false,
    sortOrder: 2,
  },
  {
    _id: 'xtz-150-fi',
    _updatedAt: '2026-01-15T00:00:00.000Z',
    name: 'XTZ 150 FI',
    slug: 'xtz-150-fi',
    year: 2026,
    category: { name: 'Montañero', slug: 'montanero', parentCategory: 'motos' },
    productType: 'moto',
    price: 1795000,
    currency: 'CRC',
    formattedPrice: '₡1.795.000',
    tagline: 'Inyección y YRCS para la aventura',
    images: imgs('XTZ 150 FI', 'xtz-150-fi'),
    heroImage: img('XTZ 150 FI', 'xtz-150-fi'),
    shortDescription: 'Doble propósito inyectada de 149cc con sistema YRCS, suspensión mono-cross y llanta delantera de 19". Tecnología para la aventura.',
    description: 'La XTZ 150 FI incorpora inyección electrónica con sistema YRCS para un rendimiento óptimo en cualquier altitud. Con 180mm de recorrido de suspensión delantera, suspensión mono-cross tipo linked y freno de disco, está lista para la aventura seria.',
    keySpecs: [
      { icon: 'engine', value: '149cc', label: 'Motor' },
      { icon: 'power', value: '12 HP', label: 'Potencia' },
      { icon: 'weight', value: '131 kg', label: 'Peso' },
      { icon: 'transmission', value: 'Eléctrico', label: 'Arranque' },
    ],
    fullSpecs: [
      {
        group: 'Motor',
        specs: [
          { name: 'Tipo', value: 'Inyectado con YRCS' },
          { name: 'Cilindrada', value: '149 cc' },
          { name: 'Potencia máxima', value: '12 HP' },
          { name: 'Arranque', value: 'Eléctrico' },
        ],
      },
      {
        group: 'Chasis / Suspensión',
        specs: [
          { name: 'Suspensión delantera', value: 'Telescópica, 180mm de recorrido' },
          { name: 'Suspensión trasera', value: 'Mono-cross tipo linked, 160mm de recorrido' },
          { name: 'Llanta delantera', value: '90/90-19' },
          { name: 'Llanta trasera', value: '110/90-17' },
        ],
      },
      {
        group: 'Frenos',
        specs: [
          { name: 'Freno delantero', value: 'Disco' },
          { name: 'Freno trasero', value: 'Tambor' },
        ],
      },
      {
        group: 'Dimensiones',
        specs: [
          { name: 'Peso', value: '131 kg' },
        ],
      },
    ],
    benefits: [
      { type: 'practical', title: 'Inyección con YRCS', description: 'Rendimiento constante sin importar la altitud o las condiciones climáticas.' },
      { type: 'practical', title: 'Suspensión de largo recorrido', description: '180mm delante y 160mm atrás para superar los obstáculos más exigentes.' },
      { type: 'emotional', title: 'Lista para todo', description: 'De la ciudad al campo sin compromisos, una verdadera doble propósito.' },
    ],
    financing: { eligible: true, defaultDownPayment: 20, defaultTerm: 60, monthlyPayment: 51000, termMonths: 60 },
    status: 'active',
    featured: false,
    sortOrder: 3,
  },
  {
    _id: 'wr155-fi',
    _updatedAt: '2026-01-15T00:00:00.000Z',
    name: 'WR155 FI',
    slug: 'wr155-fi',
    year: 2025,
    category: { name: 'Montañero', slug: 'montanero', parentCategory: 'motos' },
    productType: 'moto',
    price: 2890000,
    salePrice: 2790000,
    currency: 'CRC',
    formattedPrice: '₡2.890.000',
    tags: ['VVA'],
    tagline: 'Enduro con alma de competición',
    images: imgs('WR155 FI', 'wr155-fi'),
    heroImage: img('WR155 FI', 'wr155-fi'),
    shortDescription: 'Enduro de 155cc con sistema VVA, suspensión KYB de alto recorrido y refrigeración líquida. Rendimiento off-road real.',
    description: 'La WR155 FI es la enduro perfecta con motor inyectado de 155cc con VVA (Variable Valve Actuation) y refrigeración líquida. Suspensión KYB telescópica de 215mm, frenos de disco ondulado y una relación peso-potencia que la hace destacar en cualquier sendero.',
    keySpecs: [
      { icon: 'engine', value: '155cc', label: 'Motor' },
      { icon: 'power', value: '16.7 HP', label: 'Potencia' },
      { icon: 'weight', value: '134 kg', label: 'Peso' },
      { icon: 'transmission', value: '6 velocidades', label: 'Transmisión' },
    ],
    fullSpecs: [
      {
        group: 'Motor',
        specs: [
          { name: 'Tipo', value: 'Inyectado con VVA y refrigeración líquida' },
          { name: 'Cilindrada', value: '155 cc' },
          { name: 'Potencia máxima', value: '16.7 HP' },
          { name: 'Arranque', value: 'Eléctrico' },
          { name: 'Transmisión', value: '6 velocidades' },
        ],
      },
      {
        group: 'Chasis / Suspensión',
        specs: [
          { name: 'Suspensión delantera', value: 'KYB telescópica 215mm de recorrido, 41mm' },
          { name: 'Suspensión trasera', value: 'Mono-cross tipo linked, 185mm de recorrido' },
          { name: 'Llanta delantera', value: '2.75-21' },
          { name: 'Llanta trasera', value: '4.10-18' },
        ],
      },
      {
        group: 'Frenos',
        specs: [
          { name: 'Freno delantero', value: 'Disco ondulado 240mm' },
          { name: 'Freno trasero', value: 'Disco 220mm' },
        ],
      },
      {
        group: 'Dimensiones',
        specs: [
          { name: 'Peso', value: '134 kg' },
        ],
      },
    ],
    benefits: [
      { type: 'practical', title: 'Sistema VVA', description: 'Válvulas variables que optimizan potencia a bajas y altas revoluciones.' },
      { type: 'practical', title: 'Suspensión KYB de largo recorrido', description: '215mm delante y 185mm atrás para absorber cualquier obstáculo del camino.' },
      { type: 'emotional', title: 'Alma de competición', description: 'Tecnología derivada de las WR de motocross en un paquete homologado para calle.' },
      { type: 'practical', title: 'Frenos de disco ondulado', description: 'Mayor poder de frenado y mejor evacuación de barro y agua.' },
    ],
    financing: { eligible: true, defaultDownPayment: 20, defaultTerm: 60, monthlyPayment: 78000, termMonths: 60 },
    priceNote: 'Precio válido para modelo 2025, hasta agotar existencias.',
    status: 'active',
    featured: false,
    sortOrder: 4,
  },
  {
    _id: 'serow-fi',
    _updatedAt: '2026-01-15T00:00:00.000Z',
    name: 'Serow FI',
    slug: 'serow-fi',
    year: 2026,
    category: { name: 'Montañero', slug: 'montanero', parentCategory: 'motos' },
    productType: 'moto',
    price: 3520000,
    currency: 'CRC',
    formattedPrice: '₡3.520.000',
    tagline: '100% Japonés, 100% aventura',
    images: imgs('Serow FI', 'serow-fi'),
    heroImage: img('Serow FI', 'serow-fi'),
    shortDescription: 'Doble propósito 100% japonesa de 249cc con inyección, frenos de disco dobles y 5 velocidades. La aventurera por excelencia.',
    description: 'La Serow FI es una moto 100% fabricada en Japón, sinónimo de calidad y durabilidad. Su motor inyectado de 249cc enfriado por aire con SOHC y 2 válvulas ofrece potencia lineal y confiable. Frenos de disco en ambas ruedas y un peso de solo 132kg la hacen ideal para la aventura seria.',
    keySpecs: [
      { icon: 'engine', value: '249cc', label: 'Motor' },
      { icon: 'power', value: '19 HP', label: 'Potencia' },
      { icon: 'weight', value: '132 kg', label: 'Peso' },
      { icon: 'transmission', value: '5 velocidades', label: 'Transmisión' },
    ],
    fullSpecs: [
      {
        group: 'Motor',
        specs: [
          { name: 'Tipo', value: '100% Japonés, inyectado, enfriado por aire, SOHC, 2 válvulas' },
          { name: 'Cilindrada', value: '249 cc' },
          { name: 'Potencia máxima', value: '19 HP' },
          { name: 'Arranque', value: 'Eléctrico' },
          { name: 'Transmisión', value: '5 velocidades' },
        ],
      },
      {
        group: 'Chasis / Suspensión',
        specs: [
          { name: 'Llanta delantera', value: '2.75-21' },
          { name: 'Llanta trasera', value: '120/80' },
        ],
      },
      {
        group: 'Frenos',
        specs: [
          { name: 'Freno delantero', value: 'Disco' },
          { name: 'Freno trasero', value: 'Disco' },
        ],
      },
      {
        group: 'Dimensiones',
        specs: [
          { name: 'Peso', value: '132 kg' },
        ],
      },
    ],
    benefits: [
      { type: 'emotional', title: '100% Japonesa', description: 'Fabricada íntegramente en Japón con los más altos estándares de calidad.' },
      { type: 'practical', title: 'Doble disco', description: 'Frenos de disco en ambas ruedas para frenado confiable en cualquier terreno.' },
      { type: 'practical', title: 'Motor inyectado 249cc', description: 'Potencia generosa y respuesta limpia sin importar la altitud o temperatura.' },
      { type: 'emotional', title: 'Leyenda viva', description: 'Una de las motos más respetadas del segmento aventura a nivel mundial.' },
    ],
    financing: { eligible: true, defaultDownPayment: 20, defaultTerm: 60, monthlyPayment: 97000, termMonths: 60 },
    status: 'active',
    featured: false,
    sortOrder: 5,
  },
  {
    _id: 'wr250f',
    _updatedAt: '2026-01-15T00:00:00.000Z',
    name: 'WR250F',
    slug: 'wr250f',
    year: 2026,
    category: { name: 'Montañero', slug: 'montanero', parentCategory: 'motos' },
    productType: 'moto',
    price: 6590000,
    currency: 'CRC',
    formattedPrice: '₡6.590.000',
    tagline: 'Enduro de alto rendimiento',
    images: imgs('WR250F', 'wr250f'),
    heroImage: img('WR250F', 'wr250f'),
    shortDescription: 'Enduro de alto rendimiento con motor inyectado 4T de 250cc, culata invertida, chasis de aluminio y llanta trasera Metzeler 6 Days.',
    description: 'La WR250F es la enduro definitiva de Yamaha. Motor inyectado 4T de 250cc con culata invertida para máxima compacidad, chasis de aluminio con subchasis recortado, embrague tipo enduro y llanta trasera 18" Metzeler 6 Days Extreme. Diseñada para dominar los senderos más exigentes.',
    keySpecs: [
      { icon: 'engine', value: '250cc', label: 'Motor' },
      { icon: 'power', value: '4T Inyectado', label: 'Tipo' },
      { icon: 'weight', value: 'Aluminio', label: 'Chasis' },
      { icon: 'transmission', value: '6 velocidades', label: 'Transmisión' },
    ],
    fullSpecs: [
      {
        group: 'Motor',
        specs: [
          { name: 'Tipo', value: 'Inyectado 4T 250cc, culata invertida' },
          { name: 'Cilindrada', value: '250 cc' },
          { name: 'Arranque', value: 'Eléctrico' },
          { name: 'Embrague', value: 'Tipo enduro' },
          { name: 'Transmisión', value: '6 velocidades' },
        ],
      },
      {
        group: 'Chasis / Suspensión',
        specs: [
          { name: 'Chasis', value: 'Aluminio con subchasis recortado' },
          { name: 'Suspensión', value: 'Alto rendimiento' },
          { name: 'Llanta trasera', value: '18" Metzeler 6 Days Extreme' },
        ],
      },
      {
        group: 'Frenos',
        specs: [
          { name: 'Frenos', value: 'Disco delantero y trasero' },
        ],
      },
      {
        group: 'Dimensiones',
        specs: [
          { name: 'Chasis', value: 'Aluminio con subchasis recortado' },
        ],
      },
    ],
    benefits: [
      { type: 'practical', title: 'Culata invertida', description: 'Diseño compacto del motor para mejor centralización de masas y agilidad.' },
      { type: 'practical', title: 'Chasis de aluminio', description: 'Máxima rigidez con peso mínimo para rendimiento enduro superior.' },
      { type: 'emotional', title: 'Metzeler 6 Days', description: 'Llantas de competición mundial para máxima tracción en cualquier terreno.' },
      { type: 'practical', title: 'Embrague enduro', description: 'Diseñado para uso intensivo y modulación precisa en senderos técnicos.' },
    ],
    financing: { eligible: true, defaultDownPayment: 20, defaultTerm: 60, monthlyPayment: 180000, termMonths: 60 },
    status: 'active',
    featured: false,
    sortOrder: 6,
  },
  {
    _id: 'wr450f',
    _updatedAt: '2026-01-15T00:00:00.000Z',
    name: 'WR450F',
    slug: 'wr450f',
    year: 2026,
    category: { name: 'Montañero', slug: 'montanero', parentCategory: 'motos' },
    productType: 'moto',
    price: 7090000,
    currency: 'CRC',
    formattedPrice: '₡7.090.000',
    tagline: 'La máxima expresión del enduro',
    images: imgs('WR450F', 'wr450f'),
    heroImage: img('WR450F', 'wr450f'),
    shortDescription: 'Enduro tope de línea con motor inyectado de 450cc 4T, suspensión KYB, culata invertida y llantas Metzeler 6 Days FIM.',
    description: 'La WR450F es el arma definitiva para el enduro serio. Motor inyectado 4T de 450cc con culata invertida, suspensión KYB de alto rendimiento, radiadores enduro con ventilador, llanta trasera 18" Metzeler 6 Days FIM y 5 velocidades enduro. Potencia bruta controlada.',
    keySpecs: [
      { icon: 'engine', value: '450cc', label: 'Motor' },
      { icon: 'power', value: '4T Inyectado', label: 'Tipo' },
      { icon: 'weight', value: 'KYB', label: 'Suspensión' },
      { icon: 'transmission', value: '5 velocidades', label: 'Transmisión' },
    ],
    fullSpecs: [
      {
        group: 'Motor',
        specs: [
          { name: 'Tipo', value: 'Inyectado 450cc 4T, culata invertida' },
          { name: 'Cilindrada', value: '450 cc' },
          { name: 'Arranque', value: 'Eléctrico' },
          { name: 'Transmisión', value: '5 velocidades enduro' },
        ],
      },
      {
        group: 'Chasis / Suspensión',
        specs: [
          { name: 'Suspensión', value: 'KYB de alto rendimiento' },
          { name: 'Llanta trasera', value: '18" Metzeler 6 Days FIM' },
          { name: 'Refrigeración', value: 'Radiadores enduro con ventilador' },
        ],
      },
      {
        group: 'Frenos',
        specs: [
          { name: 'Frenos', value: 'Disco delantero y trasero' },
        ],
      },
      {
        group: 'Dimensiones',
        specs: [
          { name: 'Configuración', value: 'Enduro con radiadores y ventilador' },
        ],
      },
    ],
    benefits: [
      { type: 'emotional', title: 'Potencia de 450cc', description: 'Motor masivo que conquista cualquier terreno con autoridad absoluta.' },
      { type: 'practical', title: 'Suspensión KYB', description: 'Componentes de suspensión de nivel mundial para rendimiento enduro profesional.' },
      { type: 'practical', title: 'Refrigeración enduro', description: 'Radiadores con ventilador para mantener temperatura óptima en senderos lentos.' },
      { type: 'emotional', title: 'Metzeler 6 Days FIM', description: 'Las mismas llantas que usan los campeones del Six Days Enduro.' },
    ],
    financing: { eligible: true, defaultDownPayment: 20, defaultTerm: 60, monthlyPayment: 193000, termMonths: 60 },
    status: 'active',
    featured: false,
    sortOrder: 7,
  },
  {
    _id: 'tenere-700-fi',
    _updatedAt: '2026-01-15T00:00:00.000Z',
    name: 'Ténéré 700 FI',
    slug: 'tenere-700-fi',
    year: 2026,
    category: { name: 'Montañero', slug: 'montanero', parentCategory: 'motos' },
    productType: 'moto',
    price: 8950000,
    salePrice: 7990000,
    currency: 'CRC',
    formattedPrice: '₡8.950.000',
    tags: ['FI', 'CrossPlane'],
    tagline: 'Siguiente parada: la aventura',
    images: imgs('Ténéré 700 FI', 'tenere-700-fi'),
    heroImage: img('Ténéré 700 FI', 'tenere-700-fi'),
    shortDescription: 'Adventure bike bicilíndrica de 689cc con 73.4hp, suspensión invertida, ABS seleccionable y TCS. La aventura sin límites.',
    description: 'La Ténéré 700 es la aventurera definitiva de Yamaha. Motor bicilíndrico en línea CP2 de 689cc con 73.4hp, suspensión invertida de 210mm, brazo oscilante de 180mm, frenos de doble disco con ABS y TCS seleccionable. Diseñada para cruzar continentes y conquistar cualquier camino.',
    keySpecs: [
      { icon: 'engine', value: '689cc', label: 'Motor' },
      { icon: 'power', value: '73.4 HP', label: 'Potencia' },
      { icon: 'weight', value: '208 kg', label: 'Peso' },
      { icon: 'transmission', value: 'Eléctrico', label: 'Arranque' },
    ],
    fullSpecs: [
      {
        group: 'Motor',
        specs: [
          { name: 'Tipo', value: 'Bicilíndrico en línea, refrigerado por líquido, 4 válvulas' },
          { name: 'Cilindrada', value: '689 cc' },
          { name: 'Potencia máxima', value: '73.4 HP' },
          { name: 'Arranque', value: 'Eléctrico' },
        ],
      },
      {
        group: 'Chasis / Suspensión',
        specs: [
          { name: 'Suspensión delantera', value: 'Invertida, 210mm de recorrido' },
          { name: 'Suspensión trasera', value: 'Brazo oscilante, 180mm de recorrido' },
          { name: 'Llanta delantera', value: '90/90-21' },
          { name: 'Llanta trasera', value: '150/70 R18' },
        ],
      },
      {
        group: 'Frenos',
        specs: [
          { name: 'Freno delantero', value: 'Doble disco 282mm con ABS y TCS seleccionable' },
          { name: 'Freno trasero', value: 'Disco 245mm con ABS y TCS seleccionable' },
        ],
      },
      {
        group: 'Dimensiones',
        specs: [
          { name: 'Peso', value: '208 kg' },
        ],
      },
    ],
    benefits: [
      { type: 'emotional', title: 'Espíritu Ténéré', description: 'El nombre más legendario del mundo adventure, nacido en el desierto del Sahara.' },
      { type: 'practical', title: 'ABS y TCS seleccionable', description: 'Desactivá el ABS y TCS trasero para máximo control en off-road serio.' },
      { type: 'practical', title: 'Motor CP2', description: 'El probado bicilíndrico de 689cc: potente, confiable y con carácter único.' },
      { type: 'emotional', title: 'Sin límites', description: 'Cruzá fronteras, conquistá montañas. La Ténéré 700 no conoce límites.' },
    ],
    financing: { eligible: true, defaultDownPayment: 20, defaultTerm: 60, monthlyPayment: 218000, termMonths: 60 },
    status: 'active',
    featured: true,
    sortOrder: 8,
  },

  // ─────────────────────────────────────────────
  // ALTA CILINDRADA
  // ─────────────────────────────────────────────
  {
    _id: 'mt-07-fi',
    _updatedAt: '2026-01-15T00:00:00.000Z',
    name: 'MT-07 FI',
    slug: 'mt-07-fi',
    year: 2026,
    category: { name: 'Alta Cilindrada', slug: 'alta-cilindrada', parentCategory: 'motos' },
    productType: 'moto',
    price: 6595000,
    salePrice: 5850000,
    currency: 'CRC',
    formattedPrice: '₡6.595.000',
    tags: ['FI', 'CrossPlane'],
    tagline: 'El dark side de Japón',
    images: imgs('MT-07 FI', 'mt-07-fi'),
    heroImage: img('MT-07 FI', 'mt-07-fi'),
    shortDescription: 'Hyper naked con motor CP2 de 689cc y 73hp. Suspensión invertida, ABS, TFT 5" y conectividad. Torque brutal en paquete ligero.',
    description: 'La MT-07 es la hyper naked que redefinió el segmento. Motor CP2 bicilíndrico de 689cc con 73hp, suspensión invertida, frenos ABS de doble disco de 298mm, pantalla TFT de 5 pulgadas y conectividad. Todo esto en un paquete de solo 183kg.',
    keySpecs: [
      { icon: 'engine', value: '689cc', label: 'Motor' },
      { icon: 'power', value: '73 HP', label: 'Potencia' },
      { icon: 'weight', value: '183 kg', label: 'Peso' },
      { icon: 'transmission', value: 'TFT 5"', label: 'Panel' },
    ],
    fullSpecs: [
      {
        group: 'Motor',
        specs: [
          { name: 'Tipo', value: 'CP2 bicilíndrico, refrigerado por líquido, 4 válvulas, DOHC' },
          { name: 'Cilindrada', value: '689 cc' },
          { name: 'Potencia máxima', value: '73 HP' },
          { name: 'Arranque', value: 'Eléctrico' },
        ],
      },
      {
        group: 'Chasis / Suspensión',
        specs: [
          { name: 'Suspensión delantera', value: 'Invertida' },
          { name: 'Suspensión trasera', value: 'Monocompensador' },
          { name: 'Llanta delantera', value: '120/70 ZR17' },
          { name: 'Llanta trasera', value: '180/55 ZR17' },
        ],
      },
      {
        group: 'Frenos',
        specs: [
          { name: 'Freno delantero', value: 'Doble disco 298mm con ABS' },
          { name: 'Freno trasero', value: 'Disco 245mm con ABS' },
        ],
      },
      {
        group: 'Dimensiones',
        specs: [
          { name: 'Peso', value: '183 kg' },
          { name: 'Panel', value: 'TFT 5" con conectividad' },
        ],
      },
    ],
    benefits: [
      { type: 'emotional', title: 'Motor CP2', description: 'El torque y carácter inconfundible del motor CrossPlane de 689cc.' },
      { type: 'practical', title: 'Ligera y ágil', description: 'Solo 183kg para una maniobrabilidad excepcional en ciudad y carretera.' },
      { type: 'practical', title: 'Pantalla TFT', description: 'Panel TFT de 5" con conectividad smartphone para toda la información que necesitás.' },
      { type: 'emotional', title: 'Dark Side', description: 'El diseño hyper naked más icónico del mercado que genera pasión.' },
    ],
    financing: { eligible: true, defaultDownPayment: 20, defaultTerm: 60, monthlyPayment: 160000, termMonths: 60 },
    status: 'active',
    featured: true,
    sortOrder: 1,
  },
  {
    _id: 'mt-07-yamt',
    _updatedAt: '2026-01-15T00:00:00.000Z',
    name: 'MT-07 Y-AMT',
    slug: 'mt-07-yamt',
    year: 2026,
    category: { name: 'Alta Cilindrada', slug: 'alta-cilindrada', parentCategory: 'motos' },
    productType: 'moto',
    price: 6190000,
    currency: 'CRC',
    formattedPrice: '₡6.190.000',
    tags: ['Automática'],
    tagline: 'El futuro de la transmisión motociclista',
    images: imgs('MT-07 Y-AMT', 'mt-07-yamt'),
    heroImage: img('MT-07 Y-AMT', 'mt-07-yamt'),
    shortDescription: 'La MT-07 con transmisión automática Y-AMT. Todo el poder del CP2 de 689cc sin embrague manual. Revolución en dos ruedas.',
    description: 'La MT-07 Y-AMT trae al presente el futuro de las motocicletas. El mismo motor CP2 de 689cc con 73hp, pero con la revolucionaria transmisión automática Y-AMT que permite cambios automáticos o manuales sin embrague. Máximo disfrute, mínimo esfuerzo.',
    keySpecs: [
      { icon: 'engine', value: '689cc', label: 'Motor' },
      { icon: 'power', value: '73 HP', label: 'Potencia' },
      { icon: 'weight', value: '184 kg', label: 'Peso' },
      { icon: 'transmission', value: 'Y-AMT', label: 'Transmisión' },
    ],
    fullSpecs: [
      {
        group: 'Motor',
        specs: [
          { name: 'Tipo', value: 'CP2 bicilíndrico, refrigerado por líquido, 4 válvulas, DOHC' },
          { name: 'Cilindrada', value: '689 cc' },
          { name: 'Potencia máxima', value: '73 HP' },
          { name: 'Transmisión', value: 'Y-AMT (Yamaha Automated Manual Transmission)' },
          { name: 'Arranque', value: 'Eléctrico' },
        ],
      },
      {
        group: 'Chasis / Suspensión',
        specs: [
          { name: 'Suspensión delantera', value: 'Invertida' },
          { name: 'Suspensión trasera', value: 'Monocompensador' },
          { name: 'Llanta delantera', value: '120/70 ZR17' },
          { name: 'Llanta trasera', value: '180/55 ZR17' },
        ],
      },
      {
        group: 'Frenos',
        specs: [
          { name: 'Freno delantero', value: 'Doble disco 298mm con ABS' },
          { name: 'Freno trasero', value: 'Disco 245mm con ABS' },
        ],
      },
      {
        group: 'Dimensiones',
        specs: [
          { name: 'Peso', value: '184 kg' },
        ],
      },
    ],
    benefits: [
      { type: 'emotional', title: 'Sin embrague', description: 'Disfrutá de la conducción pura sin preocuparte por el embrague en el tráfico.' },
      { type: 'practical', title: 'Modos de transmisión', description: 'Modo automático para la ciudad, modo manual para la diversión en carretera.' },
      { type: 'practical', title: 'Mismo motor CP2', description: 'Toda la potencia y confiabilidad del probado motor bicilíndrico de 689cc.' },
      { type: 'emotional', title: 'Tecnología pionera', description: 'Sé de los primeros en experimentar el futuro de la transmisión motociclista.' },
    ],
    financing: { eligible: true, defaultDownPayment: 20, defaultTerm: 60, monthlyPayment: 169000, termMonths: 60 },
    status: 'active',
    featured: false,
    sortOrder: 2,
  },
  {
    _id: 'mt-09-fi',
    _updatedAt: '2026-01-15T00:00:00.000Z',
    name: 'MT-09 FI',
    slug: 'mt-09-fi',
    year: 2026,
    category: { name: 'Alta Cilindrada', slug: 'alta-cilindrada', parentCategory: 'motos' },
    productType: 'moto',
    price: 8490000,
    currency: 'CRC',
    formattedPrice: '₡8.490.000',
    tags: ['FI', 'CrossPlane'],
    tagline: 'Hyper Naked de tres cilindros',
    images: imgs('MT-09 FI', 'mt-09-fi'),
    heroImage: img('MT-09 FI', 'mt-09-fi'),
    shortDescription: 'Triple cilindro de 890cc con 119hp, suspensión invertida, doble disco con ABS y electrónica avanzada. La hyper naked definitiva.',
    description: 'La MT-09 es la hyper naked que lo tiene todo. Motor de 3 cilindros de 890cc con 119hp, suspensión invertida, frenos de doble disco de 298mm con ABS, electrónica completa y un diseño que eriza la piel. La experiencia más intensa sobre dos ruedas.',
    keySpecs: [
      { icon: 'engine', value: '890cc', label: 'Motor' },
      { icon: 'power', value: '119 HP', label: 'Potencia' },
      { icon: 'weight', value: '193 kg', label: 'Peso' },
      { icon: 'transmission', value: 'Eléctrico', label: 'Arranque' },
    ],
    fullSpecs: [
      {
        group: 'Motor',
        specs: [
          { name: 'Tipo', value: '3 cilindros en línea, refrigerado por líquido, DOHC, 4 válvulas' },
          { name: 'Cilindrada', value: '890 cc' },
          { name: 'Potencia máxima', value: '119 HP' },
          { name: 'Arranque', value: 'Eléctrico' },
        ],
      },
      {
        group: 'Chasis / Suspensión',
        specs: [
          { name: 'Suspensión delantera', value: 'Invertida' },
          { name: 'Suspensión trasera', value: 'Monocompensador' },
          { name: 'Llanta delantera', value: '120/70 R17' },
          { name: 'Llanta trasera', value: '180/55 R17' },
        ],
      },
      {
        group: 'Frenos',
        specs: [
          { name: 'Freno delantero', value: 'Doble disco 298mm con ABS' },
          { name: 'Freno trasero', value: 'Disco 245mm con ABS' },
        ],
      },
      {
        group: 'Dimensiones',
        specs: [
          { name: 'Peso', value: '193 kg' },
        ],
      },
    ],
    benefits: [
      { type: 'emotional', title: 'Triple cilindro', description: 'El sonido y la entrega de potencia únicos del motor de 3 cilindros CrossPlane.' },
      { type: 'practical', title: '119 HP controlados', description: 'Electrónica avanzada para domar 119 caballos con total confianza.' },
      { type: 'practical', title: 'Suspensión invertida', description: 'Componentes de suspensión de alto rendimiento para precisión absoluta.' },
      { type: 'emotional', title: 'Adrenalina pura', description: 'Cada giro del acelerador es una descarga de emoción que no tiene comparación.' },
    ],
    financing: { eligible: true, defaultDownPayment: 20, defaultTerm: 60, monthlyPayment: 231000, termMonths: 60 },
    status: 'active',
    featured: true,
    sortOrder: 3,
  },
  {
    _id: 'mt-09-yamt',
    _updatedAt: '2026-01-15T00:00:00.000Z',
    name: 'MT-09 Y-AMT',
    slug: 'mt-09-yamt',
    year: 2026,
    category: { name: 'Alta Cilindrada', slug: 'alta-cilindrada', parentCategory: 'motos' },
    productType: 'moto',
    price: 8790000,
    currency: 'CRC',
    formattedPrice: '₡8.790.000',
    tags: ['Automática'],
    tagline: 'Triple cilindro con transmisión automática',
    images: imgs('MT-09 Y-AMT', 'mt-09-yamt'),
    heroImage: img('MT-09 Y-AMT', 'mt-09-yamt'),
    shortDescription: 'La MT-09 con transmisión automática Y-AMT. 890cc, 119hp y cambios sin embrague. El futuro hyper naked es automático.',
    description: 'La MT-09 Y-AMT combina la brutalidad del motor triple de 890cc con la revolución de la transmisión automática Y-AMT. 119hp que se gestionan de forma automática o manual sin embrague, para una experiencia de conducción sin precedentes.',
    keySpecs: [
      { icon: 'engine', value: '890cc', label: 'Motor' },
      { icon: 'power', value: '119 HP', label: 'Potencia' },
      { icon: 'weight', value: '196 kg', label: 'Peso' },
      { icon: 'transmission', value: 'Y-AMT', label: 'Transmisión' },
    ],
    fullSpecs: [
      {
        group: 'Motor',
        specs: [
          { name: 'Tipo', value: '3 cilindros en línea, refrigerado por líquido, DOHC, 4 válvulas' },
          { name: 'Cilindrada', value: '890 cc' },
          { name: 'Potencia máxima', value: '119 HP' },
          { name: 'Transmisión', value: 'Y-AMT (Yamaha Automated Manual Transmission)' },
          { name: 'Arranque', value: 'Eléctrico' },
        ],
      },
      {
        group: 'Chasis / Suspensión',
        specs: [
          { name: 'Suspensión delantera', value: 'Invertida' },
          { name: 'Suspensión trasera', value: 'Monocompensador' },
          { name: 'Llanta delantera', value: '120/70 R17' },
          { name: 'Llanta trasera', value: '180/55 R17' },
        ],
      },
      {
        group: 'Frenos',
        specs: [
          { name: 'Freno delantero', value: 'Doble disco 298mm con ABS' },
          { name: 'Freno trasero', value: 'Disco 245mm con ABS' },
        ],
      },
      {
        group: 'Dimensiones',
        specs: [
          { name: 'Peso', value: '196 kg' },
        ],
      },
    ],
    benefits: [
      { type: 'emotional', title: 'Triple + Y-AMT', description: 'La combinación perfecta: potencia bruta del triple con la comodidad de la automática.' },
      { type: 'practical', title: 'Cambios perfectos', description: 'La transmisión Y-AMT ejecuta cada cambio con precisión milimétrica.' },
      { type: 'practical', title: 'Menos fatiga', description: 'Sin embrague manual para disfrutar más en viajes largos y tráfico urbano.' },
    ],
    financing: { eligible: true, defaultDownPayment: 20, defaultTerm: 60, monthlyPayment: 239000, termMonths: 60 },
    status: 'active',
    featured: false,
    sortOrder: 4,
  },
  {
    _id: 'mt-09-sp-fi',
    _updatedAt: '2026-01-15T00:00:00.000Z',
    name: 'MT-09 SP FI',
    slug: 'mt-09-sp-fi',
    year: 2026,
    category: { name: 'Alta Cilindrada', slug: 'alta-cilindrada', parentCategory: 'motos' },
    productType: 'moto',
    price: 9390000,
    currency: 'CRC',
    formattedPrice: '₡9.390.000',
    tags: ['TCS', 'CrossPlane'],
    tagline: 'La hyper naked sin compromisos',
    images: imgs('MT-09 SP FI', 'mt-09-sp-fi'),
    heroImage: img('MT-09 SP FI', 'mt-09-sp-fi'),
    shortDescription: 'La MT-09 en su versión más exclusiva: suspensión KYB delante, Öhlins trasera, 119hp y electrónica de competición.',
    description: 'La MT-09 SP es la versión sin compromisos de la hyper naked más icónica. Motor de 3 cilindros de 890cc con 119hp, suspensión KYB delantera totalmente ajustable, amortiguador Öhlins monocross trasero, frenos ABS de doble disco y electrónica de nivel superior.',
    keySpecs: [
      { icon: 'engine', value: '890cc', label: 'Motor' },
      { icon: 'power', value: '119 HP', label: 'Potencia' },
      { icon: 'weight', value: '194 kg', label: 'Peso' },
      { icon: 'transmission', value: 'Öhlins', label: 'Suspensión' },
    ],
    fullSpecs: [
      {
        group: 'Motor',
        specs: [
          { name: 'Tipo', value: 'Inyectado, 3 cilindros en línea, refrigerado por líquido, DOHC, 4 válvulas' },
          { name: 'Cilindrada', value: '890 cc' },
          { name: 'Potencia máxima', value: '119 HP' },
          { name: 'Arranque', value: 'Eléctrico' },
        ],
      },
      {
        group: 'Chasis / Suspensión',
        specs: [
          { name: 'Suspensión delantera', value: 'KYB totalmente ajustable' },
          { name: 'Suspensión trasera', value: 'Öhlins monocross' },
          { name: 'Llanta delantera', value: '120/70 R17' },
          { name: 'Llanta trasera', value: '180/55 R17' },
        ],
      },
      {
        group: 'Frenos',
        specs: [
          { name: 'Freno delantero', value: 'Doble disco 298mm con ABS' },
          { name: 'Freno trasero', value: 'Disco 245mm con ABS' },
        ],
      },
      {
        group: 'Dimensiones',
        specs: [
          { name: 'Peso', value: '194 kg' },
        ],
      },
    ],
    benefits: [
      { type: 'emotional', title: 'Öhlins de serie', description: 'Amortiguador trasero Öhlins: la misma marca que usan los campeones del mundo.' },
      { type: 'practical', title: 'Suspensión KYB ajustable', description: 'Horquilla delantera totalmente ajustable para personalizar según tu estilo.' },
      { type: 'practical', title: 'TCS avanzado', description: 'Control de tracción configurable para máxima seguridad sin limitar la diversión.' },
      { type: 'emotional', title: 'Exclusividad SP', description: 'Coloración y acabados exclusivos que distinguen la versión más premium.' },
    ],
    financing: { eligible: true, defaultDownPayment: 20, defaultTerm: 60, monthlyPayment: 255000, termMonths: 60 },
    status: 'active',
    featured: false,
    sortOrder: 5,
  },
  {
    _id: 'mt-10-sp',
    _updatedAt: '2026-01-15T00:00:00.000Z',
    name: 'MT-10 SP',
    slug: 'mt-10-sp',
    year: 2026,
    category: { name: 'Alta Cilindrada', slug: 'alta-cilindrada', parentCategory: 'motos' },
    productType: 'moto',
    price: 11900000,
    currency: 'CRC',
    formattedPrice: '₡11.900.000',
    tags: ['CrossPlane'],
    tagline: 'El rey de las hyper naked',
    images: imgs('MT-10 SP', 'mt-10-sp'),
    heroImage: img('MT-10 SP', 'mt-10-sp'),
    shortDescription: 'Hyper naked de 998cc con 166hp, motor R1, suspensión Öhlins electrónica y frenos de doble disco 320mm. El pináculo naked.',
    description: 'La MT-10 SP es el tope absoluto de la familia hyper naked. Motor de 4 cilindros de 998cc derivado de la YZF-R1 con 166hp, inyección YCC-T, suspensión Öhlins electrónica en ambos ejes, frenos de doble disco de 320mm con ABS y un carácter que no acepta rivales.',
    keySpecs: [
      { icon: 'engine', value: '998cc', label: 'Motor' },
      { icon: 'power', value: '166 HP', label: 'Potencia' },
      { icon: 'weight', value: '214 kg', label: 'Peso' },
      { icon: 'transmission', value: 'Öhlins electrónica', label: 'Suspensión' },
    ],
    fullSpecs: [
      {
        group: 'Motor',
        specs: [
          { name: 'Tipo', value: 'Inyectado YCC-T, 4 cilindros en línea, refrigerado por líquido, DOHC, 16 válvulas' },
          { name: 'Cilindrada', value: '998 cc' },
          { name: 'Potencia máxima', value: '166 HP' },
          { name: 'Arranque', value: 'Eléctrico' },
        ],
      },
      {
        group: 'Chasis / Suspensión',
        specs: [
          { name: 'Suspensión delantera', value: 'Öhlins electrónica' },
          { name: 'Suspensión trasera', value: 'Öhlins electrónica' },
          { name: 'Llanta delantera', value: '120/70ZR17' },
          { name: 'Llanta trasera', value: '190/55ZR17' },
        ],
      },
      {
        group: 'Frenos',
        specs: [
          { name: 'Freno delantero', value: 'Doble disco 320mm con ABS' },
          { name: 'Freno trasero', value: 'Disco 220mm con ABS' },
        ],
      },
      {
        group: 'Dimensiones',
        specs: [
          { name: 'Peso', value: '214 kg' },
        ],
      },
    ],
    benefits: [
      { type: 'emotional', title: 'Motor de R1', description: 'El mismo motor CrossPlane de 4 cilindros de la legendaria YZF-R1.' },
      { type: 'practical', title: 'Öhlins electrónica', description: 'Suspensión semi-activa que se ajusta automáticamente a cada condición.' },
      { type: 'practical', title: 'Frenos masivos', description: 'Doble disco de 320mm para detener 166hp con absoluta confianza.' },
      { type: 'emotional', title: 'Supremacía naked', description: 'La hyper naked más poderosa de Yamaha. Sin rivales, sin compromisos.' },
    ],
    financing: { eligible: true, defaultDownPayment: 20, defaultTerm: 60, monthlyPayment: 323000, termMonths: 60 },
    status: 'active',
    featured: false,
    sortOrder: 6,
  },
  {
    _id: 'tracer-9-gt-plus',
    _updatedAt: '2026-01-15T00:00:00.000Z',
    name: 'TRACER 9 GT+',
    slug: 'tracer-9-gt-plus',
    year: 2026,
    category: { name: 'Alta Cilindrada', slug: 'alta-cilindrada', parentCategory: 'motos' },
    productType: 'moto',
    price: 12900000,
    currency: 'CRC',
    formattedPrice: '₡12.900.000',
    tags: ['FI', 'CrossPlane'],
    tagline: 'Gran turismo sin límites',
    images: imgs('TRACER 9 GT+', 'tracer-9-gt-plus'),
    heroImage: img('TRACER 9 GT+', 'tracer-9-gt-plus'),
    shortDescription: 'Sport touring de 890cc con cruise control, Quick Shifter, TCS, D-MODE y tanque de 19L. Viajes largos sin compromisos.',
    description: 'La TRACER 9 GT+ es la sport touring definitiva. Motor CP3 CrossPlane de 3 cilindros 890cc con 119hp, cruise control, TCS, D-MODE, Quick Shifter, tanque de 19L, frenos de doble disco con ABS y un nivel de equipamiento pensado para cruzar continentes con total comodidad.',
    keySpecs: [
      { icon: 'engine', value: '890cc', label: 'Motor' },
      { icon: 'power', value: '119 HP', label: 'Potencia' },
      { icon: 'weight', value: '223 kg', label: 'Peso' },
      { icon: 'transmission', value: '19 L', label: 'Tanque' },
    ],
    fullSpecs: [
      {
        group: 'Motor',
        specs: [
          { name: 'Tipo', value: 'CP3 CrossPlane 3 cilindros, 890cc, DOHC, 4 válvulas' },
          { name: 'Cilindrada', value: '890 cc' },
          { name: 'Potencia máxima', value: '119 HP' },
          { name: 'Electrónica', value: 'Cruise control, TCS, D-MODE, Quick Shifter' },
          { name: 'Arranque', value: 'Eléctrico' },
        ],
      },
      {
        group: 'Chasis / Suspensión',
        specs: [
          { name: 'Tanque', value: '19 L' },
          { name: 'Llanta delantera', value: '120/70ZR17' },
          { name: 'Llanta trasera', value: '180/55ZR17' },
        ],
      },
      {
        group: 'Frenos',
        specs: [
          { name: 'Freno delantero', value: 'Doble disco con ABS' },
          { name: 'Freno trasero', value: 'Disco con ABS' },
        ],
      },
      {
        group: 'Dimensiones',
        specs: [
          { name: 'Peso', value: '223 kg' },
          { name: 'Tanque', value: '19 L' },
        ],
      },
    ],
    benefits: [
      { type: 'practical', title: 'Cruise control', description: 'Viajes largos sin fatiga con control de velocidad crucero integrado.' },
      { type: 'practical', title: 'Quick Shifter', description: 'Cambios ascendentes y descendentes sin usar el embrague para mayor agilidad.' },
      { type: 'emotional', title: 'Motor CP3', description: 'El carácter único del triple cilindro CrossPlane que hace cada kilómetro especial.' },
      { type: 'practical', title: 'Tanque de 19L', description: 'Autonomía extendida para viajes largos sin paradas frecuentes.' },
    ],
    financing: { eligible: true, defaultDownPayment: 20, defaultTerm: 60, monthlyPayment: 350000, termMonths: 60 },
    status: 'active',
    featured: false,
    sortOrder: 7,
  },
  {
    _id: 'yzf-r1',
    _updatedAt: '2026-01-15T00:00:00.000Z',
    name: 'YZF-R1',
    slug: 'yzf-r1',
    year: 2026,
    category: { name: 'Alta Cilindrada', slug: 'alta-cilindrada', parentCategory: 'motos' },
    productType: 'moto',
    price: 12690000,
    currency: 'CRC',
    formattedPrice: '₡12.690.000',
    tagline: 'La leyenda de las supersport',
    images: imgs('YZF-R1', 'yzf-r1'),
    heroImage: img('YZF-R1', 'yzf-r1'),
    shortDescription: 'Supersport de 998cc con 200hp, motor CrossPlane de 4 cilindros, suspensión KYB, frenos UBS ABS 320mm. Pista y calle.',
    description: 'La YZF-R1 es la supersport que definió una era. Motor de 4 cilindros CrossPlane de 998cc con 200hp, inyección YCC-T e YCC-I, suspensión KYB invertida y monocross, frenos de doble disco de 320mm con UBS ABS y un paquete aerodinámico nacido en MotoGP.',
    keySpecs: [
      { icon: 'engine', value: '998cc', label: 'Motor' },
      { icon: 'power', value: '200 HP', label: 'Potencia' },
      { icon: 'weight', value: '201 kg', label: 'Peso' },
      { icon: 'transmission', value: 'YCC-T / YCC-I', label: 'Electrónica' },
    ],
    fullSpecs: [
      {
        group: 'Motor',
        specs: [
          { name: 'Tipo', value: '4 cilindros en línea, DOHC, 16 válvulas, inyección YCC-T e YCC-I' },
          { name: 'Cilindrada', value: '998 cc' },
          { name: 'Potencia máxima', value: '200 HP' },
          { name: 'Arranque', value: 'Eléctrico' },
        ],
      },
      {
        group: 'Chasis / Suspensión',
        specs: [
          { name: 'Suspensión delantera', value: 'Invertida KYB' },
          { name: 'Suspensión trasera', value: 'Monocross KYB' },
          { name: 'Llanta delantera', value: '120/70ZR17' },
          { name: 'Llanta trasera', value: '190/55ZR17' },
        ],
      },
      {
        group: 'Frenos',
        specs: [
          { name: 'Freno delantero', value: 'Doble disco 320mm UBS ABS' },
          { name: 'Freno trasero', value: 'Disco 220mm UBS ABS' },
        ],
      },
      {
        group: 'Dimensiones',
        specs: [
          { name: 'Peso', value: '201 kg' },
        ],
      },
    ],
    benefits: [
      { type: 'emotional', title: 'ADN de MotoGP', description: 'Tecnología derivada directamente de la YZR-M1 de competición.' },
      { type: 'practical', title: '200 HP', description: 'Potencia de nivel mundial controlada por electrónica de última generación.' },
      { type: 'practical', title: 'Suspensión KYB', description: 'Componentes de suspensión de grado profesional para uso en pista y calle.' },
      { type: 'emotional', title: 'Leyenda viva', description: 'Más de dos décadas definiendo el estándar de las supersport a nivel global.' },
    ],
    financing: { eligible: true, defaultDownPayment: 20, defaultTerm: 60, monthlyPayment: 344000, termMonths: 60 },
    status: 'active',
    featured: true,
    sortOrder: 8,
  },
  {
    _id: 'yzf-r1m',
    _updatedAt: '2026-01-15T00:00:00.000Z',
    name: 'YZF-R1M',
    slug: 'yzf-r1m',
    year: 2026,
    category: { name: 'Alta Cilindrada', slug: 'alta-cilindrada', parentCategory: 'motos' },
    productType: 'moto',
    price: 20990000,
    currency: 'CRC',
    formattedPrice: '₡20.990.000',
    tagline: 'La supersport definitiva',
    images: imgs('YZF-R1M', 'yzf-r1m'),
    heroImage: img('YZF-R1M', 'yzf-r1m'),
    shortDescription: 'La versión más exclusiva de la R1: 200hp, suspensión Öhlins Electronic Racing, carenado en fibra de carbono. Sin rivales.',
    description: 'La YZF-R1M es la máxima expresión de la ingeniería Yamaha en la calle. Motor de 998cc con 200hp, suspensión Öhlins Electronic Racing en ambos ejes, carenado en fibra de carbono, llantas 200/55ZR17 trasera y un paquete electrónico que la acerca más a un prototipo de competición que a una moto de producción.',
    keySpecs: [
      { icon: 'engine', value: '998cc', label: 'Motor' },
      { icon: 'power', value: '200 HP', label: 'Potencia' },
      { icon: 'weight', value: '204 kg', label: 'Peso' },
      { icon: 'transmission', value: 'Öhlins ERS', label: 'Suspensión' },
    ],
    fullSpecs: [
      {
        group: 'Motor',
        specs: [
          { name: 'Tipo', value: '4 cilindros en línea, DOHC, 16 válvulas, inyección electrónica' },
          { name: 'Cilindrada', value: '998 cc' },
          { name: 'Potencia máxima', value: '200 HP' },
          { name: 'Arranque', value: 'Eléctrico' },
        ],
      },
      {
        group: 'Chasis / Suspensión',
        specs: [
          { name: 'Suspensión delantera', value: 'Öhlins Electronic Racing' },
          { name: 'Suspensión trasera', value: 'Öhlins Electronic Racing' },
          { name: 'Llanta delantera', value: '120/70ZR17' },
          { name: 'Llanta trasera', value: '200/55ZR17' },
        ],
      },
      {
        group: 'Frenos',
        specs: [
          { name: 'Freno delantero', value: 'Doble disco 320mm con ABS' },
          { name: 'Freno trasero', value: 'Disco 220mm con ABS' },
        ],
      },
      {
        group: 'Dimensiones',
        specs: [
          { name: 'Peso', value: '204 kg' },
        ],
      },
    ],
    benefits: [
      { type: 'emotional', title: 'Öhlins Electronic Racing', description: 'La misma tecnología de suspensión que usan los equipos de WorldSBK.' },
      { type: 'emotional', title: 'Fibra de carbono', description: 'Carenado en fibra de carbono real que reduce peso y aumenta la exclusividad.' },
      { type: 'practical', title: '200 HP de pista', description: 'La potencia y electrónica más cercana a un prototipo de carreras de producción.' },
      { type: 'emotional', title: 'Edición exclusiva', description: 'Producción limitada y acabados que la convierten en una pieza de colección.' },
    ],
    financing: { eligible: true, defaultDownPayment: 20, defaultTerm: 60, monthlyPayment: 567000, termMonths: 60 },
    status: 'active',
    featured: false,
    sortOrder: 9,
  },

  // ─────────────────────────────────────────────
  // MOTOCROSS
  // ─────────────────────────────────────────────
  {
    _id: 'pw50',
    _updatedAt: '2026-01-15T00:00:00.000Z',
    name: 'PW50',
    slug: 'pw50',
    year: 2026,
    category: { name: 'Motocross', slug: 'motocross', parentCategory: 'motos' },
    productType: 'moto',
    price: 1550000,
    currency: 'CRC',
    formattedPrice: '₡1.550.000',
    tagline: 'Donde comienza la pasión',
    images: imgs('PW50', 'pw50'),
    heroImage: img('PW50', 'pw50'),
    shortDescription: 'La moto para los futuros campeones. Motor 2T de 49cc, transmisión automática y un diseño pensado para los más pequeños.',
    description: 'La PW50 es donde nacen los campeones. Motor 2T de 49cc enfriado por aire, transmisión automática, arranque a pedal y un chasis pensado para que los niños aprendan a rodar con seguridad. La puerta de entrada al mundo del motociclismo.',
    priceNote: 'No incluye gastos de inscripción por su naturaleza.',
    keySpecs: [
      { icon: 'engine', value: '49cc', label: 'Motor' },
      { icon: 'power', value: '2T', label: 'Tipo' },
      { icon: 'weight', value: '41 kg', label: 'Peso' },
      { icon: 'transmission', value: 'Automática', label: 'Transmisión' },
    ],
    fullSpecs: [
      {
        group: 'Motor',
        specs: [
          { name: 'Tipo', value: '2T carburada, enfriado por aire, monocilíndrico' },
          { name: 'Cilindrada', value: '49 cc' },
          { name: 'Transmisión', value: 'Automática' },
          { name: 'Arranque', value: 'Pedal' },
        ],
      },
      {
        group: 'Chasis / Suspensión',
        specs: [
          { name: 'Suspensión delantera', value: 'Telescópica' },
          { name: 'Suspensión trasera', value: 'Doble compensador' },
          { name: 'Llanta delantera', value: '2.50-10-4PR' },
          { name: 'Llanta trasera', value: '2.50-10-4PR' },
        ],
      },
      {
        group: 'Frenos',
        specs: [
          { name: 'Freno delantero', value: 'Tambor' },
          { name: 'Freno trasero', value: 'Tambor' },
        ],
      },
      {
        group: 'Dimensiones',
        specs: [
          { name: 'Peso', value: '41 kg' },
        ],
      },
    ],
    benefits: [
      { type: 'emotional', title: 'Primer contacto', description: 'La forma perfecta de introducir a los niños al mundo del motociclismo.' },
      { type: 'practical', title: 'Automática', description: 'Transmisión automática para que se concentren solo en disfrutar el paseo.' },
      { type: 'practical', title: 'Ultra liviana', description: 'Solo 41kg, fácil de manejar y levantar para los más pequeños.' },
    ],
    financing: { eligible: false, defaultDownPayment: 100, defaultTerm: 1 },
    status: 'active',
    featured: false,
    sortOrder: 1,
  },
  {
    _id: 'yz65',
    _updatedAt: '2026-01-15T00:00:00.000Z',
    name: 'YZ65',
    slug: 'yz65',
    year: 2026,
    category: { name: 'Motocross', slug: 'motocross', parentCategory: 'motos' },
    productType: 'moto',
    price: 3790000,
    currency: 'CRC',
    formattedPrice: '₡3.790.000',
    tagline: 'El primer paso en la competición',
    images: imgs('YZ65', 'yz65'),
    heroImage: img('YZ65', 'yz65'),
    shortDescription: 'Motocross de competición de 65cc con motor 2T líquido, suspensión KYB invertida ajustable y frenos de disco. Para jóvenes pilotos.',
    description: 'La YZ65 es la moto de competición para jóvenes pilotos que buscan dar el siguiente paso. Motor 2T de 65cc refrigerado por líquido, suspensión invertida KYB totalmente ajustable, frenos de disco en ambas ruedas y un chasis diseñado para la pista.',
    keySpecs: [
      { icon: 'engine', value: '65cc', label: 'Motor' },
      { icon: 'power', value: '2T Líquido', label: 'Tipo' },
      { icon: 'weight', value: '61 kg', label: 'Peso' },
      { icon: 'transmission', value: '6 velocidades', label: 'Transmisión' },
    ],
    fullSpecs: [
      {
        group: 'Motor',
        specs: [
          { name: 'Tipo', value: '2T carburada, refrigerado por líquido' },
          { name: 'Cilindrada', value: '65 cc' },
          { name: 'Transmisión', value: '6 velocidades' },
          { name: 'Arranque', value: 'Pedal' },
        ],
      },
      {
        group: 'Chasis / Suspensión',
        specs: [
          { name: 'Suspensión delantera', value: 'Invertida KYB ajustable' },
          { name: 'Suspensión trasera', value: 'Monocompensador ajustable' },
          { name: 'Llanta delantera', value: '60/100-14' },
          { name: 'Llanta trasera', value: '80/100-12' },
        ],
      },
      {
        group: 'Frenos',
        specs: [
          { name: 'Freno delantero', value: 'Disco 198mm' },
          { name: 'Freno trasero', value: 'Disco 190mm' },
        ],
      },
      {
        group: 'Dimensiones',
        specs: [
          { name: 'Peso', value: '61 kg' },
        ],
      },
    ],
    benefits: [
      { type: 'emotional', title: 'ADN de competición', description: 'Diseñada con la misma filosofía que las YZ de categorías superiores.' },
      { type: 'practical', title: 'Suspensión KYB ajustable', description: 'Componentes profesionales totalmente ajustables para cada piloto y pista.' },
      { type: 'practical', title: 'Motor 2T líquido', description: 'Potencia explosiva con refrigeración líquida para sesiones largas de práctica.' },
    ],
    financing: { eligible: false, defaultDownPayment: 100, defaultTerm: 1 },
    status: 'active',
    featured: false,
    sortOrder: 2,
  },
  {
    _id: 'yz85',
    _updatedAt: '2026-01-15T00:00:00.000Z',
    name: 'YZ85',
    slug: 'yz85',
    year: 2026,
    category: { name: 'Motocross', slug: 'motocross', parentCategory: 'motos' },
    productType: 'moto',
    price: 3990000,
    currency: 'CRC',
    formattedPrice: '₡3.990.000',
    tagline: 'Potencia junior de competición',
    images: imgs('YZ85', 'yz85'),
    heroImage: img('YZ85', 'yz85'),
    shortDescription: 'Motocross de 85cc con motor 2T líquido, suspensión KYB invertida y frenos de disco. El arma para la categoría junior.',
    description: 'La YZ85 es la moto de competición para pilotos junior que están listos para velocidades más altas. Motor 2T de 85cc refrigerado por líquido, suspensión invertida KYB, frenos de disco de 220mm y 190mm, y un chasis probado en competición.',
    priceNote: 'No incluye gastos de inscripción por su naturaleza.',
    keySpecs: [
      { icon: 'engine', value: '85cc', label: 'Motor' },
      { icon: 'power', value: '2T Líquido', label: 'Tipo' },
      { icon: 'weight', value: '75 kg', label: 'Peso' },
      { icon: 'transmission', value: '6 velocidades', label: 'Transmisión' },
    ],
    fullSpecs: [
      {
        group: 'Motor',
        specs: [
          { name: 'Tipo', value: '2T carburada, refrigerado por líquido' },
          { name: 'Cilindrada', value: '85 cc' },
          { name: 'Transmisión', value: '6 velocidades' },
          { name: 'Arranque', value: 'Pedal' },
        ],
      },
      {
        group: 'Chasis / Suspensión',
        specs: [
          { name: 'Suspensión delantera', value: 'Invertida KYB' },
          { name: 'Suspensión trasera', value: 'KYB' },
          { name: 'Llanta delantera', value: '70/100-19' },
          { name: 'Llanta trasera', value: '90/100-16' },
        ],
      },
      {
        group: 'Frenos',
        specs: [
          { name: 'Freno delantero', value: 'Disco 220mm' },
          { name: 'Freno trasero', value: 'Disco 190mm' },
        ],
      },
      {
        group: 'Dimensiones',
        specs: [
          { name: 'Peso', value: '75 kg' },
        ],
      },
    ],
    benefits: [
      { type: 'emotional', title: 'Competición real', description: 'La moto elegida por los futuros campeones en categorías junior a nivel mundial.' },
      { type: 'practical', title: 'Suspensión KYB invertida', description: 'Componentes de suspensión profesional para rendimiento de pista serio.' },
      { type: 'practical', title: 'Frenos de disco duales', description: 'Poder de frenado profesional con discos de 220mm y 190mm.' },
    ],
    financing: { eligible: false, defaultDownPayment: 100, defaultTerm: 1 },
    status: 'active',
    featured: false,
    sortOrder: 3,
  },
  {
    _id: 'yz125',
    _updatedAt: '2026-01-15T00:00:00.000Z',
    name: 'YZ125',
    slug: 'yz125',
    year: 2026,
    category: { name: 'Motocross', slug: 'motocross', parentCategory: 'motos' },
    productType: 'moto',
    price: 4990000,
    currency: 'CRC',
    formattedPrice: '₡4.990.000',
    tagline: 'La 125 de dos tiempos definitiva',
    images: imgs('YZ125', 'yz125'),
    heroImage: img('YZ125', 'yz125'),
    shortDescription: 'Motocross 2T de 125cc con suspensión KYB invertida, frenos de disco 270mm/245mm y solo 94kg. Pura competición.',
    description: 'La YZ125 es la referencia en la categoría 125cc 2T. Motor refrigerado por líquido que entrega potencia explosiva, suspensión KYB invertida y monocompensador, frenos de disco de 270mm y 245mm, y un peso de solo 94kg para la mayor agilidad en pista.',
    priceNote: 'No incluye gastos de inscripción por su naturaleza.',
    keySpecs: [
      { icon: 'engine', value: '125cc', label: 'Motor' },
      { icon: 'power', value: '2T Líquido', label: 'Tipo' },
      { icon: 'weight', value: '94 kg', label: 'Peso' },
      { icon: 'transmission', value: '6 velocidades', label: 'Transmisión' },
    ],
    fullSpecs: [
      {
        group: 'Motor',
        specs: [
          { name: 'Tipo', value: '2T, refrigerado por líquido' },
          { name: 'Cilindrada', value: '125 cc' },
          { name: 'Transmisión', value: '6 velocidades' },
          { name: 'Arranque', value: 'Pedal' },
        ],
      },
      {
        group: 'Chasis / Suspensión',
        specs: [
          { name: 'Suspensión delantera', value: 'Invertida KYB' },
          { name: 'Suspensión trasera', value: 'Monocompensador KYB' },
          { name: 'Llanta delantera', value: '80/100-21' },
          { name: 'Llanta trasera', value: '100/90-19' },
        ],
      },
      {
        group: 'Frenos',
        specs: [
          { name: 'Freno delantero', value: 'Disco 270mm' },
          { name: 'Freno trasero', value: 'Disco 245mm' },
        ],
      },
      {
        group: 'Dimensiones',
        specs: [
          { name: 'Peso', value: '94 kg' },
        ],
      },
    ],
    benefits: [
      { type: 'emotional', title: 'Pura 2 tiempos', description: 'La experiencia visceral del motor 2T que no tiene comparación.' },
      { type: 'practical', title: 'Solo 94kg', description: 'La relación peso-potencia más agresiva de su categoría para máxima agilidad.' },
      { type: 'practical', title: 'Suspensión KYB profesional', description: 'Horquilla invertida y monocompensador KYB para rendimiento de campeonato.' },
    ],
    financing: { eligible: false, defaultDownPayment: 100, defaultTerm: 1 },
    status: 'active',
    featured: false,
    sortOrder: 4,
  },
  {
    _id: 'yz250',
    _updatedAt: '2026-01-15T00:00:00.000Z',
    name: 'YZ250',
    slug: 'yz250',
    year: 2026,
    category: { name: 'Motocross', slug: 'motocross', parentCategory: 'motos' },
    productType: 'moto',
    price: 5590000,
    currency: 'CRC',
    formattedPrice: '₡5.590.000',
    tagline: 'La leyenda 2T de cuarto litro',
    images: imgs('YZ250', 'yz250'),
    heroImage: img('YZ250', 'yz250'),
    shortDescription: 'Motocross 2T de 249cc, la máquina de competición más cruda. Suspensión KYB, frenos de disco y solo 102kg.',
    description: 'La YZ250 es la leyenda 2T que se niega a morir. Motor 2T de 249cc refrigerado por líquido, 5 velocidades, suspensión invertida KYB y monocross KYB, frenos de disco de 270mm y 245mm, y solo 102kg de pura brutalidad motocross.',
    priceNote: 'No incluye gastos de inscripción por su naturaleza.',
    keySpecs: [
      { icon: 'engine', value: '249cc', label: 'Motor' },
      { icon: 'power', value: '2T Líquido', label: 'Tipo' },
      { icon: 'weight', value: '102 kg', label: 'Peso' },
      { icon: 'transmission', value: '5 velocidades', label: 'Transmisión' },
    ],
    fullSpecs: [
      {
        group: 'Motor',
        specs: [
          { name: 'Tipo', value: '2T, refrigerado por líquido' },
          { name: 'Cilindrada', value: '249 cc' },
          { name: 'Transmisión', value: '5 velocidades' },
          { name: 'Arranque', value: 'Pedal' },
        ],
      },
      {
        group: 'Chasis / Suspensión',
        specs: [
          { name: 'Suspensión delantera', value: 'Invertida KYB' },
          { name: 'Suspensión trasera', value: 'KYB monocross' },
          { name: 'Llanta delantera', value: '80/100-21' },
          { name: 'Llanta trasera', value: '100/90-19' },
        ],
      },
      {
        group: 'Frenos',
        specs: [
          { name: 'Freno delantero', value: 'Disco 270mm' },
          { name: 'Freno trasero', value: 'Disco 245mm' },
        ],
      },
      {
        group: 'Dimensiones',
        specs: [
          { name: 'Peso', value: '102 kg' },
        ],
      },
    ],
    benefits: [
      { type: 'emotional', title: 'Potencia bruta 2T', description: 'La entrega de potencia más visceral y emocionante del motocross.' },
      { type: 'practical', title: 'Liviana y ágil', description: '102kg para una agilidad que los 4T no pueden igualar.' },
      { type: 'emotional', title: 'Legado de competición', description: 'Décadas de victorias en el motocross mundial respaldan esta máquina.' },
    ],
    financing: { eligible: false, defaultDownPayment: 100, defaultTerm: 1 },
    status: 'active',
    featured: false,
    sortOrder: 5,
  },
  {
    _id: 'yz250f',
    _updatedAt: '2026-01-15T00:00:00.000Z',
    name: 'YZ250F',
    slug: 'yz250f',
    year: 2026,
    category: { name: 'Motocross', slug: 'motocross', parentCategory: 'motos' },
    productType: 'moto',
    price: 5890000,
    currency: 'CRC',
    formattedPrice: '₡5.890.000',
    tagline: 'Tecnología 4T de competición',
    images: imgs('YZ250F', 'yz250f'),
    heroImage: img('YZ250F', 'yz250f'),
    shortDescription: 'Motocross 4T de 249cc con DOHC, inyección, válvulas de titanio, culata invertida y Power Tuner. Tecnología de campeonato.',
    description: 'La YZ250F redefine el motocross 4T con motor DOHC de 249cc de inyección electrónica, válvulas de titanio, culata invertida para máxima compacidad, arranque eléctrico y Power Tuner para ajustar la ECU desde tu smartphone.',
    priceNote: 'No incluye gastos de inscripción por su naturaleza.',
    keySpecs: [
      { icon: 'engine', value: '249cc', label: 'Motor' },
      { icon: 'power', value: '4T DOHC FI', label: 'Tipo' },
      { icon: 'weight', value: 'Titanio', label: 'Válvulas' },
      { icon: 'transmission', value: '5 velocidades', label: 'Transmisión' },
    ],
    fullSpecs: [
      {
        group: 'Motor',
        specs: [
          { name: 'Tipo', value: '4T, refrigerado por líquido, DOHC, inyección electrónica, 4 válvulas de titanio' },
          { name: 'Cilindrada', value: '249 cc' },
          { name: 'Culata', value: 'Invertida' },
          { name: 'Electrónica', value: 'Power Tuner (ajuste ECU vía smartphone)' },
          { name: 'Transmisión', value: '5 velocidades' },
          { name: 'Arranque', value: 'Eléctrico' },
        ],
      },
      {
        group: 'Chasis / Suspensión',
        specs: [
          { name: 'Suspensión', value: 'Componentes de alto rendimiento' },
        ],
      },
      {
        group: 'Frenos',
        specs: [
          { name: 'Frenos', value: 'Disco delantero y trasero' },
        ],
      },
      {
        group: 'Dimensiones',
        specs: [
          { name: 'Configuración', value: 'Motocross de competición' },
        ],
      },
    ],
    benefits: [
      { type: 'practical', title: 'Power Tuner', description: 'Ajustá la ECU desde tu smartphone para optimizar el motor en cada pista.' },
      { type: 'practical', title: 'Válvulas de titanio', description: 'Menor peso rotativo para mayor respuesta y revoluciones más altas.' },
      { type: 'emotional', title: 'Culata invertida', description: 'Diseño de vanguardia que centraliza masas y mejora la agilidad.' },
      { type: 'practical', title: 'Arranque eléctrico', description: 'Arranque instantáneo sin esfuerzo, incluso después de una caída.' },
    ],
    financing: { eligible: false, defaultDownPayment: 100, defaultTerm: 1 },
    status: 'active',
    featured: false,
    sortOrder: 6,
  },
  {
    _id: 'yz450f',
    _updatedAt: '2026-01-15T00:00:00.000Z',
    name: 'YZ450F',
    slug: 'yz450f',
    year: 2026,
    category: { name: 'Motocross', slug: 'motocross', parentCategory: 'motos' },
    productType: 'moto',
    price: 6190000,
    currency: 'CRC',
    formattedPrice: '₡6.190.000',
    tagline: 'El arma definitiva del motocross',
    images: imgs('YZ450F', 'yz450f'),
    heroImage: img('YZ450F', 'yz450f'),
    shortDescription: 'La motocross tope de línea: 450cc inyectada, DOHC, válvulas de titanio, LCS, suspensión KYB y arranque eléctrico.',
    description: 'La YZ450F es la máquina más avanzada del motocross de producción. Motor inyectado de 450cc con DOHC, 4 válvulas de titanio, sistema LCS (Launch Control System), suspensión invertida KYB y monocross KYB, frenos de disco Dunlop y arranque eléctrico. Todo lo que necesitás para ganar.',
    priceNote: 'No incluye gastos de inscripción por su naturaleza.',
    keySpecs: [
      { icon: 'engine', value: '450cc', label: 'Motor' },
      { icon: 'power', value: '4T DOHC FI', label: 'Tipo' },
      { icon: 'weight', value: '109 kg', label: 'Peso' },
      { icon: 'transmission', value: '5 velocidades', label: 'Transmisión' },
    ],
    fullSpecs: [
      {
        group: 'Motor',
        specs: [
          { name: 'Tipo', value: 'Inyectado, refrigerado por líquido, DOHC, 4 válvulas de titanio, LCS' },
          { name: 'Cilindrada', value: '450 cc' },
          { name: 'Transmisión', value: '5 velocidades' },
          { name: 'Arranque', value: 'Eléctrico' },
        ],
      },
      {
        group: 'Chasis / Suspensión',
        specs: [
          { name: 'Suspensión delantera', value: 'Invertida KYB' },
          { name: 'Suspensión trasera', value: 'KYB monocross' },
          { name: 'Llanta delantera', value: '80/100-21 Dunlop' },
          { name: 'Llanta trasera', value: '120/80-19 Dunlop' },
        ],
      },
      {
        group: 'Frenos',
        specs: [
          { name: 'Freno delantero', value: 'Disco 270mm' },
          { name: 'Freno trasero', value: 'Disco 240mm' },
        ],
      },
      {
        group: 'Dimensiones',
        specs: [
          { name: 'Peso', value: '109 kg' },
        ],
      },
    ],
    benefits: [
      { type: 'practical', title: 'Launch Control (LCS)', description: 'Sistema de control de largada para salidas perfectas en competición.' },
      { type: 'practical', title: 'Válvulas de titanio', description: 'Máxima eficiencia volumétrica para potencia superior en toda la banda.' },
      { type: 'emotional', title: 'Dominio total', description: 'La moto que más carreras ha ganado en la categoría MX1/450cc.' },
      { type: 'practical', title: 'Suspensión KYB completa', description: 'Horquilla invertida y monocross KYB para el rendimiento más alto.' },
    ],
    financing: { eligible: false, defaultDownPayment: 100, defaultTerm: 1 },
    status: 'active',
    featured: false,
    sortOrder: 7,
  },

  // ─────────────────────────────────────────────
  // ENDURO
  // ─────────────────────────────────────────────
  {
    _id: 'yz250x',
    _updatedAt: '2026-01-15T00:00:00.000Z',
    name: 'YZ250X',
    slug: 'yz250x',
    year: 2026,
    category: { name: 'Enduro', slug: 'enduro', parentCategory: 'motos' },
    productType: 'moto',
    price: 5790000,
    currency: 'CRC',
    formattedPrice: '₡5.790.000',
    tagline: 'Enduro 2T de competición',
    images: imgs('YZ250X', 'yz250x'),
    heroImage: img('YZ250X', 'yz250x'),
    shortDescription: 'Enduro 2T de 249cc con llanta trasera de 18", suspensión KYB y frenos de disco. La máquina para competición enduro.',
    description: 'La YZ250X toma la base probada de la YZ250 y la adapta para el enduro con llanta trasera de 18 pulgadas, suspensión KYB invertida y monocompensador calibrada para senderos, frenos de disco de 270mm y 240mm, y el motor 2T de 249cc más confiable del segmento.',
    priceNote: 'No incluye gastos de inscripción por su naturaleza.',
    keySpecs: [
      { icon: 'engine', value: '249cc', label: 'Motor' },
      { icon: 'power', value: '2T Líquido', label: 'Tipo' },
      { icon: 'weight', value: '104 kg', label: 'Peso' },
      { icon: 'transmission', value: '5 velocidades', label: 'Transmisión' },
    ],
    fullSpecs: [
      {
        group: 'Motor',
        specs: [
          { name: 'Tipo', value: '2T, refrigerado por líquido' },
          { name: 'Cilindrada', value: '249 cc' },
          { name: 'Transmisión', value: '5 velocidades' },
          { name: 'Arranque', value: 'Pedal' },
        ],
      },
      {
        group: 'Chasis / Suspensión',
        specs: [
          { name: 'Suspensión delantera', value: 'Invertida KYB' },
          { name: 'Suspensión trasera', value: 'KYB monocompensador' },
          { name: 'Llanta delantera', value: '80/100-21' },
          { name: 'Llanta trasera', value: '110/100-18' },
        ],
      },
      {
        group: 'Frenos',
        specs: [
          { name: 'Freno delantero', value: 'Disco 270mm' },
          { name: 'Freno trasero', value: 'Disco 240mm' },
        ],
      },
      {
        group: 'Dimensiones',
        specs: [
          { name: 'Peso', value: '104 kg' },
        ],
      },
    ],
    benefits: [
      { type: 'practical', title: 'Llanta trasera 18"', description: 'Mayor tracción y capacidad de absorción en terreno técnico de enduro.' },
      { type: 'emotional', title: 'Potencia 2T pura', description: 'La entrega explosiva del motor 2T que domina los senderos más exigentes.' },
      { type: 'practical', title: 'Suspensión calibrada', description: 'KYB ajustada específicamente para las exigencias del enduro de competición.' },
    ],
    financing: { eligible: false, defaultDownPayment: 100, defaultTerm: 1 },
    status: 'active',
    featured: false,
    sortOrder: 1,
  },

  // ─────────────────────────────────────────────
  // CUADRACICLOS & MULAS
  // ─────────────────────────────────────────────
  {
    _id: 'yfz50',
    _updatedAt: '2026-04-16T00:00:00.000Z',
    name: 'YFZ50',
    slug: 'yfz50',
    year: 2026,
    category: { name: 'Cuadraciclos', slug: 'cuadraciclos', parentCategory: 'cuadraciclos' },
    productType: 'cuadraciclo',
    price: 2295000,
    currency: 'CRC',
    formattedPrice: '₡2.295.000',
    tagline: 'Piloto por primera vez, recuerdos para toda la vida',
    images: imgs('YFZ50', 'yfz50'),
    heroImage: img('YFZ50', 'yfz50'),
    shortDescription: 'Vehiculo con aspecto deportivo inspirado en el YFZ450R, con motor de 49 cc de bajo mantenimiento y transmision automatica.',
    description:
      'El YFZ50 esta disenado para iniciar con confianza: arranque electrico, limitadores del motor y mantenimiento sencillo gracias al filtro de aire de acceso rapido sin herramientas.',
    keySpecs: [
      { icon: 'engine', value: '49 cc', label: 'Cilindrada' },
      { icon: 'power', value: '4 tiempos', label: 'Motor' },
      { icon: 'transmission', value: 'Automatica', label: 'Transmision' },
      { icon: 'weight', value: '100 kg', label: 'Peso' },
    ],
    fullSpecs: [
      {
        group: 'Motor',
        specs: [
          { name: 'Tipo', value: '4 tiempos, carburado, enfriado por aire, 2 valvulas' },
          { name: 'Cilindrada', value: '49 cc' },
          { name: 'Arranque', value: 'Electrico' },
          { name: 'Transmision', value: 'Automatica' },
        ],
      },
      {
        group: 'Chasis y Frenos',
        specs: [
          { name: 'Llantas', value: 'Delantera AT16 x 6.5-7 / Trasera AT16 x 7-7' },
          { name: 'Suspension', value: 'Delantera independiente y trasera monocompensador' },
          { name: 'Frenos', value: 'Delantero y trasero de tambor' },
          { name: 'Peso total', value: '100 kg' },
        ],
      },
    ],
    benefits: [
      { type: 'practical', title: 'Inicio seguro', description: 'Motor accesible y controles pensados para primeros pilotos.' },
      { type: 'practical', title: 'Mantenimiento simple', description: 'Filtro de aire de acceso rapido sin herramientas.' },
      { type: 'emotional', title: 'Estilo deportivo', description: 'Diseno inspirado en el YFZ450R.' },
    ],
    priceNote:
      '*No incluye gastos de inscripcion por su naturaleza. Precios promocion sujetos a cambios, restricciones y condiciones en punto de venta.',
    financing: { eligible: true, defaultDownPayment: 20, defaultTerm: 60 },
    status: 'active',
    featured: false,
    sortOrder: 1,
  },
  {
    _id: 'raptor110',
    _updatedAt: '2026-04-16T00:00:00.000Z',
    name: 'Raptor110',
    slug: 'raptor110',
    year: 2026,
    category: { name: 'Cuadraciclos', slug: 'cuadraciclos', parentCategory: 'cuadraciclos' },
    productType: 'cuadraciclo',
    price: 2890000,
    currency: 'CRC',
    formattedPrice: '₡2.890.000',
    tagline: 'Llamado a nuevos pilotos',
    images: imgs('Raptor110', 'raptor110'),
    heroImage: img('Raptor110', 'raptor110'),
    shortDescription: 'El Raptor 110 esta disenado para comodidad y control, con ergonomia espaciosa, asiento confortable y apoyapies anchos.',
    description:
      'Con motor de 112 cc, inyeccion electronica y arranque electrico, ofrece diversion confiable. Los indicadores de reversa, neutro, motor y combustible dan mayor confianza en todo momento.',
    keySpecs: [
      { icon: 'engine', value: '112 cc', label: 'Cilindrada' },
      { icon: 'power', value: 'Inyectado', label: 'Motor' },
      { icon: 'transmission', value: 'CVT con reversa', label: 'Transmision' },
      { icon: 'weight', value: '130 kg', label: 'Peso' },
    ],
    fullSpecs: [
      {
        group: 'Motor',
        specs: [
          { name: 'Tipo', value: 'Inyectado, enfriado por aire, 2 valvulas' },
          { name: 'Cilindrada', value: '112 cc' },
          { name: 'Arranque', value: 'Electrico' },
          { name: 'Transmision', value: 'Automatico con reversa (CVT; F, N, R)' },
        ],
      },
      {
        group: 'Chasis y Frenos',
        specs: [
          { name: 'Llantas', value: 'Delantera AT18 x 7-8 / Trasera AT18 x 9-8' },
          { name: 'Suspension', value: 'Delantera independiente y trasera monoamortiguador' },
          { name: 'Frenos', value: 'Delantero y trasero de tambor' },
          { name: 'Peso total', value: '130 kg' },
        ],
      },
    ],
    benefits: [
      { type: 'practical', title: 'EFI confiable', description: 'Rendimiento solido con bajo mantenimiento.' },
      { type: 'practical', title: 'Mas informacion al piloto', description: 'Indicadores de reversa, neutro, motor y combustible.' },
      { type: 'emotional', title: 'Estilo Raptor', description: 'Imagen agresiva y divertida para nuevos pilotos.' },
    ],
    priceNote:
      '*No incluye gastos de inscripcion por su naturaleza. Precios promocion sujetos a cambios, restricciones y condiciones en punto de venta.',
    financing: { eligible: true, defaultDownPayment: 20, defaultTerm: 60 },
    status: 'active',
    featured: false,
    sortOrder: 2,
  },
  {
    _id: 'yfz450r',
    _updatedAt: '2026-04-16T00:00:00.000Z',
    name: 'YFZ450R',
    slug: 'yfz450r',
    year: 2026,
    category: { name: 'Cuadraciclos', slug: 'cuadraciclos', parentCategory: 'cuadraciclos' },
    productType: 'cuadraciclo',
    price: 7890000,
    currency: 'CRC',
    formattedPrice: '₡7.890.000',
    tagline: 'Innumerables veces Campeon de Costa Rica',
    images: imgs('YFZ450R', 'yfz450r'),
    heroImage: img('YFZ450R', 'yfz450r'),
    shortDescription:
      'El YFZ450R es el ATV deportivo tecnologicamente mas avanzado, con motor de 449 cc, inyeccion y chasis liviano de competencia.',
    description:
      'Innumerables veces campeon de Costa Rica, combina alta tecnologia, 5 valvulas de titanio, potencia race-ready y una plataforma profesional de aluminio fundido y acero para desempeno ganador.',
    keySpecs: [
      { icon: 'engine', value: '449 cc', label: 'Cilindrada' },
      { icon: 'power', value: 'DOHC 4T, 5 valvulas', label: 'Motor' },
      { icon: 'transmission', value: '5 velocidades', label: 'Transmision' },
      { icon: 'weight', value: '184 kg', label: 'Peso' },
    ],
    fullSpecs: [
      {
        group: 'Motor',
        specs: [
          { name: 'Tipo', value: 'Race-Ready, enfriado por liquido, DOHC 4 tiempos, 5 valvulas de titanio' },
          { name: 'Cilindrada', value: '449 cc' },
          { name: 'Transmision', value: '5 velocidades' },
          { name: 'Arranque', value: 'Electrico' },
        ],
      },
      {
        group: 'Chasis y Frenos',
        specs: [
          { name: 'Llantas', value: 'Delantera AT21 x 7-10 / Trasera AT20 x 10-9' },
          { name: 'Suspension', value: 'Delantera independiente banada en Kashima con control de rebote y trasera monocross con control de rebote' },
          { name: 'Frenos', value: 'Delantero doble disco hidraulico y trasero disco hidraulico wave style' },
          { name: 'Peso total', value: '184 kg' },
        ],
      },
    ],
    benefits: [
      { type: 'emotional', title: 'ADN campeon', description: 'ATV ganador en competencia nacional.' },
      { type: 'practical', title: 'Ingenieria race-ready', description: 'Motor de alto giro con tecnologia de competencia.' },
      { type: 'practical', title: 'Chasis profesional', description: 'Estructura liviana para maxima precision y control.' },
    ],
    priceNote:
      '*No incluye gastos de inscripcion por su naturaleza. Precios promocion sujetos a cambios, restricciones y condiciones en punto de venta.',
    financing: { eligible: true, defaultDownPayment: 20, defaultTerm: 60 },
    status: 'active',
    featured: true,
    sortOrder: 3,
  },
  {
    _id: 'raptor-700r-se',
    _updatedAt: '2026-04-16T00:00:00.000Z',
    name: 'Raptor 700R SE',
    slug: 'raptor-700r-se',
    year: 2026,
    category: { name: 'Cuadraciclos', slug: 'cuadraciclos', parentCategory: 'cuadraciclos' },
    productType: 'cuadraciclo',
    price: 8090000,
    currency: 'CRC',
    formattedPrice: '₡8.090.000',
    tagline: 'Poder, estabilidad y excelentes suspensiones',
    images: imgs('Raptor 700R SE', 'raptor-700r-se'),
    heroImage: img('Raptor 700R SE', 'raptor-700r-se'),
    shortDescription:
      'Poder de gran calibre con motor de 689 cc, inyeccion electronica y chasis liviano de acero y aluminio para respuesta deportiva superior.',
    description:
      'La Raptor 700R SE combina gran potencia, suspension avanzada y manejo inspirado en YFZ. Su estructura liviana y resistente ofrece control sobresaliente en senderos exigentes.',
    keySpecs: [
      { icon: 'engine', value: '689 cc', label: 'Cilindrada' },
      { icon: 'power', value: 'Inyeccion electronica', label: 'Motor' },
      { icon: 'transmission', value: '5 vel + reversa', label: 'Transmision' },
      { icon: 'weight', value: '191 kg', label: 'Peso' },
    ],
    fullSpecs: [
      {
        group: 'Motor',
        specs: [
          { name: 'Tipo', value: '4 tiempos, enfriado por liquido, 4 valvulas, inyeccion electronica' },
          { name: 'Cilindrada', value: '689 cc' },
          { name: 'Transmision', value: '5 velocidades con reversa' },
          { name: 'Arranque', value: 'Electrico' },
        ],
      },
      {
        group: 'Chasis y Frenos',
        specs: [
          { name: 'Llantas', value: 'Delantera AT22 x 7-10 / Trasera AT20 x 10-9' },
          { name: 'Suspension', value: 'Delantera independiente y trasera monocross, ambas con control de rebote' },
          { name: 'Frenos', value: 'Delantero doble disco hidraulico y trasero disco hidraulico' },
          { name: 'Peso total', value: '191 kg' },
        ],
      },
    ],
    benefits: [
      { type: 'emotional', title: 'Potencia dominante', description: 'El Raptor mas potente para conduccion deportiva extrema.' },
      { type: 'practical', title: 'Chasis liviano', description: 'Estructura hibrida para agilidad y resistencia.' },
      { type: 'practical', title: 'Suspension avanzada', description: 'Absorbe terreno duro sin perder control.' },
    ],
    priceNote: '*No incluyen accesorios. Precios promocion sujetos a cambios, restricciones y condiciones en punto de venta.',
    financing: { eligible: true, defaultDownPayment: 20, defaultTerm: 60 },
    status: 'active',
    featured: true,
    sortOrder: 4,
  },
  {
    _id: 'kodiak-450-std',
    _updatedAt: '2026-04-16T00:00:00.000Z',
    name: 'Kodiak 450 STD',
    slug: 'kodiak-450-std',
    year: 2026,
    category: { name: 'Cuadraciclos', slug: 'cuadraciclos', parentCategory: 'cuadraciclos' },
    productType: 'cuadraciclo',
    price: 7969000,
    salePrice: 5650000,
    currency: 'CRC',
    formattedPrice: '₡7.969.000',
    tagline: 'Hazlo todo',
    images: imgs('Kodiak 450 STD', 'kodiak-450-std'),
    heroImage: img('Kodiak 450 STD', 'kodiak-450-std'),
    shortDescription:
      'El Kodiak 450 ofrece transmision Ultramatic y traccion On-Command 2WD/4WD para capacidad real en terrenos dificiles.',
    description:
      'Construido desde cero para manejo preciso y maniobrable, con suspension independiente y gran comodidad para trabajo y aventura.',
    keySpecs: [
      { icon: 'engine', value: '421 cc', label: 'Cilindrada' },
      { icon: 'power', value: 'Inyectado SOHC', label: 'Motor' },
      { icon: 'transmission', value: 'Ultramatic 2WD/4WD', label: 'Transmision' },
      { icon: 'weight', value: '4x4', label: 'Traccion' },
    ],
    fullSpecs: [
      {
        group: 'Motor y Transmision',
        specs: [
          { name: 'Motor', value: 'Inyectado, SOHC, 2 valvulas, enfriado por liquido' },
          { name: 'Cilindrada', value: '421 cc' },
          { name: 'Transmision', value: 'Automatico Ultramatic (H/L/N/R/P), correa en V, seleccion 2WD y 4WD' },
          { name: 'Arranque', value: 'Electrico' },
        ],
      },
      {
        group: 'Chasis y Frenos',
        specs: [
          { name: 'Suspension', value: 'Delantera y trasera doble brazo independiente' },
          { name: 'Frenos', value: 'Delantero disco hidraulico, trasero multidisco humedo en la transmision' },
        ],
      },
    ],
    benefits: [
      { type: 'practical', title: 'Capacidad utilitaria', description: 'Listo para trabajo duro en terreno complejo.' },
      { type: 'practical', title: 'Conduccion estable', description: 'Chasis compacto para mejor control y maniobra.' },
      { type: 'emotional', title: 'Versatilidad total', description: 'Rinde igual de bien en trabajo y tiempo libre.' },
    ],
    priceNote:
      '*No incluyen accesorios. Precio valido para modelo 2025 hasta agotar existencias. Precio incluye gastos de inscripcion. Aplican restricciones.',
    financing: {
      eligible: true,
      defaultDownPayment: 20,
      defaultTerm: 60,
      monthlyPayment: 155000,
      termMonths: 60,
    },
    status: 'active',
    featured: true,
    sortOrder: 5,
  },
  {
    _id: 'kodiak-450-eps',
    _updatedAt: '2026-04-16T00:00:00.000Z',
    name: 'Kodiak 450 EPS',
    slug: 'kodiak-450-eps',
    year: 2026,
    category: { name: 'Cuadraciclos', slug: 'cuadraciclos', parentCategory: 'cuadraciclos' },
    productType: 'cuadraciclo',
    price: 8375000,
    salePrice: 6400000,
    currency: 'CRC',
    formattedPrice: '₡8.375.000',
    tagline: 'El arte de hacer lo extraordinario',
    images: imgs('Kodiak 450 EPS', 'kodiak-450-eps'),
    heroImage: img('Kodiak 450 EPS', 'kodiak-450-eps'),
    shortDescription:
      'Kodiak 450 EPS combina durabilidad Yamaha con direccion asistida para trabajar en condiciones extremas con mayor comodidad.',
    description:
      'Su sistema On-Command permite alternar entre 4x2 y 4x4 con un boton, y la transmision Ultramatic hace cada jornada mas relajada y eficiente.',
    keySpecs: [
      { icon: 'engine', value: '421 cc', label: 'Cilindrada' },
      { icon: 'power', value: 'Inyectado SOHC', label: 'Motor' },
      { icon: 'transmission', value: 'Ultramatic 2WD/4WD', label: 'Transmision' },
      { icon: 'weight', value: 'EPS', label: 'Direccion' },
    ],
    fullSpecs: [
      {
        group: 'Motor y Transmision',
        specs: [
          { name: 'Motor', value: 'Inyectado, SOHC, 2 valvulas, enfriado por liquido' },
          { name: 'Cilindrada', value: '421 cc' },
          { name: 'Transmision', value: 'Automatico Ultramatic (H/L/N/R/P), correa en V, seleccion 2WD y 4WD' },
          { name: 'Arranque', value: 'Electrico' },
        ],
      },
      {
        group: 'Chasis y Frenos',
        specs: [
          { name: 'Suspension', value: 'Delantera y trasera doble brazo independiente' },
          { name: 'Frenos', value: 'Delantero disco hidraulico, trasero multidisco humedo en la transmision' },
        ],
      },
    ],
    benefits: [
      { type: 'practical', title: 'Direccion asistida EPS', description: 'Menor fatiga y mejor control en trabajo prolongado.' },
      { type: 'practical', title: 'On-Command', description: 'Cambio facil entre 4x2 y 4x4 segun terreno.' },
      { type: 'emotional', title: 'Hecho para durar', description: 'Durabilidad Yamaha para faenas exigentes.' },
    ],
    priceNote: '*No incluyen accesorios. Precio incluye gastos de inscripcion. Foto incluye accesorios adicionales no contemplados en el precio. Aplican restricciones.',
    financing: {
      eligible: true,
      defaultDownPayment: 20,
      defaultTerm: 60,
      monthlyPayment: 175000,
      termMonths: 60,
    },
    status: 'active',
    featured: true,
    sortOrder: 6,
  },
  {
    _id: 'grizzly-700-xtr',
    _updatedAt: '2026-04-16T00:00:00.000Z',
    name: 'Grizzly 700 XTR',
    slug: 'grizzly-700-xtr',
    year: 2026,
    category: { name: 'Cuadraciclos', slug: 'cuadraciclos', parentCategory: 'cuadraciclos' },
    productType: 'cuadraciclo',
    price: 10290000,
    currency: 'CRC',
    formattedPrice: '₡10.290.000',
    tagline: 'Una fuerza de la naturaleza',
    images: imgs('Grizzly 700 XTR', 'grizzly-700-xtr'),
    heroImage: img('Grizzly 700 XTR', 'grizzly-700-xtr'),
    shortDescription:
      'El Grizzly 700 XTR combina transmision Ultramatic, On-Command 2WD/4WD/bloqueo y direccion asistida para enfrentar el off-road mas complejo.',
    description:
      'Con frenos de disco en las 4 ruedas, suspension independiente ajustable e instrumentacion digital, entrega control, comodidad y capacidad real para trabajo y exploracion.',
    keySpecs: [
      { icon: 'engine', value: '686 cc', label: 'Cilindrada' },
      { icon: 'power', value: 'SOHC 4T', label: 'Motor' },
      { icon: 'transmission', value: 'Ultramatic + On-Command', label: 'Transmision' },
      { icon: 'weight', value: 'EPS', label: 'Direccion' },
    ],
    fullSpecs: [
      {
        group: 'Motor y Transmision',
        specs: [
          { name: 'Motor', value: 'Inyectado, SOHC, 4 tiempos, enfriado por liquido' },
          { name: 'Cilindrada', value: '686 cc' },
          { name: 'Transmision', value: 'Automatica Ultramatic (L/H/N/R/P), freno de motor en todas las ruedas' },
          { name: 'Traccion', value: 'On-Command 2WD, 4WD y 4WD con bloqueo diferencial' },
        ],
      },
      {
        group: 'Chasis y Equipamiento',
        specs: [
          { name: 'Direccion', value: 'Electroasistida Yamaha' },
          { name: 'Suspension', value: 'Delantera doble brazo y trasera brazo basculante, ambas con 5 posiciones de precarga' },
          { name: 'Frenos', value: 'Delantero doble disco hidraulico y trasero disco hidraulico ventilado' },
          { name: 'Otros', value: 'Instrumentacion digital, 3 compartimientos, faro LED y luz de trabajo halogena central' },
        ],
      },
    ],
    benefits: [
      { type: 'practical', title: 'Control total', description: 'Traccion seleccionable y bloqueo diferencial por boton.' },
      { type: 'practical', title: 'Comodidad superior', description: 'Direccion asistida y suspension ajustable para largas jornadas.' },
      { type: 'emotional', title: 'Lider off-road', description: 'Tecnologia Yamaha para explorar sin limites.' },
    ],
    financing: {
      eligible: true,
      defaultDownPayment: 20,
      defaultTerm: 60,
      monthlyPayment: 279000,
      termMonths: 60,
    },
    status: 'active',
    featured: true,
    sortOrder: 7,
  },
  {
    _id: 'wolverine-x4-850-xtr',
    _updatedAt: '2026-04-16T00:00:00.000Z',
    name: 'Wolverine X4 850 XT-R',
    slug: 'wolverine-x4-850-xtr',
    year: 2026,
    category: { name: 'Mulas', slug: 'mulas', parentCategory: 'cuadraciclos' },
    productType: 'cuadraciclo',
    price: 20400000,
    currency: 'CRC',
    formattedPrice: '₡20.400.000',
    tagline: 'Tu Diversion X4',
    images: imgs('Wolverine X4 850 XT-R', 'wolverine-x4-850-xtr'),
    heroImage: img('Wolverine X4 850 XT-R', 'wolverine-x4-850-xtr'),
    shortDescription:
      'Edicion extrema para aventuras extremas, con comodidad para 4 adultos, neumaticos para terreno exigente y tecnologia Yamaha de alto nivel.',
    description:
      'Wolverine X4 850 XT-R ofrece equilibrio entre capacidad de trabajo, confort refinado y confianza en senderos. Es un companero ideal para aventura al aire libre.',
    keySpecs: [
      { icon: 'engine', value: '847 cc', label: 'Cilindrada' },
      { icon: 'power', value: 'Bicilindrico DOHC', label: 'Motor' },
      { icon: 'transmission', value: 'Ultramatic 2WD/4WD', label: 'Transmision' },
      { icon: 'weight', value: '4 pasajeros', label: 'Capacidad' },
    ],
    fullSpecs: [
      {
        group: 'Motor y Transmision',
        specs: [
          { name: 'Motor', value: 'Bicilindrico, inyeccion electronica, enfriado por liquido, DOHC, 4 valvulas' },
          { name: 'Cilindrada', value: '847 cc' },
          { name: 'Transmision', value: 'Automatica Ultramatic con freno motor en todas las ruedas (L, H, N, R)' },
          { name: 'Traccion', value: 'On-Command 2WD, 4WD y 4WD con bloqueo diferencial de 3 vias' },
        ],
      },
      {
        group: 'Chasis y Frenos',
        specs: [
          { name: 'Direccion', value: 'Asistida' },
          { name: 'Suspension', value: 'Delantera y trasera independiente' },
          { name: 'Frenos', value: 'Delantero y trasero doble disco hidraulico' },
          { name: 'Arranque', value: 'Electrico' },
        ],
      },
    ],
    benefits: [
      { type: 'practical', title: 'Aventura para cuatro', description: 'Asientos altos y gran espacio para 4 adultos.' },
      { type: 'practical', title: 'Capacidad real en terreno duro', description: 'Neumaticos y plataforma listos para exigencia extrema.' },
      { type: 'emotional', title: 'Companero outdoor', description: 'Balance ideal entre trabajo y diversion.' },
    ],
    priceNote: '*Precio modelo 2024. Precios promocion sujetos a cambios, restricciones y condiciones en punto de venta.',
    financing: {
      eligible: true,
      defaultDownPayment: 20,
      defaultTerm: 60,
      monthlyPayment: 551000,
      termMonths: 60,
    },
    status: 'active',
    featured: true,
    sortOrder: 8,
  },
  {
    _id: 'wolverine-x4-1000-xtr',
    _updatedAt: '2026-04-16T00:00:00.000Z',
    name: 'Wolverine X4 1000 XTR',
    slug: 'wolverine-x4-1000-xtr',
    year: 2026,
    category: { name: 'Mulas', slug: 'mulas', parentCategory: 'cuadraciclos' },
    productType: 'cuadraciclo',
    price: 23890000,
    currency: 'CRC',
    formattedPrice: '₡23.890.000',
    tagline: 'Aventura al aire libre',
    images: imgs('Wolverine X4 1000 XTR', 'wolverine-x4-1000-xtr'),
    heroImage: img('Wolverine X4 1000 XTR', 'wolverine-x4-1000-xtr'),
    shortDescription:
      'El Wolverine RMAX4 1000 Compact XT-R esta disenado para desempeno real sin sacrificar confort ni versatilidad.',
    description:
      'Integra motor 999 cc, On-Command 4WD con bloqueo diferencial y modo Turf, direccion EPS seleccionable, modos D-Mode y suspension FOX QS3. Puede cargar hasta 600 lb y remolcar 2,000 lb.',
    keySpecs: [
      { icon: 'engine', value: '999 cc', label: 'Cilindrada' },
      { icon: 'power', value: 'Bicilindrico DOHC', label: 'Motor' },
      { icon: 'transmission', value: 'On-Command 2WD/4WD', label: 'Traccion' },
      { icon: 'weight', value: '2,000 lb', label: 'Remolque' },
    ],
    fullSpecs: [
      {
        group: 'Motor y Conduccion',
        specs: [
          { name: 'Motor', value: 'Bicilindrico, inyeccion electronica, enfriado por liquido, DOHC, 4 valvulas' },
          { name: 'Cilindrada', value: '999 cc' },
          { name: 'Transmision', value: 'Automatica con freno motor en todas las ruedas' },
          { name: 'Traccion', value: 'On-Command 2WD/4WD/bloqueo + modo Turf' },
          { name: 'Direccion', value: 'Asistida EPS seleccionable' },
        ],
      },
      {
        group: 'Chasis y Capacidad',
        specs: [
          { name: 'Suspension', value: 'Doble horquilla independiente con barra estabilizadora, amortiguadores FOX 2.0 QS3' },
          { name: 'Ancho total', value: '64 pulgadas' },
          { name: 'Neumaticos', value: 'GBC Dirt Commander 29"' },
          { name: 'Capacidad de carga', value: '600 lb' },
          { name: 'Capacidad de remolque', value: '2,000 lb' },
          { name: 'Arranque', value: 'Electrico' },
        ],
      },
    ],
    benefits: [
      { type: 'practical', title: 'Potencia y control premium', description: 'Motor 999 cc con modos de manejo y direccion EPS seleccionable.' },
      { type: 'practical', title: 'Suspension de alto nivel', description: 'FOX QS3 para estabilidad en condiciones exigentes.' },
      { type: 'emotional', title: 'Listo para todo', description: 'Combina trabajo, recreacion y tecnologia en un solo side-by-side.' },
    ],
    financing: {
      eligible: true,
      defaultDownPayment: 20,
      defaultTerm: 60,
      monthlyPayment: 645000,
      termMonths: 60,
    },
    status: 'active',
    featured: true,
    sortOrder: 9,
  },

  // ─────────────────────────────────────────────
  // MARINO - MOTORES FUERA DE BORDA
  // ─────────────────────────────────────────────
  {
    _id: 'e8dmhs',
    _updatedAt: '2026-04-16T00:00:00.000Z',
    name: 'E8DMHS',
    slug: 'e8dmhs',
    year: 2026,
    category: { name: 'Motores Fuera de Borda', slug: 'motores-fuera-de-borda', parentCategory: 'marino' },
    productType: 'motor_fuera_borda',
    price: 0,
    currency: 'CRC',
    formattedPrice: 'Consultar',
    tags: ['2 Tiempos'],
    tagline: 'Motor fuera de borda Yamaha',
    images: imgs('E8DMHS', 'e8dmhs'),
    heroImage: img('E8DMHS', 'e8dmhs'),
    shortDescription: 'Motor fuera de borda Yamaha E8DMHS.',
    description: 'Motor fuera de borda Yamaha E8DMHS de alta confiabilidad para uso marino.',
    keySpecs: [
      { icon: 'engine', value: '2 Tiempos', label: 'Tipo' },
      { icon: 'power', value: 'Consultar', label: 'Potencia' },
    ],
    fullSpecs: [],
    benefits: [],
    financing: { eligible: false, defaultDownPayment: 100, defaultTerm: 1 },
    status: 'active',
    featured: false,
    sortOrder: 1,
  },
  {
    _id: 'e15dmhl',
    _updatedAt: '2026-04-16T00:00:00.000Z',
    name: 'E15DMHL',
    slug: 'e15dmhl',
    year: 2026,
    category: { name: 'Motores Fuera de Borda', slug: 'motores-fuera-de-borda', parentCategory: 'marino' },
    productType: 'motor_fuera_borda',
    price: 0,
    currency: 'CRC',
    formattedPrice: 'Consultar',
    tags: ['2 Tiempos'],
    tagline: 'Motor fuera de borda Yamaha',
    images: imgs('E15DMHL', 'e15dmhl'),
    heroImage: img('E15DMHL', 'e15dmhl'),
    shortDescription: 'Motor fuera de borda Yamaha E15DMHL.',
    description: 'Motor fuera de borda Yamaha E15DMHL de alta confiabilidad para uso marino.',
    keySpecs: [
      { icon: 'engine', value: '2 Tiempos', label: 'Tipo' },
      { icon: 'power', value: 'Consultar', label: 'Potencia' },
    ],
    fullSpecs: [],
    benefits: [],
    financing: { eligible: false, defaultDownPayment: 100, defaultTerm: 1 },
    status: 'active',
    featured: false,
    sortOrder: 2,
  },
  {
    _id: 'e15dmhs',
    _updatedAt: '2026-04-16T00:00:00.000Z',
    name: 'E15DMHS',
    slug: 'e15dmhs',
    year: 2026,
    category: { name: 'Motores Fuera de Borda', slug: 'motores-fuera-de-borda', parentCategory: 'marino' },
    productType: 'motor_fuera_borda',
    price: 0,
    currency: 'CRC',
    formattedPrice: 'Consultar',
    tags: ['2 Tiempos'],
    tagline: 'Motor fuera de borda Yamaha',
    images: imgs('E15DMHS', 'e15dmhs'),
    heroImage: img('E15DMHS', 'e15dmhs'),
    shortDescription: 'Motor fuera de borda Yamaha E15DMHS.',
    description: 'Motor fuera de borda Yamaha E15DMHS de alta confiabilidad para uso marino.',
    keySpecs: [
      { icon: 'engine', value: '2 Tiempos', label: 'Tipo' },
      { icon: 'power', value: 'Consultar', label: 'Potencia' },
    ],
    fullSpecs: [],
    benefits: [],
    financing: { eligible: false, defaultDownPayment: 100, defaultTerm: 1 },
    status: 'active',
    featured: false,
    sortOrder: 3,
  },
  {
    _id: 'e25bmhl',
    _updatedAt: '2026-04-16T00:00:00.000Z',
    name: 'E25BMHL',
    slug: 'e25bmhl',
    year: 2026,
    category: { name: 'Motores Fuera de Borda', slug: 'motores-fuera-de-borda', parentCategory: 'marino' },
    productType: 'motor_fuera_borda',
    price: 0,
    currency: 'CRC',
    formattedPrice: 'Consultar',
    tags: ['2 Tiempos'],
    tagline: 'Motor fuera de borda Yamaha',
    images: imgs('E25BMHL', 'e25bmhl'),
    heroImage: img('E25BMHL', 'e25bmhl'),
    shortDescription: 'Motor fuera de borda Yamaha E25BMHL.',
    description: 'Motor fuera de borda Yamaha E25BMHL de alta confiabilidad para uso marino.',
    keySpecs: [
      { icon: 'engine', value: '2 Tiempos', label: 'Tipo' },
      { icon: 'power', value: 'Consultar', label: 'Potencia' },
    ],
    fullSpecs: [],
    benefits: [],
    financing: { eligible: false, defaultDownPayment: 100, defaultTerm: 1 },
    status: 'active',
    featured: false,
    sortOrder: 4,
  },
  {
    _id: 'e40xmhs',
    _updatedAt: '2026-04-16T00:00:00.000Z',
    name: 'E40XMHS',
    slug: 'e40xmhs',
    year: 2026,
    category: { name: 'Motores Fuera de Borda', slug: 'motores-fuera-de-borda', parentCategory: 'marino' },
    productType: 'motor_fuera_borda',
    price: 0,
    currency: 'CRC',
    formattedPrice: 'Consultar',
    tags: ['2 Tiempos'],
    tagline: 'Motor fuera de borda Yamaha',
    images: imgs('E40XMHS', 'e40xmhs'),
    heroImage: img('E40XMHS', 'e40xmhs'),
    shortDescription: 'Motor fuera de borda Yamaha E40XMHS.',
    description: 'Motor fuera de borda Yamaha E40XMHS de alta confiabilidad para uso marino.',
    keySpecs: [
      { icon: 'engine', value: '2 Tiempos', label: 'Tipo' },
      { icon: 'power', value: 'Consultar', label: 'Potencia' },
    ],
    fullSpecs: [],
    benefits: [],
    financing: { eligible: false, defaultDownPayment: 100, defaultTerm: 1 },
    status: 'active',
    featured: false,
    sortOrder: 5,
  },
  {
    _id: 'e40xmhl',
    _updatedAt: '2026-04-16T00:00:00.000Z',
    name: 'E40XMHL',
    slug: 'e40xmhl',
    year: 2026,
    category: { name: 'Motores Fuera de Borda', slug: 'motores-fuera-de-borda', parentCategory: 'marino' },
    productType: 'motor_fuera_borda',
    price: 0,
    currency: 'CRC',
    formattedPrice: 'Consultar',
    tags: ['2 Tiempos'],
    tagline: 'Motor fuera de borda Yamaha',
    images: imgs('E40XMHL', 'e40xmhl'),
    heroImage: img('E40XMHL', 'e40xmhl'),
    shortDescription: 'Motor fuera de borda Yamaha E40XMHL.',
    description: 'Motor fuera de borda Yamaha E40XMHL de alta confiabilidad para uso marino.',
    keySpecs: [
      { icon: 'engine', value: '2 Tiempos', label: 'Tipo' },
      { icon: 'power', value: 'Consultar', label: 'Potencia' },
    ],
    fullSpecs: [],
    benefits: [],
    financing: { eligible: false, defaultDownPayment: 100, defaultTerm: 1 },
    status: 'active',
    featured: false,
    sortOrder: 6,
  },
  {
    _id: 'e60hmhdl',
    _updatedAt: '2026-04-16T00:00:00.000Z',
    name: 'E60HMHDL',
    slug: 'e60hmhdl',
    year: 2026,
    category: { name: 'Motores Fuera de Borda', slug: 'motores-fuera-de-borda', parentCategory: 'marino' },
    productType: 'motor_fuera_borda',
    price: 0,
    currency: 'CRC',
    formattedPrice: 'Consultar',
    tags: ['2 Tiempos'],
    tagline: 'Motor fuera de borda Yamaha',
    images: imgs('E60HMHDL', 'e60hmhdl'),
    heroImage: img('E60HMHDL', 'e60hmhdl'),
    shortDescription: 'Motor fuera de borda Yamaha E60HMHDL.',
    description: 'Motor fuera de borda Yamaha E60HMHDL de alta confiabilidad para uso marino.',
    keySpecs: [
      { icon: 'engine', value: '2 Tiempos', label: 'Tipo' },
      { icon: 'power', value: 'Consultar', label: 'Potencia' },
    ],
    fullSpecs: [],
    benefits: [],
    financing: { eligible: false, defaultDownPayment: 100, defaultTerm: 1 },
    status: 'active',
    featured: false,
    sortOrder: 7,
  },
  {
    _id: 'e75bmhdl',
    _updatedAt: '2026-04-16T00:00:00.000Z',
    name: 'E75BMHDL',
    slug: 'e75bmhdl',
    year: 2026,
    category: { name: 'Motores Fuera de Borda', slug: 'motores-fuera-de-borda', parentCategory: 'marino' },
    productType: 'motor_fuera_borda',
    price: 0,
    currency: 'CRC',
    formattedPrice: 'Consultar',
    tags: ['2 Tiempos'],
    tagline: 'Motor fuera de borda Yamaha',
    images: imgs('E75BMHDL', 'e75bmhdl'),
    heroImage: img('E75BMHDL', 'e75bmhdl'),
    shortDescription: 'Motor fuera de borda Yamaha E75BMHDL.',
    description: 'Motor fuera de borda Yamaha E75BMHDL de alta confiabilidad para uso marino.',
    keySpecs: [
      { icon: 'engine', value: '2 Tiempos', label: 'Tipo' },
      { icon: 'power', value: 'Consultar', label: 'Potencia' },
    ],
    fullSpecs: [],
    benefits: [],
    financing: { eligible: false, defaultDownPayment: 100, defaultTerm: 1 },
    status: 'active',
    featured: false,
    sortOrder: 8,
  },
  {
    _id: '200aetx',
    _updatedAt: '2026-04-16T00:00:00.000Z',
    name: '200AETX',
    slug: '200aetx',
    year: 2026,
    category: { name: 'Motores Fuera de Borda', slug: 'motores-fuera-de-borda', parentCategory: 'marino' },
    productType: 'motor_fuera_borda',
    price: 0,
    currency: 'CRC',
    formattedPrice: 'Consultar',
    tags: ['2 Tiempos'],
    tagline: 'Motor fuera de borda Yamaha',
    images: imgs('200AETX', '200aetx'),
    heroImage: img('200AETX', '200aetx'),
    shortDescription: 'Motor fuera de borda Yamaha 200AETX.',
    description: 'Motor fuera de borda Yamaha 200AETX de alta confiabilidad para uso marino.',
    keySpecs: [
      { icon: 'engine', value: '2 Tiempos', label: 'Tipo' },
      { icon: 'power', value: 'Consultar', label: 'Potencia' },
    ],
    fullSpecs: [],
    benefits: [],
    financing: { eligible: false, defaultDownPayment: 100, defaultTerm: 1 },
    status: 'active',
    featured: false,
    sortOrder: 9,
  },
  {
    _id: 'l200aetx',
    _updatedAt: '2026-04-16T00:00:00.000Z',
    name: 'L200AETX',
    slug: 'l200aetx',
    year: 2026,
    category: { name: 'Motores Fuera de Borda', slug: 'motores-fuera-de-borda', parentCategory: 'marino' },
    productType: 'motor_fuera_borda',
    price: 0,
    currency: 'CRC',
    formattedPrice: 'Consultar',
    tags: ['2 Tiempos'],
    tagline: 'Motor fuera de borda Yamaha',
    images: imgs('L200AETX', 'l200aetx'),
    heroImage: img('L200AETX', 'l200aetx'),
    shortDescription: 'Motor fuera de borda Yamaha L200AETX.',
    description: 'Motor fuera de borda Yamaha L200AETX de alta confiabilidad para uso marino.',
    keySpecs: [
      { icon: 'engine', value: '2 Tiempos', label: 'Tipo' },
      { icon: 'power', value: 'Consultar', label: 'Potencia' },
    ],
    fullSpecs: [],
    benefits: [],
    financing: { eligible: false, defaultDownPayment: 100, defaultTerm: 1 },
    status: 'active',
    featured: false,
    sortOrder: 10,
  },
  {
    _id: 'f25dmhs',
    _updatedAt: '2026-04-16T00:00:00.000Z',
    name: 'F25DMHS',
    slug: 'f25dmhs',
    year: 2026,
    category: { name: 'Motores Fuera de Borda', slug: 'motores-fuera-de-borda', parentCategory: 'marino' },
    productType: 'motor_fuera_borda',
    price: 0,
    currency: 'CRC',
    formattedPrice: 'Consultar',
    tags: ['4 Tiempos'],
    tagline: 'Motor fuera de borda Yamaha',
    images: imgs('F25DMHS', 'f25dmhs'),
    heroImage: img('F25DMHS', 'f25dmhs'),
    shortDescription: 'Motor fuera de borda Yamaha F25DMHS.',
    description: 'Motor fuera de borda Yamaha F25DMHS de alta confiabilidad para uso marino.',
    keySpecs: [
      { icon: 'engine', value: '4 Tiempos', label: 'Tipo' },
      { icon: 'power', value: 'Consultar', label: 'Potencia' },
    ],
    fullSpecs: [],
    benefits: [],
    financing: { eligible: false, defaultDownPayment: 100, defaultTerm: 1 },
    status: 'active',
    featured: false,
    sortOrder: 11,
  },
  {
    _id: 'f25dmhl',
    _updatedAt: '2026-04-16T00:00:00.000Z',
    name: 'F25DMHL',
    slug: 'f25dmhl',
    year: 2026,
    category: { name: 'Motores Fuera de Borda', slug: 'motores-fuera-de-borda', parentCategory: 'marino' },
    productType: 'motor_fuera_borda',
    price: 0,
    currency: 'CRC',
    formattedPrice: 'Consultar',
    tags: ['4 Tiempos'],
    tagline: 'Motor fuera de borda Yamaha',
    images: imgs('F25DMHL', 'f25dmhl'),
    heroImage: img('F25DMHL', 'f25dmhl'),
    shortDescription: 'Motor fuera de borda Yamaha F25DMHL.',
    description: 'Motor fuera de borda Yamaha F25DMHL de alta confiabilidad para uso marino.',
    keySpecs: [
      { icon: 'engine', value: '4 Tiempos', label: 'Tipo' },
      { icon: 'power', value: 'Consultar', label: 'Potencia' },
    ],
    fullSpecs: [],
    benefits: [],
    financing: { eligible: false, defaultDownPayment: 100, defaultTerm: 1 },
    status: 'active',
    featured: false,
    sortOrder: 12,
  },
  {
    _id: 'ft60gehdl',
    _updatedAt: '2026-04-16T00:00:00.000Z',
    name: 'FT60GEHDL',
    slug: 'ft60gehdl',
    year: 2026,
    category: { name: 'Motores Fuera de Borda', slug: 'motores-fuera-de-borda', parentCategory: 'marino' },
    productType: 'motor_fuera_borda',
    price: 0,
    currency: 'CRC',
    formattedPrice: 'Consultar',
    tags: ['4 Tiempos'],
    tagline: 'Motor fuera de borda Yamaha',
    images: imgs('FT60GEHDL', 'ft60gehdl'),
    heroImage: img('FT60GEHDL', 'ft60gehdl'),
    shortDescription: 'Motor fuera de borda Yamaha FT60GEHDL.',
    description: 'Motor fuera de borda Yamaha FT60GEHDL de alta confiabilidad para uso marino.',
    keySpecs: [
      { icon: 'engine', value: '4 Tiempos', label: 'Tipo' },
      { icon: 'power', value: 'Consultar', label: 'Potencia' },
    ],
    fullSpecs: [],
    benefits: [],
    financing: { eligible: false, defaultDownPayment: 100, defaultTerm: 1 },
    status: 'active',
    featured: false,
    sortOrder: 13,
  },
  {
    _id: 'f75aetl',
    _updatedAt: '2026-04-16T00:00:00.000Z',
    name: 'F75AETL',
    slug: 'f75aetl',
    year: 2026,
    category: { name: 'Motores Fuera de Borda', slug: 'motores-fuera-de-borda', parentCategory: 'marino' },
    productType: 'motor_fuera_borda',
    price: 0,
    currency: 'CRC',
    formattedPrice: 'Consultar',
    tags: ['4 Tiempos'],
    tagline: 'Motor fuera de borda Yamaha',
    images: imgs('F75AETL', 'f75aetl'),
    heroImage: img('F75AETL', 'f75aetl'),
    shortDescription: 'Motor fuera de borda Yamaha F75AETL.',
    description: 'Motor fuera de borda Yamaha F75AETL de alta confiabilidad para uso marino.',
    keySpecs: [
      { icon: 'engine', value: '4 Tiempos', label: 'Tipo' },
      { icon: 'power', value: 'Consultar', label: 'Potencia' },
    ],
    fullSpecs: [],
    benefits: [],
    financing: { eligible: false, defaultDownPayment: 100, defaultTerm: 1 },
    status: 'active',
    featured: false,
    sortOrder: 14,
  },
  {
    _id: '85aetl',
    _updatedAt: '2026-04-16T00:00:00.000Z',
    name: '85AETL',
    slug: '85aetl',
    year: 2026,
    category: { name: 'Motores Fuera de Borda', slug: 'motores-fuera-de-borda', parentCategory: 'marino' },
    productType: 'motor_fuera_borda',
    price: 0,
    currency: 'CRC',
    formattedPrice: 'Consultar',
    tags: ['2 Tiempos'],
    tagline: 'Motor fuera de borda Yamaha',
    images: imgs('85AETL', '85aetl'),
    heroImage: img('85AETL', '85aetl'),
    shortDescription: 'Motor fuera de borda Yamaha 85AETL.',
    description: 'Motor fuera de borda Yamaha 85AETL de alta confiabilidad para uso marino.',
    keySpecs: [
      { icon: 'engine', value: '2 Tiempos', label: 'Tipo' },
      { icon: 'power', value: 'Consultar', label: 'Potencia' },
    ],
    fullSpecs: [],
    benefits: [],
    financing: { eligible: false, defaultDownPayment: 100, defaultTerm: 1 },
    status: 'active',
    featured: false,
    sortOrder: 15,
  },
  {
    _id: 'f90cetl',
    _updatedAt: '2026-04-16T00:00:00.000Z',
    name: 'F90CETL',
    slug: 'f90cetl',
    year: 2026,
    category: { name: 'Motores Fuera de Borda', slug: 'motores-fuera-de-borda', parentCategory: 'marino' },
    productType: 'motor_fuera_borda',
    price: 0,
    currency: 'CRC',
    formattedPrice: 'Consultar',
    tags: ['4 Tiempos'],
    tagline: 'Motor fuera de borda Yamaha',
    images: imgs('F90CETL', 'f90cetl'),
    heroImage: img('F90CETL', 'f90cetl'),
    shortDescription: 'Motor fuera de borda Yamaha F90CETL.',
    description: 'Motor fuera de borda Yamaha F90CETL de alta confiabilidad para uso marino.',
    keySpecs: [
      { icon: 'engine', value: '4 Tiempos', label: 'Tipo' },
      { icon: 'power', value: 'Consultar', label: 'Potencia' },
    ],
    fullSpecs: [],
    benefits: [],
    financing: { eligible: false, defaultDownPayment: 100, defaultTerm: 1 },
    status: 'active',
    featured: false,
    sortOrder: 16,
  },
  {
    _id: 'f115betl',
    _updatedAt: '2026-04-16T00:00:00.000Z',
    name: 'F115BETL',
    slug: 'f115betl',
    year: 2026,
    category: { name: 'Motores Fuera de Borda', slug: 'motores-fuera-de-borda', parentCategory: 'marino' },
    productType: 'motor_fuera_borda',
    price: 0,
    currency: 'CRC',
    formattedPrice: 'Consultar',
    tags: ['4 Tiempos'],
    tagline: 'Motor fuera de borda Yamaha',
    images: imgs('F115BETL', 'f115betl'),
    heroImage: img('F115BETL', 'f115betl'),
    shortDescription: 'Motor fuera de borda Yamaha F115BETL.',
    description: 'Motor fuera de borda Yamaha F115BETL de alta confiabilidad para uso marino.',
    keySpecs: [
      { icon: 'engine', value: '4 Tiempos', label: 'Tipo' },
      { icon: 'power', value: 'Consultar', label: 'Potencia' },
    ],
    fullSpecs: [],
    benefits: [],
    financing: { eligible: false, defaultDownPayment: 100, defaultTerm: 1 },
    status: 'active',
    featured: false,
    sortOrder: 17,
  },
  {
    _id: 'f115betx',
    _updatedAt: '2026-04-16T00:00:00.000Z',
    name: 'F115BETX',
    slug: 'f115betx',
    year: 2026,
    category: { name: 'Motores Fuera de Borda', slug: 'motores-fuera-de-borda', parentCategory: 'marino' },
    productType: 'motor_fuera_borda',
    price: 0,
    currency: 'CRC',
    formattedPrice: 'Consultar',
    tags: ['4 Tiempos'],
    tagline: 'Motor fuera de borda Yamaha',
    images: imgs('F115BETX', 'f115betx'),
    heroImage: img('F115BETX', 'f115betx'),
    shortDescription: 'Motor fuera de borda Yamaha F115BETX.',
    description: 'Motor fuera de borda Yamaha F115BETX de alta confiabilidad para uso marino.',
    keySpecs: [
      { icon: 'engine', value: '4 Tiempos', label: 'Tipo' },
      { icon: 'power', value: 'Consultar', label: 'Potencia' },
    ],
    fullSpecs: [],
    benefits: [],
    financing: { eligible: false, defaultDownPayment: 100, defaultTerm: 1 },
    status: 'active',
    featured: false,
    sortOrder: 18,
  },
  {
    _id: 'fl115betx',
    _updatedAt: '2026-04-16T00:00:00.000Z',
    name: 'FL115BETX',
    slug: 'fl115betx',
    year: 2026,
    category: { name: 'Motores Fuera de Borda', slug: 'motores-fuera-de-borda', parentCategory: 'marino' },
    productType: 'motor_fuera_borda',
    price: 0,
    currency: 'CRC',
    formattedPrice: 'Consultar',
    tags: ['4 Tiempos'],
    tagline: 'Motor fuera de borda Yamaha',
    images: imgs('FL115BETX', 'fl115betx'),
    heroImage: img('FL115BETX', 'fl115betx'),
    shortDescription: 'Motor fuera de borda Yamaha FL115BETX.',
    description: 'Motor fuera de borda Yamaha FL115BETX de alta confiabilidad para uso marino.',
    keySpecs: [
      { icon: 'engine', value: '4 Tiempos', label: 'Tipo' },
      { icon: 'power', value: 'Consultar', label: 'Potencia' },
    ],
    fullSpecs: [],
    benefits: [],
    financing: { eligible: false, defaultDownPayment: 100, defaultTerm: 1 },
    status: 'active',
    featured: false,
    sortOrder: 19,
  },
  {
    _id: 'f130aetl',
    _updatedAt: '2026-04-16T00:00:00.000Z',
    name: 'F130AETL',
    slug: 'f130aetl',
    year: 2026,
    category: { name: 'Motores Fuera de Borda', slug: 'motores-fuera-de-borda', parentCategory: 'marino' },
    productType: 'motor_fuera_borda',
    price: 0,
    currency: 'CRC',
    formattedPrice: 'Consultar',
    tags: ['4 Tiempos'],
    tagline: 'Motor fuera de borda Yamaha',
    images: imgs('F130AETL', 'f130aetl'),
    heroImage: img('F130AETL', 'f130aetl'),
    shortDescription: 'Motor fuera de borda Yamaha F130AETL.',
    description: 'Motor fuera de borda Yamaha F130AETL de alta confiabilidad para uso marino.',
    keySpecs: [
      { icon: 'engine', value: '4 Tiempos', label: 'Tipo' },
      { icon: 'power', value: 'Consultar', label: 'Potencia' },
    ],
    fullSpecs: [],
    benefits: [],
    financing: { eligible: false, defaultDownPayment: 100, defaultTerm: 1 },
    status: 'active',
    featured: false,
    sortOrder: 20,
  },
  {
    _id: 'f130aetx',
    _updatedAt: '2026-04-16T00:00:00.000Z',
    name: 'F130AETX',
    slug: 'f130aetx',
    year: 2026,
    category: { name: 'Motores Fuera de Borda', slug: 'motores-fuera-de-borda', parentCategory: 'marino' },
    productType: 'motor_fuera_borda',
    price: 0,
    currency: 'CRC',
    formattedPrice: 'Consultar',
    tags: ['4 Tiempos'],
    tagline: 'Motor fuera de borda Yamaha',
    images: imgs('F130AETX', 'f130aetx'),
    heroImage: img('F130AETX', 'f130aetx'),
    shortDescription: 'Motor fuera de borda Yamaha F130AETX.',
    description: 'Motor fuera de borda Yamaha F130AETX de alta confiabilidad para uso marino.',
    keySpecs: [
      { icon: 'engine', value: '4 Tiempos', label: 'Tipo' },
      { icon: 'power', value: 'Consultar', label: 'Potencia' },
    ],
    fullSpecs: [],
    benefits: [],
    financing: { eligible: false, defaultDownPayment: 100, defaultTerm: 1 },
    status: 'active',
    featured: false,
    sortOrder: 21,
  },
  {
    _id: 'fl130aetx',
    _updatedAt: '2026-04-16T00:00:00.000Z',
    name: 'FL130AETX',
    slug: 'fl130aetx',
    year: 2026,
    category: { name: 'Motores Fuera de Borda', slug: 'motores-fuera-de-borda', parentCategory: 'marino' },
    productType: 'motor_fuera_borda',
    price: 0,
    currency: 'CRC',
    formattedPrice: 'Consultar',
    tags: ['4 Tiempos'],
    tagline: 'Motor fuera de borda Yamaha',
    images: imgs('FL130AETX', 'fl130aetx'),
    heroImage: img('FL130AETX', 'fl130aetx'),
    shortDescription: 'Motor fuera de borda Yamaha FL130AETX.',
    description: 'Motor fuera de borda Yamaha FL130AETX de alta confiabilidad para uso marino.',
    keySpecs: [
      { icon: 'engine', value: '4 Tiempos', label: 'Tipo' },
      { icon: 'power', value: 'Consultar', label: 'Potencia' },
    ],
    fullSpecs: [],
    benefits: [],
    financing: { eligible: false, defaultDownPayment: 100, defaultTerm: 1 },
    status: 'active',
    featured: false,
    sortOrder: 22,
  },
  {
    _id: 'f150fetx',
    _updatedAt: '2026-04-16T00:00:00.000Z',
    name: 'F150FETX',
    slug: 'f150fetx',
    year: 2026,
    category: { name: 'Motores Fuera de Borda', slug: 'motores-fuera-de-borda', parentCategory: 'marino' },
    productType: 'motor_fuera_borda',
    price: 0,
    currency: 'CRC',
    formattedPrice: 'Consultar',
    tags: ['4 Tiempos'],
    tagline: 'Motor fuera de borda Yamaha',
    images: imgs('F150FETX', 'f150fetx'),
    heroImage: img('F150FETX', 'f150fetx'),
    shortDescription: 'Motor fuera de borda Yamaha F150FETX.',
    description: 'Motor fuera de borda Yamaha F150FETX de alta confiabilidad para uso marino.',
    keySpecs: [
      { icon: 'engine', value: '4 Tiempos', label: 'Tipo' },
      { icon: 'power', value: 'Consultar', label: 'Potencia' },
    ],
    fullSpecs: [],
    benefits: [],
    financing: { eligible: false, defaultDownPayment: 100, defaultTerm: 1 },
    status: 'active',
    featured: false,
    sortOrder: 23,
  },
  {
    _id: 'fl150fetx',
    _updatedAt: '2026-04-16T00:00:00.000Z',
    name: 'FL150FETX',
    slug: 'fl150fetx',
    year: 2026,
    category: { name: 'Motores Fuera de Borda', slug: 'motores-fuera-de-borda', parentCategory: 'marino' },
    productType: 'motor_fuera_borda',
    price: 0,
    currency: 'CRC',
    formattedPrice: 'Consultar',
    tags: ['4 Tiempos'],
    tagline: 'Motor fuera de borda Yamaha',
    images: imgs('FL150FETX', 'fl150fetx'),
    heroImage: img('FL150FETX', 'fl150fetx'),
    shortDescription: 'Motor fuera de borda Yamaha FL150FETX.',
    description: 'Motor fuera de borda Yamaha FL150FETX de alta confiabilidad para uso marino.',
    keySpecs: [
      { icon: 'engine', value: '4 Tiempos', label: 'Tipo' },
      { icon: 'power', value: 'Consultar', label: 'Potencia' },
    ],
    fullSpecs: [],
    benefits: [],
    financing: { eligible: false, defaultDownPayment: 100, defaultTerm: 1 },
    status: 'active',
    featured: false,
    sortOrder: 24,
  },
  {
    _id: 'f200fetx',
    _updatedAt: '2026-04-16T00:00:00.000Z',
    name: 'F200FETX',
    slug: 'f200fetx',
    year: 2026,
    category: { name: 'Motores Fuera de Borda', slug: 'motores-fuera-de-borda', parentCategory: 'marino' },
    productType: 'motor_fuera_borda',
    price: 0,
    currency: 'CRC',
    formattedPrice: 'Consultar',
    tags: ['4 Tiempos'],
    tagline: 'Motor fuera de borda Yamaha',
    images: imgs('F200FETX', 'f200fetx'),
    heroImage: img('F200FETX', 'f200fetx'),
    shortDescription: 'Motor fuera de borda Yamaha F200FETX.',
    description: 'Motor fuera de borda Yamaha F200FETX de alta confiabilidad para uso marino.',
    keySpecs: [
      { icon: 'engine', value: '4 Tiempos', label: 'Tipo' },
      { icon: 'power', value: 'Consultar', label: 'Potencia' },
    ],
    fullSpecs: [],
    benefits: [],
    financing: { eligible: false, defaultDownPayment: 100, defaultTerm: 1 },
    status: 'active',
    featured: false,
    sortOrder: 25,
  },
  {
    _id: 'fl200fetx',
    _updatedAt: '2026-04-16T00:00:00.000Z',
    name: 'FL200FETX',
    slug: 'fl200fetx',
    year: 2026,
    category: { name: 'Motores Fuera de Borda', slug: 'motores-fuera-de-borda', parentCategory: 'marino' },
    productType: 'motor_fuera_borda',
    price: 0,
    currency: 'CRC',
    formattedPrice: 'Consultar',
    tags: ['4 Tiempos'],
    tagline: 'Motor fuera de borda Yamaha',
    images: imgs('FL200FETX', 'fl200fetx'),
    heroImage: img('FL200FETX', 'fl200fetx'),
    shortDescription: 'Motor fuera de borda Yamaha FL200FETX.',
    description: 'Motor fuera de borda Yamaha FL200FETX de alta confiabilidad para uso marino.',
    keySpecs: [
      { icon: 'engine', value: '4 Tiempos', label: 'Tipo' },
      { icon: 'power', value: 'Consultar', label: 'Potencia' },
    ],
    fullSpecs: [],
    benefits: [],
    financing: { eligible: false, defaultDownPayment: 100, defaultTerm: 1 },
    status: 'active',
    featured: false,
    sortOrder: 26,
  },
  {
    _id: 'f250hetx',
    _updatedAt: '2026-04-16T00:00:00.000Z',
    name: 'F250HETX',
    slug: 'f250hetx',
    year: 2026,
    category: { name: 'Motores Fuera de Borda', slug: 'motores-fuera-de-borda', parentCategory: 'marino' },
    productType: 'motor_fuera_borda',
    price: 0,
    currency: 'CRC',
    formattedPrice: 'Consultar',
    tags: ['4 Tiempos'],
    tagline: 'Motor fuera de borda Yamaha',
    images: imgs('F250HETX', 'f250hetx'),
    heroImage: img('F250HETX', 'f250hetx'),
    shortDescription: 'Motor fuera de borda Yamaha F250HETX.',
    description: 'Motor fuera de borda Yamaha F250HETX de alta confiabilidad para uso marino.',
    keySpecs: [
      { icon: 'engine', value: '4 Tiempos', label: 'Tipo' },
      { icon: 'power', value: 'Consultar', label: 'Potencia' },
    ],
    fullSpecs: [],
    benefits: [],
    financing: { eligible: false, defaultDownPayment: 100, defaultTerm: 1 },
    status: 'active',
    featured: false,
    sortOrder: 27,
  },
  {
    _id: 'fl250hetx',
    _updatedAt: '2026-04-16T00:00:00.000Z',
    name: 'FL250HETX',
    slug: 'fl250hetx',
    year: 2026,
    category: { name: 'Motores Fuera de Borda', slug: 'motores-fuera-de-borda', parentCategory: 'marino' },
    productType: 'motor_fuera_borda',
    price: 0,
    currency: 'CRC',
    formattedPrice: 'Consultar',
    tags: ['4 Tiempos'],
    tagline: 'Motor fuera de borda Yamaha',
    images: imgs('FL250HETX', 'fl250hetx'),
    heroImage: img('FL250HETX', 'fl250hetx'),
    shortDescription: 'Motor fuera de borda Yamaha FL250HETX.',
    description: 'Motor fuera de borda Yamaha FL250HETX de alta confiabilidad para uso marino.',
    keySpecs: [
      { icon: 'engine', value: '4 Tiempos', label: 'Tipo' },
      { icon: 'power', value: 'Consultar', label: 'Potencia' },
    ],
    fullSpecs: [],
    benefits: [],
    financing: { eligible: false, defaultDownPayment: 100, defaultTerm: 1 },
    status: 'active',
    featured: false,
    sortOrder: 28,
  },
  {
    _id: 'f300getx',
    _updatedAt: '2026-04-16T00:00:00.000Z',
    name: 'F300GETX',
    slug: 'f300getx',
    year: 2026,
    category: { name: 'Motores Fuera de Borda', slug: 'motores-fuera-de-borda', parentCategory: 'marino' },
    productType: 'motor_fuera_borda',
    price: 0,
    currency: 'CRC',
    formattedPrice: 'Consultar',
    tags: ['4 Tiempos'],
    tagline: 'Motor fuera de borda Yamaha',
    images: imgs('F300GETX', 'f300getx'),
    heroImage: img('F300GETX', 'f300getx'),
    shortDescription: 'Motor fuera de borda Yamaha F300GETX.',
    description: 'Motor fuera de borda Yamaha F300GETX de alta confiabilidad para uso marino.',
    keySpecs: [
      { icon: 'engine', value: '4 Tiempos', label: 'Tipo' },
      { icon: 'power', value: 'Consultar', label: 'Potencia' },
    ],
    fullSpecs: [],
    benefits: [],
    financing: { eligible: false, defaultDownPayment: 100, defaultTerm: 1 },
    status: 'active',
    featured: false,
    sortOrder: 29,
  },
  {
    _id: 'fl300getx',
    _updatedAt: '2026-04-16T00:00:00.000Z',
    name: 'FL300GETX',
    slug: 'fl300getx',
    year: 2026,
    category: { name: 'Motores Fuera de Borda', slug: 'motores-fuera-de-borda', parentCategory: 'marino' },
    productType: 'motor_fuera_borda',
    price: 0,
    currency: 'CRC',
    formattedPrice: 'Consultar',
    tags: ['4 Tiempos'],
    tagline: 'Motor fuera de borda Yamaha',
    images: imgs('FL300GETX', 'fl300getx'),
    heroImage: img('FL300GETX', 'fl300getx'),
    shortDescription: 'Motor fuera de borda Yamaha FL300GETX.',
    description: 'Motor fuera de borda Yamaha FL300GETX de alta confiabilidad para uso marino.',
    keySpecs: [
      { icon: 'engine', value: '4 Tiempos', label: 'Tipo' },
      { icon: 'power', value: 'Consultar', label: 'Potencia' },
    ],
    fullSpecs: [],
    benefits: [],
    financing: { eligible: false, defaultDownPayment: 100, defaultTerm: 1 },
    status: 'active',
    featured: false,
    sortOrder: 30,
  },
  {
    _id: 'f425aet2x',
    _updatedAt: '2026-04-16T00:00:00.000Z',
    name: 'F425AET2X',
    slug: 'f425aet2x',
    year: 2026,
    category: { name: 'Motores Fuera de Borda', slug: 'motores-fuera-de-borda', parentCategory: 'marino' },
    productType: 'motor_fuera_borda',
    price: 0,
    currency: 'CRC',
    formattedPrice: 'Consultar',
    tags: ['4 Tiempos'],
    tagline: 'Motor fuera de borda Yamaha',
    images: imgs('F425AET2X', 'f425aet2x'),
    heroImage: img('F425AET2X', 'f425aet2x'),
    shortDescription: 'Motor fuera de borda Yamaha F425AET2X.',
    description: 'Motor fuera de borda Yamaha F425AET2X de alta confiabilidad para uso marino.',
    keySpecs: [
      { icon: 'engine', value: '4 Tiempos', label: 'Tipo' },
      { icon: 'power', value: 'Consultar', label: 'Potencia' },
    ],
    fullSpecs: [],
    benefits: [],
    financing: { eligible: false, defaultDownPayment: 100, defaultTerm: 1 },
    status: 'active',
    featured: false,
    sortOrder: 31,
  },

  // ─────────────────────────────────────────────
  // MARINO - WAVERUNNER
  // ─────────────────────────────────────────────
  {
    _id: 'fx-cruiser-svho',
    _updatedAt: '2026-04-16T00:00:00.000Z',
    name: 'FX Cruiser SVHO',
    slug: 'fx-cruiser-svho',
    year: 2026,
    category: { name: 'Waverunner', slug: 'waverunner', parentCategory: 'marino' },
    productType: 'waverunner',
    price: 13890000,
    salePrice: 11990000,
    currency: 'CRC',
    formattedPrice: '₡13.890.000',
    tagline: 'Velocidad, confort y tecnología',
    images: imgs('FX Cruiser SVHO', 'fx-cruiser-svho'),
    heroImage: img('FX Cruiser SVHO', 'fx-cruiser-svho'),
    shortDescription: 'La máxima expresión de potencia y confort en el agua, con motor sobrealimentado SVHO y sistema RiDE®.',
    description: 'FX Cruiser SVHO combina aceleración brutal, estabilidad y control con su motor SVHO de 1812 cc, casco NanoXcel2® y sistema RiDE®. Incorpora detalles premium como asiento ergonómico para 3 personas, audio Bluetooth integrado y amplia capacidad de almacenamiento para aventuras largas en el agua.',
    priceNote:
      'Precios promoción incluyen gastos de inscripción, no acumulables con otras promociones. Válidos hasta el 30 de Abril 2026. Aplican restricciones; ver condiciones en el punto de venta. Cuota referencial sujeta a aprobación crediticia.',
    keySpecs: [
      { icon: 'engine', value: '1812cc', label: 'Motor' },
      { icon: 'power', value: 'SVHO', label: 'Sobrealimentado' },
      { icon: 'transmission', value: 'RiDE®', label: 'Control' },
      { icon: 'weight', value: '70 L', label: 'Tanque' },
    ],
    fullSpecs: [
      {
        group: 'Motor y Rendimiento',
        specs: [
          { name: 'Motor', value: 'SVHO sobrealimentado, 4 cilindros, 1812 cc' },
          { name: 'Sistema de control', value: 'RiDE® para control preciso' },
          { name: 'Turbina', value: 'Alta presión para aceleración inmediata' },
        ],
      },
      {
        group: 'Construcción y Confort',
        specs: [
          { name: 'Casco', value: 'NanoXcel2® ultraligero y resistente' },
          { name: 'Asientos', value: 'Cruiser ergonómico para 3 personas' },
          { name: 'Audio', value: 'Bluetooth integrado, resistente al agua' },
        ],
      },
      {
        group: 'Equipamiento',
        specs: [
          { name: 'Pantalla', value: 'LCD a color con instrumentación completa' },
          { name: 'Combustible', value: 'Depósito de 70 L' },
          { name: 'Almacenamiento', value: 'En proa, consola y bajo asiento' },
          { name: 'Remolque', value: 'Gancho reforzado para deportes acuáticos' },
        ],
      },
    ],
    benefits: [
      { type: 'emotional', title: 'Potencia SVHO', description: 'Aceleración contundente y velocidad superior para una experiencia premium.' },
      { type: 'practical', title: 'Control RiDE®', description: 'Maniobras más seguras y precisas en distintas condiciones de navegación.' },
      { type: 'practical', title: 'Confort total', description: 'Asiento Cruiser y ergonomía pensada para largas travesías.' },
      { type: 'emotional', title: 'Lujo Yamaha', description: 'Acabados premium, tecnología y presencia de alto nivel en el agua.' },
    ],
    financing: { eligible: true, defaultDownPayment: 20, defaultTerm: 60 },
    status: 'active',
    featured: true,
    sortOrder: 1,
  },
  {
    _id: 'vx1050-c',
    _updatedAt: '2026-04-16T00:00:00.000Z',
    name: 'VX1050 C',
    slug: 'vx1050-c',
    year: 2026,
    category: { name: 'Waverunner', slug: 'waverunner', parentCategory: 'marino' },
    productType: 'waverunner',
    price: 7900000,
    currency: 'CRC',
    formattedPrice: '₡7.900.000',
    tagline: 'Duradero y divertido',
    images: imgs('VX1050 C', 'vx1050-c'),
    heroImage: img('VX1050 C', 'vx1050-c'),
    shortDescription: 'Diseño deportivo, excelente ahorro y mantenimiento reducido con la confiabilidad Yamaha WaveRunner.',
    description: 'VX1050 C ofrece potencia, diversión y versatilidad con motor inyectado de 1049 cc, casco ligero y resistente, turbina HyperFlow y capacidad para 3 personas. Es una WaveRunner reconocida mundialmente por su confiabilidad y rendimiento completo.',
    priceNote:
      'Precios promoción incluyen gastos de inscripción, no acumulables con otras promociones. Válidos hasta el 30 de Abril 2026. Aplican restricciones; ver condiciones en el punto de venta. Cuota referencial sujeta a aprobación crediticia.',
    keySpecs: [
      { icon: 'engine', value: '1049cc', label: 'Motor' },
      { icon: 'power', value: '3 cilindros', label: 'Inyectado' },
      { icon: 'weight', value: '70 L', label: 'Tanque' },
      { icon: 'transmission', value: '3 personas', label: 'Capacidad' },
    ],
    fullSpecs: [
      {
        group: 'Motor y Rendimiento',
        specs: [
          { name: 'Motor', value: 'Inyectado, 3 cilindros, 1049 cc' },
          { name: 'Turbina', value: 'Compacta de alta presión HyperFlow' },
          { name: 'Uso', value: 'Recreativo y deportivo versátil' },
        ],
      },
      {
        group: 'Construcción y Confort',
        specs: [
          { name: 'Casco', value: 'Ligero, fuerte y resistente' },
          { name: 'Asientos', value: 'Cómodo, capacidad para 3 personas' },
          { name: 'Instrumentación', value: 'Tacómetro, combustible y horas de uso' },
        ],
      },
      {
        group: 'Equipamiento',
        specs: [
          { name: 'Combustible', value: 'Depósito de 70 L' },
          { name: 'Remolque', value: 'Gancho resistente para deportes acuáticos' },
        ],
      },
    ],
    benefits: [
      { type: 'practical', title: 'Mantenimiento reducido', description: 'Plataforma confiable y eficiente para uso continuo.' },
      { type: 'practical', title: 'Gran autonomía', description: 'Depósito de 70 L para disfrutar más tiempo en el agua.' },
      { type: 'emotional', title: 'Diversión garantizada', description: 'Potencia y manejo balanceado para salidas recreativas.' },
      { type: 'emotional', title: 'Confiabilidad Yamaha', description: 'Respaldo de una WaveRunner con reputación mundial.' },
    ],
    financing: { eligible: true, defaultDownPayment: 20, defaultTerm: 60 },
    status: 'active',
    featured: true,
    sortOrder: 2,
  },
];

const ALSO_IN_CATEGORY: Record<string, string[]> = {
  'mt-03-fi': ['alta-cilindrada'],
  'yzf-r3-fi': ['alta-cilindrada'],
  'tenere-700-fi': ['alta-cilindrada', 'enduro'],
  'pw50': ['enduro'],
  'serow-fi': ['enduro'],
  'wr155-fi': ['enduro'],
  'wr250f': ['enduro'],
  'wr450f': ['enduro'],
};

const SANITY_PRODUCTS_QUERY = `*[_type == "product"] | order(sortOrder asc, name asc) {
  _id,
  _updatedAt,
  name,
  "slug": slug.current,
  year,
  productType,
  price,
  salePrice,
  currency,
  formattedPrice,
  tags,
  tagline,
  shortDescription,
  description,
  keySpecs,
  fullSpecs,
  benefits,
  financing,
  status,
  featured,
  sortOrder,
  priceNote,
  category->{
    name,
    "slug": slug.current,
    parentCategory
  },
  heroImage {
    alt,
    asset->{
      url,
      metadata { dimensions { width, height } }
    }
  },
  images[] {
    alt,
    asset->{
      url,
      metadata { dimensions { width, height } }
    }
  }
}`;

const SANITY_ENABLED = Boolean(process.env.SANITY_PROJECT_ID && process.env.SANITY_PROJECT_ID !== 'mock');

const OUTBOARD_PRODUCT_COPY: Record<string, string> = {
  '200aetx': 'Reconocido por su resistencia, confiabilidad y facilidad de mantenimiento, ha probado ser el mas popular en los mares, rios y lagos en todo el mundo, siendo aplicado desde la pesca hasta el transporte.',
  '85aetl': 'Motor portatil de 3 cilindros y 85 caballos de potencia, con una excelente relacion peso/potencia, perfecto para viajes en botes pequenos a alta velocidad.',
  'e15dmhl': 'Economia y resistencia para usos comerciales, de pesca y transporte.',
  'e15dmhs': 'Economia y resistencia para usos comerciales, de pesca y transporte.',
  'e25bmhl': 'Motor enduro con excelente relacion peso-potencia, ideal para fanaticos de la velocidad que requieren propulsar pequenas embarcaciones.',
  'e40xmhl': 'Uno de los favoritos de los ticos. Combina la legendaria durabilidad de Yamaha con maximo rendimiento y consumo eficiente de combustible, potencia sobresaliente y gran comodidad por su bajo nivel de ruido y vibraciones.',
  'e40xmhs': 'Uno de los favoritos de los ticos. Combina la legendaria durabilidad de Yamaha con maximo rendimiento y consumo eficiente de combustible, potencia sobresaliente y gran comodidad por su bajo nivel de ruido y vibraciones.',
  'e60hmhdl': 'Motor enduro para trabajo pesado, portatil, de facil operacion y mantenimiento, con interruptor de apagado de emergencia.',
  'e75bmhdl': 'Motor enduro para trabajo pesado. Opcion con gran relacion precio/potencia para botes de mandos manuales, ideal para uso comercial de media potencia.',
  e8dmhs: 'Desarrollado especialmente para atender exigentes demandas de uso comercial, por eso pertenece a la categoria Enduro.',
  'f115betl': 'Excelente empuje para deportes acuaticos en lagos y mar. Su sistema EFI permite aceleracion rapida y suave, con menor consumo y bajas emisiones.',
  'f115betx': 'Excelente empuje para deportes acuaticos en lagos y mar. Su sistema EFI permite aceleracion rapida y suave, con menor consumo y bajas emisiones.',
  'f130aetl': 'Se caracteriza por su diseno elegante y optimo rendimiento. Es versatil, con excelente relacion peso-potencia, ideal para una amplia gama de actividades.',
  'f130aetx': 'Se caracteriza por su diseno elegante y optimo rendimiento. Es versatil, con excelente relacion peso-potencia, ideal para una amplia gama de actividades.',
  'f150fetx': 'Uno de los mejores modelos de 150 hp para uso comercial. Apto para trabajo pesado, transporte en rios y botes de placer en aguas abiertas.',
  'f200fetx': 'Con impresionante relacion potencia-peso y direccion integrada, este cuatro en linea de 200 hp es ideal para embarcaciones pequenas y medianas.',
  'f250hetx': 'Apto para trabajo pesado, ideal para aplicaciones de transporte y botes de placer. Sus componentes brindan mayor resistencia a la corrosion y abrasion.',
  'f25dmhl': 'Motor pequeno y compacto que ofrece la potencia necesaria para trabajo diario de pesca y transporte. Solucion ideal para uso comercial o recreativo.',
  'f25dmhs': 'Motor pequeno y compacto que ofrece la potencia necesaria para trabajo diario de pesca y transporte. Solucion ideal para uso comercial o recreativo.',
  'f300getx': 'Motor capaz de desarrollar gran potencia y altas velocidades gracias a su reducido peso. Disenado para empujar embarcaciones grandes con varios motores.',
  'f425aet2x': 'El primer 4 tiempos de inyeccion directa con direccion electronica integral y un nuevo nivel de empuje, torque y velocidad en retroceso.',
  'f75aetl': 'Con 16 valvulas y sistema DOHC, esta disenado para gran aceleracion y precision. Su inyeccion multipunto ofrece arranques confiables y eficiencia de combustible.',
  'f90cetl': 'Totalmente renovado para mejorar la experiencia de navegacion. Ahora mas ligero y potente, con mejor desempeno y torque excepcional.',
  'fl115betx': 'Excelente empuje para deportes acuaticos en lagos y mar. Su sistema EFI permite aceleracion rapida y suave, con menor consumo y bajas emisiones.',
  'fl130aetx': 'Se caracteriza por su diseno elegante y optimo rendimiento. Es versatil, con excelente relacion peso-potencia, ideal para una amplia gama de actividades.',
  'fl150fetx': 'Uno de los mejores modelos de 150 hp para uso comercial. Apto para trabajo pesado, transporte en rios y botes de placer en aguas abiertas.',
  'fl200fetx': 'Con impresionante relacion potencia-peso y direccion integrada, este cuatro en linea de 200 hp es ideal para embarcaciones pequenas y medianas.',
  'fl250hetx': 'Apto para trabajo pesado, ideal para aplicaciones de transporte y botes de placer. Sus componentes brindan mayor resistencia a la corrosion y abrasion.',
  'fl300getx': 'Motor capaz de desarrollar gran potencia y altas velocidades gracias a su reducido peso. Disenado para empujar embarcaciones grandes con varios motores.',
  'ft60gehdl': 'Modelo de inyeccion electronica con instrumento digital que ofrece menor consumo de combustible y bajas emisiones, con transmision de alto empuje.',
  'l200aetx': 'Reconocido por su resistencia, confiabilidad y facilidad de mantenimiento, ha probado ser el mas popular en los mares, rios y lagos en todo el mundo, siendo aplicado desde la pesca hasta el transporte.',
};

const OUTBOARD_LEGAL_NOTE =
  'Para precios de motores fuera de borda, consultar con un ejecutivo. Precios y condiciones sujetos a cambios y restricciones en punto de venta.';

type OutboardRichDetail = {
  tagline: string;
  summary: string;
  description: string;
  specs: Array<{ name: string; value: string }>;
};

const OUTBOARD_RICH_DETAILS: Record<string, OutboardRichDetail> = {
  e8dmhs: {
    tagline: 'Porque en el mar, no hay mecanicos. Yamaha.',
    summary: 'Desarrollado para exigentes demandas de uso comercial; pertenece a la categoria Enduro.',
    description: 'Este motor fue desarrollado especialmente para atender exigentes demandas de uso comercial por eso pertenece a la categoria Enduro.',
    specs: [
      { name: 'Motor', value: '2 cilindros, 2 tiempos' },
      { name: 'Desplazamiento', value: '165 cc' },
      { name: 'Potencia de salida', value: '8 hp @ 4,500 rpm' },
      { name: 'Rango maximo', value: '4,500 - 5,500 rpm' },
      { name: 'Regimen minimo', value: '1,200 +/- 1,300 rpm' },
      { name: 'Sistema de lubricacion', value: 'Pre-mezcla 50:10' },
      { name: 'Sistema de induccion de combustible', value: 'Carburado' },
      { name: 'Arranque', value: 'Manual' },
      { name: 'Levante', value: 'Manual' },
      { name: 'Mandos', value: 'Brazo' },
      { name: 'Peso', value: '29 kg' },
    ],
  },
  e15dmhl: {
    tagline: 'Porque en el mar, no hay mecanicos. Yamaha.',
    summary: 'Economia y resistencia para usos comerciales, de pesca y transporte.',
    description: 'Economia y resistencia para usos comerciales, de pesca y transporte.',
    specs: [
      { name: 'Motor', value: '2 tiempos, 2 cilindros' },
      { name: 'Desplazamiento', value: '246 cc' },
      { name: 'Potencia de salida', value: '15 hp @ 5,000 rpm' },
      { name: 'Rango maximo', value: '4,500 - 5,500 rpm' },
      { name: 'Regimen minimo', value: '1,050 +/- 50 rpm' },
      { name: 'Sistema de lubricacion', value: 'Pre-mezcla 50:1' },
      { name: 'Sistema de induccion de combustible', value: 'Carburado' },
      { name: 'Pata', value: 'Larga' },
      { name: 'Arranque', value: 'Manual' },
      { name: 'Levante', value: 'Manual' },
      { name: 'Mandos', value: 'Brazo' },
      { name: 'Peso', value: '41 kg' },
    ],
  },
  e15dmhs: {
    tagline: 'Porque en el mar, no hay mecanicos. Yamaha.',
    summary: 'Economia y resistencia para usos comerciales, de pesca y transporte.',
    description: 'Economia y resistencia para usos comerciales, de pesca y transporte.',
    specs: [
      { name: 'Motor', value: '2 tiempos, 2 cilindros' },
      { name: 'Desplazamiento', value: '246 cc' },
      { name: 'Potencia de salida', value: '15 hp @ 5,000 rpm' },
      { name: 'Rango maximo', value: '4,500 - 5,500 rpm' },
      { name: 'Regimen minimo', value: '1,050 +/- 50 rpm' },
      { name: 'Sistema de lubricacion', value: 'Pre-mezcla 50:1' },
      { name: 'Sistema de induccion de combustible', value: 'Carburado' },
      { name: 'Arranque', value: 'Manual' },
      { name: 'Levante', value: 'Manual' },
      { name: 'Mandos', value: 'Brazo' },
      { name: 'Peso', value: '40 kg' },
    ],
  },
  e25bmhl: {
    tagline: 'Porque en el mar, no hay mecanicos. Yamaha.',
    summary: 'Motor enduro con excelente relacion peso-potencia para pequenas embarcaciones.',
    description: 'Motor enduro, con excelente relacion peso-potencia. Ideal para fanaticos a la velocidad que requieren propulsar pequenas embarcaciones.',
    specs: [
      { name: 'Motor', value: '2 tiempos, 2 cilindros' },
      { name: 'Desplazamiento', value: '496 cc' },
      { name: 'Potencia de salida', value: '25 hp @ 5,000 rpm' },
      { name: 'Rango maximo', value: '4,500 - 5,500 rpm' },
      { name: 'Regimen minimo', value: '1,100 +/- 50 rpm' },
      { name: 'Sistema de lubricacion', value: 'Pre-mezcla 50:1' },
      { name: 'Sistema de induccion de combustible', value: 'Carburado' },
      { name: 'Pata', value: 'Larga' },
      { name: 'Arranque', value: 'Manual' },
      { name: 'Levante', value: 'Manual' },
      { name: 'Mandos', value: 'Brazo' },
      { name: 'Peso', value: '55 kg' },
    ],
  },
  e40xmhs: {
    tagline: 'Porque en el mar, no hay mecanicos. Yamaha.',
    summary: 'Favorito por su durabilidad, potencia y comodidad con bajo ruido y vibraciones.',
    description: 'Uno de los favoritos de los ticos. Combina la legendaria durabilidad de Yamaha con rendimiento, ahorro de combustible y gran comodidad.',
    specs: [
      { name: 'Motor', value: '2 tiempos, 2 cilindros' },
      { name: 'Desplazamiento', value: '703 cc' },
      { name: 'Potencia de salida', value: '40 hp @ 5,000 rpm' },
      { name: 'Rango maximo', value: '4,500 - 5,500 rpm' },
      { name: 'Regimen minimo', value: '1,000 +/- 50 rpm' },
      { name: 'Sistema de lubricacion', value: 'Pre-mezcla 50:1' },
      { name: 'Sistema de induccion de combustible', value: 'Carburado' },
      { name: 'Pata', value: 'Corta' },
      { name: 'Arranque', value: 'Manual' },
      { name: 'Levante', value: 'Manual' },
      { name: 'Mandos', value: 'Brazo' },
      { name: 'Peso', value: '72 kg' },
    ],
  },
  e40xmhl: {
    tagline: 'Porque en el mar, no hay mecanicos. Yamaha.',
    summary: 'Favorito por su durabilidad, potencia y comodidad con bajo ruido y vibraciones.',
    description: 'Uno de los favoritos de los ticos. Combina la legendaria durabilidad de Yamaha con rendimiento, ahorro de combustible y gran comodidad.',
    specs: [
      { name: 'Motor', value: '2 tiempos, 2 cilindros' },
      { name: 'Desplazamiento', value: '703 cc' },
      { name: 'Potencia de salida', value: '40 hp @ 5,000 rpm' },
      { name: 'Rango maximo', value: '4,500 - 5,500 rpm' },
      { name: 'Regimen minimo', value: '1,000 +/- 50 rpm' },
      { name: 'Sistema de lubricacion', value: 'Pre-mezcla 50:1' },
      { name: 'Sistema de induccion de combustible', value: 'Carburado' },
      { name: 'Pata', value: 'Larga' },
      { name: 'Arranque', value: 'Manual' },
      { name: 'Levante', value: 'Manual' },
      { name: 'Mandos', value: 'Brazo' },
      { name: 'Peso', value: '81 kg' },
    ],
  },
  e60hmhdl: {
    tagline: 'Porque en el mar, no hay mecanicos. Yamaha.',
    summary: 'Motor enduro para trabajo pesado, portatil y de facil operacion.',
    description: 'Motor enduro para trabajo pesado, portatil, de facil operacion y mantenimiento, con interruptor de apagado de emergencia.',
    specs: [
      { name: 'Motor', value: '2 tiempos, 3 cilindros' },
      { name: 'Desplazamiento', value: '849 cc' },
      { name: 'Potencia de salida', value: '60 hp @ 5,000 rpm' },
      { name: 'Rango maximo', value: '4,500 - 5,500 rpm' },
      { name: 'Regimen minimo', value: '1,000 +/- 50 rpm' },
      { name: 'Sistema de lubricacion', value: 'Pre-mezcla 50:1' },
      { name: 'Sistema de induccion de combustible', value: 'Carburado' },
      { name: 'Arranque', value: 'Manual' },
      { name: 'Levante', value: 'Manual' },
      { name: 'Mandos', value: 'Brazo' },
      { name: 'Peso', value: '96 kg' },
    ],
  },
  e75bmhdl: {
    tagline: 'Porque en el mar, no hay mecanicos. Yamaha.',
    summary: 'Relacion precio/potencia destacada para uso comercial de media potencia.',
    description: 'Motor enduro para trabajo pesado, ideal para propulsar botes de mandos manuales en aplicaciones comerciales.',
    specs: [
      { name: 'Motor', value: '2 tiempos, 3 cilindros' },
      { name: 'Desplazamiento', value: '1,140 cc' },
      { name: 'Potencia de salida', value: '75 hp @ 5,000 rpm' },
      { name: 'Rango maximo', value: '4,500 - 5,500 rpm' },
      { name: 'Regimen minimo', value: '800 +/- 50 rpm' },
      { name: 'Sistema de lubricacion', value: 'Pre-mezcla 50:1' },
      { name: 'Sistema de induccion de combustible', value: 'Carburado' },
      { name: 'Arranque', value: 'Manual' },
      { name: 'Levante', value: 'Gas' },
      { name: 'Mandos', value: 'Brazo' },
      { name: 'Peso', value: '112 kg' },
    ],
  },
  '200aetx': {
    tagline: 'Porque en el mar, no hay mecanicos. Yamaha.',
    summary: 'Reconocido por resistencia, confiabilidad y facilidad de mantenimiento.',
    description: 'Ha probado ser uno de los mas populares en mares, rios y lagos para pesca y transporte.',
    specs: [
      { name: 'Motor', value: 'V6' },
      { name: 'Desplazamiento', value: '2,596 cc' },
      { name: 'Potencia de salida', value: '200 hp @ 5,000 rpm' },
      { name: 'Rango maximo', value: '4,500 - 5,500 rpm' },
      { name: 'Regimen minimo', value: '700 +/- 25 rpm' },
      { name: 'Sistema de lubricacion', value: 'Pre-mezcla 50:1' },
      { name: 'Sistema de induccion de combustible', value: 'Carburado' },
      { name: 'Arranque', value: 'Electrico' },
      { name: 'Levante', value: 'Hidraulico' },
      { name: 'Mandos', value: 'Remoto' },
      { name: 'Peso', value: '184 kg' },
    ],
  },
  l200aetx: {
    tagline: 'Porque en el mar, no hay mecanicos. Yamaha.',
    summary: 'Reconocido por resistencia, confiabilidad y facilidad de mantenimiento.',
    description: 'Ha probado ser uno de los mas populares en mares, rios y lagos para pesca y transporte.',
    specs: [
      { name: 'Motor', value: 'V4' },
      { name: 'Desplazamiento', value: '2,596 cc' },
      { name: 'Potencia de salida', value: '200 hp @ 5,000 rpm' },
      { name: 'Rango maximo', value: '4,500 - 5,500 rpm' },
      { name: 'Regimen minimo', value: '700 +/- 50 rpm' },
      { name: 'Sistema de lubricacion', value: 'Pre-mezcla 50:1' },
      { name: 'Sistema de induccion de combustible', value: 'Carburado' },
      { name: 'Arranque', value: 'Electrico' },
      { name: 'Levante', value: 'Hidraulico' },
      { name: 'Mandos', value: 'Remoto' },
      { name: 'Peso', value: '186 kg' },
    ],
  },
  f25dmhs: {
    tagline: 'Porque en el mar, no hay mecanicos. Yamaha.',
    summary: 'Motor pequeno y compacto para pesca, transporte y uso recreativo.',
    description: 'Ofrece la potencia necesaria para trabajo diario con una solucion practica para uso comercial o recreativo.',
    specs: [
      { name: 'Motor', value: '4 tiempos, 2 cilindros SOHC' },
      { name: 'Desplazamiento', value: '498 cc' },
      { name: 'Potencia de salida', value: '25 hp @ 5,500 rpm' },
      { name: 'Rango maximo', value: '5,000 - 6,000 rpm' },
      { name: 'Regimen minimo', value: '975 +/- 50 rpm' },
      { name: 'Sistema de lubricacion', value: 'Por carter humedo' },
      { name: 'Sistema de combustible', value: 'Carburado' },
      { name: 'Arranque', value: 'Manual' },
      { name: 'Levante', value: 'Manual' },
      { name: 'Mandos', value: 'Brazo' },
      { name: 'Peso', value: '77 kg' },
    ],
  },
  f25dmhl: {
    tagline: 'Porque en el mar, no hay mecanicos. Yamaha.',
    summary: 'Motor pequeno y compacto para pesca, transporte y uso recreativo.',
    description: 'Ofrece la potencia necesaria para trabajo diario con una solucion practica para uso comercial o recreativo.',
    specs: [
      { name: 'Motor', value: '4 tiempos, 2 cilindros SOHC' },
      { name: 'Desplazamiento', value: '498 cc' },
      { name: 'Potencia de salida', value: '25 hp @ 5,500 rpm' },
      { name: 'Rango maximo', value: '5,000 - 6,000 rpm' },
      { name: 'Regimen minimo', value: '975 +/- 50 rpm' },
      { name: 'Sistema de lubricacion', value: 'Por carter humedo' },
      { name: 'Sistema de combustible', value: 'Carburado' },
      { name: 'Arranque', value: 'Manual' },
      { name: 'Levante', value: 'Manual' },
      { name: 'Mandos', value: 'Brazo' },
      { name: 'Peso', value: '86 kg' },
    ],
  },
  ft60gehdl: {
    tagline: 'Porque en el mar, no hay mecanicos. Yamaha.',
    summary: 'Inyeccion electronica e instrumentacion digital para menor consumo y emisiones.',
    description: 'Modelo con transmision de alto empuje para mejor rendimiento, ideal para trabajo continuo.',
    specs: [
      { name: 'Motor', value: '4 tiempos, 4 cilindros SOHC' },
      { name: 'Desplazamiento', value: '996 cc' },
      { name: 'Potencia de salida', value: '60 hp @ 5,500 rpm' },
      { name: 'Rango maximo', value: '5,000 - 6,000 rpm' },
      { name: 'Regimen minimo', value: '750 +/- 50 rpm' },
      { name: 'Sistema de lubricacion', value: 'Por carter humedo' },
      { name: 'Sistema de combustible', value: 'Inyeccion electronica (EFI)' },
      { name: 'Arranque', value: 'Electrico' },
      { name: 'Levante', value: 'Gas' },
      { name: 'Mandos', value: 'Brazo' },
      { name: 'Peso', value: '116 kg' },
    ],
  },
  f75aetl: {
    tagline: 'Porque en el mar, no hay mecanicos. Yamaha.',
    summary: 'Motor DOHC de 16 valvulas para gran aceleracion y precision.',
    description: 'Cuenta con inyeccion electronica multipunto para arranques confiables y eficiencia de combustible.',
    specs: [
      { name: 'Motor', value: '4 tiempos, 16 valvulas, 4 cilindros DOHC' },
      { name: 'Desplazamiento', value: '1,596 cc' },
      { name: 'Potencia de salida', value: '75 hp @ 5,500 rpm' },
      { name: 'Rango maximo', value: '5,000 - 6,000 rpm' },
      { name: 'Regimen minimo', value: '700 +/- 50 rpm' },
      { name: 'Sistema de lubricacion', value: 'Por carter humedo' },
      { name: 'Sistema de combustible', value: 'Inyeccion electronica (EFI)' },
      { name: 'Arranque', value: 'Electrico' },
      { name: 'Levante', value: 'Hidraulico' },
      { name: 'Mandos', value: 'Remotos' },
      { name: 'Peso', value: '170 kg' },
    ],
  },
  '85aetl': {
    tagline: 'Porque en el mar, no hay mecanicos. Yamaha.',
    summary: 'Motor portatil de 3 cilindros con excelente relacion peso/potencia.',
    description: 'Perfecto para viajes en botes pequenos a alta velocidad.',
    specs: [
      { name: 'Motor', value: '3 cilindros, 2 tiempos' },
      { name: 'Desplazamiento', value: '1,140 cc' },
      { name: 'Potencia de salida', value: '85 hp @ 5,000 rpm' },
      { name: 'Rango maximo', value: '4,500 - 5,500 rpm' },
      { name: 'Regimen minimo', value: '800 +/- 50 rpm' },
      { name: 'Sistema de lubricacion', value: 'Pre-mezcla 50:1' },
      { name: 'Sistema de induccion de combustible', value: 'Carburado' },
      { name: 'Arranque', value: 'Electrico' },
      { name: 'Levante', value: 'Hidraulico' },
      { name: 'Mandos', value: 'Remoto' },
      { name: 'Peso', value: '111 kg' },
    ],
  },
  f90cetl: {
    tagline: 'Porque en el mar, no hay mecanicos. Yamaha.',
    summary: 'Yamaha F90 renovado: mas ligero y potente para mejor experiencia de navegacion.',
    description: 'Cuenta con cuatro valvulas por cilindro para mayor eficiencia, torque y aceleracion excepcionales.',
    specs: [
      { name: 'Motor', value: '4 cilindros, 4 tiempos' },
      { name: 'Desplazamiento', value: '1,596 cc' },
      { name: 'Potencia de salida', value: '90 hp @ 5,500 rpm' },
      { name: 'Rango maximo', value: '5,000 - 6,000 rpm' },
      { name: 'Regimen minimo', value: '650 +/- 750 rpm' },
      { name: 'Sistema de lubricacion', value: 'Carter humedo' },
      { name: 'Sistema de induccion de combustible', value: 'Inyectado' },
      { name: 'Arranque', value: 'Electrico' },
      { name: 'Levante', value: 'Hidraulico' },
      { name: 'Mandos', value: 'A distancia' },
      { name: 'Peso', value: '170 kg' },
    ],
  },
  f115betl: {
    tagline: 'Porque en el mar, no hay mecanicos. Yamaha.',
    summary: 'Excelente empuje para deportes acuaticos, con EFI para aceleracion suave y menor consumo.',
    description: 'Rinde tanto en lagos como en mar con bajas emisiones y respuesta confiable.',
    specs: [
      { name: 'Motor', value: '4 tiempos, 16 valvulas, 4 cilindros en linea DOHC' },
      { name: 'Desplazamiento', value: '1,741 cc' },
      { name: 'Potencia de salida', value: '115 hp @ 5,500 rpm' },
      { name: 'Rango maximo', value: '5,000 - 6,000 rpm' },
      { name: 'Regimen minimo', value: '750 +/- 50 rpm' },
      { name: 'Sistema de lubricacion', value: 'Por carter humedo' },
      { name: 'Sistema de induccion de combustible', value: 'Inyeccion electronica (EFI)' },
      { name: 'Arranque', value: 'Electrico' },
      { name: 'Levante', value: 'Hidraulico' },
      { name: 'Mandos', value: 'Remotos' },
      { name: 'Peso', value: '186 kg' },
    ],
  },
  f115betx: {
    tagline: 'Porque en el mar, no hay mecanicos. Yamaha.',
    summary: 'Excelente empuje para deportes acuaticos, con EFI para aceleracion suave y menor consumo.',
    description: 'Rinde tanto en lagos como en mar con bajas emisiones y respuesta confiable.',
    specs: [
      { name: 'Motor', value: '4 tiempos, 16 valvulas, 4 cilindros en linea DOHC' },
      { name: 'Desplazamiento', value: '1,741 cc' },
      { name: 'Potencia de salida', value: '115 hp @ 5,500 rpm' },
      { name: 'Rango maximo', value: '5,000 - 6,000 rpm' },
      { name: 'Regimen minimo', value: '750 +/- 50 rpm' },
      { name: 'Sistema de lubricacion', value: 'Por carter humedo' },
      { name: 'Sistema de induccion de combustible', value: 'Inyeccion electronica (EFI)' },
      { name: 'Arranque', value: 'Electrico' },
      { name: 'Levante', value: 'Hidraulico' },
      { name: 'Mandos', value: 'Remotos' },
      { name: 'Peso', value: '195 kg' },
    ],
  },
  fl115betx: {
    tagline: 'Porque en el mar, no hay mecanicos. Yamaha.',
    summary: 'Excelente empuje para deportes acuaticos, con EFI para aceleracion suave y menor consumo.',
    description: 'Rinde tanto en lagos como en mar con bajas emisiones y respuesta confiable.',
    specs: [
      { name: 'Motor', value: '4 tiempos, 16 valvulas, 4 cilindros en linea DOHC' },
      { name: 'Desplazamiento', value: '1,741 cc' },
      { name: 'Potencia de salida', value: '115 hp @ 5,500 rpm' },
      { name: 'Rango maximo', value: '5,000 - 6,000 rpm' },
      { name: 'Regimen minimo', value: '750 +/- 50 rpm' },
      { name: 'Sistema de lubricacion', value: 'Por carter humedo' },
      { name: 'Sistema de induccion de combustible', value: 'Inyeccion electronica (EFI)' },
      { name: 'Arranque', value: 'Electrico' },
      { name: 'Levante', value: 'Hidraulico' },
      { name: 'Mandos', value: 'Remotos' },
      { name: 'Peso', value: '191 kg' },
    ],
  },
  f130aetl: {
    tagline: 'Porque en el mar, no hay mecanicos. Yamaha.',
    summary: 'Diseno elegante y rendimiento optimo con gran relacion peso/potencia.',
    description: 'Motor versatil para amplia gama de actividades; combina potencia, suavidad y eficiencia.',
    specs: [
      { name: 'Motor', value: '4 tiempos, 16 valvulas, 4 cilindros en linea DOHC' },
      { name: 'Desplazamiento', value: '1,832 cc' },
      { name: 'Potencia de salida', value: '130 hp @ 5,300 rpm' },
      { name: 'Rango maximo', value: '5,300 - 6,300 rpm' },
      { name: 'Regimen minimo', value: '700 - 800 rpm' },
      { name: 'Sistema de lubricacion', value: 'Por carter humedo' },
      { name: 'Arranque', value: 'Electrico' },
      { name: 'Peso', value: '180 kg' },
    ],
  },
  f130aetx: {
    tagline: 'Porque en el mar, no hay mecanicos. Yamaha.',
    summary: 'Diseno elegante y rendimiento optimo con gran relacion peso/potencia.',
    description: 'Motor versatil para amplia gama de actividades; combina potencia, suavidad y eficiencia.',
    specs: [
      { name: 'Motor', value: '4 tiempos, 16 valvulas, 4 cilindros en linea DOHC' },
      { name: 'Desplazamiento', value: '1,832 cc' },
      { name: 'Potencia de salida', value: '130 hp @ 5,300 rpm' },
      { name: 'Rango maximo', value: '5,300 - 6,300 rpm' },
      { name: 'Regimen minimo', value: '700 - 800 rpm' },
      { name: 'Sistema de lubricacion', value: 'Por carter humedo' },
      { name: 'Arranque', value: 'Electrico' },
      { name: 'Peso', value: '180 kg' },
    ],
  },
  fl130aetx: {
    tagline: 'Porque en el mar, no hay mecanicos. Yamaha.',
    summary: 'Diseno elegante y rendimiento optimo con gran relacion peso/potencia.',
    description: 'Motor versatil para amplia gama de actividades; combina potencia, suavidad y eficiencia.',
    specs: [
      { name: 'Motor', value: '4 tiempos, 16 valvulas, 4 cilindros en linea DOHC' },
      { name: 'Desplazamiento', value: '1,832 cc' },
      { name: 'Potencia de salida', value: '130 hp @ 5,300 rpm' },
      { name: 'Rango maximo', value: '5,300 - 6,300 rpm' },
      { name: 'Regimen minimo', value: '700 - 800 rpm' },
      { name: 'Sistema de lubricacion', value: 'Por carter humedo' },
      { name: 'Arranque', value: 'Electrico' },
      { name: 'Peso', value: '180 kg' },
    ],
  },
  f150fetx: {
    tagline: 'Porque en el mar, no hay mecanicos. Yamaha.',
    summary: 'Modelo de 150 hp ideal para uso comercial, transporte en rios y botes de placer.',
    description: 'Su excelente relacion peso/potencia permite altas velocidades de forma suave, limpia y economica.',
    specs: [
      { name: 'Motor', value: '4 tiempos, 16 valvulas, 4 cilindros en linea DOHC' },
      { name: 'Desplazamiento', value: '2,670 cc' },
      { name: 'Potencia de salida', value: '150 hp @ 5,000 rpm' },
      { name: 'Rango maximo', value: '4,500 - 5,500 rpm' },
      { name: 'Regimen minimo', value: '700 +/- 50 rpm' },
      { name: 'Sistema de lubricacion', value: 'Por carter humedo' },
      { name: 'Arranque', value: 'Electrico' },
      { name: 'Levante', value: 'Hidraulico' },
      { name: 'Mandos', value: 'Remotos' },
      { name: 'Peso', value: '223 kg' },
    ],
  },
  fl150fetx: {
    tagline: 'Porque en el mar, no hay mecanicos. Yamaha.',
    summary: 'Modelo de 150 hp ideal para uso comercial, transporte en rios y botes de placer.',
    description: 'Su excelente relacion peso/potencia permite altas velocidades de forma suave, limpia y economica.',
    specs: [
      { name: 'Motor', value: '4 tiempos, 16 valvulas, 4 cilindros en linea DOHC' },
      { name: 'Desplazamiento', value: '2,670 cc' },
      { name: 'Potencia de salida', value: '150 hp @ 5,000 rpm' },
      { name: 'Rango maximo', value: '4,500 - 5,500 rpm' },
      { name: 'Regimen minimo', value: '700 +/- 50 rpm' },
      { name: 'Sistema de lubricacion', value: 'Por carter humedo' },
      { name: 'Arranque', value: 'Electrico' },
      { name: 'Levante', value: 'Hidraulico' },
      { name: 'Mandos', value: 'Remotos' },
      { name: 'Peso', value: '223 kg' },
    ],
  },
  f200fetx: {
    tagline: 'Porque en el mar, no hay mecanicos. Yamaha.',
    summary: 'Cuatro en linea de 200 hp con excelente relacion potencia-peso y direccion integrada.',
    description: 'Su VCT mejora eficiencia de admision y escape para aumentar torque en todo el rango de revoluciones.',
    specs: [
      { name: 'Motor', value: '4 tiempos, 16 valvulas, 4 cilindros en linea DOHC' },
      { name: 'Desplazamiento', value: '2,785 cc' },
      { name: 'Potencia de salida', value: '200 hp @ 6,000 rpm' },
      { name: 'Rango maximo', value: '5,000 - 6,000 rpm' },
      { name: 'Regimen minimo', value: '650 - 750 rpm' },
      { name: 'Sistema de lubricacion', value: 'Por carter humedo' },
      { name: 'Arranque', value: 'Electrico' },
      { name: 'Peso', value: '226 kg' },
    ],
  },
  fl200fetx: {
    tagline: 'Porque en el mar, no hay mecanicos. Yamaha.',
    summary: 'Cuatro en linea de 200 hp con excelente relacion potencia-peso y direccion integrada.',
    description: 'Su VCT mejora eficiencia de admision y escape para aumentar torque en todo el rango de revoluciones.',
    specs: [
      { name: 'Motor', value: '4 tiempos, 16 valvulas, 4 cilindros en linea DOHC' },
      { name: 'Desplazamiento', value: '2,785 cc' },
      { name: 'Potencia de salida', value: '200 hp @ 6,000 rpm' },
      { name: 'Rango maximo', value: '5,000 - 6,000 rpm' },
      { name: 'Regimen minimo', value: '650 - 750 rpm' },
      { name: 'Sistema de lubricacion', value: 'Por carter humedo' },
      { name: 'Arranque', value: 'Electrico' },
      { name: 'Peso', value: '226 kg' },
    ],
  },
  f250hetx: {
    tagline: 'Porque en el mar, no hay mecanicos. Yamaha.',
    summary: 'Apto para trabajo pesado y aplicaciones de transporte o placer.',
    description: 'Sus anillos antiabrasion, bomba cromada y anodizado duro de la unidad inferior mejoran resistencia a corrosion y abrasion.',
    specs: [
      { name: 'Motor', value: '4 tiempos, V6, 24 valvulas DOHC' },
      { name: 'Desplazamiento', value: '3,352 cc' },
      { name: 'Potencia de salida', value: '250 hp @ 5,500 rpm' },
      { name: 'Rango maximo', value: '5,000 - 6,000 rpm' },
      { name: 'Regimen minimo', value: '650 +/- 50 rpm' },
      { name: 'Sistema de lubricacion', value: 'Por carter humedo' },
      { name: 'Sistema de combustible', value: 'Inyeccion electronica (EFI)' },
      { name: 'Arranque', value: 'Electrico' },
      { name: 'Levante', value: 'Hidraulico' },
      { name: 'Mandos', value: 'Remotos' },
      { name: 'Peso', value: '283 kg' },
    ],
  },
  fl250hetx: {
    tagline: 'Porque en el mar, no hay mecanicos. Yamaha.',
    summary: 'Apto para trabajo pesado y aplicaciones de transporte o placer.',
    description: 'Sus anillos antiabrasion, bomba cromada y anodizado duro de la unidad inferior mejoran resistencia a corrosion y abrasion.',
    specs: [
      { name: 'Motor', value: '4 tiempos, V6, 24 valvulas DOHC' },
      { name: 'Desplazamiento', value: '3,352 cc' },
      { name: 'Potencia de salida', value: '250 hp @ 5,500 rpm' },
      { name: 'Rango maximo', value: '5,000 - 6,000 rpm' },
      { name: 'Regimen minimo', value: '650 +/- 50 rpm' },
      { name: 'Sistema de lubricacion', value: 'Por carter humedo' },
      { name: 'Sistema de combustible', value: 'Inyeccion electronica (EFI)' },
      { name: 'Arranque', value: 'Electrico' },
      { name: 'Levante', value: 'Hidraulico' },
      { name: 'Mandos', value: 'Remotos' },
      { name: 'Peso', value: '283 kg' },
    ],
  },
  f300getx: {
    tagline: 'Porque en el mar, no hay mecanicos. Yamaha.',
    summary: 'Gran potencia y altas velocidades con peso reducido para embarcaciones grandes.',
    description: 'Su diseno atractivo y avances tecnologicos brindan una experiencia de navegacion placentera.',
    specs: [
      { name: 'Motor', value: '4 cilindros, 4 tiempos' },
      { name: 'Desplazamiento', value: '4,169 cc' },
      { name: 'Potencia de salida', value: '300 hp @ 5,500 rpm' },
      { name: 'Rango maximo', value: '5,000 - 6,000 rpm' },
      { name: 'Regimen minimo', value: '650 +/- 750 rpm' },
      { name: 'Sistema de lubricacion', value: 'Carter humedo' },
      { name: 'Sistema de induccion de combustible', value: 'Inyectado' },
      { name: 'Arranque', value: 'Electrico' },
      { name: 'Levante', value: 'Hidraulico' },
      { name: 'Mandos', value: 'A distancia' },
      { name: 'Peso', value: '265 kg' },
    ],
  },
  fl300getx: {
    tagline: 'Porque en el mar, no hay mecanicos. Yamaha.',
    summary: 'Gran potencia y altas velocidades con peso reducido para embarcaciones grandes.',
    description: 'Su diseno atractivo y avances tecnologicos brindan una experiencia de navegacion placentera.',
    specs: [
      { name: 'Motor', value: '4 cilindros, 4 tiempos' },
      { name: 'Desplazamiento', value: '4,169 cc' },
      { name: 'Potencia de salida', value: '300 hp @ 5,500 rpm' },
      { name: 'Rango maximo', value: '5,000 - 6,000 rpm' },
      { name: 'Regimen minimo', value: '650 +/- 750 rpm' },
      { name: 'Sistema de lubricacion', value: 'Carter humedo' },
      { name: 'Sistema de induccion de combustible', value: 'Inyectado' },
      { name: 'Arranque', value: 'Electrico' },
      { name: 'Levante', value: 'Hidraulico' },
      { name: 'Mandos', value: 'A distancia' },
      { name: 'Peso', value: '265 kg' },
    ],
  },
  f425aet2x: {
    tagline: 'Porque en el mar, no hay mecanicos. Yamaha.',
    summary: 'Primer 4 tiempos de inyeccion directa con direccion electronica integral.',
    description: 'Revolucion de rendimiento para barcos grandes con nuevo nivel de empuje, torque y velocidad en retroceso.',
    specs: [
      { name: 'Motor', value: '4 tiempos, V8, 32 valvulas, DOHC con VCT' },
      { name: 'Desplazamiento', value: '5,559 cc' },
      { name: 'Potencia de salida', value: '425 hp @ 6,000 rpm' },
      { name: 'Rango maximo', value: '5,000 - 6,000 rpm' },
      { name: 'Regimen minimo', value: '750 +/- 50 rpm' },
      { name: 'Sistema de lubricacion', value: 'Por carter humedo' },
      { name: 'Arranque', value: 'Electrico' },
      { name: 'Peso', value: '442 kg' },
    ],
  },
};

function toShortDescription(text: string): string {
  const clean = text.replace(/\s+/g, ' ').trim();
  if (clean.length <= 140) return clean;
  const sentenceEnd = clean.indexOf('. ');
  if (sentenceEnd > 40 && sentenceEnd < 140) return `${clean.slice(0, sentenceEnd + 1)}`;
  return `${clean.slice(0, 137)}...`;
}

function applyOutboardCopy(products: Product[]): Product[] {
  return products.map((product) => {
    if (product.category.parentCategory !== 'marino' || product.category.slug !== 'motores-fuera-de-borda') return product;

    const detail = OUTBOARD_RICH_DETAILS[product.slug];
    if (detail) {
      const displacement = detail.specs.find((spec) => spec.name === 'Desplazamiento')?.value;
      const power = detail.specs.find((spec) => spec.name === 'Potencia de salida')?.value;
      const weight = detail.specs.find((spec) => spec.name === 'Peso')?.value;

      return {
        ...product,
        tagline: detail.tagline,
        shortDescription: detail.summary,
        description: detail.description,
        keySpecs: [
          { icon: 'engine', value: displacement ?? 'Consultar', label: 'Desplazamiento' },
          { icon: 'power', value: power ?? 'Consultar', label: 'Potencia' },
          { icon: 'weight', value: weight ?? 'Consultar', label: 'Peso' },
        ],
        fullSpecs: [{ group: 'Especificaciones', specs: detail.specs }],
        priceNote: OUTBOARD_LEGAL_NOTE,
      };
    }

    const copy = OUTBOARD_PRODUCT_COPY[product.slug];
    if (!copy) return product;

    const looksGeneric = !product.description || product.description.startsWith('Motor fuera de borda Yamaha');

    return {
      ...product,
      shortDescription: toShortDescription(copy),
      description: looksGeneric ? copy : product.description,
      priceNote: product.priceNote ?? OUTBOARD_LEGAL_NOTE,
    };
  });
}

type SanityImage = {
  alt?: unknown;
  asset?: {
    url?: unknown;
    metadata?: { dimensions?: { width?: unknown; height?: unknown } };
  };
};

type SanityProduct = {
  _id?: unknown;
  _updatedAt?: unknown;
  name?: unknown;
  slug?: unknown;
  year?: unknown;
  productType?: unknown;
  price?: unknown;
  salePrice?: unknown;
  currency?: unknown;
  formattedPrice?: unknown;
  tags?: unknown;
  tagline?: unknown;
  shortDescription?: unknown;
  description?: unknown;
  keySpecs?: unknown;
  fullSpecs?: unknown;
  benefits?: unknown;
  financing?: unknown;
  status?: unknown;
  featured?: unknown;
  sortOrder?: unknown;
  priceNote?: unknown;
  category?: {
    name?: unknown;
    slug?: unknown;
    parentCategory?: unknown;
  };
  heroImage?: SanityImage;
  images?: unknown;
};

let sanityProductsCache: Promise<Product[] | null> | null = null;

function asString(value: unknown, fallback = ''): string {
  return typeof value === 'string' ? value : fallback;
}

function asNumber(value: unknown, fallback: number): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
}

function mapSanityImage(image: SanityImage | undefined, fallbackAlt: string) {
  const url = asString(image?.asset?.url);
  if (!url) return null;
  return {
    url,
    alt: asString(image?.alt, fallbackAlt),
    width: asNumber(image?.asset?.metadata?.dimensions?.width, 800),
    height: asNumber(image?.asset?.metadata?.dimensions?.height, 600),
  };
}

function normalizeParentCategory(value: unknown): Product['category']['parentCategory'] {
  if (value === 'motos' || value === 'cuadraciclos' || value === 'marino') return value;
  return 'motos';
}

function normalizeProductType(value: unknown, parentCategory: Product['category']['parentCategory']): Product['productType'] {
  if (value === 'moto' || value === 'cuadraciclo' || value === 'waverunner' || value === 'motor_fuera_borda') return value;
  if (parentCategory === 'cuadraciclos') return 'cuadraciclo';
  if (parentCategory === 'marino') return 'motor_fuera_borda';
  return 'moto';
}

function normalizeStatus(value: unknown): Product['status'] {
  if (value === 'active' || value === 'coming_soon' || value === 'discontinued') return value;
  return 'active';
}

function normalizeSanityProduct(raw: SanityProduct): Product | null {
  const name = asString(raw.name);
  const slug = asString(raw.slug);
  const categoryName = asString(raw.category?.name);
  const categorySlug = asString(raw.category?.slug);

  if (!name || !slug || !categoryName || !categorySlug) return null;

  const localGalleryImages = getGalleryImages(name, slug);
  const fallbackImage = localGalleryImages?.[0] ?? img(name, slug);
  const imagesFromSanity = Array.isArray(raw.images)
    ? raw.images
        .map((image, index) => mapSanityImage(image as SanityImage, `Yamaha ${name} — foto ${index + 1}`))
        .filter((image): image is NonNullable<ReturnType<typeof mapSanityImage>> => image !== null)
    : [];

  const heroImage =
    localGalleryImages?.[0] ?? imagesFromSanity[0] ?? mapSanityImage(raw.heroImage, `Yamaha ${name}`) ?? fallbackImage;
  const images = localGalleryImages ?? (imagesFromSanity.length > 0 ? imagesFromSanity : [heroImage]);

  const parentCategory = normalizeParentCategory(raw.category?.parentCategory);
  const price = asNumber(raw.price, 0);
  const currency = asString(raw.currency, 'CRC') as Product['currency'];

  return {
    _id: asString(raw._id, slug),
    _updatedAt: asString(raw._updatedAt, new Date().toISOString()),
    name,
    slug,
    year: asNumber(raw.year, new Date().getFullYear()),
    category: {
      name: categoryName,
      slug: categorySlug,
      parentCategory,
    },
    productType: normalizeProductType(raw.productType, parentCategory),
    price,
    salePrice: typeof raw.salePrice === 'number' ? raw.salePrice : undefined,
    currency,
    formattedPrice: asString(raw.formattedPrice, price.toLocaleString('es-CR', { style: 'currency', currency })),
    tags: Array.isArray(raw.tags) ? raw.tags.filter((tag): tag is string => typeof tag === 'string') : undefined,
    tagline: asString(raw.tagline) || undefined,
    images,
    heroImage,
    shortDescription: asString(raw.shortDescription, ''),
    description: asString(raw.description) || undefined,
    keySpecs: Array.isArray(raw.keySpecs) ? (raw.keySpecs as Product['keySpecs']) : [],
    fullSpecs: Array.isArray(raw.fullSpecs) ? (raw.fullSpecs as Product['fullSpecs']) : [],
    benefits: Array.isArray(raw.benefits) ? (raw.benefits as Product['benefits']) : [],
    financing:
      raw.financing && typeof raw.financing === 'object'
        ? ({
            eligible: Boolean((raw.financing as Product['financing']).eligible),
            defaultDownPayment: asNumber((raw.financing as Product['financing']).defaultDownPayment, 20),
            defaultTerm: asNumber((raw.financing as Product['financing']).defaultTerm, 60),
            monthlyPayment:
              typeof (raw.financing as Product['financing']).monthlyPayment === 'number'
                ? (raw.financing as Product['financing']).monthlyPayment
                : undefined,
            termMonths:
              typeof (raw.financing as Product['financing']).termMonths === 'number'
                ? (raw.financing as Product['financing']).termMonths
                : undefined,
          } satisfies Product['financing'])
        : { eligible: false, defaultDownPayment: 20, defaultTerm: 60 },
    relatedProducts: undefined,
    status: normalizeStatus(raw.status),
    featured: Boolean(raw.featured),
    sortOrder: asNumber(raw.sortOrder, 9999),
    priceNote: asString(raw.priceNote) || undefined,
  };
}

async function fetchSanityProducts(): Promise<Product[] | null> {
  if (!SANITY_ENABLED) return null;

  try {
    const result = await sanityFetch<SanityProduct[]>(SANITY_PRODUCTS_QUERY);
    const normalized = result.map(normalizeSanityProduct).filter((product): product is Product => product !== null);
    return normalized.length > 0 ? normalized : null;
  } catch {
    return null;
  }
}

async function getProductsDataSource(): Promise<Product[]> {
  if (!SANITY_ENABLED) return applyOutboardCopy(PRODUCTS);
  if (!sanityProductsCache) sanityProductsCache = fetchSanityProducts();

  const sanityProducts = await sanityProductsCache;
  return applyOutboardCopy(sanityProducts ?? PRODUCTS);
}

export async function getProduct(slug: string): Promise<Product | null> {
  const products = await getProductsDataSource();
  return products.find((p) => p.slug === slug) || null;
}

export async function getAllProducts(): Promise<Product[]> {
  return getProductsDataSource();
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const products = await getProductsDataSource();
  return products.filter((p) => p.featured);
}

export async function getProductsByCategory(categorySlug: string): Promise<Product[]> {
  return PRODUCTS.filter((p) => {
    if (p.category.slug === categorySlug) return true;
    const extra = ALSO_IN_CATEGORY[p.slug];
    return extra?.includes(categorySlug) ?? false;
  });
}

export async function getRelatedProducts(categorySlug: string, excludeId: string): Promise<Product[]> {
  const inCategory = await getProductsByCategory(categorySlug);
  return inCategory.filter((p) => p._id !== excludeId).slice(0, 3);
}

export async function getAllCategories() {
  const products = await getProductsDataSource();
  const categories = [...new Map(products.map((p) => [p.category.slug, p.category])).values()];
  return categories;
}

export async function getProductCards(): Promise<ProductCard[]> {
  const products = await getProductsDataSource();
  return products.map(({ _id, name, slug, category, price, salePrice, currency, heroImage, keySpecs, tags, status }) => ({
    _id,
    name,
    slug,
    category,
    price,
    salePrice,
    currency,
    heroImage,
    keySpecs,
    tags,
    status,
  }));
}
