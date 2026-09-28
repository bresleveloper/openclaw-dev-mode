import { o as normalizeStringifiedOptionalString } from "./string-coerce-fsri9iCu.mjs";
import { i as asOptionalRecord } from "./record-coerce-DwRYMj3t.mjs";
import { t as truncateUtf16Safe } from "./utf16-slice-CvGodqok.mjs";
import { t as expectDefined } from "./expect-lbe3Hgrh.mjs";
import { n as estimateBase64DecodedBytes } from "./base64-CPmadnUf.mjs";
import { parseRetryAfterErrorSeconds, parseRetryAfterHeadersSeconds } from "./internal/retry-after.mjs";
//#region packages/normalization-core/src/balanced-json.ts
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
//#endregion
//#region packages/normalization-core/src/cjk-chars.ts
const WEIGHTED_CJK_RANGES = [
	[
		[183, 183],
		[12288, 12703],
		[19968, 40869],
		[44032, 55215],
		[65281, 65376]
	],
	[
		[4352, 4607],
		[11904, 12287],
		[12704, 19967],
		[40870, 40959],
		[40960, 42239],
		[42752, 42759],
		[43360, 43391],
		[55216, 55295],
		[63744, 64255]
	],
	[
		[711, 711],
		[713, 715],
		[729, 729],
		[746, 747],
		[773, 773],
		[803, 803],
		[65040, 65103],
		[65377, 65500],
		[65504, 65510]
	],
	[[119648, 119665]],
	[
		[94176, 94207],
		[110576, 110591],
		[110592, 110959],
		[127488, 127743],
		[131072, 195103],
		[196608, 210047]
	]
];
new RegExp(`[${WEIGHTED_CJK_RANGES.flatMap((ranges) => ranges.map(([start, end]) => `\\u{${start.toString(16)}}-\\u{${end.toString(16)}}`)).join("")}]`, "u");
(() => {
	const maxCodePoint = Math.max(...WEIGHTED_CJK_RANGES.flatMap((ranges) => ranges.map(([, end]) => end)));
	const categories = new Uint8Array(maxCodePoint + 1);
	for (const [bucket, ranges] of WEIGHTED_CJK_RANGES.entries()) for (const [start, end] of ranges) categories.fill(bucket + 1, start, end + 1);
	return categories;
})();
//#endregion
//#region packages/normalization-core/src/stable-stringify.ts
const preserveString = (value) => value;
/** Deterministically stringifies values, optionally normalizing strings before key ordering. */
function stableStringify(value, normalizeString = preserveString) {
	return stringifyStableValue(value, /* @__PURE__ */ new WeakSet(), normalizeString);
}
function stringifyStableValue(value, stack, normalizeString, write) {
	if (value === null || value === void 0) return String(value);
	if (typeof value === "number" && !Number.isFinite(value)) return JSON.stringify(String(value));
	if (typeof value === "bigint") return JSON.stringify(value.toString());
	if (typeof value === "string") return JSON.stringify(normalizeString(value));
	if (typeof value !== "object") return JSON.stringify(value) ?? "null";
	if (stack.has(value)) return JSON.stringify("[Circular]");
	stack.add(value);
	try {
		return stringifyObjectValue(value, stack, normalizeString, write);
	} finally {
		stack.delete(value);
	}
}
function stringifyObjectValue(value, stack, normalizeString, write) {
	if (value instanceof Error) return stringifyStableValue({
		name: value.name,
		message: value.message,
		stack: value.stack
	}, stack, normalizeString, write);
	if (value instanceof Uint8Array) return stringifyStableValue({
		type: "Uint8Array",
		data: encodeBase64(value)
	}, stack, normalizeString, write);
	if (Array.isArray(value)) {
		if (write) {
			write("[");
			let separator = "";
			for (const entry of value) {
				write(separator);
				write(stringifyStableValue(entry, stack, normalizeString, write));
				separator = ",";
			}
			write("]");
			return "";
		}
		const serializedEntries = [];
		for (const entry of value) serializedEntries.push(stringifyStableValue(entry, stack, normalizeString));
		return `[${serializedEntries.join(",")}]`;
	}
	const record = value;
	if (normalizeString === preserveString) {
		const fields = Object.keys(record).sort();
		if (write) {
			write("{");
			let separator = "";
			for (const key of fields) {
				write(`${separator}${JSON.stringify(key)}:`);
				write(stringifyStableValue(record[key], stack, normalizeString, write));
				separator = ",";
			}
			write("}");
			return "";
		}
		let fieldIndex = 0;
		for (const key of fields) fields[fieldIndex++] = `${JSON.stringify(key)}:${stringifyStableValue(record[key], stack, normalizeString)}`;
		return `{${fields.join(",")}}`;
	}
	const entries = Object.keys(record).map((key) => ({
		key,
		normalizedKey: normalizeString(key)
	})).sort((left, right) => {
		return compareStableStrings(left.normalizedKey, right.normalizedKey) || compareStableStrings(left.key, right.key);
	});
	const serializedFields = [];
	if (write) {
		write("{");
		let separator = "";
		for (const { key, normalizedKey } of entries) {
			write(`${separator}${JSON.stringify(normalizedKey)}:`);
			write(stringifyStableValue(record[key], stack, normalizeString, write));
			separator = ",";
		}
		write("}");
		return "";
	}
	for (const { key, normalizedKey } of entries) serializedFields.push(`${JSON.stringify(normalizedKey)}:${stringifyStableValue(record[key], stack, normalizeString)}`);
	return `{${serializedFields.join(",")}}`;
}
function encodeBase64(value) {
	let binary = "";
	for (const byte of value) binary += String.fromCharCode(byte);
	return btoa(binary);
}
function compareStableStrings(left, right) {
	return left < right ? -1 : left > right ? 1 : 0;
}
//#endregion
//#region packages/ai/src/utils/credential-redaction.ts
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
		mediaContext ||= isDiagnosticMediaPayload({ [key]: { value: assigned } });
		contextualPayload ||= Boolean(extractDiagnosticMediaField(key, normalized, void 0, true));
		if (mediaContext && contextualPayload) return true;
	}
	return false;
}
function normalizeDiagnosticFieldName(value) {
	return value.toLowerCase().replaceAll(DIAGNOSTIC_FIELD_SEPARATOR_RE, "");
}
function isCredentialFieldName(normalized) {
	if (!normalized || NON_CREDENTIAL_FIELD_NAMES.has(normalized)) return false;
	return normalized === "authorization" || normalized === "proxyauthorization" || CREDENTIAL_FIELD_SUFFIX_RE.test(normalized);
}
function redactCredentialText(value) {
	return value.replace(AUTHORIZATION_VALUE_RE, "$1 <redacted>").replace(JWT_VALUE_RE, "<redacted-jwt>").replace(COOKIE_HEADER_RE, "$1<redacted>").replace(QUOTED_CREDENTIAL_HEADER_RE, "$1$2$1: <redacted>").replace(CREDENTIAL_HEADER_RE, "$1: <redacted>").replace(LOOSE_QUOTED_CREDENTIAL_PAIR_RE, "$1=$2<redacted>$2").replace(LOOSE_CREDENTIAL_PAIR_RE, "$1=<redacted>");
}
function diagnosticBytes(value, numericArrays = false) {
	return value instanceof ArrayBuffer ? new Uint8Array(value) : ArrayBuffer.isView(value) ? new Uint8Array(value.buffer, value.byteOffset, value.byteLength) : numericArrays && Array.isArray(value) && value.every((byte) => Number.isInteger(byte) && byte >= 0 && byte <= 255) ? Uint8Array.from(value) : void 0;
}
function isDiagnosticMediaPayload(descriptors) {
	const type = descriptors.type?.value;
	if (typeof type === "string" && MEDIA_TYPE_RE.test(normalizeDiagnosticFieldName(type))) return true;
	for (const key of MEDIA_MIME_FIELDS) {
		const mime = descriptors[key]?.value;
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
const diagnosticRecords = /* @__PURE__ */ new WeakSet();
/** Fresh records need no native-object probe while their prototype stays ordinary. */
function createDiagnosticRecord() {
	const record = {};
	diagnosticRecords.add(record);
	return record;
}
function projectDiagnosticValue(value, policy = {}, seen = /* @__PURE__ */ new WeakSet(), mediaPayload = false, state = {
	changed: false,
	nodesRemaining: 64
}) {
	try {
		if (typeof value === "string") {
			const projected = redactDiagnosticText(value);
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
		if (!diagnosticRecords.has(value) || Object.getPrototypeOf(value) !== Object.prototype) try {
			Headers.prototype.has.call(value, "retry-after");
			const seconds = parseRetryAfterHeadersSeconds(value);
			state.changed = true;
			return seconds === void 0 ? {} : { "retry-after-ms": seconds * 1e3 };
		} catch {}
		const keys = Reflect.ownKeys(value);
		const descriptors = Object.create(null);
		for (let index = 0; index < Math.min(keys.length, 64); index += 1) {
			const key = keys[index];
			if (typeof key !== "string") continue;
			const descriptor = Object.getOwnPropertyDescriptor(value, key);
			if (descriptor) descriptors[key] = descriptor;
		}
		state.changed ||= keys.length > 64;
		seen.add(value);
		const out = Array.isArray(value) ? [] : {};
		const rawName = typeof descriptors.name?.value === "string" ? descriptors.name.value : descriptors.key?.value;
		const redactValueField = keys.length > 64 || typeof rawName === "string" && isCredentialFieldName(normalizeDiagnosticFieldName(rawName));
		const redactMedia = mediaPayload || keys.length > 64 || isDiagnosticMediaPayload(descriptors);
		for (const key in descriptors) {
			const descriptor = expectDefined(descriptors[key], "diagnostic descriptor");
			if (!("value" in descriptor) || !descriptor.enumerable && (policy.propertyScope === "enumerable" || ![
				"cause",
				"errors",
				"message",
				"name",
				"stack"
			].includes(key)) || key === "length") continue;
			const child = descriptor.value;
			const normalized = policy.omitField?.(key) ? void 0 : normalizeDiagnosticFieldName(key);
			if (normalized === void 0 || isCredentialFieldName(normalized)) {
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
			out[key] = projectDiagnosticValue(child, policy, seen, media?.kind === "context", state);
		}
		return out;
	} catch {
		state.changed = true;
		return "[Unserializable]";
	}
}
/** Redacts bounded structured JSON while preserving harmless diagnostic text byte-for-byte. */
function redactDiagnosticText(value) {
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
			const projected = projectDiagnosticValue(JSON.parse(fragment.json), {}, /* @__PURE__ */ new WeakSet(), false, state);
			redacted += state.changed ? stableStringify(projected) : fragment.json;
		} catch {
			return "[Malformed diagnostic JSON redacted]";
		}
		cursor = fragment.endIndex + 1;
	}
	const remainder = text.slice(cursor);
	return looksLikeDiagnosticJson(unstructured + remainder) ? "[Malformed diagnostic JSON redacted]" : redacted + remainder;
}
//#endregion
//#region packages/ai/src/utils/provider-error.ts
const MAX_ERROR_BODY_LENGTH = 4e3;
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
	const nestedError = asOptionalRecord(error?.error);
	const response = asOptionalRecord(error?.response);
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
		const localSnapshot = projectDiagnosticValue(error);
		let snapshot = localSnapshot;
		try {
			snapshot = providerErrorRedactor?.(localSnapshot) ?? localSnapshot;
		} catch {}
		const projection = buildProjection(snapshot, signal);
		const retryAfterSeconds = parseRetryAfterErrorSeconds(localSnapshot);
		if (retryAfterSeconds !== void 0) {
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
//#endregion
export { redactDiagnosticText as a, projectDiagnosticValue as i, projectProviderError as n, stableStringify as o, createDiagnosticRecord as r, configureProviderErrorRedactor as t };
