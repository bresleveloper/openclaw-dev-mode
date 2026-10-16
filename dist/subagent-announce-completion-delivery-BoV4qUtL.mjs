import { c as normalizeOptionalLowercaseString, l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import "./session-key-C09ow4h0.mjs";
import { n as normalizeAccountId } from "./account-id-DbRsdayc.mjs";
import { i as getLoadedChannelPluginForRead } from "./registry-loaded-BugfxX6l.mjs";
import { t as INTERNAL_MESSAGE_CHANNEL } from "./message-channel-constants-B3vfipkP.mjs";
import { n as normalizeMessageChannel } from "./message-channel-core-CqBAHB04.mjs";
import { n as isGatewayMessageChannel, t as isDeliverableMessageChannel } from "./message-channel-normalize-DeTO1ikE.mjs";
import { a as isInternalMessageChannel } from "./message-channel-j-k-Nup3.mjs";
import { t as deriveSessionChatTypeFromKey } from "./session-chat-type-shared-BzwKnB1m.mjs";
import { t as getGlobalHookRunner } from "./hook-runner-global-eJIIEpha.mjs";
import { f as stringifyRouteThreadId } from "./channel-route-BIxMkFzo.mjs";
import { a as mergeDeliveryContext, s as normalizeDeliveryContext } from "./delivery-context.shared-PF5njaoI.mjs";
import { t as deliveryContextFromSession } from "./delivery-context.read-CR06zOJ4.mjs";
import { v as shouldPreserveUserFacingSessionStateForInputProvenance } from "./input-provenance-D1LHo5Qj.mjs";
import { $ as sanitizeAgentRunTerminalReplyText } from "./subagent-registry.store.sqlite-DIYyRjhZ.mjs";
import { a as hasRestartRecoveryTerminalRun, i as hasRestartRecoverySourceClaim, n as getRestartRecoveryTerminalDeliveryEvidence } from "./restart-recovery-state-IiHiWzPq.mjs";
import { a as createAgentRunDirectAbortError } from "./run-termination-DGv2EKii.mjs";
import { n as sourceDeliveryTargetsMatch } from "./source-delivery-plan-DyVvloMw.mjs";
import { n as splitMediaFromOutput } from "./reply-directives-Ciui4dZv.mjs";
import { x as normalizeOutboundReplyPayloadCore } from "./reply-payload-DEDOYf-L.mjs";
import { n as stripOutboundTargetKindPrefix, r as stripTargetProviderPrefix } from "./channel-target-prefix-DIR59G50.mjs";
import { k as resolveConversationIdFromTargets } from "./session-binding-service-DzGpg6K8.mjs";
import { r as sanitizePendingFinalDeliveryText } from "./pending-final-delivery-state-Cmhed7ry.mjs";
import { r as getGatewayRecoveryRuntime } from "./server-recovery-runtime-context-Cl-1FBey.mjs";
import { a as buildAgentRunTerminalOutcomeFromWaitResult } from "./agent-run-terminal-outcome-BTCs8JFs.mjs";
import { i as hasVisibleCompletionResult } from "./internal-event-contract-pF6FHp8g.mjs";
import { t as dispatchGatewayMethodInProcess } from "./server-plugin-in-process-dispatch-BzMtb5Z5.mjs";
import { a as waitForGatewayDispatch } from "./server-in-process-dispatch-uyL8gtA5.mjs";
import { a as createBoundDeliveryRouter, i as tryResolveSubagentRequesterAgentId } from "./subagent-announce-delivery.runtime.js";
import { t as sendMessage } from "./message-C1Hs-IRg.mjs";
import { a as hasVisibleAgentPayload } from "./message-visibility-D9way_Lv.mjs";
import "./subagent-announce.runtime.js";
import { r as collectAgentInternalEventMedia } from "./internal-events-BZWbNO1Z.mjs";
import { t as deliveryContextFromConversation } from "./route-projection-uEI9fHmI.mjs";
import { n as hasAnnounceSendEvidence, s as summarizeDeliveryError, t as SourceOwnerChangedError } from "./subagent-announce-delivery-retry-BA3__tnm.mjs";
import { t as isNonTerminalAgentRunStatus } from "./agent-run-status-CdFMkKaA.mjs";
import { g as hasUnaccountedMessagingToolAggregateEvidence, m as hasMessagingToolDeliveryEvidence, s as getGatewayAgentResult, u as hasCommittedSourceReplyDeliveryEvidence, y as resolveExplicitFinalSourceReplyDeliveryEvidence } from "./delivery-evidence-BEVHUW11.mjs";
//#region src/agents/subagents/announce/subagent-announce-origin.ts
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
		const route = await router.resolveDestination({
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
//#region src/agents/subagents/announce/subagent-announce-dispatch.ts
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
function mapSteerOutcomeToDeliveryResult(outcome) {
	if (outcome.status === "steered") return {
		delivered: true,
		path: "steered",
		deliveredAt: outcome.deliveredAt,
		enqueuedAt: outcome.enqueuedAt
	};
	if (outcome.status === "source_owner_changed") return sourceOwnerChangedResult();
	return {
		delivered: false,
		path: "none",
		...outcome.status === "dropped" ? { reason: "steer_dropped" } : {}
	};
}
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
//#region src/agents/subagents/announce/subagent-announce-completion-delivery.ts
async function runAnnounceAgentCall(params) {
	const typingRuntime = params.typing ? params.resolveGatewayContext ? params.resolveGatewayContext()?.recoveryRuntime : getGatewayRecoveryRuntime() : void 0;
	let stopTyping;
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
		const dispatch = dispatchGatewayMethodInProcess("agent", params.agentParams, {
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
			onAccepted: (payload) => {
				clearTimeout(timer);
				params.onAccepted?.(payload);
			},
			onExecutionStarted: () => {
				executionSignal.throwIfAborted();
				if (!params.isExecutionAllowed()) {
					sourceLifecycle.abort(new SourceOwnerChangedError());
					throw createAgentRunDirectAbortError();
				}
				clearTimeout(timer);
				params.onExecutionStarted?.();
				if (params.typing) stopTyping ??= typingRuntime?.startRecoveryTyping?.({
					...params.typing,
					isCurrent: () => !executionSignal.aborted && params.isExecutionAllowed() && (params.resolveGatewayContext ? params.resolveGatewayContext()?.recoveryRuntime === typingRuntime : getGatewayRecoveryRuntime() === typingRuntime)
				});
			},
			resolveGatewayContext: params.resolveGatewayContext
		});
		return params.privateCompletion ? await waitForGatewayDispatch("agent", dispatch, void 0, signal) : await dispatch;
	} catch (error) {
		sourceLifecycle.signal.throwIfAborted();
		throw error;
	} finally {
		clearTimeout(timer);
		stopTyping?.();
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
function collectDirectCompletionContent(params) {
	if (params.contentKind === "failed_notice") return {
		content: FAILED_COMPLETION_NOTICE,
		mediaUrls: []
	};
	const collect = (payloads) => {
		const textParts = [];
		const mediaUrls = /* @__PURE__ */ new Set();
		let audioAsVoice = false;
		for (const record of payloads) {
			if (!isRecord(record)) continue;
			if (!hasVisibleAgentPayload({ payloads: [record] }, {
				includeErrorPayloads: false,
				includeReasoningPayloads: false,
				includeSilentReplyPayloads: false,
				requireTerminalContent: true
			})) continue;
			const normalized = normalizeOutboundReplyPayloadCore(record);
			const parsed = splitMediaFromOutput(sanitizePendingFinalDeliveryText(normalized.text ?? ""));
			if (parsed.audioAsVoice === true || record.audioAsVoice === true) audioAsVoice = true;
			const text = sanitizeAgentRunTerminalReplyText(sanitizePendingFinalDeliveryText(parsed.text));
			if (text) textParts.push(text);
			for (const mediaUrl of [
				...normalized.mediaUrl ? [normalized.mediaUrl] : [],
				...normalized.mediaUrls ?? [],
				...parsed.mediaUrls ?? []
			]) mediaUrls.add(mediaUrl);
		}
		return textParts.length > 0 || mediaUrls.size > 0 ? {
			content: textParts.join("\n\n"),
			mediaUrls: [...mediaUrls],
			...audioAsVoice ? { audioAsVoice: true } : {}
		} : void 0;
	};
	const payloadContent = Array.isArray(params.agentResult?.payloads) ? collect(params.agentResult.payloads) : void 0;
	if (payloadContent && payloadContent.mediaUrls.length > 0) return payloadContent;
	for (let index = (params.events?.length ?? 0) - 1; index >= 0; index -= 1) {
		const event = params.events?.[index];
		if (event?.type !== "task_completion" || event.source !== "subagent" || event.status !== "ok") continue;
		if (!hasVisibleCompletionResult(event)) continue;
		const parsedEvent = collect([{ text: event.result }]);
		const eventMediaUrls = collectAgentInternalEventMedia([event]).mediaUrls;
		const mediaUrls = /* @__PURE__ */ new Set([...parsedEvent?.mediaUrls ?? [], ...eventMediaUrls]);
		if (parsedEvent || mediaUrls.size > 0) return {
			content: parsedEvent?.content ?? "",
			mediaUrls: [...mediaUrls],
			...parsedEvent?.audioAsVoice ? { audioAsVoice: true } : {}
		};
	}
}
async function deliverCompletionDirect(params) {
	const completionContent = collectDirectCompletionContent({
		agentResult: params.agentResult,
		events: params.internalEvents,
		contentKind: params.contentKind
	});
	const content = completionContent?.content;
	const mediaUrls = completionContent?.mediaUrls ?? [];
	const audioAsVoice = completionContent?.audioAsVoice === true;
	if (!content && mediaUrls.length === 0 || !params.deliveryTarget.deliver || !params.deliveryTarget.channel || !params.deliveryTarget.to || !isDirectMessageDeliveryTarget(params.deliveryTarget, params.requesterSessionKey)) return;
	const agentId = tryResolveSubagentRequesterAgentId(params.cfg, params.requesterSessionKey, params.requesterAgentId);
	if (!agentId) return;
	const idempotencyKey = `${params.directIdempotencyKey}:text-direct`;
	let committedDelivery;
	let deliveryResultReported;
	const assertDeliveryCurrent = () => {
		params.signal?.throwIfAborted();
		if (params.isSourceSessionEffectsAllowed?.() === false) throw new SourceOwnerChangedError();
	};
	try {
		if (params.isSourceSessionEffectsAllowed?.() === false) return sourceOwnerChangedResult();
		if (params.signal?.aborted) return {
			delivered: false,
			path: "none"
		};
		const sendResult = await sendMessage({
			cfg: params.cfg,
			channel: params.deliveryTarget.channel,
			to: params.deliveryTarget.to,
			accountId: params.deliveryTarget.accountId,
			threadId: params.deliveryTarget.threadId,
			requesterSessionKey: params.requesterSessionKey,
			agentId,
			conversationType: "direct",
			content: content ?? "",
			...mediaUrls.length > 0 ? { mediaUrls } : {},
			...audioAsVoice ? { asVoice: true } : {},
			idempotencyKey,
			skipQueue: true,
			abortSignal: params.signal,
			onPlatformSendDispatch: async () => assertDeliveryCurrent(),
			assertDirectAdapterHandoff: assertDeliveryCurrent,
			onDeliveredPayload: () => {
				if (committedDelivery) return;
				committedDelivery = {
					delivered: true,
					path: "direct",
					deliveredAt: Date.now()
				};
				deliveryResultReported = Promise.resolve(params.onDeliveryResult?.(committedDelivery)).catch(() => {});
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
		if (hasAnnounceSendEvidence(err)) return {
			delivered: false,
			path: "direct",
			terminal: true,
			disposition: "permanent_failure",
			error: `text completion direct delivery was incomplete; automatic retry would duplicate sent chunks: ${summarizeDeliveryError(err)}`,
			...mediaUrls.length > 0 ? { missingMediaUrls: mediaUrls } : {}
		};
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
	} finally {
		await deliveryResultReported;
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
export { isGatewayAgentRunPending as a, runAnnounceAgentCall as c, resolveAnnounceOrigin as d, resolveCompletionDeliveryOrigins as f, isDirectMessageDeliveryTarget as i, runSubagentAnnounceDispatch as l, resolveSubagentCompletionOrigin as m, deliverCompletionDirect as n, resolvePrivateCompletionDeliveryResult as o, resolveGeneratedMediaSessionDeliveryRoute as p, hasMessagingToolDeliveryToSource as r, resolveRequesterRecoveryDelivery as s, buildRequesterCompletionDeliveryResult as t, sourceOwnerChangedResult as u };
