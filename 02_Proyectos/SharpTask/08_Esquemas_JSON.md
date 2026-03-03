---
doc: dictionary
id: SCH-01
project: SharpTask
status: Draft
owner: Angel Gonzalez M.
created: 2026-03-02
updated: 2026-03-02
tags:
  - json
  - database
  - schemas
  - documentation
  - backend
sticker: lucide//text
---

# 08 — Diccionario de Datos y Esquemas de Persistencia

Este documento establece la especificación técnica de los archivos JSON que actúan como la capa de persistencia del sistema. Al no existir un motor de base de datos relacional, la integridad de los datos depende estrictamente de la adherencia a estos esquemas durante las operaciones de serialización y deserialización.

## 1. Modelo de Tareas (`tasks.json`)
Este archivo almacena la lista global de tareas. Es la entidad raíz del sistema.

### Especificación del Objeto `TaskItem`
| Campo | Tipo | Requerido | Restricciones | Descripción |
| :--- | :--- | :---: | :--- | :--- |
| `Id` | `Guid` | Sí | Único (PK) | Identificador único universal. |
| `Title` | `String` | Sí | 1-100 caracteres | Título corto de la tarea. |
| `Description` | `String` | No | Máx. 500 caracteres | Detalle extenso de la actividad. |
| `Status` | `Enum` | Sí | `Pending`, `Completed` | Estado de flujo de la tarea. |
| `CreatedAt` | `DateTime` | Sí | Formato ISO 8601 | Fecha de registro inmutable. |
| `UpdatedAt` | `DateTime` | Sí | Formato ISO 8601 | Fecha de la última mutación. |

### Ejemplo de Persistencia Real
```json
[
  {
    "Id": "550e8400-e29b-41d4-a716-446655440000",
    "Title": "Finalizar documentación técnica",
    "Description": "Completar los esquemas JSON y los requerimientos funcionales.",
    "Status": "Pending",
    "CreatedAt": "2026-03-02T10:00:00.000Z",
    "UpdatedAt": "2026-03-02T10:00:00.000Z"
  }
]
```

---

## 2. Modelo de Notas (`notes.json`)
Almacena comentarios o registros de seguimiento. Cada nota está vinculada a una tarea específica.

### Especificación del Objeto `NoteItem`
| Campo | Tipo | Requerido | Restricciones | Descripción |
| :--- | :--- | :---: | :--- | :--- |
| `Id` | `Guid` | Sí | Único (PK) | ID único de la nota. |
| `TaskId` | `Guid` | Sí | FK (tasks.json) | Relación lógica con la tarea padre. |
| `Content` | `String` | Sí | Mín. 1 carácter | Texto de la observación. |
| `CreatedAt` | `DateTime` | Sí | ISO 8601 | Fecha de creación. |
| `UpdatedAt` | `DateTime` | Sí | ISO 8601 | Fecha de última edición. |

### Ejemplo de Persistencia Real
```json
[
  {
    "Id": "7c9e6679-7425-40de-944b-e07fc1f90ae7",
    "TaskId": "550e8400-e29b-41d4-a716-446655440000",
    "Content": "Se ha validado el esquema con el profesor de la asignatura.",
    "CreatedAt": "2026-03-02T11:45:30.000Z",
    "UpdatedAt": "2026-03-02T11:45:30.000Z"
  }
]
```

---

## 3. Estándares Globales de Datos

### Formato de Identificadores (UUID/Guid)
Se utilizará la versión 4 de GUID. En C#, se genera mediante `Guid.NewGuid()`. En el archivo JSON se representa como una cadena de 36 caracteres incluyendo guiones.

### Gestión de Fechas
Todas las marcas de tiempo deben manejarse bajo el estándar **UTC (Coordinated Universal Time)** para evitar conflictos de zona horaria entre el servidor y el cliente. El formato debe cumplir con `YYYY-MM-DDThh:mm:ss.sssZ`.

### Serialización de Enums
Los estados de las tareas (`Status`) se guardarán como **Strings** (`"Pending"`) y no como valores numéricos (`0`). Esto facilita la auditoría manual de los archivos solicitada en el mandato técnico.

## 4. Reglas de Integridad Referencial Lógica
Al no existir disparadores (triggers) de base de datos, la lógica de negocio debe garantizar:
1. **Validación de Existencia:** No se puede crear una nota si el `TaskId` proporcionado no existe en `tasks.json`.
2. **Limpieza en Cascada:** Al eliminar una tarea, se debe ejecutar un proceso de limpieza en `notes.json` para eliminar todas las notas asociadas al ID borrado.
3. **Bloqueo de Archivo:** Durante la escritura, el repositorio debe utilizar `SemaphoreSlim(1,1)` para evitar que dos procesos escriban en el mismo archivo simultáneamente.

## 5. Trazabilidad
- **Arquitectura:** [[05_Arquitectura]]
- **Decisiones Técnicas:** [[ADR-01 Elección de Stack y Persistencia]]
- **Requerimientos:** [[RNF-01 Persistencia en Archivos JSON]]
```