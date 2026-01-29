---
doc: pattern
area: Patrones
level: avanzado
tags:
  - pattern
  - data
  - transactional-outbox
  - events
aliases:
  - Outbox Pattern
  - Reliable Events
related:
  - Saga
  - CQRS
  - Idempotency Key
refs:
  - https://microservices.io/patterns/data/transactional-outbox.html
sticker: lucide//curly-braces
---

# Transactional Outbox

## En una línea
Publica eventos/mensajes de forma confiable guardándolos en la misma transacción que tu cambio de DB, y luego enviándolos desde una tabla outbox.

## Problema
Si haces:
1) guardo en DB
2) publico evento (Kafka/Rabbit)

y el paso 2 falla, tienes inconsistencia: DB cambió pero el evento no salió.  
Si publicas primero y luego falla DB, peor.

Señales típicas:
- “A veces no llega el evento”
- Doble envío o eventos perdidos
- Dificultad para garantizar consistencia entre DB y broker

## Solución
En la misma transacción DB:
- Insertas tu cambio de negocio
- Insertas un registro en `outbox` (evento pendiente)

Luego un worker:
- lee outbox pendiente
- publica al broker
- marca como enviado

Esto te da “at least once” delivery; combínalo con idempotency en consumers.

## Cuándo usar
- Microservicios/event-driven
- Integraciones críticas (pagos, órdenes)
- Cuando perder eventos es inaceptable

## Cuándo NO usar
- Sistemas simples sin eventos
- Si un webhook síncrono basta (aunque con riesgos)

## Trade-offs
Pros
- Evita pérdida de eventos
- Consistencia fuerte entre write y evento
- Reintentos seguros (worker)

Contras
- Más componentes (tabla + worker)
- Necesitas deduplicación del lado consumidor (idempotency)
- Latencia eventual (no siempre inmediato)

## Variantes / alternativas
- Polling de outbox (simple)
- CDC (Debezium) leyendo WAL/binlog (pro)
- Publicación directa con “transactional broker” (raro)

## Ejemplo mínimo

Schema (idea)
```ts
// outbox: { id, type, payload_json, created_at, published_at, attempts }
```

Pseudo-código con Postgres transaction
```ts
async function createOrder(db: any, order: any) {
  await db.tx(async (tx: any) => {
    await tx.insert("orders", order);

    await tx.insert("outbox", {
      type: "OrderCreated",
      payload_json: JSON.stringify({ orderId: order.id, userId: order.userId }),
      created_at: new Date().toISOString(),
      published_at: null,
      attempts: 0,
    });
  });
}
```

Worker (polling)
```ts
async function outboxWorker(db: any, broker: any) {
  const rows = await db.query(`SELECT * FROM outbox WHERE published_at IS NULL ORDER BY created_at LIMIT 50`);

  for (const r of rows) {
    try {
      await broker.publish(r.type, JSON.parse(r.payload_json));
      await db.exec(`UPDATE outbox SET published_at = NOW() WHERE id = $1`, [r.id]);
    } catch (e) {
      await db.exec(`UPDATE outbox SET attempts = attempts + 1 WHERE id = $1`, [r.id]);
    }
  }
}
```

## Errores comunes
- No tener id único del evento (dedupe imposible)
- No tener retries/backoff del worker
- Consumidores no idempotentes (procesan doble)
- No limpiar outbox viejo (retención)

## Checklist de implementación
- [ ] ¿Evento tiene id único (eventId)?
- [ ] ¿Worker con retry/backoff y DLQ si aplica?
- [ ] ¿Consumer idempotente?
- [ ] ¿Política de retención/cleanup?
- [ ] ¿Métricas: backlog, lag, failures?

## Relacionado
- [[Saga]]
- [[Idempotency Key]]
- [[CQRS]]

## Referencias
- microservices.io — Transactional Outbox
