import { defineType, defineField } from 'sanity';

// Cada campo del Drive de Ventas acepta O un archivo subido O una liga
// externa (Google Drive, Canva, etc.) — nunca ambos a la vez. El frontend
// (src/lib/sanity/drive.ts) resuelve cuál de los dos está lleno; si es una
// liga, /asesores/[slug] la abre en pestaña nueva en vez de descargarla.
export default defineType({
  name: 'driveAsset',
  title: 'Archivo o liga',
  type: 'object',
  fields: [
    defineField({ name: 'file', title: 'Archivo', type: 'file' }),
    defineField({
      name: 'url',
      title: 'Liga (URL)',
      type: 'url',
      description: 'Alternativa a subir un archivo — pega una liga (Google Drive, Canva, etc.). Se abre en una pestaña nueva. Si llenas esto, deja "Archivo" vacío.',
      validation: (Rule) => Rule.uri({ scheme: ['http', 'https'] }),
    }),
  ],
  preview: {
    select: { fileName: 'file.asset.originalFilename', url: 'url' },
    prepare({ fileName, url }) {
      if (url) return { title: `Liga → ${url}` };
      if (fileName) return { title: fileName };
      return { title: 'Vacío' };
    },
  },
});
