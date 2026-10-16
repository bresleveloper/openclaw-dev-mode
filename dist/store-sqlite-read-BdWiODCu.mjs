import { N as resolveOptionalIntegerOption } from "./number-coercion-CuVhdCBs.mjs";
import { c as prepareSqliteQuerySync, i as executeSqliteQueryTakeFirstSync, l as prepareSqliteQueryTakeFirstSync, n as createSqliteQueryCache, o as iterateSqliteQuerySync, r as executeSqliteQuerySync } from "./kysely-sync-K7ftY-g4.mjs";
import { d as summaryFromRow, f as transcriptSummaryInputRevisionFromRow, i as meetingTranscriptUtteranceQuery, l as readTranscriptSummaryKeys, n as meetingTranscriptDb, p as utteranceFromRow, r as meetingTranscriptSessionQuery, s as readStoredTranscriptSummaryRevision, u as sessionFromRow } from "./store-sqlite-BeM5GyX_.mjs";
import { createHash } from "node:crypto";
//#region src/transcripts/store-sqlite-read.ts
function readTranscriptCanonicalSessionRow(database, selector) {
	return executeSqliteQueryTakeFirstSync(database, meetingTranscriptDb(database).selectFrom("meeting_transcript_sessions").selectAll().where("selector", "=", selector));
}
function readTranscriptExportOwnership(database, session) {
	return executeSqliteQueryTakeFirstSync(database, meetingTranscriptSessionQuery(database, session).select(["export_manifest_json", "export_pending_json"]));
}
function readTranscriptExportPathCollisions(database, exportKey) {
	return executeSqliteQuerySync(database, meetingTranscriptDb(database).selectFrom("meeting_transcript_sessions").select([
		"session_id",
		"started_at",
		"selector",
		"export_pending_json"
	]).where("export_key", "=", exportKey).orderBy("selector", "asc")).rows;
}
function readTranscriptExportPathOwners(database, exportKey) {
	return executeSqliteQuerySync(database, meetingTranscriptDb(database).selectFrom("meeting_transcript_sessions").select([
		"session_id",
		"started_at",
		"export_manifest_json",
		"export_pending_json"
	]).where("export_key", "=", exportKey).orderBy("selector", "asc")).rows;
}
const summarySnapshotQuery = createSqliteQueryCache((database) => prepareSqliteQueryTakeFirstSync(database, (parameter) => meetingTranscriptDb(database).selectFrom("meeting_transcript_sessions").where("session_id", "=", parameter((value) => value.sessionId)).where("started_at", "=", parameter((value) => value.startedAt)).select([
	"next_utterance_seq",
	"title",
	"source_json",
	"metadata_json",
	"stopped_at",
	"created_at_ms",
	"updated_at_ms"
])));
/** Runs inside the read worker's transaction so input and replacement basis agree. */
function readTranscriptSummarySnapshot(database, session, maxUtterances) {
	const row = summarySnapshotQuery(database)(session);
	if (!row) return;
	const summaryRevision = readStoredTranscriptSummaryRevision(database, session);
	return {
		inputRevision: transcriptSummaryInputRevisionFromRow(row),
		nextSequence: row.next_utterance_seq,
		stoppedAt: row.stopped_at ?? void 0,
		summaryRevision: summaryRevision ?? "",
		utterances: readTranscriptUtterances(database, session, maxUtterances)
	};
}
function readTranscriptSessionEntries(database) {
	const rows = executeSqliteQuerySync(database, meetingTranscriptDb(database).selectFrom("meeting_transcript_sessions").selectAll().orderBy("started_at", "desc").orderBy("session_id", "asc")).rows;
	const summaryKeys = readTranscriptSummaryKeys(database);
	return rows.map((row) => ({
		session: sessionFromRow(row),
		selector: row.selector,
		hasSummary: summaryKeys.has(`${row.session_id}\0${row.started_at}`)
	}));
}
const sessionMatchQueries = createSqliteQueryCache(createTranscriptSessionMatchQueries);
function createTranscriptSessionMatchQueries(database) {
	const query = meetingTranscriptDb(database).selectFrom("meeting_transcript_sessions").select([
		"session_id",
		"started_at",
		"selector",
		"title",
		"source_json",
		"metadata_json",
		"stopped_at",
		"next_utterance_seq",
		"created_at_ms",
		"updated_at_ms"
	]).select((eb) => eb.exists(eb.selectFrom("meeting_transcript_summaries").select("session_id").whereRef("meeting_transcript_summaries.session_id", "=", "meeting_transcript_sessions.session_id").whereRef("meeting_transcript_summaries.session_started_at", "=", "meeting_transcript_sessions.started_at")).as("has_summary")).orderBy("started_at", "desc").limit(2);
	return {
		canonical: prepareSqliteQuerySync(database, (parameter) => query.where("selector", "=", parameter((value) => value))),
		rawId: prepareSqliteQuerySync(database, (parameter) => query.where("session_id", "=", parameter((value) => value))),
		slug: prepareSqliteQuerySync(database, (parameter) => query.where("session_slug", "=", parameter((value) => value)).where("session_id", "!=", parameter((value) => value))),
		dated: prepareSqliteQuerySync(database, (parameter) => query.where("session_id", "=", parameter((value) => value.sessionId)).where("started_at", "like", parameter((value) => `${value.date}T%`)))
	};
}
function readTranscriptSessionMatches(database, value) {
	const queries = sessionMatchQueries(database);
	const entries = (result) => result.rows.map((row) => ({
		session: sessionFromRow(row),
		selector: row.selector,
		hasSummary: Boolean(row.has_summary),
		inputRevision: transcriptSummaryInputRevisionFromRow(row)
	}));
	const canonical = entries(queries.canonical(value))[0];
	const date = value.match(/^(\d{4}-\d{2}-\d{2})\//u)?.[1];
	return {
		qualified: canonical ? [canonical] : date ? entries(queries.dated({
			sessionId: value.slice(11),
			date
		})) : [],
		unqualified: [...entries(queries.rawId(value)), ...entries(queries.slug(value))]
	};
}
function readTranscriptSessionByIdentity(database, session) {
	const row = executeSqliteQueryTakeFirstSync(database, meetingTranscriptSessionQuery(database, session).selectAll());
	return row ? sessionFromRow(row) : void 0;
}
function readTranscriptUtterances(database, session, maxUtterances) {
	const limit = resolveOptionalIntegerOption(maxUtterances, { min: 1 });
	const query = meetingTranscriptUtteranceQuery(database, session).selectAll();
	if (limit === void 0) return executeSqliteQuerySync(database, query.orderBy("sequence", "asc")).rows.map(utteranceFromRow);
	return executeSqliteQuerySync(database, query.orderBy("sequence", "desc").limit(limit)).rows.toReversed().map(utteranceFromRow);
}
function readStoredTranscriptSummary(database, session) {
	const row = executeSqliteQueryTakeFirstSync(database, meetingTranscriptDb(database).selectFrom("meeting_transcript_summaries").selectAll().where("session_id", "=", session.sessionId).where("session_started_at", "=", session.startedAt));
	if (!row) return {};
	const summary = summaryFromRow(row);
	return {
		...summary ? { summary } : {},
		...row.markdown !== null ? { markdown: row.markdown } : {}
	};
}
function readTranscriptJsonlDigest(database, session) {
	const query = meetingTranscriptUtteranceQuery(database, session).selectAll().orderBy("sequence", "asc");
	const digest = createHash("sha256");
	for (const row of iterateSqliteQuerySync(database, query)) digest.update(`${JSON.stringify(utteranceFromRow(row))}\n`);
	return digest.digest("hex");
}
//#endregion
export { readTranscriptExportPathOwners as a, readTranscriptSessionEntries as c, readTranscriptUtterances as d, readTranscriptExportPathCollisions as i, readTranscriptSessionMatches as l, readTranscriptCanonicalSessionRow as n, readTranscriptJsonlDigest as o, readTranscriptExportOwnership as r, readTranscriptSessionByIdentity as s, readStoredTranscriptSummary as t, readTranscriptSummarySnapshot as u };
