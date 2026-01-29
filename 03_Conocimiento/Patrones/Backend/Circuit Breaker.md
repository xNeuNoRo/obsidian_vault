---
doc: pattern
area: Patrones
level: avanzado
tags:
  - pattern
  - resilience
  - circuit-breaker
aliases:
  - Fail Fast Switch
  - Breaker
related:
  - Retry/Backoff
  - Timeout
  - Bulkhead
refs:
  - https://learn.microsoft.com/azure/architecture/patterns/circuit-breaker
  - https://martinfowler.com/bliki/CircuitBreaker.html
sticker: lucide//curly-braces
---

# Circuit Breaker

## En una línea
Si un servicio remoto está fallando mucho, el Circuit Breaker “corta” temporalmente las llamadas (fail fast) para evitar saturación y permitir recuperación.

## Problema
Cuando un servicio destino está degradado:
- Cada request falla o tarda demasiado
- Sigues intentando y empeoras el problema (colas, threads ocupados)
- Tu sistema completo se arrastra (cascading failure)

Señales típicas:
- Muchísimos timeouts en cadena
- Latencia sube en toda la app
- El servicio destino está “down” y tú sigues pegándole

## Solución
Circuit Breaker con estados:
- **Closed**: todo normal; se permiten requests
- **Open**: fallos exceden umbral; se bloquea y falla rápido
- **Half-Open**: tras un cooldown, se prueban pocas requests; si van bien, vuelve a Closed; si fallan, vuelve a Open

Debe combinarse con:
- Timeout (para no colgarte)
- (A veces) Retry/Backoff (pero con cuidado)
- Métricas/alerts

## Cuándo usar
- Dependencias remotas críticas (pagos, auth, terceros)
- Sistemas con riesgo de cascading failure
- Microservicios / APIs con alta concurrencia

## Cuándo NO usar
- Operaciones locales (no aporta)
- Si no tienes métricas/observabilidad (se vuelve “magia”)
- Si el “fail fast” rompe UX sin fallback

## Trade-offs
Pros
- Evita saturación y colapsos en cascada
- Mejora estabilidad global
- Recuperación más ordenada

Contras
- Puede bloquear llamadas “que quizá habrían funcionado”
- Requiere tuning (umbrales, ventanas)
- Necesita observabilidad y fallback

## Variantes / alternativas
- Circuit breaker por endpoint / por dependencia
- Sliding window de fallos
- Bulkhead para aislar recursos
- Fallback cache/cola (degrade gracefully)

## Ejemplo mínimo

Circuit Breaker simple (TypeScript)
```ts
type State = "CLOSED" | "OPEN" | "HALF_OPEN";

type BreakerOpts = {
  failureThreshold: number;     // ej: 5 fallos seguidos
  successThreshold: number;     // ej: 2 éxitos en half-open para cerrar
  cooldownMs: number;           // ej: 10_000
};

export class CircuitBreaker {
  private state: State = "CLOSED";
  private failures = 0;
  private successes = 0;
  private nextTry = 0;

  constructor(private opts: BreakerOpts) {}

  private now() { return Date.now(); }

  async exec<T>(fn: () => Promise<T>): Promise<T> {
    if (this.state === "OPEN") {
      if (this.now() < this.nextTry) throw new Error("CircuitOpen");
      this.state = "HALF_OPEN";
      this.successes = 0;
    }

    try {
      const res = await fn();
      this.onSuccess();
      return res;
    } catch (e) {
      this.onFailure();
      throw e;
    }
  }

  private onSuccess() {
    if (this.state === "HALF_OPEN") {
      this.successes++;
      if (this.successes >= this.opts.successThreshold) {
        this.state = "CLOSED";
        this.failures = 0;
      }
      return;
    }
    this.failures = 0;
  }

  private onFailure() {
    if (this.state === "HALF_OPEN") {
      this.trip();
      return;
    }
    this.failures++;
    if (this.failures >= this.opts.failureThreshold) this.trip();
  }

  private trip() {
    this.state = "OPEN";
    this.nextTry = this.now() + this.opts.cooldownMs;
  }
}

// uso
const breaker = new CircuitBreaker({ failureThreshold: 5, successThreshold: 2, cooldownMs: 10000 });
// await breaker.exec(() => fetchSomething());
```

## Errores comunes
- No usar timeout: se “cuelga” igual
- Umbrales mal ajustados (abre por cualquier cosa, o nunca abre)
- No tener fallback (UX mala)
- No instrumentar estados (no sabes cuándo abre/cierra)
- Mezclar retry agresivo con breaker (lo hace abrir más)

## Checklist de implementación
- [ ] ¿La llamada tiene timeout?
- [ ] ¿Qué errores cuentan como fallo?
- [ ] ¿Tienes fallback cuando está OPEN?
- [ ] ¿Tienes métricas: state, failures, open-count, latencia?
- [ ] ¿El breaker es por dependencia (no global para todo)?

## Relacionado
- [[Retry Backoff]]
- [[Timeout]]
- [[Bulkhead]]

## Referencias
- Martin Fowler — Circuit Breaker
- Microsoft — Circuit Breaker pattern
