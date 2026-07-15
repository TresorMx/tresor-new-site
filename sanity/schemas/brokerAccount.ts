import { defineField, defineType } from 'sanity';

// Cuenta de broker externo — registro real con contraseña + verificación por
// correo (ver src/app/api/broker/). Los campos de OTP/password nunca se
// exponen al cliente: solo los leen las rutas server-side en
// src/lib/broker/.
export default defineType({
  name: 'brokerAccount',
  title: 'Cuenta de broker',
  type: 'document',
  fields: [
    defineField({ name: 'fullName', title: 'Nombre completo', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'email', title: 'Correo', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'phone', title: 'Teléfono', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'brokerage', title: 'Inmobiliaria', type: 'string' }),
    defineField({ name: 'passwordHash', title: 'Password (hash)', type: 'string', readOnly: true }),
    defineField({ name: 'verified', title: 'Verificado', type: 'boolean', initialValue: false }),
    defineField({ name: 'otpCodeHash', title: 'Código OTP (hash)', type: 'string', readOnly: true }),
    defineField({ name: 'otpExpiresAt', title: 'OTP expira', type: 'datetime', readOnly: true }),
    defineField({ name: 'otpAttempts', title: 'Intentos de OTP', type: 'number', initialValue: 0, readOnly: true }),
    defineField({ name: 'createdAt', title: 'Creado', type: 'datetime', initialValue: () => new Date().toISOString() }),
  ],
  preview: {
    select: { title: 'fullName', subtitle: 'email', verified: 'verified' },
    prepare: ({ title, subtitle, verified }) => ({
      title: title || subtitle || '(sin nombre)',
      subtitle: `${verified ? '✅ verificado' : '⏳ sin verificar'} · ${subtitle ?? ''}`,
    }),
  },
});
