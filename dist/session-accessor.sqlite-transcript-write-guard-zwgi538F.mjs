import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { d as sql, i as executeSqliteQueryTakeFirstSync } from "./kysely-sync-K7ftY-g4.mjs";
import { t as redactIdentifier } from "./node-crypto-BG4u3UnX.mjs";
import { n as assertOwnedTranscriptWriteCommit, t as SessionTranscriptWriterClaimReboundError } from "./transcript-write-context-m7NE2aEm.mjs";
import { t as getSessionKysely } from "./session-accessor.sqlite-scope-helpers-DOK3pvYX.mjs";
import { m as transcriptWriteScopeIsCurrent } from "./session-accessor.sqlite-scope-CdpbxR_m.mjs";
import { l as readSessionEntryRow } from "./session-accessor.sqlite-entry-read-CWTZjXLR.mjs";
import { n as assertSessionTranscriptHot } from "./session-cold-storage-state-CzcE3h3O.mjs";
import "./session-accessor.sqlite-entry-store-BnbK5FTE.mjs";
//#region src/config/sessions/session-accessor.sqlite-transcript-write-guard.ts
function assertNonMessageTranscriptEvent(event) {
	if (isRecord(event) && "type" in event && event.type === "message") throw new Error("appendTranscriptEvent cannot write message transcript records; use appendTranscriptMessage instead.");
}
/** Revision guards keep this JSON predicate off stable mutation paths. */
function createSessionTranscriptOwnerPredicate(database, expected) {
	let query = getSessionKysely(database.db).selectFrom("session_nodes").select((eb) => eb.val(1).as("matches")).where("session_key", "=", expected.sessionKey).where("current_session_id", "=", expected.sessionId).where((eb) => eb(eb.fn("json_valid", ["entry_json"]), "=", 1)).where(sql`NOT EXISTS (
        SELECT 1 FROM json_each(entry_json)
        WHERE key IN ('sessionId', 'lifecycleRevision', 'activeWriterRunId')
        GROUP BY key HAVING count(*) > 1
      )`);
	for (const [jsonPath, value] of [
		["$.sessionId", expected.sessionId],
		["$.lifecycleRevision", expected.lifecycleRevision],
		["$.activeWriterRunId", expected.activeWriterRunId]
	]) query = query.where((eb) => value === void 0 ? eb(eb.fn("json_type", ["entry_json", eb.val(jsonPath)]), "is", null) : eb.and([eb(eb.fn("json_type", ["entry_json", eb.val(jsonPath)]), "=", "text"), eb(eb.fn("json_extract", ["entry_json", eb.val(jsonPath)]), "=", value)]));
	return () => executeSqliteQueryTakeFirstSync(database.db, query)?.matches === 1;
}
function resolveTranscriptAppendRefusal(entry, resolved, scope) {
	if (transcriptWriteScopeIsCurrent(entry, resolved.sessionId, scope)) return;
	const identity = {
		agentIdHash: redactIdentifier(resolved.agentId),
		expectedSessionIdHash: redactIdentifier(resolved.sessionId),
		sessionKeyHash: redactIdentifier(resolved.sessionKey)
	};
	if (!entry) return {
		...identity,
		code: "session-entry-missing"
	};
	return {
		...identity,
		actualSessionIdHash: redactIdentifier(entry.sessionId),
		code: "session-rebound"
	};
}
function assertLockedTranscriptWriteAllowed(database, resolved, scope) {
	assertSessionTranscriptHot(database.db, resolved.sessionId);
	const fencedScope = {
		...scope,
		sessionId: resolved.sessionId,
		sessionKey: resolved.sessionKey
	};
	assertOwnedTranscriptWriteCommit(fencedScope);
	if (fencedScope.expectedLifecycleRevision === void 0 && fencedScope.expectedWriterRunId === void 0 && fencedScope.expectedOwner === void 0) return;
	const fresh = readSessionEntryRow(database, resolved.sessionKey);
	const refusal = resolveTranscriptAppendRefusal(fresh?.entry, resolved, fencedScope);
	if (refusal) throw new SessionTranscriptWriterClaimReboundError(refusal);
	return fresh?.entry;
}
//#endregion
export { resolveTranscriptAppendRefusal as i, assertNonMessageTranscriptEvent as n, createSessionTranscriptOwnerPredicate as r, assertLockedTranscriptWriteAllowed as t };
