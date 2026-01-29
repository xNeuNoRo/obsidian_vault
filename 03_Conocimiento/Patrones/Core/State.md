---
doc: pattern
area: Patrones
level: intermedio
tags:
  - pattern
  - behavioral
  - state
aliases:
  - State Machine (OO)
  - FSM Pattern
related:
  - Strategy
  - Chain of Responsibility
refs:
  - GoF Design Patterns
  - https://refactoring.guru/design-patterns/state
sticker: lucide//curly-braces
---

# State

## En una línea
Permite que un objeto cambie su comportamiento cuando cambia su estado interno, delegando la lógica a objetos-estado en vez de if/else gigantes.

## Problema
Tienes un flujo con estados claros:
- Pedido: Created → Paid → Shipped → Delivered → Cancelled
- Autenticación: LoggedOut → LoggedIn → Suspended
- UI: Idle → Loading → Error → Ready

Señales típicas:
- `switch(state)` en muchos métodos
- Reglas del estado esparcidas por todo el código
- Cambiar un estado rompe muchas ramas

## Solución
- Definir interfaz `State` con operaciones
- Cada estado implementa comportamiento
- El “Context” guarda el estado actual y delega
- Transiciones se hacen desde estados (o desde el context, según preferencia)

## Cuándo usar
- Cuando hay una máquina de estados real
- Cuando el comportamiento depende fuerte del estado
- Cuando quieres transiciones explícitas y mantenibles

## Cuándo NO usar
- Si son 2 estados simples y no crecerán
- Si el estado es solo “dato” y no cambia comportamiento
- Si te basta una FSM declarativa (tabla) más simple

## Trade-offs
Pros
- Reduce condicionales
- Transiciones claras
- Cada estado es testeable

Contras
- Más clases/archivos
- Puede complicar si hay demasiados estados
- Debugging: salto entre objetos

## Variantes / alternativas
- FSM declarativa (tabla de transiciones)
- [[Strategy]] si no es “estado” sino “algoritmo elegible”
- Reducers (estilo Redux) si te gusta enfoque funcional

## Ejemplo mínimo

Pedido con estados
```ts
type OrderStatus = "Created" | "Paid" | "Shipped" | "Cancelled";

interface OrderState {
  pay(ctx: Order): void;
  ship(ctx: Order): void;
  cancel(ctx: Order): void;
  name: OrderStatus;
}

class Order {
  state: OrderState;
  constructor() { this.state = new CreatedState(); }
  pay() { this.state.pay(this); }
  ship() { this.state.ship(this); }
  cancel() { this.state.cancel(this); }
}

class CreatedState implements OrderState {
  name: OrderStatus = "Created";
  pay(ctx: Order) { ctx.state = new PaidState(); }
  ship() { throw new Error("Cannot ship before pay"); }
  cancel(ctx: Order) { ctx.state = new CancelledState(); }
}

class PaidState implements OrderState {
  name: OrderStatus = "Paid";
  pay() { throw new Error("Already paid"); }
  ship(ctx: Order) { ctx.state = new ShippedState(); }
  cancel(ctx: Order) { ctx.state = new CancelledState(); }
}

class ShippedState implements OrderState {
  name: OrderStatus = "Shipped";
  pay() { throw new Error("Already shipped"); }
  ship() { throw new Error("Already shipped"); }
  cancel() { throw new Error("Cannot cancel after shipped"); }
}

class CancelledState implements OrderState {
  name: OrderStatus = "Cancelled";
  pay() { throw new Error("Cancelled"); }
  ship() { throw new Error("Cancelled"); }
  cancel() { /* no-op */ }
}
```

## Errores comunes
- Estados con demasiada lógica duplicada (revisar diseño)
- Transiciones escondidas (difícil entender flujo)
- No validar transiciones (bugs)
- Mezclar State con Strategy sin claridad

## Checklist de implementación
- [ ] ¿Tengo estados y transiciones claras?
- [ ] ¿Las reglas dependen del estado?
- [ ] ¿Cada estado tiene responsabilidad limitada?
- [ ] ¿Transiciones y errores están definidos?

## Relacionado
- [[Strategy]]
- [[Chain of Responsibility]]

## Referencias
- GoF — State
- Refactoring Guru — State
