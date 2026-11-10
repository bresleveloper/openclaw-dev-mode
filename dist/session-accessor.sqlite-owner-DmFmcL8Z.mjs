import { U as withSqliteDatabaseWriteScope, X as SESSION_OWNER_COLUMN_DEFINITIONS } from "./sqlite-database-admission-CqdNF9iE.mjs";
import { i as executeSqliteQuerySync } from "./kysely-sync-9fPQaMlh.mjs";
import { n as ensureColumn } from "./openclaw-state-db-schema-helpers-C7eId980.mjs";
import { c as runOpenClawAgentWriteTransaction } from "./openclaw-agent-db-_fC-kf1x.mjs";
import { i as toDatabaseOptions, t as getSessionKysely } from "./session-accessor.sqlite-scope-helpers-XTtpZpWK.mjs";
import { t as hasSqliteSessionOwnerColumns } from "./session-accessor.sqlite-owner-projection-BFkJufPp.mjs";
import { r as resolveSqliteScope } from "./session-accessor.sqlite-read-scope-DzGQuOfU.mjs";
import "./session-accessor.sqlite-scope-9ysL95gx.mjs";
import { r as publishSessionEntryCacheInvalidation, s as trackSessionEntryCacheWrite } from "./session-accessor.sqlite-entry-cache-BGcjBaH_.mjs";
import { o as readExactSessionEntryRow } from "./session-accessor.sqlite-entry-read-CLHpEbhT.mjs";
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
function sessionMetadataExpectedEntryMatches(database, sessionKey, expectedEntry) {
	const entry = readExactSessionEntryRow(database, sessionKey, "list")?.entry;
	return entry !== void 0 && isDeepStrictEqual(metadataAuthorityEntry(entry), metadataAuthorityEntry(expectedEntry));
}
function replaceSessionOwnerInTransaction(database, sessionKey, owner, postimages, expectedSessionId) {
	if (!hasSqliteSessionOwnerColumns(database.db)) {
		if (!owner?.actor.id) return false;
		for (const { columnName, dataType, tableName } of SESSION_OWNER_COLUMN_DEFINITIONS) ensureColumn(database.db, tableName, `${columnName} ${dataType}`);
	}
	let updated;
	const writeGeneration = trackSessionEntryCacheWrite(database, () => withSqliteDatabaseWriteScope(database.db, [sessionKey], () => {
		const query = getSessionKysely(database.db).updateTable("session_nodes").set({
			owner_actor_type: owner?.actor.type ?? null,
			owner_actor_id: owner?.actor.id ?? null,
			owner_assigned_by_type: owner?.assignedBy?.type ?? null,
			owner_assigned_by_id: owner?.assignedBy?.id ?? null,
			owner_assigned_at: owner?.assignedAt ?? null
		}).where("session_key", "=", sessionKey).returning((eb) => ["current_session_id", eb.fn("json_extract", [eb.ref("entry_json"), eb.val("$.lifecycleRevision")]).as("lifecycle_revision")]);
		updated = executeSqliteQuerySync(database.db, expectedSessionId === void 0 ? query : query.where("current_session_id", "=", expectedSessionId)).rows[0];
	}));
	if (!updated) return false;
	const postimage = postimages?.get(sessionKey);
	if (postimage) {
		postimage.entry = {
			...postimage.entry,
			owner
		};
		postimage.changed = true;
	}
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
		if (params.expectedSessionId !== void 0 && params.expectedEntry && params.expectedEntry.sessionId !== params.expectedSessionId) throw new Error("session changed before owner assignment");
		if (params.expectedEntry && !sessionMetadataExpectedEntryMatches(database, resolved.sessionKey, params.expectedEntry)) throw new Error("session ownership changed before owner assignment");
		const replaced = replaceSessionOwnerInTransaction(database, resolved.sessionKey, owner, void 0, params.expectedSessionId);
		if (!replaced && params.expectedSessionId !== void 0) throw new Error("session changed before owner assignment");
		return replaced;
	}, options, { operationLabel: "sessions.assign-owner" }) ? owner : null;
}
//#endregion
export { replaceSessionOwnerInTransaction as n, sessionMetadataExpectedEntryMatches as r, assignSessionOwner as t };
