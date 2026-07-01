import { m as resolveUserPath } from "./utils-BApvfmPs.js";
import { _ as getNodeSqliteKysely, d as resolveSqliteDatabaseFilePaths, g as executeSqliteQueryTakeFirstSync, h as executeSqliteQuerySync, m as clearNodeSqliteKyselyCacheForDatabase, p as requireNodeSqlite, t as OPENCLAW_SQLITE_BUSY_TIMEOUT_MS } from "./openclaw-state-db-gblCDNfo.js";
import { s as resolveDefaultAgentDir, u as resolveRegisteredAgentIdForDir } from "./agent-scope-config-C3ijpoNo.js";
import { n as runOpenClawAgentWriteTransaction } from "./openclaw-agent-db-DnkmrK7Q.js";
import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
//#region src/agents/auth-profiles/sqlite.ts
/**
* SQLite persistence adapter for auth profile secrets and runtime state.
* The public helpers expose raw JSON payloads so normalization stays in the
* store/state layers that own compatibility rules.
*/
const PRIMARY_ROW_KEY = "primary";
function resolveAgentDir(agentDir) {
	return resolveUserPath(agentDir ?? resolveDefaultAgentDir({}));
}
function inferAgentIdFromDir(agentDir) {
	const normalized = path.normalize(agentDir);
	if (path.basename(normalized) === "agent") {
		const parent = path.basename(path.dirname(normalized));
		if (parent) return parent;
	}
	return `custom-${createHash("sha256").update(normalized).digest("hex").slice(0, 12)}`;
}
function resolveAuthProfileDatabaseOptions(agentDir) {
	const dir = resolveAgentDir(agentDir);
	return {
		agentId: resolveRegisteredAgentIdForDir(dir) ?? inferAgentIdFromDir(dir),
		path: path.join(dir, "openclaw-agent.sqlite")
	};
}
/** Resolves the SQLite database path that stores auth profiles for an agent dir. */
function resolveAuthProfileDatabasePath(agentDir) {
	return resolveAuthProfileDatabaseOptions(agentDir).path;
}
/** Resolves the SQLite database and sidecar paths used by auth profiles. */
function resolveAuthProfileDatabaseFilePaths(agentDir) {
	return resolveSqliteDatabaseFilePaths(resolveAuthProfileDatabasePath(agentDir));
}
function parseJsonCell(raw) {
	if (!raw) return null;
	try {
		return JSON.parse(raw);
	} catch {
		return null;
	}
}
function getAuthProfileKysely(db) {
	return getNodeSqliteKysely(db);
}
function readAuthProfileJsonCellReadOnly(pathname, target) {
	const db = new (requireNodeSqlite()).DatabaseSync(pathname, { readOnly: true });
	try {
		db.exec(`PRAGMA busy_timeout = ${OPENCLAW_SQLITE_BUSY_TIMEOUT_MS};`);
		const kysely = getAuthProfileKysely(db);
		if (target === "store") return parseJsonCell(executeSqliteQueryTakeFirstSync(db, kysely.selectFrom("auth_profile_store").select("store_json").where("store_key", "=", PRIMARY_ROW_KEY))?.store_json);
		return parseJsonCell(executeSqliteQueryTakeFirstSync(db, kysely.selectFrom("auth_profile_state").select("state_json").where("state_key", "=", PRIMARY_ROW_KEY))?.state_json);
	} catch {
		return null;
	} finally {
		clearNodeSqliteKyselyCacheForDatabase(db);
		db.close();
	}
}
/** Reads the raw persisted secrets-store payload without coercing the schema. */
function readPersistedAuthProfileStoreRaw(agentDir, database) {
	if (database) {
		const db = getAuthProfileKysely(database.db);
		return parseJsonCell(executeSqliteQueryTakeFirstSync(database.db, db.selectFrom("auth_profile_store").select("store_json").where("store_key", "=", PRIMARY_ROW_KEY))?.store_json);
	}
	const databasePath = resolveAuthProfileDatabasePath(agentDir);
	if (!fs.existsSync(databasePath)) return null;
	return readAuthProfileJsonCellReadOnly(databasePath, "store");
}
/** Reads the raw persisted runtime-state payload without coercing the schema. */
function readPersistedAuthProfileStateRaw(agentDir, database) {
	if (database) {
		const db = getAuthProfileKysely(database.db);
		return parseJsonCell(executeSqliteQueryTakeFirstSync(database.db, db.selectFrom("auth_profile_state").select("state_json").where("state_key", "=", PRIMARY_ROW_KEY))?.state_json);
	}
	const databasePath = resolveAuthProfileDatabasePath(agentDir);
	if (!fs.existsSync(databasePath)) return null;
	return readAuthProfileJsonCellReadOnly(databasePath, "state");
}
/** Writes the raw persisted secrets-store payload inside the auth database. */
function writePersistedAuthProfileStoreRaw(payload, agentDir, database) {
	const write = (target) => {
		const db = getAuthProfileKysely(target.db);
		executeSqliteQuerySync(target.db, db.insertInto("auth_profile_store").values({
			store_key: PRIMARY_ROW_KEY,
			store_json: JSON.stringify(payload),
			updated_at: Date.now()
		}).onConflict((conflict) => conflict.column("store_key").doUpdateSet({
			store_json: JSON.stringify(payload),
			updated_at: Date.now()
		})));
	};
	if (database) {
		write(database);
		return;
	}
	runOpenClawAgentWriteTransaction(write, resolveAuthProfileDatabaseOptions(agentDir));
}
/** Deletes the persisted secrets-store row while leaving runtime state intact. */
function deletePersistedAuthProfileStoreRaw(agentDir, database) {
	const remove = (target) => {
		const db = getAuthProfileKysely(target.db);
		executeSqliteQuerySync(target.db, db.deleteFrom("auth_profile_store").where("store_key", "=", PRIMARY_ROW_KEY));
	};
	if (database) {
		remove(database);
		return;
	}
	runOpenClawAgentWriteTransaction(remove, resolveAuthProfileDatabaseOptions(agentDir));
}
/** Writes or deletes the persisted runtime-state payload. */
function writePersistedAuthProfileStateRaw(payload, agentDir, database) {
	const write = (target) => {
		const db = getAuthProfileKysely(target.db);
		if (!payload) {
			executeSqliteQuerySync(target.db, db.deleteFrom("auth_profile_state").where("state_key", "=", PRIMARY_ROW_KEY));
			return;
		}
		executeSqliteQuerySync(target.db, db.insertInto("auth_profile_state").values({
			state_key: PRIMARY_ROW_KEY,
			state_json: JSON.stringify(payload),
			updated_at: Date.now()
		}).onConflict((conflict) => conflict.column("state_key").doUpdateSet({
			state_json: JSON.stringify(payload),
			updated_at: Date.now()
		})));
	};
	if (database) {
		write(database);
		return;
	}
	runOpenClawAgentWriteTransaction(write, resolveAuthProfileDatabaseOptions(agentDir));
}
/** Runs an auth-profile database write transaction for store/state updates. */
function runAuthProfileWriteTransaction(agentDir, operation) {
	return runOpenClawAgentWriteTransaction(operation, resolveAuthProfileDatabaseOptions(agentDir));
}
//#endregion
export { resolveAuthProfileDatabasePath as a, writePersistedAuthProfileStoreRaw as c, resolveAuthProfileDatabaseFilePaths as i, readPersistedAuthProfileStateRaw as n, runAuthProfileWriteTransaction as o, readPersistedAuthProfileStoreRaw as r, writePersistedAuthProfileStateRaw as s, deletePersistedAuthProfileStoreRaw as t };
