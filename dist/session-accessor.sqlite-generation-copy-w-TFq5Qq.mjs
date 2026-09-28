import { a as iterateSqliteQuerySync, l as sqliteStringSet, n as executeSqliteQuerySync, r as executeSqliteQueryTakeFirstSync, s as prepareSqliteQuerySync } from "./kysely-sync-Bn6Qrpbz.mjs";
import { i as readOpenClawAgentDatabaseIdentity } from "./openclaw-agent-db-identity-DLTnzTd_.mjs";
import { s as transcriptEventJsonSql } from "./transcript-payload-qsg5dB6v.mjs";
import { a as normalizeStoreSessionKey } from "./store-entry-DuM7NmYY.mjs";
import { a as getSessionKysely } from "./session-accessor.sqlite-scope-DHC66DLY.mjs";
import { l as markSessionTranscriptIndexDirtyInTransaction, u as reconcileSessionTranscriptIndexInTransaction } from "./session-transcript-index-UaRlRUAw.mjs";
import { a as publishSessionEntryCacheInvalidation } from "./session-accessor.sqlite-entry-cache-CtMz7hDz.mjs";
import { b as readSessionInputArtifactRows } from "./session-accessor.sqlite-entry-store-BUBLa7UE.mjs";
import { n as assertSessionTranscriptHot, r as readSessionColdTranscript } from "./session-cold-storage-state-BcO2Rrog.mjs";
import { i as createTranscriptIdentityInserter } from "./session-accessor.sqlite-transcript-store-B4Sq8ywF.mjs";
import { createHash } from "node:crypto";
//#region src/config/sessions/session-accessor.sqlite-generation-copy.ts
function readSqliteSessionGenerationWindows(database, sessionKeys, sessionIds) {
	return executeSqliteQuerySync(database.db, getSessionKysely(database.db).selectFrom("session_windows").selectAll().where((eb) => eb.or([eb("session_key", "in", sqliteStringSet(sessionKeys)), eb("session_id", "in", sqliteStringSet(sessionIds))])).orderBy("session_id")).rows;
}
function readSqliteSessionGenerationRows(database, sessionId) {
	const db = getSessionKysely(database.db);
	return {
		identities: iterateSqliteQuerySync(database.db, db.selectFrom("transcript_event_identities").selectAll().where("session_id", "=", sessionId).orderBy("event_id")),
		rewriteWatermarks: iterateSqliteQuerySync(database.db, db.selectFrom("transcript_rewrite_watermarks").selectAll().where("session_id", "=", sessionId)),
		trajectoryEvents: iterateSqliteQuerySync(database.db, db.selectFrom("trajectory_runtime_events").selectAll().where("session_id", "=", sessionId).orderBy("seq")),
		parentStreamEvents: iterateSqliteQuerySync(database.db, db.selectFrom("acp_parent_stream_events").selectAll().where("session_id", "=", sessionId).orderBy("run_id").orderBy("seq"))
	};
}
function readSqliteSessionGenerationClaim(database, window) {
	const rows = readSqliteSessionGenerationRows(database, window.session_id);
	const coldArchive = readSessionColdTranscript(database.db, window.session_id);
	const fingerprint = createHash("sha256").update(JSON.stringify(window)).update("\n").update(JSON.stringify(coldArchive ?? null)).update("\n");
	const contentFingerprint = createHash("sha256");
	if (coldArchive) contentFingerprint.update(JSON.stringify(["cold", coldArchive])).update("\n");
	const hashRows = (table, tableRows, content) => {
		fingerprint.update(table).update("\n");
		for (const row of tableRows) {
			fingerprint.update(JSON.stringify(row)).update("\n");
			if (content) contentFingerprint.update(JSON.stringify(content(row))).update("\n");
		}
	};
	hashRows("events", iterateSqliteQuerySync(database.db, getSessionKysely(database.db).selectFrom("transcript_events").select(["session_id", "seq"]).select(transcriptEventJsonSql(database.db).as("event_json")).select("created_at").where("session_id", "=", window.session_id).orderBy("seq")), (row) => [
		"event",
		row.seq,
		row.event_json
	]);
	hashRows("identities", rows.identities, (row) => [
		"identity",
		row.event_id,
		row.event_type,
		row.parent_id,
		row.seq,
		row.message_idempotency_key
	]);
	hashRows("rewriteWatermarks", rows.rewriteWatermarks, () => ["rewrite"]);
	hashRows("trajectoryEvents", rows.trajectoryEvents, (row) => [
		"trajectory",
		row.seq,
		row.run_id,
		row.event_json
	]);
	hashRows("parentStreamEvents", rows.parentStreamEvents, (row) => [
		"parentStream",
		row.seq,
		row.run_id,
		row.event_json
	]);
	hashRows("sessionConversations", executeSqliteQuerySync(database.db, getSessionKysely(database.db).selectFrom("session_conversations").selectAll().where("session_id", "=", window.session_id).orderBy("conversation_id").orderBy("role")).rows, (row) => [
		"conversation",
		row.role,
		row.conversation_id,
		row.route_context_json
	]);
	const inputs = readSessionInputArtifactRows(database, window.session_id);
	hashRows("pendingInputs", inputs.pendingInputs);
	hashRows("inputCompletions", inputs.inputCompletions);
	return {
		window,
		coldArchive,
		fingerprint: fingerprint.digest("hex"),
		contentFingerprint: contentFingerprint.digest("hex")
	};
}
function rehomeSqliteSessionGenerationWindow(window, canonicalKey, sourceKeys) {
	return {
		...window,
		session_key: canonicalKey,
		parent_session_key: window.parent_session_key && sourceKeys.has(normalizeStoreSessionKey(window.parent_session_key.trim())) ? canonicalKey : window.parent_session_key,
		spawned_by: window.spawned_by && sourceKeys.has(normalizeStoreSessionKey(window.spawned_by.trim())) ? canonicalKey : window.spawned_by
	};
}
function copySqliteSessionGenerationRows(params) {
	if (readOpenClawAgentDatabaseIdentity(params.source).identity === readOpenClawAgentDatabaseIdentity(params.destination).identity) throw new Error("Transcript generation copy requires distinct source and destination databases.");
	assertSessionTranscriptHot(params.source.db, params.sessionId);
	assertSessionTranscriptHot(params.destination.db, params.sessionId);
	const sourceDb = getSessionKysely(params.source.db);
	const tables = [
		"transcript_event_identities",
		"transcript_events",
		"transcript_rewrite_watermarks",
		"trajectory_runtime_events",
		"acp_parent_stream_events"
	];
	if (!params.sourceWindowPresent && !tables.some((table) => executeSqliteQueryTakeFirstSync(params.source.db, sourceDb.selectFrom(table).select("session_id").where("session_id", "=", params.sessionId).limit(1)))) return;
	const { identities, rewriteWatermarks, trajectoryEvents, parentStreamEvents } = readSqliteSessionGenerationRows(params.source, params.sessionId);
	const destinationDb = getSessionKysely(params.destination.db);
	for (const table of tables) executeSqliteQuerySync(params.destination.db, destinationDb.deleteFrom(table).where("session_id", "=", params.sessionId));
	const eventQuery = sourceDb.selectFrom("transcript_events").where("session_id", "=", params.sessionId).orderBy("seq");
	const insertEvent = prepareSqliteQuerySync(params.destination.db, (parameter) => destinationDb.insertInto("transcript_events").values({
		session_id: params.sessionId,
		seq: parameter((row) => row.seq),
		created_at: parameter((row) => row.created_at),
		event_json: parameter((row) => row.event_json),
		event_zstd: parameter((row) => row.event_zstd),
		event_utf8_bytes: parameter((row) => row.event_utf8_bytes),
		navigation_json: parameter((row) => row.navigation_json)
	}));
	if (params.destination.db.prepare("PRAGMA encoding").get()?.encoding !== "UTF-8") for (const row of iterateSqliteQuerySync(params.source.db, eventQuery.select([
		"session_id",
		"seq",
		"created_at"
	]).select(transcriptEventJsonSql(params.source.db).as("event_json")))) insertEvent({
		...row,
		event_zstd: null,
		event_utf8_bytes: null,
		navigation_json: null
	});
	else for (const row of iterateSqliteQuerySync(params.source.db, eventQuery.selectAll())) insertEvent(row);
	const insertIdentity = createTranscriptIdentityInserter(params.destination, params.sessionId, false);
	for (const row of identities) insertIdentity({
		seq: row.seq,
		eventId: row.event_id,
		eventType: row.event_type,
		parentId: row.parent_id,
		messageIdempotencyKey: row.message_idempotency_key,
		createdAt: row.created_at
	});
	for (const row of rewriteWatermarks) executeSqliteQuerySync(params.destination.db, destinationDb.insertInto("transcript_rewrite_watermarks").values(row));
	for (const row of trajectoryEvents) executeSqliteQuerySync(params.destination.db, destinationDb.insertInto("trajectory_runtime_events").values(row));
	for (const row of parentStreamEvents) executeSqliteQuerySync(params.destination.db, destinationDb.insertInto("acp_parent_stream_events").values(row));
	markSessionTranscriptIndexDirtyInTransaction(params.destination.db, params.sessionId);
	reconcileSessionTranscriptIndexInTransaction(params.destination.db, params.sessionId);
	const owner = executeSqliteQueryTakeFirstSync(params.destination.db, destinationDb.selectFrom("session_windows").select("session_key").where("session_id", "=", params.sessionId));
	if (owner) publishSessionEntryCacheInvalidation(params.destination, { sessionKey: owner.session_key });
}
//#endregion
export { rehomeSqliteSessionGenerationWindow as i, readSqliteSessionGenerationClaim as n, readSqliteSessionGenerationWindows as r, copySqliteSessionGenerationRows as t };
