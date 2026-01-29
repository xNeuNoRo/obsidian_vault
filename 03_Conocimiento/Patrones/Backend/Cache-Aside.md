---
doc: pattern
area: Patrones
level: intermedio
tags:
  - pattern
  - caching
  - cache-aside
aliases:
  - Lazy caching
  - Read-through (manual)
related:
  - Facade
  - Decorator
  - Global State (anti-pattern)
refs:
  - https://learn.microsoft.com/azure/architecture/patterns/cache-aside
sticker: lucide//curly-braces
---

# Cache-Aside (Lazy caching)

## En una línea
La app primero busca en cache; si no está, lee de DB/servicio, guarda en cache y devuelve el resultado.

## Problema
Leer siempre de DB/servicio:
- es caro
- aumenta latencia
- se cae en picos

Señales típicas:
- Endpoints “read heavy”
- DB cerca del límite
- Latencia alta en consultas repetidas

## Solución
- `get(key)` del cache
- si hit: devolver
- si miss: leer source of truth, set cache (con TTL), devolver

Punto clave: el **source of truth** es DB/servicio; cache es derivado.

## Cuándo usar
- Lecturas frecuentes con poca variación
- Catálogos, perfiles, config, sesiones
- Resultados de queries “costosas”

## Cuándo NO usar
- Datos ultra sensibles o cambiantes sin estrategia de invalidación
- Si no puedes tolerar stale reads (o necesitas coherencia fuerte)

## Trade-offs
Pros
- Reduce latencia
- Reduce carga al source of truth
- Mejora estabilidad en picos

Contras
- Invalidation es difícil
- Stale data
- Cache stampede (muchos misses a la vez)

## Variantes / alternativas
- TTL + stale-while-revalidate
- Cache warming (precargar)
- Singleflight / lock en miss (evitar stampede)
- Decorator para envolver repositorios con caching

## Ejemplo mínimo

Cache-aside con TTL (conceptual)
```ts
type Cache = { get: (k: string) => Promise<string | null>; set: (k: string, v: string, ttlSec: number) => Promise<void> };

async function getUserCached(userId: string, cache: Cache, db: { getUser: (id: string) => Promise<any> }) {
  const key = `user:${userId}`;
  const hit = await cache.get(key);
  if (hit) return JSON.parse(hit);

  const user = await db.getUser(userId);
  await cache.set(key, JSON.stringify(user), 60); // TTL 60s
  return user;
}
```

## Errores comunes
- TTL infinito (sirves datos viejos)
- No invalidar cuando cambias el dato
- Cache stampede (muchos miss simultáneos)
- Guardar objetos enormes (memoria explota)

## Checklist de implementación
- [ ] ¿Definiste TTL apropiado?
- [ ] ¿Tienes estrategia de invalidación (on write)?
- [ ] ¿Manejas stampede (lock/singleflight)?
- [ ] ¿Métricas de hit ratio y latencia?
- [ ] ¿El cache key es estable y versionado (si cambias schema)?

## Relacionado
- [[Decorator]] (caching decorator)
- [[Facade]]
- [[Global State (anti-pattern)]] (cache global sin control)

## Referencias
- Microsoft — Cache-Aside pattern
