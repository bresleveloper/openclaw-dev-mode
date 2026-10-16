import { a as getNodeSqliteKysely, i as executeSqliteQueryTakeFirstSync, r as executeSqliteQuerySync } from "./kysely-sync-K7ftY-g4.mjs";
import { f as OPENCLAW_STATE_SCHEMA_SQL } from "./openclaw-state-db-legacy-backfills-BxTnDU05.mjs";
import { t as classifyExecutionOwnerBinding } from "./execution-owner-binding-B_XQzuKd.mjs";
//#region src/audit/execution-owner-lifecycle-binding-store.ts
const EXECUTION_OWNER_LIFECYCLE_BINDING_TABLE = "execution_owner_lifecycle_bindings";
const SCHEMA_START = `CREATE TABLE IF NOT EXISTS ${EXECUTION_OWNER_LIFECYCLE_BINDING_TABLE} (`;
const SCHEMA_END = ") STRICT;";
function lifecycleDb(db) {
	return getNodeSqliteKysely(db);
}
/** The write-admission owner calls this only for the first enabled binding write. */
function ensureExecutionOwnerLifecycleBindingSchema(db) {
	const start = OPENCLAW_STATE_SCHEMA_SQL.indexOf(SCHEMA_START);
	const end = start < 0 ? -1 : OPENCLAW_STATE_SCHEMA_SQL.indexOf(SCHEMA_END, start);
	if (start < 0 || end < start) throw new Error("OpenClaw execution owner lifecycle binding schema marker is missing.");
	db.exec(OPENCLAW_STATE_SCHEMA_SQL.slice(start, end + 9));
}
function classifyRetainedBinding(current, binding) {
	const state = classifyExecutionOwnerBinding({
		contextId: current.context_id,
		executionId: current.execution_id
	}, binding);
	return state === "unbound" ? "mismatch" : state;
}
/** Stores one exact identity after write admission prepared storage and revalidated the owner. */
function bindExecutionOwnerLifecycleMetadata(params) {
	const database = lifecycleDb(params.db);
	const current = executeSqliteQueryTakeFirstSync(params.db, database.selectFrom(EXECUTION_OWNER_LIFECYCLE_BINDING_TABLE).select(["context_id", "execution_id"]).where("owner_kind", "=", params.ownerKind).where("owner_id", "=", params.ownerId));
	if (current) return classifyRetainedBinding(current, params.binding);
	const inserted = executeSqliteQuerySync(params.db, database.insertInto(EXECUTION_OWNER_LIFECYCLE_BINDING_TABLE).values({
		owner_kind: params.ownerKind,
		owner_id: params.ownerId,
		context_id: params.binding.contextId,
		execution_id: params.binding.executionId
	}).onConflict((conflict) => conflict.columns(["owner_kind", "owner_id"]).doNothing()));
	if (Number(inserted.numAffectedRows ?? 0n) === 1) return "bound";
	const raced = executeSqliteQueryTakeFirstSync(params.db, database.selectFrom(EXECUTION_OWNER_LIFECYCLE_BINDING_TABLE).select(["context_id", "execution_id"]).where("owner_kind", "=", params.ownerKind).where("owner_id", "=", params.ownerId));
	return raced ? classifyRetainedBinding(raced, params.binding) : "mismatch";
}
/** Removes exact owner metadata without allocating the opt-in table. */
function deleteExecutionOwnerLifecycleMetadata(params) {
	if (params.ownerIds.length === 0 || !params.executionOwnerLifecycleBindings) return;
	executeSqliteQuerySync(params.db, lifecycleDb(params.db).deleteFrom(EXECUTION_OWNER_LIFECYCLE_BINDING_TABLE).where("owner_kind", "=", params.ownerKind).where("owner_id", "in", params.ownerIds));
}
//#endregion
export { deleteExecutionOwnerLifecycleMetadata as n, ensureExecutionOwnerLifecycleBindingSchema as r, bindExecutionOwnerLifecycleMetadata as t };
