import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'siteSettings',
  title: 'Configuración del sitio',
  type: 'document',
  fields: [
    defineField({
      name: 'headerLogoStyle',
      title: 'Logo del header',
      type: 'string',
      initialValue: 'vertical',
      options: {
        list: [
          { title: 'Vertical (el actual)', value: 'vertical' },
          { title: 'Horizontal (el anterior)', value: 'horizontal' },
        ],
        layout: 'radio',
      },
      description: 'Qué versión del logo de Tresor se muestra en el header. Ambas ya traen su variante blanca (fondo oscuro) y negra (fondo claro), se ajusta sola según la sección.',
    }),
    defineField({
      name: 'weDevelopLayout',
      title: 'Estilo de la sección "We Develop" (home)',
      type: 'string',
      initialValue: 'cards',
      options: {
        list: [
          { title: 'Cards (como Sales Partner)', value: 'cards' },
          { title: 'Carrusel con tabs (el original)', value: 'carousel' },
        ],
        layout: 'radio',
      },
      description: 'Cómo se muestran los desarrollos propios de Tresor en el home. "Cards" usa el mismo estilo de card que la sección Sales Partner; "Carrusel" es el slider con tabs y foto grande.',
    }),
    defineField({
      name: 'salesPartnerLayout',
      title: 'Estilo de la sección "Sales Partner" (home)',
      type: 'string',
      initialValue: 'grouped',
      options: {
        list: [
          { title: 'Agrupado por desarrollador (secciones)', value: 'grouped' },
          { title: 'Grid con filtros (el original)', value: 'grid' },
        ],
        layout: 'radio',
      },
      description: 'Cómo se muestran los desarrollos de Sales Partner en el home. "Agrupado" hace una sección por desarrollador (título + logo + sus cards); "Grid" es el listado con filtros de desarrollador/ciudad/tipo.',
    }),
    defineField({
      name: 'showAgendaWidget',
      title: 'Mostrar "Agenda tu visita" en lugar del cotizador',
      type: 'boolean',
      initialValue: false,
      description: 'Activa esto para reemplazar el cotizador en todas las páginas de plaza por el formulario de agenda de visita.',
    }),
    defineField({
      name: 'agendaEyebrow',
      title: 'Eyebrow agenda (ES)',
      type: 'string',
      initialValue: '— Agenda tu visita',
      description: 'Texto pequeño sobre el título cuando el widget de agenda está activo.',
    }),
    defineField({
      name: 'agendaEyebrowEn',
      title: 'Eyebrow agenda (EN)',
      type: 'string',
      description: 'Igual que el de arriba, en inglés. Si se deja vacío, se usa el texto en español.',
    }),
    defineField({
      name: 'agendaTitle1',
      title: 'Título agenda — línea 1 (ES)',
      type: 'string',
      initialValue: 'Agenda',
      description: 'Primera línea del título cuando el widget de agenda está activo.',
    }),
    defineField({
      name: 'agendaTitle1En',
      title: 'Título agenda — línea 1 (EN)',
      type: 'string',
      description: 'Igual que el de arriba, en inglés. Si se deja vacío, se usa el texto en español.',
    }),
    defineField({
      name: 'agendaTitle2',
      title: 'Título agenda — línea 2 (ES)',
      type: 'string',
      initialValue: 'tu visita',
      description: 'Segunda línea del título cuando el widget de agenda está activo.',
    }),
    defineField({
      name: 'agendaTitle2En',
      title: 'Título agenda — línea 2 (EN)',
      type: 'string',
      description: 'Igual que el de arriba, en inglés. Si se deja vacío, se usa el texto en español.',
    }),
    defineField({
      name: 'agendaDesc',
      title: 'Descripción agenda (ES)',
      type: 'string',
      initialValue: 'Elige fecha, hora y modalidad. Te confirmamos en menos de 24 hrs.',
      description: 'Texto descriptivo debajo del título del widget de agenda.',
    }),
    defineField({
      name: 'agendaDescEn',
      title: 'Descripción agenda (EN)',
      type: 'string',
      description: 'Igual que el de arriba, en inglés. Si se deja vacío, se usa el texto en español.',
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Configuración del sitio' };
    },
  },
});
