---
doc: requirement
id: RNF-01
req_type: NonFunctional   
project: SharpTask
status: Draft             
priority: High          
feature: FEAT-01
owner: Angel Gonzalez M.
created: 2026-03-02
updated: 2026-03-02
tags: [requirement, architecture, persistence, json]
---

# `= this.id` — Persistencia en Archivos JSON

## Descripción
**El sistema debe** prescindir completamente del uso de motores de bases de datos tradicionales (SQL/NoSQL) y gestionar toda la persistencia de datos almacenando la información de cada entidad en archivos de texto plano con formato `.json` (ej. `tasks.json`). El mecanismo de lectura/escritura debe ser seguro frente a concurrencia (Thread-Safe) y resiliente ante posibles corrupciones del archivo.

## Alcance
### Incluye
- Creación automática del archivo `.json` si no existe en el disco al momento de levantar la API.
- Implementación del patrón Repositorio Genérico (`JsonBaseRepo<T>`) para estandarizar operaciones.
- Uso de `SemaphoreSlim(1, 1)` (o mecanismo similar de Lock) para garantizar que múltiples peticiones simultáneas no intenten escribir en el archivo al mismo tiempo.
- Manejo proactivo de excepciones (`JsonException`) durante la deserialización.
- Caché en memoria (`_cache`) tras la primera lectura para evitar penalizaciones de I/O en lecturas consecutivas.

### No incluye
- Uso de SQLite, LocalDB o cualquier motor embebido.
- Mantenimiento de todo el estado en una variable estática sin escribir en disco (cada mutación de estado debe sincronizarse con el `.json`).
- Respaldo automatizado a la nube.

## Criterios de aceptación
> [!example] AC-1: Generación automática de almacenamiento
> **Dado**: Un entorno donde la aplicación se ejecuta por primera vez y no existe el archivo `tasks.json`.  
> **Cuando**: El sistema intenta realizar la primera operación de lectura o escritura.  
> **Entonces**: El sistema intercepta la falta del archivo, lo crea automáticamente inicializándolo con un array JSON vacío `[]`, y continúa la ejecución sin lanzar errores.

> [!example] AC-2: Manejo de concurrencia (Thread-Safety)
> **Dado**: Dos o más clientes enviando peticiones HTTP `POST` o `PUT` en el mismo milisegundo exacto.  
> **Cuando**: El servidor intenta abrir el archivo `.json` para escribir los cambios.  
> **Entonces**: El semáforo pone en cola las ejecuciones para que cada petición lea, modifique y escriba de forma secuencial, evitando la sobreescritura sucia o el error de "Archivo en uso por otro proceso" (IOException).

> [!example] AC-3: Resiliencia ante JSON corrupto
> **Dado**: Un archivo `tasks.json` que ha sido modificado manualmente por un usuario y tiene errores de sintaxis (JSON malformado).  
> **Cuando**: La API intenta hacer el `.LoadAsync()` y falla la deserialización (`JsonException`).  
> **Entonces**: El sistema captura la excepción, renombra el archivo defectuoso (ej. `tasks.json.corrupt`) para no perder la información, inicializa una nueva colección vacía en memoria, y la API no colapsa (no lanza HTTP 500).

## Reglas y validaciones
- **Eficiencia:** Toda operación de mutación (Crear, Editar, Completar, Eliminar) obligatoriamente sobrescribe el archivo completo mediante `System.Text.Json.JsonSerializer`.
- **Formato:** Los archivos guardados deben usar `WriteIndented = true` para que el JSON sea legible por humanos al abrirlo en un editor de texto.

## Entradas / salidas
**Entradas**
- Operaciones CRUD provenientes de los controladores.

**Salidas**
- I/O sobre el sistema de archivos del servidor (FileSystem).

## Dependencias
- Librería nativa `System.Text.Json` de .NET.
- Permisos de lectura/escritura en la carpeta base donde se aloje el ejecutable o el directorio `Data/`.

## Casos borde
- **Permisos denegados:** Si el servidor web (ej. IIS o Kestrel en Linux) no tiene permisos de escritura en el directorio destino, se lanzará una `UnauthorizedAccessException`. El Middleware global de excepciones deberá capturarlo y devolver un 500 informando del error de infraestructura.

## Trazabilidad
- Feature: [[FEAT-01 Gestión de Tareas Core]], [[FEAT-02 Persistencia Resiliente en JSON]]
- Diagramas: N/A
- Pruebas: Test de estrés con Postman Runner (100 peticiones concurrentes) para validar que no haya pérdida de datos ni colisiones.