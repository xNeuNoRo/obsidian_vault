---
doc: pattern
area: Frontend
level: intermedio
tags:
  - frontend
  - react
  - resilience
  - error-boundary
aliases:
  - UI fallback
  - Component crash isolation
related:
  - Timeout
  - Circuit Breaker
refs:
  - https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary
sticker: lucide//curly-braces
---

# Error Boundary (resiliencia UI)

## En una línea
Aísla fallos de render en un subárbol de React y muestra un fallback sin tumbar toda la app.

## Problema
Errores en render/efectos pueden romper la UI completa:
- un componente crashea y “pantalla blanca”
- error en una tarjeta tumba toda la página

## Solución
- Error Boundary captura errores durante render/lifecycle
- Muestra fallback UI y registra el error
- Puedes resetear el boundary cuando cambie algo (key)

## Ejemplo mínimo

ErrorBoundary (clase)
```tsx
type Props = { children: React.ReactNode; fallback: React.ReactNode };
type State = { hasError: boolean };

export class ErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: any, info: any) {
    console.error("UI crashed", error, info);
  }

  render() {
    if (this.state.hasError) return this.props.fallback;
    return this.props.children;
  }
}
```

Uso
```tsx
<ErrorBoundary fallback={<div>Algo falló 😕</div>}>
  <UserCardContainer userId="u1" />
</ErrorBoundary>
```

## Errores comunes
- Creer que captura errores async (no siempre; para async usa try/catch en handlers)
- No loggear ni reportar errores
- Boundary demasiado grande (oculta demasiada UI)

## Checklist
- [ ] ¿El boundary envuelve zonas riesgosas (charts, markdown, etc.)?
- [ ] ¿Hay fallback útil?
- [ ] ¿Se reporta el error (Sentry, logs)?
- [ ] ¿Necesitas reset (key)?

## Relacionado
- [[Circuit Breaker]] (concepto similar: aislar fallos)
- [[Timeout]] (en data fetching)
