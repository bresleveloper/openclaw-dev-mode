import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { a as executeSqliteQueryTakeFirstSync, i as executeSqliteQuerySync, l as prepareSqliteQuerySync, o as getNodeSqliteKysely, s as iterateSqliteQuerySync } from "./kysely-sync-9fPQaMlh.mjs";
import { r as runSqliteDeferredTransactionSync } from "./sqlite-transaction-CpDyZPQ0.mjs";
import { c as transcriptEventJsonSql, d as transcriptEventNavigationSql } from "./transcript-payload-Cu49oQKq.mjs";
import { l as scanSessionTranscriptTree, p as selectSessionTranscriptTreePathNodes, t as isCanonicalSessionTranscriptEntry } from "./transcript-tree-D61jhi_i.mjs";
import { a as transcriptEventContextEligibility, i as shouldProjectActiveEvent, n as hasTranscriptMessage, r as prepareSessionTranscriptProjectionAppend, t as extractTranscriptIndexEntry } from "./session-transcript-projection-append-DGPoJ8qL.mjs";
import { t as projectTranscriptNavigationFields } from "./transcript-navigation-fields-BLtx25WG.mjs";
import { n as deleteSessionTranscriptFtsRowsInTransaction, t as createSessionTranscriptFtsInserter } from "./session-transcript-fts-BGvn_VQW.mjs";
import { n as transcriptEventReadBytesSql } from "./session-transcript-read-bytes-D9BDv7Ny.mjs";
//#region src/config/sessions/session-transcript-projection-rebuild.ts
const PROJECTION_FINALIZE_TAIL_ROWS = 512;
const PROJECTION_FINALIZE_TAIL_BYTES = 262144;
function getProjectionKysely(db) {
	return getNodeSqliteKysely(db);
}
/** Older same-version writers can leave a current watermark over unclassified rows. */
function hasUnclassifiedSessionTranscriptEvents(db, sessionId) {
	return executeSqliteQueryTakeFirstSync(db, getProjectionKysely(db).selectFrom("session_transcript_active_events").select("session_id").where("session_id", "=", sessionId).where("context_eligible", "is", null).limit(1)) !== void 0;
}
function readCanonicalEventId(event) {
	if (!isCanonicalSessionTranscriptEntry(event) || typeof event.id !== "string") return null;
	return event.id.trim() || null;
}
/** Streams projection payloads; only navigation metadata is retained for branch resolution. */
function visitSessionTranscriptProjection(db, sessionId, visitor) {
	const source = readProjectionSource(db, sessionId);
	return source ? visitProjectionSource(source, visitor) : void 0;
}
function readProjectionSession(db, sessionId) {
	return executeSqliteQueryTakeFirstSync(db, getProjectionKysely(db).selectFrom("session_windows as session").leftJoin("transcript_rewrite_watermarks as rewrite", "rewrite.session_id", "session.session_id").select(["session.transcript_updated_at", "rewrite.generation"]).where("session.session_id", "=", sessionId));
}
function readProjectionSource(db, sessionId) {
	const kysely = getProjectionKysely(db);
	const session = readProjectionSession(db, sessionId);
	if (!session) return;
	const query = kysely.selectFrom("transcript_events").select([
		transcriptEventJsonSql(db).as("event_json"),
		"seq",
		"created_at"
	]).where("session_id", "=", sessionId);
	const read = prepareSqliteQuerySync(db, (parameter) => query.where("seq", "=", parameter((seq) => seq)));
	return {
		sessionId,
		transcriptGeneration: session.generation,
		transcriptUpdatedAt: session.transcript_updated_at,
		rows: (navigationOnly) => iterateSqliteQuerySync(db, (navigationOnly ? query.clearSelect().select([
			transcriptEventNavigationSql(db).as("event_json"),
			"seq",
			"created_at"
		]) : query).orderBy("seq", "asc")),
		row: (seq) => read(seq).rows[0]
	};
}
function visitProjectionSource(source, visitor) {
	let sourceIndexedSeq = -1;
	const tree = scanSessionTranscriptTree((function* () {
		for (const row of source.rows(true)) {
			sourceIndexedSeq = row.seq;
			const event = JSON.parse(row.event_json);
			yield {
				seq: row.seq,
				...isRecord(event) ? projectTranscriptNavigationFields(event) : {}
			};
		}
	})());
	if (sourceIndexedSeq < 0) return;
	const visiblePath = selectSessionTranscriptTreePathNodes(tree, tree.leafId);
	const rows = visiblePath.length > 0 ? (function* () {
		for (const node of visiblePath) {
			const row = source.row(node.entry.seq);
			if (row) yield row;
		}
	})() : tree.hasLeafControl ? [] : source.rows();
	let activeEventCount = 0;
	let activeMessageCount = 0;
	for (const row of rows) {
		const event = JSON.parse(row.event_json);
		const indexed = extractTranscriptIndexEntry(event, row.created_at);
		if (indexed) visitor.ftsRow(indexed, row.seq);
		if (!shouldProjectActiveEvent(event)) continue;
		const projectsMessage = hasTranscriptMessage(event);
		visitor.activeRow({
			activePosition: activeEventCount++,
			contextEligible: transcriptEventContextEligibility(event),
			eventSeq: row.seq,
			messagePosition: projectsMessage ? activeMessageCount++ : null
		});
	}
	return {
		activeEventCount,
		activeMessageCount,
		leafEventId: tree.appendParentId,
		sessionId: source.sessionId,
		sourceHasInvalidLeafControl: tree.hasInvalidLeafControl,
		sourceIndexedSeq,
		sourceTranscriptGeneration: source.transcriptGeneration,
		sourceTranscriptUpdatedAt: source.transcriptUpdatedAt
	};
}
function prepareProjectionSource(source) {
	const activeRows = [];
	const ftsEventSeqs = [];
	const metadata = visitProjectionSource(source, {
		activeRow: (row) => activeRows.push(row),
		ftsRow: (_row, seq) => ftsEventSeqs.push(seq)
	});
	if (!metadata) return;
	return {
		...metadata,
		activeRows,
		ftsRows: (function* () {
			for (const seq of ftsEventSeqs) {
				const row = source.row(seq);
				if (row) {
					const indexed = extractTranscriptIndexEntry(JSON.parse(row.event_json), row.created_at);
					if (indexed) yield indexed;
				}
			}
		})()
	};
}
/** Reads and resolves one projection on a worker-owned SQLite snapshot. */
function prepareSessionTranscriptProjection(db, sessionId) {
	return runSqliteDeferredTransactionSync(db, () => {
		const source = readProjectionSource(db, sessionId);
		return source ? prepareProjectionSource(source) : void 0;
	}, {
		databaseLabel: "agent transcript projection",
		operationLabel: "sessions.transcript-index.prepare"
	});
}
function readProjectionSourceSnapshot(db, sessionId) {
	const kysely = getProjectionKysely(db);
	const session = readProjectionSession(db, sessionId);
	const latest = executeSqliteQueryTakeFirstSync(db, kysely.selectFrom("transcript_events").select("seq").where("session_id", "=", sessionId).orderBy("seq", "desc").limit(1));
	return {
		generation: session?.generation ?? null,
		latestSeq: latest?.seq,
		transcriptUpdatedAt: session?.transcript_updated_at ?? null
	};
}
function sourceSnapshotMatches(snapshot, plan) {
	return snapshot.generation === plan.sourceTranscriptGeneration && snapshot.latestSeq === plan.sourceIndexedSeq && snapshot.transcriptUpdatedAt === plan.sourceTranscriptUpdatedAt;
}
function projectionTailFitsCatchUpBounds(db, plan, snapshot) {
	if (plan.sourceTranscriptGeneration === null || snapshot.generation !== plan.sourceTranscriptGeneration || snapshot.latestSeq === void 0 || snapshot.latestSeq < plan.sourceIndexedSeq) return false;
	const tailRowCount = snapshot.latestSeq - plan.sourceIndexedSeq;
	if (tailRowCount > PROJECTION_FINALIZE_TAIL_ROWS) return false;
	const sizeRows = executeSqliteQuerySync(db, getProjectionKysely(db).selectFrom("transcript_events").select(["seq", transcriptEventReadBytesSql().as("event_bytes")]).where("session_id", "=", plan.sessionId).where("seq", ">", plan.sourceIndexedSeq).orderBy("seq", "asc").limit(513)).rows;
	return sizeRows.length === tailRowCount && (sizeRows.at(-1)?.seq ?? plan.sourceIndexedSeq) === snapshot.latestSeq && sizeRows.reduce((total, row) => total + row.event_bytes, 0) <= PROJECTION_FINALIZE_TAIL_BYTES;
}
/** Claims projection work; finalization validates its source before publishing. */
function claimPreparedSessionTranscriptProjectionInTransaction(db, plan, claimId) {
	const kysely = getProjectionKysely(db);
	const claim = {
		active_event_count: 0,
		active_message_count: 0,
		indexed_seq: -1,
		leaf_event_id: null,
		needs_rebuild: 1,
		updated_at: claimId
	};
	const result = executeSqliteQuerySync(db, kysely.insertInto("session_transcript_index_state").columns([
		"session_id",
		"active_event_count",
		"active_message_count",
		"indexed_seq",
		"leaf_event_id",
		"needs_rebuild",
		"updated_at"
	]).expression(kysely.selectFrom("session_windows").select((eb) => [
		"session_id",
		eb.val(claim.active_event_count).as("active_event_count"),
		eb.val(claim.active_message_count).as("active_message_count"),
		eb.val(claim.indexed_seq).as("indexed_seq"),
		eb.val(claim.leaf_event_id).as("leaf_event_id"),
		eb.val(claim.needs_rebuild).as("needs_rebuild"),
		eb.val(claim.updated_at).as("updated_at")
	]).where("session_id", "=", plan.sessionId)).onConflict((conflict) => conflict.column("session_id").doUpdateSet(claim)));
	return Number(result.numAffectedRows ?? 0n) > 0;
}
/** Deletes old rows in bounded rowid batches for the active rebuild. */
function deletePreparedSessionTranscriptProjectionChunkInTransaction(db, params) {
	const kysely = getProjectionKysely(db);
	const active = Number(executeSqliteQuerySync(db, kysely.deleteFrom("session_transcript_active_events").where("rowid", "in", kysely.selectFrom("session_transcript_active_events").select("rowid").where("session_id", "=", params.sessionId).limit(params.maxRowsPerTable))).numAffectedRows ?? 0n);
	const fts = deleteSessionTranscriptFtsRowsInTransaction(db, params.sessionId, { maxRows: params.maxRowsPerTable });
	return { hasMore: active === params.maxRowsPerTable || fts === params.maxRowsPerTable };
}
/** Appends one bounded projection chunk for the active rebuild. */
function appendPreparedSessionTranscriptProjectionChunkInTransaction(db, params) {
	insertPreparedSessionTranscriptProjectionRows(db, params);
}
function insertPreparedSessionTranscriptProjectionRows(db, params) {
	const kysely = getProjectionKysely(db);
	if (params.activeRows && params.activeRows.length > 0) executeSqliteQuerySync(db, kysely.insertInto("session_transcript_active_events").values(params.activeRows.map((row) => ({
		active_position: row.activePosition,
		context_eligible: row.contextEligible,
		event_seq: row.eventSeq,
		message_position: row.messagePosition,
		session_id: params.sessionId
	}))));
	if (params.ftsRows && params.ftsRows.length > 0) {
		const insertFts = createSessionTranscriptFtsInserter(db, params.sessionId);
		for (const row of params.ftsRows) insertFts(row);
	}
}
function prepareProjectionTailCatchUp(db, plan, snapshot) {
	const latestSeq = snapshot.latestSeq;
	if (plan.sourceHasInvalidLeafControl || latestSeq === void 0 || !projectionTailFitsCatchUpBounds(db, plan, snapshot)) return;
	const rows = executeSqliteQuerySync(db, getProjectionKysely(db).selectFrom("transcript_events").select([
		transcriptEventJsonSql(db).as("event_json"),
		"seq",
		"created_at"
	]).where("session_id", "=", plan.sessionId).where("seq", ">", plan.sourceIndexedSeq).where("seq", "<=", latestSeq).orderBy("seq", "asc")).rows;
	const activeRows = [];
	const ftsRows = [];
	let cursor = {
		activeEventCount: plan.activeEventCount,
		activeMessageCount: plan.activeMessageCount,
		indexedSeq: plan.sourceIndexedSeq,
		leafEventId: plan.leafEventId
	};
	for (const row of rows) {
		const event = JSON.parse(row.event_json);
		if (isCanonicalSessionTranscriptEntry(event) && event.type === "reset") return;
		const append = prepareSessionTranscriptProjectionAppend({
			createdAt: row.created_at,
			cursor,
			event,
			eventId: readCanonicalEventId(event),
			seq: row.seq
		});
		if (!append) return;
		cursor = append.cursor;
		if (append.activeRow) activeRows.push(append.activeRow);
		if (append.ftsRow) ftsRows.push(append.ftsRow);
	}
	return {
		...plan,
		activeEventCount: cursor.activeEventCount,
		activeMessageCount: cursor.activeMessageCount,
		activeRows,
		ftsRows,
		leafEventId: cursor.leafEventId,
		sourceIndexedSeq: cursor.indexedSeq,
		sourceTranscriptUpdatedAt: snapshot.transcriptUpdatedAt
	};
}
/** Publishes one current snapshot, catching up a bounded append-only tail. */
function finalizePreparedSessionTranscriptProjectionInTransaction(db, plan, claimId) {
	const snapshot = readProjectionSourceSnapshot(db, plan.sessionId);
	const exactSnapshot = sourceSnapshotMatches(snapshot, plan);
	const catchUpPlan = exactSnapshot ? void 0 : prepareProjectionTailCatchUp(db, plan, snapshot);
	if (!exactSnapshot && !catchUpPlan) return false;
	const finalPlan = catchUpPlan ?? plan;
	if (catchUpPlan) insertPreparedSessionTranscriptProjectionRows(db, {
		activeRows: catchUpPlan.activeRows,
		ftsRows: catchUpPlan.ftsRows,
		sessionId: catchUpPlan.sessionId
	});
	const result = executeSqliteQuerySync(db, getProjectionKysely(db).updateTable("session_transcript_index_state").set({
		active_event_count: finalPlan.activeEventCount,
		active_message_count: finalPlan.activeMessageCount,
		indexed_seq: finalPlan.sourceIndexedSeq,
		leaf_event_id: finalPlan.leafEventId,
		needs_rebuild: 0,
		updated_at: Date.now()
	}).where("session_id", "=", finalPlan.sessionId).where("needs_rebuild", "!=", 0).where("updated_at", "=", claimId));
	return Number(result.numAffectedRows ?? 0n) > 0;
}
//#endregion
export { hasUnclassifiedSessionTranscriptEvents as a, finalizePreparedSessionTranscriptProjectionInTransaction as i, claimPreparedSessionTranscriptProjectionInTransaction as n, prepareSessionTranscriptProjection as o, deletePreparedSessionTranscriptProjectionChunkInTransaction as r, visitSessionTranscriptProjection as s, appendPreparedSessionTranscriptProjectionChunkInTransaction as t };
