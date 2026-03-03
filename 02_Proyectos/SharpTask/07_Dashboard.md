---
doc: dashboard
project: sharptask_app
project_path: 02_Proyectos/SharpTask
owner: ""
status: Active
created: 2026-01-25
updated: 2026-01-25
tags:
  - dashboard
sticker: lucide//airplay
---

# 🧭 Dashboard — `= this.project`

## 🔗 Accesos
- [[00_Index]]
- [[01_Vision]]
- [[04_Roadmap]]
- [[05_Arquitectura]]

---

## 👥 Stakeholders
```dataviewjs
const path = dv.current().project_path;
const p = dv.pages(`"${path}"`).where(x => x.doc === "project").first();

function pill(t){
  return `<span style="padding:2px 10px;border-radius:999px;border:1px solid var(--background-modifier-border);font-size:.85em;margin:0 6px 6px 0;display:inline-block;">${t}</span>`;
}
function card(title, items){
  const body = (items && items.length) ? items.map(x => pill(x)).join("") : "—";
  return `<div style="border:1px solid var(--background-modifier-border);border-radius:12px;padding:10px 12px;margin:8px 0;background:var(--background-primary);">
    <div style="font-weight:700;margin-bottom:8px;">${title}</div>
    <div>${body}</div>
  </div>`;
}

if (!p) {
  dv.paragraph("—");
} else {
  const users  = p.stake_users ?? [];
  const client = p.stake_client ?? [];
  const team   = p.stake_team ?? [];
  const ext    = p.stake_external ?? [];

  dv.el("div",
    card("Usuarios afectados", users) +
    card("Cliente / Proveedor", client) +
    card("Equipo dev", team) +
    card("Servicios externos", ext)
  );
}
```

---

# 🧩 Features

```dataviewjs
const path = dv.current().project_path;
const pages = dv.pages(`"${path}"`).where(p => p.doc === "feature");

function pill(t){
  return `<span style="padding:2px 10px;border-radius:999px;border:1px solid var(--background-modifier-border);font-size:.85em;margin:0 6px 6px 0;display:inline-block;">${t}</span>`;
}
function obsidianLink(file) {
  const p = String(file.path).replace(/"/g, "&quot;");
  const name = String(file.name).replace(/</g, "&lt;").replace(/>/g, "&gt;");
  return `<a class="internal-link" data-href="${p}" href="${p}">${name}</a>`;
}
function card(p){
  const id = p.id ?? p.file.name;
  const rel = p.release ?? "—";
  const st  = p.status ?? "—";
  const pr  = p.priority ?? "—";
  const deps = (p.depends_on && p.depends_on.length) ? pill(`deps: ${p.depends_on.length}`) : "";
  return `<div style="border:1px solid var(--background-modifier-border);border-radius:12px;padding:10px 12px;margin:8px 0;background:var(--background-primary);">
    <div style="font-weight:700;">${obsidianLink(p.file)}</div>
    <div style="margin-top:8px;">
      ${pill(id)} ${pill(rel)} ${pill(st)} ${pill(pr)} ${deps}
    </div>
  </div>`;
}
function section(title, list){
  dv.header(2, title);
  if (!list || list.length === 0) { dv.paragraph("—"); return; }
  dv.el("div", list.map(card).join(""));
}

const priorityRank = { High: 0, Medium: 1, Low: 2 };
const sortByPriority = (a,b) => (priorityRank[a.priority] ?? 9) - (priorityRank[b.priority] ?? 9);

// Defaults reales
const DEFAULT_RELEASES = ["MVP", "Future"];

// Secciones “default”
const mvp  = pages.where(p => (p.release ?? "") === "MVP").array().sort(sortByPriority);
const fut  = pages.where(p => (p.release ?? "") === "Future").array().sort(sortByPriority);

// En progreso siempre aparte (independiente del release)
const doing = pages.where(p => ["In Progress","Doing"].includes(p.status ?? "")).array().sort(sortByPriority);

section("🏃 En progreso", doing);
section("🚀 MVP", mvp);
section("💡 Future", fut);

// Otros releases automáticos (Iteration-2 cae aquí, y cualquier otro)
const other = pages
  .where(p => (p.release ?? "") && !DEFAULT_RELEASES.includes(p.release))
  .array()
  .sort(sortByPriority);

const grouped = {};
for (const p of other) {
  const key = p.release;
  (grouped[key] ||= []).push(p);
}

const otherKeys = Object.keys(grouped).sort((a,b) => a.localeCompare(b));
for (const k of otherKeys) {
  section(`📦 ${k}`, grouped[k].sort(sortByPriority));
}

// Sin release
const noRelease = pages.where(p => !(p.release ?? "")).array().sort(sortByPriority);
section("🗂️ Sin release", noRelease);
```

---

# 📋 Requerimientos

