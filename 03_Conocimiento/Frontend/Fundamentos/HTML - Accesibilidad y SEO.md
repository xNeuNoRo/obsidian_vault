---
doc: language-core
area: Frontend
level: intermedio
tags:
  - html
  - seo
  - accessibility
  - a11y
  - metadata
aliases:
  - HTML Inclusivo
  - Optimización para Buscadores
  - Estándares ARIA
related:
  - "[[HTML - Semántica y Estructura]]"
  - "[[Web Performance - Core Web Vitals]]"
  - "[[UX - Diseño Inclusivo]]"
refs:
  - W3C - Web Accessibility Initiative (WAI)
  - Google Search Central - SEO Starter Guide
  - A11y Project
sticker: lucide//accessibility
---

# HTML: Accesibilidad y SEO

## En una línea
Conjunto de técnicas y estándares que aseguran que el contenido web sea rastreable por máquinas (SEO) y utilizable por personas con diversas capacidades (A11y).

## 1. SEO Semántico: Hablando con los Algoritmos
El SEO no es "magia", es darle estructura a los datos. Los bots de Google consumen el HTML para indexar tu aplicación.

### A. Metadatos Críticos (`<head>`)
Son invisibles para el usuario pero vitales para el ranking.
- **Title Tag**: El factor de SEO on-page más importante. Debe ser único por página.
- **Meta Description**: El resumen que aparece en los resultados de búsqueda.
- **Canonical Tag**: Indica cuál es la versión "oficial" de una página para evitar penalizaciones por contenido duplicado.

### B. Open Graph y Twitter Cards
Protocolos que controlan cómo se ve tu sitio cuando se comparte en redes sociales (WhatsApp, Discord, Twitter).

```html
<meta property="og:title" content="NightShop | Hardware de Alto Rendimiento">
<meta property="og:description" content="Consigue las últimas GPUs y CPUs con envío a todo el país.">
<meta property="og:image" content="[https://nightshop.com/assets/banner-og.jpg](https://nightshop.com/assets/banner-og.jpg)">
<meta name="twitter:card" content="summary_large_image">
```

[Image showing a preview of a website link on Discord/WhatsApp, highlighting how Open Graph tags render the image, title, and description]

## 2. Accesibilidad (A11y): Desarrollo Inclusivo
La accesibilidad no es una característica opcional; es un derecho. En el desarrollo de software moderno, se sigue el estándar **WCAG** (Web Content Accessibility Guidelines).

### A. El rol de los Landmarks
Las etiquetas semánticas (`<main>`, `<nav>`, `<header>`) actúan como puntos de referencia. Los usuarios de lectores de pantalla pueden "saltar" entre estas regiones sin tener que escuchar todo el documento.

### B. Atributos ARIA (Accessible Rich Internet Applications)
Se usan cuando el HTML semántico no es suficiente para describir la función de un elemento complejo.

| Atributo | Propósito | Ejemplo |
| :--- | :--- | :--- |
| `aria-label` | Etiqueta invisible pero descriptiva. | Un botón de "Cerrar" que solo tiene una "X". |
| `aria-hidden` | Esconde elementos del lector de pantalla. | Iconos decorativos que no aportan info. |
| `aria-expanded` | Indica si un menú/acordeón está abierto. | Menús desplegables (dropdowns). |
| `role` | Define la función de un elemento genérico. | `role="alert"` para mensajes de error. |

### C. Ejemplo: Botón de Acción con Icono (Patrón Senior)
```html
<button class="btn-cart"><i class="fas fa-shopping-cart"></i></button>

<button class="btn-cart" aria-label="Añadir al carrito">
    <i class="fas fa-shopping-cart" aria-hidden="true"></i>
</button>
```

## 3. Jerarquía y Contraste: Estructura Visual Lógica
Una buena accesibilidad también beneficia a usuarios sin discapacidades (ej. alguien usando el móvil bajo el sol o con una conexión lenta).

- **Foco del Teclado**: Nunca quites el `outline` de los elementos enfocables (botones, enlaces) a menos que proporciones un estilo visual alternativo claro.
- **Jerarquía de Encabezados**: No uses `<h3>` para que el texto sea pequeño; usa CSS. El orden de los encabezados debe permitir navegar el sitio solo con los títulos.
- **Click Areas**: Asegura que los botones y enlaces tengan un área de clic de al menos **44x44px** para facilitar el uso en pantallas táctiles.

## 4. Técnicas Senior de Contenido
- **Texto Alternativo (`alt`)**: No describas la imagen ("Foto de CPU"), describe el propósito ("Procesador Ryzen 9 instalado en placa base"). Si la imagen es puramente decorativa, usa `alt=""` (vacío) para que el lector de pantalla la ignore.
- **Formularios Accesibles**: Siempre vincula un `<label>` con su `<input>` mediante el atributo `for` e `id`. Esto aumenta el área de clic y da contexto.

```html
<label for="email-user">Correo Electrónico:</label>
<input type="email" id="email-user" name="email" placeholder="angel@itla.edu.do" required>
```



## Checklist de Calidad (A11y & SEO)
- [ ] ¿Cada página tiene un `<title>` y una `<meta description>` únicas?
- [ ] ¿He configurado los tags de Open Graph para redes sociales?
- [ ] ¿Todas las imágenes tienen un atributo `alt` (aunque sea vacío para decorativas)?
- [ ] ¿Los botones que solo tienen iconos incluyen un `aria-label`?
- [ ] ¿La jerarquía de títulos (`h1`-`h6`) es lógica y no tiene saltos?
- [ ] ¿Los formularios tienen etiquetas (`label`) correctamente vinculadas?
- [ ] ¿He verificado el contraste de color para que el texto sea legible?

## Relacionado
- [[HTML - Semántica y Estructura]]
- [[HTML - Formularios y Validación]]
- [[UX - Psicología del Color y Contraste]]