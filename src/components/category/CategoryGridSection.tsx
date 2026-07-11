import SalesPartnerGrid from '@/components/home/SalesPartnerGrid';
import type { Development } from '@/lib/developments';

// Sección de cards + filtros para las landings de categoría (tipo/ciudad/
// desarrollador) — misma envoltura visual (gradiente gris, container-wrap)
// que ya usa la sección "Sales Partner" del home; solo cambia qué filtros
// de SalesPartnerGrid se muestran.
export default function CategoryGridSection({
  eyebrow,
  title,
  developments,
  showDeveloperFilter = true,
  showStatusFilter = true,
}: {
  eyebrow: string;
  title: React.ReactNode;
  developments: Development[];
  showDeveloperFilter?: boolean;
  showStatusFilter?: boolean;
}) {
  return (
    <section
      data-nav="light"
      className="relative z-10 -mt-10 rounded-[2.5rem] py-20 md:py-28"
      style={{ backgroundImage: 'linear-gradient(180deg, #f7f8fa 0%, #f2f3f5 55%, #eceef1 100%)' }}
    >
      <div className="container-wrap">
        <SalesPartnerGrid
          developments={developments}
          showDeveloperFilter={showDeveloperFilter}
          showCityFilter={false}
          showTypeFilter={false}
          showStatusFilter={showStatusFilter}
        >
          <div>
            <span className="eyebrow eyebrow-accent font-bold">{eyebrow}</span>
            <h2 className="mt-4 font-sans text-[clamp(24px,3.2vw,48px)] font-normal leading-[1.05] tracking-tight">
              {title}
            </h2>
          </div>
        </SalesPartnerGrid>
      </div>
    </section>
  );
}
