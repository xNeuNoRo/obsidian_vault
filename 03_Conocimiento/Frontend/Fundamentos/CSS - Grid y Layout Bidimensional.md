---
doc: language-core
area: Frontend
level: intermedio
tags:
  - css
  - grid
  - layout
  - architecture
aliases:
  - CSS Grid Layout
  - Layout Bidimensional
related:
  - "[[CSS - Flexbox y Layout Unidimensional]]"
  - "[[Responsive Design - Media Queries]]"
  - "[[CSS - Fundamentos y Selectores]]"
refs:
  - MDN - CSS Grid Layout
  - CSS Tricks - A Complete Guide to Grid
  - Apuntes Propios - CSS Grid Básicos
sticker: lucide//layout-grid
---

# CSS: Grid y Layout Bidimensional

## En una línea
Sistema de maquetación basado en una rejilla (grid) que permite alinear elementos en filas y columnas simultáneamente, ofreciendo un control total sobre el espacio bidimensional.

## 1. Conceptos Fundamentales
A diferencia de Flexbox, Grid se define desde el **contenedor padre** para crear una estructura rígida pero flexible donde los hijos se posicionan.

- **Grid Container**: El elemento con `display: grid`.
- **Grid Lines**: Las líneas divisorias (horizontales y verticales) que delimitan las celdas.
- **Grid Tracks**: El espacio entre dos líneas (una fila o una columna).
- **Grid Cell**: La unidad mínima del grid (intersección de fila y columna).
- **Grid Area**: Espacio compuesto por una o más celdas.

### Imagenes representativa de los Grid Lines
![[Pasted image 20260202163815.png]]
![[Pasted image 20260202163610.png]]
![[Pasted image 20260202163745.png]]
![[Pasted image 20260202163853.png]]


## 2. Definición de la Rejilla (Columnas y Filas)

### A. Unidades y Repetición
- **`fr` (Fractional Unit)**: Unidad flexible que representa una fracción del espacio libre en el contenedor.
- **`repeat()`**: Función para evitar la repetición manual de valores.

```css
.contenedor {
    display: grid;
    /* Crea 3 columnas de igual tamaño */
    grid-template-columns: repeat(3, 1fr); 
    /* Crea 2 filas de 50rem cada una */
    grid-template-rows: repeat(2, 50rem); 
    /* Gap: row-gap | column-gap */
    gap: 2rem 4rem; 
}
```

### B. Posicionamiento Manual con `span`
Puedes forzar a un elemento a ocupar múltiples celdas.
- **`grid-column`**: Define inicio/fin o cuántas columnas abarca.
- **`grid-row`**: Define inicio/fin o cuántas filas abarca.

```css
.item-destacado {
    /* Inicia en la línea 1 y abarca 2 columnas */
    grid-column: 1 / span 2; 
    /* Inicia en la línea 1 y abarca 3 filas */
    grid-row: 1 / span 3; 
}
```

## 3. Grid Areas: Diseño por Nombres
Es la forma más visual y mantenible de crear layouts complejos (como el que usaste en el footer de la tienda).

```css
.parent {
    display: grid;
    grid-template-areas:
        "header header header"
        "nav    nav    nav"
        "main   main   sidebar"
        "footer footer footer";
    grid-template-columns: repeat(3, 1fr);
}

.header  { grid-area: header; }
.sidebar { grid-area: sidebar; }
```

### Shorthand `grid-template`
Puedes definir áreas, filas y columnas en una sola regla:
```css
grid-template: 
    "header header header" 2.5fr
    "nav    nav    nav"    1fr
    "footer footer footer" 2.5fr / 1fr 1fr 1fr;
```

## 4. Lógica de Flujo: `grid-auto-flow`
Determina cómo se acomodan los elementos que no tienen una posición definida.
- **`row`**: (Default) Llena las filas primero.
- **`column`**: Llena las columnas primero.
- **`dense`**: **Nivel Senior.** Intenta rellenar huecos vacíos si aparecen elementos más pequeños después de uno grande.



## 5. Responsive Automático: `Auto-fill` vs `Auto-fit`
Permiten crear rejillas responsivas sin necesidad de Media Queries.

| Propiedad | Comportamiento |
| :--- | :--- |
| **`auto-fill`** | Llena el espacio con tantas columnas como quepan, aunque estén vacías. |
| **`auto-fit`** | Ajusta las columnas existentes para que ocupen todo el ancho disponible (colapsa las vacías). |

```css
/* Crea columnas de al menos 300px que se ajustan al ancho disponible */
grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
```

## 6. Alineación de Contenido
- **`justify-items` / `align-items`**: Alinea los elementos dentro de sus celdas.
- **`place-content`**: Atajo para alinear toda la cuadrícula dentro del contenedor.

## Checklist de Implementación
- [ ] ¿He definido las columnas y filas necesarias en el contenedor padre?
- [ ] ¿Estoy usando unidades `fr` para que el diseño sea flexible?
- [ ] ¿He aplicado `grid-area` para layouts complejos y legibles?
- [ ] ¿He configurado `gap` en lugar de márgenes manuales?
- [ ] ¿He probado `auto-fit` con `minmax()` para evitar Media Queries innecesarias?

## Relacionado
- [[CSS - Flexbox y Layout Unidimensional]]
- [[CSS - Selectores Avanzados]]
- [[Web Performance - Optimización de Layout]]