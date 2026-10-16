import { r as sha256HexPrefixCore } from "./node-crypto-BG4u3UnX.mjs";
import "./crypto-digest-y6oZN-_F.mjs";
//#region src/infra/diagnostic-error-metadata.ts
const HTTP_STATUS_MIN = 100;
const HTTP_STATUS_MAX = 599;
const REQUEST_ID_HASH_PREFIX_LEN = 12;
const PROVIDER_REQUEST_ID_KEYS = [
	"upstreamRequestId",
	"providerRequestId",
	"requestId",
	"request_id"
];
const PROVIDER_REQUEST_ID_RE = /^[A-Za-z0-9._:-]{1,128}$/u;
const PROVIDER_REQUEST_ID_TEXT_PATTERNS = [/\b(?:x-request-id|request-id|request_id|requestId|trace-id|trace_id)\b["'\s:=([]+([A-Za-z0-9._:-]{1,128})/i, /\((?:request_id|trace_id)\s*:\s*([A-Za-z0-9._:-]{1,128})\)/i];
const FAILURE_KIND_BY_CODE = /* @__PURE__ */ new Map([
	["ABORT_ERR", "aborted"],
	["ECONNABORTED", "aborted"],
	["ERR_ABORTED", "aborted"],
	["ECONNRESET", "connection_reset"],
	["ERR_STREAM_PREMATURE_CLOSE", "connection_closed"],
	["UND_ERR_SOCKET", "connection_closed"],
	["ETIMEDOUT", "timeout"],
	["ERR_SOCKET_CONNECTION_TIMEOUT", "timeout"]
]);
const FAILURE_KIND_BY_MESSAGE = [
	[/\b(?:terminated|sigkill|sigterm)\b/i, "terminated"],
	[/\b(?:econnreset|connection reset)\b/i, "connection_reset"],
	[/\b(?:socket hang up|premature close|connection closed|other side closed)\b/i, "connection_closed"],
	[/\b(?:timed out|timeout|etimedout)\b/i, "timeout"],
	[/\b(?:aborted|abort_err|operation was aborted)\b/i, "aborted"]
];
function isObjectLike(value) {
	return (typeof value === "object" || typeof value === "function") && value !== null;
}
function readOwnDataProperty(value, key) {
	if (!isObjectLike(value)) return;
	try {
		const descriptor = Object.getOwnPropertyDescriptor(value, key);
		return descriptor && "value" in descriptor ? descriptor.value : void 0;
	} catch {
		return;
	}
}
function findDiagnosticErrorProperty(err, reader, seen = /* @__PURE__ */ new Set()) {
	const direct = reader(err);
	if (direct !== void 0) return direct;
	if (!isObjectLike(err) || seen.has(err)) return;
	seen.add(err);
	return findDiagnosticErrorProperty(readOwnDataProperty(err, "error"), reader, seen) ?? findDiagnosticErrorProperty(readOwnDataProperty(err, "cause"), reader, seen);
}
function isHttpStatusCode(value) {
	return typeof value === "number" && Number.isInteger(value) && value >= HTTP_STATUS_MIN && value <= HTTP_STATUS_MAX;
}
function normalizeProviderRequestId(value) {
	if (typeof value === "string") {
		const trimmed = value.trim();
		return PROVIDER_REQUEST_ID_RE.test(trimmed) ? trimmed : void 0;
	}
	if (typeof value === "number" && Number.isFinite(value) || typeof value === "bigint") {
		const normalized = String(value);
		return PROVIDER_REQUEST_ID_RE.test(normalized) ? normalized : void 0;
	}
}
function hashDiagnosticIdentifier(value) {
	return `sha256:${sha256HexPrefixCore(value, REQUEST_ID_HASH_PREFIX_LEN)}`;
}
function readDirectProviderRequestId(err) {
	for (const key of PROVIDER_REQUEST_ID_KEYS) {
		const normalized = normalizeProviderRequestId(readOwnDataProperty(err, key));
		if (normalized) return normalized;
	}
}
function readDirectMessage(err) {
	if (typeof err === "string") return err;
	const message = readOwnDataProperty(err, "message");
	return typeof message === "string" ? message : void 0;
}
function readDirectCode(err) {
	const code = readOwnDataProperty(err, "code");
	return typeof code === "string" ? code : void 0;
}
function extractProviderRequestIdFromText(text) {
	if (!text) return;
	for (const pattern of PROVIDER_REQUEST_ID_TEXT_PATTERNS) {
		const normalized = normalizeProviderRequestId(text.match(pattern)?.[1]);
		if (normalized) return normalized;
	}
}
/** Returns a low-cardinality error category without trusting mutable `Error.name`. */
function diagnosticErrorCategory(err) {
	try {
		if (err instanceof TypeError) return "TypeError";
		if (err instanceof RangeError) return "RangeError";
		if (err instanceof ReferenceError) return "ReferenceError";
		if (err instanceof SyntaxError) return "SyntaxError";
		if (err instanceof URIError) return "URIError";
		if (typeof AggregateError !== "undefined" && err instanceof AggregateError) return "AggregateError";
		if (err instanceof Error) return "Error";
	} catch {
		return "unknown";
	}
	if (err === null) return "null";
	return typeof err;
}
/** Reads only an own data property so diagnostics never invoke a user-defined getter. */
function diagnosticErrorMessage(err) {
	return readDirectMessage(err)?.trim() || void 0;
}
/** Extracts a safe HTTP status code from own `status` or `statusCode` data properties. */
function diagnosticHttpStatusCode(err) {
	for (const key of ["status", "statusCode"]) {
		const status = readOwnDataProperty(err, key);
		if (isHttpStatusCode(status)) return String(status);
	}
}
/** Classifies transport-style failures without exposing raw error messages. */
function diagnosticErrorFailureKind(err) {
	const code = findDiagnosticErrorProperty(err, readDirectCode)?.trim().toUpperCase();
	const kind = code === void 0 ? void 0 : FAILURE_KIND_BY_CODE.get(code);
	if (kind) return kind;
	const message = findDiagnosticErrorProperty(err, readDirectMessage);
	if (!message) return;
	return FAILURE_KIND_BY_MESSAGE.find(([pattern]) => pattern.test(message))?.[1];
}
/** Extracts and hashes bounded provider request ids so diagnostics never expose raw ids. */
function diagnosticProviderRequestIdHash(err) {
	const fromProperty = findDiagnosticErrorProperty(err, readDirectProviderRequestId);
	if (fromProperty) return hashDiagnosticIdentifier(fromProperty);
	const fromMessage = findDiagnosticErrorProperty(err, (candidate) => extractProviderRequestIdFromText(readDirectMessage(candidate)));
	return fromMessage ? hashDiagnosticIdentifier(fromMessage) : void 0;
}
//#endregion
export { diagnosticProviderRequestIdHash as a, diagnosticHttpStatusCode as i, diagnosticErrorFailureKind as n, diagnosticErrorMessage as r, diagnosticErrorCategory as t };
