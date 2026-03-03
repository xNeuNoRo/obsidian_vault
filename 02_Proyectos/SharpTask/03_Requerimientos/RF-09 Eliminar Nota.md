---
doc: requirement
id: RF-09
req_type: Functional      
project: SharpTask
status: Draft             
priority: Medium          
feature: FEAT-03
owner: Angel Gonzalez M.
created: 2026-03-02
updated: 2026-03-02
tags: [requirement, api, notes, delete]
---

# `= this.id` — Eliminar Nota

## Descripción
**El sistema debe** permitir la eliminación permanente y física de una nota específica vinculada a una tarea. La operación se realizará mediante el método HTTP DELETE, verificando que tanto la tarea como la nota existan antes de proceder con la actualización del archivo JSON.

## Alcance
### Incluye
- Endpoint `DELETE /tasks/{taskId}/notes/{noteId}`.
- Validación de existencia en cascada (primero validar `taskId` en `tasks.json`, luego `noteId` en `notes.json`).
- Eliminación del objeto de la colección en memoria y sobrescritura segura del archivo `notes.json`.
- Retorno de código HTTP estandarizado (`204 No Content` para éxito, `404 Not Found` para fallos).

### No incluye
- Borrado lógico (Soft Delete) cambiando un estado interno; la nota desaparece completamente del disco.
- Papelera de reciclaje o recuperación de notas eliminadas.

## Criterios de aceptación
> [!example] AC-1: Eliminación exitosa
> **Dado**: Un `taskId` y un `noteId` que existen y están correctamente vinculados en el sistema.  
> **Cuando**: El cliente envía una petición `DELETE` a `/tasks/{taskId}/notes/{noteId}`.  
> **Entonces**: El sistema remueve la nota de la colección, guarda los cambios en `notes.json` y retorna un código HTTP `204 No Content`.

> [!example] AC-2: Nota o Tarea no encontrada
> **Dado**: Un `noteId` que no existe, o que no pertenece al `taskId` especificado en la ruta.  
> **Cuando**: El cliente envía la petición `DELETE`.  
> **Entonces**: El sistema no realiza modificaciones en el archivo y retorna un código HTTP `404 Not Found`.

## Reglas y validaciones
- **Seguridad Relacional:** El método de eliminación en el repositorio no solo debe buscar por `noteId`, sino asegurar que la condición de borrado exija que `x.Id == noteId && x.TaskId == taskId` para evitar que alguien borre una nota de otra tarea adivinando el ID.

## Entradas / salidas
**Entradas (Path Parameters)**
- `taskId` (string, required): ID de la tarea padre.
- `noteId` (string, required): ID de la nota a eliminar.

**Salidas (Response Body)**
- **Éxito (204):** Sin contenido (Empty body).
- **Fallo (404):** Objeto de error indicando que el recurso solicitado no fue encontrado.

## Dependencias
- Método `DeleteAsync(cb)` del `JsonBaseRepo<Note>`.

## Casos borde
- **Eliminación y lectura simultánea:** Mientras un cliente solicita eliminar una nota, otro cliente solicita listar las notas de esa tarea. *(Manejado por el Lock de concurrencia: la lectura esperará a que termine el borrado, devolviendo la lista actualizada, o viceversa).*

## Trazabilidad
- Feature: [[FEAT-03 Gestión de Notas]]
- Diagramas: N/A
- Pruebas: Petición DELETE exitosa (espera 204), seguida de la misma petición DELETE (espera 404 para confirmar que ya no existe).