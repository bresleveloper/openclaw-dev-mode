import { i as asOptionalRecord } from "./record-coerce-BgUo6bj4.mjs";
import { s as normalizeStringifiedOptionalString } from "./string-coerce-CpcyRbc6.mjs";
import { t as expectDefined } from "./expect-DqyhV9d8.mjs";
import { t as stableStringify } from "./stable-stringify-CGB-o900.mjs";
import "./src-CNWvILd1.mjs";
import { parseRetryAfterHeadersSeconds, resolveProviderErrorRetrySeconds } from "./internal/retry-after.mjs";
import { n as estimateBase64DecodedBytes } from "./base64-FdymvxN9.mjs";
// packages/normalization-core/src/balanced-json.ts
function isJsonOpeningDelimiter(char, openers) {
	return (char === "{" || char === "[") && openers.includes(char);
}
function extractBalancedJsonAt(raw, opts, offset) {
	const openers = opts.openers ?? ["{", "["];
	let start = offset;
	if (!opts.skipQuotedOpeners) while (start < raw.length && !isJsonOpeningDelimiter(raw[start], openers)) start += 1;
	const stack = [];
	let inString = false;
	let escaped = false;
	for (let index = start; index < raw.length; index += 1) {
		const char = raw[index];
		if (inString) {
			if (escaped) escaped = false;
			else if (char === "\\") escaped = true;
			else if (char === "\"") inString = false;
		} else if (char === "\"") inString = true;
		else if (isJsonOpeningDelimiter(char, openers)) {
			if (stack.length === 0) start = index;
			stack.push(char);
		} else if (stack.length > 0 && char === (stack.at(-1) === "{" ? "}" : "]")) {
			stack.pop();
			if (stack.length === 0) return {
				json: raw.slice(start, index + 1),
				startIndex: start,
				endIndex: index
			};
		}
	}
	return null;
}
/** Extracts every balanced JSON object/array fragment from arbitrary text. */
function extractBalancedJsonFragments(raw, opts = {}) {
	const fragments = [];
	for (let offset = 0; offset < raw.length;) {
		const fragment = extractBalancedJsonAt(raw, opts, offset);
		if (!fragment) break;
		fragments.push(fragment);
		offset = fragment.endIndex + 1;
	}
	return fragments;
}
// packages/normalization-core/src/utf16-slice.ts
function isHighSurrogate(codeUnit) {
	return codeUnit >= 55296 && codeUnit <= 56319;
}
function isLowSurrogate(codeUnit) {
	return codeUnit >= 56320 && codeUnit <= 57343;
}
/** Slices a UTF-16 string without returning dangling surrogate halves at either edge. */
function sliceUtf16Safe(input, start, end) {
	const len = input.length;
	let from = start < 0 ? Math.max(len + start, 0) : Math.min(start, len);
	let to = end === void 0 ? len : end < 0 ? Math.max(len + end, 0) : Math.min(end, len);
	if (to <= from) return "";
	if (from > 0 && from < len) {
		if (isLowSurrogate(input.charCodeAt(from)) && isHighSurrogate(input.charCodeAt(from - 1))) from += 1;
	}
	if (to > 0 && to < len) {
		if (isHighSurrogate(input.charCodeAt(to - 1)) && isLowSurrogate(input.charCodeAt(to))) to -= 1;
	}
	return input.slice(from, to);
}
/** Truncates a UTF-16 string without cutting a surrogate pair in half. */
function truncateUtf16Safe(input, maxLen) {
	const limit = Math.max(0, Math.floor(maxLen));
	if (input.length <= limit) return input;
	return sliceUtf16Safe(input, 0, limit);
}
// packages/ai/src/utils/credential-redaction.ts
const NON_CREDENTIAL_FIELD_NAMES = /* @__PURE__ */ new Set([
	"passwordfile",
	"tokenbudget",
	"tokencount",
	"tokenfield",
	"tokenlimit",
	"tokens"
]);
const CREDENTIAL_FIELD_SUFFIX_RE = /(?:apikey|cookie|credential|passphrase|passwd|password|privatekey|secret|secret(?:access)?key|signingkey|token)$/u;
const MEDIA_PAYLOAD_SUFFIXES = "base64|blob|buffer|bytes|data|delta|frames?|output|result|(?:file|media|source)?(?:uri|url)";
const MEDIA_FIELD_NAME_RE = new RegExp(`^(?:input|output)?(?:audio|image|video)s?(?:${MEDIA_PAYLOAD_SUFFIXES})*$`, "u");
const MEDIA_PAYLOAD_SUFFIX_RE = new RegExp(`^(?:${MEDIA_PAYLOAD_SUFFIXES})$`, "u");
const MEDIA_WRAPPER_NAME_RE = /^(?:input_|output_)?(?:audio|image|video)s?(?:_|$)/iu;
const DIAGNOSTIC_FIELD_SEPARATOR_RE = /[^a-z0-9]/g;
const MEDIA_TYPE_RE = /^(?:input|output)?(?:audio|image|video)/u;
const MEDIA_MIME_RE = /^(?:audio|image|video)\//iu;
const MEDIA_ARRAY_INDEX_RE = /^(?:0|[1-9]\d*)$/u;
const MEDIA_URL_SUFFIX_RE = /(?:uri|url)$/u;
const MEDIA_MIME_FIELDS = [
	"mimeType",
	"mime_type",
	"mediaType",
	"media_type",
	"contentType",
	"content_type"
];
const AUTHORIZATION_VALUE_RE = /\b(Bearer|Basic)\s+[A-Za-z0-9+/._~=-]{8,}/giu;
const JWT_VALUE_RE = /\beyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\b/gu;
const COOKIE_HEADER_RE = /\b((?:set-)?cookie\s*:\s*)([^\r\n]+)/giu;
const QUOTED_CREDENTIAL_HEADER_RE = /(["'])((?:[A-Za-z][A-Za-z0-9_.-]*[_.-])?(?:api[_.-]?key|authorization|passphrase|passwd|password|private[_.-]?key|secret(?:[_.-]?access)?[_.-]?key|signing[_.-]?key|token))\1\s*:\s*([^,}\r\n]+)/giu;
const CREDENTIAL_HEADER_RE = /\b((?:[A-Za-z][A-Za-z0-9_.-]*[_.-])?(?:api[_.-]?key|authorization|passphrase|passwd|password|private[_.-]?key|secret(?:[_.-]?access)?[_.-]?key|signing[_.-]?key|token))\s*:\s*([^\r\n]+)/giu;
const LOOSE_QUOTED_CREDENTIAL_PAIR_RE = /\b((?!(?:api|endpoint|method|model|provider|status|type)=)[A-Za-z][A-Za-z0-9_.-]{0,64})=(["'])([A-Za-z0-9+/._~%=-]{16,})\2/giu;
const LOOSE_CREDENTIAL_PAIR_RE = /\b((?!(?:api|endpoint|method|model|provider|status|type)=)[A-Za-z][A-Za-z0-9_.-]{0,64})=([A-Za-z0-9+/._~%=-]{16,})(?=[;&#'"\s]|$)/giu;
const MEDIA_DATA_URL_RE = /data:(?:audio|image|video)\/[a-z0-9.+-]+(?:;[^,;\s]+)*;base64,[ \t]*(?:\r?\n[ \t]*)?[a-z0-9+/_=-]+(?:[ \t]*\r?\n[ \t]*[a-z0-9+/_=-]+)*/giu;
const MAX_DIAGNOSTIC_JSON_LENGTH = 16384;
const UNCHANGED_DIAGNOSTIC_TEXT_MAX_ENTRIES = 2048;
const UNCHANGED_DIAGNOSTIC_TEXT_MAX_LENGTH = 2048;
const unchangedDiagnosticText = /* @__PURE__ */ new Set();
const BRACKET_PROSE_PATTERN = String.raw`(\[+)([A-Za-z][A-Za-z0-9 _.-]*|\s*\d+\s+(?!(?:true|false|null)(?![\w-]))[A-Za-z][A-Za-z0-9 _.=-]*)(\]+)`;
const BRACKET_PROSE_RE = new RegExp(`^${BRACKET_PROSE_PATTERN}$`, "u");
const BRACKET_PROSE_PART_RE = new RegExp(String.raw`(?<!\[)${BRACKET_PROSE_PATTERN}`, "gu");
const JSON_LITERAL_PROSE_START_RE = /^(?:true|false|null)\b(?!-)/u;
const PROSE_ASSIGNMENT_RE = /(?<![A-Za-z0-9_.-])([A-Za-z0-9_.-]+)\s*(?:=\s*)+(?=([^=;&\s\]'"},]+))/gu;
const PRIVATE_KEY_HEADER_RE = /-----BEGIN [A-Z ]*PRIVATE KEY/iu;
const JSON_ARRAY_START_RE = /\[\s*(?:[{"\d\]-]|true\b|false\b|null\b)/u;
const MALFORMED_JSON_RE = /\{|(?:"[^"]+"|\b(?:b64_json|data|(?:input|output)?(?:audio|image|video)[\w-]*))\s*:/iu;
function looksLikeDiagnosticJson(value) {
	return JSON_ARRAY_START_RE.test(value) || MALFORMED_JSON_RE.test(value);
}
function isPlainBracketProse(value) {
	const match = BRACKET_PROSE_RE.exec(value);
	return match !== null && expectDefined(match[1], "opening brackets").length === expectDefined(match[3], "closing brackets").length && !JSON_LITERAL_PROSE_START_RE.test(expectDefined(match[2], "bracket prose"));
}
function hasSensitiveProseContent(value) {
	if (PRIVATE_KEY_HEADER_RE.test(value)) return true;
	let mediaContext = false;
	let contextualPayload = false;
	for (const match of value.matchAll(PROSE_ASSIGNMENT_RE)) {
		const assigned = expectDefined(match[2], "diagnostic assignment value");
		const valueEnd = match.index + match[0].length + assigned.length;
		if (assigned === "<redacted>" && value[valueEnd] !== "=") continue;
		const key = expectDefined(match[1], "diagnostic assignment field");
		const normalized = normalizeDiagnosticFieldName(key);
		if (isCredentialFieldName(normalized) || extractDiagnosticMediaField(key, normalized, void 0, false)) return true;
		mediaContext ||= isDiagnosticMediaPayload({ [key]: assigned });
		contextualPayload ||= Boolean(extractDiagnosticMediaField(key, normalized, void 0, true));
		if (mediaContext && contextualPayload) return true;
	}
	return false;
}
const normalizedDiagnosticFieldNames = /* @__PURE__ */ new Map();
const NORMALIZED_DIAGNOSTIC_FIELD_NAMES_MAX_ENTRIES = 4096;
function normalizeDiagnosticFieldName(value) {
	let normalized = normalizedDiagnosticFieldNames.get(value);
	if (normalized === void 0) {
		normalized = value.toLowerCase().replaceAll(DIAGNOSTIC_FIELD_SEPARATOR_RE, "");
		if (normalizedDiagnosticFieldNames.size >= NORMALIZED_DIAGNOSTIC_FIELD_NAMES_MAX_ENTRIES) normalizedDiagnosticFieldNames.clear();
		normalizedDiagnosticFieldNames.set(value, normalized);
	}
	return normalized;
}
/** Classifies credential-bearing fields, including case-insensitive HTTP header names. */
function isCredentialFieldName(name) {
	const normalized = normalizeDiagnosticFieldName(name);
	if (!normalized || NON_CREDENTIAL_FIELD_NAMES.has(normalized)) return false;
	return normalized === "authorization" || normalized === "proxyauthorization" || CREDENTIAL_FIELD_SUFFIX_RE.test(normalized);
}
function redactCredentialText(value) {
	return value.replace(AUTHORIZATION_VALUE_RE, "$1 <redacted>").replace(JWT_VALUE_RE, "<redacted-jwt>").replace(COOKIE_HEADER_RE, "$1<redacted>").replace(QUOTED_CREDENTIAL_HEADER_RE, "$1$2$1: <redacted>").replace(CREDENTIAL_HEADER_RE, "$1: <redacted>").replace(LOOSE_QUOTED_CREDENTIAL_PAIR_RE, "$1=$2<redacted>$2").replace(LOOSE_CREDENTIAL_PAIR_RE, "$1=<redacted>");
}
function diagnosticBytes(value, numericArrays = false) {
	return value instanceof ArrayBuffer ? new Uint8Array(value) : ArrayBuffer.isView(value) ? new Uint8Array(value.buffer, value.byteOffset, value.byteLength) : numericArrays && Array.isArray(value) && value.every((byte) => Number.isInteger(byte) && byte >= 0 && byte <= 255) ? Uint8Array.from(value) : void 0;
}
function readDiagnosticField(value, descriptors, key) {
	return descriptors ? descriptors[key]?.value : Object.hasOwn(value, key) ? Reflect.get(value, key) : void 0;
}
function isDiagnosticMediaPayload(value, descriptors) {
	const type = readDiagnosticField(value, descriptors, "type");
	if (typeof type === "string" && MEDIA_TYPE_RE.test(normalizeDiagnosticFieldName(type))) return true;
	for (const key of MEDIA_MIME_FIELDS) {
		const mime = readDiagnosticField(value, descriptors, key);
		if (typeof mime === "string" && MEDIA_MIME_RE.test(mime)) return true;
	}
	return false;
}
function extractDiagnosticMediaField(key, normalized, value, parentMedia) {
	const privateField = normalized === "b64json";
	const mediaField = MEDIA_FIELD_NAME_RE.test(normalized) || MEDIA_WRAPPER_NAME_RE.test(key);
	const contextualPayload = parentMedia && MEDIA_PAYLOAD_SUFFIX_RE.test(normalized);
	if (!privateField && !mediaField && !contextualPayload) return parentMedia && value !== null && (typeof value === "object" || MEDIA_ARRAY_INDEX_RE.test(key)) ? { kind: "context" } : void 0;
	if (MEDIA_URL_SUFFIX_RE.test(normalized)) return { kind: "redacted" };
	const encoded = diagnosticBytes(value, true) ?? (typeof value === "string" ? value : void 0);
	if (encoded === void 0) return { kind: privateField || Array.isArray(value) ? "redacted" : "context" };
	return {
		kind: "redacted",
		bytes: typeof encoded === "string" ? estimateBase64DecodedBytes(encoded) : encoded.byteLength,
		source: encoded
	};
}
function projectDiagnosticValue(value, policy = {}, seen, mediaPayload, state) {
	return projectValue(false, value, policy, seen, mediaPayload, state);
}
/** Internal producers transfer fresh ordinary records and dense arrays; arrays may be reused. */
function projectPreparedDiagnosticValue(value, policy) {
	return projectValue(true, value, policy);
}
function projectValue(producerOwned, value, policy = {}, seen = /* @__PURE__ */ new WeakSet(), mediaPayload = false, state = {
	changed: false,
	nodesRemaining: policy.maxNodes ?? 64
}) {
	try {
		if (typeof value === "string") {
			const projected = policy.redactCredentials === false ? value.replace(MEDIA_DATA_URL_RE, "<redacted>") : redactDiagnosticText(value);
			state.changed ||= projected !== value;
			return projected;
		}
		if (!value || typeof value !== "object") return value;
		const binary = diagnosticBytes(value);
		if (binary) {
			state.changed = true;
			return policy.projectBinary?.(binary) ?? {
				redacted: "<redacted>",
				bytes: binary.byteLength
			};
		}
		if (seen.has(value)) return "[Circular]";
		if (state.nodesRemaining-- <= 0) {
			state.changed = true;
			return "[Truncated]";
		}
		const array = Array.isArray(value);
		if (!array && (!producerOwned || Object.getPrototypeOf(value) !== Object.prototype)) try {
			Headers.prototype.has.call(value, "retry-after");
			const seconds = parseRetryAfterHeadersSeconds(value);
			state.changed = true;
			return seconds === void 0 ? {} : { "retry-after-ms": seconds * 1e3 };
		} catch {}
		const keys = Reflect.ownKeys(value);
		const maxKeys = policy.maxKeys ?? 64;
		const trusted = keys.length <= maxKeys && producerOwned && Object.getPrototypeOf(value) === (array ? Array.prototype : Object.prototype);
		let descriptors;
		if (!trusted) {
			const snapshot = Object.create(null);
			for (let index = 0; index < Math.min(keys.length, maxKeys); index += 1) {
				const key = keys[index];
				if (typeof key !== "string") continue;
				const descriptor = Object.getOwnPropertyDescriptor(value, key);
				if (descriptor) snapshot[key] = descriptor;
			}
			descriptors = snapshot;
		}
		state.changed ||= keys.length > maxKeys;
		seen.add(value);
		const out = Array.isArray(value) ? trusted && !policy.omitField ? value : [] : {};
		let redactValueField = false;
		if (policy.redactCredentials !== false) {
			const name = readDiagnosticField(value, descriptors, "name");
			const rawName = typeof name === "string" ? name : readDiagnosticField(value, descriptors, "key");
			redactValueField = keys.length > maxKeys || typeof rawName === "string" && isCredentialFieldName(normalizeDiagnosticFieldName(rawName));
		}
		const redactMedia = mediaPayload || keys.length > maxKeys || isDiagnosticMediaPayload(value, descriptors);
		for (const key of descriptors ? Object.keys(descriptors) : keys) {
			if (typeof key !== "string" || key === "length") continue;
			let child;
			if (descriptors) {
				const descriptor = expectDefined(descriptors[key], "diagnostic descriptor");
				if (!("value" in descriptor) || !descriptor.enumerable && (policy.propertyScope === "enumerable" || ![
					"cause",
					"errors",
					"message",
					"name",
					"stack"
				].includes(key))) continue;
				child = descriptor.value;
			} else child = Reflect.get(value, key);
			const normalized = policy.omitField?.(key) ? void 0 : normalizeDiagnosticFieldName(key);
			if (normalized === void 0 || policy.redactCredentials !== false && isCredentialFieldName(normalized)) {
				state.changed = true;
				continue;
			}
			if (redactValueField && key === "value") {
				out[key] = "<redacted>";
				state.changed = true;
				continue;
			}
			const media = extractDiagnosticMediaField(key, normalized, child, redactMedia);
			if (media?.kind === "redacted") {
				const redacted = media.bytes === void 0 ? "<redacted>" : {
					redacted: "<redacted>",
					bytes: media.bytes
				};
				Object.assign(out, policy.projectMedia?.(key, media) ?? { [key]: redacted });
				state.changed = true;
				continue;
			}
			out[key] = projectValue(producerOwned, child, policy, seen, media?.kind === "context", state);
		}
		return out;
	} catch {
		state.changed = true;
		return "[Unserializable]";
	}
}
/** Redacts bounded structured JSON while preserving harmless diagnostic text byte-for-byte. */
function redactDiagnosticText(value) {
	if (unchangedDiagnosticText.has(value)) return value;
	const projected = projectDiagnosticText(value);
	if (projected === value && value.length <= UNCHANGED_DIAGNOSTIC_TEXT_MAX_LENGTH) {
		if (unchangedDiagnosticText.size >= UNCHANGED_DIAGNOSTIC_TEXT_MAX_ENTRIES) unchangedDiagnosticText.clear();
		unchangedDiagnosticText.add(value);
	}
	return projected;
}
function projectDiagnosticText(value) {
	const text = redactCredentialText(value).replace(MEDIA_DATA_URL_RE, "<redacted>");
	if (!looksLikeDiagnosticJson(text)) return text;
	const allowProse = !hasSensitiveProseContent(text);
	if (text.length > MAX_DIAGNOSTIC_JSON_LENGTH) {
		const remaining = allowProse && !MALFORMED_JSON_RE.test(text) ? text.replace(BRACKET_PROSE_PART_RE, (part) => isPlainBracketProse(part) ? "" : part) : text;
		if (allowProse && !/[[\]{}]/u.test(remaining) && !MALFORMED_JSON_RE.test(text)) return text;
		return "[Oversized diagnostic JSON redacted]";
	}
	let cursor = 0;
	let redacted = "";
	let unstructured = "";
	for (const fragment of extractBalancedJsonFragments(text)) {
		const plainText = text.slice(cursor, fragment.startIndex);
		unstructured += plainText;
		redacted += plainText;
		if (allowProse && isPlainBracketProse(fragment.json)) {
			redacted += fragment.json;
			cursor = fragment.endIndex + 1;
			continue;
		}
		try {
			const state = {
				changed: false,
				nodesRemaining: 64
			};
			const projected = projectValue(true, JSON.parse(fragment.json), {}, /* @__PURE__ */ new WeakSet(), false, state);
			redacted += state.changed ? stableStringify(projected) : fragment.json;
		} catch {
			return "[Malformed diagnostic JSON redacted]";
		}
		cursor = fragment.endIndex + 1;
	}
	const remainder = text.slice(cursor);
	return looksLikeDiagnosticJson(unstructured + remainder) ? "[Malformed diagnostic JSON redacted]" : redacted + remainder;
}
// packages/ai/src/utils/provider-error.ts
const MAX_ERROR_BODY_LENGTH = 4e3;
/** Diagnostics accept provider classification labels, not arbitrary error prose or objects. */
function readTransportDiagnosticLabel(value) {
	if (typeof value === "number") return Number.isFinite(value) ? value : void 0;
	return typeof value === "string" && /^[a-zA-Z0-9_.:-]{1,128}$/.test(value) ? value : void 0;
}
let providerErrorRedactor;
function configureProviderErrorRedactor(redactor) {
	const previous = providerErrorRedactor;
	providerErrorRedactor = redactor;
	return previous;
}
function readProviderErrorField(record, key) {
	const value = record?.[key];
	return typeof value === "string" || typeof value === "number" && Number.isFinite(value) ? normalizeStringifiedOptionalString(value) : void 0;
}
function readCauseCode(error) {
	const seen = /* @__PURE__ */ new Set();
	for (let cause = asOptionalRecord(error.cause); cause && seen.size < 8 && !seen.has(cause); cause = asOptionalRecord(cause.cause)) {
		seen.add(cause);
		const code = readProviderErrorField(cause, "code");
		if (code) return code;
	}
}
function truncateField(text, maxLength) {
	return text.length <= maxLength ? text : `${truncateUtf16Safe(text, maxLength)}... [truncated]`;
}
function stringifyField(value, maxLength) {
	if (value === void 0 || value === null) return;
	const text = redactDiagnosticText((typeof value === "string" ? value : stableStringify(value)).trim());
	if (!text) return;
	return maxLength === void 0 ? text : truncateField(text, maxLength);
}
function buildProjection(snapshot, signal) {
	const error = asOptionalRecord(snapshot);
	const response = asOptionalRecord(error?.response);
	const nestedError = asOptionalRecord(error?.error) ?? asOptionalRecord(response?.error) ?? asOptionalRecord(asOptionalRecord(error?.payload)?.error);
	const status = [
		error?.status,
		error?.statusCode,
		response?.status,
		response?.statusCode
	].find((value) => typeof value === "number" && Number.isFinite(value));
	const body = stringifyField(error?.errorBody ?? error?.body ?? response?.body ?? response?.data ?? nestedError);
	const originalMessage = (typeof snapshot === "string" ? snapshot : void 0) ?? readProviderErrorField(error, "message") ?? readProviderErrorField(nestedError, "message");
	const genericMessage = originalMessage === `${status} status code (no body)`;
	let errorMessage = status !== void 0 && body && (!originalMessage || genericMessage) ? `${status}: ${body}` : originalMessage ?? body ?? stringifyField(snapshot, MAX_ERROR_BODY_LENGTH) ?? "Unknown provider error";
	if (status !== void 0 && originalMessage && !originalMessage.startsWith(String(status))) errorMessage = `${status}: ${errorMessage}`;
	const rawMetadata = stringifyField(asOptionalRecord(nestedError?.metadata)?.raw, MAX_ERROR_BODY_LENGTH);
	if (rawMetadata && !errorMessage.includes(rawMetadata)) errorMessage += `\n${rawMetadata}`;
	const errorCode = readProviderErrorField(error, "errorCode") ?? readProviderErrorField(error, "code") ?? readProviderErrorField(nestedError, "code") ?? (error ? readCauseCode(error) : void 0) ?? (status === void 0 ? void 0 : String(status));
	const errorType = readProviderErrorField(error, "errorType") ?? readProviderErrorField(error, "type") ?? readProviderErrorField(nestedError, "type");
	return {
		stopReason: signal?.aborted ? "aborted" : "error",
		errorMessage: stringifyField(errorMessage, 4096) ?? "Unknown provider error",
		...errorCode ? { errorCode: truncateUtf16Safe(errorCode, 256) } : {},
		...errorType ? { errorType: truncateUtf16Safe(errorType, 256) } : {},
		...body ? { errorBody: truncateField(body, 500) } : {}
	};
}
/** Projects one hostile provider throw into final, bounded assistant terminal fields. */
function projectProviderError(error, signal) {
	try {
		const retryAfterSeconds = resolveProviderErrorRetrySeconds(error);
		const localSnapshot = projectDiagnosticValue(error);
		let snapshot = localSnapshot;
		try {
			snapshot = providerErrorRedactor?.(localSnapshot) ?? localSnapshot;
		} catch {}
		const projection = buildProjection(snapshot, signal);
		if (retryAfterSeconds !== void 0) {
			const retryAfterMs = Math.ceil(retryAfterSeconds * 1e3);
			if (Number.isSafeInteger(retryAfterMs)) projection.retryAfterMs = retryAfterMs;
			else projection.retryAfterMs = null;
			const suffix = `; Retry-After: ${retryAfterSeconds} seconds`;
			projection.errorMessage = `${truncateUtf16Safe(projection.errorMessage, 4096 - suffix.length)}${suffix}`;
		}
		return projection;
	} catch {
		return {
			stopReason: signal?.aborted ? "aborted" : "error",
			errorMessage: "Unknown provider error"
		};
	}
}
export { projectDiagnosticValue as a, truncateUtf16Safe as c, isCredentialFieldName as i, projectProviderError as n, projectPreparedDiagnosticValue as o, readTransportDiagnosticLabel as r, redactDiagnosticText as s, configureProviderErrorRedactor as t };
