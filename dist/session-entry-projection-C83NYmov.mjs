import { g as readStringValue } from "./string-coerce-1VuiLaaR.mjs";
import { a as asOptionalRecord, i as asOptionalObjectRecord } from "./record-coerce-TIsquoVR.mjs";
import { t as avoidTrailingHighSurrogateBreak } from "./utf16-slice-D_ngcYKd.mjs";
//#region packages/memory-host-sdk/src/host/session-entry-projection.ts
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
function splitLongSessionLine(text, maxChars = SESSION_EXPORT_CONTENT_WRAP_CHARS) {
	const normalized = text.trim();
	if (!normalized) return [];
	if (normalized.length <= maxChars) return [normalized];
	const segments = [];
	let cursor = 0;
	while (cursor < normalized.length) {
		if (normalized.length - cursor <= maxChars) {
			segments.push(normalized.slice(cursor).trim());
			break;
		}
		const limit = cursor + maxChars;
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
//#endregion
export { projectSessionEntryRecord as n, renderSessionExportLines as r, collectRawSessionText as t };
