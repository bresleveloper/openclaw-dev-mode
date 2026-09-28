import { c as prepareSqliteQueryTakeFirstSync, i as getNodeSqliteKysely, o as prepareSqliteQueryIterator, s as prepareSqliteQuerySync, u as sql } from "./kysely-sync-Bn6Qrpbz.mjs";
import { i as runSqliteDeferredTransactionSync } from "./sqlite-transaction-DKSXLQhb.mjs";
import { s as transcriptEventJsonSql } from "./transcript-payload-qsg5dB6v.mjs";
import { t as transcriptEventReadBytesSql } from "./session-transcript-read-bytes-jHOoqdX_.mjs";
import { t as SessionTranscriptColdError } from "./session-cold-storage-state-BcO2Rrog.mjs";
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
function parseActiveTranscriptMessageRow(row) {
	if (row.message_position === null) throw new Error("Active transcript message row is missing its message position");
	return {
		event: JSON.parse(row.event_json),
		eventSeq: row.event_seq,
		seq: row.message_position + 1
	};
}
function selectMessageRows(database, sessionId, selection) {
	const query = getActiveTranscriptKysely(database).selectFrom("session_transcript_active_events as active").innerJoin("transcript_events as event", (join) => join.onRef("event.session_id", "=", "active.session_id").onRef("event.seq", "=", "active.event_seq")).where("active.session_id", "=", sessionId).where("active.message_position", "is not", null).orderBy("active.message_position", "asc");
	return "positions" in selection ? query.where("active.message_position", "in", selection.positions.length <= 500 ? selection.positions : getActiveTranscriptKysely(database).selectFrom((eb) => eb.fn("json_each", [eb.val(JSON.stringify(selection.positions))]).as("requested")).select("requested.value")) : query.where("active.message_position", ">=", selection.start).where("active.message_position", "<", selection.endExclusive);
}
function selectMessagePayload(database, query) {
	return query.select([
		"active.event_seq",
		"active.message_position",
		transcriptEventJsonSql(database.db, "event").as("event_json")
	]);
}
function selectMessageMetadata(query) {
	return query.select(["active.message_position", sql`${transcriptEventReadBytesSql("event")} + 1`.as("serialized_bytes")]).$narrowType();
}
function createMessageRangeReaders(database) {
	const metadata = (direction) => prepareSqliteQueryIterator(database.db, (parameter) => selectMessageMetadata(selectMessageRows(database, parameter((params) => params.sessionId), {
		start: parameter((params) => params.start),
		endExclusive: parameter((params) => params.endExclusive)
	}).clearOrderBy().orderBy("active.message_position", direction)));
	return {
		latest: prepareSqliteQueryTakeFirstSync(database.db, (parameter) => selectMessagePayload(database, selectMessageRows(database, parameter((params) => params.sessionId), {
			start: parameter((params) => params.start),
			endExclusive: parameter((params) => params.endExclusive)
		})).clearOrderBy().orderBy("active.message_position", "desc").limit(1)),
		messages: prepareSqliteQueryIterator(database.db, (parameter) => selectMessagePayload(database, selectMessageRows(database, parameter((params) => params.sessionId), {
			start: parameter((params) => params.start),
			endExclusive: parameter((params) => params.endExclusive)
		}))),
		metadata: metadata("asc"),
		metadataDescending: metadata("desc")
	};
}
const messageRangeReaders = /* @__PURE__ */ new WeakMap();
function getMessageRangeReaders(database) {
	let readers = messageRangeReaders.get(database.db);
	if (!readers) {
		readers = createMessageRangeReaders(database);
		messageRangeReaders.set(database.db, readers);
	}
	return readers;
}
function buildProjectionSnapshotQuery(database, sessionId) {
	const db = getActiveTranscriptKysely(database);
	const target = db.selectNoFrom(sessionId.as("session_id")).as("target");
	return db.selectFrom(target).leftJoin("session_transcript_index_state as state", "state.session_id", "target.session_id").leftJoin("transcript_rewrite_watermarks as watermark", "watermark.session_id", "target.session_id").select([
		"watermark.generation",
		"state.active_event_count",
		"state.active_message_count",
		"state.indexed_seq",
		"state.leaf_event_id",
		"state.needs_rebuild"
	]).select((eb) => [
		eb.selectFrom("transcript_events").select(({ fn }) => fn.max("seq").as("latest_seq")).whereRef("transcript_events.session_id", "=", "target.session_id").as("latest_seq"),
		eb.exists(eb.selectFrom("session_transcript_cold_archives").select("session_id").whereRef("session_transcript_cold_archives.session_id", "=", "target.session_id")).as("is_cold"),
		eb.exists(eb.selectFrom("session_transcript_active_events").select("session_id").whereRef("session_transcript_active_events.session_id", "=", "target.session_id").where("context_eligible", "is", null)).as("has_unclassified"),
		eb.not(eb.exists(eb.selectFrom("transcript_event_identities as identity").select("identity.seq").whereRef("identity.session_id", "=", "target.session_id").where("identity.seq", "=", eb.selectFrom("transcript_events as first_event").select("first_event.seq").whereRef("first_event.session_id", "=", "target.session_id").orderBy("first_event.seq", "asc").limit(1)))).as("has_unindexed_prefix")
	]);
}
const projectionSnapshotReaders = /* @__PURE__ */ new WeakMap();
function readProjectionSnapshot(database, sessionId) {
	let read = projectionSnapshotReaders.get(database.db);
	if (!read) {
		read = prepareSqliteQuerySync(database.db, (parameter) => buildProjectionSnapshotQuery(database, parameter((id) => id)));
		projectionSnapshotReaders.set(database.db, read);
	}
	const row = read(sessionId).rows[0];
	return {
		cold: Boolean(row.is_cold),
		generation: row.generation ?? void 0,
		hasUnclassified: Boolean(row.has_unclassified),
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
function readCurrentProjectionSnapshot(database, resolved, read) {
	return runSqliteDeferredTransactionSync(database.db, () => {
		const snapshot = readProjectionSnapshot(database, resolved.sessionId);
		if (snapshot.cold) throw new SessionTranscriptColdError(resolved.sessionId);
		if (snapshot.latestSeq === null) return {
			kind: "value",
			value: read({
				database,
				generation: snapshot.generation,
				hasUnindexedPrefix: false,
				resolved,
				state: EMPTY_PROJECTION_STATE
			})
		};
		if (snapshot.state && !snapshot.state.needsRebuild && snapshot.state.indexedSeq === snapshot.latestSeq && !snapshot.hasUnclassified) return {
			kind: "value",
			value: read({
				database,
				generation: snapshot.generation,
				hasUnindexedPrefix: snapshot.hasUnindexedPrefix,
				resolved,
				state: snapshot.state
			})
		};
		return { kind: "unavailable" };
	}, {
		databaseLabel: database.path,
		operationLabel: "sessions.history.read"
	});
}
//#endregion
export { selectMessageMetadata as a, readCurrentProjectionSnapshot as i, getMessageRangeReaders as n, selectMessagePayload as o, parseActiveTranscriptMessageRow as r, selectMessageRows as s, getActiveTranscriptKysely as t };
