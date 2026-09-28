import { j as resolveIntegerOption } from "./number-coercion-CLj0HTDM.mjs";
import { n as truncateUtf8Suffix } from "./utf8-truncate-_hf7tp13.mjs";
import { Buffer } from "node:buffer";
//#region src/agents/sessions/tools/limits.ts
/**
* Byte-limit helpers for session tool stderr/stdout tails.
*
* Tail storage is byte-bounded but decoded as UTF-8, so truncation avoids
* splitting multi-byte characters in display output.
*/
/** Normalizes optional positive numeric limits to a finite integer. */
function normalizePositiveLimit(value, fallback) {
	return resolveIntegerOption(value, fallback, { min: 1 });
}
/** Default stderr tail retained for long-running session tools. */
const SESSION_TOOL_STDERR_TAIL_BYTES = 65536;
/** Retains a UTF-8-safe tail and counts bytes discarded by this append. */
function appendBoundedTextTail(current, chunk, maxBytes = SESSION_TOOL_STDERR_TAIL_BYTES) {
	const effectiveMaxBytes = normalizePositiveLimit(maxBytes, SESSION_TOOL_STDERR_TAIL_BYTES);
	const combined = `${current}${chunk}`;
	const tail = truncateUtf8Suffix(combined, effectiveMaxBytes);
	return {
		tail,
		droppedBytes: Buffer.byteLength(combined) - Buffer.byteLength(tail)
	};
}
/** Label lost stderr before the retained diagnostic so it cannot look complete. */
function formatStderrTail(tail, droppedBytes, fallback) {
	const diagnostic = tail.trim() || fallback;
	return droppedBytes > 0 ? `[${droppedBytes} UTF-8 bytes of earlier stderr discarded at the ${SESSION_TOOL_STDERR_TAIL_BYTES}-byte retention cap]\n${diagnostic}` : diagnostic;
}
//#endregion
export { normalizePositiveLimit as i, appendBoundedTextTail as n, formatStderrTail as r, SESSION_TOOL_STDERR_TAIL_BYTES as t };
