import "./number-coercion-CLj0HTDM.mjs";
import { a as asOptionalRecord, i as asOptionalObjectRecord } from "./record-coerce-DItp3I4t.mjs";
import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import "./boolean-C30ltbL7.mjs";
import { t as escapeRegExp } from "./regexp-BZyMFTlj.mjs";
import { _ as redactSensitiveText, b as redactToolPayloadText } from "./redact-B5EGyLvV.mjs";
import { t as parseRetryAfterHeaderSeconds } from "./retry-after-fXey-0uQ.mjs";
import { i as readResponseWithLimit, n as readResponseTextPrefix } from "./http-response-body-DXfezLdR.mjs";
import "./http-body-Bl_jph25.mjs";
import { o as mediaKindFromMime } from "./constants-DUxuqQz8.mjs";
//#region src/agents/provider-request-header-redaction.ts
const AUTHORIZATION_SECRET_HEADERS = /* @__PURE__ */ new Set(["authorization", "proxy-authorization"]);
const REDACTED_SECRET = "***";
function collectSecretRepresentations(values) {
	const representations = /* @__PURE__ */ new Map();
	const add = (candidate, percentEscapesCaseInsensitive = false) => {
		if (!candidate) return;
		representations.set(candidate, representations.get(candidate) === true || percentEscapesCaseInsensitive);
		const jsonEscaped = JSON.stringify(candidate).slice(1, -1);
		if (jsonEscaped !== candidate) representations.set(jsonEscaped, representations.get(jsonEscaped) === true || percentEscapesCaseInsensitive);
	};
	for (const value of values) {
		if (!value) continue;
		add(value);
		try {
			add(encodeURIComponent(value), true);
			add(new URLSearchParams([["value", value]]).toString().slice(6), true);
		} catch {}
	}
	return [...representations];
}
function secretRepresentationPattern([candidate, percentCaseInsensitive]) {
	const source = escapeRegExp(candidate);
	if (!percentCaseInsensitive) return source;
	return source.replace(/%[0-9A-F]{2}/giu, (escape) => escape.replace(/[A-F]/giu, (hex) => `[${hex.toUpperCase()}${hex.toLowerCase()}]`));
}
function normalizePercentEscapeHexCase(value) {
	return value.replace(/%[0-9A-F]{1,2}/giu, (escape) => escape.toUpperCase());
}
function redactExactSecretValues(text, values, sourceTruncated) {
	const representations = collectSecretRepresentations(values).toSorted((left, right) => right[0].length - left[0].length);
	if (representations.length === 0) return text;
	const matcher = new RegExp(representations.map(secretRepresentationPattern).join("|"), "gu");
	const redacted = text.replace(matcher, REDACTED_SECRET);
	if (!sourceTruncated) return redacted;
	let longestPartialSuffix = 0;
	for (const [candidate, percentCaseInsensitive] of representations) {
		const comparableText = percentCaseInsensitive ? normalizePercentEscapeHexCase(redacted) : redacted;
		const comparableCandidate = percentCaseInsensitive ? normalizePercentEscapeHexCase(candidate) : candidate;
		let prefixLength = Math.min(comparableCandidate.length - 1, comparableText.length);
		while (prefixLength > longestPartialSuffix && !comparableText.endsWith(comparableCandidate.slice(0, prefixLength))) prefixLength -= 1;
		longestPartialSuffix = Math.max(longestPartialSuffix, prefixLength);
	}
	return longestPartialSuffix === 0 ? redacted : `${redacted.slice(0, -longestPartialSuffix)}${REDACTED_SECRET}`;
}
function collectRequestHeaderSecretValues(headers) {
	return (headers instanceof Headers ? [...headers.entries()] : Array.isArray(headers) ? headers : Object.entries(headers)).flatMap(([headerName, headerValue]) => {
		if (headerValue === void 0) return [];
		const normalizedHeaderName = headerName.toLowerCase();
		if (normalizedHeaderName === "content-type" && headerValue === "application/json") return [];
		if (!AUTHORIZATION_SECRET_HEADERS.has(normalizedHeaderName)) return [headerValue];
		const authorization = /^\s*(\S+)\s+(.+?)\s*$/u.exec(headerValue);
		const credentialComponent = authorization?.[2];
		if (!credentialComponent) return [headerValue];
		const values = [headerValue, credentialComponent];
		if (authorization?.[1]?.toLowerCase() === "basic") {
			const bytes = Buffer.from(credentialComponent, "base64");
			if (bytes.toString("base64").replace(/=+$/u, "") === credentialComponent.replace(/=+$/u, "")) for (const encoding of ["utf8", "latin1"]) {
				const pair = bytes.toString(encoding);
				const separator = pair.indexOf(":");
				if (separator >= 0) values.push(pair, pair.slice(separator + 1));
			}
		}
		return values;
	});
}
function redactProviderResponseErrorText(text, headers, options) {
	const exactRedacted = redactExactSecretValues(text, collectRequestHeaderSecretValues(headers), options?.sourceTruncated === true);
	return redactToolPayloadText(exactRedacted);
}
async function readProviderResponseErrorText(response, limitBytes, headers, signal) {
	const result = await readResponseTextPrefix(response, limitBytes, {
		signal,
		chunkTimeoutMs: 1e4,
		onIdleTimeout: ({ chunkTimeoutMs }) => /* @__PURE__ */ new Error(`error body read stalled for ${chunkTimeoutMs}ms`)
	});
	return redactProviderResponseErrorText(result.text, headers, { sourceTruncated: result.truncated });
}
//#endregion
//#region src/agents/provider-http-errors.ts
/**
* Shared provider HTTP error normalization helpers.
*
* Transport adapters use this module to turn provider-specific response bodies,
* request ids, and binary payload guardrails into stable OpenClaw error shapes.
*/
const ERROR_BODY_METADATA_LIMIT = 500;
const PROVIDER_RESPONSE_MAX_BYTES = 16777216;
const SHORT_BEARER_TOKEN_PATTERN = /\b(Bearer)\s+[-A-Za-z0-9._~+/=]{1,17}(?![-A-Za-z0-9._~+/=…])/giu;
function extractHeaderCredential(headers, headerName, prefix = "") {
	const value = headers.get(headerName) ?? "";
	return prefix && value.startsWith(prefix) ? value.slice(prefix.length) : value;
}
function extractAuthorizationPayload(headers) {
	const value = headers.get("Authorization") ?? "";
	const separator = value.search(/\s/u);
	return separator === -1 ? value : value.slice(separator).trimStart();
}
/** Builds a redactor for response text that may reflect the request's active credential. */
function createProviderErrorTextRedactor(params) {
	const auth = params.request?.auth;
	const credentials = [
		extractHeaderCredential(params.headers, params.defaultAuthHeader, params.defaultAuthPrefix),
		auth?.mode === "header" ? extractHeaderCredential(params.headers, auth.headerName, auth.prefix ?? "") : auth?.mode === "authorization-bearer" ? extractHeaderCredential(params.headers, "Authorization", "Bearer ") : "",
		extractAuthorizationPayload(params.headers)
	].filter(Boolean).toSorted((left, right) => right.length - left.length);
	return (text, context) => {
		let withoutActiveCredential = credentials.reduce((redacted, credential) => redacted.split(credential).join("***"), text);
		if (context?.truncated) {
			const partialCredentialLength = credentials.reduce((longest, credential) => {
				const maxLength = Math.min(credential.length - 1, withoutActiveCredential.length);
				for (let length = maxLength; length > longest; length -= 1) if (withoutActiveCredential.endsWith(credential.slice(0, length))) return length;
				return longest;
			}, 0);
			if (partialCredentialLength > 0) withoutActiveCredential = `${withoutActiveCredential.slice(0, -partialCredentialLength)}***`;
		}
		return redactToolPayloadText(withoutActiveCredential).replace(SHORT_BEARER_TOKEN_PATTERN, "$1 ***");
	};
}
function readProviderResponseBytes(response, label, kind, opts) {
	return readResponseWithLimit(response, opts?.maxBytes ?? PROVIDER_RESPONSE_MAX_BYTES, {
		...opts,
		chunkTimeoutMs: opts?.chunkTimeoutMs ?? 3e4,
		onIdleTimeout: opts?.onIdleTimeout ?? (({ chunkTimeoutMs }) => /* @__PURE__ */ new Error(`${label}: response body stalled for ${chunkTimeoutMs}ms`)),
		onOverflow: opts?.onOverflow ?? (({ maxBytes: limit }) => /* @__PURE__ */ new Error(`${label}: ${kind} response exceeds ${limit} bytes`))
	});
}
var ProviderErrorBodyTimeout = class extends Error {
	constructor(timeoutError) {
		super(timeoutError instanceof Error ? timeoutError.message : String(timeoutError), { cause: timeoutError });
		this.name = "ProviderErrorBodyTimeout";
		this.timeoutError = timeoutError;
	}
};
/** Summarizes transport failures before the logger applies diagnostic redaction. */
function summarizeProviderTransportError(error) {
	const record = asOptionalObjectRecord(error);
	if (!record) return `type=${typeof error}`;
	const cause = asOptionalObjectRecord(record.cause);
	const read = (value) => typeof value === "string" ? value : typeof value;
	return [
		`name=${read(record.name)}`,
		`code=${read(record.code)}`,
		`causeName=${read(cause?.name)}`,
		`causeCode=${read(cause?.code)}`,
		`message=${error instanceof Error ? error.message : read(record.message)}`
	].join(" ");
}
/** Trims provider error details to a log- and prompt-safe preview length. */
function truncateErrorDetail(detail, limit = 220) {
	return detail.length <= limit ? detail : `${truncateUtf16Safe(detail, limit - 1)}…`;
}
/** Redacts secrets before preserving a bounded provider error body preview. */
function redactProviderErrorBody(body) {
	return truncateErrorDetail(redactSensitiveText(body), ERROR_BODY_METADATA_LIMIT);
}
/** Reads at most `limitBytes` from a response body without buffering provider-sized failures. */
async function readResponseTextLimited(response, limitBytes = 16384, options) {
	if (limitBytes <= 0) return "";
	return (await readResponseTextPrefix(response, limitBytes, {
		chunkTimeoutMs: options?.chunkTimeoutMs ?? 1e4,
		onIdleTimeout: options?.onIdleTimeout ?? (({ chunkTimeoutMs }) => /* @__PURE__ */ new Error(`error body read stalled for ${chunkTimeoutMs}ms`)),
		timeoutMs: options?.timeoutMs,
		onTimeout: options?.onTimeout
	})).text;
}
/** Reads a successful provider text response under a byte cap. */
async function readProviderTextResponse(response, label, opts) {
	const bytes = await readProviderResponseBytes(response, label, "text", opts);
	return new TextDecoder().decode(bytes);
}
function resolveProviderErrorPayloadMetadata(payload) {
	const root = asOptionalRecord(payload);
	const detailObject = asOptionalRecord(root?.detail);
	const subject = asOptionalRecord(root?.error) ?? detailObject ?? root;
	if (!subject) return { detail: void 0 };
	const errorDescription = normalizeOptionalString(subject.error_description) ?? normalizeOptionalString(root?.error_description);
	const oauthCode = errorDescription ? normalizeOptionalString(root?.error) : void 0;
	const message = normalizeOptionalString(subject.message) ?? normalizeOptionalString(subject.detail) ?? errorDescription ?? normalizeOptionalString(root?.message) ?? normalizeOptionalString(root?.error) ?? normalizeOptionalString(root?.detail);
	const type = normalizeOptionalString(subject.type);
	const code = normalizeOptionalString(subject.code) ?? normalizeOptionalString(subject.status) ?? oauthCode;
	const metadata = [type ? `type=${type}` : void 0, code ? `code=${code}` : void 0].filter((value) => Boolean(value)).join(", ");
	return {
		detail: message ? `${truncateErrorDetail(message)}${metadata ? ` [${metadata}]` : ""}` : metadata ? `[${metadata}]` : void 0,
		code,
		type
	};
}
/** Formats common provider JSON error payload shapes into one readable detail string. */
function formatProviderErrorPayload(payload) {
	return resolveProviderErrorPayloadMetadata(payload).detail;
}
/** Extracts normalized provider error metadata while keeping the raw body bounded and redacted. */
async function extractProviderErrorInfo(response, options) {
	const bodyTimeoutMs = options?.bodyTimeoutMs;
	const prefix = await readResponseTextPrefix(response, options?.maxBodyBytes ?? 16384, {
		signal: options?.signal,
		chunkTimeoutMs: 1e4,
		onIdleTimeout: ({ chunkTimeoutMs }) => /* @__PURE__ */ new Error(`error body read stalled for ${chunkTimeoutMs}ms`),
		timeoutMs: typeof bodyTimeoutMs === "function" ? () => {
			try {
				return bodyTimeoutMs();
			} catch (error) {
				throw new ProviderErrorBodyTimeout(error);
			}
		} : bodyTimeoutMs,
		onTimeout: (params) => new ProviderErrorBodyTimeout(options?.onBodyTimeout?.(params) ?? /* @__PURE__ */ new Error(`Provider error body timed out after ${params.timeoutMs}ms`))
	}).catch((error) => {
		options?.signal?.throwIfAborted();
		if (error instanceof ProviderErrorBodyTimeout) throw error.timeoutError;
		if (error instanceof Error && error.name === "TimeoutError") throw error;
	});
	options?.signal?.throwIfAborted();
	const rawRequestId = extractProviderRequestId(response);
	const requestId = rawRequestId && options?.requestHeaders ? redactProviderResponseErrorText(rawRequestId, options.requestHeaders) : rawRequestId;
	const rawBody = normalizeOptionalString(prefix?.text);
	const retryAfterSeconds = parseRetryAfterHeaderSeconds(response.headers.get("Retry-After"));
	const headerRetryAfterMs = retryAfterSeconds === void 0 ? void 0 : Math.ceil(retryAfterSeconds * 1e3);
	if (!rawBody) return {
		requestId,
		retryAfterMs: headerRetryAfterMs
	};
	const safeBody = options?.requestHeaders ? redactProviderResponseErrorText(rawBody, options.requestHeaders, { sourceTruncated: prefix?.truncated }) : rawBody;
	const body = redactProviderErrorBody(safeBody);
	try {
		const metadata = resolveProviderErrorPayloadMetadata(JSON.parse(safeBody));
		return {
			detail: metadata.detail && redactSensitiveText(metadata.detail) || body,
			code: metadata.code,
			type: metadata.type,
			retryAfterMs: headerRetryAfterMs,
			body,
			requestId
		};
	} catch {
		return {
			detail: body,
			body,
			requestId,
			retryAfterMs: headerRetryAfterMs
		};
	}
}
/** Returns only the normalized provider detail string for callers that do not need metadata. */
async function extractProviderErrorDetail(response) {
	return (await extractProviderErrorInfo(response)).detail;
}
/** Reads the provider request id header variants used across model and media APIs. */
function extractProviderRequestId(response) {
	return normalizeOptionalString(response.headers.get("x-request-id")) ?? normalizeOptionalString(response.headers.get("request-id"));
}
/** Error type carrying normalized provider status, request id, code, type, and body metadata. */
var ProviderHttpError = class extends Error {
	constructor(message, params) {
		super(message);
		this.name = "ProviderHttpError";
		this.status = params.status;
		this.statusCode = params.status;
		this.code = params.code;
		this.errorCode = params.code;
		this.errorType = params.type;
		this.errorBody = params.body;
		this.requestId = params.requestId;
		this.retryAfterMs = params.retryAfterMs;
	}
};
/** Builds the human-facing provider HTTP error message from normalized metadata. */
function formatProviderHttpErrorMessage(params) {
	const { label, status, detail, requestId, statusPrefix = "" } = params;
	return `${label} (${statusPrefix}${status})` + (detail ? `: ${detail}` : "") + (requestId ? ` [request_id=${requestId}]` : "");
}
/** Creates a normalized provider HTTP error from a failed response. */
async function createProviderHttpError(response, label, options) {
	const info = await extractProviderErrorInfo(response, options);
	return new ProviderHttpError(formatProviderHttpErrorMessage({
		label,
		status: response.status,
		detail: info.detail,
		requestId: info.requestId,
		statusPrefix: options?.statusPrefix
	}), {
		status: response.status,
		code: info.code,
		type: info.type,
		body: info.body,
		requestId: info.requestId,
		retryAfterMs: info.retryAfterMs
	});
}
/** Throws a normalized provider error when a fetch response is not OK. */
async function assertOkOrThrowProviderError(response, label, options) {
	if (response.ok) return;
	throw await createProviderHttpError(response, label, options);
}
/** Throws a normalized generic HTTP error when a fetch response is not OK. */
async function assertOkOrThrowHttpError(response, label, options) {
	if (response.ok) return;
	throw await createProviderHttpError(response, label, {
		...options,
		statusPrefix: "HTTP "
	});
}
/**
* Parses a provider JSON response under a byte cap and wraps malformed JSON with the caller's label.
*
* The body is read through the same bounded reader as binary responses so a provider that streams an
* unbounded JSON body cannot force the runtime to buffer the whole payload before parsing.
*/
async function readProviderJsonResponse(response, label, opts) {
	const bytes = await readProviderResponseBytes(response, label, "JSON", opts);
	try {
		return JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(bytes));
	} catch (cause) {
		throw new Error(`${label}: malformed JSON response`, opts?.requestHeaders ? void 0 : { cause });
	}
}
/** Parses a provider JSON response that must be a top-level object. */
async function readProviderJsonObjectResponse(response, label, opts) {
	const payload = await readProviderJsonResponse(response, label, opts);
	const object = asOptionalRecord(payload);
	if (!object) throw new Error(`${label}: malformed JSON response`);
	return object;
}
/** Parses a provider JSON object response and returns an array field. */
async function readProviderJsonArrayFieldResponse(response, label, field, opts) {
	const value = (await readProviderJsonObjectResponse(response, label, opts))[field];
	if (!Array.isArray(value)) throw new Error(`${label}: malformed JSON response`);
	return value;
}
const providerMediaContentTypePattern = /^[!#$%&'*+.^_`|~\da-z-]+\/[!#$%&'*+.^_`|~\da-z-]+(?:[ \t]*;(?:[ \t]*[!#$%&'*+.^_`|~\da-z-]+[ \t]*=[ \t]*(?:[!#$%&'*+.^_`|~\da-z-]+|"(?:[\t !#-[\]-~\x80-\xff]|\\[\t !-~\x80-\xff])*"))?)*[ \t]*$/iu;
/** Rejects non-binary responses and mismatched provider-owned audio/video families. */
function assertProviderBinaryResponseContent(response, label, kind = "binary") {
	const rawContentType = response.headers.get("content-type");
	if (rawContentType === null) return;
	const contentType = rawContentType.split(";")[0]?.trim().toLowerCase();
	const requiresMediaFamily = kind === "audio" || kind === "video";
	const unspecifiedMedia = contentType === "application/octet-stream" || contentType === "binary/octet-stream" || kind === "audio" && contentType === "application/ogg";
	if (!contentType && !requiresMediaFamily) return;
	if (!contentType || contentType === "application/json" || contentType.endsWith("+json") || contentType.startsWith("text/") || requiresMediaFamily && (!providerMediaContentTypePattern.test(rawContentType.trim()) || !unspecifiedMedia && mediaKindFromMime(contentType) !== kind)) throw new Error(`${label}: malformed ${kind} response`);
}
/** Reads a bounded non-empty binary provider response after content-type validation. */
async function readProviderBinaryResponse(response, label, kind = "binary", opts) {
	try {
		assertProviderBinaryResponseContent(response, label, kind);
	} catch (error) {
		response.body?.cancel().catch(() => void 0);
		throw error;
	}
	const bytes = await readProviderResponseBytes(response, label, kind, opts);
	if (bytes.byteLength === 0) throw new Error(`${label}: malformed ${kind} response`);
	return bytes;
}
//#endregion
export { summarizeProviderTransportError as _, createProviderErrorTextRedactor as a, redactProviderResponseErrorText as b, extractProviderRequestId as c, readProviderBinaryResponse as d, readProviderJsonArrayFieldResponse as f, readResponseTextLimited as g, readProviderTextResponse as h, assertProviderBinaryResponseContent as i, formatProviderErrorPayload as l, readProviderJsonResponse as m, assertOkOrThrowHttpError as n, createProviderHttpError as o, readProviderJsonObjectResponse as p, assertOkOrThrowProviderError as r, extractProviderErrorDetail as s, ProviderHttpError as t, formatProviderHttpErrorMessage as u, truncateErrorDetail as v, readProviderResponseErrorText as y };
