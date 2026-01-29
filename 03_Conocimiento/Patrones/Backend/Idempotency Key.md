---
doc: pattern
area: Patrones
level: intermedio
tags:
  - pattern
  - api
  - idempotency
aliases:
  - Idempotent POST
  - Idempotency-Key
related:
  - Retry/Backoff
  - Timeout
  - Transactional Outbox
refs:
  - https://stripe.com/docs/idempotency
sticker: lucide//curly-braces
---

# Idempotency Key

## En una línea
Permite que una operación “peligrosa” (crear/cobrar) sea segura ante reintentos: si llega el mismo request con la misma key, devuelves el mismo resultado sin duplicar efectos.

## Problema
En redes reales:
- el cliente reintenta por timeout
- el proxy reintenta
- el usuario da doble click
- el servicio upstream reenvía

Si tu POST “crea” algo (orden/pago), puedes crear duplicados.

Señales típicas:
- Duplicados en órdenes/pagos
- “A veces cobra dos veces”
- Reintentos de clientes móviles con mala red

## Solución
- El cliente envía header `Idempotency-Key`
- Tu servidor guarda un registro: `(key, endpoint, userId) -> respuesta`
- Si entra un request con la misma key:
  - si ya se procesó: devuelves la respuesta guardada
  - si está en progreso: devuelves 409/202 o esperas según tu diseño

## Cuándo usar
- Pagos
- Crear órdenes/reservas
- Webhooks “at least once”
- Cualquier POST con side-effects

## Cuándo NO usar
- Operaciones naturalmente idempotentes (PUT sobre recurso con id)
- GET (ya es idempotente)

## Trade-offs
Pros
- Evita duplicados y cobros dobles
- Permite retries seguros
- Mejora confiabilidad

Contras
- Necesitas storage (Redis/DB)
- Decidir TTL y scope de keys
- Manejar “in progress” correctamente

## Variantes / alternativas
- Natural idempotency: usar un id del cliente como resource id
- Dedupe por hash del body (menos recomendado)
- “Exactly-once” real es difícil; esto es “dedupe” práctico

## Ejemplo mínimo

Express + Redis (conceptual)
```ts
// Pseudo-redis
const store = new Map<string, { status: "done"; response: any } | { status: "in_progress" }>();

function idempotency() {
  return async (req: any, res: any, next: any) => {
    const key = req.header("Idempotency-Key");
    if (!key) return res.status(400).json({ error: "Missing Idempotency-Key" });

    const scope = `${req.user?.id ?? req.ip}:${req.method}:${req.path}:${key}`;
    const existing = store.get(scope);

    if (existing?.status === "done") return res.json(existing.response);
    if (existing?.status === "in_progress") return res.status(409).json({ error: "Request in progress" });

    store.set(scope, { status: "in_progress" });

    // Hook: capturar response para guardarla (conceptual)
    const originalJson = res.json.bind(res);
    res.json = (body: any) => {
      store.set(scope, { status: "done", response: body });
      return originalJson(body);
    };

    next();
  };
}
```

Uso
```ts
app.post("/payments", idempotency(), async (req, res) => {
  // ... cobrar / crear orden
  return res.json({ paymentId: "p1", status: "ok" });
});
```

## Errores comunes
- No scoping por user/endpoint (una key podría colisionar con otra operación)
- No TTL (store crece infinito)
- Guardar solo “ok” y no errores (reintentos pueden duplicar)
- No manejar “in progress” (duplicación en simultáneo)

## Checklist de implementación
- [ ] ¿Key scoping incluye user + endpoint?
- [ ] ¿Tienes TTL (ej: 24h) en Redis/DB?
- [ ] ¿Guardas respuesta completa (incluye errores relevantes)?
- [ ] ¿Manejas simultáneo (in_progress)?
- [ ] ¿El cliente sabe generar keys únicas?

## Relacionado
- [[Retry Backoff]]
- [[Transactional Outbox]]
- [[Timeout]]

## Referencias
- Stripe — Idempotency keys
