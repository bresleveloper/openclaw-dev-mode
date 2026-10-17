import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import "./src-CdRlGRnW.mjs";
import { t as stableStringify } from "./stable-stringify-Djn3uxNo.mjs";
import { n as filterStringEntries } from "./string-normalization-CECOqf64.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { F as parseApiErrorInfo, _ as redactSensitiveText, i as getDefaultRedactPatterns, q as readLoggingConfig } from "./redact-DJ8j6ADa.mjs";
import { t as redactIdentifier } from "./node-crypto-BG4u3UnX.mjs";
import { l as getApiErrorPayloadFingerprint } from "./user-facing-text-DC1sCo4O.mjs";
import { g as classifyProviderRuntimeFailureKind } from "./embedded-agent-helpers-BEiSgw6S.mjs";
//#region src/agents/embedded-agent-error-observation.ts
/**
* Builds structured observations for embedded-agent API/text failures.
*/
const MAX_OBSERVATION_INPUT_CHARS = 64e3;
const MAX_FINGERPRINT_MESSAGE_CHARS = 8e3;
const RAW_ERROR_PREVIEW_MAX_CHARS = 400;
const PROVIDER_ERROR_PREVIEW_MAX_CHARS = 200;
const REQUEST_ID_RE = /\brequest[_ ]?id\b\s*[:=]\s*["'()]*([A-Za-z0-9._:-]+)/i;
const OBSERVATION_EXTRA_REDACT_PATTERNS = [
	String.raw`\b(?:x-)?api[-_]?key\b\s*[:=]\s*(["']?)([^\s"'\\;]+)\1`,
	String.raw`"(?:api[-_]?key|api_key)"\s*:\s*"([^"]+)"`,
	String.raw`(?:\bCookie\b\s*[:=]\s*[^;=\s]+=|;\s*[^;=\s]+=)([^;\s\r\n]+)`
];
const RAW_ERROR_CONSOLE_SUPPRESSED_FAILURE_KINDS = /* @__PURE__ */ new Set([
	"auth_html",
	"auth_refresh",
	"auth_scope",
	"upstream_html"
]);
function truncateForObservation(text, maxChars) {
	const trimmed = text?.trim();
	if (!trimmed) return;
	return trimmed.length > maxChars ? `${truncateUtf16Safe(trimmed, maxChars)}…` : trimmed;
}
function boundObservationInput(text) {
	const trimmed = text?.trim();
	if (!trimmed) return;
	return trimmed.length > MAX_OBSERVATION_INPUT_CHARS ? truncateUtf16Safe(trimmed, MAX_OBSERVATION_INPUT_CHARS) : trimmed;
}
function replaceRequestIdPreview(text, requestId) {
	if (!text || !requestId) return text;
	return text.split(requestId).join(redactIdentifier(requestId, { len: 12 }));
}
function redactObservationText(text) {
	if (!text) return text;
	const configuredPatterns = filterStringEntries(readLoggingConfig()?.redactPatterns);
	return redactSensitiveText(text, {
		mode: "tools",
		patterns: [
			...getDefaultRedactPatterns(),
			...configuredPatterns,
			...OBSERVATION_EXTRA_REDACT_PATTERNS
		]
	});
}
function shouldSuppressRawErrorConsoleSuffix(providerRuntimeFailureKind) {
	return providerRuntimeFailureKind ? RAW_ERROR_CONSOLE_SUPPRESSED_FAILURE_KINDS.has(providerRuntimeFailureKind) : false;
}
function buildObservationFingerprint(params) {
	const boundedMessage = params.message && params.message.length > MAX_FINGERPRINT_MESSAGE_CHARS ? truncateUtf16Safe(params.message, MAX_FINGERPRINT_MESSAGE_CHARS) : params.message;
	const structured = params.httpCode || params.type || boundedMessage ? stableStringify({
		httpCode: params.httpCode,
		type: params.type,
		message: boundedMessage
	}) : null;
	if (structured) return structured;
	if (params.requestId) return params.raw.split(params.requestId).join("<request_id>");
	return getApiErrorPayloadFingerprint(params.raw);
}
function buildApiErrorObservationFields(rawError, opts) {
	const trimmed = boundObservationInput(rawError);
	if (!trimmed) return {};
	try {
		const parsed = parseApiErrorInfo(trimmed);
		const requestId = parsed?.requestId ?? normalizeOptionalString(trimmed.match(REQUEST_ID_RE)?.[1]);
		const requestIdHash = requestId ? redactIdentifier(requestId, { len: 12 }) : void 0;
		const rawFingerprint = buildObservationFingerprint({
			raw: trimmed,
			requestId,
			httpCode: parsed?.httpCode,
			type: parsed?.type,
			message: parsed?.message
		});
		const redactedRawPreview = replaceRequestIdPreview(redactObservationText(trimmed), requestId);
		const redactedProviderMessage = replaceRequestIdPreview(redactObservationText(parsed?.message), requestId);
		return {
			rawErrorPreview: truncateForObservation(redactedRawPreview, RAW_ERROR_PREVIEW_MAX_CHARS),
			rawErrorHash: redactIdentifier(trimmed, { len: 12 }),
			rawErrorFingerprint: rawFingerprint ? redactIdentifier(rawFingerprint, { len: 12 }) : void 0,
			httpCode: parsed?.httpCode,
			providerRuntimeFailureKind: classifyProviderRuntimeFailureKind({
				status: parsed?.httpCode ? Number(parsed.httpCode) : void 0,
				message: trimmed,
				provider: opts?.providerOwner?.id ?? opts?.provider
			}, { providerPlugin: opts?.providerOwner ?? null }),
			providerErrorType: redactObservationText(parsed?.type),
			providerErrorMessagePreview: truncateForObservation(redactedProviderMessage, PROVIDER_ERROR_PREVIEW_MAX_CHARS),
			requestIdHash
		};
	} catch {
		return {};
	}
}
function buildTextObservationFields(text, opts) {
	const observed = buildApiErrorObservationFields(text, opts);
	return {
		textPreview: observed.rawErrorPreview,
		textHash: observed.rawErrorHash,
		textFingerprint: observed.rawErrorFingerprint,
		httpCode: observed.httpCode,
		providerRuntimeFailureKind: observed.providerRuntimeFailureKind,
		providerErrorType: observed.providerErrorType,
		providerErrorMessagePreview: observed.providerErrorMessagePreview,
		requestIdHash: observed.requestIdHash
	};
}
//#endregion
export { buildTextObservationFields as n, shouldSuppressRawErrorConsoleSuffix as r, buildApiErrorObservationFields as t };
