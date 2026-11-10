import { r as isPostgresSqlConnection } from "./sql-connection-DmQzXTVz.mjs";
import { i as executeWithCachedStatement } from "./kysely-sync-cache-state-Dc7tna9E.mjs";
import { A as readSqliteDatabaseWriteRevision } from "./sqlite-database-admission-CqdNF9iE.mjs";
import { d as readSqliteNativeMutationRevision, i as getAdmittedSqliteSchemaFacts } from "./sqlite-schema-facts-C8u_9Af1.mjs";
import { c as resolveSqliteFilesystemPath } from "./node-sqlite-CYaq-2Hb.mjs";
import { i as isSqliteCorruptionError } from "./sqlite-error-diagnostics-BBfTUJBR.mjs";
import "./artifact-preserving-state-reads-CSUBkGbZ.mjs";
import { a as executeSqliteQueryTakeFirstSync, i as executeSqliteQuerySync, o as getNodeSqliteKysely } from "./kysely-sync-9fPQaMlh.mjs";
import { n as closeAuthProfileReadDatabase, t as acquireAuthProfileReadDatabase } from "./sqlite-read-pool-DiFi5Ms3.mjs";
import path from "node:path";
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
const SHARED_AUTH_STORE_STATE_KEY = "auth.sharedStore";
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
function inspectAuthProfileTable(db, target, databaseKind) {
	const tableName = authProfileTableName(target, databaseKind);
	const schema = getAdmittedSqliteSchemaFacts(db);
	if (schema) return inspectAuthProfileTableType(authProfileSchemaObjectType(schema, tableName));
	return inspectAuthProfileTableType(executeWithCachedStatement(db, "SELECT type FROM sqlite_master WHERE name = ?", [tableName], (statement) => statement.get(tableName))?.type);
}
/** Read admitted auth cells without discarding malformed JSON needed for migration backups. */
function readAuthProfileJsonCellText(db, target, databaseKind) {
	if (databaseKind === "shared-state") return executeSqliteQueryTakeFirstSync(db, getNodeSqliteKysely(db).selectFrom("config_machine_state").select("value_json").where("state_key", "=", SHARED_AUTH_CELL_KEYS[target]))?.value_json;
	const cell = AGENT_AUTH_CELLS[target];
	return executeSqliteQueryTakeFirstSync(db, getNodeSqliteKysely(db).selectFrom(cell.table).select(cell.value).where(cell.key, "=", AUTH_PROFILE_PRIMARY_ROW_KEY))?.[cell.value];
}
function inspectAuthProfileJsonCell(db, target, databaseKind) {
	const tableInspection = inspectAuthProfileTable(db, target, databaseKind);
	if (tableInspection) return tableInspection;
	return inspectAuthProfileJsonCellContents(db, target, databaseKind);
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
function inspectAuthProfileRow(database, target, databaseKind) {
	try {
		return inspectAuthProfileJsonCell(database, target, databaseKind);
	} catch (error) {
		if (databaseKind === "shared-state") throw error;
		return { status: "unreadable" };
	}
}
/** The selected worker returns source presence without transferring credential rows. */
function hasAgentAuthProfileSourceInDatabase(database) {
	if (inspectAuthProfileRow(database, "store", "agent").status !== "missing") return true;
	const state = inspectAuthProfileRow(database, "state", "agent");
	return state.status === "readable" && Boolean(state.raw);
}
//#endregion
export { hasAgentAuthProfileSourceInDatabase as a, readAuthProfileJsonCellText as c, SHARED_AUTH_STORE_STATE_KEY as i, readAuthProfileRows as l, AUTH_PROFILE_PRIMARY_ROW_KEY as n, inspectAgentAuthProfileJsonCellReadOnly as o, SHARED_AUTH_CELL_KEYS as r, inspectAuthProfileJsonCell as s, AGENT_AUTH_CELLS as t };
