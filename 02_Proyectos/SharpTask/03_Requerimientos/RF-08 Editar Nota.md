---
doc: requirement
id: RF-08
req_type: Functional      
project: SharpTask
status: Draft             
priority: Medium          
feature: FEAT-03
owner: Angel Gonzalez M.
created: 2026-03-02
updated: 2026-03-02
tags: [requirement, api, notes, update]
---

# `= this.id` — Editar Nota

## Descripción
**El sistema debe** permitir la modificación del contenido de una nota existente que pertenezca a una tarea específica. La operación garantizará que solo el texto de la nota sea alterado, protegiendo la integridad de la relación con la tarea padre y los metadatos originales de creación.

## Alcance
### Incluye
- Endpoint `PUT /tasks/{taskId}/notes/{noteId}`.
- Verificación en cascada: validar que la tarea exista en `tasks.json` y posteriormente que la nota exista en `notes.json`.
- Actualización exclusiva del campo `Content`.
- Protección de los campos `Id`, `TaskId` y `CreatedAt` contra modificaciones maliciosas enviadas en el payload.

### No incluye
- Mover una nota de una tarea a otra (cambiar el `TaskId`).
- Historial de versiones de la nota (el sistema solo guarda la última versión editada).

## Criterios de aceptación
> [!example] AC-1: Edición exitosa
> **Dado**: Un `taskId` y un `noteId` válidos, junto con un payload JSON que contiene el nuevo texto.  
> **Cuando**: El cliente envía una petición `PUT` a `/tasks/{taskId}/notes/{noteId}`.  
> **Entonces**: El sistema actualiza el contenido de la nota, sobrescribe el archivo `notes.json` de forma segura y retorna un código HTTP `200 OK` con la nota actualizada.

> [!example] AC-2: Nota no encontrada
> **Dado**: Un `noteId` que no existe en el almacenamiento o que no pertenece al `taskId` indicado en la ruta.  
> **Cuando**: El cliente envía la petición `PUT`.  
> **Entonces**: El sistema no realiza modificaciones y retorna un código HTTP `404 Not Found`.

> [!example] AC-3: Contenido inválido
> **Dado**: Un payload donde el campo de contenido es nulo, vacío o tiene solo espacios.  
> **Cuando**: El cliente envía la petición `PUT`.  
> **Entonces**: El sistema rechaza la solicitud por validación y retorna un código HTTP `400 Bad Request`.

## Reglas y validaciones
- **Inmutabilidad Relacional:** El DTO de entrada para actualización (`UpdateNoteDto`) solo debe exponer la propiedad `Content`. Cualquier otro campo enviado será ignorado por el *model binder*.
- **Validación Cruzada:** La nota encontrada no solo debe existir por su `noteId`, sino que su propiedad `TaskId` debe coincidir obligatoriamente con el `taskId` de la ruta.

## Entradas / salidas
**Entradas (Path Parameters & Request Body)**
- **Path:** `taskId` (string), `noteId` (string).
- **Body:**
  - `Content` (string, required)

**Salidas (Response Body)**
- **Éxito (200):** Objeto `NoteItem` actualizado.
- **Fallo (404):** Error indicando recurso no encontrado (Tarea o Nota).
- **Fallo (400):** Error de validación del contenido.

## Dependencias
- Método `UpdateAsync()` del `JsonBaseRepo<Note>`.

## Casos borde
- **Edición concurrente:** Si dos usuarios intentan editar la misma nota exactamente al mismo tiempo con textos distintos, el `SemaphoreSlim` del repositorio procesará uno primero y el otro después; la nota quedará con el texto del último en ser procesado.

## Trazabilidad
- Feature: [[FEAT-03 Gestión de Notas]]
- Diagramas: N/A
- Pruebas: Petición PUT a una nota válida comprobando que su `CreatedAt` se mantenga idéntico tras la actualización.