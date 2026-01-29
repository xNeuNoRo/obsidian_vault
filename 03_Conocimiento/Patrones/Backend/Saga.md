---
doc: pattern
area: Patrones
level: avanzado
tags:
  - pattern
  - data
  - saga
  - distributed-transactions
aliases:
  - Compensating Transactions
  - Process Manager
related:
  - Transactional Outbox
  - CQRS
  - Idempotency Key
refs:
  - https://microservices.io/patterns/data/saga.html
sticker: lucide//curly-braces
---

# Saga

## En una línea
Coordina una transacción distribuida como una secuencia de pasos locales, con acciones de compensación si algo falla.

## Problema
En microservicios (o módulos separados), no tienes una transacción ACID global.
Ejemplo clásico: crear orden requiere:
- Reservar inventario
- Cobrar pago
- Crear envío

Si falla el pago después de reservar inventario, debes “deshacer” la reserva.

Señales típicas:
- Estados inconsistentes entre servicios
- “Orden creada pero sin pago”
- Procesos largos con pasos y fallos parciales

## Solución
Una Saga define:
- Pasos: T1, T2, T3...
- Compensaciones: C1, C2, C3... (deshacer)

Dos estilos:
1) **Orquestada**: un “orchestrator” manda comandos y decide siguiente paso
2) **Coreografiada**: cada servicio reacciona a eventos y dispara el siguiente

## Cuándo usar
- Workflows multi-servicio
- Procesos de negocio largos (order fulfillment)
- Necesidad de consistencia eventual con compensación

## Cuándo NO usar
- Todo está en un monolito (usa transacciones DB)
- Workflows simples (un solo servicio)

## Trade-offs
Pros
- Maneja fallos parciales
- Reduce necesidad de transacciones distribuidas
- Modela procesos reales

Contras
- Complejidad alta
- Debugging y observabilidad obligatorios
- “Compensar” no siempre es trivial (depende del negocio)

## Variantes / alternativas
- Orchestrator con state machine (State pattern)
- Choreography con eventos (Observer/PubSub)
- Si todo en monolito: transacción DB y listo

## Ejemplo mínimo

Saga orquestada (simplificada)
```ts
type SagaState = "START" | "INVENTORY_RESERVED" | "PAID" | "COMPLETED" | "FAILED";

class OrderSaga {
  state: SagaState = "START";

  constructor(private inventory: any, private payments: any, private shipping: any) {}

  async run(orderId: string) {
    try {
      await this.inventory.reserve(orderId);
      this.state = "INVENTORY_RESERVED";

      await this.payments.charge(orderId);
      this.state = "PAID";

      await this.shipping.create(orderId);
      this.state = "COMPLETED";
    } catch (e) {
      await this.compensate(orderId);
      this.state = "FAILED";
      throw e;
    }
  }

  async compensate(orderId: string) {
    if (this.state === "PAID") {
      await this.payments.refund(orderId); // C2
    }
    if (this.state === "INVENTORY_RESERVED") {
      await this.inventory.release(orderId); // C1
    }
  }
}
```

## Errores comunes
- Compensaciones incompletas o no idempotentes
- No persistir el estado de saga (si cae el proceso, pierdes progreso)
- No tener correlación (correlationId) y trazas
- Doble procesamiento por reintentos sin idempotency

## Checklist de implementación
- [ ] ¿Cada paso y compensación es idempotente?
- [ ] ¿Persistes estado y progreso de la saga?
- [ ] ¿Tienes correlationId + tracing?
- [ ] ¿Tienes timeouts y reintentos controlados?
- [ ] ¿Existe DLQ/manual recovery para casos raros?

## Relacionado
- [[Transactional Outbox]]
- [[Idempotency Key]]
- [[State]]

## Referencias
- microservices.io — Saga pattern
