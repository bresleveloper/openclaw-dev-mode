import { a as executeSqliteQueryTakeFirstSync, i as executeSqliteQuerySync, p as sql } from "./kysely-sync-9fPQaMlh.mjs";
import { t as coerceRequiredSqliteNumber } from "./sqlite-number-DZt1m75H.mjs";
import { r as runSqliteDeferredTransactionSync } from "./sqlite-transaction-CpDyZPQ0.mjs";
import { t as SessionTranscriptReadFenceError } from "./session-transcript-read-fence-error-DoYPfzaJ.mjs";
import { o as openOpenClawAgentDatabase } from "./openclaw-agent-db-_fC-kf1x.mjs";
import { c as transcriptEventJsonSql } from "./transcript-payload-Cu49oQKq.mjs";
import { i as toDatabaseOptions, t as getSessionKysely } from "./session-accessor.sqlite-scope-helpers-XTtpZpWK.mjs";
import { a as resolveSqliteTranscriptReadScope } from "./session-accessor.sqlite-read-scope-DzGQuOfU.mjs";
import "./session-accessor.sqlite-scope-9ysL95gx.mjs";
import { r as resolveSqliteSessionTranscriptReadFence } from "./session-transcript-read-fence-CgUG4J4j.mjs";
import { n as assertSessionTranscriptHot } from "./session-cold-storage-state-CWFSrppd.mjs";
import { i as transcriptRetainedDataBytesSql, n as projectTranscriptRetainedDataSql } from "./session-transcript-retained-data-hvf1GT7-.mjs";
import { t as getActiveTranscriptKysely } from "./session-accessor.sqlite-projection-read-3DYCwfDO.mjs";
import { t as withCurrentProjectionSnapshot } from "./session-accessor.sqlite-active-projection-BECHzdvs.mjs";
//#region src/config/sessions/session-accessor.sqlite-suffix-read.ts
/** Native adapter for the deprecated synchronous manager and process-held incognito. */
function loadTranscriptSuffixEventsBoundedSync(scope, startSeq, limits) {
	const resolved = resolveSqliteTranscriptReadScope(scope);
	return loadTranscriptSuffixEventsBoundedFromDatabase(openOpenClawAgentDatabase(toDatabaseOptions(resolved)), scope, startSeq, limits);
}
function loadTranscriptSuffixEventsBoundedFromDatabase(database, scope, startSeq, limits) {
	const resolved = resolveSqliteTranscriptReadScope(scope);
	return runSqliteDeferredTransactionSync(database.db, () => {
		assertSessionTranscriptHot(database.db, resolved.sessionId);
		const db = getSessionKysely(database.db);
		const fence = resolveSqliteSessionTranscriptReadFence({
			database,
			...resolved
		});
		if (fence) {
			if (executeSqliteQueryTakeFirstSync(database.db, db.selectFrom("transcript_events").select("seq").where("session_id", "=", resolved.sessionId).where("seq", ">=", fence.beforeRawSeq).limit(1))) throw new SessionTranscriptReadFenceError(`Current-turn transcript admission hides rows needed for suffix mutation: ${fence.admission.entryId}`);
		}
		const metadata = executeSqliteQuerySync(database.db, db.selectFrom("transcript_events").select(["seq", sql`${transcriptRetainedDataBytesSql(database.db, limits.retainedCustomDataIds ?? [])} + 1`.as("serialized_bytes")]).where("session_id", "=", resolved.sessionId).where("seq", ">=", startSeq).orderBy("seq", "asc").limit(limits.maxEvents + 1)).rows;
		if (metadata.length > limits.maxEvents) throw new Error(`Transcript suffix exceeds synchronous planning row limit for ${resolved.sessionId}`);
		let bytes = 0;
		for (const row of metadata) {
			bytes += row.serialized_bytes;
			if (bytes > limits.maxBytes) throw new Error(`Transcript suffix exceeds synchronous planning byte limit for ${resolved.sessionId}`);
		}
		if (metadata.length === 0) return [];
		return executeSqliteQuerySync(database.db, db.selectFrom("transcript_events").select([projectTranscriptRetainedDataSql(database.db, transcriptEventJsonSql(database.db), limits.retainedCustomDataIds ?? []).as("event_json"), "seq"]).where("session_id", "=", resolved.sessionId).where("seq", "in", metadata.map((row) => row.seq)).orderBy("seq", "asc")).rows.map((row) => JSON.parse(row.event_json));
	}, {
		databaseLabel: database.path,
		operationLabel: "bounded transcript suffix read"
	});
}
/** Reads the nearest active indexed event before a raw transcript sequence. */
function readPreviousIndexedTranscriptEventSync(scope, beforeSeq, options = {}) {
	return withCurrentProjectionSnapshot(scope, (projection) => {
		const db = getActiveTranscriptKysely(projection.database);
		const row = executeSqliteQueryTakeFirstSync(projection.database.db, db.selectFrom("transcript_event_identities as identity").innerJoin("session_transcript_active_events as active", (join) => join.onRef("active.session_id", "=", "identity.session_id").onRef("active.event_seq", "=", "identity.seq")).innerJoin("transcript_events as event", (join) => join.onRef("event.session_id", "=", "identity.session_id").onRef("event.seq", "=", "identity.seq")).select([transcriptEventJsonSql(projection.database.db, "event").as("event_json"), "identity.seq"]).where("identity.session_id", "=", projection.resolved.sessionId).where("identity.seq", "<", beforeSeq).orderBy("active.active_position", "desc").limit(1));
		return row ? {
			event: JSON.parse(row.event_json),
			seq: coerceRequiredSqliteNumber(row.seq)
		} : void 0;
	}, options);
}
//#endregion
export { loadTranscriptSuffixEventsBoundedSync as n, readPreviousIndexedTranscriptEventSync as r, loadTranscriptSuffixEventsBoundedFromDatabase as t };
