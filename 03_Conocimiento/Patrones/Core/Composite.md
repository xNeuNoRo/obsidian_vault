---
doc: pattern
area: Patrones
level: intermedio
tags:
  - pattern
  - structural
  - composite
aliases:
  - Tree Structure
  - Part-Whole
related:
  - Decorator
  - Visitor
refs:
  - GoF Design Patterns
  - https://refactoring.guru/design-patterns/composite
sticker: lucide//curly-braces
---

# Composite

## En una línea
Permite tratar objetos individuales y composiciones (grupos) de objetos de forma uniforme, ideal para estructuras en árbol.

## Problema
Tienes estructuras jerárquicas:
- Sistema de archivos: archivo/carpeta
- UI: componente/contendor
- Menús: item/submenu
- Organización: empleado/equipo

Señales típicas:
- Código con `if (isGroup) { ... } else { ... }` por todos lados
- Dos APIs separadas: una para “nodo” y otra para “grupo”
- Recorridos manuales repetidos

## Solución
- Definir una interfaz común `Component`
- “Leaf” implementa comportamiento base
- “Composite” contiene una lista de Components y delega/itera para ejecutar operación

## Cuándo usar
- Jerarquías tipo árbol
- Necesitas aplicar operaciones sobre hojas y grupos con la misma llamada

## Cuándo NO usar
- Si no hay jerarquía real
- Si forzar interfaz uniforme complica demasiado (composites muy distintos)

## Trade-offs
Pros
- API uniforme
- Simplifica recorridos
- Extensible (nuevos tipos de leaf/composite)

Contras
- Puede ser difícil restringir qué operaciones tienen sentido en leaf
- Debugging de árboles grandes
- Riesgo de API “demasiado genérica”

## Variantes / alternativas
- Visitor si necesitas muchas operaciones distintas sobre el árbol
- Iterator para recorridos avanzados
- Decorator si no es jerarquía, sino “capas”

## Ejemplo mínimo

Árbol de tareas con costo total
```ts
interface TaskNode {
  cost(): number;
  name(): string;
}

class Task implements TaskNode {
  constructor(private n: string, private c: number) {}
  cost() { return this.c; }
  name() { return this.n; }
}

class TaskGroup implements TaskNode {
  private children: TaskNode[] = [];
  constructor(private n: string) {}
  add(node: TaskNode) { this.children.push(node); return this; }
  cost() { return this.children.reduce((sum, n) => sum + n.cost(), 0); }
  name() { return this.n; }
}

// uso
const project = new TaskGroup("Proyecto")
  .add(new Task("Setup", 2))
  .add(new TaskGroup("MVP")
    .add(new Task("Login", 5))
    .add(new Task("Profile", 3))
  );

project.cost(); // suma total
```

## Errores comunes
- Permitir `add/remove` en Leaf (API confusa)
- Árbol con referencias cíclicas (stack overflow)
- Operaciones pesadas en cada nodo sin caching

## Checklist de implementación
- [ ] ¿La estructura es naturalmente jerárquica?
- [ ] ¿Operaciones sobre grupo y hoja tienen el mismo sentido?
- [ ] ¿Evitas ciclos?
- [ ] ¿Tienes métodos claros para construir el árbol?

## Relacionado
- [[Decorator]]
- [[Visitor]]

## Referencias
- GoF — Composite
- Refactoring Guru — Composite
