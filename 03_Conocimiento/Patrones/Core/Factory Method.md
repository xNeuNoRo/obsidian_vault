---
doc: pattern
area: Patrones
level: intermedio
tags:
  - pattern
  - creational
  - factory-method
aliases:
  - Virtual Constructor
related:
  - Abstract Factory
  - Dependency Injection
  - Strategy
refs:
  - GoF Design Patterns
  - https://refactoring.guru/design-patterns/factory-method
sticker: lucide//curly-braces
---

# Factory Method

## En una línea
Define un método para crear objetos, pero deja que la implementación decida qué clase concreta instanciar.

## Problema
Tienes código que necesita crear objetos, pero:
- No quieres acoplarte a clases concretas (`new X()`)
- La clase concreta depende de condiciones (env, config, tipo, versión)
- Quieres extender comportamientos sin editar el código viejo (Open/Closed)

Señales típicas:
- `switch/case` grande para decidir qué clase construir
- Mucho `new` disperso
- Si agregas un tipo nuevo, tienes que modificar muchos lugares

## Solución
En vez de crear objetos directamente, defines un método fábrica:
- El cliente llama al método (no usa `new` directo)
- La implementación decide qué crear
- El cliente trabaja contra una interfaz/base común

## Cuándo usar
- Cuando la creación cambia según entorno/config
- Cuando quieres añadir nuevos “tipos” sin tocar el cliente
- Cuando quieres testear sustituyendo la creación

## Cuándo NO usar
- Si solo tienes 1 tipo y jamás cambiará
- Si la creación es trivial y no aporta encapsularla

## Trade-offs
Pros
- Reduce acoplamiento a clases concretas
- Centraliza la lógica de creación
- Facilita extender nuevos tipos

Contras
- Más estructura/clases
- Puede ser overkill si no hay variación real

## Variantes / alternativas
- Simple Factory: una función que crea según un parámetro (útil, pero no es el GoF formal)
- Abstract Factory: crea familias completas de objetos relacionados
- Alternativa: DI y mover la decisión al composition root

## Ejemplo mínimo

TypeScript (problema: creación “hardcodeada”)
```ts
interface Notifier {
  send(msg: string): void;
}

class EmailNotifier implements Notifier {
  send(msg: string) {
    console.log("EMAIL:", msg);
  }
}

class SmsNotifier implements Notifier {
  send(msg: string) {
    console.log("SMS:", msg);
  }
}

class App {
  constructor(private type: "email" | "sms") {}

  run() {
    // acoplado: decide y crea aquí
    const notifier = this.type === "email"
      ? new EmailNotifier()
      : new SmsNotifier();

    notifier.send("Hola");
  }
}
```

TypeScript (Factory Method)
```ts
interface Notifier {
  send(msg: string): void;
}

class EmailNotifier implements Notifier {
  send(msg: string) {
    console.log("EMAIL:", msg);
  }
}

class SmsNotifier implements Notifier {
  send(msg: string) {
    console.log("SMS:", msg);
  }
}

abstract class NotifierCreator {
  abstract createNotifier(): Notifier;

  notify(msg: string) {
    const notifier = this.createNotifier();
    notifier.send(msg);
  }
}

class EmailCreator extends NotifierCreator {
  createNotifier(): Notifier {
    return new EmailNotifier();
  }
}

class SmsCreator extends NotifierCreator {
  createNotifier(): Notifier {
    return new SmsNotifier();
  }
}

// uso
new EmailCreator().notify("Hola");
new SmsCreator().notify("Hola");
```

## Errores comunes
- Confundir Factory Method con “cualquier función factory”
- Hacer factories gigantes con if/switch interminables (mejor DI o registry)
- Crear clases factory sin necesidad real de variación

## Checklist de implementación
- [ ] ¿El cliente está desacoplado de clases concretas?
- [ ] ¿Agregar un nuevo tipo toca poco o nada del cliente?
- [ ] ¿La decisión de creación está concentrada y clara?
- [ ] ¿Tiene sentido vs DI + wiring?

## Relacionado
- [[Dependency Injection]]
- [[Abstract Factory]]
- [[Strategy]]
- [[Singleton]]

## Referencias
- GoF — Design Patterns (Factory Method)
- Refactoring Guru — Factory Method
