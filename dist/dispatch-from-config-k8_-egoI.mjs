import { o as asDateTimestampMs } from "./number-coercion-CLj0HTDM.mjs";
import { i as resolveGlobalSingleton } from "./global-singleton-Dc_stLtU.mjs";
import { c as normalizeOptionalLowercaseString, l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
import { i as getPluginRuntimeGatewayRequestScope, l as withPluginRuntimeRegistryScope } from "./gateway-request-scope-BLBH-Gpf.mjs";
import { n as isAbortError } from "./abort-signal-Z3A36sLL.mjs";
import { l as resolveAgentWorkspaceDir, r as resolveAgentConfig } from "./agent-scope-config-IQKOEtZ4.mjs";
import { A as parseAgentSessionKey, D as resolveSessionDispatchKind, l as resolveAgentIdFromSessionKey, y as isAcpSessionKey } from "./session-key-CBvmC8zz.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { f as isDiagnosticsEnabled } from "./diagnostic-events-CVabF32H.mjs";
import { t as createSubsystemLogger } from "./subsystem-DleLyu58.mjs";
import { o as measureDiagnosticsTimelineSpan } from "./diagnostics-timeline-uuHa_36_.mjs";
import { d as resolveToolProfilePolicy } from "./tool-policy-shared-auQCQEhM.mjs";
import { o as isToolAllowedByPolicies } from "./tool-policy-match-Bv2XOvEF.mjs";
import { l as mergeAlsoAllowPolicy } from "./tool-policy-YDdaK0oX.mjs";
import { l as resolveSessionStorePathCore } from "./paths-CcMbq5NY.mjs";
import { _ as resolveSessionAgentId } from "./agent-scope-CTuYDtny.mjs";
import { u as normalizeVerboseLevel } from "./thinking.shared-BKzBCWpI.mjs";
import { n as resolveGlobalDedupeCache } from "./dedupe-wpcRBJWZ.mjs";
import { i as logVerbose } from "./globals-QODkv80i.mjs";
import { t as applyMergePatch } from "./merge-patch-C1--BlNd.mjs";
import { n as channelRouteDedupeKey } from "./channel-route-Czo5mOSj.mjs";
import "./message-channel-constants-Cd7Eq8Zi.mjs";
import { n as normalizeMessageChannel } from "./message-channel-core-CxyiAx1U.mjs";
import "./message-channel-DDcHHhpX.mjs";
import { t as normalizeChatType } from "./chat-type-Dbv0JQHI.mjs";
import { t as buildConversationRef } from "./conversation-ref-8kIjGCCc.mjs";
import { d as readAgentDatabaseAdmissionRefusal } from "./agent-database-admission-BFwcs62N.mjs";
import { f as withClaimingHookAdmission, h as fireAndForgetHook, r as createPluginSubagentRequesterContext, w as getGroupThreadTurn } from "./hooks-DuXrq03h.mjs";
import { n as getGlobalPluginRegistry, t as getGlobalHookRunner } from "./hook-runner-global-DlvY8FQy.mjs";
import { S as readAskUserQuestionId, T as setReplyPayloadMetadata, _ as isReplyPayloadTerminalContent, a as copyReplyPayloadMetadata, d as isFastModeAutoProgressPayload, h as isReplyPayloadStatusNotice, s as getReplyPayloadMetadata, u as isCommandReplyForDelivery } from "./reply-payload-B2ZQhznY.mjs";
import { i as shouldCleanTtsDirectiveText, o as normalizeTtsAutoMode } from "./tts-config-DK27R_zM.mjs";
import { l as readChannelContextGatewayContextResolver } from "./admission-evidence-aqOMZf0e.mjs";
import { i as resolveCommandAuthorization } from "./command-auth-2PSSAYYJ.mjs";
import { r as prepareChannelParticipantObservation } from "./host-context-builder-DDDipgdC.mjs";
import "./thinking-B1p5pEC8.mjs";
import { _ as stripLegacyMediaContextFields } from "./media-facts-BEHTU0wM.mjs";
import { n as sessionDeliveryChannel } from "./delivery-context.read-CR06zOJ4.mjs";
import { r as onSessionIdentityMutation } from "./session-lifecycle-events-DiXxneBV.mjs";
import { it as conversationIdentityFromMsgContext } from "./session-accessor.sqlite-entry-store-BU493wVJ.mjs";
import { i as normalizeChannelId, t as getChannelPlugin } from "./registry-D3wOWFDo.mjs";
import { r as resolveGroupSessionKey } from "./group-B8HN3m8j.mjs";
import { g as runExclusiveSessionLifecycleMutation } from "./session-lifecycle-admission-Pys9TN37.mjs";
import { r as appendTranscriptEventSync } from "./session-accessor.sqlite-transcript-write-Bk_2EeDT.mjs";
import { t as redactTranscriptMessage } from "./transcript-redact-CcOcbRyc.mjs";
import { t as isParentOwnedBackgroundAcpSession } from "./session-interaction-mode-DMdVNqja.mjs";
import { d as patchSessionEntryCore, l as loadSessionEntryReadOnly } from "./session-accessor.sqlite-entry-BB2Zsfho.mjs";
import { X as claimSessionPendingInputDedupeRecovery } from "./session-accessor-l-4ZHvKn.mjs";
import { n as classifySessionStateActor } from "./session-state-events-CMg59EpB.mjs";
import { n as GENERIC_EXTERNAL_RUN_FAILURE_TEXT } from "./user-copy-DfLWtdTx.mjs";
import { i as sanitizeUserFacingText } from "./user-facing-text-D8c_iKUB.mjs";
import { a as resolveSourceReplyExpectation, o as resolveSourceReplyVisibilityPolicy, r as isUnauthorizedTextSlashCommand, t as isExplicitSourceReplyCommand, u as resolveReplyCompletion } from "./source-reply-delivery-mode-CuFZyg4U.mjs";
import { a as isNativeCommandTurn, c as resolveCommandTurnContext, l as resolveCommandTurnTargetSessionKey } from "./command-turn-context-a363iy71.mjs";
import { t as getSessionBindingService } from "./session-binding-service-n2QTfkUE.mjs";
import { n as isPluginOwnedSessionBindingRecord } from "./conversation-binding-metadata-CFOhDjMh.mjs";
import { i as buildPluginBindingErrorText, l as hasShownPluginBindingFallbackNotice, m as toPluginConversationBinding, o as buildPluginBindingUnavailableText, r as buildPluginBindingDeclinedText, u as markPluginBindingFallbackNoticeShown } from "./conversation-binding-6xSU5aQc.mjs";
import { i as resolveTextCommand, r as normalizeCommandBody } from "./commands-registry-normalize-DJeLLZwD.mjs";
import { n as readAcpSessionEntry } from "./session-meta-BxRb6CVY.mjs";
import { U as waitForReplyBarrierSettlement } from "./reply-run-registry.state-C5EjI8Kf.mjs";
import { h as replyRunRegistry, o as forceClearReplyRunBySessionId } from "./reply-run-registry.registry-QRh9NCRy.mjs";
import "./reply-run-registry-D1FEEbJ6.mjs";
import { f as markDiagnosticSessionProgress, n as logMessageDispatchStarted, t as logMessageDispatchCompleted } from "./diagnostic-CT1lx7JC.mjs";
import { i as resolveActiveEmbeddedRunSessionId } from "./active-run-projections-BHX_SDCX.mjs";
import { c as isRestartRecoveryTombstone, l as isSessionWorkStartInvalidatedError, n as SessionRestartRecoveryTombstoneError } from "./lifecycle-WWQJH57y.mjs";
import { r as normalizeExplicitSessionKey } from "./session-key-BiOR3qX7.mjs";
import { t as appendAssistantMessageToSessionTranscript } from "./transcript-DgtCkbrJ.mjs";
import { r as isFinalizedInboundContext, t as finalizeInboundContext } from "./inbound-context-BLR5MPPS.mjs";
import { d as findConversationTurnDeliveryByReplyTarget, h as markConversationDeliverySent, m as markConversationDeliveryReplied } from "./delivery-completion-DxLFTv-D.mjs";
import { i as resolveConversationRegistryScope, s as runConversationDatabaseWrite } from "./conversation-registry-BOo4ipKL.mjs";
import { n as createStructuredOutboundPayloadPlan } from "./payloads-Ce1fWBq6.mjs";
import { a as resolveSendableOutboundReplyParts } from "./reply-payload-parts-G378iYNJ.mjs";
import { i as extractShortModelName } from "./normalize-reply-gZujyBo1.mjs";
import { g as shouldRetryReplyDispatch, h as resolveRoutedReplyDeliveryOutcome, n as bindReplyDispatcherConversationContext, o as prepareReplyPayloadForDispatcher, r as captureReplyDispatchDeliveryOutcome, s as waitForReplyDispatcherIdle, t as attachReplyDispatchUndeliveredFallback, u as ReplyDispatchDeliveryError } from "./reply-dispatcher-CLU3uA4U.mjs";
import { n as resolveAgentIdentity } from "./identity-DdUdpaIE.mjs";
import { a as toInternalMessageReceivedContext, c as toPluginInboundClaimPair, l as toPluginMessageContext, n as deriveInboundMessageHookContext, u as toPluginMessageReceivedEvent } from "./message-hook-mappers-OANlfuGW.mjs";
import { a as hasOutboundReplyContent } from "./reply-payload-RBmrGrXG.mjs";
import { s as resolveSubagentCapabilityStore, t as isSubagentEnvelopeSession } from "./subagent-capabilities-CXh51XLK.mjs";
import { a as resolveSubagentToolPolicyForSession, i as resolveInheritedToolPolicyForSession, n as resolveEffectiveToolPolicy, r as resolveGroupToolPolicy } from "./agent-tools.policy-CIWGcFBI.mjs";
import { n as shouldHandleTextCommands } from "./commands-text-routing-BAYDrHHM.mjs";
import { i as findCommandByNativeName, o as isActiveRunSafeCommandTurn } from "./commands-registry-Dw3-bHwm.mjs";
import { t as registerReplyDispatcherSettledTask } from "./dispatch-dispatcher-C6kknpZM.mjs";
import { i as readConversationBindingRouteFacts } from "./conversation-binding-route-facts-BzDZWweu.mjs";
import { a as resolveConversationBindingContextFromMessage } from "./acp-reset-target-rsWh_4b4.mjs";
import { n as createInternalHookEvent, u as triggerInternalHook } from "./internal-hooks-B-eMkNRp.mjs";
import { a as resolveVisibleRepliesPolicy, i as resolveTurnModelOverride, n as resolveStableMessageToolAvailability, o as loadSessionStoreEntry, r as createShouldEmitVerboseProgress } from "./session-stable-reply-mode-CZtTCKiF.mjs";
import { n as resolveRoutedDeliveryThreadId, t as isSlackDirectRoutedThreadTurn } from "./routed-delivery-thread-BgOncaiJ.mjs";
import { a as resolveDispatchConversationBinding, n as assertPreparedConversationBindingRouteCurrent, r as readPreparedConversationBindingRouteCurrent, t as assertPreparedConversationBindingRoute } from "./session-conversation-binding-Bk7oYC8c.mjs";
import { c as bindPreparedReplyDispatchRuntime, d as canReplaceRestartTombstoneFromParent, o as withFullRuntimeReplyConfig, s as stageRemoteInboundMediaIfNeeded, t as resolveRunTypingPolicy, u as resolveAuthorizedSessionResetCommand } from "./typing-policy-DdcAyq_O.mjs";
import { b as reserveReplyAdmissionTicket, h as renderPostCompactionModelFailurePayload, r as isDuplicateRestartRecoverySource, t as resolveTurnCommentaryProgressOwner, u as buildTerminalAgentRunFailureReplyPayload, y as REPLY_ADMISSION_TICKET } from "./commentary-progress-owner-CgpMPSsu.mjs";
import { i as recordReplyOperationAgentTurn, n as resolveEffectiveReplyRoute, r as REPLY_OPERATION_RUN_STATE, s as resolveReplyOperationRunState } from "./effective-reply-route-BRvgVFl9.mjs";
import { i as setChannelSourceTurnId, n as readChannelSourceTurnId, o as shouldMintChannelSourceTurnId, t as buildChannelSourceTurnId } from "./source-turn-id-BZGK3amb.mjs";
import { a as isCaptionedFinalTextPayload, c as DispatchReplyOperationAbortedError, d as runWithDispatchAbortSignal, i as cleanDeferredFinalText, l as createAbortAwareDispatcher, o as mergeDeferredFinalText, r as buildCaptionedFinalTextFallback, s as shouldDeferFinalTtsText, t as finalizeDispatchAndAudit, u as isDispatchReplyOperationAbortedError } from "./dispatch-from-config.finalize-D8z2sl2c.mjs";
import { n as hasTrustedMessageAuditListeners, t as emitTrustedMessageAuditEvent } from "./message-audit-events-1aZ8RQoU.mjs";
import { t as createTtsDirectiveTextStreamCleaner } from "./directives-B0TC0IWT.mjs";
import { c as hasExecApprovalUnavailablePayload, d as shouldDeliverDespiteSourceReplySuppression, h as createBlockReplySource, i as createFinalizationAwareTtsPayloadApplier, l as prepareReplyPayloadForSideEffects, o as hasAskUserPayload, p as createBlockReplyContentKey, s as hasExecApprovalPayload, u as requiresDurableToolResultDelivery, v as recoverBlockReplySources, y as setBlockReplyDelivery } from "./dispatch-from-config.payloads-66_-9iD5.mjs";
import { n as suppressPendingFinalDelivery } from "./dispatch-from-config.pending-final-GQX9YCV_.mjs";
import { n as buildChannelUserTurnSender, o as preparePersistedUserTurnMessageForTranscriptWrite } from "./user-turn-transcript.metadata-BY4PdwgQ.mjs";
import { n as runAgentHarnessBeforeMessageWriteHook } from "./hook-helpers-BzSlbw21.mjs";
import { b as isDispatchFinalReplySessionWriterAuthorized } from "./delivery-queue-recovery-C10ZMWin.mjs";
import { h as normalizeAgentPlanSteps, u as formatPlanChecklistLines } from "./streaming-BRWehz40.mjs";
import { i as isAskUserPromptPending } from "./ask-user-tool-CbrFfHcO.mjs";
import { t as settleProgressVisibilityCallbackResult } from "./progress-visibility-DVUJibF4.mjs";
import { o as takeCommandSessionMetadataChanges } from "./commands-goal-CKSk_N65.mjs";
import { t as createDiagnosticMessageLifecycle } from "./message-lifecycle-DlKNWHzC.mjs";
import { t as isRecoverableTerminalSessionStatus } from "./terminal-status-Z4Z1U4Xa.mjs";
import { c as resolveWorkerPlacementArchiveRestoreError, i as prepareSessionWorkerPlacementMutationCheck } from "./session-placement-lifecycle-DAKgxrlj.mjs";
import { c as admitReplyTurn, l as resolveReplyTurnKind, n as shouldBridgeCliPreambleEvents, o as createReplyTimingTracker, s as isReplyProfilerEnabled, u as runWithReplyOperationLifecycleAdmission } from "./get-reply.types-DbkNd-4v.mjs";
import { a as loadReplyMediaPathsRuntime, i as loadPreparedModelRuntime, n as loadFastApproveRuntime, o as loadRouteReplyRuntime, r as loadGetReplyFromConfigRuntime, s as loadRuntimePlugins, t as loadAbortRuntime } from "./dispatch-from-config.runtime.js";
import { t as noteDispatchProcessedOutcome } from "./dispatch-processed-outcome-D40daGTW.mjs";
import { t as hasInboundAudio } from "./inbound-media-CetKPfK2.mjs";
import { n as resolveSendPolicy } from "./send-policy-DZ8_Ozhd.mjs";
import { n as claimPendingConversationTurnReply } from "./conversation-turns-D1jNcBu8.mjs";
import { i as buildPersistedUserTurnMessage } from "./user-turn-transcript.message-DpTCMkgY.mjs";
import "./user-turn-transcript-Cqq1jlt5.mjs";
import { t as resolveOriginMessageProvider } from "./origin-routing-jrHjZJWx.mjs";
import { a as resolveReplyDeliveryAccountId, o as resolveReplyToMode, t as createReplyDeliveryContext } from "./reply-threading-lgVuxEkY.mjs";
import { t as getGatewayNativeApprovalRuntime } from "./approval-gateway-runtime-context-RP-DVAyK.mjs";
import { r as hasActiveNativeApprovalRoute } from "./approval-native-route-coordinator-DLN9eiTv.mjs";
import { n as resolveSessionModelRef } from "./session-model-ref-Z1HiwFXK.mjs";
import { i as PLUGIN_COMMAND_DISPATCH, r as matchPluginCommandInvocation, t as createPluginCommandRuntime } from "./plugin-command-runtime-Bk_4ratU.mjs";
import { n as resolveCommandChannel } from "./commands-context-BUNzFOLm.mjs";
import { n as resolveCommandContextText } from "./context-text-D3m6Fy9M.mjs";
import crypto from "node:crypto";
//#region src/auto-reply/reply/dispatch-session-refresh-error.ts
/** Pre-dispatch session state changed before any user-visible work began. */
var DispatchSessionRefreshRequiredError = class extends Error {
	constructor(cause) {
		super(cause.message, { cause });
		this.name = "DispatchSessionRefreshRequiredError";
	}
};
//#endregion
//#region src/auto-reply/reply/dispatch-from-config.context.ts
function routeThreadIdsDiffer(left, right) {
	if (left === void 0 || right === void 0) return false;
	return String(left) !== String(right);
}
function shouldLetSlackRoutedThreadBypassBusyReplyOperation(params) {
	return isSlackDirectRoutedThreadTurn(params.ctx) && routeThreadIdsDiffer(params.activeOperation?.routeThreadId, params.routeThreadId);
}
function resolveRoutedPolicyConversationType(ctx) {
	const commandTargetSessionKey = resolveCommandTurnTargetSessionKey(ctx);
	if (commandTargetSessionKey && commandTargetSessionKey !== ctx.SessionKey) return;
	const chatType = normalizeChatType(ctx.ChatType);
	if (chatType === "direct") return "direct";
	if (chatType === "group" || chatType === "channel") return "group";
}
function resolveSessionStoreLookup(ctx, cfg) {
	const targetSessionKey = resolveCommandTurnTargetSessionKey(ctx);
	const sessionKey = normalizeOptionalString(targetSessionKey ?? ctx.SessionKey);
	if (!sessionKey) return {};
	const agentId = resolveSessionAgentId({
		sessionKey,
		config: cfg,
		fallbackAgentId: ctx.AgentId
	});
	const target = {
		agentId,
		sessionKey,
		storePath: resolveSessionStorePathCore(cfg.session?.store, { agentId })
	};
	try {
		const entry = loadSessionStoreEntry({
			...target,
			readConsistency: "latest",
			clone: false
		});
		return {
			...target,
			entry,
			store: entry ? { [sessionKey]: entry } : void 0
		};
	} catch {
		return target;
	}
}
async function resolveBoundAcpDispatchSessionKey(params) {
	if (resolveCommandTurnTargetSessionKey(params.ctx)) return;
	const preparedRoute = readConversationBindingRouteFacts(params.ctx);
	const bindingContext = preparedRoute?.conversation ?? resolveConversationBindingContextFromMessage({
		cfg: params.cfg,
		ctx: params.ctx
	});
	if (!bindingContext) return;
	const binding = preparedRoute ? await readPreparedConversationBindingRouteCurrent(params.ctx) : await getSessionBindingService().resolveByConversationAsync({
		channel: bindingContext.channel,
		accountId: bindingContext.accountId,
		conversationId: bindingContext.conversationId,
		...bindingContext.parentConversationId ? { parentConversationId: bindingContext.parentConversationId } : {}
	});
	assertPreparedConversationBindingRoute(params.ctx, binding);
	const targetSessionKey = normalizeOptionalString(binding?.targetSessionKey);
	if (!binding || !targetSessionKey || !isAcpSessionKey(targetSessionKey)) return;
	if (isPluginOwnedSessionBindingRecord(binding)) return;
	const { bindingId, boundAt, targetSessionKey: boundTargetSessionKey, targetKind } = binding;
	const scope = { ...binding.conversation };
	await getSessionBindingService().touchAsync(bindingId, void 0, scope);
	const currentBinding = preparedRoute ? await readPreparedConversationBindingRouteCurrent(params.ctx) : await getSessionBindingService().resolveByConversationAsync(bindingContext);
	assertPreparedConversationBindingRoute(params.ctx, currentBinding);
	if (currentBinding && (currentBinding.bindingId !== bindingId || currentBinding.boundAt !== boundAt || currentBinding.targetSessionKey !== boundTargetSessionKey || currentBinding.targetKind !== targetKind || currentBinding.conversation.channel !== scope.channel || currentBinding.conversation.accountId !== scope.accountId)) throw new DispatchSessionRefreshRequiredError(/* @__PURE__ */ new Error("conversation binding changed while recording activity"));
	const currentTargetSessionKey = normalizeOptionalString(currentBinding?.targetSessionKey);
	return currentBinding && currentTargetSessionKey && isAcpSessionKey(currentTargetSessionKey) && !isPluginOwnedSessionBindingRecord(currentBinding) ? preparedRoute ? normalizeOptionalString(params.ctx.SessionKey) : currentTargetSessionKey : void 0;
}
function resolveDispatchResetAdmission(params) {
	const { ctx, entry } = params;
	const parentSessionKey = normalizeOptionalString(ctx.ParentSessionKey);
	const commandTarget = resolveCommandTurnTargetSessionKey(ctx);
	const nativeCommandTarget = isNativeCommandTurn(ctx.CommandTurn) ? commandTarget : void 0;
	const actorType = classifySessionStateActor({ inputProvenance: ctx.InputProvenance }).actorType;
	const mayReplaceRestartTombstoneFromParent = canReplaceRestartTombstoneFromParent({
		actorType,
		entry,
		hasParentForkSource: true,
		hasPluginOwnedBinding: params.hasPluginOwnedBinding,
		inboundAccessAuthorized: ctx.InboundAccessAuthorized,
		inboundEventKind: ctx.InboundEventKind,
		nativeCommandTarget: commandTarget,
		sessionKey: params.sessionKey
	});
	let hasParentForkSource = false;
	if (mayReplaceRestartTombstoneFromParent && parentSessionKey && parentSessionKey !== params.sessionKey && params.storePath) try {
		hasParentForkSource = Boolean(loadSessionStoreEntry({
			agentId: params.agentId,
			storePath: params.storePath,
			sessionKey: parentSessionKey,
			readConsistency: "latest",
			clone: false
		})?.sessionId);
	} catch {
		hasParentForkSource = false;
	}
	const allowRestartTombstoneParentFork = mayReplaceRestartTombstoneFromParent && hasParentForkSource;
	if (params.hasPluginOwnedBinding || entry?.pluginOwnerId !== void 0 || ctx.InboundAccessAuthorized !== true || ctx.InboundEventKind === "room_event" || nativeCommandTarget !== void 0 && nativeCommandTarget !== params.sessionKey || actorType !== "human") return {
		allowRestartTombstoneParentFork,
		allowRestartTombstoneReset: false,
		resetTriggered: false
	};
	const normalizedChatType = normalizeChatType(ctx.ChatType);
	const isGroup = normalizedChatType != null && normalizedChatType !== "direct" ? true : Boolean(resolveGroupSessionKey(ctx));
	const { resetCommand } = resolveAuthorizedSessionResetCommand({
		agentId: params.agentId,
		cfg: params.cfg,
		commandAuthorized: ctx.CommandAuthorized,
		ctx,
		isGroup
	});
	const resetTriggered = resetCommand.matchedResetTriggerLower !== void 0;
	return {
		resetTriggered,
		allowRestartTombstoneParentFork,
		allowRestartTombstoneReset: resetTriggered
	};
}
//#endregion
//#region src/auto-reply/reply/dispatch-from-config.audit.ts
function resolveCompletedInboundAuditReason(reason) {
	switch (reason) {
		case "fast_abort": return "fast_abort";
		case "plugin-bound-handled": return "plugin_bound_handled";
		case "plugin-bound-fallback-missing-plugin":
		case "plugin-bound-fallback-no-handler": return "plugin_bound_unavailable";
		case "plugin-bound-declined": return "plugin_bound_declined";
		case "before_dispatch_handled": return "before_dispatch_handled";
		case "acp_dispatch": return "acp_dispatch_completed";
		case "acp_empty_prompt": return "acp_dispatch_empty";
		case "active_run_injected": return "active_run_injected";
		default: return;
	}
}
function resolveSkippedInboundAuditReason(reason) {
	switch (reason) {
		case "duplicate": return "duplicate";
		case "reply-operation-active": return "reply_operation_active";
		case "reply_operation_aborted": return "reply_operation_aborted";
		default: return;
	}
}
function resolveInboundMessageAuditTerminal(outcome, reason) {
	if (reason === "plugin-bound-error") return {
		status: "failed",
		outcome: "failed",
		errorCode: "message_processing_failed",
		reasonCode: "plugin_bound_error"
	};
	if (reason?.startsWith("acp_error:")) return {
		status: "failed",
		outcome: "failed",
		errorCode: "message_processing_failed",
		reasonCode: "acp_dispatch_failed"
	};
	if (reason === "reply_operation_aborted") return {
		status: "blocked",
		outcome: "skipped",
		reasonCode: "reply_operation_aborted"
	};
	if (reason === "acp_aborted") return {
		status: "blocked",
		outcome: "skipped",
		reasonCode: "acp_dispatch_aborted"
	};
	if (outcome === "completed") {
		const reasonCode = resolveCompletedInboundAuditReason(reason);
		return {
			status: "succeeded",
			outcome: "completed",
			...reasonCode ? { reasonCode } : {}
		};
	}
	if (outcome === "skipped") {
		const reasonCode = resolveSkippedInboundAuditReason(reason);
		return {
			status: "blocked",
			outcome: "skipped",
			...reasonCode ? { reasonCode } : {}
		};
	}
	return {
		status: "failed",
		outcome: "failed",
		errorCode: "message_processing_failed"
	};
}
function emitInboundMessageAuditTerminal(params) {
	const { ctx, cfg } = params;
	const occurredAt = Date.now();
	const sessionKey = normalizeOptionalString(ctx.SessionKey) ?? normalizeOptionalString(ctx.CommandTargetSessionKey);
	const actorId = normalizeOptionalString(ctx.SenderId);
	const accountId = normalizeOptionalString(ctx.AccountId);
	const conversationId = normalizeOptionalString(ctx.NativeChannelId) ?? normalizeOptionalString(ctx.OriginatingTo) ?? normalizeOptionalString(ctx.To) ?? normalizeOptionalString(ctx.From);
	const messageId = normalizeOptionalString(ctx.MessageSidFull) ?? normalizeOptionalString(ctx.MessageSid) ?? normalizeOptionalString(ctx.MessageSidFirst) ?? normalizeOptionalString(ctx.MessageSidLast);
	const terminalFields = resolveInboundMessageAuditTerminal(params.terminal.outcome, params.terminal.options?.reason);
	let agentId = normalizeOptionalString(ctx.AgentId);
	try {
		agentId = resolveSessionAgentId({
			sessionKey,
			config: cfg,
			agentId: ctx.AgentId
		});
	} catch {}
	try {
		emitTrustedMessageAuditEvent({
			occurredAt,
			kind: "message",
			action: "message.inbound.processed",
			...terminalFields,
			actorType: actorId ? "channel_sender" : "system",
			actorId: actorId ?? "gateway",
			...agentId ? { agentId } : {},
			...normalizeOptionalString(params.observedRunId) ? { runId: normalizeOptionalString(params.observedRunId) } : {},
			direction: "inbound",
			channel: normalizeLowercaseStringOrEmpty(ctx.OriginatingChannel) || normalizeLowercaseStringOrEmpty(ctx.Surface) || normalizeLowercaseStringOrEmpty(ctx.Provider) || "unknown",
			conversationKind: normalizeChatType(ctx.ChatType) ?? "unknown",
			durationMs: Math.max(0, occurredAt - params.startedAt),
			resultCount: params.counts.tool + params.counts.block + params.counts.final,
			...accountId ? { accountId } : {},
			...conversationId ? { conversationId } : {},
			...messageId ? { messageId } : {}
		});
	} catch {}
}
/**
* Captures one terminal event for the reply-processing boundary. Channel admission and
* pre-dispatch drops remain outside this boundary and need their own ingress projection.
*/
function createInboundMessageAuditTerminal(params) {
	if (!hasTrustedMessageAuditListeners()) return;
	const startedAt = Date.now();
	let notedTerminal;
	let observedRunId = normalizeOptionalString(params.replyOptions?.runId);
	let finished = false;
	const emitTerminal = (terminal, counts) => {
		if (finished) return;
		finished = true;
		emitInboundMessageAuditTerminal({
			cfg: params.cfg,
			counts,
			ctx: params.ctx,
			observedRunId,
			startedAt,
			terminal
		});
	};
	return {
		note(outcome, options) {
			notedTerminal = {
				outcome,
				...options ? { options } : {}
			};
		},
		observeRunId(runId) {
			observedRunId = normalizeOptionalString(runId) ?? observedRunId;
		},
		finishSuccess(result) {
			emitTerminal(notedTerminal ?? { outcome: "completed" }, result.counts);
		},
		finishError() {
			let counts = {
				tool: 0,
				block: 0,
				final: 0
			};
			try {
				counts = params.dispatcher.getQueuedCounts();
			} catch {}
			emitTerminal({ outcome: "error" }, counts);
		}
	};
}
//#endregion
//#region src/auto-reply/reply/dispatch-from-config.phase-state.ts
function extendPreparedDispatchState(state, values) {
	return Object.assign(state, values);
}
//#endregion
//#region src/auto-reply/reply/dispatch-from-config.events.ts
function admittedSessionSettingsRestrictRuntime(settings) {
	return settings?.permissionMode !== void 0 && settings.permissionMode !== "full" || settings?.toolOverrides !== void 0 && Object.keys(settings.toolOverrides).length > 0;
}
function createReplyDispatchEvent(params) {
	const { shouldSendToolSummaries, ...event } = params;
	return Object.defineProperty(event, "shouldSendToolSummaries", {
		enumerable: true,
		get: shouldSendToolSummaries
	});
}
//#endregion
//#region src/auto-reply/reply/dispatch-from-config.restricted-runtime.ts
const RESTRICTED_RUNTIME_TAKEOVER_ERROR = "This session's bound runtime cannot enforce its permission or tool policy; use an embedded runtime for this restricted conversation.";
function runtimeTakeoverHooksAllowed(settings) {
	return !admittedSessionSettingsRestrictRuntime(settings);
}
async function maybeRefuseRestrictedRuntimeTakeover(params) {
	const { state } = params;
	if (state.dispatchKind !== "acp" || runtimeTakeoverHooksAllowed(state.params.replyOptions?.admittedSessionSettings)) return;
	const refusal = state.suppressDelivery ? {
		queuedFinal: false,
		routedFinalCount: 0
	} : await params.sendFinalPayload({
		text: RESTRICTED_RUNTIME_TAKEOVER_ERROR,
		isError: true
	}, {
		abortSignal: state.getPreDispatchAbortSignal(),
		deliveryId: "restricted-runtime-takeover"
	});
	const counts = state.dispatcher.getQueuedCounts();
	counts.final += refusal.routedFinalCount;
	state.recordProcessed("error", {
		reason: "restricted_runtime_takeover",
		error: RESTRICTED_RUNTIME_TAKEOVER_ERROR
	});
	state.markIdle("message_completed");
	state.commitInboundDedupeIfClaimed();
	state.completeDispatchReplyOperation();
	return {
		queuedFinal: refusal.queuedFinal,
		counts
	};
}
//#endregion
//#region src/auto-reply/reply/dispatch-from-config.reply-dispatch-hook.ts
function runReplyDispatchHook(state, options) {
	const { hookRunner, params } = state;
	if (!state.allowInboundHandlers || !runtimeTakeoverHooksAllowed(params.replyOptions?.admittedSessionSettings) || !hookRunner?.hasHooks("reply_dispatch", { dispatchKind: state.dispatchKind })) return;
	const run = () => state.runWithDispatchLifecycleAdmission(async () => {
		return await runWithDispatchAbortSignal(options.isTailDispatch ? state.getDispatchAbortSignal() : state.getPreDispatchAbortSignal(), () => hookRunner.runReplyDispatch(createReplyDispatchEvent({
			ctx: state.ctx,
			runId: params.replyOptions?.runId,
			sessionKey: state.acpDispatchSessionKey,
			toolsAllow: params.replyOptions?.toolsAllow,
			images: params.replyOptions?.images,
			inboundAudio: state.inboundAudio,
			sessionTtsAuto: state.sessionTtsAuto,
			ttsChannel: state.deliveryChannel,
			suppressUserDelivery: state.suppressHookUserDelivery,
			suppressReplyLifecycle: state.suppressHookReplyLifecycle,
			sourceReplyDeliveryMode: state.sourceReplyDeliveryMode,
			shouldRouteToOriginating: state.shouldRouteToOriginating,
			originatingChannel: state.routeReplyChannel,
			originatingTo: state.routeReplyTo,
			originatingAccountId: state.replyContextAccountId,
			originatingThreadId: state.routeReplyThreadId,
			originatingChatType: state.replyRoute.chatType,
			shouldSendToolSummaries: options.shouldSendToolSummaries,
			shouldSendFullToolDetails: state.shouldEmitFullVerboseProgress(),
			sendPolicy: state.sendPolicy,
			...options.isTailDispatch ? { isTailDispatch: true } : {}
		}), withClaimingHookAdmission({
			cfg: state.cfg,
			dispatchKind: state.dispatchKind,
			dispatcher: state.dispatchHookDispatcher,
			abortSignal: state.getPreDispatchAbortSignal() ?? params.replyOptions?.abortSignal,
			onReplyStart: params.replyOptions?.onReplyStart,
			onAgentRunStart: params.replyOptions?.onAgentRunStart,
			userTurnTranscriptRecorder: params.replyOptions?.userTurnTranscriptRecorder,
			prepareAssistantTranscriptMessage: params.replyOptions?.prepareAssistantTranscriptMessage,
			recordProcessed: state.recordProcessed,
			markIdle: state.markIdle
		}, options.isTailDispatch ? void 0 : state.assertCurrentBindingRoute)), state.trackDispatchLifecycleWork);
	});
	return options.isTailDispatch ? run() : state.traceReplyPhase("reply.reply_dispatch_hooks", run);
}
async function runReplyDispatchTakeover(state, shouldSendToolSummaries) {
	const result = await runReplyDispatchHook(state, { shouldSendToolSummaries });
	if (!result?.handled) return;
	state.commitInboundDedupeIfClaimed();
	state.completeDispatchReplyOperation();
	return {
		status: "complete",
		result: state.attachSourceReplyDeliveryMode({
			queuedFinal: result.queuedFinal,
			counts: result.counts
		})
	};
}
//#endregion
//#region src/auto-reply/reply/dispatch-from-config.session-metadata.ts
function createSessionMetadataChangeNotifier(onSessionMetadataChanges) {
	const notifiedKeys = /* @__PURE__ */ new Set();
	const routeState = {};
	const notifySessionMetadataChanges = (changes) => {
		if (!changes?.length) return;
		const freshChanges = changes.filter((change) => {
			const key = JSON.stringify([
				change.sessionKey,
				change.agentId ?? null,
				change.reason
			]);
			if (notifiedKeys.has(key)) return false;
			notifiedKeys.add(key);
			return true;
		});
		if (freshChanges.length === 0) return;
		routeState.sessionMetadataChangesForResult = [...routeState.sessionMetadataChangesForResult ?? [], ...freshChanges];
		onSessionMetadataChanges?.(freshChanges);
	};
	return {
		notifySessionMetadataChanges,
		routeState
	};
}
//#endregion
//#region src/auto-reply/reply/dispatch-from-config.transcript.ts
async function mirrorDeliveredReplyToTranscript(params) {
	const mirror = params.metadata;
	if (!mirror || mirror.transcriptOwner) return;
	try {
		const result = await appendAssistantMessageToSessionTranscript({
			sessionKey: mirror.sessionKey,
			agentId: mirror.agentId,
			...mirror.expectedSessionId ? { expectedSessionId: mirror.expectedSessionId } : {},
			...mirror.expectedLifecycleRevision !== void 0 ? { expectedLifecycleRevision: mirror.expectedLifecycleRevision } : {},
			...mirror.expectedWriterRunId !== void 0 ? { expectedWriterRunId: mirror.expectedWriterRunId } : {},
			text: mirror.text,
			mediaUrls: mirror.preferText && mirror.text ? void 0 : mirror.mediaUrls,
			idempotencyKey: mirror.idempotencyKey,
			...mirror.deliveryMirror ? { deliveryMirror: mirror.deliveryMirror } : {},
			...mirror.storePath ? { storePath: mirror.storePath } : {},
			updateMode: "inline",
			config: params.cfg,
			beforeMessageWrite: runAgentHarnessBeforeMessageWriteHook
		});
		if (!result.ok) logVerbose(`dispatch-from-config: transcript mirror skipped: ${result.reason}`);
	} catch (error) {
		logVerbose(`dispatch-from-config: transcript mirror failed after delivery: ${formatErrorMessage(error)}`);
	}
}
function transcriptMirrorForDeliveredPayload(metadata, payload) {
	const sendable = resolveSendableOutboundReplyParts(payload);
	if (!sendable.text && sendable.mediaUrls.length === 0) return;
	return {
		...metadata,
		text: sendable.text,
		mediaUrls: sendable.mediaUrls.length > 0 ? sendable.mediaUrls : void 0
	};
}
function captureDeliveredTranscriptMirror(params) {
	if (!params.metadata || !params.dispatcher.appendBeforeDeliver) return () => params.metadata?.transcriptOwner ? void 0 : params.metadata;
	const metadata = params.metadata;
	let deliveredMetadata;
	let observedFinal = false;
	const { idempotencyKey, sessionKey } = metadata;
	params.dispatcher.appendBeforeDeliver((payload, info) => {
		if (info.kind !== "final") return payload;
		if (getReplyPayloadMetadata(payload)?.finalDeliveryCapture !== params.captureToken) return payload;
		observedFinal = true;
		const payloadMirror = getReplyPayloadMetadata(payload)?.sourceReplyTranscriptMirror;
		if (payloadMirror && payloadMirror.idempotencyKey === idempotencyKey && payloadMirror.sessionKey === sessionKey) deliveredMetadata = transcriptMirrorForDeliveredPayload({
			...payloadMirror,
			...metadata.expectedSessionId ? { expectedSessionId: metadata.expectedSessionId } : {},
			...metadata.expectedLifecycleRevision !== void 0 ? { expectedLifecycleRevision: metadata.expectedLifecycleRevision } : {},
			...metadata.expectedWriterRunId !== void 0 ? { expectedWriterRunId: metadata.expectedWriterRunId } : {},
			storePath: metadata.storePath
		}, payload);
		else if (!payloadMirror && !metadata.transcriptOwner && (!idempotencyKey || metadata.deliveryMirror)) deliveredMetadata = transcriptMirrorForDeliveredPayload(metadata, payload);
		return payload;
	});
	return () => observedFinal ? deliveredMetadata : metadata.transcriptOwner ? void 0 : metadata;
}
async function mirrorTranscriptAfterDispatcherSettled(params) {
	if (await params.outcome !== "delivered") return;
	const metadata = params.metadata();
	if (!metadata) return;
	await mirrorDeliveredReplyToTranscript({
		metadata,
		cfg: params.cfg
	});
}
//#endregion
//#region src/auto-reply/reply/dispatch-from-config.choose-route.ts
async function chooseDispatchRoute(state) {
	const { acpDispatchSessionKey, attachSourceReplyDeliveryMode, cfg, commitInboundDedupeIfClaimed, completeDispatchReplyOperation, ctx, deliveryChannel, dispatcher, getPreDispatchAbortSignal, hookRunner, isRoutedReplyDelivered, markIdle, markInboundDedupeReplayUnsafe, params, recordProcessed, replyContextAccountId, replyRoute, resolvePreparedTranscriptBinding, routeReplyChannel, routeReplyThreadId, routeReplyTo, runWithDispatchLifecycleAdmission, sendPayloadAsync, sessionAgentId, sessionKey, sessionStoreEntry, sessionTtsAuto, shouldEmitVerboseProgress, shouldRouteToOriginating, traceReplyPhase, trackDispatchLifecycleWork, turnLedger } = state;
	const shouldSuppressProgressDelivery = () => state.sendPolicyDenied || state.suppressDelivery && !shouldDeliverVerboseProgressDespiteSourceSuppression();
	const shouldSuppressDefaultToolProgressMessages = () => params.replyOptions?.suppressToolProgressMessages === true || !shouldEmitVerboseProgress();
	const shouldSendVerboseProgressMessages = () => !shouldSuppressDefaultToolProgressMessages();
	const shouldSendToolSummaries = () => shouldSendVerboseProgressMessages();
	const { notifySessionMetadataChanges, routeState } = createSessionMetadataChangeNotifier(params.onSessionMetadataChanges);
	const shouldDeliverVerboseProgressDespiteSourceSuppression = () => state.suppressAutomaticSourceDelivery && state.sourceReplyDeliveryMode === "message_tool_only" && ctx.InboundEventKind !== "room_event" && !state.sendPolicyDenied && shouldEmitVerboseProgress() && shouldSendVerboseProgressMessages();
	const shouldDeliverForcedToolProgressDespiteSourceSuppression = () => state.suppressAutomaticSourceDelivery && state.sourceReplyDeliveryMode === "message_tool_only" && ctx.InboundEventKind !== "room_event" && !state.sendPolicyDenied && params.replyOptions?.forceToolResultProgress === true;
	let finalReplyDeliveryStarted = false;
	const isSessionWriterDeliveryAuthorized = (payload) => isDispatchFinalReplySessionWriterAuthorized(payload, sessionStoreEntry.storePath, sessionKey);
	const shouldSuppressLateTextOnlyToolProgress = (payload) => {
		if (!finalReplyDeliveryStarted) return false;
		return !requiresDurableToolResultDelivery(payload);
	};
	let pendingCommentaryProgress = null;
	const deliverCommentaryProgressMessage = async (text) => {
		if (!shouldSendToolSummaries() || shouldSuppressProgressDelivery()) return;
		const payload = { text: `💬 ${text}` };
		if (shouldSuppressLateTextOnlyToolProgress(payload)) return;
		if (shouldRouteToOriginating) await sendPayloadAsync(payload, void 0, false);
		else {
			markInboundDedupeReplayUnsafe();
			turnLedger.sendQueued("tool", payload);
		}
	};
	const flushPendingCommentaryProgress = async () => {
		const pending = pendingCommentaryProgress;
		pendingCommentaryProgress = null;
		const text = pending?.text.trim();
		if (!text) return;
		await deliverCommentaryProgressMessage(text);
	};
	const noteCommentaryProgress = async (payload) => {
		const itemId = payload.itemId?.trim() || void 0;
		const text = payload.progressText ?? "";
		const repeatsBufferedText = pendingCommentaryProgress !== null && pendingCommentaryProgress.text.trim() === text.trim();
		const updatesBufferedItem = pendingCommentaryProgress !== null && (pendingCommentaryProgress.itemId !== void 0 && pendingCommentaryProgress.itemId === itemId || repeatsBufferedText);
		if (!text.trim()) {
			if (updatesBufferedItem) pendingCommentaryProgress = null;
			return;
		}
		if (pendingCommentaryProgress && !updatesBufferedItem) await flushPendingCommentaryProgress();
		pendingCommentaryProgress = {
			itemId,
			text
		};
	};
	const shouldSuppressMessageToolOnlyTextErrorProgress = (payload) => {
		if (state.sourceReplyDeliveryMode !== "message_tool_only" || state.shouldEmitFullVerboseProgress() || payload.isError !== true) return false;
		return !resolveSendableOutboundReplyParts(payload).hasMedia && !hasExecApprovalPayload(payload);
	};
	const captionedFinalTtsContext = {
		cfg,
		ttsAuto: sessionTtsAuto,
		agentId: sessionAgentId,
		channelId: deliveryChannel,
		accountId: replyRoute.accountId,
		inboundAudio: state.inboundAudio
	};
	const deferFinalTtsText = shouldDeferFinalTtsText(captionedFinalTtsContext);
	const cleanDeferredFinalDirectives = shouldCleanTtsDirectiveText(captionedFinalTtsContext);
	const blockDeliveryOutcomes = /* @__PURE__ */ new Map();
	const recordBlockOutcome = (payload, outcome) => {
		setBlockReplyDelivery(outcome, payload);
		const key = createBlockReplyContentKey(payload);
		const outcomes = blockDeliveryOutcomes.get(key) ?? [];
		outcomes.push(outcome);
		blockDeliveryOutcomes.set(key, outcomes);
	};
	const sendTrackedBlockReply = (operation) => {
		const payload = operation.kind === "prepared" ? operation.plan.payload : operation.payload;
		const delivery = operation.kind === "prepared" ? turnLedger.sendPreparedQueued("block", operation.plan) : turnLedger.sendQueued("block", payload);
		if (delivery.queued) recordBlockOutcome(payload, delivery.outcome?.then((outcome) => ({
			outcome,
			pending: delivery.hasPendingDelivery?.()
		})) ?? Promise.resolve({ outcome: "failed-deliver" }));
		else recordBlockOutcome(payload, Promise.resolve({ outcome: "cancelled" }));
		return delivery;
	};
	const recordRoutedBlockReplyDelivery = (payload, result) => {
		if (!result) {
			recordBlockOutcome(payload, Promise.resolve({ outcome: "cancelled" }));
			return;
		}
		const outcome = resolveRoutedReplyDeliveryOutcome(result);
		recordBlockOutcome(payload, Promise.resolve({
			outcome,
			pending: result.queueCustody === "held" || result.ambiguous === true
		}));
		return outcome;
	};
	const getBlockReplyOutcome = async (payload, abortSignal) => {
		const outcomes = blockDeliveryOutcomes.get(createBlockReplyContentKey(payload));
		if (!outcomes || abortSignal?.aborted) return;
		const settled = await runWithDispatchAbortSignal(abortSignal, () => Promise.all(outcomes));
		return settled.find(({ outcome }) => outcome === "delivered") ?? settled.find(({ outcome, pending }) => pending || !shouldRetryReplyDispatch(outcome)) ?? settled[0];
	};
	const sendFinalPayload = async (inputPayload, options = {}) => {
		const abortSignal = options.abortSignal === false ? void 0 : options.abortSignal ?? state.getDispatchAbortSignal();
		const throwIfFinalDeliveryAborted = () => {
			if (abortSignal?.aborted) throw new DispatchReplyOperationAbortedError();
		};
		throwIfFinalDeliveryAborted();
		await flushPendingCommentaryProgress();
		throwIfFinalDeliveryAborted();
		const preparation = prepareReplyPayloadForDispatcher(dispatcher, "final", inputPayload);
		if (preparation.kind === "suppress") {
			await suppressPendingFinalDelivery(inputPayload, { preserveActivity: state.replyOperationRunState.heartbeat !== void 0 });
			return {
				queuedFinal: false,
				routedFinalCount: 0,
				suppressionReason: preparation.reason
			};
		}
		const payload = renderPostCompactionModelFailurePayload(preparation.payload);
		const payloadMetadata = getReplyPayloadMetadata(payload);
		const expectedWriterRunId = normalizeOptionalString(params.replyOptions?.runId);
		const expectedLifecycleRevision = sessionStoreEntry.entry?.lifecycleRevision;
		const sourceReplySessionBinding = resolvePreparedTranscriptBinding(payloadMetadata?.sourceReplyTranscriptMirror?.sessionKey);
		let sourceReplyTranscriptMirror = payloadMetadata?.sourceReplyTranscriptMirror ? {
			...payloadMetadata.sourceReplyTranscriptMirror,
			...sourceReplySessionBinding ? { expectedSessionId: sourceReplySessionBinding.sessionId } : {},
			...expectedLifecycleRevision !== void 0 ? { expectedLifecycleRevision } : {},
			...expectedWriterRunId ? { expectedWriterRunId } : {},
			storePath: sourceReplySessionBinding?.storePath ?? sessionStoreEntry.storePath
		} : void 0;
		const hasTranscriptOwner = payloadMetadata?.assistantMessageIndex !== void 0 || payloadMetadata?.assistantTranscriptOwned === true;
		const hasVisibleFinalContent = hasOutboundReplyContent(payload, { trimText: true });
		if (hasVisibleFinalContent) {
			markInboundDedupeReplayUnsafe();
			finalReplyDeliveryStarted = true;
		}
		const shouldAttachDeferredText = deferFinalTtsText && isCaptionedFinalTextPayload(payload);
		const deferredRawText = shouldAttachDeferredText ? mergeDeferredFinalText(options.deferredTtsText ?? "", payload.text) : void 0;
		const ttsInputPayload = shouldAttachDeferredText ? copyReplyPayloadMetadata(payload, {
			...payload,
			text: deferredRawText
		}) : payload;
		const deferredVisibleText = shouldAttachDeferredText ? cleanDeferredFinalDirectives ? cleanDeferredFinalText(deferredRawText) : deferredRawText : void 0;
		let appliedTtsPayload = payload;
		if (!options.skipTts && payload.isReasoning !== true && payload.isCommentary !== true) try {
			appliedTtsPayload = await state.maybeApplyTtsWithFinalizationLease({
				payload: ttsInputPayload,
				cfg,
				channel: deliveryChannel,
				kind: "final",
				ttsAuto: sessionTtsAuto,
				agentId: sessionAgentId,
				accountId: replyRoute.accountId
			});
		} catch (error) {
			if (!shouldAttachDeferredText) throw error;
			logVerbose(`dispatch-from-config: final TTS failed: ${formatErrorMessage(error)}`);
		}
		const ttsPayload = shouldAttachDeferredText ? copyReplyPayloadMetadata(appliedTtsPayload, {
			...appliedTtsPayload,
			text: deferredVisibleText || void 0
		}) : appliedTtsPayload;
		throwIfFinalDeliveryAborted();
		let normalizedPayload;
		try {
			normalizedPayload = await state.normalizeReplyMediaPayload(ttsPayload);
		} catch (error) {
			if (!shouldAttachDeferredText || !deferredVisibleText) throw error;
			logVerbose(`dispatch-from-config: media normalization failed: ${formatErrorMessage(error)}`);
			normalizedPayload = buildCaptionedFinalTextFallback(ttsPayload);
		}
		throwIfFinalDeliveryAborted();
		const sourceRecovery = getReplyPayloadMetadata(payload)?.blockReplySources;
		let block;
		if (sourceRecovery) {
			const recovery = await runWithDispatchAbortSignal(abortSignal, () => recoverBlockReplySources(normalizedPayload, sourceRecovery));
			normalizedPayload = recovery.payload;
			block = recovery.delivery;
		} else block = await getBlockReplyOutcome(payload, abortSignal);
		throwIfFinalDeliveryAborted();
		const blockDeliveryOutcome = block?.outcome;
		const pendingBlock = block?.pending && blockDeliveryOutcome !== "delivered";
		if (blockDeliveryOutcome && (pendingBlock || !shouldRetryReplyDispatch(blockDeliveryOutcome))) {
			if (blockDeliveryOutcome === "channel-transform" || blockDeliveryOutcome === "failed-deliver" && !pendingBlock && !sourceRecovery || createBlockReplyContentKey(normalizedPayload) === createBlockReplyContentKey(payload)) return {
				blockDeliveryOutcome,
				pendingBlock,
				queuedFinal: false,
				routedFinalCount: 0
			};
			normalizedPayload = copyReplyPayloadMetadata(normalizedPayload, {
				...normalizedPayload,
				text: void 0
			});
			if (pendingBlock) await suppressPendingFinalDelivery(payload, { preserveActivity: state.replyOperationRunState.heartbeat !== void 0 });
			if (pendingBlock || sourceRecovery) {
				setReplyPayloadMetadata(normalizedPayload, { pendingFinalDeliveryCompletion: void 0 });
				sourceReplyTranscriptMirror = sourceReplyTranscriptMirror ? transcriptMirrorForDeliveredPayload(sourceReplyTranscriptMirror, normalizedPayload) : void 0;
			}
			if (!hasOutboundReplyContent(normalizedPayload, { trimText: true })) return {
				blockDeliveryOutcome,
				pendingBlock,
				queuedFinal: false,
				routedFinalCount: 0
			};
		}
		if (!isSessionWriterDeliveryAuthorized(normalizedPayload)) return {
			queuedFinal: false,
			routedFinalCount: 0,
			sessionWriterDeliveryRevoked: true
		};
		let result = await state.routeReplyToOriginating(normalizedPayload, {
			abortSignal,
			kind: "final",
			...hasTranscriptOwner ? { mirror: false } : {}
		});
		if (result) {
			let routedOutcome = resolveRoutedReplyDeliveryOutcome(result);
			if (!result.ok) logVerbose(`dispatch-from-config: route-reply (final) failed: ${result.error ?? "unknown error"}`);
			const fallbackText = deferFinalTtsText && normalizedPayload.mediaUrl ? normalizeOptionalString(normalizedPayload.text) : void 0;
			if (fallbackText && shouldRetryReplyDispatch(routedOutcome)) {
				if (!isSessionWriterDeliveryAuthorized(normalizedPayload)) return {
					queuedFinal: false,
					routedFinalCount: 0,
					sessionWriterDeliveryRevoked: true
				};
				result = await state.routeReplyToOriginating(copyReplyPayloadMetadata(normalizedPayload, { text: fallbackText }), {
					abortSignal,
					kind: "final",
					...hasTranscriptOwner ? { mirror: false } : {}
				}) ?? result;
				routedOutcome = resolveRoutedReplyDeliveryOutcome(result);
			}
			if (isRoutedReplyDelivered(result)) await mirrorDeliveredReplyToTranscript({
				metadata: sourceReplyTranscriptMirror,
				cfg
			});
			return {
				blockDeliveryOutcome: sourceRecovery ? blockDeliveryOutcome : void 0,
				pendingBlock,
				queuedFinal: result.ok,
				routedFinalCount: isRoutedReplyDelivered(result) ? 1 : 0,
				routedOutcome,
				...result.reason === "channel_transform" ? { suppressionReason: "channel_transform" } : {}
			};
		}
		throwIfFinalDeliveryAborted();
		const transcriptMirrorSessionKey = acpDispatchSessionKey ?? sessionStoreEntry.sessionKey ?? sessionKey;
		const transcriptMirrorSourceId = normalizeOptionalString(state.messageIdForHook) ?? normalizeOptionalString(params.replyOptions?.runId);
		const transcriptMirrorSessionBinding = resolvePreparedTranscriptBinding(transcriptMirrorSessionKey);
		const transcriptMirror = sourceReplyTranscriptMirror ?? (state.normalizedCurrentSurface === "slack" && hasVisibleFinalContent && transcriptMirrorSessionKey ? transcriptMirrorForDeliveredPayload({
			sessionKey: transcriptMirrorSessionKey,
			agentId: sessionAgentId,
			...transcriptMirrorSessionBinding ? { expectedSessionId: transcriptMirrorSessionBinding.sessionId } : {},
			...expectedLifecycleRevision !== void 0 ? { expectedLifecycleRevision } : {},
			...expectedWriterRunId ? { expectedWriterRunId } : {},
			storePath: transcriptMirrorSessionBinding?.storePath ?? sessionStoreEntry.storePath,
			preferText: true,
			...hasTranscriptOwner ? { transcriptOwner: true } : {},
			idempotencyKey: transcriptMirrorSourceId ? `channel-final:${transcriptMirrorSourceId}:${options.deliveryId ?? "single"}` : void 0,
			deliveryMirror: {
				kind: "channel-final",
				...transcriptMirrorSourceId ? { sourceMessageId: transcriptMirrorSourceId } : {}
			}
		}, normalizedPayload) : void 0);
		if (!isSessionWriterDeliveryAuthorized(normalizedPayload)) return {
			queuedFinal: false,
			routedFinalCount: 0,
			sessionWriterDeliveryRevoked: true
		};
		markInboundDedupeReplayUnsafe();
		const finalDeliveryCapture = transcriptMirror ? {} : void 0;
		const deliveredTranscriptMirror = transcriptMirror ? captureDeliveredTranscriptMirror({
			dispatcher,
			metadata: transcriptMirror,
			captureToken: finalDeliveryCapture
		}) : void 0;
		if (finalDeliveryCapture) setReplyPayloadMetadata(normalizedPayload, { finalDeliveryCapture });
		if (deferFinalTtsText && normalizedPayload.mediaUrl && normalizedPayload.text?.trim()) attachReplyDispatchUndeliveredFallback(normalizedPayload, buildCaptionedFinalTextFallback(normalizedPayload));
		const { queued: queuedFinal, outcome: dispatcherOutcome } = turnLedger.sendQueued("final", normalizedPayload);
		if (queuedFinal && deliveredTranscriptMirror && dispatcherOutcome) registerReplyDispatcherSettledTask(dispatcher, () => mirrorTranscriptAfterDispatcherSettled({
			outcome: dispatcherOutcome,
			metadata: deliveredTranscriptMirror,
			cfg
		}));
		return {
			blockDeliveryOutcome: sourceRecovery ? blockDeliveryOutcome : void 0,
			pendingBlock,
			queuedFinal,
			routedFinalCount: 0,
			...queuedFinal && dispatcherOutcome ? { dispatcherOutcome } : {}
		};
	};
	if (state.allowInboundHandlers && runtimeTakeoverHooksAllowed(params.replyOptions?.admittedSessionSettings) && hookRunner?.hasHooks("before_dispatch")) {
		const beforeDispatchSessionKey = sessionStoreEntry.sessionKey ?? sessionKey;
		const pluginSubagentRequester = createPluginSubagentRequesterContext({
			sessionKey: beforeDispatchSessionKey,
			origin: {
				channel: routeReplyChannel,
				to: routeReplyTo,
				accountId: replyContextAccountId,
				threadId: routeReplyThreadId
			}
		});
		const beforeDispatchResult = await traceReplyPhase("reply.before_dispatch_hooks", () => runWithDispatchLifecycleAdmission(async () => {
			return await runWithDispatchAbortSignal(getPreDispatchAbortSignal(), () => hookRunner.runBeforeDispatch({
				messageId: state.hookState.hookContext.messageId,
				content: state.hookState.hookContext.content,
				body: state.hookState.hookContext.bodyForAgent ?? state.hookState.hookContext.body,
				channel: state.hookState.hookContext.channelId,
				sessionKey: beforeDispatchSessionKey,
				senderId: state.hookState.hookContext.senderId,
				replyToId: state.hookState.hookContext.replyToId,
				replyToIdFull: state.hookState.hookContext.replyToIdFull,
				replyToBody: state.hookState.hookContext.replyToBody,
				replyToSender: state.hookState.hookContext.replyToSender,
				replyToIsQuote: state.hookState.hookContext.replyToIsQuote,
				isGroup: state.hookState.hookContext.isGroup,
				timestamp: state.hookState.hookContext.timestamp
			}, withClaimingHookAdmission({
				messageId: state.hookState.hookContext.messageId,
				channelId: state.hookState.hookContext.channelId,
				accountId: state.hookState.hookContext.accountId,
				conversationId: state.hookState.inboundClaimContext.conversationId,
				sessionKey: beforeDispatchSessionKey,
				senderId: state.hookState.hookContext.senderId,
				replyToId: state.hookState.hookContext.replyToId,
				replyToIdFull: state.hookState.hookContext.replyToIdFull,
				replyToBody: state.hookState.hookContext.replyToBody,
				replyToSender: state.hookState.hookContext.replyToSender,
				replyToIsQuote: state.hookState.hookContext.replyToIsQuote
			}, state.assertCurrentBindingRoute), pluginSubagentRequester), trackDispatchLifecycleWork);
		}));
		if (beforeDispatchResult?.handled) {
			const text = beforeDispatchResult.text;
			let queuedFinal = false;
			let routedFinalCount = 0;
			if (text && !state.suppressDelivery) {
				const handledReply = await sendFinalPayload({ text }, {
					abortSignal: getPreDispatchAbortSignal(),
					deliveryId: "before-dispatch"
				});
				queuedFinal = handledReply.queuedFinal;
				routedFinalCount += handledReply.routedFinalCount;
			}
			const counts = dispatcher.getQueuedCounts();
			counts.final += routedFinalCount;
			recordProcessed("completed", { reason: "before_dispatch_handled" });
			markIdle("message_completed");
			commitInboundDedupeIfClaimed();
			completeDispatchReplyOperation();
			return {
				status: "complete",
				result: attachSourceReplyDeliveryMode({
					queuedFinal,
					counts
				})
			};
		}
	}
	const restrictedRuntimeRefusal = await maybeRefuseRestrictedRuntimeTakeover({
		state,
		sendFinalPayload
	});
	if (restrictedRuntimeRefusal) return {
		status: "complete",
		result: attachSourceReplyDeliveryMode(restrictedRuntimeRefusal)
	};
	const replyDispatchTakeover = await runReplyDispatchTakeover(state, shouldSendToolSummaries);
	if (replyDispatchTakeover) return replyDispatchTakeover;
	const dispatchAcquisition = await state.ensureDispatchReplyOperation(state.activeRunSafeCommandTurn ? "command_resolution" : "dispatch");
	if (dispatchAcquisition.status === "aborted") return {
		status: "complete",
		result: state.finishReplyOperationAbortedDispatch()
	};
	if (dispatchAcquisition.status === "busy") return {
		status: "complete",
		result: state.finishReplyOperationBusyDispatch({ dedupeDisposition: "release" })
	};
	return {
		status: "ready",
		state: extendPreparedDispatchState(state, {
			shouldSuppressDefaultToolProgressMessages,
			shouldSendVerboseProgressMessages,
			shouldSendToolSummaries,
			notifySessionMetadataChanges,
			shouldDeliverVerboseProgressDespiteSourceSuppression,
			shouldDeliverForcedToolProgressDespiteSourceSuppression,
			shouldSuppressLateTextOnlyToolProgress,
			flushPendingCommentaryProgress,
			noteCommentaryProgress,
			shouldSuppressMessageToolOnlyTextErrorProgress,
			sendTrackedBlockReply,
			recordRoutedBlockReplyDelivery,
			sendFinalPayload,
			isSessionWriterDeliveryAuthorized,
			deferFinalTtsText,
			routeState
		})
	};
}
//#endregion
//#region src/auto-reply/reply/dispatch-from-config.acp-tail.ts
async function handleAcpDispatchTailAfterReset(state) {
	if (state.ctx.AcpDispatchTailAfterReset !== true) return;
	state.ctx.AcpDispatchTailAfterReset = false;
	const tailDispatchResult = await runReplyDispatchHook(state, {
		shouldSendToolSummaries: state.shouldSendToolSummaries,
		isTailDispatch: true
	});
	if (!tailDispatchResult?.handled) return;
	state.commitInboundDedupeIfClaimed();
	state.recordAgentDispatchCompleted("completed");
	state.completeDispatchReplyOperation();
	return {
		status: "complete",
		result: state.attachSourceReplyDeliveryMode({
			queuedFinal: tailDispatchResult.queuedFinal,
			counts: tailDispatchResult.counts,
			...state.routeState.sessionMetadataChangesForResult ? { sessionMetadataChanges: state.routeState.sessionMetadataChangesForResult } : {}
		})
	};
}
//#endregion
//#region src/auto-reply/reply/dispatch-from-config.block-reply.ts
function createDispatchBlockReplyHandler(state) {
	const { cleanBlockTtsDirectiveText, commentaryPayloadsEnabled, cfg, deliveryChannel, deferFinalTtsText, dispatcher, flushPendingCommentaryProgress, isDispatchOperationAborted, markInboundDedupeReplayUnsafe, markProgress, maybeApplyTtsWithFinalizationLease, normalizeReplyMediaPayload, params, reasoningPayloadsEnabled, replyRoute, sessionAgentId, sessionTtsAuto, shouldRouteToOriginating, trackDispatchLifecycleWork } = state;
	let pendingBlockSource;
	let drain;
	const dispatchBlockReply = (operation, context) => {
		const inputPayload = operation.kind === "prepared" ? operation.plan.payload : operation.payload;
		setBlockReplyDelivery(Promise.resolve({ outcome: "cancelled" }));
		if (state.replyOperationRunState.heartbeat) return Promise.resolve();
		markProgress();
		const run = async () => {
			if (isDispatchOperationAborted()) return;
			await flushPendingCommentaryProgress();
			const independentDurableBlock = context?.deliveryIntentId !== void 0;
			if (independentDurableBlock && state.suppressAcpChildUserDelivery) return;
			if (state.suppressDelivery && !shouldDeliverDespiteSourceReplySuppression(inputPayload, state)) return;
			if (inputPayload.isReasoning === true && !reasoningPayloadsEnabled) return;
			if (inputPayload.isCommentary === true && !commentaryPayloadsEnabled) return;
			const payload = prepareReplyPayloadForSideEffects(dispatcher, "block", inputPayload, state.progressState, markInboundDedupeReplayUnsafe);
			if (!payload) return;
			const contributesToFinalReply = !isReplyPayloadStatusNotice(payload) && !independentDurableBlock && payload.isReasoning !== true && payload.isCommentary !== true;
			if (payload.text && contributesToFinalReply) {
				const joinsBufferedTtsDirective = cleanBlockTtsDirectiveText?.hasBufferedDirectiveText() === true;
				if (state.progressState.accumulatedBlockText.length > 0) state.progressState.accumulatedBlockText += "\n";
				state.progressState.accumulatedBlockText += payload.text;
				if (state.progressState.accumulatedBlockTtsText.length > 0 && !joinsBufferedTtsDirective) state.progressState.accumulatedBlockTtsText += "\n";
				state.progressState.accumulatedBlockTtsText += payload.text;
				state.progressState.blockCount++;
			}
			let source;
			const cleanedPayload = payload.text && cleanBlockTtsDirectiveText && contributesToFinalReply ? (() => {
				if (!deferFinalTtsText) source = pendingBlockSource ?? createBlockReplySource();
				const text = cleanBlockTtsDirectiveText.push(payload.text);
				const buffered = cleanBlockTtsDirectiveText.hasBufferedDirectiveText();
				source?.setComplete(!buffered);
				pendingBlockSource = buffered ? source : void 0;
				return copyReplyPayloadMetadata(payload, {
					...payload,
					text: text.trim() ? text : void 0
				});
			})() : payload;
			const sendPrepared = async (preparedPayload, terminal = false) => {
				let visiblePayload = preparedPayload;
				if (terminal) setBlockReplyDelivery(Promise.resolve({ outcome: "cancelled" }), visiblePayload);
				if (deferFinalTtsText && contributesToFinalReply) {
					if (!Boolean(visiblePayload.mediaUrl || visiblePayload.mediaUrls?.length || visiblePayload.presentation || visiblePayload.interactive || visiblePayload.channelData)) return;
					visiblePayload = copyReplyPayloadMetadata(visiblePayload, {
						...visiblePayload,
						text: void 0
					});
				}
				if (!hasOutboundReplyContent(visiblePayload, { trimText: true })) return;
				const payloadMetadata = getReplyPayloadMetadata(payload);
				const queuedContext = payloadMetadata?.assistantMessageIndex !== void 0 ? {
					...context,
					assistantMessageIndex: payloadMetadata.assistantMessageIndex
				} : context;
				if (isDispatchOperationAborted()) return;
				const ttsPayload = terminal || payload.isReasoning === true || payload.isCommentary === true ? visiblePayload : await maybeApplyTtsWithFinalizationLease({
					payload: visiblePayload,
					cfg,
					channel: deliveryChannel,
					kind: "block",
					ttsAuto: sessionTtsAuto,
					agentId: sessionAgentId,
					accountId: replyRoute.accountId
				});
				const normalizedPayload = await normalizeReplyMediaPayload(ttsPayload);
				let deliveryOperation = {
					kind: "raw",
					payload: normalizedPayload
				};
				if (operation.kind === "prepared") {
					const plan = createStructuredOutboundPayloadPlan([normalizedPayload])[0];
					if (!plan) return;
					deliveryOperation = {
						kind: "prepared",
						plan
					};
				}
				if (isDispatchOperationAborted()) return;
				if (shouldRouteToOriginating || independentDurableBlock && state.canRouteDurableBlockReply) {
					const result = await state.sendReplyOperationAsync(deliveryOperation, context?.abortSignal, false, "block", context?.deliveryIntentId);
					if (state.recordRoutedBlockReplyDelivery(normalizedPayload, result) === "delivered" && !state.suppressAutomaticSourceDelivery) await params.replyOptions?.onBlockReplyQueued?.(visiblePayload, queuedContext);
				} else {
					markInboundDedupeReplayUnsafe();
					const delivery = state.sendTrackedBlockReply(deliveryOperation);
					if (delivery.queued) {
						const pending = (delivery.outcome ?? dispatcher.waitForIdle()).then(() => void 0);
						pending.catch(() => void 0);
						state.progressState.pendingDirectBlockReplyDelivery = pending;
					}
					if (delivery.queued && !state.suppressAutomaticSourceDelivery && params.replyOptions?.onBlockReplyQueued) trackDispatchLifecycleWork((delivery.outcome ?? Promise.resolve("delivered")).then(async (outcome) => {
						if (outcome === "delivered" && !context?.abortSignal?.aborted) await params.replyOptions?.onBlockReplyQueued?.(visiblePayload, queuedContext);
					}), "delivery");
				}
			};
			if (cleanBlockTtsDirectiveText && contributesToFinalReply && payload.text) drain = async (text) => {
				if (!text || deferFinalTtsText) {
					source?.setComplete(true);
					return;
				}
				if (isDispatchOperationAborted()) return;
				const tail = buildCaptionedFinalTextFallback(payload);
				tail.text = text;
				source?.setComplete(true);
				const send = () => sendPrepared(tail, true);
				if (source) await source.run(send);
				else await send();
			};
			const send = () => sendPrepared(cleanedPayload);
			if (source) await source.run(send);
			else await send();
		};
		return run();
	};
	const onBlockReply = (payload, context) => dispatchBlockReply({
		kind: "raw",
		payload
	}, context);
	const onPreparedBlockReply = (plan, context) => dispatchBlockReply({
		kind: "prepared",
		plan
	}, context);
	return {
		onBlockReply,
		onPreparedBlockReply,
		flush: async () => {
			if (!cleanBlockTtsDirectiveText?.hasBufferedDirectiveText()) return;
			const text = cleanBlockTtsDirectiveText.flush();
			const finish = drain;
			drain = void 0;
			pendingBlockSource = void 0;
			await finish?.(text);
		}
	};
}
//#endregion
//#region src/auto-reply/reply/dispatch-from-config.deferred-final.ts
/** Sends the deferred block text when execution exits before normal finalization. */
async function flushDispatchDeferredFinalText(params) {
	try {
		if (!params.deferFinalTtsText || params.isHeartbeat) return false;
		const deferredVisibleText = params.state.cleanBlockTtsDirectiveText ? cleanDeferredFinalText(params.state.progressState.accumulatedBlockTtsText) : params.state.progressState.accumulatedBlockText;
		if (!deferredVisibleText.trim()) return false;
		const fallback = await params.state.sendFinalPayload({ text: deferredVisibleText }, {
			abortSignal: params.state.isDispatchOperationAborted() ? false : void 0,
			skipTts: true
		});
		if (!fallback.queuedFinal && fallback.routedFinalCount === 0) return false;
		params.state.progressState.accumulatedBlockText = "";
		params.state.progressState.accumulatedBlockTtsText = "";
		return true;
	} catch (error) {
		logVerbose(`dispatch-from-config: deferred final text fallback failed: ${formatErrorMessage(error)}`);
		return false;
	}
}
//#endregion
//#region src/auto-reply/reply/dispatch-from-config.turn-ledger.ts
const SETTLE_QUEUED_TIMEOUT_MS = 3e4;
async function requireQueuedReplyDelivery(params) {
	if (!params.delivery.queued) throw new Error("queued reply delivery failed");
	const outcome = params.delivery.outcome;
	if (!outcome) {
		const receipt = await waitForReplyDispatcherIdle(params.dispatcher, params.abortSignal);
		if (params.dispatcher.supportsSettledReceipt === true && receipt?.anyVisibleDelivered !== true) throw new Error("queued reply delivery failed");
		return;
	}
	const settledOutcome = await runWithDispatchAbortSignal(params.abortSignal, () => outcome);
	if (settledOutcome !== "delivered") throw new ReplyDispatchDeliveryError(settledOutcome);
}
function createReplyTurnLedger(dispatcher) {
	const outcomes = /* @__PURE__ */ new Set();
	let pendingDelivery = false;
	let terminalDelivery = "missing";
	const mayHaveDelivered = () => outcomes.has("delivered") || outcomes.has("failed-deliver");
	const recordDelivery = (kind, payload, outcome, pending) => {
		pendingDelivery ||= pending;
		if (!hasOutboundReplyContent(payload, { trimText: true })) return;
		outcomes.add(outcome);
		if (kind === "tool" || !isReplyPayloadTerminalContent(payload)) return;
		if (outcome === "delivered" && !pending) terminalDelivery = "delivered";
		else if (terminalDelivery !== "delivered" && (pending || outcome === "failed-deliver" || outcome === "recovery-owned")) terminalDelivery = "pending";
	};
	const enqueue = (kind, payload) => {
		if (kind === "tool") return dispatcher.sendToolResult(payload);
		if (kind === "block") return dispatcher.sendBlockReply(payload);
		return dispatcher.sendFinalReply(payload);
	};
	const sendOperation = (kind, operation) => {
		const payload = operation.kind === "prepared" ? operation.plan.payload : operation.payload;
		const capture = dispatcher.supportsSettledReceipt === true ? captureReplyDispatchDeliveryOutcome(payload) : void 0;
		if (!(operation.kind === "prepared" && dispatcher.sendPreparedReply ? dispatcher.sendPreparedReply(kind, operation.plan) : enqueue(kind, payload))) return { queued: false };
		if (!capture || !capture.isTracked()) {
			recordDelivery(kind, payload, "failed-deliver", false);
			return { queued: true };
		}
		return {
			queued: true,
			outcome: capture.promise.then((settled) => {
				recordDelivery(kind, payload, settled, capture.hasPendingDelivery());
				return settled;
			}),
			hasPendingDelivery: capture.hasPendingDelivery
		};
	};
	return {
		sendQueued: (kind, payload) => sendOperation(kind, {
			kind: "raw",
			payload
		}),
		sendPreparedQueued: (kind, plan) => sendOperation(kind, {
			kind: "prepared",
			plan
		}),
		recordRoutedDelivery(kind, payload, result) {
			const outcome = resolveRoutedReplyDeliveryOutcome(result);
			recordDelivery(kind, payload, outcome, result.queueCustody === "held" || result.ambiguous === true || outcome === "recovery-owned");
		},
		async settleQueued(abortSignal) {
			if (abortSignal?.aborted) return "aborted";
			let timedOut = false;
			let timer;
			const deadline = new Promise((resolve) => {
				timer = setTimeout(() => {
					timedOut = true;
					resolve();
				}, SETTLE_QUEUED_TIMEOUT_MS);
				timer.unref?.();
			});
			let removeAbortListener;
			const aborted = abortSignal ? new Promise((resolve) => {
				const onAbort = () => resolve();
				abortSignal.addEventListener("abort", onAbort, { once: true });
				removeAbortListener = () => abortSignal.removeEventListener("abort", onAbort);
			}) : void 0;
			try {
				const receipt = await Promise.race([
					dispatcher.waitForIdle(),
					deadline,
					...aborted ? [aborted] : []
				]);
				if (abortSignal?.aborted) return "aborted";
				if (timedOut) return "timed-out";
				if (dispatcher.supportsSettledReceipt === true && receipt) for (const counts of Object.values(receipt.counts)) {
					if (counts.delivered > 0) outcomes.add("delivered");
					if (counts.failedAfterSend > 0) outcomes.add("failed-deliver");
				}
				pendingDelivery ||= receipt?.hasPendingDelivery === true;
				return "settled";
			} finally {
				if (timer) clearTimeout(timer);
				removeAbortListener?.();
			}
		},
		mayHaveDelivered,
		hasObservedDelivery: () => outcomes.has("delivered"),
		canAttemptFallback: () => !mayHaveDelivered() && !pendingDelivery && !outcomes.has("recovery-owned"),
		hasPendingDelivery: () => pendingDelivery,
		resolveTerminalDelivery: () => terminalDelivery
	};
}
//#endregion
//#region src/auto-reply/reply/dispatch-from-config.execute.ts
async function executeDispatch(state) {
	const { cfg, commentaryPayloadsEnabled, ctx, deliveryChannel, deferFinalTtsText, dispatcher, failDispatchReplyOperation, flushPendingCommentaryProgress, getAgentRunTerminalOutcome, getDispatchAbortOperation, getDispatchAbortSignal, isDispatchOperationAborted, markInboundDedupeReplayUnsafe, markProgress, maybeApplyTtsWithFinalizationLease, normalizeReplyMediaPayload, notifySessionMetadataChanges, onToolResultFromReplyOptions, onReasoningStream, params, reasoningPayloadsEnabled, replyConfig, replyRoute, resolveToolDeliveryPayload, runWithDispatchLifecycleAdmission, sendPayloadAsync, sessionAgentId, sessionTtsAuto, shouldForwardProgressCallback, shouldRouteToOriginating, shouldSuppressDefaultToolProgressMessages, trackDispatchLifecycleWork, typing, waitForPendingDirectBlockReplyDelivery, wrapProgressCallback } = state;
	const replyResolver = bindPreparedReplyDispatchRuntime(params.configOverride ? void 0 : state.preparedReplyDispatchRuntime, state.replyResolver);
	let pendingContinuation = false;
	let pendingContinuationSettlement;
	const releasePendingContinuation = async () => {
		const settlement = pendingContinuationSettlement;
		pendingContinuationSettlement = void 0;
		await settlement?.settle(false);
	};
	let didDeliverVisiblePartialReply = false;
	const { onBlockReply, onPreparedBlockReply, flush: flushBlockTtsText } = createDispatchBlockReplyHandler(state);
	const flushDeferredFinalText = async () => {
		const delivered = await flushDispatchDeferredFinalText({
			deferFinalTtsText,
			isHeartbeat: params.replyOptions?.isHeartbeat === true,
			state
		});
		didDeliverVisiblePartialReply ||= delivered;
		return delivered;
	};
	const forwardToolProgress = async (forward) => {
		if (isDispatchOperationAborted()) return;
		markProgress();
		await waitForPendingDirectBlockReplyDelivery(getDispatchAbortOperation()?.abortSignal);
		if (isDispatchOperationAborted()) return;
		markInboundDedupeReplayUnsafe();
		if (shouldForwardProgressCallback({
			forwardWhenSourceDeliverySuppressed: true,
			requiresToolSummaryVisibility: true
		})) await forward();
	};
	const replyResult = await runWithDispatchLifecycleAdmission(async () => await runWithDispatchAbortSignal(getDispatchAbortSignal(), () => state.traceReplyPhase("reply.run_reply_resolver", async () => {
		const result = await replyResolver(ctx, {
			...state.getReplyOptions(),
			[REPLY_OPERATION_RUN_STATE]: state.replyOperationRunState,
			sourceReplyDeliveryMode: state.sourceReplyDeliveryMode,
			sessionPromptSourceReplyDeliveryMode: state.sessionStableSourceReplyDeliveryMode,
			...state.sourceReplyDeliveryRuntimeOptions,
			mediaNormalizationOwner: state.isInternalWebchatTurn ? "gateway" : void 0,
			onPendingContinuation: (settlement) => {
				pendingContinuation = true;
				pendingContinuationSettlement ??= settlement;
			},
			onSessionMetadataChanges: notifySessionMetadataChanges,
			onSessionPrepared: state.notePreparedSession,
			onRunVerbosityResolved: (settings) => {
				state.noteRunVerbosity(settings);
				params.replyOptions?.onRunVerbosityResolved?.(settings);
			},
			onObservedReplyDelivery: state.markObservedReplyDelivery,
			typingPolicy: typing.typingPolicy,
			suppressTyping: typing.suppressTyping,
			onPartialReply: deferFinalTtsText ? void 0 : wrapProgressCallback(params.replyOptions?.onPartialReply, { onVisible: (payload) => {
				if (hasOutboundReplyContent(payload, { trimText: true })) didDeliverVisiblePartialReply = true;
			} }),
			onReasoningStream,
			streamReasoningInNonStreamModes: params.replyOptions?.streamReasoningInNonStreamModes,
			onReasoningEnd: wrapProgressCallback(params.replyOptions?.onReasoningEnd),
			onAssistantMessageStart: wrapProgressCallback(params.replyOptions?.onAssistantMessageStart),
			onQueuedFollowupSettled: async () => {
				try {
					await flushBlockTtsText();
					await waitForPendingDirectBlockReplyDelivery();
					if (dispatcher.getFailedCounts().block > 0 && state.turnLedger.canAttemptFallback()) await dispatcher.waitForIdle();
				} catch (error) {
					try {
						await params.replyOptions?.onQueuedFollowupSettled?.();
					} catch (cleanupError) {
						logVerbose(`dispatch-from-config: queued cleanup failed; preserving delivery error: ${formatErrorMessage(cleanupError)}`);
					}
					throw error;
				}
				await params.replyOptions?.onQueuedFollowupSettled?.();
			},
			onBlockReplyQueued: wrapProgressCallback(params.replyOptions?.onBlockReplyQueued),
			onToolStart: wrapProgressCallback(params.replyOptions?.onToolStart, {
				allowWhenToolSummariesHidden: params.replyOptions?.allowToolLifecycleWhenProgressHidden === true,
				forwardWhenSourceDeliverySuppressed: true,
				requiresToolSummaryVisibility: true,
				waitForDirectBlockReplyDelivery: true,
				onForward: async () => {
					await flushPendingCommentaryProgress();
				}
			}),
			onItemEvent: state.onItemEvent,
			commentaryProgressEnabled: state.deliverStandaloneCommentaryProgress || state.canForwardSuppressedSourceItemEvents || params.replyOptions?.commentaryProgressEnabled,
			reasoningPayloadsEnabled,
			commentaryPayloadsEnabled,
			onCommandOutput: wrapProgressCallback(params.replyOptions?.onCommandOutput, {
				forwardWhenSourceDeliverySuppressed: true,
				requiresToolSummaryVisibility: true,
				waitForDirectBlockReplyDelivery: true
			}),
			onCompactionStart: wrapProgressCallback(params.replyOptions?.onCompactionStart, {
				allowWhenToolSummariesHidden: params.replyOptions?.allowToolLifecycleWhenProgressHidden === true,
				forwardWhenSourceDeliverySuppressed: true,
				requiresToolSummaryVisibility: true,
				waitForDirectBlockReplyDelivery: true
			}),
			onCompactionEnd: wrapProgressCallback(params.replyOptions?.onCompactionEnd, {
				allowWhenToolSummariesHidden: params.replyOptions?.allowToolLifecycleWhenProgressHidden === true,
				forwardWhenSourceDeliverySuppressed: true,
				requiresToolSummaryVisibility: true,
				waitForDirectBlockReplyDelivery: true
			}),
			onToolResult: (payload) => {
				if (state.replyOperationRunState.heartbeat) return Promise.resolve();
				state.getDispatchReplyOperation()?.recordActivity();
				markProgress();
				const run = async () => {
					if (isDispatchOperationAborted()) return;
					await waitForPendingDirectBlockReplyDelivery(getDispatchAbortOperation()?.abortSignal);
					if (isDispatchOperationAborted()) return;
					markInboundDedupeReplayUnsafe();
					await flushPendingCommentaryProgress();
					const isFastModeAutoProgress = isFastModeAutoProgressPayload(payload);
					const isForcedToolProgress = state.shouldDeliverForcedToolProgressDespiteSourceSuppression();
					const forceToolResultProgress = params.replyOptions?.forceToolResultProgress === true;
					const allowProgressCallbacksWhenSourceDeliverySuppressed = params.replyOptions?.allowProgressCallbacksWhenSourceDeliverySuppressed === true && ctx.InboundEventKind !== "room_event";
					const durableToolResult = requiresDurableToolResultDelivery(payload);
					const requiresDurableToolResult = forceToolResultProgress && durableToolResult;
					const shouldDeliverFastModeAutoProgress = isFastModeAutoProgress && (!state.suppressAutomaticSourceDelivery && (forceToolResultProgress || state.shouldSendToolSummaries()) || isForcedToolProgress || state.shouldDeliverVerboseProgressDespiteSourceSuppression());
					if (params.replyOptions?.suppressToolProgressMessages && !durableToolResult) return;
					const toolResultProgressCallback = (forceToolResultProgress ? !requiresDurableToolResult && (isFastModeAutoProgress || !state.shouldEmitVerboseProgress()) && shouldForwardProgressCallback({ forwardWhenSourceDeliverySuppressed: allowProgressCallbacksWhenSourceDeliverySuppressed }) : (state.shouldSendToolSummaries() || isFastModeAutoProgress && params.replyOptions?.allowToolLifecycleWhenProgressHidden === true) && shouldForwardProgressCallback(isFastModeAutoProgress ? { forwardWhenSourceDeliverySuppressed: allowProgressCallbacksWhenSourceDeliverySuppressed } : void 0)) ? onToolResultFromReplyOptions : void 0;
					let toolResultProgressVisible = false;
					if (toolResultProgressCallback) toolResultProgressVisible = (await settleProgressVisibilityCallbackResult(toolResultProgressCallback(payload))).visible;
					if (isDispatchOperationAborted()) return;
					if (toolResultProgressCallback && forceToolResultProgress && !isFastModeAutoProgress) return;
					if (toolResultProgressCallback && isFastModeAutoProgress) {
						if (toolResultProgressVisible || !shouldDeliverFastModeAutoProgress) return;
					}
					if (state.sendPolicyDenied) return;
					const bypassToolSummarySuppression = isForcedToolProgress || shouldDeliverFastModeAutoProgress;
					if (state.shouldSuppressProgressDelivery() && !bypassToolSummarySuppression && !hasAskUserPayload(payload)) return;
					const visibleToolPayload = prepareReplyPayloadForSideEffects(dispatcher, "tool", bypassToolSummarySuppression ? payload : resolveToolDeliveryPayload(payload), state.progressState);
					if (!visibleToolPayload) return;
					const ttsPayload = await maybeApplyTtsWithFinalizationLease({
						payload: visibleToolPayload,
						cfg,
						channel: deliveryChannel,
						kind: "tool",
						ttsAuto: sessionTtsAuto,
						agentId: sessionAgentId,
						accountId: replyRoute.accountId
					});
					const normalizedPayload = await normalizeReplyMediaPayload(ttsPayload);
					const deliveryPayload = bypassToolSummarySuppression ? normalizedPayload : resolveToolDeliveryPayload(normalizedPayload);
					if (!deliveryPayload) return;
					if (isDispatchOperationAborted()) return;
					if (state.shouldSuppressLateTextOnlyToolProgress(deliveryPayload) && !bypassToolSummarySuppression) return;
					if (state.shouldSuppressMessageToolOnlyTextErrorProgress(deliveryPayload)) return;
					if (shouldSuppressDefaultToolProgressMessages() && !bypassToolSummarySuppression) {
						if (!requiresDurableToolResultDelivery(deliveryPayload)) return;
					}
					const askUserQuestionId = readAskUserQuestionId(deliveryPayload);
					if (askUserQuestionId !== void 0 && !await isAskUserPromptPending(askUserQuestionId)) return;
					if (isDispatchOperationAborted()) return;
					if (shouldRouteToOriginating) await sendPayloadAsync(deliveryPayload, void 0, false);
					else {
						const delivery = state.turnLedger.sendQueued("tool", deliveryPayload);
						if (hasAskUserPayload(deliveryPayload)) await requireQueuedReplyDelivery({
							delivery,
							dispatcher,
							abortSignal: getDispatchAbortOperation()?.abortSignal
						});
					}
				};
				return run();
			},
			onPlanUpdate: async (payload) => {
				if (isDispatchOperationAborted()) return;
				const steps = normalizeAgentPlanSteps(payload.steps);
				const normalized = {
					phase: payload.phase,
					title: payload.title,
					explanation: payload.explanation,
					...payload.explanationFormat ? { explanationFormat: payload.explanationFormat } : {},
					steps,
					source: payload.source
				};
				markProgress();
				await waitForPendingDirectBlockReplyDelivery(getDispatchAbortOperation()?.abortSignal);
				if (isDispatchOperationAborted()) return;
				markInboundDedupeReplayUnsafe();
				if (shouldForwardProgressCallback({
					forwardWhenSourceDeliverySuppressed: true,
					requiresToolSummaryVisibility: true
				})) await state.onPlanUpdateFromReplyOptions?.(normalized);
				if (isDispatchOperationAborted()) return;
				if (payload.phase !== "update" || shouldSuppressDefaultToolProgressMessages()) return;
				await state.sendPlanUpdate({
					explanation: normalized.explanation,
					explanationFormat: normalized.explanationFormat,
					steps
				});
			},
			onApprovalEvent: (payload) => forwardToolProgress(() => state.onApprovalEventFromReplyOptions?.(payload)),
			onPatchSummary: (payload) => forwardToolProgress(() => state.onPatchSummaryFromReplyOptions?.(payload)),
			onBlockReply,
			onPreparedBlockReply
		}, state.preparedReplyDispatchRuntime && !params.configOverride ? void 0 : replyConfig);
		for (const reply of Array.isArray(result) ? result : result ? [result] : []) {
			const continuation = getReplyPayloadMetadata(reply)?.progressContinuation;
			if (continuation) {
				if (isDispatchOperationAborted()) continuation.close();
				else registerReplyDispatcherSettledTask(dispatcher, continuation.close);
			}
		}
		return result;
	}), trackDispatchLifecycleWork).then(async (result) => {
		await flushBlockTtsText();
		return result;
	}, async (error) => {
		await flushBlockTtsText();
		throw error;
	})).catch(async (error) => {
		await releasePendingContinuation();
		await flushDeferredFinalText();
		const failedAgentRun = getAgentRunTerminalOutcome() === "failed";
		const adopted = state.turnAdoptionState?.adopted === true;
		if (params.replyOptions?.isHeartbeat === true || !failedAgentRun && !didDeliverVisiblePartialReply && !adopted || isDispatchOperationAborted()) throw error;
		failDispatchReplyOperation(error, "failed");
		if (!didDeliverVisiblePartialReply) return adopted && state.replyOperationRunState.replyCompletion?.expectation === "required" && state.replyOperationRunState.replyCompletion.outcome !== "blocked" && !state.suppressDelivery && !state.getObservedReplyDelivery() ? {
			text: GENERIC_EXTERNAL_RUN_FAILURE_TEXT,
			isError: true
		} : void 0;
		return buildTerminalAgentRunFailureReplyPayload({
			replyExpectation: state.replyOperationRunState.replyCompletion?.expectation ?? "required",
			visibleReplyDelivered: true
		});
	});
	try {
		if (isDispatchOperationAborted()) await flushDeferredFinalText();
		notifySessionMetadataChanges(takeCommandSessionMetadataChanges(ctx));
		const finalDispatchAcquisition = isCommandReplyForDelivery(replyResult) ? { status: "ready" } : await state.ensureDispatchReplyOperation("dispatch");
		if (finalDispatchAcquisition.status === "aborted") return {
			status: "complete",
			result: state.finishReplyOperationAbortedDispatch()
		};
		if (finalDispatchAcquisition.status === "busy") return {
			status: "complete",
			result: state.finishReplyOperationBusyDispatch({
				recordAgentDispatchCompleted: true,
				...state.routeState.sessionMetadataChangesForResult ? { sessionMetadataChanges: state.routeState.sessionMetadataChangesForResult } : {}
			})
		};
		const acpTailResult = await handleAcpDispatchTailAfterReset(state);
		if (acpTailResult) return acpTailResult;
		const nextState = extendPreparedDispatchState(state, {
			pendingContinuation,
			pendingContinuationSettlement,
			replyResult
		});
		pendingContinuationSettlement = void 0;
		return {
			status: "ready",
			state: nextState
		};
	} finally {
		await releasePendingContinuation();
	}
}
//#endregion
//#region src/auto-reply/reply/dispatch-from-config.lifecycle.ts
async function restoreArchivedDispatchSession(params) {
	const { ctx, entry, hasPluginOwnedBinding, sessionKey, storePath } = params;
	if (!entry || !sessionKey || !storePath || entry.archivedAt === void 0 || isRestartRecoveryTombstone(entry) || hasPluginOwnedBinding || ctx.InboundAccessAuthorized !== true || ctx.InboundEventKind === "room_event" || isNativeCommandTurn(ctx.CommandTurn) || classifySessionStateActor({ inputProvenance: ctx.InputProvenance }).actorType !== "human") return entry;
	let placementContext = params.placementContext;
	if (!placementContext) try {
		placementContext = (await import("./session-worker-placement-context-CsLfAlGf.mjs")).resolveSessionWorkerPlacementContext();
	} catch {
		return entry;
	}
	const snapshotSessionId = entry.sessionId;
	const snapshotArchivedAt = entry.archivedAt;
	const canRestore = (currentEntry) => {
		if (currentEntry.sessionId !== snapshotSessionId || currentEntry.archivedAt !== snapshotArchivedAt || isRestartRecoveryTombstone(currentEntry)) return false;
		try {
			const placement = currentEntry.sessionId ? placementContext.workerSessionPlacementService?.getMany([currentEntry.sessionId]).get(currentEntry.sessionId) : void 0;
			return !resolveWorkerPlacementArchiveRestoreError({
				context: placementContext,
				key: sessionKey,
				placement
			});
		} catch {
			return false;
		}
	};
	return await runExclusiveSessionLifecycleMutation({
		scope: storePath,
		identities: [sessionKey, snapshotSessionId],
		run: async () => {
			const scope = {
				sessionKey,
				storePath
			};
			const currentEntry = loadSessionStoreEntry(scope);
			if (!currentEntry || !canRestore(currentEntry)) return currentEntry;
			let assertCommitAllowed;
			if (currentEntry.worktree) {
				const { synchronizeSessionWorktreeArchive } = await import("./session-worktree-lifecycle-CkFyFquZ.mjs");
				assertCommitAllowed = await synchronizeSessionWorktreeArchive({
					archived: false,
					entry: currentEntry,
					scope,
					commitGuard: prepareSessionWorkerPlacementMutationCheck({
						context: placementContext,
						sessionId: currentEntry.sessionId
					})
				});
			}
			return await patchSessionEntryCore(scope, (current) => canRestore(current) ? {
				archivedAt: void 0,
				archivedBy: void 0,
				archiveReason: void 0
			} : null, { assertCommitAllowed }) ?? void 0;
		}
	});
}
function createDispatchReplyOperationCoordinator(params) {
	let dispatchReplyOperation;
	let admittedExpectedSessionId;
	let dispatchAbortOperation;
	let preDispatchAbortOperation;
	let preDispatchLifecycleAdmission;
	let preDispatchLifecycleAbortController;
	let dispatchLifecycleAbortController;
	let preDispatchLifecycleInterrupted = false;
	let dispatchResetTriggered = false;
	let allowRestartTombstoneParentFork = false;
	let allowRestartTombstoneReset = false;
	const dispatchLifecycleWork = {
		owner: /* @__PURE__ */ new Set(),
		delivery: /* @__PURE__ */ new Set()
	};
	const trackDispatchLifecycleWork = (work, phase = "owner") => {
		if (!dispatchReplyOperation && !preDispatchLifecycleAdmission) return;
		const pending = dispatchLifecycleWork[phase];
		const settled = work.then(() => {}, () => {});
		pending.add(settled);
		settled.then(() => {
			pending.delete(settled);
		});
	};
	const waitForDispatchDelivery = async () => {
		await Promise.allSettled(Array.from(dispatchLifecycleWork.delivery));
		await waitForReplyDispatcherIdle(params.dispatcher);
	};
	const releasePreDispatchLifecycleAdmission = async (afterWorkBarrier) => {
		const admission = preDispatchLifecycleAdmission;
		const preDispatchAbortController = preDispatchLifecycleAbortController;
		const dispatchAbortController = dispatchLifecycleAbortController;
		preDispatchLifecycleAdmission = void 0;
		if (!admission) return;
		const pendingWork = [...dispatchLifecycleWork.owner, ...dispatchLifecycleWork.delivery];
		const clearAbortControllers = () => {
			if (preDispatchLifecycleAbortController === preDispatchAbortController) preDispatchLifecycleAbortController = void 0;
			if (dispatchLifecycleAbortController === dispatchAbortController) dispatchLifecycleAbortController = void 0;
		};
		if (!afterWorkBarrier && pendingWork.length === 0) {
			clearAbortControllers();
			admission.release();
			return;
		}
		try {
			await Promise.allSettled(pendingWork);
			if (afterWorkBarrier) await waitForReplyBarrierSettlement(afterWorkBarrier(), params.dispatcher.resolveFollowupAdmissionBarrierTimeoutPolicy?.());
		} finally {
			clearAbortControllers();
			admission.release();
		}
	};
	const runWithDispatchLifecycleAdmission = async (run) => {
		if (dispatchReplyOperation) return await runWithReplyOperationLifecycleAdmission(dispatchReplyOperation, run);
		return preDispatchLifecycleAdmission ? await preDispatchLifecycleAdmission.run(run) : await run();
	};
	const ensureDispatchReplyOperation = async (phase, hasPluginOwnedBinding = false) => {
		if (phase === "pre_dispatch") {
			params.operationSessionStoreEntry.entry = await restoreArchivedDispatchSession({
				ctx: params.ctx,
				entry: params.operationSessionStoreEntry.entry,
				hasPluginOwnedBinding,
				placementContext: params.sessionWorkerPlacementContext,
				sessionKey: params.dispatchOperationSessionKey,
				storePath: params.operationSessionStoreEntry.storePath
			});
			({resetTriggered: dispatchResetTriggered, allowRestartTombstoneParentFork, allowRestartTombstoneReset} = resolveDispatchResetAdmission({
				agentId: params.agentId,
				cfg: params.cfg,
				ctx: params.ctx,
				entry: params.operationSessionStoreEntry.entry,
				hasPluginOwnedBinding,
				sessionKey: params.dispatchOperationSessionKey,
				storePath: params.operationSessionStoreEntry.storePath
			}));
		}
		if (phase !== "pre_dispatch") {
			await releasePreDispatchLifecycleAdmission(() => waitForReplyDispatcherIdle(params.dispatcher));
			if (preDispatchLifecycleInterrupted) return { status: dispatchReplyOperation ? "aborted" : "busy" };
		}
		if (dispatchReplyOperation) return { status: "ready" };
		if (dispatchAbortOperation && !dispatchAbortOperation.result) return dispatchReplyOperation ? { status: "ready" } : { status: "busy" };
		if (phase !== "pre_dispatch" && preDispatchAbortOperation?.result && preDispatchAbortOperation.result.kind !== "completed" && !dispatchReplyOperation && params.allowActiveQueueResolution !== true) {
			dispatchAbortOperation = preDispatchAbortOperation;
			return { status: "busy" };
		}
		const dispatchOperationSessionKey = params.dispatchOperationSessionKey;
		if (!dispatchOperationSessionKey) return { status: "ready" };
		const operationSessionId = dispatchAbortOperation?.sessionId ?? params.operationSessionStoreEntry.entry?.sessionId ?? crypto.randomUUID();
		const replyTurnKind = resolveReplyTurnKind(params.replyOptions);
		const activeReplyOperation = replyRunRegistry.get(dispatchOperationSessionKey);
		const activeEmbeddedSessionId = resolveActiveEmbeddedRunSessionId(dispatchOperationSessionKey);
		if (replyTurnKind === "visible" && (params.replyOptions?.turnAdoptionLifecycle !== void 0 || params.allowActiveQueueResolution === true) && activeReplyOperation === void 0 && activeEmbeddedSessionId === operationSessionId) return { status: "ready" };
		const allowActiveResolution = replyTurnKind === "visible" && (phase === "pre_dispatch" || phase === "command_resolution");
		if (phase !== "pre_dispatch" && replyTurnKind === "visible" && (params.replyOptions?.turnAdoptionLifecycle !== void 0 || params.allowActiveQueueResolution === true) && activeReplyOperation !== void 0 && activeReplyOperation.turnKind !== "heartbeat") return { status: "ready" };
		const allowSlackRoutedThreadBypass = phase !== "pre_dispatch" && shouldLetSlackRoutedThreadBypassBusyReplyOperation({
			activeOperation: replyRunRegistry.get(dispatchOperationSessionKey),
			ctx: params.ctx,
			routeThreadId: params.routeThreadId
		});
		const lifecycleOnlyAbortController = allowActiveResolution || allowSlackRoutedThreadBypass ? new AbortController() : void 0;
		const onLifecycleInterrupt = () => {
			preDispatchLifecycleInterrupted = true;
			lifecycleOnlyAbortController?.abort();
		};
		const admitCurrentReplyTurn = async () => {
			try {
				return await admitReplyTurn({
					providerReviewAcknowledgment: params.replyOptions?.providerReviewAcknowledgment,
					agentId: params.agentId,
					sessionKey: dispatchOperationSessionKey,
					resolveGatewayContext: readChannelContextGatewayContextResolver(params.ctx) ?? getPluginRuntimeGatewayRequestScope()?.resolveGatewayContext,
					sessionId: operationSessionId,
					expectedSessionId: params.replyOptions?.expectedExistingSessionId ?? params.resolveOperationExpectedSessionId(),
					expectedActiveOperations: [params.replyOptions?.expectedActiveReplyOperation, params.initialDispatchReplyOperation].filter((operation) => operation !== void 0),
					storePath: params.operationSessionStoreEntry.storePath,
					kind: replyTurnKind,
					resetTriggered: dispatchResetTriggered,
					allowRestartTombstoneParentFork,
					allowRestartTombstoneReset,
					routeThreadId: params.routeThreadId,
					originatingLeafEntryId: params.replyOptions?.turnAdoptionLifecycle?.originatingLeafEntryId,
					upstreamAbortSignal: params.replyOptions?.abortSignal,
					waitForActive: !allowActiveResolution && !allowSlackRoutedThreadBypass,
					retainLifecycleAdmissionOnActive: allowActiveResolution || allowSlackRoutedThreadBypass,
					onLifecycleInterrupt
				});
			} catch (error) {
				if (phase === "pre_dispatch" && replyTurnKind === "visible" && isSessionWorkStartInvalidatedError(error)) throw new DispatchSessionRefreshRequiredError(error);
				throw error;
			}
		};
		let admission = await admitCurrentReplyTurn();
		if (admission.status === "skipped" && admission.reason === "active-run" && replyTurnKind === "visible" && isRecoverableTerminalSessionStatus(params.operationSessionStoreEntry.entry?.status) && admission.activeOperation?.sessionId === params.operationSessionStoreEntry.entry?.sessionId && !admission.activeOperation?.terminalRecovery) {
			if (forceClearReplyRunBySessionId(admission.activeOperation?.sessionId ?? operationSessionId, /* @__PURE__ */ new Error("clearing stale terminal reply operation"))) {
				admission.lifecycleAdmission?.release();
				logVerbose(`dispatch-from-config: cleared stale active reply operation for terminal session ${dispatchOperationSessionKey}`);
				admission = await admitCurrentReplyTurn();
			}
		}
		admittedExpectedSessionId = admission.status === "owned" ? admission.operation.sessionId : admission.sessionEntry?.sessionId;
		const runState = resolveReplyOperationRunState(params.replyOptions);
		if (runState) runState.admission = admission.status === "owned" ? { status: "owned" } : {
			status: "skipped",
			reason: admission.reason
		};
		if (admission.status === "skipped") {
			if (allowActiveResolution && admission.reason === "active-run") {
				preDispatchAbortOperation = admission.activeOperation;
				preDispatchLifecycleAdmission = admission.lifecycleAdmission;
				if (phase === "pre_dispatch") preDispatchLifecycleAbortController = lifecycleOnlyAbortController;
				else dispatchLifecycleAbortController = lifecycleOnlyAbortController;
				return { status: "ready" };
			}
			if (admission.reason === "active-run" && shouldLetSlackRoutedThreadBypassBusyReplyOperation({
				activeOperation: admission.activeOperation,
				ctx: params.ctx,
				routeThreadId: params.routeThreadId
			})) {
				preDispatchLifecycleAdmission = admission.lifecycleAdmission;
				dispatchLifecycleAbortController = lifecycleOnlyAbortController;
				logVerbose(`dispatch-from-config: allowing Slack routed thread ${params.routeThreadId} while ${dispatchOperationSessionKey} has an active reply operation in another Slack thread`);
				return { status: "ready" };
			}
			admission.lifecycleAdmission?.release();
			dispatchAbortOperation = admission.activeOperation;
			logVerbose(`dispatch-from-config: skipped reply operation admission for ${dispatchOperationSessionKey}; reason=${admission.reason}`);
			return { status: "busy" };
		}
		if (replyTurnKind === "visible" && isRecoverableTerminalSessionStatus(params.operationSessionStoreEntry.entry?.status) && operationSessionId === params.operationSessionStoreEntry.entry?.sessionId) admission.operation.markTerminalRecovery();
		dispatchReplyOperation = admission.operation;
		dispatchReplyOperation.retainFailureUntilComplete();
		dispatchAbortOperation = admission.operation;
		return { status: "ready" };
	};
	const getPreDispatchAbortOperation = () => dispatchAbortOperation ?? preDispatchAbortOperation;
	let cachedPreDispatchAbortSignal;
	let cachedDispatchAbortSignal;
	const getPreDispatchAbortSignal = () => {
		const operationSignal = getPreDispatchAbortOperation()?.abortSignal;
		const lifecycleSignal = preDispatchLifecycleAbortController?.signal;
		const upstreamSignal = params.replyOptions?.abortSignal;
		if (cachedPreDispatchAbortSignal && cachedPreDispatchAbortSignal.operationSignal === operationSignal && cachedPreDispatchAbortSignal.lifecycleSignal === lifecycleSignal && cachedPreDispatchAbortSignal.upstreamSignal === upstreamSignal) return cachedPreDispatchAbortSignal.signal;
		const abortSignals = [
			operationSignal,
			lifecycleSignal,
			upstreamSignal
		].filter((signal) => Boolean(signal));
		const signal = abortSignals.length > 1 ? AbortSignal.any(abortSignals) : abortSignals[0];
		cachedPreDispatchAbortSignal = {
			operationSignal,
			lifecycleSignal,
			upstreamSignal,
			signal
		};
		return signal;
	};
	const getDispatchAbortSignal = () => {
		const operationSignal = dispatchReplyOperation?.abortSignal ?? dispatchLifecycleAbortController?.signal;
		const upstreamSignal = operationSignal ? void 0 : params.replyOptions?.abortSignal;
		if (cachedDispatchAbortSignal && cachedDispatchAbortSignal.operationSignal === operationSignal && cachedDispatchAbortSignal.upstreamSignal === upstreamSignal) return cachedDispatchAbortSignal.signal;
		const signal = operationSignal ?? upstreamSignal;
		cachedDispatchAbortSignal = {
			operationSignal,
			upstreamSignal,
			signal
		};
		return signal;
	};
	const getQueuedFollowupAbortSignal = () => params.replyOptions?.turnAdoptionLifecycle?.abortSignal ?? dispatchReplyOperation?.abortSignal ?? params.replyOptions?.abortSignal;
	let observedReplyDelivery = false;
	let agentRunTerminalOutcome;
	let agentRunId = params.replyOptions?.runId;
	const markObservedReplyDelivery = async () => {
		if (observedReplyDelivery) return;
		observedReplyDelivery = true;
		await params.replyOptions?.onObservedReplyDelivery?.();
	};
	const getReplyOptions = () => {
		const abortSignal = getDispatchAbortSignal();
		const expectedExistingSessionId = params.replyOptions?.expectedExistingSessionId ? dispatchReplyOperation?.sessionId ?? admittedExpectedSessionId : void 0;
		const onAgentRunStart = (...args) => {
			agentRunTerminalOutcome = "completed";
			agentRunId = args[0];
			params.messageAuditTerminal?.observeRunId(args[0]);
			return params.replyOptions?.onAgentRunStart?.(...args);
		};
		const onAgentRunTerminalOutcome = (outcome) => {
			if (outcome === "failed" || agentRunTerminalOutcome === void 0) agentRunTerminalOutcome = outcome;
			params.replyOptions?.onAgentRunTerminalOutcome?.(outcome);
		};
		return {
			...params.replyOptions,
			...expectedExistingSessionId ? { expectedExistingSessionId } : {},
			...abortSignal ? {
				abortSignal,
				queuedFollowupAbortSignal: getQueuedFollowupAbortSignal()
			} : {},
			onAgentRunStart,
			onAgentRunTerminalOutcome,
			...dispatchReplyOperation ? { replyOperation: dispatchReplyOperation } : {}
		};
	};
	const completeDispatchReplyOperation = () => {
		releasePreDispatchLifecycleAdmission(() => waitForReplyDispatcherIdle(params.dispatcher));
		const operation = dispatchReplyOperation;
		if (!operation) return;
		const timeoutPolicy = params.dispatcher.resolveFollowupAdmissionBarrierTimeoutPolicy?.();
		const complete = () => operation.completeWithAfterClearBarrier(waitForDispatchDelivery(), timeoutPolicy);
		if (dispatchLifecycleWork.owner.size > 0) Promise.allSettled(Array.from(dispatchLifecycleWork.owner)).then(complete);
		else complete();
	};
	const failDispatchReplyOperation = (error, terminalOutcome) => {
		if (terminalOutcome === "failed") agentRunTerminalOutcome = "failed";
		dispatchReplyOperation?.freezeAbort();
		if (dispatchReplyOperation && !dispatchReplyOperation.result) dispatchReplyOperation.fail("run_failed", error);
		completeDispatchReplyOperation();
	};
	const isDispatchOperationAborted = () => getDispatchAbortSignal()?.aborted === true;
	const isPreDispatchOperationAborted = () => getPreDispatchAbortSignal()?.aborted === true;
	const throwIfDispatchOperationAborted = () => {
		if (isDispatchOperationAborted()) throw new DispatchReplyOperationAbortedError();
	};
	const turnLedger = createReplyTurnLedger(params.dispatcher);
	return {
		completeDispatchReplyOperation,
		dispatchHookDispatcher: createAbortAwareDispatcher({
			dispatcher: {
				...params.dispatcher,
				sendToolResult: (payload) => turnLedger.sendQueued("tool", payload).queued,
				sendBlockReply: (payload) => turnLedger.sendQueued("block", payload).queued,
				sendFinalReply: (payload) => turnLedger.sendQueued("final", payload).queued,
				...params.dispatcher.sendPreparedReply ? { sendPreparedReply: (kind, plan) => turnLedger.sendPreparedQueued(kind, plan).queued } : {}
			},
			isAborted: isPreDispatchOperationAborted
		}),
		turnLedger,
		ensureDispatchReplyOperation,
		failDispatchReplyOperation,
		getAgentRunId: () => agentRunId,
		getAgentRunTerminalOutcome: () => agentRunTerminalOutcome,
		getDispatchAbortOperation: () => dispatchAbortOperation,
		getDispatchAbortSignal,
		getDispatchReplyOperation: () => dispatchReplyOperation,
		getReplyOptions,
		getObservedReplyDelivery: () => observedReplyDelivery,
		getPreDispatchAbortSignal,
		isDispatchOperationAborted,
		isPreDispatchOperationAborted,
		markObservedReplyDelivery,
		releasePreDispatchLifecycleAdmission,
		runWithDispatchLifecycleAdmission,
		throwIfDispatchOperationAborted,
		trackDispatchLifecycleWork
	};
}
//#endregion
//#region src/auto-reply/reply/dispatch-from-config.timing.ts
const replyHotPathTimingLog = createSubsystemLogger("auto-reply/reply-timing");
function createReplyHotPathTimingTracker(options = {}) {
	const timing = createReplyTimingTracker({
		log: replyHotPathTimingLog,
		enabled: options.profilerEnabled === true,
		formatMessage: (params, summary, stages) => `reply hot path timings channel=${params.channel} messageId=${params.messageId ?? "unknown"} sessionKey=${params.sessionKey ?? "unknown"} outcome=${params.outcome} totalMs=${summary.totalMs} stages=${stages}${params.reason ? ` reason=${params.reason}` : ""}`,
		detailKeys: () => [
			"channel",
			"messageId",
			"sessionKey",
			"outcome",
			"reason"
		]
	});
	return {
		measure: timing.measure,
		logIfSlow(params) {
			if (!options.profilerEnabled) return;
			timing.logIfSlow(params);
		},
		logPreparationIfSlow(params) {
			const { channel, messageId, sessionKey } = params;
			timing.logIfSlow({
				channel,
				messageId,
				sessionKey,
				outcome: "milestone",
				reason: "before_reply_resolver"
			}, { repeat: true });
		}
	};
}
//#endregion
//#region src/auto-reply/reply/dispatch-from-config.gather.ts
async function gatherDispatchRequest(params, messageAuditTerminal, allowActiveQueueResolution = false) {
	const ctx = isFinalizedInboundContext(params.ctx) ? params.ctx : finalizeInboundContext(params.ctx);
	const turnAdoptionLifecycle = params.replyOptions?.turnAdoptionLifecycle;
	prepareChannelParticipantObservation(ctx);
	const turnAdoptionState = { adopted: false };
	const normalizedParams = {
		...params,
		ctx,
		replyOptions: {
			...params.replyOptions,
			...turnAdoptionLifecycle ? { turnAdoptionLifecycle: {
				...turnAdoptionLifecycle,
				onAdopted: async () => {
					await turnAdoptionLifecycle.onAdopted();
					turnAdoptionState.adopted = true;
				}
			} } : {}
		}
	};
	const replyOperationRunState = resolveReplyOperationRunState(normalizedParams.replyOptions) ?? {};
	let replayUnsafeActivity = false;
	const state = {
		params: normalizedParams,
		messageAuditTerminal,
		allowInboundHandlers: replyOperationRunState.heartbeat === void 0,
		get inboundDedupeReplayUnsafe() {
			const admission = replyOperationRunState.admission;
			return replayUnsafeActivity || admission?.status === "accepted" && admission.mode === "steer" || admission?.status === "skipped" && admission.reason === "question-response-indeterminate";
		},
		turnAdoptionState: turnAdoptionLifecycle ? turnAdoptionState : void 0
	};
	const { cfg, dispatcher } = normalizedParams;
	bindReplyDispatcherConversationContext(dispatcher, ctx.agentText);
	const targetAgentId = resolveSessionAgentId({
		sessionKey: resolveCommandTurnTargetSessionKey(ctx) ?? ctx.SessionKey,
		config: cfg,
		fallbackAgentId: ctx.AgentId
	});
	const refusal = readAgentDatabaseAdmissionRefusal(targetAgentId);
	if (refusal) {
		const aborted = params.replyOptions?.abortSignal?.aborted === true;
		const queuedFinal = !aborted && dispatcher.sendFinalReply({
			text: `${refusal.reason}\n${refusal.repairHint}`,
			isError: true
		});
		const outcome = aborted ? "skipped" : "error";
		const reason = aborted ? "reply_operation_aborted" : refusal.code;
		noteDispatchProcessedOutcome({
			outcome,
			reason
		});
		messageAuditTerminal?.note(outcome, { reason });
		return {
			status: "complete",
			result: {
				queuedFinal,
				counts: dispatcher.getQueuedCounts()
			}
		};
	}
	const diagnosticsEnabled = isDiagnosticsEnabled(cfg);
	const channel = normalizeLowercaseStringOrEmpty(ctx.Surface ?? ctx.Provider ?? "unknown");
	const chatId = ctx.To ?? ctx.From;
	const messageId = ctx.MessageSidFull ?? ctx.MessageSid ?? ctx.MessageSidFirst ?? ctx.MessageSidLast;
	const sessionKey = normalizeOptionalString(ctx.SessionKey) ?? normalizeOptionalString(ctx.CommandTargetSessionKey);
	const startTime = diagnosticsEnabled ? Date.now() : 0;
	const canTrackSession = diagnosticsEnabled && Boolean(sessionKey);
	const initialSessionStoreEntry = resolveSessionStoreLookup(ctx, cfg);
	const lifecycleSessionId = initialSessionStoreEntry.sessionKey === sessionKey ? initialSessionStoreEntry.entry?.sessionId : void 0;
	const messageLifecycle = createDiagnosticMessageLifecycle({
		enabled: diagnosticsEnabled,
		channel,
		chatId,
		messageId,
		sessionKey,
		sessionId: lifecycleSessionId,
		source: "dispatch",
		processingReason: "message_start",
		startedAtMs: startTime,
		trackSessionState: canTrackSession
	});
	const traceAttributes = {
		surface: channel,
		hasSessionKey: Boolean(sessionKey),
		hasRunId: typeof params.replyOptions?.runId === "string"
	};
	const replyHotPathTiming = createReplyHotPathTimingTracker({ profilerEnabled: isReplyProfilerEnabled({ config: cfg }) });
	const traceReplyPhase = (name, run) => replyHotPathTiming.measure(name, () => measureDiagnosticsTimelineSpan(name, run, {
		phase: "agent-turn",
		config: cfg,
		attributes: traceAttributes
	}));
	let agentDispatchStartedAt = 0;
	const recordProcessed = (outcome, opts) => {
		noteDispatchProcessedOutcome({
			outcome,
			...opts?.reason !== void 0 ? { reason: opts.reason } : {}
		});
		messageAuditTerminal?.note(outcome, opts);
		if (diagnosticsEnabled) replyHotPathTiming.logIfSlow({
			channel,
			messageId,
			sessionKey,
			outcome,
			reason: opts?.reason
		});
		messageLifecycle.markProcessed(outcome, opts);
	};
	const finishReplyOperationAborted = () => {
		recordProcessed("skipped", { reason: "reply_operation_aborted" });
		return {
			status: "complete",
			result: {
				queuedFinal: false,
				counts: dispatcher.getQueuedCounts()
			}
		};
	};
	if (params.replyOptions?.abortSignal?.aborted) return finishReplyOperationAborted();
	const recordAgentDispatchStarted = () => {
		if (!diagnosticsEnabled || agentDispatchStartedAt > 0) return;
		agentDispatchStartedAt = Date.now();
		replyHotPathTiming.logPreparationIfSlow({
			channel,
			messageId,
			sessionKey
		});
		logMessageDispatchStarted({
			channel,
			sessionKey: acpDispatchSessionKey,
			source: "replyResolver"
		});
	};
	const recordAgentDispatchCompleted = (outcome, opts) => {
		if (!diagnosticsEnabled || agentDispatchStartedAt <= 0) return;
		logMessageDispatchCompleted({
			channel,
			sessionKey: acpDispatchSessionKey,
			source: "replyResolver",
			durationMs: Date.now() - agentDispatchStartedAt,
			outcome,
			reason: opts?.reason,
			error: opts?.error
		});
	};
	const markProcessing = () => {
		messageLifecycle.markProcessing();
	};
	const markIdle = (reason) => {
		messageLifecycle.markIdle(reason);
	};
	const markInboundDedupeReplayUnsafe = () => {
		replayUnsafeActivity = true;
	};
	const boundAcpDispatchSessionKey = state.allowInboundHandlers ? await resolveBoundAcpDispatchSessionKey({
		ctx,
		cfg
	}) : void 0;
	const acpDispatchSessionKey = boundAcpDispatchSessionKey ?? initialSessionStoreEntry.sessionKey ?? sessionKey;
	const sourceSessionKey = normalizeOptionalString(ctx.SessionKey);
	const dispatchOperationSessionKey = sourceSessionKey ?? initialSessionStoreEntry.sessionKey ?? sessionKey ?? acpDispatchSessionKey;
	const operationSessionStoreEntry = sourceSessionKey && initialSessionStoreEntry.sessionKey && sourceSessionKey !== initialSessionStoreEntry.sessionKey ? resolveSessionStoreLookup({
		...ctx,
		CommandTargetSessionKey: void 0
	}, cfg) : initialSessionStoreEntry;
	const initialDispatchReplyOperation = dispatchOperationSessionKey ? replyRunRegistry.get(dispatchOperationSessionKey) : void 0;
	if (params.replyOptions?.isHeartbeat === true && dispatchOperationSessionKey && initialDispatchReplyOperation) {
		noteDispatchProcessedOutcome({
			outcome: "skipped",
			reason: "reply-operation-active"
		});
		messageAuditTerminal?.note("skipped", { reason: "reply-operation-active" });
		return {
			status: "complete",
			result: {
				queuedFinal: false,
				counts: dispatcher.getQueuedCounts()
			}
		};
	}
	const markProgress = () => {
		if (!canTrackSession || !sessionKey) return;
		markDiagnosticSessionProgress({ sessionKey });
		if (acpDispatchSessionKey && acpDispatchSessionKey !== sessionKey) markDiagnosticSessionProgress({ sessionKey: acpDispatchSessionKey });
	};
	const sessionStoreEntry = boundAcpDispatchSessionKey ? resolveSessionStoreLookup({
		...ctx,
		SessionKey: boundAcpDispatchSessionKey
	}, cfg) : initialSessionStoreEntry;
	const dispatchKind = resolveSessionDispatchKind(acpDispatchSessionKey, sessionStoreEntry.entry);
	let preparedSessionBinding = sessionStoreEntry.sessionKey && sessionStoreEntry.entry?.sessionId ? {
		sessionKey: sessionStoreEntry.sessionKey,
		sessionId: sessionStoreEntry.entry.sessionId,
		storePath: sessionStoreEntry.storePath
	} : void 0;
	let preparedOperationSessionBinding = operationSessionStoreEntry.sessionKey && operationSessionStoreEntry.entry?.sessionId ? {
		sessionKey: operationSessionStoreEntry.sessionKey,
		sessionId: operationSessionStoreEntry.entry.sessionId,
		storePath: operationSessionStoreEntry.storePath
	} : void 0;
	const sessionKeysMatch = (left, right) => Boolean(left && right && normalizeExplicitSessionKey(left, ctx) === normalizeExplicitSessionKey(right, ctx));
	const notePreparedSession = (binding) => {
		if (sessionKeysMatch(binding.sessionKey, sessionStoreEntry.sessionKey)) preparedSessionBinding = binding;
		if (sessionKeysMatch(binding.sessionKey, operationSessionStoreEntry.sessionKey)) preparedOperationSessionBinding = binding;
		params.replyOptions?.onSessionPrepared?.(binding);
	};
	const resolveOperationExpectedSessionId = () => preparedOperationSessionBinding?.sessionId ?? operationSessionStoreEntry.entry?.sessionId;
	const resolvePreparedTranscriptBinding = (mirrorSessionKey) => {
		if (!preparedSessionBinding || !sessionKeysMatch(mirrorSessionKey, preparedSessionBinding.sessionKey)) return;
		return preparedSessionBinding;
	};
	const sessionAgentId = resolveSessionAgentId({
		sessionKey: acpDispatchSessionKey,
		config: cfg,
		fallbackAgentId: ctx.AgentId
	});
	const sessionAgentCfg = resolveAgentConfig(cfg, sessionAgentId);
	const verboseProgress = createShouldEmitVerboseProgress({
		agentId: sessionAgentId,
		sessionKey: acpDispatchSessionKey,
		storePath: sessionStoreEntry.storePath,
		initialExplicitLevel: sessionStoreEntry.entry?.verboseLevel,
		fallbackLevel: normalizeVerboseLevel(sessionStoreEntry.entry?.verboseLevel ?? sessionAgentCfg?.verboseDefault ?? cfg.agents?.defaults?.verboseDefault ?? "") ?? "off"
	});
	const shouldEmitVerboseProgress = verboseProgress.shouldEmit;
	const shouldEmitFullVerboseProgress = verboseProgress.shouldEmitFull;
	const replyRoute = resolveEffectiveReplyRoute({
		ctx,
		entry: sessionStoreEntry.entry
	});
	const routeThreadId = resolveRoutedDeliveryThreadId({
		ctx,
		sessionKey: acpDispatchSessionKey
	});
	const routeReplyThreadId = replyRoute.threadId ?? routeThreadId;
	const inboundAudio = hasInboundAudio(ctx);
	const sessionTtsAuto = normalizeTtsAutoMode(sessionStoreEntry.entry?.ttsAuto);
	const preparedReplyDispatchAgentId = boundAcpDispatchSessionKey ? resolveSessionAgentId({
		sessionKey,
		config: cfg,
		fallbackAgentId: ctx.AgentId
	}) : sessionAgentId;
	let preparedReplyDispatchRuntime;
	try {
		preparedReplyDispatchRuntime = await traceReplyPhase("reply.load_prepared_dispatch_runtime", async () => {
			const { loadPublishedGatewayReplyDispatchRuntime } = await loadPreparedModelRuntime();
			return await loadPublishedGatewayReplyDispatchRuntime({
				agentId: preparedReplyDispatchAgentId,
				abortSignal: params.replyOptions?.abortSignal
			});
		});
	} catch (error) {
		if (params.replyOptions?.abortSignal?.aborted && isAbortError(error)) return finishReplyOperationAborted();
		throw error;
	}
	const workspaceDir = preparedReplyDispatchRuntime?.workspaceDir ?? resolveAgentWorkspaceDir(cfg, sessionAgentId);
	const replyOperationCoordinator = createDispatchReplyOperationCoordinator({
		allowActiveQueueResolution,
		agentId: operationSessionStoreEntry.agentId ?? sessionAgentId,
		cfg,
		ctx,
		dispatcher,
		dispatchOperationSessionKey,
		initialDispatchReplyOperation,
		messageAuditTerminal,
		operationSessionStoreEntry,
		replyOptions: normalizedParams.replyOptions,
		resolveOperationExpectedSessionId,
		routeThreadId,
		sessionWorkerPlacementContext: normalizedParams.sessionWorkerPlacementContext
	});
	const { getDispatchReplyOperation, getPreDispatchAbortSignal } = replyOperationCoordinator;
	const maybeApplyTtsWithFinalizationLease = createFinalizationAwareTtsPayloadApplier({
		getReplyOperation: getDispatchReplyOperation,
		hasInboundAudio: () => inboundAudio || getDispatchReplyOperation()?.acceptedSteeredInboundAudio === true
	});
	const pluginRegistry = preparedReplyDispatchRuntime?.inboundPluginRegistry ?? await traceReplyPhase("reply.load_runtime_plugin_registry_handle", async () => {
		const { loadAgentRuntimePluginRegistryHandle } = await traceReplyPhase("reply.load_runtime_plugins", loadRuntimePlugins);
		return loadAgentRuntimePluginRegistryHandle({
			config: cfg,
			workspaceDir,
			allowGatewaySubagentBinding: true
		});
	});
	const hookRunner = getGlobalHookRunner();
	const timestamp = typeof ctx.Timestamp === "number" && Number.isFinite(ctx.Timestamp) ? ctx.Timestamp : void 0;
	const messageIdForHook = ctx.MessageSidFull ?? ctx.MessageSid ?? ctx.MessageSidFirst ?? ctx.MessageSidLast;
	const hookCtx = { ...ctx };
	const buildHookState = (sourceCtx) => {
		const nextHookContext = deriveInboundMessageHookContext(sourceCtx, { messageId: messageIdForHook });
		const inboundClaim = toPluginInboundClaimPair(nextHookContext, {
			commandAuthorized: typeof ctx.CommandAuthorized === "boolean" ? ctx.CommandAuthorized : void 0,
			wasMentioned: typeof ctx.WasMentioned === "boolean" ? ctx.WasMentioned : void 0
		});
		return {
			hookContext: nextHookContext,
			inboundClaimContext: inboundClaim.context,
			inboundClaimEvent: inboundClaim.event
		};
	};
	const hookState = buildHookState(hookCtx);
	const { isGroup, groupId } = hookState.hookContext;
	let hookMediaPrepared = false;
	let hookMediaMetadataStaged = false;
	const prepareHookMediaMetadata = async () => {
		if (hookMediaPrepared) return;
		hookMediaPrepared = true;
		if (await traceReplyPhase("reply.stage_remote_media_for_dispatch", () => stageRemoteInboundMediaIfNeeded({
			ctx: hookCtx,
			cfg,
			agentId: sessionAgentId,
			sessionKey: acpDispatchSessionKey,
			workspaceDir,
			remoteMediaMode: "cache",
			abortSignal: getPreDispatchAbortSignal()
		}))) {
			hookMediaMetadataStaged = true;
			Object.assign(hookState, buildHookState(hookCtx));
		}
	};
	const buildMessageReceivedHookContext = () => {
		const mediaRemoteHost = normalizeOptionalString(ctx.MediaRemoteHost);
		const { hookContext } = hookState;
		const hasUnstagedRemoteMediaMetadata = Boolean(hookContext.media?.length);
		if (hookMediaMetadataStaged || !mediaRemoteHost || !hasUnstagedRemoteMediaMetadata) return hookContext;
		const messageReceivedCtx = { ...hookCtx };
		stripLegacyMediaContextFields(messageReceivedCtx);
		delete messageReceivedCtx.media;
		return {
			...buildHookState(messageReceivedCtx).hookContext,
			mediaRemoteHost,
			mediaStagingPending: true,
			originalMedia: hookContext.media?.map((entry) => ({ ...entry })),
			originalMediaPath: hookContext.mediaPath,
			originalMediaUrl: hookContext.mediaUrl,
			originalMediaType: hookContext.mediaType,
			originalMediaPaths: hookContext.mediaPaths,
			originalMediaUrls: hookContext.mediaUrls,
			originalMediaTypes: hookContext.mediaTypes
		};
	};
	return {
		status: "ready",
		state: extendPreparedDispatchState(state, {
			ctx,
			cfg,
			dispatcher,
			sessionKey,
			traceReplyPhase,
			recordProcessed,
			recordAgentDispatchStarted,
			recordAgentDispatchCompleted,
			markProcessing,
			markIdle,
			markInboundDedupeReplayUnsafe,
			acpDispatchSessionKey,
			dispatchKind,
			markProgress,
			sessionStoreEntry,
			notePreparedSession,
			resolvePreparedTranscriptBinding,
			sessionAgentId,
			dispatchOperationSessionKey,
			operationSessionStoreEntry,
			noteRunVerbosity: verboseProgress.noteRunVerbosity,
			shouldEmitVerboseProgress,
			shouldEmitFullVerboseProgress,
			replyRoute,
			routeReplyThreadId,
			inboundAudio,
			sessionTtsAuto,
			workspaceDir,
			preparedReplyDispatchRuntime,
			pluginRegistry,
			replyOperationRunState,
			...replyOperationCoordinator,
			maybeApplyTtsWithFinalizationLease,
			hookRunner,
			timestamp,
			messageIdForHook,
			isGroup,
			groupId,
			hookState,
			prepareHookMediaMetadata,
			buildMessageReceivedHookContext
		})
	};
}
//#endregion
//#region src/auto-reply/reply/conversation-turn-capture.ts
const EPOCH_MILLISECONDS_THRESHOLD = 0xe8d4a51000;
const CONVERSATION_TURN_REPLY_CUSTOM_TYPE = "openclaw.conversation-turn-reply";
function readPersistedReplyText(message) {
	const content = message?.content;
	if (typeof content === "string") return normalizeOptionalString(content);
	if (!Array.isArray(content)) return;
	return normalizeOptionalString(content.flatMap((part) => {
		if (!part || typeof part !== "object") return [];
		const record = part;
		return record.type === "text" && typeof record.text === "string" ? [record.text] : [];
	}).join("\n"));
}
function normalizeTimestamp(value) {
	const timestamp = typeof value === "number" && Number.isFinite(value) ? value : void 0;
	if (timestamp === void 0 || timestamp <= 0) return;
	return asDateTimestampMs(timestamp < EPOCH_MILLISECONDS_THRESHOLD ? Math.trunc(timestamp * 1e3) : timestamp);
}
async function capturePendingConversationTurnReplyUnsafe(params) {
	if (params.ctx.InboundAccessAuthorized !== true) return false;
	const sessionKey = normalizeOptionalString(params.ctx.SessionKey);
	const messageId = normalizeOptionalString(params.ctx.MessageSidFull) ?? normalizeOptionalString(params.ctx.MessageSid) ?? normalizeOptionalString(params.ctx.MessageSidFirst) ?? normalizeOptionalString(params.ctx.MessageSidLast);
	const replyText = normalizeOptionalString(params.ctx.agentText);
	if (!sessionKey || !messageId || !replyText) return false;
	const conversation = conversationIdentityFromMsgContext({ ctx: params.ctx });
	if (!conversation) return false;
	const replyToId = normalizeOptionalString(params.ctx.ReplyToIdFull) ?? normalizeOptionalString(params.ctx.ReplyToId);
	const threadId = params.ctx.MessageThreadId == null ? void 0 : normalizeOptionalString(String(params.ctx.MessageThreadId));
	const agentId = normalizeOptionalString(params.ctx.AgentId) ?? resolveAgentIdFromSessionKey(sessionKey);
	const scope = resolveConversationRegistryScope({
		agentId,
		config: params.cfg
	});
	const sessionEntry = loadSessionEntryReadOnly({
		...scope,
		sessionKey,
		readConsistency: "latest"
	});
	if (!sessionEntry) return false;
	const timestamp = normalizeTimestamp(params.ctx.Timestamp);
	const parentConversationRef = threadId ? conversation.parentConversationRef ?? buildConversationRef({
		channel: conversation.channel,
		accountId: conversation.accountId,
		kind: conversation.kind,
		peerId: conversation.peerId
	}) : void 0;
	const input = {
		text: replyText,
		timestamp,
		idempotencyKey: `conversation-inbound:${conversation.conversationRef}:${messageId}`,
		...params.ctx.InputProvenance ? { provenance: params.ctx.InputProvenance } : {},
		transport: {
			channel: conversation.channel,
			conversationRef: conversation.conversationRef,
			messageId,
			...replyToId ? { replyToId } : {},
			...threadId ? { threadId } : {}
		},
		sender: conversation.kind === "group" || conversation.kind === "channel" ? buildChannelUserTurnSender(params.ctx) : void 0
	};
	const claim = await claimPendingConversationTurnReply({
		agentId,
		conversationRef: conversation.conversationRef,
		...parentConversationRef ? { parentConversationRef } : {},
		sessionId: sessionEntry.sessionId,
		messageId,
		replyToId,
		threadId,
		text: replyText,
		timestamp
	});
	if (!claim) {
		if (!replyToId) return false;
		return await runConversationDatabaseWrite(scope, (writeScope) => {
			const operation = findConversationTurnDeliveryByReplyTarget(writeScope, {
				conversationRef: conversation.conversationRef,
				replyToId
			}) ?? (parentConversationRef && parentConversationRef !== conversation.conversationRef ? findConversationTurnDeliveryByReplyTarget(writeScope, {
				conversationRef: parentConversationRef,
				replyToId
			}) : void 0);
			if (operation?.status === "replied" && operation.reply?.messageId === messageId) return true;
			if (operation && operation.status !== "replied") markConversationDeliverySent(writeScope, operation.operationId, replyToId);
			return false;
		});
	}
	try {
		if (sessionEntry.sessionId !== claim.sessionId) throw new Error(`session changed before captured reply persistence: ${sessionKey}`);
		const prepared = preparePersistedUserTurnMessageForTranscriptWrite(buildPersistedUserTurnMessage(input), {
			agentId,
			sessionKey,
			beforeMessageWrite: runAgentHarnessBeforeMessageWriteHook
		});
		if (!prepared) throw new Error("captured conversation turn reply was blocked before persistence");
		const persistedMessage = redactTranscriptMessage(prepared, params.cfg);
		const persistedReplyText = readPersistedReplyText(persistedMessage);
		if (!persistedReplyText) throw new Error("captured conversation turn reply has no persistable text");
		return await runConversationDatabaseWrite(scope, (writeScope) => {
			claim.assertCurrent();
			const current = loadSessionEntryReadOnly({
				...writeScope,
				sessionKey,
				readConsistency: "latest"
			});
			if (current?.sessionId !== claim.sessionId || current.lifecycleRevision !== sessionEntry.lifecycleRevision) throw new Error(`session changed before captured reply persistence: ${sessionKey}`);
			const artifactId = `conversation-turn-reply-${claim.turnId}`;
			markConversationDeliveryReplied(writeScope, {
				operationId: claim.turnId,
				reply: {
					messageId,
					...replyToId ? { replyToId } : {},
					...threadId ? { threadId } : {},
					text: persistedReplyText,
					timestamp: timestamp ?? Date.now()
				}
			});
			let persisted = false;
			try {
				const appendResult = appendTranscriptEventSync({
					...writeScope,
					sessionId: sessionEntry.sessionId,
					sessionKey
				}, {
					type: "custom",
					id: artifactId,
					customType: CONVERSATION_TURN_REPLY_CUSTOM_TYPE,
					appendMode: "side",
					timestamp: timestamp ?? Date.now(),
					data: {
						turnId: claim.turnId,
						conversationRef: conversation.conversationRef,
						messageId,
						...replyToId ? { replyToId } : {},
						...threadId ? { threadId } : {},
						message: persistedMessage
					}
				});
				persisted = appendResult.ok && appendResult.value;
				if (!appendResult.ok) logVerbose(`captured conversation turn reply audit persistence failed: ${appendResult.error.code}`);
			} catch (error) {
				logVerbose(`captured conversation turn reply audit persistence failed: ${String(error)}`);
			}
			if (!persisted) logVerbose("captured conversation turn reply audit artifact was not persisted");
			claim.complete(persisted ? { transcriptArtifactId: artifactId } : void 0);
			return true;
		});
	} catch (error) {
		claim.release();
		logVerbose(`conversation turn reply capture failed: ${String(error)}`);
		return false;
	}
}
/** Consumes a correlated channel reply before it can start a second local agent turn. */
async function capturePendingConversationTurnReply(params) {
	try {
		return await capturePendingConversationTurnReplyUnsafe(params);
	} catch (error) {
		logVerbose(`conversation turn reply capture unavailable: ${String(error)}`);
		return false;
	}
}
//#endregion
//#region src/auto-reply/reply/inbound-dedupe.ts
const DEFAULT_INBOUND_DEDUPE_TTL_MS = 12e5;
const DEFAULT_INBOUND_DEDUPE_MAX = 5e3;
/**
* Keep inbound dedupe shared across bundled chunks so the same provider
* message cannot bypass dedupe by entering through a different chunk copy.
*/
const INBOUND_DEDUPE_CACHE_KEY = Symbol.for("openclaw.inboundDedupeCache");
const INBOUND_DEDUPE_INFLIGHT_KEY = Symbol.for("openclaw.inboundDedupeClaims");
const inboundDedupeCache = resolveGlobalDedupeCache(INBOUND_DEDUPE_CACHE_KEY, {
	ttlMs: DEFAULT_INBOUND_DEDUPE_TTL_MS,
	maxSize: DEFAULT_INBOUND_DEDUPE_MAX
});
const inboundDedupeInFlight = resolveGlobalSingleton(INBOUND_DEDUPE_INFLIGHT_KEY, () => /* @__PURE__ */ new Map());
const resolveInboundPeerId = (ctx) => ctx.OriginatingTo ?? ctx.To ?? ctx.From ?? ctx.SessionKey;
function resolveInboundDedupeSessionScope(ctx) {
	const commandTarget = resolveCommandTurnTargetSessionKey(ctx);
	if (commandTarget) return commandTarget;
	const sessionKey = normalizeOptionalString(ctx.SessionKey) || "";
	if (!sessionKey) return "";
	const parsed = parseAgentSessionKey(sessionKey);
	if (!parsed) return sessionKey;
	return `agent:${parsed.agentId}`;
}
function buildInboundDedupeKey(ctx) {
	const provider = normalizeOptionalLowercaseString(ctx.OriginatingChannel ?? ctx.Provider ?? ctx.Surface) || "";
	const messageId = normalizeOptionalString(ctx.MessageSid);
	if (!provider || !messageId) return null;
	const peerId = resolveInboundPeerId(ctx);
	if (!peerId) return null;
	const sessionScope = resolveInboundDedupeSessionScope(ctx);
	const accountId = normalizeOptionalString(ctx.AccountId) ?? "";
	const routeKey = channelRouteDedupeKey({
		channel: provider,
		to: peerId,
		accountId,
		threadId: ctx.MessageThreadId
	});
	return JSON.stringify([
		sessionScope,
		routeKey,
		messageId
	]);
}
function claimInboundDedupe(ctx, opts) {
	const key = buildInboundDedupeKey(ctx);
	if (!key) return { status: "invalid" };
	const duplicate = inboundDedupeCache.peek(key);
	if (inboundDedupeInFlight.has(key)) return { status: duplicate ? "duplicate" : "inflight" };
	const recovered = opts?.reclaimPendingInput?.() === true;
	if (duplicate) {
		if (!recovered) return { status: "duplicate" };
		inboundDedupeCache.delete(key);
	}
	const owner = {};
	inboundDedupeInFlight.set(key, owner);
	return {
		status: "claimed",
		commit: () => {
			if (inboundDedupeInFlight.get(key) === owner) {
				inboundDedupeCache.check(key, void 0, owner);
				inboundDedupeInFlight.delete(key);
			}
		},
		release: () => {
			if (inboundDedupeInFlight.get(key) === owner) inboundDedupeInFlight.delete(key);
			inboundDedupeCache.delete(key, owner);
		}
	};
}
function resetInboundDedupe() {
	inboundDedupeCache.clear();
	inboundDedupeInFlight.clear();
}
//#endregion
//#region src/auto-reply/reply/message-received-hooks.ts
/** Emit observation hooks once for an accepted inbound turn, independent of reply dispatch. */
function emitMessageReceivedHooks(params) {
	if (params.ctx.SuppressMessageReceivedHooks === true) return;
	const buildContext = params.buildContext ?? (() => deriveInboundMessageHookContext(params.ctx, { messageId: params.ctx.MessageSidFull ?? params.ctx.MessageSid ?? params.ctx.MessageSidFirst ?? params.ctx.MessageSidLast }));
	if (params.hookRunner?.hasHooks("message_received") === true) {
		const context = buildContext();
		fireAndForgetHook(params.hookRunner.runMessageReceived(toPluginMessageReceivedEvent(context), toPluginMessageContext(context)), "message_received plugin hook failed");
	}
	if (params.sessionKey) {
		const context = buildContext();
		fireAndForgetHook(triggerInternalHook(createInternalHookEvent("message", "received", params.sessionKey, {
			...toInternalMessageReceivedContext(context),
			timestamp: params.timestamp
		})), "message_received internal hook failed");
	}
}
//#endregion
//#region src/auto-reply/reply/dispatch-from-config.prepare-context.ts
async function prepareDispatchOperationContext(state) {
	const { acpDispatchSessionKey, buildMessageReceivedHookContext, cfg, ctx, dispatcher, hookRunner, isInternalWebchatTurn, markIdle, params, recordAgentDispatchCompleted, recordProcessed, replyRoute, sessionAgentId, sessionKey, sessionStoreEntry } = state;
	const sendBindingNotice = async (payload, mode, transcriptOwner) => {
		if (sourceReplyPolicy.suppressAutomaticSourceDelivery) return false;
		return await state.deliverBindingPayload(payload, mode, transcriptOwner);
	};
	const pluginOwnedBindingRecord = state.allowInboundHandlers ? await resolveDispatchConversationBinding(cfg, ctx) : null;
	const pluginOwnedBinding = toPluginConversationBinding(pluginOwnedBindingRecord);
	const pluginBindingSessionKey = normalizeOptionalString(pluginOwnedBindingRecord?.targetSessionKey);
	const pluginBindingTargetKind = pluginOwnedBindingRecord?.targetKind;
	const persistPluginBindingUserTurn = async () => {
		const recorder = params.replyOptions?.userTurnTranscriptRecorder;
		if (!recorder || !pluginBindingSessionKey) return;
		const targetAgentId = resolveSessionAgentId({
			sessionKey: pluginBindingSessionKey,
			config: cfg,
			fallbackAgentId: ctx.AgentId
		});
		const blockedOwner = (expectedSessionId) => ({
			agentId: targetAgentId,
			sessionKey: pluginBindingSessionKey,
			...expectedSessionId ? { expectedSessionId } : {},
			transcriptWriteBlocked: true
		});
		if (recorder.hasPersisted()) return blockedOwner();
		let attemptedSessionId;
		let lastOwner;
		for (let attempt = 0; attempt < 2; attempt += 1) {
			const targetSessionStoreEntry = resolveSessionStoreLookup({
				...ctx,
				CommandTargetSessionKey: void 0,
				SessionKey: pluginBindingSessionKey
			}, cfg);
			const targetSessionEntry = targetSessionStoreEntry.entry;
			if (!targetSessionEntry || targetSessionEntry.sessionId === attemptedSessionId) break;
			attemptedSessionId = targetSessionEntry.sessionId;
			lastOwner = {
				agentId: targetAgentId,
				expectedSessionId: targetSessionEntry.sessionId,
				sessionKey: pluginBindingSessionKey
			};
			if (await recorder.persistApproved({
				target: {
					sessionId: targetSessionEntry.sessionId,
					sessionKey: pluginBindingSessionKey,
					sessionEntry: targetSessionEntry,
					...targetSessionStoreEntry.store ? { sessionStore: targetSessionStoreEntry.store } : {},
					storePath: targetSessionStoreEntry.storePath,
					agentId: targetAgentId,
					cwd: resolveAgentWorkspaceDir(cfg, targetAgentId),
					config: cfg
				},
				expectedSessionId: targetSessionEntry.sessionId,
				retryIfUnpersisted: true
			})) return lastOwner;
		}
		if (!lastOwner) {
			recorder.markBlocked();
			return blockedOwner();
		}
		recorder.markBlocked();
		logVerbose(`plugin-bound user-turn persistence skipped after the target session changed`);
		return blockedOwner(lastOwner.expectedSessionId);
	};
	const sendPolicy = resolveSendPolicy({
		cfg,
		entry: sessionStoreEntry.entry,
		sessionKey: sessionStoreEntry.sessionKey ?? sessionKey,
		channel: (state.shouldRouteToOriginating ? state.routeReplyChannel : void 0) ?? sessionDeliveryChannel(sessionStoreEntry.entry) ?? replyRoute.channel ?? ctx.Surface ?? ctx.Provider ?? void 0,
		chatType: sessionStoreEntry.entry?.chatType
	});
	const { globalPolicy, globalProviderPolicy, agentPolicy, agentProviderPolicy, profile, providerProfile, profileAlsoAllow, providerProfileAlsoAllow } = resolveEffectiveToolPolicy({
		config: cfg,
		sessionKey: acpDispatchSessionKey,
		agentId: sessionAgentId
	});
	const chatType = normalizeChatType(ctx.ChatType);
	state.replyOperationRunState.replyCompletion = resolveReplyCompletion(resolveSourceReplyExpectation({
		ctx,
		cfg,
		isHeartbeat: params.replyOptions?.isHeartbeat
	}), "empty");
	const { configuredVisibleReplies, harnessDefaultVisibleReplies } = resolveVisibleRepliesPolicy({
		cfg,
		chatType,
		ctx,
		entry: sessionStoreEntry.entry,
		sessionAgentId,
		sessionKey: acpDispatchSessionKey,
		sessionStore: sessionStoreEntry.store,
		turnModelOverride: resolveTurnModelOverride(params.replyOptions)
	});
	const effectiveVisibleReplies = configuredVisibleReplies ?? harnessDefaultVisibleReplies;
	const runtimeProfileAlsoAllow = params.replyOptions?.sourceReplyDeliveryMode === "message_tool_only" || ctx.InboundEventKind === "room_event" && !isInternalWebchatTurn || params.replyOptions?.sourceReplyDeliveryMode === void 0 && !isExplicitSourceReplyCommand(ctx, cfg) && (configuredVisibleReplies === "message_tool" || !isInternalWebchatTurn && effectiveVisibleReplies === "message_tool") ? ["message"] : [];
	const profilePolicy = mergeAlsoAllowPolicy(resolveToolProfilePolicy(profile), [...profileAlsoAllow ?? [], ...runtimeProfileAlsoAllow]);
	const providerProfilePolicy = mergeAlsoAllowPolicy(resolveToolProfilePolicy(providerProfile), [...providerProfileAlsoAllow ?? [], ...runtimeProfileAlsoAllow]);
	const groupResolution = resolveGroupSessionKey(ctx);
	const messageProvider = resolveOriginMessageProvider({
		originatingChannel: ctx.OriginatingChannel,
		provider: ctx.Provider ?? ctx.Surface
	});
	const groupPolicy = resolveGroupToolPolicy({
		config: cfg,
		sessionKey: acpDispatchSessionKey,
		messageProvider,
		groupId: groupResolution?.id,
		groupChannel: normalizeOptionalString(ctx.GroupChannel) ?? normalizeOptionalString(ctx.GroupSubject),
		groupSpace: normalizeOptionalString(ctx.GroupSpace),
		accountId: ctx.AccountId,
		senderId: normalizeOptionalString(ctx.SenderId),
		senderName: normalizeOptionalString(ctx.SenderName),
		senderUsername: normalizeOptionalString(ctx.SenderUsername),
		senderE164: normalizeOptionalString(ctx.SenderE164)
	});
	const subagentStore = resolveSubagentCapabilityStore(acpDispatchSessionKey, { cfg });
	const subagentPolicy = acpDispatchSessionKey && isSubagentEnvelopeSession(acpDispatchSessionKey, {
		cfg,
		store: subagentStore
	}) ? resolveSubagentToolPolicyForSession(cfg, acpDispatchSessionKey, { store: subagentStore }) : void 0;
	const inheritedToolPolicy = resolveInheritedToolPolicyForSession(cfg, acpDispatchSessionKey, { store: subagentStore });
	const messageToolAvailable = isToolAllowedByPolicies("message", [
		profilePolicy,
		providerProfilePolicy,
		globalProviderPolicy,
		agentProviderPolicy,
		globalPolicy,
		agentPolicy,
		groupPolicy,
		subagentPolicy,
		inheritedToolPolicy
	]);
	const sessionStableMessageToolAvailable = effectiveVisibleReplies === "message_tool" ? resolveStableMessageToolAvailability({
		cfg,
		ctx,
		sessionEntry: sessionStoreEntry.entry,
		sessionAgentId,
		sessionKey: acpDispatchSessionKey
	}) : void 0;
	const sourceReplyPolicyParams = {
		cfg,
		ctx,
		strictMessageToolOnly: ctx.InboundEventKind === "room_event" && !isInternalWebchatTurn,
		sendPolicy,
		suppressAcpChildUserDelivery: state.suppressAcpChildUserDelivery,
		explicitSuppressTyping: params.replyOptions?.suppressTyping === true,
		shouldSuppressTyping: state.shouldSuppressTyping,
		messageToolAvailable,
		sessionStableMessageToolAvailable,
		isHeartbeat: params.replyOptions?.isHeartbeat
	};
	let sourceReplyPolicy = resolveSourceReplyVisibilityPolicy({
		...sourceReplyPolicyParams,
		requested: params.replyOptions?.sourceReplyDeliveryMode,
		defaultVisibleReplies: harnessDefaultVisibleReplies
	});
	const alternateHarnessDefault = harnessDefaultVisibleReplies === "message_tool" ? "automatic" : "message_tool";
	const sourceReplyDeliveryRuntimeOptions = {
		sourceReplyDeliveryModeOrigin: resolveSourceReplyVisibilityPolicy({
			...sourceReplyPolicyParams,
			requested: params.replyOptions?.sourceReplyDeliveryMode,
			defaultVisibleReplies: alternateHarnessDefault
		}).sourceReplyDeliveryMode === sourceReplyPolicy.sourceReplyDeliveryMode ? "stable_policy" : "runtime_default",
		onSourceReplyDeliveryModeResolved: (mode) => {
			const stableMode = sourceReplyPolicy.sessionStableSourceReplyDeliveryMode;
			sourceReplyPolicy = resolveSourceReplyVisibilityPolicy({
				...sourceReplyPolicyParams,
				requested: mode
			});
			sourceReplyPolicy.sessionStableSourceReplyDeliveryMode = stableMode;
			Object.assign(state, sourceReplyPolicy, { sourceReplyPolicy });
		}
	};
	Object.assign(sourceReplyPolicy, sourceReplyDeliveryRuntimeOptions);
	const { sourceReplyDeliveryMode, sessionStableSourceReplyDeliveryMode, suppressAutomaticSourceDelivery, suppressDelivery, sendPolicyDenied, deliverySuppressionReason, suppressHookUserDelivery, suppressHookReplyLifecycle } = sourceReplyPolicy;
	const reasoningPayloadsEnabled = params.replyOptions?.reasoningPayloadsEnabled === true;
	const commentaryPayloadsEnabled = params.replyOptions?.commentaryPayloadsEnabled === true;
	const attachSourceReplyDeliveryMode = (result) => sourceReplyPolicy.sourceReplyDeliveryMode === "message_tool_only" || sourceReplyPolicy.sendPolicyDenied ? {
		...result,
		...sourceReplyPolicy.sourceReplyDeliveryMode === "message_tool_only" ? { sourceReplyDeliveryMode: sourceReplyPolicy.sourceReplyDeliveryMode } : {},
		...sourceReplyPolicy.sendPolicyDenied ? { sendPolicyDenied: true } : {}
	} : result;
	const explicitCommandTurnCtx = isExplicitSourceReplyCommand(ctx, cfg);
	const activeRunSafeCommandTurn = explicitCommandTurnCtx && isActiveRunSafeCommandTurn({
		commandTurn: resolveCommandTurnContext(ctx),
		cfg,
		provider: ctx.Provider ?? ctx.Surface
	});
	const unauthorizedTextSlashSourceReplyCtx = (chatType === "group" || chatType === "channel") && isUnauthorizedTextSlashCommand(ctx);
	const shouldDeliverPluginBindingReply = !suppressAutomaticSourceDelivery || explicitCommandTurnCtx || ctx.InboundEventKind !== "room_event" && !unauthorizedTextSlashSourceReplyCtx;
	const durableSourceTurnId = readChannelSourceTurnId(ctx) ?? (shouldMintChannelSourceTurnId(ctx.Provider ?? ctx.Surface) ? buildChannelSourceTurnId({
		provider: resolveOriginMessageProvider({
			originatingChannel: replyRoute.channel,
			provider: ctx.Provider ?? ctx.Surface
		}),
		accountId: replyRoute.accountId,
		conversationId: replyRoute.to,
		messageId: normalizeOptionalString(ctx.MessageSidFull) ?? normalizeOptionalString(ctx.MessageSid)
	}) : void 0);
	setChannelSourceTurnId(ctx, durableSourceTurnId);
	if (isDuplicateRestartRecoverySource(sessionStoreEntry.entry, durableSourceTurnId)) {
		recordProcessed("skipped", { reason: "duplicate" });
		return {
			status: "complete",
			result: attachSourceReplyDeliveryMode({
				queuedFinal: false,
				counts: dispatcher.getQueuedCounts()
			})
		};
	}
	const inboundDedupeClaim = claimInboundDedupe(ctx, { reclaimPendingInput: () => {
		const sourceRunId = normalizeOptionalString(ctx.MessageSid);
		return Boolean(params.replyOptions?.userTurnTranscriptRecorder?.getPendingInputMessage?.() && !params.replyOptions.userTurnTranscriptRecorder.hasPersisted() && sourceRunId && sessionStoreEntry.sessionKey && sessionStoreEntry.entry?.sessionId && claimSessionPendingInputDedupeRecovery({
			agentId: sessionStoreEntry.agentId ?? sessionAgentId,
			storePath: sessionStoreEntry.storePath,
			sessionKey: sessionStoreEntry.sessionKey,
			sessionId: sessionStoreEntry.entry.sessionId
		}, sourceRunId));
	} });
	if (inboundDedupeClaim.status === "duplicate" || inboundDedupeClaim.status === "inflight") {
		recordProcessed("skipped", { reason: "duplicate" });
		return {
			status: "complete",
			result: attachSourceReplyDeliveryMode({
				queuedFinal: false,
				counts: dispatcher.getQueuedCounts()
			})
		};
	}
	const commitInboundDedupeIfClaimed = () => inboundDedupeClaim.commit?.();
	const releaseInboundDedupeIfClaimed = () => inboundDedupeClaim.release?.();
	const lifecycle = params.replyOptions?.turnAdoptionLifecycle;
	if (lifecycle && inboundDedupeClaim.status === "claimed") {
		const onAbandoned = lifecycle.onAbandoned;
		lifecycle.onAbandoned = () => {
			if (!state.inboundDedupeReplayUnsafe && !state.turnAdoptionState?.adopted) inboundDedupeClaim.release();
			onAbandoned?.();
		};
	}
	const finishReplyOperationBusyDispatch = (opts) => {
		state.releasePreDispatchLifecycleAdmission(() => waitForReplyDispatcherIdle(dispatcher));
		if (opts?.recordAgentDispatchCompleted) recordAgentDispatchCompleted("completed", { reason: "reply-operation-active" });
		recordProcessed("skipped", { reason: "reply-operation-active" });
		markIdle("message_completed");
		if (opts?.dedupeDisposition === "release") releaseInboundDedupeIfClaimed();
		else commitInboundDedupeIfClaimed();
		return attachSourceReplyDeliveryMode({
			queuedFinal: false,
			counts: dispatcher.getQueuedCounts(),
			...opts?.sessionMetadataChanges ? { sessionMetadataChanges: opts.sessionMetadataChanges } : {}
		});
	};
	const finishReplyOperationAbortedDispatch = () => {
		const operation = state.getDispatchReplyOperation();
		recordReplyOperationAgentTurn([state.replyOperationRunState], operation);
		const queuedFinal = operation?.result?.kind === "failed" && operation.result.code === "run_stalled" && (operation.staleExpiryReason === "no_activity" || operation.staleExpiryReason === "stuck_recovery") ? dispatcher.sendFinalReply({
			text: "⚠️ This turn was interrupted because it stopped making progress. Please try again.",
			isError: true
		}) : false;
		if (state.turnAdoptionState && !state.turnAdoptionState.adopted && !state.inboundDedupeReplayUnsafe) releaseInboundDedupeIfClaimed();
		else commitInboundDedupeIfClaimed();
		recordProcessed("skipped", { reason: "reply_operation_aborted" });
		markIdle("message_completed");
		state.completeDispatchReplyOperation();
		return attachSourceReplyDeliveryMode({
			queuedFinal,
			counts: dispatcher.getQueuedCounts(),
			...state.turnLedger.hasObservedDelivery() ? { observedReplyDelivery: true } : {}
		});
	};
	const bindingState = {};
	const emitMessageReceivedHooks$1 = () => {
		if (!state.allowInboundHandlers) return;
		emitMessageReceivedHooks({
			ctx,
			hookRunner,
			sessionKey,
			timestamp: state.timestamp,
			buildContext: buildMessageReceivedHookContext
		});
	};
	state.markProcessing();
	if (state.allowInboundHandlers && await capturePendingConversationTurnReply({
		cfg,
		ctx
	})) {
		emitMessageReceivedHooks$1();
		commitInboundDedupeIfClaimed();
		recordProcessed("completed", { reason: "conversation-turn-reply" });
		markIdle("message_completed");
		return {
			status: "complete",
			result: attachSourceReplyDeliveryMode({
				queuedFinal: false,
				counts: dispatcher.getQueuedCounts(),
				observedReplyDelivery: true
			})
		};
	}
	return {
		status: "ready",
		state: extendPreparedDispatchState(state, {
			sendBindingNotice,
			pluginOwnedBinding,
			pluginBindingSessionKey,
			pluginBindingTargetKind,
			persistPluginBindingUserTurn,
			sendPolicy,
			chatType,
			sourceReplyPolicy,
			sourceReplyDeliveryRuntimeOptions,
			sourceReplyDeliveryMode,
			sessionStableSourceReplyDeliveryMode,
			suppressAutomaticSourceDelivery,
			suppressDelivery,
			sendPolicyDenied,
			deliverySuppressionReason,
			suppressHookUserDelivery,
			suppressHookReplyLifecycle,
			reasoningPayloadsEnabled,
			commentaryPayloadsEnabled,
			attachSourceReplyDeliveryMode,
			explicitCommandTurnCtx,
			activeRunSafeCommandTurn,
			shouldDeliverPluginBindingReply,
			inboundDedupeClaim,
			commitInboundDedupeIfClaimed,
			finishReplyOperationBusyDispatch,
			finishReplyOperationAbortedDispatch,
			emitMessageReceivedHooks: emitMessageReceivedHooks$1,
			bindingState
		})
	};
}
//#endregion
//#region src/auto-reply/reply/routing-policy.ts
/** Resolves whether replies should route to the originating channel or current surface. */
/** Computes source-routing and typing suppression for a reply turn. */
function resolveReplyRoutingDecision(params) {
	const originatingChannel = normalizeMessageChannel(params.originatingChannel);
	const providerChannel = normalizeMessageChannel(params.provider);
	const surfaceChannel = normalizeMessageChannel(params.surface);
	const currentSurface = providerChannel ?? surfaceChannel;
	const isInternalWebchatTurn = currentSurface === "webchat" && (surfaceChannel === "webchat" || !surfaceChannel) && params.explicitDeliverRoute !== true;
	const shouldRouteToOriginating = Boolean(!params.suppressDirectUserDelivery && !isInternalWebchatTurn && params.isRoutableChannel(originatingChannel) && params.originatingTo && originatingChannel !== currentSurface);
	return {
		originatingChannel,
		currentSurface,
		isInternalWebchatTurn,
		shouldRouteToOriginating,
		shouldSuppressTyping: params.suppressDirectUserDelivery === true || shouldRouteToOriginating || originatingChannel === "webchat"
	};
}
//#endregion
//#region src/auto-reply/reply/dispatch-from-config.prepare-delivery.ts
async function prepareDispatchDelivery(state) {
	const { cfg, ctx, groupId, markInboundDedupeReplayUnsafe, replyRoute, sessionStoreEntry, turnLedger } = state;
	const currentAcpSession = sessionStoreEntry.sessionKey ? readAcpSessionEntry({
		cfg,
		agentId: sessionStoreEntry.agentId,
		sessionKey: sessionStoreEntry.sessionKey
	}) : void 0;
	const sessionEntryWithAcp = currentAcpSession?.entry ? {
		...currentAcpSession.entry,
		acp: currentAcpSession.acp
	} : void 0;
	const suppressAcpChildUserDelivery = isParentOwnedBackgroundAcpSession(sessionEntryWithAcp);
	const normalizedRouteReplyChannel = normalizeMessageChannel(replyRoute.channel);
	const normalizedProviderChannel = normalizeMessageChannel(ctx.Provider);
	const normalizedSurfaceChannel = normalizeMessageChannel(ctx.Surface);
	const normalizedCurrentSurface = normalizedProviderChannel ?? normalizedSurfaceChannel;
	const effectiveExplicitDeliverRoute = ctx.ExplicitDeliverRoute === true || replyRoute.inheritedExternalRoute === true;
	const isInternalWebchatTurn = normalizedCurrentSurface === "webchat" && (normalizedSurfaceChannel === "webchat" || !normalizedSurfaceChannel) && !effectiveExplicitDeliverRoute;
	const routeReplyRuntime = Boolean(!suppressAcpChildUserDelivery && !isInternalWebchatTurn && normalizedRouteReplyChannel && replyRoute.to && normalizedRouteReplyChannel !== normalizedCurrentSurface && !state.replyOperationRunState.heartbeat) ? await loadRouteReplyRuntime() : void 0;
	const { originatingChannel: routeReplyChannel, currentSurface, shouldRouteToOriginating, shouldSuppressTyping } = resolveReplyRoutingDecision({
		provider: ctx.Provider,
		surface: ctx.Surface,
		explicitDeliverRoute: effectiveExplicitDeliverRoute,
		originatingChannel: replyRoute.channel,
		originatingTo: replyRoute.to,
		suppressDirectUserDelivery: suppressAcpChildUserDelivery,
		isRoutableChannel: routeReplyRuntime?.isRoutableChannel ?? (() => false)
	});
	const routeReplyTo = replyRoute.to;
	const canRouteDurableBlockReply = Boolean(!suppressAcpChildUserDelivery && !isInternalWebchatTurn && routeReplyChannel && routeReplyTo && routeReplyChannel === normalizedCurrentSurface);
	const deliveryChannel = shouldRouteToOriginating ? routeReplyChannel : currentSurface;
	const replyContextAccountId = routeReplyChannel ? resolveReplyDeliveryAccountId(cfg, routeReplyChannel, replyRoute.accountId) : void 0;
	let normalizeReplyMediaPaths;
	const getNormalizeReplyMediaPaths = async () => {
		if (normalizeReplyMediaPaths) return normalizeReplyMediaPaths;
		const { createReplyMediaPathNormalizer } = await loadReplyMediaPathsRuntime();
		normalizeReplyMediaPaths = createReplyMediaPathNormalizer({
			cfg,
			agentId: state.sessionAgentId,
			sessionKey: state.acpDispatchSessionKey,
			workspaceDir: state.workspaceDir,
			messageProvider: deliveryChannel,
			accountId: replyContextAccountId,
			groupId,
			groupChannel: ctx.GroupChannel,
			groupSpace: ctx.GroupSpace,
			requesterSenderId: ctx.SenderId,
			requesterSenderName: ctx.SenderName,
			requesterSenderUsername: ctx.SenderUsername,
			requesterSenderE164: ctx.SenderE164
		});
		return normalizeReplyMediaPaths;
	};
	const normalizeReplyMediaPayload = async (payload) => {
		if (isInternalWebchatTurn || !resolveSendableOutboundReplyParts(payload).hasMedia) return payload;
		return await (await getNormalizeReplyMediaPaths())(payload);
	};
	const routeReplyOperationToOriginating = async (operation, options) => {
		const payload = operation.kind === "prepared" ? operation.plan.payload : operation.payload;
		const durableRouteAuthorized = options?.deliveryIntentId !== void 0 && canRouteDurableBlockReply;
		const runtime = routeReplyRuntime ?? (durableRouteAuthorized ? await loadRouteReplyRuntime() : void 0);
		if (!shouldRouteToOriginating && !durableRouteAuthorized || !routeReplyChannel || !routeReplyTo || !runtime) {
			if (options?.deliveryIntentId) throw new Error("durable block reply route unavailable");
			return null;
		}
		markInboundDedupeReplayUnsafe();
		const agentRuntimeSessionKey = options?.sessionKey ?? (ctx.CommandSource === "native" ? resolveCommandTurnTargetSessionKey(ctx) ?? ctx.SessionKey : ctx.SessionKey);
		const routeParams = {
			channel: routeReplyChannel,
			to: routeReplyTo,
			agentId: state.sessionAgentId,
			sessionKey: agentRuntimeSessionKey,
			policySessionKey: options?.sessionKey ?? resolveCommandTurnTargetSessionKey(ctx) ?? ctx.SessionKey,
			policyConversationType: resolveRoutedPolicyConversationType(ctx),
			accountId: replyContextAccountId,
			requesterSenderId: ctx.SenderId,
			requesterSenderName: ctx.SenderName,
			requesterSenderUsername: ctx.SenderUsername,
			requesterSenderE164: ctx.SenderE164,
			threadId: state.routeReplyThreadId,
			replyDelivery: createReplyDeliveryContext(resolveReplyToMode(cfg, routeReplyChannel, replyContextAccountId, replyRoute.chatType), replyRoute.chatType),
			cfg,
			abortSignal: options?.abortSignal,
			mirror: options?.mirror,
			isGroup: state.isGroup,
			groupId,
			replyKind: options?.kind ?? "final",
			runId: state.params.replyOptions?.runId,
			responsePrefixContext: options?.responsePrefixContext,
			deliveryIntentId: options?.deliveryIntentId
		};
		const result = operation.kind === "prepared" ? await runtime.routePreparedReply({
			...routeParams,
			plan: operation.plan
		}) : await runtime.routeReply({
			...routeParams,
			payload
		});
		turnLedger.recordRoutedDelivery(options?.kind ?? "final", payload, result);
		return result;
	};
	const routeReplyToOriginating = (payload, options) => routeReplyOperationToOriginating({
		kind: "raw",
		payload
	}, options);
	const isRoutedReplyDelivered = (result) => result.delivered && result.ambiguous !== true;
	/**
	* Helper to send a payload via route-reply (async).
	* Only used when actually routing to a different provider.
	* Note: Only called when shouldRouteToOriginating is true, so
	* routeReplyChannel and routeReplyTo are guaranteed to be defined.
	*/
	const sendReplyOperationAsync = async (operation, abortSignal, mirror, kind = "tool", deliveryIntentId) => {
		const payload = operation.kind === "prepared" ? operation.plan.payload : operation.payload;
		if (!routeReplyRuntime && !deliveryIntentId) return null;
		const effectiveAbortSignal = abortSignal ?? state.getDispatchAbortSignal();
		if (effectiveAbortSignal?.aborted) return null;
		const result = await routeReplyOperationToOriginating(operation, {
			abortSignal: effectiveAbortSignal,
			mirror,
			kind,
			deliveryIntentId
		});
		if (result && !result.ok) {
			logVerbose(`dispatch-from-config: route-reply failed: ${result.error ?? "unknown error"}`);
			if (deliveryIntentId) throw new Error(result.error ?? "durable block reply delivery failed");
		}
		if (hasAskUserPayload(payload) && !effectiveAbortSignal?.aborted && !result?.delivered) throw new Error("ask_user prompt delivery failed");
		return result;
	};
	const sendPayloadAsync = (payload, abortSignal, mirror, kind = "tool", deliveryIntentId) => sendReplyOperationAsync({
		kind: "raw",
		payload
	}, abortSignal, mirror, kind, deliveryIntentId);
	const deliverBindingPayload = async (payload, mode, transcriptOwner) => {
		const bindingPayload = setReplyPayloadMetadata(copyReplyPayloadMetadata(payload, { ...payload }), { sourceReplyTranscriptMirror: transcriptOwner ? {
			sessionKey: transcriptOwner.sessionKey,
			agentId: transcriptOwner.agentId,
			...transcriptOwner.expectedSessionId ? { expectedSessionId: transcriptOwner.expectedSessionId } : {},
			...transcriptOwner.transcriptWriteBlocked ? { transcriptWriteBlocked: true } : {}
		} : void 0 });
		const result = await routeReplyToOriginating(bindingPayload, {
			kind: mode === "terminal" ? "final" : "tool",
			sessionKey: transcriptOwner?.sessionKey
		});
		if (result) {
			if (!result.ok) logVerbose(`dispatch-from-config: route-reply (plugin binding notice) failed: ${result.error ?? "unknown error"}`);
			return result.delivered || result.suppressed === true;
		}
		markInboundDedupeReplayUnsafe();
		return mode === "additive" ? turnLedger.sendQueued("tool", bindingPayload).queued : turnLedger.sendQueued("final", bindingPayload).queued;
	};
	return {
		status: "ready",
		state: extendPreparedDispatchState(state, {
			suppressAcpChildUserDelivery,
			normalizedCurrentSurface,
			isInternalWebchatTurn,
			routeReplyChannel,
			canRouteDurableBlockReply,
			shouldRouteToOriginating,
			shouldSuppressTyping,
			routeReplyTo,
			deliveryChannel,
			replyContextAccountId,
			normalizeReplyMediaPayload,
			routeReplyToOriginating,
			isRoutedReplyDelivered,
			sendPayloadAsync,
			sendReplyOperationAsync,
			deliverBindingPayload
		})
	};
}
//#endregion
//#region src/channels/plugins/exec-approval-local.ts
function shouldSuppressLocalExecApprovalPrompt(params) {
	const channel = params.channel ? normalizeChannelId(params.channel) : null;
	if (!channel) return false;
	return getChannelPlugin(channel)?.outbound?.shouldSuppressLocalPayloadPrompt?.({
		cfg: params.cfg,
		accountId: params.accountId,
		payload: params.payload,
		hint: {
			kind: "approval-pending",
			approvalKind: "exec",
			nativeRouteActive: hasActiveNativeApprovalRoute(getGatewayNativeApprovalRuntime()?.routeCoordinator, {
				channel,
				accountId: params.accountId,
				approvalKind: "exec"
			})
		}
	}) ?? false;
}
//#endregion
//#region src/auto-reply/reply/dispatch-from-config.prepare-execution.ts
async function prepareDispatchExecution(state) {
	const { cfg, ctx, isDispatchOperationAborted, markInboundDedupeReplayUnsafe, markProgress, noteCommentaryProgress, params, sendPayloadAsync, sessionKey, shouldEmitVerboseProgress, shouldRouteToOriginating, shouldSendToolSummaries, shouldSendVerboseProgressMessages, turnLedger } = state;
	if (state.suppressDelivery) logVerbose(`Delivery suppressed by ${state.deliverySuppressionReason} for session ${state.sessionStoreEntry.sessionKey ?? sessionKey ?? "unknown"} — agent will still process the message`);
	let didSendPlanStatusNotice = false;
	const formatPlanUpdateText = (payload) => {
		const explanation = payload.explanation?.replace(/\s+/g, " ").trim();
		const steps = (payload.steps ?? []).map((entry) => ({
			step: entry.step.replace(/\s+/g, " ").trim(),
			status: entry.status
		})).filter((entry) => entry.step);
		if (steps.length > 0) return formatPlanChecklistLines(steps, {
			maxLines: steps.length,
			maxLineChars: 120
		}).join("\n");
		return payload.explanationFormat === "plain" ? "Progress updated" : explanation || "Planning next steps.";
	};
	const sendPlanUpdate = async (payload) => {
		if (shouldSuppressProgressDelivery() || !shouldSendVerboseProgressMessages() || didSendPlanStatusNotice) return;
		didSendPlanStatusNotice = true;
		const replyPayload = {
			text: formatPlanUpdateText(payload),
			isStatusNotice: true
		};
		if (shouldRouteToOriginating) {
			await sendPayloadAsync(replyPayload, void 0, false);
			return;
		}
		markInboundDedupeReplayUnsafe();
		turnLedger.sendQueued("tool", replyPayload);
	};
	const progressState = {
		accumulatedBlockText: "",
		accumulatedBlockTtsText: "",
		acceptedReplyPayload: false,
		blockCount: 0,
		channelTransformSuppressed: false,
		pendingDirectBlockReplyDelivery: Promise.resolve(),
		progressCallbackStartTail: Promise.resolve()
	};
	const cleanBlockTtsDirectiveText = shouldCleanTtsDirectiveText({
		cfg,
		ttsAuto: state.sessionTtsAuto,
		agentId: state.sessionAgentId,
		channelId: state.deliveryChannel,
		accountId: state.replyRoute.accountId
	}) ? createTtsDirectiveTextStreamCleaner() : void 0;
	const resolveToolDeliveryPayload = (payload) => {
		if (shouldSuppressLocalExecApprovalPrompt({
			channel: normalizeMessageChannel(ctx.Surface ?? ctx.Provider),
			cfg,
			accountId: ctx.AccountId,
			payload
		})) return null;
		if (shouldSendToolSummaries()) return payload;
		if (hasExecApprovalPayload(payload) || hasExecApprovalUnavailablePayload(payload)) return payload;
		if (hasAskUserPayload(payload)) return payload;
		if (!resolveSendableOutboundReplyParts(payload).hasMedia) return null;
		return {
			...payload,
			text: void 0
		};
	};
	const typing = resolveRunTypingPolicy({
		requestedPolicy: params.replyOptions?.typingPolicy,
		suppressTyping: state.sourceReplyPolicy.suppressTyping,
		originatingChannel: state.routeReplyChannel,
		systemEvent: shouldRouteToOriginating
	});
	const shouldSuppressProgressDelivery = () => state.sendPolicyDenied || state.suppressDelivery && !state.shouldDeliverVerboseProgressDespiteSourceSuppression();
	const onToolResultFromReplyOptions = params.replyOptions?.onToolResult;
	const onPlanUpdateFromReplyOptions = params.replyOptions?.onPlanUpdate;
	const onApprovalEventFromReplyOptions = params.replyOptions?.onApprovalEvent;
	const onPatchSummaryFromReplyOptions = params.replyOptions?.onPatchSummary;
	const allowSuppressedSourceProgressCallbacks = params.replyOptions?.allowProgressCallbacksWhenSourceDeliverySuppressed === true;
	const shouldAllowQuietChannelOwnedProgressCallbacks = (options) => options?.requiresToolSummaryVisibility === true && (params.replyOptions?.suppressDefaultToolProgressMessages === true || options.allowWhenToolSummariesHidden === true);
	const waitForPendingDirectBlockReplyDelivery = (abortSignal) => waitForReplyDispatcherIdle({ waitForIdle: () => progressState.pendingDirectBlockReplyDelivery }, abortSignal);
	const shouldForwardProgressCallback = (options) => {
		if (options?.requiresToolSummaryVisibility === true && !shouldSendToolSummaries() && !shouldAllowQuietChannelOwnedProgressCallbacks(options)) return false;
		return !state.suppressAutomaticSourceDelivery || allowSuppressedSourceProgressCallbacks && !state.sendPolicyDenied && options?.forwardWhenSourceDeliverySuppressed === true;
	};
	const preserveProgressCallbackStartOrder = params.replyOptions?.preserveProgressCallbackStartOrder === true;
	const reserveProgressCallbackStart = () => {
		const previousStart = progressState.progressCallbackStartTail;
		let releaseStart;
		progressState.progressCallbackStartTail = new Promise((resolve) => {
			releaseStart = resolve;
		});
		return {
			previousStart,
			releaseStart: () => releaseStart?.()
		};
	};
	const wrapProgressCallback = (callback, options) => {
		if (!callback) return;
		const runProgressCallback = async (args, noteCallbackStarted) => {
			try {
				if (isDispatchOperationAborted()) return;
				state.getDispatchReplyOperation()?.recordActivity();
				markProgress();
				if (options?.waitForDirectBlockReplyDelivery) {
					await waitForPendingDirectBlockReplyDelivery(state.getDispatchAbortOperation()?.abortSignal);
					if (isDispatchOperationAborted()) return;
				}
				if (shouldForwardProgressCallback(options)) {
					if (preserveProgressCallbackStartOrder && options?.onForward) await options.onForward(...args);
					else if (!preserveProgressCallbackStartOrder) await options?.onForward?.(...args);
					const callbackResult = callback(...args);
					noteCallbackStarted();
					const result = await callbackResult;
					if (result === false) return result;
					await options?.onVisible?.(...args);
				}
				return;
			} finally {
				noteCallbackStarted();
			}
		};
		return (...args) => {
			if (!preserveProgressCallbackStartOrder) return runProgressCallback(args, () => void 0);
			const start = reserveProgressCallbackStart();
			return (async () => {
				await start.previousStart;
				return await runProgressCallback(args, start.releaseStart);
			})();
		};
	};
	const reasoningCallback = params.replyOptions?.onReasoningStream;
	const onReasoningStream = reasoningCallback ? wrapProgressCallback((payload) => {
		const text = sanitizeUserFacingText(payload.text, {
			conversationContext: ctx.BodyForAgent ?? ctx.Body,
			streaming: true
		});
		const visible = {
			...payload,
			text
		};
		if (!text.trim() && !resolveSendableOutboundReplyParts(visible).hasMedia) return false;
		return reasoningCallback(visible);
	}) : void 0;
	const standaloneCommentaryProgressVisible = shouldEmitVerboseProgress();
	const resolveVerboseProgressVisibility = () => standaloneCommentaryProgressVisible && shouldSendVerboseProgressMessages() && !shouldSuppressProgressDelivery();
	const { commentaryPayloadsEnabled, draftOwnsCommentaryProgress } = resolveTurnCommentaryProgressOwner({
		commentaryPayloadsEnabled: state.commentaryPayloadsEnabled,
		options: params.replyOptions,
		resolveVerboseProgressVisibility
	});
	const deliverStandaloneCommentaryProgress = standaloneCommentaryProgressVisible && !draftOwnsCommentaryProgress;
	const itemEventForwardingOptions = {
		forwardWhenSourceDeliverySuppressed: true,
		requiresToolSummaryVisibility: true
	};
	const canForwardItemEvents = Boolean(params.replyOptions?.onItemEvent);
	const canForwardSuppressedSourceItemEvents = allowSuppressedSourceProgressCallbacks && !state.sendPolicyDenied && Boolean(params.replyOptions?.onItemEvent);
	const shouldDeliverDurableCommentaryProgress = (payload) => deliverStandaloneCommentaryProgress && payload.kind === "preamble" && payload.suppressDurableProgress !== true;
	const forwardItemEvent = canForwardItemEvents ? wrapProgressCallback(params.replyOptions?.onItemEvent, {
		...itemEventForwardingOptions,
		waitForDirectBlockReplyDelivery: true,
		onForward: (payload) => preserveProgressCallbackStartOrder && shouldDeliverDurableCommentaryProgress(payload) ? noteCommentaryProgress(payload) : void 0
	}) : void 0;
	const canCaptureCliPreambleEvents = Boolean(params.replyOptions?.onItemEvent) && shouldBridgeCliPreambleEvents(params.replyOptions);
	const onItemEvent = deliverStandaloneCommentaryProgress || canForwardItemEvents || canCaptureCliPreambleEvents ? async (payload) => {
		if (isDispatchOperationAborted()) return;
		if (!forwardItemEvent && deliverStandaloneCommentaryProgress) markProgress();
		if ((!forwardItemEvent || !preserveProgressCallbackStartOrder) && shouldDeliverDurableCommentaryProgress(payload)) await noteCommentaryProgress(payload);
		return await forwardItemEvent?.(payload);
	} : void 0;
	const replyResolver = params.replyResolver ?? (await state.traceReplyPhase("reply.load_reply_resolver", () => loadGetReplyFromConfigRuntime())).getReplyFromConfig;
	const runtimeReplyConfig = state.preparedReplyDispatchRuntime?.config ?? cfg;
	const replyConfig = withFullRuntimeReplyConfig(params.configOverride ? applyMergePatch(runtimeReplyConfig, params.configOverride) : runtimeReplyConfig);
	state.recordAgentDispatchStarted();
	return {
		status: "ready",
		state: extendPreparedDispatchState(state, {
			sendPlanUpdate,
			cleanBlockTtsDirectiveText,
			resolveToolDeliveryPayload,
			typing,
			shouldSuppressProgressDelivery,
			onToolResultFromReplyOptions,
			onPlanUpdateFromReplyOptions,
			onApprovalEventFromReplyOptions,
			onPatchSummaryFromReplyOptions,
			waitForPendingDirectBlockReplyDelivery,
			shouldForwardProgressCallback,
			preserveProgressCallbackStartOrder,
			wrapProgressCallback,
			onReasoningStream,
			deliverStandaloneCommentaryProgress,
			canForwardSuppressedSourceItemEvents,
			onItemEvent,
			commentaryPayloadsEnabled,
			replyResolver,
			replyConfig,
			progressState
		})
	};
}
//#endregion
//#region src/auto-reply/reply/dispatch-from-config.plugin-binding.ts
function shouldBypassPluginOwnedBindingForCommand(ctx, cfg, replyOptions) {
	if (ctx.CommandAuthorized !== void 0 && typeof ctx.CommandAuthorized !== "boolean") return false;
	const commandTurn = resolveCommandTurnContext(ctx);
	if ((commandTurn.kind === "native" || commandTurn.kind === "text-slash") && !commandTurn.authorized) return false;
	if (isNativeCommandTurn(commandTurn) && commandTurn.authorized) return true;
	if (!(commandTurn.kind === "text-slash" && commandTurn.authorized || commandTurn.kind === "normal" && typeof ctx.CommandAuthorized === "boolean" && ctx.CommandAuthorized) || !shouldHandleTextCommands({
		cfg,
		surface: ctx.Surface ?? ctx.Provider ?? "",
		commandSource: ctx.CommandSource
	})) return false;
	const commandBody = normalizeCommandBody(commandTurn.body ?? resolveCommandContextText(ctx), { botUsername: ctx.BotUsername });
	if (!commandBody.startsWith("/")) return false;
	if (replyOptions?.[PLUGIN_COMMAND_DISPATCH]) return true;
	const channel = resolveCommandChannel(ctx);
	const match = matchPluginCommandInvocation(createPluginCommandRuntime(), commandBody, { channel });
	if (match) {
		if (replyOptions) Object.assign(replyOptions, { [PLUGIN_COMMAND_DISPATCH]: match.dispatch });
		return true;
	}
	if (!isExplicitSourceReplyCommand(ctx, cfg)) return false;
	if (resolveTextCommand(commandBody)) return true;
	const provider = normalizeOptionalString(ctx.Provider ?? ctx.Surface);
	if (commandTurn.commandName && findCommandByNativeName(commandTurn.commandName, provider, { includeBundledChannelFallback: true })) return true;
	return false;
}
//#endregion
//#region src/auto-reply/reply/dispatch-from-config.prepare-operation.ts
async function prepareDispatchOperation(state) {
	const { attachSourceReplyDeliveryMode, cfg, chatType, commitInboundDedupeIfClaimed, completeDispatchReplyOperation, ctx, deliverySuppressionReason, dispatcher, emitMessageReceivedHooks, finishReplyOperationAbortedDispatch, hookRunner, isPreDispatchOperationAborted, markIdle, params, persistPluginBindingUserTurn, pluginOwnedBinding, recordProcessed, sendBindingNotice, sessionAgentId, sessionKey, sessionStoreEntry, suppressDelivery, turnLedger } = state;
	const abortRuntime = params.fastAbortResolver ? null : await loadAbortRuntime();
	const fastAbortResolver = params.fastAbortResolver ?? abortRuntime?.tryFastAbortFromMessage;
	const formatAbortReplyTextResolver = params.formatAbortReplyTextResolver ?? abortRuntime?.formatAbortReplyText;
	if (!fastAbortResolver || !formatAbortReplyTextResolver) throw new Error("abort runtime unavailable");
	const finishFastCommand = async (fast) => {
		if (pluginOwnedBinding) await getSessionBindingService().touchAsync(pluginOwnedBinding.bindingId, void 0, pluginOwnedBinding);
		emitMessageReceivedHooks();
		let queuedFinal = false;
		let routedFinalCount = 0;
		if (!suppressDelivery && fast.payload) {
			const selectedModel = resolveSessionModelRef(cfg, sessionStoreEntry.entry, sessionAgentId);
			const modelSelection = {
				...selectedModel,
				thinkLevel: sessionStoreEntry.entry?.thinkingLevel
			};
			const responsePrefixContext = {
				identityName: normalizeOptionalString(resolveAgentIdentity(cfg, sessionAgentId)?.name),
				provider: selectedModel.provider,
				model: extractShortModelName(selectedModel.model),
				modelFull: `${selectedModel.provider}/${selectedModel.model}`,
				thinkingLevel: modelSelection.thinkLevel ?? "off"
			};
			const result = await state.routeReplyToOriginating(fast.payload, { responsePrefixContext });
			if (result) {
				queuedFinal = result.ok;
				if (state.isRoutedReplyDelivered(result)) routedFinalCount += 1;
				if (!result.ok) logVerbose(`dispatch-from-config: route-reply (${fast.logKind}) failed: ${result.error ?? "unknown error"}`);
			} else {
				state.markInboundDedupeReplayUnsafe();
				params.replyOptions?.onModelSelected?.(modelSelection);
				queuedFinal = dispatcher.sendFinalReply(fast.payload);
			}
		} else if (suppressDelivery) logVerbose(`dispatch-from-config: ${fast.logKind} reply suppressed by ${deliverySuppressionReason} (session=${sessionKey ?? "unknown"})`);
		const counts = dispatcher.getQueuedCounts();
		counts.final += routedFinalCount;
		recordProcessed("completed", { reason: fast.reason });
		markIdle("message_completed");
		commitInboundDedupeIfClaimed();
		completeDispatchReplyOperation();
		return {
			status: "complete",
			result: attachSourceReplyDeliveryMode({
				queuedFinal,
				counts
			})
		};
	};
	const fastAbort = await fastAbortResolver({
		ctx,
		cfg,
		isCommandTargetCurrent: params.replyOptions?.isCommandTargetCurrent
	});
	if (fastAbort.handled) {
		if (fastAbort.aborted || (fastAbort.stoppedSubagents ?? 0) > 0) state.markInboundDedupeReplayUnsafe();
		return await finishFastCommand({
			payload: { text: formatAbortReplyTextResolver(fastAbort.stoppedSubagents, fastAbort.rejectionReason, fastAbort.failedSubagents) },
			reason: "fast_abort",
			logKind: "fast_abort"
		});
	}
	if (/^\s*\/approve(?:@[^\s]+)?(?:\s|$)/i.test(ctx.commandText)) {
		const fastApprove = await (await loadFastApproveRuntime()).tryFastApproveFromMessage({
			ctx,
			cfg,
			agentId: sessionAgentId,
			sessionKey
		});
		if (fastApprove.handled) return await finishFastCommand({
			...fastApprove.reply ? { payload: fastApprove.reply } : {},
			reason: "before_dispatch_handled",
			logKind: "fast_approve"
		});
	}
	const admissionTicket = params.replyOptions?.[REPLY_ADMISSION_TICKET];
	if (!state.activeRunSafeCommandTurn && admissionTicket && !await admissionTicket.wait(params.replyOptions?.abortSignal)) return {
		status: "complete",
		result: finishReplyOperationAbortedDispatch()
	};
	const assertCurrentBindingRoute = async () => {
		if (ctx.InternalTurnSource === void 0 && readConversationBindingRouteFacts(ctx)) {
			await assertPreparedConversationBindingRouteCurrent(ctx);
			if (isPreDispatchOperationAborted()) throw new DispatchReplyOperationAbortedError();
		}
	};
	await assertCurrentBindingRoute();
	const preDispatchAcquisition = await state.ensureDispatchReplyOperation("pre_dispatch", Boolean(pluginOwnedBinding));
	if (preDispatchAcquisition.status === "aborted") return {
		status: "complete",
		result: finishReplyOperationAbortedDispatch()
	};
	if (preDispatchAcquisition.status === "busy") return {
		status: "complete",
		result: state.finishReplyOperationBusyDispatch({ dedupeDisposition: "release" })
	};
	const finishPluginBindingDispatch = async (outcome) => {
		if (await turnLedger.settleQueued(state.getPreDispatchAbortSignal()) === "aborted" || isPreDispatchOperationAborted()) return {
			status: "complete",
			result: finishReplyOperationAbortedDispatch()
		};
		markIdle(outcome === "handled" ? "plugin_binding_dispatch" : `plugin_binding_${outcome}`);
		recordProcessed("completed", { reason: `plugin-bound-${outcome}` });
		commitInboundDedupeIfClaimed();
		completeDispatchReplyOperation();
		return {
			status: "complete",
			result: attachSourceReplyDeliveryMode({
				queuedFinal: false,
				counts: dispatcher.getQueuedCounts(),
				...turnLedger.hasObservedDelivery() ? { observedReplyDelivery: true } : {}
			})
		};
	};
	if (pluginOwnedBinding) {
		if (isPreDispatchOperationAborted()) return {
			status: "complete",
			result: finishReplyOperationAbortedDispatch()
		};
		await getSessionBindingService().touchAsync(pluginOwnedBinding.bindingId, void 0, pluginOwnedBinding);
		const currentBinding = await getSessionBindingService().resolveByConversationAsync(pluginOwnedBinding);
		if (currentBinding?.bindingId !== pluginOwnedBinding.bindingId || currentBinding.boundAt !== pluginOwnedBinding.boundAt || currentBinding.targetSessionKey !== state.pluginBindingSessionKey || currentBinding.targetKind !== state.pluginBindingTargetKind || currentBinding.metadata?.pluginBindingOwner !== "plugin" || currentBinding.metadata?.pluginId !== pluginOwnedBinding.pluginId || currentBinding.metadata?.pluginRoot !== pluginOwnedBinding.pluginRoot) throw new DispatchSessionRefreshRequiredError(/* @__PURE__ */ new Error("conversation binding changed while recording activity"));
		if (isPreDispatchOperationAborted()) return {
			status: "complete",
			result: finishReplyOperationAbortedDispatch()
		};
		params.replyOptions ??= {};
		if (shouldBypassPluginOwnedBindingForCommand(ctx, cfg, params.replyOptions)) logVerbose(`plugin-bound inbound command escaped plugin binding (plugin=${pluginOwnedBinding.pluginId} session=${sessionKey ?? "unknown"}); falling through to command processing`);
		else if (state.sendPolicyDenied || suppressDelivery && !state.suppressAutomaticSourceDelivery) logVerbose(`plugin-bound inbound skipped under ${deliverySuppressionReason} (plugin=${pluginOwnedBinding.pluginId} session=${sessionKey ?? "unknown"}); falling through to suppressed agent processing`);
		else {
			logVerbose(`plugin-bound inbound routed to ${pluginOwnedBinding.pluginId} conversation=${pluginOwnedBinding.conversationId}`);
			const bindingAuthorization = resolveCommandAuthorization({
				ctx,
				cfg,
				commandAuthorized: ctx.CommandAuthorized
			});
			const targetedClaimOutcome = hookRunner?.runInboundClaimForPluginOutcome ? await (async () => {
				await runWithDispatchAbortSignal(state.getPreDispatchAbortSignal(), state.prepareHookMediaMetadata, state.trackDispatchLifecycleWork);
				if (isPreDispatchOperationAborted()) throw new DispatchReplyOperationAbortedError();
				const authorizedInboundClaimEvent = {
					...state.hookState.inboundClaimEvent,
					senderIsOwner: bindingAuthorization.senderIsOwner
				};
				return await state.runWithDispatchLifecycleAdmission(async () => await hookRunner.runInboundClaimForPluginOutcome(pluginOwnedBinding.pluginId, authorizedInboundClaimEvent, withClaimingHookAdmission({
					...state.hookState.inboundClaimContext,
					pluginBinding: pluginOwnedBinding
				}, assertCurrentBindingRoute)));
			})() : (() => {
				return getGlobalPluginRegistry()?.plugins.some((plugin) => plugin.id === pluginOwnedBinding.pluginId && plugin.status === "loaded") ?? false ? { status: "no_handler" } : { status: "missing_plugin" };
			})();
			if (isPreDispatchOperationAborted()) return {
				status: "complete",
				result: finishReplyOperationAbortedDispatch()
			};
			switch (targetedClaimOutcome.status) {
				case "handled": {
					const transcriptOwner = await persistPluginBindingUserTurn();
					if (targetedClaimOutcome.result.reply && state.shouldDeliverPluginBindingReply) await state.deliverBindingPayload(targetedClaimOutcome.result.reply, "terminal", transcriptOwner);
					return await finishPluginBindingDispatch("handled");
				}
				case "missing_plugin":
				case "no_handler":
					state.bindingState.pluginFallbackReason = targetedClaimOutcome.status === "missing_plugin" ? "plugin-bound-fallback-missing-plugin" : "plugin-bound-fallback-no-handler";
					if ((chatType === "group" || chatType === "channel") && ctx.WasMentioned === false && !state.explicitCommandTurnCtx && ctx.GroupRequireMention !== false) {
						markIdle("plugin_binding_fallback_unmentioned");
						recordProcessed("completed", { reason: state.bindingState.pluginFallbackReason });
						commitInboundDedupeIfClaimed();
						completeDispatchReplyOperation();
						return {
							status: "complete",
							result: attachSourceReplyDeliveryMode({
								queuedFinal: false,
								counts: dispatcher.getQueuedCounts()
							})
						};
					}
					if (!hasShownPluginBindingFallbackNotice(pluginOwnedBinding.bindingId, pluginOwnedBinding)) {
						if (await sendBindingNotice({ text: buildPluginBindingUnavailableText(pluginOwnedBinding) }, "additive")) markPluginBindingFallbackNoticeShown(pluginOwnedBinding.bindingId, pluginOwnedBinding);
					}
					break;
				case "declined": {
					const transcriptOwner = await persistPluginBindingUserTurn();
					await sendBindingNotice({ text: buildPluginBindingDeclinedText(pluginOwnedBinding) }, "terminal", transcriptOwner);
					return await finishPluginBindingDispatch("declined");
				}
				case "error": {
					const transcriptOwner = await persistPluginBindingUserTurn();
					logVerbose(`plugin-bound inbound claim failed for ${pluginOwnedBinding.pluginId}: ${targetedClaimOutcome.error}`);
					await sendBindingNotice({ text: buildPluginBindingErrorText(pluginOwnedBinding) }, "terminal", transcriptOwner);
					return await finishPluginBindingDispatch("error");
				}
			}
		}
	}
	emitMessageReceivedHooks();
	return {
		status: "ready",
		state: extendPreparedDispatchState(state, { assertCurrentBindingRoute })
	};
}
//#endregion
//#region src/auto-reply/reply/reply-turn-recovery-notice.ts
const MAX_RECOVERY_NOTICES = 1024;
const log = createSubsystemLogger("auto-reply/reply-turn-admission");
const notices = resolveGlobalSingleton(Symbol.for("openclaw.replyRestartRecoveryNotices"), () => ({ entries: /* @__PURE__ */ new Map() }), (state) => {
	state.unsubscribe?.();
	state.unsubscribe = void 0;
	state.entries.clear();
});
/** A rejected turn can report its recovery path without reopening the session. */
async function sendReplyRestartRecoveryNotice(params) {
	try {
		const entry = loadSessionStoreEntry({
			agentId: params.agentId,
			sessionKey: params.sessionKey,
			storePath: params.storePath,
			readConsistency: "latest"
		});
		const recovery = entry?.mainRestartRecovery;
		if (!entry || !recovery?.tombstone) return;
		const currentAcpSession = readAcpSessionEntry({
			cfg: params.cfg,
			agentId: params.agentId,
			sessionKey: params.sessionKey
		});
		if (isParentOwnedBackgroundAcpSession(currentAcpSession?.entry ? {
			...currentAcpSession.entry,
			acp: currentAcpSession.acp
		} : void 0) || resolveSendPolicy({
			cfg: params.cfg,
			entry,
			sessionKey: params.sessionKey,
			channel: params.channel,
			chatType: entry.chatType
		}) === "deny") return;
		notices.unsubscribe ??= onSessionIdentityMutation((mutation) => {
			const keys = /* @__PURE__ */ new Set([...mutation.previous.sessionKeys, ...mutation.kind === "delete" ? [] : mutation.current.sessionKeys]);
			for (const [key, notice] of notices.entries) if (notice.agentId === mutation.agentId && keys.has(notice.sessionKey)) notices.entries.delete(key);
		});
		const key = JSON.stringify([
			params.agentId,
			params.storePath,
			params.sessionKey
		]);
		const previous = notices.entries.get(key);
		if (previous?.sessionId === entry.sessionId && previous.cycleId === recovery.cycleId) return;
		notices.entries.delete(key);
		if (notices.entries.size >= MAX_RECOVERY_NOTICES) {
			const oldestKey = notices.entries.keys().next().value;
			if (oldestKey !== void 0) notices.entries.delete(oldestKey);
		}
		notices.entries.set(key, {
			agentId: params.agentId,
			sessionKey: params.sessionKey,
			sessionId: entry.sessionId,
			cycleId: recovery.cycleId
		});
		const hint = entry.modelSelectionLocked === true ? "Open it in WebChat and use Resume in new session." : "Use /reset or /new to start a replacement session.";
		if (!await params.deliver(`My session in this room ended during restart recovery. ${hint}`)) log.warn(`restart recovery notice delivery was not confirmed for session ${params.sessionKey}`);
	} catch (error) {
		log.warn(`failed to deliver restart recovery notice for session ${params.sessionKey}: ${String(error)}`);
	}
}
//#endregion
//#region src/auto-reply/reply/dispatch-from-config.ts
/** Main reply dispatch pipeline from finalized config/context to delivery payloads. */
/** Dispatches a reply from config, context, command handling, agent run, and delivery policy. */
async function dispatchReplyFromConfig(params) {
	return await dispatchReplyFromConfigWithQueuePolicy(params, false);
}
/** Low-level plugin dispatch must reach queue policy before waiting on the active reply owner. */
async function dispatchLowLevelChannelReplyFromConfig(params) {
	return await dispatchReplyFromConfigWithQueuePolicy(params, !getGroupThreadTurn());
}
async function dispatchReplyFromConfigWithQueuePolicy(params, allowActiveQueueResolution) {
	const ticket = reserveReplyAdmissionTicket([params.ctx.SessionKey, params.ctx.CommandTargetSessionKey]);
	const ticketedParams = ticket ? {
		...params,
		replyOptions: {
			...params.replyOptions,
			[REPLY_ADMISSION_TICKET]: ticket
		}
	} : params;
	const messageAuditTerminal = createInboundMessageAuditTerminal(params);
	let refreshedSessionSnapshot = false;
	try {
		while (true) try {
			const result = await dispatchReplyFromConfigInner(ticketedParams, messageAuditTerminal, allowActiveQueueResolution);
			messageAuditTerminal?.finishSuccess(result);
			return result;
		} catch (error) {
			if (error instanceof DispatchSessionRefreshRequiredError && !refreshedSessionSnapshot && params.replyOptions?.abortSignal?.aborted !== true) {
				refreshedSessionSnapshot = true;
				continue;
			}
			messageAuditTerminal?.finishError();
			throw error;
		}
	} finally {
		ticket?.release();
	}
}
async function dispatchReplyFromConfigInner(params, messageAuditTerminal, allowActiveQueueResolution) {
	const gathered = await gatherDispatchRequest(params, messageAuditTerminal, allowActiveQueueResolution);
	if (gathered.status === "complete") return gathered.result;
	return await withPluginRuntimeRegistryScope(gathered.state.pluginRegistry, async () => {
		const context = await prepareDispatchOperationContext((await prepareDispatchDelivery(gathered.state)).state);
		if (context.status === "complete") return context.result;
		const errorState = context.state;
		try {
			const operation = await prepareDispatchOperation(context.state);
			if (operation.status === "complete") return operation.result;
			const route = await chooseDispatchRoute(operation.state);
			if (route.status === "complete") return route.result;
			const executed = await executeDispatch((await prepareDispatchExecution(route.state)).state);
			if (executed.status === "complete") return executed.result;
			return (await finalizeDispatchAndAudit(executed.state)).result;
		} catch (err) {
			const { failDispatchReplyOperation, finishReplyOperationAbortedDispatch, inboundDedupeClaim, markIdle, recordAgentDispatchCompleted, recordProcessed } = errorState;
			if (isDispatchReplyOperationAbortedError(err)) return finishReplyOperationAbortedDispatch();
			if (inboundDedupeClaim.status === "claimed") {
				if (errorState.turnAdoptionState?.adopted || errorState.inboundDedupeReplayUnsafe) inboundDedupeClaim.commit();
				else inboundDedupeClaim.release();
			}
			if (err instanceof DispatchSessionRefreshRequiredError) markIdle("session_refresh");
			else {
				recordAgentDispatchCompleted("error", { error: String(err) });
				recordProcessed("error", { error: String(err) });
				markIdle("message_error");
			}
			failDispatchReplyOperation(err);
			if (err instanceof SessionRestartRecoveryTombstoneError && params.ctx.InboundAccessAuthorized === true && params.ctx.InboundEventKind !== "room_event" && params.ctx.InternalTurnSource === void 0 && classifySessionStateActor({ inputProvenance: params.ctx.InputProvenance }).actorType === "human" && !errorState.isInternalWebchatTurn && !errorState.sendPolicyDenied && !errorState.suppressAcpChildUserDelivery && params.replyOptions?.abortSignal?.aborted !== true && errorState.dispatchOperationSessionKey && errorState.operationSessionStoreEntry.storePath) await sendReplyRestartRecoveryNotice({
				agentId: errorState.operationSessionStoreEntry.agentId ?? errorState.sessionAgentId,
				cfg: errorState.cfg,
				channel: errorState.deliveryChannel,
				sessionKey: errorState.dispatchOperationSessionKey,
				storePath: errorState.operationSessionStoreEntry.storePath,
				deliver: async (text) => {
					const payload = {
						text,
						isError: true
					};
					const routed = await errorState.routeReplyToOriginating(payload, { mirror: false });
					if (routed) return errorState.isRoutedReplyDelivered(routed);
					if (!params.dispatcher.sendFinalReply(payload)) return false;
					const receipt = await params.dispatcher.waitForIdle();
					return receipt ? receipt.counts.final.delivered > 0 : false;
				}
			});
			throw err;
		}
	});
}
//#endregion
export { emitInboundMessageAuditTerminal as a, resetInboundDedupe as i, dispatchReplyFromConfig as n, resolveBoundAcpDispatchSessionKey as o, emitMessageReceivedHooks as r, DispatchSessionRefreshRequiredError as s, dispatchLowLevelChannelReplyFromConfig as t };
