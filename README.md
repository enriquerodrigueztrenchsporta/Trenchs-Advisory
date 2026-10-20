# Trenchs Advisory

Web corporativa de Trenchs Advisory, construida con [Astro](https://astro.build).

## Desarrollo local

```sh
npm install
npm run dev
```

La web queda en http://localhost:4321/Trenchs-Advisory/

## Publicación

Cada push a `main` publica la web en GitHub Pages mediante `.github/workflows/deploy.yml`.

Antes de publicar hay que rellenar los datos del titular en `src/data/legal.ts` (exigidos por la LSSI-CE):
mientras falte alguno, `npm run build` falla a propósito. Para previsualizar sin ellos:

```sh
LEGAL_DRAFT=1 npm run build   # en PowerShell: $env:LEGAL_DRAFT='1'; npm run build
```

Después de compilar, `npm run verify` revisa el HTML generado: un `h1` por página, enlace «Saltar al contenido»,
enlaces del pie a las páginas legales, SVG decorativos ocultos a lectores de pantalla, enlaces internos rotos,
recursos o enlaces externos no revisados, código de cookies o rastreo y datos del titular pendientes.

## Cumplimiento legal y accesibilidad

- Páginas legales en `src/pages/legal/`: aviso legal y condiciones de uso, privacidad y cookies.
- La web no usa cookies, analítica ni recursos de terceros (las fuentes se sirven desde la propia web), por lo
  que no necesita aviso de consentimiento. Si se añade analítica, vídeos, mapas o similares, habrá que añadir un
  sistema de consentimiento previo y actualizar la política de cookies.
- Único almacenamiento local: la preferencia «Pausar animaciones» (`localStorage.motion`), exenta de consentimiento.
- Colores de texto: `--ink-mute` y `--gold-700` sobre crema cumplen WCAG AA (≥ 4,5:1); `--gold-500` solo para
  trazos y fondos decorativos.

## Estructura

- `src/pages/`: portada, páginas de servicio (`servicios/[slug].astro`) y páginas de la firma.
- `src/components/`: secciones reutilizables.
- `src/data/services.ts`: contenido de las cinco áreas de servicio y navegación.
- `src/consts.ts`: email de contacto y enlace de "Solicitar diagnóstico".
- `src/data/legal.ts`: datos del titular para el aviso legal y la política de privacidad.
- `scripts/verify-site.mjs`: comprobaciones sobre `dist/`.
- `CONTEXT.md`: glosario de términos de la marca.
