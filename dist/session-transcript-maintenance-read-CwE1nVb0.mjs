import { a as asOptionalRecord } from "./record-coerce-TIsquoVR.mjs";
import { d as sql, i as executeSqliteQueryTakeFirstSync, o as iterateSqliteQuerySync, r as executeSqliteQuerySync } from "./kysely-sync-K7ftY-g4.mjs";
import { r as runSqliteDeferredTransactionSync } from "./sqlite-transaction-DsZ3X6nD.mjs";
import { t as coerceRequiredSqliteNumber } from "./sqlite-number-DZt1m75H.mjs";
import { s as openOpenClawAgentDatabase } from "./openclaw-agent-db-DBug3LUA.mjs";
import { s as transcriptEventJsonSql } from "./transcript-payload-Yc_w8Yx5.mjs";
import { i as toDatabaseOptions, t as getSessionKysely } from "./session-accessor.sqlite-scope-helpers-DOK3pvYX.mjs";
import { u as resolveSqliteTranscriptReadScope } from "./session-accessor.sqlite-scope-CdpbxR_m.mjs";
import { u as readWithCanonicalSessionAdmission } from "./session-canonical-key-D1TSJMmX.mjs";
import { l as readSessionEntryRow } from "./session-accessor.sqlite-entry-read-CWTZjXLR.mjs";
import { n as assertSessionTranscriptHot } from "./session-cold-storage-state-CzcE3h3O.mjs";
import { i as resolveSqliteSessionTranscriptReadFence, t as SessionTranscriptReadFenceError } from "./session-transcript-read-fence-DfxRHzep.mjs";
import "./session-accessor.sqlite-entry-store-BnbK5FTE.mjs";
import "./nested-tool-activity-CFIuxE4G.mjs";
import { s as readTranscriptContextVersionInTransaction } from "./session-accessor.sqlite-transcript-state-xJ1TJ9j2.mjs";
import { b as readTranscriptIdentityByEventId, j as resolveTranscriptMessageAppendParent } from "./session-accessor.sqlite-read-D4vZepQN.mjs";
import { i as transcriptRetainedDataBytesSql, n as projectTranscriptRetainedDataSql } from "./session-transcript-retained-data-31r579xq.mjs";
import { t as getActiveTranscriptKysely } from "./session-accessor.sqlite-projection-read-Daj5_oBL.mjs";
import { t as withCurrentProjectionSnapshot } from "./session-accessor.sqlite-active-projection-DuXjRl_f.mjs";
//#region src/config/sessions/session-accessor.sqlite-suffix-read.ts
/** Loads one raw suffix only after SQL-side row and byte bounds are proven. */
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
		const metadata = executeSqliteQuerySync(database.db, db.selectFrom("transcript_events").select(["seq", sql`${transcriptRetainedDataBytesSql(limits.retainedCustomDataIds ?? [])} + 1`.as("serialized_bytes")]).where("session_id", "=", resolved.sessionId).where("seq", ">=", startSeq).orderBy("seq", "asc").limit(limits.maxEvents + 1)).rows;
		if (metadata.length > limits.maxEvents) throw new Error(`Transcript suffix exceeds synchronous planning row limit for ${resolved.sessionId}`);
		let bytes = 0;
		for (const row of metadata) {
			bytes += row.serialized_bytes;
			if (bytes > limits.maxBytes) throw new Error(`Transcript suffix exceeds synchronous planning byte limit for ${resolved.sessionId}`);
		}
		if (metadata.length === 0) return [];
		const rows = executeSqliteQuerySync(database.db, db.selectFrom("transcript_events").select([projectTranscriptRetainedDataSql(transcriptEventJsonSql(database.db), limits.retainedCustomDataIds ?? []).as("event_json"), "seq"]).where("session_id", "=", resolved.sessionId).where("seq", "in", metadata.map((row) => row.seq)).orderBy("seq", "asc")).rows;
		if (rows.length !== metadata.length || rows.some((row, index) => row.seq !== metadata[index]?.seq)) throw new Error(`SQLite transcript changed while reading suffix for ${resolved.sessionId}`);
		return rows.map((row) => JSON.parse(row.event_json));
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
//#region src/config/sessions/session-transcript-maintenance-read.ts
function readSessionTranscriptMaintenance(database, target, request) {
	if (request.operation === "previous") return {
		kind: "transcript-maintenance",
		previous: readPreviousIndexedTranscriptEventSync(target, request.beforeSeq, { readOnly: true })?.event
	};
	if (request.operation === "suffix") return {
		kind: "transcript-maintenance",
		events: loadTranscriptSuffixEventsBoundedFromDatabase(database, target, request.startSeq, request)
	};
	if (request.operation === "nested-activity") return readWithCanonicalSessionAdmission(database, () => runSqliteDeferredTransactionSync(database.db, () => {
		const first = readTranscriptIdentityByEventId(database, target.sessionId, request.firstEntryId);
		const last = readTranscriptIdentityByEventId(database, target.sessionId, request.lastEntryId);
		if (!first || !last || first.seq > last.seq) throw new Error("Accepted nested tool activity is no longer available");
		const rows = iterateSqliteQuerySync(database.db, getSessionKysely(database.db).selectFrom("transcript_events").select(transcriptEventJsonSql(database.db).as("event_json")).where("session_id", "=", target.sessionId).where("seq", ">=", first.seq).where("seq", "<=", last.seq).orderBy("seq", "asc"));
		const events = [];
		for (const row of rows) {
			const event = JSON.parse(row.event_json);
			const message = asOptionalRecord(asOptionalRecord(event)?.message);
			if (message?.customType === "openclaw.nested-tool.v1" && asOptionalRecord(message.details)?.scopeId === request.scopeId) events.push(event);
		}
		return {
			kind: "transcript-maintenance",
			events
		};
	}));
	return readWithCanonicalSessionAdmission(database, () => runSqliteDeferredTransactionSync(database.db, () => request.operation === "identity" ? {
		kind: "transcript-maintenance",
		seq: readTranscriptIdentityByEventId(database, target.sessionId, request.eventId)?.seq
	} : {
		kind: "transcript-maintenance",
		version: readTranscriptContextVersionInTransaction(database, target.sessionId),
		lifecycleRevision: readSessionEntryRow(database, target.sessionKey)?.entry.lifecycleRevision,
		appendParentId: resolveTranscriptMessageAppendParent(database, target.sessionId, {})
	}, {
		databaseLabel: database.path,
		operationLabel: "session transcript maintenance read"
	}));
}
//#endregion
export { loadTranscriptSuffixEventsBoundedSync as n, readPreviousIndexedTranscriptEventSync as r, readSessionTranscriptMaintenance as t };
