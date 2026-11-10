import { G as sqliteSessionIdWriteScope, U as withSqliteDatabaseWriteScope, W as withoutSqliteDatabaseWriteScope } from "./sqlite-database-admission-CqdNF9iE.mjs";
import { a as executeSqliteQueryTakeFirstSync, i as executeSqliteQuerySync, o as getNodeSqliteKysely } from "./kysely-sync-9fPQaMlh.mjs";
import { a as tableExists } from "./openclaw-state-db-schema-helpers-C7eId980.mjs";
import { n as ensureSessionTranscriptArchiveSchema } from "./openclaw-agent-session-transcript-archive-schema-CnBz2Ueu.mjs";
import { i as resolveRegisteredSqliteTranscriptArchiveName } from "./session-accessor.sqlite-archive-artifact-2spMMDfj.mjs";
//#region src/config/sessions/session-accessor.sqlite-archive-store-kernel.ts
const PENDING_ARCHIVE_PUBLISH_BATCH_SIZE = 4;
/** Reset inventories the optional archive owner without creating its schema. */
function readSessionTranscriptArchiveResetInventory(database) {
	if (!tableExists(database.db, "session_transcript_archives")) return [];
	return executeSqliteQuerySync(database.db, getNodeSqliteKysely(database.db).selectFrom("session_transcript_archives").select([
		"session_id",
		"generation",
		"archive_name",
		"archive_sha256",
		"published_at"
	]).orderBy("session_id").orderBy("generation")).rows;
}
/** Offline full-history reset also removes unpublished canonical recovery copies. */
function deleteAllSessionTranscriptArchivesInTransaction(database) {
	if (!tableExists(database.db, "session_transcript_archives")) return;
	withoutSqliteDatabaseWriteScope(database.db, () => executeSqliteQuerySync(database.db, getNodeSqliteKysely(database.db).deleteFrom("session_transcript_archives")));
}
function transcriptArchiveIdentityKey(sessionId, generation) {
	return `${sessionId}\u0000${generation}`;
}
function uniqueTranscriptArchives(archives) {
	return [...new Map(archives.map((archive) => [transcriptArchiveIdentityKey(archive.sessionId, archive.generation), archive])).values()];
}
/** The archive table is optional until the first committed archive. */
function hasPendingSessionTranscriptArchives(database) {
	return tableExists(database.db, "session_transcript_archives") && executeSqliteQueryTakeFirstSync(database.db, getNodeSqliteKysely(database.db).selectFrom("session_transcript_archives").select("session_id").where("published_at", "is", null).limit(1)) !== void 0;
}
function prepareSessionTranscriptArchivePublishPlans(database, params) {
	const db = getNodeSqliteKysely(database.db);
	if (params.requested.length > 0) ensureSessionTranscriptArchiveSchema(database.db);
	else if (!tableExists(database.db, "session_transcript_archives")) return [];
	const pendingArchives = executeSqliteQuerySync(database.db, db.selectFrom("session_transcript_archives").select([
		"archive_name",
		"created_at",
		"encoding",
		"generation",
		"reason",
		"session_id"
	]).where("published_at", "is", null).orderBy("created_at", "asc").orderBy("session_id", "asc").orderBy("generation", "asc").limit(PENDING_ARCHIVE_PUBLISH_BATCH_SIZE)).rows;
	for (const archive of pendingArchives) {
		if (archive.encoding !== "identity" && archive.encoding !== "zstd" || archive.reason !== "deleted" && archive.reason !== "reset") throw new Error(`Invalid pending SQLite transcript archive for ${archive.session_id}`);
		const archiveName = resolveRegisteredSqliteTranscriptArchiveName({
			createdAt: archive.created_at,
			encoding: archive.encoding,
			generation: archive.generation,
			reason: archive.reason,
			sessionId: archive.session_id
		});
		if (archiveName === archive.archive_name) continue;
		withSqliteDatabaseWriteScope(database.db, [sqliteSessionIdWriteScope(archive.session_id)], () => executeSqliteQuerySync(database.db, db.updateTable("session_transcript_archives").set({ archive_name: archiveName }).where("session_id", "=", archive.session_id).where("generation", "=", archive.generation).where("published_at", "is", null)));
	}
	return uniqueTranscriptArchives([...params.requested, ...pendingArchives.map((archive) => ({
		generation: archive.generation,
		sessionId: archive.session_id
	}))]).map((archive) => ({
		agentId: database.agentId,
		archiveDirectory: params.archiveDirectory,
		databasePath: database.path,
		generation: archive.generation,
		sessionId: archive.sessionId
	}));
}
function recordSessionTranscriptArchivePublishResults(database, results, nowMs) {
	ensureSessionTranscriptArchiveSchema(database.db);
	const db = getNodeSqliteKysely(database.db);
	for (const result of results) withSqliteDatabaseWriteScope(database.db, [sqliteSessionIdWriteScope(result.sessionId)], () => executeSqliteQuerySync(database.db, db.updateTable("session_transcript_archives").set((eb) => ({
		last_publish_attempt_at: nowMs,
		last_publish_error: result.error?.slice(0, 1024) ?? null,
		publish_attempts: eb("publish_attempts", "+", 1),
		...result.archivedPath ? { published_at: nowMs } : {}
	})).where("session_id", "=", result.sessionId).where("generation", "=", result.generation)));
}
/** Inserts the canonical archive row inside the lifecycle deletion transaction. */
function persistSessionTranscriptArchive(database, plan) {
	const archive = plan.archive;
	const generation = plan.snapshot.generation;
	const sessionKey = plan.snapshot.sessionKey;
	if (!archive || !generation || !sessionKey) throw new Error(`Cannot persist SQLite transcript archive without an owner generation for ${plan.sessionId}`);
	ensureSessionTranscriptArchiveSchema(database.db);
	const db = getNodeSqliteKysely(database.db);
	if (withSqliteDatabaseWriteScope(database.db, [sqliteSessionIdWriteScope(plan.sessionId)], () => executeSqliteQuerySync(database.db, db.insertInto("session_transcript_archives").values({
		archive_blob: archive.bytes,
		archive_name: archive.archiveName,
		archive_sha256: archive.sha256,
		created_at: archive.createdAt,
		encoding: archive.encoding,
		generation,
		last_publish_attempt_at: null,
		last_publish_error: null,
		published_at: null,
		reason: plan.reason,
		session_id: plan.sessionId,
		session_key: sessionKey
	}).onConflict((conflict) => conflict.columns(["session_id", "generation"]).doNothing()))).numAffectedRows === 1n) return;
	const persisted = executeSqliteQueryTakeFirstSync(database.db, db.selectFrom("session_transcript_archives").select([
		"archive_blob",
		"archive_name",
		"archive_sha256",
		"created_at",
		"encoding",
		"reason",
		"session_key"
	]).where("session_id", "=", plan.sessionId).where("generation", "=", generation));
	if (!persisted || persisted.archive_name !== archive.archiveName || persisted.archive_sha256 !== archive.sha256 || persisted.created_at !== archive.createdAt || persisted.encoding !== archive.encoding || persisted.reason !== plan.reason || persisted.session_key !== sessionKey || !Buffer.from(persisted.archive_blob).equals(Buffer.from(archive.bytes))) throw new Error(`Conflicting SQLite transcript archive for ${plan.sessionId}`);
}
//#endregion
export { readSessionTranscriptArchiveResetInventory as a, uniqueTranscriptArchives as c, prepareSessionTranscriptArchivePublishPlans as i, hasPendingSessionTranscriptArchives as n, recordSessionTranscriptArchivePublishResults as o, persistSessionTranscriptArchive as r, transcriptArchiveIdentityKey as s, deleteAllSessionTranscriptArchivesInTransaction as t };
