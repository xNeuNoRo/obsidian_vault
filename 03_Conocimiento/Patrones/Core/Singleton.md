---
doc: pattern
area: Patrones
level: intro
tags:
  - pattern
  - creational
  - singleton
aliases:
  - Single Instance
related:
  - Factory
  - Dependency Injection
  - Service Locator
refs:
  - GoF Design Patterns
  - https://refactoring.guru/design-patterns/singleton
sticker: lucide//curly-braces
---

# Singleton

## En una línea
Garantiza que una clase tenga una única instancia y provee un punto global de acceso a ella.

## Problema
Necesitas:
- Un recurso único compartido (ej: configuración, logger, pool de conexiones)
- Evitar múltiples instancias que provoquen inconsistencias (ej: dos caches con estados distintos)

Señales típicas:
- “Debemos tener exactamente una instancia”
- “Varios módulos necesitan acceder al mismo objeto”

## Solución
- Constructor privado (o restringido)
- Campo estático que guarda la instancia
- Método estático getInstance() que crea la instancia la primera vez y luego la reutiliza

Notas importantes:
- En apps concurrentes, hay que considerar thread-safety
- En algunos lenguajes se simplifica con módulos/singletons del lenguaje

## Cuándo usar
- Logger único
- Config de app leída una vez
- Cache global (si de verdad debe ser global)
- Acceso centralizado a un recurso compartido con lifecycle controlado

## Cuándo NO usar
- Cuando solo quieres “acceso fácil” (mejor DI)
- Si introduce estado global difícil de testear
- Si el objeto debería poder tener varias instancias (ej. distintos entornos/configs)

## Trade-offs
Pros
- Control explícito de instanciación
- Evita duplicidad de recursos
- Punto de acceso único

Contras
- Estado global (acoplamiento)
- Dificulta tests (mocking)
- Puede esconder dependencias (mala arquitectura)
- Concurrencia: cuidado con inicialización lazy

## Variantes / alternativas
- Eager Singleton: instancia creada al cargar (simple, siempre vive)
- Lazy Singleton: crea al primer uso (requiere cuidado concurrente)
- Singleton por contenedor DI: “one instance per container” (más testeable)
- Alternativa: módulo (en JS/TS, el módulo ya funciona como singleton por cache)

## Ejemplo mínimo

TypeScript (módulo como singleton)
```ts
// config.ts
export const config = {
      apiBaseUrl: "https://api.example.com",
      timeoutMs: 5000,
};
```

TypeScript (clase singleton)
```ts
export class Logger {
	private static instance: Logger | null = null;
	
	private constructor() {}
	
	static getInstance(): Logger {
		if (!Logger.instance) Logger.instance = new Logger();
        return Logger.instance;
    }
    
    info(msg: string) {
	    console.log("[INFO]", msg);
	}
}

// uso
Logger.getInstance().info("Hola");
```

## Errores comunes
- Usarlo para todo (“porque es fácil”) y terminar con un “God object”
- No manejar concurrencia en inicialización lazy (en lenguajes multithread)
- Meter demasiadas responsabilidades en el singleton
- Dificultar pruebas por dependencias implícitas

## Checklist de implementación
- [ ] ¿De verdad necesitas una única instancia o solo DI?
- [ ] ¿Hay estado global que afectará tests?
- [ ] ¿La inicialización debe ser lazy o eager?
- [ ] Si hay concurrencia: ¿está protegido el acceso/creación?
- [ ] ¿Expones solo métodos necesarios (mínima superficie)?

## Relacionado
- [[Dependency Injection]]
- [[Factory Method]]
- [[Service Locator]] (ojo: también controversial)
- [[Global State (anti-pattern)]]

## Referencias
- GoF — Design Patterns (Singleton)
- Refactoring Guru — Singleton
