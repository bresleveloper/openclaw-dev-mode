import { a as getNodeSqliteKysely, r as executeSqliteQuerySync } from "./kysely-sync-K7ftY-g4.mjs";
import { n as getAdmittedSqliteSchemaFacts } from "./sqlite-schema-facts-CG0Tk84j.mjs";
import { n as ensureColumn } from "./openclaw-state-db-schema-helpers-BlZefrPy.mjs";
import { u as parseSqliteTableDefinition } from "./sqlite-schema-contract-BTxZz0OV.mjs";
import { createHash } from "node:crypto";
//#region src/agents/subagents/registry/subagent-registry.store.row.ts
/** Include indexed facts because decoding treats them as authoritative over payload fields. */
function subagentRunRowVersion(row) {
	return row ? createHash("sha256").update(JSON.stringify([
		row.run_id,
		row.child_session_key,
		row.controller_session_key,
		row.requester_session_key,
		row.requester_store_path ?? null,
		row.controller_store_path ?? null,
		row.created_at,
		row.payload_json
	])).digest("hex") : null;
}
//#endregion
//#region src/agents/subagents/registry/subagent-registry.store.kernel.ts
/** Check every admitted row before any row or companion effect is changed. */
function conflictingSubagentRunVersions(database, versions) {
	const stateDb = getNodeSqliteKysely(database.db);
	return versions.flatMap(({ runId, version }) => {
		const row = executeSqliteQuerySync(database.db, stateDb.selectFrom("subagent_runs").selectAll().where("run_id", "=", runId)).rows[0];
		return subagentRunRowVersion(row) === version ? [] : [runId];
	});
}
const parentStoreSchemas = /* @__PURE__ */ new WeakMap();
function hasParentStoreColumns(db) {
	const schema = getAdmittedSqliteSchemaFacts(db);
	if (!schema) throw new Error("Subagent rows require admitted schema facts");
	let present = parentStoreSchemas.get(schema);
	if (present === void 0) {
		const table = schema.tableSql.get("subagent_runs");
		const columns = table ? parseSqliteTableDefinition(table, "subagent_runs").columns : void 0;
		present = Boolean(columns?.has("requester_store_path") && columns.has("controller_store_path"));
		parentStoreSchemas.set(schema, present);
	}
	return present;
}
/** Upserts a prebound run on the exact supplied shared-state handle. */
function upsertSubagentRunRowInDatabase(database, row) {
	if (!hasParentStoreColumns(database.db)) {
		ensureColumn(database.db, "subagent_runs", "requester_store_path TEXT");
		ensureColumn(database.db, "subagent_runs", "controller_store_path TEXT");
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
/** Applies selected row changes inside the caller's transaction. */
function writeSubagentRunValuesInDatabase(database, values, deleteRunIds) {
	const { db } = database;
	const stateDb = getNodeSqliteKysely(db);
	for (const row of values) upsertSubagentRunRowInDatabase(database, row);
	if (deleteRunIds.length > 0) executeSqliteQuerySync(db, stateDb.deleteFrom("subagent_runs").where("run_id", "in", deleteRunIds));
}
//#endregion
export { writeSubagentRunValuesInDatabase as a, upsertSubagentRunRowInDatabase as i, deleteSubagentRunRowInDatabase as n, subagentRunRowVersion as o, hasParentStoreColumns as r, conflictingSubagentRunVersions as t };
