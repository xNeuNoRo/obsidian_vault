---
doc: requirement
id: RF-07
req_type: Functional      
project: SharpTask
status: Draft             
priority: High          
feature: FEAT-03
owner: Angel Gonzalez M.
created: 2026-03-02
updated: 2026-03-02
tags: [requirement, api, notes, list]
---

# `= this.id` — Listar Notas por Tarea

## Descripción
**El sistema debe** permitir consultar todas las notas que han sido vinculadas a una tarea específica. La consulta debe devolver una lista estructurada y ordenada cronológicamente, garantizando que solo se muestren las notas correspondientes al identificador de la tarea provisto.

## Alcance
### Incluye
- Endpoint `GET /tasks/{taskId}/notes`.
- Validación previa de la existencia de la tarea (`taskId`) en el archivo `tasks.json`.
- Lectura de la colección completa desde `notes.json` utilizando la caché del repositorio.
- Filtrado en memoria de las notas donde la propiedad `TaskId` coincida con el parámetro de la ruta.
- Retorno de la lista de notas en formato JSON con un código HTTP exitoso.

### No incluye
- Paginación de resultados (se devuelve la lista completa de notas para la tarea solicitada).
- Búsqueda de texto completo dentro del contenido de las notas.

## Criterios de aceptación
> [!example] AC-1: Listado exitoso con datos
> **Dado**: Un `taskId` válido que existe en el sistema y que tiene notas asociadas.  
> **Cuando**: El cliente realiza una petición `GET` a `/tasks/{taskId}/notes`.  
> **Entonces**: El sistema retorna un código HTTP `200 OK` y un array JSON que contiene los objetos de las notas correspondientes a dicha tarea.

> [!example] AC-2: Listado vacío (Tarea sin notas)
> **Dado**: Un `taskId` válido que existe en el sistema, pero que aún no tiene notas registradas.  
> **Cuando**: El cliente realiza la petición `GET`.  
> **Entonces**: El sistema retorna un código HTTP `200 OK` y un array JSON vacío `[]`. No debe retornar 404 en este escenario.

> [!example] AC-3: Tarea inexistente
> **Dado**: Un `taskId` que no está registrado en el archivo `tasks.json`.  
> **Cuando**: El cliente realiza la petición `GET` a `/tasks/{taskId}/notes`.  
> **Entonces**: El sistema rechaza la operación tempranamente y retorna un código HTTP `404 Not Found`.

## Reglas y validaciones
- **Ordenamiento:** El array devuelto debe estar ordenado de forma ascendente por la fecha de creación (`CreatedAt`), de modo que las notas más antiguas aparezcan primero (comportamiento típico de un historial o timeline).
- **Rendimiento:** Debe utilizar el método `.LoadAsync()` del `JsonBaseRepo<Note>` para beneficiarse de la caché en memoria y luego aplicar LINQ (`.Where()`) para el filtrado.

## Entradas / salidas
**Entradas (Path Parameters)**
- `taskId` (string, required): El identificador único de la tarea padre.

**Salidas (Response Body)**
- **Éxito (200):** Array de objetos `NoteItem` `[ { id, taskId, content, createdAt } ]`.
- **Fallo (404):** Mensaje de error indicando que la tarea no fue encontrada.

## Dependencias
- Método `LoadAsync()` de `JsonBaseRepo<Note>`.
- Método `FindAsync()` de `JsonBaseRepo<TaskItem>` para verificar que el padre existe.

## Casos borde
- **Archivo `notes.json` vacío o inexistente:** El repositorio lo autogenerará con `[]`, el filtro `.Where` devolverá un array vacío y el endpoint responderá correctamente un 200 con `[]` (siempre que la tarea exista).

## Trazabilidad
- Feature: [[FEAT-03 Gestión de Notas]]
- Diagramas: N/A
- Pruebas: Petición GET con ID válido con notas, ID válido sin notas e ID inválido.