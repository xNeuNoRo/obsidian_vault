---
doc: pattern
area: Frontend
level: intro
tags:
  - frontend
  - react
  - composition
aliases:
  - Composition over inheritance (React)
related:
  - Hooks patterns
  - Container / Presentational
refs:
  - https://react.dev/learn/passing-props-to-a-component
sticker: lucide//curly-braces
---

# Composition over Inheritance (React)

## En una línea
En React casi siempre compones componentes (children, props, render props) en vez de heredar clases.

## Problema
La herencia suele:
- acoplar fuertemente
- crear jerarquías rígidas
- volver difícil combinar comportamientos

En React el objetivo es combinar UI como Lego.

## Solución
Técnicas comunes:
- `children` (slots)
- Componentes “wrapper”
- Render props
- Composición de hooks
- “Compound components”

## Ejemplo mínimo

Slots con children
```tsx
function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h3>{title}</h3>
      <div>{children}</div>
    </section>
  );
}

// uso
<Card title="Perfil">
  <ProfileForm />
</Card>
```

Compound component (idea)
```tsx
function Tabs({ children }: { children: React.ReactNode }) { return <div>{children}</div>; }
Tabs.List = function TabsList({ children }: any) { return <div>{children}</div>; };
Tabs.Panel = function TabsPanel({ children }: any) { return <div>{children}</div>; };
```

## Errores comunes
- Componentes demasiado “genéricos” (difíciles de usar)
- Prop drilling excesivo (a veces conviene context local)
- Abusar de render props cuando hooks resuelven mejor

## Checklist
- [ ] ¿Puedo resolverlo con children/props?
- [ ] ¿Necesito slots claros?
- [ ] ¿Estoy creando API de componente entendible?

## Relacionado
- [[Hooks patterns]]
- [[Container - Presentational]]
