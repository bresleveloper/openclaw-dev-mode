import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { u as asPositiveFiniteNumber } from "./number-coercion-CkhMiRw8.mjs";
import { d as toErrorObject } from "./error-coercion-BwMr25F8.mjs";
import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { n as captureAsyncWorkTracker, r as getAsyncWorkSignal, t as AsyncWorkScope } from "./async-work-scope-BH2yUdBz.mjs";
import { o as resolveUserPath } from "./home-dir-CtsdYvX3.mjs";
import { c as isRecord, i as asOptionalObjectRecord } from "./record-coerce-TIsquoVR.mjs";
import { _ as normalizeUniqueTrimmedStringList } from "./string-normalization-D6DKCpwE.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { m as CONTEXT_OVERFLOW_ERROR_MESSAGE } from "./redact-BcXJu5HP.mjs";
import "./utils-gjJ-tD2q.mjs";
import { d as sleepWithAbort, i as createAbortError, o as racePromiseWithAbortSignal } from "./src-Bzfi3cQM.mjs";
import { t as isAbortError } from "./abort-signal-C9DFO3n5.mjs";
import { r as resolveStateDir } from "./state-dir-C8s3cOPX.mjs";
import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { g as getGatewayContextResolver } from "./gateway-request-scope-1BXD1G3l.mjs";
import { O as freezeDiagnosticTraceContext, r as emitDiagnosticEvent, t as areDiagnosticsEnabledForProcess } from "./diagnostic-events-C91J-XX8.mjs";
import { n as sanitizeForLog } from "./ansi-Xy3t0ZdY.mjs";
import { t as createSubsystemLogger } from "./subsystem-mStysHHC.mjs";
import { r as normalizeProviderId } from "./provider-id-D1VImdKk.mjs";
import { f as readDatabasePathIdentitySync } from "./sqlite-worker-identity-DLqVBf5J.mjs";
import { l as getOpenClawDatabaseMaintenanceScope } from "./openclaw-state-db-async-lifecycle-CtHZ7B35.mjs";
import { t as redactIdentifier } from "./node-crypto-BG4u3UnX.mjs";
import { t as classifyGatewayStorageFailure } from "./sqlite-error-diagnostics-BBfTUJBR.mjs";
import { c as resolveOpenClawAgentSqlitePath, s as resolveIncognitoOpenClawAgentSqlitePath } from "./openclaw-agent-db.paths-BGqL4GOe.mjs";
import { A as withTimeout } from "./fs-safe-6Z4UiMS4.mjs";
import { i as isSqliteTranscriptMutationConflict } from "./session-mutation-conflict-error-CvNdAcA_.mjs";
import { t as SessionTranscriptWriterClaimReboundError } from "./session-transcript-writer-claim-error-eP-_sDN9.mjs";
import { t as _usingCtx } from "./usingCtx-BhiZp_rS.mjs";
import { o as getRuntimeConfigSnapshot } from "./runtime-snapshot-BBYDJbw9.mjs";
import { a as sessionChanges } from "./session-row-changes-vFaNnKNM.mjs";
import { i as classifyAgentRunTerminalOutcome } from "./agent-run-terminal-outcome-CrMEEYuY.mjs";
import { O as retainQueuedAgentRunContext, b as registerAgentRunContext, i as claimAgentRunContext, u as getAgentRunContext } from "./agent-run-registry-gmaPgO-n.mjs";
import { C as withAgentRunLifecycleGeneration, a as emitAgentEvent, c as emitAgentEventIfCurrent, d as getAgentEventLifecycleGeneration, f as isAgentEventLifecycleGenerationCurrent, h as onAgentEventForRun, r as captureAgentRunLifecycleGeneration, t as assertAgentRunLifecycleGenerationCurrent } from "./agent-events-Bf3Js0D3.mjs";
import { f as sessionEntryCommitGuardOptions, o as composeSessionSourceAssertion } from "./session-source-authority-fdILH-PW.mjs";
import { i as isIncognitoSessionKey } from "./incognito-session-key-BWpn88lo.mjs";
import { M as parseAgentSessionKey, l as resolveAgentIdFromSessionKey } from "./session-key-CSDERtm3.mjs";
import { v as requireActivePluginRegistry } from "./runtime-DkPagH0y.mjs";
import { a as resolveAgentDir, f as resolveAgentWorkspaceDir } from "./agent-scope-config-fjA2T9Gz.mjs";
import { n as emitDiagnosticsTimelineEvent } from "./diagnostics-timeline-BgymzmGj.mjs";
import { o as loadPluginMetadataSnapshot } from "./plugin-metadata-snapshot-DET-4y9k.mjs";
import { D as isProfileInCooldown, P as resolveProfilesUnavailableReason } from "./user-model-account-authority-DFFjC5J5.mjs";
import { t as isStringOption } from "./string-readers-V5CfgPTP.mjs";
import { c as resolveSessionStorePathCore } from "./paths-YgcBNLgG.mjs";
import { I as revokeRuntimeAuthMaterializations, P as recordRuntimeAuthMaterialization } from "./runtime-snapshots-HRosak4u.mjs";
import { n as SecretSurfaceUnavailableError } from "./runtime-degraded-state-SptB0g_t.mjs";
import "./backoff-N5Hi0doU.mjs";
import { a as createNativeModelOwnedRuntimeModel, i as DEFAULT_PROVIDER, n as DEFAULT_MODEL } from "./defaults-Bg930vxE.mjs";
import { r as resolvePersistedSessionStoreOwnerForTarget } from "./session-store-owner-iJNKNMuJ.mjs";
import { _ as resolveSessionAgentIds, h as resolveSessionAgentId, m as resolveRunModelFallbacksOverride, p as resolveModelFallbackAvailability, v as resolveSessionAgentIdsStrict } from "./agent-scope-DXrnO3F4.mjs";
import { c as normalizeToolPolicyName } from "./tool-policy-shared-PsZCKeeN.mjs";
import "./tool-policy-14GRhbFd.mjs";
import { t as MODEL_APIS } from "./model-config-vocabulary-Cb5jWCSz.mjs";
import "./types.models-BqvzicE8.mjs";
import { a as normalizeOptionalAgentRuntimeId } from "./agent-runtime-id-BZLMe-UU.mjs";
import { n as withPluginRuntimeGenerationScope, t as runOutsidePluginRuntimeGenerationScope } from "./generation-scope-CwTBwQp1.mjs";
import { r as resolveProviderPolicySurface } from "./provider-public-artifacts-C49Gg9BA.mjs";
import { a as resolveProviderModelRoutes } from "./provider-model-routes-CmpBxrCV.mjs";
import { d as isConfiguredKeyAuthSource, t as providerModelRouteAcceptsAuthMode } from "./provider-model-route-auth-C7odu5x8.mjs";
import { o as resolveProviderModelAuthPolicy } from "./model-runtime-policy-DSkspt0X.mjs";
import { i as modelMatchesProviderModelRoute, r as isProviderModelRerouted } from "./provider-model-route-D2MOzv0r.mjs";
import { o as resolvePreparedModelThinkingCompat } from "./model-catalog-lookup-BJKolYfz.mjs";
import { i as resolveModelExtraParamSources, r as resolveAliasedParamValue } from "./model-extra-params-HwiZgNCH.mjs";
import { c as resolveContextConfigProviderForRuntime, d as resolveSelectedOpenAIRuntimeProvider, n as OPENAI_PROVIDER_ID } from "./openai-routing-Bm7d8DH8.mjs";
import { n as getUserTurnTranscriptAdmissionOwner } from "./user-turn-transcript-admission-BZunVvZI.mjs";
import { n as normalizeMessageChannel } from "./message-channel-core-BBQx3_oI.mjs";
import "./message-channel-normalize-CsnAJK7x.mjs";
import { c as resolveMessageActionTurnCapabilityLifetime, l as revokeMessageActionTurnCapability, n as isTrustedMessageActionTurnIngress, r as mintMessageActionTurnCapability } from "./message-action-turn-capability-CbQswcwc.mjs";
import { n as captureSessionTranscriptTargetBinding } from "./transcript-target-binding-uO0pz59U.mjs";
import { _ as resolveAdmittedRunActiveAssertion, g as readRunOperatorAuthority, n as assertOperatorModelAllowed, u as getAdmittedRunDelegatedAuthority, v as resolvePreparedRunAdmission } from "./admitted-run-context-h1ULFETN.mjs";
import { o as isMarkdownCapableMessageChannel } from "./message-channel-DmAdWHmL.mjs";
import { st as projectPublicSessionEntry } from "./session-actor-memory-owner-BSARM2d5.mjs";
import { o as resolveSessionStorePathForScope } from "./session-store-path-BQkYPc4_.mjs";
import { d as isProviderRequestSizeCeilingError, h as isTimeoutErrorMessage } from "./message-patterns-DSkmGYcR.mjs";
import { i as getFailoverErrorCode, n as FailoverError } from "./error-Bcp4ZyOv.mjs";
import { a as createAgentRunDirectAbortError, m as resolveAgentRunErrorLifecycleFields } from "./run-termination-Dwf1ksjA.mjs";
import { t as isProviderRefusalAssistantError } from "./diagnostics-CAGhEztD.mjs";
import { a as resolveSessionWorkStartError, f as readProviderReviewAcknowledgment, l as claimProviderReviewAttempt, p as recordSessionProviderReview, s as assertSessionProviderReviewWorkStart, u as createSessionProviderReview } from "./session-work-start-Sz_vqYld.mjs";
import { n as runWithoutOwnedSessionTranscriptWrites } from "./transcript-write-context-owner-Dx0JDp93.mjs";
import { f as withExecRequestTurn, n as adoptExecRequestSession, o as captureExecRequestOwners } from "./exec-request-context-CWnK9ayt.mjs";
import { u as resolveEmbeddedRunTerminalToolFailure } from "./run-diagnostics-DHdTDo8H.mjs";
import { r as isExecLikeToolName } from "./tool-error-summary-CezRoLUS.mjs";
import { o as hasReplyPayloadContent } from "./payload-qyD1vby_.mjs";
import { C as markReplyPayloadForSourceSuppressionDelivery, D as setReplyPayloadMetadata, c as getReplyPayloadMetadata, o as copyReplyPayloadMetadata, p as isHostNoticePayload, t as FAST_MODE_AUTO_PROGRESS_KIND, y as isReplyPayloadTerminalContent } from "./reply-payload-BLX_BF2U.mjs";
import { n as deriveContextPromptTokens, u as normalizeUsage } from "./usage-BqbJmOEZ.mjs";
import { a as resolveSessionPermissionExecMode } from "./session-permission-exec-mode-orsENUww.mjs";
import { f as withGatewayToolCallerIdentity, r as createAdmittedGatewayToolCallerIdentity } from "./gateway-caller-context-Be176_GV.mjs";
import { n as readChannelSourceTurnId, r as readChannelSourceTurnSameThreadRequired } from "./source-turn-id-DjBP_DbU.mjs";
import { i as toDatabaseOptions, r as resolveSqliteSessionKey } from "./session-accessor.sqlite-scope-helpers-XTtpZpWK.mjs";
import { n as parseSqliteSessionFileMarker, t as formatSqliteSessionFileMarker } from "./legacy-sqlite-marker-CkjJ0jcJ.mjs";
import { n as SILENT_REPLY_TOKEN, o as isSilentReplyText } from "./tokens-DHFPcfdZ.mjs";
import { S as renderRateLimitRetryExhaustion, a as formatBillingErrorMessage, f as renderAuthProfileFailoverCopy } from "./user-copy-BAz4s3EV.mjs";
import { a as parseImageSizeError, i as parseImageDimensionError } from "./classify-core-Y2V-pZHU.mjs";
import { n as OAuthRefreshFailureError } from "./oauth-refresh-failure-H1_-S915.mjs";
import { a as failoverReasonFromClassification } from "./classification-rules-CaFCPBKV.mjs";
import { a as isAgentHarnessPreflightError, t as AgentHarnessPreflightError } from "./errors-BAipjK5G.mjs";
import { a as readCapturedSessionActorEntry, n as captureSessionActorStorageOwner, o as runWithSessionActorStorage, r as getSessionActorStorageBinding, t as acquireSessionActorStorage } from "./session-actor-storage-binding-oCtbPk00.mjs";
import { n as captureMemoryExactSessionReader } from "./session-accessor.memory-exact-read-UNAhvKNR.mjs";
import { r as resolveSqliteScope } from "./session-accessor.sqlite-read-scope-DzGQuOfU.mjs";
import "./session-accessor.sqlite-scope-9ysL95gx.mjs";
import { g as sessionChangeAffectsStoredRow, h as prepareSessionRowPublicationScope } from "./session-actor-replica-D_j2y4I5.mjs";
import { t as assertSessionEntryCohortScope } from "./session-entry-cohort-scope-BWJvT1Qn.mjs";
import { t as captureSessionEntryNativeMutationWitness } from "./session-entry-read-ordered-ygEz3W0N.mjs";
import { o as withSessionHistoryWorkerDatabase } from "./session-transcript-worker-runtime-DyHfVUVm.mjs";
import { a as readSessionEntrySummariesInWorker, d as readSessionEntryInWorker, i as readSessionEntryReadOnlyInWorker, l as withSessionEntryReadOnlyInWorker, s as withSessionEntriesFromStoreInWorker } from "./session-entry-read-runtime-CgqUrGct.mjs";
import { c as waitForSessionTranscriptProjection } from "./session-transcript-reconcile-BkwlDaaD.mjs";
import "./session-accessor-Czw4l8kI.mjs";
import { n as beginSessionWorkAdmission } from "./session-lifecycle-admission-BihxXo5j.mjs";
import { o as patchSessionEntryCore, t as applySessionEntryOperation } from "./session-accessor.sqlite-entry-wJ2W65pX.mjs";
import { h as resolveSessionPinnedHarnessId } from "./agent-harness-session-key-zbrcLVpT.mjs";
import { g as withOwnedSessionTranscriptWrites } from "./transcript-write-context-C02sC3zd.mjs";
import "./config-B3oiWDlr.mjs";
import { r as appendTranscriptMessage } from "./session-accessor.sqlite-transcript-write-B1_nzUQQ.mjs";
import { n as recordModelFallbackStop } from "./model-fallback-stop-BtVvqU7l.mjs";
import { o as resolveSessionTranscriptRuntimeTarget } from "./session-accessor.transcript-target-DDngfM5X.mjs";
import "./sessions-CnzPI1yx.mjs";
import "./lifecycle-CKc8qk3B.mjs";
import { n as resolveAgentTimeoutMs } from "./timeout-BBs3o51w.mjs";
import { n as getRegisteredAgentHarness } from "./registry-BDZ8eM01.mjs";
import { a as resolveAgentHarnessPreparedRouteSupport, i as resolveAgentHarnessPreparedAuthSupport, t as assertPluginHarnessConversationToolPolicySupport } from "./support-CqB31PZB.mjs";
import { p as resolveSubscriptionAuthModeForProfiles } from "./order-CElLtwMu.mjs";
import { a as resolveLegacyInheritedAuthDir } from "./legacy-inherited-auth-dir-BO2hiLXD.mjs";
import { n as resolveAuthoredModelContextTokens } from "./context-resolution-CKREdq15.mjs";
import { r as listModelCatalogObservedRoutes, t as createModelCatalogSnapshotView } from "./model-catalog-view-UkLRAY5C.mjs";
import { a as resolveCandidateThinkingLevel } from "./thinking-runtime-DuxsJR5q.mjs";
import { n as estimateAggregateUsageCost } from "./usage-format-DT58obO2.mjs";
import { i as readSessionRuntimeOwnershipAsync } from "./session-utils-model-selection-pzj_r9Dj.mjs";
import { n as captureSessionEntrySourceAssertion } from "./session-entry-source-authority-CY_NaTk4.mjs";
import { l as resolveSecretSentinel, s as looksLikeSecretSentinel } from "./sentinel-DZP_CK2t.mjs";
import { t as readGitHubPublicationFact } from "./github-publication-discovery-Byp0fSsI.mjs";
import { a as resolveProviderRequestCapabilities, r as resolveProviderEndpoint } from "./provider-attribution-Dr21G8q1.mjs";
import { a as getModelProviderRequestRouteFacts, t as applyPreparedRuntimeAuthToModel } from "./provider-request-config-WdycwKIG.mjs";
import { c as resolveSafeTimeoutDelayMs } from "./timeouts-ClVlVfGz.mjs";
import { o as resolveContextEngine, s as resolveContextEngineOwnerPluginId } from "./registry-BNFZRyO5.mjs";
import { n as getGlobalHookRunner } from "./hook-runner-global-yjqy4fXI.mjs";
import { u as withClaimingHookAdmission } from "./hooks-CU2qx9-T.mjs";
import { d as createAgentPluginRuntimeRefresh, u as captureAgentPluginRuntimeRefresh } from "./agent-tools.before-tool-call-CtP0G8Wg.mjs";
import { t as PreparedModelRuntimeOwnerNotPublishedError } from "./prepared-model-runtime-admission-errors-DFzPwru3.mjs";
import { o as isConfigBackedInlineProviderApiKey, w as MissingProviderAuthError } from "./model-auth-provider-config-C_EL9CxV.mjs";
import { c as ensureAuthProfileStoreWithoutExternalProfilesAsync, i as ensureAuthProfileStoreAsync } from "./store-runtime-CwqGD12G.mjs";
import { r as buildAgentRunTerminalOutcomeFromAttempt, u as projectAgentRunAttemptTerminal } from "./agent-run-terminal-outcome-D-ijbyA8.mjs";
import { t as captureAgentRunProviderReview } from "./provider-review-terminal-AynIUPxs.mjs";
import { l as resolveFastModeForElapsed, n as formatFastModeAutoProgressText, u as resolveFastModeModelAutoOnSeconds } from "./fast-mode-smSVCJXN.mjs";
import "./fast-mode-DezNRstT.mjs";
import { n as recordAgentCleanupFailure, r as runAgentCleanupStep } from "./run-cleanup-timeout-CjK4qQ1w.mjs";
import { n as isToolResultError } from "./tool-result-error-IpvGgAny.mjs";
import { g as getReplyOperationSessionReader, n as acknowledgeReplySessionTransition } from "./reply-run-registry.state-Hn_UqZjq.mjs";
import "./active-run-projections-Crpg2l0z.mjs";
import { r as resolveCompactionTimeoutMs, t as compactContextEngineWithSafetyTimeout } from "./compaction-safety-timeout-Cgwbj_da.mjs";
import { n as resolveSessionPlacementTurnSettlementAssertion } from "./session-placement-forced-terminal-settlement-Buc-FlZv.mjs";
import { A as restoreEmbeddedRunTimeoutAbandonment, C as resolveActiveEmbeddedRunHandleSessionIdBySessionFile, M as setActiveEmbeddedRun, N as supersedeEmbeddedAgentRunByRunId, S as resolveActiveEmbeddedRunHandleSessionId, a as clearActiveEmbeddedRun, f as isEmbeddedAgentRunHandleActive, g as markEmbeddedRunRecoveringTimeout } from "./runs-Czr-I6_B.mjs";
import { n as registerAgentRunCapacityWait } from "./agent-run-capacity-wait-DbnNjNgr.mjs";
import { t as resolvePreferredSessionKeyForSessionIdMatches } from "./session-id-resolution-B3ptFjot.mjs";
import { o as prepareAgentWorkspaceAttachments } from "./workspace-access-sFz3TNTx.mjs";
import { d as resolveProviderRuntimePluginHandle, o as resolveProviderAuthProfileId, t as attachModelProviderRuntimePluginHandle } from "./provider-hook-runtime-DHSjZAkW.mjs";
import { n as isLikelyContextOverflowError } from "./context-overflow-kbcu3uXy.mjs";
import { n as classifyFailoverSignal, t as classifyFailoverReason } from "./classify-PIr_bdgF.mjs";
import { t as PreparedModelRuntimeInitialRunAdmissionError } from "./prepared-model-runtime.errors-DCd9wajc.mjs";
import { t as isSessionTranscriptTurnMismatchErrorMessage } from "./transcript-turn-error-B3HTXnww.mjs";
import { a as findCliTerminalStopError, f as resolveFailoverClassificationFromError, i as describeFailoverError, l as hasRecordedModelFallbackStop, m as resolveFailoverStatus, p as resolveFailoverReasonFromError, r as coerceToFailoverError, u as isCliTerminalStopCode } from "./failover-error-Bjf0VdY2.mjs";
import { a as resolveStoredSessionKeyForSessionId, i as resolveSessionKeyForRequestCore } from "./session-Cb56xLxH.mjs";
import { i as resolveSessionSuspensionTarget, o as suspendSession, r as resolveSessionSuspensionReason } from "./session-suspension-CAhJSkXK.mjs";
import { i as enqueueCommandInLane, o as getCommandLaneSnapshot, u as isCommandLaneTaskTimeoutError } from "./command-queue-Dvag6gVL.mjs";
import { a as isRetryableProviderHttpStatus, i as hasOrganizationTpmRateLimitEvidence, o as resolveRetryAfterMs, r as hasLongWindowRateLimitEvidence, s as shouldRetryFailoverSignal, t as classifyRateLimitWindow } from "./retry-evidence-BSh9bhDe.mjs";
import { l as retireSessionMcpRuntime } from "./agent-bundle-mcp-manager-api-BF9Uyz8N.mjs";
import { n as markAuthProfileSuccess } from "./profiles-Df1OQ7iN.mjs";
import { t as sanitizeForConsole } from "./console-sanitize-CaBHLewO.mjs";
import { n as markAuthProfileFailure, r as markInlineProviderApiKeyFailure } from "./usage-CRucybdr.mjs";
import { a as withPreparedModelRuntimePluginGenerationScope, n as getPreparedModelRuntimePluginGeneration, r as runOutsidePreparedModelRuntimePluginGenerationScope, t as getPreparedModelRuntimeBorrowedSnapshot } from "./prepared-model-runtime-generation-scope-D16PssC2.mjs";
import { F as prepareProviderRuntimeAuth, _ as providerOwnsDynamicModelPreparation } from "./provider-runtime-DZ8luukj.mjs";
import { i as unwrapSecretSentinelsForProviderEgress } from "./provider-secret-egress-CQZW-nmd.mjs";
import { n as isCompactionFailureError, t as extractObservedOverflowTokenCount } from "./context-overflow-observation-BkrW1kAi.mjs";
import { r as resolveModelCandidateChain } from "./model-fallback-candidates-DziklVcV.mjs";
import "./auth-profiles-DB76NhmT.mjs";
import { v as resolveLoadedMemoryProviderKind } from "./memory-state-CrbG6eAa.mjs";
import { E as readAdmittedPublishedModelCatalog, a as acquireReadOnlyPreparedModelRuntime, t as acquireAgentRunPreparedModelRuntime } from "./prepared-model-runtime-wDlPVSla.mjs";
import { i as resolveLiveToolResultMaxChars } from "./tool-result-limits-tYfGdUlb.mjs";
import { s as createAgentHarnessCompletionScope } from "./agent-harness-completion-recovery-C73KNckX.mjs";
import { a as shouldUseTransientCooldownProbeSlot, i as resolveProbeThrottleKey, o as LiveSessionModelSwitchError, r as markProbeAttempt } from "./model-fallback-runner-ZDIjnIyf.mjs";
import { n as isTerminalAssistantError, t as isRetryableAssistantError } from "./retry-2KnjF4V1.mjs";
import { a as isFailoverAssistantError, i as isBillingAssistantError, n as classifyAssistantFailoverReason, o as isRateLimitAssistantError, r as isAuthAssistantError, t as buildAssistantFailoverSignal } from "./assistant-message-failures-LYMR8J6z.mjs";
import { m as formatUserFacingAssistantErrorText, p as formatAssistantErrorText, s as pickFallbackThinkingLevel } from "./embedded-agent-helpers-CRUmVsjM.mjs";
import { i as resolveCurrentSourceMessagingToolPartial, r as normalizeTextForComparison } from "./messaging-dedupe-D188k2i5.mjs";
import { n as buildTextObservationFields, r as shouldSuppressRawErrorConsoleSuffix, t as buildApiErrorObservationFields } from "./embedded-agent-error-observation-D3FVUug5.mjs";
import { n as buildCompactionFailureResult, r as classifyCompactionReason, t as DEFERRED_CONTEXT_ENGINE_COMPACTION_REASON } from "./compact-reasons-DEvuk_7a.mjs";
import { t as buildProviderAuthRecoveryHint } from "./provider-auth-recovery-hint-CobbpYma.mjs";
import { t as prepareCronRootSessionGeneration } from "./session-delivery-generation-NkiiEowi.mjs";
import { i as resolveReplyExpectation, n as observeReplyDelivery } from "./reply-completion-B5n1Cnxm.mjs";
import { n as OPENCLAW_EMBEDDED_CONTEXT_ENGINE_HOST } from "./host-compat-DWLjZN89.mjs";
import { t as beginForegroundSessionMaintenance } from "./coordinator-CAtNkN-G.mjs";
import { t as createStageTimingTracker } from "./stage-timing-BUG4Fnsv.mjs";
import "./agent-bundle-mcp-tools-CR5Vro5t.mjs";
import { t as emitAgentActivityEvent } from "./agent-activity-events-D7azORwm.mjs";
import { t as registerLegacyContextEngine } from "./init-g-4TXKd7.mjs";
import { i as getApiKeyForModelCore, n as applyLocalNoAuthHeaderOverride, t as applyAuthHeaderOverride } from "./model-auth-CMoPmop7.mjs";
import { n as resolveEmbeddedCliBackendDispatchEligibilityAsync } from "./cli-backend-dispatch-eligibility-BMWTSYsM.mjs";
import { s as buildContextEngineRuntimeSettings } from "./context-engine-lifecycle-8o0i3Txa.mjs";
import { t as runWithAsyncWorkResources } from "./async-work-resources-DmPouonj.mjs";
import { a as maybeCompactAgentHarnessSession, i as resolveLegacyCompactionSessionKey, n as requireCompactionWriterEntry, o as isRecoverableNativeHarnessBindingFailure, r as resolveContextEngineCompactionSuccessor, t as acceptCompactionSuccessor } from "./compaction-successor-DzFpzm0P.mjs";
import { n as resolveModelAsync, t as createEmptyAgentDiscoveryStores } from "./model-DTfH9r49.mjs";
import { t as materializePreparedRuntimeModel } from "./materialize-model-EsjVwK5o.mjs";
import { t as buildAgentRuntimeAuthPlan } from "./auth-Cszei1X7.mjs";
import { n as canRunPreparedAgentRuntimeAuthAttempt, r as prepareAgentRuntimeAuth } from "./prepare-auth-B180a1GD.mjs";
import { a as resolveCredentialScopedAuthAttemptModelDecision, i as providerUsesCredentialScopedModelMetadata, n as createPreparedRuntimeModelMaterializer, r as hasPreparedAuthAttemptModelMetadata, t as protectPreparedProviderRuntimeAuth } from "./provider-runtime-auth-protection-DSbtbt81.mjs";
import { r as prepareAgentHarnessNativeToolPolicyRestricted, t as assertAgentHarnessExecutionEnvironment } from "./execution-environment-DP1yYe5g.mjs";
import { n as buildAgentHookContextIdentityFields, t as buildAgentHookContextChannelFields } from "./hook-agent-context-C9bjjC7S.mjs";
import { r as retainAgentHarnessCompactionSource } from "./host-capability-CtHEkIpy.mjs";
import { c as resolveDelegationCapability } from "./agent-tools-QGgE-Vnu.mjs";
import { t as resolveProcessToolScopeKey } from "./bash-process-scope-2cvMG8cQ.mjs";
import { a as isHostMemoryAudience, c as resolveMemoryAudienceFromEntry, n as assertMemoryAudienceSession } from "./memory-audience-BLl7Ac2w.mjs";
import { t as AGENT_LANE_SUBAGENT } from "./lanes-BJoXx6GG.mjs";
import { t as resolveToolLoopDetectionConfig } from "./tool-loop-detection-config-uCpxGkcu.mjs";
import { b as resolveSourceReplyDelivery, h as hasOutboundDeliveryEvidence, m as hasMessagingToolDeliveryEvidence } from "./delivery-evidence-Do1wex_l.mjs";
import { m as sanitizeAssistantVisibleStreamText } from "./embedded-agent-utils-Bl20r92X.mjs";
import { a as assertRequiredWorkerSelection } from "./required-worker-profile-B0DIhkdC.mjs";
import { a as fingerprintResolvedAuthProfileCredential, i as fingerprintOpaqueRuntimeOwner, n as fingerprintAuthProfileOwnerShape, o as fingerprintResolvedProviderAuth, r as fingerprintAwsSdkRuntimeOwner } from "./execution-auth-binding-DMYnQN17.mjs";
import { r as mergeAcceptedSessionSpawnsForRun } from "./accepted-session-spawn-Bo7jgCE_.mjs";
import { n as resolveSessionLane, t as resolveGlobalLane } from "./lanes-DQO4OUmF.mjs";
import { n as getCoreTtsAttemptResultMediaUrls, t as copyCoreTtsAttemptResultProvenance } from "./tts-tool-result-provenance-BbSbWcUn.mjs";
import { t as log$3 } from "./logger-BpVUgEyL.mjs";
import { t as runBestEffortCallback } from "./embedded-agent-subscribe.callback-BBye3ou6.mjs";
import { t as copyExplicitSkillSelectionFileHost } from "./skill-command-provenance-D3weQ69x.mjs";
import { n as remapExplicitSkillSelectionPath, r as remapSkillReferencePaths } from "./sandbox-skills-DF-8lllB.mjs";
import { A as resolveRunLivenessState, B as resolveEmbeddedRunAttemptTerminalOutcome, C as createAttemptCarryover, D as hasYieldContinuationEvidence, E as hasRunContinuationEvidence, I as isEmbeddedRunTerminalAbort, L as isEmbeddedRunTerminalInterrupted, M as shouldRetryMissingAssistantTurn, N as prepareEmbeddedAttemptPromptExecution, O as resolveIncompleteTurnPayloadText, R as isEmbeddedRunTerminalTimeout, S as markLastProviderPromptContextRejected, T as YIELD_DIAGNOSTIC_TEXT, U as prepareEmbeddedSkills, V as resolveEmbeddedRunAttemptTerminalState, a as resolveEmbeddedSessionContextLimits, b as clearProviderPromptState, i as resolveAgentRunSessionTarget, j as resolveSilentToolResultReplyPayload, k as resolveReplayInvalidFlag, o as withReleasableExecutionCapacity, r as applyAgentRunSessionTargetIdentity, v as resolveProviderRefusal, w as TRUNCATED_REPLY_NOTICE_TEXT, x as getProviderPromptState, z as isEmbeddedRunTimeoutFinal } from "./builtin-openclaw-CMvbELtK.mjs";
import { G as formatEmbeddedRunStageSummary, U as EMBEDDED_RUN_ATTEMPT_DISPATCH_STAGE, W as createEmbeddedRunStageSummaryEmitter, Y as declarePromptHistoryRewrite, c as applyResolvedToolPromptFinalizer, et as preparePluginHarnessWorkspace, r as measureEmbeddedAgentPreparation, tt as resolveHarnessWorkspace } from "./attempt-system-prompt-prepare-D8zKFv2e.mjs";
import { c as withRequiredSessionPlacement, d as settleRequesterRun, f as EMBEDDED_RUN_LANE_TIMEOUT_GRACE_MS, h as shouldNoteLaneWait, l as withSessionPlacementTurnAdmission, m as resolveEmbeddedRunSessionLanePolicy, p as resolveEmbeddedRunLaneTimeoutMs, r as prepareSessionPlacementSandbox, u as settleFailedRequesterRun } from "./session-placement-admission-DV-Z5szH.mjs";
import { o as restoreCacheTtlToolResultProjections, s as sessionLikelyHasOversizedToolResults, u as truncateOversizedToolResultsInSessionManager } from "./tool-result-truncation-B6wvsjzz.mjs";
import { f as retainEmbeddedSessionPromptState } from "./session-prompt-state-tij27tsD.mjs";
import { S as mapThinkingLevelForProvider, _ as resolveModelCallUrgency, d as buildEmbeddedCompactionRuntimeContext, f as resolveCompactionContextTokenBudget, n as waitForDeferredTurnMaintenanceForSession, t as runContextEngineMaintenance, u as resolveContextEngineCapabilities, v as forgetPromptBuildDrainCacheForRun } from "./context-engine-maintenance-DybI5s-J.mjs";
import { t as listActiveProcessSessionReferences } from "./bash-process-references-By_k1Nsh.mjs";
import { t as SessionManager } from "./session-manager-Mve5HWCW.mjs";
import { i as withSessionManagerWrite, t as appendSessionTranscriptNote } from "./session-manager-write-admission-Ca7jiEvG.mjs";
import { C as hasAsyncActivity, D as shouldContinueInteractiveAcceptedSessionSpawns, E as resolveCurrentAttemptAssistant, T as isCurrentAttemptReplaySafe, b as observeReplayMetadata, c as resolveReasoningOnlyRetryInstruction, d as shouldRetrySilentErrorAssistantTurn, f as shouldTreatEmptyAssistantReplyAsSilent, h as hasComposedVisibleAnswerAfterSettledTools, l as resolveSettledToolBatchEvidence, m as countSettledTurnDeliveryPayloads, r as createToolTerminalObserver, s as resolveEmptyResponseRetryInstruction, u as resolveSettledToolTerminalContinuationInstruction, v as isStrictAgenticExecutionContractActive, w as hasAttemptTerminalState, y as createEmbeddedRunReplayState } from "./sdk-Bxnj3yKa.mjs";
import { a as projectTrajectorySessionTarget, i as projectEmbeddedMessageContext } from "./attempt-tool-run-context-B4q5w5uB.mjs";
import { r as buildUsageWithNoCost, t as buildAssistantMessage } from "./stream-message-shared-CYuIJ_XF.mjs";
import { i as toNormalizedUsage, n as mergeAttemptRunStatsIntoAccumulator, r as mergeUsageIntoAccumulator, t as createUsageAccumulator } from "./usage-accumulator-Cd3yWsMu.mjs";
import { a as buildUsageAgentMetaFields, c as resolveEmbeddedAttemptBasePrompt, d as resolveFinalMessageRawText, f as resolveLatestCallUsage, i as buildErrorAgentMeta, l as resolveFinalAssistantRawText, m as resolveReportedModelRef, n as RUNTIME_AUTH_REFRESH_MIN_DELAY_MS, o as createRunRecoveryDiagId, p as resolveMaxRunRetryIterations, r as RUNTIME_AUTH_REFRESH_RETRY_MS, s as normalizeAssistantUsageForContext, t as RUNTIME_AUTH_REFRESH_MARGIN_MS, u as resolveFinalAssistantVisibleText } from "./helpers-3t21Jnao.mjs";
import { t as createTrajectoryRuntimeRecorder } from "./runtime-j-hZS2Rj.mjs";
import { t as TOOL_FAILURE_INSTRUCTION } from "./tool-outcome-instructions-D1-OxlK6.mjs";
import { r as resolveSettledTurnFinalizationText } from "./settled-turn-finalization-result-DJqqJfy5.mjs";
import { i as selectAgentHarnessForPreparedModelProviders, n as runAgentHarnessSettledTurnFinalization, r as selectAgentHarness, t as runAgentHarnessAttempt } from "./selection-2hiqqZF8.mjs";
import { t as ensureSelectedAgentHarnessPlugin } from "./runtime-plugin-Cq540iGR.mjs";
import { a as bindRunToPreparedModelRuntime, c as attachCompactionAccountingRecorder, d as resolveCompactionRuntimeSelection, f as runForegroundCompactionWork, i as setTranscriptBytePreflightClaim, l as prepareCompactionHarnessAuth, n as compactNativeCliSession, o as resolvePreparedRuntimeWorkspaces, r as resolveTranscriptBytePreflightAuthority, s as resolveTieredModel, u as projectCodexHostTranscriptBytePreflightConfig } from "./compact-BaLWDGiA.mjs";
import { t as prepareAgentPromptProjects } from "./prompt-projects-CmyCl0nZ.mjs";
import { i as runPostCompactionSideEffects } from "./compaction-hooks-BISrU4Be.mjs";
import { n as buildAgentRuntimePlan } from "./build-DEInH0lK.mjs";
import { t as redactRunIdentifier } from "./workspace-run-BDvmk-WD.mjs";
import { n as resolveAgentLifecycleTerminalMetadata, t as createAgentLifecycleTerminalBackstop } from "./agent-lifecycle-terminal-SUD9mca8.mjs";
import { n as buildHandledBeforeAgentReplyPayloads, r as runBeforeAgentReplyForTurn, t as resolveAuthProfileFailureReason } from "./auth-profile-failure-policy-LZxb6qEh.mjs";
import { a as createAssistantErrorTranscript, i as resolveHookModelSelection, n as resolveAgentHarnessRunAdmissionError, r as resolveEmbeddedRuntimeModelPolicy, t as buildBeforeModelResolveAttachments } from "./setup-DVU5HHwS.mjs";
import { r as stripOpenClawMcpToolPrefix } from "./tool-policy-tVbJkh67.mjs";
import { i as resolveMessagingToolPayloadDedupe, n as filterMessagingToolReplyPayload, t as filterMessagingToolMediaDuplicates } from "./reply-payloads-dedupe-BrUO_MCX.mjs";
import { n as mergeAttemptToolMediaPayloads, t as createPendingToolMediaCarry } from "./tool-media-payloads-Bo7KGT_H.mjs";
import { r as shouldSwitchToLiveModel, t as clearLiveModelSwitchPending } from "./live-model-switch-DJo_mh8Y.mjs";
import { n as admitEmbeddedContextEngine, r as buildEmbeddedRunBlockedResult, t as prepareAttemptSystemPromptAdditions } from "./attempt-system-prompt-additions-DnfPJfiH.mjs";
import { t as createEmbeddedRunPermissionChanges } from "./permission-change-B52THMzO.mjs";
import { n as agentHarnessExposesOpenClawTools, t as agentHarnessBuildsOpenClawTools } from "./tool-surface-IfrXL-aa.mjs";
import { t as recordAdmittedModelRoutingDecision } from "./model-routing-decision-CSasL009.mjs";
import { n as resolveSessionSkillResourceSnapshot } from "./session-placement-skill-resources-CmhRatmG.mjs";
import { c as resizeExecApprovalContinuationPrompt } from "./bash-tools.exec-approval-output-BqQWG-4m.mjs";
import { a as resolveRequestStreamTransportOverrides, i as resolveInitialThinkLevel, n as resolveAttemptTrajectoryAttribution, r as resolveInitialEmbeddedRunModel } from "./runtime-resolution-Bu3JoF4M.mjs";
import { n as incrementCompactionCount } from "./session-updates-gu7HvAu8.mjs";
import { r as readSourceReplyDeliveryRuntime } from "./source-reply-delivery-runtime-BK3shed3.mjs";
import { t as resolveExternalCliAuthOverlayScopeFromSelection } from "./external-cli-auth-selection-DGRMjZzt.mjs";
import { t as appendAssistantMirrorMessageByIdentity } from "./session-transcript-runtime-Bxvuf0q8.mjs";
import { t as applyPreparedReplyMedia } from "./reply-media-paths-y_fVmvUY.mjs";
import { t as buildEmbeddedRunPayloads } from "./payloads-BFSgp01j.mjs";
import { r as isBackgroundWorkLane } from "./background-work-CTe7u0tU.mjs";
import { randomBytes } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { AsyncLocalStorage } from "node:async_hooks";
import { isResponsesOutputLimitToolCallError } from "@openclaw/ai/diagnostics";
import { isContextOverflow } from "@openclaw/ai/internal/runtime";
import { CompactionReplayRefreshRequiredError, isCompactionReplayCheckpoint } from "@openclaw/ai/transports";
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
/** Both compaction runtimes cancel pending queue admission before releasing their writer. */
function enqueueCompactionInLanes(params, run) {
	const sessionLane = resolveSessionLane(params.sessionKey?.trim() || params.sessionId);
	const globalLane = resolveGlobalLane(params.lane, params);
	const enqueueGlobal = params.enqueue ?? ((task, opts) => enqueueCommandInLane(globalLane, task, opts));
	const options = {
		abortSignal: params.abortSignal,
		sessionTarget: {
			agentId: params.agentId,
			sessionKey: params.sessionKey,
			sessionId: params.sessionId
		}
	};
	return enqueueCommandInLane(sessionLane, () => enqueueGlobal(run, options), options);
}
async function runPrimaryNativeCompactionInLanes(params, expectedEntry, host, run) {
	return await enqueueCompactionInLanes(params, async () => {
		host.assertActive?.();
		await withSessionEntryReadOnlyInWorker({
			...params.sessionTarget,
			readConsistency: "latest"
		}, () => host.assertActive?.(), async (read) => {
			if (!read.ok) throw read.error;
			requireCompactionWriterEntry(read.value, expectedEntry);
		});
		host.assertActive?.();
		return run();
	});
}
async function executeQueuedContextEngineCompaction(input) {
	const { params, preparedParams, runtimeTarget, expectedEntry, host, contextEngine, contextEngineSessionKey, contextEngineRuntimeContext, contextEngineRuntimeSettings, resolvedWorkspaceDir, preparedModelRuntime, effectiveRuntimeModel, preparedHarnessRuntime, contextTokenBudget, attemptNativeHarnessCompaction, transcriptBytePreflightAuthority } = input;
	const incognito = captureSessionActorStorageOwner(runtimeTarget, {
		assertCurrent() {
			host.assertActive?.();
		},
		authorize() {}
	});
	let expected = { ...expectedEntry };
	return await enqueueCompactionInLanes(params, async () => {
		let closed = false;
		const assertCallerActive = composeSessionSourceAssertion([host.assertActive], (assertSource) => {
			params.abortSignal?.throwIfAborted();
			if (closed) throw new Error("queued compaction is no longer active");
			assertSource();
		});
		const assertActive = async (target = runtimeTarget, owner = expected) => {
			await withSessionEntryReadOnlyInWorker({
				...target,
				readConsistency: "latest"
			}, assertCallerActive, async (read) => {
				if (!read.ok) throw read.error;
				requireCompactionWriterEntry(read.value, owner);
			});
		};
		const createTranscriptWriteContext = async (target, owner, signal) => {
			const capturedOwner = { ...owner };
			const sessionTarget = {
				...target,
				expectedLifecycleRevision: capturedOwner.lifecycleRevision,
				expectedWriterRunId: capturedOwner.activeWriterRunId,
				expectedOwner: {
					lifecycleRevision: capturedOwner.lifecycleRevision,
					activeWriterRunId: capturedOwner.activeWriterRunId
				}
			};
			const assertCommitAllowed = composeSessionSourceAssertion([assertCallerActive], (assertSource) => {
				signal?.throwIfAborted();
				assertSource();
			});
			await assertActive(sessionTarget, capturedOwner);
			assertCommitAllowed();
			return {
				sessionTarget,
				assertCommitAllowed,
				withTranscriptWrite: async (run) => await run()
			};
		};
		const canContinue = async () => {
			try {
				await assertActive();
				return true;
			} catch (error) {
				if (params.abortSignal?.aborted || closed) return false;
				throw error;
			}
		};
		try {
			if (params.abortSignal?.aborted) return createQueuedCompactionAbortedResult();
			await assertActive();
			const engineOwnsCompaction = contextEngine.info.ownsCompaction === true;
			if (engineOwnsCompaction || contextEngine.info.id !== "legacy") {
				const { restoreSessionColdTranscript } = await import("./session-cold-storage-Doo7Aerf.mjs");
				await restoreSessionColdTranscript(runtimeTarget, assertCallerActive);
			}
			await assertActive();
			const hookRunner = engineOwnsCompaction ? getGlobalHookRunner() : null;
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
			const runHook = async (name, run) => {
				try {
					await run();
				} catch (err) {
					log$3.warn(`${name} hook failed`, { errorMessage: formatErrorMessage(err) });
				}
			};
			const runtimeContext = contextEngineRuntimeContext;
			if (hookRunner?.hasHooks("before_compaction")) await runHook("before_compaction", () => hookRunner.runBeforeCompaction({
				messageCount: -1,
				sessionFile: params.sessionFile
			}, hookCtx));
			if (params.abortSignal?.aborted) return createQueuedCompactionAbortedResult();
			await assertActive();
			let result;
			let committedCompaction;
			try {
				const compactionSessionTarget = projectQueuedCompactionSessionTarget(params);
				const ownedCompactor = {
					info: contextEngine.info,
					compact: async (backendParams) => {
						if (backendParams.runtimeContext) attachCompactionAccountingRecorder(backendParams.runtimeContext, {
							requestBudget: host.requestBudget,
							pendingUserEntryId: host.pendingUserEntryId,
							recordCompaction: (receipt) => {
								declarePromptHistoryRewrite({
									...runtimeTarget,
									reason: "compaction"
								});
								committedCompaction = receipt;
							}
						});
						const writeContext = await createTranscriptWriteContext(runtimeTarget, expectedEntry, backendParams.abortSignal);
						writeContext.assertCommitAllowed();
						const clearClaim = setTranscriptBytePreflightClaim(backendParams.runtimeContext, transcriptBytePreflightAuthority, host.withCompactionPersistence, host.withCompactionPersistenceAsync);
						return withOwnedSessionTranscriptWrites(writeContext, () => contextEngine.compact(backendParams)).finally(clearClaim);
					}
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
				result = buildCompactionFailureResult(formatErrorMessage(compactErr));
			}
			if (committedCompaction && (!result.ok || !result.compacted)) result = {
				ok: true,
				compacted: true,
				reason: result.reason,
				result: {
					tokensBefore: committedCompaction.tokensBefore,
					tokensAfter: committedCompaction.tokensAfter,
					details: committedCompaction.details
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
					if (!committedCompaction) declarePromptHistoryRewrite({
						...runtimeTarget,
						reason: "compaction"
					});
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
				if (result.ok && result.compacted && await canContinue() && contextEngine.maintain) {
					const rewriteContext = await createTranscriptWriteContext(postCompactionSessionTarget, expected, params.abortSignal);
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
						withSessionManagerRewriteLock: async (operation) => await withOwnedSessionTranscriptWrites(rewriteContext, async () => {
							await assertActive(postCompactionSessionTarget, expected);
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
				if (engineOwnsCompaction && result.ok && result.compacted && await canContinue()) await runPostCompactionSideEffects({
					config: params.config,
					sessionKey: params.sessionKey,
					sessionId: postCompactionSessionId,
					agentId: sessionAgentId,
					memoryAudience: preparedParams.memoryAudience,
					sandboxed: preparedParams.memorySandboxed,
					sessionFile: postCompactionSessionFile,
					assertActive
				});
				if (result.ok && await canContinue() && hookRunner?.hasHooks("after_compaction")) await runHook("after_compaction", () => hookRunner.runAfterCompaction({
					messageCount: -1,
					compactedCount: result.compacted ? -1 : 0,
					tokenCount: result.result?.tokensAfter,
					sessionFile: postCompactionSessionFile,
					...postCompactionSessionId !== params.sessionId ? { previousSessionId: params.sessionId } : {}
				}, {
					...hookCtx,
					sessionId: postCompactionSessionId
				}));
				if ((engineOwnsCompaction || transcriptBytePreflightAuthority) && result.ok && result.compacted && await canContinue() && attemptNativeHarnessCompaction) try {
					const nativeCompactionOwner = { ...expected };
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
						preparedModelRuntime,
						sourceAuthority: {
							assertActive: () => {
								assertCallerActive();
								if (incognito) requireCompactionWriterEntry(readCapturedSessionActorEntry(incognito, postCompactionSessionTarget.sessionKey), nativeCompactionOwner);
							},
							prepareDispatch: incognito ? void 0 : async () => {
								requireCompactionWriterEntry(await readSessionEntryReadOnlyInWorker({
									...postCompactionSessionTarget,
									readConsistency: "latest"
								}, assertCallerActive), nativeCompactionOwner);
							},
							operatorAuthority: host.sourceAuthority.operatorAuthority
						}
					});
					if (secondaryNativeHarnessCompaction && !secondaryNativeHarnessCompaction.ok) log$3.warn("secondary native harness compaction failed after context-engine compaction", { reason: secondaryNativeHarnessCompaction.reason });
				} catch (err) {
					secondaryNativeHarnessCompaction = buildCompactionFailureResult(formatErrorMessage(err));
					log$3.warn("secondary native harness compaction threw after context-engine compaction", { errorMessage: formatErrorMessage(err) });
				}
			} catch (error) {
				if (await canContinue()) throw error;
			}
			const secondaryNativeDetailsKey = normalizeOptionalAgentRuntimeId(preparedHarnessRuntime) === "codex" ? "codexNativeCompaction" : "nativeHarnessCompaction";
			let details = result.result?.details;
			if (secondaryNativeHarnessCompaction) details = {
				...isRecord(details) ? details : details === void 0 ? {} : { contextEngine: details },
				[secondaryNativeDetailsKey]: secondaryNativeHarnessCompaction
			};
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
					details,
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
function lockedCompactionRuntimeFailure(runtime) {
	return buildCompactionFailureResult(runtime ? `Model selection is locked to native agent harness "${runtime}", but native compaction is unavailable.` : "Model selection is locked but the persisted agent harness is unavailable.", { reason: "model_selection_locked" });
}
const MANUAL_COMPACTION_ACTIVE_RUN_REASON = "manual compaction unavailable while another embedded run is active";
function assertQueuedCompactionPreparationActive(params, host) {
	params.abortSignal?.throwIfAborted();
	host.assertActive?.();
}
function resolveManualCompactionActiveRunSessionId(params) {
	return (isEmbeddedAgentRunHandleActive(params.sessionId) ? params.sessionId : void 0) ?? (params.sessionKey ? resolveActiveEmbeddedRunHandleSessionId(params.sessionKey) : void 0) ?? resolveActiveEmbeddedRunHandleSessionIdBySessionFile(params.sessionFile);
}
/**
* Compacts a session with lane queueing (session lane + global lane).
* Use this from outside a lane context. If already inside a lane, use
* `compactEmbeddedAgentSessionDirect` to avoid deadlocks.
*/
async function compactEmbeddedAgentSession(input, options) {
	return await runWithAsyncWorkResources(async (onAcquired) => {
		onAcquired({
			release: retainAgentHarnessCompactionSource(options.sourceAuthority),
			releaseBeforeResultWhenIdle: true
		});
		const sourceAuthority = options.sourceAuthority;
		const assertHostActive = options.assertActive;
		const host = {
			...options,
			assertActive: composeSessionSourceAssertion([
				assertHostActive,
				sourceAuthority.assertActive,
				sourceAuthority.operatorAuthority?.assertCurrent
			])
		};
		const signals = [input.abortSignal, sourceAuthority.operatorAuthority?.signal].filter((signal) => signal !== void 0);
		const params = {
			...input,
			...signals.length > 0 ? { abortSignal: AbortSignal.any(signals) } : {}
		};
		const projectedConfig = projectCodexHostTranscriptBytePreflightConfig(params.config, Boolean(host.transcriptBytePreflightHarness));
		const contextEngineAgentId = normalizeOptionalString(params.contextEngineAgentId) ?? normalizeOptionalString(params.agentId);
		const contextEngineSessionKey = normalizeOptionalString(params.sessionKey) ?? normalizeOptionalString(params.sessionTarget?.sessionKey);
		const runtimeTarget = await resolveAgentRunSessionTarget({
			...params,
			missingSessionKey: "resolve-existing"
		});
		const releaseForeground = params.trigger === "manual" ? await beginForegroundSessionMaintenance(runtimeTarget.sessionKey) : void 0;
		try {
			const entry = await readSessionEntryReadOnlyInWorker({
				...runtimeTarget,
				readConsistency: "latest"
			}, () => assertQueuedCompactionPreparationActive(params, host));
			assertQueuedCompactionPreparationActive(params, host);
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
				spawnedBy: normalizeOptionalString(params.spawnedBy) ?? entry?.spawnedBy,
				contextEngineAgentId
			};
			const compact = (compactParams) => withQueuedCompactionCancellationResult(compactParams, () => compactEmbeddedAgentSessionImpl(compactParams, expectedEntry, host, contextEngineSessionKey));
			if (resolvedParams.trigger !== "manual") return await compact(resolvedParams);
			if (resolveManualCompactionActiveRunSessionId(resolvedParams)) return buildCompactionFailureResult(MANUAL_COMPACTION_ACTIVE_RUN_REASON, { reason: "active_run" });
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
				return await compact(activeParams);
			} finally {
				clearActiveEmbeddedRun(resolvedParams.sessionId, handle, resolvedParams.sessionKey, resolvedParams.sessionFile);
			}
		} finally {
			releaseForeground?.();
		}
	});
}
async function compactEmbeddedAgentSessionImpl(inputParams, expectedEntry, sourceHost, contextEngineSessionKey) {
	return await runForegroundCompactionWork(async (owner) => {
		try {
			var _usingCtx$4 = _usingCtx();
			if (inputParams.abortSignal?.aborted) return createQueuedCompactionAbortedResult();
			sourceHost.assertActive?.();
			const runtimeTarget = inputParams.sessionTarget;
			const agentIds = resolveSessionAgentIds({
				sessionKey: runtimeTarget.sessionKey,
				config: inputParams.config,
				agentId: runtimeTarget.agentId
			});
			const initialAgentDir = inputParams.agentDir ?? resolveAgentDir(inputParams.config ?? {}, agentIds.sessionAgentId);
			const resolvedWorkspaceDir = resolveUserPath(inputParams.workspaceDir);
			const placement = _usingCtx$4.u(inputParams.sandbox === void 0 ? await prepareSessionPlacementSandbox({
				agentId: runtimeTarget.agentId,
				config: inputParams.config,
				sessionId: runtimeTarget.sessionId,
				sessionKey: runtimeTarget.sessionKey,
				workspaceDir: resolvedWorkspaceDir
			}) : null);
			const assertActive = composeSessionSourceAssertion([sourceHost.assertActive], (assertSource) => {
				assertSource();
				placement?.assertCurrent();
			});
			const host = {
				...sourceHost,
				assertActive,
				sourceAuthority: {
					...sourceHost.sourceAuthority,
					assertActive: composeSessionSourceAssertion([sourceHost.sourceAuthority.assertActive, assertActive])
				}
			};
			const placementSandbox = placement?.sandbox;
			assertQueuedCompactionPreparationActive(inputParams, host);
			const requestedSelection = {
				...inputParams,
				modelId: inputParams.model,
				boundHarnessRuntime: inputParams.agentHarnessId,
				preparedRuntimePlan: inputParams.runtimePlan,
				selectedHarnessRuntime: resolveSessionPinnedHarnessId(inputParams.sessionEntry)
			};
			const runtimeSelection = resolveCompactionRuntimeSelection(requestedSelection);
			const nativeCliResult = await compactNativeCliSession({
				runtime: runtimeSelection.selectedHarnessRuntime,
				compactParams: {
					...inputParams,
					agentDir: initialAgentDir,
					workspaceDir: resolvedWorkspaceDir
				},
				runControlOperation: (run) => runPrimaryNativeCompactionInLanes(inputParams, expectedEntry, host, run)
			});
			if (nativeCliResult) return nativeCliResult;
			assertQueuedCompactionPreparationActive(inputParams, host);
			const lease = await runOutsidePluginRuntimeGenerationScope(() => acquireAgentRunPreparedModelRuntime({
				config: inputParams.config ?? {},
				agentId: agentIds.sessionAgentId,
				agentDir: initialAgentDir,
				workspaceDir: resolvedWorkspaceDir,
				...inputParams.allowGatewaySubagentBinding ? { allowGatewaySubagentBinding: true } : {}
			}, {
				abortSignal: inputParams.abortSignal,
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
			const admittedParams = {
				...inputParams,
				...placementSandbox ? { sandbox: placementSandbox } : {},
				memorySandboxed: (placementSandbox ?? inputParams.sandbox)?.enabled === true,
				config: projectCodexHostTranscriptBytePreflightConfig(lease.snapshot.config, Boolean(host.transcriptBytePreflightHarness)),
				agentDir: lease.snapshot.agentDir
			};
			assertQueuedCompactionPreparationActive(inputParams, host);
			return await withPluginRuntimeGenerationScope(lease.snapshot, async () => {
				owner.captureContext();
				await registerLegacyContextEngine();
				const contextEngine = await owner.resolveEngine(() => resolveContextEngine(admittedParams.config, {
					agentDir: admittedParams.agentDir,
					workspaceDir: resolvedWorkspaceDir
				}));
				assertQueuedCompactionPreparationActive(admittedParams, host);
				const params = admittedParams;
				const agentDir = params.agentDir;
				const preparedModelRuntime = lease.snapshot;
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
				const { model: ceRuntimeModel, authStorage, modelRegistry } = modelResolution;
				const preparedAuth = contextEngine.info.ownsCompaction || selectedNativeHarnessCompaction || host.transcriptBytePreflightHarness ? await prepareCompactionHarnessAuth({
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
				}) : void 0;
				assertQueuedCompactionPreparationActive(params, host);
				if (preparedAuth?.ok === false) return buildCompactionFailureResult(formatErrorMessage(preparedAuth.error));
				const preparedHarnessRuntime = preparedAuth?.selectedPreparedHarness.id ?? selectedHarnessRuntime;
				const transcriptBytePreflightAuthority = preparedAuth && host.transcriptBytePreflightHarness === preparedHarnessRuntime ? resolveTranscriptBytePreflightAuthority(preparedAuth.selectedPreparedHarness) : void 0;
				if (host.transcriptBytePreflightHarness && !transcriptBytePreflightAuthority) return lockedCompactionRuntimeFailure(host.transcriptBytePreflightHarness);
				const attemptNativeHarnessCompaction = selectedNativeHarnessCompaction && preparedHarnessRuntime !== "openclaw";
				const runtimeAuthPlan = preparedAuth?.runtimeAuthPreparation.plan ?? reusableRuntimeAuthPlan;
				const effectiveRuntimeModel = runtimeAuthPlan ? await materializePreparedRuntimeModel({
					plan: runtimeAuthPlan,
					provider: ceProvider,
					modelId: ceModelId,
					config: params.config,
					workspaceDir: resolvedWorkspaceDir,
					metadataSnapshot: preparedModelRuntime.metadataSnapshot,
					model: ceRuntimeModel,
					forceResolve: preparedAuth?.providerUsesProfileScopedModelMetadata && Boolean(runtimeAuthPlan.selectedAuthMode),
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
						return resolved;
					}
				}) : ceRuntimeModel;
				assertQueuedCompactionPreparationActive(params, host);
				const preparedParams = {
					...params,
					provider: ceProvider,
					model: ceModelId,
					agentHarnessId: preparedHarnessRuntime,
					...reusableRuntimeAuthPlan ? {
						authProfileId: runtimeAuthPlan?.forwardedAuthProfileId,
						authProfileIdSource: runtimeAuthPlan?.forwardedAuthProfileSource,
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
					requestedTokenBudget: params.contextTokenBudget
				});
				const { sessionFile: _sessionFile, contextEngineAgentId, ...runtimeParams } = preparedParams;
				const contextEngineRuntimeContext = {
					...runtimeParams,
					sessionTarget: projectQueuedCompactionSessionTarget(preparedParams),
					...buildEmbeddedCompactionRuntimeContext({
						...preparedParams,
						agentDir,
						modelId: preparedParams.model,
						harnessRuntime: preparedHarnessRuntime
					}),
					...resolveContextEngineCapabilities({
						config: preparedParams.config,
						sessionKey: contextEngineSessionKey ?? preparedParams.sessionKey,
						explicitAgentId: contextEngineAgentId,
						authProfileId: preparedParams.authProfileId,
						contextEnginePluginId: resolveContextEngineOwnerPluginId(contextEngine),
						purpose: "context-engine.compaction"
					}),
					tokenBudget: contextTokenBudget,
					currentTokenCount: preparedParams.currentTokenCount
				};
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
						sourceAuthority: host.sourceAuthority,
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
				if (preparedParams.deferOwningContextEngineCompaction === true && preparedParams.trigger === "budget" && contextEngineOwnsCompaction && contextEngine.info.turnMaintenanceMode === "background" && typeof contextEngine.maintain === "function") {
					let deferredScheduled = false;
					let deferredScheduleFailure;
					try {
						await runContextEngineMaintenance({
							contextEngine,
							sessionId: preparedParams.sessionId,
							sessionKey: contextEngineSessionKey ?? preparedParams.sessionKey,
							sessionTarget: projectQueuedCompactionSessionTarget(preparedParams),
							sessionFile: preparedParams.sessionFile,
							reason: "turn",
							runtimeContext: contextEngineRuntimeContext,
							runtimeSettings: contextEngineRuntimeSettings,
							config: preparedParams.config,
							contextEngineAgentId: preparedParams.contextEngineAgentId,
							disposeDeferredContextEngineAfterMaintenance: true,
							factoryResources,
							onDeferredMaintenance: () => {
								deferredScheduled = true;
								owner.transferEngine();
							},
							onDeferredMaintenanceFailure: (error) => {
								deferredScheduleFailure = error;
							}
						});
					} catch (err) {
						log$3.warn("failed to defer context-engine budget compaction", { errorMessage: formatErrorMessage(err) });
					}
					if (!deferredScheduled || deferredScheduleFailure) {
						log$3.warn(`[compaction] failed to schedule context-engine-owned budget compaction background maintenance (sessionKey=${preparedParams.sessionKey ?? preparedParams.sessionId}${deferredScheduleFailure ? ` error=${formatErrorMessage(deferredScheduleFailure)}` : ""})`);
						return buildCompactionFailureResult("failed to schedule background context-engine maintenance", { reason: "deferred_compaction_not_scheduled" });
					}
					log$3.info(`[compaction] deferred context-engine-owned budget compaction to background maintenance (sessionKey=${preparedParams.sessionKey ?? preparedParams.sessionId} scheduled=${String(deferredScheduled)})`);
					return {
						ok: true,
						compacted: false,
						reason: DEFERRED_CONTEXT_ENGINE_COMPACTION_REASON
					};
				}
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
			});
		} catch (_) {
			_usingCtx$4.e = _;
		} finally {
			_usingCtx$4.d();
		}
	});
}
//#endregion
//#region src/agents/embedded-agent-runner/cli-backend-dispatch-transcript.ts
const log$2 = createSubsystemLogger("agents/embedded-cli-dispatch");
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
	const memory = captureSessionActorStorageOwner(scope, {
		assertCurrent() {},
		authorize() {}
	});
	if (memory) {
		scope.agentId = memory.agentId;
		scope.storePath = memory.path;
	}
	const selected = acquireSessionActorStorage(scope, {
		lifetime: {
			assertCurrent() {},
			assertReadable() {}
		},
		authority: {
			assertCurrent() {},
			authorize() {}
		}
	});
	selected.catch(() => {});
	const enqueue = (build) => {
		tail = tail.then(async () => {
			const append = () => appendTranscriptMessage(scope, {
				message: build(),
				config: params.config,
				cwd: params.cwd
			});
			const binding = await selected;
			if (memory && !binding) return;
			await (binding ? runWithSessionActorStorage(binding, append) : append());
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
	const appendAssistantSnapshot = (text, stopReason) => {
		if (text && text !== lastWrittenAssistantText) {
			lastWrittenAssistantText = text;
			enqueue(() => buildZeroUsageAssistantMessage([{
				type: "text",
				text
			}], stopReason));
		}
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
				details: asOptionalObjectRecord(asOptionalObjectRecord(event.result)?.details),
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
			appendAssistantSnapshot(lastAssistantText.trim(), "aborted");
		},
		finalize: async (finalText) => {
			if (!finalized) {
				finalized = true;
				appendAssistantSnapshot(finalText?.trim() || lastAssistantText.trim(), "stop");
			}
			await tail;
			await selected.then((binding) => binding?.actor.release(), () => {});
		}
	};
}
/** Maps a sanitized CLI tool result onto transcript content blocks. */
function normalizeToolResultContent(result) {
	if (typeof result === "string") return result ? [{
		type: "text",
		text: result
	}] : [];
	const content = Array.isArray(result) ? result : asOptionalObjectRecord(result)?.content;
	if (!Array.isArray(content)) return [];
	return content.flatMap((block) => {
		if (typeof block === "string") return [{
			type: "text",
			text: block
		}];
		const record = asOptionalObjectRecord(block);
		if (!record) return [];
		const { type, text, data, mimeType } = record;
		if (type === "text" && typeof text === "string") return [{
			type: "text",
			text
		}];
		if (type === "image" && typeof data === "string" && typeof mimeType === "string") return [{
			type: "image",
			data,
			mimeType
		}];
		return [];
	});
}
//#endregion
//#region src/agents/embedded-agent-runner/cli-backend-dispatch.ts
const log$1 = createSubsystemLogger("agents/embedded-cli-dispatch");
async function runEmbeddedAgentViaCliBackendIfEligible(params) {
	if (params.cliBackendDispatch !== "subscription-auth") return;
	if (params.sourceReplyDeliveryMode === "message_tool_only") return;
	const sessionFile = params.sessionFile?.trim();
	if (!sessionFile) return;
	if (params.disableTools || params.modelRun) return;
	if (!params.toolsAllow || params.toolsAllow.length === 0) return;
	const names = params.toolsAllow.map(normalizeToolPolicyName);
	if (names.some((name) => !name || name.includes("*"))) return;
	const toolsAllow = [...new Set(names)];
	const eligibility = await resolveEmbeddedCliBackendDispatchEligibilityAsync(params);
	if (!eligibility) return;
	const { runCliAgent } = await import("./cli-runner.runtime.js");
	const admittedRunContext = await resolvePreparedRunAdmission({
		runId: params.runId,
		runtimeKind: "embedded",
		admittedRunContext: params.admittedRunContext,
		preparedRunAdmission: params.preparedRunAdmission
	});
	const cliToolAvailability = {
		native: [],
		openClaw: toolsAllow
	};
	const onAgentToolResult = params.onAgentToolResult;
	const { storePath, expectedLifecycleRevision, expectedWriterRunId } = params.sessionTarget;
	const transcript = params.sessionManager || params.sessionPersistence === "detached" ? void 0 : createCliDispatchTranscriptRecorder({
		...params,
		storePath,
		sessionFile,
		provider: eligibility.provider,
		cwd: params.cwd ?? params.workspaceDir,
		expectedLifecycleRevision,
		expectedWriterRunId
	});
	const unsubscribe = onAgentEventForRun(params.runId, (evt) => {
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
	log$1.info(`dispatching embedded run through CLI backend: runId=${params.runId} provider=${eligibility.provider} model=${params.model ?? ""}`);
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
			heartbeatEventQueueSessionKey: params.heartbeatEventQueueSessionKey,
			sessionFile,
			workspaceDir: params.workspaceDir,
			agentDir: params.agentDir,
			config: params.config,
			prompt: params.prompt,
			imagePrompt: params.prompt,
			images: params.images,
			imageOrder: params.imageOrder,
			media: params.media,
			provider: eligibility.provider,
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
			runtimeFactsInTurn: true,
			requireExplicitMessageTarget: true,
			cleanupBundleMcpOnRunEnd: params.cleanupBundleMcpOnRunEnd
		});
		finalAssistantText = result.payloads?.find((payload) => payload.isReasoning !== true && typeof payload.text === "string")?.text;
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
	} finally {
		params.abortSignal?.removeEventListener("abort", flushOnAbort);
		unsubscribe();
		await transcript?.finalize(finalAssistantText);
	}
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
	const runtimeContinuationReplayMetadata = attempt.runtimeContinuationStarted === true ? {
		hadPotentialSideEffects: true,
		replaySafe: false
	} : void 0;
	return copyCoreTtsAttemptResultProvenance(attempt, {
		...attempt,
		assistantTexts: attempt.assistantTexts ?? [],
		toolMetas: attempt.toolMetas ?? [],
		acceptedSessionSpawns: attempt.acceptedSessionSpawns ?? [],
		messagesSnapshot: attempt.messagesSnapshot ?? [],
		messagingToolSentTexts: attempt.messagingToolSentTexts ?? [],
		messagingToolSentMediaUrls: attempt.messagingToolSentMediaUrls ?? [],
		messagingToolSentTargets: attempt.messagingToolSentTargets ?? [],
		messagingToolSourceReplyPayloads: attempt.messagingToolSourceReplyPayloads ?? [],
		didDeliverSourceReplyViaMessageTool: attempt.didDeliverSourceReplyViaMessageTool === true,
		itemLifecycle: attempt.itemLifecycle ?? {
			startedCount: 0,
			completedCount: 0,
			activeCount: 0
		},
		replayMetadata: runtimeContinuationReplayMetadata ?? attempt.replayMetadata ?? {
			hadPotentialSideEffects: true,
			replaySafe: false
		},
		currentAttemptReplayMetadata: runtimeContinuationReplayMetadata ?? attempt.currentAttemptReplayMetadata ?? void 0
	});
}
function hasCompletedModelProgressForIdleBreaker(attempt) {
	return attempt.assistantTexts.some((text) => text.trim().length > 0) || attempt.toolMetas.length > 0 || (attempt.clientToolCalls?.length ?? 0) > 0 || hasOutboundDeliveryEvidence(attempt) || attempt.itemLifecycle.completedCount > 0;
}
function buildTraceToolSummary(params) {
	if (!params.toolMetas?.length) return;
	const tools = normalizeUniqueTrimmedStringList(params.toolMetas.map((entry) => entry.toolName));
	const failedToolCalls = params.toolMetas.filter((entry) => entry.isError === true).length;
	return {
		calls: params.toolMetas.length,
		tools,
		failures: failedToolCalls || Number(Boolean(params.lastToolError)),
		...params.lastToolError ? { unresolvedError: { toolName: params.lastToolError.toolName } } : {}
	};
}
function resolveSuccessfulToolNames(attempt) {
	return normalizeUniqueTrimmedStringList([...attempt.toolMetas.filter((entry) => entry.isError === false).map((entry) => entry.toolName), ...normalizeUniqueTrimmedStringList(attempt.successfulNestedToolNames).toSorted()]);
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
			pluginRuntimeRefreshMessages: [
				...params.pluginRuntimeRefreshMessages ?? [],
				...session.continuation?.messages ?? [],
				...attempt.pluginRuntimeRefreshMessages ?? []
			],
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
* Detects identical tool-call loops immediately after automatic compaction.
*
* The guard only observes a small post-compaction window; if compaction failed to break an
* identical args/result loop, the runner aborts before spending unbounded tokens.
*/
const log = createSubsystemLogger("agents/post-compaction-guard");
const DEFAULT_WINDOW_SIZE = 3;
const BASELINE_WINDOW_SIZE = 16;
const observationSignature = (call) => `${call.toolName}\0${call.argsHash}`;
function createPostCompactionLoopGuard(options) {
	const enabled = options?.enabled ?? true;
	const recentCalls = [];
	let history;
	let baselineSignatures;
	let repeatedToolNames = [];
	const armPostCompaction = () => {
		baselineSignatures = enabled && recentCalls.length > 0 ? new Set(recentCalls.map(observationSignature)) : void 0;
		history = [];
		repeatedToolNames = [];
		if (enabled) log.info(`post-compaction guard armed for ${DEFAULT_WINDOW_SIZE} attempts`);
	};
	const observe = (call) => {
		if (!enabled) return {
			shouldAbort: false,
			armed: false,
			remainingAttempts: 0
		};
		recentCalls.push(call);
		if (recentCalls.length > BASELINE_WINDOW_SIZE) recentCalls.shift();
		if (!history || history.length >= DEFAULT_WINDOW_SIZE) return {
			shouldAbort: false,
			armed: false,
			remainingAttempts: 0
		};
		const remainingAttempts = DEFAULT_WINDOW_SIZE - history.length - 1;
		if (baselineSignatures?.has(observationSignature(call))) repeatedToolNames.push(call.toolName);
		history.push(call);
		const armedAfter = remainingAttempts > 0;
		const matches = history.filter((entry) => entry.toolName === call.toolName && entry.argsHash === call.argsHash && entry.resultHash === call.resultHash);
		if (matches.length >= DEFAULT_WINDOW_SIZE) {
			log.error(`post-compaction loop persisted: tool=${call.toolName} repeated ${matches.length} times with identical args+result post-compaction`);
			return {
				shouldAbort: true,
				armed: armedAfter,
				remainingAttempts,
				detector: "compaction_loop_persisted",
				count: matches.length,
				toolName: call.toolName,
				message: `CRITICAL: tool ${call.toolName} repeated ${matches.length} times with identical arguments and identical results within ${DEFAULT_WINDOW_SIZE} attempts after auto-compaction. The compaction did not break the loop. Aborting to prevent runaway resource use.`
			};
		}
		if (!armedAfter) {
			const tools = [...new Set(repeatedToolNames)].toSorted().join(",");
			log.info(`post-compaction window closed: toolCalls=${history.length} preCompactionRepeats=${repeatedToolNames.length}${tools ? ` tools=${tools}` : ""}`);
			baselineSignatures = void 0;
			repeatedToolNames = [];
		}
		return {
			shouldAbort: false,
			armed: armedAfter,
			remainingAttempts
		};
	};
	return {
		armPostCompaction,
		observe
	};
}
var PostCompactionLoopPersistedError = class PostCompactionLoopPersistedError extends Error {
	constructor(message, details) {
		super(message);
		this.name = "PostCompactionLoopPersistedError";
		this.detector = details.detector;
		this.count = details.count;
		this.toolName = details.toolName;
	}
	static fromVerdict(verdict) {
		return new PostCompactionLoopPersistedError(verdict.message, verdict);
	}
};
//#endregion
//#region src/agents/embedded-agent-runner/run/failover-observation.ts
/** Capture sanitized attempt context before the decision and status are known. */
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
function isTerminalFormatFailure(params) {
	return params.failoverFailure && params.failoverReason === "format" && params.allowFormatRetry !== true;
}
function isAssistantTimeoutFailure(params) {
	return params.terminal.kind === "timeout" && params.terminal.source !== "observation" && (params.terminal.source === "idle" || params.terminal.phase === "prompt");
}
function isConcreteNonTimeoutAssistantFailure(params) {
	return params.failoverFailure && Boolean(params.failoverReason) && params.failoverReason !== "timeout";
}
function shouldRotateAssistant(params) {
	const timeoutFailure = isAssistantTimeoutFailure(params);
	if (params.harnessOwnsTransport && (timeoutFailure || params.failoverReason === "timeout") && !isConcreteNonTimeoutAssistantFailure(params)) return false;
	return !(params.terminal.kind === "aborted" && params.terminal.source !== "yield_cleanup" || params.terminal.kind === "timeout" && params.terminal.source !== "observation" && params.terminal.aborted === true) && params.failoverFailure || timeoutFailure;
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
		const reason = params.failoverReason;
		if (params.fallbackConfigured && reason && reason !== "timeout" && reason !== "format" && reason !== "session_expired") return {
			action: "fallback_model",
			reason
		};
		return { action: "return_error_payload" };
	}
	const surfaceError = {
		action: "surface_error",
		reason: params.failoverReason
	};
	let shouldRotate;
	let shouldFallback;
	let fallbackReason = params.failoverReason ?? "unknown";
	if (params.stage === "prompt") {
		if (isCliTerminalStopCode(params.failoverCode) || params.externalAbort || params.timedOutByRunBudget) return surfaceError;
		if (params.harnessOwnsTransport && params.failoverReason === "timeout") {
			if (params.promptTimeoutFallbackSafe === true && params.fallbackConfigured) return {
				action: "fallback_model",
				reason: "timeout"
			};
			return surfaceError;
		}
		shouldFallback = params.failoverFailure && !isTerminalFormatFailure(params);
		shouldRotate = shouldFallback && params.failoverReason !== "timeout" && params.failoverReason !== "tls_certificate";
	} else {
		if (params.signalOwnedInterruption || (params.terminal.kind === "aborted" || params.terminal.kind === "timeout") && params.terminal.source === "external" || isTerminalFormatFailure(params)) return surfaceError;
		if (params.terminal.kind === "timeout" && params.terminal.source === "run_budget") return params.terminal.phase === "prompt" && !params.harnessOwnsTransport && params.fallbackConfigured ? {
			action: "fallback_model",
			reason: "timeout"
		} : { action: "continue_normal" };
		if (params.failoverFailure && params.failoverReason === "tls_certificate") return params.fallbackConfigured ? {
			action: "fallback_model",
			reason: "tls_certificate"
		} : surfaceError;
		shouldRotate = shouldRotateAssistant(params);
		if (!shouldRotate) return { action: "continue_normal" };
		shouldFallback = true;
		if (!isConcreteNonTimeoutAssistantFailure(params) && isAssistantTimeoutFailure(params)) fallbackReason = "timeout";
	}
	if (!params.profileRotated && shouldRotate) return {
		action: "rotate_profile",
		reason: params.failoverReason
	};
	return shouldFallback && params.fallbackConfigured ? {
		action: "fallback_model",
		reason: fallbackReason
	} : surfaceError;
}
//#endregion
//#region src/agents/embedded-agent-runner/run/assistant-failure.ts
const MAX_EMPTY_ERROR_RETRIES = 3;
async function handleEmbeddedAssistantFailure(input) {
	const { runInput, preparedRuntime, normalizedAttempt, runtime } = input;
	const { attempt, terminalState, activeErrorContext } = normalizedAttempt;
	const { attemptAssistant, currentAttemptAssistant } = normalizedAttempt;
	const { provider, modelId, model } = preparedRuntime;
	const failedAssistant = attemptAssistant?.stopReason === "error" ? attemptAssistant : void 0;
	const transcriptError = failedAssistant?.errorMessage;
	if (failedAssistant) log$3.warn("Assistant attempt failed", {
		provider: failedAssistant.provider,
		model: failedAssistant.model,
		runId: runInput.runParams.runId,
		responseId: failedAssistant.responseId,
		code: failedAssistant.errorCode,
		type: failedAssistant.errorType,
		message: transcriptError,
		body: failedAssistant.errorBody
	});
	if (isSessionTranscriptTurnMismatchErrorMessage(transcriptError)) throw new Error(transcriptError);
	if (classifyGatewayStorageFailure(failedAssistant)) return buildOutcome(input, {
		action: "proceed",
		assistantProfileFailureReason: null
	});
	const { aborted, externalAbort: projectedExternalAbort, idleTimedOut, promptError, timedOut } = projectAgentRunAttemptTerminal(attempt.terminal);
	const terminalInterrupted = isEmbeddedRunTerminalInterrupted(terminalState.outcome);
	const { signalOwnedInterruption } = terminalState;
	const fallbackThinking = pickFallbackThinkingLevel({
		message: failedAssistant?.errorMessage,
		attempted: preparedRuntime.attemptedThinking
	});
	const authFailure = isAuthAssistantError(failedAssistant);
	const rateLimitFailure = isRateLimitAssistantError(failedAssistant);
	const billingFailure = isBillingAssistantError(failedAssistant);
	const failoverFailure = isFailoverAssistantError(failedAssistant);
	const assistantFailoverReason = classifyAssistantFailoverReason(failedAssistant, { providerOwner: input.providerOwner });
	const assistantProviderStarted = Boolean(currentAttemptAssistant?.provider) || terminalState.outcome.providerStarted === true;
	const assistantProfileFailoverReason = assistantFailoverReason ?? (assistantProviderStarted && (timedOut || idleTimedOut) ? "timeout" : null);
	const assistantProfileFailureReason = input.failover.resolveAuthProfileFailureReason(assistantProfileFailoverReason, {
		providerStarted: assistantProviderStarted,
		transientRateLimit: assistantProfileFailoverReason === "rate_limit" && classifyRateLimitWindow(failedAssistant?.errorMessage).kind === "short"
	});
	const terminalAssistantError = isTerminalAssistantError(attemptAssistant);
	if (terminalAssistantError || isEmbeddedRunTimeoutFinal(attempt) || !isCurrentAttemptReplaySafe(attempt)) return buildOutcome(input, {
		action: "proceed",
		assistantProfileFailureReason: terminalAssistantError ? null : assistantProfileFailureReason
	});
	if (fallbackThinking && !terminalInterrupted) {
		log$3.warn(`unsupported thinking level for ${provider}/${modelId}; retrying with ${fallbackThinking}`);
		return buildOutcome(input, {
			action: "retry",
			thinkLevel: fallbackThinking,
			assistantProfileFailureReason
		});
	}
	const cloudCodeAssistFormatError = attempt.cloudCodeAssistFormatError;
	const imageDimensionError = parseImageDimensionError(failedAssistant?.errorMessage ?? "");
	const unclassifiedError = assistantFailoverReason === null || assistantFailoverReason === "no_error_details" || assistantFailoverReason === "unclassified" || assistantFailoverReason === "unknown";
	const assistantSignal = failedAssistant ? buildAssistantFailoverSignal(failedAssistant) : void 0;
	const assistantStatus = assistantSignal?.status;
	const nonRetryableClientError = assistantSignal !== void 0 && assistantStatus !== void 0 && assistantStatus >= 400 && assistantStatus < 500 && !isRetryableProviderHttpStatus(assistantStatus) && !shouldRetryFailoverSignal({
		classification: null,
		signal: assistantSignal
	});
	const replaySafeSilentErrorFailure = !authFailure && !rateLimitFailure && !billingFailure && !cloudCodeAssistFormatError && !imageDimensionError && !terminalInterrupted && !promptError && !nonRetryableClientError && shouldRetrySilentErrorAssistantTurn({
		attempt,
		assistant: failedAssistant
	});
	if (replaySafeSilentErrorFailure && unclassifiedError && input.emptyErrorRetries < MAX_EMPTY_ERROR_RETRIES) {
		const emptyErrorRetries = input.emptyErrorRetries + 1;
		log$3.warn(`[empty-error-retry] stopReason=error non-visible-output; resubmitting attempt=${emptyErrorRetries}/${MAX_EMPTY_ERROR_RETRIES} provider=${failedAssistant?.provider ?? provider} model=${failedAssistant?.model ?? model.id} sessionKey=${runInput.runParams.sessionKey ?? runInput.runParams.sessionId}`);
		return buildOutcome(input, {
			action: "retry",
			emptyErrorRetries,
			assistantProfileFailureReason
		});
	}
	const exhaustedUnclassifiedSilentError = runInput.fallbackConfigured && assistantFailoverReason === null && replaySafeSilentErrorFailure && input.emptyErrorRetries >= MAX_EMPTY_ERROR_RETRIES;
	const effectiveFailoverReason = exhaustedUnclassifiedSilentError ? "unknown" : assistantFailoverReason;
	const logFailoverDecision = createFailoverDecisionLogger({
		stage: "assistant",
		runId: runInput.runParams.runId,
		rawError: failedAssistant?.errorMessage?.trim(),
		failoverReason: effectiveFailoverReason,
		profileFailureReason: assistantProfileFailureReason,
		provider: activeErrorContext.provider,
		model: activeErrorContext.model,
		sourceProvider: failedAssistant?.provider ?? provider,
		sourceModel: failedAssistant?.model ?? modelId,
		profileId: runtime.lastProfileId,
		fallbackConfigured: runInput.fallbackConfigured,
		timedOut,
		aborted,
		retryCount: input.failover.transientRetryCount,
		profileRotationCount: input.overloadProfileRotations,
		attemptCount: input.traceAttempts.length + 1
	});
	if (!signalOwnedInterruption && authFailure && await preparedRuntime.maybeRefreshRuntimeAuthForAuthError(failedAssistant?.errorMessage ?? "", input.runtimeAuthRetry)) return buildOutcome(input, {
		action: "retry",
		authRetryPending: true,
		assistantProfileFailureReason
	});
	if (imageDimensionError && runtime.lastProfileId) {
		const details = [
			imageDimensionError.messageIndex !== void 0 ? `message=${imageDimensionError.messageIndex}` : null,
			imageDimensionError.contentIndex !== void 0 ? `content=${imageDimensionError.contentIndex}` : null,
			imageDimensionError.maxDimensionPx !== void 0 ? `limit=${imageDimensionError.maxDimensionPx}px` : null
		].filter(Boolean).join(" ");
		log$3.warn(`Profile ${runtime.lastProfileId} rejected image payload${details ? ` (${details})` : ""}.`);
	}
	const resolveDecision = (profileRotated) => resolveRunFailoverDecision({
		stage: "assistant",
		allowFormatRetry: cloudCodeAssistFormatError,
		terminal: attempt.terminal,
		signalOwnedInterruption,
		fallbackConfigured: runInput.fallbackConfigured,
		failoverFailure,
		failoverReason: assistantFailoverReason,
		harnessOwnsTransport: runtime.pluginHarnessOwnsTransport,
		profileRotated
	});
	const initialDecision = exhaustedUnclassifiedSilentError ? {
		action: "fallback_model",
		reason: "unknown"
	} : resolveDecision(false);
	const authMode = runtime.lastProfileId ? preparedRuntime.attemptAuthProfileStore.profiles?.[runtime.lastProfileId]?.type : void 0;
	const terminalOutcome = terminalState.outcome;
	const externalAbort = projectedExternalAbort || signalOwnedInterruption;
	let overloadProfileRotations = input.overloadProfileRotations;
	let decision = initialDecision;
	const logDecision = (action, extra) => logFailoverDecision(action, {
		...extra,
		retryCount: input.failover.transientRetryCount,
		profileRotationCount: overloadProfileRotations
	});
	const recordTrace = (result, status) => {
		input.traceAttempts.push({
			provider: activeErrorContext.provider,
			model: activeErrorContext.model,
			result: effectiveFailoverReason === "timeout" ? "timeout" : result,
			...effectiveFailoverReason ? { reason: effectiveFailoverReason } : {},
			stage: "assistant",
			...typeof status === "number" ? { status } : {}
		});
	};
	const throwFailure = (error) => {
		if (decision.action === "surface_error" && error.reason === "format") recordModelFallbackStop(error);
		recordTrace(initialDecision.action === "fallback_model" ? "fallback_model" : "error", error.status);
		if (error.suspend) runInput.suspendForFailure({
			cfg: runInput.runParams.config,
			agentDir: runInput.agentDir,
			sessionId: input.suspensionSessionId,
			reason: resolveSessionSuspensionReason(error.reason),
			failedProvider: error.provider ?? provider,
			failedModel: error.model ?? modelId
		});
		throw error;
	};
	if (decision.action === "rotate_profile") {
		const failedProfileId = runtime.lastProfileId;
		const markFailedProfile = async () => {
			if (!assistantProfileFailureReason) return;
			try {
				await input.failover.maybeMarkAuthProfileFailure({
					profileId: failedProfileId,
					reason: assistantProfileFailureReason,
					modelId,
					retryAfterMs: assistantSignal?.retryAfterMs
				});
			} catch (err) {
				log$3.warn(`profile failure mark failed: ${String(err)}`);
			}
		};
		if (assistantFailoverReason === "overloaded") {
			overloadProfileRotations += 1;
			if (overloadProfileRotations > input.failover.overloadProfileRotationLimit && runInput.fallbackConfigured) {
				const status = assistantStatus ?? resolveFailoverStatus("overloaded");
				log$3.warn(`overload profile rotation cap reached for ${sanitizeForLog(provider)}/${sanitizeForLog(modelId)} after ${overloadProfileRotations} rotations; escalating to model fallback`);
				await markFailedProfile();
				logDecision("fallback_model", { status });
				throwFailure(new FailoverError("The AI service is temporarily overloaded. Please try again in a moment.", {
					reason: "overloaded",
					provider: activeErrorContext.provider,
					model: activeErrorContext.model,
					profileId: runtime.lastProfileId,
					status,
					rawError: failedAssistant?.errorMessage?.trim()
				}));
			}
		}
		const rotated = await input.failover.advanceAuthProfile(assistantFailoverReason, {
			failoverProvider: activeErrorContext.provider,
			failoverModel: activeErrorContext.model,
			logFallbackDecision: logFailoverDecision
		});
		const markFailedProfilePromise = markFailedProfile();
		if (timedOut && !runInput.isProbeSession && failedProfileId) {
			const timeoutLabel = idleTimedOut ? "idle timeout (model silent)" : "timed out";
			log$3.warn(rotated ? `Profile ${failedProfileId} ${timeoutLabel}. Trying next account...` : `Profile ${failedProfileId} ${timeoutLabel}. No further authorized account for this provider; create a backup auth profile and add its id to auth.order to enable failover.`);
		}
		if (cloudCodeAssistFormatError && failedProfileId) log$3.warn(`Profile ${failedProfileId} hit Cloud Code Assist format error. Tool calls will be sanitized on retry.`);
		if (rotated) {
			logDecision("rotate_profile");
			recordTrace("rotate_profile");
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
			cfg: runInput.runParams.config,
			sessionKey: runInput.runParams.sessionKey ?? runInput.runParams.sessionId,
			agentId: runInput.runParams.agentId,
			provider: activeErrorContext.provider,
			providerOwner: input.providerOwner,
			model: activeErrorContext.model,
			authMode
		}) : void 0) || failedAssistant?.errorMessage?.trim() || (timedOut ? "LLM request timed out." : rateLimitFailure ? "LLM request rate limited." : billingFailure ? formatBillingErrorMessage(activeErrorContext.provider, activeErrorContext.model, authMode) : authFailure ? "LLM request unauthorized." : "LLM request failed.");
		const reason = decision.reason ?? (billingFailure ? "billing" : authFailure ? "auth" : rateLimitFailure ? "rate_limit" : "unknown");
		const status = assistantStatus ?? resolveFailoverStatus(reason) ?? (isTimeoutErrorMessage(message) ? 408 : void 0);
		if (decision.action === "fallback_model") logDecision("fallback_model", { status });
		throwFailure(new FailoverError(renderRateLimitRetryExhaustion(input.rateLimitRetriesExhausted) ?? message, {
			reason,
			rateLimitRetriesExhausted: input.rateLimitRetriesExhausted,
			provider: activeErrorContext.provider,
			model: activeErrorContext.model,
			profileId: runtime.lastProfileId,
			authMode,
			status,
			code: failedAssistant?.errorCode,
			rawError: failedAssistant?.errorMessage?.trim(),
			timeout: terminalOutcome.status === "timeout" ? {
				timeoutPhase: terminalOutcome.timeoutPhase,
				providerStarted: terminalOutcome.providerStarted
			} : void 0,
			suspend: Boolean(runInput.runParams.sessionKey ?? runInput.runParams.sessionId) && (reason === "rate_limit" || reason === "billing")
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
		thinkLevel: override.thinkLevel ?? input.runtime.thinkLevel,
		authRetryPending: override.authRetryPending ?? false,
		emptyErrorRetries: override.emptyErrorRetries ?? input.emptyErrorRetries,
		overloadProfileRotations: override.overloadProfileRotations ?? input.overloadProfileRotations,
		lastRetryFailoverReason: override.lastRetryFailoverReason ?? input.previousRetryFailoverReason,
		assistantProfileFailureReason: override.assistantProfileFailureReason
	};
}
//#endregion
//#region src/agents/embedded-agent-runner/run/attempt-session-identity.ts
async function applyEmbeddedAttemptSessionIdentity(params) {
	const { sessionPromptState, sessionFileUsed, sessionIdUsed } = params;
	const previousSessionId = sessionPromptState.sessionId;
	const previousSessionFile = sessionPromptState.sessionFile;
	const previousTarget = sessionPromptState.sessionTarget ? { ...sessionPromptState.sessionTarget } : void 0;
	const assertCurrent = () => {
		params.assertCurrent();
		if (sessionPromptState.sessionId !== previousSessionId || sessionPromptState.sessionFile !== previousSessionFile || sessionPromptState.sessionTarget?.agentId !== previousTarget?.agentId || sessionPromptState.sessionTarget?.sessionId !== previousTarget?.sessionId || sessionPromptState.sessionTarget?.sessionKey !== previousTarget?.sessionKey || sessionPromptState.sessionTarget?.storePath !== previousTarget?.storePath) throw new Error("Legacy context-engine successor target changed the active session binding");
	};
	assertCurrent();
	let adoptedSessionId = sessionIdUsed;
	const sessionFileChanged = Boolean(sessionFileUsed && sessionFileUsed !== sessionPromptState.sessionFile);
	let nextSessionTarget = sessionPromptState.sessionTarget;
	if (sessionFileUsed && sessionFileChanged) {
		const marker = parseSqliteSessionFileMarker(sessionFileUsed);
		if (marker) {
			const retainedSessionKey = sessionPromptState.sessionTarget?.sessionKey;
			const entries = await readSessionEntrySummariesInWorker({
				agentId: marker.agentId,
				storePath: marker.storePath
			});
			assertCurrent();
			const retainedLookupKey = retainedSessionKey ? resolveSqliteSessionKey(retainedSessionKey, marker.agentId) : void 0;
			const successorSessionKey = resolveLegacyCompactionSessionKey(entries, marker.sessionId, {
				sessionId: previousSessionId,
				sessionKey: retainedSessionKey
			}, retainedLookupKey);
			if (marker.sessionId !== sessionIdUsed && sessionIdUsed !== previousSessionId || !successorSessionKey || marker.agentId !== sessionPromptState.sessionTarget?.agentId) throw new Error("Legacy context-engine successor identity is inconsistent");
			adoptedSessionId = marker.sessionId;
			nextSessionTarget = {
				...marker,
				sessionKey: successorSessionKey
			};
		} else if (sessionFileUsed.startsWith("agent:") && sessionPromptState.sessionTarget && resolveAgentIdFromSessionKey(sessionFileUsed) === sessionPromptState.sessionTarget.agentId) {
			const keyedEntry = await withSessionEntryReadOnlyInWorker({
				agentId: sessionPromptState.sessionTarget.agentId,
				sessionKey: sessionFileUsed,
				storePath: sessionPromptState.sessionTarget.storePath
			}, assertCurrent, async (read) => {
				if (!read.ok) throw read.error;
				return read.value;
			});
			assertCurrent();
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
	assertCurrent();
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
function stepIdleTimeoutBreaker(state, input) {
	if (input.idleTimedOut && !input.completedModelProgress) state.consecutiveIdleTimeoutsBeforeOutput += 1;
	else if (input.completedModelProgress) state.consecutiveIdleTimeoutsBeforeOutput = 0;
	return {
		consecutive: state.consecutiveIdleTimeoutsBeforeOutput,
		tripped: state.consecutiveIdleTimeoutsBeforeOutput >= 5
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
function recordRunModelProgress(budget) {
	budget.attemptsCounted = 1;
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
	const { idleTimedOut, promptError } = projectAgentRunAttemptTerminal(terminal);
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
	if (params.sessionPersistence !== "detached") await applyEmbeddedAttemptSessionIdentity({
		sessionPromptState,
		sessionFileUsed,
		sessionIdUsed,
		assertCurrent: () => runInput.laneController.throwIfAborted()
	});
	runInput.laneController.throwIfAborted();
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
	if (isSqliteTranscriptMutationConflict(promptError)) throw promptError;
	const lastRunPromptUsage = preflightRecovery?.handled === true && preflightRecovery.source === "mid-turn" && (preflightRecovery.truncatedCount ?? 0) > 0 ? { contextUsage: { state: "unavailable" } } : callUsage.latest;
	const breakerStep = stepIdleTimeoutBreaker(input.idleTimeoutBreakerState, {
		idleTimedOut: terminalTimedOut && idleTimedOut,
		completedModelProgress: hasCompletedModelProgressForIdleBreaker(attempt)
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
	const activeErrorContext = resolveReportedModelRef({
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
	const selection = {
		provider: requested.provider,
		model: requested.model
	};
	if (requested.authProfileId) return {
		...selection,
		authProfileId: requested.authProfileId,
		authProfileIdSource: requested.authProfileIdSource ?? "auto"
	};
	if (normalizeProviderId(requested.provider) === normalizeProviderId(current.provider)) return {
		...current,
		...selection
	};
	return {
		...selection,
		authProfileIdSource: "auto"
	};
}
//#endregion
//#region src/config/sessions/session-entry-presence-read.ts
/** Capture the exact metadata owner before initial-writer admission can wait. */
function prepareSessionEntryPresenceRead(input) {
	const memory = captureMemoryExactSessionReader(input);
	if (memory) {
		const sessionKey = resolveSqliteSessionKey(input.sessionKey, memory.agentId);
		const scope = {
			agentId: memory.agentId,
			storePath: memory.path,
			sessionKey,
			sessionActor: getSessionActorStorageBinding({})
		};
		return {
			sessionKey,
			storePath: memory.path,
			read: async () => Boolean(captureMemoryExactSessionReader(scope)?.read(sessionKey))
		};
	}
	const env = { ...input.env ?? process.env };
	env.OPENCLAW_STATE_DIR = resolveStateDir(env);
	const storePath = resolveSessionStorePathForScope({
		...input,
		env
	});
	const resolved = resolveSqliteScope({
		...input,
		storePath,
		env
	});
	const options = toDatabaseOptions(resolved);
	const databasePath = resolveOpenClawAgentSqlitePath(options);
	const scope = {
		agentId: resolved.agentId,
		sessionKey: resolved.sessionKey,
		storePath: databasePath,
		databaseAgentId: options.agentId,
		env
	};
	return {
		sessionKey: resolved.sessionKey,
		storePath,
		read: async () => await withSessionHistoryWorkerDatabase(options, async (owner) => await owner.readEntryPresence(scope))
	};
}
//#endregion
//#region src/agents/embedded-agent-runner/run/session-bootstrap.ts
const NO_REAL_CONVERSATION_MESSAGES_REASON = "no real conversation messages";
function resolveSessionTargetAgentId(params, sessionKey, markerAgentId) {
	const targetAgentId = normalizeOptionalString(params.sessionTarget?.agentId);
	const targetStorePath = normalizeOptionalString(params.sessionTarget?.storePath);
	const targetStoreOwner = resolvePersistedSessionStoreOwnerForTarget({
		config: params.config ?? {},
		sessionKey,
		storePath: targetStorePath
	});
	if (targetAgentId && targetStorePath && !parseAgentSessionKey(sessionKey)?.agentId && targetStoreOwner.kind === "none") return targetAgentId;
	return markerAgentId ?? resolveSessionAgentId({
		agentId: targetAgentId ?? params.agentId,
		config: params.config,
		sessionKey
	});
}
async function buildContextEngineCompactionSessionTarget(params) {
	const targetAgentId = normalizeOptionalString(params.sessionTarget?.agentId);
	const targetSessionId = normalizeOptionalString(params.sessionTarget?.sessionId);
	const targetSessionKey = normalizeOptionalString(params.sessionTarget?.sessionKey);
	const targetStorePath = normalizeOptionalString(params.sessionTarget?.storePath);
	const completeTarget = Boolean(targetAgentId && targetSessionId && targetSessionKey && targetStorePath);
	const marker = completeTarget ? void 0 : parseSqliteSessionFileMarker(params.sessionFile);
	const suppliedSessionKey = normalizeOptionalString(params.sessionKey);
	const candidateSessionKey = targetSessionKey ?? suppliedSessionKey;
	const candidateKeyAgentId = parseAgentSessionKey(candidateSessionKey)?.agentId;
	const markerEntries = marker ? await readSessionEntrySummariesInWorker({
		agentId: marker.agentId,
		storePath: marker.storePath
	}) : [];
	const suppliedEntry = markerEntries.find(({ sessionKey }) => marker && candidateSessionKey && sessionKey === resolveSqliteSessionKey(candidateSessionKey, marker.agentId))?.entry;
	const markerMatches = markerEntries.filter(({ entry }) => entry.sessionId === marker?.sessionId);
	const preferredMarkerSessionKey = marker ? resolvePreferredSessionKeyForSessionIdMatches(markerMatches.map(({ sessionKey, entry }) => [sessionKey, entry]), marker.sessionId) : void 0;
	const markerSessionKey = marker ? suppliedEntry?.sessionId === marker.sessionId || candidateSessionKey && !suppliedEntry ? candidateSessionKey : preferredMarkerSessionKey : void 0;
	if (marker && markerMatches.length > 0 && !markerSessionKey) throw new Error("Legacy compaction transcript identity is ambiguous");
	if (marker && (targetAgentId && targetAgentId !== marker.agentId || targetSessionId && targetSessionId !== marker.sessionId || candidateKeyAgentId && candidateKeyAgentId !== marker.agentId || targetStorePath && path.resolve(targetStorePath) !== path.resolve(marker.storePath) || candidateSessionKey && suppliedEntry && suppliedEntry.sessionId !== marker.sessionId)) throw new Error("Legacy compaction transcript identity is inconsistent");
	const sessionKey = completeTarget ? targetSessionKey : marker ? markerSessionKey : targetSessionKey ?? suppliedSessionKey;
	const agentId = resolveSessionTargetAgentId(params, sessionKey, marker?.agentId);
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
			...sessionEntryCommitGuardOptions(params.assertActive)
		});
		params.assertActive();
	} catch (err) {
		params.assertActive();
		log$3.warn(`[context-overflow-precheck] failed to reset stale context snapshot for ${params.sessionTarget.sessionKey}: ${String(err)}`);
	}
}
/** Best-effort identity lookup retains the agent that owns an unqualified stored key. */
async function backfillSessionIdentity(params) {
	const trimmed = normalizeOptionalString(params.sessionKey);
	if (trimmed) return { sessionKey: trimmed };
	if (!params.config || !params.sessionId) return {};
	try {
		const resolved = normalizeOptionalString(params.agentId) ? await resolveStoredSessionKeyForSessionId({
			cfg: params.config,
			sessionId: params.sessionId,
			agentId: params.agentId
		}) : await resolveSessionKeyForRequestCore({
			cfg: params.config,
			sessionId: params.sessionId
		});
		return {
			sessionKey: normalizeOptionalString(resolved.sessionKey),
			agentId: normalizeOptionalString(params.agentId) ?? normalizeOptionalString(resolved.agentId)
		};
	} catch (err) {
		log$3.warn(`[backfillSessionIdentity] Failed to resolve sessionKey for sessionId=${redactRunIdentifier(sanitizeForLog(params.sessionId))}: ${formatErrorMessage(err)}`);
		return {};
	}
}
/** Prepare canonical session identity without acquiring execution or placement ownership. */
async function prepareEmbeddedRunSession(paramsInput) {
	const contextEngineAgentId = normalizeOptionalString(paramsInput.sessionTarget?.agentId) ?? normalizeOptionalString(paramsInput.agentId);
	const queuedLifecycleGeneration = getAgentEventLifecycleGeneration();
	const supplied = applyAgentRunSessionTargetIdentity(paramsInput);
	const paramsBase = {
		...supplied,
		...await backfillSessionIdentity(supplied)
	};
	let sessionAdmission;
	const assertWorkerSelection = () => assertRequiredWorkerSelection(paramsBase.config ?? {}, { agentRuntime: paramsBase.agentHarnessId ?? paramsBase.agentHarnessRuntimeOverride });
	const reader = paramsBase.sessionPersistence !== "detached" ? getReplyOperationSessionReader(paramsBase.replyOperation) : void 0;
	const assertActive = paramsBase.admittedRunContext ? resolveAdmittedRunActiveAssertion(paramsBase.admittedRunContext, paramsBase.abortSignal) : void 0;
	const prepareTarget = reader ? async (scope) => {
		sessionAdmission = await assertAgentHarnessRunAdmission(paramsBase, scope);
		assertWorkerSelection();
		return {
			target: sessionAdmission?.runtimeTarget ?? await resolveSessionTranscriptRuntimeTarget(scope),
			assertCurrent: () => {
				paramsBase.abortSignal?.throwIfAborted();
				assertActive?.();
				reader.assertCurrent();
			}
		};
	} : void 0;
	if (!prepareTarget) {
		sessionAdmission = await assertAgentHarnessRunAdmission(paramsBase);
		assertWorkerSelection();
	}
	const runSessionTarget = await resolveAgentRunSessionTarget({
		...paramsBase,
		missingSessionKey: "create"
	}, prepareTarget);
	return {
		params: {
			...paramsBase,
			agentId: runSessionTarget.agentId,
			sessionId: runSessionTarget.sessionId,
			sessionKey: runSessionTarget.sessionKey,
			sessionTarget: runSessionTarget,
			sessionFile: runSessionTarget.sessionKey
		},
		runSessionTarget,
		sessionAdmission,
		contextEngineAgentId,
		queuedLifecycleGeneration
	};
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
		agentId: ownerTarget.agentId,
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
async function assertAgentHarnessRunAdmission(params, runtimeScope) {
	if (params.sessionPersistence === "detached") return;
	const sessionKey = normalizeOptionalString(params.sessionKey);
	if (!sessionKey) return;
	const targetStorePath = normalizeOptionalString(params.sessionTarget?.storePath);
	const admissionAgentId = resolveSessionTargetAgentId(params, sessionKey);
	const storePath = targetStorePath ?? resolveSessionStorePathCore(params.config?.session?.store, { agentId: admissionAgentId });
	const assertActive = params.admittedRunContext ? resolveAdmittedRunActiveAssertion(params.admittedRunContext, params.abortSignal) : void 0;
	assertActive?.();
	const scope = {
		agentId: admissionAgentId,
		sessionKey,
		storePath,
		readConsistency: "latest"
	};
	const assertCurrent = () => {
		assertActive?.();
		params.abortSignal?.throwIfAborted();
	};
	const consume = (entry, runtimeTarget) => {
		assertCurrent();
		const admissionError = resolveAgentHarnessRunAdmissionError({
			agentHarnessId: params.agentHarnessId,
			entry,
			modelSelectionLocked: params.modelSelectionLocked,
			sessionId: params.sessionId,
			sessionKey
		});
		if (admissionError) throw new Error(admissionError);
		return entry ? {
			...scope,
			entry,
			assertActive,
			...runtimeTarget && runtimeScope ? { runtimeTarget: {
				...runtimeTarget,
				storePath: runtimeScope.storePath ?? storePath
			} } : {}
		} : void 0;
	};
	const reader = getReplyOperationSessionReader(params.replyOperation);
	if (reader) {
		const key = assertSessionEntryCohortScope(reader, scope);
		const runtimeTarget = runtimeScope?.agentId === admissionAgentId && runtimeScope.sessionKey.trim() === sessionKey && runtimeScope.storePath && path.resolve(runtimeScope.storePath) === path.resolve(storePath) ? {
			agentId: admissionAgentId,
			sessionId: runtimeScope.sessionId,
			sessionKey: key
		} : void 0;
		return reader.withRead({
			sessionKeys: [key],
			...runtimeTarget ? { runtimeTarget } : {}
		}, assertCurrent, (read) => consume(read.entries.find((row) => row.sessionKey === key)?.entry, read.runtimeTarget));
	}
	return consume(await readSessionEntryInWorker(scope, assertCurrent));
}
async function claimAgentSessionWriter(params) {
	const snapshot = await assertAgentHarnessRunAdmission(params);
	if (!snapshot) return;
	const expectedSessionId = params.sessionId;
	const expectedLifecycleRevision = snapshot.entry.lifecycleRevision;
	if (snapshot.entry.sessionId !== expectedSessionId) throw new Error(`Session changed before writer admission: ${snapshot.sessionKey}`);
	const previousWriterRunId = normalizeOptionalString(snapshot.entry.activeWriterRunId);
	const claimed = await applySessionEntryOperation({
		...snapshot.agentId ? { agentId: snapshot.agentId } : {},
		sessionKey: snapshot.sessionKey,
		storePath: snapshot.storePath
	}, {
		kind: "fields",
		expected: {
			sessionId: expectedSessionId,
			lifecycleRevision: expectedLifecycleRevision
		},
		patch: { activeWriterRunId: params.runId }
	}, {
		skipMaintenance: true,
		...sessionEntryCommitGuardOptions(snapshot.assertActive)
	});
	if (claimed && (claimed.sessionId !== expectedSessionId || claimed.lifecycleRevision !== expectedLifecycleRevision)) throw new Error(`Session changed before writer claim commit: ${snapshot.sessionKey}`);
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
		expectedWriterRunId: params.runId,
		entry: claimed
	};
}
//#endregion
//#region src/agents/embedded-agent-runner/run/compaction-runtime.ts
/** Preserve one prepared owner snapshot throughout context and timeout recovery. */
async function compactEmbeddedRunForRecovery(input, recovery) {
	const { runParams } = input;
	const owner = input.prepareRecoveryOwner();
	const activeSession = owner.session;
	const requestAdmission = runParams.userTurnTranscriptRecorder?.getAdmissionReceipt();
	const requestFromEntryId = requestAdmission?.agentId === input.sessionAgentId && requestAdmission.sessionKey === input.resolvedSessionKey && activeSession.target?.storePath !== void 0 && path.resolve(requestAdmission.storePath) === path.resolve(activeSession.target.storePath) ? requestAdmission.entryId : void 0;
	const promptCacheIdentity = {
		...runParams,
		sessionId: activeSession.id,
		sessionKey: input.resolvedSessionKey
	};
	const recoveryKind = recovery.trigger === "timeout_recovery" ? "timeout" : recovery.trigger;
	const reason = `${recoveryKind === "budget" ? "context budget" : recoveryKind} recovery`;
	await input.runOwnsCompactionBeforeHook(reason);
	owner.assertActive();
	const runtimeContext = {
		...buildEmbeddedCompactionRuntimeContext({
			...runParams,
			modelCallUrgency: resolveModelCallUrgency(runParams),
			authProfileId: input.modelSelection.authProfileId,
			authProfileIdSource: input.modelSelection.authProfileIdSource,
			runtimeAuthPlan: input.runtimeAuthPlan,
			workspaceDir: input.workspaceDir,
			agentDir: input.agentDir,
			provider: input.modelSelection.provider,
			modelId: input.modelSelection.model,
			harnessRuntime: input.harnessRuntime,
			thinkLevel: input.thinkLevel,
			activeProcessSessions: listActiveProcessSessionReferences({ scopeKey: resolveProcessToolScopeKey({
				sessionKey: runParams.sessionKey,
				sessionId: activeSession.id,
				agentId: input.sessionAgentId
			}) })
		}, "recovery"),
		...resolveContextEngineCapabilities({
			config: runParams.config,
			sessionKey: runParams.sessionKey,
			explicitAgentId: input.contextEngineAgentId,
			contextEnginePluginId: input.resolveContextEnginePluginId(),
			purpose: recoveryKind === "budget" ? "context-engine.compaction" : `context-engine.${recoveryKind}-compaction`
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
		sessionTarget: await buildContextEngineCompactionSessionTarget({
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
		result = await compactContextEngineWithSafetyTimeout({
			info: input.contextEngine.info,
			compact: (backendParams) => owner.withTranscriptWrites(backendParams.abortSignal, () => {
				if (backendParams.runtimeContext) attachCompactionAccountingRecorder(backendParams.runtimeContext, {
					requestBudget: input.state.compactionRequestBudget,
					requestFromEntryId,
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
						declarePromptHistoryRewrite({
							...promptCacheIdentity,
							reason: "compaction"
						});
						observedCompactions += 1;
						input.state.observeContextAccounting({
							kind: "compaction",
							tokensAfter
						});
					}
				});
				return input.contextEngine.compact(backendParams);
			})
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
	if (result.compacted && observedCompactions === 0) declarePromptHistoryRewrite({
		...promptCacheIdentity,
		reason: "compaction"
	});
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
	const initialTarget = sessionPromptState.sessionTarget;
	const incognito = !memoryManager && !detached && initialTarget ? captureSessionActorStorageOwner(initialTarget, {
		assertCurrent() {
			abortSignal?.throwIfAborted();
			admittedAssertion?.();
		},
		authorize() {}
	}) : void 0;
	const assertAdmittedActive = composeSessionSourceAssertion([admittedAssertion], (assertSource) => {
		abortSignal?.throwIfAborted();
		if (!admittedAssertion) throw new Error("compaction recovery requires an active admitted run");
		assertSource();
	});
	const assertRecoveryTarget = (target, sessionId = sessionPromptState.sessionId, writerFence = sessionPromptState.sessionWriterFence) => {
		assertAdmittedActive();
		if (memoryManager || detached) return;
		if (incognito && (target?.agentId !== initialTarget?.agentId || target?.storePath !== initialTarget?.storePath)) throw new SessionTranscriptWriterClaimReboundError();
		if (!writerFence || writerFence.expectedWriterRunId !== runId) throw new SessionTranscriptWriterClaimReboundError();
		if (incognito) {
			const entry = target?.sessionKey && target.storePath ? readCapturedSessionActorEntry(incognito, target.sessionKey) : void 0;
			if (entry?.sessionId !== sessionId || entry.lifecycleRevision !== writerFence.expectedLifecycleRevision || entry.activeWriterRunId !== writerFence.expectedWriterRunId) throw new SessionTranscriptWriterClaimReboundError();
		}
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
		const source = !memoryManager && !detached ? captureSessionEntrySourceAssertion({
			scope: target,
			expected: {
				sessionId,
				lifecycleRevision: writerFence?.expectedLifecycleRevision,
				activeWriterRunId: writerFence?.expectedWriterRunId
			},
			fields: [
				"sessionId",
				"lifecycleRevision",
				"activeWriterRunId"
			],
			assertCurrent: () => assertRecoveryTarget(target, sessionId, writerFence),
			assertHostCurrent: () => {
				if (!writerFence || writerFence.expectedWriterRunId !== runId) throw new SessionTranscriptWriterClaimReboundError();
			},
			refuse: () => {
				throw new SessionTranscriptWriterClaimReboundError();
			}
		}) : void 0;
		const assertActive = composeSessionSourceAssertion([assertAdmittedActive, source], (assertSources) => {
			assertSources();
			const current = sessionPromptState.sessionTarget;
			if (sessionPromptState.sessionId !== sessionId || sessionPromptState.sessionFile !== sessionFile || current?.agentId !== target.agentId || current?.sessionKey !== target.sessionKey || current?.storePath !== target.storePath) throw new Error("active session changed after recovery transcript preparation");
		});
		return {
			session: {
				id: sessionId,
				file: sessionFile,
				target
			},
			...memoryManager ? { sessionManager: memoryManager } : {},
			assertActive,
			withTranscriptWrites: (signal, run) => {
				const assertInvocationActive = composeSessionSourceAssertion([assertActive], (assertSource) => {
					signal?.throwIfAborted();
					assertSource();
				});
				const assertCommitAllowed = composeSessionSourceAssertion([assertInvocationActive], (assertSource) => {
					assertSource();
					if (detached || memoryManager) throw new Error("detached recovery cannot persist a session transcript");
				});
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
	const prepareRecoverySession = async (contextTokenBudget) => {
		const owner = prepareRecoveryOwner();
		const sessionManager = memoryManager ?? (detached ? void 0 : await SessionManager.openAsync(owner.session.target, params.workspaceDir, resolveEmbeddedSessionContextLimits(contextTokenBudget)));
		owner.assertActive();
		return {
			sessionManager,
			assertActive: owner.assertActive,
			withSessionManagerRewriteLock: (operation) => owner.withTranscriptWrites(void 0, async () => {
				if (!sessionManager) throw new Error("detached recovery has no caller-owned transcript to rewrite");
				await sessionManager.reloadPersistedTranscriptAsync();
				owner.assertActive();
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
		if (params.replyOperation && accepted.admissionTransition) {
			assertAdmittedActive();
			await acknowledgeReplySessionTransition(params.replyOperation, accepted.admissionTransition);
		}
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
	const runOwnsCompactionHook = async (reason, compactResult, previousSessionId) => {
		assertRecoveryActive();
		const hook = compactResult ? "after_compaction" : "before_compaction";
		if (contextEngine.info.ownsCompaction !== true || compactResult && !compactResult.ok || !hookRunner?.hasHooks(hook)) return;
		try {
			if (compactResult) await hookRunner.runAfterCompaction({
				messageCount: -1,
				compactedCount: compactResult.compacted ? -1 : 0,
				tokenCount: compactResult.result?.tokensAfter,
				sessionFile: resolveCompactionSuccessorTranscript(compactResult).sessionFile ?? sessionPromptState.sessionFile,
				...previousSessionId ? { previousSessionId } : {}
			}, resolveActiveHookContext());
			else await hookRunner.runBeforeCompaction({
				messageCount: -1,
				sessionFile: sessionPromptState.sessionFile
			}, resolveActiveHookContext());
		} catch (error) {
			assertRecoveryActive();
			log$3.warn(`${hook} hook failed during ${reason}: ${String(error)}`);
		}
		assertRecoveryActive();
	};
	return {
		assertRecoveryActive,
		prepareRecoveryOwner,
		prepareRecoverySession,
		adoptCompactionTranscript,
		onCompactionHookMessages,
		runOwnsCompactionBeforeHook: (reason) => runOwnsCompactionHook(reason),
		runOwnsCompactionAfterHook: (reason, compactResult, previousSessionId) => runOwnsCompactionHook(reason, compactResult, previousSessionId)
	};
}
//#endregion
//#region src/agents/embedded-agent-runner/run/overflow-context-recovery.ts
function renderRecoverySideEffectCaution(attempt) {
	return (attempt.currentAttemptReplayMetadata ?? attempt.replayMetadata).hadPotentialSideEffects ? " Completed tool actions were not replayed; verify their effects before retrying." : "";
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
	if (!requiresTranscriptContinuation && (input.state.compactionRequestBudget?.pendingTokens ?? 0) >= contextTokenBudget) return {
		action: "surface",
		kind: "context_overflow",
		errorText,
		userText: "This message exceeds the model's context window on its own. Send a smaller message or use a larger-context model." + renderRecoverySideEffectCaution(input.attempt)
	};
	const retryCurrentTranscript = () => {
		if (requiresTranscriptContinuation) input.prepareCurrentTranscriptRetry();
		return { action: "retry" };
	};
	const truncateToolResults = async () => {
		const { sessionManager, assertActive } = await input.prepareRecoverySession(contextTokenBudget);
		if (!sessionManager) return {
			truncated: false,
			truncatedCount: 0,
			reason: "detached recovery has no caller-owned transcript"
		};
		return await withSessionManagerWrite(sessionManager, async () => {
			try {
				var _usingCtx$3 = _usingCtx();
				const target = sessionManager.getSessionTarget();
				assertActive();
				const projectionState = _usingCtx$3.u(retainEmbeddedSessionPromptState(input.getActiveSession().id)).state.toolResults;
				restoreCacheTtlToolResultProjections(projectionState, sessionManager.getToolResultProjectionEntries());
				const result = await truncateOversizedToolResultsInSessionManager({
					sessionManager,
					contextWindowTokens: contextTokenBudget,
					maxCharsOverride: resolveLiveToolResultMaxChars({ contextWindowTokens: contextTokenBudget }),
					protectTrailingToolResults: preflightRecovery?.route === "compact_then_truncate",
					projectionState,
					...target
				});
				assertActive();
				return result;
			} catch (_) {
				_usingCtx$3.e = _;
			} finally {
				_usingCtx$3.d();
			}
		});
	};
	const promptBudget = isPreflightRecovery ? asPositiveFiniteNumber(preflightRecovery?.promptBudgetBeforeReserve) : void 0;
	const estimatedPromptTokens = isPreflightRecovery ? asPositiveFiniteNumber(preflightRecovery?.estimatedPromptTokens) : void 0;
	const preflightPromptBudget = promptBudget === void 0 ? void 0 : Math.floor(promptBudget);
	const preflightEstimatedPromptTokens = estimatedPromptTokens === void 0 ? void 0 : Math.ceil(estimatedPromptTokens);
	const overflowTokenCountForCompaction = observedOverflowTokens ?? preflightEstimatedPromptTokens ?? (input.contextTokenBudget > 0 ? input.contextTokenBudget + 1 : void 0);
	const activeSession = input.getActiveSession();
	log$3.warn(`[context-overflow-diag] sessionKey=${runParams.sessionKey ?? runParams.sessionId} provider=${input.modelSelection.provider}/${input.modelSelection.model} source=${contextOverflowError.source} trigger=${compactionTrigger} messages=${input.attempt.messagesSnapshot.length} sessionFile=${activeSession.file} diagId=${overflowDiagId} compactionAttempts=${input.state.overflowCompactionAttempts} observedTokens=${observedOverflowTokens ?? "unknown"} preflightEstimatedTokens=${preflightEstimatedPromptTokens ?? "unknown"} compactionTokens=${overflowTokenCountForCompaction ?? "unknown"} providerPayloadBytes=${providerPromptRejection?.byteWeight ?? "unknown"} error=${truncateUtf16Safe(errorText, 200)}`);
	const isCompactionFailure = isCompactionFailureError(errorText);
	const logCompactionDecision = (branch, attempt) => {
		if (log$3.isEnabled("debug")) log$3.debug(`[compaction-diag] decision diagId=${overflowDiagId} branch=${branch} isCompactionFailure=${isCompactionFailure} hasOversizedToolResults=unknown attempt=${attempt} maxAttempts=3`);
	};
	if (isProviderRequestSizeCeilingError(errorText)) {
		log$3.warn(`[context-overflow-recovery] provider request-size ceiling for ${input.modelSelection.provider}/${input.modelSelection.model}; livenessState=blocked suggestedAction=reset_or_new kind=${isCompactionFailure ? "compaction_failure" : "context_overflow"} compaction=skipped retry=skipped`);
		return {
			action: "surface",
			kind: isCompactionFailure ? "compaction_failure" : "context_overflow",
			errorText,
			userText: CONTEXT_OVERFLOW_ERROR_MESSAGE + renderRecoverySideEffectCaution(input.attempt)
		};
	}
	let parkedWorkBlocksContinuation = false;
	let failedCompactionReason;
	if (!isCompactionFailure && input.attemptCompactionCount > 0 && input.state.overflowCompactionAttempts < 3) {
		input.markOwnedTranscriptRetry();
		input.state.overflowCompactionAttempts += 1;
		log$3.warn(`${pressureDescription} persisted after in-attempt compaction (attempt ${input.state.overflowCompactionAttempts}/3); retrying prompt without additional compaction for ${input.modelSelection.provider}/${input.modelSelection.model}`);
		return retryCurrentTranscript();
	}
	if (!isCompactionFailure && input.attemptCompactionCount === 0 && input.state.overflowCompactionAttempts < 3) {
		logCompactionDecision("compact", input.state.overflowCompactionAttempts + 1);
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
				const transcript = await input.prepareRecoverySession(contextTokenBudget);
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
			const transcript = await input.prepareRecoverySession(contextTokenBudget);
			await resetNoRealConversationTokenSnapshot({
				sessionTarget: transcript.sessionManager?.getSessionTarget(),
				sessionPersistence: runParams.sessionPersistence,
				assertActive: transcript.assertActive
			});
			input.assertRecoveryActive();
			log$3.info(`[context-overflow-precheck] stale token state had no real conversation messages for ${input.modelSelection.provider}/${input.modelSelection.model}; resetting the context snapshot and retrying prompt`);
			return retryCurrentTranscript();
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
		if (sessionLikelyHasOversizedToolResults({
			messages: input.attempt.messagesSnapshot,
			contextWindowTokens: input.contextTokenBudget,
			maxCharsOverride: toolResultMaxChars
		})) {
			input.state.toolResultTruncationAttempted = true;
			log$3.warn(`[context-overflow-recovery] Attempting tool result truncation for ${input.modelSelection.provider}/${input.modelSelection.model} (contextWindow=${input.contextTokenBudget} tokens)`);
			const truncResult = await truncateToolResults();
			if (truncResult.truncated) {
				input.markOwnedTranscriptRetry();
				log$3.info(`[context-overflow-recovery] Truncated ${truncResult.truncatedCount} tool result(s); retrying prompt`);
				return retryCurrentTranscript();
			}
			log$3.warn(`[context-overflow-recovery] Tool result truncation did not help: ${truncResult.reason ?? "unknown"}`);
		}
	}
	if (isCompactionFailure || input.state.overflowCompactionAttempts >= 3) logCompactionDecision("give_up", input.state.overflowCompactionAttempts);
	const preflightCompactionFailed = isPreflightRecovery && failedCompactionReason !== void 0;
	const kind = isCompactionFailure || preflightCompactionFailed ? "compaction_failure" : "context_overflow";
	const failureText = preflightCompactionFailed ? `Auto-compaction failed before the next model request: ${failedCompactionReason}` : errorText;
	const userText = preflightCompactionFailed ? `${classifyCompactionReason(failedCompactionReason) === "timeout" ? "Auto-compaction timed out" : "Auto-compaction failed"} before the next model request. Try again or run /compact.` + renderRecoverySideEffectCaution(input.attempt) : CONTEXT_OVERFLOW_ERROR_MESSAGE + renderRecoverySideEffectCaution(input.attempt);
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
	const { runInput, preparedRuntime, normalizedAttempt, runtime, terminal } = input;
	if (isAgentHarnessPreflightError(terminal.promptError) || hasRecordedModelFallbackStop(terminal.promptError)) throw terminal.promptError;
	if (terminal.promptErrorSource === "precheck" && terminal.promptError instanceof CompactionReplayRefreshRequiredError) {
		const text = new CompactionReplayRefreshRequiredError().message;
		return completeBlockedPromptFailure(input, {
			text,
			errorKind: "compaction_replay_refresh_required",
			errorMessage: text
		});
	}
	const promptAuthMode = runtime.lastProfileId ? preparedRuntime.attemptAuthProfileStore.profiles?.[runtime.lastProfileId]?.type : void 0;
	const terminalOutcome = buildAgentRunTerminalOutcomeFromAttempt({
		terminal: normalizedAttempt.attempt.terminal,
		promptTimeoutOutcome: normalizedAttempt.attempt.promptTimeoutOutcome
	});
	const failoverContext = {
		provider: normalizedAttempt.activeErrorContext.provider,
		model: normalizedAttempt.activeErrorContext.model,
		profileId: runtime.lastProfileId,
		authMode: promptAuthMode,
		sessionId: normalizedAttempt.sessionIdUsed,
		lane: runInput.globalLane,
		timeout: terminalOutcome.status === "timeout" ? {
			timeoutPhase: terminalOutcome.timeoutPhase,
			providerStarted: terminalOutcome.providerStarted
		} : void 0
	};
	const normalizedPromptFailover = coerceToFailoverError(terminal.promptError, failoverContext);
	const promptErrorDetails = describeFailoverError(normalizedPromptFailover ?? terminal.promptError);
	if (normalizedPromptFailover?.suspend) runInput.suspendForFailure({
		cfg: runInput.runParams.config,
		agentDir: runInput.agentDir,
		sessionId: input.suspensionSessionId,
		reason: resolveSessionSuspensionReason(normalizedPromptFailover.reason),
		failedProvider: normalizedPromptFailover.provider ?? preparedRuntime.provider,
		failedModel: normalizedPromptFailover.model ?? preparedRuntime.modelId
	});
	const errorText = promptErrorDetails.message || formatErrorMessage(terminal.promptError);
	const recordedTerminalStop = isCliTerminalStopCode(promptErrorDetails.code);
	if (!recordedTerminalStop && await preparedRuntime.maybeRefreshRuntimeAuthForAuthError(errorText, input.runtimeAuthRetry)) return {
		action: "retry",
		thinkLevel: runtime.thinkLevel,
		authRetryPending: true,
		lastRetryFailoverReason: input.previousRetryFailoverReason
	};
	const blockedResult = recordedTerminalStop ? void 0 : resolveBlockedPromptResult(input, errorText);
	if (blockedResult) return blockedResult;
	const promptFailoverReason = promptErrorDetails.reason ?? classifyFailoverReason(errorText, { provider: preparedRuntime.provider });
	const promptProfileFailureReason = input.failover.resolveAuthProfileFailureReason(promptFailoverReason, {
		providerStarted: terminal.promptErrorSource === "prompt",
		transientRateLimit: promptFailoverReason === "rate_limit" && classifyRateLimitWindow(errorText).kind === "short"
	});
	const promptTimeoutFallbackSafe = terminal.promptErrorSource === "prompt" && promptFailoverReason === "timeout" && !normalizedAttempt.attempt.codexAppServerFailure && normalizedAttempt.attempt.promptTimeoutOutcome?.replayInvalid !== true && normalizedAttempt.attempt.replayMetadata.replaySafe;
	const failedProfileId = runtime.lastProfileId;
	const logFailoverDecision = createFailoverDecisionLogger({
		stage: "prompt",
		runId: runInput.runParams.runId,
		rawError: errorText,
		failoverReason: promptFailoverReason,
		profileFailureReason: promptProfileFailureReason,
		provider: preparedRuntime.provider,
		model: preparedRuntime.modelId,
		sourceProvider: preparedRuntime.provider,
		sourceModel: preparedRuntime.modelId,
		profileId: failedProfileId,
		fallbackConfigured: runInput.fallbackConfigured,
		aborted: terminal.aborted,
		retryCount: input.failover.transientRetryCount,
		attemptCount: input.traceAttempts.length + 1
	});
	const recordFailoverDecision = (decision, reason = promptFailoverReason, status) => {
		input.traceAttempts.push({
			provider: preparedRuntime.provider,
			model: preparedRuntime.modelId,
			result: promptFailoverReason === "timeout" ? "timeout" : decision,
			...reason ? { reason } : {},
			stage: "prompt",
			...typeof status === "number" ? { status } : {}
		});
		logFailoverDecision(decision, {
			...decision === "fallback_model" ? { status } : {},
			retryCount: input.failover.transientRetryCount,
			profileRotationCount: decision === "rotate_profile" ? 1 : 0
		});
	};
	const resolveDecision = (profileRotated) => resolveRunFailoverDecision({
		stage: "prompt",
		externalAbort: terminal.externalAbort,
		fallbackConfigured: runInput.fallbackConfigured,
		failoverCode: promptErrorDetails.code,
		failoverFailure: promptFailoverReason !== null,
		failoverReason: promptFailoverReason,
		harnessOwnsTransport: runtime.pluginHarnessOwnsTransport,
		promptTimeoutFallbackSafe,
		timedOutByRunBudget: terminal.timedOutByRunBudget,
		profileRotated
	});
	let failoverDecision = resolveDecision(false);
	let rotated = false;
	if (failoverDecision.action === "rotate_profile") {
		rotated = await input.failover.advanceAuthProfile(promptFailoverReason, {
			failoverProvider: preparedRuntime.provider,
			failoverModel: preparedRuntime.modelId,
			logFallbackDecision: logFailoverDecision
		});
		if (!rotated) failoverDecision = resolveDecision(true);
	}
	const markFailedProfilePromise = promptProfileFailureReason ? input.failover.maybeMarkAuthProfileFailure({
		profileId: failedProfileId,
		reason: promptProfileFailureReason,
		modelId: preparedRuntime.modelId,
		retryAfterMs: resolveRetryAfterMs(formatErrorMessage(terminal.promptError), Date.now(), terminal.promptError)
	}).catch((error) => {
		log$3.warn(`prompt profile failure mark failed: ${String(error)}`);
	}) : void 0;
	if (rotated) {
		recordFailoverDecision("rotate_profile");
		const lastRetryFailoverReason = mergeRetryFailoverReason({
			previous: input.previousRetryFailoverReason,
			failoverReason: promptFailoverReason
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
		attempted: preparedRuntime.attemptedThinking
	});
	if (fallbackThinking) {
		log$3.warn(`unsupported thinking level for ${preparedRuntime.provider}/${preparedRuntime.modelId}; retrying with ${fallbackThinking}`);
		logFailoverDecision("retry_thinking_level", { retryCount: input.failover.transientRetryCount });
		return {
			action: "retry",
			thinkLevel: fallbackThinking,
			authRetryPending: false,
			lastRetryFailoverReason: input.previousRetryFailoverReason
		};
	}
	const retryExhaustionFailure = input.rateLimitRetriesExhausted !== void 0 && promptFailoverReason === "rate_limit" ? coerceToFailoverError(normalizedPromptFailover ?? terminal.promptError, {
		...failoverContext,
		rateLimitRetriesExhausted: input.rateLimitRetriesExhausted
	}) : void 0;
	if (failoverDecision.action === "fallback_model") {
		const fallbackReason = failoverDecision.reason;
		const status = resolveFailoverStatus(fallbackReason, promptErrorDetails.code);
		recordFailoverDecision("fallback_model", fallbackReason, status);
		throw retryExhaustionFailure ?? (normalizedPromptFailover?.reason === fallbackReason ? normalizedPromptFailover : null) ?? new FailoverError(errorText, {
			...failoverContext,
			reason: fallbackReason,
			provider: preparedRuntime.provider,
			model: preparedRuntime.modelId,
			status
		});
	}
	if (failoverDecision.action === "surface_error") recordFailoverDecision("surface_error");
	if (failoverContext.timeout) throw normalizedPromptFailover ?? new FailoverError(errorText, {
		...failoverContext,
		reason: "timeout",
		cause: terminal.promptError
	});
	throw retryExhaustionFailure ?? toErrorObject(terminal.promptError, "Prompt failed");
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
	const replayInvalid = input.normalizedAttempt.resolveReplayInvalidForAttempt();
	input.normalizedAttempt.setTerminalLifecycleMeta({
		replayInvalid,
		livenessState: "blocked"
	});
	return {
		action: "complete",
		result: buildEmbeddedRunBlockedResult({
			...copy,
			durationMs: Date.now() - input.runInput.startedAtMs,
			agentMeta: input.buildErrorAgentMeta(),
			attempt: input.normalizedAttempt.attempt,
			replayInvalid,
			finalPromptText: input.normalizedAttempt.attempt.finalPromptText
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
				memoryAudience: input.runInput?.hookContext.memoryAudience,
				sandboxed: input.runInput?.hookContext.sandboxed,
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
	const { attempt, sessionIdUsed, attemptAssistant, currentAttemptAssistant, currentAttemptCompletedAssistant, terminalState, setTerminalLifecycleMeta, attemptCompactionCount, resolveReplayInvalidForAttempt, assistantErrorText, canRestartForLiveSwitch } = normalizedAttempt;
	const terminal = projectAgentRunAttemptTerminal(attempt.terminal);
	const { aborted, externalAbort, promptError, promptErrorSource, timedOut, timedOutDuringCompaction, timedOutDuringToolExecution, timedOutByRunBudget, idleTimedOut } = terminal;
	const terminalInterrupted = isEmbeddedRunTerminalInterrupted(terminalState.outcome);
	const currentAttemptReplaySafe = isCurrentAttemptReplaySafe(attempt);
	const midTurnPrecheck = promptErrorSource === "precheck" && attempt.preflightRecovery?.source === "mid-turn";
	const settledEvidence = resolveSettledToolBatchEvidence(attempt, { midTurn: midTurnPrecheck });
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
	const emptyLengthStop = recoveryAssistant?.stopReason === "length" && !isCompactionReplayCheckpoint(recoveryAssistant.providerReplay) && recoveryAssistant.content.length === 0 && !isContextOverflow(recoveryAssistant, runtime.contextTokenBudget) && !attempt.lastToolError && !hasAttemptTerminalState(attempt) && !hasComposedVisibleAnswerAfterSettledTools(attempt) && !resolveSilentToolResultReplyPayload({
		isCronTrigger: params.trigger === "cron",
		payloadCount: 0,
		aborted,
		timedOut,
		attempt
	});
	const emptyLengthNeedsContinuation = emptyLengthStop && resolveSourceReplyDelivery(attempt, await observeReplyDelivery(params.resolveReplyDelivery, (attempt.answerSegments?.at(-1)?.messageEnd ?? -1) + 1, (error) => log$3.warn(`reply delivery observation failed; retaining custody: ${formatErrorMessage(error)}`))) === "missing";
	if (emptyLengthStop) runInput.laneController.throwIfAborted();
	const outputLimitFailure = Boolean(recoveryAssistant && (isResponsesOutputLimitToolCallError(recoveryAssistant) || emptyLengthNeedsContinuation));
	const canContinueOutputLimit = params.modelRun !== true && params.promptMode !== "none" && !runtime.pluginHarnessOwnsTransport && !terminalInterrupted && !promptError && (currentAttemptReplaySafe || settledEvidence.allToolsProvenSettled) && attempt.itemLifecycle.activeCount === 0 && toolsAllowContinuation;
	const canContinueSettledIdleTimeout = idleTimedOut && settledEvidence.allToolsProvenSettled && toolsAllowContinuation;
	const midTurnBatchSettled = settledEvidence.allToolsProvenSettled || settledEvidence.parkedCodeModeRun;
	const canContinueSettledMidTurnOverflow = midTurnPrecheck && midTurnBatchSettled && !asyncActivity;
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
	const completeBlocked = (errorKind, errorMessage, text = errorMessage, finalPromptText) => {
		const replayInvalid = resolveReplayInvalidForAttempt();
		setTerminalLifecycleMeta({
			replayInvalid,
			livenessState: "blocked"
		});
		return {
			action: "complete",
			result: buildEmbeddedRunBlockedResult({
				text,
				errorKind,
				errorMessage,
				durationMs: Date.now() - runInput.startedAtMs,
				agentMeta: buildAttemptErrorMeta(),
				attempt,
				replayInvalid,
				finalPromptText
			})
		};
	};
	if (promptErrorSource === "hook:before_agent_run" && !terminalInterrupted) {
		recordRecoveryDecision("rejected", "hook_block");
		return completeBlocked("hook_block", formatErrorMessage(promptError));
	}
	const requestedSelection = await shouldSwitchToLiveModel({
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
			agentId: params.agentId,
			defaultProvider: DEFAULT_PROVIDER,
			defaultModel: DEFAULT_MODEL,
			expectedSelection: requestedSelection
		});
		log$3.info(`live session model switch requested during active attempt for ${params.sessionId}: ${preparedRuntime.provider}/${preparedRuntime.modelId} -> ${requestedSelection.provider}/${requestedSelection.model}`);
		recordRecoveryDecision("accepted", "live_model_switch");
		throw new LiveSessionModelSwitchError(requestedSelection);
	}
	const assistantSignal = attemptAssistant?.stopReason === "error" ? buildAssistantFailoverSignal(attemptAssistant) : void 0;
	const assistantFailure = assistantSignal ? classifyFailoverSignal(assistantSignal, { providerPlugin: runtime.providerRuntimeHandle?.plugin }) : null;
	const assistantOverflowClassification = assistantOverflowCandidate === attemptAssistant ? assistantFailure : assistantOverflowCandidate?.stopReason === "error" ? classifyFailoverSignal(buildAssistantFailoverSignal(assistantOverflowCandidate), { providerPlugin: runtime.providerRuntimeHandle?.plugin }) : null;
	const retryFailure = promptError ? resolveFailoverClassificationFromError(promptError, preparedRuntime.provider) : assistantFailure;
	const failureReason = promptError ? failoverReasonFromClassification(retryFailure) : assistantFailure?.kind === "reason" ? assistantFailure.reason : idleTimedOut || attemptAssistant && isRetryableAssistantError(attemptAssistant) && attemptAssistant.diagnostics?.some((diagnostic) => diagnostic.type === "provider_transport_failure") ? "timeout" : null;
	const compactionSelection = resolveCompactionLiveModelSelection({
		current: {
			provider: preparedRuntime.provider,
			model: preparedRuntime.modelId,
			authProfileId: runtime.lastProfileId,
			authProfileIdSource: params.authProfileBinding ? params.authProfileIdSource ?? "auto" : runtime.lastProfileId && runtime.lastProfileId === preparedRuntime.lockedProfileId ? "user" : "auto"
		},
		requested: currentAttemptReplaySafe ? requestedSelection : void 0
	});
	const commonRecoveryInput = {
		runInput,
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
		sameModelRetry: retryFailure?.kind === "reason" ? retryFailure.sameModelRetry : void 0,
		code: promptError ? getFailoverErrorCode(promptError) : assistantSignal?.code,
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
					retryAt: Date.now() + delayMs,
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
		if (outputLimitFailure) {
			sessionPromptState.markOwnedTranscriptRetry();
			await sessionPromptState.settleOwnedTranscriptProjection(sessionPromptState.sessionTarget, params.abortSignal);
			runInput.laneController.throwIfAborted();
			const toolCallId = (recoveryAssistant?.diagnostics?.find((diagnostic) => diagnostic.type === "openai_responses_terminal")?.details)?.incompleteToolCallId;
			await sessionPromptState.withSessionWriterContext(() => sessionPromptState.recordOutputLimitNotice(typeof toolCallId === "string" ? toolCallId : void 0));
			runInput.laneController.throwIfAborted();
		}
		sessionPromptState.markOwnedTranscriptRetry();
		sessionPromptState.continueFromCurrentTranscript({
			includeToolFailureInstruction: Boolean(attempt.lastToolError),
			messages: attempt.messagesSnapshot
		});
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
		return completeBlocked(overflowRecovery.kind, overflowRecovery.errorText, overflowRecovery.userText, attempt.finalPromptText);
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
			runInput,
			preparedRuntime,
			normalizedAttempt,
			runtime,
			terminal,
			suspensionSessionId: sessionPromptState.sessionId ?? params.sessionId,
			runtimeAuthRetry: input.runtimeAuthRetry,
			buildErrorAgentMeta: buildAttemptErrorMeta,
			failover: failoverRetryController,
			rateLimitRetriesExhausted: failoverRetryController.rateLimitRetriesExhausted,
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
const MAX_OUTPUT_LIMIT_RETRIES = 1;
const MAX_TRANSIENT_RETRY_TIME_MS = 9e4;
const TRANSIENT_RETRY_BASE_DELAY_MS = 1e3;
const TRANSIENT_RETRY_MAX_DELAY_MS = 3e4;
function resolveTransientRetryDelayMs(params) {
	const remainingMs = params.elapsedMs === void 0 ? Infinity : MAX_TRANSIENT_RETRY_TIME_MS - Math.max(0, params.elapsedMs);
	if (remainingMs <= 0 || params.retryAfterMs === Infinity) return;
	const exponentialMs = Math.min(TRANSIENT_RETRY_MAX_DELAY_MS, TRANSIENT_RETRY_BASE_DELAY_MS * 2 ** Math.max(0, params.retryNumber - 1));
	const jitteredMs = Math.min(TRANSIENT_RETRY_MAX_DELAY_MS, Math.round(exponentialMs * (.5 + Math.random())));
	const providerTiming = Number.isFinite(params.retryAfterMs);
	const retryAfterMs = providerTiming ? Math.max(0, Math.ceil(params.retryAfterMs ?? 0)) : 0;
	const delayMs = params.rateLimit && providerTiming ? retryAfterMs : Math.max(jitteredMs, retryAfterMs);
	return delayMs <= remainingMs ? delayMs : void 0;
}
const MAX_OVERLOAD_PROFILE_ROTATIONS = 1;
const MAX_RATE_LIMIT_PROFILE_ROTATIONS = 1;
const RETRY_SLEEP_CHUNK_MS = 864e5;
function createEmbeddedRunFailoverRetryController(input) {
	const { runInput, preparedRuntime } = input;
	const { runParams: params, globalLane, agentDir, fallbackConfigured } = runInput;
	const { provider, modelId, profileFailureStore } = preparedRuntime;
	const advanceAttemptAuthProfile = preparedRuntime.advanceAttemptAuthProfile;
	let rateLimitProfileRotations = 0;
	let organizationTpmExhausted = false;
	let transientRetryCount = 0;
	let outputLimitRetryCount = 0;
	let rateLimitSeen = false;
	let transientRetryBudget;
	let rateLimitRetriesExhausted;
	let transientRetryWindowStartMs = null;
	const resolveProfileFailureReason = (failoverReason, opts) => resolveAuthProfileFailureReason({
		failoverReason,
		providerStarted: opts?.providerStarted,
		transientRateLimit: organizationTpmExhausted ? false : opts?.transientRateLimit,
		policy: params.authProfileFailurePolicy
	});
	const maybeMarkAuthProfileFailure = async (failure) => {
		const { profileId, reason } = failure;
		if (preparedRuntime.snapshot().pluginHarnessOwnsTransport && (reason === "auth" || reason === "auth_permanent")) revokeRuntimeAuthMaterializations({
			agentDir,
			provider,
			runtimeOwnerId: preparedRuntime.snapshot().agentHarness.id
		});
		if (params.authProfileStateMode === "read-only" || !reason) return;
		if (preparedRuntime.snapshot().pluginHarnessOwnsTransport && reason === "timeout") return;
		const failureParams = {
			store: profileFailureStore,
			reason,
			cfg: params.config,
			agentDir,
			runId: params.runId,
			modelId: failure.modelId,
			retryAfterMs: failure.retryAfterMs
		};
		if (profileId) {
			await markAuthProfileFailure({
				...failureParams,
				profileId
			});
			return;
		}
		const apiKeyInfo = preparedRuntime.getApiKeyInfo();
		if (apiKeyInfo?.mode !== "api-key" || !isConfigBackedInlineProviderApiKey({
			cfg: params.config,
			provider,
			source: apiKeyInfo.source,
			store: profileFailureStore
		})) return;
		await markInlineProviderApiKeyFailure({
			...failureParams,
			provider
		});
	};
	const advanceRateLimitAuthProfile = async (context) => {
		if (organizationTpmExhausted) return false;
		if (rateLimitProfileRotations >= MAX_RATE_LIMIT_PROFILE_ROTATIONS && fallbackConfigured) {
			const status = resolveFailoverStatus("rate_limit");
			log$3.warn(`rate-limit profile rotation cap reached for ${sanitizeForLog(provider)}/${sanitizeForLog(modelId)} after ${rateLimitProfileRotations} rotations; escalating to model fallback`);
			context.logFallbackDecision("fallback_model", { status });
			throw new FailoverError(renderRateLimitRetryExhaustion(rateLimitRetriesExhausted) ?? "The AI service is temporarily rate-limited. Please try again in a moment.", {
				reason: "rate_limit",
				rateLimitRetriesExhausted,
				provider: context.failoverProvider,
				model: context.failoverModel,
				profileId: preparedRuntime.snapshot().lastProfileId,
				sessionId: input.getSessionId(),
				lane: globalLane,
				status
			});
		}
		const rotated = await preparedRuntime.advanceAttemptAuthProfile();
		if (rotated) rateLimitProfileRotations += 1;
		return rotated;
	};
	return {
		overloadProfileRotationLimit: MAX_OVERLOAD_PROFILE_ROTATIONS,
		get transientRetryCount() {
			return transientRetryCount;
		},
		get rateLimitRetriesExhausted() {
			return rateLimitRetriesExhausted;
		},
		observeAttempt: (attempt) => {
			organizationTpmExhausted = false;
			transientRetryBudget = attempt.providerRetryMaxRetries;
			rateLimitRetriesExhausted = void 0;
			if (attempt.hasSuccessfulModelResponse) {
				transientRetryCount = 0;
				rateLimitSeen = false;
				transientRetryWindowStartMs = null;
			}
		},
		advanceAuthProfile: (reason, context) => reason === "rate_limit" ? advanceRateLimitAuthProfile(context) : advanceAttemptAuthProfile(),
		maybeMarkAuthProfileFailure,
		resolveAuthProfileFailureReason: resolveProfileFailureReason,
		recoverThrownHarnessAuthFailure: async (error) => {
			if (!preparedRuntime.snapshot().pluginHarnessOwnsTransport) return null;
			const failoverReason = resolveFailoverReasonFromError(error, provider);
			if (failoverReason !== "auth" && failoverReason !== "auth_permanent") return null;
			const failedProfileId = preparedRuntime.snapshot().lastProfileId;
			const profileFailureReason = resolveProfileFailureReason(failoverReason);
			const rotated = params.authProfileIdSource === "user" && failedProfileId === params.authProfileId ? false : await preparedRuntime.advanceAttemptAuthProfile();
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
			rateLimitRetriesExhausted = void 0;
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
			if (params.retryConnectionErrors === false && retry.code !== void 0 && [
				"ECONNREFUSED",
				"ENOTFOUND",
				"EHOSTUNREACH",
				"ENETUNREACH"
			].includes(retry.code)) {
				recordDecision("rejected", "connection_retry_disabled");
				return false;
			}
			if (retry.reason !== "rate_limit" && retry.reason !== "overloaded" && retry.reason !== "server_error" && retry.reason !== "timeout" && retry.reason !== "output_limit") {
				recordDecision("rejected", "non_transient");
				return false;
			}
			const rateLimit = retry.reason === "rate_limit";
			if (rateLimit && hasLongWindowRateLimitEvidence(retry.message)) {
				recordDecision("rejected", "long_window_rate_limit");
				return false;
			}
			if (rateLimit && fallbackConfigured && params.isFinalFallbackAttempt !== true && retry.failoverEligible !== false && hasOrganizationTpmRateLimitEvidence(retry.message)) {
				organizationTpmExhausted = true;
				markProbeAttempt(Date.now(), resolveProbeThrottleKey(provider, agentDir));
				recordDecision("rejected", "organization_tpm_exhausted");
				return false;
			}
			if (retry.sameModelRetry === false) {
				recordDecision("rejected", "non_transient");
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
			if (retryCount >= retryBudget || retry.reason === "output_limit" && outputLimitRetryCount >= MAX_OUTPUT_LIMIT_RETRIES) {
				if (rateLimit) rateLimitRetriesExhausted = retryBudget === 0 ? 0 : retryCount;
				recordDecision("rejected", "retry_budget_exhausted");
				return false;
			}
			const nowMs = Date.now();
			const retryWindowStartMs = transientRetryWindowStartMs ?? nowMs;
			if (retry.reason !== "output_limit") transientRetryWindowStartMs = retryWindowStartMs;
			const delayMs = resolveTransientRetryDelayMs({
				retryNumber: retryCount + 1,
				retryAfterMs: retry.retryAfterMs,
				rateLimit,
				elapsedMs: rateLimit || retry.reason === "output_limit" ? void 0 : nowMs - retryWindowStartMs
			});
			if (delayMs === void 0) {
				recordDecision("rejected", "retry_delay_unavailable");
				log$3.warn(`transient retry ${retry.retryAfterMs === Infinity ? "floor exceeds representable time" : "window elapsed"} for ${sanitizeForLog(provider)}/${sanitizeForLog(modelId)} after ${transientRetryCount}/${retryBudget} retries; stopping same-model retries`);
				return false;
			}
			const outputLimit = retry.reason === "output_limit";
			const attempt = (outputLimit ? outputLimitRetryCount : retryCount) + 1;
			const maxRetries = outputLimit ? Math.min(retryBudget, MAX_OUTPUT_LIMIT_RETRIES) : retryBudget;
			log$3.warn(`${outputLimit ? "output-limit continuation" : "transient same-model retry"} ${attempt}/${maxRetries} for ${sanitizeForLog(provider)}/${sanitizeForLog(modelId)} reason=${retry.reason}: delayMs=${delayMs} runId=${JSON.stringify(params.runId)} sessionId=${JSON.stringify(input.getSessionId())}`);
			try {
				await retry.onRetry?.({
					attempt,
					maxRetries,
					delayMs,
					reason: retry.reason
				});
			} catch {
				log$3.warn("transient retry status callback failed; continuing retry");
			}
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
			if (retry.reason === "output_limit") outputLimitRetryCount += 1;
			return true;
		}
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
						const { clearSessionLifecycleQueues } = await import("./cleanup-BkdsKAW6.mjs");
						clearSessionLifecycleQueues({
							...ownedTarget,
							keys: [ownedTarget.sessionKey, attempt.sessionIdUsed],
							assertCurrent
						});
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
//#region src/agents/embedded-agent-runner/run/attempt-exec-approval-continuation.ts
function prepareExecApprovalContinuationForAttempt(params) {
	const promptRange = params.promptRange;
	if (!promptRange) return {
		prompt: params.prompt,
		transcriptPrompt: params.transcriptPrompt
	};
	const contextWindowTokens = Math.max(1, Math.floor(params.contextTokenBudget ?? params.modelContextWindow ?? params.modelMaxTokens ?? 2e5));
	const maxOutputUtf16Units = resolveLiveToolResultMaxChars({ contextWindowTokens });
	const resize = (prompt, range = promptRange) => resizeExecApprovalContinuationPrompt({
		prompt,
		range,
		maxOutputUtf16Units
	});
	const prompt = resize(params.prompt);
	const transcriptPrompt = params.transcriptPrompt === void 0 ? void 0 : resize(params.transcriptPrompt, params.transcriptPromptRange ?? promptRange);
	params.userTurnTranscriptRecorder?.replaceTextBeforePersistence?.(transcriptPrompt ?? prompt);
	return {
		prompt,
		transcriptPrompt
	};
}
//#endregion
//#region src/agents/embedded-agent-runner/run/attempt-gateway-tools.ts
/** Prepare Gateway tools once at the shared dispatch boundary, including internal continuations. */
function withPreparedEmbeddedGatewayTools(attempt, run) {
	const callerIdentity = createAdmittedGatewayToolCallerIdentity({
		admittedRunContext: attempt.admittedRunContext,
		cronAuthorityCheck: attempt.cronCreatorAuthorityCapability?.isCurrent,
		agentId: attempt.agentId,
		sessionKey: attempt.sessionKey,
		turnSourceChannel: attempt.messageChannel ?? attempt.messageProvider,
		turnSourceLocal: !attempt.messageChannel && !attempt.messageProvider && attempt.cronCreatorAuthorityCapability?.callerOrigin.kind === "local" || void 0,
		turnSourceTo: attempt.currentMessagingTarget ?? attempt.currentChannelId,
		turnSourceAccountId: attempt.agentAccountId,
		turnSourceThreadId: attempt.currentThreadTs
	});
	return withGatewayToolCallerIdentity(callerIdentity, () => {
		const gateway = getGatewayContextResolver(attempt.admittedRunContext)?.();
		if (!attempt.disableTools && attempt.sessionPersistence !== "detached" && agentHarnessExposesOpenClawTools(attempt.agentHarnessId) && gateway && !gateway.localEmbedded) attempt.githubPublicationAvailable = readGitHubPublicationFact({
			sessionId: attempt.sessionId,
			sessionKey: attempt.sessionKey,
			agentId: attempt.agentId
		}).available;
		return run();
	});
}
//#endregion
//#region src/agents/embedded-agent-runner/run/attempt-memory-audience.ts
const retainedAudience = () => {};
/**
* Keep a delegated audience bound to this attempt, or resolve its admitted
* source row. The returned release ends the attempt-owned session leases.
*/
async function resolveEmbeddedAttemptMemoryAudience(params) {
	if (params.memoryAudience) {
		if (!isHostMemoryAudience(params.memoryAudience)) throw new Error("Embedded run memory audience must be host-minted.");
		assertMemoryAudienceSession(params.memoryAudience, params.sessionKey);
		return {
			memoryAudience: params.memoryAudience,
			release: retainedAudience
		};
	}
	if (!params.admission || resolveLoadedMemoryProviderKind(params.config ?? {}) !== "native") return { release: retainedAudience };
	const resolution = await resolveMemoryAudienceFromEntry({
		agentId: params.agentId,
		sessionKey: params.sessionKey,
		sessionId: params.sessionId,
		senderIsOwner: params.senderIsOwner,
		storePath: params.admission.storePath,
		resolveAgentStorePath: (hopAgentId) => resolveSessionStorePathForScope({ agentId: hopAgentId }, params.config),
		assertCallerCurrent: params.assertCallerCurrent
	}, params.admission.entry);
	if (resolution.status === "granted") return {
		memoryAudience: resolution.audience,
		release: resolution.release
	};
	const message = `memory audience unavailable: ${resolution.reason}`;
	const meta = {
		event: "memory_audience_denied",
		kind: resolution.kind,
		sessionKey: params.sessionKey
	};
	log$3[resolution.kind === "stale-lineage" ? "warn" : "info"](message, meta);
	return { release: retainedAudience };
}
//#endregion
//#region src/agents/embedded-agent-runner/run/auth-store.ts
function resolveAttemptDispatchApiKey(params) {
	if (params.runtimeAuthState) return params.pluginHarnessOwnsTransport ? params.runtimeAuthState.sourceApiKey : void 0;
	return params.apiKeyInfo?.apiKey;
}
function createScopedAuthProfileStore(store, profileIds) {
	const profiles = store.profiles ?? {};
	const normalizedProfileIds = profileIds.map((profileId) => profileId.trim()).filter(Boolean);
	const scopedProfiles = Object.fromEntries(normalizedProfileIds.flatMap((profileId) => {
		const credential = profiles[profileId];
		return credential ? [[profileId, credential]] : [];
	}));
	const filterProfiles = (ids) => (ids ?? []).filter((profileId) => scopedProfiles[profileId]);
	const scopedRuntimeExternalProfileIds = filterProfiles(store.runtimeExternalProfileIds);
	const scopedRuntimePersistedProfileIds = filterProfiles(store.runtimePersistedProfileIds);
	return Object.keys(scopedProfiles).length > 0 ? {
		version: store.version,
		profiles: scopedProfiles,
		...scopedRuntimePersistedProfileIds.length > 0 ? { runtimePersistedProfileIds: scopedRuntimePersistedProfileIds } : {},
		...scopedRuntimeExternalProfileIds.length > 0 || store.runtimeExternalProfileIdsAuthoritative === true ? { runtimeExternalProfileIds: scopedRuntimeExternalProfileIds } : {},
		...store.runtimeExternalProfileIdsAuthoritative === true ? { runtimeExternalProfileIdsAuthoritative: true } : {}
	} : {
		version: 1,
		profiles: {}
	};
}
//#endregion
//#region src/agents/embedded-agent-runner/run/backend.ts
/** Replaces backend-retained provenance with the exact prepared request fact. */
function resolveRuntimeModelAttempt(runtimePlan) {
	const credentialSource = runtimePlan?.auth.credentialSource;
	return credentialSource ? {
		provider: runtimePlan.resolvedRef.provider,
		model: runtimePlan.resolvedRef.modelId,
		credentialSource
	} : void 0;
}
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
	const preparedParams = attachmentMedia?.length ? {
		...params,
		inputAttachmentMedia: attachmentMedia
	} : params;
	const result = await runAgentHarnessAttempt(attachmentNote ? {
		...preparedParams,
		prompt: `${params.prompt}\n\n${attachmentNote}`,
		transcriptPrompt: params.transcriptPrompt ?? params.prompt
	} : preparedParams, nativeSessionRuntime);
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
//#endregion
//#region src/agents/embedded-agent-runner/run/terminal-retry-state.ts
function createEmbeddedRunTerminalRetryState() {
	return {
		completionCheck: {
			unfinishedPlan: false,
			checked: false
		},
		reasoningOnlyAttempts: 0,
		emptyResponseAttempts: 0,
		textToolCallAttempts: 0,
		missingAssistantAttempts: 0,
		compactionContinuationAttempts: 0,
		beforeFinalizeRevisionAttempts: 0
	};
}
//#endregion
//#region src/agents/embedded-agent-runner/run/run-attempt-dispatch.ts
/** Prepares the selected runtime and dispatches an attempt under its admitted lifecycle. */
async function prepareAndDispatchEmbeddedRunAttempt(input) {
	try {
		var _usingCtx$2 = _usingCtx();
		const { runInput, preparedRuntime, contextEngine, sessionPromptState, terminalRetryState } = input;
		const params = runInput.runParams;
		const { workspaceResolution, workspaceDir, bootstrapWorkspaceDir, isCanonicalWorkspace, agentDir, resolvedSessionKey, resolvedToolResultFormat, startupStages, emitStartupStageSummary, lifecycleGeneration } = runInput;
		const { fastModeAutoOnSeconds, fastModeAutoProgressState, fastModeStartedAtMs, maybeAnnounceFastModeAutoOff, notifyExecutionPhase, notifyRunProgress, resolveAttemptFastModeParam } = runInput.progressController;
		const { createAttemptControls } = runInput.laneController;
		const { provider, modelId, requestedModelId, expectedHarnessArtifact, nativeModelOwned, authStorage, modelRegistry, attemptAuthProfileStore, lockedProfileId, resolveRunAttemptAuthProfileStore } = preparedRuntime;
		const runtime = preparedRuntime.snapshot();
		const effectiveModel = attachModelProviderRuntimePluginHandle(runtime.effectiveModel, runtime.providerRuntimeHandle);
		params.assertModelInput?.(effectiveModel);
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
		const selectedPromptTarget = { ...existingSessionTarget };
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
			thinkingLevel: mapThinkingLevelForProvider(runtime.thinkLevel, effectiveModel),
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
		if (!params.admittedRunContext) throw new Error("embedded attempt reached dispatch without an admitted run context");
		const admittedRunContext = params.admittedRunContext;
		const requireActiveAssertion = (signal) => {
			const assertion = resolveAdmittedRunActiveAssertion(admittedRunContext, signal);
			if (!assertion) throw new Error("embedded attempt reached dispatch without an active admitted run");
			return assertion;
		};
		const assertTrajectoryCurrent = requireActiveAssertion(params.abortSignal);
		const trajectoryRecorder = runtime.agentHarness.id === "codex" && !params.disableTrajectory && params.sessionPersistence !== "detached" ? await createTrajectoryRuntimeRecorder({
			cfg: params.config,
			env: process.env,
			runId: params.runId,
			sessionId: sessionPromptState.sessionId,
			sessionKey: resolvedSessionKey,
			sessionFile: trajectorySessionFile,
			...projectTrajectorySessionTarget(resolvedSessionTarget, true),
			provider: trajectoryAttribution.provider,
			modelId: trajectoryAttribution.modelId,
			modelApi: trajectoryAttribution.modelApi,
			workspaceDir
		}) : void 0;
		assertTrajectoryCurrent();
		if (!input.startupStagesEmitted) {
			startupStages.mark(EMBEDDED_RUN_ATTEMPT_DISPATCH_STAGE.runtimePlan);
			startupStages.mark(EMBEDDED_RUN_ATTEMPT_DISPATCH_STAGE.dispatch);
			notifyExecutionPhase("attempt_dispatch", {
				provider,
				model: modelId
			});
			emitStartupStageSummary(EMBEDDED_RUN_ATTEMPT_DISPATCH_STAGE.dispatch);
		}
		const fallbackReason = input.resolveRuntimeFallbackReason();
		const explicitAuthProfile = Boolean(runtime.lastProfileId && runtime.lastProfileId === lockedProfileId);
		recordAdmittedModelRoutingDecision({
			admittedRunContext: params.admittedRunContext,
			abortSignal: params.abortSignal,
			requestedProvider: params.modelRoutingProvenance?.requestedProvider ?? runInput.provider,
			requestedModel: params.modelRoutingProvenance?.requestedModel ?? requestedModelId ?? runInput.modelId,
			selectedProvider: provider,
			selectedModel: modelId,
			selectionMode: explicitAuthProfile ? "explicit" : "automatic",
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
		const fallbackActive = modelId !== requestedModelId || params.modelRoutingProvenance?.stage === "fallback" || Boolean(fallbackReason);
		const attemptContextEngine = nativeModelOwned && contextEngine?.info.id === "legacy" ? void 0 : contextEngine;
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
		const assertActiveRun = requireActiveAssertion(attemptAbortController.signal);
		assertActiveRun();
		if (runtime.pluginHarnessOwnsTransport) {
			await params.awaitSessionDiffBaseline?.();
			assertActiveRun();
		}
		const placement = _usingCtx$2.u(runtime.pluginHarnessOwnsTransport ? await preparePluginHarnessWorkspace({
			...params,
			agentId: workspaceResolution.agentId,
			cwd: void 0,
			sessionId,
			sessionKey: resolvedSessionKey,
			workspaceDir
		}) : null);
		assertActiveRun();
		const pluginWorkspace = placement?.workspace;
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
		const pluginSandbox = placement?.sandbox ?? pluginWorkspace?.sandbox;
		if (params.permissionMode) {
			params.execOverrides ??= {};
			params.execOverrides.mode = resolveSessionPermissionExecMode({ mode: params.permissionMode });
		}
		const { extraSystemPrompt, gitCoauthorPrompt } = await prepareAttemptSystemPromptAdditions({
			agentId: workspaceResolution.agentId,
			authProfileId: runtime.lastProfileId,
			config: params.config,
			extraSystemPrompt: params.extraSystemPrompt,
			modelId,
			provider,
			sessionId,
			sessionKey: params.sessionKey,
			storePath: params.sessionTarget?.storePath,
			toolsAllow: params.toolsAllow
		});
		assertActiveRun();
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
		const { memoryAudience, release: releaseMemoryAudience } = await resolveEmbeddedAttemptMemoryAudience({
			memoryAudience: params.memoryAudience,
			config: params.config,
			agentId: workspaceResolution.agentId,
			sessionKey: resolvedSessionKey,
			sessionId,
			senderIsOwner: params.senderIsOwner,
			admission: runInput.sessionAdmission,
			assertCallerCurrent: assertActiveRun
		});
		const attemptControls = createAttemptControls({
			admittedRunContext,
			abortSignal: attemptAbortController.signal,
			onAbort: () => {
				params.replyOperation?.abortByUser();
			}
		});
		const pluginRefresh = captureAgentPluginRuntimeRefresh();
		const preparedSessionTarget = !sessionManager && resolvedSessionTarget?.agentId && resolvedSessionTarget.sessionId && resolvedSessionTarget.sessionKey && resolvedSessionTarget.storePath ? {
			target: captureSessionTranscriptTargetBinding({
				...resolvedSessionTarget,
				agentId: resolvedSessionTarget.agentId,
				sessionId: resolvedSessionTarget.sessionId,
				sessionKey: resolvedSessionTarget.sessionKey,
				storePath: resolvedSessionTarget.storePath
			}),
			assertCurrent: () => {
				assertActiveRun();
				if (!attemptControls.isCurrent() || sessionPromptState.sessionId !== sessionId || [
					"agentId",
					"sessionId",
					"sessionKey",
					"storePath",
					"threadId"
				].some((field) => sessionPromptState.sessionTarget?.[field] !== selectedPromptTarget[field])) throw new Error("Session target preparation outlived its attempt");
			}
		} : void 0;
		const attemptParams = {
			modelCallSequence: runInput.modelCallSequence ??= { value: 0 },
			providerReviewAcknowledgment: params.providerReviewAcknowledgment,
			awaitSessionDiffBaseline: params.awaitSessionDiffBaseline,
			pluginRuntimeRefreshPending: pluginRefresh.isPending,
			registerPluginRuntimeRefreshConsumer: (isCurrent) => {
				if (attemptControls.isCurrent()) pluginRefresh.bindConsumer(() => attemptControls.isCurrent() && isCurrent());
			},
			pluginRuntimeRefreshMessages: params.pluginRuntimeRefreshMessages,
			continuation: sessionPromptState.continuation,
			permissionChange: input.permissionChange,
			admittedRunContext: params.admittedRunContext,
			startedAtMs: runInput.startedAtMs,
			contextEngineAgentId: runInput.contextEngineAgentId,
			...runtime.pluginHarnessOwnsTransport ? { sandbox: pluginSandbox } : {},
			operation: "attempt",
			sessionId,
			sessionKey: resolvedSessionKey,
			memoryAudience,
			conversationRecall: params.conversationRecall,
			promptCacheKey: params.promptCacheKey,
			sandboxSessionKey: params.sandboxSessionKey,
			sandboxAgentId: params.sandboxAgentId,
			trigger: params.trigger,
			terminalReplyExpectation: resolveReplyExpectation(params),
			memoryFlushWritePath: params.memoryFlushWritePath,
			memoryFlushTools: params.memoryFlushTools,
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
			...projectEmbeddedMessageContext(params),
			hasRepliedRef: params.hasRepliedRef,
			sessionFile,
			...sessionManager ? { sessionManager } : { sessionTarget: resolvedSessionTarget },
			preparedSessionTarget,
			trajectoryRecorder: trajectoryRecorder ?? void 0,
			...resolveHarnessWorkspace(workspaceDir, params, pluginWorkspace, pluginSandbox),
			bootstrapWorkspaceDir,
			permissionMode: params.permissionMode,
			requireWorkspaceOnly: params.requireWorkspaceOnly,
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
			explicitSkillSelections: params.explicitSkillSelections?.map((selection) => copyExplicitSkillSelectionFileHost(selection, {
				...selection,
				path: remapExplicitSkillSelectionPath(selection, skillReferencePaths)
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
			...params.sessionKey ? { agentHarnessCompletionScope: createAgentHarnessCompletionScope({
				requesterSessionKey: params.sessionKey,
				requesterAgentId: workspaceResolution.agentId,
				gatewayContextResolver: getGatewayContextResolver(params.admittedRunContext)
			}) } : {},
			runtimePlan,
			observeToolTerminal: createToolTerminalObserver(params.runId),
			model: applyAuthHeaderOverride(applyLocalNoAuthHeaderOverride(effectiveModel, runtime.apiKeyInfo), runtime.runtimeAuthState !== null ? null : runtime.apiKeyInfo, params.config),
			resolvedApiKey: resolvedAttemptApiKey,
			authProfileId: runtime.lastProfileId,
			authProfileIdSource: params.authProfileBinding ? params.authProfileIdSource : explicitAuthProfile ? "user" : "auto",
			authProfileBinding: params.authProfileBinding,
			initialReplayState: input.replayState,
			authStorage,
			authProfileStore,
			toolAuthProfileStore,
			modelRegistry,
			agentId: workspaceResolution.agentId,
			thinkLevel: runtime.thinkLevel,
			thinkingExplicit: params.thinkingExplicit,
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
			onToolResult: params.onToolResult,
			onAgentToolResult: params.onAgentToolResult,
			onAgentEvent: async (event) => {
				await params.onAgentEvent?.(event);
			},
			deferTerminalLifecycle: params.deferTerminalLifecycle ?? params.deferTerminalLifecycleEnd,
			onDeferredLifecycleOwner: params.onDeferredLifecycleOwner,
			onDeferredLifecycleAbort: params.onDeferredLifecycleAbort,
			onExecutionPhase: params.onExecutionPhase,
			extraSystemPrompt,
			extraSystemPromptTurnContext: params.extraSystemPromptTurnContext,
			gitCoauthorPrompt,
			preparedTtsPreferences: params.preparedTtsPreferences,
			sourceReplyDeliveryMode: params.sourceReplyDeliveryMode,
			messageToolFinalByDefault: params.messageToolFinalByDefault,
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
			skillWorkshopReviewOf: params.skillWorkshopReviewOf,
			skillLibraryAuthoring: params.skillLibraryAuthoring,
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
			continuesConversation: params.continuesConversation,
			requireExplicitMessageTarget: params.requireExplicitMessageTarget,
			internalEvents: params.internalEvents,
			runtimeContextFragments: params.runtimeContextFragments,
			bootstrapPromptWarningSignaturesSeen: input.bootstrapPromptWarningSignaturesSeen,
			bootstrapPromptWarningSignature: input.bootstrapPromptWarningSignaturesSeen.at(-1),
			suppressNextUserMessagePersistence,
			beforeAgentFinalizeRevisionAttempts,
			completionCheck: terminalRetryState.completionCheck,
			maxBeforeAgentFinalizeRevisions: 3,
			suppressTranscriptOnlyAssistantPersistence: params.suppressTranscriptOnlyAssistantPersistence,
			assistantErrorTranscript: params.assistantErrorTranscript,
			onUserMessagePersisted: sessionPromptState.onUserMessagePersisted,
			onUserMessagePersistenceInvalidated: () => {
				sessionPromptState.activePrompt.persisted = false;
			},
			prepareAssistantTranscriptMessage: params.prepareAssistantTranscriptMessage
		};
		const rawAttempt = await withPreparedEmbeddedGatewayTools(attemptParams, () => {
			assertActiveRun();
			placement?.assertCurrent();
			return runEmbeddedAttemptWithBackend(attemptParams, nativeSessionRuntime, params.media);
		}).catch((err) => {
			throw input.getPostCompactionAbortError() ?? err;
		}).finally(() => {
			attemptControls.close();
			releaseMemoryAudience();
			input.clearPostCompactionAbortController(attemptAbortController);
		});
		const postCompactionAbortError = input.getPostCompactionAbortError();
		if (postCompactionAbortError) throw postCompactionAbortError;
		if (pluginWorkspace?.sandboxRuntime) rawAttempt.sandboxRuntime = pluginWorkspace.sandboxRuntime;
		return {
			dispatchedAttempt: {
				rawAttempt,
				preparedAttempt: attemptParams
			},
			runtimePlan,
			startupStagesEmitted: true
		};
	} catch (_) {
		_usingCtx$2.e = _;
	} finally {
		_usingCtx$2.d();
	}
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
		...committed ? { hostCompactionCommitted: true } : {},
		...compaction.session.committedCompactionTransitions.length ? { admissionTransitions: compaction.session.committedCompactionTransitions } : {},
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
			transcriptByteCompactionLatch: fact.hostCompactionCommitted ? null : void 0,
			authorize: () => compaction.authority !== void 0 && getAdmittedRunDelegatedAuthority(runtime.admittedRunContext) === compaction.authority
		});
	} catch (error) {
		log$3.warn(`compaction accounting failed: ${formatErrorMessage(error)}`);
	}
	if (params.isFinalFallbackAttempt !== false) await runInput.progressController.maybeEmitFastModeAutoResetBestEffort();
	if (ownedContextEngineLease) forgetPromptBuildDrainCacheForRun(params.runId);
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
/** Clamp an auth refresh deadline to a safe setTimeout delay. */
function clampRuntimeAuthRefreshDelayMs(params) {
	return resolveSafeTimeoutDelayMs(params.refreshAt - params.now, { minMs: params.minDelayMs });
}
/** Bound caller-owned exchanges; native OAuth owners retain durable refresh settlement. */
function createRuntimeAuthDeadline(params) {
	const authAbort = new AbortController();
	const authSignal = params.signal ? AbortSignal.any([params.signal, authAbort.signal]) : authAbort.signal;
	const timeoutMs = params.timeoutMs;
	const startupDeadline = timeoutMs < 2147e6 ? {
		kind: "bounded",
		deadlineAtMs: Date.now() + timeoutMs
	} : { kind: "unlimited" };
	const withAuthDeadline = (step, operation) => {
		const deadline = params.getDeadline?.() ?? startupDeadline;
		const remainingMs = deadline.kind === "bounded" ? deadline.deadlineAtMs - Date.now() : void 0;
		const expire = () => {
			const error = createAbortError(`${params.provider} ${step} timed out at the run deadline (${timeoutMs}ms). Check the provider's authentication service and retry the run.`);
			authAbort.abort(error);
			return error;
		};
		if (remainingMs !== void 0 && remainingMs <= 0) return Promise.reject(expire());
		return withTimeout(racePromiseWithAbortSignal(() => operation(authSignal), authSignal, () => createAbortError(`${params.provider} ${step} aborted; authentication capability is closed. Retry the run when authentication is available.`)), remainingMs ?? 0, { createError: expire });
	};
	return {
		run: withAuthDeadline,
		signal: authSignal,
		cancel: () => authAbort.abort()
	};
}
//#endregion
//#region src/agents/embedded-agent-runner/run/auth-controller.ts
function resolveUnavailableAuthReason(store, profileIds) {
	return resolveProfilesUnavailableReason({
		store,
		profileIds
	}) ?? "unknown";
}
/** Decides whether one automatic profile may bypass its current cooldown. */
function resolveEmbeddedAuthCooldownProbePolicy(params) {
	const autoProfileCandidates = params.profileCandidates.filter((candidate) => typeof candidate === "string" && candidate.length > 0 && candidate !== params.lockedProfileId);
	const allAutoProfilesInCooldown = autoProfileCandidates.length > 0 && autoProfileCandidates.every((candidate) => isProfileInCooldown(params.authStore, candidate, void 0, params.modelId));
	const unavailableReason = allAutoProfilesInCooldown ? resolveUnavailableAuthReason(params.authStore, autoProfileCandidates) : null;
	const probeProfileIds = /* @__PURE__ */ new Set();
	if (params.allowTransientCooldownProbe && allAutoProfilesInCooldown && shouldUseTransientCooldownProbeSlot(unavailableReason)) for (const candidate of autoProfileCandidates) {
		const candidateReason = resolveUnavailableAuthReason(params.authStore, [candidate]);
		if (shouldUseTransientCooldownProbeSlot(candidateReason)) probeProfileIds.add(candidate);
	}
	return {
		probeProfileIds,
		unavailableReason
	};
}
/** Shares one transient probe across the selected owner's initial and later candidates. */
function createEmbeddedAuthProfileAdmission(params) {
	const policy = resolveEmbeddedAuthCooldownProbePolicy(params);
	let probed = false;
	return (candidate) => {
		if (!candidate || !isProfileInCooldown(params.authStore, candidate, void 0, params.modelId)) return true;
		if (probed || !policy.probeProfileIds.has(candidate)) return false;
		probed = true;
		params.log.warn(`checking cooldowned auth profile for ${params.provider}/${params.modelId} due to ${policy.unavailableReason ?? "transient"} unavailability`);
		return true;
	};
}
/**
* Coordinates auth profile selection, runtime auth preparation/refresh, and
* profile failover for one embedded run. Runtime snapshots and auth refreshes
* share this state so profile rotation cannot leave either with stale credentials.
*/
function createEmbeddedRunAuthController(params) {
	const { state } = params;
	const { run: withAuthDeadline, signal: authSignal, cancel: cancelAuth } = createRuntimeAuthDeadline({
		provider: params.provider,
		timeoutMs: resolveAgentTimeoutMs({
			cfg: params.config,
			overrideMs: params.timeoutMs
		}),
		signal: params.signal,
		getDeadline: params.getDeadline
	});
	const assertAuthCurrent = () => {
		authSignal.throwIfAborted();
		params.assertCurrent?.();
		params.authProfileBinding?.assertCurrent();
	};
	const baseRuntimeModel = state.models.runtime;
	const baseEffectiveModel = state.models.effective;
	const applyPreparedRuntimeRequestOverrides = (model, preparedAuth) => {
		const runtimeModel = applyPreparedRuntimeAuthToModel(model, preparedAuth);
		if (runtimeModel === model) return;
		state.models.runtime = runtimeModel;
		state.models.effective = applyPreparedRuntimeAuthToModel(state.models.effective, preparedAuth);
	};
	const prepareRuntimeAuthForModel = (prepareParams) => withAuthDeadline("runtime auth exchange", async (signal) => {
		await params.authProfileBinding?.revalidate();
		assertAuthCurrent();
		const preparedAuth = await prepareProviderRuntimeAuth({
			assertCurrent: assertAuthCurrent,
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
				profileId: prepareParams.profileId,
				signal
			}
		});
		assertAuthCurrent();
		return protectPreparedProviderRuntimeAuth({
			provider: prepareParams.runtimeModel.provider,
			preparedAuth
		});
	});
	const clearRuntimeAuthRefreshTimer = () => {
		const runtimeAuthState = state.runtimeAuthState;
		if (!runtimeAuthState?.refreshTimer) return;
		clearTimeout(runtimeAuthState.refreshTimer);
		runtimeAuthState.refreshTimer = void 0;
	};
	const stopRuntimeAuthRefreshTimer = () => {
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
			const sourceApiKey = runtimeAuthState.sourceApiKey.trim();
			if (!sourceApiKey) throw new Error(`Runtime auth refresh requires a source credential.`);
			const runtimeModel = state.models.runtime;
			params.log.debug(`Refreshing runtime auth for ${runtimeModel.provider} (${reason})...`);
			const preparedAuth = await prepareRuntimeAuthForModel({
				runtimeModel,
				apiKey: sourceApiKey,
				authMode: runtimeAuthState.authMode,
				profileId: runtimeAuthState.profileId
			});
			if (!preparedAuth?.apiKey) throw new Error(`Provider "${runtimeModel.provider}" does not support runtime auth refresh.`);
			const activeRuntimeAuthState = state.runtimeAuthState;
			if (!activeRuntimeAuthState || activeRuntimeAuthState.generation !== refreshGeneration || activeRuntimeAuthState.profileId !== refreshProfileId || activeRuntimeAuthState.sourceApiKey.trim() !== sourceApiKey) {
				params.log.debug(`Ignoring stale runtime auth refresh for ${runtimeModel.provider}; auth state advanced before ${reason} refresh completed.`);
				return;
			}
			assertAuthCurrent();
			params.authStorage.setRuntimeApiKey(runtimeModel.provider, preparedAuth.apiKey);
			applyPreparedRuntimeRequestOverrides(runtimeModel, preparedAuth);
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
		if (!runtimeAuthState || state.runtimeAuthRefreshCancelled || authSignal.aborted) return;
		const runtimeModel = state.models.runtime;
		if (!runtimeAuthState.sourceApiKey.trim()) {
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
		const refresh = (reason) => {
			if (state.runtimeAuthRefreshCancelled || authSignal.aborted) return;
			refreshRuntimeAuth(reason).then(scheduleRuntimeAuthRefresh).catch(() => {
				if (reason === "scheduled-retry" || state.runtimeAuthRefreshCancelled || authSignal.aborted) return;
				const retryTimer = setTimeout(() => refresh("scheduled-retry"), RUNTIME_AUTH_REFRESH_RETRY_MS);
				const activeRuntimeAuthState = state.runtimeAuthState;
				if (activeRuntimeAuthState) activeRuntimeAuthState.refreshTimer = retryTimer;
			});
		};
		runtimeAuthState.refreshTimer = setTimeout(() => refresh("scheduled"), delayMs);
	};
	const resolveAuthProfileFailoverReason = (failoverParams) => {
		if (failoverParams.allInCooldown) {
			const profileIds = params.profileCandidates.filter((id) => typeof id === "string" && id.length > 0);
			return resolveUnavailableAuthReason(params.authStore, profileIds);
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
				modelId: params.modelId,
				retryAfterMs: resolveRetryAfterMs(errorText, Date.now(), error)
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
			message: messageForReason
		});
		const message = failoverParams.message?.trim() || (code === "selected_auth_profile_unavailable" ? messageForReason : void 0) || renderAuthProfileFailoverCopy({
			reason,
			provider,
			allInCooldown: failoverParams.allInCooldown,
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
	const applyApiKeyInfo = async (candidate, attemptIndex, forceRefresh = false) => {
		assertAuthCurrent();
		const preparedModel = await params.prepareModelForAuthProfile?.(candidate, attemptIndex);
		const apiKeyInfo = await withAuthDeadline("credential resolution", (signal) => {
			assertAuthCurrent();
			return getApiKeyForModelCore({
				model: preparedModel?.runtimeModel ?? state.models.runtime,
				cfg: params.config,
				profileId: candidate,
				store: params.authStore,
				agentDir: params.agentDir,
				workspaceDir: params.workspaceDir,
				lockedProfile: forceRefresh || candidate != null && candidate === params.lockedProfileId,
				forceRefresh,
				allowAuthProfileFallback: preparedModel?.allowAuthProfileFallback,
				secretSentinels: true,
				signal
			});
		});
		assertAuthCurrent();
		if (preparedModel?.authRequirement && !providerModelRouteAcceptsAuthMode({
			requirement: preparedModel.authRequirement,
			mode: apiKeyInfo.mode ?? (apiKeyInfo.apiKey ? "api-key" : void 0),
			authRequirement: resolveProviderModelAuthPolicy({
				provider: preparedModel.runtimeModel.provider,
				mode: apiKeyInfo.mode,
				authFlow: apiKeyInfo.authFlow,
				api: preparedModel.runtimeModel.api,
				baseUrl: preparedModel.runtimeModel.baseUrl
			}).authRequirement
		})) throw new Error(`Resolved ${apiKeyInfo.mode ?? "unknown"} credentials are incompatible with the selected ${preparedModel.authRequirement} route for ${preparedModel.runtimeModel.provider}.`);
		params.authProfileBinding?.assertCurrent();
		if (params.authProfileBinding && apiKeyInfo.profileId !== params.authProfileBinding.profileId) throw new Error("Resolved credentials do not belong to the automation inference owner.");
		state.apiKeyInfo = apiKeyInfo;
		const usesAwsSdkChain = !apiKeyInfo.apiKey && apiKeyInfo.mode === "aws-sdk";
		if (!apiKeyInfo.apiKey && !usesAwsSdkChain) {
			const runtimeModel = preparedModel?.runtimeModel ?? state.models.runtime;
			throw new MissingProviderAuthError(runtimeModel.provider, apiKeyInfo);
		}
		preparedModel?.commit();
		state.runtimeAuthRefreshCancelled = false;
		if (!preparedModel?.authRequirement) {
			state.models.runtime = baseRuntimeModel;
			state.models.effective = baseEffectiveModel;
		}
		const runtimeModel = state.models.runtime;
		const sourceApiKey = apiKeyInfo.apiKey || "__aws_sdk_auth__";
		const profileId = usesAwsSdkChain ? apiKeyInfo.profileId ?? candidate : apiKeyInfo.profileId;
		let runtimeAuthHandled = false;
		try {
			const preparedAuth = await prepareRuntimeAuthForModel({
				runtimeModel,
				apiKey: sourceApiKey,
				authMode: apiKeyInfo.mode,
				profileId: apiKeyInfo.profileId
			});
			applyPreparedRuntimeRequestOverrides(runtimeModel, preparedAuth);
			if (preparedAuth?.apiKey) {
				clearRuntimeAuthRefreshTimer();
				assertAuthCurrent();
				params.authStorage.setRuntimeApiKey(runtimeModel.provider, preparedAuth.apiKey);
				state.runtimeAuthState = {
					generation: (state.runtimeAuthState?.generation ?? 0) + 1,
					sourceApiKey,
					authMode: apiKeyInfo.mode,
					profileId,
					expiresAt: preparedAuth.expiresAt
				};
				if (preparedAuth.expiresAt) scheduleRuntimeAuthRefresh();
				runtimeAuthHandled = true;
			}
		} catch (error) {
			if (authSignal.aborted || params.authProfileBinding || !usesAwsSdkChain) throw error;
			params.log.warn(`prepareProviderRuntimeAuth failed for ${runtimeModel.provider}, falling back to sentinel: ${formatErrorMessage(error)}`);
		}
		if (!runtimeAuthHandled) {
			assertAuthCurrent();
			clearRuntimeAuthRefreshTimer();
			params.authStorage.setRuntimeApiKey(runtimeModel.provider, sourceApiKey);
			state.runtimeAuthState = null;
		}
		state.lastProfileId = profileId;
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
				if (authSignal.aborted || err instanceof SecretSurfaceUnavailableError) throw err;
				await recordOAuthRefreshFailure(candidate, err);
			}
		}
		state.profileIndex = params.profileCandidates.length;
		return false;
	};
	const initializeAuthProfile = async () => {
		try {
			const admitCandidate = createEmbeddedAuthProfileAdmission(params);
			while (state.profileIndex < params.profileCandidates.length) {
				if (!admitCandidate(params.profileCandidates[state.profileIndex])) {
					state.profileIndex += 1;
					continue;
				}
				await applyApiKeyInfo(params.profileCandidates[state.profileIndex], state.profileIndex);
				break;
			}
			if (state.profileIndex >= params.profileCandidates.length) throwAuthProfileFailover({ allInCooldown: true });
		} catch (err) {
			if (authSignal.aborted || err instanceof FailoverError || err instanceof SecretSurfaceUnavailableError) throw err;
			await recordOAuthRefreshFailure(params.profileCandidates[state.profileIndex], err);
			if (!await advanceAuthProfile()) throwAuthProfileFailover({
				allInCooldown: false,
				error: err
			});
		}
	};
	const maybeRefreshRuntimeAuthForAuthError = async (errorText, retried) => {
		if (retried || classifyFailoverReason(errorText, { provider: params.provider }) !== "auth") return false;
		try {
			if (state.runtimeAuthState) {
				await refreshRuntimeAuth("auth-error");
				scheduleRuntimeAuthRefresh();
			} else if (params.provider === "openai" && state.lastProfileId && state.apiKeyInfo?.mode === "oauth" && state.apiKeyInfo.authFlow === "chatgpt-token-sharing" && /\btoken_expired\b|\bauthentication token is expired\b/iu.test(errorText)) await applyApiKeyInfo(state.lastProfileId, state.profileIndex, true);
			else return false;
			return true;
		} catch (error) {
			if (authSignal.aborted) throw error;
			return false;
		}
	};
	return {
		close: () => {
			stopRuntimeAuthRefreshTimer();
			cancelAuth();
		},
		throwIfAborted: () => authSignal.throwIfAborted(),
		applyAuthProfileCandidate: applyApiKeyInfo,
		advanceAuthProfile,
		initializeAuthProfile,
		maybeRefreshRuntimeAuthForAuthError,
		stopRuntimeAuthRefreshTimer
	};
}
//#endregion
//#region src/agents/embedded-agent-runner/run/auth-plan.ts
async function prepareEmbeddedRunAuthPlan(params) {
	const runParams = params.runParams;
	runParams.authProfileBinding?.assertCurrent();
	const usesOpenAIAuthRouting = params.provider === OPENAI_PROVIDER_ID;
	const initialPluginHarnessOwnsTransport = params.getAgentHarness().id !== "openclaw";
	const openClawNativeCodexResponsesNeedsAuthBootstrap = !initialPluginHarnessOwnsTransport && usesOpenAIAuthRouting && params.getEffectiveModel().api === "openai-chatgpt-responses";
	const resolveExternalCliAuthScope = (store) => resolveExternalCliAuthOverlayScopeFromSelection({
		...params,
		cfg: runParams.config,
		agentId: runParams.agentId,
		...store ? { store } : {},
		userPinnedAuthProfileId: runParams.authProfileIdSource === "user" ? runParams.authProfileId : void 0
	});
	let externalCliAuthScope = initialPluginHarnessOwnsTransport ? { ignoreAutoPreferredProfile: false } : openClawNativeCodexResponsesNeedsAuthBootstrap ? {
		providerIds: [OPENAI_PROVIDER_ID],
		ignoreAutoPreferredProfile: false
	} : resolveExternalCliAuthScope();
	const authStoreOptions = {
		migrationProvider: params.provider,
		config: runParams.config,
		inheritedAuthDir: params.preparedModelRuntime?.inheritedAuthDir,
		profileId: runParams.authProfileId,
		allowKeychainPrompt: false
	};
	let noExternalAuthStore;
	if (!initialPluginHarnessOwnsTransport && !externalCliAuthScope.providerIds) {
		noExternalAuthStore = await ensureAuthProfileStoreWithoutExternalProfilesAsync(params.agentDir, authStoreOptions);
		externalCliAuthScope = resolveExternalCliAuthScope(noExternalAuthStore);
	}
	params.markStage?.("scope");
	const externalCliProviderIds = usesOpenAIAuthRouting ? [OPENAI_PROVIDER_ID] : initialPluginHarnessOwnsTransport ? void 0 : externalCliAuthScope.providerIds;
	const attemptAuthProfileStore = externalCliProviderIds ? await ensureAuthProfileStoreAsync(params.agentDir, {
		...authStoreOptions,
		externalCliProviderIds
	}) : noExternalAuthStore ?? await ensureAuthProfileStoreWithoutExternalProfilesAsync(params.agentDir, authStoreOptions);
	params.markStage?.("store");
	const requestedProfileId = runParams.authProfileId?.trim() || void 0;
	const lockedProfileId = runParams.authProfileBinding?.profileId ?? (runParams.authProfileIdSource === "user" ? requestedProfileId : void 0);
	const preferredProfileId = externalCliAuthScope.ignoreAutoPreferredProfile && !lockedProfileId ? void 0 : requestedProfileId;
	const createAuthPreparation = () => {
		const harness = params.getAgentHarness();
		if (params.nativeSessionRuntime?.auth === "native") {
			if (runParams.authProfileBinding) throw new Error("A native connection cannot replace the automation’s recorded inference account.");
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
		const prepared = prepareAgentRuntimeAuth({
			provider: params.provider,
			modelId: params.modelId,
			...params.observedRoutes ? { observedRoutes: params.observedRoutes } : {
				modelApi: params.model.api,
				modelBaseUrl: params.model.baseUrl
			},
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
			requiredAuthProfileId: runParams.authProfileBinding?.profileId,
			...runParams.authProfileBinding ? { routeIntent: {
				authRequirement: runParams.authProfileBinding.authRequirement,
				source: "explicit"
			} } : {},
			allowAuthProfileFallback: runParams.authProfileBinding ? false : runParams.allowAuthProfileFallback,
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
		if (runParams.trigger === "cron" && !runParams.authProfileBinding && !runParams.scheduledRuntimeAuthority && prepared.attempts.some(({ plan }) => {
			const source = plan.credentialSource;
			return source?.kind === "profile" || source?.kind === "direct" && !isConfiguredKeyAuthSource(source);
		})) {
			const refusal = /* @__PURE__ */ new Error("Automation has no recorded inference account. Explicitly select its account with a model@profile update before running it.");
			recordModelFallbackStop(refusal);
			throw refusal;
		}
		return prepared;
	};
	const providerUsesProfileScopedModelMetadata = providerUsesCredentialScopedModelMetadata({
		...params,
		config: runParams.config
	});
	const providerOwnsDynamicModelRefresh = providerOwnsDynamicModelPreparation({
		provider: params.provider,
		config: runParams.config,
		workspaceDir: params.workspaceDir
	});
	const { materialize: materializeAuthPlan, materializeUncached: materializeAuthPlanUncached } = createPreparedRuntimeModelMaterializer({
		...params,
		config: runParams.config,
		metadataSnapshot: params.preparedModelRuntime?.metadataSnapshot,
		getModel: params.getRuntimeModel,
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
	for (let preparation = 0;; preparation += 1) {
		params.applyResolvedRuntimeModel(await materializeAuthPlan(resolvedAuthPreparation.plan));
		if (preparation === 0) params.markStage?.("prepare-plan");
		const selectedHarness = params.selectHarnessForPreparedAttempts(params.getEffectiveModel(), resolvedAuthPreparation.attempts);
		if (selectedHarness.id === params.getAgentHarness().id) break;
		if (preparation > 0) throw new Error(`Prepared auth route did not converge on one agent harness for ${params.provider}/${params.modelId}.`);
		params.setAgentHarness(selectedHarness);
		resolvedAuthPreparation = createAuthPreparation();
	}
	params.markStage?.("harness");
	return {
		attemptAuthProfileStore,
		lockedProfileId,
		preferredProfileId,
		providerUsesProfileScopedModelMetadata,
		materializeAuthPlan,
		materializeAuthPlanUncached,
		preparedAuthAttempts: resolvedAuthPreparation.attempts,
		activePreparedAuthPlan: resolvedAuthPreparation.plan
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
	const { defaultParams, modelParams, agentModelParams, agentParams } = resolveModelExtraParamSources({
		config: params.runParams.config,
		provider: contextConfigProvider,
		modelId: params.modelId,
		agentId: params.runParams.agentId
	});
	const sources = [
		defaultParams,
		modelParams,
		agentModelParams,
		agentParams,
		Object.fromEntries(Object.entries(params.runParams.streamParams ?? {}).filter(([, value]) => value !== void 0)),
		...params.runParams.fastMode === void 0 ? [] : [{ fastMode: params.runParams.fastMode }]
	];
	const requestExtraParams = Object.assign({}, ...sources);
	requestExtraParams.serviceTier = resolveAliasedParamValue(sources, ["serviceTier", "service_tier"]);
	requestExtraParams.fastMode = resolveAliasedParamValue(sources, ["fastMode", "fast_mode"]);
	delete requestExtraParams.service_tier;
	delete requestExtraParams.fast_mode;
	const requestServiceTiers = params.nativeModelOwned || params.provider !== "openai" ? void 0 : resolveProviderPolicySurface(params.provider, { config: params.runParams.config })?.resolveServiceTiers?.({
		provider: params.provider,
		modelId: params.runtimeModel.id,
		api: params.runtimeModel.api,
		baseUrl: params.runtimeModel.baseUrl,
		runtimeId: params.agentHarnessId,
		params: requestExtraParams,
		requestCapabilities: getModelProviderRequestRouteFacts(params.runtimeModel)?.capabilities ?? resolveProviderRequestCapabilities({
			provider: params.provider,
			modelId: params.runtimeModel.id,
			api: params.runtimeModel.api,
			baseUrl: params.runtimeModel.baseUrl
		})
	});
	const resolved = resolveEmbeddedRuntimeModelPolicy({
		cfg: params.runParams.config,
		provider: params.provider,
		contextConfigProvider,
		modelId: params.modelId,
		runtimeModel: params.runtimeModel,
		nativeModelOwned: params.nativeModelOwned,
		requestExtraParams,
		requestServiceTiers,
		...params.runParams.contextWindow ? { contextWindow: params.runParams.contextWindow } : {},
		...params.runParams.contextTokenBudget === void 0 ? {} : { contextTokenBudget: params.runParams.contextTokenBudget }
	});
	const authoredContextTokenCap = params.pinnedHarnessId || params.agentHarnessId === "openclaw" ? void 0 : resolveAuthoredModelContextTokens({
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
function selectEmbeddedRunHarness(params) {
	const selection = {
		provider: params.provider,
		modelId: params.modelId,
		config: params.runParams.config,
		agentId: params.runParams.agentId,
		sessionKey: params.runParams.sessionKey,
		agentHarnessId: params.runParams.agentHarnessId,
		agentHarnessRuntimeOverride: params.runParams.agentHarnessRuntimeOverride
	};
	const selected = params.attempts !== void 0 ? selectAgentHarnessForPreparedModelProviders({
		...selection,
		modelProviders: params.attempts.map((attempt) => buildHarnessModelProvider({
			...params,
			plan: attempt.plan,
			preparedAuthAttempt: attempt
		}))
	}) : selectAgentHarness({
		...selection,
		modelProvider: buildHarnessModelProvider(params)
	});
	if (params.pinnedHarnessId && selected.id !== params.pinnedHarnessId) {
		const subject = params.attempts !== void 0 ? "Prepared auth routes" : "Prepared model route";
		throw new AgentHarnessPreflightError(`${subject} changed the session-pinned agent harness from "${params.pinnedHarnessId}" to "${selected.id}". Reattach the original native session or use a concrete model chat.`);
	}
	return selected;
}
//#endregion
//#region src/agents/embedded-agent-runner/run/model-setup.ts
async function prepareNativeSessionRuntime(runParams, harness, admission, assertCallerCurrent) {
	const pinnedHarnessId = resolveSessionPinnedHarnessId(admission?.entry);
	if (!admission || !pinnedHarnessId || !harness.resolveSessionRuntimeOwnershipAsync && !harness.resolveSessionRuntimeOwnership) return;
	const { sessionId, lifecycleRevision } = admission.entry;
	const ownershipChangedMessage = "Native model ownership changed during run preparation. Reattach the original native session before retrying.";
	const { sessionAgentId } = resolveSessionAgentIdsStrict({
		config: runParams.config,
		agentId: admission.agentId,
		sessionKey: admission.sessionKey
	});
	const readOwnership = async (admittedEntry) => {
		assertCallerCurrent();
		const publication = prepareSessionRowPublicationScope([admission.storePath, ...isIncognitoSessionKey(admission.sessionKey) ? [resolveIncognitoOpenClawAgentSqlitePath({ agentId: sessionAgentId })] : []]);
		const consume = async (current, assertReadCurrent) => {
			let changed = false;
			const assertCurrent = () => {
				assertCallerCurrent();
				runParams.abortSignal?.throwIfAborted();
				if (runParams.lifecycleGeneration) assertAgentRunLifecycleGenerationCurrent(runParams.lifecycleGeneration);
				try {
					assertReadCurrent();
				} catch (cause) {
					throw new AgentHarnessPreflightError(ownershipChangedMessage, { cause });
				}
				const expectedWriter = runParams.sessionTarget?.expectedWriterRunId;
				if (changed || getRegisteredAgentHarness(pinnedHarnessId)?.harness !== harness || current?.sessionId !== sessionId || current?.lifecycleRevision !== lifecycleRevision || resolveSessionPinnedHarnessId(current) !== pinnedHarnessId || expectedWriter !== void 0 && current?.activeWriterRunId !== expectedWriter) throw new AgentHarnessPreflightError(ownershipChangedMessage);
			};
			assertCurrent();
			const stop = sessionChanges.subscribeFacts((change) => {
				changed ||= sessionChangeAffectsStoredRow(change, {
					...publication,
					agentId: sessionAgentId,
					sessionKeys: [admission.sessionKey]
				});
			});
			try {
				return await readSessionRuntimeOwnershipAsync({
					config: runParams.config,
					agentId: admission.agentId,
					sessionKey: admission.sessionKey,
					storePath: admission.storePath,
					sessionEntry: current,
					assertCurrent,
					readPreparedPreviousSessionId: () => current?.previousSessionId
				});
			} finally {
				stop();
			}
		};
		if (admittedEntry) return await consume(admittedEntry, assertCallerCurrent);
		if (isIncognitoSessionKey(admission.sessionKey)) return await withSessionEntryReadOnlyInWorker(admission, assertCallerCurrent, async (read, owner) => {
			if (!read.ok) throw read.error;
			return consume(read.value, owner.assertCurrent);
		});
		const reader = getReplyOperationSessionReader(runParams.replyOperation);
		if (reader) {
			publication.prepareSource(reader.database, readDatabasePathIdentitySync(reader.database.path));
			const prepared = await reader.withRead({
				sessionKeys: [admission.sessionKey],
				snapshotFields: []
			}, assertCallerCurrent, (read) => ({
				entry: read.entries.find((row) => row.sessionKey === admission.sessionKey)?.entry,
				assertNativeCurrent: captureSessionEntryNativeMutationWitness([reader.database])
			}));
			return await consume(prepared.entry, () => {
				reader.assertCurrent();
				prepared.assertNativeCurrent();
			});
		}
		return await withSessionEntriesFromStoreInWorker({
			agentId: sessionAgentId,
			sessionKeys: [admission.sessionKey],
			storePath: admission.storePath,
			includeAuthorization: true,
			snapshotFields: []
		}, (read) => consume(read.result.entries.find((item) => item.sessionKey === admission.sessionKey)?.entry, read.assertCurrent), false, (...source) => publication.prepareSource(...source));
	};
	const expectedWriter = runParams.sessionTarget?.expectedWriterRunId;
	const ownership = await readOwnership(expectedWriter === void 0 || admission.entry.activeWriterRunId === expectedWriter ? admission.entry : void 0);
	if (!ownership) throw new AgentHarnessPreflightError("The pinned runtime's native session ownership is unavailable. Reattach the original native session instead of starting a replacement model run.");
	const operatorAuthority = readRunOperatorAuthority(runParams);
	assertOperatorModelAllowed(operatorAuthority, ownership.modelRef);
	if (ownership.auth === "host" && !ownership.modelRef) throw new AgentHarnessPreflightError("The native session's model and provider are unavailable for host authentication. Reattach the original native session before retrying.");
	let currentOwnership = ownership;
	return {
		harness,
		...ownership.auth === "host" ? {
			auth: "host",
			modelRef: ownership.modelRef
		} : {
			auth: "native",
			get modelRef() {
				return currentOwnership.modelRef;
			}
		},
		assertCurrent: async () => {
			const current = await readOwnership();
			assertOperatorModelAllowed(operatorAuthority, current?.modelRef);
			if (current?.model !== ownership.model || current.auth !== ownership.auth || ownership.auth === "host" && (current.modelRef?.provider !== ownership.modelRef?.provider || current.modelRef?.model !== ownership.modelRef?.model)) throw new AgentHarnessPreflightError("Native model ownership changed before agent harness dispatch. Reattach the original native session before retrying.");
			currentOwnership = current;
		}
	};
}
async function resolveEmbeddedRunModelSetup(params) {
	const runParams = params.runParams;
	const operatorAuthority = readRunOperatorAuthority(runParams);
	const hookSelection = runParams.resolvedModelSelection ?? await resolveHookModelSelection({
		prompt: runParams.prompt,
		awaitSessionDiffBaseline: runParams.awaitSessionDiffBaseline,
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
	const nativeSessionRuntime = pinnedHarness ? await prepareNativeSessionRuntime(runParams, pinnedHarness, params.sessionAdmission, params.assertCurrent) : void 0;
	if (nativeSessionRuntime?.auth === "host") {
		provider = nativeSessionRuntime.modelRef.provider;
		modelId = nativeSessionRuntime.modelRef.model;
	}
	if (operatorAuthority?.modelPolicy && !nativeSessionRuntime) {
		const selected = resolveModelCandidateChain({
			cfg: runParams.config,
			agentId: runParams.agentId,
			provider,
			model: modelId,
			requestedRouteResolution: modelSelectionChangedByHook ? "raw" : runParams.requestedRouteResolution,
			fallbacksOverride: [],
			manifestPlugins: params.preparedModelRuntime?.metadataSnapshot
		})[0];
		assertOperatorModelAllowed(operatorAuthority, selected);
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
	const nativePermissionsConsented = await assertAgentHarnessExecutionEnvironment(agentHarness, runParams);
	if (agentHarness.executionEnvironment === "host-only" && !nativePermissionsConsented) assertPluginHarnessConversationToolPolicySupport(agentHarness, await prepareAgentHarnessNativeToolPolicyRestricted({
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
	const hasSelectedNativeModel = () => catalog?.entries.some(ownsSelectedNativeModel) === true || catalog?.routeVariants.some(ownsSelectedNativeModel) === true;
	if (!nativeSessionRuntime && pluginHarnessOwnsTransport && agentHarness.loadModelCatalog && params.preparedModelRuntime?.loadNativeModelCatalog && !hasSelectedNativeModel()) {
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
		params.assertCurrent();
	}
	const nativeModelOwned = nativeSessionRuntime !== void 0 || pluginHarnessOwnsTransport && hasSelectedNativeModel();
	const modelConfigProvider = provider;
	let modelResolution;
	let observedRoutes;
	if (nativeModelOwned) {
		modelResolution = {
			model: createNativeModelOwnedRuntimeModel({
				provider,
				modelId
			}),
			...createEmptyAgentDiscoveryStores()
		};
		const generation = getPreparedModelRuntimePluginGeneration();
		const borrowedSnapshot = generation ? getPreparedModelRuntimeBorrowedSnapshot(generation) : void 0;
		const routeCatalog = (borrowedSnapshot && borrowedSnapshot.modelCatalog === params.preparedModelRuntime?.modelCatalog ? readAdmittedPublishedModelCatalog(borrowedSnapshot) : void 0) ?? catalog;
		const routeVariants = routeCatalog && createModelCatalogSnapshotView(runParams.config ?? {}, routeCatalog).variantsOf({
			provider,
			id: modelId
		});
		observedRoutes = routeVariants ? listModelCatalogObservedRoutes(routeVariants) : void 0;
	} else {
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
		provider = tieredResolution.provider;
		modelResolution = tieredResolution.resolution;
		if (modelResolution.model) modelId = modelResolution.logicalRef.model;
	}
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
	if (!nativeSessionRuntime) assertOperatorModelAllowed(operatorAuthority, {
		provider,
		model: modelId
	});
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
		observedRoutes,
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
	const modelSetup = await resolveEmbeddedRunModelSetup({
		assertCurrent: input.assertCurrent,
		runParams: params,
		sessionAdmission: input.sessionAdmission,
		provider: input.provider,
		modelId: input.modelId,
		agentDir: input.agentDir,
		workspaceDir: input.workspaceDir,
		globalLane: input.globalLane,
		hookRunner: input.hookRunner,
		hookContext: input.hookContext,
		onHooksResolved: () => input.markStartupStage("hooks"),
		preparedModelRuntime: input.preparedModelRuntime
	});
	const pluginMetadataSnapshot = input.preparedModelRuntime?.metadataSnapshot;
	const { provider, modelId, requestedModelId, modelSelectionChangedByHook, requestStreamTransportOverrides, expectedHarnessArtifact, pinnedHarnessId, nativeModelOwned, observedRoutes, nativeSessionRuntime, modelConfigProvider, model, authStorage, modelRegistry } = modelSetup;
	let agentHarness = modelSetup.agentHarness;
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
	let resolvedRuntimeModel = resolveEffectiveModel(model);
	const models = {
		runtime: model,
		effective: resolvedRuntimeModel.effectiveModel
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
		resolvedRuntimeModel = resolvedModel === candidate && resolvedCandidate ? resolvedCandidate : resolveEffectiveModel(resolvedModel);
		models.runtime = resolvedModel;
		models.effective = resolvedRuntimeModel.effectiveModel;
	};
	const selectHarness = (candidate, attempts) => nativeSessionRuntime?.auth === "native" ? nativeSessionRuntime.harness : selectEmbeddedRunHarness({
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
	agentHarness = selectHarness(models.effective);
	let pluginHarnessOwnsTransport = agentHarness.id !== "openclaw";
	const authStages = log$3.isEnabled("trace") ? createStageTimingTracker(Date.now) : void 0;
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
		observedRoutes,
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
		selectHarnessForPreparedAttempts: selectHarness,
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
		if (selectHarness(nextResolvedModel.effectiveModel, preparedAuthAttempts).id !== agentHarness.id) throw new Error(`Prepared auth retry changed the selected agent harness for ${provider}/${modelId}.`);
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
		authProfileBinding: params.authProfileBinding,
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
		assertCurrent: input.assertCurrent,
		signal: params.abortSignal,
		timeoutMs: params.timeoutMs,
		getDeadline: input.getAuthDeadline,
		...prepareModelForAuthProfile ? { prepareModelForAuthProfile } : {},
		log: log$3
	});
	try {
		authStages?.mark("controller");
		const admitAuthProfile = createEmbeddedAuthProfileAdmission({
			authStore: attemptAuthProfileStore,
			profileCandidates,
			lockedProfileId,
			modelId,
			provider,
			log: log$3,
			allowTransientCooldownProbe: params.allowTransientCooldownProbe === true
		});
		const advancePluginHarnessAuthAttempt = async () => {
			if (!pluginHarnessOwnsTransport) return false;
			let nextIndex = authState.profileIndex + 1;
			while (nextIndex < preparedAuthAttempts.length) {
				const candidateIndex = nextIndex++;
				const candidateAttempt = preparedAuthAttempts[candidateIndex];
				authState.profileIndex = candidateIndex;
				if (!candidateAttempt) continue;
				const candidate = candidateAttempt.profileId;
				if (!admitAuthProfile(candidate)) continue;
				if (!canRunPreparedAgentRuntimeAuthAttempt({
					attempt: candidateAttempt,
					priorProfileAttempted: preparedProfileAttempted
				})) {
					authState.profileIndex = preparedAuthAttempts.length;
					return false;
				}
				if (candidateAttempt.plan.modelRoute?.authRequirement === "api-key") try {
					await authController.applyAuthProfileCandidate(candidate, candidateIndex);
				} catch {
					input.assertCurrent();
					authController.throwIfAborted();
					continue;
				}
				else {
					if (!candidate || candidateAttempt.plan.forwardedAuthProfileId !== candidate) continue;
					const prepared = await prepareAuthAttempt(candidateAttempt);
					authController.stopRuntimeAuthRefreshTimer();
					authState.apiKeyInfo = null;
					authState.runtimeAuthState = null;
					prepared.commit();
					authState.lastProfileId = candidate;
				}
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
			if (!admitAuthProfile(initialAttempt?.kind === "profile" ? initialAttempt.profileId : void 0)) {
				if (!await advancePluginHarnessAuthAttempt()) throw new Error(`Prepared auth profiles are temporarily unavailable for ${provider}/${modelId}.`);
			} else {
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
			stopRuntimeAuthRefreshTimer: authController.close,
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
				contextTokenBudget: resolvedRuntimeModel.contextTokenBudget,
				authoredContextTokenCap: resolvedRuntimeModel.authoredContextTokenCap,
				contextWindowInfo: resolvedRuntimeModel.contextWindowInfo,
				outerContextTokenMeta: {
					contextTokens: resolvedRuntimeModel.contextTokenBudget,
					contextTokensSource: resolvedRuntimeModel.contextTokensSource
				},
				activePreparedAuthPlan: authState.apiKeyInfo ? {
					...activePreparedAuthPlan,
					selectedAuthMode: authState.apiKeyInfo.mode,
					selectedAuthFlow: authState.apiKeyInfo.authFlow
				} : activePreparedAuthPlan,
				thinkLevel: authState.thinkLevel,
				apiKeyInfo: authState.apiKeyInfo,
				lastProfileId: authState.lastProfileId,
				runtimeAuthState: authState.runtimeAuthState,
				pluginMetadataSnapshot,
				providerRuntimeHandle
			})
		};
	} catch (error) {
		authController.close();
		throw error;
	}
}
//#endregion
//#region src/agents/embedded-agent-runner/run/session-prompt-state.ts
const CONTINUATION_PROMPT = "Continue the current task from the existing transcript, preserving completed work and the user's constraints. Use recorded tool results to determine what completed. Before retrying an action with an unknown outcome, inspect its state. If the recorded results already satisfy the remaining request, report them without additional tool calls. Do not restart the task or repeat completed actions.";
async function createEmbeddedRunSessionPromptState(input) {
	const { runParams: params, sessionAgentId, resolvedSessionKey, lifecycleGeneration } = input;
	let activeSessionId = params.sessionId;
	let activeSessionFile = params.sessionFile;
	let activeSessionTarget = await buildContextEngineCompactionSessionTarget({
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
	const committedCompactionTransitions = [];
	let settleOwnedTranscriptProjection = false;
	let suppressNextUserMessagePersistence = params.suppressNextUserMessagePersistence ?? false;
	let basePromptOverride;
	let continuation;
	let compactionContinuationInstruction;
	const activePrompt = {
		get override() {
			const instruction = compactionContinuationInstruction;
			return instruction && basePromptOverride?.trim() ? `${basePromptOverride}\n\n${instruction}` : instruction ?? basePromptOverride;
		},
		persisted: suppressNextUserMessagePersistence,
		internal: false
	};
	const notifySessionIdChanged = (previousSessionId) => {
		registerAgentRunContext(params.runId, {
			sessionId: activeSessionId,
			lifecycleGeneration
		});
		adoptExecRequestSession({
			runId: params.runId,
			previousSessionId,
			sessionId: activeSessionId
		});
		params.replyOperation?.updateSessionId(activeSessionId);
		params.onSessionIdChanged?.(activeSessionId);
	};
	const adoptSessionId = (nextSessionId) => {
		if (!nextSessionId || nextSessionId === activeSessionId) return;
		const previousSessionId = activeSessionId;
		activeSessionId = nextSessionId;
		notifySessionIdChanged(previousSessionId);
	};
	const capturePreparedCompactionTarget = (target) => {
		activeSessionId = target.sessionId;
		activeSessionFile = target.sessionFile;
		activeSessionTarget = target.sessionTarget;
		sessionTargetAdopted = true;
	};
	const recordCommittedCompactionSuccessor = (accepted) => {
		if (accepted.admissionTransition && committedCompactionSuccessor !== accepted) committedCompactionTransitions.push(accepted.admissionTransition);
		committedCompactionSuccessor = accepted;
		capturePreparedCompactionTarget(accepted);
	};
	const notifyCompactionSessionAdopted = (previousSessionId) => {
		if (previousSessionId && previousSessionId !== activeSessionId) notifySessionIdChanged(previousSessionId);
	};
	const activateInternalPrompt = (prompt) => {
		basePromptOverride = prompt;
		Object.assign(activePrompt, {
			persisted: true,
			internal: true
		});
		suppressNextUserMessagePersistence = true;
	};
	const dispatchedFallback = params.modelRoutingProvenance?.stage === "fallback" && params.userTurnTranscriptRecorder !== void 0 && getUserTurnTranscriptAdmissionOwner(params.userTurnTranscriptRecorder)?.sentToProvider() === true;
	if (params.pluginRuntimeRefreshContinuation || dispatchedFallback) activateInternalPrompt(params.prompt);
	const activateCompactionContinuation = (instruction) => {
		compactionContinuationInstruction = instruction;
		activateInternalPrompt(basePromptOverride ?? "");
	};
	const clearCompactionContinuation = () => compactionContinuationInstruction = void 0;
	const onUserMessagePersisted = (message) => {
		if (activePrompt.internal) clearCompactionContinuation();
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
		get committedCompactionTransitions() {
			return Object.freeze([...committedCompactionTransitions]);
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
		recordOutputLimitNotice: async (toolCallId) => {
			const note = {
				role: "custom",
				customType: "incomplete-tool-call",
				content: (toolCallId ? `Runtime notice: The tool call ${JSON.stringify(toolCallId.slice(0, 200))} was cut off at the provider's output limit (max_output_tokens) and was not executed. Split the remaining work into smaller tool calls with shorter arguments only if the original request allows continuing that work. ` : "Runtime notice: The model response reached the provider's output limit (max_output_tokens) before producing an answer. Continue with a shorter response and smaller tool calls only if the original request allows continuing that work. ") + "Use recorded tool results to determine what completed, and do not repeat completed actions. Inspect state only for actions whose outcomes are unknown.",
				display: false,
				details: {
					reason: "max_output_tokens",
					...toolCallId ? { toolCallId } : {}
				},
				timestamp: Date.now()
			};
			if (params.sessionManager) await params.sessionManager.appendMessageAsync(note);
			else {
				const target = activeSessionTarget;
				if (!target?.agentId || !target.sessionId || !target.sessionKey || !target.storePath) throw new Error("Missing session transcript target for output-limit recovery");
				await appendSessionTranscriptNote({
					...target,
					agentId: target.agentId,
					sessionId: target.sessionId,
					sessionKey: target.sessionKey,
					storePath: target.storePath,
					...existingWriterFence ?? initialWriter?.committedFence
				}, note, { config: params.config });
			}
		},
		get activePrompt() {
			return activePrompt;
		},
		get continuation() {
			return continuation;
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
			if (params.modelRun === true || params.promptMode === "none") return;
			if (options?.messages) continuation = {
				prompt: params.prompt,
				messages: [...continuation?.messages ?? [], ...options.messages]
			};
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
function resolveEmbeddedRunFailureSignal(params) {
	if (params.trigger !== "cron") return;
	const lastToolError = params.lastToolError;
	if (!lastToolError || !isExecLikeToolName(lastToolError.toolName)) return;
	const code = normalizeOptionalString(lastToolError.errorCode);
	if (code !== "SYSTEM_RUN_DENIED" && code !== "INVALID_REQUEST") return;
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
	const replyDeliveryState = resolveSourceReplyDelivery(attempt, input.replyDeliveryState);
	const sourceReplyDeliveryState = resolveSourceReplyDelivery(attempt, input.sourceReplyDeliveryState ?? input.replyDeliveryState);
	const { timedOutDuringCompaction, timedOutDuringToolExecution } = projectAgentRunAttemptTerminal(attempt.terminal);
	const timedOutDuringPrompt = isEmbeddedRunTerminalTimeout(input.terminalState.outcome) && !timedOutDuringCompaction && !timedOutDuringToolExecution;
	const timeoutFinal = isEmbeddedRunTimeoutFinal(attempt);
	const terminalAssistant = input.currentAttemptCompletedAssistant;
	const usageMeta = buildUsageAgentMetaFields({
		usageAccumulator: input.usageAccumulator,
		latestUsage: normalizeAssistantUsageForContext(terminalAssistant),
		lastRunPromptUsage: input.lastRunPromptUsage
	});
	const attributionAssistant = terminalAssistant ?? attempt.currentAttemptAssistant;
	const requestedModelRef = {
		provider: input.provider,
		model: input.model
	};
	const reportedModelRef = resolveReportedModelRef({
		...attempt.runtimeModelSelection ?? requestedModelRef,
		assistant: attributionAssistant
	});
	const responseModel = attributionAssistant?.responseModel?.trim() || reportedModelRef.model;
	const effectiveModelRef = {
		...reportedModelRef,
		responseModel
	};
	const answerAssistant = attempt.keptAnswer?.assistant ?? terminalAssistant;
	const finalAssistantStopReason = (answerAssistant?.stopReason ?? "").trim().toLowerCase();
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
	const outerContextTokensSource = reportedModelRef.provider === input.provider && reportedModelRef.model === input.model ? input.outerContextTokenMeta.contextTokensSource ?? "resolved" : "resolved";
	const agentMeta = {
		sessionId: input.sessionIdUsed,
		sessionFile: input.sessionFileUsed,
		provider: reportedModelRef.provider,
		model: reportedModelRef.model,
		contextTokens,
		...contextTokens !== void 0 ? { contextTokensSource: attempt.contextTokens !== void 0 ? attempt.contextTokensSource ?? "resolved" : outerContextTokensSource } : {},
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
	const attemptFinalText = answerAssistant ? void 0 : attempt.assistantTexts.map((text) => sanitizeAssistantVisibleStreamText(text)).findLast((text) => text.trim().length > 0)?.trim();
	const finalAssistantVisibleText = terminalAssistantCanOwnFinalText ? resolveFinalAssistantVisibleText(answerAssistant) ?? attemptFinalText : void 0;
	const finalAssistantRawText = terminalAssistantCanOwnFinalText ? resolveFinalAssistantRawText(answerAssistant) ?? attemptFinalText : void 0;
	const latestModelMessage = attempt.currentAttemptAssistant ?? terminalAssistant;
	const finalAssistantMessageRawText = latestModelMessage ? resolveFinalMessageRawText(latestModelMessage) ?? "" : void 0;
	const terminalTurnId = attempt.terminalTurnId;
	Object.assign(agentMeta, { terminalReceipt: {
		runId: runParams.runId,
		sessionId: input.sessionIdUsed,
		turnId: terminalTurnId?.trim() || runParams.runId,
		requested: requestedModelRef,
		effective: effectiveModelRef,
		successfulToolNames: resolveSuccessfulToolNames(attempt),
		assistantTranscriptIdempotencyKey: attempt.assistantTranscriptIdempotencyKey,
		sourceReplyDelivered: replyDeliveryState === "delivered" ? true : void 0,
		rerouted: isProviderModelRerouted(requestedModelRef, effectiveModelRef, runParams.config)
	} });
	const cleanYield = attempt.yieldDetected && input.terminalState.outcome.status === "ok";
	const payloadAssistant = cleanYield ? void 0 : attempt.yieldDetected ? attempt.lastAssistant : input.currentAttemptCompletedAssistant;
	const payloads = buildEmbeddedRunPayloads({
		rateLimitRetriesExhausted: input.rateLimitRetriesExhausted,
		...attempt,
		assistantMessageIndex: attempt.lastAssistantTextMessageIndex,
		lastAssistant: payloadAssistant,
		currentAssistant: attempt.yieldDetected ? null : payloadAssistant ?? null,
		lastToolError: cleanYield ? void 0 : attempt.lastToolError,
		config: runParams.config,
		isCronTrigger: runParams.trigger === "cron",
		isHeartbeatTrigger: runParams.trigger === "heartbeat" && !runParams.continuesConversation,
		sessionKey: runParams.sessionKey ?? runParams.sessionId,
		provider: input.activeErrorContext.provider,
		providerOwner: input.providerOwner,
		model: input.activeErrorContext.model,
		authMode: input.authProfileId ? input.authProfileStore.profiles?.[input.authProfileId]?.type : void 0,
		verboseLevel: runParams.verboseLevel,
		reasoningLevel: runParams.reasoningLevel,
		thinkingLevel: runParams.thinkLevel,
		toolResultFormat: input.resolvedToolResultFormat,
		didDeliverSourceReplyViaMessageTool: sourceReplyDeliveryState === "delivered",
		sourceReplyDeliveryState,
		sourceReplyDeliveryMode: runParams.sourceReplyDeliveryMode,
		agentId: runParams.agentId,
		runId: runParams.runId,
		runAborted: isEmbeddedRunTerminalInterrupted(input.terminalState.outcome) && !(timedOutDuringPrompt && timeoutFinal),
		runStopReason: input.terminalState.outcome.stopReason,
		deferAssistantTimeoutError: timedOutDuringPrompt && (!hasMessagingToolDeliveryEvidence(attempt) || timeoutFinal)
	}).map((payload) => applyPreparedReplyMedia(payload, attempt.preparedReplyMedia ?? []));
	const mergeToolMedia = input.mergeToolMedia ?? mergeAttemptToolMediaPayloads;
	const payloadsWithToolMedia = sourceReplyDeliveryState === "pending" ? payloads : mergeToolMedia({
		payloads,
		toolMediaUrls: attempt.toolMediaUrls,
		hostOwnedToolMediaUrls: attempt.hostOwnedToolMediaUrls,
		toolAutoDeliveryMediaUrls: getCoreTtsAttemptResultMediaUrls(attempt, attempt.toolMediaUrls, runParams.admittedRunContext?.operationalRunInstance),
		toolAudioAsVoice: attempt.toolAudioAsVoice,
		toolTrustedLocalMedia: attempt.toolTrustedLocalMedia,
		sourceReplyDeliveryMode: runParams.sourceReplyDeliveryMode
	}, runParams.admittedRunContext?.operationalRunInstance);
	const recoveredFinalAssistantTextAfterPromptTimeout = sourceReplyDeliveryState === "missing" && timedOutDuringPrompt && !timeoutFinal && [
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
	return {
		agentMeta,
		replyDeliveryState,
		reportedModelRef,
		finalAssistantVisibleText,
		finalAssistantRawText,
		finalAssistantMessageRawText,
		payloads,
		payloadsWithToolMedia,
		timedOutDuringPrompt,
		recoveredFinalAssistantPayloadsAfterPromptTimeout,
		hasSuccessfulFinalAssistantAfterPromptTimeout: timedOutDuringPrompt && Boolean(payloadAlreadyContainsRecoveredFinalAssistant || recoveredFinalAssistantPayloadsAfterPromptTimeout?.length),
		hasPartialAssistantTextAfterPromptTimeout: timedOutDuringPrompt && (attempt.assistantTexts ?? []).some((text) => text.trim().length > 0) && !attempt.clientToolCalls && !attempt.yieldDetected && !attempt.didSendViaMessagingTool && !attempt.didSendDeterministicApprovalPrompt && !attempt.lastToolError && (attempt.toolMetas?.length ?? 0) === 0,
		attemptToolSummary: buildTraceToolSummary(attempt),
		failureSignal: resolveEmbeddedRunFailureSignal({
			trigger: runParams.trigger,
			lastToolError: attempt.lastToolError
		}),
		terminalToolFailure: resolveEmbeddedRunTerminalToolFailure({
			trigger: runParams.trigger,
			codeModeEngaged: attempt.codeModeEngaged,
			lastToolError: attempt.lastToolError
		})
	};
}
function replacePartialAssistantPayload(input) {
	const payloads = input.payloads ? [...input.payloads] : [];
	const assistantTextSignatures = new Set((input.assistantTexts ?? []).map((text) => text.trim()).filter((text) => text.length > 0));
	const partialPayloadIndex = payloads.findLastIndex((payload) => payload.isError !== true && payload.isReasoning !== true && typeof payload.text === "string" && assistantTextSignatures.has(payload.text.trim()));
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
	const bookkeeping = markAuthProfileSuccess({
		store: input.profileStore,
		provider: successProvider,
		modelId: input.modelId,
		profileId: successProfileId,
		agentDir: input.agentDir
	}).then(() => {
		const durationMs = Date.now() - successStarted;
		if (durationMs >= POST_RUN_AUTH_PROFILE_SUCCESS_SLOW_MS) log$3.warn(`post-run auth-profile success bookkeeping completed after ${durationMs}ms: runId=${input.runId} sessionId=${input.sessionId} provider=${sanitizeForLog(successProvider)} profileId=${safeSuccessProfileId}`);
		else if (log$3.isEnabled("trace")) log$3.trace(`post-run auth-profile success bookkeeping completed: runId=${input.runId} sessionId=${input.sessionId} durationMs=${durationMs}`);
	}).catch((error) => {
		log$3.warn(`post-run auth-profile success bookkeeping failed: runId=${input.runId} sessionId=${input.sessionId} provider=${sanitizeForLog(successProvider)} profileId=${safeSuccessProfileId} error=${formatErrorMessage(error)}`);
	});
	getOpenClawDatabaseMaintenanceScope()?.track(bookkeeping);
}
function reportEmbeddedRunSuccessfulAuthBinding(input) {
	const credential = input.profileId ? input.profileStore.profiles[input.profileId] : void 0;
	const pluginHarnessApiKeyInfo = resolvePluginHarnessApiKeyInfo(input);
	const authFingerprint = credential && input.profileId && credential.type !== "oauth" && input.pluginHarnessOwnsAuthBootstrap ? input.attempt.authBindingFingerprint : credential && input.profileId && (credential.type === "oauth" || input.pluginHarnessOwnsTransport) ? fingerprintResolvedAuthProfileCredential({
		profileId: input.profileId,
		credential,
		resolvedAuth: credential.type === "oauth" ? input.apiKeyInfo : pluginHarnessApiKeyInfo
	}) : fingerprintResolvedProviderAuth(input.apiKeyInfo);
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
	const runtimeOwnerKind = runtimeOwnerFingerprint && input.apiKeyInfo?.mode === "aws-sdk" ? "aws-sdk" : input.pluginHarnessOwnsTransport ? "plugin-harness" : void 0;
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
	if (!input.pluginHarnessOwnsAuthBootstrap || input.apiKeyInfo && !resolvedReferencedApiKey || hasInlineCredentialMaterial(credential) || !isStringOption(input.modelApi, MODEL_APIS)) return;
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
	const { runParams, attempt, retryState, sessionPromptState } = input;
	const runLogContext = `runId=${runParams.runId} sessionId=${runParams.sessionId}`;
	const modelLogContext = `${runLogContext} provider=${input.activeErrorContext.provider}/${input.activeErrorContext.model}`;
	const { externalAbort, promptError } = projectAgentRunAttemptTerminal(attempt.terminal);
	const terminalAborted = isEmbeddedRunTerminalAbort(input.terminalState.outcome);
	const terminalTimedOut = isEmbeddedRunTerminalTimeout(input.terminalState.outcome);
	const terminalInterrupted = isEmbeddedRunTerminalInterrupted(input.terminalState.outcome);
	const { signalOwnedInterruption } = input.terminalState;
	const silentToolResultReplyPayload = resolveSilentToolResultReplyPayload({
		isCronTrigger: runParams.trigger === "cron",
		payloadCount: input.prepared.payloadsWithToolMedia?.length ?? 0,
		aborted: terminalAborted,
		timedOut: terminalTimedOut,
		attempt
	});
	const payloadsForTerminalPath = input.prepared.recoveredFinalAssistantPayloadsAfterPromptTimeout ? input.prepared.recoveredFinalAssistantPayloadsAfterPromptTimeout : input.prepared.payloadsWithToolMedia?.length ? input.prepared.payloadsWithToolMedia : silentToolResultReplyPayload ? [silentToolResultReplyPayload] : input.prepared.payloadsWithToolMedia;
	const payloadCount = payloadsForTerminalPath?.length ?? 0;
	const terminalFacts = {
		payloadCount,
		aborted: terminalAborted,
		timedOut: terminalTimedOut,
		attempt
	};
	const intentionalTerminalCompletion = !terminalAborted && !terminalTimedOut && resolveSettledToolBatchEvidence(attempt).intentionalTermination;
	const settledTurnFinalizationAttempted = input.settledTurnFinalizationOutcome !== "not-attempted";
	const emptyAssistantReplyIsSilent = shouldTreatEmptyAssistantReplyAsSilent({
		terminalReplyExpectation: input.settledTurnFinalizationOutcome === "silent-fallback" ? "optional" : resolveReplyExpectation(runParams),
		...terminalFacts
	});
	const replyRecoverySuppressed = emptyAssistantReplyIsSilent || resolveSourceReplyDelivery(attempt, input.prepared.replyDeliveryState) !== "missing";
	const retryInput = {
		provider: input.activeErrorContext.provider,
		modelId: input.activeErrorContext.model,
		modelApi: input.modelApi,
		executionContract: input.executionContract,
		...terminalFacts
	};
	const replyRecoveryAllowed = !replyRecoverySuppressed && !settledTurnFinalizationAttempted;
	const nextReasoningOnlyRetryInstruction = replyRecoveryAllowed ? resolveReasoningOnlyRetryInstruction(retryInput) : null;
	const nextEmptyResponseRetryInstruction = replyRecoveryAllowed ? resolveEmptyResponseRetryInstruction(retryInput) : null;
	const emptyResponseRetryCounter = attempt.textToolCallAttempt ? "textToolCallAttempts" : "emptyResponseAttempts";
	if (nextReasoningOnlyRetryInstruction && retryState.reasoningOnlyAttempts < 2) {
		retryState.reasoningOnlyAttempts += 1;
		sessionPromptState.activateInternalPrompt(nextReasoningOnlyRetryInstruction);
		log$3.warn(`reasoning-only assistant turn detected: ${modelLogContext} — retrying ${retryState.reasoningOnlyAttempts}/2 with visible-answer continuation`);
		return { action: "retry" };
	}
	const reasoningOnlyRetriesExhausted = nextReasoningOnlyRetryInstruction && retryState.reasoningOnlyAttempts >= 2;
	if (replyRecoveryAllowed && shouldRetryMissingAssistantTurn({
		...terminalFacts,
		promptError
	}) && retryState.missingAssistantAttempts < MAX_MISSING_ASSISTANT_RETRIES) {
		retryState.missingAssistantAttempts += 1;
		sessionPromptState.suppressNextUserMessagePersistence = sessionPromptState.activePrompt.persisted;
		log$3.warn(`missing assistant terminal message detected: ${modelLogContext} — retrying ${retryState.missingAssistantAttempts}/${MAX_MISSING_ASSISTANT_RETRIES} with same prompt`);
		return { action: "retry" };
	}
	const availableTerminalToolPresentation = input.readTerminalToolPresentation();
	if (!nextReasoningOnlyRetryInstruction && nextEmptyResponseRetryInstruction && retryState[emptyResponseRetryCounter] < 1) {
		retryState[emptyResponseRetryCounter] += 1;
		sessionPromptState.activateInternalPrompt(nextEmptyResponseRetryInstruction);
		log$3.warn(`empty response detected: ${modelLogContext} stopReason=${input.attemptAssistant?.stopReason ?? "missing"} — retrying ${retryState[emptyResponseRetryCounter]}/1 with visible-answer continuation`);
		return { action: "retry" };
	}
	const completedEmptyFinalization = input.settledTurnFinalizationOutcome === "completed-empty";
	const terminalAssistantError = isTerminalAssistantError(input.attemptAssistant);
	const incompleteTurnText = replyRecoverySuppressed || completedEmptyFinalization && resolveReplyExpectation(runParams) === "optional" ? null : resolveIncompleteTurnPayloadText({
		...terminalFacts,
		externalAbort: externalAbort || signalOwnedInterruption,
		hadPotentialSideEffects: input.replayState.hadPotentialSideEffects,
		hasIntentionalTerminalCompletion: intentionalTerminalCompletion,
		terminalFailure: input
	});
	const incompleteTurnReplaySafe = Boolean(incompleteTurnText && !terminalInterrupted && !promptError && !attempt.lastToolError && !hasAttemptTerminalState(attempt) && !terminalAssistantError && !input.replayState.hadPotentialSideEffects);
	const incompleteTurnFallbackSafe = incompleteTurnReplaySafe && (input.attemptAssistant?.stopReason !== "stop" || attempt.agentHarnessResultClassification !== void 0);
	const terminalToolPresentation = incompleteTurnReplaySafe ? availableTerminalToolPresentation : void 0;
	if (replyRecoveryAllowed && (input.attemptCompactionCount > 0 || isCompactionReplayCheckpoint(input.attemptAssistant?.providerReplay)) && payloadCount === 0 && !terminalInterrupted && !promptError && !attempt.clientToolCalls && !attempt.yieldDetected && !attempt.didSendDeterministicApprovalPrompt && !attempt.lastToolError && !terminalAssistantError && !input.replayState.hadPotentialSideEffects && retryState.compactionContinuationAttempts < 1) {
		retryState.compactionContinuationAttempts += 1;
		sessionPromptState.activateCompactionContinuation(COMPACTION_CONTINUATION_RETRY_INSTRUCTION);
		log$3.warn(`compaction interrupted visible final answer: ${runLogContext} compactions=${input.attemptCompactionCount} — retrying ${retryState.compactionContinuationAttempts}/1 with compacted-transcript continuation`);
		input.armPostCompactionGuard();
		return { action: "retry" };
	}
	sessionPromptState.clearCompactionContinuation();
	if (reasoningOnlyRetriesExhausted && !input.prepared.finalAssistantVisibleText) {
		const incompletePayloadText = "⚠️ Agent couldn't generate a response. Please try again.";
		log$3.warn(`reasoning-only retries exhausted: ${modelLogContext} attempts=${retryState.reasoningOnlyAttempts}/2 — surfacing incomplete-turn error`);
		return completeEmbeddedRun({
			...input,
			incompleteTurnText: incompletePayloadText,
			payloadCount: 0,
			incompleteTurnFallbackSafe,
			terminalToolPresentation
		});
	}
	if (!nextReasoningOnlyRetryInstruction && nextEmptyResponseRetryInstruction && retryState[emptyResponseRetryCounter] >= 1) log$3.warn(`empty response retries exhausted: ${modelLogContext} attempts=${retryState[emptyResponseRetryCounter]}/1 — surfacing incomplete-turn error`);
	if (incompleteTurnText) {
		const incompleteStopReason = input.attemptAssistant?.stopReason;
		log$3.warn(`incomplete turn detected: ${modelLogContext} stopReason=${incompleteStopReason ?? "missing"} hasLastAssistant=${attempt.lastAssistant ? "yes" : "no"} hasCurrentAttemptAssistant=${attempt.currentAttemptAssistant ? "yes" : "no"} payloads=${payloadCount} tools=${attempt.toolMetas?.length ?? 0} replaySafe=${attempt.replayMetadata.replaySafe ? "yes" : "no"} compactions=${input.attemptCompactionCount} reasoningRetries=${retryState.reasoningOnlyAttempts}/2 emptyRetries=${retryState[emptyResponseRetryCounter]}/1 missingAssistantRetries=${retryState.missingAssistantAttempts}/${MAX_MISSING_ASSISTANT_RETRIES} — ` + (terminalToolPresentation ? "surfacing tool-authored terminal presentation" : "surfacing error to user"));
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
		sessionPromptState.activateInternalPrompt(`${BEFORE_AGENT_FINALIZE_RETRY_PROMPT_PREFIX}\n\n${beforeFinalizeRevisionReason}`);
		sessionPromptState.markOwnedTranscriptRetry();
		log$3.warn(`before_agent_finalize requested one more pass: ${runLogContext} attempt=${retryState.beforeFinalizeRevisionAttempts}/3`);
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
		message: formatErrorMessage(projectAgentRunAttemptTerminal(input.attempt.terminal).promptError ?? input.terminalState.outcome.error ?? input.incompleteTurnText ?? "Agent couldn't generate a response."),
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
	const stopReason = terminalAborted || terminalTimedOut ? input.terminalState.outcome.stopReason : error ? "error" : input.attempt.clientToolCalls ? "tool_calls" : input.attempt.yieldDetected ? "end_turn" : input.attemptAssistant?.stopReason;
	input.setTerminalLifecycleMeta({
		replayInvalid,
		livenessState,
		stopReason,
		...!error ? { yielded: input.attempt.yieldDetected === true } : {}
	});
	if (error) {
		if (input.authProfileId) {
			const assistant = input.attemptAssistant;
			try {
				await input.maybeMarkAuthProfileFailure({
					profileId: input.authProfileId,
					reason: input.assistantProfileFailureReason,
					modelId: input.modelId,
					retryAfterMs: assistant && buildAssistantFailoverSignal(assistant).retryAfterMs
				});
			} catch (bookkeepingError) {
				log$3.warn(`terminal auth bookkeeping failed; preserving result: ${String(bookkeepingError)}`);
			}
		}
	} else {
		log$3.debug(`embedded run done: runId=${input.runParams.runId} sessionId=${input.runParams.sessionId} durationMs=${Date.now() - input.startedAtMs} aborted=${terminalAborted}`);
		markEmbeddedRunAuthProfileSuccess({
			authProfileStateMode: input.runParams.authProfileStateMode,
			profileId: input.authProfileId,
			profileStore: input.profileFailureStore,
			provider: input.provider,
			modelId: input.modelId,
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
	const keepEmptyReplySilent = input.runParams.lane !== AGENT_LANE_SUBAGENT || Boolean(input.prepared.finalAssistantRawText?.trim());
	const hasPartialAssistantText = input.attempt.assistantTexts.some((text) => text.trim().length > 0) || resolveFinalAssistantVisibleText(input.attemptAssistant) !== void 0;
	const isTruncatedPartialReply = stopReason === "length" && !hasAttemptTerminalState(input.attempt) && hasPartialAssistantText;
	const terminalPayloads = input.incompleteTurnText !== void 0 ? [{
		text: input.terminalToolPresentation ? input.terminalToolPresentation.concat("\n\n", input.incompleteTurnText) : input.incompleteTurnText,
		isError: true
	}] : error ? input.payloadsForTerminalPath : input.emptyAssistantReplyIsSilent ? [{ text: SILENT_REPLY_TOKEN }] : input.payloadsForTerminalPath?.length ? isTruncatedPartialReply ? [...input.payloadsForTerminalPath, setReplyPayloadMetadata({ text: TRUNCATED_REPLY_NOTICE_TEXT }, { hostNotice: true })] : input.payloadsForTerminalPath : input.attempt.yieldDetected && !yieldHasContinuation ? [setReplyPayloadMetadata({ text: YIELD_DIAGNOSTIC_TEXT }, { hostNotice: true })] : input.payloadsForTerminalPath;
	return {
		action: "complete",
		result: {
			payloads: terminalPayloads?.length ? terminalPayloads : void 0,
			...!error && input.attempt.diagnosticTrace ? { diagnosticTrace: freezeDiagnosticTraceContext(input.attempt.diagnosticTrace) } : {},
			meta: {
				durationMs: Date.now() - input.startedAtMs,
				agentMeta: input.prepared.agentMeta,
				aborted: terminalAborted,
				systemPromptReport: input.attempt.systemPromptReport,
				finalPromptText: input.attempt.finalPromptText,
				finalAssistantVisibleText: input.prepared.finalAssistantVisibleText,
				finalAssistantRawText: input.prepared.finalAssistantRawText,
				replayInvalid,
				livenessState,
				stopReason,
				agentHarnessResultClassification: input.attempt.agentHarnessResultClassification,
				...error ? { error } : {
					...input.attempt.yieldDetected ? { yielded: true } : {},
					...input.attempt.yieldAcknowledgment ? { yieldAcknowledgment: input.attempt.yieldAcknowledgment } : {},
					...acceptedSessionSpawnContinuation ? { continuationPending: true } : {},
					...input.emptyAssistantReplyIsSilent && keepEmptyReplySilent ? { terminalReplyKind: "silent-empty" } : {},
					...input.intentionalTerminalCompletion ? { intentionalTerminalCompletion: "tool-batch" } : {},
					pendingToolCalls: input.attempt.clientToolCalls?.map((call) => ({
						id: randomBytes(5).toString("hex").slice(0, 9),
						name: call.name,
						arguments: JSON.stringify(call.params)
					})),
					executionTrace: {
						winnerProvider: input.prepared.reportedModelRef.provider,
						winnerModel: input.prepared.reportedModelRef.model,
						attempts: input.traceAttempts.length > 0 || input.attemptAssistant?.provider || input.attemptAssistant?.model ? [...input.traceAttempts, {
							provider: input.prepared.reportedModelRef.provider,
							model: input.prepared.reportedModelRef.model,
							result: "success",
							stage: "assistant"
						}] : void 0,
						fallbackUsed: input.traceAttempts.some((attempt) => attempt.result === "rotate_profile" || attempt.result === "fallback_model"),
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
						...stopReason ? {
							stopReason,
							finishReason: stopReason
						} : {},
						...stopReason?.toLowerCase().includes("refusal") ? { refusal: true } : {}
					},
					contextManagement: input.contextRecoveryState.autoCompactionCount > 0 ? { lastTurnCompactions: input.contextRecoveryState.autoCompactionCount } : void 0
				},
				toolSummary: input.prepared.attemptToolSummary,
				...input.prepared.failureSignal ? { failureSignal: input.prepared.failureSignal } : {},
				...input.prepared.terminalToolFailure ? { terminalToolFailure: input.prepared.terminalToolFailure } : {}
			},
			...copyAttemptDeliveryState(input.attempt),
			sourceReplyDeliveryState: resolveSourceReplyDelivery(input.attempt, input.prepared.replyDeliveryState)
		}
	};
}
//#endregion
//#region src/agents/embedded-agent-runner/run/settled-turn-finalization.ts
const MAX_EMPTY_SETTLED_FINALIZATION_ATTEMPTS = 2;
const SETTLED_TOOL_FINALIZATION_FALLBACK_TEXT = "The tool run finished, but no final summary was produced. I did not repeat any completed actions.";
async function prepareTerminalWithSettledTurnFinalization(input) {
	const initial = input.initial;
	const { preparedAttempt, sessionTarget, sessionWriterFence } = input.finalization;
	const committedSessionTarget = preparedAttempt.sessionTarget || sessionTarget || sessionWriterFence ? {
		...preparedAttempt.sessionTarget,
		...sessionTarget,
		...sessionWriterFence
	} : void 0;
	const sessionWriterDeliveryAuthority = resolveSessionWriterDeliveryAuthority({
		attempt: preparedAttempt,
		sessionId: committedSessionTarget?.sessionId ?? initial.sessionIdUsed,
		sessionTarget: committedSessionTarget
	});
	let attempt = initial.attempt;
	let lastRunPromptUsage = input.lastRunPromptUsage;
	const minimumAssistantMessageIndex = (attempt.answerSegments?.at(-1)?.messageEnd ?? -1) + 1;
	const observeSourceDelivery = async () => {
		let sourceReplyDeliveryState;
		const resolveFacts = input.terminalBase.runParams.resolveReplyDeliveryFacts;
		const replyDeliveryState = await observeReplyDelivery(resolveFacts ? async (minimum) => {
			const facts = await resolveFacts(minimum);
			sourceReplyDeliveryState = facts.source;
			return facts.terminal;
		} : input.terminalBase.runParams.resolveReplyDelivery, minimumAssistantMessageIndex, (error) => log$3.warn(`reply delivery observation failed; retaining custody: ${formatErrorMessage(error)}`));
		return {
			replyDeliveryState,
			sourceReplyDeliveryState: sourceReplyDeliveryState ?? replyDeliveryState
		};
	};
	const delivery = await observeSourceDelivery();
	const { replyDeliveryState } = delivery;
	let prepared = prepareEmbeddedRunTerminal({
		...input.terminalBase,
		...initial,
		...delivery,
		attempt,
		lastRunPromptUsage
	});
	const preserveInitial = (finalizationOutcome) => ({
		...initial,
		prepared,
		lastRunPromptUsage,
		finalizationOutcome
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
	if (!prompt) return preserveInitial("not-attempted");
	const assertFinalizationActive = resolveAdmittedRunActiveAssertion(input.finalization.preparedAttempt.admittedRunContext, input.finalization.abortSignal);
	if (!assertFinalizationActive) throw new Error("admitted run authority is no longer active");
	const runParams = input.terminalBase.runParams;
	const errorContext = input.terminalBase.activeErrorContext;
	const describeRun = () => `runId=${runParams.runId} sessionId=${runParams.sessionId} provider=${errorContext.provider}/${errorContext.model}`;
	const preserveOriginalTerminal = Boolean(initial.attempt.lastToolError) || isEmbeddedRunTerminalTimeout(initial.terminalState.outcome);
	const terminalFallbackAllowed = input.finalization.preparedAttempt.silentExpected !== true && !preserveOriginalTerminal;
	const terminalFailed = classifyAgentRunTerminalOutcome(initial.terminalState.outcome) === "failure";
	log$3.warn(`settled post-tool turn lacked a final answer: ${describeRun()} — running isolated finalization`);
	let finalizationOutcome = "failed";
	let hostFallbackSynthesized = false;
	try {
		let finalization;
		let finalizationAttempt = 0;
		for (;;) {
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
			if (finalization.outcome !== "empty" || finalizationAttempt >= MAX_EMPTY_SETTLED_FINALIZATION_ATTEMPTS) break;
			log$3.warn(`settled-turn finalization completed without a visible answer: ${describeRun()} — retrying ${finalizationAttempt}/1 with tools disabled`);
		}
		finalizationOutcome = finalization.outcome;
		if (finalization.outcome === "empty") log$3.warn(`settled-turn finalization completed without a visible answer: ${describeRun()} attempts=${finalizationAttempt}/${MAX_EMPTY_SETTLED_FINALIZATION_ATTEMPTS} — ${terminalFallbackAllowed ? "using terminal fallback reply" : "preserving original failure"}`);
	} catch (error) {
		if (input.finalization.abortSignal.aborted) {
			log$3.warn(`settled-turn finalization was cancelled: ${describeRun()} error=${formatErrorMessage(error)} — preserving cancellation`);
			return preserveInitial("failed");
		}
		log$3.warn(`settled-turn finalization failed: ${describeRun()} error=${formatErrorMessage(error)} — ${terminalFallbackAllowed ? "using terminal fallback reply" : "preserving original failure"}`);
	}
	if (finalizationOutcome !== "answered" && input.finalization.abortSignal.aborted) {
		log$3.warn(`settled-turn finalization was cancelled before terminal delivery: ${describeRun()} — preserving cancellation`);
		return preserveInitial("failed");
	}
	if (finalizationOutcome !== "answered" && terminalFallbackAllowed) {
		attempt = buildSettledToolFallbackAttemptResult({
			text: runParams.trigger === "cron" ? SILENT_REPLY_TOKEN : SETTLED_TOOL_FINALIZATION_FALLBACK_TEXT,
			error: terminalFailed ? initial.terminalState.outcome.error ?? "LLM request failed." : void 0,
			settledAttempt: initial.attempt,
			sourceAttempt: attempt,
			prompt,
			agentHarnessId: input.finalization.preparedAttempt.agentHarnessId,
			runtimePlan: input.finalization.preparedAttempt.runtimePlan
		});
		hostFallbackSynthesized = true;
		const transcriptIdempotencyKey = await persistSettledToolFallbackTranscript({
			text: attempt.assistantTexts.join("\n\n"),
			attempt: input.finalization.preparedAttempt,
			abortSignal: input.finalization.abortSignal,
			assertActive: assertFinalizationActive,
			sessionId: committedSessionTarget?.sessionId ?? initial.sessionIdUsed,
			sessionTarget: committedSessionTarget
		});
		if (input.finalization.abortSignal.aborted) {
			log$3.warn(`settled-turn fallback was cancelled during transcript persistence: ${describeRun()} — preserving cancellation`);
			return preserveInitial("failed");
		}
		if (transcriptIdempotencyKey) {
			attempt.assistantTranscriptOwned = true;
			attempt.assistantTranscriptIdempotencyKey = transcriptIdempotencyKey;
		}
		if (terminalFailed) finalizationOutcome = "failed";
		else if (runParams.trigger === "cron") finalizationOutcome = "silent-fallback";
	}
	const completion = finalizationOutcome !== "answered" && preserveOriginalTerminal ? initial : {
		attempt,
		attemptAssistant: attempt.currentAttemptAssistant,
		currentAttemptCompletedAssistant: attempt.currentAttemptCompletedAssistant,
		terminalState: terminalFailed && finalizationOutcome !== "answered" ? initial.terminalState : {
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
		...await observeSourceDelivery(),
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
			finalAssistantRawText: "",
			finalAssistantMessageRawText: ""
		} : {},
		...hostFallbackSynthesized ? { finalAssistantMessageRawText: "" } : {},
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
		const finalization = await withGatewayToolCallerIdentity(callerIdentity, () => runAgentHarnessSettledTurnFinalization({
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
	if (input.error) assistant.content = [{
		type: "text",
		text: buildTextObservationFields(formatUserFacingAssistantErrorText({
			...assistant,
			stopReason: "error",
			errorMessage: input.error
		})).textPreview ?? "LLM request failed."
	}];
	const result = buildSettledTurnFinalizationAttemptResult({
		...input,
		outcome: !input.error && isSilentReplyText(input.text) ? "empty" : "answered",
		result: {
			assistant,
			usage: input.sourceAttempt.attemptUsage,
			diagnosticTrace: input.sourceAttempt.diagnosticTrace
		}
	});
	result.terminal = input.settledAttempt.terminal;
	return result;
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
	const terminalTimedOut = isEmbeddedRunTerminalTimeout(input.terminalState.outcome);
	const { idleTimedOut, timedOutDuringToolExecution } = projectAgentRunAttemptTerminal(input.attempt.terminal);
	const unfinishedToolTimeout = terminalTimedOut && timedOutDuringToolExecution && input.terminalPrepared.replyDeliveryState === "missing" && !input.terminalPrepared.payloads?.some((payload) => {
		const metadata = getReplyPayloadMetadata(payload);
		return !isHostNoticePayload(payload) && isReplyPayloadTerminalContent(payload) && metadata?.sourceReplyFinal !== false && metadata?.precedingInputAnswer !== true;
	}) && !hasRunContinuationEvidence(input.attempt);
	if (!input.terminalPrepared.timedOutDuringPrompt && !unfinishedToolTimeout || !unfinishedToolTimeout && !timeoutFinal && (input.terminalPrepared.hasSuccessfulFinalAssistantAfterPromptTimeout || hasMessagingToolDeliveryEvidence(input.attempt))) return;
	const defaultTimeoutText = timedOutDuringToolExecution ? "Tool execution timed out with an unknown outcome. Check the current state before repeating the operation." : idleTimedOut ? "The model did not produce a response before the model idle timeout. Please try again, or increase `models.providers.<id>.timeoutSeconds` for slow local or self-hosted providers. If `agents.defaults.timeoutSeconds` or a run-specific timeout is lower, raise that ceiling too; provider timeouts cannot extend a model attempt budget." : "Request timed out before a response was generated. Please try again, or increase `agents.defaults.timeoutSeconds` in your config.";
	const timeoutText = input.attempt.promptTimeoutOutcome?.message?.trim() || defaultTimeoutText;
	const replayInvalid = input.attempt.promptTimeoutOutcome?.replayInvalid ?? input.resolveReplayInvalid(null);
	const livenessState = input.attempt.promptTimeoutOutcome?.livenessState ?? resolveRunLivenessState({
		payloadCount: unfinishedToolTimeout || input.terminalPrepared.hasPartialAssistantTextAfterPromptTimeout ? 0 : input.terminalPrepared.payloads?.length ?? 0,
		aborted: false,
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
			aborted: false,
			systemPromptReport: input.attempt.systemPromptReport,
			finalPromptText: input.attempt.finalPromptText,
			finalAssistantVisibleText: input.terminalPrepared.finalAssistantVisibleText,
			finalAssistantRawText: input.terminalPrepared.finalAssistantRawText,
			...input.terminalPrepared.finalAssistantMessageRawText !== void 0 ? { finalAssistantMessageRawText: input.terminalPrepared.finalAssistantMessageRawText } : {},
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
	let { runParams: params, provider, modelId, preReplyGeneration } = input;
	const { hookRunner, hookContext: hookCtx, fallbackConfigured, resolvedSessionKey, startedAtMs: started, startupStages, lifecycleGeneration } = input;
	const { notifyExecutionPhase } = input.progressController;
	let startupStagesEmitted = false;
	const abortSignal = input.laneController.abortSignal;
	params = {
		...params,
		abortSignal
	};
	const preparedRuntime = await measureEmbeddedAgentPreparation("runtime", () => prepareEmbeddedRunRuntime({
		...input,
		assertCurrent: input.laneController.throwIfAborted,
		getAuthDeadline: input.laneController.getExecutionDeadline,
		runParams: params,
		hookContext: preReplyGeneration?.assertCurrent ? withClaimingHookAdmission({ ...hookCtx }, { assertCurrent: preReplyGeneration?.assertCurrent }) : hookCtx,
		markStartupStage: (stage) => startupStages.mark(stage),
		notifyExecutionPhase
	}), { config: params.config });
	params = {
		...params,
		admittedRunContext: preparedRuntime.admittedRunContext,
		abortSignal
	};
	const accountingAuthority = getAdmittedRunDelegatedAuthority(preparedRuntime.admittedRunContext);
	const assertAdmittedActive = resolveAdmittedRunActiveAssertion(preparedRuntime.admittedRunContext, abortSignal);
	const admittedRunInput = {
		...input,
		runParams: params,
		modelCallSequence: getAgentRunContext(params.runId)?.modelCallSequence ?? { value: 0 }
	};
	({provider, modelId} = preparedRuntime);
	const { model, attemptAuthProfileStore, profileCandidates, profileFailureStore, pluginHarnessOwnsAuthBootstrap, attemptedThinking, getApiKeyInfo } = preparedRuntime;
	const initialHarness = preparedRuntime.snapshot().agentHarness;
	const traceAttempts = [];
	const resolveRuntimeFallbackReason = () => traceAttempts.findLast((attempt) => attempt.result === "fallback_model" && typeof attempt.reason === "string")?.reason ?? (params.modelRoutingProvenance?.stage === "fallback" ? params.modelRoutingProvenance.fallbackReason ?? null : null);
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
	const idleTimeoutBreakerState = { consecutiveIdleTimeoutsBeforeOutput: 0 };
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
		runInput: admittedRunInput,
		preparedRuntime,
		getSessionId: () => sessionPromptState.sessionId
	});
	const { contextEngine, contextEngineLogicalTurnLease, ownsContextEngineLogicalTurnLease } = await admitEmbeddedContextEngine(admittedRunInput, initialHarness);
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
			const attemptRuntimeSnapshot = preparedRuntime.snapshot();
			const { agentHarness, pluginHarnessOwnsTransport, effectiveModel, outerContextTokenMeta, lastProfileId, thinkLevel } = attemptRuntimeSnapshot;
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
			preReplyGeneration?.assertCurrent();
			preReplyGeneration?.release();
			preReplyGeneration = void 0;
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
			if (dispatchedAttempt.rawAttempt.hasSuccessfulModelResponse) recordRunModelProgress(runRetryBudget);
			const rawAttempt = refresh.applyDeliveryState(dispatchedAttempt.rawAttempt);
			attemptCarryover.apply(rawAttempt);
			rawAttempt.sourceReplyDeliveryState = resolveSourceReplyDelivery(rawAttempt, params.replyOperation?.sourceReplyDelivered ? "delivered" : "missing");
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
			const { attempt, sessionIdUsed, sessionFileUsed, currentAttemptCompletedAssistant, attemptAssistant, terminalState, setTerminalLifecycleMeta, attemptCompactionCount, activeErrorContext, resolveReplayInvalidForAttempt } = normalizedAttempt;
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
				authRetryPending = recovery.authRetryPending;
				codexAppServerRecoveryRetries = recovery.codexAppServerRecoveryRetries;
				lastRetryFailoverReason = recovery.lastRetryFailoverReason;
				continue;
			}
			const assistantFailureOutcome = await handleEmbeddedAssistantFailure({
				runInput: admittedRunInput,
				preparedRuntime,
				normalizedAttempt,
				runtime: attemptRuntimeSnapshot,
				providerOwner: preparedRuntime.snapshot().providerRuntimeHandle.plugin,
				getThinkLevel: () => preparedRuntime.snapshot().thinkLevel,
				runtimeAuthRetry,
				emptyErrorRetries,
				overloadProfileRotations,
				previousRetryFailoverReason: lastRetryFailoverReason,
				failover: failoverRetryController,
				rateLimitRetriesExhausted: failoverRetryController.rateLimitRetriesExhausted,
				traceAttempts,
				suspensionSessionId: sessionPromptState.sessionId ?? params.sessionId
			});
			preparedRuntime.setThinkLevel(assistantFailureOutcome.thinkLevel);
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
					rateLimitRetriesExhausted: failoverRetryController.rateLimitRetriesExhausted,
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
			const { attempt: terminalAttempt, terminalState: resolvedTerminalState, prepared: terminalPrepared, finalizationOutcome: settledTurnFinalizationOutcome } = finalizedTerminal;
			lastRunPromptUsage = finalizedTerminal.lastRunPromptUsage;
			if (settledTurnFinalizationOutcome === "answered" || settledTurnFinalizationOutcome === "completed-empty") assistantProfileFailureReason = null;
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
				...finalizedTerminal,
				runParams: params,
				retryState: terminalRetryState,
				activeErrorContext,
				modelApi: effectiveModel.api,
				executionContract,
				replayState: accumulatedReplayState,
				sessionPromptState,
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
				traceAttempts,
				thinkLevel: assistantFailureOutcome.thinkLevel,
				contextRecoveryState
			});
			if (terminalResolution.action === "retry") continue;
			const { result } = terminalResolution;
			return providerReview.finish(terminalPrepared.finalAssistantMessageRawText === void 0 ? result : {
				...result,
				meta: {
					...result.meta,
					finalAssistantMessageRawText: terminalPrepared.finalAssistantMessageRawText
				}
			});
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
/** Tracks session rotation so diagnostics keep the current identity after compaction. */
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
//#region src/agents/embedded-agent-runner/run/lane-controller.ts
function createEmbeddedRunLaneController(options) {
	const initialParams = options.getParams();
	const taskIdentity = {
		taskKind: initialParams.trigger === "cron" ? "cron" : initialParams.spawnedBy ? "spawn" : "turn",
		sessionKey: initialParams.sessionKey,
		runId: initialParams.runId,
		requesterSessionKey: initialParams.spawnedBy ?? void 0
	};
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
		throw createAbortError("Operation aborted", reason === void 0 ? void 0 : { cause: reason });
	};
	const assertCurrent = () => {
		throwIfAborted();
		assertAgentRunLifecycleGenerationCurrent(options.getLifecycleGeneration());
		options.getParams().preparedRunAdmission?.assertSourceCurrent();
	};
	const withLaneTimeout = (opts, allowPendingGlobalAdmissionHeartbeat = false) => ({
		...opts,
		taskTimeoutMs: opts?.taskTimeoutMs !== void 0 ? opts.taskTimeoutMs : laneTaskTimeoutMs,
		taskIdentity,
		sessionTarget: {
			agentId: options.getParams().agentId,
			sessionKey: options.getParams().sessionKey,
			sessionId: options.getParams().sessionId
		},
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
	});
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
	const enqueue = (params, lane, task, opts, allowPendingGlobalAdmissionHeartbeat = false) => {
		if (!params.enqueue) noteLaneWaitIfBusy(lane);
		const queueOptions = withLaneTimeout(withRunLaneWait(opts), allowPendingGlobalAdmissionHeartbeat);
		return params.enqueue ? params.enqueue(task, queueOptions) : enqueueCommandInLane(lane, task, queueOptions);
	};
	const rethrowQueueError = (error) => {
		if (isCommandLaneTaskTimeoutError(error)) laneTaskAbortController.abort(error);
		throw error;
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
			maxConcurrent: options.getParams().swarmExecutionLane?.maxConcurrent,
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
				const newerSameIdExecutionOwnsContext = existingContext?.lifecycleGeneration === currentLifecycleGeneration;
				if (!wasQueuedBeforeRotation || !sessionLanePolicy.canResumeAcrossRotation || newerSameIdExecutionOwnsContext) assertAgentRunLifecycleGenerationCurrent(lifecycleGeneration);
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
				options.onSessionWriterClaimed?.(writerClaim.entry);
			}
			return await withAgentRunLifecycleGeneration(lifecycleGeneration, () => withSessionPlacementTurnAdmission({
				sessionId: params.sessionId,
				...params.agentId ? { agentId: params.agentId } : {},
				...params.sessionKey ? { sessionKey: params.sessionKey } : {},
				runId: params.runId
			}, params, (signal) => {
				params = {
					...params,
					abortSignal: signal
				};
				options.setParams(params);
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
		let started = false;
		return withReleasableExecutionCapacity((ticket) => {
			if (started) {
				options.getParams().replyOperation?.markWaitingForGlobalLane();
				if (!waitingForGlobalLaneAdmission) {
					waitingForGlobalLaneAdmission = true;
					pendingGlobalLaneAdmissions += 1;
				}
			}
			const runTicket = async () => {
				if (started) {
					endCapacityWait();
					finishGlobalLaneAdmission();
					noteLaneTaskProgress();
					throwIfAborted();
					options.getParams().replyOperation?.markGlobalLaneWaitEnded();
					options.getParams().onLaneWait?.({
						waitMs: 0,
						queuedAhead: 0,
						waiting: false
					});
				}
				started = true;
				return await ticket();
			};
			return enqueue(params, options.globalLane, runTicket, globalOpts).catch(rethrowQueueError);
		}, taskWithCurrentLifecycle).finally(finishGlobalLaneAdmission);
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
				queuedRun = enqueue(params, options.sessionLane, admittedTask, sessionOpts, true);
			} catch (error) {
				releaseQueuedContext("abandoned");
				throw error;
			}
			return await queuedRun.finally(abandonQueuedContext).catch(rethrowQueueError);
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
		getExecutionDeadline: () => !activeAttemptOwner ? void 0 : laneTaskDeadline?.kind === "bounded" ? {
			kind: "bounded",
			deadlineAtMs: laneTaskDeadline.deadlineAtMs - EMBEDDED_RUN_LANE_TIMEOUT_GRACE_MS
		} : laneTaskDeadline,
		createAttemptControls,
		throwIfAborted,
		assertCurrent
	};
}
//#endregion
//#region src/agents/embedded-agent-runner/run/model-admission.ts
function resolveEmbeddedRunConfig(params) {
	const requestedProvider = normalizeOptionalString(params.provider);
	const requestedModel = normalizeOptionalString(params.model);
	const needsConfiguredDefault = !params.config && !requestedProvider && !requestedModel;
	return params.config ?? (needsConfiguredDefault ? getRuntimeConfigSnapshot() ?? void 0 : void 0);
}
/** Native sessions attest their own model later; ordinary requests are checked before runtime preparation. */
function assertInitialOperatorModelPolicy(params, entry) {
	const operatorAuthority = readRunOperatorAuthority(params);
	if (!operatorAuthority?.modelPolicy || resolveSessionPinnedHarnessId(entry)) return;
	const selection = resolveInitialEmbeddedRunModel({
		...params,
		config: params.config
	});
	const selected = resolveModelCandidateChain({
		cfg: params.config,
		agentId: params.agentId,
		provider: selection.provider,
		model: selection.modelId,
		requestedRouteResolution: params.requestedRouteResolution,
		fallbacksOverride: [],
		manifestPlugins: params.pluginGeneration?.pluginMetadataSnapshot
	})[0];
	assertOperatorModelAllowed(operatorAuthority, selected);
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
		const data = {
			kind: "status",
			title: "Fast",
			phase: "update"
		};
		try {
			emitAgentActivityEvent({
				runId: params.attempt.runId,
				...params.attempt.sessionKey ? { sessionKey: params.attempt.sessionKey } : {},
				stream: "item",
				data: {
					itemId: `fast-mode-auto:${payload.enabled ? "on" : "off"}`,
					...data,
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
					...data,
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
	const resolveCurrentFastMode = () => resolveFastModeForElapsed({
		mode: params.attempt.fastMode,
		startedAtMs: fastModeStartedAtMs,
		fastAutoOnSeconds: fastModeAutoOnSeconds
	});
	const maybeAnnounceFastModeAutoOff = async () => {
		if (params.attempt.fastMode !== "auto" || fastModeAutoProgressState.offAnnounced) return;
		const next = resolveCurrentFastMode();
		if (next.enabled) return;
		fastModeAutoProgressState.offAnnounced = true;
		await emitFastModeAutoProgress(next);
	};
	const resolveAttemptFastMode = () => {
		const resolved = resolveCurrentFastMode();
		return resolved.mode === void 0 ? void 0 : resolved.enabled;
	};
	const resolveAttemptFastModeParam = () => {
		if (params.attempt.fastMode === "auto") return resolveAttemptFastMode;
		return params.attempt.fastMode;
	};
	const maybeEmitFastModeAutoResetBestEffort = async () => {
		try {
			if (params.attempt.fastMode !== "auto" || !fastModeAutoProgressState.offAnnounced || fastModeAutoProgressState.resetAnnounced) return;
			fastModeAutoProgressState.resetAnnounced = true;
			await emitFastModeAutoProgress({
				enabled: true,
				elapsedSeconds: 0,
				fastAutoOnSeconds: fastModeAutoOnSeconds
			});
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
		notifyExecutionPhase,
		notifyRunProgress,
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
const EMPTY_EMBEDDED_AGENT_CONFIG = Object.freeze({});
function runEmbeddedAgent(internalParamsInput) {
	const config = resolveEmbeddedRunConfig(internalParamsInput);
	const lifecycleGeneration = internalParamsInput.lifecycleGeneration ?? captureAgentRunLifecycleGeneration(internalParamsInput.runId);
	const pluginGeneration = internalParamsInput.pluginGeneration ?? (internalParamsInput.preparedModelRuntimeMode === "isolated-read-only" ? void 0 : getPreparedModelRuntimePluginGeneration());
	return withAgentRunLifecycleGeneration(lifecycleGeneration, async () => {
		const prepared = await prepareEmbeddedRunSession({
			...internalParamsInput,
			config,
			lifecycleGeneration,
			...pluginGeneration ? { pluginGeneration } : {}
		});
		return await withRequiredSessionPlacement(prepared.runSessionTarget, {
			config: prepared.params.config,
			assertCurrent: prepared.params.preparedRunAdmission?.assertSourceCurrent,
			signal: prepared.params.abortSignal
		}, () => runEmbeddedAgentForSession(prepared));
	});
}
async function runEmbeddedAgentForSession(prepared) {
	const { params: paramsBase, runSessionTarget, contextEngineAgentId, queuedLifecycleGeneration } = prepared;
	let sessionAdmission = prepared.sessionAdmission;
	let lifecycleGeneration = paramsBase.lifecycleGeneration;
	let params = withExecutionPhaseDiagnostics({
		...paramsBase,
		sessionManager: paramsBase.sessionManager ?? (paramsBase.sessionPersistence === "detached" ? SessionManager.inMemory(paramsBase.cwd ?? paramsBase.workspaceDir) : void 0)
	});
	const sessionLane = resolveSessionLane(params.sessionKey?.trim() || params.sessionId);
	const globalLane = resolveGlobalLane(params.lane, params);
	const failureSuspension = params.sessionPersistence === "detached" ? void 0 : resolveSessionSuspensionTarget();
	const suspendForFailure = (suspensionParams) => {
		if (!failureSuspension) return;
		const suspension = {
			...suspensionParams,
			agentId: suspensionParams.agentId ?? params.agentId
		};
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
		},
		onSessionWriterClaimed: (entry) => {
			if (sessionAdmission) sessionAdmission = {
				...sessionAdmission,
				entry
			};
		}
	});
	const { enqueueGlobal, enqueueSession, noteLaneTaskProgress, throwIfAborted } = laneController;
	const channelHint = params.messageChannel ?? params.messageProvider;
	const resolvedToolResultFormat = params.toolResultFormat ?? (!channelHint || isMarkdownCapableMessageChannel(channelHint) ? "markdown" : "plain");
	const isProbeSession = params.sessionId?.startsWith("probe-") ?? false;
	throwIfAborted();
	const recoveryMessageActionTurnCapability = createRecoveryMessageActionTurnCapability(params);
	if (recoveryMessageActionTurnCapability) params = {
		...params,
		messageActionTurnCapability: recoveryMessageActionTurnCapability
	};
	const requestOwners = captureExecRequestOwners(params);
	const runSession = async () => {
		throwIfAborted();
		if (!params.sessionManager || params.sessionManager.getSessionTarget()) {
			params.replyOperation?.markWaitingForDeferredMaintenance();
			try {
				await waitForDeferredTurnMaintenanceForSession(params.sessionKey);
				await waitForSessionTranscriptProjection(runSessionTarget, laneController.abortSignal);
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
				try {
					var _usingCtx$1 = _usingCtx();
					throwIfAborted();
					assertInitialOperatorModelPolicy(params, sessionAdmission?.entry);
					const cliDispatched = await runEmbeddedAgentViaCliBackendIfEligible({
						...params,
						sessionTarget: {
							...params.sessionTarget,
							...runSessionTarget
						}
					});
					if (cliDispatched) return cliDispatched;
					const preReplyTarget = {
						...runSessionTarget,
						...params.sessionTarget
					};
					const preReplyGeneration = await prepareCronRootSessionGeneration({
						...preReplyTarget,
						sessionId: params.sessionId,
						sessionKey: params.sessionKey ?? preReplyTarget.sessionKey,
						lifecycleRevision: preReplyTarget.expectedLifecycleRevision
					}, (reason) => laneController.laneTaskAbortController.abort(reason));
					_usingCtx$1.u({ [Symbol.dispose]: () => preReplyGeneration?.release() });
					const preReplyAssertCurrent = () => {
						laneController.assertCurrent();
						preReplyGeneration?.assertCurrent();
					};
					const startupStages = createStageTimingTracker(Date.now);
					const { requestedWorkspaceResolution, runtimeWorkspaceResolution, preserveExecutionWorkspace } = resolvePreparedRuntimeWorkspaces(params);
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
						workspaceDir: runtimeWorkspaceResolution.workspaceDir,
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
					}).map((candidate, index) => Object.assign({
						provider: candidate.provider,
						modelId: candidate.model
					}, requestedHarnessRuntime && (index === 0 || explicitHarnessRuntime) ? { runtime: requestedHarnessRuntime } : {}, { agentId: requestedWorkspaceResolution.agentId }));
					const preparedInput = {
						config,
						agentId: requestedWorkspaceResolution.agentId,
						agentDir: requestedAgentDir,
						inheritedAuthDir: resolveLegacyInheritedAuthDir(config),
						workspaceDir: runtimeWorkspaceResolution.workspaceDir,
						preserveWorkspaceDirOnRefresh: !runtimeWorkspaceResolution.isCanonicalWorkspace,
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
						const isolatedReadOnly = params.preparedModelRuntimeMode === "isolated-read-only";
						const preparedModelRuntimeLease = await (isolatedReadOnly ? acquireReadOnlyPreparedModelRuntime : acquireAgentRunPreparedModelRuntime)(preparedInput, {
							abortSignal: laneController.abortSignal,
							catalogMode: "static",
							...!isolatedReadOnly ? {
								retainIdleRunOwner,
								...params.pluginGeneration ? { pluginGeneration: params.pluginGeneration } : {}
							} : {}
						}).catch((error) => {
							if (!refreshed && error instanceof PreparedModelRuntimeOwnerNotPublishedError && error.admissionBlocked) throw new PreparedModelRuntimeInitialRunAdmissionError(error);
							throw error;
						}).finally(() => {
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
								preserveExecutionWorkspace,
								preparedModelRuntime: preparedModelRuntimeOwnerSnapshot
							});
							params = rebound.runParams;
							const workspaceResolution = rebound.workspaceResolution;
							const projects = await prepareAgentPromptProjects({
								config: params.config,
								workspaceDir: workspaceResolution.workspaceDir,
								cwd: params.cwd,
								sessionId: params.sessionId
							});
							const { activeProjectKeys } = projects;
							const preparedModelRuntime = Object.freeze({
								...preparedModelRuntimeOwnerSnapshot,
								...projects
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
								preReplyAssertCurrent();
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
								const modelFallbackAvailability = (params.resolvedModelSelection?.fallbacksOverride === void 0 ? params.modelFallbackAvailability : void 0) ?? resolveModelFallbackAvailability({
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
									...buildAgentHookContextIdentityFields(params)
								};
								const hookResult = await runBeforeAgentReplyForTurn({
									awaitSessionDiffBaseline: params.awaitSessionDiffBaseline,
									assertCurrent: preReplyAssertCurrent,
									runId: params.runId,
									trigger: params.trigger,
									event: { cleanedBody: params.prompt },
									context: {
										...hookCtx,
										heartbeatEventQueueSessionKey: params.heartbeatEventQueueSessionKey
									},
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
										finalAssistantRawText: hookResult.reply?.text ?? "NO_REPLY",
										providerStarted: false
									}
								};
								assistantErrorTranscript ??= params.assistantErrorTranscript ?? createAssistantErrorTranscript();
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
									preReplyGeneration,
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
				} catch (_) {
					_usingCtx$1.e = _;
				} finally {
					_usingCtx$1.d();
				}
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
					if (ownsAssistantErrorTranscript) assistantErrorTranscript?.settle(failed && !params.abortSignal?.aborted);
				}
				refresh.mergeTerminalReceipt(result);
				if (result.meta.executionTrace?.runner !== "cli" && params.isFinalFallbackAttempt === void 0) await settleRequesterRun(params, result, laneController.assertCurrent);
				const error = result.meta.error?.message ?? terminal?.getDeferredError();
				terminal?.emit(error ? "error" : "end", error ? new Error(error) : result, {
					...resolveAgentLifecycleTerminalMetadata(result.meta),
					...result.meta.agentMeta?.terminalReceipt ? { assistantTranscriptIdempotencyKey: result.meta.agentMeta.terminalReceipt.assistantTranscriptIdempotencyKey } : {}
				});
				return result;
			} catch (error) {
				const failure = params.isFinalFallbackAttempt === void 0 ? await settleFailedRequesterRun(params, error, resolveSessionPlacementTurnSettlementAssertion()) : error;
				terminal?.emit("error", failure);
				throw failure;
			} finally {
				refresh.close();
			}
		});
	};
	return enqueueSession(() => withExecRequestTurn({
		identity: {
			runId: params.runId,
			sessionKey: params.sessionKey,
			sessionId: params.sessionId,
			agentId: params.agentId
		},
		owners: requestOwners,
		abortSignal: params.abortSignal
	}, runSession)).finally(() => {
		revokeMessageActionTurnCapability(recoveryMessageActionTurnCapability);
	});
}
//#endregion
export { compactEmbeddedAgentSession as n, runEmbeddedAgent as t };
