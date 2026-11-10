import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import "./src-Djeo9OvP.mjs";
import { t as stableStringify } from "./stable-stringify-Djn3uxNo.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { C as isGenericProviderInternalError, E as parseApiErrorPayload, S as isCloudflareOrHtmlErrorPage, T as parseApiErrorInfo, _ as extractLeadingHttpStatus, b as formatRawAssistantErrorForUi, g as extractErrorHttpStatus, h as MALFORMED_STREAMING_FRAGMENT_ERROR_MESSAGE, m as CONTEXT_OVERFLOW_ERROR_MESSAGE, x as formatTransportErrorCopy } from "./redact-BcXJu5HP.mjs";
import { c as isPeriodicUsageLimitErrorMessage, u as isProviderCompletedErrorFinishReasonMessage, y as splitFailoverAggregateLegs } from "./message-patterns-DSkmGYcR.mjs";
import { n as formatCommandErrorForUser } from "./command-error-B2V3e5UN.mjs";
import { t as classifyFailoverReasonCore } from "./classify-core-Y2V-pZHU.mjs";
import { n as ERROR_PREFIX_RE, t as ERROR_DETAILS_HINT } from "./assistant-request-failure-copy-csnSONXK.mjs";
//#region src/agents/exec-approval-result.ts
/**
* Parses exec approval tool output and formats denial messages for users.
*/
const EXEC_COMPLETED_RE = /^exec completed:\s*([\s\S]*)$/i;
const APPROVAL_METADATA_SOURCE_RE = /^(?:gateway\s+id=|node=)/i;
function parseExecApprovalResultWithMetadata(raw, prefix, bodySeparator) {
	const normalizedRaw = normalizeLowercaseStringOrEmpty(raw);
	const normalizedPrefix = normalizeLowercaseStringOrEmpty(prefix);
	if (!normalizedRaw.startsWith(normalizedPrefix)) return null;
	const metadataStart = prefix.length;
	let depth = 1;
	let metadataEnd = -1;
	for (let index = metadataStart; index < raw.length; index += 1) {
		const char = raw[index];
		if (char === "(") {
			depth += 1;
			continue;
		}
		if (char === ")") {
			depth -= 1;
			if (depth === 0) {
				metadataEnd = index;
				break;
			}
		}
	}
	if (metadataEnd < 0) return null;
	const metadata = raw.slice(metadataStart, metadataEnd).trim();
	if (!APPROVAL_METADATA_SOURCE_RE.test(metadata)) return null;
	const remainder = raw.slice(metadataEnd + 1);
	if (!remainder.startsWith(bodySeparator) && (bodySeparator === ":" || remainder)) return null;
	return {
		metadata,
		body: remainder.slice(1).trim()
	};
}
function parseExecApprovalResultText(resultText) {
	const raw = resultText.trim();
	if (!raw) return {
		kind: "other",
		raw
	};
	for (const [kind, prefix, separator] of [
		[
			"denied",
			"Exec denied (",
			":"
		],
		[
			"finished",
			"Exec finished (",
			"\n"
		],
		[
			"outcome-unknown",
			"Exec outcome unknown (",
			"\n"
		],
		[
			"not-dispatched",
			"Exec not dispatched (",
			"\n"
		]
	]) {
		const result = parseExecApprovalResultWithMetadata(raw, prefix, separator);
		if (result) return {
			kind,
			raw,
			...result
		};
	}
	const completedMatch = EXEC_COMPLETED_RE.exec(raw);
	if (completedMatch) return {
		kind: "completed",
		raw,
		body: completedMatch[1]?.trim() ?? ""
	};
	return {
		kind: "other",
		raw
	};
}
function isExecDeniedResultText(resultText) {
	return parseExecApprovalResultText(resultText).kind === "denied";
}
function formatExecDeniedUserMessage(resultText) {
	const parsed = parseExecApprovalResultText(resultText);
	if (parsed.kind !== "denied") return null;
	const metadata = normalizeLowercaseStringOrEmpty(parsed.metadata);
	if (metadata.includes("approval-timeout")) return "Command did not run: approval timed out.";
	if (metadata.includes("user-denied")) return "Command did not run: approval was denied.";
	if (metadata.includes("allowlist-miss")) return "Command did not run: approval is required.";
	if (metadata.includes("approval-request-failed")) return "Command did not run: approval request failed.";
	return "Command did not run.";
}
//#endregion
//#region src/agents/failover/request-error-facets.ts
/** Classify copy-sensitive provider-request facts that are finer than FailoverReason. */
function classifyProviderRequestFacets(signal) {
	const message = signal.message ?? "";
	const lower = normalizeLowercaseStringOrEmpty(message);
	const genericProviderError = lower.includes("an error occurred while processing your request") || lower.includes("something went wrong while processing your request");
	const providerInternal503 = signal.status === 503 || /\b(?:(?:unexpected\s+status|http)\s*503|503\s+service unavailable)\b|["'](?:status|code)["']\s*:\s*503\b/iu.test(message);
	if (genericProviderError && (signal.status === 429 || /\b(?:http\s*)?429\b|["'](?:status|code)["']\s*:\s*429\b/iu.test(message))) return "quota-429";
	if (isProviderConversationStateError(lower)) return "conversation-state";
	if (providerInternal503) return "provider-internal-503";
	return lower.includes("the ai service returned an internal error") || lower.includes("provider returned an internal error") || genericProviderError && (lower.includes("server_error") || lower.includes("internal error")) ? "provider-internal" : null;
}
function isProviderConversationStateError(lower) {
	return lower.includes("custom tool call output is missing") && lower.includes("call id") || lower.includes("toolresult") && lower.includes("tooluse") && lower.includes("exceeds the number") && lower.includes("previous turn") || lower.includes("tool_use") && lower.includes("tool_result") && lower.includes("without") || lower.includes("function call turn comes immediately after") || lower.includes("incorrect role information") || lower.includes("roles must alternate") || lower.includes("invalid_replay_transcript");
}
//#endregion
//#region src/agents/failover/user-copy.ts
const RATE_LIMIT_ERROR_USER_MESSAGE = "⚠️ The AI service needs a short break. Please try again in a few minutes.";
const AUTH_INVALID_TOKEN_USER_TEXT = "Couldn't sign in to the AI service. Sign in again under Models in the Control UI or run `openclaw configure`.";
const SELECTED_AUTH_PROFILE_UNAVAILABLE_USER_TEXT = "This saved login isn't available. Choose another login under Models in the Control UI or run `openclaw configure`.";
const renderFailoverCodeUserCopy = (code) => code === "selected_auth_profile_unavailable" ? SELECTED_AUTH_PROFILE_UNAVAILABLE_USER_TEXT : void 0;
const MODEL_CAPACITY_ERROR_USER_MESSAGE = "⚠️ Selected model is at capacity. Try a different model, or wait and retry.";
const OVERLOADED_ERROR_USER_MESSAGE = "The AI service is temporarily overloaded. Please try again in a moment.";
const MODEL_CAPACITY_ERROR_RE = /\b(?:selected\s+)?model\s+(?:is\s+)?at capacity\b/i;
const RATE_LIMIT_SPECIFIC_HINT_RE = /\bmin(ute)?s?\b|\bhours?\b|\bseconds?\b|\btry again in\b|\bresets?\b|\bplan\b|\bquota\b/i;
const CONTEXT_OVERFLOW_ERROR_HEAD_RE = /^(?:context overflow:|request_too_large\b|request size exceeds\b|request exceeds the maximum size\b|context (?:length|window) exceeded\b|maximum context length\b|prompt is too long\b|exceeds model context window\b)/i;
const PROVIDER_PROMPT_SIZE_LIMIT_RE = /\b(?:this\s+)?prompt\s+(?:is\s+)?(?:too long|longer than)\b.{0,120}\b(?:free tier|single request|per[- ]request)\b/i;
const PROVIDER_PROMPT_SIZE_LIMIT_USER_MESSAGE = "⚠️ The provider rejected this request because the prompt exceeds its per-request limit. Shorten the prompt and try again, or choose a model with a larger limit.";
const PROVIDER_PROMPT_SIZE_ERROR_PARSE_MAX_LENGTH = 16384;
const NON_ERROR_PROVIDER_PAYLOAD_MAX_LENGTH = 16384;
const NON_ERROR_PROVIDER_PAYLOAD_PREFIX_RE = /^codex\s*error(?:\s+\d{3})?[:\s-]+/i;
/** Format billing copy with optional provider/model and credential context. */
function formatBillingErrorMessage(provider, model, authMode) {
	const providerName = provider?.trim();
	const modelName = model?.trim();
	const providerLabel = providerName && modelName ? `${providerName} (${modelName})` : providerName || void 0;
	if (authMode === "oauth" || authMode === "token") return `⚠️ ${providerLabel ?? "API provider"} returned a billing error — check your account for subscription or usage limits, then try again.`;
	return providerLabel ? `⚠️ ${providerLabel} returned a billing error — check your account's balance and usage limits before trying again.` : "⚠️ The AI service reported a billing problem. Check your account's credit balance and usage limits before trying again.";
}
const BILLING_ERROR_USER_MESSAGE = formatBillingErrorMessage();
function extractProviderRateLimitMessage(raw) {
	const withoutPrefix = raw.replace(ERROR_PREFIX_RE, "").trim();
	const candidate = (parseApiErrorInfo(raw) ?? parseApiErrorInfo(withoutPrefix))?.message ?? (extractLeadingHttpStatus(withoutPrefix)?.rest || withoutPrefix);
	if (!candidate || !RATE_LIMIT_SPECIFIC_HINT_RE.test(candidate)) return;
	if (isCloudflareOrHtmlErrorPage(withoutPrefix)) return;
	const trimmed = candidate.trim().replace(/\s+\((?:rate_limit|overloaded|unknown)\)$/iu, "");
	if (trimmed.length > 300 || trimmed.startsWith("{") || /^(?:<!doctype\s+html\b|<html\b)/i.test(trimmed)) return;
	return `⚠️ ${trimmed}`;
}
function renderProviderPromptSizeLimitCopy(raw) {
	if (raw.length > PROVIDER_PROMPT_SIZE_ERROR_PARSE_MAX_LENGTH) return;
	const status = extractErrorHttpStatus(raw);
	if (status?.code !== 400) return;
	const providerMessage = (parseApiErrorInfo(raw) ?? parseApiErrorInfo(status.rest))?.message ?? status.rest;
	return providerMessage.length <= 300 && PROVIDER_PROMPT_SIZE_LIMIT_RE.test(providerMessage) ? PROVIDER_PROMPT_SIZE_LIMIT_USER_MESSAGE : void 0;
}
/** Render only controller-recorded exhaustion, never infer it from provider text. */
function renderRateLimitRetryExhaustion(retries, finalModel = false) {
	if (retries === void 0) return;
	const scope = finalModel ? " on the final model" : "";
	return retries === 0 ? `Automatic rate-limit recovery is disabled${scope} for this session (retry.provider.maxRetries: 0).` : `Rate-limit recovery stopped${scope} after ${retries} automatic ${retries === 1 ? "retry" : "retries"} without a completed model response. Check completed work before trying again.`;
}
/** Render rate-limit versus overload copy from the canonical classified reason. */
function renderRateLimitOrOverloadedCopy(params) {
	const exhaustion = params.reason === "rate_limit" ? renderRateLimitRetryExhaustion(params.rateLimitRetriesExhausted) : void 0;
	if (exhaustion) return exhaustion;
	const raw = params.raw ?? "";
	if (MODEL_CAPACITY_ERROR_RE.test(raw)) return MODEL_CAPACITY_ERROR_USER_MESSAGE;
	if (params.reason === "overloaded") return OVERLOADED_ERROR_USER_MESSAGE;
	const promptSizeCopy = renderProviderPromptSizeLimitCopy(raw);
	if (promptSizeCopy) return promptSizeCopy;
	for (const leg of splitFailoverAggregateLegs(raw)) {
		const fromLeg = extractProviderRateLimitMessage(leg);
		if (fromLeg) return fromLeg;
	}
	return extractProviderRateLimitMessage(raw) ?? RATE_LIMIT_ERROR_USER_MESSAGE;
}
function formatDiskSpaceErrorCopy(raw) {
	const lower = normalizeLowercaseStringOrEmpty(raw);
	return /\benospc\b/i.test(raw) || lower.includes("no space left on device") || lower.includes("disk full") ? "OpenClaw could not write local session data because the disk is full. Free some disk space and try again." : void 0;
}
function isInvalidStreamingEventOrderError(raw) {
	const lower = normalizeLowercaseStringOrEmpty(raw);
	return lower.includes("unexpected event order") && lower.includes("message_start") && lower.includes("message_stop");
}
function isStreamingJsonParseError(raw) {
	return raw.trim() === MALFORMED_STREAMING_FRAGMENT_ERROR_MESSAGE;
}
function getApiErrorPayloadFingerprint(raw) {
	if (!raw) return null;
	const payload = parseApiErrorPayload(raw);
	return payload ? stableStringify(payload) : null;
}
function isRawApiErrorPayload(raw) {
	return getApiErrorPayloadFingerprint(raw) !== null;
}
/** Recognize provider HTTP/HTML failures from canonical classification facts. */
function isLikelyHttpErrorText(raw) {
	if (isCloudflareOrHtmlErrorPage(raw)) return true;
	const status = extractLeadingHttpStatus(raw);
	return Boolean(status && status.code >= 400 && (classifyFailoverReasonCore(raw) !== null || classifyProviderRequestFacets({
		status: status.code,
		message: raw
	}) !== null));
}
function shouldRewriteRawPayloadWithoutErrorContext(raw) {
	if (raw.length > NON_ERROR_PROVIDER_PAYLOAD_MAX_LENGTH || !NON_ERROR_PROVIDER_PAYLOAD_PREFIX_RE.test(raw)) return false;
	const info = parseApiErrorInfo(raw);
	if (normalizeLowercaseStringOrEmpty(info?.type).endsWith("_error")) return true;
	const code = Number(info?.httpCode);
	return Number.isFinite(code) && code >= 400;
}
/** Sanitize presentation text, then render error copy from classified facts when requested. */
function renderSanitizedUserFacingText(sanitized, opts) {
	if (!sanitized) return sanitized;
	const trimmed = sanitized.trim();
	if (!opts?.errorContext) return shouldRewriteRawPayloadWithoutErrorContext(trimmed) ? formatRawAssistantErrorForUi(trimmed) : sanitized;
	for (const format of [
		formatCommandErrorForUser,
		formatExecDeniedUserMessage,
		formatDiskSpaceErrorCopy
	]) {
		const copy = format(trimmed);
		if (copy) return copy;
	}
	if (/incorrect role information|roles must alternate/i.test(trimmed)) return "Message ordering conflict - please try again. If this persists, use /new to start a fresh session.";
	const reason = classifyFailoverReasonCore(trimmed);
	const status = extractLeadingHttpStatus(trimmed);
	const rawPayload = isRawApiErrorPayload(trimmed);
	if (reason === "context_overflow" && (rawPayload || status && status.code >= 400 || ERROR_PREFIX_RE.test(trimmed) || CONTEXT_OVERFLOW_ERROR_HEAD_RE.test(trimmed))) return CONTEXT_OVERFLOW_ERROR_MESSAGE;
	if (reason === "billing" || reason === "rate_limit" || reason === "overloaded") return reason === "billing" ? BILLING_ERROR_USER_MESSAGE : renderRateLimitOrOverloadedCopy({
		reason,
		raw: trimmed
	});
	const providerRequestCode = resolveProviderRequestFailureCode({
		classification: reason ? {
			kind: "reason",
			reason
		} : null,
		facet: null,
		status: extractErrorHttpStatus(trimmed)?.code
	});
	if (providerRequestCode) return PROVIDER_REQUEST_COPY[providerRequestCode];
	if (isGenericProviderInternalError(trimmed)) return formatRawAssistantErrorForUi(trimmed);
	if (isInvalidStreamingEventOrderError(trimmed)) return "LLM request failed: provider returned an invalid streaming response. Please try again.";
	if (rawPayload || status && status.code >= 400 && reason) return formatRawAssistantErrorForUi(trimmed);
	if (isStreamingJsonParseError(trimmed)) return "LLM streaming response contained a malformed fragment. Please try again.";
	if (ERROR_PREFIX_RE.test(trimmed)) {
		const transport = formatTransportErrorCopy(trimmed);
		if (transport) return transport;
		if (isProviderCompletedErrorFinishReasonMessage(trimmed)) return formatRawAssistantErrorForUi(trimmed);
		if (reason === "timeout") return "LLM request timed out.";
		return formatRawAssistantErrorForUi(trimmed);
	}
	return sanitized;
}
const GENERIC_EXTERNAL_RUN_FAILURE_TEXT = "⚠️ OpenClaw couldn't finish this request. Check the conversation before trying again. For details, open Settings → Logs in the Control UI or run `openclaw logs --follow`.";
const HEARTBEAT_FAILURE_LEAD = "⚠️ The background check did not complete.";
const HEARTBEAT_FAILURE_LOG_HINT = "Troubleshooting: run `openclaw logs --follow` in a terminal.";
const HEARTBEAT_EXTERNAL_RUN_FAILURE_TEXT = `${HEARTBEAT_FAILURE_LEAD}\n\n${HEARTBEAT_FAILURE_LOG_HINT}`;
/** `reason` is the failure-reply owner's already sanitized and capped detail. */
function renderHeartbeatRunFailureCopy(reason) {
	if (!reason) return HEARTBEAT_EXTERNAL_RUN_FAILURE_TEXT;
	const terminator = /[.!?]$/u.test(reason) ? "" : ".";
	return `${HEARTBEAT_FAILURE_LEAD}\n\nDetails: ${reason}${terminator}\n${HEARTBEAT_FAILURE_LOG_HINT}`;
}
const PROVIDER_CONVERSATION_STATE_ERROR_USER_MESSAGE = "⚠️ The model provider rejected the conversation state. Please try again, or use /new to start a fresh session.";
const PROVIDER_REQUEST_COPY = {
	provider_authentication_error: `⚠️ ${AUTH_INVALID_TOKEN_USER_TEXT}`,
	provider_conversation_state_error: PROVIDER_CONVERSATION_STATE_ERROR_USER_MESSAGE,
	provider_internal_error: "⚠️ The model provider returned a temporary internal error before replying. Try again in a moment, or switch to another model if it keeps happening.",
	provider_model_unavailable: "⚠️ This model was not found. Choose another model in the Control UI or run `openclaw configure`.",
	provider_rate_limit_or_quota_error: "⚠️ The AI service can't accept more requests right now. Wait a few minutes, then try again. If it continues, check your account's usage and billing limits."
};
function resolveProviderRequestFailureCode(params) {
	const reason = params.classification?.kind === "reason" ? params.classification.reason : void 0;
	if (reason === "auth" && params.status === 401) return "provider_authentication_error";
	if (reason === "model_not_found") return "provider_model_unavailable";
	switch (params.facet) {
		case "quota-429": return "provider_rate_limit_or_quota_error";
		case "conversation-state": return "provider_conversation_state_error";
		case "provider-internal":
		case "provider-internal-503": return "provider_internal_error";
		default: return;
	}
}
function resolveProviderRequestFailureCopy(params) {
	const code = resolveProviderRequestFailureCode(params);
	if (!code) return;
	return {
		code,
		userMessage: PROVIDER_REQUEST_COPY[code],
		technicalMessage: params.technicalMessage
	};
}
function extractCodexUsageLimitErrorMessage(attempts, directMessage, directReason, directProvider, sanitizeText) {
	const text = attempts.find((candidate) => candidate.provider === "openai" && candidate.reason === "rate_limit" && candidate.error)?.error ?? (directProvider === "openai" && directReason === "rate_limit" ? directMessage : void 0);
	if (!text) return;
	const message = renderSanitizedUserFacingText(sanitizeText?.(text) ?? text, { errorContext: true }).split(/\r?\n/u).map((line) => line.trim()).filter(Boolean).join(" ").trim();
	if (!message) return;
	const truncated = message.length > 500 ? `${truncateUtf16Safe(message, 497)}...` : message;
	return truncated.startsWith("⚠️") ? truncated : `⚠️ ${truncated}`;
}
/** Render the reply surface's rate-limit copy, including structured cooldown context. */
function renderRateLimitReplyCopy(params) {
	const attempts = params.attempts ?? [];
	if (params.reason === "rate_limit") {
		const promptSizeCopy = renderProviderPromptSizeLimitCopy(params.message);
		if (promptSizeCopy) return promptSizeCopy;
	}
	const exhaustion = params.reason === "rate_limit" && !attempts.some((attempt) => attempt.reason === "billing") ? renderRateLimitRetryExhaustion(attempts.length ? attempts.at(-1)?.rateLimitRetriesExhausted : params.rateLimitRetriesExhausted, attempts.length > 1) : void 0;
	if (exhaustion) return exhaustion;
	const usageLimit = extractCodexUsageLimitErrorMessage(attempts, params.message, params.reason, params.provider, params.sanitizeText);
	if (usageLimit) return usageLimit;
	if (attempts.some((attempt) => attempt.reason === "billing") || params.reason === "billing") return BILLING_ERROR_USER_MESSAGE;
	if (attempts.length === 0) {
		if (params.reason === "rate_limit" && isPeriodicUsageLimitErrorMessage(params.message)) {
			const providerMessage = renderSanitizedUserFacingText(params.sanitizeText?.(params.message) ?? params.message, { errorContext: true });
			return providerMessage.startsWith("⚠️") ? providerMessage : `⚠️ ${providerMessage}`;
		}
		return RATE_LIMIT_ERROR_USER_MESSAGE;
	}
	for (const attempt of attempts) {
		if (attempt.reason !== "rate_limit" || !attempt.error) continue;
		const hint = extractProviderRateLimitMessage(attempt.error);
		if (hint) return params.sanitizeText?.(attempt.error) ?? hint;
	}
	const expiry = params.cooldownExpiry;
	const nowMs = params.nowMs ?? Date.now();
	if (typeof expiry === "number" && expiry > nowMs) {
		const secsLeft = Math.max(1, Math.ceil((expiry - nowMs) / 1e3));
		return secsLeft <= 60 ? `⚠️ The AI service needs a short break. Please try again in ~${secsLeft}s.` : `⚠️ The AI service needs a short break. Please try again in ~${Math.ceil(secsLeft / 60)} min.`;
	}
	return new Set(attempts.map((attempt) => `${attempt.provider}/${attempt.model}`)).size > 1 && attempts.every((attempt) => attempt.reason === "rate_limit" || attempt.reason === "overloaded") ? "⚠️ The AI services are busy. Please try again in a few minutes." : RATE_LIMIT_ERROR_USER_MESSAGE;
}
function renderBillingReplyCopy(params) {
	const attempts = params.attempts ?? [];
	const billingFailure = attempts.length > 0 ? attempts.find((attempt) => attempt.reason === "billing" && (attempt.authMode === "oauth" || attempt.authMode === "token")) : params.authMode === "oauth" || params.authMode === "token" ? params : void 0;
	return billingFailure ? formatBillingErrorMessage(billingFailure.provider, billingFailure.model, billingFailure.authMode) : BILLING_ERROR_USER_MESSAGE;
}
function renderMissingApiKeyReplyCopy(params) {
	const provider = params?.provider.trim().toLowerCase();
	if (!provider) return null;
	if (provider === "openai" && params?.providerGuidance) return "⚠️ OpenAI needs a different sign-in for this model. Open Models in the Control UI or run `openclaw configure` to choose how to connect.";
	return provider === "openai" ? "⚠️ Couldn't connect to OpenAI. Run `openclaw doctor --fix`, then try again. If it still fails, open Models in the Control UI or run `openclaw configure`." : "⚠️ This AI service isn't set up yet. Sign in under Models in the Control UI or run `openclaw configure`.";
}
const CODEX_APP_SERVER_CLIENT_CLOSED_BEFORE_REPLY_RE = /\bcodex app-server client closed before turn completed\b/iu;
const CODEX_APP_SERVER_TURN_COMPLETION_IDLE_TIMEOUT_RE = /\bcodex app-server turn idle timed out waiting for turn\/completed\b/iu;
const CODEX_SESSION_GENERATION_NOT_CURRENT_RE = /\bcodex session generation is no longer current\b/iu;
const CODEX_EXECUTION_NODE_DISCONNECTED_RE = /^Codex execution node disconnected; start a fresh attempt\. \((?:execution node (?:failed|disconnected)|execution socket (?:closed|failed))(?:: [^\r\n]{1,240})?\)(?:\r?\n|$)/u;
function renderCodexAppServerFailureCopy(message) {
	const normalizedMessage = message.trim();
	if (CODEX_SESSION_GENERATION_NOT_CURRENT_RE.test(normalizedMessage)) return "⚠️ This Codex session changed before your message could run. Please send it again.";
	if (CODEX_EXECUTION_NODE_DISCONNECTED_RE.test(normalizedMessage)) return "⚠️ Codex execution node disconnected. Start a fresh attempt.";
	if (CODEX_APP_SERVER_CLIENT_CLOSED_BEFORE_REPLY_RE.test(normalizedMessage)) return "⚠️ Lost the connection to Codex before it confirmed the task was finished. It may still be running. Check the conversation in the Control UI before trying again.";
	if (CODEX_APP_SERVER_TURN_COMPLETION_IDLE_TIMEOUT_RE.test(normalizedMessage)) return "⚠️ Codex hasn't confirmed whether the task finished. It may still be running. Check the conversation in the Control UI before trying again.";
	return null;
}
const CLI_BACKEND_NO_OUTPUT_STALL_RE = /\bCLI produced no output for\s+(\d+)\s*s\s+and was terminated\b/iu;
const CLI_BACKEND_OVERALL_TIMEOUT_RE = /\bCLI exceeded timeout\s*\(\s*(\d+)\s*s\s*\)\s+and was terminated\b/iu;
function renderCliTimeoutReplyCopy(params) {
	const stall = params.message.match(CLI_BACKEND_NO_OUTPUT_STALL_RE);
	const overall = params.message.match(CLI_BACKEND_OVERALL_TIMEOUT_RE);
	const timeout = params.cliTimeout;
	const seconds = timeout?.timeoutSeconds ?? Number((stall ?? overall)?.[1]);
	if (!Number.isFinite(seconds)) return null;
	const mode = timeout?.mode ?? (stall ? "no-output" : "overall");
	const workStatus = timeout?.observedActivity || timeout?.backgroundTaskCount || timeout?.activeToolCount || params.replayPrevented ? " Some work may have completed. Check its results before trying again." : "";
	return `⚠️ ${mode === "no-output" ? "The task stopped responding." : "The task took too long."}${workStatus} ${mode === "no-output" ? "Check for a sign-in or confirmation prompt in the terminal." : "Try a smaller task, or increase the task time limit in the Control UI settings."}`;
}
const authProfileUnavailableCopy = (provider) => `Couldn't reach ${provider} with any of your saved logins right now.`;
const AUTH_PROFILE_COOLDOWN_COPY = {
	auth: (provider) => `Couldn't sign in to ${provider}. Your saved login looks expired or no longer works.`,
	auth_permanent: (provider) => `${provider} isn't accepting your saved login anymore.`,
	format: authProfileUnavailableCopy,
	rate_limit: (provider) => `${provider} is asking us to slow down. Please wait a moment before trying again.`,
	overloaded: (provider) => `${provider} is overloaded right now. Please wait a moment before trying again.`,
	billing: (provider) => `${provider} rejected the request — looks like a billing issue on the account.`,
	server_error: (provider) => `${provider} is having issues right now. Please wait a moment before trying again.`,
	timeout: (provider) => `${provider} hasn't been responding. Please wait a moment before trying again.`,
	tls_certificate: authProfileUnavailableCopy,
	context_overflow: authProfileUnavailableCopy,
	model_not_found: (provider) => `${provider} can't find the model you're using right now.`,
	session_expired: (provider) => `Couldn't sign in to ${provider}. Your saved login looks expired or no longer works.`,
	empty_response: authProfileUnavailableCopy,
	no_error_details: authProfileUnavailableCopy,
	unclassified: authProfileUnavailableCopy,
	unknown: authProfileUnavailableCopy
};
const AUTH_PROFILE_DIRECT_COPY = {
	auth: AUTH_PROFILE_COOLDOWN_COPY.auth,
	auth_permanent: (provider) => `${provider} isn't accepting your saved login.`,
	billing: AUTH_PROFILE_COOLDOWN_COPY.billing,
	session_expired: AUTH_PROFILE_COOLDOWN_COPY.session_expired
};
const AUTH_PROFILE_RECOVERY_REASONS = /* @__PURE__ */ new Set([
	"auth",
	"auth_permanent",
	"billing",
	"context_overflow",
	"session_expired",
	"empty_response",
	"no_error_details",
	"unclassified",
	"unknown"
]);
function renderAuthProfileFailoverCopy(params) {
	const description = params.allInCooldown ? AUTH_PROFILE_COOLDOWN_COPY[params.reason](params.provider) : AUTH_PROFILE_DIRECT_COPY[params.reason]?.(params.provider);
	const hint = AUTH_PROFILE_RECOVERY_REASONS.has(params.reason) ? params.recoveryHint : null;
	return [description ?? authProfileUnavailableCopy(params.provider), hint].filter(Boolean).join(" ");
}
function renderControlUiAgentFailureCopy() {
	return `⚠️ OpenClaw couldn't finish this reply. Check the conversation before trying again. ${ERROR_DETAILS_HINT}`;
}
function replaceGenericExternalRunFailureText(text) {
	const start = text.indexOf(GENERIC_EXTERNAL_RUN_FAILURE_TEXT);
	if (start < 0 || text.slice(start + 170).trim()) return {
		text,
		replaced: false
	};
	const prefix = text.slice(0, start).trimEnd();
	return {
		text: prefix ? `${prefix} ${HEARTBEAT_EXTERNAL_RUN_FAILURE_TEXT}` : HEARTBEAT_EXTERNAL_RUN_FAILURE_TEXT,
		replaced: true
	};
}
//#endregion
export { renderSanitizedUserFacingText as C, formatExecDeniedUserMessage as D, classifyProviderRequestFacets as E, isExecDeniedResultText as O, renderRateLimitRetryExhaustion as S, resolveProviderRequestFailureCopy as T, renderFailoverCodeUserCopy as _, formatBillingErrorMessage as a, renderRateLimitOrOverloadedCopy as b, isInvalidStreamingEventOrderError as c, isStreamingJsonParseError as d, renderAuthProfileFailoverCopy as f, renderControlUiAgentFailureCopy as g, renderCodexAppServerFailureCopy as h, PROVIDER_CONVERSATION_STATE_ERROR_USER_MESSAGE as i, parseExecApprovalResultText as k, isLikelyHttpErrorText as l, renderCliTimeoutReplyCopy as m, GENERIC_EXTERNAL_RUN_FAILURE_TEXT as n, formatDiskSpaceErrorCopy as o, renderBillingReplyCopy as p, HEARTBEAT_EXTERNAL_RUN_FAILURE_TEXT as r, getApiErrorPayloadFingerprint as s, AUTH_INVALID_TOKEN_USER_TEXT as t, isRawApiErrorPayload as u, renderHeartbeatRunFailureCopy as v, replaceGenericExternalRunFailureText as w, renderRateLimitReplyCopy as x, renderMissingApiKeyReplyCopy as y };
