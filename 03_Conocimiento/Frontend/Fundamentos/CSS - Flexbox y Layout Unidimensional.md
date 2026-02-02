---
doc: language-core
area: Frontend
level: intermedio
tags:
  - css
  - flexbox
  - layout
  - responsive
aliases:
  - Flexible Box Module
  - Layout Unidimensional
related:
  - "[[CSS - Box Model y Propiedades de Caja]]"
  - "[[CSS - Grid y Layout Bidimensional]]"
refs:
  - MDN - Basic concepts of flexbox
  - CSS Tricks - A Complete Guide to Flexbox
  - Apuntes Propios - Flexbox Básicos
sticker: lucide//columns-2
---

# CSS: Flexbox y Layout Unidimensional

## En una línea
Sistema de maquetación diseñado para distribuir el espacio y alinear elementos en una sola dimensión (fila o columna), incluso cuando su tamaño es desconocido o dinámico.

## 1. El Concepto: Contenedor vs. Items
Flexbox funciona bajo una relación **Padre (Flex Container)** e **Hijos (Flex Items)**. Al aplicar `display: flex` al padre, todos sus hijos directos se vuelven elementos flexibles automáticamente.

- **Ejes de Flexbox**:
    - **Main Axis (Eje Principal)**: Dirección definida por `flex-direction`. Por defecto es horizontal (row).
    - **Cross Axis (Eje Secundario)**: Perpendicular al eje principal.

### Diagrama de los ejes Main Axis y Cross Axis en Flexbox
![[Pasted image 20260202163232.png]]

## 2. Propiedades del Contenedor (Padre)

### A. Dirección y Sentido
- **`flex-direction`**: Define el eje principal.
    - `row`: (Default) Izquierda a derecha.
    - `row-reverse`: Derecha a izquierda.
    - `column`: Arriba hacia abajo.

### B. Alineación en el Eje Principal
- **`justify-content`**: Controla cómo se distribuye el espacio sobrante entre los items.
    - `flex-start`: Alinea al inicio.
    - `center`: Centra los elementos.
    - `space-between`: Primer y último elemento pegados a los bordes.
    - `space-around`: Espacio igual entre elementos, mitad de espacio en las esquinas.
    - `space-evenly`: Espacio exactamente igual en todos lados.

### C. Alineación en el Eje Secundario
- **`align-items`**: Controla la alineación vertical (si es fila) o horizontal (si es columna).
    - `stretch`: (Default) Estira los elementos para llenar el contenedor.
    - `center`: Centra los elementos en el eje secundario.
    - `baseline`: Alinea según la línea base del texto de los elementos.

### D. Multi-línea y Espaciado
- **`flex-wrap`**: Permite que los elementos salten a una nueva línea si no hay espacio.
- **`gap`**: Define el espacio entre items de forma directa (forma moderna).

## 3. Propiedades de los Items (Hijos)

### A. Dimensionamiento Flexible
- **`flex-basis`**: El tamaño inicial de un elemento antes de que se distribuya el espacio restante.
- **`flex-grow`**: Factor que indica cuánto puede crecer un elemento respecto a los demás si hay espacio extra.
    - *Nota técnica*: Si un elemento tiene `flex-grow: 2` y otro `1`, el primero tomará el doble de espacio sobrante.
- **`flex-shrink`**: Factor que indica cuánto puede encogerse un elemento si no hay espacio suficiente.

### B. Shorthand Profesional
- **`flex`**: Combina `grow`, `shrink` y `basis`.
    - `flex: 1;` -> Atajo para `flex: 1 1 0%;` (el elemento crece y encoge equitativamente).
    - `flex: 0 0 33.3%;` -> No crece, no encoge, tamaño exacto de 1/3 del contenedor.

### C. Alineación Individual
- **`align-self`**: Permite que un solo hijo rompa la alineación de `align-items` definida en el padre.

## 4. Ejemplos Prácticos y Lógica de Negocio

### El Truco del "Gap Manual" con `calc()`
Si necesitas compatibilidad con navegadores antiguos o un control matemático exacto del grid, usa `flex-basis` con `calc()` restando el margen deseado:

```css
.contenedor {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
}

.box {
    /* 3 columnas con un espacio simulado */
    flex-basis: calc(33.3% - 1rem); 
}
```

### Centrado Absoluto (El "Santo Grial")
```css
.padre {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
}
```

## Checklist de Implementación
- [ ] ¿He definido el `display: flex` en el elemento padre?
- [ ] ¿El eje principal (`flex-direction`) es el correcto para el diseño?
- [ ] ¿He usado `flex-wrap: wrap` para evitar que los elementos se desborden?
- [ ] ¿Estoy aprovechando el shorthand `flex` en lugar de las propiedades individuales?
- [ ] ¿He usado `align-self` para excepciones de alineación en hijos específicos?

## Relacionado
- [[CSS - Box Model y Propiedades de Caja]]
- [[CSS - Grid y Layout Bidimensional]]
- [[Responsive Design - Media Queries]]