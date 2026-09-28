import { r as isPathInside } from "./path-guards-D5kuI0Tv.mjs";
import { t as hasErrnoCode } from "./errno-CkbDOfLk.mjs";
import { n as compareValidSemver } from "./semver-aYpwYdrQ.mjs";
import { i as getNodeSqliteKysely, n as executeSqliteQuerySync, r as executeSqliteQueryTakeFirstSync } from "./kysely-sync-Bn6Qrpbz.mjs";
import { i as executeWithCachedStatement, r as enableNodeSqliteKyselyStatementCache, t as clearNodeSqliteKyselyCacheForDatabase } from "./kysely-sync-cache-state-CFxglP-_.mjs";
import { n as readSqliteDataVersion, s as resolveSqliteFilesystemPath, t as openNodeSqliteDatabase } from "./node-sqlite-BO6jRFcG.mjs";
import { i as isSqliteCorruptionError } from "./sqlite-error-diagnostics-C8UyxYRx.mjs";
import { i as setSqliteBusyTimeout } from "./sqlite-busy-timeout-DYrW2wFu.mjs";
import { o as OPENCLAW_SQLITE_BUSY_TIMEOUT_MS } from "./openclaw-state-db-contract-dESpOAuZ.mjs";
import { a as readSqliteUserVersion } from "./sqlite-user-version-B1TtVu8E.mjs";
import { a as registerSqliteCacheExitClose, o as runInSqliteMaintenanceContext } from "./sqlite-wal-BzoPsBh0.mjs";
import "./openclaw-agent-db-contract-DzsRD6Fl.mjs";
import fs from "node:fs";
import path from "node:path";
//#region src/infra/sqlite-read-cache.ts
function readCacheToken(database, databasePath) {
	if (database.isTransaction) return;
	const dataVersion = readSqliteDataVersion(database);
	const wal = fs.statSync(`${databasePath}-wal`, {
		bigint: true,
		throwIfNoEntry: false
	});
	if (!wal || wal.size === 0n) return `${dataVersion}:empty`;
	const version = database.prepare("SELECT sqlite_version() AS version").get()?.version;
	if (typeof version !== "string" || (compareValidSemver(version, "3.53.0") ?? -1) < 0) return;
	const checkpoint = database.prepare("PRAGMA main.wal_checkpoint(NOOP)").get();
	const pageSize = database.prepare("PRAGMA main.page_size").get()?.page_size;
	const frames = checkpoint?.log;
	if (checkpoint?.busy !== 0 || typeof frames !== "number" || !Number.isSafeInteger(frames) || frames < 0 || typeof pageSize !== "number" || !Number.isSafeInteger(pageSize) || pageSize <= 0 || wal.size !== 32n + BigInt(frames) * (24n + BigInt(pageSize))) return;
	return `${dataVersion}:${frames}:${pageSize}`;
}
/** Bracket rows on their existing connection; no extra source descriptors or writes. */
function prepareSqliteReadCache(database, databasePath) {
	let before;
	try {
		const location = database.location();
		if (location && resolveSqliteFilesystemPath(path.resolve(location)) === resolveSqliteFilesystemPath(path.resolve(databasePath))) before = readCacheToken(database, databasePath);
	} catch (error) {
		if (isSqliteCorruptionError(error)) throw error;
	}
	return () => {
		if (before === void 0) return false;
		try {
			return readCacheToken(database, databasePath) === before;
		} catch (error) {
			if (isSqliteCorruptionError(error)) throw error;
			return false;
		}
	};
}
//#endregion
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
		readable = readSqliteUserVersion(db) <= 23;
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
//#region src/agents/auth-profiles/sqlite-json.ts
const PRIMARY_ROW_KEY = "primary";
const SHARED_STORE_STATE_KEY = "authProfiles.store";
const SHARED_STATE_STATE_KEY = "authProfiles.state";
const SHARED_AUTH_STORE_STATE_KEY = "auth.sharedStore";
function readSharedAuthKvCell(db, stateKey) {
	return executeSqliteQueryTakeFirstSync(db, getSharedAuthProfileKysely(db).selectFrom("config_machine_state").select("value_json").where("state_key", "=", stateKey))?.value_json;
}
function getAgentAuthProfileKysely(db) {
	return getNodeSqliteKysely(db);
}
function getSharedAuthProfileKysely(db) {
	return getNodeSqliteKysely(db);
}
function inspectAuthProfileTable(db, target, databaseKind) {
	const tableName = databaseKind === "shared-state" ? "config_machine_state" : target === "store" ? "auth_profile_store" : "auth_profile_state";
	const schemaObject = executeWithCachedStatement(db, "SELECT type FROM sqlite_master WHERE name = ?", [tableName], (statement) => statement.get(tableName));
	if (!schemaObject) return {
		status: "missing",
		reason: "table"
	};
	return schemaObject.type === "table" ? null : { status: "unreadable" };
}
function inspectAuthProfileJsonCell(db, target, databaseKind) {
	const tableInspection = inspectAuthProfileTable(db, target, databaseKind);
	if (tableInspection) return tableInspection;
	let raw;
	if (databaseKind === "shared-state") {
		const cell = readSharedAuthKvCell(db, target === "store" ? SHARED_STORE_STATE_KEY : SHARED_STATE_STATE_KEY);
		if (cell === void 0) return {
			status: "missing",
			reason: "row"
		};
		raw = cell;
	} else if (target === "store") {
		const row = executeSqliteQueryTakeFirstSync(db, getAgentAuthProfileKysely(db).selectFrom("auth_profile_store").select("store_json").where("store_key", "=", PRIMARY_ROW_KEY));
		if (!row) return {
			status: "missing",
			reason: "row"
		};
		raw = row.store_json;
	} else {
		const row = executeSqliteQueryTakeFirstSync(db, getAgentAuthProfileKysely(db).selectFrom("auth_profile_state").select("state_json").where("state_key", "=", PRIMARY_ROW_KEY));
		if (!row) return {
			status: "missing",
			reason: "row"
		};
		raw = row.state_json;
	}
	try {
		return {
			status: "readable",
			raw: JSON.parse(raw)
		};
	} catch {
		return { status: "unreadable" };
	}
}
function inspectAgentAuthProfileJsonCellReadOnly(databasePath, target) {
	const acquired = acquireAuthProfileReadDatabase(databasePath);
	if (acquired.status === "missing") return {
		status: "missing",
		reason: "database"
	};
	if (acquired.status === "unreadable") return { status: "unreadable" };
	try {
		return inspectAuthProfileJsonCell(acquired.db, target, "agent");
	} catch {
		closeAuthProfileReadDatabase(databasePath);
		return { status: "unreadable" };
	}
}
/** Shared and agent rows use one connection for their committed-generation proof. */
function readAuthProfileRows(database, databasePath, databaseKind) {
	const canCache = prepareSqliteReadCache(database, databasePath);
	const store = inspectAuthProfileJsonCell(database, "store", databaseKind);
	const state = inspectAuthProfileJsonCell(database, "state", databaseKind);
	return {
		store,
		state,
		cacheable: store.status !== "unreadable" && state.status !== "unreadable" && canCache()
	};
}
/** Write one canonical auth cell on the caller's admitted transaction connection. */
function writeAuthProfileJsonCell(database, target, kind, payload) {
	const value = JSON.stringify(payload);
	const now = Date.now();
	if (kind === "shared-state") executeSqliteQuerySync(database, getSharedAuthProfileKysely(database).insertInto("config_machine_state").values({
		state_key: target === "store" ? SHARED_STORE_STATE_KEY : SHARED_STATE_STATE_KEY,
		value_json: value,
		updated_at_ms: now
	}).onConflict((conflict) => conflict.column("state_key").doUpdateSet({
		value_json: value,
		updated_at_ms: now
	})));
	else if (target === "store") executeSqliteQuerySync(database, getAgentAuthProfileKysely(database).insertInto("auth_profile_store").values({
		store_key: PRIMARY_ROW_KEY,
		store_json: value,
		updated_at: now
	}).onConflict((conflict) => conflict.column("store_key").doUpdateSet({
		store_json: value,
		updated_at: now
	})));
	else executeSqliteQuerySync(database, getAgentAuthProfileKysely(database).insertInto("auth_profile_state").values({
		state_key: PRIMARY_ROW_KEY,
		state_json: value,
		updated_at: now
	}).onConflict((conflict) => conflict.column("state_key").doUpdateSet({
		state_json: value,
		updated_at: now
	})));
}
function deleteAuthProfileJsonCell(database, target, kind) {
	if (kind === "shared-state") executeSqliteQuerySync(database, getSharedAuthProfileKysely(database).deleteFrom("config_machine_state").where("state_key", "=", target === "store" ? SHARED_STORE_STATE_KEY : SHARED_STATE_STATE_KEY));
	else if (target === "store") executeSqliteQuerySync(database, getAgentAuthProfileKysely(database).deleteFrom("auth_profile_store").where("store_key", "=", PRIMARY_ROW_KEY));
	else executeSqliteQuerySync(database, getAgentAuthProfileKysely(database).deleteFrom("auth_profile_state").where("state_key", "=", PRIMARY_ROW_KEY));
}
//#endregion
export { deleteAuthProfileJsonCell as a, inspectAuthProfileJsonCell as c, writeAuthProfileJsonCell as d, acquireAuthProfileReadDatabase as f, SHARED_STORE_STATE_KEY as i, readAuthProfileRows as l, isMissingDatabasePath as m, SHARED_AUTH_STORE_STATE_KEY as n, getAgentAuthProfileKysely as o, closeAuthProfileReadPool as p, SHARED_STATE_STATE_KEY as r, inspectAgentAuthProfileJsonCellReadOnly as s, PRIMARY_ROW_KEY as t, readSharedAuthKvCell as u };
