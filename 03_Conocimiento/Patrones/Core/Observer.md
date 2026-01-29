---
doc: pattern
area: Patrones
level: intermedio
tags:
  - pattern
  - behavioral
  - observer
  - pubsub
aliases:
  - Publish-Subscribe (local)
  - Event Listener
related:
  - Mediator
  - Chain of Responsibility
  - Global State (anti-pattern)
refs:
  - GoF Design Patterns
  - https://refactoring.guru/design-patterns/observer
sticker: lucide//curly-braces
---

# Observer

## En una línea
Un objeto (Subject) notifica automáticamente a otros (Observers) cuando cambia su estado, sin acoplarse a implementaciones concretas.

## Problema
Necesitas reaccionar a cambios en un componente desde varios lugares:
- UI que se actualiza cuando cambia el modelo
- Módulos que escuchan eventos (login, pago, actualización)
- Notificar a múltiples “interesados” cuando algo sucede

Señales típicas:
- Muchas dependencias directas: `A` conoce a `B`, `C`, `D` para avisarles
- Código con llamadas manuales repetidas: `updateX(); updateY(); updateZ();`
- Agregar un nuevo “receptor” implica modificar el Subject

## Solución
- El Subject mantiene una lista de observers (suscriptores)
- Provee `subscribe()` y `unsubscribe()`
- Cuando ocurre un evento, ejecuta `notify()` y llama a cada observer

Punto clave: el Subject no necesita saber “quiénes son” ni “qué hacen”, solo dispara notificaciones.

## Cuándo usar
- Cambios en estado que deben reflejarse en múltiples módulos
- Sistemas event-driven dentro de una app (no necesariamente microservicios)
- Plugins/extensiones: consumidores variables

## Cuándo NO usar
- Si hay solo 1 consumidor fijo (llamada directa es más simple)
- Si el flujo se vuelve difícil de seguir (eventos excesivos)
- Si terminas con “event spaghetti” (miles de eventos sin contrato)

## Trade-offs
Pros
- Bajo acoplamiento (Subject no conoce observers concretos)
- Agregar/quitar listeners sin modificar el Subject
- Fácil extensión

Contras
- Difícil rastrear flujo (¿quién reacciona a qué?)
- Riesgo de memory leaks si no haces unsubscribe
- Orden de notificación puede importar (bugs sutiles)
- Errores silenciosos si un listener falla (hay que decidir política)

## Variantes / alternativas
- “EventEmitter” (muy común en JS/TS)
- Observer con eventos tipados (mejor en TS)
- Alternativa: [[Mediator]] si necesitas coordinar interacciones complejas
- Alternativa: callbacks directos si es 1 a 1

## Ejemplo mínimo

TypeScript (EventEmitter tipado + unsubscribe)
```ts
type Events = {
  "user:login": { userId: string };
  "cart:updated": { items: number };
};

class Emitter<E extends Record<string, any>> {
  private listeners = new Map<keyof E, Set<(payload: any) => void>>();

  on<K extends keyof E>(event: K, fn: (payload: E[K]) => void) {
    const set = this.listeners.get(event) ?? new Set();
    set.add(fn as any);
    this.listeners.set(event, set);
    return () => this.off(event, fn); // unsubscribe handle
  }

  off<K extends keyof E>(event: K, fn: (payload: E[K]) => void) {
    this.listeners.get(event)?.delete(fn as any);
  }

  emit<K extends keyof E>(event: K, payload: E[K]) {
    for (const fn of this.listeners.get(event) ?? []) {
      try { (fn as any)(payload); } catch (e) { /* decide policy */ }
    }
  }
}

// uso
const bus = new Emitter<Events>();
const unsub = bus.on("user:login", ({ userId }) => console.log("Hola", userId));
bus.emit("user:login", { userId: "u1" });
unsub();
```

## Errores comunes
- No desuscribirse (leaks)
- Eventos sin contrato claro (payloads inconsistentes)
- Abusar de Observer para todo (difícil de debugear)
- Manejar errores sin política (un listener rompe a todos o se traga errores)

## Checklist de implementación
- [ ] ¿El evento tiene nombre y payload claro (contrato)?
- [ ] ¿Hay forma de unsubscribe?
- [ ] ¿Qué pasa si un listener falla?
- [ ] ¿Necesito orden determinista o no importa?
- [ ] ¿Estoy creando “event spaghetti”? (si sí, considerar Mediator o llamadas directas)

## Relacionado
- [[Mediator]]
- [[Chain of Responsibility]]
- [[Global State (anti-pattern)]]

## Referencias
- GoF — Observer
- Refactoring Guru — Observer
