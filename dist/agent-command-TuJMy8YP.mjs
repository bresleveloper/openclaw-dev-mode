import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { C as parseStrictNonNegativeInteger } from "./number-coercion-CkhMiRw8.mjs";
import { n as coerceErrorMessage } from "./error-coercion-BwMr25F8.mjs";
import { s as trackAsyncWork } from "./async-work-scope-BH2yUdBz.mjs";
import { o as resolveUserPath } from "./home-dir-CtsdYvX3.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { a as withoutRuntimeOutput, r as defaultRuntime } from "./runtime-BazLsT0s.mjs";
import { c as isSecretRef } from "./ref-contract-Bfd9_-Lp.mjs";
import "./types.secrets-Dgbd2kyP.mjs";
import "./utils-gjJ-tD2q.mjs";
import { i as createAbortError, o as racePromiseWithAbortSignal } from "./src-Bzfi3cQM.mjs";
import "./abort-signal-C9DFO3n5.mjs";
import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { l as withPluginRuntimeGatewayRequestScope, o as getPluginRuntimeGatewayRequestScope } from "./gateway-request-scope-1BXD1G3l.mjs";
import { i as getLegacyPluginSdkResourceHost, n as bindLegacyPluginSdkResourceHost, r as getBoundLegacyPluginSdkResourceHost, t as LegacyPluginSdkResourceHost } from "./legacy-sdk-resource-host-DBY7FuQ8.mjs";
import { n as resolveSessionSkillExecutionWorkspace } from "./workspace-skill-roots-CL28VeX5.mjs";
import { p as isDiagnosticsEnabled, s as emitTrustedDiagnosticEvent } from "./diagnostic-events-C91J-XX8.mjs";
import { n as sanitizeForLog } from "./ansi-Xy3t0ZdY.mjs";
import { t as createSubsystemLogger } from "./subsystem-mStysHHC.mjs";
import { t as GatewayScheduler } from "./gateway-scheduler-DzQtXKjV.mjs";
import { r as normalizeProviderId } from "./provider-id-D1VImdKk.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { o as MODEL_SELECTION_LOCKED_MESSAGE, s as ModelSelectionLockedError } from "./openclaw-state-worker-error-B93Lf_P2.mjs";
import { t as _usingCtx } from "./usingCtx-BhiZp_rS.mjs";
import { O as setRuntimeConfigSnapshot, g as readRuntimeConfig } from "./runtime-snapshot-BBYDJbw9.mjs";
import { a as parseProviderModelRef, n as buildModelCatalogRef } from "./model-catalog-refs-D3xvQZh0.mjs";
import { i as classifyAgentRunTerminalOutcome } from "./agent-run-terminal-outcome-CrMEEYuY.mjs";
import { b as registerAgentRunContext, o as clearAgentRunContext } from "./agent-run-registry-gmaPgO-n.mjs";
import { C as withAgentRunLifecycleGeneration, a as emitAgentEvent, d as getAgentEventLifecycleGeneration, r as captureAgentRunLifecycleGeneration, t as assertAgentRunLifecycleGenerationCurrent } from "./agent-events-Bf3Js0D3.mjs";
import { f as sessionEntryCommitGuardOptions, o as composeSessionSourceAssertion } from "./session-source-authority-fdILH-PW.mjs";
import { i as isIncognitoSessionKey } from "./incognito-session-key-BWpn88lo.mjs";
import { S as isCronSessionKey, l as resolveAgentIdFromSessionKey, m as scopeLegacySessionKeyToAgent, o as classifySessionKeyShape, s as isUnscopedSessionKeySentinel, w as isSubagentSessionKey } from "./session-key-CSDERtm3.mjs";
import { r as normalizeOptionalAccountId } from "./account-id-ifCOO7_9.mjs";
import { v as requireActivePluginRegistry } from "./runtime-DkPagH0y.mjs";
import { t as formatCliCommand } from "./command-format-CYoE8cOC.mjs";
import { a as resolveAgentDir, b as resolveNativeModelPrimary, f as resolveAgentWorkspaceDir, r as resolveAgentConfig, u as resolveAgentRunCwd } from "./agent-scope-config-fjA2T9Gz.mjs";
import { i as listAgentIds, n as listAgentEntries } from "./agent-roster-gkYP38su.mjs";
import { i as resolveProviderIdForAuth } from "./provider-auth-aliases-DCRcDae6.mjs";
import { d as resolvePluginMetadataSnapshotAsync } from "./plugin-metadata-snapshot-DET-4y9k.mjs";
import { d as hasAgentDatabaseAdmissions, l as evaluateAgentDatabaseAdmissions, n as assertAgentDatabaseAdmitted, v as recordAgentDatabaseAdmissions } from "./agent-database-admission-CeDA0ojh.mjs";
import { h as labelRuntimeContextText } from "./types-BXd0kI8-.mjs";
import { a as getActiveSecretsRuntimeConfigSnapshot } from "./runtime-state-DDDhACod.mjs";
import { i as DEFAULT_PROVIDER, n as DEFAULT_MODEL } from "./defaults-Bg930vxE.mjs";
import { t as splitTrailingAuthProfile } from "./model-ref-profile-BNjB2hED.mjs";
import { i as resolveSessionAuthProfileOverrideSource, r as resolveCollapsedSessionAuthPinSource } from "./auth-profile-override-provenance-Jztnei-C.mjs";
import { a as resolveSessionModelOverrideRouteResolution, n as hasSessionAutoModelFallbackProvenance, r as hasSessionAutoModelSelection, t as hasSessionActiveAutoModelFallback } from "./model-override-provenance-ByJqxWxk.mjs";
import { n as resolveEffectiveAgentSkillFilter } from "./agent-filter-B-HgchuV.mjs";
import { _ as resolveSessionAgentIds, d as resolveAutoFallbackPrimaryProbe, f as resolveEffectiveModelFallbacks, h as resolveSessionAgentId, i as markAutoFallbackPrimaryProbe, n as entryMatchesAutoFallbackPrimaryProbe, r as hasLegacyAutoFallbackWithoutOrigin, t as clearAutoFallbackPrimaryProbeSelection } from "./agent-scope-DXrnO3F4.mjs";
import "./agent-runtime-id-BZLMe-UU.mjs";
import { n as withPluginRuntimeGenerationScope } from "./generation-scope-CwTBwQp1.mjs";
import { h as resolveConfiguredModelRef, o as dedupeModelCatalogEntries, r as buildConfiguredModelCatalog } from "./model-selection-shared-CVU_V2PQ.mjs";
import { i as prepareModelRunCapabilities, n as findModelInCatalog } from "./model-catalog-lookup-BJKolYfz.mjs";
import { t as resolveDefaultModelForAgent } from "./model-selection-config-CrboVKXT.mjs";
import { a as formatThinkingLevelClampNotice, f as normalizeVerboseLevel, l as normalizeThinkLevel } from "./thinking.shared-Be8dhC75.mjs";
import { a as listOpenAIAuthProfileProvidersForAgentRuntime } from "./openai-routing-Bm7d8DH8.mjs";
import "./message-channel-constants-B3vfipkP.mjs";
import { r as discoverConfigSecretTargetsByIds } from "./target-registry-query-DOYceNvb.mjs";
import "./target-registry-CSb4wosA.mjs";
import { l as readConfigFileSnapshotForWrite, t as captureRuntimeConfigAsyncReader } from "./io.runtime-Ds5uC0Bf.mjs";
import "./io-DIF-KW3P.mjs";
import { i as readPendingUserTurnTranscriptAdmission } from "./user-turn-transcript-admission-BZunVvZI.mjs";
import { a as resolveMessageChannel, t as isDeliverableMessageChannel } from "./message-channel-normalize-CsnAJK7x.mjs";
import { n as assertOperatorModelAllowed, t as assertAdmittedRunOperatorAuthority, u as getAdmittedRunDelegatedAuthority } from "./admitted-run-context-h1ULFETN.mjs";
import "./message-channel-DmAdWHmL.mjs";
import { rt as buildMainSessionRecoverySettlementPatch } from "./session-actor-memory-owner-BSARM2d5.mjs";
import { d as recordSessionHumanDirectMessage, n as classifySessionStateActor } from "./session-state-events-BCzDVKh0.mjs";
import { i as getFailoverErrorCode } from "./error-Bcp4ZyOv.mjs";
import { g as throwAgentRunRestartAbortReason, m as resolveAgentRunErrorLifecycleFields, o as createAgentRunRestartAbortError, p as resolveAgentRunAbortLifecycleFields, u as isAgentRunRestartAbortReason } from "./run-termination-Dwf1ksjA.mjs";
import { i as resolveSessionWorkStartBlock } from "./session-work-start-Sz_vqYld.mjs";
import { d as stringifyRouteThreadId } from "./channel-route-2bD3dZs2.mjs";
import { c as normalizeDeliveryContext } from "./delivery-context.shared-I8-iaaj1.mjs";
import { D as setReplyPayloadMetadata, c as getReplyPayloadMetadata } from "./reply-payload-BLX_BF2U.mjs";
import { a as hasBillableUsage, d as toDiagnosticUsage } from "./usage-BqbJmOEZ.mjs";
import { n as sessionDeliveryChannel, r as sessionDeliveryOrigin } from "./delivery-context.read-CR06zOJ4.mjs";
import { a as normalizeStoreSessionKey } from "./store-entry-CUxN9KZj.mjs";
import { r as resolveSqliteSessionKey } from "./session-accessor.sqlite-scope-helpers-XTtpZpWK.mjs";
import { l as isAgentMediatedCompletionSourceTool, m as isSubagentCoordinationInputProvenance } from "./input-provenance-D1LHo5Qj.mjs";
import { l as buildSessionCreationStamp } from "./session-entry-lineage-B7Mubzwj.mjs";
import { i as SessionWorkStartChangedError, o as createSessionWorkStartChangedError, s as isSessionWorkStartInvalidatedError } from "./work-start-error-BI-UhSB2.mjs";
import { C as mergeRestartRecoveryTerminalDeliveryEvidence, T as normalizeMainSessionRecoveryRunFences, _ as getRestartRecoveryTerminalDeliveryEvidence, b as hasRestartRecoveryTerminalRun, g as getRestartRecoveryPendingFinalSourceRunId, v as hasMainSessionRecoveryClaim, w as mergeRestartRecoveryTerminalRunIds, x as isMainRestartRecoveryCandidate } from "./store-maintenance-BqMt1Twc.mjs";
import { u as projectRuntimeContextFragments } from "./internal-runtime-context-DLJtDQoI.mjs";
import { a as isModelSelectionLocked, o as repairProviderWrappedModelOverride, r as applyModelOverrideToSessionEntry } from "./model-overrides-CgHG3YVT.mjs";
import { n as SILENT_REPLY_TOKEN } from "./tokens-DHFPcfdZ.mjs";
import { _ as renderFailoverCodeUserCopy } from "./user-copy-BAz4s3EV.mjs";
import { n as isContextOverflowErrorFromTables } from "./context-overflow-tables-Cn71vUg0.mjs";
import { a as readCapturedSessionActorEntry, n as captureSessionActorStorageOwner } from "./session-actor-storage-binding-oCtbPk00.mjs";
import "./session-accessor.sqlite-scope-9ysL95gx.mjs";
import { i as readSessionEntryReadOnlyInWorker } from "./session-entry-read-runtime-CgqUrGct.mjs";
import "./session-accessor-Czw4l8kI.mjs";
import { f as getCompetingSessionWorkAdmissionRelease, n as beginSessionWorkAdmission, p as getSessionWorkAdmissionOwnerRelease } from "./session-lifecycle-admission-BihxXo5j.mjs";
import { o as patchSessionEntryCore } from "./session-accessor.sqlite-entry-wJ2W65pX.mjs";
import { c as isValidAgentHarnessSessionStoreEntry, l as resolveAgentHarnessSessionContextError, t as AGENT_HARNESS_MODEL_RUN_FORBIDDEN_MESSAGE } from "./agent-harness-session-key-zbrcLVpT.mjs";
import { x as applySessionEntryExactReplacements } from "./session-accessor.entry-mutation-DgCGNicZ.mjs";
import { r as resetSessionEntryLifecycle } from "./session-accessor.sqlite-lifecycle-7VGnaDT3.mjs";
import "./lifecycle-CKc8qk3B.mjs";
import { t as bindSessionRowProjection } from "./session-row-projection-access-BUm5f-cY.mjs";
import { r as normalizeAgentRunTerminalReceipt } from "./agent-run-terminal-receipt-Cxhd8xRy.mjs";
import { r as normalizeAgentRunTerminalReplySnapshot } from "./agent-run-terminal-reply-Cj4mTBR2.mjs";
import { n as resolveAgentTimeoutMs } from "./timeout-BBs3o51w.mjs";
import { r as formatErrorMessageForDisplay } from "./error-diagnostics-Cgksm9ND.mjs";
import { r as resolveModelAliasFromPair } from "./model-selection-resolve-B4Z5ZIMD.mjs";
import { n as createModelVisibilityPolicy } from "./model-visibility-policy-pIK04Peo.mjs";
import { i as resolveOperatorModelDefault } from "./operator-model-policy-3pT6BgLA.mjs";
import { n as resolveAvailableAgentHarnessPolicy } from "./availability-CUqXgij4.mjs";
import "./model-selection-DdQ-ffuG.mjs";
import { n as formatThinkingLevels } from "./thinking-BCNoGfZ5.mjs";
import { i as resolveThinkingSelectionCore, n as resolveConfiguredThinkingDefaultCore } from "./model-thinking-default-BKqBSSHy.mjs";
import { n as isStoredCredentialCompatibleWithAuthProvider } from "./order-CElLtwMu.mjs";
import { i as resolveSessionRuntimeOverrideForProvider } from "./session-runtime-compat-BQN27lQg.mjs";
import { n as loadManifestModelCatalog } from "./model-catalog-vYmFg90_.mjs";
import { n as hasResolvedThinkingCatalogEntry, o as resolveEffectiveAgentRuntime, r as normalizeThinkingCatalogProviders } from "./thinking-runtime-DuxsJR5q.mjs";
import { n as estimateAggregateUsageCost } from "./usage-format-DT58obO2.mjs";
import { i as resolveStoredModelOverrideCore, t as resolveDirectStoredModelOverride } from "./stored-model-overrides-RKQxlZXm.mjs";
import { r as resolveWorktreeForPath, t as acquireWorktreeRunLease } from "./run-lease-D02SNP3d.mjs";
import { i as ensureAuthProfileStoreAsync } from "./store-runtime-CwqGD12G.mjs";
import { r as repairMainSessionRecoveryMutation, t as inspectMainSessionRecoveryLifecycleEvent } from "./main-session-recovery-lifecycle-DY4r6VdX.mjs";
import { i as buildAgentRunTerminalOutcomeFromLifecycleEvent } from "./agent-run-terminal-outcome-D-ijbyA8.mjs";
import { t as mergeAgentRunTerminalOutcome } from "./agent-run-terminal-outcome-merge-Z0dprO9E.mjs";
import { t as resolveFastModeState } from "./fast-mode-DezNRstT.mjs";
import { n as resolveSendPolicy } from "./send-policy-D88FrugM.mjs";
import { n as readPreparedServerMethodModelCatalogs } from "./optional-model-catalog-CdAVHxWe.mjs";
import { t as ensureAgentWorkspace } from "./workspace-3xrXOvoY.mjs";
import { n as clearBootstrapSnapshotOnSessionBoundary } from "./bootstrap-cache-DPiLx4Sp.mjs";
import { t as PreparedModelRuntimeInitialRunAdmissionError } from "./prepared-model-runtime.errors-DCd9wajc.mjs";
import { o as clearRotatedSessionMetadata, r as resolveSession } from "./session-Cb56xLxH.mjs";
import { c as hasNewGeneratedMediaTaskForSessionKey, s as getGeneratedMediaTaskIdsForSessionKey } from "./media-generation-activity-CdYWMYrm.mjs";
import { r as registerGatewayModelCatalogPrivateAccess } from "./server-model-catalog-auth-d5Ty5VGR.mjs";
import { r as createChatRunState } from "./server-chat-state-BW_LW3dq.mjs";
import { i as classifyGatewayStaleInstall } from "./stale-install-CUqZoIvN.mjs";
import { n as getInstallationTarget, t as LOCAL_INSTALLATION_TARGET_UNSUPPORTED } from "./installation-target-context-B9ZDUs_O.mjs";
import { a as withPreparedModelRuntimePluginGenerationScope } from "./prepared-model-runtime-generation-scope-D16PssC2.mjs";
import { r as withAgentPluginRegistry } from "./runtime-plugins-ZiHXv-be.mjs";
import { t as acquireAgentRunPreparedModelRuntime } from "./prepared-model-runtime-wDlPVSla.mjs";
import { t as advanceHarnessCompletionClaim } from "./harness-completion-compaction-C4ZByCQk.mjs";
import { n as createHarnessCompletionSourceAssertion, r as getOwedHarnessCompletionTask, t as captureHarnessCompletionRecovery } from "./agent-harness-completion-recovery-C73KNckX.mjs";
import { a as collectClawToolPolicyCandidates } from "./tool-policy-runtime-CiUuNYdO.mjs";
import { r as recordAgentRunTerminalOutcome } from "./agent-run-terminal-outcome-BOQC0T2X.mjs";
import { o as LiveSessionModelSwitchError } from "./model-fallback-runner-ZDIjnIyf.mjs";
import { o as buildTerminalAgentRunFailureReplyPayload } from "./agent-runner-failure-reply-Dp1XdK6Z.mjs";
import { n as runAgentHarnessBeforeMessageWriteHook } from "./hook-helpers-C0CV-oid.mjs";
import { c as normalizePendingFinalRecoveryPayloads, o as buildRecoverablePendingFinalDeliveryText, s as normalizePendingFinalDeliveryPayloads } from "./send-Ccg5tbzy.mjs";
import { t as isSyntheticSourceReplyTurn } from "./reply-completion-B5n1Cnxm.mjs";
import { t as resolveChannelModelOverride } from "./model-overrides-DCHjkmdI.mjs";
import { n as resolveSessionStableReplyMode } from "./session-stable-reply-mode-BqlaN0Xc.mjs";
import { n as COMMAND_ADMISSION_OWNER, t as REPLY_WORK_ADMISSION_OWNER } from "./reply-turn-admission-owner-Ux12PTb_.mjs";
import { t as MAIN_SESSION_RECOVERY_WORK_ADMISSION_OWNER } from "./main-session-recovery-admission-Chw1atkI.mjs";
import { t as scheduleMainSessionRecoveryPendingTarget } from "./main-session-recovery-owner-release-CIfq4_tj.mjs";
import { a as releaseMainSessionRecoveryOwner, i as refreshMainSessionRecoveryOwner, r as inspectMainSessionRecoveryRequired, t as claimMainSessionRecoveryOwner } from "./main-session-recovery-store-mxhMsBp9.mjs";
import { t as beginForegroundSessionMaintenance } from "./coordinator-CAtNkN-G.mjs";
import { t as createUserTurnTranscriptRecorder } from "./user-turn-transcript-CtVHLnLR.mjs";
import { t as resolveSilentReplySettings } from "./silent-reply-D-IlSCe7.mjs";
import { t as resolveModelProviderAuthConfig } from "./model-auth-provider-route-BGgWpgXk.mjs";
import { n as buildAgentHookContextIdentityFields, t as buildAgentHookContextChannelFields } from "./hook-agent-context-C9bjjC7S.mjs";
import { f as runWithCronCreatorAuthorityCapability, u as createCronCreatorAuthorityCapability } from "./cron-creator-authority-context-B7AqRmnW.mjs";
import { t as isHeartbeatLifecycleRunKind } from "./bootstrap-mode-BarAnCx4.mjs";
import { t as AGENT_LANE_SUBAGENT } from "./lanes-BJoXx6GG.mjs";
import { n as prepareInternalSessionEffectsSession, t as createInternalSessionEffectsCleanup } from "./internal-session-effects-C8cXF_VC.mjs";
import { t as buildOutboundSessionContext } from "./session-context-ClwiWEpN.mjs";
import { r as resolveMessageChannelSelection } from "./channel-selection-D2GvoKZ-.mjs";
import { a as hasVisibleAgentPayload, i as hasIntentionalSilentAgentPayload } from "./message-visibility-P0cXqUe6.mjs";
import { c as resolveInternalEventTranscriptBody, o as resolveAcpPromptBody } from "./internal-events-Crl175ti.mjs";
import { _ as hasVisibleCommittedMessagingToolDeliveryEvidence, g as hasUnaccountedMessagingToolAggregateEvidence, i as collectMessagingToolDeliveredMediaUrls, l as hasCommittedOutboundDeliveryEvidence, o as getAutomaticDeliveryEvidence, r as collectDeliveredMediaUrls } from "./delivery-evidence-Do1wex_l.mjs";
import { t as normalizeAgentRunTerminalDeliverySnapshot } from "./agent-run-terminal-delivery-CA3z25Fw.mjs";
import { n as getAgentRuntimeOptionalCommandSecretPaths, t as getAgentRuntimeCommandSecretTargetIds, u as getScopedChannelsCommandSecretTargets } from "./command-secret-targets-C_0e9XHi.mjs";
import { r as shouldPreserveUnavailableSessionAuthProfileOverride } from "./auth-profile-preservation-UYIf2L8-.mjs";
import { n as normalizeSpawnedRunMetadata } from "./spawned-context-B5FDP6Bm.mjs";
import { y as createDeferredEmbeddedRunLifecycleManager } from "./builtin-openclaw-CMvbELtK.mjs";
import { r as buildUsageWithNoCost } from "./stream-message-shared-CYuIJ_XF.mjs";
import { t as createTrajectoryRuntimeRecorder } from "./runtime-j-hZS2Rj.mjs";
import { i as clearAgentRunTerminalWriteContext } from "./agent-run-terminal-writes-D1C5plfs.mjs";
import "./selection-2hiqqZF8.mjs";
import { t as ensureSelectedAgentHarnessPlugin } from "./runtime-plugin-Cq540iGR.mjs";
import { n as mergeAttemptToolMediaPayloads } from "./tool-media-payloads-Bo7KGT_H.mjs";
import "./live-model-switch-DJo_mh8Y.mjs";
import { n as incrementCompactionCount } from "./session-updates-gu7HvAu8.mjs";
import { t as applyModelRuntimeDirective } from "./directive-handling.model-runtime-8QOLmJ6L.mjs";
import { t as clearSessionAuthProfileOverride } from "./session-override-CZTCnQMa.mjs";
import { r as mergeSessionSnapshotChanges } from "./session-snapshot-merge-Dh-eJoIb.mjs";
import { i as resolveGroupRequireMention, n as buildSourceConversationContext, r as defaultGroupActivation, t as buildGroupIntro } from "./groups-CJCugo6w.mjs";
import { n as prepareReplyConversation } from "./prompt-session-context-9INQZrEO.mjs";
import { t as buildDeliveryFormatPrompt } from "./delivery-format-prompt-DFV20sdy.mjs";
import { t as buildInboundMetaSystemPrompt } from "./inbound-meta-Caq6o9f9.mjs";
import { i as resolveInlineAgentImageAttachments } from "./agent-turn-attachments-CBEflaiq.mjs";
import { t as ensureSessionDiffBaseline } from "./session-diff-baseline-8nBnCSXG.mjs";
import { n as clearCommittedSessionResetRuntimeState } from "./session-reset-cleanup-u-ZRUSad.mjs";
import { a as matchesPendingFinalRecoverySource, i as advancePendingFinalRecoverySource, n as prepareAgentCommandExecutionIdentity, r as sanitizePublicAgentCommandIngressOpts, t as executionIdentity } from "./agent-command-execution-identity-DsyeMX5O.mjs";
import { t as withLocalAgentCronJobsRemoved } from "./local-service-3sn0Id6Z.mjs";
import { t as loadGatewayConfigRevisionProjector } from "./config-revision-token-BzoBJegw.mjs";
import { t as NodeRegistry } from "./node-registry-DEW2P2-e.mjs";
import { a as readPreparedGatewayModelCatalogBatch, i as readPreparedGatewayModelCatalog, n as loadGatewayModelCatalogSnapshot, o as readPreparedGatewayModelCatalogOwnerSnapshot, r as loadPreparedGatewayModelCatalogSnapshot, t as loadGatewayModelCatalog } from "./server-model-catalog-DWoTsvXa.mjs";
import { t as resolveSessionRequestTargets } from "./session-request-targets-BnYco3Jn.mjs";
import { n as resolveAgentExplicitRecipientSession, r as resolveAgentOutboundTarget, t as resolveAgentDeliveryPlanWithSessionRoute } from "./agent-delivery-DbfbUO7k.mjs";
import { t as measureAgentStartup } from "./startup-timing-D4XTWDd_.mjs";
import { a as loadAcpPolicyRuntime, c as loadAgentRunnerMemoryRuntime, d as loadDeliveryRuntime, f as loadExecDefaultsRuntime, g as resolveAgentCommandDeps, h as loadTranscriptAppendRuntime, i as loadAcpManagerRuntime, l as loadAttemptExecutionRuntime, m as loadSkillsRuntime, n as scheduleSessionMaintenance, o as loadAcpRuntimeErrorsRuntime, p as loadSessionStoreRuntime, r as createCommandBudget, s as loadAcpSessionIdentifiersRuntime, t as createSessionMaintenanceFollowup, u as loadCliCompactionRuntime } from "./run-DxDbT7zp.mjs";
import { t as createLazyAcpElicitationHandler } from "./acp-elicitation-handler-lazy-BLr1ei7U.mjs";
import { t as hasSameCompactionWriter } from "./agent-runner-compaction-accounting-DY304lro.mjs";
import { n as normalizeExplicitOverrideInput, r as parseAgentCommandModelRef, t as normalizeAgentCommandModelRef } from "./model-ref-Cggw5C69.mjs";
import { a as selectSourceDeliverablePayloads } from "./delivery-result-2UZHQJ-q.mjs";
import { r as buildRunEntryTerminal, t as runEmbeddedAgentEntry } from "./run-entry-Bh1g2wCR.mjs";
import { r as resetAgentAttemptLifecycle, t as createAgentAttemptLifecycleCallbacks } from "./attempt-callbacks-n8R-aP3x.mjs";
import { n as applyVerboseOverride } from "./level-overrides-Bo53Mvf6.mjs";
import { t as createRestartRecoveryOperatorSource } from "./operator-run-recovery-source-Cq--QOeE.mjs";
import { randomUUID } from "node:crypto";
import path from "node:path";
import { isDeepStrictEqual } from "node:util";
import { addAbortListener } from "node:events";
//#region src/gateway/local-request-context.ts
async function cronUnavailable() {
	throw new Error("Cron is unavailable in local embedded agent gateway context.");
}
const unavailableCron = {
	start: cronUnavailable,
	stop: () => {},
	pauseScheduling: () => {},
	resumeScheduling: () => {},
	status: cronUnavailable,
	list: cronUnavailable,
	listPage: cronUnavailable,
	add: cronUnavailable,
	update: cronUnavailable,
	updateWithPrecondition: cronUnavailable,
	remove: cronUnavailable,
	removeStaleJobFamily: cronUnavailable,
	removeAgentJobsTransactional: cronUnavailable,
	quiesceJobs: cronUnavailable,
	run: cronUnavailable,
	enqueueRun: cronUnavailable,
	readEventSources: cronUnavailable,
	runEvent: cronUnavailable,
	waitForManualRun: cronUnavailable,
	getJob: () => void 0,
	readJob: async () => void 0,
	readScratch: cronUnavailable,
	writeScratch: cronUnavailable,
	getDefaultAgentId: () => void 0,
	wake: async () => ({
		ok: false,
		reason: "unwakeable-session-key"
	})
};
/** Creates the minimal gateway context used by embedded local agent execution. */
async function createLocalGatewayRequestContext(params) {
	const logGateway = createSubsystemLogger("gateway/local");
	const resourceHost = getLegacyPluginSdkResourceHost();
	const cron = {
		...unavailableCron,
		removeAgentJobsTransactional: async (agentId, commit) => await withLocalAgentCronJobsRemoved(agentId, params.getRuntimeConfig, commit)
	};
	const sessionEvents = /* @__PURE__ */ new Set();
	const chatRunState = createChatRunState();
	const loadCatalogSnapshot = (loadParams) => loadGatewayModelCatalogSnapshot({
		...loadParams,
		getConfig: params.getRuntimeConfig
	});
	registerGatewayModelCatalogPrivateAccess(loadCatalogSnapshot, {
		loadDeferred: (loadParams) => loadPreparedGatewayModelCatalogSnapshot({
			...loadParams,
			getConfig: params.getRuntimeConfig
		}),
		readPrepared: (loadParams) => readPreparedGatewayModelCatalogOwnerSnapshot({
			...loadParams,
			getConfig: params.getRuntimeConfig
		})
	});
	const context = {
		localEmbedded: true,
		trackExecution: trackAsyncWork,
		deps: params.deps,
		configRevisionProjector: await loadGatewayConfigRevisionProjector({ env: process.env }),
		cron,
		cronStorePath: "",
		getRuntimeConfig: params.getRuntimeConfig,
		resolveSessionRequestTargets: (request) => resolveSessionRequestTargets({
			...request,
			context
		}),
		isConfigReloadSettled: () => false,
		resolveTerminalLaunchPolicy: () => ({
			ok: false,
			block: { kind: "disabled" }
		}),
		isTerminalEnabled: () => false,
		loadGatewayModelCatalog: (loadParams) => loadGatewayModelCatalog({
			...loadParams,
			getConfig: params.getRuntimeConfig
		}),
		loadGatewayModelCatalogSnapshot: loadCatalogSnapshot,
		readPreparedGatewayModelCatalog: (loadParams) => readPreparedGatewayModelCatalog({
			...loadParams,
			getConfig: params.getRuntimeConfig
		}),
		readPreparedGatewayModelCatalogBatch: (agentIds) => readPreparedGatewayModelCatalogBatch(agentIds, { getConfig: params.getRuntimeConfig }),
		readChatMetadata: async () => {
			throw new Error("Chat metadata is unavailable in local embedded agent gateway context.");
		},
		getHealthCache: () => null,
		refreshHealthSnapshot: async () => ({}),
		logHealth: { error: (message) => logGateway.error(message) },
		logGateway,
		publishPresence: () => {},
		getPresenceSnapshot: () => {
			throw new Error("Presence requires a running Gateway connection.");
		},
		broadcast: () => {},
		broadcastToConnIds: () => {},
		nodeSendToSession: () => {},
		nodeSendToAllSubscribed: () => {},
		nodeSubscribe: () => {},
		nodeUnsubscribe: () => {},
		nodeUnsubscribeAll: () => {},
		hasConnectedTalkNode: async () => false,
		nodeRegistry: new NodeRegistry(),
		agentRunSeq: /* @__PURE__ */ new Map(),
		chatAbortControllers: /* @__PURE__ */ new Map(),
		chatQueuedTurns: /* @__PURE__ */ new Map(),
		chatRunState,
		addChatRun: chatRunState.registry.add,
		removeChatRun: chatRunState.registry.remove,
		subscribeSessionEvents: (connId) => {
			sessionEvents.add(connId);
		},
		unsubscribeSessionEvents: (connId) => {
			sessionEvents.delete(connId);
		},
		forgetConnectionAncestors: () => {},
		subscribeSessionMessageEvents: () => void 0,
		unsubscribeSessionMessageEvents: () => {},
		unsubscribeAllSessionEvents: (connId) => {
			sessionEvents.delete(connId);
		},
		getSessionEventSubscriberConnIds: () => sessionEvents,
		registerToolEventRecipient: () => {},
		dedupe: /* @__PURE__ */ new Map(),
		wizardSessions: /* @__PURE__ */ new Map(),
		systemAgentSessions: /* @__PURE__ */ new Map(),
		findRunningWizard: () => null,
		purgeWizardSession: () => {},
		getRuntimeSnapshot: () => ({}),
		startChannel: async () => {
			throw new Error("Channel start is unavailable in local embedded agent gateway context.");
		},
		stopChannel: async () => {
			throw new Error("Channel stop is unavailable in local embedded agent gateway context.");
		},
		markChannelLoggedOut: () => {},
		wizardRunner: async () => {
			throw new Error("Onboarding wizard is unavailable in local embedded agent gateway context.");
		},
		channelWizardRunner: async () => {
			throw new Error("Channel setup wizard is unavailable in local embedded agent gateway context.");
		},
		broadcastVoiceWakeChanged: () => {},
		broadcastVoiceWakeRoutingChanged: () => {},
		unavailableGatewayMethods: /* @__PURE__ */ new Set()
	};
	let projection;
	let initializing;
	bindSessionRowProjection(context, () => projection);
	context.ensureSessionRowProjection = () => {
		if (!initializing) {
			resourceHost.adopt(context, { release: async () => {
				await initializing?.catch(() => {});
				projection?.dispose();
				await projection?.ensureMaterialized();
			} });
			initializing = import("./session-row-projection-DgaaSSk_.mjs").then(async ({ createSessionRowProjection }) => {
				projection = await createSessionRowProjection({
					cfg: params.getRuntimeConfig(),
					getConfig: params.getRuntimeConfig,
					getModelCatalog: () => readPreparedServerMethodModelCatalogs(context, listAgentIds(params.getRuntimeConfig())),
					context
				});
			});
		}
		return initializing;
	};
	context.createAgentTurnFacade = async (principal) => {
		const { createInternalAgentTurnFacade } = await import("./internal-facade.runtime.js");
		return createInternalAgentTurnFacade({
			...principal,
			getContext: () => context
		});
	};
	return context;
}
/** Runs code inside a local gateway request scope unless an outer scope already exists. */
async function withLocalGatewayRequestScope(params, run) {
	const existing = getPluginRuntimeGatewayRequestScope();
	if (existing?.context || existing?.resolveGatewayContext) return await run();
	const context = await createLocalGatewayRequestContext(params);
	const resolveGatewayContext = () => context;
	context.resolveGatewayContext = resolveGatewayContext;
	bindLegacyPluginSdkResourceHost(resolveGatewayContext, getLegacyPluginSdkResourceHost());
	return await withPluginRuntimeGatewayRequestScope({
		...existing,
		context,
		resolveGatewayContext,
		isWebchatConnect: existing?.isWebchatConnect ?? (() => false)
	}, run);
}
//#endregion
//#region src/agents/agent-command-recovery-owner.ts
const log$9 = createSubsystemLogger("agents/agent-command");
function refreshPreparedRecoveryOwnerTarget(prepared, acquired) {
	if (!acquired || acquired.entry.sessionId !== prepared.sessionId) return;
	const entry = structuredClone(acquired.entry);
	prepared.sessionEntry = entry;
	if (prepared.sessionStore && prepared.sessionKey) prepared.sessionStore[prepared.sessionKey] = entry;
}
async function claimAgentCommandRecoveryOwner(params) {
	const transferredLease = params.opts.mainRestartRecoveryOwnerLease;
	if (transferredLease) {
		const expectedLeaseSessionId = params.prepared.isNewSession ? params.prepared.previousSessionId : params.prepared.sessionId;
		const snapshot = expectedLeaseSessionId !== void 0 && transferredLease.lifecycleGeneration === params.lifecycleGeneration && transferredLease.sessionId === expectedLeaseSessionId && transferredLease.sessionKey === params.prepared.sessionKey && (transferredLease.agentId === void 0 || transferredLease.agentId === params.prepared.sessionAgentId) && path.resolve(transferredLease.storePath) === path.resolve(params.prepared.storePath) ? await refreshMainSessionRecoveryOwner(transferredLease, params.opts.runId) : void 0;
		if (!snapshot) throw new Error("main-session recovery owner changed during ingress preparation; retry");
		return snapshot;
	}
	if (params.opts.sessionEffects === "internal") return;
	if (params.opts.mainRestartRecoveryAdmitted === true) return;
	const sessionKey = params.prepared.sessionKey;
	if (!sessionKey) return;
	const target = {
		agentId: params.prepared.sessionAgentId,
		sessionKey,
		storePath: params.prepared.storePath
	};
	if (params.mode === "reject_uncoordinated") {
		const recoveryInspection = await inspectMainSessionRecoveryRequired({
			allowMissingSession: params.prepared.isNewSession && !params.prepared.previousSessionId || params.opts.sessionId?.trim() === params.prepared.sessionId,
			expectedSessionId: params.prepared.previousSessionId ?? params.prepared.sessionId,
			lifecycleGeneration: params.lifecycleGeneration,
			target
		});
		if (recoveryInspection.kind === "invalidated") throw createSessionWorkStartChangedError(sessionKey);
		if (recoveryInspection.kind === "required") throw new Error(`Session "${sessionKey}" has interrupted work pending restart recovery; retry through a healthy Gateway or reset it there with /new or /reset.`);
		return;
	}
	const claim = await claimMainSessionRecoveryOwner({
		allowMissingSession: params.prepared.isNewSession && !params.prepared.previousSessionId || params.opts.sessionId?.trim() === params.prepared.sessionId,
		lifecycleGeneration: params.lifecycleGeneration,
		sessionId: params.prepared.previousSessionId ?? params.prepared.sessionId,
		replacementSessionId: params.prepared.isNewSession ? params.prepared.sessionId : void 0,
		runId: params.opts.runId,
		target
	});
	if (claim.kind === "invalidated") throw createSessionWorkStartChangedError(sessionKey);
	if (claim.kind === "not_required") {
		if (params.opts.runId && ["subagent_settle", "subagent_announce"].includes(params.opts.inputProvenance?.sourceTool ?? "") && hasRestartRecoveryTerminalRun(claim.entry, params.opts.runId)) throw createSessionWorkStartChangedError(sessionKey);
		return;
	}
	return {
		lease: claim.lease,
		entry: claim.entry,
		sessionKey: claim.sessionKey
	};
}
async function runWithAgentCommandRecoveryOwner(options) {
	const interrupted = new AbortController();
	const params = {
		...options,
		opts: {
			...options.opts,
			abortSignal: options.opts.abortSignal ? AbortSignal.any([options.opts.abortSignal, interrupted.signal]) : interrupted.signal
		}
	};
	const assertCurrent = () => {
		params.opts.abortSignal.throwIfAborted();
		assertAgentRunLifecycleGenerationCurrent(params.lifecycleGeneration);
		params.opts.assertSourceCurrent?.();
		params.opts.operatorAuthority?.assertCurrent();
	};
	let lease = params.opts.mainRestartRecoveryOwnerLease;
	let commandAdmission;
	let pendingRecovery = void 0;
	let prepared;
	try {
		try {
			prepared = await params.prepare(params.opts);
		} catch (error) {
			const restoreAdmittedRecovery = params.restoreAdmittedRecovery;
			if (restoreAdmittedRecovery) pendingRecovery = await repairMainSessionRecoveryMutation({
				mutation: restoreAdmittedRecovery,
				onDeferredSuccess: scheduleMainSessionRecoveryPendingTarget,
				onError: (restoreError) => log$9.warn(`failed to restore admitted recovery after command preparation: ${formatErrorMessage(restoreError)}`)
			});
			throw error;
		}
		const target = prepared;
		const sourceTool = params.opts.inputProvenance?.sourceTool;
		const mayWaitForRecovery = params.mode === "claim" && (sourceTool === "subagent_settle" || sourceTool === "subagent_announce") && params.opts.sessionEffects !== "internal" && !params.opts.mainRestartRecoveryAdmitted && !params.opts.mainRestartRecoveryOwnerLease;
		const ownerRelease = (owner) => getSessionWorkAdmissionOwnerRelease({
			scope: target.storePath,
			identities: [target.sessionKey, target.previousSessionId ?? target.sessionId],
			owner
		});
		const recoveryOwnerRelease = () => mayWaitForRecovery ? ownerRelease(MAIN_SESSION_RECOVERY_WORK_ADMISSION_OWNER) : void 0;
		const replyOwnerRelease = () => params.mode === "claim" && !params.opts.mainRestartRecoveryOwnerLease ? ownerRelease(REPLY_WORK_ADMISSION_OWNER) : void 0;
		const releaseCommandAdmission = () => {
			commandAdmission?.release();
			commandAdmission = void 0;
		};
		let predecessorReply = params.mode === "claim" && params.opts.sessionEffects !== "internal" && !params.opts.mainRestartRecoveryOwnerLease ? getCompetingSessionWorkAdmissionRelease({
			scope: target.storePath,
			identities: [target.sessionKey, target.previousSessionId ?? target.sessionId],
			owner: REPLY_WORK_ADMISSION_OWNER
		}) : void 0;
		let pendingOwner = recoveryOwnerRelease();
		let acquired;
		for (;;) {
			if (pendingOwner) {
				await racePromiseWithAbortSignal(pendingOwner, params.opts.abortSignal);
				assertCurrent();
				await prepared.runLease?.release();
				prepared = void 0;
				prepared = await params.prepare(params.opts);
				if (prepared.sessionId !== target.sessionId || prepared.previousSessionId !== target.previousSessionId || prepared.sessionKey !== target.sessionKey || path.resolve(prepared.storePath) !== path.resolve(target.storePath)) throw createSessionWorkStartChangedError(target.sessionKey ?? target.sessionId);
			}
			assertCurrent();
			if (!commandAdmission && params.opts.sessionEffects !== "internal") commandAdmission = await beginSessionWorkAdmission({
				agentId: prepared.sessionAgentId,
				scope: prepared.storePath ?? `agent:${prepared.sessionAgentId}`,
				isSettling: params.opts.isTerminalOutcomeObserved,
				identities: [prepared.sessionKey, prepared.previousSessionId ?? prepared.sessionId],
				owner: COMMAND_ADMISSION_OWNER,
				serializeOwner: true,
				signal: params.opts.abortSignal,
				onInterrupt: (reason) => interrupted.abort(reason),
				assertAllowed: assertCurrent
			});
			const pendingReply = replyOwnerRelease();
			try {
				pendingOwner = recoveryOwnerRelease();
				if (pendingOwner) {
					releaseCommandAdmission();
					continue;
				}
				acquired = await claimAgentCommandRecoveryOwner({
					...params,
					prepared
				});
			} catch (error) {
				if (!(error instanceof SessionWorkStartChangedError)) throw error;
				pendingOwner = recoveryOwnerRelease();
				if (pendingOwner) releaseCommandAdmission();
				else {
					pendingOwner = pendingReply ?? replyOwnerRelease();
					predecessorReply = void 0;
				}
				if (!pendingOwner) throw error;
				continue;
			}
			if (!acquired && predecessorReply) {
				pendingOwner = predecessorReply;
				predecessorReply = void 0;
				continue;
			}
			pendingOwner = acquired ? void 0 : recoveryOwnerRelease();
			if (!pendingOwner) break;
			releaseCommandAdmission();
		}
		lease = acquired?.lease;
		assertCurrent();
		refreshPreparedRecoveryOwnerTarget(prepared, acquired);
		const admitted = prepared;
		return await (commandAdmission ? commandAdmission.run(() => params.run(admitted)) : params.run(admitted));
	} finally {
		try {
			const releasedRecovery = await releaseMainSessionRecoveryOwner(lease);
			pendingRecovery ??= releasedRecovery;
		} catch (error) {
			log$9.warn(`failed to release main-session recovery owner: ${formatErrorMessage(error)}`);
		}
		try {
			await prepared?.runLease?.release();
		} finally {
			commandAdmission?.release();
			scheduleMainSessionRecoveryPendingTarget(pendingRecovery);
		}
	}
}
//#endregion
//#region src/agents/agent-runtime-config.ts
/** Resolves agent runtime config, including SecretRef materialization for agent command use. */
/** Loads runtime/source config and resolves command SecretRefs when the agent path needs them. */
async function resolveAgentRuntimeConfig(runtime, params) {
	const loadedRaw = await captureRuntimeConfigAsyncReader()();
	const includeChannelTargets = params?.runtimeTargetsChannelSecrets === true;
	const channelSecretScope = params?.runtimeChannelSecretScope;
	const hasRuntimeSecretRefs = hasAgentRuntimeSecretRefs({
		config: loadedRaw,
		includeChannelTargets,
		channel: channelSecretScope?.channel
	});
	const activeSecretsConfig = getActiveSecretsRuntimeConfigSnapshot();
	let pluginMetadataSnapshot;
	const sourceConfig = activeSecretsConfig ? activeSecretsConfig.sourceConfig : await measureAgentStartup("config-source", async () => {
		try {
			const { snapshot, writeOptions } = await readConfigFileSnapshotForWrite();
			if (snapshot.valid) {
				pluginMetadataSnapshot = writeOptions.basePluginMetadataSnapshot;
				return snapshot.resolved;
			}
		} catch {}
		pluginMetadataSnapshot = await resolvePluginMetadataSnapshotAsync({ config: loadedRaw });
		return loadedRaw;
	}, { config: loadedRaw });
	let cfg = loadedRaw;
	if (hasRuntimeSecretRefs) {
		const runtimeSecretTargets = resolveAgentRuntimeSecretTargets({
			config: loadedRaw,
			includeChannelTargets,
			channelSecretScope
		});
		const { resolveCommandConfigWithSecrets } = await import("./command-config-resolution.runtime.js");
		cfg = (await resolveCommandConfigWithSecrets({
			config: loadedRaw,
			commandName: "agent",
			targetIds: runtimeSecretTargets.targetIds,
			...runtimeSecretTargets.allowedPaths ? { allowedPaths: runtimeSecretTargets.allowedPaths } : {},
			...runtimeSecretTargets.optionalActivePaths.size > 0 ? { optionalActivePaths: runtimeSecretTargets.optionalActivePaths } : {},
			runtime
		})).resolvedConfig;
	}
	if (activeSecretsConfig && cfg !== loadedRaw) setRuntimeConfigSnapshot(cfg, sourceConfig);
	else if (!activeSecretsConfig) {
		const secretsRuntime = await measureAgentStartup("secrets-runtime-import", () => import("./runtime-B_N0bpgX.mjs"), { config: cfg });
		const hasClawToolPolicies = collectClawToolPolicyCandidates(cfg).length > 0;
		const [snapshot, provenance, clawToolPolicyRuntime] = await Promise.all([
			measureAgentStartup("secrets-snapshot", () => secretsRuntime.prepareSecretsRuntimeSnapshot({
				config: sourceConfig,
				assignmentConfig: cfg,
				includeConfigRefs: false,
				...pluginMetadataSnapshot ? { pluginMetadataSnapshot } : {}
			}), { config: cfg }),
			hasClawToolPolicies ? import("./provenance-runtime-read-CRvUGq7r.mjs").then(({ prepareClawInstallSchemaVersions }) => prepareClawInstallSchemaVersions({ artifactPreservingReadOnly: false })) : void 0,
			hasClawToolPolicies ? import("./tool-policy-runtime-CV5LRrUt.mjs") : void 0
		]);
		provenance?.publish();
		secretsRuntime.activateSecretsRuntimeSnapshot(snapshot);
		clawToolPolicyRuntime?.prepareCapturedClawToolPolicyConsent(cfg, {});
	}
	return cfg;
}
function hasNestedSecretRef(value) {
	if (isSecretRef(value)) return true;
	if (Array.isArray(value)) return value.some(hasNestedSecretRef);
	if (!value || typeof value !== "object") return false;
	return Object.values(value).some(hasNestedSecretRef);
}
function hasAgentRuntimeSecretRefs(params) {
	const { config } = params;
	return hasNestedSecretRef(config.models?.providers) || hasNestedSecretRef(config.memory?.search?.remote) || listAgentEntries(config).some((agent) => hasNestedSecretRef({
		memoryRemote: agent.memory?.search?.remote,
		tts: agent.tts
	})) || hasNestedSecretRef(config.tts) || hasNestedSecretRef(config.skills?.entries) || hasNestedSecretRef(config.tools?.web?.search) || Object.values(config.plugins?.entries ?? {}).some((entry) => hasNestedSecretRef({
		webSearch: entry?.config?.webSearch,
		webFetch: entry?.config?.webFetch
	})) || hasNestedSecretRef(params.includeChannelTargets ? config.channels : params.channel ? config.channels?.[params.channel] : void 0);
}
function resolveAgentRuntimeSecretTargets(params) {
	const baseTargetIds = getAgentRuntimeCommandSecretTargetIds({
		config: params.config,
		includeChannelTargets: params.includeChannelTargets
	});
	const optionalActivePaths = getAgentRuntimeOptionalCommandSecretPaths(params.config);
	if (params.includeChannelTargets || !params.channelSecretScope) return {
		targetIds: baseTargetIds,
		optionalActivePaths
	};
	const channelTargets = getScopedChannelsCommandSecretTargets({
		config: params.config,
		channel: params.channelSecretScope.channel,
		accountId: params.channelSecretScope.accountId,
		defaultAccountWhenMissing: true
	});
	const targetIds = new Set(baseTargetIds);
	for (const targetId of channelTargets.targetIds) targetIds.add(targetId);
	if (!channelTargets.allowedPaths) return {
		targetIds,
		optionalActivePaths
	};
	const allowedPaths = new Set(channelTargets.allowedPaths);
	for (const target of discoverConfigSecretTargetsByIds(params.config, baseTargetIds)) allowedPaths.add(target.path);
	return {
		targetIds,
		allowedPaths,
		optionalActivePaths
	};
}
//#endregion
//#region src/agents/command/explicit-session-key.ts
function resolveExplicitAgentCommandSessionKey(params) {
	if (isUnscopedSessionKeySentinel(params.rawExplicitSessionKey)) return params.rawExplicitSessionKey;
	const unscopedOwnerAgentId = classifySessionKeyShape(params.rawExplicitSessionKey) === "legacy_or_alias" && (params.agentIdOverride || params.shouldScopeDefaultAgentKey) ? resolveSessionAgentIds({
		config: params.cfg,
		agentId: params.agentIdOverride,
		sessionKey: params.rawExplicitSessionKey
	}).sessionAgentId : void 0;
	return scopeLegacySessionKeyToAgent({
		agentId: unscopedOwnerAgentId ?? params.agentIdOverride,
		sessionKey: params.rawExplicitSessionKey,
		mainKey: params.cfg.session?.mainKey
	});
}
//#endregion
//#region src/agents/command/prepare.ts
async function prepareAgentCommandExecution(opts, runtime, runtimeContext) {
	const { abortSignal, assertSourceCurrent, operatorAuthority, lifecycleGeneration: preparationLifecycleGeneration } = opts;
	const isRawModelRun = opts.modelRun === true || opts.promptMode === "none";
	const message = opts.message ?? "";
	if (!message.trim()) throw new Error("Message (--message) is required");
	const rawExplicitSessionKey = opts.sessionKey?.trim();
	const requestedSessionId = opts.sessionId?.trim() || void 0;
	const rawTo = opts.to?.trim();
	const toSessionKey = !rawExplicitSessionKey && !requestedSessionId && classifySessionKeyShape(rawTo) === "agent" ? rawTo : void 0;
	const recipientChannel = resolveMessageChannel(opts.channel);
	const shouldResolveExplicitRecipientSession = Boolean(!rawExplicitSessionKey && !requestedSessionId && !toSessionKey && opts.agentId?.trim() && recipientChannel && isDeliverableMessageChannel(recipientChannel) && rawTo);
	if (!opts.to && !requestedSessionId && !rawExplicitSessionKey && !opts.agentId) throw new Error("Pass --to <E.164>, --session-key, --session-id, or --agent to choose a session");
	const cfg = await (runtimeContext?.config ?? resolveAgentRuntimeConfig(runtime, {
		runtimeTargetsChannelSecrets: opts.deliver === true,
		runtimeChannelSecretScope: opts.deliver !== true && shouldResolveExplicitRecipientSession && recipientChannel ? {
			channel: recipientChannel,
			accountId: opts.accountId
		} : void 0
	}));
	const normalizedSpawned = normalizeSpawnedRunMetadata(opts);
	const agentIdOverrideRaw = opts.agentId?.trim();
	const agentIdOverride = agentIdOverrideRaw ? normalizeAgentId(agentIdOverrideRaw) : void 0;
	if (agentIdOverride) {
		if (!listAgentIds(cfg).includes(agentIdOverride)) throw new Error(`Unknown agent id "${agentIdOverrideRaw}". Use "${formatCliCommand("openclaw agents list")}" to see configured agents.`);
	}
	const shouldScopeDefaultAgentKey = Boolean(rawExplicitSessionKey && !agentIdOverride && classifySessionKeyShape(rawExplicitSessionKey) === "legacy_or_alias" && !isUnscopedSessionKeySentinel(rawExplicitSessionKey));
	const explicitSessionKey = toSessionKey ?? resolveExplicitAgentCommandSessionKey({
		rawExplicitSessionKey,
		agentIdOverride,
		shouldScopeDefaultAgentKey,
		cfg
	});
	if (explicitSessionKey && classifySessionKeyShape(explicitSessionKey) === "malformed_agent") throw new Error(`Invalid --session-key "${explicitSessionKey}". Agent-prefixed session keys must use agent:<agent-id>:<session-key>.`);
	if (agentIdOverride && explicitSessionKey && classifySessionKeyShape(explicitSessionKey) === "agent") {
		const sessionAgentId = resolveAgentIdFromSessionKey(explicitSessionKey);
		if (sessionAgentId !== agentIdOverride) throw new Error(`Agent id "${agentIdOverrideRaw}" does not match session key agent "${sessionAgentId}".`);
	}
	if (agentIdOverride || explicitSessionKey) {
		if (!hasAgentDatabaseAdmissions()) recordAgentDatabaseAdmissions(await evaluateAgentDatabaseAdmissions(cfg));
		assertAgentDatabaseAdmitted(agentIdOverride ?? resolveSessionAgentId({
			sessionKey: explicitSessionKey,
			config: cfg
		}));
	}
	const agentCfg = cfg.agents?.defaults;
	const verboseOverride = normalizeVerboseLevel(opts.verbose);
	if (opts.verbose && !verboseOverride) throw new Error("Invalid verbose level. Use \"on\", \"full\", or \"off\".");
	const isSubagentLane = normalizeOptionalString(opts.lane) === AGENT_LANE_SUBAGENT;
	const hasExplicitTimeoutOption = opts.timeout !== void 0;
	const timeoutSecondsRaw = hasExplicitTimeoutOption ? parseStrictNonNegativeInteger(opts.timeout) ?? NaN : isSubagentLane ? 0 : void 0;
	if (Number.isNaN(timeoutSecondsRaw)) throw new Error("--timeout must be a non-negative integer (seconds; 0 means no timeout)");
	const timeoutMs = resolveAgentTimeoutMs({
		cfg,
		overrideSeconds: timeoutSecondsRaw
	});
	const runTimeoutOverrideMs = hasExplicitTimeoutOption ? timeoutMs : void 0;
	const selectedCommandOpts = toSessionKey ? {
		...opts,
		to: void 0,
		sessionKey: explicitSessionKey
	} : opts;
	const explicitRecipientSession = shouldResolveExplicitRecipientSession && agentIdOverride && recipientChannel && rawTo ? await resolveAgentExplicitRecipientSession({
		cfg,
		agentId: agentIdOverride,
		channel: recipientChannel,
		to: rawTo,
		accountId: selectedCommandOpts.accountId,
		threadId: selectedCommandOpts.threadId
	}) : void 0;
	if (explicitRecipientSession?.error) throw explicitRecipientSession.error;
	let commandOpts = explicitRecipientSession?.sessionKey ? {
		...selectedCommandOpts,
		channel: explicitRecipientSession.channel,
		to: explicitRecipientSession.to,
		accountId: explicitRecipientSession.accountId,
		threadId: explicitRecipientSession.threadId
	} : selectedCommandOpts;
	const assertPreparationCurrent = () => {
		if (abortSignal?.aborted) throw createAbortError("Operation aborted", { cause: abortSignal.reason });
		assertSourceCurrent?.();
		operatorAuthority?.assertCurrent();
		if (preparationLifecycleGeneration !== void 0) assertAgentRunLifecycleGenerationCurrent(preparationLifecycleGeneration);
	};
	const sessionResolution = await resolveSession({
		cfg,
		to: commandOpts.to,
		sessionId: commandOpts.sessionId,
		sessionKey: explicitSessionKey ?? explicitRecipientSession?.sessionKey,
		agentId: agentIdOverride,
		signal: abortSignal,
		assertCurrent: assertPreparationCurrent
	});
	assertPreparationCurrent();
	const { sessionId, sessionKey, sessionEntry: sessionEntryRaw, sessionAgentId, storePath, isNewSession, previousSessionId, automaticReset, persistedThinking, persistedVerbose } = sessionResolution;
	const harnessSessionError = sessionKey ? resolveAgentHarnessSessionContextError(sessionKey, sessionEntryRaw) : void 0;
	if (harnessSessionError) throw new Error(harnessSessionError);
	if (isRawModelRun && sessionKey && sessionEntryRaw?.modelSelectionLocked === true) throw new Error(AGENT_HARNESS_MODEL_RUN_FORBIDDEN_MESSAGE);
	const sessionStore = sessionKey && sessionEntryRaw ? { [sessionKey]: sessionEntryRaw } : {};
	assertAgentDatabaseAdmitted(sessionAgentId);
	const outboundSession = buildOutboundSessionContext({
		cfg,
		agentId: sessionAgentId,
		sessionKey
	});
	const agentWorkspaceDir = resolveAgentWorkspaceDir(cfg, sessionAgentId);
	const workspaceDirRaw = normalizedSpawned.workspaceDir ?? agentWorkspaceDir;
	const workspaceDir = resolveUserPath(workspaceDirRaw);
	const { getAcpSessionManager } = await loadAcpManagerRuntime();
	const acpManager = getAcpSessionManager();
	const assertAcpPreparationCurrent = () => {
		assertPreparationCurrent();
		assertAgentDatabaseAdmitted(sessionAgentId);
	};
	const acpResolution = sessionKey ? await acpManager.resolveSessionAsync({
		cfg,
		sessionKey,
		agentId: sessionAgentId,
		assertCurrent: assertAcpPreparationCurrent
	}) : null;
	assertAcpPreparationCurrent();
	const isAcpPlacedSession = acpResolution !== null && acpResolution.kind !== "none";
	const cwd = normalizeOptionalString(opts.cwd) ?? normalizeOptionalString(sessionEntryRaw?.spawnedCwd) ?? (isAcpPlacedSession ? void 0 : resolveAgentRunCwd(cfg, sessionAgentId));
	const agentDir = resolveAgentDir(cfg, sessionAgentId);
	const pluginsEnabled = cfg.plugins?.enabled !== false;
	const preparedMetadataSnapshot = runtimeContext?.pluginGeneration.pluginMetadataSnapshot;
	const manifestMetadataSnapshot = pluginsEnabled ? preparedMetadataSnapshot ?? await resolvePluginMetadataSnapshotAsync({
		config: cfg,
		env: process.env,
		workspaceDir
	}) : void 0;
	const modelManifestContext = { manifestPlugins: manifestMetadataSnapshot ?? [] };
	const configuredModel = resolveConfiguredModelRef({
		cfg,
		agentId: sessionAgentId,
		defaultProvider: DEFAULT_PROVIDER,
		defaultModel: DEFAULT_MODEL,
		allowPluginNormalization: pluginsEnabled,
		...modelManifestContext
	});
	const configuredThinkingCatalog = buildConfiguredModelCatalog({
		cfg,
		workspaceDir,
		...modelManifestContext
	});
	const configuredThinkingRuntime = resolveEffectiveAgentRuntime({
		cfg,
		provider: configuredModel.provider,
		modelId: configuredModel.model,
		agentId: sessionAgentId,
		sessionKey,
		sessionEntry: sessionEntryRaw
	});
	const sessionStableReplyMode = await resolveSessionStableReplyMode({
		cfg,
		metadataSnapshot: manifestMetadataSnapshot,
		ctx: { CommandAuthorized: false },
		sessionEntry: sessionEntryRaw,
		sessionAgentId,
		sessionKey
	});
	commandOpts = {
		...commandOpts,
		cliSessionBindingFacts: commandOpts.cliSessionBindingFacts ?? { sourceReplyDeliveryMode: sessionStableReplyMode },
		...sessionEntryRaw && isSyntheticSourceReplyTurn({
			inputProvenance: commandOpts.inputProvenance,
			isHeartbeat: commandOpts.bootstrapContextRunKind === "heartbeat"
		}) ? { sourceReplyDeliveryMode: commandOpts.sourceReplyDeliveryMode ?? sessionStableReplyMode } : {}
	};
	const thinkingLevelsHint = formatThinkingLevels(configuredModel.provider, configuredModel.model, ", ", configuredThinkingCatalog.length > 0 ? configuredThinkingCatalog : void 0, configuredThinkingRuntime);
	const thinkOverride = normalizeThinkLevel(opts.thinking);
	const thinkOnce = normalizeThinkLevel(opts.thinkingOnce);
	if (opts.thinking && !thinkOverride) throw new Error(`Invalid thinking level. Use one of: ${thinkingLevelsHint}.`);
	if (opts.thinkingOnce && !thinkOnce) throw new Error(`Invalid one-shot thinking level. Use one of: ${thinkingLevelsHint}.`);
	const resolvedCwd = cwd ? resolveUserPath(cwd) : void 0;
	const worktreeSource = await resolveWorktreeForPath({
		sessionEntry: sessionEntryRaw,
		candidatePaths: [resolvedCwd ?? workspaceDir, workspaceDir]
	});
	const runLease = worktreeSource ? await acquireWorktreeRunLease(worktreeSource.record.id, { source: worktreeSource }) : void 0;
	try {
		const { resolveAcpAgentWorkspaceProvisioningForTurn } = await import("./acp-workspace-provisioning-CdyP4_DY.mjs");
		const workspaceProvisioning = await resolveAcpAgentWorkspaceProvisioningForTurn({
			cfg,
			agentId: sessionAgentId,
			workspaceDir: agentWorkspaceDir,
			cwd: resolvedCwd,
			sessionKey: sessionKey ?? void 0,
			sessionEntry: sessionEntryRaw ?? void 0
		});
		await ensureAgentWorkspace({
			dir: agentWorkspaceDir,
			ensureBootstrapFiles: !agentCfg?.skipBootstrap,
			skipOptionalBootstrapFiles: agentCfg?.skipOptionalBootstrapFiles,
			provisioning: workspaceProvisioning,
			guard: { assertHost: assertAcpPreparationCurrent }
		});
		const runId = opts.runId?.trim() || sessionId;
		let promptMessage = message;
		if (!isRawModelRun && (message.includes("$") || message.trimStart().startsWith("/"))) {
			const { expandExplicitSkillReferences, hasSkillReferenceCandidate, prepareSkillCommandsForWorkspace, resolveEffectiveAgentSkillFilter } = await import("./chat-commands.runtime.js");
			if (message.trimStart().startsWith("/") || hasSkillReferenceCandidate(message)) {
				const skillFilter = resolveEffectiveAgentSkillFilter(cfg, sessionAgentId);
				const commandParams = {
					workspaceDir,
					cfg,
					agentId: sessionAgentId,
					sessionEntry: sessionEntryRaw,
					sessionKey,
					...preparedMetadataSnapshot ? { pluginMetadataSnapshot: preparedMetadataSnapshot } : {},
					...skillFilter ? { skillFilter } : {}
				};
				const lifecycleGeneration = opts.lifecycleGeneration;
				const assertCurrent = lifecycleGeneration !== void 0 ? () => assertAgentRunLifecycleGenerationCurrent(lifecycleGeneration) : void 0;
				const skillCommands = await prepareSkillCommandsForWorkspace(commandParams, assertCurrent);
				const expansion = expandExplicitSkillReferences({
					text: message,
					skillCommands,
					allSkillCommands: skillFilter ? await prepareSkillCommandsForWorkspace({
						...commandParams,
						includeAllowlistHidden: true
					}, assertCurrent) : skillCommands
				});
				if (expansion.error) throw new Error(expansion.error);
				promptMessage = expansion.body;
			}
		}
		const acpRuntimeContext = projectRuntimeContextFragments(opts.runtimeContextFragments ?? []);
		const body = !isRawModelRun && acpResolution?.kind === "ready" ? [acpRuntimeContext ? labelRuntimeContextText(acpRuntimeContext) : "", resolveAcpPromptBody(promptMessage, opts.internalEvents, opts.inputProvenance)].filter(Boolean).join("\n\n") : promptMessage;
		const transcriptBody = opts.transcriptMessage ?? resolveInternalEventTranscriptBody(message, opts.internalEvents, opts.inputProvenance);
		return {
			opts: commandOpts,
			body,
			transcriptBody,
			cfg,
			configuredThinkingCatalog,
			normalizedSpawned,
			agentCfg,
			thinkOverride,
			thinkOnce,
			verboseOverride,
			timeoutMs,
			runTimeoutOverrideMs,
			sessionId,
			sessionKey,
			sessionEntry: sessionEntryRaw,
			sessionStore,
			storePath,
			isNewSession,
			previousSessionId,
			...automaticReset ? { automaticReset } : {},
			persistedThinking,
			persistedVerbose,
			sessionAgentId,
			outboundSession,
			workspaceDir,
			cwd: resolvedCwd,
			agentDir,
			pluginsEnabled,
			manifestMetadataSnapshot,
			...runtimeContext ? { commandRuntimeContext: runtimeContext } : {},
			modelManifestContext,
			runId,
			isSubagentLane,
			acpManager,
			acpResolution,
			runLease
		};
	} catch (error) {
		await runLease?.release();
		throw error;
	}
}
//#endregion
//#region src/agents/agent-command-local.ts
/** Runs a local command under one request, recovery, and plugin-registry generation. */
async function runLocalAgentCommand(params) {
	const existingHost = getBoundLegacyPluginSdkResourceHost();
	const scheduler = existingHost ? existingHost.scheduler : new GatewayScheduler();
	const host = existingHost ?? new LegacyPluginSdkResourceHost();
	if (!existingHost) host.bindScheduler(scheduler);
	const [outcome] = await Promise.allSettled([host.run(async () => {
		const resolvedDeps = await measureAgentStartup("command-dependencies", () => resolveAgentCommandDeps(params.deps));
		const lifecycleGeneration = params.opts.lifecycleGeneration ?? captureAgentRunLifecycleGeneration(params.opts.runId ?? "");
		return await withAgentRunLifecycleGeneration(lifecycleGeneration, () => withLocalGatewayRequestScope({
			deps: resolvedDeps,
			getRuntimeConfig: readRuntimeConfig
		}, async () => await runWithAgentCommandRecoveryOwner({
			lifecycleGeneration,
			mode: "reject_uncoordinated",
			opts: {
				...params.opts,
				lifecycleGeneration,
				senderIsOwner: params.opts.senderIsOwner ?? true,
				allowModelOverride: params.opts.allowModelOverride ?? true,
				cleanupBundleMcpOnRunEnd: existingHost ? params.opts.cleanupBundleMcpOnRunEnd : true
			},
			prepare: async (preparedOpts) => await measureAgentStartup("command-prepare", () => prepareAgentCommandExecution(preparedOpts, params.runtime)),
			run: async (prepared) => {
				const capability = params.operatorAuthority && prepared.opts.senderIsOwner === true ? createCronCreatorAuthorityCapability(prepared.runId, { kind: "local" }) : void 0;
				const admittedPrepared = capability ? {
					...prepared,
					opts: {
						...prepared.opts,
						cronCreatorAuthorityCapability: capability
					}
				} : prepared;
				const run = () => withAgentPluginRegistry({
					config: admittedPrepared.cfg,
					workspaceDir: admittedPrepared.workspaceDir,
					run: async () => {
						try {
							var _usingCtx$2 = _usingCtx();
							const lease = _usingCtx$2.a(await acquireAgentRunPreparedModelRuntime({
								config: admittedPrepared.cfg,
								agentId: admittedPrepared.sessionAgentId,
								agentDir: admittedPrepared.agentDir,
								workspaceDir: admittedPrepared.workspaceDir
							}, { abortSignal: admittedPrepared.opts.abortSignal }));
							let active = true;
							try {
								return await withPluginRuntimeGenerationScope(lease.snapshot, () => withPreparedModelRuntimePluginGenerationScope(lease.pluginGeneration, () => params.run({
									...admittedPrepared,
									commandRuntimeContext: {
										config: lease.snapshot.config,
										pluginGeneration: lease.pluginGeneration
									}
								}, resolvedDeps), () => active ? lease.snapshot : void 0));
							} finally {
								active = false;
							}
						} catch (_) {
							_usingCtx$2.e = _;
						} finally {
							await _usingCtx$2.d();
						}
					}
				});
				return capability ? await runWithCronCreatorAuthorityCapability(capability, run, admittedPrepared.opts.abortSignal) : await run();
			}
		})));
	})]);
	try {
		if (!existingHost) {
			await scheduler.stop();
			await host.close();
		}
	} catch (error) {
		if (outcome.status === "rejected") throw new AggregateError([outcome.reason, error], "Local agent command and resource cleanup failed.", { cause: error });
		throw error;
	}
	if (outcome.status === "rejected") throw outcome.reason;
	return outcome.value;
}
//#endregion
//#region src/agents/agent-command-restart-recovery.ts
/** Restore the exact host-owned delivery constraints before starting a recovery turn. */
function resolveCommandRecoveryOptions(params) {
	const { sessionEntry: entry } = params;
	const media = entry?.restartRecoveryDeliveryRunId === params.runId && Array.isArray(entry.restartRecoveryDeliveryMediaUrls) ? entry.restartRecoveryDeliveryMediaUrls : void 0;
	const opts = media !== void 0 ? {
		...params.opts,
		internalDeliveryMediaUrls: [...media],
		internalDeliverySuppressText: entry?.restartRecoverySuppressTextDelivery,
		sourceReplyDeliveryMode: entry?.restartRecoverySourceReplyDeliveryMode,
		disableMessageTool: entry?.restartRecoveryDisableMessageTool,
		forceRestartSafeTools: entry?.restartRecoveryForceSafeTools
	} : params.opts;
	if (opts.internalDeliverySuppressText === true && opts.internalDeliveryMediaUrls === void 0 || (opts.internalDeliveryMediaUrls !== void 0 || opts.internalDeliverySuppressText === true) && (opts.forceRestartSafeTools !== true || opts.disableMessageTool !== true || opts.sourceReplyDeliveryMode !== "automatic")) throw new Error("internal delivery media constraints require automatic delivery with restart-safe tools and no message tool");
	return opts;
}
function normalizeOptionalThreadId(value) {
	return normalizeOptionalString(value) ?? (typeof value === "number" && Number.isFinite(value) ? String(value) : void 0);
}
/** Replace model-selected media with the exact host-owned delivery set. */
function constrainRestartRecoveryDeliveryPayloads(payloads, mediaUrls, suppressText = false) {
	const constrained = [];
	for (const payload of payloads ?? []) {
		const constrainedPayload = {};
		if (!suppressText && typeof payload.text === "string") constrainedPayload.text = payload.text;
		for (const flag of [
			"isError",
			"isReasoning",
			"isCommentary",
			"isReasoningSnapshot",
			"isCompactionNotice",
			"isFallbackNotice",
			"isStatusNotice"
		]) if (payload[flag] === true) constrainedPayload[flag] = true;
		if (Object.keys(constrainedPayload).length > 0) constrained.push(constrainedPayload);
	}
	const exactMediaUrls = Array.from(new Set(mediaUrls.map((url) => url.trim()).filter((url) => url.length > 0)));
	if (exactMediaUrls.length === 0) return constrained;
	if (!suppressText) {
		const visibleReplyIndex = constrained.findIndex((payload) => hasVisibleAgentPayload({ payloads: [payload] }, {
			includeErrorPayloads: false,
			includeSilentReplyPayloads: false,
			requireTerminalContent: true
		}));
		const visibleReply = constrained[visibleReplyIndex];
		if (visibleReply) {
			const [mergedReply] = mergeAttemptToolMediaPayloads({
				payloads: [visibleReply],
				toolMediaUrls: exactMediaUrls,
				hostOwnedToolMediaUrls: exactMediaUrls,
				toolTrustedLocalMedia: true,
				sourceReplyDeliveryMode: "automatic"
			}) ?? [];
			if (mergedReply) {
				constrained[visibleReplyIndex] = mergedReply;
				return constrained;
			}
		}
	}
	constrained.push({
		mediaUrls: exactMediaUrls,
		trustedLocalMedia: true
	});
	return constrained;
}
/** Reduce a terminal result to bounded, route-checkable delivery evidence. */
function buildRestartRecoveryTerminalDeliveryEvidence(result) {
	const terminalReply = normalizeAgentRunTerminalReplySnapshot(result.meta?.terminalReply);
	const meta = {
		...(terminalReply ? terminalReply.disposition === "silent" : hasIntentionalSilentAgentPayload(result)) ? { terminalReply: { disposition: "silent" } } : {},
		...result.meta?.yielded === true ? { yielded: true } : {},
		...result.meta?.continuationPending === true ? { continuationPending: true } : {},
		...result.meta?.aborted ? { aborted: true } : {},
		...result.meta?.error ? { error: true } : {}
	};
	const rawPayloads = Array.isArray(result.payloads) ? result.payloads : void 0;
	const payloads = rawPayloads?.slice(0, 64).map((payload) => {
		const mediaUrls = collectDeliveredMediaUrls({ payloads: [payload] });
		const evidence = { visible: hasVisibleAgentPayload({ payloads: [payload] }, {
			requireTerminalContent: true,
			includeErrorPayloads: false,
			includeReasoningPayloads: false,
			includeSilentReplyPayloads: false
		}) };
		if (mediaUrls.length > 0) evidence.mediaUrls = mediaUrls;
		return evidence;
	});
	const payloadsTruncated = rawPayloads && rawPayloads.length > 64 ? true : void 0;
	const rawDeliveryStatus = result.deliveryStatus;
	const status = rawDeliveryStatus?.status === "failed" || rawDeliveryStatus?.status === "partial_failed" || rawDeliveryStatus?.status === "sent" || rawDeliveryStatus?.status === "suppressed" ? rawDeliveryStatus.status : void 0;
	const rawPayloadOutcomes = rawDeliveryStatus && typeof rawDeliveryStatus === "object" ? rawDeliveryStatus.payloadOutcomes : void 0;
	const retainedPayloadOutcomes = Array.isArray(rawPayloadOutcomes) ? rawPayloadOutcomes.slice(0, 64) : void 0;
	if (retainedPayloadOutcomes && Array.isArray(rawPayloadOutcomes) && rawPayloadOutcomes.length > 64 && !getAutomaticDeliveryEvidence({ deliveryStatus: { payloadOutcomes: retainedPayloadOutcomes } }).mayHaveSent) {
		const sendEvidence = rawPayloadOutcomes.find((outcome, index) => index >= 64 && getAutomaticDeliveryEvidence({ deliveryStatus: { payloadOutcomes: [outcome] } }).mayHaveSent);
		if (sendEvidence !== void 0) retainedPayloadOutcomes[63] = sendEvidence;
	}
	const payloadOutcomes = retainedPayloadOutcomes ? retainedPayloadOutcomes.flatMap((record) => {
		if (!isRecord(record)) return [];
		const outcomeStatus = record.status === "failed" || record.status === "sent" || record.status === "suppressed" ? record.status : void 0;
		if (!outcomeStatus || typeof record.index !== "number" || !Number.isInteger(record.index)) return [];
		const reason = normalizeOptionalString(record.reason)?.slice(0, 256);
		return [{
			index: record.index,
			status: outcomeStatus,
			...reason ? { reason } : {},
			...typeof record.sentBeforeError === "boolean" ? { sentBeforeError: record.sentBeforeError } : {}
		}];
	}) : void 0;
	const errorMessage = normalizeOptionalString(rawDeliveryStatus?.errorMessage);
	const reason = normalizeOptionalString(getAutomaticDeliveryEvidence(result).suppressionReason ?? rawDeliveryStatus?.reason)?.slice(0, 256);
	const deliveryStatus = status ? {
		status,
		...typeof rawDeliveryStatus?.resultCount === "number" && Number.isSafeInteger(rawDeliveryStatus.resultCount) && rawDeliveryStatus.resultCount >= 0 ? { resultCount: rawDeliveryStatus.resultCount } : {},
		...errorMessage ? { errorMessage } : {},
		...reason ? { reason } : {},
		...payloadOutcomes?.length ? { payloadOutcomes } : {}
	} : void 0;
	const rawMessagingToolSentTargets = Array.isArray(result.messagingToolSentTargets) ? result.messagingToolSentTargets : void 0;
	const messagingToolSentTargets = rawMessagingToolSentTargets ? rawMessagingToolSentTargets.slice(0, 64).flatMap((record) => {
		if (!isRecord(record)) return [];
		const mediaUrls = collectMessagingToolDeliveredMediaUrls({ messagingToolSentTargets: [record] });
		const evidence = { visible: hasVisibleCommittedMessagingToolDeliveryEvidence({ messagingToolSentTargets: [record] }) };
		for (const key of [
			"provider",
			"accountId",
			"to"
		]) {
			const value = normalizeOptionalString(record[key]);
			if (value) evidence[key] = value;
		}
		const threadId = normalizeOptionalThreadId(record.threadId);
		if (threadId) evidence.threadId = threadId;
		if (record.threadImplicit === true) evidence.threadImplicit = true;
		if (record.threadSuppressed === true) evidence.threadSuppressed = true;
		if (typeof record.sourceReplyFinal === "boolean") evidence.sourceReplyFinal = record.sourceReplyFinal;
		if (mediaUrls.length > 0) evidence.mediaUrls = mediaUrls;
		return [evidence];
	}) : void 0;
	const messagingToolSentTargetsTruncated = rawMessagingToolSentTargets && rawMessagingToolSentTargets.length > 64 ? true : void 0;
	const messagingToolAggregateEvidenceUnaccounted = hasUnaccountedMessagingToolAggregateEvidence(result) ? true : void 0;
	const restartUnsafeSideEffectsDetected = hasCommittedOutboundDeliveryEvidence(result) || result.didSendDeterministicApprovalPrompt === true ? true : void 0;
	return {
		captured: true,
		...Object.keys(meta).length ? { meta } : {},
		...result.requesterContinuationSettled === true ? { requesterContinuationSettled: true } : {},
		...payloads?.length ? { payloads } : {},
		...payloadsTruncated ? { payloadsTruncated } : {},
		...deliveryStatus ? { deliveryStatus } : {},
		...messagingToolSentTargets?.length ? { messagingToolSentTargets } : {},
		...messagingToolSentTargetsTruncated ? { messagingToolSentTargetsTruncated } : {},
		...messagingToolAggregateEvidenceUnaccounted ? { messagingToolAggregateEvidenceUnaccounted } : {},
		...restartUnsafeSideEffectsDetected ? { restartUnsafeSideEffectsDetected } : {}
	};
}
function shouldPersistCurrentRunSessionCleanup(current, sessionId, runId) {
	if (!current || current.sessionId !== sessionId) return false;
	if (current.abortedLastRun !== true) return true;
	return current.status === "killed" && current.lastRunId === runId && current.restartRecoveryDeliveryRunId === runId && current.lifecycleRunId === void 0 && !current.mainRestartRecovery && !current.restartRecoveryRuns?.length && !current.pendingFinalDelivery;
}
function shouldPersistRestartRecoveryContextClaim(current, sessionId, runId, allowCreate) {
	if (!current) return allowCreate;
	if (current.sessionId !== sessionId || current.abortedLastRun === true && hasMainSessionRecoveryClaim(current)) return false;
	return current.restartRecoveryDeliveryRunId === void 0 || current.restartRecoveryDeliveryRunId === runId;
}
function buildCurrentRunRestartRecoveryClaim(params) {
	const bindsAdmittedHarnessSource = params.harnessCompletion?.sourceRunId === params.runId && params.entry.restartRecoveryDeliverySourceRunId === void 0;
	if (params.entry.restartRecoveryDeliveryRunId === params.runId && !bindsAdmittedHarnessSource) {
		const entry = params.entry;
		return {
			...entry.restartRecoveryHarnessCompletion ? { restartRecoveryHarnessCompletion: entry.restartRecoveryHarnessCompletion } : {},
			restartRecoveryDeliveryContext: entry.restartRecoveryDeliveryContext,
			restartRecoveryDeliveryMediaUrls: entry.restartRecoveryDeliveryMediaUrls,
			restartRecoveryDisableMessageTool: entry.restartRecoveryDisableMessageTool,
			restartRecoverySuppressTextDelivery: entry.restartRecoverySuppressTextDelivery,
			restartRecoveryDeliveryRunId: params.runId,
			restartRecoveryDeliverySourceRunId: entry.restartRecoveryDeliverySourceRunId,
			restartRecoveryOperatorSource: entry.restartRecoveryOperatorSource,
			restartRecoverySourceIngress: entry.restartRecoverySourceIngress,
			restartRecoverySourceReplyDeliveryMode: entry.restartRecoverySourceReplyDeliveryMode,
			restartRecoveryForceSafeTools: entry.restartRecoveryForceSafeTools
		};
	}
	const createsScopedDeliveryClaim = params.sourceRunId !== void 0;
	if (createsScopedDeliveryClaim && !params.sourceIngress) throw new Error("restart recovery source ownership is required for a new claim");
	return {
		...params.harnessCompletion ? { restartRecoveryHarnessCompletion: params.harnessCompletion } : params.entry.restartRecoveryHarnessCompletion ? { restartRecoveryHarnessCompletion: void 0 } : {},
		restartRecoveryDeliveryContext: params.deliveryContext,
		restartRecoveryDeliveryMediaUrls: createsScopedDeliveryClaim && params.deliveryMediaUrls !== void 0 ? [...params.deliveryMediaUrls] : void 0,
		restartRecoveryDisableMessageTool: createsScopedDeliveryClaim && params.disableMessageTool === true ? true : void 0,
		restartRecoverySuppressTextDelivery: createsScopedDeliveryClaim && params.suppressTextDelivery === true ? true : void 0,
		restartRecoveryDeliveryRunId: createsScopedDeliveryClaim ? params.runId : void 0,
		restartRecoveryDeliverySourceRunId: params.sourceRunId,
		restartRecoveryOperatorSource: createsScopedDeliveryClaim ? params.operatorSource : void 0,
		restartRecoverySourceIngress: createsScopedDeliveryClaim ? params.sourceIngress : void 0,
		restartRecoverySourceReplyDeliveryMode: params.sourceRunId ? params.sourceReplyDeliveryMode : void 0,
		restartRecoveryForceSafeTools: createsScopedDeliveryClaim && params.forceRestartSafeTools === true ? true : void 0
	};
}
/** Bind internal completion sources and retain an already-admitted recovery claim. */
function prepareCommandHarnessCompletionRecovery(params) {
	const { entry, sessionId, sessionKey, runId, agentId, opts } = params;
	const harnessCompletion = params.hasDeliveryContext ? captureHarnessCompletionRecovery({
		agentId,
		sessionKey,
		entry: {
			...entry,
			sessionId
		},
		runId,
		inputProvenance: opts.inputProvenance
	}) : void 0;
	const internalCompletionSourceRunId = opts.inputProvenance?.kind === "inter_session" && (opts.inputProvenance.sourceTool === "subagent_settle" && opts.inputProvenance.sourceChannel === "internal" && Boolean(opts.inputProvenance.sourceSessionKey?.trim()) && runId.startsWith("announce:requester-settle:") || opts.internalDeliveryMediaUrls !== void 0 && isAgentMediatedCompletionSourceTool(opts.inputProvenance.sourceTool)) ? runId : void 0;
	const claimedHarnessCompletion = entry.restartRecoveryDeliveryRunId === runId ? entry.restartRecoveryHarnessCompletion : void 0;
	const guardedHarnessCompletion = harnessCompletion ?? claimedHarnessCompletion;
	if (guardedHarnessCompletion && !getOwedHarnessCompletionTask(guardedHarnessCompletion, entry)) throw createSessionWorkStartChangedError(sessionKey);
	return {
		harnessCompletion,
		guardedHarnessCompletion,
		isCompletionCurrent: (current) => !guardedHarnessCompletion || Boolean(current && getOwedHarnessCompletionTask(guardedHarnessCompletion, current)),
		sourceOptions: {
			sourceIngress: internalCompletionSourceRunId || harnessCompletion ? "internal" : void 0,
			sourceRunId: internalCompletionSourceRunId ?? harnessCompletion?.sourceRunId,
			sourceReplyDeliveryMode: opts.sourceReplyDeliveryMode ?? (harnessCompletion ? "automatic" : void 0)
		}
	};
}
/** Called after the caller has recorded the committed entry for failure cleanup. */
function bindCommandHarnessCompletionAssertion(params) {
	const { claim, persisted, sessionKey, storePath, opts } = params;
	if (claim && (!persisted || persisted.restartRecoveryHarnessCompletion?.taskId !== claim.taskId || !getOwedHarnessCompletionTask(claim, persisted))) throw createSessionWorkStartChangedError(sessionKey);
	if (!claim || !storePath) return { opts };
	return { opts: {
		...opts,
		assertSourceCurrent: Object.assign(createHarnessCompletionSourceAssertion({
			claim,
			storePath,
			priorAssertion: opts.assertSourceCurrent
		}), { recoveryReference: opts.assertSourceCurrent?.recoveryReference })
	} };
}
//#endregion
//#region src/agents/command/session-helpers.ts
function clearPendingFinalDelivery(entry, updatedAt) {
	return {
		...entry,
		pendingFinalDelivery: void 0,
		restartRecoveryForceSafeTools: void 0,
		restartRecoveryDeliveryMediaUrls: void 0,
		restartRecoveryDisableMessageTool: void 0,
		restartRecoverySuppressTextDelivery: void 0,
		updatedAt
	};
}
async function prepareCurrentRunDelivery(params) {
	const { cfg, opts, sessionEntry } = params;
	if (opts.deliver !== true) return;
	const buildPlan = async (requestedChannel, preparedPlugin) => await resolveAgentDeliveryPlanWithSessionRoute({
		cfg,
		agentId: params.agentId,
		currentSessionKey: params.currentSessionKey,
		sessionEntry,
		requestedChannel,
		explicitTo: opts.replyTo ?? opts.to,
		explicitThreadId: opts.threadId,
		accountId: opts.replyAccountId ?? opts.accountId,
		wantsDelivery: true,
		turnSourceChannel: opts.runContext?.messageChannel ?? opts.messageChannel,
		turnSourceTo: opts.runContext?.currentChannelId ?? opts.to,
		turnSourceAccountId: opts.runContext?.accountId ?? opts.accountId,
		turnSourceThreadId: opts.runContext?.currentThreadTs ?? opts.threadId,
		preparedPlugin
	});
	let deliveryPlan = await buildPlan(opts.replyChannel ?? opts.channel);
	const explicitChannelHint = normalizeOptionalString(opts.replyChannel ?? opts.channel);
	const explicitThreadId = opts.threadId != null && opts.threadId !== "" ? opts.threadId : void 0;
	if (deliveryPlan.resolvedChannel === "webchat" && !explicitChannelHint) {
		const selection = await resolveMessageChannelSelection({ cfg });
		deliveryPlan = await buildPlan(selection.channel, selection.plugin);
	}
	if (deliveryPlan.targetResolutionError) throw deliveryPlan.targetResolutionError;
	if (!isDeliverableMessageChannel(deliveryPlan.resolvedChannel)) throw new Error("delivery channel is required: pass --channel/--reply-channel or use a main session with a previous channel");
	const targetMode = opts.deliveryTargetMode ?? deliveryPlan.deliveryTargetMode ?? (opts.replyTo ?? opts.to ? "explicit" : "implicit");
	const resolved = await resolveAgentOutboundTarget({
		cfg,
		plan: deliveryPlan,
		targetMode,
		validateExplicitTarget: true
	});
	if (resolved.resolvedTarget && !resolved.resolvedTarget.ok) throw resolved.resolvedTarget.error;
	const resolvedTo = resolved.resolvedTo;
	if (!resolvedTo) throw new Error(`delivery target is required for ${deliveryPlan.resolvedChannel}`);
	const threadId = targetMode === "explicit" ? explicitThreadId ?? (deliveryPlan.baseDelivery.threadIdSource === "explicit" ? deliveryPlan.resolvedThreadId : void 0) : deliveryPlan.resolvedThreadId;
	const context = normalizeDeliveryContext({
		channel: deliveryPlan.resolvedChannel,
		to: resolvedTo,
		accountId: deliveryPlan.resolvedAccountId,
		threadId
	});
	return context ? {
		context,
		targetMode
	} : void 0;
}
function resolveInternalSessionEffectsSource(params) {
	if (!params.storePath || !params.sessionKey) return;
	return {
		agentId: params.agentId,
		sessionId: params.sessionId,
		sessionKey: params.sessionKey,
		storePath: params.storePath
	};
}
//#endregion
//#region src/agents/command/acp-execution.ts
const log$8 = createSubsystemLogger("agents/agent-command");
async function runAcpAgentCommand(params) {
	if (getInstallationTarget()) throw new Error(LOCAL_INSTALLATION_TARGET_UNSUPPORTED);
	const attemptExecutionRuntime = await loadAttemptExecutionRuntime();
	const acpToolTracker = attemptExecutionRuntime.createAcpToolLifecycleTracker();
	const startedAt = Date.now();
	const lifecycleContext = {
		runId: params.runId,
		agentId: params.sessionAgentId,
		lifecycleGeneration: params.lifecycleGeneration
	};
	const runtimeEventContext = {
		...lifecycleContext,
		toolTracker: acpToolTracker,
		sessionKey: params.sessionKey,
		abortSignal: params.opts.abortSignal
	};
	const coordination = isSubagentCoordinationInputProvenance(params.opts.inputProvenance);
	registerAgentRunContext(params.runId, {
		sessionKey: params.sessionKey,
		sessionId: params.sessionId,
		agentId: params.sessionAgentId,
		lifecycleGeneration: params.lifecycleGeneration,
		projectSessionActive: !params.suppressVisibleSessionEffects && !coordination,
		...params.suppressVisibleSessionEffects || coordination ? { isControlUiVisible: false } : {},
		...coordination ? { projectSessionMessages: false } : {}
	});
	attemptExecutionRuntime.emitAcpLifecycleStart({
		...lifecycleContext,
		startedAt
	});
	const visibleTextAccumulator = attemptExecutionRuntime.createAcpVisibleTextAccumulator();
	let stopReason;
	let resultStatus;
	let terminalOutcome;
	try {
		const { resolveAcpAgentPolicyError, resolveAcpDispatchPolicyError, resolveAcpExplicitTurnPolicyError } = await loadAcpPolicyRuntime();
		const turnPolicyError = params.opts.acpTurnSource === "manual_spawn" ? resolveAcpExplicitTurnPolicyError(params.cfg) : resolveAcpDispatchPolicyError(params.cfg);
		if (turnPolicyError) {
			terminalOutcome = "blocked";
			throw turnPolicyError;
		}
		const acpAgent = normalizeAgentId(params.acpResolution.meta.agent || resolveAgentIdFromSessionKey(params.sessionKey));
		const agentPolicyError = resolveAcpAgentPolicyError(params.cfg, acpAgent);
		if (agentPolicyError) {
			terminalOutcome = "blocked";
			throw agentPolicyError;
		}
		const acpImageAttachments = resolveInlineAgentImageAttachments(params.opts.images);
		assertAgentRunLifecycleGenerationCurrent(params.lifecycleGeneration);
		const admittedRunContext = await params.preparedRunAdmission.admit("acp");
		const isElicitationActive = () => {
			if (params.opts.abortSignal?.aborted === true || getAdmittedRunDelegatedAuthority(admittedRunContext) === void 0) return false;
			try {
				assertAgentRunLifecycleGenerationCurrent(params.lifecycleGeneration);
				return true;
			} catch {
				return false;
			}
		};
		const onElicitation = createLazyAcpElicitationHandler({
			sourceSessionKey: params.opts.inputProvenance?.sourceSessionKey ?? params.sessionKey,
			targetSessionKey: params.sessionKey,
			outerRequestId: params.runId,
			agentId: params.sessionAgentId,
			runId: params.runId,
			delivery: { deliver: async (_kind, payload) => {
				if (!isElicitationActive()) throw new Error("ACP input request is no longer active.");
				if (payload.text) attemptExecutionRuntime.emitAcpRuntimeEvent({
					...runtimeEventContext,
					event: {
						type: "status",
						text: payload.text,
						tag: "elicitation"
					}
				});
				return true;
			} },
			isActive: isElicitationActive
		});
		await params.acpManager.runTurn({
			admittedRunContext,
			cfg: params.cfg,
			sessionKey: params.sessionKey,
			agentId: params.sessionAgentId,
			provenance: params.provenance,
			text: params.body,
			attachments: acpImageAttachments.length > 0 ? acpImageAttachments : void 0,
			mode: "prompt",
			requestId: params.runId,
			signal: params.opts.abortSignal,
			onElicitation,
			onBeforePrompt: async () => {
				const recorder = params.opts.userTurnTranscriptRecorder;
				if (recorder && !recorder.hasPersisted() && !await recorder.persistApproved()) throw new Error("ACP input could not enter the session transcript");
				await params.opts.onExecutionStarted?.();
				assertAgentRunLifecycleGenerationCurrent(params.lifecycleGeneration);
				params.opts.abortSignal?.throwIfAborted();
				if (!getAdmittedRunDelegatedAuthority(admittedRunContext)) throw new Error("ACP run authority is no longer active");
			},
			onLifecycle: (event) => {
				if (event.type === "prompt_submitted") attemptExecutionRuntime.emitAcpPromptSubmitted({
					runId: params.runId,
					sessionKey: params.sessionKey,
					at: event.at
				});
			},
			onEvent: (event) => {
				if (event.type !== "text_delta") attemptExecutionRuntime.emitAcpRuntimeEvent({
					...runtimeEventContext,
					event
				});
				if (event.type === "done") {
					stopReason = event.stopReason;
					resultStatus = event.status;
					return;
				}
				if (event.type !== "text_delta" || event.stream && event.stream !== "output" || !event.text) return;
				const visibleUpdate = visibleTextAccumulator.consume(event.text);
				if (visibleUpdate) attemptExecutionRuntime.emitAcpAssistantDelta({
					runId: params.runId,
					text: visibleUpdate.text,
					delta: visibleUpdate.delta
				});
			}
		});
		if (isAgentRunRestartAbortReason(params.opts.abortSignal?.reason)) throw params.opts.abortSignal?.reason;
	} catch (error) {
		const { toAcpRuntimeError } = await loadAcpRuntimeErrorsRuntime();
		const acpError = toAcpRuntimeError({
			error,
			fallbackCode: "ACP_TURN_FAILED",
			fallbackMessage: "ACP turn failed before completion."
		});
		attemptExecutionRuntime.emitAcpLifecycleError({
			...runtimeEventContext,
			error: acpError,
			...terminalOutcome ? { terminalOutcome } : {}
		});
		throw acpError;
	}
	const endFields = attemptExecutionRuntime.resolveAcpLifecycleEndFields(params.opts.abortSignal, stopReason, resultStatus);
	const finalTextRaw = visibleTextAccumulator.finalizeRaw();
	const finalText = visibleTextAccumulator.finalize();
	const terminalReply = visibleTextAccumulator.finalizeReplySnapshot();
	let sessionEntry = params.sessionEntry;
	try {
		const { resolveAcpSessionCwd } = await loadAcpSessionIdentifiersRuntime();
		const internalSource = params.suppressVisibleSessionEffects ? resolveInternalSessionEffectsSource({
			agentId: params.sessionAgentId,
			sessionId: params.sessionId,
			sessionKey: params.sessionKey,
			storePath: params.storePath
		}) : void 0;
		const internalTarget = params.suppressVisibleSessionEffects ? await prepareInternalSessionEffectsSession({
			agentId: params.sessionAgentId,
			cwd: resolveAcpSessionCwd(params.acpResolution.meta) ?? params.workspaceDir,
			runId: params.runId,
			source: internalSource,
			storePath: params.storePath
		}) : void 0;
		params.trackInternalModelRunTarget(internalTarget);
		const transcriptResult = await attemptExecutionRuntime.persistAcpTurnTranscript({
			assistantIdempotencyKey: params.runId,
			body: params.body,
			transcriptBody: params.transcriptBody,
			inputProvenance: params.opts.inputProvenance,
			userTurnTranscriptRecorder: params.opts.userTurnTranscriptRecorder,
			...!params.opts.userTurnTranscriptRecorder && params.opts.suppressPromptPersistence !== true && params.opts.transcriptMedia?.length ? { userInput: {
				text: params.transcriptBody,
				media: params.opts.transcriptMedia
			} } : {},
			finalText: finalTextRaw,
			terminalOutcome: buildAgentRunTerminalOutcomeFromLifecycleEvent({
				phase: "end",
				data: endFields
			}),
			sessionId: internalTarget?.sessionId ?? params.sessionId,
			sessionKey: internalTarget?.sessionKey ?? params.sessionKey,
			sessionEntry: internalTarget?.sessionEntry ?? sessionEntry,
			sessionStore: params.suppressVisibleSessionEffects ? void 0 : params.sessionStore,
			storePath: internalTarget?.storePath ?? params.storePath,
			sessionAgentId: internalTarget?.agentId ?? params.sessionAgentId,
			threadId: params.opts.threadId,
			sessionCwd: resolveAcpSessionCwd(params.acpResolution.meta) ?? params.workspaceDir,
			config: params.cfg,
			runId: params.runId
		});
		if (!internalTarget) sessionEntry = transcriptResult.sessionEntry;
	} catch (error) {
		log$8.warn(`ACP transcript persistence failed for ${params.sessionKey}: ${formatErrorMessage(error)}`);
	}
	const restartAbortReason = params.opts.abortSignal?.reason;
	if (isAgentRunRestartAbortReason(restartAbortReason)) {
		attemptExecutionRuntime.emitAcpLifecycleError({
			...runtimeEventContext,
			error: restartAbortReason
		});
		throw restartAbortReason;
	}
	attemptExecutionRuntime.emitAcpLifecycleEnd({
		...lifecycleContext,
		toolTracker: acpToolTracker,
		endFields,
		terminalReply
	});
	const result = attemptExecutionRuntime.buildAcpResult({
		payloadText: finalText,
		terminalReply,
		startedAt,
		stopReason,
		resultStatus,
		abortSignal: params.opts.abortSignal
	});
	await params.opts.beforeTerminalDelivery?.();
	const { deliverAgentCommandResult } = await loadDeliveryRuntime();
	const deliveryResult = await deliverAgentCommandResult({
		cfg: params.cfg,
		deps: params.deps,
		runtime: params.runtime,
		opts: params.opts,
		outboundSession: params.outboundSession,
		sessionEntry,
		result,
		payloads: result.payloads,
		assertDeliveryCurrent: () => assertAgentRunLifecycleGenerationCurrent(params.lifecycleGeneration)
	});
	const outcome = buildAgentRunTerminalOutcomeFromLifecycleEvent({
		phase: "end",
		data: {
			status: resultStatus,
			stopReason
		},
		abortSignal: params.opts.abortSignal
	});
	return recordAgentRunTerminalOutcome(deliveryResult, classifyAgentRunTerminalOutcome(outcome) === "success" ? "completed" : "failed");
}
//#endregion
//#region src/agents/command/attempt-execution.shared.ts
/** Shared session persistence for agent attempt execution. */
/** Persists one session entry while keeping the caller's in-memory store aligned. */
async function persistAgentSession(params) {
	let rejectedMissingEntry = false;
	let published = false;
	const buildEntry = (current) => {
		const shouldPersistCurrent = params.shouldPersist?.(current);
		if (!current && shouldPersistCurrent !== true || shouldPersistCurrent === false) {
			rejectedMissingEntry = !current;
			return null;
		}
		if (!current) return {
			...params.entry,
			...params.creation ? buildSessionCreationStamp(params.creation) : {}
		};
		if (current.sessionId !== params.initialEntry.sessionId) return null;
		return mergeSessionSnapshotChanges({
			initial: params.initialEntry,
			next: params.entry,
			current
		});
	};
	const publish = (entry) => {
		published = true;
		params.sessionStore[params.sessionKey] = entry;
	};
	const persisted = params.resetBoundary ? (await resetSessionEntryLifecycle({
		agentId: params.agentId,
		storePath: params.storePath,
		target: {
			canonicalKey: normalizeStoreSessionKey(params.sessionKey),
			storeKeys: [params.sessionKey]
		},
		resetBoundary: params.resetBoundary,
		commitGuard: params.assertCommitAllowed,
		buildNextEntry: ({ currentEntry }) => {
			const entry = buildEntry(currentEntry);
			if (!entry) throw createSessionWorkStartChangedError(params.sessionKey);
			return entry;
		},
		afterEntryMutation: ({ nextEntry }) => publish(nextEntry)
	})).nextEntry : await patchSessionEntryCore({
		agentId: params.agentId,
		sessionKey: params.sessionKey,
		storePath: params.storePath
	}, (_entry, context) => buildEntry(context.existingEntry), {
		fallbackEntry: params.sessionStore[params.sessionKey] ?? params.entry,
		replaceEntry: true,
		...sessionEntryCommitGuardOptions(params.assertCommitAllowed),
		requireWriteSuccess: params.creation !== void 0,
		onCommitted: publish
	});
	if (rejectedMissingEntry || !persisted) {
		delete params.sessionStore[params.sessionKey];
		return;
	}
	if (!published) params.sessionStore[params.sessionKey] = persisted;
	if (params.resetBoundary) {
		clearBootstrapSnapshotOnSessionBoundary({
			boundaryAppended: true,
			sessionKey: params.sessionKey
		});
		clearCommittedSessionResetRuntimeState({
			previousSessionEntry: params.initialEntry,
			agentId: params.agentId,
			sessionKey: params.sessionKey,
			onError: (error) => createSubsystemLogger("agents/agent-command").warn(String(error))
		});
	}
	return persisted;
}
//#endregion
//#region src/agents/command/assistant-transcript-repair.ts
const log$7 = createSubsystemLogger("agents/assistant-transcript-repair");
const EMPTY_USAGE = buildUsageWithNoCost({});
/** Records a final whose canonical transcript append failed. */
async function persistAssistantTranscriptRepairRecord(params) {
	const { context, replyText, provider, model, runOwnedSessionId } = params;
	if (!replyText.trim() || !context.sessionStore || !context.sessionKey.trim()) return;
	const now = Date.now();
	const existing = context.sessionStore[context.sessionKey] ?? context.sessionEntry;
	if (!existing) return;
	const nextRepair = {
		id: randomUUID(),
		text: replyText,
		...provider?.trim() ? { provider: provider.trim() } : {},
		...model?.trim() ? { model: model.trim() } : {},
		createdAt: now
	};
	try {
		await persistAgentSession({
			agentId: context.sessionAgentId,
			sessionStore: context.sessionStore,
			sessionKey: context.sessionKey,
			storePath: context.storePath,
			initialEntry: existing,
			entry: {
				...existing,
				pendingTranscriptRepair: [...existing.pendingTranscriptRepair ?? [], nextRepair],
				updatedAt: now
			},
			shouldPersist: (current) => current?.sessionId === runOwnedSessionId && current.abortedLastRun !== true
		});
	} catch (error) {
		log$7.warn(`Failed to persist assistant transcript repair record for ${context.sessionKey}: ${formatErrorMessage(error)}`);
	}
}
/**
* Restores missing assistant finals before another turn can observe or extend
* the transcript. Append failures are an admission barrier: continuing would
* give the model incomplete history and make the eventual append out of order.
*/
async function repairPendingAssistantTranscriptTurns(params) {
	const { context } = params;
	if (!context.sessionStore || !context.sessionKey) return;
	const entry = context.sessionStore[context.sessionKey] ?? context.sessionEntry;
	const backlog = entry?.pendingTranscriptRepair;
	if (!entry || !backlog?.length) return;
	const { appendExactAssistantMessageToSessionTranscript } = await loadTranscriptAppendRuntime();
	const pending = [...backlog];
	for (const item of pending) {
		let result;
		try {
			result = await appendExactAssistantMessageToSessionTranscript({
				agentId: context.sessionAgentId,
				sessionKey: context.sessionKey,
				expectedSessionId: entry.sessionId,
				storePath: context.storePath,
				config: context.config,
				updateMode: "file-only",
				idempotencyKey: `transcript-repair:${item.id}`,
				beforeMessageWrite: runAgentHarnessBeforeMessageWriteHook,
				message: {
					role: "assistant",
					content: [{
						type: "text",
						text: item.text
					}],
					api: "cli",
					provider: item.provider ?? "cli",
					model: item.model ?? "default",
					usage: EMPTY_USAGE,
					stopReason: "stop",
					timestamp: item.createdAt
				}
			});
		} catch (error) {
			log$7.warn(`Assistant transcript repair failed for ${context.sessionKey}: ${formatErrorMessage(error)}`);
			throw new Error("Previous assistant reply is still pending transcript recovery; retry.", { cause: error });
		}
		if (!result.ok && result.code !== "blocked") {
			log$7.warn(`Assistant transcript repair failed for ${context.sessionKey}: ${result.reason}`);
			throw new Error("Previous assistant reply is still pending transcript recovery; retry.");
		}
		if (result.ok) log$7.info(`Re-appended missing assistant transcript turn for ${context.sessionKey}`);
		else log$7.warn(`Dropped blocked assistant transcript repair for ${context.sessionKey}`);
	}
	const current = context.sessionStore[context.sessionKey];
	if (!current || current.sessionId !== entry.sessionId) return;
	try {
		await persistAgentSession({
			agentId: context.sessionAgentId,
			sessionStore: context.sessionStore,
			sessionKey: context.sessionKey,
			storePath: context.storePath,
			initialEntry: current,
			entry: {
				...current,
				pendingTranscriptRepair: void 0,
				updatedAt: Date.now()
			},
			shouldPersist: (latest) => latest?.sessionId === entry.sessionId
		});
	} catch (error) {
		log$7.warn(`Failed to clear assistant transcript repair record for ${context.sessionKey}: ${formatErrorMessage(error)}`);
	}
}
//#endregion
//#region src/agents/command/cleanup.ts
const log$6 = createSubsystemLogger("agents/agent-command");
/** Finishes durable cleanup before releasing the command's transient run owners. */
async function finishAgentCommandCleanup(params) {
	try {
		params.reportCommitted();
		await params.preparedRunAdmission?.finish();
		params.sessionWorkAdmission?.release();
		await params.cleanupInternalModelRunTargets();
		const { sessionStore, sessionKey, storePath, runId } = params.prepared;
		const interruptedForRestart = () => inspectMainSessionRecoveryLifecycleEvent({
			currentLifecycleGeneration: getAgentEventLifecycleGeneration(),
			event: params.terminalEvent,
			abortSignal: params.abortSignal
		}).interrupted;
		if (params.sessionReboundDuringRun || !sessionStore || !sessionKey || interruptedForRestart()) return;
		try {
			const entry = sessionStore[sessionKey] ?? params.sessionEntry;
			const ownsDeliveryClaim = (current) => params.trackedRestartRecoveryDeliveryClaim && current.restartRecoveryDeliveryRunId === runId;
			const isExecutionFence = (run) => run.runId === runId && run.lifecycleGeneration === params.lifecycleGeneration;
			if (!entry || !ownsDeliveryClaim(entry) && !entry.restartRecoveryRuns?.some(isExecutionFence)) return;
			const persisted = await patchSessionEntryCore({
				agentId: params.prepared.sessionAgentId,
				sessionKey,
				storePath
			}, (current) => {
				if (!shouldPersistCurrentRunSessionCleanup(current, params.runOwnedSessionId, runId)) return null;
				if (ownsDeliveryClaim(current)) return {
					...current,
					...buildMainSessionRecoverySettlementPatch({
						entry: current,
						recordTerminalSource: true,
						clearRecoveryState: current.abortedLastRun !== true,
						terminalRunId: runId,
						terminalDeliveryEvidence: params.terminalDeliveryEvidence
					}),
					updatedAt: Date.now()
				};
				const remaining = current.restartRecoveryRuns?.filter((run) => !isExecutionFence(run));
				if (!remaining || remaining.length === current.restartRecoveryRuns?.length) return null;
				return {
					...current,
					restartRecoveryRuns: remaining.length ? remaining : void 0,
					...!remaining.some((run) => run.runId === runId) ? { restartRecoveryTerminalRunIds: mergeRestartRecoveryTerminalRunIds(current.restartRecoveryTerminalRunIds, [runId]) } : {},
					updatedAt: Date.now()
				};
			}, {
				replaceEntry: true,
				workerGuard: { assertCurrent: () => {
					assertAgentRunLifecycleGenerationCurrent(params.lifecycleGeneration);
					if (interruptedForRestart()) throw createAgentRunRestartAbortError();
				} }
			});
			if (persisted) sessionStore[sessionKey] = persisted;
			else delete sessionStore[sessionKey];
		} catch (error) {
			log$6.warn(`failed to settle restart recovery for ${sessionKey}: ${coerceErrorMessage(error)}`);
		}
	} finally {
		try {
			await params.beforeTerminalDelivery?.(void 0, params.terminalEvent.data?.error);
		} finally {
			clearAgentRunContext(params.prepared.runId, params.lifecycleGeneration);
			params.sessionWorkAdmission?.release();
			params.releaseForeground?.();
		}
	}
}
//#endregion
//#region src/agents/command/compaction-accounting.ts
const log$5 = createSubsystemLogger("agents/agent-command");
function createCompactionSessionIdReporter(sessionId, onSessionIdChanged) {
	let notifiedSessionId = sessionId;
	let pendingCompactionSessionId;
	const notifySessionIdChanged = (nextSessionId) => {
		notifiedSessionId = nextSessionId;
		pendingCompactionSessionId = void 0;
		onSessionIdChanged?.(nextSessionId);
	};
	return {
		onSessionIdChanged: notifySessionIdChanged,
		onCompactionCommitted: (nextSessionId) => {
			if (nextSessionId !== void 0) pendingCompactionSessionId = nextSessionId;
		},
		reportCommitted: () => {
			if (pendingCompactionSessionId !== void 0 && pendingCompactionSessionId !== notifiedSessionId) try {
				notifySessionIdChanged(pendingCompactionSessionId);
			} catch (error) {
				log$5.warn(`failed to report settled session identity: ${coerceErrorMessage(error)}`);
			}
		}
	};
}
/** Keeps command context observations and completed counts on their original writer. */
function createCommandCompactionAccounting(params) {
	let accounting;
	let requestBudget;
	return {
		get fact() {
			return accounting;
		},
		get requestBudget() {
			return requestBudget;
		},
		beginCandidate(signal) {
			let acceptsRequestBudget = true;
			requestBudget = void 0;
			if (accounting?.currentContextSnapshot) accounting = {
				...accounting,
				currentContextSnapshot: { tokens: void 0 }
			};
			let candidateFact;
			return {
				observeRequestBudget: (budget) => {
					if (acceptsRequestBudget && !signal?.aborted) requestBudget = budget;
				},
				observe: (fact) => {
					if (fact?.kind === "durable" && fact.count === 0 && accounting && !hasSameCompactionWriter(accounting.target, fact.target)) return;
					candidateFact = fact;
					if (fact?.kind === "durable") params.onDurableFact(fact);
				},
				async finish(sessionEntry) {
					acceptsRequestBudget = false;
					const fact = candidateFact;
					if (fact?.kind !== "durable") return;
					const carriedCount = hasSameCompactionWriter(accounting?.target, fact.target) ? accounting?.count ?? 0 : 0;
					const transitions = [...accounting?.admissionTransitions ?? [], ...fact.admissionTransitions ?? []];
					accounting = {
						...fact,
						...transitions.length ? { admissionTransitions: Object.freeze(transitions) } : {},
						count: carriedCount + fact.count,
						currentContextSnapshot: fact.currentContextSnapshot ?? accounting?.currentContextSnapshot
					};
					if (fact.count > 0 && params.persistCounts) {
						await incrementCompactionCount({
							...fact.target,
							sessionEntry,
							sessionStore: params.sessionStore,
							expectedSession: fact.target,
							amount: fact.count,
							tokensAfter: fact.currentContextSnapshot?.tokens,
							transcriptByteCompactionLatch: fact.hostCompactionCommitted ? null : void 0
						});
						params.refreshSessionEntry(fact.target.sessionKey);
					}
				}
			};
		}
	};
}
//#endregion
//#region src/agents/command/ingress-diagnostics.ts
/** Emit the ingress-only model usage diagnostic after a completed agent run. */
function emitIngressModelUsageDiagnostic(result, opts, agentDir) {
	const cfg = readRuntimeConfig();
	if (!isDiagnosticsEnabled(cfg)) return;
	const agentMeta = result.meta?.agentMeta;
	const usage = agentMeta?.diagnosticUsage ?? agentMeta?.usage;
	if (!agentMeta || !hasBillableUsage(usage)) return;
	const providerUsed = agentMeta.provider ?? "";
	const modelUsed = agentMeta.model ?? "";
	const costUsd = estimateAggregateUsageCost({
		usage,
		provider: providerUsed,
		model: modelUsed,
		config: cfg,
		agentDir
	});
	emitTrustedDiagnosticEvent({
		type: "model.usage",
		sessionKey: opts.sessionKey,
		sessionId: agentMeta.sessionId,
		channel: opts.runContext?.messageChannel ?? opts.messageChannel ?? opts.channel ?? "http",
		agentId: opts.agentId,
		provider: providerUsed,
		model: modelUsed,
		usage: toDiagnosticUsage(usage),
		lastCallUsage: agentMeta.lastCallUsage,
		context: {
			limit: agentMeta.contextTokens,
			...agentMeta.promptTokens !== void 0 ? { used: agentMeta.promptTokens } : {}
		},
		costUsd,
		durationMs: result.meta?.durationMs
	});
}
//#endregion
//#region src/agents/command/maintenance.ts
/** Build a new system-owned request, without retaining foreground callbacks or writer custody. */
function createCommandMaintenanceFollowup(params) {
	const { prepared, sessionEntry } = params;
	return createSessionMaintenanceFollowup({
		run: {
			agentId: prepared.sessionAgentId,
			agentDir: prepared.agentDir,
			workspaceDir: prepared.workspaceDir,
			cwd: prepared.cwd,
			messageProvider: params.embeddedSessionState.runContext.messageChannel,
			agentAccountId: params.embeddedSessionState.runContext.accountId,
			chatType: sessionEntry.chatType,
			groupId: params.embeddedSessionState.runContext.groupId ?? void 0,
			groupChannel: params.embeddedSessionState.runContext.groupChannel ?? void 0,
			groupSpace: params.embeddedSessionState.runContext.groupSpace ?? void 0,
			skillsSnapshot: params.embeddedSessionState.skillsSnapshot,
			thinkLevel: params.thinkLevel,
			verboseLevel: params.embeddedSessionState.resolvedVerboseLevel ?? "off",
			timeoutMs: prepared.timeoutMs,
			senderIsOwner: params.senderIsOwner
		},
		sessionEntry,
		cfg: prepared.cfg,
		sessionKey: prepared.sessionKey,
		provider: params.provider,
		model: params.model,
		auth: params.auth ?? {
			authProfileId: sessionEntry.authProfileOverride?.trim() || void 0,
			authProfileIdSource: resolveCollapsedSessionAuthPinSource(sessionEntry)
		}
	});
}
/** Bind recovery and runtime preparation to the accepted preflight successor. */
async function prepareCommandForegroundRun(params) {
	const budget = createCommandBudget(Date.now(), params.prepared.timeoutMs, params.opts.abortSignal);
	let entry;
	let timeoutMs;
	try {
		entry = params.opts.modelRun === true || params.opts.promptMode === "none" || params.suppressVisibleSessionEffects ? params.sessionEntry : await runCommandPreflightMaintenance({
			...params,
			opts: {
				...params.opts,
				abortSignal: budget.signal
			}
		});
		timeoutMs = budget.remainingMs();
		budget.signal.throwIfAborted();
	} finally {
		budget.dispose();
	}
	const prepared = {
		...params.prepared,
		timeoutMs,
		...entry ? {
			sessionId: entry.sessionId,
			sessionEntry: entry
		} : {}
	};
	if (entry && entry.sessionId !== params.prepared.sessionId) {
		params.modelSelection.sessionEntryForAttempt = {
			...params.modelSelection.sessionEntryForAttempt ?? entry,
			sessionId: entry.sessionId,
			lifecycleRevision: entry.lifecycleRevision
		};
		params.modelSelection.sessionFile = prepared.sessionKey ?? entry.sessionId;
	}
	params.modelSelection.sessionEntry = entry;
	params.embeddedSessionState.sessionEntry = entry;
	return {
		prepared,
		admission: prepareAgentCommandExecutionIdentity({
			opts: params.opts,
			prepared,
			ingress: params.ingress,
			lifecycleGeneration: params.lifecycleGeneration
		})
	};
}
/** Required checkpointing stays with the foreground owner before its first inference. */
async function runCommandPreflightMaintenance(params) {
	const { prepared, opts, sessionEntry, modelSelection } = params;
	const operatorAuthority = opts.operatorAuthority;
	const assertSourceCurrent = opts.assertSourceCurrent;
	if (prepared.isNewSession || !sessionEntry || !prepared.sessionKey || prepared.cfg.agents?.defaults?.compaction?.enabled === false) return sessionEntry;
	const assertActive = () => {
		opts.abortSignal?.throwIfAborted();
		assertSourceCurrent?.();
		operatorAuthority?.assertCurrent();
		assertAgentRunLifecycleGenerationCurrent(params.lifecycleGeneration);
	};
	assertActive();
	const preflightAdmission = readPendingUserTurnTranscriptAdmission(opts.userTurnTranscriptRecorder);
	const memory = await loadAgentRunnerMemoryRuntime();
	assertActive();
	const followupRun = createCommandMaintenanceFollowup({
		...params,
		sessionEntry,
		provider: modelSelection.provider,
		model: modelSelection.model,
		thinkLevel: modelSelection.effectiveTurnThinkLevel,
		senderIsOwner: opts.senderIsOwner,
		auth: {
			authProfileId: modelSelection.sessionEntryForAttempt?.authProfileOverride,
			authProfileIdSource: resolveCollapsedSessionAuthPinSource(modelSelection.sessionEntryForAttempt)
		}
	});
	followupRun.operatorAuthority = operatorAuthority;
	followupRun.prompt = prepared.body;
	const maintenanceParams = {
		cfg: prepared.cfg,
		followupRun,
		promptForEstimate: prepared.body,
		defaultModel: modelSelection.defaultModel,
		sessionStore: prepared.sessionStore,
		sessionKey: prepared.sessionKey,
		runtimePolicySessionKey: prepared.sessionKey,
		storePath: prepared.storePath,
		isHeartbeat: opts.bootstrapContextRunKind === "heartbeat",
		abortSignal: opts.abortSignal
	};
	return memory.runSessionCompactionIfNeeded({
		...maintenanceParams,
		pendingUserEntryId: preflightAdmission?.entryId,
		sessionEntry,
		authorize: () => {
			assertActive();
			return true;
		},
		onSessionIdChanged: opts.onSessionIdChanged,
		onCompactionCommitted: (accepted) => params.onCommittedSessionId(accepted.sessionId),
		beforeCompaction: async (entry) => {
			const flushed = await memory.runMemoryFlushIfNeeded({
				...maintenanceParams,
				preflightAdmission,
				resolvedVerboseLevel: params.embeddedSessionState.resolvedVerboseLevel ?? "off",
				sessionEntry: entry
			});
			assertActive();
			return flushed.sessionEntry;
		}
	});
}
//#endregion
//#region src/agents/command/model-selection-catalog.ts
function resolveDeferredSelection(params) {
	const entry = params.sessionEntry;
	if (!params.pluginsEnabled || !entry || params.hasExplicitRunOverride || !params.metadataSnapshot || entry.modelOverrideSource !== "auto" || !hasSessionAutoModelSelection(entry) || hasSessionActiveAutoModelFallback(entry) || resolveSessionModelOverrideRouteResolution(entry) !== "resolved") return;
	const provider = entry.providerOverride?.trim();
	const model = entry.modelOverride?.trim();
	if (!provider || !model || provider.includes("/") || model.includes("/")) return;
	if (!isModelSelectionLocked(entry) && repairProviderWrappedModelOverride({
		entry: { ...entry },
		defaultProvider: params.defaultProvider,
		defaultModel: params.defaultModel
	}).updated) return;
	const normalizedProvider = normalizeProviderId(provider);
	return [...params.metadataSnapshot.owners.modelCatalogProviders.keys()].some((catalogProvider) => normalizeProviderId(catalogProvider) === normalizedProvider) ? void 0 : {
		provider,
		model
	};
}
function prepareCommandModelCatalog(params) {
	const { cfg, metadataSnapshot, pluginsEnabled, workspaceDir } = params;
	const policyParams = {
		cfg,
		defaultProvider: params.defaultProvider,
		defaultModel: {
			provider: params.defaultProvider,
			model: params.defaultModel
		},
		agentId: params.agentId,
		allowManifestNormalization: true,
		allowPluginNormalization: pluginsEnabled,
		...params.modelManifestContext
	};
	let fullCatalog;
	const loadFullCatalog = () => {
		if (!fullCatalog) {
			const catalog = pluginsEnabled ? loadManifestModelCatalog({
				config: cfg,
				workspaceDir,
				metadataSnapshot,
				fallbackToMetadataScan: false
			}) : [];
			fullCatalog = {
				catalog,
				policy: createModelVisibilityPolicy({
					...policyParams,
					catalog
				})
			};
		}
		return fullCatalog;
	};
	const selection = resolveDeferredSelection(params);
	if (selection) {
		const configuredPolicy = createModelVisibilityPolicy({
			...policyParams,
			catalog: []
		});
		if (!configuredPolicy.hasProviderWildcards && configuredPolicy.exactModelRefs.every((ref) => parseProviderModelRef(ref) !== null) && hasResolvedThinkingCatalogEntry({
			catalog: configuredPolicy.configuredCatalog,
			...selection
		})) return {
			visibilityPolicy: configuredPolicy,
			modelCatalog: [],
			loadDeferredThinkingCatalog: () => loadFullCatalog().policy.catalog
		};
	}
	const loaded = loadFullCatalog();
	return {
		visibilityPolicy: loaded.policy,
		modelCatalog: loaded.catalog
	};
}
//#endregion
//#region src/agents/command/model-selection.ts
async function resolveEmbeddedModelSelection(params) {
	const operatorAuthority = params.opts.operatorAuthority;
	if (operatorAuthority) {
		assertAdmittedRunOperatorAuthority(operatorAuthority);
		operatorAuthority.assertCurrent();
	}
	const configuredDefaultRef = resolveDefaultModelForAgent({
		cfg: params.cfg,
		agentId: params.sessionAgentId,
		allowPluginNormalization: params.pluginsEnabled,
		...params.modelManifestContext
	});
	const configuredDefaultAuthProfileId = splitTrailingAuthProfile(resolveNativeModelPrimary(params.cfg, params.sessionAgentId) ?? "").profile;
	const { provider: defaultProvider, model: defaultModel } = configuredDefaultRef;
	let provider = defaultProvider;
	let model = defaultModel;
	let sessionEntry = params.sessionEntry;
	let hasStoredOverride = Boolean(sessionEntry?.modelOverrideSource !== "default" && (sessionEntry?.modelOverride || sessionEntry?.providerOverride));
	const explicitProviderOverride = typeof params.opts.provider === "string" ? normalizeExplicitOverrideInput(params.opts.provider, "provider") : void 0;
	const explicitModelOverride = typeof params.opts.model === "string" ? normalizeExplicitOverrideInput(params.opts.model, "model") : void 0;
	const hasExplicitRunOverride = Boolean(explicitProviderOverride || explicitModelOverride);
	if (hasExplicitRunOverride && isModelSelectionLocked(sessionEntry)) throw new ModelSelectionLockedError();
	if (hasExplicitRunOverride && params.opts.allowModelOverride !== true) throw new Error("Model override is not authorized for this caller.");
	const { visibilityPolicy, modelCatalog, loadDeferredThinkingCatalog } = prepareCommandModelCatalog({
		cfg: params.cfg,
		agentId: params.sessionAgentId,
		sessionEntry,
		hasExplicitRunOverride,
		metadataSnapshot: params.manifestMetadataSnapshot,
		pluginsEnabled: params.pluginsEnabled,
		workspaceDir: params.workspaceDir,
		defaultProvider,
		defaultModel,
		modelManifestContext: params.modelManifestContext
	});
	if ((!hasExplicitRunOverride || !operatorAuthority?.modelPolicy) && !isModelSelectionLocked(sessionEntry) && sessionEntry && params.sessionStore && params.sessionKey && hasStoredOverride && !isValidAgentHarnessSessionStoreEntry(params.sessionKey, sessionEntry) && !params.suppressVisibleSessionEffects) {
		const initialEntry = sessionEntry;
		const entry = { ...sessionEntry };
		const resetToDefaultModel = () => applyModelOverrideToSessionEntry({
			entry,
			selection: {
				provider: defaultProvider,
				model: defaultModel,
				isDefault: true
			}
		}).updated;
		let entryUpdated = hasLegacyAutoFallbackWithoutOrigin(entry) && resetToDefaultModel();
		const repaired = repairProviderWrappedModelOverride({
			entry,
			defaultProvider,
			defaultModel
		});
		entryUpdated ||= repaired.updated;
		const directOverride = resolveDirectStoredModelOverride({
			sessionEntry: entry,
			defaultProvider,
			allowPluginNormalization: params.pluginsEnabled,
			...params.modelManifestContext
		});
		if (directOverride) {
			const normalizedOverride = {
				provider: directOverride.provider ?? defaultProvider,
				model: directOverride.model
			};
			if (!hasSessionAutoModelSelection(entry) && !visibilityPolicy.allows(normalizedOverride)) {
				const updated = resetToDefaultModel();
				entryUpdated ||= updated;
			}
		}
		if (entryUpdated) {
			sessionEntry = await persistAgentSession({
				agentId: params.sessionAgentId,
				sessionStore: params.sessionStore,
				sessionKey: params.sessionKey,
				storePath: params.storePath,
				initialEntry,
				entry,
				assertCommitAllowed: operatorAuthority?.assertCurrent
			});
			hasStoredOverride = sessionEntry?.modelOverrideSource !== "default" && Boolean(sessionEntry?.modelOverride || sessionEntry?.providerOverride);
		}
	}
	let storedModelOverrideSource = hasStoredOverride && sessionEntry?.modelOverrideSource !== "default" ? sessionEntry?.modelOverrideSource : void 0;
	let hasStoredAutoFallbackProvenance = hasStoredOverride && hasSessionAutoModelFallbackProvenance(sessionEntry);
	const hasLegacyAutoFallbackOverrideWithoutOrigin = hasStoredOverride && !isModelSelectionLocked(sessionEntry) && hasLegacyAutoFallbackWithoutOrigin(sessionEntry);
	const effectiveStoredOverride = hasLegacyAutoFallbackOverrideWithoutOrigin ? null : resolveStoredModelOverrideCore({
		sessionEntry,
		sessionStore: params.sessionStore,
		sessionKey: params.sessionKey,
		parentSessionKey: sessionEntry?.parentSessionKey,
		defaultProvider,
		allowPluginNormalization: params.pluginsEnabled,
		...params.modelManifestContext
	});
	if (effectiveStoredOverride?.source === "parent") {
		storedModelOverrideSource = void 0;
		hasStoredAutoFallbackProvenance = false;
	}
	const canUseStoredOverrideFields = sessionEntry?.modelOverrideSource !== "default";
	const storedProviderOverride = hasLegacyAutoFallbackOverrideWithoutOrigin ? void 0 : effectiveStoredOverride?.provider ?? (canUseStoredOverrideFields ? sessionEntry?.providerOverride?.trim() : void 0);
	const storedModelOverride = hasLegacyAutoFallbackOverrideWithoutOrigin ? void 0 : effectiveStoredOverride?.model ?? (canUseStoredOverrideFields ? sessionEntry?.modelOverride?.trim() : void 0);
	const storedModelOverrideRouteResolution = effectiveStoredOverride?.routeResolution;
	const hasStoredAutomaticSelection = effectiveStoredOverride?.source === "session" && hasSessionAutoModelSelection(sessionEntry);
	const currentRunModelChannel = [
		params.runContext.messageChannel,
		params.opts.replyChannel,
		params.opts.channel
	].find((channel) => Boolean(channel && isDeliverableMessageChannel(channel)));
	const channelOverrideGroupId = currentRunModelChannel ? params.runContext.groupId ?? sessionEntry?.groupId ?? params.runContext.currentChannelId : sessionEntry?.groupId ?? params.runContext.groupId ?? params.runContext.currentChannelId;
	const channelModelOverride = params.cfg.channels?.modelByChannel && !hasExplicitRunOverride ? resolveChannelModelOverride({
		cfg: params.cfg,
		channel: currentRunModelChannel ?? sessionDeliveryChannel(sessionEntry),
		groupId: channelOverrideGroupId,
		groupChatType: sessionEntry?.chatType ?? sessionDeliveryOrigin(sessionEntry)?.chatType,
		groupChannel: params.runContext.groupChannel ?? sessionEntry?.groupChannel,
		groupSubject: sessionEntry?.subject,
		parentSessionKey: sessionEntry?.parentSessionKey ?? params.sessionKey,
		directUserIds: [
			sessionDeliveryOrigin(sessionEntry)?.nativeDirectUserId,
			sessionDeliveryOrigin(sessionEntry)?.from,
			sessionDeliveryOrigin(sessionEntry)?.to
		]
	}) : null;
	const normalizedChannelOverride = channelModelOverride ? parseAgentCommandModelRef(params.cfg, params.sessionAgentId, channelModelOverride.model, defaultProvider, params.modelManifestContext) : null;
	const primaryProvider = normalizedChannelOverride?.provider ?? defaultProvider;
	const primaryModel = normalizedChannelOverride?.model ?? defaultModel;
	if (normalizedChannelOverride && !Boolean(storedProviderOverride || storedModelOverride)) {
		provider = normalizedChannelOverride.provider;
		model = normalizedChannelOverride.model;
	}
	if (storedModelOverride) {
		const candidateProvider = storedProviderOverride || defaultProvider;
		const storedRouteCataloged = modelCatalog.some((entry) => entry.provider === candidateProvider && entry.id === storedModelOverride);
		const normalizedStored = (storedModelOverrideRouteResolution === "raw" && !storedRouteCataloged ? resolveModelAliasFromPair({
			cfg: params.cfg,
			agentId: params.sessionAgentId,
			provider: candidateProvider,
			model: storedModelOverride,
			defaultProvider,
			aliasIndex: visibilityPolicy.selectionAliasIndex,
			allowPluginNormalization: params.pluginsEnabled,
			...params.modelManifestContext
		}) : null) ?? {
			provider: candidateProvider,
			model: storedModelOverride
		};
		if (isModelSelectionLocked(sessionEntry) || hasStoredAutomaticSelection || visibilityPolicy.allows(normalizedStored)) {
			provider = normalizedStored.provider;
			model = normalizedStored.model;
		}
	}
	const autoFallbackPrimaryProbe = !hasExplicitRunOverride && !isModelSelectionLocked(sessionEntry) && (operatorAuthority?.modelPolicy?.allows({
		provider: primaryProvider,
		model: primaryModel
	}) ?? true) ? resolveAutoFallbackPrimaryProbe({
		entry: sessionEntry,
		sessionKey: params.sessionKey,
		primaryProvider,
		primaryModel
	}) : void 0;
	let autoFallbackPrimaryProbeSessionEntry;
	if (autoFallbackPrimaryProbe && sessionEntry) {
		provider = autoFallbackPrimaryProbe.provider;
		model = autoFallbackPrimaryProbe.model;
		autoFallbackPrimaryProbeSessionEntry = { ...sessionEntry };
		clearAutoFallbackPrimaryProbeSelection(autoFallbackPrimaryProbeSessionEntry);
	}
	if (hasExplicitRunOverride) {
		const explicitRef = explicitProviderOverride ? normalizeAgentCommandModelRef(params.cfg, explicitProviderOverride, explicitModelOverride ?? model, params.modelManifestContext) : explicitModelOverride ? parseAgentCommandModelRef(params.cfg, params.sessionAgentId, explicitModelOverride, provider, params.modelManifestContext) : null;
		if (!explicitRef) throw new Error("Invalid model override.");
		assertOperatorModelAllowed(operatorAuthority, explicitRef);
		if (!visibilityPolicy.allows(explicitRef)) {
			const rejectedKey = `${sanitizeForLog(explicitRef.provider)}/${sanitizeForLog(explicitRef.model)}`;
			const policyPath = visibilityPolicy.allowConfigPath ?? "modelPolicy.allow";
			const repairPath = visibilityPolicy.allowRepairConfigPath;
			throw new Error(`Model override "${rejectedKey}" is not allowed for agent "${params.sessionAgentId}" by ${policyPath}. Add "${rejectedKey}" or "${sanitizeForLog(explicitRef.provider)}/*" to ${repairPath}, or remove/empty the list to allow any model.`);
		}
		provider = explicitRef.provider;
		model = explicitRef.model;
	}
	const allowedInitialSelection = isModelSelectionLocked(sessionEntry) || hasStoredAutomaticSelection && !hasExplicitRunOverride && !autoFallbackPrimaryProbe ? {
		provider,
		model
	} : visibilityPolicy.resolveSelection({
		provider,
		model,
		routeResolution: "resolved"
	});
	if (!allowedInitialSelection) {
		const policyPath = visibilityPolicy.allowConfigPath ?? "modelPolicy.allow";
		throw new Error(`Configured default model "${buildModelCatalogRef(provider, model)}" is not allowed by ${policyPath}, and no allowed model is available.`);
	}
	const operatorSelection = hasExplicitRunOverride || isModelSelectionLocked(sessionEntry) ? allowedInitialSelection : resolveOperatorModelDefault({
		cfg: params.cfg,
		agentId: params.sessionAgentId,
		...params.modelManifestContext,
		policy: operatorAuthority?.modelPolicy,
		model: allowedInitialSelection,
		allows: visibilityPolicy.allows
	});
	assertOperatorModelAllowed(operatorAuthority, operatorSelection);
	if (!operatorSelection) throw new Error("No model is available for this operator role and agent.");
	provider = operatorSelection.provider;
	model = operatorSelection.model;
	const operatorModelOverride = provider !== allowedInitialSelection.provider || model !== allowedInitialSelection.model;
	const providerForAuthProfileValidation = provider;
	let sessionEntryForAttempt = autoFallbackPrimaryProbeSessionEntry ?? sessionEntry;
	const initialAgentHarnessRuntimeOverride = resolveSessionRuntimeOverrideForProvider({
		provider,
		entry: sessionEntryForAttempt,
		cfg: params.cfg
	});
	await ensureSelectedAgentHarnessPlugin({
		config: params.cfg,
		provider,
		modelId: model,
		agentId: params.sessionAgentId,
		sessionKey: params.sessionKey,
		agentHarnessRuntimeOverride: initialAgentHarnessRuntimeOverride,
		workspaceDir: params.workspaceDir,
		pluginRegistry: requireActivePluginRegistry()
	});
	assertOperatorModelAllowed(operatorAuthority, {
		provider,
		model
	});
	const authProfileId = sessionEntryForAttempt?.authProfileOverride;
	if (sessionEntryForAttempt && authProfileId) {
		const entry = sessionEntryForAttempt;
		const authConfig = resolveModelProviderAuthConfig({
			config: params.cfg,
			provider: providerForAuthProfileValidation,
			modelId: model,
			workspaceDir: params.workspaceDir,
			metadataSnapshot: params.pluginsEnabled ? params.manifestMetadataSnapshot : { plugins: [] }
		});
		const agentDir = resolveAgentDir(params.cfg, params.sessionAgentId);
		const store = await ensureAuthProfileStoreAsync(agentDir, {
			profileId: authProfileId,
			config: params.cfg,
			allowKeychainPrompt: false
		});
		const profile = store.profiles[authProfileId];
		const validationHarnessPolicy = resolveAvailableAgentHarnessPolicy({
			provider: providerForAuthProfileValidation,
			modelId: model,
			config: params.cfg,
			agentId: params.sessionAgentId,
			sessionKey: params.sessionKey
		});
		const authAliasLookupParams = {
			config: authConfig,
			workspaceDir: params.workspaceDir,
			...params.pluginsEnabled ? params.manifestMetadataSnapshot ? { metadataSnapshot: params.manifestMetadataSnapshot } : {} : { metadataSnapshot: { plugins: [] } }
		};
		const acceptedAuthProviders = listOpenAIAuthProfileProvidersForAgentRuntime({
			provider: providerForAuthProfileValidation,
			harnessRuntime: validationHarnessPolicy.runtime,
			config: params.cfg
		}).map((candidateProvider) => params.pluginsEnabled ? resolveProviderIdForAuth(candidateProvider, authAliasLookupParams) : candidateProvider);
		const profileMatchesRuntime = profile && acceptedAuthProviders.some((candidateProvider) => isStoredCredentialCompatibleWithAuthProvider({
			cfg: authConfig,
			authAliasLookupParams,
			provider: candidateProvider,
			credential: profile
		}));
		const preserveUnavailableSelection = shouldPreserveUnavailableSessionAuthProfileOverride({
			store,
			cfg: authConfig,
			agentDir,
			entry,
			currentProvider: entry.providerOverride ?? defaultProvider,
			provider: providerForAuthProfileValidation,
			metadataSnapshot: params.pluginsEnabled ? params.manifestMetadataSnapshot : { plugins: [] }
		});
		if (!profileMatchesRuntime && !preserveUnavailableSelection) {
			if (hasExplicitRunOverride || autoFallbackPrimaryProbe || operatorModelOverride) sessionEntryForAttempt = {
				...entry,
				authProfileOverride: void 0,
				authProfileOverrideSource: void 0,
				authProfileOverrideCompactionCount: void 0
			};
			else if (params.sessionStore && params.sessionKey && !params.suppressVisibleSessionEffects) await clearSessionAuthProfileOverride({
				agentId: params.sessionAgentId,
				sessionEntry: entry,
				sessionStore: params.sessionStore,
				sessionKey: params.sessionKey,
				storePath: params.storePath
			});
		}
	}
	const configuredThinkLevel = normalizeThinkLevel(resolveAgentConfig(params.cfg, params.sessionAgentId)?.thinkingDefault);
	const immutableThinkLevel = params.requestedThinkLevel ?? configuredThinkLevel;
	const primaryConfiguredThinkLevel = immutableThinkLevel ?? resolveConfiguredThinkingDefaultCore({
		cfg: params.cfg,
		agentId: params.sessionAgentId,
		provider,
		model
	});
	const thinkingRuntime = resolveEffectiveAgentRuntime({
		cfg: params.cfg,
		provider,
		modelId: model,
		agentId: params.sessionAgentId,
		sessionKey: params.sessionKey,
		sessionEntry: sessionEntryForAttempt
	});
	let catalogForThinking = visibilityPolicy.catalog.length > 0 ? visibilityPolicy.catalog : params.configuredThinkingCatalog;
	if (params.pluginsEnabled && (primaryConfiguredThinkLevel !== "off" || thinkingRuntime !== "openclaw")) {
		const { loadProviderScopedThinkingCatalog } = await import("./agents/model-catalog.runtime.js");
		const runtimeCatalog = normalizeThinkingCatalogProviders(await loadProviderScopedThinkingCatalog({
			config: params.cfg,
			provider,
			model,
			agentRuntime: thinkingRuntime,
			...params.sessionAgentId ? { agentId: params.sessionAgentId } : {},
			...params.workspaceDir ? { workspaceDir: params.workspaceDir } : {}
		}));
		const refreshedModel = findModelInCatalog(runtimeCatalog, provider, model);
		if (refreshedModel) catalogForThinking = createModelVisibilityPolicy({
			cfg: params.cfg,
			catalog: dedupeModelCatalogEntries([refreshedModel, ...catalogForThinking]),
			defaultProvider,
			defaultModel: configuredDefaultRef,
			agentId: params.sessionAgentId,
			allowManifestNormalization: true,
			allowPluginNormalization: params.pluginsEnabled,
			...params.modelManifestContext
		}).catalog;
	}
	const thinkingCatalog = catalogForThinking.length > 0 ? catalogForThinking : void 0;
	const primaryThinking = resolveThinkingSelectionCore({
		cfg: params.cfg,
		agentId: params.sessionAgentId,
		provider,
		model,
		level: primaryConfiguredThinkLevel,
		catalog: thinkingCatalog,
		agentRuntime: thinkingRuntime
	});
	if (!primaryThinking.supported) {
		const explicitThink = Boolean(params.thinkOnce || params.thinkOverride);
		const isSubagentSpawnRun = params.isSubagentLane && isSubagentSessionKey(params.sessionKey);
		if (explicitThink && !isSubagentSpawnRun) throw new Error(`Thinking level "${primaryThinking.requestedLevel}" is not supported for ${provider}/${model}. Use one of: ${formatThinkingLevels(provider, model, ", ", thinkingCatalog, thinkingRuntime)}.`);
	}
	if (params.thinkOverride && params.sessionStore && params.sessionKey && !params.suppressVisibleSessionEffects) {
		const now = Date.now();
		const entry = params.sessionStore[params.sessionKey] ?? sessionEntry ?? {
			sessionId: params.sessionId,
			updatedAt: now,
			sessionStartedAt: now
		};
		const next = {
			...entry,
			sessionId: params.sessionId,
			updatedAt: now,
			sessionStartedAt: entry.sessionStartedAt ?? now,
			lastInteractionAt: now,
			thinkingLevel: params.thinkOverride
		};
		sessionEntry = await persistAgentSession({
			agentId: params.sessionAgentId,
			sessionStore: params.sessionStore,
			sessionKey: params.sessionKey,
			storePath: params.storePath,
			initialEntry: entry,
			entry: next,
			assertCommitAllowed: operatorAuthority?.assertCurrent
		}) ?? sessionEntry;
		sessionEntryForAttempt = {
			...sessionEntryForAttempt ?? next,
			thinkingLevel: params.thinkOverride
		};
	}
	assertOperatorModelAllowed(operatorAuthority, {
		provider,
		model
	});
	const sessionFile = params.sessionKey ?? params.sessionId;
	if (params.sessionKey && !params.suppressVisibleSessionEffects) sessionEntry ??= params.sessionStore?.[params.sessionKey];
	return {
		sessionEntry,
		provider,
		model,
		requestedRouteResolution: "resolved",
		defaultProvider,
		defaultModel,
		configuredDefaultAuthProfileId,
		providerForAuthProfileValidation,
		hasExplicitRunOverride,
		storedProviderOverride,
		storedModelOverride,
		storedModelOverrideSource,
		hasStoredAutoFallbackProvenance,
		autoFallbackPrimaryProbe,
		sessionEntryForAttempt,
		thinkingCatalog,
		...loadDeferredThinkingCatalog ? { loadDeferredThinkingCatalog } : {},
		immutableThinkLevel,
		effectiveTurnThinkLevel: primaryThinking.requestedLevel,
		sessionFile
	};
}
//#endregion
//#region src/agents/pending-final-delivery-marker.ts
/** Persists restart-recoverable final delivery markers for agent runs. */
async function persistPendingFinalDeliveryMarker(params) {
	const sendablePayloads = params.payloads.filter((payload) => normalizePendingFinalDeliveryPayloads([payload]).length > 0);
	const hasSendableFinalPayload = sendablePayloads.length > 0;
	const recoverableText = buildRecoverablePendingFinalDeliveryText(normalizePendingFinalRecoveryPayloads(params.payloads));
	const entry = (params.sessionKey ? params.sessionStore?.[params.sessionKey] : void 0) ?? params.sessionEntry;
	if (!params.deliver || !params.sessionStore || !params.sessionKey || !entry || params.suppressVisibleSessionEffects || params.sessionReboundDuringRun || isSubagentSessionKey(params.sessionKey) || !hasSendableFinalPayload || !params.deliveryContext) return {
		sessionEntry: params.sessionEntry,
		pendingFinalDeliveryMarkerPersisted: false,
		hasSendableFinalPayload
	};
	params.assertCurrent?.();
	const sessionKey = resolveSqliteSessionKey(params.sessionKey, params.agentId);
	const now = Date.now();
	const intentId = randomUUID();
	const deliveryId = randomUUID();
	const admitted = params.admittedRecoverySource;
	const harnessCompletion = admitted ? advancePendingFinalRecoverySource(admitted, params.compactionTransitions)?.restartRecoveryHarnessCompletion : void 0;
	const persisted = await applySessionEntryExactReplacements({
		agentId: params.agentId,
		sessionKeys: [sessionKey],
		storePath: params.storePath,
		assertCommitAllowed: params.assertCurrent,
		update: (entries) => {
			const current = entries.find((candidate) => candidate.sessionKey === sessionKey)?.entry;
			if (!current || current.sessionId !== params.runOwnedSessionId || current.abortedLastRun === true || admitted && !matchesPendingFinalRecoverySource(current, admitted, params.compactionTransitions) || harnessCompletion && (harnessCompletion.sessionId !== current.sessionId || harnessCompletion.lifecycleRevision !== current.lifecycleRevision || !isDeepStrictEqual(current.restartRecoveryHarnessCompletion, harnessCompletion))) return { result: current };
			const sourceRunId = harnessCompletion?.sourceRunId ?? (admitted ? getRestartRecoveryPendingFinalSourceRunId(current, params.deliveryContext) : void 0);
			const savedEvidence = harnessCompletion ? getRestartRecoveryTerminalDeliveryEvidence(current, harnessCompletion.sourceRunId) : void 0;
			const next = {
				...current,
				pendingFinalDelivery: {
					...recoverableText && params.commandOwnerReference === void 0 ? {
						kind: "replayable",
						text: recoverableText
					} : { kind: "transport-only" },
					intentId,
					...sourceRunId ? { sourceRunId } : {},
					deliveries: [{
						id: deliveryId,
						state: "prepared"
					}],
					createdAt: now,
					context: params.deliveryContext
				},
				...harnessCompletion && !savedEvidence ? { restartRecoveryTerminalDeliveryEvidence: mergeRestartRecoveryTerminalDeliveryEvidence(current.restartRecoveryTerminalDeliveryEvidence, [{
					runId: harnessCompletion.sourceRunId,
					harnessCompletion,
					deliveryContext: params.deliveryContext,
					captured: true
				}]) } : {},
				updatedAt: Math.max(current.updatedAt, now)
			};
			return {
				result: next,
				replacements: [{
					sessionKey,
					entry: next
				}]
			};
		}
	});
	if (persisted) params.sessionStore[params.sessionKey] = persisted;
	else delete params.sessionStore[params.sessionKey];
	const markerPersisted = persisted?.pendingFinalDelivery?.intentId === intentId;
	if (markerPersisted) for (const payload of sendablePayloads) setReplyPayloadMetadata(payload, {
		...harnessCompletion ? { sessionWriterDeliveryAuthority: {
			...getReplyPayloadMetadata(payload)?.sessionWriterDeliveryAuthority,
			agentId: harnessCompletion.requesterAgentId,
			expectedSessionId: params.runOwnedSessionId,
			...harnessCompletion.lifecycleRevision ? { expectedLifecycleRevision: harnessCompletion.lifecycleRevision } : {},
			sessionKey: params.sessionKey,
			storePath: params.storePath,
			harnessCompletion
		} } : {},
		pendingFinalDeliveryCompletion: {
			commandOwnerReference: params.commandOwnerReference,
			agentId: params.agentId,
			deliveryId,
			intentId,
			...admitted?.restartRecoveryDeliveryRunId ? { recoveryRunId: admitted.restartRecoveryDeliveryRunId } : {},
			sessionId: params.runOwnedSessionId,
			sessionKey: params.sessionKey,
			storePath: params.storePath
		}
	});
	return {
		sessionEntry: persisted,
		pendingFinalDeliveryMarkerPersisted: markerPersisted,
		...markerPersisted ? { pendingFinalDeliveryIntentId: intentId } : {},
		hasSendableFinalPayload
	};
}
/** Keep only this captured intent's completion locator in step with a host commit. */
function advancePendingFinalDeliveryCompletion(params) {
	const { transition, entry } = params;
	if (!transition?.previous || !params.intentId || entry.sessionId !== transition.current.sessionId || entry.lifecycleRevision !== transition.current.lifecycleRevision) return;
	for (const payload of params.payloads) {
		const metadata = getReplyPayloadMetadata(payload);
		const completion = metadata?.pendingFinalDeliveryCompletion;
		if (completion?.sessionId === transition.previous.sessionId && completion.intentId === params.intentId && entry.pendingFinalDelivery?.intentId === completion.intentId && entry.pendingFinalDelivery.deliveries?.some((delivery) => delivery.id === completion.deliveryId)) {
			const authority = metadata?.sessionWriterDeliveryAuthority;
			const claim = advanceHarnessCompletionClaim(authority?.harnessCompletion, transition);
			if (authority?.harnessCompletion && (!claim || !isDeepStrictEqual(entry.restartRecoveryHarnessCompletion, claim))) continue;
			setReplyPayloadMetadata(payload, {
				...claim && authority ? { sessionWriterDeliveryAuthority: {
					...authority,
					expectedSessionId: transition.current.sessionId,
					expectedLifecycleRevision: transition.current.lifecycleRevision,
					harnessCompletion: claim
				} } : {},
				pendingFinalDeliveryCompletion: {
					...completion,
					sessionId: transition.current.sessionId
				}
			});
		}
	}
}
//#endregion
//#region src/agents/command/post-run.ts
const log$4 = createSubsystemLogger("agents/agent-command");
async function finalizeEmbeddedAgentCommand(params) {
	const operatorAuthority = params.opts.operatorAuthority;
	const assertSourceCurrent = params.opts.assertSourceCurrent;
	const { cfg, body, transcriptBody, sessionId, sessionKey, sessionStore, storePath, sessionAgentId, workspaceDir, cwd, agentDir, timeoutMs, outboundSession, runId } = params.prepared;
	const sessionSource = sessionKey ? captureSessionActorStorageOwner({
		agentId: sessionAgentId,
		storePath,
		sessionKey
	}, {
		assertCurrent: () => assertSourceCurrent?.(),
		authorize() {}
	}) : void 0;
	const { fallbackProvider, fallbackModel, fallbackExhausted, provider, model, effectiveTurnThinkLevel, internalSessionTarget, attemptExecutionRuntime, messageChannel, suppressUserTurnPersistence, userTurnTranscriptRecorder, fallbackTrajectoryRecorder, deferredLifecycle, lifecycle, terminal, lifecycleGeneration } = params.attempt;
	const { skillsSnapshot, runContext } = params.embeddedSessionState;
	const interruptedForRestart = () => inspectMainSessionRecoveryLifecycleEvent({
		currentLifecycleGeneration: lifecycleGeneration,
		event: { data: {
			phase: "end",
			...terminal.outcome
		} },
		abortSignal: deferredLifecycle.signal
	}).interrupted;
	const effectiveCwd = cwd ?? workspaceDir;
	const isHeartbeatLifecycleRun = isHeartbeatLifecycleRunKind(params.opts.bootstrapContextRunKind);
	let sessionEntry = params.sessionEntry;
	const terminalReply = normalizeAgentRunTerminalReplySnapshot(terminal.metadata.terminalReply);
	const terminalReceipt = normalizeAgentRunTerminalReceipt(terminal.metadata.terminalReceipt);
	let result = {
		...params.attempt.result,
		meta: {
			...params.attempt.result.meta,
			...terminalReply ? { terminalReply } : {},
			...terminalReceipt && params.attempt.result.meta.agentMeta ? { agentMeta: {
				...params.attempt.result.meta.agentMeta,
				terminalReceipt
			} } : {}
		}
	};
	let deliveryResult;
	let terminalDeliveryEvidence;
	let hasResultError;
	let terminalError;
	let maintenanceRequest;
	let { runOwnedSessionId, sessionReboundDuringRun } = params.sessionOwnership;
	const publishSessionOwnership = (committedCompactionSessionId) => params.onSessionOwnershipChanged({
		runOwnedSessionId,
		sessionReboundDuringRun
	}, committedCompactionSessionId);
	try {
		await fallbackTrajectoryRecorder?.flush();
		const finalVisiblePayload = result.payloads?.toReversed().find((payload) => !payload.isError && !payload.isReasoning && payload.text?.trim());
		const assistantTranscriptOwned = finalVisiblePayload !== void 0 && getReplyPayloadMetadata(finalVisiblePayload)?.assistantTranscriptOwned === true;
		if (params.opts.internalDeliveryMediaUrls !== void 0) result = {
			...result,
			payloads: constrainRestartRecoveryDeliveryPayloads(result.payloads, params.opts.internalDeliveryMediaUrls, params.opts.internalDeliverySuppressText === true)
		};
		const resultErrorPayload = result.payloads?.find((payload) => payload.isError === true);
		if (resultErrorPayload) {
			const message = typeof resultErrorPayload.text === "string" && resultErrorPayload.text.trim() ? resultErrorPayload.text : void 0;
			params.opts.onResultErrorPayload?.(message);
		}
		terminalDeliveryEvidence = buildRestartRecoveryTerminalDeliveryEvidence(result);
		params.onTerminalDeliveryEvidenceChanged(terminalDeliveryEvidence);
		const compactionFact = params.attempt.compactionAccounting;
		const effectiveSessionId = compactionFact?.target.sessionId ?? internalSessionTarget?.sessionId ?? sessionId;
		if (sessionStore && sessionKey && !params.suppressVisibleSessionEffects) {
			const { updateSessionStoreAfterAgentRun } = await loadSessionStoreRuntime();
			await updateSessionStoreAfterAgentRun({
				agentId: sessionAgentId,
				cfg,
				agentDir,
				sessionId: effectiveSessionId,
				sessionKey,
				storePath,
				sessionStore,
				defaultProvider: provider,
				defaultModel: model,
				fallbackProvider,
				fallbackModel,
				result,
				compactionAccounting: compactionFact,
				touchInteraction: params.opts.bootstrapContextRunKind !== "cron" && !isHeartbeatLifecycleRun && !params.opts.internalEvents?.length,
				touchActivity: !isHeartbeatLifecycleRun && !params.opts.internalEvents?.length,
				preserveRuntimeModel: result.meta.providerStarted === false || fallbackExhausted || fallbackProvider !== provider || fallbackModel !== model || isHeartbeatLifecycleRun || params.preserveUserFacingSessionModelState,
				preserveUserFacingSessionModelState: params.preserveUserFacingSessionModelState,
				clearRestartRecoveryForceSafeTools: params.opts.forceRestartSafeTools === true && params.opts.deliver !== true
			});
			sessionEntry = sessionStore[sessionKey] ?? sessionEntry;
		}
		runOwnedSessionId = effectiveSessionId;
		publishSessionOwnership();
		const transcriptPersistenceRunner = result.meta.executionTrace?.runner;
		let persistedCliTurnTranscript = false;
		if (!sessionReboundDuringRun && transcriptPersistenceRunner === "cli") try {
			const transcriptResult = await attemptExecutionRuntime.persistCliTurnTranscript({
				body,
				transcriptBody,
				inputProvenance: params.opts.inputProvenance,
				result,
				sessionId: effectiveSessionId,
				sessionKey: internalSessionTarget?.sessionKey ?? sessionKey ?? effectiveSessionId,
				sessionEntry: internalSessionTarget?.sessionEntry ?? sessionEntry,
				sessionStore: params.suppressVisibleSessionEffects ? void 0 : sessionStore,
				storePath: internalSessionTarget?.storePath ?? storePath,
				sessionAgentId: internalSessionTarget?.agentId ?? sessionAgentId,
				threadId: params.opts.threadId,
				sessionCwd: effectiveCwd,
				config: cfg,
				runId,
				skipAssistantTurn: assistantTranscriptOwned,
				skipUserTurn: suppressUserTurnPersistence || params.opts.userTurnTranscriptRecorder !== void 0 || userTurnTranscriptRecorder.hasPersisted() || userTurnTranscriptRecorder.isBlocked()
			});
			sessionReboundDuringRun = transcriptResult.kind === "session-rebound";
			publishSessionOwnership();
			if (!internalSessionTarget) sessionEntry = transcriptResult.sessionEntry;
			persistedCliTurnTranscript = transcriptResult.kind === "persisted";
		} catch (error) {
			log$4.warn(`Turn transcript persistence failed for ${sessionKey ?? sessionId}: ${coerceErrorMessage(error)}`);
			if (sessionStore && sessionKey && !params.suppressVisibleSessionEffects && !sessionReboundDuringRun && !assistantTranscriptOwned) await persistAssistantTranscriptRepairRecord({
				context: {
					sessionKey: internalSessionTarget?.sessionKey ?? sessionKey ?? effectiveSessionId,
					sessionEntry: internalSessionTarget?.sessionEntry ?? sessionEntry,
					sessionStore,
					storePath: internalSessionTarget?.storePath ?? storePath,
					sessionAgentId: internalSessionTarget?.agentId ?? sessionAgentId,
					config: cfg
				},
				replyText: attemptExecutionRuntime.resolveCliTranscriptReplyText(result),
				provider: result.meta.agentMeta?.provider,
				model: result.meta.agentMeta?.model,
				runOwnedSessionId
			});
		}
		const payloads = result.payloads ?? [];
		const pendingFinalDeliveryMarker = await persistPendingFinalDeliveryMarker({
			admittedRecoverySource: params.admittedRecoverySource,
			compactionTransitions: compactionFact?.admissionTransitions,
			assertCurrent: () => {
				assertSourceCurrent?.();
				operatorAuthority?.assertCurrent();
				assertAgentRunLifecycleGenerationCurrent(lifecycleGeneration);
			},
			commandOwnerReference: params.opts.assertSourceCurrent?.recoveryReference,
			agentId: sessionAgentId,
			deliver: params.opts.deliver === true,
			sessionStore,
			sessionKey,
			sessionEntry,
			storePath,
			suppressVisibleSessionEffects: params.suppressVisibleSessionEffects,
			sessionReboundDuringRun,
			payloads: selectSourceDeliverablePayloads(payloads, params.opts),
			deliveryContext: params.currentRunDeliveryContext,
			runOwnedSessionId
		});
		sessionEntry = pendingFinalDeliveryMarker.sessionEntry;
		let deliveryLifecycleRevision = sessionEntry?.lifecycleRevision;
		const resolveFreshSessionEntryForDelivery = sessionStore && sessionKey && !params.suppressVisibleSessionEffects ? async () => {
			const assertCurrent = () => {
				assertSourceCurrent?.();
				operatorAuthority?.assertCurrent();
				assertAgentRunLifecycleGenerationCurrent(lifecycleGeneration);
			};
			assertCurrent();
			const freshEntry = sessionSource ? readCapturedSessionActorEntry(sessionSource, normalizeStoreSessionKey(sessionKey)) : await readSessionEntryReadOnlyInWorker({
				agentId: sessionAgentId,
				storePath,
				sessionKey,
				readConsistency: "latest",
				clone: false
			}, assertCurrent);
			if (!freshEntry || freshEntry.sessionId !== runOwnedSessionId || freshEntry.lifecycleRevision !== deliveryLifecycleRevision) return;
			sessionStore[sessionKey] = freshEntry;
			return freshEntry;
		} : void 0;
		const agentMeta = result.meta.agentMeta;
		const embeddedMaintenance = transcriptPersistenceRunner === "embedded" && agentMeta?.agentHarnessId === "openclaw" && params.attempt.maintenanceAuthProfile !== void 0 && !fallbackExhausted && terminal.outcome.status === "ok" && !resultErrorPayload && !result.meta.yielded && !result.meta.aborted && (compactionFact?.count ?? 0) === 0 && !params.preserveUserFacingSessionModelState && params.opts.modelRun !== true && params.opts.promptMode !== "none";
		maintenanceRequest = sessionEntry && sessionKey && sessionStore && !params.suppressVisibleSessionEffects && !sessionReboundDuringRun && !isHeartbeatLifecycleRun && cfg.agents?.defaults?.compaction?.enabled !== false && embeddedMaintenance ? {
			prepared: {
				cfg,
				sessionKey,
				storePath,
				timeoutMs
			},
			followupRun: createCommandMaintenanceFollowup({
				prepared: params.prepared,
				sessionEntry,
				embeddedSessionState: params.embeddedSessionState,
				provider: agentMeta?.provider ?? fallbackProvider,
				model: agentMeta?.model ?? fallbackModel,
				thinkLevel: effectiveTurnThinkLevel,
				auth: params.attempt.maintenanceAuthProfile,
				senderIsOwner: params.opts.senderIsOwner
			}),
			sessionId: runOwnedSessionId,
			lifecycleRevision: sessionEntry.lifecycleRevision,
			lifecycleGeneration,
			startedAt: params.attempt.startedAt,
			oneShotCliRun: params.opts.oneShotCliRun,
			agentHarnessId: agentMeta?.agentHarnessId,
			compactionRequestBudget: params.attempt.compactionRequestBudget
		} : void 0;
		if (persistedCliTurnTranscript && !params.suppressVisibleSessionEffects && (params.opts.deliver !== true || !pendingFinalDeliveryMarker.hasSendableFinalPayload || pendingFinalDeliveryMarker.pendingFinalDeliveryMarkerPersisted)) {
			const maintenance = createCommandBudget(params.attempt.startedAt, timeoutMs, params.opts.abortSignal);
			let maintenanceLifecycleRevision = sessionEntry?.lifecycleRevision;
			const authorize = () => {
				throwAgentRunRestartAbortReason(params.opts.abortSignal?.reason);
				assertSourceCurrent?.();
				operatorAuthority?.assertCurrent();
				assertAgentRunLifecycleGenerationCurrent(lifecycleGeneration);
				return maintenance.remainingMs() > 0 && !maintenance.signal.aborted && !sessionReboundDuringRun;
			};
			const onCommitted = (accepted) => {
				advancePendingFinalDeliveryCompletion({
					payloads,
					intentId: pendingFinalDeliveryMarker.pendingFinalDeliveryIntentId,
					transition: accepted.admissionTransition,
					entry: accepted.entry
				});
				sessionEntry = accepted.entry;
				maintenanceLifecycleRevision = accepted.entry.lifecycleRevision;
				deliveryLifecycleRevision = accepted.entry.lifecycleRevision;
				runOwnedSessionId = accepted.sessionId;
				publishSessionOwnership(accepted.previousSessionId === void 0 ? void 0 : accepted.sessionId);
			};
			const assertActive = composeSessionSourceAssertion([assertSourceCurrent], (assertSources) => {
				assertSources();
				if (!authorize()) throw new Error("Command compaction is no longer active");
			});
			try {
				if (maintenance.remainingMs() > 0) {
					const { runCliTurnCompactionLifecycle } = await loadCliCompactionRuntime();
					sessionEntry = await runCliTurnCompactionLifecycle({
						cfg,
						sessionId: sessionEntry?.sessionId ?? effectiveSessionId,
						sessionKey: sessionKey ?? effectiveSessionId,
						sessionEntry,
						sessionStore,
						storePath,
						sessionAgentId,
						workspaceDir,
						cwd: effectiveCwd,
						agentDir,
						provider: agentMeta?.provider ?? provider,
						model: agentMeta?.model ?? model,
						cliBackendId: result.meta.executionTrace?.winnerProvider,
						skillsSnapshot,
						messageChannel,
						agentAccountId: runContext.accountId,
						senderIsOwner: params.opts.senderIsOwner,
						thinkLevel: effectiveTurnThinkLevel,
						extraSystemPrompt: params.opts.extraSystemPrompt,
						pluginGeneration: params.prepared.commandRuntimeContext?.pluginGeneration,
						abortSignal: maintenance.signal
					}, {
						assertActive,
						sourceAuthority: {
							assertActive,
							operatorAuthority
						},
						onCommitted
					});
					throwAgentRunRestartAbortReason(params.opts.abortSignal?.reason);
					assertAgentRunLifecycleGenerationCurrent(lifecycleGeneration);
					runOwnedSessionId = sessionEntry?.sessionId ?? runOwnedSessionId;
					publishSessionOwnership();
				}
			} catch (error) {
				throwAgentRunRestartAbortReason(params.opts.abortSignal?.reason);
				throwAgentRunRestartAbortReason(error);
				assertAgentRunLifecycleGenerationCurrent(lifecycleGeneration);
				if (maintenance.signal.aborted) {
					params.opts.abortSignal?.throwIfAborted();
					const currentEntry = await resolveFreshSessionEntryForDelivery?.();
					params.opts.abortSignal?.throwIfAborted();
					assertAgentRunLifecycleGenerationCurrent(lifecycleGeneration);
					if (!currentEntry || currentEntry.lifecycleRevision !== maintenanceLifecycleRevision) throw error;
					sessionEntry = currentEntry;
				} else if (params.opts.deliver !== true || !pendingFinalDeliveryMarker.pendingFinalDeliveryMarkerPersisted || !pendingFinalDeliveryMarker.hasSendableFinalPayload) throw error;
				log$4.warn(`Post-turn transcript compaction failed for ${sessionKey ?? sessionId}; continuing final delivery: ${formatErrorMessage(error)}`);
			} finally {
				maintenance.dispose();
			}
		}
		await params.opts.beforeTerminalDelivery?.(sessionReboundDuringRun ? void 0 : {
			payloads,
			sessionId: runOwnedSessionId,
			lifecycleRevision: sessionEntry?.lifecycleRevision,
			storePath
		});
		const { deliverAgentCommandResult } = await loadDeliveryRuntime();
		const deliveryParams = {
			cfg,
			deps: params.deps,
			runtime: params.runtime,
			opts: params.opts,
			outboundSession,
			sessionEntry,
			result,
			payloads,
			assertDeliveryCurrent: composeSessionSourceAssertion([assertSourceCurrent], (check) => {
				check();
				params.opts.abortSignal?.throwIfAborted();
				assertAgentRunLifecycleGenerationCurrent(lifecycleGeneration);
			}),
			onDeliveryResult: (delivered, deliveryPayloads) => {
				const deliveryStatus = delivered.deliveryStatus;
				const terminalDelivery = normalizeAgentRunTerminalDeliverySnapshot(deliveryStatus && {
					status: deliveryStatus.status,
					resultCount: deliveryStatus.resultCount ?? 0
				});
				if (terminalDelivery) terminal.metadata.terminalDelivery = terminalDelivery;
				terminalDeliveryEvidence = buildRestartRecoveryTerminalDeliveryEvidence({
					...delivered,
					payloads: deliveryPayloads
				});
				params.onTerminalDeliveryEvidenceChanged(terminalDeliveryEvidence);
			}
		};
		deliveryResult = await deliverAgentCommandResult(resolveFreshSessionEntryForDelivery ? {
			...deliveryParams,
			expectedSessionIdForFreshDelivery: runOwnedSessionId,
			resolveFreshSessionEntryForDelivery
		} : deliveryParams);
		if (sessionStore && sessionKey && !isSubagentSessionKey(sessionKey) && !params.suppressVisibleSessionEffects && !sessionReboundDuringRun && !interruptedForRestart()) {
			const entry = await resolveFreshSessionEntryForDelivery?.() ?? sessionStore[sessionKey] ?? sessionEntry;
			if (!entry) throw new Error("Cannot clear pending delivery without a session entry");
			const clearStaleTransportOnly = params.opts.deliver === true && !pendingFinalDeliveryMarker.hasSendableFinalPayload && entry.pendingFinalDelivery?.kind === "transport-only" && !entry.pendingFinalDelivery.deliveries?.length;
			const clearOwnedPendingFinal = deliveryResult?.deliverySucceeded === true && pendingFinalDeliveryMarker.pendingFinalDeliveryIntentId !== void 0;
			const clearUnclaimedRecoveryContext = clearOwnedPendingFinal && entry.restartRecoveryDeliveryRunId === void 0 && entry.restartRecoveryDeliverySourceRunId === void 0 && !entry.restartRecoveryRuns?.length;
			const recoveryClaimEntry = [
				entry,
				sessionEntry,
				params.sessionEntry
			].find((candidate) => candidate?.restartRecoveryDeliveryRunId === runId);
			const clearsRecoveryCycle = entry.restartRecoveryDeliveryRunId === runId;
			if (clearOwnedPendingFinal || clearStaleTransportOnly || recoveryClaimEntry) {
				const now = Date.now();
				sessionEntry = await persistAgentSession({
					agentId: sessionAgentId,
					sessionStore,
					sessionKey,
					storePath,
					initialEntry: entry,
					entry: {
						...clearOwnedPendingFinal || clearStaleTransportOnly ? clearPendingFinalDelivery(entry, now) : {
							...entry,
							updatedAt: now
						},
						...clearUnclaimedRecoveryContext ? { restartRecoveryDeliveryContext: void 0 } : {},
						...recoveryClaimEntry ? buildMainSessionRecoverySettlementPatch({
							entry: {
								...recoveryClaimEntry,
								restartRecoveryTerminalDeliveryEvidence: entry.restartRecoveryTerminalDeliveryEvidence,
								restartRecoveryTerminalRunIds: entry.restartRecoveryTerminalRunIds
							},
							recordTerminalSource: true,
							clearRecoveryState: clearsRecoveryCycle && entry.abortedLastRun !== true,
							terminalDeliveryEvidence,
							terminalRunId: runId
						}) : {}
					},
					assertCommitAllowed: () => {
						assertAgentRunLifecycleGenerationCurrent(lifecycleGeneration);
						if (interruptedForRestart()) throw createAgentRunRestartAbortError();
					},
					shouldPersist: (current) => !interruptedForRestart() && shouldPersistCurrentRunSessionCleanup(current, runOwnedSessionId, runId) && (!clearUnclaimedRecoveryContext || current?.restartRecoveryDeliveryRunId === void 0 && current?.restartRecoveryDeliverySourceRunId === void 0 && !current?.restartRecoveryRuns?.length) && (!recoveryClaimEntry || current?.restartRecoveryDeliveryRunId === runId || !clearsRecoveryCycle && current?.restartRecoveryDeliveryRunId === void 0) && (!clearOwnedPendingFinal || current?.pendingFinalDelivery?.intentId === pendingFinalDeliveryMarker.pendingFinalDeliveryIntentId) && (!clearStaleTransportOnly || current?.pendingFinalDelivery?.kind === "transport-only" && current.pendingFinalDelivery.intentId === entry.pendingFinalDelivery?.intentId && !current.pendingFinalDelivery.deliveries?.length)
				});
			}
		}
		hasResultError = Boolean(fallbackExhausted || lifecycle.resolveResultError(result, false));
		terminalError = hasResultError ? lifecycle.resolveTerminalError(result, fallbackExhausted, terminal) : terminal.outcome.error;
		if (hasResultError) lifecycle.emitResultError(result, fallbackExhausted, terminal);
		else lifecycle.emitEnd(terminal);
	} catch (error) {
		lifecycle.emitPostTurnError(error, terminal);
		throw error;
	} finally {
		await deferredLifecycle.complete();
	}
	const outcome = deferredLifecycle.signal.aborted ? mergeAgentRunTerminalOutcome(terminal.outcome, buildAgentRunTerminalOutcomeFromLifecycleEvent({
		phase: "end",
		abortSignal: deferredLifecycle.signal
	})) : terminal.outcome;
	return {
		maintenance: classifyAgentRunTerminalOutcome(outcome) === "success" && !hasResultError && (params.opts.deliver !== true || deliveryResult?.deliverySucceeded === true) ? maintenanceRequest : void 0,
		deliveryResult: recordAgentRunTerminalOutcome(deliveryResult, hasResultError || classifyAgentRunTerminalOutcome(outcome) !== "success" ? "failed" : "completed", terminalError ? formatErrorMessage(terminalError) : void 0),
		sessionEntry,
		runOwnedSessionId,
		sessionReboundDuringRun
	};
}
//#endregion
//#region src/agents/command/lifecycle.ts
const log$3 = createSubsystemLogger("agents/agent-command");
const formatLifecycleError = (error) => {
	const staleInstall = classifyGatewayStaleInstall(error);
	return staleInstall ? staleInstall.error.message : formatErrorMessageForDisplay(error, renderFailoverCodeUserCopy(getFailoverErrorCode(error)));
};
function resolveTerminalLogLevel(outcome) {
	if (!outcome.stopReason || outcome.stopReason === "end_turn") return;
	if (outcome.reason === "completed") return "info";
	return outcome.status === "timeout" ? "warn" : "error";
}
function createAgentCommandLifecycle(params) {
	let lifecycleFinishingEmitted = false;
	const resolveCompactionRecoveryError = (runResult) => {
		if (runResult.meta.error?.kind !== "compaction_failure" || !params.state.lifecycleError || !isContextOverflowErrorFromTables(params.state.lifecycleError)) return;
		return runResult.meta.finalAssistantVisibleText?.trim() || runResult.meta.error.message.trim() || "Auto-compaction failed. Try again or run /compact.";
	};
	const shouldReplaceLifecycleErrorObservation = (runResult) => {
		const compactionRecoveryError = resolveCompactionRecoveryError(runResult);
		return compactionRecoveryError !== void 0 && !isContextOverflowErrorFromTables(compactionRecoveryError);
	};
	const resolveResultError = (runResult, includeErrorPayload) => resolveCompactionRecoveryError(runResult) ?? params.state.lifecycleError ?? (includeErrorPayload ? runResult.payloads?.find((payload) => payload.isError === true && typeof payload.text === "string")?.text : void 0) ?? (runResult.meta.error ? runResult.meta.error.message.trim() || "Agent run failed" : void 0);
	const resolveTerminalError = (runResult, fallbackExhausted, terminal) => resolveCompactionRecoveryError(runResult) ?? params.state.lifecycleError ?? (terminal.outcome.status === "timeout" ? terminal.outcome.error : resolveResultError(runResult, fallbackExhausted)) ?? (fallbackExhausted ? "All model fallback candidates failed" : "Agent run failed");
	const emitError = (error, extraData) => {
		if (params.state.lifecycleEnded) return;
		params.state.lifecycleEnded = true;
		emitAgentEvent({
			runId: params.runId,
			lifecycleGeneration: params.lifecycleGeneration(),
			stream: "lifecycle",
			data: {
				phase: "error",
				startedAt: params.startedAt,
				endedAt: Date.now(),
				error: formatLifecycleError(error),
				...extraData,
				executionSettled: true
			}
		});
	};
	const emitTerminalPhase = (phase, terminal, error = terminal.outcome.status === "timeout" ? terminal.outcome.error : void 0, includeLifecycleErrorObservation = true) => {
		const { aborted, yielded, replayInvalid, terminalReply } = terminal.metadata;
		const terminalDelivery = normalizeAgentRunTerminalDeliverySnapshot(terminal.metadata.terminalDelivery);
		const terminalReceipt = normalizeAgentRunTerminalReceipt(terminal.metadata.terminalReceipt);
		const { stopReason, livenessState, timeoutPhase, providerStarted } = terminal.outcome;
		const abortFields = resolveAgentRunAbortLifecycleFields(params.abortSignal);
		emitAgentEvent({
			runId: params.runId,
			lifecycleGeneration: params.lifecycleGeneration(),
			stream: "lifecycle",
			data: {
				phase,
				startedAt: params.startedAt,
				endedAt: Date.now(),
				aborted: typeof aborted === "boolean" ? aborted : false,
				stopReason,
				...yielded === true ? { yielded } : {},
				...replayInvalid === true ? { replayInvalid } : {},
				...livenessState ? { livenessState } : {},
				...timeoutPhase ? { timeoutPhase } : {},
				...providerStarted !== void 0 ? { providerStarted } : {},
				...error ? { error: formatErrorMessage(error) } : {},
				...error && includeLifecycleErrorObservation && params.state.lifecycleErrorObservation ? { errorObservation: params.state.lifecycleErrorObservation } : {},
				...phase !== "finishing" ? { executionSettled: true } : {},
				...terminalDelivery ? { terminalDelivery } : {},
				...terminalReceipt ? { terminalReceipt } : {},
				...terminalReply ? { terminalReply } : {},
				...stopReason === "superseded" ? {
					aborted: true,
					stopReason
				} : abortFields
			}
		});
	};
	return {
		emitBasicError(error, extraData) {
			emitError(error, {
				...params.state.lifecycleErrorObservation ? { errorObservation: params.state.lifecycleErrorObservation } : {},
				...extraData
			});
		},
		emitFinishing(terminal) {
			if (params.state.lifecycleEnded || params.state.lifecycleFinishing || lifecycleFinishingEmitted) return;
			lifecycleFinishingEmitted = true;
			params.state.lifecycleFinishing = true;
			emitTerminalPhase("finishing", terminal);
		},
		emitEnd(terminal) {
			if (params.state.lifecycleEnded) return;
			params.state.lifecycleEnded = true;
			const stopReason = terminal.outcome.stopReason;
			const logLevel = resolveTerminalLogLevel(terminal.outcome);
			if (logLevel) log$3[logLevel](`[agent] run ${params.runId} ended with stopReason=${stopReason}`);
			emitTerminalPhase("end", terminal);
		},
		resolveResultError,
		resolveTerminalError,
		emitResultError(runResult, fallbackExhausted, terminal) {
			if (params.state.lifecycleEnded) return;
			params.state.lifecycleEnded = true;
			const error = resolveTerminalError(runResult, fallbackExhausted, terminal);
			emitTerminalPhase("error", terminal, error, !shouldReplaceLifecycleErrorObservation(runResult));
		},
		emitPostTurnError(error, terminal) {
			if (params.state.lifecycleEnded) return;
			const terminalDelivery = normalizeAgentRunTerminalDeliverySnapshot(terminal.metadata.terminalDelivery);
			emitError(error, {
				...terminalDelivery ? { terminalDelivery } : {},
				...resolveAgentRunErrorLifecycleFields(error, params.abortSignal)
			});
		}
	};
}
//#endregion
//#region src/agents/command/run-embedded-attempt.ts
const log$2 = createSubsystemLogger("agents/agent-command");
const MAX_LIVE_SWITCH_RETRIES = 5;
async function runEmbeddedAgentAttempt(params) {
	const { cfg, body, transcriptBody, sessionId, sessionKey, sessionStore, storePath, sessionAgentId, workspaceDir, cwd, agentDir, runId, pluginsEnabled, manifestMetadataSnapshot, modelManifestContext, normalizedSpawned, isNewSession, timeoutMs, runTimeoutOverrideMs } = params.prepared;
	const { runContext, skillsSnapshot, resolvedVerboseLevel } = params.embeddedSessionState;
	const { defaultProvider, defaultModel, configuredDefaultAuthProfileId, hasExplicitRunOverride, storedProviderOverride, hasStoredAutoFallbackProvenance, autoFallbackPrimaryProbe, immutableThinkLevel, sessionFile } = params.modelSelection;
	let { provider, model, providerForAuthProfileValidation, sessionEntryForAttempt, storedModelOverride, storedModelOverrideSource, effectiveTurnThinkLevel } = params.modelSelection;
	const thinkingCatalog = params.modelSelection.thinkingCatalog;
	let sessionEntry = params.sessionEntry;
	let lifecycleGeneration = params.lifecycleGeneration;
	const sessionEffectsSource = resolveInternalSessionEffectsSource({
		agentId: sessionAgentId,
		sessionId,
		sessionKey,
		storePath
	});
	const internalSessionTarget = params.suppressVisibleSessionEffects ? await prepareInternalSessionEffectsSession({
		agentId: sessionAgentId,
		cwd: cwd ?? workspaceDir,
		runId,
		source: sessionEffectsSource,
		storePath
	}) : void 0;
	params.trackInternalModelRunTarget(internalSessionTarget);
	let attemptSessionTarget = internalSessionTarget ?? sessionEffectsSource;
	const attemptSessionFile = internalSessionTarget?.sessionFile ?? sessionFile;
	const startedAt = Date.now();
	const attemptLifecycleState = {
		currentTurnUserMessagePersisted: false,
		lifecycleFinishing: false,
		lifecycleEnded: false
	};
	let executionStarted = false;
	const attemptLifecycleCallbacks = createAgentAttemptLifecycleCallbacks(attemptLifecycleState, () => {
		executionStarted = true;
		return params.preparedRunAdmission.onRuntimeTurnStarted();
	});
	const transcriptMedia = params.opts.transcriptMedia ?? [];
	const hasTranscriptMedia = transcriptMedia.length > 0;
	const suppressUserTurnPersistence = params.opts.suppressPromptPersistence === true || params.opts.transcriptMessage === "" && !hasTranscriptMedia;
	const recorderTranscriptText = transcriptBody || void 0;
	const userTurnTranscriptRecorder = (internalSessionTarget ? void 0 : params.opts.userTurnTranscriptRecorder) ?? createUserTurnTranscriptRecorder({
		...!suppressUserTurnPersistence && (recorderTranscriptText || hasTranscriptMedia) ? { input: {
			text: recorderTranscriptText,
			...hasTranscriptMedia ? { media: transcriptMedia } : {},
			senderIsOwner: params.opts.senderIsOwner,
			...params.opts.inputProvenance ? { provenance: params.opts.inputProvenance } : {}
		} } : {},
		target: {
			sessionId: internalSessionTarget?.sessionId ?? sessionId,
			agentId: internalSessionTarget?.agentId ?? sessionAgentId,
			sessionKey: internalSessionTarget?.sessionKey ?? sessionKey ?? sessionId,
			sessionEntry: internalSessionTarget?.sessionEntry ?? sessionEntry,
			sessionStore: params.suppressVisibleSessionEffects ? void 0 : sessionStore,
			storePath: internalSessionTarget?.storePath ?? storePath,
			cwd: cwd ?? workspaceDir,
			config: cfg
		},
		beforeMessageWrite: runAgentHarnessBeforeMessageWriteHook,
		errorContext: "agent command user turn transcript"
	});
	if (suppressUserTurnPersistence) userTurnTranscriptRecorder.markBlocked();
	const lifecycle = createAgentCommandLifecycle({
		runId,
		lifecycleGeneration: () => lifecycleGeneration,
		startedAt,
		abortSignal: params.opts.abortSignal,
		state: attemptLifecycleState
	});
	const attemptExecutionRuntime = await measureAgentStartup("attempt-runtime-import", () => loadAttemptExecutionRuntime(), { config: cfg });
	const messageChannel = resolveMessageChannel(runContext.messageChannel, params.opts.replyChannel ?? params.opts.channel);
	let result;
	const compactionAccounting = createCommandCompactionAccounting({
		sessionStore,
		persistCounts: !params.suppressVisibleSessionEffects && !params.preserveUserFacingSessionModelState,
		onDurableFact: (fact) => {
			attemptSessionTarget = fact.target;
			params.trackInternalModelRunTarget(fact.target);
			params.onCompactionAccounting?.(fact);
		},
		refreshSessionEntry: (key) => {
			sessionEntry = sessionStore?.[key] ?? sessionEntry;
			sessionEntryForAttempt = sessionEntry;
		}
	});
	let maintenanceAuthProfile;
	let fallbackProvider = provider;
	let fallbackModel = model;
	let fallbackExhausted = false;
	let terminal;
	let liveSwitchRetries = 0;
	let candidateAttempts = 0;
	let autoFallbackPrimaryProbeInterruptedByLiveSwitch = false;
	const fastModeStartedAtMs = Date.now();
	const assertTrajectoryCurrent = () => {
		params.opts.abortSignal?.throwIfAborted();
		params.preparedRunAdmission.assertSourceCurrent();
	};
	assertTrajectoryCurrent();
	const fallbackTrajectoryRecorder = await createTrajectoryRuntimeRecorder({
		cfg,
		runId,
		sessionId: attemptSessionTarget?.sessionId ?? sessionId,
		sessionKey: attemptSessionTarget?.sessionKey ?? sessionKey,
		sessionFile: attemptSessionFile,
		sessionTarget: attemptSessionTarget,
		assertCommitAllowed: assertTrajectoryCurrent,
		provider,
		modelId: model,
		workspaceDir
	});
	assertTrajectoryCurrent();
	const deferredLifecycle = createDeferredEmbeddedRunLifecycleManager({
		runId,
		agentId: sessionAgentId,
		sessionId,
		sessionKey,
		sessionFile: attemptSessionFile,
		abortSignal: params.opts.abortSignal
	});
	const logicalTurnOpts = {
		...params.opts,
		abortSignal: deferredLifecycle.signal
	};
	let liveSwitchMediaTaskIds = /* @__PURE__ */ new Set();
	let attemptMediaTaskIds = liveSwitchMediaTaskIds;
	const currentAttemptCommittedCronMedia = () => hasNewGeneratedMediaTaskForSessionKey(sessionKey, attemptMediaTaskIds, sessionAgentId);
	for (;;) try {
		liveSwitchMediaTaskIds = getGeneratedMediaTaskIdsForSessionKey(sessionKey, sessionAgentId);
		const spawnedBy = normalizedSpawned.spawnedBy ?? sessionEntry?.spawnedBy;
		const effectiveFallbacksOverride = isModelSelectionLocked(sessionEntry) ? [] : params.opts.modelFallbacksOverride ?? resolveEffectiveModelFallbacks({
			cfg,
			agentId: sessionAgentId,
			sessionKey,
			hasSessionModelOverride: hasExplicitRunOverride || Boolean(storedProviderOverride || storedModelOverride),
			modelOverrideSource: hasExplicitRunOverride ? "user" : storedModelOverrideSource,
			subagentSpawnLineage: (sessionEntry?.spawnDepth ?? 0) > 0,
			hasAutoFallbackProvenance: hasExplicitRunOverride ? false : hasStoredAutoFallbackProvenance
		});
		const fallbackRuntimeState = {};
		attemptLifecycleState.currentTurnUserMessagePersisted = false;
		attemptMediaTaskIds = liveSwitchMediaTaskIds;
		const fallbackResult = await runEmbeddedAgentEntry({
			preparedRunAdmission: params.preparedRunAdmission,
			modelResolve: {
				prompt: body,
				images: params.opts.images,
				cwd,
				modelSelectionLocked: isModelSelectionLocked(sessionEntry),
				context: {
					trigger: "user",
					...buildAgentHookContextChannelFields({
						...runContext,
						sessionKey,
						messageChannel,
						messageProvider: params.opts.messageProvider ?? messageChannel,
						messageTo: params.opts.replyTo ?? params.opts.to,
						agentAccountId: runContext.accountId
					}),
					...buildAgentHookContextIdentityFields({
						...runContext,
						trigger: "user"
					})
				}
			},
			selection: {
				cfg,
				provider,
				model,
				requestedRouteResolution: params.modelSelection.requestedRouteResolution,
				agentDir,
				fallbacksOverride: effectiveFallbacksOverride,
				userLockedAuthProfileId: resolveSessionAuthProfileOverrideSource(sessionEntryForAttempt) === "user" ? sessionEntryForAttempt?.authProfileOverride : void 0,
				...modelManifestContext
			},
			identity: {
				runId,
				agentId: sessionAgentId,
				sessionId,
				sessionKey: sessionKey ?? sessionId,
				sessionLifecycleRevision: sessionEntry?.lifecycleRevision ?? null
			},
			harness: {
				workspaceDir,
				sessionKey,
				preparation: { kind: "direct" },
				resolveRuntimeOverride: (candidateProvider) => resolveSessionRuntimeOverrideForProvider({
					provider: candidateProvider,
					entry: sessionEntryForAttempt,
					cfg
				})
			},
			behavior: {
				kind: "command-rpc",
				hasCommittedSideEffect: currentAttemptCommittedCronMedia
			},
			sessionOverride: {
				kind: "reconcile-completed",
				reconcile: async ({ provider: winnerProvider, model: winnerModel }) => {
					if (!autoFallbackPrimaryProbe || autoFallbackPrimaryProbeInterruptedByLiveSwitch || !sessionEntry || !sessionStore || !sessionKey || isModelSelectionLocked(sessionEntry) || params.suppressVisibleSessionEffects || params.preserveUserFacingSessionModelState || !entryMatchesAutoFallbackPrimaryProbe(sessionEntry, autoFallbackPrimaryProbe) || winnerProvider !== autoFallbackPrimaryProbe.provider || winnerModel !== autoFallbackPrimaryProbe.model) return;
					const nextSessionEntry = { ...sessionEntry };
					clearAutoFallbackPrimaryProbeSelection(nextSessionEntry);
					sessionEntry = await persistAgentSession({
						agentId: sessionAgentId,
						sessionStore,
						sessionKey,
						storePath,
						initialEntry: sessionEntry,
						entry: nextSessionEntry,
						shouldPersist: (current) => Boolean(current && entryMatchesAutoFallbackPrimaryProbe(current, autoFallbackPrimaryProbe))
					});
				}
			},
			abortSignal: deferredLifecycle.signal,
			onFallbackStep: (step) => {
				emitAgentEvent({
					runId,
					lifecycleGeneration,
					...sessionKey ? { sessionKey } : {},
					stream: "lifecycle",
					data: {
						phase: "fallback_step",
						...step
					}
				});
				fallbackTrajectoryRecorder?.recordEvent("model.fallback_step", step);
			},
			runCandidate: async (providerOverride, modelOverride, runOptions) => {
				candidateAttempts += 1;
				clearAgentRunTerminalWriteContext(params.preparedRunAdmission.operationalRunInstance);
				const candidateAccounting = compactionAccounting.beginCandidate(deferredLifecycle.signal);
				maintenanceAuthProfile = void 0;
				attemptMediaTaskIds = getGeneratedMediaTaskIdsForSessionKey(sessionKey, sessionAgentId);
				resetAgentAttemptLifecycle(attemptLifecycleState);
				const isAutoFallbackPrimaryProbeCandidate = autoFallbackPrimaryProbe && providerOverride === autoFallbackPrimaryProbe.provider && modelOverride === autoFallbackPrimaryProbe.model;
				const attemptSessionEntry = autoFallbackPrimaryProbe && providerOverride === autoFallbackPrimaryProbe.fallbackProvider && !isAutoFallbackPrimaryProbeCandidate ? sessionEntry : sessionEntryForAttempt;
				if (isAutoFallbackPrimaryProbeCandidate) markAutoFallbackPrimaryProbe({
					probe: autoFallbackPrimaryProbe,
					sessionKey
				});
				await params.opts.onActiveModelSelected?.({
					provider: providerOverride,
					model: modelOverride
				});
				const fastModeState = resolveFastModeState({
					cfg,
					provider: providerOverride,
					model: modelOverride,
					agentId: sessionAgentId,
					sessionEntry
				});
				const fastMode = params.opts.fastMode ?? fastModeState.requestMode;
				const configuredAuthProfileId = providerOverride === defaultProvider && modelOverride === defaultModel ? configuredDefaultAuthProfileId : void 0;
				const candidateRuntime = runOptions.agentHarnessRuntimeOverride ?? resolveEffectiveAgentRuntime({
					cfg,
					provider: providerOverride,
					modelId: modelOverride,
					agentId: sessionAgentId,
					sessionKey,
					sessionEntry: attemptSessionEntry
				});
				const candidateConfiguredThinkLevel = immutableThinkLevel ?? resolveConfiguredThinkingDefaultCore({
					cfg,
					agentId: sessionAgentId,
					provider: providerOverride,
					model: modelOverride
				});
				let candidateThinkingCatalog = providerOverride !== params.modelSelection.provider || modelOverride !== params.modelSelection.model ? params.modelSelection.loadDeferredThinkingCatalog?.() ?? thinkingCatalog : thinkingCatalog;
				if (pluginsEnabled && (candidateConfiguredThinkLevel !== "off" || candidateRuntime !== "openclaw")) {
					const { loadProviderScopedThinkingCatalog } = await import("./agents/model-catalog.runtime.js");
					const runtimeCatalog = normalizeThinkingCatalogProviders(await loadProviderScopedThinkingCatalog({
						config: cfg,
						provider: providerOverride,
						model: modelOverride,
						agentRuntime: candidateRuntime,
						agentId: sessionAgentId,
						workspaceDir
					}));
					if (findModelInCatalog(runtimeCatalog, providerOverride, modelOverride)) candidateThinkingCatalog = createModelVisibilityPolicy({
						cfg,
						catalog: runtimeCatalog,
						defaultProvider,
						defaultModel: {
							provider: defaultProvider,
							model: defaultModel
						},
						agentId: sessionAgentId,
						allowManifestNormalization: true,
						allowPluginNormalization: true,
						...modelManifestContext
					}).catalog;
				}
				const { requestedLevel, level: candidateThinkLevel } = resolveThinkingSelectionCore({
					cfg,
					agentId: sessionAgentId,
					provider: providerOverride,
					model: modelOverride,
					level: candidateConfiguredThinkLevel,
					catalog: candidateThinkingCatalog,
					agentRuntime: candidateRuntime
				});
				effectiveTurnThinkLevel = candidateThinkLevel;
				try {
					const candidateResult = await attemptExecutionRuntime.runAgentAttempt({
						...runOptions,
						preparedRunAdmission: params.preparedRunAdmission,
						providerOverride,
						modelOverride,
						...prepareModelRunCapabilities([candidateThinkingCatalog, params.prepared.configuredThinkingCatalog], [
							providerOverride,
							modelOverride,
							candidateRuntime
						]),
						configuredAuthProfileId,
						modelFallbacksOverride: runOptions.modelFallbacksOverride,
						originalProvider: provider,
						cfg,
						sessionEntry: attemptSessionEntry,
						sessionId: attemptSessionTarget?.sessionId ?? sessionId,
						sessionKey,
						...attemptSessionTarget ? { sessionTarget: attemptSessionTarget } : {},
						sessionAgentId,
						sessionFile: attemptSessionFile,
						workspaceDir,
						cwd,
						body,
						transcriptBody,
						preserveCliSessionBinding: isHeartbeatLifecycleRunKind(logicalTurnOpts.bootstrapContextRunKind) || params.preserveUserFacingSessionModelState,
						resolvedThinkLevel: candidateThinkLevel,
						thinkingExplicit: candidateConfiguredThinkLevel !== void 0,
						fastMode,
						fastModeStartedAtMs,
						fastModeAutoOnSeconds: fastMode === "auto" ? params.opts.fastModeAutoOnSeconds ?? fastModeState.fastAutoOnSeconds : fastModeState.fastAutoOnSeconds,
						timeoutMs,
						runTimeoutOverrideMs,
						runId,
						lifecycleGeneration,
						opts: logicalTurnOpts,
						runContext,
						spawnedBy,
						messageChannel,
						skillsSnapshot,
						resolvedVerboseLevel,
						agentDir,
						authProfileProvider: providerForAuthProfileValidation,
						sessionStore: params.suppressVisibleSessionEffects ? void 0 : sessionStore,
						storePath: params.suppressVisibleSessionEffects ? void 0 : storePath,
						pluginsEnabled,
						...manifestMetadataSnapshot ? { metadataSnapshot: manifestMetadataSnapshot } : {},
						pluginGeneration: params.prepared.commandRuntimeContext?.pluginGeneration,
						sessionHasHistory: !isNewSession || await attemptExecutionRuntime.sessionTranscriptHasContent(attemptSessionTarget, deferredLifecycle.signal),
						fallbackRuntimeState,
						suppressPromptPersistenceOnRetry: suppressUserTurnPersistence || userTurnTranscriptRecorder.hasPersisted() || userTurnTranscriptRecorder.isBlocked() || runOptions.isFallbackRetry && attemptLifecycleState.currentTurnUserMessagePersisted,
						userTurnTranscriptRecorder,
						onUserMessagePersisted: attemptLifecycleCallbacks.onUserMessagePersisted,
						onCompactionAccounting: candidateAccounting.observe,
						onCompactionRequestBudget: candidateAccounting.observeRequestBudget,
						onSuccessfulAuthProfile: (selection) => {
							maintenanceAuthProfile = selection;
						},
						onLifecycleGenerationChanged: (nextLifecycleGeneration) => {
							lifecycleGeneration = nextLifecycleGeneration;
							params.onLifecycleGenerationChanged(nextLifecycleGeneration);
						},
						onAgentEvent: attemptLifecycleCallbacks.onAgentEvent,
						deferTerminalLifecycle: true,
						deferredLifecycle
					});
					const thinking = candidateResult.meta.requestShaping?.thinking ?? candidateThinkLevel;
					const thinkingClamp = formatThinkingLevelClampNotice({
						requested: requestedLevel,
						effective: thinking,
						provider: candidateResult.meta.agentMeta?.provider ?? providerOverride,
						model: candidateResult.meta.agentMeta?.model ?? modelOverride
					});
					return thinkingClamp ? {
						...candidateResult,
						meta: {
							...candidateResult.meta,
							requestShaping: {
								...candidateResult.meta.requestShaping,
								thinking,
								thinkingClamp
							}
						}
					} : candidateResult;
				} finally {
					await candidateAccounting.finish(sessionEntry);
				}
			}
		});
		result = fallbackResult.result;
		terminal = fallbackResult.terminal;
		if (isAgentRunRestartAbortReason(params.opts.abortSignal?.reason)) throw params.opts.abortSignal?.reason;
		if (terminal.outcome.stopReason === "restart") throw createAgentRunRestartAbortError();
		fallbackProvider = fallbackResult.provider;
		fallbackModel = fallbackResult.model;
		fallbackExhausted = fallbackResult.outcome === "exhausted";
		await fallbackResult.settleSessionOverride();
		if (fallbackResult.attempts.length > 0 && result.meta.agentMeta) result = {
			...result,
			meta: {
				...result.meta,
				agentMeta: {
					...result.meta.agentMeta,
					fallbackAttempts: fallbackResult.attempts
				}
			}
		};
		if (!fallbackExhausted) lifecycle.emitFinishing(terminal);
		break;
	} catch (caught) {
		let err = caught;
		if (err instanceof PreparedModelRuntimeInitialRunAdmissionError && candidateAttempts === 1 && params.opts.deliver === true && !params.suppressVisibleSessionEffects) try {
			assertTrajectoryCurrent();
			deferredLifecycle.signal.throwIfAborted();
			attemptLifecycleState.lifecycleError = err.message;
			result = {
				payloads: [buildTerminalAgentRunFailureReplyPayload({
					replyExpectation: "required",
					visibleReplyDelivered: false
				})],
				meta: {
					durationMs: Date.now() - startedAt,
					stopReason: "error",
					providerStarted: false
				}
			};
			terminal = buildRunEntryTerminal({
				result,
				outcome: buildAgentRunTerminalOutcomeFromLifecycleEvent({
					phase: "error",
					data: {
						...result.meta,
						error: err.message
					}
				}),
				behavior: {
					kind: "command-rpc",
					hasCommittedSideEffect: currentAttemptCommittedCronMedia
				},
				runId,
				requested: {
					provider,
					model
				},
				sessionId
			});
			lifecycle.emitFinishing(terminal);
			break;
		} catch (admissionError) {
			err = admissionError;
		}
		if (err instanceof LiveSessionModelSwitchError) {
			if (isModelSelectionLocked(sessionEntry)) {
				lifecycle.emitBasicError(MODEL_SELECTION_LOCKED_MESSAGE);
				await fallbackTrajectoryRecorder?.flush();
				await deferredLifecycle.complete();
				throw new ModelSelectionLockedError();
			}
			if (hasNewGeneratedMediaTaskForSessionKey(sessionKey, liveSwitchMediaTaskIds, sessionAgentId)) {
				await deferredLifecycle.complete();
				throw err;
			}
			liveSwitchRetries += 1;
			if (liveSwitchRetries > MAX_LIVE_SWITCH_RETRIES) {
				const retryLimitMessage = `Exceeded maximum live model switch retries (${MAX_LIVE_SWITCH_RETRIES})`;
				log$2.error(`Live session model switch in subagent run ${runId}: ${retryLimitMessage}`);
				lifecycle.emitBasicError("Agent run failed");
				await fallbackTrajectoryRecorder?.flush();
				await deferredLifecycle.complete();
				throw new Error(retryLimitMessage, { cause: caught });
			}
			if (storedModelOverride || err.model !== model || err.provider !== provider) {
				storedModelOverride = err.model;
				storedModelOverrideSource = "user";
			}
			if (autoFallbackPrimaryProbe) autoFallbackPrimaryProbeInterruptedByLiveSwitch = true;
			provider = err.provider;
			model = err.model;
			providerForAuthProfileValidation = err.provider;
			if (sessionEntry) {
				sessionEntry = { ...sessionEntry };
				applyModelRuntimeDirective(sessionEntry, err.agentRuntimeOverride ? {
					kind: "set",
					runtime: err.agentRuntimeOverride
				} : { kind: "clear" });
				sessionEntry.authProfileOverride = err.authProfileId;
				sessionEntry.authProfileOverrideSource = err.authProfileId ? err.authProfileIdSource : void 0;
				sessionEntry.authProfileOverrideCompactionCount = void 0;
				sessionEntryForAttempt = sessionEntry;
			}
			attemptLifecycleState.lifecycleEnded = false;
			log$2.info(`Live session model switch in subagent run ${runId}: switching to ${sanitizeForLog(err.provider)}/${sanitizeForLog(err.model)}`);
			continue;
		}
		const errorLifecycleFields = resolveAgentRunErrorLifecycleFields(err, params.opts.abortSignal);
		lifecycle.emitBasicError(err instanceof Error ? err : /* @__PURE__ */ new Error("Agent run failed"), {
			...errorLifecycleFields,
			...!executionStarted ? {
				executionStarted: false,
				providerStarted: false
			} : {}
		});
		await fallbackTrajectoryRecorder?.flush();
		await deferredLifecycle.complete();
		throw err;
	}
	return {
		startedAt,
		result,
		fallbackProvider,
		fallbackModel,
		fallbackExhausted,
		provider,
		model,
		sessionEntry,
		lifecycleGeneration,
		effectiveTurnThinkLevel,
		maintenanceAuthProfile,
		compactionAccounting: compactionAccounting.fact,
		compactionRequestBudget: compactionAccounting.requestBudget,
		internalSessionTarget,
		attemptExecutionRuntime,
		messageChannel,
		suppressUserTurnPersistence,
		userTurnTranscriptRecorder,
		fallbackTrajectoryRecorder,
		deferredLifecycle,
		lifecycle,
		terminal
	};
}
//#endregion
//#region src/agents/command/conversation-context.ts
/** Reuse conversation guidance without borrowing the originating sender's authority. */
async function prepareCommandConversationContext(params) {
	const { cfg, opts, runContext, sessionEntry, sessionKey, sessionAgentId } = params;
	const deliveryFormat = (opts.deliver === true || opts.sourceReplyDeliveryMode === "message_tool_only") && buildDeliveryFormatPrompt({
		cfg,
		channel: opts.replyChannel ?? runContext.messageChannel,
		accountId: opts.replyAccountId ?? runContext.accountId,
		agentId: sessionAgentId,
		allowBootstrap: true
	});
	let conversationPrompt;
	if (sessionEntry && !isSubagentSessionKey(sessionKey) && !isCronSessionKey(sessionKey) && isSyntheticSourceReplyTurn(opts)) {
		const conversation = prepareReplyConversation({
			sessionEntry,
			ctx: {
				InternalTurnSource: "event",
				Provider: runContext.messageChannel,
				Surface: runContext.messageChannel,
				ChatType: sessionEntry.delivery?.kind === "internal" ? sessionEntry.chatType : void 0,
				OriginatingChannel: runContext.messageChannel,
				OriginatingTo: runContext.currentChannelId,
				AccountId: runContext.accountId,
				MessageThreadId: runContext.currentThreadTs
			}
		});
		const ctx = {
			...conversation.fields,
			CommandAuthorized: false
		};
		const shared = ctx.ChatType === "group" || ctx.ChatType === "channel";
		const sourceContext = buildSourceConversationContext({
			sessionCtx: ctx,
			sourceReplyDeliveryMode: await resolveSessionStableReplyMode({
				cfg,
				ctx,
				sessionEntry,
				sessionAgentId,
				sessionKey
			}),
			silentReplyPolicy: resolveSilentReplySettings({
				cfg,
				sessionKey,
				surface: ctx.Surface ?? ctx.Provider,
				conversationType: shared ? "group" : "direct"
			}).policy,
			silentToken: SILENT_REPLY_TOKEN
		});
		if (sourceContext) {
			const metadata = buildInboundMetaSystemPrompt(ctx, cfg, { includeFormattingHints: false });
			conversationPrompt = [
				deliveryFormat ? `${metadata}\n${deliveryFormat}` : metadata,
				sourceContext,
				shared && buildGroupIntro({
					activation: conversation.activation,
					defaultActivation: defaultGroupActivation(await resolveGroupRequireMention({
						cfg,
						group: conversation.group
					}))
				})
			].filter(Boolean).join("\n\n");
		}
	}
	return conversationPrompt || deliveryFormat ? {
		...opts,
		extraSystemPrompt: [
			conversationPrompt,
			opts.extraSystemPrompt,
			!conversationPrompt && deliveryFormat
		].filter(Boolean).join("\n\n"),
		...conversationPrompt ? { silentReplyPromptMode: "none" } : {},
		extraSystemPromptTurnContext: {
			start: conversationPrompt || !opts.extraSystemPrompt ? 0 : opts.extraSystemPrompt.length + 2,
			text: conversationPrompt || deliveryFormat || ""
		}
	} : opts;
}
//#endregion
//#region src/agents/command/run-context.ts
/** Merges explicit run context with command routing options. */
function resolveAgentRunContext(opts) {
	const merged = opts.runContext ? { ...opts.runContext } : {};
	const normalizedChannel = resolveMessageChannel(merged.messageChannel ?? opts.messageChannel, opts.replyChannel ?? opts.channel);
	if (normalizedChannel) merged.messageChannel = normalizedChannel;
	const normalizedAccountId = normalizeOptionalAccountId(merged.accountId ?? opts.accountId);
	if (normalizedAccountId) merged.accountId = normalizedAccountId;
	for (const key of [
		"groupId",
		"groupChannel",
		"groupSpace"
	]) {
		const value = (merged[key] ?? opts[key])?.toString().trim();
		if (value) merged[key] = value;
	}
	if (merged.currentThreadTs == null) {
		const threadId = stringifyRouteThreadId(opts.threadId);
		if (threadId) merged.currentThreadTs = threadId;
	}
	if (!merged.currentChannelId && opts.to) {
		const trimmedTo = opts.to.trim();
		if (trimmedTo) merged.currentChannelId = trimmedTo;
	}
	return merged;
}
//#endregion
//#region src/agents/command/session-preparation.ts
const log$1 = createSubsystemLogger("agents/agent-command");
function prepareCommandSessionRecoveryEntry(params) {
	const { entry, sessionId, runId, opts, now, isSessionRollover } = params;
	const { harnessCompletion, guardedHarnessCompletion, sourceOptions, isCompletionCurrent } = prepareCommandHarnessCompletionRecovery({
		...params,
		hasDeliveryContext: Boolean(params.deliveryContext)
	});
	const operatorSource = entry.restartRecoveryDeliveryRunId !== runId && (!sourceOptions.sourceRunId && (!opts.inputProvenance || opts.inputProvenance.kind === "external_user") || sourceOptions.sourceRunId === runId && opts.inputProvenance?.kind === "inter_session" && opts.inputProvenance.sourceTool === "subagent_settle") ? createRestartRecoveryOperatorSource({
		authority: opts.operatorAuthority,
		entry: {
			...entry,
			sessionId
		},
		agentId: params.agentId,
		sessionKey: params.sessionKey,
		sourceRunId: runId,
		inputProvenance: opts.inputProvenance
	}) : void 0;
	return {
		guardedHarnessCompletion,
		isCompletionCurrent,
		nextEntry: {
			...entry,
			sessionId,
			updatedAt: now,
			status: void 0,
			abortedLastRun: false,
			endedAt: void 0,
			lastRunError: void 0,
			restartRecoveryRuns: isMainRestartRecoveryCandidate(entry, params.sessionKey) ? normalizeMainSessionRecoveryRunFences([...entry.restartRecoveryRuns ?? [], {
				runId,
				lifecycleGeneration: params.lifecycleGeneration
			}]) : entry.restartRecoveryRuns,
			sessionStartedAt: isSessionRollover ? now : entry.sessionStartedAt,
			lastInteractionAt: isSessionRollover ? now : entry.lastInteractionAt,
			...buildCurrentRunRestartRecoveryClaim({
				deliveryContext: params.deliveryContext,
				deliveryMediaUrls: opts.internalDeliveryMediaUrls,
				disableMessageTool: opts.disableMessageTool,
				entry,
				forceRestartSafeTools: opts.forceRestartSafeTools,
				runId,
				harnessCompletion,
				...sourceOptions,
				...operatorSource ? {
					operatorSource,
					sourceRunId: runId,
					sourceIngress: sourceOptions.sourceIngress ?? operatorSource.snapshot.sourceIngress
				} : {},
				suppressTextDelivery: opts.internalDeliverySuppressText
			})
		}
	};
}
async function prepareCommandSessionDiffBaseline(params) {
	try {
		const entry = await ensureSessionDiffBaseline(params);
		if (params.sessionStore) params.sessionStore[params.sessionKey] = entry;
		return entry;
	} catch (error) {
		if (isSessionWorkStartInvalidatedError(error)) throw error;
		log$1.warn(`session diff baseline capture failed; continuing without attribution filtering: ${coerceErrorMessage(error)}`);
		return params.entry;
	}
}
async function prepareEmbeddedSessionState(params) {
	const requestedThinkLevel = params.thinkOnce ?? params.thinkOverride ?? params.persistedThinking;
	const resolvedVerboseLevel = params.verboseOverride ?? params.persistedVerbose ?? params.verboseDefault;
	const privateConversationWork = params.opts.privateCompletion === true || isSubagentCoordinationInputProvenance(params.opts.inputProvenance);
	assertAgentRunLifecycleGenerationCurrent(params.lifecycleGeneration);
	if (params.sessionKey || params.suppressVisibleSessionEffects) registerAgentRunContext(params.runId, {
		...params.sessionKey ? {
			sessionKey: params.sessionKey,
			sessionId: params.sessionId
		} : {},
		agentId: params.sessionAgentId,
		lifecycleGeneration: params.lifecycleGeneration,
		verboseLevel: resolvedVerboseLevel,
		isControlUiVisible: !params.suppressVisibleSessionEffects && !privateConversationWork,
		...privateConversationWork ? { projectSessionMessages: false } : {},
		projectSessionActive: !params.suppressVisibleSessionEffects && !privateConversationWork
	});
	let sessionEntry = params.sessionEntry;
	const skillFilter = resolveEffectiveAgentSkillFilter(params.cfg, params.sessionAgentId);
	const currentSkillsSnapshot = sessionEntry?.skillsSnapshot;
	const [{ getRemoteSkillEligibility, resolveReusableWorkspaceSkillSnapshot }, { resolveNodeExecEligibilityAsync }] = await Promise.all([loadSkillsRuntime(), loadExecDefaultsRuntime()]);
	const nodeSkillsEligibility = await resolveNodeExecEligibilityAsync({
		cfg: params.cfg,
		sessionEntry: sessionEntry ?? null,
		sessionKey: params.sessionKey,
		agentId: params.sessionAgentId
	});
	const skillSnapshotState = await resolveReusableWorkspaceSkillSnapshot({
		workspaceDir: resolveAgentWorkspaceDir(params.cfg, params.sessionAgentId),
		...resolveSessionSkillExecutionWorkspace(sessionEntry?.worktree?.canonicalWorkspaceDir, params.executionWorkspaceDir),
		config: params.cfg,
		agentId: params.sessionAgentId,
		existingSnapshot: params.isNewSession ? void 0 : currentSkillsSnapshot,
		librarySelections: sessionEntry?.skillLibrarySelections,
		skillFilter,
		assertCurrent: () => assertAgentRunLifecycleGenerationCurrent(params.lifecycleGeneration),
		resolveEligibility: () => ({
			nodeSkills: nodeSkillsEligibility,
			remote: getRemoteSkillEligibility({ advertiseExecNode: nodeSkillsEligibility.canExec })
		}),
		watch: params.watchSkills && params.opts.oneShotCliRun !== true,
		...params.pluginMetadataSnapshot ? { pluginMetadataSnapshot: params.pluginMetadataSnapshot } : {}
	});
	const needsSkillsSnapshot = params.isNewSession || !currentSkillsSnapshot || skillSnapshotState.shouldRefresh;
	const skillsSnapshot = skillSnapshotState.snapshot;
	const { sessionStore, sessionKey } = params;
	if (sessionStore && sessionKey && !params.suppressVisibleSessionEffects) {
		const persistUpdate = (initialEntry, update) => {
			const now = Date.now();
			const entry = initialEntry ?? {
				sessionId: params.sessionId,
				updatedAt: now,
				sessionStartedAt: now
			};
			const next = {
				...entry,
				sessionId: params.sessionId,
				updatedAt: now,
				sessionStartedAt: entry.sessionStartedAt ?? now
			};
			update(next, now);
			return persistAgentSession({
				agentId: params.sessionAgentId,
				sessionStore,
				sessionKey,
				storePath: params.storePath,
				initialEntry: entry,
				entry: next
			});
		};
		if (skillsSnapshot && needsSkillsSnapshot) sessionEntry = await persistUpdate(sessionEntry, (next) => {
			next.skillsSnapshot = skillsSnapshot;
		});
		if (params.opts.skipInitialSessionTouch !== true || Boolean(params.verboseOverride)) sessionEntry = await persistUpdate(sessionStore[sessionKey] ?? sessionEntry, (next, now) => {
			next.lastInteractionAt = now;
			next.agentStatus = void 0;
			applyVerboseOverride(next, params.verboseOverride);
		});
	}
	if (params.sessionKey && !params.isSubagentLaneTurn) {
		const assertSignalCurrent = () => {
			assertAgentRunLifecycleGenerationCurrent(params.lifecycleGeneration);
			params.opts.abortSignal?.throwIfAborted();
			params.opts.assertSourceCurrent?.();
			params.opts.operatorAuthority?.assertCurrent();
		};
		await recordSessionHumanDirectMessage({
			sessionKey: params.sessionKey,
			entry: sessionEntry,
			agentId: params.sessionAgentId,
			actor: params.sessionStateActor,
			channel: params.opts.channel,
			runId: params.runId
		}, { assertCurrent: assertSignalCurrent });
		assertSignalCurrent();
	}
	const runContext = resolveAgentRunContext(params.opts);
	return {
		sessionEntry,
		requestedThinkLevel,
		resolvedVerboseLevel,
		skillsSnapshot,
		runContext,
		opts: await prepareCommandConversationContext({
			...params,
			sessionEntry,
			runContext
		})
	};
}
//#endregion
//#region src/agents/agent-command.ts
const log = createSubsystemLogger("agents/agent-command");
async function agentCommandInternal(prepared, admissionIngress, runtime = defaultRuntime, deps, watchSkills = false) {
	try {
		var _usingCtx$1 = _usingCtx();
		const sessionSource = prepared.sessionKey ? captureSessionActorStorageOwner({
			agentId: prepared.sessionAgentId,
			storePath: prepared.storePath,
			sessionKey: prepared.sessionKey
		}, {
			assertCurrent() {
				prepared.opts.assertSourceCurrent?.();
			},
			authorize() {}
		}) : void 0;
		const resolvedDeps = await resolveAgentCommandDeps(deps);
		const isRawModelRun = prepared.opts.modelRun === true || prepared.opts.promptMode === "none";
		const suppressVisibleSessionEffects = prepared.opts.sessionEffects === "internal";
		const preserveUserFacingSessionModelState = prepared.opts.preserveUserFacingSessionModelState === true;
		const lifecycleAbortController = new AbortController();
		const preparedOpts = resolveCommandRecoveryOptions(prepared);
		const parentAbortSignal = preparedOpts.abortSignal;
		if (parentAbortSignal?.aborted) lifecycleAbortController.abort(parentAbortSignal.reason);
		_usingCtx$1.u(parentAbortSignal && !parentAbortSignal.aborted ? addAbortListener(parentAbortSignal, () => {
			lifecycleAbortController.abort(parentAbortSignal.reason);
		}) : void 0);
		const compactionSessionIdReporter = createCompactionSessionIdReporter(prepared.sessionId, preparedOpts.onSessionIdChanged);
		let opts = {
			...preparedOpts,
			onSessionIdChanged: compactionSessionIdReporter.onSessionIdChanged,
			abortSignal: lifecycleAbortController.signal
		};
		const preparedContext = { ...prepared };
		const { cfg, agentCfg, sessionId, sessionKey, sessionStore, storePath, isNewSession, automaticReset, sessionAgentId, workspaceDir, cwd, runId, isSubagentLane, acpResolution, manifestMetadataSnapshot } = preparedContext;
		const isIncognito = prepared.sessionEntry?.incognito === true || isIncognitoSessionKey(sessionKey);
		const diagnosticError = (error) => formatErrorMessage(isIncognito ? "Incognito agent error." : error);
		let lifecycleGeneration = opts.lifecycleGeneration ?? captureAgentRunLifecycleGeneration(runId);
		let sessionEntry = prepared.sessionEntry, runOwnedSessionId = sessionId;
		const sessionStateActor = classifySessionStateActor({
			inputProvenance: opts.inputProvenance,
			internalEvents: opts.internalEvents,
			sessionEffects: opts.sessionEffects
		});
		let sessionReboundDuringRun = false;
		let trackedRestartRecoveryDeliveryClaim = false;
		let currentRunDeliveryContext;
		let restartRecoveryTerminalDeliveryEvidence;
		const preparedSessionId = sessionEntry?.sessionId;
		const { track: trackInternalModelRunTarget, cleanup: cleanupInternalModelRunTargets } = createInternalSessionEffectsCleanup({
			enabled: prepared.opts.modelRun === true && suppressVisibleSessionEffects,
			agentId: sessionAgentId,
			runId,
			storePath,
			onError: (error) => {
				log.warn(`failed to remove model-run SQLite session: ${diagnosticError(error)}`);
			}
		});
		let sessionWorkAdmission;
		let releaseForeground;
		let maintenanceRequest;
		let preparedRunAdmission;
		let commandError;
		try {
			const operatorSession = opts.operatorAuthority && sessionKey ? (await import("./operator-session-run-Cx2Ajtv-.mjs")).prepareGatewayOperatorSessionRun({
				authority: opts.operatorAuthority,
				cfg,
				agentId: sessionAgentId,
				sessionKey,
				currentSource: () => opts
			}) : void 0;
			if (sessionStateActor.actorType === "human" && !isSubagentLane && !opts.internalEvents?.length && opts.bootstrapContextRunKind !== "heartbeat" && opts.bootstrapContextRunKind !== "cron") releaseForeground = await beginForegroundSessionMaintenance(sessionKey ?? sessionId);
			assertAgentRunLifecycleGenerationCurrent(lifecycleGeneration);
			const sessionStoreRuntime = storePath && sessionKey ? await loadSessionStoreRuntime() : void 0;
			sessionWorkAdmission = await beginSessionWorkAdmission({
				agentId: sessionAgentId,
				scope: storePath ?? `agent:${sessionAgentId}`,
				isSettling: opts.isTerminalOutcomeObserved,
				identities: [sessionKey, sessionId],
				run: {
					runId,
					sessionKey,
					sessionId,
					agentId: sessionAgentId,
					controlUiVisible: !suppressVisibleSessionEffects && !isSubagentCoordinationInputProvenance(opts.inputProvenance)
				},
				signal: opts.abortSignal,
				onInterrupt: (reason) => {
					if (opts.abortSignal?.aborted) return;
					lifecycleAbortController.abort(reason);
					return { runId };
				},
				assertAllowed: async () => {
					const scope = {
						agentId: sessionAgentId,
						storePath,
						sessionKey: sessionKey ?? ""
					};
					const currentEntry = sessionStoreRuntime && storePath && sessionKey ? sessionSource ? readCapturedSessionActorEntry(sessionSource, normalizeStoreSessionKey(sessionKey)) : await sessionStoreRuntime.readSessionEntryInWorker({
						...scope,
						readConsistency: "latest"
					}) : sessionEntry;
					if (!currentEntry && preparedSessionId) throw createSessionWorkStartChangedError(sessionKey ?? sessionId);
					const matchesIntentionalRollover = isNewSession && currentEntry?.sessionId === preparedSessionId;
					if (currentEntry && currentEntry.sessionId !== sessionId && !matchesIntentionalRollover) throw createSessionWorkStartChangedError(sessionKey ?? sessionId);
					const workStartError = resolveSessionWorkStartBlock(sessionKey ?? sessionId, currentEntry);
					if (workStartError) throw workStartError;
					operatorSession?.assertAuthorized(currentEntry);
					sessionEntry = currentEntry;
					if (sessionStore && sessionKey) {
						if (currentEntry) sessionStore[sessionKey] = currentEntry;
						else delete sessionStore[sessionKey];
					}
				}
			});
			return await sessionWorkAdmission.run(async () => {
				if (sessionStore && sessionKey && !suppressVisibleSessionEffects) try {
					await repairPendingAssistantTranscriptTurns({ context: {
						sessionKey,
						sessionEntry,
						sessionStore,
						storePath,
						sessionAgentId,
						config: cfg
					} });
					sessionEntry = sessionStore[sessionKey] ?? sessionEntry;
				} catch (error) {
					if (!isNewSession) throw error;
					log.warn(`Could not repair predecessor transcript before session reset for ${sessionKey}: ${diagnosticError(error)}`);
				}
				if (opts.deliver === true) {
					if (resolveSendPolicy({
						cfg,
						entry: sessionEntry,
						sessionKey,
						channel: sessionDeliveryChannel(sessionEntry),
						chatType: sessionEntry?.chatType
					}) === "deny") throw new Error("send blocked by session policy");
				}
				if (!isRawModelRun && acpResolution?.kind === "stale") throw acpResolution.error;
				let currentRunDeliveryPrepared = false;
				const prepareDeliveryForRun = async (candidateSessionEntry) => {
					if (currentRunDeliveryPrepared || opts.deliver !== true) return;
					currentRunDeliveryPrepared = true;
					let preparedDelivery;
					try {
						preparedDelivery = await prepareCurrentRunDelivery({
							cfg,
							opts,
							agentId: sessionAgentId,
							currentSessionKey: sessionKey,
							sessionEntry: candidateSessionEntry
						});
					} catch (error) {
						if (opts.bestEffortDeliver !== true) throw error;
						log.warn(`delivery preflight failed; continuing model run with requested delivery intent because bestEffortDeliver is enabled: ${diagnosticError(error)}`);
					}
					assertAgentRunLifecycleGenerationCurrent(lifecycleGeneration);
					if (preparedDelivery) {
						currentRunDeliveryContext = preparedDelivery.context;
						opts = {
							...opts,
							replyChannel: preparedDelivery.context.channel,
							replyTo: preparedDelivery.context.to,
							replyAccountId: preparedDelivery.context.accountId,
							threadId: preparedDelivery.context.threadId,
							deliveryTargetMode: preparedDelivery.targetMode
						};
					}
				};
				if (sessionStore && sessionKey && !suppressVisibleSessionEffects && !isSubagentSessionKey(sessionKey)) {
					const now = Date.now();
					const currentStoreEntry = sessionStore[sessionKey];
					const allowCreate = currentStoreEntry === void 0 && sessionEntry === void 0;
					const initialEntry = currentStoreEntry ?? sessionEntry ?? {
						sessionId,
						updatedAt: now,
						sessionStartedAt: now
					};
					const isSessionRollover = isNewSession && (initialEntry.sessionId !== sessionId || automaticReset !== void 0);
					const entry = isSessionRollover ? clearRotatedSessionMetadata(initialEntry) : initialEntry;
					if (automaticReset) {
						entry.lifecycleRevision = randomUUID();
						entry.agentHarnessId = void 0;
					}
					await prepareDeliveryForRun(entry);
					const { nextEntry, guardedHarnessCompletion, isCompletionCurrent } = prepareCommandSessionRecoveryEntry({
						entry,
						sessionId,
						sessionKey,
						runId,
						agentId: sessionAgentId,
						lifecycleGeneration,
						opts,
						deliveryContext: currentRunDeliveryContext,
						now,
						isSessionRollover
					});
					assertAgentRunLifecycleGenerationCurrent(lifecycleGeneration);
					const persisted = await persistAgentSession({
						agentId: sessionAgentId,
						sessionStore,
						sessionKey,
						storePath,
						initialEntry,
						entry: nextEntry,
						resetBoundary: automaticReset && {
							context: "preserve-tail",
							reason: automaticReset.reason,
							cwd: cwd ?? workspaceDir
						},
						creation: operatorSession?.creation,
						assertCommitAllowed: operatorSession?.assertCurrent,
						shouldPersist: (current) => {
							operatorSession?.assertAuthorized(current);
							return (!automaticReset || current?.lifecycleRevision === automaticReset.expectedLifecycleRevision) && isCompletionCurrent(current) && (isSessionRollover ? current?.sessionId === initialEntry.sessionId : shouldPersistRestartRecoveryContextClaim(current, sessionId, runId, allowCreate));
						}
					});
					sessionEntry = persisted;
					trackedRestartRecoveryDeliveryClaim = persisted?.restartRecoveryDeliveryRunId === runId;
					opts = bindCommandHarnessCompletionAssertion({
						claim: guardedHarnessCompletion,
						persisted,
						sessionKey,
						storePath,
						opts
					}).opts;
					if (operatorSession && (!persisted || persisted.sessionId !== sessionId)) throw createSessionWorkStartChangedError(sessionKey);
					operatorSession?.assertAuthorized(persisted);
				}
				if (sessionEntry && sessionKey && !suppressVisibleSessionEffects) sessionEntry = await prepareCommandSessionDiffBaseline({
					agentId: sessionAgentId,
					cwd: cwd ?? workspaceDir,
					entry: sessionEntry,
					isNewSession,
					sessionKey,
					storePath,
					sessionStore
				});
				await prepareDeliveryForRun(sessionEntry);
				if (!isRawModelRun && acpResolution?.kind === "ready" && sessionKey) {
					assertAgentRunLifecycleGenerationCurrent(lifecycleGeneration);
					preparedRunAdmission = prepareAgentCommandExecutionIdentity({
						opts,
						prepared,
						ingress: admissionIngress,
						lifecycleGeneration
					});
					return await runAcpAgentCommand({
						...preparedContext,
						deps: resolvedDeps,
						runtime,
						opts,
						sessionEntry,
						suppressVisibleSessionEffects,
						provenance: isSubagentLane ? "agent" : sessionStateActor.actorType,
						sessionKey,
						lifecycleGeneration,
						acpResolution,
						trackInternalModelRunTarget,
						preparedRunAdmission
					});
				}
				const embeddedSessionState = await measureAgentStartup("session-state", () => prepareEmbeddedSessionState({
					...preparedContext,
					opts,
					sessionEntry,
					lifecycleGeneration,
					executionWorkspaceDir: cwd ?? workspaceDir,
					watchSkills,
					isSubagentLaneTurn: isSubagentLane,
					suppressVisibleSessionEffects,
					verboseDefault: agentCfg?.verboseDefault,
					sessionStateActor,
					...manifestMetadataSnapshot ? { pluginMetadataSnapshot: manifestMetadataSnapshot } : {}
				}), { config: cfg });
				({sessionEntry, opts} = embeddedSessionState);
				const { requestedThinkLevel, runContext } = embeddedSessionState;
				const modelSelection = await measureAgentStartup("model-selection", () => resolveEmbeddedModelSelection({
					...preparedContext,
					opts,
					sessionEntry,
					requestedThinkLevel,
					suppressVisibleSessionEffects,
					runContext
				}), { config: cfg });
				sessionEntry = modelSelection.sessionEntry;
				const { prepared: attemptPrepared, admission } = await prepareCommandForegroundRun({
					prepared,
					opts,
					sessionEntry,
					embeddedSessionState,
					modelSelection,
					lifecycleGeneration,
					ingress: admissionIngress,
					suppressVisibleSessionEffects,
					onCommittedSessionId: (committedSessionId) => {
						runOwnedSessionId = committedSessionId;
						compactionSessionIdReporter.onCompactionCommitted(committedSessionId);
					}
				});
				preparedRunAdmission = admission;
				sessionEntry = attemptPrepared.sessionEntry;
				if (attemptPrepared.sessionId !== runOwnedSessionId) {
					runOwnedSessionId = attemptPrepared.sessionId;
					compactionSessionIdReporter.onCompactionCommitted(runOwnedSessionId);
				}
				const embeddedAttempt = await runEmbeddedAgentAttempt({
					prepared: attemptPrepared,
					opts,
					sessionEntry,
					lifecycleGeneration,
					onLifecycleGenerationChanged: (nextLifecycleGeneration) => {
						lifecycleGeneration = nextLifecycleGeneration;
					},
					onCompactionAccounting: (fact) => {
						if (fact.kind === "durable") {
							runOwnedSessionId = fact.target.sessionId;
							if (fact.previousSessionId !== void 0) compactionSessionIdReporter.onCompactionCommitted(fact.target.sessionId);
						}
					},
					suppressVisibleSessionEffects,
					preserveUserFacingSessionModelState,
					modelSelection,
					embeddedSessionState,
					trackInternalModelRunTarget,
					preparedRunAdmission
				});
				if (embeddedAttempt.fallbackExhausted) opts.onModelFallbackExhausted?.();
				sessionEntry = embeddedAttempt.sessionEntry;
				lifecycleGeneration = embeddedAttempt.lifecycleGeneration;
				const finalized = await finalizeEmbeddedAgentCommand({
					admittedRecoverySource: preparedRunAdmission.pendingFinalRecoverySource,
					prepared: attemptPrepared,
					opts,
					deps: resolvedDeps,
					runtime,
					sessionEntry,
					attempt: embeddedAttempt,
					embeddedSessionState,
					suppressVisibleSessionEffects,
					preserveUserFacingSessionModelState,
					currentRunDeliveryContext,
					sessionOwnership: {
						runOwnedSessionId,
						sessionReboundDuringRun
					},
					trackInternalModelRunTarget,
					onSessionOwnershipChanged: (ownership, committedCompactionSessionId) => {
						runOwnedSessionId = ownership.runOwnedSessionId;
						sessionReboundDuringRun = ownership.sessionReboundDuringRun;
						compactionSessionIdReporter.onCompactionCommitted(committedCompactionSessionId);
					},
					onTerminalDeliveryEvidenceChanged: (evidence) => {
						restartRecoveryTerminalDeliveryEvidence = evidence;
					}
				});
				sessionEntry = finalized.sessionEntry;
				runOwnedSessionId = finalized.runOwnedSessionId;
				sessionReboundDuringRun = finalized.sessionReboundDuringRun;
				maintenanceRequest = finalized.maintenance;
				return finalized.deliveryResult;
			});
		} catch (error) {
			commandError = error;
			throw error;
		} finally {
			await finishAgentCommandCleanup({
				prepared,
				sessionEntry,
				runOwnedSessionId,
				sessionReboundDuringRun,
				trackedRestartRecoveryDeliveryClaim,
				terminalDeliveryEvidence: restartRecoveryTerminalDeliveryEvidence,
				terminalEvent: { data: {
					phase: commandError === void 0 ? "end" : "error",
					error: commandError
				} },
				abortSignal: opts.abortSignal,
				lifecycleGeneration,
				beforeTerminalDelivery: opts.beforeTerminalDelivery,
				reportCommitted: compactionSessionIdReporter.reportCommitted,
				preparedRunAdmission,
				sessionWorkAdmission,
				cleanupInternalModelRunTargets,
				releaseForeground
			});
			if (maintenanceRequest) scheduleSessionMaintenance(maintenanceRequest);
		}
	} catch (_) {
		_usingCtx$1.e = _;
	} finally {
		_usingCtx$1.d();
	}
}
async function agentCommandWithAdmissionIngress(opts, admissionIngress, runtime = defaultRuntime, deps) {
	return await runLocalAgentCommand({
		opts,
		runtime,
		deps,
		operatorAuthority: admissionIngress.kind === "local-cli",
		run: async (prepared, resolvedDeps) => await agentCommandInternal(prepared, admissionIngress, runtime, resolvedDeps)
	});
}
async function agentCommand(opts, runtime = defaultRuntime, deps) {
	const { localIngress } = executionIdentity;
	return await agentCommandWithAdmissionIngress(opts, localIngress, runtime, deps);
}
async function agentCommandFromSystem(opts, admission, runtime = defaultRuntime, deps) {
	return await agentCommandWithAdmissionIngress(opts, executionIdentity.systemIngress(admission.boundary), runtime, deps);
}
async function agentCommandFromIngressInternal(opts, runtime = defaultRuntime, deps, recovery, runtimeContext) {
	if (typeof opts.allowModelOverride !== "boolean") throw new Error("allowModelOverride must be explicitly set for ingress agent runs.");
	const ingressRuntime = withoutRuntimeOutput(runtime);
	const lifecycleGeneration = opts.lifecycleGeneration ?? captureAgentRunLifecycleGeneration(opts.runId ?? "");
	const generation = runtimeContext?.pluginGeneration;
	const executeIngress = () => withAgentRunLifecycleGeneration(lifecycleGeneration, async () => {
		let preparedAgentDir;
		const result = await runWithAgentCommandRecoveryOwner({
			lifecycleGeneration,
			mode: "claim",
			opts: {
				...opts,
				lifecycleGeneration,
				senderIsOwner: opts.senderIsOwner === true
			},
			prepare: async (preparedOpts) => await prepareAgentCommandExecution(preparedOpts, ingressRuntime, runtimeContext),
			restoreAdmittedRecovery: recovery?.restoreAdmittedRecovery,
			run: async (prepared) => {
				preparedAgentDir = prepared.agentDir;
				const run = async () => await agentCommandInternal(prepared, {
					kind: "api",
					boundary: "agent-command.from-ingress",
					state: "unknown"
				}, ingressRuntime, deps, true);
				return generation ? await run() : await withAgentPluginRegistry({
					config: prepared.cfg,
					workspaceDir: prepared.workspaceDir,
					run
				});
			}
		});
		if (result && preparedAgentDir) emitIngressModelUsageDiagnostic(result, opts, preparedAgentDir);
		return result;
	});
	return generation && runtimeContext ? await withPluginRuntimeGenerationScope({
		metadataSnapshot: generation.pluginMetadataSnapshot,
		pluginRegistry: generation.pluginRegistry
	}, executeIngress) : await executeIngress();
}
/** Runs an agent turn from an inbound channel/gateway ingress context. */
async function agentCommandFromIngress(opts, runtime = defaultRuntime, deps) {
	return await agentCommandFromIngressInternal(sanitizePublicAgentCommandIngressOpts(opts), runtime, deps);
}
/** Internal Gateway entrypoint that restores a rejected restart-recovery admission. */
async function agentCommandFromGatewayIngress(opts, runtime, deps, recovery, runtimeContext) {
	return await agentCommandFromIngressInternal(opts, runtime, deps, recovery, runtimeContext);
}
//#endregion
export { agentCommandFromSystem as i, agentCommandFromGatewayIngress as n, agentCommandFromIngress as r, agentCommand as t };
