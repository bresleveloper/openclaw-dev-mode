import { t as hasErrnoCode } from "./errno-FR4CRyya.mjs";
import { r as isPathInside } from "./path-guards-CH7noY0Z.mjs";
import "./kysely-sync-K7ftY-g4.mjs";
import { r as enableNodeSqliteKyselyStatementCache, t as clearNodeSqliteKyselyCacheForDatabase } from "./kysely-sync-cache-state-eUau8Jaa.mjs";
import { t as openNodeSqliteDatabase } from "./node-sqlite-XIcwmOrl.mjs";
import { i as setSqliteBusyTimeout } from "./sqlite-busy-timeout-DYrW2wFu.mjs";
import { s as OPENCLAW_SQLITE_BUSY_TIMEOUT_MS } from "./openclaw-state-db-contract-Cm9fKF2T.mjs";
import { a as readSqliteUserVersion } from "./sqlite-user-version-ZJ4dPMsi.mjs";
import { a as registerSqliteCacheExitClose, o as runInSqliteMaintenanceContext } from "./sqlite-wal-DUSYRhyv.mjs";
import { c as matchesAgentDatabaseReadCandidatePath, l as registerAgentDatabaseReaderCloser, s as isDeletedAgentDatabasePath } from "./agent-database-readers-DAuOtcuZ.mjs";
import "./openclaw-agent-db-contract-ClUH-Vmp.mjs";
import fs from "node:fs";
import path from "node:path";
//#region src/agents/auth-profiles/sqlite-read-pool.ts
const AUTH_PROFILE_READ_HANDLE_CAP = 64;
const AUTH_PROFILE_READ_IDLE_MS = 18e5;
const authProfileReadDatabases = /* @__PURE__ */ new Map();
let unregisterReadHandleExitClose = null;
function closeAuthProfileReadDatabase(databasePath) {
	const pathname = path.resolve(databasePath);
	const entry = authProfileReadDatabases.get(pathname);
	if (!entry) return;
	clearNodeSqliteKyselyCacheForDatabase(entry.db);
	if (entry.db.isOpen) entry.db.close();
	clearTimeout(entry.idleTimer);
	entry.idleTimer = void 0;
	authProfileReadDatabases.delete(pathname);
	if (authProfileReadDatabases.size === 0) {
		unregisterReadHandleExitClose?.();
		unregisterReadHandleExitClose = null;
	}
}
/** Internal lifecycle close for scoped or all process-local pooled auth-profile readers. */
function closeAuthProfileReadPool(scope) {
	if (scope?.kind === "database") {
		closeAuthProfileReadDatabase(scope.databasePath);
		return;
	}
	if (scope?.kind === "root") {
		for (const pathname of authProfileReadDatabases.keys()) if (isPathInside(scope.rootPath, pathname)) closeAuthProfileReadDatabase(pathname);
		return;
	}
	for (const pathname of authProfileReadDatabases.keys()) closeAuthProfileReadDatabase(pathname);
}
registerAgentDatabaseReaderCloser((candidates) => {
	for (const pathname of authProfileReadDatabases.keys()) if (candidates.some((candidate) => matchesAgentDatabaseReadCandidatePath(candidate, pathname))) closeAuthProfileReadDatabase(pathname);
});
function armReadHandleIdleClose(pathname, entry) {
	if (entry.idleTimer) {
		entry.idleTimer.refresh();
		return;
	}
	const timer = runInSqliteMaintenanceContext(() => setTimeout(() => {
		if (authProfileReadDatabases.get(pathname) !== entry || entry.idleTimer !== timer) return;
		try {
			closeAuthProfileReadDatabase(pathname);
		} catch (error) {
			timer.refresh();
			process.emitWarning(`Failed to close idle auth profile reader: ${String(error)}`, { type: "AuthProfileReadPoolError" });
		}
	}, AUTH_PROFILE_READ_IDLE_MS));
	timer.unref();
	entry.idleTimer = timer;
}
function isMissingDatabasePath(pathname) {
	try {
		fs.statSync(pathname);
		return false;
	} catch (error) {
		return hasErrnoCode(error, "ENOENT");
	}
}
function acquireAuthProfileReadDatabase(pathname) {
	const resolvedPath = path.resolve(pathname);
	if (isDeletedAgentDatabasePath(resolvedPath)) return { status: "missing" };
	const cached = authProfileReadDatabases.get(resolvedPath);
	if (cached?.ready && cached.db.isOpen) {
		authProfileReadDatabases.delete(resolvedPath);
		authProfileReadDatabases.set(resolvedPath, cached);
		armReadHandleIdleClose(resolvedPath, cached);
		return {
			status: "readable",
			db: cached.db
		};
	}
	if (cached) closeAuthProfileReadDatabase(resolvedPath);
	for (const [pendingPath, entry] of authProfileReadDatabases) if (!entry.ready) closeAuthProfileReadDatabase(pendingPath);
	let db;
	try {
		db = openNodeSqliteDatabase(resolvedPath, { readOnly: true });
	} catch {
		return isMissingDatabasePath(resolvedPath) ? { status: "missing" } : { status: "unreadable" };
	}
	const candidate = {
		db,
		ready: false
	};
	authProfileReadDatabases.set(resolvedPath, candidate);
	unregisterReadHandleExitClose ??= registerSqliteCacheExitClose(closeAuthProfileReadPool);
	armReadHandleIdleClose(resolvedPath, candidate);
	let readable = false;
	try {
		enableNodeSqliteKyselyStatementCache(db);
		setSqliteBusyTimeout(db, OPENCLAW_SQLITE_BUSY_TIMEOUT_MS);
		readable = readSqliteUserVersion(db) <= 24;
	} catch {}
	if (!readable) {
		closeAuthProfileReadDatabase(resolvedPath);
		return { status: "unreadable" };
	}
	try {
		while (authProfileReadDatabases.size > AUTH_PROFILE_READ_HANDLE_CAP) {
			const oldestPath = authProfileReadDatabases.keys().next().value;
			if (oldestPath === void 0) break;
			closeAuthProfileReadDatabase(oldestPath);
		}
	} catch (error) {
		try {
			closeAuthProfileReadDatabase(resolvedPath);
		} catch (closeError) {
			throw new AggregateError([error, closeError], "Unable to close auth profile readers", { cause: closeError });
		}
		throw error;
	}
	candidate.ready = true;
	return {
		status: "readable",
		db
	};
}
//#endregion
export { isMissingDatabasePath as i, closeAuthProfileReadDatabase as n, closeAuthProfileReadPool as r, acquireAuthProfileReadDatabase as t };
