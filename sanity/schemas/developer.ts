import { defineField, defineType } from 'sanity';

// Un developer se edita UNA vez y sirve para todas sus fichas (ej. Onix
// Living aparece en Koa, Zienna, Villalta y Bardenna) — por eso es su propio
// documento y no texto repetido dentro de cada desarrollo.
export default defineType({
  name: 'developer',
  title: 'Desarrollador',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Nombre',
      type: 'string',
      description: 'Ej: "Onix Living". Así se muestra en toda la ficha.',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'logoDark',
      title: 'Logo (versión oscura/normal)',
      type: 'image',
      description: 'El que se ve sobre fondo blanco. Si se deja vacío, la ficha muestra el nombre en texto.',
    }),
    defineField({
      name: 'blockLabel',
      title: 'Etiqueta sobre el logo (ES)',
      type: 'string',
      description: 'Ej: "Desarrollado por". Para Tresor suele decir "Empresa desarrolladora".',
      initialValue: 'Desarrollado por',
    }),
    defineField({ name: 'blockLabelEn', title: 'Etiqueta sobre el logo (EN)', type: 'string', initialValue: 'Developed by' }),
    defineField({
      name: 'credentials',
      title: '🏆 Credenciales / trayectoria (ES)',
      type: 'text',
      rows: 3,
      description: 'Párrafo con cifras reales (años, unidades entregadas, desarrollos). Los números se resaltan solos en negrita — no hace falta marcarlos. Si se deja vacío, la ficha solo muestra el logo, sin párrafo.',
    }),
    defineField({ name: 'credentialsEn', title: '🏆 Credenciales / trayectoria (EN)', type: 'text', rows: 3 }),
  ],
  preview: {
    select: { title: 'name', media: 'logoDark' },
  },
});
