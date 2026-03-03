---
doc: requirement
id: RF-06
req_type: Functional      
project: SharpTask
status: Draft             
priority: High          
feature: FEAT-03
owner: Angel Gonzalez M.
created: 2026-03-02
updated: 2026-03-02
tags: [requirement, api, notes, create]
---

# `= this.id` — Crear Nota

## Descripción
**El sistema debe** permitir la creación de una nueva nota de texto plano asociada obligatoriamente a una tarea existente. La operación se realizará mediante una petición HTTP POST, autogenerando los metadatos de la nota (ID y Fecha de creación) y validando la integridad del contenido antes de persistirlo en el archivo JSON.

## Alcance
### Incluye
- Endpoint `POST /tasks/{taskId}/notes`.
- Validación de que la tarea especificada en la URL (`taskId`) realmente exista en `tasks.json`.
- Validación de que el campo "Contenido" (`Content`) de la nota no sea nulo ni esté vacío.
- Generación automática de `Id` (Guid) y `CreatedAt` (UTC Now).
- Almacenamiento seguro en el archivo `notes.json`.

### No incluye
- Creación de notas con formato de texto enriquecido (HTML/Markdown).
- Adjuntar archivos a la nota.
- Crear múltiples notas en una sola petición (Bulk create).

## Criterios de aceptación
> [!example] AC-1: Creación exitosa
> **Dado**: El ID de una tarea existente y un payload JSON con contenido de texto válido.  
> **Cuando**: El cliente envía una petición `POST` a `/tasks/{taskId}/notes`.  
> **Entonces**: El sistema genera la nota, la guarda en `notes.json` con el `TaskId` vinculado, y retorna un código HTTP `201 Created` junto con el objeto de la nota recién creada.

> [!example] AC-2: Tarea inexistente
> **Dado**: Un `taskId` en la URL que no existe en el archivo de tareas.  
> **Cuando**: El cliente envía la petición `POST`.  
> **Entonces**: El sistema rechaza la operación antes de procesar la nota y retorna un código HTTP `404 Not Found` indicando que la tarea no fue encontrada.

> [!example] AC-3: Contenido vacío
> **Dado**: Un payload donde el campo de contenido está vacío o solo contiene espacios en blanco.  
> **Cuando**: El cliente envía la petición `POST`.  
> **Entonces**: El sistema retorna un código HTTP `400 Bad Request` informando que el contenido de la nota es obligatorio.

## Reglas y validaciones
- **Content:** Requerido (Required / NotEmpty). Mínimo 1 carácter.
- **Integridad referencial lógica:** Aunque no hay base de datos relacional, la API debe simular la llave foránea leyendo primero `tasks.json` con un `.FindAsync(t => t.Id == taskId)` antes de permitir la escritura en `notes.json`.

## Entradas / salidas
**Entradas (Path Parameters & Request Body)**
- **Path:** `taskId` (string, required)
- **Body:**
  - `Content` (string, required)

**Salidas (Response Body)**
- **Éxito (201):** Objeto `NoteItem` completo `{ id, taskId, content, createdAt }`.
- **Fallo (404):** Error indicando que la tarea padre no existe.
- **Fallo (400):** Error de validación de datos (`ValidationProblemDetails`).

## Dependencias
- Método genérico `AppendAsync()` del repositorio `JsonBaseRepo<Note>`.
- Método `FindAsync()` del repositorio `JsonBaseRepo<TaskItem>` (para validar la existencia de la tarea).

## Casos borde
- **Creación concurrente de notas en la misma tarea:** Manejado por el `SemaphoreSlim` del repositorio de notas, que encolará las escrituras para no corromper `notes.json`.

## Trazabilidad
- Feature: [[FEAT-03 Gestión de Notas]]
- Diagramas: N/A
- Pruebas: Test de integración enviando un POST con un `taskId` inválido para comprobar el 404, y luego con uno válido para comprobar el 201.