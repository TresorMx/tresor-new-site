import { notFound } from 'next/navigation';
import { cookies } from 'next/headers';
import type { CSSProperties } from 'react';
import Image from 'next/image';
import { Link } from '@/navigation';
import type { Metadata } from 'next';
import { ArrowRight, Building2, Layers, MapPin } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

import { getActivePlazasAsync, getPlazaBySlugAsync, getMinAvailablePrice, getSiteSettings } from '@/lib/data';
import { formatMXN, cn } from '@/lib/utils';
import { renderEditorial } from '@/lib/richText';
import { verifySession, ASESOR_COOKIE } from '@/lib/asesor/session';
import MasterPlan from '@/components/MasterPlan';
import Gallery from '@/components/Gallery';
import FloorPlans from '@/components/FloorPlans';
import LocationMap from '@/components/LocationMap';
import QuoteWizard from '@/components/QuoteWizard';
import AgendaWidget from '@/components/AgendaWidget';
import AgendaReservaTabs from '@/components/AgendaReservaTabs';
import AsesorApartadoOnly from '@/components/asesor/AsesorApartadoOnly';
import PixelViewContent from '@/components/PixelViewContent';
import FichaDeveloper from '@/components/ficha/FichaDeveloper';
import FichaAmenities from '@/components/ficha/FichaAmenities';
import FichaFloorPlans from '@/components/ficha/FichaFloorPlans';
import ReservaRapidaForm from '@/components/ficha/ReservaRapidaForm';
import RelatedDevelopments from '@/components/ficha/RelatedDevelopments';
import FichaContentBlock from '@/components/ficha/FichaContentBlock';
import { getDevelopment, developers, allDevelopmentRouteSlugs, getReservationAmount, getMergedDevelopmentsAsync, fichaSeoTitle } from '@/lib/developments';
import { OBJECT_POSITION_MOBILE, OBJECT_POSITION_DESKTOP } from '@/lib/heroImagePosition';

// El cotizador interno (/cotizar/[slug]) todavía no está listo para asesores
// — mientras tanto, "Cotizar" en fichas de Quattro (con `plaza`) manda al
// cotizador real de quattroplaza.mx, en pestaña nueva.
const QUATTRO_COTIZADOR_URL = 'https://www.quattroplaza.mx/cotizador';

