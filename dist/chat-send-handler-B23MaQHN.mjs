import { g as isFutureDateTimestampMs } from "./number-coercion-CLj0HTDM.mjs";
import "./src-CZ2wJvNB.mjs";
import { t as expectDefined } from "./expect-lbe3Hgrh.mjs";
import { a as asOptionalRecord } from "./record-coerce-DItp3I4t.mjs";
import { t as stableStringify } from "./stable-stringify-CkQ0IEj1.mjs";
import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { t as createLazyImportLoader } from "./lazy-promise-DGqyc4Y4.mjs";
import { u as openLocalFileSafely } from "./fs-safe-BAPek8At.mjs";
import { t as createAbortError } from "./abort-signal-Z3A36sLL.mjs";
import { n as ok, t as err } from "./result-BQGgYouL.mjs";
import { n as normalizeAgentId } from "./agent-id-GA8mwdTG.mjs";
import { l as resolveAgentWorkspaceDir } from "./agent-scope-config-IQKOEtZ4.mjs";
import { r as isIncognitoSessionKey } from "./session-key-CUi_tcgF.mjs";
import { A as parseAgentSessionKey, D as resolveSessionDispatchKind, S as isSubagentSessionKey, m as scopeLegacySessionKeyToAgent, x as isCronSessionKey, y as isAcpSessionKey$1 } from "./session-key-CBvmC8zz.mjs";
import { _ as redactSensitiveText } from "./redact-B5EGyLvV.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { f as isDiagnosticsEnabled } from "./diagnostic-events-CVabF32H.mjs";
import { t as createSubsystemLogger } from "./subsystem-DleLyu58.mjs";
import { n as emitDiagnosticsTimelineEvent, o as measureDiagnosticsTimelineSpan, s as measureDiagnosticsTimelineSpanSync } from "./diagnostics-timeline-uuHa_36_.mjs";
import "./agent-runtime-id-9mBje111.mjs";
import "./agent-scope-CTuYDtny.mjs";
import { i as resolveProviderIdForAuth } from "./provider-auth-aliases-DKt99_dy.mjs";
import { i as logVerbose } from "./globals-QODkv80i.mjs";
import { t as KeyedAsyncQueue } from "./keyed-async-queue-CTreGrmR.mjs";
import { t as ADMIN_SCOPE } from "./operator-scopes-D-CL26h0.mjs";
import { a as hasGatewayClientCap, i as GATEWAY_CLIENT_NAMES, r as GATEWAY_CLIENT_MODES, t as GATEWAY_CLIENT_CAPS } from "./client-info-B_ICKCYw.mjs";
import { t as INTERNAL_MESSAGE_CHANNEL } from "./message-channel-constants-Cd7Eq8Zi.mjs";
import { n as normalizeMessageChannel } from "./message-channel-core-CxyiAx1U.mjs";
import { a as isInternalMessageChannel, i as isGatewayCliClient, l as isWebchatClient, n as isBrowserOperatorUiClient, s as isOperatorUiClient, t as isBrowserCopilotClient } from "./message-channel-DDcHHhpX.mjs";
import { a as loadOrCreateProcessDeviceIdentity } from "./device-identity-B_zMrBd6.mjs";
import { t as ErrorCodes } from "./gateway-error-details-D85F07e9.mjs";
import { Rg as readAgentRuntimeRestrictionErrorDetails, _h as formatValidationErrors, q as validateChatSendParams, zg as isCloudWorkerPlacementState } from "./src-BRUl7oDv.mjs";
import "./method-scopes-C7g7eSZh.mjs";
import { f as errorShape } from "./error-codes-DvB36bCj.mjs";
import "./sessions-KsldKmtI.mjs";
import { C as runWithGatewayIndependentRootWorkContinuation, g as retainGatewayRootWorkAdmissionContinuation } from "./gateway-work-admission-CHv_0noy.mjs";
import { a as clearAgentRunContext, c as getAgentRunContext, r as claimAgentRunContext } from "./agent-run-registry-DO6Dg2r0.mjs";
import { l as getAgentEventLifecycleGeneration, t as assertAgentRunLifecycleGenerationCurrent } from "./agent-events-BOSJcayE.mjs";
import { a as readSessionTranscriptRunId, r as onInternalSessionTranscriptUpdate } from "./transcript-events-DukKauix.mjs";
import { r as hasGlobalHooks, t as getGlobalHookRunner } from "./hook-runner-global-DlvY8FQy.mjs";
import { D as stripReplyMediaFailureFallback, T as setReplyPayloadMetadata, a as copyReplyPayloadMetadata, c as getReplyPayloadTtsSupplement, h as isReplyPayloadStatusNotice, i as buildTtsSupplementMediaPayload, m as isReplyPayloadSessionWriterDeliveryAuthorized, s as getReplyPayloadMetadata, v as isReplyPayloadTtsSupplement } from "./reply-payload-B2ZQhznY.mjs";
import { a as safeFileURLToPath, t as assertNoWindowsNetworkPath } from "./local-file-access-B6bU8SNO.mjs";
import { t as normalizeMediaReferenceForComparison } from "./media-reference-comparison-DeX5XiDx.mjs";
import { t as collectReplyMediaEntries } from "./reply-media-entries-BifhlC95.mjs";
import { c as runWithOwnedSessionTranscriptWrite, i as captureOwnedTranscriptWriteAssertion, t as SessionTranscriptWriterClaimReboundError } from "./transcript-write-context-MlBhwaKa.mjs";
import { o as resolveSessionRoutingContract, r as resolveAgentMainSessionKey, t as SESSION_ROUTING_CHANGED_ERROR_REASON } from "./main-session-De-bcoks.mjs";
import { i as resolveCommandAuthorization } from "./command-auth-2PSSAYYJ.mjs";
import { i as prepareSessionParticipantInput } from "./host-context-builder-DDDipgdC.mjs";
import { g as resolveOperatorSessionCreation, l as resolveCreatorSandbox, n as authorizeGatewaySessionCreation } from "./operator-role-policy-BNrKHiJ3.mjs";
import "./channel-outbound-Bk5sWC85.mjs";
import { n as getRegisteredAgentHarness } from "./registry-aYyey5ds.mjs";
import { a as isAgentHarnessSessionKey, m as resolveMissingAgentHarnessSessionError } from "./agent-harness-session-key-CQ6tTBOH.mjs";
import { o as resolveEffectiveAgentRuntime } from "./thinking-runtime-Dvszh-e-.mjs";
import { o as isAudioFileName, u as mimeTypeFromFilePath } from "./mime-1zBUMwu6.mjs";
import { d as readPersistedMediaFacts } from "./media-facts-BEHTU0wM.mjs";
import { i as getAgentWorkspaceAccess } from "./workspace-access-BNUXOhfF.mjs";
import { n as estimateBase64DecodedBytes } from "./base64-B5EyWEOm.mjs";
import { n as sessionDeliveryChannel, r as sessionDeliveryOrigin, t as deliveryContextFromSession } from "./delivery-context.read-CR06zOJ4.mjs";
import { o as waitForSessionTranscriptProjection } from "./session-transcript-reconcile-Cef06Gbk.mjs";
import { n as buildSessionCreationStamp } from "./session-entry-provenance-C-JyMH54.mjs";
import { Z as getSessionRepositoryWorkspaceStore } from "./session-accessor.sqlite-entry-store-BU493wVJ.mjs";
import { f as interruptSessionWorkAdmissions, n as beginSessionWorkAdmission, p as isCompetingSessionWorkAdmissionActive } from "./session-lifecycle-admission-Pys9TN37.mjs";
import { i as classifyAgentRunTerminalOutcome } from "./agent-run-terminal-outcome-CgoAW2Q7.mjs";
import { r as isSessionTranscriptProjectionUnavailableError } from "./session-transcript-projection-error-CuzwVnKb.mjs";
import { j as recordAssistantManagedMediaUrls, k as applyAssistantDeliveryDirectives, s as loadTranscriptEventRowsAfterSeqSync } from "./session-accessor.sqlite-read-BzN7WYll.mjs";
import { n as extractAssistantTextForPhase, s as readAssistantTextBlocksForPhase, t as extractAssistantPhaseText } from "./chat-message-content-D14VlZZc.mjs";
import { a as sanitizeReplyDirectiveId, n as parseInlineDirectives, s as stripInlineDirectiveTagsForDelivery } from "./directive-tags-D9uZSb5h.mjs";
import { n as readActiveTranscriptEntryAnchor } from "./session-accessor.sqlite-transcript-anchor-B0dOIy5w.mjs";
import { d as patchSessionEntryCore, s as loadSessionEntry } from "./session-accessor.sqlite-entry-BB2Zsfho.mjs";
import { n as loadExactSessionEntryCandidates } from "./session-accessor.sqlite-exact-read-Dk6_8wqr.mjs";
import { D as rewriteTranscriptMessageAtAnchor, _ as lookupSessionGoalOperation, et as readSessionSubmittedInput, g as SessionGoalOperationError, l as readSessionTranscriptWatermark, m as buildRestartRecoveryExpectedState, rt as normalizeMessageClientSources } from "./session-accessor-l-4ZHvKn.mjs";
import { a as tryResolveSessionCompatibilityOwnerAgentId, n as resolveRequestedSessionAgentId } from "./session-request-agent-DN7PUqhR.mjs";
import { l as updateSessionEntry } from "./session-accessor.reset-0gTJAhVB.mjs";
import { n as formatChatWorkContext, t as captureChatWorkContext } from "./work-context-CdqkpY8G.mjs";
import { a as hasRestartRecoveryTerminalRun, t as buildRestartRecoveryClaimCleanupPatch } from "./restart-recovery-state-CVOwSXMV.mjs";
import { n as resolveSessionTranscriptDatabasePath } from "./session-accessor.transcript-target-w5-iuMeM.mjs";
import { a as readSessionTranscriptActivePathEntryRelation } from "./session-accessor.sqlite-active-events-Cnt-hBim.mjs";
import "./agent-run-terminal-outcome-Dto4EMdr.mjs";
import { l as isAgentRunDirectAbortReason, o as createAgentRunRestartAbortError, u as isAgentRunRestartAbortReason } from "./run-termination-Cd1iJzC7.mjs";
import { t as isPassThroughRemoteMediaSource } from "./media-source-url-BL9SUd7E.mjs";
import { g as renderFailoverCodeUserCopy } from "./user-copy-DfLWtdTx.mjs";
import { n as extractTextFromChatContent } from "./chat-content-DNdfeXZh.mjs";
import { l as sanitizeAssistantVisibleTextWithProfile } from "./assistant-visible-text-CVgfl6Gk.mjs";
import { t as renderAgentHarnessPreflightUserMessage } from "./user-facing-text-D8c_iKUB.mjs";
import { n as isInternalSourceReplyChannel } from "./source-reply-delivery-mode-CuFZyg4U.mjs";
import { g as progressCardRefreshRunProjection, h as normalizeInputProvenance, p as isProgressCardRefreshInputProvenance } from "./input-provenance-C4tQegGN.mjs";
import { t as getSessionBindingService } from "./session-binding-service-n2QTfkUE.mjs";
import { n as isPluginOwnedSessionBindingRecord } from "./conversation-binding-metadata-CFOhDjMh.mjs";
import { i as resolveTextCommand } from "./commands-registry-normalize-DJeLLZwD.mjs";
import { a as shouldComputeCommandAuthorized } from "./command-detection-CBYe7EC-.mjs";
import { n as resolveAgentTimeoutMs } from "./timeout-Bjg7ga80.mjs";
import { n as createMessageInjectionAuthority } from "./message-injection-authority-CJuS3j6I.mjs";
import { W as REPLY_RUN_IDLE_SETTLE_TIMEOUT_MS, _ as isReplyRunAbortableForSignal } from "./reply-run-registry.state-C5EjI8Kf.mjs";
import { E as finalizeReplyMessageInjectionAttempt, T as beginReplyMessageInjectionTarget, c as interruptReplyRunTarget, h as replyRunRegistry } from "./reply-run-registry.registry-QRh9NCRy.mjs";
import "./reply-run-registry-D1FEEbJ6.mjs";
import { a as logMessageReceived, r as logMessageProcessed } from "./diagnostic-CT1lx7JC.mjs";
import { n as listActiveEmbeddedRunSessionIds } from "./active-run-projections-BHX_SDCX.mjs";
import "./sessions-DE4llkPV.mjs";
import { b as retireProviderReviewAcknowledgment, d as resolveSessionWorkStartError, v as readProviderReviewAcknowledgment } from "./lifecycle-WWQJH57y.mjs";
import { n as resolveSessionResetType, t as resolveChannelResetConfig } from "./reset-DqhvvJAq.mjs";
import { t as ASSISTANT_DISPLAY_CONTENT_FIELD } from "./assistant-display-content-DotKkoz0.mjs";
import { t as finalizeInboundContext } from "./inbound-context-BLR5MPPS.mjs";
import { n as splitMediaFromOutput } from "./reply-directives-CeJbvk_b.mjs";
import { n as createStructuredOutboundPayloadPlan } from "./payloads-Ce1fWBq6.mjs";
import { a as resolveSendableOutboundReplyParts } from "./reply-payload-parts-G378iYNJ.mjs";
import "./reply-payload-RBmrGrXG.mjs";
import { r as resolveSessionPermissionCoreToolPolicy } from "./session-permission-exec-mode-Bn0mEuts.mjs";
import { n as resolveEffectiveToolFsWorkspaceOnly } from "./tool-fs-policy-DkN5in9o.mjs";
import { i as withChannelReadAuthority, t as captureChannelReadAuthority } from "./channel-read-authority-CLJnqxr1.mjs";
import { n as getAgentScopedMediaLocalRoots, t as appendLocalMediaParentRoots } from "./local-roots-CfRBR4Iu.mjs";
import { s as getMediaDir } from "./store-CqRcb7T5.mjs";
import { a as parseInboundMediaUri } from "./media-reference-CtGDBk0x.mjs";
import { n as LocalMediaAccessError, r as assertLocalMediaAllowed } from "./local-media-access-Cxmjo_Ju.mjs";
import { t as resolveAgentScopedOutboundMediaAccess } from "./read-capability-UK6nXoD0.mjs";
import "./commands-registry-Dw3-bHwm.mjs";
import { n as readAgentRunTerminalOutcome } from "./agent-run-terminal-outcome-gv15pQgO.mjs";
import { i as dispatchInboundMessageWithProjectedDispatcher } from "./dispatch-0xqXE-dj.mjs";
import { a as emitInboundMessageAuditTerminal, r as emitMessageReceivedHooks, s as DispatchSessionRefreshRequiredError } from "./dispatch-from-config-k8_-egoI.mjs";
import { i as describeFailoverError } from "./failover-error-C3SnWYBJ.mjs";
import { n as resolveSessionEntryResetFreshness } from "./entry-freshness-Dc7kHh6j.mjs";
import { o as isMainSessionRecoveryReconciliationCandidate } from "./main-session-recovery-state-BUCSyc7s.mjs";
import { i as buildRunUserTurnIdempotencyKey } from "./user-turn-transcript.metadata-BY4PdwgQ.mjs";
import { n as runAgentHarnessBeforeMessageWriteHook } from "./hook-helpers-BzSlbw21.mjs";
import { t as hasInboundAudio } from "./inbound-media-CetKPfK2.mjs";
import { n as resolveSendPolicy } from "./send-policy-DZ8_Ozhd.mjs";
import { t as createUserTurnTranscriptRecorder } from "./user-turn-transcript-Cqq1jlt5.mjs";
import { t as boundedWorkerError } from "./worker-error-Bd42UcqN.mjs";
import { t as resolveSessionWorkerPlacementContext } from "./session-worker-placement-context-BLRgDgSo.mjs";
import { n as resolveSessionModelRef } from "./session-model-ref-Z1HiwFXK.mjs";
import { a as isChatStopCommandText, f as updateChatRunProvider, i as isChatAbortControllerEntryAbortable, s as registerChatAbortController, u as resolveChatRunExpiresAtMs } from "./chat-abort-D7PkkSq8.mjs";
import { n as appendChatCanvasBlocksToMessage, o as isToolHistoryBlockType } from "./chat-display-projection.canvas-C78Q4iVY.mjs";
import { n as isSuppressedControlReplyText } from "./control-reply-text-CDvIm13S.mjs";
import { n as chatRunBelongsToSelectedAgent, r as resolveChatRunOwnerAgentId } from "./chat-run-owner-HbcABEVb.mjs";
import { t as chatAbortMarkerTimestampMs } from "./server-chat-state-DfVYc1CX.mjs";
import { a as registerQueuedChatTurn, o as retireQueuedChatTurnCancellation, r as completeQueuedChatTurn } from "./chat-queued-turns-D5_b93Ci.mjs";
import { t as recordGatewaySessionRunFailure } from "./session-run-error-HnadOxy-.mjs";
import { a as resolveGatewaySessionStoreTarget } from "./session-utils-store-lookup-EioWBMfl.mjs";
import { o as resolveAssistantIdentity } from "./assistant-avatar-D6yA4rZS.mjs";
import { r as resolveGatewayModelSupportsImages } from "./session-utils-model-Bv9Ac0tS.mjs";
import { l as resolveDeletedAgentIdFromSessionKey, r as loadGatewaySessionEntry } from "./session-utils-store-DDuAGjCc.mjs";
import { o as hasPendingFollowupQueueWork } from "./state-B1aZH2hx.mjs";
import { $ as gatewayClientSenderFields, et as gatewayClientSessionCreator, nt as resolveChatSendCallerContext, t as resolveSessionMutationAuthorization } from "./session-sharing-C4w_but1.mjs";
import { r as hasTrackedActiveSessionRun } from "./session-active-runs-KvOWXexj.mjs";
import { t as SessionMutationAuthorizationChangedError } from "./session-mutation-authorization-error-CCz8QGWh.mjs";
import { t as ExpectedProfileMismatchError } from "./expected-profile-CDW-SY1d.mjs";
import "./session-utils-CJ7A982R.mjs";
import { n as readSessionMessageByIdAsync } from "./session-transcript-readers-Bmg2Zjrq.mjs";
import { a as resolveEnvelopeFormatOptions } from "./envelope-Bh9h9lS4.mjs";
import { t as assertPreparedSkillLibrarySelection } from "./selection-Y3a9jWK1.mjs";
import { t as buildInboundMediaNoteProjection } from "./media-note-CZLRM5qk.mjs";
import { i as isRestartRecoveryTerminalDeliveryFailClosed } from "./restart-recovery-receipt-BVd0-uYN.mjs";
import { r as resolveInboundReplyToolAuthorityOverlay } from "./reply-tool-authority-3V_rCqU6.mjs";
import { t as resolveQueueSettings } from "./queue-BpCLKp2c.mjs";
import { t as recordSessionCreated } from "./session-created-CtPFddEb.mjs";
import { i as projectChatDisplayMessage } from "./chat-display-projection.core-x-JzVWZh.mjs";
import "./chat-display-projection-BuAz8rxu.mjs";
import { n as buildInboundUserContextPrefix } from "./inbound-meta-BTWrQLsF.mjs";
import { t as recordAcceptedSessionParticipantInput } from "./session-participant-input-recording-D-925dJj.mjs";
import { n as isBtwRequestText } from "./btw-command-DISNyxnk.mjs";
import { t as createChannelReplyPipeline } from "./reply-pipeline-i3g0Dbwp.mjs";
import { r as githubApiToken } from "./github-public-api-GYcLjPMx.mjs";
import { t as formatForLog } from "./ws-log-DGu5Y--9.mjs";
import { n as resolveChatAttachmentMaxBytes } from "./chat-attachment-policy-3-T7Wh4j.mjs";
import { t as emitAgentRunStatusEvent } from "./agent-run-status-events-CxQDXWoO.mjs";
import { h as resolveProjectDirectory } from "./project-registry-CT4rCnL9.mjs";
import { n as resolveExplicitSessionName, t as hasExplicitSessionName } from "./session-title-state-BQCPqYS_.mjs";
import { a as buildManagedMediaFailureBlock, d as prepareOutgoingMediaFromReplyPayload, i as attachManagedOutgoingMediaToMessage, p as removeManagedOutgoingMediaBlocks, s as createManagedOutgoingMediaBlocks } from "./managed-image-attachments-esuKWCel.mjs";
import { a as hasAssistantDisplayMediaContent, c as isMediaBearingPayload, d as stripManagedOutgoingAssistantContentBlocks, i as extractAssistantDisplayText, l as prepareAssistantDisplayText, n as buildAssistantReplyContentFromInputs, o as hasManagedOutgoingAssistantContent, r as combineNonStreamingReplyParts, s as hasVisibleAssistantFinalMessage, u as sanitizeAssistantDisplayText } from "./chat-assistant-content-D3mKi3AD.mjs";
import { r as setGatewayDedupeEntry, t as captureAgentJobSession } from "./agent-job-VGCbW4db.mjs";
import { a as discardPreparedInboundMedia, c as persistInboundImagesForTranscript, i as UnsupportedAttachmentError, l as stripImageMediaMarkers, n as INLINE_IMAGE_DURABLE_OMISSION_MARKER, o as logAttachmentFailure, r as MediaOffloadError, s as parseMessageWithAttachments, t as normalizeRpcAttachmentsToChatAttachments } from "./attachment-normalize-Dir1b2pS.mjs";
import { i as persistGatewaySessionLifecycleEvent, n as deriveGatewaySessionLifecycleSnapshot } from "./session-event-payload-ErYjRK47.mjs";
import { r as emitSessionsChanged } from "./session-change-event-DF8JnIsM.mjs";
import { a as prepareSkillLibrarySessionCreation, i as retainGatewayOperatorRun, n as prepareGatewaySkillAuthoring, r as resolveGatewayInputParticipant, t as invalidateSkillAuthoringForOtherRequester } from "./skill-library-authoring-CN_0DVjD.mjs";
import { t as createChatAbortOps } from "./chat-abort-ops-lFr576Vk.mjs";
import { t as resolveSessionWorkspaceRoots } from "./session-workspace-roots-CdOvbmSU.mjs";
import { a as shouldIncludeChatSendAckServerTiming, i as roundedChatSendTimingMs, n as emitOperatorChatSendServerTiming, r as resolveControlUiReconnectResumeParams, t as chatSendAckServerTimingAttributes } from "./chat-server-timing-CzkBjoy4.mjs";
import { n as pendingChatSendDedupeKey, t as PENDING_CHAT_SEND_DEDUPE_PREFIX } from "./server-shared-C-7Ahu3n.mjs";
import { r as hasActiveAgentRuntimeAuthority } from "./agent-runtime-authority--ezHAh8Z.mjs";
import { n as normalizeUnknownChatText, t as normalizeOptionalChatText } from "./chat-text-normalization-HsVzW9xs.mjs";
import { a as descendantAbortError, d as readPreRegisteredRun, f as resolveChatAbortRequester, m as writePreRegisteredChatAbort, o as buildAbortedChatSendPayload, t as abortChatRunsForSessionKeyWithPartials } from "./chat-abort-runtime-BY_P9k1b.mjs";
import { a as publishAssistantTranscriptRewrite, c as rewriteSourceReplyTranscriptMirrors, n as assistantTranscriptScope, o as rewriteAssistantTranscriptMessageByIdempotencyKey, s as rewriteAssistantTranscriptMessageByTurnIndexAndMedia, t as appendAssistantTranscriptMessage } from "./chat-transcript-persistence-D3pOEA4v.mjs";
import { a as broadcastSideResult, i as broadcastChatTerminal, n as broadcastChatError, o as isBtwReplyPayload, r as broadcastChatFinal, s as isSourceReplyTranscriptMirrorPayload, t as broadcastChatDelta, u as sanitizeChatSendMessageInput } from "./chat-broadcast-DSE0pN9p.mjs";
import { i as maybeGenerateDashboardSessionTitle, n as generateWorktreeSessionTitle, r as isDashboardSessionTitleCandidate, t as buildDashboardSessionTitleSource } from "./dashboard-session-title-Dfgz25-G.mjs";
import { t as captureGatewayUiCommandTarget } from "./ui-command-target-BjxTvhuM.mjs";
import { n as refreshProjectClone, t as materializeProjectClone } from "./project-clone-5R1HzM6y.mjs";
import { t as parseProjectGitUrl } from "./project-git-url-D2byNTeD.mjs";
import { t as prepareSessionCreateFilesystemRoot } from "./session-create-root-DONGPA9n.mjs";
import { r as resolveSessionWorktreeBase, t as prepareSessionWorktree } from "./session-worktree-preparation-UPe9S0T9.mjs";
import { i as resolveSessionNativeRuntimeRestriction, o as normalizeSessionToolOverrides, s as sessionToolOverridesEqual } from "./sessions-patch-model-selection-DzMOxpbM.mjs";
import { n as fingerprintSessionGoalRequest, t as publishCommittedSessionGoalChange } from "./session-goal-change-Cbm_MaN3.mjs";
import { isDeepStrictEqual } from "node:util";
import path from "node:path";
import { createHash, createHmac, randomUUID } from "node:crypto";
import { performance } from "node:perf_hooks";
//#region src/plugins/restart-recovery-hook-safety.ts
const RESTART_RECOVERY_UNSAFE_CHAT_ADMISSION_HOOKS = [
	"before_dispatch",
	"before_agent_run",
	"before_message_write",
	"reply_dispatch"
];
/** Initial chat admission defers before_agent_reply until after its durable checkpoint. */
function findRestartRecoveryUnsafeChatAdmissionHook(dispatchKind) {
	return RESTART_RECOVERY_UNSAFE_CHAT_ADMISSION_HOOKS.find((hookName) => hookName === "reply_dispatch" ? hasGlobalHooks(hookName, { dispatchKind }) : hasGlobalHooks(hookName));
}
//#endregion
//#region src/gateway/server-methods/chat-origin-routing.ts
const CHANNEL_AGNOSTIC_SESSION_SCOPES = /* @__PURE__ */ new Set([
	"main",
	"direct",
	"dm",
	"group",
	"channel",
	"cron",
	"run",
	"subagent",
	"acp",
	"thread",
	"topic"
]);
const CHANNEL_SCOPED_SESSION_SHAPES = /* @__PURE__ */ new Set([
	"direct",
	"dm",
	"group",
	"channel"
]);
function normalizeExplicitChatSendOrigin(params) {
	const originatingChannel = normalizeOptionalChatText(params.originatingChannel);
	const originatingTo = normalizeOptionalChatText(params.originatingTo);
	const accountId = normalizeOptionalChatText(params.accountId);
	const messageThreadId = normalizeOptionalChatText(params.messageThreadId);
	if (!Boolean(originatingChannel || originatingTo || accountId || messageThreadId)) return { ok: true };
	const normalizedChannel = normalizeMessageChannel(originatingChannel);
	if (!normalizedChannel) return {
		ok: false,
		error: "originatingChannel is required when using originating route fields"
	};
	if (!originatingTo) return {
		ok: false,
		error: "originatingTo is required when using originating route fields"
	};
	return {
		ok: true,
		value: {
			originatingChannel: normalizedChannel,
			originatingTo,
			...accountId ? { accountId } : {},
			...messageThreadId ? { messageThreadId } : {}
		}
	};
}
function resolveChatSendActiveScopeKey(params) {
	if (parseAgentSessionKey(params.sessionKey) || !params.agentId) return params.sessionKey;
	return scopeLegacySessionKeyToAgent({
		agentId: params.agentId,
		sessionKey: params.sessionKey,
		mainKey: params.mainKey
	}) ?? params.sessionKey;
}
function resolveChatSendOriginatingRoute(params) {
	if (params.explicitOrigin?.originatingChannel && params.explicitOrigin.originatingTo) return {
		originatingChannel: params.explicitOrigin.originatingChannel,
		originatingTo: params.explicitOrigin.originatingTo,
		...params.explicitOrigin.accountId ? { accountId: params.explicitOrigin.accountId } : {},
		...params.explicitOrigin.messageThreadId ? { messageThreadId: params.explicitOrigin.messageThreadId } : {},
		explicitDeliverRoute: params.deliver === true
	};
	const internalRoute = {
		originatingChannel: INTERNAL_MESSAGE_CHANNEL,
		originatingTo: params.sessionKey,
		explicitDeliverRoute: false
	};
	if (params.deliver !== true) return internalRoute;
	const sessionDeliveryContext = deliveryContextFromSession(params.entry);
	const sessionOrigin = sessionDeliveryOrigin(params.entry);
	const routeChannelCandidate = normalizeMessageChannel(sessionDeliveryContext?.channel ?? sessionOrigin?.provider);
	const routeToCandidate = sessionDeliveryContext?.to;
	const routeAccountIdCandidate = sessionDeliveryContext?.accountId ?? sessionOrigin?.accountId;
	const routeThreadIdCandidate = sessionDeliveryContext?.threadId ?? sessionOrigin?.threadId;
	if (params.sessionKey.length > 512) return internalRoute;
	const sessionScopeParts = (parseAgentSessionKey(params.sessionKey)?.rest ?? params.sessionKey).split(":", 3).filter(Boolean);
	const sessionScopeHead = sessionScopeParts[0];
	const sessionChannelHint = normalizeMessageChannel(sessionScopeHead);
	const normalizedSessionScopeHead = (sessionScopeHead ?? "").trim().toLowerCase();
	const sessionPeerShapeCandidates = [sessionScopeParts[1], sessionScopeParts[2]].map((part) => (part ?? "").trim().toLowerCase()).filter(Boolean);
	const isChannelAgnosticSessionScope = CHANNEL_AGNOSTIC_SESSION_SCOPES.has(normalizedSessionScopeHead);
	const isChannelScopedSession = sessionPeerShapeCandidates.some((part) => CHANNEL_SCOPED_SESSION_SHAPES.has(part));
	const hasLegacyChannelPeerShape = !isChannelScopedSession && typeof sessionScopeParts[1] === "string" && sessionChannelHint === routeChannelCandidate;
	const isFromWebchatClient = isWebchatClient(params.client);
	const isFromGatewayCliClient = isGatewayCliClient(params.client);
	const hasClientMetadata = typeof params.client?.mode === "string" && params.client.mode.trim().length > 0 || typeof params.client?.id === "string" && params.client.id.trim().length > 0;
	const configuredMainKey = (params.mainKey ?? "main").trim().toLowerCase();
	const canInheritConfiguredMainRoute = normalizedSessionScopeHead.length > 0 && normalizedSessionScopeHead === configuredMainKey && params.hasConnectedClient && (isFromGatewayCliClient || !hasClientMetadata);
	if (!(Boolean(!isFromWebchatClient && sessionChannelHint && sessionChannelHint !== "webchat" && (!isChannelAgnosticSessionScope && (isChannelScopedSession || hasLegacyChannelPeerShape) || canInheritConfiguredMainRoute)) && routeChannelCandidate && routeChannelCandidate !== "webchat" && typeof routeToCandidate === "string" && routeToCandidate.trim().length > 0)) return internalRoute;
	return {
		originatingChannel: routeChannelCandidate,
		originatingTo: routeToCandidate,
		accountId: routeAccountIdCandidate,
		messageThreadId: routeThreadIdCandidate,
		explicitDeliverRoute: true
	};
}
function isAcpSessionKey(sessionKey) {
	return Boolean(sessionKey?.split(":").includes("acp"));
}
function explicitOriginTargetsAcpSession(origin) {
	if (!origin?.originatingChannel || !origin.originatingTo || !origin.accountId) return false;
	const channel = normalizeMessageChannel(origin.originatingChannel);
	if (!channel || channel === "webchat") return false;
	return isAcpSessionKey(getSessionBindingService().resolveByConversation({
		channel,
		accountId: origin.accountId,
		conversationId: origin.originatingTo
	})?.targetSessionKey);
}
function explicitOriginTargetsPluginBinding(origin) {
	if (!origin?.originatingChannel || !origin.originatingTo || !origin.accountId) return false;
	const channel = normalizeMessageChannel(origin.originatingChannel);
	if (!channel || channel === "webchat") return false;
	const binding = getSessionBindingService().resolveByConversation({
		channel,
		accountId: origin.accountId,
		conversationId: origin.originatingTo
	});
	return isPluginOwnedSessionBindingRecord(binding);
}
function normalizeOptionalChatSystemReceipt(value) {
	if (value == null) return { ok: true };
	if (typeof value !== "string") return {
		ok: false,
		error: "systemProvenanceReceipt must be a string"
	};
	const sanitized = sanitizeChatSendMessageInput(value);
	if (!sanitized.ok) return sanitized;
	return {
		ok: true,
		receipt: sanitized.message.trim() || void 0
	};
}
function isAcpBridgeClient(client) {
	const info = client?.connect?.client;
	return info?.id === GATEWAY_CLIENT_NAMES.CLI && info?.mode === GATEWAY_CLIENT_MODES.CLI && info?.displayName === "ACP" && info?.version === "acp";
}
function hasGatewayAdminScope(client) {
	return (Array.isArray(client?.connect?.scopes) ? client.connect.scopes : []).includes(ADMIN_SCOPE);
}
//#endregion
//#region src/gateway/server-methods/chat-restart-recovery.ts
const RESTART_SAFE_CHAT_REQUEST_VERIFIER_DOMAIN = "openclaw.chat.restart-retry.v1";
const log = createSubsystemLogger("gateway/restart-recovery");
function hasRestartUnsafeMessageSemantics(rawMessage, cfg) {
	if (shouldComputeCommandAuthorized(rawMessage, cfg) || rawMessage.startsWith("/") || rawMessage.startsWith("!")) return true;
	const directives = parseInlineDirectives(rawMessage, {
		stripAudioTag: false,
		stripReplyTags: false
	});
	return directives.hasAudioTag || directives.hasReplyTag;
}
function fingerprintRestartSafeChatRequest(params) {
	const identity = loadOrCreateProcessDeviceIdentity();
	const digest = createHmac("sha256", identity.privateKeyPem).update(JSON.stringify([
		RESTART_SAFE_CHAT_REQUEST_VERIFIER_DOMAIN,
		params.message,
		params.senderIsOwner,
		...params.mentions?.length ? [params.mentions.map(({ profileId, start, end }) => [
			profileId,
			start,
			end
		])] : []
	])).digest("hex");
	return `hmac-sha256:v1:${identity.deviceId}:${digest}`;
}
function createRestartSafeChatRequest(params) {
	if (params.goalRequestFingerprint) return { fingerprint: params.goalRequestFingerprint };
	if (!params.eligible || hasRestartUnsafeMessageSemantics(params.message, params.cfg)) return;
	return { fingerprint: fingerprintRestartSafeChatRequest(params) };
}
function isRetryableUnadoptedChatClaim(entry, clientRunId) {
	return Boolean(entry && entry.abortedLastRun !== true && (entry.status === "failed" || entry.status === "killed") && entry.restartRecoveryDeliveryContext === void 0 && entry.restartRecoveryDeliveryRunId === clientRunId && entry.restartRecoveryDeliverySourceRunId === clientRunId && entry.restartRecoveryDeliveryRequestFingerprint);
}
function isAdoptedRestartRecoveryClaim(entry, clientRunId) {
	return Boolean(entry?.restartRecoveryDeliveryRunId && entry.restartRecoveryDeliverySourceRunId === clientRunId && !isRetryableUnadoptedChatClaim(entry, clientRunId));
}
async function resolveDurableChatClaim(params) {
	let entry = params.entry;
	if (isAdoptedRestartRecoveryClaim(entry, params.clientRunId) && entry.status === "running" && entry.abortedLastRun === true) {
		const recoverySessionError = resolveSessionWorkStartError(params.canonicalSessionKey, entry);
		if (recoverySessionError) return {
			kind: "rejected",
			message: recoverySessionError
		};
		if (!params.recoveryRuntime) return {
			kind: "pending",
			message: "accepted chat turn recovery is waiting for the Gateway runtime; retry"
		};
		try {
			const { retryRestartAbortedMainSessionRecovery } = await import("./main-session-restart-recovery-x2BD6vuX.mjs");
			await retryRestartAbortedMainSessionRecovery({
				canonicalSessionKey: params.canonicalSessionKey,
				cfg: params.cfg,
				expectedRecoveryRunId: entry.restartRecoveryDeliveryRunId,
				expectedRecoverySourceRunId: entry.restartRecoveryDeliverySourceRunId,
				expectedSessionId: entry.sessionId,
				sessionKey: params.persistedSessionKey,
				storePath: params.storePath,
				gatewayRuntime: params.recoveryRuntime
			});
		} catch (error) {
			params.warn(String(error));
		}
		entry = params.reloadEntry();
		if (isAdoptedRestartRecoveryClaim(entry, params.clientRunId) && entry.status === "running" && entry.abortedLastRun === true) return {
			kind: "pending",
			message: "accepted chat turn recovery is still pending; retry"
		};
		if (!isAdoptedRestartRecoveryClaim(entry, params.clientRunId) && !hasRestartRecoveryTerminalRun(entry, params.clientRunId)) return {
			kind: "rejected",
			message: "accepted chat turn recovery ownership changed; automatic retry stopped to avoid duplicate execution",
			unavailable: true
		};
	}
	return isAdoptedRestartRecoveryClaim(entry, params.clientRunId) || hasRestartRecoveryTerminalRun(entry, params.clientRunId) ? { kind: "accepted" } : {
		kind: "continue",
		entry
	};
}
function isRestartSafeChatSession(params) {
	const entry = params.entry;
	return Boolean(entry?.sessionId && params.sessionKey !== "global" && entry.status !== "running" && entry.abortedLastRun !== true && entry.archivedAt === void 0 && entry.initializationPending !== true && entry.pendingFinalDelivery === void 0 && (entry.agentHarnessId === void 0 || entry.agentHarnessId === "openclaw") && entry.pluginOwnerId === void 0 && entry.spawnedBy === void 0 && entry.subagentRole === void 0 && (entry.spawnDepth ?? 0) === 0 && entry.acp === void 0 && entry.cronRunContinuation === void 0 && !isSubagentSessionKey(params.sessionKey) && !isCronSessionKey(params.sessionKey) && !isAcpSessionKey$1(params.sessionKey) && !isAgentHarnessSessionKey(params.sessionKey) && (params.requestedSessionId === void 0 || params.requestedSessionId === entry.sessionId));
}
function hasRestartUnsafeChatWork(params) {
	if (findRestartRecoveryUnsafeChatAdmissionHook(resolveSessionDispatchKind(params.sessionKey, params.entry)) !== void 0 || listActiveEmbeddedRunSessionIds().includes(params.sessionId) || replyRunRegistry.isActive(resolveChatSendActiveScopeKey({
		sessionKey: params.sessionKey,
		agentId: params.agentId
	}))) return true;
	for (const active of params.context.chatAbortControllers.values()) if ((active.sessionKey === params.sessionKey || active.sessionId === params.sessionId) && resolveChatRunOwnerAgentId({
		agentId: active.agentId,
		sessionKey: active.sessionKey,
		defaultAgentId: params.agentId
	}) === params.agentId) return true;
	for (const queued of params.context.chatQueuedTurns?.values() ?? []) if ((queued.sessionKey === params.sessionKey || queued.sessionId === params.sessionId) && resolveChatRunOwnerAgentId({
		agentId: queued.agentId,
		sessionKey: queued.sessionKey,
		defaultAgentId: params.agentId
	}) === params.agentId) return true;
	return false;
}
function resolveRestartSafeChatAdmission(params) {
	const request = params.request;
	const entry = params.entry ?? params.initialSessionEntry;
	const placement = params.context.workerSessionPlacementService?.getMany([params.sessionId]).get(params.sessionId);
	if (placement && placement.state !== "local") return;
	if (!request || !entry || !isRestartSafeChatSession({
		...params,
		entry
	}) || !params.initialSessionEntry && resolveSessionEntryResetFreshness({
		agentId: params.agentId,
		now: params.now,
		resetOverride: resolveChannelResetConfig({
			sessionCfg: params.cfg.session,
			channel: sessionDeliveryChannel(params.entry)
		}),
		resetType: resolveSessionResetType({ sessionKey: params.sessionKey }),
		sessionCfg: params.cfg.session,
		sessionKey: params.sessionKey,
		storePath: params.storePath
	}).state !== "fresh" || hasRestartUnsafeChatWork(params)) return;
	const retryableClaim = isRetryableUnadoptedChatClaim(entry, params.clientRunId);
	if (retryableClaim && entry.restartRecoveryDeliveryRequestFingerprint !== request.fingerprint) throw new Error("chat retry does not match its durable admission");
	return {
		requestFingerprint: request.fingerprint,
		...retryableClaim ? { retryExpectedState: buildRestartRecoveryExpectedState(entry) } : entry.restartRecoveryDeliverySourceRunId ? { priorTerminalSourceRunId: entry.restartRecoveryDeliverySourceRunId } : {}
	};
}
function buildRestartSafeChatTranscriptState(params) {
	return {
		...params.admission.retryExpectedState ? { expectedSessionState: params.admission.retryExpectedState } : {},
		sessionLifecyclePatch: {
			restartRecoveryBeforeAgentReplyState: void 0,
			restartRecoveryDeliveryReceiptState: void 0,
			restartRecoveryDeliveryToolCallId: void 0,
			...deriveGatewaySessionLifecycleSnapshot({ event: {
				runId: params.clientRunId,
				ts: params.startedAt,
				data: { phase: "start" }
			} }),
			lifecycleRunId: params.clientRunId,
			lastRunId: void 0,
			restartRecoveryDeliveryContext: void 0,
			restartRecoveryDeliveryRequestFingerprint: params.admission.requestFingerprint,
			restartRecoveryDeliveryRunId: params.clientRunId,
			restartRecoveryDeliverySourceRunId: params.clientRunId,
			restartRecoveryRequesterAccountId: void 0,
			restartRecoveryRequesterSenderId: void 0,
			restartRecoverySameChannelThreadRequired: void 0,
			restartRecoverySourceIngress: "control-ui",
			restartRecoverySourceReplyDeliveryMode: void 0,
			...params.admission.priorTerminalSourceRunId ? { restartRecoveryTerminalRunIds: [params.admission.priorTerminalSourceRunId] } : {}
		}
	};
}
async function terminalizeRestartSafeChatAdmission(params) {
	const endedAt = Date.now();
	let terminalized = false;
	const persisted = await patchSessionEntryCore({
		sessionKey: params.sessionKey,
		storePath: params.storePath
	}, (current) => {
		if (current.sessionId !== params.admittedSessionId || current.restartRecoveryDeliveryRunId !== params.clientRunId) return null;
		terminalized = true;
		return {
			...deriveGatewaySessionLifecycleSnapshot({ event: {
				runId: params.clientRunId,
				ts: endedAt,
				data: {
					phase: params.status === "failed" ? "error" : "end",
					startedAt: params.startedAt,
					endedAt,
					aborted: params.status === "killed",
					error: params.error
				}
			} }),
			abortedLastRun: params.retryable ? false : params.status === "killed",
			lifecycleRunId: void 0,
			lastRunId: params.clientRunId,
			...params.retryable ? {} : buildRestartRecoveryClaimCleanupPatch({
				entry: current,
				recordTerminalSource: true,
				terminalSourceRunId: current.restartRecoveryDeliverySourceRunId
			})
		};
	}, {
		requireWriteSuccess: true,
		skipMaintenance: true
	});
	if (terminalized && persisted && params.status === "failed") await recordGatewaySessionRunFailure({
		target: {
			sessionKey: params.sessionKey,
			storePath: params.storePath,
			sessionId: persisted.sessionId,
			expectedLifecycleRevision: persisted.lifecycleRevision
		},
		runId: params.clientRunId,
		error: params.error
	}).catch((error) => {
		log.warn(`Failed to record restart-safe chat failure notice: ${boundedWorkerError(error)}`);
	});
	return terminalized;
}
//#endregion
//#region src/gateway/server-methods/chat-send-background.ts
function resolveWebchatPromptCacheKey(params) {
	return `openclaw-webchat-${createHash("sha256").update([
		"v1",
		params.provider.trim().toLowerCase(),
		params.model.trim(),
		normalizeAgentId(params.agentId),
		params.sessionKey
	].join("\0"), "utf8").digest("hex").slice(0, 32)}`;
}
function scheduleChatDashboardSessionTitle(params) {
	scheduleDashboardSessionTitle(params, "session");
}
function scheduleCreatedDashboardSessionTitle(created, cfg, context, titleSource) {
	if (!created.isNew || created.entry.incognito || !titleSource) return;
	scheduleDashboardSessionTitle({
		admittedSessionId: created.entry.sessionId,
		agentId: created.agentId,
		cfg,
		context,
		request: {
			rawMessage: titleSource,
			normalizedAttachments: []
		},
		sessionKey: created.key,
		sessionLoadOptions: { agentId: created.agentId },
		storePath: created.storePath
	}, "gateway");
}
function scheduleDashboardSessionTitle(params, admissionScope) {
	const titleSource = buildDashboardSessionTitleSource({
		message: params.request.rawMessage,
		attachments: params.request.normalizedAttachments
	});
	if (!isDashboardSessionTitleCandidate({
		sessionKey: params.sessionKey,
		userMessage: titleSource
	})) return;
	runWithGatewayIndependentRootWorkContinuation(async () => {
		const generateTitle = async () => {
			const titleEntry = loadGatewaySessionEntry(params.sessionKey, params.sessionLoadOptions).entry;
			if (titleEntry?.sessionId !== params.admittedSessionId) return;
			if (await maybeGenerateDashboardSessionTitle({
				cfg: params.cfg,
				agentId: params.agentId,
				entry: titleEntry,
				sessionId: params.admittedSessionId,
				sessionKey: params.sessionKey,
				storePath: params.storePath,
				currentUserMessage: params.request.rawMessage,
				userMessage: titleSource
			})) emitSessionsChanged(params.context, {
				sessionKey: params.sessionKey,
				agentId: params.agentId,
				reason: "chat.title"
			});
		};
		if (admissionScope === "gateway") {
			await generateTitle();
			return;
		}
		const admission = await beginSessionWorkAdmission({
			scope: params.storePath,
			identities: [params.sessionKey, params.admittedSessionId],
			assertAllowed: () => {}
		});
		try {
			await admission.run(generateTitle);
		} finally {
			admission.release();
		}
	}, "chat-send:background").catch((err) => {
		params.context.logGateway.warn(`dashboard session title generation failed: ${formatForLog(err)}`);
	});
}
//#endregion
//#region src/gateway/server-methods/chat-send-command-replies.ts
function readChatSendReplyPayload(input) {
	return input.kind === "raw" ? input.payload : input.plan.payload;
}
function replaceChatSendReplyPayload(input, payload) {
	return input.kind === "raw" ? [{
		kind: "raw",
		payload
	}] : createStructuredOutboundPayloadPlan([payload]).map((plan) => ({
		kind: "prepared",
		plan
	}));
}
function parseReplyInlineDirectives(payload) {
	return typeof payload.text === "string" && payload.text.includes("[[") ? parseInlineDirectives(payload.text) : void 0;
}
function replyMediaUrls(payload) {
	return resolveSendableOutboundReplyParts(payload).mediaUrls;
}
function replyMediaDedupeKeys(payload) {
	return replyMediaUrls(payload).map((mediaUrl) => normalizeMediaReferenceForComparison(mediaUrl));
}
function canonicalizeReplyMedia(payload) {
	const mediaUrls = replyMediaUrls(payload);
	return copyReplyPayloadMetadata(payload, {
		...payload,
		mediaUrl: void 0,
		mediaUrls: mediaUrls.length > 0 ? mediaUrls : void 0
	});
}
function mergeDefinedReplySemantics(target, source) {
	const sourceInlineDirectives = parseReplyInlineDirectives(source);
	const sourceReplyToId = sanitizeReplyDirectiveId(source.replyToId) ?? sanitizeReplyDirectiveId(sourceInlineDirectives?.replyToExplicitId);
	const mergedMedia = mergeMediaReplySemantics(target, source, sourceInlineDirectives);
	return copyReplyPayloadMetadata(mergedMedia, {
		...mergedMedia,
		...source.presentation !== void 0 ? { presentation: source.presentation } : {},
		...source.delivery !== void 0 ? { delivery: source.delivery } : {},
		...source.interactive !== void 0 ? { interactive: source.interactive } : {},
		...sourceReplyToId !== void 0 ? { replyToId: sourceReplyToId } : {},
		...source.replyToTag === true || target.replyToTag === true ? { replyToTag: true } : {},
		...source.replyToCurrent === true || sourceInlineDirectives?.replyToCurrent === true || target.replyToCurrent === true ? { replyToCurrent: true } : {},
		...source.spokenText !== void 0 ? { spokenText: source.spokenText } : {},
		...source.ttsSupplement !== void 0 ? { ttsSupplement: source.ttsSupplement } : {},
		...source.isError === true || target.isError === true ? { isError: true } : {},
		...source.channelData !== void 0 ? { channelData: source.channelData } : {}
	});
}
function mergeMediaReplySemantics(target, source, sourceInlineDirectives = parseReplyInlineDirectives(source)) {
	let attachments = target.attachments;
	if (source.attachments?.length) {
		const sourceAttachments = /* @__PURE__ */ new Map();
		for (const { url, attachment } of collectReplyMediaEntries(source)) {
			const key = normalizeMediaReferenceForComparison(url);
			if (attachment && !sourceAttachments.has(key)) sourceAttachments.set(key, attachment);
		}
		attachments = collectReplyMediaEntries(target).map(({ url, attachment }) => {
			const sourceAttachment = sourceAttachments.get(normalizeMediaReferenceForComparison(url));
			if (!sourceAttachment) return attachment ?? {};
			const merged = Object.assign({}, attachment, sourceAttachment);
			for (const field of [
				"path",
				"url",
				"mediaUrl",
				"filePath"
			]) if (merged[field] !== void 0) merged[field] = url;
			return merged;
		});
	}
	return copyReplyPayloadMetadata(target, {
		...target,
		...attachments ? { attachments } : {},
		...source.trustedLocalMedia === true || target.trustedLocalMedia === true ? { trustedLocalMedia: true } : {},
		...source.sensitiveMedia === true || target.sensitiveMedia === true ? { sensitiveMedia: true } : {},
		...source.audioAsVoice === true || sourceInlineDirectives?.audioAsVoice === true || target.audioAsVoice === true ? { audioAsVoice: true } : {}
	});
}
function hasMergeableReplySemantics(payload) {
	const inlineDirectives = parseReplyInlineDirectives(payload);
	return Boolean(payload.trustedLocalMedia !== void 0 || payload.sensitiveMedia !== void 0 || payload.presentation || payload.delivery || payload.interactive || payload.replyToId || payload.replyToTag !== void 0 || payload.replyToCurrent !== void 0 || payload.audioAsVoice !== void 0 || inlineDirectives?.hasReplyTag || inlineDirectives?.hasAudioTag || payload.spokenText || payload.ttsSupplement || payload.isError !== void 0 || payload.channelData);
}
function hasUnmergedReplySemantics(payload) {
	return Boolean(payload.isReasoning || payload.isReasoningSnapshot || payload.isCompactionNotice || payload.isFallbackNotice || payload.isStatusNotice || payload.btw);
}
function hasReplySemantics(payload) {
	return hasMergeableReplySemantics(payload) || hasUnmergedReplySemantics(payload);
}
function mediaSetsMatch(leftMediaUrls, rightMediaUrls) {
	if (leftMediaUrls.length !== rightMediaUrls.length) return false;
	return leftMediaUrls.every((mediaUrl, index) => mediaUrl === rightMediaUrls[index]);
}
function replyDisplayText(payload) {
	return sanitizeAssistantDisplayText(payload.text) ?? "";
}
/** Folds raw command replies while preserving each prepared reply's ownership. */
function selectChatSendFinalReplyInputs(params) {
	const { deliveredReplies, foldCommandBlocks, suppressReplies } = params;
	const finalPayloadEntries = deliveredReplies.filter((entry) => entry.kind === "final");
	let commandBlockPayloadEntriesForDelivery = (foldCommandBlocks ? deliveredReplies.filter((entry) => entry.kind === "block") : []).map((entry) => ({
		kind: entry.kind,
		input: entry.input.kind === "raw" ? {
			kind: "raw",
			payload: canonicalizeReplyMedia(entry.input.payload)
		} : entry.input
	}));
	const sensitiveMediaDedupeKeys = new Set(finalPayloadEntries.flatMap((entry) => {
		const payload = readChatSendReplyPayload(entry.input);
		return payload.sensitiveMedia === true ? replyMediaDedupeKeys(payload).filter(Boolean) : [];
	}));
	if (sensitiveMediaDedupeKeys.size > 0) commandBlockPayloadEntriesForDelivery = commandBlockPayloadEntriesForDelivery.flatMap((entry) => {
		const payload = readChatSendReplyPayload(entry.input);
		if (!replyMediaDedupeKeys(payload).some((key) => sensitiveMediaDedupeKeys.has(key))) return [entry];
		const sensitivePayload = {
			...payload,
			sensitiveMedia: true
		};
		return replaceChatSendReplyPayload(entry.input, copyReplyPayloadMetadata(payload, sensitivePayload)).map((input) => ({
			kind: entry.kind,
			input
		}));
	});
	const finalPayloadEntriesForDelivery = foldCommandBlocks ? finalPayloadEntries.flatMap((entry) => {
		if (entry.input.kind === "prepared") return [entry];
		const payload = entry.input.payload;
		const finalMediaUrls = replyMediaUrls(payload);
		const finalMediaKeys = replyMediaDedupeKeys(payload);
		const finalDisplayText = replyDisplayText(payload);
		const matchingMediaBlockEntry = finalMediaUrls.length > 0 ? commandBlockPayloadEntriesForDelivery.find((candidate) => candidate.input.kind === "raw" && mediaSetsMatch(replyMediaDedupeKeys(candidate.input.payload), finalMediaKeys)) : void 0;
		const matchingTextBlockEntry = finalDisplayText ? commandBlockPayloadEntriesForDelivery.find((candidate) => candidate.input.kind === "raw" && replyDisplayText(candidate.input.payload) === finalDisplayText) : void 0;
		const matchingMediaAndTextBlockEntry = finalMediaUrls.length > 0 && finalDisplayText ? commandBlockPayloadEntriesForDelivery.find((candidate) => candidate.input.kind === "raw" && replyDisplayText(candidate.input.payload) === finalDisplayText && mediaSetsMatch(replyMediaDedupeKeys(candidate.input.payload), finalMediaKeys)) : void 0;
		const duplicateBlockEntry = finalMediaUrls.length > 0 ? finalDisplayText ? matchingMediaAndTextBlockEntry : matchingMediaBlockEntry : finalMediaUrls.length === 0 ? matchingTextBlockEntry : void 0;
		if (duplicateBlockEntry?.input.kind === "raw") duplicateBlockEntry.input = {
			kind: "raw",
			payload: mergeDefinedReplySemantics(duplicateBlockEntry.input.payload, payload)
		};
		else if (matchingMediaBlockEntry?.input.kind === "raw") matchingMediaBlockEntry.input = {
			kind: "raw",
			payload: mergeMediaReplySemantics(matchingMediaBlockEntry.input.payload, payload)
		};
		const remainingFinalMediaUrls = matchingMediaBlockEntry ? [] : finalMediaUrls;
		if (remainingFinalMediaUrls.length === 0 && (duplicateBlockEntry && !hasUnmergedReplySemantics(payload) || !duplicateBlockEntry && !finalDisplayText && !hasReplySemantics(payload))) return [];
		return [{
			...entry,
			input: {
				kind: "raw",
				payload: copyReplyPayloadMetadata(payload, {
					...payload,
					mediaUrl: void 0,
					mediaUrls: remainingFinalMediaUrls.length > 0 ? remainingFinalMediaUrls : void 0
				})
			}
		}];
	}) : finalPayloadEntries;
	if (suppressReplies) return [];
	return [...commandBlockPayloadEntriesForDelivery, ...finalPayloadEntriesForDelivery].map((entry) => entry.input);
}
//#endregion
//#region src/gateway/server-methods/chat-send-retry.ts
const ACCEPTED_CHAT_SEND_MAX_DISPATCH_ATTEMPTS = 3;
/** Classify an accepted-send failure without relying on unstable error text. */
function classifyAcceptedChatSendFailure(params) {
	if (params.executionStarted || params.sideEffectsObserved) return "reconcile";
	if (!isSessionTranscriptProjectionUnavailableError(params.error)) return "terminal";
	return params.phase === "post-ack" ? "retry" : "client-retry";
}
/** Preserve same-ID recovery unless execution may already have produced side effects. */
function shouldRetainAcceptedChatSendRetryIdentity(disposition) {
	return disposition !== "reconcile";
}
/** Wait for the exact failed projection before another accepted-send dispatch attempt. */
async function waitForAcceptedChatSendRetry(scope, error, abortSignal) {
	if (!isSessionTranscriptProjectionUnavailableError(error)) throw error;
	await waitForSessionTranscriptProjection({
		...scope,
		sessionId: error.sessionId
	}, abortSignal);
}
/** Retry only typed, pre-execution accepted-send failures while Gateway custody remains active. */
async function runAcceptedChatSendDispatch(params) {
	const maxAttempts = params.maxAttempts ?? ACCEPTED_CHAT_SEND_MAX_DISPATCH_ATTEMPTS;
	for (let attempt = 1;; attempt += 1) try {
		return await params.operation();
	} catch (error) {
		if (attempt >= maxAttempts || params.classify(error) !== "retry") throw error;
		await params.waitForRetry(error);
	}
}
//#endregion
//#region src/gateway/server-methods/chat-send-dispatch-errors.ts
function formatReturnedAgentErrors(messages) {
	const [primary, ...additional] = [...new Set(messages)];
	if (!primary || additional.length === 0) return primary;
	if (additional.length === 1) return `${primary}\n\nAdditional error: ${additional[0]}`;
	return `${primary}\n\nAdditional errors:\n${additional.map((message) => `- ${message}`).join("\n")}`;
}
function formatChatSendError(error) {
	if (error instanceof DispatchSessionRefreshRequiredError) return `Your message didn't run because the conversation changed. Refresh the conversation, then send it again.\n\n${String(error)}`;
	return renderAgentHarnessPreflightUserMessage(error) ?? renderFailoverCodeUserCopy(describeFailoverError(error).code) ?? String(error);
}
async function handleChatSendSetupError(params) {
	const { cleanupAdmittedRun, lifecycleGeneration, restartSafeAdmission } = params.admission;
	const { agentId, clientRunId, sessionKey } = params.session;
	const hidden = getAgentRunContext(clientRunId)?.projectSessionMessages === false;
	const jobSessionBinding = params.admission.sessionBinding;
	if (params.error instanceof ExpectedProfileMismatchError) {
		cleanupAdmittedRun();
		clearAgentRunContext(clientRunId, lifecycleGeneration);
		params.context.removeChatRun(clientRunId, clientRunId, sessionKey);
		params.respond(false, void 0, params.error.error);
		return;
	}
	const errorMessage = formatChatSendError(params.error);
	const failureDisposition = classifyAcceptedChatSendFailure({
		error: params.error,
		phase: "pre-ack"
	});
	if (restartSafeAdmission) {
		if (await params.terminalizeRestartSafeAdmission({
			error: errorMessage,
			retryable: shouldRetainAcceptedChatSendRetryIdentity(failureDisposition),
			status: "failed"
		}).catch((terminalizeError) => {
			params.context.logGateway.warn(`failed to release restart-safe chat admission after setup error: ${formatForLog(terminalizeError)}`);
			return false;
		})) emitSessionsChanged(params.context, {
			sessionKey,
			...agentId ? { agentId } : {},
			reason: "chat.dispatch-error"
		});
	}
	cleanupAdmittedRun();
	clearAgentRunContext(clientRunId, lifecycleGeneration);
	params.context.removeChatRun(clientRunId, clientRunId, sessionKey);
	const error = params.error instanceof SessionGoalOperationError ? errorShape(ErrorCodes.INVALID_REQUEST, params.error.message, { details: {
		code: "GOAL_OPERATION_REJECTED",
		reason: params.error.code
	} }) : errorShape(ErrorCodes.UNAVAILABLE, errorMessage, failureDisposition === "client-retry" ? {
		retryable: true,
		retryAfterMs: 250
	} : void 0);
	const payload = {
		runId: clientRunId,
		status: "error",
		summary: errorMessage
	};
	if (params.cacheResult !== false && failureDisposition !== "client-retry") setGatewayDedupeEntry({
		dedupe: params.context.dedupe,
		key: `chat:${clientRunId}`,
		session: captureAgentJobSession(jobSessionBinding),
		entry: {
			ts: Date.now(),
			ok: false,
			payload,
			error
		}
	});
	params.respond(false, payload, error, {
		runId: clientRunId,
		error: formatForLog(params.error)
	});
	if (!hidden && failureDisposition !== "client-retry") broadcastChatError({
		context: params.context,
		runId: clientRunId,
		sessionKey,
		agentId,
		errorMessage
	});
}
/** Own dispatch settlement and post-cleanup lifecycle persistence. */
function createChatSendDispatchErrorLifecycle(params) {
	const { admission, context, isQueuedFollowupEnqueued, persistUserTurnTranscript, session, terminalizeRestartSafeAdmission, userTurnRecorder } = params;
	const { activeRunAbort, cleanupAdmittedRun, lifecycleGeneration, restartSafeAdmission } = admission;
	const { agentId, backingSessionId, cfg, clientRunId, now, rawSessionKey, sessionKey } = session;
	const jobSessionBinding = admission.sessionBinding;
	const visibility = getAgentRunContext(clientRunId);
	const hidden = visibility?.projectSessionMessages === false;
	const suppressLifecycle = visibility?.projectSessionLifecycle === false;
	let abortedDispatchMarker;
	let pendingDispatchLifecycleError;
	let persistDispatchErrorUserTurn;
	let publishDispatchError;
	const handleError = async (err) => {
		const errorMessage = formatChatSendError(err);
		const failureDisposition = params.classifyFailure?.(err) ?? classifyAcceptedChatSendFailure({
			error: err,
			phase: "post-ack"
		});
		if (isQueuedFollowupEnqueued()) {
			context.logGateway.warn(`webchat dispatch failed after followup queue admission: ${formatForLog(err)}`);
			if (!context.chatRunState.hasAbortMarker(clientRunId)) {
				setGatewayDedupeEntry({
					dedupe: context.dedupe,
					key: `chat:${clientRunId}`,
					session: captureAgentJobSession(jobSessionBinding),
					entry: {
						ts: Date.now(),
						ok: true,
						payload: {
							runId: clientRunId,
							status: params.isQueuedFollowupCompleted?.() ? "completed" : "ok"
						}
					}
				});
				broadcastChatFinal({
					context,
					runId: clientRunId,
					sessionKey,
					agentId
				});
			}
			return;
		}
		const abortedAtDispatchReject = activeRunAbort.controller.signal.aborted;
		const abortMarkerAtDispatchReject = context.chatRunState.runs.get(clientRunId)?.abortMarker;
		const agentTerminalPersistenceOwnedAtDispatchReject = activeRunAbort.entry?.projectSessionTerminalPending === true || activeRunAbort.entry?.projectSessionTerminalPersistence !== void 0 || activeRunAbort.entry?.projectSessionTerminalPersisted === true;
		if (abortedAtDispatchReject && abortMarkerAtDispatchReject !== void 0) {
			abortedDispatchMarker = abortMarkerAtDispatchReject;
			context.logGateway.warn(`chat.send post-dispatch threw after abort for runId=${clientRunId}: ${formatForLog(err)}`);
			if (!userTurnRecorder.hasPersisted() && !userTurnRecorder.isBlocked()) try {
				await persistUserTurnTranscript();
			} catch (transcriptError) {
				context.logGateway.warn(`webchat user transcript update failed after abort: ${formatForLog(transcriptError)}`);
			}
			return;
		}
		context.chatRunState.deleteAbortMarker(clientRunId);
		if (agentTerminalPersistenceOwnedAtDispatchReject && activeRunAbort.entry) activeRunAbort.entry.isAbortable = () => false;
		activeRunAbort.cleanup();
		let restartSafeDispatchFailureTerminalized = false;
		if (restartSafeAdmission && !agentTerminalPersistenceOwnedAtDispatchReject) {
			restartSafeDispatchFailureTerminalized = await terminalizeRestartSafeAdmission({
				error: errorMessage,
				retryable: shouldRetainAcceptedChatSendRetryIdentity(failureDisposition),
				status: "failed"
			}).catch((terminalizeError) => {
				context.logGateway.warn(`failed to release restart-safe chat admission after dispatch error: ${formatForLog(terminalizeError)}`);
				return false;
			});
			if (restartSafeDispatchFailureTerminalized) emitSessionsChanged(context, {
				sessionKey,
				...agentId ? { agentId } : {},
				reason: "chat.dispatch-error"
			});
		}
		persistDispatchErrorUserTurn = userTurnRecorder.hasPersisted() || userTurnRecorder.isBlocked() ? void 0 : async () => {
			await persistUserTurnTranscript();
		};
		if (!suppressLifecycle && !restartSafeDispatchFailureTerminalized && abortMarkerAtDispatchReject === void 0 && !agentTerminalPersistenceOwnedAtDispatchReject) pendingDispatchLifecycleError = {
			endedAt: Date.now(),
			error: errorMessage,
			sessionId: activeRunAbort.entry?.sessionId ?? backingSessionId ?? clientRunId,
			startedAt: activeRunAbort.entry?.startedAtMs ?? now
		};
		if (!agentTerminalPersistenceOwnedAtDispatchReject || params.isReplyDispatchRun?.()) {
			const publish = () => {
				const error = errorShape(ErrorCodes.UNAVAILABLE, errorMessage);
				setGatewayDedupeEntry({
					dedupe: context.dedupe,
					key: `chat:${clientRunId}`,
					session: captureAgentJobSession(jobSessionBinding),
					entry: {
						ts: Date.now(),
						ok: false,
						payload: {
							runId: clientRunId,
							status: "error",
							summary: errorMessage
						},
						error
					}
				});
				if (!hidden) broadcastChatError({
					context,
					runId: clientRunId,
					sessionKey,
					agentId,
					errorMessage
				});
			};
			if (pendingDispatchLifecycleError) publishDispatchError = publish;
			else publish();
		}
	};
	const finalize = async () => {
		const dispatchError = pendingDispatchLifecycleError;
		const clearRun = () => {
			if (!params.isAgentRunStarted() || params.isReplyDispatchRun?.()) {
				context.chatRunState.clearRun(clientRunId);
				context.agentRunSeq.delete(clientRunId);
			}
		};
		if (!dispatchError) {
			const abortMarker = abortedDispatchMarker ?? (activeRunAbort.controller.signal.aborted ? context.chatRunState.runs.get(clientRunId)?.abortMarker : void 0);
			if (abortMarker) {
				const endedAt = chatAbortMarkerTimestampMs(abortMarker);
				setGatewayDedupeEntry({
					dedupe: context.dedupe,
					key: `chat:${clientRunId}`,
					session: captureAgentJobSession(jobSessionBinding),
					entry: {
						ts: endedAt,
						ok: true,
						payload: buildAbortedChatSendPayload({
							runId: clientRunId,
							stopReason: activeRunAbort.entry?.abortStopReason ?? "rpc",
							endedAt
						})
					}
				});
			}
			clearRun();
			cleanupAdmittedRun();
			clearAgentRunContext(clientRunId, lifecycleGeneration);
			context.removeChatRun(clientRunId, clientRunId, sessionKey);
			return;
		}
		clearAgentRunContext(clientRunId, lifecycleGeneration);
		context.removeChatRun(clientRunId, clientRunId, sessionKey);
		try {
			await persistDispatchErrorUserTurn?.().catch((transcriptErr) => {
				context.logGateway.warn(`webchat user transcript update failed after error: ${formatForLog(transcriptErr)}`);
			});
			if (!hasTrackedActiveSessionRun({
				context,
				requestedKey: rawSessionKey,
				canonicalKey: sessionKey,
				...agentId ? { agentId } : {},
				defaultAgentId: tryResolveSessionCompatibilityOwnerAgentId(cfg, sessionKey)
			})) try {
				await persistGatewaySessionLifecycleEvent({
					sessionKey,
					...agentId ? { agentId } : {},
					event: {
						runId: clientRunId,
						sessionId: dispatchError.sessionId,
						lifecycleGeneration,
						ts: dispatchError.endedAt,
						data: {
							phase: "error",
							startedAt: dispatchError.startedAt,
							endedAt: dispatchError.endedAt,
							error: dispatchError.error
						}
					}
				});
				emitSessionsChanged(context, {
					sessionKey,
					...agentId ? { agentId } : {},
					reason: "chat.dispatch-error"
				});
			} catch (persistErr) {
				context.logGateway.warn(`webchat session lifecycle persist failed after error: ${formatForLog(persistErr)}`);
			}
		} catch (continuationErr) {
			context.logGateway.warn(`webchat session lifecycle continuation failed: ${formatForLog(continuationErr)}`);
		} finally {
			try {
				publishDispatchError?.();
			} finally {
				clearRun();
				cleanupAdmittedRun();
			}
		}
	};
	return {
		finalize,
		handleError
	};
}
//#endregion
//#region src/gateway/server-methods/chat-send-reply-context.ts
const REPLY_CONTEXT_BODY_MAX_CHARS = 2e3;
/** Adds hydrated reply metadata to the direct-injection user prompt. */
function buildChatSendReplyInjectionText(params) {
	const prefix = buildInboundUserContextPrefix(params.ctx, resolveEnvelopeFormatOptions(params.cfg), params.sessionEntry);
	return prefix ? `${prefix}\n\n${params.body}` : params.body;
}
function extractReplyTargetText(message) {
	const entry = asOptionalRecord(message);
	if (!entry) return;
	if (typeof entry.text === "string" && entry.text.trim()) return entry.text;
	if (typeof entry.content === "string" && entry.content.trim()) return entry.content;
	if (!Array.isArray(entry.content)) return;
	const parts = entry.content.map((block) => {
		const record = asOptionalRecord(block);
		return record && typeof record.text === "string" ? record.text : "";
	}).filter((text) => text.trim());
	return parts.length > 0 ? parts.join("\n") : void 0;
}
function resolveReplyTargetSenderLabel(params) {
	if (asOptionalRecord(params.message)?.role === "assistant") return resolveAssistantIdentity({
		cfg: params.cfg,
		agentId: params.agentId
	}).name;
	return params.userSenderLabel?.trim() || "User";
}
/** Copies hydrated reply fields onto the inbound context without clobbering unset keys. */
function applyChatSendReplyContextFields(ctx, fields) {
	if (fields.ReplyToId !== void 0) ctx.ReplyToId = fields.ReplyToId;
	if (fields.ReplyToBody !== void 0) ctx.ReplyToBody = fields.ReplyToBody;
	if (fields.ReplyToSender !== void 0) ctx.ReplyToSender = fields.ReplyToSender;
}
/**
* Resolves a webchat reply target from session history. Always preserves the
* reply_to_id linkage; body/sender hydrate only when the transcript message
* still resolves, mirroring Discord's missing-referenced-message tolerance.
*/
async function resolveChatSendReplyContext(params) {
	const replyToId = params.replyToId?.trim();
	if (!replyToId) return {};
	const fields = { ReplyToId: replyToId };
	const sessionId = params.sessionEntry?.sessionId;
	if (!sessionId) return fields;
	try {
		const resolved = await readSessionMessageByIdAsync({
			agentId: params.agentId,
			sessionEntry: params.sessionEntry,
			sessionId,
			sessionKey: params.sessionKey,
			storePath: params.storePath
		}, replyToId, { allowResetArchiveFallback: true });
		if (!resolved.found) return fields;
		const displayMessage = projectChatDisplayMessage(resolved.message);
		if (!displayMessage) return fields;
		const rawBody = extractReplyTargetText(displayMessage)?.trim();
		const body = rawBody && displayMessage.role === "assistant" ? sanitizeAssistantVisibleTextWithProfile(rawBody, "history").trim() : rawBody;
		if (!body) return fields;
		fields.ReplyToBody = truncateUtf16Safe(body, REPLY_CONTEXT_BODY_MAX_CHARS);
		fields.ReplyToSender = resolveReplyTargetSenderLabel({
			message: displayMessage,
			cfg: params.cfg,
			agentId: params.agentId,
			userSenderLabel: params.userSenderLabel
		});
		return fields;
	} catch (err) {
		params.warn?.(`chat.send reply context hydration failed for ${replyToId}: ${String(err)}`);
		return fields;
	}
}
//#endregion
//#region src/gateway/server-methods/chat-send-message-injection.ts
/** Captures the prepared request data used by both pre-ACK and detached injection attempts. */
function createChatSendMessageInjectionStarter(params) {
	const { p, rawMessage, supportsTaskSuggestions } = params.request;
	const { cfg, entry, sessionKey, storePath, clientRunId } = params.session;
	const { ctx, isInternalTextSlashCommandTurn, replyOptionImages, replyOptionMedia } = params.turn;
	const assertCurrent = params.assertCurrent || params.operatorAuthority ? () => {
		params.assertCurrent?.();
		params.operatorAuthority?.assertCurrent();
	} : void 0;
	return () => {
		if (!params.target || isInternalTextSlashCommandTurn) return;
		assertCurrent?.();
		let fenceEntry = entry;
		if (sessionKey) try {
			fenceEntry = loadSessionEntry({
				sessionKey,
				storePath,
				readConsistency: "latest"
			}) ?? entry;
		} catch (error) {
			params.logGateway.warn(`failed to reload session entry before steering fence on ${sessionKey}: ${String(error)}`);
			return;
		}
		const activeSourceTurnId = normalizeOptionalString(params.target?.sourceTurnId) ?? normalizeOptionalString(fenceEntry?.restartRecoveryDeliverySourceRunId) ?? "";
		if (fenceEntry && isRestartRecoveryTerminalDeliveryFailClosed(fenceEntry, fenceEntry.sessionId, activeSourceTurnId)) {
			params.logGateway.warn(`active run ${clientRunId} cannot own another terminal source-reply send on session ${sessionKey}; rejecting steer injection before queueing`);
			return;
		}
		const { debounceMs } = resolveQueueSettings({
			cfg,
			channel: ctx.Provider,
			sessionEntry: entry,
			inlineMode: p.queueMode
		});
		const baseText = ctx.BodyForAgent ?? ctx.Body ?? rawMessage;
		const rendered = params.documentContext?.status === "rendered" ? params.documentContext : void 0;
		const documentContext = rendered?.text.trim();
		let text = baseText;
		if (documentContext || params.documentContext?.status === "failed") text = [
			buildInboundMediaNoteProjection(ctx).text,
			baseText.trim(),
			documentContext
		].filter(Boolean).join("\n\n");
		const documentImages = rendered?.images ?? [];
		const injectionImages = documentImages.length > 0 ? [...replyOptionImages ?? [], ...documentImages.map((image) => ({
			type: "image",
			data: image.data,
			mimeType: image.mimeType,
			sourceIndex: image.attachmentIndex
		}))] : replyOptionImages;
		const authorization = resolveCommandAuthorization({
			ctx,
			cfg,
			commandAuthorized: ctx.CommandAuthorized === true
		});
		return beginReplyMessageInjectionTarget(params.target, p.replyToId ? buildChatSendReplyInjectionText({
			body: text,
			cfg,
			ctx,
			sessionEntry: entry
		}) : text, {
			assertCurrent,
			steeringMode: "all",
			isInboundUserMessage: true,
			...isProgressCardRefreshInputProvenance(ctx.InputProvenance) ? {
				allowPendingUserInputAnswer: false,
				debounceMs: 0
			} : {},
			toolAuthorityOverlay: resolveInboundReplyToolAuthorityOverlay({
				ctx,
				sessionEntry: {
					spawnedBy: entry?.spawnedBy,
					permissionMode: params.admittedSessionSettings?.permissionMode,
					toolOverrides: params.admittedSessionSettings?.toolOverrides
				},
				senderIsOwner: authorization.senderIsOwner,
				operatorAuthority: params.operatorAuthority,
				disableTools: false
			}),
			...injectionImages?.length ? { images: injectionImages } : {},
			...params.imageOrder?.length ? { imageOrder: params.imageOrder } : {},
			...replyOptionMedia?.length ? { media: replyOptionMedia } : {},
			waitForTranscriptCommit: true,
			abortSignal: params.abortSignal,
			...!isProgressCardRefreshInputProvenance(ctx.InputProvenance) && debounceMs !== void 0 ? { debounceMs } : {},
			taskSuggestionDeliveryMode: supportsTaskSuggestions ? "gateway" : void 0,
			userTurnTranscriptRecorder: params.userTurnTranscriptRecorder
		});
	};
}
/** Wait for runtime ownership before ACK without waiting for transcript commitment. */
async function settleChatSendPreAckMessageInjection(params) {
	if (!params.attempt || await params.attempt.acceptance) return {
		status: "continue",
		attempt: params.attempt
	};
	const outcome = await params.attempt.outcome;
	if (outcome.status === "failed") throw outcome.error;
	if (params.isAborted()) {
		params.onAborted();
		return { status: "handled" };
	}
	if (params.sessionRoutingChanged()) {
		params.onSessionRoutingChanged();
		return { status: "handled" };
	}
	return {
		status: "continue",
		attempt: void 0
	};
}
/** Finish an accepted steer without entering reply dispatch, or return false for fallback. */
async function finalizeAcceptedChatSendMessageInjection(params) {
	const { context, ctx, session } = params;
	const { agentId, cfg, clientRunId, entry, sessionKey, storePath } = session;
	const finalizedCtx = finalizeInboundContext(ctx);
	const progressRefresh = isProgressCardRefreshInputProvenance(ctx.InputProvenance);
	const finalization = await finalizeReplyMessageInjectionAttempt({
		attempt: params.attempt,
		target: params.target,
		inboundAudio: hasInboundAudio(finalizedCtx),
		...progressRefresh ? { abortOnUnconfirmedTranscript: false } : {}
	});
	if (finalization.status === "rejected") return false;
	recordAcceptedSessionParticipantInput(ctx, {
		agentId,
		sessionKey,
		storePath
	});
	const channel = normalizeLowercaseStringOrEmpty(finalizedCtx.Surface ?? finalizedCtx.Provider ?? "unknown");
	const chatId = finalizedCtx.To ?? finalizedCtx.From;
	const messageId = finalizedCtx.MessageSidFull ?? finalizedCtx.MessageSid ?? finalizedCtx.MessageSidFirst ?? finalizedCtx.MessageSidLast;
	const indeterminate = finalization.status === "indeterminate" ? finalization.outcome.errorMessage : progressRefresh && finalization.status === "accepted" && finalization.outcome.result?.transcriptCommit === "unconfirmed" ? finalization.outcome.result.errorMessage : void 0;
	const steerAborted = finalization.status === "accepted" && finalization.aborted;
	const outcomeReason = indeterminate ? progressRefresh ? "progress_refresh_receipt_unconfirmed" : "question_response_indeterminate" : steerAborted ? "reply_operation_aborted" : "active_run_injected";
	if (steerAborted) context.logGateway.warn(`active run ${finalization.targetRunId ?? "unknown"} accepted chat steering without transcript confirmation; aborted exact target without replay`);
	await params.persistUserTurnTranscriptBestEffort();
	if (isDiagnosticsEnabled(cfg)) {
		logMessageReceived({
			sessionKey,
			channel,
			chatId,
			messageId,
			source: "dispatchInboundMessage"
		});
		logMessageProcessed({
			channel,
			chatId,
			messageId,
			sessionId: entry?.sessionId,
			sessionKey,
			durationMs: Math.max(0, Date.now() - params.startedAt),
			outcome: indeterminate ? "error" : steerAborted ? "skipped" : "completed",
			reason: outcomeReason
		});
	}
	emitMessageReceivedHooks({
		ctx: finalizedCtx,
		hookRunner: getGlobalHookRunner(),
		sessionKey,
		timestamp: typeof finalizedCtx.Timestamp === "number" && Number.isFinite(finalizedCtx.Timestamp) ? finalizedCtx.Timestamp : void 0
	});
	emitInboundMessageAuditTerminal({
		cfg,
		counts: {
			tool: 0,
			block: 0,
			final: 0
		},
		ctx: finalizedCtx,
		observedRunId: clientRunId,
		startedAt: params.startedAt,
		terminal: indeterminate ? {
			outcome: "error",
			options: {
				reason: outcomeReason,
				error: indeterminate
			}
		} : steerAborted ? {
			outcome: "skipped",
			options: { reason: outcomeReason }
		} : {
			outcome: "completed",
			options: { reason: outcomeReason }
		}
	});
	const updatedAt = Date.now();
	if (entry) entry.updatedAt = updatedAt;
	await updateSessionEntry({
		storePath,
		sessionKey
	}, () => ({ updatedAt }), {
		skipMaintenance: true,
		takeCacheOwnership: true
	}).catch((error) => {
		context.logGateway.warn(`failed to touch session after accepted steering: ${String(error)}`);
	});
	if (!context.chatRunState.hasAbortMarker(clientRunId)) {
		setGatewayDedupeEntry({
			dedupe: context.dedupe,
			key: `chat:${clientRunId}`,
			session: captureAgentJobSession(params.sessionBinding),
			entry: {
				ts: Date.now(),
				ok: progressRefresh || !indeterminate,
				payload: {
					runId: clientRunId,
					status: progressRefresh ? "accepted" : indeterminate ? "error" : "ok",
					...indeterminate ? { summary: indeterminate } : {}
				},
				...!progressRefresh && indeterminate ? { error: errorShape(ErrorCodes.UNAVAILABLE, indeterminate) } : {}
			}
		});
		if (indeterminate) broadcastChatError({
			context,
			runId: clientRunId,
			sessionKey,
			agentId,
			errorMessage: indeterminate
		});
		else broadcastChatFinal({
			context,
			runId: clientRunId,
			sessionKey,
			agentId
		});
	}
	return true;
}
//#endregion
//#region src/gateway/server-methods/chat-webchat-media.ts
/** Cap local audio files exposed through assistant media. */
const MAX_WEBCHAT_AUDIO_BYTES = 15728640;
const MAX_WEBCHAT_IMAGE_DATA_URL_CHARS = 2e6;
const MAX_WEBCHAT_IMAGE_DATA_BYTES = 15e5;
const ALLOWED_WEBCHAT_DATA_IMAGE_MEDIA_TYPES = /* @__PURE__ */ new Set([
	"image/apng",
	"image/avif",
	"image/bmp",
	"image/gif",
	"image/jpeg",
	"image/png",
	"image/webp"
]);
/** Map `mediaUrl` strings to an absolute filesystem path for local embedding (plain paths or `file:` URLs). */
function resolveLocalMediaPathForEmbedding(raw) {
	const trimmed = raw.trim();
	if (!trimmed) return null;
	if (/^data:/i.test(trimmed)) return null;
	if (/^https?:/i.test(trimmed)) return null;
	if (/^file:/iu.test(trimmed)) try {
		const p = safeFileURLToPath(trimmed);
		if (!path.isAbsolute(p)) return null;
		return p;
	} catch {
		return null;
	}
	if (!path.isAbsolute(trimmed)) return null;
	try {
		assertNoWindowsNetworkPath(trimmed, "Local media path");
	} catch {
		return null;
	}
	return trimmed;
}
async function readLocalAudioContentBlockForEmbedding(payload, raw, options) {
	if (payload.trustedLocalMedia !== true) return null;
	const resolved = resolveLocalMediaPathForEmbedding(raw);
	if (!resolved) return null;
	if (!isAudioFileName(resolved)) return null;
	let opened;
	try {
		options?.assertCurrent?.();
		await assertLocalMediaAllowed(resolved, options?.localRoots);
		options?.assertCurrent?.();
		opened = await openLocalFileSafely({ filePath: resolved });
		await assertLocalMediaAllowed(opened.realPath, options?.localRoots);
		options?.assertCurrent?.();
		if (opened.stat.size > MAX_WEBCHAT_AUDIO_BYTES) return null;
		return {
			path: opened.realPath,
			block: {
				type: "attachment",
				attachment: {
					url: opened.realPath,
					kind: "audio",
					label: path.basename(opened.realPath),
					mimeType: mimeTypeForPath(opened.realPath),
					...payload.audioAsVoice === true ? { isVoiceNote: true } : {}
				}
			}
		};
	} catch (err) {
		if (err instanceof LocalMediaAccessError) options?.onLocalAudioAccessDenied?.(err);
		return null;
	} finally {
		await opened?.handle.close().catch(() => {});
	}
}
async function resolveReplyMediaAudioEmbedding(payload, raw, seenAudio, options) {
	const url = raw.trim();
	if (!url) return null;
	const audio = await readLocalAudioContentBlockForEmbedding(payload, url, options);
	if (!audio || seenAudio.has(audio.path)) return { url };
	seenAudio.add(audio.path);
	return {
		url,
		audioBlock: audio.block
	};
}
function mimeTypeForPath(filePath) {
	return mimeTypeFromFilePath(filePath) ?? "audio/mpeg";
}
function isBase64DataPayload(value) {
	if (value.length === 0) return false;
	for (let index = 0; index < value.length; index += 1) {
		const code = value.charCodeAt(index);
		if (!(code >= 65 && code <= 90 || code >= 97 && code <= 122 || code >= 48 && code <= 57 || code === 43 || code === 47 || code === 61) && !(code === 9 || code === 10 || code === 11 || code === 12 || code === 13 || code === 32)) return false;
	}
	return true;
}
function resolveEmbeddableImageUrl(url) {
	const trimmed = url.trim();
	if (!trimmed) return null;
	if (trimmed.length > MAX_WEBCHAT_IMAGE_DATA_URL_CHARS) return null;
	const commaIndex = trimmed.indexOf(",");
	if (commaIndex < 0) return null;
	const metadata = trimmed.slice(0, commaIndex);
	const match = /^data:(image\/[a-z0-9.+-]+);base64$/i.exec(metadata);
	const base64Data = trimmed.slice(commaIndex + 1);
	if (!match || !isBase64DataPayload(base64Data)) return null;
	const mediaType = normalizeLowercaseStringOrEmpty(match[1]);
	if (!ALLOWED_WEBCHAT_DATA_IMAGE_MEDIA_TYPES.has(mediaType)) return null;
	if (estimateBase64DecodedBytes(base64Data) > MAX_WEBCHAT_IMAGE_DATA_BYTES) return null;
	return trimmed;
}
function resolveReplyDirectivePrefix(payload) {
	const replyToId = sanitizeReplyDirectiveId(payload.replyToId);
	if (replyToId) return `[[reply_to:${replyToId}]]`;
	if (payload.replyToCurrent) return "[[reply_to_current]]";
	return "";
}
async function buildWebchatAssistantMessageFromReplyPayloads(payloads, options) {
	const content = [];
	const transcriptTextParts = [];
	const payloadTexts = [];
	const seenAudio = /* @__PURE__ */ new Set();
	const seenImages = /* @__PURE__ */ new Set();
	let hasAudio = false;
	let hasImage = false;
	for (const [payloadIndex, payload] of payloads.entries()) {
		if (payload.isReasoning === true) continue;
		const visibleText = payload.text?.trim();
		const text = visibleText && !isSuppressedControlReplyText(visibleText) ? visibleText : void 0;
		const replyDirectivePrefix = resolveReplyDirectivePrefix(payload);
		let payloadHasAudio = false;
		let payloadHasImage = false;
		const payloadMediaBlocks = [];
		const parts = resolveSendableOutboundReplyParts(payload);
		for (const raw of parts.mediaUrls) {
			const media = await resolveReplyMediaAudioEmbedding(payload, raw, seenAudio, options);
			if (!media) continue;
			if (media.audioBlock) {
				payloadMediaBlocks.push(media.audioBlock);
				hasAudio = true;
				payloadHasAudio = true;
				continue;
			}
			const imageUrl = resolveEmbeddableImageUrl(media.url);
			if (!imageUrl || seenImages.has(imageUrl)) continue;
			seenImages.add(imageUrl);
			payloadMediaBlocks.push({
				type: "input_image",
				image_url: imageUrl
			});
			hasImage = true;
			payloadHasImage = true;
		}
		const syntheticText = payloadMediaBlocks.length > 0 && (!text || replyDirectivePrefix) && transcriptTextParts.length === 0 ? payloadHasAudio && payloadHasImage ? "Media reply" : payloadHasAudio ? "Audio reply" : "Image reply" : void 0;
		const blockText = text ?? syntheticText;
		if (blockText) {
			const fullText = replyDirectivePrefix ? `${replyDirectivePrefix}${blockText}` : blockText;
			transcriptTextParts.push(fullText);
			payloadTexts[payloadIndex] = fullText;
			content.push({
				type: "text",
				text: fullText
			});
		} else if (replyDirectivePrefix) {
			transcriptTextParts.push(replyDirectivePrefix);
			payloadTexts[payloadIndex] = replyDirectivePrefix;
			content.push({
				type: "text",
				text: replyDirectivePrefix
			});
		}
		content.push(...payloadMediaBlocks);
	}
	if (!hasAudio && !hasImage) return null;
	const transcriptText = transcriptTextParts.join("\n\n").trim() || (hasAudio && hasImage ? "Media reply" : hasAudio ? "Audio reply" : "Image reply");
	if (transcriptTextParts.length === 0) content.unshift({
		type: "text",
		text: transcriptText
	});
	return {
		content,
		transcriptText,
		payloadTexts
	};
}
//#endregion
//#region src/gateway/server-methods/chat-reply-media.ts
function resolveRequesterPolicyContext(requester) {
	return {
		requesterSenderId: requester?.SenderId,
		requesterSenderName: requester?.SenderName,
		requesterSenderUsername: requester?.SenderUsername,
		requesterSenderE164: requester?.SenderE164,
		groupChannel: requester?.GroupChannel,
		groupSpace: requester?.GroupSpace,
		messageProvider: requester?.Surface ?? requester?.Provider
	};
}
/** Bind reads to the source session; reread its owner after every awaited file operation. */
function captureWebchatReplyMediaScope(params) {
	const readEntry = () => loadGatewaySessionEntry(params.sessionKey, params.sessionLoadOptions).entry;
	const sessionEntry = readEntry();
	const scope = {
		...params,
		sessionEntry: sessionEntry ? { ...sessionEntry } : void 0
	};
	const authority = (entry) => {
		const currentScope = {
			...scope,
			sessionEntry: entry
		};
		const workspace = resolveWebchatReplyWorkspace(currentScope);
		return JSON.stringify([
			entry?.sessionId,
			entry?.lifecycleRevision,
			entry?.permissionMode,
			entry?.execNode,
			entry?.repositoryWorkspaceId,
			workspace.remote,
			workspace.workspaceDir,
			resolveWebchatReplyWorkspaceOnly(currentScope)
		]);
	};
	const expected = authority(scope.sessionEntry);
	return {
		...scope,
		assertCurrent: () => {
			params.assertCurrent?.();
			if (authority(readEntry()) !== expected) throw new Error("Session media access changed before attachment delivery.");
		}
	};
}
async function prepareWebchatReplyMediaForDisplay(params) {
	const scope = params.scope;
	const sourcePayloads = params.inputs.map(readChatSendReplyPayload);
	const hasMedia = sourcePayloads.some((payload) => resolveSendableOutboundReplyParts(payload).mediaUrls.length > 0);
	return await withChannelReadAuthority(scope.assertCurrent, async () => {
		const payloads = await normalizeWebchatReplyMediaPathsForDisplay({
			...scope,
			payloads: sourcePayloads
		});
		const inputs = params.inputs.flatMap((input, index) => {
			const payload = payloads[index];
			return payload ? replaceChatSendReplyPayload(input, payload) : [];
		});
		const localRoots = getWebchatReplyMediaLocalRoots({
			...scope,
			storePath: params.storePath
		});
		const mediaMessage = await buildWebchatAssistantMessageFromReplyPayloads(inputs.map(readChatSendReplyPayload), {
			localRoots,
			assertCurrent: captureChannelReadAuthority(),
			onLocalAudioAccessDenied: params.onLocalAudioAccessDenied
		});
		return {
			...await buildAssistantReplyContentFromInputs({
				sessionKey: params.transcriptTarget?.sessionKey ?? scope.sessionKey,
				agentId: params.transcriptTarget?.agentId ?? scope.agentId,
				inputs,
				transcriptMediaMessage: mediaMessage,
				managedMediaLocalRoots: localRoots,
				assertCurrent: scope.assertCurrent,
				abortSignal: params.abortSignal,
				includeSensitiveMedia: params.includeSensitiveMedia,
				includeSensitiveDisplay: params.includeSensitiveDisplay,
				onManagedMediaPrepareError: params.onManagedMediaPrepareError,
				onSensitiveDisplayPrepareError: params.onSensitiveDisplayPrepareError
			}),
			inputs,
			payloads,
			mediaMessage
		};
	}, hasMedia ? params.abortSignal : void 0);
}
function resolveWebchatReplyWorkspace(params) {
	const entry = params.sessionEntry;
	const placement = entry?.sessionId && !entry.execNode && !entry.repositoryWorkspaceId ? resolveSessionWorkerPlacementContext().workerSessionPlacementService?.getMany([entry.sessionId]).get(entry.sessionId) : void 0;
	const remote = Boolean(entry?.execNode || entry?.repositoryWorkspaceId || isCloudWorkerPlacementState(placement?.state));
	return {
		remote,
		workspaceDir: !remote && entry ? entry.sessionRoot ?? resolveSessionWorkspaceRoots(params.cfg, params.agentId, entry).root : resolveAgentWorkspaceDir(params.cfg, params.agentId)
	};
}
function resolveWebchatReplyWorkspaceOnly(params) {
	const mode = params.sessionEntry?.permissionMode;
	return mode ? resolveSessionPermissionCoreToolPolicy({ mode }).workspaceOnly : resolveEffectiveToolFsWorkspaceOnly(params);
}
/** Trusted audio bypasses staging, but its reader must use the same session workspace. */
function getWebchatReplyMediaLocalRoots(params) {
	const { remote, workspaceDir } = resolveWebchatReplyWorkspace(params);
	if (remote) return [getMediaDir()];
	const workspaceRoots = getAgentScopedMediaLocalRoots(params.cfg, params.agentId, workspaceDir);
	const roots = resolveWebchatReplyWorkspaceOnly(params) ? workspaceRoots : [.../* @__PURE__ */ new Set([...getAgentScopedMediaLocalRoots(params.cfg, params.agentId), ...workspaceRoots])];
	return resolveAgentScopedOutboundMediaAccess({
		cfg: params.cfg,
		agentId: params.agentId,
		sessionKey: params.sessionKey,
		accountId: params.accountId,
		workspaceDir,
		workspaceOnly: resolveWebchatReplyWorkspaceOnly(params),
		mediaAccess: { localRoots: appendLocalMediaParentRoots(roots, params.storePath ? [params.storePath] : void 0) },
		...resolveRequesterPolicyContext(params.requesterContext)
	}).localRoots ?? [];
}
function shouldPreserveDisplayMediaUrl(payload, mediaUrl) {
	if (mediaUrl.trim().toLowerCase().startsWith("data:")) return true;
	if (!isAudioFileName(mediaUrl)) return false;
	if (isPassThroughRemoteMediaSource(mediaUrl)) return true;
	return payload.trustedLocalMedia === true;
}
/** Normalize reply media paths for webchat display without leaking sensitive media. */
async function normalizeWebchatReplyMediaPathsForDisplay(params) {
	return await withChannelReadAuthority(params.assertCurrent, async () => {
		if (params.payloads.every((payload) => payload.sensitiveMedia === true || resolveSendableOutboundReplyParts(payload).mediaUrls.every((url) => shouldPreserveDisplayMediaUrl(payload, url)))) return params.payloads;
		const { remote, workspaceDir } = resolveWebchatReplyWorkspace(params);
		if (!workspaceDir) return params.payloads;
		const assertCurrent = captureChannelReadAuthority();
		const { createReplyMediaPathNormalizer } = await import("./reply-media-paths.runtime.js");
		assertCurrent?.();
		const workspaceOnly = resolveWebchatReplyWorkspaceOnly(params);
		const normalizeMediaPaths = createReplyMediaPathNormalizer({
			cfg: params.cfg,
			sessionKey: params.sessionKey,
			agentId: params.agentId,
			workspaceDir,
			sessionWorkspaceDir: workspaceOnly && !remote ? workspaceDir : void 0,
			workspaceOnly,
			allowHostWorkspace: !remote,
			accountId: params.accountId,
			...resolveRequesterPolicyContext(params.requesterContext)
		});
		const normalized = [];
		for (const payload of params.payloads) {
			if (payload.sensitiveMedia === true) {
				normalized.push(payload);
				continue;
			}
			const mediaUrls = resolveSendableOutboundReplyParts(payload).mediaUrls;
			if (!mediaUrls.some((mediaUrl) => shouldPreserveDisplayMediaUrl(payload, mediaUrl))) {
				normalized.push(await normalizeMediaPaths(payload));
				continue;
			}
			if (!mediaUrls.some((mediaUrl) => !shouldPreserveDisplayMediaUrl(payload, mediaUrl))) {
				normalized.push(payload);
				continue;
			}
			const mergedMediaUrls = [];
			const mergedAttachments = [];
			const previousMediaFailures = getReplyPayloadMetadata(payload)?.assistantMediaFailures ?? [];
			const mediaFailures = [...previousMediaFailures];
			let text = payload.text;
			for (const { url: mediaUrl, attachment } of collectReplyMediaEntries(payload, mediaUrls)) {
				if (shouldPreserveDisplayMediaUrl(payload, mediaUrl)) {
					mergedMediaUrls.push(mediaUrl);
					mergedAttachments.push(attachment ?? {});
					continue;
				}
				const normalizedPayload = await normalizeMediaPaths(copyReplyPayloadMetadata(payload, {
					...payload,
					text,
					mediaUrl,
					mediaUrls: [mediaUrl],
					attachments: attachment ? [attachment] : void 0
				}));
				const normalizedMediaUrls = resolveSendableOutboundReplyParts(normalizedPayload).mediaUrls;
				mediaFailures.push(...(getReplyPayloadMetadata(normalizedPayload)?.assistantMediaFailures ?? []).slice(previousMediaFailures.length));
				text = normalizedPayload.text;
				if (normalizedMediaUrls.length === 0) continue;
				mergedMediaUrls.push(...normalizedMediaUrls);
				mergedAttachments.push(...normalizedPayload.attachments ?? normalizedMediaUrls.map(() => ({})));
			}
			const merged = copyReplyPayloadMetadata(payload, {
				...payload,
				text,
				mediaUrl: mergedMediaUrls[0],
				mediaUrls: mergedMediaUrls,
				attachments: mergedAttachments
			});
			normalized.push(mediaFailures.length > 0 ? setReplyPayloadMetadata(merged, { assistantMediaFailures: mediaFailures }) : merged);
		}
		return normalized;
	});
}
//#endregion
//#region src/gateway/server-methods/chat-send-commentary-media.ts
/** Materialize committed progress attachments within the same admitted webchat run. */
function observeChatSendCommentaryMedia(params) {
	const { session } = params;
	const seen = /* @__PURE__ */ new Set();
	let pending = Promise.resolve();
	let lastRewrite;
	const reportPreparationFailure = (error) => {
		if (!(error instanceof SessionTranscriptWriterClaimReboundError)) params.logGateway.warn(`webchat commentary media preparation failed: ${formatForLog(error)}`);
	};
	const unsubscribe = onInternalSessionTranscriptUpdate((update) => {
		const message = asOptionalRecord(update.message);
		const target = update.target;
		const messageId = update.messageId;
		if (!target || target.sessionKey !== session.sessionKey || target.agentId !== session.agentId || !messageId || message?.role !== "assistant" || readSessionTranscriptRunId(message) !== params.getRunId() || !params.isCurrent() || !Array.isArray(message.content) || Array.isArray(message["openclawDisplayContent"])) return;
		const delivery = asOptionalRecord(message.openclawDelivery);
		const authoredMedia = new Set(Array.isArray(delivery?.mediaUrls) ? delivery.mediaUrls.filter((url) => typeof url === "string") : []);
		const commentaryBlocks = new Set(readAssistantTextBlocksForPhase(message, "commentary"));
		const commentaryIndexes = /* @__PURE__ */ new Set();
		const mediaUrls = Array.from(new Set(message.content.flatMap((value, index) => {
			const block = asOptionalRecord(value);
			if (commentaryBlocks.has(value)) commentaryIndexes.add(index);
			return block && commentaryIndexes.has(index) && typeof block.text === "string" ? (splitMediaFromOutput(block.text).mediaUrls ?? []).filter((url) => authoredMedia.has(url)) : [];
		})));
		const key = `${target.sessionId}:${messageId}`;
		if (mediaUrls.length === 0 || seen.has(key)) return;
		seen.add(key);
		const runId = params.getRunId();
		const current = loadGatewaySessionEntry(session.sessionKey, session.sessionLoadOptions);
		if (current.entry?.sessionId !== target.sessionId) return;
		const lifecycleRevision = current.entry.lifecycleRevision;
		const scope = {
			...target,
			storePath: current.storePath
		};
		const assertOwned = captureOwnedTranscriptWriteAssertion(scope);
		const assertCurrent = () => {
			assertOwned();
			const latest = loadGatewaySessionEntry(session.sessionKey, session.sessionLoadOptions);
			if (!params.isCurrent() || params.abortSignal?.aborted || params.getRunId() !== runId || latest.entry?.sessionId !== scope.sessionId || latest.entry.lifecycleRevision !== lifecycleRevision) throw new SessionTranscriptWriterClaimReboundError();
		};
		const originalContent = structuredClone(message.content);
		const previous = pending;
		pending = runWithOwnedSessionTranscriptWrite({ sessionTarget: scope }, () => previous.then(async () => {
			assertCurrent();
			let anchor = readActiveTranscriptEntryAnchor({
				...scope,
				entryId: messageId
			});
			if (!anchor) {
				const { waitForSessionTranscriptProjection } = await import("./config/sessions/session-transcript-reconcile.js");
				await waitForSessionTranscriptProjection(scope, params.abortSignal);
				assertCurrent();
				anchor = readActiveTranscriptEntryAnchor({
					...scope,
					entryId: messageId
				});
			}
			if (!anchor) return;
			const managedMedia = /* @__PURE__ */ new Map();
			let committed = false;
			try {
				const mediaScope = captureWebchatReplyMediaScope({
					requesterContext: params.requesterContext,
					cfg: session.cfg,
					sessionKey: scope.sessionKey,
					agentId: scope.agentId,
					sessionLoadOptions: session.sessionLoadOptions,
					accountId: params.accountId,
					assertCurrent
				});
				await withChannelReadAuthority(mediaScope.assertCurrent, async () => {
					const payloads = await normalizeWebchatReplyMediaPathsForDisplay({
						...mediaScope,
						payloads: mediaUrls.map((url) => ({ mediaUrls: [url] }))
					});
					assertCurrent();
					for (const [index, payload] of payloads.entries()) {
						const blocks = await createManagedOutgoingMediaBlocks({
							sessionKey: scope.sessionKey,
							agentId: scope.agentId,
							items: prepareOutgoingMediaFromReplyPayload(payload),
							localRoots: getWebchatReplyMediaLocalRoots({ ...mediaScope }),
							continueOnPrepareError: true,
							assertCurrent: mediaScope.assertCurrent,
							abortSignal: params.abortSignal
						});
						blocks.push(...(getReplyPayloadMetadata(payload)?.assistantMediaFailures ?? []).map(buildManagedMediaFailureBlock));
						managedMedia.set(mediaUrls[index], blocks);
						assertCurrent();
					}
				});
				const { waitForSessionTranscriptProjection } = await import("./config/sessions/session-transcript-reconcile.js");
				await waitForSessionTranscriptProjection(scope, params.abortSignal);
				assertCurrent();
				const rewritten = await rewriteTranscriptMessageAtAnchor(anchor, (value) => {
					assertCurrent();
					const active = readActiveTranscriptEntryAnchor({
						...scope,
						entryId: messageId
					});
					const currentMessage = asOptionalRecord(value);
					if (active?.rawSeq !== anchor.rawSeq || !currentMessage || readSessionTranscriptRunId(currentMessage) !== runId || !isDeepStrictEqual(currentMessage.content, originalContent)) return;
					const displayContent = [];
					for (const [index, raw] of originalContent.entries()) {
						const block = asOptionalRecord(raw);
						if (!block || !commentaryIndexes.has(index) || typeof block.text !== "string") {
							displayContent.push(raw);
							continue;
						}
						const segments = splitMediaFromOutput(block.text).segments ?? [{
							type: "text",
							text: block.text
						}];
						displayContent.push({
							...block,
							text: ""
						});
						for (const segment of segments) if (segment.type === "text") displayContent.push({
							...block,
							text: segment.text
						});
						else displayContent.push(...managedMedia.get(segment.url) ?? [{
							...block,
							text: `MEDIA:${segment.url}`
						}]);
					}
					return {
						...currentMessage,
						[ASSISTANT_DISPLAY_CONTENT_FIELD]: displayContent
					};
				});
				if (rewritten) {
					committed = true;
					lastRewrite = {
						sessionId: scope.sessionId,
						generation: rewritten.generation
					};
					const mediaBlocks = [...managedMedia.values()].flat().filter((block) => block.type === "image" || block.type === "audio" || block.type === "video" || block.type === "attachment");
					if (mediaBlocks.length > 0 && !attachManagedOutgoingMediaToMessage({
						messageId,
						blocks: mediaBlocks
					})) throw new Error("Webchat commentary media ownership could not be persisted");
					await publishAssistantTranscriptRewrite({
						scope,
						rewritten: [{ messageId }]
					});
				}
			} finally {
				if (!committed) await removeManagedOutgoingMediaBlocks({
					blocks: [...managedMedia.values()].flat(),
					messageId: null
				});
			}
		}).catch(reportPreparationFailure)).catch(reportPreparationFailure);
	});
	return { async close() {
		unsubscribe();
		await pending;
		return lastRewrite;
	} };
}
//#endregion
//#region src/gateway/server-methods/chat-tts-markers.ts
function stripVisibleTextFromTtsSupplement(payload) {
	return isReplyPayloadTtsSupplement(payload) ? buildTtsSupplementMediaPayload(payload) : payload;
}
function resolveTtsSupplementMarkerText(text) {
	const trimmed = text.trim();
	const projected = projectChatDisplayMessage({
		role: "assistant",
		content: [{
			type: "text",
			text: trimmed
		}]
	}, { maxChars: Number.MAX_SAFE_INTEGER });
	const projectedContent = Array.isArray(projected?.content) ? projected.content : void 0;
	return extractAssistantDisplayText(projectedContent) ?? (typeof projected?.text === "string" ? projected.text.trim() : void 0) ?? trimmed;
}
function buildTtsSupplementTranscriptMarker(payload) {
	const supplement = getReplyPayloadTtsSupplement(payload);
	if (!supplement) return;
	const visibleText = resolveTtsSupplementMarkerText(payload.text?.trim() || supplement.spokenText.trim());
	return { textSha256: createHash("sha256").update(visibleText).digest("hex") };
}
function buildMediaOnlyTtsSupplementTranscriptMarker(payload) {
	if (payload.text?.trim()) return;
	return buildTtsSupplementTranscriptMarker(payload);
}
//#endregion
//#region src/gateway/server-methods/chat-send-reply-dispatch.ts
function buildTranscriptReplyTextFromInputs(inputs) {
	const chunks = inputs.map((input) => {
		const payload = readChatSendReplyPayload(input);
		if (payload.isReasoning === true) return "";
		const parts = input.kind === "prepared" ? input.plan.parts : resolveSendableOutboundReplyParts(payload);
		const lines = [];
		const parsedText = input.kind === "raw" && payload.text?.includes("[[") ? parseInlineDirectives(payload.text) : void 0;
		const replyToId = sanitizeReplyDirectiveId(payload.replyToId) ?? sanitizeReplyDirectiveId(parsedText?.replyToExplicitId);
		if (replyToId) lines.push(`[[reply_to:${replyToId}]]`);
		else if (payload.replyToCurrent || parsedText?.replyToCurrent) lines.push("[[reply_to_current]]");
		const text = input.kind === "raw" && payload.text ? stripInlineDirectiveTagsForDelivery(payload.text).text : payload.text ?? "";
		if (text.trim() && (input.kind === "prepared" || !isSuppressedControlReplyText(text))) lines.push(text);
		for (const mediaUrl of parts.mediaUrls) {
			if (payload.sensitiveMedia === true) continue;
			const trimmed = mediaUrl.trim();
			if (trimmed) lines.push(`Attachment: ${trimmed}`);
		}
		if ((payload.audioAsVoice || parsedText?.audioAsVoice) && parts.mediaUrls.some((mediaUrl) => isAudioFileName(mediaUrl))) lines.push("[[audio_as_voice]]");
		return lines.join("\n");
	}).filter(Boolean);
	return combineNonStreamingReplyParts(chunks);
}
/** Build delivery options and capture state for the core-owned webchat dispatcher. */
function createChatSendReplyDispatch(params) {
	const { accountId, isAgentRunStarted, logGateway, session, userTurnRecorder } = params;
	const { backingSessionId, cfg, clientRunId } = session;
	const sessionLoadOptions = {
		...session.sessionLoadOptions,
		clone: false
	};
	let assistantTranscriptRewriteState = {
		sessionId: void 0,
		generation: null,
		afterSeq: 0
	};
	let agentRunId = clientRunId;
	let agentTranscriptLifecycleRevision;
	const captureAgentTranscriptStart = (runId = clientRunId) => {
		agentRunId = runId;
		const current = loadGatewaySessionEntry(session.sessionKey, sessionLoadOptions);
		const sessionId = current.entry?.sessionId ?? backingSessionId;
		const watermark = sessionId ? readSessionTranscriptWatermark({
			agentId: session.agentId,
			sessionId,
			sessionKey: session.sessionKey,
			storePath: current.storePath
		}) : {
			generation: null,
			maxSeq: null
		};
		assistantTranscriptRewriteState = {
			sessionId,
			generation: watermark.generation,
			afterSeq: watermark.maxSeq ?? 0
		};
		agentTranscriptLifecycleRevision = current.entry?.lifecycleRevision;
		return true;
	};
	const { onModelSelected, ...replyPipeline } = createChannelReplyPipeline({
		cfg,
		agentId: session.agentId,
		channel: INTERNAL_MESSAGE_CHANNEL
	});
	const deliveredReplies = [];
	const finalizedAgentMediaTranscriptKeys = /* @__PURE__ */ new Set();
	let appendedWebchatAgentMedia = false;
	let preparingTranscript = false;
	const prepareAssistantTranscriptMessage = (message, sourceText) => {
		if (!preparingTranscript || !isAgentRunStarted() || !params.isRunCurrent?.() || !sourceText) return message;
		const prepared = recordAssistantManagedMediaUrls(message, splitMediaFromOutput(sourceText).mediaUrls);
		return params.prepareAssistantTranscriptMessage?.(prepared, sourceText) ?? prepared;
	};
	const resolveReplyDelivery = async (minimumAssistantMessageIndex = 0) => {
		const admission = userTurnRecorder.getAdmissionReceipt();
		const transcriptStart = assistantTranscriptRewriteState;
		const runId = agentRunId;
		const lifecycleRevision = agentTranscriptLifecycleRevision;
		const isCurrent = () => {
			const currentAdmission = userTurnRecorder.getAdmissionReceipt();
			if (!admission || admission.agentId !== session.agentId || admission.sessionKey !== session.sessionKey || !isAgentRunStarted() || params.isRunCurrent?.() !== true || params.abortSignal?.aborted || agentRunId !== runId || assistantTranscriptRewriteState !== transcriptStart || currentAdmission?.logicalTurnId !== admission.logicalTurnId || currentAdmission?.entryId !== admission.entryId) return false;
			const current = loadGatewaySessionEntry(session.sessionKey, sessionLoadOptions);
			return current.entry?.sessionId === admission.sessionId && current.entry.lifecycleRevision === lifecycleRevision && resolveSessionTranscriptDatabasePath({
				agentId: session.agentId,
				sessionId: admission.sessionId,
				sessionKey: session.sessionKey,
				storePath: current.storePath
			}) === admission.storePath;
		};
		if (!admission || transcriptStart.sessionId !== admission.sessionId || !isCurrent()) return "missing";
		const scope = admission;
		await waitForSessionTranscriptProjection(scope, params.abortSignal);
		if (!isCurrent()) return "missing";
		const input = readActiveTranscriptEntryAnchor(admission);
		if (!input || input.rawSeq !== admission.rawSeq) return "missing";
		const watermark = readSessionTranscriptWatermark(scope);
		let latestInputPosition = input.activeMessagePosition;
		let latestInputId = input.entryId;
		const candidateIds = [];
		for (const { event } of loadTranscriptEventRowsAfterSeqSync(scope, transcriptStart.afterSeq)) {
			const row = asOptionalRecord(event);
			const message = asOptionalRecord(row?.message);
			if (typeof row?.id !== "string") continue;
			if (message?.role === "user") {
				const anchor = readActiveTranscriptEntryAnchor({
					...scope,
					entryId: row.id
				});
				if (anchor && anchor.activeMessagePosition > latestInputPosition) {
					latestInputPosition = anchor.activeMessagePosition;
					latestInputId = anchor.entryId;
				}
			} else if (message?.role === "assistant" && readSessionTranscriptRunId(message) === runId) candidateIds.push(row.id);
		}
		if (minimumAssistantMessageIndex > 0 && latestInputId === input.entryId) return "missing";
		for (const messageId of candidateIds) {
			const stored = await readSessionMessageByIdAsync(scope, messageId, {
				currentOnly: true,
				maxBytes: Number.MAX_SAFE_INTEGER
			});
			if (!isCurrent() || !readActiveTranscriptEntryAnchor(admission)) return "missing";
			if (!stored.found) continue;
			const currentInput = readActiveTranscriptEntryAnchor({
				...scope,
				entryId: latestInputId
			});
			if (!currentInput) return "missing";
			const anchor = readActiveTranscriptEntryAnchor({
				...scope,
				entryId: messageId
			});
			const message = asOptionalRecord(stored.message);
			if (!anchor || anchor.rawSeq <= transcriptStart.afterSeq || anchor.activeMessagePosition <= currentInput.activeMessagePosition || message?.role !== "assistant" || readSessionTranscriptRunId(message) !== runId) continue;
			const answer = message.stopReason === "toolUse" || Array.isArray(message.content) && message.content.some((block) => isToolHistoryBlockType(asOptionalRecord(block)?.type)) ? extractAssistantTextForPhase(message, { phase: "final_answer" }) : extractAssistantPhaseText(message);
			if (answer && !isSuppressedControlReplyText(answer) && extractAssistantPhaseText(projectChatDisplayMessage(message))) {
				const currentWatermark = readSessionTranscriptWatermark(scope);
				if (currentWatermark.generation !== watermark.generation || currentWatermark.maxSeq !== watermark.maxSeq) {
					for (const { event } of loadTranscriptEventRowsAfterSeqSync(scope, transcriptStart.afterSeq)) {
						const row = asOptionalRecord(event);
						if (asOptionalRecord(row?.message)?.role !== "user" || typeof row?.id !== "string") continue;
						const newerInput = readActiveTranscriptEntryAnchor({
							...scope,
							entryId: row.id
						});
						if (newerInput && newerInput.activeMessagePosition > anchor.activeMessagePosition) return "missing";
					}
					return "pending";
				}
				return "delivered";
			}
		}
		return "missing";
	};
	const needsAgentMediaTranscriptFinalization = (payload) => isMediaBearingPayload(payload) || Boolean(getReplyPayloadMetadata(payload)?.assistantMediaFailures?.length);
	const agentMediaTranscriptKey = (payload) => {
		const metadata = getReplyPayloadMetadata(payload);
		const ownedIdempotencyKey = metadata?.assistantTranscriptOwned === true ? metadata.assistantTranscriptIdempotencyKey?.trim() : void 0;
		if (ownedIdempotencyKey) return `owned:${ownedIdempotencyKey}`;
		if (metadata?.assistantMessageIndex !== void 0) return `index:${metadata.assistantMessageIndex}`;
		return "unkeyed";
	};
	const appendWebchatAgentMediaTranscriptIfNeeded = async (input) => {
		const payload = readChatSendReplyPayload(input);
		if (!isAgentRunStarted() || !needsAgentMediaTranscriptFinalization(payload)) return;
		const finalizationKey = agentMediaTranscriptKey(payload);
		if (finalizedAgentMediaTranscriptKeys.has(finalizationKey)) return;
		if (isSourceReplyTranscriptMirrorPayload(payload)) return;
		const replyDispatchRun = params.getReplyDispatchRun?.();
		const transcript = replyDispatchRun?.getResult().assistantTranscript;
		if (replyDispatchRun && !transcript) {
			logGateway.warn("webchat runtime-owned media skipped: assistant transcript was not persisted");
			return;
		}
		const sessionKey = transcript?.sessionKey ?? session.sessionKey;
		const agentId = transcript?.agentId ?? session.agentId;
		const ttsSupplementMarker = buildTtsSupplementTranscriptMarker(payload);
		const mediaScope = captureWebchatReplyMediaScope({
			requesterContext: params.requesterContext,
			cfg,
			sessionKey,
			agentId,
			sessionLoadOptions: {
				...sessionLoadOptions,
				agentId
			},
			accountId,
			assertCurrent: () => {
				params.abortSignal?.throwIfAborted();
				if (params.isRunCurrent && !params.isRunCurrent()) throw new Error("Chat media run is no longer current.");
			}
		});
		const { storePath: latestStorePath, entry: latestEntry } = loadGatewaySessionEntry(sessionKey, {
			...sessionLoadOptions,
			...agentId ? { agentId } : {}
		});
		const sessionId = latestEntry?.sessionId ?? backingSessionId ?? clientRunId;
		const { payloads: [transcriptPayload], inputs: transcriptInputs, mediaMessage, assistantContent, persistedAssistantContent } = await prepareWebchatReplyMediaForDisplay({
			scope: mediaScope,
			storePath: latestStorePath,
			inputs: replaceChatSendReplyPayload(input, stripVisibleTextFromTtsSupplement(payload)),
			abortSignal: params.abortSignal,
			includeSensitiveMedia: payload.sensitiveMedia !== true,
			onLocalAudioAccessDenied: (err) => {
				logGateway.warn(`webchat audio embedding denied local path: ${formatForLog(err)}`);
			},
			onManagedMediaPrepareError: (message) => {
				logGateway.warn(`webchat media embedding skipped attachment: ${message}`);
			}
		});
		if (!transcriptPayload) return;
		const mediaFailures = getReplyPayloadMetadata(transcriptPayload)?.assistantMediaFailures ?? [];
		const mediaNormalizationFailed = mediaFailures.length > 0;
		const persistedContentForAppend = hasAssistantDisplayMediaContent(persistedAssistantContent) || mediaNormalizationFailed ? persistedAssistantContent : void 0;
		if (!persistedContentForAppend?.length) return;
		const transcriptReply = mediaMessage?.transcriptText ?? extractAssistantDisplayText(assistantContent) ?? buildTranscriptReplyTextFromInputs(transcriptInputs);
		const payloadMetadata = getReplyPayloadMetadata(payload);
		const sourceMediaUrls = Array.from(new Set(payloadMetadata?.assistantTranscriptMediaUrls?.length ? payloadMetadata.assistantTranscriptMediaUrls : [...Array.isArray(payload.mediaUrls) ? payload.mediaUrls : [], ...typeof payload.mediaUrl === "string" ? [payload.mediaUrl] : []]));
		const ownedTranscriptIdempotencyKey = transcript?.idempotencyKey ?? (payloadMetadata?.assistantTranscriptOwned === true ? payloadMetadata.assistantTranscriptIdempotencyKey?.trim() : void 0);
		const transcriptScope = assistantTranscriptScope({
			sessionKey,
			sessionId,
			storePath: latestStorePath,
			agentId
		});
		if (ownedTranscriptIdempotencyKey && transcriptScope) {
			if (transcript && loadGatewaySessionEntry(sessionKey, {
				...sessionLoadOptions,
				agentId
			}).entry?.sessionId !== transcript.sessionId) {
				logGateway.warn("webchat runtime-owned media skipped: transcript session changed");
				return;
			}
			const rewritten = await rewriteAssistantTranscriptMessageByIdempotencyKey({
				content: persistedContentForAppend,
				idempotencyKey: ownedTranscriptIdempotencyKey,
				managedMediaUrls: sourceMediaUrls,
				scope: transcriptScope
			});
			if (rewritten) {
				appendedWebchatAgentMedia = true;
				finalizedAgentMediaTranscriptKeys.add(finalizationKey);
				await publishAssistantTranscriptRewrite({
					scope: transcriptScope,
					rewritten: [rewritten]
				});
				if (assistantContent?.length) attachManagedOutgoingMediaToMessage({
					messageId: rewritten.messageId,
					blocks: assistantContent
				});
				return;
			}
			logGateway.warn("webchat runtime-owned assistant media rewrite skipped: transcript identity not found");
			return;
		}
		const assistantMessageIndex = payloadMetadata?.assistantMessageIndex;
		if (assistantMessageIndex !== void 0 && transcriptScope) {
			if (assistantTranscriptRewriteState.sessionId !== sessionId) assistantTranscriptRewriteState = {
				sessionId,
				generation: null,
				afterSeq: 0
			};
			const rewritten = await rewriteAssistantTranscriptMessageByTurnIndexAndMedia({
				afterSeq: assistantTranscriptRewriteState.afterSeq,
				assistantMessageIndex,
				content: persistedContentForAppend,
				expectedGeneration: assistantTranscriptRewriteState.generation,
				mediaUrls: sourceMediaUrls,
				scope: transcriptScope
			});
			if (rewritten) {
				assistantTranscriptRewriteState.generation = rewritten.generation;
				appendedWebchatAgentMedia = true;
				finalizedAgentMediaTranscriptKeys.add(finalizationKey);
				await publishAssistantTranscriptRewrite({
					scope: transcriptScope,
					rewritten: [rewritten]
				});
				if (assistantContent?.length) attachManagedOutgoingMediaToMessage({
					messageId: rewritten.messageId,
					blocks: assistantContent
				});
				return;
			}
		}
		const hasOnlyFailureDisplay = persistedContentForAppend.some((block) => block.type === "attachment_error") && persistedContentForAppend.every((block) => block.type === "text" || block.type === "attachment_error");
		const runtimeOwnedText = stripReplyMediaFailureFallback(transcriptPayload.text, mediaFailures)?.trim();
		if (assistantMessageIndex === void 0 && mediaNormalizationFailed && hasOnlyFailureDisplay && runtimeOwnedText) return;
		const isRuntimeMediaSupplement = assistantMessageIndex !== void 0 && assistantMessageIndex >= 1 && !mediaNormalizationFailed && !ttsSupplementMarker && !payload.isError && !isReplyPayloadStatusNotice(payload) && !payloadMetadata?.toolErrorWarning && !payloadMetadata?.nonTerminalToolErrorWarning && !payloadMetadata?.terminalProviderError;
		const appendContent = isRuntimeMediaSupplement ? persistedContentForAppend.filter((block) => block.type !== "text") : persistedContentForAppend;
		const appended = await appendAssistantTranscriptMessage({
			sessionKey,
			message: isRuntimeMediaSupplement ? "" : transcriptReply,
			content: appendContent,
			sessionId,
			storePath: latestStorePath,
			agentId,
			createIfMissing: true,
			idempotencyKey: assistantMessageIndex !== void 0 && assistantMessageIndex >= 1 ? `${clientRunId}:assistant-media:${assistantMessageIndex}` : `${clientRunId}:assistant-media`,
			ttsSupplement: ttsSupplementMarker,
			cfg
		});
		if (appended.ok) {
			if (appended.messageId && assistantContent?.length) attachManagedOutgoingMediaToMessage({
				messageId: appended.messageId,
				blocks: assistantContent
			});
			appendedWebchatAgentMedia = true;
			finalizedAgentMediaTranscriptKeys.add(finalizationKey);
			return;
		}
		logGateway.warn(`webchat transcript append failed for media reply: ${appended.error ?? "unknown error"}`);
	};
	const deliverInput = async (input, info) => {
		const payload = readChatSendReplyPayload(input);
		const payloadMetadata = getReplyPayloadMetadata(payload);
		if (payloadMetadata?.beforeAgentRunBlocked === true || payloadMetadata?.sourceReplyTranscriptMirror?.transcriptWriteBlocked === true) userTurnRecorder.markBlocked();
		switch (info.kind) {
			case "block":
			case "final":
				deliveredReplies.push({
					input,
					kind: info.kind
				});
				if (info.kind === "block" && params.onCommandBlock && !isAgentRunStarted() && params.isRunCurrent?.()) {
					const parts = deliveredReplies.map(({ input: replyInput, kind }) => {
						const reply = readChatSendReplyPayload(replyInput);
						if (kind !== "block" || reply.isReasoning === true || isBtwReplyPayload(reply)) return "";
						const text = (replyInput.kind === "prepared" ? prepareAssistantDisplayText : sanitizeAssistantDisplayText)(reply.text, { preserveBoundaries: true });
						return text && (replyInput.kind === "prepared" || !isSuppressedControlReplyText(text)) ? text : "";
					});
					if (parts.at(-1)) params.onCommandBlock(combineNonStreamingReplyParts(parts));
				}
				break;
			case "tool": if (isMediaBearingPayload(payload)) {
				const mediaPayload = copyReplyPayloadMetadata(payload, {
					...payload,
					text: void 0
				});
				deliveredReplies.push(...replaceChatSendReplyPayload(input, mediaPayload).map((mediaInput) => ({
					input: mediaInput,
					kind: "final"
				})));
			}
		}
	};
	const dispatcherOptions = {
		...replyPipeline,
		onError: (err) => {
			logGateway.warn(`webchat dispatch failed: ${formatForLog(err)}`);
		},
		deliver: (payload, info) => deliverInput({
			kind: "raw",
			payload
		}, info),
		deliverPrepared: (plan, info) => deliverInput({
			kind: "prepared",
			plan
		}, info)
	};
	const finalizeAgentMediaTranscript = async () => {
		const latestPayloadByKey = /* @__PURE__ */ new Map();
		for (const { input } of deliveredReplies) {
			const payload = readChatSendReplyPayload(input);
			if (!needsAgentMediaTranscriptFinalization(payload)) continue;
			latestPayloadByKey.set(agentMediaTranscriptKey(payload), input);
		}
		for (const input of latestPayloadByKey.values()) try {
			await appendWebchatAgentMediaTranscriptIfNeeded(input);
		} catch (error) {
			logGateway.warn(`webchat media finalization failed: ${formatForLog(error)}`);
		}
	};
	const runAgentMediaTranscript = async (admission, operation) => {
		return await admission.run(async () => {
			preparingTranscript = true;
			const commentaryMedia = observeChatSendCommentaryMedia({
				requesterContext: params.requesterContext,
				session,
				accountId,
				getRunId: () => agentRunId,
				isCurrent: () => isAgentRunStarted() && params.isRunCurrent?.() === true,
				abortSignal: params.abortSignal,
				logGateway
			});
			try {
				return await operation();
			} finally {
				preparingTranscript = false;
				const commentaryRewrite = await commentaryMedia.close();
				if (commentaryRewrite && commentaryRewrite.sessionId === assistantTranscriptRewriteState.sessionId) assistantTranscriptRewriteState.generation = commentaryRewrite.generation;
				await finalizeAgentMediaTranscript();
			}
		});
	};
	return {
		captureAgentTranscriptStart,
		deliveredReplies,
		dispatcherOptions,
		hasAppendedWebchatAgentMedia: () => appendedWebchatAgentMedia,
		onModelSelected,
		prepareAssistantTranscriptMessage,
		resolveReplyDelivery,
		runAgentMediaTranscript
	};
}
//#endregion
//#region src/gateway/server-methods/chat-send-delivery-authority.ts
function isChatSendReplyDeliveryAuthorized(params) {
	const authority = getReplyPayloadMetadata(params.payload)?.sessionWriterDeliveryAuthority;
	if (!authority) return true;
	const current = loadGatewaySessionEntry(authority.sessionKey, {
		...params.sessionLoadOptions,
		...authority.agentId || params.agentId ? { agentId: authority.agentId ?? params.agentId } : {}
	}).entry;
	return isReplyPayloadSessionWriterDeliveryAuthorized(params.payload, current);
}
//#endregion
//#region src/gateway/server-methods/chat-send-reply-finalization.ts
function resolveTranscriptMirrorOwner(payloads) {
	if (payloads.length === 0) return { kind: "none" };
	const owners = payloads.map((payload) => getReplyPayloadMetadata(payload)?.sourceReplyTranscriptMirror);
	if (owners.every((owner) => owner?.expectedSessionId === void 0 && !owner?.transcriptWriteBlocked)) return { kind: "none" };
	const first = owners[0];
	if (!first) return { kind: "invalid" };
	const sessionKey = first.sessionKey.trim();
	const expectedSessionId = first.expectedSessionId?.trim();
	if (first.transcriptWriteBlocked) {
		if (!sessionKey || owners.some((owner) => !owner?.transcriptWriteBlocked || owner.sessionKey.trim() !== sessionKey || owner.expectedSessionId?.trim() !== expectedSessionId || owner.agentId !== first.agentId)) return { kind: "invalid" };
		return {
			kind: "blocked",
			owner: {
				sessionKey,
				...expectedSessionId ? { expectedSessionId } : {},
				...first.agentId ? { agentId: first.agentId } : {}
			}
		};
	}
	if (!sessionKey || !expectedSessionId || owners.some((owner) => owner?.sessionKey.trim() !== sessionKey || owner.expectedSessionId?.trim() !== expectedSessionId || owner.agentId !== first.agentId || owner.transcriptWriteBlocked === true)) return { kind: "invalid" };
	return {
		kind: "owner",
		owner: {
			sessionKey,
			expectedSessionId,
			...first.agentId ? { agentId: first.agentId } : {}
		}
	};
}
function buildChatSendBtwSideResult(deliveredReplies) {
	const replies = deliveredReplies.map((entry) => readChatSendReplyPayload(entry.input)).filter(isBtwReplyPayload);
	const text = combineNonStreamingReplyParts(replies.map((payload) => payload.text));
	if (replies.length === 0 || !text) return;
	return {
		question: expectDefined(replies[0], "btw replies entry at 0").btw.question.trim(),
		text,
		isError: replies.some((payload) => payload.isError)
	};
}
/** Finalize settled reply payloads, retaining the runtime's transcript ownership and outcome. */
async function finalizeChatSendDispatchedReplies(params) {
	const { accountId, context, deliveredReplies, emitFirstAssistantServerTiming, foldCommandBlocks, persistUserTurnTranscript, session, suppressReplies } = params;
	const { agentId, backingSessionId, cfg, clientRunId, sessionKey, sessionLoadOptions } = session;
	const stopReason = params.state === "aborted" ? "aborted" : "stop";
	const btwResult = buildChatSendBtwSideResult(deliveredReplies);
	if (btwResult) {
		broadcastSideResult({
			context,
			payload: {
				kind: "btw",
				runId: clientRunId,
				sessionKey,
				...agentId ? { agentId } : {},
				...btwResult,
				ts: Date.now()
			}
		});
		broadcastChatFinal({
			context,
			runId: clientRunId,
			sessionKey,
			agentId
		});
		return;
	}
	const contextFreeCommand = !params.runtimeOwnsTranscript && deliveredReplies.length > 0 && deliveredReplies.every(({ input }) => {
		const payload = readChatSendReplyPayload(input);
		const metadata = getReplyPayloadMetadata(payload);
		return metadata?.commandReply === true && metadata.contextFreeCommand === true && metadata.assistantTranscriptOwned !== true;
	});
	const selectedInputs = selectChatSendFinalReplyInputs({
		deliveredReplies,
		foldCommandBlocks,
		suppressReplies
	});
	const rawFinalPayloads = selectedInputs.map(readChatSendReplyPayload);
	const deliveryAuthorized = () => rawFinalPayloads.every((payload) => isChatSendReplyDeliveryAuthorized({
		agentId,
		payload,
		sessionLoadOptions
	}));
	if (!deliveryAuthorized()) {
		context.logGateway.warn("webchat settled final reply skipped: session writer changed before finalization");
		broadcastChatFinal({
			context,
			runId: clientRunId,
			sessionKey,
			agentId
		});
		return;
	}
	const transcriptMirrorResolution = resolveTranscriptMirrorOwner(rawFinalPayloads);
	const transcriptMirrorOwner = transcriptMirrorResolution.kind === "owner" || transcriptMirrorResolution.kind === "blocked" ? transcriptMirrorResolution.owner : void 0;
	const mediaScope = captureWebchatReplyMediaScope({
		requesterContext: params.requesterContext,
		cfg,
		sessionKey,
		agentId,
		sessionLoadOptions,
		accountId,
		assertCurrent: () => {
			if (!deliveryAuthorized()) throw new Error("Chat media delivery is no longer authorized.");
		}
	});
	const sourceSession = loadGatewaySessionEntry(sessionKey, sessionLoadOptions);
	const requestedTranscriptSession = transcriptMirrorOwner ? loadGatewaySessionEntry(transcriptMirrorOwner.sessionKey, {
		...sessionLoadOptions,
		...transcriptMirrorOwner.agentId ? { agentId: transcriptMirrorOwner.agentId } : {}
	}) : void 0;
	const useTranscriptMirrorOwner = Boolean(transcriptMirrorResolution.kind === "owner" && transcriptMirrorOwner && requestedTranscriptSession?.entry?.sessionId === transcriptMirrorOwner.expectedSessionId);
	if (transcriptMirrorResolution.kind === "owner" && !useTranscriptMirrorOwner) context.logGateway.warn(`webchat transcript append skipped: binding-owned session changed before finalization`);
	if (transcriptMirrorResolution.kind === "invalid") context.logGateway.warn(`webchat transcript append skipped: inconsistent binding-owned transcript metadata`);
	if (transcriptMirrorResolution.kind === "blocked") context.logGateway.warn(`webchat transcript append skipped: binding-owned user turn was not persisted`);
	const canAppendAssistantTranscript = transcriptMirrorResolution.kind === "none" || useTranscriptMirrorOwner;
	const transcriptSessionKey = useTranscriptMirrorOwner && transcriptMirrorOwner ? transcriptMirrorOwner.sessionKey : sessionKey;
	const transcriptAgentId = useTranscriptMirrorOwner && transcriptMirrorOwner ? transcriptMirrorOwner.agentId ?? agentId : agentId;
	const { storePath: latestStorePath, entry: latestEntry } = useTranscriptMirrorOwner && requestedTranscriptSession ? requestedTranscriptSession : sourceSession;
	const sessionId = latestEntry?.sessionId ?? backingSessionId ?? clientRunId;
	let managedMediaPrepareFailed = false;
	const { payloads: finalPayloads, inputs: finalInputs, mediaMessage, assistantContent, persistedAssistantContent } = await prepareWebchatReplyMediaForDisplay({
		scope: mediaScope,
		storePath: sourceSession.storePath,
		transcriptTarget: {
			sessionKey: transcriptSessionKey,
			agentId: transcriptAgentId
		},
		inputs: selectedInputs,
		abortSignal: params.abortSignal,
		includeSensitiveMedia: false,
		includeSensitiveDisplay: true,
		onLocalAudioAccessDenied: (err) => {
			context.logGateway.warn(`webchat audio embedding denied local path: ${formatForLog(err)}`);
		},
		onManagedMediaPrepareError: (message) => {
			managedMediaPrepareFailed = true;
			context.logGateway.warn(`webchat media embedding skipped attachment: ${message}`);
		},
		onSensitiveDisplayPrepareError: (message) => {
			context.logGateway.warn(`webchat sensitive display skipped attachment: ${message}`);
		}
	});
	const ttsSupplementMarker = finalPayloads.map((payload) => buildMediaOnlyTtsSupplementTranscriptMarker(payload)).find((marker) => Boolean(marker));
	const persistedContentForAppend = hasAssistantDisplayMediaContent(persistedAssistantContent) ? persistedAssistantContent : void 0;
	const broadcastAssistantContent = hasAssistantDisplayMediaContent(assistantContent) ? assistantContent : hasAssistantDisplayMediaContent(mediaMessage?.content) ? mediaMessage?.content : assistantContent;
	const displayReply = extractAssistantDisplayText(assistantContent) ?? buildTranscriptReplyTextFromInputs(finalInputs);
	const transcriptDisplayReply = displayReply?.trim() ?? "";
	const transcriptReply = mediaMessage?.transcriptText || (managedMediaPrepareFailed ? transcriptDisplayReply : buildTranscriptReplyTextFromInputs(finalInputs)) || transcriptDisplayReply;
	let message;
	const payloadOwnsAssistantTranscript = rawFinalPayloads.some((payload) => getReplyPayloadMetadata(payload)?.assistantTranscriptOwned === true);
	const shouldAppendAssistantTranscript = Boolean((!params.runtimeOwnsTranscript && !payloadOwnsAssistantTranscript || useTranscriptMirrorOwner) && canAppendAssistantTranscript && (transcriptReply || persistedContentForAppend?.length));
	if (contextFreeCommand) await persistUserTurnTranscript({ contextFreeCommand: true });
	else await persistUserTurnTranscript();
	if (!deliveryAuthorized()) {
		context.logGateway.warn("webchat settled final reply skipped: session writer changed before transcript append");
		broadcastChatFinal({
			context,
			runId: clientRunId,
			sessionKey,
			agentId
		});
		return;
	}
	if (shouldAppendAssistantTranscript) {
		const appended = await appendAssistantTranscriptMessage({
			sessionKey: transcriptSessionKey,
			message: transcriptReply,
			...persistedContentForAppend?.length ? { content: persistedContentForAppend } : {},
			sessionId,
			storePath: latestStorePath,
			agentId: transcriptAgentId,
			createIfMissing: true,
			idempotencyKey: clientRunId,
			stopReason,
			ttsSupplement: ttsSupplementMarker,
			...contextFreeCommand ? { contextFreeCommand: true } : {},
			cfg
		});
		if (appended.ok) {
			if (appended.messageId && assistantContent?.length) attachManagedOutgoingMediaToMessage({
				messageId: appended.messageId,
				blocks: assistantContent
			});
			message = broadcastAssistantContent?.length ? applyAssistantDeliveryDirectives({
				...appended.message,
				content: broadcastAssistantContent.map((block) => ({ ...block }))
			}) : appended.message;
		} else {
			context.logGateway.warn(`webchat transcript append failed: ${appended.error ?? "unknown error"}`);
			const fallbackAssistantContent = stripManagedOutgoingAssistantContentBlocks(persistedAssistantContent) ?? stripManagedOutgoingAssistantContentBlocks(assistantContent);
			const fallbackText = extractAssistantDisplayText(fallbackAssistantContent) ?? displayReply;
			message = {
				role: "assistant",
				...fallbackAssistantContent?.length ? { content: fallbackAssistantContent } : fallbackText ? { content: [{
					type: "text",
					text: fallbackText
				}] } : {},
				...fallbackText ? { text: fallbackText } : {},
				timestamp: Date.now(),
				...ttsSupplementMarker ? { openclawTtsSupplement: ttsSupplementMarker } : {},
				stopReason,
				usage: {
					input: 0,
					output: 0,
					totalTokens: 0
				}
			};
		}
	} else if (broadcastAssistantContent?.length) message = {
		role: "assistant",
		content: broadcastAssistantContent,
		text: extractAssistantDisplayText(broadcastAssistantContent) ?? "",
		timestamp: Date.now(),
		stopReason,
		usage: {
			input: 0,
			output: 0,
			totalTokens: 0
		}
	};
	if (!deliveryAuthorized()) {
		context.logGateway.warn("webchat settled final reply skipped: session writer changed before broadcast");
		broadcastChatFinal({
			context,
			runId: clientRunId,
			sessionKey,
			agentId
		});
		return;
	}
	const run = context.chatRunState.runs.get(clientRunId);
	if (!suppressReplies && run?.bufferIsCurrent?.() !== false) message = appendChatCanvasBlocksToMessage(message, run?.canvasBlocks ?? []);
	if (hasVisibleAssistantFinalMessage(message)) emitFirstAssistantServerTiming();
	broadcastChatTerminal({
		context,
		runId: clientRunId,
		sessionKey,
		agentId,
		message,
		state: params.state,
		stopReason: params.stopReason
	});
}
//#endregion
//#region src/gateway/server-methods/chat-send-source-finalization.ts
function selectChatSendAgentReplyInputs(params) {
	return params.deliveredReplies.filter((entry) => {
		const payload = readChatSendReplyPayload(entry.input);
		return getReplyPayloadMetadata(payload)?.sessionWriterDeliveryAuthority || isSourceReplyTranscriptMirrorPayload(payload) ? entry.kind === "final" && payload.isError !== true : !params.hasReturnedAgentErrorPayloads && isReplyPayloadStatusNotice(payload);
	}).map((entry) => entry.input);
}
function createChatSendLateReplyFinalizer(params) {
	return async ({ runId, payloads, completion, isCurrent }) => {
		const { context, session } = params;
		const broadcastParams = {
			context,
			runId,
			sessionKey: session.sessionKey,
			agentId: session.agentId
		};
		const terminal = completion.kind !== "progress";
		let publicationStarted = false;
		try {
			const result = await finalizeChatSendAgentReplyPayloads({
				...params,
				emitFirstAssistantServerTiming: () => {},
				inputs: payloads.map((payload) => ({
					kind: "raw",
					payload
				})),
				isCurrent,
				session: {
					...session,
					clientRunId: runId
				},
				suppressFinal: completion.kind === "failed" || completion.kind === "aborted",
				publishMessage: (message, deliveryAuthorized) => {
					publicationStarted = true;
					if (completion.kind === "progress") {
						const text = typeof message.text === "string" ? message.text : void 0;
						if (text) {
							const run = context.chatRunState.getOrCreate(runId);
							broadcastChatDelta({
								...broadcastParams,
								text,
								isCurrent: () => context.chatRunState.runs.get(runId) === run && deliveryAuthorized()
							});
						}
					} else {
						const run = context.chatRunState.runs.get(runId);
						broadcastChatTerminal({
							...broadcastParams,
							state: "final",
							message: run?.bufferIsCurrent?.() === false ? message : appendChatCanvasBlocksToMessage(message, run?.canvasBlocks ?? []),
							stopReason: completion.stopReason
						});
					}
				}
			});
			if (completion.kind === "failed" || completion.kind === "aborted" || terminal && result.kind === "dropped") {
				const buffered = context.chatRunState.resolveBuffer(runId, { final: true });
				const run = context.chatRunState.runs.get(runId);
				const canvas = run?.bufferIsCurrent?.() === false ? [] : run?.canvasBlocks ?? [];
				const canvasOnly = completion.kind === "completed" && completion.allowCanvasOnly === true && payloads.length === 0 && canvas.length > 0 && !(run?.rawBuffer ?? run?.buffer ?? "").trim();
				if (completion.kind === "failed" || completion.kind === "aborted") context.chatRunState.flushPendingText(runId);
				publicationStarted = true;
				broadcastChatTerminal({
					...broadcastParams,
					stopReason: completion.stopReason,
					...completion.kind === "failed" ? {
						state: "error",
						errorMessage: completion.error,
						errorKind: completion.errorKind
					} : {
						state: completion.kind === "aborted" ? "aborted" : "final",
						...completion.kind === "aborted" && buffered.text && !buffered.suppress || canvasOnly ? { message: appendChatCanvasBlocksToMessage({
							role: "assistant",
							content: canvasOnly ? [] : [{
								type: "text",
								text: buffered.text
							}],
							timestamp: Date.now()
						}, canvas) } : {}
					}
				});
			}
			return terminal ? {
				kind: "delivered",
				hasSourceReplyTranscriptMirror: result.kind === "delivered" && result.hasSourceReplyTranscriptMirror
			} : result;
		} catch (error) {
			if (terminal && !publicationStarted) {
				context.chatRunState.flushPendingText(runId);
				broadcastChatTerminal({
					...broadcastParams,
					state: "error",
					errorMessage: formatErrorMessage(error)
				});
			}
			throw error;
		} finally {
			if (terminal) {
				context.removeChatRun(runId, runId, session.sessionKey);
				context.chatRunState.clearRun(runId);
				context.agentRunSeq.delete(runId);
			}
		}
	};
}
async function finalizeChatSendAgentReplyPayloads(params) {
	const { accountId, context, emitFirstAssistantServerTiming, session } = params;
	const { agentId, backingSessionId, cfg, clientRunId, sessionKey, sessionLoadOptions } = session;
	const agentRunReplyPayloads = params.inputs.map(readChatSendReplyPayload);
	if (agentRunReplyPayloads.length === 0) return {
		kind: "dropped",
		reason: "no-visible-content"
	};
	const deliveryAuthorized = () => (!params.isCurrent || params.isCurrent()) && agentRunReplyPayloads.every((payload) => isChatSendReplyDeliveryAuthorized({
		agentId,
		payload,
		sessionLoadOptions
	}));
	if (!deliveryAuthorized()) {
		context.logGateway.warn("webchat settled final reply skipped: session writer changed before finalization");
		return {
			kind: "dropped",
			reason: "no-visible-content"
		};
	}
	const hasSourceReplyTranscriptMirror = agentRunReplyPayloads.some(isSourceReplyTranscriptMirrorPayload);
	const mediaScope = captureWebchatReplyMediaScope({
		requesterContext: params.requesterContext,
		cfg,
		sessionKey,
		agentId,
		sessionLoadOptions,
		accountId,
		assertCurrent: () => {
			if (!deliveryAuthorized()) throw new Error("Chat media delivery is no longer authorized.");
		}
	});
	const { storePath: latestStorePath, entry: latestEntry } = loadGatewaySessionEntry(sessionKey, sessionLoadOptions);
	const sessionId = latestEntry?.sessionId ?? backingSessionId ?? clientRunId;
	const { finalInputsByIndex, sourceReplyContentStates, sourceReplyBroadcastContent } = await withChannelReadAuthority(mediaScope.assertCurrent, async () => {
		const normalizedPayloads = await normalizeWebchatReplyMediaPathsForDisplay({
			...mediaScope,
			payloads: agentRunReplyPayloads
		});
		const normalizedInputsByIndex = params.inputs.map((input, index) => {
			const payload = normalizedPayloads[index];
			return payload ? replaceChatSendReplyPayload(input, payload) : [];
		});
		const mediaLocalRoots = getWebchatReplyMediaLocalRoots({
			...mediaScope,
			storePath: latestStorePath
		});
		const buildReplyContent = async (inputs) => {
			const mediaMessage = await buildWebchatAssistantMessageFromReplyPayloads(inputs.map(readChatSendReplyPayload), {
				assertCurrent: captureChannelReadAuthority(),
				localRoots: mediaLocalRoots,
				onLocalAudioAccessDenied: (err) => {
					context.logGateway.warn(`webchat audio embedding denied local path: ${formatForLog(err)}`);
				}
			});
			return {
				...await buildAssistantReplyContentFromInputs({
					assertCurrent: mediaScope.assertCurrent,
					abortSignal: params.abortSignal,
					sessionKey,
					agentId,
					inputs,
					transcriptMediaMessage: mediaMessage,
					managedMediaLocalRoots: mediaLocalRoots,
					includeSensitiveMedia: false,
					onManagedMediaPrepareError: (message) => {
						context.logGateway.warn(`webchat media embedding skipped attachment: ${message}`);
					}
				}),
				mediaMessage
			};
		};
		const contentStates = [];
		const broadcastContent = [];
		for (const [replyIndex] of agentRunReplyPayloads.entries()) {
			if (!normalizedPayloads[replyIndex]) continue;
			const { assistantContent: replyAssistantContent, persistedAssistantContent: persistedContent, mediaMessage: replyMediaMessage } = await buildReplyContent(normalizedInputsByIndex[replyIndex] ?? []);
			const replyBroadcastContent = hasAssistantDisplayMediaContent(replyAssistantContent) ? replyAssistantContent : hasAssistantDisplayMediaContent(replyMediaMessage?.content) ? replyMediaMessage?.content : replyAssistantContent;
			const state = {
				broadcastContent: replyBroadcastContent ? [...replyBroadcastContent] : [],
				persistedContent: persistedContent ? [...persistedContent] : [],
				hasManagedOutgoingContent: hasManagedOutgoingAssistantContent(persistedContent),
				backedManagedOutgoingContent: false
			};
			contentStates[replyIndex] = state;
			if (state.broadcastContent.length > 0) broadcastContent.push(...state.broadcastContent);
		}
		return {
			finalInputsByIndex: normalizedInputsByIndex,
			sourceReplyContentStates: contentStates,
			sourceReplyBroadcastContent: broadcastContent
		};
	}, agentRunReplyPayloads.some((payload) => resolveSendableOutboundReplyParts(payload).mediaUrls.length > 0) ? params.abortSignal : void 0);
	const displayReply = extractAssistantDisplayText(sourceReplyBroadcastContent) ?? buildTranscriptReplyTextFromInputs(finalInputsByIndex.flat());
	if (!sourceReplyBroadcastContent.length && !displayReply) return {
		kind: "dropped",
		reason: "no-visible-content"
	};
	const sourceReplyPersistenceRequests = [];
	for (const [replyIndex, sourceReplyPayload] of agentRunReplyPayloads.entries()) {
		const state = sourceReplyContentStates[replyIndex];
		if (!state || !hasAssistantDisplayMediaContent(state.persistedContent)) continue;
		const mirrorMetadata = getReplyPayloadMetadata(sourceReplyPayload)?.sourceReplyTranscriptMirror;
		const mirrorIdempotencyKey = mirrorMetadata?.idempotencyKey;
		if (typeof mirrorIdempotencyKey !== "string" || mirrorIdempotencyKey.trim().length === 0) continue;
		if (!state.hasManagedOutgoingContent) state.backedManagedOutgoingContent = true;
		sourceReplyPersistenceRequests.push({
			idempotencyKey: mirrorIdempotencyKey,
			metadata: mirrorMetadata,
			state
		});
	}
	const sourceReplyMirrorCandidates = [];
	for (const [replyIndex, sourceReplyPayload] of agentRunReplyPayloads.entries()) {
		if (!sourceReplyContentStates[replyIndex]) continue;
		const mirrorMetadata = getReplyPayloadMetadata(sourceReplyPayload)?.sourceReplyTranscriptMirror;
		const mirrorIdempotencyKey = mirrorMetadata?.idempotencyKey;
		if (typeof mirrorIdempotencyKey !== "string" || mirrorIdempotencyKey.trim().length === 0 || !mirrorMetadata) continue;
		sourceReplyMirrorCandidates.push({
			idempotencyKey: mirrorIdempotencyKey,
			metadata: mirrorMetadata
		});
	}
	const attachSourceReplyManagedImages = async (attachParams) => {
		if (!attachParams.request.state.hasManagedOutgoingContent) {
			attachParams.request.state.backedManagedOutgoingContent = true;
			return;
		}
		if (!attachParams.messageId) return;
		attachManagedOutgoingMediaToMessage({
			messageId: attachParams.messageId,
			blocks: attachParams.request.state.persistedContent
		});
		attachParams.request.state.backedManagedOutgoingContent = true;
	};
	const sourceReplyScope = assistantTranscriptScope({
		sessionId,
		sessionKey,
		storePath: latestStorePath,
		agentId
	});
	if (!deliveryAuthorized()) {
		context.logGateway.warn("webchat settled final reply skipped: session writer changed before transcript finalization");
		return {
			kind: "dropped",
			reason: "no-visible-content"
		};
	}
	if (sourceReplyScope && sourceReplyPersistenceRequests.length > 0) {
		const rewritten = await rewriteSourceReplyTranscriptMirrors({
			candidates: sourceReplyMirrorCandidates,
			requests: sourceReplyPersistenceRequests,
			scope: sourceReplyScope
		});
		if (rewritten.length > 0) {
			await publishAssistantTranscriptRewrite({
				scope: sourceReplyScope,
				rewritten
			});
			for (const target of rewritten) await attachSourceReplyManagedImages({
				messageId: target.messageId,
				request: target.request
			});
		}
	}
	const sourceReplyContent = sourceReplyContentStates.flatMap((state) => {
		if (state.hasManagedOutgoingContent && !state.backedManagedOutgoingContent) {
			const stripped = stripManagedOutgoingAssistantContentBlocks(state.broadcastContent);
			return stripped?.length ? stripped : [{
				type: "text",
				text: "Media reply could not be displayed."
			}];
		}
		return state.broadcastContent;
	}).filter((block) => Boolean(block));
	const sourceReplyText = extractAssistantDisplayText(sourceReplyContent) ?? (sourceReplyContent.length === 0 ? displayReply : void 0);
	const message = {
		role: "assistant",
		...sourceReplyContent.length ? { content: sourceReplyContent } : sourceReplyText ? { content: [{
			type: "text",
			text: sourceReplyText
		}] } : {},
		...sourceReplyText ? { text: sourceReplyText } : {},
		timestamp: Date.now(),
		stopReason: "stop",
		usage: {
			input: 0,
			output: 0,
			totalTokens: 0
		}
	};
	if (!params.suppressFinal) {
		if (!deliveryAuthorized()) {
			context.logGateway.warn("webchat settled final reply skipped: session writer changed before broadcast");
			return {
				kind: "dropped",
				reason: "no-visible-content"
			};
		}
		if (hasVisibleAssistantFinalMessage(message)) emitFirstAssistantServerTiming();
		if (params.publishMessage) params.publishMessage(message, deliveryAuthorized);
		else broadcastChatFinal({
			context,
			runId: clientRunId,
			sessionKey,
			agentId,
			message
		});
	}
	return {
		kind: "delivered",
		hasSourceReplyTranscriptMirror
	};
}
/** Persist and broadcast agent-run source/status replies that bypass the normal model turn. */
async function finalizeChatSendSourceReplies(params) {
	const result = await finalizeChatSendAgentReplyPayloads({
		requesterContext: params.requesterContext,
		abortSignal: params.abortSignal,
		accountId: params.accountId,
		context: params.context,
		emitFirstAssistantServerTiming: params.emitFirstAssistantServerTiming,
		inputs: selectChatSendAgentReplyInputs(params),
		session: params.session,
		suppressFinal: params.suppressFinal
	});
	return result.kind === "delivered" && result.hasSourceReplyTranscriptMirror;
}
//#endregion
//#region src/gateway/server-methods/chat-send-late-followup.ts
/** One Gateway admission owns the outcome of its queued reply, including concurrent duplicates. */
function createChatSendLateFollowupDisposition(params) {
	let terminal = "pending";
	const progressPayloads = [];
	const recordDrop = (batch, reason, settle = true) => {
		if (settle) terminal = "settled";
		params.logGateway.info("webchat late reply disposition", {
			runId: params.runId,
			followupRunId: batch.runId,
			outcome: "late-and-dropped",
			reason
		});
	};
	return {
		recordQueued: () => {
			if (terminal === "pending") terminal = isInternalMessageChannel(params.originatingChannel) ? "deliver" : "drop";
		},
		deliver: Object.assign(async (batch) => {
			if (terminal === "delivering") return recordDrop(batch, "delivery-in-flight", false);
			if (terminal !== "deliver") return recordDrop(batch, terminal === "pending" ? "terminal-not-recorded" : terminal === "drop" ? "non-webchat-origin" : "already-settled");
			if (!isInternalMessageChannel(batch.originatingChannel)) return recordDrop(batch, "origin-mismatch");
			if (batch.completion.kind === "progress") {
				progressPayloads.push(...batch.payloads);
				await params.deliver({
					...batch,
					isCurrent: () => terminal === "deliver"
				});
				return;
			}
			terminal = "delivering";
			try {
				const result = await params.deliver({
					...batch,
					payloads: [...progressPayloads, ...batch.payloads],
					isCurrent: () => terminal === "delivering"
				});
				if (result.kind === "dropped") return recordDrop(batch, result.reason);
				terminal = "settled";
			} catch (error) {
				recordDrop(batch, "delivery-failed");
				throw error;
			} finally {
				progressPayloads.length = 0;
			}
		}, {
			ownsCompletion: (originatingChannel) => terminal === "deliver" && isInternalMessageChannel(originatingChannel),
			createSourceRetry: () => {
				if (terminal !== "deliver" && terminal !== "drop") throw new Error("Queued source reply no longer owns recovery delivery");
				const retry = createChatSendLateFollowupDisposition(params);
				retry.recordQueued();
				return retry.deliver;
			}
		})
	};
}
//#endregion
//#region src/gateway/server-methods/chat-send-turn-adoption.ts
function createChatSendTurnAdoptionLifecycle(params) {
	let enqueued = false;
	let terminalKnown = false;
	let completed = false;
	let releaseWorkAdmission;
	const recordRefreshTerminal = (status) => {
		if (!params.suppressReplies) return;
		const now = Date.now();
		setGatewayDedupeEntry({
			dedupe: params.context.dedupe,
			key: `chat:${params.runId}`,
			session: captureAgentJobSession(params.sessionBinding),
			entry: {
				ts: now,
				ok: true,
				payload: status === "aborted" ? buildAbortedChatSendPayload({
					runId: params.runId,
					endedAt: now
				}) : {
					runId: params.runId,
					status
				}
			}
		});
	};
	const lateFollowup = createChatSendLateFollowupDisposition({
		runId: params.runId,
		originatingChannel: params.originatingChannel,
		logGateway: params.context.logGateway,
		deliver: params.suppressReplies ? async ({ completion }) => {
			terminalKnown ||= completion.kind !== "progress";
			return {
				kind: "dropped",
				reason: "no-visible-content"
			};
		} : createChatSendLateReplyFinalizer({
			requesterContext: params.requesterContext,
			abortSignal: params.controller.signal,
			accountId: params.accountId,
			context: params.context,
			session: params.session
		})
	});
	const lifecycle = {
		admission: "cancel-only",
		abortSignal: params.controller.signal,
		...params.originatingLeafEntryId !== void 0 ? { originatingLeafEntryId: params.originatingLeafEntryId } : {},
		ownerKey: params.ownerKey,
		onAdopted: async () => {},
		onDeferred: () => {
			if (params.hasCronCreatorAuthority) lifecycle.cronCreatorAuthorityUnavailable = "queued-local-operator";
			enqueued = registerQueuedChatTurn({
				chatQueuedTurns: params.chatQueuedTurns,
				runId: params.runId,
				controller: params.controller,
				sessionId: params.sessionBinding.sessionId,
				sessionKey: params.sessionKey,
				agentId: params.agentId,
				ownerConnId: normalizeOptionalChatText(params.ownerConnId),
				ownerDeviceId: normalizeOptionalChatText(params.ownerDeviceId),
				onAborted: () => recordRefreshTerminal("aborted")
			});
			if (enqueued && !releaseWorkAdmission) releaseWorkAdmission = params.retainWorkAdmission();
			if (enqueued) {
				lateFollowup.recordQueued();
				params.armOperatorRunCancellation?.();
			}
			return enqueued;
		},
		onCancellationRetired: () => {
			if (retireQueuedChatTurnCancellation(params.chatQueuedTurns, params.runId, params.controller)) params.retireOperatorRunCancellation?.();
		},
		onAbandoned: () => {
			terminalKnown = true;
		},
		onSettled: () => {
			const ownsCompletion = completeQueuedChatTurn(params.chatQueuedTurns, params.runId, params.controller);
			completed = ownsCompletion && terminalKnown;
			try {
				if (ownsCompletion) params.retireOperatorRunCancellation?.();
				if (completed) recordRefreshTerminal("completed");
			} finally {
				releaseWorkAdmission?.();
				releaseWorkAdmission = void 0;
			}
		}
	};
	return {
		lifecycle,
		isEnqueued: () => enqueued,
		isCompleted: () => completed,
		onQueueDisposition: (reason) => {
			params.context.logGateway.info("chat queue turn intentionally skipped", {
				runId: params.runId,
				sessionKey: params.sessionKey,
				outcome: "skipped",
				reason
			});
		},
		onQueuedFollowupReplyBatch: lateFollowup.deliver
	};
}
//#endregion
//#region src/gateway/server-methods/chat-send-user-turn.ts
async function persistChatSendImages(params) {
	if (params.images.length === 0 && params.offloadedRefs.length === 0 || isAcpBridgeClient(params.client)) return {
		entries: [],
		omission: "none"
	};
	return await persistInboundImagesForTranscript({
		images: params.images,
		offloadedRefs: params.offloadedRefs,
		log: params.logGateway,
		logContext: "chat.send"
	});
}
function resolveChatSendManagedMedia(entries, suppressInlineHydration = false) {
	return entries.map((entry) => ({
		path: entry.path,
		contentType: entry.fact.contentType ?? "application/octet-stream",
		...suppressInlineHydration && entry.imageKind === "inline" ? { hydrationSuppressed: true } : {}
	}));
}
function applyChatSendManagedMedia(ctx, media, mode = "replace-empty") {
	if (media.length === 0) return;
	if (mode === "replace-empty") {
		if (!ctx.media || ctx.media.length === 0) ctx.media = media;
		return;
	}
	const existing = ctx.media ?? [];
	const existingPaths = new Set(existing.flatMap((fact) => fact.path ? [fact.path] : []));
	const missing = media.filter((fact) => !fact.path || !existingPaths.has(fact.path));
	if (missing.length > 0) ctx.media = [...existing, ...missing];
}
function buildChatSendPromptMedia(attachments) {
	if (!attachments.imageOrder.includes("offloaded")) return;
	const media = attachments.offloadedRefs.filter((ref) => ref.mimeType.startsWith("image/")).map((ref) => ({
		path: ref.path,
		url: ref.mediaRef,
		contentType: ref.mimeType
	}));
	return media.length > 0 ? media : void 0;
}
/** Assemble transcript media and the portable inbound context after attachment preparation. */
function prepareChatSendUserTurn(params) {
	const { request, session, admission, attachments, client, logGateway, userTurn } = params;
	const persistedMediaForTranscriptPromise = persistChatSendImages({
		images: attachments.parsedImages,
		offloadedRefs: attachments.offloadedRefs,
		client,
		logGateway
	});
	userTurn.setInputPromise(persistedMediaForTranscriptPromise.then((result) => {
		const media = result.entries.map((entry) => entry.fact);
		const slots = result.entries.flatMap((entry, factIndex) => entry.imageKind ? [{
			kind: entry.imageKind,
			factIndex
		}] : []);
		return {
			...userTurn.baseInput,
			...result.omission === "inline-image-save-failed" ? { text: [userTurn.baseInput.text, INLINE_IMAGE_DURABLE_OMISSION_MARKER].filter(Boolean).join("\n") } : {},
			...media.length > 0 ? { media } : {},
			...slots.length > 0 ? { mediaImageLayout: { slots } } : {}
		};
	}));
	const pluginBoundMediaPromise = attachments.parsedImages.length > 0 ? persistedMediaForTranscriptPromise.then((result) => {
		return resolveChatSendManagedMedia(attachments.explicitOriginTargetsPlugin ? result.entries : result.entries.filter((entry) => entry.imageKind === "inline"), !attachments.explicitOriginTargetsPlugin);
	}) : Promise.resolve([]);
	pluginBoundMediaPromise.catch(() => void 0);
	const commandBody = request.inboundMessage;
	const commandSource = !request.suppressCommandInterpretation && commandBody.trim().startsWith("/") ? "text" : void 0;
	const buildTextContext = (text) => {
		const parsedMessage = text === request.inboundMessage ? attachments.parsedMessage : `${text}${attachments.parsedMessage.slice(request.inboundMessage.length)}`;
		const body = request.systemProvenanceReceipt ? [request.systemProvenanceReceipt, parsedMessage].filter(Boolean).join("\n\n") : parsedMessage;
		return {
			Body: body,
			BodyForAgent: body,
			BodyForCommands: text,
			RawBody: parsedMessage,
			CommandBody: text
		};
	};
	const queuedFollowupOwnerDeviceId = normalizeOptionalChatText(client?.connect?.device?.id);
	const queuedFollowupOwnerConnId = normalizeOptionalChatText(client?.connId);
	const gatewayUiCommandTarget = captureGatewayUiCommandTarget(client);
	const queuedFollowupOwnerKey = queuedFollowupOwnerDeviceId ? `device:${queuedFollowupOwnerDeviceId}` : queuedFollowupOwnerConnId ? `connection:${queuedFollowupOwnerConnId}` : void 0;
	const { originatingChannel, originatingTo, accountId, messageThreadId, explicitDeliverRoute } = admission.originatingRoute;
	const creation = request.systemInputProvenance ? resolveOperatorSessionCreation(client) : prepareSkillLibrarySessionCreation(client, params.getConfig ?? session.cfg ?? {}, resolveOperatorSessionCreation(client));
	const sandbox = session.cfg ? resolveCreatorSandbox(session.cfg, creation) : void 0;
	const ctx = {
		...buildTextContext(commandBody),
		InputProvenance: request.systemInputProvenance,
		...isProgressCardRefreshInputProvenance(request.systemInputProvenance) ? { InternalTurnSource: "progress-card-refresh" } : {},
		SessionKey: session.sessionKey,
		AgentId: session.agentId,
		OriginatingTo: originatingTo,
		ExplicitDeliverRoute: explicitDeliverRoute,
		AccountId: accountId,
		MessageThreadId: messageThreadId,
		...commandSource ? { CommandSource: commandSource } : {},
		CommandAuthorized: !request.suppressCommandInterpretation,
		CommandTurn: commandSource ? {
			kind: "text-slash",
			source: commandSource,
			authorized: true,
			body: commandBody
		} : {
			kind: "normal",
			source: "message",
			authorized: false,
			body: commandBody
		},
		...request.suppressCommandInterpretation ? { CommandInterpretationSuppressed: true } : {},
		MessageSid: session.clientRunId,
		SessionCreation: {
			...creation,
			...sandbox ? { sandbox } : {}
		},
		...resolveChatSendCallerContext(client, request.clientInfo, originatingChannel),
		GatewayRunToolBindings: request.toolBindings,
		GatewayUiCommandTarget: gatewayUiCommandTarget
	};
	if (attachments.mediaPathOffloadPaths.length > 0) ctx.media = attachments.mediaPathOffloadPaths.map((pathValue, index) => ({
		path: pathValue,
		contentType: attachments.mediaPathOffloadTypes[index],
		workspaceDir: attachments.mediaPathOffloadWorkspaceDir ?? path.dirname(pathValue)
	}));
	const mediaPathOffloadsIncludeImages = attachments.mediaPathOffloadTypes.some((type) => type.startsWith("image/"));
	const participant = resolveGatewayInputParticipant(client, request.systemInputProvenance);
	if (participant) prepareSessionParticipantInput(ctx, participant, userTurn.baseInput.timestamp);
	return {
		applyApprovedText: (text) => {
			if (text === request.inboundMessage.trim()) return;
			Object.assign(ctx, buildTextContext(text));
			if (ctx.CommandTurn) ctx.CommandTurn = {
				...ctx.CommandTurn,
				body: text
			};
		},
		discardUnreferencedMedia: async (approved) => {
			if (!approved) return;
			const retained = new Set((readPersistedMediaFacts(approved) ?? []).flatMap((fact) => [fact.url, fact.path]));
			const prepared = await persistedMediaForTranscriptPromise;
			await discardPreparedInboundMedia(prepared.entries.filter((entry) => !retained.has(entry.fact.url) && !retained.has(entry.path)), logGateway);
		},
		accountId,
		ctx,
		isInternalTextSlashCommandTurn: commandSource === "text",
		queuedFollowupOwnerKey,
		pluginBoundMediaPromise,
		managedMediaApplyMode: attachments.explicitOriginTargetsPlugin ? "replace-empty" : "append-missing",
		replyOptionImages: mediaPathOffloadsIncludeImages ? void 0 : attachments.parsedImages.length > 0 ? attachments.parsedImages : void 0,
		replyOptionMedia: buildChatSendPromptMedia(attachments)
	};
}
//#endregion
//#region src/gateway/server-methods/session-create-project.ts
const SESSION_PROJECT_OWNERSHIP_ERROR = "Session changed while preparing its project; retry the task.";
const workspacePreparations = new KeyedAsyncQueue();
function resolveSessionRepositoryCreation(params, hasInitialTurn) {
	if (!params.repository) return ok(void 0);
	const url = normalizeSessionProjectGitUrl(params.repository.url);
	const ref = params.repository.ref?.trim();
	if (!url || ref !== void 0 && (!ref || ref.startsWith("-") || /\s|\0/u.test(ref))) return err(errorShape(ErrorCodes.INVALID_REQUEST, "Use a GitHub repository URL and a nonempty branch, tag, or commit ref."));
	if (params.cwd || params.execNode || params.projectId || params.projectGitUrl || params.worktree !== void 0 || params.worktreeBaseRef || params.worktreeName || params.catalogId) return err(errorShape(ErrorCodes.INVALID_REQUEST, "sessions.create repository cannot be combined with local workspace or catalog options."));
	if (hasInitialTurn) return err(errorShape(ErrorCodes.INVALID_REQUEST, "Create the repository session without an initial turn, dispatch it with sessions.dispatch, then send the message with sessions.send."));
	return ok({
		url,
		...ref ? { ref } : {}
	});
}
function prepareSessionRepositoryWorkspace(repository, options) {
	const { assertCurrent } = options;
	return async (target) => {
		const store = getSessionRepositoryWorkspaceStore();
		const existing = store.find({
			agentId: target.agentId,
			sessionKey: target.key
		});
		if (target.entry && (!target.entry.repositoryWorkspaceId || target.entry.repositoryWorkspaceId !== existing?.workspaceId)) return err(errorShape(ErrorCodes.INVALID_REQUEST, "repository source requires a new repository session"));
		if (existing && (existing.url !== repository.url || existing.requestedRef !== (repository.ref ?? null))) return err(errorShape(ErrorCodes.INVALID_REQUEST, "session repository source cannot be changed"));
		assertCurrent();
		const workspace = store.create({
			agentId: target.agentId,
			sessionKey: target.key,
			url: repository.url,
			requestedRef: repository.ref,
			runSetupScript: options.runSetupScript,
			assertCurrent
		});
		return ok({
			repositoryWorkspaceId: workspace.workspaceId,
			...!existing ? { rollback: async () => {
				await store.delete({
					workspaceId: workspace.workspaceId,
					assertCurrent: () => {
						const current = store.get(workspace.workspaceId);
						if (current && (current.agentId !== target.agentId || current.sessionKey !== target.key || current.revision !== workspace.revision)) throw new Error("Repository preparation changed before rollback");
					}
				});
			} } : {}
		});
	};
}
function normalizeSessionProjectGitUrl(value) {
	return typeof value === "string" && value.length <= 2048 ? parseProjectGitUrl(value)?.url : void 0;
}
function validateSessionProjectPreparation(params) {
	if (!params.gitUrl) return params.projectId && (params.cwd || params.execNode) ? errorShape(ErrorCodes.INVALID_REQUEST, "sessions.create projectId cannot be combined with cwd or execNode") : void 0;
	if (!normalizeSessionProjectGitUrl(params.gitUrl)) return errorShape(ErrorCodes.INVALID_REQUEST, "Use a GitHub HTTPS or git@github.com repository URL. Local paths and file URLs are not accepted.");
	if (params.projectId || params.cwd || params.execNode) return errorShape(ErrorCodes.INVALID_REQUEST, "sessions.create projectGitUrl cannot be combined with projectId, cwd, or execNode");
	return params.hasInitialTurn ? void 0 : errorShape(ErrorCodes.INVALID_REQUEST, "sessions.create projectGitUrl requires an initial turn");
}
/** Bind persisted workspace intent only while its exact admitted run remains authoritative. */
async function prepareSessionWorkspace(params) {
	const { admission, client, context, session } = params;
	const { entry, cfg, agentId, clientRunId, sessionKey, storePath } = session;
	if (!entry) throw new Error(SESSION_PROJECT_OWNERSHIP_ERROR);
	const { controller } = admission.activeRunAbort;
	const signal = controller.signal;
	const assertRunOwnership = () => {
		signal.throwIfAborted();
		const activeRun = context.chatAbortControllers.get(clientRunId);
		if (!activeRun || activeRun !== admission.activeRunAbort.entry || activeRun.controller !== controller || activeRun.sessionKey !== sessionKey || activeRun.sessionId !== entry.sessionId || entry.sessionId !== admission.admittedSessionId || activeRun.lifecycleGeneration !== admission.lifecycleGeneration || activeRun.projectSessionActive === false || activeRun.projectSessionTerminalPending === true || activeRun.projectSessionTerminalPersisted === true || !hasActiveAgentRuntimeAuthority(client, context)) throw new Error(SESSION_PROJECT_OWNERSHIP_ERROR);
		assertAgentRunLifecycleGenerationCurrent(admission.lifecycleGeneration);
	};
	assertRunOwnership();
	emitAgentRunStatusEvent({
		runId: clientRunId,
		sessionKey,
		agentId,
		phase: "preparing_workspace"
	});
	await workspacePreparations.enqueue(`${storePath}\0${sessionKey}`, async () => {
		assertRunOwnership();
		const target = {
			agentId,
			sessionKey,
			storePath
		};
		const saved = loadSessionEntry(target);
		if (!saved || saved.sessionId !== entry.sessionId) throw new Error(SESSION_PROJECT_OWNERSHIP_ERROR);
		let pending = saved.pendingWorktree;
		const assertSavedWorkspaceIntent = (current) => {
			assertRunOwnership();
			if (current.sessionId !== entry.sessionId || current.projectId !== saved.projectId || current.pendingProjectGitUrl !== saved.pendingProjectGitUrl || !isDeepStrictEqual(current.pendingWorktree, pending)) throw new Error(SESSION_PROJECT_OWNERSHIP_ERROR);
		};
		const gitUrl = normalizeSessionProjectGitUrl(saved.pendingProjectGitUrl);
		if (Object.hasOwn(saved, "pendingProjectGitUrl") && (!gitUrl || gitUrl !== saved.pendingProjectGitUrl)) throw new Error("Saved project repository is invalid; select the repository and retry.");
		if (!pending && !gitUrl) {
			Object.assign(entry, saved);
			delete entry.pendingProjectGitUrl;
			delete entry.pendingWorktree;
			return;
		}
		const project = gitUrl ? await materializeProjectClone({
			cfg,
			gitUrl
		}, {
			signal,
			token: githubApiToken(process.env, cfg)
		}) : void 0;
		assertRunOwnership();
		const directory = project ? await resolveProjectDirectory(project.repoRoot) : pending?.workspace;
		assertRunOwnership();
		if (!directory) throw new Error("Saved worktree workspace is invalid; select the repository and retry.");
		const root = prepareSessionCreateFilesystemRoot({
			cfg,
			enforceSandboxContainment: !pending && Boolean(project || saved.projectId),
			requestedProjectId: project?.id ?? saved.projectId,
			sessionCwd: directory,
			sessionKey,
			targetAgentId: agentId
		});
		if (!root.ok) throw new Error(root.error.message);
		const status = (phase) => {
			assertRunOwnership();
			emitAgentRunStatusEvent({
				runId: clientRunId,
				sessionKey,
				agentId,
				phase
			});
		};
		if (pending && !pending.name && !hasExplicitSessionName(saved)) status("naming_worktree");
		const title = pending && !pending.name ? await generateWorktreeSessionTitle({
			cfg,
			agentId,
			entry: saved,
			sessionId: saved.sessionId,
			sessionKey,
			storePath,
			userMessage: pending.titleSource,
			commitGuard: assertRunOwnership,
			onPersisted: () => emitSessionsChanged(context, {
				sessionKey,
				agentId,
				reason: "chat.title"
			}),
			onError: (error) => context.logGateway.warn(`worktree title failed: ${String(error)}`)
		}) : void 0;
		let prepared = {
			spawnedCwd: root.value.sessionCwd,
			sessionRoot: root.value.sessionRoot
		};
		if (pending) {
			if (pending.baseRef && !pending.baseCommit) {
				let resolved = await resolveSessionWorktreeBase(directory, pending.baseRef, signal);
				if (!resolved.ok && resolved.error.code === ErrorCodes.INVALID_REQUEST && project?.source === "cloned") {
					await refreshProjectClone(project, {
						signal,
						token: githubApiToken(process.env, cfg)
					});
					assertRunOwnership();
					resolved = await resolveSessionWorktreeBase(directory, pending.baseRef, signal);
				}
				if (!resolved.ok) throw new Error(resolved.error.message);
				const next = {
					...pending,
					baseCommit: resolved.value
				};
				const updated = await patchSessionEntryCore(target, (current) => {
					assertSavedWorkspaceIntent(current);
					return { pendingWorktree: next };
				}, {
					assertCommitAllowed: assertRunOwnership,
					requireWriteSuccess: true,
					skipMaintenance: true
				});
				if (!updated) throw new Error(SESSION_PROJECT_OWNERSHIP_ERROR);
				Object.assign(saved, updated);
				pending = next;
			}
			const result = await prepareSessionWorktree({
				cfg,
				target: {
					...target,
					key: sessionKey,
					entry: saved,
					projectId: project?.id ?? saved.projectId,
					sandboxRequired: saved.sandbox === "required"
				},
				workspace: directory,
				name: pending.name,
				baseRef: pending.baseRef,
				checkoutCommit: pending.baseCommit,
				label: title ?? resolveExplicitSessionName(saved),
				runSetupScript: client?.connect?.scopes?.includes(ADMIN_SCOPE) === true,
				signal,
				commitGuard: assertRunOwnership,
				onProgress: (stage) => status(stage === "setup" ? "running_setup" : "creating_worktree"),
				acceptedSource: pending.source
			});
			if (!result.ok) throw new Error(result.error.message);
			prepared = result.value;
		}
		let bound;
		try {
			const bind = async (assertSourceCurrent) => await patchSessionEntryCore(target, (current) => {
				assertSourceCurrent();
				assertSavedWorkspaceIntent(current);
				return {
					...project ? { projectId: project.id } : {},
					sessionRoot: prepared.sessionRoot,
					spawnedCwd: prepared.spawnedCwd,
					...prepared.worktree ? { worktree: prepared.worktree } : {},
					pendingProjectGitUrl: void 0,
					pendingWorktree: void 0
				};
			}, {
				assertCommitAllowed: () => {
					assertRunOwnership();
					assertSourceCurrent();
				},
				requireWriteSuccess: true,
				skipMaintenance: true
			});
			bound = prepared.withCommit ? await prepared.withCommit(bind) : await bind(() => {});
			if (!bound) throw new Error("Session disappeared while preparing its workspace; start a new session.");
		} catch (error) {
			await prepared.rollback?.();
			throw error;
		}
		Object.assign(entry, bound);
		delete entry.pendingProjectGitUrl;
		delete entry.pendingWorktree;
		assertRunOwnership();
		emitSessionsChanged(context, {
			sessionKey,
			agentId,
			reason: "project"
		});
	});
	assertRunOwnership();
	return assertRunOwnership;
}
//#endregion
//#region src/gateway/server-methods/chat-send-agent-dispatch.ts
function startChatDispatch(params) {
	const { admissionStartedAt, admission, attachments, client, context, toolsAllow, skillWorkshopProposalRevision, skillLibraryAuthoring, cronCreatorAuthority, assertDashboardReadCurrent, externalAuthorityAdmission, injection, request, session, terminalizeRestartSafeAdmission, timing, turn, userTurn } = params;
	const { imageOrder } = attachments;
	const progressRefresh = isProgressCardRefreshInputProvenance(request.systemInputProvenance);
	const { activeRunAbort, admittedSessionId, chatSendTraceAttributes, gatewayWorkAdmission, messageInjectionTarget, retainGatewayWorkAdmission, restartSafeAdmission, sessionBinding } = admission;
	const { activeRunScopeKey, agentId, cfg, clientRunId, entry, expectedLeafEntryId, requestedSessionId, resolvedSessionModel, storePath, selectedAgent, sessionKey } = session;
	const { chatSendReceivedAtMs, clientInfo, p, reconnectResumeRequested, supportsTaskSuggestions } = request;
	const { accountId, ctx, isInternalTextSlashCommandTurn, managedMediaApplyMode, pluginBoundMediaPromise, queuedFollowupOwnerKey, replyOptionImages, replyOptionMedia } = turn;
	const { persist: persistGatewayUserTurnTranscript, persistBestEffort: persistGatewayUserTurnTranscriptBestEffort, recorder: userTurnRecorder } = userTurn;
	const { beginCapturedMessageInjection, preAckReplyContextPromise, replyContextFieldsPromise } = injection;
	let { messageInjectionAttempt } = injection;
	const { chatSendAckedAtMs, chatSendTiming } = timing;
	const jobSessionBinding = admission.sessionBinding;
	let agentRunStarted = false;
	let replyDispatchRun;
	const isRunCurrent = () => !activeRunAbort.controller.signal.aborted && context.chatAbortControllers.get(clientRunId) === activeRunAbort.entry;
	const replyDispatch = createChatSendReplyDispatch({
		requesterContext: ctx,
		accountId,
		prepareAssistantTranscriptMessage: params.prepareAssistantTranscriptMessage,
		isAgentRunStarted: () => agentRunStarted,
		isRunCurrent: () => isRunCurrent() || !activeRunAbort.controller.signal.aborted && context.chatQueuedTurns.get(clientRunId)?.controller === activeRunAbort.controller,
		abortSignal: activeRunAbort.controller.signal,
		onCommandBlock: isInternalTextSlashCommandTurn ? (text) => broadcastChatDelta({
			context,
			runId: clientRunId,
			sessionKey,
			agentId,
			text,
			isCurrent: isRunCurrent
		}) : void 0,
		getReplyDispatchRun: () => replyDispatchRun,
		logGateway: context.logGateway,
		session,
		userTurnRecorder
	});
	const queuedFollowup = createChatSendTurnAdoptionLifecycle({
		requesterContext: ctx,
		accountId,
		chatQueuedTurns: context.chatQueuedTurns,
		context,
		runId: clientRunId,
		controller: activeRunAbort.controller,
		sessionBinding: admission.sessionBinding,
		sessionKey,
		agentId: selectedAgent.agentId,
		ownerConnId: client?.connId,
		ownerDeviceId: client?.connect?.device?.id,
		ownerKey: queuedFollowupOwnerKey,
		...expectedLeafEntryId !== void 0 ? { originatingLeafEntryId: expectedLeafEntryId } : {},
		originatingChannel: admission.originatingRoute.originatingChannel,
		session,
		hasCronCreatorAuthority: cronCreatorAuthority !== void 0,
		suppressReplies: progressRefresh,
		retainWorkAdmission: retainGatewayWorkAdmission,
		armOperatorRunCancellation: admission.armOperatorRunCancellation,
		retireOperatorRunCancellation: admission.retireOperatorRunCancellation
	});
	let acceptedMessageInjection = false;
	const classifyDispatchFailure = (error) => classifyAcceptedChatSendFailure({
		error,
		phase: "post-ack",
		executionStarted: agentRunStarted,
		sideEffectsObserved: acceptedMessageInjection || messageInjectionAttempt !== void 0 || replyDispatch.deliveredReplies.length > 0
	});
	const dispatchErrorLifecycle = createChatSendDispatchErrorLifecycle({
		admission,
		classifyFailure: classifyDispatchFailure,
		context,
		isAgentRunStarted: () => agentRunStarted,
		isQueuedFollowupEnqueued: queuedFollowup.isEnqueued,
		isQueuedFollowupCompleted: progressRefresh ? queuedFollowup.isCompleted : void 0,
		persistUserTurnTranscript: persistGatewayUserTurnTranscript,
		session,
		terminalizeRestartSafeAdmission,
		userTurnRecorder,
		isReplyDispatchRun: () => replyDispatchRun !== void 0
	});
	const emitServerTiming = (phase, extra, dispatchStartedAtMs) => {
		emitOperatorChatSendServerTiming({
			context,
			client,
			phase,
			runId: clientRunId,
			sessionKey,
			agentId,
			receivedAtMs: chatSendReceivedAtMs,
			ackedAtMs: chatSendAckedAtMs,
			dispatchStartedAtMs,
			extra
		});
	};
	const dispatchStartedAtMs = performance.now();
	if (chatSendTiming) chatSendTiming.dispatchStartedAtMs = dispatchStartedAtMs;
	emitServerTiming("dispatch-started");
	let firstAssistantServerTimingEmitted = false;
	const emitFirstAssistantServerTiming = () => {
		if (firstAssistantServerTimingEmitted || chatSendTiming?.firstAssistantEventSent) return;
		firstAssistantServerTimingEmitted = true;
		if (chatSendTiming) chatSendTiming.firstAssistantEventSent = true;
		emitServerTiming("first-assistant-event", void 0, dispatchStartedAtMs);
	};
	const dispatchAdmission = { run: (operation) => gatewayWorkAdmission.run(() => userTurnRecorder.withPendingInput ? userTurnRecorder.withPendingInput(operation) : operation()) };
	const dashboardReadAdmission = assertDashboardReadCurrent ? {
		agentId,
		runId: clientRunId,
		sessionKey,
		get sessionId() {
			return sessionBinding.sessionId;
		},
		assertCurrent: assertDashboardReadCurrent
	} : void 0;
	const dispatch = replyDispatch.runAgentMediaTranscript(dispatchAdmission, () => measureDiagnosticsTimelineSpan("gateway.chat_send.dispatch_inbound", async () => {
		let assertWorkspaceRunOwnership;
		if (entry && (Object.hasOwn(entry, "pendingProjectGitUrl") || entry.pendingWorktree)) {
			assertWorkspaceRunOwnership = await prepareSessionWorkspace({
				admission,
				client,
				context,
				session
			});
			assertWorkspaceRunOwnership();
		}
		if (replyContextFieldsPromise && !preAckReplyContextPromise) {
			const replyContextFields = await replyContextFieldsPromise;
			assertWorkspaceRunOwnership?.();
			applyChatSendReplyContextFields(ctx, replyContextFields);
			messageInjectionAttempt = beginCapturedMessageInjection();
		}
		if (messageInjectionAttempt) {
			const injected = await finalizeAcceptedChatSendMessageInjection({
				attempt: messageInjectionAttempt,
				sessionBinding: jobSessionBinding,
				context,
				ctx,
				persistUserTurnTranscriptBestEffort: async () => {
					await persistGatewayUserTurnTranscriptBestEffort();
				},
				session,
				startedAt: admissionStartedAt,
				target: messageInjectionTarget
			});
			assertWorkspaceRunOwnership?.();
			if (injected) {
				acceptedMessageInjection = true;
				return {
					queuedFinal: false,
					counts: {
						tool: 0,
						block: 0,
						final: 0
					}
				};
			}
		}
		const pluginBoundMedia = await pluginBoundMediaPromise;
		assertWorkspaceRunOwnership?.();
		applyChatSendManagedMedia(ctx, pluginBoundMedia, managedMediaApplyMode);
		const dispatchInbound = () => {
			assertWorkspaceRunOwnership?.();
			return dispatchInboundMessageWithProjectedDispatcher({
				ctx,
				cfg,
				toolsAllow,
				dispatcherOptions: replyDispatch.dispatcherOptions,
				onSessionMetadataChanges: (changes) => changes.forEach((change) => emitSessionsChanged(context, change)),
				replyOptions: {
					prepareAssistantTranscriptMessage: replyDispatch.prepareAssistantTranscriptMessage,
					...isInternalSourceReplyChannel(ctx) ? { resolveReplyDelivery: replyDispatch.resolveReplyDelivery } : {},
					...admission.admittedSessionSettings ? { admittedSessionSettings: admission.admittedSessionSettings } : {},
					runId: clientRunId,
					operatorAuthority: admission.operatorAuthority,
					providerReviewAcknowledgment: request.providerReviewAcknowledgment,
					dashboardReadAdmission,
					skillWorkshopProposalRevision,
					skillLibraryAuthoring,
					...cronCreatorAuthority ? { cronCreatorAuthorityCapability: cronCreatorAuthority } : {},
					...isOperatorUiClient(clientInfo) ? { promptCacheKey: resolveWebchatPromptCacheKey({
						agentId,
						provider: resolvedSessionModel.provider,
						model: resolvedSessionModel.model,
						sessionKey: activeRunScopeKey
					}) } : {},
					...supportsTaskSuggestions ? { taskSuggestionDeliveryMode: "gateway" } : {},
					requestedSessionId,
					expectedActiveReplyOperation: admission.expectedActiveReplyOperation,
					...restartSafeAdmission ? {
						expectedExistingSessionId: admittedSessionId,
						pinExpectedExistingSession: true,
						newlyCreatedSessionId: admission.initialSessionEntry?.sessionId
					} : entry?.sessionId ? { expectedExistingSessionId: entry.sessionId } : {},
					resumeRequestedSession: reconnectResumeRequested,
					onSessionPrepared: admission.onSessionPrepared,
					abortSignal: activeRunAbort.controller.signal,
					getProviderLoginConfig: context.getRuntimeConfig,
					assertProviderLoginAuthority: () => {
						client?.connectionSignal?.throwIfAborted();
						if (client?.invalidated || !client?.connect.scopes?.includes("operator.admin")) throw new Error("Provider login authority is no longer active.");
					},
					onFollowupQueueDisposition: queuedFollowup.onQueueDisposition,
					onQueuedFollowupReplyBatch: queuedFollowup.onQueuedFollowupReplyBatch,
					turnAdoptionLifecycle: queuedFollowup.lifecycle,
					images: replyOptionImages,
					imageOrder: imageOrder.length > 0 ? imageOrder : void 0,
					media: replyOptionMedia,
					...p.timeoutMs !== void 0 ? { timeoutOverrideMs: p.timeoutMs } : {},
					thinkingLevelOverride: p.thinking,
					fastModeOverride: p.fastMode,
					queueModeOverride: p.queueMode,
					userTurnTranscriptRecorder: userTurnRecorder,
					...p.queueMode === "steer" ? { messageInjectionDisposition: "rejected" } : {},
					...restartSafeAdmission ? { suppressNextUserMessagePersistence: true } : {},
					fastModeAutoOnSecondsOverride: p.fastAutoOnSeconds,
					onAgentRunStart: (runId, _identity, options) => {
						replyDispatchRun = options;
						if (activeRunAbort.markExecutionStarted()) {
							admission.armOperatorRunCancellation();
							emitSessionsChanged(context, {
								sessionKey,
								agentId,
								reason: "agent.run.started"
							}, { accessChanged: false });
						}
						agentRunStarted = replyDispatch.captureAgentTranscriptStart(runId);
						emitServerTiming("agent-run-started", runId !== clientRunId ? { agentRunId: runId } : void 0, dispatchStartedAtMs);
						const connId = typeof client?.connId === "string" ? client.connId : void 0;
						const wantsToolEvents = hasGatewayClientCap(client?.connect?.caps, GATEWAY_CLIENT_CAPS.TOOL_EVENTS);
						if (connId && wantsToolEvents) {
							context.registerToolEventRecipient(runId, connId);
							const compatibilityOwnerAgentId = tryResolveSessionCompatibilityOwnerAgentId(cfg, sessionKey);
							const selectedSessionAgentId = selectedAgent.agentId;
							for (const [activeRunId, active] of context.chatAbortControllers) {
								const sameSelectedAgent = selectedSessionAgentId !== void 0 && chatRunBelongsToSelectedAgent({
									agentId: active.agentId,
									sessionKey: active.sessionKey,
									defaultAgentId: compatibilityOwnerAgentId,
									selectedAgentId: selectedSessionAgentId
								});
								const sameSession = active.sessionKey === sessionKey && sameSelectedAgent;
								if (activeRunId !== runId && sameSession) context.registerToolEventRecipient(activeRunId, connId);
							}
						}
						return options?.completionSource;
					},
					onModelSelected: (modelSelection) => {
						updateChatRunProvider(context.chatAbortControllers, {
							runId: clientRunId,
							providerId: modelSelection.provider,
							authProviderId: resolveProviderIdForAuth(modelSelection.provider, { config: cfg })
						});
						replyDispatch.onModelSelected(modelSelection);
						emitServerTiming("model-selected", {
							provider: modelSelection.provider,
							model: modelSelection.model
						}, dispatchStartedAtMs);
					}
				}
			});
		};
		const dispatchWithRetry = () => runAcceptedChatSendDispatch({
			operation: dispatchInbound,
			classify: classifyDispatchFailure,
			waitForRetry: (error) => waitForAcceptedChatSendRetry({
				agentId,
				sessionKey,
				storePath
			}, error, activeRunAbort.controller.signal)
		});
		const dispatchResult = await (cronCreatorAuthority && externalAuthorityAdmission ? externalAuthorityAdmission.run(cronCreatorAuthority, dispatchWithRetry, activeRunAbort.controller.signal) : dispatchWithRetry());
		if (dispatchResult.beforeAgentRunBlocked === true) userTurnRecorder.markBlocked();
		return dispatchResult;
	}, {
		phase: "agent-turn",
		config: cfg,
		attributes: chatSendTraceAttributes
	})).then(async (dispatchResult) => {
		if (acceptedMessageInjection) return;
		emitServerTiming("dispatch-completed", void 0, dispatchStartedAtMs);
		const postDispatchStartedAtMs = performance.now();
		await measureDiagnosticsTimelineSpan("gateway.chat_send.post_dispatch", async () => {
			const replyDispatchResult = replyDispatchRun?.getResult();
			const runtimeOutcome = replyDispatchResult?.terminalOutcome;
			const recordedOutcome = readAgentRunTerminalOutcome(dispatchResult);
			const runtimeClassification = runtimeOutcome ? classifyAgentRunTerminalOutcome(runtimeOutcome) : recordedOutcome && (recordedOutcome === "failed" ? "failure" : "success");
			const runtimeCancelled = runtimeClassification === "cancellation";
			const runtimeFailed = runtimeClassification === "failure" || runtimeClassification === "timeout";
			const returnedAgentErrorPayloads = replyDispatch.deliveredReplies.map((entryInner) => readChatSendReplyPayload(entryInner.input)).filter((payload) => payload.isError);
			const hasOnlyFinalWarnings = returnedAgentErrorPayloads.length > 0 && replyDispatch.deliveredReplies.every(({ kind, input }) => {
				const payload = readChatSendReplyPayload(input);
				return kind === "final" && payload.isError === true || isReplyPayloadStatusNotice(payload);
			});
			const hasReturnedAgentError = runtimeClassification ? runtimeFailed : returnedAgentErrorPayloads.length > 0 && (agentRunStarted || !isInternalTextSlashCommandTurn);
			const returnedAgentErrorMessage = runtimeOutcome?.error ?? (formatReturnedAgentErrors(returnedAgentErrorPayloads.map((payload) => payload.text?.trim()).filter((text) => Boolean(text))) || (runtimeFailed ? "agent run failed" : void 0));
			if (!userTurnRecorder.hasPersisted() && !userTurnRecorder.isBlocked() && (hasReturnedAgentError || agentRunStarted && returnedAgentErrorPayloads.length === 0 && userTurnRecorder.hasRuntimePersistencePending())) await persistGatewayUserTurnTranscriptBestEffort();
			let finalizedSourceReply = false;
			if (!progressRefresh && (!agentRunStarted || replyDispatchRun || hasOnlyFinalWarnings) && !queuedFollowup.isEnqueued() && !hasReturnedAgentError && !context.chatRunState.hasAbortMarker(clientRunId)) await finalizeChatSendDispatchedReplies({
				requesterContext: ctx,
				abortSignal: activeRunAbort.controller.signal,
				accountId,
				context,
				deliveredReplies: replyDispatch.deliveredReplies,
				emitFirstAssistantServerTiming,
				foldCommandBlocks: isInternalTextSlashCommandTurn || replyDispatchRun !== void 0,
				persistUserTurnTranscript: persistGatewayUserTurnTranscriptBestEffort,
				session,
				suppressReplies: !replyDispatchRun && replyDispatch.hasAppendedWebchatAgentMedia(),
				runtimeOwnsTranscript: replyDispatchResult?.assistantTranscript?.agentId === agentId && replyDispatchResult.assistantTranscript.sessionKey === sessionKey && replyDispatchResult.assistantTranscript.sessionId === activeRunAbort.entry?.sessionId,
				state: runtimeCancelled ? "aborted" : "final",
				stopReason: runtimeOutcome?.stopReason
			});
			else if (!progressRefresh && !context.chatRunState.hasAbortMarker(clientRunId)) finalizedSourceReply = await finalizeChatSendSourceReplies({
				requesterContext: ctx,
				abortSignal: activeRunAbort.controller.signal,
				accountId,
				context,
				deliveredReplies: replyDispatch.deliveredReplies,
				emitFirstAssistantServerTiming,
				hasReturnedAgentErrorPayloads: hasReturnedAgentError,
				session,
				suppressFinal: runtimeFailed
			});
			const shouldBroadcastAgentError = hasReturnedAgentError && (runtimeFailed || !finalizedSourceReply);
			if (!context.chatRunState.hasAbortMarker(clientRunId)) {
				if (shouldBroadcastAgentError) broadcastChatError({
					context,
					runId: clientRunId,
					sessionKey,
					agentId,
					errorMessage: returnedAgentErrorMessage,
					errorKind: runtimeClassification === "timeout" ? "timeout" : void 0,
					stopReason: runtimeOutcome?.stopReason
				});
				const returnedAgentError = shouldBroadcastAgentError ? errorShape(ErrorCodes.UNAVAILABLE, returnedAgentErrorMessage ?? "agent returned an error payload") : void 0;
				setGatewayDedupeEntry({
					dedupe: context.dedupe,
					key: `chat:${clientRunId}`,
					session: captureAgentJobSession(jobSessionBinding),
					entry: {
						ts: Date.now(),
						ok: !shouldBroadcastAgentError,
						payload: shouldBroadcastAgentError ? {
							runId: clientRunId,
							status: runtimeClassification === "timeout" ? "timeout" : "error",
							summary: returnedAgentErrorMessage ?? "agent returned an error payload",
							...runtimeOutcome ? { endedAt: runtimeOutcome.endedAt } : {},
							...runtimeOutcome?.stopReason ? { stopReason: runtimeOutcome.stopReason } : {}
						} : runtimeCancelled ? buildAbortedChatSendPayload({
							runId: clientRunId,
							endedAt: runtimeOutcome?.endedAt ?? Date.now(),
							stopReason: runtimeOutcome?.stopReason
						}) : {
							runId: clientRunId,
							status: progressRefresh && (!queuedFollowup.isEnqueued() || queuedFollowup.isCompleted()) ? "completed" : "ok",
							...replyDispatchResult?.terminalOutcome?.stopReason ? { stopReason: replyDispatchResult.terminalOutcome.stopReason } : {}
						},
						...returnedAgentError ? { error: returnedAgentError } : {}
					}
				});
			}
		}, {
			phase: "agent-turn",
			config: cfg,
			attributes: chatSendTraceAttributes
		});
		emitServerTiming("post-dispatch-completed", { postDispatchMs: roundedChatSendTimingMs(performance.now() - postDispatchStartedAtMs) }, dispatchStartedAtMs);
		if (queuedFollowup.isEnqueued() && !context.chatRunState.hasAbortMarker(clientRunId)) broadcastChatFinal({
			context,
			runId: clientRunId,
			sessionKey,
			agentId
		});
	}).catch(dispatchErrorLifecycle.handleError);
	(async () => {
		try {
			await dispatch;
		} finally {
			await dispatchErrorLifecycle.finalize();
			emitSessionsChanged(context, {
				sessionKey,
				agentId,
				reason: "agent.input.settled"
			}, { accessChanged: false });
			if (userTurnRecorder.isBlocked() && attachments.offloadedRefs.length > 0) discardPreparedInboundMedia(attachments.offloadedRefs);
		}
	})();
	scheduleChatDashboardSessionTitle({
		admittedSessionId,
		agentId,
		cfg,
		context,
		request,
		sessionKey,
		sessionLoadOptions: session.sessionLoadOptions,
		storePath: session.storePath
	});
}
//#endregion
//#region src/gateway/server-methods/chat-send-attachments.ts
function isPdfOffloadedRef(ref) {
	const mime = ref.mimeType.trim().toLowerCase();
	if (mime === "application/pdf" || mime.endsWith("+pdf")) return true;
	return path.extname(ref.path.split(/[?#]/u)[0] ?? "").toLowerCase() === ".pdf";
}
function isManagedInboundPdfOffloadRef(ref) {
	if (!isPdfOffloadedRef(ref)) return false;
	try {
		return parseInboundMediaUri(ref.mediaRef) !== null;
	} catch {
		return false;
	}
}
async function prestageMediaPathOffloads(params) {
	const mediaPathRefs = params.offloadedRefs.filter((ref) => params.includeImageRefs || !ref.mimeType.startsWith("image/"));
	if (mediaPathRefs.length === 0) return {
		paths: [],
		types: []
	};
	try {
		const [{ ensureSandboxWorkspaceForSession }, { SANDBOX_MEDIA_MAX_BYTES, stageSandboxMedia }] = await Promise.all([import("./context-CNAINVjd.mjs"), import("./stage-sandbox-media-DGaOEgKi.mjs")]);
		params.abortSignal.throwIfAborted();
		params.assertWorkAdmissionCurrent();
		const refsByManagedPath = (refs) => ({
			paths: refs.map((ref) => ref.path),
			types: refs.map((ref) => ref.mimeType)
		});
		const passThroughRefs = [];
		const refsToStage = [];
		for (const ref of mediaPathRefs) (ref.sizeBytes > SANDBOX_MEDIA_MAX_BYTES && isManagedInboundPdfOffloadRef(ref) ? passThroughRefs : refsToStage).push(ref);
		if (refsToStage.length === 0) return refsByManagedPath(mediaPathRefs);
		const workspaceDir = resolveAgentWorkspaceDir(params.cfg, params.agentId);
		if (getAgentWorkspaceAccess(workspaceDir, "prepareTurnAttachments")?.prepareTurnAttachments) return refsByManagedPath(mediaPathRefs);
		const sandbox = await ensureSandboxWorkspaceForSession({
			config: params.cfg,
			agentId: params.agentId,
			sessionKey: params.sessionKey,
			workspaceDir
		});
		if (!sandbox) return refsByManagedPath(mediaPathRefs);
		const oversizedForSandbox = refsToStage.filter((ref) => ref.sizeBytes > SANDBOX_MEDIA_MAX_BYTES);
		if (oversizedForSandbox.length > 0) {
			const details = oversizedForSandbox.map((ref) => `${ref.label} (${ref.sizeBytes} bytes)`).join(", ");
			throw new UnsupportedAttachmentError("non-image-too-large-for-sandbox", `attachments exceed sandbox staging limit (${SANDBOX_MEDIA_MAX_BYTES} bytes): ${details}`);
		}
		const stagingCtx = { media: refsToStage.map((ref) => ({
			path: ref.path,
			contentType: ref.mimeType
		})) };
		let stageResult;
		try {
			stageResult = await stageSandboxMedia({
				ctx: stagingCtx,
				sessionCtx: stagingCtx,
				cfg: params.cfg,
				agentId: params.agentId,
				sessionKey: params.sessionKey,
				workspaceDir,
				abortSignal: params.abortSignal
			});
		} catch (stageErr) {
			if (params.abortSignal.aborted && Object.is(stageErr, params.abortSignal.reason) || refsToStage.some((ref) => !isManagedInboundPdfOffloadRef(ref))) throw stageErr;
			return refsByManagedPath(mediaPathRefs);
		}
		const stagedSources = stageResult.staged;
		const unstageable = refsToStage.filter((_ref, index) => !stagedSources.has(index)).filter((ref) => !isManagedInboundPdfOffloadRef(ref));
		if (unstageable.length > 0) throw new Error(`attachment staging incomplete: ${stagedSources.size}/${refsToStage.length} paths staged into sandbox workspace (missing: ${unstageable.map((ref) => ref.path).join(", ")})`);
		const stagedMedia = stagingCtx.media ?? [];
		const resolvedByRef = /* @__PURE__ */ new Map();
		refsToStage.forEach((ref, index) => {
			resolvedByRef.set(ref, {
				path: stagedMedia[index]?.path ?? ref.path,
				mimeType: stagedMedia[index]?.contentType ?? ref.mimeType
			});
		});
		for (const ref of passThroughRefs) resolvedByRef.set(ref, {
			path: ref.path,
			mimeType: ref.mimeType
		});
		const ordered = mediaPathRefs.map((ref) => resolvedByRef.get(ref) ?? {
			path: ref.path,
			mimeType: ref.mimeType
		});
		return {
			paths: ordered.map((entry) => entry.path),
			types: ordered.map((entry) => entry.mimeType),
			workspaceDir: sandbox.workspaceDir
		};
	} catch (err) {
		if (params.abortSignal.aborted && Object.is(err, params.abortSignal.reason) || err instanceof MediaOffloadError || err instanceof UnsupportedAttachmentError) throw err;
		throw new MediaOffloadError(`[Gateway Error] Failed to stage attachments into agent workspace: ${formatErrorMessage(err)}`, { cause: err });
	}
}
/** Parse and pre-stage attachments before the caller's synchronous pre-ACK checks. */
async function prepareChatSendAttachments(params) {
	const { request, session, admission, respond, context } = params;
	const { inboundMessage, normalizedAttachments, explicitOrigin } = request;
	const { cfg, sessionKey, agentId, resolvedSessionModel, clientRunId } = session;
	const { activeRunAbort, chatSendTraceAttributes, cleanupAdmittedRun, finishAbortedChatSend, lifecycleGeneration } = admission;
	let parsedMessage = inboundMessage;
	let parsedImages = [];
	let imageOrder = [];
	let offloadedRefs = [];
	let mediaPathOffloadPaths = [];
	let mediaPathOffloadTypes = [];
	let mediaPathOffloadWorkspaceDir;
	const explicitOriginTargetsPlugin = explicitOriginTargetsPluginBinding(explicitOrigin);
	let prepareAttachmentsMs;
	if (normalizedAttachments.length > 0) {
		const prepareAttachmentsStartedAtMs = performance.now();
		try {
			await measureDiagnosticsTimelineSpan("gateway.chat_send.prepare_attachments", async () => {
				const imageSupport = { value: explicitOriginTargetsAcpSession(explicitOrigin) || explicitOriginTargetsPlugin ? true : void 0 };
				const resolveSupportsImages = async () => {
					imageSupport.value ??= await resolveGatewayModelSupportsImages({
						loadGatewayModelCatalog: context.loadGatewayModelCatalog,
						loadGatewayModelCatalogSnapshot: context.loadGatewayModelCatalogSnapshot,
						agentId,
						provider: resolvedSessionModel.provider,
						model: resolvedSessionModel.model
					});
					return imageSupport.value;
				};
				const parsed = await parseMessageWithAttachments(inboundMessage, normalizedAttachments, {
					maxBytes: resolveChatAttachmentMaxBytes(cfg),
					log: context.logGateway,
					supportsImages: imageSupport.value ?? resolveSupportsImages,
					acceptNonImage: true
				});
				const parsedSupportsImages = imageSupport.value !== false;
				parsedMessage = parsedSupportsImages ? parsed.message : stripImageMediaMarkers(parsed.message, parsed.offloadedRefs);
				parsedImages = parsed.images;
				imageOrder = parsed.imageOrder;
				offloadedRefs = parsed.offloadedRefs;
				({paths: mediaPathOffloadPaths, types: mediaPathOffloadTypes, workspaceDir: mediaPathOffloadWorkspaceDir} = await prestageMediaPathOffloads({
					offloadedRefs,
					includeImageRefs: !parsedSupportsImages,
					cfg,
					sessionKey,
					agentId,
					abortSignal: activeRunAbort.controller.signal,
					assertWorkAdmissionCurrent: admission.assertWorkAdmissionCurrent
				}));
			}, {
				phase: "agent-turn",
				config: cfg,
				attributes: {
					...chatSendTraceAttributes,
					attachmentCount: normalizedAttachments.length
				}
			});
			activeRunAbort.controller.signal.throwIfAborted();
			prepareAttachmentsMs = roundedChatSendTimingMs(performance.now() - prepareAttachmentsStartedAtMs);
		} catch (err) {
			const aborted = activeRunAbort.controller.signal.aborted && (context.chatRunState.hasAbortMarker(clientRunId) || Object.is(err, activeRunAbort.controller.signal.reason));
			if (!aborted) activeRunAbort.cleanup();
			await discardPreparedInboundMedia(offloadedRefs);
			if (aborted) {
				finishAbortedChatSend();
				return { ok: false };
			}
			cleanupAdmittedRun();
			clearAgentRunContext(clientRunId, lifecycleGeneration);
			logAttachmentFailure(context.logGateway, "chat.send attachment parse/stage failed", err);
			respond(false, void 0, errorShape(err instanceof MediaOffloadError ? ErrorCodes.UNAVAILABLE : ErrorCodes.INVALID_REQUEST, String(err)));
			return { ok: false };
		}
	}
	return {
		ok: true,
		value: {
			explicitOriginTargetsPlugin,
			imageOrder,
			mediaPathOffloadPaths,
			mediaPathOffloadTypes,
			mediaPathOffloadWorkspaceDir,
			offloadedRefs,
			parsedImages,
			parsedMessage,
			prepareAttachmentsMs
		}
	};
}
//#endregion
//#region src/gateway/server-methods/chat-send-active-leaf.ts
const ACTIVE_LEAF_CHANGED_ERROR_REASON = "active-leaf-changed";
function assertExpectedLeafActive(session, agentId, expectedLeafEntryId, requestedSessionId) {
	const activePathRelation = session.entry?.sessionId ? readSessionTranscriptActivePathEntryRelation({
		agentId,
		sessionId: session.entry.sessionId,
		sessionKey: session.canonicalKey,
		sessionEntry: session.entry,
		storePath: session.storePath
	}, expectedLeafEntryId) : expectedLeafEntryId === null ? "exact" : "off-path";
	if (!(requestedSessionId === void 0 || requestedSessionId === session.entry?.sessionId) || !(activePathRelation === "exact" || activePathRelation === "ancestor" && requestedSessionId !== void 0)) throw new Error(ACTIVE_LEAF_CHANGED_ERROR_REASON);
}
//#endregion
//#region src/gateway/server-methods/chat-send-session-settings.ts
const SESSION_SETTINGS_CHANGED_ERROR_REASON = "session-settings-changed";
function captureAdmittedChatSendSessionSettings(params) {
	const { entry, expectedPermissionMode, expectedToolOverrides } = params;
	if (expectedPermissionMode !== void 0 && (entry?.permissionMode ?? null) !== expectedPermissionMode || expectedToolOverrides !== void 0 && !sessionToolOverridesEqual(entry?.toolOverrides, expectedToolOverrides)) throw new Error(SESSION_SETTINGS_CHANGED_ERROR_REASON);
	if (!params.commit) return;
	return Object.freeze({
		permissionMode: entry?.permissionMode,
		toolOverrides: normalizeSessionToolOverrides(entry?.toolOverrides)
	});
}
//#endregion
//#region src/gateway/server-methods/chat-send-stop-owner-scope.ts
function resolveChatSendStopOwnerScope(params) {
	return {
		agentId: params.selectedAgentId,
		defaultAgentId: tryResolveSessionCompatibilityOwnerAgentId(params.cfg, params.sessionKey)
	};
}
//#endregion
//#region src/gateway/server-methods/chat-send-pre-admission.ts
function respondChatSessionRoutingChanged(respond) {
	respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "session routing changed; review and retry", { details: { reason: SESSION_ROUTING_CHANGED_ERROR_REASON } }));
}
function respondChatSendAdmissionError(error, respond) {
	if (error instanceof Error && error.message === "goal-session-busy") {
		respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, "This session still has active or queued work. Wait for it to finish, then retry the Goal.", {
			retryable: true,
			details: { reason: "goal-session-busy" }
		}));
		return;
	}
	if (error instanceof Error && error.message === "session-routing-changed") {
		respondChatSessionRoutingChanged(respond);
		return;
	}
	if (error instanceof Error && error.message === "active-leaf-changed") {
		respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "active branch changed; review and retry", { details: { reason: ACTIVE_LEAF_CHANGED_ERROR_REASON } }));
		return;
	}
	if (error instanceof Error && error.message === "session-settings-changed") {
		respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "Session settings changed before send. Retry.", { details: { reason: SESSION_SETTINGS_CHANGED_ERROR_REASON } }));
		return;
	}
	if (isSessionTranscriptProjectionUnavailableError(error)) {
		respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, "session transcript is rebuilding; retry shortly", {
			details: { method: "chat.send" },
			retryable: true,
			retryAfterMs: 250
		}));
		return;
	}
	respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, formatForLog(error)));
}
/** A retained request identity is not an ACK; only response-bearing rows may replay. */
function readChatSendDedupeResponse(dedupe, runId) {
	const entry = dedupe.get(`chat:${runId}`);
	return entry?.requestIdentity && entry.ok && entry.payload === void 0 && entry.error === void 0 ? void 0 : entry;
}
function resolveChatSendRequestConflict({ request, session, context }) {
	if (request.goalOperation) return;
	const entries = [context.dedupe.get(`chat:${session.clientRunId}`), context.dedupe.get(session.pendingChatSendKey)];
	const conflict = (unverifiable = false) => errorShape(ErrorCodes.INVALID_REQUEST, unverifiable ? "The previous mention selections cannot be verified. Check the conversation history and use a new message ID to send again." : "This message ID was already used for different input. Check the conversation history and use a new message ID to send again.", { details: { reason: "chat-request-conflict" } });
	if (entries.some((entry) => entry?.requestIdentity !== void 0 && entry.requestIdentity !== request.requestIdentity)) return conflict();
	const sameDurableSource = session.entry?.restartRecoveryDeliverySourceRunId === session.clientRunId;
	const storedFingerprint = sameDurableSource ? session.entry?.restartRecoveryDeliveryRequestFingerprint : void 0;
	if (storedFingerprint !== void 0) return storedFingerprint === session.restartSafeRequest?.fingerprint ? void 0 : conflict();
	if (sameDurableSource && (request.mentions?.length || request.workContext) && !session.restartSafeRequest) return conflict(true);
	if (entries.some((entry) => entry?.requestIdentity === request.requestIdentity)) return;
	if (!(entries.some(Boolean) || sameDurableSource || hasRestartRecoveryTerminalRun(session.entry, session.clientRunId) || context.chatRunState.hasAbortMarker(session.clientRunId) || context.chatAbortControllers.has(session.clientRunId) || context.chatQueuedTurns?.has(session.clientRunId))) return;
	const submitted = session.entry?.sessionId ? readSessionSubmittedInput({
		agentId: session.agentId,
		sessionId: session.entry.sessionId,
		sessionKey: session.sessionKey,
		storePath: session.storePath
	}, `${session.clientRunId}:user`) : void 0;
	if (!submitted) return request.mentions?.length || request.workContext ? conflict(true) : void 0;
	const storedMentions = submitted["__openclaw"]?.humanMentions;
	const storedContext = submitted["__openclaw"]?.workContext;
	if (!request.mentions?.length && !storedMentions?.length && !request.workContext && !storedContext) return;
	return (extractTextFromChatContent(submitted.content, {
		joinWith: "\n",
		normalizeText: (text) => text
	}) ?? "") !== request.rawMessage || !isDeepStrictEqual(storedMentions ?? [], request.mentions ?? []) || !isDeepStrictEqual(storedContext, request.workContext) ? conflict() : void 0;
}
/** Recheck at each admission yield before accepting a cached or concurrent request. */
function respondChatSendRetry(params) {
	params.assertCurrent?.();
	const { session, context, respond } = params;
	const { clientRunId, pendingChatSendKey } = session;
	const conflict = resolveChatSendRequestConflict(params);
	if (conflict) {
		respond(false, void 0, conflict);
		return true;
	}
	const cached = readChatSendDedupeResponse(context.dedupe, clientRunId);
	if (cached) {
		respond(cached.ok, cached.payload, cached.error, { cached: true });
		return true;
	}
	const abortMarker = context.chatRunState.runs.get(clientRunId)?.abortMarker;
	if (abortMarker !== void 0) {
		const abortedAt = chatAbortMarkerTimestampMs(abortMarker);
		const payload = buildAbortedChatSendPayload({
			runId: clientRunId,
			endedAt: abortedAt
		});
		setGatewayDedupeEntry({
			dedupe: context.dedupe,
			key: `chat:${clientRunId}`,
			entry: {
				ts: abortedAt,
				ok: true,
				payload
			}
		});
		respond(true, payload, void 0, {
			cached: true,
			runId: clientRunId
		});
		return true;
	}
	if (readPreRegisteredRun({
		key: pendingChatSendKey,
		entry: context.dedupe.get(pendingChatSendKey),
		keyPrefix: "pending-chat:"
	}) || context.chatAbortControllers.has(clientRunId) || context.chatQueuedTurns?.has(clientRunId)) {
		respond(true, {
			runId: clientRunId,
			status: "in_flight"
		}, void 0, {
			cached: true,
			runId: clientRunId
		});
		return true;
	}
	return false;
}
/** Recheck synchronously at reservation: recovery lookups can yield to a competing request. */
function inspectGoalChatSendRetry({ request, session, respond, context, durableClaimAccepted, assertCurrent }) {
	assertCurrent?.();
	const { sessionKey, storePath, entry, clientRunId, pendingChatSendKey } = session;
	if (!request.goalOperation) return { kind: "new" };
	try {
		const receipt = lookupSessionGoalOperation({
			sessionKey,
			storePath,
			agentId: session.agentId,
			expectedSessionId: entry?.sessionId ?? session.backingSessionId ?? clientRunId,
			operation: request.goalOperation
		});
		if (receipt) return {
			kind: "replay",
			receipt
		};
		const pending = readPreRegisteredRun({
			key: pendingChatSendKey,
			entry: context.dedupe.get(pendingChatSendKey),
			keyPrefix: PENDING_CHAT_SEND_DEDUPE_PREFIX
		});
		if (pending?.payload.goalFingerprint === request.goalOperation.requestFingerprint || !pending && !durableClaimAccepted && context.chatAbortControllers.has(clientRunId)) {
			respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, "Goal is being admitted; retry the same request.", { retryable: true }));
			return { kind: "settled" };
		}
		if (pending || durableClaimAccepted || context.dedupe.has(`chat:${clientRunId}`) || context.chatRunState.hasAbortMarker(clientRunId) || context.chatAbortControllers.has(clientRunId) || context.chatQueuedTurns?.has(clientRunId)) throw new SessionGoalOperationError("operation-conflict", "Goal operation ID is already used by another request.");
		return { kind: "new" };
	} catch (error) {
		if (!(error instanceof SessionGoalOperationError)) throw error;
		respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, error.message, { details: { reason: `goal-${error.code}` } }));
		return { kind: "settled" };
	}
}
/** Settle stop/retry/dedupe cases before reserving lifecycle admission. */
async function runChatSendPreAdmission(params) {
	params.assertCurrent?.();
	const { request, session, respond, context, client } = params;
	const { stopCommand } = request;
	const { cfg, entry, sessionKey, rawSessionKey, sessionLoadKey, selectedAgent, clientRunId, sessionLoadOptions, storePath, legacyKey, sessionRoutingChanged } = session;
	if (resolveSendPolicy({
		cfg,
		entry,
		sessionKey,
		channel: sessionDeliveryChannel(entry),
		chatType: entry?.chatType
	}) === "deny") {
		respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "send blocked by session policy"));
		return false;
	}
	if (request.goalOperation) {
		const retry = inspectGoalChatSendRetry(params);
		if (retry.kind === "settled") return false;
		if (retry.kind === "replay") {
			const claim = await resolveDurableChatClaim({
				canonicalSessionKey: sessionKey,
				cfg,
				clientRunId,
				entry,
				persistedSessionKey: legacyKey ?? sessionKey,
				reloadEntry: () => loadGatewaySessionEntry(sessionLoadKey, sessionLoadOptions).entry,
				storePath,
				recoveryRuntime: context.recoveryRuntime,
				warn: (message) => context.logGateway.warn(message)
			});
			params.assertCurrent?.();
			if (claim.kind === "pending" || claim.kind === "rejected") respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, claim.message, { retryable: claim.kind === "pending" }));
			else respond(true, {
				...retry.receipt,
				replayed: true
			}, void 0, {
				cached: true,
				runId: clientRunId
			});
			return false;
		}
	}
	if (stopCommand) {
		if (sessionRoutingChanged(cfg)) {
			respondChatSessionRoutingChanged(respond);
			return false;
		}
		const stopOwnerScope = resolveChatSendStopOwnerScope({
			cfg,
			selectedAgentId: selectedAgent.agentId,
			sessionKey
		});
		const stopStorePath = session.readSource?.path ?? storePath;
		const guard = {};
		const assertCurrent = () => {
			if (guard.failure) throw guard.failure.error;
			try {
				params.assertCurrent?.();
				if (request.p.queueMode !== "steer" && session.expectedLeafEntryId !== void 0) assertExpectedLeafActive({
					canonicalKey: sessionKey,
					storePath: stopStorePath,
					entry: loadExactSessionEntryCandidates({
						...session.readSource ? { readSource: session.readSource } : {
							storePath: stopStorePath,
							agentId: session.agentId
						},
						sessionKeys: [sessionKey],
						readOnly: true
					})[0]?.entry
				}, session.agentId, session.expectedLeafEntryId, session.requestedSessionId);
			} catch (error) {
				guard.failure = { error };
				throw error;
			}
		};
		let res;
		try {
			assertCurrent();
			res = await abortChatRunsForSessionKeyWithPartials({
				context,
				ops: createChatAbortOps(context),
				sessionKey,
				sessionKeyAliases: sessionKey === rawSessionKey ? void 0 : [rawSessionKey],
				agentId: stopOwnerScope.agentId,
				sessionId: entry?.sessionId,
				session: {
					ok: true,
					value: {
						cfg,
						storePath: stopStorePath,
						entry,
						canonicalKey: sessionKey,
						agentId: session.agentId
					}
				},
				defaultAgentId: stopOwnerScope.defaultAgentId,
				abortOrigin: "stop-command",
				stopReason: "stop",
				requester: resolveChatAbortRequester(client),
				assertCurrent,
				cascadeDescendants: true
			});
			if (guard.failure) throw guard.failure.error;
		} catch (error) {
			const admissionError = guard.failure ? guard.failure.error : error;
			if (admissionError instanceof SessionMutationAuthorizationChangedError) throw admissionError;
			respondChatSendAdmissionError(admissionError, respond);
			return false;
		}
		const error = res.unauthorized ? errorShape(ErrorCodes.INVALID_REQUEST, "unauthorized") : res.error ?? descendantAbortError(res.descendants, "Session");
		if (error) {
			respond(false, void 0, error);
			return false;
		}
		respond(true, {
			ok: true,
			aborted: res.aborted,
			runIds: res.runIds
		});
		return false;
	}
	if (respondChatSendRetry(params)) return false;
	let durableEntry = entry;
	if (entry && isMainSessionRecoveryReconciliationCandidate(entry)) {
		const { reconcileOrphanedGatewaySessionRecovery } = await import("./session-recovery-service-DTU73y5T.mjs");
		try {
			const recoveryEntry = loadGatewaySessionEntry(sessionLoadKey, sessionLoadOptions).entry;
			if (recoveryEntry) await reconcileOrphanedGatewaySessionRecovery({
				cfg,
				target: resolveGatewaySessionStoreTarget({
					cfg,
					key: sessionKey,
					agentId: session.agentId
				}),
				entry: recoveryEntry,
				authorizedPluginId: client?.internal?.pluginRuntimeOwnerId,
				commitGuard: () => {
					params.assertCurrent?.();
					if (sessionRoutingChanged(context.getRuntimeConfig())) throw new Error(SESSION_ROUTING_CHANGED_ERROR_REASON);
					const current = loadGatewaySessionEntry(sessionLoadKey, sessionLoadOptions);
					const conflict = resolveChatSendRequestConflict({
						...params,
						session: {
							...session,
							entry: current.entry
						}
					});
					if (conflict) throw new Error(conflict.message);
					const workStartError = resolveSessionWorkStartError(sessionKey, current.entry, {
						allowPendingWorkspace: true,
						providerReviewAcknowledgment: request.providerReviewAcknowledgment,
						runId: session.clientRunId,
						expectedSessionId: session.requestedSessionId ?? session.backingSessionId
					});
					if (workStartError) throw new Error(workStartError);
					if (request.p.queueMode !== "steer" && session.expectedLeafEntryId !== void 0) assertExpectedLeafActive(current, session.agentId, session.expectedLeafEntryId, session.requestedSessionId);
					captureAdmittedChatSendSessionSettings({
						commit: false,
						entry: current.entry,
						expectedPermissionMode: request.p.expectedPermissionMode,
						expectedToolOverrides: request.p.expectedToolOverrides
					});
				},
				workerPlacementContext: resolveSessionWorkerPlacementContext(context)
			});
			durableEntry = loadGatewaySessionEntry(sessionLoadKey, sessionLoadOptions).entry;
		} catch (error) {
			if (error instanceof SessionMutationAuthorizationChangedError) throw error;
			respondChatSendAdmissionError(error, respond);
			return false;
		}
		params.assertCurrent?.();
	}
	const durableClaim = await resolveDurableChatClaim({
		canonicalSessionKey: sessionKey,
		cfg,
		clientRunId,
		entry: durableEntry,
		persistedSessionKey: legacyKey ?? sessionKey,
		reloadEntry: () => loadGatewaySessionEntry(sessionLoadKey, sessionLoadOptions).entry,
		storePath,
		recoveryRuntime: context.recoveryRuntime,
		warn: (message) => context.logGateway.warn(`failed to retry durable chat recovery ${clientRunId}: ${message}`)
	});
	params.assertCurrent?.();
	const retrySession = {
		...session,
		entry: durableClaim.kind === "continue" ? durableClaim.entry : loadGatewaySessionEntry(sessionLoadKey, sessionLoadOptions).entry
	};
	if (respondChatSendRetry({
		...params,
		session: retrySession
	})) return false;
	if (durableClaim.kind === "pending" || durableClaim.kind === "rejected") {
		respond(false, void 0, errorShape(durableClaim.kind === "pending" || durableClaim.unavailable ? ErrorCodes.UNAVAILABLE : ErrorCodes.INVALID_REQUEST, durableClaim.message, { retryable: durableClaim.kind === "pending" }));
		return false;
	}
	if (durableClaim.kind === "accepted") {
		if (request.goalOperation) {
			const retry = inspectGoalChatSendRetry({
				...params,
				durableClaimAccepted: true
			});
			if (retry.kind === "replay") respond(true, {
				...retry.receipt,
				replayed: true
			}, void 0, {
				cached: true,
				runId: clientRunId
			});
			return false;
		}
		respond(true, {
			runId: clientRunId,
			status: "ok"
		}, void 0, {
			cached: true,
			runId: clientRunId
		});
		return false;
	}
	if (sessionRoutingChanged(cfg)) {
		respondChatSessionRoutingChanged(respond);
		return false;
	}
	const archivedSessionError = resolveSessionWorkStartError(sessionKey, entry, {
		allowPendingWorkspace: true,
		providerReviewAcknowledgment: request.providerReviewAcknowledgment,
		runId: clientRunId
	});
	if (archivedSessionError) {
		respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, archivedSessionError));
		return false;
	}
	return true;
}
//#endregion
//#region src/gateway/server-methods/chat-send-session.ts
function prepareChatSendSessionEntry(params) {
	const { cfg, client, agentId, getRuntimeConfig } = params;
	const creationError = authorizeGatewaySessionCreation({
		cfg,
		client,
		agentId
	});
	if (creationError) throw new Error(creationError.message);
	const creation = prepareSkillLibrarySessionCreation(client, getRuntimeConfig, resolveOperatorSessionCreation(client));
	const assertSkillSelection = () => assertPreparedSkillLibrarySelection(creation.skillLibrarySelections);
	const createdAt = Date.now();
	const sessionId = randomUUID();
	return {
		entry: {
			...buildSessionCreationStamp({
				...creation,
				sandbox: resolveCreatorSandbox(cfg, creation),
				now: createdAt
			}),
			sessionId,
			lifecycleRevision: randomUUID(),
			updatedAt: createdAt,
			sessionStartedAt: createdAt,
			lastInteractionAt: createdAt,
			chatType: "direct"
		},
		assertSkillSelection
	};
}
function loadChatSendSessionContext(params) {
	const { request, context } = params;
	const { p, explicitOrigin, normalizedAttachments } = request;
	const rawSessionKey = p.sessionKey;
	const agentIdOverride = normalizeOptionalChatText(p.agentId);
	const clientRunId = p.idempotencyKey;
	const pendingChatSendKey = pendingChatSendDedupeKey(clientRunId);
	const runtimeConfig = context.getRuntimeConfig();
	const requestedAgent = resolveRequestedSessionAgentId(runtimeConfig, rawSessionKey, agentIdOverride);
	if (!requestedAgent.ok) return {
		ok: false,
		error: requestedAgent.error
	};
	const requestedAgentId = requestedAgent.agentId;
	const sessionLoadKey = runtimeConfig.session?.scope !== "global" && rawSessionKey.trim().toLowerCase() === "global" ? resolveAgentMainSessionKey({
		cfg: runtimeConfig,
		agentId: requestedAgentId
	}) : rawSessionKey;
	const sessionLoadOptions = { agentId: requestedAgentId };
	const sessionLoadStartedAtMs = performance.now();
	const sessionLoadResult = measureDiagnosticsTimelineSpanSync("gateway.chat_send.load_session", () => loadGatewaySessionEntry(sessionLoadKey, sessionLoadOptions, runtimeConfig), {
		phase: "agent-turn",
		attributes: {
			runId: clientRunId,
			hasAttachments: normalizedAttachments.length > 0,
			hasExplicitOrigin: explicitOrigin !== void 0
		}
	});
	const sessionLoadMs = roundedChatSendTimingMs(performance.now() - sessionLoadStartedAtMs);
	const { cfg, agentId, storePath, entry, canonicalKey: sessionKey, legacyKey } = sessionLoadResult;
	const expectedSessionRoutingContract = normalizeOptionalChatText(p.expectedSessionRoutingContract);
	const expectedLeafEntryId = p.expectedLeafEntryId === null ? null : normalizeOptionalChatText(p.expectedLeafEntryId);
	const sessionRoutingChanged = (candidateConfig) => expectedSessionRoutingContract !== void 0 && expectedSessionRoutingContract.toLowerCase() !== resolveSessionRoutingContract(candidateConfig);
	return {
		ok: true,
		value: {
			rawSessionKey,
			sessionLoadKey,
			clientRunId,
			pendingChatSendKey,
			sessionLoadOptions,
			sessionLoadMs,
			cfg,
			agentId,
			selectedAgent: requestedAgent,
			storePath,
			...sessionLoadResult.readSource ? { readSource: sessionLoadResult.readSource } : {},
			entry,
			sessionKey,
			legacyKey,
			sessionRoutingChanged,
			expectedLeafEntryId,
			agentIdOverride,
			requestedAgentId
		}
	};
}
/** Load and validate the session/model facts shared by later admission and dispatch phases. */
function prepareChatSendSession(params) {
	const loaded = loadChatSendSessionContext(params);
	if (!loaded.ok) return loaded;
	const loadedValue = loaded.value;
	const { request, client } = params;
	const { p, explicitOrigin, normalizedAttachments, turnKind, rawMessage } = request;
	const { cfg, agentId, sessionKey, entry, legacyKey, selectedAgent } = loadedValue;
	if (isIncognitoSessionKey(sessionKey) && !entry) return {
		ok: false,
		error: `Incognito session "${sessionKey}" was not found.`
	};
	const missingHarnessSessionError = resolveMissingAgentHarnessSessionError(sessionKey, entry);
	if (missingHarnessSessionError) return {
		ok: false,
		error: missingHarnessSessionError
	};
	const deletedAgentId = resolveDeletedAgentIdFromSessionKey(cfg, sessionKey, entry, { acpMetadataSessionKey: legacyKey ?? sessionKey });
	if (deletedAgentId !== null) return {
		ok: false,
		error: `Agent "${deletedAgentId}" no longer exists in configuration`
	};
	const requestedSessionId = normalizeOptionalChatText(p.sessionId);
	const backingSessionId = entry?.sessionId ?? requestedSessionId;
	if (!entry) {
		const creationError = authorizeGatewaySessionCreation({
			cfg,
			client,
			agentId
		});
		if (creationError) return {
			ok: false,
			error: creationError
		};
	}
	const activeRunScopeKey = resolveChatSendActiveScopeKey({
		sessionKey,
		agentId: selectedAgent.agentId,
		mainKey: cfg.session?.mainKey
	});
	const resolvedSessionModel = resolveSessionModelRef(cfg, entry, agentId);
	const resolvedSessionAuthProvider = resolveProviderIdForAuth(resolvedSessionModel.provider, { config: cfg });
	const timeoutMs = resolveAgentTimeoutMs({
		cfg,
		overrideMs: p.timeoutMs
	});
	const now = Date.now();
	const restartSafeRequest = createRestartSafeChatRequest({
		goalRequestFingerprint: request.goalOperation?.requestFingerprint,
		cfg,
		eligible: isBrowserOperatorUiClient(request.clientInfo) && turnKind === "main" && normalizedAttachments.length === 0 && !request.reconnectResumeRequested && explicitOrigin === void 0 && p.deliver !== true && p.thinking === void 0 && p.fastMode === void 0 && p.fastAutoOnSeconds === void 0 && p.timeoutMs === void 0 && request.systemInputProvenance === void 0 && request.systemProvenanceReceipt === void 0 && !request.suppressCommandInterpretation,
		message: rawMessage,
		mentions: p.mentions,
		senderIsOwner: hasGatewayAdminScope(client)
	});
	return {
		ok: true,
		value: {
			...loadedValue,
			requestedSessionId,
			backingSessionId,
			activeRunScopeKey,
			resolvedSessionModel,
			resolvedSessionAuthProvider,
			timeoutMs,
			now,
			restartSafeRequest
		}
	};
}
/** Refuse before send admission so confirmation can retain the unsent composer. */
async function prepareChatSendNativeRuntimeRestriction(params) {
	const { request, session, client, context } = params;
	const { entry, cfg, agentId, sessionKey, resolvedSessionModel } = session;
	if (request.turnKind !== "main" || request.stopCommand || !entry && session.requestedSessionId || !request.suppressCommandInterpretation && resolveTextCommand(request.inboundMessage, cfg)) return;
	const runtime = resolveEffectiveAgentRuntime({
		cfg,
		agentId,
		sessionKey,
		sessionEntry: entry,
		provider: resolvedSessionModel.provider,
		modelId: resolvedSessionModel.model
	});
	if (runtime === "openclaw") return;
	const harness = getRegisteredAgentHarness(runtime)?.harness;
	if (!harness || harness.executionEnvironment !== "host-only") return;
	const creation = resolveOperatorSessionCreation(client);
	const prospectiveEntry = entry ?? buildSessionCreationStamp({
		...creation,
		sandbox: resolveCreatorSandbox(cfg, creation),
		now: session.now
	});
	const restriction = resolveSessionNativeRuntimeRestriction({
		operation: "send",
		cfg,
		agentId,
		sessionKey,
		entry: prospectiveEntry,
		persistedEntry: entry,
		harness,
		provider: resolvedSessionModel.provider,
		modelId: resolvedSessionModel.model,
		callerCanConsent: hasGatewayAdminScope(client)
	});
	const details = readAgentRuntimeRestrictionErrorDetails(restriction?.details);
	if (entry || !restriction || !hasGatewayAdminScope(client) || !details || details.reason === "sandbox-required" || details.reason === "remote-execution") return restriction;
	const [{ loadReplySessionInitializationSnapshot, commitReplySessionInitialization }, { recordSessionCreated }] = await Promise.all([import("./session-accessor.reset-ZJ3shIwp.mjs"), import("./session-created-C_3sUhqf.mjs")]);
	params.assertCurrent?.();
	const scope = {
		agentId,
		sessionKey,
		storePath: session.storePath
	};
	const snapshot = loadReplySessionInitializationSnapshot(scope);
	if (snapshot.currentEntry) return errorShape(ErrorCodes.INVALID_REQUEST, "Session changed before native confirmation. Retry.");
	const prepared = prepareChatSendSessionEntry({
		cfg,
		client,
		agentId,
		getRuntimeConfig: context.getRuntimeConfig
	});
	const committed = await commitReplySessionInitialization({
		...scope,
		activeSessionKey: sessionKey,
		expectedRevision: snapshot.revision,
		sessionEntry: prepared.entry,
		commitGuard: () => {
			params.assertCurrent?.();
			prepared.assertSkillSelection();
			const currentConfig = context.getRuntimeConfig();
			const current = loadGatewaySessionEntry(session.sessionLoadKey, session.sessionLoadOptions);
			const currentCreation = resolveOperatorSessionCreation(client);
			const currentModel = resolveSessionModelRef(currentConfig, void 0, agentId);
			const creationError = authorizeGatewaySessionCreation({
				cfg: currentConfig,
				client,
				agentId
			});
			const currentRestriction = readAgentRuntimeRestrictionErrorDetails(resolveSessionNativeRuntimeRestriction({
				operation: "send",
				cfg: currentConfig,
				agentId,
				sessionKey,
				entry: prepared.entry,
				persistedEntry: void 0,
				harness,
				provider: currentModel.provider,
				modelId: currentModel.model,
				callerCanConsent: hasGatewayAdminScope(client)
			})?.details);
			if (creationError || !hasGatewayAdminScope(client) || current.entry || current.storePath !== session.storePath || current.canonicalKey !== sessionKey || session.sessionRoutingChanged(currentConfig) || currentCreation.actor?.id !== prepared.entry.createdActor?.id || resolveCreatorSandbox(currentConfig, currentCreation) !== prepared.entry.sandbox || currentModel.provider !== resolvedSessionModel.provider || currentModel.model !== resolvedSessionModel.model || currentRestriction?.reason !== details.reason || resolveEffectiveAgentRuntime({
				cfg: currentConfig,
				agentId,
				sessionKey,
				provider: currentModel.provider,
				modelId: currentModel.model
			}) !== runtime) throw new Error(creationError?.message ?? "Native session creation changed before commit.");
		}
	});
	if (!committed.ok) return errorShape(ErrorCodes.INVALID_REQUEST, "Session changed before native confirmation. Retry.");
	recordSessionCreated(cfg, {
		agentId,
		sessionKey,
		entry: committed.sessionEntry
	});
	emitSessionsChanged(context, {
		agentId,
		sessionKey,
		reason: "create"
	});
	return resolveSessionNativeRuntimeRestriction({
		operation: "send",
		cfg: context.getRuntimeConfig(),
		agentId,
		sessionKey,
		entry: committed.sessionEntry,
		persistedEntry: committed.sessionEntry,
		harness,
		provider: resolvedSessionModel.provider,
		modelId: resolvedSessionModel.model,
		callerCanConsent: hasGatewayAdminScope(client)
	});
}
//#endregion
//#region src/gateway/server-methods/chat-send-work-admission.ts
/** Queued and collected turns share the original session and caller admission until settlement. */
function createChatSendWorkAdmission(params) {
	let references = 1;
	let finishPendingInput;
	const release = () => {
		if (references === 0) return;
		references -= 1;
		if (references !== 0) return;
		try {
			finishPendingInput?.();
		} catch (error) {
			params.logGateway.warn(`Failed to finish pending chat input: ${formatForLog(error)}`);
		} finally {
			try {
				params.admission.release();
			} finally {
				params.releaseCallerAuthority?.();
			}
		}
	};
	const hold = () => {
		let released = false;
		return () => {
			if (released) return;
			released = true;
			release();
		};
	};
	return {
		isActive: () => references > 0,
		release: hold(),
		retain: () => {
			if (references === 0) throw new Error("cannot retain a released chat work admission");
			references += 1;
			return hold();
		},
		setPendingInputCleanup: (finish) => {
			finishPendingInput = finish;
		}
	};
}
/** Rechecked inside the session writer barrier before exclusive input is admitted. */
function assertChatSendExclusiveAdmission(request, session) {
	if (!request.goalOperation && !request.providerReviewAcknowledgment) return;
	const { storePath, sessionKey, backingSessionId, activeRunScopeKey } = session;
	if (isCompetingSessionWorkAdmissionActive(storePath, [sessionKey, backingSessionId]) || hasPendingFollowupQueueWork([
		sessionKey,
		backingSessionId,
		activeRunScopeKey
	]) || replyRunRegistry.isActive(activeRunScopeKey)) throw new Error(request.providerReviewAcknowledgment ? "The session still has active work. Review its status before continuing." : "goal-session-busy");
}
//#endregion
//#region src/gateway/server-methods/chat-send-admission.ts
/** Reserve the session lifecycle and register the abortable run before attachment work. */
async function admitChatSend(params) {
	params.assertCurrent?.();
	const { request, session, respond, context, client } = params;
	const { p, explicitOrigin, normalizedAttachments, turnKind } = request;
	const progressRefresh = isProgressCardRefreshInputProvenance(request.systemInputProvenance);
	const { rawSessionKey, sessionLoadKey, clientRunId, pendingChatSendKey, sessionLoadOptions, cfg, storePath, entry, sessionKey, sessionRoutingChanged, selectedAgent, requestedSessionId, backingSessionId, agentId, resolvedSessionModel, resolvedSessionAuthProvider, activeRunScopeKey, timeoutMs, now, restartSafeRequest, expectedLeafEntryId } = session;
	const chatSendTraceAttributes = {
		runId: clientRunId,
		sessionKey,
		agentId: selectedAgent.agentId ?? agentId,
		provider: resolvedSessionModel.provider,
		model: resolvedSessionModel.model,
		hasAttachments: normalizedAttachments.length > 0,
		hasExplicitOrigin: explicitOrigin !== void 0,
		hasConnectedClient: client?.connect !== void 0
	};
	const originatingRoute = resolveChatSendOriginatingRoute({
		client: request.clientInfo,
		deliver: p.deliver,
		entry,
		explicitOrigin,
		hasConnectedClient: client?.connect !== void 0,
		mainKey: cfg.session?.mainKey,
		sessionKey
	});
	const lifecycleGeneration = getAgentEventLifecycleGeneration();
	const pendingAttemptId = randomUUID();
	const readPendingReservation = () => readPreRegisteredRun({
		key: pendingChatSendKey,
		entry: context.dedupe.get(pendingChatSendKey),
		keyPrefix: PENDING_CHAT_SEND_DEDUPE_PREFIX
	});
	const goalRetry = inspectGoalChatSendRetry(params);
	if (goalRetry.kind !== "new") {
		if (goalRetry.kind === "replay") respond(true, {
			...goalRetry.receipt,
			replayed: true
		}, void 0, {
			cached: true,
			runId: clientRunId
		});
		return { ok: false };
	}
	if (readPendingReservation()?.payload.goalFingerprint) {
		respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "Run ID is reserved by a Goal request; use a new ID."));
		return { ok: false };
	}
	if (!request.goalOperation && respondChatSendRetry(params)) return { ok: false };
	params.assertCurrent?.();
	context.dedupe.set(pendingChatSendKey, {
		ts: now,
		ok: true,
		requestIdentity: request.requestIdentity,
		payload: {
			runId: clientRunId,
			attemptId: pendingAttemptId,
			status: "accepted",
			sessionKey,
			...backingSessionId ? { sessionId: backingSessionId } : {},
			...rawSessionKey === sessionKey ? {} : { sessionKeyAliases: [rawSessionKey] },
			...selectedAgent.agentId ? { agentId: selectedAgent.agentId } : {},
			ownerConnId: normalizeOptionalChatText(client?.connId),
			ownerDeviceId: normalizeOptionalChatText(client?.connect?.device?.id),
			expiresAtMs: resolveChatRunExpiresAtMs({
				now,
				timeoutMs
			}),
			turnKind,
			...request.goalOperation ? { goalFingerprint: request.goalOperation.requestFingerprint } : {}
		}
	});
	const clearPendingChatSendReservation = () => {
		const pending = readPendingReservation();
		if (pending?.runId === clientRunId && normalizeUnknownChatText(pending.payload.attemptId) === pendingAttemptId) context.dedupe.delete(pendingChatSendKey);
	};
	let admittedSessionId = backingSessionId ?? clientRunId;
	let expectedActiveReplyOperation;
	let gatewayWorkAdmission;
	let admittedRunAbort;
	let restartSafeAdmission;
	let initialSessionEntry;
	let admittedSessionSettings;
	let assertInitialSkillSelection;
	let messageInjectionTarget;
	let runInterruptTarget;
	let reservationSuperseded = false;
	let supersedingResult;
	const assertChatWorkAdmissionAllowed = (commitOutcome) => {
		params.assertCurrent?.();
		const retainedRequestConflict = resolveChatSendRequestConflict(params);
		if (retainedRequestConflict) throw new Error(retainedRequestConflict.message);
		if (context.chatRunState.hasAbortMarker(clientRunId)) return;
		const pendingReservation = readPendingReservation();
		if (pendingReservation && normalizeUnknownChatText(pendingReservation.payload.attemptId) !== pendingAttemptId) {
			if (commitOutcome) reservationSuperseded = true;
			return;
		}
		if (!pendingReservation) {
			const terminalResult = readChatSendDedupeResponse(context.dedupe, clientRunId);
			if (terminalResult || context.chatAbortControllers.has(clientRunId)) {
				if (commitOutcome) {
					reservationSuperseded = true;
					supersedingResult = terminalResult;
				}
				return;
			}
		}
		if (lifecycleGeneration !== getAgentEventLifecycleGeneration()) {
			if (commitOutcome) writePreRegisteredChatAbort({
				context,
				runId: clientRunId,
				stopReason: "restart",
				attemptId: pendingAttemptId
			});
			return;
		}
		if (!pendingReservation || !isFutureDateTimestampMs(pendingReservation.payload.expiresAtMs, { nowMs: Date.now() })) {
			if (commitOutcome) writePreRegisteredChatAbort({
				context,
				runId: clientRunId,
				stopReason: "timeout",
				attemptId: pendingAttemptId
			});
			return;
		}
		const latestSession = loadGatewaySessionEntry(sessionLoadKey, {
			...sessionLoadOptions,
			clone: false
		});
		if (sessionRoutingChanged(latestSession.cfg)) throw new Error(SESSION_ROUTING_CHANGED_ERROR_REASON);
		const latestEntry = latestSession.entry;
		const requestConflict = resolveChatSendRequestConflict({
			...params,
			session: {
				...session,
				entry: latestEntry
			}
		});
		if (requestConflict) throw new Error(requestConflict.message);
		admittedSessionSettings = captureAdmittedChatSendSessionSettings({
			commit: commitOutcome,
			entry: latestEntry,
			expectedPermissionMode: p.expectedPermissionMode,
			expectedToolOverrides: p.expectedToolOverrides
		});
		assertChatSendExclusiveAdmission(request, session);
		if (entry && !latestEntry) throw new Error(`Session "${sessionKey}" was deleted while starting work. Retry.`);
		const resolvedInjectionTarget = p.queueMode === "steer" ? replyRunRegistry.resolveCurrentMessageInjectionTarget(activeRunScopeKey) : void 0;
		if (commitOutcome && resolvedInjectionTarget) messageInjectionTarget = resolvedInjectionTarget;
		const resolvedInterruptTarget = p.queueMode === "interrupt" ? replyRunRegistry.resolveCurrentInterruptTarget(activeRunScopeKey) : void 0;
		if (commitOutcome && resolvedInterruptTarget) runInterruptTarget = resolvedInterruptTarget;
		if (commitOutcome && p.queueMode !== "steer" && expectedLeafEntryId !== void 0) assertExpectedLeafActive(latestSession, agentId, expectedLeafEntryId, requestedSessionId);
		if (backingSessionId && latestEntry?.sessionId && latestEntry.sessionId !== backingSessionId && (expectedLeafEntryId === void 0 || commitOutcome)) throw new Error(`Session "${sessionKey}" changed while starting work. Retry.`);
		const retryableClaim = isRetryableUnadoptedChatClaim(latestEntry, clientRunId);
		if (latestEntry?.restartRecoveryDeliveryRunId && latestEntry.restartRecoveryDeliverySourceRunId === clientRunId && !retryableClaim || hasRestartRecoveryTerminalRun(latestEntry, clientRunId)) {
			if (commitOutcome) {
				reservationSuperseded = true;
				supersedingResult = {
					ts: Date.now(),
					ok: true,
					payload: {
						runId: clientRunId,
						status: "ok"
					}
				};
			}
			return;
		}
		const archivedError = resolveSessionWorkStartError(sessionKey, latestEntry, {
			allowPendingWorkspace: true,
			providerReviewAcknowledgment: request.providerReviewAcknowledgment,
			runId: clientRunId
		});
		if (archivedError) throw new Error(archivedError);
		if (!commitOutcome) return;
		admittedSessionId = latestEntry?.sessionId ?? backingSessionId ?? clientRunId;
		expectedActiveReplyOperation = replyRunRegistry.get(activeRunScopeKey);
		if (request.goalOperation?.action === "start" && !latestEntry && !requestedSessionId) {
			const prepared = prepareChatSendSessionEntry({
				cfg: latestSession.cfg,
				client,
				agentId,
				getRuntimeConfig: context.getRuntimeConfig
			});
			initialSessionEntry = prepared.entry;
			assertInitialSkillSelection = prepared.assertSkillSelection;
			admittedSessionId = initialSessionEntry.sessionId;
		}
		restartSafeAdmission = resolveRestartSafeChatAdmission({
			agentId,
			cfg: latestSession.cfg,
			clientRunId,
			context,
			entry: latestEntry,
			initialSessionEntry,
			now: Date.now(),
			request: restartSafeRequest,
			requestedSessionId,
			sessionId: admittedSessionId,
			sessionKey: latestSession.canonicalKey,
			storePath: latestSession.storePath
		});
		if (request.goalOperation && !restartSafeAdmission) throw new Error("Goal start or resume requires the built-in OpenClaw runtime and an idle local session with recoverable history. This action is unavailable for native Codex and other external runtimes.");
		if (retryableClaim && !restartSafeAdmission) throw new Error("chat retry does not match its durable admission");
		admittedRunAbort = registerChatAbortController({
			chatAbortControllers: context.chatAbortControllers,
			runId: clientRunId,
			sessionId: admittedSessionId,
			sessionKey,
			agentId: selectedAgent.agentId,
			timeoutMs,
			now,
			ownerConnId: normalizeOptionalChatText(client?.connId),
			ownerDeviceId: normalizeOptionalChatText(client?.connect?.device?.id),
			providerId: resolvedSessionModel.provider,
			authProviderId: resolvedSessionAuthProvider,
			isAbortable: (active) => isReplyRunAbortableForSignal(active.controller.signal),
			kind: "chat-send",
			turnKind,
			...progressRefresh ? {
				controlUiVisible: false,
				projectSessionActive: false
			} : {},
			lifecycleGeneration
		});
	};
	try {
		gatewayWorkAdmission = await beginSessionWorkAdmission({
			scope: storePath,
			identities: [sessionKey, backingSessionId],
			assertAllowed: () => assertChatWorkAdmissionAllowed(false),
			revalidateAllowed: () => assertChatWorkAdmissionAllowed(true),
			onInterrupt: (reason) => {
				const stopReason = isAgentRunDirectAbortReason(reason) ? "rpc" : "restart";
				if (!admittedRunAbort) {
					if (!context.chatRunState.hasAbortMarker(clientRunId)) writePreRegisteredChatAbort({
						context,
						runId: clientRunId,
						stopReason,
						attemptId: pendingAttemptId
					});
				} else if (!admittedRunAbort.controller.signal.aborted) {
					if (admittedRunAbort.entry) admittedRunAbort.entry.abortStopReason = stopReason;
					admittedRunAbort.controller.abort(stopReason === "rpc" ? reason : createAgentRunRestartAbortError());
				}
			}
		});
		params.assertCurrent?.();
	} catch (err) {
		clearPendingChatSendReservation();
		admittedRunAbort?.cleanup();
		gatewayWorkAdmission?.release();
		if (err instanceof ExpectedProfileMismatchError) throw err;
		const requestConflict = resolveChatSendRequestConflict(params);
		if (requestConflict) {
			respond(false, void 0, requestConflict);
			return { ok: false };
		}
		const aborted = context.chatRunState.hasAbortMarker(clientRunId) && readChatSendDedupeResponse(context.dedupe, clientRunId);
		if (aborted) {
			respond(aborted.ok, aborted.payload, aborted.error, {
				cached: true,
				runId: clientRunId
			});
			return { ok: false };
		}
		respondChatSendAdmissionError(err, respond);
		return { ok: false };
	}
	const retainedRequestConflict = resolveChatSendRequestConflict(params);
	if (retainedRequestConflict) {
		clearPendingChatSendReservation();
		admittedRunAbort?.cleanup();
		gatewayWorkAdmission.release();
		respond(false, void 0, retainedRequestConflict);
		return { ok: false };
	}
	if (!request.goalOperation && admittedRunAbort?.registered && !reservationSuperseded && !readChatSendDedupeResponse(context.dedupe, clientRunId)) context.dedupe.set(`chat:${clientRunId}`, {
		ts: Date.now(),
		ok: true,
		requestIdentity: request.requestIdentity
	});
	clearPendingChatSendReservation();
	const activeRunAbort = admittedRunAbort;
	if (reservationSuperseded) {
		gatewayWorkAdmission.release();
		const supersedingCached = supersedingResult ?? readChatSendDedupeResponse(context.dedupe, clientRunId);
		if (supersedingCached) {
			respond(supersedingCached.ok, supersedingCached.payload, supersedingCached.error, {
				cached: true,
				runId: clientRunId
			});
			return { ok: false };
		}
		respond(true, {
			runId: clientRunId,
			status: "in_flight"
		}, void 0, {
			cached: true,
			runId: clientRunId
		});
		return { ok: false };
	}
	if (lifecycleGeneration !== getAgentEventLifecycleGeneration()) {
		if (activeRunAbort) {
			if (activeRunAbort.entry) activeRunAbort.entry.abortStopReason = "restart";
			activeRunAbort.controller.abort();
			activeRunAbort.cleanup();
		}
		gatewayWorkAdmission.release();
		if (!readChatSendDedupeResponse(context.dedupe, clientRunId)) writePreRegisteredChatAbort({
			context,
			runId: clientRunId,
			stopReason: activeRunAbort?.entry?.abortStopReason ?? "restart",
			attemptId: pendingAttemptId
		});
		const aborted = readChatSendDedupeResponse(context.dedupe, clientRunId);
		respond(aborted?.ok ?? true, aborted?.payload, aborted?.error, {
			cached: true,
			runId: clientRunId
		});
		return { ok: false };
	}
	if (!activeRunAbort) {
		gatewayWorkAdmission.release();
		const aborted = readChatSendDedupeResponse(context.dedupe, clientRunId);
		if (aborted) {
			respond(aborted.ok, aborted.payload, aborted.error, {
				cached: true,
				runId: clientRunId
			});
			return { ok: false };
		}
		respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, "chat run admission failed"));
		return { ok: false };
	}
	if (!activeRunAbort.registered) {
		gatewayWorkAdmission.release();
		respond(true, {
			runId: clientRunId,
			status: "in_flight"
		}, void 0, {
			cached: true,
			runId: clientRunId
		});
		return { ok: false };
	}
	let releaseGatewayRootContinuation = () => {};
	let releaseCallerAuthority;
	let capturedOperator;
	const cleanupPreDispatchAdmission = () => {
		try {
			activeRunAbort.cleanup();
			gatewayWorkAdmission.release();
			releaseGatewayRootContinuation();
		} finally {
			releaseCallerAuthority?.();
			releaseCallerAuthority = void 0;
		}
	};
	let interruptedActiveRun = false;
	try {
		capturedOperator = retainGatewayOperatorRun({
			...params,
			runId: clientRunId,
			entry: activeRunAbort.entry
		});
		releaseCallerAuthority = () => {
			try {
				capturedOperator.release?.();
			} finally {
				if (request.providerReviewAcknowledgment) retireProviderReviewAcknowledgment(request.providerReviewAcknowledgment);
			}
		};
		let interruptionSettled = true;
		if (runInterruptTarget) {
			interruptedActiveRun = true;
			interruptionSettled = (await interruptReplyRunTarget(runInterruptTarget, REPLY_RUN_IDLE_SETTLE_TIMEOUT_MS)).settled;
		} else if (p.queueMode === "interrupt") {
			const identities = [
				sessionKey,
				backingSessionId,
				admittedSessionId
			];
			const fallback = await gatewayWorkAdmission.run(async () => {
				params.assertCurrent?.();
				if (!isCompetingSessionWorkAdmissionActive(storePath, identities)) return {
					interrupted: false,
					settled: true
				};
				return {
					interrupted: true,
					settled: await interruptSessionWorkAdmissions({
						scope: storePath,
						identities,
						timeoutMs: REPLY_RUN_IDLE_SETTLE_TIMEOUT_MS
					})
				};
			});
			interruptedActiveRun = fallback.interrupted;
			interruptionSettled = fallback.settled;
		}
		params.assertCurrent?.();
		if (!interruptionSettled) {
			cleanupPreDispatchAdmission();
			respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, "Previous run is still shutting down. Please try again in a moment.", {
				retryable: true,
				retryAfterMs: 250
			}));
			return { ok: false };
		}
		releaseGatewayRootContinuation = retainGatewayRootWorkAdmissionContinuation() ?? (() => {});
		if (params.onAdmissionOwned && !await gatewayWorkAdmission.run(params.onAdmissionOwned)) {
			cleanupPreDispatchAdmission();
			return { ok: false };
		}
		params.assertCurrent?.();
	} catch (error) {
		cleanupPreDispatchAdmission();
		throw error;
	}
	const acquiredGatewayWorkAdmission = gatewayWorkAdmission;
	const sessionBinding = activeRunAbort.entry;
	const onSessionPrepared = (binding) => {
		if (binding.sessionKey !== sessionKey) return;
		if (context.chatAbortControllers.get(clientRunId) !== sessionBinding || lifecycleGeneration !== getAgentEventLifecycleGeneration() || !acquiredGatewayWorkAdmission.isActive() || !isChatAbortControllerEntryAbortable(sessionBinding) || sessionBinding.registrationCleanupRequested || sessionBinding.projectSessionActive === false && !progressRefresh || sessionBinding.projectSessionTerminalPending || sessionBinding.projectSessionTerminalPersisted) throw createAbortError("chat session preparation no longer owns its admission");
		sessionBinding.sessionId = binding.sessionId;
	};
	const retainedWork = createChatSendWorkAdmission({
		admission: acquiredGatewayWorkAdmission,
		releaseCallerAuthority,
		logGateway: context.logGateway
	});
	let discardAbandonedPreparedMedia;
	const cleanupAdmittedRun = () => {
		activeRunAbort.cleanup();
		retainedWork.release();
		releaseGatewayRootContinuation();
		discardAbandonedPreparedMedia?.();
		discardAbandonedPreparedMedia = void 0;
	};
	const rejectSessionRoutingChanged = () => {
		cleanupAdmittedRun();
		clearAgentRunContext(clientRunId, lifecycleGeneration);
		respondChatSessionRoutingChanged(respond);
	};
	const finishAbortedChatSend = () => {
		const stopReason = activeRunAbort.entry?.abortStopReason ?? "rpc";
		const endedAt = Date.now();
		const payload = buildAbortedChatSendPayload({
			runId: clientRunId,
			stopReason,
			endedAt
		});
		setGatewayDedupeEntry({
			dedupe: context.dedupe,
			key: `chat:${clientRunId}`,
			session: captureAgentJobSession(sessionBinding),
			entry: {
				ts: endedAt,
				ok: true,
				payload
			}
		});
		cleanupAdmittedRun();
		clearAgentRunContext(clientRunId, lifecycleGeneration);
		respond(true, payload, void 0, { runId: clientRunId });
	};
	claimAgentRunContext(clientRunId, {
		agentId: selectedAgent.agentId ?? agentId,
		sessionKey,
		sessionId: admittedSessionId,
		lifecycleGeneration,
		...progressCardRefreshRunProjection(request.systemInputProvenance)
	});
	return {
		ok: true,
		value: {
			activeRunAbort,
			operatorAuthority: capturedOperator.authority,
			armOperatorRunCancellation: capturedOperator.armCancellation,
			retireOperatorRunCancellation: capturedOperator.retireCancellation,
			admittedSessionSettings,
			admittedSessionId,
			...expectedActiveReplyOperation ? { expectedActiveReplyOperation } : {},
			sessionBinding,
			onSessionPrepared,
			initialSessionEntry,
			chatSendTraceAttributes,
			assertInitialSkillSelection,
			cleanupAdmittedRun,
			finishAbortedChatSend,
			gatewayWorkAdmission,
			lifecycleGeneration,
			interruptedActiveRun,
			messageInjectionTarget,
			originatingRoute,
			rejectSessionRoutingChanged,
			retainGatewayWorkAdmission: retainedWork.retain,
			setPendingInputCleanup: retainedWork.setPendingInputCleanup,
			assertWorkAdmissionCurrent: () => {
				const queued = context.chatQueuedTurns.get(clientRunId);
				if (!retainedWork.isActive() || !acquiredGatewayWorkAdmission.isActive() || lifecycleGeneration !== getAgentEventLifecycleGeneration() || activeRunAbort.controller.signal.aborted && !(queued?.controller === activeRunAbort.controller && queued.abortable === false)) throw new Error("Chat admission ended or was cancelled; submit a new turn.");
			},
			restartSafeAdmission,
			setDiscardAbandonedPreparedMedia: (discard) => {
				discardAbandonedPreparedMedia = discard;
			}
		}
	};
}
//#endregion
//#region src/gateway/server-methods/chat-human-mentions.ts
const INVALID_MENTIONS = "Selected mentions no longer match the message. Select the people again.";
function splitsSurrogate(text, offset) {
	const before = text.charCodeAt(offset - 1);
	const after = text.charCodeAt(offset);
	return before >= 55296 && before <= 56319 && after >= 56320 && after <= 57343;
}
function hasAsciiControlCharacter(text) {
	for (const character of text) {
		const code = character.charCodeAt(0);
		if (code < 32 || code === 127) return true;
	}
	return false;
}
/** Normalize raw selected spans against the request boundary's sanitized message. */
function normalizeChatHumanMentions(text, mentions, sanitizedText) {
	if (!mentions?.length) return {
		ok: true,
		value: void 0
	};
	if (mentions.length > 10) return {
		ok: false,
		error: INVALID_MENTIONS
	};
	const leadingSpace = sanitizedText.length - sanitizedText.trimStart().length;
	const trimmed = sanitizedText.trim();
	const normalized = [];
	let previousEnd = 0;
	for (const mention of mentions) {
		const token = text.slice(mention.start, mention.end);
		if (!Number.isSafeInteger(mention.start) || !Number.isSafeInteger(mention.end) || mention.start < previousEnd || mention.end > text.length || mention.end <= mention.start + 1 || token.length > 257 || token[0] !== "@" || !token.slice(1).trim() || hasAsciiControlCharacter(token) || splitsSurrogate(text, mention.start) || splitsSurrogate(text, mention.end)) return {
			ok: false,
			error: INVALID_MENTIONS
		};
		const prefix = sanitizeChatSendMessageInput(text.slice(0, mention.start));
		const throughToken = sanitizeChatSendMessageInput(text.slice(0, mention.end));
		if (!prefix.ok || !throughToken.ok || !sanitizedText.startsWith(throughToken.message)) return {
			ok: false,
			error: INVALID_MENTIONS
		};
		const start = prefix.message.length - leadingSpace;
		const end = throughToken.message.length - leadingSpace;
		if (start < 0 || end > trimmed.length || trimmed[start] !== "@") return {
			ok: false,
			error: INVALID_MENTIONS
		};
		normalized.push({
			profileId: mention.profileId,
			start,
			end
		});
		previousEnd = mention.end;
	}
	return {
		ok: true,
		value: normalized
	};
}
//#endregion
//#region src/gateway/server-methods/chat-send-request.ts
/** Validate and normalize the wire request before session or lifecycle work begins. */
function normalizeChatSendRequest(params) {
	const chatSendReceivedAtMs = performance.now();
	const client = params.client;
	const clientInfo = client?.connect?.client;
	const supportsTaskSuggestions = isOperatorUiClient(clientInfo) && params.client?.connect?.scopes?.includes("operator.admin") === true && hasGatewayClientCap(params.client?.connect?.caps, GATEWAY_CLIENT_CAPS.TASK_SUGGESTIONS);
	const controlUiReconnectResume = resolveControlUiReconnectResumeParams(params.params, clientInfo);
	if (!validateChatSendParams(controlUiReconnectResume.params)) return {
		ok: false,
		error: `invalid chat.send params: ${formatValidationErrors(validateChatSendParams.errors)}`
	};
	const p = controlUiReconnectResume.params;
	const providerReview = params.providerReviewAcknowledgment ? readProviderReviewAcknowledgment(params.providerReviewAcknowledgment) : void 0;
	if (providerReview && (p.sessionId !== providerReview.target.sessionId || p.idempotencyKey !== providerReview.nextRunId || p.message !== providerReview.review.review?.continuation?.message || p.attachments?.length || p.intent || p.queueMode || p.toolBindings || p.workContext || p.systemInputProvenance || p.systemProvenanceReceipt || p.suppressCommandInterpretation !== void 0 || p.thinking !== void 0 || p.fastMode !== void 0 || p.timeoutMs !== void 0)) return {
		ok: false,
		error: "Provider continuation no longer matches the reviewed input."
	};
	const suppressCommandInterpretation = p.suppressCommandInterpretation === true;
	const explicitOriginResult = normalizeExplicitChatSendOrigin({
		originatingChannel: p.originatingChannel,
		originatingTo: p.originatingTo,
		accountId: p.originatingAccountId,
		messageThreadId: p.originatingThreadId
	});
	if (!explicitOriginResult.ok) return explicitOriginResult;
	if ((p.systemInputProvenance || p.systemProvenanceReceipt || suppressCommandInterpretation || explicitOriginResult.value) && !params.trustedSystemInput && !hasGatewayAdminScope(params.client)) return {
		ok: false,
		error: p.systemInputProvenance || p.systemProvenanceReceipt || suppressCommandInterpretation ? "system provenance fields require admin scope" : "originating route fields require admin scope"
	};
	const sanitizedMessageResult = sanitizeChatSendMessageInput(p.message);
	if (!sanitizedMessageResult.ok) return sanitizedMessageResult;
	if (p.intent && (!p.message.trim() || p.message.length > 16e3 || p.idempotencyKey.length > 128 || p.queueMode !== void 0 || p.systemInputProvenance !== void 0 || p.systemProvenanceReceipt !== void 0 || p.suppressCommandInterpretation !== void 0 || sanitizedMessageResult.message !== p.message.normalize("NFC"))) return {
		ok: false,
		error: "Goal start requires a nonempty objective of at most 16000 characters, without queue or system-input options."
	};
	if (p.intent && (explicitOriginResult.value !== void 0 || p.deliver === true || p.toolBindings !== void 0 || p.thinking !== void 0 || p.fastMode !== void 0 || p.fastAutoOnSeconds !== void 0 || p.timeoutMs !== void 0 || controlUiReconnectResume.resumeRequested)) return {
		ok: false,
		error: "Goal start uses the session settings and local delivery; per-request runtime or routing overrides are not supported."
	};
	const systemReceiptResult = normalizeOptionalChatSystemReceipt(p.systemProvenanceReceipt);
	if (!systemReceiptResult.ok) return systemReceiptResult;
	const goalOperation = params.goalResume ?? (p.intent ? {
		action: "start",
		operationId: p.idempotencyKey,
		issuedAtMs: p.intent.issuedAtMs,
		objective: p.message,
		requestFingerprint: fingerprintSessionGoalRequest([p, hasGatewayAdminScope(client)])
	} : void 0);
	const commandInterpretationSuppressed = suppressCommandInterpretation || goalOperation !== void 0 || providerReview !== void 0;
	const inboundMessage = p.intent || providerReview ? p.message : sanitizedMessageResult.message;
	const systemInputProvenance = params.goalResume ? {
		kind: "internal_system",
		sourceTool: "session_goal_resume"
	} : normalizeInputProvenance(p.systemInputProvenance);
	if (!params.trustedSystemInput && isProgressCardRefreshInputProvenance(systemInputProvenance)) return {
		ok: false,
		error: "Progress refresh input is reserved for progressCard.refresh."
	};
	const systemProvenanceReceipt = systemReceiptResult.receipt;
	const stopCommand = !commandInterpretationSuppressed && isChatStopCommandText(inboundMessage);
	if (p.toolBindings) {
		if (!client || !isBrowserCopilotClient(clientInfo) || client.pairedClientId !== clientInfo?.id) return {
			ok: false,
			error: "run tool bindings require a paired browser copilot"
		};
		if (!hasGatewayClientCap(client.connect.caps, GATEWAY_CLIENT_CAPS.RUN_TOOL_BINDINGS)) return {
			ok: false,
			error: "run tool bindings require client capability"
		};
	}
	if (isBrowserCopilotClient(clientInfo) && !stopCommand && (!p.toolBindings || !Object.hasOwn(p.toolBindings, "browser"))) return {
		ok: false,
		error: "browser copilot runs require an explicit browser tool binding"
	};
	const turnKind = !commandInterpretationSuppressed && isBtwRequestText(inboundMessage) ? "btw" : "main";
	const normalizedAttachments = normalizeRpcAttachmentsToChatAttachments(p.attachments);
	const rawMessage = goalOperation || providerReview ? inboundMessage : inboundMessage.trim();
	if (!rawMessage && normalizedAttachments.length === 0) return {
		ok: false,
		error: "message or attachment required"
	};
	const mentions = normalizeChatHumanMentions(p.message, p.mentions, sanitizedMessageResult.message);
	if (!mentions.ok) return mentions;
	if (mentions.value && (!isBrowserOperatorUiClient(clientInfo) || !client?.authenticatedUserProfile || client.internal?.syntheticClient || client.internal?.senderAttribution || goalOperation || systemInputProvenance || systemProvenanceReceipt || explicitOriginResult.value || suppressCommandInterpretation || stopCommand || turnKind !== "main" || rawMessage.startsWith("/") || rawMessage.startsWith("!"))) return {
		ok: false,
		error: "Human mentions require a signed-in Control UI chat. Remove the selected mentions to use this mode."
	};
	if (p.workContext && (goalOperation || stopCommand || turnKind !== "main" || rawMessage.startsWith("/") || rawMessage.startsWith("!"))) return {
		ok: false,
		error: "Working context is only supported for ordinary chat messages."
	};
	const workContext = p.workContext ? {
		snapshot: captureChatWorkContext(p.workContext),
		text: rawMessage
	} : void 0;
	if (workContext && !workContext.snapshot.page) return {
		ok: false,
		error: "Working context requires a nonempty page."
	};
	const modelMessage = workContext ? [rawMessage, formatChatWorkContext(workContext.snapshot)].filter(Boolean).join("\n\n") : rawMessage;
	const requestIdentity = createHash("sha256").update(JSON.stringify([
		p.message,
		p.mentions?.map(({ profileId, start, end }) => [
			profileId,
			start,
			end
		]) ?? [],
		...workContext ? [workContext.snapshot] : [],
		...providerReview ? [providerReview.review.id, providerReview.target.sessionId] : []
	])).digest("hex");
	return {
		ok: true,
		value: {
			chatSendReceivedAtMs,
			clientInfo,
			supportsTaskSuggestions,
			p,
			...params.providerReviewAcknowledgment ? { providerReviewAcknowledgment: params.providerReviewAcknowledgment } : {},
			...goalOperation ? { goalOperation } : {},
			explicitOrigin: explicitOriginResult.value,
			inboundMessage: workContext ? modelMessage : inboundMessage,
			...workContext ? { workContext } : {},
			systemInputProvenance,
			systemProvenanceReceipt,
			suppressCommandInterpretation: commandInterpretationSuppressed,
			toolBindings: p.toolBindings,
			stopCommand,
			turnKind,
			normalizedAttachments,
			rawMessage: modelMessage,
			requestIdentity,
			...mentions.value ? { mentions: mentions.value } : {},
			reconnectResumeRequested: controlUiReconnectResume.resumeRequested
		}
	};
}
//#endregion
//#region src/gateway/server-methods/chat-send-setup.ts
/** Normalize, prepare, and exclusively admit one new chat.send request. */
async function prepareAndAdmitChatSend({ params, respond, context, client, hasCurrentClientAuthority, sessionMutationAuthorization }, onAdmissionOwned, options) {
	const assertCurrent = sessionMutationAuthorization || hasCurrentClientAuthority ? () => {
		sessionMutationAuthorization?.assertCurrent();
		if (hasCurrentClientAuthority?.() === false) throw new Error("Gateway caller authority is no longer active.");
	} : void 0;
	const normalizedRequest = normalizeChatSendRequest({
		params,
		client,
		...options?.trustedSystemInput ? { trustedSystemInput: true } : {},
		...options?.goalResume ? { goalResume: options.goalResume } : {},
		...options?.providerReviewAcknowledgment ? { providerReviewAcknowledgment: options.providerReviewAcknowledgment } : {}
	});
	if (!normalizedRequest.ok) {
		respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, normalizedRequest.error, normalizedRequest.reason ? { details: { reason: normalizedRequest.reason } } : void 0));
		return;
	}
	const preparedSession = prepareChatSendSession({
		request: normalizedRequest.value,
		context,
		client
	});
	if (!preparedSession.ok) {
		respond(false, void 0, typeof preparedSession.error === "string" ? errorShape(ErrorCodes.INVALID_REQUEST, preparedSession.error) : preparedSession.error);
		return;
	}
	if (normalizedRequest.value.mentions) {
		const mentions = context.mentionInbox?.validateRecipients(client, preparedSession.value.entry ? {
			sessionKey: preparedSession.value.sessionKey,
			agentId: preparedSession.value.agentId
		} : { agentId: preparedSession.value.agentId }, normalizedRequest.value.mentions.map((mention) => mention.profileId));
		if (!mentions?.ok) {
			respond(false, void 0, mentions?.error ?? errorShape(ErrorCodes.UNAVAILABLE, "Human mentions are unavailable; reconnect and retry."));
			return;
		}
	}
	if (!await runChatSendPreAdmission({
		request: normalizedRequest.value,
		session: preparedSession.value,
		respond,
		context,
		client,
		assertCurrent
	})) return;
	const nativeRestriction = await prepareChatSendNativeRuntimeRestriction({
		request: normalizedRequest.value,
		session: preparedSession.value,
		client,
		context,
		assertCurrent
	});
	if (nativeRestriction) {
		respond(false, void 0, nativeRestriction);
		return;
	}
	const admitted = await admitChatSend({
		request: normalizedRequest.value,
		session: preparedSession.value,
		respond,
		context,
		client,
		onAdmissionOwned,
		hasCurrentClientAuthority,
		assertCurrent
	});
	if (!admitted.ok) return;
	return {
		normalizedRequest,
		preparedSession,
		admitted
	};
}
//#endregion
//#region src/gateway/server-methods/chat-user-turn-recorder.ts
function createGatewayChatUserTurnController(params) {
	const { admission, request, session } = params;
	const sender = request.goalOperation?.action === "resume" ? void 0 : gatewayClientSenderFields(params.client).sender;
	const senderProfileId = params.client?.authenticatedUserProfile?.profileId;
	const selectedMentions = request.mentions;
	const mentionInbox = params.mentionInbox;
	const sourceId = buildRunUserTurnIdempotencyKey(session.clientRunId);
	const sourceClients = !params.client?.internal?.syntheticClient && (!request.systemInputProvenance || request.systemInputProvenance.kind === "external_user") ? normalizeMessageClientSources([request.clientInfo]) : [];
	const baseInput = {
		...params.transcript,
		...request.goalOperation?.action === "resume" ? { display: false } : {},
		text: request.rawMessage,
		...request.workContext ? { workContext: request.workContext } : {},
		...request.mentions ? { mentions: request.mentions } : {},
		timestamp: session.now,
		idempotencyKey: sourceId,
		...request.p.replyToId ? { replyToId: request.p.replyToId } : {},
		...sender ? { sender } : {},
		...sourceClients.length ? { transport: { clients: sourceClients } } : {},
		...hasGatewayAdminScope(params.client) ? { senderIsOwner: true } : {},
		...request.systemInputProvenance ? { provenance: request.systemInputProvenance } : {}
	};
	const replyContextFieldsPromise = request.p.replyToId ? resolveChatSendReplyContext({
		replyToId: request.p.replyToId,
		cfg: session.cfg,
		agentId: session.agentId,
		sessionKey: session.sessionKey,
		sessionEntry: session.entry,
		storePath: session.storePath,
		userSenderLabel: request.clientInfo?.displayName,
		warn: params.warn
	}) : void 0;
	let inputPromise = replyContextFieldsPromise ? replyContextFieldsPromise.then((fields) => ({
		...baseInput,
		...fields.ReplyToBody ? { replyToPreview: {
			text: fields.ReplyToBody,
			...fields.ReplyToSender ? { senderLabel: fields.ReplyToSender } : {}
		} } : {}
	})) : Promise.resolve(baseInput);
	let contextFreeCommand = false;
	const recorder = createUserTurnTranscriptRecorder({
		...sender?.id && !request.goalOperation ? { pendingInputRequestFingerprint: createHash("sha256").update(stableStringify([
			{
				...request.p,
				sessionId: admission.sessionBinding.sessionId,
				expectedLeafEntryId: void 0
			},
			sender.identity ?? sender.id,
			hasGatewayAdminScope(params.client)
		])).digest("hex") } : {},
		...request.goalOperation ? { sessionTurnMutation: {
			kind: "goal",
			operation: request.goalOperation,
			runId: session.clientRunId,
			assertCurrent: params.assertGoalCurrent
		} } : {},
		input: baseInput,
		resolveInput: () => inputPromise,
		target: () => {
			const { storePath, entry } = loadGatewaySessionEntry(session.sessionKey, {
				...session.sessionLoadOptions,
				clone: false
			});
			const sessionId = (entry ?? admission.initialSessionEntry)?.sessionId;
			if (!sessionId || sessionId !== admission.sessionBinding.sessionId) return;
			return {
				sessionId,
				expectedSessionId: sessionId,
				initialSessionEntry: admission.initialSessionEntry,
				sessionKey: session.sessionKey,
				sessionEntry: void 0,
				storePath,
				agentId: session.agentId,
				config: session.cfg
			};
		},
		...admission.restartSafeAdmission ? buildRestartSafeChatTranscriptState({
			admission: admission.restartSafeAdmission,
			clientRunId: session.clientRunId,
			startedAt: params.startedAt
		}) : {},
		errorContext: "gateway chat user turn transcript",
		assertOriginalInputCommit: params.assertOriginalInputCommit,
		beforeMessageWrite: (event) => {
			const originalInput = event.message.idempotencyKey === sourceId;
			const next = runAgentHarnessBeforeMessageWriteHook(event);
			if (originalInput && next?.role === "user") {
				recorder.assertOriginalInputCommit?.();
				if (contextFreeCommand) return {
					...next,
					excludeFromContext: true,
					__openclaw: {
						...asOptionalRecord(Reflect.get(next, "__openclaw")),
						contextFreeCommand: true
					}
				};
			}
			return next;
		},
		onPersistenceError: (error) => params.warn(`gateway user transcript persistence failed: ${formatForLog(error)}`),
		...selectedMentions && senderProfileId && mentionInbox ? { onOriginalInputCommitted: ({ message, anchor }) => {
			const stored = message["__openclaw"]?.humanMentions;
			const text = extractTextFromChatContent(message.content, {
				joinWith: "\n",
				normalizeText: (value) => value
			}) ?? "";
			const retained = selectedMentions.filter((mention) => Array.isArray(stored) && stored.some((value) => {
				const span = asOptionalRecord(value);
				return span?.profileId === mention.profileId && span.start === mention.start && span.end === mention.end && text.slice(mention.start, mention.end) === request.rawMessage.slice(mention.start, mention.end);
			}));
			if (!retained.length) {
				params.warn("Human mentions skipped because the committed text no longer contains the selected tokens.");
				return;
			}
			mentionInbox.recordCommittedInput({
				sourceId,
				committedSource: {
					generation: anchor.generation,
					sequence: anchor.rawSeq,
					timestamp: message.timestamp
				},
				agentId: anchor.agentId,
				sessionKey: session.sessionKey,
				sessionId: anchor.sessionId,
				messageId: anchor.entryId,
				senderProfileId,
				recipientProfileIds: retained.map((mention) => mention.profileId),
				excerpt: redactSensitiveText(text)
			});
		} } : {}
	});
	const persist = async (options) => {
		if (options?.contextFreeCommand === true && !recorder.hasPersisted()) contextFreeCommand = true;
		return await measureDiagnosticsTimelineSpan("gateway.chat_send.persist_user_transcript", () => recorder.persistFallback(), {
			phase: "agent-turn",
			config: session.cfg,
			attributes: admission.chatSendTraceAttributes
		});
	};
	return {
		baseInput,
		persist,
		persistBestEffort: async (options) => {
			return await persist(options).catch(() => void 0);
		},
		recorder,
		replyContextFieldsPromise,
		setInputPromise: (input) => {
			const previousInputPromise = inputPromise;
			inputPromise = Promise.all([previousInputPromise, input]).then(([previous, next]) => ({
				...previous,
				...next
			}));
		}
	};
}
//#endregion
//#region src/gateway/server-methods/chat-send-handler.ts
const mediaDocumentContextLoader = createLazyImportLoader(() => import("./file-context-Dgc7Sm-h.mjs"));
async function handleChatSendWithOptions({ req, params, respond, context, client, hasCurrentClientAuthority, sessionMutationAuthorization, sessionMutationCommitGuard }, onAdmissionOwned, externalAuthorityAdmission, options) {
	const setup = await prepareAndAdmitChatSend({
		params,
		respond,
		context,
		client,
		hasCurrentClientAuthority,
		sessionMutationAuthorization
	}, onAdmissionOwned, options);
	if (!setup) return;
	const { normalizedRequest, preparedSession, admitted } = setup;
	const { chatSendReceivedAtMs, clientInfo, p, systemInputProvenance, reconnectResumeRequested } = normalizedRequest.value;
	const { clientRunId, sessionLoadMs, cfg, storePath, entry, sessionKey, sessionRoutingChanged, selectedAgent } = preparedSession.value;
	const { activeRunAbort, admittedSessionId, chatSendTraceAttributes, finishAbortedChatSend, interruptedActiveRun, lifecycleGeneration, messageInjectionTarget, restartSafeAdmission } = admitted.value;
	const preparedAttachments = await prepareChatSendAttachments({
		request: normalizedRequest.value,
		session: preparedSession.value,
		admission: admitted.value,
		respond,
		context
	});
	if (!preparedAttachments.ok) return;
	let preparedMediaRecorder;
	admitted.value.setDiscardAbandonedPreparedMedia(() => {
		if (!preparedMediaRecorder?.hasPersisted() && !preparedMediaRecorder?.getPendingInputMessage?.()) discardPreparedInboundMedia(preparedAttachments.value.offloadedRefs);
	});
	if (activeRunAbort.controller.signal.aborted) {
		finishAbortedChatSend();
		return;
	}
	if (sessionRoutingChanged(context.getRuntimeConfig())) {
		admitted.value.rejectSessionRoutingChanged();
		return;
	}
	const { imageOrder, prepareAttachmentsMs } = preparedAttachments.value;
	const externalAdmissionParams = {
		runId: clientRunId,
		sessionKey,
		spawnedBy: entry?.spawnedBy,
		client,
		isCurrent: hasCurrentClientAuthority,
		inputProvenance: systemInputProvenance,
		hasExplicitOrigin: normalizedRequest.value.explicitOrigin !== void 0,
		hasRestoredCronContinuation: entry?.cronRunContinuation !== void 0,
		isIncognitoEntry: entry?.incognito === true,
		isReconnectResume: reconnectResumeRequested,
		isSystemGenerated: normalizedRequest.value.suppressCommandInterpretation || normalizedRequest.value.systemProvenanceReceipt !== void 0,
		turnKind: normalizedRequest.value.turnKind
	};
	const cronCreatorAuthority = externalAuthorityAdmission?.resolve(externalAdmissionParams);
	let dashboardSessionAuthorization;
	const assertDashboardReadCurrent = externalAuthorityAdmission?.allowsDashboardReads(externalAdmissionParams) ? () => {
		admitted.value.assertWorkAdmissionCurrent();
		sessionMutationCommitGuard?.();
		if (client?.invalidated || hasCurrentClientAuthority?.() === false || !externalAuthorityAdmission.allowsDashboardReads(externalAdmissionParams)) throw new Error("Dashboard message read admission is no longer active.");
		if (!dashboardSessionAuthorization) {
			const resolved = resolveSessionMutationAuthorization({
				client,
				context,
				method: "chat.send",
				requestParams: {
					agentId: preparedSession.value.agentId,
					sessionKey
				},
				expectedTarget: {
					agentId: preparedSession.value.agentId,
					sessionKey,
					storePath,
					sessionId: admitted.value.sessionBinding.sessionId
				}
			});
			if (resolved.error) throw new SessionMutationAuthorizationChangedError(resolved.error);
			if (!resolved.authorization) throw new Error("Dashboard session authorization is unavailable.");
			dashboardSessionAuthorization = resolved.authorization;
		}
		dashboardSessionAuthorization.assertCurrent();
	} : void 0;
	const admissionStartedAt = Date.now();
	const terminalizeRestartSafeAdmission = async (terminalState) => await terminalizeRestartSafeChatAdmission({
		admittedSessionId,
		clientRunId,
		sessionKey,
		startedAt: admissionStartedAt,
		storePath,
		...terminalState
	});
	let pendingStageAttempted = false;
	try {
		const assertInputAdmissionCurrent = () => {
			admitted.value.assertWorkAdmissionCurrent();
			sessionMutationCommitGuard?.();
		};
		assertInputAdmissionCurrent();
		const userTurn = createGatewayChatUserTurnController({
			admission: admitted.value,
			client,
			request: normalizedRequest.value,
			session: preparedSession.value,
			transcript: options?.transcript,
			startedAt: admissionStartedAt,
			warn: (message) => context.logGateway.warn(message),
			mentionInbox: context.mentionInbox,
			assertOriginalInputCommit: req.expectedProfileId === void 0 ? void 0 : assertInputAdmissionCurrent,
			assertGoalCurrent: () => {
				sessionMutationCommitGuard?.();
				sessionMutationAuthorization?.assertCurrent();
				const currentConfig = context.getRuntimeConfig();
				const initialEntry = admitted.value.initialSessionEntry;
				if (initialEntry) {
					admitted.value.assertInitialSkillSelection?.();
					const currentTarget = loadGatewaySessionEntry(preparedSession.value.sessionLoadKey, preparedSession.value.sessionLoadOptions);
					if (currentTarget.storePath !== storePath || currentTarget.canonicalKey !== sessionKey) throw new Error("Session routing changed before Goal admission; refresh and retry.");
					const creationError = authorizeGatewaySessionCreation({
						cfg: currentConfig,
						client,
						agentId: preparedSession.value.agentId
					});
					if (creationError) throw new SessionMutationAuthorizationChangedError(creationError);
					const creation = resolveOperatorSessionCreation(client);
					if (creation.actor?.id !== initialEntry.createdActor?.id || resolveCreatorSandbox(currentConfig, creation) !== initialEntry.sandbox) throw new Error("Session creation policy changed before Goal admission; retry.");
				}
				if (activeRunAbort.controller.signal.aborted || lifecycleGeneration !== getAgentEventLifecycleGeneration() || sessionRoutingChanged(currentConfig)) throw new Error("Goal admission changed before commit; refresh and retry.");
			}
		});
		const { persist: persistGatewayUserTurnTranscript, recorder: userTurnRecorder, replyContextFieldsPromise } = userTurn;
		preparedMediaRecorder = userTurnRecorder;
		const preparedUserTurn = prepareChatSendUserTurn({
			request: normalizedRequest.value,
			session: preparedSession.value,
			admission: admitted.value,
			attachments: preparedAttachments.value,
			client,
			logGateway: context.logGateway,
			getConfig: context.getRuntimeConfig,
			userTurn
		});
		const { ctx, isInternalTextSlashCommandTurn } = preparedUserTurn;
		admitted.value.setPendingInputCleanup(() => {
			try {
				userTurnRecorder.finishPendingInput?.(activeRunAbort.controller.signal.aborted && activeRunAbort.entry?.abortStopReason !== "restart" && !isAgentRunRestartAbortReason(activeRunAbort.controller.signal.reason) ? "cancelled" : "interrupted");
			} finally {
				preparedUserTurn.discardUnreferencedMedia(userTurnRecorder.getPendingInputMessage?.()).catch((error) => context.logGateway.warn(`Failed to discard unused chat media: ${String(error)}`));
			}
		});
		if (entry?.sessionId && userTurn.baseInput.display !== false && (!systemInputProvenance || systemInputProvenance.kind === "external_user") && !isInternalTextSlashCommandTurn && !normalizedRequest.value.goalOperation) {
			pendingStageAttempted = true;
			const assertCustodyCurrent = () => {
				admitted.value.assertWorkAdmissionCurrent();
				if (sessionMutationAuthorization?.assertAdmittedInputCurrent) sessionMutationAuthorization.assertAdmittedInputCurrent();
				else {
					sessionMutationCommitGuard?.();
					sessionMutationAuthorization?.assertCurrent();
				}
				if (sessionRoutingChanged(context.getRuntimeConfig())) throw new Error("Session routing changed before input admission; refresh and retry.");
			};
			const staged = await userTurnRecorder.stageApproved?.({
				runId: clientRunId,
				assertCurrent: () => {
					sessionMutationCommitGuard?.();
					assertCustodyCurrent();
				},
				assertAdmittedCurrent: req.expectedProfileId === void 0 ? assertCustodyCurrent : createMessageInjectionAuthority(() => {
					assertCustodyCurrent();
					return true;
				})
			});
			if (userTurnRecorder.isPendingInputConsumed?.()) {
				admitted.value.cleanupAdmittedRun();
				clearAgentRunContext(clientRunId, lifecycleGeneration);
				respond(true, {
					runId: clientRunId,
					status: "ok"
				}, void 0, {
					cached: true,
					runId: clientRunId
				});
				return;
			}
			if (!staged) throw new Error("Chat input was not durably admitted; refresh and retry.");
			const approved = userTurnRecorder.getPendingInputMessage?.();
			const text = extractTextFromChatContent(approved?.content, {
				joinWith: "\n",
				normalizeText: (value) => value
			}) ?? "";
			preparedUserTurn.applyApprovedText(text);
			emitSessionsChanged(context, {
				sessionKey,
				agentId: selectedAgent.agentId,
				reason: "send"
			}, { accessChanged: false });
		}
		let goalResult;
		if (restartSafeAdmission) {
			const persistedUserTurn = await persistGatewayUserTurnTranscript();
			const goalOperation = normalizedRequest.value.goalOperation;
			if (goalOperation) {
				const mutation = persistedUserTurn?.sessionTurnMutationResult;
				goalResult = mutation?.result ?? lookupSessionGoalOperation({
					sessionKey,
					storePath,
					agentId: preparedSession.value.agentId,
					expectedSessionId: admittedSessionId,
					operation: goalOperation
				});
				if (goalResult && (!persistedUserTurn || mutation?.replayed)) {
					admitted.value.cleanupAdmittedRun();
					clearAgentRunContext(clientRunId, lifecycleGeneration);
					respond(true, {
						...goalResult,
						replayed: true
					}, void 0, {
						cached: true,
						runId: clientRunId
					});
					return;
				}
				if (!goalResult || !persistedUserTurn?.sessionEntry) throw new Error("Goal and its input were not durably admitted.");
				if (admitted.value.initialSessionEntry) recordSessionCreated(preparedSession.value.cfg, {
					sessionKey,
					agentId: preparedSession.value.agentId,
					entry: persistedUserTurn.sessionEntry
				});
				await publishCommittedSessionGoalChange(context, {
					sessionKey,
					agentId: preparedSession.value.agentId,
					entry: persistedUserTurn.sessionEntry,
					actor: gatewayClientSessionCreator(client),
					summary: `goal ${goalOperation.action}`
				});
			}
			if (!persistedUserTurn || persistedUserTurn.sessionEntry?.status !== "running" || persistedUserTurn.sessionEntry.restartRecoveryDeliveryRunId !== clientRunId) throw new Error("chat turn was not durably admitted");
			if (lifecycleGeneration !== getAgentEventLifecycleGeneration()) {
				if (activeRunAbort.entry) activeRunAbort.entry.abortStopReason = "restart";
				activeRunAbort.controller.abort(createAgentRunRestartAbortError());
			}
			if (activeRunAbort.controller.signal.aborted) {
				if (!await terminalizeRestartSafeAdmission({
					retryable: activeRunAbort.entry?.abortStopReason === "restart",
					status: "killed"
				})) throw new Error("chat admission ownership changed before terminalization");
				finishAbortedChatSend();
				return;
			}
			if (sessionRoutingChanged(context.getRuntimeConfig())) {
				if (!await terminalizeRestartSafeAdmission({
					retryable: true,
					status: "failed"
				})) throw new Error("chat admission ownership changed before terminalization");
				admitted.value.rejectSessionRoutingChanged();
				return;
			}
		}
		if (messageInjectionTarget) invalidateSkillAuthoringForOtherRequester(sessionKey, client?.internal?.syntheticClient ? void 0 : client?.authenticatedUserProfile?.profileId);
		const steerDocumentContext = messageInjectionTarget && !isInternalTextSlashCommandTurn && ctx.media?.length ? await mediaDocumentContextLoader.load().then(async (runtime) => ({
			status: "rendered",
			...await runtime.renderInboundDocumentContext({
				ctx,
				cfg: preparedSession.value.cfg
			})
		})).catch((err) => {
			mediaDocumentContextLoader.clear();
			logVerbose(`steer document render failed, injecting raw content: ${formatErrorMessage(err)}`);
			return { status: "failed" };
		}) : void 0;
		if (activeRunAbort.controller.signal.aborted) return finishAbortedChatSend();
		if (sessionRoutingChanged(context.getRuntimeConfig())) return admitted.value.rejectSessionRoutingChanged();
		const beginCapturedMessageInjection = createChatSendMessageInjectionStarter({
			operatorAuthority: admitted.value.operatorAuthority,
			target: messageInjectionTarget,
			abortSignal: activeRunAbort.controller.signal,
			request: normalizedRequest.value,
			session: preparedSession.value,
			admittedSessionSettings: admitted.value.admittedSessionSettings,
			turn: preparedUserTurn,
			imageOrder,
			documentContext: steerDocumentContext,
			userTurnTranscriptRecorder: userTurnRecorder,
			logGateway: context.logGateway,
			assertCurrent: req.expectedProfileId === void 0 && !isProgressCardRefreshInputProvenance(systemInputProvenance) ? void 0 : assertInputAdmissionCurrent
		});
		const preAckReplyContextPromise = messageInjectionTarget && !isInternalTextSlashCommandTurn ? replyContextFieldsPromise : void 0;
		if (preAckReplyContextPromise) {
			applyChatSendReplyContextFields(ctx, await preAckReplyContextPromise);
			if (activeRunAbort.controller.signal.aborted) return finishAbortedChatSend();
			if (sessionRoutingChanged(context.getRuntimeConfig())) return admitted.value.rejectSessionRoutingChanged();
		}
		assertInputAdmissionCurrent();
		let messageInjectionAttempt = !p.replyToId || preAckReplyContextPromise ? beginCapturedMessageInjection() : void 0;
		const preAckInjection = await settleChatSendPreAckMessageInjection({
			attempt: messageInjectionAttempt,
			isAborted: () => activeRunAbort.controller.signal.aborted,
			sessionRoutingChanged: () => sessionRoutingChanged(context.getRuntimeConfig()),
			onAborted: finishAbortedChatSend,
			onSessionRoutingChanged: admitted.value.rejectSessionRoutingChanged
		});
		if (preAckInjection.status === "handled") return;
		messageInjectionAttempt = preAckInjection.attempt;
		const skillLibraryAuthoring = prepareGatewaySkillAuthoring({
			client,
			context,
			sessionMutationCommitGuard: () => {
				sessionMutationCommitGuard?.();
				admitted.value.assertWorkAdmissionCurrent();
			}
		}, sessionKey, !options && !systemInputProvenance && !reconnectResumeRequested && normalizedRequest.value.turnKind === "main");
		const serverTiming = shouldIncludeChatSendAckServerTiming(clientInfo) ? {
			receivedToAckMs: roundedChatSendTimingMs(performance.now() - chatSendReceivedAtMs),
			loadSessionMs: sessionLoadMs,
			...prepareAttachmentsMs !== void 0 ? { prepareAttachmentsMs } : {}
		} : void 0;
		const chatSendTiming = serverTiming && typeof client?.connId === "string" && client.connId.trim() ? {
			ackedAtMs: performance.now(),
			connId: client.connId.trim(),
			receivedAtMs: chatSendReceivedAtMs
		} : void 0;
		context.addChatRun(clientRunId, {
			sessionKey,
			agentId: selectedAgent.agentId,
			clientRunId,
			...chatSendTiming ? { chatSendTiming } : {}
		});
		const receipt = userTurnRecorder.getAdmissionReceipt?.();
		const ackPayload = {
			...goalResult,
			runId: clientRunId,
			status: "started",
			...receipt ? { messageSeq: receipt.activeMessagePosition + 1 } : {},
			...interruptedActiveRun ? { interruptedActiveRun: true } : {},
			...serverTiming ? { serverTiming } : {}
		};
		emitDiagnosticsTimelineEvent({
			type: "mark",
			name: "gateway.chat_send.ack_ready",
			phase: "agent-turn",
			attributes: {
				...chatSendTraceAttributes,
				ackStatus: ackPayload.status,
				...chatSendAckServerTimingAttributes(serverTiming)
			}
		}, { config: cfg });
		admitted.value.setDiscardAbandonedPreparedMedia(void 0);
		respond(true, ackPayload, void 0, { runId: clientRunId });
		context.recordClientActivity?.(client);
		const chatSendAckedAtMs = chatSendTiming?.ackedAtMs ?? performance.now();
		startChatDispatch({
			admissionStartedAt,
			admission: admitted.value,
			attachments: preparedAttachments.value,
			client,
			context,
			toolsAllow: options?.toolsAllow,
			prepareAssistantTranscriptMessage: options?.prepareAssistantTranscriptMessage,
			skillWorkshopProposalRevision: options?.skillWorkshopProposalRevision,
			skillLibraryAuthoring,
			cronCreatorAuthority,
			assertDashboardReadCurrent,
			externalAuthorityAdmission,
			injection: {
				beginCapturedMessageInjection,
				messageInjectionAttempt,
				preAckReplyContextPromise,
				replyContextFieldsPromise
			},
			request: normalizedRequest.value,
			session: preparedSession.value,
			terminalizeRestartSafeAdmission,
			timing: {
				chatSendAckedAtMs,
				chatSendTiming
			},
			turn: preparedUserTurn,
			userTurn
		});
	} catch (err) {
		await handleChatSendSetupError({
			cacheResult: normalizedRequest.value.goalOperation === void 0 && !pendingStageAttempted,
			admission: admitted.value,
			context,
			error: err,
			respond,
			session: preparedSession.value,
			terminalizeRestartSafeAdmission
		});
	}
}
async function handleChatSend(options, onAdmissionOwned, externalAuthorityAdmission) {
	await handleChatSendWithOptions(options, onAdmissionOwned, externalAuthorityAdmission);
}
/** The ordinary chat owner retains the exact human-reviewed continuation through settlement. */
async function handleProviderReviewContinuationChat(options, acknowledgment) {
	let admissionOwned = false;
	try {
		await handleChatSendWithOptions(options, async () => {
			admissionOwned = true;
			return true;
		}, void 0, { providerReviewAcknowledgment: acknowledgment });
	} finally {
		if (!admissionOwned) retireProviderReviewAcknowledgment(acknowledgment);
	}
}
/** Operator Resume admits one hidden internal continuation with the Goal transition. */
async function handleSessionGoalResumeChat(options, operation) {
	await handleChatSendWithOptions(options, void 0, void 0, { goalResume: operation });
}
/** Dispatches an operator-requested proposal revision with its reviewed revision bound to the run. */
async function handleChatSendWithSkillWorkshopProposalRevision(options, proposalRevision) {
	await handleChatSendWithOptions(options, void 0, void 0, {
		toolsAllow: ["skill_workshop"],
		skillWorkshopProposalRevision: { ...proposalRevision }
	});
}
/** Dispatches Gateway-authored system input without widening the public chat-send contract. */
async function handleTrustedInternalChatSend(options, onAdmissionOwned, inputOptions) {
	await handleChatSendWithOptions(options, onAdmissionOwned, void 0, {
		...inputOptions,
		trustedSystemInput: true
	});
}
//#endregion
export { handleTrustedInternalChatSend as a, prepareSessionRepositoryWorkspace as c, scheduleCreatedDashboardSessionTitle as d, handleSessionGoalResumeChat as i, resolveSessionRepositoryCreation as l, handleChatSendWithSkillWorkshopProposalRevision as n, normalizeChatSendRequest as o, handleProviderReviewContinuationChat as r, normalizeSessionProjectGitUrl as s, handleChatSend as t, validateSessionProjectPreparation as u };
