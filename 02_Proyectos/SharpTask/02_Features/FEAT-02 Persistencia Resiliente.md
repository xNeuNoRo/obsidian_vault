---
doc: feature
id: FEAT-02
project: "SharpTask"
status: Planned           
priority: High          
release: MVP              
owner: "Angel Gonzalez M."
depends_on: []            
requires: 
  - RNF-01
created: 2026-03-02
updated: 2026-03-02
tags: [feature, architecture, persistence, json]
---

# `= this.id` — Persistencia Resiliente en JSON

> [!tip] Valor
> Garantiza que la aplicación funcione de manera estable, segura y sin pérdida de datos utilizando exclusivamente el sistema de archivos local, cumpliendo así con las restricciones técnicas del proyecto y evitando fallos por concurrencia.

## Historia de usuario
Como **sistema/API**, quiero **gestionar la lectura y escritura de archivos JSON mediante un repositorio centralizado con bloqueos de concurrencia** para **asegurar que múltiples usuarios o peticiones no corrompan los datos al intentar escribir al mismo tiempo**.

## Alcance
### Incluye
- Creación automática de los archivos `.json` (`tasks.json`, `projects.json`, `notes.json`) si no existen.
- Implementación de un patrón `JsonBaseRepo<T>` genérico.
- Uso de `SemaphoreSlim` para control de concurrencia (Thread-safety).
- Sistema de caché en memoria post-lectura para optimizar el rendimiento.
- Manejo de excepciones (`JsonException`) con respaldo/renombrado de archivos corruptos.

### No incluye
- Conexión a bases de datos relacionales o NoSQL.
- Backups automatizados en la nube (ej. AWS S3).
- Cifrado del contenido del archivo JSON.

## Requerimientos ligados
### Funcionales
- N/A (Es una característica estrictamente arquitectónica/de infraestructura).

### No funcionales
- [[RNF-01 Persistencia en Archivos JSON]]

## Flujo / UX (si aplica)
- **Pantallas:** N/A (Completamente invisible para el usuario final).
- **Endpoints API:** N/A (Afecta a todos los endpoints que requieran datos).
- **Estados / errores:** - Si el archivo está corrupto de forma irrecuperable, inicializar un array vacío `[]` para evitar el colapso (HTTP 500) y permitir que la app siga funcionando.

## Definition of Done (DoD)
- [ ] Clase `JsonBaseRepo<T>` codificada.
- [ ] Bloqueo de concurrencia implementado y probado.
- [ ] Recuperación ante JSON malformado verificada.
- [ ] Pruebas de carga (concurrencia masiva) pasadas sin pérdida de registros.
- [ ] Documentado en ADR.

## Notas técnicas
- **Riesgos:** Un cuello de botella en rendimiento si los archivos crecen a decenas de miles de registros (cada POST reescribe todo el archivo).
- **Consideraciones:** Asegurar que el servidor o contenedor (Docker) donde corra la aplicación tenga permisos de escritura sobre la carpeta destino.