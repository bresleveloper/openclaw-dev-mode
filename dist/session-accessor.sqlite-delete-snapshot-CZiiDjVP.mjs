import { i as getNodeSqliteKysely, r as executeSqliteQueryTakeFirstSync } from "./kysely-sync-Bn6Qrpbz.mjs";
import { t as coerceRequiredSqliteNumber } from "./sqlite-number-DM1AypRG.mjs";
//#region src/config/sessions/session-accessor.sqlite-delete-snapshot.ts
function sqliteSessionStateDeleteSnapshotsEqual(left, right) {
	return left.acpParentStreamEventCount === right.acpParentStreamEventCount && left.generation === right.generation && left.lastSeq === right.lastSeq && left.sessionKey === right.sessionKey && left.sessionUpdatedAt === right.sessionUpdatedAt && left.trajectoryLastSeq === right.trajectoryLastSeq && left.transcriptUpdatedAt === right.transcriptUpdatedAt;
}
/** Captures the owner window and canonical child state writable outside the lifecycle queue. */
function readSessionStateDeleteSnapshot(database, sessionId) {
	const db = getNodeSqliteKysely(database);
	const window = executeSqliteQueryTakeFirstSync(database, db.selectFrom("session_windows").select([
		"session_key",
		"transcript_updated_at",
		"updated_at"
	]).where("session_id", "=", sessionId));
	const rewriteWatermark = executeSqliteQueryTakeFirstSync(database, db.selectFrom("transcript_rewrite_watermarks").select("generation").where("session_id", "=", sessionId));
	const lastEvent = executeSqliteQueryTakeFirstSync(database, db.selectFrom("transcript_events").select("seq").where("session_id", "=", sessionId).orderBy("seq", "desc").limit(1));
	const lastTrajectory = executeSqliteQueryTakeFirstSync(database, db.selectFrom("trajectory_runtime_events").select("seq").where("session_id", "=", sessionId).orderBy("seq", "desc").limit(1));
	const acpParentStream = executeSqliteQueryTakeFirstSync(database, db.selectFrom("acp_parent_stream_events").select((eb) => eb.fn.countAll().as("event_count")).where("session_id", "=", sessionId));
	return {
		acpParentStreamEventCount: coerceRequiredSqliteNumber(acpParentStream?.event_count ?? 0),
		generation: rewriteWatermark?.generation ?? null,
		lastSeq: lastEvent?.seq ?? null,
		sessionKey: window?.session_key ?? null,
		sessionUpdatedAt: window?.updated_at ?? null,
		trajectoryLastSeq: lastTrajectory?.seq ?? null,
		transcriptUpdatedAt: window?.transcript_updated_at ?? null
	};
}
//#endregion
export { sqliteSessionStateDeleteSnapshotsEqual as n, readSessionStateDeleteSnapshot as t };
