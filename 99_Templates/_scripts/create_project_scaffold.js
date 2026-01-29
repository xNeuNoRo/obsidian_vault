module.exports = async (tp) => {
    const app = tp.app;

    // ===== CONFIG: TUS TEMPLATES =====
    const ROOT = "02_Proyectos";

    const TPL_INDEX   = "99_Templates/Plantilla - Proyecto Index.md";
    const TPL_VISION  = "99_Templates/Plantilla - Proyecto Vision.md";
    const TPL_ROADMAP = "99_Templates/Plantilla - Proyecto Roadmap.md";
    const TPL_ARCH    = "99_Templates/Plantilla - Proyecto Arquitectura.md";
    const TPL_DASH    = "99_Templates/Plantilla - Proyecto Dashboard.md";

    const TPL_FEATURE = "99_Templates/Plantilla - Proyecto Feature.md";
    const TPL_REQ     = "99_Templates/Plantilla - Proyecto RN-RNF.md";
    const TPL_ADR     = "99_Templates/Plantilla - Proyecto ADRs.md";

    // ===== INPUTS =====
    const projectName = await tp.system.prompt("Nombre del proyecto (carpeta):");
    if (!projectName) return;

    const projectSlug = await tp.system.prompt("Slug del proyecto (ej: nightcloud_project):");
    if (!projectSlug) return;

    const folderPath = `${ROOT}/${projectName}`;

    // ===== HELPERS =====
    const isoDate = () => {
        const d = new Date();
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");
        return `${y}-${m}-${day}`;
    };
    const today = isoDate();

    async function exists(path) {
        return await app.vault.adapter.exists(path);
    }
    async function ensureFolder(path) {
        if (!(await exists(path))) await app.vault.createFolder(path);
    }
    async function readFile(path) {
        const f = app.vault.getAbstractFileByPath(path);
        if (!f) throw new Error(`No encontré template: ${path}`);
        return await app.vault.read(f);
    }

    function replaceAll(content, pairs) {
        let out = content;
        for (const [from, to] of pairs) out = out.split(from).join(to);
        return out;
    }

    // Reemplaza placeholders comunes SIN “ejecutar templater”
    function applyCommonReplacements(content) {
        return replaceAll(content, [
            ["{{date}}", today],
            ["{{title}}", projectName],
            ["<% tp.frontmatter.project %>", projectSlug],
            ["<% tp.frontmatter.project_path %>", folderPath], // por si quedó en algún template viejo, lo neutraliza
        ]);
    }

    // Upsert MUY conservador:
    // - solo toca claves si (a) no existen o (b) están vacías o (c) son placeholders tipo {{...}}
    // - NO inserta project_path, NO mete doc si tú no quieres (puedes apagarlo abajo)
    function upsertFrontmatterConservative(content, fields) {
        if (!content.startsWith("---\n")) return content; // si no hay YAML, no inventamos

        const end = content.indexOf("\n---", 3);
        if (end === -1) return content;

        const fmBlock = content.slice(0, end + 4);
        const body = content.slice(end + 4);

        let lines = fmBlock.split("\n");

        const getLineIndex = (key) => lines.findIndex(l => l.startsWith(`${key}:`));

        const isEmptyOrPlaceholder = (line) => {
            const v = (line.split(":").slice(1).join(":") ?? "").trim();
            if (!v) return true;
            if (v === '""' || v === "''") return true;
            if (v === '"" #' || v === "'' #") return true;
            if (v.includes("{{") && v.includes("}}")) return true;
            return false;
        };

        // Inserta justo después de '---' para no romper listas YAML de tu template
        let insertAt = 1;

        for (const [key, value] of Object.entries(fields)) {
            const idx = getLineIndex(key);
            const newLine = `${key}: ${value}`;
            if (idx >= 0) {
                if (isEmptyOrPlaceholder(lines[idx])) lines[idx] = newLine; // solo si está vacío/placeholder
            } else {
                lines.splice(insertAt, 0, newLine);
                insertAt++;
            }
        }

        return lines.join("\n") + body;
    }

    function setDashboardProjectFields(content) {
        // 1) Reemplaza placeholders en el dashboard (por si el template los trae)
        content = replaceAll(content, [
            ["{{project}}", projectSlug],
            ["{{project_path}}", folderPath],
            ["{{date}}", today],
            ["<% tp.frontmatter.project %>", projectSlug],
            ["<% tp.frontmatter.project_path %>", folderPath],
        ]);

        // 2) Fuerza project y project_path en el FRONTMATTER del dashboard (no conservador)
        //    - si existen, los reemplaza
        //    - si no existen, los inserta al inicio (sin romper listas)
        const forceFields = {
            project: `"${projectSlug}"`,
            project_path: `"${folderPath}"`,
        };

        if (!content.startsWith("---\n")) return content;

        const end = content.indexOf("\n---", 3);
        if (end === -1) return content;

        const fmBlock = content.slice(0, end + 4);
        const body = content.slice(end + 4);

        let lines = fmBlock.split("\n");

        const getLineIndex = (key) => lines.findIndex(l => l.startsWith(`${key}:`));

        // Inserta justo después del '---'
        let insertAt = 1;

        for (const [key, value] of Object.entries(forceFields)) {
            const idx = getLineIndex(key);
            const newLine = `${key}: ${value}`;
            if (idx >= 0) {
                lines[idx] = newLine; // <- fuerza overwrite
            } else {
                lines.splice(insertAt, 0, newLine);
                insertAt++;
            }
        }

        return lines.join("\n") + body;
    }

    async function createFromTemplate(targetPath, templatePath) {
        if (await exists(targetPath)) return;

        let content = await readFile(templatePath);
        content = applyCommonReplacements(content);

        // NO tocamos tu YAML salvo para “arreglar” placeholders de date/title que ya reemplazamos arriba
        await app.vault.create(targetPath, content);
    }

    async function createSeedFromTemplate(targetPath, templatePath, seedReplacements, minimalFM) {
        await createFromTemplate(targetPath, templatePath);

        const f = app.vault.getAbstractFileByPath(targetPath);
        if (!f) return;

        let content = await app.vault.read(f);

        // Reemplaza IDs/XX en TODO el archivo (YAML + body)
        content = replaceAll(content, seedReplacements);

        // Conservador: solo asegura project (y opcionalmente doc) si falta o está vacío
        // NOTA: no metemos project_path, ni created/updated si tú no lo quieres.
        if (minimalFM && Object.keys(minimalFM).length) {
            content = upsertFrontmatterConservative(content, minimalFM);
        }

        await app.vault.modify(f, content);
    }

    // ===== STRUCTURE =====
    await ensureFolder(folderPath);
    await ensureFolder(`${folderPath}/02_Features`);
    await ensureFolder(`${folderPath}/03_Requerimientos`);
    await ensureFolder(`${folderPath}/06_ADRs`);

    // ===== BASE FILES =====
    await createFromTemplate(`${folderPath}/00_Index.md`, TPL_INDEX);
    await createFromTemplate(`${folderPath}/01_Vision.md`, TPL_VISION);
    await createFromTemplate(`${folderPath}/04_Roadmap.md`, TPL_ROADMAP);
    await createFromTemplate(`${folderPath}/05_Arquitectura.md`, TPL_ARCH);

    const dashPath = `${folderPath}/07_Dashboard.md`;
    await createFromTemplate(dashPath, TPL_DASH);

    // Forzar SOLO en el dashboard (SIEMPRE, exista o no exista)
    {
        const f = app.vault.getAbstractFileByPath(dashPath);
        if (f) {
            let dash = await app.vault.read(f);
            dash = setDashboardProjectFields(dash);
            await app.vault.modify(f, dash);
        } else {
            // si por alguna razón todavía no existe (race raro), lo intentamos leer por path
            // (normalmente no entra aquí)
        }
    }

    // ===== SEEDS (USANDO TUS TEMPLATES, SIN INYECTAR DE MÁS) =====
    // Minimal FM: solo project si tu template lo deja vacío (y doc si te sirve para dataview)
    const MIN_FM = {
        project: `"${projectSlug}"`,
        // doc: `"feature"`, // si tu dashboard filtra por doc, activa esto por tipo (abajo lo hago por tipo)
    };

    // Feature demo
    await createSeedFromTemplate(
        `${folderPath}/02_Features/FEAT-01 Demo.md`,
        TPL_FEATURE,
        [
            ["{{id}}", "FEAT-01"],
            ["FEAT-XX", "FEAT-01"],
            ["id: FEAT-XX", "id: FEAT-01"],
        ],
        { ...MIN_FM, doc: `"feature"` }
    );

    // RF demo
    await createSeedFromTemplate(
        `${folderPath}/03_Requerimientos/RF-01 Demo.md`,
        TPL_REQ,
        [
            ["{{id}}", "RF-01"],
            ["RF-XX", "RF-01"],
            ["RNF-XX", "RF-01"], // por si tu template usa el mismo placeholder
            ["FEAT-XX", "FEAT-01"],
            ["id: RF-XX", "id: RF-01"],
        ],
        { ...MIN_FM, doc: `"requirement"` }
    );

    // RNF demo
    await createSeedFromTemplate(
        `${folderPath}/03_Requerimientos/RNF-01 Demo.md`,
        TPL_REQ,
        [
            ["{{id}}", "RNF-01"],
            ["RNF-XX", "RNF-01"],
            ["RF-XX", "RNF-01"], // por si tu template usa el mismo placeholder
            ["FEAT-XX", "FEAT-01"],
            ["id: RNF-XX", "id: RNF-01"],
        ],
        { ...MIN_FM, doc: `"requirement"` }
    );

    // ADR demo
    await createSeedFromTemplate(
        `${folderPath}/06_ADRs/ADR-01 Demo.md`,
        TPL_ADR,
        [
            ["{{id}}", "ADR-01"],
            ["ADR-XX", "ADR-01"],
            ["id: ADR-XX", "id: ADR-01"],
        ],
        { ...MIN_FM, doc: `"adr"` }
    );

    // ===== OPEN INDEX =====
    const indexFile = app.vault.getAbstractFileByPath(`${folderPath}/00_Index.md`);
    if (indexFile) await app.workspace.getLeaf(true).openFile(indexFile);
};
