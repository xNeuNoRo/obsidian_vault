---
doc: feature
id: FEAT-01
project: "SharpTask"
status: Planned           
priority: High          
release: MVP              
owner: "Angel Gonzalez M."
depends_on: []            
requires: 
  - RF-01
  - RF-02
  - RF-03
  - RF-04
  - RF-05
  - RNF-01
created: 2026-03-02
updated: 2026-03-02
tags: [feature, core, crud]
---

# `= this.id` — Gestión de Tareas (Core)

> [!tip] Valor
> Proporciona la capacidad fundamental del sistema: permitir al usuario llevar un control preciso de sus pendientes diarios mediante la creación, modificación y seguimiento de tareas.

## Historia de usuario
Como **usuario del sistema** quiero **gestionar mi lista de tareas (crear, leer, actualizar, eliminar y completar)** para **mantener un control organizado de mis responsabilidades y tiempos de entrega**.

## Alcance
### Incluye
- Creación de tareas con validación obligatoria de título.
- Visualización del listado completo de tareas.
- Filtrado de tareas según su estado (Pendiente / Completada).
- Visualización del detalle de una tarea específica por su ID.
- Actualización de información básica (Título, Descripción, Fecha límite).
- Acción rápida para marcar una tarea como completada (sin alterar su fecha de creación).
- Eliminación de tareas del sistema.

### No incluye
- Asignación de tareas a otros usuarios o miembros del equipo.
- Sub-tareas o checklists dentro de una tarea principal.
- Notificaciones por vencimiento de fecha límite.

## Requerimientos ligados
### Funcionales
- [[RF-01 Crear Tarea]]
- [[RF-02 Listar y Filtrar Tareas]]
- [[RF-03 Editar Tarea]]
- [[RF-04 Marcar Tarea como Completada]]
- [[RF-05 Eliminar Tarea]]

### No funcionales
- [[RNF-01 Persistencia en Archivos JSON]]
- [[RNF-02 Manejo Correcto de Códigos HTTP]]

## Flujo / UX (si aplica)
- **Pantallas:** - Dashboard principal (Listado tipo Kanban o Lista vertical).
  - Modal / Offcanvas lateral para creación y edición (estilo UpTask).
- **Endpoints API:**
  - `POST /tasks`
  - `GET /tasks` (Soporta `?status=completed`)
  - `GET /tasks/{id}`
  - `PUT /tasks/{id}`
  - `PATCH /tasks/{id}/complete`
  - `DELETE /tasks/{id}`
- **Estados / errores:** - Validaciones de formulario (Ej. Título vacío -> `400 Bad Request`).
  - Recursos no encontrados (Ej. Editar ID inexistente -> `404 Not Found`).

## Definition of Done (DoD)
- [ ] Requerimientos definidos
- [ ] Criterios de aceptación claros
- [ ] Implementado
- [ ] Probado (mínimo vía Postman / Swagger)
- [ ] Documentado

## Notas técnicas
- **Riesgos:** Asegurar que la acción de "Completar" (`PATCH`) no modifique accidentalmente otros campos como la `CreatedAt`.
- **Consideraciones:** El profesor evaluará estrictamente que el `POST` valide el título y que el `PUT` no permita cambiar la fecha de creación manualmente.