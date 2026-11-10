import { a as executeSqliteQueryTakeFirstSync, i as executeSqliteQuerySync } from "./kysely-sync-9fPQaMlh.mjs";
import { f as requestSqliteWorkerOperationAdmission } from "./sqlite-worker-operation-admission-puNZKEvP.mjs";
import { u as runOpenClawStateWriteTransaction } from "./openclaw-state-db-BtDOU_3j.mjs";
import { n as assertOpenClawStateLeaseWorkerOwnedInTransaction } from "./openclaw-state-lease-worker-D3xn0u2j.mjs";
import { i as TranscriptsSummaryChangedError, n as parseTranscriptPendingExports, r as TranscriptSessionConflictError, t as parseTranscriptExportManifest } from "./store-export-state-CLAn-a3x.mjs";
import { a as parseOptionalJsonRecord, f as transcriptSessionInputRevisionFromRow, n as meetingTranscriptDb, p as transcriptSummaryInputRevisionFromRow, r as meetingTranscriptSessionQuery, s as readStoredTranscriptSummaryRevision, t as appendMeetingTranscriptUtterance, u as sessionFromRow, x as transcriptSessionExportKey } from "./store-sqlite-DPxaUsRY.mjs";
import { t as ensureMeetingTranscriptsSchema } from "./sqlite-schema-CrUrQvVo.mjs";
import { n as deriveMeetingTranscriptSummaryColumns, t as deriveMeetingTranscriptSessionColumns } from "./store-columns-DcLtffFO.mjs";
import { n as readTranscriptCanonicalSessionRow, r as readTranscriptExportOwnership } from "./store-sqlite-read-BTMDaIGC.mjs";
//#region src/transcripts/store-sqlite-write.ts
function writeMeetingTranscriptSessionInDatabase(database, params) {
	const { session, sessionValues, now, expectedInputRevision, expectedSessionRevision } = params;
	const previous = executeSqliteQueryTakeFirstSync(database, meetingTranscriptSessionQuery(database, session).selectAll());
	if (expectedInputRevision !== void 0 && (!previous || transcriptSummaryInputRevisionFromRow(previous) !== expectedInputRevision) || expectedSessionRevision !== void 0 && (!previous || transcriptSessionInputRevisionFromRow(previous) !== expectedSessionRevision)) throw new TranscriptsSummaryChangedError();
	const owner = readTranscriptCanonicalSessionRow(database, sessionValues.selector);
	if (owner && (owner.session_id !== session.sessionId || owner.started_at !== session.startedAt)) throw new TranscriptSessionConflictError();
	if (previous) {
		const admittedMetadata = sessionFromRow(previous).metadata;
		let metadata = parseOptionalJsonRecord(sessionValues.metadata_json);
		if (admittedMetadata && Object.hasOwn(admittedMetadata, "sessionIdOrigin")) metadata = {
			...metadata,
			sessionIdOrigin: admittedMetadata.sessionIdOrigin
		};
		else if (metadata) delete metadata.sessionIdOrigin;
		sessionValues.metadata_json = metadata ? JSON.stringify(metadata) : null;
	}
	const values = {
		...sessionValues,
		...deriveMeetingTranscriptSessionColumns(sessionValues.source_json, sessionValues.metadata_json)
	};
	const written = executeSqliteQueryTakeFirstSync(database, meetingTranscriptDb(database).insertInto("meeting_transcript_sessions").values({
		session_id: session.sessionId,
		started_at: session.startedAt,
		...values,
		export_manifest_json: "{}",
		export_pending_json: "[]",
		next_utterance_seq: 0,
		created_at_ms: now,
		updated_at_ms: now
	}).onConflict((conflict) => conflict.columns(["session_id", "started_at"]).doUpdateSet({
		...values,
		updated_at_ms: now
	})).returning([
		"next_utterance_seq",
		"title",
		"source_json",
		"metadata_json",
		"stopped_at"
	]));
	if (!written) throw new Error("Transcript session write did not return its stored revision");
	return {
		inserted: previous === void 0,
		inputRevision: transcriptSummaryInputRevisionFromRow(written),
		sessionRevision: transcriptSessionInputRevisionFromRow(written)
	};
}
function deleteEmptyMeetingTranscriptCandidateInDatabase(database, session, expectedInputRevision) {
	const stored = executeSqliteQueryTakeFirstSync(database, meetingTranscriptSessionQuery(database, session).selectAll());
	if (!stored || stored.stopped_at === null || transcriptSummaryInputRevisionFromRow(stored) !== expectedInputRevision || stored.next_utterance_seq !== 0 || stored.export_manifest_json !== "{}" || stored.export_pending_json !== "[]") return;
	const db = meetingTranscriptDb(database);
	executeSqliteQuerySync(database, db.deleteFrom("meeting_transcript_sessions").where("session_id", "=", session.sessionId).where("started_at", "=", session.startedAt).where((eb) => eb.not(eb.exists(db.selectFrom("meeting_transcript_summaries").select("session_id").where("session_id", "=", session.sessionId).where("session_started_at", "=", session.startedAt)))));
}
function writeMeetingTranscriptSummaryInDatabase(database, session, summaryValues, guard) {
	if (guard) {
		const row = executeSqliteQueryTakeFirstSync(database, meetingTranscriptSessionQuery(database, session).selectAll());
		if (!row || guard.allowAppends && row.stopped_at !== null || row.next_utterance_seq < guard.nextSequence || transcriptSummaryInputRevisionFromRow({
			...row,
			...guard.allowAppends ? { next_utterance_seq: guard.nextSequence } : {}
		}) !== guard.inputRevision || (readStoredTranscriptSummaryRevision(database, session) ?? "") !== guard.summaryRevision) throw new TranscriptsSummaryChangedError();
	}
	const values = {
		...summaryValues,
		...deriveMeetingTranscriptSummaryColumns(summaryValues.summary_json)
	};
	executeSqliteQuerySync(database, meetingTranscriptDb(database).insertInto("meeting_transcript_summaries").values({
		session_id: session.sessionId,
		session_started_at: session.startedAt,
		...values
	}).onConflict((conflict) => conflict.columns(["session_id", "session_started_at"]).doUpdateSet(values)));
}
function updateMeetingTranscriptExportState(database, session, update) {
	const stored = readTranscriptExportOwnership(database, session);
	executeSqliteQuerySync(database, meetingTranscriptDb(database).updateTable("meeting_transcript_sessions").set(update(stored)).where("session_id", "=", session.sessionId).where("started_at", "=", session.startedAt));
}
function updateMeetingTranscriptExportManifestInDatabase(database, session, exportedHashes, removedExports) {
	updateMeetingTranscriptExportState(database, session, (stored) => {
		const manifest = stored ? parseTranscriptExportManifest(stored.export_manifest_json) : {};
		const pending = stored ? parseTranscriptPendingExports(stored.export_pending_json) : /* @__PURE__ */ new Set();
		for (const fileName of removedExports) delete manifest[fileName];
		for (const fileName of [...Object.keys(exportedHashes), ...removedExports]) pending.delete(fileName);
		return {
			export_manifest_json: JSON.stringify({
				...manifest,
				...exportedHashes
			}),
			export_pending_json: JSON.stringify([...pending].toSorted())
		};
	});
}
function markMeetingTranscriptPendingExportsInDatabase(database, session, fileNames) {
	updateMeetingTranscriptExportState(database, session, (stored) => {
		if (!stored) throw new Error(`transcripts session not found: ${session.sessionId}`);
		const pending = parseTranscriptPendingExports(stored.export_pending_json);
		for (const fileName of fileNames) pending.add(fileName);
		return { export_pending_json: JSON.stringify([...pending].toSorted()) };
	});
}
//#endregion
//#region src/transcripts/store-worker-write.ts
function writeTranscript(input, { open, stateOptions }, operationLabel, write, exportInput) {
	const options = {
		database: open(),
		...stateOptions(),
		readOnly: input.readOnly
	};
	ensureMeetingTranscriptsSchema(options);
	return runOpenClawStateWriteTransaction(({ db }) => {
		const assertWrite = (stage) => {
			if (exportInput?.lease) {
				const { lease, session } = exportInput;
				if (lease.scope !== "meeting-transcript.export" || lease.key !== transcriptSessionExportKey(session)) throw new Error("Transcript export lease does not match its session");
				assertOpenClawStateLeaseWorkerOwnedInTransaction(db, lease);
			} else requestSqliteWorkerOperationAdmission({
				stage,
				facts: void 0
			});
		};
		assertWrite("transaction");
		const result = write(db);
		assertWrite("commit");
		return result;
	}, options, { operationLabel });
}
const transcriptWriteOperations = {
	"transcripts.append": (input, context) => writeTranscript(input, context, "meeting-transcripts.utterance.append", (db) => appendMeetingTranscriptUtterance({
		...input,
		database: db
	})),
	"transcripts.writeSummary": (input, context) => {
		try {
			writeTranscript(input, context, "meeting-transcripts.summary.write", (db) => writeMeetingTranscriptSummaryInDatabase(db, input.session, input.summaryValues, input.guard));
			return { ok: true };
		} catch (error) {
			if (error instanceof TranscriptsSummaryChangedError) return {
				ok: false,
				reason: "changed"
			};
			throw error;
		}
	},
	"transcripts.writeSession": (input, context) => {
		try {
			return {
				ok: true,
				...writeTranscript(input, context, "meeting-transcripts.session.write", (db) => writeMeetingTranscriptSessionInDatabase(db, input))
			};
		} catch (error) {
			if (error instanceof TranscriptsSummaryChangedError) return {
				ok: false,
				reason: "changed"
			};
			if (error instanceof TranscriptSessionConflictError) return {
				ok: false,
				reason: "conflict"
			};
			throw error;
		}
	},
	"transcripts.deleteEmptySessionCandidate": (input, context) => writeTranscript(input, context, "meeting-transcripts.session.discard-empty", (db) => deleteEmptyMeetingTranscriptCandidateInDatabase(db, input.session, input.expectedInputRevision)),
	"transcripts.markPendingExports": (input, context) => writeTranscript(input, context, "meeting-transcripts.export.pending", (db) => markMeetingTranscriptPendingExportsInDatabase(db, input.session, input.fileNames), input),
	"transcripts.recordExportManifest": (input, context) => writeTranscript(input, context, "meeting-transcripts.export.record", (db) => updateMeetingTranscriptExportManifestInDatabase(db, input.session, input.exportedHashes, new Set(input.removedExports)), input)
};
//#endregion
export { transcriptWriteOperations };
