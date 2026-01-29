---
doc: pattern
area: Patrones
level: intermedio
tags:
  - pattern
  - structural
  - proxy
aliases:
  - Surrogate
  - Lazy Proxy
related:
  - Decorator
  - Adapter
refs:
  - GoF Design Patterns
  - https://refactoring.guru/design-patterns/proxy
sticker: lucide//curly-braces
---

# Proxy

## En una línea
Un objeto que actúa como sustituto/controlador de acceso a otro objeto, añadiendo control (lazy, security, caching, logging, remote).

## Problema
Quieres controlar el acceso a algo costoso o sensible:
- Lazy loading: crear objeto pesado solo si se usa
- Control de permisos
- Rate limiting
- Caching
- Acceso remoto (RPC)

Señales típicas:
- Construcción costosa aunque el objeto no se use
- Necesitas “poner un guard” antes de llamar a un servicio
- Quieres interceptar llamadas sin cambiar al cliente

## Solución
- Proxy implementa la misma interfaz que el “RealSubject”
- El cliente usa Proxy como si fuera el real
- Proxy delega al real, pero añade lógica antes/después
- En lazy proxy, el real se crea bajo demanda

## Cuándo usar
- Lazy initialization
- Control de acceso/autorización
- Caching de resultados
- Objetos remotos o recursos compartidos

## Cuándo NO usar
- Si necesitas “composición de múltiples behaviors” (Decorator es mejor)
- Si introduces proxy solo por arquitectura (overhead)
- Si ocultas demasiado y complica debugging

## Trade-offs
Pros
- Transparente para el cliente
- Control centralizado (seguridad/cache/lazy)
- Reduce costos si lazy funciona

Contras
- Puede esconder latencia (remote proxy)
- Complejidad adicional
- Debugging: “¿estoy en proxy o real?”

## Variantes / alternativas
- Virtual Proxy (lazy)
- Protection Proxy (security)
- Remote Proxy (RPC)
- Caching Proxy
- Decorator (similar, pero intención distinta)

## Ejemplo mínimo

Lazy Proxy
```ts
interface ReportService {
  generate(): Promise<string>;
}

class HeavyReportService implements ReportService {
  constructor() {
    // imagina carga pesada
  }
  async generate() { return "report"; }
}

class LazyReportProxy implements ReportService {
  private real?: HeavyReportService;

  async generate() {
    if (!this.real) this.real = new HeavyReportService();
    return this.real.generate();
  }
}
```

Protection Proxy
```ts
class ProtectedReportProxy implements ReportService {
  constructor(private real: ReportService, private canAccess: () => boolean) {}

  async generate() {
    if (!this.canAccess()) throw new Error("Forbidden");
    return this.real.generate();
  }
}
```

## Errores comunes
- Proxy que cambia el contrato (debe ser transparente)
- Caching proxy sin invalidación o TTL
- Lazy proxy no thread-safe (en lenguajes concurrentes)

## Checklist de implementación
- [ ] ¿El proxy implementa la misma interfaz?
- [ ] ¿La intención está clara (lazy/security/cache/remote)?
- [ ] ¿Hay política para errores/latencia?
- [ ] Si cache: ¿TTL/invalidación?

## Relacionado
- [[Decorator]]
- [[Adapter]]

## Referencias
- GoF — Proxy
- Refactoring Guru — Proxy
