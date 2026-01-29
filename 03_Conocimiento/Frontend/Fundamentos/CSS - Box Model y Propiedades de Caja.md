---
doc: language-core
area: Frontend
level: intermedio
tags:
  - css
  - box-model
  - layout
  - web-design
aliases:
  - Modelo de Caja
  - CSS Box Model
  - Propiedades de Layout
related:
  - "[[CSS - Fundamentos y Selectores]]"
  - "[[CSS - Flexbox Avanzado]]"
  - "[[Web Performance - Imágenes]]"
refs:
  - MDN - The box model
  - CSS Tricks - Box Sizing
  - web.dev - Learn CSS Box Model
sticker: lucide//box
---

# CSS: Box Model y Propiedades de Caja

## En una línea
Es el motor de renderizado que trata a cada elemento HTML como una caja rectangular, definiendo su tamaño, espacio interno, bordes y separación externa.

## 1. Componentes del Box Model
Cada "caja" en la web se compone de cuatro capas concéntricas. Entender la diferencia entre ellas es vital para el posicionamiento preciso.

1. **Content (Contenido)**: El área donde reside el texto, imágenes o hijos. Su tamaño se define con `width` y `height`.
2. **Padding (Relleno)**: Espacio **interno** entre el contenido y el borde. Es transparente y hereda el fondo del elemento.
3. **Border (Borde)**: Línea que rodea el padding y el contenido. Tiene grosor, estilo y color.
4. **Margin (Margen)**: Espacio **externo** que separa al elemento de sus vecinos. Es siempre transparente.



## 2. La Propiedad Maestra: `box-sizing`
Por defecto, el navegador suma el padding y el borde al ancho total (`content-box`), lo que suele romper los layouts. Como desarrollador, debes usar el estándar de la industria:

- **`content-box` (Default)**: `Total Width = width + padding + border`.
- **`border-box` (Recomendado)**: `Total Width = width`. El padding y el borde se "comen" el espacio hacia adentro sin alterar el tamaño final.

### Ejemplo de Configuración Global (Reset)
```css
/* Aplicar a todos los elementos para un cálculo de dimensiones predecible */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}
```

## 3. Paddings vs. Margins: Diferencias Técnicas
Aunque ambos crean espacio, su comportamiento en el flujo del documento es distinto.

| Propiedad | Naturaleza | Comportamiento Clave |
| :--- | :--- | :--- |
| **Padding** | Interno | Aumenta el área clickable del elemento. |
| **Margin** | Externo | Puede sufrir de "Margin Collapse" (los márgenes verticales se fusionan). |

### Taquigrafía (Shorthand)
```css
.card {
    /* top | right | bottom | left */
    margin: 10px 20px 15px 5px; 
    
    /* top/bottom | left/right */
    padding: 20px 10px; 
    
    /* Centrado horizontal (solo si tiene un width definido) */
    margin: 0 auto; 
}
```

## 4. Normalizar CSS (Normalize.css)
Cada navegador (Chrome, Safari, Firefox) aplica estilos por defecto distintos. 
- **Propósito**: Asegurar que tu aplicación se vea igual en todos los dispositivos.
- **Técnica**: Se incluye un archivo (como `normalize.css`) o un reset manual al inicio de tu hoja de estilos para "limpiar" esas discrepancias (como márgenes en el body o tamaños de fuente en inputs).

## 5. La Propiedad `display`: Flujo de las Cajas
Define cómo se comporta la caja respecto a sus vecinos.

- **`block`**: Ocupa todo el ancho disponible. Salto de línea automático (ej. `<div>`, `<h1>`, `<p>`).
- **`inline`**: Solo ocupa el ancho de su contenido. No acepta `width`, `height` ni márgenes verticales (ej. `<span>`, `<a>`).
- **`inline-block`**: Híbrido. Se mantiene en línea pero permite configurar tamaños y márgenes.
- **`none`**: Elimina el elemento del DOM visualmente y no ocupa espacio.

### Ejemplo: Botón personalizado
```css
.btn-primary {
    display: inline-block; /* Permite darle padding y width sin romper la línea */
    padding: 10px 25px;
    background-color: #007bff;
    text-decoration: none;
}
```

## 6. Agrupando Código CSS
Para evitar la repetición y mantener el principio **DRY (Don't Repeat Yourself)**, puedes aplicar las mismas propiedades a múltiples selectores usando comas.

```css
/* Agrupamiento de selectores */
h1, h2, h3, .main-title {
    font-family: 'Inter', sans-serif;
    color: #222;
    margin-bottom: 1rem;
}
```

## 7. Imágenes como Background
A diferencia de `<img>`, las imágenes de fondo son decorativas y se controlan totalmente desde CSS. Son ideales para secciones "Hero" o banners en **NightShop**.

```css
.hero-banner {
    background-image: url('../img/hero-bg.jpg');
    background-repeat: no-repeat;
    background-size: cover; /* Ajusta la imagen para cubrir todo el contenedor sin deformarse */
    background-position: center center; /* Centra la imagen */
    height: 400px;
    display: flex; /* Para centrar contenido dentro más tarde */
}
```

## Checklist de Calidad
- [ ] ¿He configurado `box-sizing: border-box` globalmente?
- [ ] ¿Entiendo cuándo usar `padding` (espacio interno) vs `margin` (espacio externo)?
- [ ] ¿He reseteado o normalizado los estilos base del navegador?
- [ ] ¿He usado la propiedad `display` correcta para el comportamiento deseado?
- [ ] ¿He optimizado mis imágenes de fondo con `background-size: cover`?

## Relacionado
- [[CSS - Fundamentos y Selectores]]
- [[CSS - Flexbox y Centrado]]
- [[Web Performance - Imágenes de Próxima Generación]]