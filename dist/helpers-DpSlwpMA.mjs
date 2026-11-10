import { a as extractErrorCode } from "./error-coercion-BwMr25F8.mjs";
import { t as asNonArrayRecord } from "./record-coerce-TIsquoVR.mjs";
import { g as readRegularFile, n as appendRegularFile } from "./fs-safe-6Z4UiMS4.mjs";
import "./error-runtime-ikopZs5O.mjs";
import "./string-coerce-runtime-BbIJhy7G.mjs";
import "./security-runtime-6domDoE8.mjs";
import { d as markMigrationItemSkipped, t as MIGRATION_REASON_MISSING_SOURCE_OR_TARGET, u as markMigrationItemError } from "./migration-Cf1WpRKe.mjs";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { isUtf8 } from "node:buffer";
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
	return (await fs.stat(dirPath).catch((error) => {
		const code = extractErrorCode(error);
		if (code === "ENOENT" || code === "ENOTDIR") return;
		throw error;
	}))?.isDirectory() === true;
}
function sanitizeName(name) {
	return name.trim().toLowerCase().replaceAll(UNSAFE_NAME_CHARS_RE, "-").replaceAll(EDGE_DASHES_RE, "");
}
async function readText(filePath) {
	return filePath ? await fs.realpath(filePath).then((resolvedPath) => readRegularFile({ filePath: resolvedPath })).then(({ buffer }) => buffer.toString("utf8")).catch(() => void 0) : void 0;
}
async function readUtf8Text(filePath) {
	if (!filePath) return;
	const resolvedPath = await fs.realpath(filePath);
	const { buffer: content } = await readRegularFile({ filePath: resolvedPath });
	if (!isUtf8(content)) throw new Error(`Source file is not valid UTF-8: ${filePath}. Re-encode it as UTF-8 and retry migration.`);
	return content.toString("utf8");
}
async function readJsonObject(filePath) {
	const raw = await readUtf8Text(filePath);
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
		const { buffer: content } = await readRegularFile({ filePath: await fs.realpath(item.source) });
		if (!isUtf8(content)) throw new Error(`Source file is not valid UTF-8: ${item.source}. Re-encode it as UTF-8 and retry migration.`);
		const header = `\n\n<!-- Imported from Hermes: ${path.basename(item.source)} -->\n\n`;
		const body = content.toString("utf8").trimEnd();
		if (!body) return markMigrationItemSkipped(item, "source file is empty");
		const importBlock = `${header}${body}\n`;
		if ((await readText(item.target) ?? "").includes(importBlock)) return markMigrationItemSkipped(item, "already imported from Hermes");
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
export { readJsonObject as a, resolveHomePath as c, parseHermesConfig as i, sanitizeName as l, isDirectory as n, readText as o, parseEnv as r, readUtf8Text as s, appendItem as t };
