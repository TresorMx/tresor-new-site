/**
 * Migración: developments.ts (estático) → Sanity (developer + development)
 *
 * A diferencia de scripts/seed-sanity.ts (que solo sube texto y le pide al
 * usuario subir imágenes a mano en el Studio), este script sube TAMBIÉN las
 * imágenes reales desde public/ como assets de Sanity — el usuario nunca
 * tiene que tocar el Studio para esto.
 *
 * Uso:
 *   SANITY_API_TOKEN=<token> pnpm tsx scripts/migrate-developments-to-sanity.ts
 *
 * Idempotente: usa `developer-{id}` / `development-{slug}` como _id
 * (createOrReplace), y Sanity dedup por hash de archivo — correr dos veces
 * no duplica ni desarrollos ni imágenes.
 */

import { createClient } from '@sanity/client';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  developments,
  developers,
  type Development,
  type DeveloperId,
} from '../src/lib/developments';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Mismos presets que sanity/schemas/development.ts (LOGO_SIZE_PRESETS) — el
// Studio ya no acepta cualquier decimal, así que al migrar redondeamos al
// preset más cercano en vez de escribir el número crudo de developments.ts.
const LOGO_SIZE_PRESETS = [0.5, 0.7, 1, 1.3, 1.6];
function nearestLogoPreset(n: number | undefined): number | undefined {
  if (n == null) return undefined;
  return LOGO_SIZE_PRESETS.reduce((best, p) => (Math.abs(p - n) < Math.abs(best - n) ? p : best));
}

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? 'hg48pwsi',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

const PUBLIC_DIR = path.join(__dirname, '..', 'public');

// Los 4 pilotos ya armados en estático. Agregar más slugs aquí conforme se
// vayan terminando fichas nuevas.
const TARGET_SLUGS = ['olivia-wow-condos', 'koa-onix', 'zienna-onix', 'blume-urban'];

type SanityImage = { _type: 'image'; asset: { _type: 'reference'; _ref: string } };

// Cache por ruta — si dos campos apuntan al mismo archivo (ej. heroRender ==
// image del card) no se sube dos veces en la misma corrida.
const imageCache = new Map<string, SanityImage | undefined>();

async function uploadImage(publicPath: string | undefined): Promise<SanityImage | undefined> {
  if (!publicPath) return undefined;
  if (imageCache.has(publicPath)) return imageCache.get(publicPath);

  const filePath = path.join(PUBLIC_DIR, publicPath);
  if (!fs.existsSync(filePath)) {
    console.warn(`\n  ⚠️  No existe en disco, se omite: ${publicPath}`);
    imageCache.set(publicPath, undefined);
    return undefined;
  }

  const asset = await client.assets.upload('image', fs.createReadStream(filePath), {
    filename: path.basename(filePath),
  });
  const ref: SanityImage = { _type: 'image', asset: { _type: 'reference', _ref: asset._id } };
  imageCache.set(publicPath, ref);
  process.stdout.write('.');
  return ref;
}

function key(i: number, prefix: string) {
  return `${prefix}${i}`;
}

function developerDocId(id: DeveloperId) {
  return `developer-${id.toLowerCase().replace(/\s+/g, '-')}`;
}

async function migrateDevelopers(): Promise<Record<DeveloperId, string>> {
  console.log('📇 Desarrolladores');
  const ids = Object.keys(developers) as DeveloperId[];
  const map = {} as Record<DeveloperId, string>;

  for (const id of ids) {
    const dev = developers[id];
    const docId = developerDocId(id);
    const logoDark = await uploadImage(dev.logoDark);

    const doc: Record<string, unknown> = {
      _id: docId,
      _type: 'developer',
      name: dev.name,
      blockLabel: dev.blockLabel.es,
      blockLabelEn: dev.blockLabel.en,
      credentials: dev.credentials?.es,
      credentialsEn: dev.credentials?.en,
    };
    if (logoDark) doc.logoDark = logoDark;
    stripUndefined(doc);

    await client.createOrReplace(doc);
    map[id] = docId;
    console.log(`  ✅ ${dev.name}`);
  }
  return map;
}

