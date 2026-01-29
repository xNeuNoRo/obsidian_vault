---
doc: pattern
area: Patrones
level: intermedio
tags:
  - pattern
  - behavioral
  - template-method
aliases:
  - Skeleton Algorithm
  - Plantilla de algoritmo
related:
  - Strategy
  - Factory Method
refs:
  - GoF Design Patterns
  - https://refactoring.guru/design-patterns/template-method
sticker: lucide//curly-braces
---

# Template Method

## En una línea
Define el esqueleto de un algoritmo en una clase base y deja que subclases reemplacen pasos específicos sin cambiar la estructura general.

## Problema
Tienes varios procesos parecidos con pequeñas diferencias:
- Validación + ejecución + logging
- Importación de archivos con distintos formatos
- Pipelines con pasos comunes y variantes

Señales típicas:
- Copia/pega de flujos muy similares
- Variaciones pequeñas pero repetidas
- Quieres asegurar un orden fijo de pasos

## Solución
- Clase base define el “template” (método final o principal)
- Pasos variables se definen como métodos protegidos/abstractos (“hooks”)
- Subclases implementan solo los hooks

Idea clave: variación por herencia (en Strategy, variación por composición).

## Cuándo usar
- Cuando el flujo general debe mantenerse igual siempre
- Cuando quieres controlar el orden y evitar que lo rompan
- Cuando hay pasos opcionales (hooks) y pasos obligatorios

## Cuándo NO usar
- Si necesitas cambiar el algoritmo en runtime (Strategy es mejor)
- Si las variaciones son muchas y combinables (herencia explota)
- Si tu jerarquía se vuelve gigante

## Trade-offs
Pros
- Reduce duplicación de código
- Garantiza el orden del algoritmo
- Extensible: agregas subclases para variantes

Contras
- Herencia: acopla subclases a la base
- Difícil combinar variantes (explosión de clases)
- Cambios en la base afectan a todos

## Variantes / alternativas
- Alternativa recomendada si quieres runtime: [[Strategy]]
- Factory Method a veces se usa como “hook” de creación dentro del template
- Alternativa moderna: composición + funciones/pipelines

## Ejemplo mínimo

Caso: importar archivos con pasos comunes y parse distinto.

TypeScript (Template Method con clases)
```ts
abstract class Importer {
  // template method
  async run(path: string) {
    const raw = await this.read(path);
    const data = this.parse(raw);      // hook obligatorio
    const valid = this.validate(data); // hook opcional
    if (!valid) throw new Error("Invalid data");
    await this.save(data);             // paso común
  }

  protected async read(path: string): Promise<string> {
    // simplificado
    return "file-content";
  }

  protected abstract parse(raw: string): unknown;

  protected validate(_data: unknown): boolean {
    return true; // hook opcional (por defecto)
  }

  protected async save(_data: unknown): Promise<void> {
    // guardar a DB, etc.
  }
}

class CsvImporter extends Importer {
  protected parse(raw: string) {
    return raw.split("\n").map(line => line.split(","));
  }
}

class JsonImporter extends Importer {
  protected parse(raw: string) {
    return JSON.parse(raw);
  }

  protected validate(data: unknown) {
    return data != null;
  }
}
```

## Errores comunes
- Template Method con demasiados hooks (base se vuelve monstruo)
- Subclases que dependen de detalles internos de la base (fragilidad)
- Usarlo cuando en realidad necesitas Strategy (runtime)

## Checklist de implementación
- [ ] ¿El flujo general debe ser fijo?
- [ ] ¿Los pasos variables son pocos y claros?
- [ ] ¿La jerarquía de subclases no va a explotar?
- [ ] ¿Un Strategy sería más simple?

## Relacionado
- [[Strategy]] (alternativa por composición)
- [[Factory Method]] (hook de creación común)
- [[Dependency Injection]] (para inyectar partes sin herencia)

## Referencias
- GoF — Design Patterns (Template Method)
- Refactoring Guru — Template Method
