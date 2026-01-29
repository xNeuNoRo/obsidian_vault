---
doc: pattern
area: Patrones
level: intermedio
tags:
  - pattern
  - structural
  - adapter
aliases:
  - Wrapper
  - Converter
related:
  - Facade
  - Decorator
  - Bridge
refs:
  - GoF Design Patterns
  - https://refactoring.guru/design-patterns/adapter
sticker: lucide//curly-braces
---

# Adapter

## En una línea
Convierte la interfaz de una clase en otra que el cliente espera, permitiendo que dos piezas incompatibles trabajen juntas.

## Problema
Tienes una dependencia/librería/API con una interfaz distinta a la que tu código necesita:
- SDK de terceros devuelve formatos raros
- Cambiaste un proveedor (Stripe → otro)
- Tienes “legacy code” con firmas antiguas
- Tus capas (dominio/aplicación/infra) necesitan hablar con contratos distintos

Señales típicas:
- Mucho “mapeo” repetido en varios lugares
- Tu dominio termina lleno de DTOs externos
- Tu código depende de tipos/formatos de terceros

## Solución
- Define un contrato “Target” que tu app quiere
- Crea un Adapter que implementa ese contrato
- El Adapter internamente usa el objeto “Adaptee” (tercero/legacy) y hace el mapeo

La idea es proteger tu core: si cambia el tercero, cambias el adapter, no todo tu código.

## Cuándo usar
- Integraciones con servicios externos
- Migraciones entre proveedores
- Aislar formatos de datos (DTO externos) del dominio

## Cuándo NO usar
- Si ya controlas ambas interfaces (mejor refactor directo)
- Si el mapeo es trivial y solo en 1 sitio (a veces basta una función)
- Si terminas con 20 adapters por mala arquitectura (revisar contratos)

## Trade-offs
Pros
- Aísla cambios externos
- Reduce acoplamiento a terceros
- Mejora testabilidad (puedes mockear el contrato target)

Contras
- Más capas/clases
- Si hay muchas transformaciones complejas, se vuelve “código pegamento” grande
- Riesgo de esconder errores de mapeo (requiere tests)

## Variantes / alternativas
- Adapter como función pura (en TS, a veces mejor)
- [[Facade]] si quieres una interfaz simplificada a un subsistema completo
- [[Decorator]] si quieres agregar comportamiento sin convertir interfaz

## Ejemplo mínimo

Contrato interno (Target)
```ts
type Money = { amount: number; currency: "USD" | "DOP" };

interface Payments {
  charge(userId: string, money: Money): Promise<{ id: string; status: "ok" | "fail" }>;
}
```

SDK externo (Adaptee) hipotético
```ts
class ThirdPartyPaySDK {
  async makePayment(payload: { customer: string; cents: number; curr: string }) {
    return { paymentId: "p1", success: true };
  }
}
```

Adapter
```ts
class ThirdPartyPaymentsAdapter implements Payments {
  constructor(private sdk: ThirdPartyPaySDK) {}

  async charge(userId: string, money: Money) {
    const res = await this.sdk.makePayment({
      customer: userId,
      cents: Math.round(money.amount * 100),
      curr: money.currency,
    });

    return { id: res.paymentId, status: res.success ? "ok" : "fail" };
  }
}
```

## Errores comunes
- Mezclar lógica de negocio dentro del adapter (debe ser solo integración/mapeo)
- Dejar tipos externos entrar al dominio
- No testear casos borde (redondeo, nulls, enums nuevos)

## Checklist de implementación
- [ ] ¿Tu dominio habla en términos propios (Money, UserId, etc.)?
- [ ] ¿El adapter encapsula TODO lo externo?
- [ ] ¿Tienes tests del mapeo y casos borde?
- [ ] ¿El contrato target es estable y simple?

## Relacionado
- [[Facade]]
- [[Decorator]]
- [[Bridge]]

## Referencias
- GoF — Adapter
- Refactoring Guru — Adapter
