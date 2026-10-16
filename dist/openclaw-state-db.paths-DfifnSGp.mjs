import { t as resolveIdentityPathViaExistingAncestorSync } from "./boundary-path-CAv_plX7.mjs";
import { t as hasErrnoCode } from "./errno-FR4CRyya.mjs";
import { o as normalizeWindowsPathPreservingCase, r as isPathInside } from "./path-guards-CH7noY0Z.mjs";
import { r as resolveStateDir } from "./state-dir-BHJORNly.mjs";
import "./paths-DGIwWbpu.mjs";
import { statSync } from "node:fs";
import path from "node:path";
//#region src/state/openclaw-state-db.paths.ts
function resolveDatabasePath(options = {}) {
	return path.resolve(options.path ?? resolveOpenClawStateSqlitePath(options.env ?? process.env));
}
function existingPathOrUndefined(pathname) {
	try {
		statSync(pathname);
		return pathname;
	} catch (error) {
		if (hasErrnoCode(error, "ENOENT")) return;
		throw error;
	}
}
/** Resolve the directory that contains the shared state SQLite file. */
function resolveOpenClawStateSqliteDir(env = process.env) {
	return path.join(resolveStateDir(env), "state");
}
/** Resolve the shared state SQLite file path. */
function resolveOpenClawStateSqlitePath(env = process.env) {
	return path.join(resolveStateDir(env), "state", "openclaw.sqlite");
}
/** Resolve the state owner directory for a canonical or explicit shared database path. */
function resolveOpenClawStateDirForDatabasePath(databasePath) {
	const databaseDir = path.dirname(path.resolve(databasePath));
	return path.basename(databaseDir) === "state" ? path.dirname(databaseDir) : databaseDir;
}
/** Resolve the integrity/quarantine store that survives loss of the primary state database. */
function resolveQuarantineStorePath(env) {
	return path.join(resolveOpenClawStateSqliteDir(env), "openclaw-quarantine.sqlite");
}
/** Resolve the durable registry form for one agent database path. */
function resolveOpenClawAgentDatabaseStoredPath(registryDatabasePath, agentDatabasePath) {
	const windows = process.platform === "win32";
	const rawStateDir = resolveOpenClawStateDirForDatabasePath(registryDatabasePath);
	let stateDir = windows ? normalizeWindowsPathPreservingCase(rawStateDir) : rawStateDir;
	const absolutePath = windows && path.isAbsolute(agentDatabasePath) ? agentDatabasePath : path.resolve(agentDatabasePath);
	const comparisonPath = windows ? normalizeWindowsPathPreservingCase(absolutePath) : absolutePath;
	if (!path.isAbsolute(stateDir) || !path.isAbsolute(comparisonPath)) return absolutePath;
	let relativePath = path.relative(stateDir, comparisonPath);
	const useCanonicalRoot = relativePath.startsWith("..") || path.isAbsolute(relativePath) || windows && !isPathInside(rawStateDir, absolutePath);
	if (useCanonicalRoot) {
		const canonicalRoot = resolveIdentityPathViaExistingAncestorSync(stateDir);
		if (windows && !isPathInside(canonicalRoot, absolutePath)) return absolutePath;
		stateDir = windows ? normalizeWindowsPathPreservingCase(canonicalRoot) : canonicalRoot;
		if (!path.isAbsolute(stateDir)) return absolutePath;
		relativePath = path.relative(stateDir, comparisonPath);
	}
	if (relativePath.startsWith("..") || path.isAbsolute(relativePath)) return absolutePath;
	if (useCanonicalRoot && !windows) return relativePath;
	const rawPrefix = [stateDir, path.toNamespacedPath(stateDir)].map((root) => `${root}${root.endsWith(path.sep) ? "" : path.sep}`).find((prefix) => agentDatabasePath.startsWith(prefix));
	return path.isAbsolute(agentDatabasePath) && rawPrefix !== void 0 ? agentDatabasePath.slice(rawPrefix.length) : relativePath;
}
/** Resolve one stored agent database registry path for runtime consumers. */
function resolveOpenClawRegisteredAgentDatabasePath(registryDatabasePath, storedPath) {
	return path.isAbsolute(storedPath) ? storedPath : `${resolveOpenClawStateDirForDatabasePath(registryDatabasePath)}${path.sep}${storedPath}`;
}
function describeAgentPathMigration(summary) {
	const { relativized, reanchored, deleted } = summary;
	if (relativized === 0 && reanchored.length === 0 && deleted.length === 0) return [];
	const decisions = reanchored.length + deleted.length;
	const counts = [
		`${relativized} relativized`,
		reanchored.length > 0 && `${reanchored.length} re-anchored`,
		deleted.length > 0 && `${deleted.length} removed`
	].filter(Boolean);
	return [
		`Migrated agent database registry paths to state-relative storage${decisions > 0 ? ` (${counts.join(", ")})` : ""}`,
		...reanchored.map((registeredPath) => `Re-anchored agent database registry path ${registeredPath} to the current state directory`),
		...deleted.map((registeredPath) => `Removed duplicate agent database registry path ${registeredPath}`)
	];
}
function warnAgentPathMigration(log, summary, databasePath) {
	if (summary.reanchored.length === 0 && summary.deleted.length === 0) return;
	log.warn("agent database registry rows re-anchored or removed during v9 migration", {
		reanchored: summary.reanchored,
		deleted: summary.deleted,
		path: databasePath
	});
}
//#endregion
export { resolveOpenClawRegisteredAgentDatabasePath as a, resolveOpenClawStateSqlitePath as c, resolveOpenClawAgentDatabaseStoredPath as i, resolveQuarantineStorePath as l, existingPathOrUndefined as n, resolveOpenClawStateDirForDatabasePath as o, resolveDatabasePath as r, resolveOpenClawStateSqliteDir as s, describeAgentPathMigration as t, warnAgentPathMigration as u };
