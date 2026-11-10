import { r as isPostgresSqlConnection } from "./sql-connection-DmQzXTVz.mjs";
import { a as executeSqliteQueryTakeFirstSync, i as executeSqliteQuerySync } from "./kysely-sync-9fPQaMlh.mjs";
import { r as runSqliteDeferredTransactionSync } from "./sqlite-transaction-CpDyZPQ0.mjs";
import { c as transcriptEventJsonSql, p as transcriptEventRunIdSql } from "./transcript-payload-Cu49oQKq.mjs";
import { s as readSessionTranscriptRunId } from "./transcript-events-D3brcRJS.mjs";
import { t as getSessionKysely } from "./session-accessor.sqlite-scope-helpers-XTtpZpWK.mjs";
import { t as readMessageIdempotencyKey } from "./transcript-message-identity-0wQEn3Eb.mjs";
import { n as selectVisibleTranscriptEvents } from "./transcript-visible-events-Ct6pwJvk.mjs";
import "./session-accessor.sqlite-scope-9ysL95gx.mjs";
import { n as assertSessionTranscriptHot } from "./session-cold-storage-state-CWFSrppd.mjs";
import { l as loadTranscriptEventsFromDatabase, v as readTranscriptEventMessage } from "./session-accessor.sqlite-read-Cx1b3WWI.mjs";
import { t as chunkItems } from "./chunk-items-2QWieLm-.mjs";
import { n as createTranscriptEntryAnchor } from "./session-accessor.sqlite-transcript-anchor-Dc-2VOHU.mjs";
//#region src/config/sessions/session-accessor.sqlite-transcript-mirror.ts
const TRANSCRIPT_MIRROR_KEY_QUERY_BATCH_SIZE = 900;
/** Read projection readiness once in the mirror's transaction snapshot. */
function readTranscriptMirrorProjection(database, sessionId) {
	const db = getSessionKysely(database.db);
	const state = executeSqliteQueryTakeFirstSync(database.db, db.selectFrom(db.selectFrom("transcript_events").select("seq").where("session_id", "=", sessionId).orderBy("seq", "desc").limit(1).as("latest")).leftJoin("session_transcript_index_state as state", (join) => join.on("state.session_id", "=", sessionId)).select([
		"latest.seq",
		"state.indexed_seq",
		"state.needs_rebuild"
	]).select((eb) => eb.exists(eb.selectFrom("session_transcript_active_events").select("session_id").where("session_id", "=", sessionId).where("context_eligible", "is", null)).as("has_unclassified")));
	if (!state) return {
		fallbackEvents: [],
		anchorsReady: false
	};
	if (state.needs_rebuild === 0 && state.indexed_seq === state.seq) return {
		fallbackEvents: void 0,
		anchorsReady: !state.has_unclassified
	};
	return {
		fallbackEvents: loadTranscriptEventsFromDatabase(database, sessionId),
		anchorsReady: false
	};
}
/** Reads the bounded identity facts needed by transcript mirrors. */
function readTranscriptMirrorFacts(database, resolved, params) {
	return runSqliteDeferredTransactionSync(database.db, () => {
		assertSessionTranscriptHot(database.db, resolved.sessionId);
		const idempotencyKeys = [...new Set(params.idempotencyKeys)];
		const { fallbackEvents, anchorsReady } = readTranscriptMirrorProjection(database, resolved.sessionId);
		if (fallbackEvents !== void 0) return readMirrorFactsFromEvents(fallbackEvents, new Set(idempotencyKeys), params.sourceRunId);
		const db = getSessionKysely(database.db);
		const facts = {
			anchorsByIdempotencyKey: /* @__PURE__ */ new Map(),
			existingIdempotencyKeys: /* @__PURE__ */ new Set(),
			messagesByIdempotencyKey: /* @__PURE__ */ new Map()
		};
		const batches = chunkItems(idempotencyKeys, TRANSCRIPT_MIRROR_KEY_QUERY_BATCH_SIZE);
		if (params.sourceRunId) {
			facts.sourceEvents = [];
			if (batches.length === 0) batches.push([]);
		}
		const events = db.selectFrom("transcript_event_identities as identity").innerJoin("transcript_events as event", (join) => join.onRef("identity.session_id", "=", "event.session_id").onRef("identity.seq", "=", "event.seq")).leftJoin("session_transcript_active_events as active", (join) => join.onRef("active.session_id", "=", "event.session_id").onRef("active.event_seq", "=", "event.seq")).leftJoin("transcript_rewrite_watermarks as rewrite", (join) => join.onRef("rewrite.session_id", "=", "event.session_id")).select([
			"identity.event_id",
			"identity.message_idempotency_key",
			"event.seq",
			"identity.parent_id",
			transcriptEventJsonSql(database.db, "event").as("event_json"),
			"active.message_position",
			"rewrite.generation"
		]);
		for (const batch of batches) {
			let query = events.where("identity.session_id", "=", resolved.sessionId).where("identity.message_idempotency_key", "in", batch).select((eb) => eb.val(0).as("is_source"));
			const sourceRunId = batch === batches[0] ? params.sourceRunId : void 0;
			if (sourceRunId) query = query.unionAll(events.where("event.session_id", "=", resolved.sessionId).where("active.event_seq", "is not", null).where("event.message_role", "=", "assistant").where("event.seq", ">=", (eb) => eb.fn.coalesce(db.selectFrom("transcript_event_identities").select("seq").where("session_id", "=", resolved.sessionId).where("message_idempotency_key", "=", `${sourceRunId}:user`), eb(db.selectFrom("transcript_events").select((latest) => latest.fn.max("seq").as("seq")).where("session_id", "=", resolved.sessionId), "-", 4095))).where(transcriptEventRunIdSql(database.db, "event"), "=", sourceRunId).select((eb) => eb.val(1).as("is_source")));
			const rows = executeSqliteQuerySync(database.db, query.orderBy(isPostgresSqlConnection(database.db) ? "seq" : "event.seq", "asc")).rows;
			for (const row of rows) {
				const event = JSON.parse(row.event_json);
				if (row.is_source) {
					facts.sourceEvents?.push(event);
					continue;
				}
				const message = readTranscriptEventMessage(event);
				const idempotencyKey = row.message_idempotency_key;
				if (!idempotencyKey || !row.event_id || !batch.includes(idempotencyKey)) continue;
				facts.existingIdempotencyKeys.add(idempotencyKey);
				const anchor = anchorsReady ? createTranscriptEntryAnchor({
					database,
					resolved,
					entryId: row.event_id,
					row
				}) : void 0;
				if (anchor) facts.anchorsByIdempotencyKey.set(idempotencyKey, anchor);
				if (message !== void 0) facts.messagesByIdempotencyKey.set(idempotencyKey, message);
			}
		}
		return facts;
	}, {
		databaseLabel: database.path,
		operationLabel: "session.transcript.mirror-facts"
	});
}
/** Extracts supplied mirror identities from authoritative transcript events. */
function readMirrorFactsFromEvents(events, candidateKeys, sourceRunId) {
	const facts = {
		anchorsByIdempotencyKey: /* @__PURE__ */ new Map(),
		existingIdempotencyKeys: /* @__PURE__ */ new Set(),
		messagesByIdempotencyKey: /* @__PURE__ */ new Map()
	};
	if (sourceRunId) facts.sourceEvents = selectVisibleTranscriptEvents(events).filter((event) => {
		const message = readTranscriptEventMessage(event);
		return message?.role === "assistant" && readSessionTranscriptRunId(message) === sourceRunId;
	});
	for (const event of events) {
		const message = readTranscriptEventMessage(event);
		const idempotencyKey = readMessageIdempotencyKey(message);
		if (!idempotencyKey || !candidateKeys.has(idempotencyKey)) continue;
		facts.existingIdempotencyKeys.add(idempotencyKey);
		if (message !== void 0) facts.messagesByIdempotencyKey.set(idempotencyKey, message);
	}
	return facts;
}
//#endregion
export { readTranscriptMirrorFacts as t };
