---
doc: pattern
area: Patrones
level: intermedio
tags:
  - pattern
  - creational
  - builder
aliases:
  - Fluent Builder
  - Step Builder
related:
  - Factory Method
  - Abstract Factory
refs:
  - GoF Design Patterns
  - https://refactoring.guru/design-patterns/builder
sticker: lucide//curly-braces
---

# Builder

## En una línea
Construye objetos complejos paso a paso, separando el proceso de construcción de la representación final.

## Problema
Tienes objetos con:
- Muchos parámetros opcionales
- Configuraciones combinables
- Diferentes “variantes” de construcción
- Riesgo de constructor con 10 argumentos (horror)

Señales típicas:
- Constructores gigantes
- `new X(a,b,c, undefined, undefined, true, ...)`
- Bugs por parámetros en orden incorrecto

## Solución
- Un Builder mantiene el estado de construcción
- Métodos encadenables configuran partes
- `build()` valida y crea el objeto final

## Cuándo usar
- Objetos con muchas opciones
- Configuración de clientes HTTP, queries, requests complejos
- Construcción que requiere validación antes de crear

## Cuándo NO usar
- Objetos simples con 1–3 params
- Si el builder se vuelve “otra clase gigante”
- Si tu lenguaje ya ofrece “named params” cómodo (aun puede servir)

## Trade-offs
Pros
- Claridad: nombre por cada opción
- Validación centralizada
- Evita errores por orden de parámetros

Contras
- Más código
- Puede duplicar estructura del objeto final
- Si no validas, solo es “setters con glamour”

## Variantes / alternativas
- Fluent builder
- Step builder (fuerza orden/obligatorios)
- Alternativa: objetos de configuración inmutables

## Ejemplo mínimo

Builder para HTTP request
```ts
type HttpRequest = {
  url: string;
  method: "GET" | "POST";
  headers: Record<string, string>;
  body?: unknown;
  timeoutMs: number;
};

class HttpRequestBuilder {
  private url?: string;
  private method: "GET" | "POST" = "GET";
  private headers: Record<string, string> = {};
  private body?: unknown;
  private timeoutMs = 5000;

  setUrl(url: string) { this.url = url; return this; }
  setMethod(method: "GET" | "POST") { this.method = method; return this; }
  addHeader(k: string, v: string) { this.headers[k] = v; return this; }
  setBody(body: unknown) { this.body = body; return this; }
  setTimeout(ms: number) { this.timeoutMs = ms; return this; }

  build(): HttpRequest {
    if (!this.url) throw new Error("url is required");
    if (this.method === "GET" && this.body != null) throw new Error("GET cannot have body");
    return { url: this.url, method: this.method, headers: this.headers, body: this.body, timeoutMs: this.timeoutMs };
  }
}

// uso
const req = new HttpRequestBuilder()
  .setUrl("/users")
  .setMethod("POST")
  .addHeader("Content-Type", "application/json")
  .setBody({ name: "Alice" })
  .setTimeout(8000)
  .build();
```

## Errores comunes
- Builder sin validación (pierde valor)
- Builder mutable reutilizado en paralelo (bugs)
- `build()` crea objetos parcialmente inválidos

## Checklist de implementación
- [ ] ¿El objeto final es complejo (muchas opciones)?
- [ ] ¿Hay validaciones importantes en build()?
- [ ] ¿El builder es claro y no crece infinito?
- [ ] ¿El objeto final queda inmutable (ideal)?

## Relacionado
- [[Factory Method]]
- [[Abstract Factory]]

## Referencias
- GoF — Builder
- Refactoring Guru — Builder
