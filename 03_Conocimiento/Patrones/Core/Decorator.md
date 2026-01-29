---
doc: pattern
area: Patrones
level: intermedio
tags:
  - pattern
  - structural
  - decorator
aliases:
  - Wrapper con comportamiento
  - Composable behavior
related:
  - Proxy
  - Adapter
  - Facade
refs:
  - GoF Design Patterns
  - https://refactoring.guru/design-patterns/decorator
sticker: lucide//curly-braces
---

# Decorator

## En una línea
Añade responsabilidades/behaviors a un objeto dinámicamente envolviéndolo, sin modificar su clase ni crear muchas subclases.

## Problema
Quieres agregar funcionalidades transversales:
- Logging
- Caching
- Retry
- Metrics/Tracing
- Autorización
- Compresión/encriptación

Señales típicas:
- Subclases combinatorias: `ServiceWithLoggingAndCacheAndRetry`
- “Flags” por todos lados para activar/desactivar comportamiento
- Necesitas apilar comportamientos (cache + retry + metrics)

## Solución
- Definir una interfaz común (Component)
- Implementación base (ConcreteComponent)
- Decorators que implementan la misma interfaz y delegan al componente envuelto, añadiendo lógica antes/después

La magia: composición. Puedes encadenar decoradores.

## Cuándo usar
- Cross-cutting concerns (especialmente infra)
- Composición de comportamientos configurable
- Cuando quieres apilar responsabilidades sin herencia

## Cuándo NO usar
- Si el comportamiento depende fuertemente del estado interno (mejor refactor)
- Si la cadena se vuelve demasiado larga y difícil de entender
- Si el orden de decoradores es crítico y no está documentado

## Trade-offs
Pros
- Evita explosión de subclases
- Composición flexible
- Reutilizable: decoradores se aplican a múltiples componentes

Contras
- Debugging: múltiples capas
- Orden importa (cache antes de retry vs retry antes de cache)
- Puede esconder performance overhead (muchas capas)

## Variantes / alternativas
- Middleware pipeline (muy parecido en web frameworks)
- [[Proxy]] si el propósito principal es controlar acceso o lazy loading
- [[Adapter]] si el objetivo es cambiar interfaz

## Ejemplo mínimo

Contrato
```ts
interface UsersApi {
  getUser(id: string): Promise<{ id: string; name: string }>;
}
```

Implementación base
```ts
class HttpUsersApi implements UsersApi {
  async getUser(id: string) {
    // fetch real...
    return { id, name: "Alice" };
  }
}
```

Decorator: Logging
```ts
class LoggingUsersApi implements UsersApi {
  constructor(private inner: UsersApi) {}

  async getUser(id: string) {
    console.log("getUser", id);
    const res = await this.inner.getUser(id);
    console.log("done", id);
    return res;
  }
}
```

Decorator: Cache
```ts
class CachingUsersApi implements UsersApi {
  private cache = new Map<string, any>();
  constructor(private inner: UsersApi) {}

  async getUser(id: string) {
    if (this.cache.has(id)) return this.cache.get(id);
    const res = await this.inner.getUser(id);
    this.cache.set(id, res);
    return res;
  }
}
```

Composición
```ts
const api: UsersApi =
  new LoggingUsersApi(
    new CachingUsersApi(
      new HttpUsersApi()
    )
  );
```

## Errores comunes
- Poner demasiada lógica de negocio en decoradores (deben ser concerns transversales)
- No documentar el orden recomendado
- Decoradores con estado compartido mutable (bugs)
- Cache sin invalidación (clásico)

## Checklist de implementación
- [ ] ¿El comportamiento es transversal (logging/cache/metrics)?
- [ ] ¿El componente base queda simple?
- [ ] ¿El orden de decoradores está definido?
- [ ] ¿Tienes tests por decorador y por composición?

## Relacionado
- [[Proxy]]
- [[Adapter]]
- [[Facade]]

## Referencias
- GoF — Decorator
- Refactoring Guru — Decorator
