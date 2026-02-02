---
doc: language-advanced
area: Frontend
level: avanzado
tags:
  - css
  - grid
  - architecture
  - web-design
aliases:
  - Grid Mastery
  - CSS Grid Advanced
related:
  - "[[CSS - Grid y Layout Bidimensional]]"
  - "[[CSS - Flexbox Pro (Arquitectura y Casos de Borde)]]"
refs:
  - MDN - Grid Layout Concepts
  - CSS Tricks - Grid Naming Lines
  - web.dev - Learn Grid
sticker: lucide//grid
---

# CSS: Grid Pro (Arquitectura y Control Dinámico)

## 1. El Grid Implícito vs. Explícito
Este es el concepto más importante para manejar datos dinámicos (como un listado de productos que crece).
- **Grid Explícito**: Las columnas y filas que defines manualmente con `grid-template-*`.
- **Grid Implícito**: Las filas o columnas que el navegador crea automáticamente cuando el contenido excede tu definición inicial.
- **Control Técnico**: Usa `grid-auto-rows` para definir qué altura tendrán esas filas automáticas.

```css
.grid-ecommerce {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    /* Las filas nuevas que se creen automáticamente medirán 250px */
    grid-auto-rows: 250px; 
}
```

## 2. Líneas Nombradas (Named Lines)
En lugar de contar líneas (1, 2, 3...), puedes nombrarlas. Esto hace que tu código sea legible para humanos y mucho más fácil de mantener en layouts grandes.

```css
.layout-principal {
    display: grid;
    grid-template-columns: [main-start] 1fr [content-start] 3fr [content-end] 1fr [main-end];
}

.sidebar {
    grid-column: main-start / content-start;
}

.content {
    grid-column: content-start / content-end;
}
```

## 3. Dimensionamiento por Contenido (Intrinsic Sizing)
Más allá de los píxeles o las fracciones (`fr`), Grid permite que el contenido dicte el tamaño de la pista:
- **`min-content`**: La celda se reduce al tamaño de la palabra o elemento más pequeño posible.
- **`max-content`**: La celda se expande tanto como sea necesario para que el contenido no haga saltos de línea.
- **`fit-content(limit)`**: Se comporta como `max-content` pero nunca excede el límite definido.

```css
.grid-header {
    /* El logo ocupa lo mínimo, la búsqueda lo máximo, y el login un límite fijo */
    grid-template-columns: min-content 1fr fit-content(200px);
}
```

## 4. Subgrid: Herencia de Rejilla
Permite que un elemento hijo utilice las mismas líneas de rejilla que su padre. Es vital para alinear elementos internos (como títulos o botones) de diferentes tarjetas de producto entre sí.

```css
.product-card {
    grid-row: span 3;
    display: grid;
    grid-template-rows: subgrid; /* Alinea imagen, título y precio con la rejilla del padre */
}
```

## 5. El Algoritmo "Dense" para Galerías
Como notaste en tus apuntes sobre `grid-auto-flow`, el valor `dense` es la solución para layouts tipo "Pinterest" o mosaicos, ya que intenta rellenar huecos vacíos si aparecen elementos más pequeños después de uno grande.

```css
.galeria-mosaico {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    grid-auto-flow: dense; /* Inteligencia artificial de reordenamiento visual */
}
```

## 6. Centrado y Alineación Total (`place-*`)
Evita escribir múltiples líneas de alineación.
- **`place-items: center;`**: Atajo para `align-items` y `justify-items`. Centra los elementos dentro de sus celdas.
- **`place-content: center;`**: Atajo para `align-content` y `justify-content`. Centra toda la rejilla dentro del contenedor.

## Checklist de Maestro de Grid
- [ ] ¿He usado `grid-template-areas` para el layout general y nombres de líneas para componentes internos?
- [ ] ¿Uso `auto-fit` con `minmax()` para evitar Media Queries innecesarias?
- [ ] ¿He configurado `grid-auto-rows` para asegurar consistencia en grids dinámicos?
- [ ] ¿Aprovecho `fit-content` para evitar que elementos pequeños ocupen demasiado espacio?
- [ ] ¿He considerado el uso de `dense` para optimizar el espacio visual en galerías?

## Relacionado
- [[CSS - Grid y Layout Bidimensional]]
- [[CSS - Flexbox Pro (Arquitectura y Casos de Borde)]]
- [[Web Performance - Optimización de Layout]]