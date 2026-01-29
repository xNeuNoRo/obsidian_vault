---
doc: pattern
area: Patrones
level: intermedio
tags:
  - pattern
  - behavioral
  - chain-of-responsibility
  - pipeline
aliases:
  - Pipeline
  - Middleware Chain
related:
  - Command
  - Observer
refs:
  - GoF Design Patterns
  - https://refactoring.guru/design-patterns/chain-of-responsibility
sticker: lucide//curly-braces
---

# Chain of Responsibility

## En una línea
Pasa una petición a lo largo de una cadena de handlers; cada handler decide si la procesa, la transforma, o la pasa al siguiente.

## Problema
Tienes un flujo con pasos:
- Validación
- Autenticación
- Autorización
- Normalización
- Logging
- Transformación
- Manejo de errores

Señales típicas:
- Un método gigante con muchos pasos
- Quieres reordenar o activar/desactivar pasos
- Muchas condiciones para “si aplica este paso…”

## Solución
- Cada handler implementa una interfaz `handle(req, next)`
- Los handlers se encadenan
- Cada handler puede:
  - detener (rechazar)
  - modificar el request/response
  - continuar (`next()`)

Este patrón es la base de “middleware” en web frameworks.

## Cuándo usar
- Pipelines (HTTP middlewares)
- Procesamiento por etapas (validaciones, filtros)
- Sistemas de logging/tracing/metrics como capa

## Cuándo NO usar
- Si el flujo es fijo y simple (llamada directa)
- Si la cadena se vuelve demasiado dinámica e impredecible
- Si el debugging se vuelve imposible (falta observabilidad)

## Trade-offs
Pros
- Modularidad: pasos pequeños
- Reordenable y configurable
- Reutilizable

Contras
- Debugging: difícil saber dónde se detuvo
- Overhead de muchas capas
- Riesgo de handlers con side effects inesperados

## Variantes / alternativas
- Pipeline funcional (lista de funciones)
- Command (acciones discretas)
- Observer (notificación, no pipeline)

## Ejemplo mínimo

Middleware chain (TypeScript)
```ts
type Req = { userId?: string; token?: string; body?: any; };
type Res = { status: number; body: any; };

type Next = () => Promise<Res>;
type Handler = (req: Req, next: Next) => Promise<Res>;

function compose(handlers: Handler[]): (req: Req) => Promise<Res> {
  return (req) => {
    let i = -1;
    const dispatch = async (idx: number): Promise<Res> => {
      if (idx <= i) throw new Error("next() called multiple times");
      i = idx;
      const h = handlers[idx];
      if (!h) return { status: 200, body: "OK" };
      return h(req, () => dispatch(idx + 1));
    };
    return dispatch(0);
  };
}

// handlers
const auth: Handler = async (req, next) => {
  if (!req.token) return { status: 401, body: "No token" };
  req.userId = "u1";
  return next();
};

const validate: Handler = async (req, next) => {
  if (!req.body) return { status: 400, body: "No body" };
  return next();
};

const app = compose([auth, validate]);
```

## Errores comunes
- Handler que llama next() dos veces
- Handler que “se traga” errores sin política
- No instrumentar la cadena (logs/tracing)

## Checklist de implementación
- [ ] ¿Cada handler es pequeño y enfocado?
- [ ] ¿Está claro cuándo detener la cadena?
- [ ] ¿Hay trazabilidad de dónde falla?
- [ ] ¿Orden documentado?

## Relacionado
- [[Command]]
- [[Observer]]

## Referencias
- GoF — Chain of Responsibility
- Refactoring Guru — Chain of Responsibility
