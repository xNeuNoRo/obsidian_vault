---
doc: language
area: Frontend
level: intermedio
tags:
  - html
  - forms
  - validation
  - accessibility
  - ux
aliases:
  - Estructura de Formularios
  - Validación de Inputs
related:
  - "[[HTML - Accesibilidad y SEO]]"
  - "[[HTML - Diccionario de Componentes]]"
refs:
  - MDN - HTML forms guide
  - web.dev - Learn Forms
  - Apuntes Propios - contacto.html
sticker: lucide//form-input
---

# HTML: Formularios y Validación

## En una línea
Interfaz que permite al usuario introducir y enviar datos al servidor, estructurada mediante componentes semánticos que garantizan la integridad de la información y la accesibilidad.

## 1. Arquitectura de un Formulario Profesional
Basado en tu implementación en `contacto.html`, un formulario no debe ser solo una lista de inputs; requiere agrupación lógica:

- **`<form>`**: El contenedor principal. Atributos clave: `action` (a dónde enviar) y `method` (cómo enviar: GET/POST).
- **`<fieldset>`**: Agrupación lógica de campos relacionados (ej. "Información Personal", "Preferencias"). Mejora la navegación con lectores de pantalla.
- **`<legend>`**: El título o encabezado del `fieldset`.



## 2. El Vínculo Crítico: Label e Input
Por accesibilidad y UX, cada control debe tener su etiqueta vinculada.
- **Técnica**: El atributo `for` del `<label>` debe coincidir con el `id` del `<input>`.
- **Beneficio**: Aumenta el área de clic (al pulsar el texto, se activa el input) y permite que los dispositivos de asistencia dicten el nombre del campo.

```html
<div class="campo">
    <label for="nombre">Nombre completo:</label>
    <input type="text" id="nombre" name="nombre" placeholder="Tu Nombre" required>
</div>
```

## 3. Tipos de Control (Inputs y Selects)
Para tu proyecto de Ecommerce, utilizaste diversos tipos de datos para optimizar la entrada en móviles:

| Etiqueta / Tipo | Uso Técnico | Ejemplo en tu código |
| :--- | :--- | :--- |
| `type="text"` | Datos genéricos. | Nombre completo. |
| `type="email"` | Valida automáticamente el formato `@`. | Correo de contacto. |
| `type="tel"` | Abre el teclado numérico en móviles. | Teléfono de contacto. |
| `<select>` | Lista desplegable cerrada. | País o categoría. |
| `<datalist>` | Sugerencias de autocompletado (input + lista). | Selección de productos. |
| `<textarea>` | Bloques grandes de texto. | Mensaje o comentarios. |

## 4. Validación Nativa (Client-side)
Antes de que los datos lleguen a tu backend (Java/C#), el navegador puede filtrar errores comunes mediante atributos:

- **`required`**: Impide el envío si el campo está vacío.
- **`minlength` / `maxlength`**: Controla la extensión del texto.
- **`pattern`**: Permite usar **Expresiones Regulares (Regex)** para validaciones complejas (ej. formato de cédula).
- **`min` / `max`**: Para rangos numéricos.

## 5. El Botón de Envío
El botón que dispara la acción debe ser de tipo `submit`.
```html
<input type="submit" value="Enviar Formulario" class="btn">
```

## Checklist de Calidad
- [ ] ¿He agrupado los campos con `fieldset` y `legend`?
- [ ] ¿Todos los `input` tienen un `id` único vinculado a un `label` con `for`?
- [ ] ¿He usado los tipos de input correctos (`email`, `tel`) para optimizar el teclado móvil?
- [ ] ¿He aplicado validaciones mínimas como `required`?
- [ ] ¿El formulario tiene un método de envío definido (`POST` para datos sensibles)?

## Relacionado
- [[HTML - Semántica y Estructura]]
- [[CSS - Box Model y Propiedades de Caja]]
- [[Web Performance - Optimización de Formularios]]