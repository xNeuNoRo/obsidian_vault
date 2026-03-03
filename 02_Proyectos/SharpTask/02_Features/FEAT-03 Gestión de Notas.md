---
doc: feature
id: FEAT-03
project: SharpTask
status: Planned           
priority: Medium          
release: MVP              
owner: Angel Gonzalez M.
depends_on: 
  - FEAT-01
requires: 
  - RF-06
  - RF-07
  - RF-08
  - RF-09
  - RNF-01
  - RNF-02
created: 2026-03-02
updated: 2026-03-02
tags: [feature, notes, crud]
---

# `= this.id` — Gestión de Notas (CRUD)

> [!tip] Valor
> Proporciona a los usuarios un espacio para documentar detalles específicos, registrar observaciones y realizar un seguimiento puntual sobre una tarea en curso. Esto permite mantener un historial contextualizado y dinámico sin tener que sobrescribir o saturar la descripción principal de la tarea.

## Historia de usuario
Como **usuario del sistema**, quiero **poder gestionar notas (crear, leer, editar y eliminar) asociadas a una tarea específica** para **llevar un registro detallado de los avances, bloqueos o aclaraciones técnicas que surjan durante su ejecución**.

## Alcance
### Incluye
- Creación de notas de texto plano vinculadas estrictamente a una tarea existente (mediante `TaskId`).
- Visualización de un listado completo de notas asociadas a una tarea, ordenadas cronológicamente por su fecha de creación.
- Edición del contenido de una nota existente para corregir errores o ampliar la información (actualizando su fecha de modificación).
- Eliminación permanente de una nota individual.
- Persistencia inmediata de los cambios en el archivo físico `notes.json` haciendo uso del `JsonBaseRepo<T>`.
- Manejo de metadatos automáticos por cada nota (`Id`, `CreatedAt`, `UpdatedAt`).

### No incluye
- Creación de notas globales que no pertenezcan a ninguna tarea.
- Formato de texto enriquecido (Markdown, HTML) en el cuerpo de la nota.
- Hilos de respuestas (notas anidadas dentro de otras notas).
- Carga de archivos adjuntos (imágenes, documentos) vinculados a la nota.

## Requerimientos ligados
### Funcionales
- [[RF-06 Crear Nota]]
- [[RF-07 Listar Notas por Tarea]]
- [[RF-08 Editar Nota]]
- [[RF-09 Eliminar Nota]]

### No funcionales
- [[RNF-01 Persistencia en Archivos JSON]]
- [[RNF-02 Manejo Correcto de Códigos HTTP]]

## Flujo / UX (si aplica)
- **Pantallas:** - Las notas se renderizarán en una sección dedicada estilo "Timeline" o "Historial" dentro del panel o modal de detalles de la tarea.
  - La interfaz de creación será un simple campo de texto (textarea) con un botón "Añadir nota" al final del listado.
  - Cada burbuja de nota tendrá un menú de acciones rápidas (Editar / Eliminar).
- **Endpoints API:**
  - `POST /tasks/{taskId}/notes`
  - `GET /tasks/{taskId}/notes`
  - `PUT /tasks/{taskId}/notes/{noteId}`
  - `DELETE /tasks/{taskId}/notes/{noteId}`
- **Estados / errores:** - Intentar crear una nota para un `taskId` que no existe en `tasks.json` debe retornar un error `404 Not Found`.
  - Intentar guardar una nota sin texto o solo con espacios en blanco debe retornar `400 Bad Request`.

## Definition of Done (DoD)
- [ ] Endpoints HTTP para las 4 operaciones (CRUD) codificados y funcionales.
- [ ] Integridad referencial validada en la capa de negocio (no se permiten notas huérfanas al crear).
- [ ] DTOs de entrada implementados con validaciones estrictas (ej. contenido obligatorio).
- [ ] Persistencia verificada comprobando que las escrituras se guardan correctamente en `notes.json`.
- [ ] Manejo seguro de concurrencia al escribir notas (SemaphoreSlim implementado).
- [ ] Pruebas en Postman/Swagger completadas con éxito.

## Notas técnicas
- **Relación e Integridad:** El archivo `notes.json` almacenará objetos planos. Para obtener las notas de una tarea, el repositorio debe cargar el archivo completo y la capa de servicios/controlador filtrará usando LINQ: `.Where(n => n.TaskId == taskId)`.
- **Eliminación en cascada:** Al eliminar una tarea (`FEAT-01`), el controlador o servicio encargado del borrado deberá instanciar el repositorio de notas e invocar una eliminación masiva de todas las notas donde `TaskId` coincida con el de la tarea eliminada, previniendo así la acumulación de datos huérfanos.