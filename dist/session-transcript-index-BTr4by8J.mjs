import { G as sqliteSessionIdWriteScope, U as withSqliteDatabaseWriteScope, W as withoutSqliteDatabaseWriteScope } from "./sqlite-database-admission-CqdNF9iE.mjs";
import { a as executeSqliteQueryTakeFirstSync, i as executeSqliteQuerySync, l as prepareSqliteQuerySync, o as getNodeSqliteKysely } from "./kysely-sync-9fPQaMlh.mjs";
import { r as prepareSessionTranscriptProjectionAppend } from "./session-transcript-projection-append-DGPoJ8qL.mjs";
import { o as writableSessionActorMap, r as readSessionActorTransactionState } from "./session-actor-transaction-BIR0_goz.mjs";
import { n as deleteSessionTranscriptFtsRowsInTransaction, t as createSessionTranscriptFtsInserter } from "./session-transcript-fts-BGvn_VQW.mjs";
import { n as transcriptEventReadBytesSql } from "./session-transcript-read-bytes-D9BDv7Ny.mjs";
import { a as hasUnclassifiedSessionTranscriptEvents, s as visitSessionTranscriptProjection } from "./session-transcript-projection-rebuild-b6i9E7jy.mjs";
//#region src/config/sessions/session-transcript-index.ts
const SYNC_REBUILD_MAX_ROWS = 4e3;
const SYNC_REBUILD_MAX_BYTES = 4194304;
function getIndexKysely(db) {
	return getNodeSqliteKysely(db);
}
/** Size the old projection and incoming rows before their owning transaction mutates either. */
function shouldRebuildSessionTranscriptIndexSynchronously(db, sessionId, events = []) {
	if (events.length > 4e3) return false;
	const kysely = getIndexKysely(db);
	const stored = executeSqliteQueryTakeFirstSync(db, kysely.selectFrom(kysely.selectFrom("transcript_events").select(transcriptEventReadBytesSql().as("event_bytes")).where("session_id", "=", sessionId).limit(SYNC_REBUILD_MAX_ROWS - events.length + 1).as("stored")).select((eb) => [eb.fn.countAll().as("event_count"), eb.fn.sum("stored.event_bytes").as("event_bytes")]));
	if ((stored?.event_count ?? 0) + events.length > 4e3) return false;
	let bytes = stored?.event_bytes ?? 0;
	if (bytes > 4194304) return false;
	for (const event of events) {
		bytes += Buffer.byteLength(JSON.stringify(event), "utf8");
		if (bytes > 4194304) return false;
	}
	return true;
}
function selectSessionTranscriptProjectionState(db, sessionId) {
	return getIndexKysely(db).selectFrom("session_transcript_index_state").select([
		"active_event_count",
		"active_message_count",
		"indexed_seq",
		"leaf_event_id",
		"needs_rebuild"
	]).select((eb) => eb.exists(eb.selectFrom("session_transcript_active_events").select("session_id").where("session_id", "=", sessionId).where("context_eligible", "is", null).limit(1)).as("has_unclassified")).where("session_id", "=", sessionId);
}
function readSessionTranscriptProjectionState(db, sessionId) {
	const actor = readSessionActorTransactionState({ db }, { sessionId });
	if (actor) return actor.transcript.projection && { ...actor.transcript.projection };
	const row = executeSqliteQueryTakeFirstSync(db, selectSessionTranscriptProjectionState(db, sessionId));
	if (!row) return;
	return {
		activeEventCount: row.active_event_count,
		activeMessageCount: row.active_message_count,
		indexedSeq: row.indexed_seq,
		leafEventId: row.leaf_event_id,
		needsRebuild: row.needs_rebuild !== 0,
		hasUnclassifiedEvents: Boolean(row.has_unclassified)
	};
}
/** The projection owner supplies the same readiness predicate to compound readers. */
function selectSessionTranscriptIndexStatus(db, sessionId) {
	const kysely = getIndexKysely(db);
	return kysely.selectFrom(kysely.selectFrom("transcript_events").select("seq").where("session_id", "=", sessionId).orderBy("seq", "desc").limit(1).as("latest")).leftJoin(selectSessionTranscriptProjectionState(db, sessionId).as("state"), (join) => join.onTrue()).select("latest.seq as latestSeq").select((eb) => eb.or([
		eb("state.needs_rebuild", "is not", 0),
		eb("state.indexed_seq", "is not", eb.ref("latest.seq")),
		eb("state.has_unclassified", "=", 1)
	]).as("needs_reconcile"));
}
function readSessionTranscriptIndexStatus(db, sessionId) {
	const row = executeSqliteQueryTakeFirstSync(db, selectSessionTranscriptIndexStatus(db, sessionId));
	return row ? { needsReconcile: Boolean(row.needs_reconcile) } : void 0;
}
function sessionTranscriptIndexNeedsReconcile(db, sessionId) {
	return readSessionTranscriptIndexStatus(db, sessionId)?.needsReconcile ?? false;
}
function createWatermarkWriter(db, sessionId, updateExisting = false) {
	const write = prepareSqliteQuerySync(db, (parameter) => {
		const kysely = getIndexKysely(db);
		const values = {
			active_event_count: parameter((row) => row.activeEventCount),
			active_message_count: parameter((row) => row.activeMessageCount),
			indexed_seq: parameter((row) => row.indexedSeq),
			leaf_event_id: parameter((row) => row.leafEventId),
			needs_rebuild: parameter((row) => row.needsRebuild ? 1 : 0),
			updated_at: parameter((row) => row.updatedAt)
		};
		return updateExisting ? kysely.updateTable("session_transcript_index_state").set(values).where("session_id", "=", sessionId) : kysely.insertInto("session_transcript_index_state").values({
			session_id: sessionId,
			...values
		}).onConflict((conflict) => conflict.column("session_id").doUpdateSet(values));
	});
	return (row) => withSqliteDatabaseWriteScope(db, [sqliteSessionIdWriteScope(sessionId)], () => write(row));
}
function createActiveEventInserter(db, sessionId) {
	const write = prepareSqliteQuerySync(db, (parameter) => getIndexKysely(db).insertInto("session_transcript_active_events").values({
		session_id: sessionId,
		active_position: parameter((row) => row.activePosition),
		context_eligible: parameter((row) => row.contextEligible),
		event_seq: parameter((row) => row.eventSeq),
		message_position: parameter((row) => row.messagePosition)
	}));
	return (row) => withSqliteDatabaseWriteScope(db, [sqliteSessionIdWriteScope(sessionId)], () => write(row));
}
function deleteActiveEventRows(db, sessionId) {
	withSqliteDatabaseWriteScope(db, [sqliteSessionIdWriteScope(sessionId)], () => executeSqliteQuerySync(db, getIndexKysely(db).deleteFrom("session_transcript_active_events").where("session_id", "=", sessionId)));
}
/**
* In-transaction batch appender. Forward-indexes the event when it
* unambiguously extends the active branch and marks the session for rebuild
* otherwise. Runs inside the same write transaction as the event insert, so
* the index can never lag or tear relative to committed transcript rows.
* Retain only within a synchronous batch whose source cannot mutate this session.
*/
function createTranscriptIndexAppenderInTransaction(db, sessionId) {
	const actor = readSessionActorTransactionState({ db }, { sessionId });
	const initial = readSessionTranscriptProjectionState(db, sessionId);
	let watermark = initial;
	let hasUnclassifiedEvents = initial?.hasUnclassifiedEvents;
	let insertActiveEvent;
	let insertFts;
	let updateWatermark;
	return (params) => {
		if (!watermark && params.seq !== 0 || watermark?.needsRebuild) return true;
		if (watermark && (hasUnclassifiedEvents ??= hasUnclassifiedSessionTranscriptEvents(db, sessionId))) {
			watermark = markSessionTranscriptIndexDirtyInTransaction(db, sessionId);
			return true;
		}
		const append = prepareSessionTranscriptProjectionAppend({
			...params,
			cursor: watermark ?? {
				activeEventCount: 0,
				activeMessageCount: 0,
				indexedSeq: -1,
				leafEventId: null
			}
		});
		if (!append) {
			if (watermark) watermark = markSessionTranscriptIndexDirtyInTransaction(db, sessionId);
			return true;
		}
		if (append.ftsRow) {
			insertFts ??= createSessionTranscriptFtsInserter(db, sessionId);
			insertFts(append.ftsRow);
		}
		if (append.activeRow) {
			insertActiveEvent ??= createActiveEventInserter(db, sessionId);
			insertActiveEvent(append.activeRow);
			if (actor) actor.transcript.active = writableSessionActorMap(actor.transcript.active);
			actor?.transcript.active.set(params.seq, {
				session_id: sessionId,
				active_position: append.activeRow.activePosition,
				context_eligible: append.activeRow.contextEligible,
				event_seq: append.activeRow.eventSeq,
				message_position: append.activeRow.messagePosition
			});
		}
		const nextWatermark = {
			...append.cursor,
			needsRebuild: false,
			updatedAt: params.createdAt
		};
		(watermark ? updateWatermark ??= createWatermarkWriter(db, sessionId, true) : createWatermarkWriter(db, sessionId))(nextWatermark);
		watermark = nextWatermark;
		if (actor) actor.transcript.projection = {
			...nextWatermark,
			hasUnclassifiedEvents: false
		};
		return false;
	};
}
/** Marks one session for lazy rebuild without touching its FTS rows. */
function markSessionTranscriptIndexDirtyInTransaction(db, sessionId) {
	const now = Date.now();
	const watermark = readSessionTranscriptProjectionState(db, sessionId);
	const dirty = {
		activeEventCount: watermark?.activeEventCount ?? 0,
		activeMessageCount: watermark?.activeMessageCount ?? 0,
		indexedSeq: watermark?.indexedSeq ?? -1,
		leafEventId: watermark?.leafEventId ?? null,
		needsRebuild: true
	};
	createWatermarkWriter(db, sessionId)({
		...dirty,
		updatedAt: now
	});
	const actor = readSessionActorTransactionState({ db }, { sessionId });
	if (actor) {
		actor.transcript.contextStats = void 0;
		actor.transcript.projection = {
			...dirty,
			hasUnclassifiedEvents: actor.transcript.projection?.hasUnclassifiedEvents ?? false
		};
	}
	return dirty;
}
/** In-transaction delete hook: drops index rows alongside transcript rows. */
function deleteSessionTranscriptIndexInTransaction(db, sessionId) {
	deleteSessionTranscriptFtsRowsInTransaction(db, sessionId);
	deleteActiveEventRows(db, sessionId);
	withSqliteDatabaseWriteScope(db, [sqliteSessionIdWriteScope(sessionId)], () => executeSqliteQuerySync(db, getIndexKysely(db).deleteFrom("session_transcript_index_state").where("session_id", "=", sessionId)));
}
/** Replaces only the derived rows affected by an exact raw transcript suffix mutation. */
function replaceSessionTranscriptIndexSuffixInTransaction(db, sessionId, params) {
	const kysely = getIndexKysely(db);
	const incremental = params.retainedActiveCount !== void 0;
	let retainedCount;
	if (incremental) retainedCount = params.retainedActiveCount;
	else {
		const previous = params.previous;
		if (!previous) throw new Error(`Missing previous transcript projection: ${sessionId}`);
		const sameRow = (current, expected) => current?.activePosition === expected?.activePosition && current?.contextEligible === expected?.contextEligible && current?.eventSeq === expected?.eventSeq && current?.messagePosition === expected?.messagePosition;
		const previousPrefix = previous.activeRows.filter((row) => row.eventSeq < params.unchangedBeforeSeq);
		const prefixCount = params.next.activeRows.findIndex((row) => row.eventSeq >= params.unchangedBeforeSeq);
		retainedCount = prefixCount < 0 ? params.next.activeRows.length : prefixCount;
		if (retainedCount !== previousPrefix.length || params.next.activeRows.slice(0, retainedCount).some((row, index) => !sameRow(previousPrefix[index], row))) throw new Error(`Transcript projection prefix changed before suffix replacement: ${sessionId}`);
	}
	const removedMessageIds = incremental ? params.removedMessageIds ?? [] : [...new Set(params.previous.activeRows.slice(retainedCount).flatMap((row) => row.ftsEntry ? [row.ftsEntry.messageId] : []))];
	if (removedMessageIds.length > 0) deleteSessionTranscriptFtsRowsInTransaction(db, sessionId, { messageIds: removedMessageIds });
	withSqliteDatabaseWriteScope(db, [sqliteSessionIdWriteScope(sessionId)], () => executeSqliteQuerySync(db, kysely.deleteFrom("session_transcript_active_events").where("session_id", "=", sessionId).where("active_position", ">=", retainedCount)));
	const insertActive = createActiveEventInserter(db, sessionId);
	const insertFts = createSessionTranscriptFtsInserter(db, sessionId);
	const rowsToInsert = incremental ? params.next.activeRows : params.next.activeRows.slice(retainedCount);
	for (const row of rowsToInsert) {
		insertActive(row);
		if (row.ftsEntry) insertFts(row.ftsEntry);
	}
	createWatermarkWriter(db, sessionId)({
		activeEventCount: params.next.activeRows.length + (incremental ? retainedCount : 0),
		activeMessageCount: params.next.activeMessageCount,
		indexedSeq: params.next.indexedSeq,
		leafEventId: params.next.leafEventId,
		needsRebuild: false,
		updatedAt: Date.now()
	});
}
/**
* Rebuilds one session's index from its full event set: drops existing FTS
* rows, indexes the resolved active branch, and resets the watermark to the
* same append parent the accessor's next append will resolve.
*/
function rebuildSessionTranscriptIndexInTransaction(db, sessionId) {
	deleteSessionTranscriptFtsRowsInTransaction(db, sessionId);
	deleteActiveEventRows(db, sessionId);
	const projection = visitSessionTranscriptProjection(db, sessionId, {
		activeRow: createActiveEventInserter(db, sessionId),
		ftsRow: createSessionTranscriptFtsInserter(db, sessionId)
	});
	if (!projection) return;
	createWatermarkWriter(db, sessionId)({
		activeEventCount: projection.activeEventCount,
		activeMessageCount: projection.activeMessageCount,
		indexedSeq: projection.sourceIndexedSeq,
		leafEventId: projection.leafEventId,
		needsRebuild: false,
		updatedAt: Date.now()
	});
}
/** Rebuilds one lagging projection under its current write transaction. */
function reconcileSessionTranscriptIndexInTransaction(db, sessionId) {
	const indexStatus = readSessionTranscriptIndexStatus(db, sessionId);
	if (!indexStatus) {
		deleteSessionTranscriptIndexInTransaction(db, sessionId);
		return false;
	}
	if (!indexStatus.needsReconcile) return false;
	rebuildSessionTranscriptIndexInTransaction(db, sessionId);
	return true;
}
function selectSessionsNeedingTranscriptIndexReconcile(db) {
	return getIndexKysely(db).selectFrom("session_windows").innerJoin("transcript_events as latest", (join) => join.onRef("latest.session_id", "=", "session_windows.session_id").on((eb) => eb("latest.seq", "=", eb.selectFrom("transcript_events as candidate").select("candidate.seq").whereRef("candidate.session_id", "=", "session_windows.session_id").orderBy("candidate.seq", "desc").limit(1)))).leftJoin("session_transcript_index_state as st", "st.session_id", "session_windows.session_id").select("session_windows.session_id").where((eb) => eb.or([
		eb(eb.fn.coalesce("st.needs_rebuild", eb.val(1)), "!=", 0),
		eb("latest.seq", ">", eb.fn.coalesce("st.indexed_seq", eb.val(-1))),
		eb.and([eb.exists(eb.selectFrom("session_transcript_active_events as any_pending").select("any_pending.session_id").where("any_pending.context_eligible", "is", null).limit(1)), eb.exists(eb.selectFrom("session_transcript_active_events as pending").select("pending.session_id").whereRef("pending.session_id", "=", "session_windows.session_id").where("pending.context_eligible", "is", null))])
	])).orderBy("session_windows.session_id");
}
/**
* Sessions whose index needs reconcile work: flagged rebuilds, transcripts
* that gained rows without index state (doctor imports), and watermarks
* behind the newest row. Ordered for deterministic reconcile passes.
*/
function listSessionsNeedingTranscriptIndexReconcile(db) {
	return executeSqliteQuerySync(db, selectSessionsNeedingTranscriptIndexReconcile(db)).rows.flatMap((row) => typeof row.session_id === "string" ? [row.session_id] : []);
}
const transcriptIndexTables = [
	"session_transcript_active_events",
	"session_transcript_fts_rows",
	"session_transcript_index_state"
];
function selectOrphanedTranscriptOwners(db, table) {
	const kysely = getIndexKysely(db);
	return kysely.selectFrom(table).select("session_id").distinct().except(kysely.selectFrom("transcript_events").select("session_id").distinct()).orderBy("session_id");
}
function deleteOrphanedTranscriptIndexRowsInTransaction(db) {
	const kysely = getIndexKysely(db);
	for (const table of transcriptIndexTables) withoutSqliteDatabaseWriteScope(db, () => executeSqliteQuerySync(db, kysely.deleteFrom(table).where("session_id", "in", selectOrphanedTranscriptOwners(db, table))));
}
//#endregion
export { deleteSessionTranscriptIndexInTransaction as a, reconcileSessionTranscriptIndexInTransaction as c, sessionTranscriptIndexNeedsReconcile as d, shouldRebuildSessionTranscriptIndexSynchronously as f, deleteOrphanedTranscriptIndexRowsInTransaction as i, replaceSessionTranscriptIndexSuffixInTransaction as l, SYNC_REBUILD_MAX_ROWS as n, listSessionsNeedingTranscriptIndexReconcile as o, createTranscriptIndexAppenderInTransaction as r, markSessionTranscriptIndexDirtyInTransaction as s, SYNC_REBUILD_MAX_BYTES as t, selectSessionTranscriptIndexStatus as u };
