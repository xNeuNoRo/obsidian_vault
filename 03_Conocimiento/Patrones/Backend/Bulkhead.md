---
doc: pattern
area: Patrones
level: avanzado
tags:
  - pattern
  - resilience
  - bulkhead
  - concurrency
aliases:
  - Resource Isolation
  - Pool Isolation
related:
  - Timeout
  - Circuit Breaker
  - Rate Limiting
refs:
  - https://learn.microsoft.com/azure/architecture/patterns/bulkhead
sticker: lucide//curly-braces
---

# Bulkhead

## En una línea
Aísla recursos (conexiones, threads, colas, concurrencia) por tipo de trabajo para que un área saturada no tumbe todo el sistema.

## Problema
Un endpoint caro puede consumir todo:
- pool de DB
- conexiones a un tercero
- CPU/concurrencia

Y entonces hasta endpoints “baratos” se caen por falta de recursos.

Señales típicas:
- Un solo endpoint en pico hace caer toda la API
- Saturación de DB pool por una ruta
- Timeouts masivos aunque algunas rutas no son pesadas

## Solución
Particiona recursos:
- pools separados
- límites de concurrencia por ruta
- colas separadas por tipo (prioridad)

Idea: “compartimentos del barco”; si uno se inunda, el resto sigue.

## Cuándo usar
- Rutas con cargas muy diferentes
- Dependencias externas lentas
- Background jobs + API en el mismo servicio

## Cuándo NO usar
- Sistemas pequeños donde un límite global basta
- Si aún no mides: sin métricas puedes “aislar mal”

## Trade-offs
Pros
- Evita colapsos en cascada
- Aísla latencia
- Te da control fino por área

Contras
- Config más compleja (límites por ruta)
- Riesgo de subutilizar recursos si particionas demasiado

## Variantes / alternativas
- Semáforos de concurrencia por ruta
- Pools separados (DB pool A para lecturas, pool B para writes)
- Queue por prioridad (high/low)

## Ejemplo mínimo

Semáforo de concurrencia por endpoint (TS)
```ts
class Semaphore {
  private permits: number;
  private queue: Array<() => void> = [];
  constructor(permits: number) { this.permits = permits; }

  async acquire() {
    if (this.permits > 0) { this.permits--; return; }
    await new Promise<void>(res => this.queue.push(res));
    this.permits--;
  }

  release() {
    this.permits++;
    const next = this.queue.shift();
    if (next) next();
  }
}

const heavySem = new Semaphore(5);   // máximo 5 requests pesadas simultáneas
const normalSem = new Semaphore(50); // normal
```

Express (bulkhead por ruta)
```ts
function withSemaphore(sem: Semaphore) {
  return async (req: any, res: any, next: any) => {
    await sem.acquire();
    res.on("finish", () => sem.release());
    res.on("close", () => sem.release());
    next();
  };
}

app.get("/reports/heavy", withSemaphore(heavySem), heavyReportHandler);
app.get("/users", withSemaphore(normalSem), usersHandler);
```

## Errores comunes
- No liberar el semáforo en errores/cancelaciones
- Poner límites sin medir (bloqueas demasiado)
- Mezclarlo con retry agresivo (te saturas tú mismo)

## Checklist de implementación
- [ ] ¿Identificaste rutas “heavy” vs “normal”?
- [ ] ¿Hay límites por ruta/dependencia?
- [ ] ¿Liberas recursos siempre (finish/close/error)?
- [ ] ¿Tienes métricas de saturación (queue length, wait time)?
- [ ] ¿Fallback cuando está saturado (429/503)?

## Relacionado
- [[Rate Limiting]]
- [[Timeout]]
- [[Circuit Breaker]]

## Referencias
- Microsoft — Bulkhead pattern
