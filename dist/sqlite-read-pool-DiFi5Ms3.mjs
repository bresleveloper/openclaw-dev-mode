import { t as runInDetachedAsyncContext } from "./detached-async-context-D04NzekX.mjs";
import { t as hasErrnoCode } from "./errno-FR4CRyya.mjs";
import { r as isPathInside } from "./path-guards-CH7noY0Z.mjs";
import { s as OPENCLAW_SQLITE_BUSY_TIMEOUT_MS } from "./openclaw-state-db-contract-QlwTsE6j.mjs";
import { r as enableNodeSqliteKyselyStatementCache, t as clearNodeSqliteKyselyCacheForDatabase } from "./kysely-sync-cache-state-Dc7tna9E.mjs";
import { t as admitSqliteSchema } from "./sqlite-schema-facts-C8u_9Af1.mjs";
import { n as isArtifactPreservingStateRead } from "./artifact-preserving-state-reads-CSUBkGbZ.mjs";
import "./kysely-sync-9fPQaMlh.mjs";
import { c as registerAgentDatabaseReaderCloser, o as isDeletedAgentDatabasePath, s as matchesAgentDatabaseReadCandidatePath } from "./agent-database-readers-DSwi8tar.mjs";
import { o as registerSqliteCacheExitClose } from "./sqlite-wal-D2XTertL.mjs";
import { a as readSqliteUserVersion } from "./sqlite-user-version-Q7gNRxhK.mjs";
import { t as openSqliteReadOnlyDatabase } from "./sqlite-snapshot-source-DQdkM3YQ.mjs";
import "./openclaw-agent-db-contract-BcoeqAm4.mjs";
import fs from "node:fs";
import path from "node:path";
//#region src/agents/auth-profiles/sqlite-read-pool.ts
const AUTH_PROFILE_READ_HANDLE_CAP = 64;
const AUTH_PROFILE_READ_IDLE_MS = 18e5;
const authProfileReadDatabases = /* @__PURE__ */ new Map();
let unregisterReadHandleExitClose = null;
function closeAuthProfileReadDatabase(databasePath) {
	if (isArtifactPreservingStateRead("agent", databasePath)) return;
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
	for (const pathname of authProfileReadDatabases.keys()) if (scope?.kind !== "root" || isPathInside(scope.rootPath, pathname)) closeAuthProfileReadDatabase(pathname);
}
registerAgentDatabaseReaderCloser((candidates, retainedPaths) => {
	for (const pathname of authProfileReadDatabases.keys()) if (!retainedPaths?.has(pathname) && candidates.some((candidate) => matchesAgentDatabaseReadCandidatePath(candidate, pathname))) closeAuthProfileReadDatabase(pathname);
});
function armReadHandleIdleClose(pathname, entry) {
	if (entry.idleTimer) {
		entry.idleTimer.refresh();
		return;
	}
	const timer = runInDetachedAsyncContext(() => setTimeout(() => {
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
function acquireAuthProfileReadDatabase(pathname, schema, expectedIdentity) {
	const resolvedPath = path.resolve(pathname);
	if (isDeletedAgentDatabasePath(resolvedPath)) return { status: "missing" };
	const inspection = isArtifactPreservingStateRead("agent", resolvedPath);
	if (!inspection && schema && schema.userVersion > 27) {
		closeAuthProfileReadDatabase(resolvedPath);
		return { status: "unreadable" };
	}
	const cached = inspection ? void 0 : authProfileReadDatabases.get(resolvedPath);
	if (cached?.ready && cached.db.isOpen && (expectedIdentity === void 0 || cached.identity === expectedIdentity)) {
		authProfileReadDatabases.delete(resolvedPath);
		authProfileReadDatabases.set(resolvedPath, cached);
		armReadHandleIdleClose(resolvedPath, cached);
		return {
			status: "readable",
			db: cached.db
		};
	}
	if (cached) closeAuthProfileReadDatabase(resolvedPath);
	for (const [pendingPath, entry] of inspection ? [] : authProfileReadDatabases) if (!entry.ready) closeAuthProfileReadDatabase(pendingPath);
	let db;
	try {
		db = openSqliteReadOnlyDatabase(resolvedPath, { timeout: OPENCLAW_SQLITE_BUSY_TIMEOUT_MS });
	} catch {
		return isMissingDatabasePath(resolvedPath) ? { status: "missing" } : { status: "unreadable" };
	}
	const candidate = {
		db,
		identity: expectedIdentity,
		ready: false
	};
	if (!inspection) {
		authProfileReadDatabases.set(resolvedPath, candidate);
		unregisterReadHandleExitClose ??= registerSqliteCacheExitClose(closeAuthProfileReadPool);
		armReadHandleIdleClose(resolvedPath, candidate);
	}
	let readable = false;
	try {
		enableNodeSqliteKyselyStatementCache(db);
		if (inspection) readable = readSqliteUserVersion(db) <= 27;
		else if (schema) readable = true;
		else {
			admitSqliteSchema(db, (version) => {
				if (version > 27) throw new Error("Auth profile database uses a newer agent schema");
			});
			readable = true;
		}
	} catch {}
	const closeCandidate = () => inspection ? db.close() : closeAuthProfileReadDatabase(resolvedPath);
	if (!readable) {
		closeCandidate();
		return { status: "unreadable" };
	}
	if (inspection) return {
		status: "readable",
		db
	};
	try {
		while (authProfileReadDatabases.size > AUTH_PROFILE_READ_HANDLE_CAP) {
			const oldestPath = authProfileReadDatabases.keys().next().value;
			if (oldestPath === void 0) break;
			closeAuthProfileReadDatabase(oldestPath);
		}
	} catch (error) {
		try {
			closeCandidate();
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
