import { n as createSqliteQueryCache, u as prepareSqliteQueryTakeFirstSync } from "./kysely-sync-9fPQaMlh.mjs";
import { o as openOpenClawAgentDatabase } from "./openclaw-agent-db-_fC-kf1x.mjs";
import { i as toDatabaseOptions, t as getSessionKysely } from "./session-accessor.sqlite-scope-helpers-XTtpZpWK.mjs";
import { a as resolveSqliteTranscriptReadScope } from "./session-accessor.sqlite-read-scope-DzGQuOfU.mjs";
import "./session-accessor.sqlite-scope-9ysL95gx.mjs";
import { u as readTranscriptMutationStateInTransaction } from "./session-accessor.sqlite-transcript-state-DCHgVh5P.mjs";
//#region src/config/sessions/session-accessor.sqlite-metadata-read.ts
const transcriptPresenceQuery = createSqliteQueryCache((database) => {
	const db = getSessionKysely(database);
	return prepareSqliteQueryTakeFirstSync(database, (parameter) => {
		const sessionId = parameter((value) => value);
		return db.selectFrom("transcript_events").select("session_id").where("session_id", "=", sessionId).unionAll(db.selectFrom("session_transcript_cold_archives").select("session_id").where("session_id", "=", sessionId)).limit(1);
	});
});
/** Reads physical transcript presence without decoding events or restoring cold storage. */
function hasSessionTranscriptEventsSync(scope) {
	const resolved = resolveSqliteTranscriptReadScope(scope);
	const database = openOpenClawAgentDatabase(toDatabaseOptions(resolved));
	return Boolean(transcriptPresenceQuery(database.db)(resolved.sessionId));
}
/** Physical presence and freshness share the caller's read transaction; neither scans events. */
function readSessionTranscriptMetadataInDatabase(database, sessionId) {
	return {
		present: Boolean(transcriptPresenceQuery(database.db)(sessionId)),
		...readTranscriptMutationStateInTransaction(database, sessionId)
	};
}
/** Reads both physical mutation fences from the same session window snapshot. */
function readTranscriptMutationStateSync(scope) {
	const resolved = resolveSqliteTranscriptReadScope(scope);
	const database = openOpenClawAgentDatabase(toDatabaseOptions(resolved));
	return readTranscriptMutationStateInTransaction(database, resolved.sessionId);
}
/** Reads only the current transcript mutation fence without parsing transcript rows. */
function readTranscriptMutationAtSync(scope) {
	return readTranscriptMutationStateSync(scope).updatedAt;
}
//#endregion
export { readTranscriptMutationStateSync as i, readSessionTranscriptMetadataInDatabase as n, readTranscriptMutationAtSync as r, hasSessionTranscriptEventsSync as t };
