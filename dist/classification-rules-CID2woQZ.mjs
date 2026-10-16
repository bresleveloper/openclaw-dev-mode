import { c as normalizeOptionalLowercaseString } from "./string-coerce-1VuiLaaR.mjs";
import { D as extractLeadingHttpStatus, F as parseApiErrorInfo } from "./redact-DJ8j6ADa.mjs";
import { a as isBillingErrorMessage, d as isRateLimitErrorMessage, i as isAuthPermanentErrorMessage } from "./message-patterns-Oyttjfxg.mjs";
import { n as isTransientNetworkError } from "./retryable-network-errors-D2gJmBqw.mjs";
//#region src/agents/failover/classification-rules.ts
const FAILOVER_TIMEOUT_ERROR_CODES = /* @__PURE__ */ new Set([
	"EHOSTDOWN",
	"ENETRESET",
	"ERR_STREAM_PREMATURE_CLOSE"
]);
const NO_BODY_HTTP_WRAPPER_RE = /^(?:no body(?: response)?|no response body|status code \(no body\))$/i;
function stripErrorPrefix(raw) {
	return raw.replace(/^error:\s*/i, "").trim();
}
function inferSignalStatus(signal) {
	if (typeof signal.status === "number" && Number.isFinite(signal.status)) return signal.status;
	return extractLeadingHttpStatus(stripErrorPrefix(signal.message?.trim() ?? ""))?.code;
}
function isExplicitNoBodyHttpMessage(raw, status) {
	const trimmed = raw?.trim();
	if (!trimmed) return false;
	const candidate = extractLeadingHttpStatus(trimmed) ? trimmed : stripErrorPrefix(trimmed);
	const leadingStatus = extractLeadingHttpStatus(candidate);
	if (leadingStatus) {
		if (typeof status === "number" && leadingStatus.code !== status) return false;
		return NO_BODY_HTTP_WRAPPER_RE.test(leadingStatus.rest);
	}
	return NO_BODY_HTTP_WRAPPER_RE.test(candidate);
}
function isUnclassifiedNoBodyHttpSignal(signal) {
	const status = inferSignalStatus(signal);
	if (status !== 400 && status !== 422) return false;
	const message = signal.message?.trim();
	return !message || isExplicitNoBodyHttpMessage(message, status);
}
const BILLING_402_HINTS = [
	"insufficient credits",
	"insufficient quota",
	"credit balance",
	"insufficient balance",
	"plans & billing",
	"add more credits",
	"top up"
];
const BILLING_402_PLAN_HINTS = [
	"upgrade your plan",
	"upgrade plan",
	"current plan",
	"subscription"
];
const PERIODIC_402_HINTS = [
	"daily",
	"weekly",
	"monthly"
];
const RETRYABLE_402_RETRY_HINTS = [
	"try again",
	"retry",
	"temporary",
	"cooldown"
];
const RETRYABLE_402_LIMIT_HINTS = [
	"usage limit",
	"rate limit",
	"organization usage"
];
const RETRYABLE_402_SCOPED_HINTS = ["organization", "workspace"];
const RETRYABLE_402_SCOPED_RESULT_HINTS = [
	"billing period",
	"exceeded",
	"reached",
	"exhausted"
];
const RAW_402_MARKER_RE = /["']?(?:status|code)["']?\s*[:=]\s*402\b|\bhttp\s*402\b|\berror(?:\s+code)?\s*[:=]?\s*402\b|\b(?:got|returned|received)\s+(?:a\s+)?402\b|^\s*402\s+(?:payment required\b|.*used up your points\b|no available asset for api access\b)/i;
const BARE_LEADING_402_RE = /^\s*402\b/i;
const LEADING_402_WRAPPER_RE = /^(?:error[:\s-]+)?(?:(?:http\s*)?402(?:\s+payment required)?|payment required)(?:[:\s-]+|$)/i;
function includesAnyHint(text, hints) {
	return hints.some((hint) => text.includes(hint));
}
function hasExplicit402BillingSignal(text) {
	return includesAnyHint(text, BILLING_402_HINTS) || includesAnyHint(text, BILLING_402_PLAN_HINTS) && text.includes("limit") || text.includes("billing hard limit") || text.includes("hard limit reached") || text.includes("maximum allowed") && text.includes("limit");
}
function hasQuotaRefreshWindowSignal(text) {
	return text.includes("subscription quota limit") && (text.includes("automatic quota refresh") || text.includes("rolling time window"));
}
function hasRetryable402TransientSignal(text) {
	const hasPeriodicHint = includesAnyHint(text, PERIODIC_402_HINTS);
	const hasSpendLimit = text.includes("spend limit") || text.includes("spending limit");
	const hasScopedHint = includesAnyHint(text, RETRYABLE_402_SCOPED_HINTS);
	return includesAnyHint(text, RETRYABLE_402_RETRY_HINTS) && includesAnyHint(text, RETRYABLE_402_LIMIT_HINTS) || hasPeriodicHint && (text.includes("usage limit") || hasSpendLimit) || hasPeriodicHint && text.includes("limit") && text.includes("reset") || hasScopedHint && text.includes("limit") && (hasSpendLimit || includesAnyHint(text, RETRYABLE_402_SCOPED_RESULT_HINTS));
}
function hasKnownBareLeading402Signal(text) {
	return hasQuotaRefreshWindowSignal(text) || hasExplicit402BillingSignal(text) || isRateLimitErrorMessage(text) || hasRetryable402TransientSignal(text);
}
function normalize402Message(raw) {
	return normalizeOptionalLowercaseString(raw)?.replace(LEADING_402_WRAPPER_RE, "").replace(/\bhttps?:\/\/[^\s<>"']+/g, " ").trim() ?? "";
}
function classify402Message(message) {
	const normalized = normalize402Message(message);
	if (!normalized) return "billing";
	if (hasQuotaRefreshWindowSignal(normalized)) return "rate_limit";
	if (hasExplicit402BillingSignal(normalized)) return "billing";
	if (isRateLimitErrorMessage(normalized) || hasRetryable402TransientSignal(normalized)) return "rate_limit";
	return "billing";
}
function classifyFailoverReasonFrom402Text(raw) {
	if (RAW_402_MARKER_RE.test(raw)) return classify402Message(raw);
	if (!BARE_LEADING_402_RE.test(raw)) return null;
	const normalized = normalize402Message(raw);
	if (!normalized || !hasKnownBareLeading402Signal(normalized)) return null;
	return classify402Message(raw);
}
function toReasonClassification(reason) {
	return {
		kind: "reason",
		reason
	};
}
function toPluginClassification(reason) {
	return reason === "context_overflow" ? { kind: "context_overflow" } : toReasonClassification(reason);
}
function failoverReasonFromClassification(classification) {
	if (!classification) return null;
	return classification.kind === "reason" ? classification.reason : "context_overflow";
}
function classifyFailoverClassificationFromHttpStatus(status, message, messageClassification, explicitStatus, provider, opts) {
	const messageReason = failoverReasonFromClassification(messageClassification);
	if (typeof status !== "number" || !Number.isFinite(status)) return null;
	if (status === 402) {
		if (!message) return toReasonClassification("billing");
		if (extractLeadingHttpStatus(message.trim())?.code === 402) {
			const reasonFrom402Text = classifyFailoverReasonFrom402Text(message);
			if (reasonFrom402Text) return toReasonClassification(reasonFrom402Text);
			return typeof explicitStatus === "number" ? toReasonClassification(classify402Message(message)) : messageClassification;
		}
		return toReasonClassification(classify402Message(message));
	}
	if (status === 429) {
		if (opts?.preserveProviderSignalClassification && (messageReason === "billing" || messageReason === "rate_limit")) return messageClassification;
		if (messageReason === "billing" && !isAmbiguousGeneric429BalanceMessage(message ?? "")) return toReasonClassification("billing");
		if (message && isBilling429MessageForProvider(message, provider)) return toReasonClassification("billing");
		return toReasonClassification("rate_limit");
	}
	if (status === 401 || status === 403) {
		if (opts?.preserveProviderSignalClassification && messageClassification) return messageClassification;
		if (message && isAuthPermanentErrorMessage(message)) return toReasonClassification("auth_permanent");
		if (messageReason === "billing") return toReasonClassification("billing");
		return toReasonClassification("auth");
	}
	if (status === 408) return toReasonClassification("timeout");
	if (status === 410) {
		if (messageReason === "session_expired" || messageReason === "billing" || messageReason === "auth_permanent" || messageReason === "auth") return messageClassification;
		return toReasonClassification("timeout");
	}
	if (messageClassification?.kind === "context_overflow") return messageClassification;
	if (status === 404) {
		if (messageReason === "session_expired" || messageReason === "billing" || messageReason === "auth_permanent" || messageReason === "auth" || messageReason === "format") return messageClassification;
		return toReasonClassification("model_not_found");
	}
	if (status === 529) return toReasonClassification("overloaded");
	if (status === 499 || status >= 500 && status < 600) {
		if (messageReason === "overloaded" || messageReason === "server_error" || status >= 500 && messageReason === "format") return messageClassification;
		return toReasonClassification(status === 499 || status === 504 || status === 522 || status === 524 ? "timeout" : "server_error");
	}
	if (status === 400 || status === 422) {
		if (messageClassification && messageReason !== "server_error") return messageClassification;
		if (isUnclassifiedNoBodyHttpSignal({
			status,
			message
		})) return null;
		return toReasonClassification("format");
	}
	return null;
}
function classifyFailoverReasonFromCode(raw) {
	const normalized = raw?.trim().toUpperCase();
	if (!normalized) return null;
	switch (normalized) {
		case "UNKNOWN_PARAMETER": return "format";
		case "RESOURCE_EXHAUSTED":
		case "RATE_LIMIT":
		case "RATE_LIMITED":
		case "RATE_LIMIT_EXCEEDED":
		case "TOO_MANY_REQUESTS":
		case "THROTTLED":
		case "THROTTLING":
		case "THROTTLINGEXCEPTION":
		case "THROTTLING_EXCEPTION": return "rate_limit";
		case "DEACTIVATED_WORKSPACE": return "auth_permanent";
		case "SELECTED_AUTH_PROFILE_UNAVAILABLE": return "auth";
		case "OVERLOADED":
		case "OVERLOADED_ERROR": return "overloaded";
		default: return FAILOVER_TIMEOUT_ERROR_CODES.has(normalized) || isTransientNetworkError({ code: normalized }) ? "timeout" : null;
	}
}
function classifyCoreFailoverReasonFromErrorType(raw) {
	switch (normalizeOptionalLowercaseString(raw)) {
		case "invalid_request_error": return "format";
		case "server_error":
		case "upstream_error": return "server_error";
		case "overloaded_error": return "overloaded";
		default: return null;
	}
}
function hasStructuredBilling429Signal(raw) {
	if (hasBillingApiErrorType(raw)) return true;
	const leadingStatus = extractLeadingHttpStatus(raw.trim());
	return Boolean(leadingStatus?.rest && hasBillingApiErrorType(leadingStatus.rest));
}
function hasBillingApiErrorType(raw) {
	const type = normalizeOptionalLowercaseString(parseApiErrorInfo(raw)?.type);
	if (!type) return false;
	return isBillingErrorMessage(type) || isBillingErrorMessage(type.replaceAll("_", " "));
}
function isAmbiguousGeneric429BalanceMessage(raw) {
	return /\binsufficient\s+account\s+balance\b/i.test(raw) && !hasStructuredBilling429Signal(raw);
}
function isBilling429MessageForProvider(raw, provider) {
	if (!isBillingErrorMessage(raw)) return false;
	const normalizedProvider = normalizeOptionalLowercaseString(provider) ?? "";
	return [
		"xai",
		"moonshot",
		"kimi"
	].some((name) => normalizedProvider.includes(name)) || !isAmbiguousGeneric429BalanceMessage(raw);
}
const REPLAY_INVALID_RE = /\bprevious_response_id\b.*\b(?:invalid|unknown|not found|does not exist|expired|mismatch)\b|\btool_(?:use|call)\.(?:input|arguments)\b.*\b(?:missing|required)\b|\bincorrect role information\b|\broles must alternate\b|\binput item id does not belong to this connection\b/i;
const THINKING_SIGNATURE_ERROR_RE = /\b(?:invalid|expired)\b.*\bsignature\b|\bsignature\b.*\b(?:invalid|expired)\b/i;
function isReplayInvalidErrorMessage(raw) {
	return REPLAY_INVALID_RE.test(raw) || /\bthinking\b/i.test(raw) && THINKING_SIGNATURE_ERROR_RE.test(raw);
}
function isGenericUnknownStreamErrorMessage(raw) {
	return /^\s*an unknown error occurred\.?\s*$/i.test(raw);
}
function isExactUnknownNoDetailsError(raw) {
	return normalizeOptionalLowercaseString(raw) === "unknown error (no error details in response)";
}
function isClaudeCliAuthError(raw, provider) {
	if (normalizeOptionalLowercaseString(provider) !== "claude-cli") return false;
	return /\bnot logged in\b\s*·\s*please run \/login\b|\bfailed to authenticate:\s*oauth session expired and could not be refreshed\b/i.test(raw);
}
function isUnsupportedImageInputErrorMessage(raw) {
	const normalized = normalizeOptionalLowercaseString(raw);
	if (!normalized) return false;
	return /\bdoes not support image inputs?\b/.test(normalized) || /\bunsupported image input\b/.test(normalized) || /\bno endpoints found\b/.test(normalized) && /\bsupport image input\b/.test(normalized);
}
//#endregion
export { failoverReasonFromClassification as a, isExactUnknownNoDetailsError as c, isUnclassifiedNoBodyHttpSignal as d, isUnsupportedImageInputErrorMessage as f, classifyFailoverReasonFromCode as i, isGenericUnknownStreamErrorMessage as l, toReasonClassification as m, classifyFailoverClassificationFromHttpStatus as n, inferSignalStatus as o, toPluginClassification as p, classifyFailoverReasonFrom402Text as r, isClaudeCliAuthError as s, classifyCoreFailoverReasonFromErrorType as t, isReplayInvalidErrorMessage as u };
