---
doc: language-core
area: Frontend
level: intermedio
tags:
  - css
  - selectors
  - specificity
  - colors
aliases:
  - Introducción a CSS
  - Selectores y Cascada
related:
  - "[[HTML - Semántica y Estructura]]"
  - "[[CSS - Box Model y Propiedades de Caja]]"
refs:
  - MDN - Cascading Style Sheets
  - CSS Tricks - Specificity
  - W3C - CSS Color Module
sticker: lucide//palette
---

# CSS: Fundamentos y Selectores

## En una línea
Lenguaje de hojas de estilo utilizado para describir la presentación de un documento estructurado (HTML), manejando la estética y el diseño visual.

## 1. Terminología y Anatomía de CSS
Para un desarrollador, CSS debe verse como un conjunto de reglas aplicadas a un objeto. Una **Regla CSS** se compone de:

1. **Selector**: El puntero que indica a qué elemento del DOM aplicar el estilo.
2. **Declaración**: El bloque entre llaves `{}` que contiene las instrucciones.
3. **Propiedad**: El atributo que queremos modificar (ej. `color`).
4. **Valor**: El dato específico asignado (ej. `#ffffff`).

```css
/* Selector { Propiedad: Valor; } */
.product-title {
    color: #2c3e50;
    font-size: 1.25rem;
}
```


## 2. Métodos de Integración
Basado en tu curso, existen tres formas de aplicar CSS, pero solo una es la estándar profesional para proyectos como **NightCloud**.

| Método | Técnica | Uso |
| :--- | :--- | :--- |
| **Inline** | Atributo `style` dentro de la etiqueta HTML. | **Evitar.** Máxima especificidad, difícil de mantener. |
| **Interno** | Bloque `<style>` dentro del `<head>`. | Útil para estilos críticos de una sola página o demos rápidas. |
| **Externo** | Archivo `.css` separado conectado vía `<link>`. | **Estándar Profesional.** Permite caché del navegador y código modular. |

### Implementación Correcta (Externo)
```html
<head>
    <link rel="stylesheet" href="css/styles.css">
</head>
```

## 3. El Sistema de Colores
En CSS, el manejo de color es más complejo que solo nombres. Como entusiasta del software, debes dominar los sistemas numéricos:

- **Hexadecimal (`#RRGGBB`)**: El más común. Usa base 16.
- **RGB (`rgb(0,0,0)`)**: Basado en la intensidad de luz de los tres colores primarios.
- **HSL (`hsl(h, s, l)`)**: Hue (Matiz), Saturation (Saturación), Lightness (Luminosidad). Es el más intuitivo para programadores porque facilita crear variantes de un color (ej. un botón más oscuro al hacer hover).

### Ejemplo de Variantes con HSL
```css
:root {
    --primary: hsl(210, 100%, 50%); /* Azul puro */
    --primary-dark: hsl(210, 100%, 40%); /* Mismo azul, 10% más oscuro */
}
```

## 4. Selectores: La jerarquía del DOM
Los selectores determinan la eficiencia de tu código.

| Selector | Sintaxis | Ejemplo |
| :--- | :--- | :--- |
| **Universal** | `*` | `* { box-sizing: border-box; }` |
| **Tipo (Etiqueta)**| `tag` | `p { line-height: 1.6; }` |
| **Clase** | `.class` | `.btn-buy { background: green; }` |
| **ID** | `#id` | `#main-header { position: sticky; }` |

### Agregando Clases a Selectores
Puedes combinar selectores para ser más específico o filtrar elementos que compartan una clase pero sean de distinto tipo:

```css
/* Solo los párrafos que tengan la clase 'error' */
p.error {
    color: red;
}

/* Todos los elementos con clase 'btn' que estén dentro de un 'footer' */
footer .btn {
    padding: 10px;
}
```

## 5. La Especificidad: Las Reglas del Juego
Es el algoritmo que decide qué estilo gana cuando hay conflicto. Se calcula con un sistema de puntos (puedes pensarlo como una tupla `(ID, Clase, Etiqueta)`):

1. **Inline Style**: 1000 puntos (Gana casi siempre).
2. **IDs**: 100 puntos.
3. **Clases, Atributos y Pseudo-clases**: 10 puntos.
4. **Elementos (Etiquetas)**: 1 punto.


### Ejemplo de Conflicto:
```html
<button id="main-btn" class="btn-primary">Click</button>
```
```css
/* (0, 0, 1) = 1 punto */
button { color: blue; } 

/* (0, 1, 0) = 10 puntos -> GANA sobre 'button' */
.btn-primary { color: green; } 

/* (1, 0, 0) = 100 puntos -> GANA sobre todos */
#main-btn { color: red; } 
```

## 6. Transformaciones Básicas
Transformaciones iniciales para interactividad en cualquier pagina:
- `transform: scale(1.1)`: Aumenta el tamaño.
- `transform: rotate(45deg)`: Rota el elemento.
- `transform: translateX(20px)`: Desplaza en el eje X.

## Checklist de Implementación
- [ ] ¿He separado el CSS en un archivo externo?
- [ ] ¿Estoy usando clases en lugar de IDs para estilos reutilizables?
- [ ] ¿He verificado que no haya conflictos de especificidad innecesarios?
- [ ] ¿He definido los colores usando un sistema consistente (Hex o HSL)?
- [ ] ¿Entiendo la diferencia entre un selector de etiqueta y uno de clase?

## Relacionado
- [[HTML - Semántica y Estructura]]
- [[CSS - Box Model y Propiedades de Caja]]
- [[CSS - Especificidad Avanzada]]