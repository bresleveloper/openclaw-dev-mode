import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import "./text-utility-runtime-D7I29NA0.mjs";
import { l as markMigrationItemConflict, n as MIGRATION_REASON_TARGET_EXISTS, o as createMigrationItem, t as MIGRATION_REASON_MISSING_SOURCE_OR_TARGET, u as markMigrationItemError } from "./migration-DepQtnwV.mjs";
import { n as backupMigrationItemTarget } from "./migration-runtime-BHf1AeHu.mjs";
import { r as exists, s as sanitizeName } from "./helpers-DauatKzs.mjs";
import path from "node:path";
import fs from "node:fs/promises";
import { walkDirectory } from "@openclaw/fs-safe/walk";
//#region extensions/migrate-claude/skills.ts
async function collectSkillDirs(planned, dir, targets, scope) {
	if (!dir) return;
	const entries = await fs.readdir(dir, { withFileTypes: true }).catch(() => []);
	for (const entry of entries) {
		if (!entry.isDirectory()) continue;
		const source = path.join(dir, entry.name);
		if (!await exists(path.join(source, "SKILL.md"))) continue;
		const name = sanitizeName(entry.name);
		if (!name) continue;
		planned.push({
			name,
			source,
			target: path.join(targets.workspaceDir, "skills", name),
			action: "copy",
			sourceLabel: `${scope} Claude skill`
		});
	}
}
async function collectCommandFiles(planned, dir, targets, scope) {
	if (!dir) return;
	const { entries } = await walkDirectory(dir, {
		symlinks: "skip",
		include: (entry) => entry.kind === "file" && entry.name.endsWith(".md")
	});
	for (const { path: file } of entries) {
		const relative = path.relative(dir, file);
		const parsed = path.parse(relative);
		const namespace = sanitizeName(parsed.dir.replaceAll(path.sep, "-"));
		const commandName = sanitizeName(parsed.name);
		const name = sanitizeName([
			"claude-command",
			namespace,
			commandName
		].filter(Boolean).join("-"));
		if (!name) continue;
		planned.push({
			name,
			source: file,
			target: path.join(targets.workspaceDir, "skills", name),
			action: "create",
			sourceLabel: `${scope} Claude command ${relative}`
		});
	}
}
async function buildSkillItems(params) {
	const planned = [];
	await collectSkillDirs(planned, params.source.userSkillsDir, params.targets, "user");
	await collectSkillDirs(planned, params.source.projectSkillsDir, params.targets, "project");
	await collectCommandFiles(planned, params.source.userCommandsDir, params.targets, "user");
	await collectCommandFiles(planned, params.source.projectCommandsDir, params.targets, "project");
	const counts = /* @__PURE__ */ new Map();
	for (const skill of planned) counts.set(skill.name, (counts.get(skill.name) ?? 0) + 1);
	const items = [];
	for (const skill of planned) {
		const collides = (counts.get(skill.name) ?? 0) > 1;
		const targetExists = await exists(skill.target);
		items.push(createMigrationItem({
			id: `skill:${skill.name}`,
			kind: "skill",
			action: skill.action,
			source: skill.source,
			target: skill.target,
			status: collides ? "conflict" : targetExists && !params.overwrite ? "conflict" : "planned",
			reason: collides ? `multiple Claude skills or commands normalize to "${skill.name}"` : targetExists && !params.overwrite ? MIGRATION_REASON_TARGET_EXISTS : void 0,
			details: {
				sourceLabel: skill.sourceLabel,
				skillName: skill.name
			}
		}));
	}
	return items;
}
function firstParagraph(content) {
	return content.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/u, "").split(/\r?\n\r?\n/u).map((part) => part.replaceAll(/\s+/g, " ").trim()).find(Boolean);
}
function generatedCommandSkillContent(params) {
	const description = firstParagraph(params.commandContent) ?? `Imported Claude command ${params.skillName}`;
	return [
		"---",
		`name: ${params.skillName}`,
		`description: ${JSON.stringify(truncateUtf16Safe(description, 180))}`,
		"disable-model-invocation: true",
		"---",
		"",
		`<!-- Imported from Claude: ${params.sourceLabel} -->`,
		"",
		params.commandContent.trimEnd(),
		""
	].join("\n");
}
async function applyGeneratedSkillItem(item, reportDir, opts = {}) {
	if (!item.source || !item.target) return markMigrationItemError(item, MIGRATION_REASON_MISSING_SOURCE_OR_TARGET);
	let result = item;
	try {
		const targetExists = await exists(item.target);
		if (targetExists && !opts.overwrite) return markMigrationItemConflict(item, MIGRATION_REASON_TARGET_EXISTS);
		const sourceLabel = typeof item.details?.sourceLabel === "string" ? item.details.sourceLabel : path.basename(item.source);
		const content = generatedCommandSkillContent({
			skillName: typeof item.details?.skillName === "string" ? item.details.skillName : sanitizeName(item.id),
			sourceLabel,
			commandContent: await fs.readFile(item.source, "utf8")
		});
		const backupPath = targetExists ? await backupMigrationItemTarget(item.target, reportDir, { dereference: true }) : void 0;
		result = {
			...item,
			details: {
				...item.details,
				...backupPath ? { backupPath } : {}
			}
		};
		await fs.mkdir(item.target, { recursive: true });
		await fs.writeFile(path.join(item.target, "SKILL.md"), content, "utf8");
		return {
			...result,
			status: "migrated"
		};
	} catch (err) {
		return markMigrationItemError(result, err instanceof Error ? err.message : String(err));
	}
}
//#endregion
export { buildSkillItems as n, applyGeneratedSkillItem as t };
