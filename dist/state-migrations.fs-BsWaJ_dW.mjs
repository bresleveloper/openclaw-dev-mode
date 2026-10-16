import { t as parseJsonWithJson5Fallback } from "./parse-json-compat-BBtWoq5_.mjs";
import fs from "node:fs";
import { safeStatSync } from "@openclaw/fs-safe/path";
//#region src/infra/state-migrations.fs.ts
/** Reads directory entries or returns an empty list when the directory is missing/unreadable. */
function safeReadDir(dir) {
	try {
		return fs.readdirSync(dir, { withFileTypes: true });
	} catch {
		return [];
	}
}
function existsDir(dir) {
	return safeStatSync(dir)?.isDirectory() ?? false;
}
function migrationFileExists(p) {
	return safeStatSync(p)?.isFile() ?? false;
}
/** Reads a session store from disk, accepting JSON first and JSON5 as legacy/operator input. */
function readSessionStoreJson5(storePath) {
	try {
		return parseSessionStoreJson5(fs.readFileSync(storePath, "utf-8"));
	} catch {}
	return {
		store: {},
		ok: false
	};
}
/** Parses session-store text, preferring strict JSON before JSON5 compatibility. */
function parseSessionStoreJson5(raw) {
	try {
		const parsed = parseJsonWithJson5Fallback(raw);
		if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) return {
			store: parsed,
			ok: true
		};
	} catch {}
	return {
		store: {},
		ok: false
	};
}
//#endregion
export { safeReadDir as a, readSessionStoreJson5 as i, migrationFileExists as n, parseSessionStoreJson5 as r, existsDir as t };
