import { i as getNodeSqliteKysely, n as executeSqliteQuerySync } from "./kysely-sync-Bn6Qrpbz.mjs";
import { t as deferSqlitePostCommitPublication } from "./sqlite-post-commit-DJbkHzN8.mjs";
import { a as tableHasColumns, t as ensureColumn } from "./openclaw-state-db-schema-helpers-Cck9Qf-B.mjs";
//#region src/agents/subagents/registry/subagent-registry.store.kernel.ts
const parentStoreSchemas = /* @__PURE__ */ new WeakSet();
function hasParentStoreColumns(db) {
	if (parentStoreSchemas.has(db)) return true;
	const present = tableHasColumns(db, "subagent_runs", ["requester_store_path", "controller_store_path"]);
	if (present && !db.isTransaction) parentStoreSchemas.add(db);
	return present;
}
/** Upserts a prebound run on the exact supplied shared-state handle. */
function upsertSubagentRunRowInDatabase(database, row) {
	if (!parentStoreSchemas.has(database.db)) {
		if (!hasParentStoreColumns(database.db)) {
			ensureColumn(database.db, "subagent_runs", "requester_store_path TEXT");
			ensureColumn(database.db, "subagent_runs", "controller_store_path TEXT");
		}
		deferSqlitePostCommitPublication(database.db, () => parentStoreSchemas.add(database.db));
	}
	const stateDb = getNodeSqliteKysely(database.db);
	executeSqliteQuerySync(database.db, stateDb.insertInto("subagent_runs").values(row).onConflict((conflict) => conflict.column("run_id").doUpdateSet(subagentRunRecordToSqliteUpdate(row))));
}
/** Deletes one run on the exact supplied shared-state handle. */
function deleteSubagentRunRowInDatabase(database, runId) {
	executeSqliteQuerySync(database.db, getNodeSqliteKysely(database.db).deleteFrom("subagent_runs").where("run_id", "=", runId));
}
function subagentRunRecordToSqliteUpdate(values) {
	const { run_id: _runId, ...update } = values;
	return update;
}
/** The caller owns the transaction; both registry writers use this exact row kernel. */
function writeSubagentRunValuesInDatabase(database, values, deleteRunIds, retainedRunIds) {
	const { db } = database;
	const stateDb = getNodeSqliteKysely(db);
	for (const row of values) upsertSubagentRunRowInDatabase(database, row);
	if (retainedRunIds !== void 0) {
		const deleteQuery = retainedRunIds.length === 0 ? stateDb.deleteFrom("subagent_runs") : stateDb.deleteFrom("subagent_runs").where("run_id", "not in", retainedRunIds);
		executeSqliteQuerySync(db, deleteQuery);
	} else if (deleteRunIds && deleteRunIds.length > 0) executeSqliteQuerySync(db, stateDb.deleteFrom("subagent_runs").where("run_id", "in", deleteRunIds));
}
//#endregion
export { writeSubagentRunValuesInDatabase as i, hasParentStoreColumns as n, upsertSubagentRunRowInDatabase as r, deleteSubagentRunRowInDatabase as t };
