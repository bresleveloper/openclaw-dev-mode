import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { a as executeSqliteQueryTakeFirstSync, l as prepareSqliteQuerySync } from "./kysely-sync-9fPQaMlh.mjs";
import { c as transcriptEventJsonSql } from "./transcript-payload-Cu49oQKq.mjs";
import { t as getSessionKysely } from "./session-accessor.sqlite-scope-helpers-XTtpZpWK.mjs";
import { t as readMessageIdempotencyKey } from "./transcript-message-identity-0wQEn3Eb.mjs";
import "./session-accessor.sqlite-scope-9ysL95gx.mjs";
import { r as readSessionActorTransactionState } from "./session-actor-transaction-BIR0_goz.mjs";
import { C as readTranscriptIdentityByEventId, _ as readTranscriptEventId, r as findAssistantTranscriptEventInDatabase, v as readTranscriptEventMessage } from "./session-accessor.sqlite-read-Cx1b3WWI.mjs";
//#region src/config/sessions/session-accessor.sqlite-transcript-identity.ts
function createTranscriptIdentityInserter(database, sessionId, ignoreConflicts) {
	return prepareSqliteQuerySync(database.db, (parameter) => getSessionKysely(database.db).insertInto("transcript_event_identities").values({
		session_id: sessionId,
		event_id: parameter((row) => row.eventId),
		seq: parameter((row) => row.seq),
		event_type: parameter((row) => row.eventType),
		parent_id: parameter((row) => row.parentId),
		message_idempotency_key: parameter((row) => row.messageIdempotencyKey),
		created_at: parameter((row) => row.createdAt)
	}).$if(ignoreConflicts, (query) => query.onConflict((conflict) => conflict.columns(["session_id", "event_id"]).doNothing())));
}
function readIdempotencyKeyOwner(database, sessionId, idempotencyKey) {
	const actor = readSessionActorTransactionState(database, { sessionId });
	if (actor) {
		const row = [...actor.transcript.identities.values()].findLast((candidate) => candidate.message_idempotency_key === idempotencyKey);
		if (row || actor.transcript.complete) return row ? {
			eventId: row.event_id,
			seq: row.seq
		} : void 0;
	}
	const db = getSessionKysely(database.db);
	const row = executeSqliteQueryTakeFirstSync(database.db, db.selectFrom("transcript_event_identities").select(["event_id", "seq"]).where("session_id", "=", sessionId).where("message_idempotency_key", "=", idempotencyKey).orderBy("seq", "desc").limit(1));
	return row ? {
		eventId: row.event_id,
		seq: row.seq
	} : void 0;
}
function readTranscriptMessageByIdentity(database, scope, identity) {
	const actor = readSessionActorTransactionState(database, scope);
	if (actor?.transcript.payloads.has(identity.seq)) {
		const event = actor.transcript.payloads.get(identity.seq)?.event;
		return {
			messageId: identity.eventId,
			message: isRecord(event) ? event.message : void 0
		};
	}
	const db = getSessionKysely(database.db);
	const eventRow = executeSqliteQueryTakeFirstSync(database.db, db.selectFrom("transcript_events").select(transcriptEventJsonSql(database.db).as("event_json")).where("session_id", "=", scope.sessionId).where("seq", "=", identity.seq));
	if (!eventRow) return;
	const event = JSON.parse(eventRow.event_json);
	return {
		messageId: identity.eventId,
		message: event.message
	};
}
function readTranscriptMessageByEventId(database, scope, eventId) {
	const identity = readTranscriptIdentityByEventId(database, scope.sessionId, eventId);
	return identity ? readTranscriptMessageByIdentity(database, scope, identity) : void 0;
}
function readTranscriptEventIdentity(event) {
	if (!isRecord(event)) return;
	const eventId = typeof event.id === "string" && event.id.trim() ? event.id.trim() : void 0;
	return eventId ? {
		eventId,
		eventType: typeof event.type === "string" ? event.type : null,
		parentId: typeof event.parentId === "string" ? event.parentId : null,
		messageIdempotencyKey: readMessageIdempotencyKey(event.message)
	} : void 0;
}
function readTranscriptMessageByScopedIdempotencyKey(database, scope, idempotencyKey, lookup) {
	if (lookup !== "scan-assistant") {
		const identity = readIdempotencyKeyOwner(database, scope.sessionId, idempotencyKey);
		return identity ? readTranscriptMessageByIdentity(database, scope, identity) : void 0;
	}
	const found = findAssistantTranscriptEventInDatabase(database, scope.sessionId, idempotencyKey);
	if (!found) return;
	const message = readTranscriptEventMessage(found.event);
	return message ? {
		messageId: readTranscriptEventId(found.event) ?? idempotencyKey,
		message
	} : void 0;
}
//#endregion
export { readTranscriptMessageByScopedIdempotencyKey as a, readTranscriptMessageByEventId as i, readIdempotencyKeyOwner as n, readTranscriptEventIdentity as r, createTranscriptIdentityInserter as t };
