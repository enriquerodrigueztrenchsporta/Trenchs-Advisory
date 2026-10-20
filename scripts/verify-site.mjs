// Comprobaciones sobre la web compilada (dist/): requisitos legales, accesibilidad básica y ausencia de rastreo.
// Uso: npm run build && npm run verify   (en borrador: LEGAL_DRAFT=1 npm run build && LEGAL_DRAFT=1 npm run verify)

import { readdirSync, readFileSync, existsSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const DIST = 'dist';
const BASE = '/Trenchs-Advisory/';
const LEGAL = ['legal/aviso-legal', 'legal/privacidad', 'legal/cookies'];
// Enlaces externos permitidos (simples enlaces, nunca recursos que se carguen solos).
const EXTERNAL_LINKS = ['https://enriquerodrigueztrenchsporta.github.io/Trenchs-Advisory', 'https://docs.github.com/', 'https://www.aepd.es'];
const draft = process.env.LEGAL_DRAFT === '1';

const pages = (function walk(dir) {
  return readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? walk(p) : p.endsWith('.html') ? [p] : [];
  });
})(DIST);

const errors = [];
const fail = (page, msg) => errors.push(`${relative(DIST, page)}: ${msg}`);

for (const page of pages) {
  const html = readFileSync(page, 'utf8');

  if (!/<html lang="es"/.test(html)) fail(page, 'falta lang="es"');
  const h1 = html.match(/<h1[\s>]/g)?.length ?? 0;
  if (h1 !== 1) fail(page, `${h1} encabezados h1 (debe haber 1)`);
  if (!html.includes('href="#contenido"') || !/<main id="contenido"/.test(html)) fail(page, 'falta el enlace «Saltar al contenido»');
  for (const l of LEGAL) if (!html.includes(`href="${BASE}${l}"`)) fail(page, `el pie no enlaza a ${l}`);

  for (const img of html.match(/<img\b[^>]*>/g) ?? []) if (!/\salt="/.test(img)) fail(page, `imagen sin alt: ${img}`);
  for (const svg of html.match(/<svg\b[^>]*>/g) ?? []) {
    if (!/aria-hidden="true"/.test(svg) && !/role="img"[^>]*aria-label=|aria-label=[^>]*role="img"/.test(svg)) fail(page, `svg sin aria-hidden ni nombre: ${svg.slice(0, 80)}`);
  }
  for (const btn of html.match(/<button\b[^>]*>[\s\S]*?<\/button>/g) ?? []) {
    const text = btn.replace(/<svg[\s\S]*?<\/svg>/g, '').replace(/<[^>]+>/g, '').trim();
    if (!text && !/aria-label="[^"]+"/.test(btn)) fail(page, `botón sin texto: ${btn.slice(0, 80)}`);
  }

  // Ningún recurso externo que se cargue automáticamente (scripts, estilos, imágenes, iframes, fuentes).
  for (const m of html.matchAll(/<(script|link|img|iframe|source|video|audio|embed|object)\b[^>]*(?:src|href)="(https?:)?\/\/[^"]+"/g)) {
    fail(page, `recurso externo: ${m[0].slice(0, 100)}`);
  }
  for (const m of html.matchAll(/<a\b[^>]*href="(https?:\/\/[^"]+)"/g)) {
    if (!EXTERNAL_LINKS.some((e) => m[1].startsWith(e))) fail(page, `enlace externo no revisado: ${m[1]}`);
  }
  if (/document\.cookie|gtag\(|googletagmanager|google-analytics|fbq\(/.test(html)) fail(page, 'código de cookies o rastreo');

  // Enlaces internos rotos.
  for (const m of html.matchAll(/href="(\/Trenchs-Advisory\/[^"#?]*)"/g)) {
    const rel = m[1].slice(BASE.length);
    const target = join(DIST, rel, rel === '' || rel.endsWith('/') ? 'index.html' : '');
    if (!existsSync(target) && !existsSync(join(DIST, rel))) fail(page, `enlace roto: ${m[1]}`);
  }

  if (!draft && html.includes('[PENDIENTE')) fail(page, 'datos del titular pendientes');
}

for (const asset of readdirSync(join(DIST, '_astro')).filter((f) => f.endsWith('.js') || f.endsWith('.css'))) {
  const src = readFileSync(join(DIST, '_astro', asset), 'utf8');
  if (/document\.cookie|https?:\/\/(?!www\.w3\.org)/.test(src)) errors.push(`_astro/${asset}: cookie o URL externa`);
}

if (errors.length) {
  console.error(`✗ ${errors.length} problema(s):\n  ${errors.join('\n  ')}`);
  process.exit(1);
}
console.log(`✓ ${pages.length} páginas verificadas${draft ? ' (borrador: se admiten datos pendientes)' : ''}.`);
