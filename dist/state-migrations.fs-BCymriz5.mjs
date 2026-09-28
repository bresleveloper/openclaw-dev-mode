import { t as parseJsonWithJson5Fallback } from "./parse-json-compat-BBtWoq5_.mjs";
import fs from "node:fs";
//#region src/infra/state-migrations.fs.ts
/** Reads directory entries or returns an empty list when the directory is missing/unreadable. */
function safeReadDir(dir) {
	try {
		return fs.readdirSync(dir, { withFileTypes: true });
	} catch {
		return [];
	}
}
/** Returns whether a path exists and resolves to a directory. */
function existsDir(dir) {
	try {
		return fs.existsSync(dir) && fs.statSync(dir).isDirectory();
	} catch {
		return false;
	}
}
/** Creates a directory tree for migration targets. */
function ensureMigrationDir(dir) {
	fs.mkdirSync(dir, { recursive: true });
}
/** Returns whether a path exists and resolves to a regular file. */
function migrationFileExists(p) {
	try {
		return fs.existsSync(p) && fs.statSync(p).isFile();
	} catch {
		return false;
	}
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
export { readSessionStoreJson5 as a, parseSessionStoreJson5 as i, existsDir as n, safeReadDir as o, migrationFileExists as r, ensureMigrationDir as t };
