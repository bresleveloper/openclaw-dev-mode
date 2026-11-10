import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { v as parseDateFirstTimestampMs } from "./number-coercion-CkhMiRw8.mjs";
import { d as normalizeStringEntries } from "./string-normalization-D6DKCpwE.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { C as isGenericProviderInternalError, D as extractHttpResponseBody, T as parseApiErrorInfo, _ as extractLeadingHttpStatus, b as formatRawAssistantErrorForUi, g as extractErrorHttpStatus, m as CONTEXT_OVERFLOW_ERROR_MESSAGE, w as isKnownTransportErrorCode, x as formatTransportErrorCopy, y as formatProviderRefusalText } from "./redact-BcXJu5HP.mjs";
import { t as createSubsystemLogger } from "./subsystem-mStysHHC.mjs";
import { r as normalizeProviderId } from "./provider-id-D1VImdKk.mjs";
import { t as classifyGatewayStorageFailure } from "./sqlite-error-diagnostics-BBfTUJBR.mjs";
import { o as extractToolCallsFromAssistant, s as extractToolResultId } from "./tool-result-pairing-B20tITEh.mjs";
import { l as normalizeThinkLevel } from "./thinking.shared-Be8dhC75.mjs";
import { _ as matchesFormatErrorPattern, g as isUnsupportedReasoningEffortParameterError, h as isTimeoutErrorMessage, u as isProviderCompletedErrorFinishReasonMessage, v as resolveExecutionApprovalFailureMessage } from "./message-patterns-DSkmGYcR.mjs";
import { D as formatExecDeniedUserMessage, a as formatBillingErrorMessage, b as renderRateLimitOrOverloadedCopy, c as isInvalidStreamingEventOrderError, d as isStreamingJsonParseError, l as isLikelyHttpErrorText, o as formatDiskSpaceErrorCopy, t as AUTH_INVALID_TOKEN_USER_TEXT, u as isRawApiErrorPayload } from "./user-copy-BAz4s3EV.mjs";
import { n as isContextOverflowErrorFromTables, r as isReasoningConstraintErrorMessage } from "./context-overflow-tables-Cn71vUg0.mjs";
import { o as classifyOAuthRefreshFailure } from "./oauth-refresh-failure-H1_-S915.mjs";
import { a as failoverReasonFromClassification, c as isExactUnknownNoDetailsError, o as inferSignalStatus, u as isReplayInvalidErrorMessage } from "./classification-rules-CaFCPBKV.mjs";
import { a as renderAssistantRequestFailureCopy, i as renderAssistantFormatFailureCopy, o as renderFormatErrorCopy, s as renderModelLoadFailureCopy } from "./assistant-request-failure-copy-csnSONXK.mjs";
import "./thinking-BCNoGfZ5.mjs";
import { t as formatSandboxToolPolicyBlockedMessage } from "./runtime-status-DWm-5zUj.mjs";
import { n as classifyFailoverSignal, t as classifyFailoverReason } from "./classify-PIr_bdgF.mjs";
import "./context-overflow-observation-BkrW1kAi.mjs";
import { t as sanitizeContentBlocksImages } from "./tool-images-dsyNDL1H.mjs";
import { n as REPEATED_TOOL_ERROR_MESSAGE } from "./errors-CaC34RQp.mjs";
import { o as stripThoughtSignatures } from "./bootstrap-DLZ2qr_T.mjs";
import { t as buildAssistantFailoverSignal } from "./assistant-message-failures-LYMR8J6z.mjs";
import { t as isAnthropicApi } from "./anthropic-api-By56RmAj.mjs";
import { i as isThinkingLikeBlock, n as rewriteToolResultIds, r as sanitizeToolCallIdsForCloudCodeAssist } from "./tool-call-id-Cp_h0s17.mjs";
import { normalizeOpenAIResponsesFunctionCallId, replaceCompactionReplayOwnerContent, shouldNormalizeOpenAIResponsesToolCallId } from "@openclaw/ai/transports";
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
const OAUTH_FAILURE_PATTERNS = [
	[/\boauth refresh call\b.*\bexceeded hard timeout\b/i, "refresh_timeout"],
	[/\bcallback_timeout\b/i, "callback_timeout"],
	[/\bcallback_validation_failed\b/i, "callback_validation"]
];
function isHtmlErrorResponse(raw, status) {
	if (status === void 0 || status < 400) return false;
	const candidate = extractLeadingHttpStatus(raw) ? raw : raw.replace(/^error:\s*/i, "").trim();
	const rest = extractHttpResponseBody(extractLeadingHttpStatus(candidate))?.body ?? candidate;
	return HTML_BODY_RE.test(rest) && HTML_CLOSE_RE.test(rest);
}
function isOpenAICodexScopeContext(raw, provider) {
	return normalizeLowercaseStringOrEmpty(provider) === "openai" || /\bopenai\s+codex\b/i.test(raw) || /\bcodex\b.*\bscopes?\b/i.test(raw);
}
function isAuthScopeErrorMessage(raw, status, provider) {
	if (!isOpenAICodexScopeContext(raw, provider)) return false;
	const hasScopeHint = AUTH_SCOPE_HINT_RE.test(raw);
	const hasKnownScopeName = AUTH_SCOPE_NAME_RE.test(raw);
	if (!hasScopeHint && !hasKnownScopeName) return false;
	return status === void 0 ? hasScopeHint : status === 401 || status === 403;
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
	if (normalizedSignal.code === "refresh_contention" || message && isOAuthRefreshContentionMessage(message)) return "refresh_contention";
	for (const [pattern, kind] of OAUTH_FAILURE_PATTERNS) if (message && pattern.test(message)) return kind;
	if (message && classifyOAuthRefreshFailure(message)) return "auth_refresh";
	if (message && isAuthScopeErrorMessage(message, status, normalizedSignal.provider)) return "auth_scope";
	if (message && (status === 407 || PROXY_ERROR_RE.test(message))) return "proxy";
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
	if (message && (formatExecDeniedUserMessage(message) || SANDBOX_BLOCKED_RE.test(message))) return "sandbox_blocked";
	if (message && isReplayInvalidErrorMessage(message)) return "replay_invalid";
	const schemaOptions = message ? {
		...opts,
		provider: normalizedSignal.provider
	} : void 0;
	if (message && !isContextOverflowErrorFromTables(message) && (classifyFailoverReason(message, schemaOptions) === "format" || matchesFormatErrorPattern(message))) return "schema";
	const messageMentions401 = /\b401\b/.test(message);
	const messageMentions403 = /\b403\b/.test(message);
	const has401Evidence = status === 401 || status === void 0 && messageMentions401 && !messageMentions403;
	const hasPermissionScopeSignal = AUTH_SCOPE_HINT_RE.test(message) || AUTH_SCOPE_NAME_RE.test(message);
	if (failoverReason === "auth" && has401Evidence && AUTH_INVALID_TOKEN_HINT_RE.test(message) && !hasPermissionScopeSignal) return "auth_invalid_token";
	if (failoverReason === "timeout" || failoverReason === "overloaded") return "timeout";
	if (message && (isTimeoutErrorMessage(message) || INTERRUPTED_NETWORK_ERROR_RE.test(message) || status !== void 0 && [
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
	].includes(status))) return "timeout";
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
function formatAssistantErrorText(msg, opts, facts) {
	const raw = (msg.errorMessage ?? "").trim();
	if (msg.stopReason !== "error" && !raw) return;
	const providerRefusalText = formatProviderRefusalText(msg);
	if (providerRefusalText) return providerRefusalText;
	const formatCopy = renderFormatErrorCopy(raw);
	const classifiedFacts = facts ?? classifyAssistantErrorFacts(msg, opts);
	if (classifiedFacts.storageFailure) return renderAssistantRequestFailureCopy(classifiedFacts);
	const { reason: failoverReason, status: formatStatus, providerRuntimeFailureKind } = classifiedFacts;
	if (formatStatus === 403 && (msg.errorType ?? parseApiErrorInfo(raw)?.type) === "FreeTierError") return "This model's free tier is limited to the provider's own client. Choose another model or use a paid plan.";
	const unknownTool = raw.match(/unknown tool[:\s]+["']?([a-z0-9_-]+)["']?/i) ?? raw.match(/tool\s+["']?([a-z0-9_-]+)["']?\s+(?:not found|is not available)/i);
	if (unknownTool?.[1] && opts?.sandboxRuntime) {
		const audit = !sandboxToolPolicyAuditMessages.has(msg);
		const rewritten = formatSandboxToolPolicyBlockedMessage({
			cfg: opts?.cfg,
			sessionKey: opts?.sessionKey,
			agentId: opts?.agentId,
			toolName: unknownTool[1],
			preparedRuntimeStatus: opts.sandboxRuntime,
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
	if ((formatStatus === 400 || formatStatus === 422) && formatCopy !== "The AI service couldn't accept this request. Try a new conversation with /new, or choose another model in the Control UI." && !formatCopy.startsWith("LLM request rejected:")) return formatCopy;
	if (failoverReason === "context_overflow") return CONTEXT_OVERFLOW_ERROR_MESSAGE;
	if (isReasoningConstraintErrorMessage(raw)) return "Reasoning is required for this model endpoint. Use /think minimal (or any non-off level) and try again.";
	if (isInvalidStreamingEventOrderError(raw)) return "LLM request failed: provider returned an invalid streaming response. Please try again.";
	if (/incorrect role information|roles must alternate|400.*role|"message".*role.*information/i.test(raw)) return "Message ordering conflict - please try again. If this persists, use /new to start a fresh session.";
	if (raw && (TOOL_CALL_INPUT_MISSING_RE.test(raw) || TOOL_CALL_INPUT_PATH_RE.test(raw))) return "Session history looks corrupted (tool call input missing). Use /new to start a fresh session. If this keeps happening, reset the session or delete the corrupted session transcript.";
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
	if (msg.errorCode === "openclaw_repeated_tool_error") return REPEATED_TOOL_ERROR_MESSAGE;
	const modelLoadCopy = renderModelLoadFailureCopy(msg);
	if (modelLoadCopy) return modelLoadCopy;
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
	const safeFriendlyError = (schemaFriendlyError ? renderAssistantFormatFailureCopy(msg, facts.reason) : void 0) ?? (rawPassthrough ? schemaFriendlyError ? "The AI service couldn't accept this request. Try a new conversation with /new, or choose another model in the Control UI." : void 0 : friendlyError);
	if (safeFriendlyError) return safeFriendlyError.trim();
	return renderAssistantRequestFailureCopy(facts) ?? "LLM request failed.";
}
//#endregion
//#region src/agents/embedded-agent-helpers/openai.ts
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
const DROP_REPLAY_MESSAGE = Symbol("dropReplayMessage");
function rewriteReplayMessages(messages, rewrite) {
	let changed = false;
	const result = [];
	for (const message of messages) {
		const next = rewrite(message);
		changed ||= !Object.is(next, message);
		if (next !== DROP_REPLAY_MESSAGE) result.push(next);
	}
	return changed ? result : messages;
}
function rewriteAssistantContent(message, rewrite) {
	if (!Array.isArray(message.content)) return message;
	let changed = false;
	const content = message.content.map((block) => {
		const next = block && typeof block === "object" ? rewrite(block) : block;
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
	const rewrittenByOriginalId = /* @__PURE__ */ new Map();
	const resolveId = (id) => {
		const rewritten = rewrittenByOriginalId.get(id);
		if (rewritten) return rewritten;
		if (!shouldNormalizeOpenAIResponsesToolCallId(id)) return id;
		const normalized = normalizeOpenAIResponsesFunctionCallId(id);
		rewrittenByOriginalId.set(id, normalized);
		return normalized;
	};
	return rewriteReplayMessages(messages, (msg) => {
		if (!msg || typeof msg !== "object") return msg;
		const role = msg.role;
		if (role === "assistant") return rewriteAssistantContent(msg, (block) => {
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
	return rewriteReplayMessages(messages, (msg) => {
		if (!msg || typeof msg !== "object") return msg;
		if (msg.role !== "assistant") return msg;
		const assistantMsg = msg;
		if (!Array.isArray(assistantMsg.content)) return msg;
		const messageTimestamp = parseDateFirstTimestampMs(assistantMsg.timestamp);
		if (messageTimestamp !== void 0 && messageTimestamp > dropBefore) return msg;
		let droppedReplayableReasoning = false;
		const nextContent = assistantMsg.content.filter((block) => {
			if (!block) return false;
			const record = block;
			if (typeof block !== "object" || record.type !== "thinking" || !hasOpenAIReasoningSignature(record.thinkingSignature)) return true;
			droppedReplayableReasoning = true;
			return false;
		});
		if (nextContent.length === assistantMsg.content.length) return msg;
		if (nextContent.length === 0) return DROP_REPLAY_MESSAGE;
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
		return replaceCompactionReplayOwnerContent(assistantMsg, finalContent);
	});
}
//#endregion
//#region src/agents/embedded-agent-helpers/images.ts
const EMPTY_CONTENT_PLACEHOLDER = "[empty content omitted]";
function dropEmptyTextBlocks(content, preserveSignedText = false) {
	return content.filter((block) => {
		const rec = block;
		return !block || typeof block !== "object" || rec.type !== "text" || typeof rec.text !== "string" || rec.text.trim().length > 0 || preserveSignedText && typeof rec.textSignature === "string" && rec.textSignature.length > 0;
	});
}
async function sanitizeSessionMessagesImages(messages, label, options) {
	const imageSanitization = {
		maxDimensionPx: options?.maxDimensionPx,
		maxBytes: options?.maxBytes,
		verifyDecodability: true
	};
	const sanitizeImages = (content) => sanitizeContentBlocksImages(content, label, imageSanitization);
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
				const nextContent = dropEmptyTextBlocks(await sanitizeImages(Array.isArray(content) ? content : []));
				out.push({
					...contentMsg,
					content: nextContent.length ? nextContent : [{
						type: "text",
						text: EMPTY_CONTENT_PLACEHOLDER
					}]
				});
				continue;
			}
		}
		if (role === "assistant") {
			const assistantMsg = msg;
			const content = assistantMsg.content;
			if (Array.isArray(content)) {
				const finalContent = await sanitizeImages(dropEmptyTextBlocks(assistantMsg.stopReason === "error" || options?.preserveSignatures ? content : stripThoughtSignatures(content, options?.sanitizeThoughtSignatures), true));
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
function pickFallbackThinkingLevel(params) {
	const raw = params.message?.trim() ?? "";
	if (isUnsupportedReasoningEffortParameterError(raw)) return;
	const requiresReasoning = isReasoningConstraintErrorMessage(raw);
	if (!requiresReasoning && !/(?<![\w./-])(?:think(?:ing)?(?:[._]|\s+)(?:value|level|budget)|reasoning(?:[._]|\s+)(?:effort|level|budget))(?![\w/-]|\.[\w/-])/i.test(raw)) return;
	if (requiresReasoning && !params.attempted.has("minimal")) return "minimal";
	const fragment = raw.match(/supported values(?: are)?:\s*([^\n.]+)/i)?.[1] ?? "";
	const quoted = Array.from(fragment.matchAll(/['"]([^'"]+)['"]/g), ([, value]) => value);
	const supported = normalizeStringEntries(quoted.length > 0 ? quoted : fragment.split(/,|\band\b/gi).map((entry) => entry.replace(/^[^a-zA-Z]+|[^a-zA-Z]+$/g, "")));
	if (supported.length === 0) return /not supported/i.test(raw) && !params.attempted.has("off") ? "off" : void 0;
	for (const entry of supported) {
		const normalized = normalizeThinkLevel(entry);
		if (normalized && !params.attempted.has(normalized)) return normalized;
	}
}
//#endregion
//#region src/agents/embedded-agent-helpers/turns.ts
const SIGNED_THINKING_PROVIDERS = /* @__PURE__ */ new Set([
	"anthropic",
	"amazon-bedrock",
	"anthropic-vertex"
]);
function providerRequiresSignedThinking(provider) {
	return SIGNED_THINKING_PROVIDERS.has(normalizeProviderId(provider ?? ""));
}
function shouldAllowProviderOwnedThinkingReplay(params) {
	const hasProviderOwnedSignedThinking = params.policy.preserveSignatures || providerRequiresSignedThinking(params.provider);
	return isAnthropicApi(params.modelApi) && params.policy.validateAnthropicTurns && hasProviderOwnedSignedThinking && !params.policy.dropThinkingBlocks;
}
/**
* Bedrock Converse still requires strict role alternation, so only the direct
* Messages API keeps consecutive turns separate under append-only replay.
*/
function shouldMergeConsecutiveTurns(policy, modelApi) {
	return !(policy.appendOnlyRuntimeContext && modelApi === "anthropic-messages");
}
function isToolCallBlock(block) {
	return block.type === "toolUse" || block.type === "toolCall" || block.type === "functionCall";
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
		if (candidate.role === "assistant" && extractToolCallsFromAssistant(candidate).length > 0) break;
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
		if (typeof msg !== "object" || msg.role !== "assistant") {
			result.push(msg);
			continue;
		}
		const assistantMsg = msg;
		const originalContent = Array.isArray(assistantMsg.content) ? assistantMsg.content : [];
		if (originalContent.length === 0 || extractToolCallsFromAssistant(msg).length === 0) {
			result.push(msg);
			continue;
		}
		const hasThinking = originalContent.some((block) => isThinkingLikeBlock(block));
		const { matches: validToolResultMatches, ids: validToolUseIds } = collectFutureToolResults(messages, i);
		const stopReason = msg.stopReason;
		const omittedContent = stopReason === "aborted" || stopReason === "error" ? [] : [{
			type: "text",
			text: "[tool calls omitted]"
		}];
		let nextContent = originalContent;
		if (hasThinking) {
			if (!originalContent.every((block) => {
				if (!block || !isToolCallBlock(block)) return true;
				const blockId = normalizeOptionalString(block.id);
				const blockName = normalizeOptionalString(block.name);
				if (!blockId || !blockName) return false;
				const matchingToolNames = validToolResultMatches.get(blockId);
				if (!matchingToolNames) return false;
				return matchingToolNames.size === 0 || matchingToolNames.has(blockName);
			})) nextContent = omittedContent;
		} else {
			const filteredContent = originalContent.filter((block) => {
				if (!block) return false;
				if (!isToolCallBlock(block)) return true;
				const blockId = normalizeOptionalString(block.id);
				return blockId ? validToolUseIds.has(blockId) : false;
			});
			if (filteredContent.length !== originalContent.length) nextContent = filteredContent.length === 0 ? omittedContent : filteredContent;
		}
		result.push(nextContent === originalContent ? msg : {
			...assistantMsg,
			content: nextContent
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
		const msgRole = msg && typeof msg === "object" ? msg.role : void 0;
		if (msgRole) {
			if (msgRole === lastRole && lastRole === role) {
				const lastMsg = result[result.length - 1];
				const currentMsg = msg;
				if (lastMsg && typeof lastMsg === "object") {
					const lastTyped = lastMsg;
					result[result.length - 1] = merge(lastTyped, currentMsg);
					continue;
				}
			}
			lastRole = msgRole;
		}
		result.push(msg);
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
/** Merge consecutive assistant turns for Gemini's provider turn-order contract. */
function validateGeminiTurns(messages) {
	return validateTurnsWithConsecutiveMerge({
		messages,
		role: "assistant",
		merge: mergeConsecutiveAssistantTurns
	});
}
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
* Repair Anthropic tool-use/result pairing; turn merging stays optional
* because prefix-bound signed replay must preserve the original turn bytes.
*/
function validateAnthropicTurns(messages, options = {}) {
	if (options.mergeConsecutiveTurns === false) return stripDanglingAnthropicToolUses(messages);
	const mergedAssistant = validateTurnsWithConsecutiveMerge({
		messages,
		role: "assistant",
		merge: mergeConsecutiveAssistantTurns
	});
	return mergeConsecutiveUserMessages(stripDanglingAnthropicToolUses(mergedAssistant));
}
//#endregion
export { validateAnthropicTurns as a, sanitizeSessionMessagesImages as c, GENERIC_ASSISTANT_ERROR_TEXT as d, SYNTHESIZED_TIMEOUT_ERROR_TEXT as f, classifyProviderRuntimeFailureKind as h, shouldMergeConsecutiveTurns as i, dropStaleOpenAIReasoning as l, formatUserFacingAssistantErrorText as m, providerRequiresSignedThinking as n, validateGeminiTurns as o, formatAssistantErrorText as p, shouldAllowProviderOwnedThinkingReplay as r, pickFallbackThinkingLevel as s, mergeConsecutiveUserMessages as t, normalizeOpenAIResponsesToolCallIds as u };
