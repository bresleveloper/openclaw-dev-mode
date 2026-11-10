import { t as hasErrnoCode } from "./errno-FR4CRyya.mjs";
import "./errors-DPfGDWk1.mjs";
import { d as pathExists } from "./fs-safe-6Z4UiMS4.mjs";
import { randomUUID } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
//#region src/skills/workshop/skill-versions.ts
const WORKSHOP_CHANGE_ACTIONS = [
	"create",
	"patch",
	"write_file",
	"remove_file",
	"archive",
	"restore"
];
function isWorkshopChangeAction(value) {
	return WORKSHOP_CHANGE_ACTIONS.some((action) => action === value);
}
const MAX_VERSIONS_PER_SKILL = 10;
const VERSION_ID_PATTERN = new RegExp(`^(\\d{4})(\\d{2})(\\d{2})T(\\d{2})(\\d{2})(\\d{2})(\\d{3})Z-(${WORKSHOP_CHANGE_ACTIONS.join("|")})$`);
/** Newest first. Only real directories count; a symlinked version is never listed or read. */
async function listVersions(versionsDir) {
	let entries;
	try {
		if ((await fs.lstat(versionsDir)).isSymbolicLink()) return [];
		entries = await fs.readdir(versionsDir, { withFileTypes: true });
	} catch (error) {
		if (hasErrnoCode(error, "ENOENT")) return [];
		throw error;
	}
	const versions = [];
	for (const entry of entries) {
		const id = entry.name;
		const match = VERSION_ID_PATTERN.exec(id);
		const action = match?.[8];
		if (!entry.isDirectory() || !match || !action || !isWorkshopChangeAction(action)) continue;
		const [, year, month, day, hour, minute, second, ms] = match;
		versions.push({
			id,
			action,
			createdAtMs: Date.UTC(Number(year), Number(month) - 1, Number(day), Number(hour), Number(minute), Number(second), Number(ms))
		});
	}
	return versions.toSorted((a, b) => b.id.localeCompare(a.id));
}
/**
* Copies the live skill into a new version before it changes. A caller that lost authority
* during the copy publishes nothing, so an aborted edit leaves no no-op "undo" version.
*/
async function snapshotSkill(paths, action) {
	if (!await pathExists(path.join(paths.skillDir, "SKILL.md"))) return;
	const newest = (await listVersions(paths.versionsDir))[0];
	const createdAtMs = Math.max(Date.now(), (newest?.createdAtMs ?? 0) + 1);
	const versionId = `${new Date(createdAtMs).toISOString().replace(/[-:.]/g, "")}-${action}`;
	await fs.mkdir(paths.versionsDir, { recursive: true });
	const staging = path.join(paths.versionsDir, `.snapshot-${randomUUID()}`);
	try {
		await fs.cp(paths.skillDir, staging, {
			recursive: true,
			filter: async (source) => !(await fs.lstat(source)).isSymbolicLink()
		});
		paths.assertLive();
		await fs.rename(staging, path.join(paths.versionsDir, versionId));
	} catch (error) {
		await fs.rm(staging, {
			recursive: true,
			force: true
		});
		throw error;
	}
	return versionId;
}
/** Keeps the newest versions within the per-skill limit. */
async function pruneVersions(versionsDir) {
	const stale = (await listVersions(versionsDir)).slice(MAX_VERSIONS_PER_SKILL);
	for (const version of stale) await fs.rm(path.join(versionsDir, version.id), {
		recursive: true,
		force: true
	});
}
//#endregion
export { snapshotSkill as i, listVersions as n, pruneVersions as r, isWorkshopChangeAction as t };
