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

## Estructura

- `src/pages/`: portada, páginas de servicio (`servicios/[slug].astro`) y páginas de la firma.
- `src/components/`: secciones reutilizables.
- `src/data/services.ts`: contenido de las cinco áreas de servicio y navegación.
- `src/consts.ts`: email de contacto y enlace de "Solicitar diagnóstico".
- `CONTEXT.md`: glosario de términos de la marca.
