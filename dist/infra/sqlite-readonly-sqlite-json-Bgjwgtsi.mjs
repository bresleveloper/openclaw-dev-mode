import { D as registerAgentDatabaseReaderCloser, E as matchesAgentDatabaseReadCandidatePath, T as isDeletedAgentDatabasePath } from "./sqlite-readonly-worker-task-pool-CUbFmrb9.mjs";
import { dt as isPathInside, lt as hasNodeErrorCode } from "./sqlite-readonly-runtime-process-manifest-B1faCUt1.mjs";
import { D as getNodeSqliteKysely, E as executeSqliteQueryTakeFirstSync, Q as executeWithCachedStatement, T as executeSqliteQuerySync, Ut as runInDetachedAsyncContext, Y as clearNodeSqliteKyselyCacheForDatabase, Z as enableNodeSqliteKyselyStatementCache, _ as getAdmittedSqliteSchemaFacts, b as readSqliteNativeMutationRevision, bn as isPostgresSqlConnection, d as resolveSqliteFilesystemPath, m as admitSqliteSchema, yt as readSqliteDatabaseWriteRevision } from "./sqlite-readonly-sqlite-busy-timeout-CPLgQzS6.mjs";
import { S as isSqliteCorruptionError } from "./sqlite-readonly-schemas-CYdKD5YK.mjs";
import { t as openSqliteReadOnlyDatabase } from "./sqlite-readonly-sqlite-snapshot-source-CcYaV2mA.mjs";
import { Gt as OPENCLAW_SQLITE_BUSY_TIMEOUT_MS, gt as registerSqliteCacheExitClose, jt as readSqliteUserVersion, zn as isArtifactPreservingStateRead } from "./sqlite-readonly-location.worker.js";
import path from "node:path";
import fs from "node:fs";
//#region src/infra/sqlite-read-cache.ts
function readCacheToken(database) {
	if (database.isTransaction) return;
	const revision = readSqliteDatabaseWriteRevision(database);
	const local = readSqliteNativeMutationRevision(database);
	return revision === void 0 || local === void 0 ? void 0 : `${revision}:${local}`;
}
/** Bracket rows on their existing connection; no extra source descriptors or writes. */
function prepareSqliteReadCache(database, databasePath) {
	let before;
	try {
		const location = database.location();
		if (location && resolveSqliteFilesystemPath(path.resolve(location)) === resolveSqliteFilesystemPath(path.resolve(databasePath))) before = readCacheToken(database);
	} catch (error) {
		if (isSqliteCorruptionError(error)) throw error;
	}
	return () => {
		if (before === void 0) return false;
		try {
			return readCacheToken(database) === before;
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
		return hasNodeErrorCode(error, "ENOENT");
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
//#region src/agents/auth-profiles/sqlite-json.ts
const AUTH_PROFILE_PRIMARY_ROW_KEY = "primary";
const AGENT_AUTH_CELLS = {
	store: {
		table: "auth_profile_store",
		key: "store_key",
		value: "store_json"
	},
	state: {
		table: "auth_profile_state",
		key: "state_key",
		value: "state_json"
	}
};
const SHARED_AUTH_CELL_KEYS = {
	store: "authProfiles.store",
	state: "authProfiles.state"
};
function authProfileTableName(target, databaseKind) {
	return databaseKind === "shared-state" ? "config_machine_state" : AGENT_AUTH_CELLS[target].table;
}
function inspectAuthProfileTableType(type) {
	if (type === void 0) return {
		status: "missing",
		reason: "table"
	};
	return type === "table" ? null : { status: "unreadable" };
}
function authProfileSchemaObjectType(schema, name) {
	if (schema.tables.has(name)) return "table";
	return schema.views.has(name) || schema.indexes.has(name) || schema.triggers.has(name) ? "other" : void 0;
}
/** Read admitted auth cells without discarding malformed JSON needed for migration backups. */
function readAuthProfileJsonCellText(db, target, databaseKind) {
	if (databaseKind === "shared-state") return executeSqliteQueryTakeFirstSync(db, getNodeSqliteKysely(db).selectFrom("config_machine_state").select("value_json").where("state_key", "=", SHARED_AUTH_CELL_KEYS[target]))?.value_json;
	const cell = AGENT_AUTH_CELLS[target];
	return executeSqliteQueryTakeFirstSync(db, getNodeSqliteKysely(db).selectFrom(cell.table).select(cell.value).where(cell.key, "=", AUTH_PROFILE_PRIMARY_ROW_KEY))?.[cell.value];
}
function inspectAuthProfileJsonCellContents(db, target, databaseKind) {
	return inspectAuthProfileJsonText(readAuthProfileJsonCellText(db, target, databaseKind));
}
function inspectAuthProfileJsonText(raw) {
	if (raw === void 0) return {
		status: "missing",
		reason: "row"
	};
	try {
		return {
			status: "readable",
			raw: JSON.parse(raw)
		};
	} catch {
		return { status: "unreadable" };
	}
}
/** Reuse the worker-owned reader; each statement observes the latest committed rows. */
function readAuthProfileRowsReadOnly(databasePath, schema, expectedIdentity, retainReader = true) {
	const acquired = acquireAuthProfileReadDatabase(databasePath, schema, expectedIdentity);
	if (acquired.status !== "readable") {
		const inspection = acquired.status === "missing" ? {
			status: "missing",
			reason: "database"
		} : { status: "unreadable" };
		return {
			store: inspection,
			state: inspection,
			cacheable: false
		};
	}
	let keepReader = retainReader;
	try {
		const rows = readAuthProfileRows(acquired.db, databasePath, "agent", schema);
		if (rows.store.status === "missing" && rows.store.reason === "table" && rows.state.status === "missing" && rows.state.reason === "table") keepReader = false;
		return rows;
	} catch {
		closeAuthProfileReadDatabase(databasePath);
		return {
			store: { status: "unreadable" },
			state: { status: "unreadable" },
			cacheable: false
		};
	} finally {
		if (isArtifactPreservingStateRead("agent", databasePath)) acquired.db.close();
		else if (!keepReader) closeAuthProfileReadDatabase(databasePath);
	}
}
/** Worker reads acquire both cells in one SQLite snapshot. */
function readAuthProfileRows(database, databasePath, databaseKind, authSchema) {
	const canCache = isPostgresSqlConnection(database) ? () => false : prepareSqliteReadCache(database, databasePath);
	const storeTable = authProfileTableName("store", databaseKind);
	const stateTable = authProfileTableName("state", databaseKind);
	let schemaObjects;
	try {
		const schema = authSchema ? void 0 : getAdmittedSqliteSchemaFacts(database);
		if (authSchema) schemaObjects = [{
			name: storeTable,
			type: authSchema.store === "missing" ? void 0 : authSchema.store
		}, {
			name: stateTable,
			type: authSchema.state === "missing" ? void 0 : authSchema.state
		}];
		else if (schema) schemaObjects = [storeTable, stateTable].map((name) => ({
			name,
			type: authProfileSchemaObjectType(schema, name)
		}));
		else schemaObjects = executeWithCachedStatement(database, "SELECT name, type FROM sqlite_master WHERE name IN (?, ?)", [storeTable, stateTable], (statement) => statement.all(storeTable, stateTable));
	} catch (error) {
		if (databaseKind === "shared-state") throw error;
		return {
			store: { status: "unreadable" },
			state: { status: "unreadable" },
			cacheable: false
		};
	}
	const inspect = (target) => {
		const tableName = target === "store" ? storeTable : stateTable;
		const tableInspection = inspectAuthProfileTableType(schemaObjects.find((row) => row.name === tableName)?.type);
		if (tableInspection) return tableInspection;
		try {
			return inspectAuthProfileJsonCellContents(database, target, databaseKind);
		} catch (error) {
			if (databaseKind === "shared-state") throw error;
			return { status: "unreadable" };
		}
	};
	let store;
	let state;
	if ([storeTable, stateTable].every((name) => schemaObjects.some((row) => row.name === name && row.type === "table"))) try {
		const rows = databaseKind === "shared-state" ? executeSqliteQuerySync(database, getNodeSqliteKysely(database).selectFrom("config_machine_state").select(["state_key as target", "value_json as contents"]).where("state_key", "in", [SHARED_AUTH_CELL_KEYS.store, SHARED_AUTH_CELL_KEYS.state])).rows : executeSqliteQuerySync(database, getNodeSqliteKysely(database).selectFrom("auth_profile_store").select("store_json as contents").select((expression) => expression.val("store").as("target")).where("store_key", "=", AUTH_PROFILE_PRIMARY_ROW_KEY).unionAll(getNodeSqliteKysely(database).selectFrom("auth_profile_state").select("state_json as contents").select((expression) => expression.val("state").as("target")).where("state_key", "=", AUTH_PROFILE_PRIMARY_ROW_KEY))).rows;
		const texts = new Map(rows.map((row) => [row.target, row.contents]));
		store = inspectAuthProfileJsonText(texts.get(databaseKind === "shared-state" ? SHARED_AUTH_CELL_KEYS.store : "store"));
		state = inspectAuthProfileJsonText(texts.get(databaseKind === "shared-state" ? SHARED_AUTH_CELL_KEYS.state : "state"));
	} catch (error) {
		if (databaseKind === "shared-state") throw error;
		store = inspect("store");
		state = inspect("state");
	}
	else {
		store = inspect("store");
		state = inspect("state");
	}
	return {
		store,
		state,
		cacheable: store.status !== "unreadable" && state.status !== "unreadable" && canCache()
	};
}
//#endregion
export { readAuthProfileRowsReadOnly };