export async function generateStaticParams() {
  // Tresor (con ficha en Sanity) + Sales Partner (solo developments.ts) —
  // ambos viven bajo /desarrollos/[slug], mismo contenedor de ruta.
  const plazas = await getActivePlazasAsync();
  const slugs = new Set([...plazas.map((p) => p.slug), ...allDevelopmentRouteSlugs()]);
  return Array.from(slugs).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}): Promise<Metadata> {
  const { slug, locale } = await params;
  const [dev, plaza] = await Promise.all([getDevelopment(slug), getPlazaBySlugAsync(slug)]);
  if (!dev) return {};

  const isEs = locale === 'es';
  const minPrice = plaza ? getMinAvailablePrice(plaza) : null;
  const fromText = minPrice ? ` desde ${formatMXN(minPrice)}` : '';
  const name = dev.name;
  const city = plaza?.city ?? dev.city;

  // Sitios con ficha rica (plaza) mantienen el título/SEO detallado que ya
  // tenían; Sales Partner usa una versión genérica desde el modelo unificado.
  // Misma función que usa el <h1> del hero — nunca quedan desalineados.
  const title = fichaSeoTitle(dev, plaza, isEs);

  const description = isEs
    ? (plaza?.seoDescription ?? dev.seoDescription?.es ?? dev.description ??
        `${name} en ${city}. ${dev.propertyType ?? 'Desarrollo'} por ${dev.brand ?? developers[dev.developer]?.name ?? dev.developer}${fromText}.`)
    : (plaza?.seoDescriptionEn ?? dev.seoDescription?.en ?? dev.seoDescription?.es ?? dev.description ??
        `${name} in ${city}${fromText}.`);

  const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.tresor.mx';
  const heroImg = dev.heroRender ?? dev.image;

  return {
    title,
    description,
    alternates: {
      // Autorreferenciado por idioma — antes SIEMPRE apuntaba a la versión
      // ES (incluso desde /en/...), lo que le decía a Google que ignorara
      // la página en inglés a favor de la española. `languages` sigue
      // cruzando ambas versiones entre sí (eso sí estaba bien).
      canonical: isEs ? `/desarrollos/${slug}` : `/en/desarrollos/${slug}`,
      languages: {
        'es':        `${SITE}/desarrollos/${slug}`,
        'en':        `${SITE}/en/desarrollos/${slug}`,
        'x-default': `${SITE}/desarrollos/${slug}`,
      },
    },
    openGraph: {
      title,
      description,
      images: heroImg
        ? [{ url: heroImg, width: 1600, height: 900, alt: name }]
        : [{ url: '/og/home.jpg', width: 1200, height: 630, alt: name }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [heroImg ?? '/og/home.jpg'],
    },
  };
}

export default async function PlazaPage({ params }: { params: Promise<{ slug: string; locale: string }> }) {
  const { slug, locale } = await params;
  const [dev, plaza, siteSettings, cookieStore] = await Promise.all([
    getDevelopment(slug), // modelo unificado — fuente primaria, requerido
    getPlazaBySlugAsync(slug), // solo existe para Tresor; opcional (Sales Partner no lo tiene)
    getSiteSettings(),
    cookies(),
  ]);
  if (!dev || dev.comingSoon) notFound();
  if (plaza?.comingSoon) notFound();

  // Un asesor logueado (verificado server-side con la cookie httpOnly, no la
  // pista de UI) ve una ficha "en modo venta": cotizador siempre activo en
  // Quattro, apartado siempre activo en Sales Partner — sin "Agendar visita"
  // en ningún caso. El público sigue viendo exactamente lo de siempre
  // (Agenda + Aparta si el desarrollo lo tiene activado en Sanity).
  const isAsesor = verifySession(cookieStore.get(ASESOR_COOKIE)?.value);

  const t = await getTranslations('plaza');
  // Nombre corto para copy tipo "conoce {displayName}" — quita el "Plaza
  // Center" verboso del nombre largo del CMS (ej. "Quattro Plaza Center Long
  // Island" → "Quattro Long Island"). Si un desarrollo no lo tiene (ej. un
  // Sales Partner como "Olivia Wow Condos"), el nombre queda intacto.
  const displayName = dev.name.replace(/\s*Plaza Center\s*/, ' ').replace(/\s+/g, ' ').trim();
  const isEs = locale !== 'en';
  // SEO: mismo texto que <title> (fichaSeoTitle) — el hero antes no tenía
  // NINGÚN <h1> cuando el desarrollo tiene logo (el logo reemplazaba el
  // título por completo, sin dejar rastro para buscadores/lectores de
  // pantalla). sr-only para no tocar el diseño visual del hero.
  const heroH1 = fichaSeoTitle(dev, plaza, isEs);
  const { showAgendaWidget, hideAsesorForms } = siteSettings;
  const agendaEyebrow = isEs ? siteSettings.agendaEyebrow : siteSettings.agendaEyebrowEn;
  const agendaTitle1  = isEs ? siteSettings.agendaTitle1  : siteSettings.agendaTitle1En;
  const agendaTitle2  = isEs ? siteSettings.agendaTitle2  : siteSettings.agendaTitle2En;
  const agendaDesc    = isEs ? siteSettings.agendaDesc    : siteSettings.agendaDescEn;

  // Precio: Tresor lo calcula del inventario en vivo; Sales Partner usa el
  // priceLabel ya formateado del card (no tiene unidades que consultar).
  const minPrice = plaza ? getMinAvailablePrice(plaza) : null;
  // El home card sí dice "Desde $X MXN" (dev.priceLabel tal cual). En la
  // ficha es redundante — la etiqueta "Precio base" de abajo ya lo aclara —
  // así que se quita el prefijo solo aquí, sin tocar el campo compartido.
  const priceCell = plaza
    ? (minPrice ? `${formatMXN(minPrice)} MXN` : '—')
    : (dev.priceLabel?.replace(/^desde\s+/i, '') ?? '—');

  // Galería: Sanity (plaza) → modelo unificado (dev) → fallback local legado
  // (solo para los dos Quattro históricos que aún no tienen `gallery` cargada).
  const galleryImages = plaza?.gallery?.length
    ? plaza.gallery.filter(Boolean)
    : dev.gallery?.length
      ? dev.gallery
      : plaza?.slug === 'long-island'
        ? Array.from({ length: 8 }, (_, i) => `/renders/long-island/0${i + 1}.jpg`)
        : plaza?.slug === 'gardens'
          ? Array.from({ length: 6 }, (_, i) => `/renders/gardens/0${i + 1}.jpg`)
          : [];

  const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.tresor.mx';
  const heroImg = dev.heroRender ?? dev.image;
  const location = dev.location ?? plaza?.location;
  const developer = developers[dev.developer] ?? developers.Tresor;
  const allDevelopments = await getMergedDevelopmentsAsync();
  const relatedDevelopments = allDevelopments.filter(
    (d) => d.developer === dev.developer && d.slug !== dev.slug && !d.comingSoon
  );

  // JSON-LD — RealEstateListing siempre; FAQPage solo para fichas Tresor
  // (el copy de "apartado reembolsable de $50,000" etc. es específico de
  // plaza comercial y sería falso/engañoso en una ficha de Sales Partner).
  const jsonLd: object[] = [
    {
      '@context': 'https://schema.org',
      '@type': 'RealEstateListing',
      name: `${dev.name} — ${dev.city}`,
      description: dev.description ?? dev.tagline?.es,
      url: `${SITE}/desarrollos/${slug}`,
      image: heroImg?.startsWith('http') ? heroImg : `${SITE}${heroImg}`,
      datePosted: '2024-01-01',
      validThrough: dev.deliveryWindow ? `${dev.deliveryWindow}` : '2027-12-31',
      offers: minPrice ? {
        '@type': 'Offer',
        price: minPrice,
        priceCurrency: 'MXN',
        availability: 'https://schema.org/InStock',
        seller: { '@type': 'Organization', name: developer.name },
      } : undefined,
      address: {
        '@type': 'PostalAddress',
        addressLocality: plaza?.city ?? dev.city,
        addressRegion: plaza?.state ?? 'Quintana Roo',
        postalCode: '77500',
        addressCountry: 'MX',
      },
      geo: location ? { '@type': 'GeoCoordinates', latitude: location.lat, longitude: location.lng } : undefined,
    },
  ];

  if (plaza) {
    jsonLd.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: '¿Cuál es el precio de los locales en Quattro Plaza?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: minPrice
              ? `Los locales en ${plaza.name} tienen un precio desde ${formatMXN(minPrice)} MXN + IVA, con planes de pago flexibles desde $147,000 MXN de enganche.`
              : `Quattro Plaza ${plaza.name} ofrece locales comerciales en venta en Cancún con planes de pago flexibles. Contáctanos para precios actualizados.`,
          },
        },
        {
          '@type': 'Question',
          name: '¿Cuándo es la entrega de los locales?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: `La entrega estimada de Quattro Plaza ${plaza.name} es ${plaza.deliveryWindow ?? 'Jun–Sep 2027'}.`,
          },
        },
        {
          '@type': 'Question',
          name: '¿El apartado es reembolsable?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Sí, el apartado de $50,000 MXN es 100% reembolsable. Incluye asesoría legal sin costo.',
          },
        },
        {
          '@type': 'Question',
          name: '¿Dónde está ubicado Quattro Plaza?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: `${plaza.name} se ubica en ${plaza.city}, Quintana Roo, México, en una zona de alta densidad residencial y flujo vehicular validado.`,
          },
        },
      ],
    });
  }

  // ── Alternado de fondos blanco/gris ──
  // Se calcula sobre las secciones que REALMENTE van a renderizar (no un
  // patrón fijo por posición), para que nunca queden dos grises o dos
  // blancos seguidos cuando un módulo se apaga (ej. Sales Partner sin
  // galería, o sin master plan/floor plans al no tener `plaza`).
  const hasGallery = galleryImages.length > 0;
  const hasAmenities = (dev.amenities?.length ?? 0) > 0;
  const hasSalesPartnerFloorPlans = !plaza && (dev.floorPlans?.length ?? 0) > 0;
  const hasContentBlocks = (dev.contentBlocks?.length ?? 0) > 0;
  const sectionOrder = [
    'developer', 'project', 'location', 'contentBlocks', 'gallery', 'amenities', 'floorPlans', 'masterPlan', 'cta',
  ] as const;
  const sectionActive: Record<(typeof sectionOrder)[number], boolean> = {
    developer: true,
    project: true,
    location: true,
    contentBlocks: hasContentBlocks,
    gallery: hasGallery,
    amenities: hasAmenities,
    floorPlans: Boolean(plaza) || hasSalesPartnerFloorPlans,
    masterPlan: Boolean(plaza),
    cta: true,
  };
  const stripe: Partial<Record<(typeof sectionOrder)[number], boolean>> = {};
  {
    let i = 0;
    for (const key of sectionOrder) {
      if (sectionActive[key]) {
        stripe[key] = i % 2 === 1; // true = gris
        i++;
      }
    }
  }

  return (
    <>
      {jsonLd.map((schema, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      ))}
      <PixelViewContent name={dev.name} category={plaza ? 'Plaza Comercial' : 'Sales Partner'} ids={[slug]} />

      {/* ═════ HERO — logo centrado (modelo unificado) ═════ */}
      <section data-nav="dark" className="relative -mt-[72px] overflow-hidden bg-bg-deep text-bg" style={{ height: 'calc(100svh - 104px - 72px)', minHeight: '480px' }}>
        <div className="absolute inset-0 animate-hero-zoom">
          <Image
            src={heroImg}
            alt={dev.name}
            fill
            priority
            sizes="100vw"
            className={cn(
              'object-cover scale-105',
              OBJECT_POSITION_MOBILE[dev.heroImagePosition?.mobile ?? 'center'],
              OBJECT_POSITION_DESKTOP[dev.heroImagePosition?.desktop ?? 'center'],
            )}
          />
        </div>
        <div className="absolute inset-0 bg-black/50" />

        <div className="relative z-10 flex h-full items-center justify-center pt-[72px]">
          {dev.logo && <h1 className="sr-only">{heroH1}</h1>}
          {dev.logo ? (
            // `fill` + `object-contain` (en vez de width/height fijos tipo
            // 800x280) — con width/height fijos el navegador usa ESA
            // proporción para calcular el ancho automático, sin importar la
            // proporción real del archivo. Un logo angosto y ancho (ej.
            // Ximena, 706x133 ≈ 5.3:1) se aplastaba para forzarlo a la
            // proporción de Quattro (2.86:1) y se veía deformado/gigante
            // pase lo que pase con `heroLogoScale`. `object-contain` respeta
            // SIEMPRE la proporción real de cada logo, sea cual sea.
            <div
              className="relative h-[var(--logo-h-mobile)] w-[min(78vw,420px)] md:h-[var(--logo-h-desktop)] md:w-[min(60vw,640px)]"
              style={{
                // Tamaño base original (Quattro); escalado por desarrollo vía
                // `heroLogoScale` (1 = sin cambio) — independiente del logo del
                // card. En mobile cae a heroLogoScaleMobile si se define, o si no,
                // a un 30% adicional de reducción automático (el logo se ve
                // sobredimensionado frente al ancho de pantalla si no se achica).
                ['--logo-h-desktop' as string]: `clamp(${(140 * (dev.heroLogoScale ?? 1)).toFixed(0)}px, ${(26 * (dev.heroLogoScale ?? 1)).toFixed(1)}vh, ${(260 * (dev.heroLogoScale ?? 1)).toFixed(0)}px)`,
                ['--logo-h-mobile' as string]: `clamp(${(140 * (dev.heroLogoScaleMobile ?? (dev.heroLogoScale ?? 1) * 0.7)).toFixed(0)}px, ${(26 * (dev.heroLogoScaleMobile ?? (dev.heroLogoScale ?? 1) * 0.7)).toFixed(1)}vh, ${(260 * (dev.heroLogoScaleMobile ?? (dev.heroLogoScale ?? 1) * 0.7)).toFixed(0)}px)`,
              } as CSSProperties}
            >
              <Image
                src={dev.logo}
                alt={dev.name}
                fill
                className="object-contain drop-shadow-[0_12px_40px_rgba(0,0,0,0.4)]"
                priority
              />
            </div>
          ) : (
            <>
              <h1 className="sr-only">{heroH1}</h1>
              <p aria-hidden className="h-display text-center text-[clamp(56px,10vw,160px)] text-white">{dev.name}</p>
            </>
          )}
        </div>
      </section>

      {/* ═════ QUICKFACTS — strip compacto ═════ */}
      <section data-nav="light" className="overflow-hidden" style={{ background: 'linear-gradient(135deg, #f7f7f7 0%, #f0f0ef 50%, #f5f5f4 100%)' }}>
        <div className="container-wrap relative w-full">
          <div className="grid grid-cols-2 md:grid-cols-4" style={{ minHeight: '104px' }}>
            {dev.highlights?.slice(0, 3).map((h, idx) => (
              <div
                key={h.label}
                className={[
                  'flex flex-col justify-center px-5 py-5 md:py-0',
                  idx % 2 === 1 ? 'border-l' : '',
                  idx > 0 ? 'md:border-l' : '',
                  idx >= 2 ? 'border-t md:border-t-0' : '',
                ].join(' ')}
                style={{ borderColor: '#e2e2e1' }}
              >
                <div className="truncate text-[clamp(17px,1.4vw,20px)] font-normal leading-tight tracking-tight">
                  {isEs ? h.value : (h.valueEn ?? h.value)}
                </div>
                <div className="mt-1.5 truncate text-[10px] font-semibold uppercase tracking-[0.22em] text-ink-3">
                  {isEs ? h.label : (h.labelEn ?? h.label)}
                </div>
              </div>
            ))}

            {/* 4ª columna — Precio base (fondo amarillo, sangra al borde en desktop) */}
            <div className="relative flex flex-col justify-center px-5 py-5 border-t md:border-t-0 md:py-0"
                 style={{ borderColor: '#e2e2e1' }}>
              <div className="absolute inset-0 md:hidden" style={{ background: '#FFD057' }} />
              <div className="absolute inset-0 hidden md:block"
                   style={{ background: '#FFD057', right: 'calc(-1 * max(24px, 5vw))' }} />
              <div className="relative z-10">
                <div className="text-[clamp(17px,1.4vw,20px)] font-extrabold leading-tight tracking-tight text-ink">
                  {priceCell}
                </div>
                <div className="mt-1.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-ink/70">
                  {plaza
                    ? (isEs ? 'Precio base + IVA' : 'Base price + VAT')
                    : (isEs ? 'Precio base' : 'Base price')}
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ═════ DESARROLLADOR — data-driven desde el registro `developers` ═════ */}
      <FichaDeveloper developer={developer} locale={locale} gray={stripe.developer} />

      {/* ═════ 1. EL PROYECTO ═════ */}
      <section className={`${stripe.project ? 'bg-[#FAFAFA]' : 'bg-bg'} py-20 md:py-28`}>
        <div className="container-wrap grid gap-12 md:grid-cols-[1fr_1.4fr] md:gap-20">
          <div>
            <span className="eyebrow eyebrow-accent block font-bold">{t('projectEyebrow')}</span>
            <h2 className="mt-5 h-display text-[clamp(24px,3.2vw,48px)]">
              {dev.projectTitle ? (
                <>
                  {isEs ? dev.projectTitle.es : dev.projectTitle.en ?? dev.projectTitle.es}
                  {dev.projectTitleMuted && (
                    <span className="text-ink-3">
                      {' '}
                      {isEs ? dev.projectTitleMuted.es : dev.projectTitleMuted.en ?? dev.projectTitleMuted.es}
                    </span>
                  )}
                </>
              ) : (
                <>
                  {t('projectTitleLead')} <span className="text-ink-3">{t('projectTitleMuted')}</span>
                </>
              )}
            </h2>
          </div>
          <div className="text-[17px] font-light leading-[1.7] text-ink-2">
            <p>
              {dev.name}{' '}
              {renderEditorial(
                (isEs ? dev.projectBody?.[0]?.es : dev.projectBody?.[0]?.en ?? dev.projectBody?.[0]?.es) ?? t('projectBody1')
              )}
            </p>
            <p className="mt-4">
              {renderEditorial(
                (isEs ? dev.projectBody?.[1]?.es : dev.projectBody?.[1]?.en ?? dev.projectBody?.[1]?.es) ?? t('projectBody2')
              )}
            </p>

            {/* Asesor logueado: cotizador siempre activo en Quattro, apartado
                siempre activo en Sales Partner — sin "Agendar visita" en
                ningún caso. Público: exactamente el comportamiento de
                siempre (Agenda visible; Aparta solo si el desarrollo lo
                tiene activado en Sanity). */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              {isAsesor ? (
                plaza ? (
                  <>
                    <Link href="#master-plan" className="btn border-0 bg-accent text-ink hover:brightness-95">
                      {t('viewAvailability')}
                    </Link>
                    <a href={QUATTRO_COTIZADOR_URL} target="_blank" rel="noopener noreferrer" className="btn btn-primary font-semibold">
                      {t('quoteUnit')}
                      <ArrowRight size={14} strokeWidth={1.6} />
                    </a>
                  </>
                ) : (
                  // Sales Partner: el cotizador interno todavía no está listo
                  // — manda a la liga del cotizador de ESE desarrollo (Drive
                  // de Ventas, campo `quoter`), no al form de apartado
                  // (además puede estar oculto para asesores, ver
                  // siteSettings.hideAsesorForms).
                  <a
                    href={`/api/asesor/file?dev=${slug}&doc=quoter`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn border-0 bg-accent text-ink hover:brightness-95"
                  >
                    {isEs ? 'Cotizar ahora' : 'Get a quote'}
                    <ArrowRight size={14} strokeWidth={1.6} />
                  </a>
                )
              ) : plaza ? (
                <>
                  <Link href="#master-plan" className="btn border-0 bg-accent text-ink hover:brightness-95">
                    {t('viewAvailability')}
                  </Link>
                  {!showAgendaWidget && (
                    <Link href={`/cotizar/${plaza.slug}`} className="btn btn-primary font-semibold">
                      {t('quoteUnit')}
                      <ArrowRight size={14} strokeWidth={1.6} />
                    </Link>
                  )}
                </>
              ) : dev.reservationEnabled ? (
                <>
                  <Link href="#aparta" className="btn btn-outline font-semibold">
                    {isEs ? 'Agendar una visita' : 'Schedule a visit'}
                  </Link>
                  <Link href="#reservar" className="btn border-0 bg-accent text-ink hover:brightness-95">
                    {isEs
                      ? `Aparta ahora con ${formatMXN(getReservationAmount(dev))} MXN`
                      : `Reserve now with ${formatMXN(getReservationAmount(dev))} MXN`}
                    <ArrowRight size={14} strokeWidth={1.6} />
                  </Link>
                </>
              ) : (
                <Link href="#aparta" className="btn border-0 bg-accent text-ink hover:brightness-95">
                  {isEs ? 'Agendar una visita' : 'Schedule a visit'}
                  <ArrowRight size={14} strokeWidth={1.6} />
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ═════ 2. UBICACIÓN — sin mapa (sin lat/lng) el texto toma el ancho completo ═════ */}
      <section className={`${stripe.location ? 'bg-[#FAFAFA]' : 'bg-bg'} py-20 md:py-28`}>
        <div className={`container-wrap grid gap-10 ${location ? 'md:grid-cols-[1fr_1.6fr] md:gap-16' : 'max-w-[62ch]'}`}>
          <div>
            <span className="eyebrow eyebrow-accent font-bold">{t('locationEyebrow')}</span>
            <h2 className="mt-5 h-display text-[clamp(24px,3.2vw,48px)]">
              {t('locationTitleLead')} <span className="text-ink-3">{t('locationTitleMuted')}</span>
            </h2>
            <p className="mt-4 text-[15px] font-light leading-relaxed text-ink-3">
              {location?.address ?? `${dev.zone ? `${dev.zone}, ` : ''}${dev.city}`}
            </p>
            <div className="mt-8 space-y-3 border-t border-line pt-6">
              {[
                { icon: <Building2 size={16} strokeWidth={1.5} />, fallback: t('bullet1') },
                { icon: <Layers size={16} strokeWidth={1.5} />, fallback: t('bullet2') },
                { icon: <MapPin size={16} strokeWidth={1.5} />, fallback: t('bullet3') },
              ].map((b, i) => {
                const bullet = dev.locationBullets?.[i];
                const text = (isEs ? bullet?.es : bullet?.en ?? bullet?.es) ?? b.fallback;
                return <Bullet key={i} icon={b.icon} text={text} />;
              })}
            </div>
          </div>
          {location && (
            <div>
              <LocationMap lat={location.lat} lng={location.lng} address={location.address} />
            </div>
          )}
        </div>
      </section>

      {/* ═════ 2b. CONTENT BLOCKS — módulo(s) editorial(es) genérico(s), debajo del mapa ═════ */}
      {dev.contentBlocks?.map((block, i) => (
        <FichaContentBlock
          key={i}
          block={block}
          locale={locale}
          gray={stripe.contentBlocks !== undefined ? (i % 2 === 0 ? stripe.contentBlocks : !stripe.contentBlocks) : false}
        />
      ))}

      {/* ═════ 3. GALERÍA (solo si hay imágenes) ═════ */}
      {galleryImages.length > 0 && <Gallery images={galleryImages} alt={dev.name} gray={stripe.gallery} tourUrl={dev.galleryTourUrl} />}

      {/* ═════ 4. AMENIDADES (módulo nuevo; solo si el desarrollo las tiene) ═════ */}
      {dev.amenities && dev.amenities.length > 0 && (
        <FichaAmenities
          amenities={dev.amenities}
          locale={locale}
          gray={stripe.amenities}
          galleryImages={dev.amenitiesGallery}
          devName={dev.name}
        />
      )}

      {/* ═════ 5. FLOOR PLANS + MASTER PLAN INTERACTIVO (Tresor, requieren `plaza`) ═════ */}
      {plaza && (
        <>
          <FloorPlans plaza={plaza} floorPlansDesc={isEs ? (plaza.floorPlansDesc ?? undefined) : (plaza.floorPlansDescEn ?? plaza.floorPlansDesc ?? undefined)} gray={stripe.floorPlans} />
          <div id="master-plan">
            <MasterPlan plaza={plaza} showAgendaWidget={showAgendaWidget} isAsesor={isAsesor} gray={stripe.masterPlan} />
          </div>
        </>
      )}

      {/* ═════ 5b. TIPOLOGÍAS (Sales Partner, sin inventario propio) ═════ */}
      {hasSalesPartnerFloorPlans && dev.floorPlans && (
        <FichaFloorPlans
          floorPlans={dev.floorPlans}
          locale={locale}
          gray={stripe.floorPlans}
          ctaLabels={dev.ctaLabels}
          isAsesor={isAsesor}
          devSlug={slug}
        />
      )}

      {/* ═════ 6. APARTADO EN LÍNEA — asesor: cotizador (Quattro) o apartado
              (Sales Partner) siempre, sin Agenda. Público: comportamiento
              de siempre (tabs Agenda/Aparta — Tresor cotizador/Agenda según
              el toggle del sitio — Reserva Rápida si no hay apartado).
              `hideAsesorForms` (siteSettings, Sanity): pausa temporal para
              ocultar el formulario cuando el asesor está logueado — los
              botones de arriba que apuntan a #aparta se quedan tal cual,
              solo desaparece el formulario en sí. Público nunca se afecta. ═════ */}
      {!(isAsesor && hideAsesorForms) && (
      <section
        className={`relative z-10 -mb-10 overflow-hidden rounded-b-[2.5rem] ${stripe.cta ? 'bg-[#FAFAFA]' : 'bg-white'}`}
        id="aparta"
      >
        {isAsesor ? (
          plaza ? (
            <>
              <div className="container-wrap pb-0 pt-20 text-center md:pt-28">
                <span className="eyebrow eyebrow-accent font-bold">{t('apartaEyebrow')}</span>
                <h2 className="mx-auto mt-5 h-display max-w-3xl text-[clamp(24px,3.2vw,48px)]">
                  <span className="text-ink-3">{t('apartaTitle1')}</span>
                  <br />
                  {t('apartaTitle2')}
                </h2>
                <p className="mx-auto mt-5 max-w-xl text-[15px] font-light text-ink-3">
                  {t('apartaDesc')}
                </p>
              </div>
              <QuoteWizard plaza={plaza} />
            </>
          ) : (
            <AsesorApartadoOnly
              devSlug={slug}
              floorPlans={dev.floorPlans}
              displayName={displayName}
              locale={locale}
              reservationAmount={getReservationAmount(dev)}
            />
          )
        ) : /* !plaza: el apartado sin inventario (tabs Agenda/Aparta) es solo
            para Sales Partner. Un desarrollo Tresor con `plaza` sigue el
            flujo cotizador-primero → apartar unidad ya seleccionada
            (QuoteWizard), aunque algún día tuviera reservationEnabled
            activado. */
        !plaza && dev.reservationEnabled ? (
          <AgendaReservaTabs
            devSlug={slug}
            devName={dev.name}
            floorPlans={dev.floorPlans}
            agendaTitle1={agendaTitle1}
            agendaTitle2={agendaTitle2}
            agendaDesc={agendaDesc}
            displayName={displayName}
            locale={locale}
            reservationAmount={getReservationAmount(dev)}
          />
        ) : (
          <>
            <div className="container-wrap pb-0 pt-20 text-center md:pt-28">
              {showAgendaWidget ? (
                <>
                  <span className="eyebrow eyebrow-accent font-bold">{agendaEyebrow}</span>
                  <h2 className="mx-auto mt-5 h-display max-w-5xl text-[clamp(24px,3.2vw,48px)]">
                    <span className="text-ink-3">{agendaTitle1}</span>
                    <br />
                    {agendaTitle2} {displayName}
                  </h2>
                  <p className="mx-auto mt-6 max-w-xl text-[17px] font-normal text-ink">
                    {agendaDesc}
                  </p>
                </>
              ) : plaza ? (
                <>
                  <span className="eyebrow eyebrow-accent font-bold">{t('apartaEyebrow')}</span>
                  <h2 className="mx-auto mt-5 h-display max-w-3xl text-[clamp(24px,3.2vw,48px)]">
                    <span className="text-ink-3">{t('apartaTitle1')}</span>
                    <br />
                    {t('apartaTitle2')}
                  </h2>
                  <p className="mx-auto mt-5 max-w-xl text-[15px] font-light text-ink-3">
                    {t('apartaDesc')}
                  </p>
                </>
              ) : (
                <>
                  <span className="eyebrow eyebrow-accent font-bold">{t('reservaEyebrow')}</span>
                  <h2 className="mx-auto mt-5 h-display max-w-5xl text-[clamp(24px,3.2vw,48px)]">
                    <span className="text-ink-3">{t('reservaTitle1')}</span>
                    <br />
                    {displayName}
                  </h2>
                  <p className="mx-auto mt-5 max-w-xl text-[15px] font-light text-ink-3">
                    {t('reservaDesc')}
                  </p>
                </>
              )}
            </div>
            {showAgendaWidget ? (
              <AgendaWidget devSlug={slug} devName={dev.name} />
            ) : plaza ? (
              <QuoteWizard plaza={plaza} />
            ) : (
              <ReservaRapidaForm
                devSlug={slug}
                devName={dev.name}
                developerName={developer.name}
                submitLabel={
                  (isEs ? dev.ctaLabels?.reserve?.es : dev.ctaLabels?.reserve?.en ?? dev.ctaLabels?.reserve?.es) ??
                  (isEs ? 'Reservar mi lugar' : 'Reserve my spot')
                }
              />
            )}
          </>
        )}
      </section>
      )}

      {/* ═════ 7. TAMBIÉN TE PUEDE INTERESAR — mismo developer ═════ */}
      <RelatedDevelopments items={relatedDevelopments} />
    </>
  );
}

function Bullet({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex h-9 w-9 flex-none items-center justify-center rounded-full border border-line bg-white text-accent">
        {icon}
      </span>
      <span className="text-[14px] text-ink-2">{text}</span>
    </div>
  );
}
