import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { c as readErrorCauses, r as collectErrorGraphCandidates } from "./error-coercion-BwMr25F8.mjs";
import "./src-Djeo9OvP.mjs";
import { t as expectDefined } from "./expect-lbe3Hgrh.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { v as resolveExecutionApprovalFailureMessage } from "./message-patterns-DSkmGYcR.mjs";
import { o as isFailoverError } from "./error-Bcp4ZyOv.mjs";
import { C as markReplyPayloadForSourceSuppressionDelivery, D as setReplyPayloadMetadata, c as getReplyPayloadMetadata, o as copyReplyPayloadMetadata, y as isReplyPayloadTerminalContent } from "./reply-payload-BLX_BF2U.mjs";
import { n as SILENT_REPLY_TOKEN, o as isSilentReplyText } from "./tokens-DHFPcfdZ.mjs";
import { i as sanitizeUserFacingText, n as renderUserFacingText, t as renderAgentHarnessPreflightUserMessage } from "./user-facing-text-BNFEPbYx.mjs";
import { _ as renderFailoverCodeUserCopy, b as renderRateLimitOrOverloadedCopy, f as renderAuthProfileFailoverCopy, h as renderCodexAppServerFailureCopy, m as renderCliTimeoutReplyCopy, n as GENERIC_EXTERNAL_RUN_FAILURE_TEXT, p as renderBillingReplyCopy, r as HEARTBEAT_EXTERNAL_RUN_FAILURE_TEXT, v as renderHeartbeatRunFailureCopy, x as renderRateLimitReplyCopy, y as renderMissingApiKeyReplyCopy } from "./user-copy-BAz4s3EV.mjs";
import { a as buildOAuthRefreshFailureLoginCommand, l as formatOAuthRefreshFailureLoginCommandMarkdown, o as classifyOAuthRefreshFailure, s as classifyOAuthRefreshFailureError } from "./oauth-refresh-failure-H1_-S915.mjs";
import { a as renderAssistantRequestFailureCopy, l as renderRuntimeCoordinationFailureCopy } from "./assistant-request-failure-copy-csnSONXK.mjs";
import { a as isAgentHarnessPreflightError } from "./errors-BAipjK5G.mjs";
import { k as isProviderAuthError } from "./model-auth-provider-config-C_EL9CxV.mjs";
import { a as findCliTerminalStopError, d as isNonProviderRuntimeCoordinationError, o as findCliTimeoutError, s as hasLocalWorkerTaskTimeout } from "./failover-error-Bjf0VdY2.mjs";
import { r as classifyCompactionReason } from "./compact-reasons-DEvuk_7a.mjs";
import { t as resolveReplyFailoverFacts } from "./request-error-facts-5Q588zTF.mjs";
import { t as buildProviderAuthRecoveryHint } from "./provider-auth-recovery-hint-CobbpYma.mjs";
import { t as SkillResourceDeliveryLimitError } from "./resource-delivery-error-CFKvWByr.mjs";
import { t as buildProviderLoginRecovery } from "./provider-login-recovery-DpeT8C8O.mjs";
//#region src/auto-reply/reply/agent-runner-failure-reply.ts
function readFallbackAttempts(error) {
	return isFailoverError(error) && Array.isArray(error.attempts) ? error.attempts : [];
}
function resolveReplyFailureSummary(params) {
	const attempts = params.attempts;
	let kind = params.reason;
	if (attempts?.length) {
		if (attempts.some((attempt) => attempt.reason === "billing")) kind = "billing";
		else if (attempts.every((attempt) => attempt.reason === "overloaded")) kind = "overloaded";
		else kind = attempts.every((attempt) => attempt.reason === "rate_limit" || attempt.reason === "overloaded") ? "rate_limit" : void 0;
	}
	if (kind !== "billing" && kind !== "rate_limit" && kind !== "overloaded") return;
	const failoverError = isFailoverError(params.error) ? params.error : void 0;
	const text = kind === "billing" ? renderBillingReplyCopy({
		attempts,
		provider: failoverError?.provider,
		model: failoverError?.model,
		authMode: failoverError?.authMode
	}) : kind === "overloaded" ? renderRateLimitOrOverloadedCopy({
		reason: kind,
		raw: params.message
	}) : renderRateLimitReplyCopy({
		message: params.message,
		reason: params.reason,
		attempts,
		provider: failoverError?.provider,
		rateLimitRetriesExhausted: failoverError?.rateLimitRetriesExhausted,
		cooldownExpiry: failoverError?.soonestCooldownExpiry,
		sanitizeText: (rawText) => sanitizeUserFacingText(rawText, { errorContext: true })
	});
	return {
		kind,
		text
	};
}
function collapseRepeatedFailureDetail(message) {
	const parts = message.split(/\s+\|\s+/u).map((part) => part.trim()).filter(Boolean);
	if (parts.length >= 2 && parts.every((part) => part === parts[0])) return expectDefined(parts[0], "parts entry at 0");
	return message.trim();
}
const EXTERNAL_RUN_FAILURE_DETAIL_MAX_CHARS = 900;
const PREFLIGHT_COMPACTION_FAILURE_PREFIX = "Preflight compaction required but failed:";
function isNonDirectConversationContext(ctx) {
	const chatType = normalizeLowercaseStringOrEmpty(ctx.ChatType);
	return chatType === "group" || chatType === "channel";
}
function isVerboseFailureDetailEnabled(level) {
	return level === "on" || level === "full";
}
function buildPreflightCompactionFailureText(message, options) {
	const normalizedMessage = collapseRepeatedFailureDetail(message);
	if (!normalizedMessage.startsWith(PREFLIGHT_COMPACTION_FAILURE_PREFIX)) return null;
	const reason = renderUserFacingText(normalizedMessage.slice(41), { errorContext: true }).trim().replace(/\s+/gu, " ");
	const isTimeout = classifyCompactionReason(reason) === "timeout";
	const reasonSuffix = options?.includeDetails && reason && !isTimeout ? ` Reason: ${reason}.` : "";
	return `${isTimeout ? "⚠️ This conversation is too long, and shortening it took too long." : "⚠️ This conversation is too long, and OpenClaw couldn't shorten it."}${reasonSuffix} Try again, use /compact, or use /new to start a fresh session.`;
}
function buildAuthProfileFailoverFailureText(error) {
	if (!isFailoverError(error) || !error.provider || !error.authProfileFailure) return null;
	return renderAuthProfileFailoverCopy({
		reason: error.reason,
		provider: error.provider,
		allInCooldown: error.authProfileFailure.allInCooldown,
		recoveryHint: buildProviderAuthRecoveryHint({ provider: error.provider })
	});
}
function resolveExternalRunFailureDetail(message) {
	const sanitized = message.trim().replace(/^⚠️\s*/u, "").replace(/\s+/gu, " ");
	return sanitized.length > EXTERNAL_RUN_FAILURE_DETAIL_MAX_CHARS ? `${truncateUtf16Safe(sanitized, 899).trimEnd()}…` : sanitized || void 0;
}
function formatForwardedExternalRunFailureText(message) {
	const detail = resolveExternalRunFailureDetail(message);
	return detail ? `⚠️ Agent failed before reply: ${detail}${/[.!?]$/u.test(detail) ? "" : "."} Please try again, or use /new to start a fresh session.` : GENERIC_EXTERNAL_RUN_FAILURE_TEXT;
}
function buildExternalRunFailureReply(input, options) {
	const message = typeof input === "string" ? input : input.message;
	const error = typeof input === "string" ? void 0 : input.error;
	const normalizedMessage = collapseRepeatedFailureDetail(message);
	const useHeartbeatFailureCopy = options?.useHeartbeatFailureCopy ?? options?.isHeartbeat === true;
	const buildUnclassifiedReply = (includeHeartbeatDetails) => {
		const sanitizedMessage = sanitizeUserFacingText(normalizedMessage, { errorContext: true });
		return {
			text: useHeartbeatFailureCopy ? renderHeartbeatRunFailureCopy(includeHeartbeatDetails ? resolveExternalRunFailureDetail(sanitizedMessage) : void 0) : options?.includeDetails ? formatForwardedExternalRunFailureText(sanitizedMessage) : GENERIC_EXTERNAL_RUN_FAILURE_TEXT,
			isGenericRunnerFailure: !options?.isHeartbeat
		};
	};
	const approvalMessage = resolveExecutionApprovalFailureMessage(normalizedMessage);
	if (approvalMessage) return {
		text: `⚠️ ${approvalMessage}`,
		isGenericRunnerFailure: false
	};
	if (collectErrorGraphCandidates(error, readErrorCauses).some((candidate) => candidate instanceof SkillResourceDeliveryLimitError)) return {
		text: "⚠️ Selected skill resources exceed the 8 MiB delivery limit. Select fewer skills, then try again.",
		isGenericRunnerFailure: false
	};
	if (isAgentHarnessPreflightError(error)) {
		const userMessage = renderAgentHarnessPreflightUserMessage(error);
		if (userMessage !== void 0) return {
			text: userMessage,
			isGenericRunnerFailure: false
		};
		return buildUnclassifiedReply(true);
	}
	const failoverFacts = options?.failoverFacts ?? resolveReplyFailoverFacts(error ?? normalizedMessage, normalizedMessage);
	const failoverCodeCopy = renderFailoverCodeUserCopy(failoverFacts.code);
	if (failoverCodeCopy) return {
		text: failoverCodeCopy,
		isGenericRunnerFailure: false
	};
	const runtimeCoordinationFailure = failoverFacts.code && isNonProviderRuntimeCoordinationError(error) ? renderRuntimeCoordinationFailureCopy(failoverFacts.code) : void 0;
	if (runtimeCoordinationFailure) return {
		text: runtimeCoordinationFailure,
		isGenericRunnerFailure: false
	};
	const oauthRefreshFailure = classifyOAuthRefreshFailureError(error) ?? classifyOAuthRefreshFailure(normalizedMessage);
	const providerLoginRecovery = buildProviderLoginRecovery({
		provider: oauthRefreshFailure ? oauthRefreshFailure.provider ?? void 0 : failoverFacts.provider,
		oauthReason: oauthRefreshFailure?.reason,
		failoverReason: failoverFacts.reason,
		authMode: failoverFacts.authMode
	});
	if (oauthRefreshFailure) {
		const loginCommand = buildOAuthRefreshFailureLoginCommand(oauthRefreshFailure.provider, { profileId: options?.includeAuthProfileId ? oauthRefreshFailure.profileId : void 0 });
		const loginCommandMarkdown = formatOAuthRefreshFailureLoginCommandMarkdown(loginCommand);
		const providerText = oauthRefreshFailure.provider ? ` for ${oauthRefreshFailure.provider}` : "";
		const retryLoginHint = providerLoginRecovery ? "send `/login` from a private chat or Control UI session to choose a provider, or re-auth" : "re-auth";
		if (oauthRefreshFailure.reason) return {
			text: providerLoginRecovery ? `⚠️ ${providerLoginRecovery.hint} You can also re-auth with ${loginCommandMarkdown} on the gateway.` : `⚠️ Model login expired on the gateway${providerText}. Re-auth with ${loginCommandMarkdown} in a terminal, then try again.`,
			...providerLoginRecovery ? { presentation: providerLoginRecovery.presentation } : {},
			isGenericRunnerFailure: false
		};
		return {
			text: `⚠️ Model login failed on the gateway${providerText}. Please try again. If this keeps happening, ${retryLoginHint} with ${loginCommandMarkdown} in a terminal.`,
			isGenericRunnerFailure: false
		};
	}
	const authProfileFailoverFailure = buildAuthProfileFailoverFailureText(error);
	if (authProfileFailoverFailure) return {
		text: providerLoginRecovery ? `${providerLoginRecovery.hint}\n\n${authProfileFailoverFailure}` : authProfileFailoverFailure,
		...providerLoginRecovery ? { presentation: providerLoginRecovery.presentation } : {},
		isGenericRunnerFailure: false
	};
	const cliTerminalStopError = findCliTerminalStopError(error);
	if (cliTerminalStopError) return {
		text: renderUserFacingText(cliTerminalStopError.message, { errorContext: true }),
		isGenericRunnerFailure: false
	};
	const cliTimeoutError = findCliTimeoutError(error);
	const cliBackendTimeoutFailure = renderCliTimeoutReplyCopy({
		message: normalizedMessage,
		cliTimeout: cliTimeoutError?.cliTimeout,
		provider: cliTimeoutError?.provider,
		replayPrevented: options?.replayPrevented
	});
	if (cliBackendTimeoutFailure) return {
		text: cliBackendTimeoutFailure,
		isGenericRunnerFailure: false
	};
	if (isFailoverError(error) && error.rateLimitRetriesExhausted !== void 0) {
		const summary = resolveReplyFailureSummary({
			error,
			message,
			reason: failoverFacts.reason,
			attempts: error.attempts
		});
		if (summary) return {
			text: summary.text,
			isGenericRunnerFailure: false
		};
	}
	const providerRequestError = failoverFacts.providerRequestError;
	if (providerRequestError) return {
		text: providerRequestError.userMessage,
		isGenericRunnerFailure: false
	};
	const authError = isProviderAuthError(error) ? error : void 0;
	const missingApiKeyFailure = renderMissingApiKeyReplyCopy(authError ? {
		provider: authError.provider,
		providerGuidance: authError.providerGuidance
	} : void 0);
	if (missingApiKeyFailure) return {
		text: missingApiKeyFailure,
		isGenericRunnerFailure: false
	};
	if (options?.isHeartbeat) return buildUnclassifiedReply(options.includeDetails === true);
	const codexAppServerFailure = renderCodexAppServerFailureCopy(normalizedMessage);
	if (codexAppServerFailure) return {
		text: codexAppServerFailure,
		isGenericRunnerFailure: false
	};
	if (failoverFacts.reason === "timeout" && hasLocalWorkerTaskTimeout(error)) return {
		text: "A local worker task timed out. Please try again.",
		isGenericRunnerFailure: false
	};
	const classifiedFailure = failoverFacts.requestFailureText ?? renderAssistantRequestFailureCopy(failoverFacts);
	if (classifiedFailure) return {
		text: classifiedFailure,
		isGenericRunnerFailure: false
	};
	return {
		text: options?.includeDetails ? formatForwardedExternalRunFailureText(renderUserFacingText(normalizedMessage, { errorContext: true })) : GENERIC_EXTERNAL_RUN_FAILURE_TEXT,
		isGenericRunnerFailure: true
	};
}
function markAgentRunFailureReplyPayload(payload) {
	const marked = markReplyPayloadForSourceSuppressionDelivery(payload);
	if (!isSilentReplyText(marked.text, "NO_REPLY")) marked.isError = true;
	return marked;
}
function markPostCompactionModelFailurePayload(postCompactionModelFailure, payload) {
	return postCompactionModelFailure === true && payload.isError === true && isReplyPayloadTerminalContent(payload) && typeof payload.text === "string" ? setReplyPayloadMetadata(payload, { postCompactionModelFailure: true }) : payload;
}
function renderPostCompactionModelFailurePayload(payload) {
	return getReplyPayloadMetadata(payload)?.postCompactionModelFailure === true && typeof payload.text === "string" ? copyReplyPayloadMetadata(payload, {
		...payload,
		text: `⚠️ Context compaction succeeded, but the later model request still failed. ${payload.text.replace(/^⚠️\s*/u, "")}`
	}) : payload;
}
/** Optional silence hides generic boilerplate, not guidance or the outcome of visible work. */
function resolveAgentRunFailureText(params) {
	return params.replyExpectation === "optional" && params.isGenericRunnerFailure && !params.visibleReplyDelivered ? SILENT_REPLY_TOKEN : params.text;
}
function buildTerminalAgentRunFailureReplyPayload(params) {
	const useHeartbeatFailureCopy = params.useHeartbeatFailureCopy ?? params.isHeartbeat === true;
	return markAgentRunFailureReplyPayload({ text: resolveAgentRunFailureText({
		...params,
		text: useHeartbeatFailureCopy ? HEARTBEAT_EXTERNAL_RUN_FAILURE_TEXT : GENERIC_EXTERNAL_RUN_FAILURE_TEXT,
		isGenericRunnerFailure: !params.isHeartbeat
	}) });
}
function buildEmptyInteractiveReplyPayload(params) {
	if (params.completion.outcome !== "missing") return;
	return markAgentRunFailureReplyPayload({ text: "I finished the turn, but it did not produce a visible reply. Please try again, or start a new session if this keeps happening." });
}
function buildKnownAgentRunFailureReplyPayload(params) {
	if (isAgentHarnessPreflightError(params.err)) {
		const reply = buildExternalRunFailureReply({
			message: params.err.message,
			error: params.err
		});
		return reply.isGenericRunnerFailure ? void 0 : markAgentRunFailureReplyPayload({ text: reply.text });
	}
	const message = formatErrorMessage(params.err);
	const failoverFacts = resolveReplyFailoverFacts(params.err, message);
	const failureSummary = resolveReplyFailureSummary({
		error: params.err,
		message,
		reason: failoverFacts.reason,
		attempts: readFallbackAttempts(params.err)
	});
	const knownFailureText = failureSummary?.kind === "billing" ? failureSummary.text : buildPreflightCompactionFailureText(message, { includeDetails: isVerboseFailureDetailEnabled(params.resolvedVerboseLevel) }) ?? failureSummary?.text;
	const externalRunFailureReply = knownFailureText ? {
		text: knownFailureText,
		isGenericRunnerFailure: false
	} : buildExternalRunFailureReply({
		message,
		error: params.err
	}, {
		includeAuthProfileId: !isNonDirectConversationContext(params.sessionCtx),
		includeDetails: isVerboseFailureDetailEnabled(params.resolvedVerboseLevel),
		failoverFacts
	});
	if (externalRunFailureReply.isGenericRunnerFailure) return;
	return markAgentRunFailureReplyPayload({
		text: externalRunFailureReply.text,
		...externalRunFailureReply.presentation ? { presentation: externalRunFailureReply.presentation } : {}
	});
}
//#endregion
export { buildPreflightCompactionFailureText as a, isVerboseFailureDetailEnabled as c, renderPostCompactionModelFailurePayload as d, resolveAgentRunFailureText as f, buildKnownAgentRunFailureReplyPayload as i, markAgentRunFailureReplyPayload as l, buildEmptyInteractiveReplyPayload as n, buildTerminalAgentRunFailureReplyPayload as o, resolveReplyFailureSummary as p, buildExternalRunFailureReply as r, isNonDirectConversationContext as s, buildAuthProfileFailoverFailureText as t, markPostCompactionModelFailurePayload as u };
