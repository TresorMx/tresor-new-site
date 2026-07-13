// Material estático de Quattro (Long Island/Gardens) — existía antes de que
// el Drive de Ventas viviera en Sanity. Se usa como fallback en
// /api/asesor/file cuando el campo de Sanity está vacío, Y como fuente de
// "esto sí está disponible" al decidir qué tiles mostrar en la página
// (ver AsesorDrive.tsx) — ambos usan este mismo mapa para no desincronizarse.
export const STATIC_FILES: Record<string, Record<string, string>> = {
  'long-island': {
    presentation: '/broker/long-island/presentacion.pdf',
    priceList: '/broker/long-island/lista-precios.pdf',
    masterPlan: '/broker/long-island/master-plan.pdf',
    bankAccounts: '/broker/long-island/datos-bancarios.pdf',
    location: '/broker/long-island/ubicacion.jpg',
    marketing: '/broker/long-island/marketing.zip',
    developer: '/broker/long-island/desarrollador.pdf',
    renders: '/broker/long-island/renders.zip',
    receiptPay: '/broker/long-island/recibo-de-pago.docx',
    receiptReserve: '/broker/long-island/recibo-de-reserva.docx',
    checklist: '/broker/long-island/check-list.docx',
    offerLetter: '/broker/long-island/carta-oferta.docx',
  },
  gardens: {
    presentation: '/broker/gardens/presentacion.pdf',
    priceList: '/broker/gardens/lista-precios.pdf',
    masterPlan: '/broker/gardens/master-plan.pdf',
    bankAccounts: '/broker/gardens/datos-bancarios.pdf',
    location: '/broker/gardens/ubicacion.pdf',
    marketing: '/broker/gardens/marketing.zip',
    developer: '/broker/gardens/desarrollador.pdf',
    renders: '/broker/gardens/renders.zip',
    receiptPay: '/broker/gardens/recibo-de-pago.docx',
    receiptReserve: '/broker/gardens/recibo-de-reserva.docx',
    checklist: '/broker/gardens/check-list.docx',
    offerLetter: '/broker/gardens/carta-oferta.docx',
  },
};
