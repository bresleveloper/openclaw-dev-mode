import { a as asOptionalRecord } from "./record-coerce-TIsquoVR.mjs";
import { s as iterateSqliteQuerySync } from "./kysely-sync-9fPQaMlh.mjs";
import { r as runSqliteDeferredTransactionSync } from "./sqlite-transaction-CpDyZPQ0.mjs";
import { c as transcriptEventJsonSql } from "./transcript-payload-Cu49oQKq.mjs";
import { t as getSessionKysely } from "./session-accessor.sqlite-scope-helpers-XTtpZpWK.mjs";
import "./nested-tool-activity-Da7SpARz.mjs";
import { d as readWithCanonicalSessionAdmission } from "./session-canonical-key-B7chVWi3.mjs";
import "./session-accessor.sqlite-scope-9ysL95gx.mjs";
import { p as readSessionEntryRow } from "./session-accessor.sqlite-entry-read-CLHpEbhT.mjs";
import "./session-accessor.sqlite-entry-store-B3Lv6xes.mjs";
import { c as readTranscriptContextVersionInTransaction } from "./session-accessor.sqlite-transcript-state-DCHgVh5P.mjs";
import { C as readTranscriptIdentityByEventId, M as resolveTranscriptMessageAppendParent } from "./session-accessor.sqlite-read-Cx1b3WWI.mjs";
import { r as readPreviousIndexedTranscriptEventSync, t as loadTranscriptSuffixEventsBoundedFromDatabase } from "./session-accessor.sqlite-suffix-read-CVUecbKh.mjs";
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
export { readSessionTranscriptMaintenance };
