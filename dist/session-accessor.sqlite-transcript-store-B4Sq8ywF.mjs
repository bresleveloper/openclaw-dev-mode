import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { p as redactSecrets } from "./redact-B5EGyLvV.mjs";
import { n as executeSqliteQuerySync, r as executeSqliteQueryTakeFirstSync, s as prepareSqliteQuerySync, u as sql } from "./kysely-sync-Bn6Qrpbz.mjs";
import { a as deferOpenClawAgentPostCommitPublication } from "./openclaw-agent-db-CaQAStOA.mjs";
import { i as prepareTranscriptPayload, n as createTranscriptEventInserter, p as transcriptEventWithoutCustomDataBytesSql, r as createTranscriptPayloadUpdater, s as transcriptEventJsonSql, u as transcriptEventNavigationSql } from "./transcript-payload-qsg5dB6v.mjs";
import { n as isKnownCliHistoryBoundary, t as getCliHistoryWriter } from "./cli-history-boundary-CwwMqsE-.mjs";
import { r as canonicalizePersistedUserMessageMedia } from "./media-facts-BEHTU0wM.mjs";
import { a as getSessionKysely } from "./session-accessor.sqlite-scope-DHC66DLY.mjs";
import { C as transcriptEventContextEligibility, a as deleteSessionTranscriptIndexInTransaction, b as extractTranscriptIndexEntry, f as sessionTranscriptIndexNeedsReconcile, l as markSessionTranscriptIndexDirtyInTransaction, p as shouldRebuildSessionTranscriptIndexSynchronously, r as createTranscriptIndexAppenderInTransaction, u as reconcileSessionTranscriptIndexInTransaction, x as hasTranscriptMessage } from "./session-transcript-index-UaRlRUAw.mjs";
import { t as transcriptEventReadBytesSql } from "./session-transcript-read-bytes-jHOoqdX_.mjs";
import { r as startSessionTranscriptIndexReconcile } from "./session-transcript-reconcile-Cef06Gbk.mjs";
import { c as readSessionEntryRow } from "./session-accessor.sqlite-entry-read-yAa3_SVY.mjs";
import { f as writeSessionEntry } from "./session-accessor.sqlite-entry-store-BUBLa7UE.mjs";
import { a as readNextTranscriptSeq, c as readTranscriptMutationStateInTransaction, i as ensureTranscriptSessionRoot, l as rotateTranscriptGenerationInTransaction, n as deleteTranscriptEventsInTransaction, r as ensureTranscriptGenerationInTransaction, s as readTranscriptGenerationInTransaction, t as advanceTranscriptMutationAtInTransaction, u as touchTranscriptMutationInTransaction } from "./session-accessor.sqlite-transcript-state-BGrlGphn.mjs";
import { C as readTranscriptIdentityByEventId, h as readEventTimestamp, r as findTranscriptEventInDatabase, t as createTranscriptIdentityReader, v as readTranscriptEventId, y as readTranscriptEventMessage } from "./session-accessor.sqlite-read-DO8t28O6.mjs";
import { t as readMessageIdempotencyKey } from "./transcript-message-identity-Cvvo_Q35.mjs";
import { a as getCodeModeSourceAppend, t as redactTranscriptMessage } from "./transcript-redact-CcOcbRyc.mjs";
import { isDeepStrictEqual } from "node:util";
import { randomUUID } from "node:crypto";
//#region src/config/sessions/session-accessor.sqlite-cli-history-boundary.ts
/** Advance only a contiguous prefix written by the exact prepared CLI account's live owner. */
function advanceCliHistoryBoundaryInTransaction(database, scope, seq) {
	const target = {
		...scope,
		storePath: database.path
	};
	const writer = getCliHistoryWriter(target);
	if (!writer) return;
	const entry = readSessionEntryRow(database, scope.sessionKey)?.entry;
	const boundary = entry?.cliHistoryBoundary;
	const generation = readTranscriptGenerationInTransaction(database, scope.sessionId);
	if (!entry || !isKnownCliHistoryBoundary(boundary) || entry.sessionId !== scope.sessionId || boundary.sessionId !== scope.sessionId || entry.activeWriterRunId !== writer.expectedWriterRunId || entry.lifecycleRevision !== writer.lifecycleRevision || boundary.writerRunId !== writer.runId || boundary.authFingerprint !== writer.authFingerprint || (boundary.maxSeq === null ? seq !== 0 : boundary.maxSeq !== seq - 1) || !generation || (boundary.generation === null ? seq !== 0 : boundary.generation !== generation)) return;
	writer.assertCurrent();
	writeSessionEntry(database, scope.sessionKey, {
		...entry,
		cliHistoryBoundary: {
			...boundary,
			generation,
			maxSeq: seq
		}
	}, { previousEntry: entry });
}
//#endregion
//#region src/config/sessions/session-transcript-retained-data.ts
/** Admit suffix repairs against their projected bytes without decoding opaque bodies. */
function transcriptRetainedDataBytesSql(retainedIds) {
	if (retainedIds.length === 0) return transcriptEventReadBytesSql();
	const event = transcriptEventNavigationSql();
	return sql`CASE WHEN json_valid(${event}) THEN
    CASE WHEN json_extract(${event}, '$.type') = 'custom'
      AND json_extract(${event}, '$.id') IN (${sql.join(retainedIds)})
      THEN ${transcriptEventWithoutCustomDataBytesSql()} ELSE ${transcriptEventReadBytesSql()} END
    ELSE ${transcriptEventReadBytesSql()} END`;
}
/** Custom data is opaque to topology and indexing; cleanup keeps it in SQLite. */
function projectTranscriptRetainedDataSql(event, retainedIds) {
	return retainedIds.length === 0 ? event : sql`CASE WHEN json_valid(${event}) THEN
        CASE WHEN json_extract(${event}, '$.type') = 'custom'
          AND json_extract(${event}, '$.id') IN (${sql.join(retainedIds)})
        THEN json_remove(${event}, '$.data') ELSE ${event} END
      ELSE ${event} END`;
}
/** Stage opaque payloads inside the same transaction before their old suffix rows are removed. */
function stageRetainedTranscriptData(database, sessionId, expectedRows, next, retainedIds) {
	if (retainedIds.length === 0) return;
	const retained = new Set(retainedIds);
	const originals = new Map(expectedRows.flatMap((row) => {
		const event = JSON.parse(row.eventJson);
		return isRecord(event) && event.type === "custom" && typeof event.id === "string" && retained.has(event.id) ? [[event.id, {
			row,
			event
		}]] : [];
	}));
	const copies = next.flatMap((event, index) => {
		if (!isRecord(event) || event.type !== "custom" || typeof event.id !== "string" || !retained.has(event.id)) return [];
		const original = originals.get(event.id);
		if (!original) throw new Error("Retained transcript data has no original suffix row");
		const { parentId: _oldParent, ...before } = original.event;
		const { parentId, ...after } = event;
		if (Object.hasOwn(before, "data") || Object.hasOwn(after, "data") || !isDeepStrictEqual(before, after) || parentId !== null && typeof parentId !== "string") throw new Error("Retained transcript data permits only parent repair");
		return [{
			index,
			sourceSeq: original.row.seq,
			parentId
		}];
	});
	if (copies.length === 0) return;
	const startSeq = readNextTranscriptSeq(database, sessionId) + next.length;
	const sources = /* @__PURE__ */ new Map();
	for (const [offset, copy] of copies.entries()) {
		const stagedSeq = startSeq + offset;
		copyRetainedTranscriptPayload(database, sessionId, copy.sourceSeq, stagedSeq, copy.parentId);
		sources.set(copy.index, stagedSeq);
	}
	return {
		startSeq,
		sources
	};
}
/** Copy a transaction-owned payload without materializing it in JavaScript. */
function copyRetainedTranscriptPayload(database, sessionId, sourceSeq, destinationSeq, parentId) {
	const db = getSessionKysely(database.db);
	if (executeSqliteQuerySync(database.db, db.insertInto("transcript_events").columns([
		"session_id",
		"seq",
		"event_json",
		"event_zstd",
		"event_utf8_bytes",
		"navigation_json",
		"created_at"
	]).expression(db.selectFrom("transcript_events").select((eb) => {
		const eventJson = parentId === void 0 ? eb.ref("event_json") : sql`json_set(${transcriptEventJsonSql(database.db)}, '$.parentId', ${parentId})`;
		return [
			eb.val(sessionId).as("session_id"),
			eb.val(destinationSeq).as("seq"),
			eventJson.as("event_json"),
			parentId === void 0 ? eb.ref("event_zstd").as("event_zstd") : eb.val(null).as("event_zstd"),
			parentId === void 0 ? eb.ref("event_utf8_bytes").as("event_utf8_bytes") : eb.val(null).as("event_utf8_bytes"),
			parentId === void 0 ? eb.ref("navigation_json").as("navigation_json") : eb.val(null).as("navigation_json"),
			"created_at"
		];
	}).where("session_id", "=", sessionId).where("seq", "=", sourceSeq))).numAffectedRows !== 1n) throw new Error("Retained transcript payload disappeared during suffix insertion");
}
//#endregion
//#region src/config/sessions/transcript-header.ts
/** Creates a session transcript header entry with current version metadata. */
function createSessionTranscriptHeader(params = {}) {
	return {
		type: "session",
		version: params.version ?? 4,
		id: params.sessionId ?? randomUUID(),
		timestamp: params.timestamp ?? (/* @__PURE__ */ new Date()).toISOString(),
		cwd: params.cwd ?? process.cwd(),
		...params.parentSession ? { parentSession: params.parentSession } : {}
	};
}
/** The prior transcript owns its workspace; caller context covers an unset row. */
function resolveResetBoundaryHeaderCwd(priorEntry, fallbackCwd) {
	return priorEntry.spawnedCwd ?? priorEntry.spawnedWorkspaceDir ?? fallbackCwd;
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-transcript-store.ts
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
/** Inserts exact transcript rows without mutating the forward-only projection. */
function insertTranscriptRowsWithoutProjectionInTransaction(database, sessionId, rows, reservedMessageIdempotencyKeys = /* @__PURE__ */ new Set()) {
	const insertEvent = createTranscriptEventInserter(database.db, sessionId);
	const insertIdentity = createTranscriptIdentityInserter(database, sessionId, false);
	for (const row of rows) {
		const event = canonicalizeTranscriptEventMedia(row.event);
		if (row.storedEventSeq === void 0) insertEvent({
			seq: row.seq,
			eventJson: JSON.stringify(event),
			createdAt: row.createdAt
		});
		else copyRetainedTranscriptPayload(database, sessionId, row.storedEventSeq, row.seq);
		const identity = readTranscriptEventIdentity(event);
		if (!identity) continue;
		if ("messageIdempotencyKey" in row) identity.messageIdempotencyKey = row.messageIdempotencyKey ?? null;
		else if (identity.messageIdempotencyKey && (reservedMessageIdempotencyKeys.has(identity.messageIdempotencyKey) || readIdempotencyKeyOwner(database, sessionId, identity.messageIdempotencyKey))) identity.messageIdempotencyKey = null;
		insertIdentity({
			...identity,
			seq: row.seq,
			createdAt: row.createdAt
		});
	}
}
/** Returns the exact committed JSON, or false when an existing identity owns the event. */
function appendTranscriptEventInTransaction(database, scope, event, options = {}) {
	return appendTranscriptEvent(database, scope, event, options);
}
function appendTranscriptEvent(database, scope, event, options, cursor = {}) {
	const persistedEvent = options.eventJson === void 0 ? canonicalizeTranscriptEventMedia(event) : event;
	const db = getSessionKysely(database.db);
	const createdAt = readEventTimestamp(persistedEvent) ?? Date.now();
	if (cursor.initialized) {
		cursor.updateWindow ??= prepareSqliteQuerySync(database.db, (parameter) => db.updateTable("session_windows").set({ updated_at: parameter((timestamp) => timestamp) }).where("session_id", "=", scope.sessionId));
		cursor.updateWindow(createdAt);
	} else {
		ensureTranscriptSessionRoot(database, scope, createdAt, { allowStoredAlias: options.allowStoredAlias === true });
		ensureTranscriptGenerationInTransaction(database, scope.sessionId);
		cursor.initialized = true;
	}
	const identity = readTranscriptEventIdentity(persistedEvent);
	if (identity) {
		cursor.readIdentity ??= createTranscriptIdentityReader(database, scope.sessionId);
		if (cursor.readIdentity(identity.eventId)) return false;
	}
	const idempotencyKeyOwner = identity?.messageIdempotencyKey ? readIdempotencyKeyOwner(database, scope.sessionId, identity.messageIdempotencyKey) : void 0;
	if (idempotencyKeyOwner && options.idempotencyKeyMode === "dedupe") return false;
	const seq = cursor.nextSeq ?? readNextTranscriptSeq(database, scope.sessionId);
	cursor.insertEvent ??= createTranscriptEventInserter(database.db, scope.sessionId);
	const eventJson = options.eventJson ?? JSON.stringify(persistedEvent);
	cursor.insertEvent({
		seq,
		eventJson,
		createdAt,
		parsedEvent: options.eventJson === void 0 ? void 0 : persistedEvent,
		preparedPayload: options.preparedPayload
	});
	cursor.nextSeq = seq + 1;
	if (options.touchMutation !== false) touchTranscriptMutationInTransaction(database, scope.sessionId);
	cursor.appendToIndex ??= createTranscriptIndexAppenderInTransaction(database.db, scope.sessionId);
	const projectionNeedsRebuild = cursor.appendToIndex({
		seq,
		event: persistedEvent,
		eventId: identity?.eventId ?? null,
		createdAt
	});
	if (projectionNeedsRebuild) options.onProjectionReconcileNeeded?.();
	if (identity) {
		if (idempotencyKeyOwner && options.idempotencyKeyMode === "relocate-owner") executeSqliteQuerySync(database.db, db.updateTable("transcript_event_identities").set({ message_idempotency_key: null }).where("session_id", "=", scope.sessionId).where("event_id", "=", idempotencyKeyOwner.eventId));
		identity.messageIdempotencyKey = idempotencyKeyOwner && options.idempotencyKeyMode !== "relocate-owner" ? null : identity.messageIdempotencyKey;
		cursor.insertIdentity ??= createTranscriptIdentityInserter(database, scope.sessionId, true);
		cursor.insertIdentity({
			...identity,
			seq,
			createdAt
		});
	}
	advanceCliHistoryBoundaryInTransaction(database, scope, seq);
	scheduleTranscriptProjectionReconcile(database, scope.sessionId, projectionNeedsRebuild, options);
	return eventJson;
}
function scheduleTranscriptProjectionReconcile(database, sessionId, projectionNeedsRebuild, options) {
	if (!projectionNeedsRebuild || options.scheduleProjectionReconcile === false) return;
	deferOpenClawAgentPostCommitPublication(database, () => startSessionTranscriptIndexReconcile({
		agentId: database.agentId,
		path: database.path,
		preferredSessionId: sessionId
	}));
}
function appendTranscriptEventsInTransaction(database, scope, events, options = {}) {
	let appended = 0;
	let projectionNeedsRebuild = false;
	const cursor = {};
	const iterator = events[Symbol.iterator]();
	const appendOptions = {
		...options,
		onProjectionReconcileNeeded: () => {
			projectionNeedsRebuild = true;
		},
		scheduleProjectionReconcile: false,
		touchMutation: false
	};
	try {
		let next = iterator.next();
		while (!next.done) {
			const inserted = appendTranscriptEvent(database, scope, next.value, appendOptions, cursor);
			if (inserted) appended += 1;
			next = iterator.next(inserted !== false);
		}
	} catch (error) {
		try {
			iterator.return?.();
		} catch {}
		throw error;
	}
	if (appended > 0) {
		if (options.touchMutation !== false) touchTranscriptMutationInTransaction(database, scope.sessionId);
		scheduleTranscriptProjectionReconcile(database, scope.sessionId, projectionNeedsRebuild, options);
	}
	return appended;
}
function appendTranscriptEventRowInTransaction(event, seq, state, createdAtOverride) {
	const persistedEvent = canonicalizeTranscriptEventMedia(event);
	const createdAt = createdAtOverride ?? readEventTimestamp(persistedEvent) ?? Date.now();
	const identity = readTranscriptEventIdentity(persistedEvent);
	if (identity && state.seenEventIds.has(identity.eventId)) return false;
	state.insertEvent({
		seq,
		eventJson: JSON.stringify(persistedEvent),
		createdAt
	});
	state.appendToIndex({
		seq,
		event: persistedEvent,
		eventId: identity?.eventId ?? null,
		createdAt
	});
	if (!identity) return true;
	state.seenEventIds.add(identity.eventId);
	if (identity.messageIdempotencyKey) {
		if (state.seenMessageIdempotencyKeys.has(identity.messageIdempotencyKey)) identity.messageIdempotencyKey = null;
		else state.seenMessageIdempotencyKeys.add(identity.messageIdempotencyKey);
	}
	state.insertIdentity({
		...identity,
		seq,
		createdAt
	});
	return true;
}
function ensureTranscriptHeader(database, scope, cwd) {
	const db = getSessionKysely(database.db);
	if (executeSqliteQueryTakeFirstSync(database.db, db.selectFrom("transcript_events").select("seq").where("session_id", "=", scope.sessionId).limit(1))) return;
	appendTranscriptEventInTransaction(database, scope, createSessionTranscriptHeader({
		cwd,
		sessionId: scope.sessionId
	}));
}
function replaceSqliteTranscriptEventsInTransaction(database, resolved, events, options = {}) {
	const rebuildSynchronously = events.length > 0 && shouldRebuildSessionTranscriptIndexSynchronously(database.db, resolved.sessionId, events);
	const preservedTranscriptUpdatedAt = options.preserveSessionWindowRecency === true ? readTranscriptMutationStateInTransaction(database, resolved.sessionId).updatedAt : void 0;
	const previousGeneration = readTranscriptGenerationInTransaction(database, resolved.sessionId);
	const deleted = deleteTranscriptEventsInTransaction(database, resolved.sessionId);
	if (events.length === 0) {
		deleteSessionTranscriptIndexInTransaction(database.db, resolved.sessionId);
		if (deleted || previousGeneration) {
			rotateTranscriptGenerationInTransaction(database, resolved.sessionId);
			recordTranscriptReplacementMutation(database, resolved.sessionId, preservedTranscriptUpdatedAt);
		}
		return;
	}
	if (!deleted || options.preserveSessionWindowRecency !== true) ensureTranscriptSessionRoot(database, resolved, readEventTimestamp(events[0]) ?? Date.now());
	if (deleted || previousGeneration) rotateTranscriptGenerationInTransaction(database, resolved.sessionId);
	else ensureTranscriptGenerationInTransaction(database, resolved.sessionId);
	if (rebuildSynchronously) deleteSessionTranscriptIndexInTransaction(database.db, resolved.sessionId);
	else markSessionTranscriptIndexDirtyInTransaction(database.db, resolved.sessionId);
	let seq = 0;
	const state = {
		seenEventIds: /* @__PURE__ */ new Set(),
		seenMessageIdempotencyKeys: /* @__PURE__ */ new Set(),
		insertEvent: createTranscriptEventInserter(database.db, resolved.sessionId),
		insertIdentity: createTranscriptIdentityInserter(database, resolved.sessionId, false),
		appendToIndex: createTranscriptIndexAppenderInTransaction(database.db, resolved.sessionId)
	};
	for (const [eventIndex, event] of events.entries()) if (appendTranscriptEventRowInTransaction(event, seq, state, options.createdAtByIndex?.[eventIndex])) seq += 1;
	if (deleted || seq > 0) {
		recordTranscriptReplacementMutation(database, resolved.sessionId, preservedTranscriptUpdatedAt);
		if (rebuildSynchronously) reconcileSessionTranscriptIndexInTransaction(database.db, resolved.sessionId);
		else scheduleTranscriptProjectionReconcile(database, resolved.sessionId, true, {});
	}
}
function recordTranscriptReplacementMutation(database, sessionId, preservedUpdatedAt) {
	if (preservedUpdatedAt === void 0 || preservedUpdatedAt === null) {
		touchTranscriptMutationInTransaction(database, sessionId);
		return;
	}
	advanceTranscriptMutationAtInTransaction(database, sessionId, preservedUpdatedAt, { strictly: true });
}
/** Rewrite existing transcript rows exactly, without append-time deduplication. */
function rewriteSqliteTranscriptEventRowsInTransaction(database, resolved, rows, options = {}) {
	if (rows.length === 0) return;
	const rewrites = rows.map((row) => {
		const eventJson = JSON.stringify(canonicalizeTranscriptEventMedia(row.event));
		return {
			...row,
			eventJson,
			payload: options.legacyTextStorage ? void 0 : prepareTranscriptPayload(database.db, eventJson)
		};
	});
	const projectionUnchanged = !sessionTranscriptIndexNeedsReconcile(database.db, resolved.sessionId) && rewrites.every((row) => transcriptRewritePreservesProjection(row.expectedEventJson, row.eventJson));
	const rebuildSynchronously = !options.legacyTextStorage && !projectionUnchanged && shouldRebuildSessionTranscriptIndexSynchronously(database.db, resolved.sessionId);
	const db = getSessionKysely(database.db);
	const rewrite = prepareSqliteQuerySync(database.db, (parameter) => db.updateTable("transcript_events").set(options.legacyTextStorage ? { event_json: parameter((row) => row.eventJson) } : {
		event_json: parameter((row) => row.payload.event_json),
		event_zstd: parameter((row) => row.payload.event_zstd),
		event_utf8_bytes: parameter((row) => row.payload.event_utf8_bytes),
		navigation_json: parameter((row) => row.payload.navigation_json)
	}).where("session_id", "=", resolved.sessionId).where("seq", "=", parameter((row) => row.seq)).where(options.legacyTextStorage ? "event_json" : transcriptEventJsonSql(database.db), "=", parameter((row) => row.expectedEventJson)));
	for (const row of rewrites) if (rewrite(row).numAffectedRows !== 1n) throw new Error(`Transcript row ${resolved.sessionId}:${row.seq} changed before exact rewrite`);
	rotateTranscriptGenerationInTransaction(database, resolved.sessionId);
	touchTranscriptMutationInTransaction(database, resolved.sessionId);
	if (!projectionUnchanged) {
		if (options.legacyTextStorage) markSessionTranscriptIndexDirtyInTransaction(database.db, resolved.sessionId);
		else reconcileRewrittenTranscriptIndex(database, resolved.sessionId, rebuildSynchronously);
	}
}
function transcriptRewritePreservesProjection(beforeJson, afterJson) {
	const before = JSON.parse(beforeJson);
	const after = JSON.parse(afterJson);
	if (!isRecord(before) || !isRecord(after)) return false;
	const { message: _beforeMessage, ...beforeEnvelope } = before;
	const { message: _afterMessage, ...afterEnvelope } = after;
	return isDeepStrictEqual(beforeEnvelope, afterEnvelope) && hasTranscriptMessage(before) === hasTranscriptMessage(after) && transcriptEventContextEligibility(before) === transcriptEventContextEligibility(after) && isDeepStrictEqual(extractTranscriptIndexEntry(before, 0), extractTranscriptIndexEntry(after, 0));
}
function reconcileRewrittenTranscriptIndex(database, sessionId, rebuildSynchronously) {
	markSessionTranscriptIndexDirtyInTransaction(database.db, sessionId);
	if (rebuildSynchronously) reconcileSessionTranscriptIndexInTransaction(database.db, sessionId);
	else scheduleTranscriptProjectionReconcile(database, sessionId, true, {});
}
function updateSqliteTranscriptEventJsonInTransaction(database, sessionId, updates) {
	if (updates.length === 0) return;
	const rebuildSynchronously = shouldRebuildSessionTranscriptIndexSynchronously(database.db, sessionId);
	const update = createTranscriptPayloadUpdater(database.db, sessionId);
	for (const row of updates) update({
		seq: row.seq,
		...prepareTranscriptPayload(database.db, row.eventJson)
	});
	rotateTranscriptGenerationInTransaction(database, sessionId);
	reconcileRewrittenTranscriptIndex(database, sessionId, rebuildSynchronously);
	recordTranscriptReplacementMutation(database, sessionId, readTranscriptMutationStateInTransaction(database, sessionId).updatedAt);
}
function readIdempotencyKeyOwner(database, sessionId, idempotencyKey) {
	const db = getSessionKysely(database.db);
	const row = executeSqliteQueryTakeFirstSync(database.db, db.selectFrom("transcript_event_identities").select(["event_id", "seq"]).where("session_id", "=", sessionId).where("message_idempotency_key", "=", idempotencyKey).orderBy("seq", "desc").limit(1));
	return row ? {
		eventId: row.event_id,
		seq: row.seq
	} : void 0;
}
function readTranscriptMessageByIdempotencyKey(database, scope, idempotencyKey) {
	const identity = readIdempotencyKeyOwner(database, scope.sessionId, idempotencyKey);
	return identity ? readTranscriptMessageByIdentity(database, scope, identity) : void 0;
}
function readTranscriptMessageByScopedIdempotencyKey(database, scope, idempotencyKey, lookup) {
	if (lookup !== "scan-assistant") return readTranscriptMessageByIdempotencyKey(database, scope, idempotencyKey);
	const found = findTranscriptEventInDatabase(database, scope.sessionId, (event) => {
		const message = readTranscriptEventMessage(event);
		return message?.role === "assistant" && message.idempotencyKey === idempotencyKey;
	});
	if (!found) return;
	const message = readTranscriptEventMessage(found.event);
	return message ? {
		messageId: readTranscriptEventId(found.event) ?? idempotencyKey,
		message
	} : void 0;
}
function readTranscriptMessageByEventId(database, scope, eventId) {
	const identity = readTranscriptIdentityByEventId(database, scope.sessionId, eventId);
	return identity ? readTranscriptMessageByIdentity(database, scope, identity) : void 0;
}
function readTranscriptMessageByIdentity(database, scope, identity) {
	const db = getSessionKysely(database.db);
	const eventRow = executeSqliteQueryTakeFirstSync(database.db, db.selectFrom("transcript_events").select(transcriptEventJsonSql(database.db).as("event_json")).where("session_id", "=", scope.sessionId).where("seq", "=", identity.seq));
	if (!eventRow) return;
	const event = JSON.parse(eventRow.event_json);
	return {
		messageId: identity.eventId,
		message: event.message
	};
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
function canonicalizeTranscriptEventMedia(event) {
	if (!isRecord(event)) return event;
	const message = event.message;
	if (event.type !== "message" || !isRecord(message)) return event;
	const canonical = canonicalizePersistedUserMessageMedia(message);
	return canonical.changed ? {
		...event,
		message: canonical.message
	} : event;
}
function redactTranscriptMessageForStorage(message, options) {
	return isTranscriptAgentMessage(message) ? redactTranscriptMessage(message, options.config, getCodeModeSourceAppend(options)) : redactSecrets(message);
}
function isTranscriptAgentMessage(value) {
	return isRecord(value) && typeof value.role === "string";
}
//#endregion
export { stageRetainedTranscriptData as _, ensureTranscriptHeader as a, readTranscriptMessageByScopedIdempotencyKey as c, rewriteSqliteTranscriptEventRowsInTransaction as d, scheduleTranscriptProjectionReconcile as f, projectTranscriptRetainedDataSql as g, resolveResetBoundaryHeaderCwd as h, createTranscriptIdentityInserter as i, redactTranscriptMessageForStorage as l, createSessionTranscriptHeader as m, appendTranscriptEventsInTransaction as n, insertTranscriptRowsWithoutProjectionInTransaction as o, updateSqliteTranscriptEventJsonInTransaction as p, canonicalizeTranscriptEventMedia as r, readTranscriptMessageByEventId as s, appendTranscriptEventInTransaction as t, replaceSqliteTranscriptEventsInTransaction as u, transcriptRetainedDataBytesSql as v };
