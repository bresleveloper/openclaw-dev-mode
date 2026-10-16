import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { a as asOptionalRecord } from "./record-coerce-TIsquoVR.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import "./utils-DgZn2dLu.mjs";
import { t as escapeRegExp } from "./regexp-BZyMFTlj.mjs";
import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { r as resolveAgentConfig } from "./agent-scope-config-CDYpzA0r.mjs";
import { M as parseAgentSessionKey, l as resolveAgentIdFromSessionKey, x as isCronRunSessionKey } from "./session-key-C09ow4h0.mjs";
import "./agent-scope-CG17uXFn.mjs";
import { l as getAgentEventLifecycleGeneration } from "./agent-events-GvNTkbe3.mjs";
import { s as getActivePluginChannelRegistry } from "./runtime-D4MkflNJ.mjs";
import { v as resolveModelRefFromString } from "./model-selection-shared-BZeDVoch.mjs";
import { r as getRuntimeConfig } from "./io.runtime-CPntde4x.mjs";
import "./config-CzeZu5J_.mjs";
import { t as normalizeChatType } from "./chat-type-D-T98NfH.mjs";
import { a as isSilentReplyPayloadText, n as HEARTBEAT_TOKEN, r as SILENT_REPLY_TOKEN } from "./tokens-D4ghQG_g.mjs";
import { E as setReplyPayloadMetadata, S as markReplyPayloadForSourceSuppressionDelivery, c as getReplyPayloadMetadata, o as copyReplyPayloadMetadata } from "./reply-payload-NzglYOOT.mjs";
import { t as normalizeMediaReferenceForComparison } from "./media-reference-comparison-D61D3Ct7.mjs";
import { i as captureOwnedTranscriptWriteAssertion } from "./transcript-write-context-m7NE2aEm.mjs";
import { c as deferSessionEventWakePoll, f as markSessionEventWakeWorkStarted, i as HEARTBEAT_SKIP_REQUESTS_IN_FLIGHT, l as getSessionEventWakeAbortSignal, n as HEARTBEAT_SKIP_CRON_IN_PROGRESS, o as SESSION_EVENT_IDLE_RETRY_MS, p as requestSessionEventWake, r as HEARTBEAT_SKIP_NO_PENDING_EVENT, s as areSessionEventWakesEnabled, t as HEARTBEAT_SKIP_CHANNEL_NOT_READY } from "./heartbeat-wake-ba6LAy2M.mjs";
import { c as resolveSystemEventQueueKey, l as withSystemEventOwner, p as resolveIndicatorType, u as emitHeartbeatEvent } from "./system-event-ownership-BkQcgSZJ.mjs";
import { d as resolveSystemEventDeliveryContext, i as enqueueSystemEvent, l as peekSystemEventEntries, t as consumeSelectedSystemEventEntries } from "./system-events-BD0JkU8V.mjs";
import "./model-selection-C1qxt1eY.mjs";
import { s as resolveEffectiveAgentRuntime } from "./thinking-runtime-BwS3HC5I.mjs";
import { t as isInternalSessionEffectsKey } from "./internal-session-key-CPayZwJR.mjs";
import { n as loadExactSessionEntry, o as loadExactSessionEntryReadOnly } from "./session-accessor.sqlite-exact-read-JW6IveXD.mjs";
import { h as listCronHeartbeatWaitOwners, l as hasActiveCronJobs, u as hasActiveCronJobsExceptMarkers } from "./active-jobs-BS2UT6i2.mjs";
import { c as resolveHeartbeatPromptCore, l as resolveHeartbeatPromptForResponseTool, o as isHeartbeatAcknowledgementText, r as HEARTBEAT_RESPONSE_TOOL_INSTRUCTIONS, s as isHeartbeatContentEffectivelyEmpty, u as stripHeartbeatToken } from "./heartbeat-BjLIgeQc.mjs";
import { t as getChannelPlugin } from "./registry-DOE8N7Jo.mjs";
import "./plugins-Z9_SzFi0.mjs";
import { o as loadSessionEntryReadOnly, s as patchSessionEntryCore } from "./session-accessor.sqlite-entry-AwYVLytL.mjs";
import { C as replaceGenericExternalRunFailureText } from "./user-facing-text-DC1sCo4O.mjs";
import "./transcript-only-openclaw-assistant-CzjHCvH2.mjs";
import { p as publishTranscriptUpdate } from "./session-history-eviction-Cj2-Mfrh.mjs";
import { _ as readTranscriptEventMessage, g as readTranscriptEventId } from "./session-accessor.sqlite-read-D4vZepQN.mjs";
import { r as mergeSessionEntry } from "./types-BZlUzQZy.mjs";
import { o as persistSessionTranscriptTurn } from "./session-accessor-cUVSaeKy.mjs";
import { g as applySessionEntryLifecycleMutation } from "./session-accessor.reset-DWr6djSD.mjs";
import { l as makeZeroUsageSnapshot } from "./usage-XmAH1cfG.mjs";
import { n as readActiveTranscriptEntryAnchor } from "./session-accessor.sqlite-transcript-anchor-eRtZH9vP.mjs";
import { n as readCommittedTranscriptMessageSequence } from "./session-accessor.sqlite-transcript-sequences-CTh1nTDB.mjs";
import { t as findTranscriptEvent } from "./session-transcript-match-BACU-BTR.mjs";
import { r as readAssistantDisplayContent } from "./assistant-display-content-mzartsGP.mjs";
import { a as getHeartbeatToolNotificationText, s as selectHeartbeatToolResponse } from "./heartbeat-tool-response-BAjLTEaX.mjs";
import { a as isCronSystemEvent, c as isRelayableExecCompletionEvent, i as buildExecEventPrompt, l as isRestartContinuationEvent, o as isExecCompletionEvent, r as buildCronEventPrompt, s as isHeartbeatDeliveryAwarenessEvent, t as HEARTBEAT_DELIVERY_CONTEXT_KEY_PREFIX } from "./heartbeat-events-filter-DMpc12GN.mjs";
import { a as resolveMirroredTranscriptText } from "./transcript-CEhnMlD1.mjs";
import "./session-state-events.kernel-CXzdFJ4D.mjs";
import { g as replyRunRegistry, m as listActiveReplyRunSessionKeys } from "./reply-run-registry.registry-CVpYrkbm.mjs";
import "./reply-run-registry-CHTPEb3-.mjs";
import { n as resolveCronJobsStorePathFromConfig } from "./paths-C7ju4So0.mjs";
import { i as resolveActiveEmbeddedRunSessionId, r as listActiveEmbeddedRunSessionKeys } from "./active-run-projections-B86tDIo_.mjs";
import "./lanes-D7a4ntDu.mjs";
import { l as isCommandLaneTaskMarkerCurrent, s as getQueueSize } from "./command-queue-CFE60Avj.mjs";
import { o as resolveSessionWorkStartError } from "./lifecycle-BH2MRg79.mjs";
import { t as parseReplyDirectives } from "./reply-directives-Ciui4dZv.mjs";
import { l as resolveOutboundPayloadMirrorText } from "./payloads-RF8yW6z7.mjs";
import { a as resolveSendableOutboundReplyParts } from "./reply-payload-parts-BtASEhL4.mjs";
import { a as resolveResponsePrefixTemplate } from "./normalize-reply-C8IYvn0x.mjs";
import { a as hasOutboundReplyContent } from "./reply-payload-DEDOYf-L.mjs";
import { c as resolveReplyOperationAbortReason, i as resolveReplyOperationAgentTurn, t as REPLY_OPERATION_RUN_STATE } from "./reply-operation-run-state-B2pZCuC9.mjs";
import { r as clearBootstrapSnapshotOnSessionRollover } from "./bootstrap-cache-799ZO2Op.mjs";
import { c as transitionMainSessionRecovery } from "./main-session-recovery-state-YrhflDrO.mjs";
import { n as withReplySystemEventContext } from "./system-event-session-key-d4mk05_u.mjs";
import { n as suppressPendingFinalDelivery } from "./dispatch-from-config.pending-final-DoahImS7.mjs";
import { t as buildOutboundSessionContext } from "./session-context-Kov7ff_A.mjs";
import { n as sendDurableMessageBatchCore } from "./send-BOL6c5DR.mjs";
import "./runtime-D_39_b__.mjs";
import { r as resolveSourceReplyDeliveryMode } from "./source-reply-delivery-mode-B2d5vFVm.mjs";
import { o as resolveUserTimezone } from "./date-time-DNFKWNdt.mjs";
import { i as resolveHeartbeatSenderContext, r as resolveHeartbeatDeliveryTargetWithSessionRoute } from "./targets-CO7mQVz4.mjs";
import { n as resolveSessionLane } from "./lanes-DQO4OUmF.mjs";
import { n as persistHeartbeatOutcome } from "./heartbeat-outcome-store-CRJePlvi.mjs";
import { a as resolveHeartbeatForWake, c as tryResolveAmbientHeartbeatAgentId, o as resolveHeartbeatIntervalMs, s as resolveHeartbeatTimeoutOverrideSeconds } from "./heartbeat-config--CDRLwW6.mjs";
import { t as isHeartbeatEnabledForAgent } from "./heartbeat-summary-DGkbnKda.mjs";
import { t as resolveRawAssistantAnswerText } from "./assistant-answer-text-BDCP6yWU.mjs";
import { t as appendCronStyleCurrentTimeLine } from "./current-time-CZi1S4GF.mjs";
import { i as resolveMessagingToolPayloadDedupe } from "./reply-payloads-dedupe-BiCY7p5A.mjs";
import "./store-ChPMJI5O.mjs";
import { n as resolveHeartbeatTerminalToolFailure, t as resolveHeartbeatReplyPayload } from "./heartbeat-reply-payload-D-RdM_zK.mjs";
import { t as resolveDefaultModel } from "./directive-handling.defaults-DpmF91wd.mjs";
import { t as prepareReplyConversation } from "./prompt-session-context-B4hDlhYy.mjs";
import { t as createReplyPrefixContext } from "./reply-prefix-Bvtljso0.mjs";
import { t as createTypingCallbacks } from "./typing-C8KuE7vc.mjs";
import { t as resolveAgentOutboundIdentity } from "./identity-BLDSV5e3.mjs";
import { t as readCronScratchSnapshot } from "./scratch-read-D5KvLJ0l.mjs";
import { o as writeCronJobScratch } from "./scratch-store-CQLK4z6q.mjs";
import { a as restoreHeartbeatUpdatedAt, i as resolveStaleHeartbeatIsolatedSessionKey, r as resolveHeartbeatSessionSelection, t as resolveHeartbeatSession } from "./heartbeat-runner-session-BraqUg4c.mjs";
import { r as resolveCronSession } from "./session-CNgutTpZ.mjs";
import { t as resolveHeartbeatVisibility } from "./heartbeat-visibility-BK4csk9g.mjs";
import { a as heartbeatLog, i as resolveHeartbeatWakePayloadFlags, n as isConfiguredHeartbeatAgent, r as isTargetedUnscheduledWake, t as inferHeartbeatWakeSourceFromReason } from "./heartbeat-wake-policy-C3iBUwep.mjs";
import { createHash } from "node:crypto";
import { STREAM_ERROR_FALLBACK_TEXT } from "@openclaw/ai/internal/shared";
//#region src/infra/heartbeat-runner-config.ts
function resolveHeartbeatChannelPlugin(channel) {
	return getActivePluginChannelRegistry()?.channels.find((entry) => entry.plugin.id === channel)?.plugin ?? getChannelPlugin(channel);
}
function resolveHeartbeatPromptRaw(cfg, heartbeat) {
	return heartbeat?.prompt ?? cfg.agents?.defaults?.heartbeat?.prompt;
}
function resolveConfiguredHeartbeatPrompt(cfg, heartbeat) {
	return resolveHeartbeatPromptCore(resolveHeartbeatPromptRaw(cfg, heartbeat));
}
function resolveHeartbeatResponseToolPrompt(cfg, heartbeat) {
	return resolveHeartbeatPromptForResponseTool(resolveHeartbeatPromptRaw(cfg, heartbeat));
}
function resolveHeartbeatModelRef(params) {
	const { defaultProvider, defaultModel, aliasIndex } = resolveDefaultModel({
		cfg: params.cfg,
		agentId: params.agentId
	});
	const heartbeatRaw = normalizeOptionalString(params.heartbeat?.model) ?? normalizeOptionalString(params.cfg.agents?.defaults?.heartbeat?.model) ?? "";
	const heartbeatRef = heartbeatRaw ? resolveModelRefFromString({
		raw: heartbeatRaw,
		defaultProvider,
		aliasIndex
	})?.ref : void 0;
	if (heartbeatRef) return heartbeatRef;
	return {
		provider: normalizeOptionalString(params.entry?.providerOverride) ?? normalizeOptionalString(params.entry?.modelProvider) ?? defaultProvider,
		model: normalizeOptionalString(params.entry?.modelOverride) ?? normalizeOptionalString(params.entry?.model) ?? defaultModel
	};
}
function shouldUseHeartbeatResponseToolPrompt(params) {
	const chatType = normalizeChatType(params.chatType);
	const visibleReplies = chatType === "group" || chatType === "channel" ? params.cfg.messages?.groupChat?.visibleReplies ?? params.cfg.messages?.visibleReplies : params.cfg.messages?.visibleReplies;
	if (visibleReplies === "message_tool") return true;
	if (visibleReplies === "automatic") return false;
	const modelRef = resolveHeartbeatModelRef(params);
	return resolveEffectiveAgentRuntime({
		cfg: params.cfg,
		provider: modelRef.provider,
		modelId: modelRef.model,
		agentId: params.agentId,
		sessionKey: params.sessionKey,
		sessionEntry: params.entry
	}) === "codex";
}
function isHeartbeatTypingEnabled(params) {
	if (!params.hasChatDelivery) return false;
	return (resolveAgentConfig(params.cfg, params.agentId)?.typingMode ?? params.cfg.agents?.defaults?.typingMode) !== "never";
}
function resolveHeartbeatTypingIntervalSeconds(cfg) {
	const configured = cfg.agents?.defaults?.typingIntervalSeconds;
	return typeof configured === "number" && configured > 0 ? configured : void 0;
}
//#endregion
//#region src/infra/heartbeat-runner-prompt.ts
function truncateHeartbeatPreview(value) {
	return value ? truncateUtf16Safe(value, 200) : void 0;
}
/**
* Terminal no-op preflight (empty scratch, consumed exec events) must resolve
* before retryable busy guards; wakes carrying heartbeat tasks keep deferral.
*/
function shouldPreflightWakeBeforeBusy(source, scheduledEveryMs, scheduledTaskCount) {
	return scheduledTaskCount === 0 && (source === "interval" || source === "exec-event" && !(typeof scheduledEveryMs === "number" && Number.isSafeInteger(scheduledEveryMs) && scheduledEveryMs > 0));
}
async function resolveHeartbeatPreflight(params) {
	let monitorScratch;
	try {
		monitorScratch = await readCronScratchSnapshot(resolveCronJobsStorePathFromConfig(params.cfg), {
			kind: "heartbeat",
			agentId: params.agentId
		});
	} catch (error) {
		heartbeatLog.warn(`heartbeat: scratch read failed: ${formatErrorMessage(error)}`);
	}
	const wakeFlags = resolveHeartbeatWakePayloadFlags({
		source: params.source,
		reason: params.reason
	});
	const session = resolveHeartbeatSessionSelection(params.cfg, params.agentId, params.heartbeat, params.sessionKey);
	const pendingEventEntries = peekSystemEventEntries(resolveSystemEventQueueKey(session.sessionKey, params.agentId)).filter((event) => !isHeartbeatDeliveryAwarenessEvent(event));
	const turnSourceDeliveryContext = resolveSystemEventDeliveryContext(pendingEventEntries);
	const hasTaggedCronEvents = pendingEventEntries.some((event) => event.contextKey?.startsWith("cron:"));
	const shouldInspectWakePendingEvents = wakeFlags.isWakePayload && session.inspectsRunQueue;
	const shouldInspectPendingEvents = wakeFlags.isExecEventWake || wakeFlags.isCronWake || shouldInspectWakePendingEvents || hasTaggedCronEvents;
	const shouldBypassScratchGates = wakeFlags.isExecEventWake || wakeFlags.isCronWake || wakeFlags.isWakePayload || hasTaggedCronEvents;
	const heartbeatScratchContent = monitorScratch?.state.scratch?.content;
	const basePreflight = {
		...wakeFlags,
		session,
		pendingEventEntries,
		turnSourceDeliveryContext,
		shouldInspectPendingEvents,
		authoritativeScheduledTick: typeof params.scheduledEveryMs === "number" && Number.isSafeInteger(params.scheduledEveryMs) && params.scheduledEveryMs > 0,
		...monitorScratch?.jobId ? {
			scratchJobId: monitorScratch.jobId,
			scratchRevision: monitorScratch.state.currentRevision
		} : {},
		...!shouldBypassScratchGates && heartbeatScratchContent !== void 0 ? { heartbeatScratchContent } : {}
	};
	if (wakeFlags.isExecEventWake && !basePreflight.authoritativeScheduledTick && !params.scheduledTasks?.length && !hasTaggedCronEvents && !pendingEventEntries.some((event) => isExecCompletionEvent(event.text))) return {
		...basePreflight,
		skipReason: HEARTBEAT_SKIP_NO_PENDING_EVENT
	};
	if (shouldBypassScratchGates || params.scheduledTasks?.length || heartbeatScratchContent === void 0) return basePreflight;
	if (isHeartbeatContentEffectivelyEmpty(heartbeatScratchContent)) return {
		...basePreflight,
		skipReason: "empty-heartbeat-file"
	};
	return basePreflight;
}
function appendHeartbeatScratch(prompt, heartbeatScratchContent) {
	if (!heartbeatScratchContent) return prompt;
	const directives = heartbeatScratchContent.trim();
	if (!directives || prompt.includes(directives)) return prompt;
	return `${prompt}\n\nHeartbeat monitor scratch:\n${directives}`;
}
function resolveHeartbeatRunPrompt(params) {
	const pendingEventEntries = params.preflight.pendingEventEntries;
	const genericEvents = [];
	const cronEvents = [];
	const execEvents = [];
	const cronNoise = [];
	for (const event of pendingEventEntries) if (event.contextKey?.startsWith("session-created:")) genericEvents.push(event);
	else if (isExecCompletionEvent(event.text)) {
		if (params.preflight.shouldInspectPendingEvents) execEvents.push(event);
	} else if (params.preflight.isCronWake || event.contextKey?.startsWith("cron:")) (isCronSystemEvent(event.text) ? cronEvents : cronNoise).push(event);
	else genericEvents.push(event);
	const hasExecCompletion = execEvents.length > 0;
	const hasRelayableExecCompletion = params.canRelayToUser && execEvents.some((event) => isRelayableExecCompletionEvent(event.text));
	const hasCronEvents = cronEvents.length > 0;
	const hasBackgroundTaskEvent = params.preflight.session.inspectsRunQueue && genericEvents.some((event) => event.contextKey?.startsWith("task:"));
	if (params.scheduledTasks.length > 0) return {
		prompt: appendHeartbeatScratch(`Run the following periodic tasks (only those due based on their intervals):

${params.scheduledTasks.map((task) => `- ${task.name}: ${task.prompt}`).join("\n")}

${params.useHeartbeatResponseTool ? `After completing all due tasks:\n${HEARTBEAT_RESPONSE_TOOL_INSTRUCTIONS}` : `After completing all due tasks, reply ${SILENT_REPLY_TOKEN}.`}`, params.heartbeatScratchContent),
		hasTaskContinuation: hasBackgroundTaskEvent,
		hasExecCompletion: false,
		hasRelayableExecCompletion: false,
		hasCronEvents: false,
		usesHeartbeatResponseTool: params.useHeartbeatResponseTool,
		genericEvents,
		inspectedSystemEventsToConsume: cronNoise
	};
	return {
		prompt: appendHeartbeatScratch(hasExecCompletion || hasCronEvents ? (hasExecCompletion ? buildExecEventPrompt : buildCronEventPrompt)((hasExecCompletion ? execEvents : cronEvents).map((event) => event.text), {
			deliverToUser: params.canRelayToUser,
			useHeartbeatResponseTool: params.useHeartbeatResponseTool
		}) : params.useHeartbeatResponseTool ? resolveHeartbeatResponseToolPrompt(params.cfg, params.heartbeat) : resolveConfiguredHeartbeatPrompt(params.cfg, params.heartbeat), params.heartbeatScratchContent),
		hasTaskContinuation: hasExecCompletion || hasBackgroundTaskEvent || cronEvents.some((event) => event.contextKey?.startsWith("task:")),
		hasExecCompletion,
		hasRelayableExecCompletion,
		hasCronEvents,
		usesHeartbeatResponseTool: params.useHeartbeatResponseTool,
		genericEvents,
		inspectedSystemEventsToConsume: [...cronNoise, ...hasExecCompletion ? execEvents : cronEvents]
	};
}
//#endregion
//#region src/infra/heartbeat-delivery-normalization.ts
function stripLeadingHeartbeatResponsePrefix(text, responsePrefix) {
	const normalizedPrefix = responsePrefix?.trim();
	if (!normalizedPrefix) return text;
	const prefixPattern = new RegExp(`^${escapeRegExp(normalizedPrefix)}(?=$|\\s|[\\p{P}\\p{S}])\\s*`, "iu");
	return text.replace(prefixPattern, "");
}
function isStreamErrorFallbackPlaceholderOnly(text) {
	let remaining = text.trim();
	if (!remaining) return false;
	while (remaining.startsWith(STREAM_ERROR_FALLBACK_TEXT)) remaining = remaining.slice(STREAM_ERROR_FALLBACK_TEXT.length).trimStart();
	return remaining.length === 0;
}
const TRAILING_HEARTBEAT_NOTIFY_FALSE_RE = /(?:^|[\r\n])[ \t]*notify=false[ \t]*(?:\r?\n[ \t]*)*$/i;
function stripTrailingHeartbeatNotifyFalse(text) {
	const match = TRAILING_HEARTBEAT_NOTIFY_FALSE_RE.exec(text);
	return match ? {
		text: text.slice(0, match.index).trimEnd(),
		silent: true
	} : {
		text,
		silent: false
	};
}
function normalizeHeartbeatReply(payload, responsePrefix, ackMaxChars, mode = "heartbeat") {
	const textForStrip = stripLeadingHeartbeatResponsePrefix(typeof payload.text === "string" ? payload.text : "", responsePrefix);
	const isSilentReply = isSilentReplyPayloadText(textForStrip);
	const stripped = stripHeartbeatToken(isSilentReply ? "" : textForStrip, {
		mode,
		maxAckChars: ackMaxChars
	});
	const hasMedia = resolveSendableOutboundReplyParts(payload).hasMedia;
	const notifyFalse = stripTrailingHeartbeatNotifyFalse(stripped.text);
	notifyFalse.silent ||= isSilentReply;
	const isInternalPlaceholderOnly = isStreamErrorFallbackPlaceholderOnly(notifyFalse.text);
	let finalText = stripped.shouldSkip && !hasMedia || isInternalPlaceholderOnly ? "" : notifyFalse.text;
	if (responsePrefix && finalText && !finalText.startsWith(responsePrefix)) finalText = `${responsePrefix} ${finalText}`;
	return {
		shouldSkip: !hasMedia && finalText.trim().length === 0,
		text: finalText,
		hasMedia,
		isInternalPlaceholderOnly,
		...notifyFalse.silent ? { silent: true } : {}
	};
}
function normalizeHeartbeatToolNotification(response, responsePrefix) {
	let finalText = getHeartbeatToolNotificationText(response);
	if (responsePrefix && finalText && !finalText.startsWith(responsePrefix)) finalText = `${responsePrefix} ${finalText}`;
	return {
		shouldSkip: finalText.trim().length === 0,
		text: finalText,
		hasMedia: false,
		isInternalPlaceholderOnly: false,
		...response.notify ? {} : { silent: true }
	};
}
function classifyHeartbeatAgentOutcome(params) {
	const { agentRunFailed, heartbeatToolResponse, heartbeatTerminalToolFailure, replyPayload } = params.agentRun;
	const replyMetadata = replyPayload ? getReplyPayloadMetadata(replyPayload) : void 0;
	const hasExplicitFailure = Boolean(heartbeatTerminalToolFailure || agentRunFailed);
	const shouldSuppressSourceReply = params.suppressUnmarkedSourceReplies && !params.hasRelayableExecCompletion && replyPayload && replyPayload.isError !== true && replyMetadata?.deliverDespiteSourceReplySuppression !== true && (!hasExplicitFailure && !heartbeatToolResponse || agentRunFailed && !heartbeatTerminalToolFailure);
	if (heartbeatToolResponse && !heartbeatToolResponse.notify && !hasExplicitFailure) return {
		kind: "ack",
		eventStatus: "ok-token",
		preview: truncateHeartbeatPreview(heartbeatToolResponse.summary),
		response: heartbeatToolResponse
	};
	if (shouldSuppressSourceReply && !hasExplicitFailure) return {
		kind: "ack",
		eventStatus: "ok-token",
		silent: true
	};
	if (!heartbeatToolResponse && !hasExplicitFailure && (!replyPayload || !hasOutboundReplyContent(replyPayload))) return {
		kind: "ack",
		eventStatus: "ok-empty"
	};
	const mode = params.hasRelayableExecCompletion ? "message" : "heartbeat";
	const normalized = heartbeatToolResponse && !shouldSuppressSourceReply && !(hasExplicitFailure && replyPayload) ? normalizeHeartbeatToolNotification(heartbeatToolResponse, params.responsePrefix) : normalizeHeartbeatReply(shouldSuppressSourceReply ? {} : replyPayload ?? {}, params.responsePrefix, params.ackMaxChars, mode);
	if (agentRunFailed && params.useHeartbeatFailureCopy) {
		const replacement = replaceGenericExternalRunFailureText(normalized.text);
		if (replacement.replaced) {
			normalized.text = replacement.text;
			normalized.shouldSkip = false;
		}
	}
	const hasStructuredReplyContent = !shouldSuppressSourceReply && (!heartbeatToolResponse || agentRunFailed) && replyPayload !== void 0 && hasOutboundReplyContent({
		...replyPayload,
		text: void 0,
		mediaUrl: void 0,
		mediaUrls: void 0
	});
	const shouldSkipMain = !agentRunFailed && heartbeatToolResponse?.notify === false || normalized.shouldSkip && !normalized.hasMedia && (!hasStructuredReplyContent || normalized.isInternalPlaceholderOnly);
	if (hasExplicitFailure) return {
		kind: "failure",
		reason: heartbeatTerminalToolFailure ? "agent-tool-failure" : "agent-runner-failure",
		...heartbeatTerminalToolFailure ? { previewText: heartbeatToolResponse?.summary || heartbeatTerminalToolFailure.toolName } : {},
		replyPayload: shouldSuppressSourceReply ? void 0 : replyPayload,
		normalized,
		shouldSkipMain
	};
	if (shouldSkipMain) return {
		kind: "ack",
		eventStatus: "ok-token",
		silent: normalized.silent && !(mode === "heartbeat" && isSilentReplyPayloadText(replyPayload?.text))
	};
	return {
		kind: "delivery",
		response: heartbeatToolResponse,
		normalized,
		hasStructuredReplyContent,
		replyPayload: heartbeatToolResponse ? void 0 : replyPayload,
		mediaUrls: heartbeatToolResponse || !replyPayload ? [] : resolveSendableOutboundReplyParts(replyPayload).mediaUrls
	};
}
//#endregion
//#region src/infra/heartbeat-session-publication.ts
/** Publishes an admitted heartbeat final before its completion occurrences can settle. */
async function publishHeartbeatSessionReply(params) {
	let acceptedPublication;
	try {
		const { text, mediaUrls } = resolveSendableOutboundReplyParts(params.payload);
		const occurrences = [...new Set(params.occurrenceIds)].toSorted();
		if (occurrences.length === 0 || occurrences.some((id) => !id.trim())) return {
			ok: false,
			reason: "heartbeat session publication has no completion identity"
		};
		const scope = {
			agentId: params.agentId,
			storePath: params.storePath,
			sessionKey: params.sessionKey,
			sessionId: params.expectedGeneration.sessionId
		};
		const assertOwnedWrite = captureOwnedTranscriptWriteAssertion(scope);
		const metadata = getReplyPayloadMetadata(params.payload);
		const authority = metadata?.sessionWriterDeliveryAuthority;
		const initial = loadSessionEntryReadOnly({
			...scope,
			readConsistency: "latest"
		});
		const writerRunId = authority?.expectedWriterRunId ?? initial?.activeWriterRunId;
		const expected = {
			expectedSessionId: scope.sessionId,
			expectedLifecycleRevision: params.expectedGeneration.lifecycleRevision ?? null,
			...writerRunId ? { expectedWriterRunId: writerRunId } : {}
		};
		const assertCurrent = () => {
			params.signal?.throwIfAborted();
			assertOwnedWrite();
			if (authority && (authority.sessionKey !== scope.sessionKey || authority.agentId !== void 0 && authority.agentId !== scope.agentId || authority.expectedSessionId !== scope.sessionId || authority.expectedLifecycleRevision !== void 0 && authority.expectedLifecycleRevision !== params.expectedGeneration.lifecycleRevision)) throw new Error("heartbeat publication no longer owns the active transcript");
		};
		const assertTargetCurrent = (messageId) => {
			assertCurrent();
			const current = loadSessionEntryReadOnly({
				...scope,
				readConsistency: "latest"
			});
			if (!scope.sessionId || current?.sessionId !== scope.sessionId || current.lifecycleRevision !== params.expectedGeneration.lifecycleRevision || current.activeWriterRunId !== writerRunId || messageId && !readActiveTranscriptEntryAnchor({
				...scope,
				entryId: messageId
			})) throw new Error("heartbeat publication no longer owns the active transcript");
			const unavailable = resolveSessionWorkStartError(scope.sessionKey, current, {
				...expected,
				purpose: "accepted-result-settlement"
			});
			if (unavailable) throw new Error(unavailable);
		};
		assertTargetCurrent();
		const mirror = metadata?.sourceReplyTranscriptMirror?.transcriptOwner ? metadata.sourceReplyTranscriptMirror : void 0;
		if (mirror && (!mirror.idempotencyKey || mirror.sessionKey !== scope.sessionKey || mirror.expectedSessionId && mirror.expectedSessionId !== scope.sessionId || mirror.agentId && mirror.agentId !== scope.agentId)) return {
			ok: false,
			reason: "heartbeat source receipt belongs to another target"
		};
		const owned = metadata?.assistantTranscriptOwned === true || metadata?.assistantMessageIndex !== void 0 || mirror !== void 0;
		if (!owned && (!text.trim() || mediaUrls.length > 0)) return {
			ok: false,
			reason: "heartbeat session publication requires a text-only reply"
		};
		const key = `heartbeat-completion:${createHash("sha256").update(JSON.stringify([
			scope.sessionId,
			expected.expectedLifecycleRevision,
			occurrences
		])).digest("hex")}`;
		const ownedKey = mirror?.idempotencyKey ?? metadata?.assistantTranscriptIdempotencyKey;
		const lookupKey = owned ? ownedKey : key;
		let prior = lookupKey && (!owned || mirror || writerRunId) ? await findTranscriptEvent(scope, {
			kind: "idempotency",
			key: lookupKey,
			assistant: true,
			...owned && mirror ? { deliveryMirror: true } : {},
			...owned && !mirror ? { runId: writerRunId } : {}
		}) : void 0;
		if (owned && !ownedKey && writerRunId) prior = await findTranscriptEvent(scope, {
			kind: "active-assistant",
			runId: writerRunId
		});
		const priorMessage = prior && readTranscriptEventMessage(prior.event);
		const priorId = prior && readTranscriptEventId(prior.event);
		const answer = parseReplyDirectives(resolveRawAssistantAnswerText(priorMessage));
		const originalMedia = mirror?.mediaUrls ?? metadata?.assistantTranscriptMediaUrls ?? mediaUrls;
		const storedMedia = asOptionalRecord(priorMessage?.openclawDelivery)?.mediaUrls;
		const displayMedia = readAssistantDisplayContent(priorMessage).filter((block) => [
			"image",
			"audio",
			"video",
			"attachment"
		].includes(String(block.type)));
		const receiptMedia = displayMedia.length > 0 && Array.isArray(storedMedia) && storedMedia.every((source) => typeof source === "string") ? storedMedia : answer.mediaUrls ?? [];
		const matchesMedia = (displayMedia.length === 0 || displayMedia.length === originalMedia.length) && receiptMedia.length === originalMedia.length && originalMedia.length === mediaUrls.length && receiptMedia.every((source, index) => normalizeMediaReferenceForComparison(source) === normalizeMediaReferenceForComparison(originalMedia[index]));
		if (prior && (!priorMessage || !priorId) || owned && (!priorId || !priorMessage || !text.trim() && mediaUrls.length === 0 || answer.text.trim() !== (mirror ? mirror.text ?? "" : params.sourceText ?? text).trim() || !matchesMedia)) return {
			ok: false,
			reason: "heartbeat runtime final has no matching committed receipt"
		};
		assertTargetCurrent(priorId);
		const content = [{
			type: "text",
			text: text.trim()
		}];
		const message = owned && priorMessage ? priorMessage : {
			...priorMessage ?? {
				role: "assistant",
				content,
				api: "openclaw-transcript",
				provider: "openclaw",
				model: "automation-result",
				usage: makeZeroUsageSnapshot(),
				stopReason: "stop",
				timestamp: Date.now(),
				idempotencyKey: key
			},
			content
		};
		const attachMedia = displayMedia.length > 0 ? (await import("./managed-image-attachments-Dw1dKNTm.mjs")).attachManagedOutgoingMediaToMessage : void 0;
		assertTargetCurrent(priorId);
		const committed = await persistSessionTranscriptTurn(scope, {
			...expected,
			config: params.cfg,
			assertCurrent,
			acceptedResultGuard: {
				expectedWriterRunId: writerRunId ?? null,
				errorMessage: "heartbeat publication no longer owns the active transcript"
			},
			messages: [{
				message,
				...priorId ? {
					eventId: priorId,
					predicate: {
						kind: "active-entry",
						entryId: priorId,
						errorMessage: "heartbeat publication no longer owns the active transcript"
					}
				} : {},
				idempotencyLookup: "scan"
			}],
			touchSessionEntry: !owned,
			updateMode: "none",
			onMessageCommitted: (receipt, acceptCompletion) => {
				assertTargetCurrent(receipt.messageId);
				const publish = () => {
					const messageSeq = readCommittedTranscriptMessageSequence(receipt);
					assertTargetCurrent(receipt.messageId);
					return publishTranscriptUpdate(scope, receipt.appended ? {
						lifecycleRevision: expected.expectedLifecycleRevision ?? void 0,
						message: receipt.message,
						messageId: receipt.messageId,
						...messageSeq !== void 0 ? { messageSeq } : {}
					} : {}).then(() => ({
						ok: true,
						messageId: receipt.messageId
					}), (error) => ({
						ok: false,
						reason: formatErrorMessage(error)
					}));
				};
				if (!attachMedia) {
					acceptedPublication = publish();
					return;
				}
				const completion = attachMedia({
					messageId: receipt.messageId,
					blocks: readAssistantDisplayContent(receipt.message)
				}).then((attached) => {
					if (!attached) throw new Error("heartbeat source receipt media custody is unavailable");
					return publish();
				});
				acceptedPublication = completion.catch((error) => ({
					ok: false,
					reason: formatErrorMessage(error)
				}));
				acceptCompletion(async () => {
					await completion;
				});
			}
		});
		return acceptedPublication ?? {
			ok: false,
			reason: committed.rejectedReason ?? "heartbeat publication rejected"
		};
	} catch (error) {
		if (acceptedPublication) {
			const receipt = await acceptedPublication;
			if (receipt.ok) heartbeatLog.warn("heartbeat: publication accepted before owned-write cleanup failed", { error: formatErrorMessage(error) });
			return receipt;
		}
		return {
			ok: false,
			reason: formatErrorMessage(error)
		};
	}
}
//#endregion
//#region src/infra/heartbeat-dispatch.ts
function createHeartbeatDispatch(opts, wake, prepared) {
	const policy = {
		opts,
		wake,
		prepared,
		prepareReply: (result, state) => prepareHeartbeatDispatchReply(policy, result, state)
	};
	return policy;
}
const FIRST_HEARTBEAT_ALERT_PREAMBLE = "First heartbeat alert: your bot runs periodic background checks and messages you only when something needs attention. Run `openclaw config set agents.defaults.heartbeat.target \"none\"` to keep these internal.";
const MAX_HEARTBEAT_TARGET_AWARENESS_CHARS = 1e3;
function prepareHeartbeatTargetAwareness(params) {
	const sessionKey = params.targetSessionKey?.trim();
	if (!sessionKey || sessionKey === params.runSessionKey) return;
	try {
		if (resolveAgentIdFromSessionKey(sessionKey, params.agentId) !== params.agentId) return;
		const scope = {
			agentId: params.agentId,
			storePath: params.storePath,
			sessionKey
		};
		const entry = loadExactSessionEntryReadOnly(scope)?.entry;
		if (!entry?.sessionId) return;
		const expectedSessionId = entry.sessionId;
		const expectedLifecycleRevision = entry.lifecycleRevision;
		const idempotencyKey = `${HEARTBEAT_DELIVERY_CONTEXT_KEY_PREFIX}${params.startedAt}:${params.runSessionKey}`;
		return (payload) => {
			try {
				const latest = loadExactSessionEntryReadOnly(scope)?.entry;
				if (latest?.sessionId !== expectedSessionId || latest.lifecycleRevision !== expectedLifecycleRevision) return;
				const deliveredText = resolveMirroredTranscriptText({
					text: payload.hookContent ?? resolveOutboundPayloadMirrorText(payload),
					mediaUrls: payload.mediaUrls
				});
				if (!deliveredText) return;
				const text = truncateUtf16Safe(deliveredText, MAX_HEARTBEAT_TARGET_AWARENESS_CHARS);
				const suffix = text.length < deliveredText.length ? "\n[truncated]" : "";
				enqueueSystemEvent(`A heartbeat delivered this message to this channel:\n${text}${suffix}`, withSystemEventOwner({
					sessionKey,
					contextKey: idempotencyKey
				}, params.agentId));
			} catch (error) {
				heartbeatLog.warn("heartbeat: failed to queue target session awareness", { error: formatErrorMessage(error) });
			}
		};
	} catch (error) {
		heartbeatLog.warn("heartbeat: failed to resolve existing target session projection", { error: formatErrorMessage(error) });
		return;
	}
}
/** Monitoring decides which final is public before ordinary dispatch can send it. */
async function prepareHeartbeatDispatchReply(policy, replyResult, runState) {
	const { opts, wake, prepared } = policy;
	const { cfg, agentId, startedAt, preflight, scheduledTasks, wakeSource } = wake;
	const { delivery, visibility, sessionKey, storePath, runSessionKey, previousUpdatedAt } = prepared;
	const replies = replyResult ? Array.isArray(replyResult) ? replyResult : [replyResult] : [];
	const selected = resolveHeartbeatReplyPayload(replyResult);
	const execution = resolveReplyOperationAgentTurn(runState);
	const heartbeatResponse = selectHeartbeatToolResponse(replyResult);
	const response = heartbeatResponse?.response;
	const admissionBusy = runState.admission?.status === "skipped" && runState.admission.reason === "active-run" && !response && (!selected || !hasOutboundReplyContent(selected));
	if (execution === "cancelled" || execution === "superseded" || admissionBusy) {
		const reason = execution === "superseded" ? "preempted" : execution === "cancelled" ? "agent-runner-cancelled" : HEARTBEAT_SKIP_REQUESTS_IN_FLIGHT;
		policy.result = {
			status: "skipped",
			reason
		};
		emitHeartbeatEvent({
			status: "skipped",
			reason,
			durationMs: Date.now() - startedAt
		});
		return {};
	}
	const channel = delivery.channel !== "none" ? delivery.channel : void 0;
	const committed = resolveMessagingToolPayloadDedupe({
		config: cfg,
		messageProvider: channel,
		originatingTo: delivery.to,
		originatingThreadId: delivery.threadId,
		accountId: delivery.accountId,
		messagingToolSentTargets: runState.messagingToolSentTargets
	});
	const failure = resolveHeartbeatTerminalToolFailure(replyResult);
	const responsePrefix = resolveResponsePrefixTemplate(prepared.replyPrefix.responsePrefix, prepared.replyPrefix.responsePrefixContextProvider());
	const outcome = classifyHeartbeatAgentOutcome({
		agentRun: {
			agentRunFailed: execution === "failed",
			heartbeatToolResponse: response,
			heartbeatTerminalToolFailure: failure,
			replyPayload: selected
		},
		useHeartbeatFailureCopy: prepared.useHeartbeatFailureCopy,
		hasRelayableExecCompletion: prepared.hasRelayableExecCompletion,
		suppressUnmarkedSourceReplies: resolveSourceReplyDeliveryMode({
			cfg,
			ctx: {
				ChatType: delivery.chatType,
				Provider: delivery.channel
			}
		}) === "message_tool_only",
		responsePrefix,
		ackMaxChars: 300
	});
	const scratch = outcome.kind === "failure" || !heartbeatResponse ? void 0 : getReplyPayloadMetadata(heartbeatResponse.payload)?.heartbeatScratchProposal;
	if (scratch !== void 0 && response) {
		if (!preflight.scratchJobId) heartbeatLog.warn("heartbeat: scratch update ignored because no monitor job exists");
		else try {
			const owner = runState.agentTurnOwner;
			if (!(await writeCronJobScratch({
				storePath: resolveCronJobsStorePathFromConfig(cfg),
				jobId: preflight.scratchJobId,
				content: scratch,
				expectedRevision: preflight.scratchRevision ?? 0
			}, { assertCurrent() {
				if (runState.agentTurnOwner !== owner || resolveReplyOperationAbortReason(owner)) throw new Error("Heartbeat scratch writer is no longer current");
			} })).ok) heartbeatLog.warn("heartbeat: scratch update lost a concurrent revision race");
		} catch (error) {
			heartbeatLog.warn(`heartbeat: scratch update failed: ${formatErrorMessage(error)}`);
		}
	}
	for (const reply of replies) if (execution !== "failed" && response?.notify === false || reply !== selected && outcome.kind !== "failure") await suppressPendingFinalDelivery(reply, { preserveActivity: true });
	const finish = (event, consume = true) => {
		emitHeartbeatEvent({
			...event,
			...committed.matchingRoute && event.silent === true ? { silent: false } : {},
			durationMs: Date.now() - startedAt,
			accountId: delivery.accountId
		});
		if (consume && preflight.shouldInspectPendingEvents) {
			consumeSelectedSystemEventEntries(resolveSystemEventQueueKey(sessionKey, agentId), [...prepared.inspectedSystemEventsToConsume, ...prepared.deferredGenericEvents]);
			if (prepared.hasExecCompletion && prepared.hasCronEvents) requestSessionEventWake({
				source: "cron",
				intent: "immediate",
				reason: "cron:pending",
				agentId,
				sessionKey,
				heartbeat: wake.heartbeat && {
					...wake.heartbeat.target !== void 0 ? { target: wake.heartbeat.target } : {},
					...wake.heartbeat.to !== void 0 ? { to: wake.heartbeat.to } : {},
					...wake.heartbeat.accountId !== void 0 ? { accountId: wake.heartbeat.accountId } : {}
				}
			});
		}
		policy.result = outcome.kind === "failure" ? {
			status: "failed",
			reason: outcome.reason
		} : {
			status: "ran",
			durationMs: Date.now() - startedAt
		};
	};
	const stateKey = prepared.outboundPolicySessionKey ?? sessionKey;
	const record = (value) => persistHeartbeatOutcome({
		agentId,
		sessionKey: stateKey,
		storePath,
		runSessionKey,
		response: value,
		taskNames: scheduledTasks.map((task) => task.name),
		wakeSource,
		wakeReason: opts.reason,
		occurredAt: startedAt
	});
	const unconfirmed = async (reason) => {
		if (outcome.kind !== "delivery" || !outcome.response) return;
		const value = outcome.response;
		await record({
			...value,
			outcome: "blocked",
			notify: false,
			summary: `Alert delivery was not confirmed for this attempt.\n${value.notificationText ?? value.summary}${value.notificationText ? `\nModel summary: ${value.summary}` : ""}`,
			reason: `notify:true; delivery=${reason}; model outcome=${value.outcome}; ${value.reason ?? value.summary}`
		});
	};
	const restoreActivity = () => restoreHeartbeatUpdatedAt({
		agentId,
		storePath,
		sessionKey,
		updatedAt: previousUpdatedAt
	});
	const suppressSelected = () => suppressPendingFinalDelivery(selected, { preserveActivity: true });
	if (outcome.kind === "ack") {
		if ("response" in outcome && outcome.response) await record(outcome.response);
		await restoreActivity();
		await suppressSelected();
		const aborted = resolveReplyOperationAbortReason(runState.agentTurnOwner);
		if (aborted) {
			const reason = aborted === "superseded" ? "preempted" : "agent-runner-cancelled";
			policy.result = {
				status: "skipped",
				reason
			};
			emitHeartbeatEvent({
				status: "skipped",
				reason,
				durationMs: Date.now() - startedAt
			});
			return {};
		}
		if (committed.matchingRoute) {
			finish({
				status: "sent",
				to: delivery.to,
				preview: truncateHeartbeatPreview(committed.routeSentTexts.join("\n")),
				hasMedia: committed.routeSentMediaUrls.length > 0,
				channel,
				indicatorType: visibility.useIndicator ? resolveIndicatorType("sent") : void 0,
				silent: false
			});
			return {};
		}
		if (runState.backgroundWorkStarted) {
			finish({
				status: "skipped",
				reason: "background-work",
				message: "Heartbeat started background work; completion is tracked separately.",
				channel,
				silent: true
			});
			return {};
		}
		const event = {
			status: outcome.eventStatus,
			reason: opts.reason,
			..."preview" in outcome ? { preview: outcome.preview } : {},
			channel,
			indicatorType: visibility.useIndicator ? resolveIndicatorType(outcome.eventStatus) : void 0
		};
		if (!("silent" in outcome && outcome.silent) && visibility.showOk && channel && delivery.to) {
			const readiness = await resolveHeartbeatChannelPlugin(channel)?.heartbeat?.checkReady?.({
				cfg,
				accountId: delivery.accountId,
				deps: opts.deps
			}).catch((error) => {
				heartbeatLog.warn(`heartbeat: HEARTBEAT_OK delivery failed: ${formatErrorMessage(error)}`);
				return { ok: false };
			});
			if (!readiness || readiness.ok) return {
				reply: setReplyPayloadMetadata({ text: responsePrefix ? `${responsePrefix} ${HEARTBEAT_TOKEN}` : HEARTBEAT_TOKEN }, {
					heartbeatReply: true,
					deliverDespiteSourceReplySuppression: true
				}),
				settle: async (result) => {
					if (policy.deliveryError) heartbeatLog.warn(`heartbeat: HEARTBEAT_OK delivery failed: ${policy.deliveryError}`);
					finish({
						...event,
						silent: result !== "delivered"
					});
				}
			};
		}
		finish({
			...event,
			silent: true
		});
		return {};
	}
	const stateEntry = prepared.policySessionEntry;
	const failed = outcome.kind === "failure";
	const normalized = outcome.normalized;
	const text = normalized.text;
	const preview = truncateHeartbeatPreview(failed ? text || outcome.previewText : text);
	const event = {
		status: failed ? "failed" : "sent",
		...failed ? { reason: outcome.reason } : {},
		preview,
		channel,
		indicatorType: failed && visibility.useIndicator ? resolveIndicatorType("failed") : void 0
	};
	if (failed) await restoreActivity();
	else {
		const previousAt = stateEntry?.lastHeartbeatSentAt;
		if (!prepared.internalProjection && !outcome.mediaUrls.length && !outcome.hasStructuredReplyContent && stateEntry?.lastHeartbeatText?.trim() && text.trim() === stateEntry.lastHeartbeatText.trim() && typeof previousAt === "number" && previousAt <= startedAt && startedAt - previousAt < 864e5) {
			await restoreActivity();
			await suppressSelected();
			finish({
				status: "skipped",
				reason: "duplicate",
				preview,
				hasMedia: false,
				channel
			});
			return {};
		}
	}
	const noChannelTarget = !prepared.internalProjection && (!channel || !delivery.to);
	if (noChannelTarget || !visibility.showAlerts || failed && outcome.shouldSkipMain) {
		if (!failed) {
			await unconfirmed(noChannelTarget ? delivery.reason ?? "no-target" : "alerts-disabled");
			if (!visibility.showAlerts) await restoreActivity();
			await suppressSelected();
		}
		finish(failed ? {
			...event,
			silent: true
		} : {
			...event,
			status: "skipped",
			reason: noChannelTarget ? delivery.reason ?? "no-target" : "alerts-disabled",
			hasMedia: outcome.mediaUrls.length > 0,
			indicatorType: !noChannelTarget && visibility.useIndicator ? resolveIndicatorType("sent") : void 0
		}, !failed);
		return {};
	}
	const readiness = channel ? await resolveHeartbeatChannelPlugin(channel)?.heartbeat?.checkReady?.({
		cfg,
		accountId: delivery.accountId,
		deps: opts.deps
	}).catch((error) => ({
		ok: false,
		reason: formatErrorMessage(error)
	})) : void 0;
	if (readiness && !readiness.ok) {
		await unconfirmed(readiness.reason ?? "channel-not-ready");
		await restoreActivity();
		finish({
			...event,
			status: failed ? "failed" : "skipped",
			reason: failed ? outcome.reason : readiness.reason,
			...failed ? { silent: true } : {}
		}, false);
		if (!failed) policy.result = {
			status: "skipped",
			reason: HEARTBEAT_SKIP_CHANNEL_NOT_READY,
			retryAtMs: Date.now() + SESSION_EVENT_IDLE_RETRY_MS
		};
		return {};
	}
	policy.deliverySilent = normalized.silent;
	policy.projectTarget = !failed;
	policy.publicationSourceText = outcome.replyPayload?.text;
	const deliveryText = !failed && delivery.implicitDefaultRoute && stateEntry?.lastHeartbeatSentAt === void 0 ? `${FIRST_HEARTBEAT_ALERT_PREAMBLE}\n${text}` : text;
	const payload = copyReplyPayloadMetadata(selected ?? {}, {
		...outcome.replyPayload,
		text: deliveryText || void 0,
		...!failed ? { mediaUrls: outcome.mediaUrls } : {}
	});
	return {
		reply: setReplyPayloadMetadata(markReplyPayloadForSourceSuppressionDelivery(payload), { heartbeatReply: true }),
		settle: async (result) => {
			const sent = result === "delivered";
			if (!sent) await unconfirmed(policy.deliveryError ?? policy.deliveryReason ?? result);
			if (sent && !failed && deliveryText.trim()) await patchSessionEntryCore({
				agentId,
				storePath,
				sessionKey: stateKey
			}, (current, context) => (context.existingEntry ? current.sessionId === stateEntry?.sessionId && current.lifecycleRevision === stateEntry?.lifecycleRevision : stateEntry === void 0) ? {
				lastHeartbeatText: text,
				lastHeartbeatSentAt: startedAt
			} : null, {
				fallbackEntry: mergeSessionEntry(void 0, { updatedAt: startedAt }),
				preserveActivity: true
			});
			finish(failed ? {
				...event,
				silent: !sent || normalized.silent === true
			} : {
				...event,
				status: sent ? "sent" : policy.deliveryError ? "failed" : "skipped",
				indicatorType: visibility.useIndicator ? resolveIndicatorType(sent ? "sent" : policy.deliveryError ? "failed" : "skipped") : void 0,
				...!sent ? { reason: policy.deliveryError ?? policy.deliveryReason ?? result } : {},
				to: delivery.to,
				preview: truncateHeartbeatPreview(deliveryText),
				hasMedia: outcome.mediaUrls.length > 0,
				...normalized.silent === true ? { silent: true } : {}
			}, sent && !failed);
			if (policy.deliveryError && !failed) policy.result = {
				status: "failed",
				reason: policy.deliveryError
			};
		}
	};
}
/** The core dispatcher owns custody; monitoring supplies its existing transport policy. */
async function deliverHeartbeatDispatch(policy, payload, signal) {
	const { cfg, agentId, startedAt } = policy.wake;
	const { delivery, runSessionKey, storePath, outboundPolicySessionKey, internalProjection } = policy.prepared;
	const onDeliveredPayload = policy.projectTarget ? prepareHeartbeatTargetAwareness({
		agentId,
		storePath,
		runSessionKey,
		targetSessionKey: delivery.targetSessionKey,
		startedAt
	}) : void 0;
	try {
		if (delivery.channel === "none" || !delivery.to) {
			if (!internalProjection || policy.projectTarget === false) return { visibleReplySent: false };
			const occurrenceIds = [...policy.prepared.inspectedSystemEventsToConsume, ...policy.prepared.deferredGenericEvents].map((event) => event.id);
			if (!occurrenceIds.every((id) => typeof id === "string" && id.length > 0)) {
				policy.deliveryReason = "exec completion occurrence identity unavailable";
				return { visibleReplySent: false };
			}
			const committed = await publishHeartbeatSessionReply({
				cfg,
				agentId,
				storePath,
				sessionKey: internalProjection.sessionKey,
				expectedGeneration: internalProjection,
				occurrenceIds,
				payload,
				sourceText: policy.publicationSourceText,
				signal
			});
			if (!committed.ok) policy.deliveryReason = committed.reason;
			return { visibleReplySent: committed.ok };
		}
		const send = await sendDurableMessageBatchCore({
			cfg,
			channel: delivery.channel,
			to: delivery.to,
			accountId: delivery.accountId,
			threadId: delivery.threadId,
			payloads: [payload],
			session: buildOutboundSessionContext({
				cfg,
				agentId,
				sessionKey: runSessionKey,
				policySessionKey: outboundPolicySessionKey
			}),
			identity: resolveAgentOutboundIdentity(cfg, agentId),
			deps: policy.opts.deps,
			signal,
			silent: policy.deliverySilent,
			onDeliveredPayload
		});
		if (send.status === "failed" || send.status === "partial_failed") throw send.error;
		if (send.status === "suppressed") policy.deliveryReason = send.reason;
		return {
			visibleReplySent: send.status === "sent",
			...send.status === "suppressed" && send.reason === "adapter_returned_no_identity" ? { ambiguous: true } : {}
		};
	} catch (error) {
		policy.deliveryError = formatErrorMessage(error);
		throw error;
	}
}
//#endregion
//#region src/infra/heartbeat-active-hours.ts
const ACTIVE_HOURS_TIME_PATTERN = /^(?:([01]\d|2[0-3]):([0-5]\d)|24:00)$/;
/** Resolve the formatter used to evaluate heartbeat active hours. */
function resolveActiveHoursFormatter(cfg, raw) {
	let timeZone = raw?.trim();
	const isExplicit = timeZone && timeZone !== "user" && timeZone !== "local";
	if (!timeZone || timeZone === "user") timeZone = resolveUserTimezone(cfg.agents?.defaults?.userTimezone);
	else if (timeZone === "local") timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone?.trim() || "UTC";
	try {
		return new Intl.DateTimeFormat("en-US", {
			timeZone,
			hour: "2-digit",
			minute: "2-digit",
			hourCycle: "h23"
		});
	} catch {
		return isExplicit ? resolveActiveHoursFormatter(cfg) : null;
	}
}
function parseActiveHoursTime(allow24, raw) {
	if (!raw || !ACTIVE_HOURS_TIME_PATTERN.test(raw)) return null;
	const [hourStr, minuteStr] = raw.split(":");
	const hour = Number(hourStr);
	const minute = Number(minuteStr);
	return hour === 24 && !allow24 ? null : hour * 60 + minute;
}
function resolveMinutesInTimeZone(nowMs, formatter) {
	try {
		const parts = formatter.formatToParts(new Date(nowMs));
		const map = {};
		for (const part of parts) if (part.type !== "literal") map[part.type] = part.value;
		const hour = Number(map.hour);
		const minute = Number(map.minute);
		if (!Number.isFinite(hour) || !Number.isFinite(minute)) return null;
		return hour * 60 + minute;
	} catch {
		return null;
	}
}
/** Return true when the current time is inside the configured heartbeat window. */
function isWithinActiveHours(cfg, heartbeat, nowMs) {
	const active = heartbeat?.activeHours;
	if (!active) return true;
	const startMin = parseActiveHoursTime(false, active.start);
	const endMin = parseActiveHoursTime(true, active.end);
	if (startMin === null || endMin === null) return true;
	if (startMin === endMin) return false;
	const formatter = resolveActiveHoursFormatter(cfg, active.timezone);
	if (!formatter) return true;
	const currentMin = resolveMinutesInTimeZone(nowMs ?? Date.now(), formatter);
	if (currentMin === null) return true;
	return endMin > startMin ? currentMin >= startMin && currentMin < endMin : currentMin >= startMin || currentMin < endMin;
}
//#endregion
//#region src/infra/heartbeat-runner-execution.ts
const CRON_COMMAND_LANE = "cron";
function hasActiveRunForAgent(agentId, listSessionKeys) {
	const normalizedAgentId = normalizeAgentId(agentId);
	return listSessionKeys().some((sessionKey) => {
		const parsed = parseAgentSessionKey(sessionKey);
		return parsed ? normalizeAgentId(parsed.agentId) === normalizedAgentId : false;
	});
}
function hasActiveRunForSession(sessionKey, listSessionKeys) {
	const normalizedSessionKey = sessionKey.trim();
	return Boolean(normalizedSessionKey) && listSessionKeys().includes(normalizedSessionKey);
}
function skippedHeartbeatStage(reason, startedAt) {
	emitHeartbeatEvent({
		status: "skipped",
		reason,
		durationMs: Date.now() - startedAt
	});
	return {
		kind: "skipped",
		reason
	};
}
async function resolveHeartbeatWakeStage(opts) {
	const cfg = opts.cfg ?? getRuntimeConfig();
	const explicitAgentId = typeof opts.agentId === "string" ? opts.agentId.trim() : "";
	const forcedSessionAgentId = explicitAgentId.length > 0 ? void 0 : parseAgentSessionKey(opts.sessionKey)?.agentId;
	const resolvedAgentId = explicitAgentId || forcedSessionAgentId || tryResolveAmbientHeartbeatAgentId(cfg);
	if (!resolvedAgentId) return {
		kind: "skipped",
		reason: "disabled"
	};
	const agentId = normalizeAgentId(resolvedAgentId);
	const wakeSource = opts.source ?? inferHeartbeatWakeSourceFromReason(opts.reason);
	const heartbeat = resolveHeartbeatForWake({
		cfg,
		agentId,
		requestedHeartbeat: opts.heartbeat,
		source: wakeSource
	});
	const scheduledTasks = [...opts.tasks ?? []].toSorted((left, right) => left.jobId.localeCompare(right.jobId));
	const allowsUnscheduledTarget = isTargetedUnscheduledWake(opts) && isConfiguredHeartbeatAgent(cfg, agentId);
	if (!areSessionEventWakesEnabled()) return {
		kind: "skipped",
		reason: "disabled"
	};
	if (!allowsUnscheduledTarget && !isHeartbeatEnabledForAgent(cfg, agentId)) return {
		kind: "skipped",
		reason: "disabled"
	};
	if (!allowsUnscheduledTarget && !resolveHeartbeatIntervalMs(cfg, void 0, heartbeat)) return {
		kind: "skipped",
		reason: "disabled"
	};
	const startedAt = opts.deps?.nowMs?.() ?? Date.now();
	if (!allowsUnscheduledTarget && wakeSource !== "cron" && !isWithinActiveHours(cfg, heartbeat, startedAt)) return skippedHeartbeatStage("quiet-hours", startedAt);
	const shouldPreflightBeforeBusy = shouldPreflightWakeBeforeBusy(wakeSource, opts.scheduledEveryMs, scheduledTasks.length);
	const resolvePreflight = () => resolveHeartbeatPreflight({
		...opts,
		cfg,
		agentId,
		heartbeat,
		source: wakeSource,
		scheduledTasks
	});
	let preflight = shouldPreflightBeforeBusy ? await resolvePreflight() : void 0;
	if (preflight?.skipReason) return skippedHeartbeatStage(preflight.skipReason, startedAt);
	const skippedBusyStage = (reason) => {
		if (preflight?.pendingEventEntries.length === 0 && scheduledTasks.length === 0) deferSessionEventWakePoll();
		return skippedHeartbeatStage(reason, startedAt);
	};
	const isSessionExecCompletion = normalizeOptionalString(opts.sessionKey) !== void 0 && preflight?.isExecEventWake === true && !preflight.authoritativeScheduledTick && scheduledTasks.length === 0 && preflight.pendingEventEntries.some((event) => isExecCompletionEvent(event.text));
	const getSize = opts.deps?.getQueueSize ?? getQueueSize;
	if (!isSessionExecCompletion && getSize("main") > 0) return skippedBusyStage(HEARTBEAT_SKIP_REQUESTS_IN_FLIGHT);
	const heartbeatWaitOwners = listCronHeartbeatWaitOwners();
	const cronBusy = heartbeatWaitOwners.activeJobMarkers.length > 0 ? hasActiveCronJobsExceptMarkers(heartbeatWaitOwners.activeJobMarkers) : hasActiveCronJobs();
	const owningCronLaneTaskIds = new Set(heartbeatWaitOwners.owningCronLaneTaskMarkers.filter((marker) => marker.lane === CRON_COMMAND_LANE && isCommandLaneTaskMarkerCurrent(marker)).map((marker) => marker.taskId));
	const cronLaneBusy = getSize("cron") > owningCronLaneTaskIds.size || getSize("cron-nested") > 0 || getSize("hook-dispatch") > 0;
	if (!isSessionExecCompletion && (cronBusy || cronLaneBusy)) return skippedBusyStage(HEARTBEAT_SKIP_CRON_IN_PROGRESS);
	const shouldHonorActiveReplyRuns = !isSessionExecCompletion && opts.intent !== "immediate" && opts.intent !== "manual";
	const listActiveReplyRuns = opts.deps?.listActiveReplyRunSessionKeys ?? listActiveReplyRunSessionKeys;
	const listActiveEmbeddedRuns = opts.deps?.listActiveEmbeddedRunSessionKeys ?? listActiveEmbeddedRunSessionKeys;
	if (shouldHonorActiveReplyRuns && (hasActiveRunForAgent(agentId, listActiveReplyRuns) || hasActiveRunForAgent(agentId, listActiveEmbeddedRuns))) return skippedBusyStage(HEARTBEAT_SKIP_REQUESTS_IN_FLIGHT);
	const { sessionKey: recentSessionKey, entry: recentSessionEntry } = resolveHeartbeatSession(cfg, agentId, heartbeat, opts.sessionKey);
	const lifecycleGeneration = getAgentEventLifecycleGeneration();
	const mainSessionRecovery = opts.intent !== "manual" && recentSessionEntry ? transitionMainSessionRecovery(recentSessionEntry, {
		kind: "inspect",
		lifecycleGeneration,
		sessionKey: recentSessionKey
	}) : void 0;
	const activeRestartRecoveryRunId = normalizeOptionalString(recentSessionEntry?.restartRecoveryDeliveryRunId);
	const hasCurrentRestartRecoveryDelivery = opts.intent !== "manual" && activeRestartRecoveryRunId !== void 0 && recentSessionEntry?.restartRecoveryRuns?.some((run) => run.runId === activeRestartRecoveryRunId && run.lifecycleGeneration === lifecycleGeneration) === true;
	if (mainSessionRecovery?.kind === "observed" && (mainSessionRecovery.view.status === "blocked" || mainSessionRecovery.view.status === "recoverable") || hasCurrentRestartRecoveryDelivery) return skippedBusyStage(HEARTBEAT_SKIP_REQUESTS_IN_FLIGHT);
	const HEARTBEAT_DEFER_WINDOW_MS = 3e4;
	const pendingFinalDeliveryText = recentSessionEntry?.pendingFinalDelivery?.kind === "replayable" ? recentSessionEntry.pendingFinalDelivery.text : void 0;
	const pendingFinalDeliveryIsHeartbeatAck = typeof pendingFinalDeliveryText === "string" && isHeartbeatAcknowledgementText(pendingFinalDeliveryText);
	if (recentSessionEntry?.pendingFinalDelivery !== void 0 && !pendingFinalDeliveryIsHeartbeatAck && recentSessionEntry?.updatedAt && startedAt - recentSessionEntry.updatedAt < HEARTBEAT_DEFER_WINDOW_MS) return skippedBusyStage(HEARTBEAT_SKIP_REQUESTS_IN_FLIGHT);
	if (!preflight) preflight = await resolvePreflight();
	if (preflight.skipReason) return skippedHeartbeatStage(preflight.skipReason, startedAt);
	const { sessionKey } = preflight.session;
	const isReplyRunActive = opts.deps?.isReplyRunActive ?? ((key) => replyRunRegistry.isActive(key));
	const isEmbeddedRunActive = opts.deps?.listActiveEmbeddedRunSessionKeys ? (key) => hasActiveRunForSession(key, listActiveEmbeddedRuns) : (key) => resolveActiveEmbeddedRunSessionId(key) !== void 0;
	if (isReplyRunActive(sessionKey) || isEmbeddedRunActive(sessionKey)) return skippedBusyStage(HEARTBEAT_SKIP_REQUESTS_IN_FLIGHT);
	if (getSize(resolveSessionLane(sessionKey)) > 0) return skippedBusyStage(HEARTBEAT_SKIP_REQUESTS_IN_FLIGHT);
	return {
		kind: "ready",
		cfg,
		agentId,
		wakeSource,
		heartbeat,
		scheduledTasks,
		startedAt,
		isEmbeddedRunActive,
		isReplyRunActive,
		preflight
	};
}
async function prepareHeartbeatRunStage(wake) {
	const { cfg, agentId, heartbeat, preflight } = wake;
	const { scheduledTasks, startedAt } = wake;
	const { isEmbeddedRunActive, isReplyRunActive } = wake;
	const { entry, sessionKey, run, conversationEntry } = preflight.session;
	const previousUpdatedAt = entry?.updatedAt;
	const projectionSessionKey = run.kind === "isolated" ? run.baseSessionKey : sessionKey;
	const isSessionOwnedEvent = (event) => isExecCompletionEvent(event.text) || wake.wakeSource === "restart-sentinel" && isRestartContinuationEvent(event);
	const projectionCandidate = scheduledTasks.length === 0 && preflight.shouldInspectPendingEvents && preflight.pendingEventEntries.some(isSessionOwnedEvent) && !preflight.session.suppressOriginatingContext && !isInternalSessionEffectsKey(projectionSessionKey) && conversationEntry?.delivery?.kind === "internal" && conversationEntry.createdVia !== "internal" && (conversationEntry.createdVia === "operator" || conversationEntry.lastReadAt !== void 0 || conversationEntry.createdVia === "spawn" && parseAgentSessionKey(projectionSessionKey)?.rest.startsWith("dashboard:")) ? {
		sessionKey: projectionSessionKey,
		sessionId: conversationEntry.sessionId,
		lifecycleRevision: conversationEntry.lifecycleRevision
	} : void 0;
	const resolvedDelivery = await resolveHeartbeatDeliveryTargetWithSessionRoute({
		cfg,
		agentId,
		entry: conversationEntry,
		heartbeat,
		currentSessionKey: sessionKey,
		turnSource: preflight.session.inspectsRunQueue ? preflight.turnSourceDeliveryContext : void 0
	});
	const internalProjection = resolvedDelivery.reason === "target-none" ? void 0 : projectionCandidate;
	const delivery = internalProjection !== void 0 && preflight.pendingEventEntries.length > 0 && preflight.pendingEventEntries.every(isSessionOwnedEvent) ? {
		...resolvedDelivery,
		channel: "none",
		to: void 0,
		reason: "session-owned-completion"
	} : resolvedDelivery;
	if (delivery.channel === "none" && delivery.reason === "no-route" && (wake.wakeSource === void 0 || wake.wakeSource === "interval") && preflight.pendingEventEntries.length === 0 && scheduledTasks.length === 0) return skippedHeartbeatStage("no-route", startedAt);
	const heartbeatAccountId = heartbeat?.accountId?.trim();
	if (delivery.reason === "unknown-account") heartbeatLog.warn("heartbeat: unknown accountId", {
		accountId: delivery.accountId ?? heartbeatAccountId ?? null,
		target: heartbeat?.target ?? "owner"
	});
	else if (heartbeatAccountId) heartbeatLog.info("heartbeat: using explicit accountId", {
		accountId: delivery.accountId ?? heartbeatAccountId,
		target: heartbeat?.target ?? "owner",
		channel: delivery.channel
	});
	const visibility = delivery.channel !== "none" ? resolveHeartbeatVisibility({
		cfg,
		channel: delivery.channel,
		accountId: delivery.accountId
	}) : {
		showOk: false,
		showAlerts: true,
		useIndicator: true
	};
	const { sender } = resolveHeartbeatSenderContext({
		cfg,
		entry,
		delivery
	});
	const replyPrefix = createReplyPrefixContext({
		cfg,
		agentId,
		channel: delivery.channel !== "none" ? delivery.channel : void 0,
		accountId: delivery.accountId
	});
	const canRelayToUser = visibility.showAlerts && (delivery.channel !== "none" && Boolean(delivery.to) || internalProjection !== void 0);
	const useHeartbeatResponseToolPrompt = shouldUseHeartbeatResponseToolPrompt({
		cfg,
		agentId,
		heartbeat,
		entry,
		sessionKey,
		chatType: delivery.chatType
	});
	const resolveRunPrompt = (useHeartbeatResponseTool) => resolveHeartbeatRunPrompt({
		cfg,
		heartbeat,
		preflight,
		canRelayToUser,
		scheduledTasks,
		heartbeatScratchContent: preflight.heartbeatScratchContent,
		useHeartbeatResponseTool
	});
	let heartbeatRunPrompt = resolveRunPrompt(useHeartbeatResponseToolPrompt);
	const runSessionKey = run.sessionKey;
	let runSessionEntry = entry;
	let outboundPolicySessionKey;
	if (run.kind === "isolated") {
		const { sessionKey: isolatedSessionKey, baseSessionKey: isolatedBaseSessionKey } = run;
		const isolatedStorePath = preflight.session.storePath;
		const staleIsolatedSessionKey = heartbeatRunPrompt.hasExecCompletion && heartbeatRunPrompt.hasCronEvents ? void 0 : resolveStaleHeartbeatIsolatedSessionKey({
			sessionKey,
			isolatedSessionKey,
			isolatedBaseSessionKey
		});
		if (isReplyRunActive(isolatedSessionKey) || isEmbeddedRunActive(isolatedSessionKey)) return skippedHeartbeatStage(HEARTBEAT_SKIP_REQUESTS_IN_FLIGHT, startedAt);
		const staleIsolatedEntry = staleIsolatedSessionKey ? loadExactSessionEntry({
			agentId,
			storePath: isolatedStorePath,
			sessionKey: staleIsolatedSessionKey
		})?.entry : void 0;
		const removals = staleIsolatedSessionKey ? [{
			sessionKey: staleIsolatedSessionKey,
			...staleIsolatedEntry ? { expectedEntry: staleIsolatedEntry } : {},
			...staleIsolatedEntry?.sessionId ? { expectedSessionId: staleIsolatedEntry.sessionId } : {},
			archiveRemovedTranscript: true
		}] : [];
		const lifecycleResult = await applySessionEntryLifecycleMutation({
			agentId,
			activeSessionKey: isolatedSessionKey,
			storePath: isolatedStorePath,
			removals,
			upserts: [{
				sessionKey: isolatedBaseSessionKey,
				buildEntry: ({ currentEntry, sessionKey: baseSessionKey }) => currentEntry || isCronRunSessionKey(baseSessionKey) ? void 0 : mergeSessionEntry(void 0, { updatedAt: startedAt })
			}, {
				sessionKey: isolatedSessionKey,
				buildEntry: ({ currentEntry }) => {
					const cronSession = resolveCronSession({
						cfg,
						sessionKey: isolatedSessionKey,
						agentId,
						nowMs: startedAt,
						forceNew: true,
						lifecycleTimestamps: {},
						store: currentEntry ? { [isolatedSessionKey]: currentEntry } : {}
					});
					clearBootstrapSnapshotOnSessionRollover({
						sessionKey: isolatedSessionKey,
						previousSessionId: cronSession.previousSessionId
					});
					const nextEntry = {
						...cronSession.sessionEntry,
						heartbeatIsolatedBaseSessionKey: isolatedBaseSessionKey
					};
					runSessionEntry = nextEntry;
					return nextEntry;
				}
			}],
			captureArtifactCleanupError: true
		});
		if (lifecycleResult.artifactCleanupError) heartbeatLog.warn("heartbeat: failed to archive stale isolated session transcript", {
			err: formatErrorMessage(lifecycleResult.artifactCleanupError),
			sessionKey: staleIsolatedSessionKey
		});
		outboundPolicySessionKey = isolatedBaseSessionKey;
		const actualUseHeartbeatResponseToolPrompt = shouldUseHeartbeatResponseToolPrompt({
			cfg,
			agentId,
			heartbeat,
			entry: runSessionEntry,
			sessionKey: runSessionKey,
			chatType: delivery.chatType
		});
		if (actualUseHeartbeatResponseToolPrompt !== useHeartbeatResponseToolPrompt) heartbeatRunPrompt = resolveRunPrompt(actualUseHeartbeatResponseToolPrompt);
	}
	return {
		kind: "ready",
		...preflight.session,
		previousUpdatedAt,
		policySessionEntry: outboundPolicySessionKey && (outboundPolicySessionKey !== sessionKey || !entry) ? loadExactSessionEntry({
			agentId,
			storePath: preflight.session.storePath,
			sessionKey: outboundPolicySessionKey
		})?.entry : entry,
		delivery,
		visibility,
		sender,
		replyPrefix,
		runSessionKey,
		outboundPolicySessionKey,
		internalProjection,
		...heartbeatRunPrompt,
		useHeartbeatFailureCopy: scheduledTasks.length > 0 || !heartbeatRunPrompt.hasTaskContinuation && !heartbeatRunPrompt.hasCronEvents && (wake.wakeSource === void 0 || wake.wakeSource === "interval" || wake.wakeSource === "manual"),
		deferredGenericEvents: internalProjection && delivery.channel === "none" ? heartbeatRunPrompt.genericEvents.filter(isRestartContinuationEvent) : []
	};
}
//#endregion
//#region src/infra/heartbeat-typing.ts
const DEFAULT_HEARTBEAT_TYPING_INTERVAL_SECONDS = 6;
/** Create typing start/stop/keepalive callbacks for a heartbeat delivery target. */
function createHeartbeatTypingCallbacks(params) {
	const sendTyping = params.plugin?.heartbeat?.sendTyping;
	const to = params.target.to?.trim();
	if (!sendTyping || !to) return;
	const clearTyping = params.plugin?.heartbeat?.clearTyping;
	const keepaliveIntervalMs = typeof params.typingIntervalSeconds === "number" && params.typingIntervalSeconds > 0 ? params.typingIntervalSeconds * 1e3 : DEFAULT_HEARTBEAT_TYPING_INTERVAL_SECONDS * 1e3;
	const target = {
		cfg: params.cfg,
		to,
		...params.target.accountId !== void 0 ? { accountId: params.target.accountId } : {},
		...params.target.threadId !== void 0 ? { threadId: params.target.threadId } : {},
		...params.deps ? { deps: params.deps } : {}
	};
	return createTypingCallbacks({
		start: async () => sendTyping(target),
		...clearTyping ? { stop: async () => clearTyping(target) } : {},
		keepaliveIntervalMs,
		onStartError: (err) => {
			params.log?.debug?.(`heartbeat typing failed for ${params.target.channel}`, {
				error: String(err),
				channel: params.target.channel,
				accountId: params.target.accountId
			});
		}
	});
}
//#endregion
//#region src/infra/heartbeat-runner-run.ts
async function runHeartbeatOnce(opts) {
	const wake = await resolveHeartbeatWakeStage(opts);
	if (wake.kind === "skipped") return {
		status: "skipped",
		reason: wake.reason
	};
	markSessionEventWakeWorkStarted();
	const prepared = await prepareHeartbeatRunStage(wake);
	if (prepared.kind === "skipped") return {
		status: "skipped",
		reason: prepared.reason
	};
	const { cfg, agentId, heartbeat, startedAt } = wake;
	const { delivery, visibility, sender, runSessionKey, suppressOriginatingContext } = prepared;
	if (!visibility.showAlerts && !visibility.showOk && !visibility.useIndicator) {
		emitHeartbeatEvent({
			status: "skipped",
			reason: "alerts-disabled",
			durationMs: Date.now() - startedAt,
			channel: delivery.channel !== "none" ? delivery.channel : void 0,
			accountId: delivery.accountId
		});
		return {
			status: "skipped",
			reason: "alerts-disabled"
		};
	}
	const policy = createHeartbeatDispatch(opts, wake, prepared);
	const state = { heartbeat: policy };
	const signal = getSessionEventWakeAbortSignal();
	const channel = delivery.channel !== "none" ? delivery.channel : void 0;
	const typing = channel && isHeartbeatTypingEnabled({
		cfg,
		agentId,
		hasChatDelivery: Boolean(delivery.to && (visibility.showAlerts || visibility.showOk))
	}) ? createHeartbeatTypingCallbacks({
		cfg,
		target: {
			...delivery,
			channel
		},
		plugin: resolveHeartbeatChannelPlugin(channel),
		deps: opts.deps,
		typingIntervalSeconds: resolveHeartbeatTypingIntervalSeconds(cfg),
		log: heartbeatLog
	}) : void 0;
	try {
		const { dispatchInboundMessageWithRoutedChannelDispatcher } = await import("./dispatch-BX6nTH1t.mjs");
		await typing?.onReplyStart();
		const heartbeatContext = {
			Body: appendCronStyleCurrentTimeLine(prepared.prompt, cfg, startedAt),
			From: sender,
			To: !suppressOriginatingContext ? delivery.to : void 0,
			OriginatingChannel: !suppressOriginatingContext ? channel : void 0,
			OriginatingTo: !suppressOriginatingContext ? delivery.to : void 0,
			AccountId: delivery.accountId,
			ChatType: delivery.chatType,
			MessageThreadId: delivery.threadId,
			InternalTurnSource: prepared.hasExecCompletion ? "exec" : prepared.hasCronEvents ? "cron" : "heartbeat",
			InputProvenance: {
				kind: "internal_system",
				sourceTool: prepared.hasExecCompletion ? "exec" : prepared.hasCronEvents ? "cron" : opts.intent === "scheduled" || !wake.wakeSource || wake.wakeSource === "interval" || wake.wakeSource === "manual" ? "heartbeat" : wake.wakeSource
			},
			SessionKey: runSessionKey,
			AgentId: agentId
		};
		await dispatchInboundMessageWithRoutedChannelDispatcher({
			cfg,
			ctx: heartbeatContext,
			replyResolver: opts.deps?.getReplyFromConfig,
			suppressOutboundHooks: true,
			replyOptions: withReplySystemEventContext({
				isHeartbeat: true,
				useHeartbeatFailureCopy: prepared.useHeartbeatFailureCopy,
				...prepared.run.kind === "isolated" ? { cleanupBundleMcpOnRunEnd: true } : {},
				replyConversation: prepareReplyConversation({
					ctx: heartbeatContext,
					sessionEntry: suppressOriginatingContext ? void 0 : prepared.conversationEntry,
					isHeartbeat: true
				}),
				[REPLY_OPERATION_RUN_STATE]: state,
				heartbeatModelOverride: heartbeat?.model?.trim(),
				...prepared.usesHeartbeatResponseTool ? {
					enableHeartbeatTool: true,
					forceHeartbeatTool: true,
					sourceReplyDeliveryMode: "message_tool_only"
				} : {},
				abortSignal: signal,
				timeoutOverrideSeconds: prepared.hasTaskContinuation ? void 0 : resolveHeartbeatTimeoutOverrideSeconds(cfg, heartbeat),
				bootstrapContextMode: heartbeat?.lightContext === true ? "lightweight" : void 0,
				disableBlockStreaming: true,
				suppressToolProgressMessages: true,
				suppressDefaultToolProgressMessages: true,
				onModelSelected: prepared.replyPrefix.onModelSelected,
				onSessionPrepared: (binding) => {
					if (!policy.prepared.policySessionEntry && !prepared.outboundPolicySessionKey && binding.sessionKey === prepared.sessionKey && binding.storePath === prepared.storePath && binding.lifecycleRevision !== void 0) policy.prepared = {
						...prepared,
						policySessionEntry: {
							sessionId: binding.sessionId,
							lifecycleRevision: binding.lifecycleRevision,
							updatedAt: startedAt
						}
					};
				}
			}, {
				sessionKey: prepared.inspectsRunQueue ? prepared.sessionKey : runSessionKey,
				events: prepared.inspectsRunQueue ? prepared.genericEvents : [],
				deferredEventIds: prepared.deferredGenericEvents.map((event) => event.id).filter((id) => typeof id === "string")
			}),
			dispatcherOptions: { deliver: (payload) => deliverHeartbeatDispatch(policy, payload, state.agentTurnOwner?.abortSignal ?? signal) }
		});
		if (policy.result) return policy.result;
		const execution = resolveReplyOperationAgentTurn(state);
		const reason = execution === "superseded" ? "preempted" : execution === "cancelled" ? "agent-runner-cancelled" : "requests-in-flight";
		emitHeartbeatEvent({
			status: "skipped",
			reason,
			durationMs: Date.now() - startedAt
		});
		return {
			status: "skipped",
			reason
		};
	} catch (error) {
		if (policy.result) return policy.result;
		const reason = formatErrorMessage(error);
		emitHeartbeatEvent({
			status: "failed",
			reason,
			durationMs: Date.now() - startedAt,
			channel,
			accountId: delivery.accountId,
			indicatorType: visibility.useIndicator ? resolveIndicatorType("failed") : void 0
		});
		heartbeatLog.error(`heartbeat failed: ${reason}`, { error: reason });
		return {
			status: "failed",
			reason
		};
	} finally {
		typing?.onCleanup?.();
	}
}
//#endregion
export { resolveConfiguredHeartbeatPrompt as n, runHeartbeatOnce as t };
