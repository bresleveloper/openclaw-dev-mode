import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { d as pathExists, g as readRegularFile, n as appendRegularFile } from "./fs-safe-6Z4UiMS4.mjs";
import "./string-coerce-runtime-BbIJhy7G.mjs";
import "./security-runtime-6domDoE8.mjs";
import { d as markMigrationItemSkipped, t as MIGRATION_REASON_MISSING_SOURCE_OR_TARGET, u as markMigrationItemError } from "./migration-Cf1WpRKe.mjs";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { isUtf8 } from "node:buffer";
//#region extensions/migrate-claude/helpers.ts
function resolveHomePath(input) {
	const trimmed = input.trim();
	if (!trimmed) return trimmed;
	return path.resolve(trimmed.replace(/^~(?=$|[\\/])/u, () => os.homedir()));
}
async function isDirectory(dirPath) {
	try {
		return (await fs.stat(dirPath)).isDirectory();
	} catch {
		return false;
	}
}
function sanitizeName(name) {
	return name.trim().toLowerCase().replaceAll(/[^a-z0-9._-]+/g, "-").replaceAll(/^-+|-+$/g, "");
}
async function readJsonObject(filePath) {
	if (!filePath) return {};
	try {
		const parsed = JSON.parse(await fs.readFile(filePath, "utf8"));
		return isRecord(parsed) ? parsed : {};
	} catch {
		return {};
	}
}
async function appendItem(item) {
	if (!item.source || !item.target) return markMigrationItemError(item, MIGRATION_REASON_MISSING_SOURCE_OR_TARGET);
	try {
		const content = await fs.readFile(item.source);
		if (!isUtf8(content)) throw new Error(`Claude instruction file is not valid UTF-8: ${item.source}. Re-save or re-encode it as UTF-8, then rerun the migration.`);
		const label = typeof item.details?.sourceLabel === "string" ? item.details.sourceLabel : path.basename(item.source);
		const body = content.toString("utf8").trimEnd();
		if (!body) return markMigrationItemSkipped(item, "source file is empty");
		const importBlock = `\n\n<!-- Imported from Claude: ${label} -->\n\n${body}\n`;
		if ((await pathExists(item.target) ? (await readRegularFile({ filePath: item.target })).buffer.toString("utf8") : "").includes(importBlock)) return markMigrationItemSkipped(item, "already imported from Claude");
		await fs.mkdir(path.dirname(item.target), { recursive: true });
		await appendRegularFile({
			filePath: item.target,
			content: importBlock,
			rejectSymlinkParents: true
		});
		return {
			...item,
			status: "migrated"
		};
	} catch (err) {
		return markMigrationItemError(item, err instanceof Error ? err.message : String(err));
	}
}
//#endregion
export { sanitizeName as a, resolveHomePath as i, isDirectory as n, readJsonObject as r, appendItem as t };
