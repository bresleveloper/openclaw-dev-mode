import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { n as projectSessionDisplayMessage } from "./session-display-projection-DDhSj356.mjs";
import { d as readSessionTranscriptTerminalModel, u as isSessionTranscriptTerminalModel } from "./session-transcript-authority-Bd3kv5VJ.mjs";
//#region src/gateway/session-row-transcript-preview.ts
const SESSION_ROW_TRANSCRIPT_PREVIEW_MAX_BYTES = 65536;
const SESSION_ROW_TRANSCRIPT_TERMINAL_MAX_BYTES = 262144;
/** Undefined needs a bounded tail lookup; a complete projection can include empty fields. */
function projectSessionRowTranscriptFields(event, serializedBytes, indexedSeq) {
	if (!isRecord(event) || event.type === "session" || !event.message) return;
	const projected = serializedBytes <= 65536 ? projectSessionDisplayMessage(event.message, { flattenMarkdown: true }) : null;
	if (!projected && serializedBytes <= 65536) return;
	return {
		lastMessagePreview: projected ? Buffer.from(projected.text, "utf16le").toString("utf16le") : null,
		terminalModel: serializedBytes <= 262144 ? readSessionTranscriptTerminalModel(event) : null,
		indexedSeq
	};
}
/** Older imports may preserve mtime while appending; their index still advances. */
function readStoredSessionRowTranscriptProjection(params) {
	if (!params.json || params.updatedAt !== params.transcriptUpdatedAt) return;
	try {
		const value = JSON.parse(params.json);
		return isRecord(value) && (value.lastMessagePreview === null || typeof value.lastMessagePreview === "string") && (value.terminalModel === null || isSessionTranscriptTerminalModel(value.terminalModel)) && value.indexedSeq === (params.indexedSeq ?? null) ? {
			lastMessagePreview: value.lastMessagePreview,
			terminalModel: value.terminalModel,
			indexedSeq: params.indexedSeq ?? null
		} : void 0;
	} catch {
		return;
	}
}
//#endregion
export { readStoredSessionRowTranscriptProjection as i, SESSION_ROW_TRANSCRIPT_TERMINAL_MAX_BYTES as n, projectSessionRowTranscriptFields as r, SESSION_ROW_TRANSCRIPT_PREVIEW_MAX_BYTES as t };
