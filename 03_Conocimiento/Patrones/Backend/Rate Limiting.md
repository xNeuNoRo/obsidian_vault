---
doc: pattern
area: Patrones
level: intermedio
tags:
  - pattern
  - resilience
  - rate-limiting
  - security
aliases:
  - Throttling
  - Quota
related:
  - Bulkhead
  - Timeout
  - Circuit Breaker
refs:
  - https://cloud.google.com/architecture/rate-limiting-strategies-techniques
  - https://www.nginx.com/blog/rate-limiting-nginx/
sticker: lucide//curly-braces
---

# Rate Limiting / Throttling

## En una línea
Limita cuántas requests puede hacer un cliente en un período para proteger tu API de abuso, picos y costos.

## Problema
Sin rate limit:
- Bots o usuarios pueden tumbar tu API con spam
- Ataques (brute force login)
- Picos de tráfico te derriban
- Costos se disparan (DB, terceros, etc.)

Señales típicas:
- Picos raros de requests por IP o user
- Login con miles de intentos
- Endpoints caros explotados por scraping

## Solución
Aplicas una política por “identidad”:
- IP
- userId (si autenticado)
- API key / tenantId

Estrategias comunes:
- Token Bucket (recomendado)
- Leaky Bucket
- Fixed window / Sliding window

## Cuándo usar
- Login / auth endpoints
- APIs públicas
- Endpoints caros o que golpean terceros
- Webhooks (para evitar loops)

## Cuándo NO usar
- APIs internas ultra controladas (aunque igual conviene algo básico)
- Webhooks críticos sin plan (mejor “queue + ack” y límites suaves)

## Trade-offs
Pros
- Protege estabilidad
- Reduce abuso y costos
- Mejor UX para la mayoría (evita caídas)

Contras
- Puede bloquear usuarios legítimos en picos
- Requiere buen “keying” (IP vs userId)
- Necesita respuesta clara (429 + Retry-After)

## Variantes / alternativas
- Rate limit por ruta (login más estricto)
- Burst capacity (token bucket)
- Alternativa: queueing + backpressure

## Ejemplo mínimo

Express middleware (token bucket simple en memoria)
```ts
type Bucket = { tokens: number; last: number };
const buckets = new Map<string, Bucket>();

export function rateLimit({ capacity, refillPerSec }: { capacity: number; refillPerSec: number }) {
  return (req: any, res: any, next: any) => {
    const key = req.user?.id ?? req.ip;
    const now = Date.now();
    const b = buckets.get(key) ?? { tokens: capacity, last: now };

    const elapsed = (now - b.last) / 1000;
    b.tokens = Math.min(capacity, b.tokens + elapsed * refillPerSec);
    b.last = now;

    if (b.tokens < 1) {
      res.setHeader("Retry-After", "1");
      return res.status(429).json({ error: "Too Many Requests" });
    }

    b.tokens -= 1;
    buckets.set(key, b);
    next();
  };
}
```

Uso por ruta
```ts
app.post("/login", rateLimit({ capacity: 5, refillPerSec: 0.2 }), loginHandler); // 5 burst, 1 token cada 5s
app.get("/api", rateLimit({ capacity: 60, refillPerSec: 1 }), apiHandler);       // 60/min aprox
```

## Errores comunes
- Rate limit solo por IP (NAT, móviles, oficinas) → bloqueas gente inocente
- No devolver 429 claro ni Retry-After
- Hacerlo en memoria en múltiples instancias (se desincroniza) → usar Redis en prod

## Checklist de implementación
- [ ] ¿Key correcto (userId/apiKey primero, IP como fallback)?
- [ ] ¿Respuesta 429 con Retry-After?
- [ ] ¿Diferentes límites por endpoint?
- [ ] ¿En prod está centralizado (Redis) si hay múltiples instancias?
- [ ] ¿Métricas: bloqueos, top offenders?

## Relacionado
- [[Bulkhead]]
- [[Timeout]]
- [[Circuit Breaker]]

## Referencias
- Google — Rate limiting strategies
- NGINX — Rate limiting
