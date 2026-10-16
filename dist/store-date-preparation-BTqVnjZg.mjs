import { R as timestampMsToIsoString, f as asSafeIntegerInRange, y as parseDateStringTimestampMs } from "./number-coercion-CuVhdCBs.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { f as expressionBuilder, i as executeSqliteQueryTakeFirstSync, o as iterateSqliteQuerySync } from "./kysely-sync-K7ftY-g4.mjs";
import { i as requestSqliteWorkerOperationAdmission, n as createSqliteWorkerOperationAdmission } from "./sqlite-worker-operation-admission-cNGSH5v0.mjs";
import { c as TRANSCRIPTS_RESULT_MAX_BYTES, r as TRANSCRIPTS_LEGACY_MAX_UTTERANCES, t as TRANSCRIPTS_EXPORT_MAX_BYTES } from "./transcripts-DroWNd5p.mjs";
import { i as meetingTranscriptUtteranceQuery, n as meetingTranscriptDb, u as sessionFromRow } from "./store-sqlite-BeM5GyX_.mjs";
import { AsyncLocalStorage } from "node:async_hooks";
import { createHash } from "node:crypto";
//#region src/transcripts/store-read.ts
var TranscriptLibraryError = class extends Error {
	constructor(type, message, maxBytes) {
		super(message);
		this.type = type;
		this.maxBytes = maxBytes;
	}
};
function cursorScope(values) {
	return createHash("sha256").update(JSON.stringify(values)).digest("hex");
}
function encodeCursor(scope, position) {
	return Buffer.from(JSON.stringify([
		1,
		scope,
		...position
	])).toString("base64url");
}
function decodeCursor(cursor, scope) {
	if (cursor === void 0) return;
	try {
		if (cursor.length > 1048576 || !/^[A-Za-z0-9_-]+$/u.test(cursor)) throw new Error();
		const value = JSON.parse(Buffer.from(cursor, "base64url").toString("utf8"));
		if (Array.isArray(value) && value[0] === 1 && value[1] === scope) return value.slice(2);
	} catch {}
	throw new TranscriptLibraryError("transcript_invalid_cursor", "Invalid transcript cursor; restart pagination with the current filters.");
}
function transcriptPageLimit(limit = 50, max = 100) {
	if (!Number.isInteger(limit) || limit < 1 || limit > max) throw new TranscriptLibraryError("transcript_invalid_filter", `Transcript page limit must be between 1 and ${max}.`);
	return limit;
}
function assertTranscriptByteLimit(text, maxBytes = TRANSCRIPTS_RESULT_MAX_BYTES, exporting = false) {
	assertTranscriptByteCount(Buffer.byteLength(text, "utf8"), maxBytes, exporting);
}
function assertTranscriptByteCount(bytes, maxBytes = TRANSCRIPTS_RESULT_MAX_BYTES, exporting = false) {
	if (bytes > maxBytes) throw new TranscriptLibraryError(exporting ? "transcript_export_too_large" : "transcript_result_too_large", exporting ? "Transcript exceeds the download limit; use a local transcript export." : "Transcript response exceeds the read limit; request a smaller page or use a local transcript export.", maxBytes);
}
function byteLimit(purpose) {
	return purpose === "legacy" ? void 0 : purpose === "export" ? TRANSCRIPTS_EXPORT_MAX_BYTES : TRANSCRIPTS_RESULT_MAX_BYTES;
}
function assertReadBytes(bytes, purpose) {
	const maxBytes = byteLimit(purpose);
	if (maxBytes !== void 0) assertTranscriptByteCount(bytes, maxBytes, purpose === "export");
}
function textBytes(...values) {
	const eb = expressionBuilder();
	const bytes = values.reduce((sum, value) => eb(sum, "+", eb.fn.coalesce(eb.fn("octet_length", [value]), eb.val(0))), eb.val(0));
	return eb.parens(bytes);
}
function boundedText(value, bytes, maxBytes) {
	if (maxBytes === void 0) return expressionBuilder().parens(value);
	return expressionBuilder().case().when(bytes, "<=", maxBytes).then(value).else("").end();
}
function readQuery(database, query, purpose = "page") {
	const eb = expressionBuilder(query);
	const notes = eb.selectFrom("meeting_transcript_summaries as notes").whereRef("notes.session_id", "=", "meeting_transcript_sessions.session_id").whereRef("notes.session_started_at", "=", "meeting_transcript_sessions.started_at");
	const overview = notes.select((n) => n.fn("json_extract", [n.ref("notes.summary_json"), n.val("$.overview")]).as("overview")).$asScalar();
	const summarySource = notes.select((n) => n.fn("json_extract", [n.ref("notes.summary_json"), n.val("$.source")]).as("source")).$asScalar();
	const utterances = eb.selectFrom("meeting_transcript_utterances as u").whereRef("u.session_id", "=", "meeting_transcript_sessions.session_id").whereRef("u.session_started_at", "=", "meeting_transcript_sessions.started_at");
	const speakers = utterances.select("u.speaker_label").where("u.speaker_label", "is not", null).where("u.speaker_label", "!=", "").groupBy("u.speaker_label").orderBy((u) => u.fn.min("u.sequence"), "asc");
	const participants = eb.selectFrom(speakers.as("speakers")).select((s) => s.fn("json_group_array", [s.ref("speakers.speaker_label")]).as("participants")).$asScalar();
	const lastAt = utterances.select((u) => u.fn.coalesce("u.ended_at", "u.started_at").as("at")).orderBy("u.sequence", "desc").limit(1).$asScalar();
	const identityBytes = textBytes(eb.ref("session_id"), eb.ref("started_at"), eb.ref("selector"));
	const bytes = textBytes(eb.ref("session_id"), eb.ref("started_at"), eb.ref("selector"), eb.ref("source_json"), eb.ref("metadata_json"), eb.ref("title"), eb.ref("stopped_at"), lastAt, overview, summarySource, participants);
	const maxBytes = byteLimit(purpose);
	const columns = (payloadBytes) => [
		boundedText(eb.ref("session_id"), identityBytes, maxBytes).as("session_id"),
		boundedText(eb.ref("started_at"), identityBytes, maxBytes).as("started_at"),
		boundedText(eb.ref("selector"), identityBytes, maxBytes).as("selector"),
		boundedText(eb.ref("source_json"), payloadBytes, maxBytes).as("source_json"),
		boundedText(eb.ref("metadata_json"), payloadBytes, maxBytes).as("metadata_json"),
		boundedText(eb.ref("title"), payloadBytes, maxBytes).as("title"),
		boundedText(eb.ref("stopped_at"), payloadBytes, maxBytes).as("stopped_at"),
		boundedText(lastAt, payloadBytes, maxBytes).as("last_utterance_at"),
		boundedText(overview, payloadBytes, maxBytes).as("overview"),
		boundedText(summarySource, payloadBytes, maxBytes).as("summary_source"),
		boundedText(participants, payloadBytes, maxBytes).as("participants_json"),
		eb.parens(payloadBytes).as("payload_bytes"),
		identityBytes.as("identity_bytes"),
		utterances.select((u) => u.fn.countAll().as("count")).$asScalar().as("utterance_count"),
		"updated_at_ms",
		eb.exists(notes.select("notes.session_id")).as("has_summary")
	];
	if (maxBytes === void 0) return query.select(columns(bytes));
	return meetingTranscriptDb(database).with((cte) => cte("read_sizes").materialized(), () => query.select([
		"session_id as read_session_id",
		"started_at as read_started_at",
		bytes.as("payload_bytes")
	])).selectFrom("read_sizes").innerJoin("meeting_transcript_sessions", (join) => join.onRef("meeting_transcript_sessions.session_id", "=", "read_sizes.read_session_id").onRef("meeting_transcript_sessions.started_at", "=", "read_sizes.read_started_at")).select((sizes) => columns(sizes.ref("read_sizes.payload_bytes")));
}
function transcriptReadEntryFromRow(row, purpose = "page") {
	assertReadBytes(row.payload_bytes, purpose);
	const session = sessionFromRow(row);
	const summarySource = row.summary_source === "model" || row.summary_source === "heuristic" ? row.summary_source : void 0;
	return {
		session,
		selector: row.selector,
		hasSummary: Boolean(row.has_summary),
		utteranceCount: row.utterance_count,
		participants: JSON.parse(row.participants_json ?? "[]"),
		overview: typeof row.overview === "string" ? row.overview : void 0,
		summarySource,
		updatedAt: new Date(row.updated_at_ms).toISOString(),
		lastUtteranceAt: row.last_utterance_at ?? null
	};
}
const dateReaders = /* @__PURE__ */ new WeakSet();
const dateParser = new AsyncLocalStorage();
function parseTranscriptDate(value) {
	return (dateParser.getStore() ?? parseDateStringTimestampMs)(value);
}
function registerTranscriptDateReader(database) {
	if (dateReaders.has(database)) return;
	database.function("openclaw_transcript_date_ms", (value) => parseTranscriptDate(value) ?? null);
	dateReaders.add(database);
}
function transcriptStartTime(startedAt) {
	const eb = expressionBuilder();
	return eb.case().when(eb.fn("octet_length", [startedAt]), "<=", TRANSCRIPTS_RESULT_MAX_BYTES).then(eb.fn("openclaw_transcript_date_ms", [startedAt])).end();
}
/** Chronological key selection scans candidates; filters never turn into ownership. */
function* iterateTranscriptReadEntries(database, options) {
	const limit = transcriptPageLimit(options.limit, 200);
	registerTranscriptDateReader(database);
	let query = meetingTranscriptDb(database).selectFrom("meeting_transcript_sessions");
	if (options.session) query = query.where("session_id", "=", options.session.sessionId).where("started_at", "=", options.session.startedAt);
	if (options.offset !== void 0) query = query.offset(options.offset);
	if (options.providerId) query = query.where("provider_id", "=", options.providerId);
	if (options.accountId) {
		const accountId = options.accountId;
		query = query.where((eb) => eb(eb.fn("json_extract", [eb.ref("source_json"), eb.val("$.accountId")]), "=", accountId));
	}
	if (options.agentId) {
		const agentId = options.agentId;
		query = query.where((eb) => eb(eb.fn("json_extract", [eb.ref("metadata_json"), eb.val("$.agentId")]), "=", agentId));
	}
	if (options.startedAfter) {
		const startedAfter = parseTranscriptDate(options.startedAfter) ?? null;
		query = query.where((eb) => eb(transcriptStartTime(eb.ref("started_at")), ">=", startedAfter));
	}
	if (options.startedBefore) {
		const startedBefore = parseTranscriptDate(options.startedBefore) ?? null;
		query = query.where((eb) => eb(transcriptStartTime(eb.ref("started_at")), "<", startedBefore));
	}
	if (options.after) {
		const after = options.after;
		const afterTime = parseTranscriptDate(after.startedAt);
		query = query.where((eb) => {
			const time = transcriptStartTime(eb.ref("started_at"));
			const afterIdentity = eb(eb.refTuple("session_id", "started_at"), ">", eb.tuple(after.sessionId, after.startedAt));
			return afterTime === void 0 ? eb.and([eb(time, "is", null), afterIdentity]) : eb.or([
				eb(time, "<", afterTime),
				eb(time, "is", null),
				eb.and([eb(time, "=", afterTime), afterIdentity])
			]);
		});
	}
	if (options.query) {
		const search = options.query;
		query = query.where((eb) => {
			const matches = (field) => eb(eb.fn("instr", [eb.fn("lower", [field]), eb.fn("lower", [eb.val(search)])]), ">", 0);
			const fields = [
				eb.ref("title"),
				eb.ref("session_id"),
				eb.ref("provider_id"),
				...[
					"accountId",
					"guildId",
					"channelId",
					"threadTs",
					"fileId"
				].map((key) => eb.fn("json_extract", [eb.ref("source_json"), eb.val(`$.${key}`)]))
			];
			return eb.or([
				...fields.map(matches),
				eb.exists(eb.selectFrom("meeting_transcript_summaries as notes").select("notes.session_id").whereRef("notes.session_id", "=", "meeting_transcript_sessions.session_id").whereRef("notes.session_started_at", "=", "meeting_transcript_sessions.started_at").where((notes) => notes.or([matches(notes.ref("notes.markdown")), matches(notes.fn("json_extract", [notes.ref("notes.summary_json"), notes.val("$.overview")]))]))),
				eb.exists(eb.selectFrom("meeting_transcript_utterances as utterance").select("utterance.session_id").whereRef("utterance.session_id", "=", "meeting_transcript_sessions.session_id").whereRef("utterance.session_started_at", "=", "meeting_transcript_sessions.started_at").where((utterance) => matches(utterance.ref("utterance.text"))))
			]);
		});
	}
	const keys = query.select(["session_id", "started_at"]).orderBy((eb) => transcriptStartTime(eb.ref("started_at")), "desc").orderBy("session_id", "asc").orderBy("started_at", "asc").limit(limit + 1);
	const rows = iterateSqliteQuerySync(database, readQuery(database, meetingTranscriptDb(database).selectFrom("meeting_transcript_sessions").where((eb) => eb(eb.refTuple("session_id", "started_at"), "in", keys.$asTuple("session_id", "started_at")))).orderBy((eb) => transcriptStartTime(eb.ref("meeting_transcript_sessions.started_at")), "desc").orderBy("meeting_transcript_sessions.session_id", "asc").orderBy("meeting_transcript_sessions.started_at", "asc"));
	let count = 0;
	for (const row of rows) {
		if (count++ === limit) return true;
		yield transcriptReadEntryFromRow(row);
	}
	return false;
}
/** Selectors are unique; identity and payload bounds remain in the same SQLite statement. */
function readTranscriptEntry(database, selector, purpose = "page") {
	const row = executeSqliteQueryTakeFirstSync(database, readQuery(database, meetingTranscriptDb(database).selectFrom("meeting_transcript_sessions").where("selector", "=", selector), purpose));
	if (!row) return;
	assertReadBytes(row.identity_bytes, purpose);
	return row.selector === selector ? transcriptReadEntryFromRow(row, purpose) : void 0;
}
function readLatestTranscriptEntry(database) {
	const row = executeSqliteQueryTakeFirstSync(database, readQuery(database, meetingTranscriptDb(database).selectFrom("meeting_transcript_sessions").where("next_utterance_seq", ">", 0).orderBy("updated_at_ms", "desc").orderBy("meeting_transcript_sessions.started_at", "desc").orderBy("meeting_transcript_sessions.session_id", "asc").limit(1)));
	return row ? transcriptReadEntryFromRow(row) : void 0;
}
function queryTranscriptReadEntries(database, options, parseDate = parseDateStringTimestampMs) {
	return dateParser.run(parseDate, () => collectTranscriptReadEntries(database, options));
}
function collectTranscriptReadEntries(database, options) {
	const entries = [];
	let bytes = 0;
	for (const entry of iterateTranscriptReadEntries(database, options)) {
		const agentId = entry.session.metadata?.agentId;
		entry.session.metadata = typeof agentId === "string" ? { agentId } : void 0;
		bytes += Buffer.byteLength(JSON.stringify(entry), "utf8");
		assertTranscriptByteCount(bytes);
		entries.push(entry);
	}
	return entries;
}
function utteranceQuery(database, session, purpose) {
	return meetingTranscriptUtteranceQuery(database, session).select((eb) => {
		const maxBytes = byteLimit(purpose);
		const utteranceId = purpose === "legacy" ? eb.val(null) : eb.ref("utterance_id");
		const bytes = textBytes(utteranceId, eb.ref("started_at"), eb.ref("ended_at"), eb.ref("speaker_id"), eb.ref("speaker_label"), eb.ref("text"));
		return [
			boundedText(utteranceId, bytes, maxBytes).as("utterance_id"),
			boundedText(eb.ref("started_at"), bytes, maxBytes).as("started_at"),
			boundedText(eb.ref("ended_at"), bytes, maxBytes).as("ended_at"),
			boundedText(eb.ref("speaker_id"), bytes, maxBytes).as("speaker_id"),
			boundedText(eb.ref("speaker_label"), bytes, maxBytes).as("speaker_label"),
			boundedText(eb.ref("text"), bytes, maxBytes).as("text"),
			bytes.as("payload_bytes"),
			"sequence",
			"final"
		];
	});
}
function transcriptReadUtteranceFromRow(row) {
	return {
		sequence: row.sequence,
		id: row.utterance_id ?? void 0,
		startedAt: row.started_at ?? void 0,
		endedAt: row.ended_at ?? void 0,
		speakerId: row.speaker_id ?? void 0,
		speakerLabel: row.speaker_label ?? void 0,
		text: row.text,
		final: row.final === null ? void 0 : row.final === 1
	};
}
function readTranscriptUtterancePage(database, session, options, purpose = "page") {
	const recent = purpose === "legacy";
	const limit = recent ? TRANSCRIPTS_LEGACY_MAX_UTTERANCES : transcriptPageLimit(options.limit);
	let query = utteranceQuery(database, session, purpose);
	if (options.after !== void 0) query = query.where("sequence", ">", options.after);
	if (options.query) {
		const search = options.query;
		query = query.where((eb) => eb(eb.fn("instr", [eb.fn("lower", [eb.ref("text")]), eb.fn("lower", [eb.val(search)])]), ">", 0));
	}
	const rows = iterateSqliteQuerySync(database, query.orderBy("sequence", recent ? "desc" : "asc").limit(recent ? limit : limit + 1));
	const utterances = [];
	let bytes = 0;
	for (const row of rows) {
		if (utterances.length === limit) return {
			utterances,
			hasMore: true
		};
		bytes += row.payload_bytes;
		assertReadBytes(bytes, purpose);
		utterances.push(transcriptReadUtteranceFromRow(row));
	}
	return {
		utterances: recent ? utterances.toReversed() : utterances,
		hasMore: false
	};
}
/** Omit the duplicated transcript inside SQLite before materializing the stored summary. */
function readStoredTranscriptNotes(database, session, purpose = "page") {
	const row = executeSqliteQueryTakeFirstSync(database, meetingTranscriptDb(database).selectFrom("meeting_transcript_summaries").select((eb) => {
		const summary = eb.fn("json_remove", [eb.ref("summary_json"), eb.val("$.transcript")]);
		const bytes = textBytes(summary, eb.ref("markdown"));
		return [
			boundedText(summary, bytes, byteLimit(purpose)).as("summary"),
			boundedText(eb.ref("markdown"), bytes, byteLimit(purpose)).as("markdown"),
			bytes.as("payload_bytes")
		];
	}).where("session_id", "=", session.sessionId).where("session_started_at", "=", session.startedAt));
	if (!row) return {};
	assertReadBytes(row.payload_bytes, purpose);
	let summary;
	if (row.summary) summary = JSON.parse(row.summary);
	return {
		summary,
		markdown: row.markdown ?? void 0
	};
}
function requireTranscriptReadEntry(database, selector, purpose) {
	const entry = readTranscriptEntry(database, selector, purpose);
	if (!entry) throw new TranscriptLibraryError("transcript_session_not_found", "Transcript not found; refresh the library and use its full selector.");
	return entry;
}
function readTranscriptLibraryEntry(database, params) {
	const purpose = params.limit === void 0 && params.cursor === void 0 && params.query === void 0 ? "legacy" : "page";
	const entry = requireTranscriptReadEntry(database, params.selector, purpose);
	const scope = cursorScope([
		"get",
		entry.selector,
		params.query
	]);
	const position = decodeCursor(params.cursor, scope);
	const after = asSafeIntegerInRange(position?.[0], { min: 0 });
	if (position && (position.length !== 1 || after === void 0)) throw new TranscriptLibraryError("transcript_invalid_cursor", "Invalid transcript reader cursor.");
	return {
		entry,
		page: params.includeUtterances ? readTranscriptUtterancePage(database, entry.session, {
			limit: params.limit,
			query: params.query,
			after
		}, purpose) : void 0,
		notes: readStoredTranscriptNotes(database, entry.session, purpose),
		purpose,
		scope
	};
}
/** Stream canonical rows and notes in the caller's read snapshot without materializing files. */
function* iterateTranscriptExport(database, selector, includeNotes) {
	const entry = requireTranscriptReadEntry(database, selector, "export");
	for (const row of iterateSqliteQuerySync(database, utteranceQuery(database, entry.session, "export").orderBy("sequence", "asc"))) {
		assertTranscriptByteCount(row.payload_bytes, TRANSCRIPTS_EXPORT_MAX_BYTES, true);
		yield transcriptReadUtteranceFromRow(row);
	}
	return {
		entry,
		notes: includeNotes ? readStoredTranscriptNotes(database, entry.session, "export") : void 0
	};
}
//#endregion
//#region src/transcripts/store-date-preparation.ts
/** Native Date parsing belongs to the caller: skills can temporarily change its timezone. */
function prepareTranscriptDateReader(assertOwner, databasePath) {
	const timezone = process.env.TZ;
	let usedCallerTimezone = false;
	const assertCurrent = () => {
		assertOwner();
		if (usedCallerTimezone && process.env.TZ !== timezone) throw new Error("Transcript timezone changed while reading; retry the read.");
	};
	return {
		assertCurrent,
		createAdmission: () => ({
			nativeLocations: [databasePath],
			admission: createSqliteWorkerOperationAdmission((request, grant) => {
				const facts = request.facts;
				if (request.stage !== "prepare" || !isRecord(facts) || facts.kind !== "transcript-date" || typeof facts.value !== "string" || Buffer.byteLength(facts.value, "utf8") > 1048576 || !(facts.result instanceof SharedArrayBuffer) || facts.result.byteLength !== Float64Array.BYTES_PER_ELEMENT) throw new Error("Invalid transcript date preparation request");
				usedCallerTimezone = true;
				assertCurrent();
				new Float64Array(facts.result)[0] = parseDateStringTimestampMs(facts.value) ?? NaN;
				grant();
			})
		})
	};
}
/** Reuse one bounded reply and cache across the current synchronous query only. */
function createPreparedTranscriptDateReader() {
	const result = new Float64Array(new SharedArrayBuffer(Float64Array.BYTES_PER_ELEMENT));
	const dates = /* @__PURE__ */ new Map();
	return (value) => {
		if (typeof value !== "string") return;
		if (dates.has(value)) return dates.get(value);
		const nativeTimestamp = parseDateStringTimestampMs(value);
		if (nativeTimestamp !== void 0 && timestampMsToIsoString(nativeTimestamp) === value) return nativeTimestamp;
		requestSqliteWorkerOperationAdmission({
			stage: "prepare",
			facts: {
				kind: "transcript-date",
				value,
				result: result.buffer
			}
		});
		const parsed = Number.isNaN(result[0]) ? void 0 : result[0];
		if (value.length <= 256) {
			if (dates.size === 256) dates.clear();
			dates.set(value, parsed);
		}
		return parsed;
	};
}
//#endregion
export { assertTranscriptByteLimit as a, encodeCursor as c, queryTranscriptReadEntries as d, readLatestTranscriptEntry as f, readTranscriptLibraryEntry as h, assertTranscriptByteCount as i, iterateTranscriptExport as l, readTranscriptEntry as m, prepareTranscriptDateReader as n, cursorScope as o, readStoredTranscriptNotes as p, TranscriptLibraryError as r, decodeCursor as s, createPreparedTranscriptDateReader as t, iterateTranscriptReadEntries as u };
