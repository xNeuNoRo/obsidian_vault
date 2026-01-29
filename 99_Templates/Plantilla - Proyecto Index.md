---
doc: project
project: "{{title}}"
status: Pending # Pending / In Progress / Completed
type: Personal
product_owner: ""
due: 9999-02-02
repo: link-al-github
created: 9999-02-02
updated: 9999-02-02
tags:
  - project
stake_users: # Las personas que realmente usarán la aplicación
  - Estudiantes
stake_client: # Los que financian el proyecto o interesados en este mismo
  - Ing. Perez
stake_team: # Programadores, testers (QA) y diseñadores UX/UI....
  - Dev1
  - Dev2
stake_external: # Cualquier Empresa externa que proporcione APIs, servicios de nube...
  - AWS S3
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

