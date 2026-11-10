import { o as getSqliteReadScopeRevision } from "./sqlite-schema-facts-C8u_9Af1.mjs";
import { n as captureSqliteReaderOwner } from "./sqlite-reader-lifecycle-Cw11HwJP.mjs";
import { c as prepareSqliteQueryIterator, i as executeSqliteQuerySync, l as prepareSqliteQuerySync, n as createSqliteQueryCache, o as getNodeSqliteKysely, p as sql, u as prepareSqliteQueryTakeFirstSync } from "./kysely-sync-9fPQaMlh.mjs";
import { r as runSqliteDeferredTransactionSync } from "./sqlite-transaction-CpDyZPQ0.mjs";
import { o as readTranscriptPayload } from "./transcript-payload-Cu49oQKq.mjs";
import { r as readSessionActorTransactionState } from "./session-actor-transaction-BIR0_goz.mjs";
import { n as retainTranscriptContextFacts } from "./session-transcript-context-facts-JwNz0kep.mjs";
import { t as SessionTranscriptColdError } from "./session-cold-storage-state-CWFSrppd.mjs";
import { n as transcriptEventReadBytesSql } from "./session-transcript-read-bytes-D9BDv7Ny.mjs";
import { n as projectSessionActorContextMetadata } from "./session-actor-context-metadata-D9G7kaZr.mjs";
import { n as readSessionTranscriptProjectionReceipt } from "./session-transcript-projection-facts-scope-Cx0-0Ubn.mjs";
//#region src/config/sessions/session-transcript-projection-facts.ts
function projectSessionTranscriptFacts(actor) {
	const { active, coldArchive, identities, navigation, projection } = actor.transcript;
	let latestIndexedReset = null;
	let hasUnindexedPrefix = true;
	for (const identity of identities.values()) {
		hasUnindexedPrefix &&= identity.seq !== navigation[0]?.seq;
		const row = active.get(identity.seq);
		if (identity.event_type === "reset" && row && (!latestIndexedReset || identity.seq > latestIndexedReset.seq)) latestIndexedReset = {
			active_position: row.active_position,
			event_type: "reset",
			seq: identity.seq
		};
	}
	return {
		cold: Boolean(coldArchive),
		generation: actor.hot.transcript.version.generation ?? void 0,
		updatedAt: actor.hot.transcript.version.updatedAt,
		hasUnclassified: projection?.hasUnclassifiedEvents ?? false,
		latestIndexedReset,
		hasUnindexedPrefix,
		latestSeq: navigation.at(-1)?.seq ?? null,
		state: projection && {
			activeEventCount: projection.activeEventCount,
			activeMessageCount: projection.activeMessageCount,
			indexedSeq: projection.indexedSeq,
			leafEventId: projection.leafEventId,
			needsRebuild: projection.needsRebuild
		}
	};
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-projection-read.ts
const EMPTY_PROJECTION_STATE = {
	activeEventCount: 0,
	activeMessageCount: 0,
	indexedSeq: -1,
	leafEventId: null,
	needsRebuild: false
};
function getActiveTranscriptKysely(database) {
	return getNodeSqliteKysely(database.db);
}
/** Materialize only physical events already selected in the caller's admitted snapshot. */
function readSnapshotEventRows(projection, eventSeqs) {
	const sessionId = projection.resolved.sessionId;
	const query = getActiveTranscriptKysely(projection.database).selectFrom("transcript_events as event").select([
		"event.seq",
		"event.event_json",
		"event.event_zstd",
		"event.event_utf8_bytes"
	]).where("event.session_id", "=", sessionId);
	return executeSqliteQuerySync(projection.database.db, query.where("event.seq", "in", sql`(SELECT value FROM json_each(${JSON.stringify(eventSeqs)}))`)).rows;
}
function parseActiveTranscriptMessageRow(row) {
	if (row.message_position === null) throw new Error("Active transcript message row is missing its message position");
	return {
		event: JSON.parse(readTranscriptPayload(row)),
		eventSeq: row.event_seq,
		seq: row.message_position + 1
	};
}
function selectMessageRows(database, sessionId, selection) {
	const query = getActiveTranscriptKysely(database).selectFrom("session_transcript_active_events as active").innerJoin("transcript_events as event", (join) => join.onRef("event.session_id", "=", "active.session_id").onRef("event.seq", "=", "active.event_seq")).where("active.session_id", "=", sessionId).where("active.message_position", "is not", null).orderBy("active.message_position", "asc");
	return "positions" in selection ? query.where("active.message_position", "in", selection.positions.length <= 500 ? selection.positions : getActiveTranscriptKysely(database).selectFrom((eb) => eb.fn("json_each", [eb.val(JSON.stringify(selection.positions))]).as("requested")).select("requested.value")) : query.where("active.message_position", ">=", selection.start).where("active.message_position", "<", selection.endExclusive);
}
function selectMessagePayload(query) {
	return query.select([
		"active.event_seq",
		"active.message_position",
		"event.event_json",
		"event.event_zstd",
		"event.event_utf8_bytes"
	]);
}
function selectMessageMetadata(query) {
	return query.select([
		"active.event_seq",
		"active.message_position",
		sql`${transcriptEventReadBytesSql("event")} + 1`.as("serialized_bytes")
	]).$narrowType();
}
const messageRangeReaders = createSqliteQueryCache((db) => {
	const database = { db };
	const metadata = (direction) => prepareSqliteQueryIterator(database.db, (parameter) => selectMessageMetadata(selectMessageRows(database, parameter((params) => params.sessionId), {
		start: parameter((params) => params.start),
		endExclusive: parameter((params) => params.endExclusive)
	}).clearOrderBy().orderBy("active.message_position", direction)));
	return {
		latest: prepareSqliteQueryTakeFirstSync(database.db, (parameter) => selectMessagePayload(selectMessageRows(database, parameter((params) => params.sessionId), {
			start: parameter((params) => params.start),
			endExclusive: parameter((params) => params.endExclusive)
		})).clearOrderBy().orderBy("active.message_position", "desc").limit(1)),
		messages: prepareSqliteQueryIterator(database.db, (parameter) => selectMessagePayload(selectMessageRows(database, parameter((params) => params.sessionId), {
			start: parameter((params) => params.start),
			endExclusive: parameter((params) => params.endExclusive)
		}))),
		metadata: metadata("asc"),
		metadataDescending: metadata("desc")
	};
});
function getMessageRangeReaders(database) {
	return messageRangeReaders(database.db);
}
function buildProjectionSnapshotQuery(database, sessionId) {
	const db = getActiveTranscriptKysely(database);
	const target = db.selectNoFrom(sessionId.as("session_id")).as("target");
	return db.selectFrom(target).leftJoin("session_transcript_index_state as state", "state.session_id", "target.session_id").leftJoin("session_windows as window", "window.session_id", "target.session_id").leftJoin("transcript_rewrite_watermarks as watermark", "watermark.session_id", "target.session_id").leftJoin("session_transcript_active_events as latest_reset", (join) => join.onRef("latest_reset.session_id", "=", "target.session_id").on("latest_reset.event_seq", "=", (eb) => eb.selectFrom("transcript_event_identities as reset_identity").innerJoin("session_transcript_active_events as reset_active", (resetJoin) => resetJoin.onRef("reset_active.session_id", "=", "reset_identity.session_id").onRef("reset_active.event_seq", "=", "reset_identity.seq")).select("reset_identity.seq").whereRef("reset_identity.session_id", "=", "target.session_id").where("reset_identity.event_type", "=", "reset").orderBy("reset_identity.seq", "desc").limit(1))).select([
		"watermark.generation",
		"window.transcript_updated_at",
		"state.active_event_count",
		"state.active_message_count",
		"state.indexed_seq",
		"state.leaf_event_id",
		"state.needs_rebuild",
		"latest_reset.active_position as reset_active_position",
		"latest_reset.event_seq as reset_seq"
	]).select((eb) => [
		eb.selectFrom("transcript_events").select(({ fn }) => fn.max("seq").as("latest_seq")).whereRef("transcript_events.session_id", "=", "target.session_id").as("latest_seq"),
		eb.exists(eb.selectFrom("session_transcript_cold_archives").select("session_id").whereRef("session_transcript_cold_archives.session_id", "=", "target.session_id")).as("is_cold"),
		eb.exists(eb.selectFrom("session_transcript_active_events").select("session_id").whereRef("session_transcript_active_events.session_id", "=", "target.session_id").where("context_eligible", "is", null)).as("has_unclassified"),
		eb.not(eb.exists(eb.selectFrom("transcript_event_identities as identity").select("identity.seq").whereRef("identity.session_id", "=", "target.session_id").where("identity.seq", "=", eb.selectFrom("transcript_events as first_event").select("first_event.seq").whereRef("first_event.session_id", "=", "target.session_id").orderBy("first_event.seq", "asc").limit(1)))).as("has_unindexed_prefix")
	]);
}
const projectionSnapshotReader = createSqliteQueryCache((db) => prepareSqliteQuerySync(db, (parameter) => buildProjectionSnapshotQuery({ db }, parameter((id) => id))));
function readProjectionSnapshot(database, sessionId) {
	const actor = readSessionActorTransactionState(database, { sessionId });
	if (actor?.transcript.complete) return {
		...projectSessionTranscriptFacts(actor),
		contextMetadata: projectSessionActorContextMetadata(actor),
		contextStats: actor.transcript.contextStats
	};
	const retained = readSessionTranscriptProjectionReceipt(database, sessionId);
	if (retained?.facts && !retained.contextOnly) return {
		...retained.facts,
		contextStats: retained.contextStats
	};
	const row = projectionSnapshotReader(database.db)(sessionId).rows[0];
	const accounting = readSessionTranscriptProjectionReceipt(database, sessionId, {
		generation: row.generation ?? null,
		rawSeq: row.latest_seq,
		updatedAt: row.transcript_updated_at ?? null
	});
	return {
		cold: Boolean(row.is_cold),
		contextMetadata: retained?.facts?.contextMetadata,
		contextStats: actor?.transcript.contextStats ?? accounting?.contextStats,
		generation: row.generation ?? void 0,
		updatedAt: row.transcript_updated_at ?? null,
		hasUnclassified: Boolean(row.has_unclassified),
		latestIndexedReset: typeof row.reset_seq === "number" && typeof row.reset_active_position === "number" ? {
			active_position: row.reset_active_position,
			event_type: "reset",
			seq: row.reset_seq
		} : null,
		hasUnindexedPrefix: Boolean(row.has_unindexed_prefix),
		latestSeq: row.latest_seq,
		...typeof row.indexed_seq === "number" ? { state: {
			activeEventCount: row.active_event_count ?? 0,
			activeMessageCount: row.active_message_count ?? 0,
			indexedSeq: row.indexed_seq,
			leafEventId: row.leaf_event_id,
			needsRebuild: row.needs_rebuild !== 0
		} } : {}
	};
}
/** Read one admitted connection without acquiring a writer or scheduling reconciliation. */
function readCurrentProjectionSnapshot(database, resolved, read, prepared) {
	const diagnostics = { sessionId: resolved.sessionId };
	const readerOperation = captureSqliteReaderOwner()?.operation;
	if (readerOperation) diagnostics.readerOperation = readerOperation;
	const readSnapshot = () => {
		const snapshot = prepared ?? readProjectionSnapshot(database, resolved.sessionId);
		if (snapshot.state) {
			diagnostics.activeEvents = snapshot.state.activeEventCount;
			diagnostics.activeMessages = snapshot.state.activeMessageCount;
			diagnostics.indexedSeq = snapshot.state.indexedSeq;
		}
		if (snapshot.cold) throw new SessionTranscriptColdError(resolved.sessionId);
		const version = {
			generation: snapshot.generation ?? null,
			rawSeq: snapshot.latestSeq,
			updatedAt: snapshot.updatedAt
		};
		retainTranscriptContextFacts(database, resolved.sessionId, version, getSqliteReadScopeRevision(database.db), false);
		const empty = snapshot.latestSeq === null;
		const state = empty ? EMPTY_PROJECTION_STATE : snapshot.state;
		if (!state || state.needsRebuild || !empty && (state.indexedSeq !== snapshot.latestSeq || snapshot.hasUnclassified)) return { kind: "unavailable" };
		return {
			kind: "value",
			value: read({
				database,
				generation: snapshot.generation,
				version,
				hasUnindexedPrefix: !empty && snapshot.hasUnindexedPrefix,
				latestIndexedReset: empty ? null : snapshot.latestIndexedReset,
				resolved,
				state,
				contextMetadata: snapshot.contextMetadata,
				contextStats: snapshot.contextStats
			})
		};
	};
	return database.db.isTransaction ? readSnapshot() : runSqliteDeferredTransactionSync(database.db, readSnapshot, {
		databaseLabel: database.path,
		operationLabel: "sessions.history.read",
		diagnosticContext: diagnostics
	});
}
//#endregion
export { readSnapshotEventRows as a, selectMessageRows as c, readCurrentProjectionSnapshot as i, projectSessionTranscriptFacts as l, getMessageRangeReaders as n, selectMessageMetadata as o, parseActiveTranscriptMessageRow as r, selectMessagePayload as s, getActiveTranscriptKysely as t };
