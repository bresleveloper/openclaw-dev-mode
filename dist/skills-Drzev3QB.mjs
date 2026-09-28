import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import "./string-coerce-runtime-C_MKhRVt.mjs";
import { n as MIGRATION_REASON_TARGET_EXISTS, o as createMigrationItem } from "./migration-DepQtnwV.mjs";
import { c as readText, o as parseHermesConfig, r as exists, u as sanitizeName } from "./helpers-CRQ7DHOz.mjs";
import path from "node:path";
import fs from "node:fs/promises";
//#region extensions/migrate-hermes/skills.ts
const EXCLUDED_SKILL_DIRS = /* @__PURE__ */ new Set([
	".git",
	".github",
	".hub",
	".archive",
	".venv",
	"venv",
	"node_modules",
	"site-packages",
	"__pycache__",
	".tox",
	".nox",
	".pytest_cache",
	".mypy_cache",
	".ruff_cache"
]);
const SKILL_SUPPORT_DIRS = /* @__PURE__ */ new Set([
	"references",
	"templates",
	"assets",
	"scripts"
]);
async function discoverSkillRoots(root) {
	const orgRoot = path.join(root, "_org");
	const activeOrg = (await readText(path.join(orgRoot, ".active_org")))?.trim();
	async function visit(dir) {
		const hasSkill = await exists(path.join(dir, "SKILL.md"));
		const entries = await fs.readdir(dir, { withFileTypes: true }).catch(() => []);
		const roots = hasSkill ? [dir] : [];
		for (const entry of entries.toSorted((left, right) => left.name.localeCompare(right.name))) {
			const child = path.join(dir, entry.name);
			const inactiveOrg = child === orgRoot && !activeOrg || dir === orgRoot && entry.name !== activeOrg;
			if (!entry.isDirectory() || EXCLUDED_SKILL_DIRS.has(entry.name) || hasSkill && SKILL_SUPPORT_DIRS.has(entry.name) || inactiveOrg) continue;
			roots.push(...await visit(child));
		}
		return roots;
	}
	return await visit(root);
}
async function buildSkillItems(params) {
	if (!params.source.skillsDir) return [];
	const plannedSkills = [];
	for (const source of await discoverSkillRoots(params.source.skillsDir)) {
		const name = sanitizeName(path.basename(source));
		if (!name) continue;
		const frontmatter = (await readText(path.join(source, "SKILL.md")))?.match(/^\uFEFF?---\r?\n([\s\S]*?)\r?\n---[ \t]*(?:\r?\n|$)/u)?.[1];
		let skillName = path.basename(source);
		try {
			skillName = normalizeOptionalString(parseHermesConfig(frontmatter).name) ?? skillName;
		} catch {}
		plannedSkills.push({
			id: `skill:${path.relative(params.source.skillsDir, source).split(path.sep).map(sanitizeName).filter(Boolean).join(":")}`,
			name,
			skillName,
			source,
			target: path.join(params.targets.workspaceDir, "skills", name)
		});
	}
	const counts = /* @__PURE__ */ new Map();
	for (const skill of plannedSkills) counts.set(skill.name, (counts.get(skill.name) ?? 0) + 1);
	const items = [];
	for (const skill of plannedSkills) {
		const collides = (counts.get(skill.name) ?? 0) > 1;
		const targetExists = await exists(skill.target);
		items.push(createMigrationItem({
			id: skill.id,
			kind: "skill",
			action: "copy",
			source: skill.source,
			target: skill.target,
			details: { skillName: skill.skillName },
			status: collides ? "conflict" : targetExists && !params.overwrite ? "conflict" : "planned",
			reason: collides ? `multiple Hermes skill directories normalize to "${skill.name}"` : targetExists && !params.overwrite ? MIGRATION_REASON_TARGET_EXISTS : void 0
		}));
	}
	return items;
}
//#endregion
export { buildSkillItems as t };