async function migrateDevelopment(dev: Development, devDocId: string) {
  console.log(`\n🏗️  ${dev.name} (${dev.slug})`);

  const image = await uploadImage(dev.image);
  const logo = await uploadImage(dev.logo);
  const heroRender = await uploadImage(dev.heroRender ?? dev.image);

  const gallery: (SanityImage & { _key: string })[] = [];
  for (const src of dev.gallery ?? []) {
    const img = await uploadImage(src);
    if (img) gallery.push({ ...img, _key: key(gallery.length, 'g') });
  }

  const amenitiesGallery: (SanityImage & { _key: string })[] = [];
  for (const src of dev.amenitiesGallery ?? []) {
    const img = await uploadImage(src);
    if (img) amenitiesGallery.push({ ...img, _key: key(amenitiesGallery.length, 'ag') });
  }

  const amenities = (dev.amenities ?? []).map((a, i) => ({
    _key: key(i, 'am'),
    key: a.key,
    labelOverride: a.labelOverride,
  }));

  const floorPlans = [];
  for (let i = 0; i < (dev.floorPlans?.length ?? 0); i++) {
    const fp = dev.floorPlans![i];
    const img = await uploadImage(fp.image);
    const specs = (fp.specs ?? []).map((s, si) => ({
      _key: key(si, 'sp'),
      label: s.label.es,
      labelEn: s.label.en,
      value: s.value,
    }));
    const fpDoc: Record<string, unknown> = {
      _key: key(i, 'fp'),
      label: fp.label.es,
      labelEn: fp.label.en,
      shortLabel: fp.shortLabel?.es,
      shortLabelEn: fp.shortLabel?.en,
      specs,
      virtualTourUrl: fp.virtualTourUrl,
    };
    if (img) fpDoc.image = img;
    stripUndefined(fpDoc);
    floorPlans.push(fpDoc);
  }

  const contentBlocks = [];
  for (let i = 0; i < (dev.contentBlocks?.length ?? 0); i++) {
    const cb = dev.contentBlocks![i];
    const img = await uploadImage(cb.image);
    const cbDoc: Record<string, unknown> = {
      _key: key(i, 'cb'),
      eyebrow: cb.eyebrow?.es,
      eyebrowEn: cb.eyebrow?.en,
      title: cb.title.es,
      titleEn: cb.title.en,
      titleMuted: cb.titleMuted?.es,
      titleMutedEn: cb.titleMuted?.en,
      description: cb.description.es,
      descriptionEn: cb.description.en,
      layout: cb.layout,
      imagePosition: cb.imagePosition,
    };
    if (img) cbDoc.image = img;
    stripUndefined(cbDoc);
    contentBlocks.push(cbDoc);
  }

  const highlights = (dev.highlights ?? []).map((h, i) => ({
    _key: key(i, 'h'),
    label: h.label,
    labelEn: h.labelEn,
    value: h.value,
    valueEn: h.valueEn,
  }));

  const doc: Record<string, unknown> = {
    _id: `development-${dev.slug}`,
    _type: 'development',
    name: dev.name,
    slug: { _type: 'slug', current: dev.slug },
    developer: { _type: 'reference', _ref: devDocId },
    relationship: dev.relationship,
    status: dev.status,
    badge: dev.badge,
    comingSoon: dev.comingSoon ?? false,
    featured: dev.featured ?? true,
    propertyType: dev.propertyType,
    intent: dev.intent,
    city: dev.city,
    zone: dev.zone,
    location: dev.location
      ? { lat: dev.location.lat, lng: dev.location.lng, address: dev.location.address }
      : undefined,
    priceLabel: dev.priceLabel,
    description: dev.description,
    logoScale: nearestLogoPreset(dev.logoScale),
    heroLogoScale: nearestLogoPreset(dev.heroLogoScale),
    heroLogoScaleMobile: nearestLogoPreset(dev.heroLogoScaleMobile),
    tagline: dev.tagline?.es,
    taglineEn: dev.tagline?.en,
    projectTitle: dev.projectTitle?.es,
    projectTitleEn: dev.projectTitle?.en,
    projectTitleMuted: dev.projectTitleMuted?.es,
    projectTitleMutedEn: dev.projectTitleMuted?.en,
    projectBody1: dev.projectBody?.[0]?.es,
    projectBody1En: dev.projectBody?.[0]?.en,
    projectBody2: dev.projectBody?.[1]?.es,
    projectBody2En: dev.projectBody?.[1]?.en,
    bullet1: dev.locationBullets?.[0]?.es,
    bullet1En: dev.locationBullets?.[0]?.en,
    bullet2: dev.locationBullets?.[1]?.es,
    bullet2En: dev.locationBullets?.[1]?.en,
    bullet3: dev.locationBullets?.[2]?.es,
    bullet3En: dev.locationBullets?.[2]?.en,
    highlights,
    gallery,
    amenitiesGallery,
    amenities,
    floorPlans,
    contentBlocks,
    reservationEnabled: dev.reservationEnabled ?? false,
    reservationAmount: dev.reservationAmount,
    ctaScheduleVisit: dev.ctaLabels?.scheduleVisit?.es,
    ctaScheduleVisitEn: dev.ctaLabels?.scheduleVisit?.en,
    ctaVirtualTour: dev.ctaLabels?.virtualTour?.es,
    ctaVirtualTourEn: dev.ctaLabels?.virtualTour?.en,
    seoTitle: dev.seoTitle?.es,
    seoTitleEn: dev.seoTitle?.en,
    seoDescription: dev.seoDescription?.es,
    seoDescriptionEn: dev.seoDescription?.en,
  };
  if (image) doc.image = image;
  if (logo) doc.logo = logo;
  if (heroRender) doc.heroRender = heroRender;
  stripUndefined(doc);

  await client.createOrReplace(doc);
  console.log(`\n  ✅ ${dev.name} migrado (${gallery.length} fotos galería, ${amenitiesGallery.length} amenidades, ${floorPlans.length} tipologías)`);
}

function stripUndefined(obj: Record<string, unknown>) {
  for (const k of Object.keys(obj)) {
    if (obj[k] === undefined) delete obj[k];
  }
}

async function main() {
  if (!process.env.SANITY_API_TOKEN) {
    console.error('❌  Falta SANITY_API_TOKEN en el entorno.');
    process.exit(1);
  }

  console.log('🌱 Migración developments.ts → Sanity\n');
  console.log(`   Proyecto: ${client.config().projectId} / ${client.config().dataset}\n`);

  const developerMap = await migrateDevelopers();

  for (const slug of TARGET_SLUGS) {
    const dev = developments.find((d) => d.slug === slug);
    if (!dev) {
      console.warn(`\n  ⚠️  No encontrado en developments.ts: ${slug}`);
      continue;
    }
    const devDocId = developerMap[dev.developer];
    if (!devDocId) {
      console.warn(`\n  ⚠️  Developer "${dev.developer}" no migrado, se omite ${dev.slug}`);
      continue;
    }
    await migrateDevelopment(dev, devDocId);
  }

  console.log('\n🎉 Migración completada.');
  console.log('   Abre /studio → Desarrollos para verificar.\n');
}

main().catch((e) => {
  console.error('\n❌  Error en migración:', e?.message ?? e);
  process.exit(1);
});
