---
doc: pattern
area: Patrones
level: avanzado
tags:
  - pattern
  - event-driven
  - pubsub
  - messaging
  - consumer
  - idempotency
aliases:
  - Event-driven messaging
  - At-least-once consumption
related:
  - Transactional Outbox
  - Idempotency Key
  - Retry/Backoff
  - Circuit Breaker
  - Saga
refs:
  - https://microservices.io/patterns/communication-style/pub-sub.html
  - https://microservices.io/patterns/data/transactional-outbox.html
  - https://www.confluent.io/blog/exactly-once-semantics-are-hard/
sticker: lucide//curly-braces
---

# Event-driven: Pub/Sub + Consumer Idempotency

## En una línea
En Pub/Sub la entrega suele ser **at-least-once**: un evento puede llegar repetido. La solución práctica es que el **consumer sea idempotente** (procesa una vez “efectiva”, aunque lo reciba varias veces).

## Problema
En sistemas con colas/brokers (Kafka, RabbitMQ, SNS/SQS, NATS):
- El broker reintenta si no confirmas (ack) o si hubo fallo
- Un consumer puede caerse después de procesar pero antes de ack
- Redes duplican mensajes, rebalances, retries, etc.

Resultado: **eventos duplicados**.

Señales típicas:
- “Se ejecutó dos veces el envío de email”
- Duplicados en proyecciones/estadísticas
- Inventario decrementado doble
- Reintentos del broker crean side-effects repetidos

## Solución
### Parte A: Pub/Sub (eventos)
- Publicas eventos (ej: `OrderCreated`, `PaymentCaptured`)
- Los consumers reaccionan de manera desacoplada
- El producer idealmente publica de forma confiable (ej: [[Transactional Outbox]])

### Parte B: Consumer Idempotency (dedupe)
El consumer guarda “ya procesé este evento” usando:
- `eventId` (único) + `consumerName`
- Persistencia (DB/Redis) con TTL/retención
- Antes de ejecutar side effects:
  1) revisa si `eventId` ya fue procesado
  2) si sí: no hace nada y hace ack
  3) si no: procesa, marca como procesado, luego ack

**Clave:** si el procesamiento no es idempotente, usa “dedupe store”.

## Cuándo usar
- Siempre que consumas de un broker con at-least-once (casi todos)
- Cuando el evento causa side-effects (emails, pagos, writes)
- Proyecciones CQRS (evitar duplicar conteos)

## Cuándo NO usar
- Solo si tienes garantía real de exactly-once (raro y complejo)
- Si el consumer no tiene efectos (solo logging) y duplicados no importan

## Trade-offs
Pros
- Evitas side-effects duplicados
- Robustez ante reintentos y fallos
- Escala bien con múltiples consumers

Contras
- Requiere storage para dedupe
- Hay que decidir retención/TTL
- Necesitas `eventId` consistente y único
- Tu lógica debe tolerar reordenamiento (a veces)

## Variantes / alternativas
- Dedupe store en DB con constraint único `(consumer, event_id)`
- Redis SETNX con TTL
- Diseño idempotente “natural” (upserts, incrementos con guardas)
- Outbox + consumer idempotency (combo ganador)

## Ejemplo mínimo (Node + TS, conceptual)

Evento con eventId
```ts
type EventEnvelope<T> = {
  eventId: string;         // UUID
  type: string;            // "OrderCreated"
  occurredAt: string;      // ISO
  payload: T;
};
```

Dedupe en DB (constraint único)
```ts
// tabla processed_events:
// consumer_name TEXT, event_id TEXT, processed_at TIMESTAMP
// UNIQUE(consumer_name, event_id)

async function alreadyProcessed(db: any, consumer: string, eventId: string) {
  const r = await db.query(
    `SELECT 1 FROM processed_events WHERE consumer_name=$1 AND event_id=$2 LIMIT 1`,
    [consumer, eventId]
  );
  return r.rowCount > 0;
}

async function markProcessed(db: any, consumer: string, eventId: string) {
  await db.query(
    `INSERT INTO processed_events(consumer_name, event_id, processed_at)
     VALUES($1,$2,NOW())
     ON CONFLICT (consumer_name, event_id) DO NOTHING`,
    [consumer, eventId]
  );
}
```

Consumer idempotente
```ts
const CONSUMER = "email-service";

async function handleEvent(db: any, ev: EventEnvelope<{ userEmail: string }>) {
  if (await alreadyProcessed(db, CONSUMER, ev.eventId)) return; // dedupe

  // side effect
  await sendWelcomeEmail(ev.payload.userEmail);

  // marca al final (o en tx si tu side-effect es write local)
  await markProcessed(db, CONSUMER, ev.eventId);
}
```

## Errores comunes
- No tener `eventId` único (imposible dedupe)
- Marcar “procesado” antes del side-effect (pierdes procesamiento si crashea)
- No usar transacción cuando el side-effect es “write local”
- No considerar reordenamiento (eventos pueden llegar fuera de orden)
- No instrumentar (no sabes cuántos duplicados estás recibiendo)

## Checklist de implementación
- [ ] ¿Cada evento tiene `eventId` único?
- [ ] ¿Consumer tiene dedupe store persistente?
- [ ] ¿Marca procesado al final (o atómicamente con write local)?
- [ ] ¿Maneja reintentos/backoff si falla?
- [ ] ¿Métricas: duplicates skipped, processing time, failures?

## Relacionado
- [[Transactional Outbox]]
- [[Idempotency Key]]
- [[Retry Backoff]]
- [[Saga]]
- [[CQRS]]

## Referencias
- microservices.io — Pub/Sub
- microservices.io — Transactional Outbox
- Confluent — exactly-once is hard
