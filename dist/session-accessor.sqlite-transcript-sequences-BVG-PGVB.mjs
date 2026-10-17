import { i as executeSqliteQueryTakeFirstSync, r as executeSqliteQuerySync } from "./kysely-sync-K7ftY-g4.mjs";
import { s as openOpenClawAgentDatabase } from "./openclaw-agent-db-DBug3LUA.mjs";
import { i as toDatabaseOptions, t as getSessionKysely } from "./session-accessor.sqlite-scope-helpers-DOK3pvYX.mjs";
import { d as resolveSqliteTranscriptScope } from "./session-accessor.sqlite-scope-CdpbxR_m.mjs";
import { t as readHotSessionTranscriptSnapshot } from "./session-cold-storage-read-CfuaO6_K.mjs";
//#region src/config/sessions/session-accessor.sqlite-transcript-sequences.ts
const committedTranscriptMessageSequences = /* @__PURE__ */ new WeakMap();
const TRANSCRIPT_CURSOR_BATCH_SIZE = 64;
/** Reads the visible-message sequence captured from the final active branch. */
function readCommittedTranscriptMessageSequence(message) {
	return committedTranscriptMessageSequences.get(message);
}
/** Installs the executor's final active cursors on the exact acknowledged result objects. */
function installCommittedTranscriptMessageSequences(messages, sequences) {
	for (const [index, message] of messages.entries()) {
		const sequence = sequences[index];
		if (sequence !== void 0) committedTranscriptMessageSequences.set(message, sequence);
	}
}
/** Captures atomic turn cursors from the final projection before SQLite commits. */
function rememberCommittedTranscriptMessageSequencesInTransaction(database, sessionId, messages) {
	const appendedMessages = messages.filter((message) => message.appended);
	for (const message of appendedMessages) committedTranscriptMessageSequences.delete(message);
	if (appendedMessages.length === 0) return;
	const db = getSessionKysely(database.db);
	if (executeSqliteQueryTakeFirstSync(database.db, db.selectFrom("session_transcript_index_state").select("needs_rebuild").where("session_id", "=", sessionId))?.needs_rebuild !== 0) return;
	for (let offset = 0; offset < appendedMessages.length; offset += TRANSCRIPT_CURSOR_BATCH_SIZE) {
		const batch = appendedMessages.slice(offset, offset + TRANSCRIPT_CURSOR_BATCH_SIZE);
		const rows = readHotSessionTranscriptSnapshot(database, sessionId, "identity", () => executeSqliteQuerySync(database.db, db.selectFrom("transcript_event_identities as identity").innerJoin("session_transcript_active_events as active", (join) => join.onRef("active.session_id", "=", "identity.session_id").onRef("active.event_seq", "=", "identity.seq")).select(["identity.event_id", "active.message_position"]).where("identity.session_id", "=", sessionId).where("identity.event_id", "in", batch.map((message) => message.messageId)).where("active.message_position", "is not", null)).rows);
		const positions = new Map(rows.map((row) => [row.event_id, row.message_position]));
		for (const message of batch) {
			const position = positions.get(message.messageId);
			if (position !== null && position !== void 0) committedTranscriptMessageSequences.set(message, position + 1);
		}
	}
}
/** Resolves final cursors while an ordinary turn still owns its writer transaction. */
function rememberCommittedTranscriptMessageSequences(scope, messages) {
	if (messages.length === 0 || !scope.agentId || !scope.sessionId || !scope.sessionKey) return;
	const resolved = resolveSqliteTranscriptScope({
		agentId: scope.agentId,
		...scope.env ? { env: scope.env } : {},
		sessionId: scope.sessionId,
		sessionKey: scope.sessionKey,
		...scope.storePath ? { storePath: scope.storePath } : {}
	});
	rememberCommittedTranscriptMessageSequencesInTransaction(openOpenClawAgentDatabase(toDatabaseOptions(resolved)), resolved.sessionId, messages);
}
//#endregion
export { rememberCommittedTranscriptMessageSequencesInTransaction as i, readCommittedTranscriptMessageSequence as n, rememberCommittedTranscriptMessageSequences as r, installCommittedTranscriptMessageSequences as t };
