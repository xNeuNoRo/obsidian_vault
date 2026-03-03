---
doc: adr
id: ADR-01
project: SharpTask
status: Accepted          
owner: Angel Gonzalez M.
decision_date: 2026-03-02
created: 2026-03-02
updated: 2026-03-02
tags: [adr, architecture, stack, json]
---

# `= this.id` — Elección de Stack Tecnológico y Estrategia de Persistencia

## Contexto
El proyecto requiere la creación de un sistema de gestión de tareas (TODO List) compuesto por una API REST y un cliente web. La restricción principal y crítica impuesta por el mandato académico es la **prohibición absoluta de utilizar motores de bases de datos tradicionales** (como SQL Server, PostgreSQL, MongoDB o SQLite). Toda la persistencia debe manejarse obligatoriamente a través de archivos `.json` locales, garantizando la integridad de los datos, previniendo corrupciones por accesos simultáneos y manejando correctamente las caídas si el archivo se daña.

Se desea además una interfaz de usuario moderna e interactiva inspirada en la aplicación "UpTask".

## Decisión
Se ha decidido implementar la siguiente arquitectura y stack:
1. **Backend:** ASP.NET Core Web API (C#).
2. **Frontend:** Next.js (React) con Tailwind CSS y React Query.
3. **Persistencia (Patrón Repositorio Genérico):** Se utilizará una clase base `JsonBaseRepo<T>` que gestionará la lectura y escritura de archivos planos independientes por entidad (`tasks.json`, `notes.json`).
4. **Control de Concurrencia:** Se integrará un `SemaphoreSlim(1, 1)` a nivel del repositorio para garantizar acceso exclusivo al archivo (Thread-Safety) durante las operaciones de I/O.
5. **Serialización:** Se utilizará la librería nativa `System.Text.Json` por su alto rendimiento.

## Alternativas
- **Node.js/Express con `fs`:** Se descartó porque, aunque es un entorno nativo para JSON, implementar patrones empresariales sólidos (como concurrencia estricta, DTOs y abstracción de repositorios) es más robusto y estructurado en C# / .NET.
- **Un único archivo monolítico (`db.json`):** Se descartó guardar Tareas y Notas anidados en un solo archivo. Modificar el estado de una sola tarea obligaría a deserializar y volver a serializar todo el árbol de tareas, aumentando exponencialmente el tiempo de procesamiento y el riesgo de corrupción total.
- **Caché en memoria como única fuente de verdad:** Descartado automáticamente por violar el mandato. El archivo debe ser leído/escrito en las peticiones.

## Consecuencias
**Pros**
- **Cumplimiento total:** Se satisface el mandato académico al 100% aislando la lógica de archivos del resto de la aplicación.
- **Tolerancia a fallos:** Al separar en archivos por entidad, si `notes.json` se corrompe, los proyectos y tareas siguen funcionando con normalidad.
- **Rendimiento:** El uso de `System.Text.Json` junto con una caché en memoria post-lectura (`_cache`) reduce drásticamente las lecturas al disco mecánico o SSD.
- **Mantenibilidad:** El Frontend en Next.js está totalmente desacoplado y consume la API como si hubiera una base de datos real detrás.

**Contras**
- **Escalabilidad limitada:** Al actualizar un solo registro (ej. cambiar una tarea a "Completada"), el sistema debe sobrescribir todo el archivo `tasks.json`. Esto no es escalable para miles de registros, pero es un *trade-off* aceptado por el alcance y las restricciones del ejercicio.
- **Sin transacciones ACID complejas:** No es posible hacer *rollbacks* nativos si falla la eliminación en cascada (ej. borrar una tarea y sus notas asociadas al mismo tiempo).

## Relacionado
- Features: [[FEAT-01 Gestión de Tareas Core]], [[FEAT-02 Persistencia Resiliente en JSON]]
- Requerimientos: [[RNF-01 Persistencia en Archivos JSON]]
- Arquitectura/diagramas: [[05_Arquitectura]]