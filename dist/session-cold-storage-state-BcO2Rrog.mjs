import { i as getNodeSqliteKysely, s as prepareSqliteQuerySync } from "./kysely-sync-Bn6Qrpbz.mjs";
//#region src/config/sessions/session-cold-storage-state.ts
function createColdTranscriptQueries(db) {
	const kysely = getNodeSqliteKysely(db);
	return {
		metadata: prepareSqliteQuerySync(db, (parameter) => kysely.selectFrom("session_transcript_cold_archives").select([
			"session_id",
			"generation",
			"archive_name",
			"archive_sha256",
			"event_count",
			"raw_bytes",
			"archive_bytes",
			"last_seq",
			"archived_at",
			"storage"
		]).where("session_id", "=", parameter((sessionId) => sessionId))),
		marker: prepareSqliteQuerySync(db, (parameter) => kysely.selectFrom("session_transcript_cold_archives").select("session_id").where("session_id", "=", parameter((sessionId) => sessionId)))
	};
}
const coldTranscriptQueries = /* @__PURE__ */ new WeakMap();
function getColdTranscriptQueries(db) {
	let queries = coldTranscriptQueries.get(db);
	if (!queries) {
		queries = createColdTranscriptQueries(db);
		coldTranscriptQueries.set(db, queries);
	}
	return queries;
}
function readSessionColdTranscript(db, sessionId) {
	return getColdTranscriptQueries(db).metadata(sessionId).rows[0];
}
var SessionTranscriptColdError = class extends Error {
	constructor(sessionId) {
		super(`Transcript ${sessionId} is in cold storage. Restore its archive before reading or changing the transcript.`);
		this.sessionId = sessionId;
		this.code = "TRANSCRIPT_COLD";
		this.name = "SessionTranscriptColdError";
	}
};
function assertSessionTranscriptHot(db, sessionId) {
	if (getColdTranscriptQueries(db).marker(sessionId).rows.length > 0) throw new SessionTranscriptColdError(sessionId);
}
//#endregion
export { assertSessionTranscriptHot as n, readSessionColdTranscript as r, SessionTranscriptColdError as t };
