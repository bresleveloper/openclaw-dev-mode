import { a as asOptionalRecord } from "./record-coerce-DItp3I4t.mjs";
import { t as isVisibleTranscriptRecord } from "./transcript-visible-record-DJ7_H34d.mjs";
//#region src/gateway/session-transcript-entry-message.ts
/** Attach OpenClaw metadata to a transcript message without dropping existing metadata. */
function attachOpenClawTranscriptMeta(message, meta) {
	const record = asOptionalRecord(message);
	if (!record) return message;
	const existing = asOptionalRecord(record["__openclaw"]) ?? {};
	return {
		...record,
		__openclaw: {
			...existing,
			...meta
		}
	};
}
function readTranscriptMessageIdempotencyKey(message) {
	const value = asOptionalRecord(message)?.idempotencyKey;
	return typeof value === "string" && value.trim() ? value : void 0;
}
function sqliteMessageEventWithSeq(entry) {
	return projectTranscriptEntryMessage(entry.event, entry.seq, entry.displayPosition);
}
/** Project one stored transcript entry onto the client-visible chat history shape. */
function projectTranscriptEntryMessage(entry, seq, transcriptPosition) {
	if (!isVisibleTranscriptRecord(entry)) return null;
	const record = entry;
	if (record.message) {
		const recordTimestampMs = typeof record.timestamp === "string" ? Date.parse(record.timestamp) : typeof record.timestamp === "number" ? record.timestamp : NaN;
		const idempotencyKey = readTranscriptMessageIdempotencyKey(record.message);
		return attachOpenClawTranscriptMeta(record.message, {
			...typeof record.id === "string" ? { id: record.id } : {},
			...idempotencyKey ? { idempotencyKey } : {},
			...Number.isFinite(recordTimestampMs) ? { recordTimestampMs } : {},
			transcriptPosition,
			seq
		});
	}
	const parsedTimestamp = typeof record.timestamp === "string" ? Date.parse(record.timestamp) : NaN;
	if (record.type === "custom_message") return attachOpenClawTranscriptMeta({
		role: "custom",
		customType: record.customType,
		content: record.content,
		display: record.display,
		details: record.details,
		timestamp: parsedTimestamp
	}, {
		...typeof record.id === "string" ? { id: record.id } : {},
		recordTimestampMs: parsedTimestamp,
		transcriptPosition,
		seq
	});
	if (record.type !== "compaction" && record.type !== "reset") return null;
	const kind = record.type;
	const compactionIdentity = kind === "compaction" ? asOptionalRecord(record["__openclaw"]) : void 0;
	return {
		role: "system",
		content: [{
			type: "text",
			text: kind === "compaction" ? "Compaction" : "Reset"
		}],
		timestamp: Number.isFinite(parsedTimestamp) ? parsedTimestamp : Date.now(),
		__openclaw: {
			kind,
			id: typeof record.id === "string" ? record.id : void 0,
			...typeof compactionIdentity?.runId === "string" ? { runId: compactionIdentity.runId } : {},
			...typeof compactionIdentity?.itemId === "string" ? { itemId: compactionIdentity.itemId } : {},
			...kind === "compaction" && typeof record.tokensBefore === "number" && Number.isFinite(record.tokensBefore) ? { tokensBefore: record.tokensBefore } : {},
			...kind === "compaction" && typeof record.tokensAfter === "number" && Number.isFinite(record.tokensAfter) ? { tokensAfter: record.tokensAfter } : {},
			transcriptPosition,
			seq
		}
	};
}
//#endregion
export { sqliteMessageEventWithSeq as i, projectTranscriptEntryMessage as n, readTranscriptMessageIdempotencyKey as r, attachOpenClawTranscriptMeta as t };
