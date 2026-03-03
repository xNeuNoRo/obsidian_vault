---
doc: requirement
id: RF-04
req_type: Functional      
project: SharpTask
status: Draft             
priority: High          
feature: FEAT-01
owner: Angel Gonzalez M.
created: 2026-03-02
updated: 2026-03-02
tags: [requirement, api, tasks, patch]
---

# `= this.id` — Marcar Tarea como Completada

## Descripción
**El sistema debe** proporcionar una acción rápida y dedicada para cambiar el estado de una tarea de "Pendiente" a "Completada" utilizando el método HTTP PATCH, aplicando validaciones de estado para evitar transacciones redundantes.

## Alcance
### Incluye
- Endpoint dedicado `PATCH /tasks/{id}/complete`.
- Verificación de la existencia de la tarea.
- Validación del estado actual de la tarea antes de aplicar el cambio.
- Modificación exclusiva de la propiedad `Status` dentro del archivo JSON.

### No incluye
- Revertir una tarea completada a estado "Pendiente" (el mandato no lo exige, por simplicidad se asume flujo unidireccional).
- Modificación de cualquier otro campo de la tarea (Título, Descripción, etc.) a través de este endpoint.

## Criterios de aceptación
> [!example] AC-1: Completar tarea exitosamente
> **Dado**: Una tarea existente en el sistema cuyo estado actual es "Pendiente".  
> **Cuando**: El cliente envía una petición `PATCH` a `/tasks/{id}/complete`.  
> **Entonces**: El sistema cambia el estado a "Completada", guarda el archivo `tasks.json` y retorna un código HTTP `200 OK` (o `204 No Content`) con la información actualizada.

> [!example] AC-2: Rechazo por tarea ya completada
> **Dado**: Una tarea existente en el sistema cuyo estado actual ya es "Completada".  
> **Cuando**: El cliente envía una petición `PATCH` a `/tasks/{id}/complete`.  
> **Entonces**: El sistema rechaza la operación para evitar escrituras innecesarias en el disco, y retorna un código HTTP `400 Bad Request` (o `409 Conflict`) con un mensaje indicando que la tarea ya fue completada previamente.

> [!example] AC-3: Tarea no encontrada
> **Dado**: Un ID de tarea que no existe.  
> **Cuando**: El cliente envía la petición `PATCH`.  
> **Entonces**: El sistema retorna un código HTTP `404 Not Found`.

## Reglas y validaciones
- **Eficiencia:** Al ser un `PATCH`, el cliente no necesita enviar un `body` con datos. La simple invocación a la ruta con el verbo correcto es suficiente para desencadenar la acción.
- **Inmutabilidad de Metadatos:** La fecha de creación (`CreatedAt`) y demás datos descriptivos deben mantenerse exactamente iguales tras la operación.

## Entradas / salidas
**Entradas (Path Parameters)**
- `id` (string, required): Identificador único de la tarea.
- *Body:* Vacío.

**Salidas (Response Body)**
- **Éxito (200):** Objeto `TaskItem` con su `Status` en "Completed".
- **Fallo (400/409):** Objeto de error indicando restricción de estado.
- **Fallo (404):** Error indicando recurso inexistente.

## Dependencias
- Método `UpdateAsync()` del `JsonBaseRepo<T>`.

## Casos borde
- **Concurrencia de completado:** Dos clientes intentan marcar la misma tarea como completada al mismo tiempo. *(El semáforo del repositorio procesará uno primero; el segundo intento fallará y caerá en el AC-2, retornando un 400 de forma segura).*

## Trazabilidad
- Feature: [[FEAT-01 Gestión de Tareas Core]]
- Diagramas: N/A
- Pruebas: PATCH a una tarea pendiente (espera 200), luego PATCH inmediato a la misma tarea (espera 400).