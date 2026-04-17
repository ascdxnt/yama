import { defineField, defineType } from 'sanity';

export const product = defineType({
  name: 'product',
  title: 'Producto',
  type: 'document',
  groups: [
    { name: 'info', title: 'Información', default: true },
    { name: 'pricing', title: 'Precios' },
    { name: 'specs', title: 'Especificaciones' },
    { name: 'media', title: 'Imágenes' },
    { name: 'financing', title: 'Financiamiento' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    defineField({
      name: 'name',
      title: 'Nombre',
      type: 'string',
      group: 'info',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'info',
      options: { source: 'name', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'year',
      title: 'Año del modelo',
      type: 'number',
      group: 'info',
      initialValue: new Date().getFullYear(),
      validation: (Rule) => Rule.required().min(2020).max(2030),
    }),
    defineField({
      name: 'category',
      title: 'Categoría',
      type: 'reference',
      to: [{ type: 'category' }],
      group: 'info',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'additionalCategories',
      title: 'Categorías adicionales',
      description: 'Categorías donde también aparece este producto (ej: Alta Cilindrada, Enduro)',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'category' }] }],
      group: 'info',
    }),
    defineField({
      name: 'productType',
      title: 'Tipo de producto',
      type: 'string',
      group: 'info',
      options: {
        list: [
          { title: 'Moto', value: 'moto' },
          { title: 'Cuadraciclo', value: 'cuadraciclo' },
          { title: 'Waverunner', value: 'waverunner' },
          { title: 'Motor Fuera de Borda', value: 'motor_fuera_borda' },
        ],
      },
      initialValue: 'moto',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'status',
      title: 'Estado',
      type: 'string',
      group: 'info',
      options: {
        list: [
          { title: 'Activo', value: 'active' },
          { title: 'Próximamente', value: 'coming_soon' },
          { title: 'Descontinuado', value: 'discontinued' },
        ],
      },
      initialValue: 'active',
    }),
    defineField({
      name: 'featured',
      title: 'Destacado',
      type: 'boolean',
      group: 'info',
      initialValue: false,
    }),
    defineField({
      name: 'sortOrder',
      title: 'Orden',
      type: 'number',
      group: 'info',
      initialValue: 0,
    }),
    defineField({
      name: 'tags',
      title: 'Etiquetas',
      description: 'BlueCore, ABS, TCS, FI, Y-Connect, CrossPlane, DeltaBox, VVA, etc.',
      type: 'array',
      of: [{ type: 'string' }],
      group: 'info',
      options: { layout: 'tags' },
    }),
    defineField({
      name: 'tagline',
      title: 'Tagline',
      type: 'string',
      group: 'info',
    }),

    // Pricing
    defineField({
      name: 'price',
      title: 'Precio',
      type: 'number',
      group: 'pricing',
      validation: (Rule) => Rule.required().positive(),
    }),
    defineField({
      name: 'salePrice',
      title: 'Precio de oferta',
      type: 'number',
      group: 'pricing',
    }),
    defineField({
      name: 'currency',
      title: 'Moneda',
      type: 'string',
      group: 'pricing',
      options: {
        list: [
          { title: 'Colones (₡)', value: 'CRC' },
          { title: 'Dólares ($)', value: 'USD' },
        ],
      },
      initialValue: 'CRC',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'priceNote',
      title: 'Nota de precio',
      type: 'string',
      group: 'pricing',
    }),

    // Media
    defineField({
      name: 'heroImage',
      title: 'Imagen principal',
      type: 'image',
      group: 'media',
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'images',
      title: 'Galería de imágenes',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
      group: 'media',
    }),

    // Content
    defineField({
      name: 'shortDescription',
      title: 'Descripción corta',
      type: 'text',
      rows: 3,
      group: 'info',
      validation: (Rule) => Rule.required().max(300),
    }),
    defineField({
      name: 'description',
      title: 'Descripción completa',
      type: 'array',
      of: [{ type: 'block' }],
      group: 'info',
    }),

    // Specs
    defineField({
      name: 'keySpecs',
      title: 'Especificaciones principales',
      description: 'Motor, Potencia, Peso, Transmisión (4 máximo)',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'icon', title: 'Ícono', type: 'string' },
            { name: 'value', title: 'Valor', type: 'string' },
            { name: 'label', title: 'Etiqueta', type: 'string' },
          ],
        },
      ],
      group: 'specs',
      validation: (Rule) => Rule.max(4),
    }),
    defineField({
      name: 'fullSpecs',
      title: 'Especificaciones completas',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'specGroup',
          fields: [
            { name: 'group', title: 'Grupo', type: 'string' },
            {
              name: 'specs',
              title: 'Especificaciones',
              type: 'array',
              of: [
                {
                  type: 'object',
                  fields: [
                    { name: 'name', title: 'Nombre', type: 'string' },
                    { name: 'value', title: 'Valor', type: 'string' },
                  ],
                },
              ],
            },
          ],
        },
      ],
      group: 'specs',
    }),

    // Benefits
    defineField({
      name: 'benefits',
      title: 'Beneficios',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'type',
              title: 'Tipo',
              type: 'string',
              options: {
                list: [
                  { title: 'Emocional', value: 'emotional' },
                  { title: 'Práctico', value: 'practical' },
                ],
              },
            },
            { name: 'title', title: 'Título', type: 'string' },
            { name: 'description', title: 'Descripción', type: 'text', rows: 2 },
          ],
        },
      ],
      group: 'info',
    }),

    // Financing
    defineField({
      name: 'financing',
      title: 'Financiamiento',
      type: 'object',
      group: 'financing',
      fields: [
        { name: 'eligible', title: 'Aplica financiamiento', type: 'boolean', initialValue: true },
        { name: 'monthlyPayment', title: 'Cuota mensual', type: 'number' },
        { name: 'termMonths', title: 'Plazo (meses)', type: 'number', initialValue: 60 },
        { name: 'defaultDownPayment', title: 'Prima por defecto (%)', type: 'number', initialValue: 20 },
        { name: 'defaultTerm', title: 'Plazo por defecto (meses)', type: 'number', initialValue: 60 },
      ],
    }),

    // SEO
    defineField({
      name: 'seoTitle',
      title: 'Título SEO',
      type: 'string',
      group: 'seo',
    }),
    defineField({
      name: 'seoDescription',
      title: 'Descripción SEO',
      type: 'text',
      rows: 3,
      group: 'seo',
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'category.name',
      media: 'heroImage',
    },
  },
  orderings: [
    { title: 'Precio ascendente', name: 'priceAsc', by: [{ field: 'price', direction: 'asc' }] },
    { title: 'Precio descendente', name: 'priceDesc', by: [{ field: 'price', direction: 'desc' }] },
    { title: 'Nombre', name: 'nameAsc', by: [{ field: 'name', direction: 'asc' }] },
    { title: 'Orden personalizado', name: 'sortOrderAsc', by: [{ field: 'sortOrder', direction: 'asc' }] },
  ],
});
