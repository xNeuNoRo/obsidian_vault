---
doc: pattern
area: Patrones
level: avanzado
tags:
  - pattern
  - data
  - cqrs
aliases:
  - Command Query Responsibility Segregation
related:
  - Transactional Outbox
  - Saga
refs:
  - https://martinfowler.com/bliki/CQRS.html
  - https://microservices.io/patterns/data/cqrs.html
sticker: lucide//curly-braces
---

# CQRS

## En una línea
Separa el modelo/flujo de **escritura (Commands)** del de **lectura (Queries)**, porque optimizan cosas distintas.

## Problema
Un solo modelo para todo causa fricción:
- Writes requieren invariantes, validaciones, transacciones
- Reads requieren performance, joins, agregaciones, caches

Señales típicas:
- El modelo de DB se deforma para soportar queries
- Queries complejas y lentas impactan writes
- Necesitas vistas/precomputados para performance

## Solución
- Commands (write-side) validan y cambian el estado (source of truth)
- Queries (read-side) leen desde un modelo optimizado (proyecciones, vistas materializadas, cache)

Esto puede ser:
- “CQRS light” dentro del mismo DB (write normal, read con views/denormalización)
- CQRS completo con eventos y proyecciones (más complejo)

## Cuándo usar
- Sistemas read-heavy con queries complejas
- Necesidad de proyecciones rápidas (dashboards)
- Cuando el dominio de escritura debe mantenerse limpio

## Cuándo NO usar
- CRUD simple (99% de proyectos al inicio)
- Si tu equipo no está listo para complejidad extra

## Trade-offs
Pros
- Lecturas rápidas y flexibles
- Write model más limpio (invariantes)
- Escala independiente reads/writes

Contras
- Eventual consistency (si hay proyecciones)
- Más componentes y mantenimiento
- Debugging y sincronización

## Variantes / alternativas
- CQRS light (mismo DB, read views)
- Materialized views
- Cache-aside para acelerar reads
- Si no duele: no lo uses todavía

## Ejemplo mínimo

Write-side (Command)
```ts
// Command handler
async function createOrder(cmd: { userId: string; items: any[] }, db: any) {
  // validar invariantes
  await db.insert("orders", { id: crypto.randomUUID(), userId: cmd.userId });
  // ...
}
```

Read-side (Query model)
```ts
// Proyección: tabla denormalizada order_summary
async function getOrderSummary(orderId: string, db: any) {
  return db.query(`SELECT * FROM order_summary WHERE order_id = $1`, [orderId]);
}
```

## Errores comunes
- Adoptar CQRS completo sin necesidad
- No manejar consistencia eventual (el usuario ve datos “viejos”)
- Proyecciones sin rebuild strategy
- No versionar eventos/contratos si hay eventing

## Checklist de implementación
- [ ] ¿De verdad duele el modelo único?
- [ ] ¿Puedes empezar con CQRS light?
- [ ] ¿Tus lecturas necesitan un modelo distinto?
- [ ] ¿Tienes estrategia para sincronizar/proyectar?
- [ ] ¿Aceptas eventual consistency?

## Relacionado
- [[Cache-Aside]]
- [[Transactional Outbox]]
- [[Saga]]

## Referencias
- Martin Fowler — CQRS
- microservices.io — CQRS pattern
