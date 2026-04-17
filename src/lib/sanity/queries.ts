import type { Product, ProductCard } from '@/types';

const PRODUCT_IMAGES: Record<string, { category: string; folder: string; count: number }> = {
  'ray-zr':             { category: 'scooter',          folder: 'ray-zr',                  count: 1 },
  'nmax':               { category: 'scooter',          folder: 'nmax',                     count: 2 },
  'xmax-300':           { category: 'scooter',          folder: 'x-max300',                 count: 2 },
  'crux-rev':           { category: 'urbanas',          folder: 'crux-rev',                 count: 3 },
  'ys125-ed':           { category: 'urbanas',          folder: 'ys125-ed',                 count: 2 },
  'fzn150-fi':          { category: 'urbanas',          folder: 'fzn150-fl',                count: 1 },
  'fzn150-4-fi-abs-tcs':{ category: 'urbanas',          folder: 'fzn150-4.0-fl-abs-tcs',    count: 7 },
  'fz-250-fi':          { category: 'urbanas',          folder: 'fz-250-fi',                count: 9 },
  'mt-15-fi':           { category: 'urbanas',          folder: 'mt-15-fi',                 count: 8 },
  'mt-03-fi':           { category: 'urbanas',          folder: 'mt-03-fi',                 count: 10 },
  'yzf-r3-fi':          { category: 'urbanas',          folder: 'yzf-r3-fi',                count: 7 },
  'ys125-g':            { category: 'montanero',        folder: 'ys125-g',                  count: 2 },
  'xtz-125':            { category: 'montanero',        folder: 'xtz-125',                  count: 5 },
  'xtz-150-fi':         { category: 'montanero',        folder: 'xtz-150-fi',               count: 5 },
  'wr155-fi':           { category: 'montanero',        folder: 'wr155-fi',                 count: 6 },
};

function img(model: string, slug: string) {
  const entry = PRODUCT_IMAGES[slug];
  if (entry) {
    return {
      url: `/products/motos/${entry.category}/${entry.folder}/gallery-1.avif`,
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
  const entry = PRODUCT_IMAGES[slug];
  if (entry) {
    return Array.from({ length: entry.count }, (_, i) => ({
      url: `/products/motos/${entry.category}/${entry.folder}/gallery-${i + 1}.avif`,
      alt: `Yamaha ${model} — foto ${i + 1}`,
      width: 800,
      height: 600,
    }));
  }
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

export async function getProduct(slug: string): Promise<Product | null> {
  return PRODUCTS.find((p) => p.slug === slug) || null;
}

export async function getAllProducts(): Promise<Product[]> {
  return PRODUCTS;
}

export async function getFeaturedProducts(): Promise<Product[]> {
  return PRODUCTS.filter((p) => p.featured);
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
  const categories = [...new Map(PRODUCTS.map((p) => [p.category.slug, p.category])).values()];
  return categories;
}

export async function getProductCards(): Promise<ProductCard[]> {
  return PRODUCTS.map(({ _id, name, slug, category, price, salePrice, currency, heroImage, keySpecs, tags, status }) => ({
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
