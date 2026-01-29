---
doc: pattern
area: Frontend
level: intermedio
tags:
  - frontend
  - react
  - state
  - client-state
  - server-state
aliases:
  - Local vs Server State
  - React Query pattern
related:
  - Hooks patterns
  - Rendering patterns Next
refs:
  - https://tanstack.com/query/latest
  - https://react.dev/learn/managing-state
sticker: lucide//curly-braces
---

# State Management Patterns (local / server / reducer)

## En una línea
Usa el tipo de estado correcto: **local UI state**, **server state** (cacheado/async), y **global state** solo cuando realmente lo necesitas.

## Problema
Meter todo en un solo sitio (Context/Redux) crea:
- renders innecesarios
- acoplamiento
- lógica de fetching duplicada
- bugs por estado global (similar al anti-pattern global state)

Señales típicas:
- Context gigante con “todo”
- fetch manual repetido en varias pantallas
- “stale data” o data inconsistente entre componentes

## Solución
### 1) Local UI state (useState)
- inputs, toggles, modales
- solo afecta al componente/subárbol

### 2) Server state (React Query / SWR)
- data remota
- caching, refetch, invalidation
- loading/error states

### 3) Reducers (useReducer)
- estados complejos con transiciones claras
- “state machines” simples en UI

### 4) Global state (Context/Redux/Zustand)
- auth session
- theme
- carrito (si lo comparten muchas vistas)
- cosas verdaderamente transversales

## Trade-offs
Pros
- Menos re-renders
- Mejor consistencia
- Menos boilerplate

Contras
- Necesitas disciplina para elegir bien
- Aprender invalidation/caching bien

## Ejemplo mínimo

Server state con React Query
```tsx
import { useQuery } from "@tanstack/react-query";

function useUser(userId: string) {
  return useQuery({
    queryKey: ["user", userId],
    queryFn: async () => {
      const r = await fetch(`/api/users/${userId}`);
      if (!r.ok) throw new Error("Failed");
      return r.json();
    },
    staleTime: 30_000,
  });
}

export function Profile({ userId }: { userId: string }) {
  const { data, isLoading, error, refetch } = useUser(userId);
  if (isLoading) return <div>Loading...</div>;
  if (error) return <button onClick={() => refetch()}>Retry</button>;
  return <div>{data.name}</div>;
}
```

Reducer para flujo UI
```tsx
type State = { step: "idle" | "editing" | "saving" | "error" };
type Action = { type: "edit" } | { type: "save" } | { type: "ok" } | { type: "fail" };

function reducer(s: State, a: Action): State {
  switch (a.type) {
    case "edit": return { step: "editing" };
    case "save": return { step: "saving" };
    case "ok": return { step: "idle" };
    case "fail": return { step: "error" };
  }
}

const [state, dispatch] = React.useReducer(reducer, { step: "idle" });
```

## Errores comunes
- Global state para todo
- Fetch manual sin cache → inconsistencias
- No invalidar caches al mutar (stale UI)
- Context provocando renders gigantes

## Checklist de implementación
- [ ] ¿Esto es UI local o server data?
- [ ] ¿Necesito cache/invalidation? (server state)
- [ ] ¿Necesito transiciones claras? (reducer)
- [ ] ¿De verdad es global? (si no, evitar)

## Relacionado
- [[Hooks patterns]]
- [[Rendering patterns Next]]

## Referencias
- TanStack Query docs
- React docs — Managing State
