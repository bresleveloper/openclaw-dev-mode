import { a as asOptionalRecord } from "./record-coerce-TIsquoVR.mjs";
import { a as getNodeSqliteKysely, i as executeSqliteQueryTakeFirstSync, r as executeSqliteQuerySync } from "./kysely-sync-K7ftY-g4.mjs";
import { n as sha256Hex } from "./node-crypto-BG4u3UnX.mjs";
import { t as createOpenClawStateSchemaEnsurer } from "./openclaw-state-feature-schema-gpylD4Gq.mjs";
import { toUSVString } from "node:util";
//#region src/transcripts/sqlite-schema.ts
const ensureMeetingTranscriptsSchema = createOpenClawStateSchemaEnsurer({
	table: "meeting_transcript_sessions",
	endMarker: "  CHECK (summary_json IS NOT NULL OR markdown IS NOT NULL)\n) STRICT;\n",
	operationLabel: "meeting-transcripts.schema.ensure"
});
//#endregion
//#region src/transcripts/store-sqlite.ts
function meetingTranscriptDb(db) {
	return getNodeSqliteKysely(db);
}
function meetingTranscriptSessionQuery(database, session) {
	return meetingTranscriptDb(database).selectFrom("meeting_transcript_sessions").where("session_id", "=", session.sessionId).where("started_at", "=", session.startedAt);
}
function transcriptSummaryInputRevisionFromRow(row) {
	return JSON.stringify({
		next_utterance_seq: row.next_utterance_seq,
		title: row.title,
		source_json: row.source_json,
		metadata_json: row.metadata_json,
		stopped_at: row.stopped_at
	});
}
function readTranscriptSummaryInputRevision(database, session) {
	const row = executeSqliteQueryTakeFirstSync(database, meetingTranscriptSessionQuery(database, session).select([
		"next_utterance_seq",
		"title",
		"source_json",
		"metadata_json",
		"stopped_at"
	]));
	return row ? transcriptSummaryInputRevisionFromRow(row) : void 0;
}
function readStoredTranscriptSummaryRevision(database, session) {
	const row = executeSqliteQueryTakeFirstSync(database, meetingTranscriptDb(database).selectFrom("meeting_transcript_summaries").select([
		"generated_at",
		"summary_json",
		"markdown",
		"utterance_count"
	]).where("session_id", "=", session.sessionId).where("session_started_at", "=", session.startedAt));
	return row ? sha256Hex(JSON.stringify(row)) : void 0;
}
function readTranscriptSummaryKeys(database) {
	const rows = executeSqliteQuerySync(database, meetingTranscriptDb(database).selectFrom("meeting_transcript_summaries").select(["session_id", "session_started_at"])).rows;
	return new Set(rows.map((row) => `${row.session_id}\0${row.session_started_at}`));
}
function readRecentStoppedTranscriptSession(database, source, stoppedAfter, stoppedBefore) {
	const row = executeSqliteQueryTakeFirstSync(database, meetingTranscriptDb(database).selectFrom("meeting_transcript_sessions").selectAll().where("provider_id", "=", source.providerId).where("stopped_at", ">=", stoppedAfter).where("stopped_at", "<=", stoppedBefore).where((eb) => eb.and([
		"accountId",
		"guildId",
		"channelId",
		"meetingUrl",
		"threadTs",
		"fileId"
	].map((key) => eb(eb.fn("json_extract", [eb.ref("source_json"), eb.val(`$.${key}`)]), source[key] === void 0 ? "is" : "=", source[key] ?? null)))).orderBy("stopped_at", "desc").orderBy("started_at", "desc").orderBy("session_id", "asc").limit(1));
	return row ? {
		session: sessionFromRow(row),
		inputRevision: transcriptSummaryInputRevisionFromRow(row)
	} : void 0;
}
function meetingTranscriptUtteranceQuery(database, session) {
	return meetingTranscriptDb(database).selectFrom("meeting_transcript_utterances").where("session_id", "=", session.sessionId).where("session_started_at", "=", session.startedAt);
}
function appendMeetingTranscriptUtterance(params) {
	const { database, session, utterance } = params;
	const db = meetingTranscriptDb(database);
	if (utterance.id && ![
		utterance.startedAt,
		utterance.endedAt,
		utterance.speaker?.id,
		utterance.speaker?.label,
		utterance.text
	].some((value) => value != null && toUSVString(value) !== value) && executeSqliteQueryTakeFirstSync(database, meetingTranscriptUtteranceQuery(database, session).select("sequence").where("utterance_id", "=", utterance.id).where("started_at", "is", utterance.startedAt ?? null).where("ended_at", "is", utterance.endedAt ?? null).where("speaker_id", "is", utterance.speaker?.id ?? null).where("speaker_label", "is", utterance.speaker?.label ?? null).where("text", "=", utterance.text).where("final", "is", utterance.final === void 0 ? null : utterance.final ? 1 : 0).where("metadata_json", "is", params.metadataJson).limit(1))) return;
	const stored = executeSqliteQueryTakeFirstSync(database, meetingTranscriptSessionQuery(database, session).select("next_utterance_seq"));
	if (!stored) throw new Error(`transcripts session not found: ${session.sessionId}`);
	const sequence = stored.next_utterance_seq;
	executeSqliteQuerySync(database, db.insertInto("meeting_transcript_utterances").values({
		session_id: session.sessionId,
		session_started_at: session.startedAt,
		sequence,
		utterance_id: utterance.id ?? null,
		started_at: utterance.startedAt ?? null,
		ended_at: utterance.endedAt ?? null,
		speaker_id: utterance.speaker?.id ?? null,
		speaker_label: utterance.speaker?.label ?? null,
		text: utterance.text,
		final: utterance.final === void 0 ? null : utterance.final ? 1 : 0,
		metadata_json: params.metadataJson
	}));
	executeSqliteQuerySync(database, db.updateTable("meeting_transcript_sessions").set({
		next_utterance_seq: sequence + 1,
		updated_at_ms: params.now
	}).where("session_id", "=", session.sessionId).where("started_at", "=", session.startedAt));
}
function parseOptionalJsonRecord(value) {
	if (!value) return;
	return asOptionalRecord(JSON.parse(value));
}
function sessionFromRow(row) {
	const source = parseOptionalJsonRecord(row.source_json);
	const metadata = parseOptionalJsonRecord(row.metadata_json);
	if (!source || typeof source.providerId !== "string") throw new Error(`invalid meeting transcript source for ${row.session_id}`);
	return {
		sessionId: row.session_id,
		source,
		startedAt: row.started_at,
		...row.title !== null ? { title: row.title } : {},
		...row.stopped_at !== null ? { stoppedAt: row.stopped_at } : {},
		...metadata ? { metadata } : {}
	};
}
function utteranceFromRow(row) {
	const speaker = row.speaker_label !== null ? {
		label: row.speaker_label,
		...row.speaker_id !== null ? { id: row.speaker_id } : {}
	} : void 0;
	const metadata = parseOptionalJsonRecord(row.metadata_json);
	return {
		sessionId: row.session_id,
		text: row.text,
		...row.utterance_id !== null ? { id: row.utterance_id } : {},
		...row.started_at !== null ? { startedAt: row.started_at } : {},
		...row.ended_at !== null ? { endedAt: row.ended_at } : {},
		...speaker ? { speaker } : {},
		...row.final === null ? {} : { final: row.final === 1 },
		...metadata ? { metadata } : {}
	};
}
function summaryFromRow(row) {
	return row.summary_json ? JSON.parse(row.summary_json) : void 0;
}
//#endregion
export { parseOptionalJsonRecord as a, readTranscriptSummaryInputRevision as c, summaryFromRow as d, transcriptSummaryInputRevisionFromRow as f, meetingTranscriptUtteranceQuery as i, readTranscriptSummaryKeys as l, ensureMeetingTranscriptsSchema as m, meetingTranscriptDb as n, readRecentStoppedTranscriptSession as o, utteranceFromRow as p, meetingTranscriptSessionQuery as r, readStoredTranscriptSummaryRevision as s, appendMeetingTranscriptUtterance as t, sessionFromRow as u };
