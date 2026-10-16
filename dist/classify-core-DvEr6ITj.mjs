import { c as normalizeOptionalLowercaseString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { n as safeParseJsonRecord } from "./json-coercion-pfKbZnCJ.mjs";
import { D as extractLeadingHttpStatus, F as parseApiErrorInfo, N as isGenericProviderInternalError } from "./redact-DJ8j6ADa.mjs";
import { o as classifyOAuthRefreshFailure } from "./oauth-refresh-failure-B2gKOXl5.mjs";
import { a as isBillingErrorMessage, d as isRateLimitErrorMessage, f as isServerErrorMessage, g as resolveExecutionApprovalFailureMessage, h as matchesFormatErrorPattern, i as isAuthPermanentErrorMessage, l as isProviderCompletedErrorFinishReasonMessage, m as isTimeoutErrorMessage, o as isOverloadedErrorMessage, p as isSessionTranscriptValidationErrorMessage, r as isAuthErrorMessage, s as isPeriodicUsageLimitErrorMessage, u as isProviderRequestSizeCeilingError } from "./message-patterns-Oyttjfxg.mjs";
import { a as failoverReasonFromClassification, c as isExactUnknownNoDetailsError, f as isUnsupportedImageInputErrorMessage, i as classifyFailoverReasonFromCode, l as isGenericUnknownStreamErrorMessage, m as toReasonClassification, n as classifyFailoverClassificationFromHttpStatus, o as inferSignalStatus, p as toPluginClassification, r as classifyFailoverReasonFrom402Text, s as isClaudeCliAuthError, t as classifyCoreFailoverReasonFromErrorType, u as isReplayInvalidErrorMessage } from "./classification-rules-CID2woQZ.mjs";
import { inspectTlsCertificateError } from "@openclaw/ai/internal/shared";
import { matchesContextOverflowMessage } from "@openclaw/ai/internal/runtime";
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
	if (!msg) return false;
	if (/no endpoints found for/i.test(msg)) return true;
	if (/\brouter not found\b/i.test(msg)) return true;
	if (/unknown model/i.test(msg)) return true;
	if (/model(?:[_\-\s])?not(?:[_\-\s])?found|\bmodel\b.{0,60}?\bnot found\b/i.test(msg)) return true;
	if (/\b404\b/.test(msg) && /not(?:[_\-\s])?found/i.test(msg)) return true;
	if (/not_found_error/i.test(msg)) return true;
	if (/\bnot supported model\b/i.test(msg)) return true;
	if (/\bmodel\b[^.]{0,120}?\bis not supported when using\b[^.]{0,80}?\bwith a ChatGPT account\b/i.test(msg)) return true;
	if (/model:\s*[a-z0-9._/-]+/i.test(msg) && /not(?:[_\-\s])?found/i.test(msg)) return true;
	if (/models\/[^\s]+ is not found/i.test(msg)) return true;
	if (/model/i.test(msg) && /does not exist/i.test(msg)) return true;
	if (/selected model/i.test(msg) && /not(?:[_\-\s])?found/i.test(msg)) return true;
	if (/model/i.test(msg) && /deprecated/i.test(msg) && /(upgrade|transition) to/i.test(msg)) return true;
	if (/stealth model/i.test(msg) && /find it here/i.test(msg)) return true;
	if (/is not a valid model id/i.test(msg)) return true;
	if (/invalid model/i.test(msg) && !/invalid model reference/i.test(msg)) return true;
	return false;
}
//#endregion
//#region src/agents/failover/context-overflow-tables.ts
const PROVIDER_CONTEXT_OVERFLOW_SIGNAL_RE = /\b(?:context|window|prompt|token|tokens|input|request|model)\b/i;
const PROVIDER_CONTEXT_OVERFLOW_ACTION_RE = /\b(?:too\s+(?:large|long|many)|exceed(?:s|ed|ing)?|overflow|limit|maximum|max)\b/i;
function looksLikeProviderContextOverflowCandidate(errorMessage) {
	return !isRateLimitErrorMessage(errorMessage) && PROVIDER_CONTEXT_OVERFLOW_SIGNAL_RE.test(errorMessage) && PROVIDER_CONTEXT_OVERFLOW_ACTION_RE.test(errorMessage);
}
function isReasoningConstraintErrorMessage(raw) {
	if (!raw) return false;
	const lower = normalizeLowercaseStringOrEmpty(raw);
	return lower.includes("reasoning is mandatory") || lower.includes("reasoning is required") || lower.includes("requires reasoning") || lower.includes("reasoning") && lower.includes("cannot be disabled");
}
function hasRateLimitTpmHint(raw) {
	return matchesContextOverflowMessage(raw, "tpm-rate-limit-hint");
}
/** Detect explicit context-window overflow without confusing TPM rate limits. */
function isContextOverflowErrorFromTables(errorMessage) {
	if (!errorMessage) return false;
	if (hasRateLimitTpmHint(errorMessage) && !isProviderRequestSizeCeilingError(errorMessage)) return false;
	if (isReasoningConstraintErrorMessage(errorMessage)) return false;
	return matchesContextOverflowMessage(errorMessage, "failover-explicit") || looksLikeProviderContextOverflowCandidate(errorMessage) && matchesContextOverflowMessage(errorMessage, "provider-fallback");
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
const PROVIDER_SPECIFIC_PATTERNS = [
	{
		test: /\bworkers_ai\b.*\bquota limit exceeded\b/i,
		reason: "rate_limit"
	},
	{
		test: /\bmodelnotreadyexception\b/i,
		reason: "overloaded"
	},
	{
		test: /model(?:_is)?_deactivated|model has been deactivated/i,
		reason: "model_not_found"
	}
];
function isTransportHtmlErrorStatus(status) {
	return status === 408 || status === 499 || typeof status === "number" && status >= 500 && status < 600;
}
function classifyFailoverClassificationFromMessage(raw, provider, errorType) {
	if (isImageDimensionErrorMessage(raw) || isImageSizeError(raw)) return null;
	if (isUnsupportedImageInputErrorMessage(raw)) return toReasonClassification("format");
	if (isClaudeCliAuthError(raw, provider)) return toReasonClassification("auth");
	if (isSessionTranscriptValidationErrorMessage(raw)) return toReasonClassification("format");
	if (isCliSessionExpiredErrorMessage(raw)) return toReasonClassification("session_expired");
	if (isModelNotFoundErrorMessage(raw)) return toReasonClassification("model_not_found");
	const legacyProviderReason = PROVIDER_SPECIFIC_PATTERNS.find(({ test }) => test.test(raw))?.reason;
	if (legacyProviderReason) return toReasonClassification(legacyProviderReason);
	if (isContextOverflowErrorFromTables(raw)) return { kind: "context_overflow" };
	if (isReplayInvalidErrorMessage(raw)) return toReasonClassification("format");
	const reasonFrom402Text = classifyFailoverReasonFrom402Text(raw);
	if (reasonFrom402Text) return toReasonClassification(reasonFrom402Text);
	if (extractLeadingHttpStatus(raw.trim())?.code !== 429 && isBillingErrorMessage(raw)) return toReasonClassification("billing");
	if (isPeriodicUsageLimitErrorMessage(raw)) return toReasonClassification(isBillingErrorMessage(raw) ? "billing" : "rate_limit");
	if (isRateLimitErrorMessage(raw)) return toReasonClassification("rate_limit");
	if (isOverloadedErrorMessage(raw)) return toReasonClassification("overloaded");
	if (isProviderCompletedErrorFinishReasonMessage(raw)) return toReasonClassification("server_error");
	if (isStructuredServerErrorMessage(raw) && !isBillingErrorMessage(raw) && !isAuthPermanentErrorMessage(raw) && !isAuthErrorMessage(raw)) return toReasonClassification("server_error");
	if (isGenericProviderInternalError(raw)) return toReasonClassification("timeout");
	if (classifyOAuthRefreshFailure(raw)?.reason) return toReasonClassification("auth_permanent");
	if (isAuthPermanentErrorMessage(raw)) return toReasonClassification("auth_permanent");
	if (isAuthErrorMessage(raw)) return toReasonClassification("auth");
	if (isGenericUnknownStreamErrorMessage(raw) || isServerErrorMessage(raw) || isJsonApiInternalServerError(raw)) return toReasonClassification("timeout");
	if (isCloudCodeAssistFormatError(raw)) return toReasonClassification("format");
	if (isExactUnknownNoDetailsError(raw)) return toReasonClassification("no_error_details");
	if (isTimeoutErrorMessage(raw)) return toReasonClassification("timeout");
	if (matchesContextOverflowMessage(raw, "assistant-error")) return { kind: "context_overflow" };
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
	if (detailClassification.kind === "context_overflow") return detailClassification;
	if (detailClassification.reason === "billing" && messageClassification.reason === "rate_limit") return detailClassification;
	return messageClassification.reason === "format" ? detailClassification : messageClassification;
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
export { isContextOverflowErrorFromTables as a, parseImageDimensionError as c, hasRateLimitTpmHint as i, parseImageSizeError as l, classifyFailoverSignalCore as n, isReasoningConstraintErrorMessage as o, isCloudCodeAssistFormatError as r, looksLikeProviderContextOverflowCandidate as s, classifyFailoverReasonCore as t };
