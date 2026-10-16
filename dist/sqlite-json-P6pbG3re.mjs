import { a as getNodeSqliteKysely, i as executeSqliteQueryTakeFirstSync, r as executeSqliteQuerySync } from "./kysely-sync-K7ftY-g4.mjs";
import { i as executeWithCachedStatement } from "./kysely-sync-cache-state-eUau8Jaa.mjs";
import { n as compareValidSemver } from "./semver-aYpwYdrQ.mjs";
import { a as readSqliteDataVersion } from "./sqlite-schema-facts-CG0Tk84j.mjs";
import { o as resolveSqliteFilesystemPath } from "./node-sqlite-XIcwmOrl.mjs";
import { i as isSqliteCorruptionError } from "./sqlite-error-diagnostics-DCvjvszg.mjs";
import { n as closeAuthProfileReadDatabase, t as acquireAuthProfileReadDatabase } from "./sqlite-read-pool-B3hiJ5bv.mjs";
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
/** Read admitted auth cells without discarding malformed JSON needed for migration backups. */
function readAuthProfileJsonCellText(db, target, databaseKind) {
	if (databaseKind === "shared-state") return readSharedAuthKvCell(db, target === "store" ? SHARED_STORE_STATE_KEY : SHARED_STATE_STATE_KEY);
	return target === "store" ? executeSqliteQueryTakeFirstSync(db, getAgentAuthProfileKysely(db).selectFrom("auth_profile_store").select("store_json").where("store_key", "=", PRIMARY_ROW_KEY))?.store_json : executeSqliteQueryTakeFirstSync(db, getAgentAuthProfileKysely(db).selectFrom("auth_profile_state").select("state_json").where("state_key", "=", PRIMARY_ROW_KEY))?.state_json;
}
function inspectAuthProfileJsonCell(db, target, databaseKind) {
	const tableInspection = inspectAuthProfileTable(db, target, databaseKind);
	if (tableInspection) return tableInspection;
	const raw = readAuthProfileJsonCellText(db, target, databaseKind);
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
export { readAuthProfileJsonCellText as a, inspectAuthProfileJsonCell as i, deleteAuthProfileJsonCell as n, readAuthProfileRows as o, inspectAgentAuthProfileJsonCellReadOnly as r, writeAuthProfileJsonCell as s, SHARED_AUTH_STORE_STATE_KEY as t };
