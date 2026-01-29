---
doc: pattern
area: Patrones
level: intermedio
tags:
  - pattern
  - behavioral
  - command
aliases:
  - Action Object
  - Request as Object
related:
  - Chain of Responsibility
  - Undo/Redo
  - Strategy
refs:
  - GoF Design Patterns
  - https://refactoring.guru/design-patterns/command
sticker: lucide//curly-braces
---

# Command

## En una línea
Encapsula una acción (request) como objeto: qué hacer, con qué datos y (opcionalmente) cómo deshacerlo.

## Problema
Necesitas tratar acciones como datos:
- Encolar acciones (jobs)
- Registrar historial (audit)
- Undo/redo
- Reintentar comandos
- Macro commands (secuencia de acciones)

Señales típicas:
- Acciones como funciones sueltas sin contexto/metadata
- Switch por “tipo de acción”
- Duplicación para logging/audit/retry alrededor de acciones

## Solución
- Interfaz `Command` con `execute()`
- Cada comando representa una acción concreta y conoce sus parámetros
- Un “Invoker” ejecuta comandos (UI, scheduler, queue)
- Opcional: `undo()` si aplica

## Cuándo usar
- Sistemas con cola de trabajos
- UI con undo/redo
- Orquestación: ejecutar comandos con políticas (retry, logging)

## Cuándo NO usar
- Si es una acción simple y jamás necesitarás tratarla como objeto
- Si introduces 50 clases comando sin razón
- Si las acciones dependen de demasiado contexto global (revisar arquitectura)

## Trade-offs
Pros
- Separación: invoker no conoce detalles
- Permite cola, logs, retry, undo
- Fácil componer comandos

Contras
- Más clases/estructura
- Puede duplicar “DTOs” de parámetros si no diseñas bien
- Si el comando hace demasiadas cosas, se vuelve “mini God object”

## Variantes / alternativas
- Commands como funciones (en TS, a veces basta)
- [[Chain of Responsibility]] para pipeline de handlers
- [[Strategy]] si lo que cambias es el algoritmo, no la acción como entidad

## Ejemplo mínimo

Command + Invoker (job queue)
```ts
interface Command {
  name: string;
  execute(): Promise<void>;
}

class SendWelcomeEmail implements Command {
  name = "SendWelcomeEmail";
  constructor(private email: string, private mailer: { send: (to: string) => Promise<void> }) {}

  async execute() {
    await this.mailer.send(this.email);
  }
}

class CommandQueue {
  private q: Command[] = [];
  enqueue(cmd: Command) { this.q.push(cmd); }

  async runAll() {
    for (const cmd of this.q) {
      console.log("running:", cmd.name);
      await cmd.execute();
    }
  }
}
```

Undo (idea)
```ts
interface UndoableCommand extends Command {
  undo(): Promise<void>;
}
```

## Errores comunes
- Command con demasiada lógica de negocio (debe ser “acción” enfocada)
- No separar validación/ejecución (si necesitas, usa pipeline)
- No registrar metadata (idempotency, correlationId) cuando lo necesitas

## Checklist de implementación
- [ ] ¿Necesito encolar/loggear/reintentar/undo?
- [ ] ¿Cada command es pequeño y enfocado?
- [ ] ¿El invoker no depende de implementaciones concretas?
- [ ] ¿Tienes metadata para tracing/audit si aplica?

## Relacionado
- [[Chain of Responsibility]]
- [[Strategy]]
- [[Retry/Backoff]] (policy alrededor de execute)

## Referencias
- GoF — Command
- Refactoring Guru — Command
