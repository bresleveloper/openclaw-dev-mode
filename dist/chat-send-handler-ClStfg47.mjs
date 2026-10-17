import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { g as isFutureDateTimestampMs } from "./number-coercion-CuVhdCBs.mjs";
import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { t as createLazyImportLoader } from "./lazy-promise-DGqyc4Y4.mjs";
import "./src-CdRlGRnW.mjs";
import { t as expectDefined } from "./expect-lbe3Hgrh.mjs";
import { a as asOptionalRecord } from "./record-coerce-TIsquoVR.mjs";
import { t as stableStringify } from "./stable-stringify-Djn3uxNo.mjs";
import { t as containsAsciiControlCharacter, y as uniqueStrings } from "./string-normalization-CECOqf64.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { _ as redactSensitiveText } from "./redact-DJ8j6ADa.mjs";
import { i as createAbortError } from "./src-D1BHGNTj.mjs";
import "./abort-signal-QqAmLWTl.mjs";
import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { p as isDiagnosticsEnabled } from "./diagnostic-events-BADdmgZf.mjs";
import { t as createSubsystemLogger } from "./subsystem-I-uqdx4f.mjs";
import { n as sha256Hex } from "./node-crypto-BG4u3UnX.mjs";
import { u as SessionGoalOperationError } from "./openclaw-state-worker-error-Cmtk9G4_.mjs";
import { r as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-DRG_I6tz.mjs";
import { d as resolveAgentWorkspaceDir } from "./agent-scope-config-CDYpzA0r.mjs";
import { r as isIncognitoSessionKey } from "./session-key-CmZ4o9-l.mjs";
import { M as parseAgentSessionKey, S as isCronSessionKey, b as isAcpSessionKey$1, k as resolveSessionDispatchKind, w as isSubagentSessionKey } from "./session-key-C09ow4h0.mjs";
import { n as emitDiagnosticsTimelineEvent, o as measureDiagnosticsTimelineSpan, s as measureDiagnosticsTimelineSpanSync } from "./diagnostics-timeline-DxQ8TaVy.mjs";
import "./agent-scope-CG17uXFn.mjs";
import { i as resolveProviderIdForAuth } from "./provider-auth-aliases-15nvbxqy.mjs";
import "./agent-runtime-id-BZLMe-UU.mjs";
import { a as clearAgentRunContext, l as getAgentRunContext, r as claimAgentRunContext } from "./agent-run-registry-BaxMDLZF.mjs";
import { l as getAgentEventLifecycleGeneration, p as onAgentEventForRun } from "./agent-events-GvNTkbe3.mjs";
import { d as hasGatewayAdminScope } from "./operator-scopes-DsrPoRc4.mjs";
import { a as hasGatewayClientCap, i as GATEWAY_CLIENT_NAMES, r as GATEWAY_CLIENT_MODES, t as GATEWAY_CLIENT_CAPS } from "./client-info-C8RatpKO.mjs";
import { t as INTERNAL_MESSAGE_CHANNEL } from "./message-channel-constants-B3vfipkP.mjs";
import { n as normalizeMessageChannel } from "./message-channel-core-CqBAHB04.mjs";
import { a as isInternalMessageChannel, i as isGatewayCliClient, l as isWebchatClient, n as isBrowserOperatorUiClient, s as isOperatorUiClient, t as isBrowserCopilotClient } from "./message-channel-j-k-Nup3.mjs";
import { a as sessionToolOverridesEqual, i as normalizeSessionToolOverrides } from "./agent-bundle-mcp-runtime-config-DoFuixnX.mjs";
import { s as createAgentDatabaseAdmissionErrorShape, t as AgentDatabaseAdmissionError } from "./agent-database-admission-dWNS6Rcs.mjs";
import { o as readSessionTranscriptRunId } from "./transcript-events-DUHAZLVw.mjs";
import { J as validateChatSendParams, Wh as readAgentRuntimeRestrictionErrorDetails } from "./src-l2dWvEsN.mjs";
import "./sessions-DJqMAtE3.mjs";
import { i as logVerbose } from "./globals-BXbZ1A_g.mjs";
import { r as hasGlobalHooks, t as getGlobalHookRunner } from "./hook-runner-global-D5rL9Ed5.mjs";
import { O as stripReplyMediaFailureFallback, a as buildTtsSupplementMediaPayload, c as getReplyPayloadMetadata, g as isReplyPayloadStatusNotice, h as isReplyPayloadSessionWriterDeliveryAuthorized, l as getReplyPayloadTtsSupplement, o as copyReplyPayloadMetadata, y as isReplyPayloadTtsSupplement } from "./reply-payload-NzglYOOT.mjs";
import { t as captureSessionTranscriptStorageEnvironment } from "./transcript-target-binding-WjVavOYj.mjs";
import { C as runWithGatewayIndependentRootWorkContinuation, g as retainGatewayRootWorkAdmissionContinuation } from "./gateway-work-admission-rc4ZgKq_.mjs";
import { o as resolveSessionRoutingContract, r as resolveAgentMainSessionKey, t as SESSION_ROUTING_CHANGED_ERROR_REASON } from "./main-session-00MgEWj5.mjs";
import { i as resolveCommandAuthorization } from "./command-auth-DyjyIT4u.mjs";
import { i as prepareSessionParticipantInput, s as bindRequesterProfile } from "./host-context-builder-BBwOEVfN.mjs";
import { t as ErrorCodes } from "./gateway-error-details-DIefe7Zy.mjs";
import { f as errorShape } from "./error-codes-Dh56LniQ.mjs";
import { w as formatValidationErrors } from "./worker-protocol-primitives-BajTgPT4.mjs";
import { l as resolveCreatorSandbox, n as authorizeGatewaySessionCreation } from "./operator-role-policy-BqPaarjx.mjs";
import "./channel-outbound-Iecgam5T.mjs";
import { n as getRegisteredAgentHarness } from "./registry-BrXrewXj.mjs";
import { n as withOpenClawAgentDatabaseReadOnly } from "./openclaw-agent-db-readonly-C4wDuLrp.mjs";
import { a as isAgentHarnessSessionKey, m as resolveMissingAgentHarnessSessionError } from "./agent-harness-session-key-D8EQIzja.mjs";
import { s as resolveEffectiveAgentRuntime } from "./thinking-runtime-DsaB5fLF.mjs";
import { o as isAudioFileName } from "./mime-CGDYrRzL.mjs";
import { d as readPersistedMediaFacts } from "./media-facts-CJdQ4R61.mjs";
import { i as getAgentWorkspaceAccess } from "./workspace-access-DjFUgH7e.mjs";
import { n as sessionDeliveryChannel, r as sessionDeliveryOrigin, t as deliveryContextFromSession } from "./delivery-context.read-CR06zOJ4.mjs";
import { i as toDatabaseOptions } from "./session-accessor.sqlite-scope-helpers-DOK3pvYX.mjs";
import { i as prepareSqliteScope, s as resolveSqliteScope } from "./session-accessor.sqlite-scope-CdpbxR_m.mjs";
import { o as waitForSessionTranscriptProjection } from "./session-transcript-reconcile-DP2BCaGd.mjs";
import { s as withSessionHistoryWorkerDatabase } from "./session-transcript-worker-runtime-CTwaPfeT.mjs";
import { r as loadExactSessionEntryCandidates } from "./session-accessor.sqlite-exact-read-JW6IveXD.mjs";
import { r as isSessionTranscriptProjectionUnavailableError, t as SessionTranscriptProjectionUnavailableError } from "./session-transcript-projection-error-B7C6SQei.mjs";
import { i as loadOrCreateProcessDeviceIdentity } from "./device-identity-KmxGQO-v.mjs";
import { n as buildSessionCreationStamp } from "./session-entry-provenance-Bfs2J1E7.mjs";
import { f as interruptSessionWorkAdmissions, n as beginSessionWorkAdmission, p as isCompetingSessionWorkAdmissionActive } from "./session-lifecycle-admission-GoxISURZ.mjs";
import { i as classifyAgentRunTerminalOutcome } from "./agent-run-terminal-outcome-Ccvy5spR.mjs";
import { a as loadSessionEntry, s as patchSessionEntryCore } from "./session-accessor.sqlite-entry-DjT1nXRD.mjs";
import { n as extractAssistantTextForPhase, t as extractAssistantPhaseText } from "./chat-message-content-C-d0FKNG.mjs";
import { l as sanitizeAssistantVisibleTextWithProfile } from "./assistant-visible-text-Bv6mP5pg.mjs";
import { H as extractTextFromChatContent, t as renderAgentHarnessPreflightUserMessage, v as renderFailoverCodeUserCopy } from "./user-facing-text-DC1sCo4O.mjs";
import { i as buildRunUserTurnIdempotencyKey } from "./user-turn-transcript.metadata-CNurmdgT.mjs";
import { g as progressCardRefreshRunProjection, h as normalizeInputProvenance, p as isProgressCardRefreshInputProvenance } from "./input-provenance-D1LHo5Qj.mjs";
import { s as loadTranscriptEventRowsAfterSeqSync } from "./session-accessor.sqlite-read-8qBtzC-z.mjs";
import { o as readSessionTranscriptActivePathEntryRelation } from "./session-accessor.sqlite-active-events-urwlgpH5.mjs";
import { t as readSessionTranscriptWatermark } from "./session-accessor.sqlite-transcript-watermark-D3Is2Kik.mjs";
import { i as prepareQualifiedSessionEntryTarget } from "./session-accessor.entry-8r2jOQkD.mjs";
import { I as normalizeMessageClientSources, j as readSessionSubmittedInput } from "./session-accessor-CQ-g9yb2.mjs";
import { a as tryResolveSessionCompatibilityOwnerAgentId, n as resolveRequestedSessionAgentId } from "./session-request-agent-Bxi11ET4.mjs";
import { c as updateSessionEntry } from "./session-accessor.reset-Bn2-AwEV.mjs";
import { n as readActiveTranscriptEntryAnchor } from "./session-accessor.sqlite-transcript-anchor-eRtZH9vP.mjs";
import { n as formatChatWorkContext, t as captureChatWorkContext } from "./work-context-Cn4SLmAO.mjs";
import { i as readSessionGoalOperationInDatabase, n as assertSessionGoalOperationTime } from "./goals-operations-BofIFvAE.mjs";
import { a as hasRestartRecoveryTerminalRun, t as buildRestartRecoveryClaimCleanupPatch } from "./restart-recovery-state-IiHiWzPq.mjs";
import { i as buildRestartRecoveryExpectedState } from "./session-turn.kernel-DMv2fk8b.mjs";
import { r as resolveSessionTranscriptDatabasePath } from "./session-accessor.transcript-target-CAOPCw68.mjs";
import { r as readAssistantDisplayContent } from "./assistant-display-content-mzartsGP.mjs";
import { i as parseInlineDirectives, l as stripInlineDirectiveTagsForDelivery, s as sanitizeReplyDirectiveId } from "./directive-tags-CHfxUaYi.mjs";
import { t as applyAssistantDeliveryDirectives } from "./transcript-assistant-delivery-Dcmz1NrH.mjs";
import { n as resolveSessionResetType, t as resolveChannelResetConfig } from "./reset-BvpOh-VC.mjs";
import { n as resolveSendPolicy } from "./send-policy-dVeTk31X.mjs";
import { n as resolveAgentTimeoutMs } from "./timeout-Q2p-0uCf.mjs";
import { n as createMessageInjectionAuthority } from "./message-injection-authority-CJuS3j6I.mjs";
import { M as resolveActiveReplyRunOwnerForSignal, _ as isReplyRunAbortableForSignal, q as REPLY_RUN_IDLE_SETTLE_TIMEOUT_MS } from "./reply-run-registry.state-DhKeZ1Xr.mjs";
import { D as beginReplyMessageInjectionTarget, O as finalizeReplyMessageInjectionAttempt, c as interruptReplyRunTarget, g as replyRunRegistry } from "./reply-run-registry.registry-C1J6phNB.mjs";
import { l as isAgentRunDirectAbortReason, o as createAgentRunRestartAbortError, p as resolveAgentRunAbortLifecycleFields, u as isAgentRunRestartAbortReason } from "./run-termination-DGv2EKii.mjs";
import { t as hasInboundAudio } from "./inbound-media-ddGEX7sF.mjs";
import { n as chatRunBelongsToSelectedAgent, r as resolveChatRunOwnerAgentId } from "./chat-run-owner-Ci8Mz1ow.mjs";
import "./reply-run-registry-Beow_31i.mjs";
import { a as logMessageReceived, r as logMessageProcessed } from "./diagnostic-BC19O2Si.mjs";
import { n as listActiveEmbeddedRunSessionIds } from "./active-run-projections-DHPboQzB.mjs";
import { t as finalizeInboundContext } from "./inbound-context-jAt0CAb-.mjs";
import { h as retireProviderReviewAcknowledgment, o as resolveSessionWorkStartError, p as readProviderReviewAcknowledgment } from "./lifecycle-DdaXH8bC.mjs";
import { r as parseInboundMediaUri } from "./inbound-media-uri-Bc4RWtcM.mjs";
import { a as resolveSendableOutboundReplyParts } from "./reply-payload-parts-BtASEhL4.mjs";
import "./reply-payload-DEDOYf-L.mjs";
import "./sessions-D_sxp1B4.mjs";
import "./media-reference-BIOMSmeS.mjs";
import { r as resolveTextCommand } from "./commands-registry-normalize-D_Y82wvp.mjs";
import "./commands-registry-DVONES7g.mjs";
import { n as readAgentRunTerminalOutcome } from "./agent-run-terminal-outcome-BOQC0T2X.mjs";
import { i as dispatchInboundMessageWithProjectedDispatcher } from "./dispatch-CQtqJkKC.mjs";
import { n as isPluginOwnedSessionBindingRecord } from "./conversation-binding-metadata-CFOhDjMh.mjs";
import { t as getSessionBindingService } from "./session-binding-service-DzGpg6K8.mjs";
import { a as emitInboundMessageAuditTerminal, r as emitMessageReceivedHooks, s as DispatchSessionRefreshRequiredError } from "./dispatch-from-config-DvC0Kv1M.mjs";
import { i as describeFailoverError } from "./failover-error-BZ8WG_0i.mjs";
import { n as resolveSessionEntryResetFreshness } from "./entry-freshness-CO_PCbH3.mjs";
import { o as isMainSessionRecoveryReconciliationCandidate } from "./main-session-recovery-state-B0ucS5xr.mjs";
import { n as runAgentHarnessBeforeMessageWriteHook } from "./hook-helpers-BXyGP6P6.mjs";
import "./agent-run-terminal-outcome-BTCs8JFs.mjs";
import { a as shouldComputeCommandAuthorized } from "./command-detection-M8GOVwRi.mjs";
import { t as isInternalSourceReplyChannel } from "./source-reply-delivery-mode-Cobau2H2.mjs";
import { t as createUserTurnTranscriptRecorder } from "./user-turn-transcript-BMox_Fvt.mjs";
import { t as boundedWorkerError } from "./worker-error-DmRBUSui.mjs";
import { t as resolveSessionWorkerPlacementContext } from "./session-worker-placement-context-98j7PlVT.mjs";
import { n as resolveSessionModelRef } from "./session-model-ref-xnA7gN4_.mjs";
import { n as appendChatCanvasBlocksToMessage, o as isToolHistoryBlockType } from "./chat-display-projection.canvas-DwEc-tyR.mjs";
import { r as isSuppressedControlReplyText } from "./control-reply-text-w0dVwMAz.mjs";
import { t as chatAbortMarkerTimestampMs } from "./server-chat-state-BP63MB41.mjs";
import { a as registerChatAbortController, l as updateChatRunProvider, r as isChatAbortControllerEntryAbortable, s as resolveChatRunExpiresAtMs } from "./chat-abort-DsJ_Zmkt.mjs";
import { c as resolveChatAbortDiagnosticReason, o as registerQueuedChatTurn, r as completeQueuedChatTurn, s as retireQueuedChatTurnCancellation } from "./chat-queued-turns-Dn_FgmH5.mjs";
import { h as readSessionTranscriptWatermarkAsync, i as readSessionMessageByIdAsync } from "./session-transcript-readers-Z-j3mApc.mjs";
import { a as resolveEnvelopeFormatOptions } from "./envelope-BjMhM0rf.mjs";
import { t as assertPreparedSkillLibrarySelection } from "./selection-Cr4O9thc.mjs";
import { t as SessionMutationAuthorizationChangedError } from "./session-mutation-authorization-error-CCz8QGWh.mjs";
import { n as isSyntheticGatewayCaller } from "./gateway-personal-caller-CPQUGI4q.mjs";
import { i as gatewayClientSessionCreator, o as resolveChatSendCallerContext, r as gatewayClientSenderFields } from "./gateway-client-identity-DnDs09-7.mjs";
import { o as resolveGatewaySessionStoreTarget } from "./session-utils-store-lookup-CuE1uM7x.mjs";
import { r as resolveGatewayModelSupportsImages } from "./session-utils-model-JtZ-2MzK.mjs";
import { c as hasPendingFollowupQueueWork } from "./state-Dcv8BBPd.mjs";
import { o as resolveAssistantIdentity } from "./assistant-avatar-CM_Vhve2.mjs";
import { c as resolveDeletedAgentIdFromSessionKey, r as loadGatewaySessionEntry } from "./session-utils-store-DrLraxiU.mjs";
import { t as ExpectedProfileMismatchError } from "./expected-profile-DP5LiA7Q.mjs";
import { t as resolveSessionMutationAuthorization } from "./session-sharing-50mq9oo9.mjs";
import { r as hasTrackedActiveSessionRun } from "./session-active-runs-D34IlGk3.mjs";
import { r as resolveStateContentionPresentation } from "./session-run-error-presentation-Mm1GMV0-.mjs";
import { t as recordGatewaySessionRunFailure } from "./session-run-error-CL5VRYOU.mjs";
import { o as transferGatewayLocalUserIngress } from "./local-user-ingress-Ct0iaaFP.mjs";
import { r as resolveInboundReplyToolAuthorityOverlay } from "./reply-tool-authority-DGgSwsqC.mjs";
import { t as resolveQueueSettings } from "./queue-DJQGr33w.mjs";
import { i as resolveRestartRecoverySteeringBlockReason } from "./restart-recovery-receipt-CKZ6ytog.mjs";
import { t as recordSessionCreated } from "./session-created-DzYS37GH.mjs";
import { i as maybeGenerateDashboardSessionTitle, r as isDashboardSessionTitleCandidate, t as buildDashboardSessionTitleSource } from "./dashboard-session-title-SwtjnjRg.mjs";
import { t as buildInboundMediaNoteProjection } from "./media-note-DYzuR7IB.mjs";
import { n as resolveWebchatPromptCacheKey } from "./session-boundary-prompt-cache-key-Qws1--Tf.mjs";
import "./session-utils-N4Q5NAko.mjs";
import { a as projectChatDisplayMessage } from "./chat-display-projection.core-BSNrSH5r.mjs";
import "./chat-display-projection-ZUh2mrnJ.mjs";
import { n as isAbortRequestText } from "./abort-primitives-DDVWBzUE.mjs";
import { n as buildInboundUserContextPrefix } from "./inbound-meta-DCQz4qcd.mjs";
import { t as recordAcceptedSessionParticipantInput } from "./session-participant-input-recording-CFS_mUtt.mjs";
import { n as isBtwRequestText } from "./btw-command-rBBsr_zN.mjs";
import { t as createChannelReplyPipeline } from "./reply-pipeline-DIQNa18H.mjs";
import { i as setGatewayDedupeEntry, t as captureAgentJobSession } from "./agent-job-BgXCyRm3.mjs";
import { n as resolveChatAttachmentMaxBytes } from "./chat-attachment-policy-BBDKPSK_.mjs";
import { t as formatForLog } from "./ws-log-Cxv8Uaao.mjs";
import { n as attachManagedOutgoingMediaToMessage } from "./managed-image-attachments-DbHPJZAc.mjs";
import { a as hasAssistantDisplayMediaContent, c as isMediaBearingPayload, d as stripManagedOutgoingAssistantContentBlocks, i as extractAssistantDisplayText, l as prepareAssistantDisplayText, o as hasManagedOutgoingAssistantContent, r as combineNonStreamingReplyParts, s as hasVisibleAssistantFinalMessage, u as sanitizeAssistantDisplayText } from "./chat-assistant-content-DIH8LIPH.mjs";
import { a as logAttachmentFailure, c as stripImageMediaMarkers, i as discardPreparedInboundMedia, n as MediaOffloadError, o as parseMessageWithAttachments, r as UnsupportedAttachmentError, s as persistInboundImagesForTranscript, t as INLINE_IMAGE_DURABLE_OMISSION_MARKER } from "./chat-attachments-C335Q8xj.mjs";
import { t as errorShapeFromError } from "./error-shape-Bqp-ECwX.mjs";
import { n as deriveGatewaySessionLifecycleSnapshot, r as persistGatewaySessionLifecycleEvent } from "./session-event-payload-COH4h1JU.mjs";
import { r as emitSessionsChanged } from "./session-change-event-CooG4AKR.mjs";
import { n as resolveOperatorSessionCreation } from "./session-creation-provenance-CZ3I7AOG.mjs";
import { a as prepareSessionWorkspace, d as prepareSkillLibrarySessionCreation, l as resolveGatewayInputParticipant, n as prepareGatewaySkillAuthoring, t as invalidateSkillAuthoringForOtherRequester, u as retainGatewayOperatorRun } from "./skill-library-authoring-05mWs_C4.mjs";
import { t as normalizeRpcAttachmentsToChatAttachments } from "./attachment-normalize-Bgzo6FoE.mjs";
import { n as createChatAbortOps } from "./chat-abort-ops-BfEknC6Y.mjs";
import { a as broadcastSideResult, i as broadcastChatTerminal, n as broadcastChatError, o as isBtwReplyPayload, r as broadcastChatFinal, s as isSourceReplyTranscriptMirrorPayload, t as broadcastChatDelta } from "./chat-broadcast-DFtZcstJ.mjs";
import { a as withAbortedPartialPersistenceWarning, n as abortedPartialPersistenceError } from "./chat-aborted-partial-CGL7cMIA.mjs";
import { a as captureGatewayClientUploadCommitGuard } from "./upload-policy-B7cW3IFl.mjs";
import { t as captureGatewayUiCommandTarget } from "./ui-command-target-BHjiDymC.mjs";
import { i as roundedChatSendTimingMs, n as emitOperatorChatSendServerTiming, r as resolveControlUiReconnectResumeParams, t as chatSendAckServerTimingAttributes } from "./chat-server-timing-CG6UCov7.mjs";
import { n as pendingChatSendDedupeKey, t as PENDING_CHAT_SEND_DEDUPE_PREFIX } from "./server-shared-C-7Ahu3n.mjs";
import { a as buildAbortedChatSendPayload, d as resolveChatAbortRequester, i as descendantAbortError, p as writePreRegisteredChatAbort, t as abortChatRunsForSessionKeyWithPartials, u as readPreRegisteredRun } from "./chat-abort-runtime-BC_FxZrY.mjs";
import { t as appendInjectedAssistantMessageToTranscript } from "./chat-transcript-inject-DM_DBukq.mjs";
import { a as publishAssistantTranscriptRewrite, c as rewriteSourceReplyTranscriptMirrors, o as rewriteAssistantTranscriptMessageByIdempotencyKey, s as rewriteAssistantTranscriptMessageByTurnIndexAndMedia, t as assistantTranscriptScope } from "./chat-transcript-persistence-glkdI6Fz.mjs";
import { a as readChatSendReplyPayload, i as withPreparedWebchatReplyMedia, n as captureWebchatReplyMediaScope, o as replaceChatSendReplyPayload, r as prepareWebchatReplyMediaForDisplay, s as selectChatSendFinalReplyInputs, t as createAssistantCommentaryMediaCustody } from "./chat-send-commentary-media-l3P9k7nZ.mjs";
import { a as resolveSessionNativeRuntimeRestriction } from "./sessions-patch-model-selection-BYp3FGzL.mjs";
import { n as fingerprintSessionGoalRequest, t as publishCommittedSessionGoalChange } from "./session-goal-change-D3pIa2VZ.mjs";
import path from "node:path";
import { isDeepStrictEqual } from "node:util";
import { createHmac, randomUUID } from "node:crypto";
import { performance } from "node:perf_hooks";
//#region src/config/sessions/goals-operations-read.ts
/** Durable ingress receipts precede transient dedupe and busy-session refusals. */
async function lookupSessionGoalOperation(options) {
	const captured = {
		...options,
		...options.storePath ? { storePath: path.resolve(options.storePath) } : {},
		operation: { ...options.operation },
		env: captureSessionTranscriptStorageEnvironment(options.env ?? process.env)
	};
	assertSessionGoalOperationTime(captured.operation, Date.now());
	if (isIncognitoSessionKey(captured.sessionKey)) {
		const target = resolveSqliteScope(captured);
		const result = withOpenClawAgentDatabaseReadOnly((database) => readSessionGoalOperationInDatabase(database, {
			...captured,
			sessionKey: target.sessionKey
		}), toDatabaseOptions(target));
		return result.found ? result.value : void 0;
	}
	const context = captureOpenClawStateWorkerContext({ env: captured.env });
	const assertCurrent = () => {
		context.maintenanceScope?.assertAdmission();
		context.admission.assertCurrent();
	};
	const target = await prepareSqliteScope(captured);
	assertCurrent();
	return withSessionHistoryWorkerDatabase(toDatabaseOptions(target), async (owner) => {
		const result = await owner.readGoalOperationReceipt({
			sessionKey: target.sessionKey,
			expectedSessionId: captured.expectedSessionId,
			operation: captured.operation,
			env: captured.env
		});
		assertCurrent();
		owner.assertCurrent();
		if ("error" in result) throw new SessionGoalOperationError(result.error.code, result.error.message);
		return result.receipt;
	});
}
//#endregion
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
			const { retryRestartAbortedMainSessionRecovery } = await import("./main-session-restart-recovery-DmlrrezG.mjs");
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
	if (findRestartRecoveryUnsafeChatAdmissionHook(resolveSessionDispatchKind(params.sessionKey, params.entry)) !== void 0 || listActiveEmbeddedRunSessionIds().includes(params.sessionId) || replyRunRegistry.isActive(params.activeRunScopeKey)) return true;
	for (const runs of [params.context.chatAbortControllers, params.context.chatQueuedTurns]) for (const active of runs?.values() ?? []) if ((active.sessionKey === params.sessionKey || active.sessionId === params.sessionId) && resolveChatRunOwnerAgentId({
		agentId: active.agentId,
		sessionKey: active.sessionKey,
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
					error: params.error,
					errorKind: params.errorKind
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
		error: params.error,
		errorKind: params.errorKind
	}).catch((error) => {
		log.warn(`Failed to record restart-safe chat failure notice: ${boundedWorkerError(error)}`);
	});
	return terminalized;
}
//#endregion
//#region src/gateway/server-methods/chat-send-background.ts
function scheduleChatDashboardSessionTitle(params, turn) {
	scheduleDashboardSessionTitle(params, "session", turn);
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
		storePath: created.storePath
	}, "gateway");
}
function scheduleDashboardSessionTitle(params, admissionScope, turn) {
	const titleSource = buildDashboardSessionTitleSource({
		message: params.request.rawMessage,
		attachments: params.request.normalizedAttachments
	});
	if (!isDashboardSessionTitleCandidate({
		sessionKey: params.sessionKey,
		userMessage: titleSource
	})) return;
	runWithGatewayIndependentRootWorkContinuation(async () => {
		const retryAfter = turn && await turn.released ? turn.settled : void 0;
		const generateTitle = async () => {
			if (await maybeGenerateDashboardSessionTitle({
				cfg: params.cfg,
				agentId: params.agentId,
				sessionId: params.admittedSessionId,
				sessionKey: params.sessionKey,
				storePath: params.storePath,
				currentUserMessage: params.request.rawMessage,
				userMessage: titleSource,
				...retryAfter ? { retryAfter } : {},
				onFallback: () => params.context.logGateway.warn("dashboard session title generation exhausted; using a crustacean fallback name")
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
//#region src/gateway/server-methods/chat-send-retry.ts
const ACCEPTED_CHAT_SEND_MAX_DISPATCH_ATTEMPTS = 3;
/** Classify an accepted-send failure without relying on unstable error text. */
function classifyAcceptedChatSendFailure(params) {
	if (params.executionStarted || params.sideEffectsObserved) return "reconcile";
	if (params.phase === "pre-ack" && params.error instanceof AgentDatabaseAdmissionError && createAgentDatabaseAdmissionErrorShape(params.error.refusal).retryable) return "client-retry";
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
	for (let attempt = 1;; attempt += 1) try {
		return await params.operation();
	} catch (error) {
		if (attempt >= ACCEPTED_CHAT_SEND_MAX_DISPATCH_ATTEMPTS || params.classify(error) !== "retry") throw error;
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
	return resolveStateContentionPresentation(error)?.errorMessage ?? renderAgentHarnessPreflightUserMessage(error) ?? renderFailoverCodeUserCopy(describeFailoverError(error).code) ?? String(error);
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
	const errorKind = resolveStateContentionPresentation(params.error)?.errorKind;
	const failureDisposition = classifyAcceptedChatSendFailure({
		error: params.error,
		phase: "pre-ack"
	});
	if (restartSafeAdmission) {
		if (await params.terminalizeRestartSafeAdmission({
			error: errorMessage,
			errorKind,
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
	const error = params.error instanceof SessionMutationAuthorizationChangedError ? params.error.error : params.error instanceof SessionGoalOperationError ? errorShape(ErrorCodes.INVALID_REQUEST, params.error.message, { details: {
		code: "GOAL_OPERATION_REJECTED",
		reason: params.error.code
	} }) : errorShapeFromError(ErrorCodes.UNAVAILABLE, params.error, {
		message: errorMessage,
		...failureDisposition === "client-retry" ? {
			retryable: true,
			retryAfterMs: 250
		} : {}
	});
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
		errorMessage,
		errorKind
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
		const errorKind = resolveStateContentionPresentation(err)?.errorKind;
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
				errorKind,
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
			errorKind,
			sessionId: activeRunAbort.entry?.sessionId ?? backingSessionId ?? clientRunId,
			startedAt: activeRunAbort.entry?.startedAtMs ?? now
		};
		if (!agentTerminalPersistenceOwnedAtDispatchReject || params.isReplyDispatchRun?.()) {
			const publish = () => {
				const error = errorShapeFromError(ErrorCodes.UNAVAILABLE, err, { message: errorMessage });
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
					errorMessage,
					errorKind
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
							error: dispatchError.error,
							errorKind: dispatchError.errorKind
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
function extractReplyTargetText(entry) {
	if (typeof entry.text === "string" && entry.text.trim()) return entry.text;
	if (typeof entry.content === "string" && entry.content.trim()) return entry.content;
	if (!Array.isArray(entry.content)) return;
	const parts = entry.content.map((block) => {
		const record = asOptionalRecord(block);
		return record && typeof record.text === "string" ? record.text : "";
	}).filter((text) => text.trim());
	return parts.length > 0 ? parts.join("\n") : void 0;
}
/** Copies hydrated reply fields onto the inbound context without clobbering unset keys. */
function applyChatSendReplyContextFields(ctx, fields) {
	for (const key of [
		"ReplyToId",
		"ReplyToBody",
		"ReplyToSender"
	]) if (fields[key] !== void 0) ctx[key] = fields[key];
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
		const displayMessage = projectChatDisplayMessage(resolved.message, { resolveCronJobName: () => void 0 });
		if (!displayMessage) return fields;
		const rawBody = extractReplyTargetText(displayMessage)?.trim();
		const body = rawBody && displayMessage.role === "assistant" ? sanitizeAssistantVisibleTextWithProfile(rawBody, "history").trim() : rawBody;
		if (!body) return fields;
		fields.ReplyToBody = truncateUtf16Safe(body, REPLY_CONTEXT_BODY_MAX_CHARS);
		fields.ReplyToSender = displayMessage.role === "assistant" ? (await resolveAssistantIdentity({
			cfg: params.cfg,
			agentId: params.agentId
		})).name : params.userSenderLabel?.trim() || "User";
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
			params.logGateway.warn("chat steering rejected; falling back to follow-up dispatch", {
				reason: "session-entry-unavailable",
				runId: clientRunId,
				activeRunId: params.target.runId,
				sessionKey,
				error: String(error)
			});
			return;
		}
		const activeSourceTurnId = normalizeOptionalString(params.target?.sourceTurnId) ?? normalizeOptionalString(fenceEntry?.restartRecoveryDeliverySourceRunId) ?? "";
		const blockReason = fenceEntry ? resolveRestartRecoverySteeringBlockReason(fenceEntry, fenceEntry.sessionId, activeSourceTurnId) : void 0;
		if (blockReason) {
			params.logGateway.warn("chat steering rejected; falling back to follow-up dispatch", {
				reason: blockReason,
				runId: clientRunId,
				activeRunId: params.target.runId,
				sourceTurnId: activeSourceTurnId || void 0,
				sourceTurnIdOrigin: params.target.sourceTurnId ? "active-run" : activeSourceTurnId ? "recovery-claim" : "unknown",
				sessionKey,
				sessionId: fenceEntry?.sessionId,
				sessionStatus: fenceEntry?.status,
				recoveryRunId: fenceEntry?.restartRecoveryDeliveryRunId,
				recoverySourceTurnId: fenceEntry?.restartRecoveryDeliverySourceRunId
			});
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
			currentInboundContext: p.replyToId ? void 0 : { text: buildInboundUserContextPrefix(ctx, resolveEnvelopeFormatOptions(cfg), entry) },
			assertCurrent,
			inboundAudio: hasInboundAudio(ctx),
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
	return { textSha256: sha256Hex(visibleText) };
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
	const commentaryMedia = createAssistantCommentaryMediaCustody({
		requesterContext: params.requesterContext,
		session,
		accountId,
		getRunId: () => agentRunId,
		isCurrent: () => isAgentRunStarted() && params.isRunCurrent?.() === true,
		abortSignal: params.abortSignal,
		logGateway,
		prepareAssistantTranscriptMessage: params.prepareAssistantTranscriptMessage
	});
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
		const watermark = await readSessionTranscriptWatermarkAsync(scope);
		if (!isCurrent()) return "missing";
		const input = readActiveTranscriptEntryAnchor(admission);
		if (!input || input.rawSeq !== admission.rawSeq) return "missing";
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
			const message = asOptionalRecord(stored.message);
			if (message?.role !== "assistant" || readSessionTranscriptRunId(message) !== runId) continue;
			const answer = message.stopReason === "toolUse" || Array.isArray(message.content) && message.content.some((block) => isToolHistoryBlockType(asOptionalRecord(block)?.type)) ? extractAssistantTextForPhase(message, { phase: "final_answer" }) : extractAssistantPhaseText(message);
			if (answer && !isSuppressedControlReplyText(answer) && extractAssistantPhaseText(projectChatDisplayMessage(message))) {
				const currentWatermark = await readSessionTranscriptWatermarkAsync(scope);
				if (!isCurrent() || !readActiveTranscriptEntryAnchor(admission)) return "missing";
				const currentInput = readActiveTranscriptEntryAnchor({
					...scope,
					entryId: latestInputId
				});
				if (!currentInput) return "missing";
				const anchor = readActiveTranscriptEntryAnchor({
					...scope,
					entryId: messageId
				});
				if (!anchor || anchor.rawSeq <= transcriptStart.afterSeq || anchor.activeMessagePosition <= currentInput.activeMessagePosition) continue;
				const rows = loadTranscriptEventRowsAfterSeqSync(scope, transcriptStart.afterSeq);
				for (const { event } of rows) {
					const row = asOptionalRecord(event);
					if (asOptionalRecord(row?.message)?.role !== "user" || typeof row?.id !== "string") continue;
					const newerInput = readActiveTranscriptEntryAnchor({
						...scope,
						entryId: row.id
					});
					if (newerInput && newerInput.activeMessagePosition > anchor.activeMessagePosition) return "missing";
				}
				if (currentWatermark.generation !== watermark.generation || currentWatermark.maxSeq !== watermark.maxSeq || anchor.generation !== currentWatermark.generation || rows.at(-1)?.seq !== currentWatermark.maxSeq) return "pending";
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
		const sourceMediaUrls = uniqueStrings(payloadMetadata?.assistantTranscriptMediaUrls?.length ? payloadMetadata.assistantTranscriptMediaUrls : [...Array.isArray(payload.mediaUrls) ? payload.mediaUrls : [], ...typeof payload.mediaUrl === "string" ? [payload.mediaUrl] : []]);
		const ownedTranscriptIdempotencyKey = transcript?.idempotencyKey ?? (payloadMetadata?.assistantTranscriptOwned === true ? payloadMetadata.assistantTranscriptIdempotencyKey?.trim() : void 0);
		const transcriptScope = assistantTranscriptScope({
			sessionKey,
			sessionId,
			storePath: latestStorePath,
			agentId
		});
		const assistantMessageIndex = payloadMetadata?.assistantMessageIndex;
		let rewritten = null;
		if (ownedTranscriptIdempotencyKey && transcriptScope) {
			if (transcript && loadGatewaySessionEntry(sessionKey, {
				...sessionLoadOptions,
				agentId
			}).entry?.sessionId !== transcript.sessionId) {
				logGateway.warn("webchat runtime-owned media skipped: transcript session changed");
				return;
			}
			rewritten = await rewriteAssistantTranscriptMessageByIdempotencyKey({
				content: persistedContentForAppend,
				idempotencyKey: ownedTranscriptIdempotencyKey,
				managedMediaUrls: sourceMediaUrls,
				scope: transcriptScope
			});
			if (!rewritten) {
				logGateway.warn("webchat runtime-owned assistant media rewrite skipped: transcript identity not found");
				return;
			}
		} else if (assistantMessageIndex !== void 0 && transcriptScope) {
			if (assistantTranscriptRewriteState.sessionId !== sessionId) assistantTranscriptRewriteState = {
				sessionId,
				generation: null,
				afterSeq: 0
			};
			const indexedRewrite = await rewriteAssistantTranscriptMessageByTurnIndexAndMedia({
				afterSeq: assistantTranscriptRewriteState.afterSeq,
				assistantMessageIndex,
				content: persistedContentForAppend,
				expectedGeneration: assistantTranscriptRewriteState.generation,
				mediaUrls: sourceMediaUrls,
				rejectedMediaCount: mediaFailures.filter((failure) => failure.code === "invalid-reference").length,
				scope: transcriptScope
			});
			if (indexedRewrite) {
				assistantTranscriptRewriteState.generation = indexedRewrite.generation;
				rewritten = indexedRewrite;
			}
		}
		if (rewritten && transcriptScope) {
			finalizedAgentMediaTranscriptKeys.add(finalizationKey);
			if (assistantContent?.length) await attachManagedOutgoingMediaToMessage({
				messageId: rewritten.messageId,
				blocks: assistantContent
			});
			await publishAssistantTranscriptRewrite({
				scope: transcriptScope,
				rewritten: [rewritten]
			});
			return;
		}
		const hasOnlyFailureDisplay = persistedContentForAppend.some((block) => block.type === "attachment_error") && persistedContentForAppend.every((block) => block.type === "text" || block.type === "attachment_error");
		const runtimeOwnedText = stripReplyMediaFailureFallback(transcriptPayload.text, mediaFailures)?.trim();
		if (assistantMessageIndex === void 0 && mediaNormalizationFailed && hasOnlyFailureDisplay && runtimeOwnedText) return;
		const isRuntimeMediaSupplement = assistantMessageIndex !== void 0 && assistantMessageIndex >= 1 && !mediaNormalizationFailed && !ttsSupplementMarker && !payload.isError && !isReplyPayloadStatusNotice(payload) && !payloadMetadata?.toolErrorWarning && !payloadMetadata?.nonTerminalToolErrorWarning && !payloadMetadata?.terminalProviderError;
		const appendContent = isRuntimeMediaSupplement ? persistedContentForAppend.filter((block) => block.type !== "text") : persistedContentForAppend;
		const appended = await appendInjectedAssistantMessageToTranscript({
			sessionKey,
			message: isRuntimeMediaSupplement ? "" : transcriptReply,
			content: appendContent,
			sessionId,
			storePath: latestStorePath,
			agentId,
			idempotencyKey: assistantMessageIndex !== void 0 && assistantMessageIndex >= 1 ? `${clientRunId}:assistant-media:${assistantMessageIndex}` : `${clientRunId}:assistant-media`,
			ttsSupplement: ttsSupplementMarker,
			config: cfg,
			onMessageCommitted: (receipt, acceptCompletion) => {
				const blocks = readAssistantDisplayContent(receipt.message);
				if (hasManagedOutgoingAssistantContent(blocks)) acceptCompletion(async () => {
					await attachManagedOutgoingMediaToMessage({
						messageId: receipt.messageId,
						blocks
					});
				});
			}
		});
		if (appended.ok) {
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
			try {
				return await commentaryMedia.run(operation);
			} finally {
				const commentaryRewrite = commentaryMedia.lastRewrite;
				if (commentaryRewrite && commentaryRewrite.sessionId === assistantTranscriptRewriteState.sessionId) assistantTranscriptRewriteState.generation = commentaryRewrite.generation;
				await finalizeAgentMediaTranscript();
			}
		});
	};
	return {
		captureAgentTranscriptStart,
		deliveredReplies,
		dispatcherOptions,
		hasAppendedWebchatAgentMedia: () => finalizedAgentMediaTranscriptKeys.size > 0,
		onModelSelected,
		prepareAssistantTranscriptMessage: commentaryMedia.prepareAssistantTranscriptMessage,
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
	const owners = payloads.map((payload) => getReplyPayloadMetadata(payload)?.sourceReplyTranscriptMirror);
	if (owners.every((owner) => owner?.expectedSessionId === void 0 && !owner?.transcriptWriteBlocked)) return { kind: "none" };
	const first = owners[0];
	if (!first) return { kind: "invalid" };
	const sessionKey = first.sessionKey.trim();
	const expectedSessionId = first.expectedSessionId?.trim();
	if (!sessionKey || !first.transcriptWriteBlocked && !expectedSessionId || owners.some((owner) => first.transcriptWriteBlocked && !owner?.transcriptWriteBlocked || owner?.sessionKey.trim() !== sessionKey || owner.expectedSessionId?.trim() !== expectedSessionId || owner.agentId !== first.agentId || !first.transcriptWriteBlocked && owner.transcriptWriteBlocked === true)) return { kind: "invalid" };
	return {
		kind: first.transcriptWriteBlocked ? "blocked" : "owner",
		owner: {
			sessionKey,
			...expectedSessionId ? { expectedSessionId } : {},
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
	const authorizeDelivery = (stage) => {
		if (deliveryAuthorized()) return true;
		context.logGateway.warn(`webchat settled final reply skipped: session writer changed before ${stage}`);
		broadcastChatFinal({
			context,
			runId: clientRunId,
			sessionKey,
			agentId
		});
		return false;
	};
	if (!authorizeDelivery("finalization")) return;
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
	if (!authorizeDelivery("transcript append")) return;
	if (shouldAppendAssistantTranscript) {
		const appended = await appendInjectedAssistantMessageToTranscript({
			sessionKey: transcriptSessionKey,
			message: transcriptReply,
			...persistedContentForAppend?.length ? { content: persistedContentForAppend } : {},
			sessionId,
			storePath: latestStorePath,
			agentId: transcriptAgentId,
			idempotencyKey: clientRunId,
			stopReason,
			ttsSupplement: ttsSupplementMarker,
			...contextFreeCommand ? { contextFreeCommand: true } : {},
			config: cfg,
			onMessageCommitted: (receipt, acceptCompletion) => {
				const blocks = readAssistantDisplayContent(receipt.message);
				if (hasManagedOutgoingAssistantContent(blocks)) acceptCompletion(async () => {
					await attachManagedOutgoingMediaToMessage({
						messageId: receipt.messageId,
						blocks
					});
				});
			}
		});
		if (appended.ok) message = broadcastAssistantContent?.length ? applyAssistantDeliveryDirectives({
			...appended.message,
			content: broadcastAssistantContent.map((block) => ({ ...block }))
		}) : appended.message;
		else {
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
	if (!authorizeDelivery("broadcast")) return;
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
	const authorizeDelivery = (stage) => {
		if (deliveryAuthorized()) return true;
		context.logGateway.warn(`webchat settled final reply skipped: session writer changed before ${stage}`);
		return false;
	};
	if (!authorizeDelivery("finalization")) return {
		kind: "dropped",
		reason: "no-visible-content"
	};
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
	const { finalInputsByIndex, sourceReplyContentStates, sourceReplyBroadcastContent } = await withPreparedWebchatReplyMedia({
		scope: mediaScope,
		storePath: latestStorePath,
		inputs: params.inputs,
		abortSignal: params.abortSignal,
		includeSensitiveMedia: false,
		onLocalAudioAccessDenied: (err) => {
			context.logGateway.warn(`webchat audio embedding denied local path: ${formatForLog(err)}`);
		},
		onManagedMediaPrepareError: (message) => {
			context.logGateway.warn(`webchat media embedding skipped attachment: ${message}`);
		}
	}, async ({ payloads: normalizedPayloads, inputsByIndex, buildContent }) => {
		const contentStates = [];
		const broadcastContent = [];
		for (const [replyIndex] of agentRunReplyPayloads.entries()) {
			if (!normalizedPayloads[replyIndex]) continue;
			const { assistantContent: replyAssistantContent, persistedAssistantContent: persistedContent, mediaMessage: replyMediaMessage } = await buildContent(inputsByIndex[replyIndex] ?? []);
			const replyBroadcastContent = hasAssistantDisplayMediaContent(replyAssistantContent) ? replyAssistantContent : hasAssistantDisplayMediaContent(replyMediaMessage?.content) ? replyMediaMessage?.content : replyAssistantContent;
			const state = {
				broadcastContent: replyBroadcastContent ? [...replyBroadcastContent] : [],
				persistedContent: persistedContent ? [...persistedContent] : [],
				hasManagedOutgoingContent: hasManagedOutgoingAssistantContent(persistedContent),
				backedManagedOutgoingContent: false
			};
			contentStates[replyIndex] = state;
			broadcastContent.push(...state.broadcastContent);
		}
		return {
			finalInputsByIndex: inputsByIndex,
			sourceReplyContentStates: contentStates,
			sourceReplyBroadcastContent: broadcastContent
		};
	});
	const displayReply = extractAssistantDisplayText(sourceReplyBroadcastContent) ?? buildTranscriptReplyTextFromInputs(finalInputsByIndex.flat());
	if (!sourceReplyBroadcastContent.length && !displayReply) return {
		kind: "dropped",
		reason: "no-visible-content"
	};
	const sourceReplyPersistenceRequests = [];
	const sourceReplyMirrorCandidates = [];
	for (const [replyIndex, sourceReplyPayload] of agentRunReplyPayloads.entries()) {
		const state = sourceReplyContentStates[replyIndex];
		if (!state) continue;
		const mirrorMetadata = getReplyPayloadMetadata(sourceReplyPayload)?.sourceReplyTranscriptMirror;
		const mirrorIdempotencyKey = mirrorMetadata?.idempotencyKey;
		if (typeof mirrorIdempotencyKey !== "string" || mirrorIdempotencyKey.trim().length === 0 || !mirrorMetadata) continue;
		const candidate = {
			idempotencyKey: mirrorIdempotencyKey,
			metadata: mirrorMetadata
		};
		sourceReplyMirrorCandidates.push(candidate);
		if (hasAssistantDisplayMediaContent(state.persistedContent)) {
			if (!state.hasManagedOutgoingContent) state.backedManagedOutgoingContent = true;
			sourceReplyPersistenceRequests.push({
				...candidate,
				state
			});
		}
	}
	const sourceReplyScope = assistantTranscriptScope({
		sessionId,
		sessionKey,
		storePath: latestStorePath,
		agentId
	});
	if (!authorizeDelivery("transcript finalization")) return {
		kind: "dropped",
		reason: "no-visible-content"
	};
	if (sourceReplyScope && sourceReplyPersistenceRequests.length > 0) {
		const rewritten = await rewriteSourceReplyTranscriptMirrors({
			candidates: sourceReplyMirrorCandidates,
			requests: sourceReplyPersistenceRequests,
			scope: sourceReplyScope
		});
		if (rewritten.length > 0) {
			for (const target of rewritten) {
				const state = target.request.state;
				if (state.hasManagedOutgoingContent) await attachManagedOutgoingMediaToMessage({
					messageId: target.messageId,
					blocks: state.persistedContent
				});
				state.backedManagedOutgoingContent = true;
			}
			await publishAssistantTranscriptRewrite({
				scope: sourceReplyScope,
				rewritten
			});
		}
	}
	const sourceReplyContent = sourceReplyContentStates.flatMap((state) => {
		if (state.hasManagedOutgoingContent && !state.backedManagedOutgoingContent) return stripManagedOutgoingAssistantContentBlocks(state.broadcastContent) ?? [{
			type: "text",
			text: "Media reply could not be displayed."
		}];
		return state.broadcastContent;
	});
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
		if (!authorizeDelivery("broadcast")) return {
			kind: "dropped",
			reason: "no-visible-content"
		};
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
		...params,
		inputs: selectChatSendAgentReplyInputs(params)
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
				if (terminal === "delivering" || terminal === "settled") throw new Error("Queued source reply no longer owns recovery delivery");
				if (terminal === "pending") terminal = "settled";
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
	let adoptionStarted = false;
	let withdrawalHold;
	let releaseWorkAdmission;
	const recordQueuedTerminal = (status) => {
		if (!params.suppressReplies && (status !== "aborted" || params.context.chatAbortControllers.has(params.runId))) return;
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
					endedAt: now,
					stopReason: resolveAgentRunAbortLifecycleFields(params.controller.signal).stopReason
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
		onAdopted: async () => {
			adoptionStarted = true;
			if (withdrawalHold) await withdrawalHold.promise;
			params.controller.signal.throwIfAborted();
		},
		onDeferred: () => {
			if (params.hasCronCreatorAuthority) lifecycle.cronCreatorAuthorityUnavailable = "queued-local-operator";
			enqueued = registerQueuedChatTurn({
				chatQueuedTurns: params.chatQueuedTurns,
				runId: params.runId,
				controller: params.controller,
				sessionId: params.sessionBinding.sessionId,
				sessionKey: params.sessionKey,
				agentId: params.agentId,
				ownerConnId: normalizeOptionalString(params.ownerConnId),
				ownerDeviceId: normalizeOptionalString(params.ownerDeviceId),
				holdPendingInputWithdrawal: () => {
					if (adoptionStarted || withdrawalHold || params.controller.signal.aborted) return;
					const hold = createDeferredCore();
					withdrawalHold = hold;
					return () => {
						if (withdrawalHold === hold) withdrawalHold = void 0;
						hold.resolve();
					};
				},
				onAborted: (reason) => {
					params.sessionBinding.abortDiagnosticReason = reason;
					recordQueuedTerminal("aborted");
					params.releaseSourceWorkAdmission();
					releaseWorkAdmission?.();
					releaseWorkAdmission = void 0;
				}
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
				if (completed) recordQueuedTerminal("completed");
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
//#region src/gateway/chat-input-sanitize.ts
const DISALLOWED_CHAT_CONTROL_RANGE = `${String.fromCharCode(0)}-${String.fromCharCode(8)}${String.fromCharCode(11)}${String.fromCharCode(12)}${String.fromCharCode(14)}-${String.fromCharCode(31)}${String.fromCharCode(127)}`;
const DISALLOWED_CHAT_CONTROL_RE = new RegExp(`[${DISALLOWED_CHAT_CONTROL_RANGE}]`, "g");
/** Normalize chat text and reject null bytes before routing to channels. */
function sanitizeChatSendMessageInput(message) {
	const normalized = message.normalize("NFC");
	if (normalized.includes("\0")) return {
		ok: false,
		error: "message must not contain null bytes"
	};
	return {
		ok: true,
		message: normalized.replace(DISALLOWED_CHAT_CONTROL_RE, "")
	};
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
	const originatingChannel = normalizeOptionalString(params.originatingChannel);
	const originatingTo = normalizeOptionalString(params.originatingTo);
	const accountId = normalizeOptionalString(params.accountId);
	const messageThreadId = normalizeOptionalString(params.messageThreadId);
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
function resolveExplicitOriginBinding(origin) {
	if (!origin?.originatingChannel || !origin.originatingTo || !origin.accountId) return;
	const channel = normalizeMessageChannel(origin.originatingChannel);
	if (!channel || channel === "webchat") return;
	return getSessionBindingService().resolveByConversation({
		channel,
		accountId: origin.accountId,
		conversationId: origin.originatingTo
	});
}
function explicitOriginTargetsAcpSession(origin) {
	return isAcpSessionKey(resolveExplicitOriginBinding(origin)?.targetSessionKey);
}
function explicitOriginTargetsPluginBinding(origin) {
	return isPluginOwnedSessionBindingRecord(resolveExplicitOriginBinding(origin));
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
		logContext: "chat.send",
		assertCurrent: params.assertCurrent
	});
}
function resolveChatSendManagedMedia(entries, suppressInlineHydration = false) {
	return entries.map((entry) => ({
		path: entry.path,
		contentType: entry.fact.contentType ?? "application/octet-stream",
		...entry.fact.fileName ? { fileName: entry.fact.fileName } : {},
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
async function prepareChatSendUserTurn(params) {
	const { request, session, admission, attachments, client, logGateway, userTurn } = params;
	const persistedMediaForTranscriptPromise = persistChatSendImages({
		images: attachments.parsedImages,
		offloadedRefs: attachments.offloadedRefs,
		client,
		logGateway,
		assertCurrent: () => {
			admission.assertWorkAdmissionCurrent?.();
			admission.assertClientUploadAllowed?.();
		}
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
	const queuedFollowupOwnerDeviceId = normalizeOptionalString(client?.connect?.device?.id);
	const queuedFollowupOwnerConnId = normalizeOptionalString(client?.connId);
	const gatewayUiCommandTarget = captureGatewayUiCommandTarget(client);
	const queuedFollowupOwnerKey = queuedFollowupOwnerDeviceId ? `device:${queuedFollowupOwnerDeviceId}` : queuedFollowupOwnerConnId ? `connection:${queuedFollowupOwnerConnId}` : void 0;
	const { originatingChannel, originatingTo, accountId, messageThreadId, explicitDeliverRoute } = admission.originatingRoute;
	const creation = request.systemInputProvenance ? resolveOperatorSessionCreation(client) : await prepareSkillLibrarySessionCreation(client, params.getConfig ?? session.cfg ?? {}, resolveOperatorSessionCreation(client));
	admission.assertWorkAdmissionCurrent?.();
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
	const requester = client?.authenticatedUserProfile;
	if (requester && (client.authenticatedUserId || client.internal?.authenticatedOperator) && isBrowserOperatorUiClient(request.clientInfo) && !isSyntheticGatewayCaller(client) && (!request.systemInputProvenance || request.systemInputProvenance.kind === "external_user")) {
		const authenticatedUserId = client.authenticatedUserId;
		const { profileId, displayName } = requester;
		bindRequesterProfile(ctx, {
			id: profileId,
			displayName,
			isCurrent: () => {
				try {
					admission.assertWorkAdmissionCurrent?.();
				} catch {
					return false;
				}
				return !client.invalidated && !client.connectionSignal?.aborted && !isSyntheticGatewayCaller(client) && Boolean(client.authenticatedUserId || client.internal?.authenticatedOperator) && client.authenticatedUserId === authenticatedUserId && client.authenticatedUserProfile?.profileId === profileId;
			}
		});
	}
	if (client) transferGatewayLocalUserIngress(client, ctx);
	if (attachments.mediaPathOffloads.length > 0) ctx.media = attachments.mediaPathOffloads;
	const mediaPathOffloadsIncludeImages = attachments.mediaPathOffloads.some((fact) => fact.contentType?.startsWith("image/"));
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
	const titleReady = createDeferredCore();
	const turnSettled = createDeferredCore();
	let titleWaiting = true;
	let stopTitleWait;
	const releaseTitle = (duringTurn) => {
		stopTitleWait?.();
		stopTitleWait = void 0;
		titleWaiting = false;
		titleReady.resolve(duringTurn);
	};
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
		releaseSourceWorkAdmission: admission.releaseSourceWorkAdmission,
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
						if (titleWaiting) {
							stopTitleWait?.();
							stopTitleWait = onAgentEventForRun(runId, (event) => {
								if (event.stream === "assistant" || event.stream === "item" || event.stream === "tool" || event.stream === "thinking" || event.stream === "approval") releaseTitle(true);
							});
						}
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
			releaseTitle(false);
			turnSettled.resolve();
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
		storePath
	}, {
		released: titleReady.promise,
		settled: turnSettled.promise
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
	if (mediaPathRefs.length === 0) return [];
	try {
		const [{ ensureSandboxWorkspaceForSession }, { SANDBOX_MEDIA_MAX_BYTES, stageSandboxMedia }] = await Promise.all([import("./context-CLGj5xC0.mjs"), import("./stage-sandbox-media-DDUzwjTS.mjs")]);
		params.abortSignal.throwIfAborted();
		params.assertWorkAdmissionCurrent();
		const refsByManagedPath = (refs) => refs.map((ref) => ({
			path: ref.path,
			contentType: ref.mimeType,
			fileName: ref.label,
			workspaceDir: path.dirname(ref.path)
		}));
		const refsToStage = mediaPathRefs.filter((ref) => !(ref.sizeBytes > SANDBOX_MEDIA_MAX_BYTES && isManagedInboundPdfOffloadRef(ref)));
		if (refsToStage.length === 0) return refsByManagedPath(mediaPathRefs);
		const workspaceDir = resolveAgentWorkspaceDir(params.cfg, params.agentId);
		if (getAgentWorkspaceAccess(workspaceDir, "prepareTurnAttachments")?.prepareTurnAttachments) return refsByManagedPath(mediaPathRefs);
		const skillsSnapshot = params.skillLibrarySelections?.length ? (await (await import("./session-snapshot-C0ABcLpx.mjs")).resolveReusableWorkspaceSkillSnapshot({
			workspaceDir,
			config: params.cfg,
			agentId: params.agentId,
			existingSnapshot: params.existingSkillsSnapshot,
			librarySelections: params.skillLibrarySelections,
			assertCurrent: params.assertWorkAdmissionCurrent
		})).snapshot : void 0;
		params.abortSignal.throwIfAborted();
		params.assertWorkAdmissionCurrent();
		const sandbox = await ensureSandboxWorkspaceForSession({
			config: params.cfg,
			agentId: params.agentId,
			sessionKey: params.sessionKey,
			workspaceDir,
			skillsSnapshot
		});
		params.assertWorkAdmissionCurrent();
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
				skillsSnapshot,
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
		return mediaPathRefs.map((ref) => {
			const resolved = resolvedByRef.get(ref) ?? {
				path: ref.path,
				mimeType: ref.mimeType
			};
			return {
				path: resolved.path,
				url: ref.mediaRef,
				contentType: resolved.mimeType,
				fileName: ref.label,
				workspaceDir: sandbox.workspaceDir
			};
		});
	} catch (err) {
		if (params.abortSignal.aborted && Object.is(err, params.abortSignal.reason) || err instanceof SessionMutationAuthorizationChangedError || err instanceof MediaOffloadError || err instanceof UnsupportedAttachmentError) throw err;
		throw new MediaOffloadError(`[Gateway Error] Failed to stage attachments into agent workspace: ${formatErrorMessage(err)}`, { cause: err });
	}
}
/** Parse and pre-stage attachments before the caller's synchronous pre-ACK checks. */
async function prepareChatSendAttachments(params) {
	const { request, session, admission, respond, context, client } = params;
	const { inboundMessage, normalizedAttachments, explicitOrigin } = request;
	const { cfg, sessionKey, agentId, resolvedSessionModel, clientRunId } = session;
	const { activeRunAbort, chatSendTraceAttributes, cleanupAdmittedRun, finishAbortedChatSend, lifecycleGeneration } = admission;
	const assertInputCurrent = () => {
		activeRunAbort.controller.signal.throwIfAborted();
		admission.assertWorkAdmissionCurrent();
		admission.assertClientUploadAllowed?.();
	};
	let parsedMessage = inboundMessage;
	let parsedImages = [];
	let imageOrder = [];
	let offloadedRefs = [];
	let mediaPathOffloads = [];
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
					acceptNonImage: true,
					signal: activeRunAbort.controller.signal,
					assertCurrent: assertInputCurrent
				});
				const parsedSupportsImages = imageSupport.value !== false;
				parsedMessage = parsedSupportsImages ? parsed.message : stripImageMediaMarkers(parsed.message, parsed.offloadedRefs);
				parsedImages = parsed.images;
				imageOrder = parsed.imageOrder;
				offloadedRefs = parsed.offloadedRefs;
				const stagingEntry = admission.initialSessionEntry ?? admission.admittedSessionEntry ?? session.entry;
				const selectedSkills = stagingEntry ? stagingEntry.skillLibrarySelections ?? stagingEntry.skillsSnapshot?.librarySelections : request.systemInputProvenance ? void 0 : (await prepareSkillLibrarySessionCreation(client, context.getRuntimeConfig ?? cfg, resolveOperatorSessionCreation(client))).skillLibrarySelections;
				mediaPathOffloads = await prestageMediaPathOffloads({
					offloadedRefs,
					includeImageRefs: !parsedSupportsImages,
					cfg,
					sessionKey,
					agentId,
					skillLibrarySelections: selectedSkills,
					existingSkillsSnapshot: stagingEntry?.skillsSnapshot,
					abortSignal: activeRunAbort.controller.signal,
					assertWorkAdmissionCurrent: assertInputCurrent
				});
			}, {
				phase: "agent-turn",
				config: cfg,
				attributes: {
					...chatSendTraceAttributes,
					attachmentCount: normalizedAttachments.length
				}
			});
			assertInputCurrent();
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
			respond(false, void 0, err instanceof SessionMutationAuthorizationChangedError ? err.error : errorShape(err instanceof MediaOffloadError ? ErrorCodes.UNAVAILABLE : ErrorCodes.INVALID_REQUEST, String(err)));
			return { ok: false };
		}
	}
	return {
		ok: true,
		value: {
			explicitOriginTargetsPlugin,
			imageOrder,
			mediaPathOffloads,
			offloadedRefs,
			parsedImages,
			parsedMessage,
			prepareAttachmentsMs
		}
	};
}
/** Preparation owns cleanup until a transcript or pending input takes custody of its media. */
function bindChatSendPreparedMediaCustody(params) {
	let recorder;
	params.admission.setDiscardAbandonedPreparedMedia(() => {
		if (!recorder?.hasPersisted() && !recorder?.getPendingInputMessage?.()) discardPreparedInboundMedia(params.attachments.offloadedRefs);
	});
	return (inputRecorder) => {
		recorder = inputRecorder;
	};
}
//#endregion
//#region src/gateway/server-methods/chat-send-active-leaf.ts
const ACTIVE_LEAF_CHANGED_ERROR_REASON = "active-leaf-changed";
function assertExpectedLeafActive(session, agentId, expectedLeafEntryId, requestedSessionId, options) {
	const activePathRelation = session.entry?.sessionId ? readSessionTranscriptActivePathEntryRelation({
		agentId,
		sessionId: session.entry.sessionId,
		sessionKey: session.canonicalKey,
		sessionEntry: session.entry,
		storePath: session.storePath
	}, expectedLeafEntryId) : expectedLeafEntryId === null ? "exact" : "off-path";
	const matchesRequestedSession = requestedSessionId === void 0 || requestedSessionId === session.entry?.sessionId;
	const matchesActivePath = activePathRelation === "exact" || requestedSessionId !== void 0 && (activePathRelation === "ancestor" || options?.allowEmptyAncestor === true && expectedLeafEntryId === null);
	if (!matchesRequestedSession || !matchesActivePath) throw new Error(ACTIVE_LEAF_CHANGED_ERROR_REASON);
}
//#endregion
//#region src/gateway/server-methods/chat-send-goal-retry.ts
async function prepareGoalChatSendRetry({ request, session, context }) {
	if (!request.goalOperation) return;
	const dedupe = context.dedupe.get(`chat:${session.clientRunId}`);
	try {
		return {
			receipt: await lookupSessionGoalOperation({
				sessionKey: session.sessionKey,
				storePath: session.storePath,
				agentId: session.agentId,
				expectedSessionId: session.entry?.sessionId ?? session.backingSessionId ?? session.clientRunId,
				operation: request.goalOperation
			}),
			dedupe
		};
	} catch (error) {
		if (!(error instanceof SessionGoalOperationError)) throw error;
		return {
			receipt: error,
			dedupe
		};
	}
}
//#endregion
//#region src/gateway/server-methods/chat-send-retry-comparison.ts
/** Submitted bytes compare input; the caller's current owner still decides replay. */
function readChatSendRetryComparison(session, assertCurrent) {
	if (!session.entry?.sessionId) return;
	const { agentId, storePath, sessionKey, clientRunId } = session;
	const { sessionId, lifecycleRevision } = session.entry;
	return readSessionSubmittedInput({
		agentId,
		storePath,
		sessionKey,
		sessionId
	}, `${clientRunId}:user`).then((submitted) => {
		assertCurrent?.();
		return {
			agentId,
			storePath,
			sessionKey,
			sessionId,
			lifecycleRevision,
			clientRunId,
			submitted
		};
	});
}
function compareChatSendSubmittedInput(request, session, comparison) {
	if (!comparison && session.entry?.sessionId || comparison && (comparison.agentId !== session.agentId || comparison.storePath !== session.storePath || comparison.sessionKey !== session.sessionKey || comparison.sessionId !== session.entry?.sessionId || comparison.lifecycleRevision !== session.entry?.lifecycleRevision || comparison.clientRunId !== session.clientRunId)) throw new SessionTranscriptProjectionUnavailableError(session.entry?.sessionId ?? comparison?.sessionId ?? session.clientRunId, "window-changed");
	const submitted = comparison?.submitted;
	if (!submitted) return request.mentions?.length || request.workContext ? "unverifiable" : false;
	const storedMentions = submitted["__openclaw"]?.humanMentions;
	const storedContext = submitted["__openclaw"]?.workContext;
	if (!request.mentions?.length && !storedMentions?.length && !request.workContext && !storedContext) return false;
	return (extractTextFromChatContent(submitted.content, {
		joinWith: "\n",
		normalizeText: (text) => text
	}) ?? "") !== request.rawMessage || !isDeepStrictEqual(storedMentions ?? [], request.mentions ?? []) || !isDeepStrictEqual(storedContext, request.workContext);
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
//#region src/gateway/server-methods/chat-send-pre-admission.ts
function respondChatSessionRoutingChanged(respond) {
	respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "session routing changed; review and retry", { details: { reason: SESSION_ROUTING_CHANGED_ERROR_REASON } }));
}
function respondChatSendAdmissionError(error, respond) {
	const reason = error instanceof Error ? error.message : void 0;
	if (reason === "goal-session-busy") {
		respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, "This session still has active or queued work. Wait for it to finish, then retry the Goal.", {
			retryable: true,
			details: { reason: "goal-session-busy" }
		}));
		return;
	}
	if (reason === "session-routing-changed") {
		respondChatSessionRoutingChanged(respond);
		return;
	}
	if (reason === "active-leaf-changed" || reason === "session-settings-changed") {
		respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, reason === "active-leaf-changed" ? "active branch changed; review and retry" : "Session settings changed before send. Retry.", { details: { reason } }));
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
	respond(false, void 0, errorShapeFromError(ErrorCodes.INVALID_REQUEST, error, { message: formatForLog(error) }));
}
/** A retained request identity is not an ACK; only response-bearing rows may replay. */
function readChatSendDedupeResponse(dedupe, runId) {
	const entry = dedupe.get(`chat:${runId}`);
	return entry?.requestIdentity && entry.ok && entry.payload === void 0 && entry.error === void 0 ? void 0 : entry;
}
function resolveChatSendRequestConflict({ request, session, context }, comparison, ownPendingAttemptId) {
	if (request.goalOperation) return;
	const entries = [context.dedupe.get(`chat:${session.clientRunId}`), context.dedupe.get(session.pendingChatSendKey)];
	const conflict = (unverifiable = false) => errorShape(ErrorCodes.INVALID_REQUEST, unverifiable ? "The previous mention selections cannot be verified. Check the conversation history and use a new message ID to send again." : "This message ID was already used for different input. Check the conversation history and use a new message ID to send again.", { details: { reason: "chat-request-conflict" } });
	if (entries.some((entry) => entry?.requestIdentity !== void 0 && entry.requestIdentity !== request.requestIdentity)) return conflict();
	const sameDurableSource = session.entry?.restartRecoveryDeliverySourceRunId === session.clientRunId;
	const storedFingerprint = sameDurableSource ? session.entry?.restartRecoveryDeliveryRequestFingerprint : void 0;
	if (storedFingerprint !== void 0) return storedFingerprint === session.restartSafeRequest?.fingerprint ? void 0 : conflict();
	if (sameDurableSource && (request.mentions?.length || request.workContext) && !session.restartSafeRequest) return conflict(true);
	const retryEntries = ownPendingAttemptId !== void 0 && readPreRegisteredRun({
		key: session.pendingChatSendKey,
		entry: entries[1],
		keyPrefix: "pending-chat:"
	})?.payload.attemptId === ownPendingAttemptId ? entries.slice(0, 1) : entries;
	if (!comparison && retryEntries.some((entry) => entry?.requestIdentity === request.requestIdentity)) return;
	if (!(retryEntries.some(Boolean) || sameDurableSource || hasRestartRecoveryTerminalRun(session.entry, session.clientRunId) || context.chatRunState.hasAbortMarker(session.clientRunId) || context.chatAbortControllers.has(session.clientRunId) || context.chatQueuedTurns?.has(session.clientRunId))) return;
	const mismatch = compareChatSendSubmittedInput(request, session, comparison);
	return mismatch ? conflict(mismatch === "unverifiable") : void 0;
}
function prepareChatSendRetryComparison(params, ownPendingAttemptId) {
	try {
		resolveChatSendRequestConflict(params, void 0, ownPendingAttemptId);
		return;
	} catch (error) {
		if (!isSessionTranscriptProjectionUnavailableError(error)) throw error;
		return readChatSendRetryComparison(params.session, params.assertCurrent);
	}
}
async function respondPreparedChatSendRetry(params) {
	try {
		return respondChatSendRetry(params, await prepareChatSendRetryComparison(params));
	} catch (error) {
		if (!isSessionTranscriptProjectionUnavailableError(error)) throw error;
		respondChatSendAdmissionError(error, params.respond);
		return true;
	}
}
/** Consume prepared comparison and current RAM ownership without yielding before reservation. */
function respondChatSendRetry(params, comparison) {
	params.assertCurrent?.();
	const { session, context, respond } = params;
	const { clientRunId, pendingChatSendKey } = session;
	const conflict = resolveChatSendRequestConflict(params, comparison);
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
/** Consume prepared receipts and current RAM ownership without yielding before reservation. */
function inspectGoalChatSendRetry({ request, session, respond, context, durableClaimAccepted, assertCurrent, prepared }) {
	assertCurrent?.();
	const { clientRunId, pendingChatSendKey } = session;
	if (!request.goalOperation) return { kind: "new" };
	try {
		const receipt = prepared?.receipt;
		if (receipt instanceof SessionGoalOperationError) throw receipt;
		if (receipt) return {
			kind: "replay",
			receipt
		};
		const pending = readPreRegisteredRun({
			key: pendingChatSendKey,
			entry: context.dedupe.get(pendingChatSendKey),
			keyPrefix: PENDING_CHAT_SEND_DEDUPE_PREFIX
		});
		const retainedIdentity = context.dedupe.get(`chat:${clientRunId}`)?.requestIdentity;
		const identityConflict = retainedIdentity !== void 0 && retainedIdentity !== request.goalOperation.requestFingerprint;
		const cachedResponse = readChatSendDedupeResponse(context.dedupe, clientRunId);
		const newlyPublishedResponse = retainedIdentity === request.goalOperation.requestFingerprint && cachedResponse !== void 0 && cachedResponse !== prepared?.dedupe;
		if (!identityConflict && (pending?.payload.goalFingerprint === request.goalOperation.requestFingerprint || newlyPublishedResponse || !pending && !durableClaimAccepted && context.chatAbortControllers.has(clientRunId))) {
			respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, "Goal is being admitted; retry the same request.", { retryable: true }));
			return { kind: "settled" };
		}
		if (identityConflict || pending || durableClaimAccepted || cachedResponse || context.chatRunState.hasAbortMarker(clientRunId) || context.chatAbortControllers.has(clientRunId) || context.chatQueuedTurns?.has(clientRunId)) throw new SessionGoalOperationError("operation-conflict", "Goal operation ID is already used by another request.");
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
		const retry = inspectGoalChatSendRetry({
			...params,
			prepared: await prepareGoalChatSendRetry(params)
		});
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
				agentId: selectedAgent.agentId,
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
				defaultAgentId: tryResolveSessionCompatibilityOwnerAgentId(cfg, sessionKey),
				abortOrigin: "stop-command",
				stopReason: "stop",
				requester: resolveChatAbortRequester(client),
				assertCurrent,
				cascadeDescendants: true
			});
			if (guard.failure) throw abortedPartialPersistenceError(guard.failure.error, res.warning);
		} catch (error) {
			const admissionError = guard.failure ? guard.failure.error : error;
			if (admissionError instanceof SessionMutationAuthorizationChangedError) throw error instanceof SessionMutationAuthorizationChangedError ? error : admissionError;
			respondChatSendAdmissionError(admissionError, (ok, payload, failure) => {
				respond(ok, payload, failure && error instanceof Error && error.cause === admissionError ? {
					...failure,
					message: error.message
				} : failure);
			});
			return false;
		}
		const error = res.unauthorized ? errorShape(ErrorCodes.INVALID_REQUEST, "unauthorized") : res.error ?? descendantAbortError(res.descendants, "Session");
		if (error) {
			respond(false, void 0, withAbortedPartialPersistenceWarning(error, res.warning));
			return false;
		}
		respond(true, {
			ok: true,
			aborted: res.aborted,
			runIds: res.runIds,
			...res.warning ? { warning: res.warning } : {}
		});
		return false;
	}
	if (await respondPreparedChatSendRetry(params)) return false;
	let durableEntry = entry;
	if (entry && isMainSessionRecoveryReconciliationCandidate(entry)) {
		const { reconcileOrphanedGatewaySessionRecovery } = await import("./session-recovery-service-BVxGs54y.mjs");
		try {
			const recoveryEntry = loadGatewaySessionEntry(sessionLoadKey, sessionLoadOptions).entry;
			if (recoveryEntry) {
				const comparison = await prepareChatSendRetryComparison({
					...params,
					session: {
						...session,
						entry: recoveryEntry
					}
				});
				await reconcileOrphanedGatewaySessionRecovery({
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
						}, comparison);
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
			}
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
	if (await respondPreparedChatSendRetry({
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
				durableClaimAccepted: true,
				prepared: await prepareGoalChatSendRetry(params)
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
//#region src/gateway/server-methods/chat-send-session-binding.ts
function bindChatSendPreparedSession(params) {
	const { sessionBinding } = params;
	return (binding) => {
		if (binding.sessionKey !== params.sessionKey) return;
		if (params.chatAbortControllers.get(params.clientRunId) !== sessionBinding || params.lifecycleGeneration !== getAgentEventLifecycleGeneration() || !params.admission.isActive() || !isChatAbortControllerEntryAbortable(sessionBinding) || sessionBinding.registrationCleanupRequested || sessionBinding.projectSessionActive === false && !params.progressRefresh || sessionBinding.projectSessionTerminalPending || sessionBinding.projectSessionTerminalPersisted) throw createAbortError("chat session preparation no longer owns its admission");
		sessionBinding.sessionId = binding.sessionId;
	};
}
//#endregion
//#region src/gateway/server-methods/chat-send-session.ts
async function prepareChatSendSessionEntry(params) {
	const { cfg, client, agentId, getRuntimeConfig } = params;
	const creationError = authorizeGatewaySessionCreation({
		cfg,
		client,
		agentId
	});
	if (creationError) throw new Error(creationError.message);
	const creation = await prepareSkillLibrarySessionCreation(client, getRuntimeConfig, resolveOperatorSessionCreation(client));
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
/** Load and validate the session/model facts shared by later admission and dispatch phases. */
function prepareChatSendSession(params) {
	const { request, context, client } = params;
	const { p, explicitOrigin, normalizedAttachments, turnKind, rawMessage } = request;
	const rawSessionKey = p.sessionKey;
	if (!rawSessionKey.trim()) return {
		ok: false,
		error: "sessionKey must not be blank"
	};
	const agentIdOverride = normalizeOptionalString(p.agentId);
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
	const expectedSessionRoutingContract = normalizeOptionalString(p.expectedSessionRoutingContract);
	const expectedLeafEntryId = p.expectedLeafEntryId === null ? null : normalizeOptionalString(p.expectedLeafEntryId);
	const sessionRoutingChanged = (candidateConfig) => expectedSessionRoutingContract !== void 0 && expectedSessionRoutingContract.toLowerCase() !== resolveSessionRoutingContract(candidateConfig);
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
	const requestedSessionId = normalizeOptionalString(p.sessionId);
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
			...sessionLoadResult.capturedReadSource ? { capturedReadSource: sessionLoadResult.capturedReadSource } : {},
			...sessionLoadResult.capturedReadSources ? { capturedReadSources: sessionLoadResult.capturedReadSources } : {},
			entry,
			sessionKey,
			legacyKey,
			sessionRoutingChanged,
			expectedLeafEntryId,
			agentIdOverride,
			requestedAgentId,
			requestedSessionId,
			backingSessionId,
			resolvedSessionModel,
			resolvedSessionAuthProvider,
			timeoutMs,
			now,
			restartSafeRequest
		}
	};
}
function qualifyChatSendSession(loaded) {
	const qualified = prepareQualifiedSessionEntryTarget({
		...loaded,
		canonicalKey: loaded.sessionKey,
		requestedKey: loaded.sessionLoadKey,
		storeKey: loaded.legacyKey ?? loaded.sessionKey,
		readSource: loaded.capturedReadSource
	}, loaded.capturedReadSources);
	return {
		...loaded,
		sessionTarget: qualified.target,
		assertSessionTargetCurrent: qualified.assertCurrent,
		releaseSessionTarget: qualified.release,
		activeRunScopeKey: qualified.target.canonicalKey,
		readSource: qualified.target.readSource
	};
}
/** Admission reloads once, retaining the original physical choice and logical identity. */
function loadCurrentChatSendSession(session) {
	const latest = loadGatewaySessionEntry(session.sessionLoadKey, {
		...session.sessionLoadOptions,
		clone: false
	});
	if (session.sessionRoutingChanged(latest.cfg)) throw new Error(SESSION_ROUTING_CHANGED_ERROR_REASON);
	if (latest.agentId !== session.sessionTarget.agentId || (latest.legacyKey ?? latest.canonicalKey) !== session.sessionTarget.storeKey || !isDeepStrictEqual(latest.capturedReadSource, session.sessionTarget.readSource) || !isDeepStrictEqual(latest.capturedReadSources, session.capturedReadSources)) throw new Error("Session storage changed while starting work. Retry.");
	session.assertSessionTargetCurrent();
	return latest;
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
	const [{ loadReplySessionInitializationSnapshot, commitReplySessionInitialization }, { recordSessionCreated }] = await Promise.all([import("./session-accessor.reset-DRwXE8Vv.mjs"), import("./session-created-D7T2jn2n.mjs")]);
	params.assertCurrent?.();
	const scope = {
		agentId,
		sessionKey,
		storePath: session.storePath
	};
	const snapshot = loadReplySessionInitializationSnapshot(scope);
	if (snapshot.currentEntry) return errorShape(ErrorCodes.INVALID_REQUEST, "Session changed before native confirmation. Retry.");
	const prepared = await prepareChatSendSessionEntry({
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
			session.assertSessionTargetCurrent();
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
	await recordSessionCreated(cfg, {
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
/** Preparation returns facts; the caller consumes current retry ownership before reserving. */
function prepareChatSendAdmissionRetry(params) {
	try {
		return prepareChatSendRetryComparison(params)?.catch((error) => ({ error }));
	} catch (error) {
		return { error };
	}
}
function consumeChatSendAdmissionRetry(params, prepared) {
	try {
		if (prepared && "error" in prepared) throw prepared.error;
		if (readPreRegisteredRun({
			key: params.session.pendingChatSendKey,
			entry: params.context.dedupe.get(params.session.pendingChatSendKey),
			keyPrefix: "pending-chat:"
		})?.payload.goalFingerprint) {
			params.respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "Run ID is reserved by a Goal request; use a new ID."));
			return false;
		}
		return !params.request.goalOperation && respondChatSendRetry(params, prepared) ? false : prepared;
	} catch (error) {
		if (error instanceof SessionMutationAuthorizationChangedError) throw error;
		respondChatSendAdmissionError(error, params.respond);
		return false;
	}
}
/** Reload after an actual worker wait in the consuming admission frame. */
function prepareCurrentChatSendRetry(params, ownPendingAttemptId) {
	const session = loadCurrentChatSendSession(params.session);
	const comparison = prepareChatSendRetryComparison({
		...params,
		session: {
			...params.session,
			entry: session.entry
		}
	}, ownPendingAttemptId);
	return {
		comparison,
		readSession: () => comparison ? loadCurrentChatSendSession(params.session) : session
	};
}
function respondChatSendWorkAdmissionFailure(params, error, comparison) {
	if (error instanceof ExpectedProfileMismatchError) throw error;
	const { context, respond, session } = params;
	const { clientRunId } = session;
	try {
		const conflict = resolveChatSendRequestConflict(params, comparison);
		if (conflict) {
			respond(false, void 0, conflict);
			return;
		}
	} catch {}
	const aborted = context.chatRunState.hasAbortMarker(clientRunId) && readChatSendDedupeResponse(context.dedupe, clientRunId);
	if (aborted) {
		respond(aborted.ok, aborted.payload, aborted.error, {
			cached: true,
			runId: clientRunId
		});
		return;
	}
	respondChatSendAdmissionError(error, respond);
}
/** New input is checked only after the chat owner has reconciled prior receipts. */
function admitChatSendUploads({ params, client, context, respond }) {
	const assertClientUploadAllowed = captureGatewayClientUploadCommitGuard({
		method: "chat.send",
		requestParams: params,
		client,
		context
	});
	try {
		assertClientUploadAllowed?.();
	} catch (error) {
		if (!(error instanceof SessionMutationAuthorizationChangedError)) throw error;
		respond(false, void 0, error.error);
		return { ok: false };
	}
	return {
		ok: true,
		assertClientUploadAllowed
	};
}
/** Caller and physical target custody end together when admitted work settles. */
function releaseChatSendCallerAuthority(params) {
	try {
		params.operator.release?.();
	} finally {
		try {
			if (params.request.providerReviewAcknowledgment) retireProviderReviewAcknowledgment(params.request.providerReviewAcknowledgment);
		} finally {
			params.session.releaseSessionTarget();
		}
	}
}
/** Queued and collected turns share the original session and caller admission until settlement. */
function createChatSendWorkAdmission(params) {
	let references = 1;
	let finishPendingInput;
	const releaseAdmission = () => {
		try {
			params.admission.release();
		} finally {
			try {
				params.releaseCallerAuthority?.();
			} finally {
				params.releaseGatewayRootContinuation?.();
			}
		}
	};
	const warnCleanupFailure = (error) => {
		params.logGateway.warn(`Failed to finish pending chat input: ${formatForLog(error)}`);
	};
	const release = () => {
		if (references === 0) return;
		references -= 1;
		if (references !== 0) return;
		let pending = void 0;
		try {
			pending = finishPendingInput?.();
		} catch (error) {
			warnCleanupFailure(error);
		}
		if (pending) pending.then(releaseAdmission, (error) => {
			warnCleanupFailure(error);
			releaseAdmission();
		});
		else releaseAdmission();
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
/** Goal and initial-session policy are revalidated in the same input writer barrier. */
function createChatSendGoalCommitGuard(params) {
	const { admission, session, client, context, sessionMutationAuthorization, sessionMutationCommitGuard } = params;
	const routingPredicate = admission.initialSessionEntry ? {
		config: structuredClone(context.getRuntimeConfig()),
		key: session.sessionLoadKey,
		agentId: session.sessionLoadOptions.agentId,
		storePath: session.storePath,
		canonicalKey: session.sessionKey
	} : void 0;
	const assertCurrent = () => {
		sessionMutationCommitGuard?.();
		sessionMutationAuthorization?.assertCurrent();
		const currentConfig = context.getRuntimeConfig();
		const initialEntry = admission.initialSessionEntry;
		if (initialEntry) {
			admission.assertInitialSkillSelection?.();
			if (!isDeepStrictEqual(currentConfig, routingPredicate?.config)) throw new Error("Session routing changed before Goal admission; refresh and retry.");
			const creationError = authorizeGatewaySessionCreation({
				cfg: currentConfig,
				client,
				agentId: session.agentId
			});
			if (creationError) throw new SessionMutationAuthorizationChangedError(creationError);
			const creation = resolveOperatorSessionCreation(client);
			if (creation.actor?.id !== initialEntry.createdActor?.id || resolveCreatorSandbox(currentConfig, creation) !== initialEntry.sandbox) throw new Error("Session creation policy changed before Goal admission; retry.");
		}
		if (admission.activeRunAbort.controller.signal.aborted || admission.lifecycleGeneration !== getAgentEventLifecycleGeneration() || session.sessionRoutingChanged(currentConfig)) throw new Error("Goal admission changed before commit; refresh and retry.");
	};
	return {
		assertCurrent,
		routingPredicate
	};
}
//#endregion
//#region src/gateway/server-methods/chat-send-admission.ts
/** Reserve the session lifecycle and register the abortable run before attachment work. */
async function admitChatSend(params) {
	params.assertCurrent?.();
	const { request, session, respond, context, client } = params;
	const { p, explicitOrigin, normalizedAttachments, turnKind } = request;
	const requestIdentity = request.goalOperation?.requestFingerprint ?? request.requestIdentity;
	const progressRefresh = isProgressCardRefreshInputProvenance(request.systemInputProvenance);
	const { rawSessionKey, clientRunId, pendingChatSendKey, cfg, storePath, entry, sessionKey, selectedAgent, requestedSessionId, backingSessionId, agentId, resolvedSessionModel, resolvedSessionAuthProvider, activeRunScopeKey, timeoutMs, now, restartSafeRequest, expectedLeafEntryId } = session;
	const assertSessionTargetCurrent = session.assertSessionTargetCurrent;
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
	const preparedGoalRetry = request.goalOperation ? await prepareGoalChatSendRetry(params) : void 0;
	if (request.goalOperation) {
		params.assertCurrent?.();
		assertSessionTargetCurrent();
	}
	const goalRetry = inspectGoalChatSendRetry({
		...params,
		prepared: preparedGoalRetry
	});
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
	const pendingRetry = prepareChatSendAdmissionRetry(params);
	const retry = consumeChatSendAdmissionRetry(params, pendingRetry instanceof Promise ? await pendingRetry : pendingRetry);
	if (retry === false) return { ok: false };
	let retryComparison = retry;
	params.assertCurrent?.();
	assertSessionTargetCurrent();
	const uploadAdmission = admitChatSendUploads({
		params: p,
		client,
		context,
		respond
	});
	if (!uploadAdmission.ok) return uploadAdmission;
	params.assertCurrent?.();
	context.dedupe.set(pendingChatSendKey, {
		ts: now,
		ok: true,
		requestIdentity,
		payload: {
			runId: clientRunId,
			attemptId: pendingAttemptId,
			status: "accepted",
			sessionKey,
			...backingSessionId ? { sessionId: backingSessionId } : {},
			...rawSessionKey === sessionKey ? {} : { sessionKeyAliases: [rawSessionKey] },
			...selectedAgent.agentId ? { agentId: selectedAgent.agentId } : {},
			ownerConnId: normalizeOptionalString(client?.connId),
			ownerDeviceId: normalizeOptionalString(client?.connect?.device?.id),
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
		if (pending?.runId === clientRunId && normalizeOptionalString(pending.payload.attemptId) === pendingAttemptId) context.dedupe.delete(pendingChatSendKey);
	};
	const abortPendingChatSend = (stopReason) => writePreRegisteredChatAbort({
		context,
		runId: clientRunId,
		stopReason,
		attemptId: pendingAttemptId,
		requestIdentity
	});
	let admittedSessionId = backingSessionId ?? clientRunId;
	let expectedActiveReplyOperation;
	let gatewayWorkAdmission;
	let admittedRunAbort;
	let restartSafeAdmission;
	let initialSessionEntry;
	let admittedSessionEntry;
	let admittedSessionSettings;
	let assertInitialSkillSelection;
	let messageInjectionTarget;
	let runInterruptTarget;
	let reservationSuperseded = false;
	let supersedingResult;
	let preparedGoalEntry;
	const commitChatWorkAdmission = async () => {
		const current = prepareCurrentChatSendRetry(params, pendingAttemptId);
		retryComparison = current.comparison ? await current.comparison : void 0;
		const latestSession = current.readSession();
		params.assertCurrent?.();
		const retainedRequestConflict = resolveChatSendRequestConflict(params, retryComparison);
		if (retainedRequestConflict) throw new Error(retainedRequestConflict.message);
		if (context.chatRunState.hasAbortMarker(clientRunId)) return;
		const pendingReservation = readPendingReservation();
		if (pendingReservation && normalizeOptionalString(pendingReservation.payload.attemptId) !== pendingAttemptId) {
			reservationSuperseded = true;
			return;
		}
		if (!pendingReservation) {
			const terminalResult = readChatSendDedupeResponse(context.dedupe, clientRunId);
			if (terminalResult || context.chatAbortControllers.has(clientRunId)) {
				reservationSuperseded = true;
				supersedingResult = terminalResult;
				return;
			}
		}
		if (lifecycleGeneration !== getAgentEventLifecycleGeneration()) {
			abortPendingChatSend("restart");
			return;
		}
		if (!pendingReservation || !isFutureDateTimestampMs(pendingReservation.payload.expiresAtMs, { nowMs: Date.now() })) {
			abortPendingChatSend("timeout");
			return;
		}
		const latestEntry = latestSession.entry;
		admittedSessionEntry = latestEntry;
		const requestConflict = resolveChatSendRequestConflict({
			...params,
			session: {
				...session,
				entry: latestEntry
			}
		}, retryComparison);
		if (requestConflict) throw new Error(requestConflict.message);
		admittedSessionSettings = captureAdmittedChatSendSessionSettings({
			commit: true,
			entry: latestEntry,
			expectedPermissionMode: p.expectedPermissionMode,
			expectedToolOverrides: p.expectedToolOverrides
		});
		assertChatSendExclusiveAdmission(request, session);
		if (entry && !latestEntry) throw new Error(`Session "${sessionKey}" was deleted while starting work. Retry.`);
		messageInjectionTarget = p.queueMode === "steer" ? replyRunRegistry.resolveCurrentMessageInjectionTarget(activeRunScopeKey) : void 0;
		runInterruptTarget = p.queueMode === "interrupt" ? replyRunRegistry.resolveCurrentInterruptTarget(activeRunScopeKey) : void 0;
		if (p.queueMode !== "steer" && expectedLeafEntryId !== void 0) assertExpectedLeafActive(latestSession, agentId, expectedLeafEntryId, requestedSessionId, { allowEmptyAncestor: true });
		if (backingSessionId && latestEntry?.sessionId && latestEntry.sessionId !== backingSessionId) throw new Error(`Session "${sessionKey}" changed while starting work. Retry.`);
		const retryableClaim = isRetryableUnadoptedChatClaim(latestEntry, clientRunId);
		if (latestEntry?.restartRecoveryDeliveryRunId && latestEntry.restartRecoveryDeliverySourceRunId === clientRunId && !retryableClaim || hasRestartRecoveryTerminalRun(latestEntry, clientRunId)) {
			reservationSuperseded = true;
			supersedingResult = {
				ts: Date.now(),
				ok: true,
				payload: {
					runId: clientRunId,
					status: "ok"
				}
			};
			return;
		}
		const archivedError = resolveSessionWorkStartError(sessionKey, latestEntry, {
			allowPendingWorkspace: true,
			providerReviewAcknowledgment: request.providerReviewAcknowledgment,
			runId: clientRunId
		});
		if (archivedError) throw new Error(archivedError);
		admittedSessionId = latestEntry?.sessionId ?? backingSessionId ?? clientRunId;
		expectedActiveReplyOperation = replyRunRegistry.get(activeRunScopeKey);
		if (request.goalOperation?.action === "start" && !latestEntry && !requestedSessionId) {
			if (!preparedGoalEntry) {
				preparedGoalEntry = await prepareChatSendSessionEntry({
					cfg: latestSession.cfg,
					client,
					agentId,
					getRuntimeConfig: context.getRuntimeConfig
				});
				return commitChatWorkAdmission();
			}
			const prepared = preparedGoalEntry;
			initialSessionEntry = prepared.entry;
			assertInitialSkillSelection = prepared.assertSkillSelection;
			admittedSessionId = initialSessionEntry.sessionId;
		}
		restartSafeAdmission = resolveRestartSafeChatAdmission({
			activeRunScopeKey,
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
			ownerConnId: normalizeOptionalString(client?.connId),
			ownerDeviceId: normalizeOptionalString(client?.connect?.device?.id),
			providerId: resolvedSessionModel.provider,
			authProviderId: resolvedSessionAuthProvider,
			isAbortable: (active) => isReplyRunAbortableForSignal(active.controller.signal),
			resolveTerminalProducer: (active) => resolveActiveReplyRunOwnerForSignal(active.controller.signal),
			kind: "chat-send",
			turnKind,
			...progressRefresh ? {
				controlUiVisible: false,
				projectSessionActive: false
			} : {},
			lifecycleGeneration
		});
	};
	let retainedRequestConflict;
	try {
		gatewayWorkAdmission = await beginSessionWorkAdmission({
			scope: storePath,
			identities: [sessionKey, backingSessionId],
			storeWriterIdentities: [sessionKey, session.sessionTarget.storeKey],
			assertAllowed: () => {
				params.assertCurrent?.();
				assertSessionTargetCurrent();
				assertChatSendExclusiveAdmission(request, session);
			},
			revalidateAllowed: commitChatWorkAdmission,
			onInterrupt: (reason) => {
				const stopReason = isAgentRunDirectAbortReason(reason) ? "rpc" : "restart";
				if (!admittedRunAbort) {
					if (!context.chatRunState.hasAbortMarker(clientRunId)) abortPendingChatSend(stopReason);
				} else if (!admittedRunAbort.controller.signal.aborted) {
					if (admittedRunAbort.entry) admittedRunAbort.entry.abortStopReason = stopReason;
					admittedRunAbort.controller.abort(stopReason === "rpc" ? reason : createAgentRunRestartAbortError());
				}
			}
		});
		params.assertCurrent?.();
		retainedRequestConflict = resolveChatSendRequestConflict(params, retryComparison);
	} catch (err) {
		clearPendingChatSendReservation();
		admittedRunAbort?.cleanup();
		gatewayWorkAdmission?.release();
		respondChatSendWorkAdmissionFailure(params, err, retryComparison);
		return { ok: false };
	}
	if (retainedRequestConflict) {
		clearPendingChatSendReservation();
		admittedRunAbort?.cleanup();
		gatewayWorkAdmission.release();
		respond(false, void 0, retainedRequestConflict);
		return { ok: false };
	}
	if (admittedRunAbort?.registered && !reservationSuperseded && !readChatSendDedupeResponse(context.dedupe, clientRunId)) context.dedupe.set(`chat:${clientRunId}`, {
		ts: Date.now(),
		ok: true,
		requestIdentity
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
		if (!readChatSendDedupeResponse(context.dedupe, clientRunId)) abortPendingChatSend(activeRunAbort?.entry?.abortStopReason ?? "restart");
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
		capturedOperator = await retainGatewayOperatorRun({
			...params,
			runId: clientRunId,
			entry: activeRunAbort.entry
		});
		releaseCallerAuthority = () => releaseChatSendCallerAuthority({
			operator: capturedOperator,
			request,
			session
		});
		params.assertCurrent?.();
		activeRunAbort.controller.signal.throwIfAborted();
		capturedOperator.authority?.assertCurrent();
		try {
			assertSessionTargetCurrent();
		} catch (error) {
			cleanupPreDispatchAdmission();
			respondChatSendAdmissionError(error, respond);
			return { ok: false };
		}
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
		try {
			assertSessionTargetCurrent();
		} catch (error) {
			cleanupPreDispatchAdmission();
			respondChatSendAdmissionError(error, respond);
			return { ok: false };
		}
	} catch (error) {
		cleanupPreDispatchAdmission();
		throw error;
	}
	const acquiredGatewayWorkAdmission = gatewayWorkAdmission;
	const sessionBinding = activeRunAbort.entry;
	const onSessionPrepared = bindChatSendPreparedSession({
		chatAbortControllers: context.chatAbortControllers,
		clientRunId,
		sessionKey,
		sessionBinding,
		lifecycleGeneration,
		admission: acquiredGatewayWorkAdmission,
		progressRefresh
	});
	const retainedWork = createChatSendWorkAdmission({
		admission: acquiredGatewayWorkAdmission,
		releaseCallerAuthority,
		releaseGatewayRootContinuation,
		logGateway: context.logGateway
	});
	let discardAbandonedPreparedMedia;
	const cleanupAdmittedRun = () => {
		activeRunAbort.cleanup();
		retainedWork.release();
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
			admittedSessionEntry,
			chatSendTraceAttributes,
			assertInitialSkillSelection,
			assertSessionTargetCurrent,
			cleanupAdmittedRun,
			finishAbortedChatSend,
			gatewayWorkAdmission,
			lifecycleGeneration,
			interruptedActiveRun,
			messageInjectionTarget,
			originatingRoute,
			rejectSessionRoutingChanged,
			releaseSourceWorkAdmission: retainedWork.release,
			retainGatewayWorkAdmission: retainedWork.retain,
			setPendingInputCleanup: retainedWork.setPendingInputCleanup,
			assertClientUploadAllowed: uploadAdmission.assertClientUploadAllowed,
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
		if (!Number.isSafeInteger(mention.start) || !Number.isSafeInteger(mention.end) || mention.start < previousEnd || mention.end > text.length || mention.end <= mention.start + 1 || token.length > 257 || token[0] !== "@" || !token.slice(1).trim() || containsAsciiControlCharacter(token) || splitsSurrogate(text, mention.start) || splitsSurrogate(text, mention.end)) return {
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
	const stopCommand = !commandInterpretationSuppressed && isAbortRequestText(inboundMessage);
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
	const requestIdentity = sha256Hex(JSON.stringify([
		p.message,
		p.mentions?.map(({ profileId, start, end }) => [
			profileId,
			start,
			end
		]) ?? [],
		...workContext ? [workContext.snapshot] : [],
		...providerReview ? [providerReview.review.id, providerReview.target.sessionId] : []
	]));
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
	const loadedSession = prepareChatSendSession({
		request: normalizedRequest.value,
		context,
		client
	});
	if (!loadedSession.ok) {
		respond(false, void 0, typeof loadedSession.error === "string" ? errorShape(ErrorCodes.INVALID_REQUEST, loadedSession.error) : loadedSession.error);
		return;
	}
	if (normalizedRequest.value.mentions) {
		const mentions = context.mentionInbox?.validateRecipients(client, loadedSession.value.entry ? {
			sessionKey: loadedSession.value.sessionKey,
			agentId: loadedSession.value.agentId
		} : { agentId: loadedSession.value.agentId }, normalizedRequest.value.mentions.map((mention) => mention.profileId));
		if (!mentions?.ok) {
			respond(false, void 0, mentions?.error ?? errorShape(ErrorCodes.UNAVAILABLE, "Human mentions are unavailable; reconnect and retry."));
			return;
		}
	}
	if (!await runChatSendPreAdmission({
		request: normalizedRequest.value,
		session: loadedSession.value,
		respond,
		context,
		client,
		assertCurrent
	})) return;
	let session;
	try {
		session = qualifyChatSendSession(loadedSession.value);
	} catch (error) {
		respondChatSendAdmissionError(error, respond);
		return;
	}
	let admitted;
	try {
		const nativeRestriction = await prepareChatSendNativeRuntimeRestriction({
			request: normalizedRequest.value,
			session,
			client,
			context,
			assertCurrent
		});
		if (nativeRestriction) {
			respond(false, void 0, nativeRestriction);
			return;
		}
		admitted = await admitChatSend({
			request: normalizedRequest.value,
			session,
			respond,
			context,
			client,
			onAdmissionOwned,
			hasCurrentClientAuthority,
			assertCurrent
		});
		if (!admitted.ok) return;
		return {
			request: normalizedRequest.value,
			session,
			admission: admitted.value
		};
	} finally {
		if (!admitted?.ok) session.releaseSessionTarget();
	}
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
	let mentionCommit;
	const onPersistenceError = (error) => params.warn(`gateway user transcript persistence failed: ${formatForLog(error)}`);
	const recorder = createUserTurnTranscriptRecorder({
		...sender?.id && !request.goalOperation ? { pendingInputRequestFingerprint: sha256Hex(stableStringify([
			{
				...request.p,
				sessionId: admission.sessionBinding.sessionId,
				expectedLeafEntryId: void 0
			},
			sender.identity ?? sender.id,
			hasGatewayAdminScope(params.client)
		])) } : {},
		...request.goalOperation ? { sessionTurnMutation: {
			kind: "goal",
			operation: request.goalOperation,
			runId: session.clientRunId,
			...params.goalCommitGuard
		} } : {},
		input: baseInput,
		resolveInput: () => inputPromise,
		target: () => {
			const target = session.sessionTarget;
			const sessionId = admission.sessionBinding.sessionId;
			return {
				sessionId,
				expectedSessionId: sessionId,
				initialSessionEntry: admission.initialSessionEntry,
				sessionKey: target.storeKey,
				sessionEntry: void 0,
				storePath: target.storePath,
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
		onPersistenceError,
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
			mentionCommit = mentionInbox.recordCommittedInputAsync({
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
			mentionCommit.catch(onPersistenceError);
		} } : {}
	});
	const persist = async (options) => {
		if (options?.contextFreeCommand === true && !recorder.hasPersisted()) contextFreeCommand = true;
		const persisted = await measureDiagnosticsTimelineSpan("gateway.chat_send.persist_user_transcript", () => recorder.persistFallback(), {
			phase: "agent-turn",
			config: session.cfg,
			attributes: admission.chatSendTraceAttributes
		});
		await mentionCommit;
		return persisted;
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
const mediaDocumentContextLoader = createLazyImportLoader(() => import("./file-context-XVF3vvX4.mjs"));
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
	const { request, session, admission } = setup;
	const { chatSendReceivedAtMs, clientInfo, p, systemInputProvenance, reconnectResumeRequested } = request;
	const { clientRunId, sessionLoadMs, cfg, storePath, entry, sessionKey, sessionRoutingChanged, selectedAgent } = session;
	const { activeRunAbort, admittedSessionId, chatSendTraceAttributes, finishAbortedChatSend, interruptedActiveRun, lifecycleGeneration, messageInjectionTarget, restartSafeAdmission } = admission;
	const preparedAttachments = await prepareChatSendAttachments({
		client,
		request,
		session,
		admission,
		respond,
		context
	});
	if (!preparedAttachments.ok) return;
	const bindPreparedMediaRecorder = bindChatSendPreparedMediaCustody({
		admission,
		attachments: preparedAttachments.value
	});
	if (activeRunAbort.controller.signal.aborted) {
		finishAbortedChatSend();
		return;
	}
	if (sessionRoutingChanged(context.getRuntimeConfig())) {
		admission.rejectSessionRoutingChanged();
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
		hasExplicitOrigin: request.explicitOrigin !== void 0,
		hasRestoredCronContinuation: entry?.cronRunContinuation !== void 0,
		isIncognitoEntry: entry?.incognito === true,
		isReconnectResume: reconnectResumeRequested,
		isSystemGenerated: request.suppressCommandInterpretation || request.systemProvenanceReceipt !== void 0,
		turnKind: request.turnKind
	};
	const cronCreatorAuthority = externalAuthorityAdmission?.resolve(externalAdmissionParams);
	let dashboardSessionAuthorization;
	const assertDashboardReadCurrent = externalAuthorityAdmission?.allowsDashboardReads(externalAdmissionParams) ? () => {
		admission.assertWorkAdmissionCurrent();
		sessionMutationCommitGuard?.();
		if (client?.invalidated || hasCurrentClientAuthority?.() === false || !externalAuthorityAdmission.allowsDashboardReads(externalAdmissionParams)) throw new Error("Dashboard message read admission is no longer active.");
		if (!dashboardSessionAuthorization) {
			const resolved = resolveSessionMutationAuthorization({
				client,
				context,
				method: "chat.send",
				requestParams: {
					agentId: session.agentId,
					sessionKey
				},
				expectedTarget: {
					agentId: session.agentId,
					sessionKey,
					storePath,
					sessionId: admission.sessionBinding.sessionId
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
			admission.assertClientUploadAllowed?.();
			admission.assertWorkAdmissionCurrent();
			admission.assertSessionTargetCurrent();
			sessionMutationCommitGuard?.();
		};
		assertInputAdmissionCurrent();
		const goalCommitGuard = request.goalOperation ? createChatSendGoalCommitGuard({
			admission,
			session,
			client,
			context,
			sessionMutationAuthorization,
			sessionMutationCommitGuard
		}) : void 0;
		const userTurn = createGatewayChatUserTurnController({
			admission,
			client,
			request,
			session,
			transcript: options?.transcript,
			startedAt: admissionStartedAt,
			warn: (message) => context.logGateway.warn(message),
			mentionInbox: context.mentionInbox,
			assertOriginalInputCommit: assertInputAdmissionCurrent,
			goalCommitGuard
		});
		const { persist: persistGatewayUserTurnTranscript, recorder: userTurnRecorder, replyContextFieldsPromise } = userTurn;
		bindPreparedMediaRecorder(userTurnRecorder);
		const preparedUserTurn = await prepareChatSendUserTurn({
			request,
			session,
			admission,
			attachments: preparedAttachments.value,
			client,
			logGateway: context.logGateway,
			getConfig: context.getRuntimeConfig,
			userTurn
		});
		const { ctx, isInternalTextSlashCommandTurn } = preparedUserTurn;
		admission.setPendingInputCleanup(async () => {
			try {
				const pending = userTurnRecorder.getPendingInputMessage?.() && !userTurnRecorder.isPendingInputConsumed?.();
				const disposition = activeRunAbort.controller.signal.aborted && activeRunAbort.entry?.abortStopReason !== "restart" && !isAgentRunRestartAbortReason(activeRunAbort.controller.signal.reason) ? "cancelled" : "interrupted";
				userTurnRecorder.finishPendingInput?.(disposition);
				if (pending && activeRunAbort.controller.signal.aborted) {
					const reason = resolveChatAbortDiagnosticReason(activeRunAbort.controller.signal, activeRunAbort.entry);
					context.logGateway.info(`chat pending input aborted: ${reason} (${disposition})`, {
						runId: clientRunId,
						sessionKey,
						sessionId: admittedSessionId,
						agentId: selectedAgent.agentId,
						disposition,
						reason
					});
				}
				await userTurnRecorder.waitForPendingInputSettlement?.();
			} finally {
				preparedUserTurn.discardUnreferencedMedia(userTurnRecorder.getPendingInputMessage?.()).catch((error) => context.logGateway.warn(`Failed to discard unused chat media: ${String(error)}`));
			}
		});
		if (entry?.sessionId && userTurn.baseInput.display !== false && (!systemInputProvenance || systemInputProvenance.kind === "external_user") && !isInternalTextSlashCommandTurn && !request.goalOperation) {
			pendingStageAttempted = true;
			const assertCustodyCurrent = () => {
				admission.assertWorkAdmissionCurrent();
				admission.assertSessionTargetCurrent();
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
					admission.assertClientUploadAllowed?.();
					sessionMutationCommitGuard?.();
					assertCustodyCurrent();
				},
				assertAdmittedCurrent: req.expectedProfileId === void 0 ? assertCustodyCurrent : createMessageInjectionAuthority(() => {
					assertCustodyCurrent();
					return true;
				})
			});
			if (userTurnRecorder.isPendingInputConsumed?.()) {
				admission.cleanupAdmittedRun();
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
			const goalOperation = request.goalOperation;
			if (goalOperation) {
				const mutation = persistedUserTurn?.sessionTurnMutationResult;
				goalResult = mutation?.result;
				if (!goalResult) {
					goalResult = await lookupSessionGoalOperation({
						sessionKey,
						storePath,
						agentId: session.agentId,
						expectedSessionId: admittedSessionId,
						operation: goalOperation
					});
					assertInputAdmissionCurrent();
					goalCommitGuard?.assertCurrent();
				}
				if (goalResult && (!persistedUserTurn || mutation?.replayed)) {
					admission.cleanupAdmittedRun();
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
				if (admission.initialSessionEntry) await recordSessionCreated(session.cfg, {
					sessionKey,
					agentId: session.agentId,
					entry: persistedUserTurn.sessionEntry
				});
				await publishCommittedSessionGoalChange(context, {
					sessionKey,
					agentId: session.agentId,
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
				admission.rejectSessionRoutingChanged();
				return;
			}
		}
		if (messageInjectionTarget) invalidateSkillAuthoringForOtherRequester(sessionKey, client?.internal?.syntheticClient ? void 0 : client?.authenticatedUserProfile?.profileId);
		const steerDocumentContext = messageInjectionTarget && !isInternalTextSlashCommandTurn && ctx.media?.length ? await mediaDocumentContextLoader.load().then(async (runtime) => ({
			status: "rendered",
			...await runtime.renderInboundDocumentContext({
				ctx,
				cfg: session.cfg
			})
		})).catch((err) => {
			mediaDocumentContextLoader.clear();
			logVerbose(`steer document render failed, injecting raw content: ${formatErrorMessage(err)}`);
			return { status: "failed" };
		}) : void 0;
		if (activeRunAbort.controller.signal.aborted) return finishAbortedChatSend();
		if (sessionRoutingChanged(context.getRuntimeConfig())) return admission.rejectSessionRoutingChanged();
		const beginCapturedMessageInjection = createChatSendMessageInjectionStarter({
			operatorAuthority: admission.operatorAuthority,
			target: messageInjectionTarget,
			abortSignal: activeRunAbort.controller.signal,
			request,
			session,
			admittedSessionSettings: admission.admittedSessionSettings,
			turn: preparedUserTurn,
			imageOrder,
			documentContext: steerDocumentContext,
			userTurnTranscriptRecorder: userTurnRecorder,
			logGateway: context.logGateway,
			assertCurrent: req.expectedProfileId === void 0 && !admission.assertClientUploadAllowed && !isProgressCardRefreshInputProvenance(systemInputProvenance) ? void 0 : assertInputAdmissionCurrent
		});
		const preAckReplyContextPromise = messageInjectionTarget && !isInternalTextSlashCommandTurn ? replyContextFieldsPromise : void 0;
		if (preAckReplyContextPromise) {
			applyChatSendReplyContextFields(ctx, await preAckReplyContextPromise);
			if (activeRunAbort.controller.signal.aborted) return finishAbortedChatSend();
			if (sessionRoutingChanged(context.getRuntimeConfig())) return admission.rejectSessionRoutingChanged();
		}
		assertInputAdmissionCurrent();
		let messageInjectionAttempt = !p.replyToId || preAckReplyContextPromise ? beginCapturedMessageInjection() : void 0;
		const preAckInjection = await settleChatSendPreAckMessageInjection({
			attempt: messageInjectionAttempt,
			isAborted: () => activeRunAbort.controller.signal.aborted,
			sessionRoutingChanged: () => sessionRoutingChanged(context.getRuntimeConfig()),
			onAborted: finishAbortedChatSend,
			onSessionRoutingChanged: admission.rejectSessionRoutingChanged
		});
		if (preAckInjection.status === "handled") return;
		messageInjectionAttempt = preAckInjection.attempt;
		const skillLibraryAuthoring = await prepareGatewaySkillAuthoring({
			client,
			context,
			sessionMutationCommitGuard: () => {
				sessionMutationCommitGuard?.();
				admission.assertWorkAdmissionCurrent();
			}
		}, sessionKey, !options && !systemInputProvenance && !reconnectResumeRequested && request.turnKind === "main");
		const serverTiming = isOperatorUiClient(clientInfo) ? {
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
		assertInputAdmissionCurrent();
		admission.setDiscardAbandonedPreparedMedia(void 0);
		respond(true, ackPayload, void 0, { runId: clientRunId });
		context.recordClientActivity?.(client);
		const chatSendAckedAtMs = chatSendTiming?.ackedAtMs ?? performance.now();
		startChatDispatch({
			admissionStartedAt,
			admission,
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
			request,
			session,
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
			cacheResult: request.goalOperation === void 0 && !pendingStageAttempted,
			admission,
			context,
			error: err,
			respond,
			session,
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
export { handleTrustedInternalChatSend as a, handleSessionGoalResumeChat as i, handleChatSendWithSkillWorkshopProposalRevision as n, normalizeChatSendRequest as o, handleProviderReviewContinuationChat as r, scheduleCreatedDashboardSessionTitle as s, handleChatSend as t };
