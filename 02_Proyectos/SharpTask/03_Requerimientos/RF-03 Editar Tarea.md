---
doc: requirement
id: RF-03
req_type: Functional      
project: SharpTask
status: Draft             
priority: High          
feature: FEAT-01
owner: Angel Gonzalez M.
created: 2026-03-02
updated: 2026-03-02
tags: [requirement, api, tasks, update]
---

# `= this.id` — Editar Tarea

## Descripción
**El sistema debe** permitir la actualización de la información de una tarea existente mediante su identificador único (ID). La actualización será parcial o total sobre los campos permitidos, garantizando la inmutabilidad de los campos del sistema como la fecha de creación y el estado actual.

## Alcance
### Incluye
- Endpoint `PUT /tasks/{id}`.
- Modificación de los campos: Título, Descripción y Fecha límite (`DueDate`).
- Verificación de la existencia de la tarea antes de intentar actualizar.
- Protección estricta contra la modificación manual de la fecha de creación (`CreatedAt`) y el estado (`Status`).

### No incluye
- Modificar el estado a "Completada" (esto tiene su propio endpoint dedicado según el mandato).
- Modificar el `Id` de la tarea.

## Criterios de aceptación
> [!example] AC-1: Actualización exitosa
> **Dado**: Una tarea existente en el sistema y un payload JSON válido con un nuevo título.  
> **Cuando**: El cliente envía una petición `PUT` a `/tasks/{id}`.  
> **Entonces**: El sistema actualiza los campos permitidos, guarda los cambios en `tasks.json` y retorna un código HTTP `200 OK` (o `204 No Content`) con la tarea actualizada.

> [!example] AC-2: Tarea no encontrada
> **Dado**: Un ID de tarea que no existe en el archivo JSON.  
> **Cuando**: El cliente envía la petición `PUT` a `/tasks/{id_inexistente}`.  
> **Entonces**: El sistema rechaza la operación sin modificar el archivo y retorna un código HTTP `404 Not Found`.

> [!example] AC-3: Intento de alteración de campos protegidos
> **Dado**: Un payload JSON que incluye maliciosamente el campo `CreatedAt`.  
> **Cuando**: El cliente envía la petición `PUT` a `/tasks/{id}`.  
> **Entonces**: El sistema (a través de su DTO de actualización) ignora por completo el valor enviado para `CreatedAt`, actualiza solo los campos permitidos y mantiene intacta la fecha original de creación.

## Reglas y validaciones
- **Validación de campos:** El nuevo "Título" sigue siendo obligatorio y no puede estar vacío.
- **Inmutabilidad:** Los campos `CreatedAt`, `Id` y `Status` no deben estar presentes en el objeto de transferencia de datos de entrada (`UpdateTaskDto`). Si el cliente los envía en el JSON crudo, el *model binder* de .NET debe ignorarlos.

## Entradas / salidas
**Entradas (Path & Request Body - UpdateTaskDto)**
- **Path:** `id` (string, identificador de la tarea).
- **Body:** - `Title` (string, required)
  - `Description` (string, optional)
  - `DueDate` (DateTime, optional)

**Salidas (Response Body)**
- **Éxito (200):** Objeto `TaskItem` actualizado.
- **Fallo (404):** Error indicando que el recurso no existe.
- **Fallo (400):** Error de validación (ej. Título vacío).

## Dependencias
- Método `UpdateAsync(cb, newItem)` del `JsonBaseRepo<T>`.

## Casos borde
- **Edición simultánea:** Dos usuarios intentan editar la misma tarea al mismo tiempo con datos diferentes. *(El que escriba de último sobreescribirá los datos, gestionado de forma segura por el `SemaphoreSlim` para no corromper el archivo)*.

## Trazabilidad
- Feature: [[FEAT-01 Gestión de Tareas Core]]
- Diagramas: N/A
- Pruebas: PUT a `/tasks/{id}` comprobando que el `CreatedAt` de la respuesta siga siendo el original.