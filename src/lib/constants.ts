export const SITE_NAME = 'Yamaha Costa Rica';
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://yamahacr.com';

export const CONTACT = {
  phone: '+506 2211 5900',
  phoneRaw: '+50622115900',
  whatsapp: '+506 8302 7848',
  whatsappRaw: '50683027848',
  email: 'mercadeo@yamahacr.com',
  hours: {
    weekdays: 'L-V: 8:00am - 5:30pm',
    saturday: 'Sab: 9:00am - 1:00pm',
    sunday: 'Domingo: Cerrado',
    short: 'L-V: 8:00am - 5:30pm · Sab: 9:00am - 1:00pm',
  },
} as const;

export const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || CONTACT.whatsapp;

export const SOCIALS = [
  { name: 'Facebook', href: 'https://www.facebook.com/yamahacr' },
  { name: 'Instagram', href: 'https://www.instagram.com/yamahacostarica/' },
  { name: 'TikTok', href: 'https://www.tiktok.com/@yamahacostarica' },
] as const;

export const DEALERSHIP = {
  name: 'Yamaha La Uruca',
  address: 'La Uruca, frente a Capris, San José, Costa Rica',
  phone: CONTACT.phone,
  phoneRaw: CONTACT.phoneRaw,
  whatsapp: CONTACT.whatsapp,
  whatsappRaw: CONTACT.whatsappRaw,
  email: CONTACT.email,
  hours: CONTACT.hours,
  coordinates: { lat: 9.9516, lng: -84.1107 },
  mapsQuery: 'Yamaha+Costa+Rica+La+Uruca+San+José',
  mapsEmbedUrl:
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31438.29793188868!2d-84.12614967271416!3d9.95165216767524!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8fa0e4ae729e7915%3A0xd0cd4a67de9d18a5!2sYamaha!5e0!3m2!1sen!2sus!4v1776401705477!5m2!1sen!2sus',
  directionsUrl:
    'https://www.google.com/maps/dir/?api=1&destination=Yamaha+Costa+Rica+La+Uruca+San+José',
  services: ['Ventas', 'Taller', 'Repuestos'] as const,
} as const;

export const WORKSHOPS = [
  {
    name: 'La Uruca',
    phone: '+506 2211-5903',
    phoneRaw: '+50622115903',
    whatsapp: '+506 8302-7848',
    whatsappRaw: '50683027848',
  },
  {
    name: 'Alajuela',
    phone: '+506 2431-2054',
    phoneRaw: '+50624312054',
    whatsapp: null,
    whatsappRaw: null,
  },
  {
    name: 'Plaza Viquez',
    phone: '+506 2226-0119',
    phoneRaw: '+50622260119',
    whatsapp: null,
    whatsappRaw: null,
  },
] as const;

export const REPUESTOS = {
  phone: '+506 2211-5902',
  phoneRaw: '+50622115902',
  whatsapp: '+506 8302-7848',
  whatsappRaw: '50683027848',
} as const;

export const CATEGORIES = {
  motos: {
    label: 'Motos',
    subcategories: [
      { slug: 'scooter', label: 'Scooter' },
      { slug: 'urbanas', label: 'Urbanas / Street' },
      { slug: 'montanero', label: 'Montañero' },
      { slug: 'alta-cilindrada', label: 'Alta Cilindrada' },
      { slug: 'motocross', label: 'Motocross' },
      { slug: 'enduro', label: 'Enduro' },
    ],
  },
  cuadraciclos: {
    label: 'Cuadraciclos & Mulas',
    subcategories: [],
  },
  marino: {
    label: 'Marino',
    subcategories: [
      { slug: 'waverunner', label: 'Waverunner' },
      { slug: 'motores-fuera-de-borda', label: 'Motores Fuera de Borda' },
      { slug: 'cotizador-marino', label: 'Cotizador Marino', href: '/cotizadormarino' },
      { slug: 'taller-marino', label: 'Taller Marino', href: '/tallermarino' },
      { slug: 'repuestos-y-accesorios', label: 'Repuestos y Accesorios', href: '/repuestos' },
    ],
  },
} as const;

export const NAV_ITEMS = [
  { label: 'Motos', href: '/motos', key: 'motos' as const, hasMegaMenu: true },
  { label: 'Cuadraciclos & Mulas', href: '/cuadraciclos', key: 'cuadraciclos' as const, hasMegaMenu: false },
  { label: 'Marino', href: '/marino', key: 'marino' as const, hasMegaMenu: true },
  { label: 'Repuestos', href: '/repuestos', key: null, hasMegaMenu: false },
  { label: 'Taller', href: '/taller', key: null, hasMegaMenu: false },
  { label: 'Contacto', href: '/contacto', key: null, hasMegaMenu: false },
] as const;

export const FINANCING_DEFAULTS = {
  annualRate: 12.5,
  defaultDownPayment: 20,
  defaultTerm: 48,
  minDownPayment: 10,
  maxDownPayment: 50,
  termOptions: [12, 24, 36, 48, 60, 72],
} as const;
