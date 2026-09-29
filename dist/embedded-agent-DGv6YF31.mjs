import "./number-coercion-CLj0HTDM.mjs";
import { u as toErrorObject } from "./error-coercion-C787aVxk.mjs";
import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { n as captureAsyncWorkTracker, r as getAsyncWorkSignal, t as AsyncWorkScope } from "./async-work-scope-CWk2dk1h.mjs";
import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { o as resolveUserPath } from "./home-dir-BKwhAL2c.mjs";
import { a as getGatewayContextResolver } from "./gateway-context-binding-VqB7gkMe.mjs";
import "./gateway-request-scope-BLBH-Gpf.mjs";
import "./utils-aKqR_F_U.mjs";
import { s as sleepWithAbort } from "./src-D4OikzaT.mjs";
import { n as isAbortError } from "./abort-signal-Z3A36sLL.mjs";
import { r as normalizeProviderId } from "./provider-id-DCtsDflE.mjs";
import { a as resolveAgentDir, l as resolveAgentWorkspaceDir } from "./agent-scope-config-IQKOEtZ4.mjs";
import { r as isIncognitoSessionKey } from "./session-key-CUi_tcgF.mjs";
import { A as parseAgentSessionKey, l as resolveAgentIdFromSessionKey } from "./session-key-CBvmC8zz.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { D as freezeDiagnosticTraceContext, n as emitDiagnosticEvent, t as areDiagnosticsEnabledForProcess } from "./diagnostic-events-CVabF32H.mjs";
import { n as sanitizeForLog } from "./ansi-CWsy0bu4.mjs";
import { t as createSubsystemLogger } from "./subsystem-DleLyu58.mjs";
import { n as emitDiagnosticsTimelineEvent } from "./diagnostics-timeline-uuHa_36_.mjs";
import { t as classifyGatewayStorageFailure } from "./sqlite-error-diagnostics-C8UyxYRx.mjs";
import { t as redactIdentifier } from "./node-crypto-Df3MIs6V.mjs";
import { n as SILENT_REPLY_TOKEN, o as isSilentReplyText } from "./tokens-BTKQYTUd.mjs";
import { o as loadPluginMetadataSnapshot } from "./plugin-metadata-snapshot-pEXzzTbU.mjs";
import { n as withPluginRuntimeGenerationScope, t as runOutsidePluginRuntimeGenerationScope } from "./generation-scope-DkeaMJw8.mjs";
import { l as normalizeToolPolicyName } from "./tool-policy-shared-auQCQEhM.mjs";
import "./tool-policy-YDdaK0oX.mjs";
import { r as isIncognitoOpenClawAgentSqlitePath } from "./openclaw-agent-db.paths-C2YxM4Tj.mjs";
import { l as resolveSessionStorePathCore } from "./paths-CcMbq5NY.mjs";
import { t as MODEL_APIS } from "./model-config-vocabulary-CIfiDXNP.mjs";
import "./types.models-ZwQV51CR.mjs";
import { n as DEFAULT_MODEL, r as DEFAULT_PROVIDER } from "./defaults-BbU4k6fu.mjs";
import { a as normalizeOptionalAgentRuntimeId } from "./agent-runtime-id-9mBje111.mjs";
import { s as getRuntimeConfigSnapshot } from "./runtime-snapshot-DbgWcCyV.mjs";
import { a as resolveProviderModelRoutes } from "./provider-model-routes-CNgNpH_2.mjs";
import { _ as resolveSessionAgentId, g as resolveRunModelFallbacksOverride, h as resolveModelFallbackAvailability, y as resolveSessionAgentIds } from "./agent-scope-CTuYDtny.mjs";
import { r as resolvePersistedSessionStoreOwnerForTarget } from "./session-store-owner-DBafeUlR.mjs";
import { t as providerModelRouteAcceptsAuthMode } from "./provider-model-route-auth-DkAaX3ui.mjs";
import { i as modelMatchesProviderModelRoute, r as isProviderModelRerouted } from "./provider-model-route-D-_CCdkJ.mjs";
import { o as resolvePreparedModelThinkingCompat } from "./model-catalog-lookup-C3iQmurZ.mjs";
import { c as resolveContextConfigProviderForRuntime, d as resolveSelectedOpenAIRuntimeProvider, n as OPENAI_PROVIDER_ID } from "./openai-routing-BspGC-O6.mjs";
import "./backoff-CszdOMiF.mjs";
import "./config-Ciq2mxdN.mjs";
import { c as resolveSecretSentinel, o as looksLikeSecretSentinel } from "./sentinel-C86v7W15.mjs";
import { n as normalizeMessageChannel } from "./message-channel-core-CxyiAx1U.mjs";
import "./message-channel-normalize-2tAtQt1g.mjs";
import { o as isMarkdownCapableMessageChannel } from "./message-channel-DDcHHhpX.mjs";
import { c as resolveSafeTimeoutDelayMs } from "./timeouts-D2XMKe-X.mjs";
import { n as recordAgentCleanupFailure, r as runAgentCleanupStep } from "./run-cleanup-timeout-BlChlpzQ.mjs";
import { d as retireSessionMcpRuntime } from "./agent-bundle-mcp-manager-api-jXc1RW7-.mjs";
import { T as retainQueuedAgentRunContext, _ as registerAgentRunContext, c as getAgentRunContext, r as claimAgentRunContext } from "./agent-run-registry-DO6Dg2r0.mjs";
import { i as emitAgentEvent, l as getAgentEventLifecycleGeneration, n as captureAgentRunLifecycleGeneration, p as onAgentEventForRun, s as emitAgentEventIfCurrent, t as assertAgentRunLifecycleGenerationCurrent, u as isAgentEventLifecycleGenerationCurrent, y as withAgentRunLifecycleGeneration } from "./agent-events-BOSJcayE.mjs";
import { y as requireActivePluginRegistry } from "./runtime-BvdPUus5.mjs";
import "./openclaw-agent-db-CaQAStOA.mjs";
import { n as SecretSurfaceUnavailableError } from "./runtime-degraded-state-DVMYGogL.mjs";
import { n as markAuthProfileSuccess } from "./profiles-DblRQQgZ.mjs";
import { n as OAuthRefreshFailureError } from "./oauth-refresh-failure-CVji5U1C.mjs";
import { N as revokeRuntimeAuthMaterializations, j as recordRuntimeAuthMaterialization } from "./runtime-snapshots-CBozwlR0.mjs";
import { n as resolveProviderEndpoint } from "./provider-attribution-DUtJJsHV.mjs";
import { a as getModelProviderRequestRouteFacts, t as applyPreparedRuntimeAuthToModel } from "./provider-request-config-DOrVD029.mjs";
import { I as MissingProviderAuthError, v as isConfigBackedInlineProviderApiKey } from "./loader-runtime-load-XbrcYJWd.mjs";
import { n as inheritRuntimeCompactionDelegate, t as bindContextEngineCompaction } from "./compaction-watchdog-j-VZv3iA.mjs";
import { c as resolveContextEngineOwnerPluginId, s as resolveContextEngine } from "./registry-Bqh30cGD.mjs";
import { t as getGlobalHookRunner } from "./hook-runner-global-DlvY8FQy.mjs";
import { o as hasReplyPayloadContent } from "./payload-COvcWceu.mjs";
import { T as setReplyPayloadMetadata, _ as isReplyPayloadTerminalContent, a as copyReplyPayloadMetadata, s as getReplyPayloadMetadata, t as FAST_MODE_AUTO_PROGRESS_KIND, x as markReplyPayloadForSourceSuppressionDelivery } from "./reply-payload-B2ZQhznY.mjs";
import { d as captureAgentPluginRuntimeRefresh, f as createAgentPluginRuntimeRefresh } from "./agent-tools.before-tool-call-C2rI0w1x.mjs";
import { d as withOwnedSessionTranscriptWrites, l as runWithoutOwnedSessionTranscriptWrites, t as SessionTranscriptWriterClaimReboundError } from "./transcript-write-context-MlBhwaKa.mjs";
import { n as canonicalizeMainSessionAlias, r as resolveAgentMainSessionKey } from "./main-session-De-bcoks.mjs";
import { m as resolveSubscriptionAuthModeForProfiles } from "./order-BQhYF772.mjs";
import { c as isProfileInCooldown, m as resolveProfilesUnavailableReason } from "./usage-state-Bm5iXGhR.mjs";
import { i as ensureAuthProfileStoreWithoutExternalProfiles, n as ensureAuthProfileStore } from "./store-runtime-BcoYkagW.mjs";
import { n as markAuthProfileFailure, r as markInlineProviderApiKeyFailure } from "./usage-BGZHRVrb.mjs";
import { t as sanitizeForConsole } from "./console-sanitize-CaBHLewO.mjs";
import { n as readProviderRefusalReview, t as isProviderRefusalAssistantError } from "./diagnostics-CAGhEztD.mjs";
import { a as resolveLegacyInheritedAuthDir } from "./legacy-inherited-auth-dir-BqAtGSmm.mjs";
import { n as getRegisteredAgentHarness } from "./registry-aYyey5ds.mjs";
import { i as unwrapSecretSentinelsForProviderEgress } from "./provider-secret-egress-BkXZF4dA.mjs";
import { d as resolveProviderRuntimePluginHandle, o as resolveProviderAuthProfileId, t as attachModelProviderRuntimePluginHandle } from "./provider-hook-runtime-BGP4teSf.mjs";
import { _ as prepareProviderRuntimeAuth, y as providerOwnsDynamicModelPreparation } from "./provider-runtime-BofzCM_V.mjs";
import "./auth-profiles-CYVlYrag.mjs";
import { i as getApiKeyForModelCore, n as applyLocalNoAuthHeaderOverride, t as applyAuthHeaderOverride } from "./model-auth-CCIBdEPk.mjs";
import { m as isTimeoutErrorMessage, u as isProviderRequestSizeCeilingError } from "./message-patterns-D0mFl7L8.mjs";
import { i as getFailoverErrorCode, t as FailoverError } from "./error-ON38hPhx.mjs";
import { n as resolveModelCandidateChain } from "./model-fallback-candidates-BSWa_fLA.mjs";
import { c as resolveAgentHarnessPreparedRouteSupport, r as assertPluginHarnessConversationToolPolicySupport, s as resolveAgentHarnessPreparedAuthSupport } from "./availability-CUZDnZeh.mjs";
import { t as AgentHarnessPreflightError } from "./errors-Bd6GQRkh.mjs";
import { h as resolveSessionPinnedHarnessId } from "./agent-harness-session-key-CQ6tTBOH.mjs";
import { a as resolveCandidateThinkingLevel } from "./thinking-runtime-Dvszh-e-.mjs";
import { o as prepareAgentWorkspaceAttachments } from "./workspace-access-BNUXOhfF.mjs";
import { i as assertPreparedModelRuntimeInputCurrent } from "./prepared-model-runtime.errors-18hyOf9a.mjs";
import { a as acquireReadOnlyPreparedModelRuntime, t as acquireAgentRunPreparedModelRuntime } from "./prepared-model-runtime-DtKqtgJz.mjs";
import { i as withPreparedModelRuntimePluginGenerationScope, n as getPreparedModelRuntimePluginGeneration, r as runOutsidePreparedModelRuntimePluginGenerationScope } from "./prepared-model-runtime-generation-scope-BA7V9xf7.mjs";
import { n as parseSqliteSessionFileMarker, t as formatSqliteSessionFileMarker } from "./legacy-sqlite-marker-COPKCuIN.mjs";
import { i as resolveLiveToolResultMaxChars } from "./tool-result-limits-B-fhY8wF.mjs";
import { n as listSessionEntriesReadOnly } from "./session-accessor.sqlite-entry-list.read-Dn1blVrY.mjs";
import { n as beginSessionWorkAdmission } from "./session-lifecycle-admission-Pys9TN37.mjs";
import { i as classifyAgentRunTerminalOutcome } from "./agent-run-terminal-outcome-CgoAW2Q7.mjs";
import { i as appendTranscriptMessage, v as projectPublicSessionEntry } from "./session-accessor.sqlite-transcript-write-Bk_2EeDT.mjs";
import { d as patchSessionEntryCore, l as loadSessionEntryReadOnly, s as loadSessionEntry } from "./session-accessor.sqlite-entry-BB2Zsfho.mjs";
import "./session-accessor-l-4ZHvKn.mjs";
import { l as updateSessionEntry } from "./session-accessor.reset-0gTJAhVB.mjs";
import { n as deriveContextPromptTokens, u as normalizeUsage } from "./usage-XXLoqJQC.mjs";
import { i as resolveSessionTranscriptRuntimeTarget } from "./session-accessor.transcript-target-w5-iuMeM.mjs";
import { t as prepareSessionEntryPresenceRead } from "./session-transcript-worker-runtime-BF6L8Gm-.mjs";
import { f as resolveAdmittedRunActiveAssertion, o as getAdmittedRunDelegatedAuthority, p as resolvePreparedRunAdmission } from "./admitted-run-context-BNasoszr.mjs";
import { l as projectAgentRunAttemptTerminal, r as buildAgentRunTerminalOutcomeFromAttempt } from "./agent-run-terminal-outcome-Dto4EMdr.mjs";
import { a as createAgentRunDirectAbortError, m as resolveAgentRunErrorLifecycleFields } from "./run-termination-Cd1iJzC7.mjs";
import { a as formatBillingErrorMessage, f as renderAuthProfileFailoverCopy } from "./user-copy-DfLWtdTx.mjs";
import { h as parseImageSizeError, m as parseImageDimensionError } from "./classify-core-BTxG3xnT.mjs";
import { d as resolveReplyExpectation, l as observeReplyDelivery } from "./source-reply-delivery-mode-CuFZyg4U.mjs";
import { c as resolveFastModeForElapsed, l as resolveFastModeModelAutoOnSeconds, n as formatFastModeAutoProgressText } from "./fast-mode-CF9HctjM.mjs";
import { n as resolveAgentTimeoutMs } from "./timeout-Bjg7ga80.mjs";
import { x as resolveCompactionTimeoutMs, y as compactContextEngineWithSafetyTimeout } from "./diagnostic-CT1lx7JC.mjs";
import { n as resolveSessionPlacementTurnSettlementAssertion } from "./session-placement-forced-terminal-settlement-C1lJojrj.mjs";
import { n as createAdmittedGatewayToolCallerIdentity, o as withGatewayToolCallerIdentity } from "./gateway-caller-context-DvDb9xl2.mjs";
import { C as resolveActiveEmbeddedRunHandleSessionIdBySessionFile, N as setActiveEmbeddedRun, P as supersedeEmbeddedAgentRunByRunId, S as resolveActiveEmbeddedRunHandleSessionId, f as isEmbeddedAgentRunHandleActive, g as markEmbeddedRunRecoveringTimeout, i as clearActiveEmbeddedRun, j as restoreEmbeddedRunTimeoutAbandonment } from "./runs-Cjzxx3Pg.mjs";
import "./active-run-projections-BHX_SDCX.mjs";
import { a as getCommandLaneSnapshot, l as isCommandLaneTaskTimeoutError, r as enqueueCommandInLane } from "./command-queue-CaY517ob.mjs";
import "./sessions-DE4llkPV.mjs";
import { d as resolveSessionWorkStartError, g as createSessionProviderReview, h as claimProviderReviewAttempt, p as assertSessionProviderReviewWorkStart, v as readProviderReviewAcknowledgment, y as recordSessionProviderReview } from "./lifecycle-WWQJH57y.mjs";
import { t as estimateAggregateUsageCost } from "./usage-format-CisMpgmJ.mjs";
import { i as resolveSessionPermissionExecMode } from "./session-permission-exec-mode-Bn0mEuts.mjs";
import { a as isLikelyContextOverflowError, n as classifyFailoverSignal, r as isFailoverErrorMessage, t as classifyFailoverReason } from "./classify-DO9EO_30.mjs";
import { n as recordModelFallbackStop } from "./model-fallback-stop-B0RY23Zf.mjs";
import { a as findCliTerminalStopError, f as resolveFailoverReasonFromError, i as describeFailoverError, l as hasRecordedModelFallbackStop, p as resolveFailoverStatus, r as coerceToFailoverError, u as isCliTerminalStopCode } from "./failover-error-C3SnWYBJ.mjs";
import { i as LiveSessionModelSwitchError, r as shouldUseTransientCooldownProbeSlot } from "./model-fallback-runner-BUzxeWPx.mjs";
import { i as resolveRetryAfterMs, r as hasLongWindowRateLimitEvidence, t as classifyRateLimitWindow } from "./retry-evidence-eo_i1jCP.mjs";
import { n as isTerminalAssistantError, t as isRetryableAssistantError } from "./retry-D-OE0Ga3.mjs";
import { a as isFailoverAssistantError, i as isBillingAssistantError, n as classifyAssistantFailoverReason, o as isRateLimitAssistantError, r as isAuthAssistantError, t as buildAssistantFailoverSignal } from "./assistant-message-failures-Jwdvheh6.mjs";
import { _ as extractObservedOverflowTokenCount, h as formatUserFacingAssistantErrorText, m as formatAssistantErrorText, s as pickFallbackThinkingLevel, v as isCompactionFailureError } from "./embedded-agent-helpers-DGdaNc6w.mjs";
import { i as resolveCurrentSourceMessagingToolPartial, r as normalizeTextForComparison } from "./messaging-dedupe-DzadpKaR.mjs";
import { _ as buildApiErrorObservationFields, y as shouldSuppressRawErrorConsoleSuffix } from "./model-fallback-attempt-Dz9Ct0BI.mjs";
import { t as resolvePreferredSessionKeyForSessionIdMatches } from "./session-id-resolution-CJjzDrhT.mjs";
import { a as resolveSessionKeyForRequestCore, o as resolveStoredSessionKeyForSessionId } from "./session-Dk2nIhSp.mjs";
import { i as resolveSessionSuspensionTarget, o as suspendSession, r as resolveSessionSuspensionReason } from "./session-suspension-DbQ3XvjC.mjs";
import { n as readChannelSourceTurnId, r as readChannelSourceTurnSameThreadRequired } from "./source-turn-id-BZGK3amb.mjs";
import { n as classifyCompactionReason, t as DEFERRED_CONTEXT_ENGINE_COMPACTION_REASON } from "./compact-reasons-DQwVyt53.mjs";
import { t as buildProviderAuthRecoveryHint } from "./provider-auth-recovery-hint-BWahCZqw.mjs";
import { r as isToolResultError } from "./tool-result-error-CWadvCKd.mjs";
import { n as mintMessageActionTurnCapability, o as resolveMessageActionTurnCapabilityLifetime, s as revokeMessageActionTurnCapability, t as isTrustedMessageActionTurnIngress } from "./message-action-turn-capability-CfssNzR2.mjs";
import { n as OPENCLAW_EMBEDDED_CONTEXT_ENGINE_HOST } from "./host-compat-xESS3bi6.mjs";
import { t as beginForegroundSessionMaintenance } from "./coordinator-KBr1fVd6.mjs";
import "./agent-bundle-mcp-tools-sYSmxaoq.mjs";
import { r as isExecLikeToolName } from "./tool-error-summary-Sp1u0x3c.mjs";
import { t as ensureContextEnginesInitialized } from "./init-Bfw0dc04.mjs";
import { n as registerAgentRunCapacityWait } from "./agent-run-capacity-wait-CbVGA6gD.mjs";
import { r as isBackgroundWorkLane } from "./background-work-DnTXrmXN.mjs";
import { i as resolveUtilityModelRefForAgent } from "./utility-model-DZ4XRwmc.mjs";
import { c as resolveAuthoredModelContextTokens } from "./context-resolution-D64R_bgD.mjs";
import { c as readSessionRuntimeOwnership } from "./placement-session-runtime-SEjvmv7N.mjs";
import "./fast-mode-D3LS63Ki.mjs";
import { t as AGENT_LANE_SUBAGENT } from "./lanes-CI0_P-yC.mjs";
import { t as resolveEmbeddedCliBackendDispatchEligibility } from "./cli-backend-dispatch-eligibility-C6DStzN6.mjs";
import { c as buildContextEngineRuntimeSettings } from "./context-engine-lifecycle-CFdTrVHv.mjs";
import { i as isRecoverableNativeHarnessBindingFailure, n as resolveContextEngineCompactionSuccessor, r as maybeCompactAgentHarnessSession, t as acceptCompactionSuccessor } from "./compaction-successor-BZBnM_w_.mjs";
import { n as resolveModelAsync, t as createEmptyAgentDiscoveryStores } from "./model-s5D17jSh.mjs";
import { t as materializePreparedRuntimeModel } from "./materialize-model-BGTV6m9x.mjs";
import { t as buildAgentRuntimeAuthPlan } from "./auth-CIAKr89h.mjs";
import { n as canRunPreparedAgentRuntimeAuthAttempt, r as prepareAgentRuntimeAuth } from "./prepare-auth-CvmQc1W2.mjs";
import { i as resolveCredentialScopedAuthAttemptModelDecision, n as hasPreparedAuthAttemptModelMetadata, r as providerUsesCredentialScopedModelMetadata, t as createPreparedRuntimeModelMaterializer } from "./credential-scoped-model-B28PygDq.mjs";
import { n as resolveAgentHarnessNativeToolPolicyRestricted, t as assertAgentHarnessExecutionEnvironment } from "./execution-environment-D3NQqOzj.mjs";
import { t as isHeartbeatLifecycleRunKind } from "./bootstrap-mode-HvSedbJl.mjs";
import { n as getCoreTtsAttemptResultMediaUrls, t as copyCoreTtsAttemptResultProvenance } from "./tts-tool-result-provenance-z42MPFVT.mjs";
import { A as resolveReplayInvalidFlag, B as countSettledTurnDeliveryPayloads, C as getProviderPromptState, D as YIELD_DIAGNOSTIC_TEXT, E as TRUNCATED_REPLY_NOTICE_TEXT, F as resolveReasoningOnlyRetryInstruction, G as resolveCurrentAttemptAssistant, H as hasAsyncActivity, I as resolveSettledToolBatchEvidence, J as applyResolvedToolPromptFinalizer, K as shouldContinueInteractiveAcceptedSessionSpawns, L as resolveSettledToolTerminalContinuationInstruction, M as resolveSilentToolResultReplyPayload, N as shouldRetryMissingAssistantTurn, O as hasYieldContinuationEvidence, P as resolveEmptyResponseRetryInstruction, R as shouldRetrySilentErrorAssistantTurn, S as clearProviderPromptState, T as createAttemptCarryover, U as hasAttemptTerminalState, V as isStrictAgenticExecutionContractActive, W as isCurrentAttemptReplaySafe, at as resolveEmbeddedRunAttemptTerminalOutcome, b as measureEmbeddedAgentPreparation, ct as observeReplayMetadata, gt as formatEmbeddedRunStageSummary, ht as createEmbeddedRunStageTracker, i as resolveAgentRunSessionTarget, it as isEmbeddedRunTimeoutFinal, j as resolveRunLivenessState, k as resolveIncompleteTurnPayloadText, lt as createToolTerminalObserver, mt as createEmbeddedRunStageSummaryEmitter, nt as isEmbeddedRunTerminalInterrupted, o as resolveEmbeddedSessionContextLimits, ot as resolveEmbeddedRunAttemptTerminalState, pt as EMBEDDED_RUN_ATTEMPT_DISPATCH_STAGE, q as prepareEmbeddedAttemptPromptExecution, r as applyAgentRunSessionTargetIdentity, rt as isEmbeddedRunTerminalTimeout, st as createEmbeddedRunReplayState, tt as isEmbeddedRunTerminalAbort, ut as runBestEffortCallback, w as markLastProviderPromptContextRejected, yt as prepareEmbeddedSkills, z as shouldTreatEmptyAssistantReplyAsSilent } from "./builtin-openclaw-CzzhJmXX.mjs";
import { t as log$3 } from "./logger-Cp6WXSpQ.mjs";
import { a as remapSkillReferencePaths } from "./runtime-capabilities-D5oPuyFq.mjs";
import { d as shouldIncludeProgressCardToolForOpenClawTools } from "./openclaw-tools-CDCtzDVi.mjs";
import { n as resolveHarnessWorkspace, t as resolveAttemptWorkspaceSandbox } from "./workspace-sandbox-BVDtHopg.mjs";
import { s as sessionLikelyHasOversizedToolResults, u as truncateOversizedToolResultsInSessionManager } from "./tool-result-truncation-DuBhlgM0.mjs";
import { i as getEmbeddedSessionPromptState, l as prepareEmbeddedSessionActiveProjectKeys } from "./session-prompt-state-C1pwD4fu.mjs";
import { t as SessionManager } from "./session-manager-ezhBV3sx.mjs";
import { t as withSessionManagerWrite } from "./session-manager-write-admission-Dwxoskt2.mjs";
import { r as resolveSettledTurnFinalizationText } from "./settled-turn-finalization-result-DlRV2dc9.mjs";
import { n as mapThinkingLevelForProvider } from "./utils-CefVZRZM.mjs";
import { a as forgetPromptBuildDrainCacheForRun, b as listActiveProcessSessionReferences, f as resolveContextEngineCapabilities, m as resolveCompactionContextTokenBudget, n as waitForDeferredTurnMaintenanceForSession, p as buildEmbeddedCompactionRuntimeContext, t as runContextEngineMaintenance } from "./context-engine-maintenance-5FlnjD_8.mjs";
import { t as resolveProcessToolScopeKey } from "./bash-process-scope-Bmw8_ghL.mjs";
import { a as buildUsageAgentMetaFields, c as resolveActiveErrorContext, d as resolveFinalAssistantVisibleText, f as resolveLatestCallUsage, i as buildErrorAgentMeta, l as resolveEmbeddedAttemptBasePrompt, m as resolveReportedModelRef, n as RUNTIME_AUTH_REFRESH_MIN_DELAY_MS, o as createRunRecoveryDiagId, p as resolveMaxRunRetryIterations, r as RUNTIME_AUTH_REFRESH_RETRY_MS, s as normalizeAssistantUsageForContext, t as RUNTIME_AUTH_REFRESH_MARGIN_MS, u as resolveFinalAssistantRawText } from "./helpers-CSSpZic_.mjs";
import { t as emitAgentActivityEvent } from "./agent-activity-events-DJmgjmUx.mjs";
import { r as mergeAcceptedSessionSpawnsForRun } from "./accepted-session-spawn-4qfWSWlu.mjs";
import { n as buildAgentHookContextIdentityFields, t as buildAgentHookContextChannelFields } from "./hook-agent-context-C33rGaR3.mjs";
import "./sessions-Cd44ddbA.mjs";
import { i as toNormalizedUsage, n as mergeAttemptRunStatsIntoAccumulator, r as mergeUsageIntoAccumulator, t as createUsageAccumulator } from "./usage-accumulator-CKETh8nK.mjs";
import { r as buildUsageWithNoCost, t as buildAssistantMessage } from "./stream-message-shared-CYuIJ_XF.mjs";
import { i as resolveSessionGitCoauthorPrompt, r as resolveSystemPromptRepoRoot } from "./system-prompt-params-FwwZtF-t.mjs";
import { t as createTrajectoryRuntimeRecorder } from "./runtime-dcUKUERW.mjs";
import { b as resolveSourceReplyDelivery, h as hasOutboundDeliveryEvidence, m as hasMessagingToolDeliveryEvidence } from "./delivery-evidence-B9fCOuaI.mjs";
import { t as TOOL_FAILURE_INSTRUCTION } from "./tool-outcome-instructions-D1-OxlK6.mjs";
import { a as resolveDelegationCapability } from "./agent-tools-Bs9qKBwn.mjs";
import { t as resolveToolLoopDetectionConfig } from "./tool-loop-detection-config-CHx7Z_89.mjs";
import { n as resolveGlobalLane, r as resolveSessionLane } from "./lanes-CVttd5qX.mjs";
import { i as resolveMessagingToolPayloadDedupe, n as filterMessagingToolReplyPayload, t as filterMessagingToolMediaDuplicates } from "./reply-payloads-dedupe-DBMvHabb.mjs";
import { a as selectContextEngineForTranscriptHost, i as createContextEngineLogicalTurnLease, n as drainPendingContextEngineTurnsBeforeRun } from "./context-engine-turn-attempt-D2xPfEYf.mjs";
import { i as selectAgentHarnessForPreparedModelProviders, n as runAgentHarnessSettledTurnFinalization, r as selectAgentHarness, t as runAgentHarnessAttempt } from "./selection-DSUYiL_W.mjs";
import { t as ensureSelectedAgentHarnessPlugin } from "./runtime-plugin-By74qnwW.mjs";
import { a as resolveSessionPlacementSandbox, c as settleFailedRequesterRun, d as resolveEmbeddedRunLaneTimeoutMs, f as resolveEmbeddedRunSessionLanePolicy, l as settleRequesterRun, m as withEmbeddedRunLaneTimeout, p as shouldNoteLaneWait, s as withSessionPlacementTurnAdmission, u as EMBEDDED_RUN_LANE_TIMEOUT_GRACE_MS } from "./session-placement-admission-Gs1bL6J1.mjs";
import { a as setTranscriptBytePreflightClaim, c as prepareCompactionHarnessAuth, d as asCompactionHookRunner, f as runPostCompactionSideEffects, i as resolveTranscriptBytePreflightAuthority, l as projectCodexHostTranscriptBytePreflightConfig, n as compactNativeCliSession, o as resolveTieredModel, p as resolveProjectKey, s as attachCompactionAccountingRecorder, u as resolveCompactionRuntimeSelection } from "./compact-BiIZRaqb.mjs";
import { t as protectPreparedProviderRuntimeAuth } from "./provider-runtime-auth-protection-DFvzygMB.mjs";
import { n as buildAgentRuntimePlan } from "./build-C0I3JfiP.mjs";
import { n as resolveAgentLifecycleTerminalMetadata, t as createAgentLifecycleTerminalBackstop } from "./agent-lifecycle-terminal-BnQVcmxj.mjs";
import { n as buildHandledBeforeAgentReplyPayloads, r as runBeforeAgentReplyForTurn, t as resolveAuthProfileFailureReason } from "./auth-profile-failure-policy-BlLfUqlH.mjs";
import { t as createAssistantErrorTranscript } from "./assistant-error-transcript-C5DoUz1A.mjs";
import { n as redactRunIdentifier, r as resolveRunWorkspaceDir, t as recordAdmittedModelRoutingDecision } from "./model-routing-decision-j5P1RtjY.mjs";
import { r as stripOpenClawMcpToolPrefix } from "./tool-policy-B3nZbUgX.mjs";
import { n as mergeAttemptToolMediaPayloads, t as createPendingToolMediaCarry } from "./tool-media-payloads-jfARP1BY.mjs";
import { r as shouldSwitchToLiveModel, t as clearLiveModelSwitchPending } from "./live-model-switch-CQiobE4o.mjs";
import { a as resolveHookModelSelection, i as resolveEmbeddedRuntimeModelPolicy, n as createNativeModelOwnedRuntimeModel, r as resolveAgentHarnessRunAdmissionError, t as buildBeforeModelResolveAttachments } from "./setup-C903Y5Pd.mjs";
import { t as createEmbeddedRunPermissionChanges } from "./permission-change-JQf8TlGK.mjs";
import { t as captureAgentRunProviderReview } from "./provider-review-terminal-B5VOjps7.mjs";
import { n as createAgentHarnessTaskRuntimeScope } from "./agent-harness-task-runtime-scope-CtBT1UtN.mjs";
import { n as agentHarnessExposesOpenClawTools, t as agentHarnessBuildsOpenClawTools } from "./tool-surface-IfrXL-aa.mjs";
import { r as hasPairedCardRenderer } from "./device-pairing-DbLfxuuq.mjs";
import { n as resolveSessionSkillResourceSnapshot } from "./session-placement-skill-resources-BPi9m8mW.mjs";
import { o as resizeExecApprovalContinuationPrompt } from "./bash-tools.exec-approval-output-ClVy1_Um.mjs";
import { o as prepareGitHubPublicationAvailability } from "./github-publication-availability-CE1CFSwV.mjs";
import { a as resolveRequestStreamTransportOverrides, i as resolveInitialThinkLevel, n as resolveAttemptTrajectoryAttribution, r as resolveInitialEmbeddedRunModel } from "./runtime-resolution-CKskuUO0.mjs";
import { n as incrementCompactionCount } from "./session-updates-CAatLhCF.mjs";
import { r as readSourceReplyDeliveryRuntime } from "./source-reply-delivery-runtime-D3ljIhoI.mjs";
import { t as resolveExternalCliAuthOverlayScopeFromSelection } from "./external-cli-auth-selection-D0LQEcDq.mjs";
import { t as appendAssistantMirrorMessageByIdentity } from "./session-transcript-runtime-BW5gMlRE.mjs";
import { t as applyPreparedReplyMedia } from "./reply-media-paths-7SJueUDk.mjs";
import { r as resolveEmbeddedRunTerminalToolFailure } from "./terminal-tool-failure-D8JFiswW.mjs";
import { t as buildEmbeddedRunPayloads } from "./payloads-CKax0Tdb.mjs";
import { a as fingerprintResolvedAuthProfileCredential, i as fingerprintOpaqueRuntimeOwner, n as fingerprintAuthProfileOwnerShape, o as fingerprintResolvedProviderAuth, r as fingerprintAwsSdkRuntimeOwner } from "./execution-auth-binding-DkIxPe6Z.mjs";
import path from "node:path";
import { AsyncLocalStorage } from "node:async_hooks";
import fs from "node:fs/promises";
import { randomBytes } from "node:crypto";
import { isContextOverflow } from "@openclaw/ai/internal/runtime";
import { CompactionReplayRefreshRequiredError, isCompactionReplayCheckpoint } from "@openclaw/ai/transports";
import { isResponsesOutputLimitToolCallError } from "@openclaw/ai/diagnostics";
//#region src/agents/embedded-agent-runner/compact.foreground-work.ts
/** Keeps physical cleanup separate from the compaction result and transcript fences. */
async function runForegroundCompactionWork(run) {
	const result = createDeferredCore();
	const trackOwner = captureAsyncWorkTracker();
	const parentSignal = getAsyncWorkSignal();
	trackOwner(async () => {
		const work = new AsyncWorkScope();
		const factoryWork = new AsyncWorkScope();
		const cleanupWork = new AsyncWorkScope();
		let runInContext = work.run(() => AsyncLocalStorage.snapshot());
		let factoryContext = factoryWork.run(() => AsyncLocalStorage.snapshot());
		let cleanupContext = cleanupWork.run(() => AsyncLocalStorage.snapshot());
		let foregroundClosed;
		const closeForegroundWork = () => foregroundClosed ??= AsyncWorkScope.runWhenAllIdle(() => [work], () => runInContext(() => work.drain()));
		let factoryClosed;
		const closeFactoryWork = () => factoryClosed ??= factoryContext(() => factoryWork.drain());
		let lease;
		let engine;
		let engineTransferred = false;
		const closeFromParent = () => {
			runInContext(() => work.beginClose(parentSignal?.reason));
			if (!engineTransferred) factoryContext(() => factoryWork.beginClose(parentSignal?.reason));
			cleanupContext(() => cleanupWork.beginClose(parentSignal?.reason));
		};
		parentSignal?.addEventListener("abort", closeFromParent, { once: true });
		if (parentSignal?.aborted) closeFromParent();
		try {
			result.resolve(await work.track(() => run({
				adoptLease: (acquired) => {
					lease = acquired;
					return {
						closeFactoryWork,
						release: async () => {
							await closeForegroundWork();
							await acquired[Symbol.asyncDispose]();
						}
					};
				},
				resolveEngine: (factory) => factoryWork.track(async () => {
					factoryContext = AsyncLocalStorage.snapshot();
					engine = await factory();
					return engine;
				}),
				captureContext: () => {
					runInContext = AsyncLocalStorage.snapshot();
				},
				transferEngine: () => {
					engine = void 0;
					engineTransferred = true;
				}
			})));
		} catch (error) {
			result.reject(error);
		} finally {
			try {
				await closeForegroundWork();
				if (!engineTransferred) {
					cleanupContext = factoryContext(() => cleanupWork.run(() => AsyncLocalStorage.snapshot()));
					const disposal = cleanupContext(() => cleanupWork.track(async () => {
						try {
							await engine?.dispose?.();
						} catch (error) {
							log$3.warn("context engine dispose failed", { errorMessage: formatErrorMessage(error) });
						}
					}));
					await Promise.all([disposal, closeFactoryWork()]);
					await AsyncWorkScope.runWhenAllIdle(() => [cleanupWork], () => cleanupContext(() => cleanupWork.drain()));
				}
			} finally {
				parentSignal?.removeEventListener("abort", closeFromParent);
				if (!engineTransferred) await lease?.[Symbol.asyncDispose]();
			}
		}
	}).catch(result.reject);
	return await result.promise;
}
//#endregion
//#region src/context-engine/types.ts
/**
* Resolve the post-compaction live transcript identity from a compact result.
*
* Prefers the typed `sessionTarget`. Reading the raw fields is the named
* compat path for shipped third-party engines that predate `sessionTarget`;
* it is removed together with the deprecated `sessionFile` result field.
*/
function resolveCompactionSuccessorTranscript(result) {
	return {
		sessionId: (result.result?.sessionTarget)?.sessionId ?? result.result?.sessionId,
		sessionFile: result.result?.sessionFile
	};
}
//#endregion
//#region src/agents/embedded-agent-runner/compact.queued-execution.ts
function createQueuedCompactionAbortedResult() {
	return {
		ok: false,
		compacted: false,
		reason: "compaction aborted"
	};
}
async function withQueuedCompactionCancellationResult(params, run) {
	try {
		return await run();
	} catch (error) {
		const signal = params.abortSignal;
		if (!signal?.aborted || !isAbortError(error) && error !== signal.reason) throw error;
		return createQueuedCompactionAbortedResult();
	}
}
function projectQueuedCompactionSessionTarget(params) {
	const agentId = params.sessionTarget?.agentId ?? params.agentId;
	const sessionKey = params.sessionTarget?.sessionKey ?? params.sessionKey;
	const storePath = params.sessionTarget?.storePath;
	return {
		...agentId ? { agentId } : {},
		sessionId: params.sessionTarget?.sessionId ?? params.sessionId,
		...sessionKey ? { sessionKey } : {},
		...storePath ? { storePath } : {},
		...params.sessionTarget?.threadId !== void 0 ? { threadId: params.sessionTarget.threadId } : {}
	};
}
function mergeSecondaryNativeHarnessCompactionDetails(params) {
	if (!params.nativeResult) return params.details;
	return {
		...isRecord(params.details) ? params.details : params.details === void 0 ? {} : { contextEngine: params.details },
		[params.detailsKey]: params.nativeResult
	};
}
/** Both compaction runtimes cancel pending queue admission before releasing their writer. */
function enqueueCompactionInLanes(params, run) {
	const sessionLane = resolveSessionLane(params.sessionKey?.trim() || params.sessionId);
	const globalLane = resolveGlobalLane(params.lane);
	const enqueueGlobal = params.enqueue ?? ((task, opts) => enqueueCommandInLane(globalLane, task, opts));
	const options = { abortSignal: params.abortSignal };
	return enqueueCommandInLane(sessionLane, () => enqueueGlobal(run, options), options);
}
async function runPrimaryNativeCompactionInLanes(params, expectedEntry, host, run) {
	return await enqueueCompactionInLanes(params, async () => {
		host.assertActive?.();
		const currentEntry = loadSessionEntryReadOnly({
			...params.sessionTarget,
			readConsistency: "latest"
		});
		if (!currentEntry || currentEntry.sessionId !== expectedEntry.sessionId || currentEntry.lifecycleRevision !== expectedEntry.lifecycleRevision || currentEntry.activeWriterRunId !== expectedEntry.activeWriterRunId) throw new SessionTranscriptWriterClaimReboundError();
		return run();
	});
}
async function executeQueuedContextEngineCompaction(input) {
	const { params, preparedParams, runtimeTarget, expectedEntry, host, contextEngine, contextEngineSessionKey, contextEngineRuntimeContext, contextEngineRuntimeSettings, resolvedWorkspaceDir, preparedModelRuntime, effectiveRuntimeModel, preparedHarnessRuntime, contextTokenBudget, attemptNativeHarnessCompaction, transcriptBytePreflightAuthority } = input;
	let expected = { ...expectedEntry };
	return await enqueueCompactionInLanes(params, async () => {
		let closed = false;
		const assertCallerActive = () => {
			params.abortSignal?.throwIfAborted();
			if (closed) throw new Error("queued compaction is no longer active");
			host.assertActive?.();
		};
		const assertActive = (target = runtimeTarget, owner = expected) => {
			assertCallerActive();
			const current = loadSessionEntry({
				...target,
				readConsistency: "latest"
			});
			if (!current || current.sessionId !== owner.sessionId || current.lifecycleRevision !== owner.lifecycleRevision || current.activeWriterRunId !== owner.activeWriterRunId) throw new SessionTranscriptWriterClaimReboundError();
		};
		const createTranscriptWriteContext = (target, owner, signal) => {
			const capturedOwner = { ...owner };
			const sessionTarget = {
				...target,
				expectedLifecycleRevision: capturedOwner.lifecycleRevision,
				expectedWriterRunId: capturedOwner.activeWriterRunId
			};
			const assertCommitAllowed = () => {
				signal?.throwIfAborted();
				assertActive(sessionTarget, capturedOwner);
			};
			assertCommitAllowed();
			return {
				sessionTarget,
				assertCommitAllowed,
				withTranscriptWrite: async (run) => await run()
			};
		};
		const canContinue = () => {
			try {
				assertActive();
				return true;
			} catch (error) {
				if (params.abortSignal?.aborted || closed) return false;
				throw error;
			}
		};
		try {
			if (params.abortSignal?.aborted) return createQueuedCompactionAbortedResult();
			assertActive();
			const engineOwnsCompaction = contextEngine.info.ownsCompaction === true;
			assertActive();
			const hookRunner = engineOwnsCompaction ? asCompactionHookRunner(getGlobalHookRunner()) : null;
			const hookSessionKey = runtimeTarget.sessionKey;
			const { sessionAgentId } = resolveSessionAgentIds({
				sessionKey: params.sessionKey,
				config: params.config,
				agentId: params.agentId
			});
			const resolvedMessageProvider = params.messageChannel ?? params.messageProvider;
			const hookCtx = {
				sessionId: params.sessionId,
				agentId: sessionAgentId,
				sessionKey: hookSessionKey,
				workspaceDir: resolvedWorkspaceDir,
				messageProvider: resolvedMessageProvider
			};
			const runtimeContext = contextEngineRuntimeContext;
			if (hookRunner?.hasHooks?.("before_compaction") && hookRunner.runBeforeCompaction) try {
				await hookRunner.runBeforeCompaction({
					messageCount: -1,
					sessionFile: params.sessionFile
				}, hookCtx);
			} catch (err) {
				log$3.warn("before_compaction hook failed", { errorMessage: formatErrorMessage(err) });
			}
			if (params.abortSignal?.aborted) return createQueuedCompactionAbortedResult();
			assertActive();
			let result;
			let committedCompaction;
			try {
				const compactionSessionTarget = projectQueuedCompactionSessionTarget(params);
				const compact = bindContextEngineCompaction(contextEngine);
				const ownedCompactor = {
					info: contextEngine.info,
					compact: inheritRuntimeCompactionDelegate(compact, (backendParams) => {
						if (backendParams.runtimeContext) attachCompactionAccountingRecorder(backendParams.runtimeContext, {
							requestBudget: host.requestBudget,
							pendingUserEntryId: host.pendingUserEntryId,
							recordCompaction: (receipt) => {
								committedCompaction = receipt;
							}
						});
						const writeContext = createTranscriptWriteContext(runtimeTarget, expectedEntry, backendParams.abortSignal);
						const clearClaim = setTranscriptBytePreflightClaim(backendParams.runtimeContext, transcriptBytePreflightAuthority, host.withCompactionPersistence);
						return withOwnedSessionTranscriptWrites(writeContext, () => compact(backendParams)).finally(clearClaim);
					})
				};
				result = await compactContextEngineWithSafetyTimeout(ownedCompactor, {
					sessionId: params.sessionId,
					sessionKey: hookSessionKey,
					...compactionSessionTarget.agentId ? { agentId: compactionSessionTarget.agentId } : {},
					sessionTarget: compactionSessionTarget,
					tokenBudget: contextTokenBudget,
					currentTokenCount: params.currentTokenCount,
					compactionTarget: params.trigger === "manual" ? "threshold" : "budget",
					customInstructions: params.customInstructions,
					force: params.force === true || params.forcePreflight === true || params.preflightRequired === true || params.trigger === "manual",
					runtimeContext: {
						...runtimeContext,
						forceReason: params.forcePreflight === true || params.preflightRequired === true ? "preflight_required" : params.trigger === "manual" ? "manual" : void 0,
						preflightCompactionTrigger: params.preflightCompactionTrigger
					},
					runtimeSettings: contextEngineRuntimeSettings
				}, resolveCompactionTimeoutMs(params.config), params.abortSignal);
			} catch (compactErr) {
				log$3.warn(committedCompaction ? "post-compaction work failed after the transcript commit" : "context-engine compaction failed", { errorMessage: formatErrorMessage(compactErr) });
				result = {
					ok: false,
					compacted: false,
					reason: formatErrorMessage(compactErr)
				};
			}
			if (committedCompaction && (!result.ok || !result.compacted)) result = {
				ok: true,
				compacted: true,
				reason: result.reason,
				result: {
					tokensBefore: committedCompaction.tokensBefore,
					tokensAfter: committedCompaction.tokensAfter
				}
			};
			let successor = {
				sessionId: params.sessionId,
				sessionFile: params.sessionFile,
				sessionTarget: runtimeTarget
			};
			let tokensAfter = result.result?.tokensAfter;
			if (result.ok && result.compacted) {
				const proposed = resolveCompactionSuccessorTranscript(result);
				const target = result.result?.sessionTarget;
				tokensAfter = (!proposed.sessionId || proposed.sessionId === runtimeTarget.sessionId) && (!proposed.sessionFile || proposed.sessionFile === params.sessionFile) && (!target?.agentId || target.agentId === runtimeTarget.agentId) && (!target?.sessionKey || target.sessionKey === runtimeTarget.sessionKey) && (!target?.storePath || target.storePath === runtimeTarget.storePath) ? result.result?.tokensAfter : void 0;
				try {
					successor = await acceptCompactionSuccessor({
						config: params.config,
						currentSessionFile: params.sessionFile,
						currentTarget: runtimeTarget,
						expectedEntry,
						assertActive: assertCallerActive,
						result,
						onCommitted: (accepted) => {
							expected = {
								sessionId: accepted.entry.sessionId,
								lifecycleRevision: accepted.entry.lifecycleRevision,
								activeWriterRunId: accepted.entry.activeWriterRunId
							};
							host.onCommitted?.(accepted);
						}
					});
					tokensAfter = result.result?.tokensAfter;
				} catch (error) {
					if (!params.abortSignal?.aborted) throw error;
				}
			}
			const compactionKind = committedCompaction?.compactionKind ?? (isRecord(result.result?.details) && result.result.details.compactionKind === "server-endpoint" && typeof tokensAfter === "number" ? "server-endpoint" : "context-engine");
			const hostCommit = successor.entry ? {
				entry: successor.entry,
				tokensAfter,
				compactionKind
			} : void 0;
			if (hostCommit) await host.onHostCompactionCommitted?.(hostCommit);
			const postCompactionSessionId = successor.sessionId;
			const postCompactionSessionFile = successor.sessionFile;
			const postCompactionSessionTarget = successor.sessionTarget;
			let secondaryNativeHarnessCompaction;
			try {
				if (result.ok && result.compacted && canContinue() && contextEngine.maintain) {
					const rewriteContext = createTranscriptWriteContext(postCompactionSessionTarget, expected, params.abortSignal);
					const sessionManager = await SessionManager.openAsync(postCompactionSessionTarget, resolvedWorkspaceDir, void 0, params.abortSignal);
					const maintenance = runContextEngineMaintenance({
						contextEngine,
						sessionId: postCompactionSessionId,
						sessionKey: contextEngineSessionKey ?? params.sessionKey,
						sessionTarget: projectQueuedCompactionSessionTarget({
							...params,
							sessionFile: postCompactionSessionFile,
							sessionId: postCompactionSessionId,
							sessionTarget: postCompactionSessionTarget
						}),
						sessionFile: postCompactionSessionFile,
						reason: "compaction",
						sessionManager,
						withSessionManagerRewriteLock: async (operation) => await withOwnedSessionTranscriptWrites(rewriteContext, async () => {
							rewriteContext.assertCommitAllowed();
							await sessionManager.reloadPersistedTranscriptAsync(params.abortSignal);
							rewriteContext.assertCommitAllowed();
							return await operation();
						}),
						runtimeContext,
						runtimeSettings: contextEngineRuntimeSettings,
						config: params.config,
						contextEngineAgentId: params.contextEngineAgentId,
						assertActive: rewriteContext.assertCommitAllowed,
						abortSignal: params.abortSignal
					});
					try {
						await maintenance;
					} finally {
						if (hostCommit) await host.onHostCompactionTranscriptSettled?.(hostCommit);
					}
				}
				if (engineOwnsCompaction && result.ok && result.compacted && canContinue()) await runPostCompactionSideEffects({
					config: params.config,
					sessionKey: params.sessionKey,
					sessionId: postCompactionSessionId,
					agentId: sessionAgentId,
					sessionFile: postCompactionSessionFile,
					assertActive
				});
				if (result.ok && canContinue() && hookRunner?.hasHooks?.("after_compaction") && hookRunner.runAfterCompaction) try {
					const afterHookCtx = {
						...hookCtx,
						sessionId: postCompactionSessionId
					};
					await hookRunner.runAfterCompaction({
						messageCount: -1,
						compactedCount: result.compacted ? -1 : 0,
						tokenCount: result.result?.tokensAfter,
						sessionFile: postCompactionSessionFile,
						...postCompactionSessionId !== params.sessionId ? { previousSessionId: params.sessionId } : {}
					}, afterHookCtx);
				} catch (err) {
					log$3.warn("after_compaction hook failed", { errorMessage: formatErrorMessage(err) });
				}
				if ((engineOwnsCompaction || transcriptBytePreflightAuthority) && result.ok && result.compacted && canContinue() && attemptNativeHarnessCompaction) try {
					secondaryNativeHarnessCompaction = await maybeCompactAgentHarnessSession({
						...preparedParams,
						sessionId: postCompactionSessionId,
						sessionFile: postCompactionSessionFile,
						sessionTarget: postCompactionSessionTarget,
						...successor.entry ? { sessionEntry: projectPublicSessionEntry(successor.entry) } : {},
						runtimeModel: effectiveRuntimeModel,
						contextEngine,
						contextTokenBudget,
						contextEngineRuntimeContext
					}, {
						nativeCompactionRequest: "after_context_engine",
						preparedModelRuntime
					});
					if (secondaryNativeHarnessCompaction && !secondaryNativeHarnessCompaction.ok) log$3.warn("secondary native harness compaction failed after context-engine compaction", { reason: secondaryNativeHarnessCompaction.reason });
				} catch (err) {
					secondaryNativeHarnessCompaction = {
						ok: false,
						compacted: false,
						reason: formatErrorMessage(err)
					};
					log$3.warn("secondary native harness compaction threw after context-engine compaction", { errorMessage: formatErrorMessage(err) });
				}
			} catch (error) {
				if (canContinue()) throw error;
			}
			const secondaryNativeDetailsKey = normalizeOptionalAgentRuntimeId(preparedHarnessRuntime) === "codex" ? "codexNativeCompaction" : "nativeHarnessCompaction";
			return {
				ok: result.ok,
				compacted: result.compacted,
				compactionKind,
				reason: result.reason,
				result: result.result ? {
					...compactionKind === "server-endpoint" ? { kind: "server-endpoint" } : {
						summary: result.result.summary ?? "",
						firstKeptEntryId: result.result.firstKeptEntryId ?? ""
					},
					tokensBefore: result.result.tokensBefore,
					tokensAfter,
					details: mergeSecondaryNativeHarnessCompactionDetails({
						details: result.result.details,
						nativeResult: secondaryNativeHarnessCompaction,
						detailsKey: secondaryNativeDetailsKey
					}),
					...postCompactionSessionId !== params.sessionId ? { sessionId: postCompactionSessionId } : {},
					...postCompactionSessionFile !== params.sessionFile ? { sessionFile: postCompactionSessionFile } : {}
				} : void 0
			};
		} finally {
			closed = true;
		}
	});
}
//#endregion
//#region src/agents/embedded-agent-runner/compact.queued.ts
/**
* Queues embedded-agent session compaction onto the correct command lane.
*/
function lockedCompactionRuntimeFailure(runtime) {
	return {
		ok: false,
		compacted: false,
		reason: runtime ? `Model selection is locked to native agent harness "${runtime}", but native compaction is unavailable.` : "Model selection is locked but the persisted agent harness is unavailable.",
		failure: { reason: "model_selection_locked" }
	};
}
const DEFERRED_CONTEXT_ENGINE_COMPACTION_SCHEDULE_FAILURE_REASON = "failed to schedule background context-engine maintenance";
const MANUAL_COMPACTION_ACTIVE_RUN_REASON = "manual compaction unavailable while another embedded run is active";
function assertQueuedCompactionPreparationActive(params, host) {
	params.abortSignal?.throwIfAborted();
	host.assertActive?.();
}
function resolveManualCompactionActiveRunSessionId(params) {
	return (isEmbeddedAgentRunHandleActive(params.sessionId) ? params.sessionId : void 0) ?? (params.sessionKey ? resolveActiveEmbeddedRunHandleSessionId(params.sessionKey) : void 0) ?? resolveActiveEmbeddedRunHandleSessionIdBySessionFile(params.sessionFile);
}
async function deferOwningContextEngineBudgetCompaction(params) {
	let deferredScheduled = false;
	let deferredScheduleFailure;
	try {
		await runContextEngineMaintenance({
			contextEngine: params.contextEngine,
			sessionId: params.compactParams.sessionId,
			sessionKey: params.contextEngineSessionKey ?? params.compactParams.sessionKey,
			sessionTarget: projectQueuedCompactionSessionTarget(params.compactParams),
			sessionFile: params.compactParams.sessionFile,
			reason: "turn",
			runtimeContext: params.contextEngineRuntimeContext,
			runtimeSettings: params.contextEngineRuntimeSettings,
			config: params.compactParams.config,
			contextEngineAgentId: params.compactParams.contextEngineAgentId,
			disposeDeferredContextEngineAfterMaintenance: true,
			factoryResources: params.factoryResources,
			onDeferredMaintenance: (completion) => {
				deferredScheduled = true;
				params.onDeferredMaintenance(completion);
			},
			onDeferredMaintenanceFailure: (error) => {
				deferredScheduleFailure = error;
			}
		});
	} catch (err) {
		log$3.warn("failed to defer context-engine budget compaction", { errorMessage: formatErrorMessage(err) });
	}
	if (!deferredScheduled || deferredScheduleFailure) {
		log$3.warn(`[compaction] failed to schedule context-engine-owned budget compaction background maintenance (sessionKey=${params.compactParams.sessionKey ?? params.compactParams.sessionId}${deferredScheduleFailure ? ` error=${formatErrorMessage(deferredScheduleFailure)}` : ""})`);
		return {
			ok: false,
			compacted: false,
			reason: DEFERRED_CONTEXT_ENGINE_COMPACTION_SCHEDULE_FAILURE_REASON,
			failure: { reason: "deferred_compaction_not_scheduled" }
		};
	}
	log$3.info(`[compaction] deferred context-engine-owned budget compaction to background maintenance (sessionKey=${params.compactParams.sessionKey ?? params.compactParams.sessionId} scheduled=${String(deferredScheduled)})`);
	return {
		ok: true,
		compacted: false,
		reason: DEFERRED_CONTEXT_ENGINE_COMPACTION_REASON
	};
}
/**
* Compacts a session with lane queueing (session lane + global lane).
* Use this from outside a lane context. If already inside a lane, use
* `compactEmbeddedAgentSessionDirect` to avoid deadlocks.
*/
async function compactEmbeddedAgentSession(params, host = {}) {
	const projectedConfig = projectCodexHostTranscriptBytePreflightConfig(params.config, Boolean(host.transcriptBytePreflightHarness));
	const contextEngineAgentId = normalizeOptionalString(params.contextEngineAgentId) ?? normalizeOptionalString(params.agentId);
	const contextEngineSessionKey = normalizeOptionalString(params.sessionKey) ?? normalizeOptionalString(params.sessionTarget?.sessionKey);
	const runtimeTarget = await resolveAgentRunSessionTarget({
		...params,
		missingSessionKey: "resolve-existing"
	});
	const releaseForeground = params.trigger === "manual" ? await beginForegroundSessionMaintenance(runtimeTarget.sessionKey) : void 0;
	try {
		const entry = loadSessionEntryReadOnly({
			...runtimeTarget,
			readConsistency: "latest"
		});
		const expectedEntry = {
			sessionId: runtimeTarget.sessionId,
			lifecycleRevision: entry?.lifecycleRevision,
			activeWriterRunId: entry?.activeWriterRunId
		};
		const resolvedParams = {
			...params,
			config: projectedConfig,
			sessionEntry: entry ? projectPublicSessionEntry(entry) : void 0,
			agentHarnessId: resolveSessionPinnedHarnessId(entry) ?? params.agentHarnessId,
			modelSelectionLocked: entry?.modelSelectionLocked ?? params.modelSelectionLocked,
			agentId: runtimeTarget.agentId,
			sessionId: runtimeTarget.sessionId,
			sessionKey: runtimeTarget.sessionKey,
			sessionTarget: runtimeTarget,
			sessionFile: runtimeTarget.sessionKey,
			contextEngineAgentId
		};
		if (resolvedParams.trigger !== "manual") return await withQueuedCompactionCancellationResult(resolvedParams, () => compactEmbeddedAgentSessionImpl(resolvedParams, expectedEntry, host, contextEngineSessionKey));
		if (resolveManualCompactionActiveRunSessionId(resolvedParams)) return {
			ok: false,
			compacted: false,
			reason: MANUAL_COMPACTION_ACTIVE_RUN_REASON,
			failure: { reason: "active_run" }
		};
		const controller = new AbortController();
		const abortSignal = resolvedParams.abortSignal ? AbortSignal.any([resolvedParams.abortSignal, controller.signal]) : controller.signal;
		const handle = {
			kind: "embedded",
			queueMessage: async () => {},
			isStreaming: () => true,
			isAborted: () => abortSignal.aborted,
			isCompacting: () => true,
			abort: (reason) => controller.abort(reason ?? "user_abort"),
			cancel: (reason) => controller.abort(reason ?? "user_abort")
		};
		const activeParams = {
			...resolvedParams,
			abortSignal
		};
		setActiveEmbeddedRun(resolvedParams.sessionId, handle, resolvedParams.sessionKey, resolvedParams.sessionFile, resolvedParams.agentId);
		try {
			return await withQueuedCompactionCancellationResult(activeParams, () => compactEmbeddedAgentSessionImpl(activeParams, expectedEntry, host, contextEngineSessionKey));
		} finally {
			clearActiveEmbeddedRun(resolvedParams.sessionId, handle, resolvedParams.sessionKey, resolvedParams.sessionFile);
		}
	} finally {
		releaseForeground?.();
	}
}
async function compactEmbeddedAgentSessionImpl(params, expectedEntry, host, contextEngineSessionKey) {
	return await runForegroundCompactionWork((owner) => compactEmbeddedAgentSessionPrepared(params, expectedEntry, host, contextEngineSessionKey, owner));
}
async function compactEmbeddedAgentSessionPrepared(params, expectedEntry, host, contextEngineSessionKey, owner) {
	if (params.abortSignal?.aborted) return createQueuedCompactionAbortedResult();
	host.assertActive?.();
	const runtimeTarget = params.sessionTarget;
	const agentIds = resolveSessionAgentIds({
		sessionKey: runtimeTarget.sessionKey,
		config: params.config,
		agentId: runtimeTarget.agentId
	});
	const agentDir = params.agentDir ?? resolveAgentDir(params.config ?? {}, agentIds.sessionAgentId);
	const resolvedWorkspaceDir = resolveUserPath(params.workspaceDir);
	const placementSandbox = params.sandbox === void 0 ? await resolveSessionPlacementSandbox({
		agentId: runtimeTarget.agentId,
		config: params.config,
		sessionId: runtimeTarget.sessionId,
		sessionKey: runtimeTarget.sessionKey,
		workspaceDir: resolvedWorkspaceDir
	}) : null;
	assertQueuedCompactionPreparationActive(params, host);
	const requestedSelection = {
		...params,
		modelId: params.model,
		boundHarnessRuntime: params.agentHarnessId,
		preparedRuntimePlan: params.runtimePlan,
		selectedHarnessRuntime: resolveSessionPinnedHarnessId(params.sessionEntry)
	};
	const runtimeSelection = resolveCompactionRuntimeSelection(requestedSelection);
	const nativeCliResult = await compactNativeCliSession({
		runtime: runtimeSelection.selectedHarnessRuntime,
		compactParams: {
			...params,
			agentDir,
			workspaceDir: resolvedWorkspaceDir
		},
		runControlOperation: (run) => runPrimaryNativeCompactionInLanes(params, expectedEntry, host, run)
	});
	if (nativeCliResult) return nativeCliResult;
	assertQueuedCompactionPreparationActive(params, host);
	const lease = await runOutsidePluginRuntimeGenerationScope(() => acquireAgentRunPreparedModelRuntime({
		config: params.config ?? {},
		agentId: agentIds.sessionAgentId,
		agentDir,
		workspaceDir: resolvedWorkspaceDir,
		...params.allowGatewaySubagentBinding ? { allowGatewaySubagentBinding: true } : {}
	}, {
		abortSignal: params.abortSignal,
		deriveRuntimePluginSelections: ({ config, metadataSnapshot }) => {
			const selected = resolveCompactionRuntimeSelection({
				...requestedSelection,
				config: projectCodexHostTranscriptBytePreflightConfig(config, Boolean(host.transcriptBytePreflightHarness)),
				manifestPlugins: metadataSnapshot,
				allowPluginNormalization: false
			});
			return [{
				provider: selected.provider,
				modelId: selected.modelId,
				runtime: selected.selectedHarnessRuntime,
				agentId: agentIds.sessionAgentId
			}];
		}
	}));
	const factoryResources = owner.adoptLease(lease);
	const preparedParams = {
		...params,
		...placementSandbox ? { sandbox: placementSandbox } : {},
		config: projectCodexHostTranscriptBytePreflightConfig(lease.snapshot.config, Boolean(host.transcriptBytePreflightHarness)),
		agentDir: lease.snapshot.agentDir
	};
	const run = async () => {
		owner.captureContext();
		ensureContextEnginesInitialized();
		const contextEngine = await owner.resolveEngine(() => resolveContextEngine(preparedParams.config, {
			agentDir: preparedParams.agentDir,
			workspaceDir: resolvedWorkspaceDir
		}));
		assertQueuedCompactionPreparationActive(params, host);
		return await compactResolvedContextEngine(preparedParams, expectedEntry, host, contextEngine, preparedParams.agentDir, resolvedWorkspaceDir, lease.snapshot, contextEngineSessionKey, owner.transferEngine, factoryResources);
	};
	assertQueuedCompactionPreparationActive(params, host);
	return await withPluginRuntimeGenerationScope(lease.snapshot, run);
}
async function compactResolvedContextEngine(params, expectedEntry, host, contextEngine, agentDir, resolvedWorkspaceDir, preparedModelRuntime, contextEngineSessionKey, transferContextEngineOwnership, factoryResources) {
	const runtimeTarget = params.sessionTarget;
	const lockedHarnessRuntime = resolveSessionPinnedHarnessId(params.sessionEntry);
	if (lockedHarnessRuntime === "auto") return lockedCompactionRuntimeFailure();
	const { runtimePolicySessionKey, runtimePolicyAgentId, selectedHarnessRuntime, target: resolvedCompactionTarget, runtimeModelAuth: { plan: reusableRuntimeAuthPlan, modelAuth: initialModelAuth }, provider: ceProvider, runtimeProvider: ceRuntimeProvider, contextConfigProvider: ceContextConfigProvider, modelId: ceModelId, attemptNativeHarnessCompaction: selectedNativeHarnessCompaction } = resolveCompactionRuntimeSelection({
		...params,
		modelId: params.model,
		boundHarnessRuntime: params.agentHarnessId,
		preparedRuntimePlan: params.runtimePlan,
		selectedHarnessRuntime: lockedHarnessRuntime
	});
	const lockedNativeHarness = Boolean(lockedHarnessRuntime && lockedHarnessRuntime !== "openclaw");
	await ensureSelectedAgentHarnessPlugin({
		config: params.config,
		provider: ceProvider,
		modelId: ceModelId,
		agentId: runtimePolicyAgentId,
		sessionKey: runtimePolicySessionKey,
		agentHarnessId: params.agentHarnessId,
		agentHarnessRuntimeOverride: selectedHarnessRuntime,
		workspaceDir: resolvedWorkspaceDir,
		pluginRegistry: requireActivePluginRegistry()
	});
	assertQueuedCompactionPreparationActive(params, host);
	const { resolution: modelResolution } = await resolveTieredModel({
		abortSignal: params.abortSignal,
		provider: ceRuntimeProvider,
		modelId: ceModelId,
		agentDir,
		config: params.config,
		workspaceDir: resolvedWorkspaceDir,
		...initialModelAuth,
		preparedModelRuntime
	});
	assertQueuedCompactionPreparationActive(params, host);
	const { model: ceModel, authStorage, modelRegistry } = modelResolution;
	const ceRuntimeModel = ceModel;
	const preparedAuth = await prepareCompactionHarnessAuth({
		...params,
		provider: ceProvider,
		metadataProvider: ceRuntimeProvider,
		modelId: ceModelId,
		model: ceRuntimeModel,
		reusableRuntimeAuthPlan,
		agentDir,
		workspaceDir: resolvedWorkspaceDir,
		authProfileId: resolvedCompactionTarget.authProfileId,
		runtimePolicyAgentId,
		runtimePolicySessionKey,
		agentHarnessRuntimeOverride: selectedHarnessRuntime,
		convergenceErrorPrefix: "Prepared queued compaction"
	});
	assertQueuedCompactionPreparationActive(params, host);
	if (!preparedAuth.ok) return {
		ok: false,
		compacted: false,
		reason: formatErrorMessage(preparedAuth.error)
	};
	const { runtimeAuthPreparation, selectedPreparedHarness, providerUsesProfileScopedModelMetadata } = preparedAuth;
	const preparedHarnessRuntime = selectedPreparedHarness.id;
	const transcriptBytePreflightAuthority = host.transcriptBytePreflightHarness === preparedHarnessRuntime ? resolveTranscriptBytePreflightAuthority(selectedPreparedHarness) : void 0;
	if (host.transcriptBytePreflightHarness && !transcriptBytePreflightAuthority) return lockedCompactionRuntimeFailure(host.transcriptBytePreflightHarness);
	const attemptNativeHarnessCompaction = selectedNativeHarnessCompaction && preparedHarnessRuntime !== "openclaw";
	const runtimeAuthPlan = runtimeAuthPreparation.plan;
	const effectiveRuntimeModel = await materializePreparedRuntimeModel({
		plan: runtimeAuthPlan,
		provider: ceProvider,
		modelId: ceModelId,
		config: params.config,
		workspaceDir: resolvedWorkspaceDir,
		metadataSnapshot: preparedModelRuntime.metadataSnapshot,
		model: ceRuntimeModel,
		forceResolve: providerUsesProfileScopedModelMetadata && Boolean(runtimeAuthPlan.selectedAuthMode),
		resolveModel: async ({ config, authProfileId, authProfileMode }) => {
			const resolved = await resolveModelAsync(ceRuntimeProvider, ceModelId, agentDir, config, {
				abortSignal: params.abortSignal,
				authStorage,
				modelRegistry,
				preparedModelRuntime,
				skipAgentDiscovery: true,
				allowBundledStaticCatalogFallback: true,
				workspaceDir: resolvedWorkspaceDir,
				authProfileId,
				authProfileMode
			});
			assertQueuedCompactionPreparationActive(params, host);
			return {
				...resolved,
				model: resolved.model
			};
		}
	});
	assertQueuedCompactionPreparationActive(params, host);
	const preparedParams = {
		...params,
		provider: ceProvider,
		model: ceModelId,
		agentHarnessId: preparedHarnessRuntime,
		...reusableRuntimeAuthPlan ? {
			authProfileId: runtimeAuthPlan.forwardedAuthProfileId,
			authProfileIdSource: runtimeAuthPlan.forwardedAuthProfileSource,
			runtimeAuthPlan
		} : {
			authProfileId: resolvedCompactionTarget.authProfileId,
			authProfileIdSource: resolvedCompactionTarget.authProfileId ? params.authProfileIdSource : void 0,
			runtimeAuthPlan: void 0,
			runtimePlan: void 0
		}
	};
	const contextTokenBudget = resolveCompactionContextTokenBudget({
		config: params.config,
		provider: ceContextConfigProvider,
		modelId: ceModelId,
		model: effectiveRuntimeModel,
		agentId: runtimeTarget.agentId,
		requestedTokenBudget: params.contextTokenBudget
	});
	const contextEngineRuntimeContext = buildCompactionContextEngineRuntimeContext({
		params: preparedParams,
		agentDir,
		harnessRuntime: preparedHarnessRuntime,
		contextEngineSessionKey,
		contextTokenBudget,
		contextEnginePluginId: resolveContextEngineOwnerPluginId(contextEngine)
	});
	const contextEngineRuntimeSettings = buildContextEngineRuntimeSettings({
		contextEngineHost: OPENCLAW_EMBEDDED_CONTEXT_ENGINE_HOST,
		provider: ceProvider,
		requestedModel: params.model,
		resolvedModel: ceModelId,
		selectedContextEngineId: contextEngine.info.id,
		contextEngineSelectionSource: contextEngine.info.id === "legacy" ? "default" : "configured",
		promptTokenBudget: contextTokenBudget
	});
	const contextEngineOwnsCompaction = contextEngine.info.ownsCompaction === true;
	let requiredPreflightNativeCapabilityUsed = false;
	const harnessResult = attemptNativeHarnessCompaction && !transcriptBytePreflightAuthority && (!contextEngineOwnsCompaction || lockedNativeHarness) ? await runPrimaryNativeCompactionInLanes(preparedParams, expectedEntry, host, async () => {
		if (params.abortSignal?.aborted) return createQueuedCompactionAbortedResult();
		return await maybeCompactAgentHarnessSession({
			...preparedParams,
			runtimeModel: effectiveRuntimeModel,
			contextEngine,
			contextTokenBudget,
			contextEngineRuntimeContext
		}, {
			preparedModelRuntime,
			...preparedParams.preflightRequired === true ? {
				nativeCompactionRequest: "required_preflight",
				onNativeCompactionCapabilityUsed: () => {
					requiredPreflightNativeCapabilityUsed = true;
				}
			} : {}
		});
	}) : void 0;
	if (lockedNativeHarness && !transcriptBytePreflightAuthority && !(preparedParams.preflightRequired === true && requiredPreflightNativeCapabilityUsed && isRecoverableNativeHarnessBindingFailure(harnessResult))) return harnessResult ?? lockedCompactionRuntimeFailure(selectedHarnessRuntime);
	if (harnessResult) {
		if (!isRecoverableNativeHarnessBindingFailure(harnessResult)) return {
			...harnessResult,
			compactionKind: "native-harness"
		};
		log$3.warn(`native harness compaction could not use its session binding; falling back to context engine: ${harnessResult.reason ?? "unknown"}`);
	}
	if (params.abortSignal?.aborted) return createQueuedCompactionAbortedResult();
	host.assertActive?.();
	if (preparedParams.deferOwningContextEngineCompaction === true && preparedParams.trigger === "budget" && contextEngineOwnsCompaction && contextEngine.info.turnMaintenanceMode === "background" && typeof contextEngine.maintain === "function") return await deferOwningContextEngineBudgetCompaction({
		compactParams: preparedParams,
		contextEngineSessionKey,
		contextEngine,
		contextEngineRuntimeContext,
		contextEngineRuntimeSettings,
		onDeferredMaintenance: transferContextEngineOwnership,
		factoryResources
	});
	return await executeQueuedContextEngineCompaction({
		params,
		preparedParams,
		runtimeTarget,
		expectedEntry,
		host,
		contextEngine,
		contextEngineSessionKey,
		contextEngineRuntimeContext,
		contextEngineRuntimeSettings,
		resolvedWorkspaceDir,
		preparedModelRuntime,
		effectiveRuntimeModel,
		preparedHarnessRuntime,
		contextTokenBudget,
		attemptNativeHarnessCompaction,
		transcriptBytePreflightAuthority
	});
}
function buildCompactionContextEngineRuntimeContext(params) {
	const { sessionFile: _sessionFile, contextEngineAgentId, ...runtimeParams } = params.params;
	return {
		...runtimeParams,
		sessionTarget: projectQueuedCompactionSessionTarget(params.params),
		...buildEmbeddedCompactionRuntimeContext({
			...params.params,
			agentDir: params.agentDir,
			modelId: params.params.model,
			harnessRuntime: params.harnessRuntime
		}),
		...resolveContextEngineCapabilities({
			config: params.params.config,
			sessionKey: params.contextEngineSessionKey ?? params.params.sessionKey,
			explicitAgentId: contextEngineAgentId,
			authProfileId: params.params.authProfileId,
			contextEnginePluginId: params.contextEnginePluginId,
			purpose: "context-engine.compaction"
		}),
		tokenBudget: params.contextTokenBudget,
		currentTokenCount: params.params.currentTokenCount
	};
}
//#endregion
//#region src/agents/embedded-agent-runner/cli-backend-dispatch-transcript.ts
/**
* Transcript recorder for CLI-dispatched embedded runs.
*
* The CLI backend runs its tool loop inside the external process and writes
* no OpenClaw transcript records, but one-shot callers (e.g. active-memory
* recall) read the run's transcript for timeout partial-text salvage,
* tool-result evidence, and a live terminal-search watcher that polls
* mid-run. Mirror the run into canonical transcript records through the
* session accessor: the user turn at start, tool calls/results as they
* stream, and the final assistant snapshot at run end.
*/
const log$2 = createSubsystemLogger("agents/embedded-cli-dispatch");
/**
* Records a CLI-dispatched run into the run's session transcript by session
* identity. Tool records append as events arrive (the terminal-search
* watcher polls the transcript live); the assistant snapshot is held in
* memory and flushed once at finalize (or immediately on abort) so streamed
* text does not append a record per delta while timeout salvage still finds
* the last text the model produced.
*/
function createCliDispatchTranscriptRecorder(params) {
	let tail = Promise.resolve();
	let lastAssistantText = "";
	let lastWrittenAssistantText = "";
	let finalized = false;
	let turnTainted = false;
	let toolRecordSequence = 0;
	const scope = {
		sessionId: params.sessionId,
		sessionKey: params.sessionKey,
		agentId: params.agentId,
		storePath: params.storePath,
		sessionFile: params.sessionFile,
		expectedLifecycleRevision: params.expectedLifecycleRevision,
		expectedWriterRunId: params.expectedWriterRunId
	};
	const enqueue = (build) => {
		tail = tail.then(async () => {
			await appendTranscriptMessage(scope, {
				message: build(),
				config: params.config,
				cwd: params.cwd
			});
		});
		tail = tail.catch((error) => {
			log$2.warn(`cli dispatch transcript append failed: runId=${params.runId} error=${String(error)}`);
		});
	};
	const model = {
		api: "cli",
		provider: params.provider,
		id: params.model ?? ""
	};
	const buildZeroUsageAssistantMessage = (content, stopReason, tainted = turnTainted) => {
		const message = buildAssistantMessage({
			model,
			content,
			stopReason,
			usage: buildUsageWithNoCost({})
		});
		return tainted ? {
			...message,
			__openclaw: { turnTainted: true }
		} : message;
	};
	enqueue(() => ({
		role: "user",
		content: [{
			type: "text",
			text: params.prompt
		}],
		timestamp: Date.now(),
		...params.senderIsOwner !== void 0 ? { __openclaw: { senderIsOwner: params.senderIsOwner } } : {}
	}));
	return {
		noteToolEvent: (event) => {
			if (finalized) return;
			toolRecordSequence += 1;
			const toolCallId = event.toolCallId?.trim() || `${params.runId}-tool-${String(toolRecordSequence)}`;
			if (event.phase === "start") {
				const taintedAtStart = turnTainted;
				enqueue(() => buildZeroUsageAssistantMessage([{
					type: "toolCall",
					id: toolCallId,
					name: event.toolName,
					arguments: event.args ?? {}
				}], "toolUse", taintedAtStart));
				return;
			}
			turnTainted ||= event.resultContentSource === "network";
			enqueue(() => ({
				role: "toolResult",
				toolCallId,
				toolName: event.toolName,
				content: normalizeToolResultContent(event.result),
				details: readToolResultDetails(event.result),
				isError: event.isError === true,
				timestamp: Date.now(),
				...event.resultContentSource ? { __openclaw: { resultContentSource: event.resultContentSource } } : {}
			}));
		},
		noteAssistantText: (text) => {
			if (!finalized && text.trim()) lastAssistantText = text;
		},
		flushAssistantSnapshot: () => {
			if (finalized) return;
			const text = lastAssistantText.trim();
			if (!text || text === lastWrittenAssistantText) return;
			lastWrittenAssistantText = text;
			enqueue(() => buildZeroUsageAssistantMessage([{
				type: "text",
				text
			}], "aborted"));
		},
		finalize: async (finalText) => {
			if (finalized) {
				await tail;
				return;
			}
			finalized = true;
			const text = finalText?.trim() || lastAssistantText.trim();
			if (text && text !== lastWrittenAssistantText) {
				lastWrittenAssistantText = text;
				enqueue(() => buildZeroUsageAssistantMessage([{
					type: "text",
					text
				}], "stop"));
			}
			await tail;
		}
	};
}
/** Maps a sanitized CLI tool result onto transcript content blocks. */
function normalizeToolResultContent(result) {
	if (typeof result === "string") return result ? [{
		type: "text",
		text: result
	}] : [];
	if (!result || typeof result !== "object") return [];
	const content = Array.isArray(result) ? result : result.content;
	if (!Array.isArray(content)) return [];
	const blocks = [];
	for (const block of content) {
		if (typeof block === "string") {
			blocks.push({
				type: "text",
				text: block
			});
			continue;
		}
		if (!block || typeof block !== "object") continue;
		const type = block.type;
		const text = block.text;
		if (type === "text" && typeof text === "string") {
			blocks.push({
				type: "text",
				text
			});
			continue;
		}
		const data = block.data;
		const mimeType = block.mimeType;
		if (type === "image" && typeof data === "string" && typeof mimeType === "string") blocks.push({
			type: "image",
			data,
			mimeType
		});
	}
	return blocks;
}
function readToolResultDetails(result) {
	if (!result || typeof result !== "object") return;
	const details = result.details;
	return details && typeof details === "object" ? details : void 0;
}
//#endregion
//#region src/agents/embedded-agent-runner/cli-backend-dispatch.ts
/**
* Opt-in CLI-backend dispatch for one-shot embedded runs.
*
* Embedded runs targeting a CLI runtime provider normally fall through to the
* openclaw harness and call the provider API directly with that runtime's
* credentials (`cli_runtime_passthrough_openclaw`). Anthropic routes direct
* anthropic-messages calls on subscription OAuth tokens to metered "extra
* usage" billing: without extra-usage balance the passthrough fails closed
* with a billing error, and with it the run silently draws paid usage instead
* of the plan limits the CLI runtime was configured for. Callers that
* tolerate CLI latency opt in via `cliBackendDispatch: "subscription-auth"`
* to run through the CLI backend on plan limits instead.
*/
const log$1 = createSubsystemLogger("agents/embedded-cli-dispatch");
/**
* Runs the embedded turn through the CLI backend when the opt-in dispatch
* gate matches; returns undefined so the caller continues on the native path.
*/
async function runEmbeddedAgentViaCliBackendIfEligible(params) {
	const dispatch = resolveEmbeddedCliBackendDispatch(params);
	return dispatch ? await runEmbeddedAgentViaCliBackend(params, dispatch) : void 0;
}
/** Applies the opt-in and transcript-path gates on top of shared eligibility. */
function resolveEmbeddedCliBackendDispatch(params) {
	if (params.cliBackendDispatch !== "subscription-auth") return;
	if (params.sourceReplyDeliveryMode === "message_tool_only") return;
	const sessionFile = params.sessionFile?.trim();
	if (!sessionFile) return;
	const toolsAllow = resolveDispatchableToolsAllow(params);
	if (!toolsAllow) return;
	const eligibility = resolveEmbeddedCliBackendDispatchEligibility(params);
	return eligibility ? {
		provider: eligibility.provider,
		sessionFile,
		toolsAllow
	} : void 0;
}
/**
* Fail closed on tool policy: dispatch only runs whose embedded tool state the
* CLI bridge can express faithfully — a non-empty named allowlist bounded by
* the loopback grant. Deny-all (`[]`), wildcards, absent allowlists, and
* flag-based restrictions (`disableTools`, `modelRun`) keep the embedded
* passthrough so no closed state silently widens on the CLI surface; full
* translation can arrive with the first caller that needs it (#57326).
*/
function resolveDispatchableToolsAllow(params) {
	if (params.disableTools || params.modelRun) return;
	if (!params.toolsAllow || params.toolsAllow.length === 0) return;
	const names = params.toolsAllow.map((name) => normalizeToolPolicyName(name));
	if (names.some((name) => !name || name === "*" || name.includes("*"))) return;
	return [...new Set(names)];
}
/** Runs an opted-in embedded run through the CLI backend as a one-shot turn. */
async function runEmbeddedAgentViaCliBackend(params, dispatch) {
	const { runCliAgent } = await import("./cli-runner.runtime.js");
	const admittedRunContext = await resolvePreparedRunAdmission({
		runId: params.runId,
		runtimeKind: "embedded",
		admittedRunContext: params.admittedRunContext,
		preparedRunAdmission: params.preparedRunAdmission
	});
	const cliToolAvailability = {
		native: [],
		openClaw: dispatch.toolsAllow
	};
	const onAgentToolResult = params.onAgentToolResult;
	const { storePath, expectedLifecycleRevision, expectedWriterRunId } = params.sessionTarget;
	const transcript = params.sessionManager || params.sessionPersistence === "detached" ? void 0 : createCliDispatchTranscriptRecorder({
		sessionId: params.sessionId,
		sessionKey: params.sessionKey,
		agentId: params.agentId,
		storePath,
		sessionFile: dispatch.sessionFile,
		runId: params.runId,
		prompt: params.prompt,
		provider: dispatch.provider,
		model: params.model,
		cwd: params.cwd ?? params.workspaceDir,
		config: params.config,
		expectedLifecycleRevision,
		expectedWriterRunId,
		...params.senderIsOwner !== void 0 ? { senderIsOwner: params.senderIsOwner } : {}
	});
	const unsubscribe = onAgentEventForRun(params.runId, (evt) => {
		if (evt.runId !== params.runId) return;
		if (evt.stream === "assistant" && typeof evt.data.text === "string") {
			transcript?.noteAssistantText(evt.data.text);
			return;
		}
		if (evt.stream !== "tool") return;
		const phase = evt.data.phase;
		if (phase !== "start" && phase !== "result") return;
		const rawName = typeof evt.data.name === "string" ? evt.data.name : "";
		if (!rawName) return;
		const toolName = normalizeToolPolicyName(stripOpenClawMcpToolPrefix(rawName));
		const toolCallId = typeof evt.data.toolCallId === "string" ? evt.data.toolCallId : void 0;
		if (phase === "start") {
			transcript?.noteToolEvent({
				phase,
				toolName,
				toolCallId,
				args: isRecord(evt.data.args) ? evt.data.args : void 0
			});
			return;
		}
		const isError = evt.data.isError === true || isToolResultError(evt.data.result);
		const resultContentSource = evt.data.resultContentSource === "network" ? "network" : void 0;
		transcript?.noteToolEvent({
			phase,
			toolName,
			toolCallId,
			result: evt.data.result,
			isError,
			...resultContentSource ? { resultContentSource } : {}
		});
		onAgentToolResult?.({
			toolName,
			result: evt.data.result,
			isError
		});
	});
	const flushOnAbort = () => transcript?.flushAssistantSnapshot();
	params.abortSignal?.addEventListener("abort", flushOnAbort, { once: true });
	log$1.info(`dispatching embedded run through CLI backend: runId=${params.runId} provider=${dispatch.provider} model=${params.model ?? ""}`);
	let finalAssistantText;
	try {
		await params.onExecutionStarted?.(params.lifecycleGeneration !== void 0 ? { lifecycleGeneration: params.lifecycleGeneration } : void 0);
		const result = await runCliAgent({
			admittedRunContext,
			sessionManager: params.sessionManager,
			sessionId: params.sessionId,
			sessionKey: params.sessionKey,
			sessionTarget: params.sessionTarget,
			expectedLifecycleRevision,
			expectedWriterRunId,
			chatType: params.chatType,
			agentId: params.agentId,
			storePath,
			trigger: params.trigger,
			sessionFile: dispatch.sessionFile,
			workspaceDir: params.workspaceDir,
			agentDir: params.agentDir,
			config: params.config,
			prompt: params.prompt,
			imagePrompt: params.prompt,
			images: params.images,
			imageOrder: params.imageOrder,
			media: params.media,
			provider: dispatch.provider,
			model: params.model,
			...params.requestedRouteResolution === "resolved" && params.provider && params.model ? { requesterModel: {
				provider: params.provider,
				model: params.model
			} } : {},
			authProfileId: params.authProfileId,
			modelHasVision: params.modelHasVision,
			contextWindow: params.contextWindow,
			thinkLevel: params.thinkLevel,
			fastMode: params.fastMode,
			fastModeStartedAtMs: params.fastModeStartedAtMs,
			fastModeAutoOnSeconds: params.fastModeAutoOnSeconds,
			timeoutMs: params.timeoutMs,
			runTimeoutOverrideMs: params.runTimeoutOverrideMs ?? params.timeoutMs,
			runId: params.runId,
			lifecycleGeneration: params.lifecycleGeneration,
			lane: params.lane,
			extraSystemPrompt: params.extraSystemPrompt,
			messageChannel: params.messageChannel,
			messageProvider: params.messageProvider,
			bootstrapContextMode: params.bootstrapContextMode,
			bootstrapContextRunKind: params.bootstrapContextRunKind,
			abortSignal: params.abortSignal,
			onBlockReply: params.onBlockReply,
			onPartialReply: params.onPartialReply,
			onExecutionPhase: params.onExecutionPhase,
			cliToolAvailability,
			disableCliLiveSession: true,
			cleanupCliLiveSessionOnRunEnd: true,
			requireExplicitMessageTarget: true,
			cleanupBundleMcpOnRunEnd: params.cleanupBundleMcpOnRunEnd
		});
		finalAssistantText = result.payloads?.find((payload) => payload.isReasoning !== true && typeof payload.text === "string")?.text;
		return withoutCliSessionBinding(result);
	} finally {
		params.abortSignal?.removeEventListener("abort", flushOnAbort);
		unsubscribe();
		await transcript?.finalize(finalAssistantText);
	}
}
/** Dispatch runs own no session entry, so a returned CLI binding has no owner to persist it. */
function withoutCliSessionBinding(result) {
	const agentMeta = result.meta.agentMeta;
	if (!agentMeta?.cliSessionBinding && agentMeta?.clearCliSessionBinding !== true) return result;
	return {
		...result,
		meta: {
			...result.meta,
			agentMeta: {
				...agentMeta,
				cliSessionBinding: void 0,
				clearCliSessionBinding: void 0
			}
		}
	};
}
//#endregion
//#region src/agents/embedded-agent-runner/plugin-runtime-refresh-delivery.ts
/** Prior generations retain send facts; each runtime still records only its own attempt. */
function createInheritedDeliveryCallbacks(params, callbacks, delivery) {
	const route = {
		config: params.config,
		messageProvider: params.messageChannel ?? params.messageProvider,
		originatingTo: params.messageTo ?? params.currentMessagingTarget ?? params.currentChannelId,
		originatingThreadId: params.messageThreadId ?? params.currentThreadTs,
		accountId: params.agentAccountId,
		messagingToolSentTargets: delivery.messagingToolSentTargets
	};
	const decision = resolveMessagingToolPayloadDedupe(route);
	const sentTexts = decision.shouldDedupePayloads ? decision.matchingRoute && !decision.useGlobalSentTextEvidenceFallback ? decision.routeSentTexts : delivery.messagingToolSentTexts : [];
	const sentMediaUrls = decision.shouldDedupePayloads ? decision.matchingRoute && !decision.useGlobalSentMediaUrlEvidenceFallback ? decision.routeSentMediaUrls : delivery.messagingToolSentMediaUrls : [];
	const partial = {
		currentSourceMessagingToolHeldPartial: void 0,
		currentSourceMessagingToolSentTextsNormalized: sentTexts.map(normalizeTextForComparison)
	};
	const toolOnlySourceDelivered = params.sourceReplyDeliveryMode === "message_tool_only" && (delivery.didDeliverSourceReplyViaMessageTool || (delivery.messagingToolSourceReplyPayloads?.length ?? 0) > 0);
	const filter = (payload) => filterMessagingToolReplyPayload({
		...route,
		payload,
		sentTexts: delivery.messagingToolSentTexts,
		sentMediaUrls: delivery.messagingToolSentMediaUrls
	}).filter((next) => next === payload || hasReplyPayloadContent(next));
	return {
		onAssistantMessageStart: () => {
			partial.currentSourceMessagingToolHeldPartial = void 0;
			return callbacks.onAssistantMessageStart?.();
		},
		onPartialReply: callbacks.onPartialReply ? (payload) => {
			if (toolOnlySourceDelivered) return false;
			const text = payload.text ?? payload.delta ?? "";
			const held = partial.currentSourceMessagingToolHeldPartial;
			const resolved = resolveCurrentSourceMessagingToolPartial(partial, {
				evtType: payload.delta && !payload.replace ? "text_delta" : "text_end",
				text,
				visibleDelta: payload.delta ?? ""
			});
			if (resolved.hold && !payload.mediaUrls?.length) return false;
			const next = {
				...payload,
				text: resolved.hold ? void 0 : resolved.text,
				...held || resolved.text !== text || resolved.hold ? {
					delta: resolved.hold ? void 0 : resolved.text,
					replace: true
				} : {}
			};
			const filtered = filterMessagingToolMediaDuplicates({
				payloads: [next],
				sentMediaUrls
			})[0];
			return filtered && hasReplyPayloadContent(filtered) ? callbacks.onPartialReply?.(filtered) : false;
		} : void 0,
		onBlockReply: callbacks.onBlockReply ? async (payload, context) => {
			const metadata = getReplyPayloadMetadata(payload);
			if (metadata?.sourceReplyTranscriptMirror) {
				await callbacks.onBlockReply?.(payload, context);
				return;
			}
			if (toolOnlySourceDelivered && !metadata?.deliverDespiteSourceReplySuppression) return;
			for (const next of filter(payload)) await callbacks.onBlockReply?.(copyReplyPayloadMetadata(payload, next), context);
		} : void 0,
		onReasoningStream: callbacks.onReasoningStream ? (payload) => {
			if (!toolOnlySourceDelivered) return callbacks.onReasoningStream?.(payload);
		} : void 0
	};
}
//#endregion
//#region src/agents/embedded-agent-runner/run/attempt-delivery-state.ts
/** Project settled facts, retaining prior generations without collapsing repeated sends. */
function copyAttemptDeliveryState(attempt, previous) {
	const append = (current, before) => previous ? [...before ?? [], ...current].slice(-200) : current;
	return {
		latestMcpAppChannelView: attempt.latestMcpAppChannelView ?? previous?.latestMcpAppChannelView,
		latestMcpConnectAction: attempt.latestMcpConnectAction ?? previous?.latestMcpConnectAction,
		didSendViaMessagingTool: previous?.didSendViaMessagingTool || attempt.didSendViaMessagingTool,
		sourceReplyDelivered: previous?.sourceReplyDelivered || attempt.sourceReplyDelivered,
		sourceReplyDeliveryState: attempt.sourceReplyDeliveryState ?? previous?.sourceReplyDeliveryState,
		didDeliverSourceReplyViaMessageTool: previous?.didDeliverSourceReplyViaMessageTool === true || attempt.didDeliverSourceReplyViaMessageTool === true,
		didSendDeterministicApprovalPrompt: previous?.didSendDeterministicApprovalPrompt || attempt.didSendDeterministicApprovalPrompt,
		messagingToolSentTexts: append(attempt.messagingToolSentTexts, previous?.messagingToolSentTexts),
		messagingToolSentMediaUrls: append(attempt.messagingToolSentMediaUrls, previous?.messagingToolSentMediaUrls),
		messagingToolSentTargets: append(attempt.messagingToolSentTargets, previous?.messagingToolSentTargets),
		messagingToolSourceReplyPayloads: previous ? append(attempt.messagingToolSourceReplyPayloads ?? [], previous.messagingToolSourceReplyPayloads) : attempt.messagingToolSourceReplyPayloads,
		heartbeatToolResponse: attempt.heartbeatToolResponse ?? previous?.heartbeatToolResponse,
		successfulCronAdds: previous?.successfulCronAdds ? previous.successfulCronAdds + (attempt.successfulCronAdds ?? 0) : attempt.successfulCronAdds,
		acceptedSessionSpawns: previous ? [...previous.acceptedSessionSpawns ?? [], ...attempt.acceptedSessionSpawns ?? []] : attempt.acceptedSessionSpawns,
		...previous?.asyncWorkStarted || attempt.asyncWorkStarted || hasAsyncActivity(attempt.toolMetas) ? { asyncWorkStarted: true } : {}
	};
}
//#endregion
//#region src/agents/embedded-agent-runner/run/run-attempt-result.ts
function normalizeEmbeddedRunAttemptResult(attempt) {
	const raw = attempt;
	const runtimeContinuationReplayMetadata = raw.runtimeContinuationStarted === true ? {
		hadPotentialSideEffects: true,
		replaySafe: false
	} : void 0;
	return copyCoreTtsAttemptResultProvenance(attempt, {
		...attempt,
		assistantTexts: raw.assistantTexts ?? [],
		toolMetas: raw.toolMetas ?? [],
		acceptedSessionSpawns: raw.acceptedSessionSpawns ?? [],
		messagesSnapshot: raw.messagesSnapshot ?? [],
		messagingToolSentTexts: raw.messagingToolSentTexts ?? [],
		messagingToolSentMediaUrls: raw.messagingToolSentMediaUrls ?? [],
		messagingToolSentTargets: raw.messagingToolSentTargets ?? [],
		messagingToolSourceReplyPayloads: raw.messagingToolSourceReplyPayloads ?? [],
		didDeliverSourceReplyViaMessageTool: raw.didDeliverSourceReplyViaMessageTool === true,
		itemLifecycle: raw.itemLifecycle ?? {
			startedCount: 0,
			completedCount: 0,
			activeCount: 0
		},
		replayMetadata: runtimeContinuationReplayMetadata ?? raw.replayMetadata ?? {
			hadPotentialSideEffects: true,
			replaySafe: false
		},
		currentAttemptReplayMetadata: runtimeContinuationReplayMetadata ?? raw.currentAttemptReplayMetadata ?? void 0
	});
}
function hasCompletedModelProgressForIdleBreaker(attempt) {
	return attempt.assistantTexts.some((text) => text.trim().length > 0) || attempt.toolMetas.length > 0 || (attempt.clientToolCalls?.length ?? 0) > 0 || hasOutboundDeliveryEvidence(attempt) || attempt.itemLifecycle.completedCount > 0;
}
function buildTraceToolSummary(params) {
	if (!params.toolMetas?.length) return;
	const tools = [];
	const seen = /* @__PURE__ */ new Set();
	for (const entry of params.toolMetas) {
		const toolName = normalizeOptionalString(entry.toolName);
		if (!toolName || seen.has(toolName)) continue;
		seen.add(toolName);
		tools.push(toolName);
	}
	const failedToolCalls = params.toolMetas.filter((entry) => entry.isError === true).length;
	return {
		calls: params.toolMetas.length,
		tools,
		failures: failedToolCalls || Number(Boolean(params.lastToolError)),
		...params.lastToolError ? { unresolvedError: { toolName: params.lastToolError.toolName } } : {}
	};
}
function resolveSuccessfulToolNames(attempt) {
	const successfulToolNames = [...new Set(attempt.toolMetas.filter((entry) => entry.isError === false).map((entry) => entry.toolName.trim()).filter(Boolean))];
	const missingNestedToolNames = [...new Set((attempt.successfulNestedToolNames ?? []).map((name) => name.trim()).filter(Boolean))].filter((name) => !successfulToolNames.includes(name)).toSorted();
	successfulToolNames.push(...missingNestedToolNames);
	return successfulToolNames;
}
//#endregion
//#region src/agents/embedded-agent-runner/plugin-runtime-refresh.ts
/** The embedded runner owns continuation data; tool controls never import its graph. */
function createEmbeddedAgentPluginRuntimeRefresh(callbacks) {
	const refresh = createAgentPluginRuntimeRefresh();
	const pendingToolMedia = createPendingToolMediaCarry();
	const successfulToolNames = /* @__PURE__ */ new Set();
	let delivered;
	let continuation;
	const closeGeneration = () => {
		continuation = void 0;
		refresh.close();
	};
	/** Called only after the attempt has persisted its completed tool results and released its tools. */
	function continueAfterAttempt(input, assertActive, isTurnTainted) {
		if (input.dispatchedAttempt.rawAttempt.terminal.kind !== "ok" || !captureAgentPluginRuntimeRefresh().isPending()) return;
		assertActive();
		const attempt = normalizeEmbeddedRunAttemptResult(input.dispatchedAttempt.rawAttempt);
		for (const name of resolveSuccessfulToolNames(attempt)) successfulToolNames.add(name);
		delivered = copyAttemptDeliveryState(attempt);
		pendingToolMedia.capture(attempt);
		const { runInput, sessionPromptState: session, usageAccumulator: usage } = input;
		const params = runInput.runParams;
		const messages = attempt.pluginRuntimeRefreshMessages;
		continuation = {
			...params,
			sessionId: session.sessionId,
			sessionFile: session.sessionFile,
			sessionTarget: {
				...params.sessionTarget,
				...session.sessionTarget,
				...session.sessionWriterFence
			},
			initialTurnTainted: isTurnTainted(),
			preparedRunAdmission: void 0,
			pluginGeneration: void 0,
			pluginRuntimeRefreshContinuation: true,
			pluginRuntimeRefreshMessages: messages ? [...params.pluginRuntimeRefreshMessages ?? [], ...messages] : params.pluginRuntimeRefreshMessages ?? [],
			contextEngineLogicalTurnLease: void 0,
			modelHasVision: void 0,
			modelThinkingCapability: void 0,
			modelFallbackAvailability: void 0,
			suppressNextUserMessagePersistence: true,
			prompt: "The plugin runtime has been refreshed. Continue the current task from the transcript using the updated tools. Verify the requested change; do not repeat completed actions or the original user request."
		};
		return { meta: {
			durationMs: Date.now() - runInput.startedAtMs,
			agentMeta: {
				sessionId: session.sessionId,
				provider: input.provider,
				model: input.modelId,
				usage: toNormalizedUsage(usage),
				assistantTurns: usage.assistantTurns,
				...usage.bridgeCalls ? { bridgeCalls: usage.bridgeCalls } : {}
			}
		} };
	}
	return {
		run: (run) => {
			closeGeneration();
			return refresh.run(run);
		},
		continueAfterAttempt,
		mergeToolMedia: pendingToolMedia.merge,
		applyDeliveryState: (attempt) => delivered ? Object.assign(attempt, copyAttemptDeliveryState(normalizeEmbeddedRunAttemptResult(attempt), delivered)) : attempt,
		withDeliveryCallbacks: (params) => delivered ? {
			...params,
			...createInheritedDeliveryCallbacks(params, callbacks, delivered)
		} : params,
		mergeTerminalReceipt: (result) => {
			const receipt = result.meta.agentMeta?.terminalReceipt;
			if (receipt && successfulToolNames.size > 0) receipt.successfulToolNames = [.../* @__PURE__ */ new Set([...successfulToolNames, ...receipt.successfulToolNames])];
		},
		takeContinuation: () => {
			const next = continuation;
			closeGeneration();
			return next;
		},
		close: () => {
			closeGeneration();
			delivered = void 0;
			pendingToolMedia.clear();
			successfulToolNames.clear();
		}
	};
}
//#endregion
//#region src/agents/embedded-agent-runner/post-compaction-loop-guard.ts
/**
* Guards against repeated tool-loop compactions that never make progress.
*/
/**
* Detects identical tool-call loops immediately after automatic compaction.
*
* The guard only observes a small post-compaction window; if compaction failed to break an
* identical args/result loop, the runner aborts before spending unbounded tokens.
*/
const log = createSubsystemLogger("agents/post-compaction-guard");
const DEFAULT_WINDOW_SIZE = 3;
const BASELINE_WINDOW_SIZE = 16;
const observationSignature = (call) => `${call.toolName}\0${call.argsHash}`;
/** Creates a stateful post-compaction loop detector for one embedded run. */
function createPostCompactionLoopGuard(options) {
	const state = {
		enabled: options?.enabled ?? true,
		windowSize: DEFAULT_WINDOW_SIZE,
		remainingAttempts: 0,
		history: [],
		recentCalls: [],
		baselineSignatures: void 0,
		windowObserved: 0,
		windowRepeats: 0,
		repeatTools: /* @__PURE__ */ new Set()
	};
	const armPostCompaction = () => {
		state.baselineSignatures = state.enabled && state.recentCalls.length > 0 ? new Set(state.recentCalls.map(observationSignature)) : void 0;
		state.remainingAttempts = state.windowSize;
		state.history = [];
		state.windowObserved = 0;
		state.windowRepeats = 0;
		state.repeatTools = /* @__PURE__ */ new Set();
		if (state.enabled) log.info(`post-compaction guard armed for ${state.windowSize} attempts`);
	};
	const logWindowSummary = () => {
		const tools = [...state.repeatTools].toSorted().join(",");
		log.info(`post-compaction window closed: toolCalls=${state.windowObserved} preCompactionRepeats=${state.windowRepeats}${tools ? ` tools=${tools}` : ""}`);
	};
	const observe = (call) => {
		if (!state.enabled) return {
			shouldAbort: false,
			armed: false,
			remainingAttempts: 0
		};
		state.recentCalls.push(call);
		if (state.recentCalls.length > BASELINE_WINDOW_SIZE) state.recentCalls.shift();
		if (state.remainingAttempts <= 0) return {
			shouldAbort: false,
			armed: false,
			remainingAttempts: 0
		};
		state.remainingAttempts -= 1;
		state.windowObserved += 1;
		if (state.baselineSignatures?.has(observationSignature(call))) {
			state.windowRepeats += 1;
			state.repeatTools.add(call.toolName);
		}
		state.history.push(call);
		const armedAfter = state.remainingAttempts > 0;
		const matches = state.history.filter((entry) => entry.toolName === call.toolName && entry.argsHash === call.argsHash && entry.resultHash === call.resultHash);
		if (matches.length >= state.windowSize) {
			log.error(`post-compaction loop persisted: tool=${call.toolName} repeated ${matches.length} times with identical args+result post-compaction`);
			return {
				shouldAbort: true,
				armed: armedAfter,
				remainingAttempts: state.remainingAttempts,
				detector: "compaction_loop_persisted",
				count: matches.length,
				toolName: call.toolName,
				message: `CRITICAL: tool ${call.toolName} repeated ${matches.length} times with identical arguments and identical results within ${state.windowSize} attempts after auto-compaction. The compaction did not break the loop. Aborting to prevent runaway resource use.`
			};
		}
		if (!armedAfter) {
			logWindowSummary();
			state.baselineSignatures = void 0;
			state.windowObserved = 0;
			state.windowRepeats = 0;
			state.repeatTools = /* @__PURE__ */ new Set();
		}
		return {
			shouldAbort: false,
			armed: armedAfter,
			remainingAttempts: state.remainingAttempts
		};
	};
	const snapshot = () => ({
		armed: state.remainingAttempts > 0,
		remainingAttempts: state.remainingAttempts
	});
	return {
		armPostCompaction,
		observe,
		snapshot
	};
}
/** Error raised when the post-compaction loop guard aborts a run. */
var PostCompactionLoopPersistedError = class PostCompactionLoopPersistedError extends Error {
	constructor(message, details) {
		super(message);
		this.name = "PostCompactionLoopPersistedError";
		this.detector = details.detector;
		this.count = details.count;
		this.toolName = details.toolName;
	}
	static fromVerdict(verdict) {
		return new PostCompactionLoopPersistedError(verdict.message, {
			detector: verdict.detector,
			count: verdict.count,
			toolName: verdict.toolName
		});
	}
};
//#endregion
//#region src/agents/embedded-agent-runner/run/failover-observation.ts
/**
* Logs redacted failover decisions for embedded-agent attempts.
*/
/**
* Captures sanitized failover context and returns a decision logger. The closure
* keeps prompt/assistant failover branches consistent while still allowing the
* final decision and HTTP status to be supplied at the action point.
*/
function createFailoverDecisionLogger(base) {
	const normalizedBase = {
		...base,
		failoverReason: base.failoverReason ?? (base.timedOut ? "timeout" : null),
		profileFailureReason: base.profileFailureReason ?? (base.timedOut ? "timeout" : null)
	};
	const safeProfileId = normalizedBase.profileId ? redactIdentifier(normalizedBase.profileId, { len: 12 }) : void 0;
	const safeRunId = sanitizeForConsole(normalizedBase.runId) ?? "-";
	const safeProvider = sanitizeForConsole(normalizedBase.provider) ?? "-";
	const safeModel = sanitizeForConsole(normalizedBase.model) ?? "-";
	const safeSourceProvider = sanitizeForConsole(normalizedBase.sourceProvider) ?? safeProvider;
	const safeSourceModel = sanitizeForConsole(normalizedBase.sourceModel) ?? safeModel;
	const profileText = safeProfileId ?? "-";
	const reasonText = normalizedBase.failoverReason ?? "none";
	const sourceChanged = safeSourceProvider !== safeProvider || safeSourceModel !== safeModel;
	return (decision, extra) => {
		const level = decision === "continue_normal" ? "debug" : "warn";
		if (level === "debug" && !log$3.isEnabled(level)) return;
		const observedError = buildApiErrorObservationFields(normalizedBase.rawError);
		const safeRawErrorPreview = sanitizeForConsole(observedError.rawErrorPreview);
		const rawErrorConsoleSuffix = safeRawErrorPreview && !shouldSuppressRawErrorConsoleSuffix(observedError.providerRuntimeFailureKind) ? ` rawError=${safeRawErrorPreview}` : "";
		const retryCount = extra?.retryCount ?? normalizedBase.retryCount;
		const profileRotationCount = extra?.profileRotationCount ?? normalizedBase.profileRotationCount;
		log$3[level]("embedded run failover decision", {
			event: "embedded_run_failover_decision",
			tags: [
				"error_handling",
				"failover",
				normalizedBase.stage,
				decision
			],
			runId: normalizedBase.runId,
			stage: normalizedBase.stage,
			decision,
			failoverReason: normalizedBase.failoverReason,
			profileFailureReason: normalizedBase.profileFailureReason,
			provider: normalizedBase.provider,
			model: normalizedBase.model,
			sourceProvider: normalizedBase.sourceProvider ?? normalizedBase.provider,
			sourceModel: normalizedBase.sourceModel ?? normalizedBase.model,
			profileId: safeProfileId,
			fallbackConfigured: normalizedBase.fallbackConfigured,
			timedOut: normalizedBase.timedOut,
			aborted: normalizedBase.aborted,
			status: extra?.status,
			retryCount,
			profileRotationCount,
			attemptCount: normalizedBase.attemptCount,
			...observedError,
			consoleMessage: `embedded run failover decision: runId=${safeRunId} stage=${normalizedBase.stage} decision=${decision} reason=${reasonText} attempt=${normalizedBase.attemptCount ?? "-"} retry=${retryCount ?? "-"} rotations=${profileRotationCount ?? "-"} from=${safeSourceProvider}/${safeSourceModel}${sourceChanged ? ` to=${safeProvider}/${safeModel}` : ""} profile=${profileText}${rawErrorConsoleSuffix}`
		});
	};
}
//#endregion
//#region src/agents/embedded-agent-runner/run/failover-policy.ts
function shouldEscalateRetryLimit(reason) {
	return Boolean(reason && reason !== "timeout" && reason !== "format" && reason !== "session_expired");
}
function isTerminalFormatFailure(params) {
	return params.failoverFailure && params.failoverReason === "format" && params.allowFormatRetry !== true;
}
function shouldRotatePrompt(params) {
	return params.failoverFailure && params.failoverReason !== "timeout" && params.failoverReason !== "tls_certificate" && !isTerminalFormatFailure(params);
}
function isAssistantTimeoutFailure(params) {
	return params.terminal.kind === "timeout" && params.terminal.source !== "observation" && (params.terminal.source === "idle" || params.terminal.phase === "prompt");
}
function isConcreteNonTimeoutAssistantFailure(params) {
	return params.failoverFailure && Boolean(params.failoverReason) && params.failoverReason !== "timeout";
}
function shouldRotateAssistant(params) {
	if (params.terminal.kind === "timeout" && params.terminal.source === "run_budget") return false;
	const timeoutFailure = isAssistantTimeoutFailure(params);
	if (params.harnessOwnsTransport && (timeoutFailure || params.failoverReason === "timeout") && !isConcreteNonTimeoutAssistantFailure(params)) return false;
	return !(params.terminal.kind === "aborted" && params.terminal.source !== "yield_cleanup" || params.terminal.kind === "timeout" && params.terminal.source !== "observation" && params.terminal.aborted === true) && params.failoverFailure || timeoutFailure;
}
function assistantFallbackReason(params) {
	const failoverReason = params.failoverReason;
	if (params.failoverFailure && failoverReason && failoverReason !== "timeout") return failoverReason;
	return isAssistantTimeoutFailure(params) ? "timeout" : failoverReason ?? "unknown";
}
/** Preserves an existing retry reason unless the current attempt produced a stronger signal. */
function mergeRetryFailoverReason(params) {
	return params.failoverReason ?? params.previous ?? (params.timedOut ? "timeout" : null);
}
/**
* Chooses whether a run should rotate auth profile, switch model fallback,
* surface the error, continue normally, or return an error payload. Prompt,
* assistant, and retry-limit stages intentionally use different action sets.
*/
function resolveRunFailoverDecision(params) {
	if (params.stage === "retry_limit") {
		if (params.fallbackConfigured && shouldEscalateRetryLimit(params.failoverReason)) return {
			action: "fallback_model",
			reason: params.failoverReason ?? "unknown"
		};
		return { action: "return_error_payload" };
	}
	if (params.stage === "prompt") {
		if (isCliTerminalStopCode(params.failoverCode) || params.externalAbort || params.timedOutByRunBudget) return {
			action: "surface_error",
			reason: params.failoverReason
		};
		if (params.harnessOwnsTransport && params.failoverReason === "timeout") {
			if (params.promptTimeoutFallbackSafe === true && params.fallbackConfigured) return {
				action: "fallback_model",
				reason: "timeout"
			};
			return {
				action: "surface_error",
				reason: params.failoverReason
			};
		}
		if (!params.profileRotated && shouldRotatePrompt(params)) return {
			action: "rotate_profile",
			reason: params.failoverReason
		};
		if (params.fallbackConfigured && params.failoverFailure && !isTerminalFormatFailure(params)) return {
			action: "fallback_model",
			reason: params.failoverReason ?? "unknown"
		};
		return {
			action: "surface_error",
			reason: params.failoverReason
		};
	}
	if (params.signalOwnedInterruption || (params.terminal.kind === "aborted" || params.terminal.kind === "timeout") && params.terminal.source === "external" || isTerminalFormatFailure(params)) return {
		action: "surface_error",
		reason: params.failoverReason
	};
	if (params.failoverFailure && params.failoverReason === "tls_certificate") return params.fallbackConfigured ? {
		action: "fallback_model",
		reason: "tls_certificate"
	} : {
		action: "surface_error",
		reason: "tls_certificate"
	};
	const assistantShouldRotate = shouldRotateAssistant(params);
	if (!params.profileRotated && assistantShouldRotate) return {
		action: "rotate_profile",
		reason: params.failoverReason
	};
	if (assistantShouldRotate && params.fallbackConfigured) return {
		action: "fallback_model",
		reason: assistantFallbackReason(params)
	};
	if (!assistantShouldRotate) return { action: "continue_normal" };
	return {
		action: "surface_error",
		reason: params.failoverReason
	};
}
//#endregion
//#region src/agents/embedded-agent-runner/run/assistant-failure.ts
const MAX_EMPTY_ERROR_RETRIES = 3;
async function handleEmbeddedAssistantFailure(input) {
	const failedAssistant = input.attemptAssistant?.stopReason === "error" ? input.attemptAssistant : void 0;
	if (classifyGatewayStorageFailure(failedAssistant)) return buildOutcome(input, {
		action: "proceed",
		assistantProfileFailureReason: null
	});
	const { aborted, externalAbort: projectedExternalAbort, idleTimedOut, promptError, timedOut } = projectAgentRunAttemptTerminal(input.attempt.terminal);
	const terminalInterrupted = isEmbeddedRunTerminalInterrupted(input.terminalState.outcome);
	const { signalOwnedInterruption } = input.terminalState;
	const fallbackThinking = pickFallbackThinkingLevel({
		message: failedAssistant?.errorMessage,
		attempted: input.attemptedThinking
	});
	const authFailure = isAuthAssistantError(failedAssistant);
	const rateLimitFailure = isRateLimitAssistantError(failedAssistant);
	const billingFailure = isBillingAssistantError(failedAssistant);
	const failoverFailure = isFailoverAssistantError(failedAssistant);
	const assistantFailoverReason = classifyAssistantFailoverReason(failedAssistant, { providerOwner: input.providerOwner });
	const assistantProviderStarted = Boolean(input.currentAttemptAssistant?.provider) || input.terminalState.outcome.providerStarted === true;
	const assistantProfileFailoverReason = assistantFailoverReason ?? (assistantProviderStarted && (timedOut || idleTimedOut) ? "timeout" : null);
	const assistantProfileFailureReason = input.failover.resolveAuthProfileFailureReason(assistantProfileFailoverReason, {
		providerStarted: assistantProviderStarted,
		transientRateLimit: assistantProfileFailoverReason === "rate_limit" && classifyRateLimitWindow(failedAssistant?.errorMessage).kind === "short"
	});
	const terminalAssistantError = isTerminalAssistantError(input.attemptAssistant);
	if (terminalAssistantError || !isCurrentAttemptReplaySafe(input.attempt)) return buildOutcome(input, {
		action: "proceed",
		assistantProfileFailureReason: terminalAssistantError ? null : assistantProfileFailureReason
	});
	if (fallbackThinking && !terminalInterrupted) {
		log$3.warn(`unsupported thinking level for ${input.provider}/${input.modelId}; retrying with ${fallbackThinking}`);
		return buildOutcome(input, {
			action: "retry",
			thinkLevel: fallbackThinking,
			assistantProfileFailureReason
		});
	}
	const cloudCodeAssistFormatError = input.attempt.cloudCodeAssistFormatError;
	const imageDimensionError = parseImageDimensionError(failedAssistant?.errorMessage ?? "");
	const unclassifiedError = assistantFailoverReason === null || assistantFailoverReason === "no_error_details" || assistantFailoverReason === "unclassified" || assistantFailoverReason === "unknown";
	const replaySafeSilentErrorFailure = !authFailure && !rateLimitFailure && !billingFailure && !cloudCodeAssistFormatError && !imageDimensionError && !terminalInterrupted && !promptError && shouldRetrySilentErrorAssistantTurn({
		attempt: input.attempt,
		assistant: failedAssistant
	});
	if (replaySafeSilentErrorFailure && unclassifiedError && input.emptyErrorRetries < MAX_EMPTY_ERROR_RETRIES) {
		const emptyErrorRetries = input.emptyErrorRetries + 1;
		log$3.warn(`[empty-error-retry] stopReason=error non-visible-output; resubmitting attempt=${emptyErrorRetries}/${MAX_EMPTY_ERROR_RETRIES} provider=${failedAssistant?.provider ?? input.provider} model=${failedAssistant?.model ?? input.model} sessionKey=${input.runParams.sessionKey ?? input.runParams.sessionId}`);
		return buildOutcome(input, {
			action: "retry",
			emptyErrorRetries,
			assistantProfileFailureReason
		});
	}
	const exhaustedUnclassifiedSilentError = input.fallbackConfigured && assistantFailoverReason === null && replaySafeSilentErrorFailure && input.emptyErrorRetries >= MAX_EMPTY_ERROR_RETRIES;
	const effectiveFailoverReason = exhaustedUnclassifiedSilentError ? "unknown" : assistantFailoverReason;
	const logFailoverDecision = createFailoverDecisionLogger({
		stage: "assistant",
		runId: input.runParams.runId,
		rawError: failedAssistant?.errorMessage?.trim(),
		failoverReason: effectiveFailoverReason,
		profileFailureReason: assistantProfileFailureReason,
		provider: input.activeErrorContext.provider,
		model: input.activeErrorContext.model,
		sourceProvider: failedAssistant?.provider ?? input.provider,
		sourceModel: failedAssistant?.model ?? input.modelId,
		profileId: input.authProfileId,
		fallbackConfigured: input.fallbackConfigured,
		timedOut,
		aborted,
		retryCount: input.failover.transientRetryCount,
		profileRotationCount: input.overloadProfileRotations,
		attemptCount: input.traceAttempts.length + 1
	});
	if (!signalOwnedInterruption && authFailure && await input.maybeRefreshRuntimeAuthForAuthError(failedAssistant?.errorMessage ?? "", input.runtimeAuthRetry)) return buildOutcome(input, {
		action: "retry",
		authRetryPending: true,
		assistantProfileFailureReason
	});
	if (imageDimensionError && input.authProfileId) {
		const details = [
			imageDimensionError.messageIndex !== void 0 ? `message=${imageDimensionError.messageIndex}` : null,
			imageDimensionError.contentIndex !== void 0 ? `content=${imageDimensionError.contentIndex}` : null,
			imageDimensionError.maxDimensionPx !== void 0 ? `limit=${imageDimensionError.maxDimensionPx}px` : null
		].filter(Boolean).join(" ");
		log$3.warn(`Profile ${input.authProfileId} rejected image payload${details ? ` (${details})` : ""}.`);
	}
	const resolveDecision = (profileRotated) => resolveRunFailoverDecision({
		stage: "assistant",
		allowFormatRetry: cloudCodeAssistFormatError,
		terminal: input.attempt.terminal,
		signalOwnedInterruption,
		fallbackConfigured: input.fallbackConfigured,
		failoverFailure,
		failoverReason: assistantFailoverReason,
		harnessOwnsTransport: input.pluginHarnessOwnsTransport,
		profileRotated
	});
	const initialDecision = exhaustedUnclassifiedSilentError ? {
		action: "fallback_model",
		reason: "unknown"
	} : resolveDecision(false);
	const authMode = input.authProfileId ? input.authProfileStore.profiles?.[input.authProfileId]?.type : void 0;
	const terminalOutcome = input.terminalState.outcome;
	const assistantStatus = failedAssistant ? buildAssistantFailoverSignal(failedAssistant).status : void 0;
	const externalAbort = projectedExternalAbort || signalOwnedInterruption;
	let overloadProfileRotations = input.overloadProfileRotations;
	let decision = initialDecision;
	const logDecision = (action, extra) => logFailoverDecision(action, {
		...extra,
		retryCount: input.failover.transientRetryCount,
		profileRotationCount: overloadProfileRotations
	});
	const throwFailure = (error) => {
		input.traceAttempts.push({
			provider: input.activeErrorContext.provider,
			model: input.activeErrorContext.model,
			result: effectiveFailoverReason === "timeout" ? "timeout" : initialDecision.action === "fallback_model" ? "fallback_model" : "error",
			...effectiveFailoverReason ? { reason: effectiveFailoverReason } : {},
			stage: "assistant",
			...typeof error.status === "number" ? { status: error.status } : {}
		});
		if (error.suspend) input.suspendForFailure({
			cfg: input.runParams.config,
			agentDir: input.agentDir,
			sessionId: input.suspensionSessionId,
			reason: resolveSessionSuspensionReason(error.reason),
			failedProvider: error.provider ?? input.provider,
			failedModel: error.model ?? input.modelId
		});
		throw error;
	};
	if (decision.action === "rotate_profile") {
		const failedProfileId = input.authProfileId;
		const markFailedProfile = async () => {
			if (!assistantProfileFailureReason) return;
			try {
				await input.failover.maybeMarkAuthProfileFailure({
					profileId: failedProfileId,
					reason: assistantProfileFailureReason,
					modelId: input.modelId
				});
			} catch (err) {
				log$3.warn(`profile failure mark failed: ${String(err)}`);
			}
		};
		if (assistantFailoverReason === "overloaded") {
			overloadProfileRotations += 1;
			if (overloadProfileRotations > input.failover.overloadProfileRotationLimit && input.fallbackConfigured) {
				const status = assistantStatus ?? resolveFailoverStatus("overloaded");
				log$3.warn(`overload profile rotation cap reached for ${sanitizeForLog(input.provider)}/${sanitizeForLog(input.modelId)} after ${overloadProfileRotations} rotations; escalating to model fallback`);
				await markFailedProfile();
				logDecision("fallback_model", { status });
				throwFailure(new FailoverError("The AI service is temporarily overloaded. Please try again in a moment.", {
					reason: "overloaded",
					provider: input.activeErrorContext.provider,
					model: input.activeErrorContext.model,
					profileId: input.authProfileId,
					status,
					rawError: failedAssistant?.errorMessage?.trim()
				}));
			}
		}
		let rotated;
		if (assistantFailoverReason === "rate_limit") rotated = await input.failover.advanceRateLimitAuthProfile({
			failoverProvider: input.activeErrorContext.provider,
			failoverModel: input.activeErrorContext.model,
			logFallbackDecision: logFailoverDecision
		});
		else rotated = await input.failover.advanceAuthProfile();
		const markFailedProfilePromise = markFailedProfile();
		if (timedOut && !input.isProbeSession && failedProfileId) {
			const timeoutLabel = idleTimedOut ? "idle timeout (model silent)" : "timed out";
			log$3.warn(rotated ? `Profile ${failedProfileId} ${timeoutLabel}. Trying next account...` : `Profile ${failedProfileId} ${timeoutLabel}. No further authorized account for this provider; create a backup auth profile and add its id to auth.order to enable failover.`);
		}
		if (cloudCodeAssistFormatError && failedProfileId) log$3.warn(`Profile ${failedProfileId} hit Cloud Code Assist format error. Tool calls will be sanitized on retry.`);
		if (rotated) {
			logDecision("rotate_profile");
			input.traceAttempts.push({
				provider: input.activeErrorContext.provider,
				model: input.activeErrorContext.model,
				result: effectiveFailoverReason === "timeout" ? "timeout" : "rotate_profile",
				...effectiveFailoverReason ? { reason: effectiveFailoverReason } : {},
				stage: "assistant"
			});
			return buildOutcome(input, {
				action: "retry",
				thinkLevel: input.getThinkLevel(),
				overloadProfileRotations,
				lastRetryFailoverReason: mergeRetryFailoverReason({
					previous: input.previousRetryFailoverReason,
					failoverReason: assistantFailoverReason,
					timedOut
				}),
				assistantProfileFailureReason
			});
		}
		await markFailedProfilePromise;
		decision = resolveDecision(true);
	}
	if (decision.action === "surface_error") logDecision("surface_error");
	if (decision.action === "fallback_model" || decision.action === "surface_error" && !externalAbort && !timedOut && failoverFailure) {
		const message = (failedAssistant ? formatUserFacingAssistantErrorText(failedAssistant, {
			cfg: input.runParams.config,
			sessionKey: input.runParams.sessionKey ?? input.runParams.sessionId,
			agentId: input.runParams.agentId,
			provider: input.activeErrorContext.provider,
			providerOwner: input.providerOwner,
			model: input.activeErrorContext.model,
			authMode
		}) : void 0) || failedAssistant?.errorMessage?.trim() || (timedOut ? "LLM request timed out." : rateLimitFailure ? "LLM request rate limited." : billingFailure ? formatBillingErrorMessage(input.activeErrorContext.provider, input.activeErrorContext.model, authMode) : authFailure ? "LLM request unauthorized." : "LLM request failed.");
		const reason = decision.reason ?? (billingFailure ? "billing" : authFailure ? "auth" : rateLimitFailure ? "rate_limit" : "unknown");
		const status = assistantStatus ?? resolveFailoverStatus(reason) ?? (isTimeoutErrorMessage(message) ? 408 : void 0);
		if (decision.action === "fallback_model") logDecision("fallback_model", { status });
		throwFailure(new FailoverError(message, {
			reason,
			provider: input.activeErrorContext.provider,
			model: input.activeErrorContext.model,
			profileId: input.authProfileId,
			authMode,
			status,
			rawError: failedAssistant?.errorMessage?.trim(),
			timeout: terminalOutcome.status === "timeout" ? {
				timeoutPhase: terminalOutcome.timeoutPhase,
				providerStarted: terminalOutcome.providerStarted
			} : void 0,
			suspend: Boolean(input.runParams.sessionKey ?? input.runParams.sessionId) && (reason === "rate_limit" || reason === "billing")
		}));
	}
	logDecision("continue_normal");
	return buildOutcome(input, {
		action: "proceed",
		overloadProfileRotations,
		assistantProfileFailureReason
	});
}
function buildOutcome(input, override) {
	return {
		action: override.action,
		thinkLevel: override.thinkLevel ?? input.thinkLevel,
		authRetryPending: override.authRetryPending ?? false,
		emptyErrorRetries: override.emptyErrorRetries ?? input.emptyErrorRetries,
		overloadProfileRotations: override.overloadProfileRotations ?? input.overloadProfileRotations,
		lastRetryFailoverReason: override.lastRetryFailoverReason ?? input.previousRetryFailoverReason,
		assistantProfileFailureReason: override.assistantProfileFailureReason
	};
}
//#endregion
//#region src/agents/embedded-agent-runner/run/attempt-session-identity.ts
function applyEmbeddedAttemptSessionIdentity(params) {
	const { sessionPromptState, sessionFileUsed, sessionIdUsed } = params;
	const previousSessionId = sessionPromptState.sessionId;
	let adoptedSessionId = sessionIdUsed;
	const sessionFileChanged = Boolean(sessionFileUsed && sessionFileUsed !== sessionPromptState.sessionFile);
	let nextSessionTarget = sessionPromptState.sessionTarget;
	if (sessionFileUsed && sessionFileChanged) {
		const marker = parseSqliteSessionFileMarker(sessionFileUsed);
		if (marker) {
			const retainedSessionKey = sessionPromptState.sessionTarget?.sessionKey;
			const retainedEntry = retainedSessionKey ? loadSessionEntryReadOnly({
				agentId: marker.agentId,
				sessionKey: retainedSessionKey,
				storePath: marker.storePath
			}) : void 0;
			const markerMatches = listSessionEntriesReadOnly({
				agentId: marker.agentId,
				storePath: marker.storePath
			}).filter(({ entry }) => entry.sessionId === marker.sessionId);
			const preferredMarkerSessionKey = resolvePreferredSessionKeyForSessionIdMatches(markerMatches.map(({ sessionKey, entry }) => [sessionKey, entry]), marker.sessionId);
			const markerMappedToRetainedKey = markerMatches.some(({ sessionKey }) => sessionKey === retainedSessionKey);
			const successorSessionKey = retainedEntry?.sessionId === marker.sessionId || retainedEntry?.sessionId === previousSessionId && (markerMatches.length === 0 || markerMappedToRetainedKey) ? retainedSessionKey : preferredMarkerSessionKey ?? (markerMatches.length === 0 && !retainedEntry ? retainedSessionKey : void 0);
			if (marker.sessionId !== sessionIdUsed && sessionIdUsed !== previousSessionId || !successorSessionKey || marker.agentId !== sessionPromptState.sessionTarget?.agentId) throw new Error("Legacy context-engine successor identity is inconsistent");
			adoptedSessionId = marker.sessionId;
			nextSessionTarget = {
				...marker,
				sessionKey: successorSessionKey
			};
		} else if (sessionFileUsed.startsWith("agent:") && sessionPromptState.sessionTarget && resolveAgentIdFromSessionKey(sessionFileUsed) === sessionPromptState.sessionTarget.agentId) {
			const keyedEntry = loadSessionEntryReadOnly({
				agentId: sessionPromptState.sessionTarget.agentId,
				sessionKey: sessionFileUsed,
				storePath: sessionPromptState.sessionTarget.storePath
			});
			if (!keyedEntry?.sessionId || keyedEntry.sessionId !== sessionIdUsed) throw new Error("Legacy context-engine successor identity is inconsistent");
			nextSessionTarget = {
				...sessionPromptState.sessionTarget,
				sessionId: sessionIdUsed,
				sessionKey: sessionFileUsed
			};
		} else throw new Error("Legacy context-engine successor files are unsupported; return a structured sessionTarget");
	} else if (sessionIdUsed && sessionIdUsed !== previousSessionId) nextSessionTarget = sessionPromptState.sessionTarget ? {
		...sessionPromptState.sessionTarget,
		sessionId: sessionIdUsed
	} : void 0;
	if (sessionFileChanged && nextSessionTarget && sessionPromptState.sessionTarget && (!nextSessionTarget.agentId || !nextSessionTarget.sessionKey || !nextSessionTarget.storePath || !sessionPromptState.sessionTarget.agentId || !sessionPromptState.sessionTarget.sessionKey || !sessionPromptState.sessionTarget.storePath || nextSessionTarget.agentId !== sessionPromptState.sessionTarget.agentId || nextSessionTarget.sessionKey !== sessionPromptState.sessionTarget.sessionKey || path.resolve(nextSessionTarget.storePath) !== path.resolve(sessionPromptState.sessionTarget.storePath))) throw new Error("Legacy context-engine successor target changed the active session binding");
	sessionPromptState.adoptSessionId(adoptedSessionId);
	if (sessionFileUsed && sessionFileChanged) sessionPromptState.sessionFile = sessionFileUsed;
	else if (adoptedSessionId !== previousSessionId && nextSessionTarget) {
		const marker = parseSqliteSessionFileMarker(sessionPromptState.sessionFile);
		if (marker) sessionPromptState.sessionFile = formatSqliteSessionFileMarker({
			agentId: nextSessionTarget.agentId ?? marker.agentId,
			sessionId: nextSessionTarget.sessionId ?? marker.sessionId,
			storePath: nextSessionTarget.storePath ?? marker.storePath
		});
	}
	sessionPromptState.sessionTarget = nextSessionTarget;
}
/** Creates a fresh breaker counter for one embedded run loop. */
function createIdleTimeoutBreakerState() {
	return { consecutiveIdleTimeoutsBeforeOutput: 0 };
}
/**
* Update the breaker counter from the latest attempt's outcome and report
* whether the cap is now tripped. Designed to be called from the outer run
* loop right after an embedded attempt completes.
*
* Pure function modulo the mutable `state.consecutiveIdleTimeoutsBeforeOutput`
* field, so the caller decides where the state lives (typically a `let` in
* the outer loop).
*
* Decision table:
*   idleTimedOut  completedModelProgress   action
*   ------------  ----------------------   ------
*   true          false                    count += 1   (wedged provider candidate)
*   true          true                     count = 0    (model is alive but slow tail)
*   false         true                     count = 0    (clean progress, all good)
*   false         false                    count unchanged (e.g. non-timeout error;
*                                                          don't poison or reset)
*
* The "false / false" branch matters: a non-timeout error attempt with no
* completed progress should not reset the breaker (it isn't a sign the
* provider is healthy), but it also shouldn't increment it (the issue at hand
* is idle timeouts, not arbitrary errors).
*
* `outputTokens` is intentionally not part of the reset condition. Some
* transports can accumulate billed output tokens from partial tool-call
* argument deltas before the model stalls; those tokens are cost, not completed
* progress, so they must not keep the breaker disarmed.
*/
function stepIdleTimeoutBreaker(state, input, options) {
	const cap = options?.cap ?? 5;
	if (input.idleTimedOut && !input.completedModelProgress) state.consecutiveIdleTimeoutsBeforeOutput += 1;
	else if (input.completedModelProgress) state.consecutiveIdleTimeoutsBeforeOutput = 0;
	return {
		consecutive: state.consecutiveIdleTimeoutsBeforeOutput,
		tripped: cap > 0 && state.consecutiveIdleTimeoutsBeforeOutput >= cap
	};
}
//#endregion
//#region src/agents/embedded-agent-runner/run/retry-budget.ts
function createRunRetryBudget(maxAttempts) {
	return {
		attemptsDispatched: 0,
		attemptsCounted: 0,
		maxAttempts
	};
}
function isRunRetryBudgetExhausted(budget) {
	return budget.attemptsCounted >= budget.maxAttempts;
}
function beginRunAttempt(budget) {
	budget.attemptsDispatched += 1;
	budget.attemptsCounted += 1;
}
function resolveRunRetryKind(params) {
	return params.retryingFromTranscript && params.preflightRecovery.route === "truncate_tool_results_only" && params.preflightRecovery.truncatedCount === 0 && params.toolMetas.some((tool) => tool.isError !== true) ? "progress_continuation" : "recovery";
}
function recordRunRetry(budget, kind) {
	if (kind === "progress_continuation") budget.attemptsCounted = Math.max(0, budget.attemptsCounted - 1);
}
//#endregion
//#region src/agents/embedded-agent-runner/run/retry-limit.ts
function handleRetryLimitExhaustion(params) {
	if (params.decision.action === "fallback_model") throw new FailoverError(params.message, {
		reason: params.decision.reason,
		provider: params.provider,
		model: params.model,
		profileId: params.profileId,
		status: resolveFailoverStatus(params.decision.reason)
	});
	return {
		payloads: [{
			text: "Request failed after repeated internal retries. Please try again, or use /new to start a fresh session.",
			isError: true
		}],
		meta: {
			durationMs: params.durationMs,
			agentMeta: params.agentMeta,
			...params.replayInvalid ? { replayInvalid: true } : {},
			...params.livenessState ? { livenessState: params.livenessState } : {},
			error: {
				kind: "retry_limit",
				message: params.message
			}
		}
	};
}
//#endregion
//#region src/agents/embedded-agent-runner/run/attempt-normalization.ts
async function normalizeEmbeddedRunAttempt(input) {
	const { runInput, preparedRuntime, dispatchedAttempt, sessionPromptState, provider, modelId } = input;
	const params = runInput.runParams;
	const runtime = preparedRuntime.snapshot();
	const attempt = normalizeEmbeddedRunAttemptResult(dispatchedAttempt.rawAttempt);
	const attemptCompactionCount = Math.max(0, attempt.compactionCount ?? 0);
	const recordedCompactionCount = input.recordedCompactionCount ?? 0;
	input.contextRecoveryState.autoCompactionCount += Math.max(0, attemptCompactionCount - recordedCompactionCount);
	if (attemptCompactionCount > recordedCompactionCount) input.contextRecoveryState.currentContextSnapshot = { tokens: void 0 };
	if ((recordedCompactionCount === 0 || attemptCompactionCount > recordedCompactionCount) && typeof attempt.compactionTokensAfter === "number" && Number.isFinite(attempt.compactionTokensAfter) && attempt.compactionTokensAfter >= 0) input.contextRecoveryState.lastCompactionTokensAfter = Math.floor(attempt.compactionTokensAfter);
	await sessionPromptState.waitForCurrentUserMessagePersistence();
	sessionPromptState.suppressNextUserMessagePersistence = sessionPromptState.activePrompt.persisted;
	runInput.laneController.throwIfAborted();
	const { terminal, preflightRecovery, sessionIdUsed, sessionFileUsed, lastAssistant: sessionLastAssistant, currentAttemptAssistant, currentAttemptCompletedAssistant } = attempt;
	const { idleTimedOut } = projectAgentRunAttemptTerminal(terminal);
	const attemptAssistant = resolveCurrentAttemptAssistant(attempt);
	const terminalState = resolveEmbeddedRunAttemptTerminalState({
		attempt,
		assistant: attemptAssistant,
		abortSignal: params.abortSignal
	});
	const { outcome: terminalOutcome, signalOwnedInterruption } = terminalState;
	const terminalAborted = isEmbeddedRunTerminalAbort(terminalOutcome);
	const terminalTimedOut = isEmbeddedRunTerminalTimeout(terminalOutcome);
	const terminalInterrupted = isEmbeddedRunTerminalInterrupted(terminalOutcome);
	const setTerminalLifecycleMeta = (meta) => {
		const { stopReason, ...remainingMeta } = meta;
		const terminalStopReason = terminalInterrupted ? terminalOutcome.stopReason : stopReason;
		attempt.setTerminalLifecycleMeta?.({
			...remainingMeta,
			...terminalStopReason ? { stopReason: terminalStopReason } : {},
			aborted: terminalAborted
		});
	};
	applyEmbeddedAttemptSessionIdentity({
		sessionPromptState,
		sessionFileUsed,
		sessionIdUsed
	});
	const bootstrapPromptWarningSignaturesSeen = attempt.bootstrapPromptWarningSignaturesSeen ?? (attempt.bootstrapPromptWarningSignature ? Array.from(/* @__PURE__ */ new Set([...input.bootstrapPromptWarningSignaturesSeen, attempt.bootstrapPromptWarningSignature])) : input.bootstrapPromptWarningSignaturesSeen);
	const lastAssistantUsage = normalizeAssistantUsageForContext(sessionLastAssistant);
	const currentAttemptAssistantUsage = normalizeAssistantUsageForContext(currentAttemptAssistant);
	const promptCacheLastCallUsage = normalizeUsage(attempt.promptCache?.lastCallUsage);
	const callUsage = resolveLatestCallUsage({
		currentAttemptCandidates: [
			attempt.attemptUsage?.contextUsage ? attempt.attemptUsage : void 0,
			currentAttemptAssistantUsage,
			promptCacheLastCallUsage
		],
		carriedUsage: input.lastRunPromptUsage,
		transcriptFallback: lastAssistantUsage
	});
	const attemptUsage = attempt.attemptUsage ?? callUsage.currentAttempt;
	mergeUsageIntoAccumulator(input.usageAccumulator, attemptUsage);
	mergeAttemptRunStatsIntoAccumulator(input.usageAccumulator, attempt);
	const lastRunPromptUsage = preflightRecovery?.handled === true && preflightRecovery.source === "mid-turn" && (preflightRecovery.truncatedCount ?? 0) > 0 ? { contextUsage: { state: "unavailable" } } : callUsage.latest;
	const breakerStep = stepIdleTimeoutBreaker(input.idleTimeoutBreakerState, {
		idleTimedOut: terminalTimedOut && idleTimedOut,
		completedModelProgress: hasCompletedModelProgressForIdleBreaker(attempt),
		outputTokens: attemptUsage?.output
	});
	if (breakerStep.tripped) {
		const message = `Idle-timeout cost-runaway breaker tripped: ${breakerStep.consecutive} consecutive idle timeouts without completed model progress (cap=5). Halting further attempts to bound paid model calls. See issue #76293.`;
		log$3.error(`[idle-timeout-circuit-breaker-tripped] sessionKey=${params.sessionKey ?? params.sessionId} provider=${provider}/${modelId} consecutive=${breakerStep.consecutive} cap=5`);
		const result = handleRetryLimitExhaustion({
			message,
			decision: resolveRunFailoverDecision({
				stage: "retry_limit",
				fallbackConfigured: runInput.fallbackConfigured,
				failoverReason: input.lastRetryFailoverReason
			}),
			provider,
			model: modelId,
			profileId: runtime.lastProfileId,
			durationMs: Date.now() - runInput.startedAtMs,
			agentMeta: buildErrorAgentMeta({
				sessionId: sessionPromptState.sessionId,
				sessionFile: sessionPromptState.sessionFile,
				provider,
				model: preparedRuntime.model.id,
				credentialSource: attempt.modelAttempt?.credentialSource,
				...runtime.outerContextTokenMeta,
				usageAccumulator: input.usageAccumulator,
				lastRunPromptUsage
			}),
			replayInvalid: input.replayState.replayInvalid ? true : void 0,
			livenessState: "blocked"
		});
		result.meta.modelFallbackStopReason = "idle_timeout_circuit_breaker";
		return {
			action: "complete",
			result
		};
	}
	if (attempt.contextBudgetStatus) input.contextRecoveryState.lastContextBudgetStatus = attempt.contextBudgetStatus;
	const activeErrorContext = resolveActiveErrorContext({
		provider,
		model: modelId,
		assistant: attemptAssistant
	});
	let replayState = input.replayState;
	const resolveReplayInvalidForAttempt = (incompleteTurnText) => replayState.replayInvalid || resolveReplayInvalidFlag({
		attempt,
		incompleteTurnText
	});
	if (resolveReplayInvalidForAttempt(null)) replayState.replayInvalid = true;
	replayState = observeReplayMetadata(replayState, attempt.replayMetadata);
	const formattedAssistantErrorText = attemptAssistant ? formatAssistantErrorText(attemptAssistant, {
		cfg: params.config,
		sessionKey: runInput.resolvedSessionKey ?? params.sessionId,
		agentId: params.agentId,
		provider: activeErrorContext.provider,
		providerOwner: runtime.providerRuntimeHandle?.plugin,
		model: activeErrorContext.model,
		authMode: runtime.lastProfileId ? preparedRuntime.attemptAuthProfileStore.profiles?.[runtime.lastProfileId]?.type : void 0
	}) : void 0;
	const assistantErrorText = attemptAssistant?.stopReason === "error" ? attemptAssistant.errorMessage?.trim() || formattedAssistantErrorText : void 0;
	if (!signalOwnedInterruption && !preparedRuntime.nativeModelOwned && preflightRecovery?.handled) {
		const retryingFromTranscript = preflightRecovery.source === "mid-turn";
		log$3.info(`[context-overflow-precheck] early recovery route=${preflightRecovery.route} completed for ${provider}/${modelId}; ` + (retryingFromTranscript ? "retrying from current transcript" : "retrying prompt"));
		if (retryingFromTranscript) {
			if ((preflightRecovery.truncatedCount ?? 0) > 0) sessionPromptState.markOwnedTranscriptRetry();
			sessionPromptState.continueFromCurrentTranscript();
		}
		return {
			action: "retry",
			retryKind: resolveRunRetryKind({
				preflightRecovery,
				retryingFromTranscript,
				toolMetas: attempt.toolMetas
			}),
			bootstrapPromptWarningSignaturesSeen,
			lastRunPromptUsage,
			replayState
		};
	}
	return {
		action: "proceed",
		bootstrapPromptWarningSignaturesSeen,
		lastRunPromptUsage,
		replayState,
		attempt,
		sessionIdUsed,
		sessionFileUsed,
		currentAttemptAssistant,
		currentAttemptCompletedAssistant,
		attemptAssistant,
		terminalState,
		setTerminalLifecycleMeta,
		attemptCompactionCount,
		activeErrorContext,
		resolveReplayInvalidForAttempt,
		assistantErrorText,
		canRestartForLiveSwitch: !hasOutboundDeliveryEvidence(attempt) && !attempt.didSendDeterministicApprovalPrompt && !attempt.lastToolError && (attempt.toolMetas?.length ?? 0) === 0 && (attempt.assistantTexts?.length ?? 0) === 0
	};
}
//#endregion
//#region src/agents/embedded-agent-runner/run/blocked-run-result.ts
function buildEmbeddedRunBlockedResult(input) {
	return {
		payloads: [{
			text: input.text,
			isError: true
		}],
		meta: {
			durationMs: input.durationMs,
			agentMeta: input.agentMeta,
			systemPromptReport: input.attempt.systemPromptReport,
			finalAssistantVisibleText: input.text,
			finalAssistantRawText: input.text,
			finalPromptText: input.finalPromptText,
			replayInvalid: input.replayInvalid,
			livenessState: "blocked",
			error: {
				kind: input.errorKind,
				message: input.errorMessage
			}
		}
	};
}
//#endregion
//#region src/agents/embedded-agent-runner/run/codex-app-server-recovery.ts
function hasCodexAppServerRecoveryRetryBudget(params) {
	return !params.alreadyRetried && params.runLoopIterations < params.maxRunLoopIterations;
}
/**
* Decides whether a Codex app-server failure can be retried by replaying the
* same turn. The retry is intentionally narrow: stdio-only, replay-safe, once
* per run, and only before any assistant/tool/item side effects escape.
*/
function resolveCodexAppServerRecoveryRetry(params) {
	const failure = params.attempt.codexAppServerFailure;
	if (!failure) return {
		retry: false,
		reason: "not_codex_app_server_failure"
	};
	if (failure.kind !== "client_closed_before_turn_completed" && failure.kind !== "turn_completion_idle_timeout") return {
		retry: false,
		reason: failure.kind
	};
	if (failure.kind === "turn_completion_idle_timeout" && failure.turnWatchTimeoutKind !== "completion") return {
		retry: false,
		reason: failure.turnWatchTimeoutKind ?? "unknown_turn_watch_timeout"
	};
	if (failure.transport !== "stdio") return {
		retry: false,
		reason: "non_stdio_transport"
	};
	if (!params.retryAvailable) return {
		retry: false,
		reason: "retry_exhausted"
	};
	if (!failure.replaySafe || !params.attempt.replayMetadata.replaySafe) return {
		retry: false,
		reason: failure.replayBlockedReason ?? "replay_unsafe"
	};
	if (params.attempt.assistantTexts.some((text) => text.trim().length > 0)) return {
		retry: false,
		reason: "assistant_output"
	};
	if (params.attempt.toolMetas.length > 0 || params.attempt.clientToolCalls || params.attempt.lastToolError || params.attempt.didSendDeterministicApprovalPrompt) return {
		retry: false,
		reason: "tool_activity"
	};
	if (params.attempt.itemLifecycle.startedCount > 0 || params.attempt.itemLifecycle.activeCount > 0) return {
		retry: false,
		reason: "active_item"
	};
	return { retry: true };
}
//#endregion
//#region src/agents/embedded-agent-runner/run/compaction-live-model-selection.ts
function resolveCompactionLiveModelSelection(params) {
	const { current, requested } = params;
	if (!requested) return current;
	if (requested.authProfileId) return {
		provider: requested.provider,
		model: requested.model,
		authProfileId: requested.authProfileId,
		authProfileIdSource: requested.authProfileIdSource ?? "auto"
	};
	if (normalizeProviderId(requested.provider) === normalizeProviderId(current.provider)) return {
		...current,
		provider: requested.provider,
		model: requested.model
	};
	return {
		provider: requested.provider,
		model: requested.model,
		authProfileIdSource: "auto"
	};
}
//#endregion
//#region src/agents/embedded-agent-runner/run/session-bootstrap.ts
const NO_REAL_CONVERSATION_MESSAGES_REASON = "no real conversation messages";
function buildContextEngineCompactionSessionTarget(params) {
	const targetAgentId = normalizeOptionalString(params.sessionTarget?.agentId);
	const targetSessionId = normalizeOptionalString(params.sessionTarget?.sessionId);
	const targetSessionKey = normalizeOptionalString(params.sessionTarget?.sessionKey);
	const targetStorePath = normalizeOptionalString(params.sessionTarget?.storePath);
	const completeTarget = Boolean(targetAgentId && targetSessionId && targetSessionKey && targetStorePath);
	const marker = completeTarget ? void 0 : parseSqliteSessionFileMarker(params.sessionFile);
	const suppliedSessionKey = normalizeOptionalString(params.sessionKey);
	const candidateSessionKey = targetSessionKey ?? suppliedSessionKey;
	const candidateKeyAgentId = parseAgentSessionKey(candidateSessionKey)?.agentId;
	const suppliedEntry = marker && candidateSessionKey ? loadSessionEntryReadOnly({
		agentId: marker.agentId,
		sessionKey: candidateSessionKey,
		storePath: marker.storePath
	}) : void 0;
	const markerMatches = marker ? listSessionEntriesReadOnly({
		agentId: marker.agentId,
		storePath: marker.storePath
	}).filter(({ entry }) => entry.sessionId === marker.sessionId) : [];
	const preferredMarkerSessionKey = marker ? resolvePreferredSessionKeyForSessionIdMatches(markerMatches.map(({ sessionKey, entry }) => [sessionKey, entry]), marker.sessionId) : void 0;
	const markerSessionKey = marker ? suppliedEntry?.sessionId === marker.sessionId ? candidateSessionKey : candidateSessionKey && !suppliedEntry ? candidateSessionKey : preferredMarkerSessionKey : void 0;
	if (marker && markerMatches.length > 0 && !markerSessionKey) throw new Error("Legacy compaction transcript identity is ambiguous");
	if (marker && (targetAgentId && targetAgentId !== marker.agentId || targetSessionId && targetSessionId !== marker.sessionId || candidateKeyAgentId && candidateKeyAgentId !== marker.agentId || targetStorePath && path.resolve(targetStorePath) !== path.resolve(marker.storePath) || candidateSessionKey && suppliedEntry && suppliedEntry.sessionId !== marker.sessionId)) throw new Error("Legacy compaction transcript identity is inconsistent");
	const sessionKey = completeTarget ? targetSessionKey : marker ? markerSessionKey : targetSessionKey ?? suppliedSessionKey;
	const targetStoreOwner = resolvePersistedSessionStoreOwnerForTarget({
		config: params.config ?? {},
		sessionKey,
		storePath: targetStorePath
	});
	const agentId = (Boolean(targetAgentId && targetStorePath && !parseAgentSessionKey(sessionKey)?.agentId && targetStoreOwner.kind === "none") ? targetAgentId : void 0) ?? marker?.agentId ?? resolveSessionAgentId({
		agentId: targetAgentId ?? params.agentId,
		config: params.config,
		sessionKey
	});
	const storePath = targetStorePath ?? marker?.storePath ?? resolveSessionStorePathCore(params.config?.session?.store, { agentId });
	return {
		agentId,
		sessionId: targetSessionId ?? marker?.sessionId ?? params.sessionId,
		...sessionKey ? { sessionKey } : {},
		...storePath ? { storePath } : {},
		...params.sessionTarget?.threadId !== void 0 ? { threadId: params.sessionTarget.threadId } : {}
	};
}
function isNoRealConversationCompactionNoop(params) {
	return params.ok === true && params.compacted === false && params.reason === NO_REAL_CONVERSATION_MESSAGES_REASON;
}
async function resetNoRealConversationTokenSnapshot(params) {
	if (!params.sessionTarget || params.sessionPersistence === "detached") return;
	params.assertActive();
	try {
		await patchSessionEntryCore(params.sessionTarget, () => ({
			totalTokens: 0,
			totalTokensFresh: true,
			totalTokensVersion: 1,
			inputTokens: void 0,
			outputTokens: void 0,
			cacheRead: void 0,
			cacheWrite: void 0,
			contextBudgetStatus: void 0,
			updatedAt: Date.now()
		}), {
			skipMaintenance: true,
			takeCacheOwnership: true,
			assertCommitAllowed: params.assertActive
		});
		params.assertActive();
	} catch (err) {
		params.assertActive();
		log$3.warn(`[context-overflow-precheck] failed to reset stale context snapshot for ${params.sessionTarget.sessionKey}: ${String(err)}`);
	}
}
/** Best-effort read-only session-key lookup for callers that only provide sessionId. */
function backfillSessionKey(params) {
	const trimmed = normalizeOptionalString(params.sessionKey);
	if (trimmed) return trimmed;
	if (!params.config || !params.sessionId) return;
	try {
		const resolved = normalizeOptionalString(params.agentId) ? resolveStoredSessionKeyForSessionId({
			cfg: params.config,
			sessionId: params.sessionId,
			agentId: params.agentId
		}) : resolveSessionKeyForRequestCore({
			cfg: params.config,
			sessionId: params.sessionId
		});
		return normalizeOptionalString(resolved.sessionKey);
	} catch (err) {
		log$3.warn(`[backfillSessionKey] Failed to resolve sessionKey for sessionId=${redactRunIdentifier(sanitizeForLog(params.sessionId))}: ${formatErrorMessage(err)}`);
		return;
	}
}
/** Reserves only a missing row's first writer; no row or claim exists until lazy persistence. */
async function prepareInitialSessionWriter(params) {
	const { runParams, target } = params;
	if (runParams.sessionPersistence === "detached" || runParams.sessionManager && !runParams.sessionManager.getSessionTarget() || runParams.sessionTarget?.expectedWriterRunId || !target?.agentId || !target.sessionId || !target.sessionKey || !target.storePath) return;
	const signal = runParams.abortSignal;
	const assertion = runParams.admittedRunContext && resolveAdmittedRunActiveAssertion(runParams.admittedRunContext, signal);
	if (!assertion) return;
	const ownerTarget = {
		agentId: target.agentId,
		sessionId: target.sessionId,
		sessionKey: target.sessionKey,
		storePath: target.storePath
	};
	const presence = prepareSessionEntryPresenceRead(ownerTarget);
	let interrupted;
	const assertActive = () => {
		signal?.throwIfAborted();
		if (interrupted) throw interrupted;
		assertion();
	};
	const assertAbsent = async () => {
		assertActive();
		const present = await presence.read();
		assertActive();
		if (present) throw new SessionTranscriptWriterClaimReboundError();
	};
	await assertAbsent();
	const admission = await beginSessionWorkAdmission({
		scope: presence.storePath,
		identities: [
			ownerTarget.sessionKey,
			presence.sessionKey,
			ownerTarget.sessionId
		],
		signal,
		assertAllowed: assertAbsent,
		onInterrupt: (reason) => {
			interrupted ??= reason ?? /* @__PURE__ */ new Error("Initial session writer interrupted by lifecycle change");
			params.onInterrupt(interrupted);
		}
	});
	const writerRunId = runParams.runId;
	const writes = new AsyncWorkScope();
	let committedFence;
	let closed = false;
	let closing;
	return {
		writer: Object.freeze({
			writerRunId,
			get committedFence() {
				return committedFence;
			},
			assertActive: () => {
				assertActive();
				if (!committedFence && (closed || !admission.isActive())) throw new SessionTranscriptWriterClaimReboundError();
			},
			recordCommitted: (fence) => {
				committedFence = Object.freeze({ ...fence });
				admission.release();
			},
			withTranscriptWrite: (write) => admission.run(() => writes.track(write))
		}),
		run: admission.run,
		close: () => closing ??= (async () => {
			try {
				await AsyncWorkScope.runWhenAllIdle(() => [writes], () => writes.drain());
			} finally {
				closed = true;
				admission.release();
			}
		})()
	};
}
function assertAgentHarnessRunAdmission(params) {
	if (params.sessionPersistence === "detached") return;
	const sessionKey = normalizeOptionalString(params.sessionKey);
	if (!sessionKey) return;
	const targetAgentId = normalizeOptionalString(params.sessionTarget?.agentId);
	const targetStorePath = normalizeOptionalString(params.sessionTarget?.storePath);
	const targetStoreOwner = resolvePersistedSessionStoreOwnerForTarget({
		config: params.config ?? {},
		sessionKey,
		storePath: targetStorePath
	});
	const admissionAgentId = Boolean(targetAgentId && targetStorePath && !parseAgentSessionKey(sessionKey)?.agentId && targetStoreOwner.kind === "none") ? targetAgentId : resolveSessionAgentId({
		agentId: targetAgentId ?? params.agentId,
		config: params.config,
		sessionKey
	});
	const storePath = targetStorePath ?? resolveSessionStorePathCore(params.config?.session?.store, { agentId: admissionAgentId });
	const durableEntry = loadSessionEntry({
		...admissionAgentId ? { agentId: admissionAgentId } : {},
		readConsistency: "latest",
		sessionKey,
		storePath
	});
	const admissionError = resolveAgentHarnessRunAdmissionError({
		agentHarnessId: params.agentHarnessId,
		entry: durableEntry,
		modelSelectionLocked: params.modelSelectionLocked,
		sessionId: params.sessionId,
		sessionKey
	});
	if (admissionError) throw new Error(admissionError);
	return durableEntry ? {
		...admissionAgentId ? { agentId: admissionAgentId } : {},
		entry: durableEntry,
		sessionKey,
		storePath
	} : void 0;
}
async function claimAgentSessionWriter(params) {
	const snapshot = assertAgentHarnessRunAdmission(params);
	if (!snapshot) return;
	const expectedSessionId = params.sessionId;
	const expectedLifecycleRevision = snapshot.entry.lifecycleRevision;
	if (snapshot.entry.sessionId !== expectedSessionId) throw new Error(`Session changed before writer admission: ${snapshot.sessionKey}`);
	const previousWriterRunId = normalizeOptionalString(snapshot.entry.activeWriterRunId);
	const claimed = await updateSessionEntry({
		...snapshot.agentId ? { agentId: snapshot.agentId } : {},
		sessionKey: snapshot.sessionKey,
		storePath: snapshot.storePath
	}, (entry) => {
		if (entry.sessionId !== expectedSessionId || entry.lifecycleRevision !== expectedLifecycleRevision) throw new Error(`Session changed before writer claim commit: ${snapshot.sessionKey}`);
		return Object.assign({}, entry, { activeWriterRunId: params.runId });
	}, { skipMaintenance: true });
	if (!claimed || claimed.activeWriterRunId !== params.runId) throw new Error(`Session writer claim was not persisted: ${snapshot.sessionKey}`);
	if (previousWriterRunId && previousWriterRunId !== params.runId) {
		if (supersedeEmbeddedAgentRunByRunId(previousWriterRunId, () => {
			const previousLifecycleGeneration = getAgentRunContext(previousWriterRunId)?.lifecycleGeneration;
			if (!emitAgentEventIfCurrent({
				runId: previousWriterRunId,
				...previousLifecycleGeneration ? { lifecycleGeneration: previousLifecycleGeneration } : {},
				stream: "lifecycle",
				sessionKey: snapshot.sessionKey,
				sessionId: expectedSessionId,
				...snapshot.agentId ? { agentId: snapshot.agentId } : {},
				data: {
					phase: "end",
					aborted: true,
					status: "superseded",
					stopReason: "superseded",
					error: "agent run superseded by a newer session writer",
					endedAt: Date.now()
				}
			})) throw new Error(`Could not record superseded writer outcome: ${previousWriterRunId}`);
		})) log$3.warn(`[session-writer] replacing claim session=${sanitizeForLog(snapshot.sessionKey)} previousRunId=${redactRunIdentifier(sanitizeForLog(previousWriterRunId))} nextRunId=${redactRunIdentifier(sanitizeForLog(params.runId))} live=true`);
	}
	return {
		expectedLifecycleRevision,
		expectedWriterRunId: params.runId
	};
}
//#endregion
//#region src/agents/embedded-agent-runner/run/compaction-runtime.ts
/** Preserve one prepared owner snapshot throughout context and timeout recovery. */
async function compactEmbeddedRunForRecovery(input, recovery) {
	const { runParams } = input;
	const owner = input.prepareRecoveryOwner();
	const activeSession = owner.session;
	const reason = recovery.trigger === "budget" ? "context budget recovery" : recovery.trigger === "overflow" ? "overflow recovery" : "timeout recovery";
	await input.runOwnsCompactionBeforeHook(reason);
	owner.assertActive();
	const runtimeContext = {
		...buildEmbeddedCompactionRuntimeContext({
			sessionKey: runParams.sessionKey,
			sandboxSessionKey: runParams.sandboxSessionKey,
			sandboxAgentId: runParams.sandboxAgentId,
			messageChannel: runParams.messageChannel,
			messageProvider: runParams.messageProvider,
			clientCaps: runParams.clientCaps,
			pinnedWidgetAuthoring: runParams.pinnedWidgetAuthoring,
			chatType: runParams.chatType,
			agentAccountId: runParams.agentAccountId,
			conversationRoutePeerId: runParams.conversationRoutePeerId,
			currentChannelId: runParams.currentChannelId,
			currentThreadTs: runParams.currentThreadTs,
			currentMessageId: runParams.currentMessageId,
			authProfileId: input.modelSelection.authProfileId,
			authProfileIdSource: input.modelSelection.authProfileIdSource,
			runtimeAuthPlan: input.runtimeAuthPlan,
			workspaceDir: input.workspaceDir,
			bootstrapWorkspaceDir: runParams.bootstrapWorkspaceDir,
			permissionMode: runParams.permissionMode,
			sessionRoot: runParams.sessionRoot,
			requireWorkspaceOnly: runParams.requireWorkspaceOnly,
			requireWritableSandbox: runParams.requireWritableSandbox,
			agentDir: input.agentDir,
			config: runParams.config,
			toolOverrides: runParams.toolOverrides,
			toolsAllow: runParams.toolsAllow,
			skillsSnapshot: runParams.skillsSnapshot,
			senderId: runParams.senderId,
			provider: input.modelSelection.provider,
			modelId: input.modelSelection.model,
			harnessRuntime: input.harnessRuntime,
			modelSelectionLocked: runParams.modelSelectionLocked,
			modelFallbacksOverride: runParams.modelFallbacksOverride,
			thinkLevel: input.thinkLevel,
			reasoningLevel: runParams.reasoningLevel,
			execOverrides: runParams.execOverrides,
			bashElevated: runParams.bashElevated,
			extraSystemPrompt: runParams.extraSystemPrompt,
			sourceReplyDeliveryMode: runParams.sourceReplyDeliveryMode,
			ownerNumbers: runParams.ownerNumbers,
			activeProcessSessions: listActiveProcessSessionReferences({ scopeKey: resolveProcessToolScopeKey({
				sessionKey: runParams.sessionKey,
				sessionId: activeSession.id,
				agentId: input.sessionAgentId
			}) })
		}),
		...resolveContextEngineCapabilities({
			config: runParams.config,
			sessionKey: runParams.sessionKey,
			explicitAgentId: input.contextEngineAgentId,
			contextEnginePluginId: input.resolveContextEnginePluginId(),
			purpose: recovery.trigger === "budget" ? "context-engine.compaction" : recovery.trigger === "overflow" ? "context-engine.overflow-compaction" : "context-engine.timeout-compaction"
		}),
		onCompactionHookMessages: input.onCompactionHookMessages,
		...input.attempt.promptCache ? { promptCache: input.attempt.promptCache } : {},
		runId: runParams.runId,
		trigger: recovery.trigger,
		...recovery.currentTokenCount !== void 0 ? { currentTokenCount: recovery.currentTokenCount } : {},
		diagId: recovery.diagId,
		attempt: recovery.attempt,
		maxAttempts: recovery.maxAttempts
	};
	let observedCompactions = 0;
	const runtimeSettings = input.buildRuntimeSettings({
		tokenBudget: recovery.tokenBudget,
		...recovery.trigger === "overflow" ? { degradedReason: "context_overflow" } : {}
	});
	const compactParams = {
		sessionId: activeSession.id,
		sessionKey: input.resolvedSessionKey,
		agentId: input.sessionAgentId,
		sessionTarget: buildContextEngineCompactionSessionTarget({
			agentId: input.sessionAgentId,
			config: runParams.config,
			sessionFile: activeSession.file,
			sessionId: activeSession.id,
			sessionKey: input.resolvedSessionKey,
			sessionTarget: activeSession.target
		}),
		tokenBudget: recovery.tokenBudget,
		...recovery.currentTokenCount !== void 0 ? { currentTokenCount: recovery.currentTokenCount } : {},
		force: true,
		compactionTarget: "budget",
		runtimeContext,
		runtimeSettings
	};
	let result;
	try {
		const compact = bindContextEngineCompaction(input.contextEngine);
		result = await compactContextEngineWithSafetyTimeout({
			info: input.contextEngine.info,
			compact: inheritRuntimeCompactionDelegate(compact, (backendParams) => owner.withTranscriptWrites(backendParams.abortSignal, () => {
				if (backendParams.runtimeContext) attachCompactionAccountingRecorder(backendParams.runtimeContext, {
					requestBudget: input.state.compactionRequestBudget,
					pendingRequestState: recovery.trigger === "timeout_recovery" ? void 0 : "unresolved",
					memoryTranscript: owner.sessionManager ? {
						sessionManager: owner.sessionManager,
						sessionTarget: activeSession.target,
						assertActive: () => {
							backendParams.abortSignal?.throwIfAborted();
							owner.assertActive();
						}
					} : void 0,
					recordUsage: (usage) => mergeUsageIntoAccumulator(input.usageAccumulator, usage),
					recordCompaction: ({ tokensAfter }) => {
						observedCompactions += 1;
						input.state.observeContextAccounting({
							kind: "compaction",
							tokensAfter
						});
					}
				});
				return compact(backendParams);
			}))
		}, compactParams, resolveCompactionTimeoutMs(runParams.config), runParams.abortSignal);
	} catch (error) {
		owner.assertActive();
		log$3.warn(`contextEngine.compact() threw during ${reason} for ${input.modelSelection.provider}/${input.modelSelection.model}: ${String(error)}`);
		result = {
			ok: false,
			compacted: false,
			reason: String(error)
		};
	}
	if (observedCompactions > 0 && !result.compacted) result = {
		ok: result.ok,
		compacted: true,
		reason: result.reason
	};
	const successor = resolveCompactionSuccessorTranscript(result);
	const target = result.result?.sessionTarget;
	const sameTarget = (!successor.sessionId || successor.sessionId === activeSession.id) && (!successor.sessionFile || successor.sessionFile === activeSession.file) && (!target?.agentId || target.agentId === activeSession.target?.agentId) && (!target?.sessionKey || target.sessionKey === activeSession.target?.sessionKey) && (!target?.storePath || target.storePath === activeSession.target?.storePath);
	const reportedTokens = result.result?.tokensAfter;
	const tokensAfter = typeof reportedTokens === "number" && Number.isFinite(reportedTokens) && reportedTokens >= 0 ? Math.floor(reportedTokens) : void 0;
	const recordTokensAfter = () => {
		input.state.lastCompactionTokensAfter = tokensAfter;
		input.state.currentContextSnapshot = { tokens: tokensAfter };
	};
	if (result.compacted && observedCompactions === 0) input.state.observeContextAccounting({
		kind: "compaction",
		tokensAfter: sameTarget ? tokensAfter : void 0
	});
	owner.assertActive();
	const retainMemoryTranscript = owner.sessionManager && sameTarget && (target?.threadId === void 0 || target.threadId === activeSession.target.threadId);
	const previousSessionId = result.compacted && !retainMemoryTranscript ? await input.adoptCompactionTranscript(result, sameTarget ? void 0 : recordTokensAfter) : void 0;
	input.assertRecoveryActive();
	return {
		result,
		runtimeContext,
		runtimeSettings,
		previousSessionId
	};
}
function createEmbeddedRunCompactionRuntime(input) {
	const { runParams: params, contextEngine, hookRunner, hookContext, sessionPromptState } = input;
	const abortSignal = params.abortSignal;
	const admittedAssertion = params.admittedRunContext ? resolveAdmittedRunActiveAssertion(params.admittedRunContext) : void 0;
	const runId = params.runId;
	const memoryManager = params.sessionManager && !params.sessionManager.getSessionTarget() ? params.sessionManager : void 0;
	const detached = params.sessionPersistence === "detached";
	const assertAdmittedActive = () => {
		abortSignal?.throwIfAborted();
		if (!admittedAssertion) throw new Error("compaction recovery requires an active admitted run");
		admittedAssertion();
	};
	const assertRecoveryTarget = (target, sessionId = sessionPromptState.sessionId, writerFence = sessionPromptState.sessionWriterFence) => {
		assertAdmittedActive();
		if (memoryManager || detached) return;
		const entry = target?.sessionKey && target.storePath ? loadSessionEntry({
			agentId: target.agentId,
			sessionKey: target.sessionKey,
			storePath: target.storePath,
			readConsistency: "latest"
		}) : void 0;
		if (!writerFence || writerFence.expectedWriterRunId !== runId || entry?.sessionId !== sessionId || entry.lifecycleRevision !== writerFence.expectedLifecycleRevision || entry.activeWriterRunId !== writerFence.expectedWriterRunId) throw new SessionTranscriptWriterClaimReboundError();
	};
	const assertRecoveryActive = () => assertRecoveryTarget(sessionPromptState.sessionTarget);
	const getPreparedTarget = () => {
		const target = sessionPromptState.sessionTarget;
		if (!target?.agentId || !target.sessionKey || !target.storePath) throw new Error("compaction recovery requires a complete transcript target");
		return {
			...target,
			agentId: target.agentId,
			sessionId: sessionPromptState.sessionId,
			sessionKey: target.sessionKey,
			storePath: target.storePath
		};
	};
	const prepareRecoveryOwner = () => {
		assertRecoveryActive();
		const sessionId = sessionPromptState.sessionId;
		const sessionFile = sessionPromptState.sessionFile;
		const writerFence = sessionPromptState.sessionWriterFence;
		const target = {
			...getPreparedTarget(),
			...writerFence
		};
		const assertActive = () => {
			assertRecoveryTarget(target, sessionId, writerFence);
			const current = sessionPromptState.sessionTarget;
			if (sessionPromptState.sessionId !== sessionId || sessionPromptState.sessionFile !== sessionFile || current?.agentId !== target.agentId || current?.sessionKey !== target.sessionKey || current?.storePath !== target.storePath) throw new Error("active session changed after recovery transcript preparation");
		};
		return {
			session: {
				id: sessionId,
				file: sessionFile,
				target
			},
			...memoryManager ? { sessionManager: memoryManager } : {},
			assertActive,
			withTranscriptWrites: (signal, run) => {
				const assertInvocationActive = () => {
					signal?.throwIfAborted();
					assertActive();
				};
				const assertCommitAllowed = () => {
					assertInvocationActive();
					if (detached || memoryManager) throw new Error("detached recovery cannot persist a session transcript");
				};
				return withOwnedSessionTranscriptWrites({
					sessionTarget: target,
					assertCommitAllowed,
					withTranscriptWrite: async (write) => await write()
				}, async () => {
					assertInvocationActive();
					return await run();
				});
			}
		};
	};
	const prepareRecoverySession = (contextTokenBudget) => {
		const owner = prepareRecoveryOwner();
		const sessionManager = memoryManager ?? (detached ? void 0 : SessionManager.open(owner.session.target, params.workspaceDir, resolveEmbeddedSessionContextLimits(contextTokenBudget)));
		return {
			sessionManager,
			assertActive: owner.assertActive,
			withSessionManagerRewriteLock: (operation) => owner.withTranscriptWrites(void 0, async () => {
				if (!sessionManager) throw new Error("detached recovery has no caller-owned transcript to rewrite");
				sessionManager.reloadPersistedTranscript();
				return await operation();
			})
		};
	};
	const resolveActiveHookContext = () => ({
		...hookContext,
		sessionId: sessionPromptState.sessionId
	});
	const adoptCompactionTranscript = async (compactResult, onAccepted) => {
		assertRecoveryActive();
		const currentTarget = getPreparedTarget();
		if (memoryManager || detached) {
			const successor = await resolveContextEngineCompactionSuccessor({
				config: params.config,
				currentSessionFile: sessionPromptState.sessionFile,
				currentTarget,
				result: compactResult
			});
			assertAdmittedActive();
			sessionPromptState.capturePreparedCompactionTarget(successor);
			try {
				onAccepted?.();
				sessionPromptState.notifyCompactionSessionAdopted(currentTarget.sessionId);
				assertAdmittedActive();
				return successor.sessionId !== currentTarget.sessionId ? currentTarget.sessionId : void 0;
			} finally {
				if (successor.sessionId !== currentTarget.sessionId) await retireSessionMcpRuntime({
					sessionId: currentTarget.sessionId,
					reason: "compaction-session-end",
					retainAcrossReuse: true,
					preserveActiveLeases: true
				});
			}
		}
		const writerFence = sessionPromptState.sessionWriterFence;
		const recordAccepted = (accepted) => {
			sessionPromptState.recordCommittedCompactionSuccessor(accepted);
			onAccepted?.();
		};
		const accepted = await acceptCompactionSuccessor({
			config: params.config,
			currentSessionFile: sessionPromptState.sessionFile,
			currentTarget,
			result: compactResult,
			expectedEntry: {
				sessionId: currentTarget.sessionId,
				lifecycleRevision: writerFence?.expectedLifecycleRevision,
				activeWriterRunId: writerFence?.expectedWriterRunId
			},
			assertActive: assertAdmittedActive,
			onCommitted: recordAccepted
		});
		if (!accepted.previousSessionId) recordAccepted(accepted);
		assertRecoveryActive();
		sessionPromptState.notifyCompactionSessionAdopted(accepted.previousSessionId);
		assertRecoveryActive();
		return accepted.previousSessionId;
	};
	const onCompactionHookMessages = async (payload) => {
		const messages = payload.messages.filter((message) => message.trim().length > 0);
		if (messages.length === 0) return;
		assertRecoveryActive();
		await params.onAgentEvent?.({
			stream: "compaction",
			data: {
				phase: payload.phase === "before" ? "start" : "end",
				...payload.phase === "after" ? { completed: true } : {},
				messages
			},
			...params.sessionKey ? { sessionKey: params.sessionKey } : {}
		});
		assertRecoveryActive();
	};
	const runOwnsCompactionBeforeHook = async (reason) => {
		assertRecoveryActive();
		if (contextEngine.info.ownsCompaction !== true || !hookRunner?.hasHooks("before_compaction")) return;
		try {
			await hookRunner.runBeforeCompaction({
				messageCount: -1,
				sessionFile: sessionPromptState.sessionFile
			}, resolveActiveHookContext());
		} catch (error) {
			assertRecoveryActive();
			log$3.warn(`before_compaction hook failed during ${reason}: ${String(error)}`);
		}
		assertRecoveryActive();
	};
	const runOwnsCompactionAfterHook = async (reason, compactResult, previousSessionId) => {
		assertRecoveryActive();
		if (contextEngine.info.ownsCompaction !== true || !compactResult.ok || !hookRunner?.hasHooks("after_compaction")) return;
		try {
			await hookRunner.runAfterCompaction({
				messageCount: -1,
				compactedCount: compactResult.compacted ? -1 : 0,
				tokenCount: compactResult.result?.tokensAfter,
				sessionFile: resolveCompactionSuccessorTranscript(compactResult).sessionFile ?? sessionPromptState.sessionFile,
				...previousSessionId ? { previousSessionId } : {}
			}, resolveActiveHookContext());
		} catch (error) {
			assertRecoveryActive();
			log$3.warn(`after_compaction hook failed during ${reason}: ${String(error)}`);
		}
		assertRecoveryActive();
	};
	return {
		assertRecoveryActive,
		prepareRecoveryOwner,
		prepareRecoverySession,
		adoptCompactionTranscript,
		onCompactionHookMessages,
		runOwnsCompactionBeforeHook,
		runOwnsCompactionAfterHook
	};
}
//#endregion
//#region src/agents/embedded-agent-runner/run/overflow-context-recovery.ts
function renderRecoverySideEffectCaution(attempt) {
	return (attempt.currentAttemptReplayMetadata ?? attempt.replayMetadata).hadPotentialSideEffects ? " Completed tool actions were not replayed; verify their effects before retrying." : "";
}
function renderOverflowResetGuidance(attempt) {
	return "Context overflow: prompt too large for the model. Try /reset (or /new) to start a fresh session, or use a larger-context model." + renderRecoverySideEffectCaution(attempt);
}
async function recoverEmbeddedRunOverflow(input) {
	const assistant = input.assistantOverflowCandidate?.message;
	const classification = input.assistantOverflowCandidate?.classification;
	const contextOverflowError = !input.aborted && !input.signalOwnedInterruption ? (() => {
		if (input.promptError) {
			const errorText = formatErrorMessage(input.promptError);
			if (isLikelyContextOverflowError(errorText)) return {
				text: errorText,
				source: "promptError"
			};
			return null;
		}
		if (isProviderRefusalAssistantError(assistant)) return null;
		if (assistant?.stopReason === "error" && classification?.kind === "reason") return null;
		if (assistant && (classification?.kind === "context_overflow" || input.contextTokenBudget !== void 0 && isContextOverflow(assistant, input.contextTokenBudget))) return {
			text: assistant.errorMessage?.trim() || "Context window exceeded",
			source: "assistantError"
		};
		if (assistant?.stopReason === "length") return null;
		if (input.assistantErrorText && isLikelyContextOverflowError(input.assistantErrorText)) return {
			text: input.assistantErrorText,
			source: "assistantError"
		};
		return null;
	})() : null;
	if (!contextOverflowError || !input.genericCompactionRecoveryAllowed || input.contextTokenBudget === void 0) return { action: "none" };
	input.assertRecoveryActive();
	const contextTokenBudget = input.contextTokenBudget;
	const terminal = projectAgentRunAttemptTerminal(input.attempt.terminal);
	const isPreflightRecovery = terminal.promptErrorSource === "precheck";
	const compactionTrigger = isPreflightRecovery ? "budget" : "overflow";
	const recoveryReason = isPreflightRecovery ? "context budget recovery" : "overflow recovery";
	const pressureDescription = isPreflightRecovery ? "predicted context pressure" : "context overflow";
	const providerPromptRejection = contextOverflowError.source === "assistantError" || terminal.promptErrorSource === "prompt" ? markLastProviderPromptContextRejected(getProviderPromptState(input.runParams.runId)) : void 0;
	const runParams = input.runParams;
	const overflowDiagId = createRunRecoveryDiagId();
	const errorText = contextOverflowError.text;
	const observedOverflowTokens = extractObservedOverflowTokenCount(errorText);
	const preflightRecovery = input.attempt.preflightRecovery;
	const requiresTranscriptContinuation = preflightRecovery?.source === "mid-turn" || !isCurrentAttemptReplaySafe(input.attempt);
	const truncateToolResults = async () => {
		const { sessionManager, assertActive } = input.prepareRecoverySession(contextTokenBudget);
		if (!sessionManager) return {
			truncated: false,
			truncatedCount: 0,
			reason: "detached recovery has no caller-owned transcript"
		};
		return await withSessionManagerWrite(sessionManager, async () => {
			const target = sessionManager.getSessionTarget();
			assertActive();
			const result = await truncateOversizedToolResultsInSessionManager({
				sessionManager,
				contextWindowTokens: contextTokenBudget,
				maxCharsOverride: resolveLiveToolResultMaxChars({ contextWindowTokens: contextTokenBudget }),
				protectTrailingToolResults: preflightRecovery?.route === "compact_then_truncate",
				projectionState: getEmbeddedSessionPromptState(input.getActiveSession().id).toolResults,
				...target
			});
			assertActive();
			return result;
		});
	};
	const preflightPromptBudget = isPreflightRecovery && typeof preflightRecovery?.promptBudgetBeforeReserve === "number" && Number.isFinite(preflightRecovery.promptBudgetBeforeReserve) && preflightRecovery.promptBudgetBeforeReserve > 0 ? Math.floor(preflightRecovery.promptBudgetBeforeReserve) : void 0;
	const preflightEstimatedPromptTokens = isPreflightRecovery && typeof preflightRecovery?.estimatedPromptTokens === "number" && Number.isFinite(preflightRecovery.estimatedPromptTokens) && preflightRecovery.estimatedPromptTokens > 0 ? Math.ceil(preflightRecovery.estimatedPromptTokens) : void 0;
	const overflowTokenCountForCompaction = observedOverflowTokens ?? preflightEstimatedPromptTokens ?? (input.contextTokenBudget > 0 ? input.contextTokenBudget + 1 : void 0);
	const activeSession = input.getActiveSession();
	log$3.warn(`[context-overflow-diag] sessionKey=${runParams.sessionKey ?? runParams.sessionId} provider=${input.modelSelection.provider}/${input.modelSelection.model} source=${contextOverflowError.source} trigger=${compactionTrigger} messages=${input.attempt.messagesSnapshot?.length ?? 0} sessionFile=${activeSession.file} diagId=${overflowDiagId} compactionAttempts=${input.state.overflowCompactionAttempts} observedTokens=${observedOverflowTokens ?? "unknown"} preflightEstimatedTokens=${preflightEstimatedPromptTokens ?? "unknown"} compactionTokens=${overflowTokenCountForCompaction ?? "unknown"} providerPayloadBytes=${providerPromptRejection?.byteWeight ?? "unknown"} error=${truncateUtf16Safe(errorText, 200)}`);
	const isCompactionFailure = isCompactionFailureError(errorText);
	if (isProviderRequestSizeCeilingError(errorText)) {
		log$3.warn(`[context-overflow-recovery] provider request-size ceiling for ${input.modelSelection.provider}/${input.modelSelection.model}; livenessState=blocked suggestedAction=reset_or_new kind=${isCompactionFailure ? "compaction_failure" : "context_overflow"} compaction=skipped retry=skipped`);
		return {
			action: "surface",
			kind: isCompactionFailure ? "compaction_failure" : "context_overflow",
			errorText,
			userText: renderOverflowResetGuidance(input.attempt)
		};
	}
	let parkedWorkBlocksContinuation = false;
	let failedCompactionReason;
	if (!isCompactionFailure && input.attemptCompactionCount > 0 && input.state.overflowCompactionAttempts < 3) {
		input.markOwnedTranscriptRetry();
		input.state.overflowCompactionAttempts += 1;
		log$3.warn(`${pressureDescription} persisted after in-attempt compaction (attempt ${input.state.overflowCompactionAttempts}/3); retrying prompt without additional compaction for ${input.modelSelection.provider}/${input.modelSelection.model}`);
		if (requiresTranscriptContinuation) input.prepareCurrentTranscriptRetry();
		return { action: "retry" };
	}
	if (!isCompactionFailure && input.attemptCompactionCount === 0 && input.state.overflowCompactionAttempts < 3) {
		if (log$3.isEnabled("debug")) log$3.debug(`[compaction-diag] decision diagId=${overflowDiagId} branch=compact isCompactionFailure=${isCompactionFailure} hasOversizedToolResults=unknown attempt=${input.state.overflowCompactionAttempts + 1} maxAttempts=3`);
		input.state.overflowCompactionAttempts += 1;
		log$3.warn(`${pressureDescription} detected (attempt ${input.state.overflowCompactionAttempts}/3); attempting auto-compaction for ${input.modelSelection.provider}/${input.modelSelection.model}`);
		const compaction = await compactEmbeddedRunForRecovery(input, {
			tokenBudget: preflightPromptBudget ?? input.contextTokenBudget,
			trigger: compactionTrigger,
			diagId: overflowDiagId,
			attempt: input.state.overflowCompactionAttempts,
			maxAttempts: 3,
			currentTokenCount: overflowTokenCountForCompaction
		});
		const { result: compactResult, previousSessionId } = compaction;
		input.assertRecoveryActive();
		if (compactResult.ok && compactResult.compacted) {
			const adoptedSession = input.getActiveSession();
			parkedWorkBlocksContinuation = previousSessionId !== void 0 && requiresTranscriptContinuation && input.attempt.toolMetas.some((entry) => entry.codeModeSuspended === true);
			if (parkedWorkBlocksContinuation) log$3.warn(`[context-overflow-recovery] compaction rotated ${previousSessionId} -> ${adoptedSession.id} while nested tool work was parked; not continuing mid-turn for ${input.modelSelection.provider}/${input.modelSelection.model}`);
			if (input.contextEngine.maintain) {
				const transcript = input.prepareRecoverySession(contextTokenBudget);
				await runContextEngineMaintenance({
					...transcript,
					contextEngine: input.contextEngine,
					sessionId: adoptedSession.id,
					sessionKey: runParams.sessionKey,
					sessionTarget: adoptedSession.target,
					sessionFile: adoptedSession.file,
					reason: "compaction",
					runtimeContext: compaction.runtimeContext,
					runtimeSettings: compaction.runtimeSettings,
					config: runParams.config,
					agentId: input.sessionAgentId,
					contextEngineAgentId: input.contextEngineAgentId,
					abortSignal: runParams.abortSignal
				});
				input.assertRecoveryActive();
			}
		}
		await input.runOwnsCompactionAfterHook(recoveryReason, compactResult, previousSessionId);
		input.assertRecoveryActive();
		if (preflightRecovery && isNoRealConversationCompactionNoop(compactResult)) {
			input.state.lastCompactionTokensAfter = void 0;
			input.state.lastContextBudgetStatus = void 0;
			const transcript = input.prepareRecoverySession(contextTokenBudget);
			await resetNoRealConversationTokenSnapshot({
				sessionTarget: transcript.sessionManager?.getSessionTarget(),
				sessionPersistence: runParams.sessionPersistence,
				assertActive: transcript.assertActive
			});
			input.assertRecoveryActive();
			log$3.info(`[context-overflow-precheck] stale token state had no real conversation messages for ${input.modelSelection.provider}/${input.modelSelection.model}; resetting the context snapshot and retrying prompt`);
			if (requiresTranscriptContinuation) input.prepareCurrentTranscriptRetry();
			return { action: "retry" };
		}
		if (compactResult.compacted) {
			const tokensBefore = compactResult.result?.tokensBefore;
			const tokensAfter = compactResult.result?.tokensAfter;
			const compactionOutcome = typeof tokensBefore === "number" && Number.isFinite(tokensBefore) && typeof tokensAfter === "number" && Number.isFinite(tokensAfter) && tokensAfter >= tokensBefore ? "auto-compaction removed nothing" : "auto-compaction succeeded";
			if (preflightRecovery?.route === "compact_then_truncate") {
				const truncResult = await truncateToolResults();
				if (truncResult.truncated) log$3.info(`[context-overflow-precheck] post-compaction tool-result truncation succeeded for ${input.modelSelection.provider}/${input.modelSelection.model}; truncated ${truncResult.truncatedCount} tool result(s)`);
				else log$3.warn(`[context-overflow-precheck] post-compaction tool-result truncation did not help for ${input.modelSelection.provider}/${input.modelSelection.model}: ${truncResult.reason ?? "unknown"}`);
			}
			input.assertRecoveryActive();
			input.runParams.onAutoCompactionSucceeded?.(input.state.autoCompactionCount);
			input.assertRecoveryActive();
			input.armPostCompactionGuard();
			if (parkedWorkBlocksContinuation) log$3.warn(`${compactionOutcome} for ${input.modelSelection.provider}/${input.modelSelection.model}, but parked nested tool work cannot follow the rotated session; surfacing overflow guidance`);
			else {
				log$3.info(`${compactionOutcome} for ${input.modelSelection.provider}/${input.modelSelection.model}; retrying prompt`);
				input.markOwnedTranscriptRetry();
				if (requiresTranscriptContinuation) input.prepareCurrentTranscriptRetry();
				else {
					await input.prepareCompactedTranscriptRetry(input.assertRecoveryActive);
					input.assertRecoveryActive();
				}
				return { action: "retry" };
			}
		} else {
			failedCompactionReason = formatErrorMessage(compactResult.reason ?? "nothing to compact");
			log$3.warn(`auto-compaction failed for ${input.modelSelection.provider}/${input.modelSelection.model}: ${failedCompactionReason}`);
		}
	}
	if (!parkedWorkBlocksContinuation && !input.state.toolResultTruncationAttempted) {
		const toolResultMaxChars = resolveLiveToolResultMaxChars({ contextWindowTokens: input.contextTokenBudget });
		if (input.attempt.messagesSnapshot ? sessionLikelyHasOversizedToolResults({
			messages: input.attempt.messagesSnapshot,
			contextWindowTokens: input.contextTokenBudget,
			maxCharsOverride: toolResultMaxChars
		}) : false) {
			input.state.toolResultTruncationAttempted = true;
			log$3.warn(`[context-overflow-recovery] Attempting tool result truncation for ${input.modelSelection.provider}/${input.modelSelection.model} (contextWindow=${input.contextTokenBudget} tokens)`);
			const truncResult = await truncateToolResults();
			if (truncResult.truncated) {
				input.markOwnedTranscriptRetry();
				log$3.info(`[context-overflow-recovery] Truncated ${truncResult.truncatedCount} tool result(s); retrying prompt`);
				if (requiresTranscriptContinuation) input.prepareCurrentTranscriptRetry();
				return { action: "retry" };
			}
			log$3.warn(`[context-overflow-recovery] Tool result truncation did not help: ${truncResult.reason ?? "unknown"}`);
		}
	}
	if ((isCompactionFailure || input.state.overflowCompactionAttempts >= 3) && log$3.isEnabled("debug")) log$3.debug(`[compaction-diag] decision diagId=${overflowDiagId} branch=give_up isCompactionFailure=${isCompactionFailure} hasOversizedToolResults=unknown attempt=${input.state.overflowCompactionAttempts} maxAttempts=3`);
	const preflightCompactionFailed = isPreflightRecovery && failedCompactionReason !== void 0;
	const kind = isCompactionFailure || preflightCompactionFailed ? "compaction_failure" : "context_overflow";
	const failureText = preflightCompactionFailed ? `Auto-compaction failed before the next model request: ${failedCompactionReason}` : errorText;
	const userText = preflightCompactionFailed ? `${classifyCompactionReason(failedCompactionReason) === "timeout" ? "Auto-compaction timed out" : "Auto-compaction failed"} before the next model request. Try again or run /compact.` + renderRecoverySideEffectCaution(input.attempt) : renderOverflowResetGuidance(input.attempt);
	log$3.warn(`[context-overflow-recovery] exhausted ${isPreflightRecovery ? "context budget" : "provider overflow"} recovery for ${input.modelSelection.provider}/${input.modelSelection.model}; livenessState=blocked suggestedAction=${preflightCompactionFailed ? "retry_or_compact" : "reset_or_new"} kind=${kind}`);
	return {
		action: "surface",
		kind,
		errorText: failureText,
		userText
	};
}
//#endregion
//#region src/agents/embedded-agent-runner/run/prompt-failure.ts
async function handleEmbeddedPromptFailure(input) {
	if (hasRecordedModelFallbackStop(input.promptError)) throw input.promptError;
	if (input.promptErrorSource === "precheck" && input.promptError instanceof CompactionReplayRefreshRequiredError) {
		const text = new CompactionReplayRefreshRequiredError().message;
		return completeBlockedPromptFailure(input, {
			text,
			errorKind: "compaction_replay_refresh_required",
			errorMessage: text
		});
	}
	const promptAuthMode = input.authProfileId ? input.authProfileStore.profiles?.[input.authProfileId]?.type : void 0;
	const terminalOutcome = buildAgentRunTerminalOutcomeFromAttempt({
		terminal: input.attempt.terminal,
		promptTimeoutOutcome: input.attempt.promptTimeoutOutcome
	});
	const failoverContext = {
		provider: input.activeErrorContext.provider,
		model: input.activeErrorContext.model,
		profileId: input.authProfileId,
		authMode: promptAuthMode,
		sessionId: input.sessionIdUsed,
		lane: input.lane,
		timeout: terminalOutcome.status === "timeout" ? {
			timeoutPhase: terminalOutcome.timeoutPhase,
			providerStarted: terminalOutcome.providerStarted
		} : void 0
	};
	const normalizedPromptFailover = coerceToFailoverError(input.promptError, failoverContext);
	const promptErrorDetails = describeFailoverError(normalizedPromptFailover ?? input.promptError);
	if (normalizedPromptFailover?.suspend) input.suspendForFailure({
		cfg: input.runParams.config,
		agentDir: input.agentDir,
		sessionId: input.suspensionSessionId,
		reason: resolveSessionSuspensionReason(normalizedPromptFailover.reason),
		failedProvider: normalizedPromptFailover.provider ?? input.provider,
		failedModel: normalizedPromptFailover.model ?? input.modelId
	});
	const errorText = promptErrorDetails.message || formatErrorMessage(input.promptError);
	const recordedTerminalStop = isCliTerminalStopCode(promptErrorDetails.code);
	if (!recordedTerminalStop && await input.maybeRefreshRuntimeAuthForAuthError(errorText, input.runtimeAuthRetry)) return {
		action: "retry",
		thinkLevel: input.thinkLevel,
		authRetryPending: true,
		lastRetryFailoverReason: input.previousRetryFailoverReason
	};
	const blockedResult = recordedTerminalStop ? void 0 : resolveBlockedPromptResult(input, errorText);
	if (blockedResult) return blockedResult;
	const promptFailoverReason = promptErrorDetails.reason ?? classifyFailoverReason(errorText, { provider: input.provider });
	const promptProfileFailureReason = input.failover.resolveAuthProfileFailureReason(promptFailoverReason, {
		providerStarted: input.promptErrorSource === "prompt",
		transientRateLimit: promptFailoverReason === "rate_limit" && classifyRateLimitWindow(errorText).kind === "short"
	});
	const promptTimeoutFallbackSafe = input.promptErrorSource === "prompt" && promptFailoverReason === "timeout" && !input.attempt.codexAppServerFailure && input.attempt.promptTimeoutOutcome?.replayInvalid !== true && input.attempt.replayMetadata.replaySafe;
	const failedProfileId = input.authProfileId;
	const logFailoverDecision = createFailoverDecisionLogger({
		stage: "prompt",
		runId: input.runParams.runId,
		rawError: errorText,
		failoverReason: promptFailoverReason,
		profileFailureReason: promptProfileFailureReason,
		provider: input.provider,
		model: input.modelId,
		sourceProvider: input.provider,
		sourceModel: input.modelId,
		profileId: failedProfileId,
		fallbackConfigured: input.fallbackConfigured,
		aborted: input.aborted,
		retryCount: input.failover.transientRetryCount,
		attemptCount: input.traceAttempts.length + 1
	});
	const resolveDecision = (profileRotated) => resolveRunFailoverDecision({
		stage: "prompt",
		externalAbort: input.externalAbort,
		fallbackConfigured: input.fallbackConfigured,
		failoverCode: promptErrorDetails.code,
		failoverFailure: promptFailoverReason !== null,
		failoverReason: promptFailoverReason,
		harnessOwnsTransport: input.pluginHarnessOwnsTransport,
		promptTimeoutFallbackSafe,
		timedOutByRunBudget: input.timedOutByRunBudget,
		profileRotated
	});
	let failoverDecision = resolveDecision(false);
	let rotated = false;
	if (failoverDecision.action === "rotate_profile") {
		if (promptFailoverReason === "rate_limit") rotated = await input.failover.advanceRateLimitAuthProfile({
			failoverProvider: input.provider,
			failoverModel: input.modelId,
			logFallbackDecision: logFailoverDecision
		});
		else rotated = await input.failover.advanceAuthProfile();
		if (!rotated) failoverDecision = resolveDecision(true);
	}
	const markFailedProfilePromise = promptProfileFailureReason ? input.failover.maybeMarkAuthProfileFailure({
		profileId: failedProfileId,
		reason: promptProfileFailureReason,
		modelId: input.modelId
	}).catch((error) => {
		log$3.warn(`prompt profile failure mark failed: ${String(error)}`);
	}) : void 0;
	if (rotated) {
		input.traceAttempts.push({
			provider: input.provider,
			model: input.modelId,
			result: promptFailoverReason === "timeout" ? "timeout" : "rotate_profile",
			...promptFailoverReason ? { reason: promptFailoverReason } : {},
			stage: "prompt"
		});
		const lastRetryFailoverReason = mergeRetryFailoverReason({
			previous: input.previousRetryFailoverReason,
			failoverReason: promptFailoverReason
		});
		logFailoverDecision("rotate_profile", {
			retryCount: input.failover.transientRetryCount,
			profileRotationCount: 1
		});
		return {
			action: "retry",
			thinkLevel: input.getThinkLevel(),
			authRetryPending: false,
			lastRetryFailoverReason
		};
	}
	if (markFailedProfilePromise) await markFailedProfilePromise;
	const fallbackThinking = recordedTerminalStop ? void 0 : pickFallbackThinkingLevel({
		message: errorText,
		attempted: input.attemptedThinking
	});
	if (fallbackThinking) {
		log$3.warn(`unsupported thinking level for ${input.provider}/${input.modelId}; retrying with ${fallbackThinking}`);
		logFailoverDecision("retry_thinking_level", { retryCount: input.failover.transientRetryCount });
		return {
			action: "retry",
			thinkLevel: fallbackThinking,
			authRetryPending: false,
			lastRetryFailoverReason: input.previousRetryFailoverReason
		};
	}
	if (failoverDecision.action === "fallback_model") {
		const fallbackReason = failoverDecision.reason;
		const status = resolveFailoverStatus(fallbackReason, promptErrorDetails.code);
		input.traceAttempts.push({
			provider: input.provider,
			model: input.modelId,
			result: promptFailoverReason === "timeout" ? "timeout" : "fallback_model",
			reason: fallbackReason,
			stage: "prompt",
			...typeof status === "number" ? { status } : {}
		});
		logFailoverDecision("fallback_model", {
			status,
			retryCount: input.failover.transientRetryCount,
			profileRotationCount: 0
		});
		throw (normalizedPromptFailover?.reason === fallbackReason ? normalizedPromptFailover : null) ?? new FailoverError(errorText, {
			...failoverContext,
			reason: fallbackReason,
			provider: input.provider,
			model: input.modelId,
			status
		});
	}
	if (failoverDecision.action === "surface_error") {
		input.traceAttempts.push({
			provider: input.provider,
			model: input.modelId,
			result: promptFailoverReason === "timeout" ? "timeout" : "surface_error",
			...promptFailoverReason ? { reason: promptFailoverReason } : {},
			stage: "prompt"
		});
		logFailoverDecision("surface_error", {
			retryCount: input.failover.transientRetryCount,
			profileRotationCount: 0
		});
	}
	if (failoverContext.timeout) throw normalizedPromptFailover ?? new FailoverError(errorText, {
		...failoverContext,
		reason: "timeout",
		cause: input.promptError
	});
	throw toErrorObject(input.promptError, "Prompt failed");
}
function resolveBlockedPromptResult(input, errorText) {
	let text;
	let errorKind;
	if (/incorrect role information|roles must alternate/i.test(errorText)) {
		text = "Message ordering conflict - please try again. If this persists, use /new to start a fresh session.";
		errorKind = "role_ordering";
	} else {
		const imageSizeError = parseImageSizeError(errorText);
		if (!imageSizeError) return;
		const maxMb = imageSizeError.maxMb;
		const maxMbLabel = typeof maxMb === "number" && Number.isFinite(maxMb) ? `${maxMb}` : null;
		text = `Image too large for the model${maxMbLabel ? ` (max ${maxMbLabel}MB)` : ""}. Please compress or resize the image and try again.`;
		errorKind = "image_size";
	}
	return completeBlockedPromptFailure(input, {
		text,
		errorKind,
		errorMessage: errorText
	});
}
function completeBlockedPromptFailure(input, copy) {
	const replayInvalid = input.resolveReplayInvalid();
	input.setTerminalLifecycleMeta({
		replayInvalid,
		livenessState: "blocked"
	});
	return {
		action: "complete",
		result: buildEmbeddedRunBlockedResult({
			...copy,
			durationMs: Date.now() - input.startedAtMs,
			agentMeta: input.buildErrorAgentMeta(),
			attempt: input.attempt,
			replayInvalid,
			finalPromptText: input.attempt.finalPromptText
		})
	};
}
//#endregion
//#region src/agents/embedded-agent-runner/run/timeout-context-recovery.ts
const MAX_TIMEOUT_COMPACTION_ATTEMPTS = 2;
async function recoverEmbeddedRunTimeout(input) {
	if (!input.genericCompactionRecoveryAllowed || input.contextTokenBudget === void 0 || !input.timedOut || input.signalOwnedInterruption || input.timedOutDuringCompaction || input.timedOutDuringToolExecution || input.timedOutByRunBudget) return false;
	const lastTurnPromptTokens = deriveContextPromptTokens({ lastCallUsage: input.lastRunPromptUsage });
	const tokenUsedRatio = lastTurnPromptTokens != null && input.contextTokenBudget > 0 ? lastTurnPromptTokens / input.contextTokenBudget : 0;
	if (input.state.timeoutCompactionAttempts >= MAX_TIMEOUT_COMPACTION_ATTEMPTS) {
		log$3.warn(`[timeout-compaction] already attempted timeout compaction ${input.state.timeoutCompactionAttempts} time(s); falling through to failover rotation`);
		return false;
	}
	if (tokenUsedRatio <= .65) return false;
	input.assertRecoveryActive();
	const recoveryMarker = markEmbeddedRunRecoveringTimeout({
		sessionId: input.getActiveSession().id,
		runId: input.runParams.runId
	});
	try {
		const timeoutDiagId = createRunRecoveryDiagId();
		input.state.timeoutCompactionAttempts += 1;
		log$3.warn(`[timeout-compaction] LLM timed out with high prompt token usage (${Math.round(tokenUsedRatio * 100)}%); attempting compaction before retry (attempt ${input.state.timeoutCompactionAttempts}/${MAX_TIMEOUT_COMPACTION_ATTEMPTS}) diagId=${timeoutDiagId}`);
		const { result: timeoutCompactResult, previousSessionId } = await compactEmbeddedRunForRecovery(input, {
			tokenBudget: input.contextTokenBudget,
			trigger: "timeout_recovery",
			diagId: timeoutDiagId,
			attempt: input.state.timeoutCompactionAttempts,
			maxAttempts: MAX_TIMEOUT_COMPACTION_ATTEMPTS
		});
		input.assertRecoveryActive();
		await input.runOwnsCompactionAfterHook("timeout recovery", timeoutCompactResult, previousSessionId);
		input.assertRecoveryActive();
		if (!timeoutCompactResult.compacted) {
			if (recoveryMarker) restoreEmbeddedRunTimeoutAbandonment(recoveryMarker);
			log$3.warn(`[timeout-compaction] compaction did not reduce context for ${input.modelSelection.provider}/${input.modelSelection.model}; falling through to normal handling`);
			return false;
		}
		input.runParams.onAutoCompactionSucceeded?.(input.state.autoCompactionCount);
		input.assertRecoveryActive();
		if (timeoutCompactResult.ok && input.contextEngine.info.ownsCompaction === true && input.runParams.sessionPersistence !== "detached") {
			const activeSession = input.getActiveSession();
			await runPostCompactionSideEffects({
				config: input.runParams.config,
				sessionKey: input.runParams.sessionKey,
				sessionId: activeSession.id,
				agentId: input.sessionAgentId,
				sessionFile: activeSession.file,
				assertActive: input.assertRecoveryActive
			});
			input.assertRecoveryActive();
		}
		log$3.info(`[timeout-compaction] compaction succeeded for ${input.modelSelection.provider}/${input.modelSelection.model}; retrying prompt`);
		input.armPostCompactionGuard();
		await input.prepareCompactedTranscriptRetry(input.assertRecoveryActive);
		input.assertRecoveryActive();
		if (recoveryMarker) input.state.retainTimeoutRecoveryMarker(recoveryMarker);
		return true;
	} catch (err) {
		if (recoveryMarker) restoreEmbeddedRunTimeoutAbandonment(recoveryMarker);
		throw err;
	}
}
//#endregion
//#region src/agents/embedded-agent-runner/run/attempt-recovery.ts
async function recoverEmbeddedRunAttempt(input) {
	const { runInput, preparedRuntime, normalizedAttempt, runtimePlan, sessionPromptState, failoverRetryController, compactionRuntime } = input;
	const params = runInput.runParams;
	const runtime = preparedRuntime.snapshot();
	const { attempt, sessionIdUsed, attemptAssistant, currentAttemptAssistant, currentAttemptCompletedAssistant, terminalState, setTerminalLifecycleMeta, attemptCompactionCount, activeErrorContext, resolveReplayInvalidForAttempt, assistantErrorText, canRestartForLiveSwitch } = normalizedAttempt;
	const { aborted, externalAbort, promptError, promptErrorSource, timedOut, timedOutDuringCompaction, timedOutDuringToolExecution, timedOutByRunBudget, idleTimedOut } = projectAgentRunAttemptTerminal(attempt.terminal);
	const terminalInterrupted = isEmbeddedRunTerminalInterrupted(terminalState.outcome);
	const currentAttemptReplaySafe = isCurrentAttemptReplaySafe(attempt);
	const settledEvidence = resolveSettledToolBatchEvidence(attempt);
	const recordRecoveryDecision = (decision, reason) => {
		emitDiagnosticsTimelineEvent({
			type: "mark",
			name: "model.recovery.decision",
			runId: params.runId,
			attributes: {
				decision,
				reason,
				replaySafe: currentAttemptReplaySafe,
				allToolCallsRecorded: settledEvidence.allToolCallsRecorded,
				allToolsProvenSettled: settledEvidence.allToolsProvenSettled,
				parkedCodeModeRun: settledEvidence.parkedCodeModeRun,
				intentionalTermination: settledEvidence.intentionalTermination
			}
		}, { config: params.config });
	};
	const asyncActivity = hasAsyncActivity(attempt.toolMetas);
	const toolsAllowContinuation = !settledEvidence.intentionalTermination && !asyncActivity && !attempt.didSendDeterministicApprovalPrompt;
	const recoveryAssistant = currentAttemptCompletedAssistant ?? attemptAssistant;
	const outputLimitFailure = Boolean(recoveryAssistant && isResponsesOutputLimitToolCallError(recoveryAssistant));
	const canContinueOutputLimit = !runtime.pluginHarnessOwnsTransport && !terminalInterrupted && !promptError && (currentAttemptReplaySafe || settledEvidence.allToolsProvenSettled) && attempt.itemLifecycle.activeCount === 0 && toolsAllowContinuation;
	const canContinueSettledIdleTimeout = idleTimedOut && settledEvidence.allToolsProvenSettled && toolsAllowContinuation;
	const midTurnBatchSettled = settledEvidence.allToolsProvenSettled || settledEvidence.parkedCodeModeRun;
	const canContinueSettledMidTurnOverflow = promptErrorSource === "precheck" && attempt.preflightRecovery?.source === "mid-turn" && midTurnBatchSettled && !asyncActivity;
	const canRecoverSettledToolResults = !runtime.pluginHarnessOwnsTransport && !terminalInterrupted && (!promptError || promptErrorSource === "prompt") && settledEvidence.allToolsProvenSettled && toolsAllowContinuation && !attempt.yieldDetected && !attempt.clientToolCalls;
	const { signalOwnedInterruption } = terminalState;
	const assistantOverflowCandidate = recoveryAssistant?.stopReason === "error" || recoveryAssistant?.stopReason === "length" ? recoveryAssistant : void 0;
	const retry = (updates) => ({
		action: "retry",
		authRetryPending: updates?.authRetryPending ?? false,
		codexAppServerRecoveryRetries: updates?.codexAppServerRecoveryRetries ?? input.codexAppServerRecoveryRetries,
		lastRetryFailoverReason: updates?.lastRetryFailoverReason === void 0 ? input.lastRetryFailoverReason : updates.lastRetryFailoverReason,
		thinkLevel: updates?.thinkLevel ?? runtime.thinkLevel
	});
	const buildAttemptErrorMeta = () => buildErrorAgentMeta({
		sessionId: sessionIdUsed,
		sessionFile: sessionPromptState.sessionFile,
		provider: preparedRuntime.provider,
		model: preparedRuntime.model.id,
		credentialSource: attempt.modelAttempt?.credentialSource,
		...runtime.outerContextTokenMeta,
		usageAccumulator: input.usageAccumulator,
		lastRunPromptUsage: input.lastRunPromptUsage,
		currentAttemptAssistant
	});
	if (promptErrorSource === "hook:before_agent_run" && !terminalInterrupted) {
		recordRecoveryDecision("rejected", "hook_block");
		const errorText = formatErrorMessage(promptError);
		const replayInvalid = resolveReplayInvalidForAttempt();
		setTerminalLifecycleMeta({
			replayInvalid,
			livenessState: "blocked"
		});
		return {
			action: "complete",
			result: buildEmbeddedRunBlockedResult({
				text: errorText,
				errorKind: "hook_block",
				errorMessage: errorText,
				durationMs: Date.now() - runInput.startedAtMs,
				agentMeta: buildAttemptErrorMeta(),
				attempt,
				replayInvalid
			})
		};
	}
	const requestedSelection = shouldSwitchToLiveModel({
		cfg: params.config,
		sessionPersistence: params.sessionPersistence,
		sessionKey: runInput.resolvedSessionKey,
		agentId: params.agentId,
		defaultProvider: DEFAULT_PROVIDER,
		defaultModel: DEFAULT_MODEL,
		currentProvider: preparedRuntime.provider,
		currentModel: preparedRuntime.modelId,
		currentAgentRuntimeOverride: params.agentHarnessRuntimeOverride,
		currentAuthProfileId: preparedRuntime.preferredProfileId,
		currentAuthProfileIdSource: params.authProfileIdSource
	});
	if (currentAttemptReplaySafe && !signalOwnedInterruption && requestedSelection && canRestartForLiveSwitch) {
		await clearLiveModelSwitchPending({
			cfg: params.config,
			sessionKey: runInput.resolvedSessionKey,
			agentId: params.agentId
		});
		log$3.info(`live session model switch requested during active attempt for ${params.sessionId}: ${preparedRuntime.provider}/${preparedRuntime.modelId} -> ${requestedSelection.provider}/${requestedSelection.model}`);
		recordRecoveryDecision("accepted", "live_model_switch");
		throw new LiveSessionModelSwitchError(requestedSelection);
	}
	const assistantSignal = attemptAssistant?.stopReason === "error" ? buildAssistantFailoverSignal(attemptAssistant) : void 0;
	const assistantFailure = assistantSignal ? classifyFailoverSignal(assistantSignal, { providerPlugin: runtime.providerRuntimeHandle?.plugin }) : null;
	const assistantOverflowClassification = assistantOverflowCandidate === attemptAssistant ? assistantFailure : assistantOverflowCandidate?.stopReason === "error" ? classifyFailoverSignal(buildAssistantFailoverSignal(assistantOverflowCandidate), { providerPlugin: runtime.providerRuntimeHandle?.plugin }) : null;
	const failureReason = promptError ? resolveFailoverReasonFromError(promptError, preparedRuntime.provider) : assistantFailure?.kind === "reason" ? assistantFailure.reason : idleTimedOut || attemptAssistant && isRetryableAssistantError(attemptAssistant) && attemptAssistant.diagnostics?.some((diagnostic) => diagnostic.type === "provider_transport_failure") ? "timeout" : null;
	const compactionSelection = resolveCompactionLiveModelSelection({
		current: {
			provider: preparedRuntime.provider,
			model: preparedRuntime.modelId,
			authProfileId: runtime.lastProfileId,
			authProfileIdSource: runtime.lastProfileId && runtime.lastProfileId === preparedRuntime.lockedProfileId ? "user" : "auto"
		},
		requested: currentAttemptReplaySafe ? requestedSelection : void 0
	});
	const commonRecoveryInput = {
		runParams: params,
		state: input.contextRecoveryState,
		contextEngine: input.contextEngine,
		contextTokenBudget: runtime.contextTokenBudget,
		genericCompactionRecoveryAllowed: preparedRuntime.genericCompactionRecoveryAllowed,
		attempt,
		runtimeAuthPlan: runtimePlan.auth,
		resolvedSessionKey: runInput.resolvedSessionKey,
		sessionAgentId: input.sessionAgentId,
		contextEngineAgentId: runInput.contextEngineAgentId,
		agentDir: runInput.agentDir,
		workspaceDir: runInput.workspaceDir,
		modelSelection: compactionSelection,
		harnessRuntime: runtime.agentHarness.id,
		thinkLevel: runtime.thinkLevel,
		resolveContextEnginePluginId: input.resolveContextEnginePluginId,
		buildRuntimeSettings: input.buildRuntimeSettings,
		...compactionRuntime,
		getActiveSession: () => ({
			id: sessionPromptState.sessionId,
			file: sessionPromptState.sessionFile,
			target: sessionPromptState.sessionTarget
		}),
		prepareCompactedTranscriptRetry: sessionPromptState.prepareCompactedTranscriptRetry,
		armPostCompactionGuard: input.armPostCompactionGuard,
		usageAccumulator: input.usageAccumulator
	};
	if ((currentAttemptReplaySafe || canContinueSettledMidTurnOverflow) && await recoverEmbeddedRunTimeout({
		...commonRecoveryInput,
		timedOut,
		signalOwnedInterruption,
		timedOutDuringCompaction,
		timedOutDuringToolExecution,
		timedOutByRunBudget,
		lastRunPromptUsage: input.lastRunPromptUsage
	})) {
		recordRecoveryDecision("accepted", "timeout_recovery");
		return retry();
	}
	const recoveryReason = outputLimitFailure ? "output_limit" : failureReason;
	if (!externalAbort && !terminalState.signalOwnedInterruption && !timedOutByRunBudget && !timedOutDuringCompaction && !timedOutDuringToolExecution && (!terminalInterrupted || !runtime.pluginHarnessOwnsTransport && (currentAttemptReplaySafe || canContinueSettledIdleTimeout)) && !attempt.yieldDetected && !attempt.clientToolCalls && !attempt.codexAppServerFailure && !findCliTerminalStopError(promptError) && (!promptError || promptErrorSource === "prompt") && !isTerminalAssistantError(attemptAssistant) && (!outputLimitFailure || canContinueOutputLimit) && recoveryReason && await failoverRetryController.maybeRetryTransient({
		reason: recoveryReason,
		message: promptError ? formatErrorMessage(promptError) : assistantSignal?.message,
		retryAfterMs: promptError ? resolveRetryAfterMs(formatErrorMessage(promptError), Date.now(), promptError) : assistantSignal?.retryAfterMs,
		maxRetryDelayMs: attempt.providerRetryMaxDelayMs,
		failoverEligible: currentAttemptReplaySafe,
		onRetry: async ({ attempt: retryAttempt, maxRetries, delayMs, reason }) => {
			const event = {
				stream: "run_status",
				data: {
					phase: "retrying",
					message: reason === "rate_limit" || reason === "output_limit" ? `Retrying… ${retryAttempt + 1}/${maxRetries + 1}` : `Provider temporarily unavailable. Retrying in ${Math.ceil(delayMs / 1e3)}s (${retryAttempt}/${maxRetries}).`,
					retryAttempt,
					maxRetries,
					delayMs,
					attempt: retryAttempt + 1,
					maxAttempts: maxRetries + 1,
					reason
				}
			};
			emitAgentEvent({
				runId: params.runId,
				sessionKey: params.sessionKey,
				...event
			});
			await params.onAgentEvent?.(event);
		}
	})) {
		runInput.laneController.throwIfAborted();
		sessionPromptState.markOwnedTranscriptRetry();
		sessionPromptState.continueFromCurrentTranscript({ includeToolFailureInstruction: Boolean(attempt.lastToolError) });
		recordRecoveryDecision("accepted", "transient_retry");
		return retry({ lastRetryFailoverReason: outputLimitFailure ? input.lastRetryFailoverReason : failureReason });
	}
	if (!currentAttemptReplaySafe && !canContinueSettledMidTurnOverflow && !canRecoverSettledToolResults) {
		recordRecoveryDecision("rejected", "replay_unsafe");
		return { action: "proceed" };
	}
	const overflowRecovery = await recoverEmbeddedRunOverflow({
		...commonRecoveryInput,
		aborted,
		signalOwnedInterruption,
		promptError,
		assistantErrorText: currentAttemptCompletedAssistant !== void 0 ? assistantOverflowCandidate?.errorMessage : assistantErrorText,
		assistantOverflowCandidate: assistantOverflowCandidate ? {
			message: assistantOverflowCandidate,
			classification: assistantOverflowClassification
		} : void 0,
		attemptCompactionCount,
		prepareCurrentTranscriptRetry: sessionPromptState.continueFromCurrentTranscript,
		markOwnedTranscriptRetry: sessionPromptState.markOwnedTranscriptRetry
	});
	if (overflowRecovery.action === "retry") {
		recordRecoveryDecision("accepted", "overflow_recovery");
		return retry();
	}
	if (overflowRecovery.action === "surface") {
		recordRecoveryDecision("rejected", "overflow_unrecoverable");
		const replayInvalid = resolveReplayInvalidForAttempt();
		setTerminalLifecycleMeta({
			replayInvalid,
			livenessState: "blocked"
		});
		return {
			action: "complete",
			result: buildEmbeddedRunBlockedResult({
				text: overflowRecovery.userText,
				errorKind: overflowRecovery.kind,
				errorMessage: overflowRecovery.errorText,
				durationMs: Date.now() - runInput.startedAtMs,
				agentMeta: buildAttemptErrorMeta(),
				attempt,
				replayInvalid,
				finalPromptText: attempt.finalPromptText
			})
		};
	}
	if (!currentAttemptReplaySafe) {
		recordRecoveryDecision("rejected", "replay_unsafe");
		return { action: "proceed" };
	}
	const hasCodexAppServerTimeoutOutcome = Boolean(attempt.codexAppServerFailure && (attempt.promptTimeoutOutcome || isEmbeddedRunTimeoutFinal(attempt)));
	if (promptError && promptErrorSource !== "compaction" && attempt.codexAppServerFailure) {
		if (resolveCodexAppServerRecoveryRetry({
			attempt,
			retryAvailable: input.codexAppServerRecoveryRetryAvailable
		}).retry) {
			runInput.laneController.throwIfAborted();
			sessionPromptState.suppressNextUserMessagePersistence = true;
			log$3.warn(`codex app-server replay-safe failure; retrying once failureKind=${attempt.codexAppServerFailure?.kind} runId=${params.runId} sessionId=${params.sessionId}`);
			recordRecoveryDecision("accepted", "harness_retry");
			return retry({ codexAppServerRecoveryRetries: input.codexAppServerRecoveryRetries + 1 });
		}
		if (!hasCodexAppServerTimeoutOutcome) {
			recordRecoveryDecision("rejected", "harness_retry_unavailable");
			throw toErrorObject(promptError, "Prompt failed");
		}
	}
	if (promptError && !terminalInterrupted && promptErrorSource !== "compaction" && !hasCodexAppServerTimeoutOutcome) {
		const promptFailureOutcome = await handleEmbeddedPromptFailure({
			runParams: params,
			attempt,
			promptError,
			promptErrorSource,
			activeErrorContext,
			provider: preparedRuntime.provider,
			modelId: preparedRuntime.modelId,
			authProfileId: runtime.lastProfileId,
			authProfileStore: preparedRuntime.attemptAuthProfileStore,
			sessionIdUsed,
			lane: runInput.globalLane,
			agentDir: runInput.agentDir,
			suspensionSessionId: sessionPromptState.sessionId ?? params.sessionId,
			runtimeAuthRetry: input.runtimeAuthRetry,
			maybeRefreshRuntimeAuthForAuthError: preparedRuntime.maybeRefreshRuntimeAuthForAuthError,
			suspendForFailure: runInput.suspendForFailure,
			resolveReplayInvalid: resolveReplayInvalidForAttempt,
			setTerminalLifecycleMeta,
			buildErrorAgentMeta: buildAttemptErrorMeta,
			startedAtMs: runInput.startedAtMs,
			fallbackConfigured: runInput.fallbackConfigured,
			aborted,
			externalAbort,
			pluginHarnessOwnsTransport: runtime.pluginHarnessOwnsTransport,
			timedOutByRunBudget,
			failover: failoverRetryController,
			attemptedThinking: preparedRuntime.attemptedThinking,
			thinkLevel: runtime.thinkLevel,
			getThinkLevel: () => preparedRuntime.snapshot().thinkLevel,
			traceAttempts: input.traceAttempts,
			previousRetryFailoverReason: input.lastRetryFailoverReason
		});
		if (promptFailureOutcome.action === "complete") {
			recordRecoveryDecision("rejected", "prompt_failure");
			return {
				action: "complete",
				result: promptFailureOutcome.result
			};
		}
		preparedRuntime.setThinkLevel(promptFailureOutcome.thinkLevel);
		recordRecoveryDecision("accepted", "prompt_recovery");
		return retry({
			authRetryPending: promptFailureOutcome.authRetryPending,
			lastRetryFailoverReason: promptFailureOutcome.lastRetryFailoverReason,
			thinkLevel: promptFailureOutcome.thinkLevel
		});
	}
	recordRecoveryDecision("rejected", "no_recovery");
	return { action: "proceed" };
}
//#endregion
//#region src/agents/embedded-agent-runner/run/context-engine-admission.ts
/** Selects the admitted harness host and settles prior context work before beginning its turn. */
async function admitEmbeddedContextEngine(input, harness) {
	const params = input.runParams;
	const ownsContextEngineLogicalTurnLease = params.contextEngineLogicalTurnLease === void 0;
	const contextEngineLogicalTurnLease = params.contextEngineLogicalTurnLease ?? await measureEmbeddedAgentPreparation("context-engine", () => createContextEngineLogicalTurnLease({
		identity: params,
		config: params.config,
		agentDir: input.agentDir,
		workspaceDir: input.workspaceDir
	}), { config: params.config });
	selectContextEngineForTranscriptHost({
		lease: contextEngineLogicalTurnLease,
		host: {
			id: `agent-harness:${harness.id}`,
			label: `agent harness "${harness.id}"`,
			capabilities: harness.contextEngineHostCapabilities ?? []
		},
		operation: "agent-run",
		recorder: params.userTurnTranscriptRecorder
	});
	await drainPendingContextEngineTurnsBeforeRun({
		admission: params.userTurnTranscriptRecorder?.getAdmissionReceipt(),
		isHeartbeat: isHeartbeatLifecycleRunKind(params.bootstrapContextRunKind),
		lease: contextEngineLogicalTurnLease,
		recorder: params.userTurnTranscriptRecorder,
		sessionTarget: params.sessionTarget
	});
	return {
		contextEngine: contextEngineLogicalTurnLease.begin().engine,
		contextEngineLogicalTurnLease,
		ownsContextEngineLogicalTurnLease
	};
}
//#endregion
//#region src/agents/embedded-agent-runner/run/context-recovery-state.ts
function createEmbeddedRunContextRecoveryState() {
	let timeoutRecoveryMarker;
	const state = {
		autoCompactionCount: 0,
		compactionRequestBudget: void 0,
		lastCompactionTokensAfter: void 0,
		currentContextSnapshot: void 0,
		lastContextBudgetStatus: void 0,
		overflowCompactionAttempts: 0,
		timeoutCompactionAttempts: 0,
		toolResultTruncationAttempted: false,
		observeContextAccounting(event) {
			const tokens = event.kind === "compaction" ? event.tokensAfter : event.contextTokens;
			state.currentContextSnapshot = { tokens };
			if (event.kind === "compaction") {
				state.autoCompactionCount += 1;
				state.lastCompactionTokensAfter = tokens;
			} else if (event.successful) {
				state.overflowCompactionAttempts = 0;
				state.toolResultTruncationAttempted = false;
			}
		},
		retainTimeoutRecoveryMarker(marker) {
			timeoutRecoveryMarker = marker;
		},
		restoreTimeoutRecoveryAbandonment() {
			const marker = timeoutRecoveryMarker;
			timeoutRecoveryMarker = void 0;
			return marker ? restoreEmbeddedRunTimeoutAbandonment(marker) : false;
		}
	};
	return state;
}
//#endregion
//#region src/agents/embedded-agent-runner/run/failover-retry-controller.ts
const MAX_TRANSIENT_RETRIES = 8;
const MAX_TRANSIENT_RETRY_TIME_MS = 9e4;
const TRANSIENT_RETRY_BASE_DELAY_MS = 1e3;
const TRANSIENT_RETRY_MAX_DELAY_MS = 3e4;
function resolveTransientRetryDelayMs(params) {
	const remainingMs = params.elapsedMs === void 0 ? Infinity : MAX_TRANSIENT_RETRY_TIME_MS - Math.max(0, params.elapsedMs);
	if (remainingMs <= 0 || params.retryAfterMs === Infinity) return;
	const exponentialMs = Math.min(TRANSIENT_RETRY_MAX_DELAY_MS, TRANSIENT_RETRY_BASE_DELAY_MS * 2 ** Math.max(0, params.retryNumber - 1));
	const jitteredMs = Math.min(TRANSIENT_RETRY_MAX_DELAY_MS, Math.round(exponentialMs * (.5 + Math.random())));
	const retryAfterMs = Number.isFinite(params.retryAfterMs) ? Math.max(0, Math.ceil(params.retryAfterMs ?? 0)) : 0;
	const delayMs = Math.max(jitteredMs, retryAfterMs);
	return delayMs <= remainingMs ? delayMs : void 0;
}
const MAX_OVERLOAD_PROFILE_ROTATIONS = 1;
const MAX_RATE_LIMIT_PROFILE_ROTATIONS = 1;
const RETRY_SLEEP_CHUNK_MS = 864e5;
function createEmbeddedRunFailoverRetryController(input) {
	const { runParams: params, provider, modelId, globalLane, agentDir, fallbackConfigured, profileFailureStore } = input;
	let rateLimitProfileRotations = 0;
	let transientRetryCount = 0;
	let rateLimitSeen = false;
	let transientRetryBudget;
	let transientRetryWindowStartMs = null;
	const resolveProfileFailureReason = (failoverReason, opts) => resolveAuthProfileFailureReason({
		failoverReason,
		providerStarted: opts?.providerStarted,
		transientRateLimit: opts?.transientRateLimit,
		policy: params.authProfileFailurePolicy
	});
	const maybeMarkAuthProfileFailure = async (failure) => {
		const { profileId, reason } = failure;
		if (input.harnessOwnsTransport() && (reason === "auth" || reason === "auth_permanent")) revokeRuntimeAuthMaterializations({
			agentDir,
			provider,
			runtimeOwnerId: input.getRuntimeAuthOwnerId()
		});
		if (params.authProfileStateMode === "read-only" || !reason) return;
		if (input.harnessOwnsTransport() && reason === "timeout") return;
		if (profileId) {
			await markAuthProfileFailure({
				store: profileFailureStore,
				profileId,
				reason,
				cfg: params.config,
				agentDir,
				runId: params.runId,
				modelId: failure.modelId
			});
			return;
		}
		const apiKeyInfo = input.getApiKeyInfo();
		if (apiKeyInfo?.mode !== "api-key" || !isConfigBackedInlineProviderApiKey({
			cfg: params.config,
			provider,
			source: apiKeyInfo.source,
			store: profileFailureStore
		})) return;
		await markInlineProviderApiKeyFailure({
			store: profileFailureStore,
			provider,
			reason,
			cfg: params.config,
			agentDir,
			runId: params.runId,
			modelId: failure.modelId
		});
	};
	return {
		overloadProfileRotationLimit: MAX_OVERLOAD_PROFILE_ROTATIONS,
		get transientRetryCount() {
			return transientRetryCount;
		},
		observeAttempt: (attempt) => {
			transientRetryBudget = attempt.providerRetryMaxRetries;
			if (attempt.hasSuccessfulModelResponse) transientRetryWindowStartMs = null;
		},
		advanceAuthProfile: input.advanceAuthProfile,
		advanceRateLimitAuthProfile: async (context) => {
			if (rateLimitProfileRotations >= MAX_RATE_LIMIT_PROFILE_ROTATIONS && fallbackConfigured) {
				const status = resolveFailoverStatus("rate_limit");
				log$3.warn(`rate-limit profile rotation cap reached for ${sanitizeForLog(provider)}/${sanitizeForLog(modelId)} after ${rateLimitProfileRotations} rotations; escalating to model fallback`);
				context.logFallbackDecision("fallback_model", { status });
				throw new FailoverError("The AI service is temporarily rate-limited. Please try again in a moment.", {
					reason: "rate_limit",
					provider: context.failoverProvider,
					model: context.failoverModel,
					profileId: input.getLastProfileId(),
					sessionId: input.getSessionId(),
					lane: globalLane,
					status
				});
			}
			const rotated = await input.advanceAuthProfile();
			if (rotated) rateLimitProfileRotations += 1;
			return rotated;
		},
		maybeMarkAuthProfileFailure,
		resolveAuthProfileFailureReason: resolveProfileFailureReason,
		recoverThrownHarnessAuthFailure: async (error) => {
			if (!input.harnessOwnsTransport()) return null;
			const failoverReason = resolveFailoverReasonFromError(error, provider);
			if (failoverReason !== "auth" && failoverReason !== "auth_permanent") return null;
			const failedProfileId = input.getLastProfileId();
			const profileFailureReason = resolveProfileFailureReason(failoverReason);
			const rotated = params.authProfileIdSource === "user" && failedProfileId === params.authProfileId ? false : await input.advanceAuthProfile();
			try {
				await maybeMarkAuthProfileFailure({
					profileId: failedProfileId,
					reason: profileFailureReason,
					modelId
				});
			} catch (markError) {
				log$3.warn(`profile failure mark failed: ${String(markError)}`);
			}
			return rotated ? {
				provider,
				model: modelId,
				result: "rotate_profile",
				reason: failoverReason,
				stage: "prompt"
			} : null;
		},
		maybeRetryTransient: async (retry) => {
			const recordDecision = (decision, reason) => emitDiagnosticsTimelineEvent({
				type: "mark",
				name: "model.retry.decision",
				runId: params.runId,
				attributes: {
					decision,
					reason,
					retryCount: transientRetryCount
				}
			}, { config: params.config });
			if (retry.reason !== "rate_limit" && retry.reason !== "overloaded" && retry.reason !== "server_error" && retry.reason !== "timeout" && retry.reason !== "output_limit") {
				recordDecision("rejected", "non_transient");
				return false;
			}
			const rateLimit = retry.reason === "rate_limit";
			if (rateLimit && hasLongWindowRateLimitEvidence(retry.message)) {
				recordDecision("rejected", "long_window_rate_limit");
				return false;
			}
			const retryDelayCapMs = retry.maxRetryDelayMs !== void 0 && Number.isFinite(retry.maxRetryDelayMs) && retry.maxRetryDelayMs > 0 ? retry.maxRetryDelayMs : void 0;
			if (rateLimit && fallbackConfigured && retry.failoverEligible !== false && retryDelayCapMs !== void 0 && retry.retryAfterMs !== void 0 && retry.retryAfterMs > retryDelayCapMs) {
				recordDecision("rejected", "retry_delay_exceeds_cap");
				log$3.warn(`rate-limit retry floor ${retry.retryAfterMs === Infinity ? "exceeds representable time" : `${retry.retryAfterMs}ms`} exceeds retry.provider.maxRetryDelayMs=${retryDelayCapMs} for ${sanitizeForLog(provider)}/${sanitizeForLog(modelId)}; failing over`);
				return false;
			}
			rateLimitSeen ||= rateLimit;
			const retryCount = transientRetryCount;
			const retryBudget = Math.min(transientRetryBudget ?? (rateLimit ? 9 : MAX_TRANSIENT_RETRIES), rateLimitSeen ? 9 : Infinity);
			if (retryCount >= retryBudget) {
				recordDecision("rejected", "retry_budget_exhausted");
				return false;
			}
			const nowMs = Date.now();
			const retryWindowStartMs = transientRetryWindowStartMs ?? nowMs;
			if (retry.reason !== "output_limit") transientRetryWindowStartMs = retryWindowStartMs;
			const delayMs = resolveTransientRetryDelayMs({
				retryNumber: retryCount + 1,
				retryAfterMs: retry.retryAfterMs,
				elapsedMs: rateLimit || retry.reason === "output_limit" ? void 0 : nowMs - retryWindowStartMs
			});
			if (delayMs === void 0) {
				recordDecision("rejected", "retry_delay_unavailable");
				log$3.warn(`transient retry ${retry.retryAfterMs === Infinity ? "floor exceeds representable time" : "window elapsed"} for ${sanitizeForLog(provider)}/${sanitizeForLog(modelId)} after ${transientRetryCount}/${retryBudget} retries; stopping same-model retries`);
				return false;
			}
			log$3.warn(`transient same-model retry ${retryCount + 1}/${retryBudget} for ${sanitizeForLog(provider)}/${sanitizeForLog(modelId)} reason=${retry.reason}: delayMs=${delayMs}`);
			await retry.onRetry?.({
				attempt: retryCount + 1,
				maxRetries: retryBudget,
				delayMs,
				reason: retry.reason
			});
			const closeRetryWait = params.onRetryWait?.(Date.now() + delayMs, params.abortSignal);
			let completed = false;
			try {
				let remainingMs = delayMs;
				while (remainingMs > 0) {
					const chunkMs = Math.min(remainingMs, RETRY_SLEEP_CHUNK_MS);
					await sleepWithAbort(chunkMs, params.abortSignal);
					remainingMs -= chunkMs;
				}
				completed = true;
			} finally {
				if (!completed) recordDecision("rejected", "wait_interrupted");
				closeRetryWait?.(completed);
			}
			recordDecision("accepted", "backoff_completed");
			transientRetryCount += 1;
			return true;
		}
	};
}
//#endregion
//#region src/agents/embedded-agent-runner/run/provider-refusal.ts
function resolveProviderRefusal(message) {
	const refusal = message?.diagnostics?.find((diagnostic) => diagnostic.type === "provider_refusal");
	if (!refusal) return;
	const provider = typeof refusal.details?.provider === "string" ? refusal.details.provider : void 0;
	const category = typeof refusal.details?.category === "string" ? refusal.details.category : void 0;
	if (!provider && !category) return;
	const review = readProviderRefusalReview(refusal.details?.review);
	const nativeThreadId = typeof refusal.details?.nativeThreadId === "string" ? refusal.details.nativeThreadId : void 0;
	const nativeTurnId = typeof refusal.details?.nativeTurnId === "string" ? refusal.details.nativeTurnId : void 0;
	return {
		provider,
		category,
		...review ? { review } : {},
		...nativeThreadId ? { nativeThreadId } : {},
		...nativeTurnId ? { nativeTurnId } : {}
	};
}
//#endregion
//#region src/agents/embedded-agent-runner/run/provider-review-run.ts
/** Owns review admission, one physical attempt, and refusal recording for the logical run. */
function createProviderReviewRun(input) {
	const { run, runtime, session } = input;
	const params = run.runParams;
	const acknowledgment = params.providerReviewAcknowledgment;
	function stop(error) {
		recordModelFallbackStop(error);
		throw error;
	}
	const target = (sessionId) => {
		const current = session.sessionTarget;
		if (!current?.agentId || !current.sessionKey || !current.storePath || !input.assertCurrent) return stop(/* @__PURE__ */ new Error("Provider precaution requires current run authority and session identity"));
		return {
			agentId: current.agentId,
			sessionKey: current.sessionKey,
			storePath: current.storePath,
			sessionId,
			lifecycleRevision: session.sessionWriterFence?.expectedLifecycleRevision ?? run.sessionAdmission?.entry.lifecycleRevision
		};
	};
	const assertCurrent = () => {
		if (!input.assertCurrent) stop(/* @__PURE__ */ new Error("Provider precaution requires current run authority"));
		input.assertCurrent();
	};
	const failure = (cause) => {
		if (!acknowledgment) return;
		let error = cause instanceof Error ? cause : cause === void 0 ? void 0 : new Error("Provider continuation failed", { cause });
		try {
			readProviderReviewAcknowledgment(acknowledgment);
		} catch (revoked) {
			error ??= new Error("Provider continuation stopped; review the current findings before trying again", { cause: revoked });
		}
		if (error) stop(error);
	};
	return {
		async admit() {
			const entry = run.sessionAdmission?.entry;
			const unavailable = entry?.providerReview && resolveSessionWorkStartError(run.resolvedSessionKey, entry, {
				providerReviewAcknowledgment: acknowledgment,
				runId: params.runId
			});
			if (unavailable) stop(new Error(unavailable));
			if (!acknowledgment) return;
			const snapshot = runtime.snapshot();
			try {
				await assertSessionProviderReviewWorkStart({
					target: target(session.sessionId),
					acknowledgment,
					runId: params.runId,
					provider: runtime.provider,
					model: runtime.modelId,
					runtimeId: snapshot.agentHarness.id,
					api: snapshot.effectiveModel.api,
					assertCurrent
				});
			} catch (cause) {
				stop(new Error("Provider review continuation is no longer admitted", { cause }));
			}
		},
		beginAttempt() {
			if (acknowledgment) try {
				claimProviderReviewAttempt(acknowledgment, params.runId);
			} catch (cause) {
				stop(new Error("Provider review continuation cannot start another attempt", { cause }));
			}
		},
		failure,
		async settle(attempt) {
			const assistant = attempt.currentAttemptCompletedAssistant ?? attempt.currentAttemptAssistant;
			const refusal = resolveProviderRefusal(assistant);
			if (refusal?.category === "misalignment" && assistant?.stopReason === "error" && params.sessionPersistence !== "detached") {
				const ownedTarget = target(attempt.sessionIdUsed);
				const snapshot = runtime.snapshot();
				try {
					const recording = {
						target: ownedTarget,
						refusal: {
							runId: params.runId,
							...attempt.runtimeModelSelection ?? {
								provider: runtime.provider,
								model: runtime.modelId
							},
							runtimeId: snapshot.agentHarness.id,
							api: snapshot.effectiveModel.api,
							review: refusal.review,
							nativeThreadId: refusal.nativeThreadId,
							nativeTurnId: refusal.nativeTurnId
						},
						assertCurrent
					};
					if (isIncognitoSessionKey(ownedTarget.sessionKey)) captureAgentRunProviderReview({
						runId: params.runId,
						target: ownedTarget,
						review: createSessionProviderReview({
							sessionId: ownedTarget.sessionId,
							refusal: recording.refusal
						}),
						expectedWriterRunId: session.sessionWriterFence?.expectedWriterRunId ?? params.runId,
						assertCurrent
					});
					else await recordSessionProviderReview(recording);
					assertCurrent();
				} catch (cause) {
					stop(new Error("The provider paused this session, but its findings could not be saved", { cause }));
				} finally {
					try {
						const { clearSessionQueues } = await import("./cleanup-C91gnH4j.mjs");
						assertCurrent();
						clearSessionQueues([ownedTarget.sessionKey, attempt.sessionIdUsed]);
					} catch (cause) {
						stop(new Error("Provider precaution queue settlement did not complete", { cause }));
					}
				}
			}
			if (acknowledgment) {
				const outcome = resolveEmbeddedRunAttemptTerminalOutcome({
					attempt,
					assistant,
					abortSignal: params.abortSignal
				});
				const classification = classifyAgentRunTerminalOutcome(outcome);
				const error = classification === "success" ? void 0 : params.abortSignal?.aborted && params.abortSignal.reason instanceof Error ? params.abortSignal.reason : classification === "cancellation" ? createAgentRunDirectAbortError() : classification === "timeout" ? new FailoverError(outcome.error ?? "Provider continuation timed out", {
					reason: "timeout",
					timeout: {
						timeoutPhase: outcome.timeoutPhase,
						providerStarted: outcome.providerStarted
					}
				}) : /* @__PURE__ */ new Error("Provider continuation failed; review its result before trying again");
				failure(error);
			}
			return refusal;
		},
		finish(result) {
			return acknowledgment ? {
				...result,
				meta: {
					...result.meta,
					modelFallbackStopReason: result.meta.modelFallbackStopReason ?? "provider_review_continuation"
				}
			} : result;
		}
	};
}
//#endregion
//#region src/agents/incognito-system-prompt.ts
const INCOGNITO_SYSTEM_PROMPT = "This chat is incognito; do not store its conversation content in memory files or long-term notes.";
function appendIncognitoSystemPrompt(params) {
	if (!(isIncognitoSessionKey(params.sessionKey) || params.storePath && isIncognitoOpenClawAgentSqlitePath(params.storePath, { agentId: params.agentId }))) return params.extraSystemPrompt;
	const existing = params.extraSystemPrompt?.trim();
	return existing ? `${existing}\n\n${INCOGNITO_SYSTEM_PROMPT}` : INCOGNITO_SYSTEM_PROMPT;
}
//#endregion
//#region src/agents/progress-card-system-prompt.ts
const PROGRESS_CARD_SYSTEM_PROMPT = "Create a card with progress_card only for substantial work with at least two meaningful sequential steps, never for greetings, quick questions, or single-step requests. For measurable work with a known total, prefer a leading progress bar labeled with what is measured and observed completed/total counts; never invent percentages. Update or clear existing cards as needed.";
function isAgentMainSession(params) {
	if (!params.sessionKey) return true;
	return canonicalizeMainSessionAlias({
		cfg: params.config,
		agentId: params.agentId,
		sessionKey: params.sessionKey
	}) === canonicalizeMainSessionAlias({
		cfg: params.config,
		agentId: params.agentId,
		sessionKey: resolveAgentMainSessionKey({
			cfg: params.config,
			agentId: params.agentId
		})
	});
}
/**
* Pairing may change between sessions and embedded attempts because this fragment
* sits below the prompt-cache boundary. Codex pins developer instructions at
* thread creation, so a mid-session pairing change reaches its next thread.
*/
async function appendProgressCardSystemPrompt(params) {
	if (!shouldIncludeProgressCardToolForOpenClawTools({
		agentId: params.agentId,
		agentSessionKey: params.sessionKey,
		config: params.config,
		modelId: params.modelId,
		modelProvider: params.provider,
		runtimeToolAllowlist: params.toolsAllow
	}) || isAgentMainSession(params) || !await hasPairedCardRenderer()) return params.extraSystemPrompt;
	const provider = params.provider.trim().toLowerCase();
	const modelId = params.modelId.trim();
	const authProfileId = params.authProfileId?.trim();
	const modelRef = `${provider}/${modelId}${authProfileId ? `@${authProfileId}` : ""}`;
	if (resolveUtilityModelRefForAgent({
		cfg: params.config ?? {},
		agentId: params.agentId,
		primaryProvider: provider,
		primaryModelRef: modelRef
	}) === modelRef) return params.extraSystemPrompt;
	const existing = params.extraSystemPrompt?.trim();
	return existing ? `${existing}\n\n${PROGRESS_CARD_SYSTEM_PROMPT}` : PROGRESS_CARD_SYSTEM_PROMPT;
}
//#endregion
//#region src/agents/embedded-agent-runner/run/attempt-exec-approval-continuation.ts
function prepareExecApprovalContinuationForAttempt(params) {
	if (!params.promptRange) return {
		prompt: params.prompt,
		transcriptPrompt: params.transcriptPrompt
	};
	const contextWindowTokens = Math.max(1, Math.floor(params.contextTokenBudget ?? params.modelContextWindow ?? params.modelMaxTokens ?? 2e5));
	const maxOutputUtf16Units = resolveLiveToolResultMaxChars({ contextWindowTokens });
	const prompt = resizeExecApprovalContinuationPrompt({
		prompt: params.prompt,
		range: params.promptRange,
		maxOutputUtf16Units
	});
	const transcriptPrompt = params.transcriptPrompt === void 0 ? void 0 : resizeExecApprovalContinuationPrompt({
		prompt: params.transcriptPrompt,
		range: params.transcriptPromptRange ?? params.promptRange,
		maxOutputUtf16Units
	});
	params.userTurnTranscriptRecorder?.replaceTextBeforePersistence?.(transcriptPrompt ?? prompt);
	return {
		prompt,
		transcriptPrompt
	};
}
//#endregion
//#region src/agents/embedded-agent-runner/run/attempt-gateway-tools.ts
/** Prepare Gateway tools once at the shared dispatch boundary, including internal continuations. */
async function withPreparedEmbeddedGatewayTools(attempt, isAttemptCurrent, run) {
	const callerIdentity = createAdmittedGatewayToolCallerIdentity({
		admittedRunContext: attempt.admittedRunContext,
		cronAuthorityCheck: attempt.cronCreatorAuthorityCapability?.isCurrent,
		agentId: attempt.agentId,
		sessionKey: attempt.sessionKey,
		turnSourceChannel: attempt.messageChannel ?? attempt.messageProvider,
		turnSourceLocal: !attempt.messageChannel && !attempt.messageProvider && attempt.cronCreatorAuthorityCapability?.callerOrigin.kind === "local" ? true : void 0,
		turnSourceTo: attempt.currentMessagingTarget ?? attempt.currentChannelId,
		turnSourceAccountId: attempt.agentAccountId,
		turnSourceThreadId: attempt.currentThreadTs
	});
	return withGatewayToolCallerIdentity(callerIdentity, async () => {
		const resolveGatewayContext = getGatewayContextResolver(attempt.admittedRunContext);
		const gateway = resolveGatewayContext?.();
		if (!attempt.disableTools && attempt.sessionPersistence !== "detached" && agentHarnessExposesOpenClawTools(attempt.agentHarnessId) && gateway && !gateway.localEmbedded) {
			const isCurrent = () => isAttemptCurrent() && resolveGatewayContext?.() === gateway;
			attempt.githubPublicationAvailable = await prepareGitHubPublicationAvailability({
				sessionId: attempt.sessionId,
				sessionKey: attempt.sessionKey,
				agentId: attempt.agentId,
				assertCurrent: isCurrent
			});
			if (!isCurrent()) throw new Error("GitHub tool preparation outlived its admitted Gateway run");
		}
		return run();
	});
}
//#endregion
//#region src/agents/embedded-agent-runner/run/auth-store.ts
function resolveAttemptDispatchApiKey(params) {
	if (params.runtimeAuthState) return params.pluginHarnessOwnsTransport ? params.runtimeAuthState.sourceApiKey : void 0;
	return params.apiKeyInfo?.apiKey;
}
function createEmptyAuthProfileStore() {
	return {
		version: 1,
		profiles: {}
	};
}
function createScopedAuthProfileStore(store, profileIds) {
	const profiles = store.profiles ?? {};
	const normalizedProfileIds = (Array.isArray(profileIds) ? profileIds : [profileIds]).map((profileId) => profileId?.trim()).filter((profileId) => Boolean(profileId));
	const scopedProfiles = Object.fromEntries(normalizedProfileIds.flatMap((profileId) => {
		const credential = profiles[profileId];
		return credential ? [[profileId, credential]] : [];
	}));
	const scopedRuntimeExternalProfileIds = (store.runtimeExternalProfileIds ?? []).filter((profileId) => scopedProfiles[profileId]);
	const scopedRuntimePersistedProfileIds = (store.runtimePersistedProfileIds ?? []).filter((profileId) => scopedProfiles[profileId]);
	return Object.keys(scopedProfiles).length > 0 ? {
		version: store.version,
		profiles: scopedProfiles,
		...scopedRuntimePersistedProfileIds.length > 0 ? { runtimePersistedProfileIds: scopedRuntimePersistedProfileIds } : {},
		...scopedRuntimeExternalProfileIds.length > 0 || store.runtimeExternalProfileIdsAuthoritative === true ? { runtimeExternalProfileIds: scopedRuntimeExternalProfileIds } : {},
		...store.runtimeExternalProfileIdsAuthoritative === true ? { runtimeExternalProfileIdsAuthoritative: true } : {}
	} : createEmptyAuthProfileStore();
}
//#endregion
//#region src/agents/embedded-agent-runner/run/backend.ts
/**
* Dispatches embedded attempts to native harness or OpenClaw backend execution.
*/
/** Replaces backend-retained provenance with the exact prepared request fact. */
function resolveRuntimeModelAttempt(runtimePlan) {
	const credentialSource = runtimePlan?.auth.credentialSource;
	return credentialSource ? {
		provider: runtimePlan.resolvedRef.provider,
		model: runtimePlan.resolvedRef.modelId,
		credentialSource
	} : void 0;
}
/**
* Backend bridge for executing one embedded-agent attempt through the selected harness.
*/
async function runEmbeddedAttemptWithBackend(params, nativeSessionRuntime, attachmentMedia = params.media) {
	const assertAdmittedCurrent = params.admittedRunContext ? resolveAdmittedRunActiveAssertion(params.admittedRunContext, params.abortSignal) : void 0;
	const attachmentNote = await prepareAgentWorkspaceAttachments({
		workspaceDir: params.workspaceDir,
		turn: {
			config: params.config,
			media: attachmentMedia,
			timeoutMs: params.timeoutMs,
			abortSignal: params.abortSignal,
			userTurnTranscriptRecorder: params.userTurnTranscriptRecorder
		},
		assertCurrent: () => {
			if (!assertAdmittedCurrent) throw new Error("Workspace attachment preparation requires active admitted run authority");
			assertAdmittedCurrent();
			params.hostCapabilities?.assertActive();
		}
	});
	const result = await runAgentHarnessAttempt(attachmentNote ? {
		...params,
		prompt: `${params.prompt}\n\n${attachmentNote}`,
		transcriptPrompt: params.transcriptPrompt ?? params.prompt
	} : params, nativeSessionRuntime);
	const { modelAttempt: _backendModelAttempt, runtimeModelSelection, requesterContinuationSettled: _backendContinuationSettled, ...attempt } = result;
	const modelAttempt = resolveRuntimeModelAttempt(params.runtimePlan);
	const acceptedSessionSpawns = mergeAcceptedSessionSpawnsForRun(params.admittedRunContext.operationalRunInstance, result.acceptedSessionSpawns);
	return copyCoreTtsAttemptResultProvenance(result, {
		...attempt,
		...acceptedSessionSpawns.length ? { acceptedSessionSpawns } : {},
		...modelAttempt ? { modelAttempt } : {},
		...nativeSessionRuntime && runtimeModelSelection ? { runtimeModelSelection: {
			provider: runtimeModelSelection.provider,
			model: runtimeModelSelection.model
		} } : {}
	});
}
/** Runs one operation-specific settled-turn finalization through the selected harness. */
async function runEmbeddedSettledTurnFinalizationWithBackend(params, settledAttempt, harness) {
	return runAgentHarnessSettledTurnFinalization(params, settledAttempt, harness);
}
//#endregion
//#region src/agents/embedded-agent-runner/run/skill-workshop-attempt-params.ts
function resolveSkillWorkshopAttemptParams(params) {
	return {
		skillWorkshopAutonomousCapture: params.skillWorkshopAutonomousCapture,
		skillWorkshopUpdateProposals: params.skillWorkshopUpdateProposals,
		skillWorkshopProposalOnly: params.skillWorkshopProposalOnly,
		skillWorkshopProposalEnv: params.skillWorkshopProposalEnv,
		skillWorkshopOrigin: params.skillWorkshopOrigin,
		skillWorkshopProposalMutationBudget: params.skillWorkshopProposalMutationBudget,
		skillWorkshopProposalRevision: params.skillWorkshopProposalRevision,
		skillLibraryAuthoring: params.skillLibraryAuthoring
	};
}
//#endregion
//#region src/agents/embedded-agent-runner/run/terminal-retry-state.ts
function createEmbeddedRunTerminalRetryState() {
	return {
		reasoningOnlyAttempts: 0,
		emptyResponseAttempts: 0,
		missingAssistantAttempts: 0,
		compactionContinuationAttempts: 0,
		beforeFinalizeRevisionAttempts: 0
	};
}
//#endregion
//#region src/agents/embedded-agent-runner/run/run-attempt-dispatch.ts
async function prepareAndDispatchEmbeddedRunAttempt(input) {
	const { runInput, preparedRuntime, contextEngine, sessionPromptState, terminalRetryState, provider, modelId } = input;
	const params = runInput.runParams;
	const { workspaceResolution, workspaceDir, bootstrapWorkspaceDir, isCanonicalWorkspace, agentDir, resolvedSessionKey, resolvedToolResultFormat, startupStages, emitStartupStageSummary, lifecycleGeneration } = runInput;
	const { fastModeAutoOnSeconds, fastModeAutoProgressState, fastModeStartedAtMs, maybeAnnounceFastModeAutoOff, notifyAgentEvent, notifyExecutionPhase, notifyRunProgress, notifyToolResult, resolveAttemptFastModeParam } = runInput.progressController;
	const { createAttemptControls } = runInput.laneController;
	const { requestedModelId, expectedHarnessArtifact, nativeModelOwned, authStorage, modelRegistry, attemptAuthProfileStore, lockedProfileId, resolveRunAttemptAuthProfileStore } = preparedRuntime;
	const runtime = preparedRuntime.snapshot();
	const effectiveModel = attachModelProviderRuntimePluginHandle(runtime.effectiveModel, runtime.providerRuntimeHandle);
	await fs.mkdir(workspaceDir, { recursive: true });
	if (!input.startupStagesEmitted) startupStages.mark(EMBEDDED_RUN_ATTEMPT_DISPATCH_STAGE.workspace);
	const prompt = sessionPromptState.activePrompt.override ?? resolveEmbeddedAttemptBasePrompt({
		provider,
		prompt: params.prompt
	});
	const resolvedAttemptApiKey = resolveAttemptDispatchApiKey({
		apiKeyInfo: runtime.apiKeyInfo,
		runtimeAuthState: runtime.runtimeAuthState,
		pluginHarnessOwnsTransport: runtime.pluginHarnessOwnsTransport
	});
	const attemptFastMode = resolveAttemptFastModeParam();
	const existingSessionTarget = sessionPromptState.sessionTarget;
	const resolvedTranscriptTarget = (existingSessionTarget?.sessionKey === resolvedSessionKey || sessionPromptState.sessionTargetAdopted ? existingSessionTarget : void 0) ?? (resolvedSessionKey ? await resolveSessionTranscriptRuntimeTarget({
		agentId: workspaceResolution.agentId,
		sessionId: sessionPromptState.sessionId,
		sessionKey: resolvedSessionKey,
		storePath: resolveSessionStorePathCore(params.config?.session?.store, { agentId: workspaceResolution.agentId })
	}) : void 0);
	const resolvedSessionTarget = resolvedTranscriptTarget || sessionPromptState.sessionTarget ? {
		...sessionPromptState.sessionTarget,
		...resolvedTranscriptTarget,
		...sessionPromptState.sessionWriterFence
	} : void 0;
	await sessionPromptState.settleOwnedTranscriptProjection(resolvedSessionTarget, params.abortSignal);
	const trajectorySessionFile = resolvedSessionTarget?.sessionKey ?? sessionPromptState.sessionFile;
	if (!input.startupStagesEmitted) startupStages.mark(EMBEDDED_RUN_ATTEMPT_DISPATCH_STAGE.prompt);
	const runtimePlan = buildAgentRuntimePlan({
		provider,
		modelId,
		model: effectiveModel,
		modelApi: effectiveModel.api,
		harnessId: runtime.agentHarness.id,
		harnessRuntime: runtime.agentHarness.id,
		preparedAuthPlan: runtime.activePreparedAuthPlan,
		metadataSnapshot: runtime.pluginMetadataSnapshot,
		providerRuntimeHandle: runtime.providerRuntimeHandle,
		config: params.config,
		workspaceDir,
		agentDir,
		agentId: workspaceResolution.agentId,
		thinkingLevel: mapThinkingLevelForProvider(runtime.thinkLevel),
		extraParamsOverride: {
			...params.streamParams,
			fastMode: attemptFastMode
		}
	});
	const trajectoryAttribution = resolveAttemptTrajectoryAttribution({
		model: effectiveModel,
		modelId,
		provider,
		runtimePlan
	});
	const trajectoryRecorder = runtime.agentHarness.id === "codex" && !params.disableTrajectory && params.sessionPersistence !== "detached" ? createTrajectoryRuntimeRecorder({
		cfg: params.config,
		env: process.env,
		runId: params.runId,
		sessionId: sessionPromptState.sessionId,
		sessionKey: resolvedSessionKey,
		sessionFile: trajectorySessionFile,
		...resolvedSessionTarget?.agentId && resolvedSessionTarget.sessionId && resolvedSessionTarget.sessionKey && resolvedSessionTarget.storePath ? { sessionTarget: {
			agentId: resolvedSessionTarget.agentId,
			sessionId: resolvedSessionTarget.sessionId,
			sessionKey: resolvedSessionTarget.sessionKey,
			storePath: resolvedSessionTarget.storePath
		} } : {},
		provider: trajectoryAttribution.provider,
		modelId: trajectoryAttribution.modelId,
		modelApi: trajectoryAttribution.modelApi,
		workspaceDir
	}) : void 0;
	let startupStagesEmitted = input.startupStagesEmitted;
	if (!startupStagesEmitted) {
		startupStages.mark(EMBEDDED_RUN_ATTEMPT_DISPATCH_STAGE.runtimePlan);
		startupStages.mark(EMBEDDED_RUN_ATTEMPT_DISPATCH_STAGE.dispatch);
		notifyExecutionPhase("attempt_dispatch", {
			provider,
			model: modelId
		});
		emitStartupStageSummary(EMBEDDED_RUN_ATTEMPT_DISPATCH_STAGE.dispatch);
		startupStagesEmitted = true;
	}
	const fallbackReason = input.resolveRuntimeFallbackReason();
	recordAdmittedModelRoutingDecision({
		admittedRunContext: params.admittedRunContext,
		abortSignal: params.abortSignal,
		requestedProvider: params.modelRoutingProvenance?.requestedProvider ?? runInput.provider,
		requestedModel: params.modelRoutingProvenance?.requestedModel ?? requestedModelId ?? runInput.modelId,
		selectedProvider: provider,
		selectedModel: modelId,
		selectionMode: runtime.lastProfileId && runtime.lastProfileId === lockedProfileId ? "explicit" : "automatic",
		credentialProfileId: runtime.lastProfileId,
		fallbackSelected: params.modelRoutingProvenance?.stage === "fallback" || Boolean(fallbackReason),
		fallbackReason: params.modelRoutingProvenance?.fallbackReason
	});
	const { sessionId, sessionFile, suppressNextUserMessagePersistence } = sessionPromptState;
	const skipPreparedUserTurnMessage = sessionPromptState.activePrompt.internal;
	const { sessionManager } = params;
	const { nativeSessionRuntime } = preparedRuntime;
	const authProfileStore = resolveRunAttemptAuthProfileStore();
	const toolAuthProfileStore = agentHarnessBuildsOpenClawTools(runtime.agentHarness.id) ? attemptAuthProfileStore : void 0;
	const captureRuntimeArtifact = Boolean(params.onSuccessfulAuthBinding || expectedHarnessArtifact);
	const beforeAgentFinalizeRevisionAttempts = terminalRetryState.beforeFinalizeRevisionAttempts;
	const fallbackActive = modelId !== requestedModelId || Boolean(fallbackReason);
	const attemptContextEngine = nativeModelOwned ? void 0 : contextEngine;
	const authProfileIdSource = runtime.lastProfileId && runtime.lastProfileId === lockedProfileId ? "user" : "auto";
	const attemptAbortController = new AbortController();
	input.setPostCompactionAbortController(attemptAbortController);
	const preparedExecApprovalContinuation = prepareExecApprovalContinuationForAttempt({
		prompt,
		transcriptPrompt: params.transcriptPrompt,
		promptRange: params.execApprovalContinuationPromptRange,
		transcriptPromptRange: params.execApprovalContinuationTranscriptPromptRange,
		contextTokenBudget: runtime.contextTokenBudget,
		modelContextWindow: effectiveModel.contextWindow,
		modelMaxTokens: effectiveModel.maxTokens,
		userTurnTranscriptRecorder: params.userTurnTranscriptRecorder
	});
	if (!params.admittedRunContext) throw new Error("embedded attempt reached dispatch without an admitted run context");
	const admittedRunContext = params.admittedRunContext;
	const assertActiveRun = resolveAdmittedRunActiveAssertion(admittedRunContext, attemptAbortController.signal);
	if (!assertActiveRun) throw new Error("embedded attempt reached dispatch without an active admitted run");
	assertActiveRun();
	const placementSandbox = runtime.pluginHarnessOwnsTransport ? await resolveSessionPlacementSandbox({
		agentId: workspaceResolution.agentId,
		config: params.config,
		sessionId,
		sessionKey: resolvedSessionKey,
		workspaceDir
	}) : null;
	assertActiveRun();
	const pluginWorkspace = runtime.pluginHarnessOwnsTransport ? await resolveAttemptWorkspaceSandbox({
		...params,
		agentId: workspaceResolution.agentId,
		cwd: void 0,
		sessionId,
		sessionKey: resolvedSessionKey,
		workspaceDir,
		placementSandbox
	}) : void 0;
	const promptMedia = pluginWorkspace ? await prepareEmbeddedAttemptPromptExecution({
		attempt: {
			...params,
			model: effectiveModel
		},
		mediaOwnerAgentId: pluginWorkspace.sessionAgentId,
		effectiveFsWorkspaceOnly: pluginWorkspace.effectiveFsWorkspaceOnly,
		effectiveWorkspace: pluginWorkspace.effectiveWorkspace,
		prompt: "",
		sandbox: pluginWorkspace.sandbox,
		skipPromptSubmission: false,
		pluginHarness: true
	}) : {
		images: params.images,
		imageOrder: params.imageOrder,
		media: params.media
	};
	const pluginHarnessPrompt = runtime.pluginHarnessOwnsTransport && params.finalizePromptForResolvedTools ? applyResolvedToolPromptFinalizer({
		prompt: preparedExecApprovalContinuation.prompt,
		activeToolNames: [],
		finalize: params.finalizePromptForResolvedTools
	}) : void 0;
	const pluginSandbox = placementSandbox ?? pluginWorkspace?.sandbox;
	if (params.permissionMode) {
		params.execOverrides ??= {};
		params.execOverrides.mode = resolveSessionPermissionExecMode({ mode: params.permissionMode });
	}
	const incognitoSystemPrompt = appendIncognitoSystemPrompt({
		agentId: workspaceResolution.agentId,
		extraSystemPrompt: params.extraSystemPrompt,
		sessionKey: params.sessionKey,
		storePath: params.sessionTarget?.storePath
	});
	const extraSystemPrompt = await appendProgressCardSystemPrompt({
		agentId: workspaceResolution.agentId,
		authProfileId: runtime.lastProfileId,
		config: params.config,
		extraSystemPrompt: incognitoSystemPrompt,
		modelId,
		provider,
		sessionKey: params.sessionKey,
		toolsAllow: params.toolsAllow
	});
	const gitCoauthorPrompt = resolveSessionGitCoauthorPrompt({
		config: params.config,
		agentId: workspaceResolution.agentId,
		sessionKey: params.sessionKey,
		storePath: params.sessionTarget?.storePath
	});
	let skillsSnapshot = resolveSessionSkillResourceSnapshot(params.skillsSnapshot);
	let skillReferencePaths = pluginSandbox?.readOnlyResourceMounts?.map((mount) => ({
		skillFile: path.join(mount.hostPath, "SKILL.md"),
		readPath: path.posix.join(mount.containerPath, "SKILL.md")
	}));
	if (pluginSandbox?.enabled && !pluginSandbox.readOnlyResourceMounts?.length && skillsSnapshot) {
		const prepared = await prepareEmbeddedSkills({
			assertCurrent: () => {
				attemptAbortController.signal.throwIfAborted();
				assertActiveRun();
			},
			applySkillEnvironment: false,
			includeCodeModeSkills: false,
			attempt: {
				bootstrapWorkspaceDir,
				config: params.config,
				contextTokenBudget: runtime.contextTokenBudget,
				skillsSnapshot,
				toolExecutionAllow: params.toolExecutionAllow
			},
			effectiveWorkspace: workspaceDir,
			sandbox: pluginSandbox,
			sessionAgentId: workspaceResolution.agentId
		});
		skillsSnapshot = {
			...prepared.skillsSnapshotForRun ?? skillsSnapshot,
			prompt: prepared.skillsPrompt
		};
		skillReferencePaths = prepared.skillUsagePaths;
	}
	const attemptControls = createAttemptControls({
		admittedRunContext,
		abortSignal: attemptAbortController.signal,
		onAbort: () => {
			if (!params.abortSignal?.aborted) params.replyOperation?.abortByUser();
		}
	});
	const pluginRefresh = captureAgentPluginRuntimeRefresh();
	const attemptParams = {
		providerReviewAcknowledgment: params.providerReviewAcknowledgment,
		pluginRuntimeRefreshPending: pluginRefresh.isPending,
		registerPluginRuntimeRefreshConsumer: (isCurrent) => {
			if (attemptControls.isCurrent()) pluginRefresh.bindConsumer(() => attemptControls.isCurrent() && isCurrent());
		},
		pluginRuntimeRefreshMessages: params.pluginRuntimeRefreshMessages,
		permissionChange: input.permissionChange,
		admittedRunContext: params.admittedRunContext,
		startedAtMs: runInput.startedAtMs,
		contextEngineAgentId: runInput.contextEngineAgentId,
		...runtime.pluginHarnessOwnsTransport ? { sandbox: pluginSandbox } : {},
		operation: "attempt",
		sessionId,
		sessionKey: resolvedSessionKey,
		conversationRecall: params.conversationRecall,
		promptCacheKey: params.promptCacheKey,
		sandboxSessionKey: params.sandboxSessionKey,
		sandboxAgentId: params.sandboxAgentId,
		trigger: params.trigger,
		terminalReplyExpectation: resolveReplyExpectation(params),
		memoryFlushWritePath: params.memoryFlushWritePath,
		messageChannel: params.messageChannel,
		messageProvider: params.messageProvider,
		clientCaps: params.clientCaps,
		bootstrapUserProfileId: params.bootstrapUserProfileId,
		gatewayUiCommandTarget: params.gatewayUiCommandTarget,
		pinnedWidgetAuthoring: params.pinnedWidgetAuthoring,
		toolBindings: params.toolBindings,
		chatType: params.chatType,
		agentAccountId: params.agentAccountId,
		conversationRoutePeerId: params.conversationRoutePeerId,
		messageTo: params.messageTo,
		messageThreadId: params.messageThreadId,
		conversationToolPolicy: params.conversationToolPolicy,
		messageActionTurnCapability: params.messageActionTurnCapability,
		groupId: params.groupId,
		groupChannel: params.groupChannel,
		groupSpace: params.groupSpace,
		memberRoleIds: params.memberRoleIds,
		spawnedBy: params.spawnedBy,
		isCanonicalWorkspace,
		senderId: params.senderId,
		senderName: params.senderName,
		senderUsername: params.senderUsername,
		senderE164: params.senderE164,
		senderIsOwner: params.senderIsOwner,
		approvalReviewerDeviceId: params.approvalReviewerDeviceId,
		currentChannelId: params.currentChannelId,
		chatId: params.chatId,
		channelContext: params.channelContext,
		currentMessagingTarget: params.currentMessagingTarget,
		currentThreadTs: params.currentThreadTs,
		currentMessageId: params.currentMessageId,
		currentInboundAudio: params.currentInboundAudio,
		replyToMode: params.replyToMode,
		hasRepliedRef: params.hasRepliedRef,
		sessionFile,
		...sessionManager ? { sessionManager } : { sessionTarget: resolvedSessionTarget },
		trajectoryRecorder: trajectoryRecorder ?? void 0,
		...resolveHarnessWorkspace(workspaceDir, params, pluginWorkspace, pluginSandbox),
		bootstrapWorkspaceDir,
		permissionMode: params.permissionMode,
		requireWorkspaceOnly: params.requireWorkspaceOnly,
		requireWritableSandbox: params.requireWritableSandbox,
		agentDir,
		preparedModelRuntime: runInput.preparedModelRuntime,
		config: params.config,
		toolOverrides: params.toolOverrides,
		allowGatewaySubagentBinding: params.allowGatewaySubagentBinding,
		...attemptContextEngine ? {
			contextEngine: attemptContextEngine,
			contextWindowInfo: runtime.contextWindowInfo
		} : {},
		...runtime.contextTokenBudget === void 0 ? {} : { contextTokenBudget: runtime.contextTokenBudget },
		...runtime.modelContextWindow === void 0 ? {} : { modelContextWindow: runtime.modelContextWindow },
		...runtime.authoredContextTokenCap === void 0 ? {} : { authoredContextTokenCap: runtime.authoredContextTokenCap },
		skillsSnapshot,
		prompt: remapSkillReferencePaths(pluginHarnessPrompt ?? preparedExecApprovalContinuation.prompt, skillReferencePaths),
		transcriptPrompt: pluginHarnessPrompt !== void 0 && params.transcriptPrompt === void 0 ? preparedExecApprovalContinuation.prompt : preparedExecApprovalContinuation.transcriptPrompt,
		finalizePromptForResolvedTools: pluginHarnessPrompt === void 0 ? params.finalizePromptForResolvedTools : void 0,
		userTurnTranscriptRecorder: params.userTurnTranscriptRecorder,
		onContextEngineTurnCandidate: params.onContextEngineTurnCandidate,
		skipPreparedUserTurnMessage,
		currentInboundEventKind: params.currentInboundEventKind,
		currentInboundContext: params.currentInboundContext,
		explicitSkillSelections: params.explicitSkillSelections?.map((selection) => ({
			...selection,
			path: remapSkillReferencePaths(selection.path, skillReferencePaths)
		})),
		images: promptMedia.images,
		imageOrder: promptMedia.imageOrder,
		media: promptMedia.media,
		clientTools: params.clientTools,
		disableTools: params.disableTools,
		provider,
		modelId,
		requestedModelId,
		fallbackActive,
		fallbackReason,
		delegationCapability: resolveDelegationCapability({
			fallbackActive,
			inputProvenance: params.inputProvenance,
			disableTools: params.disableTools,
			toolsAllow: params.toolsAllow
		}),
		isFinalFallbackAttempt: params.isFinalFallbackAttempt,
		agentHarnessId: runtime.agentHarness.id,
		agentHarnessRuntimeOverride: runtime.agentHarness.id,
		modelSelectionLocked: params.modelSelectionLocked,
		...nativeSessionRuntime ? { expectedSessionRuntimeOwnership: {
			model: "native",
			auth: nativeSessionRuntime.auth,
			...nativeSessionRuntime.auth === "host" ? { modelRef: nativeSessionRuntime.modelRef } : {}
		} } : {},
		...captureRuntimeArtifact ? { captureRuntimeArtifact: true } : {},
		...expectedHarnessArtifact?.artifact ? { expectedRuntimeArtifact: expectedHarnessArtifact?.artifact } : {},
		...params.sessionKey ? { agentHarnessTaskRuntimeScope: createAgentHarnessTaskRuntimeScope({
			requesterSessionKey: params.sessionKey,
			gatewayContextResolver: getGatewayContextResolver(params.admittedRunContext)
		}) } : {},
		runtimePlan,
		observeToolTerminal: createToolTerminalObserver(params.runId),
		model: applyAuthHeaderOverride(applyLocalNoAuthHeaderOverride(effectiveModel, runtime.apiKeyInfo), runtime.runtimeAuthState !== null ? null : runtime.apiKeyInfo, params.config),
		resolvedApiKey: resolvedAttemptApiKey,
		authProfileId: runtime.lastProfileId,
		authProfileIdSource,
		initialReplayState: input.replayState,
		authStorage,
		authProfileStore,
		toolAuthProfileStore,
		modelRegistry,
		agentId: workspaceResolution.agentId,
		thinkLevel: runtime.thinkLevel,
		onToolOutcome: input.observeToolOutcome,
		isTurnTainted: input.isTurnTainted,
		allocateToolOutcomeOrdinal: input.allocateToolOutcomeOrdinal,
		onToolStreamBoundary: maybeAnnounceFastModeAutoOff,
		onRunProgress: notifyRunProgress,
		fastMode: attemptFastMode,
		fastModeAuto: params.fastMode === "auto",
		...params.fastMode === "auto" ? {
			fastModeStartedAtMs,
			fastModeAutoOnSeconds,
			fastModeAutoProgressState
		} : {},
		verboseLevel: params.verboseLevel,
		reasoningLevel: params.reasoningLevel,
		toolResultFormat: resolvedToolResultFormat,
		toolProgressDetail: params.toolProgressDetail,
		execSession: params.execSession,
		execOverrides: params.execOverrides,
		bashElevated: params.bashElevated,
		timeoutMs: params.timeoutMs,
		runTimeoutOverrideMs: params.runTimeoutOverrideMs,
		runId: params.runId,
		lifecycleGeneration,
		abortSignal: attemptControls.abortSignal,
		onAttemptDeadlineChanged: attemptControls.onAttemptDeadlineChanged,
		onAttemptTimeout: attemptControls.onAttemptTimeout,
		onAttemptAbort: attemptControls.onAttemptAbort,
		replyOperation: params.replyOperation,
		shouldEmitToolResult: params.shouldEmitToolResult,
		shouldEmitToolOutput: params.shouldEmitToolOutput,
		onPartialReply: params.onPartialReply,
		onAssistantMessageStart: params.onAssistantMessageStart,
		onBlockReply: params.onBlockReply,
		onBlockReplyFlush: params.onBlockReplyFlush,
		blockReplyBreak: params.blockReplyBreak,
		blockReplyChunking: params.blockReplyChunking,
		onReasoningStream: params.onReasoningStream,
		streamReasoningInNonStreamModes: params.streamReasoningInNonStreamModes,
		onReasoningEnd: params.onReasoningEnd,
		onToolResult: notifyToolResult,
		onAgentToolResult: params.onAgentToolResult,
		onAgentEvent: notifyAgentEvent,
		deferTerminalLifecycle: params.deferTerminalLifecycle ?? params.deferTerminalLifecycleEnd,
		onDeferredLifecycleOwner: params.onDeferredLifecycleOwner,
		onDeferredLifecycleAbort: params.onDeferredLifecycleAbort,
		onExecutionPhase: params.onExecutionPhase,
		extraSystemPrompt,
		gitCoauthorPrompt,
		sourceReplyDeliveryMode: params.sourceReplyDeliveryMode,
		silentReplyPromptMode: params.silentReplyPromptMode,
		taskSuggestionDeliveryMode: params.taskSuggestionDeliveryMode,
		inputProvenance: params.inputProvenance,
		trustedInternalHandoff: params.trustedInternalHandoff,
		scheduledToolPolicy: params.scheduledToolPolicy,
		runtimePluginToolGrant: params.runtimePluginToolGrant,
		cronCreatorAuthorityCapability: params.cronCreatorAuthorityCapability,
		cronCreatorAuthorityUnavailableReason: params.cronCreatorAuthorityUnavailableReason,
		streamParams: params.streamParams,
		modelRun: params.modelRun,
		disableTrajectory: params.disableTrajectory,
		...resolveSkillWorkshopAttemptParams(params),
		promptMode: params.promptMode,
		ownerNumbers: params.ownerNumbers,
		enforceFinalTag: params.enforceFinalTag,
		silentExpected: params.silentExpected,
		suppressLiveStreamOutput: params.suppressLiveStreamOutput,
		bootstrapContextMode: params.bootstrapContextMode,
		bootstrapContextRunKind: params.bootstrapContextRunKind,
		jobId: params.jobId,
		scheduledRuntimeAuthority: params.scheduledRuntimeAuthority,
		scheduledRuntimeAuthorityRecoveryRequired: params.scheduledRuntimeAuthorityRecoveryRequired,
		toolsAllow: params.toolsAllow,
		toolExecutionAllow: params.toolExecutionAllow,
		toolAuthorityFingerprint: params.toolAuthorityFingerprint,
		sessionPersistence: params.sessionPersistence,
		compactionCountOwner: "caller",
		onContextAccountingEvent: params.onContextAccountingEvent,
		onCompactionRequestBudget: params.onCompactionRequestBudget,
		...params.systemAgentTool ? { systemAgentTool: params.systemAgentTool } : {},
		cleanupBundleMcpOnRunEnd: params.cleanupBundleMcpOnRunEnd,
		oneShotCliRun: params.oneShotCliRun,
		disableMessageTool: params.disableMessageTool,
		swarmCollector: params.swarmCollector,
		swarmOutputSchema: params.swarmOutputSchema,
		forceRestartSafeTools: params.forceRestartSafeTools,
		forceCodeModeTools: params.forceCodeModeTools,
		codeModeOverride: params.codeModeOverride,
		disableToolSearch: params.disableToolSearch,
		sessionReadScopeKey: params.sessionReadScopeKey,
		forceMessageTool: params.forceMessageTool,
		enableHeartbeatTool: params.enableHeartbeatTool,
		forceHeartbeatTool: params.forceHeartbeatTool,
		requireExplicitMessageTarget: params.requireExplicitMessageTarget,
		internalEvents: params.internalEvents,
		runtimeContextFragments: params.runtimeContextFragments,
		bootstrapPromptWarningSignaturesSeen: input.bootstrapPromptWarningSignaturesSeen,
		bootstrapPromptWarningSignature: input.bootstrapPromptWarningSignaturesSeen[input.bootstrapPromptWarningSignaturesSeen.length - 1],
		suppressNextUserMessagePersistence,
		beforeAgentFinalizeRevisionAttempts,
		maxBeforeAgentFinalizeRevisions: 3,
		suppressTranscriptOnlyAssistantPersistence: params.suppressTranscriptOnlyAssistantPersistence,
		assistantErrorTranscript: params.assistantErrorTranscript,
		onUserMessagePersisted: sessionPromptState.onUserMessagePersisted,
		onUserMessagePersistenceInvalidated: () => {
			sessionPromptState.activePrompt.persisted = false;
		},
		prepareAssistantTranscriptMessage: params.prepareAssistantTranscriptMessage
	};
	const rawAttempt = await withPreparedEmbeddedGatewayTools(attemptParams, attemptControls.isCurrent, () => runEmbeddedAttemptWithBackend(attemptParams, nativeSessionRuntime, params.media)).catch((err) => {
		throw input.getPostCompactionAbortError() ?? err;
	}).finally(() => {
		attemptControls.close();
		input.clearPostCompactionAbortController(attemptAbortController);
	});
	const postCompactionAbortError = input.getPostCompactionAbortError();
	if (postCompactionAbortError) throw postCompactionAbortError;
	return {
		dispatchedAttempt: {
			rawAttempt,
			preparedAttempt: attemptParams
		},
		runtimePlan,
		startupStagesEmitted
	};
}
//#endregion
//#region src/agents/embedded-agent-runner/run/run-settlement.ts
/** Publishes committed run accounting before retiring its runtime resources. */
async function settleEmbeddedRun(input) {
	const { runInput, runtime, compaction, ownedContextEngineLease } = input;
	const params = runInput.runParams;
	const committed = compaction.session.committedCompactionSuccessor;
	const originalWriter = compaction.session.sessionWriterFence;
	const target = committed?.sessionTarget ?? compaction.originalTarget;
	const counts = {
		count: compaction.state.autoCompactionCount,
		currentContextSnapshot: compaction.state.currentContextSnapshot ?? (compaction.state.autoCompactionCount > 0 ? { tokens: void 0 } : void 0)
	};
	const fact = compaction.durable && (committed || originalWriter) && target.agentId && target.sessionId && target.sessionKey && target.storePath ? {
		kind: "durable",
		...counts,
		...committed?.previousSessionId !== void 0 ? { previousSessionId: committed.previousSessionId } : {},
		target: {
			agentId: target.agentId,
			sessionId: committed?.entry.sessionId ?? target.sessionId,
			sessionKey: target.sessionKey,
			storePath: target.storePath,
			lifecycleRevision: committed ? committed.entry.lifecycleRevision : originalWriter?.expectedLifecycleRevision,
			activeWriterRunId: committed ? committed.entry.activeWriterRunId : originalWriter?.expectedWriterRunId
		}
	} : counts.count > 0 || counts.currentContextSnapshot ? {
		kind: "presentation-only",
		...counts
	} : void 0;
	if (params.onCompactionAccounting) params.onCompactionAccounting(fact);
	else if (fact?.kind === "durable" && fact.count > 0) try {
		await incrementCompactionCount({
			...fact.target,
			expectedSession: fact.target,
			amount: fact.count,
			tokensAfter: fact.currentContextSnapshot?.tokens,
			authorize: () => compaction.authority !== void 0 && getAdmittedRunDelegatedAuthority(runtime.admittedRunContext) === compaction.authority
		});
	} catch (error) {
		log$3.warn(`compaction accounting failed: ${formatErrorMessage(error)}`);
	}
	if (params.isFinalFallbackAttempt !== false) await runInput.progressController.maybeEmitFastModeAutoResetBestEffort();
	forgetPromptBuildDrainCacheForRun(params.runId);
	clearProviderPromptState(params.runId);
	runtime.stopRuntimeAuthRefreshTimer();
	await ownedContextEngineLease?.dispose();
	if (params.cleanupBundleMcpOnRunEnd === true) await runAgentCleanupStep({
		runId: params.runId,
		sessionId: params.sessionId,
		step: "bundle-mcp-retire",
		log: log$3,
		cleanup: async () => {
			const onError = (errorLocal, sessionId) => {
				recordAgentCleanupFailure();
				log$3.warn(`bundle-mcp cleanup failed after run for ${sessionId}: ${formatErrorMessage(errorLocal)}`);
			};
			for (const sessionId of /* @__PURE__ */ new Set([params.sessionId, compaction.session.sessionId])) if (sessionId) await retireSessionMcpRuntime({
				sessionId,
				reason: "embedded-run-end",
				preserveActiveLeases: true,
				onError
			});
		}
	});
}
//#endregion
//#region src/agents/runtime-auth-refresh.ts
/**
* Runtime auth refresh timer helper.
*
* Clamps refresh deadlines before they are passed to setTimeout.
*/
/** Clamp an auth refresh deadline to a safe setTimeout delay. */
function clampRuntimeAuthRefreshDelayMs(params) {
	return resolveSafeTimeoutDelayMs(params.refreshAt - params.now, { minMs: params.minDelayMs });
}
//#endregion
//#region src/agents/embedded-agent-runner/run/auth-controller.ts
/** Decides whether one automatic profile may bypass its current cooldown. */
function resolveEmbeddedAuthCooldownProbePolicy(params) {
	const autoProfileCandidates = params.profileCandidates.filter((candidate) => typeof candidate === "string" && candidate.length > 0 && candidate !== params.lockedProfileId);
	const allAutoProfilesInCooldown = autoProfileCandidates.length > 0 && autoProfileCandidates.every((candidate) => isProfileInCooldown(params.authStore, candidate, void 0, params.modelId));
	const unavailableReason = allAutoProfilesInCooldown ? resolveProfilesUnavailableReason({
		store: params.authStore,
		profileIds: autoProfileCandidates
	}) ?? "unknown" : null;
	const probeProfileIds = /* @__PURE__ */ new Set();
	if (params.allowTransientCooldownProbe && allAutoProfilesInCooldown && shouldUseTransientCooldownProbeSlot(unavailableReason)) for (const candidate of autoProfileCandidates) {
		const candidateReason = resolveProfilesUnavailableReason({
			store: params.authStore,
			profileIds: [candidate]
		}) ?? "unknown";
		if (shouldUseTransientCooldownProbeSlot(candidateReason)) probeProfileIds.add(candidate);
	}
	return {
		probeProfileIds,
		unavailableReason
	};
}
/**
* Coordinates auth profile selection, runtime auth preparation/refresh, and
* profile failover for one embedded run. Runtime snapshots and auth refreshes
* share this state so profile rotation cannot leave either with stale credentials.
*/
function createEmbeddedRunAuthController(params) {
	const { state } = params;
	const baseRuntimeModel = state.models.runtime;
	const baseEffectiveModel = state.models.effective;
	const commitPreparedModel = (preparedModel) => {
		preparedModel?.commit();
		if (preparedModel?.authRequirement) return;
		state.models.runtime = baseRuntimeModel;
		state.models.effective = baseEffectiveModel;
	};
	const applyPreparedRuntimeRequestOverrides = (paramsForApply) => {
		const runtimeModel = applyPreparedRuntimeAuthToModel(paramsForApply.runtimeModel, paramsForApply.preparedAuth);
		if (runtimeModel === paramsForApply.runtimeModel) return;
		state.models.runtime = runtimeModel;
		state.models.effective = applyPreparedRuntimeAuthToModel(state.models.effective, paramsForApply.preparedAuth);
	};
	const hasRefreshableRuntimeAuth = () => Boolean(state.runtimeAuthState?.sourceApiKey.trim());
	const nextRuntimeAuthGeneration = () => (state.runtimeAuthState?.generation ?? 0) + 1;
	const prepareRuntimeAuthForModel = async (prepareParams) => {
		const preparedAuth = await prepareProviderRuntimeAuth({
			provider: prepareParams.runtimeModel.provider,
			config: params.config,
			workspaceDir: params.workspaceDir,
			env: process.env,
			context: {
				config: params.config,
				agentDir: params.agentDir,
				workspaceDir: params.workspaceDir,
				env: process.env,
				provider: prepareParams.runtimeModel.provider,
				modelId: params.modelId,
				model: prepareParams.runtimeModel,
				apiKey: unwrapSecretSentinelsForProviderEgress(prepareParams.apiKey, "provider runtime auth exchange"),
				authMode: prepareParams.authMode,
				profileId: prepareParams.profileId
			}
		});
		return protectPreparedProviderRuntimeAuth({
			provider: prepareParams.runtimeModel.provider,
			preparedAuth
		});
	};
	const clearRuntimeAuthRefreshTimer = () => {
		const runtimeAuthState = state.runtimeAuthState;
		if (!runtimeAuthState?.refreshTimer) return;
		clearTimeout(runtimeAuthState.refreshTimer);
		runtimeAuthState.refreshTimer = void 0;
	};
	const stopRuntimeAuthRefreshTimer = () => {
		if (!state.runtimeAuthState) return;
		state.runtimeAuthRefreshCancelled = true;
		clearRuntimeAuthRefreshTimer();
	};
	const refreshRuntimeAuth = async (reason) => {
		const runtimeAuthState = state.runtimeAuthState;
		if (!runtimeAuthState) return;
		if (runtimeAuthState.refreshInFlight) {
			await runtimeAuthState.refreshInFlight;
			return;
		}
		const refreshGeneration = runtimeAuthState.generation;
		const refreshProfileId = runtimeAuthState.profileId;
		const refreshPromise = (async () => {
			const currentRuntimeAuthState = state.runtimeAuthState;
			const sourceApiKey = currentRuntimeAuthState?.sourceApiKey.trim() ?? "";
			if (!sourceApiKey) throw new Error(`Runtime auth refresh requires a source credential.`);
			const runtimeModel = state.models.runtime;
			params.log.debug(`Refreshing runtime auth for ${runtimeModel.provider} (${reason})...`);
			const preparedAuth = await prepareRuntimeAuthForModel({
				runtimeModel,
				apiKey: sourceApiKey,
				authMode: currentRuntimeAuthState?.authMode ?? "unknown",
				profileId: currentRuntimeAuthState?.profileId
			});
			if (!preparedAuth?.apiKey) throw new Error(`Provider "${runtimeModel.provider}" does not support runtime auth refresh.`);
			const activeRuntimeAuthState = state.runtimeAuthState;
			if (!activeRuntimeAuthState || activeRuntimeAuthState.generation !== refreshGeneration || activeRuntimeAuthState.profileId !== refreshProfileId || activeRuntimeAuthState.sourceApiKey.trim() !== sourceApiKey) {
				params.log.debug(`Ignoring stale runtime auth refresh for ${runtimeModel.provider}; auth state advanced before ${reason} refresh completed.`);
				return;
			}
			params.authStorage.setRuntimeApiKey(runtimeModel.provider, preparedAuth.apiKey);
			applyPreparedRuntimeRequestOverrides({
				runtimeModel,
				preparedAuth
			});
			state.runtimeAuthState = {
				...activeRuntimeAuthState,
				expiresAt: preparedAuth.expiresAt
			};
			if (preparedAuth.expiresAt) {
				const remaining = preparedAuth.expiresAt - Date.now();
				params.log.debug(`Runtime auth refreshed for ${runtimeModel.provider}; expires in ${Math.max(0, Math.floor(remaining / 1e3))}s.`);
			}
		})().catch((err) => {
			const runtimeModel = state.models.runtime;
			params.log.warn(`Runtime auth refresh failed for ${runtimeModel.provider}: ${formatErrorMessage(err)}`);
			throw err;
		}).finally(() => {
			const activeState = state.runtimeAuthState;
			if (activeState && activeState.generation === refreshGeneration && activeState.refreshInFlight === refreshPromise) activeState.refreshInFlight = void 0;
		});
		runtimeAuthState.refreshInFlight = refreshPromise;
		await refreshPromise;
	};
	const scheduleRuntimeAuthRefresh = () => {
		const runtimeAuthState = state.runtimeAuthState;
		if (!runtimeAuthState || state.runtimeAuthRefreshCancelled) return;
		const runtimeModel = state.models.runtime;
		if (!hasRefreshableRuntimeAuth()) {
			params.log.warn(`Skipping runtime auth refresh scheduling for ${runtimeModel.provider}; source credential missing.`);
			return;
		}
		if (!runtimeAuthState.expiresAt) return;
		clearRuntimeAuthRefreshTimer();
		const now = Date.now();
		const delayMs = clampRuntimeAuthRefreshDelayMs({
			refreshAt: runtimeAuthState.expiresAt - RUNTIME_AUTH_REFRESH_MARGIN_MS,
			now,
			minDelayMs: RUNTIME_AUTH_REFRESH_MIN_DELAY_MS
		});
		const timer = setTimeout(() => {
			if (state.runtimeAuthRefreshCancelled) return;
			refreshRuntimeAuth("scheduled").then(() => scheduleRuntimeAuthRefresh()).catch(() => {
				if (state.runtimeAuthRefreshCancelled) return;
				const retryTimer = setTimeout(() => {
					if (state.runtimeAuthRefreshCancelled) return;
					refreshRuntimeAuth("scheduled-retry").then(() => scheduleRuntimeAuthRefresh()).catch(() => void 0);
				}, RUNTIME_AUTH_REFRESH_RETRY_MS);
				const activeRuntimeAuthState = state.runtimeAuthState;
				if (activeRuntimeAuthState) activeRuntimeAuthState.refreshTimer = retryTimer;
				if (state.runtimeAuthRefreshCancelled && activeRuntimeAuthState) {
					clearTimeout(retryTimer);
					activeRuntimeAuthState.refreshTimer = void 0;
				}
			});
		}, delayMs);
		runtimeAuthState.refreshTimer = timer;
		if (state.runtimeAuthRefreshCancelled) {
			clearTimeout(timer);
			runtimeAuthState.refreshTimer = void 0;
		}
	};
	const resolveAuthProfileFailoverReason = (failoverParams) => {
		if (failoverParams.allInCooldown) {
			const profileIds = (failoverParams.profileIds ?? params.profileCandidates).filter((id) => typeof id === "string" && id.length > 0);
			return resolveProfilesUnavailableReason({
				store: params.authStore,
				profileIds
			}) ?? "unknown";
		}
		return classifyFailoverReason(failoverParams.message, { provider: params.provider }) ?? "auth";
	};
	const recordOAuthRefreshFailure = async (candidate, error) => {
		if (!(error instanceof OAuthRefreshFailureError)) return;
		const profileId = error.profileId ?? candidate;
		const provider = error.provider || params.provider;
		const errorText = formatErrorMessage(error);
		params.log.warn(`auth profile "${profileId ?? "(unknown)"}" failed for provider "${provider}": ${errorText}`);
		if (!profileId || params.authProfileStateMode === "read-only") return;
		const reason = resolveAuthProfileFailureReason({
			failoverReason: resolveAuthProfileFailoverReason({
				allInCooldown: false,
				message: errorText
			}),
			policy: params.authProfileFailurePolicy
		});
		if (!reason) return;
		try {
			await markAuthProfileFailure({
				store: params.authStore,
				profileId,
				reason,
				cfg: params.config,
				agentDir: params.agentDir,
				runId: params.runId,
				modelId: params.modelId
			});
		} catch (markError) {
			params.log.warn(`auth profile "${profileId}" failure bookkeeping failed for provider "${provider}": ${formatErrorMessage(markError)}`);
		}
	};
	const throwAuthProfileFailover = (failoverParams) => {
		const provider = params.provider;
		const modelId = params.modelId;
		const messageForReason = failoverParams.message?.trim() || (failoverParams.error ? formatErrorMessage(failoverParams.error).trim() : "");
		const code = failoverParams.error ? getFailoverErrorCode(failoverParams.error) : void 0;
		const reason = resolveAuthProfileFailoverReason({
			allInCooldown: failoverParams.allInCooldown,
			message: messageForReason,
			profileIds: params.profileCandidates
		});
		const message = failoverParams.message?.trim() || (code === "selected_auth_profile_unavailable" ? messageForReason : void 0) || renderAuthProfileFailoverCopy({
			reason,
			provider,
			allInCooldown: failoverParams.allInCooldown,
			causeText: failoverParams.error ? formatErrorMessage(failoverParams.error).trim() : void 0,
			recoveryHint: buildProviderAuthRecoveryHint({
				provider,
				config: params.config,
				workspaceDir: params.workspaceDir,
				env: process.env
			})
		});
		if (params.fallbackConfigured) {
			const authMode = reason === "billing" || reason === "auth" || reason === "auth_permanent" || reason === "session_expired" ? resolveSubscriptionAuthModeForProfiles({
				store: params.authStore,
				profileIds: failoverParams.allInCooldown ? params.profileCandidates : [params.profileCandidates[state.profileIndex]]
			}) : void 0;
			throw new FailoverError(message, {
				reason,
				provider,
				model: modelId,
				authMode,
				status: resolveFailoverStatus(reason, code),
				code,
				authProfileFailure: { allInCooldown: failoverParams.allInCooldown },
				cause: failoverParams.error
			});
		}
		if (failoverParams.error instanceof Error) throw failoverParams.error;
		throw new Error(message);
	};
	const resolveApiKeyForCandidate = async (candidate, model = state.models.runtime, allowAuthProfileFallback) => {
		return getApiKeyForModelCore({
			model,
			cfg: params.config,
			profileId: candidate,
			store: params.authStore,
			agentDir: params.agentDir,
			workspaceDir: params.workspaceDir,
			lockedProfile: candidate != null && candidate === params.lockedProfileId,
			allowAuthProfileFallback,
			secretSentinels: true
		});
	};
	const applyApiKeyInfo = async (candidate, attemptIndex) => {
		const preparedModel = await params.prepareModelForAuthProfile?.(candidate, attemptIndex);
		const apiKeyInfo = await resolveApiKeyForCandidate(candidate, preparedModel?.runtimeModel, preparedModel?.allowAuthProfileFallback);
		if (preparedModel?.authRequirement && !providerModelRouteAcceptsAuthMode({
			requirement: preparedModel.authRequirement,
			mode: apiKeyInfo.mode ?? (apiKeyInfo.apiKey ? "api-key" : void 0)
		})) throw new Error(`Resolved ${apiKeyInfo.mode ?? "unknown"} credentials are incompatible with the selected ${preparedModel.authRequirement} route for ${preparedModel.runtimeModel.provider}.`);
		state.apiKeyInfo = apiKeyInfo;
		const resolvedProfileId = apiKeyInfo.profileId ?? candidate;
		if (!apiKeyInfo.apiKey) {
			if (apiKeyInfo.mode !== "aws-sdk") {
				const runtimeModel = preparedModel?.runtimeModel ?? state.models.runtime;
				throw new MissingProviderAuthError(runtimeModel.provider, apiKeyInfo);
			}
			commitPreparedModel(preparedModel);
			const runtimeModel = state.models.runtime;
			const AWS_SDK_AUTH_SENTINEL = "__aws_sdk_auth__";
			try {
				const preparedAuth = await prepareRuntimeAuthForModel({
					runtimeModel,
					apiKey: AWS_SDK_AUTH_SENTINEL,
					authMode: apiKeyInfo.mode,
					profileId: apiKeyInfo.profileId
				});
				applyPreparedRuntimeRequestOverrides({
					runtimeModel,
					preparedAuth: preparedAuth ?? {}
				});
				if (preparedAuth?.apiKey) {
					clearRuntimeAuthRefreshTimer();
					params.authStorage.setRuntimeApiKey(runtimeModel.provider, preparedAuth.apiKey);
					state.runtimeAuthState = {
						generation: nextRuntimeAuthGeneration(),
						sourceApiKey: AWS_SDK_AUTH_SENTINEL,
						authMode: apiKeyInfo.mode,
						profileId: resolvedProfileId,
						expiresAt: preparedAuth.expiresAt
					};
					if (preparedAuth.expiresAt) scheduleRuntimeAuthRefresh();
					state.lastProfileId = resolvedProfileId;
					return;
				}
			} catch (error) {
				params.log.warn(`prepareProviderRuntimeAuth failed for ${runtimeModel.provider}, falling back to sentinel: ${formatErrorMessage(error)}`);
			}
			clearRuntimeAuthRefreshTimer();
			params.authStorage.setRuntimeApiKey(runtimeModel.provider, AWS_SDK_AUTH_SENTINEL);
			state.runtimeAuthState = null;
			state.lastProfileId = resolvedProfileId;
			return;
		}
		commitPreparedModel(preparedModel);
		let runtimeAuthHandled = false;
		const runtimeModel = state.models.runtime;
		const preparedAuth = await prepareRuntimeAuthForModel({
			runtimeModel,
			apiKey: apiKeyInfo.apiKey,
			authMode: apiKeyInfo.mode,
			profileId: apiKeyInfo.profileId
		});
		applyPreparedRuntimeRequestOverrides({
			runtimeModel,
			preparedAuth: preparedAuth ?? {}
		});
		if (preparedAuth?.apiKey) {
			clearRuntimeAuthRefreshTimer();
			params.authStorage.setRuntimeApiKey(runtimeModel.provider, preparedAuth.apiKey);
			state.runtimeAuthState = {
				generation: nextRuntimeAuthGeneration(),
				sourceApiKey: apiKeyInfo.apiKey,
				authMode: apiKeyInfo.mode,
				profileId: apiKeyInfo.profileId,
				expiresAt: preparedAuth.expiresAt
			};
			if (preparedAuth.expiresAt) scheduleRuntimeAuthRefresh();
			runtimeAuthHandled = true;
		}
		if (!runtimeAuthHandled) {
			clearRuntimeAuthRefreshTimer();
			params.authStorage.setRuntimeApiKey(runtimeModel.provider, apiKeyInfo.apiKey);
			state.runtimeAuthState = null;
		}
		state.lastProfileId = apiKeyInfo.profileId;
	};
	const advanceAuthProfile = async () => {
		let nextIndex = state.profileIndex + 1;
		while (nextIndex < params.profileCandidates.length) {
			const candidateIndex = nextIndex++;
			const candidate = params.profileCandidates[candidateIndex];
			state.profileIndex = candidateIndex;
			if (candidate && isProfileInCooldown(params.authStore, candidate, void 0, params.modelId)) continue;
			try {
				await applyApiKeyInfo(candidate, candidateIndex);
				state.thinkLevel = params.initialThinkLevel;
				params.attemptedThinking.clear();
				return true;
			} catch (err) {
				if (err instanceof SecretSurfaceUnavailableError) throw err;
				await recordOAuthRefreshFailure(candidate, err);
			}
		}
		state.profileIndex = params.profileCandidates.length;
		return false;
	};
	const initializeAuthProfile = async () => {
		try {
			const modelId = params.modelId;
			const cooldownProbePolicy = resolveEmbeddedAuthCooldownProbePolicy({
				authStore: params.authStore,
				profileCandidates: params.profileCandidates,
				lockedProfileId: params.lockedProfileId,
				modelId,
				allowTransientCooldownProbe: params.allowTransientCooldownProbe
			});
			let didTransientCooldownProbe = false;
			while (state.profileIndex < params.profileCandidates.length) {
				const candidate = params.profileCandidates[state.profileIndex];
				if (candidate && isProfileInCooldown(params.authStore, candidate, void 0, modelId)) {
					if (!didTransientCooldownProbe && cooldownProbePolicy.probeProfileIds.has(candidate)) {
						didTransientCooldownProbe = true;
						params.log.warn(`probing cooldowned auth profile for ${params.provider}/${modelId} due to ${cooldownProbePolicy.unavailableReason ?? "transient"} unavailability`);
					} else {
						state.profileIndex += 1;
						continue;
					}
				}
				await applyApiKeyInfo(params.profileCandidates[state.profileIndex], state.profileIndex);
				break;
			}
			if (state.profileIndex >= params.profileCandidates.length) throwAuthProfileFailover({ allInCooldown: true });
		} catch (err) {
			if (err instanceof FailoverError || err instanceof SecretSurfaceUnavailableError) throw err;
			await recordOAuthRefreshFailure(params.profileCandidates[state.profileIndex], err);
			if (!await advanceAuthProfile()) throwAuthProfileFailover({
				allInCooldown: false,
				error: err
			});
		}
	};
	const maybeRefreshRuntimeAuthForAuthError = async (errorText, retried) => {
		if (!state.runtimeAuthState || retried) return false;
		if (!isFailoverErrorMessage(errorText, { provider: params.provider })) return false;
		if (classifyFailoverReason(errorText, { provider: params.provider }) !== "auth") return false;
		try {
			await refreshRuntimeAuth("auth-error");
			scheduleRuntimeAuthRefresh();
			return true;
		} catch {
			return false;
		}
	};
	return {
		applyAuthProfileCandidate: applyApiKeyInfo,
		advanceAuthProfile,
		initializeAuthProfile,
		maybeRefreshRuntimeAuthForAuthError,
		stopRuntimeAuthRefreshTimer
	};
}
//#endregion
//#region src/agents/embedded-agent-runner/run/auth-plan.ts
function loadEmbeddedRunAuthProfileStore(params) {
	return ensureAuthProfileStore(params.agentDir, {
		migrationProvider: params.provider,
		profileId: params.profileId,
		config: params.config,
		externalCliProviderIds: params.externalCliProviderIds,
		allowKeychainPrompt: false
	});
}
async function prepareEmbeddedRunAuthPlan(params) {
	const runParams = params.runParams;
	const usesOpenAIAuthRouting = params.provider === OPENAI_PROVIDER_ID;
	const initialPluginHarnessOwnsTransport = params.getAgentHarness().id !== "openclaw";
	const openClawNativeCodexResponsesNeedsAuthBootstrap = !initialPluginHarnessOwnsTransport && usesOpenAIAuthRouting && params.getEffectiveModel().api === "openai-chatgpt-responses";
	let externalCliAuthScope = initialPluginHarnessOwnsTransport ? { ignoreAutoPreferredProfile: false } : openClawNativeCodexResponsesNeedsAuthBootstrap ? {
		providerIds: [OPENAI_PROVIDER_ID],
		ignoreAutoPreferredProfile: false
	} : resolveExternalCliAuthOverlayScopeFromSelection({
		provider: params.provider,
		cfg: runParams.config,
		agentId: runParams.agentId,
		modelId: params.modelId,
		workspaceDir: params.workspaceDir,
		userPinnedAuthProfileId: runParams.authProfileIdSource === "user" ? runParams.authProfileId : void 0
	});
	let noExternalAuthStore;
	if (!initialPluginHarnessOwnsTransport && !externalCliAuthScope.providerIds) {
		noExternalAuthStore = ensureAuthProfileStoreWithoutExternalProfiles(params.agentDir, {
			migrationProvider: params.provider,
			config: runParams.config,
			profileId: runParams.authProfileId,
			allowKeychainPrompt: false
		});
		externalCliAuthScope = resolveExternalCliAuthOverlayScopeFromSelection({
			provider: params.provider,
			cfg: runParams.config,
			agentId: runParams.agentId,
			modelId: params.modelId,
			workspaceDir: params.workspaceDir,
			store: noExternalAuthStore,
			userPinnedAuthProfileId: runParams.authProfileIdSource === "user" ? runParams.authProfileId : void 0
		});
	}
	params.markStage?.("scope");
	const attemptAuthProfileStore = usesOpenAIAuthRouting ? loadEmbeddedRunAuthProfileStore({
		provider: params.provider,
		agentDir: params.agentDir,
		profileId: runParams.authProfileId,
		config: runParams.config,
		externalCliProviderIds: [OPENAI_PROVIDER_ID]
	}) : initialPluginHarnessOwnsTransport ? ensureAuthProfileStoreWithoutExternalProfiles(params.agentDir, {
		migrationProvider: params.provider,
		config: runParams.config,
		profileId: runParams.authProfileId,
		allowKeychainPrompt: false
	}) : externalCliAuthScope.providerIds ? loadEmbeddedRunAuthProfileStore({
		provider: params.provider,
		agentDir: params.agentDir,
		profileId: runParams.authProfileId,
		config: runParams.config,
		externalCliProviderIds: externalCliAuthScope.providerIds
	}) : noExternalAuthStore ?? ensureAuthProfileStoreWithoutExternalProfiles(params.agentDir, {
		migrationProvider: params.provider,
		config: runParams.config,
		profileId: runParams.authProfileId,
		allowKeychainPrompt: false
	});
	params.markStage?.("store");
	const requestedProfileId = runParams.authProfileId?.trim() || void 0;
	const lockedProfileId = runParams.authProfileIdSource === "user" ? requestedProfileId : void 0;
	const preferredProfileId = externalCliAuthScope.ignoreAutoPreferredProfile && !lockedProfileId ? void 0 : requestedProfileId;
	const createAuthPreparation = () => {
		const harness = params.getAgentHarness();
		if (params.nativeSessionRuntime?.auth === "native") {
			const plan = buildAgentRuntimeAuthPlan({
				provider: params.provider,
				modelId: params.modelId,
				harnessId: harness.id,
				allowHarnessAuthProfileForwarding: false,
				metadataSnapshot: params.preparedModelRuntime?.metadataSnapshot,
				config: runParams.config,
				workspaceDir: params.workspaceDir
			});
			return {
				plan,
				attempts: [{
					kind: "implicit",
					plan
				}]
			};
		}
		return prepareAgentRuntimeAuth({
			provider: params.provider,
			modelId: params.modelId,
			modelApi: params.model.api,
			modelBaseUrl: params.model.baseUrl,
			requestTransportOverrides: params.requestStreamTransportOverrides,
			config: runParams.config,
			env: process.env,
			agentId: runParams.agentId,
			agentDir: params.agentDir,
			workspaceDir: params.workspaceDir,
			metadataSnapshot: params.preparedModelRuntime?.metadataSnapshot,
			authProfileStore: attemptAuthProfileStore,
			sessionAuthProfileId: preferredProfileId,
			sessionAuthProfileSource: runParams.authProfileIdSource,
			allowAuthProfileFallback: runParams.allowAuthProfileFallback,
			harnessId: harness.id,
			harnessRuntime: harness.id,
			harnessAuthBootstrap: harness.authBootstrap,
			allowHarnessAuthProfileForwarding: true,
			allowTransientCooldownProbe: runParams.allowTransientCooldownProbe === true,
			resolveProviderPreferredProfileId: (context) => resolveProviderAuthProfileId({
				provider: params.provider,
				config: runParams.config,
				workspaceDir: params.workspaceDir,
				env: process.env,
				context
			})
		});
	};
	const providerUsesProfileScopedModelMetadata = providerUsesCredentialScopedModelMetadata({
		provider: params.provider,
		modelId: params.modelId,
		config: runParams.config,
		agentDir: params.agentDir,
		workspaceDir: params.workspaceDir
	});
	const providerOwnsDynamicModelRefresh = providerOwnsDynamicModelPreparation({
		provider: params.provider,
		config: runParams.config,
		workspaceDir: params.workspaceDir
	});
	const { materialize: materializeAuthPlan, materializeUncached: materializeAuthPlanUncached } = createPreparedRuntimeModelMaterializer({
		provider: params.provider,
		modelId: params.modelId,
		config: runParams.config,
		workspaceDir: params.workspaceDir,
		metadataSnapshot: params.preparedModelRuntime?.metadataSnapshot,
		getModel: params.getRuntimeModel,
		nativeModelOwned: params.nativeModelOwned,
		requestedProfileId: runParams.authProfileId,
		providerUsesProfileScopedModelMetadata,
		providerOwnsDynamicModelRefresh,
		generationRouteModelMemo: params.preparedModelRuntime?.routeModelResolutionMemo,
		resolveModel: ({ config, authProfileId, authProfileMode }) => resolveModelAsync(params.provider, params.modelId, params.agentDir, config, {
			abortSignal: runParams.abortSignal,
			assertCurrent: params.assertCurrent,
			modelIdSource: "selected",
			authStorage: params.authStorage,
			modelRegistry: params.modelRegistry,
			skipAgentDiscovery: true,
			allowBundledStaticCatalogFallback: true,
			preparedModelRuntime: params.preparedModelRuntime,
			workspaceDir: params.workspaceDir,
			authProfileId,
			authProfileMode
		})
	});
	let resolvedAuthPreparation = createAuthPreparation();
	let preparedAuthAttempts = resolvedAuthPreparation.attempts;
	let activePreparedAuthPlan = resolvedAuthPreparation.plan;
	params.applyResolvedRuntimeModel(await materializeAuthPlan(activePreparedAuthPlan));
	params.markStage?.("prepare-plan");
	const finalizedHarness = params.selectHarnessForPreparedAttempts(params.getEffectiveModel(), preparedAuthAttempts);
	if (finalizedHarness.id !== params.getAgentHarness().id) {
		params.setAgentHarness(finalizedHarness);
		resolvedAuthPreparation = createAuthPreparation();
		preparedAuthAttempts = resolvedAuthPreparation.attempts;
		activePreparedAuthPlan = resolvedAuthPreparation.plan;
		params.applyResolvedRuntimeModel(await materializeAuthPlan(activePreparedAuthPlan));
		if (params.selectHarnessForPreparedAttempts(params.getEffectiveModel(), preparedAuthAttempts).id !== params.getAgentHarness().id) throw new Error(`Prepared auth route did not converge on one agent harness for ${params.provider}/${params.modelId}.`);
	}
	params.markStage?.("harness");
	return {
		usesOpenAIAuthRouting,
		attemptAuthProfileStore,
		lockedProfileId,
		preferredProfileId,
		providerUsesProfileScopedModelMetadata,
		materializeAuthPlan,
		materializeAuthPlanUncached,
		preparedAuthAttempts,
		activePreparedAuthPlan
	};
}
//#endregion
//#region src/agents/embedded-agent-runner/run/model-harness.ts
function resolveEmbeddedRunEffectiveModel(params) {
	const contextConfigProvider = resolveContextConfigProviderForRuntime({
		provider: params.modelConfigProvider,
		runtimeId: params.agentHarnessId,
		config: params.runParams.config
	});
	const resolved = resolveEmbeddedRuntimeModelPolicy({
		cfg: params.runParams.config,
		provider: params.provider,
		contextConfigProvider,
		modelId: params.modelId,
		runtimeModel: params.runtimeModel,
		nativeModelOwned: params.nativeModelOwned,
		...params.runParams.contextWindow ? { contextWindow: params.runParams.contextWindow } : {},
		...params.runParams.contextTokenBudget === void 0 ? {} : { contextTokenBudget: params.runParams.contextTokenBudget }
	});
	const authoredContextTokenCap = params.nativeModelOwned || params.agentHarnessId === "openclaw" ? void 0 : resolveAuthoredModelContextTokens({
		cfg: params.runParams.config,
		provider: contextConfigProvider,
		model: params.modelId
	});
	return {
		...resolved,
		...authoredContextTokenCap === void 0 ? {} : { authoredContextTokenCap }
	};
}
function buildHarnessModelProvider(params) {
	const route = params.plan?.modelRoute;
	const routeSupport = resolveAgentHarnessPreparedRouteSupport(params.plan);
	const requestTransportOverrides = params.requestStreamTransportOverrides ?? routeSupport.requestTransportOverrides;
	return {
		api: route?.api ?? params.model.api,
		baseUrl: route?.baseUrl ?? params.model.baseUrl,
		...requestTransportOverrides ? { requestTransportOverrides } : {},
		...routeSupport.runtimePolicy ? { runtimePolicy: routeSupport.runtimePolicy } : {},
		...params.plan ? { preparedAuth: resolveAgentHarnessPreparedAuthSupport({
			plan: params.plan,
			...params.preparedAuthAttempt?.kind === "profile" || params.preparedAuthAttempt?.kind === "direct" ? { source: params.preparedAuthAttempt.kind } : {}
		}) } : {}
	};
}
function assertPinnedHarness(pinnedHarnessId, selected, subject) {
	if (pinnedHarnessId && selected.id !== pinnedHarnessId) throw new AgentHarnessPreflightError(`${subject} changed the session-pinned agent harness from "${pinnedHarnessId}" to "${selected.id}". Reattach the original native session or use a concrete model chat.`);
}
function selectEmbeddedRunHarness(params) {
	const selected = selectAgentHarness({
		provider: params.provider,
		modelId: params.modelId,
		modelProvider: buildHarnessModelProvider(params),
		config: params.runParams.config,
		agentId: params.runParams.agentId,
		sessionKey: params.runParams.sessionKey,
		agentHarnessId: params.runParams.agentHarnessId,
		agentHarnessRuntimeOverride: params.runParams.agentHarnessRuntimeOverride
	});
	assertPinnedHarness(params.pinnedHarnessId, selected, "Prepared model route");
	return selected;
}
function selectEmbeddedRunHarnessForPreparedAttempts(params) {
	const selected = selectAgentHarnessForPreparedModelProviders({
		provider: params.provider,
		modelId: params.modelId,
		modelProviders: params.attempts.map((attempt) => {
			const route = attempt.plan.modelRoute;
			const model = route ? {
				...params.model,
				api: route.api,
				baseUrl: route.baseUrl
			} : params.model;
			return buildHarnessModelProvider({
				...params,
				model,
				plan: attempt.plan,
				preparedAuthAttempt: attempt
			});
		}),
		config: params.runParams.config,
		agentId: params.runParams.agentId,
		sessionKey: params.runParams.sessionKey,
		agentHarnessId: params.runParams.agentHarnessId,
		agentHarnessRuntimeOverride: params.runParams.agentHarnessRuntimeOverride
	});
	assertPinnedHarness(params.pinnedHarnessId, selected, "Prepared auth routes");
	return selected;
}
//#endregion
//#region src/agents/embedded-agent-runner/run/model-setup.ts
function prepareNativeSessionRuntime(runParams, harness, admission) {
	const pinnedHarnessId = resolveSessionPinnedHarnessId(admission?.entry);
	if (!admission || !pinnedHarnessId || !harness.resolveSessionRuntimeOwnership) return;
	const { sessionId, lifecycleRevision } = admission.entry;
	const resolveOwnership = () => readSessionRuntimeOwnership({
		config: runParams.config,
		agentId: admission.agentId,
		sessionKey: admission.sessionKey,
		storePath: admission.storePath,
		sessionEntry: admission.entry,
		assertCurrent: () => {
			runParams.abortSignal?.throwIfAborted();
			if (runParams.lifecycleGeneration) assertAgentRunLifecycleGenerationCurrent(runParams.lifecycleGeneration);
			const current = loadSessionEntryReadOnly(admission);
			const expectedWriter = runParams.sessionTarget?.expectedWriterRunId;
			if (getRegisteredAgentHarness(pinnedHarnessId)?.harness !== harness || current?.sessionId !== sessionId || current?.lifecycleRevision !== lifecycleRevision || resolveSessionPinnedHarnessId(current) !== pinnedHarnessId || expectedWriter !== void 0 && current?.activeWriterRunId !== expectedWriter) throw new AgentHarnessPreflightError("Native model ownership changed during run preparation. Reattach the original native session before retrying.");
		}
	});
	const ownership = resolveOwnership();
	if (!ownership) throw new AgentHarnessPreflightError("The pinned runtime's native session ownership is unavailable. Reattach the original native session instead of starting a replacement model run.");
	if (ownership.auth === "host" && !ownership.modelRef) throw new AgentHarnessPreflightError("The native session's model and provider are unavailable for host authentication. Reattach the original native session before retrying.");
	return {
		harness,
		...ownership.auth === "host" ? {
			auth: "host",
			modelRef: ownership.modelRef
		} : { auth: "native" },
		assertCurrent: async () => {
			const current = resolveOwnership();
			if (current?.model !== ownership.model || current.auth !== ownership.auth || ownership.auth === "host" && (current.modelRef?.provider !== ownership.modelRef?.provider || current.modelRef?.model !== ownership.modelRef?.model)) throw new AgentHarnessPreflightError("Native model ownership changed before agent harness dispatch. Reattach the original native session before retrying.");
		}
	};
}
async function resolveEmbeddedRunModelSetup(params) {
	const runParams = params.runParams;
	const hookSelection = await resolveHookModelSelection({
		prompt: runParams.prompt,
		attachments: buildBeforeModelResolveAttachments(runParams.images),
		provider: params.provider,
		modelId: params.modelId,
		modelSelectionLocked: runParams.modelSelectionLocked,
		hookRunner: params.hookRunner,
		hookContext: params.hookContext
	});
	const modelSelectionChangedByHook = hookSelection.provider !== params.provider || hookSelection.modelId !== params.modelId;
	let provider = hookSelection.provider;
	let modelId = hookSelection.modelId;
	const requestStreamTransportOverrides = resolveRequestStreamTransportOverrides(runParams.streamParams);
	params.onHooksResolved();
	await ensureSelectedAgentHarnessPlugin({
		provider,
		modelId,
		config: runParams.config,
		agentId: runParams.agentId,
		sessionKey: runParams.sessionKey,
		agentHarnessId: runParams.agentHarnessId,
		agentHarnessRuntimeOverride: runParams.agentHarnessRuntimeOverride,
		requestTransportOverrides: requestStreamTransportOverrides,
		workspaceDir: params.workspaceDir,
		pluginRegistry: params.preparedModelRuntime?.pluginRegistry ?? requireActivePluginRegistry()
	});
	const pinnedHarnessId = resolveSessionPinnedHarnessId(params.sessionAdmission?.entry);
	const pinnedHarness = pinnedHarnessId ? getRegisteredAgentHarness(pinnedHarnessId)?.harness : void 0;
	const nativeSessionRuntime = pinnedHarness ? prepareNativeSessionRuntime(runParams, pinnedHarness, params.sessionAdmission) : void 0;
	if (nativeSessionRuntime?.auth === "host") {
		provider = nativeSessionRuntime.modelRef.provider;
		modelId = nativeSessionRuntime.modelRef.model;
	}
	const requestedModelId = modelId;
	if (nativeSessionRuntime?.auth === "native" && requestStreamTransportOverrides) throw new AgentHarnessPreflightError("Native session connections cannot apply provider stream parameters. Use a concrete model chat for this request.");
	const agentHarness = nativeSessionRuntime?.auth === "native" ? nativeSessionRuntime.harness : selectAgentHarness({
		provider,
		modelId,
		...requestStreamTransportOverrides ? { modelProvider: { requestTransportOverrides: requestStreamTransportOverrides } } : {},
		config: runParams.config,
		agentId: runParams.agentId,
		sessionKey: runParams.sessionKey,
		agentHarnessId: runParams.agentHarnessId,
		agentHarnessRuntimeOverride: runParams.agentHarnessRuntimeOverride
	});
	const nativePermissionsConsented = assertAgentHarnessExecutionEnvironment(agentHarness, runParams);
	if (agentHarness.executionEnvironment === "host-only" && !nativePermissionsConsented) assertPluginHarnessConversationToolPolicySupport(agentHarness, resolveAgentHarnessNativeToolPolicyRestricted({
		...runParams,
		provider,
		modelId
	}, agentHarness));
	const pluginHarnessOwnsTransport = agentHarness.id !== "openclaw";
	const expectedHarnessArtifact = runParams.expectedAgentHarnessRuntimeArtifact;
	if (expectedHarnessArtifact && expectedHarnessArtifact.harnessId !== agentHarness.id) throw new Error(`Verified inference requires agent harness ${expectedHarnessArtifact.harnessId}, but ${agentHarness.id} was selected.`);
	if (expectedHarnessArtifact && !agentHarness.runtimeArtifact) throw new Error(`Agent harness ${agentHarness.id} cannot attest the verified inference runtime artifact.`);
	let catalog = params.preparedModelRuntime?.modelCatalog;
	let nativeCatalogFailure;
	const ownsSelectedNativeModel = (entry) => entry.provider === provider && entry.id === modelId && entry.nativeRuntime === agentHarness.id;
	if (!nativeSessionRuntime && pluginHarnessOwnsTransport && agentHarness.loadModelCatalog && params.preparedModelRuntime?.loadNativeModelCatalog && !catalog?.entries.some(ownsSelectedNativeModel) && !catalog?.routeVariants.some(ownsSelectedNativeModel)) {
		try {
			catalog = await params.preparedModelRuntime.loadNativeModelCatalog({
				provider,
				modelId,
				runtime: agentHarness.id
			});
		} catch (error) {
			nativeCatalogFailure = { error };
		}
		runParams.abortSignal?.throwIfAborted();
		assertPreparedModelRuntimeInputCurrent(params.preparedModelRuntime, params.preparedModelRuntime.isCurrent);
	}
	const nativeModelOwned = nativeSessionRuntime !== void 0 || pluginHarnessOwnsTransport && (catalog?.entries.some(ownsSelectedNativeModel) === true || catalog?.routeVariants.some(ownsSelectedNativeModel) === true);
	const modelConfigProvider = provider;
	let resolvedModelProvider = provider;
	let modelResolution;
	if (nativeModelOwned) modelResolution = {
		model: createNativeModelOwnedRuntimeModel({
			provider,
			modelId
		}),
		...createEmptyAgentDiscoveryStores()
	};
	else {
		const selectedRuntimeProvider = resolveSelectedOpenAIRuntimeProvider({
			provider,
			harnessRuntime: agentHarness.id,
			agentHarnessId: agentHarness.id,
			authProfileProvider: runParams.authProfileId?.split(":", 1)[0],
			authProfileId: runParams.authProfileId,
			config: runParams.config,
			workspaceDir: params.workspaceDir
		});
		const tieredResolution = await resolveTieredModel({
			abortSignal: runParams.abortSignal,
			assertCurrent: params.assertCurrent,
			provider: selectedRuntimeProvider,
			...selectedRuntimeProvider !== provider ? { fallbackProvider: provider } : {},
			modelId,
			agentDir: params.agentDir,
			requestedRouteResolution: modelSelectionChangedByHook ? "raw" : runParams.requestedRouteResolution,
			config: runParams.config,
			workspaceDir: params.workspaceDir,
			authProfileId: runParams.authProfileId,
			preparedModelRuntime: params.preparedModelRuntime,
			staticCatalogOwnsTransport: pluginHarnessOwnsTransport
		});
		resolvedModelProvider = tieredResolution.provider;
		modelResolution = tieredResolution.resolution;
		if (modelResolution.model) modelId = modelResolution.logicalRef.model;
	}
	provider = resolvedModelProvider;
	if (!modelResolution.model) {
		if (nativeCatalogFailure) throw nativeCatalogFailure.error;
		throw new FailoverError(modelResolution.error ?? `Unknown model: ${provider}/${modelId}`, {
			reason: "model_not_found",
			provider,
			model: modelId,
			sessionId: runParams.sessionId,
			lane: params.globalLane
		});
	}
	const { model, authStorage, modelRegistry } = modelResolution;
	return {
		provider,
		modelId,
		requestedModelId,
		modelSelectionChangedByHook,
		requestStreamTransportOverrides,
		expectedHarnessArtifact,
		agentHarness,
		pluginHarnessOwnsTransport,
		pinnedHarnessId,
		nativeModelOwned,
		nativeSessionRuntime,
		modelConfigProvider,
		model,
		authStorage,
		modelRegistry
	};
}
//#endregion
//#region src/agents/embedded-agent-runner/run/runtime-preparation.ts
async function prepareEmbeddedRunRuntime(input) {
	const params = input.runParams;
	let provider = input.provider;
	let modelId = input.modelId;
	const modelSetup = await resolveEmbeddedRunModelSetup({
		assertCurrent: input.assertCurrent,
		runParams: params,
		sessionAdmission: input.sessionAdmission,
		provider,
		modelId,
		agentDir: input.agentDir,
		workspaceDir: input.workspaceDir,
		globalLane: input.globalLane,
		hookRunner: input.hookRunner,
		hookContext: input.hookContext,
		onHooksResolved: () => input.markStartupStage("hooks"),
		preparedModelRuntime: input.preparedModelRuntime
	});
	provider = modelSetup.provider;
	modelId = modelSetup.modelId;
	const pluginMetadataSnapshot = input.preparedModelRuntime?.metadataSnapshot;
	const { requestedModelId, modelSelectionChangedByHook, requestStreamTransportOverrides, expectedHarnessArtifact, pinnedHarnessId, nativeModelOwned, nativeSessionRuntime, modelConfigProvider, model, authStorage, modelRegistry } = modelSetup;
	let agentHarness = modelSetup.agentHarness;
	let pluginHarnessOwnsTransport = modelSetup.pluginHarnessOwnsTransport;
	let preparedThinkingCapabilityReady = false;
	const resolveEffectiveModel = (candidate) => resolveEmbeddedRunEffectiveModel({
		runParams: params,
		provider,
		modelConfigProvider,
		modelId,
		agentHarnessId: agentHarness.id,
		runtimeModel: candidate,
		nativeModelOwned,
		requestStreamTransportOverrides,
		pinnedHarnessId
	});
	const initialResolvedRuntimeModel = resolveEffectiveModel(model);
	let contextTokenBudget = initialResolvedRuntimeModel.contextTokenBudget;
	let authoredContextTokenCap = initialResolvedRuntimeModel.authoredContextTokenCap;
	let contextWindowInfo = initialResolvedRuntimeModel.contextWindowInfo;
	let outerContextTokenMeta = contextTokenBudget === void 0 ? {} : { contextTokens: contextTokenBudget };
	const models = {
		runtime: model,
		effective: initialResolvedRuntimeModel.effectiveModel
	};
	const applyResolvedRuntimeModel = (candidate, resolvedCandidate) => {
		const preparedThinkingCompat = preparedThinkingCapabilityReady ? resolvePreparedModelThinkingCompat({
			capability: params.modelThinkingCapability,
			model: candidate,
			agentRuntime: agentHarness.id
		}) : void 0;
		const resolvedModel = preparedThinkingCompat ? {
			...candidate,
			compat: {
				...candidate.compat,
				...preparedThinkingCompat
			}
		} : candidate;
		const resolved = resolvedModel === candidate && resolvedCandidate ? resolvedCandidate : resolveEffectiveModel(resolvedModel);
		models.runtime = resolvedModel;
		models.effective = resolved.effectiveModel;
		contextTokenBudget = resolved.contextTokenBudget;
		authoredContextTokenCap = resolved.authoredContextTokenCap;
		contextWindowInfo = resolved.contextWindowInfo;
		outerContextTokenMeta = contextTokenBudget === void 0 ? {} : { contextTokens: contextTokenBudget };
	};
	const selectHarnessForModel = (candidate, plan, preparedAuthAttempt) => nativeSessionRuntime?.auth === "native" ? nativeSessionRuntime.harness : selectEmbeddedRunHarness({
		runParams: params,
		provider,
		modelId,
		model: candidate,
		plan,
		preparedAuthAttempt,
		requestStreamTransportOverrides,
		pinnedHarnessId
	});
	const selectHarnessForPreparedAttempts = (candidate, attempts) => nativeSessionRuntime?.auth === "native" ? nativeSessionRuntime.harness : selectEmbeddedRunHarnessForPreparedAttempts({
		runParams: params,
		provider,
		modelId,
		model: candidate,
		attempts,
		requestStreamTransportOverrides,
		pinnedHarnessId
	});
	input.markStartupStage("model-resolution");
	input.notifyExecutionPhase("model_resolution", {
		provider,
		model: modelId
	});
	agentHarness = selectHarnessForModel(models.effective);
	pluginHarnessOwnsTransport = agentHarness.id !== "openclaw";
	const authStages = log$3.isEnabled("trace") ? createEmbeddedRunStageTracker() : void 0;
	const preparedAuthPlan = await prepareEmbeddedRunAuthPlan({
		assertCurrent: input.assertCurrent,
		runParams: params,
		provider,
		modelId,
		model,
		agentDir: input.agentDir,
		workspaceDir: input.workspaceDir,
		requestStreamTransportOverrides,
		nativeModelOwned,
		nativeSessionRuntime,
		authStorage,
		modelRegistry,
		preparedModelRuntime: input.preparedModelRuntime,
		getAgentHarness: () => agentHarness,
		setAgentHarness: (nextHarness) => {
			agentHarness = nextHarness;
			pluginHarnessOwnsTransport = agentHarness.id !== "openclaw";
		},
		getRuntimeModel: () => models.runtime,
		getEffectiveModel: () => models.effective,
		applyResolvedRuntimeModel,
		selectHarnessForPreparedAttempts,
		markStage: (stage) => authStages?.mark(stage)
	});
	const { attemptAuthProfileStore, lockedProfileId, preferredProfileId, providerUsesProfileScopedModelMetadata, materializeAuthPlan, materializeAuthPlanUncached, preparedAuthAttempts } = preparedAuthPlan;
	let { activePreparedAuthPlan } = preparedAuthPlan;
	preparedThinkingCapabilityReady = true;
	applyResolvedRuntimeModel(models.runtime);
	const genericCompactionRecoveryAllowed = !pluginHarnessOwnsTransport;
	const profileCandidates = preparedAuthAttempts.map((attempt) => attempt.profileId);
	const forwardedPluginHarnessProfileId = pluginHarnessOwnsTransport ? activePreparedAuthPlan.forwardedAuthProfileId : void 0;
	const requestedThinkLevel = resolveInitialThinkLevel({
		requested: params.thinkLevel,
		config: params.config,
		agentId: params.agentId,
		provider,
		modelId,
		model: models.effective
	});
	const initialThinkLevel = modelSelectionChangedByHook ? resolveCandidateThinkingLevel({
		cfg: params.config,
		provider,
		modelId,
		level: requestedThinkLevel,
		catalog: [{
			provider,
			id: modelId,
			api: models.effective.api,
			reasoning: models.effective.reasoning,
			params: models.effective.params,
			compat: models.effective.compat
		}],
		agentId: params.agentId,
		sessionKey: params.sessionKey,
		agentRuntime: agentHarness.id
	}) ?? requestedThinkLevel : requestedThinkLevel;
	const attemptedThinking = /* @__PURE__ */ new Set();
	const authState = {
		models,
		thinkLevel: initialThinkLevel,
		apiKeyInfo: null,
		lastProfileId: void 0,
		runtimeAuthState: null,
		runtimeAuthRefreshCancelled: false,
		profileIndex: 0
	};
	const pluginHarnessOwnsAuthBootstrap = pluginHarnessOwnsTransport && agentHarness.authBootstrap === "harness";
	const preparedApiKeyRoute = activePreparedAuthPlan.modelRoute?.authRequirement === "api-key";
	const pluginHarnessHasPreparedApiKeyAttempt = preparedAuthAttempts.some((attempt) => attempt.plan.modelRoute?.authRequirement === "api-key");
	const pluginHarnessNeedsOpenClawAuthBootstrap = pluginHarnessOwnsTransport && (preparedApiKeyRoute || !pluginHarnessOwnsAuthBootstrap && preparedAuthAttempts.some((attempt) => attempt.kind !== "implicit"));
	const findPreparedAuthAttempt = (profileId, attemptIndex) => {
		const attempt = attemptIndex === void 0 ? preparedAuthAttempts.find((candidate) => candidate.profileId === profileId) : preparedAuthAttempts[attemptIndex];
		return attempt?.profileId === profileId ? attempt : void 0;
	};
	let preparedProfileAttempted = false;
	const prepareAuthAttempt = async (attempt) => {
		if (!canRunPreparedAgentRuntimeAuthAttempt({
			attempt,
			priorProfileAttempted: preparedProfileAttempted
		})) throw new Error(`Prepared direct auth fallback cannot bypass unavailable profiles for ${provider}/${modelId}.`);
		const modelDecision = resolveCredentialScopedAuthAttemptModelDecision({
			attempt,
			priorProfileAttempted: preparedProfileAttempted,
			requestedProfileId: params.authProfileId,
			providerUsesProfileScopedModelMetadata
		});
		const nextRuntimeModel = modelDecision.shouldMaterialize ? modelDecision.forceResolve ? await materializeAuthPlanUncached(attempt.plan, true) : await materializeAuthPlan(attempt.plan) : models.runtime;
		const nextResolvedModel = resolveEffectiveModel(nextRuntimeModel);
		if (selectHarnessForPreparedAttempts(nextResolvedModel.effectiveModel, preparedAuthAttempts).id !== agentHarness.id) throw new Error(`Prepared auth retry changed the selected agent harness for ${provider}/${modelId}.`);
		preparedProfileAttempted ||= attempt.kind === "profile";
		return {
			runtimeModel: nextRuntimeModel,
			authRequirement: modelDecision.authRequirement,
			allowAuthProfileFallback: attempt.allowAuthProfileFallback,
			commit() {
				applyResolvedRuntimeModel(nextRuntimeModel, nextResolvedModel);
				activePreparedAuthPlan = attempt.plan;
			}
		};
	};
	const prepareModelForAuthProfile = hasPreparedAuthAttemptModelMetadata({
		attempts: preparedAuthAttempts,
		providerUsesProfileScopedModelMetadata
	}) && (!pluginHarnessOwnsAuthBootstrap || pluginHarnessHasPreparedApiKeyAttempt) ? async (profileId, attemptIndex) => {
		const attempt = findPreparedAuthAttempt(profileId, attemptIndex);
		if (!attempt) throw new Error(`Auth profile "${profileId ?? "(none)"}" is outside the prepared attempts for ${provider}/${modelId}.`);
		const prepared = await prepareAuthAttempt(attempt);
		if (attempt.plan.modelRoute && !prepared.authRequirement) throw new Error(`Prepared route metadata is missing for ${provider}/${modelId}.`);
		return prepared;
	} : void 0;
	const authController = createEmbeddedRunAuthController({
		config: params.config,
		agentDir: input.agentDir,
		workspaceDir: input.workspaceDir,
		authStore: attemptAuthProfileStore,
		authStorage,
		profileCandidates,
		lockedProfileId,
		initialThinkLevel,
		attemptedThinking,
		fallbackConfigured: input.fallbackConfigured,
		allowTransientCooldownProbe: params.allowTransientCooldownProbe === true,
		authProfileFailurePolicy: params.authProfileFailurePolicy,
		authProfileStateMode: params.authProfileStateMode,
		runId: params.runId,
		provider,
		modelId,
		state: authState,
		...prepareModelForAuthProfile ? { prepareModelForAuthProfile } : {},
		log: log$3
	});
	authStages?.mark("controller");
	const cooldownProbePolicy = resolveEmbeddedAuthCooldownProbePolicy({
		authStore: attemptAuthProfileStore,
		profileCandidates,
		lockedProfileId,
		modelId,
		allowTransientCooldownProbe: params.allowTransientCooldownProbe === true
	});
	let didTransientCooldownProbe = false;
	const advancePluginHarnessAuthAttempt = async () => {
		if (!pluginHarnessOwnsTransport) return false;
		let nextIndex = authState.profileIndex + 1;
		while (nextIndex < preparedAuthAttempts.length) {
			const candidateIndex = nextIndex++;
			const candidateAttempt = preparedAuthAttempts[candidateIndex];
			authState.profileIndex = candidateIndex;
			if (!candidateAttempt) continue;
			const candidate = candidateAttempt.profileId;
			if (candidate && isProfileInCooldown(attemptAuthProfileStore, candidate, void 0, modelId)) {
				if (didTransientCooldownProbe || !cooldownProbePolicy.probeProfileIds.has(candidate)) continue;
				didTransientCooldownProbe = true;
				log$3.warn(`probing cooldowned auth profile for ${provider}/${modelId} due to ${cooldownProbePolicy.unavailableReason ?? "transient"} unavailability`);
			}
			if (!canRunPreparedAgentRuntimeAuthAttempt({
				attempt: candidateAttempt,
				priorProfileAttempted: preparedProfileAttempted
			})) {
				authState.profileIndex = preparedAuthAttempts.length;
				return false;
			}
			if (candidateAttempt.plan.modelRoute?.authRequirement === "api-key") try {
				await authController.applyAuthProfileCandidate(candidate, candidateIndex);
				authState.thinkLevel = initialThinkLevel;
				attemptedThinking.clear();
				return true;
			} catch {
				continue;
			}
			if (!candidate || candidateAttempt.plan.forwardedAuthProfileId !== candidate) continue;
			const prepared = await prepareAuthAttempt(candidateAttempt);
			authController.stopRuntimeAuthRefreshTimer();
			authState.apiKeyInfo = null;
			authState.runtimeAuthState = null;
			prepared.commit();
			authState.lastProfileId = candidate;
			authState.thinkLevel = initialThinkLevel;
			attemptedThinking.clear();
			return true;
		}
		authState.profileIndex = preparedAuthAttempts.length;
		return false;
	};
	const advanceAttemptAuthProfile = pluginHarnessOwnsAuthBootstrap ? advancePluginHarnessAuthAttempt : authController.advanceAuthProfile;
	if (!pluginHarnessOwnsTransport || pluginHarnessNeedsOpenClawAuthBootstrap) await authController.initializeAuthProfile();
	else if (forwardedPluginHarnessProfileId) {
		const initialAttempt = preparedAuthAttempts[authState.profileIndex];
		const initialProfileInCooldown = initialAttempt?.kind === "profile" && isProfileInCooldown(attemptAuthProfileStore, initialAttempt.profileId, void 0, modelId);
		const initialProfileId = initialAttempt?.profileId;
		const canProbeInitialProfile = initialProfileInCooldown && initialProfileId !== void 0 && cooldownProbePolicy.probeProfileIds.has(initialProfileId);
		if (initialProfileInCooldown && !canProbeInitialProfile) {
			if (!await advancePluginHarnessAuthAttempt()) throw new Error(`Prepared auth profiles are temporarily unavailable for ${provider}/${modelId}.`);
		} else {
			if (initialProfileInCooldown) {
				didTransientCooldownProbe = true;
				log$3.warn(`probing cooldowned auth profile for ${provider}/${modelId} due to ${cooldownProbePolicy.unavailableReason ?? "transient"} unavailability`);
			}
			preparedProfileAttempted = initialAttempt?.kind === "profile";
			authState.lastProfileId = forwardedPluginHarnessProfileId;
		}
	}
	authStages?.mark("initialize");
	if (authStages) log$3.trace(formatEmbeddedRunStageSummary(`[trace:embedded-run] auth stages: runId=${params.runId} sessionId=${params.sessionId} phase=auth`, authStages.snapshot()));
	input.markStartupStage("auth");
	input.notifyExecutionPhase("auth", {
		provider,
		model: modelId
	});
	const routeFacts = getModelProviderRequestRouteFacts(models.effective);
	const fallbackEndpointClass = routeFacts ? void 0 : resolveProviderEndpoint(models.effective.baseUrl, pluginMetadataSnapshot?.owners).endpointClass;
	const providerOwner = routeFacts?.providerOwner ?? (fallbackEndpointClass && ![
		"default",
		"invalid",
		"local",
		"custom"
	].includes(fallbackEndpointClass) ? fallbackEndpointClass : void 0);
	const providerRuntimeHandle = {
		...resolveProviderRuntimePluginHandle({
			provider,
			providerOwner,
			modelId,
			config: params.config,
			workspaceDir: input.workspaceDir,
			env: process.env,
			...pluginMetadataSnapshot ? { pluginMetadataSnapshot } : {}
		}),
		modelId,
		prepared: true
	};
	const admittedRunContext = await resolvePreparedRunAdmission({
		runId: params.runId,
		runtimeKind: pluginHarnessOwnsTransport ? "plugin-harness" : "embedded",
		admittedRunContext: params.admittedRunContext,
		preparedRunAdmission: params.preparedRunAdmission
	});
	const sourceReplyDeliveryRuntime = readSourceReplyDeliveryRuntime(params);
	if (sourceReplyDeliveryRuntime?.origin === "runtime_default") {
		const mode = (agentHarness.deliveryDefaults?.visibleReplies ?? agentHarness.deliveryDefaults?.sourceVisibleReplies) === "message_tool" ? "message_tool_only" : "automatic";
		sourceReplyDeliveryRuntime.applyPreparedMode(params, mode);
		params.forceMessageTool = mode === "message_tool_only";
	}
	return {
		admittedRunContext,
		provider,
		modelId,
		requestedModelId,
		expectedHarnessArtifact,
		nativeModelOwned,
		nativeSessionRuntime,
		model,
		authStorage,
		modelRegistry,
		attemptAuthProfileStore,
		lockedProfileId,
		preferredProfileId,
		profileCandidates,
		profileFailureStore: attemptAuthProfileStore,
		genericCompactionRecoveryAllowed,
		pluginHarnessOwnsAuthBootstrap,
		attemptedThinking,
		advanceAttemptAuthProfile,
		maybeRefreshRuntimeAuthForAuthError: authController.maybeRefreshRuntimeAuthForAuthError,
		stopRuntimeAuthRefreshTimer: authController.stopRuntimeAuthRefreshTimer,
		getApiKeyInfo: () => authState.apiKeyInfo,
		setThinkLevel: (next) => {
			authState.thinkLevel = next;
		},
		resolveRunAttemptAuthProfileStore: () => {
			if (!pluginHarnessOwnsTransport) return attemptAuthProfileStore;
			const activeProfileIds = activePreparedAuthPlan.modelRoute ? [activePreparedAuthPlan.forwardedAuthProfileId, ...activePreparedAuthPlan.forwardedAuthProfileCandidateIds ?? []] : [authState.lastProfileId];
			return createScopedAuthProfileStore(attemptAuthProfileStore, activeProfileIds.filter((profileId) => Boolean(profileId)));
		},
		snapshot: () => ({
			agentHarness,
			pluginHarnessOwnsTransport,
			effectiveModel: models.effective,
			modelContextWindow: models.runtime.contextWindow,
			contextTokenBudget,
			authoredContextTokenCap,
			contextWindowInfo,
			outerContextTokenMeta,
			activePreparedAuthPlan,
			thinkLevel: authState.thinkLevel,
			apiKeyInfo: authState.apiKeyInfo,
			lastProfileId: authState.lastProfileId,
			runtimeAuthState: authState.runtimeAuthState,
			pluginMetadataSnapshot,
			providerRuntimeHandle
		})
	};
}
//#endregion
//#region src/agents/embedded-agent-runner/run/session-prompt-state.ts
const CONTINUATION_PROMPT = "Continue the current task from the existing transcript, preserving completed work. If an action was interrupted, inspect its state before deciding whether to retry it. Do not restart the task or repeat completed actions.";
async function createEmbeddedRunSessionPromptState(input) {
	const { runParams: params, sessionAgentId, resolvedSessionKey, lifecycleGeneration } = input;
	let activeSessionId = params.sessionId;
	let activeSessionFile = params.sessionFile;
	let activeSessionTarget = buildContextEngineCompactionSessionTarget({
		agentId: params.agentId ?? sessionAgentId,
		config: params.config,
		sessionFile: activeSessionFile,
		sessionId: activeSessionId,
		sessionKey: resolvedSessionKey,
		sessionTarget: params.sessionTarget
	});
	const expectedWriterRunId = params.sessionTarget?.expectedWriterRunId?.trim();
	const existingWriterFence = expectedWriterRunId ? {
		expectedLifecycleRevision: params.sessionTarget?.expectedLifecycleRevision,
		expectedWriterRunId
	} : void 0;
	const initialOwner = await prepareInitialSessionWriter({
		runParams: params,
		target: activeSessionTarget,
		onInterrupt: input.onInterrupt
	});
	const initialWriter = initialOwner?.writer;
	const initialTarget = initialWriter ? { ...activeSessionTarget } : void 0;
	let sessionTargetAdopted = false;
	let committedCompactionSuccessor;
	let settleOwnedTranscriptProjection = false;
	let suppressNextUserMessagePersistence = params.suppressNextUserMessagePersistence ?? false;
	let basePromptOverride;
	let compactionContinuationInstruction;
	const activePrompt = {
		get override() {
			const instruction = compactionContinuationInstruction;
			return instruction && basePromptOverride?.trim() ? `${basePromptOverride}\n\n${instruction}` : instruction ?? basePromptOverride;
		},
		persisted: suppressNextUserMessagePersistence,
		internal: false
	};
	const notifySessionIdChanged = () => {
		registerAgentRunContext(params.runId, {
			sessionId: activeSessionId,
			lifecycleGeneration
		});
		params.replyOperation?.updateSessionId(activeSessionId);
		params.onSessionIdChanged?.(activeSessionId);
	};
	const adoptSessionId = (nextSessionId) => {
		if (!nextSessionId || nextSessionId === activeSessionId) return;
		activeSessionId = nextSessionId;
		notifySessionIdChanged();
	};
	const capturePreparedCompactionTarget = (target) => {
		activeSessionId = target.sessionId;
		activeSessionFile = target.sessionFile;
		activeSessionTarget = target.sessionTarget;
		sessionTargetAdopted = true;
	};
	const recordCommittedCompactionSuccessor = (accepted) => {
		committedCompactionSuccessor = accepted;
		capturePreparedCompactionTarget(accepted);
	};
	const notifyCompactionSessionAdopted = (previousSessionId) => {
		if (previousSessionId && previousSessionId !== activeSessionId) notifySessionIdChanged();
	};
	const activateInternalPrompt = (prompt) => {
		basePromptOverride = prompt;
		Object.assign(activePrompt, {
			persisted: true,
			internal: true
		});
		suppressNextUserMessagePersistence = true;
	};
	if (params.pluginRuntimeRefreshContinuation) activateInternalPrompt(params.prompt);
	const activateCompactionContinuation = (instruction) => {
		compactionContinuationInstruction = instruction;
		activateInternalPrompt(basePromptOverride ?? "");
	};
	const clearCompactionContinuation = () => compactionContinuationInstruction = void 0;
	const onUserMessagePersisted = (message) => {
		const blockedBeforeAgentRun = message["__openclaw"]?.beforeAgentRunBlocked;
		const markCurrentUserMessagePersisted = () => {
			activePrompt.persisted = true;
			params.onUserMessagePersisted?.(message);
		};
		const recorder = params.userTurnTranscriptRecorder;
		if (!recorder) {
			markCurrentUserMessagePersisted();
			return;
		}
		const markWhenPersisted = (persisted) => {
			if (persisted?.message || recorder.hasPersisted()) markCurrentUserMessagePersisted();
		};
		const observedPersistence = (blockedBeforeAgentRun !== void 0 ? recorder.persistBlocked(message) : recorder.persistApproved()).then(markWhenPersisted).catch((persistError) => {
			log$3.warn(`failed to persist canonical ${blockedBeforeAgentRun !== void 0 ? "blocked " : ""}embedded user turn transcript: ${formatErrorMessage(persistError)}`);
		});
		recorder.markRuntimePersistencePending(observedPersistence);
	};
	const waitForCurrentUserMessagePersistence = async () => {
		if (params.userTurnTranscriptRecorder?.hasRuntimePersistencePending() === true) await params.userTurnTranscriptRecorder.waitForRuntimePersistence();
	};
	return {
		[Symbol.asyncDispose]: async () => await initialOwner?.close(),
		get sessionId() {
			return activeSessionId;
		},
		get sessionFile() {
			return activeSessionFile;
		},
		set sessionFile(value) {
			activeSessionFile = value;
		},
		get sessionTarget() {
			return activeSessionTarget;
		},
		set sessionTarget(value) {
			activeSessionTarget = value;
			sessionTargetAdopted = true;
		},
		get sessionTargetAdopted() {
			return sessionTargetAdopted;
		},
		get committedCompactionSuccessor() {
			return committedCompactionSuccessor;
		},
		get sessionWriterFence() {
			return existingWriterFence ?? initialWriter?.committedFence;
		},
		withSessionWriterContext: (run) => {
			const withContext = () => initialWriter && !initialWriter.committedFence ? withOwnedSessionTranscriptWrites({
				sessionTarget: initialTarget,
				initialWriter,
				withTranscriptWrite: initialWriter.withTranscriptWrite
			}, run) : runWithoutOwnedSessionTranscriptWrites(run);
			return initialOwner ? initialOwner.run(withContext) : withContext();
		},
		get activePrompt() {
			return activePrompt;
		},
		get suppressNextUserMessagePersistence() {
			return suppressNextUserMessagePersistence;
		},
		set suppressNextUserMessagePersistence(value) {
			suppressNextUserMessagePersistence = value;
		},
		adoptSessionId,
		capturePreparedCompactionTarget,
		recordCommittedCompactionSuccessor,
		notifyCompactionSessionAdopted,
		activateInternalPrompt,
		activateCompactionContinuation,
		clearCompactionContinuation,
		markOwnedTranscriptRetry: () => {
			settleOwnedTranscriptProjection = true;
		},
		settleOwnedTranscriptProjection: async (target, abortSignal) => {
			const sessionId = target?.sessionId ?? activeSessionId;
			if (settleOwnedTranscriptProjection && !params.sessionManager && target && sessionId) {
				settleOwnedTranscriptProjection = false;
				const { waitForSessionTranscriptProjection } = await import("./config/sessions/session-transcript-reconcile.js");
				await waitForSessionTranscriptProjection({
					...target,
					sessionId
				}, abortSignal);
			}
		},
		continueFromCurrentTranscript: (options) => {
			const prompt = options?.includeToolFailureInstruction ? `${CONTINUATION_PROMPT} ${TOOL_FAILURE_INSTRUCTION}` : CONTINUATION_PROMPT;
			activateInternalPrompt(prompt);
		},
		onUserMessagePersisted,
		waitForCurrentUserMessagePersistence,
		prepareCompactedTranscriptRetry: async (assertActive) => {
			await waitForCurrentUserMessagePersistence();
			assertActive();
			settleOwnedTranscriptProjection = true;
			if (activePrompt.internal) suppressNextUserMessagePersistence = activePrompt.persisted;
			else if (activePrompt.persisted) activateInternalPrompt(CONTINUATION_PROMPT);
		}
	};
}
//#endregion
//#region src/agents/embedded-agent-runner/failure-signal.ts
/**
* Converts embedded run failures into provider failover signals.
*/
/**
* Converts terminal tool errors from unattended embedded runs into failure signals.
*
* Cron runs need fatal execution-denied signals so schedulers do not treat blocked shell access as
* a normal silent completion.
*/
const FAILURE_SIGNAL_CODES = ["SYSTEM_RUN_DENIED", "INVALID_REQUEST"];
function resolveFailureSignalCode(value) {
	for (const code of FAILURE_SIGNAL_CODES) if (value === code) return code;
}
/** Resolves fatal cron failure metadata from the last exec-like tool error, if applicable. */
function resolveEmbeddedRunFailureSignal(params) {
	if (params.trigger !== "cron") return;
	const lastToolError = params.lastToolError;
	if (!lastToolError || !isExecLikeToolName(lastToolError.toolName)) return;
	const code = resolveFailureSignalCode(normalizeOptionalString(lastToolError.errorCode));
	if (!code) return;
	const message = normalizeOptionalString(lastToolError.error) ?? code;
	return {
		kind: "execution_denied",
		source: "tool",
		...lastToolError.toolName ? { toolName: lastToolError.toolName } : {},
		code,
		message,
		fatalForCron: true
	};
}
//#endregion
//#region src/agents/embedded-agent-runner/run/terminal-preparation.ts
function prepareEmbeddedRunTerminal(input) {
	const { runParams, attempt } = input;
	const { timedOutDuringCompaction, timedOutDuringToolExecution } = projectAgentRunAttemptTerminal(attempt.terminal);
	const timedOutDuringPrompt = isEmbeddedRunTerminalTimeout(input.terminalState.outcome) && !timedOutDuringCompaction && !timedOutDuringToolExecution;
	const timeoutFinal = isEmbeddedRunTimeoutFinal(attempt);
	const terminalAssistant = input.currentAttemptCompletedAssistant;
	const usageMeta = buildUsageAgentMetaFields({
		usageAccumulator: input.usageAccumulator,
		latestUsage: terminalAssistant?.usage,
		lastRunPromptUsage: input.lastRunPromptUsage
	});
	const attributionAssistant = terminalAssistant ?? attempt.currentAttemptAssistant;
	const reportedModelRef = resolveReportedModelRef({
		...attempt.runtimeModelSelection ?? {
			provider: input.provider,
			model: input.model
		},
		assistant: attributionAssistant
	});
	const responseModel = attributionAssistant?.responseModel?.trim() || reportedModelRef.model;
	const finalAssistantStopReason = (terminalAssistant?.stopReason ?? "").trim().toLowerCase();
	const terminalAssistantCanOwnFinalText = finalAssistantStopReason !== "error" && finalAssistantStopReason !== "aborted";
	const costUsd = estimateAggregateUsageCost({
		usage: usageMeta.usage,
		provider: reportedModelRef.provider,
		model: reportedModelRef.model,
		config: runParams.config,
		agentDir: runParams.agentDir
	});
	const runAssistantTurns = input.usageAccumulator.assistantTurns;
	const contextTokens = attempt.contextTokens ?? input.outerContextTokenMeta.contextTokens;
	const agentMeta = {
		sessionId: input.sessionIdUsed,
		sessionFile: input.sessionFileUsed,
		provider: reportedModelRef.provider,
		model: reportedModelRef.model,
		contextTokens,
		...contextTokens !== void 0 ? { contextTokensSource: attempt.contextTokens !== void 0 ? attempt.contextTokensSource ?? "resolved" : "resolved" } : {},
		agentHarnessId: attempt.agentHarnessId,
		providerRefusal: resolveProviderRefusal(attributionAssistant),
		...attempt.runtimeModelSelection ? { runtimeModelSelection: attempt.runtimeModelSelection } : {},
		credentialSource: attempt.modelAttempt?.credentialSource,
		usage: usageMeta.usage,
		lastCallUsage: usageMeta.lastCallUsage,
		promptTokens: usageMeta.promptTokens,
		...input.contextRecoveryState.lastContextBudgetStatus ? { contextBudgetStatus: input.contextRecoveryState.lastContextBudgetStatus } : {},
		compactionCount: input.contextRecoveryState.autoCompactionCount > 0 ? input.contextRecoveryState.autoCompactionCount : void 0,
		compactionTokensAfter: input.contextRecoveryState.lastCompactionTokensAfter,
		codeModeEngaged: attempt.codeModeEngaged === true,
		...runAssistantTurns > 0 ? { assistantTurns: runAssistantTurns } : {},
		...input.usageAccumulator.bridgeCalls ? { bridgeCalls: { ...input.usageAccumulator.bridgeCalls } } : {},
		...costUsd !== void 0 ? { costUsd } : {}
	};
	const attemptFinalText = attempt.assistantTexts.findLast((text) => text.trim().length > 0)?.trim();
	const finalAssistantVisibleText = terminalAssistantCanOwnFinalText ? resolveFinalAssistantVisibleText(terminalAssistant) ?? attemptFinalText : void 0;
	const finalAssistantRawText = terminalAssistantCanOwnFinalText ? resolveFinalAssistantRawText(terminalAssistant) ?? attemptFinalText : void 0;
	const terminalTurnId = attempt.terminalTurnId;
	Object.assign(agentMeta, { terminalReceipt: {
		runId: runParams.runId,
		sessionId: input.sessionIdUsed,
		turnId: terminalTurnId?.trim() || runParams.runId,
		requested: {
			provider: input.provider,
			model: input.model
		},
		effective: {
			provider: reportedModelRef.provider,
			model: reportedModelRef.model,
			responseModel
		},
		successfulToolNames: resolveSuccessfulToolNames(attempt),
		assistantTranscriptIdempotencyKey: attempt.assistantTranscriptIdempotencyKey,
		sourceReplyDelivered: resolveSourceReplyDelivery(attempt) === "delivered" ? true : void 0,
		rerouted: isProviderModelRerouted({
			provider: input.provider,
			model: input.model
		}, {
			...reportedModelRef,
			responseModel
		})
	} });
	const payloadAssistant = attempt.yieldDetected ? attempt.lastAssistant : input.currentAttemptCompletedAssistant;
	const payloads = buildEmbeddedRunPayloads({
		assistantTexts: attempt.assistantTexts,
		answerSegments: attempt.answerSegments,
		assistantMessageIndex: attempt.lastAssistantTextMessageIndex,
		assistantTranscriptOwned: attempt.assistantTranscriptOwned,
		assistantTranscriptIdempotencyKey: attempt.assistantTranscriptIdempotencyKey,
		lastAssistant: payloadAssistant,
		currentAssistant: attempt.yieldDetected ? null : payloadAssistant ?? null,
		lastToolError: attempt.yieldDetected && input.terminalState.outcome.status === "ok" ? void 0 : attempt.lastToolError,
		config: runParams.config,
		isCronTrigger: runParams.trigger === "cron",
		isHeartbeatTrigger: runParams.trigger === "heartbeat",
		sessionKey: runParams.sessionKey ?? runParams.sessionId,
		provider: input.activeErrorContext.provider,
		providerOwner: input.providerOwner,
		model: input.activeErrorContext.model,
		authMode: input.authProfileId ? input.authProfileStore.profiles?.[input.authProfileId]?.type : void 0,
		verboseLevel: runParams.verboseLevel,
		reasoningLevel: runParams.reasoningLevel,
		thinkingLevel: runParams.thinkLevel,
		toolResultFormat: input.resolvedToolResultFormat,
		didSendViaMessagingTool: attempt.didSendViaMessagingTool,
		didDeliverSourceReplyViaMessageTool: resolveSourceReplyDelivery(attempt) === "delivered",
		messagingToolSentTargets: attempt.messagingToolSentTargets,
		messagingToolSourceReplyPayloads: attempt.messagingToolSourceReplyPayloads,
		sourceReplyDeliveryMode: runParams.sourceReplyDeliveryMode,
		agentId: runParams.agentId,
		runId: runParams.runId,
		runAborted: isEmbeddedRunTerminalInterrupted(input.terminalState.outcome) && !(timedOutDuringPrompt && timeoutFinal),
		runStopReason: input.terminalState.outcome.stopReason,
		deferAssistantTimeoutError: timedOutDuringPrompt && (!hasMessagingToolDeliveryEvidence(attempt) || timeoutFinal),
		didSendDeterministicApprovalPrompt: attempt.didSendDeterministicApprovalPrompt,
		heartbeatToolResponse: attempt.heartbeatToolResponse
	}).map((payload) => applyPreparedReplyMedia(payload, attempt.preparedReplyMedia ?? []));
	const payloadsWithToolMedia = (input.mergeToolMedia ?? mergeAttemptToolMediaPayloads)({
		payloads,
		toolMediaUrls: attempt.toolMediaUrls,
		hostOwnedToolMediaUrls: attempt.hostOwnedToolMediaUrls,
		toolAutoDeliveryMediaUrls: getCoreTtsAttemptResultMediaUrls(attempt, attempt.toolMediaUrls, runParams.admittedRunContext?.operationalRunInstance),
		toolAudioAsVoice: attempt.toolAudioAsVoice,
		toolTrustedLocalMedia: attempt.toolTrustedLocalMedia,
		sourceReplyDeliveryMode: runParams.sourceReplyDeliveryMode
	}, runParams.admittedRunContext?.operationalRunInstance);
	const recoveredFinalAssistantTextAfterPromptTimeout = timedOutDuringPrompt && !timeoutFinal && [
		"completed",
		"end_turn",
		"stop"
	].includes(finalAssistantStopReason) ? (finalAssistantVisibleText ?? finalAssistantRawText)?.trim() : void 0;
	const payloadAlreadyContainsRecoveredFinalAssistant = recoveredFinalAssistantTextAfterPromptTimeout ? (payloadsWithToolMedia ?? []).some((payload) => payload?.isError !== true && payload?.isReasoning !== true && typeof payload.text === "string" && payload.text.trim() === recoveredFinalAssistantTextAfterPromptTimeout) : false;
	const recoveredFinalAssistantPayloadsAfterPromptTimeout = recoveredFinalAssistantTextAfterPromptTimeout && !payloadAlreadyContainsRecoveredFinalAssistant ? replacePartialAssistantPayload({
		payloads: payloadsWithToolMedia,
		assistantTexts: attempt.assistantTexts,
		recoveredText: recoveredFinalAssistantTextAfterPromptTimeout
	}) : void 0;
	const hasSuccessfulFinalAssistantAfterPromptTimeout = timedOutDuringPrompt && Boolean(payloadAlreadyContainsRecoveredFinalAssistant || recoveredFinalAssistantPayloadsAfterPromptTimeout?.length);
	const hasPartialAssistantTextAfterPromptTimeout = timedOutDuringPrompt && (attempt.assistantTexts ?? []).some((text) => text.trim().length > 0) && !attempt.clientToolCalls && !attempt.yieldDetected && !attempt.didSendViaMessagingTool && !attempt.didSendDeterministicApprovalPrompt && !attempt.lastToolError && (attempt.toolMetas?.length ?? 0) === 0;
	const attemptToolSummary = buildTraceToolSummary({
		toolMetas: attempt.toolMetas,
		lastToolError: attempt.lastToolError
	});
	const failureSignal = resolveEmbeddedRunFailureSignal({
		trigger: runParams.trigger,
		lastToolError: attempt.lastToolError
	});
	const terminalToolFailure = resolveEmbeddedRunTerminalToolFailure({
		trigger: runParams.trigger,
		codeModeEngaged: attempt.codeModeEngaged,
		lastToolError: attempt.lastToolError
	});
	return {
		agentMeta,
		replyDeliveryState: input.replyDeliveryState ?? "missing",
		reportedModelRef,
		finalAssistantVisibleText,
		finalAssistantRawText,
		payloads,
		payloadsWithToolMedia,
		timedOutDuringPrompt,
		recoveredFinalAssistantPayloadsAfterPromptTimeout,
		hasSuccessfulFinalAssistantAfterPromptTimeout,
		hasPartialAssistantTextAfterPromptTimeout,
		attemptToolSummary,
		failureSignal,
		terminalToolFailure
	};
}
function replacePartialAssistantPayload(input) {
	const payloads = input.payloads ? [...input.payloads] : [];
	const assistantTextSignatures = new Set((input.assistantTexts ?? []).map((text) => text.trim()).filter((text) => text.length > 0));
	const partialPayloadIndex = payloads.findLastIndex((payload) => payload.isError !== true && payload.isReasoning !== true && typeof payload.text === "string" && assistantTextSignatures.has(payload.text.trim()));
	if (partialPayloadIndex < 0) return [...payloads, { text: input.recoveredText }];
	const partialPayload = payloads[partialPayloadIndex];
	if (!partialPayload) return [...payloads, { text: input.recoveredText }];
	payloads[partialPayloadIndex] = copyReplyPayloadMetadata(partialPayload, {
		...partialPayload,
		text: input.recoveredText
	});
	return payloads;
}
//#endregion
//#region src/agents/embedded-agent-runner/run/auth-profile-success.ts
const POST_RUN_AUTH_PROFILE_SUCCESS_SLOW_MS = 1e3;
function markEmbeddedRunAuthProfileSuccess(input) {
	if (input.authProfileStateMode === "read-only" || !input.profileId) return;
	const successProfileId = input.profileId;
	const safeSuccessProfileId = redactIdentifier(successProfileId, { len: 12 });
	const successProvider = input.profileStore.profiles[successProfileId]?.provider.trim() || input.provider;
	const successStarted = Date.now();
	markAuthProfileSuccess({
		store: input.profileStore,
		provider: successProvider,
		profileId: successProfileId,
		agentDir: input.agentDir
	}).then(() => {
		const durationMs = Date.now() - successStarted;
		if (durationMs >= POST_RUN_AUTH_PROFILE_SUCCESS_SLOW_MS) log$3.warn(`post-run auth-profile success bookkeeping completed after ${durationMs}ms: runId=${input.runId} sessionId=${input.sessionId} provider=${sanitizeForLog(successProvider)} profileId=${safeSuccessProfileId}`);
		else if (log$3.isEnabled("trace")) log$3.trace(`post-run auth-profile success bookkeeping completed: runId=${input.runId} sessionId=${input.sessionId} durationMs=${durationMs}`);
	}).catch((error) => {
		log$3.warn(`post-run auth-profile success bookkeeping failed: runId=${input.runId} sessionId=${input.sessionId} provider=${sanitizeForLog(successProvider)} profileId=${safeSuccessProfileId} error=${formatErrorMessage(error)}`);
	});
}
function reportEmbeddedRunSuccessfulAuthBinding(input) {
	const credential = input.profileId ? input.profileStore.profiles[input.profileId] : void 0;
	const pluginHarnessApiKeyInfo = resolvePluginHarnessApiKeyInfo({
		apiKeyInfo: input.apiKeyInfo,
		pluginHarnessOwnsTransport: input.pluginHarnessOwnsTransport
	});
	const authFingerprint = credential?.type === "oauth" && input.profileId ? fingerprintResolvedAuthProfileCredential({
		profileId: input.profileId,
		credential,
		resolvedAuth: input.apiKeyInfo
	}) : credential && input.profileId && input.pluginHarnessOwnsAuthBootstrap ? input.attempt.authBindingFingerprint : credential && input.profileId && input.pluginHarnessOwnsTransport ? fingerprintResolvedAuthProfileCredential({
		profileId: input.profileId,
		credential,
		resolvedAuth: pluginHarnessApiKeyInfo
	}) : input.apiKeyInfo ? fingerprintResolvedProviderAuth(input.apiKeyInfo) : void 0;
	const authProfileOwnerFingerprint = input.profileId && credential !== void 0 ? fingerprintAuthProfileOwnerShape({
		profileId: input.profileId,
		credential
	}) : void 0;
	const runtimeArtifact = input.pluginHarnessOwnsTransport ? input.attempt.runtimeArtifact : void 0;
	const runtimeOwnerFingerprint = authFingerprint ? void 0 : input.apiKeyInfo?.mode === "aws-sdk" ? fingerprintAwsSdkRuntimeOwner({
		provider: input.provider,
		backendId: input.agentHarnessId,
		auth: input.apiKeyInfo
	}) : input.pluginHarnessOwnsTransport ? fingerprintOpaqueRuntimeOwner({
		kind: "plugin-harness",
		runner: "embedded",
		provider: input.provider,
		backendId: input.agentHarnessId,
		...runtimeArtifact ? { runtimeArtifactFingerprint: runtimeArtifact.fingerprint } : {},
		...input.profileId ? { authProfileId: input.profileId } : {},
		...authProfileOwnerFingerprint ? { authProfileOwnerFingerprint } : {}
	}) : void 0;
	const runtimeOwnerKind = runtimeOwnerFingerprint ? input.apiKeyInfo?.mode === "aws-sdk" ? "aws-sdk" : input.pluginHarnessOwnsTransport ? "plugin-harness" : void 0 : input.pluginHarnessOwnsTransport ? "plugin-harness" : void 0;
	const materializedRoute = resolveHarnessAuthMaterialization(input, credential);
	if (materializedRoute) recordRuntimeAuthMaterialization({
		agentDir: input.agentDir,
		provider: input.provider,
		modelId: input.modelId,
		modelApi: materializedRoute.api,
		modelBaseUrl: materializedRoute.baseUrl,
		requestTransportOverrides: materializedRoute.requestTransportOverrides,
		authMode: materializedRoute.authRequirement === "subscription" ? "oauth" : "api-key",
		runtimeOwnerId: input.agentHarnessId,
		...input.profileId ? { authProfileId: input.profileId } : {}
	});
	input.onSuccessfulAuthBinding?.({
		...input.profileId ? { authProfileId: input.profileId } : {},
		agentHarnessId: input.agentHarnessId,
		modelId: input.modelId,
		modelApi: input.modelApi,
		...authFingerprint ? { authFingerprint } : {},
		...runtimeOwnerFingerprint ? { runtimeOwnerFingerprint } : {},
		...runtimeOwnerKind ? { runtimeOwnerKind } : {},
		...runtimeOwnerKind ? { runtimeOwnerId: input.agentHarnessId } : {},
		...runtimeArtifact ? {
			runtimeArtifactId: runtimeArtifact.id,
			runtimeArtifactFingerprint: runtimeArtifact.fingerprint
		} : {}
	});
}
function resolveHarnessAuthMaterialization(input, credential) {
	const preparedApiKeyProfileId = input.apiKeyInfo?.profileId;
	const resolvedReferencedApiKey = credential?.type === "api_key" && credential.keyRef !== void 0 && input.apiKeyInfo?.mode === "api-key" && preparedApiKeyProfileId !== void 0 && preparedApiKeyProfileId === input.profileId && input.apiKeyInfo.source === `profile:${preparedApiKeyProfileId}`;
	if (!input.pluginHarnessOwnsAuthBootstrap || input.apiKeyInfo && !resolvedReferencedApiKey || hasInlineCredentialMaterial(credential) || !isModelApi(input.modelApi)) return;
	const resolution = resolveProviderModelRoutes({
		provider: input.provider,
		modelId: input.modelId,
		api: input.modelApi,
		baseUrl: input.modelBaseUrl,
		config: input.config,
		requestTransportOverrides: input.requestTransportOverrides ?? "none"
	});
	if (resolution?.kind !== "routes") return;
	const routes = resolution.routes.filter((route) => route.api === input.modelApi && route.requestTransportOverrides === (input.requestTransportOverrides ?? "none") && (!input.modelBaseUrl || modelMatchesProviderModelRoute({
		provider: input.provider,
		api: input.modelApi,
		baseUrl: input.modelBaseUrl,
		route
	})));
	return routes.length === 1 ? routes[0] : void 0;
}
function isModelApi(value) {
	return MODEL_APIS.includes(value);
}
function hasInlineCredentialMaterial(credential) {
	if (!credential) return false;
	if (credential.type === "api_key") return Boolean(credential.key?.trim());
	if (credential.type === "token") return Boolean(credential.token?.trim());
	return Boolean(credential.access?.trim() && credential.refresh?.trim());
}
function resolvePluginHarnessApiKeyInfo(input) {
	const apiKeyInfo = input.apiKeyInfo;
	const apiKey = apiKeyInfo?.apiKey;
	if (!input.pluginHarnessOwnsTransport || !apiKeyInfo || !apiKey || !looksLikeSecretSentinel(apiKey)) return apiKeyInfo;
	const resolvedApiKey = resolveSecretSentinel(apiKey);
	return resolvedApiKey ? {
		...apiKeyInfo,
		apiKey: resolvedApiKey
	} : null;
}
//#endregion
//#region src/agents/embedded-agent-runner/run/terminal-resolution.ts
const MAX_MISSING_ASSISTANT_RETRIES = 1;
const COMPACTION_CONTINUATION_RETRY_INSTRUCTION = "The previous attempt compacted the conversation context before producing a final user-visible answer. Continue from the compacted transcript and produce the final answer now. Do not restart from scratch, do not repeat completed work, and do not rerun tools unless the transcript clearly lacks required evidence.";
const BEFORE_AGENT_FINALIZE_RETRY_PROMPT_PREFIX = "Before accepting the previous final answer, apply this revision request and produce the revised final answer. Do not repeat completed work or rerun tools unless the request explicitly requires it.";
function createTerminalToolPresentationTracker() {
	let latestOrdinal = -1;
	let nextOrdinal = 0;
	let value;
	return {
		allocateOrdinal: () => nextOrdinal++,
		observe: (observation) => {
			const ordinal = observation.toolCallOrdinal ?? latestOrdinal + 1;
			if (ordinal >= latestOrdinal) {
				latestOrdinal = ordinal;
				value = observation.terminalPresentation;
			}
		},
		read: () => value
	};
}
function resolveSettledTurnFinalizationRequest(input) {
	const terminalAssistant = resolveCurrentAttemptAssistant(input.attempt);
	if (!input.settledTurnFinalizationAvailable || isTerminalAssistantError(terminalAssistant) || resolveSourceReplyDelivery(input.attempt, input.replyDeliveryState) !== "missing") return null;
	const terminalAborted = isEmbeddedRunTerminalAbort(input.terminalState.outcome);
	const terminalTimedOut = isEmbeddedRunTerminalTimeout(input.terminalState.outcome);
	const preparedPayloadCount = countSettledTurnDeliveryPayloads({
		payloads: input.payloadsWithToolMedia,
		attempt: input.attempt
	});
	const silentToolResultReplyPayload = resolveSilentToolResultReplyPayload({
		isCronTrigger: input.runParams.trigger === "cron",
		payloadCount: preparedPayloadCount,
		aborted: terminalAborted,
		timedOut: terminalTimedOut,
		attempt: input.attempt
	});
	const payloadCount = input.recoveredFinalAssistantPayloadsAfterPromptTimeout ? input.recoveredFinalAssistantPayloadsAfterPromptTimeout.length : preparedPayloadCount || (silentToolResultReplyPayload ? 1 : 0);
	if (shouldTreatEmptyAssistantReplyAsSilent({
		terminalReplyExpectation: resolveReplyExpectation(input.runParams),
		payloadCount,
		aborted: terminalAborted,
		timedOut: terminalTimedOut,
		attempt: input.attempt
	})) return null;
	return resolveSettledToolTerminalContinuationInstruction({
		provider: input.activeErrorContext.provider,
		modelId: input.activeErrorContext.model,
		modelApi: input.modelApi,
		executionContract: input.executionContract,
		allowEmptyStopContinuation: resolveReplyExpectation(input.runParams) === "required",
		payloadCount,
		hasTerminalToolPresentation: input.hasTerminalToolPresentation,
		aborted: terminalAborted,
		timedOut: terminalTimedOut,
		attempt: input.attempt
	});
}
async function resolveEmbeddedRunTerminal(input) {
	const { runParams, attempt, retryState } = input;
	const { externalAbort, promptError } = projectAgentRunAttemptTerminal(attempt.terminal);
	const terminalAborted = isEmbeddedRunTerminalAbort(input.terminalState.outcome);
	const terminalTimedOut = isEmbeddedRunTerminalTimeout(input.terminalState.outcome);
	const terminalInterrupted = isEmbeddedRunTerminalInterrupted(input.terminalState.outcome);
	const { signalOwnedInterruption } = input.terminalState;
	const silentToolResultReplyPayload = resolveSilentToolResultReplyPayload({
		isCronTrigger: runParams.trigger === "cron",
		payloadCount: input.payloadsWithToolMedia?.length ?? 0,
		aborted: terminalAborted,
		timedOut: terminalTimedOut,
		attempt
	});
	const payloadsForTerminalPath = input.recoveredFinalAssistantPayloadsAfterPromptTimeout ? input.recoveredFinalAssistantPayloadsAfterPromptTimeout : input.payloadsWithToolMedia?.length ? input.payloadsWithToolMedia : silentToolResultReplyPayload ? [silentToolResultReplyPayload] : input.payloadsWithToolMedia;
	const payloadCount = payloadsForTerminalPath?.length ?? 0;
	const intentionalTerminalCompletion = !terminalAborted && !terminalTimedOut && payloadCount === 0 && resolveSettledToolBatchEvidence(attempt).intentionalTermination;
	const settledTurnFinalizationAttempted = input.settledTurnFinalizationOutcome !== "not-attempted";
	const emptyAssistantReplyIsSilent = shouldTreatEmptyAssistantReplyAsSilent({
		terminalReplyExpectation: input.settledTurnFinalizationOutcome === "silent-fallback" ? "optional" : resolveReplyExpectation(runParams),
		payloadCount,
		aborted: terminalAborted,
		timedOut: terminalTimedOut,
		attempt
	});
	const replyRecoverySuppressed = emptyAssistantReplyIsSilent || resolveSourceReplyDelivery(attempt, input.replyDeliveryState) !== "missing";
	const nextReasoningOnlyRetryInstruction = replyRecoverySuppressed || settledTurnFinalizationAttempted ? null : resolveReasoningOnlyRetryInstruction({
		provider: input.activeErrorContext.provider,
		modelId: input.activeErrorContext.model,
		modelApi: input.modelApi,
		executionContract: input.executionContract,
		aborted: terminalAborted,
		timedOut: terminalTimedOut,
		attempt
	});
	const nextEmptyResponseRetryInstruction = replyRecoverySuppressed || settledTurnFinalizationAttempted ? null : resolveEmptyResponseRetryInstruction({
		provider: input.activeErrorContext.provider,
		modelId: input.activeErrorContext.model,
		modelApi: input.modelApi,
		executionContract: input.executionContract,
		payloadCount,
		aborted: terminalAborted,
		timedOut: terminalTimedOut,
		attempt
	});
	if (nextReasoningOnlyRetryInstruction && retryState.reasoningOnlyAttempts < input.maxReasoningOnlyRetryAttempts) {
		retryState.reasoningOnlyAttempts += 1;
		input.activateInternalPrompt(nextReasoningOnlyRetryInstruction);
		log$3.warn(`reasoning-only assistant turn detected: runId=${runParams.runId} sessionId=${runParams.sessionId} provider=${input.activeErrorContext.provider}/${input.activeErrorContext.model} — retrying ${retryState.reasoningOnlyAttempts}/${input.maxReasoningOnlyRetryAttempts} with visible-answer continuation`);
		return { action: "retry" };
	}
	const reasoningOnlyRetriesExhausted = nextReasoningOnlyRetryInstruction && retryState.reasoningOnlyAttempts >= input.maxReasoningOnlyRetryAttempts;
	if (!replyRecoverySuppressed && !settledTurnFinalizationAttempted && shouldRetryMissingAssistantTurn({
		payloadCount,
		aborted: terminalAborted,
		promptError,
		timedOut: terminalTimedOut,
		attempt
	}) && retryState.missingAssistantAttempts < MAX_MISSING_ASSISTANT_RETRIES) {
		retryState.missingAssistantAttempts += 1;
		input.setSuppressNextUserMessagePersistence(input.activePromptPersisted);
		log$3.warn(`missing assistant terminal message detected: runId=${runParams.runId} sessionId=${runParams.sessionId} provider=${input.activeErrorContext.provider}/${input.activeErrorContext.model} — retrying ${retryState.missingAssistantAttempts}/${MAX_MISSING_ASSISTANT_RETRIES} with same prompt`);
		return { action: "retry" };
	}
	const availableTerminalToolPresentation = input.readTerminalToolPresentation();
	if (!nextReasoningOnlyRetryInstruction && nextEmptyResponseRetryInstruction && retryState.emptyResponseAttempts < input.maxEmptyResponseRetryAttempts) {
		retryState.emptyResponseAttempts += 1;
		input.activateInternalPrompt(nextEmptyResponseRetryInstruction);
		log$3.warn(`empty response detected: runId=${runParams.runId} sessionId=${runParams.sessionId} provider=${input.activeErrorContext.provider}/${input.activeErrorContext.model} — retrying ${retryState.emptyResponseAttempts}/${input.maxEmptyResponseRetryAttempts} with visible-answer continuation`);
		return { action: "retry" };
	}
	const completedEmptyFinalization = input.settledTurnFinalizationOutcome === "completed-empty";
	const terminalAssistantError = isTerminalAssistantError(input.attemptAssistant);
	const incompleteTurnText = replyRecoverySuppressed || completedEmptyFinalization && resolveReplyExpectation(runParams) === "optional" ? null : resolveIncompleteTurnPayloadText({
		payloadCount,
		aborted: terminalAborted,
		externalAbort: externalAbort || signalOwnedInterruption,
		timedOut: terminalTimedOut,
		hadPotentialSideEffects: input.replayState.hadPotentialSideEffects,
		hasIntentionalTerminalCompletion: intentionalTerminalCompletion,
		terminalAuthFailure: input,
		attempt
	});
	const incompleteTurnFallbackSafe = Boolean(incompleteTurnText && !terminalInterrupted && !promptError && !attempt.lastToolError && !hasAttemptTerminalState(attempt) && !terminalAssistantError && !input.replayState.hadPotentialSideEffects);
	const terminalToolPresentation = incompleteTurnFallbackSafe ? availableTerminalToolPresentation : void 0;
	if (!replyRecoverySuppressed && !settledTurnFinalizationAttempted && (input.attemptCompactionCount > 0 || isCompactionReplayCheckpoint(input.attemptAssistant?.providerReplay)) && payloadCount === 0 && !terminalInterrupted && !promptError && !attempt.clientToolCalls && !attempt.yieldDetected && !attempt.didSendDeterministicApprovalPrompt && !attempt.lastToolError && !terminalAssistantError && !input.replayState.hadPotentialSideEffects && retryState.compactionContinuationAttempts < 1) {
		retryState.compactionContinuationAttempts += 1;
		input.activateCompactionContinuation(COMPACTION_CONTINUATION_RETRY_INSTRUCTION);
		log$3.warn(`compaction interrupted visible final answer: runId=${runParams.runId} sessionId=${runParams.sessionId} compactions=${input.attemptCompactionCount} — retrying ${retryState.compactionContinuationAttempts}/1 with compacted-transcript continuation`);
		input.armPostCompactionGuard();
		return { action: "retry" };
	}
	input.clearCompactionContinuation();
	if (reasoningOnlyRetriesExhausted && !input.finalAssistantVisibleText) {
		const incompletePayloadText = "⚠️ Agent couldn't generate a response. Please try again.";
		log$3.warn(`reasoning-only retries exhausted: runId=${runParams.runId} sessionId=${runParams.sessionId} provider=${input.activeErrorContext.provider}/${input.activeErrorContext.model} attempts=${retryState.reasoningOnlyAttempts}/${input.maxReasoningOnlyRetryAttempts} — surfacing incomplete-turn error`);
		return completeEmbeddedRun({
			...input,
			incompleteTurnText: incompletePayloadText,
			payloadCount: 0,
			incompleteTurnFallbackSafe,
			terminalToolPresentation
		});
	}
	if (!nextReasoningOnlyRetryInstruction && nextEmptyResponseRetryInstruction && retryState.emptyResponseAttempts >= input.maxEmptyResponseRetryAttempts) log$3.warn(`empty response retries exhausted: runId=${runParams.runId} sessionId=${runParams.sessionId} provider=${input.activeErrorContext.provider}/${input.activeErrorContext.model} attempts=${retryState.emptyResponseAttempts}/${input.maxEmptyResponseRetryAttempts} — surfacing incomplete-turn error`);
	if (incompleteTurnText) {
		const incompleteStopReason = input.attemptAssistant?.stopReason;
		log$3.warn(`incomplete turn detected: runId=${runParams.runId} sessionId=${runParams.sessionId} provider=${input.activeErrorContext.provider}/${input.activeErrorContext.model} stopReason=${incompleteStopReason ?? "missing"} hasLastAssistant=${attempt.lastAssistant ? "yes" : "no"} hasCurrentAttemptAssistant=${attempt.currentAttemptAssistant ? "yes" : "no"} payloads=${payloadCount} tools=${attempt.toolMetas?.length ?? 0} replaySafe=${attempt.replayMetadata.replaySafe ? "yes" : "no"} compactions=${input.attemptCompactionCount} reasoningRetries=${retryState.reasoningOnlyAttempts}/${input.maxReasoningOnlyRetryAttempts} emptyRetries=${retryState.emptyResponseAttempts}/${input.maxEmptyResponseRetryAttempts} missingAssistantRetries=${retryState.missingAssistantAttempts}/${MAX_MISSING_ASSISTANT_RETRIES} — ` + (terminalToolPresentation ? "surfacing tool-authored terminal presentation" : "surfacing error to user"));
		return completeEmbeddedRun({
			...input,
			incompleteTurnText,
			payloadCount,
			incompleteTurnFallbackSafe,
			terminalToolPresentation
		});
	}
	const beforeFinalizeRevisionReason = attempt.beforeAgentFinalizeRevisionReason;
	if (beforeFinalizeRevisionReason && !settledTurnFinalizationAttempted && !terminalInterrupted && !promptError && !attempt.clientToolCalls && !attempt.yieldDetected && !emptyAssistantReplyIsSilent) {
		retryState.beforeFinalizeRevisionAttempts += 1;
		input.activateInternalPrompt(`${BEFORE_AGENT_FINALIZE_RETRY_PROMPT_PREFIX}\n\n${beforeFinalizeRevisionReason}`);
		input.markOwnedTranscriptRetry();
		log$3.warn(`before_agent_finalize requested one more pass: runId=${runParams.runId} sessionId=${runParams.sessionId} attempt=${retryState.beforeFinalizeRevisionAttempts}/3`);
		return { action: "retry" };
	}
	return completeEmbeddedRun({
		...input,
		payloadCount,
		payloadsForTerminalPath,
		emptyAssistantReplyIsSilent,
		intentionalTerminalCompletion
	});
}
async function completeEmbeddedRun(input) {
	const terminalAborted = isEmbeddedRunTerminalAbort(input.terminalState.outcome);
	const terminalTimedOut = isEmbeddedRunTerminalTimeout(input.terminalState.outcome);
	const error = input.incompleteTurnText !== void 0 || classifyAgentRunTerminalOutcome(input.terminalState.outcome) === "failure" ? {
		kind: "incomplete_turn",
		message: formatErrorMessage(projectAgentRunAttemptTerminal(input.attempt.terminal).promptError ?? input.terminalState.outcome.error ?? "Agent couldn't generate a response."),
		fallbackSafe: input.incompleteTurnFallbackSafe ?? false,
		terminalPresentation: input.terminalToolPresentation !== void 0
	} : void 0;
	const incompleteTurnText = input.incompleteTurnText ?? error?.message ?? null;
	const replayInvalid = input.resolveReplayInvalid(incompleteTurnText);
	const yieldHasContinuation = input.attempt.yieldDetected && hasYieldContinuationEvidence(input.attempt);
	const livenessState = !error && input.attempt.yieldDetected ? "paused" : resolveRunLivenessState({
		payloadCount: input.payloadCount,
		aborted: terminalAborted,
		timedOut: terminalTimedOut,
		attempt: input.attempt,
		incompleteTurnText
	});
	const stopReason = terminalAborted ? input.terminalState.outcome.stopReason : error ? void 0 : input.attempt.clientToolCalls ? "tool_calls" : input.attempt.yieldDetected ? "end_turn" : input.attemptAssistant?.stopReason;
	if (error) {
		input.setTerminalLifecycleMeta({
			replayInvalid,
			livenessState
		});
		if (input.authProfileId) try {
			await input.maybeMarkAuthProfileFailure({
				profileId: input.authProfileId,
				reason: input.assistantProfileFailureReason,
				modelId: input.modelId
			});
		} catch (bookkeepingError) {
			log$3.warn(`terminal auth bookkeeping failed; preserving result: ${String(bookkeepingError)}`);
		}
	} else {
		log$3.debug(`embedded run done: runId=${input.runParams.runId} sessionId=${input.runParams.sessionId} durationMs=${Date.now() - input.startedAtMs} aborted=${terminalAborted}`);
		markEmbeddedRunAuthProfileSuccess({
			authProfileStateMode: input.runParams.authProfileStateMode,
			profileId: input.authProfileId,
			profileStore: input.profileFailureStore,
			provider: input.provider,
			agentDir: input.runParams.agentDir,
			runId: input.runParams.runId,
			sessionId: input.runParams.sessionId
		});
		reportEmbeddedRunSuccessfulAuthBinding({
			profileId: input.authProfileId,
			profileStore: input.attemptAuthProfileStore,
			apiKeyInfo: input.apiKeyInfo,
			attempt: input.attempt,
			provider: input.provider,
			agentDir: input.runParams.agentDir,
			modelId: input.modelTransportId,
			modelApi: input.modelTransportApi,
			...input.modelTransportBaseUrl ? { modelBaseUrl: input.modelTransportBaseUrl } : {},
			requestTransportOverrides: input.requestTransportOverrides ?? "none",
			config: input.runParams.config,
			agentHarnessId: input.agentHarnessId,
			pluginHarnessOwnsTransport: input.pluginHarnessOwnsTransport,
			pluginHarnessOwnsAuthBootstrap: input.pluginHarnessOwnsAuthBootstrap,
			onSuccessfulAuthBinding: input.runParams.onSuccessfulAuthBinding
		});
		input.runParams.onSuccessfulAuthProfile?.(input.authProfileId);
	}
	const acceptedSessionSpawnContinuation = !error && shouldContinueInteractiveAcceptedSessionSpawns({
		attempt: input.attempt,
		run: input.runParams
	});
	const keepEmptyReplySilent = input.runParams.lane !== AGENT_LANE_SUBAGENT || Boolean(input.finalAssistantRawText?.trim());
	const hasPartialAssistantText = input.attempt.assistantTexts.some((text) => text.trim().length > 0) || resolveFinalAssistantVisibleText(input.attemptAssistant) !== void 0;
	const isTruncatedPartialReply = stopReason === "length" && !hasAttemptTerminalState(input.attempt) && hasPartialAssistantText;
	const terminalPayloads = input.incompleteTurnText !== void 0 ? [{
		text: input.terminalToolPresentation ? input.terminalToolPresentation.concat("\n\n", input.incompleteTurnText) : input.incompleteTurnText,
		isError: true
	}] : error ? input.payloadsForTerminalPath : input.emptyAssistantReplyIsSilent ? [{ text: SILENT_REPLY_TOKEN }] : input.payloadsForTerminalPath?.length ? isTruncatedPartialReply ? [...input.payloadsForTerminalPath, { text: TRUNCATED_REPLY_NOTICE_TEXT }] : input.payloadsForTerminalPath : input.attempt.yieldDetected && !yieldHasContinuation ? [{ text: YIELD_DIAGNOSTIC_TEXT }] : input.payloadsForTerminalPath;
	if (!error) input.setTerminalLifecycleMeta({
		replayInvalid,
		livenessState,
		stopReason,
		yielded: input.attempt.yieldDetected === true
	});
	return {
		action: "complete",
		result: {
			payloads: terminalPayloads?.length ? terminalPayloads : void 0,
			...!error && input.attempt.diagnosticTrace ? { diagnosticTrace: freezeDiagnosticTraceContext(input.attempt.diagnosticTrace) } : {},
			meta: {
				durationMs: Date.now() - input.startedAtMs,
				agentMeta: input.agentMeta,
				aborted: terminalAborted,
				systemPromptReport: input.attempt.systemPromptReport,
				finalPromptText: input.attempt.finalPromptText,
				finalAssistantVisibleText: input.finalAssistantVisibleText,
				finalAssistantRawText: input.finalAssistantRawText,
				replayInvalid,
				livenessState,
				agentHarnessResultClassification: input.attempt.agentHarnessResultClassification,
				...error ? { error } : {
					...input.attempt.yieldDetected ? { yielded: true } : {},
					...input.attempt.yieldAcknowledgment ? { yieldAcknowledgment: input.attempt.yieldAcknowledgment } : {},
					...acceptedSessionSpawnContinuation ? { continuationPending: true } : {},
					...input.emptyAssistantReplyIsSilent && keepEmptyReplySilent ? { terminalReplyKind: "silent-empty" } : {},
					...input.intentionalTerminalCompletion ? { intentionalTerminalCompletion: "tool-batch" } : {},
					stopReason,
					pendingToolCalls: input.attempt.clientToolCalls?.map((call) => ({
						id: randomBytes(5).toString("hex").slice(0, 9),
						name: call.name,
						arguments: JSON.stringify(call.params)
					})),
					executionTrace: {
						winnerProvider: input.reportedModelRef.provider,
						winnerModel: input.reportedModelRef.model,
						attempts: input.traceAttempts.length > 0 || input.attemptAssistant?.provider || input.attemptAssistant?.model ? [...input.traceAttempts, {
							provider: input.reportedModelRef.provider,
							model: input.reportedModelRef.model,
							result: "success",
							stage: "assistant"
						}] : void 0,
						fallbackUsed: input.traceAttempts.some(input.traceAttemptUsesFallback),
						runner: "embedded"
					},
					requestShaping: {
						...input.authProfileId ? { authMode: "auth-profile" } : {},
						...input.thinkLevel ? { thinking: input.thinkLevel } : {},
						...input.runParams.reasoningLevel ? { reasoning: input.runParams.reasoningLevel } : {},
						...input.runParams.verboseLevel ? { verbose: input.runParams.verboseLevel } : {},
						...input.runParams.blockReplyBreak ? { blockStreaming: input.runParams.blockReplyBreak } : {}
					},
					completion: {
						...stopReason ? { stopReason } : {},
						...stopReason ? { finishReason: stopReason } : {},
						...stopReason?.toLowerCase().includes("refusal") ? { refusal: true } : {}
					},
					contextManagement: input.contextRecoveryState.autoCompactionCount > 0 ? { lastTurnCompactions: input.contextRecoveryState.autoCompactionCount } : void 0
				},
				toolSummary: input.attemptToolSummary,
				...input.failureSignal ? { failureSignal: input.failureSignal } : {},
				...input.terminalToolFailure ? { terminalToolFailure: input.terminalToolFailure } : {}
			},
			...copyAttemptDeliveryState(input.attempt),
			sourceReplyDeliveryState: resolveSourceReplyDelivery(input.attempt, input.replyDeliveryState)
		}
	};
}
//#endregion
//#region src/agents/embedded-agent-runner/run/settled-turn-finalization.ts
const MAX_EMPTY_SETTLED_FINALIZATION_ATTEMPTS = 2;
const SETTLED_TOOL_FINALIZATION_FALLBACK_TEXT = "The tool run finished, but no final summary was produced. I did not repeat any completed actions.";
async function prepareTerminalWithSettledTurnFinalization(input) {
	const initial = input.initial;
	let attempt = initial.attempt;
	let lastRunPromptUsage = input.lastRunPromptUsage;
	const minimumAssistantMessageIndex = (attempt.answerSegments?.at(-1)?.messageEnd ?? -1) + 1;
	const observeSourceDelivery = () => observeReplyDelivery(input.terminalBase.runParams.resolveReplyDelivery, minimumAssistantMessageIndex, (error) => log$3.warn(`reply delivery observation failed; retaining custody: ${formatErrorMessage(error)}`));
	const replyDeliveryState = await observeSourceDelivery();
	let prepared = prepareEmbeddedRunTerminal({
		...input.terminalBase,
		replyDeliveryState,
		attempt,
		currentAttemptCompletedAssistant: initial.currentAttemptCompletedAssistant,
		sessionIdUsed: initial.sessionIdUsed,
		sessionFileUsed: initial.sessionFileUsed,
		lastRunPromptUsage,
		terminalState: initial.terminalState
	});
	const prompt = resolveSettledTurnFinalizationRequest({
		runParams: input.terminalBase.runParams,
		attempt,
		activeErrorContext: input.terminalBase.activeErrorContext,
		modelApi: input.finalization.modelApi,
		executionContract: input.finalization.executionContract,
		payloadsWithToolMedia: prepared.payloadsWithToolMedia,
		recoveredFinalAssistantPayloadsAfterPromptTimeout: prepared.recoveredFinalAssistantPayloadsAfterPromptTimeout,
		hasTerminalToolPresentation: input.finalization.hasTerminalToolPresentation,
		terminalState: initial.terminalState,
		replyDeliveryState,
		settledTurnFinalizationAvailable: !input.terminalBase.runParams.providerReviewAcknowledgment && typeof input.finalization.harness.finalizeSettledTurn === "function"
	});
	if (!prompt) return {
		...initial,
		prepared,
		lastRunPromptUsage,
		finalizationOutcome: "not-attempted"
	};
	const assertFinalizationActive = resolveAdmittedRunActiveAssertion(input.finalization.preparedAttempt.admittedRunContext, input.finalization.abortSignal);
	if (!assertFinalizationActive) throw new Error("admitted run authority is no longer active");
	const committedSessionTarget = resolveCommittedSessionTarget({
		preparedAttempt: input.finalization.preparedAttempt,
		sessionTarget: input.finalization.sessionTarget,
		sessionWriterFence: input.finalization.sessionWriterFence
	});
	const sessionWriterDeliveryAuthority = resolveSessionWriterDeliveryAuthority({
		attempt: input.finalization.preparedAttempt,
		sessionId: committedSessionTarget?.sessionId ?? initial.sessionIdUsed,
		sessionTarget: committedSessionTarget
	});
	const runParams = input.terminalBase.runParams;
	const errorContext = input.terminalBase.activeErrorContext;
	const preserveOriginalTerminal = Boolean(initial.attempt.lastToolError) || isEmbeddedRunTerminalTimeout(initial.terminalState.outcome);
	const terminalFallbackAllowed = input.finalization.preparedAttempt.silentExpected !== true && !preserveOriginalTerminal;
	log$3.warn(`settled post-tool turn lacked a final answer: runId=${runParams.runId} sessionId=${runParams.sessionId} provider=${errorContext.provider}/${errorContext.model} — running isolated finalization`);
	let finalizationOutcome = "failed";
	try {
		let finalization;
		let finalizationAttempt = 0;
		do {
			finalizationAttempt += 1;
			assertFinalizationActive();
			finalization = await runPreparedSettledTurnFinalization({
				attempt: {
					...input.finalization.preparedAttempt,
					...committedSessionTarget ? { sessionTarget: committedSessionTarget } : {},
					sessionId: committedSessionTarget?.sessionId ?? initial.sessionIdUsed,
					sessionFile: initial.sessionFileUsed ?? input.finalization.preparedAttempt.sessionFile
				},
				settledAttempt: initial.attempt,
				harness: input.finalization.harness,
				prompt,
				createAttemptControls: input.finalization.createAttemptControls,
				abortSignal: input.finalization.abortSignal
			});
			assertFinalizationActive();
			attempt = finalization.attempt;
			if (finalization.outcome === "empty" && runParams.terminalReplyExpectation === "optional" && !initial.attempt.lastToolError && shouldTreatEmptyAssistantReplyAsSilent({
				terminalReplyExpectation: "optional",
				onlyExplicitSilentReply: true,
				payloadCount: 0,
				aborted: input.finalization.abortSignal.aborted,
				timedOut: isEmbeddedRunTerminalTimeout(initial.terminalState.outcome),
				attempt
			})) finalization.outcome = "answered";
			mergeUsageIntoAccumulator(input.terminalBase.usageAccumulator, attempt.attemptUsage);
			mergeAttemptRunStatsIntoAccumulator(input.terminalBase.usageAccumulator, attempt);
			lastRunPromptUsage = attempt.attemptUsage ?? lastRunPromptUsage;
			if (finalization.outcome === "empty" && finalizationAttempt < MAX_EMPTY_SETTLED_FINALIZATION_ATTEMPTS) log$3.warn(`settled-turn finalization completed without a visible answer: runId=${runParams.runId} sessionId=${runParams.sessionId} provider=${errorContext.provider}/${errorContext.model} — retrying ${finalizationAttempt}/1 with tools disabled`);
		} while (finalization.outcome === "empty" && finalizationAttempt < MAX_EMPTY_SETTLED_FINALIZATION_ATTEMPTS);
		finalizationOutcome = finalization.outcome;
		if (finalization.outcome === "empty") log$3.warn(`settled-turn finalization completed without a visible answer: runId=${runParams.runId} sessionId=${runParams.sessionId} provider=${errorContext.provider}/${errorContext.model} attempts=${finalizationAttempt}/${MAX_EMPTY_SETTLED_FINALIZATION_ATTEMPTS} — ${terminalFallbackAllowed ? "using terminal fallback reply" : "preserving original failure"}`);
	} catch (error) {
		if (input.finalization.abortSignal.aborted) {
			log$3.warn(`settled-turn finalization was cancelled: runId=${runParams.runId} sessionId=${runParams.sessionId} provider=${errorContext.provider}/${errorContext.model} error=${formatErrorMessage(error)} — preserving cancellation`);
			return {
				...initial,
				prepared,
				lastRunPromptUsage,
				finalizationOutcome: "failed"
			};
		}
		log$3.warn(`settled-turn finalization failed: runId=${runParams.runId} sessionId=${runParams.sessionId} provider=${errorContext.provider}/${errorContext.model} error=${formatErrorMessage(error)} — ${terminalFallbackAllowed ? "using terminal fallback reply" : "preserving original failure"}`);
	}
	if (finalizationOutcome !== "answered" && input.finalization.abortSignal.aborted) {
		log$3.warn(`settled-turn finalization was cancelled before terminal delivery: runId=${runParams.runId} sessionId=${runParams.sessionId} provider=${errorContext.provider}/${errorContext.model} — preserving cancellation`);
		return {
			...initial,
			prepared,
			lastRunPromptUsage,
			finalizationOutcome: "failed"
		};
	}
	if (finalizationOutcome !== "answered" && terminalFallbackAllowed) {
		const fallbackText = runParams.trigger === "cron" ? SILENT_REPLY_TOKEN : SETTLED_TOOL_FINALIZATION_FALLBACK_TEXT;
		const transcriptIdempotencyKey = await persistSettledToolFallbackTranscript({
			text: fallbackText,
			attempt: input.finalization.preparedAttempt,
			abortSignal: input.finalization.abortSignal,
			assertActive: assertFinalizationActive,
			sessionId: committedSessionTarget?.sessionId ?? initial.sessionIdUsed,
			sessionTarget: committedSessionTarget
		});
		if (input.finalization.abortSignal.aborted) {
			log$3.warn(`settled-turn fallback was cancelled during transcript persistence: runId=${runParams.runId} sessionId=${runParams.sessionId} provider=${errorContext.provider}/${errorContext.model} — preserving cancellation`);
			return {
				...initial,
				prepared,
				lastRunPromptUsage,
				finalizationOutcome: "failed"
			};
		}
		attempt = buildSettledToolFallbackAttemptResult({
			text: fallbackText,
			settledAttempt: initial.attempt,
			sourceAttempt: attempt,
			prompt,
			agentHarnessId: input.finalization.preparedAttempt.agentHarnessId,
			runtimePlan: input.finalization.preparedAttempt.runtimePlan,
			transcriptIdempotencyKey
		});
		if (runParams.trigger === "cron") finalizationOutcome = "silent-fallback";
	}
	const completion = finalizationOutcome !== "answered" && preserveOriginalTerminal ? initial : {
		attempt,
		attemptAssistant: attempt.currentAttemptAssistant,
		currentAttemptCompletedAssistant: attempt.currentAttemptCompletedAssistant,
		terminalState: {
			outcome: resolveEmbeddedRunAttemptTerminalOutcome({
				attempt,
				assistant: attempt.currentAttemptAssistant
			}),
			signalOwnedInterruption: false
		},
		attemptCompactionCount: 0,
		sessionIdUsed: attempt.sessionIdUsed,
		sessionFileUsed: attempt.sessionFileUsed
	};
	const finalizedPrepared = prepareEmbeddedRunTerminal({
		...input.terminalBase,
		...completion,
		replyDeliveryState: await observeSourceDelivery(),
		lastRunPromptUsage
	});
	finalizedPrepared.payloadsWithToolMedia?.forEach((payload) => {
		if (finalizationOutcome === "answered") markReplyPayloadForSourceSuppressionDelivery(payload);
		if (sessionWriterDeliveryAuthority) setReplyPayloadMetadata(payload, { sessionWriterDeliveryAuthority });
	});
	prepared = {
		...finalizedPrepared,
		payloadsWithToolMedia: finalizedPrepared.replyDeliveryState === "missing" ? finalizedPrepared.payloadsWithToolMedia : finalizedPrepared.payloadsWithToolMedia?.filter((payload) => !isReplyPayloadTerminalContent(payload)),
		...finalizationOutcome !== "answered" && runParams.sourceReplyDeliveryMode === "message_tool_only" ? {
			finalAssistantVisibleText: "",
			finalAssistantRawText: ""
		} : {},
		attemptToolSummary: prepared.attemptToolSummary,
		failureSignal: prepared.failureSignal,
		terminalToolFailure: prepared.terminalToolFailure
	};
	return {
		...completion,
		prepared,
		lastRunPromptUsage,
		finalizationOutcome: completion === initial ? "failed" : finalizationOutcome === "empty" ? "completed-empty" : finalizationOutcome
	};
}
function resolveSessionWriterDeliveryAuthority(input) {
	const target = input.sessionTarget ?? input.attempt.sessionTarget;
	const sessionKey = target?.sessionKey ?? input.attempt.sessionKey;
	const expectedLifecycleRevision = target?.expectedLifecycleRevision;
	const expectedWriterRunId = target?.expectedWriterRunId;
	if (!sessionKey || expectedLifecycleRevision === void 0 && expectedWriterRunId === void 0) return;
	return {
		...target?.agentId || input.attempt.agentId ? { agentId: target?.agentId ?? input.attempt.agentId } : {},
		expectedSessionId: input.sessionId,
		...expectedLifecycleRevision !== void 0 ? { expectedLifecycleRevision } : {},
		...expectedWriterRunId !== void 0 ? { expectedWriterRunId } : {},
		sessionKey,
		...target?.storePath ? { storePath: target.storePath } : {}
	};
}
function resolveCommittedSessionTarget(input) {
	const preparedTarget = input.preparedAttempt.sessionTarget;
	if (!preparedTarget && !input.sessionTarget && !input.sessionWriterFence) return;
	return {
		...preparedTarget,
		...input.sessionTarget,
		...input.sessionWriterFence
	};
}
async function runPreparedSettledTurnFinalization(input) {
	const controls = input.createAttemptControls({
		admittedRunContext: input.attempt.admittedRunContext,
		abortSignal: input.abortSignal,
		initialTimeoutMs: resolveAgentTimeoutMs({
			cfg: input.attempt.config,
			overrideMs: input.attempt.timeoutMs
		})
	});
	try {
		const callerIdentity = createAdmittedGatewayToolCallerIdentity({
			admittedRunContext: input.attempt.admittedRunContext,
			agentId: input.attempt.agentId,
			sessionKey: input.attempt.sessionKey
		});
		const finalization = await withGatewayToolCallerIdentity(callerIdentity, () => runEmbeddedSettledTurnFinalizationWithBackend({
			...input.attempt,
			abortSignal: controls.abortSignal,
			onAttemptDeadlineChanged: controls.onAttemptDeadlineChanged,
			onAttemptTimeout: controls.onAttemptTimeout,
			onAttemptAbort: controls.onAttemptAbort,
			onAttemptTimeoutArmed: void 0,
			operation: "settled-tool-finalization",
			prompt: input.prompt,
			disableTools: true,
			skipPreparedUserTurnMessage: true,
			suppressNextUserMessagePersistence: true,
			initialReplayState: {
				replayInvalid: false,
				hadPotentialSideEffects: false
			}
		}, input.settledAttempt, input.harness));
		return {
			outcome: finalization.outcome,
			attempt: buildSettledTurnFinalizationAttemptResult({
				outcome: finalization.outcome,
				result: finalization.result,
				settledAttempt: input.settledAttempt,
				prompt: input.prompt,
				agentHarnessId: input.attempt.agentHarnessId,
				runtimePlan: input.attempt.runtimePlan
			})
		};
	} finally {
		controls.close();
	}
}
function buildSettledTurnFinalizationAttemptResult(input) {
	const { result, settledAttempt } = input;
	const authoredText = resolveFinalAssistantVisibleText(result.assistant) ?? "";
	const text = input.outcome === "empty" ? isSilentReplyText(authoredText) ? authoredText : "" : resolveSettledTurnFinalizationText(result);
	return {
		terminal: { kind: "ok" },
		sessionIdUsed: settledAttempt.sessionIdUsed,
		sessionFileUsed: settledAttempt.sessionFileUsed,
		...input.agentHarnessId ? { agentHarnessId: input.agentHarnessId } : {},
		modelAttempt: resolveRuntimeModelAttempt(input.runtimePlan),
		...settledAttempt.runtimeModelSelection ? { runtimeModelSelection: settledAttempt.runtimeModelSelection } : {},
		contextTokens: settledAttempt.contextTokens,
		contextTokensSource: settledAttempt.contextTokensSource,
		authBindingFingerprint: settledAttempt.authBindingFingerprint,
		runtimeArtifact: settledAttempt.runtimeArtifact,
		systemPromptReport: settledAttempt.systemPromptReport,
		finalPromptText: input.prompt,
		...copyAttemptDeliveryState(settledAttempt),
		messagesSnapshot: [...settledAttempt.messagesSnapshot, result.assistant],
		assistantTexts: [text],
		assistantTranscriptOwned: result.assistantTranscriptOwned,
		assistantTranscriptIdempotencyKey: result.assistantTranscriptIdempotencyKey,
		lastAssistantTextMessageIndex: result.assistantMessageIndex,
		lastAssistant: result.assistant,
		currentAttemptAssistant: result.assistant,
		currentAttemptCompletedAssistant: result.assistant,
		toolMetas: settledAttempt.toolMetas,
		successfulNestedToolNames: settledAttempt.successfulNestedToolNames,
		hasToolMediaBlockReply: false,
		cloudCodeAssistFormatError: false,
		attemptUsage: result.usage,
		codeModeEngaged: settledAttempt.codeModeEngaged,
		assistantTurns: 1,
		replayMetadata: {
			hadPotentialSideEffects: false,
			replaySafe: true
		},
		currentAttemptReplayMetadata: {
			hadPotentialSideEffects: false,
			replaySafe: true
		},
		itemLifecycle: {
			startedCount: 0,
			completedCount: 0,
			activeCount: 0
		},
		diagnosticTrace: result.diagnosticTrace
	};
}
function buildSettledToolFallbackAttemptResult(input) {
	const sourceAssistant = input.sourceAttempt.currentAttemptAssistant ?? input.sourceAttempt.lastAssistant ?? input.settledAttempt.currentAttemptAssistant ?? input.settledAttempt.lastAssistant ?? resolveSettledToolBatchEvidence(input.settledAttempt).assistant;
	if (!sourceAssistant) throw new Error("Settled-turn fallback has no assistant identity");
	const assistant = {
		...sourceAssistant,
		content: [{
			type: "text",
			text: input.text
		}],
		openclawDelivery: void 0,
		stopReason: "stop",
		errorMessage: void 0,
		errorCode: void 0,
		errorType: void 0,
		errorBody: void 0,
		timestamp: Date.now()
	};
	return buildSettledTurnFinalizationAttemptResult({
		outcome: isSilentReplyText(input.text) ? "empty" : "answered",
		result: {
			assistant,
			usage: input.sourceAttempt.attemptUsage,
			diagnosticTrace: input.sourceAttempt.diagnosticTrace,
			...input.transcriptIdempotencyKey ? {
				assistantTranscriptOwned: true,
				assistantTranscriptIdempotencyKey: input.transcriptIdempotencyKey
			} : {}
		},
		settledAttempt: input.settledAttempt,
		prompt: input.prompt,
		agentHarnessId: input.agentHarnessId,
		runtimePlan: input.runtimePlan
	});
}
async function persistSettledToolFallbackTranscript(input) {
	input.assertActive();
	const target = input.sessionTarget ?? input.attempt.sessionTarget;
	const sessionKey = target?.sessionKey ?? input.attempt.sessionKey;
	const hasWriterFence = target?.expectedLifecycleRevision !== void 0 || target?.expectedWriterRunId !== void 0;
	if (!sessionKey) {
		if (hasWriterFence) throw new SessionTranscriptWriterClaimReboundError();
		return;
	}
	const idempotencyKey = `${input.attempt.runId}:settled-finalization-fallback`;
	try {
		const resolvedTarget = await resolveAgentRunSessionTarget({
			agentId: target?.agentId ?? input.attempt.agentId,
			config: input.attempt.config,
			missingSessionKey: "resolve-existing",
			sessionId: input.sessionId,
			sessionKey,
			sessionTarget: target
		});
		if (input.abortSignal.aborted) return;
		input.assertActive();
		const fencedTarget = {
			...resolvedTarget,
			sessionId: input.sessionId,
			expectedLifecycleRevision: target?.expectedLifecycleRevision,
			expectedWriterRunId: target?.expectedWriterRunId
		};
		const result = await withOwnedSessionTranscriptWrites({
			sessionTarget: fencedTarget,
			assertCommitAllowed: input.assertActive,
			withTranscriptWrite: async (write) => await write()
		}, () => appendAssistantMirrorMessageByIdentity({
			...fencedTarget,
			config: input.attempt.config,
			idempotencyKey,
			signal: input.abortSignal,
			text: input.text
		}));
		if (input.abortSignal.aborted) return;
		input.assertActive();
		if (!result.ok) {
			if (hasWriterFence || result.code === "session-rebound") throw new SessionTranscriptWriterClaimReboundError();
			log$3.warn(`settled-turn fallback transcript append skipped: runId=${input.attempt.runId} sessionId=${input.sessionId} reason=${result.reason}`);
			return;
		}
		return idempotencyKey;
	} catch (error) {
		if (input.abortSignal.aborted) return;
		input.assertActive();
		if (error instanceof SessionTranscriptWriterClaimReboundError) throw error;
		log$3.warn(`settled-turn fallback transcript append failed: runId=${input.attempt.runId} sessionId=${input.sessionId} error=${formatErrorMessage(error)}`);
		return;
	}
}
//#endregion
//#region src/agents/embedded-agent-runner/run/terminal-timeout.ts
function resolveEmbeddedRunTerminalTimeout(input) {
	const timeoutFinal = isEmbeddedRunTimeoutFinal(input.attempt);
	if (!input.terminalPrepared.timedOutDuringPrompt || !timeoutFinal && (input.terminalPrepared.hasSuccessfulFinalAssistantAfterPromptTimeout || hasMessagingToolDeliveryEvidence(input.attempt))) return;
	const { idleTimedOut } = projectAgentRunAttemptTerminal(input.attempt.terminal);
	const terminalAborted = isEmbeddedRunTerminalAbort(input.terminalState.outcome);
	const terminalTimedOut = isEmbeddedRunTerminalTimeout(input.terminalState.outcome);
	const defaultTimeoutText = idleTimedOut ? "The model did not produce a response before the model idle timeout. Please try again, or increase `models.providers.<id>.timeoutSeconds` for slow local or self-hosted providers. If `agents.defaults.timeoutSeconds` or a run-specific timeout is lower, raise that ceiling too; provider timeouts cannot extend the whole agent run." : "Request timed out before a response was generated. Please try again, or increase `agents.defaults.timeoutSeconds` in your config.";
	const timeoutText = input.attempt.promptTimeoutOutcome?.message?.trim() || defaultTimeoutText;
	const replayInvalid = input.attempt.promptTimeoutOutcome?.replayInvalid ?? input.resolveReplayInvalid(null);
	const livenessState = input.attempt.promptTimeoutOutcome?.livenessState ?? resolveRunLivenessState({
		payloadCount: input.terminalPrepared.hasPartialAssistantTextAfterPromptTimeout ? 0 : input.terminalPrepared.payloads?.length ?? 0,
		aborted: terminalAborted,
		timedOut: terminalTimedOut,
		attempt: input.attempt,
		incompleteTurnText: null
	});
	const timeoutPhase = input.attempt.promptTimeoutOutcome?.timeoutPhase ?? input.terminalState.outcome.timeoutPhase;
	const providerStarted = input.attempt.promptTimeoutOutcome?.providerStarted ?? input.terminalState.outcome.providerStarted;
	const timeoutAttribution = {
		...timeoutPhase ? { timeoutPhase } : {},
		...typeof providerStarted === "boolean" ? { providerStarted } : {}
	};
	input.setTerminalLifecycleMeta({
		replayInvalid,
		livenessState,
		...timeoutAttribution
	});
	return {
		payloads: [...input.terminalPrepared.hasPartialAssistantTextAfterPromptTimeout && !timeoutFinal ? [] : input.terminalPrepared.payloadsWithToolMedia || [], {
			text: timeoutText,
			isError: true
		}],
		meta: {
			modelFallbackStopReason: "agent_run_terminal_timeout",
			durationMs: Date.now() - input.startedAtMs,
			agentMeta: input.terminalPrepared.agentMeta,
			aborted: terminalAborted,
			systemPromptReport: input.attempt.systemPromptReport,
			finalPromptText: input.attempt.finalPromptText,
			finalAssistantVisibleText: input.terminalPrepared.finalAssistantVisibleText,
			finalAssistantRawText: input.terminalPrepared.finalAssistantRawText,
			replayInvalid,
			livenessState,
			...timeoutAttribution,
			error: {
				kind: "incomplete_turn",
				message: timeoutText,
				fallbackSafe: false
			},
			toolSummary: input.terminalPrepared.attemptToolSummary,
			...input.terminalPrepared.failureSignal ? { failureSignal: input.terminalPrepared.failureSignal } : {},
			...input.terminalPrepared.terminalToolFailure ? { terminalToolFailure: input.terminalPrepared.terminalToolFailure } : {},
			agentHarnessResultClassification: input.attempt.agentHarnessResultClassification
		},
		...copyAttemptDeliveryState(input.attempt)
	};
}
//#endregion
//#region src/agents/embedded-agent-runner/run/turn-taint-state.ts
/** Sticky current-turn taint shared by retries and runtime-specific tool owners. */
function createAgentTurnTaintState(initiallyTainted = false) {
	let tainted = initiallyTainted;
	return {
		observe(observation) {
			if (!observation.presentationOnly && observation.resultContentSource === "network") tainted = true;
		},
		isTainted: () => tainted
	};
}
//#endregion
//#region src/agents/embedded-agent-runner/run-loop.ts
async function runPreparedEmbeddedLoop(refresh, input) {
	let { runParams: params, provider, modelId } = input;
	const { agentDir, workspaceDir: resolvedWorkspace, globalLane, hookRunner, hookContext: hookCtx, fallbackConfigured, isProbeSession, resolvedSessionKey, startedAtMs: started, startupStages, lifecycleGeneration, suspendForFailure } = input;
	const { notifyExecutionPhase } = input.progressController;
	let startupStagesEmitted = false;
	const preparedRuntime = await measureEmbeddedAgentPreparation("runtime", () => prepareEmbeddedRunRuntime({
		assertCurrent: input.laneController.throwIfAborted,
		runParams: params,
		sessionAdmission: input.sessionAdmission,
		provider,
		modelId,
		agentDir,
		workspaceDir: resolvedWorkspace,
		globalLane,
		hookRunner,
		hookContext: hookCtx,
		markStartupStage: (stage) => startupStages.mark(stage),
		notifyExecutionPhase,
		fallbackConfigured,
		preparedModelRuntime: input.preparedModelRuntime
	}), { config: params.config });
	params = {
		...params,
		admittedRunContext: preparedRuntime.admittedRunContext
	};
	const abortSignal = params.abortSignal;
	const accountingAuthority = getAdmittedRunDelegatedAuthority(preparedRuntime.admittedRunContext);
	const assertAdmittedActive = resolveAdmittedRunActiveAssertion(preparedRuntime.admittedRunContext, abortSignal);
	const admittedRunInput = {
		...input,
		runParams: params
	};
	({provider, modelId} = preparedRuntime);
	const { model, attemptAuthProfileStore, profileCandidates, profileFailureStore, pluginHarnessOwnsAuthBootstrap, attemptedThinking, maybeRefreshRuntimeAuthForAuthError, getApiKeyInfo } = preparedRuntime;
	let { agentHarness, pluginHarnessOwnsTransport, effectiveModel, outerContextTokenMeta, thinkLevel, lastProfileId } = preparedRuntime.snapshot();
	const refreshPreparedRuntimeSnapshot = () => {
		({agentHarness, pluginHarnessOwnsTransport, effectiveModel, outerContextTokenMeta, thinkLevel, lastProfileId} = preparedRuntime.snapshot());
	};
	const traceAttempts = [];
	const resolveRuntimeFallbackReason = () => traceAttempts.findLast((attempt) => attempt.result === "fallback_model" && typeof attempt.reason === "string")?.reason ?? lastRetryFailoverReason;
	const { sessionKey, config, agentId } = params;
	const { sessionAgentId } = resolveSessionAgentIds({
		sessionKey,
		config,
		agentId
	});
	const executionContract = isStrictAgenticExecutionContractActive({
		config: params.config,
		sessionKey: params.sessionKey,
		agentId: params.agentId,
		provider,
		modelId
	}) ? "strict-agentic" : "default";
	const runRetryBudget = createRunRetryBudget(resolveMaxRunRetryIterations(profileCandidates.length));
	const contextRecoveryState = createEmbeddedRunContextRecoveryState();
	let bootstrapPromptWarningSignaturesSeen = params.bootstrapPromptWarningSignaturesSeen ?? (params.bootstrapPromptWarningSignature ? [params.bootstrapPromptWarningSignature] : []);
	const usageAccumulator = createUsageAccumulator();
	let lastRunPromptUsage;
	let overloadProfileRotations = 0;
	const terminalRetryState = createEmbeddedRunTerminalRetryState();
	const idleTimeoutBreakerState = createIdleTimeoutBreakerState();
	const postCompactionGuard = createPostCompactionLoopGuard({ enabled: resolveToolLoopDetectionConfig({
		cfg: params.config,
		agentId: sessionAgentId
	})?.enabled !== false });
	let postCompactionAbortController;
	let postCompactionAbortError;
	const terminalToolPresentation = createTerminalToolPresentationTracker();
	const turnTaintState = createAgentTurnTaintState(params.initialTurnTainted === true);
	const observeToolOutcome = (observation) => {
		terminalToolPresentation.observe(observation);
		turnTaintState.observe(observation);
		if (observation.presentationOnly) return;
		const verdict = postCompactionGuard.observe(observation);
		if (verdict.shouldAbort) {
			postCompactionAbortError ??= PostCompactionLoopPersistedError.fromVerdict(verdict);
			input.laneController.laneTaskAbortController.abort(postCompactionAbortError);
			postCompactionAbortController?.abort(postCompactionAbortError);
		}
	};
	let lastRetryFailoverReason = null;
	let codexAppServerRecoveryRetries = 0;
	let emptyErrorRetries = 0;
	const sessionPromptState = await createEmbeddedRunSessionPromptState({
		runParams: params,
		sessionAgentId,
		resolvedSessionKey,
		lifecycleGeneration,
		onInterrupt: (reason) => input.laneController.laneTaskAbortController.abort(reason)
	});
	const providerReview = createProviderReviewRun({
		run: admittedRunInput,
		runtime: preparedRuntime,
		session: sessionPromptState,
		assertCurrent: assertAdmittedActive
	});
	input.onInitialWriterPrepared(sessionPromptState);
	const originalCompactionTarget = { ...sessionPromptState.sessionTarget };
	const durableCompactionAccounting = params.sessionPersistence !== "detached" && !(params.sessionManager && !params.sessionManager.getSessionTarget());
	const permissionChanges = createEmbeddedRunPermissionChanges(params);
	const failoverRetryController = createEmbeddedRunFailoverRetryController({
		runParams: {
			...params,
			abortSignal: input.laneController.abortSignal
		},
		provider,
		modelId,
		globalLane,
		agentDir,
		fallbackConfigured,
		profileFailureStore,
		getLastProfileId: () => preparedRuntime.snapshot().lastProfileId,
		getSessionId: () => sessionPromptState.sessionId,
		harnessOwnsTransport: () => preparedRuntime.snapshot().pluginHarnessOwnsTransport,
		getRuntimeAuthOwnerId: () => preparedRuntime.snapshot().agentHarness.id,
		getApiKeyInfo,
		advanceAuthProfile: preparedRuntime.advanceAttemptAuthProfile
	});
	const { contextEngine, contextEngineLogicalTurnLease, ownsContextEngineLogicalTurnLease } = await admitEmbeddedContextEngine(admittedRunInput, agentHarness);
	startupStages.mark("context-engine");
	notifyExecutionPhase("context_engine", {
		provider,
		model: modelId
	});
	try {
		await providerReview.admit();
		const compactionRuntime = createEmbeddedRunCompactionRuntime({
			runParams: params,
			contextEngine,
			hookRunner,
			hookContext: hookCtx,
			sessionPromptState
		});
		let authRetryPending = false;
		let accumulatedReplayState = createEmbeddedRunReplayState();
		const attemptCarryover = createAttemptCarryover();
		while (true) {
			abortSignal?.throwIfAborted();
			if (!assertAdmittedActive) throw new Error("embedded run requires an active admitted run");
			assertAdmittedActive();
			providerReview.beginAttempt();
			refreshPreparedRuntimeSnapshot();
			if (isRunRetryBudgetExhausted(runRetryBudget)) {
				const message = `Exceeded retry limit after ${runRetryBudget.attemptsDispatched} attempts (counted attempts=${runRetryBudget.attemptsCounted}, max=${runRetryBudget.maxAttempts}).`;
				log$3.error(`[run-retry-limit] sessionKey=${params.sessionKey ?? params.sessionId} provider=${provider}/${modelId} attempts=${runRetryBudget.attemptsDispatched} countedAttempts=${runRetryBudget.attemptsCounted} maxAttempts=${runRetryBudget.maxAttempts}`);
				const retryLimitDecision = resolveRunFailoverDecision({
					stage: "retry_limit",
					fallbackConfigured,
					failoverReason: lastRetryFailoverReason
				});
				return providerReview.finish(handleRetryLimitExhaustion({
					message,
					decision: retryLimitDecision,
					provider,
					model: modelId,
					profileId: lastProfileId,
					durationMs: Date.now() - started,
					agentMeta: buildErrorAgentMeta({
						sessionId: sessionPromptState.sessionId,
						sessionFile: sessionPromptState.sessionFile,
						...attemptCarryover.modelAttempt ?? {
							provider,
							model: model.id
						},
						...outerContextTokenMeta,
						usageAccumulator,
						lastRunPromptUsage
					}),
					replayInvalid: accumulatedReplayState.replayInvalid ? true : void 0,
					livenessState: "blocked"
				}));
			}
			params.assistantErrorTranscript?.clear();
			beginRunAttempt(runRetryBudget);
			params.onAttemptStart?.();
			const runtimeAuthRetry = authRetryPending;
			authRetryPending = false;
			attemptedThinking.add(thinkLevel);
			const codexAppServerRecoveryRetryAvailable = hasCodexAppServerRecoveryRetryBudget({
				alreadyRetried: codexAppServerRecoveryRetries > 0,
				runLoopIterations: runRetryBudget.attemptsCounted,
				maxRunLoopIterations: runRetryBudget.maxAttempts
			});
			let recordedCompactionCount = 0;
			let acceptsRequestBudget = true;
			contextRecoveryState.compactionRequestBudget = void 0;
			params.onCompactionRequestBudget?.(void 0);
			const attemptRunInput = {
				...admittedRunInput,
				runParams: {
					...params,
					onCompactionRequestBudget: (budget) => {
						if (!acceptsRequestBudget || abortSignal?.aborted) return;
						contextRecoveryState.compactionRequestBudget = budget;
						params.onCompactionRequestBudget?.(budget);
					},
					onContextAccountingEvent: (event) => {
						if (event.kind === "compaction") recordedCompactionCount += 1;
						contextRecoveryState.observeContextAccounting(event);
					}
				}
			};
			let dispatch;
			try {
				dispatch = await sessionPromptState.withSessionWriterContext(() => prepareAndDispatchEmbeddedRunAttempt({
					permissionChange: permissionChanges.forAttempt(),
					runInput: attemptRunInput,
					preparedRuntime,
					contextEngine,
					sessionPromptState,
					terminalRetryState,
					replayState: accumulatedReplayState,
					provider,
					modelId,
					startupStagesEmitted,
					bootstrapPromptWarningSignaturesSeen,
					resolveRuntimeFallbackReason,
					observeToolOutcome,
					isTurnTainted: turnTaintState.isTainted,
					allocateToolOutcomeOrdinal: terminalToolPresentation.allocateOrdinal,
					getPostCompactionAbortError: () => postCompactionAbortError,
					setPostCompactionAbortController: (controller) => {
						postCompactionAbortController = controller;
					},
					clearPostCompactionAbortController: (controller) => {
						if (postCompactionAbortController === controller) postCompactionAbortController = void 0;
					}
				}));
			} catch (error) {
				acceptsRequestBudget = false;
				providerReview.failure(error);
				const retryTrace = await failoverRetryController.recoverThrownHarnessAuthFailure(error);
				if (!retryTrace) throw error;
				traceAttempts.push(retryTrace);
				lastRetryFailoverReason = retryTrace.reason;
				continue;
			} finally {
				acceptsRequestBudget = false;
			}
			startupStagesEmitted = dispatch.startupStagesEmitted;
			const { dispatchedAttempt, runtimePlan } = dispatch;
			const refusal = await providerReview.settle(dispatchedAttempt.rawAttempt);
			failoverRetryController.observeAttempt(dispatchedAttempt.rawAttempt);
			attemptCarryover.apply(refresh.applyDeliveryState(dispatchedAttempt.rawAttempt));
			const normalization = {
				runInput: admittedRunInput,
				preparedRuntime,
				dispatchedAttempt,
				recordedCompactionCount,
				sessionPromptState,
				provider,
				modelId,
				bootstrapPromptWarningSignaturesSeen,
				usageAccumulator,
				lastRunPromptUsage,
				idleTimeoutBreakerState,
				contextRecoveryState,
				replayState: accumulatedReplayState,
				lastRetryFailoverReason
			};
			const normalizedAttempt = await normalizeEmbeddedRunAttempt(normalization);
			const continuation = refresh.continueAfterAttempt(normalization, assertAdmittedActive, turnTaintState.isTainted);
			if (continuation) return providerReview.finish(continuation);
			if (normalizedAttempt.action === "complete") return providerReview.finish(normalizedAttempt.result);
			bootstrapPromptWarningSignaturesSeen = normalizedAttempt.bootstrapPromptWarningSignaturesSeen;
			lastRunPromptUsage = normalizedAttempt.lastRunPromptUsage;
			accumulatedReplayState = normalizedAttempt.replayState;
			if (normalizedAttempt.action === "retry") {
				recordRunRetry(runRetryBudget, normalizedAttempt.retryKind);
				continue;
			}
			if (refusal?.category !== "misalignment" && permissionChanges.prepareRestart()) {
				input.laneController.throwIfAborted();
				sessionPromptState.continueFromCurrentTranscript();
				recordRunRetry(runRetryBudget, "progress_continuation");
				continue;
			}
			const { attempt, sessionIdUsed, sessionFileUsed, currentAttemptAssistant, currentAttemptCompletedAssistant, attemptAssistant, terminalState, setTerminalLifecycleMeta, attemptCompactionCount, activeErrorContext, resolveReplayInvalidForAttempt } = normalizedAttempt;
			const recovery = await recoverEmbeddedRunAttempt({
				runInput: admittedRunInput,
				preparedRuntime,
				normalizedAttempt,
				runtimePlan,
				sessionPromptState,
				failoverRetryController,
				compactionRuntime,
				contextEngine,
				contextRecoveryState,
				resolveContextEnginePluginId: () => contextEngineLogicalTurnLease.effectiveEnginePluginId ?? resolveContextEngineOwnerPluginId(contextEngine),
				buildRuntimeSettings: (settingsParams) => buildContextEngineRuntimeSettings({
					contextEngineHost: OPENCLAW_EMBEDDED_CONTEXT_ENGINE_HOST,
					provider,
					requestedModel: preparedRuntime.requestedModelId,
					resolvedModel: modelId,
					selectedContextEngineId: contextEngine.info.id,
					contextEngineSelectionSource: contextEngine.info.id === "legacy" ? "default" : "configured",
					promptTokenBudget: settingsParams.tokenBudget,
					fallbackReason: resolveRuntimeFallbackReason(),
					degradedReason: settingsParams.degradedReason
				}),
				armPostCompactionGuard: () => postCompactionGuard.armPostCompaction(),
				usageAccumulator,
				lastRunPromptUsage,
				runtimeAuthRetry,
				codexAppServerRecoveryRetryAvailable,
				codexAppServerRecoveryRetries,
				lastRetryFailoverReason,
				traceAttempts,
				sessionAgentId
			});
			if (recovery.action === "complete") return providerReview.finish(recovery.result);
			if (recovery.action === "retry") {
				thinkLevel = recovery.thinkLevel;
				authRetryPending = recovery.authRetryPending;
				codexAppServerRecoveryRetries = recovery.codexAppServerRecoveryRetries;
				lastRetryFailoverReason = recovery.lastRetryFailoverReason;
				continue;
			}
			const assistantFailureOutcome = await handleEmbeddedAssistantFailure({
				runParams: params,
				attempt,
				attemptAssistant,
				currentAttemptAssistant,
				terminalState,
				activeErrorContext,
				provider,
				providerOwner: preparedRuntime.snapshot().providerRuntimeHandle.plugin,
				modelId,
				model: model.id,
				thinkLevel,
				getThinkLevel: () => preparedRuntime.snapshot().thinkLevel,
				attemptedThinking,
				fallbackConfigured,
				pluginHarnessOwnsTransport,
				authProfileId: lastProfileId,
				authProfileStore: attemptAuthProfileStore,
				runtimeAuthRetry,
				maybeRefreshRuntimeAuthForAuthError,
				emptyErrorRetries,
				overloadProfileRotations,
				previousRetryFailoverReason: lastRetryFailoverReason,
				failover: failoverRetryController,
				traceAttempts,
				suspendForFailure,
				suspensionSessionId: sessionPromptState.sessionId ?? params.sessionId,
				agentDir,
				isProbeSession
			});
			thinkLevel = assistantFailureOutcome.thinkLevel;
			preparedRuntime.setThinkLevel(thinkLevel);
			authRetryPending = assistantFailureOutcome.authRetryPending;
			emptyErrorRetries = assistantFailureOutcome.emptyErrorRetries;
			overloadProfileRotations = assistantFailureOutcome.overloadProfileRotations;
			lastRetryFailoverReason = assistantFailureOutcome.lastRetryFailoverReason;
			if (assistantFailureOutcome.action === "retry") continue;
			let assistantProfileFailureReason = assistantFailureOutcome.assistantProfileFailureReason;
			const terminalToolPresentationText = terminalToolPresentation.read();
			const finalizedTerminal = await sessionPromptState.withSessionWriterContext(() => prepareTerminalWithSettledTurnFinalization({
				initial: {
					attempt,
					attemptAssistant,
					currentAttemptCompletedAssistant,
					sessionIdUsed,
					sessionFileUsed,
					terminalState,
					attemptCompactionCount
				},
				terminalBase: {
					mergeToolMedia: refresh.mergeToolMedia,
					runParams: params,
					provider,
					providerOwner: preparedRuntime.snapshot().providerRuntimeHandle.plugin,
					model: model.id,
					activeErrorContext,
					authProfileStore: attemptAuthProfileStore,
					authProfileId: lastProfileId,
					outerContextTokenMeta,
					usageAccumulator,
					contextRecoveryState,
					resolvedToolResultFormat: input.resolvedToolResultFormat
				},
				lastRunPromptUsage,
				finalization: {
					preparedAttempt: dispatchedAttempt.preparedAttempt,
					sessionTarget: sessionPromptState.sessionTarget,
					sessionWriterFence: sessionPromptState.sessionWriterFence,
					harness: agentHarness,
					modelApi: effectiveModel.api,
					executionContract,
					hasTerminalToolPresentation: Boolean(terminalToolPresentationText),
					createAttemptControls: input.laneController.createAttemptControls,
					abortSignal: input.laneController.abortSignal
				}
			}));
			const { attempt: terminalAttempt, attemptAssistant: terminalAttemptAssistant, terminalState: resolvedTerminalState, attemptCompactionCount: terminalAttemptCompactionCount, prepared: terminalPrepared, finalizationOutcome: settledTurnFinalizationOutcome } = finalizedTerminal;
			lastRunPromptUsage = finalizedTerminal.lastRunPromptUsage;
			if (settledTurnFinalizationOutcome === "answered" || settledTurnFinalizationOutcome === "completed-empty") assistantProfileFailureReason = null;
			const { agentMeta, reportedModelRef, finalAssistantVisibleText, finalAssistantRawText, payloadsWithToolMedia, replyDeliveryState, recoveredFinalAssistantPayloadsAfterPromptTimeout, attemptToolSummary, failureSignal, terminalToolFailure } = terminalPrepared;
			const terminalTimeoutResult = resolveEmbeddedRunTerminalTimeout({
				terminalPrepared,
				attempt: terminalAttempt,
				terminalState: resolvedTerminalState,
				resolveReplayInvalid: resolveReplayInvalidForAttempt,
				setTerminalLifecycleMeta,
				startedAtMs: started
			});
			if (terminalTimeoutResult) return providerReview.finish(terminalTimeoutResult);
			const terminalAuthPlan = preparedRuntime.snapshot().activePreparedAuthPlan;
			const requestTransportOverrides = terminalAuthPlan.modelRoute?.requestTransportOverrides ?? terminalAuthPlan.deferredRouteSupport?.requestTransportOverrides ?? "none";
			const terminalResolution = await resolveEmbeddedRunTerminal({
				runParams: params,
				retryState: terminalRetryState,
				attempt: terminalAttempt,
				attemptAssistant: terminalAttemptAssistant,
				activeErrorContext,
				modelApi: effectiveModel.api,
				executionContract,
				terminalState: resolvedTerminalState,
				payloadsWithToolMedia,
				replyDeliveryState,
				recoveredFinalAssistantPayloadsAfterPromptTimeout,
				finalAssistantVisibleText,
				finalAssistantRawText,
				agentMeta,
				attemptToolSummary,
				failureSignal,
				terminalToolFailure,
				maxReasoningOnlyRetryAttempts: 2,
				maxEmptyResponseRetryAttempts: 1,
				attemptCompactionCount: terminalAttemptCompactionCount,
				replayState: accumulatedReplayState,
				activePromptPersisted: sessionPromptState.activePrompt.persisted,
				activateInternalPrompt: sessionPromptState.activateInternalPrompt,
				markOwnedTranscriptRetry: sessionPromptState.markOwnedTranscriptRetry,
				activateCompactionContinuation: sessionPromptState.activateCompactionContinuation,
				clearCompactionContinuation: sessionPromptState.clearCompactionContinuation,
				setSuppressNextUserMessagePersistence: (value) => {
					sessionPromptState.suppressNextUserMessagePersistence = value;
				},
				armPostCompactionGuard: () => postCompactionGuard.armPostCompaction(),
				readTerminalToolPresentation: () => terminalToolPresentationText,
				resolveReplayInvalid: resolveReplayInvalidForAttempt,
				setTerminalLifecycleMeta,
				maybeMarkAuthProfileFailure: failoverRetryController.maybeMarkAuthProfileFailure,
				assistantProfileFailureReason,
				startedAtMs: started,
				provider,
				modelId,
				modelTransportId: effectiveModel.id ?? modelId,
				modelTransportApi: effectiveModel.api ?? model.api,
				...effectiveModel.baseUrl ? { modelTransportBaseUrl: effectiveModel.baseUrl } : {},
				requestTransportOverrides,
				authProfileId: lastProfileId,
				profileFailureStore,
				attemptAuthProfileStore,
				apiKeyInfo: getApiKeyInfo(),
				agentHarnessId: agentHarness.id,
				settledTurnFinalizationOutcome,
				pluginHarnessOwnsTransport,
				pluginHarnessOwnsAuthBootstrap,
				reportedModelRef,
				traceAttempts,
				traceAttemptUsesFallback: (traceAttempt) => traceAttempt.result === "rotate_profile" || traceAttempt.result === "fallback_model",
				thinkLevel,
				contextRecoveryState
			});
			if (terminalResolution.action === "retry") continue;
			return providerReview.finish(terminalResolution.result);
		}
	} finally {
		contextRecoveryState.restoreTimeoutRecoveryAbandonment();
		permissionChanges.close();
		await settleEmbeddedRun({
			runInput: admittedRunInput,
			runtime: preparedRuntime,
			compaction: {
				state: contextRecoveryState,
				session: sessionPromptState,
				originalTarget: originalCompactionTarget,
				durable: durableCompactionAccounting,
				authority: accountingAuthority
			},
			ownedContextEngineLease: ownsContextEngineLogicalTurnLease ? contextEngineLogicalTurnLease : void 0
		});
	}
}
//#endregion
//#region src/agents/embedded-agent-runner/run/execution-phase-diagnostics.ts
/**
* Wraps params.onExecutionPhase so every phase transition also emits a
* run.execution_phase diagnostic event. Applied once at the runner entry;
* downstream call sites all read the forwarded callback. Session compaction
* can rotate the session id mid-run, so the wrapper tracks the current id via
* onSessionIdChanged instead of capturing the initial value. The returned
* params always carry both callbacks (the wrapper installs them), so callers
* can invoke them unconditionally.
*/
function withExecutionPhaseDiagnostics(params) {
	const forwardPhase = params.onExecutionPhase;
	const forwardSessionIdChanged = params.onSessionIdChanged;
	let currentSessionId = params.sessionId;
	const onSessionIdChanged = (sessionId) => {
		currentSessionId = sessionId;
		forwardSessionIdChanged?.(sessionId);
	};
	const onExecutionPhase = (info) => {
		if (areDiagnosticsEnabledForProcess()) emitDiagnosticEvent({
			type: "run.execution_phase",
			runId: params.runId,
			sessionId: currentSessionId,
			sessionKey: params.sessionKey,
			...info
		});
		forwardPhase?.(info);
	};
	return {
		...params,
		onExecutionPhase,
		onSessionIdChanged
	};
}
//#endregion
//#region src/agents/embedded-agent-runner/run/failure-suspension.ts
function buildEmbeddedFailureSuspension(params) {
	return {
		...params.suspension,
		agentId: params.suspension.agentId ?? params.runAgentId
	};
}
//#endregion
//#region src/agents/embedded-agent-runner/run/lane-controller.ts
function createEmbeddedRunLaneController(options) {
	const initialParams = options.getParams();
	const sessionLanePolicy = resolveEmbeddedRunSessionLanePolicy(initialParams.trigger, initialParams.inputProvenance);
	const laneTaskTimeoutMs = resolveEmbeddedRunLaneTimeoutMs(initialParams.timeoutMs);
	const laneTaskAbortController = new AbortController();
	const laneTaskReleaseController = new AbortController();
	const abortSignal = AbortSignal.any([
		...initialParams.abortSignal ? [initialParams.abortSignal] : [],
		laneTaskAbortController.signal,
		laneTaskReleaseController.signal
	]);
	let laneTaskProgressAtMs = Date.now();
	let laneTaskDeadline;
	const laneTaskDeadlineSubscribers = /* @__PURE__ */ new Set();
	const setLaneTaskDeadline = (deadline) => {
		laneTaskDeadline = deadline?.kind === "bounded" ? {
			kind: "bounded",
			deadlineAtMs: deadline.deadlineAtMs + EMBEDDED_RUN_LANE_TIMEOUT_GRACE_MS
		} : deadline;
		for (const notifyDeadline of laneTaskDeadlineSubscribers) notifyDeadline(laneTaskDeadline);
	};
	let pendingGlobalLaneAdmissions = 0;
	let releaseQueuedRunContext;
	let queuedRunAbortSignal;
	let releaseCapacityWait;
	const endCapacityWait = () => {
		releaseCapacityWait?.();
		releaseCapacityWait = void 0;
	};
	const noteCapacityWait = () => {
		const params = options.getParams();
		if (!params.abortSignal?.aborted) releaseCapacityWait = registerAgentRunCapacityWait(params.runId, options.getLifecycleGeneration());
	};
	const releaseQueuedContext = (outcome) => {
		endCapacityWait();
		queuedRunAbortSignal?.removeEventListener("abort", abandonQueuedContext);
		queuedRunAbortSignal = void 0;
		releaseQueuedRunContext?.(outcome);
	};
	const abandonQueuedContext = () => {
		releaseQueuedContext("abandoned");
	};
	const noteLaneTaskProgress = () => {
		laneTaskProgressAtMs = Date.now();
	};
	let assertPlacementCurrent;
	let activeAttemptOwner;
	const createAttemptControls = (input) => {
		assertPlacementCurrent?.();
		const owner = {};
		activeAttemptOwner = owner;
		const lifecycleGeneration = options.getLifecycleGeneration();
		const authority = getAdmittedRunDelegatedAuthority(input.admittedRunContext);
		const signal = input.abortSignal ? AbortSignal.any([abortSignal, input.abortSignal]) : abortSignal;
		let state = "active";
		let deadlineOwned = false;
		let timeoutReleaseTimer;
		const isCurrent = () => state === "active" && activeAttemptOwner === owner && !signal.aborted && isAgentEventLifecycleGenerationCurrent(lifecycleGeneration) && authority !== void 0 && getAdmittedRunDelegatedAuthority(input.admittedRunContext) === authority;
		const onAttemptDeadlineChanged = (deadline) => {
			if (isCurrent()) {
				deadlineOwned = true;
				setLaneTaskDeadline(deadline);
			}
		};
		if (input.initialTimeoutMs !== void 0) onAttemptDeadlineChanged(input.initialTimeoutMs >= 2147e6 ? { kind: "unlimited" } : {
			kind: "bounded",
			deadlineAtMs: Date.now() + input.initialTimeoutMs
		});
		return {
			isCurrent,
			abortSignal: signal,
			onAttemptDeadlineChanged,
			onAttemptTimeout: (reason) => {
				if (isCurrent() && !timeoutReleaseTimer) {
					timeoutReleaseTimer = setTimeout(() => {
						if (isCurrent()) laneTaskReleaseController.abort(reason);
					}, EMBEDDED_RUN_LANE_TIMEOUT_GRACE_MS);
					timeoutReleaseTimer.unref?.();
				}
			},
			onAttemptAbort: () => {
				if (!isCurrent()) return;
				state = "aborted";
				laneTaskAbortController.abort(createAgentRunDirectAbortError());
				input.onAbort?.();
			},
			close: () => {
				if (state === "closed") return;
				state = "closed";
				clearTimeout(timeoutReleaseTimer);
				if (activeAttemptOwner === owner) {
					activeAttemptOwner = void 0;
					noteLaneTaskProgress();
					if (deadlineOwned) setLaneTaskDeadline(void 0);
				}
			}
		};
	};
	const throwIfAborted = () => {
		assertPlacementCurrent?.();
		if (!abortSignal.aborted) return;
		const reason = abortSignal.reason;
		if (reason instanceof Error) throw reason;
		const abortError = reason !== void 0 ? new Error("Operation aborted", { cause: reason }) : /* @__PURE__ */ new Error("Operation aborted");
		abortError.name = "AbortError";
		throw abortError;
	};
	const withLaneTimeout = (opts, allowPendingGlobalAdmissionHeartbeat = false) => withEmbeddedRunLaneTimeout({
		...opts,
		abortSignal,
		taskTimeoutProgressAtMs: () => allowPendingGlobalAdmissionHeartbeat && pendingGlobalLaneAdmissions > 0 ? Date.now() : laneTaskProgressAtMs,
		taskTimeoutSubscribe: (onDeadline) => {
			laneTaskDeadlineSubscribers.add(onDeadline);
			onDeadline(laneTaskDeadline);
			return () => laneTaskDeadlineSubscribers.delete(onDeadline);
		},
		taskTimeoutAbortSignal: abortSignal,
		taskTimeoutAbortGraceMs: EMBEDDED_RUN_LANE_TIMEOUT_GRACE_MS,
		taskTimeoutReleaseSignal: laneTaskReleaseController.signal
	}, laneTaskTimeoutMs);
	const withRunLaneWait = (opts) => {
		const params = options.getParams();
		if (!opts?.onWait && !params.onLaneWait) return opts;
		return {
			...opts,
			onWait: (waitMs, queuedAhead) => {
				opts?.onWait?.(waitMs, queuedAhead);
				options.getParams().onLaneWait?.({
					waitMs,
					queuedAhead,
					waiting: true
				});
			}
		};
	};
	const noteLaneWaitIfBusy = (lane) => {
		const params = options.getParams();
		if (!params.onLaneWait) return;
		const snapshot = getCommandLaneSnapshot(lane);
		if (shouldNoteLaneWait(snapshot)) params.onLaneWait({
			waitMs: 0,
			queuedAhead: snapshot.queuedCount + snapshot.activeCount,
			waiting: true
		});
	};
	const enqueueGlobal = (task, opts) => {
		options.getParams().replyOperation?.markWaitingForGlobalLane();
		pendingGlobalLaneAdmissions += 1;
		let waitingForGlobalLaneAdmission = true;
		const finishGlobalLaneAdmission = () => {
			if (!waitingForGlobalLaneAdmission) return;
			waitingForGlobalLaneAdmission = false;
			pendingGlobalLaneAdmissions -= 1;
		};
		const globalOpts = {
			...opts,
			priority: isBackgroundWorkLane(options.globalLane) ? "background" : sessionLanePolicy.priority,
			onQueued: noteCapacityWait
		};
		const taskWithCurrentLifecycle = async () => {
			endCapacityWait();
			finishGlobalLaneAdmission();
			noteLaneTaskProgress();
			let params = options.getParams();
			throwIfAborted();
			let lifecycleGeneration = options.getLifecycleGeneration();
			const currentLifecycleGeneration = getAgentEventLifecycleGeneration();
			const existingContext = getAgentRunContext(params.runId);
			if (lifecycleGeneration !== currentLifecycleGeneration) {
				const wasQueuedBeforeRotation = options.initialQueuedLifecycleGeneration === lifecycleGeneration;
				const canResumeAcrossRotation = sessionLanePolicy.canResumeAcrossRotation;
				const newerSameIdExecutionOwnsContext = existingContext?.lifecycleGeneration === currentLifecycleGeneration;
				if (!wasQueuedBeforeRotation || !canResumeAcrossRotation || newerSameIdExecutionOwnsContext) assertAgentRunLifecycleGenerationCurrent(lifecycleGeneration);
				lifecycleGeneration = currentLifecycleGeneration;
				options.setLifecycleGeneration(lifecycleGeneration);
				params = {
					...params,
					lifecycleGeneration
				};
				options.setParams(params);
			}
			const writerClaim = await claimAgentSessionWriter(params);
			if (writerClaim) {
				params = {
					...params,
					sessionTarget: {
						...params.sessionTarget,
						expectedLifecycleRevision: writerClaim.expectedLifecycleRevision,
						expectedWriterRunId: writerClaim.expectedWriterRunId
					}
				};
				options.setParams(params);
			}
			return await withAgentRunLifecycleGeneration(lifecycleGeneration, () => withSessionPlacementTurnAdmission({
				sessionId: params.sessionId,
				...params.agentId ? { agentId: params.agentId } : {},
				...params.sessionKey ? { sessionKey: params.sessionKey } : {},
				runId: params.runId
			}, params, () => {
				assertPlacementCurrent = resolveSessionPlacementTurnSettlementAssertion();
				return task();
			}, () => {
				throwIfAborted();
				assertAgentRunLifecycleGenerationCurrent(lifecycleGeneration);
				releaseQueuedContext("admitted");
				claimAgentRunContext(params.runId, {
					...existingContext,
					agentId: params.agentId ?? existingContext?.agentId,
					sessionKey: params.sessionKey ?? existingContext?.sessionKey,
					sessionId: params.sessionId ?? existingContext?.sessionId,
					lifecycleGeneration,
					lastActiveAt: Date.now()
				});
				params.replyOperation?.markGlobalLaneWaitEnded();
				params.onLaneWait?.({
					waitMs: 0,
					queuedAhead: 0,
					waiting: false
				});
			}));
		};
		const params = options.getParams();
		let queuedRun;
		try {
			if (params.enqueue) queuedRun = params.enqueue(taskWithCurrentLifecycle, withLaneTimeout(withRunLaneWait(globalOpts)));
			else {
				noteLaneWaitIfBusy(options.globalLane);
				queuedRun = enqueueCommandInLane(options.globalLane, taskWithCurrentLifecycle, withLaneTimeout(withRunLaneWait(globalOpts)));
			}
		} catch (error) {
			finishGlobalLaneAdmission();
			throw error;
		}
		return queuedRun.finally(finishGlobalLaneAdmission).catch((error) => {
			if (isCommandLaneTaskTimeoutError(error)) laneTaskAbortController.abort(error);
			throw error;
		});
	};
	const enqueueSession = async (task, opts) => {
		const releaseForeground = sessionLanePolicy.priority === "foreground" ? await beginForegroundSessionMaintenance(options.getParams().sessionKey ?? options.getParams().sessionId) : void 0;
		try {
			const sessionOpts = {
				...opts,
				abortSignal,
				priority: sessionLanePolicy.priority,
				onQueued: noteCapacityWait
			};
			const admittedTask = () => {
				endCapacityWait();
				return task();
			};
			const params = options.getParams();
			releaseQueuedRunContext = retainQueuedAgentRunContext(params.runId, options.getLifecycleGeneration());
			if (releaseQueuedRunContext && params.abortSignal) {
				if (params.abortSignal.aborted) releaseQueuedContext("abandoned");
				else {
					queuedRunAbortSignal = params.abortSignal;
					queuedRunAbortSignal.addEventListener("abort", abandonQueuedContext, { once: true });
				}
			}
			let queuedRun;
			try {
				if (params.enqueue) queuedRun = params.enqueue(admittedTask, withLaneTimeout(withRunLaneWait(sessionOpts), true));
				else {
					noteLaneWaitIfBusy(options.sessionLane);
					queuedRun = enqueueCommandInLane(options.sessionLane, admittedTask, withLaneTimeout(withRunLaneWait(sessionOpts), true));
				}
			} catch (error) {
				releaseQueuedContext("abandoned");
				throw error;
			}
			return await queuedRun.finally(() => {
				releaseQueuedContext("abandoned");
			}).catch((error) => {
				if (isCommandLaneTaskTimeoutError(error)) laneTaskAbortController.abort(error);
				throw error;
			});
		} finally {
			releaseForeground?.();
		}
	};
	return {
		enqueueGlobal,
		enqueueSession,
		abortSignal,
		laneTaskAbortController,
		laneTaskReleaseController,
		noteLaneTaskProgress,
		setLaneTaskDeadline,
		createAttemptControls,
		throwIfAborted
	};
}
//#endregion
//#region src/agents/embedded-agent-runner/run/prepared-runtime-context.ts
/** Rebinds every config-derived run projection to one committed prepared generation. */
function bindRunToPreparedModelRuntime(params) {
	const preparedAgentId = params.preparedModelRuntime.agentId ?? params.requestedWorkspaceResolution.agentId;
	const workspaceResolution = {
		...params.requestedWorkspaceResolution,
		agentId: preparedAgentId,
		workspaceDir: params.preparedModelRuntime.workspaceDir ?? params.requestedWorkspaceResolution.workspaceDir
	};
	return {
		runParams: {
			...params.runParams,
			agentId: preparedAgentId,
			agentDir: params.preparedModelRuntime.agentDir,
			config: params.preparedModelRuntime.config,
			workspaceDir: workspaceResolution.workspaceDir
		},
		workspaceResolution
	};
}
//#endregion
//#region src/agents/embedded-agent-runner/run/progress-controller.ts
function createEmbeddedRunProgressController(params) {
	const fastModeStartedAtMs = params.attempt.fastModeStartedAtMs ?? params.startedAtMs;
	const fastModeAutoOnSeconds = params.attempt.fastModeAutoOnSeconds ?? resolveFastModeModelAutoOnSeconds({
		cfg: params.attempt.config,
		provider: params.attempt.provider,
		model: params.attempt.model
	});
	const fastModeAutoProgressState = params.attempt.fastModeAutoProgressState ?? {
		offAnnounced: false,
		resetAnnounced: false
	};
	const notifyExecutionPhase = (phase, extra) => {
		params.noteLaneTaskProgress();
		params.attempt.onExecutionPhase?.({
			phase,
			...extra
		});
	};
	const notifyRunProgress = (info) => {
		params.noteLaneTaskProgress();
		params.attempt.onRunProgress?.(info);
	};
	const emitFastModeAutoProgress = async (payload) => {
		const summary = formatFastModeAutoProgressText(payload);
		try {
			emitAgentActivityEvent({
				runId: params.attempt.runId,
				...params.attempt.sessionKey ? { sessionKey: params.attempt.sessionKey } : {},
				stream: "item",
				data: {
					itemId: `fast-mode-auto:${payload.enabled ? "on" : "off"}`,
					kind: "status",
					title: "Fast",
					phase: "update",
					status: "running",
					summary
				}
			});
		} catch (error) {
			log$3.debug(`embedded run fast mode auto global event failed: ${formatErrorMessage(error)}`);
		}
		try {
			await params.attempt.onAgentEvent?.({
				stream: "item",
				data: {
					kind: "status",
					title: "Fast",
					phase: "update",
					summary
				},
				...params.attempt.sessionKey ? { sessionKey: params.attempt.sessionKey } : {}
			});
		} catch (error) {
			log$3.debug(`embedded run fast mode auto event failed: ${formatErrorMessage(error)}`);
		}
		try {
			await params.attempt.onToolResult?.({
				text: summary,
				channelData: { openclawProgressKind: FAST_MODE_AUTO_PROGRESS_KIND }
			});
		} catch (error) {
			log$3.debug(`embedded run fast mode auto progress failed: ${formatErrorMessage(error)}`);
		}
	};
	const maybeAnnounceFastModeAutoOff = async () => {
		if (params.attempt.fastMode !== "auto" || fastModeAutoProgressState.offAnnounced) return;
		const next = resolveFastModeForElapsed({
			mode: "auto",
			startedAtMs: fastModeStartedAtMs,
			fastAutoOnSeconds: fastModeAutoOnSeconds
		});
		if (next.enabled) return;
		fastModeAutoProgressState.offAnnounced = true;
		await emitFastModeAutoProgress(next);
	};
	const notifyToolResult = async (payload) => {
		await params.attempt.onToolResult?.(payload);
	};
	const notifyAgentEvent = async (event) => {
		await params.attempt.onAgentEvent?.(event);
	};
	const resolveAttemptFastMode = () => {
		const resolved = resolveFastModeForElapsed({
			mode: params.attempt.fastMode,
			startedAtMs: fastModeStartedAtMs,
			fastAutoOnSeconds: fastModeAutoOnSeconds
		});
		return resolved.mode === void 0 ? void 0 : resolved.enabled;
	};
	const resolveAttemptFastModeParam = () => {
		if (params.attempt.fastMode === "auto") return resolveAttemptFastMode;
		return resolveAttemptFastMode();
	};
	const maybeEmitFastModeAutoReset = async () => {
		if (params.attempt.fastMode !== "auto" || !fastModeAutoProgressState.offAnnounced || fastModeAutoProgressState.resetAnnounced) return;
		fastModeAutoProgressState.resetAnnounced = true;
		await emitFastModeAutoProgress({
			enabled: true,
			elapsedSeconds: 0,
			fastAutoOnSeconds: fastModeAutoOnSeconds
		});
	};
	const maybeEmitFastModeAutoResetBestEffort = async () => {
		try {
			await maybeEmitFastModeAutoReset();
		} catch (error) {
			log$3.warn(`embedded run fast mode auto reset progress failed: ${formatErrorMessage(error)}`);
		}
	};
	return {
		fastModeAutoOnSeconds,
		fastModeAutoProgressState,
		fastModeStartedAtMs,
		maybeAnnounceFastModeAutoOff,
		maybeEmitFastModeAutoResetBestEffort,
		notifyAgentEvent,
		notifyExecutionPhase,
		notifyRunProgress,
		notifyToolResult,
		resolveAttemptFastModeParam
	};
}
//#endregion
//#region src/agents/embedded-agent-runner/run/recovery-message-action-capability.ts
/** Reconstructs a one-run action capability from host-only restart correlation. */
function createRecoveryMessageActionTurnCapability(params) {
	const sourceTurnId = readChannelSourceTurnId(params);
	const sourceChannel = normalizeMessageChannel(params.messageProvider ?? params.messageChannel);
	if (params.messageActionTurnCapability || !sourceTurnId || !sourceChannel || !isTrustedMessageActionTurnIngress(sourceChannel) || !params.agentId || !params.sessionKey || !params.currentChannelId) return;
	return mintMessageActionTurnCapability({
		agentId: params.agentId,
		runId: params.runId,
		sessionKey: params.sessionKey,
		sourceReplySessionKey: params.sessionKey,
		sessionId: params.sessionId,
		requesterAccountId: params.agentAccountId,
		requesterSenderId: params.senderId ?? void 0,
		requesterSenderName: params.senderName ?? void 0,
		requesterSenderUsername: params.senderUsername ?? void 0,
		requesterSenderE164: params.senderE164 ?? void 0,
		toolContext: {
			currentChannelId: params.currentChannelId,
			currentChatType: params.chatType,
			currentMessagingTarget: params.messageTo,
			currentChannelProvider: sourceChannel,
			currentThreadTs: params.currentThreadTs,
			currentSourceTurnId: sourceTurnId,
			replyToMode: params.replyToMode,
			hasRepliedRef: params.hasRepliedRef,
			sameChannelThreadRequired: readChannelSourceTurnSameThreadRequired(params)
		},
		...resolveMessageActionTurnCapabilityLifetime(params.timeoutMs)
	});
}
//#endregion
//#region src/agents/embedded-agent-runner/run-orchestrator.ts
/**
* Embedded-agent run orchestration implementation.
*/
const EMPTY_EMBEDDED_AGENT_CONFIG = Object.freeze({});
function runEmbeddedAgent(internalParamsInput) {
	const requestedProvider = normalizeOptionalString(internalParamsInput.provider);
	const requestedModel = normalizeOptionalString(internalParamsInput.model);
	const needsConfiguredDefault = !internalParamsInput.config && !requestedProvider && !requestedModel;
	const config = internalParamsInput.config ?? (needsConfiguredDefault ? getRuntimeConfigSnapshot() ?? void 0 : void 0);
	const lifecycleGeneration = internalParamsInput.lifecycleGeneration ?? captureAgentRunLifecycleGeneration(internalParamsInput.runId);
	const pluginGeneration = internalParamsInput.pluginGeneration ?? (internalParamsInput.preparedModelRuntimeMode === "isolated-read-only" ? void 0 : getPreparedModelRuntimePluginGeneration());
	return withAgentRunLifecycleGeneration(lifecycleGeneration, () => runEmbeddedAgentInternal({
		...internalParamsInput,
		config,
		lifecycleGeneration,
		...pluginGeneration ? { pluginGeneration } : {}
	}));
}
async function runEmbeddedAgentInternal(paramsInput) {
	const contextEngineAgentId = normalizeOptionalString(paramsInput.sessionTarget?.agentId) ?? normalizeOptionalString(paramsInput.agentId);
	const paramsBase = applyAgentRunSessionTargetIdentity(paramsInput);
	const skillWorkshopProposalMutationBudget = paramsBase.skillWorkshopProposalOnly ? paramsBase.skillWorkshopProposalMutationBudget ?? { remaining: 1 } : void 0;
	let lifecycleGeneration = paramsBase.lifecycleGeneration;
	const queuedLifecycleGeneration = getAgentEventLifecycleGeneration();
	const effectiveSessionKey = backfillSessionKey({
		config: paramsBase.config,
		sessionId: paramsBase.sessionId,
		sessionKey: paramsBase.sessionKey,
		agentId: paramsBase.agentId
	});
	const sessionAdmission = assertAgentHarnessRunAdmission({
		...paramsBase,
		sessionKey: effectiveSessionKey
	});
	const runSessionTarget = await resolveAgentRunSessionTarget({
		...paramsBase,
		missingSessionKey: "create",
		sessionKey: effectiveSessionKey
	});
	let params = withExecutionPhaseDiagnostics({
		...paramsBase,
		sessionManager: paramsBase.sessionManager ?? (paramsBase.sessionPersistence === "detached" ? SessionManager.inMemory(paramsBase.cwd ?? paramsBase.workspaceDir) : void 0),
		agentId: runSessionTarget.agentId,
		sessionId: runSessionTarget.sessionId,
		sessionKey: runSessionTarget.sessionKey,
		sessionTarget: runSessionTarget,
		sessionFile: runSessionTarget.sessionKey,
		skillWorkshopProposalMutationBudget
	});
	const sessionLane = resolveSessionLane(params.sessionKey?.trim() || params.sessionId);
	const globalLane = resolveGlobalLane(params.lane);
	const failureSuspension = params.sessionPersistence === "detached" ? void 0 : resolveSessionSuspensionTarget();
	const suspendForFailure = (suspensionParams) => {
		if (!failureSuspension) return;
		const suspension = buildEmbeddedFailureSuspension({
			suspension: suspensionParams,
			runAgentId: params.agentId
		});
		if (failureSuspension.mode === "defer") {
			failureSuspension.defer(suspension);
			return;
		}
		suspendSession(suspension);
	};
	const laneController = createEmbeddedRunLaneController({
		getLifecycleGeneration: () => lifecycleGeneration,
		getParams: () => params,
		globalLane,
		initialQueuedLifecycleGeneration: queuedLifecycleGeneration,
		sessionLane,
		setLifecycleGeneration: (generation) => {
			lifecycleGeneration = generation;
		},
		setParams: (nextParams) => {
			params = nextParams;
		}
	});
	const { enqueueGlobal, enqueueSession, noteLaneTaskProgress, throwIfAborted } = laneController;
	const channelHint = params.messageChannel ?? params.messageProvider;
	const resolvedToolResultFormat = params.toolResultFormat ?? (channelHint ? isMarkdownCapableMessageChannel(channelHint) ? "markdown" : "plain" : "markdown");
	const isProbeSession = params.sessionId?.startsWith("probe-") ?? false;
	throwIfAborted();
	const recoveryMessageActionTurnCapability = createRecoveryMessageActionTurnCapability(params);
	if (recoveryMessageActionTurnCapability) params = {
		...params,
		messageActionTurnCapability: recoveryMessageActionTurnCapability
	};
	return enqueueSession(async () => {
		throwIfAborted();
		if (!params.sessionManager || params.sessionManager.getSessionTarget()) {
			params.replyOperation?.markWaitingForDeferredMaintenance();
			try {
				await waitForDeferredTurnMaintenanceForSession(params.sessionKey);
			} finally {
				params.replyOperation?.markDeferredMaintenanceWaitEnded();
			}
		}
		throwIfAborted();
		return enqueueGlobal(async () => {
			const started = Date.now();
			const refresh = createEmbeddedAgentPluginRuntimeRefresh(params);
			const usage = createUsageAccumulator();
			let refreshed = false;
			let generationCleanup = Promise.resolve();
			let terminal;
			let assistantErrorTranscript;
			const ownsAssistantErrorTranscript = params.assistantErrorTranscript === void 0;
			const onAgentEvent = params.onAgentEvent;
			const onAttemptStart = params.onAttemptStart;
			const runGeneration = async () => {
				throwIfAborted();
				const cliDispatched = await runEmbeddedAgentViaCliBackendIfEligible({
					...params,
					sessionTarget: {
						...params.sessionTarget,
						...runSessionTarget
					}
				});
				if (cliDispatched) return cliDispatched;
				const startupStages = createEmbeddedRunStageTracker();
				const requestedWorkspaceResolution = resolveRunWorkspaceDir({
					workspaceDir: params.workspaceDir,
					sessionKey: params.sessionKey,
					agentId: params.agentId,
					config: params.config
				});
				startupStages.mark("workspace");
				const config = params.config ?? EMPTY_EMBEDDED_AGENT_CONFIG;
				const requestedAgentDir = params.agentDir ?? resolveAgentDir(config, requestedWorkspaceResolution.agentId);
				const retainIdleRunOwner = params.config === void 0;
				const requestedRuntimeSelection = resolveInitialEmbeddedRunModel({
					config,
					agentId: requestedWorkspaceResolution.agentId,
					provider: params.provider,
					model: params.model
				});
				const explicitHarnessRuntime = params.agentHarnessId ?? params.agentHarnessRuntimeOverride;
				const requestedHarnessRuntime = explicitHarnessRuntime ?? params.agentHarnessRuntimePreparationHint;
				const runtimePluginFallbacksOverride = params.modelFallbacksOverride ?? resolveRunModelFallbacksOverride({
					cfg: config,
					agentId: requestedWorkspaceResolution.agentId,
					sessionKey: params.sessionKey
				});
				const pluginMetadataSnapshot = params.pluginGeneration?.pluginMetadataSnapshot ?? loadPluginMetadataSnapshot({
					config,
					workspaceDir: requestedWorkspaceResolution.workspaceDir,
					env: process.env
				});
				const runtimePluginSelections = resolveModelCandidateChain({
					cfg: config,
					agentId: requestedWorkspaceResolution.agentId,
					manifestPlugins: pluginMetadataSnapshot,
					provider: requestedRuntimeSelection.provider,
					model: requestedRuntimeSelection.modelId,
					requestedRouteResolution: params.requestedRouteResolution,
					fallbacksOverride: runtimePluginFallbacksOverride
				}).map((candidate, index) => requestedHarnessRuntime && (index === 0 || explicitHarnessRuntime) ? {
					provider: candidate.provider,
					modelId: candidate.model,
					runtime: requestedHarnessRuntime,
					agentId: requestedWorkspaceResolution.agentId
				} : {
					provider: candidate.provider,
					modelId: candidate.model,
					agentId: requestedWorkspaceResolution.agentId
				});
				const preparedInput = {
					config,
					agentId: requestedWorkspaceResolution.agentId,
					agentDir: requestedAgentDir,
					inheritedAuthDir: resolveLegacyInheritedAuthDir(config),
					workspaceDir: requestedWorkspaceResolution.workspaceDir,
					preserveWorkspaceDirOnRefresh: !requestedWorkspaceResolution.isCanonicalWorkspace,
					...params.allowGatewaySubagentBinding ? { allowGatewaySubagentBinding: true } : {},
					...params.preparedModelRuntimeMode === "isolated-read-only" ? { loadRuntimePlugins: true } : {},
					runtimePluginSelections
				};
				startupStages.mark("harness-selection");
				const callerResult = createDeferredCore();
				const trackOwner = captureAsyncWorkTracker();
				const parentSignal = getAsyncWorkSignal();
				const work = new AsyncWorkScope();
				let context = work.run(() => AsyncLocalStorage.snapshot());
				let preparedRuntimeResource;
				let initialWriterResource;
				let initialWriterCleanup = Promise.resolve();
				const runPreparedCandidate = async () => {
					laneController.setLaneTaskDeadline({ kind: "unlimited" });
					const preparedModelRuntimeLease = await (params.preparedModelRuntimeMode === "isolated-read-only" ? acquireReadOnlyPreparedModelRuntime(preparedInput, {
						abortSignal: laneController.abortSignal,
						catalogMode: "static"
					}) : acquireAgentRunPreparedModelRuntime(preparedInput, {
						retainIdleRunOwner,
						catalogMode: "static",
						...params.pluginGeneration ? { pluginGeneration: params.pluginGeneration } : {},
						abortSignal: laneController.abortSignal
					})).finally(() => {
						noteLaneTaskProgress();
						laneController.setLaneTaskDeadline(void 0);
					});
					preparedRuntimeResource = preparedModelRuntimeLease;
					startupStages.mark("prepared-runtime");
					const preparedModelRuntimeOwnerSnapshot = preparedModelRuntimeLease.snapshot;
					let preparedLeaseActive = true;
					try {
						throwIfAborted();
						if (params.pluginGeneration && preparedModelRuntimeOwnerSnapshot.metadataSnapshot !== params.pluginGeneration.pluginMetadataSnapshot) throw new Error("prepared model runtime replaced the admitted plugin generation");
						const rebound = bindRunToPreparedModelRuntime({
							runParams: params,
							requestedWorkspaceResolution,
							preparedModelRuntime: preparedModelRuntimeOwnerSnapshot
						});
						params = rebound.runParams;
						const workspaceResolution = rebound.workspaceResolution;
						const repoRoot = resolveSystemPromptRepoRoot({
							config: rebound.runParams.config,
							workspaceDir: workspaceResolution.workspaceDir,
							cwd: rebound.runParams.cwd
						}) ?? null;
						const projectKey = repoRoot ? await resolveProjectKey(repoRoot) : null;
						const activeProjectKeys = prepareEmbeddedSessionActiveProjectKeys(params.sessionId, projectKey);
						const preparedModelRuntime = Object.freeze({
							...preparedModelRuntimeOwnerSnapshot,
							repoRoot,
							projectKey,
							activeProjectKeys
						});
						const runPrepared = async () => {
							params = refresh.withDeliveryCallbacks(params);
							const preparedAgentId = workspaceResolution.agentId;
							const resolvedWorkspace = workspaceResolution.workspaceDir;
							const agentDir = preparedModelRuntime.agentDir;
							const progressController = createEmbeddedRunProgressController({
								attempt: params,
								noteLaneTaskProgress,
								startedAtMs: started
							});
							const { notifyExecutionPhase } = progressController;
							const emitStartupStageSummary = createEmbeddedRunStageSummaryEmitter({
								label: "startup stages",
								log: log$3,
								runId: params.runId,
								sessionId: params.sessionId,
								tracker: startupStages
							});
							await params.onExecutionStarted?.({ lifecycleGeneration });
							throwIfAborted();
							assertAgentRunLifecycleGenerationCurrent(lifecycleGeneration);
							notifyExecutionPhase("runner_entered");
							const canonicalWorkspace = resolveUserPath(resolveAgentWorkspaceDir(preparedModelRuntime.config, preparedAgentId));
							const isCanonicalWorkspace = canonicalWorkspace === resolvedWorkspace;
							const redactedSessionId = redactRunIdentifier(params.sessionId);
							const redactedSessionKey = redactRunIdentifier(params.sessionKey);
							const redactedWorkspace = redactRunIdentifier(resolvedWorkspace);
							if (requestedWorkspaceResolution.usedFallback) log$3.warn(`[workspace-fallback] caller=runEmbeddedAgent reason=${requestedWorkspaceResolution.fallbackReason} run=${params.runId} session=${redactedSessionId} sessionKey=${redactedSessionKey} agent=${preparedAgentId} workspace=${redactedWorkspace}`);
							startupStages.mark("runtime-context");
							notifyExecutionPhase("workspace");
							startupStages.mark("runtime-plugins");
							notifyExecutionPhase("runtime_plugins");
							const { provider, modelId } = resolveInitialEmbeddedRunModel({
								config: params.config,
								agentId: workspaceResolution.agentId,
								provider: params.provider,
								model: params.model
							});
							const normalizedSessionKey = params.sessionKey?.trim();
							const modelFallbackAvailability = params.modelFallbackAvailability ?? resolveModelFallbackAvailability({
								cfg: params.config ?? EMPTY_EMBEDDED_AGENT_CONFIG,
								agentId: workspaceResolution.agentId,
								sessionKey: normalizedSessionKey,
								hasSessionModelOverride: false,
								modelFallbacksOverride: params.modelFallbacksOverride
							});
							const fallbackConfigured = modelFallbackAvailability.kind === "active";
							if (modelFallbackAvailability.kind === "disabled_by_model_override") log$3.warn(`[model-fallback] configured fallbacks disabled by user model override run=${params.runId} session=${redactedSessionId}`);
							const resolvedSessionKey = normalizedSessionKey ?? runSessionTarget.sessionKey;
							const hookRunner = getGlobalHookRunner();
							const hookCtx = {
								runId: params.runId,
								jobId: params.jobId,
								agentId: workspaceResolution.agentId,
								sessionKey: resolvedSessionKey,
								sessionId: params.sessionId,
								workspaceDir: resolvedWorkspace,
								activeProjectKeys: [...activeProjectKeys],
								modelProviderId: provider,
								modelId,
								trigger: params.trigger,
								...buildAgentHookContextChannelFields(params),
								...buildAgentHookContextIdentityFields({
									trigger: params.trigger,
									senderId: params.senderId,
									chatId: params.chatId,
									channelContext: params.channelContext
								})
							};
							const hookResult = await runBeforeAgentReplyForTurn({
								runId: params.runId,
								trigger: params.trigger,
								event: { cleanedBody: params.prompt },
								context: hookCtx,
								onDispatch: () => notifyExecutionPhase("before_agent_reply", {
									provider,
									model: modelId
								}),
								onDeclined: () => notifyExecutionPhase("runtime_plugins", {
									provider,
									model: modelId
								})
							});
							if (hookResult?.handled) return {
								payloads: buildHandledBeforeAgentReplyPayloads(hookResult.reply),
								meta: {
									durationMs: Date.now() - started,
									agentMeta: {
										sessionId: params.sessionId,
										provider,
										model: modelId
									},
									finalAssistantVisibleText: hookResult.reply?.text ?? "NO_REPLY",
									finalAssistantRawText: hookResult.reply?.text ?? "NO_REPLY"
								}
							};
							assistantErrorTranscript ??= params.assistantErrorTranscript ?? createAssistantErrorTranscript(params);
							terminal ??= params.deferTerminalLifecycle ?? params.deferTerminalLifecycleEnd ? void 0 : createAgentLifecycleTerminalBackstop({
								runId: params.runId,
								sessionKey: params.sessionKey,
								startedAt: started,
								getLifecycleGeneration: () => lifecycleGeneration,
								resolveTerminationFields: (error) => resolveAgentRunErrorLifecycleFields(error, params.abortSignal),
								onTerminalEvent: (event) => runBestEffortCallback({
									callback: () => onAgentEvent?.(event),
									label: "lifecycle agent event",
									log: log$3
								})
							});
							const runTerminal = terminal;
							return await runPreparedEmbeddedLoop(refresh, {
								onInitialWriterPrepared: (resource) => {
									initialWriterResource = resource;
								},
								runParams: {
									...params,
									assistantErrorTranscript,
									deferTerminalLifecycle: true,
									onAttemptStart: () => {
										runTerminal?.beginAttempt();
										onAttemptStart?.();
									},
									onAgentEvent: runTerminal ? (event) => {
										runTerminal.note(event);
										return onAgentEvent?.(event);
									} : onAgentEvent
								},
								sessionAdmission,
								contextEngineAgentId,
								provider,
								modelId,
								agentDir,
								workspaceResolution,
								workspaceDir: resolvedWorkspace,
								bootstrapWorkspaceDir: canonicalWorkspace,
								isCanonicalWorkspace,
								globalLane,
								hookRunner,
								hookContext: hookCtx,
								fallbackConfigured,
								isProbeSession,
								resolvedSessionKey,
								resolvedToolResultFormat,
								startedAtMs: started,
								startupStages,
								emitStartupStageSummary,
								progressController,
								laneController,
								lifecycleGeneration,
								suspendForFailure,
								preparedModelRuntime
							});
						};
						const runWithPreparedRuntime = () => withPluginRuntimeGenerationScope(preparedModelRuntime, () => {
							context = AsyncLocalStorage.snapshot();
							return runPrepared();
						});
						return params.pluginGeneration ? await withPreparedModelRuntimePluginGenerationScope(preparedModelRuntimeLease.pluginGeneration, runWithPreparedRuntime, () => preparedLeaseActive ? preparedModelRuntimeOwnerSnapshot : void 0) : await runWithPreparedRuntime();
					} finally {
						const initialWriter = initialWriterResource;
						if (initialWriter) {
							initialWriterCleanup = context(() => work.track(async () => await initialWriter[Symbol.asyncDispose]()));
							initialWriterCleanup.catch(() => {});
						}
						preparedLeaseActive = false;
					}
				};
				generationCleanup = trackOwner(async () => {
					const closeWork = () => context(() => work.beginClose(parentSignal?.reason));
					parentSignal?.addEventListener("abort", closeWork, { once: true });
					if (parentSignal?.aborted) closeWork();
					try {
						callerResult.resolve(await work.track(runPreparedCandidate));
					} catch (error) {
						callerResult.reject(error);
					} finally {
						try {
							await AsyncWorkScope.runWhenAllIdle(() => [work], () => context(() => work.drain()));
						} finally {
							try {
								try {
									await initialWriterCleanup;
								} finally {
									await preparedRuntimeResource?.[Symbol.asyncDispose]();
								}
							} finally {
								parentSignal?.removeEventListener("abort", closeWork);
							}
						}
					}
				});
				generationCleanup.catch(callerResult.reject);
				return await callerResult.promise;
			};
			try {
				let failed = true;
				let result;
				try {
					for (;;) {
						const run = () => refresh.run(runGeneration);
						result = await (refreshed ? runOutsidePreparedModelRuntimePluginGenerationScope(() => runOutsidePluginRuntimeGenerationScope(run)) : run());
						const continuation = refresh.takeContinuation();
						if (refreshed || continuation) {
							mergeUsageIntoAccumulator(usage, result.meta.agentMeta?.usage);
							mergeAttemptRunStatsIntoAccumulator(usage, result.meta.agentMeta ?? {});
						}
						if (!continuation) {
							if (refreshed && result.meta.agentMeta) result = {
								...result,
								meta: {
									...result.meta,
									durationMs: Date.now() - started,
									agentMeta: {
										...result.meta.agentMeta,
										usage: toNormalizedUsage(usage),
										costUsd: usage.cost && usage.cost !== "unavailable" ? usage.cost.total : void 0,
										assistantTurns: usage.assistantTurns,
										...usage.bridgeCalls ? { bridgeCalls: usage.bridgeCalls } : {}
									}
								}
							};
							failed = Boolean(result.meta.error) || result.meta.stopReason === "error";
							break;
						}
						await generationCleanup;
						params = continuation;
						refreshed = true;
					}
				} finally {
					if (ownsAssistantErrorTranscript) await assistantErrorTranscript?.settle(failed && !params.abortSignal?.aborted);
				}
				refresh.mergeTerminalReceipt(result);
				if (result.meta.executionTrace?.runner !== "cli" && params.isFinalFallbackAttempt === void 0) settleRequesterRun(params, result, () => {
					throwIfAborted();
					params.preparedRunAdmission?.assertSourceCurrent();
				});
				const error = result.meta.error?.message ?? terminal?.getDeferredError();
				terminal?.emit(error ? "error" : "end", error ? new Error(error) : result, {
					...resolveAgentLifecycleTerminalMetadata(result.meta),
					...result.meta.agentMeta?.terminalReceipt ? { assistantTranscriptIdempotencyKey: result.meta.agentMeta.terminalReceipt.assistantTranscriptIdempotencyKey } : {}
				});
				return result;
			} catch (error) {
				const failure = params.isFinalFallbackAttempt === void 0 ? settleFailedRequesterRun(params, error, resolveSessionPlacementTurnSettlementAssertion()) : error;
				terminal?.emit("error", failure);
				throw failure;
			} finally {
				refresh.close();
			}
		});
	}).finally(() => {
		revokeMessageActionTurnCapability(recoveryMessageActionTurnCapability);
	});
}
//#endregion
export { compactEmbeddedAgentSession as n, runEmbeddedAgent as t };
