---
doc: pattern
area: Patrones
level: intermedio
tags:
  - anti-pattern
  - global-state
  - maintainability
aliases:
  - Estado global
  - Variables globales
  - Singleton abuse
related:
  - Singleton
  - Service Locator
  - Dependency Injection
refs:
  - https://martinfowler.com/bliki/GlobalState.html
  - Clean Code (Robert C. Martin)
sticker: lucide//curly-braces
---

# Global State (anti-pattern)

## En una línea
Cuando múltiples partes del sistema comparten y modifican estado global (variables globales, singletons con estado, locators), el comportamiento se vuelve impredecible y difícil de testear.

## Problema
El estado global:
- Puede ser leído/escrito desde cualquier parte
- No tiene “dueño” claro
- Hace que el orden de ejecución importe (bugs fantasmas)

Señales típicas:
- Bugs que “desaparecen” si reinicias
- Tests que fallan solo cuando corres toda la suite
- Funciones/clases que dependen de cosas “mágicas” sin parámetros
- Mucho uso de `static`, `global`, `singleton.getInstance()` con estado mutable

## Por qué es peligroso
- Acoplamiento invisible: nadie sabe quién modifica qué
- Concurrencia: condiciones de carrera (race conditions)
- Difícil reproducir: el estado depende del historial de ejecución
- Tests frágiles: el estado se filtra entre tests

## Cuándo puede ser aceptable (con límites)
- Constantes y configuración inmutable (read-only)
- Cache global estrictamente controlada (y testeable)
- Feature flags si son inmutables por request/context

## Alternativas recomendadas
- Pasar estado explícito por parámetros (o por contexto)
- Diseñar componentes “puros” (funciones sin side effects)
- [[Dependency Injection]] para dependencias
- Estado por request/session (no global)
- Inmutabilidad (copias, reducers, etc.)

## Ejemplo mínimo

Mal (estado global mutable)
```ts
export const state = { count: 0 };

export function inc() {
  state.count++;
}
```

Mejor (estado explícito)
```ts
export function inc(count: number) {
  return count + 1;
}
```

Mejor (estado encapsulado con dueño)
```ts
export class Counter {
  private count = 0;
  inc() { this.count++; }
  value() { return this.count; }
}
```

## Errores comunes
- Confundir “global” con “compartido” (compartir no requiere global)
- Meter lógica de negocio en singletons
- Usar Service Locator para todo
- “Arreglar” bugs reseteando estado global en vez de diseñar mejor

## Checklist de mitigación
- [ ] ¿Este estado puede ser inmutable?
- [ ] ¿Quién es el dueño y quién puede modificarlo?
- [ ] ¿Cómo se resetea/aisla en tests?
- [ ] ¿Se puede pasar como parámetro/contexto en vez de global?

## Relacionado
- [[Singleton]] (cuando tiene estado mutable)
- [[Service Locator]] (facilita estado global)
- [[Dependency Injection]] (reduce estado global)

## Referencias
- Martin Fowler — Global State
- Clean Code — Robert C. Martin
