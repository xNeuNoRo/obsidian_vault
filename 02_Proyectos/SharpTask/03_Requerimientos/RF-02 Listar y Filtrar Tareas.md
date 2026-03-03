---
doc: requirement
id: RF-02
req_type: Functional      
project: SharpTask
status: Draft             
priority: High          
feature: FEAT-01
owner: Angel Gonzalez M.
created: 2026-03-02
updated: 2026-03-02
tags: [requirement, api, tasks, list]
---

# `= this.id` — Listar y Filtrar Tareas

## Descripción
**El sistema debe** permitir obtener un listado completo de todas las tareas almacenadas en el sistema, ofreciendo la capacidad opcional de filtrarlas según su estado actual (Pendiente o Completada) mediante parámetros en la URL.

## Alcance
### Incluye
- Endpoint `GET /tasks`.
- Lectura segura del archivo `tasks.json` utilizando la caché en memoria cuando sea posible.
- Soporte para el parámetro de consulta (Query Parameter) `?status=`.
- Retorno de una lista (Array) de objetos de tipo Tarea en formato JSON.

### No incluye
- Paginación de resultados (se devuelve la lista completa para simplificar según el mandato).
- Filtros complejos múltiples (ej. filtrar por rango de fechas o búsqueda por texto en el título).

## Criterios de aceptación
> [!example] AC-1: Obtener todas las tareas (Sin filtro)
> **Dado**: Que existen tareas registradas en el archivo JSON.  
> **Cuando**: El cliente realiza una petición `GET` a `/tasks` sin parámetros de búsqueda.  
> **Entonces**: El sistema retorna un código HTTP `200 OK` y un array JSON que contiene todas las tareas almacenadas.

> [!example] AC-2: Filtrar tareas por estado
> **Dado**: Que existen tareas en estado "Pendiente" y "Completada".  
> **Cuando**: El cliente realiza una petición `GET` a `/tasks?status=Completed` (o Pending).  
> **Entonces**: El sistema retorna un código HTTP `200 OK` y un array JSON que contiene *únicamente* las tareas que coincidan exactamente con el estado solicitado.

> [!example] AC-3: Lista vacía o sin coincidencias
> **Dado**: Que no hay tareas en el sistema o ninguna coincide con el filtro aplicado.  
> **Cuando**: El cliente realiza la petición `GET` a `/tasks`.  
> **Entonces**: El sistema retorna un código HTTP `200 OK` junto con un array JSON vacío `[]` (nunca debe retornar `404` para listados vacíos).

## Reglas y validaciones
- **Parámetro `status`:** Es opcional. Si se envía un valor que no es válido (ej. `?status=Cancelado`), el sistema debe ignorar el filtro y devolver todas las tareas, o bien retornar un `400 Bad Request` indicando que el estado provisto no es soportado (se recomienda ignorarlo o enviar 400 según decisión de diseño).
- **Lectura:** Debe invocar al método `LoadAsync()` del repositorio base para aprovechar la caché en memoria y minimizar las lecturas a disco.

## Entradas / salidas
**Entradas (Query Parameters)**
- `status` (string, opcional): Enum "Pending" | "Completed".

**Salidas (Response Body)**
- **Éxito (200):** Array de objetos `TaskItem` `[ { id, title, description, createdAt, dueDate, status } ]`.

## Dependencias
- Existencia y legibilidad del archivo `tasks.json`.
- Repositorio abstracto `JsonBaseRepo<TaskItem>`.

## Casos borde
- **Archivo JSON inexistente o vacío:** Si el archivo aún no ha sido creado, el sistema (a través de `EnsureFile()`) debe generarlo automáticamente con un array vacío `[]` y retornar dicho array sin errores.
- **Archivo JSON corrupto:** Si no se puede deserializar, el bloque `catch` del repositorio lo manejará y el endpoint simplemente retornará un listado vacío `[]` y un código `200 OK`, garantizando que la UI no se rompa (ver [[RNF-01 Persistencia mediante Archivos JSON]]).

## Trazabilidad
- Feature: [[FEAT-01 Gestión de Tareas Core]]
- Diagramas: N/A
- Pruebas: GET en Postman hacia `/tasks` y `/tasks?status=Completed`.