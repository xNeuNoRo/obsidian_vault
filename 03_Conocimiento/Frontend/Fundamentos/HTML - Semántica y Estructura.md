---
doc: language-core
area: Frontend
level: intermedio
tags:
  - html
  - semantics
  - architecture
  - dom
  - web-performance
aliases:
  - Estructura Semántica HTML
  - HTML5 Architecture
  - DOM Tree Fundamentals
related:
  - "[[DOM - Document Object Model]]"
  - "[[Web Performance - Optimización]]"
  - "[[SEO y Metadatos Avanzados]]"
refs:
  - MDN Web Docs - HTML Elements Reference
  - WHATWG HTML Living Standard
  - Google Developers - Web Fundamentals
sticker: lucide//layout-template
---

# HTML: Semántica y Estructura Arquitectónica

## 1. El Concepto: HTML como Grafo de Objetos (DOM)
Para un desarrollador en formación como Angel Gonzalez, el HTML no es un lenguaje de diseño, sino una **notación para construir un árbol de objetos en memoria**.

- **El DOM (Document Object Model):** El navegador parsea el HTML y crea un árbol de nodos. Cada cambio que hagas con JavaScript o CSS es, en esencia, una operación sobre este grafo.
- **User Agent Stylesheet:** Cada navegador tiene un CSS por defecto. La estructura semántica asegura que, incluso sin estilos, la información mantenga una jerarquía lógica y legible (importante para accesibilidad y dispositivos con recursos limitados).



## 2. El "Boilerplate" de Ingeniería
Esta configuración optimiza la seguridad, el rendimiento y la compatibilidad de tus proyectos, ya sea para el ITLA o desarrollos personales como **NightCloud**.

```html
<!DOCTYPE html>
<html lang="es"> <head>
    <meta charset="UTF-8"> <meta http-equiv="X-UA-Compatible" content="IE=edge"> 
    <meta name="viewport" content="width=device-width, initial-scale=1.0"> <link rel="preconnect" href="[https://fonts.googleapis.com](https://fonts.googleapis.com)"> 
    <link rel="preload" href="style.css" as="style"> 
    
    <meta property="og:title" content="NightShop | Hardware E-commerce">
    <meta property="og:description" content="Plataforma de hardware desarrollada por NightCoders Lab.">
    
    <title>NightShop - Componentes de Alto Rendimiento</title>
</head>
<body>
    </body>
```

## 3. Arquitectura del Layout Semántico
HTML5 introdujo etiquetas con **valor descriptivo**. Su uso correcto define la calidad del software.

| Componente | Etiqueta | Justificación Técnica |
| :--- | :--- | :--- |
| **Cabecera Global** | `<header>` | Contiene el branding y la identidad del documento. |
| **Navegación** | `<nav>` | Define el mapa de rutas. Crucial para el rastreo de bots. |
| **Contenedor Principal** | `<main>` | Región de contenido único. Solo debe existir uno por página. |
| **Sección Temática** | `<section>` | Agrupa contenido relacionado. **Debe** tener un título (`h2-h6`). |
| **Contenido Autónomo** | `<article>` | Representa una entidad de datos completa e independiente. |
| **Información Auxiliar** | `<aside>` | Contenido relacionado pero no esencial (filtros, sidebars). |
| **Cierre de Contexto** | `<footer>` | Información de cierre, legal o metadatos de autoría. |



## 4. Ejemplos Prácticos de Implementación

### A. Estructura de Navegación Compleja (`<nav>`)
No limites el nav a una lista simple; puede contener estructuras jerárquicas.

```html
<nav aria-label="Navegación Principal">
    <ul>
        <li><a href="/home">Inicio</a></li>
        <li>
            <a href="/productos">Hardware</a>
            <ul>
                <li><a href="/productos/gpu">Tarjetas de Video</a></li>
                <li><a href="/productos/cpu">Procesadores</a></li>
            </ul>
        </li>
        <li><a href="/contacto">Contacto</a></li>
    </ul>
</nav>
```

### B. Uso de `<section>` y `<article>` en un Grid
Ideal para tu proyecto de E-commerce. Nota cómo cada producto es un `article` porque es independiente.

```html
<section id="ofertas" aria-labelledby="ofertas-title">
    <h2 id="ofertas-title">Ofertas de la Semana</h2>
    <div class="product-grid"> <article class="card">
            <header>
                <h3>RTX 4090 OC</h3>
            </header>
            <p>Rendimiento extremo para gaming 4K.</p>
            <footer>
                <span>$1,599.00</span>
                <button type="button">Comprar</button>
            </footer>
        </article>
    </div>
</section>
```

### C. El `<aside>` para Sidebars Técnicos
Útil para filtros de búsqueda o anuncios laterales.

```html
<main>
    <section> </section>
    
    <aside class="sidebar-filters">
        <h3>Filtrar por:</h3>
        <form>
            <label><input type="checkbox"> En stock</label>
            <label><input type="checkbox"> Envío rápido</label>
        </form>
    </aside>
</main>
```

## 5. El Algoritmo de "Outline" (Títulos)
La jerarquía de títulos (`h1`-`h6`) es el **mapa lógico** de tu aplicación.
- **H1:** El tema central (solo uno por página).
- **Flujo Descendente:** No saltes niveles (ej. de `h1` a `h3`).

**Ejemplo de Jerarquía Lógica:**
```html
<h1>NightShop Hardware</h1> <h2>Procesadores</h2> <h3>AMD Ryzen</h3> <h4>Ryzen 9 7950X</h4> <h2>Tarjetas de Video</h2> 
```

## 6. Accesibilidad (A11y) y Patrones Senior
- **Landmarks:** Las etiquetas semánticas permiten que usuarios con discapacidad salten secciones rápidamente.
- **Aria-label:** Úsalo si un elemento no tiene texto visual descriptivo.
- **Alt Text:** Describe la función o contenido de la imagen, no solo lo que es.

```html
<a href="[https://github.com](https://github.com)" aria-label="Visitar nuestro repositorio en GitHub">
    <i class="icon-github"></i>
</a>
```

## Checklist de Calidad
- [ ] ¿El documento tiene un solo `<h1>` descriptivo?
- [ ] ¿El contenido principal está envuelto en un `<main>`?
- [ ] ¿Las imágenes informativas tienen el atributo `alt`?
- [ ] ¿He evitado la "divitis" usando etiquetas de sección (`article`, `section`)?
- [ ] ¿Los scripts están cargados con `defer` para no bloquear el renderizado?

## Relacionado
- [[HTML - Diccionario de Componentes]]
- [[CSS - Box Model y Flujo]]
- [[DOM - Document Object Model]]