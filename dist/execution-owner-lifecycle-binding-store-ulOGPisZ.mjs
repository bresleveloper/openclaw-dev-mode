import { a as executeSqliteQueryTakeFirstSync, i as executeSqliteQuerySync, o as getNodeSqliteKysely } from "./kysely-sync-9fPQaMlh.mjs";
import { t as createSqliteSchemaEnsurer } from "./sqlite-schema-ensure-CwIgvH1h.mjs";
import { t as getOpenClawStateFeatureSchemaSql } from "./openclaw-state-feature-schema-CYc16G0w.mjs";
//#region src/audit/execution-owner-lifecycle-binding-store.ts
const EXECUTION_OWNER_LIFECYCLE_BINDING_TABLE = "execution_owner_lifecycle_bindings";
/** Only an enabled binding write allocates this existing optional table. */
const ensureExecutionOwnerLifecycleBindingSchema = createSqliteSchemaEnsurer(() => getOpenClawStateFeatureSchemaSql(EXECUTION_OWNER_LIFECYCLE_BINDING_TABLE), { tables: [EXECUTION_OWNER_LIFECYCLE_BINDING_TABLE] });
/** The first admitted execution owns this diagnostic link for the receipt's lifetime. */
function bindExecutionOwnerLifecycleMetadata(params) {
	const database = getNodeSqliteKysely(params.db);
	const inserted = executeSqliteQuerySync(params.db, database.insertInto(EXECUTION_OWNER_LIFECYCLE_BINDING_TABLE).values({
		owner_kind: params.ownerKind,
		owner_id: params.ownerId,
		context_id: params.binding.contextId,
		execution_id: params.binding.executionId
	}).onConflict((conflict) => conflict.columns(["owner_kind", "owner_id"]).doNothing()));
	if (Number(inserted.numAffectedRows ?? 0n) === 1) return "bound";
	const current = executeSqliteQueryTakeFirstSync(params.db, database.selectFrom(EXECUTION_OWNER_LIFECYCLE_BINDING_TABLE).select(["context_id", "execution_id"]).where("owner_kind", "=", params.ownerKind).where("owner_id", "=", params.ownerId));
	return current?.context_id === params.binding.contextId && current.execution_id === params.binding.executionId ? "already-bound" : "mismatch";
}
/** Removes exact owner metadata without allocating the opt-in table. */
function deleteExecutionOwnerLifecycleMetadata(params) {
	if (params.ownerIds.length === 0 || !params.executionOwnerLifecycleBindings) return;
	executeSqliteQuerySync(params.db, getNodeSqliteKysely(params.db).deleteFrom(EXECUTION_OWNER_LIFECYCLE_BINDING_TABLE).where("owner_kind", "=", params.ownerKind).where("owner_id", "in", params.ownerIds));
}
//#endregion
export { deleteExecutionOwnerLifecycleMetadata as n, ensureExecutionOwnerLifecycleBindingSchema as r, bindExecutionOwnerLifecycleMetadata as t };
