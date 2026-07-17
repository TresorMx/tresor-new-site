/**
 * Sanity → `Development` (Sales Partner y futuros desarrollos "type: development").
 *
 * Sigue el mismo patrón que queries.ts (PLAZA_FIELDS): un fragmento GROQ que
 * resuelve imágenes con `.asset->url` directo, más un normalizador que
 * convierte la forma plana de Sanity (campos ES/EN separados) a la forma que
 * ya consume el resto del código (`I18nText { es, en }`).
 *
 * No importa nada de `../developments` en tiempo de módulo — solo tipos
 * (`import type`, se borran en compilación) para evitar el ciclo con
 * developments.ts, que es quien carga este archivo dinámicamente.
 */
import { sanityClient } from './client';
import type { Development, ContentBlock, Amenity, FloorPlanTypology, I18nText } from '../developments';

const DEVELOPMENT_FIELDS = `
  "slug": slug.current,
  name,
  "developerDocId": developer->_id,
  relationship,
  status,
  badge,
  comingSoon,
  featured,
  propertyType,
  intent,
  city,
  zone,
  location,
  priceLabel,
  description,
  logoScale,
  heroLogoScale,
  heroLogoScaleMobile,
  tagline,
  taglineEn,
  projectTitle,
  projectTitleEn,
  projectTitleMuted,
  projectTitleMutedEn,
  projectBody1,
  projectBody1En,
  projectBody2,
  projectBody2En,
  bullet1,
  bullet1En,
  bullet2,
  bullet2En,
  bullet3,
  bullet3En,
  highlights,
  "image":     image.asset->url,
  "logo":      logo.asset->url,
  "heroRender": heroRender.asset->url,
  "gallery":   gallery[].asset->url,
  galleryTourUrl,
  "amenitiesGallery": amenitiesGallery[].asset->url,
  amenities[]{ "key": key, labelOverride, labelOverrideEn },
  "floorPlans": floorPlans[]{
    "slug": _key,
    label, labelEn, shortLabel, shortLabelEn,
    "image": image.asset->url,
    "specs": specs[]{ "key": _key, label, labelEn, value },
    virtualTourUrl
  },
  "contentBlocks": contentBlocks[]{
    eyebrow, eyebrowEn, title, titleEn, titleMuted, titleMutedEn,
    description, descriptionEn,
    "image": image.asset->url,
    imageFit, imageWidth, layout, imagePosition,
    ctaLabel, ctaLabelEn, ctaUrl
  },
  reservationEnabled,
  reservationAmount,
  ctaScheduleVisit, ctaScheduleVisitEn,
  ctaVirtualTour, ctaVirtualTourEn,
  seoTitle, seoTitleEn,
  seoDescription, seoDescriptionEn
`;

const DEVELOPER_FIELDS = `
  "docId": _id,
  name,
  "logoDark": logoDark.asset->url,
  blockLabel,
  blockLabelEn,
  credentials,
  credentialsEn
`;

export interface SanityDeveloperPatch {
  docId: string;
  name: string;
  logoDark?: string;
  blockLabel?: string;
  blockLabelEn?: string;
  credentials?: string;
  credentialsEn?: string;
}

function i18n(es: string | undefined, en: string | undefined): I18nText | undefined {
  // Si falta `es` pero sí hay `en` (pasaba en varios `development` con
  // seoDescription/seoTitle solo llenos en inglés), el resultado no debe
  // desaparecer por completo — cae a `en` como base para ambos.
  if (!es && !en) return undefined;
  return { es: es ?? en!, en };
}

// Un `development` en Sanity guarda un `type` de ficha "ligera" (Sales
// Partner): no tiene `type: DevType` propio (esa taxonomía solo aplica a los
// desarrollos propios de Tresor, que viven en `plaza`). Lo derivamos del
// `propertyType`, que sí es un campo real del schema.
function inferDevType(propertyType: string | undefined): Development['type'] {
  if (propertyType === 'Local Comercial') return 'Comercial';
  if (propertyType === 'Lote Residencial') return 'Lotes';
  return 'Residencial';
}

