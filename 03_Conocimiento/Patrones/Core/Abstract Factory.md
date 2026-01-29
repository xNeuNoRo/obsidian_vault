---
doc: pattern
area: Patrones
level: avanzado
tags:
  - pattern
  - creational
  - abstract-factory
aliases:
  - Kit
  - Factory of Factories
related:
  - Factory Method
  - Strategy
  - Dependency Injection
refs:
  - GoF Design Patterns
  - https://refactoring.guru/design-patterns/abstract-factory
sticker: lucide//curly-braces
---

# Abstract Factory

## En una línea
Provee una interfaz para crear familias de objetos relacionados (compatibles entre sí) sin especificar sus clases concretas.

## Problema
Tienes “familias” de componentes que deben combinar bien:
- UI: botones + inputs “Light” vs “Dark”
- Persistencia: repos + transactions “Postgres” vs “Mongo”
- Infra: storage + queue “AWS” vs “GCP”

Señales típicas:
- Muchos `if/else` para decidir qué implementación usar en varios lugares
- Riesgo de mezclar objetos incompatibles (ej: `AwsStorage` con `GcpQueue`)
- Agregar una nueva familia requiere tocar muchas partes

## Solución
- Definir una interfaz “fábrica abstracta” que crea cada producto de la familia
- Implementar una fábrica concreta por familia
- El cliente usa la fábrica para crear todo el set compatible

Idea clave: si cambias de familia, cambias **la fábrica**, no todo el código.

## Cuándo usar
- Cuando necesitas garantizar compatibilidad entre objetos relacionados
- Cuando el sistema debe soportar múltiples “plataformas”/variantes completas
- Cuando quieres que cambiar de proveedor sea reemplazar un módulo

## Cuándo NO usar
- Si solo creas 1–2 objetos sueltos (Factory Method basta)
- Si no hay familias reales (solo un switch pequeño)
- Si la estructura te complica más de lo que te ayuda

## Trade-offs
Pros
- Evita mezclar implementaciones incompatibles
- Centraliza creación por familia
- Facilita agregar nuevas familias (nuevo módulo/fábrica)

Contras
- Aumenta cantidad de interfaces/clases
- Si agregas “un nuevo producto” a la familia, debes tocar todas las fábricas
- Puede ser overkill en apps pequeñas

## Variantes / alternativas
- Combinar con Factory Method (cada método de la abstract factory puede ser un factory method)
- Usar DI: seleccionar una fábrica concreta en el composition root
- Alternativa simple: “registry” por familia (si no quieres tantas clases)

## Ejemplo mínimo

Caso: Notificaciones por proveedor (familia compatible)
- AWS: `AwsQueue` + `AwsMailer`
- GCP: `GcpQueue` + `GcpMailer`

TypeScript (productos)
```ts
interface Queue {
  publish(topic: string, payload: unknown): Promise<void>;
}

interface Mailer {
  send(to: string, subject: string, body: string): Promise<void>;
}
```

TypeScript (Abstract Factory)
```ts
interface InfraFactory {
  createQueue(): Queue;
  createMailer(): Mailer;
}
```

TypeScript (familias concretas)
```ts
class AwsQueue implements Queue {
  async publish(topic: string, payload: unknown) { /* ... */ }
}

class AwsMailer implements Mailer {
  async send(to: string, subject: string, body: string) { /* ... */ }
}

class AwsInfraFactory implements InfraFactory {
  createQueue(): Queue { return new AwsQueue(); }
  createMailer(): Mailer { return new AwsMailer(); }
}

class GcpQueue implements Queue {
  async publish(topic: string, payload: unknown) { /* ... */ }
}

class GcpMailer implements Mailer {
  async send(to: string, subject: string, body: string) { /* ... */ }
}

class GcpInfraFactory implements InfraFactory {
  createQueue(): Queue { return new GcpQueue(); }
  createMailer(): Mailer { return new GcpMailer(); }
}
```

TypeScript (cliente: garantiza compatibilidad)
```ts
class NotificationService {
  private queue: Queue;
  private mailer: Mailer;

  constructor(factory: InfraFactory) {
    this.queue = factory.createQueue();
    this.mailer = factory.createMailer();
  }

  async notify(to: string, msg: string) {
    await this.queue.publish("notify", { to, msg });
    await this.mailer.send(to, "Notificación", msg);
  }
}

// composition root
const provider = "aws"; // o config/env
const factory: InfraFactory = provider === "aws"
  ? new AwsInfraFactory()
  : new GcpInfraFactory();

const svc = new NotificationService(factory);
```

## Errores comunes
- Usarlo cuando solo necesitas crear 1 objeto (mejor Factory Method)
- Mezclar familias “a mano” ignorando la factory (pierdes el beneficio)
- Meter lógica de negocio dentro de la factory (debe ser creación/config)
- Agregar productos a la familia sin plan (rompe todas las fábricas)

## Checklist de implementación
- [ ] ¿Tengo una familia real de objetos relacionados?
- [ ] ¿Necesito prevenir combinaciones incompatibles?
- [ ] ¿Selecciono la fábrica en un solo lugar (composition root)?
- [ ] ¿Cada fábrica concreta crea un set completo y coherente?

## Relacionado
- [[Factory Method]] (a menudo dentro de Abstract Factory)
- [[Strategy]] (seleccionar la fábrica es una estrategia)
- [[Dependency Injection]] (inyectar la fábrica concreta)
- [[Singleton]] (fábrica única por app: cuidado con global state)

## Referencias
- GoF — Design Patterns (Abstract Factory)
- Refactoring Guru — Abstract Factory
