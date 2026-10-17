import { c as normalizeOptionalLowercaseString } from "./string-coerce-1VuiLaaR.mjs";
import { t as isFastTestRuntimeEnv } from "./test-runtime-env-mVzBKwSd.mjs";
import "./env-BBJTTIuE.mjs";
import { a as asOptionalRecord } from "./record-coerce-TIsquoVR.mjs";
import { r as defaultRuntime } from "./runtime-DlO3PTAd.mjs";
import { r as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-DRG_I6tz.mjs";
import { r as isIncognitoSessionKey } from "./session-key-CmZ4o9-l.mjs";
import { S as isCronSessionKey, x as isCronRunSessionKey } from "./session-key-C09ow4h0.mjs";
import { i as isIncognitoOpenClawAgentSqlitePath } from "./openclaw-agent-db.paths-DVbbFaej.mjs";
import { r as getRuntimeConfig } from "./io.runtime-BSum32pK.mjs";
import "./message-channel-constants-B3vfipkP.mjs";
import { n as normalizeMessageChannel } from "./message-channel-core-CqBAHB04.mjs";
import { n as isGatewayMessageChannel } from "./message-channel-normalize-DeTO1ikE.mjs";
import "./message-channel-j-k-Nup3.mjs";
import { a as RUNTIME_EVENT_USER_PROMPT, u as projectRuntimeContextFragments } from "./internal-runtime-context-CAWYwg4i.mjs";
import { f as stringifyRouteThreadId } from "./channel-route-BIxMkFzo.mjs";
import { n as sessionDeliveryChannel } from "./delivery-context.read-CR06zOJ4.mjs";
import { i as classifyAgentRunTerminalOutcome } from "./agent-run-terminal-outcome-Ccvy5spR.mjs";
import { l as isAgentMediatedCompletionSourceTool, t as INTERNAL_PROVENANCE_SOURCE_CHANNEL } from "./input-provenance-D1LHo5Qj.mjs";
import { Q as normalizeAgentRunTerminalReplySnapshot } from "./subagent-registry.store.sqlite-DIYyRjhZ.mjs";
import { i as readSessionEntriesFromStoreInWorker } from "./session-entry-read-runtime-B3Aup1sL.mjs";
import { A as resolveEmbeddedRunAbandonment, S as queueGuardedEmbeddedAgentMessageWithOutcomeAsync, o as formatEmbeddedAgentQueueFailureSummary, x as queueEmbeddedAgentMessageWithOutcomeAsync } from "./runs-CzCPh-gu.mjs";
import { c as getSubagentDepthFromSessionStore } from "./subagent-capabilities-wl-IV_LE.mjs";
import { a as buildAgentRunTerminalOutcomeFromWaitResult } from "./agent-run-terminal-outcome-BTCs8JFs.mjs";
import { t as createUserTurnTranscriptRecorder } from "./user-turn-transcript-BMox_Fvt.mjs";
import { i as hasVisibleCompletionResult, n as hasFailedSubagentNoOutputCompletion, r as hasGeneratedMediaCompletionEvent } from "./internal-event-contract-pF6FHp8g.mjs";
import { o as resolveExactSubagentCompletionEvent, r as resolveRequesterStoreKey } from "./requester-tool-policy-DIo-5B5v.mjs";
import { t as bindInProcessSessionRun } from "./in-process-session-run-DJj6aWRy.mjs";
import { i as SessionDeliveryDeadLetteredError } from "./session-delivery-queue.records-E9Zh5OLd.mjs";
import { i as enqueueClaimedSessionDelivery, p as releaseSessionDeliveryClaim } from "./session-delivery-queue-storage-CchO1Prq.mjs";
import { S as scheduleSessionDelivery } from "./subagent-registry-helpers-BFDhUyy1.mjs";
import { t as resolveQueueSettings } from "./queue-DJQGr33w.mjs";
import { t as resolveExternalBestEffortDeliveryTarget } from "./best-effort-delivery-CkLHXrp-.mjs";
import { n as loadRequesterSessionEntry, t as getSubagentRequesterSessionActivity } from "./subagent-announce-delivery.runtime.js";
import { a as hasVisibleAgentPayload, i as hasIntentionalSilentAgentPayload } from "./message-visibility-D9way_Lv.mjs";
import { o as resolveAcpPromptBody, r as collectAgentInternalEventMedia, t as buildAgentInternalEventContext } from "./internal-events-BZWbNO1Z.mjs";
import { a as isGatewayAgentRunPending, c as runAnnounceAgentCall, f as resolveCompletionDeliveryOrigins, i as isDirectMessageDeliveryTarget, l as runSubagentAnnounceDispatch, n as deliverCompletionDirect, o as resolvePrivateCompletionDeliveryResult, p as resolveGeneratedMediaSessionDeliveryRoute, r as hasMessagingToolDeliveryToSource, s as resolveRequesterRecoveryDelivery, t as buildRequesterCompletionDeliveryResult, u as sourceOwnerChangedResult } from "./subagent-announce-completion-delivery-CW6K0Kgi.mjs";
import { i as completionRequiresMessageToolDelivery, t as admitCorrelatedSubagentSessionDelivery } from "./subagent-completion-delivery-Dk2SjwYV.mjs";
import { a as resolveSubagentAnnounceTimeoutMs, c as waitForAnnounceRetryDelay, i as isPermanentAnnounceDeliveryError, n as hasAnnounceSendEvidence, o as runAnnounceDeliveryWithRetry, r as isIncompleteAnnounceAgentResultError, s as summarizeDeliveryError, t as SourceOwnerChangedError } from "./subagent-announce-delivery-retry--vABXt7n.mjs";
import { a as getAgentCommandDeliveryFailure, l as hasCommittedOutboundDeliveryEvidence, o as getAutomaticDeliveryEvidence, s as getGatewayAgentResult } from "./delivery-evidence-BEVHUW11.mjs";
import { t as normalizeAgentRunTerminalDeliverySnapshot } from "./agent-run-terminal-delivery-CA3z25Fw.mjs";
//#region src/agents/subagents/announce/subagent-announce-active-wake.ts
const SOURCE_OWNER_CHANGED = Symbol("source_owner_changed");
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
		const result = canInject ? await queueGuardedEmbeddedAgentMessageWithOutcomeAsync(sessionId, message, options, canInject) : await queueEmbeddedAgentMessageWithOutcomeAsync(sessionId, message, options);
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
			const retryOptions = resolveRetryOptions();
			if (!retryOptions) break;
			outcome = await attemptWake(retryOptions);
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
	const requester = loadRequesterSessionEntry(params.requesterSessionKey, params.requesterAgentId);
	const { cfg, entry, canonicalKey } = requester;
	const { sessionId, isActive } = getSubagentRequesterSessionActivity(params.requesterSessionKey, requester);
	if (resolveEmbeddedRunAbandonment({
		sessionKey: canonicalKey,
		sessionId
	})) return { status: "none" };
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
		...params.currentInboundContext ? { currentInboundContext: params.currentInboundContext } : {},
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
	return { status: getSubagentRequesterSessionActivity(params.requesterSessionKey, loadRequesterSessionEntry(params.requesterSessionKey, params.requesterAgentId)).isActive ? "dropped" : "none" };
}
//#endregion
//#region src/agents/subagents/announce/subagent-announce-direct-response.ts
/** Interprets direct announcement responses and the existing text-fallback receipt. */
function missingVisibleReplyResult() {
	return {
		delivered: false,
		path: "direct",
		reason: "visible_reply_missing",
		error: "completion agent did not produce a visible reply"
	};
}
/** Reuses prepared facts; only the existing text-delivery owner may perform a send. */
function createDirectAnnounceResponseClassifier(context) {
	const { params, parentOnly, requesterSessionBound, deliveryTarget, shouldDeliverAgentFinal, requiresMessageToolDelivery, isSubagentCompletion, hasSuccessfulTrustedSubagentNoOutputCompletion, hasRequiredSubagentNoOutputCompletion, subagentDirectMessageCompletionRequiresMessageTool, effectiveDirectOrigin, requesterSessionOrigin, textCompletionDirectDeliveryKind, tryTextCompletionDirectDelivery } = context;
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
		const hasVisibleNonSilentGatewayPayload = Boolean(directAnnounceResult && hasVisibleAgentPayload(directAnnounceResult, {
			includeErrorPayloads: false,
			includeReasoningPayloads: false,
			requireTerminalContent: true,
			includeSilentReplyPayloads: false
		}));
		const hasIntentionalSilentCompletionReply = Boolean(directAnnounceResult && hasIntentionalSilentAgentPayload(directAnnounceResult));
		const terminalReply = normalizeAgentRunTerminalReplySnapshot(directAnnounceResult?.meta?.terminalReply);
		const requesterCompletedSuccessfully = directAnnounceRecord?.status === "ok" && !directAnnounceResult?.meta?.error && !directAnnounceResult?.meta?.aborted;
		const requiresSettleReply = requesterSessionBound && params.sourceTool === "subagent_settle" && !(requesterCompletedSuccessfully && (terminalReply ? terminalReply.disposition === "silent" : hasIntentionalSilentCompletionReply) && !hasVisibleNonSilentGatewayPayload && directAnnounceResult?.meta?.yielded !== true && directAnnounceResult?.meta?.continuationPending !== true);
		const requiresAutomaticFinalReceipt = shouldDeliverAgentFinal && (params.expectsCompletionMessage || params.requireVisibleReply || requiresSettleReply);
		const automaticEvidence = getAutomaticDeliveryEvidence(directAnnounceResult ?? {});
		const directDeliveryFailure = (shouldDeliverAgentFinal || requiresMessageToolDelivery) && directAnnounceResult ? getAgentCommandDeliveryFailure(directAnnounceResult) : void 0;
		if (directDeliveryFailure && !(requiresAutomaticFinalReceipt ? hasFinalMessagingToolDelivery : hasMessagingToolDelivery)) return {
			delivered: false,
			path: "direct",
			error: directDeliveryFailure,
			...automaticEvidence.mayHaveSent ? { disposition: "ambiguous" } : {}
		};
		const terminalDelivery = normalizeAgentRunTerminalDeliverySnapshot(directAnnounceResult?.deliveryStatus);
		const automaticFinalDelivered = terminalDelivery?.status === "sent" && terminalDelivery.resultCount > 0;
		if (requiresAutomaticFinalReceipt && !hasFinalMessagingToolDelivery && terminalDelivery?.status === "suppressed" && (automaticEvidence.mayHaveSent || automaticEvidence.suppressionReason !== "no_visible_payload")) {
			if (automaticEvidence.suppressionReason === "message_tool_only" && !automaticEvidence.mayHaveSent && (!requesterCompletedSuccessfully || directAnnounceResult?.meta?.yielded === true || directAnnounceResult?.meta?.continuationPending === true)) return missingVisibleReplyResult();
			return {
				delivered: false,
				path: "direct",
				reason: automaticEvidence.mayHaveSent ? void 0 : "delivery_suppressed",
				error: automaticEvidence.mayHaveSent ? "automatic completion delivery could not be confirmed" : automaticEvidence.suppressionReason ?? "automatic completion delivery suppressed",
				disposition: automaticEvidence.mayHaveSent ? "ambiguous" : "intentional_non_delivery",
				terminal: automaticEvidence.mayHaveSent ? void 0 : true
			};
		}
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
		const hasCompletionSideEffect = Boolean(directAnnounceResult && hasCommittedOutboundDeliveryEvidence(directAnnounceResult));
		const hasVisibleRequiredCompletionReply = hasMessagingToolDelivery || !requiresMessageToolDelivery && hasVisibleNonSilentGatewayPayload;
		const finishClassification = () => {
			if (hasSuccessfulTrustedSubagentNoOutputCompletion && !hasVisibleRequiredCompletionReply && hasCompletionSideEffect) return {
				...missingVisibleReplyResult(),
				disposition: "permanent_failure"
			};
			if (params.expectsCompletionMessage && requiresMessageToolDelivery && !hasMessagingToolDelivery && (!hasIntentionalSilentCompletionReply || subagentDirectMessageCompletionRequiresMessageTool || hasRequiredSubagentNoOutputCompletion)) {
				if (hasSuccessfulTrustedSubagentNoOutputCompletion) return missingVisibleReplyResult();
				const missingDelivery = {
					delivered: false,
					path: "direct",
					reason: "message_tool_delivery_missing",
					error: "completion agent did not use the message tool for message-tool-only delivery",
					disposition: "permanent_failure"
				};
				return subagentDirectMessageCompletionRequiresMessageTool ? tryTextCompletionDirectDelivery(textCompletionDirectDeliveryKind, directAnnounceResult ?? void 0).then((textDelivery) => textDelivery ?? missingDelivery) : missingDelivery;
			}
			const hasRequesterVisibleFinalDelivery = hasFinalMessagingToolDelivery || shouldDeliverAgentFinal && automaticFinalDelivered;
			const hasVisibleCompletionReply = hasRequesterVisibleFinalDelivery || !shouldDeliverAgentFinal && !params.requireVisibleReply && hasMessagingToolDelivery || !requiresMessageToolDelivery && hasVisibleNonSilentGatewayPayload && (!requesterSessionBound || requesterCompletedSuccessfully) && directAnnounceResult?.deliveryStatus?.status !== "suppressed" && (params.requesterIsSubagent || [effectiveDirectOrigin, requesterSessionOrigin].every((origin) => origin?.channel ? normalizeMessageChannel(origin.channel) === "webchat" : !origin?.to));
			const acceptsIntentionalSilentCompletion = hasIntentionalSilentCompletionReply && !isSubagentCompletion;
			if (!hasVisibleCompletionReply && (params.requireVisibleReply || requiresSettleReply || params.expectsCompletionMessage && (shouldDeliverAgentFinal || !requiresMessageToolDelivery && !hasCompletionSideEffect && !acceptsIntentionalSilentCompletion))) return missingVisibleReplyResult();
			const requesterVisibleFinalCommitted = !params.requesterIsSubagent && (hasRequesterVisibleFinalDelivery || !params.expectsCompletionMessage && directAnnounceRecord?.status === "ok" && hasVisibleNonSilentGatewayPayload && hasVisibleCompletionReply);
			return buildRequesterCompletionDeliveryResult(requesterVisibleFinalCommitted, directAnnounceResult?.meta?.finalAssistantVisibleText);
		};
		if (params.expectsCompletionMessage && shouldDeliverAgentFinal && isSubagentCompletion && !hasVisibleNonSilentGatewayPayload && !hasMessagingToolDelivery) return tryTextCompletionDirectDelivery(textCompletionDirectDeliveryKind, directAnnounceResult ?? void 0).then((textDelivery) => {
			if (textDelivery) return textDelivery;
			if (hasSuccessfulTrustedSubagentNoOutputCompletion && !hasCompletionSideEffect) return missingVisibleReplyResult();
			return finishClassification();
		});
		return finishClassification();
	};
}
//#endregion
//#region src/agents/subagents/announce/subagent-announce-direct-delivery.ts
/** Another owner (a yielded requester or an idle cron turn) settles this completion. */
function completionHandoffPendingResult() {
	return {
		delivered: false,
		path: "none",
		reason: "completion_handoff_pending",
		terminal: true,
		disposition: "intentional_non_delivery"
	};
}
async function sendSubagentAnnounceDirectly(params) {
	if (params.signal?.aborted) return {
		delivered: false,
		path: "none"
	};
	const parentOnly = params.completionTarget === "parent";
	const cfg = getRuntimeConfig();
	const announceTimeoutMs = resolveSubagentAnnounceTimeoutMs(cfg);
	const runtimeContextFragments = buildAgentInternalEventContext(params.internalEvents);
	const turnMessage = runtimeContextFragments.length ? RUNTIME_EVENT_USER_PROMPT : params.triggerMessage;
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
		const deliveryTarget = !parentOnly && !params.requesterIsSubagent ? resolveExternalBestEffortDeliveryTarget(effectiveDirectOrigin ?? {}) : { deliver: false };
		const normalizedSessionOnlyOriginChannel = !params.requesterIsSubagent ? normalizeMessageChannel(sessionOnlyOrigin?.channel) : void 0;
		const sessionOnlyOriginChannel = normalizedSessionOnlyOriginChannel && isGatewayMessageChannel(normalizedSessionOnlyOriginChannel) ? normalizedSessionOnlyOriginChannel : void 0;
		const sourceToolId = normalizeOptionalLowercaseString(params.sourceTool) ?? (params.expectsCompletionMessage ? "subagent_announce" : "");
		const isSubagentCompletion = sourceToolId === "subagent_announce";
		const trustedCompletionEvent = resolveExactSubagentCompletionEvent({
			inputProvenance: {
				kind: "inter_session",
				sourceSessionKey: params.sourceSessionKey,
				sourceTool: sourceToolId
			},
			internalEvents: params.internalEvents
		});
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
		const requesterActivity = getSubagentRequesterSessionActivity(params.targetRequesterSessionKey, requester);
		const requesterSessionBound = parentOnly || sourceToolId === "subagent_settle" && params.completionRequesterSessionId !== void 0;
		if (requesterSessionBound && (!params.completionRequesterSessionId || requesterActivity.sessionId !== params.completionRequesterSessionId || requesterEntry?.lifecycleRevision !== params.completionRequesterLifecycleRevision)) return {
			delivered: false,
			path: "none",
			reason: "completion_handoff_unavailable",
			error: "private completion requester session is unavailable or replaced",
			terminal: true,
			disposition: "intentional_non_delivery"
		};
		const requesterAbandonment = params.expectsCompletionMessage ? resolveEmbeddedRunAbandonment({
			sessionKey: canonicalRequesterSessionKey,
			sessionId: requesterActivity.sessionId
		}) : void 0;
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
		if (!isCompletionAdmissionAllowed()) return completionHandoffPendingResult();
		const recovery = !parentOnly && sourceToolId === "subagent_settle" ? resolveRequesterRecoveryDelivery(requesterEntry, params.directIdempotencyKey) : void 0;
		if (recovery?.kind === "delivery") return recovery.delivery;
		const recoveredResult = recovery?.result;
		const tryTextCompletionDirectDelivery = (contentKind = textCompletionDirectDeliveryKind, agentResult) => deliverCompletionDirect({
			cfg,
			requesterSessionKey: canonicalRequesterSessionKey,
			requesterAgentId: params.requesterAgentId,
			directIdempotencyKey: params.directIdempotencyKey,
			deliveryTarget,
			internalEvents: params.internalEvents,
			contentKind,
			agentResult,
			signal: params.signal,
			onDeliveryResult: params.onDeliveryResult,
			isSourceSessionEffectsAllowed: isCompletionDeliveryAllowed
		});
		const completionSourceReplyDeliveryMode = parentOnly ? "automatic" : requiresMessageToolDelivery ? "message_tool_only" : void 0;
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
				...runtimeContextFragments.length ? { currentInboundContext: {
					text: projectRuntimeContextFragments(runtimeContextFragments),
					fragments: runtimeContextFragments
				} } : {},
				...params.createUserTurnTranscriptRecorder ? { userTurnTranscriptRecorder: params.createUserTurnTranscriptRecorder(requesterActivity.sessionId) } : {}
			};
			const wakeOutcome = await resolveActiveWakeWithRetries(requesterActivity.sessionId, turnMessage, wakeOptions, params.signal, isCompletionDeliveryAllowed, params.isSourceSessionAdmissionAllowed);
			if (wakeOutcome === SOURCE_OWNER_CHANGED) return sourceOwnerChangedResult();
			if (wakeOutcome.queued) return {
				delivered: true,
				deliveredAt: wakeOutcome.deliveredAtMs,
				enqueuedAt: wakeOutcome.enqueuedAtMs,
				path: "steered"
			};
			const wakeFailure = formatEmbeddedAgentQueueFailureSummary(wakeOutcome);
			defaultRuntime.log(`[warn] Active requester session could not be woken for subagent completion; falling back to requester-agent handoff: active requester session could not be woken${wakeFailure ? `: ${wakeFailure}` : ""}`);
		}
		if (params.expectsCompletionMessage && isCronRunSessionKey(canonicalRequesterSessionKey) && !getSubagentRequesterSessionActivity(params.targetRequesterSessionKey, loadRequesterSessionEntry(params.targetRequesterSessionKey, params.requesterAgentId)).isActive && !agentMediatedCompletion) return completionHandoffPendingResult();
		if (params.signal?.aborted) return {
			delivered: false,
			path: "none"
		};
		const directAgentOrigin = shouldDeliverAgentFinal ? deliveryTarget : sessionOnlyOriginChannel ? sessionOnlyOrigin : void 0;
		let directAgentParams = {
			...requesterSessionBound ? {
				expectedExistingSessionId: params.completionRequesterSessionId,
				expectedExistingSessionLifecycleRevision: params.completionRequesterLifecycleRevision ?? null
			} : {},
			sessionKey: canonicalRequesterSessionKey,
			message: turnMessage,
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
		if (requesterSessionBound && params.completionRequesterSessionId) directAgentParams = bindInProcessSessionRun(directAgentParams, {
			sessionKey: canonicalRequesterSessionKey,
			sessionId: params.completionRequesterSessionId,
			lifecycleRevision: params.completionRequesterLifecycleRevision ?? null,
			runId: params.directIdempotencyKey
		});
		const classifyResponse = createDirectAnnounceResponseClassifier({
			params,
			parentOnly,
			requesterSessionBound,
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
						typing: sourceToolId === "subagent_settle" && shouldDeliverAgentFinal && deliveryTarget.channel && deliveryTarget.to ? {
							agentId: requesterAgentId,
							runId: params.directIdempotencyKey,
							channel: deliveryTarget.channel,
							to: deliveryTarget.to,
							accountId: deliveryTarget.accountId,
							threadId: deliveryTarget.threadId
						} : void 0,
						settleWakeSourceSessionKeys: params.settleWakeSourceSessionKeys,
						...parentOnly ? { privateCompletion: true } : {},
						delegatedToolPolicyHandoff: (isSubagentCompletion && trustedCompletionEvent || sourceToolId === "subagent_settle" && params.settleWakeSourceSessionKeys?.length && params.isSourceSessionEffectsAllowed) && params.sourceSessionKey && requesterActivity.sessionId && params.isSourceSessionEffectsAllowed?.() !== false ? {
							sourceSessionKey: params.sourceSessionKey,
							...trustedCompletionEvent?.childSessionId ? { sourceSessionId: trustedCompletionEvent.childSessionId } : {},
							targetSessionKey: canonicalRequesterSessionKey,
							targetSessionId: requesterActivity.sessionId,
							idempotencyKey: params.directIdempotencyKey,
							...sourceToolId === "subagent_settle" && params.settleWakeSourceSessionKeys ? { settleBatch: {
								sourceSessionKeys: params.settleWakeSourceSessionKeys,
								isCurrent: isCompletionDeliveryAllowed,
								receiptAdmission: params.sourceReceiptAdmission
							} } : {}
						} : void 0,
						expectFinal: true,
						signal: params.signal,
						onExecutionStarted: params.onExecutionStarted,
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
//#region src/agents/subagents/announce/subagent-announce-delivery.ts
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
				text: params.transcriptMessage,
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
		const cfg = getRuntimeConfig();
		const canonicalSessionKey = params.preparedRequester?.binding.sessionKey ?? resolveRequesterStoreKey(cfg, params.targetRequesterSessionKey, params.requesterAgentId);
		const queuedRoute = resolveGeneratedMediaSessionDeliveryRoute({
			...params,
			sessionKey: canonicalSessionKey
		});
		const { requesterSessionOrigin, effectiveDirectOrigin } = resolveCompletionDeliveryOrigins(params);
		const requesterEntry = params.preparedRequester?.entry ?? loadRequesterSessionEntry(params.targetRequesterSessionKey, params.requesterAgentId).entry;
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
			message: resolveAcpPromptBody("", params.internalEvents) || params.triggerMessage,
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
			idempotencyKey: `${params.directIdempotencyKey}:agent-loop`,
			...params.preparedRequester ? { requesterBinding: params.preparedRequester.binding } : {}
		};
		const queueContext = captureOpenClawStateWorkerContext();
		const enqueueContext = {
			...queueContext,
			admission: {
				...queueContext.admission,
				assertCurrent: () => {
					queueContext.admission.assertCurrent();
					if (sourceOwnerChanged()) throw new SessionDeliveryDeadLetteredError("media completion source owner changed");
				}
			}
		};
		const queued = params.sourceRunId ? await admitCorrelatedSubagentSessionDelivery({
			runId: params.sourceRunId,
			payload: queuePayload,
			queueContext: enqueueContext
		}) : await enqueueClaimedSessionDelivery(queuePayload, resolveSubagentAnnounceTimeoutMs(cfg), enqueueContext);
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
		if (error instanceof SessionDeliveryDeadLetteredError) return {
			delivered: false,
			path: "queued",
			reason: "completion_handoff_unavailable",
			error: error.message,
			disposition: "permanent_failure"
		};
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
	const runtimeContextFragments = buildAgentInternalEventContext(params.internalEvents);
	const createCompletionUserTurnTranscriptRecorder = params.expectsCompletionMessage ? createCompletionUserTurnTranscriptRecorderFactory({
		...params,
		transcriptMessage: runtimeContextFragments.length ? RUNTIME_EVENT_USER_PROMPT : params.triggerMessage
	}) : void 0;
	const delivery = await runSubagentAnnounceDispatch({
		expectsCompletionMessage: params.expectsCompletionMessage,
		requireDirectDelivery: params.requireDirectDelivery || params.completionTarget === "parent",
		signal: params.signal,
		steer: async () => {
			if (sourceOwnerChanged()) return { status: "source_owner_changed" };
			return await maybeSteerSubagentAnnounce({
				deliveryTimeoutMs: resolveSubagentAnnounceTimeoutMs(getRuntimeConfig()),
				requesterSessionKey: params.requesterSessionKey,
				requesterAgentId: params.requesterAgentId,
				steerMessage: runtimeContextFragments.length ? RUNTIME_EVENT_USER_PROMPT : params.triggerMessage,
				...runtimeContextFragments.length ? { currentInboundContext: {
					text: projectRuntimeContextFragments(runtimeContextFragments),
					fragments: runtimeContextFragments
				} } : {},
				createUserTurnTranscriptRecorder: createCompletionUserTurnTranscriptRecorder,
				signal: params.signal,
				isSourceSessionEffectsAllowed: params.isSourceSessionEffectsAllowed,
				isSourceSessionAdmissionAllowed: params.isSourceSessionAdmissionAllowed
			});
		},
		direct: async () => {
			if (sourceOwnerChanged()) return sourceOwnerChangedResult();
			return await sendSubagentAnnounceDirectly({
				...params,
				createUserTurnTranscriptRecorder: createCompletionUserTurnTranscriptRecorder
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
export { isInternalAnnounceRequesterSession as n, deliverSubagentAnnouncement as t };
