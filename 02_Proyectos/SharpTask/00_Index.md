---
doc: project
project: SharpTask
status: Pending
type: Personal
product_owner: Angel Gonzalez M.
due: 2026-03-18
repo: https://github.com/xNeuNoRo/SharpTask
created: 2026-03-02
updated: 2026-03-02
tags:
  - project
stake_users:
  - Estudiantes
stake_client:
  - Programacion 2 - Juan Rosario
stake_team:
  - Angel Gonzalez M.
stake_external:
sticker: lucide//asterisk
---

# `= this.project`

> [!summary] Resumen
> (1–3 líneas) Qué es el proyecto y qué valor entrega.

## Estado rápido
- **Estado:** `= this.status`
- **Tipo:** `= this.type`
- **Entrega:** `= this.due`
- **Repo:** `= this.repo`

## Stakeholders
```dataview
TABLE
  stake_users AS "Usuarios afectados",
  stake_client AS "Cliente afectado",
  stake_team AS "Equipo dev",
  stake_external AS "Servicios externos"
WHERE file = this.file
```


---

## Navegación
- [[01_Vision]]
- [[04_Roadmap]]
- [[05_Arquitectura]]

**Carpetas**
- Features: `02_Features/`
- Requerimientos: `03_Requerimientos/`
- ADRs: `06_ADRs/`

---

## Vistas rápidas
### Objetivo
![[01_Vision#Objetivo]]

### MVP
![[04_Roadmap#MVP]]

---

## Entregables
- [ ] Visión + alcance
- [ ] Features + requerimientos
- [ ] Diagramas (UML/arquitectura)
- [ ] Implementación (repo)
- [ ] Presentación / demo

