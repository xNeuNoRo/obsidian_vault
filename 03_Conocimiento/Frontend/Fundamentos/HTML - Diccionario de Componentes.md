---
doc: language-ref
area: Frontend
level: intermedio
tags:
  - html
  - components
  - reference
  - media
aliases:
  - Catálogo de Etiquetas HTML
  - HTML Elements Reference
related:
  - "[[HTML - Semántica y Estructura]]"
  - "[[Web Performance - Imágenes]]"
  - "[[HTML - Formularios y Validación]]"
refs:
  - MDN - HTML Elements
  - HTML5 Doctor - Element Index
  - web.dev - Learn HTML Images
sticker: lucide//library
---

# HTML: Diccionario de Componentes

## En una línea
Catálogo técnico de etiquetas para la representación de datos, recursos multimedia e interactividad dentro del DOM.

## 1. Contenido de Texto y Formateo Semántico
No uses estas etiquetas por su apariencia (negrita/cursiva), sino por el valor que le dan al dato.

| Etiqueta | Nombre | Uso Técnico |
| :--- | :--- | :--- |
| `<strong>` | Importancia | Indica que el contenido es vital. El navegador le da peso visual. |
| `<em>` | Énfasis | Indica un énfasis tónico. Útil para lectores de pantalla. |
| `<code>` | Código | Define un fragmento de código de computadora. Fuente monoespaciada. |
| `<pre>` | Preformateado | Respeta espacios y saltos de línea. Ideal para bloques de código. |
| `<blockquote>`| Cita larga | Sección que se cita de otra fuente. Debe incluir el atributo `cite`. |
| `<cite>` | Referencia | Título de una obra creativa (libro, película, canción). |

### Ejemplo: Documentando una API o Error
```html
<p>El sistema retornó un <strong>Error 500</strong> en el endpoint:</p>
<pre>
  <code>
    const response = await fetch('/api/v1/products');
    // Error: Internal Server Error
  </code>
</pre>
```



## 2. Enlaces e Hipervínculos (`<a>`)
La etiqueta `<a>` (anchor) es la base de la navegación web.

- **Atributo `href`**: Destino (URL, ancla `#id`, o `mailto:`).
- **Atributo `target="_blank"`**: Abre en nueva pestaña.
- **Seguridad (Patrón Senior)**: Siempre que uses `target="_blank"`, añade `rel="noopener noreferrer"` para evitar ataques de *tabnabbing*.

### Ejemplo: Enlace de Navegación Seguro
```html
<a href="[https://nvidia.com/docs](https://nvidia.com/docs)" 
   target="_blank" 
   rel="noopener noreferrer" 
   title="Ver manual de la GPU">
   Manual Técnico RTX 5090
</a>
```

## 3. Multimedia: Imágenes y Recursos
En un proyecto como **NightShop**, la carga de imágenes es el mayor cuello de botella. Aquí la optimización es ley.

### La Etiqueta `<img>`
- **`src`**: Ruta del recurso.
- **`alt`**: **Obligatorio.** Descripción textual para SEO y accesibilidad.
- **`loading="lazy"`**: **Optimización.** Indica al navegador que no cargue la imagen hasta que el usuario esté cerca de ella (ahorra ancho de banda).

```html
<figure>
    <img src="img/rtx-5090.webp" 
         alt="GPU NVIDIA RTX 5090 con tres ventiladores y luces RGB" 
         width="800" height="450"
         loading="lazy">
    <figcaption>Vista frontal de la nueva arquitectura Blackwell.</figcaption>
</figure>
```

[Image diagram showing the lazy loading process where images are loaded only when they enter the browser's viewport]

## 4. Listas y Agrupación de Datos
Ideal para menús, características de productos o pasos de instalación.

- **`<ul>` (Unordered)**: Balas/puntos. Para elementos donde el orden no importa.
- **`<ol>` (Ordered)**: Números. Para procesos o rankings.
- **`<dl>` (Description List)**: **Nivel Senior.** Útil para glosarios o pares clave-valor (ej. especificaciones técnicas).

### Ejemplo: Especificaciones de Hardware con `<dl>`
```html
<h3>Especificaciones Técnicas</h3>
<dl>
    <dt>Memoria VRAM</dt>
    <dd>32GB GDDR7</dd>
    
    <dt>Consumo Energético</dt>
    <dd>450W TDP</dd>
</dl>
```

## 5. Tablas de Datos Relacionales
Usa tablas solo para datos, nunca para maquetar el diseño de la web.

```html
<table>
    <caption>Comparativa de CPUs 2026</caption>
    <thead>
        <tr>
            <th>Modelo</th>
            <th>Núcleos</th>
            <th>Frecuencia</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>Ryzen 9 9950X</td>
            <td>16</td>
            <td>5.7 GHz</td>
        </tr>
    </tbody>
</table>
```

## 6. Comentarios y Notas de Desarrollo
Usa los comentarios para organizar secciones grandes de código, pero no dejes lógica sensible en ellos, ya que el usuario final puede verlos en el inspector de elementos.

```html
<section>
    ...
</section>
```

## Checklist de Implementación
- [ ] ¿He usado `<strong>` y `<em>` con sentido semántico y no solo estético?
- [ ] ¿Mis enlaces externos tienen `rel="noopener noreferrer"`?
- [ ] ¿Todas mis imágenes incluyen un `alt` descriptivo y `loading="lazy"`?
- [ ] ¿He preferido listas (`ul`/`ol`) para grupos de elementos similares?
- [ ] ¿He usado `<dl>` para descripciones técnicas o glosarios?
- [ ] ¿Las tablas incluyen `<thead>` y `<tbody>` para mayor claridad?

## Relacionado
- [[HTML - Semántica y Estructura]]
- [[Web Performance - Optimización de Imágenes]]
- [[SEO y Accesibilidad Web]]