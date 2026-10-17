import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { v as parseDateFirstTimestampMs } from "./number-coercion-CuVhdCBs.mjs";
import { d as normalizeStringEntries } from "./string-normalization-CECOqf64.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { A as formatRawAssistantErrorForUi, D as extractLeadingHttpStatus, E as extractErrorHttpStatus, F as parseApiErrorInfo, L as extractHttpResponseBody, N as isGenericProviderInternalError, P as isKnownTransportErrorCode, j as formatTransportErrorCopy, k as formatProviderRefusalText } from "./redact-DJ8j6ADa.mjs";
import { t as classifyGatewayStorageFailure } from "./sqlite-error-diagnostics-DCvjvszg.mjs";
import { t as createSubsystemLogger } from "./subsystem-I-uqdx4f.mjs";
import { r as normalizeProviderId } from "./provider-id-D1VImdKk.mjs";
import { c as normalizeThinkLevel } from "./thinking.shared-Jy32Vp-O.mjs";
import { o as extractToolCallsFromAssistant, s as extractToolResultId } from "./tool-result-pairing-DxxMHOQj.mjs";
import { o as classifyOAuthRefreshFailure } from "./oauth-refresh-failure-B2gKOXl5.mjs";
import "./thinking-NbdrO8vA.mjs";
import { g as resolveExecutionApprovalFailureMessage, h as matchesFormatErrorPattern, l as isProviderCompletedErrorFinishReasonMessage, m as isTimeoutErrorMessage } from "./message-patterns-Oyttjfxg.mjs";
import { t as sanitizeContentBlocksImages } from "./tool-images-BOFaDO1T.mjs";
import { i as isThinkingLikeBlock, n as rewriteToolResultIds, r as sanitizeToolCallIdsForCloudCodeAssist } from "./tool-call-id-CutFFA5a.mjs";
import { E as formatExecDeniedUserMessage, c as formatDiskSpaceErrorCopy, d as isLikelyHttpErrorText, f as isRawApiErrorPayload, p as isStreamingJsonParseError, r as AUTH_INVALID_TOKEN_USER_TEXT, s as formatBillingErrorMessage, u as isInvalidStreamingEventOrderError, x as renderRateLimitOrOverloadedCopy } from "./user-facing-text-DC1sCo4O.mjs";
import { a as isContextOverflowErrorFromTables, o as isReasoningConstraintErrorMessage } from "./classify-core-DvEr6ITj.mjs";
import { a as failoverReasonFromClassification, c as isExactUnknownNoDetailsError, o as inferSignalStatus, u as isReplayInvalidErrorMessage } from "./classification-rules-CID2woQZ.mjs";
import { a as renderAssistantRequestFailureCopy, i as renderAssistantFormatFailureCopy, o as renderFormatErrorCopy } from "./assistant-request-failure-copy-vZEGdJcT.mjs";
import { i as isLikelyContextOverflowError, n as classifyFailoverSignal, t as classifyFailoverReason } from "./classify-DEnvBJey.mjs";
import { o as stripThoughtSignatures } from "./bootstrap-DROECufe.mjs";
import { t as buildAssistantFailoverSignal } from "./assistant-message-failures-qHM9fOZl.mjs";
import { t as formatSandboxToolPolicyBlockedMessage } from "./runtime-status-m46YZG5q.mjs";
import { t as isAnthropicApi } from "./anthropic-api-h8NkJ9yu.mjs";
import { normalizeOpenAIResponsesFunctionCallId, replaceCompactionReplayOwnerContent, shouldNormalizeOpenAIResponsesToolCallId, splitOpenAIFunctionCallPairing } from "@openclaw/ai/transports";
//#region src/agents/embedded-agent-helpers/context-overflow-observation.ts
function isCompactionFailureError(errorMessage) {
	if (!errorMessage) return false;
	const lower = normalizeLowercaseStringOrEmpty(errorMessage);
	return (lower.includes("summarization failed") || lower.includes("compaction")) && (isLikelyContextOverflowError(errorMessage) || lower.includes("context overflow"));
}
const OBSERVED_OVERFLOW_TOKEN_PATTERNS = [
	/prompt is too long:\s*([\d,]+)\s+tokens\s*>\s*[\d,]+\s+maximum/i,
	/prompt is too long:\s*([\d,]+)\s*,\s*model maximum context length\s*:\s*[\d,]+/i,
	/requested\s+([\d,]+)\s+tokens/i,
	/token limit\s*:\s*[\d,]+\s*\(requested\s*:\s*([\d,]+)\)/i,
	/resulted in\s+([\d,]+)\s+tokens/i
];
const OBSERVED_OVERFLOW_TOKEN_SUM_PATTERNS = [/input length(?:\s+and\s+max_tokens)?\s+exceed\s+context(?:\s+limit|\s+window)?\s*\(i\.e\s*([\d,]+)\s*\+\s*([\d,]+)\s*>\s*[\d,]+\)/i, /input length\s+and\s+`max_tokens`\s+exceed\s+context\s+limit:\s*([\d,]+)\s*\+\s*([\d,]+)\s*>\s*[\d,]+/i];
function extractObservedOverflowTokenCount(errorMessage) {
	if (!errorMessage) return;
	for (const pattern of OBSERVED_OVERFLOW_TOKEN_SUM_PATTERNS) {
		const match = errorMessage.match(pattern);
		const rawLeft = match?.[1]?.replaceAll(",", "");
		const rawRight = match?.[2]?.replaceAll(",", "");
		if (!rawLeft || !rawRight) continue;
		const left = Number(rawLeft);
		const right = Number(rawRight);
		if (Number.isFinite(left) && left > 0 && Number.isFinite(right) && right >= 0) return Math.floor(left + right);
	}
	for (const pattern of OBSERVED_OVERFLOW_TOKEN_PATTERNS) {
		const rawCount = errorMessage.match(pattern)?.[1]?.replaceAll(",", "");
		if (!rawCount) continue;
		const parsed = Number(rawCount);
		if (Number.isFinite(parsed) && parsed > 0) return Math.floor(parsed);
	}
}
//#endregion
//#region src/agents/embedded-agent-helpers/provider-runtime-failure.ts
const AUTH_SCOPE_HINT_RE = /\b(?:missing|required|requires|insufficient)\s+(?:the\s+following\s+)?scopes?\b|\bmissing\s+scope\b/i;
const AUTH_SCOPE_NAME_RE = /\b(?:api\.responses\.write|model\.request)\b/i;
const AUTH_INVALID_TOKEN_HINT_RE = /\bunauthorized\b|\b(?:invalid|incorrect|expired|stale)[_\s-]?api[_\s-]?key\b|\b(?:invalid|incorrect|expired|stale)\s+(?:token|jwt|credential|api[_\s-]?key)\b|\b(?:token|jwt|credential|api[_\s-]?key)\s+(?:is\s+)?(?:invalid|incorrect|expired|stale)\b/i;
const HTML_BODY_RE = /^\s*(?:<!doctype\s+html\b|<html\b)/i;
const HTML_CLOSE_RE = /<\/html>/i;
const CLOUDFLARE_CHALLENGE_RE = /Enable\s+JavaScript\s+and\s+cookies\s+to\s+continue|cf-browser-verification|__cf_challenge|cdn-cgi\/challenge-platform|challenge-error-text/i;
const PROXY_ERROR_RE = /\bproxyconnect\b|\bhttps?_proxy\b|\b407\b|\bproxy authentication required\b|\btunnel connection failed\b|\bconnect tunnel\b|\bsocks proxy\b|\bproxy error\b/i;
const DNS_ERROR_RE = /\benotfound\b|\beai_again\b|\bgetaddrinfo\b|\bno such host\b|\bdns\b/i;
const INTERRUPTED_NETWORK_ERROR_RE = /\beconnrefused\b|\beconnreset\b|\beconnaborted\b|\benetreset\b|\behostunreach\b|\behostdown\b|\benetunreach\b|\bepipe\b|\bsocket hang up\b|\bconnection refused\b|\bconnection reset\b|\bconnection aborted\b|\bnetwork is unreachable\b|\bhost is unreachable\b|\bfetch failed\b|\bconnection error\b|\bnetwork request failed\b/i;
const SANDBOX_BLOCKED_RE = /\bapproval is required\b|\bapproval timed out\b|\bapproval was denied\b|\bblocked by sandbox\b|\bsandbox\b.*\b(?:blocked|denied|forbidden|disabled|not allowed)\b|\bexec denied\s*\(/i;
const OAUTH_REFRESH_TIMEOUT_RE = /\boauth refresh call\b.*\bexceeded hard timeout\b/i;
const OAUTH_CALLBACK_TIMEOUT_RE = /\bcallback_timeout\b/i;
const OAUTH_CALLBACK_VALIDATION_RE = /\bcallback_validation_failed\b/i;
function stripErrorPrefix(raw) {
	return raw.replace(/^error:\s*/i, "").trim();
}
function isHtmlErrorResponse(raw, status) {
	const trimmed = raw.trim();
	if (!trimmed) return false;
	const candidate = extractLeadingHttpStatus(trimmed) ? trimmed : stripErrorPrefix(trimmed);
	const inferred = typeof status === "number" && Number.isFinite(status) ? status : extractLeadingHttpStatus(candidate)?.code;
	if (typeof inferred !== "number" || inferred < 400) return false;
	const rest = extractHttpResponseBody(extractLeadingHttpStatus(candidate))?.body ?? candidate;
	return HTML_BODY_RE.test(rest) && HTML_CLOSE_RE.test(rest);
}
function isOpenAICodexScopeContext(raw, provider) {
	return normalizeLowercaseStringOrEmpty(provider) === "openai" || /\bopenai\s+codex\b/i.test(raw) || /\bcodex\b.*\bscopes?\b/i.test(raw);
}
function isAuthScopeErrorMessage(raw, status, provider) {
	if (!raw) return false;
	if (!isOpenAICodexScopeContext(raw, provider)) return false;
	const inferred = typeof status === "number" && Number.isFinite(status) ? status : extractLeadingHttpStatus(raw.trim())?.code;
	const hasScopeHint = AUTH_SCOPE_HINT_RE.test(raw);
	const hasKnownScopeName = AUTH_SCOPE_NAME_RE.test(raw);
	if (!hasScopeHint && !hasKnownScopeName) return false;
	if (typeof inferred !== "number") return hasScopeHint;
	if (inferred !== 401 && inferred !== 403) return false;
	return true;
}
function isProxyErrorMessage(raw, status) {
	if (!raw) return false;
	if (status === 407) return true;
	return PROXY_ERROR_RE.test(raw);
}
function isSandboxBlockedErrorMessage(raw) {
	return Boolean(formatExecDeniedUserMessage(raw)) || SANDBOX_BLOCKED_RE.test(raw);
}
function isSchemaErrorMessage(raw, opts) {
	if (!raw || isReplayInvalidErrorMessage(raw) || isContextOverflowErrorFromTables(raw)) return false;
	return classifyFailoverReason(raw, opts) === "format" || matchesFormatErrorPattern(raw);
}
function isTimeoutTransportErrorMessage(raw, status) {
	if (!raw) return false;
	if (isTimeoutErrorMessage(raw) || INTERRUPTED_NETWORK_ERROR_RE.test(raw)) return true;
	return typeof status === "number" && [
		408,
		499,
		500,
		502,
		503,
		504,
		521,
		522,
		523,
		524,
		529
	].includes(status);
}
function isOAuthRefreshContentionMessage(raw) {
	return /\brefresh_contention\b/i.test(raw) || /\bfile lock timeout\b/i.test(raw) && /(?:\/|\\|^)(?:oauth-refresh|openclaw-oauth-refresh)[^/\n\\]*?(?:\.lock)?\b/i.test(raw);
}
function classifyProviderRuntimeFailureKind(signal, opts) {
	const normalizedSignal = typeof signal === "string" ? { message: signal } : signal;
	if (classifyGatewayStorageFailure(normalizedSignal)) return "gateway_storage";
	const message = normalizedSignal.message?.trim() ?? "";
	const status = inferSignalStatus(normalizedSignal);
	const hasStructuredErrorSignal = Boolean(normalizedSignal.code || normalizedSignal.errorType);
	if (!message && typeof status !== "number" && !hasStructuredErrorSignal) return "empty_response";
	if (normalizedSignal.code === "refresh_contention") return "refresh_contention";
	if (message && isOAuthRefreshContentionMessage(message)) return "refresh_contention";
	if (message && OAUTH_REFRESH_TIMEOUT_RE.test(message)) return "refresh_timeout";
	if (message && OAUTH_CALLBACK_TIMEOUT_RE.test(message)) return "callback_timeout";
	if (message && OAUTH_CALLBACK_VALIDATION_RE.test(message)) return "callback_validation";
	if (message && classifyOAuthRefreshFailure(message)) return "auth_refresh";
	if (message && isAuthScopeErrorMessage(message, status, normalizedSignal.provider)) return "auth_scope";
	if (message && isProxyErrorMessage(message, status)) return "proxy";
	if (message && isHtmlErrorResponse(message, status)) {
		if (status === 403 && CLOUDFLARE_CHALLENGE_RE.test(message)) return "upstream_html";
		return status === 401 || status === 403 ? "auth_html" : "upstream_html";
	}
	const failoverClassification = classifyFailoverSignal({
		...normalizedSignal,
		status,
		message: message || void 0
	}, opts);
	const failoverReason = failoverClassification?.kind === "reason" ? failoverClassification.reason : void 0;
	switch (failoverReason) {
		case "tls_certificate":
		case "rate_limit":
		case "model_not_found": return failoverReason;
	}
	if (message && DNS_ERROR_RE.test(message)) return "dns";
	if (message && isSandboxBlockedErrorMessage(message)) return "sandbox_blocked";
	if (message && isReplayInvalidErrorMessage(message)) return "replay_invalid";
	if (message && isSchemaErrorMessage(message, {
		...opts,
		provider: normalizedSignal.provider
	})) return "schema";
	const messageMentions401 = /\b401\b/.test(message);
	const messageMentions403 = /\b403\b/.test(message);
	const has401Evidence = status === 401 || status === void 0 && messageMentions401 && !messageMentions403;
	const hasPermissionScopeSignal = AUTH_SCOPE_HINT_RE.test(message) || AUTH_SCOPE_NAME_RE.test(message);
	if (failoverReason === "auth" && has401Evidence && AUTH_INVALID_TOKEN_HINT_RE.test(message) && !hasPermissionScopeSignal) return "auth_invalid_token";
	if (failoverReason === "timeout" || failoverReason === "overloaded") return "timeout";
	if (message && isTimeoutTransportErrorMessage(message, status)) return "timeout";
	if (message && isExactUnknownNoDetailsError(message)) return "no_error_details";
	return "unclassified";
}
//#endregion
//#region src/agents/embedded-agent-helpers/error-text.ts
const log = createSubsystemLogger("errors");
const sandboxToolPolicyAuditMessages = /* @__PURE__ */ new WeakSet();
const GENERIC_ASSISTANT_ERROR_TEXT = "LLM request failed.";
const SYNTHESIZED_TIMEOUT_ERROR_TEXT = "LLM request timed out.";
const RUNTIME_FAILURE_COPY = {
	auth_refresh: "Couldn't sign in to the AI service. Sign in again under Models in the Control UI or run `openclaw configure`.",
	refresh_contention: "Another sign-in is still in progress. Wait a moment, then try again.",
	refresh_timeout: "Signing in took too long. Try again in a moment. If it keeps happening, sign in again under Models in the Control UI.",
	callback_timeout: "Sign-in wasn't completed. Try signing in again. If asked for a link, paste the full link from your browser.",
	callback_validation: "The sign-in link wasn't accepted. Try signing in again. If asked for a link, paste the full link from your browser.",
	auth_scope: "This login doesn't have the access OpenClaw needs. Sign in again under Models in the Control UI.",
	auth_html: "Couldn't sign in to the AI service. Sign in again under Models in the Control UI or run `openclaw configure`.",
	auth_invalid_token: AUTH_INVALID_TOKEN_USER_TEXT,
	upstream_html: "Couldn't reach the AI service. Try again in a moment. If it continues, open Settings → Logs in the Control UI or run `openclaw logs --follow`.",
	proxy: "Couldn't connect to the AI service. For details, open Settings → Logs in the Control UI or run `openclaw logs --follow`.",
	tls_certificate: "Couldn't connect securely to the AI service. For details, open Settings → Logs in the Control UI or run `openclaw logs --follow`.",
	model_not_found: "This model was not found. Choose another model in the Control UI."
};
const TOOL_CALL_INPUT_MISSING_RE = /tool_(?:use|call)\.(?:input|arguments).*?(?:field required|required)/i;
const TOOL_CALL_INPUT_PATH_RE = /messages\.\d+\.content\.\d+\.tool_(?:use|call)\.(?:input|arguments)/i;
function classifyAssistantErrorFacts(msg, opts) {
	const signal = buildAssistantFailoverSignal(msg, { provider: opts?.providerOwner?.id ?? opts?.provider });
	const providerPlugin = opts?.providerOwner ?? null;
	const classification = classifyFailoverSignal(signal, { providerPlugin });
	return {
		provider: opts?.provider ?? msg.provider ?? opts?.providerOwner?.id,
		model: opts?.model ?? msg.model,
		reason: failoverReasonFromClassification(classification),
		status: signal.status ?? extractErrorHttpStatus(signal.message ?? "")?.code,
		providerRuntimeFailureKind: classifyProviderRuntimeFailureKind(signal, { providerPlugin }),
		storageFailure: classifyGatewayStorageFailure(msg),
		code: signal.code
	};
}
function isMissingToolCallInputError(raw) {
	return Boolean(raw) && (TOOL_CALL_INPUT_MISSING_RE.test(raw) || TOOL_CALL_INPUT_PATH_RE.test(raw));
}
function formatAssistantErrorText(msg, opts, facts) {
	const raw = (msg.errorMessage ?? "").trim();
	if (msg.stopReason !== "error" && !raw) return;
	const providerRefusalText = formatProviderRefusalText(msg);
	if (providerRefusalText) return providerRefusalText;
	const formatCopy = renderFormatErrorCopy(raw);
	const classifiedFacts = facts ?? classifyAssistantErrorFacts(msg, opts);
	if (classifiedFacts.storageFailure) return renderAssistantRequestFailureCopy(classifiedFacts);
	const { reason: failoverReason, status: formatStatus, providerRuntimeFailureKind } = classifiedFacts;
	const unknownTool = raw.match(/unknown tool[:\s]+["']?([a-z0-9_-]+)["']?/i) ?? raw.match(/tool\s+["']?([a-z0-9_-]+)["']?\s+(?:not found|is not available)/i);
	if (unknownTool?.[1]) {
		const audit = !sandboxToolPolicyAuditMessages.has(msg);
		const rewritten = formatSandboxToolPolicyBlockedMessage({
			cfg: opts?.cfg,
			sessionKey: opts?.sessionKey,
			agentId: opts?.agentId,
			toolName: unknownTool[1],
			audit
		});
		if (rewritten) {
			if (audit) sandboxToolPolicyAuditMessages.add(msg);
			return rewritten;
		}
	}
	const diskSpaceCopy = formatDiskSpaceErrorCopy(raw);
	if (diskSpaceCopy) return diskSpaceCopy;
	const runtimeCopy = RUNTIME_FAILURE_COPY[providerRuntimeFailureKind];
	if (runtimeCopy) return runtimeCopy;
	if (failoverReason === "billing") return formatBillingErrorMessage(opts?.provider, opts?.model ?? msg.model, opts?.authMode);
	const transientCopy = failoverReason === "rate_limit" || failoverReason === "overloaded" ? renderRateLimitOrOverloadedCopy({
		reason: failoverReason,
		raw
	}) : void 0;
	if (transientCopy) return transientCopy;
	if ((formatStatus === 400 || formatStatus === 422) && formatCopy !== "The AI service couldn't accept this request. Try a new conversation with /new, or choose another model in the Control UI.") return formatCopy;
	if (failoverReason === "context_overflow") return "Context overflow: prompt too large for the model. Try /reset (or /new) to start a fresh session, or use a larger-context model.";
	if (isReasoningConstraintErrorMessage(raw)) return "Reasoning is required for this model endpoint. Use /think minimal (or any non-off level) and try again.";
	if (isInvalidStreamingEventOrderError(raw)) return "LLM request failed: provider returned an invalid streaming response. Please try again.";
	if (/incorrect role information|roles must alternate|400.*role|"message".*role.*information/i.test(raw)) return "Message ordering conflict - please try again. If this persists, use /new to start a fresh session.";
	if (isMissingToolCallInputError(raw)) return "Session history looks corrupted (tool call input missing). Use /new to start a fresh session. If this keeps happening, reset the session or delete the corrupted session transcript.";
	if (providerRuntimeFailureKind === "replay_invalid") return "Session history or replay state is invalid. Use /new to start a fresh session and try again.";
	const apiError = parseApiErrorInfo(raw);
	if (providerRuntimeFailureKind === "schema" && apiError?.type?.toLowerCase().includes("invalid_request") && apiError.message?.trim()) return `LLM request rejected: ${apiError.message.trim()}`;
	if (isGenericProviderInternalError(raw)) return formatRawAssistantErrorForUi(raw);
	const transportCopy = formatTransportErrorCopy(msg.errorCode && isKnownTransportErrorCode(msg.errorCode) ? `${raw} ${msg.errorCode}` : raw);
	if (transportCopy) return transportCopy;
	if (isProviderCompletedErrorFinishReasonMessage(raw)) return formatRawAssistantErrorForUi(raw);
	if (isTimeoutErrorMessage(raw) && !(facts?.status !== void 0 && facts.status >= 500)) return SYNTHESIZED_TIMEOUT_ERROR_TEXT;
	if (providerRuntimeFailureKind === "schema" || failoverReason === "format") return formatCopy;
	if (!raw) return failoverReason ? renderAssistantRequestFailureCopy(classifiedFacts) : "LLM request failed with an unknown error.";
	if (isRawApiErrorPayload(raw) || isLikelyHttpErrorText(raw)) return formatRawAssistantErrorForUi(raw);
	if (isStreamingJsonParseError(raw)) return "LLM streaming response contained a malformed fragment. Please try again.";
	if (raw.length > 600) log.warn(`Long error truncated: ${truncateUtf16Safe(raw, 200)}`);
	return raw.length > 600 ? `${truncateUtf16Safe(raw, 600)}…` : raw;
}
function isRawAssistantErrorPassthrough(params) {
	const friendlyError = params.friendlyError?.trim();
	const rawError = params.rawError?.trim();
	if (!friendlyError || !rawError) return false;
	const parsedMessage = parseApiErrorInfo(rawError)?.message?.trim();
	const leadingStatusRest = extractLeadingHttpStatus(rawError)?.rest?.trim();
	const hasRawDerivedProviderPrefix = friendlyError.startsWith("LLM request rejected:") || friendlyError.startsWith("LLM error") || friendlyError.startsWith("HTTP ");
	return friendlyError === rawError && friendlyError !== "LLM request timed out." || rawError.length > 600 && friendlyError === `${truncateUtf16Safe(rawError, 600)}…` || Boolean(parsedMessage && hasRawDerivedProviderPrefix) || Boolean(leadingStatusRest && friendlyError.startsWith("HTTP "));
}
function formatUserFacingAssistantErrorText(msg, opts) {
	const rawError = msg.errorMessage?.trim();
	const approvalMessage = resolveExecutionApprovalFailureMessage(rawError);
	if (approvalMessage) return `⚠️ ${approvalMessage}`;
	const facts = classifyAssistantErrorFacts(msg, opts);
	const friendlyError = formatAssistantErrorText(msg, opts, facts);
	const rawPassthrough = isRawAssistantErrorPassthrough({
		friendlyError,
		rawError
	});
	const schemaFriendlyError = friendlyError === "The AI service couldn't accept this request. Try a new conversation with /new, or choose another model in the Control UI." || friendlyError?.startsWith("LLM request rejected:");
	const safeFriendlyError = (schemaFriendlyError ? renderAssistantFormatFailureCopy(msg) : void 0) ?? (rawPassthrough ? schemaFriendlyError ? "The AI service couldn't accept this request. Try a new conversation with /new, or choose another model in the Control UI." : void 0 : friendlyError);
	if (safeFriendlyError) return safeFriendlyError.trim();
	return renderAssistantRequestFailureCopy(facts) ?? "LLM request failed.";
}
//#endregion
//#region src/agents/embedded-agent-helpers/openai.ts
/**
* Normalizes OpenAI Responses reasoning/tool-call history for safe replay.
*/
function hasOpenAIReasoningSignature(value) {
	if (!value) return false;
	let candidate = null;
	if (typeof value === "string") {
		const trimmed = value.trim();
		if (!trimmed.startsWith("{") || !trimmed.endsWith("}")) return false;
		try {
			candidate = JSON.parse(trimmed);
		} catch {
			return false;
		}
	} else if (typeof value === "object") candidate = value;
	if (!candidate) return false;
	const id = typeof candidate.id === "string" ? candidate.id : "";
	const type = typeof candidate.type === "string" ? candidate.type : "";
	return id.startsWith("rs_") && (type === "reasoning" || type.startsWith("reasoning."));
}
function isOpenAIToolCallType(type) {
	return type === "toolCall" || type === "toolUse" || type === "functionCall";
}
function createOpenAIResponsesToolCallIdResolver() {
	const rewrittenByOriginalId = /* @__PURE__ */ new Map();
	return (id) => {
		const rewritten = rewrittenByOriginalId.get(id);
		if (rewritten) return rewritten;
		if (!shouldNormalizeOpenAIResponsesToolCallId(id)) return id;
		const normalized = normalizeOpenAIResponsesFunctionCallId(id);
		rewrittenByOriginalId.set(id, normalized);
		return normalized;
	};
}
function rewriteReplayMessages(messages, rewrite) {
	let changed = false;
	const result = [];
	for (const message of messages) {
		const next = rewrite(message);
		changed ||= !Object.is(next, message);
		result.push(next);
	}
	return changed ? result : messages;
}
function rewriteAssistantContent(message, rewrite) {
	if (!Array.isArray(message.content)) return message;
	let changed = false;
	const content = message.content.map((block) => {
		const next = rewrite(block);
		changed ||= !Object.is(next, block);
		return next;
	});
	return changed ? replaceCompactionReplayOwnerContent(message, content) : message;
}
/**
* OpenAI Responses rejects replayed `function_call.call_id`,
* `function_call.id`, and matching `function_call_output.call_id` values
* that exceed its 64-char `call_*` / `fc_*` shape. pi-ai skips its own
* normalizer for same-model replay, then splits persisted `call_id|fc_id`
* pairs directly into the provider payload, so OpenClaw must normalize here.
*/
function normalizeOpenAIResponsesToolCallIds(messages) {
	const resolveId = createOpenAIResponsesToolCallIdResolver();
	return rewriteReplayMessages(messages, (msg) => {
		if (!msg || typeof msg !== "object") return msg;
		const role = msg.role;
		if (role === "assistant") return rewriteAssistantContent(msg, (block) => {
			if (!block || typeof block !== "object") return block;
			const toolCallBlock = block;
			if (!isOpenAIToolCallType(toolCallBlock.type) || typeof toolCallBlock.id !== "string") return block;
			const nextId = resolveId(toolCallBlock.id);
			if (nextId === toolCallBlock.id) return block;
			return {
				...block,
				id: nextId
			};
		});
		if (role === "toolResult") return rewriteToolResultIds({
			message: msg,
			resolveId
		});
		return msg;
	});
}
/**
* OpenAI can reject replayed `function_call` items with an `fc_*` id if the
* matching `reasoning` item is absent in the same assistant turn.
*
* When that pairing is missing, strip the `|fc_*` suffix from tool call ids so
* shared model runtime omits `function_call.id` on replay.
*/
function downgradeOpenAIFunctionCallReasoningPairs(messages) {
	let pendingRewrittenIds = null;
	return rewriteReplayMessages(messages, (msg) => {
		if (!msg || typeof msg !== "object") {
			pendingRewrittenIds = null;
			return msg;
		}
		const role = msg.role;
		if (role === "assistant") {
			const assistantMsg = msg;
			const localRewrittenIds = /* @__PURE__ */ new Map();
			let seenReplayableReasoning = false;
			const next = rewriteAssistantContent(assistantMsg, (block) => {
				if (!block || typeof block !== "object") return block;
				const thinkingBlock = block;
				if (thinkingBlock.type === "thinking" && hasOpenAIReasoningSignature(thinkingBlock.thinkingSignature)) {
					seenReplayableReasoning = true;
					return block;
				}
				const toolCallBlock = block;
				if (!isOpenAIToolCallType(toolCallBlock.type) || typeof toolCallBlock.id !== "string") return block;
				const pairing = splitOpenAIFunctionCallPairing(toolCallBlock.id);
				if (seenReplayableReasoning || !pairing.itemId || !pairing.itemId.startsWith("fc_")) return block;
				localRewrittenIds.set(toolCallBlock.id, pairing.callId);
				return {
					...block,
					id: pairing.callId
				};
			});
			pendingRewrittenIds = localRewrittenIds.size > 0 ? localRewrittenIds : null;
			return next;
		}
		if (role === "toolResult" && pendingRewrittenIds && pendingRewrittenIds.size > 0) {
			const toolResult = msg;
			const updates = {};
			for (const field of ["toolCallId", "toolUseId"]) {
				const id = toolResult[field];
				const nextId = typeof id === "string" ? pendingRewrittenIds.get(id) : void 0;
				if (nextId && nextId !== id) updates[field] = nextId;
			}
			return Object.keys(updates).length > 0 ? {
				...toolResult,
				...updates
			} : msg;
		}
		pendingRewrittenIds = null;
		return msg;
	});
}
/**
* Extracts the Responses `phase` (commentary/final_answer) from a v1 textSignature, if present.
* Used when dropping the paired msg_* id so phase metadata can be preserved independently.
*/
function extractTextSignaturePhase(signature) {
	if (!signature.startsWith("{")) return;
	try {
		const parsed = JSON.parse(signature);
		if (parsed.v === 1 && (parsed.phase === "commentary" || parsed.phase === "final_answer")) return parsed.phase;
	} catch {}
}
/**
* Drops reasoning from before a model route switch and clears paired message ids.
* The transport owns orphan detection after preparing the actual replay payload.
*/
function dropStaleOpenAIReasoning(messages, dropBefore) {
	if (dropBefore === void 0) return messages;
	let anyChanged = false;
	const out = [];
	for (const msg of messages) {
		if (!msg || typeof msg !== "object") {
			out.push(msg);
			continue;
		}
		if (msg.role !== "assistant") {
			out.push(msg);
			continue;
		}
		const assistantMsg = msg;
		if (!Array.isArray(assistantMsg.content)) {
			out.push(msg);
			continue;
		}
		const messageTimestamp = parseDateFirstTimestampMs(assistantMsg.timestamp);
		if (messageTimestamp !== void 0 && messageTimestamp > dropBefore) {
			out.push(msg);
			continue;
		}
		let changed = false;
		let droppedReplayableReasoning = false;
		const nextContent = [];
		for (const block of assistantMsg.content) {
			if (!block) {
				changed = true;
				continue;
			}
			const record = block;
			if (typeof block !== "object" || record.type !== "thinking" || !hasOpenAIReasoningSignature(record.thinkingSignature)) {
				nextContent.push(block);
				continue;
			}
			changed = true;
			droppedReplayableReasoning = true;
		}
		if (!changed) {
			out.push(msg);
			continue;
		}
		anyChanged = true;
		if (nextContent.length === 0) continue;
		const finalContent = droppedReplayableReasoning ? nextContent.map((contentBlock) => {
			if (!contentBlock || typeof contentBlock !== "object") return contentBlock;
			if (contentBlock.type !== "text" || contentBlock.textSignature === void 0) return contentBlock;
			const phase = extractTextSignaturePhase(contentBlock.textSignature);
			const { textSignature: _droppedTextSignature, ...rest } = contentBlock;
			return phase !== void 0 ? {
				...rest,
				textSignature: JSON.stringify({
					v: 1,
					phase
				})
			} : rest;
		}) : nextContent;
		out.push(replaceCompactionReplayOwnerContent(assistantMsg, finalContent));
	}
	return anyChanged ? out : messages;
}
//#endregion
//#region src/agents/embedded-agent-helpers/images.ts
/**
* Sanitizes historical embedded-agent message images and empty content blocks.
*/
const EMPTY_CONTENT_PLACEHOLDER = "[empty content omitted]";
function dropEmptyTextBlocks(content) {
	return content.filter((block) => {
		const rec = block;
		return !block || typeof block !== "object" || rec.type !== "text" || typeof rec.text !== "string" || rec.text.trim().length > 0;
	});
}
function ensureNonEmptyContent(content) {
	if (content.length > 0) return content;
	return [{
		type: "text",
		text: EMPTY_CONTENT_PLACEHOLDER
	}];
}
/** Resize/remove unsafe image payloads while keeping transcript turns valid. */
async function sanitizeSessionMessagesImages(messages, label, options) {
	const imageSanitization = {
		maxDimensionPx: options?.maxDimensionPx,
		maxBytes: options?.maxBytes,
		verifyDecodability: true
	};
	const sanitizedIds = options?.sanitizeToolCallIds === true ? sanitizeToolCallIdsForCloudCodeAssist(messages, options.toolCallIdMode, {
		preserveNativeAnthropicToolUseIds: options?.preserveNativeAnthropicToolUseIds,
		duplicateToolCallIdStyle: options?.duplicateToolCallIdStyle
	}) : messages;
	const out = [];
	for (const msg of sanitizedIds) {
		if (!msg || typeof msg !== "object") {
			out.push(msg);
			continue;
		}
		const role = msg.role;
		if (role === "toolResult" || role === "user") {
			const contentMsg = msg;
			const content = contentMsg.content;
			if (Array.isArray(content) || role === "toolResult") {
				const nextContent = await sanitizeContentBlocksImages(Array.isArray(content) ? content : [], label, imageSanitization);
				out.push({
					...contentMsg,
					content: ensureNonEmptyContent(dropEmptyTextBlocks(nextContent))
				});
				continue;
			}
		}
		if (role === "assistant") {
			const assistantMsg = msg;
			const content = assistantMsg.content;
			if (Array.isArray(content)) {
				const strippedContent = assistantMsg.stopReason === "error" || options?.preserveSignatures ? content : stripThoughtSignatures(content, options?.sanitizeThoughtSignatures);
				const finalContent = await sanitizeContentBlocksImages(dropEmptyTextBlocks(strippedContent), label, imageSanitization);
				if (finalContent.length > 0 || assistantMsg.providerReplay) out.push(replaceCompactionReplayOwnerContent(assistantMsg, finalContent));
				continue;
			}
		}
		out.push(msg);
	}
	return out;
}
//#endregion
//#region src/agents/embedded-agent-helpers/thinking.ts
/**
* Resolves fallback thinking levels for providers that require reasoning.
*/
function extractSupportedValues(raw) {
	const fragment = raw.match(/supported values(?: are)?:\s*([^\n.]+)/i)?.[1];
	if (!fragment) return [];
	const quoted = Array.from(fragment.matchAll(/['"]([^'"]+)['"]/g), ([, value]) => value);
	return normalizeStringEntries(quoted.length > 0 ? quoted : fragment.split(/,|\band\b/gi).map((entry) => entry.replace(/^[^a-zA-Z]+|[^a-zA-Z]+$/g, "")));
}
/** Pick a configured or provider-safe reasoning level for fallback attempts. */
function pickFallbackThinkingLevel(params) {
	const raw = params.message?.trim() ?? "";
	const requiresReasoning = isReasoningConstraintErrorMessage(raw);
	if (!requiresReasoning && !/(?<![\w./-])(?:think(?:ing)?(?:[._]|\s+)(?:value|level|budget)|reasoning(?:[._]|\s+)(?:effort|level|budget))(?![\w/-]|\.[\w/-])/i.test(raw)) return;
	if (requiresReasoning && !params.attempted.has("minimal")) return "minimal";
	const supported = extractSupportedValues(raw);
	if (supported.length === 0) return /not supported/i.test(raw) && !params.attempted.has("off") ? "off" : void 0;
	for (const entry of supported) {
		const normalized = normalizeThinkLevel(entry);
		if (normalized && !params.attempted.has(normalized)) return normalized;
	}
}
//#endregion
//#region src/agents/embedded-agent-helpers/turns.ts
/**
* Normalizes embedded-agent conversation turn ordering for provider contracts.
*/
const SIGNED_THINKING_PROVIDERS = /* @__PURE__ */ new Set([
	"anthropic",
	"amazon-bedrock",
	"anthropic-vertex"
]);
/** Return true when a provider family owns signed thinking blocks. */
function providerRequiresSignedThinking(provider) {
	return SIGNED_THINKING_PROVIDERS.has(normalizeProviderId(provider ?? ""));
}
/** Decide whether signed thinking can be replayed under the current provider policy. */
function shouldAllowProviderOwnedThinkingReplay(params) {
	const hasProviderOwnedSignedThinking = params.policy.preserveSignatures || providerRequiresSignedThinking(params.provider);
	return isAnthropicApi(params.modelApi) && params.policy.validateAnthropicTurns && hasProviderOwnedSignedThinking && !params.policy.dropThinkingBlocks;
}
/**
* Bedrock Converse still requires strict role alternation, so only the direct
* Messages API keeps consecutive user turns separate under append-only replay.
*/
function shouldMergeConsecutiveUserTurns(policy, modelApi) {
	return !(policy.appendOnlyRuntimeContext && modelApi === "anthropic-messages");
}
function isToolCallBlock(block) {
	return block.type === "toolUse" || block.type === "toolCall" || block.type === "functionCall";
}
function isAbortedAssistantTurn(message) {
	const stopReason = message.stopReason;
	return stopReason === "aborted" || stopReason === "error";
}
function extractToolResultMatchIds(record) {
	const ids = /* @__PURE__ */ new Set();
	for (const value of [
		Reflect.get(record, "toolUseId"),
		Reflect.get(record, "toolCallId"),
		Reflect.get(record, "tool_use_id"),
		Reflect.get(record, "tool_call_id"),
		Reflect.get(record, "callId"),
		Reflect.get(record, "call_id")
	]) {
		const id = normalizeOptionalString(value);
		if (id) ids.add(id);
	}
	return ids;
}
function collectFutureToolResults(messages, startIndex) {
	const ids = /* @__PURE__ */ new Set();
	const matches = /* @__PURE__ */ new Map();
	for (let index = startIndex + 1; index < messages.length; index += 1) {
		const candidate = messages[index];
		if (!candidate || typeof candidate !== "object") continue;
		const role = candidate.role;
		if (role === "assistant") break;
		const content = candidate.content;
		for (const block of Array.isArray(content) ? content : []) if (block && typeof block === "object" && (block.type === "toolResult" || block.type === "tool")) for (const id of extractToolResultMatchIds(block)) ids.add(id);
		if (role !== "toolResult" && role !== "tool") continue;
		const matchIds = extractToolResultMatchIds(candidate);
		if (role === "toolResult") {
			const canonicalId = extractToolResultId(candidate);
			if (canonicalId) ids.add(canonicalId);
		}
		const toolName = normalizeOptionalString(Reflect.get(candidate, "toolName")) ?? normalizeOptionalString(Reflect.get(candidate, "name"));
		for (const id of matchIds) {
			if (role === "tool") ids.add(id);
			const bucket = matches.get(id) ?? /* @__PURE__ */ new Set();
			if (toolName) bucket.add(toolName);
			matches.set(id, bucket);
		}
	}
	return {
		ids,
		matches
	};
}
/**
* Strips dangling tool-call blocks from assistant messages when no later
* tool-result span before the next assistant turn resolves them.
* This fixes the "tool_use ids found without tool_result blocks" error from Anthropic.
*/
function stripDanglingAnthropicToolUses(messages) {
	const result = [];
	for (const [i, msg] of messages.entries()) {
		if (!msg) continue;
		if (typeof msg !== "object") {
			result.push(msg);
			continue;
		}
		if (msg.role !== "assistant") {
			result.push(msg);
			continue;
		}
		const assistantMsg = msg;
		const originalContent = Array.isArray(assistantMsg.content) ? assistantMsg.content : [];
		if (originalContent.length === 0) {
			result.push(msg);
			continue;
		}
		if (extractToolCallsFromAssistant(msg).length === 0) {
			result.push(msg);
			continue;
		}
		const hasThinking = originalContent.some((block) => isThinkingLikeBlock(block));
		const { matches: validToolResultMatches, ids: validToolUseIds } = collectFutureToolResults(messages, i);
		const omittedContent = isAbortedAssistantTurn(msg) ? [] : [{
			type: "text",
			text: "[tool calls omitted]"
		}];
		if (hasThinking) {
			if (originalContent.every((block) => {
				if (!block || !isToolCallBlock(block)) return true;
				const blockId = normalizeOptionalString(block.id);
				const blockName = normalizeOptionalString(block.name);
				if (!blockId || !blockName) return false;
				const matchingToolNames = validToolResultMatches.get(blockId);
				if (!matchingToolNames) return false;
				return matchingToolNames.size === 0 || matchingToolNames.has(blockName);
			})) result.push(msg);
			else result.push({
				...assistantMsg,
				content: omittedContent
			});
			continue;
		}
		const filteredContent = originalContent.filter((block) => {
			if (!block) return false;
			if (!isToolCallBlock(block)) return true;
			const blockId = normalizeOptionalString(block.id);
			return blockId ? validToolUseIds.has(blockId) : false;
		});
		if (filteredContent.length === originalContent.length) {
			result.push(msg);
			continue;
		}
		result.push({
			...assistantMsg,
			content: filteredContent.length === 0 ? omittedContent : filteredContent
		});
	}
	return result;
}
function validateTurnsWithConsecutiveMerge(params) {
	const { messages, role, merge } = params;
	if (!Array.isArray(messages) || messages.length === 0) return messages;
	const result = [];
	let lastRole;
	for (const msg of messages) {
		if (!msg || typeof msg !== "object") {
			result.push(msg);
			continue;
		}
		const msgRole = msg.role;
		if (!msgRole) {
			result.push(msg);
			continue;
		}
		if (msgRole === lastRole && lastRole === role) {
			const lastMsg = result[result.length - 1];
			const currentMsg = msg;
			if (lastMsg && typeof lastMsg === "object") {
				const lastTyped = lastMsg;
				result[result.length - 1] = merge(lastTyped, currentMsg);
				continue;
			}
		}
		result.push(msg);
		lastRole = msgRole;
	}
	return result.length === messages.length ? messages : result;
}
function mergeConsecutiveAssistantTurns(previous, current) {
	const mergedContent = [...Array.isArray(previous.content) ? previous.content : [], ...Array.isArray(current.content) ? current.content : []];
	return {
		...previous,
		content: mergedContent,
		...current.usage && { usage: current.usage },
		...current.stopReason && { stopReason: current.stopReason },
		...current.errorMessage && { errorMessage: current.errorMessage }
	};
}
/**
* Validates and fixes conversation turn sequences for Gemini API.
* Gemini requires strict alternating user→assistant→tool→user pattern.
* Merges consecutive assistant messages together.
*/
function validateGeminiTurns(messages) {
	return validateTurnsWithConsecutiveMerge({
		messages,
		role: "assistant",
		merge: mergeConsecutiveAssistantTurns
	});
}
/** Merge adjacent user turns into a single provider-compatible user message. */
function mergeConsecutiveUserTurns(previous, current) {
	const mergedContent = [...normalizeUserContentForMerge(previous.content), ...normalizeUserContentForMerge(current.content)];
	return {
		...current,
		content: mergedContent,
		timestamp: current.timestamp ?? previous.timestamp
	};
}
function normalizeUserContentForMerge(content) {
	if (Array.isArray(content)) return content;
	if (typeof content === "string") return [{
		type: "text",
		text: content
	}];
	return [];
}
const mergeConsecutiveUserMessages = (messages) => validateTurnsWithConsecutiveMerge({
	messages,
	role: "user",
	merge: mergeConsecutiveUserTurns
});
/**
* Validates and fixes conversation turn sequences for Anthropic API.
* Anthropic requires strict alternating user→assistant pattern.
* Merges consecutive user messages together.
* Also strips dangling tool_use blocks that lack corresponding tool_result blocks.
*/
function validateAnthropicTurns(messages, options = {}) {
	const stripped = stripDanglingAnthropicToolUses(validateTurnsWithConsecutiveMerge({
		messages,
		role: "assistant",
		merge: mergeConsecutiveAssistantTurns
	}));
	if (options.mergeConsecutiveUserTurns === false) return stripped;
	return mergeConsecutiveUserMessages(stripped);
}
//#endregion
export { extractObservedOverflowTokenCount as _, validateAnthropicTurns as a, sanitizeSessionMessagesImages as c, normalizeOpenAIResponsesToolCallIds as d, GENERIC_ASSISTANT_ERROR_TEXT as f, classifyProviderRuntimeFailureKind as g, formatUserFacingAssistantErrorText as h, shouldMergeConsecutiveUserTurns as i, downgradeOpenAIFunctionCallReasoningPairs as l, formatAssistantErrorText as m, providerRequiresSignedThinking as n, validateGeminiTurns as o, SYNTHESIZED_TIMEOUT_ERROR_TEXT as p, shouldAllowProviderOwnedThinkingReplay as r, pickFallbackThinkingLevel as s, mergeConsecutiveUserMessages as t, dropStaleOpenAIReasoning as u, isCompactionFailureError as v };
