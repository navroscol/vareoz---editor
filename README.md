# VAREOZ - Editor

Proyecto auto-generado desde el editor visual.

## Desarrollo
```bash
npm install
npm run dev
```

## Build
```bash
npm run build
```

## Deploy a Vercel
El proyecto ya incluye `vercel.json` con configuración SPA. Sube esta carpeta
a un repo de GitHub e impórtala en Vercel, o ejecuta:

```bash
npx vercel --prod
```

## Estructura
- `client/pages/` — una página por cada lienzo del editor.
- `client/components/generated/` — componentes 21st.dev usados (editables).
- `client/components/ui/` — primitivas shadcn/ui completas.
- `client/lib/utils.ts` — helper `cn()`.
- `client/global.css` — Tailwind base + variables shadcn (light/dark).