function normalizeDevelopment(raw: any): Development & { developerDocId?: string } {
  const amenities: Amenity[] = (raw.amenities ?? []).map((a: any) => ({
    key: a.key,
    labelOverride: a.labelOverride,
  }));

  const floorPlans: FloorPlanTypology[] = (raw.floorPlans ?? []).map((fp: any) => ({
    slug: fp.slug,
    label: i18n(fp.label, fp.labelEn) as I18nText,
    shortLabel: i18n(fp.shortLabel, fp.shortLabelEn),
    image: fp.image,
    specs: (fp.specs ?? []).map((s: any) => ({
      key: s.key,
      label: i18n(s.label, s.labelEn) as I18nText,
      value: s.value,
    })),
    virtualTourUrl: fp.virtualTourUrl,
  }));

  const contentBlocks: ContentBlock[] = (raw.contentBlocks ?? []).map((cb: any) => ({
    eyebrow: i18n(cb.eyebrow, cb.eyebrowEn),
    title: i18n(cb.title, cb.titleEn) as I18nText,
    titleMuted: i18n(cb.titleMuted, cb.titleMutedEn),
    description: i18n(cb.description, cb.descriptionEn) as I18nText,
    image: cb.image,
    imageFit: cb.imageFit,
    imageWidth: cb.imageWidth,
    layout: cb.layout,
    imagePosition: cb.imagePosition,
    cta: cb.ctaLabel && cb.ctaUrl ? { label: i18n(cb.ctaLabel, cb.ctaLabelEn) as I18nText, url: cb.ctaUrl } : undefined,
  }));

  const highlights = (raw.highlights ?? []).map((h: any) => ({
    label: h.label,
    labelEn: h.labelEn,
    value: h.value,
    valueEn: h.valueEn,
  }));

  const projectBody = [i18n(raw.projectBody1, raw.projectBody1En), i18n(raw.projectBody2, raw.projectBody2En)].filter(
    (p): p is I18nText => Boolean(p)
  );
  const locationBullets = [i18n(raw.bullet1, raw.bullet1En), i18n(raw.bullet2, raw.bullet2En), i18n(raw.bullet3, raw.bullet3En)].filter(
    (b): b is I18nText => Boolean(b)
  );

  return {
    slug: raw.slug,
    name: raw.name,
    developerDocId: raw.developerDocId,
    // se resuelve a un DeveloperId real en developments.ts (necesita el
    // registro `developers`, que este archivo no importa a nivel de valor).
    developer: undefined as unknown as Development['developer'],
    relationship: raw.relationship,
    city: raw.city,
    zone: raw.zone,
    type: inferDevType(raw.propertyType),
    intent: raw.intent ?? [],
    status: raw.status,
    image: raw.image ?? '',
    href: `/desarrollos/${raw.slug}`,
    featured: raw.featured ?? true,
    logo: raw.logo,
    description: raw.description,
    priceLabel: raw.priceLabel,
    badge: raw.badge,
    propertyType: raw.propertyType,
    logoScale: raw.logoScale,
    comingSoon: raw.comingSoon ?? false,
    heroRender: raw.heroRender,
    heroLogoScale: raw.heroLogoScale,
    heroLogoScaleMobile: raw.heroLogoScaleMobile,
    contentBlocks: contentBlocks.length ? contentBlocks : undefined,
    highlights: highlights.length ? highlights : undefined,
    tagline: i18n(raw.tagline, raw.taglineEn),
    projectTitle: i18n(raw.projectTitle, raw.projectTitleEn),
    projectTitleMuted: i18n(raw.projectTitleMuted, raw.projectTitleMutedEn),
    projectBody: projectBody.length ? projectBody : undefined,
    gallery: raw.gallery?.length ? raw.gallery : undefined,
    galleryTourUrl: raw.galleryTourUrl || undefined,
    amenitiesGallery: raw.amenitiesGallery?.length ? raw.amenitiesGallery : undefined,
    amenities: amenities.length ? amenities : undefined,
    location: raw.location,
    locationBullets: locationBullets.length ? locationBullets : undefined,
    floorPlans: floorPlans.length ? floorPlans : undefined,
    masterPlanMode: 'static',
    reservationEnabled: raw.reservationEnabled ?? false,
    reservationAmount: raw.reservationAmount,
    ctaLabels: {
      scheduleVisit: i18n(raw.ctaScheduleVisit, raw.ctaScheduleVisitEn),
      virtualTour: i18n(raw.ctaVirtualTour, raw.ctaVirtualTourEn),
    },
    seoTitle: i18n(raw.seoTitle, raw.seoTitleEn),
    seoDescription: i18n(raw.seoDescription, raw.seoDescriptionEn),
  };
}

export async function fetchAllSanityDevelopments(): Promise<(Development & { developerDocId?: string })[]> {
  const raws = await sanityClient.fetch(
    `*[_type == "development"] { ${DEVELOPMENT_FIELDS} }`,
    {},
    { cache: 'no-store' }
  );
  return (raws ?? []).map(normalizeDevelopment);
}

export async function fetchAllSanityDevelopers(): Promise<SanityDeveloperPatch[]> {
  const raws = await sanityClient.fetch(`*[_type == "developer"] { ${DEVELOPER_FIELDS} }`, {}, { cache: 'no-store' });
  return raws ?? [];
}
