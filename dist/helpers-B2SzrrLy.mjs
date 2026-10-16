import { t as asNonArrayRecord } from "./record-coerce-TIsquoVR.mjs";
import { n as appendRegularFile } from "./fs-safe-BUXBSN-4.mjs";
import "./string-coerce-runtime-50qKeWeL.mjs";
import "./security-runtime-CpTHQYW2.mjs";
import { d as markMigrationItemSkipped, t as MIGRATION_REASON_MISSING_SOURCE_OR_TARGET, u as markMigrationItemError } from "./migration-BeM6IrM8.mjs";
import path from "node:path";
import fs from "node:fs/promises";
import os from "node:os";
import { parse as parse$1 } from "dotenv";
import { parse as parse$2 } from "yaml";
//#region extensions/migrate-hermes/helpers.ts
const HOME_SHORTHAND_RE = /^~(?=$|[\\/])/u;
const UNSAFE_NAME_CHARS_RE = /[^a-z0-9._-]+/g;
const EDGE_DASHES_RE = /^-+|-+$/g;
function resolveHomePath(input) {
	const value = input.trim();
	return value ? path.resolve(value.replace(HOME_SHORTHAND_RE, () => os.homedir())) : value;
}
async function isDirectory(dirPath) {
	return (await fs.stat(dirPath).catch(() => void 0))?.isDirectory() === true;
}
function sanitizeName(name) {
	return name.trim().toLowerCase().replaceAll(UNSAFE_NAME_CHARS_RE, "-").replaceAll(EDGE_DASHES_RE, "");
}
async function readText(filePath) {
	return filePath ? await fs.readFile(filePath, "utf8").catch(() => void 0) : void 0;
}
async function readJsonObject(filePath) {
	const raw = await readText(filePath);
	try {
		return raw ? asNonArrayRecord(JSON.parse(raw)) : {};
	} catch {
		return {};
	}
}
function parseEnv(content) {
	return content ? parse$1(content) : {};
}
function parseHermesConfig(content) {
	return content ? asNonArrayRecord(parse$2(content)) : {};
}
async function appendItem(item) {
	if (!item.source || !item.target) return markMigrationItemError(item, MIGRATION_REASON_MISSING_SOURCE_OR_TARGET);
	try {
		const content = await fs.readFile(item.source, "utf8");
		const header = `\n\n<!-- Imported from Hermes: ${path.basename(item.source)} -->\n\n`;
		const body = content.trimEnd();
		if (!body) return markMigrationItemSkipped(item, "source file is empty");
		const importBlock = `${header}${body}\n`;
		if ((await fs.readFile(item.target, "utf8").catch(() => "")).includes(importBlock)) return markMigrationItemSkipped(item, "already imported from Hermes");
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
export { readJsonObject as a, sanitizeName as c, parseHermesConfig as i, isDirectory as n, readText as o, parseEnv as r, resolveHomePath as s, appendItem as t };
