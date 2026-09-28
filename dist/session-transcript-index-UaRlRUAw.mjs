import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { a as iterateSqliteQuerySync, i as getNodeSqliteKysely, n as executeSqliteQuerySync, r as executeSqliteQueryTakeFirstSync, s as prepareSqliteQuerySync } from "./kysely-sync-Bn6Qrpbz.mjs";
import { i as runSqliteDeferredTransactionSync } from "./sqlite-transaction-DKSXLQhb.mjs";
import { s as transcriptEventJsonSql, u as transcriptEventNavigationSql } from "./transcript-payload-qsg5dB6v.mjs";
import { n as deleteSessionTranscriptFtsRowsInTransaction, t as createSessionTranscriptFtsInserter } from "./session-transcript-fts-Bc63bcGQ.mjs";
import { f as selectSessionTranscriptTreePathNodes, l as scanSessionTranscriptTree, n as isSessionTranscriptLeafControl, o as parseSessionTranscriptTreeEntry, r as isSessionTranscriptSideAppendEntry, t as isCanonicalSessionTranscriptEntry } from "./transcript-tree-3xvvNd9-.mjs";
import { t as transcriptEventReadBytesSql } from "./session-transcript-read-bytes-jHOoqdX_.mjs";
//#region src/config/sessions/session-transcript-projection-append.ts
function readMessageText(message) {
	if (!isRecord(message) || message.role !== "user" && message.role !== "assistant") return;
	if (typeof message.content === "string") return message.content.trim() || void 0;
	if (typeof message.text === "string") return message.text.trim() || void 0;
	if (!Array.isArray(message.content)) return;
	const parts = message.content.flatMap((block) => {
		if (!isRecord(block) || block.type !== "text" && block.type !== "input_text" && block.type !== "output_text") return [];
		return typeof block.text === "string" && block.text.trim() ? [block.text] : [];
	});
	return parts.length > 0 ? parts.join("\n") : void 0;
}
/** Extracts the searchable user/assistant text from one transcript event. */
function extractTranscriptIndexEntry(event, fallbackTimestamp) {
	if (!isRecord(event) || event.type !== "message" || typeof event.id !== "string") return;
	const message = isRecord(event.message) ? event.message : void 0;
	const role = message?.role;
	const id = event.id.trim();
	if (!id || role !== "user" && role !== "assistant") return;
	const text = readMessageText(message);
	if (!text) return;
	const timestamp = typeof event.timestamp === "number" ? event.timestamp : typeof event.timestamp === "string" ? Date.parse(event.timestamp) : NaN;
	return {
		messageId: id,
		role,
		text,
		timestamp: Number.isFinite(timestamp) ? timestamp : fallbackTimestamp
	};
}
function hasTranscriptMessage(event) {
	return isRecord(event) && Object.hasOwn(event, "message") && event.message !== void 0;
}
/** Control facts still belong in bounded context acquisition, even without a replay message. */
function transcriptEventContextEligibility(event) {
	return isRecord(event) && isRecord(event.message) && event.message.excludeFromContext === true ? 0 : 1;
}
function shouldProjectActiveEvent(event) {
	return isRecord(event) && event.type !== "session" && (isCanonicalSessionTranscriptEntry(event) || parseSessionTranscriptTreeEntry(event) !== void 0 || hasTranscriptMessage(event));
}
/** Resolves one append against an already-complete projection without mutating storage. */
function prepareSessionTranscriptProjectionAppend(params) {
	const { cursor } = params;
	const treeEntry = parseSessionTranscriptTreeEntry(params.event);
	const isCanonicalEvent = isCanonicalSessionTranscriptEntry(params.event);
	const initializesProjection = cursor.indexedSeq === -1;
	if (params.seq !== cursor.indexedSeq + 1 || !initializesProjection && (isSessionTranscriptLeafControl(params.event) || isSessionTranscriptSideAppendEntry(params.event) || isCanonicalEvent && cursor.leafEventId === null && cursor.activeEventCount > 0 || !isCanonicalEvent && cursor.leafEventId !== null && shouldProjectActiveEvent(params.event) || treeEntry && treeEntry.parentId !== cursor.leafEventId)) return;
	const ftsRow = extractTranscriptIndexEntry(params.event, params.createdAt);
	const projectsActiveEvent = shouldProjectActiveEvent(params.event);
	const projectsMessage = projectsActiveEvent && hasTranscriptMessage(params.event);
	const activeRow = projectsActiveEvent ? {
		activePosition: cursor.activeEventCount,
		contextEligible: transcriptEventContextEligibility(params.event),
		eventSeq: params.seq,
		messagePosition: projectsMessage ? cursor.activeMessageCount : null
	} : void 0;
	return {
		...activeRow ? { activeRow } : {},
		cursor: {
			activeEventCount: cursor.activeEventCount + (projectsActiveEvent ? 1 : 0),
			activeMessageCount: cursor.activeMessageCount + (projectsMessage ? 1 : 0),
			indexedSeq: params.seq,
			leafEventId: params.eventId !== null && isCanonicalEvent ? params.eventId : cursor.leafEventId
		},
		...ftsRow ? { ftsRow } : {}
	};
}
//#endregion
//#region src/config/sessions/session-transcript-projection-rebuild.ts
const PROJECTION_FINALIZE_TAIL_ROWS = 512;
const PROJECTION_FINALIZE_TAIL_BYTES = 262144;
function transcriptEventStoredByteLength() {
	return transcriptEventReadBytesSql().as("event_bytes");
}
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
function changesPriorProjectionVisibility(event) {
	return isCanonicalSessionTranscriptEntry(event) && event.type === "reset";
}
/** Streams projection payloads; only navigation metadata is retained for branch resolution. */
function visitSessionTranscriptProjection(db, sessionId, visitor) {
	const source = readProjectionSource(db, sessionId);
	return source ? visitProjectionSource(source, visitor) : void 0;
}
function readProjectionSource(db, sessionId) {
	const kysely = getProjectionKysely(db);
	const session = executeSqliteQueryTakeFirstSync(db, kysely.selectFrom("session_windows as session").leftJoin("transcript_rewrite_watermarks as rewrite", "rewrite.session_id", "session.session_id").select(["session.transcript_updated_at", "rewrite.generation"]).where("session.session_id", "=", sessionId));
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
			transcriptEventNavigationSql().as("event_json"),
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
			const navigation = { seq: row.seq };
			if (isRecord(event)) {
				for (const key of [
					"type",
					"id",
					"parentId",
					"targetId",
					"appendParentId",
					"appendMode"
				]) if (Object.hasOwn(event, key)) navigation[key] = event[key];
			}
			yield navigation;
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
		if (indexed) visitor.ftsRow(indexed);
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
	const ftsRows = [];
	const metadata = visitProjectionSource(source, {
		activeRow: (row) => activeRows.push(row),
		ftsRow: (row) => ftsRows.push(row)
	});
	return metadata ? {
		...metadata,
		activeRows,
		ftsRows
	} : void 0;
}
/** The worker owns these ordered raw rows; memory-backed transcripts never reopen a path. */
function prepareMemorySessionTranscriptProjection(sessionId, transcriptUpdatedAt, rows, transcriptGeneration = null) {
	return prepareProjectionSource({
		sessionId,
		transcriptGeneration,
		transcriptUpdatedAt,
		rows: () => rows.values(),
		row: (seq) => rows.get(seq)
	});
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
	const session = executeSqliteQueryTakeFirstSync(db, kysely.selectFrom("session_windows as session").leftJoin("transcript_rewrite_watermarks as rewrite", "rewrite.session_id", "session.session_id").select(["session.transcript_updated_at", "rewrite.generation"]).where("session.session_id", "=", sessionId));
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
	const sizeRows = executeSqliteQuerySync(db, getProjectionKysely(db).selectFrom("transcript_events").select(["seq", transcriptEventStoredByteLength()]).where("session_id", "=", plan.sessionId).where("seq", ">", plan.sourceIndexedSeq).orderBy("seq", "asc").limit(513)).rows;
	return sizeRows.length === tailRowCount && (sizeRows.at(-1)?.seq ?? plan.sourceIndexedSeq) === snapshot.latestSeq && sizeRows.reduce((total, row) => total + row.event_bytes, 0) <= PROJECTION_FINALIZE_TAIL_BYTES;
}
function projectionClaimIsOwned(db, sessionId, claimId) {
	const row = executeSqliteQueryTakeFirstSync(db, getProjectionKysely(db).selectFrom("session_transcript_index_state").select(["needs_rebuild", "updated_at"]).where("session_id", "=", sessionId));
	return row?.needs_rebuild !== 0 && row?.updated_at === claimId;
}
/** Claims a prepared snapshot. Later chunks publish only while this claim remains current. */
function claimPreparedSessionTranscriptProjectionInTransaction(db, plan, claimId) {
	const sourceSnapshot = readProjectionSourceSnapshot(db, plan.sessionId);
	if (!sourceSnapshotMatches(sourceSnapshot, plan) && (plan.sourceHasInvalidLeafControl || !projectionTailFitsCatchUpBounds(db, plan, sourceSnapshot))) return false;
	const kysely = getProjectionKysely(db);
	const current = executeSqliteQueryTakeFirstSync(db, kysely.selectFrom("session_transcript_index_state").select(["indexed_seq", "needs_rebuild"]).where("session_id", "=", plan.sessionId));
	if (current?.needs_rebuild === 0 && current.indexed_seq === sourceSnapshot.latestSeq && !hasUnclassifiedSessionTranscriptEvents(db, plan.sessionId)) return false;
	executeSqliteQuerySync(db, kysely.insertInto("session_transcript_index_state").values({
		active_event_count: 0,
		active_message_count: 0,
		indexed_seq: -1,
		leaf_event_id: null,
		needs_rebuild: 1,
		session_id: plan.sessionId,
		updated_at: claimId
	}).onConflict((conflict) => conflict.column("session_id").doUpdateSet({
		active_event_count: 0,
		active_message_count: 0,
		indexed_seq: -1,
		leaf_event_id: null,
		needs_rebuild: 1,
		updated_at: claimId
	})));
	return true;
}
/** Deletes old rows in bounded rowid batches while the prepared claim is current. */
function deletePreparedSessionTranscriptProjectionChunkInTransaction(db, params) {
	if (!projectionClaimIsOwned(db, params.sessionId, params.claimId)) return {
		hasMore: false,
		owned: false
	};
	const kysely = getProjectionKysely(db);
	const active = Number(executeSqliteQuerySync(db, kysely.deleteFrom("session_transcript_active_events").where("rowid", "in", kysely.selectFrom("session_transcript_active_events").select("rowid").where("session_id", "=", params.sessionId).limit(params.maxRowsPerTable))).numAffectedRows ?? 0n);
	const fts = deleteSessionTranscriptFtsRowsInTransaction(db, params.sessionId, { maxRows: params.maxRowsPerTable });
	return {
		hasMore: active === params.maxRowsPerTable || fts === params.maxRowsPerTable,
		owned: true
	};
}
/** Appends one bounded projection chunk while its claim remains current. */
function appendPreparedSessionTranscriptProjectionChunkInTransaction(db, params) {
	if (!projectionClaimIsOwned(db, params.sessionId, params.claimId)) return false;
	insertPreparedSessionTranscriptProjectionRows(db, params);
	return true;
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
		if (changesPriorProjectionVisibility(event)) return;
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
	if (!projectionClaimIsOwned(db, plan.sessionId, claimId)) return false;
	if (executeSqliteQueryTakeFirstSync(db, getProjectionKysely(db).selectFrom("session_transcript_active_events").select((eb) => eb.fn.countAll().as("count")).where("session_id", "=", plan.sessionId))?.count !== plan.activeEventCount || hasUnclassifiedSessionTranscriptEvents(db, plan.sessionId)) return false;
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
	executeSqliteQuerySync(db, getProjectionKysely(db).updateTable("session_transcript_index_state").set({
		active_event_count: finalPlan.activeEventCount,
		active_message_count: finalPlan.activeMessageCount,
		indexed_seq: finalPlan.sourceIndexedSeq,
		leaf_event_id: finalPlan.leafEventId,
		needs_rebuild: 0,
		updated_at: Date.now()
	}).where("session_id", "=", finalPlan.sessionId).where("needs_rebuild", "!=", 0).where("updated_at", "=", claimId));
	return true;
}
//#endregion
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
function readSessionTranscriptProjectionState(db, sessionId) {
	const row = executeSqliteQueryTakeFirstSync(db, getIndexKysely(db).selectFrom("session_transcript_index_state").select([
		"active_event_count",
		"active_message_count",
		"indexed_seq",
		"leaf_event_id",
		"needs_rebuild"
	]).where("session_id", "=", sessionId));
	if (!row) return;
	return {
		activeEventCount: row.active_event_count,
		activeMessageCount: row.active_message_count,
		indexedSeq: row.indexed_seq,
		leafEventId: row.leaf_event_id,
		needsRebuild: row.needs_rebuild !== 0
	};
}
function readLatestTranscriptSequence(db, sessionId) {
	return executeSqliteQueryTakeFirstSync(db, getIndexKysely(db).selectFrom("transcript_events").select("seq").where("session_id", "=", sessionId).orderBy("seq", "desc").limit(1))?.seq;
}
function sessionTranscriptIndexNeedsReconcile(db, sessionId) {
	const latestSeq = readLatestTranscriptSequence(db, sessionId);
	return latestSeq !== void 0 && sessionTranscriptProjectionNeedsReconcile(db, sessionId, latestSeq);
}
function sessionTranscriptProjectionNeedsReconcile(db, sessionId, latestSeq) {
	const state = readSessionTranscriptProjectionState(db, sessionId);
	return !state || state.needsRebuild || state.indexedSeq !== latestSeq || hasUnclassifiedSessionTranscriptEvents(db, sessionId);
}
function createWatermarkWriter(db, sessionId, updateExisting = false) {
	return prepareSqliteQuerySync(db, (parameter) => {
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
}
function createActiveEventInserter(db, sessionId) {
	return prepareSqliteQuerySync(db, (parameter) => getIndexKysely(db).insertInto("session_transcript_active_events").values({
		session_id: sessionId,
		active_position: parameter((row) => row.activePosition),
		context_eligible: parameter((row) => row.contextEligible),
		event_seq: parameter((row) => row.eventSeq),
		message_position: parameter((row) => row.messagePosition)
	}));
}
function deleteActiveEventRows(db, sessionId) {
	executeSqliteQuerySync(db, getIndexKysely(db).deleteFrom("session_transcript_active_events").where("session_id", "=", sessionId));
}
/**
* In-transaction batch appender. Forward-indexes the event when it
* unambiguously extends the active branch and marks the session for rebuild
* otherwise. Runs inside the same write transaction as the event insert, so
* the index can never lag or tear relative to committed transcript rows.
* Retain only within a synchronous batch whose source cannot mutate this session.
*/
function createTranscriptIndexAppenderInTransaction(db, sessionId) {
	let watermark = readSessionTranscriptProjectionState(db, sessionId);
	let hasUnclassifiedEvents;
	let insertActiveEvent;
	let insertFts;
	let updateWatermark;
	return (params) => {
		if (!watermark) {
			if (params.seq !== 0) return true;
			const append = prepareSessionTranscriptProjectionAppend({
				...params,
				cursor: {
					activeEventCount: 0,
					activeMessageCount: 0,
					indexedSeq: -1,
					leafEventId: null
				}
			});
			if (!append) return true;
			applyForwardIndex(params.createdAt, append);
			return false;
		}
		if (watermark.needsRebuild) return true;
		if (hasUnclassifiedEvents ??= hasUnclassifiedSessionTranscriptEvents(db, sessionId)) {
			watermark = markSessionTranscriptIndexDirtyInTransaction(db, sessionId);
			return true;
		}
		const append = prepareSessionTranscriptProjectionAppend({
			...params,
			cursor: watermark
		});
		if (!append) {
			watermark = markSessionTranscriptIndexDirtyInTransaction(db, sessionId);
			return true;
		}
		applyForwardIndex(params.createdAt, append);
		return false;
	};
	function applyForwardIndex(createdAt, append) {
		if (append.ftsRow) {
			insertFts ??= createSessionTranscriptFtsInserter(db, sessionId);
			insertFts(append.ftsRow);
		}
		if (append.activeRow) {
			insertActiveEvent ??= createActiveEventInserter(db, sessionId);
			insertActiveEvent(append.activeRow);
		}
		const nextWatermark = {
			...append.cursor,
			needsRebuild: false,
			updatedAt: createdAt
		};
		(watermark ? updateWatermark ??= createWatermarkWriter(db, sessionId, true) : createWatermarkWriter(db, sessionId))(nextWatermark);
		watermark = nextWatermark;
	}
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
	return dirty;
}
/** In-transaction delete hook: drops index rows alongside transcript rows. */
function deleteSessionTranscriptIndexInTransaction(db, sessionId) {
	deleteSessionTranscriptFtsRowsInTransaction(db, sessionId);
	deleteActiveEventRows(db, sessionId);
	executeSqliteQuerySync(db, getIndexKysely(db).deleteFrom("session_transcript_index_state").where("session_id", "=", sessionId));
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
		const currentRows = executeSqliteQuerySync(db, kysely.selectFrom("session_transcript_active_events").select([
			"active_position",
			"context_eligible",
			"event_seq",
			"message_position"
		]).where("session_id", "=", sessionId).where("event_seq", "<", params.unchangedBeforeSeq).orderBy("active_position", "asc")).rows;
		const sameRow = (current, expected) => current?.active_position === expected?.activePosition && current?.context_eligible === expected?.contextEligible && current?.event_seq === expected?.eventSeq && current?.message_position === expected?.messagePosition;
		const expectedCurrentRows = previous.activeRows.filter((row) => row.eventSeq < params.unchangedBeforeSeq);
		if (currentRows.length !== expectedCurrentRows.length || currentRows.some((row, index) => !sameRow(row, expectedCurrentRows[index]))) throw new Error(`Transcript projection changed before suffix replacement: ${sessionId}`);
		const prefixCount = params.next.activeRows.findIndex((row) => row.eventSeq >= params.unchangedBeforeSeq);
		retainedCount = prefixCount < 0 ? params.next.activeRows.length : prefixCount;
		if (retainedCount !== expectedCurrentRows.length || params.next.activeRows.slice(0, retainedCount).some((row, index) => !sameRow(currentRows[index], row))) throw new Error(`Transcript projection prefix changed before suffix replacement: ${sessionId}`);
	}
	const removedMessageIds = incremental ? params.removedMessageIds ?? [] : [...new Set(params.previous.activeRows.slice(retainedCount).flatMap((row) => row.ftsEntry ? [row.ftsEntry.messageId] : []))];
	if (removedMessageIds.length > 0) deleteSessionTranscriptFtsRowsInTransaction(db, sessionId, { messageIds: removedMessageIds });
	executeSqliteQuerySync(db, kysely.deleteFrom("session_transcript_active_events").where("session_id", "=", sessionId).where("active_position", ">=", retainedCount));
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
	const latestSeq = readLatestTranscriptSequence(db, sessionId);
	if (latestSeq === void 0) {
		deleteSessionTranscriptIndexInTransaction(db, sessionId);
		return false;
	}
	if (!sessionTranscriptProjectionNeedsReconcile(db, sessionId, latestSeq)) return false;
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
/** Search needs only one pending session; the reconcile owner selects its complete work list. */
function hasSessionsNeedingTranscriptIndexReconcile(db) {
	return executeSqliteQueryTakeFirstSync(db, selectSessionsNeedingTranscriptIndexReconcile(db).limit(1)) !== void 0;
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
/** Orphan-only cleanup is independent of live sessions' projection watermarks. */
function hasOrphanedTranscriptIndexRows(db) {
	const kysely = getIndexKysely(db);
	return transcriptIndexTables.some((table) => executeSqliteQueryTakeFirstSync(db, kysely.selectFrom(table).select("session_id").where("session_id", "not in", kysely.selectFrom("transcript_events").select("session_id").distinct()).limit(1)) !== void 0);
}
/** Drops index rows for sessions whose transcript rows are gone. */
function deleteOrphanedTranscriptIndexRowsInTransaction(db) {
	const kysely = getIndexKysely(db);
	for (const table of transcriptIndexTables) executeSqliteQuerySync(db, kysely.deleteFrom(table).where("session_id", "not in", kysely.selectFrom("transcript_events").select("session_id").distinct()));
}
//#endregion
export { transcriptEventContextEligibility as C, shouldProjectActiveEvent as S, finalizePreparedSessionTranscriptProjectionInTransaction as _, deleteSessionTranscriptIndexInTransaction as a, extractTranscriptIndexEntry as b, listSessionsNeedingTranscriptIndexReconcile as c, replaceSessionTranscriptIndexSuffixInTransaction as d, sessionTranscriptIndexNeedsReconcile as f, deletePreparedSessionTranscriptProjectionChunkInTransaction as g, claimPreparedSessionTranscriptProjectionInTransaction as h, deleteOrphanedTranscriptIndexRowsInTransaction as i, markSessionTranscriptIndexDirtyInTransaction as l, appendPreparedSessionTranscriptProjectionChunkInTransaction as m, SYNC_REBUILD_MAX_ROWS as n, hasOrphanedTranscriptIndexRows as o, shouldRebuildSessionTranscriptIndexSynchronously as p, createTranscriptIndexAppenderInTransaction as r, hasSessionsNeedingTranscriptIndexReconcile as s, SYNC_REBUILD_MAX_BYTES as t, reconcileSessionTranscriptIndexInTransaction as u, prepareMemorySessionTranscriptProjection as v, hasTranscriptMessage as x, prepareSessionTranscriptProjection as y };
