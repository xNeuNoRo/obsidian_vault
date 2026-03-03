---
doc: requirement
id: RNF-02
req_type: NonFunctional   
project: SharpTask
status: Draft             
priority: High          
feature: FEAT-01
owner: Angel Gonzalez M.
created: 2026-03-02
updated: 2026-03-02
tags: [requirement, api, http, error-handling]
---

# `= this.id` — Manejo Correcto de Códigos HTTP y Errores

## Descripción
**El sistema debe** adherirse estrictamente a las convenciones de la arquitectura RESTful en cuanto a la semántica de los métodos HTTP (GET, POST, PUT, PATCH, DELETE) y asegurar que cada respuesta del servidor utilice el código de estado HTTP adecuado para reflejar el resultado de la operación. Además, las respuestas de error deben tener un formato estandarizado.

## Alcance
### Incluye
- Uso de códigos de éxito: `200 OK` (lecturas y actualizaciones), `201 Created` (creación de recursos) y `204 No Content` (eliminaciones).
- Uso de códigos de error de cliente: `400 Bad Request` (errores de validación de entrada), `404 Not Found` (recursos inexistentes) y `409 Conflict` (problemas de estado, como completar algo ya completado).
- Uso de códigos de error de servidor: `500 Internal Server Error` (excepciones no controladas).
- Implementación de un Middleware Global de manejo de excepciones en ASP.NET Core para interceptar errores y evitar exponer el *stack trace* al cliente.

### No incluye
- Códigos HTTP relacionados con autenticación/autorización (`401 Unauthorized`, `403 Forbidden`), ya que el MVP no requiere gestión de usuarios.

## Criterios de aceptación
> [!example] AC-1: Respuestas exitosas semánticas
> **Dado**: Una operación válida solicitada por el cliente.  
> **Cuando**: El servidor procesa exitosamente la solicitud.  
> **Entonces**: El sistema retorna `201` si se creó una tarea, `204` si se eliminó, o `200` si se consultó o actualizó, en lugar de usar un `200 OK` genérico para todo.

> [!example] AC-2: Errores de validación estandarizados
> **Dado**: Un payload que no cumple con las reglas del negocio (ej. título de tarea vacío).  
> **Cuando**: El cliente envía la solicitud al servidor.  
> **Entonces**: El sistema retorna un código `400 Bad Request` junto con un cuerpo JSON estructurado (ej. `ValidationProblemDetails` de .NET) que indica exactamente qué campo falló y por qué.

> [!example] AC-3: Intercepción de fallos catastróficos
> **Dado**: Un error inesperado en tiempo de ejecución (ej. se borra la carpeta contenedora del JSON manualmente mientras el servidor corre).  
> **Cuando**: La aplicación lanza una excepción no controlada (`IOException`).  
> **Entonces**: El Middleware Global captura la excepción, previene que la aplicación se congele o muestre código sensible, y retorna un elegante `500 Internal Server Error` con un mensaje genérico ("Ocurrió un error interno en el servidor").

## Reglas y validaciones
- **Nunca devolver 200 ante un fallo:** Una mala práctica común es devolver `200 OK` con un JSON que dice `{ "success": false }`. Este sistema prohíbe ese anti-patrón.

## Entradas / salidas
**Salidas (Response format para Errores 400)**
```json
{
  "type": "[https://tools.ietf.org/html/rfc7231#section-6.5.1](https://tools.ietf.org/html/rfc7231#section-6.5.1)",
  "title": "One or more validation errors occurred.",
  "status": 400,
  "errors": {
    "Title": ["El título no puede estar vacío."]
  }
}
```

## Dependencias

- Filtros de validación automáticos de ASP.NET Core (`[ApiController]`).
    
- Custom Exception Handler Middleware configurado en el `Program.cs`.
    

## Casos borde

- **Peticiones a rutas inexistentes:** Si el frontend hace un POST a `/api/tareas` (en lugar de `/tasks`), el framework devolverá automáticamente un `404 Not Found` sin llegar a los controladores, manteniendo el estándar.
    

## Trazabilidad

- Feature: [[FEAT-01 Gestión de Tareas Core]]
    
- Pruebas: Provocar errores intencionales en Swagger y validar que el código de la cabecera HTTP coincida con el esperado.