---
doc: language
area: Frontend
level: intermedio/avanzado
tags:
  - css
  - selectors
  - advanced
  - pseudo-classes
aliases:
  - Selectores Avanzados
  - Pseudo-elementos
related:
  - "[[CSS - Fundamentos y Selectores]]"
refs:
  - MDN - Pseudo-classes
  - MDN - Combinators
  - Apuntes Propios - Selectores CSS (04-selectores-css)
sticker: lucide//layers
---

# CSS: Pseudo-clases y Combinadores

## En una línea
Conjunto de selectores avanzados que permiten apuntar a elementos basándose en su estado, posición relativa en el árbol o relaciones de parentesco sin añadir clases extras al HTML.

## Problema
Los selectores básicos (clase, ID, etiqueta) son insuficientes cuando necesitas:
- Seleccionar elementos según su posición (ej. "solo el primer ítem de la lista").
- Aplicar estilos según el estado del usuario (ej. `:hover`, `:focus`).
- Estilar elementos basándose en su relación con otros (ej. "el párrafo que sigue a un encabezado").
- Mantener el HTML limpio (evitar la "clasitis").

## 1. Combinadores de Jerarquía
Permiten apuntar a elementos dependiendo de su parentesco en el DOM.

- **Hijo Descendiente (`A B`)**: Selecciona todos los `B` dentro de `A`, en cualquier nivel.
- **Hijo Directo (`A > B`)**: Selecciona solo los hijos inmediatos.
  ```css
  /* Solo los div que son hijos directos de admin */
  .admin > div { border: 2px solid blue; }
  ```
- **Hermano Adyacente (`A + B`)**: Selecciona el elemento `B` que sigue **inmediatamente** a `A`.
  ```css
  /* El primer párrafo que va después de un div dentro de admin */
  .admin div + p { background-color: red; }
  ```

## 2. Selectores de Atributo
Permiten usar lógica de cadenas sobre los atributos de las etiquetas (`10.css`):
- **`^=` (Empieza con)**: `a[href^="http"]` -> Selecciona enlaces externos (como un `startsWith`).
- **`$=` (Termina con)**: `a[href$=".pdf"]` -> Selecciona archivos específicos (como un `endsWith`).
- **Exacto**: `input[type="tel"]` -> Selecciona inputs de teléfono.

## 3. Pseudo-clases Estructurales
Permiten seleccionar elementos según su orden. Fundamental para listas y tablas (`11.css` a `13.css`):

| Selector | Función | Ejemplo Técnico |
| :--- | :--- | :--- |
| `:first-child` | Primer hijo del padre. | `ul li:first-child` |
| `:last-child` | Último hijo del padre. | `ul li:last-child` |
| `:nth-child(n)` | Enésimo hijo (admite fórmulas). | `ul li:nth-child(2)` |
| `:first-of-type` | Primer elemento de su tipo. | `ul li:first-of-type` |

### Lógica de Fórmulas en `nth-child`
- **`odd` / `2n + 1`**: Elementos impares (1, 3, 5...).
- **`even` / `2n`**: Elementos pares (2, 4, 6...).
- **`4n + 4`**: Cada cuatro elementos empezando por el cuarto.

## 4. Selector de Negación (`:not`)
Permite aplicar estilos a todo **menos** a los elementos que coincidan con el argumento (`14.css`). Es posible encadenarlos:
```css
/* Selecciona párrafos que NO tengan la clase 'texto' ni 'oferta' */
p:not(.texto):not(.oferta) {
    color: orange;
}
```

## 5. Pseudo-elementos Visuales
Para estilar partes del contenido que no tienen una etiqueta propia en el HTML (`15.css`):
- **`::first-letter`**: Estila la primera letra (útil para capitulares).
- **`::first-line`**: Estila la primera línea visible (dinámico según el ancho de pantalla).

```css
.primer-letra::first-letter {
    font-size: 3rem;
    color: blue;
}
```

## Checklist de Implementación
- [ ] ¿He usado `>` para evitar que estilos se filtren a niveles profundos (nietos)?
- [ ] ¿Uso `:first-of-type` en lugar de `:first-child` si hay diferentes etiquetas hermanas?
- [ ] ¿He aprovechado `nth-child` para el diseño de grids o listas sin añadir clases manuales?
- [ ] ¿Uso la sintaxis de doble dos puntos `::` para los pseudo-elementos?

## Relacionado
- [[CSS - Fundamentos y Selectores]]
- [[CSS - Box Model y Propiedades de Caja]]