---
doc: feature
id: FEAT-04
project: SharpTask
status: Planned           
priority: High          
release: MVP              
owner: Angel Gonzalez M.
depends_on: 
  - FEAT-01
  - FEAT-03
requires: 
  - RNF-02
created: 2026-03-02
updated: 2026-03-02
tags: [feature, frontend, ui, dashboard]
---

# `= this.id` — Dashboard Interactivo (Frontend)

> [!tip] Valor
> Representa la cara visible de la aplicación. Proporciona una interfaz gráfica moderna, fluida y altamente interactiva que abstrae la complejidad de la API REST, permitiendo al usuario gestionar sus tareas y notas con una experiencia de uso "premium" inspirada en UpTask.

## Historia de usuario
Como **usuario del sistema**, quiero **una interfaz web limpia y rápida** para **gestionar mis tareas y visualizar mis notas sin tener que interactuar directamente con endpoints o archivos JSON**.

## Alcance
### Incluye
- Dashboard principal con el listado global de tareas (vista en formato Lista o Kanban de dos columnas: Pendientes y Completadas).
- Modal o panel lateral (Slide-over) para ver el detalle de una tarea y su "Timeline" de notas asociadas.
- Formularios integrados para la creación y edición de tareas y notas con validación en el cliente (ej. Zod + React Hook Form).
- Feedback visual de estados de carga (Skeletons/Spinners) durante las peticiones de red.
- Sistema de notificaciones emergentes (Toasts) para confirmar acciones exitosas o mostrar errores de la API.
- Sincronización de estado asíncrono y caché en el cliente (ej. usando React Query).

### No incluye
- Sistema de autenticación o pantallas de Login/Registro.
- Modo oscuro/claro intercambiable (se asume un tema por defecto para el MVP).
- Soporte offline (PWA) si el servidor de la API está caído.
- Agrupación por proyectos (fuera del alcance del MVP).

## Requerimientos ligados
### Funcionales
- Esta característica es consumidora directa de todos los requerimientos funcionales del Backend (`RF-01` al `RF-09`).

### No funcionales
- [[RNF-02 Manejo Correcto de Códigos HTTP]] (El Frontend debe capturar los códigos `400` y `404` para mostrar mensajes amigables al usuario).

## Flujo / UX (si aplica)
- **Pantallas:** - `/`: Ruta principal (Dashboard de Tareas).
- **Interacciones clave:**
  - Al marcar una tarea como completada, el cambio debe reflejarse instantáneamente en la UI (Optimistic Update) mientras se procesa el `PATCH` en el backend.
  - Los errores de validación (ej. intentar crear una tarea sin título) deben marcar el campo en rojo antes de siquiera enviar la petición a la API.
- **Estilo:** Tarjetas blancas sobre fondo gris claro/oscuro, tipografía limpia, botones con estados *hover* y *disabled*.

## Definition of Done (DoD)
- [ ] Interfaz conectada exitosamente a la API REST local de C#.
- [ ] Todas las operaciones CRUD de Tareas pueden realizarse desde la UI.
- [ ] Todas las operaciones CRUD de Notas pueden realizarse desde el detalle de la tarea en la UI.
- [ ] Manejo de errores implementado (Si la API devuelve 500 o 400, el usuario ve un Toast rojo).
- [ ] Diseño responsivo (Mobile-first o adaptado a pantallas de escritorio).

## Notas técnicas
- **Stack:** Next.js (App Router), Tailwind CSS para estilos, React Query para el *data fetching*.
- **CORS:** El backend en ASP.NET Core deberá tener configuradas las políticas de CORS (`builder.Services.AddCors`) para permitir que el frontend en el puerto `3000` consuma la API en el puerto `5000/7000`.