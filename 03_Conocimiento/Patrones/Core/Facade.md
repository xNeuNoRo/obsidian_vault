---
doc: pattern
area: Patrones
level: intermedio
tags:
  - pattern
  - structural
  - facade
aliases:
  - API simplificada
  - Subsystem wrapper
related:
  - Adapter
  - Decorator
  - Service Locator
refs:
  - GoF Design Patterns
  - https://refactoring.guru/design-patterns/facade
sticker: lucide//curly-braces
---

# Facade

## En una línea
Provee una interfaz simple/unificada para un subsistema complejo.

## Problema
Tienes un subsistema con muchas piezas:
- Auth: tokens, refresh, storage, sesiones, permisos
- Infra: cache, db, queue, logger, metrics
- Video/Audio: codecs, buffers, devices, pipelines

Señales típicas:
- Para hacer una tarea simple necesitas llamar 6 clases distintas
- El cliente conoce demasiados detalles internos
- Los cambios internos rompen a muchos clientes

## Solución
- Creas una clase “Facade” que expone operaciones de alto nivel
- La Facade coordina internamente las dependencias
- El cliente usa la Facade y no conoce (ni necesita conocer) el detalle

Importante: Facade no impide el acceso al subsistema; solo ofrece un camino simple.

## Cuándo usar
- Para simplificar “casos de uso” o flujos frecuentes
- Para “boundary” entre capas (UI → servicios)
- Para librerías internas (API estable para el equipo)

## Cuándo NO usar
- Si solo estás escondiendo mala arquitectura
- Si la Facade se vuelve “God object” con 200 métodos
- Si necesitas extensibilidad fina (quizás mejor DI + servicios más pequeños)

## Trade-offs
Pros
- Reduce complejidad para el consumidor
- Menos acoplamiento a detalles internos
- API más estable

Contras
- Puede crecer demasiado
- Puede ocultar opciones avanzadas (hay que permitir bypass)
- Si mezcla lógica de negocio, se vuelve inmanejable

## Variantes / alternativas
- Facade por módulo (AuthFacade, PaymentsFacade, etc.)
- [[Adapter]] si el objetivo es compatibilidad de interfaces
- [[Decorator]] si quieres añadir comportamiento a una interfaz existente

## Ejemplo mínimo

Subsistema (simplificado)
```ts
class TokenService { issue() { return "token"; } }
class SessionStore { save(_t: string) {} }
class AuditLog { log(_msg: string) {} }
class Permissions { check(_u: string) { return true; } }
```

Facade
```ts
class AuthFacade {
  constructor(
    private tokens: TokenService,
    private sessions: SessionStore,
    private audit: AuditLog,
    private perms: Permissions,
  ) {}

  login(userId: string) {
    if (!this.perms.check(userId)) throw new Error("Forbidden");
    const token = this.tokens.issue();
    this.sessions.save(token);
    this.audit.log(`login:${userId}`);
    return token;
  }
}
```

## Errores comunes
- Hacer una Facade “general” para todo (God object)
- Poner lógica de negocio compleja (debe coordinar, no decidir reglas profundas)
- No ofrecer salida para casos avanzados (a veces el cliente necesita acceso directo)

## Checklist de implementación
- [ ] ¿La Facade cubre los flujos más comunes?
- [ ] ¿Sus métodos son de alto nivel (casos de uso)?
- [ ] ¿No estás metiendo todo el sistema en una sola clase?
- [ ] ¿El cliente queda desacoplado del subsistema?

## Relacionado
- [[Adapter]]
- [[Decorator]]
- [[Service Locator]]

## Referencias
- GoF — Facade
- Refactoring Guru — Facade
