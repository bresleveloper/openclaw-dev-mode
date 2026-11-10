import { a as executeSqliteQueryTakeFirstSync, o as getNodeSqliteKysely, s as iterateSqliteQuerySync } from "./kysely-sync-9fPQaMlh.mjs";
import { r as runSqliteDeferredTransactionSync } from "./sqlite-transaction-CpDyZPQ0.mjs";
import { c as transcriptEventJsonSql, d as transcriptEventNavigationSql } from "./transcript-payload-Cu49oQKq.mjs";
import { l as isTranscriptOnlyOpenClawAssistantModel } from "./transcript-only-openclaw-assistant-Dn9Tr_eT.mjs";
import { n as projectAssistantTranscriptText } from "./transcript-assistant-delivery-read-Bhw3HBCv.mjs";
import { r as resolveSqliteSessionTranscriptReadFence } from "./session-transcript-read-fence-CgUG4J4j.mjs";
import { n as assertSessionTranscriptHot, r as readHotSessionTranscriptSnapshot } from "./session-cold-storage-state-CWFSrppd.mjs";
import "./session-cold-storage-read-DxurMT4l.mjs";
//#region src/config/sessions/session-accessor.sqlite-transcript-metadata-read.ts
/** Checks physical message history without loading payloads covered by the identity index. */
function hasSessionTranscriptMessageInDatabase(database, sessionId) {
	const db = getNodeSqliteKysely(database.db);
	return readHotSessionTranscriptSnapshot(database, sessionId, "presence", () => {
		if (executeSqliteQueryTakeFirstSync(database.db, db.selectFrom("transcript_event_identities").select("seq").where("session_id", "=", sessionId).where("event_type", "=", "message").limit(1))) return true;
		const classified = db.selectFrom("transcript_event_identities").select("seq").where("session_id", "=", sessionId).where("event_type", "is not", null);
		return findTranscriptEventInRows(iterateSqliteQuerySync(database.db, db.selectFrom("transcript_events").select(transcriptEventNavigationSql(database.db).as("event_json")).where("session_id", "=", sessionId).where("seq", "not in", classified).orderBy("seq", "desc")), (event) => typeof event === "object" && event !== null && "type" in event && event.type === "message") !== void 0;
	});
}
function findTranscriptEventInRows(rows, match, malformed = "skip") {
	for (const row of rows) try {
		const event = JSON.parse(row.event_json);
		if (match(event)) return { event };
	} catch (error) {
		if (malformed === "throw") throw error;
	}
}
function readTranscriptHeaderFromDatabase(database, sessionId) {
	return readHotSessionTranscriptSnapshot(database, sessionId, "header", () => {
		const db = getNodeSqliteKysely(database.db);
		const row = executeSqliteQueryTakeFirstSync(database.db, db.selectFrom("transcript_events").select(transcriptEventJsonSql(database.db).as("event_json")).where("session_id", "=", sessionId).orderBy("seq", "asc").limit(1));
		return row ? JSON.parse(row.event_json) : void 0;
	});
}
/** Read through an already admitted connection without reopening its physical store. */
function readLatestAssistantTextFromDatabase(database, scope) {
	return runSqliteDeferredTransactionSync(database.db, () => {
		assertSessionTranscriptHot(database.db, scope.sessionId);
		const db = getNodeSqliteKysely(database.db);
		const beforeEventSeq = resolveSqliteSessionTranscriptReadFence({
			database,
			...scope
		})?.beforeRawSeq;
		const rows = iterateSqliteQuerySync(database.db, db.selectFrom("transcript_events as te").innerJoin("transcript_event_identities as ti", (join) => join.onRef("ti.session_id", "=", "te.session_id").onRef("ti.seq", "=", "te.seq")).select(transcriptEventJsonSql(database.db, "te").as("event_json")).where("te.session_id", "=", scope.sessionId).where("ti.event_type", "=", "message").$if(beforeEventSeq !== void 0, (query) => query.where("ti.seq", "<", beforeEventSeq)).orderBy("ti.seq", "desc"));
		for (const row of rows) {
			const latest = parseLatestAssistantMessageEvent(row.event_json);
			if (!latest) continue;
			const text = projectAssistantTranscriptText(latest.message, latest.id);
			if (text) return text;
		}
	}, {
		databaseLabel: database.path,
		operationLabel: "latest assistant fenced read"
	});
}
function parseLatestAssistantMessageEvent(raw) {
	let parsed;
	try {
		parsed = JSON.parse(raw);
	} catch {
		return;
	}
	const message = parsed.message;
	if (!message || message.role !== "assistant") return;
	if (isTranscriptOnlyOpenClawAssistantModel(message.provider, message.model)) return;
	return {
		...typeof parsed.id === "string" && parsed.id.trim() ? { id: parsed.id } : {},
		message
	};
}
//#endregion
export { readTranscriptHeaderFromDatabase as i, hasSessionTranscriptMessageInDatabase as n, readLatestAssistantTextFromDatabase as r, findTranscriptEventInRows as t };
