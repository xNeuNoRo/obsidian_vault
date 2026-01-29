---
doc: pattern
area: Frontend
level: intermedio
tags:
  - frontend
  - react
  - hooks
  - architecture
aliases:
  - Custom hooks as services
  - Hook composition
related:
  - Strategy
  - Facade
  - State management patterns
refs:
  - https://react.dev/learn/reusing-logic-with-custom-hooks
sticker: lucide//curly-braces
---

# Hooks Patterns (custom hooks como Strategy/Facade)

## En una línea
Un custom hook encapsula lógica reutilizable (fetch, eventos, estado, reglas), y expone una API simple para componentes.

## Problema
Sin hooks bien diseñados:
- lógica duplicada en componentes
- muchos `useEffect` repetidos
- mezcla de concerns (UI + business rules)

## Solución
- Hook como “Facade”: devuelve datos + acciones listos para UI
- Hook como “Strategy”: recibe configuraciones y cambia comportamiento
- Hooks pequeños composables (uno para fetch, otro para debounce, etc.)

## Ejemplo mínimo

Hook como Facade (server + acciones)
```tsx
function useProfile(userId: string) {
  const q = useQuery({ queryKey: ["user", userId], queryFn: () => fetch(`/api/users/${userId}`).then(r => r.json()) });

  async function update(data: any) {
    await fetch(`/api/users/${userId}`, { method: "PUT", body: JSON.stringify(data) });
    await q.refetch();
  }

  return { user: q.data, loading: q.isLoading, error: q.error, update };
}
```

Hook como Strategy (variantes)
```tsx
type Mode = "strict" | "lenient";

function useValidation(mode: Mode) {
  return (value: string) => {
    if (mode === "strict") return value.length >= 8;
    return value.length >= 4;
  };
}
```

## Errores comunes
- Hook haciendo demasiado (se vuelve “God hook”)
- Hook con side effects sin control (dependencias incorrectas)
- No devolver una API estable (cambia shape y rompe componentes)

## Checklist
- [ ] ¿El hook tiene una responsabilidad clara?
- [ ] ¿Expone API mínima (data + actions)?
- [ ] ¿Está bien el manejo de deps de useEffect?
- [ ] ¿Es testeable?

## Relacionado
- [[State management patterns]]
- [[Strategy]]
- [[Facade]]

## Referencias
- React docs — Reusing logic with custom hooks
