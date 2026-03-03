---
doc: architecture
project: SharpTask
status: Draft
style: N-Tier / Client-Server
owner: Angel Gonzalez M.
quality_goals:
  - maintainability
  - reliability
  - performance
created: 2026-03-02
updated: 2026-03-02
tags:
  - architecture
sticker: lucide//hammer
---

# Arquitectura

> [!summary] Intención
> SharpTask utiliza una arquitectura cliente-servidor tradicional. El Backend es una API RESTful construida en ASP.NET Core siguiendo una arquitectura en capas (N-Tier), y el Frontend es una Single Page Application (SPA) / SSR construida con Next.js.

## Objetivos de calidad
- **Rendimiento:** Minimizar operaciones de I/O en disco implementando un sistema de caché en memoria (`_cache`) dentro de la capa de persistencia tras la primera lectura.
- **Mantenibilidad:** Alta separación de responsabilidades usando el patrón Repositorio Genérico, lo que aísla la lógica de manipulación de archivos de los controladores de la API.
- **Seguridad:** Validación estricta de datos de entrada tanto en el cliente (Zod + React Hook Form) como en el servidor (Data Annotations / FluentValidation) para prevenir inyecciones o estados inválidos.
- **Confiabilidad (Reliability):** Tolerancia a fallos mediante el manejo seguro de concurrencia (Locks/Semáforos) y recuperación elegante ante archivos JSON corruptos.

## Estilo / patrón elegido
- **Elegido:** Arquitectura en Capas (N-Tier) y Patrón Repositorio (`Repository Pattern`).
- **Por qué:** Permite abstraer la complejidad de leer/escribir en archivos físicos. Al usar repositorios (`JsonBaseRepo<T>`), el resto de la aplicación interactúa con los datos como si existiera una base de datos real.
- **Trade-offs:** Para mantener la simplicidad y cumplir el mandato, cada escritura sobrescribe el archivo JSON completo. Esto es ineficiente comparado con actualizaciones parciales de un motor SQL, pero es aceptado dado el alcance del proyecto.

## Alternativas consideradas
- **Un único archivo `db.json` gigante:** Rechazado porque al modificar una simple nota, habría que deserializar y serializar todo el grafo de Tareas, aumentando el riesgo de corrupción y la penalización de rendimiento.

## Componentes
- **UI / Frontend:** Next.js (App Router), React Query para manejo de estado asíncrono, Tailwind CSS para el clon de la interfaz de UpTask.
- **API / Backend:** ASP.NET Core Web API (.NET 10), System.Text.Json para procesamiento rápido.
- **Persistencia:** Archivos planos en el servidor (`tasks.json`, `notes.json`) gestionados por clases derivadas de `JsonBaseRepo<T>`.
- **Servicios externos:** Ninguno (Sistema 100% offline/local para cumplir con los requerimientos del mandato).

## Reglas de dependencia
- **Permitido:** - La capa de Presentación (Controladores) depende de la capa de Dominio (Modelos/DTOs) y la capa de Acceso a Datos (DAL). - La capa de Acceso a Datos (DAL) depende de la capa de Dominio.
- **Prohibido:** - La capa de Dominio NO debe tener referencias a la capa de Acceso a Datos ni a `System.IO`. - El Frontend NO puede leer o modificar los archivos `.json` directamente; debe pasar siempre por la API REST.

## Diagramas
> [!note] Qué muestra cada diagrama
> Contexto = límites y actores; Componentes = módulos; Secuencia = flujo de feature.

- **Contexto:** ![[contexto.png]]
- **Componentes:** ![[componentes.png]]
- **Secuencia (ej):** ![[secuencia_login.png]]

## Feature → componentes
- [[FEAT-01 ]] → 
- [[FEAT-02 ]] → 

## Riesgos y mitigaciones
- **Riesgo:** Corrupción de datos si dos peticiones HTTP intentan escribir en `tasks.json` al mismo tiempo.
- **Mitigación:** Implementación de `SemaphoreSlim(1,1)` en el repositorio para bloquear el hilo de ejecución durante las operaciones de I/O.
- **Riesgo:** Caída del backend (Error 500) si el archivo es modificado manualmente y queda malformado.
- **Mitigación:** Captura de excepciones en la deserialización; si falla, el archivo dañado se renombra (ej. `tasks.corrupt.json`) y se devuelve una lista limpia, evitando que la API colapse.

## Evolución
- Tal vez a futuro, migrar a una base de datos real (SQL Server, MongoDB) simplemente creando nuevas clases que hereden de la misma interfaz de Repositorio, sin tener que modificar una sola línea de código en los Controladores o el Frontend.
