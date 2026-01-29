---
doc: pattern
area: Patrones
level: intermedio
tags:
  - pattern
  - behavioral
  - strategy
aliases:
  - Policy Pattern
  - Algoritmo intercambiable
related:
  - Factory Method
  - Abstract Factory
  - Dependency Injection
  - Template Method
refs:
  - GoF Design Patterns
  - https://refactoring.guru/design-patterns/strategy
sticker: lucide//curly-braces
---

# Strategy

## En una línea
Permite definir una familia de algoritmos (o políticas), encapsular cada uno y hacerlos intercambiables en runtime sin cambiar el código del “cliente”.

## Problema
Tienes una misma operación con múltiples variantes:
- Diferentes reglas según país/plan/usuario
- Distintos métodos de pago/envío
- Diferentes formas de calcular algo (descuentos, impuestos, scoring)

Señales típicas:
- `if/else` o `switch` gigante para elegir comportamiento
- Reglas mezcladas en una clase “God”
- Cada nuevo caso rompe tests y obliga a tocar muchas líneas

## Solución
- Definir una interfaz (contrato) para el algoritmo/política
- Implementar una clase por estrategia
- El “Context” recibe una estrategia y delega la operación

Idea clave: cambias comportamiento cambiando el objeto estrategia.

## Cuándo usar
- Cuando tengas variantes reales de una misma operación
- Cuando agregas variantes con frecuencia
- Cuando quieras testear cada variante por separado

## Cuándo NO usar
- Si solo hay 2 casos simples que jamás cambiarán
- Si las variantes comparten demasiado estado y terminan acopladas
- Si introduces Strategy solo por “arquitectura bonita” y no hay necesidad

## Trade-offs
Pros
- Elimina condicionales grandes
- Open/Closed: agregas estrategias sin tocar el Context
- Testabilidad excelente: pruebas por estrategia
- Reutilización (estrategias se comparten en distintos contextos)

Contras
- Más clases/archivos (overhead)
- Hay que decidir cómo seleccionar la estrategia (factory/registry/DI)
- Puede ser “demasiada estructura” si el problema era mínimo

## Variantes / alternativas
- Strategy con funciones (en TS/JS: pasar funciones en lugar de clases)
- Selección por Factory Method o registry
- Alternativa: Template Method (variación por herencia en vez de composición)
- Alternativa: usar DI (inyectar la estrategia)

## Ejemplo mínimo

TypeScript (problema: condicional grande)
```ts
type Plan = "basic" | "pro" | "enterprise";

class PriceCalculator {
  price(base: number, plan: Plan) {
    if (plan === "basic") return base;
    if (plan === "pro") return base * 0.9;
    return base * 0.8;
  }
}
```

TypeScript (Strategy con clases)
```ts
interface PricingStrategy {
  compute(base: number): number;
}

class BasicPricing implements PricingStrategy {
  compute(base: number) { return base; }
}

class ProPricing implements PricingStrategy {
  compute(base: number) { return base * 0.9; }
}

class EnterprisePricing implements PricingStrategy {
  compute(base: number) { return base * 0.8; }
}

class PriceCalculator {
  constructor(private strategy: PricingStrategy) {}

  price(base: number) {
    return this.strategy.compute(base);
  }
}

// uso
const calc = new PriceCalculator(new ProPricing());
calc.price(100); // 90
```

TypeScript (Strategy con funciones — súper práctico)
```ts
type PricingFn = (base: number) => number;

const pricing = {
  basic: (b: number) => b,
  pro: (b: number) => b * 0.9,
  enterprise: (b: number) => b * 0.8,
} satisfies Record<string, PricingFn>;

function price(base: number, plan: keyof typeof pricing) {
  return pricing[plan](base);
}
```

## Errores comunes
- Crear estrategias que solo cambian 1 línea sin justificación (overkill)
- Context con demasiada lógica que debería estar dentro de la estrategia
- Estrategias que dependen del Context para todo (acoplamiento)
- Selección de estrategia dispersa (mejor centralizar en factory/DI)

## Checklist de implementación
- [ ] ¿Las variantes comparten el mismo “contrato”?
- [ ] ¿Cada estrategia se puede testear aislada?
- [ ] ¿La selección de estrategia está centralizada (factory/DI)?
- [ ] ¿El Context quedó simple y delega lo variable?

## Relacionado
- [[Factory Method]] (para seleccionar estrategia)
- [[Abstract Factory]] (para construir familias de estrategias/objetos)
- [[Dependency Injection]] (para inyectar estrategia)
- [[Template Method]] (alternativa por herencia)

## Referencias
- GoF — Design Patterns (Strategy)
- Refactoring Guru — Strategy
