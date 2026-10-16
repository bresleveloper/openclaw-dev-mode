import { i as executeSqliteQueryTakeFirstSync, r as executeSqliteQuerySync } from "./kysely-sync-K7ftY-g4.mjs";
import { i as requestSqliteWorkerOperationAdmission } from "./sqlite-worker-operation-admission-cNGSH5v0.mjs";
import { l as runOpenClawStateWriteTransaction } from "./openclaw-state-db-D1jWDzK3.mjs";
import { n as assertOpenClawStateLeaseWorkerOwnedInTransaction } from "./openclaw-state-lease-worker-Bfyut3YB.mjs";
import { f as TranscriptSessionConflictError, l as transcriptSessionExportKey, n as parseTranscriptPendingExports, p as TranscriptsSummaryChangedError, t as parseTranscriptExportManifest } from "./store-export-state-CqLuFbIn.mjs";
import { a as parseOptionalJsonRecord, c as readTranscriptSummaryInputRevision, f as transcriptSummaryInputRevisionFromRow, m as ensureMeetingTranscriptsSchema, n as meetingTranscriptDb, r as meetingTranscriptSessionQuery, s as readStoredTranscriptSummaryRevision, t as appendMeetingTranscriptUtterance, u as sessionFromRow } from "./store-sqlite-BeM5GyX_.mjs";
import { n as readTranscriptCanonicalSessionRow, r as readTranscriptExportOwnership } from "./store-sqlite-read-BdWiODCu.mjs";
//#region src/transcripts/store-sqlite-write.ts
function assertMeetingTranscriptSelectorAvailableInDatabase(database, session, selector) {
	const owner = readTranscriptCanonicalSessionRow(database, selector);
	if (owner && (owner.session_id !== session.sessionId || owner.started_at !== session.startedAt)) throw new TranscriptSessionConflictError();
}
function writeMeetingTranscriptSessionInDatabase(database, params) {
	const { session, sessionValues, now, expectedInputRevision } = params;
	if (expectedInputRevision !== void 0 && readTranscriptSummaryInputRevision(database, session) !== expectedInputRevision) throw new TranscriptsSummaryChangedError();
	assertMeetingTranscriptSelectorAvailableInDatabase(database, session, sessionValues.selector);
	const previous = executeSqliteQueryTakeFirstSync(database, meetingTranscriptSessionQuery(database, session).selectAll());
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
	executeSqliteQuerySync(database, meetingTranscriptDb(database).insertInto("meeting_transcript_sessions").values({
		session_id: session.sessionId,
		started_at: session.startedAt,
		...sessionValues,
		export_manifest_json: "{}",
		export_pending_json: "[]",
		next_utterance_seq: 0,
		created_at_ms: now,
		updated_at_ms: now
	}).onConflict((conflict) => conflict.columns(["session_id", "started_at"]).doUpdateSet({
		...sessionValues,
		updated_at_ms: now
	})));
}
function writeMeetingTranscriptSummaryInDatabase(database, session, summaryValues, guard) {
	if (guard) {
		const row = executeSqliteQueryTakeFirstSync(database, meetingTranscriptSessionQuery(database, session).selectAll());
		if (!row || guard.allowAppends && row.stopped_at !== null || row.next_utterance_seq < guard.nextSequence || transcriptSummaryInputRevisionFromRow({
			...row,
			...guard.allowAppends ? { next_utterance_seq: guard.nextSequence } : {}
		}) !== guard.inputRevision || (readStoredTranscriptSummaryRevision(database, session) ?? "") !== guard.summaryRevision) throw new TranscriptsSummaryChangedError();
	}
	executeSqliteQuerySync(database, meetingTranscriptDb(database).insertInto("meeting_transcript_summaries").values({
		session_id: session.sessionId,
		session_started_at: session.startedAt,
		...summaryValues
	}).onConflict((conflict) => conflict.columns(["session_id", "session_started_at"]).doUpdateSet(summaryValues)));
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
	runOpenClawStateWriteTransaction(({ db }) => {
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
		write(db);
		assertWrite("commit");
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
			writeTranscript(input, context, "meeting-transcripts.session.write", (db) => writeMeetingTranscriptSessionInDatabase(db, input));
			return { ok: true };
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
	"transcripts.markPendingExports": (input, context) => writeTranscript(input, context, "meeting-transcripts.export.pending", (db) => markMeetingTranscriptPendingExportsInDatabase(db, input.session, input.fileNames), input),
	"transcripts.recordExportManifest": (input, context) => writeTranscript(input, context, "meeting-transcripts.export.record", (db) => updateMeetingTranscriptExportManifestInDatabase(db, input.session, input.exportedHashes, new Set(input.removedExports)), input)
};
//#endregion
export { transcriptWriteOperations };
