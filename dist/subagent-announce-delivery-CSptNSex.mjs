import { m as clampTimerTimeoutMs } from "./number-coercion-CLj0HTDM.mjs";
import { a as asOptionalRecord } from "./record-coerce-DItp3I4t.mjs";
import { c as normalizeOptionalLowercaseString, l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { r as defaultRuntime } from "./runtime-BC29JSZp.mjs";
import { t as isFastTestRuntimeEnv } from "./test-runtime-env-mVzBKwSd.mjs";
import "./env-C4a8LL2I.mjs";
import { n as normalizeAgentId } from "./agent-id-GA8mwdTG.mjs";
import { S as tryResolveLegacyCompatibilityAgentId } from "./agent-scope-config-IQKOEtZ4.mjs";
import { i as normalizeMainKey, r as isIncognitoSessionKey } from "./session-key-CUi_tcgF.mjs";
import { A as parseAgentSessionKey, b as isCronRunSessionKey, x as isCronSessionKey } from "./session-key-CBvmC8zz.mjs";
import { n as normalizeAccountId } from "./account-id-B1bfbA5J.mjs";
import "./legacy.default-agent-owner-B5Sofm47.mjs";
import { vt as sanitizeAgentRunTerminalReplyText } from "./openclaw-state-db-read-connection-Beg0AZE7.mjs";
import { t as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-Dn3_Z_Oi.mjs";
import { r as isIncognitoOpenClawAgentSqlitePath } from "./openclaw-agent-db.paths-C2YxM4Tj.mjs";
import { l as resolveSessionStorePathCore } from "./paths-CcMbq5NY.mjs";
import { n as resolvePersistedSessionStoreOwnerForKey } from "./session-store-owner-DBafeUlR.mjs";
import { r as getRuntimeConfig } from "./io.runtime-CZWcIUDk.mjs";
import "./config-DryArA1l.mjs";
import { f as stringifyRouteThreadId } from "./channel-route-Czo5mOSj.mjs";
import { t as INTERNAL_MESSAGE_CHANNEL } from "./message-channel-constants-Cd7Eq8Zi.mjs";
import { n as normalizeMessageChannel } from "./message-channel-core-CxyiAx1U.mjs";
import { a as mergeDeliveryContext, s as normalizeDeliveryContext } from "./delivery-context.shared-CW8dxG7X.mjs";
import { n as isGatewayMessageChannel, t as isDeliverableMessageChannel } from "./message-channel-normalize-2tAtQt1g.mjs";
import { a as isInternalMessageChannel } from "./message-channel-DDcHHhpX.mjs";
import { r as getLoadedChannelPluginForRead } from "./registry-loaded-CYq2sa_C.mjs";
import { t as deriveSessionChatTypeFromKey } from "./session-chat-type-shared-CThMOjN8.mjs";
import { t as getGlobalHookRunner } from "./hook-runner-global-tOGjxVvH.mjs";
import { a as isFailoverError } from "./error-ON38hPhx.mjs";
import { n as sessionDeliveryChannel, t as deliveryContextFromSession } from "./delivery-context.read-CR06zOJ4.mjs";
import { i as classifyAgentRunTerminalOutcome } from "./agent-run-terminal-outcome-CgoAW2Q7.mjs";
import { l as isPlatformMessageRejectedError, s as isOutboundDeliveryError } from "./deliver-types-Diy-VQKA.mjs";
import { l as loadSessionEntryReadOnly } from "./session-accessor.sqlite-entry-BTkJgNr-.mjs";
import { i as readSessionEntriesFromStoreInWorker } from "./session-accessor-C05KQ5A3.mjs";
import { a as hasRestartRecoveryTerminalRun, i as hasRestartRecoverySourceClaim, n as getRestartRecoveryTerminalDeliveryEvidence } from "./restart-recovery-state-CVOwSXMV.mjs";
import { a as buildAgentRunTerminalOutcomeFromWaitResult } from "./agent-run-terminal-outcome-Dto4EMdr.mjs";
import { a as createAgentRunDirectAbortError } from "./run-termination-Cd1iJzC7.mjs";
import { u as completionRequiresMessageToolDelivery } from "./task-notification-routing-D8Ldlzcz.mjs";
import { _ as shouldPreserveUserFacingSessionStateForInputProvenance, l as isAgentMediatedCompletionSourceTool, t as INTERNAL_PROVENANCE_SOURCE_CHANNEL } from "./input-provenance-C4tQegGN.mjs";
import { n as stripOutboundTargetKindPrefix, r as stripTargetProviderPrefix } from "./channel-target-prefix-BJKXiLk4.mjs";
import { a as resolveConversationIdFromTargets } from "./conversation-resolution-BQfeG7hv.mjs";
import { r as normalizeConversationRef } from "./current-conversation-binding-row-De9sUoDf.mjs";
import { t as getSessionBindingService } from "./session-binding-service-n2QTfkUE.mjs";
import { A as resolveEmbeddedRunAbandonment, b as queueEmbeddedAgentMessageWithOutcomeAsync, d as isEmbeddedAgentRunActive, o as formatEmbeddedAgentQueueFailureSummary, x as queueGuardedEmbeddedAgentMessageWithOutcomeAsync } from "./runs-ciDkXIOQ.mjs";
import { i as resolveActiveEmbeddedRunSessionId } from "./active-run-projections-ChS97Oy4.mjs";
import "./sessions-Cesa3L0p.mjs";
import { u as resolveDeliveryNotSentRetryability } from "./delivery-recovery.shared-f5deCrTJ.mjs";
import { c as getSubagentDepthFromSessionStore } from "./subagent-capabilities-D-LyBU4l.mjs";
import "./failover-error-BwAkMLuL.mjs";
import { r as sanitizePendingFinalDeliveryText } from "./pending-final-delivery-state-CJEOzbKd.mjs";
import { t as createUserTurnTranscriptRecorder } from "./user-turn-transcript-D66nAouM.mjs";
import { n as dispatchGatewayMethodInProcess } from "./server-plugin-in-process-dispatch-BpUBEeez.mjs";
import { a as waitForGatewayDispatch } from "./server-in-process-dispatch-rxc6WT92.mjs";
import { L as scheduleSessionDelivery } from "./subagent-completion-admission.store-C-FTAVQX.mjs";
import { i as enqueueClaimedSessionDelivery, p as releaseSessionDeliveryClaim } from "./session-delivery-queue-storage-DSTuGS2l.mjs";
import { a as hasVisibleAgentPayload, i as hasIntentionalSilentAgentPayload } from "./message-visibility-yTJ46I8l.mjs";
import "./subagent-announce.runtime.js";
import { i as hasVisibleCompletionResult, n as hasFailedSubagentNoOutputCompletion, r as hasGeneratedMediaCompletionEvent } from "./internal-event-contract-pF6FHp8g.mjs";
import { r as resolveRequesterStoreKey } from "./requester-tool-policy-DsXmfT22.mjs";
import { i as formatAgentInternalEventsForPrompt, r as collectAgentInternalEventMedia } from "./internal-events-CfvyIQfQ.mjs";
import { a as getAgentCommandDeliveryFailure, g as hasUnaccountedMessagingToolAggregateEvidence, l as hasCommittedOutboundDeliveryEvidence, m as hasMessagingToolDeliveryEvidence, o as getAutomaticDeliveryEvidence, s as getGatewayAgentResult, u as hasCommittedSourceReplyDeliveryEvidence, y as resolveExplicitFinalSourceReplyDeliveryEvidence } from "./delivery-evidence-B9fCOuaI.mjs";
import { t as admitCorrelatedSubagentSessionDelivery } from "./subagent-completion-delivery-miBR4hhO.mjs";
import { t as resolveQueueSettings } from "./queue-CJnUSYp0.mjs";
import { t as resolveExternalBestEffortDeliveryTarget } from "./best-effort-delivery-CJanGT7D.mjs";
import { t as sendMessage } from "./message-Bist4AXY.mjs";
import { r as sourceDeliveryTargetsMatch } from "./source-delivery-plan-WDG442HX.mjs";
import { n as isNonTerminalAgentRunStatus, t as normalizeAgentRunTerminalDeliverySnapshot } from "./agent-run-terminal-delivery-vdpDQeM7.mjs";
import { t as deliveryContextFromConversation } from "./route-projection-B6UquOhV.mjs";
//#region src/agents/subagents/announce/subagent-announce-delivery-retry.ts
/**
* Retry and error policy for subagent announcement delivery.
*/
const DEFAULT_SUBAGENT_ANNOUNCE_TIMEOUT_MS = 12e4;
var SourceOwnerChangedError = class extends Error {
	constructor() {
		super("subagent source lifecycle changed before completion delivery");
		this.name = "SourceOwnerChangedError";
	}
};
function sourceOwnerChangedResult() {
	return {
		delivered: false,
		path: "none",
		reason: "source_owner_changed",
		error: "subagent source lifecycle changed before completion delivery",
		terminal: true,
		disposition: "intentional_non_delivery"
	};
}
function resolveSubagentAnnounceTimeoutMs(cfg) {
	const configured = cfg.agents?.defaults?.subagents?.announceTimeoutMs;
	return clampTimerTimeoutMs(configured) ?? DEFAULT_SUBAGENT_ANNOUNCE_TIMEOUT_MS;
}
function summarizeDeliveryError(error) {
	if (error instanceof Error) return error.message || "error";
	if (typeof error === "string") return error;
	if (error === void 0 || error === null) return "unknown error";
	try {
		return JSON.stringify(error);
	} catch {
		return "error";
	}
}
const TRANSIENT_ANNOUNCE_DELIVERY_ERROR_PATTERNS = [
	/\berrorcode=unavailable\b/i,
	/\bstatus\s*[:=]\s*"?unavailable\b/i,
	/\bUNAVAILABLE\b/,
	/no active .* listener/i,
	/gateway not connected/i,
	/gateway closed \(1006/i,
	/gateway timeout/i,
	/\b(econnreset|econnrefused|etimedout|enotfound|ehostunreach|network error)\b/i
];
const WRITER_CLAIM_REBOUND_ANNOUNCE_RE = /session writer claim changed before transcript persistence/i;
const PERMANENT_ANNOUNCE_DELIVERY_ERROR_PATTERNS = [
	/unsupported channel/i,
	/unknown channel/i,
	/chat not found/i,
	/user not found/i,
	/bot.*not.*member/i,
	/bot was blocked by the user/i,
	/forbidden: bot was kicked/i,
	/recipient is not a valid/i,
	/outbound not configured for channel/i,
	WRITER_CLAIM_REBOUND_ANNOUNCE_RE
];
function isWriterClaimReboundAnnounceError(error) {
	return Boolean(error && typeof error === "object" && error.name === "SessionTranscriptWriterClaimReboundError" || WRITER_CLAIM_REBOUND_ANNOUNCE_RE.test(summarizeDeliveryError(error)));
}
const ANNOUNCE_ERROR_CHAIN_KEYS = [
	"cause",
	"error",
	"reason"
];
function isAnnounceErrorRecord(error) {
	return Boolean(error && typeof error === "object");
}
function hasAnnounceErrorMatch(error, matches, seen = /* @__PURE__ */ new Set()) {
	if (matches(error)) return true;
	if (!isAnnounceErrorRecord(error)) return false;
	if (seen.has(error)) return false;
	seen.add(error);
	return ANNOUNCE_ERROR_CHAIN_KEYS.some((key) => hasAnnounceErrorMatch(error[key], matches, seen));
}
function hasWriterClaimReboundAnnounceError(error) {
	return hasAnnounceErrorMatch(error, isWriterClaimReboundAnnounceError);
}
function isTransientFailoverAnnounceError(error) {
	return isFailoverError(error) && (error.reason === "overloaded" || (error.attempts?.length ?? 0) > 0);
}
function isPermanentNonWriterAnnounceError(error) {
	return hasAnnounceErrorMatch(error, (candidate) => isPlatformMessageRejectedError(candidate) || !isWriterClaimReboundAnnounceError(candidate) && PERMANENT_ANNOUNCE_DELIVERY_ERROR_PATTERNS.some((pattern) => pattern.test(summarizeDeliveryError(candidate))));
}
function isTransientAnnounceDeliveryError(error) {
	if (hasAnnounceSendEvidence(error)) return false;
	const typedRetryability = resolveDeliveryNotSentRetryability(error);
	if (typedRetryability !== void 0) return typedRetryability;
	if (isPermanentNonWriterAnnounceError(error)) return false;
	if (hasWriterClaimReboundAnnounceError(error)) return true;
	return hasAnnounceErrorMatch(error, (candidate) => {
		if (isTransientFailoverAnnounceError(candidate)) return true;
		const message = summarizeDeliveryError(candidate);
		if (candidate && typeof candidate === "object" && candidate.gatewayCode === "UNAVAILABLE" && /cron run continuation/i.test(message)) return true;
		return TRANSIENT_ANNOUNCE_DELIVERY_ERROR_PATTERNS.some((pattern) => pattern.test(message));
	});
}
function isPermanentAnnounceDeliveryError(error) {
	const typedRetryability = resolveDeliveryNotSentRetryability(error);
	if (typedRetryability !== void 0) return !typedRetryability;
	return isPermanentNonWriterAnnounceError(error) || hasWriterClaimReboundAnnounceError(error);
}
function isIncompleteAnnounceAgentResultError(error) {
	const message = summarizeDeliveryError(error);
	return /(?:incomplete terminal response|code=incomplete_result)\b/i.test(message);
}
function hasDirectAnnounceSendEvidence(error) {
	if (isOutboundDeliveryError(error) && error.sentBeforeError) return true;
	if (!isAnnounceErrorRecord(error)) return false;
	return error.sentBeforeError === true || error.visibleReplySent === true;
}
function hasAnnounceSendEvidence(error) {
	return hasAnnounceErrorMatch(error, hasDirectAnnounceSendEvidence);
}
async function waitForAnnounceRetryDelay(ms, signal) {
	if (ms <= 0) return;
	if (!signal) {
		await new Promise((resolve) => {
			setTimeout(resolve, ms);
		});
		return;
	}
	if (signal.aborted) return;
	await new Promise((resolve) => {
		const timer = setTimeout(() => {
			signal.removeEventListener("abort", onAbort);
			resolve();
		}, ms);
		const onAbort = () => {
			clearTimeout(timer);
			signal.removeEventListener("abort", onAbort);
			resolve();
		};
		signal.addEventListener("abort", onAbort, { once: true });
	});
}
function resolveDirectAnnounceTransientRetryDelaysMs() {
	return isFastTestRuntimeEnv() ? [
		8,
		16,
		32
	] : [
		5e3,
		1e4,
		2e4
	];
}
async function runAnnounceDeliveryWithRetry(params) {
	const retryDelaysMs = resolveDirectAnnounceTransientRetryDelaysMs();
	for (const [retryIndex, delayMs] of retryDelaysMs.entries()) {
		if (params.isAttemptAllowed?.() === false) throw new SourceOwnerChangedError();
		if (params.signal?.aborted) throw new Error("announce delivery aborted");
		try {
			return await params.run();
		} catch (err) {
			if (!isTransientAnnounceDeliveryError(err) || params.signal?.aborted) throw err;
			if (params.isAttemptAllowed?.() === false) throw new SourceOwnerChangedError();
			const nextAttempt = retryIndex + 2;
			const maxAttempts = retryDelaysMs.length + 1;
			defaultRuntime.log(`[warn] Subagent announce ${params.operation} transient failure, retrying ${nextAttempt}/${maxAttempts} in ${Math.round(delayMs / 1e3)}s: ${summarizeDeliveryError(err)}`);
			await waitForAnnounceRetryDelay(delayMs, params.signal);
		}
	}
	if (params.signal?.aborted) throw new Error("announce delivery aborted");
	if (params.isAttemptAllowed?.() === false) throw new SourceOwnerChangedError();
	return await params.run();
}
//#endregion
//#region src/infra/outbound/bound-delivery-router.ts
function isActiveBinding(record) {
	return record.status === "active";
}
function resolveBindingForRequester(requester, bindings) {
	const matchingChannelAccount = bindings.filter((entry) => {
		const conversation = normalizeConversationRef(entry.conversation);
		return conversation.channel === requester.channel && conversation.accountId === requester.accountId;
	});
	if (matchingChannelAccount.length === 0) return null;
	const exactConversation = matchingChannelAccount.find((entry) => normalizeConversationRef(entry.conversation).conversationId === requester.conversationId);
	if (exactConversation) return exactConversation;
	if (matchingChannelAccount.length === 1) return matchingChannelAccount[0] ?? null;
	return null;
}
/** Creates a router that resolves task-completion delivery through active session bindings. */
function createBoundDeliveryRouter(service = getSessionBindingService()) {
	return { resolveDestination: (input) => {
		const targetSessionKey = input.targetSessionKey.trim();
		if (!targetSessionKey) return {
			binding: null,
			mode: "fallback",
			reason: "missing-target-session"
		};
		const activeBindings = service.listBySession(targetSessionKey).filter(isActiveBinding);
		if (activeBindings.length === 0) return {
			binding: null,
			mode: "fallback",
			reason: "no-active-binding"
		};
		if (!input.requester) {
			if (input.failClosed) return {
				binding: null,
				mode: "fallback",
				reason: "missing-requester"
			};
			if (activeBindings.length === 1) return {
				binding: activeBindings[0] ?? null,
				mode: "bound",
				reason: "single-active-binding"
			};
			return {
				binding: null,
				mode: "fallback",
				reason: "ambiguous-without-requester"
			};
		}
		const requester = normalizeConversationRef(input.requester);
		if (!requester.channel || !requester.conversationId) return {
			binding: null,
			mode: "fallback",
			reason: "invalid-requester"
		};
		const fromRequester = resolveBindingForRequester(requester, activeBindings);
		if (fromRequester) return {
			binding: fromRequester,
			mode: "bound",
			reason: "requester-match"
		};
		if (activeBindings.length === 1 && !input.failClosed) return {
			binding: activeBindings[0] ?? null,
			mode: "bound",
			reason: "single-active-binding-fallback"
		};
		return {
			binding: null,
			mode: "fallback",
			reason: "no-requester-match"
		};
	} };
}
//#endregion
//#region src/agents/subagents/announce/subagent-announce-delivery.runtime.ts
function tryResolveSubagentRequesterAgentId(cfg, requesterSessionKey, explicitAgentId) {
	const requestedAgentId = explicitAgentId?.trim() ? normalizeAgentId(explicitAgentId) : void 0;
	const parsedAgentId = parseAgentSessionKey(requesterSessionKey)?.agentId;
	if (requestedAgentId && parsedAgentId && requestedAgentId !== parsedAgentId) return;
	const persistedStoreOwner = resolvePersistedSessionStoreOwnerForKey(cfg, requesterSessionKey);
	if (persistedStoreOwner.kind === "retired") return;
	if (requestedAgentId && persistedStoreOwner.kind === "configured" && requestedAgentId !== persistedStoreOwner.agentId) return;
	const resolvedAgentId = requestedAgentId ?? parsedAgentId;
	if (resolvedAgentId) return resolvedAgentId;
	return (persistedStoreOwner.kind === "configured" ? persistedStoreOwner.agentId : void 0) ?? tryResolveLegacyCompatibilityAgentId(cfg);
}
function loadRequesterSessionEntry(requesterSessionKey, explicitAgentId) {
	const cfg = getRuntimeConfig();
	const rawStorageKey = requesterSessionKey.trim();
	const canonicalKey = resolveRequesterStoreKey(cfg, requesterSessionKey, explicitAgentId);
	const configuredMainKey = normalizeMainKey(cfg.session?.mainKey);
	const storageKey = rawStorageKey === "main" || rawStorageKey === configuredMainKey ? canonicalKey : rawStorageKey;
	const agentId = tryResolveSubagentRequesterAgentId(cfg, rawStorageKey, explicitAgentId);
	if (!agentId) return {
		cfg,
		entry: void 0,
		canonicalKey
	};
	const storePath = resolveSessionStorePathCore(cfg.session?.store, { agentId });
	return {
		cfg,
		entry: loadSessionEntryReadOnly({
			storePath,
			sessionKey: storageKey,
			agentId,
			clone: false
		}),
		canonicalKey,
		agentId,
		storePath
	};
}
function getSubagentAnnounceRuntimeConfig() {
	return getRuntimeConfig();
}
function getSubagentRequesterSessionActivity(requesterSessionKey, requesterAgentId) {
	const resolvedAgentId = tryResolveSubagentRequesterAgentId(getRuntimeConfig(), requesterSessionKey, requesterAgentId);
	if (!resolvedAgentId) return { isActive: false };
	const storedSessionId = loadRequesterSessionEntry(requesterSessionKey, resolvedAgentId).entry?.sessionId;
	const sessionId = (parseAgentSessionKey(requesterSessionKey) ? resolveActiveEmbeddedRunSessionId(requesterSessionKey) : void 0) ?? storedSessionId;
	return {
		sessionId,
		isActive: Boolean(sessionId && isEmbeddedAgentRunActive(sessionId))
	};
}
function resolveSubagentRequesterSessionAbandonment(requesterSessionKey, sessionId) {
	return resolveEmbeddedRunAbandonment({
		sessionKey: requesterSessionKey,
		sessionId
	});
}
function loadSessionEntryByKey(sessionKey, explicitAgentId) {
	const cfg = getRuntimeConfig();
	const agentId = tryResolveSubagentRequesterAgentId(cfg, sessionKey, explicitAgentId);
	if (!agentId) return;
	const storePath = resolveSessionStorePathCore(cfg.session?.store, { agentId });
	return loadSessionEntryReadOnly({
		storePath,
		sessionKey,
		agentId,
		clone: false
	});
}
async function queueSubagentAnnounceMessage(sessionId, text, options, canInject) {
	if (canInject) return await queueGuardedEmbeddedAgentMessageWithOutcomeAsync(sessionId, text, options, canInject);
	return await queueEmbeddedAgentMessageWithOutcomeAsync(sessionId, text, options);
}
async function dispatchSubagentAnnounceAgent(agentParams, options) {
	return await dispatchGatewayMethodInProcess("agent", agentParams, options);
}
async function sendSubagentAnnounceMessage(params) {
	return await sendMessage(params);
}
//#endregion
//#region src/agents/subagents/announce/subagent-announce-active-wake.ts
/**
* Active-requester wake and steering for subagent announcements.
*/
const SOURCE_OWNER_CHANGED = Symbol("source_owner_changed");
function resolveRequesterSessionActivity(requesterSessionKey, requesterAgentId) {
	const resolvedAgentId = tryResolveSubagentRequesterAgentId(getSubagentAnnounceRuntimeConfig(), requesterSessionKey, requesterAgentId);
	if (!resolvedAgentId) return { isActive: false };
	const activity = getSubagentRequesterSessionActivity(requesterSessionKey, resolvedAgentId);
	if (activity.sessionId || activity.isActive) return activity;
	const { entry } = loadRequesterSessionEntry(requesterSessionKey, resolvedAgentId);
	const sessionId = entry?.sessionId;
	return {
		sessionId,
		isActive: Boolean(sessionId && isEmbeddedAgentRunActive(sessionId))
	};
}
function resolveCompactionSteerRetryDelaysMs() {
	return isFastTestRuntimeEnv() ? [
		8,
		16,
		32,
		64
	] : [
		1e3,
		2e3,
		4e3,
		8e3
	];
}
async function resolveActiveWakeWithRetries(sessionId, message, wakeOptions, signal, isAttemptAllowed, isSourceSessionAdmissionAllowed) {
	const compactionDeadlineMs = typeof wakeOptions.deliveryTimeoutMs === "number" && wakeOptions.deliveryTimeoutMs > 0 ? Date.now() + wakeOptions.deliveryTimeoutMs : void 0;
	let currentOptions = wakeOptions;
	const resolveRetryOptions = () => {
		if (compactionDeadlineMs === void 0) return currentOptions;
		const remainingDeliveryTimeoutMs = compactionDeadlineMs - Date.now();
		if (remainingDeliveryTimeoutMs <= 0) return;
		return {
			...currentOptions,
			deliveryTimeoutMs: remainingDeliveryTimeoutMs
		};
	};
	const canInject = isSourceSessionAdmissionAllowed ? () => isAttemptAllowed?.() !== false && isSourceSessionAdmissionAllowed() : void 0;
	const attemptWake = async (options) => {
		if (isAttemptAllowed?.() === false || isSourceSessionAdmissionAllowed?.() === false) return SOURCE_OWNER_CHANGED;
		const result = await queueSubagentAnnounceMessage(sessionId, message, options, canInject);
		return isAttemptAllowed?.() === false ? SOURCE_OWNER_CHANGED : result;
	};
	let outcome = await attemptWake(currentOptions);
	const compactionRetryDelaysMs = resolveCompactionSteerRetryDelaysMs();
	let compactionRetryIndex = 0;
	for (;;) {
		if (outcome === SOURCE_OWNER_CHANGED) break;
		if (outcome.queued || signal?.aborted) break;
		if (isAttemptAllowed?.() === false || isSourceSessionAdmissionAllowed?.() === false) {
			outcome = SOURCE_OWNER_CHANGED;
			break;
		}
		if (outcome.reason === "source_reply_delivery_mode_mismatch" && currentOptions.sourceReplyDeliveryMode !== void 0) {
			const activeRunOptions = { ...currentOptions };
			delete activeRunOptions.sourceReplyDeliveryMode;
			currentOptions = activeRunOptions;
			outcome = await attemptWake(currentOptions);
			continue;
		}
		if (outcome.reason === "compacting") {
			const remainingDeliveryTimeoutMs = compactionDeadlineMs === void 0 ? void 0 : compactionDeadlineMs - Date.now();
			if (!(remainingDeliveryTimeoutMs === void 0 ? compactionRetryIndex < compactionRetryDelaysMs.length : remainingDeliveryTimeoutMs > 0)) break;
			const scheduledDelayMs = compactionRetryDelaysMs[Math.min(compactionRetryIndex, compactionRetryDelaysMs.length - 1)] ?? 0;
			const delayMs = remainingDeliveryTimeoutMs === void 0 ? scheduledDelayMs : Math.min(scheduledDelayMs, remainingDeliveryTimeoutMs);
			if (delayMs <= 0 && remainingDeliveryTimeoutMs !== void 0) break;
			await waitForAnnounceRetryDelay(delayMs, signal);
			if (signal?.aborted) break;
			compactionRetryIndex += 1;
			const retryOptions = resolveRetryOptions();
			if (!retryOptions) break;
			outcome = await attemptWake(retryOptions);
			continue;
		}
		break;
	}
	return outcome;
}
async function maybeSteerSubagentAnnounce(params) {
	if (params.signal?.aborted) return { status: "none" };
	const cfg = getSubagentAnnounceRuntimeConfig();
	const requesterAgentId = tryResolveSubagentRequesterAgentId(cfg, params.requesterSessionKey, params.requesterAgentId);
	if (!requesterAgentId) return { status: "none" };
	const { entry } = loadRequesterSessionEntry(params.requesterSessionKey, requesterAgentId);
	const canonicalKey = resolveRequesterStoreKey(cfg, params.requesterSessionKey, requesterAgentId);
	const { sessionId, isActive } = resolveRequesterSessionActivity(params.requesterSessionKey, requesterAgentId);
	if (resolveSubagentRequesterSessionAbandonment(canonicalKey, sessionId)) return { status: "none" };
	if (!sessionId || !isActive) return { status: "none" };
	const queueSettings = resolveQueueSettings({
		cfg,
		channel: sessionDeliveryChannel(entry),
		sessionEntry: entry
	});
	const queueOptions = {
		deliveryTimeoutMs: params.deliveryTimeoutMs,
		steeringMode: "all",
		...queueSettings.debounceMs !== void 0 ? { debounceMs: queueSettings.debounceMs } : {},
		waitForTranscriptCommit: true,
		...params.createUserTurnTranscriptRecorder ? { userTurnTranscriptRecorder: params.createUserTurnTranscriptRecorder(sessionId) } : {}
	};
	const queueOutcome = await resolveActiveWakeWithRetries(sessionId, params.steerMessage, queueOptions, params.signal, params.isSourceSessionEffectsAllowed, params.isSourceSessionAdmissionAllowed);
	if (queueOutcome === SOURCE_OWNER_CHANGED) return { status: "source_owner_changed" };
	if (queueOutcome.queued) return {
		status: "steered",
		deliveredAt: queueOutcome.deliveredAtMs,
		enqueuedAt: queueOutcome.enqueuedAtMs
	};
	if (queueOutcome.reason === "stale_run" || queueOutcome.reason === "transcript_commit_wait_unsupported" || params.isSourceSessionAdmissionAllowed !== void 0 && queueOutcome.reason === "guarded_injection_unsupported") return { status: "none" };
	return { status: resolveRequesterSessionActivity(params.requesterSessionKey, requesterAgentId).isActive ? "dropped" : "none" };
}
function formatActiveWakeFailure(fallback, outcome) {
	const summary = formatEmbeddedAgentQueueFailureSummary(outcome);
	return summary ? `${fallback}: ${summary}` : fallback;
}
function isSourceOwnerChangedWake(outcome) {
	return outcome === SOURCE_OWNER_CHANGED;
}
//#endregion
//#region src/agents/subagents/announce/subagent-announce-origin.ts
/**
* Subagent announcement origin resolver.
*
* Merges requester and session delivery context while avoiding stale thread ids after retargeting.
*/
function normalizeAnnounceRouteTarget(context, fallbackChannel) {
	const rawTo = normalizeOptionalString(context?.to);
	if (!rawTo) return;
	const channel = normalizeOptionalString(context?.channel ?? fallbackChannel);
	const messaging = channel ? getLoadedChannelPluginForRead(channel)?.messaging : void 0;
	const stripPrefixes = (value) => stripOutboundTargetKindPrefix(stripTargetProviderPrefix(value, channel ?? ""), ["group", "channel"]);
	const target = stripPrefixes(rawTo);
	const rawId = stripPrefixes(messaging?.normalizeTarget?.(target) ?? target);
	if (!rawId) return;
	const conversation = messaging?.resolveSessionConversation?.({
		kind: inferDeliveryTargetChatType({
			channel,
			to: rawTo
		}) === "group" ? "group" : "channel",
		rawId
	});
	const id = normalizeOptionalString(conversation?.id);
	return {
		id: id ?? (messaging?.targetIdComparison === "lowercase" ? rawId.toLowerCase() : rawId),
		threadId: id ? normalizeOptionalString(conversation?.threadId) : void 0
	};
}
function shouldStripThreadFromAnnounceFallback(normalizedRequester, normalizedEntry) {
	if (!normalizedRequester?.to || normalizedRequester.threadId != null || normalizedEntry?.threadId == null) return false;
	const requesterTarget = normalizeAnnounceRouteTarget(normalizedRequester, normalizedEntry?.channel);
	const entryTarget = normalizeAnnounceRouteTarget(normalizedEntry, normalizedRequester.channel);
	if (requesterTarget && entryTarget) return requesterTarget.id !== entryTarget.id || requesterTarget.threadId !== void 0 && requesterTarget.threadId !== stringifyRouteThreadId(normalizedEntry.threadId);
	return false;
}
function mergeAnnounceDeliveryContext(primary, fallback) {
	const normalizedPrimary = normalizeDeliveryContext(primary);
	const normalizedFallback = normalizeDeliveryContext(fallback);
	if (normalizedFallback && shouldStripThreadFromAnnounceFallback(normalizedPrimary, normalizedFallback)) {
		const { threadId: _ignore, ...rest } = normalizedFallback;
		return mergeDeliveryContext(normalizedPrimary, rest);
	}
	return mergeDeliveryContext(normalizedPrimary, normalizedFallback);
}
/** Resolve the delivery origin for a subagent completion announcement. */
function resolveAnnounceOrigin(entry, requesterOrigin) {
	const normalizedRequester = normalizeDeliveryContext(requesterOrigin);
	const normalizedEntry = deliveryContextFromSession(entry);
	if (normalizedRequester?.channel && isInternalMessageChannel(normalizedRequester.channel)) return mergeDeliveryContext({
		accountId: normalizedRequester.accountId,
		threadId: normalizedRequester.threadId
	}, normalizedEntry);
	return mergeAnnounceDeliveryContext(normalizedRequester, normalizedEntry);
}
function resolveBoundConversationOrigin(params) {
	const conversation = params.bindingConversation;
	const conversationId = conversation.conversationId?.trim() ?? "";
	const parentConversationId = conversation.parentConversationId?.trim() ?? "";
	const requesterConversationId = params.requesterConversation?.conversationId?.trim() ?? "";
	const requesterTo = params.requesterOrigin?.to?.trim();
	const boundTarget = deliveryContextFromConversation(conversation);
	const inferredThreadId = boundTarget?.threadId ?? (parentConversationId && parentConversationId !== conversationId ? conversationId : void 0);
	const to = requesterTo && conversationId && requesterConversationId && conversationId === requesterConversationId ? requesterTo : boundTarget?.to;
	return {
		channel: conversation.channel,
		accountId: conversation.accountId,
		to,
		threadId: inferredThreadId
	};
}
/** Resolve the bound or hook-provided external origin for a completed subagent. */
async function resolveSubagentCompletionOrigin(params) {
	const requesterOrigin = normalizeDeliveryContext(params.requesterOrigin);
	const channel = normalizeOptionalLowercaseString(requesterOrigin?.channel);
	const to = requesterOrigin?.to?.trim();
	const accountId = normalizeAccountId(requesterOrigin?.accountId);
	const threadId = requesterOrigin?.threadId != null && requesterOrigin.threadId !== "" ? requesterOrigin.threadId : void 0;
	const conversationId = stringifyRouteThreadId(threadId) || resolveConversationIdFromTargets({ targets: [to] }) || "";
	const requesterConversation = channel && conversationId ? {
		channel,
		accountId,
		conversationId
	} : void 0;
	const router = createBoundDeliveryRouter();
	for (const targetSessionKey of [params.requesterSessionKey, params.childSessionKey]) {
		const route = router.resolveDestination({
			eventKind: "task_completion",
			targetSessionKey,
			requester: requesterConversation,
			failClosed: true
		});
		if (route.mode === "bound" && route.binding) return mergeAnnounceDeliveryContext(resolveBoundConversationOrigin({
			bindingConversation: route.binding.conversation,
			requesterConversation,
			requesterOrigin
		}), requesterOrigin);
	}
	const hookRunner = getGlobalHookRunner();
	if (!hookRunner?.hasHooks("subagent_delivery_target")) return requesterOrigin;
	try {
		const result = await hookRunner.runSubagentDeliveryTarget({
			childSessionKey: params.childSessionKey,
			requesterSessionKey: params.requesterSessionKey,
			requesterOrigin,
			childRunId: params.childRunId,
			spawnMode: params.spawnMode,
			expectsCompletionMessage: params.expectsCompletionMessage
		}, {
			runId: params.childRunId,
			childSessionKey: params.childSessionKey,
			requesterSessionKey: params.requesterSessionKey
		});
		const hookOrigin = normalizeDeliveryContext(result?.origin);
		return !hookOrigin || hookOrigin.channel && isInternalMessageChannel(hookOrigin.channel) ? requesterOrigin : mergeAnnounceDeliveryContext(hookOrigin, requesterOrigin);
	} catch {
		return requesterOrigin;
	}
}
function stripNonDeliverableChannel(context) {
	const normalized = normalizeDeliveryContext(context);
	if (!normalized?.channel) return normalized;
	const channel = normalizeMessageChannel(normalized.channel);
	if (!channel || isDeliverableMessageChannel(channel)) return normalized;
	const { channel: _channel, ...rest } = normalized;
	return normalizeDeliveryContext(rest);
}
/** Resolve normalized session and external completion origins once for every delivery path. */
function resolveCompletionDeliveryOrigins(params) {
	const directOrigin = normalizeDeliveryContext(params.directOrigin);
	const requesterSessionOrigin = normalizeDeliveryContext(params.requesterSessionOrigin);
	const completionFallbackOrigin = mergeAnnounceDeliveryContext(directOrigin, requesterSessionOrigin);
	return {
		directOrigin,
		requesterSessionOrigin,
		effectiveDirectOrigin: params.expectsCompletionMessage ? mergeAnnounceDeliveryContext(stripNonDeliverableChannel(params.completionDirectOrigin), completionFallbackOrigin) : directOrigin
	};
}
/** Infer whether a normalized delivery target addresses a direct, group, or channel chat. */
function inferDeliveryTargetChatType(target) {
	const normalizedTo = normalizeOptionalLowercaseString(target.to);
	if (!normalizedTo) return;
	if (normalizedTo.startsWith("dm:") || normalizedTo.startsWith("direct:") || normalizedTo.startsWith("user:") || normalizedTo.includes(":dm:") || normalizedTo.includes(":direct:")) return "direct";
	if (normalizedTo.startsWith("channel:") || normalizedTo.startsWith("thread:")) return "channel";
	if (normalizedTo.startsWith("group:")) return "group";
	const channel = normalizeMessageChannel(target.channel);
	return channel ? getLoadedChannelPluginForRead(channel)?.messaging?.inferTargetChatType?.({ to: target.to ?? "" }) : void 0;
}
/** Resolve the durable generated-media handoff route from the canonical completion origin. */
function resolveGeneratedMediaSessionDeliveryRoute(params) {
	const { effectiveDirectOrigin: deliveryContext } = resolveCompletionDeliveryOrigins({
		...params,
		expectsCompletionMessage: true
	});
	const channel = normalizeMessageChannel(deliveryContext?.channel);
	const to = deliveryContext?.to?.trim();
	const inferredRouteChatType = inferDeliveryTargetChatType({
		channel,
		to
	});
	const derivedChatType = deriveSessionChatTypeFromKey(params.sessionKey);
	const chatType = inferredRouteChatType ?? (!derivedChatType || derivedChatType === "unknown" ? "direct" : derivedChatType);
	if (channel && isGatewayMessageChannel(channel) && to) return {
		route: {
			channel,
			to,
			...deliveryContext?.accountId ? { accountId: deliveryContext.accountId } : {},
			...deliveryContext?.threadId != null ? { threadId: stringifyRouteThreadId(deliveryContext.threadId) } : {},
			chatType
		},
		deliveryContext
	};
	return {
		route: {
			channel: INTERNAL_MESSAGE_CHANNEL,
			to: params.sessionKey,
			chatType
		},
		deliveryContext
	};
}
//#endregion
//#region src/agents/subagents/announce/subagent-announce-completion-delivery.ts
/**
* Requester completion calls, direct fallback, and source-delivery evidence.
*/
async function runAnnounceAgentCall(params) {
	const deadline = new AbortController();
	const sourceLifecycle = new AbortController();
	const isSourceSessionAdmissionAllowed = params.isSourceSessionAdmissionAllowed;
	const lifecycleSignal = params.signal ? AbortSignal.any([params.signal, sourceLifecycle.signal]) : sourceLifecycle.signal;
	const signal = AbortSignal.any([lifecycleSignal, deadline.signal]);
	const executionSignal = params.privateCompletion ? lifecycleSignal : signal;
	const timer = params.timeoutMs === void 0 ? void 0 : setTimeout(() => deadline.abort(/* @__PURE__ */ new Error("gateway request timeout for agent")), params.timeoutMs);
	timer?.unref?.();
	try {
		signal.throwIfAborted();
		const dispatch = dispatchSubagentAnnounceAgent(params.agentParams, {
			cancelOnDeadline: true,
			privateCompletion: params.privateCompletion,
			settleWakeReplay: params.settleWakeSourceSessionKeys ? {
				sourceSessionKeys: params.settleWakeSourceSessionKeys,
				assertCurrent: () => {
					if (!params.isExecutionAllowed()) throw new SourceOwnerChangedError();
				}
			} : void 0,
			expectFinal: params.expectFinal,
			forceSyntheticClient: shouldPreserveUserFacingSessionStateForInputProvenance(params.agentParams.inputProvenance),
			operatorRoleActor: { kind: "system" },
			delegatedToolPolicyHandoff: params.delegatedToolPolicyHandoff,
			signal: executionSignal,
			...isSourceSessionAdmissionAllowed ? { sessionMutationCommitGuard: () => {
				if (!isSourceSessionAdmissionAllowed()) {
					const error = new SourceOwnerChangedError();
					sourceLifecycle.abort(error);
					throw error;
				}
			} } : {},
			onAccepted: () => clearTimeout(timer),
			onExecutionStarted: () => {
				executionSignal.throwIfAborted();
				if (!params.isExecutionAllowed()) {
					sourceLifecycle.abort(new SourceOwnerChangedError());
					throw createAgentRunDirectAbortError();
				}
				clearTimeout(timer);
			},
			resolveGatewayContext: params.resolveGatewayContext
		});
		return params.privateCompletion ? await waitForGatewayDispatch("agent", dispatch, void 0, signal) : await dispatch;
	} catch (error) {
		sourceLifecycle.signal.throwIfAborted();
		throw error;
	} finally {
		clearTimeout(timer);
	}
}
const FAILED_COMPLETION_NOTICE = "A delegated task failed before it could report a result. Please retry the task.";
function isGatewayAgentRunPending(response) {
	if (!response || typeof response !== "object") return false;
	const status = response.status;
	return isNonTerminalAgentRunStatus(status);
}
/** A recovery successor owns its admitted input until its exact final can be reconciled. */
function resolveRequesterRecoveryDelivery(entry, runId) {
	const result = getRestartRecoveryTerminalDeliveryEvidence(entry, runId);
	if (result) return {
		kind: "result",
		result
	};
	if (hasRestartRecoverySourceClaim(entry, runId)) return {
		kind: "delivery",
		delivery: {
			delivered: false,
			path: "direct",
			reason: "requester_turn_pending",
			disposition: "retryable"
		}
	};
	if (hasRestartRecoveryTerminalRun(entry, runId)) return {
		kind: "delivery",
		delivery: {
			delivered: false,
			path: "direct",
			reason: "visible_reply_missing",
			error: "recovered requester completed without durable final delivery evidence",
			disposition: "permanent_failure"
		}
	};
}
function resolvePrivateCompletionDeliveryResult(response, origin) {
	const outcome = buildAgentRunTerminalOutcomeFromWaitResult(response);
	if (outcome?.reason === "cancelled" && outcome.stopReason !== "restart") return {
		delivered: false,
		path: "direct",
		terminal: true,
		reason: "delivery_suppressed",
		disposition: "intentional_non_delivery",
		error: "private requester continuation was cancelled"
	};
	const delivery = response?.status === "ok" && response?.inputProcessingCompleted === true ? {
		delivered: true,
		path: "direct"
	} : {
		delivered: false,
		path: "direct",
		reason: "completion_handoff_pending",
		error: "private requester turn has not completed successfully",
		disposition: "retryable"
	};
	const result = getGatewayAgentResult(response);
	if (delivery.delivered && origin?.channel && origin.to && result && result.meta?.yielded !== true && result.meta?.continuationPending !== true && hasMessagingToolDeliveryToSource(result, origin, { requireFinalReply: true })) delivery.requesterVisibleFinalDelivered = true;
	return delivery;
}
function buildRequesterCompletionDeliveryResult(finalCommitted, text) {
	const finalAssistantVisibleText = finalCommitted && typeof text === "string" ? truncateUtf16Safe(text.trim(), 12e3) : "";
	return {
		delivered: true,
		path: "direct",
		...finalCommitted ? { requesterVisibleFinalDelivered: true } : {},
		...finalAssistantVisibleText ? { finalAssistantVisibleText } : {}
	};
}
function isDirectMessageDeliveryTarget(target, requesterSessionKey) {
	if (target.threadId) return false;
	const targetChatType = inferDeliveryTargetChatType(target);
	if (targetChatType) return targetChatType === "direct";
	return deriveSessionChatTypeFromKey(requesterSessionKey) === "direct";
}
function resolveTextCompletionDirectFallback(events, contentKind) {
	if (contentKind === "failed_notice") return FAILED_COMPLETION_NOTICE;
	for (let index = (events?.length ?? 0) - 1; index >= 0; index -= 1) {
		const event = events?.[index];
		if (event?.type !== "task_completion" || event.source !== "subagent") continue;
		if (event.status !== "ok") continue;
		if (!hasVisibleCompletionResult(event)) continue;
		const result = typeof event.result === "string" ? sanitizeAgentRunTerminalReplyText(sanitizePendingFinalDeliveryText(event.result)) : "";
		if (result) return result;
	}
}
async function deliverCompletionDirect(params) {
	const content = resolveTextCompletionDirectFallback(params.internalEvents, params.contentKind);
	if (!content || !params.deliveryTarget.deliver || !params.deliveryTarget.channel || !params.deliveryTarget.to || !isDirectMessageDeliveryTarget(params.deliveryTarget, params.requesterSessionKey)) return;
	const agentId = tryResolveSubagentRequesterAgentId(params.cfg, params.requesterSessionKey, params.requesterAgentId);
	if (!agentId) return;
	const idempotencyKey = `${params.directIdempotencyKey}:text-direct`;
	let committedDelivery;
	try {
		if (params.isSourceSessionEffectsAllowed?.() === false) return sourceOwnerChangedResult();
		if (params.signal?.aborted) return {
			delivered: false,
			path: "none"
		};
		const sendResult = await sendSubagentAnnounceMessage({
			cfg: params.cfg,
			channel: params.deliveryTarget.channel,
			to: params.deliveryTarget.to,
			accountId: params.deliveryTarget.accountId,
			threadId: params.deliveryTarget.threadId,
			requesterSessionKey: params.requesterSessionKey,
			agentId,
			conversationType: "direct",
			content,
			idempotencyKey,
			skipQueue: true,
			abortSignal: params.signal,
			onPlatformSendDispatch: async () => {
				params.signal?.throwIfAborted();
				if (params.isSourceSessionEffectsAllowed?.() === false) throw new SourceOwnerChangedError();
			},
			onDeliveryResult: () => {
				if (committedDelivery) return;
				committedDelivery = {
					delivered: true,
					path: "direct",
					deliveredAt: Date.now()
				};
				params.onDeliveryResult?.(committedDelivery);
			},
			mirror: {
				sessionKey: params.requesterSessionKey,
				agentId,
				idempotencyKey
			}
		});
		if (committedDelivery) return committedDelivery;
		if (sendResult.deliveryStatus === "suppressed") {
			const ambiguous = sendResult.suppressionReason === "adapter_returned_no_identity";
			return {
				delivered: false,
				path: "direct",
				reason: ambiguous ? void 0 : "delivery_suppressed",
				error: ambiguous ? "text completion direct delivery could not be confirmed: adapter returned no identity" : `text completion direct delivery was suppressed: ${sendResult.suppressionReason ?? "unknown reason"}`,
				...ambiguous ? { disposition: "ambiguous" } : {
					disposition: "intentional_non_delivery",
					terminal: true
				}
			};
		}
		return {
			delivered: true,
			path: "direct"
		};
	} catch (err) {
		if (committedDelivery) return committedDelivery;
		if (err instanceof SourceOwnerChangedError) return sourceOwnerChangedResult();
		if (params.signal?.aborted) return {
			delivered: false,
			path: "none"
		};
		return {
			delivered: false,
			path: "direct",
			error: `text completion direct delivery failed: ${summarizeDeliveryError(err)}`
		};
	}
}
function hasMessagingToolDeliveryToSource(result, deliveryTarget, options) {
	const targets = Array.isArray(result.messagingToolSentTargets) ? result.messagingToolSentTargets : [];
	const sourceTargets = targets.filter((target) => {
		if (!target || typeof target !== "object" || Array.isArray(target) || !deliveryTarget.channel || !deliveryTarget.to) return false;
		const record = target;
		const sourceTarget = typeof record.to === "string" && record.to.trim() ? record : {
			...record,
			to: deliveryTarget.to
		};
		return sourceDeliveryTargetsMatch(sourceTarget, deliveryTarget);
	});
	if (options?.requireFinalReply) return (hasCommittedSourceReplyDeliveryEvidence(result) || hasMessagingToolDeliveryEvidence(result) && sourceTargets.length > 0) && resolveExplicitFinalSourceReplyDeliveryEvidence({
		messagingToolSentTargets: sourceTargets,
		messagingToolSourceReplyPayloads: result.messagingToolSourceReplyPayloads
	}) !== false;
	if (hasCommittedSourceReplyDeliveryEvidence(result) || hasUnaccountedMessagingToolAggregateEvidence({
		...result,
		didSendViaMessagingTool: false
	})) return true;
	if (targets.length === 0 || !deliveryTarget.channel || !deliveryTarget.to) return hasMessagingToolDeliveryEvidence(result);
	return hasMessagingToolDeliveryEvidence(result) && sourceTargets.length > 0;
}
//#endregion
//#region src/agents/subagents/announce/subagent-announce-direct-response.ts
/** Interprets direct announcement responses and the existing text-fallback receipt. */
/** Reuses prepared facts; only the existing text-delivery owner may perform a send. */
function createDirectAnnounceResponseClassifier(context) {
	const { params, parentOnly, deliveryTarget, shouldDeliverAgentFinal, requiresMessageToolDelivery, isSubagentCompletion, hasSuccessfulTrustedSubagentNoOutputCompletion, hasRequiredSubagentNoOutputCompletion, subagentDirectMessageCompletionRequiresMessageTool, effectiveDirectOrigin, requesterSessionOrigin, textCompletionDirectDeliveryKind, tryTextCompletionDirectDelivery } = context;
	return (directAnnounceResponse) => {
		if (isGatewayAgentRunPending(directAnnounceResponse)) return parentOnly || params.sourceTool === "subagent_settle" ? {
			delivered: false,
			path: "direct",
			reason: "requester_turn_pending",
			disposition: "retryable"
		} : {
			delivered: true,
			path: "direct"
		};
		const directAnnounceResult = getGatewayAgentResult(directAnnounceResponse);
		const directAnnounceRecord = asOptionalRecord(directAnnounceResponse);
		if (parentOnly) return resolvePrivateCompletionDeliveryResult(directAnnounceRecord, params.requesterIsSubagent ? void 0 : effectiveDirectOrigin);
		const hasFinalMessagingToolDelivery = Boolean(directAnnounceResult && hasMessagingToolDeliveryToSource(directAnnounceResult, deliveryTarget, { requireFinalReply: true }));
		const hasMessagingToolDelivery = Boolean(directAnnounceResult && hasMessagingToolDeliveryToSource(directAnnounceResult, deliveryTarget));
		const requiresAutomaticFinalReceipt = shouldDeliverAgentFinal && (params.expectsCompletionMessage || params.requireVisibleReply);
		const automaticEvidence = getAutomaticDeliveryEvidence(directAnnounceResult ?? {});
		const directDeliveryFailure = (shouldDeliverAgentFinal || requiresMessageToolDelivery) && directAnnounceResult ? getAgentCommandDeliveryFailure(directAnnounceResult) : void 0;
		if (directDeliveryFailure && !(requiresAutomaticFinalReceipt ? hasFinalMessagingToolDelivery : hasMessagingToolDelivery)) return {
			delivered: false,
			path: "direct",
			error: directDeliveryFailure,
			...automaticEvidence.mayHaveSent ? { disposition: "ambiguous" } : {}
		};
		const hasVisibleNonSilentGatewayPayload = Boolean(directAnnounceResult && hasVisibleAgentPayload(directAnnounceResult, {
			includeErrorPayloads: false,
			includeReasoningPayloads: false,
			requireTerminalContent: true,
			includeSilentReplyPayloads: false
		}));
		const terminalDelivery = normalizeAgentRunTerminalDeliverySnapshot(directAnnounceResult?.deliveryStatus);
		const automaticFinalDelivered = terminalDelivery?.status === "sent" && terminalDelivery.resultCount > 0;
		if (requiresAutomaticFinalReceipt && !hasFinalMessagingToolDelivery && terminalDelivery?.status === "suppressed" && (automaticEvidence.mayHaveSent || automaticEvidence.suppressionReason !== "no_visible_payload")) return {
			delivered: false,
			path: "direct",
			reason: automaticEvidence.mayHaveSent ? void 0 : "delivery_suppressed",
			error: automaticEvidence.mayHaveSent ? "automatic completion delivery could not be confirmed" : automaticEvidence.suppressionReason ?? "automatic completion delivery suppressed",
			disposition: automaticEvidence.mayHaveSent ? "ambiguous" : "intentional_non_delivery",
			terminal: automaticEvidence.mayHaveSent ? void 0 : true
		};
		if (directAnnounceRecord?.status === "ok" && directAnnounceResult?.meta?.yielded === true && !directAnnounceResult.meta.error && !directAnnounceResult.meta.aborted && !automaticFinalDelivered) {
			if (directAnnounceResult.requesterContinuationSettled === true && !hasFinalMessagingToolDelivery && !hasVisibleNonSilentGatewayPayload) return {
				delivered: true,
				path: "direct"
			};
			if (isSubagentCompletion && params.expectsCompletionMessage && requiresMessageToolDelivery && !hasMessagingToolDelivery) return {
				delivered: false,
				path: "direct",
				reason: "completion_handoff_pending",
				disposition: "session_queued"
			};
		}
		const hasIntentionalSilentCompletionReply = Boolean(directAnnounceResult && hasIntentionalSilentAgentPayload(directAnnounceResult));
		const hasCompletionSideEffect = Boolean(directAnnounceResult && hasCommittedOutboundDeliveryEvidence(directAnnounceResult));
		const hasVisibleRequiredCompletionReply = hasMessagingToolDelivery || !requiresMessageToolDelivery && hasVisibleNonSilentGatewayPayload;
		const finishClassification = () => {
			if (hasSuccessfulTrustedSubagentNoOutputCompletion && !hasVisibleRequiredCompletionReply && hasCompletionSideEffect) return {
				delivered: false,
				path: "direct",
				reason: "visible_reply_missing",
				error: "completion agent did not produce a visible reply",
				disposition: "permanent_failure"
			};
			if (params.expectsCompletionMessage && requiresMessageToolDelivery && !hasMessagingToolDelivery && (!hasIntentionalSilentCompletionReply || subagentDirectMessageCompletionRequiresMessageTool || hasRequiredSubagentNoOutputCompletion)) {
				if (hasSuccessfulTrustedSubagentNoOutputCompletion) return {
					delivered: false,
					path: "direct",
					reason: "visible_reply_missing",
					error: "completion agent did not produce a visible reply"
				};
				const missingDelivery = {
					delivered: false,
					path: "direct",
					reason: "message_tool_delivery_missing",
					error: "completion agent did not use the message tool for message-tool-only delivery",
					disposition: "permanent_failure"
				};
				return subagentDirectMessageCompletionRequiresMessageTool ? tryTextCompletionDirectDelivery(textCompletionDirectDeliveryKind).then((textDelivery) => textDelivery ?? missingDelivery) : missingDelivery;
			}
			const hasRequesterVisibleFinalDelivery = hasFinalMessagingToolDelivery || shouldDeliverAgentFinal && automaticFinalDelivered;
			const hasVisibleCompletionReply = hasRequesterVisibleFinalDelivery || !shouldDeliverAgentFinal && !params.requireVisibleReply && hasMessagingToolDelivery || !requiresMessageToolDelivery && hasVisibleNonSilentGatewayPayload && directAnnounceResult?.deliveryStatus?.status !== "suppressed" && (params.requesterIsSubagent || [effectiveDirectOrigin, requesterSessionOrigin].every((origin) => origin?.channel ? normalizeMessageChannel(origin.channel) === "webchat" : !origin?.to));
			const acceptsIntentionalSilentCompletion = hasIntentionalSilentCompletionReply && !isSubagentCompletion;
			if (!hasVisibleCompletionReply && (params.requireVisibleReply || params.expectsCompletionMessage && (shouldDeliverAgentFinal || !requiresMessageToolDelivery && !hasCompletionSideEffect && !acceptsIntentionalSilentCompletion))) return {
				delivered: false,
				path: "direct",
				reason: "visible_reply_missing",
				error: "completion agent did not produce a visible reply"
			};
			return buildRequesterCompletionDeliveryResult(!params.requesterIsSubagent && (hasRequesterVisibleFinalDelivery || !params.expectsCompletionMessage && directAnnounceRecord?.status === "ok" && hasVisibleNonSilentGatewayPayload && hasVisibleCompletionReply), directAnnounceResult?.meta?.finalAssistantVisibleText);
		};
		if (params.expectsCompletionMessage && shouldDeliverAgentFinal && isSubagentCompletion && !hasVisibleNonSilentGatewayPayload && !hasMessagingToolDelivery) return tryTextCompletionDirectDelivery(textCompletionDirectDeliveryKind).then((textDelivery) => {
			if (textDelivery) return textDelivery;
			if (hasSuccessfulTrustedSubagentNoOutputCompletion && !hasCompletionSideEffect) return {
				delivered: false,
				path: "direct",
				reason: "visible_reply_missing",
				error: "completion agent did not produce a visible reply"
			};
			return finishClassification();
		});
		return finishClassification();
	};
}
//#endregion
//#region src/agents/subagents/announce/subagent-announce-direct-delivery.ts
/**
* Requester-agent handoff and direct delivery for subagent announcements.
*/
async function sendSubagentAnnounceDirectly(params) {
	if (params.signal?.aborted) return {
		delivered: false,
		path: "none"
	};
	const parentOnly = params.completionTarget === "parent";
	const cfg = getSubagentAnnounceRuntimeConfig();
	const announceTimeoutMs = resolveSubagentAnnounceTimeoutMs(cfg);
	const canonicalRequesterSessionKey = resolveRequesterStoreKey(cfg, params.targetRequesterSessionKey, params.requesterAgentId);
	try {
		const { directOrigin, requesterSessionOrigin, effectiveDirectOrigin } = resolveCompletionDeliveryOrigins(params);
		const sessionOnlyOrigin = effectiveDirectOrigin?.channel ? effectiveDirectOrigin : requesterSessionOrigin;
		const requester = loadRequesterSessionEntry(params.targetRequesterSessionKey, params.requesterAgentId);
		const requesterEntry = requester.entry;
		const requesterCanonicalKey = requester.canonicalKey;
		const requesterAgentId = requester.agentId;
		const requesterStorePath = requester.storePath;
		const requesterSessionId = requesterEntry?.sessionId;
		const requesterLifecycleRevision = requesterEntry?.lifecycleRevision;
		const deliveryTarget = !parentOnly && !params.requesterIsSubagent ? resolveExternalBestEffortDeliveryTarget({
			channel: effectiveDirectOrigin?.channel,
			to: effectiveDirectOrigin?.to,
			accountId: effectiveDirectOrigin?.accountId,
			threadId: effectiveDirectOrigin?.threadId
		}) : { deliver: false };
		const normalizedSessionOnlyOriginChannel = !params.requesterIsSubagent ? normalizeMessageChannel(sessionOnlyOrigin?.channel) : void 0;
		const sessionOnlyOriginChannel = normalizedSessionOnlyOriginChannel && isGatewayMessageChannel(normalizedSessionOnlyOriginChannel) ? normalizedSessionOnlyOriginChannel : void 0;
		const sourceToolId = normalizeOptionalLowercaseString(params.sourceTool) ?? (params.expectsCompletionMessage ? "subagent_announce" : "");
		const isSubagentCompletion = sourceToolId === "subagent_announce";
		const subagentCompletionEvents = params.internalEvents?.filter((event) => event.type === "task_completion" && event.source === "subagent");
		const trustedCompletionEvent = subagentCompletionEvents?.length === 1 && subagentCompletionEvents[0]?.childSessionKey === params.sourceSessionKey ? subagentCompletionEvents[0] : void 0;
		const hasFailedTrustedSubagentCompletion = trustedCompletionEvent !== void 0 && trustedCompletionEvent.status !== "ok";
		const hasRequiredSubagentNoOutputCompletion = params.expectsCompletionMessage && isSubagentCompletion && (trustedCompletionEvent !== void 0 && !hasVisibleCompletionResult(trustedCompletionEvent) || hasFailedSubagentNoOutputCompletion(params.internalEvents));
		const hasSuccessfulTrustedSubagentNoOutputCompletion = hasRequiredSubagentNoOutputCompletion && trustedCompletionEvent?.status === "ok";
		const textCompletionDirectDeliveryKind = hasFailedTrustedSubagentCompletion ? "failed_notice" : "completed_result";
		const agentMediatedCompletion = params.expectsCompletionMessage && isAgentMediatedCompletionSourceTool(sourceToolId);
		const completionRouteRequiresMessageToolDelivery = !parentOnly && params.expectsCompletionMessage && completionRequiresMessageToolDelivery({
			cfg,
			requesterSessionKey: params.requesterSessionKey,
			targetRequesterSessionKey: canonicalRequesterSessionKey,
			requesterEntry,
			directOrigin: effectiveDirectOrigin,
			requesterSessionOrigin
		});
		const subagentDirectMessageCompletionRequiresMessageTool = params.expectsCompletionMessage && isSubagentCompletion && deliveryTarget.deliver && isDirectMessageDeliveryTarget(deliveryTarget, canonicalRequesterSessionKey);
		const requiresMessageToolDelivery = completionRouteRequiresMessageToolDelivery || subagentDirectMessageCompletionRequiresMessageTool;
		const requesterActivity = resolveRequesterSessionActivity(params.targetRequesterSessionKey, params.requesterAgentId);
		if (parentOnly && (!params.completionRequesterSessionId || requesterActivity.sessionId !== params.completionRequesterSessionId)) return {
			delivered: false,
			path: "none",
			reason: "completion_handoff_unavailable",
			error: "private completion requester session is unavailable or replaced",
			terminal: true,
			disposition: "intentional_non_delivery"
		};
		const requesterAbandonment = params.expectsCompletionMessage ? resolveSubagentRequesterSessionAbandonment(canonicalRequesterSessionKey, requesterActivity.sessionId) : void 0;
		if (requesterAbandonment === "timeout") return {
			delivered: false,
			path: "none",
			reason: "requester_abandoned",
			error: "requester session abandoned after timeout"
		};
		if (requesterAbandonment === "recovering_timeout") return {
			delivered: false,
			path: "none",
			reason: "completion_handoff_pending",
			error: "requester timeout recovery is still settling",
			disposition: "retryable"
		};
		const isCompletionDeliveryAllowed = () => params.isSourceSessionEffectsAllowed?.() !== false && !(params.expectsCompletionMessage && params.isCompletionOwnedByRequesterYield?.());
		const isCompletionAdmissionAllowed = () => isCompletionDeliveryAllowed() && params.isSourceSessionAdmissionAllowed?.() !== false;
		if (!isCompletionAdmissionAllowed()) return {
			delivered: false,
			path: "none",
			reason: "completion_handoff_pending",
			terminal: true,
			disposition: "intentional_non_delivery"
		};
		const recovery = !parentOnly && sourceToolId === "subagent_settle" ? resolveRequesterRecoveryDelivery(requesterEntry, params.directIdempotencyKey) : void 0;
		if (recovery?.kind === "delivery") return recovery.delivery;
		const recoveredResult = recovery?.result;
		const tryTextCompletionDirectDelivery = (contentKind = "completed_result") => deliverCompletionDirect({
			cfg,
			requesterSessionKey: canonicalRequesterSessionKey,
			requesterAgentId: params.requesterAgentId,
			directIdempotencyKey: params.directIdempotencyKey,
			deliveryTarget,
			internalEvents: params.internalEvents,
			contentKind,
			signal: params.signal,
			onDeliveryResult: params.onDeliveryResult,
			isSourceSessionEffectsAllowed: isCompletionDeliveryAllowed
		});
		const completionSourceReplyDeliveryMode = parentOnly ? "automatic" : requiresMessageToolDelivery ? "message_tool_only" : params.requireVisibleReply && deliveryTarget.deliver ? "automatic" : void 0;
		const shouldDeliverAgentFinal = deliveryTarget.deliver && !requiresMessageToolDelivery;
		const requesterQueueSettings = resolveQueueSettings({
			cfg,
			channel: sessionDeliveryChannel(requesterEntry) ?? requesterSessionOrigin?.channel ?? directOrigin?.channel,
			sessionEntry: requesterEntry
		});
		if (!parentOnly && params.expectsCompletionMessage && requesterActivity.sessionId && requesterActivity.isActive) {
			const wakeOptions = {
				deliveryTimeoutMs: announceTimeoutMs,
				steeringMode: "all",
				...completionSourceReplyDeliveryMode ? { sourceReplyDeliveryMode: completionSourceReplyDeliveryMode } : {},
				...requesterQueueSettings.debounceMs !== void 0 ? { debounceMs: requesterQueueSettings.debounceMs } : {},
				waitForTranscriptCommit: true,
				...params.createUserTurnTranscriptRecorder ? { userTurnTranscriptRecorder: params.createUserTurnTranscriptRecorder(requesterActivity.sessionId) } : {}
			};
			const wakeOutcome = await resolveActiveWakeWithRetries(requesterActivity.sessionId, params.triggerMessage, wakeOptions, params.signal, isCompletionDeliveryAllowed, params.isSourceSessionAdmissionAllowed);
			if (isSourceOwnerChangedWake(wakeOutcome)) return sourceOwnerChangedResult();
			if (wakeOutcome.queued) return {
				delivered: true,
				deliveredAt: wakeOutcome.deliveredAtMs,
				enqueuedAt: wakeOutcome.enqueuedAtMs,
				path: "steered"
			};
			defaultRuntime.log(`[warn] Active requester session could not be woken for subagent completion; falling back to requester-agent handoff: ${formatActiveWakeFailure("active requester session could not be woken", wakeOutcome)}`);
		}
		if (params.expectsCompletionMessage && isCronRunSessionKey(canonicalRequesterSessionKey) && !resolveRequesterSessionActivity(params.targetRequesterSessionKey, params.requesterAgentId).isActive && !agentMediatedCompletion) return {
			delivered: false,
			path: "none",
			reason: "completion_handoff_pending",
			terminal: true,
			disposition: "intentional_non_delivery"
		};
		if (params.signal?.aborted) return {
			delivered: false,
			path: "none"
		};
		const directAgentOrigin = shouldDeliverAgentFinal ? deliveryTarget : sessionOnlyOriginChannel ? sessionOnlyOrigin : void 0;
		const directAgentParams = {
			...parentOnly ? { expectedExistingSessionId: params.completionRequesterSessionId } : {},
			sessionKey: canonicalRequesterSessionKey,
			timeout: params.requesterRunTimeoutSeconds,
			message: params.triggerMessage,
			deliver: shouldDeliverAgentFinal,
			bestEffortDeliver: params.bestEffortDeliver,
			internalEvents: params.internalEvents,
			channel: shouldDeliverAgentFinal ? deliveryTarget.channel : sessionOnlyOriginChannel,
			accountId: directAgentOrigin?.accountId,
			to: directAgentOrigin?.to,
			threadId: stringifyRouteThreadId(directAgentOrigin?.threadId),
			inputProvenance: {
				kind: "inter_session",
				sourceSessionKey: params.sourceSessionKey,
				sourceChannel: INTERNAL_PROVENANCE_SOURCE_CHANNEL,
				sourceTool: params.sourceTool ?? "subagent_announce"
			},
			...completionSourceReplyDeliveryMode ? { sourceReplyDeliveryMode: completionSourceReplyDeliveryMode } : {},
			idempotencyKey: params.directIdempotencyKey
		};
		const classifyResponse = createDirectAnnounceResponseClassifier({
			params,
			parentOnly,
			deliveryTarget,
			shouldDeliverAgentFinal,
			requiresMessageToolDelivery,
			isSubagentCompletion,
			hasSuccessfulTrustedSubagentNoOutputCompletion,
			hasRequiredSubagentNoOutputCompletion,
			subagentDirectMessageCompletionRequiresMessageTool,
			effectiveDirectOrigin,
			requesterSessionOrigin,
			textCompletionDirectDeliveryKind,
			tryTextCompletionDirectDelivery
		});
		let directAnnounceResponse;
		let directFailure;
		try {
			directAnnounceResponse = recoveredResult ? {
				status: "ok",
				result: recoveredResult
			} : await runAnnounceDeliveryWithRetry({
				operation: params.expectsCompletionMessage ? "completion direct announce agent call" : "direct announce agent call",
				signal: params.signal,
				isAttemptAllowed: isCompletionAdmissionAllowed,
				run: async () => {
					if (!isCompletionAdmissionAllowed()) throw new SourceOwnerChangedError();
					return await runAnnounceAgentCall({
						agentParams: directAgentParams,
						settleWakeSourceSessionKeys: params.settleWakeSourceSessionKeys,
						...parentOnly ? { privateCompletion: true } : {},
						delegatedToolPolicyHandoff: isSubagentCompletion && trustedCompletionEvent && params.sourceSessionKey && requesterActivity.sessionId && params.isSourceSessionEffectsAllowed?.() !== false ? {
							sourceSessionKey: params.sourceSessionKey,
							...trustedCompletionEvent.childSessionId ? { sourceSessionId: trustedCompletionEvent.childSessionId } : {},
							targetSessionKey: canonicalRequesterSessionKey,
							targetSessionId: requesterActivity.sessionId,
							idempotencyKey: params.directIdempotencyKey
						} : void 0,
						expectFinal: true,
						signal: params.signal,
						timeoutMs: parentOnly && isSubagentCompletion ? void 0 : announceTimeoutMs,
						isExecutionAllowed: isCompletionDeliveryAllowed,
						isSourceSessionAdmissionAllowed: params.isSourceSessionAdmissionAllowed && isCompletionAdmissionAllowed,
						resolveGatewayContext: params.resolveGatewayContext
					});
				}
			});
			if (!isCompletionDeliveryAllowed()) return sourceOwnerChangedResult();
		} catch (err) {
			if (err instanceof SourceOwnerChangedError) return sourceOwnerChangedResult();
			if (hasAnnounceSendEvidence(err)) throw err;
			if (params.signal?.aborted) return {
				delivered: false,
				path: "none"
			};
			const directCompletionFallbackKind = hasFailedTrustedSubagentCompletion ? "failed_notice" : isIncompleteAnnounceAgentResultError(err) ? "completed_result" : void 0;
			if (params.expectsCompletionMessage && (shouldDeliverAgentFinal || subagentDirectMessageCompletionRequiresMessageTool) && isSubagentCompletion && directCompletionFallbackKind) {
				const textDelivery = await tryTextCompletionDirectDelivery(directCompletionFallbackKind);
				if (textDelivery) return textDelivery;
			}
			directFailure = {
				delivered: false,
				path: "direct",
				error: summarizeDeliveryError(err),
				disposition: isPermanentAnnounceDeliveryError(err) ? "permanent_failure" : "retryable"
			};
		}
		const classified = directFailure ?? classifyResponse(directAnnounceResponse);
		const delivery = classified instanceof Promise ? await classified : classified;
		const originalOutcome = buildAgentRunTerminalOutcomeFromWaitResult(asOptionalRecord(directAnnounceResponse));
		if (parentOnly || sourceToolId !== "subagent_settle" || recoveredResult !== void 0 || requesterCanonicalKey !== canonicalRequesterSessionKey || !requesterAgentId || !requesterStorePath || !requesterSessionId || !params.isSourceSessionEffectsAllowed || isIncognitoSessionKey(canonicalRequesterSessionKey) || isIncognitoOpenClawAgentSqlitePath(requesterStorePath, { agentId: requesterAgentId }) || originalOutcome && classifyAgentRunTerminalOutcome(originalOutcome) === "cancellation" && originalOutcome.stopReason !== "restart" || delivery.delivered || delivery.terminal || delivery.disposition !== void 0 && delivery.disposition !== "retryable") return delivery;
		if (params.signal?.aborted) return {
			delivered: false,
			path: "none"
		};
		if (!isCompletionDeliveryAllowed()) return sourceOwnerChangedResult();
		let current;
		try {
			current = await readSessionEntriesFromStoreInWorker({
				agentId: requesterAgentId,
				storePath: requesterStorePath,
				sessionKeys: [canonicalRequesterSessionKey]
			});
		} catch (error) {
			if (params.signal?.aborted) return {
				delivered: false,
				path: "none"
			};
			if (!isCompletionDeliveryAllowed()) return sourceOwnerChangedResult();
			defaultRuntime.log(`[warn] Requester recovery receipt could not be read: ${summarizeDeliveryError(error)}`);
			return delivery;
		}
		if (params.signal?.aborted) return {
			delivered: false,
			path: "none"
		};
		if (!isCompletionDeliveryAllowed()) return sourceOwnerChangedResult();
		const currentEntry = current.entries.find(({ sessionKey }) => sessionKey === canonicalRequesterSessionKey)?.entry;
		if (currentEntry?.sessionId !== requesterSessionId || currentEntry?.lifecycleRevision !== requesterLifecycleRevision) return delivery;
		const settledRecovery = resolveRequesterRecoveryDelivery(currentEntry, params.directIdempotencyKey);
		if (!settledRecovery) return delivery;
		return settledRecovery.kind === "delivery" ? settledRecovery.delivery : classifyResponse({
			status: "ok",
			result: settledRecovery.result
		});
	} catch (err) {
		const disposition = hasAnnounceSendEvidence(err) ? "ambiguous" : isPermanentAnnounceDeliveryError(err) ? "permanent_failure" : "retryable";
		return {
			delivered: false,
			path: "direct",
			error: summarizeDeliveryError(err),
			disposition
		};
	}
}
//#endregion
//#region src/agents/subagents/announce/subagent-announce-dispatch.ts
/** Converts a steer outcome into the shared delivery result shape. */
function mapSteerOutcomeToDeliveryResult(outcome) {
	if (outcome.status === "steered") return {
		delivered: true,
		path: "steered",
		deliveredAt: outcome.deliveredAt,
		enqueuedAt: outcome.enqueuedAt
	};
	if (outcome.status === "source_owner_changed") return {
		delivered: false,
		path: "none",
		reason: "source_owner_changed",
		error: "subagent source lifecycle changed before completion delivery",
		terminal: true,
		disposition: "intentional_non_delivery"
	};
	return {
		delivered: false,
		path: "none",
		...outcome.status === "dropped" ? { reason: "steer_dropped" } : {}
	};
}
/** Runs the ordered steer/direct announcement delivery strategy. */
async function runSubagentAnnounceDispatch(params) {
	const phases = [];
	const appendPhase = (phase, result) => {
		phases.push({
			phase,
			delivered: result.delivered,
			path: result.path,
			deliveredAt: result.deliveredAt,
			enqueuedAt: result.enqueuedAt,
			...result.reason ? { reason: result.reason } : {},
			error: result.error
		});
	};
	const withPhases = (result) => ({
		...result,
		phases
	});
	if (params.signal?.aborted) return withPhases({
		delivered: false,
		path: "none"
	});
	const allowSteerFallback = !params.requireDirectDelivery && params.expectsCompletionMessage;
	if (!params.requireDirectDelivery && !params.expectsCompletionMessage) {
		const primarySteerOutcome = await params.steer();
		const primarySteer = mapSteerOutcomeToDeliveryResult(primarySteerOutcome);
		appendPhase("steer-primary", primarySteer);
		if (primarySteer.delivered || primarySteer.terminal || primarySteerOutcome.status === "dropped") return withPhases(primarySteer);
	}
	const primaryDirect = await params.direct();
	appendPhase("direct-primary", primaryDirect);
	if (!allowSteerFallback || primaryDirect.delivered || primaryDirect.reason === "requester_turn_pending" || primaryDirect.disposition === "session_queued" || primaryDirect.disposition === "intentional_non_delivery" || primaryDirect.disposition === "ambiguous" || primaryDirect.disposition === "permanent_failure") return withPhases(primaryDirect);
	if (params.signal?.aborted) return withPhases(primaryDirect);
	const fallbackSteer = mapSteerOutcomeToDeliveryResult(await params.steer());
	appendPhase("steer-fallback", fallbackSteer);
	if (fallbackSteer.delivered || fallbackSteer.terminal) return withPhases(fallbackSteer);
	return withPhases(primaryDirect);
}
//#endregion
//#region src/agents/subagents/announce/subagent-announce-delivery.ts
/**
* Subagent completion announcement delivery.
*
* Routes completion payloads through gateway/channel/session paths and records delivery evidence.
*/
function isInternalAnnounceRequesterSession(sessionKey) {
	return getSubagentDepthFromSessionStore(sessionKey) >= 1 || isCronSessionKey(sessionKey);
}
function collectExpectedMediaFromInternalEvents(events) {
	const { mediaUrls: expectedMediaUrls, attachments } = collectAgentInternalEventMedia(events);
	const expectedMediaAttachments = Object.fromEntries(expectedMediaUrls.map((mediaUrl, index) => [mediaUrl, attachments[index] ?? {}]));
	return {
		expectedMediaUrls,
		...expectedMediaUrls.length > 0 ? { expectedMediaAttachments } : {}
	};
}
function createCompletionUserTurnTranscriptRecorderFactory(params) {
	const provenance = {
		kind: "inter_session",
		...params.sourceSessionKey ? { sourceSessionKey: params.sourceSessionKey } : {},
		sourceChannel: INTERNAL_PROVENANCE_SOURCE_CHANNEL,
		sourceTool: params.sourceTool ?? "subagent_announce"
	};
	const recorders = /* @__PURE__ */ new Map();
	return (sessionId) => {
		const existing = recorders.get(sessionId);
		if (existing) return existing;
		const recorder = createUserTurnTranscriptRecorder({
			input: {
				text: params.triggerMessage,
				idempotencyKey: `${params.directIdempotencyKey}:active-wake`,
				provenance
			},
			target: () => {
				const loaded = loadRequesterSessionEntry(params.targetRequesterSessionKey, params.requesterAgentId);
				if (!loaded.entry || loaded.entry.sessionId?.trim() !== sessionId || !loaded.agentId) return;
				return {
					sessionId,
					expectedSessionId: sessionId,
					sessionKey: loaded.canonicalKey,
					sessionEntry: loaded.entry,
					...loaded.storePath ? { storePath: loaded.storePath } : {},
					agentId: loaded.agentId,
					config: loaded.cfg
				};
			},
			errorContext: "active requester completion transcript"
		});
		recorders.set(sessionId, recorder);
		return recorder;
	};
}
async function deliverSubagentAnnouncement(params) {
	const sourceOwnerChanged = () => params.isSourceSessionEffectsAllowed?.() === false || params.isSourceSessionAdmissionAllowed?.() === false;
	if (sourceOwnerChanged()) return sourceOwnerChangedResult();
	const durableGeneratedMediaHandoff = params.expectsCompletionMessage && isAgentMediatedCompletionSourceTool(params.sourceTool) && hasGeneratedMediaCompletionEvent(params.internalEvents);
	let durableQueue;
	if (durableGeneratedMediaHandoff) try {
		const cfg = getSubagentAnnounceRuntimeConfig();
		const canonicalSessionKey = resolveRequesterStoreKey(cfg, params.targetRequesterSessionKey, params.requesterAgentId);
		const queuedRoute = resolveGeneratedMediaSessionDeliveryRoute({
			sessionKey: canonicalSessionKey,
			completionDirectOrigin: params.completionDirectOrigin,
			directOrigin: params.directOrigin,
			requesterSessionOrigin: params.requesterSessionOrigin
		});
		const { requesterSessionOrigin, effectiveDirectOrigin } = resolveCompletionDeliveryOrigins({
			expectsCompletionMessage: params.expectsCompletionMessage,
			completionDirectOrigin: params.completionDirectOrigin,
			directOrigin: params.directOrigin,
			requesterSessionOrigin: params.requesterSessionOrigin
		});
		const requesterEntry = loadRequesterSessionEntry(params.targetRequesterSessionKey, params.requesterAgentId).entry;
		const sourceReplyDeliveryMode = queuedRoute.route.channel === "webchat" ? "automatic" : completionRequiresMessageToolDelivery({
			cfg,
			requesterSessionKey: params.requesterSessionKey,
			targetRequesterSessionKey: canonicalSessionKey,
			requesterEntry,
			directOrigin: effectiveDirectOrigin,
			requesterSessionOrigin
		}) ? "message_tool_only" : "automatic";
		const expectedMedia = collectExpectedMediaFromInternalEvents(params.internalEvents);
		const queuePayload = {
			kind: "agentTurn",
			sessionKey: canonicalSessionKey,
			message: formatAgentInternalEventsForPrompt(params.internalEvents) || params.triggerMessage,
			messageId: `${params.directIdempotencyKey}:agent-loop`,
			route: queuedRoute.route,
			...queuedRoute.deliveryContext ? { deliveryContext: queuedRoute.deliveryContext } : {},
			inputProvenance: {
				kind: "inter_session",
				...params.sourceSessionKey ? { sourceSessionKey: params.sourceSessionKey } : {},
				sourceChannel: INTERNAL_PROVENANCE_SOURCE_CHANNEL,
				sourceTool: params.sourceTool ?? "subagent_announce"
			},
			sourceReplyDeliveryMode,
			...expectedMedia,
			idempotencyKey: `${params.directIdempotencyKey}:agent-loop`
		};
		const queueContext = captureOpenClawStateWorkerContext();
		const queued = params.sourceRunId ? admitCorrelatedSubagentSessionDelivery({
			runId: params.sourceRunId,
			payload: queuePayload
		}) : await enqueueClaimedSessionDelivery(queuePayload, resolveSubagentAnnounceTimeoutMs(cfg), queueContext);
		if (queued.status === "failed") return {
			delivered: false,
			path: "queued",
			reason: "completion_handoff_unavailable",
			error: "generated media session handoff was already dead-lettered",
			disposition: "permanent_failure"
		};
		if (queued.status === "completed") return {
			delivered: true,
			path: "queued",
			disposition: "delivered"
		};
		durableQueue = {
			id: queued.id,
			claimed: queued.claimed,
			context: queueContext
		};
	} catch (error) {
		defaultRuntime.log(`[warn] Generated media session handoff could not be persisted; refusing ambiguous fallback: ${summarizeDeliveryError(error)}`);
		return {
			delivered: false,
			path: "queued",
			reason: "completion_handoff_unavailable",
			error: "generated media session handoff could not be persisted",
			disposition: "retryable"
		};
	}
	if (durableQueue) {
		if (durableQueue.claimed) await releaseSessionDeliveryClaim(durableQueue.id, durableQueue.context).catch((error) => {
			defaultRuntime.log(`[warn] Generated media session handoff lease release failed; durable recovery remains pending: ${summarizeDeliveryError(error)}`);
		});
		await scheduleSessionDelivery(durableQueue.id, durableQueue.context).catch((error) => {
			defaultRuntime.log(`[warn] Generated media session handoff retry scheduling failed; durable recovery remains pending: ${summarizeDeliveryError(error)}`);
		});
		return {
			delivered: false,
			path: "queued",
			disposition: "session_queued"
		};
	}
	const createCompletionUserTurnTranscriptRecorder = params.expectsCompletionMessage ? createCompletionUserTurnTranscriptRecorderFactory(params) : void 0;
	const delivery = await runSubagentAnnounceDispatch({
		expectsCompletionMessage: params.expectsCompletionMessage,
		requireDirectDelivery: params.requireDirectDelivery || params.completionTarget === "parent",
		signal: params.signal,
		steer: async () => {
			if (sourceOwnerChanged()) return { status: "source_owner_changed" };
			return await maybeSteerSubagentAnnounce({
				deliveryTimeoutMs: resolveSubagentAnnounceTimeoutMs(getSubagentAnnounceRuntimeConfig()),
				requesterSessionKey: params.requesterSessionKey,
				requesterAgentId: params.requesterAgentId,
				steerMessage: params.steerMessage,
				createUserTurnTranscriptRecorder: createCompletionUserTurnTranscriptRecorder,
				signal: params.signal,
				isSourceSessionEffectsAllowed: params.isSourceSessionEffectsAllowed,
				isSourceSessionAdmissionAllowed: params.isSourceSessionAdmissionAllowed
			});
		},
		direct: async () => {
			if (sourceOwnerChanged()) return sourceOwnerChangedResult();
			return await sendSubagentAnnounceDirectly({
				requesterSessionKey: params.requesterSessionKey,
				requesterAgentId: params.requesterAgentId,
				requesterRunTimeoutSeconds: params.requesterRunTimeoutSeconds,
				targetRequesterSessionKey: params.targetRequesterSessionKey,
				triggerMessage: params.triggerMessage,
				internalEvents: params.internalEvents,
				directIdempotencyKey: params.directIdempotencyKey,
				completionDirectOrigin: params.completionDirectOrigin,
				directOrigin: params.directOrigin,
				requesterSessionOrigin: params.requesterSessionOrigin,
				sourceSessionKey: params.sourceSessionKey,
				sourceTool: params.sourceTool,
				settleWakeSourceSessionKeys: params.settleWakeSourceSessionKeys,
				isSourceSessionEffectsAllowed: params.isSourceSessionEffectsAllowed,
				isSourceSessionAdmissionAllowed: params.isSourceSessionAdmissionAllowed,
				isCompletionOwnedByRequesterYield: params.isCompletionOwnedByRequesterYield,
				requesterIsSubagent: params.requesterIsSubagent,
				completionTarget: params.completionTarget,
				completionRequesterSessionId: params.completionRequesterSessionId,
				expectsCompletionMessage: params.expectsCompletionMessage,
				createUserTurnTranscriptRecorder: createCompletionUserTurnTranscriptRecorder,
				requireVisibleReply: params.requireVisibleReply,
				onDeliveryResult: params.onDeliveryResult,
				signal: params.signal,
				bestEffortDeliver: params.bestEffortDeliver,
				resolveGatewayContext: params.resolveGatewayContext
			});
		}
	});
	const failedDirect = params.expectsCompletionMessage || params.sourceTool === "subagent_announce" ? delivery.phases?.find((phase) => phase.phase === "direct-primary" && !phase.delivered && phase.path === "direct") : void 0;
	if (failedDirect?.error) {
		const source = params.sourceRunId ? `run ${params.sourceRunId}` : `session ${params.sourceSessionKey ?? params.requesterSessionKey}`;
		defaultRuntime.log(`[warn] Subagent completion direct announce failed for ${source}: ${failedDirect.error}${delivery.delivered ? "; recovered via steered" : ""}`);
	}
	return delivery;
}
//#endregion
export { loadRequesterSessionEntry as a, runAnnounceDeliveryWithRetry as c, resolveSubagentCompletionOrigin as i, isInternalAnnounceRequesterSession as n, loadSessionEntryByKey as o, resolveAnnounceOrigin as r, resolveSubagentAnnounceTimeoutMs as s, deliverSubagentAnnouncement as t };
