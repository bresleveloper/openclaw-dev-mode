import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { g as isFutureDateTimestampMs } from "./number-coercion-CkhMiRw8.mjs";
import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import "./src-Djeo9OvP.mjs";
import { t as expectDefined } from "./expect-lbe3Hgrh.mjs";
import { a as asOptionalRecord } from "./record-coerce-TIsquoVR.mjs";
import { t as stableStringify } from "./stable-stringify-Djn3uxNo.mjs";
import { y as uniqueStrings } from "./string-normalization-D6DKCpwE.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { i as createAbortError } from "./src-Bzfi3cQM.mjs";
import "./abort-signal-C9DFO3n5.mjs";
import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { p as isDiagnosticsEnabled } from "./diagnostic-events-C91J-XX8.mjs";
import { t as createSubsystemLogger } from "./subsystem-mStysHHC.mjs";
import { r as assertExistingDatabaseIdentity } from "./sqlite-worker-identity-DLqVBf5J.mjs";
import { n as sha256Hex } from "./node-crypto-BG4u3UnX.mjs";
import { a as isSameOpenClawAgentDatabasePath } from "./openclaw-agent-db.paths-BGqL4GOe.mjs";
import { n as SessionGoalOperationError } from "./goals-operations.types-DnxMqPtA.mjs";
import { t as createLazyImportLoader } from "./lazy-promise-DGqyc4Y4.mjs";
import { t as _usingCtx } from "./usingCtx-BhiZp_rS.mjs";
import { r as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-BDhKaXgP.mjs";
import { i as classifyAgentRunTerminalOutcome } from "./agent-run-terminal-outcome-CrMEEYuY.mjs";
import { D as resolveProjectedAgentRunProgressState, i as claimAgentRunContext, o as clearAgentRunContext, u as getAgentRunContext } from "./agent-run-registry-gmaPgO-n.mjs";
import { d as getAgentEventLifecycleGeneration } from "./agent-events-Bf3Js0D3.mjs";
import { o as composeSessionSourceAssertion } from "./session-source-authority-fdILH-PW.mjs";
import { i as isIncognitoSessionKey } from "./incognito-session-key-BWpn88lo.mjs";
import { S as isCronSessionKey, b as isAcpSessionKey, k as resolveSessionDispatchKind, w as isSubagentSessionKey } from "./session-key-CSDERtm3.mjs";
import { f as resolveAgentWorkspaceDir, o as resolveAgentEntry } from "./agent-scope-config-fjA2T9Gz.mjs";
import { i as resolveProviderIdForAuth } from "./provider-auth-aliases-DCRcDae6.mjs";
import { c as withDiagnosticsTimelineObserver, n as emitDiagnosticsTimelineEvent, o as measureDiagnosticsTimelineSpan } from "./diagnostics-timeline-BgymzmGj.mjs";
import { a as hasGatewayClientCap, t as GATEWAY_CLIENT_CAPS } from "./client-info-BgcoFakQ.mjs";
import { Gg as readAgentRuntimeRestrictionErrorDetails, Ng as errorShape, Np as isReactionEmoji } from "./src-pLJQA6J5.mjs";
import { y as retainGatewayRootWorkAdmissionContinuation } from "./gateway-work-admission-FWbk4b3p.mjs";
import { c as resolveSessionStorePathCore } from "./paths-YgcBNLgG.mjs";
import { s as createAgentDatabaseAdmissionErrorShape, t as AgentDatabaseAdmissionError } from "./agent-database-admission-CeDA0ojh.mjs";
import { s as readSessionTranscriptRunId } from "./transcript-events-D3brcRJS.mjs";
import { a as modelFallbackOverrideFromAvailability, p as resolveModelFallbackAvailability } from "./agent-scope-DXrnO3F4.mjs";
import "./agent-runtime-id-BZLMe-UU.mjs";
import { n as parseModelRef, t as findNormalizedProviderValue } from "./model-selection-normalize-DulZGI4S.mjs";
import { d as hasGatewayAdminScope } from "./operator-scopes-BO7_XQCg.mjs";
import { t as INTERNAL_MESSAGE_CHANNEL } from "./message-channel-constants-B3vfipkP.mjs";
import { n as getUserTurnTranscriptAdmissionOwner, t as bindUserTurnPromptReactionSource } from "./user-turn-transcript-admission-BZunVvZI.mjs";
import { t as captureSessionTranscriptStorageEnvironment } from "./transcript-target-binding-uO0pz59U.mjs";
import { n as extractAssistantTextForPhase, t as extractAssistantPhaseText } from "./chat-message-content-C-d0FKNG.mjs";
import { a as isInternalMessageChannel, n as isBrowserOperatorUiClient, s as isOperatorUiClient } from "./message-channel-DmAdWHmL.mjs";
import { M as buildRestartRecoveryExpectedState } from "./session-actor-memory-owner-BSARM2d5.mjs";
import { m as resolveAgentRunErrorLifecycleFields, o as createAgentRunRestartAbortError, p as resolveAgentRunAbortLifecycleFields, u as isAgentRunRestartAbortReason } from "./run-termination-Dwf1ksjA.mjs";
import { a as resolveSessionWorkStartError, m as retireProviderReviewAcknowledgment } from "./session-work-start-Sz_vqYld.mjs";
import { f as withExecRequestTurn, n as adoptExecRequestSession } from "./exec-request-context-CWnK9ayt.mjs";
import { A as stripReplyMediaFailureFallback, _ as isReplyPayloadStatusNotice, a as buildTtsSupplementMediaPayload, b as isReplyPayloadTtsSupplement, c as getReplyPayloadMetadata, g as isReplyPayloadSessionWriterDeliveryAuthorized, l as getReplyPayloadTtsSupplement, o as copyReplyPayloadMetadata } from "./reply-payload-BLX_BF2U.mjs";
import { t as ErrorCodes } from "./gateway-error-details-Cl-eEOTQ.mjs";
import { l as resolveCreatorSandbox, n as authorizeGatewaySessionCreation } from "./operator-role-policy-Coro3qc5.mjs";
import { i as sessionToolOverridesEqual, r as normalizeSessionToolOverrides } from "./session-tool-overrides-B6c6gJaM.mjs";
import { m as withoutGatewayToolCallerIdentity } from "./gateway-caller-context-Be176_GV.mjs";
import { o as resolveSessionRoutingContract, t as SESSION_ROUTING_CHANGED_ERROR_REASON } from "./main-session-CHYPkxYr.mjs";
import { n as sessionDeliveryChannel } from "./delivery-context.read-CR06zOJ4.mjs";
import { i as toDatabaseOptions } from "./session-accessor.sqlite-scope-helpers-XTtpZpWK.mjs";
import { g as progressCardRefreshRunProjection, p as isProgressCardRefreshInputProvenance } from "./input-provenance-D1LHo5Qj.mjs";
import { l as buildSessionCreationStamp } from "./session-entry-lineage-B7Mubzwj.mjs";
import { S as isRetryableUnadoptedChatClaim, b as hasRestartRecoveryTerminalRun } from "./store-maintenance-BqMt1Twc.mjs";
import { i as assertSessionGoalOperationTime } from "./goals-operation-policy-qSLTo9UN.mjs";
import { r as readAssistantDisplayContent } from "./assistant-display-content-mzartsGP.mjs";
import { f as readPersistedMediaFacts } from "./media-facts-BIPREXi-.mjs";
import { n as combineNonStreamingReplyParts } from "./text-projection-mdP9TY8k.mjs";
import { i as parseInlineDirectives } from "./directive-tags-DmdxLrNX.mjs";
import { r as parseInboundMediaUri } from "./inbound-media-uri-Bc4RWtcM.mjs";
import { S as isSuppressedControlReplyText } from "./chat-display-projection.helpers-DvBIoDrj.mjs";
import { l as sanitizeAssistantVisibleTextWithProfile } from "./assistant-visible-text-DZwixI8b.mjs";
import { s as extractTextFromChatContent, t as renderAgentHarnessPreflightUserMessage } from "./user-facing-text-BNFEPbYx.mjs";
import { _ as renderFailoverCodeUserCopy } from "./user-copy-BAz4s3EV.mjs";
import { i as buildRunUserTurnIdempotencyKey } from "./user-turn-transcript.metadata-CtXLmxDa.mjs";
import { r as isSessionTranscriptProjectionUnavailableError, t as SessionTranscriptProjectionUnavailableError } from "./session-transcript-projection-error-B7C6SQei.mjs";
import { n as captureSessionActorStorageOwner, o as runWithSessionActorStorage, r as getSessionActorStorageBinding, s as withSessionActorStorage, t as acquireSessionActorStorage } from "./session-actor-storage-binding-oCtbPk00.mjs";
import { i as prepareSqliteScope } from "./session-accessor.sqlite-scope-9ysL95gx.mjs";
import { o as withSessionHistoryWorkerDatabase, r as retainSessionHistoryWorkerDatabase } from "./session-transcript-worker-runtime-DyHfVUVm.mjs";
import { c as withSessionEntriesFromStoresInWorker } from "./session-entry-read-runtime-CgqUrGct.mjs";
import { c as waitForSessionTranscriptProjection, i as startSessionTranscriptIndexReconcile } from "./session-transcript-reconcile-BkwlDaaD.mjs";
import { D as readSessionSubmittedInput, N as normalizeMessageClientSources, j as preparePendingInputStore } from "./session-accessor-Czw4l8kI.mjs";
import { I as prepareSessionCapabilityRead, R as withPreparedSessionCapabilityRead } from "./session-accessor.sqlite-entry-store-B3Lv6xes.mjs";
import { _ as interruptSessionWorkAdmissions, n as beginSessionWorkAdmission, v as isCompetingSessionWorkAdmissionActive } from "./session-lifecycle-admission-BihxXo5j.mjs";
import { t as readSessionTranscriptWatermark } from "./session-accessor.sqlite-transcript-watermark-CfdOKFaq.mjs";
import { _ as readTranscriptEventId, v as readTranscriptEventMessage } from "./session-accessor.sqlite-read-Cx1b3WWI.mjs";
import { a as acquireSessionInputActor, o as bindUserTurnInputActor, u as withSessionInputActor } from "./session-accessor.sqlite-transcript-turn-CoODj9qI.mjs";
import { n as withSessionPendingInputAuthorityGuard } from "./session-pending-input-authority-CoXHTQsM.mjs";
import { r as resolveRequestedSessionAgentId, s as tryResolveSessionCompatibilityOwnerAgentId, t as resolveChatSendSessionKey } from "./session-request-agent-ByGzV8Af.mjs";
import { n as applySessionEntryTargetOperation } from "./session-accessor.sqlite-entry-wJ2W65pX.mjs";
import { a as isAgentHarnessSessionKey, m as resolveMissingAgentHarnessSessionError } from "./agent-harness-session-key-zbrcLVpT.mjs";
import { l as getOwnedSessionTranscriptReader, v as withSessionTranscriptSourcePublication } from "./transcript-write-context-C02sC3zd.mjs";
import { i as prepareQualifiedSessionEntryTarget } from "./session-accessor.entry-BLpjjUTc.mjs";
import { l as updateSessionEntry } from "./session-accessor.entry-mutation-DgCGNicZ.mjs";
import { n as readSessionTranscriptAnchorsAsync } from "./session-transcript-anchor-read-DMRJnQDO.mjs";
import { i as resolveSessionTranscriptDatabasePath } from "./session-accessor.transcript-target-DDngfM5X.mjs";
import { t as findTranscriptEvent } from "./session-transcript-match-CM2tniQA.mjs";
import "./goals-operations-DPpmJyei.mjs";
import { a as readSessionTranscriptActivePathEntryRelation } from "./session-accessor.sqlite-active-events-CqOkO0QM.mjs";
import { t as applyAssistantDeliveryDirectives } from "./transcript-assistant-delivery-CHjQRvEC.mjs";
import "./sessions-CnzPI1yx.mjs";
import { n as resolveSessionResetType, t as resolveChannelResetConfig } from "./reset-DlE-iD9Z.mjs";
import { r as isSyntheticGatewayCaller } from "./gateway-personal-caller-BLfLqLHg.mjs";
import { i as gatewayClientSessionCreator, o as resolveChatSendCallerContext, r as gatewayClientSenderFields } from "./gateway-client-identity-DXWhtQve.mjs";
import { t as SessionMutationAuthorizationChangedError } from "./session-mutation-authorization-error-Cdqn6r49.mjs";
import { n as resolveAgentTimeoutMs } from "./timeout-BBs3o51w.mjs";
import { s as withQualifiedGatewaySessionStoreTarget } from "./session-utils-store-lookup-DlW2SGlr.mjs";
import { n as omitInternalSessionEffectsEntries, t as findCanonicalStoreMatch } from "./session-utils-store-selection-DIMLgaMc.mjs";
import { n as captureSessionMutationRouting } from "./session-sharing-preparation-DAfvBDLL.mjs";
import { r as resolveGatewaySessionStoreTargetInWorker, t as loadGatewaySessionEntryReadOnlyInWorker } from "./session-utils-store-worker-u3lCvEEg.mjs";
import { t as ExpectedProfileMismatchError } from "./expected-profile-Bnus0Sst.mjs";
import "./session-sharing-DuL10izq.mjs";
import { n as getRegisteredAgentHarness } from "./registry-BDZ8eM01.mjs";
import { r as resolveSessionModelRef } from "./session-model-ref-BTkDCi12.mjs";
import { o as resolveEffectiveAgentRuntime } from "./thinking-runtime-DuxsJR5q.mjs";
import { r as resolveGatewayModelSupportsImages } from "./session-utils-model-Bx2gzKtO.mjs";
import { i as logVerbose } from "./globals-XVSoVbNQ.mjs";
import { i as hasGlobalHooks, n as getGlobalHookRunner } from "./hook-runner-global-yjqy4fXI.mjs";
import "./channel-outbound-BbIm36V0.mjs";
import { t as bindRequesterProfile } from "./requester-profile-u6QLGOHK.mjs";
import { a as bindWorkerToolPreparation } from "./host-private-capabilities-eTr803c9.mjs";
import { u as prepareSessionParticipantInput } from "./host-context-builder-2jolfam-.mjs";
import { a as resolveCommandAuthorizationAsync } from "./command-auth-D8Y1MxJm.mjs";
import "./agent-run-terminal-outcome-D-ijbyA8.mjs";
import { r as resolveStateContentionPresentation } from "./session-run-error-presentation-TwKM9EqW.mjs";
import { t as recordGatewaySessionRunFailure } from "./session-run-error-GbrkFe1D.mjs";
import { n as deriveGatewaySessionLifecycleSnapshot, r as persistGatewaySessionLifecycleEvent } from "./session-event-payload-jfNs8sPy.mjs";
import { l as hasPendingFollowupQueueWork } from "./state-DNPW_vEt.mjs";
import { n as resolveAgentIdentity } from "./identity-VQc9B4RO.mjs";
import { t as readAcpSessionMetaForEntries } from "./session-meta-readonly-CHaonIQO.mjs";
import { s as resolveAssistantIdentity } from "./assistant-avatar-DB_cUu5U.mjs";
import { d as withQualifiedGatewaySessionEntry, o as prepareDeletedAgentSessionCheck, u as withGatewaySessionEntry } from "./session-utils-store-lW7Wu3P0.mjs";
import { n as resolveSendPolicy } from "./send-policy-D88FrugM.mjs";
import { t as hasInboundAudio } from "./inbound-media-D9dVgt41.mjs";
import { r as MessageInjectionTargetUnavailableError, s as createMessageInjectionAuthority } from "./message-injection-authority-Mu3hgByB.mjs";
import { C as isReplyRunAbortableForSignal, L as resolveActiveReplyRunOwnerForSignal, et as REPLY_RUN_IDLE_SETTLE_TIMEOUT_MS } from "./reply-run-registry.state-Hn_UqZjq.mjs";
import { r as bindPreparedToolAuthority } from "./tool-authority-preparation-m_5xD16r.mjs";
import { M as finalizeReplyMessageInjectionAttempt, c as interruptReplyRunTarget, g as replyRunRegistry, j as beginReplyMessageInjectionTarget } from "./reply-run-registry.registry-CmcnzV4X.mjs";
import { n as chatRunBelongsToSelectedAgent, r as resolveChatRunOwnerAgentId } from "./chat-run-owner-BB6L4tWc.mjs";
import { r as listActiveEmbeddedRunSessionIds } from "./active-run-projections-Crpg2l0z.mjs";
import "./reply-run-registry-BFUfTf-U.mjs";
import { a as logMessageReceived, r as logMessageProcessed } from "./diagnostic-Dz-YV3uh.mjs";
import { r as hasTrackedActiveSessionRun } from "./session-active-runs-CAoWtmWT.mjs";
import { n as emitSessionsChanged } from "./session-change-event-0LxChmzi.mjs";
import { n as resolvePreparedSessionEntryResetFreshness, r as resolveSessionEntryResetFreshness } from "./entry-freshness-kcEsDHPL.mjs";
import { i as getAgentWorkspaceAccess } from "./workspace-access-sFz3TNTx.mjs";
import { i as describeFailoverError } from "./failover-error-Bjf0VdY2.mjs";
import { o as isMainSessionRecoveryReconciliationCandidate } from "./main-session-recovery-state-sCZeKFHp.mjs";
import { i as loadOrCreateProcessDeviceIdentityAsync } from "./device-identity-async-BBs_AIYT.mjs";
import { n as resolveOperatorSessionCreation } from "./session-creation-provenance-CZ3I7AOG.mjs";
import "./reply-payload-79LnOCyy.mjs";
import { t as formatForLog } from "./ws-log-BIFX57Bv.mjs";
import { t as chatAbortMarkerTimestampMs } from "./server-chat-state-BW_LW3dq.mjs";
import { t as boundedWorkerError } from "./worker-error-BrVatFit.mjs";
import { t as errorShapeFromError } from "./error-shape--ChVezuW.mjs";
import { t as finalizeInboundContext } from "./inbound-context-DnPzLOsP.mjs";
import "./media-reference-Dlq4zAi4.mjs";
import { r as warnLegacyAgentRunStart } from "./agent-run-start-T-2AGtR3.mjs";
import { r as resolveTextCommand } from "./commands-registry-normalize-BI2t-DKf.mjs";
import "./commands-registry-CFDGAPH8.mjs";
import { n as readAgentRunTerminalOutcome } from "./agent-run-terminal-outcome-BOQC0T2X.mjs";
import { i as dispatchInboundMessageWithProjectedDispatcher } from "./dispatch-CZQ0DxJx.mjs";
import { a as emitInboundMessageAuditTerminal, r as emitMessageReceivedHooks, s as DispatchSessionRefreshRequiredError } from "./dispatch-from-config-Cjo1kQIo.mjs";
import { c as REPLY_ADMISSION_TICKET, l as reserveReplyAdmissionTicket } from "./commentary-progress-owner-lEwttgd8.mjs";
import { n as runAgentHarnessBeforeMessageWriteHook } from "./hook-helpers-C0CV-oid.mjs";
import { w as prepareSessionWriterDeliveryAuthority } from "./delivery-queue-recovery-kH18x_75.mjs";
import { n as runWithAgentWorkspaceReadiness } from "./workspace-readiness-B5JSqS7C.mjs";
import { a as shouldComputeCommandAuthorized } from "./command-detection-D0j_OxtK.mjs";
import { t as isInternalSourceReplyChannel } from "./source-reply-delivery-mode-CrUQzco9.mjs";
import { r as retainsUserTurnTranscriptMedia, t as createUserTurnTranscriptRecorder } from "./user-turn-transcript-CtVHLnLR.mjs";
import { f as waitForChatAbortTerminalPersistence, s as markChatAbortTerminalOutcome } from "./chat-abort-lifecycle-internal-EU815r6Q.mjs";
import { n as appendChatCanvasBlocksToMessage, o as isToolHistoryBlockType } from "./chat-display-projection.canvas-CwC0V7fB.mjs";
import { c as resolveChatRunExpiresAtMs, i as registerChatAbortController, o as updateChatRunProvider, r as isChatAbortControllerEntryAbortable } from "./chat-abort-CKC_-urc.mjs";
import { c as resolveChatAbortDiagnosticReason, o as registerQueuedChatTurn, r as completeQueuedChatTurn, s as retireQueuedChatTurnCancellation } from "./chat-queued-turns-CBHBVpa_.mjs";
import { o as projectChatDisplayMessage } from "./chat-display-projection.core-DdRZ3VIg.mjs";
import { o as readSessionMessageByIdAsync } from "./session-transcript-readers-ChK_-oGN.mjs";
import { a as resolveEnvelopeFormatOptions } from "./envelope-CdZ9UA5I.mjs";
import { n as runOutsideOperatorToolGatewayAuthority } from "./operator-tool-gateway-authority-CgsnCzzP.mjs";
import { t as assertPreparedSkillLibrarySelection } from "./selection-B3qUGv_G.mjs";
import { o as transferGatewayLocalUserIngress } from "./local-user-ingress-CiTjOkNL.mjs";
import { s as resolveInboundReplyToolAuthorityOverlay } from "./reply-tool-authority-X6nNd9fP.mjs";
import { t as resolveQueueSettings } from "./queue-Cz-W2oxX.mjs";
import { t as recordSessionCreated } from "./session-created-CHLwCn_J.mjs";
import { t as DEVICE_FOLDER_ATTACHMENTS_UNSUPPORTED } from "./node-workspace-protocol-FKrTt4nR.mjs";
import { g as resolveExplicitOriginBindingTargets, h as resolveChatSendOriginatingRoute, m as isAcpBridgeClient, p as normalizeChatSendRequest } from "./session-create-root-lHgGqSce.mjs";
import { i as roundedChatSendTimingMs, n as prepareChatSendAckTiming, t as createOperatorChatSendServerTiming } from "./chat-server-timing-pbaeJzGd.mjs";
import { s as withCurrentUserTurnInput } from "./user-turn-transcript-runtime-context-T4-x_GL3.mjs";
import { n as resolveWebchatPromptCacheKey } from "./session-boundary-prompt-cache-key-xrPTEs08.mjs";
import "./chat-display-projection-CHqVAi8U.mjs";
import { n as buildInboundUserContextPrefix } from "./inbound-meta-Caq6o9f9.mjs";
import { t as buildInboundMediaNoteProjection } from "./media-note-CSBAq1ih.mjs";
import { t as recordAcceptedSessionParticipantInput } from "./session-participant-input-recording-DuQZzYOq.mjs";
import { t as createChannelReplyPipeline } from "./reply-pipeline-aTPs4FIz.mjs";
import { t as resolveSessionWorkerPlacementContext } from "./session-worker-placement-context-DJzLYZPW.mjs";
import { i as setGatewayDedupeEntry, t as captureAgentJobSession } from "./agent-job-CU2r4FPt.mjs";
import { t as createRestartRecoveryOperatorSource } from "./operator-run-recovery-source-Cq--QOeE.mjs";
import "./session-utils-CGx9I2of.mjs";
import { i as resolveAgentSessionWorkStartError } from "./agent-handler-helpers-BDkV_7rl.mjs";
import { n as resolveChatAttachmentMaxBytes } from "./chat-attachment-policy-B-jAIf5T.mjs";
import { t as prepareSteeringDelivery } from "./steering-delivery-preparation-BYnJZUvu.mjs";
import { n as attachManagedOutgoingMediaToMessage } from "./managed-image-attachments-BH_BBH6I.mjs";
import { a as hasManagedOutgoingAssistantContent, c as prepareAssistantDisplayText, i as hasAssistantDisplayMediaContent, l as sanitizeAssistantDisplayText, o as hasVisibleAssistantFinalMessage, r as extractAssistantDisplayText, s as isMediaBearingPayload, u as stripManagedOutgoingAssistantContentBlocks } from "./chat-assistant-content-D60Lu4da.mjs";
import { a as prepareWebchatReplyMediaForDisplay, c as readChatSendReplyPayload, l as replaceChatSendReplyPayload, n as captureWebchatReplyMediaScope, o as withPreparedWebchatReplyMedia, s as buildTranscriptReplyTextFromInputs, u as selectChatSendFinalReplyInputs } from "./chat-reply-media-D4qIbDgF.mjs";
import { a as publishAssistantTranscriptRewrite, c as rewriteSourceReplyTranscriptMirrors, o as rewriteAssistantTranscriptMessageByIdempotencyKey, s as rewriteAssistantTranscriptMessageByTurnIndexAndMedia, t as assistantTranscriptScope } from "./chat-transcript-persistence-ClpuE6I1.mjs";
import { a as broadcastSideResult, i as broadcastChatTerminal, n as broadcastChatError, o as isBtwReplyPayload, r as broadcastChatFinal, s as isSourceReplyTranscriptMirrorPayload, t as broadcastChatDelta } from "./chat-broadcast-CUWw-44C.mjs";
import { c as withAbortedPartialPersistenceWarning, n as abortedPartialPersistenceError } from "./chat-aborted-partial-BuPGs0tJ.mjs";
import { t as appendInjectedAssistantMessageToTranscript } from "./chat-transcript-inject-BjZUebz7.mjs";
import { a as logAttachmentFailure, c as stripImageMediaMarkers, i as discardPreparedInboundMedia, n as MediaOffloadError, o as parseMessageWithAttachments, r as UnsupportedAttachmentError, s as persistInboundImagesForTranscript, t as INLINE_IMAGE_DURABLE_OMISSION_MARKER } from "./chat-attachments-Bszv8fPA.mjs";
import { c as prepareSkillLibrarySessionCreation, r as prepareSessionWorkspace } from "./session-create-project-TKtfF63d.mjs";
import { n as createChatAbortOps } from "./chat-abort-ops-cs9Qjbw9.mjs";
import { i as resolveGatewayInputParticipant, l as retainGatewayOperatorRun, o as isDirectGatewayUserClient, r as prepareGatewaySkillLibraryTurn, t as invalidateSkillAuthoringForOtherRequester } from "./skill-library-authoring-DLJtuvj0.mjs";
import { t as resolveSessionMutationAuthorizationAsync } from "./session-sharing-authorization-async-DhG3gR3C.mjs";
import { a as captureGatewayClientUploadCommitGuard } from "./upload-policy-Bd2Za3Ho.mjs";
import { t as captureGatewayUiCommandTarget } from "./ui-command-target-WjDnJd4j.mjs";
import { n as readChatSendDiagnostics, r as startChatSendDiagnostics } from "./chat-send-diagnostics-uaVFgt_W.mjs";
import { n as pendingChatSendDedupeKey, t as PENDING_CHAT_SEND_DEDUPE_PREFIX } from "./server-shared-C-7Ahu3n.mjs";
import { a as descendantAbortError, g as writePreRegisteredChatAbort, m as resolveChatAbortRequester, o as buildAbortedChatSendPayload, p as readPreRegisteredRun, t as abortChatRunsForSessionKeyWithPartials } from "./chat-abort-runtime-BJzZinuj.mjs";
import { t as createAssistantCommentaryMediaCustody } from "./chat-send-commentary-media-CL21Thdk.mjs";
import { t as scheduleChatDashboardSessionTitle } from "./chat-send-background-BXQQYKy6.mjs";
import { a as resolveSessionNativeRuntimeRestriction } from "./sessions-patch-model-selection-HDHD8IDv.mjs";
import { t as publishCommittedSessionGoalChange } from "./session-goal-change-P0SBPF2r.mjs";
import { createHmac, randomUUID } from "node:crypto";
import path from "node:path";
import { isDeepStrictEqual } from "node:util";
import { performance } from "node:perf_hooks";
//#region src/config/sessions/goals-operations-read.ts
/** Durable ingress receipts precede transient dedupe and busy-session refusals. */
async function lookupSessionGoalOperation(options) {
	assertSessionGoalOperationTime(options.operation, Date.now());
	const memory = captureSessionActorStorageOwner(options, {
		assertCurrent() {},
		authorize() {}
	});
	if (memory) return withSessionActorStorage(options, {
		lifetime: {
			assertCurrent() {},
			assertReadable() {}
		},
		authority: memory.authority
	}, (binding) => binding.actor.storage.read({
		type: "session.goal.receipt",
		input: {
			sessionKey: binding.actor.target.sessionKey,
			expectedSessionId: options.expectedSessionId,
			operation: options.operation
		}
	}, binding.authority));
	const captured = {
		...options,
		...options.storePath ? { storePath: path.resolve(options.storePath) } : {},
		operation: { ...options.operation },
		env: captureSessionTranscriptStorageEnvironment(options.env ?? process.env)
	};
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
	const restart = resolveAgentRunErrorLifecycleFields(params.error, void 0).stopReason === "restart";
	const failureDisposition = restart ? "client-retry" : classifyAcceptedChatSendFailure({
		error: params.error,
		phase: "pre-ack"
	});
	if (restartSafeAdmission && !restart) {
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
		terminalEntry: jobSessionBinding,
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
	const broadcastError = (error) => {
		if (!hidden && (params.isReplyDispatchRun?.() || activeRunAbort.entry?.terminalOutcomeObserved !== true)) {
			if (error.stopReason === "restart") broadcastChatTerminal({
				terminalEntry: jobSessionBinding,
				context,
				runId: clientRunId,
				sessionKey,
				agentId,
				state: "aborted",
				stopReason: "restart"
			});
			else broadcastChatError({
				terminalEntry: jobSessionBinding,
				context,
				runId: clientRunId,
				sessionKey,
				agentId,
				...error
			});
		}
	};
	const handleError = async (err) => {
		const errorMessage = formatChatSendError(err);
		const errorKind = resolveStateContentionPresentation(err)?.errorKind;
		const failureDisposition = params.classifyFailure?.(err) ?? classifyAcceptedChatSendFailure({
			error: err,
			phase: "post-ack"
		});
		if (isQueuedFollowupEnqueued()) {
			context.logGateway.warn(`webchat dispatch failed after followup queue admission: ${formatForLog(err)}`);
			return;
		}
		const signalTermination = resolveAgentRunErrorLifecycleFields(activeRunAbort.controller.signal.reason, void 0);
		const terminationFields = signalTermination.stopReason ? signalTermination : resolveAgentRunErrorLifecycleFields(err, void 0);
		const abortedAtDispatchReject = activeRunAbort.controller.signal.aborted;
		const abortMarkerAtDispatchReject = context.chatRunState.runs.get(clientRunId)?.abortMarker;
		const agentTerminalOwnedAtDispatchReject = activeRunAbort.entry?.terminalOutcomeObserved === true;
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
		if (agentTerminalOwnedAtDispatchReject && activeRunAbort.entry) activeRunAbort.entry.isAbortable = () => false;
		activeRunAbort.cleanup();
		let restartSafeDispatchFailureTerminalized = false;
		if (restartSafeAdmission && !agentTerminalOwnedAtDispatchReject && terminationFields.stopReason !== "restart") {
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
		if (!suppressLifecycle && !restartSafeDispatchFailureTerminalized && abortMarkerAtDispatchReject === void 0 && !agentTerminalOwnedAtDispatchReject) pendingDispatchLifecycleError = {
			terminationFields,
			endedAt: Date.now(),
			error: errorMessage,
			errorKind,
			sessionId: activeRunAbort.entry?.sessionId ?? backingSessionId ?? clientRunId,
			startedAt: activeRunAbort.entry?.startedAtMs ?? now
		};
		if (!agentTerminalOwnedAtDispatchReject || params.isReplyDispatchRun?.()) {
			const publish = () => {
				const restart = terminationFields.stopReason === "restart";
				const error = errorShapeFromError(ErrorCodes.UNAVAILABLE, err, { message: errorMessage });
				setGatewayDedupeEntry({
					dedupe: context.dedupe,
					key: `chat:${clientRunId}`,
					session: captureAgentJobSession(jobSessionBinding),
					entry: {
						ts: Date.now(),
						ok: restart,
						payload: restart ? buildAbortedChatSendPayload({
							runId: clientRunId,
							stopReason: "restart",
							endedAt: pendingDispatchLifecycleError?.endedAt ?? Date.now()
						}) : {
							runId: clientRunId,
							status: "error",
							summary: errorMessage,
							...terminationFields
						},
						...restart ? {} : { error }
					}
				});
				broadcastError({
					errorMessage,
					errorKind,
					stopReason: terminationFields.stopReason
				});
			};
			if (pendingDispatchLifecycleError || params.isReplyDispatchRun?.()) publishDispatchError = publish;
			else publish();
		}
	};
	const settleTerminalPersistence = async () => {
		if (params.isReplyDispatchRun?.() && activeRunAbort.entry) await waitForChatAbortTerminalPersistence(activeRunAbort.entry).catch((error) => {
			context.logGateway.warn(`webchat terminal lifecycle settlement failed: ${formatForLog(error)}`);
		});
	};
	const finalize = async () => {
		await settleTerminalPersistence();
		const dispatchError = pendingDispatchLifecycleError;
		const clearRun = () => {
			if (!isQueuedFollowupEnqueued() && (!params.isAgentRunStarted() || params.isReplyDispatchRun?.())) {
				context.chatRunState.clearRun(clientRunId);
				context.agentRunSeq.delete(clientRunId);
			}
		};
		try {
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
				clearAgentRunContext(clientRunId, lifecycleGeneration);
				context.removeChatRun(clientRunId, clientRunId, sessionKey);
				return;
			}
			await persistDispatchErrorUserTurn?.().catch((transcriptErr) => {
				context.logGateway.warn(`webchat user transcript update failed after error: ${formatForLog(transcriptErr)}`);
			});
			clearAgentRunContext(clientRunId, lifecycleGeneration);
			context.removeChatRun(clientRunId, clientRunId, sessionKey);
			try {
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
								errorKind: dispatchError.errorKind,
								...dispatchError.terminationFields
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
			}
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
		broadcastError,
		finalize,
		handleError,
		settleTerminalPersistence,
		handleSettlementError(error) {
			context.logGateway.warn("webchat dispatch settlement failed: " + formatForLog(error));
		}
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
	const { agentId, cfg, entry, sessionKey, storePath, clientRunId } = params.session;
	const { ctx, isInternalTextSlashCommandTurn, replyOptionImages, replyOptionMedia } = params.turn;
	const assertCurrent = () => {
		params.abortSignal.throwIfAborted();
		params.assertCurrent?.();
		params.operatorAuthority?.assertCurrent();
	};
	return async () => {
		const target = params.target;
		if (!target || isInternalTextSlashCommandTurn) return;
		assertCurrent();
		const delivery = prepareSteeringDelivery({
			agentId,
			sessionKey,
			storePath,
			sessionId: entry?.sessionId,
			sourceTurnId: normalizeOptionalString(target.sourceTurnId),
			entry,
			assertCurrent
		});
		let handedOff = false;
		try {
			const canAdmit = () => {
				try {
					delivery.assertCurrent();
					return true;
				} catch (error) {
					if (!(error instanceof MessageInjectionTargetUnavailableError)) throw error;
					params.logGateway.warn("chat steering rejected; falling back to follow-up dispatch", {
						reason: "terminal-delivery-unavailable",
						runId: clientRunId,
						activeRunId: target.runId,
						sessionKey,
						error: error.message
					});
					return false;
				}
			};
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
			const authorization = await resolveCommandAuthorizationAsync({
				ctx,
				cfg,
				commandAuthorized: ctx.CommandAuthorized === true
			});
			try {
				await delivery.prepareCurrent();
			} catch (error) {
				assertCurrent();
				params.logGateway.warn("chat steering rejected; falling back to follow-up dispatch", {
					reason: "terminal-delivery-unavailable",
					runId: clientRunId,
					activeRunId: target.runId,
					sessionKey,
					error: String(error)
				});
				return;
			}
			let admissionRefused = false;
			const attempt = await beginReplyMessageInjectionTarget(target, p.replyToId ? buildChatSendReplyInjectionText({
				body: text,
				cfg,
				ctx,
				sessionEntry: entry
			}) : text, {
				currentInboundContext: p.replyToId ? void 0 : { text: buildInboundUserContextPrefix(ctx, resolveEnvelopeFormatOptions(cfg), entry) },
				canAdmit: () => {
					admissionRefused = !canAdmit();
					return !admissionRefused;
				},
				assertCurrent: params.assertCurrent || params.operatorAuthority ? assertCurrent : void 0,
				toolAuthorityPreparation: bindPreparedToolAuthority(bindWorkerToolPreparation({
					authorityKind: params.assertCurrent || params.operatorAuthority ? "source-bound" : "run",
					assertCurrent,
					compatAssertCurrent: assertCurrent,
					prepareCurrent: delivery.prepareCurrent
				})),
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
			attempt.outcome.then(() => delivery.release(), () => delivery.release());
			handedOff = true;
			return admissionRefused ? void 0 : attempt;
		} finally {
			if (!handedOff) delivery.release();
		}
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
/** Pre-ACK steering is already owned; join it before fallible source preparation. */
async function settleChatSendMessageInjection(attempt) {
	if (!attempt) return false;
	const outcome = await attempt.outcome;
	if (outcome.status === "failed") throw outcome.error;
	return outcome.status !== "rejected";
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
		inboundAudio: hasInboundAudio(finalizedCtx)
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
	const indeterminate = finalization.status === "indeterminate" ? finalization.outcome.errorMessage : void 0;
	const outcomeReason = indeterminate ? progressRefresh ? "progress_refresh_receipt_unconfirmed" : "question_response_indeterminate" : "active_run_injected";
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
			outcome: indeterminate ? "error" : "completed",
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
			terminalEntry: params.sessionBinding,
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
			agentId,
			terminalEntry: params.sessionBinding
		});
	}
	return true;
}
//#endregion
//#region src/gateway/server-methods/chat-send-reply-delivery.ts
/** Match prepared evidence to the current session without querying its transcript. */
function resolveChatReplyTranscriptStart(session, current, prepared) {
	const scope = {
		agentId: session.agentId,
		sessionKey: session.sessionKey,
		sessionId: current.entry?.sessionId ?? session.backingSessionId,
		storePath: current.storePath
	};
	if (prepared && (prepared.agentId !== scope.agentId || prepared.sessionId !== scope.sessionId || prepared.sessionKey !== scope.sessionKey || !isSameOpenClawAgentDatabasePath(prepared.storePath, scope.storePath))) return;
	const watermark = prepared ?? {
		generation: null,
		maxSeq: null
	};
	return {
		sessionId: scope.sessionId,
		generation: watermark.generation,
		afterSeq: watermark.maxSeq ?? 0
	};
}
/** Released SDK producers may still omit transcript facts until the next SDK major. */
function resolveLegacyChatReplyTranscriptStart(session, current) {
	warnLegacyAgentRunStart();
	const sessionId = current.entry?.sessionId ?? session.backingSessionId;
	return resolveChatReplyTranscriptStart(session, current, sessionId ? {
		agentId: session.agentId,
		sessionId,
		sessionKey: session.sessionKey,
		storePath: current.storePath,
		...readSessionTranscriptWatermark({
			agentId: session.agentId,
			sessionId,
			sessionKey: session.sessionKey,
			storePath: current.storePath
		})
	} : null);
}
/** Decide receipt coverage from one current anchor snapshot and the observed transcript bounds. */
function resolveChatReplyDeliveryFromAnchors(params) {
	const { facts, afterSeq, watermark, currentWatermark } = params;
	const admitted = facts.anchors.find((entry) => entry.entryId === params.admissionId);
	const input = facts.anchors.find((entry) => entry.entryId === params.inputId);
	const anchor = facts.anchors.find((entry) => entry.entryId === params.messageId);
	if (!admitted || !input) return "missing";
	if (!anchor || anchor.rawSeq <= afterSeq || anchor.activeMessagePosition <= input.activeMessagePosition) return;
	if (facts.tail?.entries.some((entry) => entry.role === "user" && entry.anchor && entry.anchor.activeMessagePosition > anchor.activeMessagePosition)) return "missing";
	if (currentWatermark.generation !== watermark.generation || currentWatermark.maxSeq !== watermark.maxSeq || anchor.generation !== currentWatermark.generation || facts.tail?.lastSeq !== currentWatermark.maxSeq) return "pending";
	return "delivered";
}
//#endregion
//#region src/gateway/server-methods/chat-send-delivery-authority.ts
async function createChatSendReplyFinalizationAuthority(params, payloads, onUnauthorized) {
	const { cfg, sessionKey, agentId, sessionLoadOptions } = params.session;
	const prepared = /* @__PURE__ */ new Map();
	try {
		for (const payload of payloads) {
			const authority = getReplyPayloadMetadata(payload)?.sessionWriterDeliveryAuthority;
			if (authority && !prepared.has(authority)) {
				const ownerAgentId = authority.agentId ?? agentId;
				prepared.set(authority, await prepareSessionWriterDeliveryAuthority({
					...authority,
					agentId: ownerAgentId
				}, ownerAgentId === agentId ? params.session.storePath : void 0));
			}
		}
	} catch (error) {
		for (const current of prepared.values()) current.release();
		throw error;
	}
	const mediaScopes = [];
	const deliveryAuthorized = () => (!params.isCurrent || params.isCurrent()) && payloads.every((payload) => {
		const authority = getReplyPayloadMetadata(payload)?.sessionWriterDeliveryAuthority;
		return isReplyPayloadSessionWriterDeliveryAuthorized(payload, authority ? prepared.get(authority)?.authority?.readCurrentSession?.() : void 0);
	});
	const authorizeDelivery = (stage) => {
		if (deliveryAuthorized()) return true;
		params.context.logGateway.warn(`webchat settled final reply skipped: session writer changed before ${stage}`);
		onUnauthorized?.();
		return false;
	};
	return {
		deliveryAuthorized,
		authorizeDelivery,
		release: () => {
			for (const scope of mediaScopes) scope.release();
			for (const current of prepared.values()) current.release();
		},
		captureMediaScope: async () => {
			try {
				const scope = await captureWebchatReplyMediaScope({
					cfg,
					sessionKey,
					agentId,
					sessionLoadOptions,
					requesterContext: params.requesterContext,
					accountId: params.accountId,
					assertCurrent: () => {
						if (!deliveryAuthorized()) throw new Error("Chat media delivery is no longer authorized.");
					}
				});
				mediaScopes.push(scope);
				return scope;
			} catch (error) {
				if (!authorizeDelivery("media preparation")) return;
				throw error;
			}
		}
	};
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
//#region src/gateway/server-methods/chat-send-reply-finalization.ts
const retainCommittedChatReplyMedia = (receipt, acceptCompletion) => {
	const blocks = readAssistantDisplayContent(receipt.message);
	if (hasManagedOutgoingAssistantContent(blocks)) acceptCompletion(async () => {
		await attachManagedOutgoingMediaToMessage({
			messageId: receipt.messageId,
			blocks
		});
	});
};
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
	const { context, deliveredReplies, emitFirstAssistantServerTiming, foldCommandBlocks, persistUserTurnTranscript, session, suppressReplies } = params;
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
			terminalEntry: params.terminalEntry,
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
	const { authorizeDelivery, captureMediaScope, release } = await createChatSendReplyFinalizationAuthority(params, rawFinalPayloads, () => broadcastChatFinal({
		context,
		runId: clientRunId,
		sessionKey,
		agentId,
		terminalEntry: params.terminalEntry
	}));
	try {
		const transcriptMirrorResolution = resolveTranscriptMirrorOwner(rawFinalPayloads);
		const transcriptMirrorOwner = transcriptMirrorResolution.kind === "owner" || transcriptMirrorResolution.kind === "blocked" ? transcriptMirrorResolution.owner : void 0;
		const mediaScope = await captureMediaScope();
		if (!mediaScope) return;
		const sourceSession = await loadGatewaySessionEntryReadOnlyInWorker({
			cfg: context.getRuntimeConfig(),
			key: sessionKey,
			...sessionLoadOptions,
			projection: []
		});
		const requestedTranscriptSession = transcriptMirrorOwner ? await loadGatewaySessionEntryReadOnlyInWorker({
			cfg: context.getRuntimeConfig(),
			key: transcriptMirrorOwner.sessionKey,
			...sessionLoadOptions,
			...transcriptMirrorOwner.agentId ? { agentId: transcriptMirrorOwner.agentId } : {},
			projection: []
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
		const { payloads: finalPayloads, inputs: finalInputs, mediaMessage, assistantContent, persistedAssistantContent, broadcastContent: broadcastAssistantContent, managedMediaPrepareFailed } = await prepareWebchatReplyMediaForDisplay({
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
			logGateway: context.logGateway
		});
		const ttsSupplementMarker = finalPayloads.map((payload) => buildMediaOnlyTtsSupplementTranscriptMarker(payload)).find((marker) => Boolean(marker));
		const persistedContentForAppend = hasAssistantDisplayMediaContent(persistedAssistantContent) ? persistedAssistantContent : void 0;
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
				onMessageCommitted: retainCommittedChatReplyMedia
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
			terminalEntry: params.terminalEntry,
			context,
			runId: clientRunId,
			sessionKey,
			agentId,
			message,
			state: params.state,
			stopReason: params.stopReason
		});
	} finally {
		release();
	}
}
//#endregion
//#region src/gateway/server-methods/chat-send-reply-session.ts
/** Initialization owns the start binding; later delivery decisions read fresh stored rows. */
function createChatReplySessionReader(session, getRuntimeConfig, assertWorkCurrent) {
	const initialStorePath = session.storePath ?? resolveSessionStorePathCore(session.cfg.session?.store, { agentId: session.agentId });
	let preparedSession = {
		sessionKey: session.sessionKey,
		sessionId: session.entry?.sessionId ?? session.backingSessionId,
		lifecycleRevision: session.entry?.lifecycleRevision,
		storePath: initialStorePath
	};
	const target = session.sessionTarget;
	const source = target?.readSource;
	const borrowed = target && source && typeof source.databaseIdentity === "string" && assertWorkCurrent && target.storeKeys.length === 1 && target.storeKeys[0] === target.storeKey && session.capturedReadSources?.length === 1 && isDeepStrictEqual(session.capturedReadSources[0], source) ? {
		target,
		source: {
			...source,
			databaseIdentity: source.databaseIdentity
		},
		assertWorkCurrent
	} : void 0;
	const assertBorrowedRouting = captureSessionMutationRouting(session.cfg, void 0, [session]);
	const assertRetainedSourceCurrent = borrowed ? () => {
		borrowed.assertWorkCurrent();
		assertBorrowedRouting(getRuntimeConfig());
	} : void 0;
	return {
		assertRetainedSourceCurrent,
		notePreparedSession(binding) {
			if (binding.sessionKey === session.sessionKey) preparedSession = { ...binding };
		},
		captureTranscriptStart(prepared) {
			const current = {
				entry: preparedSession,
				storePath: preparedSession.storePath ?? initialStorePath
			};
			const start = prepared === void 0 ? resolveLegacyChatReplyTranscriptStart(session, current) : resolveChatReplyTranscriptStart(session, current, prepared);
			return start ? {
				...start,
				lifecycleRevision: preparedSession.lifecycleRevision
			} : void 0;
		},
		async readCurrentSession(key = session.sessionKey, agentId = session.agentId) {
			const cfg = getRuntimeConfig();
			if (borrowed && assertRetainedSourceCurrent && key === session.sessionKey && agentId === session.agentId) {
				const assertCurrent = assertRetainedSourceCurrent;
				assertCurrent();
				return withQualifiedGatewaySessionStoreTarget({
					target: borrowed.target,
					logicalStorePath: initialStorePath,
					preparedSource: {
						...borrowed.source,
						assertCurrent
					},
					includeMembership: false,
					readOptions: { projection: "exact" },
					consume: (selected, _membership, assertSourceCurrent) => {
						assertSourceCurrent();
						assertCurrent();
						omitInternalSessionEffectsEntries(selected.store, selected.storeKeys);
						const match = findCanonicalStoreMatch(selected.store, selected.storeKeys);
						return {
							...selected,
							cfg,
							entry: match?.entry,
							legacyKey: match?.key !== selected.canonicalKey ? match?.key : void 0
						};
					}
				});
			}
			const assertRoutingCurrent = captureSessionMutationRouting(cfg, void 0, [{
				sessionKey: key,
				agentId
			}]);
			return await loadGatewaySessionEntryReadOnlyInWorker({
				...session.sessionLoadOptions,
				cfg,
				key,
				excludeInternalEffects: true,
				agentId,
				assertActive: () => assertRoutingCurrent(getRuntimeConfig())
			});
		}
	};
}
//#endregion
//#region src/gateway/server-methods/chat-send-reply-dispatch.ts
/** Build delivery options and capture state for the core-owned webchat dispatcher. */
function createChatSendReplyDispatch(params) {
	const { accountId, getRuntimeConfig, isAgentRunStarted, logGateway, session, userTurnRecorder } = params;
	const { backingSessionId, cfg, clientRunId } = session;
	const sessionLoadOptions = {
		...session.sessionLoadOptions,
		clone: false
	};
	const { notePreparedSession, readCurrentSession, captureTranscriptStart, assertRetainedSourceCurrent } = createChatReplySessionReader(session, getRuntimeConfig, params.assertWorkCurrent);
	let assistantTranscriptRewriteState;
	let agentRunId = clientRunId;
	const captureAgentTranscriptStart = (runId = clientRunId, prepared) => {
		agentRunId = runId;
		const transcriptStart = captureTranscriptStart(prepared);
		assistantTranscriptRewriteState = transcriptStart;
		return transcriptStart !== void 0;
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
		session: {
			...session,
			storePath: session.storePath ?? resolveSessionStorePathCore(cfg.session?.store, { agentId: session.agentId })
		},
		accountId,
		getRunId: () => agentRunId,
		isCurrent: () => isAgentRunStarted() && params.isRunCurrent?.() === true,
		abortSignal: params.abortSignal,
		logGateway,
		prepareAssistantTranscriptMessage: params.prepareAssistantTranscriptMessage
	});
	const resolveReplyDeliveryFacts = async (minimumAssistantMessageIndex = 0) => {
		const source = session.sessionTarget?.readSource;
		const retainedSource = assertRetainedSourceCurrent && source ? retainSessionHistoryWorkerDatabase({
			agentId: source.agentId,
			path: source.path
		}) : void 0;
		try {
			const admission = userTurnRecorder.getAdmissionReceipt();
			const transcriptStart = assistantTranscriptRewriteState;
			const runId = agentRunId;
			const lifecycleRevision = transcriptStart?.lifecycleRevision;
			const reader = admission && getOwnedSessionTranscriptReader(admission);
			const isRunCurrent = () => {
				const currentAdmission = userTurnRecorder.getAdmissionReceipt();
				return Boolean(admission && admission.agentId === session.agentId && admission.sessionKey === session.sessionKey && isAgentRunStarted() && params.isRunCurrent?.() === true && !params.abortSignal?.aborted && agentRunId === runId && assistantTranscriptRewriteState === transcriptStart && currentAdmission?.logicalTurnId === admission.logicalTurnId && currentAdmission?.entryId === admission.entryId);
			};
			const isInspectionCurrent = () => {
				if (!isRunCurrent()) return false;
				assertRetainedSourceCurrent?.();
				retainedSource?.owner.assertCurrent();
				reader?.assertCurrent();
				return true;
			};
			const isCurrent = async () => {
				if (!admission || !isRunCurrent()) return false;
				const current = await readCurrentSession();
				return isRunCurrent() && current.entry?.sessionId === admission.sessionId && current.entry.lifecycleRevision === lifecycleRevision && resolveSessionTranscriptDatabasePath({
					agentId: session.agentId,
					sessionId: admission.sessionId,
					sessionKey: session.sessionKey,
					storePath: current.storePath
				}) === admission.storePath;
			};
			if (!admission || !transcriptStart || transcriptStart.sessionId !== admission.sessionId || !(reader ? isInspectionCurrent() : await isCurrent())) return {
				source: "missing",
				terminal: "missing"
			};
			const scope = admission;
			await waitForSessionTranscriptProjection(scope, params.abortSignal);
			if (!(reader || assertRetainedSourceCurrent ? isInspectionCurrent() : await isCurrent())) return {
				source: "missing",
				terminal: "missing"
			};
			const assertRoutingCurrent = captureSessionMutationRouting(getRuntimeConfig(), void 0, [scope]);
			let decision = "pending";
			let sourceDecision = "missing";
			await readSessionTranscriptAnchorsAsync(scope, {
				entryIds: [admission.entryId],
				afterSeq: transcriptStart.afterSeq,
				includeSession: true,
				includeWatermark: true,
				includeMessagesForRunId: runId
			}, params.abortSignal, (facts) => {
				assertRoutingCurrent(getRuntimeConfig());
				if (!isInspectionCurrent() || facts.session?.sessionId !== admission.sessionId || facts.session.lifecycleRevision !== lifecycleRevision || !facts.watermark) {
					decision = "missing";
					return;
				}
				const input = facts.anchors.find((anchor) => anchor.entryId === admission.entryId);
				if (!input || input.rawSeq !== admission.rawSeq) {
					decision = "missing";
					return;
				}
				let latestInput = input;
				for (const row of facts.tail?.entries ?? []) if (row.role === "user" && row.anchor && row.anchor.activeMessagePosition > latestInput.activeMessagePosition) latestInput = row.anchor;
				if (minimumAssistantMessageIndex > 0 && latestInput.entryId === input.entryId) {
					decision = "missing";
					return;
				}
				decision = "missing";
				for (const row of facts.tail?.entries ?? []) {
					const message = asOptionalRecord(row.message);
					if (message?.role !== "assistant" || readSessionTranscriptRunId(message) !== runId) continue;
					const answer = message.stopReason === "toolUse" || Array.isArray(message.content) && message.content.some((block) => isToolHistoryBlockType(asOptionalRecord(block)?.type)) ? extractAssistantTextForPhase(message, { phase: "final_answer" }) : extractAssistantPhaseText(message);
					if (!answer || isSuppressedControlReplyText(answer) || !extractAssistantPhaseText(projectChatDisplayMessage(message))) continue;
					const selected = resolveChatReplyDeliveryFromAnchors({
						facts,
						admissionId: admission.entryId,
						inputId: latestInput.entryId,
						messageId: row.entryId,
						afterSeq: transcriptStart.afterSeq,
						watermark: facts.watermark,
						currentWatermark: facts.watermark
					});
					if (selected !== void 0) {
						decision = selected;
						const mirror = asOptionalRecord(message.openclawDeliveryMirror);
						if (mirror?.kind === "message-tool-source-reply" && mirror.final === true) {
							sourceDecision = selected;
							return;
						}
					}
				}
			});
			assertRoutingCurrent(getRuntimeConfig());
			return isInspectionCurrent() ? {
				source: sourceDecision,
				terminal: decision
			} : {
				source: "missing",
				terminal: "missing"
			};
		} finally {
			retainedSource?.release();
		}
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
		const mediaScope = await captureWebchatReplyMediaScope({
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
		try {
			const { storePath: latestStorePath, entry: latestEntry } = await readCurrentSession(sessionKey, agentId);
			const sessionId = latestEntry?.sessionId ?? backingSessionId ?? clientRunId;
			const { payloads: [transcriptPayload], inputs: transcriptInputs, mediaMessage, assistantContent, persistedAssistantContent, mediaBySource } = await prepareWebchatReplyMediaForDisplay({
				scope: mediaScope,
				storePath: latestStorePath,
				inputs: replaceChatSendReplyPayload(input, stripVisibleTextFromTtsSupplement(payload)),
				abortSignal: params.abortSignal,
				includeSensitiveMedia: payload.sensitiveMedia !== true,
				logGateway
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
				if (transcript && (await readCurrentSession(sessionKey, agentId)).entry?.sessionId !== transcript.sessionId) {
					logGateway.warn("webchat runtime-owned media skipped: transcript session changed");
					return;
				}
				rewritten = await rewriteAssistantTranscriptMessageByIdempotencyKey({
					content: persistedContentForAppend,
					mediaBySource,
					idempotencyKey: ownedTranscriptIdempotencyKey,
					managedMediaUrls: sourceMediaUrls,
					scope: transcriptScope
				});
				if (!rewritten) {
					logGateway.warn("webchat runtime-owned assistant media rewrite skipped: transcript identity not found");
					return;
				}
			} else if (assistantMessageIndex !== void 0 && transcriptScope) {
				if (assistantTranscriptRewriteState?.sessionId !== sessionId) return;
				const indexedRewrite = await rewriteAssistantTranscriptMessageByTurnIndexAndMedia({
					afterSeq: assistantTranscriptRewriteState.afterSeq,
					assistantMessageIndex,
					content: persistedContentForAppend,
					mediaBySource,
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
				onMessageCommitted: retainCommittedChatReplyMedia
			});
			if (appended.ok) {
				finalizedAgentMediaTranscriptKeys.add(finalizationKey);
				return;
			}
			logGateway.warn(`webchat transcript append failed for media reply: ${appended.error ?? "unknown error"}`);
		} finally {
			mediaScope.release();
		}
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
				if (commentaryRewrite && assistantTranscriptRewriteState && commentaryRewrite.sessionId === assistantTranscriptRewriteState.sessionId) assistantTranscriptRewriteState.generation = commentaryRewrite.generation;
				await finalizeAgentMediaTranscript();
			}
		});
	};
	return {
		captureAgentTranscriptStart,
		notePreparedSession,
		deliveredReplies,
		dispatcherOptions,
		hasAppendedWebchatAgentMedia: () => finalizedAgentMediaTranscriptKeys.size > 0,
		onModelSelected,
		prepareAssistantTranscriptMessage: commentaryMedia.prepareAssistantTranscriptMessage,
		resolveReplyDelivery: async (minimumAssistantMessageIndex) => (await resolveReplyDeliveryFacts(minimumAssistantMessageIndex)).terminal,
		resolveReplyDeliveryFacts,
		runAgentMediaTranscript
	};
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
	return async ({ runId: runtimeRunId, clientRunId: runId, payloads, completion, isCurrent }) => {
		const { context, session } = params;
		const broadcastParams = {
			terminalEntry: runId === session.clientRunId ? params.terminalEntry : void 0,
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
				publishMessage: (message, deliveryAuthorized, releaseAuthority) => {
					publicationStarted = true;
					if (completion.kind === "progress") {
						const text = typeof message?.text === "string" ? message.text : void 0;
						if (text) {
							const run = context.chatRunState.getOrCreate(runId);
							run.releaseBufferAuthority?.();
							run.releaseBufferAuthority = releaseAuthority;
							broadcastChatDelta({
								...broadcastParams,
								text,
								isCurrent: () => context.chatRunState.runs.get(runId) === run && deliveryAuthorized()
							});
							return true;
						}
					} else {
						const run = context.chatRunState.runs.get(runId);
						const canvas = run?.bufferIsCurrent?.() === false ? [] : run?.canvasBlocks ?? [];
						broadcastChatTerminal({
							...broadcastParams,
							state: "final",
							message: appendChatCanvasBlocksToMessage(message ?? (canvas.length ? {
								role: "assistant",
								content: [],
								timestamp: Date.now()
							} : void 0), canvas),
							stopReason: completion.stopReason
						});
					}
					return false;
				}
			});
			if (!isCurrent()) return {
				kind: "dropped",
				reason: "no-visible-content"
			};
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
			if (terminal && !publicationStarted && isCurrent()) {
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
				context.removeChatRun(runtimeRunId, runId, session.sessionKey);
				if (isCurrent()) {
					context.chatRunState.clearRun(runId);
					context.agentRunSeq.delete(runId);
				}
				context.agentRunSeq.delete(runtimeRunId);
			}
		}
	};
}
async function finalizeChatSendAgentReplyPayloads(params) {
	const { context, emitFirstAssistantServerTiming, session } = params;
	const { agentId, backingSessionId, clientRunId, sessionKey, sessionLoadOptions } = session;
	const agentRunReplyPayloads = params.inputs.map(readChatSendReplyPayload);
	if (agentRunReplyPayloads.length === 0) return {
		kind: "dropped",
		reason: "no-visible-content"
	};
	const { deliveryAuthorized, authorizeDelivery, captureMediaScope, release } = await createChatSendReplyFinalizationAuthority(params, agentRunReplyPayloads);
	let authorityTransferred = false;
	try {
		const hasSourceReplyTranscriptMirror = agentRunReplyPayloads.some(isSourceReplyTranscriptMirrorPayload);
		const mediaScope = await captureMediaScope();
		if (!mediaScope) return {
			kind: "dropped",
			reason: "no-visible-content"
		};
		const { storePath: latestStorePath, entry: latestEntry } = await loadGatewaySessionEntryReadOnlyInWorker({
			cfg: context.getRuntimeConfig(),
			key: sessionKey,
			...sessionLoadOptions,
			projection: []
		});
		const sessionId = latestEntry?.sessionId ?? backingSessionId ?? clientRunId;
		const sourceReplyScope = assistantTranscriptScope({
			sessionId,
			sessionKey,
			storePath: latestStorePath,
			agentId
		});
		const committedSourceContent = await Promise.all(agentRunReplyPayloads.map(async (payload) => {
			const mirror = getReplyPayloadMetadata(payload)?.sourceReplyTranscriptMirror;
			if (!sourceReplyScope || !mirror?.transcriptOwner || !mirror.idempotencyKey) return;
			const found = await findTranscriptEvent(sourceReplyScope, {
				kind: "idempotency",
				key: mirror.idempotencyKey,
				deliveryMirror: true
			});
			mediaScope.assertCurrent();
			const messageId = found && readTranscriptEventId(found.event);
			if (!messageId) return;
			const { anchors } = await readSessionTranscriptAnchorsAsync({
				...sourceReplyScope,
				sessionKey
			}, { entryIds: [messageId] }, params.abortSignal);
			mediaScope.assertCurrent();
			const content = readAssistantDisplayContent(readTranscriptEventMessage(found.event));
			return anchors.length > 0 && content.length > 0 ? content : void 0;
		}));
		mediaScope.assertCurrent();
		const hasCommittedSourceReply = committedSourceContent.some(Boolean);
		const { finalInputsByIndex, sourceReplyContentStates, sourceReplyBroadcastContent } = await withPreparedWebchatReplyMedia({
			scope: mediaScope,
			storePath: latestStorePath,
			inputs: params.inputs.filter((_, index) => !committedSourceContent[index]),
			abortSignal: params.abortSignal,
			includeSensitiveMedia: false,
			logGateway: context.logGateway
		}, async ({ payloads: normalizedPayloads, inputsByIndex, buildContent }) => {
			const contentStates = [];
			const broadcastContent = [];
			let preparedIndex = 0;
			for (const [replyIndex] of agentRunReplyPayloads.entries()) {
				const committedContent = committedSourceContent[replyIndex];
				if (committedContent) {
					contentStates[replyIndex] = {
						broadcastContent: [],
						persistedContent: committedContent,
						hasManagedOutgoingContent: hasManagedOutgoingAssistantContent(committedContent),
						backedManagedOutgoingContent: true
					};
					continue;
				}
				const inputIndex = preparedIndex++;
				if (!normalizedPayloads[inputIndex]) continue;
				const { persistedAssistantContent: persistedContent, broadcastContent: replyBroadcastContent } = await buildContent(inputsByIndex[inputIndex] ?? []);
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
		if (!sourceReplyBroadcastContent.length && !displayReply && !hasCommittedSourceReply) return {
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
			if (!state.backedManagedOutgoingContent && hasAssistantDisplayMediaContent(state.persistedContent)) {
				if (!state.hasManagedOutgoingContent) state.backedManagedOutgoingContent = true;
				sourceReplyPersistenceRequests.push({
					...candidate,
					state
				});
			}
		}
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
		const message = sourceReplyContent.length || sourceReplyText ? {
			role: "assistant",
			content: sourceReplyContent.length ? sourceReplyContent : [{
				type: "text",
				text: sourceReplyText
			}],
			...sourceReplyText ? { text: sourceReplyText } : {},
			timestamp: Date.now(),
			stopReason: "stop",
			usage: {
				input: 0,
				output: 0,
				totalTokens: 0
			}
		} : void 0;
		if (!params.suppressFinal) {
			if (!authorizeDelivery("broadcast")) return {
				kind: "dropped",
				reason: "no-visible-content"
			};
			if (hasVisibleAssistantFinalMessage(message)) emitFirstAssistantServerTiming();
			if (params.publishMessage) authorityTransferred = params.publishMessage(message, deliveryAuthorized, release);
			else broadcastChatFinal({
				terminalEntry: params.terminalEntry,
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
	} catch (error) {
		if (!authorizeDelivery("reply finalization")) return {
			kind: "dropped",
			reason: "no-visible-content"
		};
		throw error;
	} finally {
		if (!authorityTransferred) release();
	}
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
		if (settle && batch.completion.kind !== "progress") {
			terminal = "settled";
			if (reason === "non-webchat-origin" || reason === "origin-mismatch") params.onTerminalDrop?.(batch.completion);
		}
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
					clientRunId: params.retainSourceIdentity === false ? batch.runId : params.runId,
					isCurrent: () => terminal === "deliver"
				});
				return;
			}
			terminal = "delivering";
			try {
				const result = await params.deliver({
					...batch,
					clientRunId: params.retainSourceIdentity === false ? batch.runId : params.runId,
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
				const retry = createChatSendLateFollowupDisposition({
					...params,
					retainSourceIdentity: false,
					onTerminalDrop: void 0
				});
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
	let steered = false;
	const ownsQueueIdentity = () => {
		const current = params.chatQueuedTurns.get(params.runId);
		return !current || current.controller === params.controller;
	};
	let adoptionStarted = false;
	let withdrawalHold;
	let releaseWorkAdmission;
	const recordQueuedTerminal = (completion, publish = false) => {
		if (terminalKnown || !ownsQueueIdentity()) return;
		terminalKnown = true;
		markChatAbortTerminalOutcome(params.sessionBinding);
		const now = Date.now();
		const failed = completion.kind === "failed";
		setGatewayDedupeEntry({
			dedupe: params.context.dedupe,
			key: `chat:${params.runId}`,
			session: captureAgentJobSession(params.sessionBinding),
			entry: {
				ts: now,
				ok: !failed,
				payload: completion.kind === "aborted" ? buildAbortedChatSendPayload({
					runId: params.runId,
					endedAt: now,
					stopReason: completion.stopReason
				}) : {
					runId: params.runId,
					status: failed ? completion.errorKind ?? "error" : "completed",
					endedAt: now,
					stopReason: completion.stopReason,
					...failed ? { summary: completion.error } : {}
				}
			}
		});
		if (publish && !params.suppressReplies) broadcastChatTerminal({
			terminalEntry: params.sessionBinding,
			context: params.context,
			runId: params.runId,
			sessionKey: params.sessionKey,
			agentId: params.agentId,
			stopReason: completion.stopReason,
			...failed ? {
				state: "error",
				errorMessage: completion.error,
				errorKind: completion.errorKind
			} : { state: completion.kind === "aborted" ? "aborted" : "final" }
		});
	};
	const recordQueuedAbort = (publish) => recordQueuedTerminal({
		kind: "aborted",
		stopReason: params.sessionBinding.abortStopReason ?? resolveAgentRunAbortLifecycleFields(params.controller.signal).stopReason
	}, publish);
	const finalizeReply = params.suppressReplies ? void 0 : createChatSendLateReplyFinalizer({
		terminalEntry: params.sessionBinding,
		requesterContext: params.requesterContext,
		abortSignal: params.controller.signal,
		accountId: params.accountId,
		context: params.context,
		session: params.session
	});
	const lateFollowup = createChatSendLateFollowupDisposition({
		runId: params.runId,
		originatingChannel: params.originatingChannel,
		logGateway: params.context.logGateway,
		onTerminalDrop: (completion) => recordQueuedTerminal(completion, true),
		deliver: async (batch) => {
			if (batch.clientRunId === params.runId && batch.completion.kind !== "progress" && batch.isCurrent() && ownsQueueIdentity()) markChatAbortTerminalOutcome(params.sessionBinding);
			try {
				const result = finalizeReply ? await finalizeReply({
					...batch,
					isCurrent: () => batch.isCurrent() && ownsQueueIdentity() && (batch.clientRunId !== params.runId || !terminalKnown)
				}) : {
					kind: "dropped",
					reason: "no-visible-content"
				};
				if (batch.clientRunId === params.runId && batch.completion.kind !== "progress") recordQueuedTerminal(batch.completion);
				return result;
			} catch (error) {
				if (batch.clientRunId === params.runId && batch.completion.kind !== "progress") recordQueuedTerminal({
					kind: "failed",
					error: String(error)
				});
				throw error;
			}
		}
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
					if (!adoptionStarted) recordQueuedAbort(!params.context.chatAbortControllers.has(params.runId));
					params.releaseSourceWorkAdmission();
					releaseWorkAdmission?.();
					releaseWorkAdmission = void 0;
				}
			});
			if (enqueued && !releaseWorkAdmission) releaseWorkAdmission = params.retainWorkAdmission();
			if (enqueued) {
				setGatewayDedupeEntry({
					dedupe: params.context.dedupe,
					key: `chat:${params.runId}`,
					session: captureAgentJobSession(params.sessionBinding),
					entry: {
						ts: Date.now(),
						ok: true,
						payload: {
							runId: params.runId,
							status: "accepted"
						}
					}
				});
				lateFollowup.recordQueued();
				params.armOperatorRunCancellation?.();
			}
			return enqueued;
		},
		onCancellationRetired: () => {
			if (retireQueuedChatTurnCancellation(params.chatQueuedTurns, params.runId, params.controller)) params.retireOperatorRunCancellation?.();
		},
		onAbandoned: () => {
			recordQueuedTerminal({
				kind: "aborted",
				stopReason: "aborted"
			}, true);
		},
		onSettled: () => {
			const ownsCompletion = completeQueuedChatTurn(params.chatQueuedTurns, params.runId, params.controller);
			try {
				if (ownsCompletion) params.retireOperatorRunCancellation?.();
				if (!terminalKnown && params.controller.signal.aborted && (params.suppressReplies || !params.context.chatAbortControllers.has(params.runId))) recordQueuedAbort(true);
				if (ownsCompletion && !terminalKnown) {
					enqueued = false;
					steered = true;
				}
			} finally {
				releaseWorkAdmission?.();
				releaseWorkAdmission = void 0;
			}
		}
	};
	return {
		lifecycle,
		isEnqueued: () => enqueued,
		isTerminal: () => terminalKnown,
		isSteered: () => steered,
		onRunStarted: (runId) => {
			if (enqueued && !terminalKnown && ownsQueueIdentity() && lateFollowup.deliver.ownsCompletion(params.originatingChannel)) params.context.addChatRun(runId, {
				sessionKey: params.sessionKey,
				agentId: params.agentId,
				clientRunId: params.runId
			});
		},
		onQueueDisposition: (reason) => {
			recordQueuedTerminal({
				kind: "failed",
				error: `Queued input was dropped (${reason}).`
			}, true);
			params.context.logGateway.info("chat queue turn intentionally skipped", {
				runId: params.runId,
				sessionKey: params.sessionKey,
				outcome: "skipped",
				reason
			});
		},
		onQueuedFollowupReplyBatch: Object.assign(async (batch) => {
			if (!terminalKnown && ownsQueueIdentity()) await lateFollowup.deliver(batch);
		}, lateFollowup.deliver)
	};
}
//#endregion
//#region src/gateway/server-methods/chat-send-user-turn.ts
function resolveChatSendManagedMedia(entries, suppressPromptHydration = false) {
	return entries.map((entry) => ({
		path: entry.path,
		contentType: entry.fact.contentType ?? "application/octet-stream",
		...entry.fact.fileName ? { fileName: entry.fact.fileName } : {},
		...suppressPromptHydration && (entry.imageKind === "inline" || entry.imageKind === "offloaded") ? { hydrationSuppressed: true } : {}
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
	const persistedMediaForTranscriptPromise = (async () => {
		if (attachments.parsedImages.length === 0 && attachments.offloadedRefs.length === 0 || isAcpBridgeClient(client)) return {
			entries: [],
			omission: "none"
		};
		return await persistInboundImagesForTranscript({
			images: attachments.parsedImages,
			offloadedRefs: attachments.offloadedRefs,
			log: logGateway,
			logContext: "chat.send",
			assertCurrent: () => {
				admission.assertWorkAdmissionCurrent?.();
				admission.assertClientUploadAllowed?.();
			}
		});
	})();
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
	const pluginBoundMediaPromise = persistedMediaForTranscriptPromise.then((result) => resolveChatSendManagedMedia(result.entries.filter((entry) => attachments.explicitOriginTargetsPlugin || entry.imageKind === "inline" || entry.imageKind === "offloaded" && !attachments.mediaPathOffloads.some((fact) => fact.contentType?.startsWith("image/"))), !attachments.explicitOriginTargetsPlugin));
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
	const creation = resolveOperatorSessionCreation(client);
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
		prepareSessionCreation: async (library) => {
			if (!request.systemInputProvenance) {
				const prepared = await prepareSkillLibrarySessionCreation(client, params.getConfig ?? session.cfg ?? {}, creation, library);
				admission.assertWorkAdmissionCurrent?.();
				ctx.SessionCreation = {
					...prepared,
					...sandbox ? { sandbox } : {}
				};
			}
		},
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
	const { replyAdmissionTicket, diagnostics, admissionStartedAt, admission, attachments, client, context, toolsAllow, skillLibrary, cronCreatorAuthority, assertDashboardReadCurrent, externalAuthorityAdmission, injection, request, session, terminalizeRestartSafeAdmission, turn, userTurn } = params;
	const { imageOrder } = attachments;
	const progressRefresh = isProgressCardRefreshInputProvenance(request.systemInputProvenance);
	const { activeRunAbort, admittedSessionId, chatSendTraceAttributes, gatewayWorkAdmission, messageInjectionTarget, retainGatewayWorkAdmission, restartSafeAdmission, sessionBinding } = admission;
	const { activeRunScopeKey, agentId, cfg, clientRunId, entry, expectedLeafEntryId, resolvedSessionModel, storePath, selectedAgent, sessionKey } = session;
	const { clientInfo, p, supportsTaskSuggestions } = request;
	const { accountId, ctx, isInternalTextSlashCommandTurn, managedMediaApplyMode, pluginBoundMediaPromise, queuedFollowupOwnerKey, replyOptionImages, replyOptionMedia } = turn;
	const { persist: persistGatewayUserTurnTranscript, persistBestEffort: persistGatewayUserTurnTranscriptBestEffort, recorder: userTurnRecorder } = userTurn;
	const { beginCapturedMessageInjection, preAckReplyContextPromise, replyContextFieldsPromise } = injection;
	let { messageInjectionAttempt } = injection;
	const titleTurn = createDeferredCore();
	let agentRunStarted = false;
	let replyDispatchRun;
	const isRunCurrent = () => !activeRunAbort.controller.signal.aborted && context.chatAbortControllers.get(clientRunId) === activeRunAbort.entry;
	const replyDispatch = createChatSendReplyDispatch({
		getRuntimeConfig: context.getRuntimeConfig,
		assertWorkCurrent: admission.assertWorkAdmissionCurrent,
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
		isQueuedFollowupEnqueued: () => queuedFollowup.isEnqueued() || queuedFollowup.isTerminal(),
		persistUserTurnTranscript: persistGatewayUserTurnTranscript,
		session,
		terminalizeRestartSafeAdmission,
		userTurnRecorder,
		isReplyDispatchRun: () => replyDispatchRun !== void 0
	});
	const { emit: emitServerTiming, emitFirstAssistant: emitFirstAssistantServerTiming, dispatchStartedAtMs } = createOperatorChatSendServerTiming(params);
	emitServerTiming("dispatch-started");
	const dispatchAdmission = { run: (operation) => gatewayWorkAdmission.run(async () => {
		acceptedMessageInjection = await settleChatSendMessageInjection(messageInjectionAttempt);
		return await (acceptedMessageInjection ? operation() : withCurrentUserTurnInput(userTurnRecorder, operation));
	}) };
	const dashboardReadAdmission = assertDashboardReadCurrent ? {
		agentId,
		runId: clientRunId,
		sessionKey,
		get sessionId() {
			return sessionBinding.sessionId;
		},
		assertCurrent: assertDashboardReadCurrent
	} : void 0;
	const phase = diagnostics.scope("dispatch");
	scheduleChatDashboardSessionTitle({
		admittedSessionId,
		agentId,
		cfg,
		context,
		request,
		sessionKey,
		storePath
	}, titleTurn.promise);
	const dispatch = replyDispatch.runAgentMediaTranscript(dispatchAdmission, () => measureDiagnosticsTimelineSpan("gateway.chat_send.dispatch_inbound", async () => {
		if (!acceptedMessageInjection) admission.assertWorkAdmissionCurrent();
		let workspacePreparation;
		if (!acceptedMessageInjection && entry && (Object.hasOwn(entry, "pendingProjectGitUrl") || entry.pendingWorktree)) {
			phase?.mark("worktree");
			workspacePreparation = prepareSessionWorkspace({
				admission,
				client,
				context,
				session
			});
			await workspacePreparation.promptReady;
			workspacePreparation.assertCurrent();
		}
		const assertWorkspaceRunOwnership = workspacePreparation?.assertCurrent;
		phase?.mark("replyContext");
		if (replyContextFieldsPromise && !preAckReplyContextPromise) {
			const replyContextFields = await replyContextFieldsPromise;
			assertWorkspaceRunOwnership?.();
			applyChatSendReplyContextFields(ctx, replyContextFields);
			messageInjectionAttempt = await withCurrentUserTurnInput(userTurnRecorder, beginCapturedMessageInjection);
		}
		if (messageInjectionAttempt) {
			const injected = await finalizeAcceptedChatSendMessageInjection({
				attempt: messageInjectionAttempt,
				sessionBinding,
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
		phase?.mark("preparation");
		const skillLibraryAuthoring = await prepareGatewaySkillLibraryTurn(skillLibrary, turn.prepareSessionCreation, () => phase?.mark("authoring"));
		admission.assertWorkAdmissionCurrent();
		phase?.mark("preparation");
		const pluginBoundMedia = await pluginBoundMediaPromise;
		assertWorkspaceRunOwnership?.();
		applyChatSendManagedMedia(ctx, pluginBoundMedia, managedMediaApplyMode);
		phase?.mark("replyInitialization");
		const onAgentRunStart = (runId, _identity, options, transcriptStart) => {
			queuedFollowup.onRunStarted(runId);
			diagnostics.finish();
			replyDispatchRun = options;
			if (activeRunAbort.markExecutionStarted()) {
				admission.armOperatorRunCancellation();
				emitSessionsChanged(context, {
					sessionKey,
					agentId,
					reason: "agent.run.started"
				}, { accessChanged: false });
			}
			agentRunStarted = true;
			replyDispatch.captureAgentTranscriptStart(runId, transcriptStart);
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
		};
		const dispatchInbound = () => {
			assertWorkspaceRunOwnership?.();
			return dispatchInboundMessageWithProjectedDispatcher({
				ctx,
				cfg,
				toolsAllow,
				dispatcherOptions: replyDispatch.dispatcherOptions,
				onSessionMetadataChanges: (changes) => changes.forEach((change) => emitSessionsChanged(context, change)),
				replyOptions: {
					[REPLY_ADMISSION_TICKET]: replyAdmissionTicket,
					prepareAssistantTranscriptMessage: replyDispatch.prepareAssistantTranscriptMessage,
					...isInternalSourceReplyChannel(ctx) ? {
						resolveReplyDelivery: replyDispatch.resolveReplyDelivery,
						resolveReplyDeliveryFacts: replyDispatch.resolveReplyDeliveryFacts
					} : {},
					...admission.admittedSessionSettings ? { admittedSessionSettings: admission.admittedSessionSettings } : {},
					runId: clientRunId,
					operatorAuthority: admission.operatorAuthority,
					providerReviewAcknowledgment: request.providerReviewAcknowledgment,
					dashboardReadAdmission,
					skillLibraryAuthoring,
					...cronCreatorAuthority ? { cronCreatorAuthorityCapability: cronCreatorAuthority } : {},
					...isOperatorUiClient(clientInfo) ? { promptCacheKey: resolveWebchatPromptCacheKey({
						agentId,
						provider: resolvedSessionModel.provider,
						model: resolvedSessionModel.model,
						sessionKey: activeRunScopeKey
					}) } : {},
					...supportsTaskSuggestions ? { taskSuggestionDeliveryMode: "gateway" } : {},
					expectedActiveReplyOperation: admission.expectedActiveReplyOperation,
					...params.getSessionInitializationOptions(),
					onSessionPrepared: (binding) => {
						phase?.mark("preparation");
						admission.onSessionPrepared(binding);
						replyDispatch.notePreparedSession(binding);
					},
					onTranscriptStartPreparation: () => diagnostics.scope("snapshot")?.finish,
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
					...p.queueMode === "steer" && messageInjectionTarget ? { messageInjectionDisposition: "rejected" } : {},
					...restartSafeAdmission ? { suppressNextUserMessagePersistence: true } : {},
					fastModeAutoOnSecondsOverride: p.fastAutoOnSeconds,
					onAgentRunStart,
					onPreparedAgentRunStart: ({ runId, executionIdentityToken, options, transcriptStart }) => onAgentRunStart(runId, executionIdentityToken, options, transcriptStart),
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
		const dispatchWithRetry = () => withExecRequestTurn({
			identity: {
				runId: clientRunId,
				sessionKey: sessionBinding.sessionKey,
				sessionId: sessionBinding.sessionId,
				agentId: sessionBinding.agentId,
				ownerConnId: sessionBinding.ownerConnId,
				ownerDeviceId: sessionBinding.ownerDeviceId,
				controlUiVisible: sessionBinding.controlUiVisible,
				turnKind: sessionBinding.turnKind
			},
			abortSignal: activeRunAbort.controller.signal
		}, () => runAcceptedChatSendDispatch({
			operation: () => withDiagnosticsTimelineObserver(diagnostics.observeSpan, () => withCurrentUserTurnInput(userTurnRecorder, dispatchInbound)),
			classify: classifyDispatchFailure,
			waitForRetry: (error) => waitForAcceptedChatSendRetry({
				agentId,
				sessionKey,
				storePath
			}, error, activeRunAbort.controller.signal)
		}));
		const runDispatch = () => cronCreatorAuthority && externalAuthorityAdmission ? externalAuthorityAdmission.run(cronCreatorAuthority, dispatchWithRetry, activeRunAbort.controller.signal) : dispatchWithRetry();
		const dispatchResult = await runWithAgentWorkspaceReadiness(workspacePreparation, async () => {
			try {
				return await runDispatch();
			} finally {
				await workspacePreparation?.waitUntilReady();
			}
		});
		if (dispatchResult.beforeAgentRunBlocked === true) userTurnRecorder.markBlocked();
		return dispatchResult;
	}, {
		phase: "agent-turn",
		config: cfg,
		attributes: chatSendTraceAttributes
	})).then(async (dispatchResult) => {
		diagnostics.finish(queuedFollowup);
		if (acceptedMessageInjection || queuedFollowup.isEnqueued() || queuedFollowup.isTerminal()) return;
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
			const replyFinalization = {
				terminalEntry: sessionBinding,
				requesterContext: ctx,
				abortSignal: activeRunAbort.controller.signal,
				accountId,
				context,
				deliveredReplies: replyDispatch.deliveredReplies,
				emitFirstAssistantServerTiming,
				session
			};
			let finalizedSourceReply = false;
			if (!progressRefresh && (!agentRunStarted || replyDispatchRun || hasOnlyFinalWarnings) && !hasReturnedAgentError && !context.chatRunState.hasAbortMarker(clientRunId)) await finalizeChatSendDispatchedReplies({
				...replyFinalization,
				foldCommandBlocks: isInternalTextSlashCommandTurn || replyDispatchRun !== void 0,
				persistUserTurnTranscript: persistGatewayUserTurnTranscriptBestEffort,
				suppressReplies: !replyDispatchRun && replyDispatch.hasAppendedWebchatAgentMedia(),
				runtimeOwnsTranscript: replyDispatchResult?.assistantTranscript?.agentId === agentId && replyDispatchResult.assistantTranscript.sessionKey === sessionKey && replyDispatchResult.assistantTranscript.sessionId === activeRunAbort.entry?.sessionId,
				state: runtimeCancelled ? "aborted" : "final",
				stopReason: runtimeOutcome?.stopReason
			});
			else if (!progressRefresh && !context.chatRunState.hasAbortMarker(clientRunId)) finalizedSourceReply = await finalizeChatSendSourceReplies({
				...replyFinalization,
				hasReturnedAgentErrorPayloads: hasReturnedAgentError,
				suppressFinal: runtimeFailed
			});
			const hasFinalError = hasReturnedAgentError && (runtimeFailed || !finalizedSourceReply);
			await dispatchErrorLifecycle.settleTerminalPersistence();
			if (!context.chatRunState.hasAbortMarker(clientRunId)) {
				if (hasFinalError) dispatchErrorLifecycle.broadcastError({
					errorMessage: returnedAgentErrorMessage,
					errorKind: runtimeClassification === "timeout" ? "timeout" : void 0,
					stopReason: runtimeOutcome?.stopReason
				});
				const returnedAgentError = hasFinalError ? errorShape(ErrorCodes.UNAVAILABLE, returnedAgentErrorMessage ?? "agent returned an error payload") : void 0;
				setGatewayDedupeEntry({
					dedupe: context.dedupe,
					key: `chat:${clientRunId}`,
					session: captureAgentJobSession(sessionBinding),
					entry: {
						ts: Date.now(),
						ok: !hasFinalError,
						payload: hasFinalError ? {
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
							status: progressRefresh && !queuedFollowup.isSteered() ? "completed" : "ok",
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
	}).catch((error) => {
		diagnostics.finish(queuedFollowup);
		return dispatchErrorLifecycle.handleError(error);
	}).finally(() => replyAdmissionTicket?.release());
	(async () => {
		try {
			await dispatch;
		} finally {
			titleTurn.resolve();
			await dispatchErrorLifecycle.finalize();
			emitSessionsChanged(context, {
				sessionKey,
				agentId,
				reason: "agent.input.settled"
			}, {
				accessChanged: false,
				rowScope: "runtime"
			});
			if (userTurnRecorder.isBlocked() && attachments.offloadedRefs.length > 0) discardPreparedInboundMedia(attachments.offloadedRefs);
		}
	})().catch((error) => dispatchErrorLifecycle.handleSettlementError(error));
}
//#endregion
//#region src/gateway/server-methods/chat-send-attachments.ts
function isManagedInboundPdfOffloadRef(ref) {
	const mime = ref.mimeType.trim().toLowerCase();
	if (mime !== "application/pdf" && !mime.endsWith("+pdf") && path.extname(ref.path.split(/[?#]/u)[0] ?? "").toLowerCase() !== ".pdf") return false;
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
		const [{ ensureSandboxWorkspaceForSession }, { SANDBOX_MEDIA_MAX_BYTES, stageSandboxMedia }] = await Promise.all([import("./context-CAZ3LAgU.mjs"), import("./stage-sandbox-media-BIicrPLU.mjs")]);
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
		const skillsSnapshot = params.skillLibrarySelections?.length ? (await (await import("./session-snapshot-CaUjcXrr.mjs")).resolveReusableWorkspaceSkillSnapshot({
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
		const resolvedByRef = new Map(refsToStage.map((ref, index) => [ref, stagedMedia[index]]));
		return mediaPathRefs.map((ref) => {
			const resolved = resolvedByRef.get(ref);
			return {
				path: resolved?.path ?? ref.path,
				url: ref.mediaRef,
				contentType: resolved?.contentType ?? ref.mimeType,
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
	let explicitOriginTargetsPlugin = false;
	let prepareAttachmentsMs;
	try {
		const explicitOriginTargets = await resolveExplicitOriginBindingTargets(explicitOrigin);
		assertInputCurrent();
		explicitOriginTargetsPlugin = explicitOriginTargets.plugin;
		if (normalizedAttachments.length > 0) {
			if ((admission.initialSessionEntry ?? admission.admittedSessionEntry ?? session.entry)?.deviceFolder) throw new Error(DEVICE_FOLDER_ATTACHMENTS_UNSUPPORTED);
			const prepareAttachmentsStartedAtMs = performance.now();
			await measureDiagnosticsTimelineSpan("gateway.chat_send.prepare_attachments", async () => {
				const imageSupport = { value: explicitOriginTargets.acp || explicitOriginTargetsPlugin ? true : void 0 };
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
		}
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
		if (!recorder || !retainsUserTurnTranscriptMedia(recorder)) discardPreparedInboundMedia(params.attachments.offloadedRefs);
	});
	return (inputRecorder) => {
		recorder = inputRecorder;
	};
}
//#endregion
//#region src/gateway/current-prompt-reaction.ts
/** Captured only by authenticated chat admission, never by channel-route inference. */
function createCurrentPromptReaction(params) {
	return async (input) => {
		input.assertCurrent();
		const owner = getUserTurnTranscriptAdmissionOwner(params.recorder);
		const admission = owner?.receipt();
		if (!owner || params.recorder.isBlocked() || !admission || admission.agentId !== params.agentId || admission.sessionKey !== params.sessionKey) throw new Error("Current WebChat prompt has not been committed.");
		const assertCurrent = () => {
			input.assertCurrent();
			if (params.recorder.isBlocked() || owner.receipt() !== admission) throw new Error("Current WebChat prompt admission changed.");
		};
		if (!isReactionEmoji(input.emoji)) throw new Error("one emoji grapheme is required");
		if (input.dryRun) return {
			messageId: admission.entryId,
			changed: false,
			reactions: []
		};
		const { commitSessionReaction } = await import("./session-reaction-mutation-8UTYwjpF.mjs");
		assertCurrent();
		const write = await commitSessionReaction({
			scope: {
				agentId: admission.agentId,
				sessionKey: admission.sessionKey,
				storePath: admission.storePath
			},
			sessionKey: params.sessionKey,
			sessionId: admission.sessionId,
			agentId: params.agentId,
			messageId: admission.entryId,
			emoji: input.emoji,
			remove: input.remove,
			actor: {
				type: "agent",
				id: params.agentId,
				label: resolveAgentIdentity(params.context.getRuntimeConfig(), params.agentId)?.name ?? params.agentId
			},
			identityId: "agent:" + params.agentId,
			context: params.context,
			assertCurrent
		});
		return {
			messageId: admission.entryId,
			changed: write.changed,
			reactions: write.reactions
		};
	};
}
//#endregion
//#region src/gateway/server-methods/chat-send-dashboard-authority.ts
/** One source authorization survives queue adoption; read grants retain the original work lease. */
async function createChatSendDashboardAuthority(params) {
	const { admission, session, client, context, externalAuthorityAdmission, externalAdmissionParams } = params;
	const { runId, sessionKey } = externalAdmissionParams;
	const eligible = externalAuthorityAdmission?.allowsDashboardReads(externalAdmissionParams);
	const resolved = eligible && !params.sessionMutationAuthorization ? await resolveSessionMutationAuthorizationAsync({
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
			storePath: session.storePath,
			sessionId: admission.sessionBinding.sessionId
		}
	}) : void 0;
	if (resolved?.error) throw new SessionMutationAuthorizationChangedError(resolved.error);
	const sessionAuthorization = params.sessionMutationAuthorization ?? resolved?.authorization;
	if (eligible && !sessionAuthorization) throw new Error("Dashboard session authorization is unavailable.");
	const assertSourceCurrent = eligible && externalAuthorityAdmission ? () => {
		params.sessionMutationCommitGuard?.();
		if (admission.lifecycleGeneration !== getAgentEventLifecycleGeneration()) throw new Error("Dashboard prompt source lifecycle is no longer active.");
		const queued = context.chatQueuedTurns.get(runId);
		if (admission.activeRunAbort.controller.signal.aborted && !(queued?.controller === admission.activeRunAbort.controller && queued.abortable === false)) admission.activeRunAbort.controller.signal.throwIfAborted();
		if (client?.invalidated || params.hasCurrentClientAuthority?.() === false || !externalAuthorityAdmission.allowsDashboardReads(externalAdmissionParams)) throw new Error("Dashboard message read admission is no longer active.");
		(sessionAuthorization?.assertAdmittedInputCurrent ?? sessionAuthorization?.assertCurrent)?.();
	} : void 0;
	return {
		release: () => resolved?.authorization?.release?.(),
		assertReadCurrent: assertSourceCurrent ? () => {
			admission.assertWorkAdmissionCurrent();
			assertSourceCurrent();
		} : void 0,
		bindPromptRecorder(recorder) {
			if (!assertSourceCurrent) return;
			bindUserTurnPromptReactionSource(recorder, {
				agentId: session.agentId,
				sessionKey,
				assertCurrent: assertSourceCurrent,
				createReaction: (sourceRecorder) => createCurrentPromptReaction({
					agentId: session.agentId,
					sessionKey,
					recorder: sourceRecorder,
					context
				})
			});
		}
	};
}
//#endregion
//#region src/gateway/server-methods/chat-send-session-binding.ts
function bindChatSendPreparedSession(params) {
	const { sessionBinding } = params;
	return (binding) => {
		if (binding.sessionKey !== params.sessionKey) return;
		if (params.chatAbortControllers.get(params.clientRunId) !== sessionBinding || params.lifecycleGeneration !== getAgentEventLifecycleGeneration() || !params.admission.isActive() || !isChatAbortControllerEntryAbortable(sessionBinding) || sessionBinding.registrationCleanupRequested || sessionBinding.projectSessionActive === false && !params.progressRefresh || sessionBinding.projectSessionTerminalPending || sessionBinding.projectSessionTerminalPersisted) throw createAbortError("chat session preparation no longer owns its admission");
		adoptExecRequestSession({
			runId: params.clientRunId,
			previousSessionId: sessionBinding.sessionId,
			sessionId: binding.sessionId
		});
		sessionBinding.sessionId = binding.sessionId;
	};
}
function createChatSendSessionInitialization(params) {
	const { authorization } = params;
	const target = {
		sessionKey: params.sessionKey,
		agentId: params.agentId
	};
	return () => ({
		...params.getSessionInitializationOptions(),
		onDatabaseRegistration: authorization?.followRegistration ? (change) => authorization.followRegistration?.(target, change) : void 0,
		...params.needsCreationBinding && authorization?.bindCreation ? {
			bindSessionCreation: (operation) => {
				authorization.bindCreation?.(target, operation);
				return authorization.assertCurrent;
			},
			onSessionCreated: authorization.recordCreatedSession
		} : {}
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
async function fingerprintRestartSafeChatRequest(params) {
	const identity = await loadOrCreateProcessDeviceIdentityAsync();
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
async function createRestartSafeChatRequest(params) {
	if (params.goalRequestFingerprint) return { fingerprint: params.goalRequestFingerprint };
	if (!params.eligible || hasRestartUnsafeMessageSemantics(params.message, params.cfg)) return;
	return { fingerprint: await fingerprintRestartSafeChatRequest(params) };
}
function isAdoptedRestartRecoveryClaim(entry, clientRunId) {
	return Boolean(entry?.restartRecoveryDeliveryRunId && entry.restartRecoveryDeliverySourceRunId === clientRunId && !isRetryableUnadoptedChatClaim(entry, clientRunId));
}
function resolveDurableChatClaim(params) {
	const entry = params.entry;
	if (!isAdoptedRestartRecoveryClaim(entry, params.clientRunId) || entry.abortedLastRun !== true) return isAdoptedRestartRecoveryClaim(entry, params.clientRunId) || hasRestartRecoveryTerminalRun(entry, params.clientRunId) ? { kind: "accepted" } : {
		kind: "continue",
		entry
	};
	const recoverySessionError = resolveAgentSessionWorkStartError(params.canonicalSessionKey, entry);
	if (recoverySessionError) return {
		kind: "rejected",
		message: recoverySessionError
	};
	const recoveryRuntime = params.recoveryRuntime;
	if (!recoveryRuntime) return {
		kind: "pending",
		message: "accepted chat turn recovery is waiting for the Gateway runtime; retry"
	};
	return (async () => {
		try {
			const { retryRestartAbortedMainSessionRecovery } = await import("./main-session-restart-recovery-BBdP2m5e.mjs");
			await retryRestartAbortedMainSessionRecovery({
				canonicalSessionKey: params.canonicalSessionKey,
				cfg: params.cfg,
				expectedRecoveryRunId: entry.restartRecoveryDeliveryRunId,
				expectedRecoverySourceRunId: entry.restartRecoveryDeliverySourceRunId,
				expectedSessionId: entry.sessionId,
				sessionKey: params.persistedSessionKey,
				storePath: params.storePath,
				gatewayRuntime: recoveryRuntime
			});
		} catch (error) {
			params.warn(String(error));
		}
		const current = await params.reloadEntry();
		if (isAdoptedRestartRecoveryClaim(current, params.clientRunId) && current.abortedLastRun === true) return {
			kind: "pending",
			message: "accepted chat turn recovery is still pending; retry"
		};
		if (!isAdoptedRestartRecoveryClaim(current, params.clientRunId) && !hasRestartRecoveryTerminalRun(current, params.clientRunId)) return {
			kind: "rejected",
			message: "accepted chat turn recovery ownership changed; automatic retry stopped to avoid duplicate execution",
			unavailable: true
		};
		return { kind: "accepted" };
	})();
}
function isRestartSafeChatSession(params) {
	const entry = params.entry;
	return Boolean(entry?.sessionId && params.sessionKey !== "global" && entry.abortedLastRun !== true && entry.archivedAt === void 0 && entry.initializationPending !== true && entry.pendingFinalDelivery === void 0 && (entry.agentHarnessId === void 0 || entry.agentHarnessId === "openclaw") && entry.pluginOwnerId === void 0 && entry.spawnedBy === void 0 && entry.subagentRole === void 0 && (entry.spawnDepth ?? 0) === 0 && params.acpMeta == null && entry.cronRunContinuation === void 0 && !isSubagentSessionKey(params.sessionKey) && !isCronSessionKey(params.sessionKey) && !isAcpSessionKey(params.sessionKey) && !isAgentHarnessSessionKey(params.sessionKey) && (params.requestedSessionId === void 0 || params.requestedSessionId === entry.sessionId));
}
function hasRestartUnsafeChatWork(params) {
	if (findRestartRecoveryUnsafeChatAdmissionHook(resolveSessionDispatchKind(params.sessionKey, params.entry)) !== void 0 || resolveProjectedAgentRunProgressState({
		agentId: params.agentId,
		sessionId: params.sessionId,
		sessionKeys: [params.sessionKey]
	}) !== void 0 || listActiveEmbeddedRunSessionIds().includes(params.sessionId) || replyRunRegistry.isActive(params.activeRunScopeKey)) return true;
	for (const runs of [params.context.chatAbortControllers, params.context.chatQueuedTurns]) for (const active of runs?.values() ?? []) if ((active.sessionKey === params.sessionKey || active.sessionId === params.sessionId) && resolveChatRunOwnerAgentId({
		agentId: active.agentId,
		sessionKey: active.sessionKey,
		defaultAgentId: params.agentId
	}) === params.agentId) return true;
	return false;
}
/** Borrow placement facts only while the chat owner revalidates and commits admission. */
async function withRestartSafeChatPlacement(service, sessionId, consume) {
	if (!service.prepareSessionPlacement) throw new Error("Worker placement admission reader is unavailable; retry.");
	const facts = await service.prepareSessionPlacement(sessionId);
	try {
		await consume({
			sessionId,
			facts
		});
	} finally {
		facts.release();
	}
}
function resolveRestartSafeChatAdmission(params) {
	const request = params.request;
	const entry = params.entry ?? params.initialSessionEntry;
	const placement = params.placement;
	if (params.cfg.cloudWorkers?.requiredProfile || placement && placement.state !== "local") return;
	if (!request || !entry || !isRestartSafeChatSession({
		...params,
		entry
	})) return;
	if (!params.initialSessionEntry) {
		const freshnessScope = {
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
		};
		let freshness;
		if (isIncognitoSessionKey(params.sessionKey)) freshness = resolveSessionEntryResetFreshness(freshnessScope);
		else {
			if (params.lifecycleTimestamps === void 0) throw new Error("Restart-safe chat freshness was not prepared; retry.");
			freshness = resolvePreparedSessionEntryResetFreshness(freshnessScope, entry, params.lifecycleTimestamps);
		}
		if (freshness.state !== "fresh") return;
	}
	if (hasRestartUnsafeChatWork(params)) return;
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
			...params.lastInteractionAt !== void 0 ? { lastInteractionAt: params.lastInteractionAt } : {},
			lastRunId: void 0,
			restartRecoveryDeliveryContext: void 0,
			restartRecoveryDeliveryRequestFingerprint: params.admission.requestFingerprint,
			restartRecoveryDeliveryRunId: params.clientRunId,
			restartRecoveryDeliverySourceRunId: params.clientRunId,
			restartRecoveryRequesterAccountId: void 0,
			restartRecoveryRequesterSenderId: void 0,
			restartRecoverySameChannelThreadRequired: void 0,
			restartRecoverySourceIngress: params.sourceIngress,
			restartRecoveryOperatorSource: params.admission.retryExpectedState ? params.admission.retryExpectedState.restartRecoveryOperatorSource : params.operatorSource,
			restartRecoverySourceReplyDeliveryMode: void 0,
			...params.admission.priorTerminalSourceRunId ? { restartRecoveryTerminalRunIds: [params.admission.priorTerminalSourceRunId] } : {}
		}
	};
}
async function terminalizeRestartSafeChatAdmission(params) {
	const endedAt = Date.now();
	let terminalized = false;
	params.assertCurrent();
	const persisted = await applySessionEntryTargetOperation(params.target, {
		kind: "restart-safe-terminal",
		runId: params.clientRunId,
		retryable: params.retryable,
		expected: {
			sessionId: params.admittedSessionId,
			lifecycleRevision: params.expectedLifecycleRevision
		},
		patch: {
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
			lastRunId: params.clientRunId
		}
	}, {
		requireWriteSuccess: true,
		skipMaintenance: true,
		workerGuard: { assertCurrent: params.assertCurrent },
		onCommitted: () => {
			terminalized = true;
		}
	});
	if (terminalized && persisted && params.status === "failed") await recordGatewaySessionRunFailure({
		target: {
			agentId: params.target.agentId,
			env: params.target.env,
			sessionKey: params.target.target.canonicalKey,
			storePath: params.target.readSource.path,
			sessionId: persisted.sessionId,
			expectedLifecycleRevision: persisted.lifecycleRevision
		},
		runId: params.clientRunId,
		error: params.error,
		errorKind: params.errorKind,
		assertCommitAllowed: () => {
			params.assertCurrent();
			const source = params.target.readSource;
			if (!isIncognitoSessionKey(params.target.target.canonicalKey) && typeof source.databaseIdentity === "string") assertExistingDatabaseIdentity(source.path, `file:${source.databaseIdentity}`, source.databaseBirthtime);
		}
	}).catch((error) => {
		log.warn(`Failed to record restart-safe chat failure notice: ${boundedWorkerError(error)}`);
	});
	return terminalized;
}
//#endregion
//#region src/gateway/server-methods/chat-send-active-leaf.ts
const ACTIVE_LEAF_CHANGED_ERROR_REASON = "active-leaf-changed";
function assertExpectedLeafActive(session, agentId, expectedLeafEntryId, requestedSessionId, options) {
	const activePathRelation = session.transcript?.activePathRelation ?? (session.entry?.sessionId ? isIncognitoSessionKey(session.canonicalKey) ? readSessionTranscriptActivePathEntryRelation({
		agentId,
		sessionId: session.entry.sessionId,
		sessionKey: session.canonicalKey,
		sessionEntry: session.entry,
		storePath: session.storePath
	}, expectedLeafEntryId) : void 0 : expectedLeafEntryId === null ? "exact" : "off-path");
	if (activePathRelation === void 0) throw new Error("Chat admission omitted its worker-prepared active path");
	const matchesRequestedSession = requestedSessionId === void 0 || requestedSessionId === session.entry?.sessionId;
	const matchesActivePath = activePathRelation === "exact" || requestedSessionId !== void 0 && (activePathRelation === "ancestor" || options?.allowEmptyAncestor === true && expectedLeafEntryId === null);
	if (!matchesRequestedSession || !matchesActivePath) throw new Error(ACTIVE_LEAF_CHANGED_ERROR_REASON);
}
/** Read the current row and active path in one existing worker snapshot before a Stop effect. */
async function assertExpectedLeafActiveAsync(session, agentId, expectedLeafEntryId, requestedSessionId, options) {
	if (isIncognitoSessionKey(session.canonicalKey)) {
		assertExpectedLeafActive(session, agentId, expectedLeafEntryId, requestedSessionId, options);
		return;
	}
	await withSessionEntriesFromStoresInWorker([{
		agentId,
		storePath: session.storePath,
		sessionKeys: [session.canonicalKey],
		transcript: {
			sessionKey: session.canonicalKey,
			agentId,
			entryIds: [],
			activePathEntryId: expectedLeafEntryId
		}
	}], ([owner]) => {
		owner.assertCurrent();
		assertExpectedLeafActive({
			canonicalKey: session.canonicalKey,
			storePath: session.storePath,
			entry: owner.result.entries[0]?.entry,
			transcript: owner.result.transcript
		}, agentId, expectedLeafEntryId, requestedSessionId, options);
	}, { ordered: true });
}
//#endregion
//#region src/gateway/server-methods/chat-send-admission-cleanup.ts
/** Own cleanup after chat admission transfers work beyond the request frame. */
function createAdmittedChatSendCleanup(params) {
	let discardPreparedMedia;
	return {
		cleanup: () => {
			params.cleanupAbort();
			params.releaseRetainedWork();
			discardPreparedMedia?.();
			discardPreparedMedia = void 0;
		},
		setDiscardPreparedMedia: (discard) => {
			discardPreparedMedia = discard;
		}
	};
}
function finishAbortedChatSend(params) {
	const endedAt = Date.now();
	const payload = buildAbortedChatSendPayload({
		runId: params.runId,
		stopReason: params.stopReason ?? "rpc",
		endedAt
	});
	setGatewayDedupeEntry({
		dedupe: params.context.dedupe,
		key: `chat:${params.runId}`,
		session: captureAgentJobSession(params.sessionBinding),
		entry: {
			ts: endedAt,
			ok: true,
			payload
		}
	});
	params.cleanup();
	clearAgentRunContext(params.runId, params.lifecycleGeneration);
	params.respond(true, payload, void 0, { runId: params.runId });
}
//#endregion
//#region src/gateway/server-methods/chat-send-admission-context.ts
function prepareChatSendAdmissionContext(params) {
	const { request, session, client } = params;
	const { p, explicitOrigin, normalizedAttachments } = request;
	const { cfg, entry, sessionKey, selectedAgent, agentId, clientRunId, resolvedSessionModel } = session;
	return {
		chatSendTraceAttributes: {
			runId: clientRunId,
			sessionKey,
			agentId: selectedAgent.agentId ?? agentId,
			provider: resolvedSessionModel.provider,
			model: resolvedSessionModel.model,
			hasAttachments: normalizedAttachments.length > 0,
			hasExplicitOrigin: explicitOrigin !== void 0,
			hasConnectedClient: client?.connect !== void 0
		},
		originatingRoute: resolveChatSendOriginatingRoute({
			client: request.clientInfo,
			deliver: p.deliver,
			entry,
			explicitOrigin,
			hasConnectedClient: client?.connect !== void 0,
			mainKey: cfg.session?.mainKey,
			sessionKey
		})
	};
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
//#region src/gateway/server-methods/chat-send-reservation.ts
function createPendingChatSendReservationAccess(params) {
	const { pendingChatSendKey: key, clientRunId: runId } = params.session;
	const read = () => readPreRegisteredRun({
		key,
		entry: params.context.dedupe.get(key),
		keyPrefix: PENDING_CHAT_SEND_DEDUPE_PREFIX
	});
	return {
		read,
		reserve: () => {
			const { context, request, session, attemptId } = params;
			context.dedupe.set(key, {
				ts: session.now,
				ok: true,
				requestIdentity: request.goalOperation?.requestFingerprint ?? request.requestIdentity,
				payload: {
					runId: session.clientRunId,
					attemptId,
					status: "accepted",
					sessionKey: session.sessionKey,
					...session.backingSessionId ? { sessionId: session.backingSessionId } : {},
					...session.rawSessionKey === session.sessionKey ? {} : { sessionKeyAliases: [session.rawSessionKey] },
					...session.selectedAgent.agentId ? { agentId: session.selectedAgent.agentId } : {},
					ownerConnId: normalizeOptionalString(params.client?.connId),
					ownerDeviceId: normalizeOptionalString(params.client?.connect?.device?.id),
					expiresAtMs: resolveChatRunExpiresAtMs({
						now: session.now,
						timeoutMs: session.timeoutMs
					}),
					turnKind: request.turnKind,
					...request.goalOperation ? { goalFingerprint: request.goalOperation.requestFingerprint } : {}
				}
			});
		},
		clear: () => {
			const pending = read();
			if (pending?.runId === runId && normalizeOptionalString(pending.payload.attemptId) === params.attemptId) params.context.dedupe.delete(key);
		}
	};
}
/** A retained request identity is not an ACK; only response-bearing rows may replay. */
function readChatSendDedupeResponse(dedupe, runId) {
	const entry = dedupe.get(`chat:${runId}`);
	return entry?.requestIdentity && entry.ok && entry.payload === void 0 && entry.error === void 0 ? void 0 : entry;
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
//#endregion
//#region src/gateway/server-methods/chat-send-retry-comparison.ts
/** Submitted bytes compare input; the caller's current owner still decides replay. */
function readChatSendRetryComparison(session) {
	if (!session.entry?.sessionId) return;
	const { agentId, storePath, sessionKey, clientRunId } = session;
	const { sessionId, lifecycleRevision } = session.entry;
	return readSessionSubmittedInput({
		agentId,
		storePath,
		sessionKey,
		sessionId
	}, `${clientRunId}:user`).then((submitted) => {
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
	const storedIdentity = submitted["__openclaw"]?.chatRequestIdentity;
	if (typeof storedIdentity === "string") return storedIdentity !== request.requestIdentity;
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
function resolveChatSendRequestConflict({ request, session, context }, comparison, ownPendingAttemptId) {
	if (request.goalOperation) return;
	const entries = [context.dedupe.get(`chat:${session.clientRunId}`), context.dedupe.get(session.pendingChatSendKey)];
	const conflict = (unverifiable = false) => errorShape(ErrorCodes.INVALID_REQUEST, unverifiable ? "The previous mention selections cannot be verified. Check the conversation history and use a new message ID to send again." : "This message ID was already used for different input. Check the conversation history and use a new message ID to send again.", { details: { reason: "chat-request-conflict" } });
	if (entries.some((entry) => entry?.requestIdentity !== void 0 && entry.requestIdentity !== request.requestIdentity)) return conflict();
	const sameDurableSource = session.entry?.restartRecoveryDeliverySourceRunId === session.clientRunId;
	const storedFingerprint = sameDurableSource ? session.entry?.restartRecoveryDeliveryRequestFingerprint : void 0;
	if (storedFingerprint !== void 0) return storedFingerprint === session.restartSafeRequest?.fingerprint ? void 0 : conflict();
	if (sameDurableSource && (request.mentions?.length || request.workContext) && !session.restartSafeRequest) return conflict(true);
	const ownsPendingReservation = ownPendingAttemptId !== void 0 && readPreRegisteredRun({
		key: session.pendingChatSendKey,
		entry: entries[1],
		keyPrefix: "pending-chat:"
	})?.payload.attemptId === ownPendingAttemptId;
	const retryEntries = ownsPendingReservation ? entries.slice(0, 1) : entries;
	if (!comparison && request.requestIdentity !== void 0 && retryEntries.some((entry) => entry?.requestIdentity === request.requestIdentity)) return;
	if (!(retryEntries.some(Boolean) || sameDurableSource || hasRestartRecoveryTerminalRun(session.entry, session.clientRunId) || context.chatRunState.hasAbortMarker(session.clientRunId) || !ownsPendingReservation && context.chatAbortControllers.has(session.clientRunId) || context.chatQueuedTurns?.has(session.clientRunId))) return;
	const mismatch = compareChatSendSubmittedInput(request, session, comparison);
	return mismatch ? conflict(mismatch === "unverifiable") : void 0;
}
function prepareChatSendRetryComparison(params, ownPendingAttemptId) {
	try {
		resolveChatSendRequestConflict(params, void 0, ownPendingAttemptId);
		return;
	} catch (error) {
		if (!isSessionTranscriptProjectionUnavailableError(error)) throw error;
		return readChatSendRetryComparison(params.session);
	}
}
/** Consume current authority in one synchronous frame after any required worker preparation. */
async function consumeChatSendCurrent(params, consume) {
	const invoke = () => {
		params.assertCurrent?.();
		return consume();
	};
	if (params.withCurrent) return params.withCurrent(invoke);
	if (params.assertCurrentAsync) await params.assertCurrentAsync();
	return invoke();
}
async function respondPreparedChatSendRetry(params) {
	try {
		const pending = prepareChatSendRetryComparison(params);
		const comparison = pending ? await pending : void 0;
		return await consumeChatSendCurrent(params, () => respondChatSendRetry(params, comparison));
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
/** Settle stop/retry/dedupe cases before reserving lifecycle admission. */
async function runChatSendPreAdmission(params) {
	const { request, session, respond, context, client } = params;
	const { stopCommand } = request;
	const { cfg, entry, sessionKey, rawSessionKey, sessionLoadKey, selectedAgent, clientRunId, sessionLoadOptions, storePath, legacyKey, sessionRoutingChanged } = session;
	const reloadEntry = async () => (await loadGatewaySessionEntryReadOnlyInWorker({
		excludeInternalEffects: true,
		cfg,
		key: sessionLoadKey,
		...sessionLoadOptions
	})).entry;
	const resolveClaim = (currentEntry, warn) => resolveDurableChatClaim({
		canonicalSessionKey: sessionKey,
		cfg,
		clientRunId,
		entry: currentEntry,
		persistedSessionKey: legacyKey ?? sessionKey,
		reloadEntry,
		storePath,
		recoveryRuntime: context.recoveryRuntime,
		warn
	});
	const warnRecovery = (message) => context.logGateway.warn(`failed to retry durable chat recovery ${clientRunId}: ${message}`);
	const consumeNewDispatchDecision = () => {
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
	};
	const requiresReconciliation = entry && isMainSessionRecoveryReconciliationCandidate(entry);
	let preparedClaim;
	let initialDecisionCompleted = false;
	let retryChecked = false;
	const consumeInitialDecision = () => {
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
		if (!stopCommand && !request.goalOperation) {
			try {
				const handled = respondChatSendRetry(params);
				retryChecked = true;
				if (handled) return false;
			} catch (error) {
				if (!isSessionTranscriptProjectionUnavailableError(error)) throw error;
			}
			if (retryChecked && !requiresReconciliation) {
				preparedClaim = resolveClaim(entry, warnRecovery);
				if (preparedClaim instanceof Promise) preparedClaim.catch(() => {});
				else if (preparedClaim.kind === "continue") {
					initialDecisionCompleted = true;
					return consumeNewDispatchDecision();
				}
			}
		}
		return true;
	};
	try {
		if (!(stopCommand ? consumeInitialDecision() : await consumeChatSendCurrent(params, consumeInitialDecision))) return false;
	} catch (error) {
		if (preparedClaim instanceof Promise) await Promise.allSettled([preparedClaim]);
		throw error;
	}
	if (initialDecisionCompleted) return true;
	if (request.goalOperation) {
		const prepared = await prepareGoalChatSendRetry(params);
		const retry = await consumeChatSendCurrent(params, () => inspectGoalChatSendRetry({
			...params,
			prepared
		}));
		if (retry.kind === "settled") return false;
		if (retry.kind === "replay") {
			const claim = await resolveClaim(entry, (message) => context.logGateway.warn(message));
			await consumeChatSendCurrent(params, () => {
				if (claim.kind === "pending" || claim.kind === "rejected") respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, claim.message, { retryable: claim.kind === "pending" }));
				else respond(true, {
					...retry.receipt,
					replayed: true
				}, void 0, {
					cached: true,
					runId: clientRunId
				});
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
			} catch (error) {
				guard.failure = { error };
				throw error;
			}
		};
		const beforeAbort = async () => {
			try {
				if (request.p.queueMode !== "steer" && session.expectedLeafEntryId !== void 0) await assertExpectedLeafActiveAsync({
					canonicalKey: sessionKey,
					storePath: stopStorePath,
					entry
				}, session.agentId, session.expectedLeafEntryId, session.requestedSessionId);
				assertCurrent();
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
				beforeAbort,
				cascadeDescendants: true
			});
			if (!guard.failure && (res.error || res.descendants && res.descendants.status !== "ok")) try {
				await beforeAbort();
			} catch (error) {
				throw abortedPartialPersistenceError(error, res.warning);
			}
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
	if (!retryChecked && await respondPreparedChatSendRetry(params)) return false;
	let durableEntry = entry;
	if (requiresReconciliation) {
		const { reconcileOrphanedGatewaySessionRecovery } = await import("./session-recovery-service-B7GapCh2.mjs");
		try {
			const recoveryEntry = entry;
			if (recoveryEntry) {
				const conflict = resolveChatSendRequestConflict(params, await prepareChatSendRetryComparison(params));
				if (conflict) throw new Error(conflict.message);
				const workStartError = resolveSessionWorkStartError(sessionKey, recoveryEntry, {
					allowPendingWorkspace: true,
					providerReviewAcknowledgment: request.providerReviewAcknowledgment,
					runId: clientRunId,
					expectedSessionId: session.requestedSessionId ?? session.backingSessionId
				});
				if (workStartError) throw new Error(workStartError);
				captureAdmittedChatSendSessionSettings({
					commit: false,
					entry: recoveryEntry,
					expectedPermissionMode: request.p.expectedPermissionMode,
					expectedToolOverrides: request.p.expectedToolOverrides
				});
				await reconcileOrphanedGatewaySessionRecovery({
					cfg,
					target: await resolveGatewaySessionStoreTargetInWorker({
						cfg,
						key: sessionKey,
						agentId: session.agentId
					}),
					entry: recoveryEntry,
					authorizedPluginId: client?.internal?.pluginRuntimeOwnerId,
					commitGuard: () => {
						params.assertCurrent?.();
						if (sessionRoutingChanged(context.getRuntimeConfig())) throw new Error(SESSION_ROUTING_CHANGED_ERROR_REASON);
					},
					workerPlacementContext: resolveSessionWorkerPlacementContext(context)
				});
			}
			durableEntry = await reloadEntry();
		} catch (error) {
			if (error instanceof SessionMutationAuthorizationChangedError) throw error;
			respondChatSendAdmissionError(error, respond);
			return false;
		}
		await consumeChatSendCurrent(params, () => void 0);
	}
	const durableClaim = await (preparedClaim ?? resolveClaim(durableEntry, warnRecovery));
	const retrySession = {
		...session,
		entry: durableClaim.kind === "continue" ? durableClaim.entry : await withGatewaySessionEntry(sessionLoadKey, sessionLoadOptions, (current) => current.entry, cfg)
	};
	const retryParams = {
		...params,
		session: retrySession
	};
	if (request.goalOperation && await respondPreparedChatSendRetry(retryParams)) return false;
	let comparison;
	if (!request.goalOperation) try {
		const pending = prepareChatSendRetryComparison(retryParams);
		comparison = pending ? await pending : void 0;
	} catch (error) {
		if (!isSessionTranscriptProjectionUnavailableError(error)) throw error;
		respondChatSendAdmissionError(error, respond);
		return false;
	}
	const preparedGoalRetry = durableClaim.kind === "accepted" && request.goalOperation ? await prepareGoalChatSendRetry(params) : void 0;
	return consumeChatSendCurrent(params, () => {
		if (!request.goalOperation && respondChatSendRetry(retryParams, comparison)) return false;
		if (durableClaim.kind === "pending" || durableClaim.kind === "rejected") {
			respond(false, void 0, errorShape(durableClaim.kind === "pending" || durableClaim.unavailable ? ErrorCodes.UNAVAILABLE : ErrorCodes.INVALID_REQUEST, durableClaim.message, { retryable: durableClaim.kind === "pending" }));
			return false;
		}
		if (durableClaim.kind === "accepted") {
			if (request.goalOperation) {
				const retry = inspectGoalChatSendRetry({
					...params,
					durableClaimAccepted: true,
					prepared: preparedGoalRetry
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
		return consumeNewDispatchDecision();
	});
}
//#endregion
//#region src/gateway/server-methods/chat-send-session.ts
function chatSendPreparationConfig(cfg, agentId, entry, request, sessionKey) {
	const defaults = cfg.agents?.defaults;
	const agent = resolveAgentEntry(cfg, agentId);
	const selected = resolveSessionModelRef(cfg, entry, agentId);
	const modelRefs = [selected, ...(modelFallbackOverrideFromAvailability(resolveModelFallbackAvailability({
		cfg,
		agentId,
		sessionKey,
		hasSessionModelOverride: Boolean(entry?.modelOverride),
		modelOverrideSource: entry?.modelOverrideSource === "default" ? void 0 : entry?.modelOverrideSource,
		modelSelectionLocked: entry?.modelSelectionLocked
	})) ?? []).flatMap((model) => {
		const parsed = parseModelRef(model, selected.provider);
		return parsed ? [parsed] : [];
	})];
	const providers = Object.fromEntries([...new Set(modelRefs.map(({ provider }) => provider))].map((id) => {
		const provider = findNormalizedProviderValue(cfg.models?.providers, id);
		return [id, provider ? {
			...provider,
			models: provider.models?.filter(({ id: model }) => modelRefs.some((ref) => ref.provider === id && ref.model === model))
		} : void 0];
	}));
	const channels = [...new Set([
		"webchat",
		request?.explicitOrigin?.originatingChannel,
		sessionDeliveryChannel(entry)
	].filter((channel) => Boolean(channel)))];
	return {
		defaultModel: defaults?.model,
		agentModel: agent?.model,
		defaultModels: defaults?.models,
		agentModels: agent?.models,
		defaultModelPolicy: defaults?.modelPolicy,
		agentModelPolicy: agent?.modelPolicy,
		runtime: agent?.runtime,
		models: {
			mode: cfg.models?.mode,
			providers
		},
		auth: cfg.auth,
		plugins: cfg.plugins,
		workspace: agent?.workspace ?? defaults?.workspace,
		agentDir: agent?.agentDir,
		timeoutSeconds: defaults?.timeoutSeconds,
		defaultSandbox: defaults?.sandbox,
		agentSandbox: agent?.sandbox,
		tools: cfg.tools,
		agentTools: agent?.tools,
		channels: {
			defaults: cfg.channels?.defaults,
			selected: Object.fromEntries(channels.map((channel) => [channel, cfg.channels?.[channel]]))
		},
		roles: cfg.gateway?.roles,
		nodeCommands: cfg.gateway?.nodes?.commands,
		commands: cfg.commands,
		sendPolicy: cfg.session?.sendPolicy,
		reset: cfg.session?.reset,
		resetByType: cfg.session?.resetByType,
		resetByChannel: cfg.session?.resetByChannel
	};
}
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
async function loadChatSendSessionContext(params) {
	const { request, context } = params;
	const { p, explicitOrigin, normalizedAttachments } = request;
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
	const sessionLoadKey = resolveChatSendSessionKey(runtimeConfig, rawSessionKey, requestedAgentId);
	const sessionLoadOptions = { agentId: requestedAgentId };
	const assertRoutingCurrent = captureSessionMutationRouting(runtimeConfig, void 0, [{
		sessionKey: rawSessionKey,
		agentId: requestedAgentId
	}]);
	const assertConfigCurrent = () => assertRoutingCurrent(context.getRuntimeConfig());
	const sessionLoadStartedAtMs = performance.now();
	const sessionLoadResult = await measureDiagnosticsTimelineSpan("gateway.chat_send.load_session", () => request.stopCommand ? loadGatewaySessionEntryReadOnlyInWorker({
		excludeInternalEffects: true,
		cfg: runtimeConfig,
		key: sessionLoadKey,
		...sessionLoadOptions
	}) : withGatewaySessionEntry(sessionLoadKey, sessionLoadOptions, (entry) => entry, runtimeConfig, assertConfigCurrent), {
		phase: "agent-turn",
		attributes: {
			runId: clientRunId,
			hasAttachments: normalizedAttachments.length > 0,
			hasExplicitOrigin: explicitOrigin !== void 0
		}
	});
	assertConfigCurrent();
	const preparationFor = (config) => chatSendPreparationConfig(config, requestedAgentId, sessionLoadResult.entry, request, sessionLoadKey);
	if (!isDeepStrictEqual(preparationFor(runtimeConfig), preparationFor(context.getRuntimeConfig()))) throw new Error("Session preparation changed; retry.");
	const sessionLoadMs = roundedChatSendTimingMs(performance.now() - sessionLoadStartedAtMs);
	const { cfg, agentId, storePath, entry, canonicalKey: sessionKey, legacyKey } = sessionLoadResult;
	const expectedSessionRoutingContract = normalizeOptionalString(p.expectedSessionRoutingContract);
	const expectedLeafEntryId = p.expectedLeafEntryId === null ? null : normalizeOptionalString(p.expectedLeafEntryId);
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
			...request.explicitOrigin ? { preparationOrigin: request.explicitOrigin } : {},
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
			requestedAgentId
		}
	};
}
/** Load and validate the session/model facts shared by later admission and dispatch phases. */
async function prepareChatSendSession(params) {
	const loaded = await loadChatSendSessionContext(params);
	if (!loaded.ok) return loaded;
	const loadedValue = loaded.value;
	const { request, client } = params;
	const { p, explicitOrigin, normalizedAttachments, turnKind, rawMessage } = request;
	const { cfg, agentId, sessionKey, entry, legacyKey } = loadedValue;
	if (isIncognitoSessionKey(sessionKey) && !entry) return {
		ok: false,
		error: `Incognito session "${sessionKey}" was not found.`
	};
	const missingHarnessSessionError = resolveMissingAgentHarnessSessionError(sessionKey, entry);
	if (missingHarnessSessionError) return {
		ok: false,
		error: missingHarnessSessionError
	};
	const deletedAgent = prepareDeletedAgentSessionCheck({
		cfg,
		sessionKey,
		entry,
		acpMetadataSessionKey: legacyKey,
		assertCurrent: params.assertCurrent
	});
	const deletedAgentId = deletedAgent instanceof Promise ? await deletedAgent : deletedAgent;
	if (deletedAgent instanceof Promise) params.assertCurrent?.();
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
	const restartSafeRequest = await createRestartSafeChatRequest({
		goalRequestFingerprint: request.goalOperation?.requestFingerprint,
		cfg,
		eligible: (isBrowserOperatorUiClient(request.clientInfo) || params.isDirectExternalUser === true) && turnKind === "main" && normalizedAttachments.length === 0 && !request.reconnectResumeRequested && explicitOrigin === void 0 && p.deliver !== true && p.thinking === void 0 && p.fastMode === void 0 && p.fastAutoOnSeconds === void 0 && p.timeoutMs === void 0 && request.systemInputProvenance === void 0 && request.systemProvenanceReceipt === void 0 && !request.suppressCommandInterpretation,
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
			resolvedSessionModel,
			resolvedSessionAuthProvider,
			timeoutMs,
			now,
			restartSafeRequest
		}
	};
}
async function qualifyChatSendSession(loaded, releaseSessionStorage) {
	const qualified = await prepareQualifiedSessionEntryTarget({
		...loaded,
		canonicalKey: loaded.sessionKey,
		requestedKey: loaded.sessionLoadKey,
		storeKey: loaded.legacyKey ?? loaded.sessionKey,
		readSource: loaded.capturedReadSource
	}, loaded.capturedReadSources);
	return {
		...loaded,
		sessionTarget: qualified,
		releaseSessionStorage,
		activeRunScopeKey: qualified.canonicalKey,
		readSource: qualified.readSource
	};
}
/** Validate a worker-prepared admission row against the qualified session source. */
function assertCurrentChatSendSession(session, latest) {
	if (session.sessionRoutingChanged(latest.cfg)) throw new Error(SESSION_ROUTING_CHANGED_ERROR_REASON);
	if (latest.agentId !== session.sessionTarget.agentId || (latest.legacyKey ?? latest.canonicalKey) !== session.sessionTarget.storeKey || !isDeepStrictEqual(latest.capturedReadSource, session.sessionTarget.readSource)) throw new Error("Session storage changed while starting work. Retry.");
}
function withCurrentChatSendSession(params) {
	const { session } = params;
	const assertRoutingCurrent = captureSessionMutationRouting(session.cfg, void 0, [session]);
	const preparationRequest = { explicitOrigin: session.preparationOrigin };
	const preparationConfig = chatSendPreparationConfig(session.cfg, session.agentId, session.entry, preparationRequest, session.sessionKey);
	const assertConfigCurrent = () => {
		const currentConfig = params.getRuntimeConfig();
		assertRoutingCurrent(currentConfig);
		if (session.sessionRoutingChanged(currentConfig)) throw new Error(SESSION_ROUTING_CHANGED_ERROR_REASON);
		if (!isDeepStrictEqual(preparationConfig, chatSendPreparationConfig(currentConfig, session.agentId, session.entry, preparationRequest, session.sessionKey))) throw new Error("Session preparation changed; retry.");
	};
	const consume = (latest, membership, assertSourceCurrent) => {
		assertCurrentChatSendSession(session, latest);
		return params.consume(latest, membership, assertSourceCurrent);
	};
	if (isIncognitoSessionKey(session.sessionKey)) return withGatewaySessionEntry(session.sessionLoadKey, {
		...session.sessionLoadOptions,
		includeMembership: params.includeMembership
	}, consume, session.cfg, assertConfigCurrent);
	return withQualifiedGatewaySessionEntry({
		cfg: session.cfg,
		target: session.sessionTarget,
		logicalStorePath: session.storePath,
		includeMembership: params.includeMembership,
		transcript: params.includeActivePath && session.expectedLeafEntryId !== void 0 ? {
			sessionKey: session.sessionTarget.storeKey,
			agentId: session.agentId,
			entryIds: [],
			activePathEntryId: session.expectedLeafEntryId,
			includeSession: true
		} : void 0,
		includeLifecycle: params.includeLifecycle,
		consume,
		assertConfigCurrent
	}).catch((error) => {
		if (isSessionTranscriptProjectionUnavailableError(error)) startSessionTranscriptIndexReconcile({
			agentId: session.agentId,
			path: session.sessionTarget.storePath,
			preferredSessionId: error.sessionId
		});
		throw error;
	});
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
	const restrictionFor = (config, selectedEntry, model, persistedEntry) => resolveSessionNativeRuntimeRestriction({
		operation: "send",
		cfg: config,
		agentId,
		sessionKey,
		entry: selectedEntry,
		persistedEntry,
		preparedSessionCapabilityEntry: {
			sessionKey,
			entry: selectedEntry
		},
		harness,
		provider: model.provider,
		modelId: model.model,
		callerCanConsent: hasGatewayAdminScope(client)
	});
	const creation = resolveOperatorSessionCreation(client);
	const prospectiveEntry = entry ?? buildSessionCreationStamp({
		...creation,
		sandbox: resolveCreatorSandbox(cfg, creation),
		now: session.now
	});
	const restriction = await withPreparedSessionCapabilityRead(() => restrictionFor(cfg, prospectiveEntry, resolvedSessionModel, entry));
	const details = readAgentRuntimeRestrictionErrorDetails(restriction?.details);
	if (entry || !restriction || !hasGatewayAdminScope(client) || !details || details.reason === "sandbox-required" || details.reason === "remote-execution") return restriction;
	const [{ loadReplySessionInitializationSnapshot, commitReplySessionInitialization }, { recordSessionCreated }] = await Promise.all([import("./session-accessor.reset-DFHgSaTl.mjs"), import("./session-created-JD5M06IV.mjs")]);
	await (params.assertCurrentAsync ? params.assertCurrentAsync() : params.assertCurrent?.());
	const scope = {
		agentId,
		sessionKey,
		storePath: session.storePath
	};
	const snapshot = await loadReplySessionInitializationSnapshot(scope);
	await (params.assertCurrentAsync ? params.assertCurrentAsync() : params.assertCurrent?.());
	const sessionChanged = () => errorShape(ErrorCodes.INVALID_REQUEST, "Session changed before native confirmation. Retry.");
	if (snapshot.currentEntry) return sessionChanged();
	const prepared = await prepareChatSendSessionEntry({
		cfg,
		client,
		agentId,
		getRuntimeConfig: context.getRuntimeConfig
	});
	const preparedRestriction = await prepareSessionCapabilityRead(() => {
		const currentConfig = context.getRuntimeConfig();
		const currentModel = resolveSessionModelRef(currentConfig, void 0, agentId);
		return readAgentRuntimeRestrictionErrorDetails(restrictionFor(currentConfig, prepared.entry, currentModel)?.details);
	});
	let committed;
	try {
		committed = await commitReplySessionInitialization({
			...scope,
			activeSessionKey: sessionKey,
			expectedRevision: snapshot.revision,
			databaseSource: snapshot.databaseSource,
			sessionEntry: prepared.entry,
			commitGuard: () => {
				params.assertCurrent?.();
				prepared.assertSkillSelection();
				const currentConfig = context.getRuntimeConfig();
				const currentCreation = resolveOperatorSessionCreation(client);
				const currentModel = resolveSessionModelRef(currentConfig, void 0, agentId);
				const creationError = authorizeGatewaySessionCreation({
					cfg: currentConfig,
					client,
					agentId
				});
				const currentRestriction = preparedRestriction.read();
				if (creationError || !hasGatewayAdminScope(client) || session.sessionRoutingChanged(currentConfig) || currentCreation.actor?.id !== prepared.entry.createdActor?.id || resolveCreatorSandbox(currentConfig, currentCreation) !== prepared.entry.sandbox || currentModel.provider !== resolvedSessionModel.provider || currentModel.model !== resolvedSessionModel.model || currentRestriction?.reason !== details.reason || resolveEffectiveAgentRuntime({
					cfg: currentConfig,
					agentId,
					sessionKey,
					provider: currentModel.provider,
					modelId: currentModel.model
				}) !== runtime) throw new Error(creationError?.message ?? "Native session creation changed before commit.");
			}
		});
	} finally {
		preparedRestriction.release();
	}
	if (!committed.ok) return sessionChanged();
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
	return withPreparedSessionCapabilityRead(() => restrictionFor(context.getRuntimeConfig(), committed.sessionEntry, resolvedSessionModel, committed.sessionEntry));
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
/** An awaited retry comparison must return to current rows before admission can consume it. */
async function withCurrentChatSendRetry(params, ownPendingAttemptId, consume) {
	const withCurrent = (read) => withCurrentChatSendSession({
		session: params.session,
		getRuntimeConfig: params.context.getRuntimeConfig,
		includeMembership: Boolean(params.withPreparedCurrent),
		includeActivePath: params.request.p.queueMode !== "steer",
		includeLifecycle: true,
		consume: (latest, membership, assertSourceCurrent) => {
			const consumeCurrent = () => read(latest);
			if (params.withPreparedCurrent) return params.withPreparedCurrent({
				agentId: latest.agentId,
				storePath: latest.storePath,
				sessionKey: latest.canonicalKey,
				entry: latest.entry,
				readSource: latest.capturedReadSource,
				members: membership.get(latest.legacyKey ?? latest.canonicalKey) ?? []
			}, consumeCurrent, assertSourceCurrent);
			assertSourceCurrent();
			return consumeCurrent();
		}
	});
	const pending = await withCurrent((session) => {
		const comparison = prepareChatSendRetryComparison({
			...params,
			session: {
				...params.session,
				entry: session.entry
			}
		}, ownPendingAttemptId);
		if (comparison) return observeChatSendWork(comparison);
		consume(session, void 0);
	});
	if (pending) {
		const comparison = await pending();
		await withCurrent((session) => consume(session, comparison));
	}
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
	try {
		const assertClientUploadAllowed = captureGatewayClientUploadCommitGuard({
			method: "chat.send",
			requestParams: params,
			client,
			context
		});
		assertClientUploadAllowed?.();
		return {
			ok: true,
			assertClientUploadAllowed
		};
	} catch (error) {
		if (!(error instanceof SessionMutationAuthorizationChangedError)) throw error;
		respond(false, void 0, error.error);
		return { ok: false };
	}
}
/** Release caller authority when admitted work settles. */
function releaseChatSendCallerAuthority(params) {
	try {
		params.operator.release?.();
	} finally {
		if (params.request.providerReviewAcknowledgment) retireProviderReviewAcknowledgment(params.request.providerReviewAcknowledgment);
	}
}
/** Observe started work before the retained read releases; consuming still rethrows its error. */
function observeChatSendWork(work) {
	work.catch(() => {});
	return () => work;
}
/** Interrupt the captured run, or competing admissions, without ever targeting this admission. */
function interruptChatSendWork(params) {
	params.signal.throwIfAborted();
	if (params.target) return interruptReplyRunTarget(params.target, REPLY_RUN_IDLE_SETTLE_TIMEOUT_MS).then(({ settled }) => ({
		interrupted: true,
		settled
	}));
	return params.admission.run(async () => {
		if (!isCompetingSessionWorkAdmissionActive(params.storePath, params.identities)) return {
			interrupted: false,
			settled: true
		};
		return {
			interrupted: true,
			settled: await interruptSessionWorkAdmissions({
				scope: params.storePath,
				identities: params.identities,
				timeoutMs: REPLY_RUN_IDLE_SETTLE_TIMEOUT_MS
			})
		};
	});
}
/** Queued and collected turns share the original session and caller admission until settlement. */
function createChatSendWorkAdmission(params) {
	const storage = params.terminal && getSessionActorStorageBinding({
		agentId: params.terminal.target.agentId,
		sessionKey: params.terminal.target.canonicalKey,
		storePath: params.terminal.storePath
	});
	const inStorage = (run) => storage ? runWithSessionActorStorage(storage, run) : run();
	let references = 1;
	const cleanup = [];
	let admittedSource = params.terminal?.target.readSource;
	let admittedLifecycleRevision = params.terminal?.lifecycleRevision;
	let finishPendingInput;
	let inputActor;
	let actorLifetimeActive = true;
	const releaseAdmission = () => {
		for (const dispose of cleanup.splice(0)) try {
			dispose();
		} catch (error) {
			warnCleanupFailure(error);
		}
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
	const finishRelease = () => {
		if (!inputActor) {
			actorLifetimeActive = false;
			releaseAdmission();
			return;
		}
		const close = async () => {
			try {
				await (await inputActor)?.actor.release();
			} finally {
				actorLifetimeActive = false;
				releaseAdmission();
			}
		};
		close().catch(warnCleanupFailure);
	};
	const release = () => {
		if (references === 0) return;
		references -= 1;
		if (references !== 0) return;
		let pending = void 0;
		try {
			pending = inStorage(() => finishPendingInput?.());
		} catch (error) {
			warnCleanupFailure(error);
		}
		if (pending) pending.then(finishRelease, (error) => {
			warnCleanupFailure(error);
			finishRelease();
		});
		else finishRelease();
	};
	const hold = () => {
		let released = false;
		return () => {
			if (released) return;
			released = true;
			release();
		};
	};
	const retain = () => {
		if (references === 0) throw new Error("cannot retain a released chat work admission");
		references += 1;
		return hold();
	};
	const retainSettlement = (assertOwnerCurrent) => {
		const releaseSettlement = retain();
		let active = true;
		return {
			assertCurrent() {
				if (!active || references === 0) throw new Error("Chat settlement admission was released");
				assertOwnerCurrent();
			},
			release() {
				active = false;
				releaseSettlement();
			}
		};
	};
	const retainTerminalSettlement = () => {
		const terminal = params.terminal;
		if (!terminal || !admittedSource) return;
		return {
			...retainSettlement(() => {
				const registered = terminal.currentRegistration();
				if (!terminal.isActive() || registered && registered !== terminal.sessionBinding) throw new Error("Chat terminal settlement no longer owns its admission");
			}),
			expectedLifecycleRevision: admittedLifecycleRevision,
			target: {
				agentId: terminal.target.agentId,
				storePath: terminal.storePath,
				readSource: admittedSource,
				target: {
					canonicalKey: terminal.target.canonicalKey,
					storeKeys: [...terminal.target.storeKeys]
				}
			}
		};
	};
	return {
		acquireInputActor() {
			if (!inputActor) {
				const terminal = params.terminal;
				if (!terminal || references === 0) throw new Error("Chat input actor has no live admission");
				const assertCurrent = () => {
					if (!actorLifetimeActive || !terminal.isActive()) throw new Error("Chat input actor admission ended");
				};
				const followRegistration = params.followRegistration;
				inputActor = inStorage(() => acquireSessionInputActor({
					agentId: terminal.target.agentId,
					storePath: terminal.storePath,
					readSource: terminal.target.readSource,
					target: {
						canonicalKey: terminal.target.canonicalKey,
						storeKeys: [...terminal.target.storeKeys]
					}
				}, {
					assertCurrent,
					assertReadable: assertCurrent
				}, followRegistration && ((change) => followRegistration({
					sessionKey: terminal.target.canonicalKey,
					agentId: terminal.target.agentId
				}, change))));
			}
			return inputActor;
		},
		addCleanup: (dispose) => cleanup.push(dispose),
		isActive: () => references > 0,
		release: hold(),
		retain,
		async settleTerminal(state) {
			const terminal = params.terminal;
			const settlement = retainTerminalSettlement();
			if (!terminal || !settlement) return false;
			try {
				return await terminalizeRestartSafeChatAdmission({
					...state,
					...settlement,
					admittedSessionId: terminal.admittedSessionId,
					clientRunId: terminal.runId
				});
			} finally {
				settlement.release();
			}
		},
		withInputCommitPublication(run, onCommitted) {
			const terminal = params.terminal;
			if (!terminal) throw new Error("Chat input publication requires its original admission target");
			return inStorage(() => withSessionTranscriptSourcePublication({
				agentId: terminal.target.agentId,
				sessionId: terminal.sessionBinding.sessionId,
				sessionKey: terminal.target.storeKey,
				storePath: terminal.target.storePath
			}, (source, committedEntry) => {
				if (admittedSource && (admittedSource.agentId !== source.agentId || admittedSource.path !== source.path || admittedSource.databaseIdentity !== source.databaseIdentity || admittedSource.databaseBirthtime !== source.databaseBirthtime)) throw new Error("Committed chat input changed its admitted physical source");
				admittedSource ??= source;
				admittedLifecycleRevision = committedEntry.lifecycleRevision;
				onCommitted?.(source, committedEntry);
			}, run));
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
function createChatSendPendingInputAdmission({ runId, expectedProfileId, sessionMutationAuthorization, sessionMutationCommitGuard, assertCustodyLifetimeCurrent, assertClientUploadAllowed }) {
	const assertCustodyCurrent = () => {
		assertCustodyLifetimeCurrent();
		if (sessionMutationAuthorization?.assertAdmittedInputCurrent) sessionMutationAuthorization.assertAdmittedInputCurrent();
		else {
			sessionMutationCommitGuard?.();
			sessionMutationAuthorization?.assertCurrent();
		}
	};
	let preparationFailure;
	const assertAdmittedCurrent = expectedProfileId === void 0 ? assertCustodyCurrent : createMessageInjectionAuthority(() => {
		if (preparationFailure) throw preparationFailure.cause;
		assertCustodyCurrent();
		return true;
	});
	return {
		runId,
		authority: sessionMutationAuthorization?.admittedInputAuthority ? withSessionPendingInputAuthorityGuard(sessionMutationAuthorization.admittedInputAuthority, assertCustodyLifetimeCurrent, expectedProfileId === void 0 ? void 0 : (cause) => {
			preparationFailure ??= { cause };
			assertAdmittedCurrent();
			throw cause;
		}) : void 0,
		assertCurrent: () => {
			assertClientUploadAllowed?.();
			sessionMutationCommitGuard?.();
			assertCustodyCurrent();
		},
		assertAdmittedCurrent
	};
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
	const { request, session, respond, context, client, diagnostics } = params;
	const { p, turnKind } = request;
	const requestIdentity = request.goalOperation?.requestFingerprint ?? request.requestIdentity;
	const progressRefresh = isProgressCardRefreshInputProvenance(request.systemInputProvenance);
	const { clientRunId, storePath, entry, sessionKey, selectedAgent, requestedSessionId, backingSessionId, agentId, resolvedSessionModel, resolvedSessionAuthProvider, activeRunScopeKey, timeoutMs, now, restartSafeRequest, expectedLeafEntryId } = session;
	const cachedMeta = {
		cached: true,
		runId: clientRunId
	};
	const { chatSendTraceAttributes, originatingRoute } = prepareChatSendAdmissionContext(params);
	const lifecycleGeneration = getAgentEventLifecycleGeneration();
	const pendingAttemptId = randomUUID();
	const pendingReservation = createPendingChatSendReservationAccess({
		context,
		client,
		attemptId: pendingAttemptId,
		request,
		session
	});
	const preparedGoalRetry = request.goalOperation ? await prepareGoalChatSendRetry(params) : void 0;
	const pendingRetry = prepareChatSendAdmissionRetry(params);
	const preparedRetry = pendingRetry instanceof Promise ? await pendingRetry : pendingRetry;
	const reserve = () => {
		params.assertCurrent?.();
		const goalRetry = inspectGoalChatSendRetry({
			...params,
			prepared: preparedGoalRetry
		});
		if (goalRetry.kind !== "new") {
			if (goalRetry.kind === "replay") respond(true, {
				...goalRetry.receipt,
				replayed: true
			}, void 0, cachedMeta);
			return;
		}
		const retryComparison = consumeChatSendAdmissionRetry(params, preparedRetry);
		if (retryComparison === false) return;
		const uploadAdmission = admitChatSendUploads({
			params: p,
			client,
			context,
			respond
		});
		if (!uploadAdmission.ok) return;
		params.assertCurrent?.();
		pendingReservation.reserve();
		return {
			retryComparison,
			uploadAdmission
		};
	};
	const reserved = await consumeChatSendCurrent(params, reserve).catch((error) => {
		pendingReservation.clear();
		throw error;
	});
	if (!reserved) return { ok: false };
	let retryComparison = reserved.retryComparison;
	const uploadAdmission = reserved.uploadAdmission;
	const abortPendingChatSend = (stopReason) => writePreRegisteredChatAbort({
		context,
		runId: clientRunId,
		stopReason,
		attemptId: pendingAttemptId,
		requestIdentity
	});
	let admittedSessionId = backingSessionId ?? clientRunId;
	let expectedActiveReplyOperation;
	let replyTargetsCaptured = false;
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
	let abortSession;
	const placementService = context.workerSessionPlacementService;
	const isPendingReservationCurrent = () => {
		if (context.chatRunState.hasAbortMarker(clientRunId)) return false;
		const currentReservation = pendingReservation.read();
		if (currentReservation && normalizeOptionalString(currentReservation.payload.attemptId) !== pendingAttemptId) {
			reservationSuperseded = true;
			return false;
		}
		if (!currentReservation) {
			const terminalResult = readChatSendDedupeResponse(context.dedupe, clientRunId);
			if (terminalResult || context.chatAbortControllers.has(clientRunId)) {
				reservationSuperseded = true;
				supersedingResult = terminalResult;
				return false;
			}
		}
		if (lifecycleGeneration !== getAgentEventLifecycleGeneration()) {
			abortPendingChatSend("restart");
			return false;
		}
		if (!currentReservation || !isFutureDateTimestampMs(currentReservation.payload.expiresAtMs, { nowMs: Date.now() })) {
			abortPendingChatSend("timeout");
			return false;
		}
		return true;
	};
	const commitChatWorkAdmission = async (acpMeta, preparedPlacement) => {
		if (context.workerSessionPlacementService !== placementService) throw new Error("Worker placement owner changed during chat admission; retry.");
		if (restartSafeRequest && !context.getRuntimeConfig().cloudWorkers?.requiredProfile && placementService && preparedPlacement?.sessionId !== admittedSessionId) return withRestartSafeChatPlacement(placementService, admittedSessionId, (prepared) => commitChatWorkAdmission(acpMeta, prepared));
		if (request.goalOperation?.action === "start" && !entry && !requestedSessionId && !preparedGoalEntry) preparedGoalEntry = await prepareChatSendSessionEntry({
			cfg: session.cfg,
			client,
			agentId,
			getRuntimeConfig: context.getRuntimeConfig
		});
		let refreshPlacement = false;
		for (;;) {
			let pendingPlacementRead;
			await withCurrentChatSendRetry(params, pendingAttemptId, (latestSession, comparison) => {
				const currentConfig = context.getRuntimeConfig();
				const localRecovery = restartSafeRequest && !currentConfig.cloudWorkers?.requiredProfile;
				retryComparison = comparison;
				params.assertCurrent?.();
				const retainedRequestConflict = resolveChatSendRequestConflict(params, retryComparison, pendingAttemptId);
				if (retainedRequestConflict) throw new Error(retainedRequestConflict.message);
				if (!isPendingReservationCurrent()) return;
				const latestEntry = latestSession.entry;
				const latestSessionId = latestEntry?.sessionId;
				admittedSessionEntry = latestEntry;
				const requestConflict = resolveChatSendRequestConflict({
					...params,
					session: {
						...session,
						entry: latestEntry
					}
				}, retryComparison, pendingAttemptId);
				if (requestConflict) throw new Error(requestConflict.message);
				admittedSessionSettings = captureAdmittedChatSendSessionSettings({
					commit: true,
					entry: latestEntry,
					expectedPermissionMode: p.expectedPermissionMode,
					expectedToolOverrides: p.expectedToolOverrides
				});
				assertChatSendExclusiveAdmission(request, session);
				if (entry && !latestEntry) throw new Error(`Session "${sessionKey}" was deleted while starting work. Retry.`);
				if (p.queueMode !== "steer" && expectedLeafEntryId !== void 0) assertExpectedLeafActive(latestSession, agentId, expectedLeafEntryId, requestedSessionId, { allowEmptyAncestor: true });
				if (backingSessionId && latestSessionId && latestSessionId !== backingSessionId) throw new Error(`Session "${sessionKey}" changed while starting work. Retry.`);
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
				admittedSessionId = latestSessionId ?? backingSessionId ?? clientRunId;
				if (!replyTargetsCaptured) {
					messageInjectionTarget = p.queueMode === "steer" ? replyRunRegistry.resolveCurrentMessageInjectionTarget(activeRunScopeKey) : void 0;
					runInterruptTarget = p.queueMode === "interrupt" ? replyRunRegistry.resolveCurrentInterruptTarget(activeRunScopeKey) : void 0;
					expectedActiveReplyOperation = replyRunRegistry.get(activeRunScopeKey);
					replyTargetsCaptured = true;
				}
				if (request.goalOperation?.action === "start" && !latestEntry && !requestedSessionId) {
					const prepared = preparedGoalEntry;
					initialSessionEntry = prepared.entry;
					assertInitialSkillSelection = prepared.assertSkillSelection;
					admittedSessionId = initialSessionEntry.sessionId;
				}
				if (context.workerSessionPlacementService !== placementService) throw new Error("Worker placement owner changed during chat admission; retry.");
				const placementChanged = preparedPlacement?.sessionId !== admittedSessionId;
				if (localRecovery && placementService && placementChanged) {
					refreshPlacement = true;
					return;
				}
				const preparedRead = localRecovery ? preparedPlacement?.facts.prepareRead() : void 0;
				if (preparedRead) {
					pendingPlacementRead = observeChatSendWork(preparedRead);
					return;
				}
				const placement = localRecovery ? preparedPlacement?.facts.current() : void 0;
				restartSafeAdmission = resolveRestartSafeChatAdmission({
					activeRunScopeKey,
					agentId,
					cfg: currentConfig,
					clientRunId,
					context,
					entry: latestEntry,
					initialSessionEntry,
					lifecycleTimestamps: latestSession.lifecycleTimestamps,
					acpMeta,
					now: Date.now(),
					placement,
					request: restartSafeRequest,
					requestedSessionId,
					sessionId: admittedSessionId,
					sessionKey: latestSession.canonicalKey,
					storePath: latestSession.storePath
				});
				if (request.goalOperation && !restartSafeAdmission) throw new Error("Goal start or resume requires the built-in OpenClaw runtime and an idle local session with recoverable history. This action is unavailable for native Codex and other external runtimes.");
				if (retryableClaim && !restartSafeAdmission) throw new Error("chat retry does not match its durable admission");
				abortSession = {
					cfg: latestSession.cfg,
					storePath: latestSession.storePath,
					entry: latestEntry ?? initialSessionEntry,
					canonicalKey: latestSession.canonicalKey,
					agentId: latestSession.agentId
				};
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
			}).catch((error) => {
				if (isSessionTranscriptProjectionUnavailableError(error)) isPendingReservationCurrent();
				throw error;
			});
			if (!pendingPlacementRead) break;
			await pendingPlacementRead();
		}
		return refreshPlacement ? commitChatWorkAdmission(acpMeta) : void 0;
	};
	let retainedRequestConflict;
	try {
		try {
			var _usingCtx$2 = _usingCtx();
			const workPhase = _usingCtx$2.u(diagnostics?.scope("detail.admission.work"));
			gatewayWorkAdmission = await beginSessionWorkAdmission({
				agentId,
				scope: storePath,
				isSettling: () => admittedRunAbort?.entry?.terminalOutcomeObserved === true,
				identities: [sessionKey, backingSessionId],
				storeWriterIdentities: [sessionKey, session.sessionTarget.storeKey],
				revalidateAllowed: async () => {
					try {
						var _usingCtx3 = _usingCtx();
						_usingCtx3.u(diagnostics?.scope("detail.admission.revalidate"));
						if (!restartSafeRequest) return await commitChatWorkAdmission(null);
						const latest = await withCurrentChatSendSession({
							session,
							getRuntimeConfig: context.getRuntimeConfig,
							includeMembership: false,
							consume: (current) => current
						});
						const [acpMeta] = await readAcpSessionMetaForEntries({
							cfg: latest.cfg,
							entries: [{
								agentId,
								sessionKey: latest.canonicalKey,
								entry: latest.entry
							}]
						});
						return await commitChatWorkAdmission(acpMeta ?? null);
					} catch (_) {
						_usingCtx3.e = _;
					} finally {
						_usingCtx3.d();
					}
				},
				onInterrupt: (reason) => {
					const stopReason = isAgentRunRestartAbortReason(reason) ? "restart" : "rpc";
					if (!admittedRunAbort) {
						if (!context.chatRunState.hasAbortMarker(clientRunId)) abortPendingChatSend(stopReason);
					} else if (!admittedRunAbort.controller.signal.aborted) {
						if (admittedRunAbort.entry) admittedRunAbort.entry.abortStopReason = stopReason;
						admittedRunAbort.controller.abort(reason);
					}
				}
			});
			workPhase?.finish();
			retainedRequestConflict = await consumeChatSendCurrent(params, () => resolveChatSendRequestConflict(params, retryComparison, pendingAttemptId));
		} catch (_) {
			_usingCtx$2.e = _;
		} finally {
			_usingCtx$2.d();
		}
	} catch (err) {
		pendingReservation.clear();
		admittedRunAbort?.cleanup();
		gatewayWorkAdmission?.release();
		respondChatSendWorkAdmissionFailure(params, err, retryComparison);
		return { ok: false };
	}
	if (retainedRequestConflict) {
		pendingReservation.clear();
		admittedRunAbort?.cleanup();
		gatewayWorkAdmission.release();
		respond(false, void 0, retainedRequestConflict);
		return { ok: false };
	}
	if (requestIdentity !== void 0 && admittedRunAbort?.registered && !reservationSuperseded && !readChatSendDedupeResponse(context.dedupe, clientRunId)) context.dedupe.set(`chat:${clientRunId}`, {
		ts: Date.now(),
		ok: true,
		requestIdentity
	});
	pendingReservation.clear();
	const activeRunAbort = admittedRunAbort;
	if (reservationSuperseded) {
		gatewayWorkAdmission.release();
		const supersedingCached = supersedingResult ?? readChatSendDedupeResponse(context.dedupe, clientRunId);
		if (supersedingCached) {
			respond(supersedingCached.ok, supersedingCached.payload, supersedingCached.error, cachedMeta);
			return { ok: false };
		}
		respond(true, {
			runId: clientRunId,
			status: "in_flight"
		}, void 0, cachedMeta);
		return { ok: false };
	}
	if (lifecycleGeneration !== getAgentEventLifecycleGeneration()) {
		if (activeRunAbort?.entry) activeRunAbort.entry.abortStopReason = "restart";
		activeRunAbort?.controller.abort();
		activeRunAbort?.cleanup();
		gatewayWorkAdmission.release();
		if (!readChatSendDedupeResponse(context.dedupe, clientRunId)) abortPendingChatSend(activeRunAbort?.entry?.abortStopReason ?? "restart");
		const aborted = readChatSendDedupeResponse(context.dedupe, clientRunId);
		respond(aborted?.ok ?? true, aborted?.payload, aborted?.error, cachedMeta);
		return { ok: false };
	}
	if (!activeRunAbort) {
		gatewayWorkAdmission.release();
		const aborted = readChatSendDedupeResponse(context.dedupe, clientRunId);
		if (aborted) {
			respond(aborted.ok, aborted.payload, aborted.error, cachedMeta);
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
		}, void 0, cachedMeta);
		return { ok: false };
	}
	const admission = gatewayWorkAdmission;
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
	let startedWork;
	const startOwnedWork = (work) => startedWork = observeChatSendWork(work);
	try {
		capturedOperator = await retainGatewayOperatorRun({
			...params,
			runId: clientRunId,
			entry: activeRunAbort.entry,
			abortSession
		});
		releaseCallerAuthority = () => {
			try {
				releaseChatSendCallerAuthority({
					operator: capturedOperator,
					request
				});
			} finally {
				session.releaseSessionStorage?.();
			}
		};
		const consumeCurrent = (consume) => consumeChatSendCurrent(params, () => {
			capturedOperator.authority?.assertCurrent();
			return consume();
		});
		if (runInterruptTarget || p.queueMode === "interrupt") {
			const interruption = await (await consumeCurrent(() => ({ interruption: startOwnedWork(interruptChatSendWork({
				target: runInterruptTarget,
				signal: activeRunAbort.controller.signal,
				admission,
				storePath,
				identities: [
					sessionKey,
					backingSessionId,
					admittedSessionId
				]
			})) }))).interruption();
			interruptedActiveRun = interruption.interrupted;
			if (!interruption.settled) {
				cleanupPreDispatchAdmission();
				respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, "Previous run is still shutting down. Please try again in a moment.", {
					retryable: true,
					retryAfterMs: 250
				}));
				return { ok: false };
			}
		}
		const pending = await consumeCurrent(() => {
			activeRunAbort.controller.signal.throwIfAborted();
			releaseGatewayRootContinuation = retainGatewayRootWorkAdmissionContinuation() ?? (() => {});
			return { admission: params.onAdmissionOwned ? startOwnedWork(admission.run(params.onAdmissionOwned)) : void 0 };
		});
		if (pending.admission) {
			if (!await pending.admission()) {
				cleanupPreDispatchAdmission();
				return { ok: false };
			}
			await consumeCurrent(() => void 0);
		}
	} catch (error) {
		await Promise.allSettled(startedWork ? [startedWork()] : []);
		cleanupPreDispatchAdmission();
		throw error;
	}
	const sessionBinding = activeRunAbort.entry;
	const onSessionPrepared = bindChatSendPreparedSession({
		chatAbortControllers: context.chatAbortControllers,
		clientRunId,
		sessionKey,
		sessionBinding,
		lifecycleGeneration,
		admission,
		progressRefresh
	});
	const retainedWork = createChatSendWorkAdmission({
		admission,
		followRegistration: params.followRegistration,
		releaseCallerAuthority,
		releaseGatewayRootContinuation,
		logGateway: context.logGateway,
		terminal: {
			target: session.sessionTarget,
			storePath,
			sessionBinding,
			admittedSessionId,
			runId: clientRunId,
			lifecycleRevision: (admittedSessionEntry ?? initialSessionEntry)?.lifecycleRevision,
			isActive: admission.isActive,
			currentRegistration: () => context.chatAbortControllers.get(clientRunId)
		}
	});
	const { cleanup: cleanupAdmittedRun, setDiscardPreparedMedia } = createAdmittedChatSendCleanup({
		cleanupAbort: activeRunAbort.cleanup,
		releaseRetainedWork: retainedWork.release
	});
	const rejectSessionRoutingChanged = () => {
		cleanupAdmittedRun();
		clearAgentRunContext(clientRunId, lifecycleGeneration);
		respondChatSessionRoutingChanged(respond);
	};
	const finishAborted = () => finishAbortedChatSend({
		context,
		respond,
		runId: clientRunId,
		lifecycleGeneration,
		stopReason: activeRunAbort.entry?.abortStopReason,
		sessionBinding,
		cleanup: cleanupAdmittedRun
	});
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
			cleanupAdmittedRun,
			finishAbortedChatSend: finishAborted,
			gatewayWorkAdmission,
			lifecycleGeneration,
			interruptedActiveRun,
			messageInjectionTarget,
			originatingRoute,
			rejectSessionRoutingChanged,
			releaseSourceWorkAdmission: retainedWork.release,
			retainGatewayWorkAdmission: retainedWork.retain,
			settleTerminal: retainedWork.settleTerminal,
			withInputCommitPublication: retainedWork.withInputCommitPublication,
			acquireInputActor: () => retainedWork.acquireInputActor(),
			setPendingInputCleanup: retainedWork.setPendingInputCleanup,
			assertClientUploadAllowed: uploadAdmission.assertClientUploadAllowed,
			assertWorkAdmissionCurrent: () => {
				const queued = context.chatQueuedTurns.get(clientRunId);
				if (!retainedWork.isActive() || !admission.isActive() || lifecycleGeneration !== getAgentEventLifecycleGeneration() || activeRunAbort.controller.signal.aborted && !(queued?.controller === activeRunAbort.controller && queued.abortable === false)) throw new Error("Chat admission ended or was cancelled; submit a new turn.");
			},
			restartSafeAdmission,
			setDiscardAbandonedPreparedMedia: setDiscardPreparedMedia
		}
	};
}
//#endregion
//#region src/gateway/server-methods/chat-send-setup.ts
/** Normalize, prepare, and exclusively admit one new chat.send request. */
async function prepareAndAdmitChatSend({ params, respond, context, client, hasCurrentClientAuthority, sessionMutationAuthorization }, onAdmissionOwned, options, diagnostics, releaseSessionStorage) {
	const phase = diagnostics?.scope("admission");
	const assertCurrent = sessionMutationAuthorization || hasCurrentClientAuthority ? () => {
		sessionMutationAuthorization?.assertCurrent();
		if (hasCurrentClientAuthority?.() === false) throw new Error("Gateway caller authority is no longer active.");
	} : void 0;
	const withCurrent = sessionMutationAuthorization?.withCurrent;
	const assertCurrentAsync = async () => withCurrent ? withCurrent(() => assertCurrent?.()) : assertCurrent?.();
	const normalization = normalizeChatSendRequest({
		params,
		client,
		...options?.trustedSystemInput ? { trustedSystemInput: true } : {},
		...options?.goalResume ? { goalResume: options.goalResume } : {},
		...options?.providerReviewAcknowledgment ? { providerReviewAcknowledgment: options.providerReviewAcknowledgment } : {}
	});
	const normalizedRequest = normalization instanceof Promise ? await normalization : normalization;
	if (!normalizedRequest.ok) {
		respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, normalizedRequest.error, normalizedRequest.reason ? { details: { reason: normalizedRequest.reason } } : void 0));
		return;
	}
	if (normalization instanceof Promise || normalizedRequest.value.goalOperation) try {
		assertCurrent?.();
	} catch (error) {
		respondChatSendAdmissionError(error, respond);
		return;
	}
	const loadedSession = await prepareChatSendSession({
		request: normalizedRequest.value,
		context,
		client,
		isDirectExternalUser: options?.isDirectExternalUser,
		assertCurrent
	});
	if (!loadedSession.ok) {
		respond(false, void 0, typeof loadedSession.error === "string" ? errorShape(ErrorCodes.INVALID_REQUEST, loadedSession.error) : loadedSession.error);
		return;
	}
	if (normalizedRequest.value.mentions) {
		const mentions = await context.mentionInbox?.validateRecipientsAsync(client, loadedSession.value.entry ? {
			sessionKey: loadedSession.value.sessionKey,
			agentId: loadedSession.value.agentId
		} : { agentId: loadedSession.value.agentId }, normalizedRequest.value.mentions.map((mention) => mention.profileId));
		if (!mentions?.ok) {
			respond(false, void 0, mentions?.error ?? errorShape(ErrorCodes.UNAVAILABLE, "Human mentions are unavailable; reconnect and retry."));
			return;
		}
	}
	phase?.mark("authority");
	const preparation = {
		request: normalizedRequest.value,
		session: loadedSession.value,
		respond,
		context,
		client,
		assertCurrent,
		assertCurrentAsync,
		withCurrent
	};
	if (!await runChatSendPreAdmission(preparation)) return;
	let session;
	try {
		session = await qualifyChatSendSession(loadedSession.value, releaseSessionStorage);
	} catch (error) {
		respondChatSendAdmissionError(error, respond);
		return;
	}
	const nativeRestriction = await prepareChatSendNativeRuntimeRestriction({
		...preparation,
		session
	});
	if (nativeRestriction) {
		respond(false, void 0, nativeRestriction);
		return;
	}
	phase?.mark("runAdmission");
	const admitted = await admitChatSend({
		...preparation,
		session,
		onAdmissionOwned,
		hasCurrentClientAuthority,
		withPreparedCurrent: sessionMutationAuthorization?.withPreparedCurrent,
		followRegistration: sessionMutationAuthorization?.followRegistration,
		diagnostics
	});
	if (!admitted.ok) return;
	phase?.finish();
	return {
		request: normalizedRequest.value,
		session,
		admission: admitted.value
	};
}
//#endregion
//#region src/gateway/server-methods/chat-user-turn-recorder.ts
function createGatewayChatUserTurnController(params) {
	const { admission, request, session } = params;
	const progressRefresh = isProgressCardRefreshInputProvenance(request.systemInputProvenance);
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
		...request.systemInputProvenance ? { provenance: request.systemInputProvenance } : admission.restartSafeAdmission && params.isDirectExternalUser ? { provenance: { kind: "external_user" } } : {}
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
			startedAt: params.startedAt,
			...!progressRefresh ? { lastInteractionAt: params.startedAt } : {},
			sourceIngress: isBrowserOperatorUiClient(request.clientInfo) ? "control-ui" : "internal",
			operatorSource: admission.restartSafeAdmission.retryExpectedState ? void 0 : createRestartRecoveryOperatorSource({
				authority: admission.operatorAuthority,
				entry: admission.admittedSessionEntry ?? admission.initialSessionEntry,
				agentId: session.agentId,
				sessionKey: session.sessionKey,
				sourceRunId: session.clientRunId,
				inputProvenance: request.systemInputProvenance
			})
		}) : {},
		errorContext: "gateway chat user turn transcript",
		assertOriginalInputCommit: composeSessionSourceAssertion([params.assertOriginalInputCommit, admission.operatorAuthority?.assertCurrent]),
		beforeMessageWrite: (event) => {
			const originalInput = event.message.idempotencyKey === sourceId;
			const next = runAgentHarnessBeforeMessageWriteHook(event);
			if (originalInput && next?.role === "user") {
				const metadata = { ...asOptionalRecord(Reflect.get(next, "__openclaw")) };
				delete metadata.chatRequestIdentity;
				return {
					...next,
					...contextFreeCommand ? { excludeFromContext: true } : {},
					__openclaw: {
						...metadata,
						...request.requestIdentity ? { chatRequestIdentity: request.requestIdentity } : {},
						...contextFreeCommand ? { contextFreeCommand: true } : {}
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
				excerpt: text
			});
			mentionCommit.catch(onPersistenceError);
		} } : {}
	});
	bindUserTurnInputActor(recorder, {
		phase: "acceptInput",
		acquire: admission.acquireInputActor
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
		getSessionInitializationOptions: () => ({
			requestedSessionId: session.requestedSessionId,
			resumeRequestedSession: request.reconnectResumeRequested,
			...admission.restartSafeAdmission ? {
				expectedExistingSessionId: admission.admittedSessionId,
				pinExpectedExistingSession: true,
				newlyCreatedSessionId: admission.initialSessionEntry?.sessionId,
				...recorder.hasPersisted() && !progressRefresh ? { recordedSessionActivity: {
					sessionId: admission.admittedSessionId,
					sessionKey: session.sessionKey,
					at: params.startedAt
				} } : {}
			} : session.entry?.sessionId ? { expectedExistingSessionId: session.entry.sessionId } : {}
		}),
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
//#region src/gateway/server-methods/chat-send-input-dispatch.ts
const mediaDocumentContextLoader = createLazyImportLoader(() => import("./file-context-Br2_zP12.mjs"));
/** Owns input custody and ACK timing through the detached dispatch handoff. */
async function handleChatSendWithStorage(handlerOptions, onAdmissionOwned, externalAuthorityAdmission, options, storage) {
	try {
		var _usingCtx$1 = _usingCtx();
		const { req, respond, context, client, hasCurrentClientAuthority, sessionMutationAuthorization, sessionMutationCommitGuard } = handlerOptions;
		const releaseSessionAuthorization = sessionMutationAuthorization?.takeRelease?.() ?? sessionMutationAuthorization?.release;
		const diagnostics = _usingCtx$1.u(readChatSendDiagnostics(handlerOptions) ?? startChatSendDiagnostics(context.logGateway));
		const isDirectExternalUser = externalAuthorityAdmission !== void 0 && isDirectGatewayUserClient(client);
		const setup = await prepareAndAdmitChatSend(handlerOptions, onAdmissionOwned, {
			...options,
			isDirectExternalUser
		}, diagnostics, storage ? () => storage.release() : void 0).catch((error) => {
			releaseSessionAuthorization?.();
			throw error;
		});
		if (!setup) {
			releaseSessionAuthorization?.();
			return;
		}
		storage?.retain();
		const { request, session, admission } = setup;
		admission.setPendingInputCleanup(() => releaseSessionAuthorization?.());
		const admittedCleanup = _usingCtx$1.u({
			dispatched: false,
			[Symbol.dispose]() {
				if (!this.dispatched) admission.cleanupAdmittedRun();
			}
		});
		const { p, systemInputProvenance, reconnectResumeRequested } = request;
		const { clientRunId, cfg, storePath, entry, sessionKey, sessionRoutingChanged, selectedAgent } = session;
		const { activeRunAbort, admittedSessionId, chatSendTraceAttributes, finishAbortedChatSend, interruptedActiveRun, lifecycleGeneration, messageInjectionTarget, restartSafeAdmission } = admission;
		const phase = diagnostics.scope("attachments");
		const preparedAttachments = await prepareChatSendAttachments({
			...setup,
			client,
			respond,
			context
		});
		if (!preparedAttachments.ok) return;
		const bindPreparedMediaRecorder = bindChatSendPreparedMediaCustody({
			admission,
			attachments: preparedAttachments.value
		});
		const settleInterruptedPreparation = () => {
			if (activeRunAbort.controller.signal.aborted) finishAbortedChatSend();
			else if (sessionRoutingChanged(context.getRuntimeConfig())) admission.rejectSessionRoutingChanged();
			else return false;
			return true;
		};
		if (settleInterruptedPreparation()) return;
		const { imageOrder, prepareAttachmentsMs } = preparedAttachments.value;
		phase?.mark("authority");
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
		const admissionStartedAt = Date.now();
		const terminalizeRestartSafeAdmission = (terminalState) => admission.settleTerminal({
			...terminalState,
			startedAt: admissionStartedAt
		});
		const commitFreshInput = restartSafeAdmission !== void 0 && !restartSafeAdmission.retryExpectedState;
		const commitInitialInput = req.method === "sessions.create" && commitFreshInput;
		let inputAdmissionAttempted = false;
		let replyAdmissionTicket;
		let releaseBeforeDispatch = void 0;
		let dashboardAuthority;
		try {
			try {
				var _usingCtx3 = _usingCtx();
				const assertCustodyLifetimeCurrent = () => {
					admission.assertWorkAdmissionCurrent();
					if (sessionRoutingChanged(context.getRuntimeConfig())) throw new Error("Session routing changed before input admission; refresh and retry.");
				};
				const assertInputAdmissionCurrent = composeSessionSourceAssertion([sessionMutationCommitGuard], (assertSource) => {
					admission.assertClientUploadAllowed?.();
					assertCustodyLifetimeCurrent();
					if (commitFreshInput) sessionMutationAuthorization?.assertCurrent();
					assertSource();
				});
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
					...setup,
					client,
					transcript: options?.transcript,
					isDirectExternalUser,
					startedAt: admissionStartedAt,
					warn: (message) => context.logGateway.warn(message),
					mentionInbox: context.mentionInbox,
					assertOriginalInputCommit: composeSessionSourceAssertion([assertInputAdmissionCurrent, commitInitialInput ? sessionMutationAuthorization?.assertCurrent : void 0]),
					goalCommitGuard
				});
				const { persist: persistUserTurnTranscript, recorder: userTurnRecorder, replyContextFieldsPromise } = userTurn;
				let needsSessionCreationBinding = !entry;
				const withUserTurnInputPublication = (run) => admission.withInputCommitPublication(run, entry ? void 0 : (source, committedEntry) => {
					sessionMutationAuthorization?.recordCreatedSession?.({
						agentId: session.agentId,
						sessionKey,
						storePath,
						sessionId: admittedSessionId,
						lifecycleRevision: committedEntry.lifecycleRevision,
						readSource: source,
						entry: committedEntry
					});
					needsSessionCreationBinding = false;
				});
				const persistGatewayUserTurnTranscript = (...args) => withUserTurnInputPublication(() => persistUserTurnTranscript(...args));
				const persistGatewayUserTurnTranscriptBestEffort = (...args) => withUserTurnInputPublication(() => userTurn.persistBestEffort(...args));
				bindPreparedMediaRecorder(userTurnRecorder);
				phase?.mark("preparation");
				const preparedUserTurn = prepareChatSendUserTurn({
					...setup,
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
						dashboardAuthority?.release();
						releaseSessionAuthorization?.();
						preparedUserTurn.discardUnreferencedMedia(userTurnRecorder.getPendingInputMessage?.()).catch((error) => context.logGateway.warn(`Failed to discard unused chat media: ${String(error)}`));
					}
				});
				phase?.mark("persist");
				let approvedInput;
				let stageInput = Boolean(entry?.sessionId && userTurn.baseInput.display !== false && (!systemInputProvenance || systemInputProvenance.kind === "external_user") && !isInternalTextSlashCommandTurn && !request.goalOperation && !restartSafeAdmission?.retryExpectedState && !commitInitialInput);
				if (stageInput && restartSafeAdmission) {
					inputAdmissionAttempted = true;
					const input = await admission.acquireInputActor();
					if (input) stageInput = await withSessionInputActor({
						phase: "acceptInput",
						acquire: async () => input
					}, async () => {
						const store = await preparePendingInputStore({
							agentId: session.agentId,
							sessionKey,
							sessionId: admittedSessionId,
							storePath
						}, assertCustodyLifetimeCurrent);
						try {
							const source = await store.read({
								kind: "source",
								sessionKey: store.sessionKey,
								sessionId: admittedSessionId,
								idempotencyKey: userTurn.baseInput.idempotencyKey,
								pendingOnly: true
							});
							assertCustodyLifetimeCurrent();
							store.assertCurrent();
							if (source.kind !== "source") throw new Error("Submitted input returned a different operation");
							return Boolean(source.current && source.pending);
						} finally {
							await store.release();
						}
					});
				}
				if (stageInput) try {
					var _usingCtx4 = _usingCtx();
					inputAdmissionAttempted = true;
					const stagePhase = _usingCtx4.u(diagnostics.scope("detail.persist.stage"));
					const staged = await userTurnRecorder.stageApproved?.(createChatSendPendingInputAdmission({
						runId: clientRunId,
						expectedProfileId: req.expectedProfileId,
						sessionMutationAuthorization,
						sessionMutationCommitGuard,
						assertCustodyLifetimeCurrent,
						assertClientUploadAllowed: admission.assertClientUploadAllowed
					}));
					stagePhase?.finish();
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
					approvedInput = userTurnRecorder.getPendingInputMessage?.();
					emitSessionsChanged(context, {
						sessionKey,
						agentId: selectedAgent.agentId,
						reason: "send"
					}, { accessChanged: false });
				} catch (_) {
					_usingCtx4.e = _;
				} finally {
					_usingCtx4.d();
				}
				let goalResult;
				if (restartSafeAdmission) try {
					var _usingCtx5 = _usingCtx();
					inputAdmissionAttempted = true;
					const transcriptPhase = _usingCtx5.u(diagnostics.scope("detail.persist.transcript"));
					const persistedUserTurn = await persistGatewayUserTurnTranscript();
					transcriptPhase?.finish();
					if (commitInitialInput || !request.goalOperation && commitFreshInput) approvedInput = persistedUserTurn?.message;
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
					if (!persistedUserTurn || persistedUserTurn.sessionEntry?.restartRecoveryDeliveryRunId !== clientRunId || persistedUserTurn.sessionEntry.restartRecoveryDeliverySourceRunId !== clientRunId) throw new Error("chat turn was not durably admitted");
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
				} catch (_) {
					_usingCtx5.e = _;
				} finally {
					_usingCtx5.d();
				}
				if (approvedInput) preparedUserTurn.applyApprovedText(extractTextFromChatContent(approvedInput.content, {
					joinWith: "\n",
					normalizeText: (value) => value
				}) ?? "");
				const dashboardPhase = _usingCtx3.u(diagnostics.scope("detail.persist.authority"));
				dashboardAuthority = await createChatSendDashboardAuthority({
					admission,
					session,
					client,
					context,
					hasCurrentClientAuthority,
					sessionMutationCommitGuard,
					sessionMutationAuthorization,
					externalAuthorityAdmission,
					externalAdmissionParams
				});
				dashboardPhase?.finish();
				const assertDashboardReadCurrent = dashboardAuthority.assertReadCurrent;
				dashboardAuthority.bindPromptRecorder(userTurnRecorder);
				phase?.mark("preparation");
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
				if (settleInterruptedPreparation()) return;
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
				phase?.mark("replyContext");
				if (preAckReplyContextPromise) {
					applyChatSendReplyContextFields(ctx, await preAckReplyContextPromise);
					if (settleInterruptedPreparation()) return;
				}
				assertInputAdmissionCurrent();
				let messageInjectionAttempt = !p.replyToId || preAckReplyContextPromise ? await beginCapturedMessageInjection() : void 0;
				phase?.mark("runAdmission");
				const preAckInjection = await settleChatSendPreAckMessageInjection({
					attempt: messageInjectionAttempt,
					isAborted: () => activeRunAbort.controller.signal.aborted,
					sessionRoutingChanged: () => sessionRoutingChanged(context.getRuntimeConfig()),
					onAborted: finishAbortedChatSend,
					onSessionRoutingChanged: admission.rejectSessionRoutingChanged
				});
				if (preAckInjection.status === "handled") return;
				messageInjectionAttempt = preAckInjection.attempt;
				phase?.mark("effects");
				const { serverTiming, chatSendTiming, ackReadyEvent } = prepareChatSendAckTiming({
					client,
					request,
					session,
					prepareAttachmentsMs,
					chatSendTraceAttributes
				});
				if (options?.beforeDispatch) {
					assertInputAdmissionCurrent();
					releaseBeforeDispatch = await options.beforeDispatch({
						runId: clientRunId,
						assertCurrent: assertInputAdmissionCurrent,
						assertWorkAdmissionCurrent: () => {
							admission.assertClientUploadAllowed?.();
							admission.assertWorkAdmissionCurrent();
						}
					});
					assertInputAdmissionCurrent();
				}
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
				emitDiagnosticsTimelineEvent(ackReadyEvent(ackPayload.status), { config: cfg });
				assertInputAdmissionCurrent();
				admission.setDiscardAbandonedPreparedMedia(void 0);
				replyAdmissionTicket = reserveReplyAdmissionTicket([ctx.SessionKey, ctx.CommandTargetSessionKey]);
				phase?.mark("response");
				respond(true, ackPayload, void 0, { runId: clientRunId });
				phase?.finish();
				diagnostics.acknowledge(messageInjectionAttempt ? "steer" : "startup");
				context.recordClientActivity?.(client);
				const chatSendAckedAtMs = chatSendTiming?.ackedAtMs ?? performance.now();
				releaseBeforeDispatch = void 0;
				const dispatch = {
					...setup,
					replyAdmissionTicket,
					diagnostics,
					admissionStartedAt,
					attachments: preparedAttachments.value,
					client,
					context,
					toolsAllow: options?.toolsAllow,
					prepareAssistantTranscriptMessage: options?.prepareAssistantTranscriptMessage,
					skillLibrary: {
						sessionKey,
						owner: {
							client,
							context,
							sessionMutationCommitGuard: () => {
								sessionMutationCommitGuard?.();
								admission.assertWorkAdmissionCurrent();
							}
						},
						isHumanTurn: !options && !systemInputProvenance && !reconnectResumeRequested && request.turnKind === "main"
					},
					cronCreatorAuthority,
					assertDashboardReadCurrent,
					getSessionInitializationOptions: createChatSendSessionInitialization({
						sessionKey,
						agentId: session.agentId,
						authorization: sessionMutationAuthorization,
						needsCreationBinding: needsSessionCreationBinding,
						getSessionInitializationOptions: userTurn.getSessionInitializationOptions
					}),
					externalAuthorityAdmission,
					injection: {
						beginCapturedMessageInjection,
						messageInjectionAttempt,
						preAckReplyContextPromise,
						replyContextFieldsPromise
					},
					terminalizeRestartSafeAdmission,
					timing: {
						chatSendAckedAtMs,
						chatSendTiming
					},
					turn: preparedUserTurn,
					userTurn: {
						...userTurn,
						persist: persistGatewayUserTurnTranscript,
						persistBestEffort: persistGatewayUserTurnTranscriptBestEffort
					}
				};
				withoutGatewayToolCallerIdentity(() => runOutsideOperatorToolGatewayAuthority(() => startChatDispatch(dispatch)));
				admittedCleanup.dispatched = true;
			} catch (_) {
				_usingCtx3.e = _;
			} finally {
				_usingCtx3.d();
			}
		} catch (err) {
			dashboardAuthority?.release();
			releaseBeforeDispatch?.();
			replyAdmissionTicket?.release();
			await handleChatSendSetupError({
				cacheResult: request.goalOperation === void 0 && !inputAdmissionAttempted,
				admission,
				context,
				error: err,
				respond,
				session,
				terminalizeRestartSafeAdmission
			});
		}
	} catch (_) {
		_usingCtx$1.e = _;
	} finally {
		_usingCtx$1.d();
	}
}
//#endregion
//#region src/gateway/server-methods/chat-send-storage.ts
async function runChatSendWithStorage(handlerOptions, run) {
	const rawKey = handlerOptions.params.sessionKey;
	if (typeof rawKey !== "string" || !isIncognitoSessionKey(rawKey)) return run();
	const cfg = handlerOptions.context.getRuntimeConfig();
	const requested = resolveRequestedSessionAgentId(cfg, rawKey, typeof handlerOptions.params.agentId === "string" ? handlerOptions.params.agentId : void 0);
	if (!requested.ok) {
		handlerOptions.respond(false, void 0, requested.error);
		return;
	}
	let active = true;
	let retained = false;
	const assertCurrent = () => {
		if (!active) throw new Error("Chat session storage admission ended");
	};
	const binding = await acquireSessionActorStorage({
		sessionKey: resolveChatSendSessionKey(cfg, rawKey, requested.agentId),
		agentId: requested.agentId
	}, {
		lifetime: {
			assertCurrent,
			assertReadable: assertCurrent
		},
		authority: {
			assertCurrent,
			authorize: assertCurrent
		}
	});
	if (!binding) {
		handlerOptions.respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `Incognito session "${resolveChatSendSessionKey(cfg, rawKey, requested.agentId)}" was not found.`));
		return;
	}
	const release = () => {
		if (!active) return;
		active = false;
		binding.actor.release().catch((error) => {
			handlerOptions.context.logGateway.warn(`Chat session storage cleanup failed: ${String(error)}`);
		});
	};
	try {
		await runWithSessionActorStorage(binding, () => run({
			release,
			retain() {
				retained = true;
			}
		}));
	} finally {
		if (!retained) release();
	}
}
//#endregion
//#region src/gateway/server-methods/chat-send-handler.ts
async function handleChatSendWithOptions(handlerOptions, onAdmissionOwned, externalAuthorityAdmission, options) {
	await runChatSendWithStorage(handlerOptions, (storage) => handleChatSendWithStorage(handlerOptions, onAdmissionOwned, externalAuthorityAdmission, options, storage));
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
/** Dispatches Gateway-authored system input without widening the public chat-send contract. */
async function handleTrustedInternalChatSend(options, onAdmissionOwned, inputOptions) {
	await handleChatSendWithOptions(options, onAdmissionOwned, void 0, {
		...inputOptions,
		trustedSystemInput: true
	});
}
//#endregion
export { handleTrustedInternalChatSend as i, handleProviderReviewContinuationChat as n, handleSessionGoalResumeChat as r, handleChatSend as t };
