---
doc: pattern
area: Patrones
level: intermedio
tags:
  - pattern
  - architectural
  - service-locator
  - controversial
aliases:
  - Registry
  - Dependency Locator
related:
  - Dependency Injection
  - Singleton
  - Global State (anti-pattern)
refs:
  - https://martinfowler.com/articles/injection.html
  - https://martinfowler.com/bliki/ServiceLocator.html
sticker: lucide//curly-braces
---

# Service Locator

## En una línea
En vez de recibir dependencias por parámetros (DI), las “pides” a un objeto global/central (el Locator) que sabe cómo entregarlas.

## Problema
Quieres evitar pasar dependencias por todos lados y buscas un punto único para obtener servicios:
- `logger`, `db`, `mailer`, `config`, etc.
- Muchas clases necesitan muchas dependencias
- Te da pereza cablear (wiring) manualmente

Señales típicas:
- Mucho “pasar cosas” por constructores y te parece verboso
- Quieres “acceso fácil” a servicios desde cualquier módulo

## Solución
- Tienes un `ServiceLocator` (o `Container`) global
- Registras servicios al iniciar la app
- En cualquier parte, pides el servicio: `locator.get("logger")`

## Cuándo usar (si decides usarlo)
- En legacy systems donde migrar a DI es caro
- En prototipos rápidos (con disciplina)
- En frameworks que ya lo usan internamente (ojo, no copiarlo sin entender)

## Cuándo NO usar (lo normal)
- Cuando quieres código testeable y dependencias explícitas
- En proyectos medianos/grandes donde el “acceso global” se vuelve caos
- Cuando quieres evitar acoplamiento oculto

## Trade-offs
Pros
- Conveniente: no pasas dependencias por todos lados
- Centraliza configuración/creación de servicios
- Puede reducir “wiring” manual

Contras (importantes)
- Dependencias ocultas: la clase no muestra lo que necesita
- Tests más difíciles: necesitas reconfigurar el locator
- Acoplamiento global y orden de inicialización
- Facilita Global State y “God services”

## Variantes / alternativas
- Alternativa recomendada: [[Dependency Injection]]
- Alternativa parcial: pasar dependencias por módulo (en TS, módulos ya hacen “singleton”)
- “Hybrid”: Locator solo en el composition root (y DI dentro)

## Ejemplo mínimo

TypeScript (Service Locator típico)
```ts
type Token<T> = string;

class ServiceLocator {
  private services = new Map<string, unknown>();

  register<T>(token: Token<T>, service: T) {
    this.services.set(token, service);
  }

  get<T>(token: Token<T>): T {
    const s = this.services.get(token);
    if (!s) throw new Error(`Service not found: ${token}`);
    return s as T;
  }
}

export const locator = new ServiceLocator();

// boot
locator.register("logger", console);

// uso en cualquier lado
export class UserService {
  private logger = locator.get<Console>("logger");

  register(email: string) {
    this.logger.log("Registrando", email);
  }
}
```

## Errores comunes
- Usarlo “por comodidad” y terminar con dependencias invisibles
- Reconfigurar el locator en runtime (bugs raros)
- Servicios con estado mutable global
- Dependencias circulares escondidas

## Checklist de implementación
- [ ] ¿De verdad no puedo usar DI?
- [ ] ¿Mis clases siguen siendo testeables?
- [ ] ¿Está claro qué servicios existen y quién los registra?
- [ ] ¿Tengo límites para evitar que todo sea global?

## Relacionado
- [[Dependency Injection]] (alternativa recomendada)
- [[Singleton]] (casi siempre aparece junto)
- [[Global State (anti-pattern)]]

## Referencias
- Martin Fowler — Service Locator
- Martin Fowler — Dependency Injection (comparación)
