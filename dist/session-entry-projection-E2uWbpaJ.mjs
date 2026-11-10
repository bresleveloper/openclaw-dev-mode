import { g as readStringValue } from "./string-coerce-1VuiLaaR.mjs";
import { a as asOptionalRecord, i as asOptionalObjectRecord } from "./record-coerce-TIsquoVR.mjs";
import { t as avoidTrailingHighSurrogateBreak } from "./utf16-slice-D_ngcYKd.mjs";
import { createHash } from "node:crypto";
//#region packages/memory-host-sdk/src/host/session-entry-projection.ts
function hashSessionEntrySnapshot(params) {
	return createHash("sha256").update(params.content).update("\n").update(params.lineMap.join(",")).update("\n").update(params.messageTimestampsMs.join(",")).update("\n").update(JSON.stringify(params.lineProvenance)).update("\n").update(JSON.stringify(params.resetRecallCutoff)).digest("hex");
}
function collectRawSessionText(content) {
	if (typeof content === "string") return content;
	if (!Array.isArray(content)) return null;
	const parts = [];
	for (const block of content) {
		const record = asOptionalObjectRecord(block);
		if (record?.type === "text" && typeof record.text === "string") parts.push(record.text);
	}
	return parts.length > 0 ? parts.join("\n") : null;
}
/** Retain memory's input facts, not tool results, attachments, or provider replay payloads. */
function projectSessionEntryRecord(value) {
	const record = asOptionalRecord(value);
	if (!record) return null;
	const message = record.type === "message" ? asOptionalRecord(record.message) : void 0;
	const metadata = asOptionalRecord(message?.["__openclaw"]);
	const provenance = asOptionalRecord(message?.provenance);
	const data = asOptionalRecord(record.data);
	const timestamp = (candidate) => typeof candidate === "string" || typeof candidate === "number" ? candidate : void 0;
	return {
		type: readStringValue(record.type),
		id: readStringValue(record.id),
		firstKeptEntryId: record.firstKeptEntryId === void 0 ? void 0 : readStringValue(record.firstKeptEntryId) ?? null,
		customType: readStringValue(record.customType),
		runId: readStringValue(record.runId),
		sessionKey: readStringValue(record.sessionKey),
		data: {
			runId: readStringValue(data?.runId),
			sessionKey: readStringValue(data?.sessionKey)
		},
		timestamp: timestamp(record.timestamp),
		message: message ? {
			role: readStringValue(message.role),
			timestamp: timestamp(message.timestamp),
			content: message.role === "user" || message.role === "assistant" ? collectRawSessionText(message.content) : null,
			provenance: {
				kind: readStringValue(provenance?.kind),
				sourceTool: readStringValue(provenance?.sourceTool)
			},
			__openclaw: {
				runId: readStringValue(metadata?.runId),
				senderIsOwner: metadata?.senderIsOwner === true,
				turnTainted: metadata?.turnTainted === true
			}
		} : void 0
	};
}
const SESSION_EXPORT_CONTENT_WRAP_CHARS = 800;
function splitLongSessionLine(text) {
	const normalized = text.trim();
	if (!normalized) return [];
	if (normalized.length <= SESSION_EXPORT_CONTENT_WRAP_CHARS) return [normalized];
	const segments = [];
	let cursor = 0;
	while (cursor < normalized.length) {
		if (normalized.length - cursor <= SESSION_EXPORT_CONTENT_WRAP_CHARS) {
			segments.push(normalized.slice(cursor).trim());
			break;
		}
		const limit = cursor + SESSION_EXPORT_CONTENT_WRAP_CHARS;
		let splitAt = limit;
		for (let index = limit; index > cursor; index -= 1) if (normalized[index] === " ") {
			splitAt = index;
			break;
		}
		splitAt = avoidTrailingHighSurrogateBreak(normalized, cursor, splitAt);
		segments.push(normalized.slice(cursor, splitAt).trim());
		cursor = splitAt;
		while (cursor < normalized.length && normalized[cursor] === " ") cursor += 1;
	}
	return segments.filter(Boolean);
}
function renderSessionExportLines(label, text) {
	return splitLongSessionLine(text).map((segment) => `${label}: ${segment}`);
}
const MAX_DATE_TIMESTAMP_MS = 864e13;
function parseSessionTimestampMs(record, message) {
	const candidates = [message.timestamp, record.timestamp];
	for (const value of candidates) {
		if (typeof value === "number" && Number.isFinite(value)) {
			const ms = value > 0 && value < 1e11 ? value * 1e3 : value;
			if (Number.isFinite(ms) && ms > 0 && ms <= MAX_DATE_TIMESTAMP_MS) return Math.floor(ms);
		}
		if (typeof value === "string") {
			const parsed = Date.parse(value);
			if (Number.isFinite(parsed) && parsed > 0) return parsed;
		}
	}
	return 0;
}
//#endregion
export { renderSessionExportLines as a, projectSessionEntryRecord as i, hashSessionEntrySnapshot as n, parseSessionTimestampMs as r, collectRawSessionText as t };
