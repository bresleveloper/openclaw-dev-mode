import { c as normalizeOptionalLowercaseString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { n as safeParseJsonRecord } from "./json-coercion-pfKbZnCJ.mjs";
import { C as isGenericProviderInternalError, T as parseApiErrorInfo, _ as extractLeadingHttpStatus } from "./redact-BcXJu5HP.mjs";
import { _ as matchesFormatErrorPattern, a as isAuthPermanentErrorMessage, c as isPeriodicUsageLimitErrorMessage, f as isRateLimitErrorMessage, h as isTimeoutErrorMessage, i as isAuthErrorMessage, m as isSessionTranscriptValidationErrorMessage, o as isBillingErrorMessage, p as isServerErrorMessage, s as isOverloadedErrorMessage, u as isProviderCompletedErrorFinishReasonMessage, v as resolveExecutionApprovalFailureMessage } from "./message-patterns-DSkmGYcR.mjs";
import { a as matchesContextOverflowMessage, i as looksLikeProviderContextOverflowCandidate, n as isContextOverflowErrorFromTables } from "./context-overflow-tables-Cn71vUg0.mjs";
import { o as classifyOAuthRefreshFailure } from "./oauth-refresh-failure-H1_-S915.mjs";
import { a as failoverReasonFromClassification, c as isExactUnknownNoDetailsError, f as isUnsupportedImageInputErrorMessage, i as classifyFailoverReasonFromCode, l as isGenericUnknownStreamErrorMessage, m as toReasonClassification, n as classifyFailoverClassificationFromHttpStatus, o as inferSignalStatus, p as toPluginClassification, r as classifyFailoverReasonFrom402Text, s as isClaudeCliAuthError, t as classifyCoreFailoverReasonFromErrorType, u as isReplayInvalidErrorMessage } from "./classification-rules-CaFCPBKV.mjs";
//#region packages/ai/src/utils/tls-certificate-errors.ts
const HOSTNAME_MISMATCH_CODES = /* @__PURE__ */ new Set(["ERR_TLS_CERT_ALTNAME_INVALID", "HOSTNAME_MISMATCH"]);
const CERTIFICATE_INVALID_CODES = /* @__PURE__ */ new Set([
	"CERT_CHAIN_TOO_LONG",
	"CERT_HAS_EXPIRED",
	"CERT_NOT_YET_VALID",
	"CERT_REJECTED",
	"CERT_REVOKED",
	"CERT_SIGNATURE_FAILURE",
	"CERT_UNTRUSTED",
	"CRL_HAS_EXPIRED",
	"CRL_NOT_YET_VALID",
	"CRL_SIGNATURE_FAILURE",
	"DEPTH_ZERO_SELF_SIGNED_CERT",
	"ERROR_IN_CERT_NOT_AFTER_FIELD",
	"ERROR_IN_CERT_NOT_BEFORE_FIELD",
	"ERROR_IN_CRL_LAST_UPDATE_FIELD",
	"ERROR_IN_CRL_NEXT_UPDATE_FIELD",
	"INVALID_CA",
	"INVALID_PURPOSE",
	"PATH_LENGTH_EXCEEDED",
	"SELF_SIGNED_CERT_IN_CHAIN",
	"UNABLE_TO_DECODE_ISSUER_PUBLIC_KEY",
	"UNABLE_TO_DECRYPT_CERT_SIGNATURE",
	"UNABLE_TO_DECRYPT_CRL_SIGNATURE",
	"UNABLE_TO_GET_CRL",
	"UNABLE_TO_GET_ISSUER_CERT",
	"UNABLE_TO_GET_ISSUER_CERT_LOCALLY",
	"UNABLE_TO_VERIFY_LEAF_SIGNATURE"
]);
const HOSTNAME_MISMATCH_PATTERNS = [
	/hostname\/ip does not match certificate(?:'s)? altnames/i,
	/hostname mismatch/i,
	/host: .+ is not in the cert(?:ificate)?(?:'s)? altnames/i
];
const CERTIFICATE_INVALID_PATTERNS = [
	/certificate has expired/i,
	/certificate is not yet valid/i,
	/self[- ]signed certificate/i,
	/unable to get local issuer certificate/i,
	/unable to verify the first certificate/i
];
const MAX_TLS_ERROR_DEPTH = 8;
function classifyCode(code) {
	if (HOSTNAME_MISMATCH_CODES.has(code)) return "hostname_mismatch";
	return CERTIFICATE_INVALID_CODES.has(code) ? "certificate_invalid" : null;
}
function classifyMessage(message) {
	if (HOSTNAME_MISMATCH_PATTERNS.some((pattern) => pattern.test(message))) return "hostname_mismatch";
	return CERTIFICATE_INVALID_PATTERNS.some((pattern) => pattern.test(message)) ? "certificate_invalid" : null;
}
function inspectTlsCertificateErrorInternal(error, seen, depth) {
	if (depth > MAX_TLS_ERROR_DEPTH) return null;
	if (typeof error === "string") {
		const kind = classifyMessage(error);
		return kind ? {
			kind,
			message: error
		} : null;
	}
	if (!error || typeof error !== "object" || seen.has(error)) return null;
	seen.add(error);
	const candidate = error;
	const code = typeof candidate.code === "string" ? candidate.code.trim().toUpperCase() : void 0;
	const message = typeof candidate.message === "string" && candidate.message.trim() ? candidate.message : void 0;
	const codeKind = code ? classifyCode(code) : null;
	if (code && codeKind) return {
		kind: codeKind,
		code,
		message: message ?? code
	};
	const nestedErrors = Array.isArray(candidate.errors) ? candidate.errors : [];
	for (const nested of [
		candidate.cause,
		candidate.error,
		...nestedErrors
	]) {
		const details = inspectTlsCertificateErrorInternal(nested, seen, depth + 1);
		if (details) return details;
	}
	const messageKind = message ? classifyMessage(message) : null;
	return messageKind && message ? {
		kind: messageKind,
		message
	} : null;
}
/** Classify deterministic Node/OpenSSL certificate validation failures. */
function inspectTlsCertificateError(error) {
	return inspectTlsCertificateErrorInternal(error, /* @__PURE__ */ new Set(), 0);
}
//#endregion
//#region src/agents/embedded-agent-helpers/image-errors.ts
const IMAGE_DIMENSION_ERROR_RE = /image dimensions exceed max allowed size for many-image requests:\s*(\d+)\s*pixels/i;
const IMAGE_DIMENSION_PATH_RE = /messages\.(\d+)\.content\.(\d+)\.image/i;
const IMAGE_SIZE_ERROR_RE = /image exceeds\s*(\d+(?:\.\d+)?)\s*mb/i;
function parseImageDimensionError(raw) {
	if (!/image dimensions exceed max allowed size/i.test(raw)) return null;
	const limitMatch = raw.match(IMAGE_DIMENSION_ERROR_RE);
	const pathMatch = raw.match(IMAGE_DIMENSION_PATH_RE);
	return {
		maxDimensionPx: limitMatch?.[1] ? Number.parseInt(limitMatch[1], 10) : void 0,
		messageIndex: pathMatch?.[1] ? Number.parseInt(pathMatch[1], 10) : void 0,
		contentIndex: pathMatch?.[2] ? Number.parseInt(pathMatch[2], 10) : void 0,
		raw
	};
}
function isImageDimensionErrorMessage(raw) {
	return Boolean(parseImageDimensionError(raw));
}
function parseImageSizeError(raw) {
	if (!/image exceeds[\s\S]*mb/i.test(raw)) return null;
	const match = raw.match(IMAGE_SIZE_ERROR_RE);
	return {
		maxMb: match?.[1] ? Number.parseFloat(match[1]) : void 0,
		raw
	};
}
function isImageSizeError(errorMessage) {
	return Boolean(errorMessage && parseImageSizeError(errorMessage));
}
//#endregion
//#region src/agents/live-model-errors.ts
/**
* Live-provider model error classifiers.
*
* Probe and fallback code uses these string checks to distinguish missing or
* deprecated model ids from generic provider/runtime failures.
*/
/** Returns whether a provider error message indicates a missing or retired model id. */
function isModelNotFoundErrorMessage(raw) {
	const msg = raw.trim();
	return /no endpoints found for/i.test(msg) || /\brouter not found\b/i.test(msg) || /unknown model/i.test(msg) || /\bmodel\b[^\r\n]{0,120}?\b(?:was|is|has been) retired\b/i.test(msg) || /\b[a-z0-9][a-z0-9._:/-]* was retired at \d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2} [+-]\d{4} [a-z]+ \(ref:/i.test(msg) || /model(?:[_\-\s])?not(?:[_\-\s])?found|\bmodel\b.{0,60}?\bnot found\b/i.test(msg) || /\b404\b/.test(msg) && /not(?:[_\-\s])?found/i.test(msg) || /not_found_error/i.test(msg) || /\bnot supported model\b/i.test(msg) || /\bmodel\b[^.]{0,120}?\bis not supported when using\b[^.]{0,80}?\bwith a ChatGPT account\b/i.test(msg) || /model:\s*[a-z0-9._/-]+/i.test(msg) && /not(?:[_\-\s])?found/i.test(msg) || /models\/[^\s]+ is not found/i.test(msg) || /model/i.test(msg) && /does not exist/i.test(msg) || /selected model/i.test(msg) && /not(?:[_\-\s])?found/i.test(msg) || /model/i.test(msg) && /deprecated/i.test(msg) && /(upgrade|transition) to/i.test(msg) || /\bmodel\b(?:\s+(?!(?:parameters?|params?|fields?|options?|arguments?|settings?|names?|propert(?:y|ies)|endpoints?|versions?)\b)[`'"]?[\w./:@-]+[`'"]?)?\s+(?:is|was|has been) deprecated\b(?![^.\r\n]{0,80}\b(?:will|scheduled|soon)\b)/i.test(msg) || /stealth model/i.test(msg) && /find it here/i.test(msg) || /is not a valid model id/i.test(msg) || /invalid model/i.test(msg) && !/invalid model reference/i.test(msg);
}
//#endregion
//#region src/agents/failover/classify-core.ts
/** Classifies prepared error facts without resolving provider runtime. */
const HTML_BODY_RE = /^\s*(?:<!doctype\s+html\b|<html\b)/i;
const HTML_CLOSE_RE = /<\/html>/i;
function isHtmlErrorResponse(raw) {
	const candidate = raw.trim().replace(/^error:\s*/i, "").trim();
	const rest = extractLeadingHttpStatus(candidate)?.rest ?? candidate;
	return HTML_BODY_RE.test(rest) && HTML_CLOSE_RE.test(rest);
}
const PRIORITY_MESSAGE_CLASSIFIERS = [
	[isUnsupportedImageInputErrorMessage, "format"],
	[isClaudeCliAuthError, "auth"],
	[isSessionTranscriptValidationErrorMessage, "format"],
	[isCliSessionExpiredErrorMessage, "session_expired"],
	[isModelNotFoundErrorMessage, "model_not_found"],
	[(raw) => /\bworkers_ai\b.*\bquota limit exceeded\b/i.test(raw), "rate_limit"],
	[(raw) => /\bmodelnotreadyexception\b/i.test(raw), "overloaded"],
	[(raw) => /model(?:_is)?_deactivated|model has been deactivated/i.test(raw), "model_not_found"]
];
const GENERAL_MESSAGE_CLASSIFIERS = [
	[isRateLimitErrorMessage, "rate_limit"],
	[isOverloadedErrorMessage, "overloaded"],
	[isProviderCompletedErrorFinishReasonMessage, "server_error"],
	[(raw) => isStructuredServerErrorMessage(raw) && !isBillingErrorMessage(raw) && !isAuthPermanentErrorMessage(raw) && !isAuthErrorMessage(raw), "server_error"],
	[isGenericProviderInternalError, "timeout"],
	[(raw) => Boolean(classifyOAuthRefreshFailure(raw)?.reason), "auth_permanent"],
	[isAuthPermanentErrorMessage, "auth_permanent"],
	[isAuthErrorMessage, "auth"],
	[(raw) => isGenericUnknownStreamErrorMessage(raw) || isServerErrorMessage(raw) || isJsonApiInternalServerError(raw), "timeout"],
	[isCloudCodeAssistFormatError, "format"],
	[isExactUnknownNoDetailsError, "no_error_details"],
	[isTimeoutErrorMessage, "timeout"],
	[(raw) => matchesContextOverflowMessage(raw, "assistant-error"), "context_overflow"]
];
function isTransportHtmlErrorStatus(status) {
	return status === 408 || status === 499 || typeof status === "number" && status >= 500 && status < 600;
}
function classifyFailoverClassificationFromMessage(raw, provider, errorType) {
	if (isImageDimensionErrorMessage(raw) || isImageSizeError(raw)) return null;
	const priorityReason = PRIORITY_MESSAGE_CLASSIFIERS.find(([matches]) => matches(raw, provider))?.[1];
	if (priorityReason) return toReasonClassification(priorityReason);
	if (isContextOverflowErrorFromTables(raw)) return { kind: "context_overflow" };
	if (isReplayInvalidErrorMessage(raw)) return toReasonClassification("format");
	const reasonFrom402Text = classifyFailoverReasonFrom402Text(raw);
	if (reasonFrom402Text) return toReasonClassification(reasonFrom402Text);
	if (extractLeadingHttpStatus(raw.trim())?.code !== 429 && isBillingErrorMessage(raw)) return toReasonClassification("billing");
	if (isPeriodicUsageLimitErrorMessage(raw)) return toReasonClassification(isBillingErrorMessage(raw) ? "billing" : "rate_limit");
	const generalReason = GENERAL_MESSAGE_CLASSIFIERS.find(([matches]) => matches(raw))?.[1];
	if (generalReason) return toPluginClassification(generalReason);
	const apiErrorReason = classifyCoreFailoverReasonFromErrorType(parseApiErrorInfo(raw)?.type ?? errorType);
	if (apiErrorReason) return toReasonClassification(apiErrorReason);
	return classifyFailoverClassificationFromHttpStatus(inferSignalStatus({ message: raw }), raw, null, void 0, provider);
}
function classifyFailoverDetailCandidates(details, provider) {
	for (const detail of details ?? []) {
		const classification = classifyFailoverClassificationFromMessage(detail, provider);
		if (classification) return classification;
	}
	return null;
}
function mergeMessageAndDetailClassification(messageClassification, detailClassification) {
	if (!messageClassification || !detailClassification) return messageClassification ?? detailClassification;
	if (messageClassification.kind === "context_overflow") return messageClassification;
	return detailClassification.kind === "context_overflow" || detailClassification.reason === "billing" && messageClassification.reason === "rate_limit" || messageClassification.reason === "format" ? detailClassification : messageClassification;
}
function hasIndependentTransientMessage(raw, reason, provider) {
	const text = raw && (extractLeadingHttpStatus(raw)?.rest ?? raw);
	const info = parseApiErrorInfo(text);
	const payload = !info && text ? safeParseJsonRecord(text) : null;
	const prose = info ? info.message : payload ? typeof payload.message === "string" ? payload.message : void 0 : text;
	return Boolean(prose && classifyFailoverReasonFromCode(prose) !== reason && failoverReasonFromClassification(classifyFailoverClassificationFromMessage(prose, provider)) === reason);
}
function classifyFailoverSignalCore(signal, classifyProviderError) {
	if (resolveExecutionApprovalFailureMessage(signal.message)) return null;
	const inferredStatus = inferSignalStatus(signal);
	const explicitStatus = typeof signal.status === "number" && Number.isFinite(signal.status) ? signal.status : void 0;
	const messageClassification = signal.message ? classifyFailoverClassificationFromMessage(signal.message, signal.provider, signal.errorType) : null;
	const messageOrDetailClassification = mergeMessageAndDetailClassification(messageClassification, classifyFailoverDetailCandidates(signal.details, signal.provider));
	const errorTypeReason = classifyCoreFailoverReasonFromErrorType(signal.errorType);
	const errorTypeClassification = errorTypeReason ? toReasonClassification(errorTypeReason) : null;
	const providerHookStatus = explicitStatus ?? (signal.provider && (inferredStatus === 401 || inferredStatus === 403 || inferredStatus === 429) ? inferredStatus : void 0);
	const hasProviderHookSignal = Boolean(signal.message || signal.code || signal.errorType || typeof inferredStatus === "number");
	const hasStructuredDescriptor = providerHookStatus !== void 0 || signal.code !== void 0 || signal.errorType !== void 0;
	const hasContextCandidate = Boolean(signal.message && looksLikeProviderContextOverflowCandidate(signal.message));
	const shouldConsultProviderPlugin = hasProviderHookSignal && (hasStructuredDescriptor || hasContextCandidate || !messageClassification);
	let providerPluginReason = null;
	if (shouldConsultProviderPlugin) {
		const context = {
			errorMessage: signal.message ?? "",
			provider: signal.provider,
			status: providerHookStatus,
			code: signal.code,
			errorType: signal.errorType
		};
		providerPluginReason = classifyProviderError?.(context) ?? null;
	}
	const tlsCertificateError = inspectTlsCertificateError(signal);
	if (!providerPluginReason && tlsCertificateError && inferredStatus === void 0) return toReasonClassification("tls_certificate");
	if (!providerPluginReason && signal.message && isTransportHtmlErrorStatus(inferredStatus) && isHtmlErrorResponse(signal.message)) return classifyFailoverClassificationFromHttpStatus(inferredStatus, void 0, null, signal.status, signal.provider);
	const codeReason = classifyFailoverReasonFromCode(signal.code) ?? classifyFailoverReasonFromCode(parseApiErrorInfo(signal.message)?.code);
	const effectiveMessageClassification = providerPluginReason ? toPluginClassification(providerPluginReason) : codeReason === "format" ? toReasonClassification("format") : mergeMessageAndDetailClassification(messageOrDetailClassification ?? errorTypeClassification, codeReason ? toReasonClassification(codeReason) : null);
	if (codeReason === "auth_permanent") return toReasonClassification(codeReason);
	const classification = classifyFailoverClassificationFromHttpStatus(inferredStatus, signal.message, effectiveMessageClassification, signal.status, signal.provider, { preserveProviderSignalClassification: providerPluginReason !== null }) ?? (codeReason ? toReasonClassification(codeReason) : effectiveMessageClassification);
	if (!providerPluginReason && inferredStatus !== void 0 && inferredStatus >= 400 && inferredStatus < 500 && inferredStatus !== 408 && inferredStatus !== 409 && inferredStatus !== 410 && inferredStatus !== 429 && inferredStatus !== 499 && classification?.kind === "reason" && classification.reason === codeReason && (codeReason === "rate_limit" || codeReason === "overloaded" || codeReason === "timeout")) {
		const info = parseApiErrorInfo(signal.message);
		if (!(hasIndependentTransientMessage(signal.message, codeReason, signal.provider) || signal.details?.some((detail) => hasIndependentTransientMessage(detail, codeReason, signal.provider))) && !/^throttling_?exception$/i.test(signal.code ?? info?.code ?? "")) return {
			...classification,
			sameModelRetry: false
		};
	}
	return classification;
}
function isCloudCodeAssistFormatError(raw) {
	return !isImageDimensionErrorMessage(raw) && matchesFormatErrorPattern(raw);
}
const API_ERROR_TRANSIENT_SIGNALS_RE = /internal server error|overload|temporarily unavailable|service unavailable|unknown error|server error|bad gateway|gateway timeout|upstream error|backend error|try again later|temporarily.+unable|unexpected error/i;
function isJsonApiInternalServerError(raw) {
	if (!normalizeLowercaseStringOrEmpty(raw).includes("\"type\":\"api_error\"")) return false;
	if (isBillingErrorMessage(raw)) return false;
	return API_ERROR_TRANSIENT_SIGNALS_RE.test(raw);
}
function isStructuredServerErrorMessage(raw) {
	const parsedType = normalizeOptionalLowercaseString(parseApiErrorInfo(raw)?.type);
	if (parsedType === "server_error" || parsedType === "upstream_error") return true;
	const value = normalizeLowercaseStringOrEmpty(raw);
	return value.includes("\"type\":\"server_error\"") || value.includes("\"code\":\"server_error\"") || value.includes("\"type\":\"upstream_error\"") || value.includes("\"code\":\"upstream_error\"");
}
function isCliSessionExpiredErrorMessage(raw) {
	return /\b(?:session (?:not found|does not exist|expired|invalid)|conversation (?:not found|does not exist|expired|invalid)|no conversation found|no such session|invalid session|(?:session|conversation) id not found)\b/.test(normalizeLowercaseStringOrEmpty(raw));
}
function classifyFailoverReasonCore(raw, opts, classifyProviderError) {
	return failoverReasonFromClassification(classifyFailoverSignalCore({
		message: raw,
		provider: opts?.provider
	}, classifyProviderError));
}
//#endregion
export { parseImageSizeError as a, parseImageDimensionError as i, classifyFailoverSignalCore as n, isCloudCodeAssistFormatError as r, classifyFailoverReasonCore as t };
