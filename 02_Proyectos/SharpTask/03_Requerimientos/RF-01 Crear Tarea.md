---
doc: requirement
id: RF-01
req_type: Functional      
project: SharpTask
status: Draft             
priority: High          
feature: FEAT-01
owner: Angel Gonzalez M.
created: 2026-03-02
updated: 2026-03-02
tags: [requirement, api, tasks]
---

# `= this.id` — Crear Tarea

## Descripción
**El sistema debe** permitir la creación de una nueva tarea mediante una petición HTTP POST, validando la integridad de los datos recibidos (especialmente el título), autogenerando los campos de sistema (ID, Fecha de creación, Estado inicial) y almacenando el registro de forma persistente en el archivo correspondiente.

## Alcance
### Incluye
- Endpoint `POST /tasks` .
- Validación estricta de que el campo "Título" no esté vacío ni nulo.
- Generación automática de `Id` (Guid), `CreatedAt` (UTC Now) y `Status` (Pendiente).
- Retorno del código HTTP adecuado según el resultado de la operación.

### No incluye
- Asignación de la tarea a un usuario o equipo específico.
- Creación de tareas recurrentes o repetitivas.
- Carga de archivos adjuntos en la tarea.

## Criterios de aceptación
> [!example] AC-1: Creación exitosa
> **Dado**: Un payload JSON válido con al menos un título no vacío.  
> **Cuando**: El cliente envía una petición `POST` al endpoint de creación de tareas.  
> **Entonces**: El sistema genera el ID y la fecha de creación, establece el estado en "Pendiente", guarda la tarea en el archivo `tasks.json`, y retorna un código HTTP `201 Created` junto con el objeto de la tarea recién creada.

> [!example] AC-2: Fallo por título vacío
> **Dado**: Un payload JSON donde el campo "Título" está vacío, es nulo o solo contiene espacios.  
> **Cuando**: El cliente envía la petición `POST`.  
> **Entonces**: El sistema rechaza la solicitud antes de intentar leer/escribir el archivo, y retorna un código HTTP `400 Bad Request` indicando que el título es obligatorio.

## Reglas y validaciones
- **Title:** Requerido (Required / NotEmpty). Mínimo 1 carácter, máximo recomendado 100 caracteres.
- **Description:** Opcional.
- **DueDate:** Opcional. Si se provee, debe ser una fecha válida.
- **Status:** Al crear, se ignora lo que envíe el usuario y se fuerza por defecto a `Pending`.
- **CreatedAt:** El cliente no puede enviarla; se establece en el servidor (`DateTime.UtcNow`).

## Entradas / salidas
**Entradas (Request Body - DTO)**
- `Title` (string, required)
- `Description` (string, optional)
- `DueDate` (DateTime, optional)

**Salidas (Response Body)**
- **Éxito (201):** Objeto `TaskItem` completo incluyendo `Id`, `CreatedAt` y `Status`.
- **Fallo (400):** Objeto de error estándar de ASP.NET Core (`ValidationProblemDetails`) con el listado de campos que fallaron.

## Dependencias
- Capa de validación (Ej. Data Annotations o FluentValidation en C#).
- Funcionalidad de escritura concurrente segura del `JsonBaseRepo` ([[RNF-01 Persistencia mediante Archivos JSON]]).

## Casos borde
- **Concurrencia masiva:** Múltiples clientes enviando la petición de crear al mismo exacto milisegundo. *(Manejado por el semáforo del repositorio, que pondrá las peticiones en cola de escritura).*
- **JSON previo corrupto:** Intentar agregar una tarea cuando el archivo `tasks.json` en disco está corrupto. *(El sistema debe aislar el archivo corrupto y crear uno nuevo para evitar que falle el POST).*

## Trazabilidad
- Feature: [[FEAT-01 Gestión de Tareas Core]]
- Diagramas: N/A
- Pruebas: Tests en Swagger / Postman (Probar envío con título vacío y envío correcto).