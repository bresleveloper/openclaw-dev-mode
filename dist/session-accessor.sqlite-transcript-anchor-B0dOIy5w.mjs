import { r as executeSqliteQueryTakeFirstSync } from "./kysely-sync-Bn6Qrpbz.mjs";
import { l as openOpenClawAgentDatabase } from "./openclaw-agent-db-CaQAStOA.mjs";
import { a as getSessionKysely, g as toDatabaseOptions, m as resolveSqliteTranscriptScope } from "./session-accessor.sqlite-scope-DHC66DLY.mjs";
import { f as sessionTranscriptIndexNeedsReconcile } from "./session-transcript-index-UaRlRUAw.mjs";
import { t as readMessageIdempotencyKey } from "./transcript-message-identity-Cvvo_Q35.mjs";
//#region src/config/sessions/session-accessor.sqlite-transcript-anchor.ts
/** Reads one active message identity from the caller's current SQLite transaction. */
function readActiveTranscriptEntryAnchorInTransaction(params) {
	if (sessionTranscriptIndexNeedsReconcile(params.database.db, params.resolved.sessionId)) return;
	const db = getSessionKysely(params.database.db);
	const row = executeSqliteQueryTakeFirstSync(params.database.db, db.selectFrom("transcript_event_identities as identity").innerJoin("session_transcript_active_events as active", (join) => join.onRef("active.session_id", "=", "identity.session_id").onRef("active.event_seq", "=", "identity.seq")).innerJoin("transcript_rewrite_watermarks as rewrite", (join) => join.onRef("rewrite.session_id", "=", "identity.session_id")).select([
		"identity.seq",
		"identity.parent_id",
		"identity.message_idempotency_key",
		"active.message_position",
		"rewrite.generation"
	]).where("identity.session_id", "=", params.resolved.sessionId).where("identity.event_id", "=", params.entryId).limit(1));
	return createTranscriptEntryAnchor({
		...params,
		row
	});
}
/** Projects anchor fields after the caller verifies readiness in the same snapshot. */
function createTranscriptEntryAnchor(params) {
	const { row } = params;
	if (row?.message_position === null || row?.message_position === void 0 || row.generation === null) return;
	const idempotencyKey = row.message_idempotency_key ?? readMessageIdempotencyKey(params.message);
	return Object.freeze({
		agentId: params.resolved.agentId,
		sessionId: params.resolved.sessionId,
		sessionKey: params.resolved.sessionKey,
		storePath: params.database.path,
		generation: row.generation,
		entryId: params.entryId,
		rawSeq: row.seq,
		effectiveParentId: row.parent_id,
		activeMessagePosition: row.message_position,
		...idempotencyKey ? { idempotencyKey } : {}
	});
}
/** Reads one active message identity from the authoritative SQLite projection. */
function readActiveTranscriptEntryAnchor(params) {
	const resolved = resolveSqliteTranscriptScope(params);
	return readActiveTranscriptEntryAnchorInTransaction({
		database: openOpenClawAgentDatabase(toDatabaseOptions(resolved)),
		resolved,
		entryId: params.entryId
	});
}
//#endregion
export { readActiveTranscriptEntryAnchor as n, readActiveTranscriptEntryAnchorInTransaction as r, createTranscriptEntryAnchor as t };
