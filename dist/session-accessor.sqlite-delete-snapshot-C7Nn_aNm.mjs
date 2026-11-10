import { a as executeSqliteQueryTakeFirstSync, o as getNodeSqliteKysely } from "./kysely-sync-9fPQaMlh.mjs";
import { t as coerceRequiredSqliteNumber } from "./sqlite-number-DZt1m75H.mjs";
import { a as readOpenClawAgentDatabaseIdentity } from "./openclaw-agent-db-identity-CnM2kzVa.mjs";
import { i as readSessionColdTranscript } from "./session-cold-storage-state-CWFSrppd.mjs";
//#region src/config/sessions/session-accessor.sqlite-delete-snapshot.ts
function sqliteSessionStateDeleteSnapshotsEqual(left, right) {
	return left.acpParentStreamEventCount === right.acpParentStreamEventCount && left.generation === right.generation && left.lastSeq === right.lastSeq && left.sessionKey === right.sessionKey && left.sessionUpdatedAt === right.sessionUpdatedAt && left.trajectoryLastSeq === right.trajectoryLastSeq && left.transcriptUpdatedAt === right.transcriptUpdatedAt;
}
/** Captures the owner window and canonical child state writable outside the lifecycle queue. */
function readSessionStateDeleteSnapshot(database, sessionId) {
	const db = getNodeSqliteKysely(database);
	const target = db.selectNoFrom((eb) => eb.val(sessionId).as("session_id")).as("target");
	const snapshot = executeSqliteQueryTakeFirstSync(database, db.selectFrom(target).leftJoin("session_windows as window", "window.session_id", "target.session_id").leftJoin("transcript_rewrite_watermarks as watermark", "watermark.session_id", "target.session_id").select([
		"window.session_key",
		"window.transcript_updated_at",
		"window.updated_at",
		"watermark.generation"
	]).select((eb) => [
		eb.selectFrom("transcript_events").select("seq").whereRef("transcript_events.session_id", "=", "target.session_id").orderBy("seq", "desc").limit(1).as("last_seq"),
		eb.selectFrom("trajectory_runtime_events").select("seq").whereRef("trajectory_runtime_events.session_id", "=", "target.session_id").orderBy("seq", "desc").limit(1).as("trajectory_last_seq"),
		eb.selectFrom("acp_parent_stream_events").select((inner) => inner.fn.countAll().as("event_count")).whereRef("acp_parent_stream_events.session_id", "=", "target.session_id").as("acp_parent_stream_event_count")
	]));
	return {
		acpParentStreamEventCount: coerceRequiredSqliteNumber(snapshot?.acp_parent_stream_event_count ?? 0),
		generation: snapshot?.generation ?? null,
		lastSeq: snapshot?.last_seq ?? null,
		sessionKey: snapshot?.session_key ?? null,
		sessionUpdatedAt: snapshot?.updated_at ?? null,
		trajectoryLastSeq: snapshot?.trajectory_last_seq ?? null,
		transcriptUpdatedAt: snapshot?.transcript_updated_at ?? null
	};
}
function planSessionStateDeleteIfUnreferenced(params) {
	if (params.referencedSessionIds.has(params.sessionId) || readSessionColdTranscript(params.database.db, params.sessionId)) return null;
	return {
		agentId: params.database.agentId,
		archiveDirectory: params.archiveDirectory,
		archiveTranscript: params.archiveTranscript !== false && typeof readOpenClawAgentDatabaseIdentity(params.database).identity === "string",
		databasePath: params.database.path,
		reason: params.reason ?? "deleted",
		sessionId: params.sessionId,
		snapshot: readSessionStateDeleteSnapshot(params.database.db, params.sessionId)
	};
}
//#endregion
export { readSessionStateDeleteSnapshot as n, sqliteSessionStateDeleteSnapshotsEqual as r, planSessionStateDeleteIfUnreferenced as t };
