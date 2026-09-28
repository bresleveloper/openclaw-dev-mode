import { n as executeSqliteQuerySync } from "./kysely-sync-Bn6Qrpbz.mjs";
import { t as ensureColumn } from "./openclaw-state-db-schema-helpers-Cck9Qf-B.mjs";
import { w as SESSION_OWNER_COLUMN_DEFINITIONS } from "./openclaw-agent-db-identity-DLTnzTd_.mjs";
import { f as runOpenClawAgentWriteTransaction } from "./openclaw-agent-db-CaQAStOA.mjs";
import { a as getSessionKysely, g as toDatabaseOptions, u as resolveSqliteScope } from "./session-accessor.sqlite-scope-DHC66DLY.mjs";
import { c as hasSqliteSessionOwnerColumns } from "./session-accessor.sqlite-status-DxkjEBwE.mjs";
import { a as publishSessionEntryCacheInvalidation, p as trackSessionEntryCacheWrite } from "./session-accessor.sqlite-entry-cache-CtMz7hDz.mjs";
//#region src/config/sessions/session-accessor.sqlite-owner.ts
function replaceSessionOwnerInTransaction(database, sessionKey, owner) {
	if (!hasSqliteSessionOwnerColumns(database.db)) {
		if (!owner?.actor.id) return false;
		for (const { columnName, dataType, tableName } of SESSION_OWNER_COLUMN_DEFINITIONS) ensureColumn(database.db, tableName, `${columnName} ${dataType}`);
	}
	let updated = false;
	const writeGeneration = trackSessionEntryCacheWrite(database, () => {
		updated = executeSqliteQuerySync(database.db, getSessionKysely(database.db).updateTable("session_nodes").set({
			owner_actor_type: owner?.actor.type ?? null,
			owner_actor_id: owner?.actor.id ?? null,
			owner_assigned_by_type: owner?.assignedBy?.type ?? null,
			owner_assigned_by_id: owner?.assignedBy?.id ?? null,
			owner_assigned_at: owner?.assignedAt ?? null
		}).where("session_key", "=", sessionKey)).numAffectedRows === 1n;
	});
	if (!updated) return false;
	publishSessionEntryCacheInvalidation(database, {
		sessionKey,
		facts: { kind: "unchanged" }
	}, writeGeneration);
	return true;
}
function assignSessionOwner(scope, params) {
	const resolved = resolveSqliteScope(scope);
	const options = toDatabaseOptions(resolved);
	const owner = {
		actor: params.owner,
		assignedBy: params.assignedBy,
		assignedAt: params.assignedAt ?? Date.now()
	};
	return runOpenClawAgentWriteTransaction((database) => {
		params.assertCurrent?.();
		return replaceSessionOwnerInTransaction(database, resolved.sessionKey, owner);
	}, options, { operationLabel: "sessions.assign-owner" }) ? owner : null;
}
//#endregion
export { replaceSessionOwnerInTransaction as n, assignSessionOwner as t };
