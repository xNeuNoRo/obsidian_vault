---
doc: pattern
area: Frontend
level: intermedio
tags:
  - frontend
  - nextjs
  - rendering
  - ssr
  - ssg
  - isr
  - caching
aliases:
  - SSR/SSG/ISR
  - Rendering strategy
related:
  - State management patterns
  - Cache-Aside
refs:
  - https://nextjs.org/docs
sticker: lucide//curly-braces
---

# Rendering patterns (Next.js): SSR / SSG / ISR + caching

## En una línea
Elegir la estrategia de render según tu necesidad de frescura, SEO y performance: SSR (siempre fresco), SSG (muy rápido), ISR (estático con revalidación), y caching/revalidation.

## Problema
Si renderizas mal:
- SSR para todo → caro y lento en picos
- SSG para data muy dinámica → info vieja
- Sin caching → TTFB alto y costos altos

## Solución (cuándo usar qué)
- SSR: data muy dinámica por request, personalización
- SSG: contenido casi estático (docs, marketing)
- ISR: contenido mayormente estático pero que cambia (blog, catálogos)
- Caching: controlar revalidación y minimizar llamadas

## Ejemplo mental rápido
- Home marketing: SSG
- Blog: ISR
- Dashboard usuario: SSR o client + server state
- Producto catálogo: ISR + cache

## Ejemplo mínimo (conceptual)
```ts
// Next: usa caching/revalidation según tu versión (App Router / Pages Router)
// Idea: revalidate para ISR, y cache para fetches repetidos.
```

## Errores comunes
- SSR innecesario en páginas públicas
- ISR con revalidate muy largo para data “sensible”
- Mezclar server/client state sin invalidation clara
- Olvidar caching del lado backend

## Checklist
- [ ] ¿Requieres SEO? (SSR/SSG)
- [ ] ¿Qué tan fresca debe ser la data?
- [ ] ¿Cuál es tu pico de tráfico?
- [ ] ¿Hay caching/revalidation claro?
- [ ] ¿Dónde vive la verdad: server state vs client state?

## Relacionado
- [[Cache-Aside]]
- [[State management patterns]]

## Referencias
- Next.js docs
