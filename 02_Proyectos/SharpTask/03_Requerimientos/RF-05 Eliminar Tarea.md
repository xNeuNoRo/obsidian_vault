---
doc: requirement
id: RF-05
req_type: Functional      
project: SharpTask
status: Draft             
priority: High          
feature: FEAT-01
owner: Angel Gonzalez M.
created: 2026-03-02
updated: 2026-03-02
tags: [requirement, api, tasks, delete]
---

# `= this.id` — Eliminar Tarea

## Descripción
**El sistema debe** permitir la eliminación permanente de una tarea existente utilizando su identificador único (ID) a través del método HTTP DELETE, asegurando que la colección en el archivo JSON se actualice correctamente y manejando los casos en los que el recurso solicitado no exista.

## Alcance
### Incluye
- Endpoint `DELETE /tasks/{id}`.
- Verificación previa de la existencia del ID en la colección.
- Eliminación del objeto de la lista y reescritura del archivo `tasks.json`.
- Retorno de códigos HTTP estandarizados (`204 No Content` o `200 OK` para éxito, `404 Not Found` para fallos por inexistencia).

### No incluye
- Soft delete (borrado lógico cambiando un estado `IsDeleted`). El borrado debe ser físico en el archivo JSON.
- Eliminación en cascada compleja (al menos no en el MVP, ya que el mandato se centra solo en tareas).
- Recuperación de tareas eliminadas (papelera de reciclaje).

## Criterios de aceptación
> [!example] AC-1: Eliminación exitosa
> **Dado**: Una tarea existente en el sistema con un ID válido.  
> **Cuando**: El cliente envía una petición `DELETE` a `/tasks/{id}`.  
> **Entonces**: El sistema remueve la tarea del archivo JSON y retorna un código HTTP `204 No Content` (o `200 OK`), confirmando que la operación se realizó sin devolver un cuerpo en la respuesta.

> [!example] AC-2: Recurso no encontrado
> **Dado**: Un ID de tarea que no existe en el almacenamiento.  
> **Cuando**: El cliente envía la petición `DELETE` a `/tasks/{id_inexistente}`.  
> **Entonces**: El sistema no realiza modificaciones en el archivo JSON y retorna un código HTTP `404 Not Found`.

## Reglas y validaciones
- **Idempotencia parcial:** Aunque `DELETE` es un método idempotente por definición en REST, intentar borrar el mismo ID dos veces seguidas retornará `204` la primera vez y `404` la segunda, lo cual es el comportamiento esperado en APIs modernas.

## Entradas / salidas
**Entradas (Path Parameters)**
- `id` (string, required): El identificador único de la tarea a eliminar.

**Salidas (Response Body)**
- **Éxito (204):** Sin contenido (Empty body).
- **Fallo (404):** Objeto JSON de error indicando que la tarea no fue encontrada.

## Dependencias
- Método `DeleteAsync()` del repositorio `JsonBaseRepo<T>`.

## Casos borde
- **Archivo bloqueado / Concurrencia:** Dos peticiones intentando modificar la colección al mismo tiempo (ej. crear una tarea y eliminar otra simultáneamente). *(El `SemaphoreSlim` del repositorio encolará las peticiones, permitiendo que la eliminación lea la lista actualizada, quite el elemento y sobrescriba el archivo de forma segura).*

## Trazabilidad
- Feature: [[FEAT-01 Gestión de Tareas Core]]
- Diagramas: N/A
- Pruebas: DELETE a un ID válido, seguido de un GET al mismo ID para confirmar el 404.