---
doc: language-core
area: Frontend
level: intermedio
tags:
  - css
  - typography
  - units
  - responsive
aliases:
  - Unidades Relativas
  - Google Fonts en CSS
  - REM vs EM
related:
  - "[[CSS - Fundamentos y Selectores]]"
  - "[[Responsive Design - Media Queries]]"
  - "[[Web Performance - Fuentes y Carga]]"
refs:
  - MDN - CSS values and units
  - Google Fonts Documentation
  - Apuntes Propios - Ecommerce app.css
sticker: lucide//type
---

# CSS: Unidades y Tipografía

## En una línea
Sistema de medición y representación visual de texto que permite crear interfaces proporcionales, accesibles y consistentes en diferentes densidades de pantalla.

## 1. Unidades: Absolutas vs. Relativas
Como desarrollador de software, el objetivo es evitar las unidades "rígidas" que rompen la accesibilidad del usuario.

| Tipo | Unidad | Descripción Técnica |
| :--- | :--- | :--- |
| **Absoluta** | `px` | Píxeles físicos. **No escalan** si el usuario cambia el tamaño de fuente en el navegador. |
| **Relativa** | `rem` | Relativa al tamaño de fuente de la raíz (`<html>`). Es el estándar para layouts. |
| **Relativa** | `em` | Relativa al tamaño de fuente del elemento padre. Útil para componentes modulares. |
| **Viewport** | `vw`/`vh` | Relativas al ancho o alto de la ventana del navegador. |

## 2. El "Truco" del 62.5% (Estrategia de Cálculo)
Por defecto, los navegadores usan `16px` como base. Calcular `rem` con base 16 es complejo (ej. `24px / 16 = 1.5rem`). Para simplificar esto, en tu proyecto vas a aplicar una normalización matemática:

```css
/* app.css */
html {
  /* 62.5% de 16px = 10px */
  font-size: 62.5%; 
}

body {
  /* Ahora 1.6rem = 16px exactamente */
  font-size: 1.6rem; 
}
```
**Ventaja:** Permite que cualquier medida en píxeles se convierta a `rem` simplemente moviendo el punto decimal (ej. `50px` = `5.0rem`).

## 3. Integración de Tipografías (Google Fonts)
Para cargar fuentes externas de forma eficiente sin bloquear el renderizado, se utiliza la conexión pre-establecida en el HTML y se define en el CSS.

### A. Implementación en HTML
```html
<link rel="preconnect" href="[https://fonts.googleapis.com](https://fonts.googleapis.com)">
<link rel="preconnect" href="[https://fonts.gstatic.com](https://fonts.gstatic.com)" crossorigin>
<link href="[https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400..900&family=Raleway:wght@100..900&display=swap](https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400..900&family=Raleway:wght@100..900&display=swap)" rel="stylesheet">
```

### B. Definición en CSS
```css
/* app.css */
body {
  font-family: "Raleway", sans-serif; /* Fuente principal para lectura */
}

h1, h2, h3 {
  font-family: "Playfair Display", serif; /* Fuente decorativa para títulos */
}
```



## 4. Propiedades de Tipografía Esenciales
Basado en las utilidades de tu proyecto:

- **`font-size`**: Define el tamaño. Siempre usa `rem` para respetar la configuración del sistema del usuario.
- **`font-weight`**: Define el grosor (ej. `900` para extra-negrita en botones).
- **`line-height`**: Define el espacio entre líneas. Un valor de `1.6` es el estándar para legibilidad.
- **`text-transform`**: Cambia el caso del texto sin alterar el HTML (ej. `uppercase` para botones de acción).
- **`text-align`**: Alineación horizontal (ej. `.text-center`).

## 5. Ejemplo: Utilidades Tipográficas Propias
En tu repositorio creaste clases de utilidad para evitar repetición:

```css
/* app.css */
.text-center {
  text-align: center;
}

.nombre-sitio span {
  color: #037bc0; /* Uso de énfasis mediante color en tipografía */
}

.btn {
  text-transform: uppercase;
  font-weight: 900;
  text-align: center;
}
```

## Checklist de Implementación
- [ ] ¿He configurado el `font-size: 62.5%` en el `html`?
- [ ] ¿Estoy utilizando `rem` para todas las medidas de texto y espaciado?
- [ ] ¿He incluido los `preconnect` para optimizar la carga de Google Fonts?
- [ ] ¿La fuente secundaria (fallback) está definida (ej. `serif` o `sans-serif`)?
- [ ] ¿He configurado un `line-height` adecuado para la lectura en el `body`?

## Relacionado
- [[CSS - Fundamentos y Selectores]]
- [[Web Performance - Fuentes y Carga]]
- [[SEO y Accesibilidad Web]]