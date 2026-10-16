import { r as executeSqliteQuerySync } from "./kysely-sync-K7ftY-g4.mjs";
import { n as ensureColumn } from "./openclaw-state-db-schema-helpers-BlZefrPy.mjs";
import { i as SESSION_OWNER_COLUMN_DEFINITIONS } from "./openclaw-agent-db-additive-columns-DEY4xthY.mjs";
import { i as isIncognitoOpenClawAgentSqlitePath } from "./openclaw-agent-db.paths-DVbbFaej.mjs";
import { u as runOpenClawAgentWriteTransaction } from "./openclaw-agent-db-DBug3LUA.mjs";
import { i as toDatabaseOptions, t as getSessionKysely } from "./session-accessor.sqlite-scope-helpers-DOK3pvYX.mjs";
import { s as resolveSqliteScope } from "./session-accessor.sqlite-scope-CdpbxR_m.mjs";
import { t as hasSqliteSessionOwnerColumns } from "./session-accessor.sqlite-owner-projection-EwCluh1i.mjs";
import { P as readIncognitoSessionEntryCurrent, c as trackSessionEntryCacheWrite, r as publishSessionEntryCacheInvalidation } from "./session-accessor.sqlite-entry-cache-nS4OEr3G.mjs";
import { a as readExactSessionEntryRow } from "./session-accessor.sqlite-entry-read-CWTZjXLR.mjs";
import { t as readSessionEntryInstanceId } from "./session-accessor.sqlite-entry-identity-P-nzw0e8.mjs";
import { isDeepStrictEqual } from "node:util";
//#region src/config/sessions/session-accessor.sqlite-owner.ts
function metadataAuthorityEntry(entry) {
	return {
		sessionId: entry.sessionId,
		lifecycleRevision: entry.lifecycleRevision,
		createdActor: entry.createdActor,
		visibility: entry.visibility,
		incognito: entry.incognito
	};
}
/** Compare authoritative transaction-held fields without treating presentation updates as revocation. */
function sessionMetadataExpectedEntryMatches(database, sessionKey, expectedEntry, options) {
	const entry = isIncognitoOpenClawAgentSqlitePath(database.path, options) ? readIncognitoSessionEntryCurrent(database.db, sessionKey) : readExactSessionEntryRow(database, sessionKey, "list")?.entry;
	return entry !== void 0 && isDeepStrictEqual(metadataAuthorityEntry(entry), metadataAuthorityEntry(expectedEntry));
}
function replaceSessionOwnerInTransaction(database, sessionKey, owner) {
	if (!hasSqliteSessionOwnerColumns(database.db)) {
		if (!owner?.actor.id) return false;
		for (const { columnName, dataType, tableName } of SESSION_OWNER_COLUMN_DEFINITIONS) ensureColumn(database.db, tableName, `${columnName} ${dataType}`);
	}
	let updated;
	const writeGeneration = trackSessionEntryCacheWrite(database, () => {
		updated = executeSqliteQuerySync(database.db, getSessionKysely(database.db).updateTable("session_nodes").set({
			owner_actor_type: owner?.actor.type ?? null,
			owner_actor_id: owner?.actor.id ?? null,
			owner_assigned_by_type: owner?.assignedBy?.type ?? null,
			owner_assigned_by_id: owner?.assignedBy?.id ?? null,
			owner_assigned_at: owner?.assignedAt ?? null
		}).where("session_key", "=", sessionKey).returning((eb) => ["current_session_id", eb.fn("json_extract", [eb.ref("entry_json"), eb.val("$.lifecycleRevision")]).as("lifecycle_revision")])).rows[0];
	});
	if (!updated) return false;
	publishSessionEntryCacheInvalidation(database, {
		sessionKey,
		facts: {
			kind: "owner",
			sessionId: updated.current_session_id,
			lifecycleRevision: updated.lifecycle_revision,
			owner
		}
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
		if (params.expectedSessionId !== void 0 && (isIncognitoOpenClawAgentSqlitePath(database.path, options) ? readIncognitoSessionEntryCurrent(database.db, resolved.sessionKey)?.sessionId : readSessionEntryInstanceId(database, resolved.sessionKey)) !== params.expectedSessionId) throw new Error("session changed before owner assignment");
		if (params.expectedEntry && !sessionMetadataExpectedEntryMatches(database, resolved.sessionKey, params.expectedEntry, options)) throw new Error("session ownership changed before owner assignment");
		return replaceSessionOwnerInTransaction(database, resolved.sessionKey, owner);
	}, options, { operationLabel: "sessions.assign-owner" }) ? owner : null;
}
//#endregion
export { replaceSessionOwnerInTransaction as n, sessionMetadataExpectedEntryMatches as r, assignSessionOwner as t };
