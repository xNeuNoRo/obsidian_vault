---
doc: vision
project: SharpTask
status: Draft
owner: Angel Gonzalez M.
created: 2026-03-02
updated: 2026-03-02
tags:
  - vision
sticker: lucide//book-marked
---

# Visión

## Objetivo
Desarrollar una API REST robusta y un cliente web para gestionar tareas y notas (clon de UpTask). El sistema resolverá la necesidad de una gestión de tareas ligera mediante un almacenamiento basado estrictamente en archivos JSON (persistencia en disco) en lugar de una base de datos tradicional, cumpliendo con los requerimientos académicos y demostrando buenas prácticas de arquitectura.

## Contexto
Una asignación para programación 2 que consiste en un sistema ligero y de bajo costo para gestionar tareas internas. Por restricciones de infraestructura y diseño, se ha prohibido el uso de motores de bases de datos relacionales o No SQL. Toda la información debe ser manejada mediante la lectura, modificación y reescritura de colecciones en archivos de texto (`.json`).

## Alcance
### Incluye
- CRUD completo de Tareas y Notas. 
- Persistencia de datos en archivos independientes (`tasks.json`, `notes.json`) mediante un repositorio genérico. 
- Manejo seguro de concurrencia (bloqueos) para evitar sobreescritura simultánea. 
- Sistema de recuperación y tolerancia a fallos ante archivos JSON corruptos o malformados. 
- Filtros de búsqueda (ej. tareas por estado). 
- Frontend interactivo consumiendo la API real con manejo de estados de carga y errores HTTP.

### No incluye
- Autenticación o autorización de usuarios (Login/Registro). 
- Motores de Base de Datos reales (SQL Server, MongoDB, PostgreSQL). 
- Caché en memoria global como única fuente de la verdad (se debe leer/escribir el archivo en cada request).

## Criterios de éxito
- **Cumplimiento Técnico:** La API devuelve correctamente los códigos HTTP correspondientes (`200`, `201`, `400`, `404`) y valida entradas (ej. títulos no vacíos). 
- **Resiliencia:** Si un archivo JSON se corrompe intencionalmente, el sistema no colapsa (error 500), sino que lo aísla y permite que la aplicación siga funcionando. 
- **UI/UX:** El frontend refleja con precisión los estados de la base de datos (archivos JSON) sin mostrar datos desincronizados.

## Suposiciones
- El entorno donde se ejecutará la API (servidor/local) tendrá permisos suficientes de lectura/escritura en el sistema de archivos para manipular los `.json`. 
- Los IDs de los recursos serán generados dinámicamente como cadenas únicas (Guids) debido a la ausencia de un motor que maneje autoincrementables.

## Riesgos
- **Corrupción por Concurrencia:** Dos peticiones HTTP simultáneas intentando modificar y guardar el mismo archivo JSON al mismo tiempo podrían corromper la estructura. *(Mitigación: Implementación de semáforos/locks en la capa de infraestructura).* 
- **Rendimiento:** A medida que crezcan los JSON, deserializar y serializar todo el archivo en cada petición será lento. *(Aceptado: Es un trade-off necesario por la naturaleza del requerimiento).*

