import { t as hasErrnoCode } from "./errno-FR4CRyya.mjs";
import { o as normalizeWindowsPathPreservingCase } from "./path-guards-CH7noY0Z.mjs";
import { fstatSync, readdirSync, realpathSync, statSync } from "node:fs";
import { realpath, stat as stat$1 } from "node:fs/promises";
import path from "node:path";
//#region src/infra/sqlite-worker-identity.ts
const useDatabaseBirthtime = process.platform !== "linux" && process.platform !== "android";
function databaseFileIdentityKey(file) {
	return `${file.dev}:${file.ino}`;
}
function readDatabaseIdentityBirthtime(file) {
	return useDatabaseBirthtime ? file.birthtimeNs.toString() : "0";
}
/** Native SQLite namespaces are filesystem locators, not distinct database owners. */
function normalizeDatabasePath(location) {
	const normalized = process.platform === "win32" ? normalizeWindowsPathPreservingCase(location) : location;
	return process.platform === "win32" && !/^(?:[a-z]:[\\/]|[\\/]{2})/iu.test(normalized) ? location : normalized;
}
function readDatabaseFileIdentity(value) {
	if (!value || typeof value !== "object" || Array.isArray(value) || !("key" in value) || typeof value.key !== "string" || !/^file:(?:0|[1-9]\d{0,19}):(?:0|[1-9]\d{0,19})$/.test(value.key) || "birthtime" in value && value.birthtime !== void 0 && (typeof value.birthtime !== "string" || !/^-?(?:0|[1-9]\d{0,29})$/.test(value.birthtime))) throw new Error("SQLite snapshot requires a captured physical file identity");
	return {
		key: value.key,
		..."birthtime" in value && typeof value.birthtime === "string" ? { birthtime: value.birthtime } : {}
	};
}
function assertDatabaseFileIdentity(file, expected) {
	if (!file.isFile() || `file:${databaseFileIdentityKey(file)}` !== expected.key || expected.birthtime !== void 0 && readDatabaseIdentityBirthtime(file) !== expected.birthtime) throw new Error("SQLite database file identity changed before existing-only open");
}
function existingIdentity(file, canonicalFile, canonicalPath) {
	if (!file.isFile()) throw new Error("SQLite worker database path must identify a regular file");
	if (file.dev !== canonicalFile.dev || file.ino !== canonicalFile.ino || readDatabaseIdentityBirthtime(file) !== readDatabaseIdentityBirthtime(canonicalFile)) throw new Error("SQLite database pathname changed during admission");
	return {
		key: `file:${databaseFileIdentityKey(file)}`,
		canonicalPath: normalizeDatabasePath(canonicalPath),
		birthtime: readDatabaseIdentityBirthtime(file)
	};
}
function missingAncestorParent(ancestor, missing, error) {
	if (!hasErrnoCode(error, "ENOENT")) throw error;
	missing.unshift(path.basename(ancestor));
	const parent = path.dirname(ancestor);
	if (parent === ancestor) throw error;
	return parent;
}
/** In-process owner key only; never rewrite a configured or persisted database locator. */
function resolveDatabasePathKey(databasePath) {
	let ancestor = path.resolve(databasePath);
	const missing = [];
	while (true) try {
		return normalizeDatabasePath(path.join(realpathSync.native(ancestor), ...missing));
	} catch (error) {
		ancestor = missingAncestorParent(ancestor, missing, error);
	}
}
/** Inspect a native-owner path without replacing its diagnostic for a non-file target. */
function inspectDatabasePathIdentitySync(databasePath) {
	const resolvedPath = path.resolve(databasePath);
	let file;
	try {
		file = statSync(resolvedPath, { bigint: true });
	} catch (error) {
		if (!hasErrnoCode(error, "ENOENT")) throw error;
	}
	if (file) {
		if (!file.isFile()) return;
		const canonicalPath = resolveDatabasePathKey(resolvedPath);
		return existingIdentity(file, statSync(canonicalPath, { bigint: true }), canonicalPath);
	}
	const canonicalPath = resolveDatabasePathKey(resolvedPath);
	return {
		key: `path:${canonicalPath}`,
		canonicalPath
	};
}
/** Capture identity before yielding; worker admission requires a regular file or absent path. */
function readDatabasePathIdentitySync(databasePath) {
	const identity = inspectDatabasePathIdentitySync(databasePath);
	if (!identity) throw new Error("SQLite worker database path must identify a regular file");
	return identity;
}
/** Inspect retained aliases only while binding a newly observed database path. */
function findChangedDatabasePaths(paths, observed) {
	return [...paths].filter((pathname) => inspectDatabasePathIdentitySync(pathname)?.key !== observed.key);
}
async function readDatabasePathIdentity(databasePath) {
	const file = await stat$1(databasePath, { bigint: true }).catch((error) => {
		if (hasErrnoCode(error, "ENOENT")) return;
		throw error;
	});
	if (file) try {
		const canonicalPath = await realpath(databasePath);
		return existingIdentity(file, await stat$1(canonicalPath, { bigint: true }), canonicalPath);
	} catch (error) {
		if (hasErrnoCode(error, "ENOENT")) throw new Error("SQLite database pathname changed during admission", { cause: error });
		throw error;
	}
	const missing = [];
	let ancestor = databasePath;
	while (true) try {
		const canonicalPath = normalizeDatabasePath(path.join(await realpath(ancestor), ...missing));
		return {
			key: `path:${canonicalPath}`,
			canonicalPath
		};
	} catch (error) {
		ancestor = missingAncestorParent(ancestor, missing, error);
	}
}
/** Revalidate the captured file, or keep an observed absence from adopting a replacement. */
function assertDatabasePathIdentity(databasePath, expected) {
	if (expected.key.startsWith("file:")) assertExistingDatabaseIdentity(databasePath, expected.key, expected.birthtime);
	else if (readDatabasePathIdentitySync(databasePath).key !== expected.key) throw new Error(`SQLite database path identity changed: ${databasePath}`);
}
function assertExistingDatabaseIdentity(databasePath, expected, expectedBirthtime) {
	assertDatabaseFileIdentity(statSync(databasePath, { bigint: true }), {
		key: expected,
		birthtime: expectedBirthtime
	});
}
function isSoleDatabaseFileDescriptor(descriptor, file) {
	if (process.platform !== "linux") return false;
	try {
		for (const name of readdirSync("/proc/self/fd")) {
			if (!/^\d+$/u.test(name) || Number(name) === descriptor) continue;
			try {
				const other = fstatSync(Number(name), { bigint: true });
				if (other.dev === file.dev && other.ino === file.ino) return false;
			} catch (error) {
				if (!hasErrnoCode(error, "EBADF")) return false;
			}
		}
		return true;
	} catch {
		return false;
	}
}
//#endregion
export { findChangedDatabasePaths as a, normalizeDatabasePath as c, readDatabasePathIdentity as d, readDatabasePathIdentitySync as f, databaseFileIdentityKey as i, readDatabaseFileIdentity as l, assertDatabasePathIdentity as n, inspectDatabasePathIdentitySync as o, resolveDatabasePathKey as p, assertExistingDatabaseIdentity as r, isSoleDatabaseFileDescriptor as s, assertDatabaseFileIdentity as t, readDatabaseIdentityBirthtime as u };
