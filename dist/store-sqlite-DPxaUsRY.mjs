import { a as asOptionalRecord } from "./record-coerce-TIsquoVR.mjs";
import { t as hasErrnoCode } from "./errno-FR4CRyya.mjs";
import { n as sha256Hex } from "./node-crypto-BG4u3UnX.mjs";
import "./crypto-digest-y6oZN-_F.mjs";
import { a as executeSqliteQueryTakeFirstSync, i as executeSqliteQuerySync, o as getNodeSqliteKysely } from "./kysely-sync-9fPQaMlh.mjs";
import { r as removePathWithinRoot } from "./fs-safe-remove-DYWyr3qX.mjs";
import { randomUUID } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { toUSVString } from "node:util";
import { tempFile } from "@openclaw/fs-safe/advanced";
import { root } from "@openclaw/fs-safe/root";
const TRANSCRIPT_EXPORT_FILE_NAMES = /* @__PURE__ */ new Set([
	"metadata.json",
	"summary.json",
	"summary.md",
	"transcript.jsonl"
]);
function safeTranscriptPathSegment(value) {
	let segment = value.replace(/[^a-zA-Z0-9._-]+/g, "-").replace(/^-+|-+$/g, "");
	if (!segment) return "session";
	if (segment.endsWith(".") || /^(?:con|prn|aux|nul|com[1-9]|lpt[1-9])(?:\..*)?$/iu.test(segment)) segment = Buffer.from(segment, "utf8").toString("hex").match(/.{2}/gu).map((byte) => `%${byte.toUpperCase()}`).join("");
	if (segment.length > 255) {
		const suffix = `-${sha256Hex(value)}`;
		return `${segment.slice(0, 255 - suffix.length)}${suffix}`;
	}
	return segment;
}
function legacyTranscriptPathSegment(value) {
	return value.replace(/[^a-zA-Z0-9._-]+/g, "-").replace(/^-+|-+$/g, "") || "session";
}
function dateSegment(value) {
	return value?.match(/^(\d{4}-\d{2}-\d{2})T/)?.[1] ?? (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
}
function transcriptSessionSelector(session) {
	return `${dateSegment(session.startedAt)}/${safeTranscriptPathSegment(session.sessionId)}`;
}
function legacyTranscriptSessionSelector(session) {
	const date = dateSegment(session.startedAt);
	const segment = legacyTranscriptPathSegment(session.sessionId);
	if (segment.length > 255) return;
	if (segment === ".") return date;
	if (segment === "..") return ".";
	return `${date}/${segment}`;
}
function transcriptSessionExportKey(session) {
	return transcriptSessionSelector(session).toLowerCase();
}
function normalizeExportText(value) {
	return value.endsWith("\n") ? value : `${value}\n`;
}
async function writeTranscriptArtifact(rootDir, fileName, content, assertBeforeMutation) {
	await writeTranscriptArtifactFile({
		rootDir,
		fileName,
		write: (filePath) => fs.writeFile(filePath, content, { mode: 384 }),
		assertBeforeMutation
	});
	return sha256Hex(content);
}
/** Retain private staging and the destination root until guarded, durable publication. */
async function writeTranscriptArtifactFile(params) {
	const target = await root(params.rootDir);
	const stage = await tempFile({
		rootDir: params.rootDir,
		prefix: "openclaw-transcript",
		fileName: params.fileName,
		onCleanupError(error) {
			throw error;
		}
	});
	try {
		const source = await root(stage.dir);
		await params.write(stage.path);
		await target.copyIn(params.fileName, {
			root: source,
			relativePath: path.basename(stage.path)
		}, {
			mode: 384,
			durable: true,
			maxBytes: Infinity,
			sourceHardlinks: "reject",
			signal: params.signal,
			assertBeforeMutation: params.assertBeforeMutation
		});
	} finally {
		await stage.cleanup();
	}
}
async function removeTranscriptArtifact(rootDir, fileName, assertBeforeMutation) {
	await removePathWithinRoot({
		rootDir,
		relativePath: fileName,
		force: true,
		assertBeforeMutation
	});
}
async function isCaseSensitiveDirectory(directory) {
	const probeName = `.openclaw-case-probe-${randomUUID().toLowerCase()}`;
	const probePath = path.join(directory, probeName);
	const alternatePath = path.join(directory, probeName.toUpperCase());
	await (await fs.open(probePath, "wx", 384)).close();
	try {
		try {
			await fs.access(alternatePath);
			return false;
		} catch (error) {
			if (hasErrnoCode(error, "ENOENT")) return true;
			throw error;
		}
	} finally {
		await fs.rm(probePath, { force: true });
	}
}
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
/** Descriptor custody tolerates accepted speech, but not changed metadata. */
function transcriptSessionInputRevisionFromRow(row) {
	return transcriptSummaryInputRevisionFromRow({
		...row,
		next_utterance_seq: 0
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
		["accountId", "source_account_id"],
		["guildId", "source_guild_id"],
		["channelId", "source_channel_id"],
		["meetingUrl", "source_meeting_url"],
		["threadTs", "source_thread_ts"],
		["fileId", "source_file_id"]
	].map(([key, column]) => eb(column, source[key] === void 0 ? "is" : "=", source[key] ?? null)))).orderBy("stopped_at", "desc").orderBy("started_at", "desc").orderBy("session_id", "asc").limit(1));
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
export { writeTranscriptArtifact as C, transcriptSessionSelector as S, legacyTranscriptSessionSelector as _, parseOptionalJsonRecord as a, safeTranscriptPathSegment as b, readTranscriptSummaryInputRevision as c, summaryFromRow as d, transcriptSessionInputRevisionFromRow as f, isCaseSensitiveDirectory as g, TRANSCRIPT_EXPORT_FILE_NAMES as h, meetingTranscriptUtteranceQuery as i, readTranscriptSummaryKeys as l, utteranceFromRow as m, meetingTranscriptDb as n, readRecentStoppedTranscriptSession as o, transcriptSummaryInputRevisionFromRow as p, meetingTranscriptSessionQuery as r, readStoredTranscriptSummaryRevision as s, appendMeetingTranscriptUtterance as t, sessionFromRow as u, normalizeExportText as v, writeTranscriptArtifactFile as w, transcriptSessionExportKey as x, removeTranscriptArtifact as y };
