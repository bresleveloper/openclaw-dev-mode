import { c as normalizeVisibleMessageLimit } from "./session-accessor.sqlite-visible-cursor-CwElG0zY.mjs";
//#region src/config/sessions/session-transcript-raw-cursor.ts
const RAW_TRANSCRIPT_CURSOR_VERSION = 1;
const DEFAULT_RAW_TRANSCRIPT_MAX_EVENTS = 1e3;
const DEFAULT_RAW_TRANSCRIPT_MAX_BYTES = 1e6;
const MAX_RAW_TRANSCRIPT_EVENTS = 1e4;
const MAX_RAW_TRANSCRIPT_BYTES = 67108864;
function encodeRawTranscriptCursor(cursor) {
	return Buffer.from(JSON.stringify(cursor), "utf8").toString("base64url");
}
/** Mint the raw-delta cursor for a generation-consistent transcript snapshot. */
function createTranscriptRawDeltaCursor(params) {
	return encodeRawTranscriptCursor({
		...params,
		version: RAW_TRANSCRIPT_CURSOR_VERSION
	});
}
function parseRawTranscriptCursor(value) {
	if (value.length > 4096) return;
	try {
		const parsed = JSON.parse(Buffer.from(value, "base64url").toString("utf8"));
		if (parsed.version !== RAW_TRANSCRIPT_CURSOR_VERSION || typeof parsed.agentId !== "string" || typeof parsed.sessionId !== "string" || typeof parsed.generation !== "string" || !Number.isSafeInteger(parsed.lastSeq) || (parsed.lastSeq ?? -2) < -1) return;
		return parsed;
	} catch {
		return;
	}
}
function bootstrapRawTranscriptCursor(scope, generation) {
	return {
		agentId: scope.agentId,
		generation,
		lastSeq: -1,
		sessionId: scope.sessionId,
		version: RAW_TRANSCRIPT_CURSOR_VERSION
	};
}
/** Host adapters validate limits before acquiring a database handle. */
function normalizeRawDeltaLimits(limits) {
	return {
		maxEvents: normalizeVisibleMessageLimit(limits.maxEvents, DEFAULT_RAW_TRANSCRIPT_MAX_EVENTS, MAX_RAW_TRANSCRIPT_EVENTS, "maxEvents"),
		maxBytes: normalizeVisibleMessageLimit(limits.maxBytes, DEFAULT_RAW_TRANSCRIPT_MAX_BYTES, MAX_RAW_TRANSCRIPT_BYTES, "maxBytes")
	};
}
//#endregion
export { parseRawTranscriptCursor as a, normalizeRawDeltaLimits as i, createTranscriptRawDeltaCursor as n, encodeRawTranscriptCursor as r, bootstrapRawTranscriptCursor as t };
