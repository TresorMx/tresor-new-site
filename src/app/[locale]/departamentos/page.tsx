import type { Metadata } from 'next';
import CategoryHero from '@/components/category/CategoryHero';
import CategoryGridSection from '@/components/category/CategoryGridSection';
import { getMergedDevelopmentsAsync } from '@/lib/developments';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Departamentos en Venta en Cancún y Riviera Maya',
  description:
    'Departamentos en preventa y entrega inmediata en Cancún, Tulum, Playa del Carmen y Puerto Cancún. Inversión inmobiliaria con las desarrolladoras más sólidas de Quintana Roo.',
  alternates: { canonical: 'https://tresor.mx/departamentos' },
  openGraph: {
    title: 'Departamentos en Venta en Cancún y Riviera Maya',
    description: 'Departamentos en preventa y entrega inmediata con las desarrolladoras más sólidas de Quintana Roo.',
    url: 'https://tresor.mx/departamentos',
    images: [{ url: '/ogfinal.jpg', width: 1200, height: 630 }],
  },
};

export default async function DepartamentosPage() {
  const all = await getMergedDevelopmentsAsync();
  const developments = all.filter((d) => d.propertyType === 'Departamento');

  return (
    <>
      <CategoryHero
        image="/desarrollo-corporativo/LuxuryL.jpg"
        imageAlt="Departamentos en venta en Cancún y Riviera Maya"
        eyebrow="— Propiedades"
        title="Departamentos"
        subtitle="Preventa y entrega inmediata en Cancún, Tulum, Playa del Carmen y Puerto Cancún — con las desarrolladoras más sólidas de la región."
      />
      <CategoryGridSection
        eyebrow="Departamentos"
        title={<>Encuentra tu <span className="text-ink-3">próximo hogar o inversión</span></>}
        developments={developments}
      />
    </>
  );
}
