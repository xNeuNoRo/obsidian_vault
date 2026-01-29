---
doc: pattern
area: Frontend
level: intermedio
tags:
  - frontend
  - react
  - architecture
  - container-presentational
aliases:
  - Smart/Dumb Components
  - Container/Presentational
related:
  - Hooks patterns
  - State management patterns
refs:
  - https://legacy.reactjs.org/docs/thinking-in-react.html
sticker: lucide//curly-braces
---

# Container / Presentational (Smart/Dumb Components)

## En una línea
Separar componentes que manejan **data/side-effects** (Container) de componentes que solo renderizan UI (Presentational).

## Problema
Componentes que hacen de todo:
- Fetch + state + UI + validaciones + navegación
- Difíciles de testear
- Difíciles de reutilizar
- Terminas con “mega componentes” en React

Señales típicas:
- Un componente de 300+ líneas
- Múltiples `useEffect` mezclados con JSX enorme
- UI difícil de reusar porque está pegada a la lógica

## Solución
- Container:
  - obtiene data (React Query/fetch)
  - decide qué mostrar (loading/error/empty)
  - pasa props a la UI
- Presentational:
  - recibe props
  - renderiza
  - emite callbacks (`onSubmit`, `onSelect`)

## Cuándo usar
- Pantallas con data remota
- Componentes UI reusables
- Cuando quieres tests simples (presentational con props)

## Cuándo NO usar
- Componentes muy pequeños donde separar es ruido
- UI súper específica que nunca se reutiliza (aunque igual ayuda a mantener)

## Trade-offs
Pros
- UI reutilizable y testeable
- Lógica aislada
- Componentes más pequeños

Contras
- Más archivos
- Si separas demasiado, fragmentas

## Ejemplo mínimo

Presentational (solo UI)
```tsx
type UserCardProps = {
  name: string;
  email: string;
  onRefresh: () => void;
};

export function UserCard({ name, email, onRefresh }: UserCardProps) {
  return (
    <div>
      <h2>{name}</h2>
      <p>{email}</p>
      <button onClick={onRefresh}>Refresh</button>
    </div>
  );
}
```

Container (data + estados)
```tsx
import { UserCard } from "./UserCard";

export function UserCardContainer({ userId }: { userId: string }) {
  const [user, setUser] = React.useState<{ name: string; email: string } | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function load() {
    setLoading(true); setError(null);
    try {
      const r = await fetch(`/api/users/${userId}`);
      if (!r.ok) throw new Error("Failed");
      setUser(await r.json());
    } catch (e: any) {
      setError(e.message ?? "Error");
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => { load(); }, [userId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div role="alert">{error}</div>;
  if (!user) return <div>No user</div>;

  return <UserCard name={user.name} email={user.email} onRefresh={load} />;
}
```

## Errores comunes
- Presentational con lógica de fetch “por accidente”
- Container pasando demasiadas props (señal de que el UI debe dividirse)
- No manejar loading/error/empty de forma consistente

## Checklist de implementación
- [ ] ¿La UI puede renderizar solo con props?
- [ ] ¿El container encapsula fetch/side-effects?
- [ ] ¿Estados loading/error/empty están cubiertos?
- [ ] ¿La UI es reusabe?

## Relacionado
- [[Hooks patterns]]
- [[State management patterns]]

## Referencias
- React docs — Thinking in React
