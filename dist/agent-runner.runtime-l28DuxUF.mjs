import { S as parseStrictInteger, f as asSafeIntegerInRange, l as asNonNegativeFiniteNumber, s as asFiniteNumber } from "./number-coercion-CLj0HTDM.mjs";
import "./src-CZ2wJvNB.mjs";
import { n as estimateStringChars } from "./cjk-chars-6ld30jSx.mjs";
import { t as expectDefined } from "./expect-lbe3Hgrh.mjs";
import { a as asOptionalRecord, c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { g as readStringValue, l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty, t as hasNonEmptyString } from "./string-coerce-CIXf7egm.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { r as defaultRuntime } from "./runtime-BC29JSZp.mjs";
import { t as expandHomePrefix } from "./home-dir-BKwhAL2c.mjs";
import { a as getGatewayContextResolver, t as bindGatewayContextResolver } from "./gateway-context-binding-VqB7gkMe.mjs";
import { i as getPluginRuntimeGatewayRequestScope, o as withPluginRuntimeGatewayContextResolver } from "./gateway-request-scope-BLBH-Gpf.mjs";
import { t as createLazyImportLoader } from "./lazy-promise-DGqyc4Y4.mjs";
import { n as buildModelCatalogRef } from "./model-catalog-refs-B9ftF0Cz.mjs";
import { m as resolveDefaultAgentId, r as resolveAgentConfig } from "./agent-scope-config-IQKOEtZ4.mjs";
import { A as formatRawAssistantErrorForUi } from "./redact-B5EGyLvV.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { C as createChildDiagnosticTraceContext, D as freezeDiagnosticTraceContext, f as isDiagnosticsEnabled, o as emitTrustedDiagnosticEvent } from "./diagnostic-events-CVabF32H.mjs";
import { n as sanitizeForLog } from "./ansi-CWsy0bu4.mjs";
import { t as createSubsystemLogger } from "./subsystem-DleLyu58.mjs";
import { o as measureDiagnosticsTimelineSpan } from "./diagnostics-timeline-uuHa_36_.mjs";
import { i as getNodeSqliteKysely, n as executeSqliteQuerySync } from "./kysely-sync-Bn6Qrpbz.mjs";
import "./strip-inbound-meta-Cqak81y4.mjs";
import { a as isSilentReplyPrefixText, c as stripLeadingSilentToken, i as isSilentReplyPayloadText, n as SILENT_REPLY_TOKEN, o as isSilentReplyText, s as startsWithSilentToken } from "./tokens-BTKQYTUd.mjs";
import { a as isRuntimeToolAllowed } from "./tool-policy-match-Bv2XOvEF.mjs";
import "./defaults-BbU4k6fu.mjs";
import "./agent-runtime-id-9mBje111.mjs";
import { v as resolveModelRefFromString } from "./model-selection-shared-0uvJbX1M.mjs";
import { i as resolveSessionAuthProfileOverrideSource, r as resolveCollapsedSessionAuthPinSource } from "./auth-profile-override-provenance-B84_9MMh.mjs";
import { E as hasSessionAutoModelFallbackProvenance, h as resolveModelFallbackAvailability, i as markAutoFallbackPrimaryProbe, k as resolveSessionModelOverrideRouteResolution, n as entryMatchesAutoFallbackPrimaryProbe, p as resolveAutoFallbackPrimaryProbe, t as clearAutoFallbackPrimaryProbeSelection } from "./agent-scope-CTuYDtny.mjs";
import { n as findModelInCatalog } from "./model-catalog-lookup-C3iQmurZ.mjs";
import { d as resolveEffectiveResponseUsage, u as normalizeVerboseLevel } from "./thinking.shared-BKzBCWpI.mjs";
import { u as resolveOpenAIRuntimeProvider } from "./openai-routing-BspGC-O6.mjs";
import { t as createDedupeCache } from "./dedupe-wpcRBJWZ.mjs";
import { i as logVerbose } from "./globals-QODkv80i.mjs";
import { r as getRuntimeConfig } from "./io.runtime-CZWcIUDk.mjs";
import "./config-DryArA1l.mjs";
import { a as generateSecureUuid } from "./secure-random-BJtJxP9Y.mjs";
import { s as normalizeDeliveryContext } from "./delivery-context.shared-CW8dxG7X.mjs";
import { a as resolveMessageChannel } from "./message-channel-normalize-2tAtQt1g.mjs";
import { a as isInternalMessageChannel, o as isMarkdownCapableMessageChannel } from "./message-channel-DDcHHhpX.mjs";
import { _t as AgentActivityItemSchema } from "./sessions-KsldKmtI.mjs";
import { t as GatewayDrainingError } from "./gateway-work-admission-CHv_0noy.mjs";
import { r as leaseMcpAppModelContextForTurn } from "./mcp-app-model-context-nV9u20zq.mjs";
import { s as peekSessionMcpRuntime } from "./agent-bundle-mcp-manager-api-BwOPQ1t_.mjs";
import { _ as registerAgentRunContext, a as clearAgentRunContext } from "./agent-run-registry-DO6Dg2r0.mjs";
import { i as emitAgentEvent, n as captureAgentRunLifecycleGeneration, p as onAgentEventForRun, y as withAgentRunLifecycleGeneration } from "./agent-events-BOSJcayE.mjs";
import { y as ensureMessageToolRunOutcomeSchema } from "./openclaw-agent-db-identity-DLTnzTd_.mjs";
import { t as normalizeChatType } from "./chat-type-Dbv0JQHI.mjs";
import { f as runOpenClawAgentWriteTransaction, l as openOpenClawAgentDatabase } from "./openclaw-agent-db-CaQAStOA.mjs";
import { o as classifyOAuthRefreshFailure, s as classifyOAuthRefreshFailureError } from "./oauth-refresh-failure-CVji5U1C.mjs";
import { T as setReplyPayloadMetadata, _ as isReplyPayloadTerminalContent, a as copyReplyPayloadMetadata, d as isFastModeAutoProgressPayload, f as isRenderablePayload, h as isReplyPayloadStatusNotice, s as getReplyPayloadMetadata, t as FAST_MODE_AUTO_PROGRESS_KIND, x as markReplyPayloadForSourceSuppressionDelivery } from "./reply-payload-B2ZQhznY.mjs";
import { s as withSystemEventOwner } from "./system-event-ownership-CHVGbaAW.mjs";
import { i as enqueueSystemEvent } from "./system-events-ANKIkU0W.mjs";
import { t as resolveAgentHarnessPolicy } from "./policy-DYrfsfP0.mjs";
import { l as readChannelContextGatewayContextResolver } from "./admission-evidence-aqOMZf0e.mjs";
import { l as captureCommandOwnerAssertion } from "./command-auth-rFSl4uOZ.mjs";
import { r as isIngressAdoptionLostError } from "./ingress-drain-Drc4V_K5.mjs";
import "./thinking-B1p5pEC8.mjs";
import { i as resetRegisteredAgentHarnessSessions } from "./registry-1lXXOteg.mjs";
import { o as resolveModelAuthMode } from "./model-auth-D3hh0-wa.mjs";
import { s as isCliProvider, u as resolvePersistedOverrideModelRef } from "./model-selection-CFnUi6iD.mjs";
import { a as isFailoverError } from "./error-ON38hPhx.mjs";
import { i as isAgentHarnessPreflightError } from "./errors-Bd6GQRkh.mjs";
import { n as getCliSessionBinding, t as clearAllCliSessions } from "./cli-session-binding-BhV_HbVa.mjs";
import { h as resolveSessionPinnedHarnessId } from "./agent-harness-session-key-CQ6tTBOH.mjs";
import { i as resolveCliBackendConfig } from "./cli-backends-CNff5-1q.mjs";
import { s as resolveCliRuntimeExecutionProvider, t as areRuntimeModelRefsEquivalent } from "./model-runtime-aliases-DZSSnYMd.mjs";
import { i as resolveSessionRuntimeOverrideForProvider } from "./session-runtime-compat-CJOaEEoJ.mjs";
import { o as isAudioFileName } from "./mime-1zBUMwu6.mjs";
import { n as sessionDeliveryChannel } from "./delivery-context.read-CR06zOJ4.mjs";
import { g as toDatabaseOptions, u as resolveSqliteScope } from "./session-accessor.sqlite-scope-DHC66DLY.mjs";
import { s as sessionPersonalProfileId } from "./session-entry-provenance-C-JyMH54.mjs";
import { u as stripHeartbeatToken } from "./heartbeat-vWflpIwS.mjs";
import { r as resolveGroupSessionKey } from "./group-B8HN3m8j.mjs";
import { i as classifyAgentRunTerminalOutcome } from "./agent-run-terminal-outcome-CgoAW2Q7.mjs";
import { l as readPendingUserTurnTranscriptAdmission } from "./session-transcript-read-fence-Crjo4FKU.mjs";
import { i as appendTranscriptMessage } from "./session-accessor.sqlite-transcript-write-CM5480eZ.mjs";
import { o as trimTextPreservingCode } from "./text-projection-DLGaFuGQ.mjs";
import { n as parseInlineDirectives } from "./directive-tags-D9uZSb5h.mjs";
import { c as resolveSessionPluginTraceLines, s as resolveSessionPluginStatusLines } from "./types-ByCc34Vn.mjs";
import { d as patchSessionEntryCore, l as loadSessionEntryReadOnly, s as loadSessionEntry } from "./session-accessor.sqlite-entry-BTkJgNr-.mjs";
import "./session-accessor-C05KQ5A3.mjs";
import { i as persistSessionResetLifecycle, l as updateSessionEntry } from "./session-accessor.reset-b9w8ccQ2.mjs";
import { i as ModelSelectionLockedError, r as MODEL_SELECTION_LOCKED_RESET_MESSAGE, s as isModelSelectionLocked } from "./model-overrides-FXSJttoI.mjs";
import { a as hasBillableUsage, d as toDiagnosticUsage, i as deriveSessionTotalTokens, n as deriveContextPromptTokens, o as hasNonzeroUsage } from "./usage-XXLoqJQC.mjs";
import { i as hasRestartRecoverySourceClaim } from "./restart-recovery-state-CVOwSXMV.mjs";
import { i as buildAgentRunTerminalOutcomeFromLifecycleEvent } from "./agent-run-terminal-outcome-Dto4EMdr.mjs";
import { m as resolveAgentRunErrorLifecycleFields, p as resolveAgentRunAbortLifecycleFields, s as createAgentRunSupersededAbortError, u as isAgentRunRestartAbortReason } from "./run-termination-Cd1iJzC7.mjs";
import { n as isAgentPlanProgressToolName } from "./progress-card-input-CXyAxVII.mjs";
import { g as renderFailoverCodeUserCopy, h as renderControlUiAgentFailureCopy, i as PROVIDER_CONVERSATION_STATE_ERROR_USER_MESSAGE, r as HEARTBEAT_EXTERNAL_RUN_FAILURE_TEXT, y as renderRateLimitOrOverloadedCopy } from "./user-copy-DfLWtdTx.mjs";
import { d as stripLegacyBracketToolCallBlocks } from "./assistant-visible-text-CVgfl6Gk.mjs";
import { i as sanitizeUserFacingText, n as renderUserFacingText } from "./user-facing-text-D8c_iKUB.mjs";
import { a as resolveSourceReplyExpectation, c as isSyntheticSourceReplyTurn, d as resolveReplyExpectation, l as observeReplyDelivery, o as resolveSourceReplyVisibilityPolicy, u as resolveReplyCompletion } from "./source-reply-delivery-mode-Byvky-I7.mjs";
import { _ as shouldPreserveUserFacingSessionStateForInputProvenance, g as progressCardRefreshRunProjection } from "./input-provenance-C4tQegGN.mjs";
import { c as resolveFastModeForElapsed, n as formatFastModeAutoProgressText } from "./fast-mode-CF9HctjM.mjs";
import { i as hasNewGeneratedMediaTaskForSessionKey, r as getGeneratedMediaTaskIdsForSessionKey } from "./task-status-access-BPrGRqBY.mjs";
import { t as beginReplyOperationFinalizationWork } from "./reply-run-finalization-lease-rtDY_Nul.mjs";
import { C as markReplyOperationExecutionStarted, L as retainReplyOperationUntilComplete, f as hasCommittedReplyOperationOutcome, p as hasReplyOperationExecutionStarted, z as runAfterReplyOperationClear } from "./reply-run-registry.state-C5EjI8Kf.mjs";
import { i as QuestionDispatchUnsupportedError, n as QuestionAnswerUnconfirmedError, r as QuestionDispatchRefusedError } from "./gateway-question-dispatch-NcSiWVUM.mjs";
import { v as RUN_STALE_TAKEOVER_MS } from "./diagnostic-run-activity-DTzzZJ-S.mjs";
import { E as finalizeReplyMessageInjectionAttempt, T as beginReplyMessageInjectionTarget, h as replyRunRegistry, m as markReplyOperationGlobalLaneWaitProgress } from "./reply-run-registry.registry-DycIsDrE.mjs";
import "./reply-run-registry-Cpef_Ljt.mjs";
import { s as logSessionTurnCreated } from "./diagnostic-DMwhUN76.mjs";
import { t as resolveCronJobsStorePath } from "./paths-Bz2goYfd.mjs";
import { r as loadCronJobsStore } from "./store-CV1wrdMb.mjs";
import { t as CommandLaneClearedError } from "./command-queue-CaY517ob.mjs";
import { t as formatTokenCount } from "./token-format-o0FIe7MV.mjs";
import { g as resolveSessionGoalDisplayState } from "./sessions-Cesa3L0p.mjs";
import { t as parseReplyDirectives } from "./reply-directives-CeJbvk_b.mjs";
import { n as createStructuredOutboundPayloadPlan } from "./payloads-Ce1fWBq6.mjs";
import { a as resolveSendableOutboundReplyParts } from "./reply-payload-parts-G378iYNJ.mjs";
import { n as normalizeReplyPayload } from "./normalize-reply-gZujyBo1.mjs";
import { g as shouldRetryReplyDispatch, m as resolveReplyDispatchErrorOutcome } from "./reply-dispatcher-GD4z6YqB.mjs";
import { h as recordReplyUsageState, m as buildReplyUsageState } from "./deliver-prepare-Rgnsll-n.mjs";
import { i as formatUsd, t as estimateAggregateUsageCost } from "./usage-format-CisMpgmJ.mjs";
import { a as hasOutboundReplyContent } from "./reply-payload-RBmrGrXG.mjs";
import { n as resolveRoutedDeliveryThreadId } from "./routed-delivery-thread-BgOncaiJ.mjs";
import { _ as resolveReplyFailoverFacts, a as buildAuthProfileFailoverFailureText, c as buildKnownAgentRunFailureReplyPayload, d as isNonDirectConversationContext, f as isVerboseFailureDetailEnabled, g as resolveAgentRunFailureText, h as renderPostCompactionModelFailurePayload, i as retireTerminalRestartRecoverySourceClaim, l as buildPreflightCompactionFailureText, m as markPostCompactionModelFailurePayload, n as createReplyRestartRecoveryClaimController, o as buildEmptyInteractiveReplyPayload, p as markAgentRunFailureReplyPayload, r as isDuplicateRestartRecoverySource, s as buildExternalRunFailureReply, t as resolveTurnCommentaryProgressOwner, u as buildTerminalAgentRunFailureReplyPayload, v as resolveReplyFailureSummary, y as REPLY_ADMISSION_TICKET } from "./commentary-progress-owner-C1OSpGI4.mjs";
import { c as buildRestartLifecycleReplyText, d as resolveReplyOperationTerminationFields, f as resolveRestartLifecycleError, i as recordReplyOperationAgentTurn, l as isReplyOperationSuperseded, n as resolveEffectiveReplyRoute, p as resolveAgentTurnExecutionStatus, s as resolveReplyOperationRunState, u as resolveReplyOperationAbortReason } from "./effective-reply-route-D4lEFMTQ.mjs";
import { a as isLikelyContextOverflowError, i as isContextOverflowError, t as classifyFailoverReason } from "./classify-Bgiif0yb.mjs";
import { f as resolveFailoverReasonFromError, o as findCliTimeoutError } from "./failover-error-BwAkMLuL.mjs";
import { i as LiveSessionModelSwitchError } from "./model-fallback-runner-Bv3pAARh.mjs";
import { v as isCompactionFailureError } from "./embedded-agent-helpers-DyKvGnUW.mjs";
import { n as clearBootstrapSnapshotOnSessionBoundary } from "./bootstrap-cache-D3fnu3yg.mjs";
import { i as clearCliSession, u as shouldClearFailedCliSessionBinding } from "./cli-session-CeXeyPue.mjs";
import { r as sanitizePendingFinalDeliveryText } from "./pending-final-delivery-state-CJEOzbKd.mjs";
import { c as transitionMainSessionRecovery } from "./main-session-recovery-state-uW-wldbD.mjs";
import { n as readChannelSourceTurnId, t as buildChannelSourceTurnId } from "./source-turn-id-BZGK3amb.mjs";
import { _ as hasBlockReplyDeliveryCustody, f as createAudioAsVoiceBuffer, g as deliverBlockReply, m as createBlockReplyPipeline, p as createBlockReplyContentKey, u as requiresDurableToolResultDelivery } from "./dispatch-from-config.payloads-C08rrRfU.mjs";
import { s as revokeMessageActionTurnCapability } from "./message-action-turn-capability-CfssNzR2.mjs";
import { a as isMessagingToolSendAction } from "./embedded-agent-messaging-D4Zw3sB3.mjs";
import { g as readQuestionRejection, r as claimPendingAgentQuestionAnswerFromCaller } from "./gateway-question-CK2H_PQO.mjs";
import { c as normalizePendingFinalRecoveryPayloads, o as buildRecoverablePendingFinalDeliveryText, s as normalizePendingFinalDeliveryPayloads } from "./send-BI-ZW_ne.mjs";
import { i as isCommandBearingToolCall, r as inferToolMetaFromArgsCore } from "./tool-display-DjrvDE8J.mjs";
import { t as formatToolAggregate } from "./tool-meta-Cg9Nif2y.mjs";
import { h as normalizeAgentPlanSteps } from "./streaming-BRWehz40.mjs";
import { t as settleProgressVisibilityCallbackResult } from "./progress-visibility-DVUJibF4.mjs";
import { i as buildGenericCliContextEngineHostSupport } from "./host-compat-xESS3bi6.mjs";
import { a as createReplySessionEntryHandle, c as admitReplyTurn, i as ReplySessionGenerationInvalidatedError, l as resolveReplyTurnKind, n as shouldBridgeCliPreambleEvents, o as createReplyTimingTracker, s as isReplyProfilerEnabled } from "./get-reply.types-BWuoAxM8.mjs";
import { t as hasInboundAudio } from "./inbound-media-CetKPfK2.mjs";
import { n as resolveSendPolicy } from "./send-policy-DZ8_Ozhd.mjs";
import { t as resolveOriginMessageProvider } from "./origin-routing-jrHjZJWx.mjs";
import { i as resolveImplicitCurrentMessageReplyAllowance, n as createReplyToModeFilterForChannel, o as resolveReplyToMode, t as createReplyDeliveryContext } from "./reply-threading-lgVuxEkY.mjs";
import { n as resolveSessionModelRef } from "./session-model-ref-DGVV7laa.mjs";
import { i as getMcpAppViewLease } from "./mcp-ui-resource-CANSsmIF.mjs";
import { a as resolveContextTokensForModel } from "./context-na2bB1IO.mjs";
import { t as readLatestSessionUsageFromTranscriptAsync } from "./session-transcript-usage-Cxv2cU_b.mjs";
import { t as resolveFastModeState } from "./fast-mode-D3LS63Ki.mjs";
import { l as admitFollowupRunLifecycle, s as refreshQueuedFollowupSession, u as completeFollowupRunLifecycle } from "./state-B1aZH2hx.mjs";
import { t as appendCurrentInboundContext } from "./runtime-context-prompt-Jr1ZDwll.mjs";
import { h as readPostCompactionContext, x as createDeferredEmbeddedRunLifecycleManager } from "./builtin-openclaw-BPzZzoTo.mjs";
import { s as resolveBootstrapWarningSignaturesSeen } from "./bootstrap-budget-DZWwd3xP.mjs";
import { a as extractToolResultText } from "./embedded-agent-tool-results-Cn4G9Xfj.mjs";
import { i as isRestartRecoveryTerminalDeliveryFailClosed } from "./restart-recovery-receipt-DmfdesM2.mjs";
import { _ as hasVisibleCommittedMessagingToolDeliveryEvidence, b as resolveSourceReplyDelivery, p as hasCompletedSourceReplyDeliveryEvidence, u as hasCommittedSourceReplyDeliveryEvidence, v as hasVisibleOutboundDeliveryEvidence, y as resolveExplicitFinalSourceReplyDeliveryEvidence } from "./delivery-evidence-B9fCOuaI.mjs";
import { a as resolveDelegationCapability } from "./agent-tools-Dp5LthCP.mjs";
import { n as filterMessagingToolReplyPayload } from "./reply-payloads-dedupe-BLlLexmF.mjs";
import { r as routeReply, t as isRoutableChannel } from "./route-reply-DGGXEu2K.mjs";
import { c as isFollowupRunAborted, l as resolveFollowupAbortSignal, o as scheduleFollowupDrain, s as FollowupRunDeferredError } from "./drain-D4BsFyL3.mjs";
import { n as resolveFollowupRunToolAuthorityFingerprint, r as resolveInboundReplyToolAuthorityOverlay, t as prepareReplyToolAuthority } from "./reply-tool-authority-_0-jZU7C.mjs";
import { i as parkSteerCandidate, n as enqueueFollowupRun, t as resolveQueueSettings } from "./queue-CJnUSYp0.mjs";
import { s as createAgentPatchedSessionModelFallback } from "./session-model-patch-origin-C8lFJHHK.mjs";
import { o as withLocalSessionPlacementTurnSettlement } from "./session-placement-admission-DlyvKtv9.mjs";
import { t as runEmbeddedAgent } from "./embedded-agent-mYH3aiyf.mjs";
import { t as buildAgentRuntimeDeliveryPlan } from "./build-DNMKbvPh.mjs";
import { n as resolveAgentLifecycleTerminalMetadata, t as createAgentLifecycleTerminalBackstop } from "./agent-lifecycle-terminal-BnQVcmxj.mjs";
import { i as withBeforeAgentReplyObserver } from "./auth-profile-failure-policy-BoPIpWfh.mjs";
import { r as stripOpenClawMcpToolPrefix } from "./tool-policy-B3nZbUgX.mjs";
import { n as consolidateLiveModelSwitchAfterRun } from "./live-model-switch-C_R763Xc.mjs";
import { n as incrementCompactionCount } from "./session-updates-pIOkIxtZ.mjs";
import { n as createSourceReplyDeliveryRuntime, r as readSourceReplyDeliveryRuntime, t as bindSourceReplyDeliveryRuntime } from "./source-reply-delivery-runtime-D3ljIhoI.mjs";
import { n as createReplyMediaContext } from "./reply-media-paths-_dLtF97o.mjs";
import { n as resolveCliExecutionAuthProfileId, t as cliBackendAcceptsAuthProfileForwarding } from "./cli-execution-auth-DC6xVJm0.mjs";
import { n as resolveEffectiveBlockStreamingConfig } from "./block-streaming-DHMLmDDb.mjs";
import { r as mergeSessionSnapshotChanges } from "./session-snapshot-merge-Br9OMCio.mjs";
import { t as REPLY_RUN_STILL_SHUTTING_DOWN_TEXT } from "./get-reply-run-queue-Bmv2zHLu.mjs";
import { r as resolveActiveRunQueueAction, t as createTypingSignaler } from "./typing-mode-DIy7_kEV.mjs";
import { i as refreshActiveGoalContext } from "./inbound-meta-CNXtAiLI.mjs";
import { t as resolveCurrentTurnImages } from "./current-turn-images-CcT_Iafd.mjs";
import { t as createSessionDiffBaselineCaptureClaim } from "./session-diff-baseline-capture-6ejBT0Am.mjs";
import { t as ensureSessionDiffBaseline } from "./session-diff-baseline-DYBR0Zx0.mjs";
import { i as drainAgentRunTerminalWrites, r as clearAgentRunTerminalWriteContext } from "./agent-run-terminal-writes-CCfF2RZR.mjs";
import { n as scheduleSessionMaintenance, t as createSessionMaintenanceFollowup } from "./run-PQL79Xrs.mjs";
import { t as runEmbeddedAgentEntry } from "./run-entry-Ct-tGbLW.mjs";
import { n as invalidateTurnCompactionContext, r as recordTurnCompaction } from "./agent-runner-compaction-accounting-B3SiBvkt.mjs";
import { t as getTailscalePublishedOrigin } from "./tailscale-published-origin-BvNdSLZR.mjs";
import { t as buildCliMcpDelegationCapabilityBinding } from "./mcp-grant-context-BmbT_OKN.mjs";
import { n as runCliAgent } from "./cli-runner-Dca2A2Z4.mjs";
import { n as persistCliSessionBindingResult, r as settleCliSessionResult, t as clearCliSessionInStore } from "./cli-session-store-CDncnw5v.mjs";
import "./reply-media-paths.runtime-qfZxkkAM.mjs";
import { t as formatSystemTurnPrompt } from "./system-turn-prompt-CqPm0DzY.mjs";
import { t as emitAgentRunStatusEvent } from "./agent-run-status-events-CxQDXWoO.mjs";
import { a as mintReplyMessageActionTurnCapability, c as resolveRunFastModeForFallbackCandidate, d as resolveRunModelHasVision, f as resolveFallbackCandidateRun, i as isBunFetchSocketError, l as resolveRunThinkingLevelForFallbackCandidate, n as buildThreadingToolContext, o as resolveQueuedReplyExecutionConfig, p as resolveRunAuthProfile, r as formatBunFetchSocketError, s as resolveQueuedReplyRuntimeConfig, t as buildEmbeddedRunExecutionParams, u as resolveModelFallbackOptions } from "./agent-runner-utils-Dt_6zfT_.mjs";
import { n as runSessionCompactionIfNeeded, t as runMemoryFlushIfNeeded } from "./agent-runner-memory-Byv4A3Ik.mjs";
import { n as prepareChannelRunAdmission } from "./channel-run-admission-DTp_ie4W.mjs";
import { t as createMcpAppStandaloneTicket } from "./mcp-app-standalone-CDg7wQtS.mjs";
import { readFileSync, watch } from "node:fs";
import { isDeepStrictEqual } from "node:util";
import path, { resolve } from "node:path";
import { homedir } from "node:os";
import crypto from "node:crypto";
import { Value } from "typebox/value";
//#region src/auto-reply/fallback-state.ts
/** Formats model-fallback notice state for UI/status messages and persisted transition tracking. */
const FALLBACK_REASON_PART_MAX = 80;
const TRANSIENT_FALLBACK_REASONS = /* @__PURE__ */ new Set([
	"rate_limit",
	"overloaded",
	"timeout",
	"empty_response",
	"no_error_details",
	"unclassified"
]);
const TRANSIENT_ERROR_DETAIL_HINT_RE = /\b(?:429|5\d\d|too many requests|usage limit|quota|try again in|retry[- ]after|seconds?|minutes?|hours?|temporarily unavailable|overloaded|service unavailable|throttl\w*)\b/i;
function truncateFallbackReasonPart(value, max = FALLBACK_REASON_PART_MAX) {
	const text = value.replace(/\s+/g, " ").trim();
	if (text.length <= max) return text;
	return `${truncateUtf16Safe(text, max - 1).trimEnd()}…`;
}
function formatFallbackAttemptErrorPreview(attempt) {
	const rawError = attempt.error?.trim();
	if (!rawError) return;
	if (!attempt.reason || !TRANSIENT_FALLBACK_REASONS.has(attempt.reason)) return;
	if (!TRANSIENT_ERROR_DETAIL_HINT_RE.test(rawError)) return;
	const formatted = formatRawAssistantErrorForUi(rawError).replace(/^⚠️\s*/, "").replace(/\s+/g, " ").trim();
	if (!formatted || /unknown error/i.test(formatted)) return;
	return formatted;
}
function formatFallbackAttemptReason(attempt) {
	const errorPreview = formatFallbackAttemptErrorPreview(attempt);
	if (errorPreview) return errorPreview;
	const reason = attempt.reason?.trim();
	if (reason) return reason.replace(/_/g, " ");
	const code = attempt.code?.trim();
	if (code) return code;
	if (typeof attempt.status === "number") return `HTTP ${attempt.status}`;
	return truncateFallbackReasonPart(attempt.error || "error");
}
function formatFallbackAttemptSummary(attempt) {
	return `${buildModelCatalogRef(attempt.provider, attempt.model)} ${formatFallbackAttemptReason(attempt)}`;
}
function buildFallbackReasonSummary(attempts) {
	const firstAttempt = attempts[0];
	const firstReason = firstAttempt ? formatFallbackAttemptReason(firstAttempt) : "selected model unavailable";
	const moreAttempts = attempts.length > 1 ? ` (+${attempts.length - 1} more attempts)` : "";
	return `${truncateFallbackReasonPart(firstReason)}${moreAttempts}`;
}
function buildFallbackAttemptSummaries(attempts) {
	return attempts.map((attempt) => truncateFallbackReasonPart(formatFallbackAttemptSummary(attempt)));
}
/** Builds the visible notice shown when runtime falls back from the selected model. */
function buildFallbackNotice(params) {
	const selected = buildModelCatalogRef(params.selectedProvider, params.selectedModel);
	const active = buildModelCatalogRef(params.activeProvider, params.activeModel);
	if (areRuntimeModelRefsEquivalent(selected, active, { config: params.cfg })) return null;
	return `↪️ Model Fallback: ${active} (selected ${selected}; ${buildFallbackReasonSummary(params.attempts)})`;
}
/** Builds the visible notice shown after a successful embedded provider-policy retry. */
function buildProviderPolicyRetryNotice(params) {
	const target = buildModelCatalogRef(params.provider, params.model);
	return `↪️ Retried on ${areRuntimeModelRefsEquivalent(target, "openai/gpt-daybreak-blue-latest", { config: params.cfg }) ? "Daybreak" : target}`;
}
/** Builds the visible notice shown when runtime returns to the selected model. */
function buildFallbackClearedNotice(params) {
	const selected = buildModelCatalogRef(params.selectedProvider, params.selectedModel);
	const previous = normalizeOptionalString(params.previousActiveModel);
	if (previous && previous !== selected) return `↪️ Model Fallback cleared: ${selected} (was ${previous})`;
	return `↪️ Model Fallback cleared: ${selected}`;
}
/** Resolves fallback state transitions and the next persisted notice-state fields. */
function resolveFallbackTransition(params) {
	const selectedModelRef = buildModelCatalogRef(params.selectedProvider, params.selectedModel);
	const activeModelRef = buildModelCatalogRef(params.activeProvider, params.activeModel);
	const previousState = {
		selectedModel: normalizeOptionalString(params.state?.fallbackNotice?.selectedModel),
		activeModel: normalizeOptionalString(params.state?.fallbackNotice?.activeModel),
		reason: normalizeOptionalString(params.state?.fallbackNotice?.reason)
	};
	const comparisonOptions = { config: params.cfg };
	const fallbackActive = !areRuntimeModelRefsEquivalent(selectedModelRef, activeModelRef, comparisonOptions);
	const fallbackTransitioned = fallbackActive && (previousState.selectedModel !== selectedModelRef || previousState.activeModel !== activeModelRef);
	const previousStateWasRealFallback = previousState.selectedModel === selectedModelRef && previousState.activeModel === activeModelRef ? fallbackActive : Boolean(previousState.selectedModel && previousState.activeModel && !areRuntimeModelRefsEquivalent(previousState.selectedModel, previousState.activeModel, comparisonOptions));
	const fallbackCleared = !fallbackActive && previousStateWasRealFallback;
	const reasonSummary = buildFallbackReasonSummary(params.attempts);
	const attemptSummaries = buildFallbackAttemptSummaries(params.attempts);
	const nextState = fallbackActive ? {
		selectedModel: selectedModelRef,
		activeModel: activeModelRef,
		reason: reasonSummary
	} : {
		selectedModel: void 0,
		activeModel: void 0,
		reason: void 0
	};
	return {
		selectedModelRef,
		activeModelRef,
		fallbackActive,
		fallbackTransitioned,
		fallbackCleared,
		reasonSummary,
		attemptSummaries,
		previousState,
		nextState,
		stateChanged: previousState.selectedModel !== nextState.selectedModel || previousState.activeModel !== nextState.activeModel || previousState.reason !== nextState.reason
	};
}
//#endregion
//#region src/auto-reply/reply/reply-delivery.ts
/** Delivers prepared block replies through streaming or direct paths. */
/** Visible progress needs a failure outcome, but retained or suppressed sends are not visibility. */
async function resolveReplyFailureVisibility(resolveVisibleReplyDelivery, directBlockDeliveries) {
	return await resolveVisibleReplyDelivery?.() === true || directBlockDeliveries.some((delivery) => delivery.outcome === "delivered" && hasOutboundReplyContent(delivery.payload, { trimText: true }));
}
/** Parses inline reply directives into payload fields and silent-reply state. */
function normalizeReplyPayloadDirectives(params) {
	const parseMode = params.parseMode ?? "always";
	const silentToken = params.silentToken ?? "NO_REPLY";
	const sourceText = params.payload.text ?? "";
	const parsed = parseMode === "always" || parseMode === "auto" && (sourceText.includes("[[") || params.extractMediaDirectives !== false && /media:/i.test(sourceText) || params.extractMarkdownImages === true && /!\[[^\]]*]\(/.test(sourceText) || sourceText.includes(silentToken)) ? parseReplyDirectives(sourceText, {
		currentMessageId: params.currentMessageId,
		silentToken,
		extractMarkdownImages: params.extractMarkdownImages,
		extractMediaDirectives: params.extractMediaDirectives
	}) : void 0;
	let text = parsed ? parsed.text || void 0 : params.payload.text || void 0;
	if (params.trimLeadingWhitespace && text) text = trimTextPreservingCode(text, "start") || void 0;
	const mediaUrls = params.payload.mediaUrls ?? parsed?.mediaUrls;
	const mediaUrl = params.payload.mediaUrl ?? parsed?.mediaUrls?.[0] ?? mediaUrls?.[0];
	return {
		payload: copyReplyPayloadMetadata(params.payload, {
			...params.payload,
			text,
			mediaUrls,
			mediaUrl,
			replyToId: params.payload.replyToId ?? parsed?.replyToId,
			replyToTag: params.payload.replyToTag || parsed?.replyToTag,
			replyToCurrent: params.payload.replyToCurrent || parsed?.replyToCurrent,
			audioAsVoice: Boolean(params.payload.audioAsVoice || parsed?.audioAsVoice)
		}),
		isSilent: parsed?.isSilent ?? false
	};
}
async function sendDirectBlockReply(params) {
	const attempt = {
		payload: params.payload,
		outcome: "failed-deliver",
		pending: true
	};
	params.directBlockDeliveries.push(attempt);
	const delivery = await deliverBlockReply(() => params.onBlockReply(params.payload)).catch((error) => {
		attempt.outcome = resolveReplyDispatchErrorOutcome(error);
		attempt.pending = false;
		throw error;
	});
	Object.assign(attempt, delivery, { pending: delivery.pending === true });
	if (delivery.outcome === "delivered" && !delivery.pending && delivery.source?.complete !== false && isReplyPayloadTerminalContent(params.payload)) attempt.terminalDeliveryConfirmed = true;
}
/** Creates the handler used for assistant block replies during streaming/tool phases. */
function createBlockReplyDeliveryHandler(params) {
	return async (payload, options) => {
		if (payload.isReasoning === true && params.reasoningPayloadsEnabled !== true || payload.isCommentary === true && params.commentaryPayloadsEnabled !== true) return;
		const { text, skip } = params.normalizeStreamingText(payload);
		const isSilent = getReplyPayloadMetadata(payload)?.silentReply === true || isSilentReplyText(payload.text, "NO_REPLY") || skip && isSilentReplyPayloadText(text, "NO_REPLY");
		if (skip && !hasOutboundReplyContent({
			...payload,
			text: void 0
		}) && !payload.audioAsVoice) return;
		const implicitCurrentMessageAllowed = payload.replyToCurrent === true ? true : payload.replyToCurrent === false ? false : params.replyThreading?.implicitCurrentMessage !== "deny";
		const normalizedText = text ? trimTextPreservingCode(text, "start") : void 0;
		const normalizedPayload = copyReplyPayloadMetadata(payload, {
			...payload,
			text: isSilent ? void 0 : normalizedText || void 0,
			audioAsVoice: Boolean(payload.audioAsVoice),
			mediaUrl: payload.mediaUrl ?? payload.mediaUrls?.[0],
			replyToId: payload.replyToId ?? (implicitCurrentMessageAllowed ? params.currentMessageId : void 0)
		});
		if (!isRenderablePayload(normalizedPayload) && !payload.audioAsVoice) return;
		const mediaNormalizedPayload = params.normalizeMediaPaths ? await params.normalizeMediaPaths(normalizedPayload) : normalizedPayload;
		if (isSilent) mediaNormalizedPayload.text = void 0;
		const blockPayload = copyReplyPayloadMetadata(payload, params.applyReplyToMode(mediaNormalizedPayload));
		if (blockPayload.text?.trim() !== payload.text?.trim()) setReplyPayloadMetadata(blockPayload, {
			blockSourceText: void 0,
			blockSourceRange: void 0
		});
		const blockHasNonTextContent = hasOutboundReplyContent({
			...blockPayload,
			text: void 0
		});
		if (!blockPayload.text && !blockHasNonTextContent && !blockPayload.audioAsVoice) return;
		if (blockPayload.text) params.typingSignals.signalTextDelta(blockPayload.text).catch((err) => {
			logVerbose(`block reply typing signal failed: ${String(err)}`);
		});
		if (params.blockStreamingEnabled && params.blockReplyPipeline) {
			if (options?.completed) await params.blockReplyPipeline.flush({ force: true });
			params.blockReplyPipeline.enqueue(blockPayload);
			if (options?.completed) await params.blockReplyPipeline.flush({ force: true });
		} else if (params.blockStreamingEnabled || options?.completed === true || blockHasNonTextContent || blockPayload.isReasoning === true || blockPayload.isCommentary === true) await sendDirectBlockReply({
			onBlockReply: params.onBlockReply,
			directBlockDeliveries: params.directBlockDeliveries,
			payload: blockPayload
		});
	};
}
const RESTART_LIFECYCLE_REPLY_TEXT = "⚠️ Gateway is restarting. Please wait a few seconds and try again.";
function scheduleFollowupDrainAfterReplyOperationClear(params) {
	runAfterReplyOperationClear(params.operation, (admissionSessionId) => {
		const completedSessionId = params.operation.sessionId;
		const runFollowupAfterClear = admissionSessionId === completedSessionId ? params.runFollowup : (queued) => params.runFollowup(queued.run.sessionId === completedSessionId ? {
			...queued,
			admissionSessionId
		} : queued);
		scheduleFollowupDrain(params.queueKey, runFollowupAfterClear);
	});
}
function markBeforeAgentRunBlockedPayloads(payloads) {
	return payloads.map((payload) => setReplyPayloadMetadata(payload, { beforeAgentRunBlocked: true }));
}
function buildSilentFallbackFailurePayload(params) {
	if (params.completion.outcome !== "missing" || !params.fallbackTransition.fallbackActive || !params.fallbackFailureKnown) return;
	const selected = params.fallbackTransition.selectedModelRef;
	const active = params.fallbackTransition.activeModelRef;
	const attempts = params.fallbackAttempts;
	const selectedAttempts = attempts.filter((attempt) => areRuntimeModelRefsEquivalent(`${attempt.provider}/${attempt.model}`, selected, { config: params.cfg }));
	let primary = `⚠️ The configured model backend ${selected} produced no usable reply. `;
	if (selectedAttempts.length > 0 && selectedAttempts.every((attempt) => attempt.code !== "MODEL_FALLBACK_SKIPPED") && attempts.every((attempt) => attempt.provider.trim() && attempt.model.trim())) {
		if (selectedAttempts.every(({ reason }) => [
			"timeout",
			"server_error",
			"overloaded",
			"tls_certificate"
		].includes(reason))) primary = `⚠️ I couldn't reach the configured model backend ${selected}. `;
		else if (selectedAttempts.every(({ reason }) => reason === "format" || reason === "empty_response")) primary = `⚠️ The configured model backend ${selected} responded but produced no usable reply. `;
	}
	return markReplyPayloadForSourceSuppressionDelivery({
		text: `${primary}Fallback used ${active}, but it produced no visible reply.`,
		isError: true
	});
}
function resolveSourceReplyPolicy(params) {
	const sendPolicy = resolveSendPolicy({
		cfg: params.cfg,
		entry: params.sessionEntry,
		sessionKey: params.runtimePolicySessionKey ?? params.sessionKey,
		channel: params.sessionCtx.OriginatingChannel ?? params.sessionCtx.Surface ?? params.sessionCtx.Provider ?? sessionDeliveryChannel(params.sessionEntry),
		chatType: params.sessionEntry?.chatType
	});
	return resolveSourceReplyVisibilityPolicy({
		cfg: params.cfg,
		ctx: params.sessionCtx,
		requested: params.opts?.sourceReplyDeliveryMode,
		sendPolicy
	});
}
function resolveReplyRunDeliveryContext(params) {
	const sourceReplyPolicy = resolveSourceReplyPolicy(params);
	if (params.sessionCtx.InboundEventKind === "room_event" || sourceReplyPolicy.sendPolicyDenied || sourceReplyPolicy.suppressDelivery && sourceReplyPolicy.sourceReplyDeliveryMode !== "message_tool_only") return;
	return normalizeDeliveryContext({
		...resolveEffectiveReplyRoute({
			ctx: params.sessionCtx,
			entry: params.sessionEntry
		}),
		threadId: resolveRoutedDeliveryThreadId({
			ctx: params.sessionCtx,
			sessionKey: params.sessionCtx.SessionKey ?? params.sessionKey
		})
	});
}
function hasSuccessfulSourceReplyDelivery(params) {
	return params.blockReplyPipeline?.didStream() || params.hasDirectlySentBlockReply === true || hasVisibleCommittedMessagingToolDeliveryEvidence(params);
}
async function resolveTerminalReplyDelivery(params) {
	if (params.sourceReplyDeliveryState === "delivered" || params.sourceReplyDeliveryState === "pending") return params.sourceReplyDeliveryState;
	const { blockReplyPipeline, minimumAssistantMessageIndex = 0 } = params;
	if (params.sourceReplyDeliveryState === void 0) await blockReplyPipeline?.flush({ force: true });
	const sourceDelivery = await observeReplyDelivery(params.resolveReplyDelivery, minimumAssistantMessageIndex, (error) => logVerbose(`reply delivery observation failed; retaining custody: ${String(error)}`));
	if (sourceDelivery === "delivered" || params.sourceReplyDeliveryState !== void 0) return sourceDelivery;
	let pending = sourceDelivery === "pending" || blockReplyPipeline?.hasRetryBlockedTerminalDelivery?.(minimumAssistantMessageIndex) === true;
	for (const delivery of params.directBlockDeliveries ?? []) {
		if ((getReplyPayloadMetadata(delivery.payload)?.assistantMessageIndex ?? 0) < minimumAssistantMessageIndex || !isReplyPayloadTerminalContent(delivery.payload)) continue;
		if (delivery.terminalDeliveryConfirmed) return "delivered";
		pending ||= hasBlockReplyDeliveryCustody(delivery);
	}
	return blockReplyPipeline?.didStreamTerminalReply?.(minimumAssistantMessageIndex) ? "delivered" : pending ? "pending" : "missing";
}
function resolveFallbackOriginModel(params) {
	if (params.runtimeModelSelection) return {
		...params.runtimeModelSelection,
		persistedAutoFallback: false
	};
	const entry = params.fallbackStateEntry;
	if ((entry?.modelOverrideSource === "auto" || entry !== void 0 && entry.modelOverrideSource === void 0 && hasSessionAutoModelFallbackProvenance(entry)) && entry !== void 0) {
		const originProvider = normalizeOptionalString(entry.modelOverrideFallbackOriginProvider);
		const originModel = normalizeOptionalString(entry.modelOverrideFallbackOriginModel);
		if (originProvider && originModel) return {
			provider: originProvider,
			model: originModel,
			persistedAutoFallback: true
		};
	}
	return {
		provider: params.run.provider,
		model: params.run.model,
		persistedAutoFallback: false
	};
}
function buildInlinePluginStatusPayload(params) {
	const statusLines = params.includeStatusLines ? resolveSessionPluginStatusLines(params.entry) : [];
	const traceLines = params.includeTraceLines ? resolveSessionPluginTraceLines(params.entry) : [];
	const lines = [...statusLines, ...traceLines];
	if (lines.length === 0) return;
	return { text: lines.join("\n") };
}
function normalizeAssistantFinalDeliveryText(text) {
	const parsed = normalizeReplyPayloadDirectives({
		payload: { text },
		trimLeadingWhitespace: true,
		parseMode: "auto"
	});
	return sanitizePendingFinalDeliveryText(parsed.payload.text ?? "");
}
function refreshSessionEntryFromStore(params) {
	const { storePath, sessionKey, fallbackEntry, activeSessionStore } = params;
	if (!storePath || !sessionKey) return fallbackEntry;
	try {
		const latestEntry = loadSessionEntryReadOnly({
			storePath,
			sessionKey
		});
		if (!latestEntry) return fallbackEntry;
		if (params.expectedGeneration && (latestEntry.sessionId !== params.expectedGeneration.sessionId || latestEntry.lifecycleRevision !== params.expectedGeneration.lifecycleRevision)) return fallbackEntry;
		if (activeSessionStore) activeSessionStore[sessionKey] = latestEntry;
		return latestEntry;
	} catch {
		return fallbackEntry;
	}
}
function resolveAdmittedRunSessionFile(params) {
	if (params.sessionKey?.trim()) return params.sessionKey.trim();
	return params.sessionFile;
}
async function handleReplyAgentRunError(error, context) {
	const { resolveVisibleReplyDelivery, isHeartbeat, replyExpectation, isRestartRecoveryArmed, replyOperation, resolvedVerboseLevel, returnWithQueuedFollowupDrain, sessionCtx } = context;
	if (isReplyOperationSuperseded(replyOperation)) return { text: SILENT_REPLY_TOKEN };
	if (replyOperation.result?.kind === "aborted" && replyOperation.result.code === "aborted_by_user") return returnWithQueuedFollowupDrain({ text: SILENT_REPLY_TOKEN });
	if (replyOperation.result?.kind === "aborted" && replyOperation.result.code === "aborted_for_restart") {
		if (isRestartRecoveryArmed()) return returnWithQueuedFollowupDrain({ text: SILENT_REPLY_TOKEN });
		return returnWithQueuedFollowupDrain(markReplyPayloadForSourceSuppressionDelivery({ text: RESTART_LIFECYCLE_REPLY_TEXT }));
	}
	if (error instanceof GatewayDrainingError) {
		replyOperation.fail("gateway_draining", error);
		return returnWithQueuedFollowupDrain(markReplyPayloadForSourceSuppressionDelivery({ text: RESTART_LIFECYCLE_REPLY_TEXT }));
	}
	if (error instanceof CommandLaneClearedError) {
		replyOperation.fail("command_lane_cleared", error);
		return returnWithQueuedFollowupDrain(markReplyPayloadForSourceSuppressionDelivery({ text: RESTART_LIFECYCLE_REPLY_TEXT }));
	}
	const knownFailurePayload = buildKnownAgentRunFailureReplyPayload({
		err: error,
		sessionCtx,
		resolvedVerboseLevel
	});
	if (knownFailurePayload) {
		replyOperation.fail("run_failed", error);
		return returnWithQueuedFollowupDrain(knownFailurePayload);
	}
	const visibleReplyDelivered = await resolveVisibleReplyDelivery();
	if (!isHeartbeat && visibleReplyDelivered && !replyOperation.abortSignal.aborted) {
		replyOperation.fail("run_failed", error);
		return returnWithQueuedFollowupDrain(buildTerminalAgentRunFailureReplyPayload({
			replyExpectation,
			visibleReplyDelivered
		}));
	}
	replyOperation.fail("run_failed", error);
	returnWithQueuedFollowupDrain(void 0);
	throw error;
}
async function cleanupReplyAgentRun(context) {
	const { blockReplyPipeline, clearRestartRecoveryDeliveryClaim, providedReplyOperation, queueKey, replyOperation, runFollowupTurn, sessionKey, shouldDrainQueuedFollowupsAfterClear, typing } = context;
	try {
		await clearRestartRecoveryDeliveryClaim();
	} catch (error) {
		logVerbose(`failed to clear restart recovery delivery context for ${sessionKey ?? "unknown"}: ${String(error)}`);
	}
	if (shouldDrainQueuedFollowupsAfterClear) {
		scheduleFollowupDrainAfterReplyOperationClear({
			operation: replyOperation,
			queueKey,
			runFollowup: runFollowupTurn
		});
		if (!providedReplyOperation) replyOperation.complete();
	} else if (!providedReplyOperation) replyOperation.complete();
	blockReplyPipeline?.stop();
	typing.markRunComplete();
	typing.markDispatchIdle();
}
//#endregion
//#region src/agents/session-model-auto-revert.ts
/** One-run rollback for agent-selected session models. */
const REVERT_REASONS = /* @__PURE__ */ new Set([
	"auth",
	"auth_permanent",
	"billing",
	"model_not_found"
]);
async function reconcileAgentPatchedSessionModel(params) {
	const reason = params.outcome.success ? void 0 : params.outcome.reason ?? resolveFailoverReasonFromError(params.outcome.error);
	if (!params.outcome.success && (!reason || !REVERT_REASONS.has(reason))) return "kept";
	let note;
	let sessionId;
	let result = "none";
	await patchSessionEntryCore({
		agentId: params.agentId,
		sessionKey: params.sessionKey,
		storePath: params.storePath
	}, (entry) => {
		const marker = entry.modelFallback;
		if (marker?.source !== "agent-patch") return null;
		if (params.expectedMarkerTs !== void 0 && marker.ts !== params.expectedMarkerTs) {
			if (params.outcome.success && params.validatedFallback && marker.ts > params.expectedMarkerTs && params.expectedMarkerTs > (marker.lastValidatedPatchTs ?? -1)) {
				result = "promoted";
				return { modelFallback: {
					...params.validatedFallback,
					ts: marker.ts,
					lastValidatedPatchTs: params.expectedMarkerTs
				} };
			}
			return null;
		}
		sessionId = entry.sessionId;
		if (params.outcome.success) {
			result = "cleared";
			return { modelFallback: void 0 };
		}
		const failed = resolveSessionModelRef(params.cfg, entry, params.agentId);
		result = "reverted";
		note = `System note: model ${failed.provider}/${failed.model} failed; reverted to ${marker.prevProvider}/${marker.prevModel}.`;
		return {
			model: marker.prevModel,
			modelProvider: marker.prevProvider,
			modelOverride: marker.prevModelOverride,
			providerOverride: marker.prevProviderOverride,
			modelOverrideSource: marker.prevModelOverrideSource,
			modelOverrideRouteResolution: marker.prevModelOverrideRouteResolution,
			modelOverrideFallbackOriginProvider: marker.prevModelOverrideFallbackOriginProvider,
			modelOverrideFallbackOriginModel: marker.prevModelOverrideFallbackOriginModel,
			authProfileOverride: marker.prevAuthProfileOverride,
			authProfileOverrideSource: marker.prevAuthProfileOverrideSource,
			authProfileOverrideCompactionCount: marker.prevAuthProfileOverrideCompactionCount,
			contextWindow: marker.prevContextWindow,
			thinkingLevel: marker.prevThinkingLevel,
			modelFallback: void 0,
			liveModelSwitchPending: void 0
		};
	});
	if (note && sessionId) try {
		const timestamp = params.now ?? Date.now();
		await appendTranscriptMessage({
			agentId: params.agentId,
			sessionId,
			sessionKey: params.sessionKey,
			storePath: params.storePath
		}, {
			config: params.cfg,
			message: {
				role: "custom",
				customType: "openclaw.system-note",
				content: note,
				display: true,
				timestamp
			},
			...params.now === void 0 ? {} : { now: params.now }
		});
	} catch {}
	return result;
}
function createAgentPatchedSessionModelRunGuard(params) {
	let markerTs;
	let validatedFallback;
	if (params.sessionKey) try {
		const entry = loadSessionEntry({
			agentId: params.agentId,
			sessionKey: params.sessionKey,
			storePath: params.storePath
		});
		const marker = entry?.modelFallback;
		markerTs = marker?.source === "agent-patch" ? marker.ts : void 0;
		if (entry && markerTs !== void 0) {
			const current = resolveSessionModelRef(params.cfg, entry, params.agentId);
			validatedFallback = createAgentPatchedSessionModelFallback({
				model: current.model,
				provider: current.provider,
				entry,
				ts: markerTs
			});
		}
	} catch {
		markerTs = void 0;
	}
	let failure = {};
	let reconciled = false;
	const captureFailure = (error, reason) => {
		if (markerTs === void 0) return false;
		const classifiedReason = reason ? reason : resolveFailoverReasonFromError(error);
		const revertReason = classifiedReason && REVERT_REASONS.has(classifiedReason) ? classifiedReason : void 0;
		failure = {
			error,
			...revertReason ? { reason: revertReason } : {}
		};
		return revertReason !== void 0;
	};
	const captureFallbackFailure = (attempts) => {
		const attempt = attempts[0];
		return attempt ? captureFailure(new Error(attempt.error), attempt.reason) : void 0;
	};
	const reconcile = async (success) => {
		if (reconciled || !params.sessionKey || markerTs === void 0) return;
		reconciled = true;
		try {
			await reconcileAgentPatchedSessionModel({
				cfg: params.cfg,
				...params.agentId ? { agentId: params.agentId } : {},
				sessionKey: params.sessionKey,
				...params.storePath ? { storePath: params.storePath } : {},
				expectedMarkerTs: markerTs,
				...validatedFallback ? { validatedFallback } : {},
				outcome: success ? { success: true } : {
					success: false,
					...failure
				}
			});
		} catch (error) {
			params.onError?.(error);
		}
	};
	return {
		captureFailure,
		captureFallbackFailure,
		async fail(error, reason) {
			captureFailure(error, reason);
			await reconcile(false);
		},
		async finish(success) {
			await reconcile(success);
		}
	};
}
//#endregion
//#region src/auto-reply/reply/agent-runner-auto-fallback.ts
function sessionEntryMatchesSnapshot(entry, snapshot) {
	return isDeepStrictEqual(entry, snapshot);
}
function sessionEntryOnlyUpdatedAtChanged(entry, snapshot) {
	if (entry.updatedAt === snapshot.updatedAt) return false;
	const entryWithoutUpdatedAt = {
		...entry,
		updatedAt: snapshot.updatedAt
	};
	return isDeepStrictEqual(entryWithoutUpdatedAt, snapshot);
}
/** Decides whether to retry after rechecking auto-fallback primary probe state. */
function resolveRunAfterAutoFallbackPrimaryProbeRecheck(params) {
	const probe = params.run.autoFallbackPrimaryProbe;
	if (!probe || !params.sessionKey || !params.entry) return params.run;
	const resolveEntrySelectionRun = () => {
		const entryRef = resolvePersistedOverrideModelRef({
			defaultProvider: params.run.provider,
			overrideProvider: params.entry?.providerOverride,
			overrideModel: params.entry?.modelOverride
		});
		const hasEntryModelOverride = Boolean(entryRef);
		const authProfileId = normalizeOptionalString(params.entry?.authProfileOverride);
		const fallbackRun = {
			...params.run,
			provider: entryRef?.provider ?? params.run.provider,
			model: entryRef?.model ?? params.run.model,
			requestedRouteResolution: entryRef ? resolveSessionModelOverrideRouteResolution(params.entry) : params.run.requestedRouteResolution,
			autoFallbackPrimaryProbe: void 0
		};
		if (hasEntryModelOverride) {
			fallbackRun.hasSessionModelOverride = true;
			fallbackRun.hasAutoFallbackProvenance = hasSessionAutoModelFallbackProvenance(params.entry) || void 0;
		} else {
			delete fallbackRun.hasSessionModelOverride;
			delete fallbackRun.hasAutoFallbackProvenance;
		}
		const modelOverrideSource = params.entry?.modelOverrideSource;
		if (hasEntryModelOverride && modelOverrideSource && modelOverrideSource !== "default") fallbackRun.modelOverrideSource = modelOverrideSource;
		else delete fallbackRun.modelOverrideSource;
		if (hasEntryModelOverride && authProfileId) {
			fallbackRun.authProfileId = authProfileId;
			const authProfileIdSource = resolveCollapsedSessionAuthPinSource(params.entry);
			if (authProfileIdSource) fallbackRun.authProfileIdSource = authProfileIdSource;
			else delete fallbackRun.authProfileIdSource;
		} else if (hasEntryModelOverride) {
			delete fallbackRun.authProfileId;
			delete fallbackRun.authProfileIdSource;
		}
		return fallbackRun;
	};
	const refreshedProbe = resolveAutoFallbackPrimaryProbe({
		entry: params.entry,
		sessionKey: params.sessionKey,
		primaryProvider: probe.provider,
		primaryModel: probe.model
	});
	if (!refreshedProbe) return resolveEntrySelectionRun();
	return {
		...params.run,
		provider: refreshedProbe.provider,
		model: refreshedProbe.model,
		requestedRouteResolution: "resolved",
		autoFallbackPrimaryProbe: refreshedProbe
	};
}
/** Clears a recovered primary probe without overwriting a newer session selection. */
async function clearRecoveredAutoFallbackPrimaryProbeSelection(params) {
	if (shouldPreserveUserFacingSessionStateForInputProvenance(params.run.inputProvenance)) return;
	const probe = params.run.autoFallbackPrimaryProbe;
	if (!probe || params.provider !== probe.provider || params.model !== probe.model) return;
	if (!params.sessionKey || !params.activeSessionStore) return;
	const cachedSessionEntry = params.activeSessionStore[params.sessionKey];
	const activeSessionEntry = cachedSessionEntry ?? params.getActiveSessionEntry();
	if (!activeSessionEntry || !entryMatchesAutoFallbackPrimaryProbe(activeSessionEntry, probe)) return;
	const activeSessionEntryBeforeUpdate = structuredClone(activeSessionEntry);
	if (!params.storePath) {
		clearAutoFallbackPrimaryProbeSelection(activeSessionEntry);
		params.activeSessionStore[params.sessionKey] = activeSessionEntry;
		return;
	}
	let comparedEntry;
	const authoritativeEntry = await updateSessionEntry({
		storePath: params.storePath,
		sessionKey: params.sessionKey
	}, (persistedEntry) => {
		comparedEntry = persistedEntry;
		if (persistedEntry.sessionId !== activeSessionEntryBeforeUpdate.sessionId || persistedEntry.updatedAt !== activeSessionEntryBeforeUpdate.updatedAt || !entryMatchesAutoFallbackPrimaryProbe(persistedEntry, probe)) return null;
		const shouldClearAuthProfile = resolveSessionAuthProfileOverrideSource(persistedEntry) === "auto";
		clearAutoFallbackPrimaryProbeSelection(persistedEntry);
		return {
			providerOverride: void 0,
			modelOverride: void 0,
			modelOverrideSource: void 0,
			modelOverrideRouteResolution: void 0,
			modelOverrideFallbackOriginProvider: void 0,
			modelOverrideFallbackOriginModel: void 0,
			...shouldClearAuthProfile ? {
				authProfileOverride: void 0,
				authProfileOverrideSource: void 0,
				authProfileOverrideCompactionCount: void 0
			} : {},
			fallbackNotice: void 0,
			updatedAt: persistedEntry.updatedAt
		};
	}) ?? comparedEntry;
	const currentCachedEntry = params.activeSessionStore[params.sessionKey];
	if (currentCachedEntry !== cachedSessionEntry) return;
	const currentEntry = currentCachedEntry ?? (cachedSessionEntry ? void 0 : activeSessionEntry);
	if (!currentEntry) return;
	if (authoritativeEntry) {
		if (sessionEntryMatchesSnapshot(currentEntry, activeSessionEntryBeforeUpdate)) {
			params.activeSessionStore[params.sessionKey] = authoritativeEntry;
			return;
		}
		if (currentEntry.sessionId !== activeSessionEntryBeforeUpdate.sessionId || sessionEntryOnlyUpdatedAtChanged(currentEntry, activeSessionEntryBeforeUpdate)) return;
		params.activeSessionStore[params.sessionKey] = mergeSessionSnapshotChanges({
			initial: activeSessionEntryBeforeUpdate,
			next: authoritativeEntry,
			current: currentEntry
		});
	} else if (sessionEntryMatchesSnapshot(currentEntry, activeSessionEntryBeforeUpdate)) delete params.activeSessionStore[params.sessionKey];
}
//#endregion
//#region src/auto-reply/reply/agent-runner-context-recovery.ts
function buildContextOverflowResetHint() {
	return "\n\nTry starting a fresh session or using a model with a larger context window.";
}
function resolveAgentHeartbeatModelRaw(params) {
	const defaultModel = normalizeOptionalString(params.cfg.agents?.defaults?.heartbeat?.model);
	const agentId = normalizeLowercaseStringOrEmpty(params.agentId);
	return (agentId ? normalizeOptionalString(resolveAgentConfig(params.cfg, agentId)?.heartbeat?.model) : void 0) ?? defaultModel;
}
function normalizeModelRefForCompare(ref) {
	if (!ref) return;
	const provider = normalizeLowercaseStringOrEmpty(ref.provider);
	const model = normalizeLowercaseStringOrEmpty(ref.model);
	return provider && model ? {
		provider,
		model
	} : void 0;
}
function modelRefsEqual(left, right) {
	const normalizedLeft = normalizeModelRefForCompare(left);
	const normalizedRight = normalizeModelRefForCompare(right);
	return normalizedLeft !== void 0 && normalizedRight !== void 0 && normalizedLeft.provider === normalizedRight.provider && normalizedLeft.model === normalizedRight.model;
}
function formatContextWindowLabel(tokens) {
	if (tokens >= 1e6) return `${Math.round(tokens / 1e6 * 10) / 10}M`;
	return `${Math.round(tokens / 1024)}k`;
}
function normalizePositiveContextTokens(value) {
	if (typeof value !== "number" || !Number.isFinite(value) || value <= 0) return;
	return Math.floor(value);
}
function resolveContextWindowForHint(params) {
	const sessionContextTokens = normalizePositiveContextTokens(params.activeSessionEntry?.contextTokens);
	return resolveContextTokensForModel({
		cfg: params.cfg,
		provider: params.ref.provider,
		model: params.ref.model,
		allowAsyncLoad: false
	}) ?? sessionContextTokens;
}
function resolveHeartbeatBleedHint(params) {
	const primaryProvider = normalizeOptionalString(params.primaryProvider);
	const primaryModel = normalizeOptionalString(params.primaryModel);
	const runtimeProvider = normalizeOptionalString(params.activeSessionEntry?.modelProvider);
	const runtimeModel = normalizeOptionalString(params.activeSessionEntry?.model);
	if (!primaryProvider || !primaryModel || !runtimeProvider || !runtimeModel) return;
	const primaryRef = {
		provider: primaryProvider,
		model: primaryModel
	};
	const runtimeRef = {
		provider: runtimeProvider,
		model: runtimeModel
	};
	if (modelRefsEqual(primaryRef, runtimeRef)) return;
	const heartbeatModelRaw = resolveAgentHeartbeatModelRaw({
		cfg: params.cfg,
		agentId: params.agentId
	});
	if (!modelRefsEqual(runtimeRef, heartbeatModelRaw ? resolveModelRefFromString({
		cfg: params.cfg,
		raw: heartbeatModelRaw,
		defaultProvider: primaryProvider
	})?.ref : void 0)) return;
	const runtimeWindow = resolveContextWindowForHint({
		cfg: params.cfg,
		agentId: params.agentId,
		ref: runtimeRef,
		activeSessionEntry: params.activeSessionEntry
	});
	const primaryWindow = resolveContextWindowForHint({
		cfg: params.cfg,
		agentId: params.agentId,
		ref: primaryRef
	});
	if (typeof runtimeWindow === "number" && typeof primaryWindow === "number" && runtimeWindow >= primaryWindow) return;
	return `\n\nThe previous heartbeat turn left this session on ${runtimeProvider}/${runtimeModel}${typeof runtimeWindow === "number" && runtimeWindow > 0 ? ` (${formatContextWindowLabel(runtimeWindow)} context)` : ""} instead of ${primaryProvider}/${primaryModel}. This matches the configured \`heartbeat.model\`, so the overflow is likely heartbeat model bleed rather than a compaction-buffer problem. Set \`heartbeat.isolatedSession: true\`, enable \`heartbeat.lightContext: true\`, or use a heartbeat model with a larger context window.`;
}
/** Builds recovery instructions for context-overflow failures. */
function buildContextOverflowRecoveryText(params) {
	return (params.preserveSessionMapping ? "⚠️ Auto-compaction could not recover this turn. I kept this conversation mapped to the current session. Please try again, use /compact, or use /new to start a fresh session." : params.duringCompaction ? "⚠️ Context limit exceeded during compaction. I've reset our conversation to start fresh - please try again." : "⚠️ Context limit exceeded. I've reset our conversation to start fresh - please try again.") + ((!params.runtimeProvider || !params.runtimeModel || params.runtimeProvider === params.activeSessionEntry?.modelProvider && params.runtimeModel === params.activeSessionEntry?.model ? resolveHeartbeatBleedHint({
		cfg: params.cfg,
		agentId: params.agentId,
		primaryProvider: params.primaryProvider,
		primaryModel: params.primaryModel,
		activeSessionEntry: params.activeSessionEntry
	}) : void 0) ?? buildContextOverflowResetHint());
}
//#endregion
//#region src/auto-reply/reply/agent-runner-error-handler.ts
const MAX_LIVE_SWITCH_RETRIES = 2;
async function handleAgentExecutionError(params) {
	const turn = params.turn;
	const err = params.error;
	const postCompactionModelFailure = params.state.postCompactionModelAttempted && params.state.pendingLifecycleTerminal ? true : void 0;
	const takePendingLifecycleTerminal = () => {
		const terminal = params.state.pendingLifecycleTerminal?.backstop ?? createAgentLifecycleTerminalBackstop({
			runId: params.runId,
			sessionKey: turn.sessionKey,
			startedAt: params.state.turnStartedAtMs,
			getLifecycleGeneration: () => params.state.lifecycleGeneration,
			resolveTerminationFields: (error) => resolveReplyOperationTerminationFields(error, turn.replyOperation?.abortSignal ?? turn.opts?.abortSignal, turn.replyOperation)
		});
		params.state.pendingLifecycleTerminal = void 0;
		return terminal;
	};
	const settleFailure = async (payload, isGenericRunnerFailure = false) => {
		takePendingLifecycleTerminal().emit("error", err);
		turn.replyOperation?.fail("run_failed", err);
		await params.modelPatch.fail(err);
		const replyExpectation = resolveReplyExpectation(turn.followupRun.run);
		payload.text = resolveAgentRunFailureText({
			text: payload.text,
			replyExpectation,
			isGenericRunnerFailure,
			visibleReplyDelivered: replyExpectation === "optional" && isGenericRunnerFailure ? await params.resolveVisibleReplyDelivery() : false
		});
		return {
			kind: "final",
			payload: markAgentRunFailureReplyPayload(payload),
			postCompactionModelFailure
		};
	};
	const resolveReplyOperationAbortAction = (abortError) => {
		const reason = resolveReplyOperationAbortReason(turn.replyOperation, abortError, turn.replyOperation?.abortSignal ?? turn.opts?.abortSignal);
		if (!reason) return;
		const terminalMetadata = reason === "user" ? void 0 : {
			aborted: true,
			stopReason: reason
		};
		takePendingLifecycleTerminal().emit(reason === "restart" ? "end" : "error", abortError, terminalMetadata);
		return {
			kind: "aborted",
			reason
		};
	};
	const replyOperationAbortAction = resolveReplyOperationAbortAction(err);
	if (replyOperationAbortAction) return replyOperationAbortAction;
	if (err instanceof LiveSessionModelSwitchError) {
		if (params.liveModelSwitchRetries <= MAX_LIVE_SWITCH_RETRIES) {
			params.state.pendingLifecycleTerminal = void 0;
			return {
				kind: "retry",
				liveModelSwitchError: err
			};
		}
		defaultRuntime.error(`Live model switch failed after ${MAX_LIVE_SWITCH_RETRIES} retries (${sanitizeForLog(err.provider)}/${sanitizeForLog(err.model)}). The requested model may be unavailable.`);
		takePendingLifecycleTerminal().emit("error", err);
		const switchErrorText = params.shouldSurfaceToControlUi ? renderControlUiAgentFailureCopy("model switch could not be completed. The requested model may be temporarily unavailable.") : isVerboseFailureDetailEnabled(turn.resolvedVerboseLevel) ? "⚠️ Agent failed before reply: model switch could not be completed. The requested model may be temporarily unavailable. Please try again shortly." : "⚠️ Model switch could not be completed. The requested model may be temporarily unavailable. Please try again shortly.";
		turn.replyOperation?.fail("run_failed", err);
		await params.modelPatch.fail(err);
		return {
			kind: "final",
			payload: markAgentRunFailureReplyPayload({ text: switchErrorText })
		};
	}
	const message = formatErrorMessage(err);
	params.timing.logIfSlow({
		runId: params.runId,
		sessionId: turn.followupRun.run.sessionId,
		sessionKey: turn.sessionKey,
		outcome: "error",
		error: message
	});
	if (isAgentHarnessPreflightError(err)) {
		const externalReply = buildExternalRunFailureReply({
			message,
			error: err
		}, {
			includeDetails: isVerboseFailureDetailEnabled(turn.resolvedVerboseLevel),
			isHeartbeat: turn.isHeartbeat
		});
		return await settleFailure({ text: params.shouldSurfaceToControlUi && err.userMessage === void 0 ? renderControlUiAgentFailureCopy(message) : externalReply.text }, externalReply.isGenericRunnerFailure);
	}
	const failoverFacts = resolveReplyFailoverFacts(err, message);
	const failureSummary = resolveReplyFailureSummary({
		error: err,
		message,
		reason: failoverFacts.reason,
		attempts: isFailoverError(err) ? err.attempts : void 0
	});
	const failoverReason = failoverFacts.reason;
	const isBilling = failureSummary?.kind === "billing";
	const isContextOverflow = !isBilling && (failoverReason === "context_overflow" || isLikelyContextOverflowError(message));
	const isCompactionFailure = !isBilling && isCompactionFailureError(message);
	const oauthRefreshFailure = classifyOAuthRefreshFailureError(err) ?? classifyOAuthRefreshFailure(message);
	const hasAuthProfileFailoverFailure = buildAuthProfileFailoverFailureText(err) !== null;
	const providerRequestError = !isBilling && !oauthRefreshFailure && !hasAuthProfileFailoverFailure && !params.shouldSurfaceToControlUi ? failoverFacts.providerRequestError : void 0;
	const restartLifecycleError = resolveRestartLifecycleError(err);
	if (restartLifecycleError instanceof GatewayDrainingError || restartLifecycleError instanceof CommandLaneClearedError) {
		takePendingLifecycleTerminal().emit("error", restartLifecycleError);
		turn.replyOperation?.fail(restartLifecycleError instanceof GatewayDrainingError ? "gateway_draining" : "command_lane_cleared", restartLifecycleError);
		return {
			kind: "final",
			payload: markAgentRunFailureReplyPayload({ text: buildRestartLifecycleReplyText() })
		};
	}
	if (isCompactionFailure) {
		takePendingLifecycleTerminal().emit("error", err);
		defaultRuntime.error(`Auto-compaction failed (${message}). Preserving existing session mapping for ${turn.sessionKey ?? turn.followupRun.run.sessionId}.`);
		turn.replyOperation?.fail("run_failed", err);
		return {
			kind: "final",
			payload: markAgentRunFailureReplyPayload({ text: buildContextOverflowRecoveryText({
				duringCompaction: true,
				preserveSessionMapping: true,
				cfg: params.runtimeConfig,
				agentId: turn.followupRun.run.agentId,
				primaryProvider: turn.followupRun.run.provider,
				primaryModel: turn.followupRun.run.model,
				runtimeProvider: params.state.attemptedRuntimeProvider,
				runtimeModel: params.state.attemptedRuntimeModel,
				activeSessionEntry: turn.getActiveSessionEntry()
			}) })
		};
	}
	const replayPrevented = findCliTimeoutError(err)?.cliTimeout.observedActivity === true;
	if (providerRequestError) return await settleFailure({ text: providerRequestError.userMessage });
	defaultRuntime.error(`Embedded agent failed before reply: ${message}`);
	const externalRunFailureCandidate = !failureSummary && !isContextOverflow ? buildExternalRunFailureReply({
		message,
		error: err
	}, {
		includeAuthProfileId: !isNonDirectConversationContext(turn.sessionCtx),
		includeDetails: isVerboseFailureDetailEnabled(turn.resolvedVerboseLevel),
		isHeartbeat: turn.isHeartbeat,
		replayPrevented,
		failoverFacts
	}) : void 0;
	const externalRunFailureReply = !params.shouldSurfaceToControlUi || externalRunFailureCandidate?.presentation || renderFailoverCodeUserCopy(failoverFacts.code) ? externalRunFailureCandidate : void 0;
	return await settleFailure({
		text: failureSummary?.text ?? (isContextOverflow ? "⚠️ Context overflow — prompt too large for this model. Try a shorter message or a larger-context model." : externalRunFailureReply?.text ?? (params.shouldSurfaceToControlUi ? renderControlUiAgentFailureCopy(message) : turn.isHeartbeat ? HEARTBEAT_EXTERNAL_RUN_FAILURE_TEXT : "⚠️ Something went wrong while processing your request. Please try again, or use /new to start a fresh session.")),
		...externalRunFailureReply?.presentation ? { presentation: externalRunFailureReply.presentation } : {}
	}, !failureSummary && !isContextOverflow && (externalRunFailureCandidate?.isGenericRunnerFailure ?? !turn.isHeartbeat));
}
//#endregion
//#region src/infra/message-tool-run-outcome-store.ts
const MESSAGE_TOOL_RUN_OUTCOME_MAX_ROWS = 1e4;
/** Records one bounded completion fact for a message-tool-only run. */
function recordMessageToolRunOutcome(params) {
	const values = {
		run_id: params.runId,
		session_key: params.sessionKey,
		agent_id: params.agentId,
		provider: params.provider,
		model: params.model,
		outcome: params.outcome,
		run_status: params.runStatus,
		occurred_at: params.occurredAt
	};
	const databaseOptions = toDatabaseOptions(resolveSqliteScope(params));
	ensureMessageToolRunOutcomeSchema(openOpenClawAgentDatabase(databaseOptions).db);
	runOpenClawAgentWriteTransaction(({ db }) => {
		const agentDb = getNodeSqliteKysely(db);
		executeSqliteQuerySync(db, agentDb.insertInto("message_tool_run_outcomes").values(values));
		executeSqliteQuerySync(db, agentDb.deleteFrom("message_tool_run_outcomes").where("id", "in", agentDb.selectFrom("message_tool_run_outcomes").select("id").orderBy("occurred_at", "desc").orderBy("id", "desc").limit(2147483647).offset(MESSAGE_TOOL_RUN_OUTCOME_MAX_ROWS)));
	}, databaseOptions, { operationLabel: "message-tool.run-outcome.record" });
}
//#endregion
//#region src/auto-reply/reply/agent-runner-execution-outcome.ts
const messageToolOutcomeLog = createSubsystemLogger("auto-reply/message-tool-outcome");
function recordAgentTurnExecutionOutcome(params, result) {
	const executionStatus = resolveAgentTurnExecutionStatus(result?.outcome);
	if (executionStatus !== "cancelled") params.opts?.onAgentRunTerminalOutcome?.(executionStatus === "ok" ? "completed" : "failed");
	if ((params.followupRun.run.sourceReplyDeliveryMode ?? params.opts?.sourceReplyDeliveryMode) !== "message_tool_only") return;
	const sessionKey = params.sessionKey ?? params.followupRun.run.sessionKey;
	if (!sessionKey) {
		messageToolOutcomeLog.warn("message-tool-only run outcome missing session key", {
			runId: result?.runId ?? params.opts?.runId,
			agentId: params.followupRun.run.agentId
		});
		return;
	}
	const outcome = result?.outcome;
	const resolved = outcome?.kind === "settled" || outcome?.kind === "rejected" ? outcome.resolved : void 0;
	const runStatus = executionStatus === "ok" ? "completed" : executionStatus === "failed" ? "errored" : "aborted";
	const toolDelivered = outcome?.kind === "settled" && hasCompletedSourceReplyDeliveryEvidence(outcome.result);
	const values = {
		runId: result?.runId ?? params.opts?.runId ?? "unknown",
		sessionKey,
		agentId: params.followupRun.run.agentId,
		provider: resolved?.provider ?? params.followupRun.run.provider,
		model: resolved?.model ?? params.followupRun.run.model,
		outcome: toolDelivered ? "tool_delivered" : "mute",
		runStatus,
		occurredAt: Date.now(),
		storePath: params.storePath
	};
	try {
		recordMessageToolRunOutcome(values);
		messageToolOutcomeLog.info("recorded message-tool-only run outcome", values);
	} catch (error) {
		messageToolOutcomeLog.warn("failed to record message-tool-only run outcome", {
			...values,
			error: formatErrorMessage(error)
		});
	}
}
//#endregion
//#region src/auto-reply/reply/agent-event-bridge.ts
function createAgentEventDeliveryStartOrder(options) {
	let startTail = Promise.resolve();
	let settledTail = Promise.resolve();
	return {
		preserveCallbackStartOrder: options?.preserveCallbackStartOrder ?? true,
		schedule: (deliver, deliveryOptions) => {
			const previousStart = startTail;
			const previousSettlement = settledTail;
			let releaseStart;
			startTail = new Promise((resolve) => {
				releaseStart = resolve;
			});
			const scheduled = (async () => {
				await previousStart;
				if (deliveryOptions?.waitForEarlierDeliveries) await previousSettlement;
				let delivery;
				try {
					delivery = deliver();
				} finally {
					releaseStart?.();
				}
				await delivery;
			})();
			settledTail = Promise.all([previousSettlement, scheduled.catch(() => void 0)]).then(() => void 0);
			return scheduled;
		}
	};
}
function createAgentEventBridge(params) {
	const deliver = params.deliver;
	if (!deliver) return {
		unsubscribe: () => void 0,
		drain: async () => void 0
	};
	let unsubscribed = false;
	let delivery = Promise.resolve();
	const rawUnsubscribe = onAgentEventForRun(params.runId, (evt) => {
		if (evt.runId !== params.runId) return;
		if (params.suppressed) return;
		const payload = params.read(evt);
		if (payload === void 0) return;
		if (!params.startOrder) {
			delivery = delivery.then(() => deliver(payload)).catch(() => void 0);
			return;
		}
		const previousDelivery = delivery;
		const scheduled = params.startOrder.schedule(() => params.startOrder?.preserveCallbackStartOrder === false ? previousDelivery.then(() => deliver(payload)) : deliver(payload), { waitForEarlierDeliveries: params.waitForEarlierDeliveries?.(payload) }).catch(() => void 0);
		delivery = Promise.all([delivery, scheduled]).then(() => void 0);
	});
	return {
		unsubscribe() {
			if (unsubscribed) return;
			unsubscribed = true;
			rawUnsubscribe();
		},
		async drain() {
			await delivery;
		}
	};
}
//#endregion
//#region src/auto-reply/reply/cli-assistant-bridge.ts
function createAssistantTextBridge(params) {
	let lastText;
	return createAgentEventBridge({
		runId: params.runId,
		suppressed: params.suppressed,
		startOrder: params.startOrder,
		waitForEarlierDeliveries: (payload) => payload.completed,
		deliver: async (payload) => {
			if (payload.completed) await params.deliverCompleted?.(payload.text, payload.assistantMessageIndex);
			else await params.deliver?.(payload.text);
		},
		read: (evt) => {
			if (evt.stream !== "assistant") return;
			if (typeof evt.data.completedText === "string" && typeof evt.data.assistantMessageIndex === "number") return {
				text: evt.data.completedText,
				completed: true,
				assistantMessageIndex: evt.data.assistantMessageIndex
			};
			const text = typeof evt.data.text === "string" ? evt.data.text : void 0;
			if (text === void 0 || text === lastText) return;
			lastText = text;
			return {
				text,
				completed: false
			};
		}
	});
}
//#endregion
//#region src/auto-reply/reply/agent-runner-cli-dispatch.ts
async function stopAgentEventBridges(bridges) {
	for (const bridge of bridges) bridge.unsubscribe();
	for (const bridge of bridges) await bridge.drain();
}
function createCliReasoningStreamBridge(onReasoningStream) {
	if (!onReasoningStream) return;
	return async ({ text, isReasoningSnapshot }) => {
		await onReasoningStream({
			text,
			...isReasoningSnapshot ? { isReasoningSnapshot } : {},
			requiresReasoningProgressOptIn: true
		});
	};
}
function createReasoningTextBridge(params) {
	let lastText;
	return createAgentEventBridge({
		runId: params.runId,
		suppressed: params.suppressed,
		deliver: params.deliver,
		startOrder: params.startOrder,
		read: (evt) => {
			if (evt.stream !== "thinking") return;
			const text = typeof evt.data.text === "string" ? evt.data.text : void 0;
			if (text === void 0 || text === lastText) return;
			lastText = text;
			return {
				text,
				...evt.data.isReasoningSnapshot === true ? { isReasoningSnapshot: true } : {}
			};
		}
	});
}
function createReasoningProgressBridge(params) {
	let lastProgressTokens;
	return createAgentEventBridge({
		runId: params.runId,
		suppressed: params.suppressed,
		deliver: params.deliver,
		startOrder: params.startOrder,
		read: (evt) => {
			if (evt.stream !== "thinking") return;
			const progressTokens = evt.data.progressTokens;
			if (typeof progressTokens !== "number" || !Number.isFinite(progressTokens) || progressTokens <= 0 || progressTokens === lastProgressTokens) return;
			lastProgressTokens = progressTokens;
			return { progressTokens };
		}
	});
}
function readCommentaryTextPayload(evt) {
	if (evt.stream !== "item" || evt.data.kind !== "preamble") return;
	const text = typeof evt.data.progressText === "string" ? evt.data.progressText.trim() : "";
	if (!text) return;
	return {
		text,
		...typeof evt.data.itemId === "string" ? { itemId: evt.data.itemId } : {}
	};
}
function keepCliSessionBindingOnlyWhenReused(params) {
	const existingSessionId = normalizeOptionalString(params.existingSessionId);
	const agentMeta = params.result.meta.agentMeta;
	const returnedSessionId = normalizeOptionalString(agentMeta?.cliSessionBinding?.sessionId);
	const shouldClearStoredSession = agentMeta?.clearCliSessionBinding === true;
	if (agentMeta === void 0 || !shouldClearStoredSession && existingSessionId === void 0 || returnedSessionId === existingSessionId) return params.result;
	if (returnedSessionId || shouldClearStoredSession) params.onDroppedReplacement?.();
	return {
		...params.result,
		meta: {
			...params.result.meta,
			agentMeta: {
				...agentMeta,
				sessionId: "",
				cliSessionBinding: void 0,
				clearCliSessionBinding: void 0
			}
		}
	};
}
function createToolEventBridge(params) {
	return createAgentEventBridge({
		runId: params.runId,
		suppressed: params.suppressed,
		deliver: params.deliver,
		startOrder: params.startOrder,
		read: (evt) => {
			if (evt.stream !== "tool") return;
			const phaseValue = evt.data.phase;
			if (phaseValue !== "start" && phaseValue !== "update" && phaseValue !== "result") return;
			const phase = phaseValue === "start" ? "start" : phaseValue === "update" ? "update" : "result";
			return {
				name: typeof evt.data.name === "string" ? evt.data.name : void 0,
				phase,
				args: isRecord(evt.data.args) ? evt.data.args : void 0,
				toolCallId: typeof evt.data.toolCallId === "string" ? evt.data.toolCallId : void 0,
				...phase === "result" ? {
					isError: evt.data.isError === true,
					result: evt.data.result
				} : {}
			};
		}
	});
}
/**
* Tracks CLI tool start/result events and renders the same durable tool
* summaries the embedded runner emits: a formatToolAggregate line per result
* (args-derived meta captured at start), plus the output block under full
* verbose. Keeps CLI runs at tool-summary parity with embedded runs.
*/
function createCliToolSummaryTracker(params) {
	const toolByCallId = /* @__PURE__ */ new Map();
	return { noteToolEvent: async (payload) => {
		if (payload.phase === "start") {
			if (payload.toolCallId && payload.name) toolByCallId.set(payload.toolCallId, {
				name: payload.name,
				meta: inferToolMetaFromArgsCore(payload.name, payload.args, { detailMode: params.detailMode ?? "explain" }),
				commandBearing: isCommandBearingToolCall(payload.name, payload.args)
			});
			return false;
		}
		if (payload.phase !== "result") return false;
		const storedTool = payload.toolCallId ? toolByCallId.get(payload.toolCallId) : void 0;
		const toolName = payload.name ?? storedTool?.name;
		const meta = params.commandDetailsVisible || !storedTool?.commandBearing ? storedTool?.meta : void 0;
		if (payload.toolCallId) toolByCallId.delete(payload.toolCallId);
		if (payload.isError !== true && isAgentPlanProgressToolName(stripOpenClawMcpToolPrefix(toolName ?? ""))) return false;
		if (!params.shouldEmitToolResult()) return storedTool?.commandBearing === true;
		const aggregate = formatToolAggregate(toolName, meta ? [meta] : void 0, { markdown: true });
		let text = aggregate;
		if (params.shouldEmitToolOutput()) {
			const output = extractToolResultText(payload.result)?.trim();
			if (output) text = `${aggregate}\n\`\`\`txt\n${output}\n\`\`\``;
		}
		if (!text.trim()) return storedTool?.commandBearing === true;
		await params.deliver({
			text,
			...payload.isError === true ? { isError: true } : {}
		});
		return storedTool?.commandBearing === true;
	} };
}
function createCommentaryEventBridge(params) {
	return createAgentEventBridge({
		runId: params.runId,
		suppressed: params.suppressed,
		deliver: params.deliver,
		startOrder: params.startOrder,
		read: readCommentaryTextPayload
	});
}
function createPlanUpdateBridge(params) {
	const deliver = params.deliver;
	return createAgentEventBridge({
		runId: params.runId,
		suppressed: params.suppressed,
		deliver: deliver ? async (payload) => {
			await deliver(payload);
		} : void 0,
		startOrder: params.startOrder,
		read: (evt) => {
			if (evt.stream !== "plan") return;
			return {
				phase: normalizeOptionalString(evt.data.phase),
				title: normalizeOptionalString(evt.data.title),
				explanation: normalizeOptionalString(evt.data.explanation),
				...evt.data.explanationFormat === "plain" ? { explanationFormat: "plain" } : {},
				steps: normalizeAgentPlanSteps(evt.data.steps),
				source: normalizeOptionalString(evt.data.source)
			};
		}
	});
}
function createToolBoundaryBridge(params) {
	return createAgentEventBridge({
		runId: params.runId,
		suppressed: params.suppressed,
		deliver: params.deliver,
		read: (evt) => {
			if (evt.stream !== "tool") return;
			const phase = typeof evt.data.phase === "string" ? evt.data.phase : "";
			return [
				"completed",
				"end",
				"error",
				"result"
			].includes(phase) ? true : void 0;
		}
	});
}
function runCliAgentWithLifecycle(params) {
	if (!params.lifecycleGeneration) return runCliAgentWithLifecycleInternal(params);
	return withAgentRunLifecycleGeneration(params.lifecycleGeneration, () => runCliAgentWithLifecycleInternal(params));
}
async function runCliAgentWithLifecycleInternal(params) {
	const startedAt = params.startedAt ?? Date.now();
	const fastModeStartedAtMs = params.runParams.fastModeStartedAtMs ?? startedAt;
	const fastModeAutoOnSeconds = params.runParams.fastModeAutoOnSeconds ?? 60;
	const fastModeAutoProgressState = params.runParams.fastModeAutoProgressState ?? {
		offAnnounced: false,
		resetAnnounced: false
	};
	const emitFastModeAutoProgress = async (payload) => {
		const summary = formatFastModeAutoProgressText(payload);
		emitAgentEvent({
			runId: params.runId,
			stream: "item",
			data: {
				kind: "status",
				title: "Fast",
				phase: "update",
				summary
			},
			...params.runParams.sessionKey ? { sessionKey: params.runParams.sessionKey } : {}
		});
		try {
			await params.onFastModeAutoProgress?.({
				text: summary,
				channelData: { openclawProgressKind: FAST_MODE_AUTO_PROGRESS_KIND }
			});
		} catch {}
	};
	const maybeAnnounceFastModeAutoOff = async () => {
		if (params.runParams.fastMode !== "auto" || fastModeAutoProgressState.offAnnounced) return;
		const next = resolveFastModeForElapsed({
			mode: "auto",
			startedAtMs: fastModeStartedAtMs,
			fastAutoOnSeconds: fastModeAutoOnSeconds
		});
		if (next.enabled) return;
		fastModeAutoProgressState.offAnnounced = true;
		await emitFastModeAutoProgress(next);
	};
	const maybeEmitFastModeAutoReset = async () => {
		if (params.runParams.fastMode !== "auto" || !fastModeAutoProgressState.offAnnounced || fastModeAutoProgressState.resetAnnounced) return;
		fastModeAutoProgressState.resetAnnounced = true;
		await emitFastModeAutoProgress({
			enabled: true,
			elapsedSeconds: 0,
			fastAutoOnSeconds: fastModeAutoOnSeconds
		});
	};
	const emitLifecycleTerminal = params.emitLifecycleTerminal ?? true;
	params.onAgentRunStart?.();
	emitAgentEvent({
		runId: params.runId,
		...params.runParams.agentId ? { agentId: params.runParams.agentId } : {},
		...params.runParams.sessionKey ? { sessionKey: params.runParams.sessionKey } : {},
		...params.runParams.sessionId ? { sessionId: params.runParams.sessionId } : {},
		...params.lifecycleGeneration ? { lifecycleGeneration: params.lifecycleGeneration } : {},
		stream: "lifecycle",
		data: {
			phase: "start",
			startedAt
		}
	});
	const activityBridge = params.onActivity ? createAgentEventBridge({
		runId: params.runId,
		read: () => ({}),
		deliver: async () => {
			params.onActivity?.();
		}
	}) : void 0;
	const progressStartOrder = createAgentEventDeliveryStartOrder({ preserveCallbackStartOrder: params.preserveProgressCallbackStartOrder === true });
	const assistantBridge = createAssistantTextBridge({
		runId: params.runId,
		suppressed: params.suppressAssistantBridge,
		deliver: params.onAssistantText,
		deliverCompleted: params.onCompletedReply,
		startOrder: progressStartOrder
	});
	let finalReasoningText;
	const bridges = [
		activityBridge,
		assistantBridge,
		createReasoningTextBridge({
			runId: params.runId,
			suppressed: params.suppressAssistantBridge,
			startOrder: progressStartOrder,
			deliver: async (payload) => {
				finalReasoningText = normalizeOptionalString(payload.text);
				await params.onReasoningText?.(payload);
			}
		}),
		createReasoningProgressBridge({
			runId: params.runId,
			suppressed: params.suppressAssistantBridge,
			deliver: params.onReasoningProgress,
			startOrder: progressStartOrder
		}),
		createAgentEventBridge({
			runId: params.runId,
			suppressed: params.suppressAssistantBridge,
			startOrder: progressStartOrder,
			deliver: async (event) => {
				if (event.phase === "start") await params.onCompactionStart?.();
				else await params.onCompactionEnd?.({ completed: event.completed });
			},
			read: (evt) => {
				if (evt.stream !== "compaction") return;
				if (evt.data.phase === "start") return { phase: "start" };
				return evt.data.phase === "end" ? {
					phase: "end",
					completed: evt.data.completed === true
				} : void 0;
			}
		}),
		createToolEventBridge({
			runId: params.runId,
			suppressed: params.suppressAssistantBridge,
			deliver: params.onToolEvent,
			startOrder: progressStartOrder
		}),
		createCommentaryEventBridge({
			runId: params.runId,
			suppressed: params.suppressAssistantBridge,
			deliver: params.onCommentaryText,
			startOrder: progressStartOrder
		}),
		createAgentEventBridge({
			runId: params.runId,
			suppressed: params.suppressAssistantBridge,
			startOrder: progressStartOrder,
			read: (evt) => evt.stream === "item" && evt.data.kind !== "preamble" && Value.Check(AgentActivityItemSchema, evt.data) ? evt.data : void 0,
			deliver: params.onItemEvent ? async (item) => {
				await params.onItemEvent?.(item);
			} : void 0
		}),
		createPlanUpdateBridge({
			runId: params.runId,
			suppressed: params.suppressAssistantBridge,
			deliver: params.onPlanUpdate,
			startOrder: progressStartOrder
		}),
		createToolBoundaryBridge({
			runId: params.runId,
			suppressed: params.suppressAssistantBridge,
			deliver: maybeAnnounceFastModeAutoOff
		})
	].filter((bridge) => bridge !== void 0);
	let lifecycleTerminalEmitted = false;
	try {
		const rawResult = await runCliAgent({
			...params.runParams,
			emitCommentaryText: params.runParams.emitCommentaryText ?? Boolean(params.onCommentaryText)
		});
		const restartAbortReason = params.runParams.abortSignal?.reason;
		if (isAgentRunRestartAbortReason(restartAbortReason)) throw restartAbortReason;
		const result = params.transformResult?.(rawResult) ?? rawResult;
		await stopAgentEventBridges(bridges);
		const cliText = result.payloads?.length ? normalizeOptionalString(result.meta.finalAssistantVisibleText) ?? normalizeOptionalString(result.payloads[0]?.text) : void 0;
		const durableReasoningText = normalizeOptionalString(finalReasoningText);
		const resultWithReasoning = durableReasoningText ? {
			...result,
			payloads: [{
				text: durableReasoningText,
				isReasoning: true
			}, ...result.payloads ?? []]
		} : result;
		if (cliText) emitAgentEvent({
			runId: params.runId,
			stream: "assistant",
			data: { text: cliText }
		});
		if (emitLifecycleTerminal) {
			emitAgentEvent({
				runId: params.runId,
				...params.runParams.agentId ? { agentId: params.runParams.agentId } : {},
				...params.runParams.sessionKey ? { sessionKey: params.runParams.sessionKey } : {},
				...params.runParams.sessionId ? { sessionId: params.runParams.sessionId } : {},
				...params.lifecycleGeneration ? { lifecycleGeneration: params.lifecycleGeneration } : {},
				stream: "lifecycle",
				data: {
					phase: "end",
					startedAt,
					endedAt: Date.now(),
					...resolveAgentLifecycleTerminalMetadata(result.meta),
					...resolveAgentRunAbortLifecycleFields(params.runParams.abortSignal)
				}
			});
			lifecycleTerminalEmitted = true;
		}
		return resultWithReasoning;
	} catch (err) {
		await stopAgentEventBridges(bridges);
		await params.onErrorBeforeLifecycle?.(err);
		if (emitLifecycleTerminal) {
			emitAgentEvent({
				runId: params.runId,
				...params.runParams.agentId ? { agentId: params.runParams.agentId } : {},
				...params.runParams.sessionKey ? { sessionKey: params.runParams.sessionKey } : {},
				...params.runParams.sessionId ? { sessionId: params.runParams.sessionId } : {},
				...params.lifecycleGeneration ? { lifecycleGeneration: params.lifecycleGeneration } : {},
				stream: "lifecycle",
				data: {
					phase: "error",
					startedAt,
					endedAt: Date.now(),
					error: String(err),
					...resolveAgentRunErrorLifecycleFields(err, params.runParams.abortSignal)
				}
			});
			lifecycleTerminalEmitted = true;
		}
		throw err;
	} finally {
		for (const bridge of bridges) bridge.unsubscribe();
		if (params.runParams.isFinalFallbackAttempt !== false) await maybeEmitFastModeAutoReset();
		if (emitLifecycleTerminal && !lifecycleTerminalEmitted) emitAgentEvent({
			runId: params.runId,
			...params.runParams.agentId ? { agentId: params.runParams.agentId } : {},
			...params.runParams.sessionKey ? { sessionKey: params.runParams.sessionKey } : {},
			...params.runParams.sessionId ? { sessionId: params.runParams.sessionId } : {},
			...params.lifecycleGeneration ? { lifecycleGeneration: params.lifecycleGeneration } : {},
			stream: "lifecycle",
			data: {
				phase: "error",
				startedAt,
				endedAt: Date.now(),
				error: "CLI run completed without lifecycle terminal event",
				...resolveAgentRunAbortLifecycleFields(params.runParams.abortSignal)
			}
		});
	}
}
//#endregion
//#region src/auto-reply/reply/agent-runner-command-output.ts
/**
* CLI backends report a tool result as its raw content: a string, or the text
* blocks the harness streamed. Structured runners send a record instead, so the
* command projection has to read both or every CLI command result is dropped.
*/
function readToolResultText(value) {
	const direct = readStringValue(value);
	if (direct !== void 0) return direct;
	if (!Array.isArray(value)) return;
	return value.map((block) => readStringValue(asOptionalRecord(block)?.text)).filter((part) => part !== void 0).join("\n").trim() || void 0;
}
function readNullableNumberValue(value) {
	if (value === null) return null;
	return asFiniteNumber(value);
}
function isCommandToolName(name) {
	const normalized = name?.trim().toLowerCase();
	return normalized === "exec" || normalized === "bash" || normalized === "shell";
}
/** Projects a completed command-tool event into the channel command-output contract. */
function buildCommandOutputFromToolResultEvent(evt) {
	if (evt.stream !== "tool" || evt.data.phase !== "result") return;
	const name = evt.data.name;
	const commandBearing = evt.data.commandBearing === true;
	if (!name || !commandBearing && !isCommandToolName(name)) return;
	const result = asOptionalRecord(evt.data.result);
	const details = asOptionalRecord(result?.details);
	const output = evt.data.output ?? readStringValue(result?.output) ?? readStringValue(details?.output) ?? readToolResultText(evt.data.result);
	const explicitStatus = evt.data.status ?? readStringValue(result?.status) ?? readStringValue(details?.status);
	const exitCode = readNullableNumberValue(result?.exitCode ?? details?.exitCode ?? evt.data.exitCode);
	const durationMs = asFiniteNumber(result?.durationMs ?? details?.durationMs ?? evt.data.durationMs);
	const cwd = evt.data.cwd;
	const errorStatus = evt.data.isError === true ? "failed" : evt.data.isError === false ? "completed" : void 0;
	if (!(output !== void 0 || explicitStatus !== void 0 || exitCode !== void 0 || durationMs !== void 0 || cwd !== void 0 || commandBearing && typeof evt.data.isError === "boolean" || result !== void 0 && Object.keys(result).length > 0)) return;
	const args = evt.data.args;
	const title = evt.data.title ?? (args ? inferToolMetaFromArgsCore(name, args, { detailMode: "explain" }) : void 0);
	return {
		itemId: evt.data.itemId,
		phase: "end",
		title,
		toolCallId: evt.data.toolCallId,
		name,
		output,
		status: explicitStatus ?? errorStatus,
		exitCode,
		durationMs,
		cwd
	};
}
//#endregion
//#region src/auto-reply/reply/cli-reply-payload.ts
function prepareCliReplyPayload(text, currentMessageId, assistantMessageIndex) {
	const parsed = parseReplyDirectives(text, { currentMessageId });
	const reply = {
		text: parsed.text,
		mediaUrls: parsed.mediaUrls,
		replyToId: parsed.replyToId,
		replyToCurrent: parsed.replyToCurrent,
		...parsed.replyToTag ? { replyToTag: true } : {},
		audioAsVoice: parsed.audioAsVoice
	};
	if (assistantMessageIndex !== void 0) setReplyPayloadMetadata(reply, { assistantMessageIndex });
	if (parsed.isSilent) setReplyPayloadMetadata(reply, { silentReply: true });
	return reply;
}
//#endregion
//#region src/auto-reply/reply/agent-runner-cli-candidate.ts
async function runCliFallbackCandidate(params) {
	const turn = params.turn;
	const onPreparedBlockReply = turn.opts?.onPreparedBlockReply;
	const onNativeBlockReply = turn.opts?.onBlockReply ?? (onPreparedBlockReply ? async (payload, context) => {
		for (const plan of createStructuredOutboundPayloadPlan([payload])) await onPreparedBlockReply(plan, context);
	} : void 0);
	const expectedLifecycleRevision = turn.getActiveSessionEntry()?.lifecycleRevision;
	const selectedModelEntry = findModelInCatalog(params.candidateRun.thinkingCatalog ?? [], params.provider, params.model);
	const modelHasVision = await resolveRunModelHasVision({
		run: params.candidateRun,
		provider: params.provider,
		model: params.model
	});
	const sessionKey = turn.sessionKey ?? turn.followupRun.run.sessionKey;
	const sessionTarget = sessionKey && turn.storePath ? {
		agentId: turn.followupRun.run.agentId,
		sessionId: turn.followupRun.run.sessionId,
		sessionKey,
		storePath: turn.storePath
	} : void 0;
	const cliLifecycleStartedAt = Date.now();
	const lifecycleBackstop = createAgentLifecycleTerminalBackstop({
		runId: params.runId,
		sessionKey: turn.sessionKey,
		startedAt: cliLifecycleStartedAt,
		getLifecycleGeneration: () => params.lifecycleGeneration,
		resolveTerminationFields: (error) => resolveReplyOperationTerminationFields(error, params.runAbortSignal, turn.replyOperation)
	});
	params.onLifecycleBackstop(lifecycleBackstop);
	const allowCliAuthProfileForwarding = cliBackendAcceptsAuthProfileForwarding({
		provider: params.cliExecutionProvider,
		config: params.runtimeConfig,
		agentId: params.candidateRun.agentId
	});
	const hookMessageProvider = resolveOriginMessageProvider({
		originatingChannel: turn.followupRun.originatingChannel,
		provider: turn.sessionCtx.Provider
	});
	const cliCurrentThreadId = turn.followupRun.originatingThreadId ?? turn.sessionCtx.MessageThreadId;
	const cliCurrentMessageId = turn.sessionCtx.InputProvenance?.kind === "internal_system" && turn.sessionCtx.InputProvenance.sourceTool === "restart-sentinel" ? turn.sessionCtx.ReplyToId : turn.sessionCtx.MessageSidFull ?? turn.sessionCtx.MessageSid;
	const commandDetailsVisible = turn.resolvedVerboseLevel === "full";
	const cliToolSummaryTracker = createCliToolSummaryTracker({
		detailMode: turn.toolProgressDetail,
		commandDetailsVisible,
		shouldEmitToolResult: turn.shouldEmitToolResult,
		shouldEmitToolOutput: turn.shouldEmitToolOutput,
		deliver: async (payload) => {
			await turn.opts?.onToolResult?.(payload);
		}
	});
	const deliverCliCommandOutcome = async (payload, commandBearing) => {
		const onCommandOutput = turn.opts?.onCommandOutput;
		if (!onCommandOutput) return;
		const commandOutput = buildCommandOutputFromToolResultEvent({
			stream: "tool",
			data: {
				...payload,
				commandBearing
			}
		});
		if (commandOutput) await onCommandOutput(commandOutput);
	};
	const bridgeCliPreambleProgress = Boolean(turn.opts?.onItemEvent) && shouldBridgeCliPreambleEvents(turn.opts);
	const bridgeCliDurableCommentary = Boolean(params.presentation.blockReplyHandler) && (turn.blockStreamingEnabled || turn.opts?.commentaryPayloadsEnabled === true);
	const toolAuthorityRoute = {
		provider: params.provider,
		model: params.model
	};
	const toolAuthorityFingerprint = turn.replyOperation?.bindToolAuthorityRoute(toolAuthorityRoute);
	const result = await params.timing.measure("cli_run", () => withLocalSessionPlacementTurnSettlement({
		sessionId: turn.followupRun.run.sessionId,
		sessionKey,
		agentId: turn.followupRun.run.agentId,
		runId: params.runId
	}, async (assertSettlementCurrent) => {
		const sessionEntry = sessionTarget ? loadSessionEntry({
			...sessionTarget,
			readConsistency: "latest"
		}) : turn.getActiveSessionEntry();
		if (sessionTarget && (sessionEntry?.sessionId !== sessionTarget.sessionId || sessionEntry.lifecycleRevision !== expectedLifecycleRevision)) throw createAgentRunSupersededAbortError();
		const cliSessionBinding = getCliSessionBinding(sessionEntry, params.cliExecutionProvider);
		const authProfileId = allowCliAuthProfileForwarding ? resolveCliExecutionAuthProfileId({
			cliExecutionProvider: params.cliExecutionProvider,
			authProfileProvider: params.provider,
			config: params.runtimeConfig,
			agentDir: params.candidateRun.agentDir,
			selected: params.candidateRun,
			sessionBinding: cliSessionBinding
		}) : resolveRunAuthProfile(params.candidateRun, params.cliExecutionProvider, { config: params.runtimeConfig }).authProfileId;
		const diagnosticOwner = params.deferredLifecycle.handoffToCli();
		const mediaTaskIdsBefore = getGeneratedMediaTaskIdsForSessionKey(turn.sessionKey);
		let droppedCliSessionReplacement = false;
		const candidateResult = await runCliAgentWithLifecycle({
			runId: params.runId,
			lifecycleGeneration: params.lifecycleGeneration,
			provider: params.cliExecutionProvider,
			startedAt: cliLifecycleStartedAt,
			emitLifecycleTerminal: false,
			onAgentRunStart: params.notifyAgentRunStart,
			suppressAssistantBridge: turn.followupRun.run.silentExpected,
			onActivity: () => turn.replyOperation?.recordActivity(),
			onErrorBeforeLifecycle: params.cliExecutionProvider === "claude-cli" && cliSessionBinding?.sessionId ? async (error) => {
				if (!shouldClearFailedCliSessionBinding({
					error,
					binding: cliSessionBinding,
					hasNewGeneratedMediaTask: hasNewGeneratedMediaTaskForSessionKey(turn.sessionKey, mediaTaskIdsBefore)
				})) return;
				await clearCliSessionInStore({
					agentId: turn.followupRun.run.agentId,
					provider: params.cliExecutionProvider,
					expectedCliSessionId: cliSessionBinding.sessionId,
					expectedSessionId: sessionEntry?.sessionId,
					assertCommitAllowed: assertSettlementCurrent,
					sessionKey: turn.sessionKey,
					sessionStore: turn.activeSessionStore,
					storePath: turn.storePath,
					activeSessionEntry: sessionEntry
				});
			} : void 0,
			preserveProgressCallbackStartOrder: params.preserveProgressCallbackStartOrder,
			onAssistantText: async (text) => {
				const classified = params.presentation.classifyStreamingPartial({ text });
				if (classified.skip || !classified.text) return;
				const textForTyping = classified.text;
				const sanitized = params.presentation.sanitizeStreamingText(textForTyping, false);
				const onPartialReply = turn.opts?.onPartialReply;
				return await params.presentation.presentWithTyping(turn.typingSignals.signalTextDelta(textForTyping), () => sanitized.skip || !sanitized.text || !onPartialReply ? false : onPartialReply({ text: sanitized.text }));
			},
			onCompletedReply: async (text, assistantMessageIndex) => {
				params.runAbortSignal?.throwIfAborted();
				assertSettlementCurrent();
				const reply = prepareCliReplyPayload(text, cliCurrentMessageId, assistantMessageIndex);
				await params.presentation.blockReplyHandler?.(reply, { completed: true });
			},
			onReasoningText: createCliReasoningStreamBridge(turn.opts?.onReasoningStream),
			onPlanUpdate: turn.opts?.onPlanUpdate,
			onReasoningProgress: async (payload) => {
				await turn.opts?.onReasoningProgress?.(payload);
			},
			onCompactionStart: turn.opts?.onCompactionStart,
			onCompactionEnd: turn.opts?.onCompactionEnd,
			onToolEvent: async (payload) => {
				if (!params.preserveProgressCallbackStartOrder) {
					const commandBearing = await cliToolSummaryTracker.noteToolEvent(payload);
					if (payload.phase === "result") {
						await deliverCliCommandOutcome(payload, commandBearing);
						return;
					}
					const { name, phase, args, toolCallId } = payload;
					await Promise.all([turn.typingSignals.signalToolStart(), turn.opts?.onToolStart?.({
						...toolCallId ? { toolCallId } : {},
						name,
						phase,
						args,
						detailMode: turn.toolProgressDetail
					})]);
					return;
				}
				const summaryPromise = cliToolSummaryTracker.noteToolEvent(payload);
				if (payload.phase === "result") {
					const commandBearing = await summaryPromise;
					await deliverCliCommandOutcome(payload, commandBearing);
					return;
				}
				const { name, phase, args, toolCallId } = payload;
				await Promise.all([summaryPromise, params.presentation.presentWithTyping(turn.typingSignals.signalToolStart(), async () => {
					await turn.opts?.onToolStart?.({
						...toolCallId ? { toolCallId } : {},
						name,
						phase,
						args,
						detailMode: turn.toolProgressDetail
					});
				})]);
			},
			onItemEvent: turn.opts?.onItemEvent,
			onCommentaryText: bridgeCliPreambleProgress || bridgeCliDurableCommentary ? async (payload) => {
				const deliveries = [];
				if (bridgeCliPreambleProgress) deliveries.push(turn.opts?.onItemEvent?.({
					itemId: payload.itemId,
					kind: "preamble",
					progressText: payload.text,
					...bridgeCliDurableCommentary ? { suppressDurableProgress: true } : {}
				}));
				if (bridgeCliDurableCommentary) {
					const reply = prepareCliReplyPayload(payload.text, cliCurrentMessageId);
					if (!turn.blockStreamingEnabled) reply.isCommentary = true;
					deliveries.push(params.presentation.blockReplyHandler?.(reply));
				}
				await Promise.all(deliveries);
			} : void 0,
			onFastModeAutoProgress: async (payload) => {
				await turn.opts?.onToolResult?.(payload);
			},
			transformResult: turn.followupRun.currentInboundEventKind === "room_event" ? (resultLocal) => keepCliSessionBindingOnlyWhenReused({
				result: resultLocal,
				existingSessionId: cliSessionBinding?.sessionId,
				onDroppedReplacement: () => {
					droppedCliSessionReplacement = true;
				}
			}) : void 0,
			runParams: {
				preparedRunAdmission: params.preparedRunAdmission,
				messageActionTurnCapability: params.messageActionTurnCapability,
				diagnosticOwner,
				sessionId: turn.followupRun.run.sessionId,
				sessionKey,
				sessionTarget,
				sessionEntry,
				chatType: normalizeChatType(turn.followupRun.originatingChatType) ?? normalizeChatType(turn.sessionCtx.ChatType) ?? params.candidateRun.chatType,
				runtimePolicySessionKey: turn.followupRun.run.runtimePolicySessionKey ?? turn.runtimePolicySessionKey,
				agentId: turn.followupRun.run.agentId,
				trigger: turn.isHeartbeat ? "heartbeat" : "user",
				sessionFile: turn.followupRun.run.sessionFile,
				workspaceDir: turn.followupRun.run.workspaceDir,
				cwd: turn.followupRun.run.cwd,
				config: params.runtimeConfig,
				toolOverrides: turn.followupRun.run.toolOverrides,
				prompt: turn.commandBody,
				transcriptPrompt: turn.transcriptCommandBody,
				media: turn.followupRun.media,
				suppressNextUserMessagePersistence: params.suppressQueuedUserPersistenceForCandidate,
				userTurnTranscriptRecorder: params.userTurnTranscriptRecorder,
				contextEngineLogicalTurnLease: params.contextEngineLogicalTurnLease,
				onContextEngineTurnCandidate: params.onContextEngineTurnCandidate,
				onUserMessagePersisted: params.notifyUserMessagePersisted,
				prepareAssistantTranscriptMessage: turn.opts?.prepareAssistantTranscriptMessage,
				persistAssistantTranscript: turn.followupRun.currentInboundEventKind !== "room_event" && turn.followupRun.run.suppressTranscriptOnlyAssistantPersistence !== true,
				storePath: turn.storePath,
				currentInboundEventKind: turn.followupRun.currentInboundEventKind,
				currentInboundContext: turn.followupRun.currentInboundContext,
				inputProvenance: turn.followupRun.run.inputProvenance,
				...buildCliMcpDelegationCapabilityBinding(resolveDelegationCapability({
					fallbackActive: params.isFallbackRetry,
					inputProvenance: turn.followupRun.run.inputProvenance,
					disableTools: turn.opts?.disableTools,
					toolsAllow: turn.opts?.toolsAllow
				})),
				modelProvider: params.provider,
				requesterModel: {
					provider: params.provider,
					model: params.model
				},
				modelHasVision,
				modelContextWindow: selectedModelEntry?.contextWindow,
				modelContextTokens: selectedModelEntry?.contextTokens,
				contextWindow: sessionEntry?.contextWindow,
				provider: params.cliExecutionProvider,
				execOverrides: turn.followupRun.run.execOverrides,
				bashElevated: turn.followupRun.run.bashElevated,
				model: params.model,
				thinkLevel: params.candidateThinkLevel,
				fastMode: params.candidateFastMode.fastMode,
				fastModeStartedAtMs: params.fastModeStartedAtMs,
				fastModeAutoOnSeconds: params.candidateFastMode.fastModeAutoOnSeconds,
				fastModeAutoProgressState: params.fastModeAutoProgressState,
				isFinalFallbackAttempt: params.isFinalFallbackAttempt,
				timeoutMs: turn.followupRun.run.timeoutMs,
				runTimeoutOverrideMs: turn.followupRun.run.runTimeoutOverrideMs,
				runId: params.runId,
				lane: params.runLane,
				extraSystemPrompt: turn.followupRun.run.extraSystemPrompt,
				sourceReplyDeliveryMode: turn.followupRun.run.sourceReplyDeliveryMode,
				taskSuggestionDeliveryMode: turn.followupRun.run.taskSuggestionDeliveryMode,
				...turn.isHeartbeat ? { requireExplicitMessageTarget: true } : {},
				cleanupBundleMcpOnRunEnd: turn.opts?.cleanupBundleMcpOnRunEnd,
				silentReplyPromptMode: turn.followupRun.run.silentReplyPromptMode,
				terminalReplyExpectation: turn.followupRun.run.terminalReplyExpectation,
				extraSystemPromptStatic: turn.followupRun.run.extraSystemPromptStatic,
				cliSessionBindingFacts: turn.followupRun.run.cliSessionBindingFacts,
				ownerNumbers: turn.followupRun.run.ownerNumbers,
				cliSessionId: cliSessionBinding?.sessionId,
				cliSessionBinding,
				authProfileId,
				bootstrapContextMode: turn.opts?.bootstrapContextMode,
				bootstrapContextRunKind: params.bootstrapContextRunKind,
				bootstrapPromptWarningSignaturesSeen: params.bootstrapPromptWarningSignaturesSeen,
				bootstrapPromptWarningSignature: params.bootstrapPromptWarningSignaturesSeen[params.bootstrapPromptWarningSignaturesSeen.length - 1],
				images: params.currentTurnImages.images,
				imageOrder: params.currentTurnImages.imageOrder,
				mediaImageLayout: params.currentTurnImages.mediaImageLayout,
				skillsSnapshot: turn.followupRun.run.skillsSnapshot,
				messageChannel: turn.followupRun.originatingChannel ?? void 0,
				messageProvider: hookMessageProvider,
				clientCaps: turn.followupRun.run.clientCaps,
				bootstrapUserProfileId: turn.followupRun.run.bootstrapUserProfileId,
				gatewayUiCommandTarget: turn.followupRun.run.gatewayUiCommandTarget,
				currentChannelId: turn.followupRun.originatingTo ?? turn.sessionCtx.OriginatingTo ?? turn.sessionCtx.To,
				senderId: turn.followupRun.run.senderId,
				senderName: turn.followupRun.run.senderName,
				senderUsername: turn.followupRun.run.senderUsername,
				senderE164: turn.followupRun.run.senderE164,
				groupId: turn.followupRun.run.groupId,
				groupChannel: turn.followupRun.run.groupChannel,
				groupSpace: turn.followupRun.run.groupSpace,
				spawnedBy: turn.followupRun.run.spawnedBy,
				chatId: turn.followupRun.originatingChatId,
				channelContext: turn.followupRun.run.channelContext,
				currentThreadTs: cliCurrentThreadId != null ? String(cliCurrentThreadId) : void 0,
				currentMessageId: cliCurrentMessageId,
				replyToMode: turn.followupRun.originatingReplyToMode ?? turn.sessionCtx.ReplyToMode,
				currentInboundAudio: hasInboundAudio(turn.sessionCtx),
				agentAccountId: turn.followupRun.run.agentAccountId,
				senderIsOwner: turn.followupRun.run.senderIsOwner,
				approvalReviewerDeviceId: turn.followupRun.run.approvalReviewerDeviceId,
				toolsAllow: turn.opts?.toolsAllow,
				skillWorkshopProposalRevision: params.candidateRun.skillWorkshopProposalRevision,
				skillLibraryAuthoring: params.candidateRun.skillLibraryAuthoring,
				disableTools: turn.opts?.disableTools,
				toolAuthorityFingerprint,
				abortSignal: params.runAbortSignal,
				onBlockReply: onNativeBlockReply,
				onPartialReply: turn.opts?.onPartialReply,
				onExecutionPhase: params.signalExecutionPhaseForTyping,
				replyOperation: turn.replyOperation
			}
		});
		if (droppedCliSessionReplacement) return await settleCliSessionResult(candidateResult, async () => {
			await clearCliSessionInStore({
				agentId: turn.followupRun.run.agentId,
				provider: params.cliExecutionProvider,
				expectedCliSessionId: cliSessionBinding?.sessionId,
				expectedSessionId: sessionEntry?.sessionId,
				assertCommitAllowed: assertSettlementCurrent,
				sessionKey: turn.sessionKey,
				sessionStore: turn.activeSessionStore,
				storePath: turn.storePath,
				activeSessionEntry: sessionEntry
			});
			params.classifyResult(candidateResult);
		});
		if ((!params.classifyResult(candidateResult) || candidateResult.meta.agentMeta?.clearCliSessionBinding === true) && !shouldPreserveUserFacingSessionStateForInputProvenance(turn.followupRun.run.inputProvenance)) return await persistCliSessionBindingResult({
			agentId: turn.followupRun.run.agentId,
			provider: params.cliExecutionProvider,
			result: candidateResult,
			sessionKey,
			storePath: turn.storePath,
			sessionStore: turn.activeSessionStore,
			expectedSession: sessionEntry,
			assertSettlementCurrent,
			abortSignal: params.runAbortSignal
		});
		return candidateResult;
	}, {
		preparedRunAdmission: params.preparedRunAdmission,
		lifecycleGeneration: params.lifecycleGeneration,
		isFinalFallbackAttempt: params.isFinalFallbackAttempt,
		abortSignal: params.runAbortSignal,
		trigger: turn.isHeartbeat ? "heartbeat" : "user",
		inputProvenance: turn.followupRun.run.inputProvenance
	}));
	return {
		result,
		bootstrapPromptWarningSignaturesSeen: resolveBootstrapWarningSignaturesSeen(result.meta?.systemPromptReport)
	};
}
//#endregion
//#region src/auto-reply/reply/compaction-notice.ts
const COMPACTION_NOTICE_TEXT = {
	start: "🧹 Compacting context...",
	end: "🧹 Compaction complete",
	incomplete: "🧹 Compaction incomplete",
	skipped: "🧹 Compaction not needed",
	memory_flush_degraded: "⚠️ Memory maintenance temporarily failed; continuing your reply."
};
function formatCompactionModelRef(provider, model) {
	const normalizedProvider = normalizeOptionalString(provider);
	const normalizedModel = normalizeOptionalString(model);
	if (normalizedProvider && normalizedModel) return `${sanitizeForLog(normalizedProvider)}/${sanitizeForLog(normalizedModel)}`;
	if (normalizedProvider) return sanitizeForLog(normalizedProvider);
	if (normalizedModel) return sanitizeForLog(normalizedModel);
	return "unknown model";
}
function shouldNotifyUserAboutCompaction(cfg) {
	return cfg?.agents?.defaults?.compaction?.notifyUser === true;
}
function createCompactionNoticePayload(params) {
	const payload = {
		text: params.text ?? COMPACTION_NOTICE_TEXT[params.phase],
		...params.currentMessageId ? { replyToId: params.currentMessageId } : {},
		replyToCurrent: true,
		isCompactionNotice: true
	};
	return params.applyReplyToMode ? params.applyReplyToMode(payload) : payload;
}
function readCompactionHookMessages(value) {
	if (!Array.isArray(value)) return [];
	return value.filter((entry) => typeof entry === "string").map((entry) => entry.trim()).filter((entry) => entry.length > 0);
}
function createCompactionHookNoticePayload(params) {
	if (params.messages.length === 0) return;
	const payload = {
		text: params.messages.join("\n\n"),
		...params.currentMessageId ? { replyToId: params.currentMessageId } : {},
		replyToCurrent: true,
		isCompactionNotice: true
	};
	return params.applyReplyToMode ? params.applyReplyToMode(payload) : payload;
}
//#endregion
//#region src/auto-reply/reply/agent-runner-event-handler.ts
const agentCompactionLog = createSubsystemLogger("auto-reply/compaction");
const CODEX_APP_SERVER_COMPACTION_BACKEND = "codex-app-server";
function readApprovalScopeValue(value) {
	return value === "turn" || value === "session" ? value : void 0;
}
/** Bridges embedded-agent events into channel progress and compaction notices. */
function createAgentRunEventHandler(params) {
	const shouldSuppressProgressAfterMessageToolDelivery = () => params.sourceRepliesAreToolOnly && params.messageToolDeliveryState.completed && params.turn.opts?.allowProgressCallbacksWhenSourceDeliverySuppressed !== true;
	const currentMessageId = params.turn.sessionCtx.MessageSidFull ?? params.turn.sessionCtx.MessageSid;
	const deliverCompactionNoticePayload = async (noticePayload, label) => {
		const deliver = params.turn.opts?.onBlockReply ?? params.turn.onCompactionNoticePayload;
		if (!deliver) return;
		try {
			await deliver(noticePayload);
		} catch (err) {
			logVerbose(`compaction ${label} notice delivery failed (non-fatal): ${String(err)}`);
		}
	};
	const sendCompactionNotice = async (phase) => {
		await deliverCompactionNoticePayload(createCompactionNoticePayload({
			phase,
			currentMessageId,
			applyReplyToMode: params.turn.applyReplyToMode
		}), phase);
	};
	const sendCompactionHookMessages = async (messages) => {
		const noticePayload = createCompactionHookNoticePayload({
			messages,
			currentMessageId,
			applyReplyToMode: params.turn.applyReplyToMode
		});
		if (noticePayload) await deliverCompactionNoticePayload(noticePayload, "hook");
	};
	return async (evt) => {
		params.turn.replyOperation?.recordActivity();
		params.lifecycleBackstop.note(evt);
		const hasLifecyclePhase = evt.stream === "lifecycle" && typeof evt.data.phase === "string";
		if (evt.stream !== "lifecycle" || hasLifecyclePhase) params.notifyAgentRunStart();
		if (evt.stream === "tool" && evt.data.hideFromChannelProgress !== true) {
			const phase = readStringValue(evt.data.phase) ?? "";
			const name = readStringValue(evt.data.name);
			const toolCallId = readStringValue(evt.data.toolCallId) ?? "";
			const args = evt.data.args && typeof evt.data.args === "object" ? evt.data.args : void 0;
			if (params.sourceRepliesAreToolOnly && toolCallId && name && (phase === "start" || phase === "update") && args && isMessagingToolSendAction(name, args)) params.messageToolDeliveryState.toolCallIds.add(toolCallId);
			if (shouldSuppressProgressAfterMessageToolDelivery()) return;
			if (phase === "start" || phase === "update") {
				const toolStartProgressPromise = params.turn.opts?.onToolStart?.({
					itemId: readStringValue(evt.data.itemId),
					toolCallId: readStringValue(evt.data.toolCallId),
					name,
					phase,
					args,
					detailMode: params.turn.toolProgressDetail
				});
				await Promise.all([params.turn.typingSignals.signalToolStart(), toolStartProgressPromise]);
			}
			const commandOutput = buildCommandOutputFromToolResultEvent(evt);
			if (commandOutput) await params.turn.opts?.onCommandOutput?.(commandOutput);
		}
		const itemPhase = evt.stream === "item" ? readStringValue(evt.data.phase) : "";
		const itemName = evt.stream === "item" ? readStringValue(evt.data.name) : "";
		const itemStatus = evt.stream === "item" ? readStringValue(evt.data.status) : "";
		const itemToolCallId = evt.stream === "item" ? readStringValue(evt.data.toolCallId) ?? "" : "";
		const completedMessageToolDelivery = params.sourceRepliesAreToolOnly && itemPhase === "end" && itemStatus === "completed" && itemToolCallId.length > 0 && params.messageToolDeliveryState.toolCallIds.has(itemToolCallId);
		const suppressProgressAfterMessageToolDelivery = shouldSuppressProgressAfterMessageToolDelivery();
		if (completedMessageToolDelivery) {
			params.messageToolDeliveryState.toolCallIds.delete(itemToolCallId);
			params.messageToolDeliveryState.completed = true;
		}
		if (evt.stream === "item" && (!suppressProgressAfterMessageToolDelivery || completedMessageToolDelivery)) {
			const itemSummary = readStringValue(evt.data.summary);
			const itemProgressText = readStringValue(evt.data.progressText);
			const itemMeta = readStringValue(evt.data.meta);
			const itemCommandBearing = typeof evt.data.commandBearing === "boolean" ? evt.data.commandBearing : void 0;
			const itemApprovalId = readStringValue(evt.data.approvalId);
			const itemApprovalSlug = readStringValue(evt.data.approvalSlug);
			await params.turn.opts?.onItemEvent?.({
				itemId: readStringValue(evt.data.itemId),
				kind: readStringValue(evt.data.kind),
				title: readStringValue(evt.data.title),
				phase: itemPhase,
				status: itemStatus,
				...evt.data.hideFromChannelProgress === true ? { hideFromChannelProgress: true } : {},
				...evt.data.suppressChannelProgress === true ? { suppressChannelProgress: true } : {},
				...itemToolCallId ? { toolCallId: itemToolCallId } : {},
				...itemName ? { name: itemName } : {},
				...itemSummary !== void 0 ? { summary: itemSummary } : {},
				...itemProgressText !== void 0 ? { progressText: itemProgressText } : {},
				...itemMeta !== void 0 ? { meta: itemMeta } : {},
				...itemCommandBearing !== void 0 ? { commandBearing: itemCommandBearing } : {},
				...itemApprovalId !== void 0 ? { approvalId: itemApprovalId } : {},
				...itemApprovalSlug !== void 0 ? { approvalSlug: itemApprovalSlug } : {}
			});
		}
		if (evt.stream === "plan" && !shouldSuppressProgressAfterMessageToolDelivery()) await params.turn.opts?.onPlanUpdate?.({
			phase: readStringValue(evt.data.phase),
			title: readStringValue(evt.data.title),
			explanation: readStringValue(evt.data.explanation),
			...evt.data.explanationFormat === "plain" ? { explanationFormat: "plain" } : {},
			steps: normalizeAgentPlanSteps(evt.data.steps),
			source: readStringValue(evt.data.source)
		});
		if (evt.stream === "approval" && !shouldSuppressProgressAfterMessageToolDelivery()) await params.turn.opts?.onApprovalEvent?.({
			phase: readStringValue(evt.data.phase),
			kind: readStringValue(evt.data.kind),
			status: readStringValue(evt.data.status),
			title: readStringValue(evt.data.title),
			itemId: readStringValue(evt.data.itemId),
			toolCallId: readStringValue(evt.data.toolCallId),
			approvalId: readStringValue(evt.data.approvalId),
			approvalSlug: readStringValue(evt.data.approvalSlug),
			command: readStringValue(evt.data.command),
			host: readStringValue(evt.data.host),
			reason: readStringValue(evt.data.reason),
			scope: readApprovalScopeValue(evt.data.scope),
			message: readStringValue(evt.data.message)
		});
		if (evt.stream === "command_output" && !shouldSuppressProgressAfterMessageToolDelivery()) await params.turn.opts?.onCommandOutput?.({
			itemId: readStringValue(evt.data.itemId),
			phase: readStringValue(evt.data.phase),
			title: readStringValue(evt.data.title),
			toolCallId: readStringValue(evt.data.toolCallId),
			name: readStringValue(evt.data.name),
			output: readStringValue(evt.data.output),
			status: readStringValue(evt.data.status),
			exitCode: typeof evt.data.exitCode === "number" || evt.data.exitCode === null ? evt.data.exitCode : void 0,
			durationMs: typeof evt.data.durationMs === "number" ? evt.data.durationMs : void 0,
			cwd: readStringValue(evt.data.cwd)
		});
		if (evt.stream === "patch" && !shouldSuppressProgressAfterMessageToolDelivery()) await params.turn.opts?.onPatchSummary?.({
			itemId: readStringValue(evt.data.itemId),
			phase: readStringValue(evt.data.phase),
			title: readStringValue(evt.data.title),
			toolCallId: readStringValue(evt.data.toolCallId),
			name: readStringValue(evt.data.name),
			added: Array.isArray(evt.data.added) ? evt.data.added.filter((entry) => typeof entry === "string") : void 0,
			modified: Array.isArray(evt.data.modified) ? evt.data.modified.filter((entry) => typeof entry === "string") : void 0,
			deleted: Array.isArray(evt.data.deleted) ? evt.data.deleted.filter((entry) => typeof entry === "string") : void 0,
			summary: readStringValue(evt.data.summary)
		});
		if (evt.stream !== "compaction") return;
		const phase = readStringValue(evt.data.phase) ?? "";
		const backend = readStringValue(evt.data.backend);
		const hookMessages = readCompactionHookMessages(evt.data.messages);
		const sendCompactionUserNotices = async (noticePhase) => {
			if (hookMessages.length > 0) await sendCompactionHookMessages(hookMessages);
			if (params.notifyUserAboutCompaction) await sendCompactionNotice(noticePhase);
		};
		if (phase === "start") {
			await params.turn.opts?.onCompactionStart?.();
			await sendCompactionUserNotices("start");
			return;
		}
		if (phase !== "end") return;
		if (evt.data.completed !== true) {
			await params.turn.opts?.onCompactionEnd?.({ completed: false });
			await sendCompactionUserNotices("incomplete");
			return;
		}
		const compactionCount = params.onCompactionCompleted();
		if (backend === CODEX_APP_SERVER_COMPACTION_BACKEND) {
			const consoleMessage = `codex app-server auto-compaction succeeded for ${formatCompactionModelRef(params.provider, params.model)}; refreshed session context`;
			agentCompactionLog.info("codex app-server auto-compaction succeeded", {
				event: "codex_app_server_compaction_succeeded",
				backend,
				provider: params.provider,
				model: params.model,
				sessionKey: params.turn.sessionKey,
				sessionId: params.effectiveSessionId,
				threadId: readStringValue(evt.data.threadId),
				turnId: readStringValue(evt.data.turnId),
				itemId: readStringValue(evt.data.itemId),
				compactionCount,
				consoleMessage
			});
		}
		await params.turn.opts?.onCompactionEnd?.({ completed: true });
		await sendCompactionUserNotices("end");
	};
}
//#endregion
//#region src/auto-reply/reply/agent-runner-embedded-candidate.ts
async function runEmbeddedFallbackCandidate(params) {
	const turn = params.turn;
	let maintenanceAuthProfile;
	let compactionRequestBudget;
	const sourceReplyDeliveryRuntime = readSourceReplyDeliveryRuntime(params.candidateRun);
	const candidateRun = {
		...params.candidateRun,
		...params.candidateFastMode,
		thinkLevel: params.candidateThinkLevel
	};
	const { embeddedContext, senderContext, runBaseParams } = await buildEmbeddedRunExecutionParams({
		run: candidateRun,
		replyRoute: turn.followupRun,
		sessionCtx: turn.sessionCtx,
		hasRepliedRef: turn.opts?.hasRepliedRef,
		provider: params.provider,
		runId: params.runId,
		promptCacheKey: turn.opts?.promptCacheKey,
		allowTransientCooldownProbe: params.allowTransientCooldownProbe,
		model: params.model
	});
	if (sourceReplyDeliveryRuntime) bindSourceReplyDeliveryRuntime(runBaseParams, sourceReplyDeliveryRuntime);
	const agentHarnessPolicy = params.sessionRuntimeOverride ? {
		runtime: params.sessionRuntimeOverride,
		runtimeSource: "model"
	} : resolveAgentHarnessPolicy({
		provider: params.provider,
		modelId: params.model,
		config: params.runtimeConfig,
		agentId: turn.followupRun.run.agentId,
		sessionKey: turn.followupRun.run.runtimePolicySessionKey ?? turn.sessionKey
	});
	const embeddedRunProvider = resolveOpenAIRuntimeProvider({
		provider: params.provider,
		harnessRuntime: agentHarnessPolicy.runtime,
		authProfileProvider: runBaseParams.authProfileId?.split(":", 1)[0],
		authProfileId: runBaseParams.authProfileId,
		config: params.runtimeConfig,
		workspaceDir: turn.followupRun.run.workspaceDir
	});
	const embeddedRunHarnessOverride = params.sessionRuntimeOverride ?? (agentHarnessPolicy.runtime === "openclaw" && embeddedRunProvider !== params.provider ? "openclaw" : void 0);
	let attemptCompactionCount = 0;
	let postCompactionModelAttempted = false;
	let compactionAccounting;
	const lifecycleBackstop = createAgentLifecycleTerminalBackstop({
		runId: params.runId,
		sessionKey: turn.sessionKey,
		getLifecycleGeneration: params.getLifecycleGeneration,
		resolveTerminationFields: (error) => resolveReplyOperationTerminationFields(error, params.runAbortSignal, turn.replyOperation)
	});
	params.onLifecycleBackstop(lifecycleBackstop);
	try {
		params.timing.logMilestoneIfSlow({
			runId: params.runId,
			sessionId: turn.followupRun.run.sessionId,
			sessionKey: turn.sessionKey,
			milestone: "before_embedded_run"
		});
		let eventHandler;
		const result = await params.timing.measure("embedded_run", () => {
			const embeddedRunParams = {
				preparedRunAdmission: params.preparedRunAdmission,
				...embeddedContext,
				messageActionTurnCapability: params.messageActionTurnCapability,
				lifecycleGeneration: params.getLifecycleGeneration(),
				allowGatewaySubagentBinding: true,
				trigger: turn.isHeartbeat ? "heartbeat" : "user",
				cronCreatorAuthorityCapability: turn.opts?.cronCreatorAuthorityCapability,
				cronCreatorAuthorityUnavailableReason: turn.opts?.turnAdoptionLifecycle?.cronCreatorAuthorityUnavailable,
				groupId: resolveGroupSessionKey(turn.sessionCtx)?.id,
				groupChannel: normalizeOptionalString(turn.sessionCtx.GroupChannel) ?? normalizeOptionalString(turn.sessionCtx.GroupSubject),
				groupSpace: normalizeOptionalString(turn.sessionCtx.GroupSpace),
				...senderContext,
				...runBaseParams,
				contextWindow: turn.getActiveSessionEntry()?.contextWindow,
				lane: params.runLane,
				provider: embeddedRunProvider,
				agentHarnessId: resolveSessionPinnedHarnessId(turn.getActiveSessionEntry()),
				agentHarnessRuntimeOverride: embeddedRunHarnessOverride,
				agentHarnessRuntimePreparationHint: agentHarnessPolicy.runtimeSource !== "implicit" ? agentHarnessPolicy.runtime : void 0,
				fastModeStartedAtMs: params.fastModeStartedAtMs,
				fastModeAutoProgressState: params.fastModeAutoProgressState,
				isFinalFallbackAttempt: params.isFinalFallbackAttempt,
				sandboxSessionKey: turn.runtimePolicySessionKey,
				prompt: turn.commandBody,
				transcriptPrompt: turn.transcriptCommandBody,
				media: turn.followupRun.media,
				userTurnTranscriptRecorder: params.userTurnTranscriptRecorder,
				contextEngineLogicalTurnLease: params.contextEngineLogicalTurnLease,
				onContextEngineTurnCandidate: params.onContextEngineTurnCandidate,
				currentInboundEventKind: turn.followupRun.currentInboundEventKind,
				currentInboundContext: turn.followupRun.currentInboundContext,
				explicitSkillSelections: turn.followupRun.explicitSkillSelections,
				extraSystemPrompt: turn.followupRun.run.extraSystemPrompt,
				sourceReplyDeliveryMode: turn.followupRun.run.sourceReplyDeliveryMode,
				forceMessageTool: turn.followupRun.run.sourceReplyDeliveryMode === "message_tool_only",
				...turn.isHeartbeat ? { requireExplicitMessageTarget: true } : {},
				cleanupBundleMcpOnRunEnd: turn.opts?.cleanupBundleMcpOnRunEnd,
				silentReplyPromptMode: turn.followupRun.run.silentReplyPromptMode,
				suppressNextUserMessagePersistence: params.suppressQueuedUserPersistenceForCandidate,
				onUserMessagePersisted: params.notifyUserMessagePersisted,
				suppressTranscriptOnlyAssistantPersistence: turn.followupRun.run.suppressTranscriptOnlyAssistantPersistence,
				assistantErrorTranscript: params.assistantErrorTranscript,
				authProfileFailurePolicy: params.authProfileFailurePolicy,
				prepareAssistantTranscriptMessage: turn.opts?.prepareAssistantTranscriptMessage,
				onAutoCompactionSucceeded: (count) => {
					attemptCompactionCount = Math.max(attemptCompactionCount, count);
				},
				toolResultFormat: (() => {
					const channel = resolveMessageChannel(turn.sessionCtx.Surface, turn.sessionCtx.Provider);
					return !channel || isMarkdownCapableMessageChannel(channel) ? "markdown" : "plain";
				})(),
				toolProgressDetail: turn.toolProgressDetail,
				toolsAllow: turn.opts?.toolsAllow,
				disableTools: turn.opts?.disableTools,
				toolAuthorityFingerprint: turn.replyOperation?.toolAuthorityFingerprint,
				enableHeartbeatTool: turn.opts?.enableHeartbeatTool,
				forceHeartbeatTool: turn.opts?.forceHeartbeatTool,
				bootstrapContextMode: turn.opts?.bootstrapContextMode,
				bootstrapContextRunKind: params.bootstrapContextRunKind,
				images: params.currentTurnImages.images,
				imageOrder: params.currentTurnImages.imageOrder,
				abortSignal: params.runAbortSignal,
				replyOperation: turn.replyOperation,
				deferTerminalLifecycle: true,
				onAttemptStart: lifecycleBackstop.beginAttempt,
				onCompactionAccounting: (fact) => {
					compactionAccounting = fact;
				},
				onCompactionRequestBudget: (budget) => {
					compactionRequestBudget = budget;
				},
				onDeferredLifecycleOwner: params.deferredLifecycle.adopt,
				onDeferredLifecycleAbort: params.deferredLifecycle.abort,
				onRetryWait: params.deferredLifecycle.beginRetryWait,
				onExecutionStarted: (info) => {
					if (info?.lifecycleGeneration) params.onLifecycleGeneration(info.lifecycleGeneration);
				},
				onExecutionPhase: (info) => {
					if (info.phase === "model_call_started" && attemptCompactionCount > 0) postCompactionModelAttempted = true;
					params.signalExecutionPhaseForTyping(info);
				},
				onLaneWait: ({ waiting }) => {
					const replyOperation = turn.replyOperation;
					if (waiting && replyOperation) markReplyOperationGlobalLaneWaitProgress(replyOperation);
				},
				blockReplyBreak: turn.resolvedBlockStreamingBreak,
				blockReplyChunking: turn.blockReplyChunking,
				onPartialReply: async (payload) => {
					const classified = params.presentation.classifyStreamingPartial(payload);
					if (classified.skip || !classified.text) return false;
					const textForTyping = classified.text;
					let didMaterialize = false;
					let materializedText;
					const partialPayload = {
						get text() {
							if (!didMaterialize) {
								const sanitized = params.presentation.sanitizeStreamingText(textForTyping, false);
								materializedText = sanitized.skip ? void 0 : sanitized.text;
								didMaterialize = true;
							}
							return materializedText;
						},
						mediaUrls: payload.mediaUrls
					};
					const onPartialReply = turn.opts?.onPartialReply;
					return await params.presentation.presentWithTyping(turn.typingSignals.signalTextDelta(textForTyping), () => onPartialReply ? onPartialReply(partialPayload) : false);
				},
				onAssistantMessageStart: async () => {
					await params.presentation.presentWithTyping(turn.typingSignals.signalMessageStart(), () => turn.opts?.onAssistantMessageStart?.());
				},
				onReasoningStream: turn.typingSignals.shouldStartOnReasoning || turn.opts?.onReasoningStream ? async (payload) => {
					if (turn.followupRun.run.silentExpected) return;
					await params.presentation.presentWithTyping(turn.typingSignals.signalReasoningDelta(), () => turn.opts?.onReasoningStream?.({
						text: payload.text,
						mediaUrls: payload.mediaUrls,
						isReasoningSnapshot: payload.isReasoningSnapshot,
						requiresReasoningProgressOptIn: payload.requiresReasoningProgressOptIn
					}));
				} : void 0,
				streamReasoningInNonStreamModes: turn.opts?.streamReasoningInNonStreamModes,
				onReasoningEnd: turn.opts?.onReasoningEnd ? async () => {
					await turn.opts?.onReasoningEnd?.();
				} : void 0,
				onAgentEvent: (event) => {
					eventHandler ??= createAgentRunEventHandler({
						turn,
						lifecycleBackstop,
						notifyAgentRunStart: params.notifyAgentRunStart,
						sourceRepliesAreToolOnly: (sourceReplyDeliveryRuntime?.currentMode ?? turn.followupRun.run.sourceReplyDeliveryMode) === "message_tool_only",
						messageToolDeliveryState: params.messageToolDeliveryState,
						provider: params.provider,
						model: params.model,
						runId: params.runId,
						effectiveSessionId: params.effectiveRun.sessionId,
						notifyUserAboutCompaction: params.notifyUserAboutCompaction,
						onCompactionCompleted: () => {
							attemptCompactionCount += 1;
							return attemptCompactionCount;
						}
					});
					return eventHandler(event);
				},
				onBlockReply: params.presentation.blockReplyHandler,
				resolveReplyDelivery: (minimumAssistantMessageIndex) => resolveTerminalReplyDelivery({
					blockReplyPipeline: turn.blockReplyPipeline,
					directBlockDeliveries: params.directBlockDeliveries,
					minimumAssistantMessageIndex,
					resolveReplyDelivery: turn.opts?.resolveReplyDelivery
				}),
				onBlockReplyFlush: turn.blockStreamingEnabled && turn.blockReplyPipeline ? async () => {
					await turn.blockReplyPipeline?.flush({ force: true });
				} : void 0,
				shouldEmitToolResult: turn.shouldEmitToolResult,
				shouldEmitToolOutput: turn.shouldEmitToolOutput,
				bootstrapPromptWarningSignaturesSeen: params.bootstrapPromptWarningSignaturesSeen,
				bootstrapPromptWarningSignature: params.bootstrapPromptWarningSignaturesSeen[params.bootstrapPromptWarningSignaturesSeen.length - 1],
				onToolResult: turn.opts?.onToolResult ? (() => {
					let toolResultChain = Promise.resolve();
					return (payload) => {
						const delivery = toolResultChain.then(async () => {
							turn.replyOperation?.recordActivity();
							const { text, skip } = params.presentation.normalizeStreamingText(payload);
							if (skip) return;
							if (text !== void 0) await turn.typingSignals.signalTextDelta(text);
							await turn.opts?.onToolResult?.({
								...payload,
								text
							});
						});
						toolResultChain = delivery.catch((err) => {
							logVerbose(`tool result delivery failed: ${String(err)}`);
						});
						const task = toolResultChain.finally(() => {
							turn.pendingToolTasks.delete(task);
						});
						turn.pendingToolTasks.add(task);
						return delivery;
					};
				})() : void 0
			};
			embeddedRunParams.onSuccessfulAuthProfile = (profileId) => {
				maintenanceAuthProfile = {
					authProfileId: profileId,
					authProfileIdSource: profileId ? profileId === runBaseParams.authProfileId ? runBaseParams.authProfileIdSource : "auto" : void 0
				};
			};
			return runEmbeddedAgent(embeddedRunParams);
		});
		const resultCompactionCount = Math.max(0, result.meta?.agentMeta?.compactionCount ?? 0);
		attemptCompactionCount = Math.max(attemptCompactionCount, resultCompactionCount);
		return {
			result,
			maintenanceAuthProfile,
			compactionRequestBudget,
			bootstrapPromptWarningSignaturesSeen: resolveBootstrapWarningSignaturesSeen(result.meta?.systemPromptReport)
		};
	} finally {
		const accounting = compactionAccounting ?? (attemptCompactionCount > 0 ? {
			kind: "presentation-only",
			count: attemptCompactionCount,
			currentContextSnapshot: { tokens: void 0 }
		} : void 0);
		params.onCompactionFacts({
			accounting,
			postCompactionModelAttempted
		});
	}
}
//#endregion
//#region src/auto-reply/reply/agent-runner-model-fallback-lifecycle.ts
function emitModelFallbackStepLifecycle(params) {
	emitAgentEvent({
		runId: params.runId,
		...params.sessionKey ? { sessionKey: params.sessionKey } : {},
		stream: "lifecycle",
		data: {
			phase: "fallback_step",
			...params.step
		}
	});
}
//#endregion
//#region src/auto-reply/reply/agent-runner-fallback-candidate.ts
/** Runs the provider/model fallback candidates while preserving cross-candidate delivery state. */
async function runAgentFallbackCandidates(params) {
	const turn = params.turn;
	const sourceReplyDeliveryRuntimeOptions = turn.opts;
	const sourceReplyDeliveryRuntime = readSourceReplyDeliveryRuntime(turn.followupRun.run) ?? createSourceReplyDeliveryRuntime({
		origin: sourceReplyDeliveryRuntimeOptions?.sourceReplyDeliveryModeOrigin ?? "stable_policy",
		initialMode: turn.followupRun.run.sourceReplyDeliveryMode ?? "automatic",
		projections: [turn.followupRun.run, ...turn.opts ? [turn.opts] : []],
		promptComponentByMode: {
			automatic: "",
			message_tool_only: ""
		},
		promptComponentOffset: void 0,
		onModeResolved: sourceReplyDeliveryRuntimeOptions?.onSourceReplyDeliveryModeResolved
	});
	sourceReplyDeliveryRuntime.track(turn.followupRun.run);
	if (turn.opts) sourceReplyDeliveryRuntime.track(turn.opts);
	bindSourceReplyDeliveryRuntime(turn.followupRun.run, sourceReplyDeliveryRuntime);
	const sourceReplyDeliveryModeOrigin = sourceReplyDeliveryRuntime.origin;
	const preserveProgressCallbackStartOrder = turn.opts?.preserveProgressCallbackStartOrder === true;
	const runLane = turn.isHeartbeat ? "cron-nested" : "main";
	let queuedUserMessagePersistedAcrossFallback = false;
	const messageToolDeliveryState = {
		toolCallIds: /* @__PURE__ */ new Set(),
		completed: false
	};
	const userTurnTranscriptRecorder = turn.followupRun.userTurnTranscriptRecorder ?? turn.opts?.userTurnTranscriptRecorder;
	const fastModeStartedAtMs = Date.now();
	const fastModeAutoProgressState = {
		offAnnounced: false,
		resetAnnounced: false
	};
	const bootstrapContextRunKind = turn.opts?.isHeartbeat ? "heartbeat" : "default";
	params.timing.logMilestoneIfSlow({
		runId: params.runId,
		sessionId: turn.followupRun.run.sessionId,
		sessionKey: turn.sessionKey,
		milestone: "before_model_fallback"
	});
	const selection = resolveModelFallbackOptions(params.effectiveRun, params.runtimeConfig);
	const resolveCandidateRuntime = (provider, model, sessionRuntimeOverride) => {
		const candidateRun = resolveFallbackCandidateRun(params.effectiveRun, provider, model);
		const activeEntry = params.liveModelSwitchRuntimeEntry ?? turn.getActiveSessionEntry();
		const pinnedHarnessId = resolveSessionPinnedHarnessId(activeEntry);
		const locksPersistedHarness = pinnedHarnessId !== void 0 && pinnedHarnessId === sessionRuntimeOverride;
		const selectedAuthProfile = resolveRunAuthProfile(candidateRun, provider, { config: params.runtimeConfig });
		const pinnedCliRuntime = !locksPersistedHarness && sessionRuntimeOverride && isCliProvider(sessionRuntimeOverride, params.runtimeConfig) ? sessionRuntimeOverride : void 0;
		const cliExecutionProvider = pinnedCliRuntime ?? (sessionRuntimeOverride ? provider : resolveCliRuntimeExecutionProvider({
			provider,
			cfg: params.runtimeConfig,
			agentId: turn.followupRun.run.agentId,
			modelId: model,
			authProfileId: selectedAuthProfile.authProfileId
		}) ?? provider);
		return {
			candidateRun,
			sessionRuntimeOverride,
			cliExecutionProvider,
			useCliExecution: pinnedCliRuntime !== void 0 || !sessionRuntimeOverride && isCliProvider(cliExecutionProvider, params.runtimeConfig)
		};
	};
	return params.timing.measure("model_fallback", () => runEmbeddedAgentEntry({
		preparedRunAdmission: params.preparedRunAdmission,
		selection: {
			cfg: selection.cfg,
			provider: selection.provider,
			model: selection.model,
			requestedRouteResolution: selection.requestedRouteResolution,
			agentDir: selection.agentDir,
			fallbacksOverride: selection.fallbacksOverride,
			userLockedAuthProfileId: turn.followupRun.run.authProfileIdSource === "user" ? turn.followupRun.run.authProfileId : void 0
		},
		identity: {
			runId: params.runId,
			agentId: turn.followupRun.run.agentId,
			sessionId: turn.followupRun.run.sessionId,
			sessionKey: turn.sessionKey,
			lane: runLane
		},
		harness: {
			workspaceDir: turn.followupRun.run.workspaceDir,
			sessionKey: turn.followupRun.run.runtimePolicySessionKey ?? turn.sessionKey,
			preparation: {
				kind: "measured",
				run: (prepare) => params.timing.measure("fallback_prepare_harness", prepare)
			},
			resolveRuntimeOverride: (provider) => resolveSessionRuntimeOverrideForProvider({
				provider,
				entry: params.liveModelSwitchRuntimeEntry ?? turn.getActiveSessionEntry(),
				cfg: params.runtimeConfig
			}),
			resolveContextEngineHost: (provider, model, runtimeOverride) => {
				const runtime = resolveCandidateRuntime(provider, model, runtimeOverride);
				if (!runtime.useCliExecution) return;
				const backend = resolveCliBackendConfig(runtime.cliExecutionProvider, params.runtimeConfig, { agentId: turn.followupRun.run.agentId });
				return buildGenericCliContextEngineHostSupport({
					backendId: backend?.id ?? runtime.cliExecutionProvider,
					...backend?.contextEngineHostCapabilities ? { capabilities: backend.contextEngineHostCapabilities } : {}
				});
			}
		},
		behavior: {
			kind: "channel-delivery",
			readDeliveryEvidence: () => ({
				hasRetryBlockedDelivery: turn.blockReplyPipeline?.hasRetryBlockedDelivery() === true || params.directBlockDeliveries.some(hasBlockReplyDeliveryCustody),
				hasDirectlySentBlockReply: params.directBlockDeliveries.some((delivery) => delivery.terminalDeliveryConfirmed === true),
				hasBlockReplyPipelineOutput: Boolean(turn.blockReplyPipeline?.hasBuffered() || turn.blockReplyPipeline?.didStream())
			})
		},
		sessionOverride: {
			kind: "reconcile-completed",
			reconcile: params.clearRecoveredAutoFallbackPrimaryProbe
		},
		onAcceptedTerminal: () => {
			params.commitTerminalOutcome();
			return turn.replyOperation ? beginReplyOperationFinalizationWork(turn.replyOperation, RUN_STALE_TAKEOVER_MS) : void 0;
		},
		abortSignal: params.runAbortSignal,
		onFallbackStep: (step) => {
			emitModelFallbackStepLifecycle({
				runId: params.runId,
				sessionKey: turn.sessionKey,
				step
			});
		},
		runCandidate: async (provider, model, runOptions) => {
			clearAgentRunTerminalWriteContext(params.preparedRunAdmission.operationalRunInstance);
			params.state.maintenanceAuthProfile = void 0;
			params.state.compactionRequestBudget = void 0;
			invalidateTurnCompactionContext(params.state.compaction);
			params.state.attemptedRuntimeProvider = provider;
			params.state.attemptedRuntimeModel = model;
			const runtime = params.timing.measureSync("fallback_resolve_runtime", () => resolveCandidateRuntime(provider, model, runOptions.agentHarnessRuntimeOverride));
			const candidateRun = runtime.candidateRun;
			bindSourceReplyDeliveryRuntime(candidateRun, sourceReplyDeliveryRuntime);
			const candidateSourceReplyDeliveryMode = sourceReplyDeliveryModeOrigin === "runtime_default" && runtime.useCliExecution ? candidateRun.cliSessionBindingFacts?.sourceReplyDeliveryMode ?? "automatic" : sourceReplyDeliveryRuntime.currentMode;
			const applySourceReplyDeliveryModeBeforeInvocation = sourceReplyDeliveryModeOrigin !== "runtime_default" || runtime.useCliExecution;
			if (candidateSourceReplyDeliveryMode && applySourceReplyDeliveryModeBeforeInvocation) sourceReplyDeliveryRuntime.applyMode(candidateRun, candidateSourceReplyDeliveryMode);
			const candidateThinkLevel = resolveRunThinkingLevelForFallbackCandidate({
				cfg: params.runtimeConfig,
				provider,
				modelId: model,
				run: turn.followupRun.run,
				catalog: turn.followupRun.run.thinkingCatalog,
				agentId: turn.followupRun.run.agentId,
				sessionKey: turn.followupRun.run.runtimePolicySessionKey ?? turn.sessionKey,
				sessionEntry: params.liveModelSwitchRuntimeEntry ?? turn.getActiveSessionEntry(),
				agentRuntime: runtime.sessionRuntimeOverride
			});
			const candidateFastMode = resolveRunFastModeForFallbackCandidate({
				run: candidateRun,
				config: params.runtimeConfig,
				provider,
				model,
				sessionEntry: turn.getActiveSessionEntry()
			});
			const activeProbe = params.effectiveRun.autoFallbackPrimaryProbe;
			if (activeProbe && provider === activeProbe.provider && model === activeProbe.model) markAutoFallbackPrimaryProbe({
				probe: activeProbe,
				sessionKey: turn.sessionKey
			});
			turn.opts?.onModelSelected?.({
				provider,
				model,
				thinkLevel: candidateThinkLevel
			});
			const signalExecutionPhaseForCandidate = (info) => {
				if (params.state.compaction.count > 0 && (info.phase === "model_call_started" || info.phase === "process_spawned")) params.state.postCompactionModelAttempted = true;
				params.signalExecutionPhaseForTyping(info);
			};
			const messageActionTurnCapability = mintReplyMessageActionTurnCapability(turn, params.runId);
			try {
				const common = {
					preparedRunAdmission: params.preparedRunAdmission,
					messageActionTurnCapability,
					turn,
					candidateRun,
					runtimeConfig: params.runtimeConfig,
					provider,
					model,
					candidateThinkLevel,
					candidateFastMode,
					runId: params.runId,
					runAbortSignal: params.runAbortSignal,
					runLane,
					isFallbackRetry: runOptions.isFallbackRetry,
					isFinalFallbackAttempt: runOptions?.isFinalFallbackAttempt,
					suppressQueuedUserPersistenceForCandidate: (turn.followupRun.run.suppressNextUserMessagePersistence ?? false) || queuedUserMessagePersistedAcrossFallback,
					userTurnTranscriptRecorder,
					contextEngineLogicalTurnLease: runOptions.contextEngineLogicalTurnLease,
					onContextEngineTurnCandidate: runOptions.onContextEngineTurnCandidate,
					assistantErrorTranscript: runOptions.assistantErrorTranscript,
					authProfileFailurePolicy: runOptions.authProfileFailurePolicy,
					notifyUserMessagePersisted: () => {
						queuedUserMessagePersistedAcrossFallback = true;
					},
					fastModeStartedAtMs,
					fastModeAutoProgressState,
					bootstrapContextRunKind,
					bootstrapPromptWarningSignaturesSeen: params.state.bootstrapPromptWarningSignaturesSeen,
					currentTurnImages: params.currentTurnImages,
					signalExecutionPhaseForTyping: signalExecutionPhaseForCandidate,
					notifyAgentRunStart: params.notifyAgentRunStart,
					preserveProgressCallbackStartOrder,
					presentation: params.presentation,
					timing: params.timing,
					onLifecycleBackstop: (backstop) => {
						params.state.pendingLifecycleTerminal = {
							provider,
							model,
							backstop
						};
					},
					deferredLifecycle: params.state.deferredLifecycle
				};
				if (runtime.useCliExecution) {
					const candidate = await runCliFallbackCandidate({
						...common,
						cliExecutionProvider: runtime.cliExecutionProvider,
						classifyResult: runOptions.classifyResult,
						lifecycleGeneration: params.state.lifecycleGeneration
					});
					params.state.bootstrapPromptWarningSignaturesSeen = candidate.bootstrapPromptWarningSignaturesSeen;
					return candidate.result;
				}
				const candidate = await runEmbeddedFallbackCandidate({
					...common,
					effectiveRun: params.effectiveRun,
					directBlockDeliveries: params.directBlockDeliveries,
					sessionRuntimeOverride: runtime.sessionRuntimeOverride,
					getLifecycleGeneration: () => params.state.lifecycleGeneration,
					onLifecycleGeneration: (generation) => {
						params.state.lifecycleGeneration = generation;
					},
					allowTransientCooldownProbe: runOptions?.allowTransientCooldownProbe,
					notifyUserAboutCompaction: params.notifyUserAboutCompaction,
					messageToolDeliveryState,
					onCompactionFacts: ({ accounting, postCompactionModelAttempted }) => {
						if (accounting) recordTurnCompaction(params.state.compaction, accounting);
						params.state.postCompactionModelAttempted ||= postCompactionModelAttempted;
					}
				});
				params.state.bootstrapPromptWarningSignaturesSeen = candidate.bootstrapPromptWarningSignaturesSeen;
				params.state.maintenanceAuthProfile = candidate.maintenanceAuthProfile;
				params.state.compactionRequestBudget = candidate.compactionRequestBudget;
				return candidate.result;
			} finally {
				revokeMessageActionTurnCapability(messageActionTurnCapability);
			}
		}
	}));
}
//#endregion
//#region src/auto-reply/reply/pending-tool-task-drain.ts
/** Waits for asynchronous tool tasks before final reply delivery. */
const DEFAULT_PENDING_TOOL_DRAIN_IDLE_TIMEOUT_MS = 3e4;
function observePendingTask(task, observer) {
	const settled = () => observer.settled?.(task);
	task.then(settled, settled);
}
/** Waits for pending tool tasks to settle or times out to avoid session deadlock. */
async function drainPendingToolTasks({ tasks, idleTimeoutMs = DEFAULT_PENDING_TOOL_DRAIN_IDLE_TIMEOUT_MS, onTimeout }) {
	if (tasks.size === 0) return { kind: "settled" };
	if (idleTimeoutMs <= 0) return {
		kind: "timeout",
		remaining: tasks.size
	};
	const observed = /* @__PURE__ */ new WeakSet();
	const observer = {};
	if (await new Promise((resolve) => {
		const finish = (result) => {
			observer.settled = void 0;
			clearTimeout(timeout);
			resolve(result);
		};
		const timeout = setTimeout(() => finish("timeout"), idleTimeoutMs);
		timeout.unref?.();
		const observeNewTasks = () => {
			for (const task of tasks) if (!observed.has(task)) {
				observed.add(task);
				observePendingTask(task, observer);
			}
		};
		observer.settled = (task) => {
			observed.delete(task);
			tasks.delete(task);
			if (tasks.size === 0) finish("settled");
			else {
				timeout.refresh();
				observeNewTasks();
			}
		};
		observeNewTasks();
	}) === "timeout") {
		const remaining = tasks.size;
		onTimeout?.(`pending tool tasks made no progress within ${idleTimeoutMs}ms; proceeding with ${remaining} task(s) still pending to avoid session deadlock`);
		return {
			kind: "timeout",
			remaining
		};
	}
	return { kind: "settled" };
}
//#endregion
//#region src/auto-reply/reply/private-message-tool-final.ts
/** Detects and logs long private finals when message-tool-only delivery was expected. */
const privateFinalReplyLogger = createSubsystemLogger("source-reply/private-final");
const LONG_PRIVATE_FINAL_MIN_CHARS = 280;
const MULTI_SENTENCE_PRIVATE_FINAL_MIN_CHARS = 120;
const MULTI_SENTENCE_TERMINATOR_MIN_COUNT = 2;
const SENTENCE_TERMINATOR_REGEX = /[.!?]+(?:\s|$)|[。！？．｡]+/gu;
/** Returns whether a private final can represent an expected source reply that was not delivered. */
function shouldClassifyPrivateMessageToolFinal(params) {
	return !(params.isHeartbeat || params.isRoomEvent || params.sourceReplyDeliveryMode !== "message_tool_only" || params.sendPolicyDenied || params.successfulSourceReplyDelivery);
}
/** Classifies private final text after message-tool-only source delivery settles. */
function classifyPrivateMessageToolFinal(params) {
	if (!shouldClassifyPrivateMessageToolFinal(params)) return "none";
	const trimmed = params.finalText.trim();
	if (!trimmed || isSilentReplyText(trimmed)) return "none";
	const estimatedChars = estimateStringChars(trimmed);
	return estimatedChars >= LONG_PRIVATE_FINAL_MIN_CHARS || estimatedChars >= MULTI_SENTENCE_PRIVATE_FINAL_MIN_CHARS && countSentenceLikeTerminators(trimmed) >= MULTI_SENTENCE_TERMINATOR_MIN_COUNT ? "substantive" : "short";
}
/**
* Emit metadata-only operator signal. The body is intentionally omitted:
* `message_tool_only` keeps normal final text private by design.
*/
function warnPrivateMessageToolFinal(params) {
	privateFinalReplyLogger.warn("agent produced a long private final reply without calling the configured delivery tool (message_tool_only); response kept private and not delivered to the source channel", {
		sessionKey: params.sessionKey,
		channel: params.channel,
		chars: params.finalTextLength
	});
}
function countSentenceLikeTerminators(text) {
	return Array.from(text.matchAll(SENTENCE_TERMINATOR_REGEX)).length;
}
//#endregion
//#region src/auto-reply/reply/agent-runner-fallback-settlement.ts
/** Settles abort, lifecycle, and terminal failure state after fallback execution. */
async function settleAgentFallbackCycle(params) {
	const { cycle, fallbackResult } = params;
	const turn = cycle.turn;
	const runResult = fallbackResult.result;
	const fallbackProvider = fallbackResult.provider;
	const fallbackModel = fallbackResult.model;
	const fallbackExhausted = fallbackResult.outcome === "exhausted";
	const terminalMetadata = fallbackResult.terminal.metadata;
	const terminalOutcome = fallbackResult.terminal.outcome;
	const settledLifecycleTerminal = cycle.state.pendingLifecycleTerminal?.provider === fallbackProvider && cycle.state.pendingLifecycleTerminal.model === fallbackModel ? cycle.state.pendingLifecycleTerminal.backstop : void 0;
	cycle.state.pendingLifecycleTerminal = void 0;
	if (turn.isRestartRecoveryArmed?.()) turn.replyOperation?.abortForRestart();
	const abortReason = resolveReplyOperationAbortReason(turn.replyOperation);
	if (abortReason) {
		settledLifecycleTerminal?.emit("end", runResult, terminalMetadata);
		await drainPendingToolTasks({
			tasks: turn.pendingToolTasks,
			onTimeout: logVerbose
		});
		return {
			kind: "aborted",
			reason: abortReason
		};
	}
	cycle.commitTerminalOutcome();
	const fallbackAttempts = Array.isArray(fallbackResult.attempts) ? fallbackResult.attempts.map((attempt) => ({
		provider: attempt.provider,
		model: attempt.model,
		error: attempt.error,
		reason: attempt.reason ?? "unknown",
		status: typeof attempt.status === "number" ? attempt.status : void 0,
		code: attempt.code || void 0
	})) : [];
	if (!fallbackExhausted) await fallbackResult.settleSessionOverride();
	const embeddedError = runResult.meta?.error;
	const deferredLifecycleError = settledLifecycleTerminal?.getDeferredError();
	const userFacingErrorPayload = runResult.payloads?.find((payload) => payload.isError === true && typeof payload.text === "string")?.text;
	const terminalErrorMessage = deferredLifecycleError ?? (terminalOutcome.status === "timeout" ? terminalOutcome.error : userFacingErrorPayload) ?? (embeddedError ? "Agent run failed" : void 0);
	const emitSettledLifecycleError = (error, extraData) => {
		if (settledLifecycleTerminal) {
			settledLifecycleTerminal.emit("error", error, extraData);
			return;
		}
		emitAgentEvent({
			runId: cycle.runId,
			lifecycleGeneration: cycle.state.lifecycleGeneration,
			...turn.sessionKey ? { sessionKey: turn.sessionKey } : {},
			stream: "lifecycle",
			data: {
				phase: "error",
				error: error.message,
				endedAt: Date.now(),
				...extraData,
				executionSettled: true
			}
		});
	};
	if (embeddedError && isContextOverflowError(embeddedError.message)) {
		emitSettledLifecycleError(new Error(terminalErrorMessage ?? "Agent run failed"));
		defaultRuntime.error(`Auto-compaction failed (${embeddedError.message}). Preserving existing session mapping for ${turn.sessionKey ?? turn.followupRun.run.sessionId}.`);
		turn.replyOperation?.fail("run_failed", embeddedError);
		return {
			kind: "final",
			payload: markAgentRunFailureReplyPayload({ text: buildContextOverflowRecoveryText({
				preserveSessionMapping: true,
				cfg: cycle.runtimeConfig,
				agentId: turn.followupRun.run.agentId,
				primaryProvider: turn.followupRun.run.provider,
				primaryModel: turn.followupRun.run.model,
				runtimeProvider: cycle.state.attemptedRuntimeProvider,
				runtimeModel: cycle.state.attemptedRuntimeModel,
				activeSessionEntry: turn.getActiveSessionEntry()
			}) }),
			postCompactionModelFailure: cycle.state.postCompactionModelAttempted || void 0
		};
	}
	if (embeddedError?.kind === "role_ordering") {
		emitSettledLifecycleError(new Error(terminalErrorMessage ?? "Agent run failed"));
		turn.replyOperation?.fail("run_failed", embeddedError);
		const embeddedErrorText = formatErrorMessage(embeddedError);
		return {
			kind: "final",
			payload: markAgentRunFailureReplyPayload({ text: cycle.shouldSurfaceToControlUi ? renderControlUiAgentFailureCopy(embeddedErrorText) : PROVIDER_CONVERSATION_STATE_ERROR_USER_MESSAGE }),
			postCompactionModelFailure: cycle.state.postCompactionModelAttempted || void 0
		};
	}
	const sourceReplyPolicy = turn.sessionKey ? resolveSourceReplyPolicy({
		cfg: cycle.runtimeConfig,
		sessionCtx: turn.sessionCtx,
		sessionEntry: turn.getActiveSessionEntry(),
		sessionKey: turn.sessionKey,
		runtimePolicySessionKey: turn.runtimePolicySessionKey,
		opts: turn.opts
	}) : void 0;
	const finalText = runResult.meta?.finalAssistantVisibleText?.trim() ?? "";
	const successfulSourceReplyDelivery = hasCompletedSourceReplyDeliveryEvidence(runResult);
	const privateFinalTerminalReply = !(runResult.meta?.yielded === true || (runResult.meta?.pendingToolCalls?.length ?? 0) > 0) && classifyPrivateMessageToolFinal({
		sourceReplyDeliveryMode: sourceReplyPolicy?.sourceReplyDeliveryMode,
		sendPolicyDenied: sourceReplyPolicy?.sendPolicyDenied === true,
		successfulSourceReplyDelivery,
		isHeartbeat: turn.isHeartbeat,
		isRoomEvent: turn.sessionCtx.InboundEventKind === "room_event",
		finalText
	}) === "short" ? {
		disposition: "empty",
		code: "message-tool-not-called"
	} : void 0;
	let terminalRunFailed = false;
	if (fallbackExhausted) {
		const exhaustionError = new Error(terminalErrorMessage ?? "All model fallback candidates failed");
		terminalRunFailed = true;
		if (cycle.modelPatch.captureFallbackFailure(fallbackAttempts) === void 0) cycle.modelPatch.captureFailure(embeddedError ?? exhaustionError);
		emitSettledLifecycleError(exhaustionError, terminalMetadata);
		turn.replyOperation?.retainFailureUntilComplete();
		turn.replyOperation?.fail("run_failed", exhaustionError);
	} else if (deferredLifecycleError || embeddedError || terminalOutcome.status === "timeout" || classifyAgentRunTerminalOutcome(terminalOutcome) === "failure") {
		const terminalError = new Error(terminalErrorMessage ?? "Agent run failed");
		terminalRunFailed = true;
		cycle.modelPatch.captureFailure(embeddedError ?? terminalError);
		emitSettledLifecycleError(terminalError, terminalMetadata);
		turn.replyOperation?.retainFailureUntilComplete();
		turn.replyOperation?.fail("run_failed", terminalError);
	} else settledLifecycleTerminal?.emit("end", runResult, privateFinalTerminalReply ? {
		...terminalMetadata,
		terminalReply: privateFinalTerminalReply
	} : terminalMetadata);
	return {
		kind: "completed",
		runResult,
		fallbackProvider,
		fallbackModel,
		fallbackExhausted,
		fallbackAttempts,
		terminalRunFailed
	};
}
//#endregion
//#region src/auto-reply/reply/agent-runner-fallback-cycle.ts
/** Runs one fallback chain, then settles its terminal lifecycle state. */
async function executeAgentFallbackCycle(params) {
	const fallbackResult = await runAgentFallbackCandidates(params);
	params.timing.logIfSlow({
		runId: params.runId,
		sessionId: params.turn.followupRun.run.sessionId,
		sessionKey: params.turn.sessionKey,
		outcome: "completed"
	});
	return settleAgentFallbackCycle({
		cycle: params,
		fallbackResult
	});
}
//#endregion
//#region src/auto-reply/reply/agent-runner-presentation.ts
/** Builds the channel-presentation callbacks shared by CLI and embedded runs. */
function createAgentTurnPresentation(params) {
	const classifyStreamingPartial = (payload) => {
		let text = payload.text;
		const reply = resolveSendableOutboundReplyParts(payload, { text: "" });
		if (params.turn.followupRun.run.silentExpected) return { skip: true };
		if (!params.turn.isHeartbeat && text?.includes("HEARTBEAT_OK")) {
			const stripped = stripHeartbeatToken(text, { mode: "message" });
			if (stripped.didStrip && !params.heartbeatState.didLogStrip) {
				params.heartbeatState.didLogStrip = true;
				logVerbose("Stripped stray HEARTBEAT_OK token from reply");
			}
			if (stripped.shouldSkip && !reply.hasMedia) return { skip: true };
			text = stripped.text;
		}
		if (isSilentReplyText(text, "NO_REPLY")) return { skip: true };
		if (isSilentReplyPrefixText(text, "NO_REPLY") || isSilentReplyPrefixText(text, "HEARTBEAT_OK")) return { skip: true };
		if (text && startsWithSilentToken(text, "NO_REPLY")) text = stripLeadingSilentToken(text, SILENT_REPLY_TOKEN);
		if (!text) return reply.hasMedia ? {
			text: void 0,
			skip: false
		} : { skip: true };
		return {
			text,
			skip: false
		};
	};
	const sanitizeStreamingText = (text, errorContext) => {
		if (!text) return { skip: true };
		const conversationContext = params.turn.sessionCtx.agentText ?? params.turn.sessionCtx.BodyForAgent;
		const sanitized = errorContext ? renderUserFacingText(text, {
			errorContext: true,
			conversationContext,
			streaming: true
		}) : sanitizeUserFacingText(text, {
			conversationContext,
			streaming: true
		});
		return sanitized.trim() ? {
			text: sanitized,
			skip: isSilentReplyPayloadText(sanitized, SILENT_REPLY_TOKEN)
		} : { skip: true };
	};
	const normalizeStreamingText = (payload) => {
		const classified = classifyStreamingPartial(payload);
		if (classified.skip || !classified.text) return classified;
		return sanitizeStreamingText(classified.text, Boolean(payload.isError));
	};
	const preserveProgressCallbackStartOrder = params.turn.opts?.preserveProgressCallbackStartOrder === true;
	const presentWithTyping = async (typingPromise, startPresentation) => {
		if (!preserveProgressCallbackStartOrder) {
			await typingPromise;
			const operation = params.turn.replyOperation;
			if (operation && (operation.abortSignal.aborted || operation.result || hasCommittedReplyOperationOutcome(operation))) return false;
			return await startPresentation();
		}
		let presentationPromise;
		try {
			presentationPromise = startPresentation();
		} catch (err) {
			typingPromise.catch(() => void 0);
			throw err;
		}
		const [, result] = await Promise.all([typingPromise, presentationPromise]);
		return result;
	};
	const blockReplyPipeline = params.turn.blockReplyPipeline;
	return {
		classifyStreamingPartial,
		sanitizeStreamingText,
		normalizeStreamingText,
		presentWithTyping,
		blockReplyHandler: params.turn.opts?.onPreparedBlockReply || params.turn.opts?.onBlockReply ? createBlockReplyDeliveryHandler({
			onBlockReply: async (payload, context) => {
				if (params.turn.opts?.onPreparedBlockReply) {
					for (const plan of createStructuredOutboundPayloadPlan([payload])) await params.turn.opts.onPreparedBlockReply(plan, context);
					return;
				}
				await params.turn.opts?.onBlockReply?.(payload, context);
			},
			currentMessageId: params.turn.sessionCtx.MessageSidFull ?? params.turn.sessionCtx.MessageSid,
			replyThreading: params.turn.replyThreading,
			normalizeStreamingText,
			applyReplyToMode: params.turn.applyReplyToMode,
			normalizeMediaPaths: params.replyMediaContext.normalizePayload,
			typingSignals: params.turn.typingSignals,
			reasoningPayloadsEnabled: params.turn.opts?.reasoningPayloadsEnabled,
			commentaryPayloadsEnabled: params.turn.opts?.commentaryPayloadsEnabled,
			blockStreamingEnabled: params.turn.blockStreamingEnabled,
			blockReplyPipeline,
			directBlockDeliveries: params.directBlockDeliveries
		}) : void 0
	};
}
//#endregion
//#region src/auto-reply/reply/agent-runner-turn-timing.ts
const agentTurnTimingLog = createSubsystemLogger("auto-reply/agent-turn-timing");
function resolveRunStartupPhase(phase) {
	switch (phase) {
		case "runner_entered":
		case "workspace":
		case "runtime_plugins": return "preparing_workspace";
		case "before_agent_reply":
		case "model_resolution":
		case "auth":
		case "context_engine":
		case "attempt_dispatch":
		case "context_assembled": return "preparing_context";
		case "turn_accepted":
		case "process_spawned":
		case "model_call_started": return "starting_model";
		case "tool_execution_started":
		case "assistant_output_started": return;
	}
}
function createAgentTurnTimingTracker(options = {}) {
	const observedExecutionPhases = /* @__PURE__ */ new Set();
	const timing = createReplyTimingTracker({
		log: { warn(message, details) {
			if ((details?.milestone === "assistant_output_started" || details?.milestone === "tool_execution_started") && !options.profilerEnabled) agentTurnTimingLog.info(message, details);
			else agentTurnTimingLog.warn(message, details);
		} },
		enabled: options.profilerEnabled === true,
		formatMessage: (params, summary, stages) => {
			const identity = `runId=${params.runId} sessionId=${params.sessionId ?? "unknown"} sessionKey=${params.sessionKey ?? "unknown"}`;
			return "milestone" in params ? `agent turn milestone ${identity} milestone=${params.milestone} totalMs=${summary.totalMs} stages=${stages}` : `agent turn timings ${identity} outcome=${params.outcome} totalMs=${summary.totalMs} stages=${stages}${params.error ? ` error="${params.error}"` : ""}`;
		},
		detailKeys: (params) => "milestone" in params ? [
			"runId",
			"sessionId",
			"sessionKey",
			"milestone"
		] : [
			"runId",
			"sessionId",
			"sessionKey",
			"outcome",
			"error"
		]
	});
	return {
		measure: timing.measure,
		measureSync: timing.measureSync,
		logIfSlow(params) {
			if (!options.profilerEnabled) return;
			const { runId, sessionId, sessionKey, outcome, error } = params;
			timing.logIfSlow({
				runId,
				sessionId,
				sessionKey,
				outcome,
				error
			});
		},
		logMilestoneIfSlow(params) {
			const { runId, sessionId, sessionKey, milestone } = params;
			timing.logIfSlow({
				runId,
				sessionId,
				sessionKey,
				milestone
			}, { repeat: true });
		},
		logExecutionPhaseIfSlow(params) {
			if (observedExecutionPhases.has(params.phase)) return;
			observedExecutionPhases.add(params.phase);
			const { runId, sessionId, sessionKey, phase: milestone } = params;
			timing.logIfSlow({
				runId,
				sessionId,
				sessionKey,
				milestone
			}, { repeat: true });
		}
	};
}
//#endregion
//#region src/auto-reply/reply/agent-runner-execution.ts
/** Agent-runner execution loop, fallback handling, and user-facing failure mapping. */
async function executeAgentTurnInternalLoop(params, commitTerminalOutcome, commitMcpAppModelContext, preparedRunAdmission, admittedRunContext, deferredLifecycle, compaction) {
	const heartbeatState = { didLogStrip: false };
	const directBlockDeliveries = [];
	const runnableRun = resolveRunAfterAutoFallbackPrimaryProbeRecheck({
		run: params.followupRun.run,
		entry: params.activeSessionStore?.[params.sessionKey ?? ""] ?? params.getActiveSessionEntry(),
		sessionKey: params.sessionKey
	});
	if (runnableRun !== params.followupRun.run) params.followupRun.run = runnableRun;
	const runtimeConfig = resolveQueuedReplyRuntimeConfig(runnableRun.config);
	const effectiveRun = runtimeConfig === runnableRun.config ? runnableRun : {
		...runnableRun,
		config: runtimeConfig
	};
	let liveModelSwitchRuntimeEntry;
	const applyLiveModelSwitchToRun = (run, err) => {
		run.provider = err.provider;
		run.model = err.model;
		run.authProfileId = err.authProfileId;
		run.authProfileIdSource = err.authProfileId ? err.authProfileIdSource : void 0;
		run.autoFallbackPrimaryProbe = void 0;
		liveModelSwitchRuntimeEntry = { agentRuntimeOverride: err.agentRuntimeOverride };
	};
	const runId = params.opts?.runId ?? crypto.randomUUID();
	const agentTurnTiming = createAgentTurnTimingTracker({ profilerEnabled: isReplyProfilerEnabled({ config: runtimeConfig }) });
	const shouldSurfaceToControlUi = isInternalMessageChannel(params.followupRun.run.messageProvider ?? params.sessionCtx.Surface ?? params.sessionCtx.Provider);
	let lifecycleGeneration = captureAgentRunLifecycleGeneration(runId);
	if (params.sessionKey) registerAgentRunContext(runId, {
		sessionKey: params.sessionKey,
		...params.followupRun.run.sessionId ? { sessionId: params.followupRun.run.sessionId } : {},
		agentId: params.followupRun.run.agentId,
		lifecycleGeneration,
		verboseLevel: params.resolvedVerboseLevel,
		isHeartbeat: params.isHeartbeat,
		isControlUiVisible: shouldSurfaceToControlUi,
		...progressCardRefreshRunProjection(params.followupRun.run.inputProvenance),
		completionSource: params.completionSource
	});
	if (isDiagnosticsEnabled(runtimeConfig)) logSessionTurnCreated({
		runId,
		sessionKey: params.sessionKey,
		sessionId: params.followupRun.run.sessionId,
		agentId: params.followupRun.run.agentId,
		channel: params.followupRun.run.messageProvider ?? params.sessionCtx.Surface ?? params.sessionCtx.Provider,
		trigger: params.isHeartbeat ? "heartbeat" : "user"
	});
	let replyMediaContext;
	let currentTurnImages;
	try {
		replyMediaContext = params.replyMediaContext ?? agentTurnTiming.measureSync("reply_media_context", () => createReplyMediaContext({
			cfg: runtimeConfig,
			agentId: params.followupRun.run.agentId,
			sessionKey: params.sessionKey,
			workspaceDir: params.followupRun.run.workspaceDir,
			mediaNormalizationOwner: params.followupRun.run.mediaNormalizationOwner,
			messageProvider: params.followupRun.run.messageProvider,
			accountId: params.followupRun.originatingAccountId ?? params.followupRun.run.agentAccountId,
			groupId: params.followupRun.run.groupId,
			groupChannel: params.followupRun.run.groupChannel,
			groupSpace: params.followupRun.run.groupSpace,
			requesterSenderId: params.followupRun.run.senderId,
			requesterSenderName: params.followupRun.run.senderName,
			requesterSenderUsername: params.followupRun.run.senderUsername,
			requesterSenderE164: params.followupRun.run.senderE164
		}));
		const internalFollowupRun = params.followupRun;
		currentTurnImages = internalFollowupRun.currentTurnImagesPrepared === true || Object.hasOwn(params.followupRun, "images") || Object.hasOwn(params.followupRun, "imageOrder") ? {
			images: params.followupRun.images,
			imageOrder: params.followupRun.imageOrder,
			mediaImageLayout: internalFollowupRun.mediaImageLayout
		} : await agentTurnTiming.measure("current_turn_images", () => resolveCurrentTurnImages({
			ctx: params.sessionCtx,
			cfg: runtimeConfig,
			images: params.opts?.images,
			imageOrder: params.opts?.imageOrder
		}));
	} catch (error) {
		clearAgentRunContext(runId, lifecycleGeneration);
		throw error;
	}
	let didNotifyAgentRunStart = false;
	let lastRunStartupPhase;
	const notifyAgentRunStart = () => {
		if (didNotifyAgentRunStart) return;
		didNotifyAgentRunStart = true;
		if (params.replyOperation) markReplyOperationExecutionStarted(params.replyOperation);
		params.opts?.onAgentRunStart?.(runId, admittedRunContext.current?.executionIdentityToken);
	};
	const signalExecutionPhaseForTyping = (info) => {
		agentTurnTiming.logExecutionPhaseIfSlow({
			runId,
			sessionId: params.followupRun.run.sessionId,
			sessionKey: params.sessionKey,
			phase: info.phase
		});
		const startupPhase = resolveRunStartupPhase(info.phase);
		if (startupPhase && startupPhase !== lastRunStartupPhase) {
			lastRunStartupPhase = startupPhase;
			emitAgentRunStatusEvent({
				runId,
				phase: startupPhase
			});
		}
		if (info.phase === "model_call_started" || info.phase === "process_spawned") commitMcpAppModelContext();
		if (!(info.phase === "turn_accepted" || info.phase === "process_spawned" || info.phase === "model_call_started" || info.phase === "tool_execution_started" || info.phase === "assistant_output_started")) return;
		notifyAgentRunStart();
		(params.typingSignals.signalExecutionActivity?.() ?? params.typingSignals.signalRunStart()).catch((err) => {
			logVerbose(`execution phase typing signal failed: ${String(err)}`);
		});
	};
	const notifyUserAboutCompaction = shouldNotifyUserAboutCompaction(runtimeConfig);
	let runResult;
	let fallbackProvider = params.followupRun.run.provider;
	let fallbackModel = params.followupRun.run.model;
	let fallbackAttempts = [];
	let fallbackExhausted = false;
	let terminalRunFailed = false;
	const modelPatch = createAgentPatchedSessionModelRunGuard({
		cfg: runtimeConfig,
		agentId: params.followupRun.run.agentId,
		sessionKey: params.sessionKey,
		storePath: params.storePath,
		onError: (error) => logVerbose(`agent model patch reconciliation failed: ${formatErrorMessage(error)}`)
	});
	let liveModelSwitchRetries = 0;
	const fallbackCycleState = {
		deferredLifecycle,
		lifecycleGeneration,
		turnStartedAtMs: Date.now(),
		compaction,
		postCompactionModelAttempted: false,
		attemptedRuntimeProvider: fallbackProvider,
		attemptedRuntimeModel: fallbackModel,
		bootstrapPromptWarningSignaturesSeen: resolveBootstrapWarningSignaturesSeen(params.getActiveSessionEntry()?.systemPromptReport)
	};
	const clearRecoveredAutoFallbackPrimaryProbe = async (paramsForClear) => clearRecoveredAutoFallbackPrimaryProbeSelection({
		run: effectiveRun,
		...paramsForClear,
		sessionKey: params.sessionKey,
		activeSessionStore: params.activeSessionStore,
		getActiveSessionEntry: params.getActiveSessionEntry,
		storePath: params.storePath
	});
	while (true) try {
		const presentation = createAgentTurnPresentation({
			turn: params,
			replyMediaContext,
			directBlockDeliveries,
			heartbeatState
		});
		const cycle = await executeAgentFallbackCycle({
			preparedRunAdmission,
			turn: params,
			effectiveRun,
			runtimeConfig,
			liveModelSwitchRuntimeEntry,
			runId,
			runAbortSignal: fallbackCycleState.deferredLifecycle.signal,
			currentTurnImages,
			state: fallbackCycleState,
			presentation,
			directBlockDeliveries,
			notifyAgentRunStart,
			signalExecutionPhaseForTyping,
			notifyUserAboutCompaction,
			timing: agentTurnTiming,
			modelPatch,
			shouldSurfaceToControlUi,
			commitTerminalOutcome,
			clearRecoveredAutoFallbackPrimaryProbe
		});
		lifecycleGeneration = fallbackCycleState.lifecycleGeneration;
		if (cycle.kind === "aborted") return cycle;
		if (cycle.kind === "final") return {
			...cycle,
			resolved: {
				provider: fallbackCycleState.attemptedRuntimeProvider,
				model: fallbackCycleState.attemptedRuntimeModel
			}
		};
		runResult = cycle.runResult;
		fallbackProvider = cycle.fallbackProvider;
		fallbackModel = cycle.fallbackModel;
		fallbackExhausted = cycle.fallbackExhausted;
		fallbackAttempts = cycle.fallbackAttempts;
		terminalRunFailed = cycle.terminalRunFailed;
		break;
	} catch (err) {
		if (err instanceof LiveSessionModelSwitchError) liveModelSwitchRetries += 1;
		const action = await handleAgentExecutionError({
			turn: params,
			error: err,
			runtimeConfig,
			runId,
			state: fallbackCycleState,
			liveModelSwitchRetries,
			shouldSurfaceToControlUi,
			timing: agentTurnTiming,
			modelPatch,
			resolveVisibleReplyDelivery: () => resolveReplyFailureVisibility(params.resolveVisibleReplyDelivery, directBlockDeliveries)
		});
		if (action.kind === "aborted") return action;
		if (action.kind === "final") return {
			...action,
			resolved: {
				provider: fallbackCycleState.attemptedRuntimeProvider,
				model: fallbackCycleState.attemptedRuntimeModel
			}
		};
		if (action.liveModelSwitchError) {
			const switchError = action.liveModelSwitchError;
			applyLiveModelSwitchToRun(params.followupRun.run, switchError);
			if (runnableRun !== params.followupRun.run) applyLiveModelSwitchToRun(runnableRun, switchError);
			if (effectiveRun !== runnableRun && effectiveRun !== params.followupRun.run) applyLiveModelSwitchToRun(effectiveRun, switchError);
		}
		continue;
	}
	const finalEmbeddedError = runResult?.meta?.error;
	const hasPayloadText = runResult?.payloads?.some((p) => normalizeOptionalString(p.text));
	if (finalEmbeddedError && !hasPayloadText) {
		const errorMsg = finalEmbeddedError.message ?? "";
		if (isContextOverflowError(errorMsg)) {
			params.replyOperation?.fail("run_failed", finalEmbeddedError);
			return {
				kind: "final",
				resolved: {
					provider: fallbackProvider,
					model: fallbackModel
				},
				payload: markAgentRunFailureReplyPayload({ text: "⚠️ Context overflow — this conversation is too large for the model. Use /new to start a fresh session." }),
				postCompactionModelFailure: fallbackCycleState.postCompactionModelAttempted || void 0
			};
		}
	}
	if (runResult) {
		if (!runResult.payloads?.some((p) => !p.isError && !p.isReasoning && hasOutboundReplyContent(p, { trimText: true }))) {
			const metaErrorMsg = finalEmbeddedError?.message ?? "";
			const rawErrorPayloadText = runResult.payloads?.find((p) => p.isError && hasNonEmptyString(p.text) && !p.text.startsWith("⚠️"))?.text ?? "";
			const errorCandidate = metaErrorMsg || rawErrorPayloadText;
			const candidateReason = errorCandidate ? classifyFailoverReason(errorCandidate) : null;
			const formattedErrorCandidate = candidateReason === "rate_limit" || candidateReason === "overloaded" ? renderRateLimitOrOverloadedCopy({
				reason: candidateReason,
				raw: errorCandidate
			}) : void 0;
			if (formattedErrorCandidate) runResult.payloads = [markAgentRunFailureReplyPayload({
				text: formattedErrorCandidate,
				isError: true
			})];
		}
	}
	const patchedModelNeedsRevert = terminalRunFailed ? false : modelPatch.captureFallbackFailure(fallbackAttempts) ?? false;
	await modelPatch.finish(!terminalRunFailed && !patchedModelNeedsRevert);
	let terminalFailurePayload;
	if (terminalRunFailed) {
		const replyExpectation = resolveReplyExpectation(params.followupRun.run);
		terminalFailurePayload = buildTerminalAgentRunFailureReplyPayload({
			isHeartbeat: params.isHeartbeat,
			replyExpectation,
			visibleReplyDelivered: replyExpectation === "optional" ? await resolveReplyFailureVisibility(params.resolveVisibleReplyDelivery, directBlockDeliveries) : false
		});
	}
	return {
		kind: "completed",
		maintenanceAuthProfile: fallbackCycleState.maintenanceAuthProfile,
		compactionRequestBudget: fallbackCycleState.compactionRequestBudget,
		result: runResult,
		fallbackProvider,
		fallbackModel,
		...fallbackExhausted ? { fallbackExhausted: true } : {},
		fallbackAttempts,
		didLogHeartbeatStrip: heartbeatState.didLogStrip,
		autoCompactionCount: compaction.count,
		hasDirectlySentBlockReply: directBlockDeliveries.some((delivery) => delivery.terminalDeliveryConfirmed === true) || void 0,
		directBlockDeliveries,
		...terminalFailurePayload ? { terminalFailurePayload } : {},
		...terminalRunFailed && fallbackCycleState.postCompactionModelAttempted ? { postCompactionModelFailure: true } : {}
	};
}
async function executeAgentTurnInternal(params, commitTerminalOutcome, commitMcpAppModelContext, compaction) {
	const runId = params.opts?.runId ?? crypto.randomUUID();
	const admittedRunContext = {};
	const gatewayContextResolver = readChannelContextGatewayContextResolver(params.sessionCtx) ?? getPluginRuntimeGatewayRequestScope()?.resolveGatewayContext;
	const preparedRunAdmission = prepareChannelRunAdmission({
		cfg: resolveQueuedReplyRuntimeConfig(params.followupRun.run.config),
		runId,
		agentId: params.followupRun.run.agentId,
		ingressKind: "channel",
		boundary: "auto-reply.agent-runner",
		operatorAuthority: params.followupRun.operatorAuthority,
		evidence: params.followupRun.channelAdmissionEvidence,
		assertSourceCurrent: params.followupRun.run.senderIsOwner === true ? captureCommandOwnerAssertion(params.followupRun.run) : void 0,
		onAdmitted: (context) => {
			bindGatewayContextResolver(context, gatewayContextResolver);
			admittedRunContext.current = context;
			params.followupRun.run.skillLibraryAuthoring?.bind(context);
		}
	});
	const deferredLifecycle = createDeferredEmbeddedRunLifecycleManager({
		runId,
		agentId: params.followupRun.run.agentId,
		sessionId: params.followupRun.run.sessionId,
		sessionKey: params.sessionKey,
		sessionFile: params.followupRun.run.sessionFile,
		abortSignal: resolveFollowupAbortSignal({
			abortSignal: params.replyOperation?.abortSignal ?? params.opts?.abortSignal,
			operatorAuthority: params.followupRun.operatorAuthority
		})
	});
	try {
		return await executeAgentTurnInternalLoop(params, commitTerminalOutcome, commitMcpAppModelContext, preparedRunAdmission, admittedRunContext, deferredLifecycle, compaction);
	} finally {
		try {
			await deferredLifecycle.complete();
		} finally {
			await drainAgentRunTerminalWrites(preparedRunAdmission.operationalRunInstance).finally(preparedRunAdmission.close);
		}
	}
}
/** Runs the agent turn with provider/model fallback, retry, and closed settlement. */
async function executeAgentTurnOutcome(params) {
	const runId = params.opts?.runId ?? crypto.randomUUID();
	const executionParams = params.opts?.runId === runId ? params : {
		...params,
		opts: {
			...params.opts,
			runId
		}
	};
	const runtime = executionParams.isHeartbeat ? void 0 : peekSessionMcpRuntime({
		sessionId: executionParams.followupRun.run.sessionId,
		sessionKey: executionParams.sessionKey ?? executionParams.followupRun.run.sessionKey
	});
	const modelContextLease = runtime ? leaseMcpAppModelContextForTurn({ runtime }) : void 0;
	const turnParams = modelContextLease ? {
		...executionParams,
		followupRun: {
			...executionParams.followupRun,
			currentInboundContext: appendCurrentInboundContext(executionParams.followupRun.currentInboundContext, [modelContextLease.context], modelContextLease.legacyText)
		}
	} : executionParams;
	const compaction = {
		count: 0,
		durable: []
	};
	const completedCompaction = () => compaction.count > 0 ? { compaction: {
		count: compaction.count,
		durable: [...compaction.durable]
	} } : {};
	let terminalOutcomeCommitted = false;
	const commitTerminalOutcome = () => {
		if (terminalOutcomeCommitted) return;
		terminalOutcomeCommitted = true;
		executionParams.replyOperation?.freezeAbort();
	};
	const lifecycleGeneration = captureAgentRunLifecycleGeneration(runId);
	try {
		const internal = await withAgentRunLifecycleGeneration(lifecycleGeneration, async () => {
			try {
				return await executeAgentTurnInternal(turnParams, commitTerminalOutcome, modelContextLease?.commit ?? (() => void 0), compaction);
			} finally {
				modelContextLease?.rollback();
				commitTerminalOutcome();
			}
		});
		if (internal.kind === "aborted") return {
			runId,
			outcome: {
				...internal,
				...completedCompaction()
			}
		};
		const abortReason = resolveReplyOperationAbortReason(executionParams.replyOperation);
		if (abortReason) return {
			runId,
			outcome: {
				kind: "aborted",
				reason: abortReason,
				...completedCompaction()
			}
		};
		if (internal.kind === "final") return {
			runId,
			outcome: {
				kind: "rejected",
				payload: internal.payload,
				resolved: internal.resolved,
				...internal.postCompactionModelFailure ? { postCompactionModelFailure: internal.postCompactionModelFailure } : {},
				...completedCompaction()
			}
		};
		const provider = internal.fallbackProvider ?? internal.result.meta?.agentMeta?.provider ?? executionParams.followupRun.run.provider;
		const model = internal.fallbackModel ?? internal.result.meta?.agentMeta?.model ?? executionParams.followupRun.run.model;
		const terminalStatus = internal.terminalFailurePayload ? {
			status: "failed",
			terminalFailurePayload: internal.terminalFailurePayload,
			...internal.postCompactionModelFailure ? { postCompactionModelFailure: internal.postCompactionModelFailure } : {}
		} : { status: "ok" };
		return {
			runId,
			outcome: {
				kind: "settled",
				maintenanceAuthProfile: internal.maintenanceAuthProfile,
				compactionRequestBudget: internal.compactionRequestBudget,
				...terminalStatus,
				result: internal.result,
				resolved: {
					provider,
					model
				},
				fallback: {
					exhausted: internal.fallbackExhausted === true,
					attempts: internal.fallbackAttempts
				},
				autoCompactionCount: internal.autoCompactionCount,
				...completedCompaction(),
				didLogHeartbeatStrip: internal.didLogHeartbeatStrip,
				hasDirectlySentBlockReply: internal.hasDirectlySentBlockReply,
				directBlockDeliveries: internal.directBlockDeliveries
			}
		};
	} catch (error) {
		const abortReason = resolveReplyOperationAbortReason(executionParams.replyOperation, error);
		if (abortReason) return {
			runId,
			outcome: {
				kind: "aborted",
				reason: abortReason,
				...completedCompaction()
			}
		};
		throw error;
	}
}
/** Runs the agent turn and records its execution and message-tool delivery outcomes. */
async function executeAgentTurn(params) {
	params.opts?.onRunVerbosityResolved?.({
		verboseLevelOverride: params.followupRun.run.verboseLevelOverride,
		resolvedVerboseLevel: params.resolvedVerboseLevel
	});
	if (params.replyOperation) retainReplyOperationUntilComplete(params.replyOperation);
	const runId = params.opts?.runId ?? crypto.randomUUID();
	const executionParams = params.opts?.runId === runId ? params : {
		...params,
		opts: {
			...params.opts,
			runId
		}
	};
	try {
		const result = await executeAgentTurnOutcome(executionParams);
		recordAgentTurnExecutionOutcome(executionParams, result);
		return result;
	} catch (error) {
		recordAgentTurnExecutionOutcome(executionParams, void 0);
		throw error;
	}
}
//#endregion
//#region src/auto-reply/reply/agent-runner-trace.ts
function formatRawTraceBlock(title, value) {
	return `🔎 ${title}:\n~~~text\n${value?.trim() ? escapeTraceFence(value) : "<empty>"}\n~~~`;
}
function escapeTraceFence(value) {
	return value.replace(/^~~~/gm, "\\~~~");
}
function hasTraceUsageFields(usage) {
	if (!usage) return false;
	return [
		"input",
		"output",
		"cacheRead",
		"cacheWrite",
		"total"
	].some((key) => {
		const value = usage[key];
		return typeof value === "number" && Number.isFinite(value);
	});
}
function formatTraceUsageLine(label, value) {
	return `${label}=${typeof value === "number" && Number.isFinite(value) ? `${value.toLocaleString()} tok (${formatTokenCount(value)})` : "n/a"}`;
}
function formatUsageTraceBlock(title, usage) {
	if (!hasTraceUsageFields(usage)) return;
	return `🔎 ${title}:\n~~~text\n${[
		formatTraceUsageLine("input", usage?.input),
		formatTraceUsageLine("output", usage?.output),
		formatTraceUsageLine("cacheRead", usage?.cacheRead),
		formatTraceUsageLine("cacheWrite", usage?.cacheWrite),
		formatTraceUsageLine("total", usage?.total)
	].join("\n")}\n~~~`;
}
function formatTraceScalar(value) {
	if (typeof value === "boolean") return value ? "yes" : "no";
	if (typeof value === "number") return Number.isFinite(value) ? value.toLocaleString() : void 0;
	return normalizeOptionalString(value) ?? void 0;
}
function formatKeyValueTraceBlock(title, fields) {
	const lines = fields.flatMap(([key, rawValue]) => {
		const value = formatTraceScalar(rawValue);
		return value ? [`${key}=${value}`] : [];
	});
	if (lines.length === 0) return;
	return `🔎 ${title}:\n~~~text\n${lines.join("\n")}\n~~~`;
}
function formatExecutionResultTraceBlock(executionTrace) {
	if (!executionTrace?.winnerProvider && !executionTrace?.winnerModel) return;
	return formatKeyValueTraceBlock("Execution Result", [
		["winner", executionTrace.winnerProvider && executionTrace.winnerModel ? `${executionTrace.winnerProvider}/${executionTrace.winnerModel}` : void 0],
		["fallbackUsed", executionTrace.fallbackUsed],
		["attempts", executionTrace.attempts?.length],
		["runner", executionTrace.runner]
	]);
}
function formatFallbackChainTraceBlock(executionTrace) {
	const attempts = executionTrace?.attempts ?? [];
	if (attempts.length <= 1) return;
	return `🔎 Fallback Chain:\n~~~text\n${attempts.map((attempt, index) => [
		`${index + 1}. ${attempt.provider}/${attempt.model}`,
		`   result=${attempt.result}`,
		...attempt.reason ? [`   reason=${attempt.reason}`] : [],
		...attempt.stage ? [`   stage=${attempt.stage}`] : [],
		...typeof attempt.elapsedMs === "number" ? [`   elapsed=${(attempt.elapsedMs / 1e3).toFixed(1)}s`] : [],
		...typeof attempt.status === "number" ? [`   status=${attempt.status}`] : []
	].join("\n")).join("\n\n")}\n~~~`;
}
function toSnakeCase(value) {
	return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "");
}
function resolveMetadataSegmentKey(label) {
	const normalized = toSnakeCase(label);
	if (normalized === "conversation_info") return "conversation_metadata";
	if (normalized === "sender") return "sender_metadata";
	return normalized.endsWith("_metadata") ? normalized : `${normalized}_metadata`;
}
function derivePromptSegments(prompt) {
	const text = prompt ?? "";
	if (!text.trim()) return;
	const lines = text.split("\n");
	const segments = /* @__PURE__ */ new Map();
	let userChars = 0;
	const addChars = (key, chars) => {
		if (!chars || chars <= 0) return;
		segments.set(key, (segments.get(key) ?? 0) + chars);
	};
	let index = 0;
	while (index < lines.length) {
		const line = lines[index] ?? "";
		if (line === "Context:") {
			const tagMatch = (lines[index + 1] ?? "").trim().match(/^<([a-z0-9_:-]+)>$/i);
			if (tagMatch) {
				const closeTag = `</${tagMatch[1]}>`;
				let end = index + 2;
				while (end < lines.length && lines[end]?.trim() !== closeTag) end += 1;
				if (end < lines.length) {
					addChars(expectDefined(tagMatch[1], "tag match capture group 1"), lines.slice(index, end + 1).join("\n").length);
					index = end + 1;
					while (index < lines.length && lines[index] === "") index += 1;
					continue;
				}
			}
		}
		const metadataHeaderLine = line.trim().endsWith("⟦openclaw:ctx⟧") ? line : null;
		if (metadataHeaderLine) {
			const start = index;
			if ((lines[index + 1] ?? "").trim() === "```json") {
				let end = index + 2;
				while (end < lines.length && !(lines[end] ?? "").startsWith("```")) end += 1;
				if (end < lines.length) {
					addChars(resolveMetadataSegmentKey(metadataHeaderLine.trim().slice(0, -14).trim() || "metadata"), lines.slice(start, end + 1).join("\n").length);
					index = end + 1;
					while (index < lines.length && lines[index] === "") index += 1;
					continue;
				}
			}
		}
		if (line.trim()) userChars += line.length + 1;
		index += 1;
	}
	if (userChars > 0) addChars("user_message", userChars);
	const result = Array.from(segments.entries()).map(([key, chars]) => ({
		key,
		chars
	}));
	return result.length > 0 ? result : void 0;
}
function formatPromptSegmentsTraceBlock(segments, totalPromptText) {
	if (!segments?.length && !totalPromptText?.length) return;
	const lines = (segments ?? []).map((segment) => `${segment.key}=${segment.chars.toLocaleString()} chars`);
	if (typeof totalPromptText === "string" && totalPromptText.length > 0) lines.push(`totalPromptText=${totalPromptText.length.toLocaleString()} chars`);
	return lines.length > 0 ? `🔎 Prompt Segments:\n~~~text\n${lines.join("\n")}\n~~~` : void 0;
}
function formatToolSummaryTraceBlock(toolSummary) {
	if (!toolSummary || toolSummary.calls <= 0) return;
	return formatKeyValueTraceBlock("Tool Summary", [
		["calls", toolSummary.calls],
		["tools", toolSummary.tools.length > 0 ? toolSummary.tools.join(", ") : void 0],
		["failures", toolSummary.failures],
		["totalToolTimeMs", toolSummary.totalToolTimeMs]
	]);
}
function formatCompletionTraceBlock(completion) {
	if (!completion) return;
	return formatKeyValueTraceBlock("Completion", [
		["finishReason", completion.finishReason],
		["stopReason", completion.stopReason],
		["refusal", completion.refusal]
	]);
}
function formatContextManagementTraceBlock(contextManagement) {
	if (!contextManagement) return;
	return formatKeyValueTraceBlock("Context Management", [
		["sessionCompactions", contextManagement.sessionCompactions],
		["lastTurnCompactions", contextManagement.lastTurnCompactions],
		["preflightCompactionApplied", contextManagement.preflightCompactionApplied],
		["postCompactionContextInjected", contextManagement.postCompactionContextInjected]
	]);
}
async function accumulateSessionUsageFromTranscript(params) {
	const sessionId = normalizeOptionalString(params.sessionId);
	if (!sessionId) return;
	try {
		const artifactFile = params.sessionFile?.trim();
		const useArtifactFile = Boolean(artifactFile && path.isAbsolute(artifactFile) && artifactFile.endsWith(".jsonl"));
		const usage = await readLatestSessionUsageFromTranscriptAsync({
			agentId: params.agentId,
			sessionId,
			sessionKey: useArtifactFile ? void 0 : params.sessionKey,
			storePath: params.storePath,
			sessionFile: params.sessionFile
		});
		if (!usage) return;
		return {
			input: usage.inputTokens,
			output: usage.outputTokens,
			cacheRead: usage.cacheRead,
			cacheWrite: usage.cacheWrite,
			total: usage.totalTokens
		};
	} catch {
		return;
	}
}
function formatRequestContextTraceBlock(params) {
	const limit = params.contextLimit;
	const used = params.promptTokens;
	if ((typeof limit !== "number" || !Number.isFinite(limit) || limit <= 0) && (typeof used !== "number" || !Number.isFinite(used) || used <= 0) && !params.provider && !params.model) return;
	const headroom = typeof limit === "number" && Number.isFinite(limit) && typeof used === "number" && Number.isFinite(used) ? Math.max(0, limit - used) : void 0;
	const percent = typeof limit === "number" && Number.isFinite(limit) && limit > 0 && typeof used === "number" && Number.isFinite(used) ? Math.round(used / limit * 100) : void 0;
	return `🔎 Context Window (Last Model Request):\n~~~text\n${[
		`provider=${params.provider ?? "n/a"}`,
		`model=${params.model ?? "n/a"}`,
		`used=${typeof used === "number" && Number.isFinite(used) ? `${used.toLocaleString()} tok (${formatTokenCount(used)})` : "n/a"}`,
		`limit=${typeof limit === "number" && Number.isFinite(limit) ? `${limit.toLocaleString()} tok (${formatTokenCount(limit)})` : "n/a"}`,
		`headroom=${typeof headroom === "number" ? `${headroom.toLocaleString()} tok (${formatTokenCount(headroom)})` : "n/a"}`,
		`usage=${typeof percent === "number" ? `${percent}%` : "n/a"}`
	].join("\n")}\n~~~`;
}
function formatSummaryPromptValue(params) {
	const used = params.promptTokens;
	const limit = params.contextLimit;
	if (typeof used !== "number" || !Number.isFinite(used) || used <= 0 || typeof limit !== "number" || !Number.isFinite(limit) || limit <= 0) return;
	return `${formatTokenCount(used)}/${formatTokenCount(limit)}`;
}
function formatRawTraceSummaryLine(params) {
	const thinking = normalizeOptionalString(params.requestShaping?.thinking);
	const fields = [
		params.executionTrace?.winnerModel ? `winner=${params.executionTrace.winnerModel}${thinking ? ` 🧠 ${thinking}` : ""}` : void 0,
		typeof params.executionTrace?.fallbackUsed === "boolean" ? `fallback=${params.executionTrace.fallbackUsed ? "yes" : "no"}` : void 0,
		typeof params.executionTrace?.attempts?.length === "number" ? `attempts=${params.executionTrace.attempts.length.toLocaleString()}` : void 0,
		params.completion?.stopReason ? `stop=${params.completion.stopReason}` : void 0,
		(() => {
			const prompt = formatSummaryPromptValue({
				contextLimit: params.contextLimit,
				promptTokens: params.promptTokens
			});
			return prompt ? `prompt=${prompt}` : void 0;
		})(),
		typeof params.usage?.input === "number" && params.usage.input > 0 ? `⬇️ ${formatTokenCount(params.usage.input)}` : void 0,
		typeof params.usage?.output === "number" && params.usage.output > 0 ? `⬆️ ${formatTokenCount(params.usage.output)}` : void 0,
		typeof params.usage?.cacheRead === "number" && params.usage.cacheRead > 0 ? `♻️ ${formatTokenCount(params.usage.cacheRead)}` : void 0,
		typeof params.usage?.cacheWrite === "number" && params.usage.cacheWrite > 0 ? `🆕 ${formatTokenCount(params.usage.cacheWrite)}` : void 0,
		typeof params.usage?.total === "number" && params.usage.total > 0 ? `🔢 ${formatTokenCount(params.usage.total)}` : void 0,
		typeof params.toolSummary?.calls === "number" && params.toolSummary.calls > 0 ? `tools=${params.toolSummary.calls.toLocaleString()}` : void 0,
		typeof params.contextManagement?.lastTurnCompactions === "number" && params.contextManagement.lastTurnCompactions > 0 ? `compactions=${params.contextManagement.lastTurnCompactions.toLocaleString()}` : void 0
	].filter((value) => Boolean(value));
	return fields.length > 0 ? `Summary: ${fields.join(" ")}` : void 0;
}
function buildInlineRawTracePayload(params) {
	const resolvedPromptTokens = deriveContextPromptTokens({
		lastCallUsage: params.lastCallUsage,
		promptTokens: params.promptTokens,
		usage: params.usage
	});
	const requestContextBlock = formatRequestContextTraceBlock({
		provider: params.provider,
		model: params.model,
		contextLimit: params.contextLimit,
		promptTokens: resolvedPromptTokens
	});
	return { text: [
		...[
			formatUsageTraceBlock("Usage (Session Total)", params.sessionUsage),
			formatUsageTraceBlock("Usage (Last Turn Total)", params.usage),
			requestContextBlock,
			formatExecutionResultTraceBlock(params.executionTrace),
			formatFallbackChainTraceBlock(params.executionTrace),
			formatKeyValueTraceBlock("Request Shaping", [
				["provider", params.provider],
				["model", params.model],
				["auth", params.requestShaping?.authMode],
				["thinking", params.requestShaping?.thinking],
				["reasoning", params.requestShaping?.reasoning],
				["verbose", params.requestShaping?.verbose],
				["trace", params.requestShaping?.trace],
				["fallbackEligible", params.requestShaping?.fallbackEligible],
				["blockStreaming", params.requestShaping?.blockStreaming]
			]),
			formatPromptSegmentsTraceBlock(params.promptSegments, params.rawUserText),
			formatToolSummaryTraceBlock(params.toolSummary),
			formatCompletionTraceBlock(params.completion),
			formatContextManagementTraceBlock(params.contextManagement)
		].filter((value) => Boolean(value)),
		formatRawTraceBlock("Model Input (User Role)", params.rawUserText),
		formatRawTraceBlock("Model Output (Assistant Role)", params.rawAssistantText),
		formatRawTraceSummaryLine({
			executionTrace: params.executionTrace,
			completion: params.completion,
			contextLimit: params.contextLimit,
			promptTokens: resolvedPromptTokens,
			usage: params.usage,
			toolSummary: params.toolSummary,
			contextManagement: params.contextManagement,
			requestShaping: params.requestShaping
		})
	].join("\n\n\n") };
}
//#endregion
//#region src/auto-reply/reply/agent-runner-result-diagnostics.ts
/** Builds the same authorized diagnostic supplement for immediate and queued replies. */
async function buildReplyDiagnosticsPayload(params) {
	const { activeSessionEntry, followupRun, accounting, cfg, storePath, userText, resolvedVerboseLevel, resolvedBlockStreamingBreak, preflightCompactionApplied } = params;
	const { runResult, providerUsed, modelUsed, contextTokensUsed, promptTokens } = accounting;
	const verboseEnabled = (normalizeVerboseLevel(followupRun.run.verboseLevelOverride ?? activeSessionEntry?.verboseLevel ?? resolvedVerboseLevel ?? followupRun.run.verboseLevel) ?? "off") !== "off";
	const traceAuthorized = followupRun.run.traceAuthorized === true;
	const traceLevel = followupRun.run.traceLevelOverride ?? activeSessionEntry?.traceLevel;
	const traceEnabled = traceAuthorized && (traceLevel === "on" || traceLevel === "raw");
	if (!verboseEnabled && !traceEnabled) return;
	let diagnosticsPayload = buildInlinePluginStatusPayload({
		entry: activeSessionEntry,
		includeStatusLines: verboseEnabled,
		includeTraceLines: traceEnabled
	});
	if (traceAuthorized && traceLevel === "raw") {
		const isHookBlockedRun = runResult.meta?.error?.kind === "hook_block";
		const rawUserText = isHookBlockedRun ? runResult.meta?.finalPromptText : runResult.meta?.finalPromptText ?? userText;
		const rawAssistantText = isHookBlockedRun ? void 0 : runResult.meta?.finalAssistantRawText ?? runResult.meta?.finalAssistantVisibleText;
		const executionTrace = runResult.meta?.executionTrace;
		const requestShaping = {
			authMode: runResult.meta?.requestShaping?.authMode ?? (cfg?.models?.providers && providerUsed in cfg.models.providers ? resolveModelAuthMode(providerUsed, cfg, void 0, { workspaceDir: followupRun.run.workspaceDir }) ?? void 0 : void 0),
			thinking: runResult.meta?.requestShaping?.thinking ?? normalizeOptionalString(followupRun.run.thinkLevel),
			reasoning: runResult.meta?.requestShaping?.reasoning ?? normalizeOptionalString(followupRun.run.reasoningLevel),
			verbose: runResult.meta?.requestShaping?.verbose ?? normalizeOptionalString(resolvedVerboseLevel),
			trace: followupRun.run.traceLevelOverride ?? runResult.meta?.requestShaping?.trace ?? normalizeOptionalString(activeSessionEntry?.traceLevel),
			fallbackEligible: runResult.meta?.requestShaping?.fallbackEligible ?? resolveModelFallbackAvailability({
				cfg: cfg ?? {},
				agentId: followupRun.run.agentId,
				sessionKey: followupRun.run.sessionKey,
				hasSessionModelOverride: followupRun.run.hasSessionModelOverride === true,
				modelOverrideSource: followupRun.run.modelOverrideSource,
				hasAutoFallbackProvenance: followupRun.run.hasAutoFallbackProvenance === true,
				modelSelectionLocked: followupRun.run.modelSelectionLocked,
				subagentSpawnLineage: followupRun.run.subagentSpawnLineage
			}).kind === "active",
			blockStreaming: runResult.meta?.requestShaping?.blockStreaming ?? normalizeOptionalString(resolvedBlockStreamingBreak)
		};
		const promptSegments = runResult.meta?.promptSegments ?? derivePromptSegments(rawUserText);
		const toolSummary = runResult.meta?.toolSummary;
		const completion = runResult.meta?.completion ?? (runResult.meta?.stopReason ? {
			stopReason: runResult.meta.stopReason,
			finishReason: runResult.meta.stopReason,
			...runResult.meta.stopReason.toLowerCase().includes("refusal") ? { refusal: true } : {}
		} : void 0);
		const contextManagement = {
			...typeof activeSessionEntry?.compactionCount === "number" ? { sessionCompactions: activeSessionEntry.compactionCount } : {},
			...typeof runResult.meta?.contextManagement?.lastTurnCompactions === "number" ? { lastTurnCompactions: runResult.meta.contextManagement.lastTurnCompactions } : typeof runResult.meta?.agentMeta?.compactionCount === "number" ? { lastTurnCompactions: runResult.meta.agentMeta.compactionCount } : {},
			...runResult.meta?.contextManagement && typeof runResult.meta.contextManagement.preflightCompactionApplied === "boolean" ? { preflightCompactionApplied: runResult.meta.contextManagement.preflightCompactionApplied } : preflightCompactionApplied ? { preflightCompactionApplied } : {},
			...runResult.meta?.contextManagement && typeof runResult.meta.contextManagement.postCompactionContextInjected === "boolean" ? { postCompactionContextInjected: runResult.meta.contextManagement.postCompactionContextInjected } : {}
		};
		const rawTracePayload = buildInlineRawTracePayload({
			rawUserText,
			rawAssistantText,
			sessionUsage: await accumulateSessionUsageFromTranscript({
				agentId: followupRun.run.agentId,
				sessionId: runResult.meta?.agentMeta?.sessionId ?? followupRun.run.sessionId,
				sessionKey: followupRun.run.sessionKey,
				storePath,
				sessionFile: followupRun.run.sessionFile
			}),
			usage: runResult.meta?.agentMeta?.usage,
			lastCallUsage: runResult.meta?.agentMeta?.lastCallUsage,
			provider: providerUsed,
			model: modelUsed,
			contextLimit: contextTokensUsed,
			promptTokens,
			executionTrace,
			requestShaping,
			promptSegments,
			toolSummary,
			completion,
			contextManagement
		});
		diagnosticsPayload = diagnosticsPayload ? { text: `${diagnosticsPayload.text}\n\n${rawTracePayload.text}` } : rawTracePayload;
	}
	return diagnosticsPayload ? {
		...diagnosticsPayload,
		isStatusNotice: true
	} : void 0;
}
//#endregion
//#region src/auto-reply/reply/session-usage.ts
/** Persists usage, cost, and model metadata after reply runs. */
function applyCliSessionClearToSessionPatch(params, entry, patch) {
	const cliProvider = params.providerUsed ?? entry.modelProvider;
	if (!cliProvider) return patch;
	if (params.clearCliSessionBinding === true) {
		const nextEntry = {
			...entry,
			...patch
		};
		clearCliSession(nextEntry, cliProvider);
		return {
			...patch,
			cliSessionIds: nextEntry.cliSessionIds,
			cliSessionBindings: nextEntry.cliSessionBindings,
			claudeCliSessionId: nextEntry.claudeCliSessionId
		};
	}
	return patch;
}
function resolveNonNegativeTokenCount(value) {
	const resolved = asNonNegativeFiniteNumber(value);
	return resolved === void 0 ? void 0 : Math.floor(resolved);
}
function estimateSessionRunCostUsd(params) {
	if (!hasBillableUsage(params.usage)) return;
	return asNonNegativeFiniteNumber(estimateAggregateUsageCost({
		usage: params.usage,
		provider: params.providerUsed,
		model: params.modelUsed,
		config: params.cfg,
		agentDir: params.agentDir
	}));
}
/** Persists usage accounting and selected runtime metadata to the session store. */
async function persistSessionUsageUpdate(params) {
	const { agentId, storePath, sessionKey, sessionStore, authorize } = params;
	if (!storePath || !sessionKey) return;
	const expectedSession = params.expectedSession ? { ...params.expectedSession } : void 0;
	const label = params.logLabel ? `${params.logLabel} ` : "";
	const cfg = params.cfg ?? getRuntimeConfig();
	const agentHarnessId = normalizeOptionalString(params.agentHarnessId);
	const modelSelection = params.runtimeModelSelection ?? {
		provider: params.providerUsed,
		model: params.modelUsed
	};
	const hasUsage = hasNonzeroUsage(params.usage);
	const hasBilling = hasBillableUsage(params.usage);
	const hasPromptTokens = typeof params.promptTokens === "number" && Number.isFinite(params.promptTokens) && params.promptTokens > 0;
	const hasFreshContextSnapshot = Boolean(params.lastCallUsage) && params.lastCallUsage?.contextUsage?.state !== "unavailable" || hasPromptTokens;
	const hasCurrentContextSnapshot = params.currentContextSnapshot !== void 0;
	const currentContextTokens = resolveNonNegativeTokenCount(params.currentContextSnapshot?.tokens);
	const hasContextUpdate = hasUsage || hasFreshContextSnapshot || hasCurrentContextSnapshot || Boolean(modelSelection.model || params.contextTokensUsed);
	if (hasBilling || hasContextUpdate) try {
		await patchSessionEntryCore({
			agentId,
			storePath,
			sessionKey
		}, (entry) => {
			if (!(authorize?.() ?? true) || expectedSession && (entry.sessionId !== expectedSession.sessionId || entry.lifecycleRevision !== expectedSession.lifecycleRevision || Object.hasOwn(expectedSession, "activeWriterRunId") && entry.activeWriterRunId !== expectedSession.activeWriterRunId)) return null;
			const updatedAt = Date.now();
			const preserveSessionModelState = params.isHeartbeat === true || params.preserveRuntimeModel === true || params.preserveUserFacingSessionModelState === true;
			const preserveUserFacingRunState = params.preserveUserFacingSessionModelState === true;
			const resolvedContextTokens = preserveSessionModelState ? entry.contextTokens : params.contextTokensUsed ?? entry.contextTokens;
			const totalTokens = hasCurrentContextSnapshot ? currentContextTokens : hasFreshContextSnapshot ? deriveSessionTotalTokens({
				lastCallUsage: params.lastCallUsage,
				contextTokens: resolvedContextTokens,
				promptTokens: params.promptTokens
			}) : void 0;
			const runEstimatedCostUsd = preserveUserFacingRunState ? void 0 : estimateSessionRunCostUsd({
				cfg,
				agentDir: params.agentDir,
				usage: params.usage,
				providerUsed: params.providerUsed ?? entry.modelProvider,
				modelUsed: params.modelUsed ?? entry.model
			});
			const patch = {
				modelProvider: preserveSessionModelState ? entry.modelProvider : modelSelection.provider ?? entry.modelProvider,
				model: preserveSessionModelState ? entry.model : modelSelection.model ?? entry.model,
				...!preserveSessionModelState ? {
					agentHarnessId,
					contextTokensSource: params.contextTokensSource,
					contextBudgetStatus: params.contextBudgetStatus
				} : {},
				...resolvedContextTokens !== void 0 ? { contextTokens: resolvedContextTokens } : {},
				systemPromptReport: preserveUserFacingRunState ? entry.systemPromptReport : params.systemPromptReport ?? entry.systemPromptReport,
				updatedAt
			};
			if (hasUsage && !preserveUserFacingRunState) {
				patch.inputTokens = params.usage?.input ?? 0;
				patch.outputTokens = params.usage?.output ?? 0;
				const cacheUsage = params.lastCallUsage ?? params.usage;
				patch.cacheRead = cacheUsage?.cacheRead ?? 0;
				patch.cacheWrite = cacheUsage?.cacheWrite ?? 0;
			}
			if (hasBilling && !preserveUserFacingRunState) patch.estimatedCostUsd = runEstimatedCostUsd;
			if (totalTokens !== void 0 && !preserveUserFacingRunState) {
				patch.totalTokens = totalTokens;
				patch.totalTokensFresh = true;
				patch.totalTokensVersion = 1;
				const accountedGoal = resolveSessionGoalDisplayState({
					...entry,
					...patch
				}, updatedAt);
				if (accountedGoal) patch.goal = accountedGoal;
			} else if (!preserveUserFacingRunState && hasContextUpdate && (hasCurrentContextSnapshot || params.preserveFreshTotalTokensOnStaleUsage !== true || entry.totalTokensFresh !== true)) {
				patch.totalTokensFresh = false;
				patch.totalTokensVersion = void 0;
			}
			return preserveUserFacingRunState ? patch : applyCliSessionClearToSessionPatch(params, entry, patch);
		}, {
			skipMaintenance: true,
			...sessionStore ? { onCommitted: (entry) => {
				sessionStore[sessionKey] = entry;
			} } : {},
			...authorize ? { assertCommitAllowed: () => {
				if (!authorize()) throw new Error("session usage accounting authority revoked");
			} } : {}
		});
	} catch (err) {
		logVerbose(`failed to persist ${label}usage update: ${String(err)}`);
	}
}
//#endregion
//#region src/auto-reply/reply/agent-runner-result-accounting.ts
/** Persists only host-bound facts while the exact logical turn still owns accounting. */
async function accountAgentTurnCompaction(params) {
	const operation = params.replyOperation;
	if (!operation) return;
	const authorize = () => replyRunRegistry.get(operation.key) === operation;
	let count;
	for (const fact of params.compaction?.durable ?? []) {
		const persistedCount = await incrementCompactionCount({
			agentId: fact.target.agentId,
			sessionStore: params.sessionStore,
			sessionKey: fact.target.sessionKey,
			storePath: fact.target.storePath,
			expectedSession: fact.target,
			amount: fact.count,
			tokensAfter: fact.currentContextSnapshot?.tokens,
			authorize
		});
		if (persistedCount !== void 0) count = persistedCount;
	}
	return count;
}
async function accountAgentTurn(context) {
	const { activeSessionStore, blockReplyPipeline, cfg, defaultModel, followupRun, isHeartbeat, pendingToolTasks, preflightCompactionApplied, resolvedVerboseLevel, execution, runId, runStartedAt, sessionKey, sessionCtx, shouldInjectGroupIntro, storePath } = context;
	let { activeSessionEntry } = context;
	const latestCompaction = execution.compaction?.durable.at(-1);
	const currentContextSnapshot = execution.compaction ? latestCompaction?.currentContextSnapshot ?? { tokens: void 0 } : void 0;
	const expectedSession = latestCompaction?.target ?? {
		sessionId: activeSessionEntry?.sessionId ?? followupRun.run.sessionId,
		lifecycleRevision: activeSessionEntry?.lifecycleRevision
	};
	const operation = context.replyOperation;
	const authorize = latestCompaction ? () => operation !== void 0 && replyRunRegistry.get(operation.key) === operation : void 0;
	const runResult = execution.result;
	const fallbackProvider = execution.resolved.provider;
	const fallbackModel = execution.resolved.model;
	const fallbackExhausted = execution.fallback.exhausted;
	const fallbackAttempts = execution.fallback.attempts;
	const hasDirectlySentBlockReply = execution.hasDirectlySentBlockReply;
	const directBlockDeliveries = execution.directBlockDeliveries;
	const terminalFailurePayload = execution.terminalFailurePayload;
	const { autoCompactionCount, didLogHeartbeatStrip } = execution;
	if (shouldInjectGroupIntro && activeSessionEntry && activeSessionStore && sessionKey && activeSessionEntry.groupActivationNeedsSystemIntro) {
		const updatedAt = Date.now();
		activeSessionEntry.groupActivationNeedsSystemIntro = false;
		activeSessionEntry.updatedAt = updatedAt;
		activeSessionStore[sessionKey] = activeSessionEntry;
		if (storePath) await updateSessionEntry({
			storePath,
			sessionKey
		}, () => ({
			groupActivationNeedsSystemIntro: false,
			updatedAt
		}), {
			skipMaintenance: true,
			takeCacheOwnership: true
		});
	}
	const payloadArray = runResult.payloads ?? [];
	if (blockReplyPipeline) {
		await blockReplyPipeline.flush({ force: true });
		blockReplyPipeline.stop();
	}
	if (pendingToolTasks.size > 0) await drainPendingToolTasks({
		tasks: pendingToolTasks,
		onTimeout: logVerbose
	});
	const usage = runResult.meta?.agentMeta?.usage;
	const promptTokens = runResult.meta?.agentMeta?.promptTokens;
	const modelUsed = runResult.meta?.agentMeta?.model ?? fallbackModel ?? defaultModel;
	const providerUsed = runResult.meta?.agentMeta?.provider ?? fallbackProvider ?? followupRun.run.provider;
	const runtimeModelSelection = runResult.meta?.agentMeta?.runtimeModelSelection;
	const sessionModel = runtimeModelSelection ?? {
		provider: providerUsed,
		model: modelUsed
	};
	const winnerProvider = fallbackExhausted ? void 0 : runResult.meta?.executionTrace?.winnerProvider ?? providerUsed;
	const winnerModel = fallbackExhausted ? void 0 : runResult.meta?.executionTrace?.winnerModel ?? modelUsed;
	const ctxTokens = runResult.meta?.agentMeta?.contextTokens;
	const compactions = runResult.meta?.agentMeta?.compactionCount;
	const lastCallUsage = runResult.meta?.agentMeta?.lastCallUsage;
	const replyUsageState = buildReplyUsageState({
		config: cfg,
		agentDir: followupRun.run.agentDir,
		provider: providerUsed,
		model: modelUsed,
		fallbackExhausted,
		winnerProvider,
		winnerModel,
		reasoningEffort: typeof followupRun.run.thinkLevel === "string" ? followupRun.run.thinkLevel : void 0,
		fastMode: resolveFastModeState({
			cfg,
			provider: providerUsed ?? "",
			model: modelUsed ?? "",
			agentId: followupRun.run.agentId,
			sessionEntry: activeSessionEntry
		}).enabled,
		fallbackUsed: runResult.meta?.executionTrace?.fallbackUsed === true,
		agentId: followupRun.run.agentId,
		sessionId: followupRun.run.sessionId,
		chatType: typeof sessionCtx.ChatType === "string" ? sessionCtx.ChatType : void 0,
		authMode: runResult.meta?.requestShaping?.authMode ?? void 0,
		overrideSource: activeSessionEntry?.modelOverrideSource ?? void 0,
		requestedProvider: followupRun.run.provider,
		requestedModel: followupRun.run.model,
		durationMs: Date.now() - runStartedAt,
		compactionCount: typeof compactions === "number" ? compactions : void 0,
		contextTokenBudget: typeof ctxTokens === "number" && Number.isFinite(ctxTokens) ? ctxTokens : void 0,
		contextUsedTokens: typeof promptTokens === "number" && Number.isFinite(promptTokens) ? promptTokens : void 0,
		promptTokens,
		usage,
		lastCallUsage
	});
	recordReplyUsageState(runId, replyUsageState);
	const verboseEnabled = resolvedVerboseLevel !== "off";
	const preserveUserFacingSessionState = shouldPreserveUserFacingSessionStateForInputProvenance(followupRun.run.inputProvenance);
	const fallbackStateEntry = activeSessionEntry ?? (sessionKey ? activeSessionStore?.[sessionKey] : void 0);
	const configuredFallbackModel = resolveFallbackOriginModel({
		run: followupRun.run,
		fallbackStateEntry,
		runtimeModelSelection
	});
	const selectedProvider = configuredFallbackModel.provider;
	const selectedModel = configuredFallbackModel.model;
	const fallbackTransition = resolveFallbackTransition({
		selectedProvider,
		selectedModel,
		activeProvider: sessionModel.provider,
		activeModel: sessionModel.model,
		attempts: fallbackAttempts,
		state: fallbackStateEntry,
		cfg
	});
	if (fallbackTransition.stateChanged && !fallbackExhausted && !preserveUserFacingSessionState) {
		const fallbackNotice = fallbackTransition.nextState.selectedModel ? {
			kind: "active",
			selectedModel: fallbackTransition.nextState.selectedModel,
			activeModel: fallbackTransition.nextState.activeModel,
			...fallbackTransition.nextState.reason ? { reason: fallbackTransition.nextState.reason } : {}
		} : void 0;
		if (fallbackStateEntry) {
			fallbackStateEntry.fallbackNotice = fallbackNotice;
			fallbackStateEntry.updatedAt = Date.now();
			activeSessionEntry = fallbackStateEntry;
		}
		if (sessionKey && fallbackStateEntry && activeSessionStore) activeSessionStore[sessionKey] = fallbackStateEntry;
		if (sessionKey && storePath) await updateSessionEntry({
			storePath,
			sessionKey
		}, () => ({ fallbackNotice }), {
			skipMaintenance: true,
			takeCacheOwnership: true
		});
	}
	const runtimeContextTokens = typeof runResult.meta?.agentMeta?.contextTokens === "number" && Number.isFinite(runResult.meta.agentMeta.contextTokens) && runResult.meta.agentMeta.contextTokens > 0 ? Math.floor(runResult.meta.agentMeta.contextTokens) : void 0;
	const resolvedContextTokens = runtimeContextTokens === void 0 ? resolveContextTokensForModel({
		cfg,
		provider: sessionModel.provider,
		model: sessionModel.model,
		allowAsyncLoad: false
	}) : void 0;
	const contextTokensUsed = runtimeContextTokens ?? resolvedContextTokens ?? activeSessionEntry?.contextTokens ?? 2e5;
	const contextTokensSource = runResult.meta?.agentMeta?.contextTokensSource ?? (runtimeContextTokens !== void 0 ? "runtime" : resolvedContextTokens !== void 0 ? "resolved-v1" : void 0);
	const compactionCount = await accountAgentTurnCompaction({
		compaction: execution.compaction,
		sessionStore: activeSessionStore,
		replyOperation: operation
	});
	await persistSessionUsageUpdate({
		agentId: latestCompaction?.target.agentId ?? followupRun.run.agentId,
		sessionStore: activeSessionStore,
		storePath: latestCompaction?.target.storePath ?? storePath,
		sessionKey: latestCompaction?.target.sessionKey ?? sessionKey,
		expectedSession,
		authorize,
		cfg,
		agentDir: followupRun.run.agentDir,
		usage,
		lastCallUsage: runResult.meta?.agentMeta?.lastCallUsage,
		currentContextSnapshot,
		promptTokens,
		isHeartbeat,
		preserveRuntimeModel: fallbackExhausted || fallbackTransition.nextState.selectedModel !== void 0,
		preserveUserFacingSessionModelState: preserveUserFacingSessionState,
		modelUsed,
		providerUsed,
		runtimeModelSelection,
		contextTokensUsed,
		contextTokensSource,
		contextBudgetStatus: compactionCount === void 0 ? runResult.meta?.agentMeta?.contextBudgetStatus : void 0,
		systemPromptReport: runResult.meta?.systemPromptReport,
		preserveFreshTotalTokensOnStaleUsage: preflightCompactionApplied,
		agentHarnessId: runResult.meta?.agentMeta?.agentHarnessId
	});
	if (!isHeartbeat && !preserveUserFacingSessionState && !fallbackExhausted) await consolidateLiveModelSwitchAfterRun({
		cfg,
		sessionKey,
		agentId: followupRun.run.agentId,
		providerUsed: sessionModel.provider,
		modelUsed: sessionModel.model
	});
	if (compactionCount !== void 0 && sessionKey) activeSessionEntry = activeSessionStore?.[sessionKey] ?? activeSessionEntry;
	return {
		activeSessionEntry,
		autoCompactionCount,
		compactionCount,
		expectedSession,
		configuredFallbackModel,
		contextTokensUsed,
		didLogHeartbeatStrip,
		hasDirectlySentBlockReply,
		directBlockDeliveries,
		fallbackAttempts,
		fallbackExhausted,
		fallbackTransition,
		modelUsed,
		payloadArray,
		preserveUserFacingSessionState,
		promptTokens,
		providerUsed,
		replyUsageState,
		runId,
		runResult,
		selectedModel,
		selectedProvider,
		sessionModel,
		terminalFailurePayload,
		usage,
		verboseEnabled
	};
}
/** Applies common accounting plus the queue/session projection owned by follow-up turns. */
async function accountFollowupTurn(params) {
	const { turn, defaults, execution } = params;
	const settled = execution.execution.outcome;
	const sessionKey = turn.session.kind === "session" ? turn.session.key : void 0;
	if (settled.kind !== "settled") {
		await accountAgentTurnCompaction({
			compaction: settled.compaction,
			sessionStore: turn.sessionStore,
			replyOperation: turn.operation
		});
		return;
	}
	const resolvedVerboseLevel = normalizeVerboseLevel(turn.queued.run.verboseLevelOverride ?? turn.session.current()?.verboseLevel ?? turn.queued.run.verboseLevel) ?? "off";
	const accounting = await accountAgentTurn({
		activeSessionEntry: turn.session.current(),
		activeSessionStore: turn.sessionStore,
		blockReplyPipeline: null,
		cfg: turn.config,
		defaultModel: defaults.defaultModel,
		followupRun: turn.queued,
		isHeartbeat: defaults.opts?.isHeartbeat === true,
		pendingToolTasks: execution.pendingToolTasks,
		replyOperation: turn.operation,
		preflightCompactionApplied: turn.preflightCompactionApplied,
		resolvedVerboseLevel,
		execution: settled,
		runId: execution.execution.runId,
		runStartedAt: execution.runStartedAt,
		sessionCtx: execution.sessionCtx,
		sessionKey,
		shouldInjectGroupIntro: false,
		storePath: turn.session.kind === "session" ? turn.session.storePath : void 0
	});
	turn.session.publish(accounting.activeSessionEntry);
	const queueKey = turn.queued.run.sessionKey ?? defaults.sessionKey ?? sessionKey;
	if (queueKey && accounting.fallbackTransition.stateChanged && !accounting.fallbackExhausted && !accounting.preserveUserFacingSessionState) {
		const entry = turn.session.current();
		refreshQueuedFollowupSession({
			key: queueKey,
			previousSessionId: turn.queued.run.sessionId,
			nextSessionId: entry?.sessionId ?? turn.queued.run.sessionId,
			nextSessionFile: queueKey,
			nextProvider: accounting.sessionModel.provider,
			nextModel: accounting.sessionModel.model,
			nextModelOverrideSource: entry?.modelOverrideSource === "default" ? void 0 : entry?.modelOverrideSource,
			nextAuthProfileId: entry?.authProfileOverride,
			nextAuthProfileIdSource: resolveCollapsedSessionAuthPinSource(entry)
		});
	}
	let compactionNotice;
	if (accounting.autoCompactionCount > 0) {
		const previousSessionId = turn.queued.run.sessionId;
		const count = accounting.compactionCount;
		const refreshed = turn.session.current();
		if (refreshed) {
			turn.session.publish(refreshed);
			refreshQueuedFollowupSession({
				key: queueKey ?? "",
				previousSessionId,
				nextSessionId: refreshed.sessionId,
				nextSessionFile: queueKey ?? sessionKey
			});
		}
		if (accounting.verboseEnabled) compactionNotice = { text: `🧹 Auto-compaction complete${typeof count === "number" ? ` (count ${count})` : ""}.` };
	}
	if (turn.queued.run.verboseLevelOverride !== "off" || turn.queued.run.traceAuthorized === true) turn.session.publish(refreshSessionEntryFromStore({
		storePath: turn.session.kind === "session" ? turn.session.storePath : void 0,
		sessionKey,
		fallbackEntry: turn.session.current(),
		expectedGeneration: accounting.expectedSession
	}));
	const diagnosticsPayload = await buildReplyDiagnosticsPayload({
		activeSessionEntry: turn.session.current(),
		followupRun: turn.queued,
		accounting,
		cfg: turn.config,
		storePath: turn.session.kind === "session" ? turn.session.storePath : void 0,
		userText: turn.queued.prompt,
		resolvedVerboseLevel,
		resolvedBlockStreamingBreak: turn.queued.run.blockReplyBreak,
		preflightCompactionApplied: turn.preflightCompactionApplied
	});
	return {
		...accounting,
		compactionNotice,
		diagnosticsPayload
	};
}
//#endregion
//#region src/auto-reply/reply/agent-runner-maintenance.ts
/** The descriptor contains no foreground authority; actual delivery settlement gates its new owner. */
function scheduleReplySessionMaintenance(params) {
	const { context, accounting, sessionEntry } = params;
	const { replyOperation, followupRun, cfg, sessionKey, storePath } = context;
	const meta = accounting.runResult.meta;
	const auth = context.execution.maintenanceAuthProfile;
	if (!sessionEntry || !sessionKey || !storePath || !accounting.providerUsed || !replyOperation.ownerSettlement || !replyOperation.lifecycleGeneration || context.isHeartbeat || accounting.preserveUserFacingSessionState || context.execution.status !== "ok" || accounting.fallbackExhausted || accounting.autoCompactionCount > 0 || meta?.aborted || meta?.yielded || meta?.error || meta?.agentMeta?.agentHarnessId !== "openclaw" || auth === void 0 || cfg.agents?.defaults?.compaction?.enabled === false) return;
	const prepared = {
		cfg,
		sessionKey,
		storePath,
		timeoutMs: followupRun.run.timeoutMs,
		runtimePolicySessionKey: context.runtimePolicySessionKey
	};
	scheduleSessionMaintenance({
		prepared,
		followupRun: createSessionMaintenanceFollowup({
			run: followupRun.run,
			sessionEntry,
			cfg,
			sessionKey,
			runtimePolicySessionKey: context.runtimePolicySessionKey ?? followupRun.run.runtimePolicySessionKey,
			provider: accounting.providerUsed,
			model: accounting.modelUsed,
			auth
		}),
		sessionId: sessionEntry.sessionId,
		lifecycleRevision: sessionEntry.lifecycleRevision,
		lifecycleGeneration: replyOperation.lifecycleGeneration,
		startedAt: replyOperation.startedAtMs,
		agentHarnessId: meta.agentMeta.agentHarnessId,
		compactionRequestBudget: context.execution.compactionRequestBudget
	}, replyOperation.ownerSettlement.then(() => replyOperation.result?.kind === "completed" && !replyOperation.abortSignal.aborted));
}
//#endregion
//#region src/auto-reply/usage-bar/contract.ts
function buildUsageContract(state, surface) {
	const usage = state.usage ?? {};
	const input = usage.input;
	const output = usage.output;
	const cacheRead = usage.cacheRead;
	const cacheWrite = usage.cacheWrite;
	const total = usage.total;
	const hasSplitTokens = input !== void 0 || output !== void 0;
	const hasTotalOnlyTokens = !hasSplitTokens && total !== void 0;
	const hasTokens = hasSplitTokens || cacheRead !== void 0 || cacheWrite !== void 0 || total !== void 0;
	const promptTotal = (cacheRead ?? 0) + (cacheWrite ?? 0) + (input ?? 0);
	const cacheHitPct = promptTotal > 0 ? Math.round((cacheRead ?? 0) / promptTotal * 100) : void 0;
	const last = state.lastUsage;
	const lastPromptTotal = last ? (last.cacheRead ?? 0) + (last.cacheWrite ?? 0) + (last.input ?? 0) : 0;
	const lastCacheHitPct = last && lastPromptTotal > 0 ? Math.round((last.cacheRead ?? 0) / lastPromptTotal * 100) : void 0;
	const maxTokens = state.contextTokenBudget;
	const usedTokens = typeof state.contextUsedTokens === "number" && state.contextUsedTokens > 0 ? state.contextUsedTokens : promptTotal > 0 ? promptTotal : void 0;
	const pctUsed = maxTokens && usedTokens !== void 0 ? Math.round(usedTokens / maxTokens * 100) : void 0;
	const overrideSource = state.overrideSource ?? null;
	const isOverride = typeof state.overrideSource === "string" && state.overrideSource !== "" && state.overrideSource !== "auto";
	return {
		schema: "openclaw.usageLine.v1",
		surface: surface ?? null,
		agentId: state.agentId ?? null,
		chat_type: state.chatType ?? null,
		model: {
			id: state.model ?? null,
			display_name: state.model ?? null,
			provider: state.provider ?? null,
			reasoning: state.reasoningEffort ?? null,
			actual: state.resolvedRef ?? null,
			resolved_ref: state.resolvedRef ?? null,
			requested: state.requested ?? null,
			is_fallback: state.fallbackUsed === true,
			is_override: isOverride,
			override_source: overrideSource,
			auth_mode: state.authMode ?? null
		},
		state: {
			fast_mode: typeof state.fastMode === "boolean" ? state.fastMode : null,
			compactions: typeof state.compactionCount === "number" ? state.compactionCount : null
		},
		usage: {
			input_tokens: input,
			output_tokens: output,
			cache_read_tokens: cacheRead,
			cache_write_tokens: cacheWrite,
			total_tokens: total,
			cache_hit_pct: cacheHitPct,
			has_tokens: hasTokens,
			has_split_tokens: hasSplitTokens,
			has_total_only_tokens: hasTotalOnlyTokens,
			last: last ? {
				input_tokens: last.input,
				output_tokens: last.output,
				cache_read_tokens: last.cacheRead,
				cache_write_tokens: last.cacheWrite,
				total_tokens: last.total,
				cache_hit_pct: lastCacheHitPct
			} : void 0
		},
		context: {
			used_tokens: usedTokens,
			max_tokens: maxTokens,
			pct_used: pctUsed
		},
		cost: {
			turn_usd: typeof state.turnUsd === "number" ? state.turnUsd : null,
			available: typeof state.turnUsd === "number"
		},
		timing: { duration_ms: typeof state.durationMs === "number" ? state.durationMs : null },
		identity: {
			name: state.identity?.name ?? null,
			emoji: state.identity?.emoji ?? null,
			avatar: state.identity?.avatar ?? null
		},
		session: { id: state.sessionId ?? null }
	};
}
//#endregion
//#region src/auto-reply/usage-bar/default-template.ts
const DEFAULT_USAGE_BAR_TEMPLATE = {
	schema: "openclaw.usageBar.v1",
	scales: {
		braille: "⠐⡀⡄⡆⡇⣇⣧⣷⣿",
		block: "░▏▎▍▌▋▊▉█",
		shade: "░▒▓█",
		moon: "🌑🌘🌗🌖🌕",
		level: "▁▂▃▄▅▆▇█",
		weather: [
			"🥶",
			"☁️",
			"🌥",
			"⛅️",
			"🌤",
			"☀️"
		],
		plants: [
			"🪾",
			"🍂",
			"🌱",
			"☘️",
			"🍀",
			"🌿"
		],
		moons6: [
			"🌑",
			"🌚",
			"🌘",
			"🌗",
			"🌖",
			"🌝"
		]
	},
	aliases: {
		models: {
			"claude-opus-4-6": "opus46",
			"claude-opus-4-8": "opus48",
			"claude-sonnet-4-6": "sonnet46",
			"claude-haiku-4-5": "haiku45",
			"gpt-5.5": "gpt5.5"
		},
		reasoning: {
			off: "🌑",
			minimal: "🌚",
			low: "🌘",
			medium: "🌗",
			high: "🌕",
			xhigh: "🌝"
		}
	},
	output: {
		sep: "",
		default: [
			{ text: "{model.provider}{identity.emoji|🤖}{model.display_name|alias:models}" },
			{
				map: "model.is_fallback",
				cases: { true: "🔄" }
			},
			{
				map: "model.is_override",
				cases: { true: "📌" }
			},
			{
				when: "model.reasoning",
				text: "{model.reasoning|alias:reasoning}"
			},
			{
				map: "state.fast_mode",
				cases: {
					true: "⚡️",
					false: "🐌"
				}
			},
			{
				when: "context.max_tokens",
				text: "\xA0| 📚[{context.pct_used|meter:5:braille}]{context.max_tokens|num}"
			},
			{
				when: "cost.turn_usd",
				text: "\xA0💰{cost.turn_usd|fixed:4}"
			}
		],
		surfaces: { discord: [
			{ text: "-# -\n" },
			{ text: "-# {model.provider}{identity.emoji|🤖}{model.display_name|alias:models}" },
			{
				map: "model.is_fallback",
				cases: { true: "🔄" }
			},
			{
				map: "model.is_override",
				cases: { true: "📌" }
			},
			{
				when: "model.reasoning",
				text: "{model.reasoning|alias:reasoning}"
			},
			{
				map: "state.fast_mode",
				cases: {
					true: "⚡️",
					false: "🐌"
				}
			},
			{
				when: "context.max_tokens",
				text: "\xA0| 📚[{context.pct_used|meter:5:braille}]{context.max_tokens|num}"
			},
			{
				when: "cost.turn_usd",
				text: "\xA0💰{cost.turn_usd|fixed:4}"
			}
		] }
	}
};
//#endregion
//#region src/auto-reply/usage-bar/template.ts
const fileCache = /* @__PURE__ */ new Map();
/** Maximum number of template file paths to cache concurrently. */
const MAX_CACHED_TEMPLATE_FILES = 64;
const warnedTemplateOverrides = createDedupeCache({
	maxSize: 256,
	ttlMs: 0
});
const usageTemplateLog = createSubsystemLogger("usage-template");
function expandPath(p) {
	if (!p.startsWith("~")) return resolve(p);
	return resolve(expandHomePrefix(p, { home: homedir() }));
}
function hasPieces(value) {
	return Array.isArray(value) && value.some(isRecord);
}
function hasOutputPieces(output) {
	if (!isRecord(output)) return false;
	if (hasPieces(output.default)) return true;
	const surfaces = output.surfaces;
	return isRecord(surfaces) && Object.values(surfaces).some((surfacePieces) => hasPieces(surfacePieces));
}
function isEmptyTemplate(value) {
	if (!isRecord(value)) return false;
	if (Object.keys(value).length === 0) return true;
	if ("segments" in value && Array.isArray(value.segments)) return value.segments.length === 0;
	const output = value.output;
	return isRecord(output) && !hasOutputPieces(output);
}
function isUsableTemplate(value) {
	if (!isRecord(value)) return false;
	if (hasOutputPieces(value.output) || hasPieces(value.segments)) return true;
	const surfaces = value.surfaces;
	return isRecord(surfaces) && Object.values(surfaces).some((surface) => isRecord(surface) && hasPieces(surface.segments));
}
function getErrorCode(error) {
	if (typeof error !== "object" || error === null || !("code" in error)) return;
	const code = error.code;
	return typeof code === "string" ? code : void 0;
}
function warnInvalidUsageTemplate(source, reason, path) {
	const key = `${source}:${reason}:${path ?? ""}`;
	if (warnedTemplateOverrides.check(key)) return;
	usageTemplateLog.warn("configured usage template could not be used; using built-in footer", {
		source,
		reason,
		...path ? { path } : {}
	});
}
function parseTemplate(value) {
	if (isUsableTemplate(value)) return { template: value };
	return isEmptyTemplate(value) ? {} : { reason: "unsupported-shape" };
}
function readTemplateFile(path) {
	let raw;
	try {
		raw = readFileSync(path, "utf8");
	} catch (error) {
		return getErrorCode(error) === "ENOENT" ? {} : { reason: "unreadable" };
	}
	if (raw.trim().length === 0) return {};
	try {
		return parseTemplate(JSON.parse(raw));
	} catch {
		return { reason: "invalid-json" };
	}
}
function cacheTemplateFile(path) {
	const result = readTemplateFile(path);
	if (result.reason) warnInvalidUsageTemplate("file", result.reason, path);
	if (!fileCache.has(path) && fileCache.size >= MAX_CACHED_TEMPLATE_FILES) {
		const oldestKey = fileCache.keys().next().value;
		if (oldestKey !== void 0) {
			fileCache.get(oldestKey)?.watcher?.close();
			fileCache.delete(oldestKey);
		}
	}
	const entry = { template: result.template };
	if (entry.template) try {
		const watcher = watch(path, { persistent: false }, () => {
			const next = readTemplateFile(path);
			if (next.reason) warnInvalidUsageTemplate("file", next.reason, path);
			entry.template = next.template;
		});
		watcher.on("error", () => {
			watcher.close();
			entry.watcher = void 0;
			entry.template = void 0;
		});
		entry.watcher = watcher;
	} catch {}
	fileCache.set(path, entry);
	return entry.template;
}
function loadUsageBarTemplate(configured) {
	if (!configured) return DEFAULT_USAGE_BAR_TEMPLATE;
	if (typeof configured === "object") {
		const result = parseTemplate(configured);
		if (result.reason) warnInvalidUsageTemplate("inline", result.reason);
		return result.template ?? DEFAULT_USAGE_BAR_TEMPLATE;
	}
	const path = expandPath(configured);
	const cached = fileCache.get(path);
	return (cached ? cached.template ?? (cached.watcher ? void 0 : cacheTemplateFile(path)) : cacheTemplateFile(path)) ?? DEFAULT_USAGE_BAR_TEMPLATE;
}
function clearUsageBarTemplateCacheForTest() {
	for (const entry of fileCache.values()) entry.watcher?.close();
	fileCache.clear();
	warnedTemplateOverrides.clear();
}
if (process.env.VITEST || false) globalThis[Symbol.for("openclaw.usageBarTemplateTestApi")] = { clearUsageBarTemplateCacheForTest };
//#endregion
//#region src/auto-reply/usage-bar/translator.ts
function toGlyphs(scale) {
	if (Array.isArray(scale)) return scale.filter((g) => typeof g === "string");
	if (typeof scale === "string") return Array.from(scale);
	return [];
}
function coerceFiniteValue(value) {
	if (value === null || value === void 0 || value === "") return;
	return asFiniteNumber(Number(value));
}
function num(value) {
	const n = coerceFiniteValue(value);
	if (n === void 0) return "";
	if (Math.abs(n) >= 1e3) {
		const v = n / 1e3;
		return Math.abs(v) < 10 ? `${v.toFixed(1)}k` : `${Math.round(v)}k`;
	}
	return String(Math.trunc(n));
}
function fixed(value, digits) {
	const n = coerceFiniteValue(value);
	return n === void 0 ? "" : n.toFixed(digits);
}
function dur(value) {
	const raw = coerceFiniteValue(value);
	if (raw === void 0) return "";
	const s = Math.max(0, Math.trunc(raw));
	if (s >= 86400) return `${(s / 86400).toFixed(1)}d`;
	if (s >= 3600) {
		const m = Math.floor(s % 3600 / 60);
		return `${Math.floor(s / 3600)}h${String(m).padStart(2, "0")}m`;
	}
	return `${Math.floor(s / 60)}m`;
}
function pct(value) {
	const n = coerceFiniteValue(value);
	return n === void 0 ? "" : `${Math.round(n)}%`;
}
function inv(value) {
	const n = coerceFiniteValue(value);
	return n === void 0 ? value : 100 - Math.max(0, Math.min(100, n));
}
function norm(value) {
	const n = Number(value);
	if (value === null || value === void 0 || !Number.isFinite(n)) return 0;
	return Math.max(0, Math.min(100, n)) / 100;
}
function meter(value, width, scale) {
	const glyphs = toGlyphs(scale);
	if (glyphs.length < 2 || width < 1) return "";
	const empty = expectDefined(glyphs[0], "glyphs entry at 0");
	const full = expectDefined(glyphs[glyphs.length - 1], "glyphs entry at glyphs.length 1");
	const total = norm(value) * width;
	const fullc = Math.trunc(total);
	const cells = [];
	for (let i = 0; i < Math.min(fullc, width); i++) cells.push(full);
	if (cells.length < width) cells.push(expectDefined(glyphs[Math.round((total - fullc) * (glyphs.length - 1))], "glyphs entry at math.round((total fullc) * (glyphs.length 1))"));
	while (cells.length < width) cells.push(empty);
	return cells.slice(0, width).join("");
}
const VERB_NAMES = /* @__PURE__ */ new Set([
	"num",
	"fixed",
	"dur",
	"pct",
	"inv",
	"alias",
	"meter"
]);
function parseBoundedIntegerArg(raw, options) {
	const value = raw === void 0 ? options.defaultValue : parseStrictInteger(raw);
	return asSafeIntegerInRange(value, options);
}
function applyVerb(name, args, value, vocab) {
	switch (name) {
		case "num": return num(value);
		case "fixed": {
			const digits = parseBoundedIntegerArg(args[0], {
				defaultValue: 2,
				min: 0,
				max: 100
			});
			return digits === void 0 ? "" : fixed(value, digits);
		}
		case "dur": return dur(value);
		case "pct": return pct(value);
		case "inv": return inv(value);
		case "alias": {
			const aliases = isRecord(vocab["_aliases"]) ? vocab["_aliases"] : {};
			const table = args[0] && isRecord(aliases[args[0]]) ? aliases[args[0]] : {};
			const key = String(value);
			if (Object.hasOwn(table, key)) return table[key];
			const lower = key.toLowerCase();
			return Object.hasOwn(table, lower) ? table[lower] : value;
		}
		case "meter": {
			const width = parseBoundedIntegerArg(args[0]?.trim() ? args[0] : void 0, {
				defaultValue: 5,
				min: 1,
				max: 100
			});
			const scale = args.length > 1 ? vocab[expectDefined(args[1], "args entry at 1")] : void 0;
			return width === void 0 ? "" : meter(value, width, scale);
		}
		default: return String(value);
	}
}
function getPath(ctx, path) {
	let cur = ctx;
	for (const part of path.split(".")) {
		if (!isRecord(cur)) return;
		cur = cur[part];
		if (cur === null || cur === void 0) return;
	}
	return cur;
}
const TOKEN = /\{([^}]+)\}/g;
function interp(text, ctx, vocab) {
	return text.replace(TOKEN, (_match, body) => {
		const parts = body.split("|");
		let val = getPath(ctx, (parts[0] ?? "").trim());
		const ops = [];
		let fallback;
		for (const segRaw of parts.slice(1)) {
			const seg = segRaw.trim();
			const name = expectDefined(seg.split(":")[0], "seg.split(\":\") entry at 0");
			if (VERB_NAMES.has(name)) ops.push({
				name,
				args: seg.split(":").slice(1)
			});
			else fallback = seg;
		}
		if (val === null || val === void 0 || val === "") return fallback ?? "";
		for (const op of ops) val = applyVerb(op.name, op.args, val, vocab);
		return String(val);
	});
}
function renderSegment(seg, ctx, vocab) {
	if ("when" in seg) {
		const v = getPath(ctx, String(seg.when));
		if (v === null || v === void 0 || v === false || v === "") return null;
	}
	if ("map" in seg) {
		const v = getPath(ctx, String(seg.map));
		const key = typeof v === "boolean" ? String(v) : String(v);
		const cases = isRecord(seg.cases) ? seg.cases : {};
		const hit = Object.hasOwn(cases, key) ? cases[key] : cases["_default"];
		return typeof hit === "string" ? hit : null;
	}
	if ("each" in seg) {
		const arr = getPath(ctx, String(seg.each));
		const items = Array.isArray(arr) ? arr : [];
		const itemTpl = typeof seg.item === "string" ? seg.item : "";
		const names = Array.isArray(seg.item_scales) ? seg.item_scales : void 0;
		const parts = [];
		items.forEach((el, i) => {
			let iv = vocab;
			if (names && names.length > 0) iv = {
				...vocab,
				"*": vocab[expectDefined(names[Math.min(i, names.length - 1)], "names entry at math.min(i, names.length 1)")]
			};
			const r = interp(itemTpl, el, iv);
			if (r) parts.push(r);
		});
		const join = typeof seg.join === "string" ? seg.join : " ";
		const body = parts.join(join);
		if (!body) return null;
		const prefix = typeof seg.text === "string" ? seg.text : "";
		return prefix ? `${prefix} ${body}` : body;
	}
	if ("text" in seg) return interp(String(seg.text), ctx, vocab) || null;
	return null;
}
function resolveLayout(template, surface) {
	const output = template.output;
	if (isRecord(output)) {
		const surfaces = isRecord(output.surfaces) ? output.surfaces : {};
		let pieces = typeof surface === "string" ? surfaces[surface] : void 0;
		if (pieces === void 0) pieces = output.default;
		return {
			sep: typeof output.sep === "string" ? output.sep : "",
			pieces: Array.isArray(pieces) ? pieces : []
		};
	}
	const ov = typeof surface === "string" && isRecord(template.surfaces) && isRecord(template.surfaces[surface]) ? template.surfaces[surface] : {};
	return {
		sep: typeof ov.sep === "string" ? ov.sep : typeof template.sep === "string" ? template.sep : " ",
		pieces: Array.isArray(ov.segments) ? ov.segments : Array.isArray(template.segments) ? template.segments : []
	};
}
function renderUsageBar(template, contract) {
	try {
		const { sep, pieces } = resolveLayout(template, contract.surface);
		const vocab = {
			...isRecord(template.ramps) ? template.ramps : {},
			...isRecord(template.series) ? template.series : {},
			...isRecord(template.scales) ? template.scales : {}
		};
		vocab["_aliases"] = isRecord(template.aliases) ? template.aliases : {};
		const out = [];
		for (const piece of pieces) if (isRecord(piece)) {
			const r = renderSegment(piece, contract, vocab);
			if (r) out.push(r);
		}
		return out.join(sep);
	} catch {
		return "";
	}
}
//#endregion
//#region src/auto-reply/reply/agent-runner-usage-line.ts
const formatResponseUsageLine = (params) => {
	const usage = params.usage;
	if (!usage) return null;
	const input = usage.input;
	const output = usage.output;
	const hasSplitTokens = typeof input === "number" || typeof output === "number";
	const inputLabel = typeof input === "number" ? formatTokenCount(input) : "?";
	const outputLabel = typeof output === "number" ? formatTokenCount(output) : "?";
	const totalLabel = !hasSplitTokens && typeof usage.total === "number" ? `${formatTokenCount(usage.total)} total` : void 0;
	const cacheRead = typeof usage.cacheRead === "number" ? usage.cacheRead : void 0;
	const cacheWrite = typeof usage.cacheWrite === "number" ? usage.cacheWrite : void 0;
	const canPriceUsage = usage.cost !== void 0 || typeof input === "number" && typeof output === "number";
	const cost = params.showCost && canPriceUsage ? estimateAggregateUsageCost(params) : void 0;
	const costLabel = params.showCost ? formatUsd(cost) : void 0;
	const cacheSuffix = typeof cacheRead === "number" && cacheRead > 0 || typeof cacheWrite === "number" && cacheWrite > 0 ? ` · cache ${formatTokenCount(cacheRead ?? 0)} cached / ${formatTokenCount(cacheWrite ?? 0)} new` : "";
	if (!hasSplitTokens && !totalLabel && !cacheSuffix && !costLabel) return null;
	const suffix = costLabel ? ` · est ${costLabel}` : "";
	return `Usage: ${totalLabel ?? `${inputLabel} in / ${outputLabel} out`}${cacheSuffix}${suffix}`;
};
const resolveResponseUsageLine = (params) => {
	const responseUsageMode = resolveEffectiveResponseUsage(params.sessionRaw, params.config.messages?.responseUsage, params.channel);
	const showCost = responseUsageMode === "full";
	const hasUsage = showCost ? hasBillableUsage(params.usage) : hasNonzeroUsage(params.usage);
	if (responseUsageMode === "off" || !hasUsage || params.preserveUserFacingSessionState === true) return;
	const formatted = formatResponseUsageLine({
		usage: params.usage,
		showCost,
		provider: params.provider,
		model: params.model,
		config: params.config,
		agentDir: params.agentDir,
		allowPluginNormalization: false
	});
	const usageTemplate = responseUsageMode === "full" && params.replyUsageState ? loadUsageBarTemplate(params.config.messages?.usageTemplate) : void 0;
	const rendered = usageTemplate && params.replyUsageState ? renderUsageBar(usageTemplate, buildUsageContract(params.replyUsageState, params.channel)) : void 0;
	if (rendered) return rendered;
	return formatted ?? void 0;
};
const appendUsageLine = (payloads, line) => {
	let index = -1;
	for (let i = payloads.length - 1; i >= 0; i -= 1) if (payloads[i]?.text) {
		index = i;
		break;
	}
	if (index === -1) return [...payloads, {
		text: line,
		isStatusNotice: true
	}];
	const existing = expectDefined(payloads[index], "payloads entry at index");
	const existingText = existing.text ?? "";
	const separator = existingText.endsWith("\n") ? "" : "\n";
	const next = {
		...existing,
		text: `${existingText}${separator}${line}`
	};
	const metadata = getReplyPayloadMetadata(existing);
	const nextWithMetadata = metadata ? setReplyPayloadMetadata(next, {
		...metadata,
		...metadata.sourceReplyTranscriptMirror ? { sourceReplyTranscriptMirror: {
			...metadata.sourceReplyTranscriptMirror,
			text: next.text
		} } : {}
	}) : next;
	const updated = payloads.slice();
	updated[index] = nextWithMetadata;
	return updated;
};
//#endregion
//#region src/auto-reply/reply/stranded-reply-recovery.ts
const STRANDED_REPLY_RETRY_MARKER = "stranded-reply-retry";
const STRANDED_REPLY_DELIVERY_FAILURE_TEXT = "I generated a reply but could not deliver it to this chat. Please try again.";
function buildStrandedReplyDeliveryFailurePayload() {
	return markReplyPayloadForSourceSuppressionDelivery({
		text: STRANDED_REPLY_DELIVERY_FAILURE_TEXT,
		isError: true,
		isStatusNotice: true
	});
}
/** Resolve the one allowed recovery action for a final that missed source delivery. */
function resolveStrandedReplyRecovery(params) {
	if (!shouldClassifyPrivateMessageToolFinal(params) || params.payloads.some((payload) => isReplyPayloadTerminalContent(payload) && getReplyPayloadMetadata(payload)?.deliverDespiteSourceReplySuppression === true)) return { kind: "none" };
	const classification = classifyPrivateMessageToolFinal(params);
	if (params.base.strandedReplyRetry === true) return {
		kind: "diagnostic",
		payload: buildStrandedReplyDeliveryFailurePayload(),
		warn: classification === "substantive"
	};
	if (classification !== "substantive") return { kind: "none" };
	return {
		kind: "retry",
		run: buildStrandedReplyRetryFollowupRun(params.base, {
			finalText: params.finalText,
			sourceReplyDeliveryMode: params.sourceReplyDeliveryMode
		})
	};
}
function buildStrandedReplyRetryPrompt(finalText) {
	return formatSystemTurnPrompt(`Your previous reply was not delivered to the conversation because you did not call message(action=send). Your reply text was:

"${finalText}"\n\nPlease deliver this reply now by calling message(action=send). Do not add any extra commentary; just deliver the original reply.`);
}
/** Build the one-shot recovery followup that re-prompts message(action=send). */
function buildStrandedReplyRetryFollowupRun(base, params) {
	return {
		...base,
		prompt: buildStrandedReplyRetryPrompt(params.finalText),
		summaryLine: STRANDED_REPLY_RETRY_MARKER,
		strandedReplyRetry: true,
		disableCollectBatching: true,
		toolsAllow: isRuntimeToolAllowed("message", base.toolsAllow) ? ["message"] : [],
		transcriptPrompt: void 0,
		userTurnTranscriptRecorder: void 0,
		currentInboundContext: void 0,
		turnAdoptionLifecycle: void 0,
		replyOperationRunStates: void 0,
		run: {
			...base.run,
			sourceReplyDeliveryMode: params.sourceReplyDeliveryMode,
			suppressNextUserMessagePersistence: true
		}
	};
}
//#endregion
//#region src/auto-reply/reply/agent-runner-result-complete.ts
async function completeReplyAgentRun(input) {
	const { context, accounting, prepared } = input;
	const { activeIsNewSession, activeSessionStore, cfg, followupRun, isHeartbeat, opts, preflightCompactionApplied, queueKey, resolvedBlockStreamingBreak, resolvedQueue, resolvedVerboseLevel, returnWithQueuedFollowupDrain, runFollowupTurn, runtimePolicySessionKey, sessionCtx, sessionKey, storePath } = context;
	const { autoCompactionCount, runResult, verboseEnabled } = accounting;
	const { completedSourceReplyDelivery, guardedReplyPayloads, responseUsageLine } = prepared;
	let { activeSessionEntry } = prepared;
	let finalPayloads = guardedReplyPayloads;
	const prefixNotices = [];
	if (verboseEnabled && activeIsNewSession) prefixNotices.push({ text: `🧭 New session: ${followupRun.run.sessionId}` });
	if (autoCompactionCount > 0) {
		const previousSessionId = accounting.expectedSession.sessionId;
		const count = accounting.compactionCount;
		const refreshedSessionEntry = sessionKey && activeSessionStore ? activeSessionStore[sessionKey] : void 0;
		if (refreshedSessionEntry) {
			activeSessionEntry = refreshedSessionEntry;
			refreshQueuedFollowupSession({
				key: queueKey,
				previousSessionId,
				nextSessionId: refreshedSessionEntry.sessionId,
				nextSessionFile: queueKey
			});
		}
		if (sessionKey) {
			const contextContent = await readPostCompactionContext(followupRun.run.workspaceDir, {
				cfg,
				agentId: followupRun.run.agentId
			});
			if (contextContent) enqueueSystemEvent(contextContent, withSystemEventOwner({ sessionKey }, followupRun.run.agentId));
		}
		if (verboseEnabled) {
			const suffix = typeof count === "number" ? ` (count ${count})` : "";
			prefixNotices.push({ text: `🧹 Auto-compaction complete${suffix}.` });
		}
	}
	const prefixPayloads = [...prefixNotices];
	const trailingPluginStatusPayload = await buildReplyDiagnosticsPayload({
		activeSessionEntry,
		followupRun,
		accounting,
		cfg,
		storePath,
		userText: sessionCtx.commandText || sessionCtx.agentText,
		resolvedVerboseLevel,
		resolvedBlockStreamingBreak,
		preflightCompactionApplied
	});
	const isHookBlockedRun = runResult.meta?.error?.kind === "hook_block";
	const rawAssistantText = isHookBlockedRun ? void 0 : runResult.meta?.finalAssistantRawText ?? runResult.meta?.finalAssistantVisibleText;
	if (prefixPayloads.length > 0) finalPayloads = [...prefixPayloads, ...finalPayloads];
	if (trailingPluginStatusPayload) finalPayloads = [...finalPayloads, trailingPluginStatusPayload];
	if (responseUsageLine) finalPayloads = appendUsageLine(finalPayloads, responseUsageLine);
	if (isHookBlockedRun) finalPayloads = markBeforeAgentRunBlockedPayloads(finalPayloads);
	const isStrandedReplyRetryRun = followupRun.strandedReplyRetry === true;
	if (sessionKey && storePath && (finalPayloads.length > 0 || isStrandedReplyRetryRun)) {
		const sourceReplyPolicy = resolveSourceReplyPolicy({
			cfg,
			sessionCtx,
			sessionEntry: activeSessionEntry,
			sessionKey,
			runtimePolicySessionKey,
			opts
		});
		const assistantFinalText = normalizeAssistantFinalDeliveryText(typeof runResult.meta?.finalAssistantVisibleText === "string" ? runResult.meta.finalAssistantVisibleText : rawAssistantText ?? "");
		const recovery = resolveStrandedReplyRecovery({
			base: followupRun,
			payloads: finalPayloads,
			finalText: assistantFinalText,
			sourceReplyDeliveryMode: sourceReplyPolicy.sourceReplyDeliveryMode,
			sendPolicyDenied: sourceReplyPolicy.sendPolicyDenied,
			successfulSourceReplyDelivery: completedSourceReplyDelivery,
			isHeartbeat,
			isRoomEvent: sessionCtx.InboundEventKind === "room_event"
		});
		if (recovery.kind === "retry" || recovery.kind === "diagnostic" && recovery.warn) warnPrivateMessageToolFinal({
			sessionKey,
			channel: sessionCtx.OriginatingChannel ?? sessionCtx.Surface ?? sessionCtx.Provider ?? sessionDeliveryChannel(activeSessionEntry),
			finalTextLength: assistantFinalText.trim().length
		});
		if (recovery.kind === "diagnostic") finalPayloads = [...finalPayloads, recovery.payload];
		else if (recovery.kind === "retry") {
			if (!enqueueFollowupRun(queueKey, recovery.run, resolvedQueue, "none", runFollowupTurn, false, { position: "front" })) finalPayloads = [...finalPayloads, buildStrandedReplyDeliveryFailurePayload()];
		}
		const recoverablePendingFinalText = buildRecoverablePendingFinalDeliveryText(normalizePendingFinalRecoveryPayloads(finalPayloads));
		const pendingText = sourceReplyPolicy.suppressDelivery ? "" : recoverablePendingFinalText ?? "";
		const heartbeatAckMaxChars = 300;
		const resolvedPendingText = isHeartbeat ? (() => {
			const stripped = stripHeartbeatToken(pendingText, {
				mode: "heartbeat",
				maxAckChars: heartbeatAckMaxChars
			});
			return stripped.shouldSkip ? "" : stripped.text || pendingText;
		})() : pendingText;
		const sendableFinalPayloads = sourceReplyPolicy.suppressDelivery ? [] : finalPayloads.filter((payload) => normalizePendingFinalDeliveryPayloads([payload]).length > 0);
		if (sendableFinalPayloads.length > 0) {
			const pendingFinalDeliveryIntentId = crypto.randomUUID();
			const expectedSessionId = activeSessionEntry?.sessionId ?? followupRun.run.sessionId;
			const pendingFinalDeliveries = sendableFinalPayloads.map((payload) => {
				const deliveryId = crypto.randomUUID();
				setReplyPayloadMetadata(payload, { pendingFinalDeliveryCompletion: {
					agentId: followupRun.run.agentId,
					deliveryId,
					intentId: pendingFinalDeliveryIntentId,
					...activeSessionEntry?.restartRecoveryDeliveryRunId ? { recoveryRunId: activeSessionEntry.restartRecoveryDeliveryRunId } : {},
					sessionId: expectedSessionId,
					sessionKey,
					storePath
				} });
				return {
					id: deliveryId,
					state: "prepared"
				};
			});
			const pendingFinalDeliveryContext = resolveReplyRunDeliveryContext({
				cfg,
				sessionCtx,
				sessionEntry: activeSessionEntry,
				sessionKey,
				runtimePolicySessionKey,
				opts
			});
			const persistedPendingFinalDelivery = await updateSessionEntry({
				agentId: followupRun.run.agentId,
				storePath,
				sessionKey
			}, (entry) => entry.sessionId === expectedSessionId ? {
				pendingFinalDelivery: {
					...resolvedPendingText ? {
						kind: "replayable",
						text: resolvedPendingText
					} : { kind: "transport-only" },
					intentId: pendingFinalDeliveryIntentId,
					deliveries: pendingFinalDeliveries,
					context: pendingFinalDeliveryContext,
					createdAt: Date.now()
				},
				updatedAt: Date.now()
			} : null, {
				skipMaintenance: true,
				takeCacheOwnership: true
			});
			if (persistedPendingFinalDelivery?.sessionId !== expectedSessionId || persistedPendingFinalDelivery.pendingFinalDelivery?.intentId !== pendingFinalDeliveryIntentId) throw new Error("pending final delivery session changed or was deleted");
		}
	}
	const result = returnWithQueuedFollowupDrain(finalPayloads.length === 1 ? finalPayloads[0] : finalPayloads);
	scheduleReplySessionMaintenance({
		context,
		accounting,
		sessionEntry: activeSessionEntry
	});
	return result;
}
//#endregion
//#region src/auto-reply/reply/agent-runner-helpers.ts
/** Helper predicates and gates used while streaming agent-runner payloads. */
const hasAudioMedia = (urls) => Boolean(urls?.some((url) => isAudioFileName(url)));
/** Returns true when a payload carries audio media. */
const isAudioPayload = (payload) => hasAudioMedia(resolveSendableOutboundReplyParts(payload).mediaUrls);
const VERBOSE_GATE_SESSION_REFRESH_MS = 250;
function readCurrentVerboseLevel(params) {
	if (!params.sessionKey || !params.storePath) return;
	try {
		const entry = loadSessionEntryReadOnly({
			storePath: params.storePath,
			sessionKey: params.sessionKey,
			clone: false
		});
		return typeof entry?.verboseLevel === "string" ? normalizeVerboseLevel(entry.verboseLevel) : void 0;
	} catch {
		return;
	}
}
function createCurrentVerboseLevelResolver(params) {
	let cachedLevel;
	let cachedAtMs = Number.NEGATIVE_INFINITY;
	return () => {
		if (!params.sessionKey || !params.storePath) return;
		const now = Date.now();
		if (now - cachedAtMs < VERBOSE_GATE_SESSION_REFRESH_MS) return cachedLevel;
		cachedLevel = readCurrentVerboseLevel(params);
		cachedAtMs = now;
		return cachedLevel;
	};
}
function createVerboseGate(params, shouldEmit) {
	const resolveCurrentVerboseLevel = createCurrentVerboseLevelResolver(params);
	return () => shouldEmit(params.verboseLevelOverride ?? resolveCurrentVerboseLevel() ?? params.resolvedVerboseLevel);
}
/** Creates the visibility gate for tool result summaries. */
const createShouldEmitToolResult = (params) => createVerboseGate(params, (level) => level !== "off");
/** Creates the visibility gate for command/tool output streams. */
const createShouldEmitToolOutput = (params) => createVerboseGate(params, (level) => level === "full");
/** Sends typing signals for visible text payloads when typing is enabled. */
const signalTypingIfNeeded = async (payloads, typingSignals) => {
	if (payloads.some((payload) => hasOutboundReplyContent(payload, { trimText: true }))) await typingSignals.signalRunStart();
};
//#endregion
//#region src/auto-reply/reply/reply-payloads-base.ts
function resolveReplyThreadingForPayload(params) {
	const payload = normalizeOptionalString(params.payload.replyToId) ? setReplyPayloadMetadata(copyReplyPayloadMetadata(params.payload, { ...params.payload }), { replyToIdExplicit: true }) : params.payload;
	const implicitReplyToId = normalizeOptionalString(params.implicitReplyToId);
	const currentMessageId = normalizeOptionalString(params.currentMessageId);
	const allowImplicitReplyToCurrentMessage = resolveImplicitCurrentMessageReplyAllowance(params.replyToMode, params.replyThreading);
	let resolved = payload.replyToId || payload.replyToCurrent === false || !implicitReplyToId || !allowImplicitReplyToCurrentMessage ? payload : copyReplyPayloadMetadata(payload, {
		...payload,
		replyToId: implicitReplyToId
	});
	if (typeof resolved.text === "string" && resolved.text.includes("[[")) {
		const tags = parseInlineDirectives(resolved.text, {
			currentMessageId,
			stripAudioTag: false
		});
		resolved = copyReplyPayloadMetadata(resolved, {
			...resolved,
			text: tags.text ? tags.text : void 0,
			replyToId: tags.replyToId ?? resolved.replyToId,
			replyToTag: tags.hasReplyTag || resolved.replyToTag,
			replyToCurrent: tags.replyToCurrent || resolved.replyToCurrent
		});
	}
	if (resolved.replyToCurrent && !resolved.replyToId && currentMessageId) resolved = copyReplyPayloadMetadata(resolved, {
		...resolved,
		replyToId: currentMessageId
	});
	return resolved;
}
/** Applies inline reply tags to a single payload. */
function applyReplyTagsToPayload(payload, currentMessageId) {
	return resolveReplyThreadingForPayload({
		payload,
		currentMessageId
	});
}
/** Resolves reply targets and filters empty payloads before channel delivery. */
function resolveReplyThreadingPayloads(params) {
	const { payloads, replyToMode, currentMessageId, replyThreading } = params;
	const implicitReplyToId = normalizeOptionalString(currentMessageId);
	return payloads.map((payload) => resolveReplyThreadingForPayload({
		payload,
		replyToMode,
		implicitReplyToId,
		currentMessageId,
		replyThreading
	})).filter(isRenderablePayload);
}
/** Applies threading policy and filters empty payloads before channel delivery. */
function applyReplyThreading(params) {
	const applyReplyToMode = createReplyToModeFilterForChannel(params.replyToMode, params.replyToChannel);
	return resolveReplyThreadingPayloads(params).map(applyReplyToMode);
}
//#endregion
//#region src/auto-reply/reply/agent-runner-payloads.ts
/** Builds final reply payloads after sanitization, media normalization, and dedupe. */
const replyPayloadsDedupeRuntimeLoader = createLazyImportLoader(() => import("./reply-payloads-dedupe.runtime.js"));
async function normalizeReplyPayloadMedia(params) {
	if (!params.normalizeMediaPaths || !resolveSendableOutboundReplyParts(params.payload).hasMedia) return params.payload;
	const normalized = await params.normalizeMediaPaths(params.payload);
	return copyReplyPayloadMetadata(params.payload, normalized);
}
async function normalizeSentMediaUrlsForDedupe(params) {
	if (params.sentMediaUrls.length === 0 || !params.normalizeMediaPaths) return [...params.sentMediaUrls];
	const normalizedUrls = [];
	const seen = /* @__PURE__ */ new Set();
	for (const raw of params.sentMediaUrls) {
		const trimmed = raw.trim();
		if (!trimmed) continue;
		if (!seen.has(trimmed)) {
			seen.add(trimmed);
			normalizedUrls.push(trimmed);
		}
		try {
			const normalized = await params.normalizeMediaPaths({
				mediaUrl: trimmed,
				mediaUrls: [trimmed]
			});
			const normalizedMediaUrls = resolveSendableOutboundReplyParts(normalized).mediaUrls;
			for (const mediaUrl of normalizedMediaUrls) {
				const candidate = mediaUrl.trim();
				if (!candidate || seen.has(candidate)) continue;
				seen.add(candidate);
				normalizedUrls.push(candidate);
			}
		} catch (err) {
			logVerbose(`messaging tool sent-media normalization failed: ${String(err)}`);
		}
	}
	return normalizedUrls;
}
function shouldKeepPayloadDuringSilentTurn(payload) {
	if (payload.isError || getReplyPayloadMetadata(payload)?.deliverDespiteSourceReplySuppression) return true;
	return payload.audioAsVoice === true && resolveSendableOutboundReplyParts(payload).hasMedia;
}
function sanitizeFinalReplyText(payload, text, conversationContext) {
	if (!text) return text;
	return payload.isError ? renderUserFacingText(text, {
		errorContext: true,
		conversationContext
	}) : sanitizeUserFacingText(text, { conversationContext });
}
function sanitizeHeartbeatPayload(payload, conversationContext) {
	const text = payload.text;
	if (!text) return payload;
	const withoutLegacyBlocks = stripLegacyBracketToolCallBlocks(text);
	const cleaned = sanitizeFinalReplyText(payload, withoutLegacyBlocks, conversationContext);
	if (cleaned === text) return payload;
	if (withoutLegacyBlocks !== text) logVerbose("Stripped legacy tool-call block from heartbeat reply");
	return copyPayloadWithSanitizedText(payload, cleaned, conversationContext);
}
function copyPayloadWithSanitizedText(payload, text, conversationContext) {
	const sanitizedText = sanitizeFinalReplyText(payload, text, conversationContext);
	const next = copyReplyPayloadMetadata(payload, {
		...payload,
		text: sanitizedText
	});
	const mirror = getReplyPayloadMetadata(payload)?.sourceReplyTranscriptMirror;
	if (!mirror?.text) return next;
	setReplyPayloadMetadata(next, { sourceReplyTranscriptMirror: {
		...mirror,
		text: sanitizeFinalReplyText(payload, mirror.text, conversationContext) || void 0
	} });
	return next;
}
/** Builds final outbound payloads from agent output and message-tool delivery evidence. */
async function buildReplyPayloads(params) {
	let didLogHeartbeatStrip = params.didLogHeartbeatStrip;
	const sanitizedPayloads = [];
	if (params.isHeartbeat) for (const payload of params.payloads) sanitizedPayloads.push(sanitizeHeartbeatPayload(payload, params.conversationContext));
	else for (const payload of params.payloads) {
		let text = payload.text;
		if (payload.isError && text && isBunFetchSocketError(text)) text = formatBunFetchSocketError(text);
		if (!text || !text.includes("HEARTBEAT_OK")) {
			sanitizedPayloads.push(copyPayloadWithSanitizedText(payload, text, params.conversationContext));
			continue;
		}
		const stripped = stripHeartbeatToken(text, { mode: "message" });
		if (stripped.didStrip && !didLogHeartbeatStrip) {
			didLogHeartbeatStrip = true;
			logVerbose("Stripped stray HEARTBEAT_OK token from reply");
		}
		const hasMedia = resolveSendableOutboundReplyParts(payload).hasMedia;
		if (stripped.shouldSkip && !hasMedia) continue;
		sanitizedPayloads.push(copyPayloadWithSanitizedText(payload, stripped.text, params.conversationContext));
	}
	const messageProvider = resolveOriginMessageProvider({
		originatingChannel: params.originatingChannel,
		provider: params.messageProvider
	});
	const accountId = params.accountId;
	const replyDelivery = createReplyDeliveryContext(params.replyToMode, params.originatingChatType);
	const replyDeliverySource = messageProvider ? {
		channel: messageProvider,
		...accountId ? { accountId } : {}
	} : void 0;
	const resolveThreading = params.applyReplyToMode ? resolveReplyThreadingPayloads : applyReplyThreading;
	const replyTaggedPayloads = (await Promise.all(resolveThreading({
		payloads: sanitizedPayloads,
		replyToMode: params.replyToMode,
		replyToChannel: params.replyToChannel,
		currentMessageId: params.currentMessageId,
		replyThreading: params.replyThreading
	}).map(async (payload) => {
		const parsed = normalizeReplyPayloadDirectives({
			payload,
			currentMessageId: params.currentMessageId,
			silentToken: SILENT_REPLY_TOKEN,
			parseMode: "always",
			extractMarkdownImages: params.extractMarkdownImages
		});
		const mediaNormalizedPayload = await normalizeReplyPayloadMedia({
			payload: parsed.payload,
			normalizeMediaPaths: params.normalizeMediaPaths
		});
		if (parsed.isSilent) mediaNormalizedPayload.text = void 0;
		return setReplyPayloadMetadata(mediaNormalizedPayload, {
			replyDelivery,
			...replyDeliverySource ? { replyDeliverySource } : {}
		});
	}))).filter(isRenderablePayload);
	const silentFilteredPayloads = params.silentExpected ? replyTaggedPayloads.filter(shouldKeepPayloadDuringSilentTurn) : replyTaggedPayloads;
	const threadedPayloads = params.applyReplyToMode ? silentFilteredPayloads.map(params.applyReplyToMode) : silentFilteredPayloads;
	const shouldDropFinalPayloads = params.blockStreamingEnabled && Boolean(params.blockReplyPipeline?.didStream()) && !params.blockReplyPipeline?.isAborted();
	const messagingToolSentTexts = params.messagingToolSentTexts ?? [];
	const messagingToolSentTargets = params.messagingToolSentTargets ?? [];
	const shouldCheckMessagingToolDedupe = messagingToolSentTexts.length > 0 || (params.messagingToolSentMediaUrls?.length ?? 0) > 0 || messagingToolSentTargets.length > 0;
	let dedupedPayloads = threadedPayloads;
	if (shouldCheckMessagingToolDedupe) {
		const dedupeRuntime = await replyPayloadsDedupeRuntimeLoader.load();
		const originatingTo = params.originatingTo;
		dedupedPayloads = [];
		for (const payload of threadedPayloads) {
			if (getReplyPayloadMetadata(payload)?.sourceReplyTranscriptMirror) {
				dedupedPayloads.push(payload);
				continue;
			}
			dedupedPayloads.push(...await dedupeRuntime.filterMessagingToolReplyPayload({
				payload,
				config: params.config,
				messageProvider,
				messagingToolSentTargets,
				originatingTo,
				originatingThreadId: params.originatingThreadId,
				accountId,
				sentMediaUrls: params.messagingToolSentMediaUrls,
				sentTexts: messagingToolSentTexts,
				onDeliveredTerminalDuplicate: params.onDeliveredTerminalDuplicate,
				normalizeSentMediaUrls: (sentMediaUrls) => normalizeSentMediaUrlsForDedupe({
					sentMediaUrls,
					normalizeMediaPaths: params.normalizeMediaPaths
				})
			}));
		}
	}
	const retryBlockedDirectPayloads = (params.directBlockDeliveries ?? []).filter((delivery) => delivery.pending || !shouldRetryReplyDispatch(delivery.outcome)).map((delivery) => delivery.payload);
	for (const payload of dedupedPayloads) {
		const assistantMessageIndex = getReplyPayloadMetadata(payload)?.assistantMessageIndex;
		const direct = (params.directBlockDeliveries ?? []).filter((delivery) => isReplyPayloadTerminalContent(delivery.payload) && getReplyPayloadMetadata(delivery.payload)?.assistantMessageIndex === assistantMessageIndex);
		const directSources = direct.some((delivery) => delivery.source?.complete === false) && direct.map((delivery) => delivery.payload.text ?? "").join("").trim() === payload.text?.trim() ? Array.from(new Set(direct.flatMap((delivery) => delivery.source ?? []))) : void 0;
		const sources = params.blockReplyPipeline?.getSourceRecovery?.(payload) ?? directSources;
		if (sources) setReplyPayloadMetadata(payload, { blockReplySources: sources });
	}
	const directTextFragmentsByAssistantMessage = /* @__PURE__ */ new Map();
	for (const sentPayload of retryBlockedDirectPayloads) {
		if (!isReplyPayloadTerminalContent(sentPayload)) continue;
		const sentText = sentPayload.text ?? resolveSendableOutboundReplyParts(sentPayload).trimmedText;
		if (!sentText) continue;
		const assistantMessageIndex = getReplyPayloadMetadata(sentPayload)?.assistantMessageIndex;
		const fragments = directTextFragmentsByAssistantMessage.get(assistantMessageIndex);
		if (fragments) fragments.push(sentText);
		else directTextFragmentsByAssistantMessage.set(assistantMessageIndex, [sentText]);
	}
	const isDirectBlockRetryBlocked = (payload) => {
		if (getReplyPayloadMetadata(payload)?.blockReplySources) return false;
		const contentKey = createBlockReplyContentKey(payload);
		const assistantMessageIndex = getReplyPayloadMetadata(payload)?.assistantMessageIndex;
		return retryBlockedDirectPayloads.some((sentPayload) => isReplyPayloadTerminalContent(sentPayload) && (assistantMessageIndex === void 0 || getReplyPayloadMetadata(sentPayload)?.assistantMessageIndex === assistantMessageIndex) && createBlockReplyContentKey(sentPayload) === contentKey);
	};
	const isDirectTextRetryBlocked = (payload) => {
		if (isDirectBlockRetryBlocked(payload)) return true;
		const text = resolveSendableOutboundReplyParts(payload).trimmedText;
		if (!text || !retryBlockedDirectPayloads.length) return false;
		const normalizedText = text.trim();
		const assistantMessageIndex = getReplyPayloadMetadata(payload)?.assistantMessageIndex;
		const applicableFragments = directTextFragmentsByAssistantMessage.get(assistantMessageIndex);
		return applicableFragments ? applicableFragments.join("").trim() === normalizedText : false;
	};
	const preserveUnsentMediaAfterBlockSend = (payload) => {
		if (payload.isError || payload.isFallbackNotice || getReplyPayloadMetadata(payload)?.blockReplySources) return payload;
		if (params.blockReplyPipeline?.isFinalPayloadRetryBlocked?.(payload)) return null;
		const reply = resolveSendableOutboundReplyParts(payload);
		if (!reply.hasMedia) {
			if (hasOutboundReplyContent({
				...payload,
				text: void 0,
				mediaUrl: void 0,
				mediaUrls: void 0
			}, { trimText: true }) ? params.blockReplyPipeline?.hasSentExactPayload?.(payload) : params.blockReplyPipeline?.hasSentPayload(payload) || isDirectTextRetryBlocked(payload)) return null;
			return payload;
		}
		if (!reply.trimmedText) return payload;
		const textOnlyPayload = copyReplyPayloadMetadata(payload, {
			...payload,
			mediaUrl: void 0,
			mediaUrls: void 0,
			audioAsVoice: void 0
		});
		if (!(params.blockReplyPipeline?.hasSentPayload(textOnlyPayload) || params.blockReplyPipeline?.isFinalPayloadRetryBlocked?.(copyReplyPayloadMetadata(payload, { text: payload.text })) ? true : isDirectTextRetryBlocked(textOnlyPayload))) return payload;
		return copyReplyPayloadMetadata(payload, {
			...payload,
			text: void 0,
			audioAsVoice: payload.audioAsVoice || void 0
		});
	};
	const contentSuppressedPayloads = shouldDropFinalPayloads ? dedupedPayloads.flatMap((payload) => preserveUnsentMediaAfterBlockSend(payload) ?? []) : params.blockStreamingEnabled ? dedupedPayloads.flatMap((payload) => params.blockReplyPipeline?.hasSentPayload(payload) || isDirectBlockRetryBlocked(payload) ? [] : preserveUnsentMediaAfterBlockSend(payload) ?? []) : retryBlockedDirectPayloads.length > 0 ? dedupedPayloads.flatMap((payload) => isDirectBlockRetryBlocked(payload) ? [] : preserveUnsentMediaAfterBlockSend(payload) ?? []) : dedupedPayloads;
	const blockMediaUrlsToOmit = await normalizeSentMediaUrlsForDedupe({
		sentMediaUrls: [
			...params.blockStreamingEnabled ? params.blockReplyPipeline?.getSentMediaUrls() ?? [] : [],
			...params.blockReplyPipeline?.getRetryBlockedMediaUrls?.() ?? [],
			...retryBlockedDirectPayloads.flatMap((payload) => resolveSendableOutboundReplyParts(payload).mediaUrls)
		],
		normalizeMediaPaths: params.normalizeMediaPaths
	});
	return {
		replyPayloads: (blockMediaUrlsToOmit.length > 0 ? (await replyPayloadsDedupeRuntimeLoader.load()).filterMessagingToolMediaDuplicates({
			payloads: contentSuppressedPayloads,
			sentMediaUrls: blockMediaUrlsToOmit
		}) : contentSuppressedPayloads).filter(isRenderablePayload),
		didLogHeartbeatStrip
	};
}
//#endregion
//#region src/auto-reply/reply/agent-runner-reminder-guard.ts
/** Detects reminder commitments that were not backed by scheduled cron jobs. */
const UNSCHEDULED_REMINDER_NOTE = "Note: I did not schedule a reminder in this turn, so this will not trigger automatically.";
const REMINDER_COMMITMENT_PATTERNS = [
	/\b(?:i\s*['’]?ll|i will)\s+(?:make sure to\s+)?(?:remind|ping|follow up|follow-up|check (?:back|on)|circle back)\b/i,
	/\b(?:i\s*['’]?ll|i will)\s+(?:make sure to\s+)?remember\s+to\s+(?:(?:remind|ping|follow up|follow-up|check (?:back|on)|circle back)\b|(?:set|create|schedule)\s+(?:a\s+)?reminder\b)/i,
	/\b(?:i\s*['’]?ll|i will)\s+(?:make sure to\s+)?remember\b[^.!?]{0,160}?(?:\s+and(?:\s+then)?|,\s*(?:(?:and\s+)?then)?)\s+(?:(?:i\s*['’]?ll|i will|will)\s+)?(?:make sure to\s+)?(?:remind|ping|follow up|follow-up|check (?:back|on)|circle back|(?:set|create|schedule)\s+(?:a\s+)?reminder)\b/i,
	/\b(?:i\s*['’]?ll|i will)\s+(?:set|create|schedule)\s+(?:a\s+)?reminder\b/i
];
/** Returns true when text promises a reminder/follow-up without the guard note. */
function hasUnbackedReminderCommitment(text) {
	const normalized = normalizeLowercaseStringOrEmpty(text);
	if (!normalized.trim()) return false;
	if (normalized.includes(normalizeLowercaseStringOrEmpty(UNSCHEDULED_REMINDER_NOTE))) return false;
	return REMINDER_COMMITMENT_PATTERNS.some((pattern) => pattern.test(text));
}
/**
* Returns true when the cron store has at least one enabled job that shares the
* current session key. Used to suppress the "no reminder scheduled" guard note
* when an existing cron (created in a prior turn) already covers the commitment.
*/
async function hasSessionRelatedCronJobs(params) {
	try {
		const storePath = resolveCronJobsStorePath(params.cronStorePath);
		const store = await loadCronJobsStore(storePath);
		if (store.jobs.length === 0) return false;
		if (params.sessionKey) return store.jobs.some((job) => job.enabled && job.sessionKey === params.sessionKey);
		return false;
	} catch {
		return false;
	}
}
/** Appends the unscheduled-reminder note to the first payload that needs it. */
function appendUnscheduledReminderNote(payloads) {
	let appended = false;
	return payloads.map((payload) => {
		if (appended || payload.isError || typeof payload.text !== "string") return payload;
		if (!hasUnbackedReminderCommitment(payload.text)) return payload;
		appended = true;
		const trimmed = payload.text.trimEnd();
		return copyReplyPayloadMetadata(payload, {
			...payload,
			text: `${trimmed}\n\n${UNSCHEDULED_REMINDER_NOTE}`
		});
	});
}
//#endregion
//#region src/gateway/mcp-app-channel-action.ts
/** Mint one short-lived launch action only after the final reply route is known. */
function materializeMcpAppChannelPresentation(params) {
	const origin = getTailscalePublishedOrigin();
	if (!origin) return;
	const runtime = peekSessionMcpRuntime({ sessionKey: params.sessionKey });
	if (!runtime || runtime.mcpAppsEnabled !== true) return;
	const nowMs = params.nowMs ?? Date.now();
	const view = getMcpAppViewLease(params.view.viewId, runtime);
	if (!view || view.expiresAtMs <= nowMs) return;
	const ticket = createMcpAppStandaloneTicket({
		sessionKey: params.sessionKey,
		view,
		toolOperationsAuthorized: true,
		nowMs
	});
	if (!ticket) return;
	return { blocks: [{
		type: "buttons",
		buttons: [{
			label: "Open app",
			action: {
				type: "web-app",
				url: new URL(ticket.url, origin.origin).href
			}
		}]
	}] };
}
//#endregion
//#region src/auto-reply/reply/mcp-app-channel-action.ts
function isEligibleTerminalPayload$1(payload) {
	return Boolean(payload.text?.trim() && payload.isError !== true && isReplyPayloadTerminalContent(payload));
}
/** Attach one late-minted portable action to the final visible channel reply. */
function attachMcpAppChannelAction(params) {
	if (!params.channel || params.channel === "webchat" || !params.sessionKey || !params.view) return params.payloads;
	const index = params.payloads.findLastIndex(isEligibleTerminalPayload$1);
	if (index < 0) return params.payloads;
	const presentation = materializeMcpAppChannelPresentation({
		sessionKey: params.sessionKey,
		view: params.view
	});
	if (!presentation) return params.payloads;
	const payloads = params.payloads.slice();
	const payload = payloads[index];
	payloads[index] = {
		...payload,
		presentation: payload.presentation ? {
			...payload.presentation,
			blocks: [...payload.presentation.blocks, ...presentation.blocks]
		} : presentation
	};
	return payloads;
}
//#endregion
//#region src/auto-reply/reply/mcp-connect-channel-action.ts
function isEligibleTerminalPayload(payload) {
	return Boolean(payload.text?.trim() && payload.isError !== true && isReplyPayloadTerminalContent(payload));
}
function attachMcpConnectChannelAction(params) {
	if (!params.action) return params.payloads;
	const index = params.payloads.findLastIndex(isEligibleTerminalPayload);
	if (index < 0) return params.payloads;
	const block = {
		type: "buttons",
		buttons: [{
			label: `Connect ${params.action.serverName}`,
			action: {
				type: "url",
				url: params.action.authorizationUrl
			}
		}]
	};
	const payloads = params.payloads.slice();
	const payload = payloads[index];
	payloads[index] = {
		...payload,
		presentation: payload.presentation ? {
			...payload.presentation,
			blocks: [...payload.presentation.blocks, block]
		} : { blocks: [block] }
	};
	return payloads;
}
//#endregion
//#region src/auto-reply/reply/waiting-status.ts
function buildWaitingStatusPayload(params) {
	if (params.completion.expectation !== "required" || params.completion.outcome !== "pending" || !params.yielded && !params.continuationPending || params.hasVisibleMessageDelivery) return;
	return setReplyPayloadMetadata({ text: params.yieldAcknowledgment?.trim() || "I’m continuing this work and will send the result when it is ready." }, {
		deliverDespiteSourceReplySuppression: true,
		continuationStatus: true
	});
}
//#endregion
//#region src/auto-reply/reply/agent-runner-result-payloads.ts
async function prepareReplyAgentPayloads(state) {
	const { context, accounting } = state;
	const { activeSessionStore, blockReplyPipeline, blockStreamingEnabled, cfg, followupRun, isHeartbeat, opts, replyMediaContext, replyOperation, replyRouteThreadId, replyThreadingOverride, replyToChannel, replyToMode, returnWithQueuedFollowupDrain, runStartedAt, runtimePolicySessionKey, sessionCtx, sessionKey, storePath, typingSignals } = context;
	const { configuredFallbackModel, contextTokensUsed, hasDirectlySentBlockReply, directBlockDeliveries, fallbackAttempts, fallbackExhausted, fallbackTransition, modelUsed, payloadArray, preserveUserFacingSessionState, promptTokens, providerUsed, replyUsageState, runId, runResult, selectedModel, selectedProvider, sessionModel, terminalFailurePayload, usage } = accounting;
	let { activeSessionEntry, didLogHeartbeatStrip } = accounting;
	const terminalReplyExpectation = followupRun.run.terminalReplyExpectation ?? resolveSourceReplyExpectation({
		ctx: {
			...sessionCtx,
			InboundEventKind: followupRun.currentInboundEventKind,
			InputProvenance: followupRun.run.inputProvenance
		},
		cfg,
		isHeartbeat
	});
	const blocked = runResult.meta?.error?.kind === "hook_block" || runResult.didSendDeterministicApprovalPrompt === true;
	const replyOperationRunState = resolveReplyOperationRunState(opts);
	const implicitContinuation = runResult.meta?.continuationPending === true;
	const pendingContinuation = runResult.meta?.yielded === true || implicitContinuation || (runResult.meta?.pendingToolCalls?.length ?? 0) > 0;
	if (pendingContinuation && !implicitContinuation) opts?.onPendingContinuation?.();
	const successfulSourceReplyDelivery = hasSuccessfulSourceReplyDelivery({
		blockReplyPipeline,
		hasDirectlySentBlockReply,
		messagingToolSentTexts: runResult.messagingToolSentTexts,
		messagingToolSentMediaUrls: runResult.messagingToolSentMediaUrls,
		messagingToolSentTargets: runResult.messagingToolSentTargets
	});
	const committedMessagingToolSourceReplyDelivery = hasCommittedSourceReplyDeliveryEvidence(runResult);
	const completedSourceReplyDelivery = hasCompletedSourceReplyDeliveryEvidence(runResult);
	const hasLegacyMessagingToolEvidence = runResult.sourceReplyDeliveryState === void 0 && resolveExplicitFinalSourceReplyDeliveryEvidence(runResult) === void 0;
	const visibleOutboundDelivery = hasVisibleOutboundDeliveryEvidence(runResult);
	const successfulSideEffectDelivery = successfulSourceReplyDelivery || committedMessagingToolSourceReplyDelivery || visibleOutboundDelivery || runResult.didSendDeterministicApprovalPrompt === true;
	const sourceReplyDelivery = resolveSourceReplyDelivery(runResult, await resolveTerminalReplyDelivery({
		blockReplyPipeline,
		directBlockDeliveries,
		resolveReplyDelivery: opts?.resolveReplyDelivery,
		sourceReplyDeliveryState: runResult.sourceReplyDeliveryState
	}));
	let completion = resolveReplyCompletion(terminalReplyExpectation, blocked ? "blocked" : sourceReplyDelivery !== "missing" ? sourceReplyDelivery : pendingContinuation ? "pending" : "empty");
	if (replyOperationRunState) replyOperationRunState.replyCompletion = completion;
	const onDeliveredTerminalDuplicate = hasLegacyMessagingToolEvidence ? () => {
		if (completion.outcome !== "blocked") {
			completion = resolveReplyCompletion(terminalReplyExpectation, "delivered");
			if (replyOperationRunState) replyOperationRunState.replyCompletion = completion;
		}
	} : void 0;
	const shouldDeliverTerminalFailure = Boolean(terminalFailurePayload && completion.outcome !== "delivered" && completion.outcome !== "pending" && completion.outcome !== "blocked");
	const fallbackFailureKnown = fallbackAttempts.length > 0 || configuredFallbackModel.persistedAutoFallback;
	const hasSpecificFallbackFailure = fallbackTransition.fallbackActive && fallbackFailureKnown;
	const waitingStatusPayload = terminalFailurePayload ? void 0 : buildWaitingStatusPayload({
		completion,
		yielded: runResult.meta?.yielded === true,
		continuationPending: implicitContinuation,
		yieldAcknowledgment: runResult.meta?.yieldAcknowledgment,
		hasVisibleMessageDelivery: successfulSourceReplyDelivery || committedMessagingToolSourceReplyDelivery || runResult.didSendDeterministicApprovalPrompt === true
	});
	const emptyInteractiveReplyPayload = terminalFailurePayload ? void 0 : buildEmptyInteractiveReplyPayload({ completion });
	const buildStrandedRetryMissingDeliveryDiagnostic = () => {
		if (!sessionKey || !storePath || followupRun.strandedReplyRetry !== true) return;
		if (sessionCtx.InboundEventKind === "room_event" || completedSourceReplyDelivery) return;
		const sourceReplyPolicy = resolveSourceReplyPolicy({
			cfg,
			sessionCtx,
			sessionEntry: activeSessionEntry,
			sessionKey,
			runtimePolicySessionKey,
			opts
		});
		const recovery = resolveStrandedReplyRecovery({
			base: followupRun,
			payloads: [],
			finalText: "",
			sourceReplyDeliveryMode: sourceReplyPolicy.sourceReplyDeliveryMode,
			sendPolicyDenied: sourceReplyPolicy.sendPolicyDenied,
			successfulSourceReplyDelivery: completedSourceReplyDelivery,
			isHeartbeat,
			isRoomEvent: false
		});
		return recovery.kind === "diagnostic" ? recovery.payload : void 0;
	};
	if (sourceReplyDelivery === "delivered") await opts?.onObservedReplyDelivery?.();
	const currentMessageId = sessionCtx.MessageSidFull ?? sessionCtx.MessageSid;
	const applyDeliveredReplyToMode = createReplyToModeFilterForChannel(replyToMode, replyToChannel);
	const isGeneratedToolWarning = (payload) => getReplyPayloadMetadata(payload)?.toolErrorWarning !== void 0;
	const applyFinalReplyToMode = (payload) => {
		const isDisabledReasoningLane = payload.isReasoning === true && opts?.reasoningPayloadsEnabled !== true;
		const isDisabledCommentaryLane = payload.isCommentary === true && opts?.commentaryPayloadsEnabled !== true;
		const isFilteredPayload = normalizeReplyPayload(payload, { applyChannelTransforms: false }) === null;
		const shouldDeferToolWarning = waitingStatusPayload && isGeneratedToolWarning(payload);
		return isDisabledReasoningLane || isDisabledCommentaryLane || isFilteredPayload || shouldDeferToolWarning ? payload : applyDeliveredReplyToMode(payload);
	};
	const buildFinalPayloads = (payloads) => buildReplyPayloads({
		config: cfg,
		payloads,
		conversationContext: sessionCtx.agentText ?? sessionCtx.BodyForAgent,
		isHeartbeat,
		didLogHeartbeatStrip,
		silentExpected: followupRun.run.silentExpected,
		blockStreamingEnabled,
		blockReplyPipeline,
		directBlockDeliveries,
		replyToMode,
		replyToChannel,
		currentMessageId,
		replyThreading: replyThreadingOverride ?? sessionCtx.ReplyThreading,
		applyReplyToMode: applyFinalReplyToMode,
		messageProvider: followupRun.run.messageProvider,
		messagingToolSentTexts: runResult.messagingToolSentTexts,
		messagingToolSentMediaUrls: runResult.messagingToolSentMediaUrls,
		messagingToolSentTargets: runResult.messagingToolSentTargets,
		onDeliveredTerminalDuplicate,
		originatingChannel: sessionCtx.OriginatingChannel,
		originatingChatType: sessionCtx.ChatType,
		originatingTo: sessionCtx.OriginatingTo ?? sessionCtx.To,
		originatingThreadId: replyRouteThreadId,
		accountId: sessionCtx.AccountId,
		normalizeMediaPaths: replyMediaContext.normalizePayload
	});
	const returnPreparedFallbackPayload = async (payload) => {
		const result = await buildFinalPayloads([payload]);
		didLogHeartbeatStrip = result.didLogHeartbeatStrip;
		const preparedPayload = result.replyPayloads[0];
		if (!preparedPayload) return;
		await signalTypingIfNeeded([preparedPayload], typingSignals);
		return returnWithQueuedFollowupDrain(preparedPayload);
	};
	const returnSilentFallbackFailureIfNeeded = async () => {
		const silentFallbackFailurePayload = buildSilentFallbackFailurePayload({
			fallbackTransition,
			fallbackFailureKnown,
			fallbackAttempts,
			cfg,
			completion
		});
		if (!silentFallbackFailurePayload) return;
		replyOperation.fail("run_failed", /* @__PURE__ */ new Error(`configured model backend ${fallbackTransition.selectedModelRef} failed and fallback ${fallbackTransition.activeModelRef} produced no visible reply`));
		opts?.onAgentRunTerminalOutcome?.("failed");
		return returnPreparedFallbackPayload(silentFallbackFailurePayload);
	};
	const finishEmptyReply = async () => {
		if (completion.outcome === "silent" || completion.outcome === "blocked") opts?.onDeliberateSilentTerminalReply?.();
		return {
			kind: "return",
			value: await returnSilentFallbackFailureIfNeeded() ?? returnWithQueuedFollowupDrain(buildStrandedRetryMissingDeliveryDiagnostic())
		};
	};
	const providerPolicyRetry = runResult.meta?.executionTrace?.providerPolicyRetry;
	const successfulProviderPolicyRetry = followupRun.currentInboundEventKind !== "room_event" && !isSyntheticSourceReplyTurn({
		inputProvenance: followupRun.run.inputProvenance,
		isHeartbeat
	}) && context.execution.status === "ok" && runResult.meta?.aborted !== true && providerPolicyRetry?.category === "cyber" ? providerPolicyRetry : void 0;
	const providerPolicyRetrySucceeded = successfulProviderPolicyRetry !== void 0;
	const fallbackNoticeChanged = !fallbackExhausted && !preserveUserFacingSessionState && (fallbackTransition.fallbackTransitioned || fallbackTransition.fallbackCleared);
	const fallbackNoticeChatType = fallbackNoticeChanged && !providerPolicyRetrySucceeded ? normalizeChatType(sessionCtx.ChatType) : void 0;
	const shouldDeliverFallbackNotice = fallbackNoticeChatType !== "group" && fallbackNoticeChatType !== "channel";
	let fallbackNoticeText = successfulProviderPolicyRetry ? buildProviderPolicyRetryNotice({
		provider: successfulProviderPolicyRetry.provider,
		model: successfulProviderPolicyRetry.model,
		cfg
	}) : null;
	if (fallbackNoticeChanged && fallbackTransition.fallbackTransitioned) {
		emitAgentEvent({
			runId,
			sessionKey,
			stream: "lifecycle",
			data: {
				phase: "fallback",
				selectedProvider,
				selectedModel,
				activeProvider: sessionModel.provider,
				activeModel: sessionModel.model,
				reasonSummary: fallbackTransition.reasonSummary,
				attemptSummaries: fallbackTransition.attemptSummaries,
				attempts: fallbackAttempts
			}
		});
		if (shouldDeliverFallbackNotice && !providerPolicyRetrySucceeded) fallbackNoticeText = buildFallbackNotice({
			selectedProvider,
			selectedModel,
			activeProvider: sessionModel.provider,
			activeModel: sessionModel.model,
			attempts: fallbackAttempts,
			cfg
		});
	}
	if (fallbackNoticeChanged && fallbackTransition.fallbackCleared) {
		emitAgentEvent({
			runId,
			sessionKey,
			stream: "lifecycle",
			data: {
				phase: "fallback_cleared",
				selectedProvider,
				selectedModel,
				activeProvider: sessionModel.provider,
				activeModel: sessionModel.model,
				previousActiveModel: fallbackTransition.previousState.activeModel
			}
		});
		if (shouldDeliverFallbackNotice && !providerPolicyRetrySucceeded) fallbackNoticeText = buildFallbackClearedNotice({
			selectedProvider,
			selectedModel,
			previousActiveModel: fallbackTransition.previousState.activeModel
		});
	}
	const fallbackNoticePayloads = fallbackNoticeText ? [markReplyPayloadForSourceSuppressionDelivery({
		text: fallbackNoticeText,
		isFallbackNotice: true
	})] : [];
	if (payloadArray.length === 0 && fallbackNoticePayloads.length === 0 && !shouldDeliverTerminalFailure && !waitingStatusPayload && (!emptyInteractiveReplyPayload || hasSpecificFallbackFailure)) return finishEmptyReply();
	const payloadResult = await buildFinalPayloads((fallbackNoticePayloads.length > 0 ? [...fallbackNoticePayloads, ...payloadArray] : payloadArray).filter((payload) => (payload.isReasoning !== true || opts?.reasoningPayloadsEnabled === true) && (payload.isCommentary !== true || opts?.commentaryPayloadsEnabled === true)));
	if (sourceReplyDelivery !== "delivered" && completion.outcome === "delivered") await opts?.onObservedReplyDelivery?.();
	let { replyPayloads } = payloadResult;
	didLogHeartbeatStrip = payloadResult.didLogHeartbeatStrip;
	const replyPayloadsWithoutToolWarnings = waitingStatusPayload ? replyPayloads.filter((payload) => !isGeneratedToolWarning(payload)) : replyPayloads;
	const hasTerminalReply = completion.outcome === "delivered" || replyPayloadsWithoutToolWarnings.some((payload) => isReplyPayloadTerminalContent(payload) && (!shouldDeliverTerminalFailure && !waitingStatusPayload || followupRun.run.sourceReplyDeliveryMode !== "message_tool_only" || getReplyPayloadMetadata(payload)?.deliverDespiteSourceReplySuppression === true) && normalizeReplyPayload(payload, { applyChannelTransforms: false }) !== null);
	if (waitingStatusPayload && hasTerminalReply) replyPayloads = replyPayloadsWithoutToolWarnings;
	if (shouldDeliverTerminalFailure && !hasTerminalReply && terminalFailurePayload) {
		const terminalPayloadResult = await buildFinalPayloads([terminalFailurePayload]);
		replyPayloads = [...replyPayloads, ...terminalPayloadResult.replyPayloads];
		didLogHeartbeatStrip = terminalPayloadResult.didLogHeartbeatStrip;
	} else if (waitingStatusPayload && !hasTerminalReply) {
		const acknowledgmentResult = await buildFinalPayloads([waitingStatusPayload]);
		replyPayloads = acknowledgmentResult.replyPayloads.length > 0 ? [...replyPayloadsWithoutToolWarnings, ...acknowledgmentResult.replyPayloads] : replyPayloads.map((payload) => isGeneratedToolWarning(payload) ? applyFinalReplyToMode(payload) : payload);
		didLogHeartbeatStrip = acknowledgmentResult.didLogHeartbeatStrip;
	} else if (hasSpecificFallbackFailure && !hasTerminalReply) {
		const silentFallbackFailurePayload = await returnSilentFallbackFailureIfNeeded();
		if (silentFallbackFailurePayload) return {
			kind: "return",
			value: silentFallbackFailurePayload
		};
	} else if (emptyInteractiveReplyPayload && !hasTerminalReply) {
		const emptyPayloadResult = await buildFinalPayloads([buildStrandedRetryMissingDeliveryDiagnostic() ?? emptyInteractiveReplyPayload]);
		replyPayloads = [...replyPayloads, ...emptyPayloadResult.replyPayloads];
		didLogHeartbeatStrip = emptyPayloadResult.didLogHeartbeatStrip;
		if (emptyPayloadResult.replyPayloads.length > 0) {
			replyOperation.retainFailureUntilComplete();
			replyOperation.fail("run_failed", /* @__PURE__ */ new Error("interactive agent run completed without a visible reply"));
			opts?.onAgentRunTerminalOutcome?.("failed");
		}
	}
	replyPayloads = attachMcpAppChannelAction({
		payloads: replyPayloads,
		channel: replyToChannel,
		sessionKey,
		view: runResult.latestMcpAppChannelView
	});
	replyPayloads = attachMcpConnectChannelAction({
		payloads: replyPayloads,
		action: runResult.latestMcpConnectAction
	});
	const hasVisibleReplyPayload = replyPayloads.some((payload) => !isReplyPayloadStatusNotice(payload) && (payload.isReasoning !== true || opts?.reasoningPayloadsEnabled === true) && (payload.isCommentary !== true || opts?.commentaryPayloadsEnabled === true) && normalizeReplyPayload(payload, { applyChannelTransforms: false }) !== null);
	const canDeliverStandaloneFallbackNotice = Boolean(blockReplyPipeline?.didStream()) || successfulSideEffectDelivery;
	if (replyPayloads.length === 0 || !hasVisibleReplyPayload && !canDeliverStandaloneFallbackNotice) return finishEmptyReply();
	const successfulCronAdds = runResult.successfulCronAdds ?? 0;
	const hasReminderCommitment = replyPayloads.some((payload) => !payload.isError && !isReplyPayloadStatusNotice(payload) && typeof payload.text === "string" && hasUnbackedReminderCommitment(payload.text));
	const coveredByExistingCron = hasReminderCommitment && successfulCronAdds === 0 ? await hasSessionRelatedCronJobs({
		cronStorePath: void 0,
		sessionKey
	}) : false;
	const guardedReplyPayloads = hasReminderCommitment && successfulCronAdds === 0 && !coveredByExistingCron ? appendUnscheduledReminderNote(replyPayloads) : replyPayloads;
	if (implicitContinuation || pendingContinuation && runResult.acceptedSessionSpawns?.length) {
		const statusPayload = guardedReplyPayloads.find((payload) => getReplyPayloadMetadata(payload)?.continuationStatus === true);
		const acceptedSessionSpawns = runResult.acceptedSessionSpawns;
		const requesterSessionKey = sessionKey ?? followupRun.run.sessionKey;
		if (implicitContinuation && (!requesterSessionKey || !acceptedSessionSpawns?.length || !statusPayload)) throw new Error("accepted continuation status could not be prepared for delivery");
		if (requesterSessionKey && acceptedSessionSpawns?.length && statusPayload) {
			let progressPresentation;
			if (implicitContinuation) opts?.onPendingContinuation?.({ settle: async (statusDelivered) => {
				const presentation = progressPresentation;
				progressPresentation = void 0;
				try {
					const { settleRequesterAfterSessionSpawns } = await import("./subagent-registry-DJ5MZmgl.mjs");
					const requester = {
						requesterSessionKey,
						requesterAgentId: followupRun.run.agentId,
						requesterTurnRunId: runId,
						acceptedSessionSpawns
					};
					const requesterYielded = statusDelivered || presentation !== void 0;
					try {
						if (!settleRequesterAfterSessionSpawns({
							...requester,
							requesterYielded,
							...presentation ? { progressPresentation: presentation } : {}
						})) throw new Error("accepted continuation children could not transfer terminal delivery");
					} catch (error) {
						if (!statusDelivered && requesterYielded) settleRequesterAfterSessionSpawns({
							...requester,
							requesterYielded: false
						});
						throw error;
					}
				} finally {
					getReplyPayloadMetadata(statusPayload)?.progressContinuation?.close();
				}
			} });
			const { createTaskProgressContinuation } = await import("./task-progress-requester-HGlRUy3R.mjs");
			const progressContinuation = await createTaskProgressContinuation({
				requesterSessionKey,
				requesterAgentId: followupRun.run.agentId,
				requesterTurnRunId: runId,
				acceptedSessionSpawns,
				...implicitContinuation ? { onAdopted: (presentation) => {
					progressPresentation = presentation;
				} } : {}
			});
			if (progressContinuation) setReplyPayloadMetadata(statusPayload, { progressContinuation });
		}
	}
	await signalTypingIfNeeded(guardedReplyPayloads, typingSignals);
	const diagnosticUsage = runResult.meta?.agentMeta?.diagnosticUsage ?? usage;
	if (isDiagnosticsEnabled(cfg) && hasBillableUsage(diagnosticUsage)) {
		const contextUsedTokens = deriveContextPromptTokens({
			lastCallUsage: runResult.meta?.agentMeta?.lastCallUsage,
			promptTokens,
			usage
		});
		const costUsd = estimateAggregateUsageCost({
			usage: diagnosticUsage,
			provider: providerUsed,
			model: modelUsed,
			config: cfg,
			agentDir: followupRun.run.agentDir
		});
		emitTrustedDiagnosticEvent({
			type: "model.usage",
			...runResult.diagnosticTrace ? { trace: freezeDiagnosticTraceContext(createChildDiagnosticTraceContext(runResult.diagnosticTrace)) } : {},
			sessionKey,
			sessionId: followupRun.run.sessionId,
			channel: replyToChannel,
			agentId: followupRun.run.agentId,
			provider: providerUsed,
			model: modelUsed,
			usage: toDiagnosticUsage(diagnosticUsage),
			lastCallUsage: runResult.meta?.agentMeta?.lastCallUsage,
			context: {
				limit: contextTokensUsed,
				...contextUsedTokens !== void 0 ? { used: contextUsedTokens } : {}
			},
			costUsd,
			durationMs: Date.now() - runStartedAt
		});
	}
	const responseUsageSessionRaw = activeSessionEntry?.responseUsage ?? (sessionKey ? activeSessionStore?.[sessionKey]?.responseUsage : void 0);
	const responseUsageLine = resolveResponseUsageLine({
		config: cfg,
		agentDir: followupRun.run.agentDir,
		sessionRaw: responseUsageSessionRaw,
		channel: replyToChannel,
		usage,
		provider: providerUsed,
		model: modelUsed,
		preserveUserFacingSessionState,
		replyUsageState
	});
	if (followupRun.run.verboseLevelOverride !== "off" || followupRun.run.traceAuthorized === true) activeSessionEntry = refreshSessionEntryFromStore({
		storePath,
		sessionKey,
		fallbackEntry: activeSessionEntry,
		activeSessionStore,
		expectedGeneration: accounting.expectedSession
	});
	return {
		kind: "continue",
		activeSessionEntry,
		completedSourceReplyDelivery,
		guardedReplyPayloads,
		responseUsageLine
	};
}
//#endregion
//#region src/auto-reply/reply/agent-runner-result.ts
async function finalizeReplyAgentRun(context) {
	const accounting = await accountAgentTurn(context);
	const prepared = await prepareReplyAgentPayloads({
		context,
		accounting
	});
	if (prepared.kind === "return") return prepared.value;
	return await completeReplyAgentRun({
		context,
		accounting,
		prepared
	});
}
//#endregion
//#region src/auto-reply/reply/followup-delivery-payloads.ts
/** Normalizes delivery content, applies threading, and dedupes message-tool sends. */
function resolveFollowupDeliveryPayloads(params) {
	const replyMessageProvider = resolveOriginMessageProvider({
		originatingChannel: params.originatingChannel,
		provider: params.messageProvider
	});
	const replyToChannel = replyMessageProvider;
	const replyToMode = params.originatingReplyToMode ?? resolveReplyToMode(params.cfg, replyToChannel, params.originatingAccountId, params.originatingChatType);
	const accountId = params.originatingAccountId;
	const replyDelivery = createReplyDeliveryContext(replyToMode, params.originatingChatType);
	const replyDeliverySource = replyMessageProvider ? {
		channel: replyMessageProvider,
		...accountId ? { accountId } : {}
	} : void 0;
	const deliverablePayloads = params.payloads.filter((payload) => !(payload.isReasoning === true && params.reasoningPayloadsEnabled !== true) && !(payload.isCommentary === true && params.commentaryPayloadsEnabled !== true));
	const sanitizedPayloads = [];
	for (const payload of deliverablePayloads) {
		const normalized = normalizeReplyPayload(payload, { applyChannelTransforms: false });
		if (normalized) sanitizedPayloads.push(normalized);
	}
	const originatingTo = params.originatingTo;
	const applyReplyToMode = createReplyToModeFilterForChannel(replyToMode, replyToChannel);
	return sanitizedPayloads.flatMap((payload) => filterMessagingToolReplyPayload({
		payload: applyReplyToMode.preview(setReplyPayloadMetadata(applyReplyTagsToPayload(payload), {
			replyDelivery,
			...replyDeliverySource ? { replyDeliverySource } : {}
		})),
		config: params.cfg,
		messageProvider: replyMessageProvider,
		messagingToolSentTargets: params.sentTargets,
		originatingTo,
		originatingThreadId: params.originatingThreadId,
		accountId,
		sentMediaUrls: params.sentMediaUrls,
		sentTexts: params.sentTexts,
		onDeliveredTerminalDuplicate: params.onDeliveredTerminalDuplicate
	}).filter(isRenderablePayload).map(applyReplyToMode));
}
//#endregion
//#region src/auto-reply/reply/followup-delivery.ts
/** Prepares queued follow-up payloads for source-channel delivery. */
/** Resolves one final queued delivery action without performing transport I/O. */
async function resolveFollowupDeliveryDecision(params) {
	const { turn, execution, accounting, opts } = params;
	if (turn.sendPolicy === "deny") return {
		kind: "suppress",
		reason: "send-policy"
	};
	if (turn.queued.currentInboundEventKind === "room_event" && !isInternalMessageChannel(turn.queued.originatingChannel)) return {
		kind: "suppress",
		reason: "room-event"
	};
	if (execution.outcome.kind === "aborted") return {
		kind: "suppress",
		reason: "aborted"
	};
	const postCompactionModelFailure = execution.outcome.postCompactionModelFailure;
	const renderFailurePayloads = (payloads) => payloads.map((payload) => renderPostCompactionModelFailurePayload(markPostCompactionModelFailurePayload(postCompactionModelFailure, payload)));
	const sourcePolicy = resolveSourceReplyVisibilityPolicy({
		cfg: turn.config,
		ctx: {
			ChatType: turn.queued.originatingChatType ?? turn.queued.run.chatType,
			InboundEventKind: turn.queued.currentInboundEventKind,
			Provider: turn.queued.originatingChannel ?? turn.queued.run.messageProvider,
			Surface: turn.queued.originatingChannel ?? turn.queued.run.messageProvider
		},
		requested: turn.queued.run.sourceReplyDeliveryMode ?? opts?.sourceReplyDeliveryMode,
		sendPolicy: turn.sendPolicy
	});
	const terminalReplyExpectation = turn.queued.run.terminalReplyExpectation ?? resolveSourceReplyExpectation({
		ctx: {
			InboundEventKind: turn.queued.currentInboundEventKind,
			InputProvenance: turn.queued.run.inputProvenance
		},
		cfg: turn.config
	});
	const isInteractive = terminalReplyExpectation === "required" || !isSyntheticSourceReplyTurn({ inputProvenance: turn.queued.run.inputProvenance }) && !isInternalMessageChannel(turn.queued.originatingChannel ?? turn.queued.run.messageProvider) && Boolean(turn.queued.originatingTo?.trim() || opts?.onBlockReply || turn.queued.queuedFollowupReplyDisposition?.kind === "deliver");
	const deliveryContext = {
		cfg: turn.config,
		messageProvider: turn.queued.run.messageProvider,
		originatingAccountId: turn.queued.originatingAccountId ?? turn.queued.run.agentAccountId,
		originatingChannel: turn.queued.originatingChannel,
		originatingChatType: turn.queued.originatingChatType,
		originatingReplyToMode: turn.queued.originatingReplyToMode,
		originatingTo: turn.queued.originatingTo,
		originatingThreadId: turn.queued.originatingThreadId
	};
	if (execution.outcome.kind === "rejected") {
		if (!isInteractive) return {
			kind: "suppress",
			reason: "silent"
		};
		if (sourcePolicy.sourceReplyDeliveryMode === "message_tool_only" && getReplyPayloadMetadata(execution.outcome.payload)?.deliverDespiteSourceReplySuppression !== true) return {
			kind: "suppress",
			reason: "message-tool-only"
		};
		const payloads = renderFailurePayloads(resolveFollowupDeliveryPayloads({
			...deliveryContext,
			payloads: [execution.outcome.payload],
			reasoningPayloadsEnabled: opts?.reasoningPayloadsEnabled === true,
			commentaryPayloadsEnabled: opts?.commentaryPayloadsEnabled === true
		}));
		return payloads.length > 0 ? {
			kind: "deliver",
			payloads,
			resolved: execution.outcome.resolved
		} : {
			kind: "suppress",
			reason: "silent"
		};
	}
	if (!accounting) return {
		kind: "suppress",
		reason: "silent"
	};
	const runtimeResolved = {
		provider: accounting.providerUsed,
		model: accounting.modelUsed
	};
	const result = execution.outcome.result;
	const pendingContinuation = result.meta?.yielded === true || result.meta?.continuationPending === true || (result.meta?.pendingToolCalls?.length ?? 0) > 0;
	const directBlockDeliveries = execution.outcome.directBlockDeliveries;
	const sourceReplyDelivery = resolveSourceReplyDelivery(result, await resolveTerminalReplyDelivery({
		directBlockDeliveries,
		resolveReplyDelivery: opts?.resolveReplyDelivery,
		sourceReplyDeliveryState: result.sourceReplyDeliveryState
	}));
	let completion = resolveReplyCompletion(terminalReplyExpectation, result.meta?.error?.kind === "hook_block" || result.didSendDeterministicApprovalPrompt === true ? "blocked" : sourceReplyDelivery !== "missing" ? sourceReplyDelivery : pendingContinuation ? "pending" : "empty");
	const completedSourceDelivery = hasCompletedSourceReplyDeliveryEvidence(result);
	const hasLegacyMessagingToolEvidence = result.sourceReplyDeliveryState === void 0 && resolveExplicitFinalSourceReplyDeliveryEvidence(result) === void 0;
	const assistantFinalText = normalizeAssistantFinalDeliveryText(typeof result.meta?.finalAssistantVisibleText === "string" ? result.meta.finalAssistantVisibleText : "");
	let payloads = resolveFollowupDeliveryPayloads({
		...deliveryContext,
		payloads: accounting.payloadArray,
		reasoningPayloadsEnabled: opts?.reasoningPayloadsEnabled === true,
		commentaryPayloadsEnabled: opts?.commentaryPayloadsEnabled === true,
		sentMediaUrls: result.messagingToolSentMediaUrls,
		sentTargets: result.messagingToolSentTargets,
		sentTexts: result.messagingToolSentTexts,
		onDeliveredTerminalDuplicate: hasLegacyMessagingToolEvidence ? () => {
			if (completion.outcome !== "blocked") completion = resolveReplyCompletion(terminalReplyExpectation, "delivered");
		} : void 0
	});
	if (!completedSourceDelivery && completion.outcome === "delivered") await opts?.onObservedReplyDelivery?.();
	const recovery = accounting.terminalFailurePayload || completion.outcome !== "missing" ? { kind: "none" } : resolveStrandedReplyRecovery({
		base: turn.queued,
		payloads,
		finalText: assistantFinalText,
		sourceReplyDeliveryMode: sourcePolicy.sourceReplyDeliveryMode,
		sendPolicyDenied: sourcePolicy.sendPolicyDenied,
		successfulSourceReplyDelivery: completedSourceDelivery,
		isHeartbeat: false,
		isRoomEvent: false
	});
	if (recovery.kind === "retry") return {
		kind: "retry-source-delivery",
		run: recovery.run,
		finalTextLength: assistantFinalText.trim().length,
		resolved: runtimeResolved
	};
	if (recovery.kind === "diagnostic") {
		const [payload] = resolveFollowupDeliveryPayloads({
			...deliveryContext,
			payloads: [recovery.payload]
		});
		if (!payload) return {
			kind: "suppress",
			reason: "silent"
		};
		return {
			kind: "deliver-diagnostic",
			payload,
			resolved: runtimeResolved
		};
	}
	const hasTerminalPayload = payloads.some((payload) => isReplyPayloadTerminalContent(payload) && (!accounting.terminalFailurePayload && !pendingContinuation || sourcePolicy.sourceReplyDeliveryMode !== "message_tool_only" || getReplyPayloadMetadata(payload)?.deliverDespiteSourceReplySuppression === true));
	const waitingStatusParams = {
		completion,
		continuationPending: result.meta?.continuationPending === true,
		yielded: result.meta?.yielded === true,
		yieldAcknowledgment: result.meta?.yieldAcknowledgment,
		hasVisibleMessageDelivery: hasCommittedSourceReplyDeliveryEvidence(result) || hasVisibleCommittedMessagingToolDeliveryEvidence(result) || result.didSendDeterministicApprovalPrompt === true
	};
	const waitingStatusPayload = accounting.terminalFailurePayload ? void 0 : buildWaitingStatusPayload(waitingStatusParams);
	const fallbackPayload = accounting.terminalFailurePayload ? isInteractive && completion.outcome !== "delivered" && completion.outcome !== "pending" && completion.outcome !== "blocked" ? sourcePolicy.sourceReplyDeliveryMode === "message_tool_only" ? markReplyPayloadForSourceSuppressionDelivery(accounting.terminalFailurePayload) : accounting.terminalFailurePayload : void 0 : waitingStatusPayload ?? buildEmptyInteractiveReplyPayload({ completion });
	if (!hasTerminalPayload && fallbackPayload) payloads = [...payloads, ...resolveFollowupDeliveryPayloads({
		...deliveryContext,
		payloads: [fallbackPayload]
	})];
	if (accounting.compactionNotice) payloads = [...resolveFollowupDeliveryPayloads({
		...deliveryContext,
		payloads: [accounting.compactionNotice]
	}), ...payloads];
	if (accounting.diagnosticsPayload && payloads.length > 0) payloads = [...payloads, ...resolveFollowupDeliveryPayloads({
		...deliveryContext,
		payloads: [accounting.diagnosticsPayload]
	})];
	const responseUsageLine = resolveResponseUsageLine({
		config: turn.config,
		agentDir: turn.queued.run.agentDir,
		sessionRaw: turn.session.current()?.responseUsage,
		channel: resolveOriginMessageProvider({
			originatingChannel: turn.queued.originatingChannel,
			provider: turn.queued.run.messageProvider
		}),
		usage: accounting.usage,
		provider: accounting.providerUsed,
		model: accounting.modelUsed,
		preserveUserFacingSessionState: accounting.preserveUserFacingSessionState,
		replyUsageState: accounting.replyUsageState
	});
	if (responseUsageLine) payloads = appendUsageLine(payloads, responseUsageLine);
	payloads = renderFailurePayloads(payloads);
	if (sourcePolicy.sourceReplyDeliveryMode === "message_tool_only") {
		payloads = payloads.filter((payload) => getReplyPayloadMetadata(payload)?.deliverDespiteSourceReplySuppression === true);
		if (payloads.length === 0) return {
			kind: "suppress",
			reason: "message-tool-only"
		};
	}
	if (result.meta?.yielded === true && result.acceptedSessionSpawns?.length) {
		const statusPayload = payloads.find((payload) => getReplyPayloadMetadata(payload)?.continuationStatus === true);
		const requesterSessionKey = turn.session.kind === "session" ? turn.session.key : turn.queued.run.sessionKey;
		if (statusPayload && requesterSessionKey) {
			const { createTaskProgressContinuation } = await import("./task-progress-requester-HGlRUy3R.mjs");
			const progressContinuation = await createTaskProgressContinuation({
				requesterSessionKey,
				requesterAgentId: turn.queued.run.agentId,
				requesterTurnRunId: execution.runId,
				acceptedSessionSpawns: result.acceptedSessionSpawns
			});
			if (progressContinuation) setReplyPayloadMetadata(statusPayload, { progressContinuation });
		}
	}
	return payloads.length > 0 ? {
		kind: "deliver",
		payloads,
		resolved: runtimeResolved
	} : {
		kind: "suppress",
		reason: "silent"
	};
}
async function sendFollowupPayloads(params) {
	const { turn, defaults } = params;
	const { originatingChannel, originatingTo } = turn.queued;
	const originRoutable = Boolean(isRoutableChannel(originatingChannel) && originatingTo);
	const deliveryPlan = buildAgentRuntimeDeliveryPlan({
		provider: params.resolved?.provider ?? turn.queued.run.provider,
		modelId: params.resolved?.model ?? turn.queued.run.model,
		config: turn.config,
		workspaceDir: turn.queued.run.workspaceDir,
		agentDir: turn.queued.run.agentDir
	});
	const payloads = params.payloads.filter((payload) => hasOutboundReplyContent(payload) && (!deliveryPlan.isSilentPayload(payload) || getReplyPayloadMetadata(payload)?.deliverDespiteSourceReplySuppression === true));
	if (payloads.length === 0) return [];
	const sourceDisposition = turn.queued.queuedFollowupReplyDisposition;
	if (sourceDisposition?.kind === "drop") {
		logVerbose(`followup queue: source delivery dropped (${sourceDisposition.reason})`);
		return [];
	}
	const deliverQueuedBatch = sourceDisposition?.deliver;
	const fallbackDispatcher = sourceDisposition ? void 0 : defaults.opts?.onBlockReply;
	const dispatcherAvailable = Boolean(deliverQueuedBatch || fallbackDispatcher);
	if (!originRoutable && !dispatcherAvailable) {
		defaultRuntime.error?.("followup queue: completed with payloads but no origin route or visible dispatcher is available");
		return [];
	}
	const typing = createTypingSignaler({
		typing: defaults.typing,
		mode: defaults.typingMode,
		isHeartbeat: false
	});
	const crossChannelFailures = [];
	const queuedPayloads = [];
	const dispatchPayload = async (payload) => {
		if (deliverQueuedBatch) queuedPayloads.push(payload);
		else await fallbackDispatcher?.(payload);
	};
	let deliveredCrossChannelOrigin = false;
	const provider = resolveOriginMessageProvider({ provider: turn.queued.run.messageProvider });
	const origin = resolveOriginMessageProvider({ originatingChannel });
	const sameChannelOrigin = Boolean(origin && origin === provider);
	const crossChannelOrigin = Boolean(origin && provider && origin !== provider);
	for (const payload of payloads) {
		const providerRoute = deliveryPlan.resolveFollowupRoute({
			payload,
			originatingChannel,
			originatingTo,
			originRoutable,
			dispatcherAvailable
		});
		if (providerRoute?.route === "drop") continue;
		const route = providerRoute?.route === "origin" && originRoutable ? "origin" : providerRoute?.route === "dispatcher" && dispatcherAvailable ? "dispatcher" : originRoutable ? "origin" : "dispatcher";
		await typing.signalTextDelta(payload.text);
		if (route !== "origin") await dispatchPayload(payload);
		else if (isRoutableChannel(originatingChannel) && originatingTo) {
			const metadata = getReplyPayloadMetadata(payload);
			const result = await routeReply({
				payload,
				channel: originatingChannel,
				to: originatingTo,
				agentId: turn.queued.run.agentId,
				sessionKey: turn.queued.run.sessionKey,
				accountId: turn.queued.originatingAccountId,
				requesterSenderId: turn.queued.run.senderId,
				requesterSenderName: turn.queued.run.senderName,
				requesterSenderUsername: turn.queued.run.senderUsername,
				requesterSenderE164: turn.queued.run.senderE164,
				threadId: turn.queued.originatingThreadId,
				currentMessageId: sameChannelOrigin && (turn.queued.run.inputProvenance?.kind === void 0 || turn.queued.run.inputProvenance.kind === "external_user") ? turn.queued.messageId : void 0,
				cfg: turn.config,
				mirror: metadata?.assistantMessageIndex !== void 0 || metadata?.assistantTranscriptOwned === true ? false : params.mirror,
				replyKind: params.kind,
				runId: params.runId
			});
			if (!result.delivered && (result.queueCustody === "held" || result.ambiguous)) {
				logVerbose(`followup queue: route-reply remains pending: ${result.error ?? "unconfirmed delivery"}`);
				continue;
			}
			if (!result.delivered && !result.suppressed) {
				const routeError = result.error ?? "no visible delivery";
				logVerbose(`followup queue: route-reply failed: ${routeError}`);
				if (sameChannelOrigin && dispatcherAvailable) await dispatchPayload(payload);
				else if (dispatcherAvailable) crossChannelFailures.push(payload);
				else defaultRuntime.error?.(`followup queue: route-reply failed: ${routeError}`);
			} else if (result.delivered) {
				if (!result.ok) logVerbose(`followup queue: route-reply partially failed after delivery: ${result.error ?? "unknown error"}`);
				deliveredCrossChannelOrigin ||= crossChannelOrigin;
			}
		}
	}
	if ((crossChannelFailures.some(isReplyPayloadTerminalContent) || crossChannelFailures.length > 0 && !deliveredCrossChannelOrigin) && dispatcherAvailable) await dispatchPayload({
		text: "Follow-up completed, but OpenClaw could not deliver it to the originating channel. The reply content was not forwarded to this channel to avoid cross-channel misdelivery.",
		isError: true
	});
	if (params.kind !== "final" && queuedPayloads.length > 0) await deliverQueuedBatch?.({
		kind: "queued-followup",
		runId: params.runId,
		originatingChannel,
		payloads: queuedPayloads,
		completion: { kind: "progress" }
	});
	return queuedPayloads;
}
async function deliverFollowupDecision(params) {
	const { decision, turn, defaults } = params;
	if (decision.kind === "suppress") {
		logVerbose(`followup queue: delivery suppressed (${decision.reason})`);
		return {
			kind: "completed",
			payloads: []
		};
	}
	if (decision.kind === "retry-source-delivery") {
		warnPrivateMessageToolFinal({
			sessionKey: turn.session.kind === "session" ? turn.session.key : void 0,
			channel: turn.queued.originatingChannel ?? turn.queued.run.messageProvider ?? sessionDeliveryChannel(turn.session.current()),
			finalTextLength: decision.finalTextLength
		});
		const key = turn.session.kind === "session" ? turn.session.key : turn.queued.run.sessionKey;
		const sourceDisposition = turn.queued.queuedFollowupReplyDisposition;
		const retryDelivery = sourceDisposition?.kind === "deliver" ? sourceDisposition.deliver.createSourceRetry?.() : void 0;
		const retryRun = retryDelivery ? {
			...decision.run,
			queuedFollowupReplyDisposition: {
				kind: "deliver",
				deliver: retryDelivery
			}
		} : decision.run;
		if (key && enqueueFollowupRun(key, retryRun, resolveQueueSettings({
			cfg: turn.config,
			channel: turn.queued.originatingChannel ?? turn.queued.run.messageProvider,
			sessionEntry: turn.session.current()
		}), "none", params.runFollowup, false, { position: "front" })) return { kind: "source-retry" };
		return {
			kind: "completed",
			payloads: await sendFollowupPayloads({
				payloads: resolveFollowupDeliveryPayloads({
					cfg: turn.config,
					payloads: [buildStrandedReplyDeliveryFailurePayload()],
					messageProvider: turn.queued.run.messageProvider,
					originatingAccountId: turn.queued.originatingAccountId ?? turn.queued.run.agentAccountId,
					originatingChannel: turn.queued.originatingChannel,
					originatingChatType: turn.queued.originatingChatType,
					originatingReplyToMode: turn.queued.originatingReplyToMode,
					originatingTo: turn.queued.originatingTo,
					originatingThreadId: turn.queued.originatingThreadId
				}),
				turn,
				defaults,
				runId: params.runId,
				kind: params.kind ?? "final",
				resolved: decision.resolved
			})
		};
	}
	return {
		kind: "completed",
		payloads: await sendFollowupPayloads({
			payloads: decision.kind === "deliver" ? decision.payloads : [decision.payload],
			turn,
			defaults,
			runId: params.runId,
			kind: params.kind ?? "final",
			mirror: params.kind && params.kind !== "final" ? false : void 0,
			resolved: decision.resolved
		})
	};
}
//#endregion
//#region src/auto-reply/reply/followup-turn-admission.ts
async function settleQueuedFollowupPresentation(defaults) {
	try {
		await defaults.opts?.onQueuedFollowupSettled?.();
	} catch (error) {
		defaultRuntime.error?.(`followup queue: queued presentation cleanup failed: ${formatErrorMessage(error)}`);
	}
}
function resolveFollowupCurrentMessageId(queued) {
	return queued.run.inputProvenance?.kind === "internal_system" && queued.run.inputProvenance.sourceTool === "restart-sentinel" ? queued.originatingReplyToId : queued.messageId;
}
function isSameSessionGeneration(left, right) {
	return Boolean(left && right && left.sessionId === right.sessionId && left.lifecycleRevision === right.lifecycleRevision);
}
/** Resolves one queued item into an admitted turn. */
async function admitFollowupTurn(params) {
	const assertOperatorCurrent = () => {
		params.queued.operatorAuthority?.assertCurrent();
	};
	assertOperatorCurrent();
	const resolvedConfig = await resolveQueuedReplyExecutionConfig(params.queued.run.config, {
		originatingChannel: params.queued.originatingChannel,
		messageProvider: params.queued.run.messageProvider,
		originatingAccountId: params.queued.originatingAccountId,
		agentAccountId: params.queued.run.agentAccountId
	});
	assertOperatorCurrent();
	const config = resolveQueuedReplyRuntimeConfig(resolvedConfig);
	const replySessionKey = params.queued.run.sessionKey ?? params.defaults.sessionKey;
	const initialStoredEntry = replySessionKey ? params.defaults.sessionStore?.[replySessionKey] : void 0;
	const initialEntry = initialStoredEntry ?? (replySessionKey === params.defaults.sessionKey ? params.defaults.sessionEntry : void 0);
	let run = {
		...params.queued.run,
		config
	};
	const resolveRunSessionFile = (source, sessionId) => resolveAdmittedRunSessionFile({
		agentId: source.agentId,
		sessionId,
		sessionKey: replySessionKey,
		storePath: params.defaults.storePath
	}) ?? source.sessionFile;
	const admission = await admitReplyTurn({
		agentId: run.agentId,
		resolveGatewayContext: params.defaults.resolveGatewayContext,
		sessionId: params.queued.admissionSessionId ?? run.sessionId,
		sessionKey: replySessionKey ?? "",
		expectedSessionId: initialEntry?.sessionId,
		storePath: params.defaults.storePath,
		kind: "queued_followup",
		resetTriggered: false,
		routeThreadId: params.queued.originatingThreadId,
		originatingLeafEntryId: params.queued.turnAdoptionLifecycle?.originatingLeafEntryId,
		upstreamAbortSignal: resolveFollowupAbortSignal(params.queued)
	});
	if (admission.status === "skipped") {
		if (admission.reason !== "active-run") return {
			kind: "skipped",
			reason: admission.reason
		};
		params.queued.turnAdoptionLifecycle?.onDeferredHeartbeat?.();
		return {
			kind: "deferred",
			reason: "active-run"
		};
	}
	const operation = admission.operation;
	operation.retainFailureUntilComplete();
	let queuedFollowupAdmitted = false;
	try {
		await admitFollowupRunLifecycle(params.queued);
		if (isFollowupRunAborted(params.queued)) return {
			kind: "skipped",
			reason: "aborted",
			operation
		};
		queuedFollowupAdmitted = true;
		await params.defaults.opts?.onQueuedFollowupAdmitted?.();
		assertOperatorCurrent();
		if (operation.sessionId !== run.sessionId) run = {
			...run,
			sessionId: operation.sessionId,
			sessionFile: resolveRunSessionFile(run, operation.sessionId),
			cliSessionBindingFacts: void 0,
			autoFallbackPrimaryProbe: void 0,
			modelSelectionLocked: false
		};
		const admittedEntry = replySessionKey ? params.defaults.storePath ? loadSessionEntry({
			storePath: params.defaults.storePath,
			sessionKey: replySessionKey
		}) : params.defaults.sessionStore?.[replySessionKey] : void 0;
		const expectedPersistedEntry = admission.sessionEntry?.sessionId === operation.sessionId ? admission.sessionEntry : initialEntry?.sessionId === operation.sessionId ? initialEntry : void 0;
		const assertPersistedGeneration = (entry) => {
			const matchesExpectedGeneration = isSameSessionGeneration(entry, expectedPersistedEntry);
			if ((Boolean(params.defaults.storePath) || entry !== initialStoredEntry) && (expectedPersistedEntry && !matchesExpectedGeneration || !expectedPersistedEntry && entry && entry.sessionId !== operation.sessionId)) throw new ReplySessionGenerationInvalidatedError("Follow-up session generation changed after reply admission");
		};
		assertPersistedGeneration(admittedEntry);
		const admissionEntry = admission.sessionEntry?.sessionId === operation.sessionId ? admission.sessionEntry : void 0;
		const reloadedEntry = admittedEntry?.sessionId === operation.sessionId ? admittedEntry : void 0;
		let activeEntry = (reloadedEntry && admissionEntry ? reloadedEntry.updatedAt >= admissionEntry.updatedAt ? reloadedEntry : admissionEntry : reloadedEntry ?? admissionEntry) ?? (admittedEntry === void 0 && initialEntry?.sessionId === operation.sessionId ? initialEntry : void 0);
		const lifecycleRevisionChanged = operation.sessionId === params.queued.run.sessionId && activeEntry?.sessionId === operation.sessionId && activeEntry.lifecycleRevision !== (initialEntry?.sessionId === operation.sessionId ? initialEntry.lifecycleRevision : void 0);
		if (activeEntry?.sessionId === operation.sessionId) run = {
			...run,
			sessionFile: resolveRunSessionFile(run, operation.sessionId),
			modelSelectionLocked: activeEntry.modelSelectionLocked === true,
			...lifecycleRevisionChanged ? {
				cliSessionBindingFacts: void 0,
				autoFallbackPrimaryProbe: void 0
			} : {}
		};
		run = resolveRunAfterAutoFallbackPrimaryProbeRecheck({
			run,
			entry: activeEntry,
			sessionKey: replySessionKey
		});
		const queued = {
			...params.queued,
			run
		};
		const sessionEntryHandle = createReplySessionEntryHandle({
			sessionEntry: activeEntry,
			sessionKey: replySessionKey,
			sessionStore: params.defaults.sessionStore,
			generationFence: {
				sessionId: operation.sessionId,
				expectedStoreEntry: initialStoredEntry
			}
		});
		const session = {
			...replySessionKey ? {
				kind: "session",
				key: replySessionKey,
				storePath: params.defaults.storePath
			} : { kind: "detached" },
			current: () => sessionEntryHandle.getCurrent(),
			publish: (entry) => entry && sessionEntryHandle.replaceCurrent(entry),
			adopt: (entry) => sessionEntryHandle.adoptCurrent(entry)
		};
		const sessionStore = replySessionKey ? sessionEntryHandle.toCompatSessionStore() : params.defaults.sessionStore;
		const resolveTurnSendPolicy = (entry, source = queued) => resolveSendPolicy({
			cfg: config,
			entry,
			sessionKey: source.run.runtimePolicySessionKey ?? replySessionKey,
			channel: source.originatingChannel ?? source.run.messageProvider ?? sessionDeliveryChannel(entry),
			chatType: normalizeChatType(source.originatingChatType ?? source.run.chatType ?? entry?.chatType)
		});
		const currentInboundContext = params.defaults.opts?.isHeartbeat === true ? queued.currentInboundContext : refreshActiveGoalContext(queued.currentInboundContext, activeEntry);
		const turn = {
			runId: crypto.randomUUID(),
			queued: {
				...queued,
				currentInboundContext
			},
			operation,
			config,
			session,
			sessionStore,
			sendPolicy: resolveTurnSendPolicy(activeEntry),
			preflightCompactionApplied: false
		};
		const refreshTurnSessionState = (entry) => {
			const refreshedInboundContext = params.defaults.opts?.isHeartbeat === true ? params.queued.currentInboundContext : refreshActiveGoalContext(params.queued.currentInboundContext, entry);
			turn.sendPolicy = resolveTurnSendPolicy(entry, turn.queued);
			turn.queued = {
				...turn.queued,
				currentInboundContext: refreshedInboundContext
			};
		};
		const readTurnSessionEntry = () => replySessionKey && params.defaults.storePath ? loadSessionEntry({
			storePath: params.defaults.storePath,
			sessionKey: replySessionKey
		}) : replySessionKey && params.defaults.sessionStore ? params.defaults.sessionStore[replySessionKey] : session.current();
		const synchronizeTurnGeneration = (entry, previousEntry) => {
			const generationRotated = Boolean(entry && !isSameSessionGeneration(entry, previousEntry));
			if (entry && generationRotated) {
				operation.updateSessionId(entry.sessionId);
				turn.queued = {
					...turn.queued,
					run: {
						...turn.queued.run,
						sessionId: entry.sessionId,
						sessionFile: resolveRunSessionFile(turn.queued.run, entry.sessionId),
						cliSessionBindingFacts: void 0,
						autoFallbackPrimaryProbe: void 0,
						modelSelectionLocked: entry.modelSelectionLocked === true
					}
				};
			}
			return generationRotated;
		};
		const previousCompactionCount = activeEntry?.compactionCount ?? 0;
		let pendingTerminalCompactionNotice;
		let compactionNoticeGenerationInvalidated = false;
		const notifyPreflightCompaction = turn.sendPolicy === "allow" && queued.currentInboundEventKind !== "room_event" && shouldNotifyUserAboutCompaction(config) ? async (phase, text) => {
			if (phase !== "start") {
				pendingTerminalCompactionNotice = {
					phase,
					text
				};
				return;
			}
			const noticeEntry = readTurnSessionEntry();
			try {
				assertPersistedGeneration(noticeEntry);
			} catch (error) {
				if (error instanceof ReplySessionGenerationInvalidatedError) {
					compactionNoticeGenerationInvalidated = true;
					operation.abortForRestart();
					throw error;
				}
				throw error;
			}
			if (resolveTurnSendPolicy(noticeEntry, turn.queued) === "deny") return;
			await params.onCompactionNoticePayload?.(createCompactionNoticePayload({
				phase,
				currentMessageId: resolveFollowupCurrentMessageId(queued)
			}), turn);
		} : void 0;
		const preflightEntry = session.current();
		try {
			activeEntry = await runSessionCompactionIfNeeded({
				cfg: config,
				followupRun: turn.queued,
				pendingUserEntryId: readPendingUserTurnTranscriptAdmission(turn.queued.userTurnTranscriptRecorder)?.entryId,
				promptForEstimate: turn.queued.prompt,
				defaultModel: params.defaults.defaultModel,
				sessionEntry: activeEntry,
				sessionStore,
				sessionKey: replySessionKey,
				storePath: params.defaults.storePath,
				isHeartbeat: params.defaults.opts?.isHeartbeat === true,
				abortSignal: operation.abortSignal,
				onCompactionStart: () => operation.setPhase("preflight_compacting"),
				onSessionIdChanged: (sessionId) => operation.updateSessionId(sessionId),
				onCompactionNotice: notifyPreflightCompaction
			});
			if (compactionNoticeGenerationInvalidated) throw new ReplySessionGenerationInvalidatedError("Follow-up session generation changed during preflight notice delivery");
			if (replySessionKey && params.defaults.storePath) {
				const persistedEntry = readTurnSessionEntry();
				if (!persistedEntry && preflightEntry || persistedEntry && !isSameSessionGeneration(persistedEntry, preflightEntry) && !isSameSessionGeneration(persistedEntry, activeEntry)) throw new ReplySessionGenerationInvalidatedError("Follow-up session generation changed during preflight");
				if (persistedEntry && (!activeEntry || isSameSessionGeneration(persistedEntry, activeEntry) && persistedEntry.updatedAt >= activeEntry.updatedAt)) activeEntry = persistedEntry;
			}
			if (activeEntry) {
				session.adopt(activeEntry);
				activeEntry = session.current() ?? activeEntry;
			}
			const generationRotated = synchronizeTurnGeneration(activeEntry, preflightEntry);
			refreshTurnSessionState(activeEntry);
			turn.preflightCompactionApplied = generationRotated || (activeEntry?.compactionCount ?? 0) > previousCompactionCount;
		} catch (error) {
			const failureEntry = readTurnSessionEntry();
			if (!isSameSessionGeneration(failureEntry, session.current())) assertPersistedGeneration(failureEntry);
			if (failureEntry) {
				session.adopt(failureEntry);
				activeEntry = session.current() ?? failureEntry;
			}
			synchronizeTurnGeneration(activeEntry, preflightEntry);
			refreshTurnSessionState(activeEntry);
			if (compactionNoticeGenerationInvalidated) throw new ReplySessionGenerationInvalidatedError("Follow-up session generation changed during preflight notice delivery");
			if (error instanceof ReplySessionGenerationInvalidatedError) throw error;
			operation.fail("run_failed", error);
			const admittedVerboseLevel = turn.queued.run.verboseLevelOverride ?? session.current()?.verboseLevel ?? turn.queued.run.verboseLevel;
			const text = buildPreflightCompactionFailureText(formatErrorMessage(error), { includeDetails: admittedVerboseLevel === "on" || admittedVerboseLevel === "full" });
			if (!text) turn.preflightError = error;
			else turn.preflightFailurePayload = markReplyPayloadForSourceSuppressionDelivery({ text });
		}
		if (pendingTerminalCompactionNotice && turn.sendPolicy === "allow" && turn.queued.currentInboundEventKind !== "room_event") await params.onCompactionNoticePayload?.(createCompactionNoticePayload({
			phase: pendingTerminalCompactionNotice.phase,
			text: pendingTerminalCompactionNotice.text,
			currentMessageId: resolveFollowupCurrentMessageId(turn.queued)
		}), turn);
		return {
			kind: "admitted",
			turn
		};
	} catch (error) {
		if (queuedFollowupAdmitted) await settleQueuedFollowupPresentation(params.defaults);
		operation.complete();
		throw error instanceof Error ? error : new Error(formatErrorMessage(error));
	}
}
//#endregion
//#region src/auto-reply/reply/agent-runner-session-reset.ts
const deps = {
	generateSecureUuid,
	persistSessionResetLifecycle,
	refreshQueuedFollowupSession,
	resetRegisteredAgentHarnessSessions,
	error: (message) => defaultRuntime.error(message)
};
function setAgentRunnerSessionResetTestDeps(overrides) {
	Object.assign(deps, {
		generateSecureUuid,
		persistSessionResetLifecycle,
		refreshQueuedFollowupSession,
		resetRegisteredAgentHarnessSessions,
		error: (message) => defaultRuntime.error(message),
		...overrides
	});
}
if (process.env.VITEST || false) globalThis[Symbol.for("openclaw.agentRunnerSessionResetTestApi")] = { setAgentRunnerSessionResetTestDeps };
async function resetReplyRunSession(params) {
	if (!params.sessionKey || !params.activeSessionStore || !params.storePath) return false;
	const prevEntry = params.activeSessionStore[params.sessionKey] ?? params.activeSessionEntry;
	if (!prevEntry) return false;
	if (isModelSelectionLocked(prevEntry)) throw new ModelSelectionLockedError(MODEL_SELECTION_LOCKED_RESET_MESSAGE);
	const nextSessionId = prevEntry.sessionId;
	const now = Date.now();
	const nextEntry = {
		...prevEntry,
		sessionId: nextSessionId,
		previousSessionId: void 0,
		lifecycleRevision: deps.generateSecureUuid(),
		updatedAt: now,
		sessionStartedAt: now,
		lastInteractionAt: now,
		systemSent: false,
		abortedLastRun: false,
		lifecycleRunId: void 0,
		lastRunId: void 0,
		modelProvider: void 0,
		model: void 0,
		inputTokens: void 0,
		outputTokens: void 0,
		totalTokens: void 0,
		totalTokensFresh: false,
		totalTokensVersion: void 0,
		estimatedCostUsd: void 0,
		cacheRead: void 0,
		cacheWrite: void 0,
		contextTokens: void 0,
		contextTokensSource: void 0,
		contextBudgetStatus: void 0,
		systemPromptReport: void 0,
		fallbackNotice: void 0,
		sessionDiffBaseline: void 0,
		sessionDiffBaselineCapture: prevEntry.execNode ? void 0 : createSessionDiffBaselineCaptureClaim(),
		compactionCount: 0,
		transcriptByteCompactionLatch: void 0,
		memoryFlush: void 0
	};
	clearAllCliSessions(nextEntry);
	nextEntry.agentHarnessId = void 0;
	transitionMainSessionRecovery(nextEntry, { kind: "clear" });
	const agentId = params.followupRun.run.agentId;
	const nextSessionFile = params.sessionKey;
	params.activeSessionStore[params.sessionKey] = nextEntry;
	try {
		await deps.persistSessionResetLifecycle({
			agentId,
			nextEntry,
			nextSessionFile,
			previousEntry: prevEntry,
			workspaceDir: params.followupRun.run.workspaceDir,
			sessionKey: params.sessionKey,
			storePath: params.storePath
		});
	} catch (err) {
		params.activeSessionStore[params.sessionKey] = prevEntry;
		deps.error(`Failed to persist session reset after ${params.options.failureLabel} (${params.sessionKey}): ${String(err)}`);
		throw err;
	}
	let settledEntry = nextEntry;
	try {
		if (nextEntry.sessionDiffBaselineCapture) settledEntry = await ensureSessionDiffBaseline({
			agentId,
			cwd: nextEntry.spawnedCwd ?? nextEntry.spawnedWorkspaceDir ?? params.followupRun.run.workspaceDir,
			entry: nextEntry,
			isNewSession: false,
			sessionKey: params.sessionKey,
			storePath: params.storePath
		});
	} catch (error) {
		const authoritative = loadSessionEntry({
			agentId,
			sessionKey: params.sessionKey,
			storePath: params.storePath
		});
		if (authoritative) params.activeSessionStore[params.sessionKey] = authoritative;
		else delete params.activeSessionStore[params.sessionKey];
		throw error;
	}
	params.activeSessionStore[params.sessionKey] = settledEntry;
	clearBootstrapSnapshotOnSessionBoundary({
		boundaryAppended: true,
		sessionKey: params.sessionKey
	});
	await deps.resetRegisteredAgentHarnessSessions({
		agentId,
		sessionId: nextSessionId,
		sessionKey: params.sessionKey,
		sessionFile: nextSessionFile,
		reason: "reset"
	});
	params.followupRun.run.sessionId = nextSessionId;
	params.followupRun.run.sessionFile = nextSessionFile;
	deps.refreshQueuedFollowupSession({
		key: params.queueKey,
		previousSessionId: prevEntry.sessionId,
		nextSessionId,
		nextSessionFile
	});
	params.onActiveSessionEntry(settledEntry);
	params.onNewSession(nextSessionId, nextSessionFile);
	deps.error(params.options.buildLogMessage(nextSessionId));
	return true;
}
//#endregion
//#region src/auto-reply/reply/followup-turn-execution.ts
function buildFollowupTemplateContext(turn) {
	const queued = turn.queued;
	const run = queued.run;
	const surface = queued.originatingChannel ?? run.messageProvider;
	const sessionKey = turn.session.kind === "session" ? turn.session.key : run.sessionKey;
	const currentMessageId = run.inputProvenance?.kind === "internal_system" && run.inputProvenance.sourceTool === "restart-sentinel" ? queued.originatingReplyToId : queued.messageId;
	return {
		Provider: run.messageProvider,
		Surface: surface,
		OriginatingChannel: queued.originatingChannel,
		OriginatingTo: queued.originatingTo,
		To: queued.originatingTo,
		AccountId: queued.originatingAccountId ?? run.agentAccountId,
		ChatType: queued.originatingChatType ?? run.chatType,
		SessionKey: sessionKey,
		RuntimePolicySessionKey: run.runtimePolicySessionKey ?? sessionKey,
		MessageSid: currentMessageId,
		MessageSidFull: currentMessageId,
		MessageThreadId: queued.originatingThreadId,
		ReplyToId: queued.originatingReplyToId,
		SenderId: run.senderId,
		MemberRoleIds: run.memberRoleIds,
		ChannelContext: run.channelContext,
		SenderName: run.senderName,
		SenderUsername: run.senderUsername,
		SenderE164: run.senderE164,
		GroupChannel: run.groupChannel,
		GroupSpace: run.groupSpace,
		InputProvenance: run.inputProvenance,
		InboundEventKind: queued.currentInboundEventKind,
		media: queued.media
	};
}
/** Adapts an admitted queued turn to the canonical agent execution owner. */
async function executeFollowupTurn(params) {
	const { turn, defaults } = params;
	const sourceOpts = defaults.opts;
	const terminalReplyExpectation = turn.queued.run.terminalReplyExpectation ?? resolveSourceReplyExpectation({
		ctx: {
			InboundEventKind: turn.queued.currentInboundEventKind,
			InputProvenance: turn.queued.run.inputProvenance
		},
		cfg: turn.config
	});
	turn.queued.run.terminalReplyExpectation = terminalReplyExpectation;
	const isHeartbeat = false;
	const roomEvent = turn.queued.currentInboundEventKind === "room_event";
	const progressAllowed = () => turn.sendPolicy === "allow" && !roomEvent;
	const currentVerboseLevel = () => {
		if (turn.queued.run.verboseLevelOverride !== void 0) return turn.queued.run.verboseLevelOverride;
		const session = turn.session;
		if (session.kind === "session" && session.storePath) try {
			const loadedEntry = loadSessionEntryReadOnly({
				storePath: session.storePath,
				sessionKey: session.key
			});
			const ownedEntry = session.current();
			if (loadedEntry !== void 0 && ownedEntry !== void 0 && loadedEntry.sessionId === ownedEntry.sessionId && loadedEntry.lifecycleRevision === ownedEntry.lifecycleRevision && loadedEntry.updatedAt >= ownedEntry.updatedAt) {
				const level = loadedEntry.verboseLevel;
				if (level === "off" || level === "on" || level === "full") return level;
			}
		} catch {}
		const level = session.current()?.verboseLevel ?? turn.queued.run.verboseLevel;
		return level === "on" || level === "full" ? level : "off";
	};
	const forceToolResultProgress = sourceOpts?.forceToolResultProgress === true;
	const channelToolResultProgress = forceToolResultProgress ? sourceOpts.onToolResult : void 0;
	const shouldEmitVerboseToolResult = () => {
		const level = currentVerboseLevel();
		return level === "on" || level === "full";
	};
	const shouldEmitToolResult = () => progressAllowed() && (forceToolResultProgress || shouldEmitVerboseToolResult());
	const shouldEmitToolOutput = () => progressAllowed() && currentVerboseLevel() === "full";
	const shouldEmitStructuredProgress = () => progressAllowed() && (sourceOpts?.suppressDefaultToolProgressMessages === true || shouldEmitToolResult());
	const shouldEmitToolLifecycle = () => progressAllowed() && (shouldEmitStructuredProgress() || sourceOpts?.allowToolLifecycleWhenProgressHidden === true);
	const { commentaryPayloadsEnabled, draftOwnsCommentaryProgress } = resolveTurnCommentaryProgressOwner({
		commentaryPayloadsEnabled: sourceOpts?.commentaryPayloadsEnabled === true,
		options: sourceOpts,
		resolveVerboseProgressVisibility: () => progressAllowed() && shouldEmitVerboseToolResult()
	});
	let progressChain = Promise.resolve();
	let visibleReplyDelivered = false;
	let pendingProgressTaskFailure;
	const pendingWorkTasks = /* @__PURE__ */ new Set();
	const enqueueProgress = (deliver) => {
		const deliveryTask = progressChain.then(deliver);
		progressChain = deliveryTask.catch(() => void 0);
		const trackedTask = deliveryTask.catch((error) => {
			pendingProgressTaskFailure ??= error;
			throw error;
		}).finally(() => pendingWorkTasks.delete(trackedTask));
		trackedTask.catch(() => void 0);
		pendingWorkTasks.add(trackedTask);
		return progressChain;
	};
	const enqueueProgressResult = async (deliver) => {
		let completed = false;
		let result = false;
		await enqueueProgress(async () => {
			result = await deliver();
			visibleReplyDelivered ||= result !== false;
			completed = true;
		});
		return completed ? result : false;
	};
	const wrap = (callback, allowed = progressAllowed) => callback ? (value) => enqueueProgress(async () => {
		if (allowed()) await callback(value);
	}) : void 0;
	const wrapVisibility = (callback, allowed = progressAllowed) => callback ? (value) => enqueueProgressResult(async () => {
		if (!allowed()) return false;
		return (await settleProgressVisibilityCallbackResult(callback(value))).visible;
	}) : void 0;
	const baseTypingSignals = createTypingSignaler({
		typing: defaults.typing,
		mode: progressAllowed() ? defaults.typingMode : "never",
		isHeartbeat
	});
	const typingSignals = {
		...baseTypingSignals,
		signalRunStart: () => enqueueProgress(baseTypingSignals.signalRunStart),
		signalMessageStart: () => enqueueProgress(baseTypingSignals.signalMessageStart),
		signalTextDelta: (text) => enqueueProgress(() => baseTypingSignals.signalTextDelta(text)),
		signalReasoningDelta: () => enqueueProgress(baseTypingSignals.signalReasoningDelta),
		signalToolStart: () => enqueueProgress(baseTypingSignals.signalToolStart),
		signalExecutionActivity: () => enqueueProgress(baseTypingSignals.signalExecutionActivity ?? baseTypingSignals.signalRunStart)
	};
	const progressOpts = {
		...sourceOpts,
		isHeartbeat,
		operatorAuthority: turn.queued.operatorAuthority,
		toolsAllow: turn.queued.toolsAllow,
		disableTools: turn.queued.disableTools,
		commentaryPayloadsEnabled,
		runId: turn.runId,
		onBlockReply: void 0,
		onPreparedBlockReply: void 0,
		onPartialReply: void 0,
		onAssistantMessageStart: void 0,
		onToolStart: wrapVisibility(sourceOpts?.onToolStart, shouldEmitToolLifecycle),
		onCommandOutput: wrapVisibility(sourceOpts?.onCommandOutput, shouldEmitStructuredProgress),
		onItemEvent: sourceOpts?.onItemEvent ? (item) => enqueueProgressResult(async () => {
			if (!(progressAllowed() && item.kind === "preamble" && draftOwnsCommentaryProgress) && !shouldEmitStructuredProgress()) return false;
			return (await settleProgressVisibilityCallbackResult(sourceOpts.onItemEvent(item))).visible;
		}) : void 0,
		onNarrationUpdate: wrap(sourceOpts?.onNarrationUpdate),
		onPlanUpdate: wrapVisibility(sourceOpts?.onPlanUpdate),
		onApprovalEvent: wrapVisibility(sourceOpts?.onApprovalEvent, shouldEmitStructuredProgress),
		onPatchSummary: wrapVisibility(sourceOpts?.onPatchSummary, shouldEmitStructuredProgress),
		onCompactionStart: sourceOpts?.onCompactionStart ? () => enqueueProgressResult(async () => progressAllowed() ? (await settleProgressVisibilityCallbackResult(sourceOpts.onCompactionStart())).visible : false) : void 0,
		onCompactionEnd: sourceOpts?.onCompactionEnd ? (payload) => enqueueProgressResult(async () => progressAllowed() ? (await settleProgressVisibilityCallbackResult(sourceOpts.onCompactionEnd(payload))).visible : false) : void 0,
		onReasoningStream: wrapVisibility(sourceOpts?.onReasoningStream),
		onReasoningProgress: wrap(sourceOpts?.onReasoningProgress),
		onReasoningEnd: sourceOpts?.onReasoningEnd ? () => enqueueProgressResult(async () => progressAllowed() ? (await settleProgressVisibilityCallbackResult(sourceOpts.onReasoningEnd())).visible : false) : void 0,
		onToolResult: async (payload) => {
			return await enqueueProgressResult(async () => {
				if (!progressAllowed()) return false;
				const requiresDurableToolResult = requiresDurableToolResultDelivery(payload);
				if (sourceOpts?.suppressToolProgressMessages && !requiresDurableToolResult) return false;
				if (isFastModeAutoProgressPayload(payload) && !requiresDurableToolResult) {
					const verboseToolResult = shouldEmitVerboseToolResult();
					const lifecycleToolResult = sourceOpts?.allowToolLifecycleWhenProgressHidden === true;
					const callback = (!(turn.queued.run.sourceReplyDeliveryMode === "message_tool_only") || sourceOpts?.allowProgressCallbacksWhenSourceDeliverySuppressed === true) && (forceToolResultProgress || verboseToolResult || lifecycleToolResult) ? sourceOpts?.onToolResult : void 0;
					if (callback) {
						if ((await settleProgressVisibilityCallbackResult(callback(payload))).visible) return true;
						if (!forceToolResultProgress && !verboseToolResult) return false;
					}
					if (!forceToolResultProgress && !verboseToolResult) return false;
					await params.onToolResult(payload, { runId: turn.runId });
					return true;
				}
				const verboseToolResult = !requiresDurableToolResult && shouldEmitVerboseToolResult();
				const transientToolResultProgress = requiresDurableToolResult ? void 0 : channelToolResultProgress;
				const toolResultDeliveryAvailable = Boolean(transientToolResultProgress) || verboseToolResult || requiresDurableToolResult;
				if (turn.queued.run.sourceReplyDeliveryMode === "message_tool_only" && !toolResultDeliveryAvailable) return false;
				return transientToolResultProgress && !verboseToolResult ? (await settleProgressVisibilityCallbackResult(transientToolResultProgress(payload))).visible : await params.onToolResult(payload, { runId: turn.runId }).then(() => true);
			});
		}
	};
	let pendingToolTaskFailure;
	const pendingToolTasks = new class extends Set {
		add(task) {
			const watcher = task.catch((error) => {
				pendingToolTaskFailure ??= error;
				throw error;
			}).finally(() => pendingWorkTasks.delete(watcher));
			watcher.catch(() => void 0);
			pendingWorkTasks.add(watcher);
			return super.add(task);
		}
	}();
	let pendingWorkDrain;
	const drainPendingWork = () => {
		pendingWorkDrain ??= (async () => {
			await drainPendingToolTasks({
				tasks: pendingWorkTasks,
				onTimeout: logVerbose
			});
			pendingToolTasks.clear();
		})();
		return pendingWorkDrain;
	};
	const sessionCtx = buildFollowupTemplateContext(turn);
	if (turn.preflightError) throw turn.preflightError instanceof Error ? turn.preflightError : new Error(formatErrorMessage(turn.preflightError));
	let execution;
	const runStartedAt = Date.now();
	if (turn.preflightFailurePayload) execution = {
		runId: turn.runId,
		outcome: {
			kind: "rejected",
			payload: turn.preflightFailurePayload
		}
	};
	else try {
		turn.queued.run.bootstrapUserProfileId = turn.queued.personalBootstrapEligible ? sessionPersonalProfileId(turn.session.current()) : void 0;
		turn.operation.bindToolAuthoritySnapshot(prepareReplyToolAuthority(turn.queued));
		turn.operation.setPhase("running");
		const gatewayOwnsCompletion = turn.queued.queuedFollowupReplyDisposition?.kind === "deliver" && turn.queued.queuedFollowupReplyDisposition.deliver.ownsCompletion?.(turn.queued.originatingChannel) === true;
		if (gatewayOwnsCompletion) turn.queued.run.mediaNormalizationOwner = "gateway";
		const execute = () => executeAgentTurn({
			completionSource: gatewayOwnsCompletion ? "reply-dispatch" : void 0,
			commandBody: turn.queued.prompt,
			transcriptCommandBody: turn.queued.transcriptPrompt,
			followupRun: turn.queued,
			sessionCtx,
			replyOperation: turn.operation,
			opts: progressOpts,
			resolveVisibleReplyDelivery: async () => {
				await drainPendingWork();
				return visibleReplyDelivered;
			},
			typingSignals,
			blockReplyPipeline: null,
			blockStreamingEnabled: false,
			resolvedBlockStreamingBreak: turn.queued.run.blockReplyBreak,
			applyReplyToMode: (payload) => payload,
			shouldEmitToolResult,
			shouldEmitToolOutput,
			pendingToolTasks,
			resetSessionAfterRoleOrderingConflict: async (reason) => {
				const session = turn.session;
				if (session.kind !== "session") return false;
				return await resetReplyRunSession({
					options: {
						failureLabel: "role ordering conflict",
						buildLogMessage: (nextSessionId) => `Role ordering conflict (${reason}). Restarting session ${session.key} -> ${nextSessionId}.`,
						cleanupTranscripts: true
					},
					sessionKey: session.key,
					queueKey: session.key,
					activeSessionEntry: session.current(),
					activeSessionStore: turn.sessionStore,
					storePath: session.storePath,
					followupRun: turn.queued,
					onActiveSessionEntry: (entry) => {
						session.adopt(entry);
						turn.operation.updateSessionId(entry.sessionId);
					},
					onNewSession: () => void 0
				});
			},
			isHeartbeat,
			sessionKey: turn.session.kind === "session" ? turn.session.key : void 0,
			runtimePolicySessionKey: turn.queued.run.runtimePolicySessionKey,
			getActiveSessionEntry: turn.session.current,
			activeSessionStore: turn.sessionStore,
			storePath: turn.session.kind === "session" ? turn.session.storePath : void 0,
			resolvedVerboseLevel: currentVerboseLevel() ?? "off",
			toolProgressDetail: defaults.toolProgressDetail,
			onCompactionNoticePayload: async (payload) => {
				await enqueueProgressResult(async () => {
					if (!progressAllowed()) return false;
					await params.onCompactionNoticePayload(payload, { runId: turn.runId });
					return true;
				});
			}
		});
		const recorder = turn.queued.userTurnTranscriptRecorder;
		await recorder?.resolveMessage();
		turn.operation.abortSignal.throwIfAborted();
		execution = await (recorder?.withPendingInput ? recorder.withPendingInput(execute) : execute());
	} catch (error) {
		await drainPendingWork();
		if (!hasReplyOperationExecutionStarted(turn.operation)) throw error;
		turn.operation.fail("run_failed", error);
		execution = {
			runId: turn.runId,
			outcome: {
				kind: "rejected",
				payload: buildTerminalAgentRunFailureReplyPayload({
					isHeartbeat,
					replyExpectation: terminalReplyExpectation,
					visibleReplyDelivered
				})
			}
		};
	}
	recordReplyOperationAgentTurn(turn.queued.replyOperationRunStates, turn.operation, execution.outcome);
	return {
		commentaryPayloadsEnabled,
		execution,
		runStartedAt,
		sessionCtx,
		pendingToolTasks,
		progress: { drain: async () => {
			await drainPendingWork();
			const firstFailure = pendingProgressTaskFailure ?? pendingToolTaskFailure;
			if (firstFailure !== void 0) throw firstFailure instanceof Error ? firstFailure : new Error(formatErrorMessage(firstFailure));
		} }
	};
}
//#endregion
//#region src/auto-reply/reply/followup-runner.ts
/** Composes queued admission, canonical execution, accounting, and delivery. */
function resolveFollowupCompletion(outcome) {
	const meta = outcome.kind === "settled" ? outcome.result.meta : void 0;
	const failed = outcome.kind === "rejected" || outcome.kind === "settled" && outcome.status === "failed";
	const terminal = buildAgentRunTerminalOutcomeFromLifecycleEvent({
		phase: failed ? "error" : "end",
		data: {
			aborted: outcome.kind === "aborted" || meta?.aborted,
			stopReason: outcome.kind === "aborted" ? outcome.reason === "user" ? "aborted" : outcome.reason : meta?.stopReason,
			timeoutPhase: meta?.timeoutPhase,
			providerStarted: meta?.providerStarted,
			livenessState: meta?.livenessState,
			error: outcome.kind === "rejected" ? outcome.payload.text : outcome.kind === "settled" && outcome.status === "failed" ? outcome.terminalFailurePayload.text : meta?.error?.message
		}
	});
	const classification = classifyAgentRunTerminalOutcome(terminal);
	const stopReason = terminal.stopReason ? { stopReason: terminal.stopReason } : {};
	if (classification === "cancellation") return {
		kind: "aborted",
		...stopReason
	};
	if (classification === "failure" || classification === "timeout") return {
		kind: "failed",
		error: terminal.error ?? "Follow-up failed.",
		...stopReason,
		...classification === "timeout" ? { errorKind: "timeout" } : {}
	};
	return {
		kind: "completed",
		...stopReason
	};
}
/** Creates the function that drains one queued follow-up run. */
function createFollowupRunner(initialDefaults) {
	const resolveGatewayContext = Object.hasOwn(initialDefaults, "resolveGatewayContext") ? initialDefaults.resolveGatewayContext : getPluginRuntimeGatewayRequestScope()?.resolveGatewayContext;
	const defaults = {
		...initialDefaults,
		resolveGatewayContext
	};
	const runFollowup = (queued) => withPluginRuntimeGatewayContextResolver(resolveGatewayContext, () => executeFollowup(queued), { inheritRequestScope: false });
	const executeFollowup = async (queued) => {
		let disposition = {
			kind: "retry",
			error: void 0
		};
		let operation;
		let admittedRunId;
		let admittedTurn;
		let terminalPayloads = [];
		let progressContinuation;
		const admissionNotices = [];
		let completion = { kind: "completed" };
		let queuedFollowupAdmitted = false;
		const initiallyAborted = isFollowupRunAborted(queued);
		const endDeliveryCorrelations = initiallyAborted ? [] : (queued.deliveryCorrelations ?? []).map((correlation) => correlation.begin()).filter((end) => typeof end === "function");
		try {
			if (initiallyAborted) {
				disposition = { kind: "consumed" };
				return;
			}
			const admission = await admitFollowupTurn({
				queued,
				defaults,
				onCompactionNoticePayload: async (payload, turn) => {
					const source = turn.queued.queuedFollowupReplyDisposition;
					if (source?.kind === "deliver" && source.deliver.ownsCompletion?.(turn.queued.originatingChannel)) admissionNotices.push(payload);
					else await deliverFollowupDecision({
						decision: {
							kind: "deliver",
							payloads: [payload]
						},
						turn,
						defaults,
						runId: turn.runId,
						runFollowup,
						kind: "block"
					});
				}
			});
			switch (admission.kind) {
				case "deferred": throw new FollowupRunDeferredError(`Follow-up reply lane is still active (${admission.reason})`);
				case "skipped":
					operation = admission.operation;
					disposition = { kind: "consumed" };
					return;
			}
			const turn = admission.turn;
			admittedTurn = turn;
			admittedRunId = turn.runId;
			operation = turn.operation;
			queuedFollowupAdmitted = true;
			const execution = await executeFollowupTurn({
				turn,
				defaults,
				onToolResult: async (payload, identity) => {
					await deliverFollowupDecision({
						decision: {
							kind: "deliver",
							payloads: [payload]
						},
						turn,
						defaults,
						runId: identity.runId,
						runFollowup,
						kind: "tool"
					});
				},
				onCompactionNoticePayload: async (payload, identity) => {
					await deliverFollowupDecision({
						decision: {
							kind: "deliver",
							payloads: [payload]
						},
						turn,
						defaults,
						runId: identity.runId,
						runFollowup,
						kind: "block"
					});
				}
			});
			disposition = { kind: "consumed" };
			completion = resolveFollowupCompletion(execution.execution.outcome);
			try {
				await execution.progress.drain();
			} catch (error) {
				if (completion.kind === "completed") completion = {
					kind: "failed",
					error: formatErrorMessage(error)
				};
				defaultRuntime.error?.(`followup queue: progress presentation failed after execution: ${formatErrorMessage(error)}`);
				operation.fail("run_failed", error);
			}
			if (admissionNotices.length > 0 && turn.sendPolicy === "allow" && turn.queued.currentInboundEventKind !== "room_event") await deliverFollowupDecision({
				decision: {
					kind: "deliver",
					payloads: admissionNotices
				},
				turn,
				defaults,
				runId: turn.runId,
				runFollowup,
				kind: "block"
			});
			if (execution.execution.outcome.kind === "settled" && hasCompletedSourceReplyDeliveryEvidence(execution.execution.outcome.result)) await defaults.opts?.onObservedReplyDelivery?.();
			const accounting = await accountFollowupTurn({
				turn,
				defaults,
				execution
			});
			const deliveryOpts = {
				...defaults.opts,
				commentaryPayloadsEnabled: execution.commentaryPayloadsEnabled
			};
			const decision = await resolveFollowupDeliveryDecision({
				turn,
				execution: execution.execution,
				accounting,
				opts: deliveryOpts
			});
			if (decision.kind === "deliver") for (const payload of decision.payloads) {
				progressContinuation = getReplyPayloadMetadata(payload)?.progressContinuation;
				if (progressContinuation) break;
			}
			if (completion.kind === "completed" && decision.kind === "suppress" && (decision.reason === "silent" || decision.reason === "message-tool-only")) completion = {
				...completion,
				allowCanvasOnly: true
			};
			const delivery = await deliverFollowupDecision({
				decision,
				turn,
				defaults,
				runId: execution.execution.runId,
				runFollowup
			});
			terminalPayloads = delivery.kind === "completed" ? delivery.payloads : [];
		} catch (error) {
			let operatorAuthorityLost = false;
			try {
				queued.operatorAuthority?.assertCurrent();
			} catch {
				operatorAuthorityLost = true;
			}
			if (operatorAuthorityLost) {
				disposition = { kind: "consumed" };
				completion = { kind: "aborted" };
				defaultRuntime.error?.("followup queue: canceled input after loss of operator authority");
			} else if (error instanceof FollowupRunDeferredError) disposition = {
				kind: "deferred",
				reason: error.message
			};
			else if (operation?.result?.kind === "aborted" && operation.result.code === "aborted_by_user") {
				disposition = { kind: "consumed" };
				completion = resolveFollowupCompletion({
					kind: "aborted",
					reason: "user"
				});
			} else if (disposition.kind === "consumed") {
				completion = {
					kind: "failed",
					error: formatErrorMessage(error)
				};
				defaultRuntime.error?.(`followup queue: terminal handling failed after execution; refusing replay: ${formatErrorMessage(error)}`);
				operation?.fail("run_failed", error);
			} else disposition = {
				kind: "retry",
				error
			};
		} finally {
			const sourceDisposition = admittedTurn?.queued.queuedFollowupReplyDisposition;
			if (disposition.kind === "consumed" && admittedTurn && sourceDisposition?.kind === "deliver") try {
				await sourceDisposition.deliver({
					kind: "queued-followup",
					runId: admittedTurn.runId,
					originatingChannel: admittedTurn.queued.originatingChannel,
					payloads: terminalPayloads,
					completion
				});
			} catch (error) {
				defaultRuntime.error?.(`followup queue: completion delivery failed; refusing replay: ${formatErrorMessage(error)}`);
				operation?.fail("run_failed", error);
			}
			try {
				if (queuedFollowupAdmitted) await settleQueuedFollowupPresentation(defaults);
			} finally {
				progressContinuation?.close();
			}
			for (const end of endDeliveryCorrelations.toReversed()) try {
				end();
			} catch (error) {
				defaultRuntime.error?.(`followup queue: delivery correlation cleanup failed: ${formatErrorMessage(error)}`);
			}
			if (disposition.kind === "consumed") {
				completeFollowupRunLifecycle(queued);
				if (admittedRunId) clearAgentRunContext(admittedRunId);
			} else if (disposition.kind === "retry" && admittedRunId) clearAgentRunContext(admittedRunId);
			operation?.complete();
			defaults.typing.markRunComplete();
			defaults.typing.markDispatchIdle();
		}
		if (disposition.kind === "deferred") throw new FollowupRunDeferredError(`Follow-up reply lane is still active (${disposition.reason})`);
		if (disposition.kind === "retry") throw disposition.error;
	};
	return runFollowup;
}
//#endregion
//#region src/auto-reply/reply/agent-runner-execute.ts
function markPostCompactionFailureResult(result, postCompactionModelFailure) {
	if (Array.isArray(result)) return result.map((payload) => markPostCompactionModelFailurePayload(postCompactionModelFailure, payload));
	return result ? markPostCompactionModelFailurePayload(postCompactionModelFailure, result) : result;
}
async function executePreparedReplyAgentRun(input) {
	const context = { ...input };
	const { activeSessionStore, admitUserTurn: admitUserTurnWithRecovery, beginBeforeAgentReply: beginBeforeAgentReplyWithRecovery, cfg, checkpointBeforeAgentReply: checkpointBeforeAgentReplyWithRecovery, defaultModel, followupRun, getActiveIsNewSession, getActiveSessionEntry, opts, replyOperation, replyThreadingOverride, returnWithQueuedFollowupDrain, runtimePolicySessionKey, sendDirectCompactionNotice, sessionCtx, sessionKey, setActiveSessionEntry, setRunFollowupTurn, storePath, toolProgressDetail, traceAgentPhase, turnAdoptionLifecycle, typing, typingMode, typingSignals } = context;
	let activeSessionEntry = getActiveSessionEntry();
	const admitUserTurn = async (...args) => {
		const result = await admitUserTurnWithRecovery(...args);
		activeSessionEntry = getActiveSessionEntry();
		return result;
	};
	const beginBeforeAgentReply = async (...args) => {
		const result = await beginBeforeAgentReplyWithRecovery(...args);
		activeSessionEntry = getActiveSessionEntry();
		return result;
	};
	const checkpointBeforeAgentReply = async (...args) => {
		const result = await checkpointBeforeAgentReplyWithRecovery(...args);
		activeSessionEntry = getActiveSessionEntry();
		return result;
	};
	await typingSignals.signalRunStart();
	const preflightAdmission = readPendingUserTurnTranscriptAdmission(followupRun.userTurnTranscriptRecorder);
	const checkpointMemory = async (entry) => {
		const flushed = await traceAgentPhase("reply.memory_flush", () => runMemoryFlushIfNeeded({
			...context,
			preflightAdmission,
			promptForEstimate: followupRun.prompt,
			sessionEntry: entry,
			sessionStore: activeSessionStore
		}));
		setActiveSessionEntry(flushed.sessionEntry);
		replyOperation.abortSignal.throwIfAborted();
		if (flushed.outcome === "exhausted") await sendDirectCompactionNotice?.("memory_flush_degraded");
		return flushed.sessionEntry;
	};
	const prePreflightCompactionCount = activeSessionEntry?.compactionCount ?? 0;
	activeSessionEntry = await traceAgentPhase("reply.preflight_compaction", () => runSessionCompactionIfNeeded({
		...context,
		pendingUserEntryId: preflightAdmission?.entryId,
		promptForEstimate: followupRun.prompt,
		sessionEntry: activeSessionEntry,
		sessionStore: activeSessionStore,
		abortSignal: replyOperation.abortSignal,
		beforeCompaction: checkpointMemory,
		onCompactionStart: () => replyOperation.setPhase("preflight_compacting"),
		onSessionIdChanged: (sessionId) => replyOperation.updateSessionId(sessionId),
		onCompactionNotice: sendDirectCompactionNotice
	}));
	setActiveSessionEntry(activeSessionEntry);
	const preflightCompactionApplied = (activeSessionEntry?.compactionCount ?? 0) > prePreflightCompactionCount;
	const runFollowupTurn = createFollowupRunner({
		resolveGatewayContext: getGatewayContextResolver(replyOperation),
		opts,
		typing,
		typingMode,
		sessionEntry: activeSessionEntry,
		sessionStore: activeSessionStore,
		sessionKey,
		storePath,
		defaultModel,
		toolProgressDetail
	});
	setRunFollowupTurn(runFollowupTurn);
	replyOperation.setPhase("running");
	const runStartedAt = Date.now();
	if (await admitUserTurn(followupRun.userTurnTranscriptRecorder) === "duplicate-source") return returnWithQueuedFollowupDrain(void 0);
	await turnAdoptionLifecycle?.onAdopted();
	const runOutcome = await withBeforeAgentReplyObserver({
		beforeDispatch: async () => {
			return await beginBeforeAgentReply();
		},
		afterDispatch: async (hookResult) => {
			if (!hookResult?.handled) {
				await checkpointBeforeAgentReply({ state: void 0 });
				return hookResult;
			}
			const hookReply = hookResult.reply ?? { text: "NO_REPLY" };
			const hookFinalDeliveryText = buildRecoverablePendingFinalDeliveryText([hookReply]);
			const normalizedHookReplies = normalizePendingFinalDeliveryPayloads([hookReply]);
			let hookCheckpoint = { state: normalizedHookReplies.length === 0 ? "handled-silent" : "pending" };
			if (sessionKey && storePath && normalizedHookReplies.length > 0) {
				if (!resolveSourceReplyPolicy({
					cfg,
					sessionCtx,
					sessionEntry: activeSessionEntry,
					sessionKey,
					runtimePolicySessionKey,
					opts
				}).suppressDelivery) {
					const pendingFinalDeliveryIntentId = crypto.randomUUID();
					const pendingFinalDeliveryDeliveryId = crypto.randomUUID();
					setReplyPayloadMetadata(hookReply, { pendingFinalDeliveryCompletion: {
						agentId: followupRun.run.agentId,
						deliveryId: pendingFinalDeliveryDeliveryId,
						intentId: pendingFinalDeliveryIntentId,
						...activeSessionEntry?.restartRecoveryDeliveryRunId ? { recoveryRunId: activeSessionEntry.restartRecoveryDeliveryRunId } : {},
						sessionId: replyOperation.sessionId,
						sessionKey,
						storePath
					} });
					hookCheckpoint = {
						state: "handled-reply",
						pendingFinalDelivery: {
							text: hookFinalDeliveryText ?? "",
							intentId: pendingFinalDeliveryIntentId,
							deliveries: [{
								id: pendingFinalDeliveryDeliveryId,
								state: "prepared"
							}],
							context: resolveReplyRunDeliveryContext({
								cfg,
								sessionCtx,
								sessionEntry: activeSessionEntry,
								sessionKey,
								runtimePolicySessionKey,
								opts
							})
						}
					};
				} else hookCheckpoint = { state: "handled-silent" };
			}
			await checkpointBeforeAgentReply(hookCheckpoint);
			return {
				...hookResult,
				reply: hookReply
			};
		}
	}, () => traceAgentPhase("reply.run_agent_turn", () => executeAgentTurn({
		...context,
		resolveVisibleReplyDelivery: input.resolveVisibleReplyDelivery,
		replyThreading: replyThreadingOverride ?? sessionCtx.ReplyThreading
	})));
	const operationSuperseded = isReplyOperationSuperseded(replyOperation);
	recordReplyOperationAgentTurn(followupRun.replyOperationRunStates, replyOperation, runOutcome.outcome);
	activeSessionEntry = getActiveSessionEntry();
	const activeIsNewSession = getActiveIsNewSession();
	if (runOutcome.outcome.kind !== "settled") await accountAgentTurnCompaction({
		compaction: runOutcome.outcome.compaction,
		sessionStore: activeSessionStore,
		replyOperation
	});
	if (operationSuperseded) return { text: SILENT_REPLY_TOKEN };
	if (runOutcome.outcome.kind !== "settled") {
		if (runOutcome.outcome.kind === "rejected" && !replyOperation.result) replyOperation.fail("run_failed", /* @__PURE__ */ new Error("reply operation exited with final payload"));
		return returnWithQueuedFollowupDrain(runOutcome.outcome.kind === "rejected" ? markPostCompactionModelFailurePayload(runOutcome.outcome.postCompactionModelFailure, runOutcome.outcome.payload) : { text: SILENT_REPLY_TOKEN });
	}
	return markPostCompactionFailureResult(await finalizeReplyAgentRun({
		...context,
		activeIsNewSession,
		activeSessionEntry,
		preflightCompactionApplied,
		runFollowupTurn,
		execution: runOutcome.outcome,
		runId: runOutcome.runId,
		runStartedAt
	}), runOutcome.outcome.postCompactionModelFailure);
}
function createReplyAgentRestartRecoveryController(context) {
	const { activeSessionStore, cfg, followupRun, getActiveSessionEntry, opts, replyOperation, restartRecoverySourceTurnId, runtimePolicySessionKey, sessionCtx, sessionKey, setActiveSessionEntry, storePath } = context;
	const restartRecoverySameChannelThreadRequired = restartRecoverySourceTurnId ? buildThreadingToolContext({
		sessionCtx,
		config: cfg,
		hasRepliedRef: void 0
	}).sameChannelThreadRequired : void 0;
	const admissionRunId = normalizeOptionalString(sessionCtx.MessageSid) ?? normalizeOptionalString(sessionCtx.MessageSidFull);
	const { admitUserTurn, beginBeforeAgentReply, checkpointBeforeAgentReply, clear: clearRestartRecoveryDeliveryClaim, isArmed: isRestartRecoveryArmed } = createReplyRestartRecoveryClaimController({
		agentId: followupRun.run.agentId,
		lifecycleGeneration: replyOperation.lifecycleGeneration,
		admissionRunId,
		getEntry: () => sessionKey ? activeSessionStore?.[sessionKey] ?? getActiveSessionEntry() : getActiveSessionEntry(),
		getSessionId: () => replyOperation.sessionId,
		isRestartAbort: () => replyOperation.result?.kind === "aborted" && replyOperation.result.code === "aborted_for_restart",
		resolveDeliveryContext: (entry) => sessionKey ? resolveReplyRunDeliveryContext({
			cfg,
			sessionCtx,
			sessionEntry: entry,
			sessionKey,
			runtimePolicySessionKey,
			opts
		}) : void 0,
		requesterAccountId: followupRun.originatingAccountId ?? sessionCtx.AccountId ?? followupRun.run.agentAccountId,
		requesterSenderId: sessionCtx.SenderId,
		resolveUserTurnTarget: ({ entry, sessionId, sessionKey: targetSessionKey, storePath: targetStorePath }) => ({
			sessionId,
			sessionKey: targetSessionKey,
			sessionEntry: entry,
			...activeSessionStore ? { sessionStore: activeSessionStore } : {},
			storePath: targetStorePath,
			agentId: followupRun.run.agentId,
			cwd: followupRun.run.workspaceDir,
			config: cfg
		}),
		...sessionKey ? { sessionKey } : {},
		setEntry: (entry) => {
			setActiveSessionEntry(entry);
			if (activeSessionStore && sessionKey) activeSessionStore[sessionKey] = entry;
		},
		sameChannelThreadRequired: restartRecoverySameChannelThreadRequired,
		sourceTurnId: restartRecoverySourceTurnId,
		sourceReplyDeliveryMode: sessionKey ? resolveSourceReplyPolicy({
			cfg,
			sessionCtx,
			sessionEntry: getActiveSessionEntry(),
			sessionKey,
			runtimePolicySessionKey,
			opts
		}).sourceReplyDeliveryMode : opts?.sourceReplyDeliveryMode,
		...storePath ? { storePath } : {}
	});
	const admitUserTurnWithSourceBinding = async (...args) => {
		const result = await admitUserTurn(...args);
		if (result === "admitted") {
			let sourceTurnId = restartRecoverySourceTurnId;
			if (!sourceTurnId && admissionRunId && isInternalMessageChannel(sessionCtx.Provider ?? sessionCtx.Surface)) {
				const entry = getActiveSessionEntry();
				sourceTurnId = entry?.restartRecoveryDeliveryRunId === admissionRunId ? normalizeOptionalString(entry?.restartRecoveryDeliverySourceRunId) ?? admissionRunId : admissionRunId;
			}
			if (sourceTurnId) replyRunRegistry.bindSourceTurnId(replyOperation, sourceTurnId);
		}
		return result;
	};
	return {
		admitUserTurn: admitUserTurnWithSourceBinding,
		beginBeforeAgentReply,
		checkpointBeforeAgentReply,
		clear: clearRestartRecoveryDeliveryClaim,
		isArmed: isRestartRecoveryArmed
	};
}
//#endregion
//#region src/auto-reply/reply/agent-runner-question-input.ts
/** Question-only runtimes accept answers without exposing ordinary steering. */
async function runReplyQuestionInput(params) {
	const { followupRun, opts, sessionKey } = params;
	const external = followupRun.run.inputProvenance === void 0 || followupRun.run.inputProvenance.kind === "external_user";
	const text = (params.transcriptCommandBody ?? followupRun.transcriptPrompt ?? params.commandBody).trim();
	if (!sessionKey || opts?.isHeartbeat || params.resetTriggered || opts?.messageInjectionDisposition === "accepted" || !external || !text || followupRun.images?.length || followupRun.media?.length) return { handled: false };
	const caller = resolveInboundReplyToolAuthorityOverlay({
		ctx: params.sessionCtx,
		sessionEntry: params.sessionEntry,
		senderIsOwner: followupRun.run.senderIsOwner === true,
		operatorAuthority: followupRun.operatorAuthority,
		toolsAllow: followupRun.toolsAllow,
		disableTools: followupRun.disableTools === true
	});
	const sourceAbort = opts?.abortSignal;
	const queuedAbort = resolveFollowupAbortSignal(followupRun);
	const assertSourceCurrent = () => {
		sourceAbort?.throwIfAborted();
		queuedAbort?.throwIfAborted();
		followupRun.operatorAuthority?.assertCurrent();
	};
	const state = resolveReplyOperationRunState(opts);
	let outcome;
	try {
		if (!await claimPendingAgentQuestionAnswerFromCaller({
			sessionKey,
			text,
			caller,
			assertSourceCurrent,
			sourceRecorder: followupRun.userTurnTranscriptRecorder,
			onAnswerProcessed: () => {
				if (state) state.questionInputHandled = true;
			}
		})) return { handled: false };
		outcome = { status: "answered" };
	} catch (error) {
		if (error instanceof QuestionDispatchUnsupportedError) {
			assertSourceCurrent();
			return { handled: false };
		}
		if (error instanceof QuestionDispatchRefusedError) {
			if (state) state.admission = {
				status: "skipped",
				reason: "question-response-refused"
			};
			return {
				handled: true,
				payload: markReplyPayloadForSourceSuppressionDelivery({
					text: `The answer was not sent: ${error.message}. Use the question controls in the Control UI, or check the active run and your permissions before retrying.`,
					isError: true
				})
			};
		}
		const rejection = readQuestionRejection(error);
		if (rejection?.code === "INVALID_REQUEST" && rejection.reason === "QUESTION_INVALID_ANSWER") {
			const detail = error instanceof Error ? error.message.trim() : "";
			if (state) state.admission = {
				status: "skipped",
				reason: "question-response-rejected"
			};
			return {
				handled: true,
				payload: markReplyPayloadForSourceSuppressionDelivery({
					text: `${detail ? `The answer was not accepted: ${detail}.` : "The answer was not accepted because a question is still unanswered."} The question is still open, so reply again and answer every question by number or question id.`,
					isError: true
				})
			};
		}
		if (!(error instanceof QuestionAnswerUnconfirmedError)) throw error;
		outcome = {
			status: "indeterminate",
			errorMessage: error.message
		};
	}
	if (state) state.admission = outcome.status === "indeterminate" ? {
		status: "skipped",
		reason: "question-response-indeterminate"
	} : {
		status: "accepted",
		mode: "steer"
	};
	try {
		await admitFollowupRunLifecycle(followupRun);
	} catch (error) {
		logVerbose(`question input adoption failed after custody transferred: ${String(error)}`);
	} finally {
		completeFollowupRunLifecycle(followupRun, "consumed");
	}
	return {
		handled: true,
		payload: outcome.status === "indeterminate" ? markReplyPayloadForSourceSuppressionDelivery({
			text: outcome.errorMessage,
			isError: true
		}) : void 0
	};
}
//#endregion
//#region src/auto-reply/reply/reply-run-typing.ts
const typingByReplyOperation = /* @__PURE__ */ new WeakMap();
/** Keep one feedback controller attached to the task that owns a reply run. */
function bindReplyOperationTyping(operation, typing) {
	if (typingByReplyOperation.has(operation)) return;
	typingByReplyOperation.set(operation, typing);
	runAfterReplyOperationClear(operation, () => {
		if (typingByReplyOperation.get(operation) !== typing) return;
		typingByReplyOperation.delete(operation);
		typing.cleanup();
	});
}
/** Refresh the continuing task's feedback after it adopts another inbound turn. */
async function refreshReplyOperationTyping(operation, options) {
	const typing = typingByReplyOperation.get(operation);
	if (!typing || operation.result || !options.startIfIdle && !typing.isActive()) return;
	await typing.startTypingLoop();
}
//#endregion
//#region src/auto-reply/reply/agent-runner-steer-adoption.ts
function resolveAcceptedSteerRunId(params) {
	const { followupRun, sessionCtx } = params;
	return expectDefined(params.restartRecoverySourceTurnId ?? buildChannelSourceTurnId({
		provider: followupRun.originatingChannel ?? followupRun.run.messageProvider ?? sessionCtx.Provider,
		accountId: followupRun.originatingAccountId ?? followupRun.run.agentAccountId ?? sessionCtx.AccountId,
		conversationId: followupRun.originatingTo ?? followupRun.originatingChatId ?? params.sessionKey ?? followupRun.run.sessionKey,
		messageId: followupRun.messageId ?? sessionCtx.MessageSidFull ?? sessionCtx.MessageSid
	}) ?? normalizeOptionalString(params.opts?.runId), "steered turn id");
}
async function runActiveReplySteer(params) {
	const { followupRun, queueKey, releaseAdmissionTicket, replyOperationRunState, resolvedQueue, runFollowup, sessionKey, touchActiveSessionEntry, typing, typingSignals } = params;
	const registeredReplyOperation = sessionKey ? replyRunRegistry.get(sessionKey) : void 0;
	const activeReplyOperation = params.providedReplyOperation?.key === sessionKey ? params.providedReplyOperation : registeredReplyOperation ?? params.providedReplyOperation;
	const steerSessionId = activeReplyOperation?.sessionId ?? followupRun.run.sessionId;
	const injectionTarget = replyRunRegistry.resolveCurrentMessageInjectionTarget(activeReplyOperation?.key ?? queueKey);
	const parked = parkSteerCandidate(queueKey, followupRun, resolvedQueue, runFollowup);
	if (!parked) {
		releaseAdmissionTicket();
		typing.cleanup();
		return "handled";
	}
	const scheduleParkedFallback = () => {
		const owner = replyRunRegistry.get(queueKey);
		if (owner) scheduleFollowupDrainAfterReplyOperationClear({
			operation: owner,
			queueKey,
			runFollowup
		});
		else scheduleFollowupDrain(queueKey, runFollowup);
	};
	scheduleParkedFallback();
	releaseAdmissionTicket();
	const fallback = async (reason) => {
		parked.fallback();
		if (replyOperationRunState) replyOperationRunState.admission = {
			status: "accepted",
			mode: "followup"
		};
		if (reason) logVerbose(`queue: active session ${steerSessionId} rejected steering (${reason})`);
		await touchActiveSessionEntry();
		typing.cleanup();
		return "handled";
	};
	try {
		const admission = await parked.admit();
		if (admission === "cancelled") {
			parked.consume();
			typing.cleanup();
			return "handled";
		}
		if (admission === "fallback") return await fallback();
		if (!injectionTarget) return await fallback("no injectable reply operation");
		let entry = params.sessionEntry;
		if (sessionKey && params.storePath) try {
			entry = loadSessionEntry({
				sessionKey,
				storePath: params.storePath,
				readConsistency: "latest"
			}) ?? entry;
		} catch (error) {
			return await fallback(`session entry unavailable: ${formatErrorMessage(error)}`);
		}
		if (isRestartRecoveryTerminalDeliveryFailClosed(entry, steerSessionId, injectionTarget.sourceTurnId ?? normalizeOptionalString(entry?.restartRecoveryDeliverySourceRunId) ?? "")) return await fallback("terminal source-reply delivery is closed");
		const injectionAttempt = beginReplyMessageInjectionTarget(injectionTarget, followupRun.prompt, {
			assertCurrent: followupRun.operatorAuthority?.assertCurrent,
			steeringMode: "all",
			isInboundUserMessage: followupRun.currentInboundEventKind !== "room_event" && (followupRun.run.inputProvenance?.kind === void 0 || followupRun.run.inputProvenance.kind === "external_user"),
			terminalReplyExpectation: followupRun.run.terminalReplyExpectation,
			toolAuthorityFingerprint: params.toolAuthorityFingerprint,
			...params.pendingInputAuthorityFingerprint ? { pendingInputAuthorityFingerprint: params.pendingInputAuthorityFingerprint } : {},
			...followupRun.images?.length ? { images: followupRun.images } : {},
			...followupRun.imageOrder?.length ? { imageOrder: followupRun.imageOrder } : {},
			...followupRun.media?.length ? { media: followupRun.media } : {},
			waitForTranscriptCommit: true,
			queueIdentity: resolveAcceptedSteerRunId(params),
			abortSignal: resolveFollowupAbortSignal(followupRun),
			onQueueAccepted: parked.accepted,
			...resolvedQueue.debounceMs !== void 0 ? { debounceMs: resolvedQueue.debounceMs } : {},
			...followupRun.run.sourceReplyDeliveryMode ? { sourceReplyDeliveryMode: followupRun.run.sourceReplyDeliveryMode } : {},
			taskSuggestionDeliveryMode: followupRun.run.taskSuggestionDeliveryMode,
			...followupRun.userTurnTranscriptRecorder ? { userTurnTranscriptRecorder: followupRun.userTurnTranscriptRecorder } : {}
		});
		const finalization = await finalizeReplyMessageInjectionAttempt({
			attempt: injectionAttempt,
			target: injectionTarget,
			inboundAudio: followupRun.currentInboundAudio === true,
			onOutcome: (outcome) => {
				if (replyOperationRunState) replyOperationRunState.admission = outcome === "indeterminate" ? {
					status: "skipped",
					reason: "question-response-indeterminate"
				} : {
					status: "accepted",
					mode: "steer"
				};
			},
			onAdopted: () => admitFollowupRunLifecycle(followupRun),
			shouldAbortOnAdoptionError: isIngressAdoptionLostError
		});
		if (finalization.status === "rejected") return await fallback(finalization.outcome.reason);
		parked.consume("consumed");
		if (finalization.status === "indeterminate") {
			typing.cleanup();
			return markReplyPayloadForSourceSuppressionDelivery({
				text: finalization.outcome.errorMessage,
				isError: true
			});
		}
		const transcriptCommitUnconfirmed = finalization.outcome.result?.transcriptCommit === "unconfirmed";
		if (finalization.aborted) {
			if (replyOperationRunState) replyOperationRunState.messageInjectionAborted = true;
			const reason = transcriptCommitUnconfirmed ? finalization.outcome.result?.errorMessage ?? "transcript commitment unconfirmed" : `adoption lost: ${formatErrorMessage(finalization.adoptionError)}`;
			logVerbose(`queue: active session ${steerSessionId} aborted exact steered target without replay (${reason})`);
			typing.cleanup();
			return "handled";
		}
		if (finalization.adoptionError) logVerbose(`queue: active session ${steerSessionId} adoption finalizer failed: ${formatErrorMessage(finalization.adoptionError)}`);
		if (activeReplyOperation) await refreshReplyOperationTyping(activeReplyOperation, { startIfIdle: typingSignals.shouldStartImmediately });
		await touchActiveSessionEntry();
		typing.cleanup();
		return "handled";
	} catch (error) {
		if (resolveFollowupAbortSignal(followupRun)?.aborted) parked.consume();
		else parked.fallback();
		throw error;
	} finally {
		if (followupRun.steerPending) {
			if (resolveFollowupAbortSignal(followupRun)?.aborted) parked.consume();
			else parked.fallback();
		}
	}
}
//#endregion
//#region src/auto-reply/reply/agent-runner-run.ts
async function runReplyAgent(input) {
	const params = { ...input };
	const { followupRun, queueKey, resolvedQueue, shouldSteer, shouldFollowup, queueAdmissionState = "empty", isActive, isRunActive, opts, typing, sessionEntry, sessionStore, sessionKey, runtimePolicySessionKey, storePath, defaultModel, resolvedVerboseLevel, toolProgressDetail, isNewSession, blockStreamingEnabled, blockReplyChunking, sessionCtx, typingMode, resetTriggered, replyOperation: providedReplyOperation } = params;
	followupRun.operatorAuthority?.assertCurrent();
	const resolveGatewayContext = providedReplyOperation ? getGatewayContextResolver(providedReplyOperation) : readChannelContextGatewayContextResolver(sessionCtx) ?? getPluginRuntimeGatewayRequestScope()?.resolveGatewayContext;
	const turnAdoptionLifecycle = opts?.turnAdoptionLifecycle;
	const releaseAdmissionTicket = () => opts?.[REPLY_ADMISSION_TICKET]?.release();
	let activeSessionEntry = sessionEntry;
	const activeSessionStore = sessionStore;
	let activeIsNewSession = isNewSession;
	const effectiveResetTriggered = resetTriggered === true;
	const activeRunQueueMode = effectiveResetTriggered ? "interrupt" : resolvedQueue.mode;
	const isHeartbeat = opts?.isHeartbeat === true;
	const replyExpectation = followupRun.run.terminalReplyExpectation ??= resolveSourceReplyExpectation({
		ctx: {
			...sessionCtx,
			InboundEventKind: followupRun.currentInboundEventKind ?? sessionCtx.InboundEventKind,
			InputProvenance: followupRun.run.inputProvenance ?? sessionCtx.InputProvenance
		},
		cfg: followupRun.run.config,
		isHeartbeat
	});
	let didDeliverVisiblePartialReply = false;
	const onPartialReply = opts?.onPartialReply;
	const runOpts = onPartialReply ? {
		...opts,
		onPartialReply: async (payload) => {
			const observed = await settleProgressVisibilityCallbackResult(onPartialReply(payload));
			if (observed.visible && hasOutboundReplyContent(payload, { trimText: true })) didDeliverVisiblePartialReply = true;
			return observed.result;
		}
	} : opts;
	const replyOperationRunState = resolveReplyOperationRunState(opts);
	if (replyOperationRunState) replyOperationRunState.replyCompletion = resolveReplyCompletion(followupRun.run.terminalReplyExpectation, "empty");
	followupRun.replyOperationRunStates = replyOperationRunState ? [replyOperationRunState] : void 0;
	const traceAttributes = {
		provider: followupRun.run.provider,
		hasSessionKey: Boolean(sessionKey ?? followupRun.run.sessionKey),
		isHeartbeat,
		queueMode: resolvedQueue.mode,
		isActive,
		blockStreamingEnabled
	};
	const traceAgentPhase = (name, run) => measureDiagnosticsTimelineSpan(name, run, {
		phase: "agent-turn",
		config: followupRun.run.config,
		attributes: traceAttributes
	});
	const effectiveShouldSteer = !isHeartbeat && !effectiveResetTriggered && shouldSteer;
	const effectiveShouldFollowup = !effectiveResetTriggered && shouldFollowup;
	const messageInjectionDisposition = opts?.messageInjectionDisposition ?? "none";
	const incomingToolAuthorityFingerprint = resolveFollowupRunToolAuthorityFingerprint(followupRun);
	const activeReplyOperation = sessionKey ? replyRunRegistry.get(sessionKey) ?? providedReplyOperation : providedReplyOperation;
	const activeToolAuthorityFingerprint = activeReplyOperation?.toolAuthorityFingerprint;
	const incomingAuthorityAtActiveRoute = activeReplyOperation?.toolAuthorityRoute ? resolveFollowupRunToolAuthorityFingerprint(followupRun, activeReplyOperation.toolAuthorityRoute) : void 0;
	const hasAuthorityMismatch = activeReplyOperation !== void 0 && activeToolAuthorityFingerprint !== incomingToolAuthorityFingerprint;
	const hasRouteOnlyAuthorityMismatch = hasAuthorityMismatch && activeToolAuthorityFingerprint !== void 0 && incomingAuthorityAtActiveRoute === activeToolAuthorityFingerprint;
	const shouldQueueAuthorityMismatch = effectiveShouldSteer && isActive && hasAuthorityMismatch && !hasRouteOnlyAuthorityMismatch;
	if (shouldQueueAuthorityMismatch) logVerbose(`queue: active session ${activeReplyOperation?.sessionId ?? followupRun.run.sessionId} has different or unknown tool authority; queuing instead of steering`);
	const typingSignals = createTypingSignaler({
		typing,
		mode: typingMode,
		isHeartbeat
	});
	const restartRecoverySourceTurnId = readChannelSourceTurnId(sessionCtx);
	const restartRecoveryEntry = sessionKey && storePath ? loadSessionEntry({
		agentId: followupRun.run.agentId,
		storePath,
		sessionKey,
		clone: false,
		hydrateSkillPromptRefs: false
	}) ?? activeSessionEntry : activeSessionEntry;
	const activeSourceTurnId = replyRunRegistry.getSourceTurnId(sessionKey ?? "") ?? normalizeOptionalString(restartRecoveryEntry?.restartRecoveryDeliverySourceRunId) ?? "";
	const terminalDeliveryFailClosed = isRestartRecoveryTerminalDeliveryFailClosed(restartRecoveryEntry, activeReplyOperation?.sessionId ?? followupRun.run.sessionId, activeSourceTurnId);
	const shouldQueueTerminalReceiptSteer = effectiveShouldSteer && isActive && !shouldQueueAuthorityMismatch && messageInjectionDisposition === "none" && terminalDeliveryFailClosed;
	if (shouldQueueTerminalReceiptSteer) logVerbose(`queue: active session ${activeReplyOperation?.sessionId ?? followupRun.run.sessionId} is fail-closed for terminal source-reply delivery; queuing instead of steering`);
	if (restartRecoverySourceTurnId && isDuplicateRestartRecoverySource(restartRecoveryEntry, restartRecoverySourceTurnId)) {
		if (restartRecoveryEntry?.status !== "running" && sessionKey && storePath && hasRestartRecoverySourceClaim(restartRecoveryEntry, restartRecoverySourceTurnId)) {
			const retired = await retireTerminalRestartRecoverySourceClaim({
				agentId: followupRun.run.agentId,
				sessionId: restartRecoveryEntry.sessionId,
				sessionKey,
				sourceTurnId: restartRecoverySourceTurnId,
				storePath
			});
			if (retired) {
				activeSessionEntry = retired;
				if (activeSessionStore) activeSessionStore[sessionKey] = retired;
			}
		}
		releaseAdmissionTicket();
		typing.cleanup();
		return;
	}
	const questionInput = await runReplyQuestionInput(input);
	if (questionInput.handled) {
		releaseAdmissionTicket();
		typing.cleanup();
		return questionInput.payload;
	}
	const baseShouldEmitToolResult = createShouldEmitToolResult({
		sessionKey,
		storePath,
		resolvedVerboseLevel,
		verboseLevelOverride: followupRun.run.verboseLevelOverride
	});
	const channelProgressCanConsumeToolResults = Boolean(opts?.forceToolResultProgress) && Boolean(opts?.onToolResult);
	const shouldEmitToolResult = () => channelProgressCanConsumeToolResults || baseShouldEmitToolResult();
	const shouldEmitToolOutput = createShouldEmitToolOutput({
		sessionKey,
		storePath,
		resolvedVerboseLevel,
		verboseLevelOverride: followupRun.run.verboseLevelOverride
	});
	const pendingToolTasks = /* @__PURE__ */ new Set();
	const blockReplyTimeoutMs = opts?.blockReplyTimeoutMs ?? 15e3;
	const touchActiveSessionEntry = async () => {
		if (!activeSessionEntry || !activeSessionStore || !sessionKey) return;
		const updatedAt = activeSessionEntry.updatedAt === 0 ? 0 : Date.now();
		activeSessionEntry.updatedAt = updatedAt;
		activeSessionStore[sessionKey] = activeSessionEntry;
		if (storePath) await updateSessionEntry({
			agentId: followupRun.run.agentId,
			storePath,
			sessionKey
		}, () => ({ updatedAt }), {
			skipMaintenance: true,
			takeCacheOwnership: true
		});
	};
	const queuedRunFollowupTurn = createFollowupRunner({
		resolveGatewayContext,
		opts,
		typing,
		typingMode,
		sessionEntry: activeSessionEntry,
		sessionStore: activeSessionStore,
		sessionKey,
		storePath,
		defaultModel,
		toolProgressDetail
	});
	if (messageInjectionDisposition === "accepted") {
		if (replyOperationRunState) replyOperationRunState.admission = {
			status: "accepted",
			mode: "steer"
		};
		releaseAdmissionTicket();
		typing.cleanup();
		return;
	}
	const bindQueueDisposition = () => {
		const observe = followupRun.onQueueDisposition;
		followupRun.onQueueDisposition = (disposition) => {
			observe?.(disposition);
			if (replyOperationRunState && disposition !== "queue-cap-old") replyOperationRunState.admission = {
				status: "skipped",
				reason: "queue-cap"
			};
		};
	};
	if (effectiveShouldSteer && isActive && !shouldQueueAuthorityMismatch && !shouldQueueTerminalReceiptSteer && messageInjectionDisposition === "none") {
		bindQueueDisposition();
		const result = await runActiveReplySteer({
			followupRun,
			opts,
			providedReplyOperation,
			queueKey,
			releaseAdmissionTicket,
			replyOperationRunState,
			resolvedQueue,
			restartRecoverySourceTurnId,
			runFollowup: queuedRunFollowupTurn,
			sessionCtx,
			sessionKey,
			sessionEntry: activeSessionEntry,
			storePath,
			touchActiveSessionEntry,
			typing,
			typingSignals,
			toolAuthorityFingerprint: incomingToolAuthorityFingerprint,
			pendingInputAuthorityFingerprint: hasRouteOnlyAuthorityMismatch ? activeToolAuthorityFingerprint : void 0
		});
		return result === "handled" ? void 0 : result;
	}
	const activeRunQueueAction = resolveActiveRunQueueAction({
		queueAdmissionState,
		isActive,
		isHeartbeat,
		shouldFollowup: effectiveShouldFollowup || shouldQueueAuthorityMismatch,
		queueMode: activeRunQueueMode,
		resetTriggered: effectiveResetTriggered
	});
	if (activeRunQueueAction === "drop") {
		if (replyOperationRunState) replyOperationRunState.admission = {
			status: "skipped",
			reason: "active-run"
		};
		releaseAdmissionTicket();
		typing.cleanup();
		return;
	}
	if (activeRunQueueAction === "enqueue-followup") {
		bindQueueDisposition();
		if (!enqueueFollowupRun(queueKey, followupRun, resolvedQueue, "message-id", queuedRunFollowupTurn, false)) {
			releaseAdmissionTicket();
			typing.cleanup();
			return;
		}
		if (replyOperationRunState) replyOperationRunState.admission = {
			status: "accepted",
			mode: "followup"
		};
		const queuedOperationOwner = replyRunRegistry.get(queueKey) ?? activeReplyOperation;
		if (queuedOperationOwner) scheduleFollowupDrainAfterReplyOperationClear({
			operation: queuedOperationOwner,
			queueKey,
			runFollowup: queuedRunFollowupTurn
		});
		else scheduleFollowupDrain(queueKey, queuedRunFollowupTurn);
		releaseAdmissionTicket();
		const queuedBehindActiveRun = isRunActive?.() === true;
		await touchActiveSessionEntry();
		if (queuedBehindActiveRun) await typingSignals.signalToolStart();
		else typing.cleanup();
		return;
	}
	followupRun.run.config = await resolveQueuedReplyExecutionConfig(followupRun.run.config, {
		originatingChannel: sessionCtx.OriginatingChannel,
		messageProvider: followupRun.run.messageProvider,
		originatingAccountId: followupRun.originatingAccountId,
		agentAccountId: followupRun.run.agentAccountId
	});
	followupRun.run.agentId ??= resolveDefaultAgentId(followupRun.run.config);
	const replyToChannel = resolveOriginMessageProvider({
		originatingChannel: sessionCtx.OriginatingChannel,
		provider: sessionCtx.Surface ?? sessionCtx.Provider
	});
	const replyToMode = followupRun.originatingReplyToMode ?? resolveReplyToMode(followupRun.run.config, replyToChannel, sessionCtx.AccountId, sessionCtx.ChatType);
	const applyReplyToMode = createReplyToModeFilterForChannel(replyToMode, replyToChannel);
	const cfg = followupRun.run.config;
	const replyMediaContext = createReplyMediaContext({
		cfg,
		agentId: followupRun.run.agentId,
		sessionKey,
		workspaceDir: followupRun.run.workspaceDir,
		mediaNormalizationOwner: followupRun.run.mediaNormalizationOwner,
		messageProvider: followupRun.run.messageProvider,
		accountId: followupRun.originatingAccountId ?? followupRun.run.agentAccountId,
		groupId: followupRun.run.groupId,
		groupChannel: followupRun.run.groupChannel,
		groupSpace: followupRun.run.groupSpace,
		requesterSenderId: followupRun.run.senderId,
		requesterSenderName: followupRun.run.senderName,
		requesterSenderUsername: followupRun.run.senderUsername,
		requesterSenderE164: followupRun.run.senderE164
	});
	const compactionNoticeMessageId = sessionCtx.MessageSidFull ?? sessionCtx.MessageSid;
	const sendDirectCompactionNotice = shouldNotifyUserAboutCompaction(cfg) ? async (phase, text) => {
		if (!opts?.onBlockReply) return;
		const noticePayload = createCompactionNoticePayload({
			phase,
			text,
			currentMessageId: compactionNoticeMessageId,
			applyReplyToMode
		});
		try {
			await opts.onBlockReply(noticePayload);
		} catch (err) {
			logVerbose(`context maintenance notice delivery failed: ${String(err)}`);
		}
	} : void 0;
	const blockReplyCoalescing = blockStreamingEnabled && (opts?.onPreparedBlockReply || opts?.onBlockReply) ? resolveEffectiveBlockStreamingConfig({
		cfg,
		provider: sessionCtx.Provider,
		accountId: sessionCtx.AccountId,
		chunking: blockReplyChunking
	}).coalescing : void 0;
	const blockReplyPipeline = blockStreamingEnabled && (opts?.onPreparedBlockReply || opts?.onBlockReply) ? createBlockReplyPipeline({
		onBlockReply: async (payload, context) => {
			if (opts.onPreparedBlockReply) {
				for (const plan of createStructuredOutboundPayloadPlan([payload])) await opts.onPreparedBlockReply(plan, context);
				return;
			}
			await opts.onBlockReply?.(payload, context);
		},
		timeoutMs: blockReplyTimeoutMs,
		coalescing: blockReplyCoalescing,
		buffer: createAudioAsVoiceBuffer({ isAudioPayload })
	}) : null;
	const resolveVisibleReplyDelivery = async () => {
		try {
			await blockReplyPipeline?.flush({ force: true });
		} catch (flushError) {
			logVerbose(`failed to flush streamed reply blocks before surfacing run failure: ${String(flushError)}`);
		}
		return didDeliverVisiblePartialReply || blockReplyPipeline?.didStream() === true;
	};
	const replySessionKey = sessionKey ?? followupRun.run.sessionKey;
	const replyRouteThreadId = resolveRoutedDeliveryThreadId({
		ctx: sessionCtx,
		sessionKey: replySessionKey
	});
	let replyOperation;
	if (providedReplyOperation) {
		replyOperation = providedReplyOperation;
		if (replyOperationRunState) replyOperationRunState.admission = { status: "owned" };
		releaseAdmissionTicket();
	} else {
		const replyTurnKind = resolveReplyTurnKind(opts);
		const admission = await admitReplyTurn({
			providerReviewAcknowledgment: opts?.providerReviewAcknowledgment,
			agentId: followupRun.run.agentId,
			resolveGatewayContext,
			sessionId: followupRun.run.sessionId,
			sessionKey: replySessionKey ?? "",
			expectedSessionId: activeSessionEntry?.sessionId,
			storePath,
			kind: replyTurnKind,
			resetTriggered: effectiveResetTriggered,
			routeThreadId: replyRouteThreadId,
			originatingLeafEntryId: turnAdoptionLifecycle?.originatingLeafEntryId,
			upstreamAbortSignal: resolveFollowupAbortSignal({
				abortSignal: opts?.abortSignal,
				operatorAuthority: followupRun.operatorAuthority
			})
		});
		if (replyOperationRunState) replyOperationRunState.admission = admission.status === "owned" ? { status: "owned" } : {
			status: "skipped",
			reason: admission.reason
		};
		if (admission.status === "skipped") {
			releaseAdmissionTicket();
			typing.cleanup();
			if (admission.reason !== "active-run" || replyTurnKind !== "visible") return;
			return markReplyPayloadForSourceSuppressionDelivery({ text: REPLY_RUN_STILL_SHUTTING_DOWN_TEXT });
		}
		replyOperation = admission.operation;
		releaseAdmissionTicket();
		const previousRunSessionId = followupRun.run.sessionId;
		followupRun.run.sessionId = replyOperation.sessionId;
		if (replyOperation.sessionId !== previousRunSessionId) {
			const admittedSessionEntry = refreshSessionEntryFromStore({
				storePath,
				sessionKey: replySessionKey,
				fallbackEntry: replySessionKey ? activeSessionStore?.[replySessionKey] ?? activeSessionEntry : activeSessionEntry,
				activeSessionStore
			});
			if (admittedSessionEntry?.sessionId === replyOperation.sessionId) {
				activeSessionEntry = admittedSessionEntry;
				const admittedSessionFile = resolveAdmittedRunSessionFile({
					agentId: followupRun.run.agentId,
					sessionId: replyOperation.sessionId,
					sessionFile: void 0,
					sessionKey: replySessionKey,
					storePath
				});
				if (admittedSessionFile) followupRun.run.sessionFile = admittedSessionFile;
			}
		}
	}
	replyOperation.bindToolAuthoritySnapshot(prepareReplyToolAuthority(followupRun));
	bindReplyOperationTyping(replyOperation, typing);
	let runFollowupTurn = queuedRunFollowupTurn;
	let shouldDrainQueuedFollowupsAfterClear = false;
	const returnWithQueuedFollowupDrain = (value) => {
		shouldDrainQueuedFollowupsAfterClear = true;
		return value;
	};
	const { admitUserTurn, beginBeforeAgentReply, checkpointBeforeAgentReply, clear: clearRestartRecoveryDeliveryClaim, isArmed: isRestartRecoveryArmed } = createReplyAgentRestartRecoveryController({
		activeSessionStore,
		cfg,
		followupRun,
		getActiveSessionEntry: () => activeSessionEntry,
		opts,
		replyOperation,
		restartRecoverySourceTurnId,
		runtimePolicySessionKey,
		sessionCtx,
		sessionKey,
		setActiveSessionEntry: (entry) => {
			activeSessionEntry = entry;
		},
		storePath
	});
	const resetSessionAfterRoleOrderingConflict = async (reason) => await resetReplyRunSession({
		options: {
			failureLabel: "role ordering conflict",
			buildLogMessage: (nextSessionId) => `Role ordering conflict (${reason}). Restarting session ${sessionKey} -> ${nextSessionId}.`,
			cleanupTranscripts: true
		},
		sessionKey,
		queueKey,
		activeSessionEntry,
		activeSessionStore,
		storePath,
		followupRun,
		onActiveSessionEntry: (nextEntry) => {
			activeSessionEntry = nextEntry;
		},
		onNewSession: () => {
			activeIsNewSession = true;
		}
	});
	try {
		return await executePreparedReplyAgentRun({
			...params,
			activeSessionStore,
			admitUserTurn,
			applyReplyToMode,
			beginBeforeAgentReply,
			blockReplyPipeline,
			cfg,
			checkpointBeforeAgentReply,
			resolveVisibleReplyDelivery,
			getActiveIsNewSession: () => activeIsNewSession,
			getActiveSessionEntry: () => activeSessionEntry,
			isHeartbeat,
			isRestartRecoveryArmed,
			opts: runOpts,
			pendingToolTasks,
			replyMediaContext,
			replyOperation,
			replyRouteThreadId,
			replyToChannel,
			replyToMode,
			resetSessionAfterRoleOrderingConflict,
			returnWithQueuedFollowupDrain,
			runFollowupTurn,
			sendDirectCompactionNotice,
			setActiveSessionEntry: (entry) => {
				activeSessionEntry = entry;
			},
			setRunFollowupTurn: (runner) => {
				runFollowupTurn = runner;
			},
			shouldEmitToolOutput,
			shouldEmitToolResult,
			traceAgentPhase,
			turnAdoptionLifecycle,
			typingSignals
		});
	} catch (error) {
		recordReplyOperationAgentTurn(followupRun.replyOperationRunStates, replyOperation);
		return await handleReplyAgentRunError(error, {
			resolveVisibleReplyDelivery,
			isHeartbeat,
			replyExpectation,
			isRestartRecoveryArmed,
			replyOperation,
			resolvedVerboseLevel,
			returnWithQueuedFollowupDrain,
			sessionCtx
		});
	} finally {
		await cleanupReplyAgentRun({
			blockReplyPipeline,
			clearRestartRecoveryDeliveryClaim,
			providedReplyOperation,
			queueKey,
			replyOperation,
			runFollowupTurn,
			sessionKey,
			shouldDrainQueuedFollowupsAfterClear,
			typing
		});
	}
}
//#endregion
export { runReplyAgent };