```dataviewjs
const path = dv.current().project_path;
const reqs = dv.pages(`"${path}"`).where(p => p.doc === "requirement");

function pill(t){
  return `<span style="padding:2px 10px;border-radius:999px;border:1px solid var(--background-modifier-border);font-size:.85em;margin:0 6px 6px 0;display:inline-block;">${t}</span>`;
}
function card(r){
  const id = r.id ?? r.file.name;
  const t  = r.req_type ?? "—";
  const st = r.status ?? "—";
  const pr = r.priority ?? "—";
  const ft = r.feature ?? "—";
  return `<div style="border:1px solid var(--background-modifier-border);border-radius:12px;padding:10px 12px;margin:8px 0;background:var(--background-primary);">
    <div style="font-weight:700;">${obsidianLink(r.file)}</div>
    <div style="margin-top:8px;">
      ${pill(id)} ${pill(t)} ${pill(st)} ${pill(pr)} ${pill(ft)}
    </div>
  </div>`;
}
function section(title, list){
  dv.header(2, title);
  if (!list || list.length === 0) { dv.paragraph("—"); return; }
  dv.el("div", list.map(card).join(""));
}
function obsidianLink(file) {
  const path = String(file.path).replace(/"/g, "&quot;");
  const name = String(file.name).replace(/</g, "&lt;").replace(/>/g, "&gt;");
  return `<a class="internal-link" data-href="${path}" href="${path}">${name}</a>`;
}

const priorityRank = { High: 0, Medium: 1, Low: 2 };
const sortByPriority = (a,b) => (priorityRank[a.priority] ?? 9) - (priorityRank[b.priority] ?? 9);

const pending = reqs
  .where(r => !["Implemented","Dropped"].includes(r.status ?? ""))
  .array()
  .sort(sortByPriority);

const highPending = pending.filter(r => (r.priority ?? "") === "High");

section("🚨 High pendientes", highPending);
section("🧾 Pendientes", pending);

dv.header(2, "🧷 Pendientes por Feature");
if (pending.length === 0) {
  dv.paragraph("—");
} else {
  const groups = {};
  for (const r of pending) {
    const key = r.feature ?? "Sin feature";
    (groups[key] ||= []).push(r);
  }
  const keys = Object.keys(groups).sort((a,b) => a.localeCompare(b));
  for (const k of keys) {
    dv.header(3, k);
    dv.el("div", groups[k].sort(sortByPriority).map(card).join(""));
  }
}
```

---

# 🧾 ADRs

```dataviewjs
const path = dv.current().project_path;
const adrs = dv.pages(`"${path}"`).where(p => p.doc === "adr");

function pill(t){
  return `<span style="padding:2px 10px;border-radius:999px;border:1px solid var(--background-modifier-border);font-size:.85em;margin:0 6px 6px 0;display:inline-block;">${t}</span>`;
}
function card(a){
  const id = a.id ?? a.file.name;
  const st = a.status ?? "—";
  const dt = a.decision_date ?? a.created ?? "—";
  return `<div style="border:1px solid var(--background-modifier-border);border-radius:12px;padding:10px 12px;margin:8px 0;background:var(--background-primary);">
    <div style="font-weight:700;">${obsidianLink(a.file)}</div>
    <div style="margin-top:8px;">
      ${pill(id)} ${pill(st)} ${pill(dt)}
    </div>
  </div>`;
}
function section(title, list){
  dv.header(2, title);
  if (!list || list.length === 0) { dv.paragraph("—"); return; }
  dv.el("div", list.map(card).join(""));
}
function obsidianLink(file) {
  const path = String(file.path).replace(/"/g, "&quot;");
  const name = String(file.name).replace(/</g, "&lt;").replace(/>/g, "&gt;");
  return `<a class="internal-link" data-href="${path}" href="${path}">${name}</a>`;
}


const proposed = adrs.where(a => (a.status ?? "") === "Proposed").array();
const accepted = adrs.where(a => (a.status ?? "") === "Accepted").array();
const deprecated = adrs.where(a => (a.status ?? "") === "Deprecated").array();

section("🟡 Proposed", proposed);
section("🟢 Accepted", accepted);
section("⚫ Deprecated", deprecated);
```

---

# 🕒 Actividad reciente

```dataview
TABLE file.mtime AS "Actualizado", doc AS "Tipo", file.link AS "Nota"
FROM ""
WHERE contains(file.path, this.project_path)
SORT file.mtime DESC
LIMIT 15
```

---

# 🌍 Global

## Global — Tareas abiertas en todos los proyectos
```tasks
not done
path includes 02_Proyectos
sort by due
sort by priority
```

## Global — ADRs recientes
```dataview
TABLE project AS "Proyecto", id AS "ADR", status AS "Estado", decision_date AS "Fecha", file.link AS "Nota"
FROM "02_Proyectos"
WHERE doc = "adr"
SORT decision_date DESC
LIMIT 20
```

# ✅ Nota (borrar al editar)
- Para que el `project_path` se aplique en Tasks, ejecuta: Ctrl+P → Templater: Replace templates in active file