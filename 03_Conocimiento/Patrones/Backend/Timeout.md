---
doc: pattern
area: Patrones
level: intermedio
tags:
  - pattern
  - resilience
  - timeout
aliases:
  - Deadline
  - Request timeout
related:
  - Retry Backoff
  - Circuit Breaker
  - Bulkhead
refs:
  - https://aws.amazon.com/builders-library/timeouts-retries-and-backoff-with-jitter/
  - https://developer.mozilla.org/en-US/docs/Web/API/AbortController
sticker: lucide//curly-braces
---

# Timeout

## En una línea
Límite de tiempo explícito para una operación (HTTP/DB/IO) para evitar que tu app se quede colgada esperando algo que quizás nunca llegue.

## Problema
En backend, **esperar indefinidamente** es mortal:
- Conexiones quedan ocupadas
- Threads/event loop quedan con trabajo pendiente
- Se acumulan requests y “se cae todo” (cascading failure)

Señales típicas:
- Requests que se quedan “en loading” mucho tiempo
- Picos de latencia y luego timeouts masivos
- El servicio remoto está lento y tu API también se vuelve lenta

## Solución
- Define un timeout por operación (HTTP call, query DB, etc.)
- Asegúrate de **cancelar** si se puede (AbortController / drivers DB)
- Trata el timeout como error “transitorio” (normalmente combina con Retry y Circuit Breaker)

Regla práctica:
- Timeout debe ser **más corto** que el timeout del cliente y balanceado con SLAs.

## Cuándo usar
- Siempre que llames a un servicio externo
- Queries a DB (especialmente pesadas)
- Procesos de IO (S3, FS, colas)

## Cuándo NO usar
- Casi nunca es “no usar”; lo que cambia es el valor y política
- Solo evita timeouts absurdamente cortos que rompan UX

## Trade-offs
Pros
- Evita requests colgados
- Mejora estabilidad general
- Permite degradación controlada

Contras
- Si lo pones muy bajo, fallas por “falsos timeouts”
- Requiere decidir política: retry, fallback, error al usuario

## Variantes / alternativas
- Timeout por capa: HTTP client, DB, internal services
- “Deadline propagation” (pasar el timeout restante a dependencias)
- Alternativa: “cortar por Circuit Breaker” cuando está abierto

## Ejemplo mínimo

TypeScript (timeout para fetch con AbortController)
```ts
export async function fetchWithTimeout(url: string, ms: number) {
  const ctrl = new AbortController();
  const id = setTimeout(() => ctrl.abort(), ms);

  try {
    const res = await fetch(url, { signal: ctrl.signal });
    return res;
  } finally {
    clearTimeout(id);
  }
}
```

Express (usar y mapear a 504)
```ts
app.get("/users/:id", async (req, res) => {
  try {
    const r = await fetchWithTimeout(`https://api.x.com/users/${req.params.id}`, 2000);
    res.status(r.status).send(await r.text());
  } catch (e: any) {
    if (e?.name === "AbortError") return res.status(504).json({ error: "Upstream timeout" });
    return res.status(502).json({ error: "Upstream error" });
  }
});
```

## Errores comunes
- No cancelar la operación (timeout “lógico” pero la operación sigue consumiendo recursos)
- No instrumentar: no sabes cuántos timeouts ocurren
- Timeouts inconsistentes entre servicios (uno espera 30s, otro 2s)

## Checklist de implementación
- [ ] ¿Cada llamada externa tiene timeout?
- [ ] ¿El timeout cancela de verdad (si es posible)?
- [ ] ¿Se reporta como métrica (timeouts/sec)?
- [ ] ¿Existe policy: retry/fallback/circuit-breaker?
- [ ] ¿Está alineado con SLAs?

## Relacionado
- [[Retry Backoff]]
- [[Circuit Breaker]]
- [[Bulkhead]]

## Referencias
- AWS Builders Library — Timeouts, retries and backoff
- MDN — AbortController
