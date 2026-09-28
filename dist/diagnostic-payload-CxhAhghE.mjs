import { C as parseStrictNonNegativeInteger } from "./number-coercion-CLj0HTDM.mjs";
import { a as emitInternalDiagnosticEvent } from "./diagnostic-events-CVabF32H.mjs";
//#region src/logging/diagnostic-payload.ts
/** Emits a normalized diagnostic event for rejected, truncated, or chunked payloads. */
function logLargePayload(params) {
	emitInternalDiagnosticEvent({
		type: "payload.large",
		...params
	});
}
/** Convenience wrapper for payloads rejected before downstream processing. */
function logRejectedLargePayload(params) {
	logLargePayload({
		action: "rejected",
		...params
	});
}
/** Parses an HTTP Content-Length header without accepting malformed numeric input. */
function parseContentLengthHeader(raw) {
	const value = Array.isArray(raw) ? raw[0] : raw;
	if (typeof value !== "string") return;
	const trimmed = value.trim();
	if (trimmed.length === 0 || !/^\d+$/.test(trimmed)) return;
	return parseStrictNonNegativeInteger(trimmed);
}
//#endregion
export { logRejectedLargePayload as n, parseContentLengthHeader as r, logLargePayload as t };
