import { o as getSqliteReadScopeRevision } from "./sqlite-schema-facts-C8u_9Af1.mjs";
import { i as executeSqliteQuerySync } from "./kysely-sync-9fPQaMlh.mjs";
import { t as getSessionKysely } from "./session-accessor.sqlite-scope-helpers-XTtpZpWK.mjs";
import "./session-accessor.sqlite-scope-9ysL95gx.mjs";
import { r as readSessionActorTransactionState } from "./session-actor-transaction-BIR0_goz.mjs";
import { r as readHotSessionTranscriptSnapshot } from "./session-cold-storage-state-CWFSrppd.mjs";
import "./session-cold-storage-read-DxurMT4l.mjs";
import { n as readSessionTranscriptAnchorsAsync } from "./session-transcript-anchor-read-DMRJnQDO.mjs";
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
function rememberCommittedTranscriptMessageSequencesInTransaction(database, sessionId, messages, postimage) {
	const appendedMessages = messages.filter((message) => message.appended);
	for (const message of appendedMessages) committedTranscriptMessageSequences.delete(message);
	if (appendedMessages.length === 0) return;
	const actor = readSessionActorTransactionState(database, { sessionId });
	if (actor) {
		if (actor.transcript.projection?.needsRebuild !== false) return;
		for (const message of appendedMessages) {
			const identity = actor.transcript.identities.get(message.messageId);
			const position = identity && actor.transcript.active.get(identity.seq)?.message_position;
			if (position !== null && position !== void 0) committedTranscriptMessageSequences.set(message, position + 1);
		}
		return;
	}
	const only = appendedMessages.length === 1 ? appendedMessages[0] : void 0;
	if (only && postimage?.anchor.sessionId === sessionId && postimage.anchor.entryId === only.messageId && getSqliteReadScopeRevision(database.db) === postimage.revision) {
		committedTranscriptMessageSequences.set(only, postimage.anchor.activeMessagePosition + 1);
		return;
	}
	const db = getSessionKysely(database.db);
	for (let offset = 0; offset < appendedMessages.length; offset += TRANSCRIPT_CURSOR_BATCH_SIZE) {
		const batch = appendedMessages.slice(offset, offset + TRANSCRIPT_CURSOR_BATCH_SIZE);
		const rows = readHotSessionTranscriptSnapshot(database, sessionId, "identity", () => executeSqliteQuerySync(database.db, db.selectFrom("transcript_event_identities as identity").innerJoin("session_transcript_active_events as active", (join) => join.onRef("active.session_id", "=", "identity.session_id").onRef("active.event_seq", "=", "identity.seq")).innerJoin("session_transcript_index_state as state", "state.session_id", "identity.session_id").select(["identity.event_id", "active.message_position"]).where("state.needs_rebuild", "=", 0).where("identity.session_id", "=", sessionId).where("identity.event_id", "in", batch.map((message) => message.messageId)).where("active.message_position", "is not", null)).rows);
		const positions = new Map(rows.map((row) => [row.event_id, row.message_position]));
		for (const message of batch) {
			const position = positions.get(message.messageId);
			if (position !== null && position !== void 0) committedTranscriptMessageSequences.set(message, position + 1);
		}
	}
}
/** Resolve a multi-message turn's final branch through the existing history reader. */
async function rememberCommittedTranscriptMessageSequences(scope, messages) {
	const appended = messages.filter((message) => message.appended);
	if (appended.length === 0 || !scope.agentId || !scope.sessionId || !scope.sessionKey) return;
	if (appended.length === 1) {
		for (const message of appended) if (message.anchor) committedTranscriptMessageSequences.set(message, message.anchor.activeMessagePosition + 1);
		return;
	}
	const facts = await readSessionTranscriptAnchorsAsync({
		...scope,
		sessionId: scope.sessionId,
		sessionKey: scope.sessionKey
	}, { entryIds: appended.map((message) => message.messageId) });
	const positions = new Map(facts.anchors.map((anchor) => [anchor.entryId, anchor.activeMessagePosition + 1]));
	for (const message of appended) {
		const position = positions.get(message.messageId);
		if (position !== void 0) committedTranscriptMessageSequences.set(message, position);
	}
}
//#endregion
export { rememberCommittedTranscriptMessageSequencesInTransaction as i, readCommittedTranscriptMessageSequence as n, rememberCommittedTranscriptMessageSequences as r, installCommittedTranscriptMessageSequences as t };
