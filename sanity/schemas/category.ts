import { defineField, defineType } from 'sanity';

export const category = defineType({
  name: 'category',
  title: 'Categoría',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Nombre',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'name', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'parentCategory',
      title: 'Categoría padre',
      type: 'string',
      options: {
        list: [
          { title: 'Motos', value: 'motos' },
          { title: 'Cuadraciclos', value: 'cuadraciclos' },
          { title: 'Marino', value: 'marino' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Descripción',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'image',
      title: 'Imagen',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'sortOrder',
      title: 'Orden',
      type: 'number',
      initialValue: 0,
    }),
  ],
  preview: {
    select: { title: 'name', subtitle: 'parentCategory' },
  },
  orderings: [
    { title: 'Orden', name: 'sortOrderAsc', by: [{ field: 'sortOrder', direction: 'asc' }] },
  ],
});
