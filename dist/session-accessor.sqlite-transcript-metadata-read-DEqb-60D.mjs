import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { a as getNodeSqliteKysely, i as executeSqliteQueryTakeFirstSync, o as iterateSqliteQuerySync } from "./kysely-sync-K7ftY-g4.mjs";
import { r as runSqliteDeferredTransactionSync } from "./sqlite-transaction-DsZ3X6nD.mjs";
import { s as transcriptEventJsonSql } from "./transcript-payload-Yc_w8Yx5.mjs";
import { n as assertSessionTranscriptHot } from "./session-cold-storage-state-CzcE3h3O.mjs";
import { i as resolveSqliteSessionTranscriptReadFence } from "./session-transcript-read-fence-DfxRHzep.mjs";
import { t as extractAssistantPhaseText } from "./chat-message-content-C-d0FKNG.mjs";
import { c as isTranscriptOnlyOpenClawAssistantModel } from "./transcript-only-openclaw-assistant-CzjHCvH2.mjs";
import { t as readHotSessionTranscriptSnapshot } from "./session-cold-storage-read-rGbdRuJQ.mjs";
//#region src/config/sessions/transcript-assistant-delivery-read.ts
/** Decode only persisted delivery facts; transcript records cannot supply runtime authority. */
function readAssistantDeliveryFacts(value) {
	if (!isRecord(value)) return;
	const facts = {};
	if (value.audioAsVoice === true) facts.audioAsVoice = true;
	if (typeof value.replyToId === "string" && value.replyToId.trim()) facts.replyToId = value.replyToId;
	else if (value.replyToCurrent === true) facts.replyToCurrent = true;
	if (Array.isArray(value.mediaUrls)) {
		const mediaUrls = value.mediaUrls.filter((url) => typeof url === "string" && url.trim().length > 0);
		if (mediaUrls.length) facts.mediaUrls = mediaUrls;
	}
	if (value.textPhaseRequiresTerminal === true) facts.textPhaseRequiresTerminal = true;
	if (isRecord(value.tts) && value.tts.tagged === true) {
		const tts = { tagged: true };
		if (typeof value.tts.text === "string") tts.text = value.tts.text;
		if (Array.isArray(value.tts.directives)) tts.directives = value.tts.directives.flatMap((directive) => {
			if (!isRecord(directive) || !isRecord(directive.values)) return [];
			const entries = Object.entries(directive.values);
			if (!entries.every((entry) => typeof entry[1] === "string")) return [];
			const values = Object.fromEntries(entries);
			return [{
				...typeof directive.provider === "string" ? { provider: directive.provider } : {},
				values
			}];
		});
		facts.tts = tts;
	}
	return Object.keys(facts).length ? facts : void 0;
}
/** SQLite and retained JSONL readers expose the same authored text and delivery facts. */
function projectAssistantTranscriptText(message, id) {
	if (!isRecord(message) || message.role !== "assistant") return;
	const text = extractAssistantPhaseText(message);
	if (!text?.trim()) return;
	const openclawDelivery = readAssistantDeliveryFacts(message.openclawDelivery);
	return {
		...typeof id === "string" && id ? { id } : {},
		text,
		...typeof message.timestamp === "number" && Number.isFinite(message.timestamp) ? { timestamp: message.timestamp } : {},
		...openclawDelivery ? { openclawDelivery } : {}
	};
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-transcript-metadata-read.ts
function readTranscriptHeaderFromDatabase(database, sessionId) {
	return readHotSessionTranscriptSnapshot(database, sessionId, "header", () => {
		const db = getNodeSqliteKysely(database.db);
		const row = executeSqliteQueryTakeFirstSync(database.db, db.selectFrom("transcript_events").select(transcriptEventJsonSql(database.db).as("event_json")).where("session_id", "=", sessionId).orderBy("seq", "asc").limit(1));
		return row ? JSON.parse(row.event_json) : void 0;
	});
}
/** Read through an already admitted connection without reopening its physical store. */
function readLatestAssistantTextFromDatabase(database, scope, options = {}) {
	return runSqliteDeferredTransactionSync(database.db, () => {
		assertSessionTranscriptHot(database.db, scope.sessionId);
		const db = getNodeSqliteKysely(database.db);
		const beforeEventSeq = resolveSqliteSessionTranscriptReadFence({
			database,
			...scope
		})?.beforeRawSeq;
		const rows = iterateSqliteQuerySync(database.db, db.selectFrom("transcript_events as te").innerJoin("transcript_event_identities as ti", (join) => join.onRef("ti.session_id", "=", "te.session_id").onRef("ti.seq", "=", "te.seq")).select(transcriptEventJsonSql(database.db, "te").as("event_json")).where("te.session_id", "=", scope.sessionId).where("ti.event_type", "=", "message").$if(beforeEventSeq !== void 0, (query) => query.where("ti.seq", "<", beforeEventSeq)).orderBy("ti.seq", "desc"));
		for (const row of rows) {
			const latest = parseLatestAssistantMessageEvent(row.event_json, options);
			if (!latest) continue;
			const text = projectAssistantTranscriptText(latest.message, latest.id);
			if (text) return text;
		}
	}, {
		databaseLabel: database.path,
		operationLabel: "latest assistant fenced read"
	});
}
function parseLatestAssistantMessageEvent(raw, options = {}) {
	let parsed;
	try {
		parsed = JSON.parse(raw);
	} catch {
		return;
	}
	const message = parsed.message;
	if (!message || message.role !== "assistant") return;
	if (!options.includeTranscriptOnlyOpenClawAssistant && isTranscriptOnlyOpenClawAssistantModel(message.provider, message.model)) return;
	return {
		...typeof parsed.id === "string" && parsed.id.trim() ? { id: parsed.id } : {},
		message
	};
}
//#endregion
export { readTranscriptHeaderFromDatabase as n, projectAssistantTranscriptText as r, readLatestAssistantTextFromDatabase as t };
