---
doc: pattern
area: Patrones
level: intermedio
tags:
  - pattern
  - resilience
  - retry
  - backoff
aliases:
  - Retry Policy
  - Exponential Backoff
  - Jitter
related:
  - Circuit Breaker
  - Timeout
  - Idempotency Key
refs:
  - https://aws.amazon.com/builders-library/timeouts-retries-and-backoff-with-jitter/
  - https://learn.microsoft.com/azure/architecture/patterns/retry
sticker: lucide//curly-braces
---

# Retry / Backoff

## En una línea
Reintenta operaciones fallidas de forma controlada (con backoff y jitter) para mejorar resiliencia ante fallos transitorios.

## Problema
En redes y sistemas distribuidos, fallos transitorios son normales:
- timeouts momentáneos
- rate limits (429)
- picos de latencia
- reinicios de servicios
- “connection reset”

Señales típicas:
- Requests fallan de vez en cuando y al reintentar funcionan
- Usuarios reportan “a veces sirve”
- Muchos errores 5xx temporales

## Solución
- Reintentar solo en errores transitorios
- Aplicar backoff (mejor exponencial)
- Añadir jitter (aleatoriedad) para evitar “thundering herd”
- Definir límites: max intentos, tiempo total, errores no-retriables
- Preferible combinar con Timeout y (en sistemas grandes) Circuit Breaker

## Cuándo usar
- Llamadas a APIs externas
- DB con reconexión
- Colas y servicios con latencia variable

## Cuándo NO usar
- Operaciones no idempotentes sin idempotency key (ej: cobrar 2 veces)
- Errores lógicos (400, validation)
- Cuando el servicio está caído duro (mejor Circuit Breaker)

## Trade-offs
Pros
- Reduce fallos transitorios
- Mejora UX y estabilidad

Contras
- Puede aumentar latencia
- Puede sobrecargar al servicio si se usa mal
- Puede esconder problemas reales si no se monitorea

## Variantes / alternativas
- Exponential backoff con jitter
- Retry por tipo de error (status codes)
- Alternativa: fail fast si el error no es transitorio
- [[Circuit Breaker]] para cortar cuando el destino está mal

## Ejemplo mínimo

Retry policy con backoff + jitter (TypeScript)
```ts
function sleep(ms: number) {
  return new Promise(res => setTimeout(res, ms));
}

type RetryOpts = {
  maxAttempts: number;      // ej: 5
  baseDelayMs: number;      // ej: 200
  maxDelayMs: number;       // ej: 5000
  isRetriable?: (e: any) => boolean;
};

function defaultIsRetriable(e: any) {
  const code = e?.status ?? e?.code;
  // Ejemplo: 429/503/504 y timeouts
  return code === 429 || code === 503 || code === 504 || code === "ETIMEDOUT";
}

export async function retry<T>(fn: () => Promise<T>, opts: RetryOpts): Promise<T> {
  const isRetriable = opts.isRetriable ?? defaultIsRetriable;

  let attempt = 0;
  let lastErr: any;

  while (attempt < opts.maxAttempts) {
    attempt++;
    try {
      return await fn();
    } catch (e) {
      lastErr = e;
      if (!isRetriable(e) || attempt >= opts.maxAttempts) break;

      const exp = opts.baseDelayMs * Math.pow(2, attempt - 1);
      const capped = Math.min(exp, opts.maxDelayMs);
      const jitter = Math.random() * capped * 0.3; // 0–30%
      await sleep(capped + jitter);
    }
  }

  throw lastErr;
}
```

## Errores comunes
- Reintentar en 400/validation (no sirve)
- Reintentar operaciones no idempotentes sin protección
- Sin jitter (herd effect)
- Sin límite de tiempo total (requests eternos)
- No instrumentar: no sabes cuánto estás reintentando

## Checklist de implementación
- [ ] ¿La operación es idempotente o tiene idempotency key?
- [ ] ¿Solo reintentas errores transitorios?
- [ ] ¿Hay backoff + jitter?
- [ ] ¿Hay límites (maxAttempts, maxDelay, timeout total)?
- [ ] ¿Tienes métricas (retries, latencia, tasa de éxito)?

## Relacionado
- [[Circuit Breaker]]
- [[Timeout]]
- [[Idempotency Key]]

## Referencias
- AWS Builders Library — Timeouts, retries and backoff with jitter
- Microsoft — Retry pattern
