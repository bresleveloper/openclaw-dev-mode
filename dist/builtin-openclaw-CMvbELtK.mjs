import { c as normalizeOptionalLowercaseString, l as normalizeOptionalString, n as localeLowercasePreservingWhitespace, o as normalizeLowercaseStringOrEmpty, t as hasNonEmptyString } from "./string-coerce-1VuiLaaR.mjs";
import { D as resolveExpiresAtMsFromDurationMs, F as resolveTimerTimeoutMs, g as isFutureDateTimestampMs, h as finiteSecondsToTimerSafeMilliseconds, m as clampTimerTimeoutMs, o as asDateTimestampMs, u as asPositiveFiniteNumber, y as parseDateStringTimestampMs } from "./number-coercion-CkhMiRw8.mjs";
import { c as readErrorCauses, d as toErrorObject, r as collectErrorGraphCandidates } from "./error-coercion-BwMr25F8.mjs";
import { a as resolveGlobalSingleton } from "./global-singleton-DrXvEBww.mjs";
import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { n as captureAsyncWorkTracker, r as getAsyncWorkSignal } from "./async-work-scope-BH2yUdBz.mjs";
import { o as resolveUserPath } from "./home-dir-CtsdYvX3.mjs";
import { n as parseBooleanValue } from "./boolean-CFfzB3ix.mjs";
import { s as isFastTestRuntimeEnv } from "./env-DbG527wb.mjs";
import { i as extractBalancedJsonPrefix } from "./src-Djeo9OvP.mjs";
import { n as estimateStringChars } from "./cjk-chars-D02XG87t.mjs";
import { t as expectDefined } from "./expect-lbe3Hgrh.mjs";
import { a as asOptionalRecord, c as isRecord, i as asOptionalObjectRecord, u as readStringField } from "./record-coerce-TIsquoVR.mjs";
import { n as safeParseJsonRecord, t as safeParseJson } from "./json-coercion-pfKbZnCJ.mjs";
import { t as stableStringify } from "./stable-stringify-Djn3uxNo.mjs";
import { _ as normalizeUniqueTrimmedStringList, d as normalizeStringEntries, p as normalizeTrimmedStringList, y as uniqueStrings } from "./string-normalization-D6DKCpwE.mjs";
import { n as sliceUtf16Safe, r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { a as openRootFile } from "./boundary-file-read-CCth2Hwg.mjs";
import "./utils-gjJ-tD2q.mjs";
import { d as sleepWithAbort$1, i as createAbortError$1, s as raceWithTimeout } from "./src-Bzfi3cQM.mjs";
import { t as isAbortError } from "./abort-signal-C9DFO3n5.mjs";
import { t as sleep } from "./sleep-BJ5slSa3.mjs";
import { r as resolveStateDir } from "./state-dir-C8s3cOPX.mjs";
import "./paths-orClZ-2Z.mjs";
import { r as isSecretValueRegisteredForRedaction } from "./secret-redaction-registry-C0-kg1Rg.mjs";
import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { t as notifyListeners } from "./listeners-BogSNJ-R.mjs";
import { O as freezeDiagnosticTraceContext, s as emitTrustedDiagnosticEvent, t as areDiagnosticsEnabledForProcess } from "./diagnostic-events-C91J-XX8.mjs";
import { t as createSubsystemLogger } from "./subsystem-mStysHHC.mjs";
import { r as normalizeProviderId } from "./provider-id-D1VImdKk.mjs";
import { n as resolveCommitHash } from "./git-commit-CtMnYvhe.mjs";
import { t as VERSION } from "./version-jg_14gWz.mjs";
import { f as readDatabasePathIdentitySync } from "./sqlite-worker-identity-DLqVBf5J.mjs";
import { n as sha256Hex } from "./node-crypto-BG4u3UnX.mjs";
import { n as resolveRuntimeProcessEntrypointUrl } from "./runtime-process-url-BCfqgqXF.mjs";
import { c as resolveOpenClawAgentSqlitePath } from "./openclaw-agent-db.paths-BGqL4GOe.mjs";
import { n as appendRegularFile } from "./fs-safe-6Z4UiMS4.mjs";
import { t as SessionTranscriptWriterClaimReboundError } from "./session-transcript-writer-claim-error-eP-_sDN9.mjs";
import { t as WorkerTaskPool } from "./worker-task-pool-D6ogd941.mjs";
import { t as _usingCtx } from "./usingCtx-BhiZp_rS.mjs";
import { g as readRuntimeConfig, o as getRuntimeConfigSnapshot } from "./runtime-snapshot-BBYDJbw9.mjs";
import { r as isCloudModelRef } from "./model-catalog-refs-D3xvQZh0.mjs";
import { i as classifyAgentRunTerminalOutcome, n as AGENT_RUN_RESTART_ABORT_STOP_REASON } from "./agent-run-terminal-outcome-CrMEEYuY.mjs";
import { j as validateAgentRunDelegatedAuthority } from "./agent-run-registry-gmaPgO-n.mjs";
import { r as captureAgentRunLifecycleGeneration } from "./agent-events-Bf3Js0D3.mjs";
import { f as sessionEntryCommitGuardOptions, o as composeSessionSourceAssertion } from "./session-source-authority-fdILH-PW.mjs";
import { i as isIncognitoSessionKey } from "./incognito-session-key-BWpn88lo.mjs";
import { M as parseAgentSessionKey, _ as toAgentStoreSessionKey, d as resolveLinkedDirectPeerId, w as isSubagentSessionKey, x as isCronRunSessionKey } from "./session-key-CSDERtm3.mjs";
import { n as normalizeAccountId } from "./account-id-ifCOO7_9.mjs";
import { n as getPluginInstance } from "./plugin-instance-scope-BoTOTPL4.mjs";
import { l as getActivePluginRegistry, m as listImportedRuntimePluginIds, v as requireActivePluginRegistry } from "./runtime-DkPagH0y.mjs";
import { t as settlesWithin } from "./settle-within-DLEx44ea.mjs";
import { a as resolveAgentDir, i as resolveAgentContextLimits } from "./agent-scope-config-fjA2T9Gz.mjs";
import { o as loadPluginMetadataSnapshot } from "./plugin-metadata-snapshot-DET-4y9k.mjs";
import { c as resolveSessionStorePathCore } from "./paths-YgcBNLgG.mjs";
import { t as normalizeChatType } from "./chat-type-qwvaeaJu.mjs";
import { f as hasRuntimeContextMarker } from "./types-BXd0kI8-.mjs";
import { c as extractToolResultIds, o as extractToolCallsFromAssistant, r as classifyToolUseResultPairing, s as extractToolResultId } from "./tool-result-pairing-B20tITEh.mjs";
import { r as emitSessionTranscriptUpdate } from "./transcript-events-D3brcRJS.mjs";
import "./backoff-N5Hi0doU.mjs";
import { t as retryAsync } from "./retry-DwDRpCWu.mjs";
import "./defaults-Bg930vxE.mjs";
import { r as resolvePersistedSessionStoreOwnerForTarget } from "./session-store-owner-iJNKNMuJ.mjs";
import { h as resolveSessionAgentId } from "./agent-scope-DXrnO3F4.mjs";
import { a as formatToolExecutionGatedMessage, c as normalizeToolPolicyName, n as couldNormalizeToolNamePrefixToAllowedTool, o as isToolExecutionAllowed, r as createToolExecutionMatcher } from "./tool-policy-shared-PsZCKeeN.mjs";
import { n as createRuntimeToolMatcher, r as createToolPolicyMatcher, s as isToolAllowedByPolicyName } from "./tool-policy-match--5jlhAPZ.mjs";
import { d as toolPolicyRestrictsTools, u as replaceWithEffectiveToolAllowlist } from "./tool-policy-14GRhbFd.mjs";
import { a as projectModelThinkingCompat } from "./model-catalog-lookup-BJKolYfz.mjs";
import { t as redactConfigObject } from "./redact-snapshot-D_TnZpW0.mjs";
import { d as sanitizeSupportSnapshotValue, r as redactPathForSupport } from "./diagnostic-support-redaction-BP5XqJ7g.mjs";
import "./io-DIF-KW3P.mjs";
import { i as sameSessionTranscriptTargetBinding } from "./transcript-target-binding-uO0pz59U.mjs";
import { r as extractAssistantTranscriptSourceText } from "./chat-message-content-C-d0FKNG.mjs";
import { _ as resolveAdmittedRunActiveAssertion, g as readRunOperatorAuthority, n as assertOperatorModelAllowed, r as bindOperatorModelExecution } from "./admitted-run-context-h1ULFETN.mjs";
import { t as AgentRunTerminalOutcomeError } from "./agent-run-terminal-error-HtG1NUd1.mjs";
import { r as TERMINATED_TRANSPORT_MESSAGE_RE, t as INCOMPLETE_ASSISTANT_STREAM_RE } from "./message-patterns-DSkmGYcR.mjs";
import { c as isTimeoutError, s as isSignalTimeoutReason } from "./error-Bcp4ZyOv.mjs";
import { a as createAgentRunDirectAbortError, o as createAgentRunRestartAbortError, s as createAgentRunSupersededAbortError, u as isAgentRunRestartAbortReason } from "./run-termination-Dwf1ksjA.mjs";
import { n as readProviderRefusalReview, t as isProviderRefusalAssistantError } from "./diagnostics-CAGhEztD.mjs";
import { f as readProviderReviewAcknowledgment, o as acceptProviderReviewAcknowledgment, s as assertSessionProviderReviewWorkStart } from "./session-work-start-Sz_vqYld.mjs";
import { l as normalizeCodeModeExecBeforeHookParams, n as CODE_MODE_WAIT_TOOL_NAME, s as isCodeModeExecTool, t as CODE_MODE_EXEC_TOOL_NAME } from "./code-mode-control-tools-ktsLOa_a.mjs";
import { c as getReplyPayloadMetadata } from "./reply-payload-BLX_BF2U.mjs";
import { o as hasNonzeroUsage, u as normalizeUsage } from "./usage-BqbJmOEZ.mjs";
import { a as resolveSessionPermissionExecMode } from "./session-permission-exec-mode-orsENUww.mjs";
import { i as getPluginToolSideEffectOwnerKey, r as getPluginToolMeta } from "./tool-metadata-CaNEdKPR.mjs";
import { i as gateAgentToolExecution, r as finalizeAgentToolAvailability } from "./agent-tool-availability-DZN62JsD.mjs";
import { i as copyAgentToolMetadata, p as getChannelAgentToolMeta } from "./agent-tool-metadata-Dj6F-G24.mjs";
import { a as attachInternalToolExecutionPreparer, i as attachInternalToolBatchLifecycle, m as getInternalToolExecutionPreparer, u as copyInternalToolResultState } from "./internal-hooks-CSjTREUl.mjs";
import { a as ACTIVE_EMBEDDED_RUNS_BY_RUN_ID, i as ACTIVE_EMBEDDED_RUNS, o as ACTIVE_EMBEDDED_RUN_REGISTRATIONS, y as setActiveEmbeddedRunLifecycleGeneration } from "./run-state-DZ4Vfz1J.mjs";
import { r as MAX_IMAGE_BYTES } from "./constants-GzjKtFvA.mjs";
import { i as toDatabaseOptions } from "./session-accessor.sqlite-scope-helpers-XTtpZpWK.mjs";
import { f as isMainSessionRestartRecoveryInputProvenance, h as normalizeInputProvenance, v as shouldPreserveUserFacingSessionStateForInputProvenance } from "./input-provenance-D1LHo5Qj.mjs";
import { i as SessionWorkStartChangedError } from "./work-start-error-BI-UhSB2.mjs";
import { t as buildSessionContext } from "./session-BEAHkH3E.mjs";
import { f as getOpenClawSystemUpdateKind, p as isOpenClawSystemUpdateMessage } from "./messages-Cdi_z_94.mjs";
import { S as supportsClaudeInHistorySystemMessages } from "./anthropic-B3HirzdP.mjs";
import { A as formatCompactionUserLabel, D as computeFileLists, E as clearCompactionPendingAskSection, O as extractCompactionMessageText, T as MAX_FILE_OPS_SECTION_CHARS, _ as MAX_COMPACTION_SUMMARY_CHARS, b as fitCompactionSummary, j as formatFileOperations, k as extractCurrentCompactionUserRequest, v as SUMMARY_TRUNCATED_MARKER, x as formatRequiredAskContext, y as capCompactionSummary } from "./agent-core-BbGXCiXw.mjs";
import "./src-D3H6pm7W.mjs";
import { _ as stripRuntimeContextCustomMessages, d as relocateCurrentRuntimeContextCarrierToTail, f as resolvePendingRuntimeContextReplay } from "./internal-runtime-context-DLJtDQoI.mjs";
import { t as readMessageIdempotencyKey } from "./transcript-message-identity-0wQEn3Eb.mjs";
import { n as parseSqliteSessionFileMarker } from "./legacy-sqlite-marker-CkjJ0jcJ.mjs";
import { f as readPersistedMediaFacts, n as applyRunHydrationSuppression, r as attachRuntimePromptMediaFacts, s as isImageMediaFact } from "./media-facts-BIPREXi-.mjs";
import { n as findMarkdownCodeRegions } from "./reasoning-tags-DOZ8HVZL.mjs";
import "./code-regions-Cy_WAn7O.mjs";
import { n as SILENT_REPLY_TOKEN, o as isSilentReplyText } from "./tokens-DHFPcfdZ.mjs";
import { a as readNestedToolActivity, i as projectNestedToolActivityForHooks, n as createNestedToolActivity } from "./nested-tool-activity-Da7SpARz.mjs";
import { a as projectScrubbedPlainTextToolCallMessage, i as normalizePlainTextToolCallStreamEvents, l as isPlainTextToolCallAttempt, n as createPromotedPlainTextToolCallEvents, r as projectStandalonePlainTextToolCallMessage } from "./src-DkL06zvq.mjs";
import { t as renderAgentHarnessPreflightUserMessage } from "./user-facing-text-BNFEPbYx.mjs";
import { f as renderAuthProfileFailoverCopy } from "./user-copy-BAz4s3EV.mjs";
import { r as isCloudCodeAssistFormatError } from "./classify-core-Y2V-pZHU.mjs";
import { n as isTransientNetworkError } from "./retryable-network-errors-D2gJmBqw.mjs";
import { a as renderAssistantRequestFailureCopy } from "./assistant-request-failure-copy-csnSONXK.mjs";
import { l as readTranscriptSenderIdentity } from "./user-turn-transcript.metadata-CtXLmxDa.mjs";
import { r as isSessionTranscriptProjectionUnavailableError } from "./session-transcript-projection-error-B7C6SQei.mjs";
import { i as readCapturedSessionActorEntries, n as captureSessionActorStorageOwner, o as runWithSessionActorStorage } from "./session-actor-storage-binding-oCtbPk00.mjs";
import { n as resolveSqliteReadScope } from "./session-accessor.sqlite-read-scope-DzGQuOfU.mjs";
import "./session-accessor.sqlite-scope-9ysL95gx.mjs";
import { n as resolveSessionTranscriptReadFence } from "./session-transcript-read-fence-CgUG4J4j.mjs";
import { t as assertSessionEntryCohortScope } from "./session-entry-cohort-scope-BWJvT1Qn.mjs";
import { a as readSessionEntrySummariesInWorker } from "./session-entry-read-runtime-CgqUrGct.mjs";
import { F as recoverSessionTranscriptProjection } from "./session-accessor-Czw4l8kI.mjs";
import { n as IncognitoSessionMissingError } from "./incognito-session-error-Dsi9IsoJ.mjs";
import { f as sanitizeTranscriptMessage } from "./session-accessor.sqlite-transcript-store-Dp-yP34B.mjs";
import { R as withPreparedSessionCapabilityRead } from "./session-accessor.sqlite-entry-store-B3Lv6xes.mjs";
import { r as prepareSessionEntryReplacementDatabase } from "./session-accessor.sqlite-replacement-worker-BpIicMPG.mjs";
import { n as createSessionActorFactory } from "./session-actor-durable-CYW-aqH_.mjs";
import { u as stripHeartbeatToken } from "./heartbeat-C40cs1ec.mjs";
import { o as patchSessionEntryCore } from "./session-accessor.sqlite-entry-wJ2W65pX.mjs";
import { c as getOwnedSessionTranscriptInitialWriter, g as withOwnedSessionTranscriptWrites, h as withOwnedSessionTranscriptWriterFence, i as captureOwnedTranscriptWriteAssertion, l as getOwnedSessionTranscriptReader, p as runWithOwnedSessionTranscriptWrite, r as bindOwnedSessionTranscriptWrites, t as assertOwnedTranscriptWriteCommit, y as withSessionTranscriptWriteAssertion } from "./transcript-write-context-C02sC3zd.mjs";
import "./config-B3oiWDlr.mjs";
import { t as withSessionTranscriptReadSource } from "./session-transcript-read-source-Bmo2UYck.mjs";
import { t as prepareSessionTranscriptHydration } from "./session-transcript-hydration-OIv_abWd.mjs";
import { n as readSessionTranscriptAnchorsAsync } from "./session-transcript-anchor-read-DMRJnQDO.mjs";
import { i as withSessionManagerMemoryActor, t as captureSessionManagerIncognitoBinding } from "./session-manager-incognito-scope-DBz3K1lk.mjs";
import { o as resolveSessionTranscriptRuntimeTarget, r as resolveSessionKeyBySessionIdAsync } from "./session-accessor.transcript-target-DDngfM5X.mjs";
import { r as resolveOsSummary } from "./os-summary-DH0HB36b.mjs";
import { n as resolveAgentTimeoutMs, t as DEFAULT_AGENT_TIMEOUT_MS } from "./timeout-BBs3o51w.mjs";
import "./model-selection-DdQ-ffuG.mjs";
import { s as resolveProviderThinkingLevel } from "./thinking-BCNoGfZ5.mjs";
import { t as createStreamIteratorWrapper } from "./stream-iterator-wrapper-BKsGhmOL.mjs";
import { r as wrapStreamFnTextTransforms } from "./plugin-text-transforms-B25e5LoI.mjs";
import { t as resolveSelectedModelCredential } from "./model-auth-selected-credential-DtR_jW21.mjs";
import { c as mintSecretSentinel, l as resolveSecretSentinel, s as looksLikeSecretSentinel } from "./sentinel-DZP_CK2t.mjs";
import "./http-body-DZQjJc2J.mjs";
import { t as cancelUnreadResponseBody } from "./http-response-body-B70cE6fn.mjs";
import { t as redactAgentDiagnosticPayload } from "./diagnostic-redaction-CUiZdHHf.mjs";
import { p as readProviderJsonObjectResponse } from "./provider-http-errors-CjVOxCE5.mjs";
import { d as resolveProviderRequestHeaders } from "./provider-request-config-WdycwKIG.mjs";
import { n as withGuardedFetchRequestAuthority } from "./fetch-request-authority-BA1Sa1i8.mjs";
import { s as resolveContextEngineOwnerPluginId } from "./registry-BNFZRyO5.mjs";
import { n as getGlobalHookRunner } from "./hook-runner-global-yjqy4fXI.mjs";
import { N as peekAdjustedParamsForToolCall, O as clearBatchAdmittedToolCallsForRun, T as finalizeToolTerminalPresentation, l as wrapToolWithBeforeToolCallHook, s as recordStructuredReplayTrustForToolCall, v as admitToolCallBatch } from "./agent-tools.before-tool-call-CtP0G8Wg.mjs";
import { r as resolveChannelAccountEntry } from "./account-lookup-Dm5zJglt.mjs";
import { c as mergeAgentRunAttemptTerminal, d as setAgentRunAttemptTerminalFailure, r as buildAgentRunTerminalOutcomeFromAttempt, u as projectAgentRunAttemptTerminal } from "./agent-run-terminal-outcome-D-ijbyA8.mjs";
import { i as runOwnedAgentCleanup, n as recordAgentCleanupFailure, r as runAgentCleanupStep } from "./run-cleanup-timeout-CjK4qQ1w.mjs";
import { n as isToolResultError } from "./tool-result-error-IpvGgAny.mjs";
import { i as MessageInjectionWithdrawnError, t as MessageInjectionAcceptedUnconfirmedError } from "./message-injection-authority-Mu3hgByB.mjs";
import { g as getReplyOperationSessionReader } from "./reply-run-registry.state-Hn_UqZjq.mjs";
import { t as isEmbeddedMode } from "./embedded-mode--Mk71zY-.mjs";
import { t as hasPromptImageInput } from "./prompt-image-input-Urne2gUL.mjs";
import { _ as beginDiagnosticRetryWait, f as markDiagnosticRunProgress, i as createDiagnosticEmbeddedRunOwner, r as closeDiagnosticEmbeddedRunOwner } from "./diagnostic-run-activity-CaoGYSHp.mjs";
import { r as resolveCompactionTimeoutMs } from "./compaction-safety-timeout-Cgwbj_da.mjs";
import { n as resolveDiagnosticModelContentCapturePolicy } from "./diagnostic-llm-content-P2SGagoP.mjs";
import { M as setActiveEmbeddedRun, a as clearActiveEmbeddedRun, h as markActiveEmbeddedRunAbandoned } from "./runs-Czr-I6_B.mjs";
import { t as resolvePreferredSessionKeyForSessionIdMatches } from "./session-id-resolution-B3ptFjot.mjs";
import { i as getAgentWorkspaceAccess } from "./workspace-access-sFz3TNTx.mjs";
import { r as readWorkspaceBootstrapFile, t as MAX_WORKSPACE_BOOTSTRAP_FILE_BYTES } from "./workspace-bootstrap-read-ClACC-rY.mjs";
import { r as getModelProviderRuntimePluginHandle } from "./provider-hook-runtime-DHSjZAkW.mjs";
import "./failover-error-Bjf0VdY2.mjs";
import { a as resolveStoredSessionKeyForSessionId, n as resolveExistingSessionKeyForRequest } from "./session-Cb56xLxH.mjs";
import { a as findMediaGenerationOperation, d as isTerminalMediaGenerationStatus, f as listMediaGenerationOperations } from "./media-generation-activity-CdYWMYrm.mjs";
import "./tool-fs-policy-C65zBDHN.mjs";
import { i as isToolCallBlockType } from "./tool-block-contract-CgqnHcSD.mjs";
import { t as filterHeartbeatTranscriptArtifacts } from "./heartbeat-filter-3DbSzqaf.mjs";
import { c as resolveStagedInputMediaPaths } from "./staged-inputs-Hv7T90Jl.mjs";
import { n as acquireSessionMcpRuntime } from "./agent-bundle-mcp-manager-api-BF9Uyz8N.mjs";
import { t as loadSessionMcpConfig } from "./agent-bundle-mcp-runtime-config-BY_ItTpJ.mjs";
import { T as resolveProviderTextTransforms } from "./provider-runtime-DZ8luukj.mjs";
import { a as resolveToolCallArgumentsEncoding, n as extractModelCompat } from "./provider-model-compat-JoOGepWg.mjs";
import { n as normalizeGoogleApiBaseUrl } from "./google-api-base-url-B5JCFm92.mjs";
import { n as applySkillEnvOverridesFromSnapshot, t as applySkillEnvOverrides } from "./env-overrides-BfZsWBmC.mjs";
import { t as collectTextContentBlocks } from "./content-blocks-DDtxq3Ff.mjs";
import { r as resolveImageSanitizationLimits } from "./image-sanitization-DhkMOJXD.mjs";
import { i as resolveLiveToolResultMaxChars } from "./tool-result-limits-tYfGdUlb.mjs";
import { t as prepareProviderPrompt } from "./provider-prompt-serialization-DkV1jKOc.mjs";
import "./undici-global-dispatcher-9JyoXANm.mjs";
import { a as prepareSessionManagerHydration } from "./session-manager-reload-BdL-HEet.mjs";
import { n as isQueryStopWordToken, t as extractKeywords } from "./query-expansion-8IlqIzbI.mjs";
import { n as getAgentScopedMediaLocalRoots } from "./local-roots-B-x-73co.mjs";
import { a as joinWithRunLivenessDeadline, i as isOpenClawAbortableWrapper, n as abortable, o as withAbortListener, r as createAbortableError, t as RUN_LIVENESS_JOIN_TIMEOUT_MS } from "./abortable-CD217r1Y.mjs";
import { a as validateAnthropicTurns, i as shouldMergeConsecutiveTurns, m as formatUserFacingAssistantErrorText, o as validateGeminiTurns, r as shouldAllowProviderOwnedThinkingReplay, t as mergeConsecutiveUserMessages, u as normalizeOpenAIResponsesToolCallIds } from "./embedded-agent-helpers-CRUmVsjM.mjs";
import { i as isThinkingLikeBlock, r as sanitizeToolCallIdsForCloudCodeAssist, t as hasToolCallInput } from "./tool-call-id-Cp_h0s17.mjs";
import { t as createCompletedToolCallPredicate } from "./tool-call-shared-kDhtZDeM.mjs";
import { r as parseFenceSpans, t as findFenceSpanAt } from "./fences-SIDHlQ9D.mjs";
import { i as SummaryOutputBudgetError, n as CompactionError } from "./types-CPdr3cVV.mjs";
import { t as resolveReplyFailoverFacts } from "./request-error-facts-5Q588zTF.mjs";
import { t as buildProviderAuthRecoveryHint } from "./provider-auth-recovery-hint-CobbpYma.mjs";
import { n as hashToolCall, r as observeRepeatedToolError } from "./tool-loop-detection-Du9se3pv.mjs";
import { n as claimPendingAgentQuestionAnswer, t as cancelPendingAgentQuestionForSession } from "./gateway-question-DpNVBEhx.mjs";
import { t as prepareCronRootSessionGeneration } from "./session-delivery-generation-NkiiEowi.mjs";
import { i as resolveReplyExpectation } from "./reply-completion-B5n1Cnxm.mjs";
import { n as OPENCLAW_EMBEDDED_CONTEXT_ENGINE_HOST, r as assertContextEngineHostSupport } from "./host-compat-DWLjZN89.mjs";
import { t as BUILTIN_AGENT_HARNESS_METADATA } from "./builtin-openclaw-metadata-4LZRMXv7.mjs";
import { t as captureAgentWorkspaceReadiness } from "./workspace-readiness-B5JSqS7C.mjs";
import { t as createStageTimingTracker } from "./stage-timing-BUG4Fnsv.mjs";
import { r as materializeBundleMcpToolsForRun } from "./agent-bundle-mcp-materialize-BoIwB4F1.mjs";
import "./agent-bundle-mcp-tools-CR5Vro5t.mjs";
import { s as resolveModelAuthModeAsync } from "./model-auth-CMoPmop7.mjs";
import { a as resolveUserTimezone, n as formatDateStamp } from "./date-time-B92eHI7U.mjs";
import { a as prepareHarnessContextEnginePrompt, n as bootstrapHarnessContextEngine, r as finalizeHarnessContextEngineTurn } from "./context-engine-lifecycle-8o0i3Txa.mjs";
import { t as runWithAsyncWorkResources } from "./async-work-resources-DmPouonj.mjs";
import { t as resolveSessionPlacementComputer } from "./session-placement-computer-wc2Javdz.mjs";
import { t as prepareConversationCapabilityProfile } from "./conversation-capability-profile-BVWQsqkw.mjs";
import { a as prepareSkillLibrarySelection } from "./selection-B3qUGv_G.mjs";
import { t as resolveSkillResourceCandidates } from "./resource-candidates-DWvSV-Yb.mjs";
import { r as messageToolOwnsVisibleReply } from "./source-reply-delivery-mode-CC4nGK9E.mjs";
import { r as projectConversationToolNames } from "./conversation-tool-policy-pipeline-DNbcwb7L.mjs";
import { i as createOpenClawCodingToolsInternalAsync } from "./agent-tools-QGgE-Vnu.mjs";
import { n as wrapToolWithAbortSignal, t as raceWithAbortSignal } from "./agent-tools.abort-Vm0F-Le2.mjs";
import { r as assertMemoryFlushPersistenceToolAvailable } from "./core-coding-tools-htyTOKJv.mjs";
import { l as createSkillInstructionDeliveryCache } from "./secrets-tool-vT5mBKZ0.mjs";
import { d as createToolDefinitionFromAgentTool, f as wrapToolDefinition } from "./tools-CsYUPwyX.mjs";
import { t as getAgentToolAssistantTurnId } from "./tool-execution-context-BwYF5HLu.mjs";
import { t as decodeHtmlEntities } from "./html-entities-CvDVeY8C.mjs";
import { C as retainToolSearchImplementation, E as resolveLocalModelLeanPreserveToolNames, S as TOOL_SEARCH_RAW_TOOL_NAME, T as isLocalModelLeanEnabled, b as TOOL_DESCRIBE_RAW_TOOL_NAME, c as resolveToolSearchConfig, d as clearToolSearchCatalog, f as collectUniqueCatalogToolNames, l as addClientToolsToToolCatalog, s as resolveToolSearchCatalogTool, w as filterLocalModelLeanTools, x as TOOL_SEARCH_CONTROL_TOOL_NAMES, y as TOOL_CALL_RAW_TOOL_NAME } from "./tool-search-BYeL5tYo.mjs";
import { t as resolveNativeWebSearchRoute } from "./native-web-search-GYI4rjNv.mjs";
import "./channel-tools-IvDct8QI.mjs";
import { t as isHeartbeatLifecycleRunKind } from "./bootstrap-mode-BarAnCx4.mjs";
import { i as wrapUntrustedPromptDataBlock } from "./sanitize-for-prompt-bzCyHFCH.mjs";
import { T as releasePendingAgentSteeringItems } from "./subagent-registry-CfK3_UcO.mjs";
import { t as hasAnyNonEmptyString } from "./delivery-evidence-values-CSe-71lq.mjs";
import { n as filterRuntimeCompatibleTools } from "./tool-schema-projection-CfXbgFr1.mjs";
import { t as resolveToolLoopDetectionConfig } from "./tool-loop-detection-config-uCpxGkcu.mjs";
import { r as loadPairedComputerUseAvailabilityForSurface } from "./computer-tool-DEQfJiDZ.mjs";
import { r as captureFinalEffectiveCronCreatorToolAllowlist } from "./cron-tool-BLlbTzAZ.mjs";
import { n as resolveHeartbeatSummaryForAgent } from "./heartbeat-summary-Dpf9vV-O.mjs";
import { b as resolveSourceReplyDelivery, c as hasCommittedMessagingToolDeliveryEvidence } from "./delivery-evidence-Do1wex_l.mjs";
import { s as extractEmbeddedAssistantText } from "./embedded-agent-utils-Bl20r92X.mjs";
import { n as swapSecretSentinelsForEgress, t as buildGuardedModelFetch } from "./ai-transport-host-BOghwVNz.mjs";
import { t as event_stream_exports } from "./event-stream-xGBL9CyU.mjs";
import { i as normalizeAcceptedSessionSpawnResult, n as hasCompletionMessageSessionSpawn, t as hasAcceptedSessionSpawn } from "./accepted-session-spawn-Bo7jgCE_.mjs";
import { n as supportsModelTools } from "./model-tool-support-DIQSEumC.mjs";
import { t as resolveSkillWorkshopToolConstructionBlock } from "./tool-availability-BWNOfZ4J.mjs";
import { i as markCoreTtsAttemptResult } from "./tts-tool-result-provenance-BbSbWcUn.mjs";
import { l as bindCodeModeSessionStore } from "./tool-contract-error-jfOGTMOC.mjs";
import { i as isAgentToolRestartSafe, n as collectSideEffectToolOwners, r as isAgentToolReplaySafe, t as collectReplaySafeToolNames } from "./tool-replay-safety-CXVSLx-9.mjs";
import { t as log$7 } from "./logger-BpVUgEyL.mjs";
import { t as runBestEffortCallback } from "./embedded-agent-subscribe.callback-BBye3ou6.mjs";
import { i as isWorkspaceTool, n as gateBoundTool } from "./host-bound-tool-xXnbsmZ9.mjs";
import { r as remapSkillReferencePaths } from "./sandbox-skills-DF-8lllB.mjs";
import { t as prepareInstalledSkillCatalog } from "./installed-skill-runtime-Cl4Ax5o3.mjs";
import { d as setSteeringRuntimeContextRetention, l as prependRuntimeContextForModel, n as applyRuntimeContextCarrierRetention } from "./runtime-context-prompt-D_5rC-8c.mjs";
import { r as recordPersistedRuntimeToolSchemaQuarantine, t as clearRecoveredPersistedRuntimeToolSchemaQuarantines } from "./tool-schema-quarantine-health-PbHSEWtr.mjs";
import { n as resolveSkillsPrompt, t as buildSkillSnapshot } from "./workspace-skill-prompt-BmEdTiat.mjs";
import { t as prepareRuntimeSkillEntries } from "./skills-prompt-2hkPSs7i.mjs";
import { t as FULL_BOOTSTRAP_COMPLETED_CUSTOM_TYPE } from "./bootstrap-files-B2csFCe1.mjs";
import { $ as readLastCacheTtlTimestamp, A as validateReplayTurns, B as installEmbeddedAttemptContextGuards, C as selectEmbeddedAgentStream, D as resolveAttemptTrajectorySessionFile, E as removeTrailingMidTurnPrecheckAssistantError, F as createYieldAbortedResponse, H as startEmbeddedAttemptDiagnostics, I as isSessionsYieldAbortReason, J as completePromptCacheObservation, L as queueSessionsYieldInterruptMessage, M as selectCompactionTimeoutSnapshot, N as shouldFlagCompactionTimeout, O as resolveExistingAttemptTranscriptState, P as SESSIONS_YIELD_ABORT_REASON, Q as isCacheTtlEligibleProvider, R as isRunnerAbortError, T as normalizeCompactionRecoveryTranscriptTail, V as prepareEmbeddedAttemptSetup, X as declarePromptToolPin, Y as declarePromptHistoryRewrite, Z as collectPromptCacheTools, a as createOpenAIServiceTierObservationWrapper, at as resolvePromptCacheTouchTimestamp, b as resolveEmbeddedAgentApiKey, d as handleEmbeddedAttemptPromptError, f as submitEmbeddedAttemptPrompt, g as resolveAttemptTranscriptPolicy, h as normalizeMessagesForLlmBoundary, i as wrapStreamFnWithDiagnosticModelCallEvents, it as findLatestUncompactedAttemptUsageSnapshot, j as resolveRunTimeoutDuringCompaction, k as sanitizeSessionHistory, l as createPromptBuildToolPolicy, m as cleanupEmbeddedAttemptResources, nt as buildContextEnginePromptCacheInfo, o as prepareEmbeddedAttemptPromptAssembly, p as wrapStreamFnWithMessageTransform, q as beginPromptCacheObservation, r as measureEmbeddedAgentPreparation, rt as findCurrentAttemptAssistantMessage, s as prepareEmbeddedAttemptPromptContext, t as prepareEmbeddedAttemptSystemPrompt, u as observeEmbeddedAttemptPrompt, w as loadAttemptSessionEntryAfterQuotaMaintenance, x as resolveEmbeddedAgentBaseStreamFn, y as logDecisionToolRequest, z as prepareEmbeddedAttemptBootstrap } from "./attempt-system-prompt-prepare-D8zKFv2e.mjs";
import { i as sanitizeToolUseResultPairingForModel, r as sanitizeToolUseResultPairing } from "./session-transcript-repair-BTNxtQ4j.mjs";
import { i as agentSessionDeferThresholdCompaction, r as createSessionManagerRuntimeRegistry, t as recordSessionModelUsage } from "./session-model-usage-C52vsLrM.mjs";
import { s as createCodexNativeWebSearchWrapper } from "./proxy-5w6qPw5I.mjs";
import { a as resolvePreparedExtraParams, c as resolveExplicitCachedContent, n as resolveAgentTransportOverride, o as isGooglePromptCacheEligible, r as resolveExplicitSettingsTransport, s as resolveCacheRetention, t as applyExtraParamsToAgent } from "./extra-params-DHqvlGni.mjs";
import { l as sanitizeCompactionMessages } from "./context-token-pressure-II9nRGTn.mjs";
import { C as wrapStreamObjectSettlement, S as wrapStreamObjectEvents, b as wrapAnthropicStreamWithRecovery, g as dropThinkingBlocks, h as dropReasoningFromHistory, o as restoreCacheTtlToolResultProjections, p as bindToolResultPromptProjectionKeys, u as truncateOversizedToolResultsInSessionManager, x as mapAssistantMessageStream, y as stripThinkingBlocksFromMessage } from "./tool-result-truncation-B6wvsjzz.mjs";
import { a as persistSessionToolSurface, c as prepareSessionSystemPrompt, f as retainEmbeddedSessionPromptState, i as persistSessionSystemPrompt, l as prepareSessionToolSurface, o as persistToolResultProjections, p as retireSessionSystemPrompt, t as beginSessionSystemPrompt, u as recordRuntimeContextProjection } from "./session-prompt-state-tij27tsD.mjs";
import { t as rewriteTranscriptEntriesInSessionManager } from "./transcript-rewrite-exk4oVrD.mjs";
import { l as shouldPreemptivelyCompactBeforePrompt, n as buildPrePromptContextBudgetStatus, o as estimateToolSchemaTokenPressure, s as formatPrePromptPrecheckLog, t as PREEMPTIVE_OVERFLOW_ERROR_TEXT } from "./preemptive-compaction-Dka97wCW.mjs";
import { _ as resolveModelCallUrgency, a as mergeOrphanedTrailingUserPrompt, g as resolveEmbeddedCompactionThinkingLevel, i as buildAfterTurnRuntimeContextFromUsage, r as buildAfterTurnRuntimeContext, t as runContextEngineMaintenance, x as mapThinkingLevel } from "./context-engine-maintenance-DybI5s-J.mjs";
import { a as materializeProviderContext, n as detectAndLoadPromptImages, t as buildPromptImageFailureNotice } from "./images-BQVTsQiw.mjs";
import { t as createBundleLspToolRuntime } from "./agent-bundle-lsp-runtime-pXGRdq8n.mjs";
import { n as normalizeAgentRuntimeTools, t as logAgentRuntimeToolDiagnostics } from "./tools-D4qtvvFO.mjs";
import { t as applyFinalEffectiveToolPolicy } from "./effective-tool-policy-jDkqpuYg.mjs";
import { a as shouldCreateBundleMcpRuntimeForAttempt, i as shouldCreateBundleLspRuntimeForAttempt, n as mergeForcedEmbeddedAttemptToolsAllow, r as resolveEmbeddedAttemptToolConstructionPlan, t as applyEmbeddedAttemptToolsAllow } from "./attempt-tool-construction-plan-D12sns28.mjs";
import { S as sanitizeCompactionReplayMessages, c as agentSessionSetContextReplacementHook, d as agentSessionQueuePromptContext, f as agentSessionSetPromptPreparation, g as retireQueuedUserMessage, m as subscribeSteeringMessagePersistenceFailure, n as DefaultResourceLoader, p as getSteeringMessageIdentity, w as resolveCompactionInstructions } from "./settings-manager-D9ggLoN1.mjs";
import { a as completedTurnMessageAnchor, d as withSessionManagerAppend, i as captureCompletedTurnMessageAnchor, n as sessionManagerOpenTranscriptCohort, o as sessionManagerPrepareCurrentTurnReplay, r as sessionManagerReloadTranscriptCohort, t as SessionManager } from "./session-manager-Mve5HWCW.mjs";
import { t as SessionTranscriptMessageCommittedError } from "./session-manager-message-error-CdpV1a6G.mjs";
import { i as withSessionManagerWrite, t as appendSessionTranscriptNote } from "./session-manager-write-admission-Ca7jiEvG.mjs";
import { n as createCompactionRequestBudget } from "./request-budget-DkXbt99N.mjs";
import { i as isSessionContextMetadataEntry } from "./session-manager-codec-DTpe_z-3.mjs";
import { C as hasAsyncActivity, E as resolveCurrentAttemptAssistant, O as countActiveToolExecutions, S as buildAttemptReplayMetadata, _ as joinAssistantTexts, a as installMessageToolTerminalHook, b as observeReplayMetadata, f as shouldTreatEmptyAssistantReplyAsSilent, g as isIncompleteTerminalAssistantTurn, h as hasComposedVisibleAnswerAfterSettledTools, i as recordEmbeddedToolReceipt, m as countSettledTurnDeliveryPayloads, n as subscribeEmbeddedAgentSession, o as readSubscriptionCompletionEvidence, p as classifyAssistantTurn, t as createAgentSession, w as hasAttemptTerminalState, x as replayMetadataFromState } from "./sdk-Bxnj3yKa.mjs";
import { r as runAgentEndSideEffectsAsync } from "./agent-end-side-effects-qwj0xulU.mjs";
import { i as runAgentHarnessBeforeAgentFinalizeHook, s as bindAgentHarnessHookMessages } from "./lifecycle-hook-helpers-BAkeSLPH.mjs";
import { t as generateSummary } from "./sessions-DcS9dd33.mjs";
import { n as buildEmbeddedAgentHookContext } from "./transcript-policy-DzNWptYX.mjs";
import { a as projectTrajectorySessionTarget, n as buildEmbeddedAgentEndContext, t as buildEmbeddedAttemptToolRunContext } from "./attempt-tool-run-context-B4q5w5uB.mjs";
import { n as buildStreamErrorAssistantMessage } from "./stream-message-shared-CYuIJ_XF.mjs";
import { d as resolveFinalMessageRawText, h as isRunnerToolCallBlock, l as resolveFinalAssistantRawText, m as resolveReportedModelRef, u as resolveFinalAssistantVisibleText } from "./helpers-3t21Jnao.mjs";
import { n as guardSessionManager } from "./messages-CZ7XNOd9.mjs";
import { t as streamWithPayloadPatch } from "./stream-payload-utils-DKyCtmRd.mjs";
import { c as hasCopilotVisionInput, o as buildCopilotDynamicHeaders } from "./copilot-dynamic-headers-C8eJEO7a.mjs";
import { i as wrapStreamFnWithSessionFork } from "./session-fork-11GSQ2uI.mjs";
import { n as runBeforeAgentRunGate, t as buildAgentRunBlockedUserMessage } from "./before-agent-run-CCn_GAdw.mjs";
import { t as safeJsonStringify } from "./safe-json-q5hA23KQ.mjs";
import { t as createTrajectoryRuntimeRecorder } from "./runtime-j-hZS2Rj.mjs";
import { n as logCodeModeDiagnostic, t as isCodeModeDiagnosticEnabled } from "./code-mode-diagnostic-DGYphPwS.mjs";
import { _ as observeAgentRunApprovalWait } from "./code-mode-state-DchVJb10.mjs";
import { a as createCodeModePermissionChangeReason, t as createAgentHarnessToolSurfaceRuntimeCore } from "./tool-surface-bridge-DwhzBhjb.mjs";
import { r as resolveAttemptSpawnWorkspaceDir, t as appendAttemptCacheTtlIfNeeded } from "./attempt-thread-helpers-CXRtB_zI.mjs";
import { n as isChatGPTV2CompactionEligible, t as createChatGPTV2CompactionBoundary } from "./chatgpt-v2-compaction-CWsf8ZSs.mjs";
import { n as isToolAuthoredSourceReplyForAssistant } from "./embedded-agent-tool-authored-source-reply-DttnXWht.mjs";
import { t as registerProviderStreamForModel } from "./provider-stream-DNRYHaZ0.mjs";
import { a as isCoreToolResultMediaTrustedName } from "./embedded-agent-tool-media-BiXZn9vg.mjs";
import { n as createPreparedEmbeddedAgentSettingsManager } from "./agent-project-settings-BRSKWrAu.mjs";
import { a as resolveEffectiveCompactionMode, i as isSilentOverflowProneModel, n as applyAgentAutoCompactionGuard } from "./agent-settings-p_B_SpGc.mjs";
import { a as toToolDefinitions, i as toClientToolDefinitions, n as findClientToolNameConflicts, t as createClientToolNameConflictError } from "./agent-tool-definition-adapter-Dgpfhmph.mjs";
import { n as resolveCronStyleNow } from "./current-time-DzUuABk8.mjs";
import { t as createAgentToolResultMiddlewareRunner } from "./tool-result-middleware-CEf_c4e5.mjs";
import { t as resolveSessionBoundaryPromptCacheKey } from "./session-boundary-prompt-cache-key-xrPTEs08.mjs";
import { r as captureAgentRunTerminalPersistence } from "./agent-run-terminal-writes-D1C5plfs.mjs";
import { t as runHostPreparedIsolatedCompletion } from "./host-prepared-isolated-completion-8MWYpEXu.mjs";
import { n as projectSettledTurnFinalizationAttemptResult } from "./settled-turn-finalization-result-DJqqJfy5.mjs";
import fs from "node:fs";
import crypto$1, { randomUUID } from "node:crypto";
import fs$1 from "node:fs/promises";
import path from "node:path";
import { AsyncLocalStorage } from "node:async_hooks";
import { isDeepStrictEqual } from "node:util";
import { performance } from "node:perf_hooks";
import { setImmediate } from "node:timers/promises";
import { isProxy } from "node:util/types";
import { hasOnlyAssistantReasoningContent, sanitizeSurrogates, sortPromptCacheToolsByName, splitSystemPromptCacheBoundary, stripSystemPromptCacheBoundary } from "@openclaw/ai/internal/shared";
import { getEventStreamCompletion, getFirstStreamEventTimeoutMs, onLlmRequestActivity } from "@openclaw/ai/internal/runtime";
import { CompactionReplayRefreshRequiredError, isAnthropicServerToolClearingEnabled, isCompactionReplayCheckpoint, mergeTransportHeaders, preserveCompactionReplayWindow, replaceCompactionReplayOwnerContent, resolveCompactionReplayEligibility, sanitizeTransportPayloadText, stripCompactionReplayCheckpoint, stripCompactionReplayCheckpointInPlace, withProviderAcceptanceObserver } from "@openclaw/ai/transports";
import { bindResponsesInputMessage, modelRequestBodyState, responsesPromptObserver, responsesRequestLifecycle } from "@openclaw/ai/internal/openai";
import { isAnthropicOAuthApiKey, isDirectAnthropicModel } from "@openclaw/ai/internal/anthropic";
//#region src/shared/tool-activity-heartbeat.ts
const { runListeners, runLastActivityMs } = resolveGlobalSingleton(Symbol.for("openclaw.toolActivityHeartbeat"), () => ({
	runListeners: /* @__PURE__ */ new Map(),
	runLastActivityMs: /* @__PURE__ */ new Map()
}), (state) => {
	for (const listeners of state.runListeners.values()) notifyListeners(listeners, void 0);
	state.runListeners.clear();
	state.runLastActivityMs.clear();
});
function notifyToolActivity(runId) {
	runLastActivityMs.set(runId, Date.now());
	const listeners = runListeners.get(runId);
	if (!listeners) return;
	for (const listener of listeners) listener();
}
function onToolActivity(runId, listener) {
	let listeners = runListeners.get(runId);
	if (!listeners) {
		listeners = /* @__PURE__ */ new Set();
		runListeners.set(runId, listeners);
	}
	listeners.add(listener);
	return () => {
		listeners.delete(listener);
		if (listeners.size === 0 && runListeners.get(runId) === listeners) runListeners.delete(runId);
	};
}
function getLastToolActivityMs(runId) {
	return runLastActivityMs.get(runId) ?? 0;
}
function clearToolActivityRun(runId) {
	runListeners.delete(runId);
	runLastActivityMs.delete(runId);
}
//#endregion
//#region src/agents/tool-schema-quarantine.ts
/**
* Runtime tool-schema quarantine logging.
*
* Model providers can reject unsupported schema shapes, so runtime projection
* reports quarantined tools with trusted diagnostics before the model call.
*/
const log$6 = createSubsystemLogger("agents/tools");
function readDiagnosticPluginId(params) {
	try {
		const tool = params.tools[params.diagnostic.toolIndex];
		return tool ? getPluginToolMeta(tool)?.pluginId : void 0;
	} catch {
		return;
	}
}
function pluginOwner(pluginId) {
	return pluginId ? `plugin:${pluginId}` : void 0;
}
function toolQuarantineKey(params) {
	return JSON.stringify([params.owner ?? "", params.toolName]);
}
function readToolIdentity(tool) {
	try {
		if (typeof tool.name !== "string" || tool.name.length === 0) return;
		const owner = pluginOwner(getPluginToolMeta(tool)?.pluginId);
		return owner ? {
			owner,
			toolName: tool.name
		} : { toolName: tool.name };
	} catch {
		return;
	}
}
function listHealthyToolIdentities(params) {
	const failingKeys = new Set(params.diagnostics.map((diagnostic) => toolQuarantineKey({
		owner: pluginOwner(readDiagnosticPluginId({
			tools: params.tools,
			diagnostic
		})),
		toolName: diagnostic.toolName
	})));
	const healthy = [];
	for (const tool of params.tools) {
		const identity = readToolIdentity(tool);
		if (identity && !failingKeys.has(toolQuarantineKey(identity))) healthy.push(identity);
	}
	return healthy;
}
/** Emits diagnostics and logs for tools removed from runtime schema projection. */
async function logRuntimeToolSchemaQuarantine(params) {
	const recovered = clearRecoveredPersistedRuntimeToolSchemaQuarantines(() => listHealthyToolIdentities({
		diagnostics: params.diagnostics,
		tools: params.tools
	}));
	const writes = [];
	try {
		if (params.diagnostics.length === 0) {
			await recovered;
			return;
		}
		const summary = params.diagnostics.map((diagnostic) => {
			const pluginId = readDiagnosticPluginId({
				tools: params.tools,
				diagnostic
			});
			const owner = pluginId ? ` plugin=${pluginId}` : "";
			emitTrustedDiagnosticEvent({
				type: "tool.execution.blocked",
				runId: params.runId,
				agentId: params.agentId,
				...params.sessionKey ? { sessionKey: params.sessionKey } : {},
				...params.sessionId ? { sessionId: params.sessionId } : {},
				toolName: diagnostic.toolName,
				toolSource: pluginId ? "plugin" : "core",
				...pluginId ? { toolOwner: pluginId } : {},
				deniedReason: "unsupported_tool_schema",
				reason: diagnostic.violations.join(", ")
			});
			const persistedOwner = pluginOwner(pluginId);
			writes.push(recordPersistedRuntimeToolSchemaQuarantine({
				toolName: diagnostic.toolName,
				...persistedOwner ? { owner: persistedOwner } : {},
				reason: diagnostic.violations.join(", "),
				failedAt: /* @__PURE__ */ new Date()
			}).catch(() => {}));
			return `${diagnostic.toolName}${owner}: ${diagnostic.violations.join(", ")}`;
		}).join("; ");
		log$6.warn(`[tools] quarantined ${params.diagnostics.length} unsupported tool schema${params.diagnostics.length === 1 ? "" : "s"} before model runtime projection: ${summary}. Run openclaw doctor for details.`);
		await recovered;
	} finally {
		await Promise.allSettled([recovered, ...writes]);
	}
}
/** Joins diagnostic writes after a synchronous SDK or permission-publication callback finishes. */
async function withRuntimeToolSchemaQuarantine(run) {
	const pending = [];
	const record = (params) => {
		pending.push(logRuntimeToolSchemaQuarantine(params));
	};
	let result;
	try {
		result = await run(record);
	} catch (error) {
		await Promise.allSettled(pending);
		throw error;
	}
	const settled = await Promise.allSettled(pending);
	for (const operation of settled) if (operation.status === "rejected") throw operation.reason;
	return result;
}
//#endregion
//#region src/agents/embedded-agent-runner/skill-runtime.ts
/** Prepares readable skills and owns environment rollback until the caller takes custody. */
async function prepareEmbeddedSkills(params) {
	const executionAllow = params.attempt.toolExecutionAllow;
	if (params.attempt.operation === "settled-tool-finalization" || executionAllow && !isToolExecutionAllowed(executionAllow, "read")) return {
		restoreSkillEnv: () => {},
		skillUsagePaths: void 0,
		skillsPrompt: "",
		skillsSnapshotForRun: void 0,
		skillReadResources: void 0,
		codeModeSkills: [],
		installedSkills: []
	};
	const { skillsEligibility, skillUsagePaths, skillsPromptWorkspaceDir, skillsSnapshot: preparedSnapshot, skillsWorkspaceDir, shouldLoadSkillEntries, skillEntries, loadSkillEntries, preserveEntryOrder, mapEntries } = await prepareRuntimeSkillEntries({
		sandbox: params.sandbox,
		skillsAnchorWorkspace: params.attempt.bootstrapWorkspaceDir ?? params.effectiveWorkspace,
		skillsSnapshot: params.attempt.skillsSnapshot,
		assertCurrent: params.assertCurrent,
		config: params.attempt.config,
		agentId: params.sessionAgentId,
		executionWorkspaceDir: params.effectiveWorkspace
	});
	let restoreSkillEnv = () => {};
	try {
		const promptSkillEntries = mapEntries(shouldLoadSkillEntries ? skillEntries : void 0);
		const skillsSnapshot = preparedSnapshot ?? await buildSkillSnapshot(skillsPromptWorkspaceDir, {
			entries: promptSkillEntries ?? [],
			config: params.attempt.config,
			agentId: params.sessionAgentId,
			eligibility: skillsEligibility,
			preserveEntryOrder,
			assertCurrent: params.assertCurrent
		});
		const skillsPrompt = await resolveSkillsPrompt({
			assertCurrent: params.assertCurrent,
			contextTokenBudget: params.attempt.contextTokenBudget,
			skillsSnapshot,
			entries: promptSkillEntries,
			loadEntries: async () => mapEntries(await loadSkillEntries()) ?? [],
			config: params.attempt.config,
			workspaceDir: skillsPromptWorkspaceDir,
			agentId: params.sessionAgentId,
			eligibility: skillsEligibility,
			preserveEntryOrder
		});
		const libraryEntries = params.sandbox?.enabled ? [] : await prepareSkillLibrarySelection(skillsSnapshot.librarySelections ?? [], {}, params.assertCurrent ?? (() => {}));
		params.assertCurrent?.();
		restoreSkillEnv = params.applySkillEnvironment === false ? () => {} : preparedSnapshot ? applySkillEnvOverridesFromSnapshot({
			snapshot: preparedSnapshot,
			config: params.attempt.config
		}) : applySkillEnvOverrides({
			skills: skillEntries,
			config: params.attempt.config
		});
		const installedSkills = prepareInstalledSkillCatalog({
			snapshot: skillsSnapshot,
			workspaceDir: skillsWorkspaceDir,
			sandbox: params.sandbox,
			assertCurrent: params.assertCurrent
		});
		const codeModeSkills = params.includeCodeModeSkills ? installedSkills : [];
		const skillReadResources = params.sandbox?.enabled ? void 0 : resolveSkillResourceCandidates(skillsSnapshot, libraryEntries);
		return {
			restoreSkillEnv,
			skillReadResources,
			skillUsagePaths,
			skillsPrompt,
			skillsSnapshotForRun: skillsSnapshot,
			codeModeSkills,
			installedSkills
		};
	} catch (error) {
		restoreSkillEnv();
		throw error;
	}
}
//#endregion
//#region src/agents/embedded-agent-runner/run/attempt-bundle-tools.ts
async function prepareEmbeddedAttemptBundleTools(params) {
	const { cronCreatorToolAllowlist, cronCreatorToolAllowlistCaptureRef, effectiveToolsAllow, inheritedToolAllowlist, inheritedPublicationToolRef, localModelLeanPreserveToolNames, runtimeCapabilityProfile, toolsEnabled, toolsRaw } = params.preparedToolBase;
	const normalizeTools = (tools, recordQuarantine) => normalizeAgentRuntimeTools({
		runtimePlan: params.attempt.runtimePlan,
		tools,
		provider: params.attempt.provider,
		config: params.attempt.config,
		workspaceDir: params.setup.effectiveWorkspace,
		env: process.env,
		modelId: params.attempt.modelId,
		modelApi: params.attempt.model.api,
		model: params.attempt.model,
		runtimeHandle: params.setup.getProviderRuntimeHandle(),
		onPreNormalizationSchemaDiagnostics: (diagnostics, sourceTools) => recordQuarantine({
			diagnostics,
			tools: sourceTools,
			runId: params.attempt.runId,
			agentId: params.setup.sessionAgentId,
			sessionKey: params.attempt.sessionKey,
			sessionId: params.attempt.sessionId
		})
	});
	const tools = await withRuntimeToolSchemaQuarantine((record) => normalizeTools(toolsEnabled ? toolsRaw : [], record));
	const auxiliaryToolsEnabled = toolsEnabled && params.attempt.trigger !== "memory" && !params.attempt.disableTools && !params.isRawModelRun && !params.attempt.forceRestartSafeTools;
	let clientTools = auxiliaryToolsEnabled ? params.attempt.clientTools : void 0;
	if (clientTools && effectiveToolsAllow) {
		const matchesRuntime = createRuntimeToolMatcher(effectiveToolsAllow);
		clientTools = clientTools.filter((definition) => matchesRuntime(definition.function.name));
	}
	const bundleMetadataSnapshot = params.setup.getCurrentAttemptPluginMetadataSnapshot();
	const bundleManifestRegistry = bundleMetadataSnapshot?.pluginIds === void 0 ? bundleMetadataSnapshot?.manifestRegistry : void 0;
	const mcpConfig = {
		workspaceDir: params.setup.effectiveWorkspace,
		cfg: params.attempt.config,
		manifestRegistry: bundleManifestRegistry,
		toolOverrides: params.attempt.toolOverrides,
		toolDenylist: runtimeCapabilityProfile.policy.explicitToolDenylist
	};
	const bundleMcpAcquisition = shouldCreateBundleMcpRuntimeForAttempt({
		toolsEnabled: auxiliaryToolsEnabled,
		toolsAllow: params.attempt.toolsAllow,
		resolveConfiguredMcpNamespaces: () => {
			const configuredNames = Object.keys(params.attempt.config?.mcp?.servers ?? {});
			if (configuredNames.length === 0) return [];
			const { loaded, safeServerNamesByServer } = loadSessionMcpConfig({
				...mcpConfig,
				logDiagnostics: false
			});
			return configuredNames.flatMap((name) => {
				const safeName = Object.hasOwn(loaded.mcpServers, name) ? safeServerNamesByServer.get(name) : void 0;
				return safeName ? [`${safeName}__`] : [];
			});
		}
	}) ? await acquireSessionMcpRuntime({
		...mcpConfig,
		sessionId: params.attempt.sessionId,
		sessionKey: params.attempt.sessionKey,
		agentId: params.setup.sessionAgentId,
		agentDir: params.agentDir,
		requesterSenderId: params.attempt.senderId,
		agentAccountId: params.attempt.agentAccountId,
		messageChannel: params.attempt.messageChannel ?? params.attempt.messageProvider
	}) : void 0;
	const bundleMcpRuntime = bundleMcpAcquisition ? await materializeBundleMcpToolsForRun({
		...bundleMcpAcquisition,
		agentId: params.setup.sessionAgentId,
		reservedToolNames: [...tools.map((tool) => tool.name), ...clientTools?.map((tool) => tool.function.name) ?? []]
	}) : void 0;
	let bundleLspRuntime;
	try {
		bundleLspRuntime = shouldCreateBundleLspRuntimeForAttempt({
			toolsEnabled: auxiliaryToolsEnabled,
			toolsAllow: params.attempt.toolsAllow
		}) ? await createBundleLspToolRuntime({
			workspaceDir: params.setup.effectiveWorkspace,
			cfg: params.attempt.config,
			abortSignal: params.attempt.abortSignal,
			manifestRegistry: bundleManifestRegistry,
			reservedToolNames: [
				...tools.map((tool) => tool.name),
				...clientTools?.map((tool) => tool.function.name) ?? [],
				...bundleMcpRuntime?.tools.map((tool) => tool.name) ?? []
			]
		}) : void 0;
		const applyRuntimeAllowlist = (bundleTools) => applyEmbeddedAttemptToolsAllow(bundleTools, effectiveToolsAllow, { toolMeta: (tool) => getPluginToolMeta(tool) });
		const applyBundlePolicy = (bundledTools) => applyFinalEffectiveToolPolicy({
			bundledTools,
			config: params.attempt.config,
			workspaceDir: params.setup.effectiveWorkspace,
			metadataSnapshot: bundleMetadataSnapshot,
			conversationCapabilityProfile: runtimeCapabilityProfile,
			warn: (message) => log$7.warn(message)
		});
		const filteredBundledTools = applyBundlePolicy([...applyRuntimeAllowlist(bundleMcpRuntime?.tools ?? []), ...applyRuntimeAllowlist(bundleLspRuntime?.tools ?? [])]);
		if (bundleMcpRuntime?.restrictAppTools) bundleMcpRuntime.restrictAppTools(applyBundlePolicy(applyRuntimeAllowlist(bundleMcpRuntime.appTools ?? bundleMcpRuntime.tools)));
		const normalizedBundledTools = (filteredBundledTools.length > 0 ? await withRuntimeToolSchemaQuarantine((record) => normalizeTools(filteredBundledTools, record)) : filteredBundledTools).map((tool) => wrapToolWithBeforeToolCallHook(tool, params.preparedToolBase.toolHookContext));
		const projectTools = (coreTools, recordQuarantine) => {
			const projectedTools = filterLocalModelLeanTools({
				tools: [...coreTools, ...normalizedBundledTools].map((tool) => wrapToolWithAbortSignal(tool, params.preparedToolBase.toolAbortSignal)),
				config: params.attempt.config,
				agentId: params.setup.sessionAgentId,
				preserveToolNames: localModelLeanPreserveToolNames
			});
			const schemaProjection = filterRuntimeCompatibleTools(projectedTools);
			captureFinalEffectiveCronCreatorToolAllowlist(cronCreatorToolAllowlist, cronCreatorToolAllowlistCaptureRef, schemaProjection.tools, (tool) => getPluginToolMeta(tool));
			if (inheritedToolAllowlist?.length) {
				const publicationTool = inheritedPublicationToolRef?.current;
				replaceWithEffectiveToolAllowlist(inheritedToolAllowlist, [...schemaProjection.tools, ...applyRuntimeAllowlist(toolsEnabled && publicationTool ? [publicationTool] : [])]);
			}
			recordQuarantine({
				diagnostics: schemaProjection.diagnostics,
				tools: projectedTools,
				runId: params.attempt.runId,
				agentId: params.setup.sessionAgentId,
				sessionKey: params.attempt.sessionKey,
				sessionId: params.attempt.sessionId
			});
			return schemaProjection.tools;
		};
		const uncompactedEffectiveTools = await withRuntimeToolSchemaQuarantine((record) => projectTools(tools, record));
		return {
			bundleLspRuntime,
			bundleMcpRuntime,
			clientTools,
			tools,
			uncompactedEffectiveTools,
			refreshTools: (recordQuarantine) => {
				const nextTools = normalizeTools(toolsEnabled ? toolsRaw : [], recordQuarantine);
				tools.splice(0, tools.length, ...nextTools);
				const nextEffectiveTools = projectTools(tools, recordQuarantine);
				uncompactedEffectiveTools.splice(0, uncompactedEffectiveTools.length, ...nextEffectiveTools);
			}
		};
	} catch (error) {
		if ((await Promise.allSettled([bundleMcpRuntime, bundleLspRuntime].map(async (runtime) => await runtime?.dispose()))).some((result) => result.status === "rejected")) recordAgentCleanupFailure();
		throw error;
	}
}
//#endregion
//#region src/agents/embedded-agent-runner/wait-for-idle-before-flush.ts
/**
* Waits for tool-result streams to become idle before flushing output.
*/
const DEFAULT_WAIT_FOR_IDLE_TIMEOUT_MS = 3e4;
async function flushPendingToolResultsAfterIdle(opts) {
	const waitForAgentIdleBestEffort = async () => {
		const { agent, timeoutMs = DEFAULT_WAIT_FOR_IDLE_TIMEOUT_MS, abortSignal } = opts;
		const waitForIdle = agent?.waitForIdle;
		if (abortSignal?.aborted || typeof waitForIdle !== "function") return;
		const resolvedTimeoutMs = resolveTimerTimeoutMs(timeoutMs, DEFAULT_WAIT_FOR_IDLE_TIMEOUT_MS);
		try {
			await raceWithTimeout(waitForIdle.call(agent).then(() => void 0), resolvedTimeoutMs, () => void 0, {
				ref: false,
				signal: abortSignal
			});
		} catch {}
	};
	if (!(opts.timeoutMs !== void 0 && opts.timeoutMs <= 0)) await waitForAgentIdleBestEffort();
	const { sessionManager } = opts;
	if (sessionManager?.flushPendingToolResultsAsync && sessionManager.hasPendingToolResults?.() !== false) await sessionManager.flushPendingToolResultsAsync();
}
//#endregion
//#region src/trajectory/metadata.ts
function toSortedUniqueStrings(values) {
	if (!values || values.length === 0) return;
	return [...new Set(values)].filter((value) => typeof value === "string").map((value) => value.trim()).filter(Boolean).toSorted((left, right) => left.localeCompare(right));
}
function buildPluginsFromActiveRegistry() {
	const registry = getActivePluginRegistry();
	if (!registry || registry.plugins.length === 0) return null;
	return {
		source: "active-registry",
		importedRuntimePluginIds: listImportedRuntimePluginIds(),
		entries: registry.plugins.map((plugin) => ({
			id: plugin.id,
			name: plugin.name,
			version: plugin.version,
			description: plugin.description,
			origin: plugin.origin,
			enabled: plugin.enabled,
			explicitlyEnabled: plugin.explicitlyEnabled,
			activated: plugin.activated,
			imported: plugin.imported,
			activationSource: plugin.activationSource,
			activationReason: plugin.activationReason,
			status: plugin.status,
			error: plugin.error,
			format: plugin.format,
			bundleFormat: plugin.bundleFormat,
			bundleCapabilities: plugin.bundleCapabilities,
			kind: plugin.kind,
			source: plugin.source,
			rootDir: plugin.rootDir,
			workspaceDir: plugin.workspaceDir,
			toolNames: toSortedUniqueStrings(plugin.toolNames),
			hookNames: toSortedUniqueStrings(plugin.hookNames),
			channelIds: toSortedUniqueStrings(plugin.channelIds),
			cliBackendIds: toSortedUniqueStrings(plugin.cliBackendIds),
			providerIds: toSortedUniqueStrings(plugin.providerIds),
			speechProviderIds: toSortedUniqueStrings(plugin.speechProviderIds),
			realtimeTranscriptionProviderIds: toSortedUniqueStrings(plugin.realtimeTranscriptionProviderIds),
			realtimeVoiceProviderIds: toSortedUniqueStrings(plugin.realtimeVoiceProviderIds),
			mediaUnderstandingProviderIds: toSortedUniqueStrings(plugin.mediaUnderstandingProviderIds),
			imageGenerationProviderIds: toSortedUniqueStrings(plugin.imageGenerationProviderIds),
			videoGenerationProviderIds: toSortedUniqueStrings(plugin.videoGenerationProviderIds),
			musicGenerationProviderIds: toSortedUniqueStrings(plugin.musicGenerationProviderIds),
			webFetchProviderIds: toSortedUniqueStrings(plugin.webFetchProviderIds),
			webSearchProviderIds: toSortedUniqueStrings(plugin.webSearchProviderIds),
			agentHarnessIds: toSortedUniqueStrings(plugin.agentHarnessIds)
		})).toSorted((left, right) => left.id.localeCompare(right.id))
	};
}
function buildPluginsFromManifest(params) {
	return {
		source: "manifest-registry",
		entries: (params.pluginMetadataSnapshot ?? loadPluginMetadataSnapshot({
			config: params.config ?? {},
			workspaceDir: params.workspaceDir,
			env: params.env ?? process.env
		})).plugins.map((plugin) => ({
			id: plugin.id,
			name: plugin.name,
			version: plugin.version,
			description: plugin.description,
			origin: plugin.origin,
			enabledByDefault: plugin.enabledByDefault,
			format: plugin.format,
			bundleFormat: plugin.bundleFormat,
			bundleCapabilities: toSortedUniqueStrings(plugin.bundleCapabilities),
			kind: plugin.kind,
			source: plugin.source,
			rootDir: plugin.rootDir,
			workspaceDir: plugin.workspaceDir,
			channels: toSortedUniqueStrings(plugin.channels),
			providers: toSortedUniqueStrings(plugin.providers),
			cliBackends: toSortedUniqueStrings(plugin.cliBackends),
			hooks: toSortedUniqueStrings(plugin.hooks),
			skills: toSortedUniqueStrings(plugin.skills)
		})).toSorted((left, right) => left.id.localeCompare(right.id))
	};
}
function buildSkillsCapture(skillsSnapshot, redaction) {
	if (!skillsSnapshot) return;
	const filteredResolvedSkills = skillsSnapshot.resolvedSkills?.filter((skill) => typeof skill.name === "string" && skill.name.length > 0) ?? [];
	const entries = filteredResolvedSkills.length > 0 ? filteredResolvedSkills.map((skill) => ({
		id: skill.name,
		name: skill.name,
		description: skill.description,
		filePath: redactPathForSupport(skill.filePath, redaction),
		baseDir: redactPathForSupport(skill.baseDir, redaction),
		source: skill.source,
		sourceInfo: sanitizeSupportSnapshotValue(skill.sourceInfo, redaction),
		disableModelInvocation: skill.disableModelInvocation,
		available: true
	})) : skillsSnapshot.skills.filter((skill) => typeof skill.name === "string" && skill.name.length > 0).map((skill) => ({
		id: skill.name,
		name: skill.name,
		primaryEnv: skill.primaryEnv,
		requiredEnv: skill.requiredEnv,
		available: true
	}));
	return {
		snapshotVersion: skillsSnapshot.version,
		skillFilter: toSortedUniqueStrings(skillsSnapshot.skillFilter),
		entries: entries.toSorted((left, right) => (left.name ?? "").localeCompare(right.name ?? ""))
	};
}
function buildTrajectoryRunMetadata(params) {
	const env = params.env ?? process.env;
	const redaction = {
		env,
		stateDir: resolveStateDir(env)
	};
	const os = resolveOsSummary();
	const plugins = buildPluginsFromActiveRegistry() ?? buildPluginsFromManifest({
		config: params.config,
		pluginMetadataSnapshot: params.pluginMetadataSnapshot,
		workspaceDir: params.workspaceDir,
		env
	});
	return {
		capturedAt: (/* @__PURE__ */ new Date()).toISOString(),
		harness: {
			type: "openclaw",
			name: "OpenClaw",
			version: VERSION,
			gitSha: resolveCommitHash({
				cwd: params.workspaceDir,
				env,
				moduleUrl: import.meta.url
			}) ?? void 0,
			os,
			runtime: { node: process.version },
			invocation: sanitizeSupportSnapshotValue([...process.argv], redaction, "programArguments"),
			entrypoint: process.argv[1] ? redactPathForSupport(process.argv[1], redaction) : void 0,
			workspaceDir: redactPathForSupport(params.workspaceDir, redaction),
			sessionFile: params.sessionFile ? redactPathForSupport(params.sessionFile, redaction) : void 0
		},
		model: {
			provider: params.provider,
			name: params.modelId,
			api: params.modelApi,
			fastMode: params.fastMode ?? false,
			thinkLevel: params.thinkLevel,
			reasoningLevel: params.reasoningLevel ?? "off"
		},
		config: {
			redacted: params.config ? redactConfigObject(params.config) : void 0,
			runtime: {
				timeoutMs: params.timeoutMs,
				trigger: params.trigger,
				disableTools: params.disableTools ?? false,
				toolResultFormat: params.toolResultFormat,
				toolsAllow: toSortedUniqueStrings(params.toolsAllow)
			}
		},
		plugins,
		skills: buildSkillsCapture(params.skillsSnapshot, redaction),
		prompting: {
			skillsPrompt: params.skillsSnapshot?.prompt,
			userPromptPrefixText: params.userPromptPrefixText,
			systemPromptReport: params.systemPromptReport
		},
		redaction: {
			config: {
				mode: "redactConfigObject",
				secretsMasked: true
			},
			payloads: {
				mode: "sanitizeDiagnosticPayload",
				credentialsRemoved: true,
				imageDataRedacted: true
			},
			harness: {
				mode: "diagnostic-support-redaction",
				programArgumentsRedacted: true,
				localPathsRedacted: true
			}
		},
		metadata: {
			sessionKey: params.sessionKey,
			agentId: params.agentId,
			messageProvider: params.messageProvider,
			messageChannel: params.messageChannel
		}
	};
}
function buildTrajectoryArtifacts(params) {
	const { status, ...artifacts } = params;
	return {
		capturedAt: (/* @__PURE__ */ new Date()).toISOString(),
		finalStatus: status,
		...artifacts
	};
}
//#endregion
//#region src/agents/embedded-agent-runner/run/attempt-nested-tool-activity.ts
function createAttemptNestedToolActivityState() {
	return {
		scopeId: randomUUID(),
		successfulToolNames: /* @__PURE__ */ new Set()
	};
}
/** Rehydrate accepted hook evidence only at delivery; SQLite owns the payload between calls. */
async function readAttemptNestedToolActivity(manager, state) {
	const accepted = state.accepted;
	if (!accepted) return [];
	const { firstEntryId, lastEntryId, sessionId, target } = accepted;
	const assertCurrent = () => {
		if (manager.getSessionId() !== sessionId || !sameSessionTranscriptTargetBinding(target, manager.getSessionTarget())) throw new Error("Nested tool activity belongs to a replaced session");
	};
	assertCurrent();
	const hydration = target && prepareSessionTranscriptHydration(target);
	const entries = hydration ? (await hydration.readMaintenance({
		operation: "nested-activity",
		scopeId: state.scopeId,
		firstEntryId,
		lastEntryId
	})).events ?? [] : manager.getEntries();
	hydration?.assertCurrent();
	assertCurrent();
	const first = entries.findIndex((entry) => asOptionalRecord(entry)?.id === firstEntryId);
	const last = entries.findIndex((entry) => asOptionalRecord(entry)?.id === lastEntryId);
	if (first < 0 || last < first) throw new Error("Accepted nested tool activity is no longer available");
	return entries.slice(first, last + 1).flatMap((entry) => {
		const message = asOptionalRecord(asOptionalRecord(entry)?.message);
		if (message?.customType !== "openclaw.nested-tool.v1" || asOptionalRecord(message.details)?.scopeId !== state.scopeId) return [];
		const activity = readNestedToolActivity(message);
		if (!activity) throw new Error("Accepted nested tool activity is no longer valid");
		return [activity];
	});
}
//#endregion
//#region src/agents/embedded-agent-runner/run/attempt-terminal-anchor.ts
/**
* Cache-TTL bookkeeping advances the leaf without adding a message anchor.
* Other entry kinds retain their terminal semantics.
*/
function resolveTerminalMessageEntryId(sessionManager) {
	let entryId = sessionManager.getLeafId();
	while (entryId) {
		const entry = sessionManager.getEntry(entryId);
		if (!entry || entry.type !== "custom" || entry.customType !== "openclaw.cache-ttl") return entry ? entryId : null;
		entryId = entry.parentId;
	}
	return null;
}
//#endregion
//#region src/agents/embedded-agent-runner/run/attempt-trajectory-status.ts
/** Terminal error marker for runs that produced no user-visible delivery or durable progress. */
const NON_DELIVERABLE_TERMINAL_TURN_REASON = "non_deliverable_terminal_turn";
/**
* Chooses assistant text that can safely count as terminal output. Provider error
* and abort stop reasons cannot fall back to the raw last visible text because
* that text may describe an interrupted generation rather than a completed reply.
*/
function resolveTerminalAssistantTexts(params) {
	if (hasAnyNonEmptyString(params.assistantTexts)) return params.assistantTexts;
	if (params.lastAssistantStopReason === "error" || params.lastAssistantStopReason === "aborted") return params.assistantTexts;
	const fallbackText = params.lastAssistantVisibleText?.trim();
	return fallbackText ? [fallbackText] : params.assistantTexts;
}
/**
* Classifies the final attempt trajectory from visible output, durable side
* effects, and interruption state. Empty terminal turns are errors unless a
* caller proves a silent success, message delivery, spawned session, async task,
* or other durable progress.
*/
function resolveAttemptTrajectoryTerminal(params) {
	if (params.interrupted || params.failed) return { status: params.interrupted ? "interrupted" : "error" };
	return params.silentExpected === true || params.emptyAssistantReplyIsSilent === true || params.didSendDeterministicApprovalPrompt || hasCommittedMessagingToolDeliveryEvidence(params) || hasAcceptedSessionSpawn(params.acceptedSessionSpawns) || params.heartbeatToolResponse !== void 0 || (params.clientToolCalls?.length ?? 0) > 0 || params.yieldDetected === true || hasAsyncActivity(params.toolMetas) || params.lastAssistantStopReason !== "toolUse" && (params.hasTerminalOutput || hasAnyNonEmptyString(params.assistantTexts) || params.synthesizedPayloadCount > 0 || params.lastAssistantStopReason !== "length" && params.successfulCronAdds > 0) ? { status: "success" } : {
		status: "error",
		terminalError: NON_DELIVERABLE_TERMINAL_TURN_REASON
	};
}
//#endregion
//#region src/agents/embedded-agent-runner/run/terminal-outcome.ts
/** Projects private attempt metadata into the canonical agent terminal outcome. */
function resolveEmbeddedRunAttemptTerminalOutcome(params) {
	return buildAgentRunTerminalOutcomeFromAttempt({
		terminal: params.attempt.terminal,
		promptTimeoutOutcome: params.attempt.promptTimeoutOutcome,
		assistant: params.assistant && isProviderRefusalAssistantError(params.assistant) ? {
			...params.assistant,
			errorMessage: formatUserFacingAssistantErrorText(params.assistant)
		} : params.assistant,
		abortSignal: params.abortSignal
	});
}
/** Owner-recorded timeout failure cannot be inferred away from partial or completed-looking output. */
function isEmbeddedRunTimeoutFinal(attempt) {
	return projectAgentRunAttemptTerminal(attempt.terminal).timedOut && (attempt.promptTimeoutOutcome?.replayInvalid === true || attempt.codexAppServerFailure?.kind === "turn_completion_idle_timeout");
}
function isEmbeddedRunTerminalTimeout(outcome) {
	return classifyAgentRunTerminalOutcome(outcome) === "timeout";
}
function isEmbeddedRunTerminalAbort(outcome) {
	return classifyAgentRunTerminalOutcome(outcome) === "cancellation";
}
function isEmbeddedRunTerminalInterrupted(outcome) {
	return isEmbeddedRunTerminalTimeout(outcome) || isEmbeddedRunTerminalAbort(outcome);
}
/** Captures signal ownership with the outcome before async recovery can change the signal. */
function resolveEmbeddedRunAttemptTerminalState(params) {
	const outcome = resolveEmbeddedRunAttemptTerminalOutcome(params);
	return {
		outcome,
		signalOwnedInterruption: isEmbeddedRunTerminalInterrupted(outcome) && params.abortSignal?.aborted === true
	};
}
//#endregion
//#region src/agents/embedded-agent-runner/run/attempt-finalize.ts
function finalizeEmbeddedAttempt(params) {
	const { result, trajectoryRecorder } = params;
	if (!trajectoryRecorder) return result;
	const terminalState = projectAgentRunAttemptTerminal(result.terminal);
	const assistant = terminalState.cleanupYieldAborted ? result.lastAssistant : result.currentAttemptCompletedAssistant ?? result.currentAttemptAssistant;
	const completionOutcome = resolveEmbeddedRunAttemptTerminalOutcome({
		attempt: result,
		assistant
	});
	const stopReason = terminalState.cleanupYieldAborted && completionOutcome.status === "ok" ? "end_turn" : completionOutcome.stopReason;
	const toolEvidence = () => ({
		toolMetas: result.toolMetas,
		didSendViaMessagingTool: result.didSendViaMessagingTool,
		messagingToolSentTexts: result.messagingToolSentTexts,
		messagingToolSentMediaUrls: result.messagingToolSentMediaUrls,
		messagingToolSentTargets: result.messagingToolSentTargets,
		successfulCronAdds: result.successfulCronAdds ?? 0,
		lastToolError: result.lastToolError
	});
	const terminal = resolveAttemptTrajectoryTerminal({
		...toolEvidence(),
		failed: completionOutcome.status === "error",
		interrupted: isEmbeddedRunTerminalInterrupted(completionOutcome),
		assistantTexts: resolveTerminalAssistantTexts({
			assistantTexts: result.assistantTexts,
			lastAssistantStopReason: stopReason,
			lastAssistantVisibleText: resolveFinalAssistantVisibleText(assistant)
		}),
		didSendDeterministicApprovalPrompt: result.didSendDeterministicApprovalPrompt === true,
		synthesizedPayloadCount: params.synthesizedPayloadCount,
		acceptedSessionSpawns: result.acceptedSessionSpawns,
		heartbeatToolResponse: result.heartbeatToolResponse,
		clientToolCalls: result.clientToolCalls,
		yieldDetected: result.yieldDetected,
		silentExpected: params.silentExpected,
		emptyAssistantReplyIsSilent: params.emptyAssistantReplyIsSilent,
		lastAssistantStopReason: stopReason,
		hasTerminalOutput: params.hasTerminalOutput
	});
	const promptError = terminalState.promptError ? formatErrorMessage(terminalState.promptError) : void 0;
	const terminalFields = {
		aborted: terminalState.aborted,
		externalAbort: terminalState.externalAbort,
		timedOut: terminalState.timedOut,
		idleTimedOut: terminalState.idleTimedOut,
		timedOutDuringCompaction: terminalState.timedOutDuringCompaction,
		timedOutDuringToolExecution: terminalState.timedOutDuringToolExecution,
		timedOutByRunBudget: terminalState.timedOutByRunBudget,
		promptError
	};
	const modelFields = {
		...terminalFields,
		promptErrorSource: terminalState.promptErrorSource,
		terminalError: terminal.terminalError,
		usage: result.attemptUsage,
		promptCache: result.promptCache,
		compactionCount: result.compactionCount,
		assistantTexts: result.assistantTexts,
		stopReason,
		finalPromptText: result.finalPromptText
	};
	trajectoryRecorder.recordEvent("model.completed", {
		...modelFields,
		messagesSnapshot: result.messagesSnapshot
	});
	trajectoryRecorder.recordEvent("trace.artifacts", buildTrajectoryArtifacts({
		status: terminal.status,
		...modelFields,
		compactionCount: result.compactionCount ?? 0,
		itemLifecycle: result.itemLifecycle,
		...toolEvidence()
	}));
	const sessionEndData = {
		status: terminal.status,
		...terminalFields,
		terminalError: terminal.terminalError,
		stopReason
	};
	if (params.deferredLifecycleOwner) params.deferredLifecycleOwner.recordSessionEnd(sessionEndData);
	else trajectoryRecorder.recordEvent("session.ended", sessionEndData);
	return result;
}
async function completeEmbeddedAttemptAfterTurn(input, settled, prompt) {
	const { attempt, activeContextEngine, agentDir, resolveActiveContextEnginePluginId, state: executionState } = input;
	const { withOwnedTranscriptWrite } = input.sessionLock;
	const { effectiveWorkspace, sessionAgentId } = input.setup;
	const { sessionRuntime, bootstrap, bundleTools, toolBase } = input.prepared;
	const { sessionManager, cacheTrace, anthropicPayloadLogger } = sessionRuntime;
	const { diagnosticTrace } = input.diagnostics;
	const { shouldRecordCompletedBootstrapTurn } = bootstrap;
	const skillWorkshopAvailable = bundleTools.uncompactedEffectiveTools.some((tool) => tool.name === "skill_workshop");
	const { hookRunner } = sessionRuntime.agentSession;
	const { promptStartedAt, yieldAborted, transcriptLeafId } = prompt;
	const { sessionIdUsed, promptError, messagesSnapshot } = settled;
	const { nestedToolActivityState } = toolBase;
	const { prePromptMessageCount } = sessionRuntime.state;
	const contextEngineAfterTurnCheckpoint = sessionRuntime.contextGuards.getAfterTurnCheckpoint();
	const { lastCallUsage, promptCache, compactionOccurredThisAttempt } = settled;
	const { beforeAgentFinalizeRevisionReason } = prompt;
	if (activeContextEngine && !beforeAgentFinalizeRevisionReason) {
		const lifecycleState = projectAgentRunAttemptTerminal(executionState.terminal);
		const terminalEntryId = attempt.onContextEngineTurnCandidate ? resolveTerminalMessageEntryId(sessionManager) : void 0;
		await finalizeHarnessContextEngineTurn({
			...attempt,
			abortSignal: input.runAbortController.signal,
			contextEngine: activeContextEngine,
			promptError: Boolean(promptError),
			aborted: lifecycleState.aborted,
			yieldAborted,
			sessionIdUsed,
			messagesSnapshot,
			prePromptMessageCount: contextEngineAfterTurnCheckpoint ?? prePromptMessageCount,
			tokenBudget: attempt.contextTokenBudget,
			turnCandidate: attempt.onContextEngineTurnCandidate ? {
				admission: attempt.userTurnTranscriptRecorder?.getAdmissionReceipt(),
				terminalEntryId,
				[completedTurnMessageAnchor]: captureCompletedTurnMessageAnchor(sessionManager, terminalEntryId),
				record: attempt.onContextEngineTurnCandidate
			} : void 0,
			runtimeContext: attempt.onContextEngineTurnCandidate ? void 0 : buildAfterTurnRuntimeContextFromUsage({
				attempt,
				workspaceDir: effectiveWorkspace,
				agentDir,
				tokenBudget: attempt.contextTokenBudget,
				lastCallUsage,
				promptCache,
				activeAgentId: sessionAgentId,
				contextEnginePluginId: resolveActiveContextEnginePluginId()
			}),
			contextEngineHostSupport: OPENCLAW_EMBEDDED_CONTEXT_ENGINE_HOST,
			providerId: attempt.provider,
			runMaintenance: async (contextParams) => await runContextEngineMaintenance({
				...contextParams,
				contextEngine: activeContextEngine,
				sessionManager,
				withSessionManagerRewriteLock: withOwnedTranscriptWrite,
				config: attempt.config,
				agentId: sessionAgentId,
				contextEngineAgentId: attempt.contextEngineAgentId
			}),
			sessionManager,
			warn: (message) => log$7.warn(message),
			isHeartbeat: isHeartbeatLifecycleRunKind(attempt.bootstrapContextRunKind)
		});
	}
	const shouldPersistBootstrapCompletion = () => {
		const lifecycleState = projectAgentRunAttemptTerminal(executionState.terminal);
		const assistant = settled.currentAttemptCompletedAssistant ?? settled.currentAttemptAssistant;
		return shouldRecordCompletedBootstrapTurn && !promptError && assistant?.stopReason !== "error" && !lifecycleState.aborted && !lifecycleState.timedOutDuringCompaction && !compactionOccurredThisAttempt;
	};
	if (!beforeAgentFinalizeRevisionReason && shouldPersistBootstrapCompletion()) await withOwnedTranscriptWrite(() => withSessionManagerAppend(sessionManager, async () => {
		if (!shouldPersistBootstrapCompletion()) return;
		try {
			await sessionManager.appendCustomEntryAsync(FULL_BOOTSTRAP_COMPLETED_CUSTOM_TYPE, {
				timestamp: Date.now(),
				runId: attempt.runId,
				sessionId: attempt.sessionId
			});
		} catch (entryErr) {
			log$7.warn(`failed to persist bootstrap completion entry: ${String(entryErr)}`);
		}
	}));
	const lifecycleAfterTurn = projectAgentRunAttemptTerminal(executionState.terminal);
	cacheTrace?.recordStage("session:after", {
		messages: messagesSnapshot,
		note: lifecycleAfterTurn.timedOutDuringCompaction ? "compaction timeout" : promptError ? "prompt error" : void 0
	});
	anthropicPayloadLogger?.recordUsage(messagesSnapshot, promptError);
	if (attempt.operation !== "settled-tool-finalization" && attempt.sessionPersistence !== "detached" && !beforeAgentFinalizeRevisionReason) {
		const lifecycleForAgentEnd = projectAgentRunAttemptTerminal(executionState.terminal);
		const agentEndError = promptError && !lifecycleForAgentEnd.aborted ? formatErrorMessage(promptError) : void 0;
		const sourceTarget = sessionManager.getSessionTarget();
		let terminalEntry;
		let entry = sessionManager.getLeafEntry();
		while (entry && entry.id !== transcriptLeafId) {
			if (!terminalEntry && entry.type === "message") terminalEntry = entry;
			entry = entry.parentId ? sessionManager.getEntry(entry.parentId) : void 0;
		}
		const reachedPromptBoundary = transcriptLeafId === null || entry?.id === transcriptLeafId;
		await runAgentEndSideEffectsAsync({
			[completedTurnMessageAnchor]: sourceTarget && terminalEntry && reachedPromptBoundary ? captureCompletedTurnMessageAnchor(sessionManager, terminalEntry.id) : void 0,
			skillExperienceReviewSource: sourceTarget && terminalEntry && reachedPromptBoundary ? {
				...sourceTarget,
				entryId: terminalEntry.id
			} : void 0,
			event: bindAgentHarnessHookMessages({
				messages: messagesSnapshot,
				success: !lifecycleForAgentEnd.aborted && !promptError,
				error: agentEndError,
				durationMs: Date.now() - promptStartedAt
			}, async () => projectNestedToolActivityForHooks(messagesSnapshot, await readAttemptNestedToolActivity(sessionManager, nestedToolActivityState))),
			ctx: buildEmbeddedAgentEndContext({
				run: attempt,
				agentId: sessionAgentId,
				agentDir,
				trace: freezeDiagnosticTraceContext(diagnosticTrace),
				skillWorkshopAvailable,
				compacted: compactionOccurredThisAttempt
			}),
			hookRunner
		});
	}
}
function createAttemptAbortError(signal) {
	if (signal.reason instanceof Error) return signal.reason;
	return createAbortError$1("request aborted", { cause: signal.reason });
}
function createTimeoutAbortReason() {
	return Object.assign(/* @__PURE__ */ new Error("request timed out"), { name: "TimeoutError" });
}
function recordAttemptAbort(state, signal, runId, isTimeout) {
	state.terminal = mergeAgentRunAttemptTerminal(state.terminal, {
		kind: "aborted",
		source: signal.reason === SESSIONS_YIELD_ABORT_REASON ? "yield_cleanup" : "runtime"
	});
	if (isTimeout) {
		state.terminal = mergeAgentRunAttemptTerminal(state.terminal, {
			kind: "timeout",
			phase: "prompt",
			source: "runtime"
		});
		if (!projectAgentRunAttemptTerminal(state.terminal).timedOutDuringCompaction && countActiveToolExecutions(runId) > 0) state.terminal = mergeAgentRunAttemptTerminal(state.terminal, {
			kind: "timeout",
			phase: "tool_execution",
			source: "observation"
		});
	}
}
/** Owns the external AbortSignal listener and its handoff to the live session. */
function createEmbeddedAttemptExternalAbortController(input) {
	let abortActiveSession;
	let abortRun;
	let isCompactionPendingOrRetrying;
	let isCompactionInFlight;
	let removeListener;
	let abortHandled = false;
	const onAbort = () => {
		const signal = input.abortSignal;
		if (!signal || abortHandled) return;
		abortHandled = true;
		input.state.terminal = mergeAgentRunAttemptTerminal(input.state.terminal, {
			kind: "aborted",
			source: "external"
		});
		const reason = signal.reason;
		const isTimeout = reason ? isSignalTimeoutReason(reason) : false;
		if (shouldFlagCompactionTimeout({
			isTimeout,
			isCompactionPendingOrRetrying: isCompactionPendingOrRetrying?.() ?? false,
			isCompactionInFlight: isCompactionInFlight?.() ?? false
		})) input.state.terminal = mergeAgentRunAttemptTerminal(input.state.terminal, {
			kind: "timeout",
			phase: "compaction",
			source: "observation"
		});
		if (abortRun) {
			abortRun(isTimeout, reason);
			return;
		}
		recordAttemptAbort(input.state, input.runAbortController.signal, input.runId, isTimeout);
		input.state.terminal = mergeAgentRunAttemptTerminal(input.state.terminal, {
			kind: "failed",
			source: "prompt",
			error: createAttemptAbortError(signal)
		});
		if (!input.runAbortController.signal.aborted) input.runAbortController.abort(isTimeout ? reason ?? createTimeoutAbortReason() : reason);
		abortActiveSession?.(input.runAbortController.signal.reason);
	};
	const readFiredAbortError = () => {
		const signal = input.abortSignal;
		if (!signal?.aborted) return;
		onAbort();
		return createAttemptAbortError(signal);
	};
	return {
		arm: () => {
			const signal = input.abortSignal;
			if (!signal || removeListener) return;
			if (signal.aborted) {
				onAbort();
				return;
			}
			signal.addEventListener("abort", onAbort, { once: true });
			removeListener = () => {
				signal.removeEventListener("abort", onAbort);
				removeListener = void 0;
			};
		},
		dispose: () => {
			removeListener?.();
			abortActiveSession = void 0;
			abortRun = void 0;
			isCompactionPendingOrRetrying = void 0;
			isCompactionInFlight = void 0;
		},
		setActiveSessionAbort: (abort) => {
			abortActiveSession = abort;
		},
		setCompactionState: (state) => {
			isCompactionPendingOrRetrying = state.isPendingOrRetrying;
			isCompactionInFlight = state.isInFlight;
		},
		setRunAbort: (abort) => {
			abortRun = abort;
		},
		throwIfFired: () => {
			const abortError = readFiredAbortError();
			if (abortError) throw abortError;
		},
		throwIfFiredAfterPrepCleanup: async () => {
			const abortError = readFiredAbortError();
			if (!abortError) return;
			await input.cleanupAfterEarlyAbort();
			throw abortError;
		}
	};
}
/** Interrupts an owned idle request without cancelling the enclosing reply or lane. */
function createEmbeddedAttemptIdleInterruption(input) {
	return (error) => {
		if (input.runAbortController.signal.aborted) return false;
		input.state.terminal = mergeAgentRunAttemptTerminal(input.state.terminal, {
			kind: "timeout",
			phase: input.activeSession.isCompacting ? "compaction" : "prompt",
			source: "idle"
		});
		input.abortRun(true, error);
		return true;
	};
}
/** Builds the live-session abort handler shared by timeouts and explicit cancellation. */
function createEmbeddedAttemptRunAbort(input) {
	let abortAccepted = false;
	return (isTimeout = false, reason) => {
		if (abortAccepted) return;
		abortAccepted = true;
		recordAttemptAbort(input.state, input.runAbortController.signal, input.attempt.runId, isTimeout);
		if (isTimeout) {
			const timeoutReason = reason instanceof Error ? reason : createTimeoutAbortReason();
			input.attempt.onAttemptTimeout?.(timeoutReason);
			input.runAbortController.abort(timeoutReason);
		} else input.runAbortController.abort(reason);
		if (input.activeSession.isCompacting) try {
			input.activeSession.abortCompaction();
		} catch (error) {
			if (!input.isProbeSession) input.log.warn(`embedded run abortCompaction failed: runId=${input.attempt.runId} sessionId=${input.attempt.sessionId} err=${String(error)}`);
		}
		input.abortActiveSession(input.runAbortController.signal.reason);
		const queueHandle = input.getQueueHandle();
		if (isTimeout && queueHandle) markActiveEmbeddedRunAbandoned({
			sessionId: input.attempt.sessionId,
			handle: queueHandle,
			sessionKey: input.attempt.sessionKey,
			sessionFile: input.attempt.sessionFile,
			reason: "timeout"
		});
	};
}
//#endregion
//#region src/auto-reply/handoff-summarizer.ts
/**
* Builds the recovery briefing injected as the first user-side turn after a
* model failover. The user role is used (not assistant) so the new model
* treats the content as input rather than its own prior output.
*/
function buildHierarchyReinforcementMessage(snapshot) {
	const subagentReport = snapshot.activeSubagents.map((s) => `- Subagent ${s.sessionId} (${s.role ?? "leaf"}): ${s.lastStatus ?? "running"}`).join("\n");
	const hasSubagents = snapshot.activeSubagents.length > 0;
	return {
		role: "user",
		content: [
			"[SYSTEM HANDOFF] The previous model is no longer active and a fallback model is now active.",
			...hasSubagents ? [
				"You are the new LEADER (Orchestrator). Do not perform tasks already delegated to subordinates.",
				"",
				"ACTIVE SUBORDINATE UNITS:",
				subagentReport
			] : ["Review the current state below and continue the conversation from where the previous model left off."],
			"",
			"CURRENT STATE SUMMARY:",
			snapshot.summary,
			...hasSubagents ? [
				"",
				"INSTRUCTIONS:",
				"1. Review the state and subordinate reports.",
				"2. Provide strategic guidance and commands to subordinates.",
				"3. Do not repeat work already performed by subordinates."
			] : []
		].join("\n"),
		timestamp: Date.now()
	};
}
//#endregion
//#region src/agents/embedded-agent-runner/history.ts
const THREAD_SUFFIX_REGEX = /^(.*)(?::(?:thread|topic):\d+)$/i;
const SESSION_HISTORY_PRELUDE = Symbol.for("openclaw.sessionHistoryPrelude");
function stripThreadSuffix(value) {
	return value.match(THREAD_SUFFIX_REGEX)?.[1] ?? value;
}
/**
* Leading non-conversation messages (e.g. compactionSummary, branchSummary)
* placed at index 0 by buildSessionContext are always preserved, since they
* carry summarized pre-compaction context that history limiting must not drop.
*/
function limitHistoryTurns(messages, limit) {
	if (!limit || limit <= 0 || messages.length === 0) return messages;
	const conversationStart = messages.findIndex((message) => !message?.[SESSION_HISTORY_PRELUDE] && (message?.role === "user" || message?.role === "assistant"));
	if (conversationStart < 0) return messages;
	let userCount = 0;
	for (let i = conversationStart; i < messages.length; i++) if (messages[i]?.role === "user") userCount++;
	const targetUserTurns = Math.floor(limit);
	const maxUserTurns = Math.ceil(targetUserTurns * 1.5);
	if (userCount <= maxUserTurns) return messages;
	const evictionBatchSize = maxUserTurns - targetUserTurns + 1;
	let turnsRemaining = targetUserTurns + (userCount - targetUserTurns) % evictionBatchSize;
	const firstKeptIndex = messages.findLastIndex((message, index) => index >= conversationStart && message?.role === "user" && --turnsRemaining === 0);
	return [...messages.slice(0, conversationStart), ...messages.slice(firstKeptIndex < 0 ? messages.length : firstKeptIndex)];
}
function getHistoryLimitFromSessionKey(sessionKey, config, route) {
	if (!sessionKey || !config) return;
	const parts = sessionKey.split(":");
	const providerParts = parts.length >= 3 && parts[0] === "agent" ? parts.slice(2) : parts;
	const provider = normalizeProviderId(providerParts[0] ?? "");
	if (!provider) return;
	const candidates = [0, 1].flatMap((accountSegments) => {
		const kind = normalizeChatType(providerParts[1 + accountSegments]);
		const accountId = accountSegments ? providerParts[1] : void 0;
		if (!kind || route?.chatType && kind !== route.chatType || accountSegments && kind !== "direct") return [];
		return [{
			kind,
			accountId,
			userId: providerParts.slice(2 + accountSegments).join(":")
		}];
	});
	const rawPeerId = route?.peerId?.trim();
	const logicalPeerId = rawPeerId ? normalizeOptionalLowercaseString(resolveLinkedDirectPeerId({
		identityLinks: config.session?.identityLinks,
		channel: provider,
		peerId: rawPeerId
	}) ?? rawPeerId) : void 0;
	const matching = logicalPeerId ? candidates.filter((candidate) => candidate.kind !== "direct" || candidate.userId === logicalPeerId || stripThreadSuffix(candidate.userId) === logicalPeerId) : candidates;
	const resolved = matching.length === 1 ? matching[0] : void 0;
	const kind = resolved?.kind ?? (candidates.every((candidate) => candidate.kind === candidates[0]?.kind) ? candidates[0]?.kind : void 0);
	const userId = resolved && (logicalPeerId ?? stripThreadSuffix(resolved.userId));
	const routedAccountId = route?.accountId ?? (candidates.length === 1 ? candidates[0]?.accountId : resolved?.accountId);
	const providerConfig = asOptionalRecord(Object.entries(config.channels ?? {}).find(([channel]) => normalizeProviderId(channel) === provider)?.[1]);
	if (!providerConfig) return;
	const trimmedAccountId = routedAccountId?.trim();
	const accountConfig = trimmedAccountId ? resolveChannelAccountEntry(providerConfig.accounts, normalizeAccountId(trimmedAccountId), provider, normalizeAccountId) : void 0;
	if (kind === "direct") {
		const perDmLimit = userId ? (accountConfig?.dms ?? providerConfig.dms)?.[userId]?.historyLimit : void 0;
		return perDmLimit !== void 0 ? perDmLimit : accountConfig?.dmHistoryLimit ?? providerConfig.dmHistoryLimit;
	}
	return kind === "channel" || kind === "group" ? accountConfig?.historyLimit ?? providerConfig.historyLimit : void 0;
}
//#endregion
//#region src/agents/embedded-agent-runner/run/attempt-history-prepare.ts
async function prepareEmbeddedAttemptHistory(input, assertActive) {
	const { attempt, activeContextEngine, isRawModelRun } = input;
	const { agentSession: { activeSession, settingsManager, setActiveSessionSystemPrompt }, boundary: { orphanRepair }, cacheTrace, isOpenAIResponsesApi, sessionManager, transcriptPolicy, transport: { compactionReplayEnabled } } = input.prepared.sessionRuntime;
	const { capabilityToolNames, replayAllowedToolNames } = input.prepared.toolCatalog.toolSearchRunPlan;
	const { effectiveWorkspace, sessionAgentId } = input.setup;
	const sandboxed = input.setup.sandbox?.enabled === true;
	const isSettledTurnFinalization = attempt.operation === "settled-tool-finalization";
	let systemPromptText = input.prepared.sessionRuntime.state.systemPromptText;
	const setSystemPrompt = (nextSystemPrompt) => {
		systemPromptText = nextSystemPrompt;
		setActiveSessionSystemPrompt(nextSystemPrompt);
	};
	if (isRawModelRun) {
		activeSession.agent.reset();
		setSystemPrompt("");
		cacheTrace?.recordStage("session:raw-model-run", {
			messages: activeSession.messages,
			system: systemPromptText
		});
	} else {
		const replayContext = () => ({
			modelApi: attempt.model.api,
			modelId: attempt.modelId,
			provider: attempt.provider,
			config: attempt.config,
			workspaceDir: effectiveWorkspace,
			env: process.env,
			model: attempt.model,
			sessionId: attempt.sessionId,
			policy: transcriptPolicy
		});
		const prior = await sanitizeSessionHistory({
			...replayContext(),
			messages: bindToolResultPromptProjectionKeys(activeSession.messages, input.prepared.sessionRuntime.toolResultPromptProjectionState),
			allowedToolNames: replayAllowedToolNames,
			sessionManager
		});
		input.setup.prepStages.mark("history-sanitize");
		cacheTrace?.recordStage("session:sanitized", { messages: prior });
		const validated = await validateReplayTurns({
			...replayContext(),
			messages: prior
		});
		input.setup.prepStages.mark("history-validation");
		if (attempt.sessionKey && attempt.sessionPersistence !== "detached" && !isSettledTurnFinalization) {
			const storePath = resolveSessionStorePathCore(attempt.config?.session?.store, { agentId: sessionAgentId });
			const sessionEntry = await loadAttemptSessionEntryAfterQuotaMaintenance({
				agentId: sessionAgentId,
				storePath,
				sessionKey: attempt.sessionKey
			}, assertActive);
			assertActive();
			const suspension = sessionEntry?.quotaSuspension;
			if (sessionEntry && suspension?.state === "resuming") {
				const entries = await readSessionEntrySummariesInWorker({
					agentId: sessionAgentId,
					storePath
				});
				assertActive();
				const subagents = entries.flatMap(({ entry }) => entry.spawnedBy === sessionEntry.sessionId ? [{
					sessionId: entry.sessionId,
					role: entry.subagentRole,
					lastStatus: entry.status
				}] : []);
				validated.push(buildHierarchyReinforcementMessage({
					summary: suspension.summary ?? "No recovery briefing was captured.",
					activeSubagents: subagents
				}));
				await patchSessionEntryCore({
					agentId: sessionAgentId,
					storePath,
					sessionKey: attempt.sessionKey
				}, (entry) => {
					if (entry.sessionId !== sessionEntry.sessionId || entry.quotaSuspension?.state !== "resuming") return null;
					return { quotaSuspension: {
						...entry.quotaSuspension,
						state: "active"
					} };
				}, {
					skipMaintenance: true,
					takeCacheOwnership: true,
					...sessionEntryCommitGuardOptions(assertActive)
				});
				assertActive();
			}
		}
		let limited = validated;
		if (!isSettledTurnFinalization) {
			const heartbeatSummary = attempt.config && sessionAgentId ? resolveHeartbeatSummaryForAgent(attempt.config, sessionAgentId) : void 0;
			const heartbeatFiltered = filterHeartbeatTranscriptArtifacts(validated, heartbeatSummary?.ackMaxChars, heartbeatSummary?.prompt);
			limited = preserveCompactionReplayWindow(heartbeatFiltered, limitHistoryTurns(heartbeatFiltered, getHistoryLimitFromSessionKey(attempt.sessionKey, attempt.config, {
				accountId: attempt.agentAccountId,
				peerId: attempt.conversationRoutePeerId,
				chatType: attempt.chatType
			})), attempt.model, {
				sessionId: attempt.sessionId,
				authProfileId: attempt.runtimePlan?.auth.forwardedAuthProfileId,
				enabled: compactionReplayEnabled
			});
		}
		input.setup.prepStages.mark("history-window");
		cacheTrace?.recordStage("session:limited", { messages: limited });
		if (limited.length > 0 || prior.length > 0) activeSession.agent.state.messages = limited;
	}
	const prompt = orphanRepair?.contextEnginePrompt ?? attempt.prompt ?? "";
	const { messages, systemPrompt, ...prepared } = await prepareHarnessContextEnginePrompt({
		...attempt,
		contextEngine: activeContextEngine,
		agentId: sessionAgentId,
		appendOnlyRuntimeContext: transcriptPolicy.appendOnlyRuntimeContext,
		messages: activeSession.messages,
		availableTools: new Set(capabilityToolNames),
		citationsMode: attempt.config?.memory?.citations,
		sandboxed,
		promptBudget: {
			contextTokens: attempt.contextTokenBudget ?? attempt.model.contextWindow ?? attempt.model.maxTokens,
			reserveTokens: settingsManager.getCompactionReserveTokens(),
			systemPrompt: systemPromptText,
			prompt
		},
		contextEngineHostSupport: OPENCLAW_EMBEDDED_CONTEXT_ENGINE_HOST,
		providerId: attempt.provider,
		transcriptReadFence: attempt.userTurnTranscriptRecorder?.getAdmissionReceipt(),
		...attempt.prompt !== void 0 ? { prompt } : {},
		repairToolUseResultPairing: transcriptPolicy.repairToolUseResultPairing,
		isOpenAIResponsesApi,
		warn: (message) => log$7.warn(message)
	});
	input.setup.prepStages.mark("context-engine");
	activeSession.agent.state.messages = messages;
	if (systemPrompt !== systemPromptText) setSystemPrompt(systemPrompt);
	return prepared;
}
//#endregion
//#region src/infra/gemini-auth.ts
/** Accepts an API key or serialized OAuth credentials containing a token. */
function parseGeminiAuth(apiKey) {
	const token = apiKey.startsWith("{") ? safeParseJsonRecord(apiKey)?.token : void 0;
	return { headers: {
		...typeof token === "string" && token ? { Authorization: `Bearer ${token}` } : { "x-goog-api-key": apiKey },
		"Content-Type": "application/json"
	} };
}
//#endregion
//#region src/agents/embedded-agent-runner/google-prompt-cache.ts
const GOOGLE_PROMPT_CACHE_CUSTOM_TYPE = "openclaw.google-prompt-cache";
const GOOGLE_PROMPT_CACHE_RESPONSE_MAX_BYTES = 1048576;
const GOOGLE_PROMPT_CACHE_RETRY_BACKOFF_MS = 6e5;
const GOOGLE_PROMPT_CACHE_SHORT_REFRESH_WINDOW_MS = 3e4;
const GOOGLE_PROMPT_CACHE_LONG_REFRESH_WINDOW_MS = 3e5;
function stringifyGooglePromptCacheKeyPart(value) {
	if (typeof value === "string") return value;
	if (typeof value === "number" || typeof value === "boolean" || typeof value === "bigint") return String(value);
	return "";
}
function readLatestGooglePromptCacheEntry(sessionManager, matchKey) {
	try {
		const entries = sessionManager.getEntries();
		for (let i = entries.length - 1; i >= 0; i -= 1) {
			const entry = entries[i];
			if (entry?.type !== "custom" || entry?.customType !== GOOGLE_PROMPT_CACHE_CUSTOM_TYPE) continue;
			const data = entry.data;
			if (!data || typeof data !== "object") continue;
			const cacheData = data;
			if (stableStringify({
				provider: stringifyGooglePromptCacheKeyPart(cacheData.provider),
				modelId: stringifyGooglePromptCacheKeyPart(cacheData.modelId),
				modelApi: typeof cacheData.modelApi === "string" || cacheData.modelApi == null ? cacheData.modelApi : null,
				baseUrl: stringifyGooglePromptCacheKeyPart(cacheData.baseUrl),
				systemPromptDigest: stringifyGooglePromptCacheKeyPart(cacheData.systemPromptDigest),
				cacheConfigDigest: typeof cacheData.cacheConfigDigest === "string" ? cacheData.cacheConfigDigest : void 0
			}) === matchKey) return data;
		}
	} catch {
		return null;
	}
	return null;
}
async function appendGooglePromptCacheEntry(sessionManager, entry) {
	try {
		await sessionManager.appendCustomEntryAsync(GOOGLE_PROMPT_CACHE_CUSTOM_TYPE, entry);
	} catch (err) {
		if (err instanceof SessionTranscriptWriterClaimReboundError) throw err;
	}
}
function readFutureExpireTime(value, now) {
	const timestamp = parseDateStringTimestampMs(value);
	return typeof value === "string" && isFutureDateTimestampMs(timestamp, { nowMs: now }) ? {
		value,
		timestamp
	} : null;
}
function readGooglePromptCacheName(value) {
	if (typeof value !== "string" || !value.startsWith("cachedContents/")) return null;
	const id = value.slice(15);
	if (!id || id === "." || id === "..") return null;
	try {
		return encodeURIComponent(id) === id ? value : null;
	} catch {
		return null;
	}
}
function mapManagedGoogleToolChoice(choice) {
	if (!choice) return;
	if (typeof choice === "object" && choice.type === "function") {
		const functionName = choice.function?.name;
		return typeof functionName === "string" ? {
			mode: "ANY",
			allowedFunctionNames: [functionName]
		} : { mode: "ANY" };
	}
	switch (choice) {
		case "none": return { mode: "NONE" };
		case "any":
		case "required": return { mode: "ANY" };
		default: return { mode: "AUTO" };
	}
}
function resolveGooglePromptCacheAuthHeaders(params) {
	const sentinel = looksLikeSecretSentinel(params.apiKey);
	const apiKey = sentinel ? resolveSecretSentinel(params.apiKey) : params.apiKey;
	if (apiKey === void 0) throw new Error(`Secret sentinel ${params.apiKey} is not registered in this process; refusing Google prompt-cache auth`);
	const headers = parseGeminiAuth(apiKey).headers;
	if (!sentinel && !isSecretValueRegisteredForRedaction(params.apiKey)) return headers;
	return Object.fromEntries(Object.entries(headers).map(([name, value]) => {
		return [name, name.toLowerCase() === "authorization" || name.toLowerCase() === "x-goog-api-key" ? mintSecretSentinel(value, { label: `model-auth:${params.provider}` }) : value];
	}));
}
async function requestGooglePromptCache(params) {
	const refreshing = "cachedContent" in params;
	const url = refreshing ? `${params.baseUrl}/${params.cachedContent}?updateMask=ttl` : `${params.baseUrl}/cachedContents`;
	const headers = params.headers;
	const ttl = params.cacheRetention === "long" ? "3600s" : "300s";
	const body = JSON.stringify(refreshing ? { ttl } : {
		model: params.modelId.startsWith("models/") ? params.modelId : `models/${params.modelId}`,
		ttl,
		systemInstruction: { parts: [{ text: params.systemPrompt }] },
		...params.tools ? { tools: params.tools } : {},
		...params.toolConfig ? { toolConfig: params.toolConfig } : {}
	});
	let response;
	try {
		response = await params.fetchImpl(url, {
			method: refreshing ? "PATCH" : "POST",
			headers,
			body,
			signal: params.signal
		});
		if (!response.ok) throw new Error(`Google prompt cache request failed (${response.status})`);
		const payload = await readProviderJsonObjectResponse(response, "Google prompt cache", {
			maxBytes: GOOGLE_PROMPT_CACHE_RESPONSE_MAX_BYTES,
			onOverflow: ({ size, maxBytes }) => /* @__PURE__ */ new Error(`Google prompt cache response too large: ${size} bytes (limit: ${maxBytes} bytes)`),
			requestHeaders: headers
		});
		const expiry = readFutureExpireTime(payload.expireTime, params.now);
		const cachedContent = refreshing ? params.cachedContent : readGooglePromptCacheName(payload.name);
		if (!cachedContent || !expiry) throw new Error("Google prompt cache response is invalid");
		return {
			cachedContent,
			expireTime: expiry.value
		};
	} catch {
		params.signal?.throwIfAborted();
		return null;
	} finally {
		await cancelUnreadResponseBody(response);
	}
}
async function ensureGooglePromptCache(params) {
	const baseUrl = normalizeGoogleApiBaseUrl(params.model.baseUrl);
	const now = asDateTimestampMs(Date.now());
	if (now === void 0) return null;
	const scopeHeaders = swapSecretSentinelsForEgress({
		url: baseUrl,
		headers: params.headers
	}).headers ?? new Headers(params.headers);
	const cacheIdentity = {
		provider: params.provider,
		modelId: params.model.id,
		modelApi: params.model.api,
		baseUrl,
		systemPromptDigest: sha256Hex(params.systemPrompt),
		cacheConfigDigest: sha256Hex(stableStringify({
			tools: params.tools,
			toolConfig: params.toolConfig,
			headers: Object.fromEntries(scopeHeaders)
		}))
	};
	const latestEntry = readLatestGooglePromptCacheEntry(params.sessionManager, stableStringify(cacheIdentity));
	const entryMetadata = {
		timestamp: now,
		...cacheIdentity,
		cacheRetention: params.cacheRetention
	};
	if (latestEntry?.status === "failed" && isFutureDateTimestampMs(latestEntry.retryAfter, { nowMs: now })) return null;
	const fetchImpl = buildGuardedModelFetch(params.model);
	const requestOptions = {
		...params,
		baseUrl,
		fetchImpl,
		now
	};
	const refreshWindowMs = params.cacheRetention === "long" ? GOOGLE_PROMPT_CACHE_LONG_REFRESH_WINDOW_MS : GOOGLE_PROMPT_CACHE_SHORT_REFRESH_WINDOW_MS;
	const cachedContent = latestEntry?.status === "ready" ? readGooglePromptCacheName(latestEntry.cachedContent) : null;
	const expiry = latestEntry?.status === "ready" && cachedContent ? readFutureExpireTime(latestEntry.expireTime, now) : null;
	if (expiry && expiry.timestamp - now > refreshWindowMs) return cachedContent;
	const reusableCachedContent = expiry ? cachedContent : null;
	const result = await requestGooglePromptCache({
		...requestOptions,
		...reusableCachedContent ? { cachedContent: reusableCachedContent } : { modelId: params.model.id }
	});
	if (result) await appendGooglePromptCacheEntry(params.sessionManager, {
		status: "ready",
		...entryMetadata,
		...result
	});
	else if (!reusableCachedContent) await appendGooglePromptCacheEntry(params.sessionManager, {
		status: "failed",
		...entryMetadata,
		retryAfter: resolveExpiresAtMsFromDurationMs(GOOGLE_PROMPT_CACHE_RETRY_BACKOFF_MS, { nowMs: now }) ?? 0
	});
	return result?.cachedContent ?? reusableCachedContent;
}
async function prepareGooglePromptCacheStreamFn(params) {
	if (!params.streamFn || resolveExplicitCachedContent(params.extraParams) || !isGooglePromptCacheEligible({
		modelApi: params.model.api,
		modelId: params.modelId
	})) return;
	const resolvedRetention = resolveCacheRetention(params.extraParams, params.provider, params.model.api, params.modelId);
	if (resolvedRetention !== "short" && resolvedRetention !== "long") return;
	const apiKey = params.apiKey?.trim();
	if (!apiKey) return;
	const inner = params.streamFn;
	return async (model, context, options) => {
		const split = splitSystemPromptCacheBoundary(context.systemPrompt ?? "");
		const systemPrompt = sanitizeTransportPayloadText(stripSystemPromptCacheBoundary(split?.stablePrefix ?? ""));
		if (!split || !systemPrompt.trim()) return inner(model, context, options);
		const tools = context.tools?.length ? [{ functionDeclarations: sortPromptCacheToolsByName(context.tools).map((tool) => ({
			name: tool.name,
			description: tool.description,
			parametersJsonSchema: tool.parameters
		})) }] : void 0;
		const toolChoice = tools ? mapManagedGoogleToolChoice(options?.toolChoice) : void 0;
		const toolConfig = toolChoice ? { functionCallingConfig: toolChoice } : void 0;
		const authHeaders = resolveGooglePromptCacheAuthHeaders({
			apiKey,
			provider: params.model.provider
		});
		const callerHeaders = mergeTransportHeaders(params.model.headers, options?.headers);
		const headers = resolveProviderRequestHeaders({
			provider: params.model.provider,
			api: params.model.api,
			baseUrl: normalizeGoogleApiBaseUrl(params.model.baseUrl),
			capability: "llm",
			transport: "http",
			defaultHeaders: authHeaders,
			callerHeaders,
			precedence: "caller-wins"
		}) ?? mergeTransportHeaders(authHeaders, callerHeaders) ?? authHeaders;
		const cachedContent = await ensureGooglePromptCache({
			headers,
			tools,
			toolConfig,
			cacheRetention: resolvedRetention,
			model: params.model,
			provider: params.provider,
			sessionManager: params.sessionManager,
			signal: params.signal,
			systemPrompt
		});
		if (!cachedContent) {
			log$7.debug(`google prompt cache unavailable for ${params.provider}/${params.modelId}; continuing without cachedContent`);
			return inner(model, context, options);
		}
		return streamWithPayloadPatch(inner, model, {
			...context,
			systemPrompt: void 0,
			tools: void 0,
			messages: prependRuntimeContextForModel(context.messages, sanitizeTransportPayloadText(stripSystemPromptCacheBoundary(split.dynamicSuffix)))
		}, {
			...options,
			headers
		}, (payload) => {
			payload.cachedContent = cachedContent;
		});
	};
}
//#endregion
//#region src/agents/embedded-agent-runner/run/pre-persisted-user-turn.ts
function isInterruptedTurnEntry(entry, runId) {
	if (entry.type === "custom_message") return entry.customType === "openclaw:turn-aborted";
	if (entry.type !== "message") return false;
	const message = entry.message;
	if (message.role === "custom") return readNestedToolActivity(message)?.details.runId === runId;
	if (Reflect.get(message, "__openclaw")?.runId !== runId) return false;
	if (message.role !== "assistant") return message.role === "toolResult";
	return message.stopReason === "toolUse" || (message.stopReason === "aborted" || message.stopReason === "error") && (message.errorCode === "OPENCLAW_RESTART_ABORT" || message.stopReason === "aborted" && message.errorCode === void 0 && message.errorMessage === "agent run aborted for restart" && message.content.every((part) => part.type === "text" && part.text === ""));
}
function selectCurrentUserTurnFromCohort(params) {
	const { sessionManager, prepared, assertView } = params;
	assertView();
	const facts = prepared.kind === "bounded" ? prepared.transcript : void 0;
	if (!facts || facts.replayValidated !== "current" && !(facts.replayValidated === "initial" && params.allowInitial && !params.initialWriter?.committedFence)) throw new SessionTranscriptWriterClaimReboundError();
	const entryId = sessionManager.resolveCurrentTurnEntryId((entry) => isInterruptedTurnEntry(entry, params.runId));
	const entry = entryId ? sessionManager.getEntry(entryId) : void 0;
	if (entryId && !entry) return;
	const matchesUser = entry?.type === "message" && entry.message.role === "user" && isDeepStrictEqual(entry.message, params.message);
	const anchor = facts.anchors.find((candidate) => candidate.entryId === entryId);
	if (matchesUser && !anchor) return;
	return { current: matchesUser && anchor ? {
		entryId: anchor.entryId,
		anchor,
		version: prepared.snapshot.version,
		assertCurrent: assertView
	} : void 0 };
}
/** The receipt selects a hint; initial replay still consumes freshly hydrated persisted bytes. */
function prepareInitialPersistedUserTurnCohort(params) {
	const { message, recorder } = params;
	const hint = recorder?.getAdmissionReceipt()?.entryId;
	if (!message?.idempotencyKey || !recorder || !hint) return;
	const scope = withOwnedSessionTranscriptWriterFence(params.target);
	const owner = getOwnedSessionTranscriptReader(scope);
	if (!owner) return;
	const assertOwned = captureOwnedTranscriptWriteAssertion(scope);
	const initialWriter = getOwnedSessionTranscriptInitialWriter({ sessionTarget: scope });
	const allowInitial = Boolean(initialWriter) && !initialWriter?.committedFence;
	const selection = {
		sessionKey: scope.sessionKey,
		entryIds: [hint],
		includeMessagePresence: true,
		replayValidation: {
			expectedLifecycleRevision: scope.expectedLifecycleRevision,
			expectedWriterRunId: scope.expectedWriterRunId,
			allowInitial,
			admission: resolveSessionTranscriptReadFence(scope)
		}
	};
	let initial;
	return {
		selection,
		consume(sessionManager, prepared, assertView) {
			assertOwned();
			owner.assertCurrent();
			const selected = selectCurrentUserTurnFromCohort({
				sessionManager,
				message,
				runId: params.runId,
				prepared,
				assertView,
				allowInitial,
				initialWriter
			});
			if (selected) {
				if (selected.current) recorder.markRuntimePersisted(message, selected.current.anchor, { appended: false });
				initial = { anchor: selected.current?.anchor };
			}
		},
		readInitial: () => initial
	};
}
/** Re-adopt the current turn without reopening arbitrary historical keyed users. */
async function preparePersistedCurrentUserTurn(params) {
	const { sessionManager, message, recorder, runId } = params;
	const sessionTarget = sessionManager.getSessionTarget();
	if (!sessionTarget || !message?.idempotencyKey || !recorder) return;
	const scope = withOwnedSessionTranscriptWriterFence(sessionTarget);
	const assertOwned = captureOwnedTranscriptWriteAssertion(scope);
	const initialWriter = getOwnedSessionTranscriptInitialWriter({ sessionTarget: scope });
	const reader = prepareSessionManagerHydration(scope, {
		signal: params.signal,
		manager: sessionManager
	});
	const assertCurrent = () => {
		assertOwned();
		reader.assertCurrent();
	};
	const binding = reader.incognitoBinding;
	const withSource = (signal, operation) => {
		assertCurrent();
		return binding ? withSessionManagerMemoryActor(binding, false, async (selected) => {
			if (!selected) throw new Error("Persisted user turn memory session is closed");
			return runWithSessionActorStorage({
				actor: selected.actor,
				authority: selected.authority,
				agentId: selected.database.agentId,
				path: selected.database.path
			}, () => operation(scope, assertCurrent));
		}) : withSessionTranscriptReadSource(scope, ({ scope: captured, assertCurrent: assertSource }) => operation({
			...scope,
			agentId: captured.agentId,
			storePath: captured.storePath
		}, assertSource), signal);
	};
	const validate = async (target, assertSource, prepared, signal, consume) => {
		signal?.throwIfAborted();
		assertCurrent();
		const allowInitial = !prepared && Boolean(initialWriter) && !initialWriter?.committedFence;
		let accepted = false;
		await readSessionTranscriptAnchorsAsync(target, {
			entryIds: prepared ? [prepared.entryId] : [],
			replayValidation: {
				expectedLifecycleRevision: scope.expectedLifecycleRevision,
				expectedWriterRunId: scope.expectedWriterRunId,
				allowInitial,
				admission: resolveSessionTranscriptReadFence(target)
			},
			...prepared ? { contextValidation: { version: prepared.version } } : {}
		}, signal, (facts) => {
			assertSource();
			assertCurrent();
			prepared?.assertCurrent();
			if (facts.replayValidated !== "current" && !(facts.replayValidated === "initial" && allowInitial && !initialWriter?.committedFence)) throw new SessionTranscriptWriterClaimReboundError();
			if (prepared && !facts.contextValidated) throw new SessionWorkStartChangedError("Persisted user turn changed before replay admission. Retry the turn.");
			const anchor = facts.anchors[0];
			consume(prepared && anchor ? {
				...prepared,
				anchor
			} : void 0);
			accepted = true;
		});
		assertCurrent();
		if (!accepted) throw new SessionWorkStartChangedError("Persisted user turn changed before replay admission. Retry the turn.");
	};
	const readCurrentTurn = (signal, consume) => withSource(signal, async (target, assertSource) => {
		const matchesUser = (entry) => entry?.type === "message" && entry.message.role === "user" && isDeepStrictEqual(entry.message, message);
		const select = () => sessionManager[sessionManagerPrepareCurrentTurnReplay]((entry) => isInterruptedTurnEntry(entry, runId), matchesUser, signal);
		let witness;
		const accept = (current) => {
			witness = current;
			consume(current);
		};
		if (getOwnedSessionTranscriptReader(target)) {
			const allowInitial = Boolean(initialWriter) && !initialWriter?.committedFence;
			const hint = sessionManager.resolveCurrentTurnEntryId((entry) => isInterruptedTurnEntry(entry, runId));
			let consumed = false;
			await sessionManager[sessionManagerReloadTranscriptCohort]({
				sessionKey: scope.sessionKey,
				entryIds: hint ? [hint] : [],
				replayValidation: {
					expectedLifecycleRevision: scope.expectedLifecycleRevision,
					expectedWriterRunId: scope.expectedWriterRunId,
					allowInitial,
					admission: resolveSessionTranscriptReadFence(target)
				}
			}, (prepared, assertView) => {
				assertSource();
				assertCurrent();
				const selected = selectCurrentUserTurnFromCohort({
					sessionManager,
					message,
					runId,
					prepared,
					assertView,
					allowInitial,
					initialWriter
				});
				if (selected) {
					consumed = true;
					accept(selected.current);
				}
			}, signal);
			if (consumed) return witness;
		}
		await sessionManager.reloadPersistedTranscriptAsync(signal);
		assertSource();
		assertCurrent();
		await validate(target, assertSource, await select(), signal, accept);
		return witness;
	});
	const initial = params.initial ? params.initial.anchor : (await readCurrentTurn(params.signal, (prepared) => {
		if (prepared) recorder.markRuntimePersisted(message, prepared.anchor, { appended: false });
	}))?.anchor;
	if (!initial) return;
	let pending = true;
	return async (signal = params.signal) => {
		if (!pending) return;
		const replaySignal = signal && params.signal && signal !== params.signal ? AbortSignal.any([signal, params.signal]) : signal;
		replaySignal?.throwIfAborted();
		const accept = (prepared, onAdmitted) => {
			if (!prepared || prepared.anchor.entryId !== initial.entryId || prepared.anchor.generation !== initial.generation) throw new SessionWorkStartChangedError("Persisted user turn changed before replay admission. Retry the turn.");
			if (onAdmitted) {
				if (!pending) throw new Error("Persisted user turn replay was already consumed");
				pending = false;
				onAdmitted();
			}
		};
		assertCurrent();
		return async (onAdmitted) => {
			await readCurrentTurn(replaySignal, (prepared) => accept(prepared, onAdmitted));
		};
	};
}
function sessionMessagesContainIdempotencyKey(messages, idempotencyKey) {
	return messages.some((message) => "idempotencyKey" in message && message.idempotencyKey === idempotencyKey);
}
function reconcilePrePersistedCurrentUserTurn(params) {
	const idempotencyKey = params.currentUserTurnMessage?.idempotencyKey;
	if (typeof idempotencyKey !== "string" || idempotencyKey.length === 0) return false;
	const durableTurnMatches = params.durableUserTurnMessage?.idempotencyKey === idempotencyKey;
	if (!params.userTurnAlreadyPersisted && !durableTurnMatches) return false;
	const messages = params.activeSession.agent.state.messages;
	const tail = messages.at(-1);
	const activeTailMatches = tail?.role === "user" && "idempotencyKey" in tail && tail.idempotencyKey === idempotencyKey;
	if (activeTailMatches) params.activeSession.agent.state.messages = messages.slice(0, -1);
	return activeTailMatches || durableTurnMatches || params.currentUserTurnMessage?.excludeFromContext === true;
}
//#endregion
//#region src/agents/embedded-agent-runner/run/attempt-before-agent-run.ts
async function runEmbeddedAttemptBeforeAgentRun(input) {
	const block = await runBeforeAgentRunGate(input.hookRunner, {
		prompt: input.modelPrompt,
		systemPrompt: input.systemPrompt,
		messages: input.hookMessages,
		channelId: input.hookContext.channelId,
		accountId: input.attempt.agentAccountId,
		senderId: input.attempt.senderId ?? void 0,
		senderIsOwner: input.attempt.senderIsOwner
	}, input.hookContext);
	if (!block) return;
	const redactedUserMessage = buildAgentRunBlockedUserMessage(input.attempt.runId, block);
	if (!sessionMessagesContainIdempotencyKey(input.activeSession.messages, redactedUserMessage.idempotencyKey)) try {
		await input.withOwnedTranscriptWrite(() => withSessionManagerAppend(input.sessionManager, async () => {
			await input.sessionManager.appendMessageAsync(redactedUserMessage);
			input.sessionManager.flushPendingPersistence();
		}));
		input.activeSession.agent.state.messages = sanitizeCompactionReplayMessages(input.sessionManager.buildSessionContext().messages);
	} catch (err) {
		log$7.warn(`before_agent_run block: failed to persist redacted user message: ${err instanceof Error ? err.message : String(err)}`);
	}
	return {
		blockedBy: block.blockedBy,
		promptError: new Error(block.message)
	};
}
//#endregion
//#region src/agents/embedded-agent-runner/run/attempt-prompt-preflight.ts
function buildPreflightRecoveryBudgetSnapshot(snapshot) {
	return {
		estimatedPromptTokens: snapshot.estimatedPromptTokens,
		promptBudgetBeforeReserve: snapshot.promptBudgetBeforeReserve,
		overflowTokens: snapshot.overflowTokens
	};
}
async function handleEmbeddedAttemptMidTurnPrecheck(input) {
	const { attempt, request } = input;
	const preflightRecovery = {
		route: request.route,
		source: "mid-turn",
		...buildPreflightRecoveryBudgetSnapshot(request)
	};
	const logMidTurnPrecheck = (route, extra) => {
		log$7.warn(`[context-overflow-midturn-precheck] sessionKey=${attempt.sessionKey ?? attempt.sessionId} provider=${attempt.provider}/${attempt.modelId} route=${route} estimatedPromptTokens=${request.estimatedPromptTokens} promptBudgetBeforeReserve=${request.promptBudgetBeforeReserve} overflowTokens=${request.overflowTokens} toolResultReducibleChars=${request.toolResultReducibleChars} effectiveReserveTokens=${request.effectiveReserveTokens} prePromptMessageCount=${input.prePromptMessageCount} ` + (extra ? `${extra} ` : "") + `sessionFile=${attempt.sessionFile}`);
	};
	if (request.route === "truncate_tool_results_only") {
		const contextTokenBudget = attempt.contextTokenBudget ?? 2e5;
		const toolResultMaxChars = resolveLiveToolResultMaxChars({ contextWindowTokens: contextTokenBudget });
		const truncationResult = await truncateOversizedToolResultsInSessionManager({
			sessionManager: input.sessionManager,
			projectionState: input.toolResultPromptProjectionState,
			contextWindowTokens: contextTokenBudget,
			maxCharsOverride: toolResultMaxChars,
			sessionFile: attempt.sessionFile,
			sessionId: attempt.sessionId,
			sessionKey: attempt.sessionKey,
			agentId: input.sessionAgentId
		});
		if (truncationResult.truncated || truncationResult.reason === "no oversized or aggregate tool results") {
			if (truncationResult.truncated) input.replaceSessionMessages(sanitizeCompactionReplayMessages(input.sessionManager.buildSessionContext().messages));
			const truncatedCount = truncationResult.truncated ? truncationResult.truncatedCount : 0;
			logMidTurnPrecheck(request.route, `handled=true truncatedCount=${truncatedCount}` + (truncationResult.truncated ? "" : ` truncateSkippedReason=${truncationResult.reason}`));
			return { preflightRecovery: {
				...preflightRecovery,
				handled: true,
				truncatedCount
			} };
		}
		preflightRecovery.route = "compact_only";
		logMidTurnPrecheck(preflightRecovery.route, `truncateFallbackReason=${truncationResult.reason ?? "unknown"}`);
	} else logMidTurnPrecheck(request.route);
	return {
		preflightRecovery,
		promptError: new Error(PREEMPTIVE_OVERFLOW_ERROR_TEXT)
	};
}
async function prepareEmbeddedAttemptPromptPreflight(input) {
	const { attempt } = input;
	const boundaryOptions = {
		appendOnlyRuntimeContext: input.appendOnlyRuntimeContext,
		...input.timezone ? { timezone: input.timezone } : {},
		...input.includeBoundaryTimestamp ? {} : { includeTimestamp: false }
	};
	const unwindowedMessages = input.contextEnginePromptAuthority === "preassembly_may_overflow" ? input.unwindowedContextEngineMessagesForPrecheck : void 0;
	const unwindowedLlmBoundaryMessagesForPrecheck = unwindowedMessages ? normalizeMessagesForLlmBoundary(unwindowedMessages, boundaryOptions) : void 0;
	if (input.state.skipPromptSubmission) return { ...input.state };
	if ((input.pendingInputTokens ?? 0) >= input.contextTokenBudget) {
		if (input.providerCompactionAtRequestBoundary) log$7.warn("ChatGPT V2 compaction unavailable; falling back to client compaction: pending input exceeds the context budget");
		return {
			...input.state,
			preflightRecovery: { route: "compact_only" },
			promptError: new Error(PREEMPTIVE_OVERFLOW_ERROR_TEXT),
			promptErrorSource: "precheck",
			skipPromptSubmission: true
		};
	}
	let preemptiveCompaction;
	try {
		preemptiveCompaction = shouldPreemptivelyCompactBeforePrompt({
			messages: input.hookMessagesForCurrentPrompt,
			unwindowedMessages: unwindowedLlmBoundaryMessagesForPrecheck,
			systemPrompt: input.systemPrompt,
			prompt: input.promptForPrecheck,
			contextTokenBudget: input.contextTokenBudget,
			reserveTokens: input.reserveTokens,
			toolResultMaxChars: input.toolResultMaxChars,
			...typeof input.toolSchemaTokens === "number" ? { toolSchemaTokens: input.toolSchemaTokens } : {},
			replay: {
				model: attempt.model,
				sessionId: attempt.sessionId,
				authProfileId: attempt.runtimePlan?.auth.forwardedAuthProfileId,
				enabled: input.compactionReplayEnabled
			}
		});
	} catch (error) {
		if (!(error instanceof CompactionReplayRefreshRequiredError)) throw error;
		return {
			...input.state,
			promptError: error,
			promptErrorSource: "precheck",
			skipPromptSubmission: true
		};
	}
	const precheckSummary = {
		result: preemptiveCompaction,
		provider: attempt.provider,
		modelId: attempt.modelId,
		messageCount: input.sessionMessageCount,
		contextTokenBudget: input.contextTokenBudget,
		reserveTokens: input.reserveTokens,
		...attempt.sessionId ? { sessionId: attempt.sessionId } : {},
		...unwindowedMessages ? { unwindowedMessageCount: unwindowedMessages.length } : {}
	};
	const contextBudgetStatus = buildPrePromptContextBudgetStatus(precheckSummary);
	log$7.debug(formatPrePromptPrecheckLog({
		...precheckSummary,
		...attempt.sessionKey ? { sessionKey: attempt.sessionKey } : {},
		...attempt.sessionFile ? { sessionFile: attempt.sessionFile } : {}
	}));
	const checkpointPressure = preemptiveCompaction.compactionReplay;
	if (checkpointPressure && checkpointPressure.route !== "fits" && !input.providerCompactionAtRequestBoundary) return {
		...input.state,
		contextBudgetStatus,
		preflightRecovery: {
			route: checkpointPressure.route,
			...buildPreflightRecoveryBudgetSnapshot(checkpointPressure)
		},
		promptError: new Error(PREEMPTIVE_OVERFLOW_ERROR_TEXT),
		promptErrorSource: "precheck",
		skipPromptSubmission: true
	};
	if (preemptiveCompaction.route !== "fits") log$7.info(`[context-pressure-diagnostic] admitted provider attempt for ${attempt.provider}/${attempt.modelId} route=${preemptiveCompaction.route} estimatedPromptTokens=${preemptiveCompaction.estimatedPromptTokens} promptBudgetBeforeReserve=${preemptiveCompaction.promptBudgetBeforeReserve}`);
	return {
		...input.state,
		contextBudgetStatus
	};
}
//#endregion
//#region src/agents/embedded-agent-runner/run/prompt-image-preparation.ts
/** Prepares ordered prompt images using the admitted media and filesystem policy. */
async function prepareEmbeddedAttemptPromptExecution(input) {
	if (input.skipPromptSubmission) return {
		images: [],
		imageFactIndexes: [],
		detectedRefs: [],
		failedMediaCount: 0,
		loadedCount: 0,
		skippedCount: 0
	};
	const { attempt } = input;
	const result = await detectAndLoadPromptImages({
		prompt: input.prompt,
		workspaceDir: input.effectiveWorkspace,
		agentWorkspaceDir: attempt.workspaceDir,
		model: attempt.model,
		existingImages: attempt.images,
		imageOrder: attempt.imageOrder,
		media: attempt.media,
		userTurnTranscriptRecorder: attempt.userTurnTranscriptRecorder,
		maxBytes: MAX_IMAGE_BYTES,
		maxDimensionPx: resolveImageSanitizationLimits(attempt.config).maxDimensionPx,
		workspaceOnly: input.effectiveFsWorkspaceOnly,
		localRoots: input.effectiveFsWorkspaceOnly ? void 0 : getAgentScopedMediaLocalRoots(attempt.config ?? {}, input.mediaOwnerAgentId),
		sandbox: input.sandbox?.enabled && input.sandbox.fsBridge ? {
			root: input.sandbox.workspaceDir,
			bridge: input.sandbox.fsBridge
		} : void 0
	});
	if (!input.pluginHarness) return result;
	if (result.failedMediaCount) throw new Error(`failed to hydrate ${result.failedMediaCount} structured image attachment(s) for plugin harness input`);
	const message = await attempt.userTurnTranscriptRecorder?.resolveMessage();
	const media = ((message ? readPersistedMediaFacts(message) : void 0) ?? attempt.media)?.filter((fact) => !isImageMediaFact(fact));
	return {
		...result,
		imageOrder: result.images.length ? result.images.map(() => "inline") : void 0,
		media: media?.length ? media : void 0
	};
}
//#endregion
//#region src/agents/embedded-agent-runner/run/attempt-prompt-phase.ts
async function runEmbeddedAttemptPromptPhase(input, promptState) {
	const { attempt, activeContextEngine, isRawModelRun, prepared, preparedStreamRuntime, runAbortController } = input;
	const { sessionRuntime, promptToolPolicy } = prepared;
	const { agentSession: { activeSession, compactionEnabled, hookRunner, setActiveSessionSystemPrompt, settingsManager }, boundary: { boundaryTimezone, includeBoundaryTimestamp, orphanRepair, setCurrentUserTimestampOverride }, cacheTrace, contextGuards, preparedUserTurnMessage, sessionManager, sessionPromptState, state: sessionRuntimeState, toolResultPromptProjectionState, trajectoryRecorder, transcriptPolicy: { appendOnlyRuntimeContext, inHistorySystemUpdates }, transport: { effectiveAgentTransport, effectiveExtraParams, streamStrategy, compactionReplayEnabled } } = sessionRuntime;
	const { effectiveFsWorkspaceOnly, effectiveWorkspace, sandbox, sessionAgentId } = input.setup;
	const { history: { contextEnginePromptAuthority, unwindowedContextEngineMessagesForPrecheck }, promptActiveSession, stream: { stopAcceptingSteerMessages } } = preparedStreamRuntime;
	const { withOwnedTranscriptWrite } = input.sessionLock;
	const withTranscriptWrite = (write) => withOwnedTranscriptWrite(() => withSessionManagerAppend(sessionManager, write));
	const observeForegroundRequests = (onRequest) => {
		const streamFn = activeSession.agent.streamFn;
		activeSession.agent.streamFn = (model, context, options) => {
			if (!activeSession.isCompacting) onRequest(model, context);
			return streamFn(model, context, options);
		};
	};
	const { diagnosticTrace, runTrace } = input.diagnostics;
	const { systemPromptReport, runtimeInfo } = prepared.systemPrompt;
	let systemPromptText = sessionRuntimeState.systemPromptText;
	const toolSearchCompacted = prepared.toolCatalog.toolSearch.compacted;
	let skipPromptSubmission = false;
	let leasedSteering;
	let providerBoundaryPrecheck;
	const providerCompactionAtRequestBoundary = isChatGPTV2CompactionEligible({
		config: attempt.config,
		model: attempt.model,
		extraParams: effectiveExtraParams,
		compactionEnabled,
		compactionReplayEnabled,
		contextEngineOwnsCompaction: activeContextEngine?.info.ownsCompaction,
		operation: attempt.operation
	});
	const previousThresholdDeferral = activeSession[agentSessionDeferThresholdCompaction];
	if (providerCompactionAtRequestBoundary) activeSession[agentSessionDeferThresholdCompaction] = true;
	const setFailure = (error, source) => {
		input.state.terminal = setAgentRunAttemptTerminalFailure(input.state.terminal, error !== null && error !== void 0 ? {
			error,
			source: source ?? "prompt"
		} : null);
	};
	const publishDispatchState = (state) => {
		skipPromptSubmission = state.skipPromptSubmission;
		promptState.contextBudgetStatus = state.contextBudgetStatus;
		promptState.preflightRecovery = state.preflightRecovery;
		setFailure(state.promptError, state.promptErrorSource);
	};
	const releaseLeasedSteering = async (error) => {
		if (!leasedSteering) return;
		await releasePendingAgentSteeringItems({
			runIds: leasedSteering.runIds,
			leaseId: leasedSteering.leaseId,
			error: error ? formatErrorMessage(error) : void 0
		});
		leasedSteering = void 0;
	};
	const handleMidTurnPrecheckRequest = async (request) => {
		const outcome = await handleEmbeddedAttemptMidTurnPrecheck({
			attempt,
			request,
			sessionAgentId,
			sessionManager,
			toolResultPromptProjectionState,
			prePromptMessageCount: sessionRuntimeState.prePromptMessageCount,
			replaceSessionMessages: (messages) => {
				activeSession.agent.state.messages = messages;
			}
		});
		promptState.preflightRecovery = outcome.preflightRecovery;
		if (outcome.promptError) setFailure(outcome.promptError, "precheck");
	};
	const promptStartedAt = Date.now();
	let transcriptLeafId = null;
	try {
		const promptAssembly = await prepareEmbeddedAttemptPromptAssembly({
			attempt,
			activeSession,
			sessionManager,
			hookRunner,
			hookAgentId: sessionAgentId,
			diagnosticTrace,
			isRawModelRun,
			...orphanRepair ? { orphanRepair } : {},
			sessionAgentId,
			runtimeModel: runtimeInfo.model,
			systemPromptText,
			runAbortSignal: input.runAbortController.signal,
			setActiveSessionSystemPrompt,
			applyPromptBuildToolsAllow: (toolsAllow, decisionIsCurrent) => {
				return promptToolPolicy.apply(toolsAllow, decisionIsCurrent).callableToolNames;
			},
			prepareSystemPrompt: async (currentSystemPrompt) => {
				const refresh = await prepared.systemPrompt.prepareToolPrompt?.(promptToolPolicy.current.effectiveTools);
				return refresh ? refresh(currentSystemPrompt) : currentSystemPrompt;
			},
			setLeasedSteering: (lease) => {
				leasedSteering = lease;
			}
		});
		input.setup.prepStages.mark("prompt-build");
		systemPromptText = sessionRuntimeState.systemPromptText;
		if (prepared.toolCatalog.emptyExplicitToolAllowlistError) {
			setFailure(prepared.toolCatalog.emptyExplicitToolAllowlistError, "precheck");
			skipPromptSubmission = true;
			log$7.warn(`[tools] ${prepared.toolCatalog.emptyExplicitToolAllowlistError.message}`);
		}
		const { hookCtx, promptBuildPrependContext, promptBuildAppendContext } = promptAssembly;
		transcriptLeafId = promptAssembly.transcriptLeafId;
		leasedSteering = promptAssembly.leasedSteering ?? leasedSteering;
		const promptContext = await prepareEmbeddedAttemptPromptContext({
			sessionVersion: sessionManager.getHeader()?.version,
			attempt,
			capabilityToolNames: prepared.toolCatalog.toolSearchRunPlan.capabilityToolNames,
			messages: activeSession.messages,
			prompt: promptAssembly,
			replaceSessionMessages: (messages) => {
				activeSession.agent.state.messages = messages;
			},
			appendOnlyRuntimeContext,
			inHistorySystemUpdates,
			...boundaryTimezone ? { boundaryTimezone } : {},
			includeBoundaryTimestamp,
			isRawModelRun,
			...preparedUserTurnMessage ? { preparedUserTurnMessage } : {},
			sessionAgentId,
			...systemPromptReport ? { systemPromptReport } : {},
			systemPromptText,
			toolResultPromptProjectionState
		});
		input.setup.prepStages.mark("prompt-context");
		if (runAbortController.signal.aborted) throw createAbortableError(runAbortController.signal);
		promptAssembly.assertHostActive?.();
		const { hookMessagesForCurrentPrompt, promptForModel, systemPromptForHook } = promptContext;
		sessionRuntimeState.prePromptMessageCount = promptContext.prePromptMessageCount;
		setCurrentUserTimestampOverride(promptContext.currentUserTimestampOverride);
		const beforeAgentRunOutcome = attempt.operation === "settled-tool-finalization" ? void 0 : await runEmbeddedAttemptBeforeAgentRun({
			attempt,
			activeSession,
			hookContext: hookCtx,
			hookMessages: hookMessagesForCurrentPrompt,
			hookRunner,
			modelPrompt: promptForModel,
			sessionManager,
			systemPrompt: systemPromptForHook,
			withOwnedTranscriptWrite
		});
		if (beforeAgentRunOutcome) {
			input.state.beforeAgentRunBlockedBy = beforeAgentRunOutcome.blockedBy;
			setFailure(beforeAgentRunOutcome.promptError, "hook:before_agent_run");
			skipPromptSubmission = true;
		}
		if (!skipPromptSubmission) {
			const { resolvedApiKey } = attempt;
			const googlePromptCacheStreamFn = await prepareGooglePromptCacheStreamFn({
				apiKey: await resolveEmbeddedAgentApiKey({
					provider: attempt.provider,
					resolvedApiKey,
					authStorage: attempt.authStorage
				}),
				extraParams: effectiveExtraParams,
				model: attempt.model,
				modelId: attempt.modelId,
				provider: attempt.provider,
				sessionManager: {
					appendCustomEntryAsync: async (customType, data) => {
						await withTranscriptWrite(async () => {
							runAbortController.signal.throwIfAborted();
							await sessionManager.appendCustomEntryAsync(customType, data);
						});
					},
					getEntries: () => sessionManager.getEntries()
				},
				signal: runAbortController.signal,
				streamFn: activeSession.agent.streamFn
			});
			if (googlePromptCacheStreamFn) activeSession.agent.streamFn = googlePromptCacheStreamFn;
		}
		const imageResult = await prepareEmbeddedAttemptPromptExecution({
			mediaOwnerAgentId: sessionAgentId,
			effectiveFsWorkspaceOnly,
			effectiveWorkspace,
			sandbox,
			attempt,
			prompt: promptContext.promptSubmission.prompt,
			skipPromptSubmission
		});
		const reserveTokens = settingsManager.getCompactionReserveTokens();
		const terminal = projectAgentRunAttemptTerminal(input.state.terminal);
		let state = {
			contextBudgetStatus: promptState.contextBudgetStatus,
			preflightRecovery: promptState.preflightRecovery,
			promptError: terminal.promptError,
			promptErrorSource: terminal.promptErrorSource,
			skipPromptSubmission: observeEmbeddedAttemptPrompt({
				...promptContext,
				cacheTrace,
				diagnosticTrace,
				hookAgentId: sessionAgentId,
				hookRunner,
				isRawModelRun,
				runTrace,
				streamStrategy,
				systemPromptText,
				toolSearchCompacted,
				trajectoryRecorder,
				transport: effectiveAgentTransport,
				effectiveTools: promptToolPolicy.current.effectiveTools,
				tools: promptToolPolicy.current.tools,
				uncompactedEffectiveTools: promptToolPolicy.current.uncompactedEffectiveTools,
				attempt,
				imageCount: imageResult.images.length,
				reserveTokens,
				sessionMessages: activeSession.messages,
				skipPromptSubmission,
				transcriptLeafId
			}).skipPromptSubmission
		};
		publishDispatchState(state);
		let compactionRequestBudget;
		if (!state.skipPromptSubmission) {
			const userTurnRecorder = attempt.userTurnTranscriptRecorder;
			const pendingUserIdempotencyKey = attempt.skipPreparedUserTurnMessage !== true && userTurnRecorder?.hasPersisted() === true ? (userTurnRecorder.getPersistedMessage?.() ?? userTurnRecorder.message)?.idempotencyKey : void 0;
			const foregroundBudget = {
				contextWindow: promptContext.contextTokenBudget,
				reserveTokens
			};
			const pendingContextMessages = promptContext.runtimeContextMessageForCurrentTurn ? [promptContext.runtimeContextMessageForCurrentTurn] : [];
			compactionRequestBudget = createCompactionRequestBudget({
				...foregroundBudget,
				systemPrompt: promptContext.systemPromptForHook,
				tools: activeSession.agent.state.tools,
				pendingPrompt: promptContext.llmBoundaryPromptForPrecheck,
				pendingImageCount: imageResult.images.length,
				...appendOnlyRuntimeContext ? { pendingQueuedContextMessages: resolvePendingRuntimeContextReplay({
					messages: activeSession.messages,
					pendingContextMessages,
					persistedUserIdempotencyKey: pendingUserIdempotencyKey
				}).pendingContextMessages } : { pendingContextMessages },
				pendingAdditivePrompt: [promptBuildPrependContext, promptBuildAppendContext].filter(Boolean).join("\n\n"),
				pendingUserIdempotencyKey
			});
			attempt.onCompactionRequestBudget?.(compactionRequestBudget);
			observeForegroundRequests((_model, context) => {
				attempt.onCompactionRequestBudget?.(createCompactionRequestBudget({
					...foregroundBudget,
					systemPrompt: context.systemPrompt,
					tools: context.tools
				}));
			});
		}
		state = await prepareEmbeddedAttemptPromptPreflight({
			appendOnlyRuntimeContext,
			compactionReplayEnabled,
			providerCompactionAtRequestBoundary,
			contextEnginePromptAuthority,
			includeBoundaryTimestamp,
			...boundaryTimezone ? { timezone: boundaryTimezone } : {},
			...unwindowedContextEngineMessagesForPrecheck ? { unwindowedContextEngineMessagesForPrecheck } : {},
			attempt,
			contextTokenBudget: promptContext.contextTokenBudget,
			hookMessagesForCurrentPrompt: promptContext.hookMessagesForCurrentPrompt,
			promptForPrecheck: promptContext.llmBoundaryPromptForPrecheck,
			pendingInputTokens: compactionRequestBudget?.pendingTokens,
			reserveTokens,
			sessionMessageCount: activeSession.messages.length,
			state,
			systemPrompt: promptContext.systemPromptForHook,
			toolResultMaxChars: promptContext.promptToolResultMaxChars,
			toolSchemaTokens: estimateToolSchemaTokenPressure(activeSession.agent.state.tools)
		});
		input.setup.prepStages.mark("compaction-preflight");
		publishDispatchState(state);
		if (!state.skipPromptSubmission) await submitEmbeddedAttemptPrompt({
			...promptBuildAppendContext ? { appendContext: promptBuildAppendContext } : {},
			attempt,
			activeSession,
			contextTokenBudget: promptContext.contextTokenBudget,
			compactionRequestBudget,
			...providerCompactionAtRequestBoundary ? { compactBeforeRequest: createChatGPTV2CompactionBoundary({
				session: activeSession,
				config: attempt.config,
				contextTokenBudget: promptContext.contextTokenBudget,
				reserveTokens,
				timeoutMs: input.sessionLock.compactionTimeoutMs,
				authProfileId: attempt.runtimePlan?.auth.forwardedAuthProfileId,
				...attempt.sessionKey ? { hookContext: {
					hookRunner,
					sessionId: attempt.sessionId,
					sessionKey: attempt.sessionKey,
					sessionAgentId,
					workspaceDir: effectiveWorkspace,
					messageProvider: attempt.messageProvider,
					onHookMessages: async ({ phase, messages }) => {
						const visible = messages.filter((message) => message.trim());
						if (visible.length) await attempt.onAgentEvent?.({
							stream: "compaction",
							data: {
								phase: phase === "before" ? "start" : "end",
								...phase === "after" ? { completed: true } : {},
								messages: visible
							},
							sessionKey: attempt.sessionKey
						});
					}
				} } : {},
				postCompaction: {
					config: attempt.config,
					sessionKey: attempt.sessionKey,
					sessionId: attempt.sessionId,
					agentId: sessionAgentId,
					memoryAudience: attempt.memoryAudience,
					sandboxed: sandbox?.enabled === true,
					sessionFile: attempt.sessionFile
				},
				assertActive: () => {
					runAbortController.signal.throwIfAborted();
					promptAssembly.assertHostActive?.();
				},
				withTranscriptWrite,
				onFallback: (request) => {
					providerBoundaryPrecheck = request;
				}
			}) } : {},
			onModelRequest: preparedStreamRuntime.cache.onModelRequest,
			images: imageResult.images,
			...leasedSteering ? { leasedSteering } : {},
			modelPrompt: promptContext.promptForModel,
			onFinalPromptText: (prompt) => {
				promptState.finalPromptText = prompt;
			},
			assertHostActive: promptAssembly.assertHostActive,
			withTranscriptWrite,
			getUserTranscriptContexts: sessionRuntime.boundary.getUserTranscriptContexts,
			preparePrimaryModelRequest: () => promptToolPolicy.prepareForDispatch(async () => {
				promptAssembly.decisionPrefilter.restrictionApplied = false;
				promptAssembly.decisionPrefilter.status = "retained";
				promptAssembly.decisionPrefilter.reason = "selection-changed";
				const refresh = await prepared.systemPrompt.prepareToolPrompt?.(promptToolPolicy.current.effectiveTools);
				input.runAbortController.signal.throwIfAborted();
				promptAssembly.assertHostActive?.();
				const refreshedPrompt = refresh?.(activeSession.agent.state.systemPrompt);
				const projection = refreshedPrompt !== void 0 && sessionRuntime.prepareSystemPromptUpdate ? await sessionRuntime.prepareSystemPromptUpdate(refreshedPrompt, refresh?.freshlyRendered === true) : void 0;
				if (refreshedPrompt !== void 0 && !projection) setActiveSessionSystemPrompt(refreshedPrompt);
				return () => ({
					tools: activeSession.agent.state.tools.slice(),
					systemPrompt: projection?.systemPrompt ?? activeSession.agent.state.systemPrompt,
					...projection ? { promptUpdate: {
						update: projection.update,
						commit: () => {
							projection.commit();
							setActiveSessionSystemPrompt(projection.systemPrompt);
						}
					} } : {}
				});
			}),
			onPrimaryModelRequest: (tools) => {
				logDecisionToolRequest({
					decision: promptAssembly.decisionPrefilter,
					baseline: promptToolPolicy.readDecisionBaseline(),
					readFinal: () => tools,
					requiredNames: promptToolPolicy.decisionRequiredNames,
					trace: runTrace
				});
			},
			onSteeringAcknowledged: () => {
				leasedSteering = void 0;
			},
			persistToolResultProjections: async () => {
				if (!isRawModelRun && (inHistorySystemUpdates || sessionPromptState.pendingToolSurface || toolResultPromptProjectionState.frozen.size > 0)) await withTranscriptWrite(async () => {
					runAbortController.signal.throwIfAborted();
					await persistToolResultProjections(toolResultPromptProjectionState, (customType, data) => sessionManager.appendCustomEntryAsync(customType, data));
					const appendEntry = (customType, data) => sessionManager.appendCustomEntryAsync(customType, data);
					await (sessionRuntime.prepareSystemPromptUpdate ? persistSessionSystemPrompt(sessionPromptState, appendEntry) : persistSessionToolSurface(sessionPromptState, appendEntry));
				});
			},
			...promptBuildPrependContext ? { prependContext: promptBuildPrependContext } : {},
			...promptContext.runtimeContextMessageForCurrentTurn ? { runtimeContextMessage: promptContext.runtimeContextMessageForCurrentTurn } : {},
			runtimeOnly: promptContext.promptSubmission.runtimeOnly === true,
			setNextUserMessagePersistence: sessionManager.setNextUserMessagePersistence,
			systemPrompt: promptContext.systemPromptForHook,
			toolResultAggregateMaxChars: promptContext.promptToolResultAggregateMaxChars,
			toolResultMaxChars: promptContext.promptToolResultMaxChars,
			transcriptLeafId,
			transcriptPrompt: promptContext.promptForSession,
			appendOnlyRuntimeContext,
			promptActiveSession,
			toolResultPromptProjectionState,
			trajectoryRecorder
		});
		else await releaseLeasedSteering(state.promptError ?? "prompt submission skipped");
		publishDispatchState(state);
	} catch (error) {
		const promptErrorOutcome = await handleEmbeddedAttemptPromptError({
			activeSession,
			attempt,
			error,
			handleMidTurnPrecheckRequest,
			markYieldAborted: () => {
				promptState.yieldAborted = true;
				input.state.terminal = mergeAgentRunAttemptTerminal(input.state.terminal, {
					kind: "aborted",
					source: "yield_cleanup"
				});
			},
			releaseLeasedSteering,
			withOwnedTranscriptWrite,
			...input.lifecycle.readYieldState()
		});
		if (promptErrorOutcome.promptFailure && !(projectAgentRunAttemptTerminal(input.state.terminal).timedOutByRunBudget && isOpenClawAbortableWrapper(promptErrorOutcome.promptFailure.error) && promptErrorOutcome.promptFailure.error instanceof Error && promptErrorOutcome.promptFailure.error.cause === runAbortController.signal.reason)) setFailure(promptErrorOutcome.promptFailure.error, promptErrorOutcome.promptFailure.source);
	} finally {
		activeSession[agentSessionDeferThresholdCompaction] = previousThresholdDeferral;
		stopAcceptingSteerMessages();
		log$7.debug(`embedded run prompt end: runId=${attempt.runId} sessionId=${attempt.sessionId} durationMs=${Date.now() - promptStartedAt}`);
	}
	const pendingMidTurnPrecheckRequest = providerBoundaryPrecheck ?? contextGuards.takePendingMidTurnPrecheckRequest();
	if (pendingMidTurnPrecheckRequest) await withTranscriptWrite(async () => {
		await removeTrailingMidTurnPrecheckAssistantError({
			activeSession,
			sessionManager
		});
		const terminal = projectAgentRunAttemptTerminal(input.state.terminal);
		if (!promptState.preflightRecovery && terminal.promptErrorSource !== "precheck") {
			setFailure(null, null);
			await handleMidTurnPrecheckRequest(pendingMidTurnPrecheckRequest);
		}
	});
	return {
		promptStartedAt,
		transcriptLeafId
	};
}
//#endregion
//#region src/agents/embedded-agent-runner/run/attempt-tool-call-name-resolution.ts
function resolveCaseInsensitiveAllowedToolName(rawName, allowedToolNames) {
	const folded = normalizeLowercaseStringOrEmpty(rawName);
	let caseInsensitiveMatch = null;
	for (const name of allowedToolNames) {
		if (normalizeLowercaseStringOrEmpty(name) !== folded) continue;
		if (caseInsensitiveMatch && caseInsensitiveMatch !== name) return null;
		caseInsensitiveMatch = name;
	}
	return caseInsensitiveMatch;
}
function resolveExactAllowedToolName(rawName, allowedToolNames) {
	if (allowedToolNames.has(rawName)) return rawName;
	const normalized = normalizeToolPolicyName(rawName);
	if (allowedToolNames.has(normalized)) return normalized;
	return resolveCaseInsensitiveAllowedToolName(rawName, allowedToolNames) ?? resolveCaseInsensitiveAllowedToolName(normalized, allowedToolNames);
}
function buildStructuredToolNameCandidates(rawName) {
	const trimmed = rawName.trim();
	if (!trimmed) return [];
	const candidates = /* @__PURE__ */ new Set();
	const addCandidate = (value) => {
		const candidate = value.trim();
		if (candidate) {
			candidates.add(candidate);
			candidates.add(normalizeToolPolicyName(candidate));
		}
	};
	addCandidate(trimmed);
	const structuredSeeds = [trimmed];
	const xmlFragmentOffset = Math.min(...[
		"\"",
		"'",
		"<"
	].map((separator) => trimmed.indexOf(separator)).filter((offset) => offset > 0));
	if (Number.isFinite(xmlFragmentOffset)) {
		const prefix = trimmed.slice(0, xmlFragmentOffset);
		addCandidate(prefix);
		structuredSeeds.push(prefix);
	}
	for (const seed of structuredSeeds) {
		const normalizedDelimiter = seed.replace(/\//g, ".");
		addCandidate(normalizedDelimiter);
		const segments = normalizeStringEntries(normalizedDelimiter.split("."));
		for (let index = 1; index < segments.length; index += 1) addCandidate(segments.slice(index).join("."));
	}
	return [...candidates];
}
function resolveStructuredAllowedToolName(rawName, allowedToolNames) {
	const candidateNames = buildStructuredToolNameCandidates(rawName);
	for (const candidate of candidateNames) if (allowedToolNames.has(candidate)) return candidate;
	for (const candidate of candidateNames) {
		const caseInsensitiveMatch = resolveCaseInsensitiveAllowedToolName(candidate, allowedToolNames);
		if (caseInsensitiveMatch) return caseInsensitiveMatch;
	}
	return null;
}
function inferToolNameFromToolCallId(rawId, allowedToolNames) {
	if (!rawId || !allowedToolNames || allowedToolNames.size === 0) return null;
	const id = rawId.trim();
	if (!id) return null;
	const candidateTokens = /* @__PURE__ */ new Set();
	const addCounterVariants = (value) => {
		candidateTokens.add(value);
		candidateTokens.add(value.replace(/[:._/-]\d+$/, ""));
		candidateTokens.add(value.replace(/\d+$/, ""));
	};
	const addToken = (value) => {
		const trimmed = value.trim();
		if (!trimmed) return;
		const normalizedDelimiter = trimmed.replace(/\//g, ".");
		addCounterVariants(trimmed);
		addCounterVariants(normalizedDelimiter);
		for (const prefixPattern of [/^functions?[._-]?/i, /^tools?[._-]?/i]) {
			const stripped = normalizedDelimiter.replace(prefixPattern, "");
			if (stripped !== normalizedDelimiter) addCounterVariants(stripped);
		}
	};
	for (const seed of [id, id.split(":")[0] ?? id]) addToken(seed);
	let singleMatch = null;
	for (const candidate of candidateTokens) {
		const matched = resolveStructuredAllowedToolName(candidate, allowedToolNames);
		if (!matched) continue;
		if (singleMatch && singleMatch !== matched) return null;
		singleMatch = matched;
	}
	return singleMatch;
}
function looksLikeMalformedToolNameCounter(rawName) {
	const normalizedDelimiter = rawName.trim().replace(/\//g, ".");
	return /^(?:functions?|tools?)[._-]?/i.test(normalizedDelimiter) && /(?:[:._-]\d+|\d+)$/.test(normalizedDelimiter);
}
function resolveToolCallName(rawName, allowedToolNames, rawToolCallId, requireAllowed = false) {
	const trimmed = rawName.trim();
	if (!trimmed) return inferToolNameFromToolCallId(rawToolCallId, allowedToolNames) ?? (requireAllowed ? null : rawName);
	if (!allowedToolNames || allowedToolNames.size === 0) return trimmed;
	const resolved = resolveExactAllowedToolName(trimmed, allowedToolNames) || inferToolNameFromToolCallId(trimmed, allowedToolNames);
	if (resolved) return resolved;
	if (looksLikeMalformedToolNameCounter(trimmed)) return requireAllowed ? null : trimmed;
	return resolveStructuredAllowedToolName(trimmed, allowedToolNames) ?? (requireAllowed ? null : trimmed);
}
//#endregion
//#region src/agents/embedded-agent-runner/run/incomplete-turn-resolution.ts
/**
* Builds the user-visible incomplete-turn warning when a terminal attempt did
* not produce a safe final assistant response and no committed delivery/progress
* already completed the task.
*/
function resolveIncompleteTurnPayloadText(params) {
	const payloads = params.terminalFailure?.prepared.payloadsWithToolMedia;
	const toolFailurePayload = params.attempt.terminal.kind === "ok" && params.attempt.lastToolError ? payloads?.find((payload) => getReplyPayloadMetadata(payload)?.toolErrorWarning) : void 0;
	const payloadCount = toolFailurePayload ? countSettledTurnDeliveryPayloads({
		payloads,
		attempt: params.attempt
	}) : params.payloadCount;
	const assistantState = classifyAssistantTurn({
		...params,
		payloadCount
	});
	const textToolCallAttempt = params.attempt.textToolCallAttempt === true;
	const assistant = assistantState.assistant;
	const completionAttempt = {
		...params.attempt,
		messagingToolSourceReplyPayloads: params.attempt.messagingToolSourceReplyPayloads?.filter((payload) => !payload.toolAuthored || isToolAuthoredSourceReplyForAssistant(payload, assistant))
	};
	const hasTerminalOutput = hasAttemptTerminalState(completionAttempt);
	const incompleteTerminalAssistant = isIncompleteTerminalAssistantTurn({
		hasAssistantVisibleText: payloadCount > 0,
		hasTerminalOutput,
		lastAssistant: assistant
	});
	const thinkingOnlyTerminal = payloadCount !== 0 && params.attempt.keptAnswer === void 0 && !assistantState.visibleText.length && !assistant?.openclawDelivery?.tts?.text?.trim() && !hasTerminalOutput && Boolean(assistant && hasOnlyAssistantReasoningContent(assistant));
	if (payloadCount !== 0 && !incompleteTerminalAssistant && !thinkingOnlyTerminal && !textToolCallAttempt || params.aborted && params.externalAbort || params.timedOut || params.attempt.clientToolCalls || params.attempt.yieldDetected || params.attempt.didSendDeterministicApprovalPrompt || toolFailurePayload && hasTerminalOutput || params.attempt.lastToolError && !toolFailurePayload || params.hasIntentionalTerminalCompletion || params.attempt.hasToolMediaBlockReply || resolveSourceReplyDelivery(completionAttempt) !== "missing" || completionAttempt.messagingToolSourceReplyPayloads?.some((payload) => payload.toolAuthored === true) || hasCompletionMessageSessionSpawn(params.attempt.acceptedSessionSpawns)) return null;
	if (hasAsyncActivity(params.attempt.toolMetas) || !params.aborted && assistant?.stopReason === "stop" && (params.attempt.itemLifecycle.activeCount > 0 || params.attempt.itemLifecycle.completedCount < params.attempt.itemLifecycle.startedCount)) return null;
	const textToolCallFailureText = textToolCallAttempt ? "⚠️ The model wrote a tool call as text instead of calling the tool. No tool ran for that call." : void 0;
	const stopReason = assistant?.stopReason;
	if (!textToolCallAttempt && !incompleteTerminalAssistant && !assistantState.reasoningOnly && !thinkingOnlyTerminal && !assistantState.emptyResponse && stopReason !== "error") return null;
	if (toolFailurePayload?.text) return toolFailurePayload.text;
	const { promptError } = projectAgentRunAttemptTerminal(params.attempt.terminal);
	if (!promptError && assistant?.stopReason === "error" && assistant.errorCode === "incomplete_tool_call") return formatUserFacingAssistantErrorText(assistant);
	const preflightFailureText = renderAgentHarnessPreflightUserMessage(promptError);
	const failureFacts = promptError && preflightFailureText === void 0 ? resolveReplyFailoverFacts(promptError, formatErrorMessage(promptError)) : void 0;
	const promptFailureText = textToolCallFailureText ?? preflightFailureText ?? (failureFacts ? failureFacts.providerRequestError?.userMessage ?? failureFacts.requestFailureText ?? renderAssistantRequestFailureCopy({
		reason: failureFacts.reason,
		status: failureFacts.status,
		code: failureFacts.code
	}) : void 0);
	if (params.hadPotentialSideEffects || params.attempt.replayMetadata.hadPotentialSideEffects) return `${promptFailureText ?? "⚠️ Agent couldn't generate a response."} Note: some tool actions may have already been executed — please verify before retrying.`;
	if (textToolCallFailureText) return `${textToolCallFailureText} Please try again or use a model with native tool calling.`;
	if (preflightFailureText !== void 0) return preflightFailureText;
	if (assistant && isProviderRefusalAssistantError(assistant)) return formatUserFacingAssistantErrorText(assistant);
	const authFailure = params.terminalFailure;
	const reason = authFailure?.assistantProfileFailureReason;
	if (authFailure && (reason === "auth" || reason === "auth_permanent")) return renderAuthProfileFailoverCopy({
		reason,
		provider: authFailure.provider,
		allInCooldown: false,
		recoveryHint: buildProviderAuthRecoveryHint({
			provider: authFailure.provider,
			config: authFailure.runParams.config,
			workspaceDir: authFailure.runParams.workspaceDir,
			env: process.env
		})
	});
	return promptFailureText ?? (stopReason === "length" ? "⚠️ The model reached its output token limit before generating an answer. Please try again." : "⚠️ Agent couldn't generate a response. Please try again.");
}
/**
* Allows one retry when the provider returned no assistant turn at all and the
* attempt has no side effects, active lifecycle items, delivery, or terminal
* assistant/tool state.
*/
function shouldRetryMissingAssistantTurn(params) {
	return !(params.payloadCount !== 0 || params.aborted || params.promptError || params.timedOut || params.attempt.clientToolCalls || resolveCurrentAttemptAssistant(params.attempt) || params.attempt.yieldDetected || params.attempt.didSendDeterministicApprovalPrompt || params.attempt.lastToolError || joinAssistantTexts(params.attempt.assistantTexts).length > 0 || hasCommittedMessagingToolDeliveryEvidence(params.attempt) || hasAcceptedSessionSpawn(params.attempt.acceptedSessionSpawns) || hasAsyncActivity(params.attempt.toolMetas) || (params.attempt.itemLifecycle?.startedCount ?? 0) > 0 || (params.attempt.itemLifecycle?.activeCount ?? 0) > 0 || params.attempt.replayMetadata.hadPotentialSideEffects);
}
/** Same-attempt work that can resume execution or deliver its completion. */
function hasRunContinuationEvidence(attempt) {
	return (attempt.clientToolCalls?.length ?? 0) > 0 || attempt.didSendDeterministicApprovalPrompt === true || hasCompletionMessageSessionSpawn(attempt.acceptedSessionSpawns) || attempt.runtimeContinuationStarted === true || attempt.yieldMessageWaitRegistered === true || hasAsyncActivity(attempt.toolMetas);
}
/** A deliberate yield can also leave accepted work or already-sent output. */
function hasYieldContinuationEvidence(attempt) {
	return hasAcceptedSessionSpawn(attempt.acceptedSessionSpawns) || hasCommittedMessagingToolDeliveryEvidence(attempt) || (attempt.successfulCronAdds ?? 0) > 0 || hasRunContinuationEvidence(attempt);
}
const YIELD_DIAGNOSTIC_TEXT = "⚠️ Turn yielded without a continuation source. Send a message to resume.";
const TRUNCATED_REPLY_NOTICE_TEXT = "⚠️ Reply truncated at the model's output token limit. The text above is partial — ask to continue it.";
function readMessageTextContent(message) {
	const content = message.content;
	return normalizeOptionalString(typeof content === "string" ? content : collectTextContentBlocks(content).map((item) => item.trim()).filter((item) => item.length > 0).join("\n"));
}
function hasTrailingSilentToolResult(messages) {
	for (let i = messages.length - 1; i >= 0; i -= 1) {
		const message = messages[i];
		if (!message) continue;
		const role = normalizeLowercaseStringOrEmpty(message?.role);
		if (role === "toolresult" || role === "tool_result" || role === "tool") {
			if (message.isError === true) return false;
			const text = readMessageTextContent(message) ?? normalizeOptionalString(message.details?.aggregated);
			return isSilentReplyText(text, SILENT_REPLY_TOKEN);
		}
		if (role === "assistant" && !readMessageTextContent(message)) continue;
		return false;
	}
	return false;
}
/** Emits the silent-reply token for cron turns whose last successful tool result is silent. */
function resolveSilentToolResultReplyPayload(params) {
	if (!params.isCronTrigger || params.payloadCount !== 0 || params.aborted || params.timedOut || (params.attempt.toolMetas?.length ?? 0) === 0 || params.attempt.clientToolCalls || params.attempt.yieldDetected || params.attempt.didSendDeterministicApprovalPrompt || params.attempt.lastToolError || (params.attempt.messagesSnapshot?.length ?? 0) === 0) return null;
	return hasTrailingSilentToolResult(params.attempt.messagesSnapshot) ? { text: SILENT_REPLY_TOKEN } : null;
}
/**
* Marks replay invalid whenever the recorded attempt might not be safe to
* replay or the current run ended in a compaction/incomplete-turn state that
* needs a fresh prompt boundary.
*/
function resolveReplayInvalidFlag(params) {
	const terminal = projectAgentRunAttemptTerminal(params.attempt.terminal);
	const replaySafeProviderRefusal = params.attempt.replayMetadata.replaySafe && isProviderRefusalAssistantError(resolveCurrentAttemptAssistant(params.attempt));
	return !params.attempt.replayMetadata.replaySafe || terminal.promptErrorSource === "compaction" || terminal.timedOutDuringCompaction || Boolean(params.incompleteTurnText) && !replaySafeProviderRefusal;
}
/** Classifies the persisted run state used by session recovery and resume logic. */
function resolveRunLivenessState(params) {
	if (params.incompleteTurnText) return "abandoned";
	const terminal = projectAgentRunAttemptTerminal(params.attempt.terminal);
	if (!terminal.timedOutDuringToolExecution && (terminal.promptErrorSource === "compaction" || terminal.timedOutDuringCompaction)) return "paused";
	if ((params.aborted || params.timedOut) && params.payloadCount === 0) return "blocked";
	if (resolveCurrentAttemptAssistant(params.attempt)?.stopReason === "error") return "blocked";
	return "working";
}
//#endregion
//#region src/agents/embedded-agent-runner/run/attempt-result.ts
/** Keeps attempt-owned state available while retry attempts replace their result object. */
function createAttemptCarryover() {
	let latestMcpAppChannelView;
	let latestMcpConnectAction;
	let heartbeatToolResponse;
	let modelAttempt;
	return {
		apply(attempt) {
			modelAttempt = attempt.modelAttempt;
			latestMcpAppChannelView = attempt.latestMcpAppChannelView ?? latestMcpAppChannelView;
			attempt.latestMcpAppChannelView = latestMcpAppChannelView;
			latestMcpConnectAction = attempt.latestMcpConnectAction ?? latestMcpConnectAction;
			attempt.latestMcpConnectAction = latestMcpConnectAction;
			heartbeatToolResponse = attempt.heartbeatToolResponse ?? heartbeatToolResponse;
			attempt.heartbeatToolResponse = heartbeatToolResponse;
		},
		get modelAttempt() {
			return modelAttempt;
		}
	};
}
/**
* Captures the settled transcript the tool-free finalizer needs when a settled
* post-tool turn dies on its final provider call. The consumer fails closed
* without this context, so the attempt-result owner has to supply it; the codex
* app-server harness already does the same for its own attempts.
*/
function resolveSettledTurnFinalizationContext(params) {
	const terminal = projectAgentRunAttemptTerminal(params.terminal);
	const failure = terminal.promptErrorSource === "prompt" ? terminal.promptError : params.assistant?.stopReason === "error" ? {
		message: params.assistant.errorMessage,
		code: params.assistant.errorCode
	} : void 0;
	if (terminal.aborted || terminal.timedOut || terminal.timedOutDuringCompaction || terminal.timedOutDuringToolExecution || terminal.promptErrorSource !== null && terminal.promptErrorSource !== "prompt" || !isTransientSettledTurnFailure(failure)) return;
	if (hasComposedVisibleAnswerAfterSettledTools(params)) return;
	if (!params.messagesSnapshot.some((message) => message.role === "toolResult")) return;
	return {
		source: "openclaw-transcript",
		messages: Object.freeze([...params.messagesSnapshot])
	};
}
function isTransientSettledTurnFailure(failure) {
	if (isTransientNetworkError(failure)) return true;
	const message = typeof failure === "object" && failure !== null && "message" in failure && typeof failure.message === "string" ? failure.message.trim() : "";
	return INCOMPLETE_ASSISTANT_STREAM_RE.test(message) || TERMINATED_TRANSPORT_MESSAGE_RE.test(message);
}
function completeEmbeddedAttemptResult(input, settled, prompt) {
	const { attempt } = input;
	const { sessionRuntime, bootstrap, systemPrompt } = input.prepared;
	const { agentSession: { clientToolCallSlots, hasDeliveredSourceReply, hookRunner }, trajectoryRecorder } = sessionRuntime;
	const { subscription, deferredLifecycleOwner } = input.preparedStreamRuntime.stream;
	const { bootstrapPromptWarning } = bootstrap;
	const hookAgentId = input.setup.sessionAgentId;
	const state = {
		terminal: input.state.terminal,
		preflightRecovery: prompt.preflightRecovery,
		sessionIdUsed: prompt.sessionIdUsed,
		sessionFileUsed: prompt.sessionFileUsed,
		diagnosticTrace: input.diagnostics.diagnosticTrace,
		systemPromptReport: systemPrompt.systemPromptReport,
		finalPromptText: prompt.finalPromptText,
		messagesSnapshot: prompt.messagesSnapshot,
		...prompt.beforeAgentFinalizeRevisionReason ? { beforeAgentFinalizeRevisionReason: prompt.beforeAgentFinalizeRevisionReason } : {},
		lastAssistant: settled.lastAssistant,
		currentAttemptAssistant: settled.currentAttemptAssistant,
		currentAttemptCompletedAssistant: settled.currentAttemptCompletedAssistant,
		hasSuccessfulModelResponse: subscription.hasSuccessfulModelResponse(),
		successfulNestedToolNames: settled.successfulNestedToolNames,
		attemptUsage: settled.attemptUsage,
		promptCache: sessionRuntime.state.promptCache,
		contextBudgetStatus: prompt.contextBudgetStatus,
		yieldDetected: input.lifecycle.readYieldState().yieldDetected,
		yieldAcknowledgment: input.lifecycle.readYieldState().yieldAcknowledgment,
		yieldMessageWaitRegistered: input.lifecycle.readYieldState().yieldMessageWaitRegistered,
		didDeliverSourceReplyViaMessageTool: hasDeliveredSourceReply()
	};
	const terminal = projectAgentRunAttemptTerminal(state.terminal);
	const { assistantTexts, setTerminalLifecycleMeta } = subscription;
	const evidence = readSubscriptionCompletionEvidence(subscription);
	if (attempt.operation !== "settled-tool-finalization" && hookRunner?.hasHooks("llm_output") && terminal.promptErrorSource !== "hook:before_agent_run") {
		const contextWindow = {
			...attempt.contextWindowInfo?.tokens ? { contextTokenBudget: attempt.contextWindowInfo.tokens } : {},
			...attempt.contextWindowInfo?.source ? { contextWindowSource: attempt.contextWindowInfo.source } : {},
			...attempt.contextWindowInfo?.referenceTokens ? { contextWindowReferenceTokens: attempt.contextWindowInfo.referenceTokens } : {}
		};
		hookRunner.runLlmOutput({
			runId: attempt.runId,
			sessionId: attempt.sessionId,
			provider: attempt.provider,
			model: attempt.modelId,
			...contextWindow,
			resolvedRef: attempt.runtimePlan?.observability.resolvedRef ?? `${attempt.provider}/${attempt.modelId}`,
			...attempt.runtimePlan?.observability.harnessId ? { harnessId: attempt.runtimePlan.observability.harnessId } : {},
			assistantTexts,
			lastAssistant: state.lastAssistant,
			usage: state.attemptUsage
		}, {
			...buildEmbeddedAgentHookContext(attempt, hookAgentId, freezeDiagnosticTraceContext(state.diagnosticTrace)),
			...contextWindow
		}).catch((err) => {
			log$7.warn(`llm_output hook failed: ${String(err)}`);
		});
	}
	const { messagingToolSentMediaUrls } = evidence;
	const sentMediaUrls = new Set(messagingToolSentMediaUrls.map((url) => url.trim()));
	const toolAutoDeliveryMediaUrls = subscription.getToolAutoDeliveryMediaUrls().filter((url) => !sentMediaUrls.has(url.trim()));
	const observedReplayMetadata = buildAttemptReplayMetadata({
		...evidence,
		toolMetas: []
	});
	const replayMetadata = replayMetadataFromState(observeReplayMetadata(subscription.getReplayState(), observedReplayMetadata));
	const currentAttemptReplayMetadata = buildAttemptReplayMetadata(evidence);
	const completedClientToolCalls = clientToolCallSlots.flatMap((slot) => slot.completed && slot.params ? [{
		name: slot.name,
		params: slot.params
	}] : []);
	const clientToolCalls = completedClientToolCalls.length > 0 ? completedClientToolCalls : void 0;
	const terminalAssistant = state.currentAttemptAssistant;
	const closingText = terminalAssistant ? extractEmbeddedAssistantText(terminalAssistant).trim() : "";
	const progressIsReply = subscription.endsWithSourceProgress() && state.terminal.kind === "ok" && terminalAssistant?.stopReason === "stop" && (!closingText || isSilentReplyText(closingText, "NO_REPLY"));
	const completeLastProgress = (sends) => {
		const index = sends.findLastIndex((send) => send.sourceReplyFinal === false);
		return progressIsReply && index >= 0 ? sends.with(index, Object.assign({}, sends[index], { sourceReplyFinal: true })) : sends;
	};
	const messagingToolSourceReplyPayloads = completeLastProgress(evidence.messagingToolSourceReplyPayloads);
	const settledTurnFinalizationContext = resolveSettledTurnFinalizationContext({
		assistant: state.currentAttemptCompletedAssistant ?? state.currentAttemptAssistant,
		assistantTexts,
		messagesSnapshot: state.messagesSnapshot,
		terminal: state.terminal
	});
	const assistant = resolveCurrentAttemptAssistant(state);
	let textToolCallAttempt = false;
	if (state.terminal.kind === "ok" && assistant?.stopReason === "stop" && !assistant.content.some(isRunnerToolCallBlock)) {
		const allowedToolNames = input.prepared.toolCatalog.toolSearchRunPlan.liveAllowedToolNames;
		textToolCallAttempt = allowedToolNames.size > 0 && isPlainTextToolCallAttempt(extractAssistantTranscriptSourceText(assistant) ?? "", (name) => Boolean(resolveToolCallName(name, allowedToolNames, void 0, true)));
	}
	const result = {
		...textToolCallAttempt ? { textToolCallAttempt: true } : {},
		...state,
		...evidence,
		sandboxRuntime: input.setup.sandboxRuntime,
		...settledTurnFinalizationContext ? { settledTurnFinalizationContext } : {},
		replayMetadata,
		currentAttemptReplayMetadata,
		assistantTurns: subscription.getAssistantTurnCount(),
		setTerminalLifecycleMeta,
		bootstrapPromptWarningSignaturesSeen: bootstrapPromptWarning.warningSignaturesSeen,
		bootstrapPromptWarningSignature: bootstrapPromptWarning.signature,
		answerSegments: subscription.answerSegments,
		latestMcpAppChannelView: subscription.getLatestMcpAppChannelView(),
		latestMcpConnectAction: subscription.getLatestMcpConnectAction(),
		lastAssistantTextMessageIndex: subscription.getLastAssistantTextMessageIndex(),
		messagingToolSentTargets: completeLastProgress(evidence.messagingToolSentTargets),
		messagingToolSourceReplyPayloads,
		sourceReplyDeliveryState: progressIsReply ? "delivered" : evidence.sourceReplyDeliveryState,
		cloudCodeAssistFormatError: Boolean(state.lastAssistant?.errorMessage && isCloudCodeAssistFormatError(state.lastAssistant.errorMessage)),
		compactionCount: subscription.getCompactionCount(),
		compactionTokensAfter: subscription.getLastCompactionTokensAfter(),
		clientToolCalls,
		yieldDetected: state.yieldDetected || void 0
	};
	const resultEvidence = {
		...result,
		yieldDetected: state.yieldDetected
	};
	const { didSendViaMessagingTool: _coarseDelivery, ...terminalEvidence } = resultEvidence;
	const hasTerminalOutput = hasAttemptTerminalState(terminalEvidence);
	const pendingToolMediaPayloadCount = evidence.toolMediaUrls?.some((url) => url.trim().length > 0) || evidence.toolAudioAsVoice === true ? 1 : 0;
	const visibleBlockReplyCount = subscription.getVisibleBlockReplyCount();
	const silentToolResultReplyPayload = resolveSilentToolResultReplyPayload({
		isCronTrigger: attempt.trigger === "cron",
		payloadCount: pendingToolMediaPayloadCount,
		aborted: terminal.aborted,
		timedOut: terminal.timedOut,
		attempt: resultEvidence
	});
	const synthesizedPayloadCount = visibleBlockReplyCount + pendingToolMediaPayloadCount + messagingToolSourceReplyPayloads.length + (silentToolResultReplyPayload ? 1 : 0);
	const emptyAssistantReplyIsSilent = shouldTreatEmptyAssistantReplyAsSilent({
		terminalReplyExpectation: resolveReplyExpectation(attempt),
		payloadCount: 0,
		aborted: terminal.aborted,
		timedOut: terminal.timedOut,
		attempt: resultEvidence
	});
	return finalizeEmbeddedAttempt({
		result: toolAutoDeliveryMediaUrls.length > 0 ? markCoreTtsAttemptResult(result, toolAutoDeliveryMediaUrls, attempt.admittedRunContext.operationalRunInstance) : result,
		trajectoryRecorder,
		deferredLifecycleOwner,
		synthesizedPayloadCount,
		emptyAssistantReplyIsSilent,
		hasTerminalOutput,
		silentExpected: attempt.silentExpected
	});
}
//#endregion
//#region src/agents/embedded-agent-runner/provider-prompt-state.ts
const providerPromptStates = resolveGlobalSingleton(Symbol.for("openclaw.providerPromptStates"), () => /* @__PURE__ */ new Map());
/** Returns run-local retry state; restarts and new run ids intentionally have no baseline. */
function getProviderPromptState(runId) {
	const state = providerPromptStates.get(runId) ?? {};
	providerPromptStates.set(runId, state);
	return state;
}
function clearProviderPromptState(runId) {
	providerPromptStates.delete(runId);
}
const promptHashPool = resolveGlobalSingleton(Symbol.for("openclaw.providerPromptHashPool"), () => new WorkerTaskPool({
	workerUrl: resolveRuntimeProcessEntrypointUrl("providerPromptState"),
	workerClass: "compute",
	sharedCompute: true
}));
function providerPromptWorkerBytes(value, seen = /* @__PURE__ */ new WeakSet()) {
	if (value === null || typeof value !== "object") {
		if (typeof value === "function" || typeof value === "symbol" || typeof value === "bigint") return;
		return typeof value === "string" ? value.length * 2 : 8;
	}
	if (isProxy(value) || "toJSON" in value) return;
	const array = Array.isArray(value);
	const prototype = Object.getPrototypeOf(value);
	if (array && (prototype !== Array.prototype || Object.hasOwn(value, Symbol.iterator)) || !array && prototype !== Object.prototype && prototype !== null) return;
	if (seen.has(value)) return 0;
	seen.add(value);
	const keys = Object.keys(value);
	if (array && keys.length !== value.length) return;
	let bytes = 64;
	for (const [index, key] of keys.entries()) {
		if (array && key !== String(index)) return;
		const descriptor = Object.getOwnPropertyDescriptor(value, key);
		const childBytes = "value" in descriptor ? providerPromptWorkerBytes(descriptor.value, seen) : void 0;
		if (childBytes === void 0) return;
		bytes += key.length * 2 + 16 + childBytes;
	}
	return bytes;
}
/** Captures the final provider request identity without retaining payload content. */
async function recordProviderPrompt(params) {
	const scope = stableStringify({
		provider: params.model.provider,
		api: params.model.api,
		model: params.model.id,
		baseUrl: params.model.baseUrl,
		effectiveContextTokenBudget: params.effectiveContextTokenBudget
	});
	const inputBytes = providerPromptWorkerBytes(params.payload);
	const task = {
		payload: params.payload,
		encode: params.encode === true
	};
	const payload = inputBytes !== void 0 ? await promptHashPool.run(() => task, {
		inputBytes,
		signal: params.signal
	}).catch((error) => {
		if (params.signal?.aborted) throw error;
		return prepareProviderPrompt(task);
	}) : prepareProviderPrompt(task);
	const snapshot = {
		scopeDigest: sha256Hex(scope),
		digest: payload.digest,
		byteWeight: payload.byteWeight,
		...payload.cachePrefix ? { cachePrefix: payload.cachePrefix } : {},
		...payload.wire ? { wire: payload.wire } : {}
	};
	const rejected = params.state.lastRejected;
	if (rejected?.scopeDigest === snapshot.scopeDigest && rejected.digest === snapshot.digest) throw new Error(`Context overflow: refusing to resend the byte-identical provider payload after a context rejection (payloadBytes=${snapshot.byteWeight}).`);
	params.state.lastAttempt = snapshot;
	return payload.encoded;
}
function markLastProviderPromptContextRejected(state) {
	const attempted = state.lastAttempt;
	if (attempted) state.lastRejected = attempted;
	return attempted;
}
/** Hashes the post-onPayload body for context-retry admission. */
function wrapStreamFnWithProviderPromptState(params) {
	return async (model, context, options) => {
		params.state.lastAttempt = void 0;
		let attempts = 0;
		let promptObservation;
		const originalOnPayload = options?.onPayload;
		const observedOptions = {
			...options,
			onPayload: async (payload, payloadModel) => {
				const replacement = await originalOnPayload?.(payload, payloadModel);
				const finalPayload = replacement === void 0 ? payload : replacement;
				if (modelRequestBodyState(observedOptions).enabled) return finalPayload;
				await recordProviderPrompt({
					state: params.state,
					model: payloadModel,
					payload: finalPayload,
					signal: options?.signal,
					effectiveContextTokenBudget: params.effectiveContextTokenBudget
				});
				return finalPayload;
			},
			onResponse: async (response, responseModel) => {
				const wire = params.state.lastAttempt?.wire;
				if (wire) {
					const headers = {};
					for (const name of [
						"x-request-id",
						"openai-model",
						"x-openai-model",
						"x-openai-route",
						"x-openai-account",
						"openai-organization",
						"openai-project",
						"x-openai-region",
						"x-compute-rgn",
						"x-region",
						"x-served-by"
					]) {
						const value = response.headers[name];
						if (value !== void 0) headers[name] = sha256Hex(value).slice(0, 16);
					}
					const processing = response.headers["openai-processing-ms"];
					if (processing && /^\d{1,12}(?:\.\d{1,6})?$/.test(processing)) headers["openai-processing-ms"] = Number(processing);
					wire.response = {
						status: response.status,
						headers
					};
				}
				await options?.onResponse?.(response, responseModel);
			}
		};
		modelRequestBodyState(observedOptions).encode = async (payload) => {
			const encoded = await recordProviderPrompt({
				state: params.state,
				model,
				payload,
				signal: options?.signal,
				effectiveContextTokenBudget: params.effectiveContextTokenBudget,
				encode: true
			});
			const wire = params.state.lastAttempt?.wire;
			if (wire) {
				wire.routeHash = sha256Hex(model.baseUrl).slice(0, 16);
				wire.attempts = ++attempts;
				wire.retried = attempts > 1;
				wire.egress = promptObservation?.egress;
				wire.payloadVariant = promptObservation?.payloadVariant;
			}
			return encoded;
		};
		responsesPromptObserver.set(observedOptions, (observation) => {
			promptObservation = observation;
			params.recordEvent?.("provider.prompt.observed", { ...observation });
		});
		return params.streamFn(model, context, observedOptions);
	};
}
//#endregion
//#region src/agents/embedded-agent-runner/run/attempt-async-tasks.ts
const DEFAULT_ASYNC_TASK_POLL_INTERVAL_MS = 500;
const COMPLETION_REQUIRED_TASK_KINDS = /* @__PURE__ */ new Set([
	"image_generation",
	"music_generation",
	"video_generation"
]);
function createAbortError(signal) {
	return createAbortError$1("aborted", { cause: signal.reason });
}
function throwIfAborted(signal) {
	if (signal?.aborted) throw createAbortError(signal);
}
async function sleepWithAbort(ms, signal, sleepFn) {
	if (!signal) {
		await sleepFn(ms);
		return;
	}
	throwIfAborted(signal);
	await withAbortListener(signal, () => sleepFn(ms), createAbortError);
}
function isPendingCompletionTask(task) {
	return COMPLETION_REQUIRED_TASK_KINDS.has(task.taskKind) && task.completionDelivery !== "queued" && !isTerminalMediaGenerationStatus(task.status);
}
function* iterateAsyncTaskRunIds(toolMetas, sessionKey) {
	for (const meta of toolMetas) {
		const runId = meta.asyncStarted === true ? meta.asyncTaskRunId?.trim() : void 0;
		if (runId && findMediaGenerationOperation(runId)?.completionDelivery !== "queued") yield runId;
	}
	const normalizedSessionKey = sessionKey?.trim();
	if (!normalizedSessionKey) return;
	for (const task of listMediaGenerationOperations(normalizedSessionKey)) if (isPendingCompletionTask(task)) {
		const runId = task.runId?.trim();
		if (runId) yield runId;
	}
}
function requiresCompletionRequiredAsyncTaskWait(params) {
	throwIfAborted(params.abortSignal);
	const sessionKey = params.sessionKey?.trim();
	if (!sessionKey || !isCronRunSessionKey(sessionKey)) return false;
	return iterateAsyncTaskRunIds(params.toolMetas, sessionKey).next().done === false;
}
function shouldWaitForCompletionRequiredAsyncTasks(params) {
	if (params.yieldDetected === true) return false;
	return requiresCompletionRequiredAsyncTaskWait(params);
}
async function waitForCompletionRequiredAsyncTasks(params) {
	const now = params.now ?? Date.now;
	const sleepFn = params.sleep ?? sleep;
	const pollIntervalMs = params.pollIntervalMs ?? (isFastTestRuntimeEnv() ? 10 : DEFAULT_ASYNC_TASK_POLL_INTERVAL_MS);
	const waitedRunIds = /* @__PURE__ */ new Set();
	const timedOutRunIds = /* @__PURE__ */ new Set();
	const terminalTasksByRunId = /* @__PURE__ */ new Map();
	waitForTasks: while (true) {
		throwIfAborted(params.abortSignal);
		const runIds = [...new Set(iterateAsyncTaskRunIds(params.getToolMetas(), params.sessionKey))].filter((runId) => !waitedRunIds.has(runId));
		if (runIds.length === 0) break;
		for (const runId of runIds) waitedRunIds.add(runId);
		let pendingRunIds = runIds;
		while (pendingRunIds.length > 0) {
			throwIfAborted(params.abortSignal);
			pendingRunIds = pendingRunIds.filter((runId) => {
				const task = findMediaGenerationOperation(runId);
				if (task?.completionDelivery === "queued") return false;
				if (!task || !isTerminalMediaGenerationStatus(task.status)) return true;
				const taskRunId = task.runId?.trim();
				if (taskRunId) terminalTasksByRunId.set(taskRunId, task);
				return false;
			});
			if (pendingRunIds.length === 0) break;
			const deadlineAtMs = params.getDeadlineAtMs();
			const remainingMs = deadlineAtMs === void 0 ? pollIntervalMs : deadlineAtMs - now();
			if (remainingMs <= 0) {
				for (const runId of pendingRunIds) timedOutRunIds.add(runId);
				break waitForTasks;
			}
			await sleepWithAbort(Math.min(pollIntervalMs, remainingMs), params.abortSignal, sleepFn);
		}
	}
	return {
		waitedRunIds: [...waitedRunIds],
		timedOutRunIds: [...timedOutRunIds],
		terminalTasks: [...terminalTasksByRunId.values()]
	};
}
//#endregion
//#region src/agents/embedded-agent-runner/run/compaction-retry-aggregate-timeout.ts
function hasActiveCompactionRetryWork(params) {
	return params.isCompactionInFlight || params.isSessionStreaming;
}
/**
* Waits for compaction retry completion with an aggregate timeout so a lost
* retry resolution cannot hold the session lane indefinitely.
*/
async function waitForCompactionRetryWithAggregateTimeout(params) {
	const timeoutMs = resolveTimerTimeoutMs(params.aggregateTimeoutMs, 1);
	const waitPromise = params.waitForCompactionRetry().then(() => ({ kind: "done" }), (error) => ({
		kind: "rejected",
		error
	}));
	while (true) {
		let timer;
		try {
			const result = await params.abortable(Promise.race([waitPromise, new Promise((resolve) => {
				timer = setTimeout(() => resolve("timeout"), timeoutMs);
			})]));
			if (result !== "timeout") {
				if (result.kind === "done") return { timedOut: false };
				throw result.error;
			}
			if (params.isCompactionRetryStillActive?.()) continue;
			return { timedOut: true };
		} finally {
			if (timer !== void 0) clearTimeout(timer);
		}
	}
}
//#endregion
//#region src/agents/embedded-agent-runner/run/provider-review-continuation.ts
function countUserInputSlots(input) {
	return input.reduce((count, item) => count + (isRecord(item) && item.role === "user" ? 1 : 0), 0);
}
/** Acknowledgment decorates one request; later tool calls retain ordinary transport behavior. */
function wrapStreamFnWithProviderReviewContinuation(params) {
	const acknowledgment = params.acknowledgment;
	if (!acknowledgment) return params.streamFn;
	if (readProviderReviewAcknowledgment(acknowledgment).phase === "accepted") throw new Error("Provider review continuation cannot start another transport attempt");
	let pendingCallStarted = false;
	let acceptedByThisWrapper = false;
	return async (model, context, options) => {
		const transportSignals = /* @__PURE__ */ new Set();
		const assertCurrent = () => {
			options?.signal?.throwIfAborted();
			for (const signal of transportSignals) signal.throwIfAborted();
			params.assertCurrent();
			readProviderReviewAcknowledgment(acknowledgment);
		};
		assertCurrent();
		const snapshot = readProviderReviewAcknowledgment(acknowledgment);
		const assertWorkStart = () => assertSessionProviderReviewWorkStart({
			target: snapshot.target,
			acknowledgment,
			runId: params.runId,
			provider: model.provider,
			model: model.id,
			runtimeId: "openclaw",
			api: model.api,
			assertCurrent
		});
		await assertWorkStart();
		assertCurrent();
		if (snapshot.phase === "accepted") {
			if (!acceptedByThisWrapper) throw new Error("Provider review continuation belongs to another transport attempt");
			return params.streamFn(model, context, options);
		}
		if (pendingCallStarted || model.provider !== "openai" || model.api !== "openai-chatgpt-responses") throw new Error("Provider review continuation cannot be retried or change transport");
		const message = snapshot.review.review?.continuation?.message;
		const latestIndex = context.messages.findLastIndex((item) => !hasRuntimeContextMarker(item));
		const latest = context.messages[latestIndex];
		if (!message || latest?.role !== "user") throw new Error("Provider review continuation requires its exact next user input");
		const continuationInput = {
			...latest,
			content: message
		};
		const isContinuationInput = bindResponsesInputMessage(continuationInput);
		pendingCallStarted = true;
		let payloadPrepared = false;
		let dispatched = false;
		let acceptedResponseId;
		let acceptance;
		const requestOptions = {
			...options,
			onPayload: async (payload, payloadModel) => {
				if (payloadPrepared) throw new Error("Provider review continuation cannot rebuild or retry its request");
				if (!isRecord(payload) || !Array.isArray(payload.input)) throw new Error("Provider continuation payload has no user input");
				const inputIndex = payload.input.findIndex(isContinuationInput);
				if (inputIndex < 0) throw new Error("Provider continuation payload changed its next user input");
				const inputSuffix = structuredClone(payload.input.slice(inputIndex + 1));
				const userInputSlots = countUserInputSlots(payload.input);
				const replacement = await options?.onPayload?.(payload, payloadModel);
				await assertWorkStart();
				assertCurrent();
				const finalPayload = replacement === void 0 ? payload : replacement;
				if (!isRecord(finalPayload) || !Array.isArray(finalPayload.input)) throw new Error("Provider continuation payload has no user input");
				if (payloadModel.provider !== snapshot.review.provider || payloadModel.id !== snapshot.review.model || payloadModel.api !== snapshot.review.api || finalPayload.model !== snapshot.review.model) throw new Error("Provider continuation payload changed the reviewed runtime or model");
				const continuationInputs = finalPayload.input.filter(isContinuationInput);
				const nextInput = continuationInputs[0];
				const nextInputIndex = finalPayload.input.indexOf(nextInput);
				const finalInputSuffix = finalPayload.input.slice(nextInputIndex + 1);
				if (continuationInputs.length !== 1 || !isRecord(nextInput) || nextInput.role !== "user" || !isDeepStrictEqual(finalInputSuffix, inputSuffix)) {
					if (countUserInputSlots(finalPayload.input) > userInputSlots && finalInputSuffix.length > inputSuffix.length) throw new Error("Provider continuation payload added user input");
					throw new Error("Provider continuation payload changed its next user input");
				}
				if (countUserInputSlots(finalPayload.input) > userInputSlots) throw new Error("Provider continuation payload added user input");
				const rawMetadata = finalPayload.client_metadata;
				if (rawMetadata !== void 0 && !isRecord(rawMetadata)) throw new Error("Provider continuation metadata is malformed");
				const metadata = rawMetadata ?? {};
				const rawTurnMetadata = metadata["x-codex-turn-metadata"];
				let turnMetadata = {};
				if (rawTurnMetadata !== void 0) {
					const parsed = typeof rawTurnMetadata === "string" ? safeParseJsonRecord(rawTurnMetadata) : void 0;
					if (!parsed) throw new Error("Provider continuation turn metadata is malformed");
					turnMetadata = parsed;
				}
				payloadPrepared = true;
				return {
					...finalPayload,
					input: finalPayload.input.with(nextInputIndex, {
						...nextInput,
						content: [{
							type: "input_text",
							text: message
						}]
					}),
					client_metadata: {
						...metadata,
						"x-codex-turn-metadata": JSON.stringify({
							...turnMetadata,
							misalignment_override: JSON.stringify({ timestamp: Date.now() })
						})
					}
				};
			}
		};
		responsesRequestLifecycle.set(requestOptions, {
			assertCurrent,
			beforeDispatch: async (signal) => {
				if (dispatched || !payloadPrepared) throw new Error("Provider review continuation already dispatched or was not prepared");
				if (signal) transportSignals.add(signal);
				await assertWorkStart();
				assertCurrent();
				if (dispatched) throw new Error("Provider review continuation already dispatched");
				dispatched = true;
			},
			accepted: (responseId, signal) => {
				if (signal) transportSignals.add(signal);
				assertCurrent();
				if (!dispatched || acceptedResponseId && acceptedResponseId !== responseId) throw new Error("Provider continuation response does not match its request");
				if (!acceptance) {
					acceptedResponseId = responseId;
					acceptance = acceptProviderReviewAcknowledgment(acknowledgment, {
						runId: params.runId,
						assertCurrent
					}).then(() => {
						assertCurrent();
						acceptedByThisWrapper = true;
					});
				}
				return acceptance;
			},
			settle: async () => {
				await acceptance;
			}
		});
		return params.streamFn(model, {
			...context,
			messages: context.messages.with(latestIndex, continuationInput)
		}, requestOptions);
	};
}
//#endregion
//#region src/agents/embedded-agent-runner/run/attempt-stream-settle.ts
async function settleEmbeddedAttemptStream(input) {
	const { attempt, activeSession, sessionManager, subscription, state } = input;
	try {
		if (shouldWaitForCompletionRequiredAsyncTasks({
			sessionKey: attempt.sessionKey,
			toolMetas: subscription.toolMetas,
			yieldDetected: state.yieldAborted,
			abortSignal: input.runAbortSignal
		})) {
			const asyncTaskWait = await waitForCompletionRequiredAsyncTasks({
				getToolMetas: () => subscription.toolMetas.filter((entry) => typeof entry.toolName === "string" && entry.toolName.trim().length > 0),
				sessionKey: attempt.sessionKey,
				getDeadlineAtMs: () => {
					const deadlineAtMs = input.getRunAbortDeadlineAtMs();
					return deadlineAtMs === void 0 ? void 0 : Math.max(Date.now(), deadlineAtMs - 500);
				},
				abortSignal: input.runAbortSignal
			});
			if (asyncTaskWait.timedOutRunIds.length > 0 && !input.readLifecycleState().aborted) {
				state.promptError = /* @__PURE__ */ new Error(`Timed out waiting for async task completion: ${asyncTaskWait.timedOutRunIds.join(", ")}`);
				state.promptErrorSource = "prompt";
			}
		}
	} catch (err) {
		const lifecycle = input.readLifecycleState();
		if (!lifecycle.timedOut && !lifecycle.aborted || !isRunnerAbortError(err)) throw err;
	}
	const wasCompactingBefore = activeSession.isCompacting;
	const snapshot = activeSession.messages.slice();
	const wasCompactingAfter = activeSession.isCompacting;
	const preCompactionSnapshot = wasCompactingBefore || wasCompactingAfter ? null : snapshot;
	const preCompactionSessionId = activeSession.sessionId;
	const aggregateTimeoutMs = 6e4;
	try {
		if (input.onBlockReplyFlush) {
			const currentAssistant = findCurrentAttemptAssistantMessage({
				messagesSnapshot: snapshot,
				prePromptMessageCount: input.prePromptMessageCount
			});
			const attemptAccepted = !state.promptError && !input.readLifecycleState().aborted && !input.readLifecycleState().timedOut && !state.yieldAborted && currentAssistant?.stopReason === "stop";
			await joinWithRunLivenessDeadline({
				joinWork: () => input.onBlockReplyFlush?.({
					reason: "pre_compaction",
					attemptAccepted
				}),
				runAbortSignal: input.runAbortSignal,
				onTimeout: () => {
					log$7.warn(`block-reply flush did not settle within ${RUN_LIVENESS_JOIN_TIMEOUT_MS}ms; proceeding with settlement: runId=${attempt.runId}`);
				}
			});
		}
		if ((state.yieldAborted ? { timedOut: false } : await waitForCompactionRetryWithAggregateTimeout({
			waitForCompactionRetry: subscription.waitForCompactionRetry,
			abortable: input.abortable,
			aggregateTimeoutMs,
			isCompactionRetryStillActive: () => hasActiveCompactionRetryWork({
				isCompactionInFlight: subscription.isCompactionInFlight(),
				isSessionStreaming: activeSession.isStreaming
			})
		})).timedOut) {
			input.markTimedOutDuringCompaction();
			if (!input.isProbeSession) log$7.warn(`compaction retry aggregate timeout (${aggregateTimeoutMs}ms): proceeding with pre-compaction state runId=${attempt.runId} sessionId=${attempt.sessionId}`);
		}
	} catch (err) {
		if (!isRunnerAbortError(err)) throw err;
		if (!state.promptError) {
			state.promptError = err;
			state.promptErrorSource = "compaction";
		}
		if (!input.isProbeSession) log$7.debug(`compaction wait aborted: runId=${attempt.runId} sessionId=${attempt.sessionId}`);
	}
	const captureStreamSnapshot = () => {
		const { timedOutDuringCompaction } = input.readLifecycleState();
		const compactionOccurredThisAttempt = subscription.getCompactionCount() > 0;
		const snapshotSelection = selectCompactionTimeoutSnapshot({
			timedOutDuringCompaction,
			preCompactionSnapshot,
			preCompactionSessionId,
			currentSnapshot: activeSession.messages.slice(),
			currentSessionId: activeSession.sessionId
		});
		if (timedOutDuringCompaction && !input.isProbeSession) log$7.warn(`using ${snapshotSelection.source} snapshot: timed out during compaction runId=${attempt.runId} sessionId=${attempt.sessionId}`);
		const messagesSnapshot = snapshotSelection.messagesSnapshot;
		const lastAssistant = messagesSnapshot.findLast((message) => message.role === "assistant");
		const currentAttemptAssistant = findCurrentAttemptAssistantMessage({
			messagesSnapshot,
			prePromptMessageCount: input.prePromptMessageCount
		});
		const currentAttemptCompletedAssistant = subscription.getCurrentAttemptAssistant();
		const attemptUsage = subscription.getUsageTotals();
		const transcriptUsageSnapshot = findLatestUncompactedAttemptUsageSnapshot({
			messagesSnapshot,
			prePromptMessageCount: input.prePromptMessageCount,
			compactionOccurred: compactionOccurredThisAttempt
		});
		const completedAssistantUsage = normalizeUsage(currentAttemptCompletedAssistant?.usage);
		const lastCallUsage = subscription.getLastAssistantUsage() ?? (hasNonzeroUsage(completedAssistantUsage) ? completedAssistantUsage : transcriptUsageSnapshot?.usage);
		const usageAssistant = hasNonzeroUsage(completedAssistantUsage) ? currentAttemptCompletedAssistant : transcriptUsageSnapshot?.assistant;
		const fallbackLastCacheTouchAt = readLastCacheTtlTimestamp(sessionManager, {
			provider: attempt.provider,
			modelId: attempt.modelId
		});
		const promptCache = buildContextEnginePromptCacheInfo({
			retention: input.cache.retention,
			lastCallUsage,
			observation: input.cache.getObservation?.(),
			lastCacheTouchAt: resolvePromptCacheTouchTimestamp({
				lastCallUsage,
				assistantTimestamp: usageAssistant?.timestamp,
				fallbackLastCacheTouchAt
			})
		});
		return {
			compactionOccurredThisAttempt,
			messagesSnapshot,
			sessionIdUsed: snapshotSelection.sessionIdUsed,
			lastAssistant,
			currentAttemptAssistant,
			currentAttemptCompletedAssistant,
			attemptUsage,
			lastCallUsage,
			promptCache
		};
	};
	let captured;
	try {
		captured = await input.withOwnedTranscriptWrite(() => withSessionManagerAppend(sessionManager, async () => {
			const { timedOutDuringCompaction } = input.readLifecycleState();
			const compactionOccurredThisAttempt = subscription.getCompactionCount() > 0;
			const cacheTtlCompat = attempt.model.compat;
			await appendAttemptCacheTtlIfNeeded({
				sessionManager,
				timedOutDuringCompaction,
				compactionOccurredThisAttempt,
				config: attempt.config,
				provider: attempt.provider,
				modelId: attempt.modelId,
				modelApi: attempt.model.api,
				modelRoute: {
					baseUrl: attempt.model.baseUrl,
					supportsPromptCacheKey: cacheTtlCompat?.supportsPromptCacheKey
				},
				isCacheTtlEligibleProvider,
				toolResultPromptProjectionState: input.toolResultPromptProjectionState
			});
			if (timedOutDuringCompaction) {
				const removedEntries = await normalizeCompactionRecoveryTranscriptTail({
					activeSession,
					sessionManager
				});
				if (removedEntries > 0 && !input.isProbeSession) log$7.warn(`normalized compaction timeout transcript tail: removedEntries=${removedEntries} runId=${attempt.runId} sessionId=${attempt.sessionId}`);
			}
			const streamSnapshot = captureStreamSnapshot();
			if (state.promptError && state.promptErrorSource === "prompt" && !streamSnapshot.compactionOccurredThisAttempt && !attempt.abortSignal?.aborted) try {
				await sessionManager.appendCustomEntryAsync("openclaw:prompt-error", {
					timestamp: Date.now(),
					runId: attempt.runId,
					sessionId: attempt.sessionId,
					provider: attempt.provider,
					model: attempt.modelId,
					api: attempt.model.api,
					error: formatErrorMessage(state.promptError)
				});
			} catch (entryErr) {
				attempt.abortSignal?.throwIfAborted();
				input.runAbortSignal.throwIfAborted();
				log$7.warn(`failed to persist prompt error entry: ${String(entryErr)}`);
			}
			if (input.shouldFlushForContextEngine) sessionManager.flushPendingPersistence();
			return streamSnapshot;
		}));
	} catch (error) {
		const abortedByAttempt = attempt.abortSignal?.aborted && error === attempt.abortSignal.reason;
		const abortedByRun = input.runAbortSignal.aborted && error === input.runAbortSignal.reason;
		if (!abortedByAttempt && !abortedByRun) throw error;
		captured = captureStreamSnapshot();
	}
	return {
		promptError: state.promptError,
		promptErrorSource: state.promptErrorSource,
		timedOutDuringCompaction: input.readLifecycleState().timedOutDuringCompaction,
		...captured,
		successfulNestedToolNames: [...input.nestedToolActivityState.successfulToolNames]
	};
}
async function prepareEmbeddedAttemptTransport(input) {
	const attempt = input.attempt;
	const session = input.session;
	const assertAdmittedCurrent = resolveAdmittedRunActiveAssertion(attempt.admittedRunContext, input.abortSignal);
	const assertRunCurrent = input.assertCronRootCurrent ? () => {
		assertAdmittedCurrent?.();
		input.assertCronRootCurrent?.();
	} : assertAdmittedCurrent;
	const defaultSessionStreamFn = resolveEmbeddedAgentBaseStreamFn({ session });
	const resolvedTransport = resolveExplicitSettingsTransport({
		settingsManager: input.settingsManager,
		sessionTransport: session.agent.transport
	});
	const streamExtraParamsOverride = {
		...attempt.streamParams,
		fastMode: attempt.fastMode,
		...attempt.trigger === "memory" ? {
			anthropicServerCompaction: false,
			responsesServerCompaction: false
		} : {}
	};
	const selectedAuth = attempt.runtimePlan?.auth;
	const auth = selectedAuth?.selectedAuthMode ? {
		mode: selectedAuth.selectedAuthMode,
		authFlow: selectedAuth.selectedAuthFlow
	} : void 0;
	const extraParamsContext = {
		extraParamsOverride: streamExtraParamsOverride,
		thinkingLevel: input.providerThinkingLevel,
		agentId: input.sessionAgentId,
		workspaceDir: input.workspaceDir,
		model: attempt.model,
		resolvedTransport
	};
	const effectiveExtraParams = attempt.runtimePlan?.transport.resolveExtraParams(extraParamsContext) ?? resolvePreparedExtraParams({
		...extraParamsContext,
		cfg: attempt.config,
		provider: attempt.provider,
		modelId: attempt.modelId,
		providerRuntimeHandle: input.getProviderRuntimeHandle(),
		agentDir: input.agentDir,
		auth
	});
	const providerStreamFn = registerProviderStreamForModel({
		model: attempt.model,
		cfg: attempt.config,
		agentDir: input.agentDir,
		workspaceDir: input.workspaceDir,
		auth
	});
	const sessionFork = {
		runId: attempt.runId,
		sessionId: attempt.sessionId,
		agentId: input.sessionAgentId
	};
	const directProviderStreamFn = providerStreamFn ? wrapStreamFnWithMessageTransform(wrapStreamFnWithSessionFork(providerStreamFn, sessionFork), (messages) => messages, async ({ context, ...provider }) => {
		assertRunCurrent?.();
		const prepared = await materializeProviderContext({
			...provider,
			context,
			workspaceDir: input.workspaceDir,
			agentWorkspaceDir: attempt.workspaceDir,
			workspaceOnly: input.workspaceOnly,
			localRoots: input.workspaceOnly ? void 0 : getAgentScopedMediaLocalRoots(attempt.config ?? {}, input.sessionAgentId),
			onCurrentTurnImageFailure: input.onCurrentTurnImageFailure,
			sandbox: input.sandbox?.enabled && input.sandbox.fsBridge ? {
				root: input.sandbox.workspaceDir,
				bridge: input.sandbox.fsBridge
			} : void 0
		});
		assertRunCurrent?.();
		return prepared;
	}) : void 0;
	const transportApiKey = await resolveEmbeddedAgentApiKey({
		provider: attempt.model.provider,
		resolvedApiKey: attempt.resolvedApiKey,
		authStorage: attempt.authStorage
	});
	const { streamFn, strategy: streamStrategy, wrapApiKey } = selectEmbeddedAgentStream({
		currentStreamFn: defaultSessionStreamFn,
		providerStreamFn: directProviderStreamFn,
		sessionId: attempt.sessionId,
		promptCacheKey: attempt.promptCacheKey,
		signal: input.abortSignal,
		model: attempt.model,
		resolvedApiKey: attempt.resolvedApiKey,
		transportAuthAvailable: Boolean(transportApiKey?.trim()),
		authProfileId: attempt.runtimePlan?.auth.forwardedAuthProfileId,
		authStorage: attempt.authStorage,
		assertCurrent: assertRunCurrent,
		sessionFork
	});
	session.agent.streamFn = (model, context, options) => {
		const providerOptions = {
			...options,
			openclawThinkingExplicit: attempt.thinkingExplicit
		};
		return streamFn(model, context, providerOptions);
	};
	session.agent.streamFn = wrapStreamFnWithProviderPromptState({
		streamFn: session.agent.streamFn,
		...input.providerPromptState
	});
	session.agent.streamFn = wrapStreamFnWithProviderReviewContinuation({
		streamFn: session.agent.streamFn,
		acknowledgment: attempt.providerReviewAcknowledgment,
		runId: attempt.runId,
		assertCurrent: () => {
			input.abortSignal.throwIfAborted();
			assertRunCurrent?.();
		}
	});
	const providerTextTransforms = resolveProviderTextTransforms({
		provider: attempt.provider,
		config: attempt.config,
		workspaceDir: input.workspaceDir,
		runtimeHandle: input.getProviderRuntimeHandle()
	});
	if (providerTextTransforms?.input?.length) session.agent.streamFn = wrapStreamFnTextTransforms({
		streamFn: session.agent.streamFn,
		input: providerTextTransforms.input,
		transformSystemPrompt: false
	});
	const nativeWebSearchPolicyContext = {
		webSearchEnabled: attempt.disableTools !== true && attempt.toolOverrides?.webSearch !== false && (!attempt.toolExecutionAllow || isToolExecutionAllowed(attempt.toolExecutionAllow, "web_search")),
		runtimeToolAllowlist: attempt.toolsAllow,
		sessionKey: input.sandboxSessionKey,
		sandboxToolPolicy: input.sandbox?.tools,
		messageProvider: attempt.messageProvider ?? attempt.messageChannel,
		agentAccountId: attempt.agentAccountId,
		groupId: attempt.groupId,
		groupChannel: attempt.groupChannel,
		groupSpace: attempt.groupSpace,
		spawnedBy: attempt.spawnedBy,
		senderId: attempt.senderId,
		senderName: attempt.senderName,
		senderUsername: attempt.senderUsername,
		senderE164: attempt.senderE164
	};
	const { nativeWebSearchAllowedByToolPolicy } = await withPreparedSessionCapabilityRead(() => applyExtraParamsToAgent(session.agent, attempt.config, attempt.provider, attempt.modelId, streamExtraParamsOverride, input.providerThinkingLevel, input.sessionAgentId, input.workspaceDir, attempt.model, input.agentDir, resolvedTransport, {
		preparedExtraParams: effectiveExtraParams,
		modelCallUrgency: resolveModelCallUrgency(attempt),
		auth,
		nativeWebSearchPolicyContext
	}));
	if (input.codeModeControlsEnabled) session.agent.streamFn = createCodexNativeWebSearchWrapper(session.agent.streamFn, {
		config: attempt.config,
		agentDir: input.agentDir,
		agentId: input.sessionAgentId,
		...nativeWebSearchPolicyContext,
		nativeWebSearchAllowedByToolPolicy,
		codeModeToolSurfaceEnabled: true
	});
	const effectivePromptCacheRetention = resolveCacheRetention(effectiveExtraParams, attempt.provider, attempt.model.api, attempt.modelId);
	const agentTransportOverride = resolveAgentTransportOverride({
		settingsManager: input.settingsManager,
		effectiveExtraParams
	});
	const effectiveAgentTransport = agentTransportOverride ?? session.agent.transport;
	if (agentTransportOverride && session.agent.transport !== agentTransportOverride) {
		const previousTransport = session.agent.transport;
		log$7.debug(`embedded agent transport override: ${previousTransport} -> ${agentTransportOverride} (${attempt.provider}/${attempt.modelId})`);
	}
	session.agent.transport = effectiveAgentTransport;
	const contextPruning = attempt.config?.agents?.defaults?.contextPruning;
	const serverToolClearingEnabled = contextPruning?.mode === "cache-ttl" && isAnthropicServerToolClearingEnabled(attempt.model, transportApiKey);
	if (serverToolClearingEnabled) {
		const baseStreamFn = session.agent.streamFn;
		session.agent.streamFn = (model, context, options) => {
			const requestOptions = {
				...options,
				cacheTtlPruning: { tools: contextPruning?.tools }
			};
			return baseStreamFn(model, context, requestOptions);
		};
	}
	session.agent.streamFn = wrapApiKey(session.agent.streamFn);
	const runtime = attempt.preparedModelRuntime;
	const profileId = attempt.authProfileId;
	const credential = profileId ? attempt.authProfileStore?.profiles[profileId] : void 0;
	const selectedCredential = runtime && resolveSelectedModelCredential({
		provider: attempt.model.provider,
		profileId,
		mode: credential?.type ?? attempt.runtimePlan?.auth.selectedAuthMode
	});
	if (runtime?.accountCatalog && selectedCredential && selectedCredential.source !== "harness" && selectedCredential.requirement === "api-key" && attempt.model.provider === "openai" && attempt.model.api === "openai-responses") {
		const record = runtime.accountCatalog.prepareServiceTierObserver({
			selectedCredential,
			credential
		});
		session.agent.streamFn = createOpenAIServiceTierObservationWrapper(session.agent.streamFn, (model, observation) => !input.abortSignal.aborted && record({
			modelId: model.id,
			runtimeId: "openclaw",
			api: model.api,
			baseUrl: model.baseUrl,
			...observation
		}), {
			runId: attempt.runId,
			sessionId: attempt.sessionId,
			accountRoute: selectedCredential.identityKey
		});
	}
	return {
		serverToolClearingEnabled,
		compactionReplayEnabled: resolveCompactionReplayEligibility(attempt.model, {
			extraParams: effectiveExtraParams,
			apiKey: transportApiKey
		}),
		effectiveAgentTransport,
		effectiveExtraParams,
		effectivePromptCacheRetention,
		providerTextTransforms,
		streamStrategy
	};
}
//#endregion
//#region src/agents/embedded-agent-runner/run/attempt-settle.ts
const FAILED_PROMPT_MEDIA_NOTE_TYPE = "openclaw.system-note";
const FAILED_PROMPT_MEDIA_NOTE_SOURCE = "prompt-image-hydration";
function cleanupEmbeddedAttemptStreamExecution(input) {
	const { attempt, state } = input;
	const terminal = projectAgentRunAttemptTerminal(state.terminal);
	input.clearAttemptTimeoutTimers();
	if (!input.isProbeSession && (terminal.aborted || terminal.timedOut) && !terminal.timedOutDuringCompaction) log$7.debug(`run cleanup: runId=${attempt.runId} sessionId=${attempt.sessionId} aborted=${terminal.aborted} timedOut=${terminal.timedOut}`);
	let firstCleanupError;
	const cleanups = [["unsubscribe", input.unsubscribe], ["backend detach", () => attempt.replyOperation?.detachBackend(input.queueHandle)]];
	if (!input.deferredLifecycleOwner) cleanups.push(["active run cleanup", () => clearActiveEmbeddedRun(attempt.sessionId, input.queueHandle, attempt.sessionKey, attempt.sessionFile)]);
	for (const [name, cleanup] of cleanups) try {
		cleanup();
	} catch (error) {
		firstCleanupError ??= error instanceof Error ? error : new Error(String(error));
		log$7.error(`CRITICAL: ${name} failed, possible resource leak: runId=${attempt.runId} ${String(error)}`);
	}
	return firstCleanupError;
}
async function runEmbeddedAttemptSettledPhase(input) {
	const { attempt, state } = input;
	const { sessionRuntime, toolBase } = input.prepared;
	const { agentSession: { activeSession }, sessionManager, state: sessionRuntimeState, toolResultPromptProjectionState, transport: { effectivePromptCacheRetention } } = sessionRuntime;
	const { nestedToolActivityState } = toolBase;
	const promptState = {
		contextBudgetStatus: void 0,
		preflightRecovery: void 0,
		yieldAborted: false
	};
	const preparedStreamRuntime = input.preparedStreamRuntime;
	const { abortable, isProbeSession, onBlockReplyFlush, stream: preparedStream, timeout: attemptTimeout } = preparedStreamRuntime;
	const { subscription, queueHandle, getBeforeAgentFinalizeRevisionReason, getBeforeAgentFinalizeRevisionEntryId } = preparedStream;
	const { unsubscribe, waitForPendingEvents } = subscription;
	const { getRunAbortDeadlineAtMs, clearTimers: clearAttemptTimeoutTimers } = attemptTimeout;
	let settledStream;
	let messagesSnapshot = [];
	let sessionIdUsed = activeSession.sessionId;
	const sessionFileUsed = attempt.sessionFile;
	let cleanupError;
	const readTerminal = () => projectAgentRunAttemptTerminal(state.terminal);
	const setFailure = (error, source) => {
		state.terminal = setAgentRunAttemptTerminalFailure(state.terminal, error !== null && error !== void 0 ? {
			error,
			source: source ?? "prompt"
		} : null);
	};
	const markTimedOutDuringCompaction = () => {
		state.terminal = mergeAgentRunAttemptTerminal(state.terminal, {
			kind: "timeout",
			phase: "compaction",
			source: "observation"
		});
	};
	try {
		const { promptStartedAt, transcriptLeafId } = await runEmbeddedAttemptPromptPhase(input, promptState);
		const isFailureFreeRunBudgetTimeout = () => {
			const terminal = readTerminal();
			return terminal.timedOutByRunBudget && !terminal.failed;
		};
		const runBudgetTimeoutTerminal = isFailureFreeRunBudgetTimeout();
		const drainPendingEventsBounded = (afterRunBudgetTimeout) => joinWithRunLivenessDeadline({
			joinWork: afterRunBudgetTimeout ? () => waitForPendingEvents({ includePartialReplies: false }) : waitForPendingEvents,
			...afterRunBudgetTimeout ? {} : { runAbortSignal: input.runAbortController.signal },
			onTimeout: () => {
				log$7.warn(`pending subscription events did not settle within ${RUN_LIVENESS_JOIN_TIMEOUT_MS}ms; proceeding to stream settlement: runId=${attempt.runId}`);
			}
		});
		if (!runBudgetTimeoutTerminal) await drainPendingEventsBounded(false);
		if (runBudgetTimeoutTerminal || isFailureFreeRunBudgetTimeout()) await drainPendingEventsBounded(true);
		if (isFailureFreeRunBudgetTimeout()) subscription.flushPartialAssistantText();
		const beforeAgentFinalizeRevisionReason = getBeforeAgentFinalizeRevisionReason();
		const beforeAgentFinalizeRevisionEntryId = getBeforeAgentFinalizeRevisionEntryId();
		let rewoundBeforeAgentFinalizeRevision = false;
		if (beforeAgentFinalizeRevisionReason && beforeAgentFinalizeRevisionEntryId) await input.sessionLock.withOwnedTranscriptWrite(() => withSessionManagerAppend(sessionManager, async () => {
			const rejectedEntry = sessionManager.getEntry(beforeAgentFinalizeRevisionEntryId);
			if (rejectedEntry?.type !== "message" || rejectedEntry.message.role !== "assistant") throw new Error(`before_agent_finalize persisted assistant entry is missing or invalid (entry=${beforeAgentFinalizeRevisionEntryId})`);
			await sessionManager.appendLeafControlAsync({
				targetId: rejectedEntry.parentId,
				appendParentId: rejectedEntry.parentId
			});
			rewoundBeforeAgentFinalizeRevision = true;
		}));
		try {
			if (input.getRepairedRejectedProviderReplay() && !rewoundBeforeAgentFinalizeRevision) activeSession.agent.state.messages = sanitizeCompactionReplayMessages(sessionManager.buildSessionContext().messages);
			const settleTerminal = readTerminal();
			const streamSettleState = {
				promptError: settleTerminal.promptError,
				promptErrorSource: settleTerminal.promptErrorSource,
				yieldAborted: promptState.yieldAborted
			};
			try {
				settledStream = await settleEmbeddedAttemptStream({
					attempt,
					activeSession,
					sessionManager,
					toolResultPromptProjectionState,
					withOwnedTranscriptWrite: input.sessionLock.withOwnedTranscriptWrite,
					state: streamSettleState,
					getRunAbortDeadlineAtMs,
					shouldFlushForContextEngine: Boolean(input.activeContextEngine && !getBeforeAgentFinalizeRevisionReason()),
					subscription,
					readLifecycleState: readTerminal,
					markTimedOutDuringCompaction,
					runAbortSignal: input.runAbortController.signal,
					isProbeSession,
					onBlockReplyFlush,
					abortable,
					prePromptMessageCount: sessionRuntimeState.prePromptMessageCount,
					nestedToolActivityState,
					cache: {
						getObservation: preparedStreamRuntime.cache.getObservation,
						retention: effectivePromptCacheRetention
					}
				});
			} catch (error) {
				setFailure(streamSettleState.promptError, streamSettleState.promptErrorSource);
				throw error;
			}
		} finally {
			if (rewoundBeforeAgentFinalizeRevision) await input.sessionLock.withOwnedTranscriptWrite(() => {
				activeSession.agent.state.messages = sanitizeCompactionReplayMessages(sessionManager.buildSessionContext().messages);
			});
		}
		setFailure(settledStream.promptError, settledStream.promptErrorSource);
		if (settledStream.timedOutDuringCompaction) markTimedOutDuringCompaction();
		messagesSnapshot = settledStream.messagesSnapshot;
		sessionIdUsed = settledStream.sessionIdUsed;
		sessionRuntimeState.promptCache = settledStream.promptCache;
		await completeEmbeddedAttemptAfterTurn(input, settledStream, {
			yieldAborted: promptState.yieldAborted,
			transcriptLeafId,
			promptStartedAt,
			...beforeAgentFinalizeRevisionReason ? { beforeAgentFinalizeRevisionReason } : {}
		});
		const imageFailureNoteKey = sessionRuntimeState.currentTurnImageFailureCount > 0 ? `${FAILED_PROMPT_MEDIA_NOTE_SOURCE}:${sha256Hex(attempt.runId)}` : void 0;
		if (imageFailureNoteKey && !activeSession.messages.some((message) => readMessageIdempotencyKey(message) === imageFailureNoteKey || message.role === "custom" && message.customType === FAILED_PROMPT_MEDIA_NOTE_TYPE && asOptionalRecord(message.details)?.source === FAILED_PROMPT_MEDIA_NOTE_SOURCE && asOptionalRecord(message.details)?.runId === attempt.runId)) {
			const note = {
				role: "custom",
				customType: FAILED_PROMPT_MEDIA_NOTE_TYPE,
				content: buildPromptImageFailureNotice(sessionRuntimeState.currentTurnImageFailureCount),
				display: true,
				idempotencyKey: imageFailureNoteKey,
				details: {
					source: FAILED_PROMPT_MEDIA_NOTE_SOURCE,
					runId: attempt.runId,
					failedMediaCount: sessionRuntimeState.currentTurnImageFailureCount
				},
				timestamp: Date.now()
			};
			const target = sessionManager.getSessionTarget();
			const sessionId = sessionManager.getSessionId();
			const assertBinding = () => {
				if (sessionManager.getSessionId() !== sessionId || !sameSessionTranscriptTargetBinding(target, sessionManager.getSessionTarget())) throw new SessionTranscriptWriterClaimReboundError();
			};
			let committedMessageId;
			try {
				await input.sessionLock.withOwnedTranscriptWrite(async () => {
					assertBinding();
					if (target) {
						const appendAndPublish = async () => {
							assertBinding();
							const committed = await withSessionTranscriptWriteAssertion(target, assertBinding, () => appendSessionTranscriptNote(target, note, attempt.config ? { config: attempt.config } : void 0));
							committedMessageId = committed.messageId;
							assertBinding();
							assertOwnedTranscriptWriteCommit(target);
							if (committed.appended || committed.currentTail) {
								activeSession.agent.state.messages = [...activeSession.messages, committed.message];
								messagesSnapshot = [...messagesSnapshot, committed.message];
							}
						};
						if (isIncognitoSessionKey(target.sessionKey)) await withSessionManagerAppend(sessionManager, appendAndPublish);
						else await appendAndPublish();
					} else await withSessionManagerAppend(sessionManager, async () => {
						assertBinding();
						await sessionManager.appendMessageAsync(note);
						assertBinding();
						activeSession.agent.state.messages = [...activeSession.messages, note];
						messagesSnapshot = [...messagesSnapshot, note];
					});
				});
			} catch (error) {
				if (committedMessageId && target) throw new SessionTranscriptMessageCommittedError(committedMessageId, error, target);
				throw error;
			}
		}
	} finally {
		cleanupError = cleanupEmbeddedAttemptStreamExecution({
			attempt,
			clearAttemptTimeoutTimers,
			isProbeSession,
			queueHandle,
			state,
			unsubscribe,
			deferredLifecycleOwner: preparedStreamRuntime.stream.deferredLifecycleOwner
		});
	}
	if (cleanupError !== void 0) throw cleanupError;
	const beforeAgentFinalizeRevisionReason = getBeforeAgentFinalizeRevisionReason();
	const result = completeEmbeddedAttemptResult(input, settledStream, {
		...promptState,
		sessionIdUsed,
		sessionFileUsed,
		messagesSnapshot,
		...beforeAgentFinalizeRevisionReason ? { beforeAgentFinalizeRevisionReason } : {}
	});
	state.trajectoryEndRecorded = true;
	return result;
}
//#endregion
//#region src/agents/embedded-agent-runner/run/attempt-queue-message.ts
const DEFAULT_QUEUE_TRANSCRIPT_COMMIT_TIMEOUT_MS = 12e4;
var EmbeddedSteeringAcceptedUnconfirmedError = class extends Error {
	constructor(message, options) {
		super(message, options);
		this.name = "EmbeddedSteeringAcceptedUnconfirmedError";
	}
};
function hasAcceptedSteeringCustody(error) {
	return collectErrorGraphCandidates(error, readErrorCauses).some((candidate) => candidate instanceof MessageInjectionAcceptedUnconfirmedError);
}
function notifyQueueObserver(callback) {
	runBestEffortCallback({
		callback: () => callback?.(),
		label: "queued steering",
		log: log$7
	});
}
/**
* Removes one pending steered user message from both the runtime queue and its
* exact identity-owned display entry.
*/
async function cancelQueuedSteeringMessage(activeSession, queueIdentity) {
	const cancelSteeringMessage = activeSession.agent?.cancelSteeringMessage;
	if (!cancelSteeringMessage) return false;
	const message = cancelSteeringMessage.call(activeSession.agent, (queuedMessage) => getSteeringMessageIdentity(queuedMessage) === queueIdentity);
	if (!message) return false;
	try {
		if (!retireQueuedUserMessage(message)) log$7.warn("failed to retire queued steering display entry during cancellation");
	} catch (error) {
		log$7.warn(`failed to retire queued steering display entry: ${String(error)}`);
	}
	return true;
}
/**
* Tracks one steer until commit or terminal cleanup. Admission-only receipts
* resolve after enqueue, but retain exact-message cleanup until the run ends.
* Commit-waiting callers also retain their delivery deadline.
*/
async function steerWithTranscriptLifecycle(activeSession, text, options, canInject, prepareInjection) {
	const { abortSignal, onQueueAccepted, onQueueSettled, waitForTranscriptCommit, images, userTurnTranscriptRecorder, media, imageOrder, currentInboundContext, queueIdentity = crypto.randomUUID() } = options;
	const timeoutMs = options.deliveryTimeoutMs ?? DEFAULT_QUEUE_TRANSCRIPT_COMMIT_TIMEOUT_MS;
	await new Promise((resolve, reject) => {
		let settled = false;
		let accepted = false;
		let abortRequested = abortSignal?.aborted === true;
		let acceptanceReported = false;
		let cancellation;
		let acceptanceOpen = true;
		const reportAcceptance = (value) => {
			if (acceptanceReported) return;
			acceptanceReported = true;
			notifyQueueObserver(() => onQueueAccepted?.(value));
		};
		const reportRejection = () => {
			if (!accepted) reportAcceptance(false);
		};
		const finish = (err) => {
			if (settled) return;
			settled = true;
			clearTimeout(timer);
			notifyQueueObserver(unsubscribe);
			notifyQueueObserver(unsubscribePersistenceFailure);
			abortSignal?.removeEventListener("abort", onAbort);
			notifyQueueObserver(onQueueSettled);
			if (err !== void 0) {
				reject(toErrorObject(err, "Non-Error rejection"));
				return;
			}
			resolve();
		};
		const rejectAfterCancellation = (message) => {
			acceptanceOpen = false;
			cancellation ??= cancelQueuedSteeringMessage(activeSession, queueIdentity).then(async (removed) => {
				if (!removed) await steering.catch((error) => {
					accepted ||= hasAcceptedSteeringCustody(error);
				});
				if (!removed && accepted) {
					log$7.warn("failed to find queued steering message for cancellation");
					throw new EmbeddedSteeringAcceptedUnconfirmedError(message);
				}
				return removed;
			});
			cancellation.then((removed) => {
				reportRejection();
				finish(removed ? new MessageInjectionWithdrawnError(message) : new Error(message));
			}, (error) => {
				if (!(error instanceof EmbeddedSteeringAcceptedUnconfirmedError)) log$7.warn(`failed to cancel queued steering message: ${String(error)}`);
				reportRejection();
				finish(error instanceof EmbeddedSteeringAcceptedUnconfirmedError ? error : accepted ? new EmbeddedSteeringAcceptedUnconfirmedError(message, { cause: error }) : new Error(message, { cause: error }));
			});
		};
		const timer = setTimeout(() => rejectAfterCancellation("queued steering message was not committed to the transcript before timeout"), Math.max(1, timeoutMs));
		timer.unref?.();
		const unsubscribe = activeSession.subscribe((event) => {
			if (!event || typeof event !== "object") return;
			const record = event;
			if (record.type === "message_end" && getSteeringMessageIdentity(record.message) === queueIdentity) {
				accepted = true;
				finish();
				return;
			}
			const type = record.type;
			if (type === "agent_settled" || type === "agent_handoff") rejectAfterCancellation(`active session ${type === "agent_handoff" ? "handed off" : "ended"} before queued steering message was committed to the transcript`);
		});
		const unsubscribePersistenceFailure = subscribeSteeringMessagePersistenceFailure(queueIdentity, (error) => {
			acceptanceOpen = false;
			steering.then(() => {
				if (settled) return;
				accepted = true;
				reportAcceptance(true);
				finish(error);
			}, (admissionError) => {
				if (settled) return;
				accepted ||= hasAcceptedSteeringCustody(admissionError) || hasAcceptedSteeringCustody(error);
				reportRejection();
				finish(new AggregateError([error, admissionError], toErrorObject(error, "Steering persistence failed").message, { cause: error }));
			});
		});
		if (abortRequested) {
			acceptanceOpen = false;
			reportAcceptance(false);
			finish(/* @__PURE__ */ new Error("queued steering message was cancelled before acceptance"));
			return;
		}
		const steering = activeSession.steer(text, images, userTurnTranscriptRecorder, media, imageOrder, queueIdentity, () => acceptanceOpen && (canInject?.() ?? true), currentInboundContext, prepareInjection);
		steering.then(() => {
			accepted = true;
			if (!acceptanceOpen) return;
			reportAcceptance(true);
			if (abortRequested) rejectAfterCancellation("queued steering message was cancelled before delivery");
			else if (waitForTranscriptCommit !== true && acceptanceOpen) {
				clearTimeout(timer);
				unsubscribePersistenceFailure();
				abortSignal?.removeEventListener("abort", onAbort);
				resolve();
			}
		}, (err) => {
			accepted ||= hasAcceptedSteeringCustody(err);
			if (!acceptanceOpen) return;
			reportRejection();
			finish(err);
		});
		function onAbort() {
			abortRequested = true;
			rejectAfterCancellation(`queued steering message was cancelled before ${accepted ? "delivery" : "acceptance"}`);
		}
		abortSignal?.addEventListener("abort", onAbort, { once: true });
	});
}
function resolveQuestionAuthority(canInject, authority) {
	return authority ?? (canInject ? {
		kind: "run",
		assertCurrent: () => {
			if (!canInject()) throw new Error("active session is finalizing");
		}
	} : void 0);
}
async function steerActiveSessionWithOptionalDeliveryWait(activeSession, text, options, sessionKey, canInject, authority, prepareInjection) {
	const isInboundUserMessage = options?.isInboundUserMessage === true;
	const isPlainTextAnswer = !hasPromptImageInput(options);
	if (isInboundUserMessage && !isPlainTextAnswer) try {
		await cancelPendingAgentQuestionForSession({
			sessionKey,
			resolvedBy: "image-reply",
			authority: resolveQuestionAuthority(canInject, authority)
		});
	} catch (error) {
		if (canInject && !canInject()) throw error;
		if (error instanceof Error && error.name === "QuestionDispatchRefusedError") throw error;
		log$7.warn(`failed to cancel ask_user before image steering: ${String(error)}`);
	}
	if (isInboundUserMessage && isPlainTextAnswer && await claimEmbeddedPendingUserInputAnswer(text, options, sessionKey, canInject, authority)) {
		notifyQueueObserver(() => options?.onQueueAccepted?.(true));
		notifyQueueObserver(options?.onQueueSettled);
		return;
	}
	if (!options || options.waitForTranscriptCommit === void 0 && !options.onQueueSettled) {
		try {
			await activeSession.steer(text, options?.images, options?.userTurnTranscriptRecorder, options?.media, options?.imageOrder, options?.queueIdentity, canInject, options?.currentInboundContext, prepareInjection);
		} catch (error) {
			if (!hasAcceptedSteeringCustody(error)) notifyQueueObserver(() => options?.onQueueAccepted?.(false));
			throw error;
		}
		notifyQueueObserver(() => options?.onQueueAccepted?.(true));
		return;
	}
	try {
		await steerWithTranscriptLifecycle(activeSession, text, options, canInject, prepareInjection);
	} catch (error) {
		if (error instanceof EmbeddedSteeringAcceptedUnconfirmedError) return {
			transcriptCommit: "unconfirmed",
			errorMessage: error.message
		};
		throw error;
	}
}
async function claimEmbeddedPendingUserInputAnswer(text, options, sessionKey, canInject, authority) {
	if (options?.isInboundUserMessage !== true || hasPromptImageInput(options)) return false;
	return await claimPendingAgentQuestionAnswer({
		sessionKey,
		text,
		authority: resolveQuestionAuthority(canInject, authority),
		sourceRecorder: options.userTurnTranscriptRecorder
	});
}
//#endregion
//#region src/agents/embedded-agent-runner/run/attempt-steering-admission.ts
/** Owns steering through preparation rollback, prompt closure, and stream release. */
function withEmbeddedAttemptSteeringAdmission(session, signal, prepare) {
	let phase = "accepting";
	let unsubscribeSteering;
	let unsubscribeStream;
	const stop = () => {
		if (phase === "closed") return;
		phase = "closed";
		signal.removeEventListener("abort", stop);
		unsubscribeSteering?.();
	};
	const unsubscribe = () => {
		const releaseStream = unsubscribeStream;
		unsubscribeStream = void 0;
		try {
			stop();
		} finally {
			releaseStream?.();
		}
	};
	try {
		unsubscribeSteering = session.subscribe((event) => {
			if (event.type === "agent_settled" || event.type === "agent_handoff") stop();
		});
		signal.addEventListener("abort", stop, { once: true });
		if (signal.aborted) stop();
		return prepare({
			get closed() {
				return phase === "closed";
			},
			get accepting() {
				return phase === "accepting";
			},
			set accepting(value) {
				if (phase !== "closed") phase = value ? "accepting" : "paused";
			},
			stop,
			bindStreamUnsubscribe: (releaseStream) => {
				unsubscribeStream = releaseStream;
				return unsubscribe;
			}
		});
	} catch (error) {
		try {
			unsubscribe();
		} catch (cleanupError) {
			log$7.error(`CRITICAL: embedded stream subscription cleanup failed: ${formatErrorMessage(cleanupError)}`);
		}
		throw error;
	}
}
//#endregion
//#region src/agents/embedded-agent-runner/run/attempt-tool-search-executor.ts
/** One owner for nested execution, acceptance, and durable display activity. */
function createSubscribedToolSearchExecutor(params) {
	const { attempt, subscription } = params;
	const { scopeId: activityScope } = params.nestedToolActivityState;
	let nestedStartOrder = 0;
	return async (toolParams) => {
		const runSignal = params.runSignal;
		const signal = AbortSignal.any([toolParams.signal ?? runSignal, runSignal]);
		let input = toolParams.input;
		let preparationFailure;
		try {
			if (toolParams.tool.prepareArguments) input = toolParams.tool.prepareArguments(toolParams.input);
		} catch (error) {
			preparationFailure = { error };
		}
		const lifecycleArgs = preparationFailure ? toolParams.input : input;
		const yieldRunSignal = toolParams.toolName === "sessions_yield" ? runSignal : void 0;
		const startedAt = Date.now();
		const startOrder = nestedStartOrder++;
		const manager = params.sessionManager;
		const afterEntryId = manager.getAppendParentId();
		if (toolParams.source === "openclaw" && toolParams.sourceName === "core") recordStructuredReplayTrustForToolCall(toolParams.toolCallId, toolParams.tool, attempt.runId);
		return await raceWithAbortSignal(subscription.runToolLifecycle({
			toolName: toolParams.toolName,
			toolCallId: toolParams.toolCallId,
			parentToolCallId: toolParams.parentToolCallId,
			args: lifecycleArgs,
			replaySafe: toolParams.replaySafe ?? params.isReplaySafeTool(toolParams.tool),
			hideFromChannelProgress: "hideFromChannelProgress" in toolParams.tool && toolParams.tool.hideFromChannelProgress === true,
			onTerminal: async (terminal) => {
				const message = {
					...createNestedToolActivity({
						runId: attempt.runId,
						scopeId: activityScope,
						afterEntryId,
						startOrder,
						parentToolCallId: toolParams.parentToolCallId,
						toolCallId: toolParams.toolCallId,
						toolName: toolParams.toolName,
						input: terminal.executedArguments,
						result: terminal.readSanitizedResult(),
						isError: terminal.isError,
						startedAt,
						timestamp: Date.now()
					}),
					idempotencyKey: `${activityScope}:${toolParams.toolCallId}`
				};
				await runWithOwnedSessionTranscriptWrite({
					sessionTarget: manager.getSessionTarget(),
					sessionKey: attempt.sessionKey
				}, () => withSessionManagerAppend(manager, async () => {
					if (!params.isCurrent()) return;
					if (isRecord(terminal.result)) copyInternalToolResultState(terminal.result, message);
					const target = manager.getSessionTarget();
					const sessionId = manager.getSessionId();
					const entryId = await manager.appendMessageAsync(message);
					if (!params.isCurrent()) return;
					const activity = params.nestedToolActivityState;
					if (!terminal.isError) activity.successfulToolNames.add(toolParams.toolName);
					if (entryId) {
						activity.accepted ??= {
							firstEntryId: entryId,
							lastEntryId: entryId,
							sessionId,
							target
						};
						activity.accepted.lastEntryId = entryId;
					}
				}));
				notifyToolActivity(attempt.runId);
			},
			execute: async (onImplementationStart) => await raceWithAbortSignal(retainToolSearchImplementation((async () => {
				if (preparationFailure) throw preparationFailure.error;
				signal.throwIfAborted();
				const preparer = getInternalToolExecutionPreparer(toolParams.tool);
				if (!preparer) {
					onImplementationStart();
					return await toolParams.tool.execute(toolParams.toolCallId, input, signal, toolParams.onUpdate);
				}
				const prepared = await preparer({
					toolCallId: toolParams.toolCallId,
					args: input,
					signal,
					onUpdate: toolParams.onUpdate
				});
				try {
					if (prepared.kind === "immediate") {
						if (prepared.outcome.kind === "error") throw prepared.outcome.error;
						return prepared.outcome.result;
					}
					return await prepared.execute(onImplementationStart);
				} finally {
					prepared.dispose();
				}
			})().then((result) => {
				signal.throwIfAborted();
				recordEmbeddedToolReceipt(manager, toolParams.toolCallId, result.details, toolParams.source === "openclaw" && toolParams.sourceName === "core" && toolParams.toolName === "message");
				return toolParams.acceptResultBeforeProjection(result);
			})), signal, yieldRunSignal)
		}), signal, yieldRunSignal);
	};
}
//#endregion
//#region src/agents/embedded-agent-runner/run/attempt-trajectory-flush.ts
async function flushEmbeddedAttemptTrajectoryRecorder(params) {
	await runAgentCleanupStep({
		...params,
		step: "openclaw-trajectory-flush",
		getTimeoutDetails: () => params.trajectoryRecorder?.describeFlushState(),
		cleanup: async () => {
			await params.trajectoryRecorder?.flush();
		}
	});
}
//#endregion
//#region src/agents/embedded-agent-runner/run/deferred-lifecycle-owner.ts
function createEmbeddedAttemptDeferredLifecycleOwner(params) {
	let pending = params;
	let sessionEndData;
	let closeRetryWait;
	const releaseRetryWait = () => {
		closeRetryWait?.();
		closeRetryWait = void 0;
	};
	const releaseActiveRun = (owner) => {
		try {
			owner.clearActiveRun();
		} catch (error) {
			log$7.error(`CRITICAL: deferred active run cleanup failed, possible resource leak: runId=${owner.runId} ${formatErrorMessage(error)}`);
		}
	};
	const flushTrajectory = (owner) => owner.trajectoryRecorder ? flushEmbeddedAttemptTrajectoryRecorder({
		runId: owner.runId,
		sessionId: owner.sessionId,
		trajectoryRecorder: owner.trajectoryRecorder,
		log: log$7
	}) : Promise.resolve();
	return {
		beginRetryWait: (deadlineAtMs, signal) => {
			if (!pending) return;
			flushTrajectory(pending);
			releaseRetryWait();
			const close = beginDiagnosticRetryWait({
				owner: pending.diagnosticOwner,
				deadlineAtMs,
				signal,
				assertCurrent: () => {
					if (!pending?.isCurrent()) throw createAgentRunSupersededAbortError();
				}
			});
			closeRetryWait = close;
			return (completed) => {
				if (close(completed)) pending?.onRetryWaitCompleted();
				if (closeRetryWait === close) closeRetryWait = void 0;
			};
		},
		recordSessionEnd: (data) => {
			if (pending) sessionEndData = data;
		},
		discard: () => {
			if (pending) {
				const owner = pending;
				pending = void 0;
				sessionEndData = void 0;
				releaseRetryWait();
				releaseActiveRun(owner);
				return flushTrajectory(owner);
			}
		},
		complete: async () => {
			if (!pending) return;
			const owner = pending;
			pending = void 0;
			releaseRetryWait();
			try {
				if (owner.trajectoryRecorder && sessionEndData) owner.trajectoryRecorder.recordEvent("session.ended", sessionEndData);
				await flushTrajectory(owner);
			} finally {
				sessionEndData = void 0;
				releaseActiveRun(owner);
			}
		}
	};
}
function createDeferredEmbeddedRunLifecycleManager(params) {
	const startedAtMs = Date.now();
	const controller = new AbortController();
	const signal = params.abortSignal ? AbortSignal.any([params.abortSignal, controller.signal]) : controller.signal;
	let current;
	const discarded = [];
	const replaceOwner = (owner) => {
		const previous = current;
		current = owner;
		const cleanup = previous?.discard();
		if (cleanup) {
			cleanup.catch(() => {});
			discarded.push(cleanup);
		}
	};
	const abort = (reason) => {
		if (controller.signal.aborted) return;
		controller.abort(reason === "restart" ? createAgentRunRestartAbortError() : reason === "superseded" ? createAgentRunSupersededAbortError() : createAgentRunDirectAbortError());
	};
	let cliOwner;
	return {
		signal,
		abort,
		adopt: replaceOwner,
		beginRetryWait: (deadlineAtMs, retrySignal) => current?.beginRetryWait(deadlineAtMs, retrySignal ? AbortSignal.any([signal, retrySignal]) : signal),
		handoffToCli: () => {
			const diagnosticOwner = createDiagnosticEmbeddedRunOwner(params);
			cliOwner = {
				kind: "embedded",
				runId: params.runId,
				startedAtMs,
				diagnosticOwner,
				closeDiagnostics: () => closeDiagnosticEmbeddedRunOwner(diagnosticOwner),
				queueMessage: async () => {
					throw new Error("active run is switching runtimes");
				},
				isStreaming: () => false,
				isStopped: () => signal.aborted,
				isAborted: () => signal.aborted,
				isAbortable: () => !signal.aborted,
				isCompacting: () => false,
				cancel: abort,
				abort
			};
			setActiveEmbeddedRun(params.sessionId, cliOwner, params.sessionKey, params.sessionFile, params.agentId);
			replaceOwner();
			return diagnosticOwner;
		},
		complete: async () => {
			const owner = current;
			current = void 0;
			try {
				await Promise.all([...discarded, owner?.complete()]);
			} finally {
				if (cliOwner) clearActiveEmbeddedRun(params.sessionId, cliOwner, params.sessionKey, params.sessionFile);
			}
		}
	};
}
//#endregion
//#region src/agents/embedded-agent-runner/run/provider-refusal.ts
function resolveProviderRefusal(message) {
	const refusal = message?.diagnostics?.find((diagnostic) => diagnostic.type === "provider_refusal");
	if (!refusal) return;
	const provider = readStringField(refusal.details, "provider");
	const category = readStringField(refusal.details, "category");
	if (!provider && !category) return;
	const review = readProviderRefusalReview(refusal.details?.review);
	const nativeThreadId = readStringField(refusal.details, "nativeThreadId");
	const nativeTurnId = readStringField(refusal.details, "nativeTurnId");
	return {
		provider,
		category,
		...review ? { review } : {},
		...nativeThreadId ? { nativeThreadId } : {},
		...nativeTurnId ? { nativeTurnId } : {}
	};
}
//#endregion
//#region src/agents/embedded-agent-runner/run/attempt-stream-prepare.ts
function prepareEmbeddedAttemptStream(input) {
	return withEmbeddedAttemptSteeringAdmission(input.agentSession.activeSession, input.runAbortController.signal, (admission) => prepareStream(input, admission));
}
function prepareStream(input, admission) {
	const { attempt, agentSession } = input;
	const { activeSession, hookRunner } = agentSession;
	const recoverStalledModelCall = input.recoverStalledModelCall;
	let stalledModelRecoveryAccepted = false;
	let beforeAgentFinalizeRevisionReason;
	let beforeAgentFinalizeRevisionEntryId;
	let activeQueueAdmissions = 0;
	const isSteeringAdmissionOpen = () => {
		const state = input.getRunState();
		return admission.accepting && !state.aborted && !state.yieldDetected && !input.runAbortController.signal.aborted;
	};
	const shouldRunBeforeAgentFinalize = attempt.operation !== "settled-tool-finalization" && hookRunner?.hasHooks("before_agent_finalize");
	const completionCheck = attempt.operation !== "settled-tool-finalization" && !attempt.silentExpected && resolveReplyExpectation(attempt) === "required" ? attempt.completionCheck : void 0;
	const onBeforeTerminalDelivery = shouldRunBeforeAgentFinalize || completionCheck ? async (event) => {
		if (beforeAgentFinalizeRevisionReason || event.willRetry || event.isError || event.incompleteTerminalAssistant || !event.hasAssistantVisibleText) return;
		const lastAssistant = event.lastAssistant;
		const lastAssistantMessage = normalizeOptionalString(resolveFinalAssistantVisibleText(lastAssistant)) ?? normalizeOptionalString(resolveFinalAssistantRawText(lastAssistant)) ?? normalizeOptionalString(event.assistantTexts.join("\n\n"));
		if (!lastAssistantMessage) return;
		const state = input.getRunState();
		const hasCompletedClientToolCall = agentSession.clientToolCallSlots.some((slot) => slot.completed);
		if (state.aborted || input.runAbortController.signal.aborted || state.promptError || state.timedOut || hasCompletedClientToolCall || state.yieldDetected || attempt.silentExpected && isSilentReplyText(lastAssistantMessage, "NO_REPLY")) return;
		const maxRevisionAttempts = attempt.maxBeforeAgentFinalizeRevisions ?? 0;
		const hookRevisionLimitReached = maxRevisionAttempts > 0 && (attempt.beforeAgentFinalizeRevisionAttempts ?? 0) >= maxRevisionAttempts;
		if (shouldRunBeforeAgentFinalize && hookRevisionLimitReached) log$7.warn(`before_agent_finalize revision limit reached; skipping further finalize hooks runId=${attempt.runId} sessionId=${attempt.sessionId} attempts=${attempt.beforeAgentFinalizeRevisionAttempts ?? 0}/${maxRevisionAttempts}`);
		admission.accepting = false;
		if (activeQueueAdmissions > 0 || activeSession.pendingMessageCount > 0 || activeSession.agent.hasQueuedMessages()) {
			admission.accepting = true;
			return;
		}
		let keepAdmissionClosed = false;
		try {
			let outcome = { action: "continue" };
			if (shouldRunBeforeAgentFinalize && !hookRevisionLimitReached) {
				const reportedModelRef = resolveReportedModelRef({
					provider: attempt.provider,
					model: attempt.modelId,
					assistant: lastAssistant
				});
				outcome = await runAgentHarnessBeforeAgentFinalizeHook({
					event: bindAgentHarnessHookMessages({
						runId: attempt.runId,
						sessionId: attempt.sessionId,
						...attempt.sessionKey ? { sessionKey: attempt.sessionKey } : {},
						provider: reportedModelRef.provider,
						model: reportedModelRef.model,
						...attempt.cwd ?? attempt.workspaceDir ? { cwd: attempt.cwd ?? attempt.workspaceDir } : {},
						...attempt.sessionFile ? { transcriptPath: attempt.sessionFile } : {},
						stopHookActive: false,
						lastAssistantMessage,
						messages: activeSession.messages
					}, async () => {
						const activities = await readAttemptNestedToolActivity(activeSession.sessionManager, input.nestedToolActivityState);
						if (input.runAbortController.signal.aborted || input.getRunState().aborted || admission.closed || ACTIVE_EMBEDDED_RUNS.get(attempt.sessionId) !== queueHandle) throw new Error("Nested tool finalization is no longer current");
						return projectNestedToolActivityForHooks(activeSession.messages, activities);
					}),
					ctx: {
						...buildEmbeddedAgentHookContext(attempt, input.hookAgentId, freezeDiagnosticTraceContext(input.diagnosticTrace)),
						modelProviderId: reportedModelRef.provider,
						modelId: reportedModelRef.model
					},
					hookRunner
				});
			}
			if (outcome.action === "finalize") return;
			if (outcome.action === "revise") {
				if (event.hadDeterministicSideEffect) log$7.warn(`before_agent_finalize requested revision after potential side effects; not rewinding runId=${attempt.runId} sessionId=${attempt.sessionId}`);
				else if (!event.assistantEntryId) log$7.warn(`before_agent_finalize revision lacks a persisted assistant entry; not rewinding runId=${attempt.runId} sessionId=${attempt.sessionId}`);
				else {
					keepAdmissionClosed = true;
					beforeAgentFinalizeRevisionEntryId = event.assistantEntryId;
					beforeAgentFinalizeRevisionReason = outcome.reason;
					return { suppressTerminalDelivery: true };
				}
			}
			const currentState = input.getRunState();
			if (!completionCheck?.unfinishedPlan || completionCheck.checked || lastAssistant?.stopReason !== "stop" || resolveProviderRefusal(lastAssistant) || event.hasPendingContinuation || agentSession.hasDeliveredSourceReply() || input.runAbortController.signal.aborted || currentState.aborted || currentState.timedOut || currentState.promptError || currentState.yieldDetected || admission.closed || activeSession.pendingMessageCount > 0 || activeSession.agent.hasQueuedMessages() || !hasCurrentRegistration()) return;
			completionCheck.checked = true;
			await activeSession.sendCustomMessage({
				customType: "openclaw.plan-completion-check",
				display: false,
				content: `This run’s latest successfully saved plan still has unfinished steps. Before ending, check whether those steps remain required and authorized under the latest user instructions. Continue feasible work from the current transcript; do not repeat completed actions, and reconcile uncertain effects before retrying. If work is complete, reconcile the plan. If user input, approval, an external dependency, or an explicit pause prevents further work, report that concrete limitation; if your previous reply already reported it, end with only ${SILENT_REPLY_TOKEN}. Do not invent completion or new authority.`
			}, { deliverAs: "followUp" });
			return { continueCurrentTurn: true };
		} finally {
			if (!keepAdmissionClosed) admission.accepting = true;
		}
	} : void 0;
	const clearActiveRun = () => clearActiveEmbeddedRun(attempt.sessionId, queueHandle, attempt.sessionKey, attempt.sessionFile);
	let toolMetasForTerminal = [];
	let deferredLifecycleOwner;
	const streamSubscription = subscribeEmbeddedAgentSession({
		...attempt,
		...agentSession,
		session: activeSession,
		onModelUsage: input.onModelUsage,
		messageChannel: input.runtimeChannel,
		hookRunner: getGlobalHookRunner() ?? void 0,
		reasoningMode: attempt.reasoningLevel ?? "off",
		thinkingLevel: attempt.thinkLevel,
		hasDeliveredMessageToolOnlySourceReply: agentSession.hasDeliveredSourceReply,
		onDeliveredMessageToolOnlySourceReply: agentSession.markSourceReplyDelivered,
		trajectoryRecorder: input.trajectoryRecorder,
		onBlockReply: input.onBlockReply,
		onBlockReplyFlush: input.onBlockReplyFlush,
		onBeforeTerminalDelivery,
		deferTerminalDelivery: shouldRunBeforeAgentFinalize === true,
		terminalLifecyclePhase: attempt.deferTerminalLifecycle ? "finishing" : "end",
		isTerminalAborted: () => input.getRunState().aborted,
		resolveTerminalStopReason: () => isAgentRunRestartAbortReason(input.runAbortController.signal.reason) ? AGENT_RUN_RESTART_ABORT_STOP_REASON : void 0,
		onBeforeLifecycleTerminal: async () => {
			if (deferredLifecycleOwner) return;
			let requiresTaskWait = false;
			try {
				requiresTaskWait = requiresCompletionRequiredAsyncTaskWait({
					sessionKey: attempt.sessionKey,
					toolMetas: toolMetasForTerminal,
					abortSignal: input.runAbortController.signal
				});
			} catch (error) {
				if (!input.runAbortController.signal.aborted || !isRunnerAbortError(error)) throw error;
			}
			if (deferredLifecycleOwner || requiresTaskWait) return;
			clearActiveRun();
		},
		providerOwner: getModelProviderRuntimePluginHandle(attempt.model)?.plugin,
		currentAccountId: attempt.agentAccountId,
		currentThreadId: attempt.currentThreadTs,
		agentId: input.hookAgentId
	});
	const unsubscribe = admission.bindStreamUnsubscribe(streamSubscription.unsubscribe);
	const subscription = {
		...streamSubscription,
		unsubscribe
	};
	toolMetasForTerminal = subscription.toolMetas;
	const toolSearchCatalogExecutor = createSubscribedToolSearchExecutor({
		attempt,
		runSignal: input.runAbortController.signal,
		sessionManager: activeSession.sessionManager,
		subscription,
		isCurrent: () => ACTIVE_EMBEDDED_RUNS.get(attempt.sessionId) === queueHandle && !input.getRunState().aborted,
		isReplaySafeTool: input.isReplaySafeTool,
		nestedToolActivityState: input.nestedToolActivityState
	});
	let externalAbortAccepted = false;
	const abortActiveRunExternally = (reason) => {
		if (externalAbortAccepted) return;
		externalAbortAccepted = true;
		input.markExternalAbort();
		attempt.onDeferredLifecycleAbort?.(reason);
		attempt.onAttemptAbort?.();
		const abortReason = reason === "restart" ? createAgentRunRestartAbortError() : reason === "superseded" ? createAgentRunSupersededAbortError() : void 0;
		input.abortRun(false, abortReason);
	};
	const hasCurrentRegistration = () => {
		registration?.toolAuthority?.assertActive();
		return registration !== void 0 && ACTIVE_EMBEDDED_RUN_REGISTRATIONS.get(queueHandle) === registration && ACTIVE_EMBEDDED_RUNS.get(attempt.sessionId) === queueHandle && ACTIVE_EMBEDDED_RUNS_BY_RUN_ID.get(attempt.runId) === queueHandle;
	};
	const canInject = () => isSteeringAdmissionOpen() && hasCurrentRegistration();
	const composeInjectionGuard = (assertCurrent) => () => {
		assertCurrent?.();
		return canInject();
	};
	const questionAuthority = (assertCurrent, kind, toolAuthorityPreparation) => ({
		kind,
		toolAuthorityPreparation,
		assertCurrent: () => {
			if (!composeInjectionGuard(assertCurrent)()) throw new Error("active session is finalizing");
		}
	});
	const queueMessage = async (text, options, assertCurrent, authorityKind = assertCurrent ? "source-bound" : "run", prepareCurrent, toolAuthorityPreparation) => {
		const canInjectMessage = composeInjectionGuard(assertCurrent);
		if (!canInjectMessage()) throw new Error("active session is finalizing");
		activeQueueAdmissions++;
		try {
			if (options?.steeringMode) activeSession.agent.steeringMode = options.steeringMode;
			return await steerActiveSessionWithOptionalDeliveryWait(activeSession, text, options, attempt.sessionKey, canInjectMessage, questionAuthority(assertCurrent, authorityKind, toolAuthorityPreparation), prepareCurrent);
		} finally {
			activeQueueAdmissions--;
		}
	};
	const claimPendingUserInputAnswer = (text, options, assertCurrent, authorityKind = assertCurrent ? "source-bound" : "run", preparation) => claimEmbeddedPendingUserInputAnswer(text, options, attempt.sessionKey, composeInjectionGuard(assertCurrent), questionAuthority(assertCurrent, authorityKind, preparation));
	const cancelPendingUserInput = (resolvedBy, assertCurrent, authorityKind = assertCurrent ? "source-bound" : "run", preparation) => cancelPendingAgentQuestionForSession({
		sessionKey: attempt.sessionKey,
		resolvedBy,
		authority: questionAuthority(assertCurrent, authorityKind, preparation)
	});
	const messageInjection = {
		version: 2,
		isAvailable: isSteeringAdmissionOpen,
		queueMessage,
		claimPendingUserInputAnswer,
		cancelPendingUserInput,
		queueMessageAsync: (text, options, preparation, kind) => queueMessage(text, options, preparation.assertCurrent, kind, preparation.prepareCurrent, preparation),
		claimPendingUserInputAnswerAsync: (text, options, preparation, kind) => claimPendingUserInputAnswer(text, options, preparation.assertCurrent, kind, preparation),
		cancelPendingUserInputAsync: (resolvedBy, preparation, kind) => cancelPendingUserInput(resolvedBy, preparation.assertCurrent, kind, preparation)
	};
	const heartbeatReplyOperation = attempt.replyOperation?.turnKind === "heartbeat" ? attempt.replyOperation : void 0;
	const canApplyPermissionMode = () => admission.accepting && !input.runAbortController.signal.aborted && ACTIVE_EMBEDDED_RUNS_BY_RUN_ID.get(attempt.runId) === queueHandle;
	const applyPermissionMode = input.applyPermissionMode;
	const queueHandle = {
		kind: "embedded",
		runId: attempt.runId,
		permissionChangeOwner: attempt.permissionChange?.owner,
		diagnosticOwner: input.diagnosticOwner,
		closeDiagnostics: () => closeDiagnosticEmbeddedRunOwner(input.diagnosticOwner),
		startedAtMs: attempt.startedAtMs,
		get toolAuthorityFingerprint() {
			return attempt.toolAuthorityFingerprint;
		},
		applyPermissionMode: applyPermissionMode ? async (mode, revokeApprovals) => {
			if (!canApplyPermissionMode()) return false;
			if ((attempt.permissionMode ?? null) === mode) return true;
			try {
				await applyPermissionMode(mode, revokeApprovals);
				return canApplyPermissionMode();
			} catch (error) {
				input.abortRun(false, error);
				throw error;
			}
		} : void 0,
		claimPendingUserInputAnswer,
		cancelPendingUserInput,
		preemptByVisibleTurn: heartbeatReplyOperation ? () => heartbeatReplyOperation.supersede() : void 0,
		queueMessage,
		messageInjection,
		messageInjectionV2: messageInjection,
		isStreaming: () => activeSession.isStreaming,
		isAborted: () => input.getRunState().aborted,
		isStopped: () => !isSteeringAdmissionOpen(),
		isCompacting: () => subscription.isCompacting(),
		supportsTranscriptCommitWait: true,
		supportsQueueMessageImages: true,
		sourceReplyDeliveryMode: attempt.sourceReplyDeliveryMode,
		terminalReplyExpectation: resolveReplyExpectation(attempt),
		taskSuggestionDeliveryMode: attempt.taskSuggestionDeliveryMode,
		recoverStalledModelCall: recoverStalledModelCall ? () => {
			if (stalledModelRecoveryAccepted) return !externalAbortAccepted && !attempt.abortSignal?.aborted && registration !== void 0 && ACTIVE_EMBEDDED_RUN_REGISTRATIONS.get(queueHandle) === registration && ACTIVE_EMBEDDED_RUNS.get(attempt.sessionId) === queueHandle && ACTIVE_EMBEDDED_RUNS_BY_RUN_ID.get(attempt.runId) === queueHandle;
			stalledModelRecoveryAccepted = isSteeringAdmissionOpen() && !subscription.isCompacting() && countActiveToolExecutions(attempt.runId) === 0 && hasCurrentRegistration() && recoverStalledModelCall();
			return stalledModelRecoveryAccepted;
		} : void 0,
		cancel: abortActiveRunExternally,
		abort: abortActiveRunExternally
	};
	attempt.replyOperation?.attachBackend(queueHandle);
	setActiveEmbeddedRunLifecycleGeneration(queueHandle, attempt.lifecycleGeneration ?? captureAgentRunLifecycleGeneration(attempt.runId));
	setActiveEmbeddedRun(attempt.sessionId, queueHandle, attempt.sessionKey, attempt.sessionFile, input.hookAgentId);
	const registration = ACTIVE_EMBEDDED_RUN_REGISTRATIONS.get(queueHandle);
	if (attempt.deferTerminalLifecycle && attempt.onDeferredLifecycleOwner) {
		deferredLifecycleOwner = createEmbeddedAttemptDeferredLifecycleOwner({
			runId: attempt.runId,
			sessionId: attempt.sessionId,
			diagnosticOwner: input.diagnosticOwner,
			onRetryWaitCompleted: () => attempt.replyOperation?.recordActivity(),
			isCurrent: () => registration?.delegatedAuthority !== void 0 && validateAgentRunDelegatedAuthority(registration.delegatedAuthority) && ACTIVE_EMBEDDED_RUN_REGISTRATIONS.get(queueHandle) === registration && ACTIVE_EMBEDDED_RUNS.get(attempt.sessionId) === queueHandle,
			trajectoryRecorder: input.trajectoryRecorder ?? null,
			clearActiveRun: () => {
				try {
					unsubscribe();
				} finally {
					clearActiveRun();
				}
			}
		});
		try {
			attempt.onDeferredLifecycleOwner(deferredLifecycleOwner);
		} catch (error) {
			deferredLifecycleOwner.discard();
			throw error;
		}
	}
	return {
		subscription,
		queueHandle,
		deferredLifecycleOwner,
		toolSearchCatalogExecutor,
		getBeforeAgentFinalizeRevisionReason: () => beforeAgentFinalizeRevisionReason,
		getBeforeAgentFinalizeRevisionEntryId: () => beforeAgentFinalizeRevisionEntryId,
		stopAcceptingSteerMessages: admission.stop
	};
}
//#endregion
//#region src/agents/embedded-agent-runner/prompt-cache-request-observer.ts
/** Pairs foreground request inputs with completion usage before billing aggregation. */
function createPromptCacheRequestObserver(params, onObservation, onRequest) {
	let requestIndex = 0;
	let request;
	let observation;
	let contextUsage;
	return {
		onModelRequest: (model, context) => {
			if (request) completePromptCacheObservation(params);
			requestIndex += 1;
			request = {
				...beginPromptCacheObservation({
					...params,
					provider: model.provider,
					modelId: model.id,
					modelApi: model.api,
					systemPrompt: context.systemPrompt ?? "",
					tools: collectPromptCacheTools(context.tools ?? []),
					messages: context.messages
				}),
				requestIndex,
				messageCount: context.messages.length
			};
			onRequest?.(request);
			return request;
		},
		onModelUsage: (usage, providerPrompt, identity) => {
			if (!request) return;
			const cacheBreak = completePromptCacheObservation({
				...params,
				usage,
				providerPrompt
			});
			const providerPrefix = cacheBreak?.providerPrefix;
			const dropCause = !cacheBreak ? void 0 : cacheBreak.changes?.length ? "tracked-input-change" : !providerPrefix || providerPrefix === "unavailable" ? "unattributed:provider-prompt-unavailable" : providerPrefix === "prefix-match" ? "provider-cache-reuse-lost:unchanged-prefix" : providerPrefix.startsWith("continuation:") ? "unattributed:continuation-wire-input" : providerPrefix.startsWith("unverified-after:") ? "unattributed:bounded-prefix" : `provider-input-change:${providerPrefix}`;
			const hasCacheTelemetry = usage?.cacheTelemetry?.state !== "unavailable";
			contextUsage = usage?.contextUsage?.state === "available" ? {
				requestIndex: request.requestIndex,
				messageCount: request.messageCount,
				contextTokens: usage.contextUsage.totalTokens,
				responseId: identity?.responseId?.trim() || void 0,
				turnId: identity?.turnId?.trim() || void 0
			} : void 0;
			observation = {
				requestIndex: request.requestIndex,
				messageCount: request.messageCount,
				broke: Boolean(cacheBreak),
				previousCacheRead: request.previousCacheRead ?? void 0,
				requestGapMs: request.requestGapMs,
				providerPrefix,
				dropCause,
				requests: cacheBreak?.requests,
				promptTokens: usage?.contextUsage?.state === "available" ? usage.contextUsage.promptTokens : void 0,
				responseId: identity?.responseId,
				input: usage?.input,
				cacheRead: hasCacheTelemetry ? usage?.cacheRead : void 0,
				cacheWrite: hasCacheTelemetry ? usage?.cacheWrite : void 0,
				changes: cacheBreak?.changes ?? request.changes
			};
			const { snapshot } = request;
			request = void 0;
			onObservation(observation, snapshot);
		},
		getObservation: () => observation,
		getContextUsage: () => contextUsage
	};
}
//#endregion
//#region src/agents/embedded-agent-runner/thinking-replay-repair.ts
/** Repairs persisted provider replay state after provider-confirmed rejection. */
async function rewriteRejectedReplayInSessionManager(params, repair) {
	if (repair.replacements.length === 0) return {
		repaired: false,
		repairedCount: 0,
		reason: repair.emptyReason
	};
	const rewriteResult = await rewriteTranscriptEntriesInSessionManager({
		sessionManager: params.sessionManager,
		replacements: repair.replacements
	});
	if (!rewriteResult.changed) return {
		repaired: false,
		repairedCount: 0,
		reason: rewriteResult.reason
	};
	const target = params.sessionManager.getSessionTarget();
	if (target || params.sessionFile) emitSessionTranscriptUpdate({
		...params.sessionFile ? { sessionFile: params.sessionFile } : {},
		...target ? { target } : {
			sessionKey: params.sessionKey,
			...params.agentId ? { agentId: params.agentId } : {}
		}
	});
	log$7.warn(`[session-recovery] ${repair.logMessage}: repaired=${rewriteResult.rewrittenEntries} sessionKey=${params.sessionKey ?? params.sessionId ?? "unknown"}`);
	return {
		repaired: true,
		repairedCount: rewriteResult.rewrittenEntries,
		reason: rewriteResult.reason
	};
}
function repairRejectedThinkingReplayInSessionManager(params) {
	return rewriteRejectedReplayInSessionManager(params, {
		replacements: params.sessionManager.getBranch().flatMap((entry) => {
			if (entry.type !== "message") return [];
			const replacement = stripThinkingBlocksFromMessage(entry.message);
			return replacement === entry.message ? [] : [{
				entryId: entry.id,
				message: replacement
			}];
		}),
		emptyReason: "no thinking blocks on active branch",
		logMessage: "stripped thinking blocks after provider rejected replay"
	});
}
function repairRejectedCompactionReplayInSessionManager(params) {
	const owner = params.sessionManager.getBranch().findLast((entry) => entry.type === "message" && entry.message.role === "assistant" && isCompactionReplayCheckpoint(entry.message.providerReplay) && entry.message.providerReplay.data === params.checkpoint.data && (params.checkpoint.id === void 0 || entry.message.providerReplay.id === params.checkpoint.id));
	return rewriteRejectedReplayInSessionManager(params, {
		replacements: owner?.type === "message" && owner.message.role === "assistant" ? [{
			entryId: owner.id,
			message: stripCompactionReplayCheckpoint(owner.message)
		}] : [],
		emptyReason: "no matching compaction checkpoint on active branch",
		logMessage: "stripped compaction checkpoint after provider rejected replay"
	});
}
//#endregion
//#region src/shared/message-content-blocks.ts
/** Visit object-shaped content blocks in an assistant/user message payload. */
function visitObjectContentBlocks(message, visitor) {
	if (!message || typeof message !== "object") return;
	const content = message.content;
	if (!Array.isArray(content)) return;
	for (const block of content) {
		if (!block || typeof block !== "object") continue;
		visitor(block);
	}
}
//#endregion
//#region src/agents/embedded-agent-runner/tool-call-argument-decoding.ts
function decodeHtmlEntitiesInObject(value) {
	if (typeof value === "string") return decodeHtmlEntities(value);
	if (Array.isArray(value)) return value.map(decodeHtmlEntitiesInObject);
	if (value && typeof value === "object") {
		const result = {};
		for (const [key, entry] of Object.entries(value)) result[key] = decodeHtmlEntitiesInObject(entry);
		return result;
	}
	return value;
}
const decodedToolCallArguments = /* @__PURE__ */ new WeakSet();
function decodeToolCallArgumentsHtmlEntitiesInMessage(message) {
	visitObjectContentBlocks(message, (block) => {
		const typedBlock = block;
		if (typedBlock.type !== "toolCall" || typeof typedBlock.arguments !== "object" || !typedBlock.arguments) return;
		if (decodedToolCallArguments.has(typedBlock.arguments)) return;
		const decoded = decodeHtmlEntitiesInObject(typedBlock.arguments);
		decodedToolCallArguments.add(decoded);
		typedBlock.arguments = decoded;
	});
}
/** Wraps a stream function so tool-call arguments are decoded before consumers inspect them. */
function createHtmlEntityToolCallArgumentDecodingWrapper(baseStreamFn) {
	return (model, context, options) => mapAssistantMessageStream(baseStreamFn(model, context, options), (stream) => {
		const originalResult = stream.result.bind(stream);
		stream.result = async () => {
			const message = await originalResult();
			decodeToolCallArgumentsHtmlEntitiesInMessage(message);
			return message;
		};
		return wrapStreamObjectEvents(stream, (event) => {
			decodeToolCallArgumentsHtmlEntitiesInMessage(event.partial);
			decodeToolCallArgumentsHtmlEntitiesInMessage(event.message);
		});
	});
}
//#endregion
//#region src/agents/embedded-agent-runner/run/attempt-stop-reason-recovery.ts
const UNHANDLED_STOP_REASON_RE = /^Unhandled stop reason:\s*(.+)$/i;
function normalizeUnhandledStopReasonMessage(message) {
	if (typeof message !== "string") return;
	const stopReason = message.trim().match(UNHANDLED_STOP_REASON_RE)?.[1]?.trim();
	return stopReason ? `The model stopped because the provider returned an unhandled stop reason: ${stopReason}. Please rephrase and try again.` : void 0;
}
function normalizeUnhandledStopReasonError(error) {
	const message = normalizeUnhandledStopReasonMessage(formatErrorMessage(error));
	if (!message) throw error;
	return message;
}
function patchUnhandledStopReasonInAssistantMessage(message) {
	if (!message || typeof message !== "object") return;
	const assistant = message;
	const normalizedMessage = normalizeUnhandledStopReasonMessage(assistant.errorMessage);
	if (!normalizedMessage) return;
	assistant.stopReason = "error";
	assistant.errorMessage = normalizedMessage;
}
function buildUnhandledStopReasonErrorStream(model, errorMessage) {
	const stream = (0, event_stream_exports.createAssistantMessageEventStream)();
	queueMicrotask(() => {
		stream.push({
			type: "error",
			reason: "error",
			error: buildStreamErrorAssistantMessage({
				model,
				errorMessage
			})
		});
		stream.end();
	});
	return stream;
}
function wrapStreamHandleUnhandledStopReason(model, stream) {
	const originalResult = stream.result.bind(stream);
	stream.result = async () => {
		try {
			const message = await originalResult();
			patchUnhandledStopReasonInAssistantMessage(message);
			return message;
		} catch (err) {
			return buildStreamErrorAssistantMessage({
				model,
				errorMessage: normalizeUnhandledStopReasonError(err)
			});
		}
	};
	const originalAsyncIterator = stream[Symbol.asyncIterator].bind(stream);
	stream[Symbol.asyncIterator] = function() {
		const iterator = originalAsyncIterator();
		let emittedSyntheticTerminal = false;
		return createStreamIteratorWrapper({
			iterator,
			next: async (streamIterator) => {
				if (emittedSyntheticTerminal) return {
					done: true,
					value: void 0
				};
				try {
					const result = await streamIterator.next();
					if (!result.done && result.value && typeof result.value === "object") {
						const event = result.value;
						patchUnhandledStopReasonInAssistantMessage(event.error);
					}
					return result;
				} catch (err) {
					const normalizedMessage = normalizeUnhandledStopReasonError(err);
					emittedSyntheticTerminal = true;
					return {
						done: false,
						value: {
							type: "error",
							reason: "error",
							error: buildStreamErrorAssistantMessage({
								model,
								errorMessage: normalizedMessage
							})
						}
					};
				}
			}
		});
	};
	return stream;
}
/**
* Wraps provider streams so raw "Unhandled stop reason" failures are rewritten
* into stable error messages. Recovery covers synchronous creation failures,
* async stream creation failures, iterator errors, and `result()` errors.
*/
function wrapStreamFnHandleSensitiveStopReason(baseFn) {
	return (model, context, options) => {
		try {
			const maybeStream = baseFn(model, context, options);
			if (maybeStream && typeof maybeStream === "object" && "then" in maybeStream) return Promise.resolve(maybeStream).then((stream) => wrapStreamHandleUnhandledStopReason(model, stream), (err) => buildUnhandledStopReasonErrorStream(model, normalizeUnhandledStopReasonError(err)));
			return wrapStreamHandleUnhandledStopReason(model, maybeStream);
		} catch (err) {
			return buildUnhandledStopReasonErrorStream(model, normalizeUnhandledStopReasonError(err));
		}
	};
}
//#endregion
//#region src/agents/embedded-agent-runner/run/attempt-tool-call-replay-sanitization.ts
const REPLAY_TOOL_CALL_NAME_MAX_CHARS = 64;
function isReplaySafeThinkingTurn(content, allowedToolNames, isCompleted) {
	const seenToolCallIds = /* @__PURE__ */ new Set();
	for (const block of content) {
		if (!isRunnerToolCallBlock(block)) continue;
		const toolCallId = typeof block.id === "string" ? block.id.trim() : "";
		if (!toolCallId || seenToolCallIds.has(toolCallId)) return false;
		seenToolCallIds.add(toolCallId);
		const resolvedName = resolveReplayToolCallName(block, toolCallId, isCompleted(block) ? void 0 : allowedToolNames);
		if (!resolvedName || block.name !== resolvedName) return false;
	}
	return true;
}
function collectFollowingToolResults(messages, index) {
	const ids = /* @__PURE__ */ new Set();
	let sawNonToolResult = false;
	let displaced = false;
	for (let nextIndex = index + 1; nextIndex < messages.length; nextIndex += 1) {
		const message = messages[nextIndex];
		if (!message || typeof message !== "object") {
			sawNonToolResult = true;
			continue;
		}
		if (message.role === "assistant" && assistantTurnHasReplayToolCall(message)) break;
		if (message.role === "toolResult") {
			const resultIds = extractToolResultIds(message);
			for (const id of resultIds) ids.add(id);
			displaced ||= resultIds.length > 0 && sawNonToolResult;
			continue;
		}
		sawNonToolResult = true;
	}
	return {
		ids,
		displaced
	};
}
function resolveReplayToolCallName(block, rawId, allowedToolNames) {
	if (!hasToolCallInput(block) || !hasNonEmptyString(rawId)) return null;
	const rawName = typeof block.name === "string" ? block.name : "";
	if (rawName.length > 128) return null;
	const trimmed = resolveToolCallName(rawName, allowedToolNames, rawId, true)?.trim();
	if (!trimmed || trimmed.length > REPLAY_TOOL_CALL_NAME_MAX_CHARS || /\s/.test(trimmed)) return null;
	return trimmed;
}
function sanitizeReplayToolCallInputs(messages, allowedToolNames, allowProviderOwnedThinkingReplay) {
	let changed = false;
	let droppedAssistantMessages = 0;
	const out = [];
	const preservedThinkingToolCallIds = /* @__PURE__ */ new Set();
	const priorToolCallIds = /* @__PURE__ */ new Set();
	const isCompleted = createCompletedToolCallPredicate(messages);
	for (const [index, message] of messages.entries()) {
		if (!message) {
			changed = true;
			continue;
		}
		if (typeof message !== "object" || message.role !== "assistant" || !Array.isArray(message.content)) {
			out.push(message);
			continue;
		}
		if (allowProviderOwnedThinkingReplay && isSignedThinkingReplayAssistantSpan(message)) {
			const replaySafeToolCalls = extractToolCallsFromAssistant(message);
			const followingToolResults = collectFollowingToolResults(messages, index);
			if (isReplaySafeThinkingTurn(message.content, allowedToolNames, isCompleted) && replaySafeToolCalls.every((toolCall) => !preservedThinkingToolCallIds.has(toolCall.id) && (!followingToolResults.displaced || !priorToolCallIds.has(toolCall.id)) && followingToolResults.ids.has(toolCall.id))) {
				for (const toolCall of replaySafeToolCalls) {
					preservedThinkingToolCallIds.add(toolCall.id);
					priorToolCallIds.add(toolCall.id);
				}
				changed ||= followingToolResults.displaced;
				out.push(message);
			} else {
				changed = true;
				droppedAssistantMessages += 1;
			}
			continue;
		}
		const nextContent = [];
		let messageChanged = false;
		for (const block of message.content) {
			if (!isRunnerToolCallBlock(block)) {
				nextContent.push(block);
				continue;
			}
			const resolvedName = resolveReplayToolCallName(block, block.id, isCompleted(block) ? void 0 : allowedToolNames);
			if (!resolvedName) {
				messageChanged = true;
				continue;
			}
			messageChanged ||= block.name !== resolvedName;
			nextContent.push(block.name === resolvedName ? block : {
				...block,
				name: resolvedName
			});
		}
		changed ||= messageChanged;
		if (nextContent.length === 0 && messageChanged) {
			droppedAssistantMessages += 1;
			continue;
		}
		const nextMessage = messageChanged ? replaceCompactionReplayOwnerContent(message, nextContent) : message;
		for (const toolCall of extractToolCallsFromAssistant(nextMessage)) priorToolCallIds.add(toolCall.id);
		out.push(nextMessage);
	}
	return {
		messages: changed ? out : messages,
		droppedAssistantMessages
	};
}
function isSignedThinkingReplayAssistantSpan(message) {
	return assistantTurnHasReplayToolCall(message) && message.content.some(isThinkingLikeBlock);
}
function sanitizeAnthropicReplayToolResults(messages, disallowEmbeddedUserToolResultsForSignedThinkingReplay) {
	let changed = false;
	const out = [];
	for (const [index, message] of messages.entries()) {
		if (!message) {
			changed = true;
			continue;
		}
		if (typeof message !== "object" || message.role !== "user" || !Array.isArray(message.content)) {
			out.push(message);
			continue;
		}
		const previous = messages[index - 1];
		const shouldStripEmbeddedToolResults = disallowEmbeddedUserToolResultsForSignedThinkingReplay && isSignedThinkingReplayAssistantSpan(previous);
		const validToolUseIds = /* @__PURE__ */ new Set();
		if (assistantTurnHasReplayToolCall(previous)) {
			for (const block of previous.content) if (isRunnerToolCallBlock(block) && hasNonEmptyString(block.id)) validToolUseIds.add(block.id.trim());
		}
		const nextContent = message.content.filter((block) => {
			const typedBlock = asOptionalObjectRecord(block);
			if (typedBlock?.type !== "toolResult" && typedBlock?.type !== "tool") return true;
			if (shouldStripEmbeddedToolResults) return false;
			const resultIds = normalizeUniqueTrimmedStringList([
				typedBlock.toolUseId,
				typedBlock.toolCallId,
				typedBlock.tool_use_id,
				typedBlock.tool_call_id
			]);
			return validToolUseIds.size > 0 && resultIds.some((id) => validToolUseIds.has(id));
		});
		if (nextContent.length === message.content.length) {
			out.push(message);
			continue;
		}
		changed = true;
		out.push({
			...message,
			content: nextContent.length > 0 ? nextContent : [{
				type: "text",
				text: "[tool results omitted]"
			}]
		});
	}
	return changed ? out : messages;
}
function assistantTurnHasReplayToolCall(message) {
	if (!message || typeof message !== "object" || message.role !== "assistant") return false;
	return Array.isArray(message.content) && message.content.some(isRunnerToolCallBlock);
}
function stripTrailingAssistantPrefillTurns(messages) {
	let end = messages.length;
	while (end > 0) {
		const message = messages[end - 1];
		if (!message || typeof message !== "object" || message.role !== "assistant" || assistantTurnHasReplayToolCall(message)) break;
		end -= 1;
	}
	return end === messages.length ? messages : messages.slice(0, end);
}
function shouldApplyReplayToolCallIdSanitizer(params) {
	return params.sanitizeToolCallIds && Boolean(params.toolCallIdMode) && !params.isOpenAIResponsesApi;
}
function sanitizeReplayToolCallIdsForStream(params) {
	const paired = params.repairToolUseResultPairing ? sanitizeToolUseResultPairing(params.messages) : params.messages;
	return sanitizeToolCallIdsForCloudCodeAssist(paired, params.mode, {
		preserveNativeAnthropicToolUseIds: params.preserveNativeAnthropicToolUseIds,
		duplicateToolCallIdStyle: params.duplicateToolCallIdStyle,
		preserveReplaySafeThinkingToolCallIds: params.preserveReplaySafeThinkingToolCallIds,
		allowedToolNames: params.allowedToolNames
	});
}
function sanitizeOpenAIResponsesReplayForStream(messages) {
	const repaired = sanitizeToolUseResultPairingForModel(messages, true);
	return normalizeOpenAIResponsesToolCallIds(repaired);
}
function wrapStreamFnSanitizeMalformedToolCalls(baseFn, allowedToolNames, transcriptPolicy, provider) {
	return (model, context, options) => {
		const messages = context?.messages;
		if (!Array.isArray(messages)) return baseFn(model, context, options);
		const modelApi = model.api;
		const allowProviderOwnedThinkingReplay = shouldAllowProviderOwnedThinkingReplay({
			modelApi,
			provider,
			policy: {
				validateAnthropicTurns: transcriptPolicy?.validateAnthropicTurns === true,
				preserveSignatures: transcriptPolicy?.preserveSignatures === true,
				dropThinkingBlocks: transcriptPolicy?.dropThinkingBlocks === true
			}
		});
		const sanitized = sanitizeReplayToolCallInputs(messages, allowedToolNames, allowProviderOwnedThinkingReplay);
		const isOpenAIResponsesApi = modelApi === "openai-responses" || modelApi === "openai-chatgpt-responses" || modelApi === "azure-openai-responses";
		const replayInputsChanged = sanitized.messages !== messages;
		let nextMessages = isOpenAIResponsesApi ? sanitizeToolUseResultPairingForModel(sanitized.messages, true) : replayInputsChanged ? sanitizeToolUseResultPairing(sanitized.messages) : sanitized.messages;
		let strippedTrailingAssistantPrefill = false;
		if (transcriptPolicy?.validateAnthropicTurns) nextMessages = sanitizeAnthropicReplayToolResults(nextMessages, allowProviderOwnedThinkingReplay);
		if (transcriptPolicy?.validateAnthropicTurns || transcriptPolicy?.validateGeminiTurns) {
			const beforeStrip = nextMessages;
			nextMessages = stripTrailingAssistantPrefillTurns(nextMessages);
			strippedTrailingAssistantPrefill ||= nextMessages !== beforeStrip;
		}
		if (nextMessages === messages) {
			if (modelApi !== "bedrock-converse-stream") return baseFn(model, context, options);
			nextMessages = mergeConsecutiveUserMessages(nextMessages);
		} else if (sanitized.droppedAssistantMessages > 0 || transcriptPolicy?.validateAnthropicTurns || strippedTrailingAssistantPrefill) {
			if (transcriptPolicy?.validateGeminiTurns) nextMessages = validateGeminiTurns(nextMessages);
			if (transcriptPolicy?.validateAnthropicTurns) nextMessages = validateAnthropicTurns(nextMessages, { mergeConsecutiveTurns: shouldMergeConsecutiveTurns(transcriptPolicy, modelApi) });
		}
		if (nextMessages === messages) return baseFn(model, context, options);
		return baseFn(model, {
			...context,
			messages: nextMessages
		}, options);
	};
}
//#endregion
//#region src/agents/embedded-agent-runner/run/attempt-tool-call-stream-normalization.ts
const BLANK_TOOL_CALL_NAME_DESCRIPTION = "blank tool name";
function normalizeToolCallsInMessage(message, allowedToolNames, fallbackIdByContentIndex, earlierToolCallIds, seenToolCallIds) {
	if (!message || typeof message !== "object") return;
	const content = message.content;
	if (!Array.isArray(content)) return;
	let usedIds;
	let unknownToolName;
	let sawAllowedToolCall = false;
	let sawIncompleteToolCall = false;
	let sawBlankStringToolCall = false;
	const hasAllowedToolNames = allowedToolNames !== void 0;
	for (const block of content) {
		if (!isRunnerToolCallBlock(block)) continue;
		usedIds ??= /* @__PURE__ */ new Set();
		const rawId = typeof block.id === "string" ? block.id : void 0;
		const normalized = resolveToolCallName(typeof block.name === "string" ? block.name : "", allowedToolNames, rawId);
		if (normalized && normalized !== block.name) block.name = normalized;
		const trimmedId = rawId?.trim();
		if (trimmedId) usedIds.add(trimmedId);
		const rawBlockName = block.name;
		const hasStringName = typeof rawBlockName === "string";
		const rawName = hasStringName ? rawBlockName.trim() : "";
		if (!rawName) {
			if (hasStringName) sawBlankStringToolCall = true;
			else sawIncompleteToolCall = true;
			continue;
		}
		if (!hasAllowedToolNames) continue;
		if (hasStringName && allowedToolNames?.has(rawBlockName)) {
			sawAllowedToolCall = true;
			continue;
		}
		const normalizedUnknownToolName = normalizeToolPolicyName(rawName);
		if (!unknownToolName) unknownToolName = normalizedUnknownToolName;
		else if (unknownToolName !== normalizedUnknownToolName) sawIncompleteToolCall = true;
	}
	if (!usedIds) return;
	const assignedIds = /* @__PURE__ */ new Set();
	for (const [contentIndex, block] of content.entries()) {
		if (!isRunnerToolCallBlock(block)) continue;
		const trimmedId = typeof block.id === "string" ? block.id.trim() : "";
		if (trimmedId && !earlierToolCallIds.has(trimmedId) && !assignedIds.has(trimmedId)) {
			if (block.id !== trimmedId) block.id = trimmedId;
			assignedIds.add(trimmedId);
			continue;
		}
		let fallbackId = fallbackIdByContentIndex[contentIndex];
		while (!fallbackId || earlierToolCallIds.has(fallbackId) || usedIds.has(fallbackId) || assignedIds.has(fallbackId)) fallbackId = `call_${randomUUID().replace(/-/g, "").slice(0, 24)}`;
		fallbackIdByContentIndex[contentIndex] = fallbackId;
		block.id = fallbackId;
		usedIds.add(fallbackId);
		assignedIds.add(fallbackId);
	}
	for (const id of assignedIds) seenToolCallIds.add(id);
	if (!hasAllowedToolNames) return sawBlankStringToolCall ? {
		kind: "malformed",
		toolName: BLANK_TOOL_CALL_NAME_DESCRIPTION
	} : void 0;
	if (sawAllowedToolCall) return { kind: "allowed" };
	if (sawBlankStringToolCall && !sawIncompleteToolCall && unknownToolName === void 0) return {
		kind: "malformed",
		toolName: BLANK_TOOL_CALL_NAME_DESCRIPTION
	};
	if (sawIncompleteToolCall) return { kind: "incomplete" };
	return unknownToolName ? {
		kind: "unknown",
		toolName: unknownToolName
	} : { kind: "incomplete" };
}
function rewriteUnknownToolLoopMessage(message, toolName) {
	if (!message || typeof message !== "object") return;
	message.content = [{
		type: "text",
		text: `I can't use the tool "${toolName}" here because it isn't available. I need to stop retrying it and answer without that tool.`
	}];
	stripCompactionReplayCheckpointInPlace(message);
}
function guardUnknownToolLoopInMessage(message, toolCallState, state, params) {
	if (toolCallState?.kind === "allowed") {
		if (params.projection !== "partial") {
			state.lastUnknownToolName = void 0;
			state.count = 0;
		}
		return false;
	}
	if (toolCallState?.kind === "malformed") {
		if (params.projection === "result") {
			rewriteUnknownToolLoopMessage(message, toolCallState.toolName);
			return true;
		}
		return false;
	}
	const threshold = params.threshold;
	if (threshold === void 0 || threshold <= 0) return false;
	if (toolCallState?.kind !== "unknown") {
		if (params.countAttempt && params.projection === "result") {
			state.lastUnknownToolName = void 0;
			state.count = 0;
		}
		return false;
	}
	const unknownToolName = toolCallState.toolName;
	const countableMessage = message && typeof message === "object" ? message : void 0;
	if (params.countAttempt && !(countableMessage && state.countedMessages.has(countableMessage))) {
		if (countableMessage) state.countedMessages.add(countableMessage);
		state.count = state.lastUnknownToolName === unknownToolName ? state.count + 1 : 1;
		state.lastUnknownToolName = unknownToolName;
	}
	if (state.lastUnknownToolName === unknownToolName && state.count > threshold) rewriteUnknownToolLoopMessage(message, unknownToolName);
	return params.countAttempt;
}
function wrapStreamTrimToolCallNames(stream, allowedToolNames, options) {
	const fallbackIdByContentIndex = [];
	let streamAttemptAlreadyCounted = false;
	const normalize = (message) => normalizeToolCallsInMessage(message, allowedToolNames, fallbackIdByContentIndex, options.earlierToolCallIds, options.seenToolCallIds);
	const guard = (message, toolCallState, projection) => guardUnknownToolLoopInMessage(message, toolCallState, options.state, {
		threshold: options.unknownToolThreshold,
		countAttempt: projection !== "partial" && !streamAttemptAlreadyCounted,
		projection
	});
	const originalResult = stream.result.bind(stream);
	stream.result = async () => {
		const message = await originalResult();
		guard(message, normalize(message), "result");
		return message;
	};
	wrapStreamObjectEvents(stream, (event) => {
		const partialState = normalize(event.partial);
		const messageState = normalize(event.message);
		if (event.message && typeof event.message === "object") {
			const countedStreamAttempt = guard(event.message, messageState, "message");
			streamAttemptAlreadyCounted ||= countedStreamAttempt;
		}
		if (event.partial !== event.message) guard(event.partial, partialState, "partial");
	});
	return stream;
}
function wrapStreamFnTrimToolCallNames(baseFn, allowedToolNames, guardOptions) {
	const unknownToolGuardState = {
		count: 0,
		countedMessages: /* @__PURE__ */ new WeakSet()
	};
	const seenToolCallIds = /* @__PURE__ */ new Set();
	return (model, context, streamOptions) => {
		for (const message of context.messages ?? []) {
			if (message.role !== "assistant") continue;
			for (const block of message.content) if (isRunnerToolCallBlock(block) && typeof block.id === "string" && block.id.trim()) seenToolCallIds.add(block.id.trim());
		}
		const earlierToolCallIds = new Set(seenToolCallIds);
		return mapAssistantMessageStream(baseFn(model, context, streamOptions), (stream) => wrapStreamTrimToolCallNames(stream, allowedToolNames, {
			unknownToolThreshold: guardOptions?.unknownToolThreshold,
			state: unknownToolGuardState,
			earlierToolCallIds,
			seenToolCallIds
		}));
	};
}
//#endregion
//#region src/agents/embedded-agent-runner/run/attempt-tool-call-text-promotion.ts
const STANDALONE_TEXT_TOOL_CALL_PROMOTION_STOP_REASONS = /* @__PURE__ */ new Set(["stop", "toolUse"]);
function wrapStreamPromoteStandaloneTextToolCalls(stream, allowedToolNames) {
	const matcher = {
		hasExactName: (name) => Boolean(resolveToolCallName(name, allowedToolNames, void 0, true)),
		hasNamePrefix: (prefix) => couldNormalizeToolNamePrefixToAllowedTool(prefix, allowedToolNames)
	};
	const promotedIdBySource = /* @__PURE__ */ new Map();
	const normalizeTerminalMessage = (params) => {
		const scrubbed = projectScrubbedPlainTextToolCallMessage({
			forceIncompleteCandidates: true,
			matcher,
			message: params.message,
			preserveEmptyTextBlocks: params.preserveEmptyTextBlocks,
			resolveProtectedRanges: findMarkdownCodeRegions,
			requireAssistantRole: true
		});
		if (scrubbed) {
			stripCompactionReplayCheckpointInPlace(scrubbed.message);
			return {
				kind: "scrubbed",
				...scrubbed
			};
		}
		if (!params.allowPromotion) return;
		let ordinal = 0;
		const createStableToolCallBlock = (block, name) => {
			const sourceKey = `${ordinal}:${block.start}:${block.end}`;
			ordinal += 1;
			const id = promotedIdBySource.get(sourceKey) || `call_${randomUUID().replace(/-/g, "").slice(0, 24)}`;
			promotedIdBySource.set(sourceKey, id);
			return {
				type: "toolCall",
				id,
				name,
				arguments: block.arguments
			};
		};
		const promoted = projectStandalonePlainTextToolCallMessage({
			allowedStopReasons: STANDALONE_TEXT_TOOL_CALL_PROMOTION_STOP_REASONS,
			allowedToolNames,
			createToolCallBlock: createStableToolCallBlock,
			isRetainableNonTextBlock: isThinkingLikeBlock,
			message: params.message,
			requireAssistantRole: true,
			resolveProtectedRanges: findMarkdownCodeRegions,
			resolveToolName: (name) => resolveToolCallName(name, allowedToolNames, void 0, true)
		});
		if (promoted) stripCompactionReplayCheckpointInPlace(promoted.message);
		return promoted ? {
			kind: "promoted",
			...promoted
		} : void 0;
	};
	const originalResult = stream.result.bind(stream);
	stream.result = async () => {
		const message = await originalResult();
		const reason = message && typeof message === "object" ? message.stopReason : void 0;
		return normalizeTerminalMessage({
			allowPromotion: STANDALONE_TEXT_TOOL_CALL_PROMOTION_STOP_REASONS.has(reason),
			message
		})?.message ?? message;
	};
	const originalAsyncIterator = stream[Symbol.asyncIterator].bind(stream);
	const wrappedAsyncIterator = function() {
		const sourceIterator = originalAsyncIterator();
		const normalized = normalizePlainTextToolCallStreamEvents({ [Symbol.asyncIterator]: () => sourceIterator }, {
			createPromotedToolCallEvents: createPromotedPlainTextToolCallEvents,
			matcher,
			normalizeTerminalMessage,
			protectedRangesFenceCompatible: true,
			resolveProtectedRanges: findMarkdownCodeRegions
		})[Symbol.asyncIterator]();
		let started = false;
		return createStreamIteratorWrapper({
			iterator: normalized,
			next: (iterator) => {
				started = true;
				return iterator.next();
			},
			onReturn: async (iterator, value) => {
				const unopened = !started;
				started = true;
				try {
					return await iterator.return?.(value) ?? {
						done: true,
						value: void 0
					};
				} finally {
					if (unopened) await sourceIterator.return?.(value);
				}
			}
		});
	};
	if (!Reflect.set(stream, Symbol.asyncIterator, wrappedAsyncIterator)) throw new TypeError("Cannot replace stream async iterator");
	return stream;
}
function wrapStreamFnPromoteStandaloneTextToolCalls(baseFn, allowedToolNames) {
	if (!allowedToolNames || allowedToolNames.size === 0) return baseFn;
	return (model, context, streamOptions) => mapAssistantMessageStream(baseFn(model, context, streamOptions), (stream) => wrapStreamPromoteStandaloneTextToolCalls(stream, allowedToolNames));
}
//#endregion
//#region src/agents/embedded-agent-runner/run/attempt.tool-call-argument-repair.ts
const MAX_TOOLCALL_REPAIR_BUFFER_CHARS = 64e3;
const MAX_TOOLCALL_REPAIR_LEADING_CHARS = 96;
const MAX_TOOLCALL_REPAIR_TRAILING_CHARS = 3;
const TOOLCALL_REPAIR_ALLOWED_LEADING_RE = /^[a-z0-9\s"'`.:/_\\-]+$/i;
const TOOLCALL_REPAIR_ALLOWED_TRAILING_RE = /^[^\s{}[\]":,\\]{1,3}$/;
const TOOLCALL_REPAIR_SMART_QUOTES = /* @__PURE__ */ new Set([
	"“",
	"”",
	"„",
	"‟"
]);
const MAX_TOOLCALL_REPAIR_MEMBER_KEY_CHARS = 96;
const TOOLCALL_REPAIR_KNOWN_ARG_KEYS = /* @__PURE__ */ new Set([
	"args",
	"backupDir",
	"cmd",
	"command",
	"content",
	"cwd",
	"edits",
	"file",
	"file_path",
	"filePath",
	"filepath",
	"from",
	"line_end",
	"line_start",
	"lines",
	"message",
	"new_str",
	"new_string",
	"newText",
	"old_str",
	"old_string",
	"oldText",
	"path",
	"paths",
	"pattern",
	"query",
	"replacement",
	"text",
	"timeoutMs",
	"title",
	"to",
	"url",
	"urls",
	"workdir"
]);
const TOOLCALL_REPAIR_FREEFORM_VALUE_KEYS = /* @__PURE__ */ new Set([
	"content",
	"message",
	"new_str",
	"new_string",
	"newText",
	"old_str",
	"old_string",
	"oldText",
	"text"
]);
const TOOLCALL_REPAIR_FREEFORM_SUCCESSOR_KEYS = {
	old_str: "new_str",
	old_string: "new_string",
	oldText: "newText"
};
const TOOLCALL_REPAIR_JSON_STRING_ESCAPES = {
	"\"": "\"",
	"\\": "\\",
	"/": "/",
	b: "\b",
	f: "\f",
	n: "\n",
	r: "\r",
	t: "	"
};
function shouldAttemptMalformedToolCallRepair(partialJson, delta) {
	if (/[}\]]/.test(delta)) return true;
	const trimmedDelta = delta.trim();
	return trimmedDelta.length > 0 && trimmedDelta.length <= MAX_TOOLCALL_REPAIR_TRAILING_CHARS && /[}\]]/.test(partialJson);
}
function isAllowedToolCallRepairLeadingPrefix(prefix) {
	return !prefix || prefix.length <= MAX_TOOLCALL_REPAIR_LEADING_CHARS && TOOLCALL_REPAIR_ALLOWED_LEADING_RE.test(prefix) && (/^[.:'"`-]/.test(prefix) || /^(?:functions?|tools?)[._:/-]?/i.test(prefix));
}
function skipWhitespace(raw, index) {
	let next = index;
	while (next < raw.length && raw[next]?.trim() === "") next += 1;
	return next;
}
function isToolCallRepairSmartQuote(char) {
	return char !== void 0 && TOOLCALL_REPAIR_SMART_QUOTES.has(char);
}
function findAsciiQuotedStringEnd(raw, startIndex) {
	for (let i = startIndex + 1; i < raw.length; i += 1) if (raw[i] === "\\") i += 1;
	else if (raw[i] === "\"") return i + 1;
}
function readAsciiQuotedString(raw, startIndex) {
	const endIndex = findAsciiQuotedStringEnd(raw, startIndex);
	const parsed = endIndex === void 0 ? void 0 : safeParseJson(raw.slice(startIndex, endIndex));
	return typeof parsed === "string" && endIndex !== void 0 ? {
		value: parsed,
		endIndex
	} : void 0;
}
function readSmartQuotedString(raw, startIndex, closesAt, maxChars = Infinity) {
	for (let i = startIndex + 1; i < raw.length; i += 1) {
		if (isToolCallRepairSmartQuote(raw[i]) && closesAt(i)) return {
			value: raw.slice(startIndex + 1, i),
			endIndex: i + 1
		};
		if (i - startIndex > maxChars) return;
	}
}
function readObjectKey(raw, startIndex) {
	const char = raw[startIndex];
	return char === "\"" ? readAsciiQuotedString(raw, startIndex) : isToolCallRepairSmartQuote(char) ? readSmartQuotedString(raw, startIndex, (index) => raw[skipWhitespace(raw, index + 1)] === ":", MAX_TOOLCALL_REPAIR_MEMBER_KEY_CHARS) : void 0;
}
function readObjectMemberKeyAfterComma(raw, commaIndex) {
	const key = readObjectKey(raw, skipWhitespace(raw, commaIndex + 1));
	if (!key || raw[skipWhitespace(raw, key.endIndex)] !== ":") return;
	return key.value;
}
function normalizeToolCallRepairToolName(value) {
	const trimmed = value.trim();
	return /^[a-z0-9_-]{1,128}$/i.test(trimmed) ? trimmed.toLowerCase() : void 0;
}
function extractToolNameFromLeadingPrefix(prefix) {
	const match = /(?:^|[.\s])(?:functions?|tools?)[._:/-]?([a-z0-9_-]+)/i.exec(prefix);
	return match?.[1] ? normalizeToolCallRepairToolName(match[1]) : void 0;
}
function shouldCloseSmartQuotedValueAt(raw, quoteIndex, valueKey, toolName) {
	const nextIndex = skipWhitespace(raw, quoteIndex + 1);
	const nextChar = raw[nextIndex];
	if (nextIndex >= raw.length || nextChar === "}") return true;
	if (nextChar !== ",") return false;
	const nextKey = readObjectMemberKeyAfterComma(raw, nextIndex);
	if (!nextKey) return false;
	if (!TOOLCALL_REPAIR_FREEFORM_VALUE_KEYS.has(valueKey)) return TOOLCALL_REPAIR_KNOWN_ARG_KEYS.has(nextKey) || toolName === "read" && valueKey === "path" && (nextKey === "offset" || nextKey === "limit");
	return TOOLCALL_REPAIR_FREEFORM_SUCCESSOR_KEYS[valueKey] === nextKey;
}
function decodeSmartQuotedJsonStringEscapes(value) {
	return value.replace(/\\(?:(["\\/bfnrt])|u([0-9a-fA-F]{4}))/g, (match, escaped, hex) => {
		if (typeof hex === "string") return String.fromCharCode(Number.parseInt(hex, 16));
		return typeof escaped === "string" ? TOOLCALL_REPAIR_JSON_STRING_ESCAPES[escaped] ?? match : match;
	});
}
function readJsonValue(raw, startIndex) {
	let depth = 0;
	for (let i = startIndex; i < raw.length; i += 1) {
		const char = raw[i];
		if (char === "\"") {
			const endIndex = findAsciiQuotedStringEnd(raw, i);
			if (endIndex === void 0) return;
			i = endIndex - 1;
		} else if (char === "{" || char === "[") depth += 1;
		else if (char === "}" || char === "]") {
			if (depth === 0) return parseJsonValuePrefix(raw, startIndex, i);
			depth -= 1;
		} else if (char === "," && depth === 0) return parseJsonValuePrefix(raw, startIndex, i);
	}
	return parseJsonValuePrefix(raw, startIndex, raw.length);
}
function parseJsonValuePrefix(raw, startIndex, endIndex) {
	const value = safeParseJson(raw.slice(startIndex, endIndex).trim());
	return value === void 0 ? void 0 : {
		value,
		endIndex
	};
}
function readCommaSeparatedBody(raw, startIndex, closing, readEntry) {
	let index = skipWhitespace(raw, startIndex + 1);
	if (raw[index] === closing) return index + 1;
	while (index < raw.length) {
		const endIndex = readEntry(index);
		if (endIndex === void 0) return;
		index = skipWhitespace(raw, endIndex);
		if (raw[index] === ",") {
			index = skipWhitespace(raw, index + 1);
			continue;
		}
		return raw[index] === closing ? index + 1 : void 0;
	}
}
function readObjectValue(raw, startIndex, key, toolName) {
	const char = raw[startIndex];
	if (char === "\"") return readAsciiQuotedString(raw, startIndex);
	if (isToolCallRepairSmartQuote(char)) {
		const parsed = readSmartQuotedString(raw, startIndex, (index) => shouldCloseSmartQuotedValueAt(raw, index, key, toolName));
		return parsed && {
			...parsed,
			value: decodeSmartQuotedJsonStringEscapes(parsed.value)
		};
	}
	if (key === "edits" && char === "[") {
		const edits = [];
		const endIndex = readCommaSeparatedBody(raw, startIndex, "]", (index) => {
			const edit = parseSmartQuotedToolCallObject(raw, index);
			if (!edit) return;
			edits.push(edit.value);
			return edit.endIndex;
		});
		return endIndex === void 0 ? void 0 : {
			value: edits,
			endIndex
		};
	}
	return readJsonValue(raw, startIndex);
}
function parseSmartQuotedToolCallObject(raw, startIndex, toolName) {
	if (raw[startIndex] !== "{") return;
	const args = {};
	const seenKeys = /* @__PURE__ */ new Set();
	const endIndex = readCommaSeparatedBody(raw, startIndex, "}", (index) => {
		const key = readObjectKey(raw, index);
		if (!key || seenKeys.has(key.value)) return;
		seenKeys.add(key.value);
		const colonIndex = skipWhitespace(raw, key.endIndex);
		if (raw[colonIndex] !== ":") return;
		const value = readObjectValue(raw, skipWhitespace(raw, colonIndex + 1), key.value, toolName);
		if (!value) return;
		args[key.value] = value.value;
		return value.endIndex;
	});
	return endIndex === void 0 ? void 0 : {
		value: args,
		endIndex
	};
}
function tryExtractUsableToolCallArgumentsFromJson(raw) {
	const extracted = extractBalancedJsonPrefix(raw);
	if (!extracted) return;
	const leadingPrefix = raw.slice(0, extracted.startIndex).trim();
	if (!isAllowedToolCallRepairLeadingPrefix(leadingPrefix)) return;
	const suffix = raw.slice(extracted.startIndex + extracted.json.length).trim();
	if (leadingPrefix.length === 0 && suffix.length === 0) return;
	return finishToolCallArgumentRepair(safeParseJsonRecord(extracted.json), leadingPrefix, suffix);
}
function finishToolCallArgumentRepair(args, leadingPrefix, trailingSuffix) {
	if (!args || trailingSuffix.length > MAX_TOOLCALL_REPAIR_TRAILING_CHARS || trailingSuffix.length > 0 && !TOOLCALL_REPAIR_ALLOWED_TRAILING_RE.test(trailingSuffix)) return;
	return {
		args,
		kind: "repaired",
		leadingPrefix,
		trailingSuffix
	};
}
function tryExtractSmartQuotedToolCallArguments(raw, toolNameFromContext) {
	if (!/[\u201c\u201d\u201e\u201f]/.test(raw)) return;
	const startIndex = raw.indexOf("{");
	if (startIndex < 0) return;
	const leadingPrefix = raw.slice(0, startIndex).trim();
	if (!isAllowedToolCallRepairLeadingPrefix(leadingPrefix)) return;
	const parsed = parseSmartQuotedToolCallObject(raw, startIndex, toolNameFromContext ?? extractToolNameFromLeadingPrefix(leadingPrefix));
	if (!parsed) return;
	return finishToolCallArgumentRepair(parsed.value, leadingPrefix, raw.slice(parsed.endIndex).trim());
}
function tryExtractUsableToolCallArguments(raw, toolNameFromContext) {
	if (!raw.trim()) return;
	const parsedRaw = safeParseJsonRecord(raw);
	if (parsedRaw) return {
		args: parsedRaw,
		kind: "preserved",
		leadingPrefix: "",
		trailingSuffix: ""
	};
	return tryExtractUsableToolCallArgumentsFromJson(raw) ?? tryExtractSmartQuotedToolCallArguments(raw, toolNameFromContext);
}
function readToolCallBlock(message, contentIndex) {
	const content = asOptionalObjectRecord(message)?.content;
	const block = Array.isArray(content) ? content[contentIndex] : void 0;
	return isRunnerToolCallBlock(block) ? block : void 0;
}
function wrapStreamRepairMalformedToolCallArguments(stream) {
	const stateByIndex = /* @__PURE__ */ new Map();
	const originalResult = stream.result.bind(stream);
	stream.result = async () => {
		const message = await originalResult();
		for (const [index, state] of stateByIndex) {
			const block = readToolCallBlock(message, index);
			if (block && state.repairedArgs) block.arguments = state.repairedArgs;
		}
		stateByIndex.clear();
		return message;
	};
	wrapStreamObjectEvents(stream, (event) => {
		const index = event.contentIndex;
		if (typeof index !== "number" || !Number.isInteger(index)) return;
		if (event.type === "toolcall_delta" && typeof event.delta === "string") {
			const state = stateByIndex.get(index) ?? { partialJson: "" };
			if (state.disabled) return;
			stateByIndex.set(index, state);
			state.partialJson += event.delta;
			if (state.partialJson.length > MAX_TOOLCALL_REPAIR_BUFFER_CHARS) {
				state.partialJson = "";
				state.repairedArgs = void 0;
				state.disabled = true;
				return;
			}
			const hadRepairState = state.repairedArgs !== void 0;
			if (!shouldAttemptMalformedToolCallRepair(state.partialJson, event.delta) && !hadRepairState) return;
			const blocks = [readToolCallBlock(event.partial, index), readToolCallBlock(event.message, index)];
			const toolName = blocks.map((block) => typeof block?.name === "string" ? normalizeToolCallRepairToolName(block.name) : void 0).find((name) => name !== void 0);
			const repair = tryExtractUsableToolCallArguments(state.partialJson, toolName);
			const hadPreexistingArgs = state.hadPreexistingArgs || !hadRepairState && blocks.some((block) => isRecord(block?.arguments) && Object.keys(block.arguments).length > 0);
			state.repairedArgs = repair?.args;
			if (repair) state.hadPreexistingArgs = hadPreexistingArgs;
			if (repair || !hadPreexistingArgs) {
				for (const block of blocks) if (block) block.arguments = repair?.args ?? {};
			}
			if (repair?.kind === "repaired" && !state.loggedRepair) {
				state.loggedRepair = true;
				log$7.warn(`repairing malformed tool call arguments with ${repair.leadingPrefix.length} leading chars and ${repair.trailingSuffix.length} trailing chars`);
			}
		}
		if (event.type === "toolcall_end") {
			const repairedArgs = stateByIndex.get(index)?.repairedArgs;
			if (repairedArgs) {
				for (const block of [
					asOptionalObjectRecord(event.toolCall),
					readToolCallBlock(event.partial, index),
					readToolCallBlock(event.message, index)
				]) if (block) block.arguments = repairedArgs;
				stateByIndex.set(index, {
					partialJson: "",
					repairedArgs
				});
			} else stateByIndex.delete(index);
		}
	});
	return stream;
}
function wrapStreamFnRepairMalformedToolCallArguments(baseFn) {
	return (model, context, options) => mapAssistantMessageStream(baseFn(model, context, options), wrapStreamRepairMalformedToolCallArguments);
}
function shouldRepairMalformedToolCallArguments(params) {
	const modelApi = params.modelApi ?? "";
	return normalizeProviderId(params.provider ?? "") === "kimi" && modelApi === "anthropic-messages" || modelApi === "openai-completions" || modelApi === "azure-openai-responses" || modelApi === "openai-chatgpt-responses";
}
//#endregion
//#region src/agents/embedded-agent-runner/run/llm-idle-timeout.ts
const DEFAULT_LLM_IDLE_TIMEOUT_MS = 12e4;
const SELF_HOSTED_LLM_IDLE_TIMEOUT_MS = 3e5;
const CLOUD_LLM_FIRST_EVENT_TIMEOUT_MS = DEFAULT_LLM_IDLE_TIMEOUT_MS;
const LOCAL_LLM_FIRST_EVENT_TIMEOUT_MS = 3e5;
const CRON_LLM_IDLE_TIMEOUT_MS = 6e4;
const LOCAL_PROVIDER_AUTH_MARKERS = /* @__PURE__ */ new Set(["custom-local", "ollama-local"]);
const SELF_HOSTED_PROVIDER_ID_PREFIXES = [
	"ollama",
	"lmstudio",
	"vllm",
	"sglang",
	"llama-cpp"
];
const EXPLICIT_LOCAL_HOSTNAMES = /* @__PURE__ */ new Set([
	"docker.orb.internal",
	"host.docker.internal",
	"host.orb.internal"
]);
/**
* Local endpoints can stay silent during prompt evaluation. Classify the URL
* hostname without DNS on this hot path. IPv4-mapped IPv6 deliberately covers
* loopback only, matching the cron model preflight policy.
*/
function isLocalProviderHostname(hostname) {
	let host = hostname;
	if (host.startsWith("[") && host.endsWith("]")) host = host.slice(1, -1);
	if (host === "localhost" || host === "0.0.0.0" || host === "::1" || host === "::ffff:7f00:1" || host === "::ffff:127.0.0.1" || host.endsWith(".local")) return true;
	if (/^f[cd][0-9a-f]{2}:/.test(host) || /^fe[89ab][0-9a-f]:/.test(host)) return true;
	if (!/^\d+\.\d+\.\d+\.\d+$/.test(host)) return false;
	const octets = host.split(".").map((part) => Number.parseInt(part, 10));
	if (octets.some((p) => !Number.isInteger(p) || p < 0 || p > 255)) return false;
	const [a, b] = octets;
	return a === 127 || a === 10 || a === 172 && b !== void 0 && b >= 16 && b <= 31 || a === 192 && b === 168 || a === 100 && b !== void 0 && b >= 64 && b <= 127;
}
function isBareProviderHostname(hostname) {
	return /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/.test(hostname);
}
function isSelfHostedProviderId(provider) {
	const normalized = provider?.trim().toLowerCase();
	if (!normalized || normalized === "ollama-cloud") return false;
	return SELF_HOSTED_PROVIDER_ID_PREFIXES.some((prefix) => normalized === prefix || normalized.startsWith(`${prefix}-`));
}
function findConfiguredProviderConfig(cfg, provider) {
	const normalizedProvider = provider?.trim().toLowerCase();
	if (!normalizedProvider) return;
	const providers = cfg?.models?.providers;
	return providers?.[normalizedProvider] || Object.entries(providers ?? {}).find(([key]) => key.trim().toLowerCase() === normalizedProvider)?.[1];
}
function hasLocalProviderAuthMarker(apiKey) {
	return typeof apiKey === "string" && LOCAL_PROVIDER_AUTH_MARKERS.has(apiKey.trim().toLowerCase());
}
function hasConfiguredLocalProviderSignal(params) {
	const providerConfig = findConfiguredProviderConfig(params.cfg, params.provider);
	return Boolean(providerConfig?.localService || hasLocalProviderAuthMarker(providerConfig?.apiKey));
}
/**
* Classifies the model endpoint locality shared by the idle and first-event
* watchdogs. Ollama `*:cloud` models stay "cloud" even behind a local proxy.
*/
function resolveRuntimeModelLocality(params) {
	const baseUrl = params?.model?.baseUrl;
	const hostname = typeof baseUrl === "string" ? URL.parse(baseUrl)?.hostname.toLowerCase() : void 0;
	const notCloudModel = !isCloudModelRef(params?.model?.id);
	return {
		isLocalRuntimeModel: Boolean(hostname && isLocalProviderHostname(hostname) && notCloudModel),
		isSelfHostedRuntimeModel: notCloudModel && (isSelfHostedProviderId(params?.model?.provider) || Boolean(hostname && (EXPLICIT_LOCAL_HOSTNAMES.has(hostname) || isBareProviderHostname(hostname) && hasConfiguredLocalProviderSignal({
			cfg: params?.cfg,
			provider: params?.model?.provider
		}))))
	};
}
function resolveLlmTimeoutBounds(params) {
	const runTimeoutMs = asPositiveFiniteNumber(params?.runTimeoutMs);
	const agentTimeoutMs = finiteSecondsToTimerSafeMilliseconds(params?.cfg?.agents?.defaults?.timeoutSeconds);
	const hasExplicitRunTimeout = runTimeoutMs !== void 0;
	const boundedRunTimeoutMs = hasExplicitRunTimeout && runTimeoutMs < 2147e6 ? runTimeoutMs : void 0;
	return {
		boundedRunTimeoutMs,
		agentTimeoutMs,
		timeoutBounds: [boundedRunTimeoutMs, hasExplicitRunTimeout ? void 0 : agentTimeoutMs].filter((value) => value !== void 0 && value < 2147e6)
	};
}
const clampTimeoutMs = (valueMs) => clampTimerTimeoutMs(valueMs) ?? 1;
function resolveLlmTimeoutMs(phase, params) {
	const { boundedRunTimeoutMs, agentTimeoutMs, timeoutBounds } = resolveLlmTimeoutBounds(params);
	const { isLocalRuntimeModel, isSelfHostedRuntimeModel } = resolveRuntimeModelLocality(params);
	const modelRequestTimeoutMs = asPositiveFiniteNumber(params?.modelRequestTimeoutMs);
	if (modelRequestTimeoutMs !== void 0) return clampTimeoutMs(Math.min(modelRequestTimeoutMs, ...timeoutBounds));
	if (phase === "first-event") return clampTimeoutMs(Math.min(isLocalRuntimeModel || isSelfHostedRuntimeModel ? LOCAL_LLM_FIRST_EVENT_TIMEOUT_MS : CLOUD_LLM_FIRST_EVENT_TIMEOUT_MS, ...timeoutBounds));
	const classIdleTimeoutMs = isSelfHostedRuntimeModel ? SELF_HOSTED_LLM_IDLE_TIMEOUT_MS : DEFAULT_LLM_IDLE_TIMEOUT_MS;
	const budgetMs = boundedRunTimeoutMs ?? agentTimeoutMs;
	if (budgetMs === void 0) return isLocalRuntimeModel ? 0 : classIdleTimeoutMs;
	const boundedCron = boundedRunTimeoutMs !== void 0 && params?.trigger === "cron";
	if (isLocalRuntimeModel || boundedCron && isSelfHostedRuntimeModel) return clampTimeoutMs(budgetMs);
	return clampTimeoutMs(Math.min(budgetMs, boundedCron ? CRON_LLM_IDLE_TIMEOUT_MS : classIdleTimeoutMs));
}
function resolveLlmIdleTimeoutMs(params) {
	return resolveLlmTimeoutMs("idle", params);
}
function resolveLlmFirstEventTimeoutMs(params) {
	return resolveLlmTimeoutMs("first-event", params);
}
/**
* Wraps a stream function with idle timeout detection for both stream creation
* and iterator progress. Each successful `next()` resets the timer; a timeout
* aborts the provider request and surfaces the same Error to the caller.
* Creation ends at provider acceptance or stream activity, not when a producer
* returns its stream object. `scope: "creation-only"` leaves local providers
* free of gap policing after that boundary.
*
* When `runId` is provided, run-scoped tool activity can reset the active wait
* and recent activity before stream creation bridges into the first wait.
*/
function streamWithIdleTimeout(baseFn, timeoutMs, onIdleTimeout, opts) {
	const guardIterationGaps = opts?.scope !== "creation-only";
	const runId = opts?.runId;
	const progressTimeoutMs = clampTimeoutMs(timeoutMs * 2);
	return (model, context, options) => {
		const trackCleanup = captureAsyncWorkTracker();
		const streamAbortController = new AbortController();
		const firstEventTimeoutMs = clampTimeoutMs(getFirstStreamEventTimeoutMs(options) ?? timeoutMs);
		const startTimer = (delay, reject, budget = timeoutMs, reason = "no response from model") => {
			const timer = setTimeout(() => {
				if (requestDeadline?.reject === reject) requestTimedOut = true;
				clearRequestDeadline();
				const error = /* @__PURE__ */ new Error(`LLM idle timeout (${Math.floor(budget / 1e3)}s): ${reason}`);
				streamAbortController.abort(error);
				onIdleTimeout?.(error);
				reject(error);
			}, delay);
			timer.unref?.();
			return timer;
		};
		let requestDeadline;
		let iterationWatchdogActive = false;
		let requestTimedOut = false;
		let requestTimeout = new Promise((_, reject) => {
			requestDeadline = {
				timer: startTimer(firstEventTimeoutMs, reject, firstEventTimeoutMs),
				reject,
				accepted: false
			};
		});
		requestTimeout.catch(() => {});
		const clearRequestDeadline = () => {
			clearTimeout(requestDeadline?.timer);
			requestDeadline = void 0;
			if (!requestTimedOut) requestTimeout = void 0;
			unsubscribeCreationActivity();
		};
		const finishCreation = () => {
			if (!requestDeadline || requestDeadline.accepted) return;
			requestDeadline.accepted = true;
			unsubscribeCreationActivity();
			clearTimeout(requestDeadline.timer);
			if (guardIterationGaps && !iterationWatchdogActive) requestDeadline.timer = startTimer(timeoutMs, requestDeadline.reject);
			else clearRequestDeadline();
		};
		const unsubscribeCreationActivity = onLlmRequestActivity(streamAbortController.signal, finishCreation);
		const sourceSignal = options?.signal;
		const abortFromSourceSignal = () => {
			clearRequestDeadline();
			streamAbortController.abort(sourceSignal?.reason);
		};
		if (sourceSignal?.aborted) abortFromSourceSignal();
		else sourceSignal?.addEventListener("abort", abortFromSourceSignal, { once: true });
		const cleanupSourceSignal = () => {
			clearRequestDeadline();
			sourceSignal?.removeEventListener("abort", abortFromSourceSignal);
		};
		const withSourceAbort = (promise) => sourceSignal ? abortable(sourceSignal, promise) : promise;
		const withRequestTimeout = (promise) => requestTimeout ? Promise.race([promise, requestTimeout]) : promise;
		let maybeStream;
		try {
			maybeStream = baseFn(model, context, withProviderAcceptanceObserver({
				...options,
				signal: streamAbortController.signal
			}, finishCreation));
		} catch (error) {
			cleanupSourceSignal();
			throw error;
		}
		const wrapStream = (stream) => {
			const producerCompletion = getEventStreamCompletion(stream);
			producerCompletion?.then(cleanupSourceSignal, cleanupSourceSignal);
			const originalAsyncIterator = stream[Symbol.asyncIterator].bind(stream);
			stream[Symbol.asyncIterator] = function() {
				const iterator = originalAsyncIterator();
				let returning;
				const returnIterator = (value) => {
					returning ??= trackCleanup(() => Promise.resolve().then(() => iterator.return?.(value) ?? {
						done: true,
						value: void 0
					}));
					returning.catch(() => recordAgentCleanupFailure());
					return returning;
				};
				let idleTimer;
				let progressTimer;
				let rejectIdleTimeout;
				let streamFirstArmDone = false;
				let settled = false;
				const clearTimers = () => {
					clearTimeout(idleTimer);
					clearTimeout(progressTimer);
					idleTimer = progressTimer = void 0;
				};
				const rejectTimeout = (error) => {
					clearTimers();
					rejectIdleTimeout?.(error);
				};
				const armTimer = (progress = true) => {
					clearTimeout(idleTimer);
					if (!guardIterationGaps || settled || !producerCompletion && !rejectIdleTimeout) {
						clearTimers();
						return;
					}
					const activeToolMs = runId ? getLastToolActivityMs(runId) : 0;
					const recentActivity = activeToolMs > 0 && Date.now() - activeToolMs < timeoutMs;
					const effectiveTimeout = !streamFirstArmDone && recentActivity ? Math.max(1, timeoutMs - Math.max(0, Date.now() - activeToolMs)) : timeoutMs;
					streamFirstArmDone = true;
					idleTimer = startTimer(effectiveTimeout, rejectTimeout);
					iterationWatchdogActive = true;
					if (requestDeadline?.accepted) clearRequestDeadline();
					if (progress || !progressTimer) {
						clearTimeout(progressTimer);
						progressTimer = startTimer(progressTimeoutMs, rejectTimeout, progressTimeoutMs, "no model progress");
					}
				};
				const unsubscribeLlmActivity = onLlmRequestActivity(streamAbortController.signal, (progress) => {
					armTimer(progress);
					if (progress && runId && areDiagnosticsEnabledForProcess()) markDiagnosticRunProgress({
						runId,
						reason: "model_call:stream_progress"
					});
				});
				const unsubscribeStreamToolActivity = runId ? onToolActivity(runId, armTimer) : void 0;
				const settle = () => {
					if (settled) return;
					settled = true;
					rejectIdleTimeout = void 0;
					clearTimers();
					unsubscribeLlmActivity();
					unsubscribeStreamToolActivity?.();
					cleanupSourceSignal();
				};
				producerCompletion?.then(settle, settle);
				return createStreamIteratorWrapper({
					iterator,
					next: async (streamIterator) => {
						let pendingNext;
						try {
							const timeoutPromise = new Promise((_, reject) => {
								rejectIdleTimeout = reject;
								armTimer(false);
							});
							pendingNext = streamIterator.next();
							const result = await withSourceAbort(withRequestTimeout(Promise.race([pendingNext, timeoutPromise])));
							finishCreation();
							if (result.done) {
								settle();
								return result;
							}
							rejectIdleTimeout = void 0;
							armTimer();
							return result;
						} catch (error) {
							settle();
							trackCleanup(() => Promise.allSettled([pendingNext, returnIterator()])).catch(() => recordAgentCleanupFailure());
							throw error;
						}
					},
					onReturn(_streamIterator, value) {
						settle();
						return returnIterator(value);
					},
					onThrow(streamIterator, error) {
						settle();
						return streamIterator.throw?.(error) ?? Promise.reject(toErrorObject(error, "Non-Error rejection"));
					}
				});
			};
			return stream;
		};
		if (maybeStream && typeof maybeStream === "object" && "then" in maybeStream) {
			const source = Promise.resolve(maybeStream);
			return withSourceAbort(withRequestTimeout(source)).then(wrapStream, (error) => {
				cleanupSourceSignal();
				trackCleanup(async () => {
					const late = await source.catch(() => void 0);
					if (late) await late[Symbol.asyncIterator]().return?.();
				}).catch(() => recordAgentCleanupFailure());
				throw error;
			});
		}
		return wrapStream(maybeStream);
	};
}
//#endregion
//#region src/agents/embedded-agent-runner/run/attempt-stream.ts
function wrapStreamFnWithCompactionReplayRepair(streamFn, onRejected) {
	return async (model, context, options) => {
		const trackRepair = captureAsyncWorkTracker();
		const repairs = [];
		const joinRepairs = async () => {
			let joined = 0;
			while (joined !== repairs.length) {
				joined = repairs.length;
				const rejected = (await Promise.allSettled(repairs)).find((result) => result.status === "rejected");
				if (rejected?.status === "rejected") throw rejected.reason;
			}
		};
		const replayOptions = options;
		const nextOptions = {
			...options,
			onCompactionRejected: (checkpoint) => {
				const repair = trackRepair(() => onRejected(checkpoint));
				repairs.push(repair);
				repair.catch(() => {});
				replayOptions?.onCompactionRejected?.(checkpoint);
			}
		};
		let response;
		try {
			response = await streamFn(model, context, nextOptions);
		} catch (error) {
			await joinRepairs();
			throw error;
		}
		return wrapStreamObjectSettlement(response, joinRepairs);
	};
}
function installEmbeddedAttemptStreamGuards(input, callbacks) {
	const { attempt } = input;
	const { agentSession: { activeSession: session }, anthropicPayloadLogger, cacheTrace, contextGuards, isOpenAIResponsesApi, sessionManager, state: { systemPromptText }, transcriptPolicy, transport: { compactionReplayEnabled, effectiveAgentTransport, effectivePromptCacheRetention, streamStrategy, providerTextTransforms } } = input.prepared.sessionRuntime;
	const { liveAllowedToolNames, replayAllowedToolNames } = input.prepared.toolCatalog.toolSearchRunPlan;
	const installStreamWrapper = (wrapper, ...args) => {
		session.agent.streamFn = wrapper(session.agent.streamFn, ...args);
	};
	const { sessionAgentId } = input.setup;
	const { signal: abortSignal } = input.runAbortController;
	const operatorAuthority = readRunOperatorAuthority(attempt);
	if (operatorAuthority) {
		const providerStream = session.agent.streamFn;
		session.agent.streamFn = (model, context, options) => {
			assertOperatorModelAllowed(operatorAuthority, {
				provider: attempt.provider,
				model: attempt.modelId
			});
			return providerStream(model, context, options);
		};
	}
	const repairRejectedReplay = async (kind, checkpoint) => {
		try {
			const repairParams = {
				sessionManager,
				sessionFile: attempt.sessionFile,
				sessionId: attempt.sessionId,
				sessionKey: attempt.sessionKey,
				agentId: sessionAgentId
			};
			await withSessionManagerWrite(sessionManager, async () => {
				abortSignal.throwIfAborted();
				let repair;
				if (kind === "compaction") {
					if (!checkpoint) {
						log$7.warn(`[session-recovery] unable to repair rejected compaction replay: checkpoint identity unavailable sessionId=${session.sessionId}`);
						return;
					}
					repair = await repairRejectedCompactionReplayInSessionManager({
						...repairParams,
						checkpoint
					});
				} else repair = await repairRejectedThinkingReplayInSessionManager(repairParams);
				if (repair.repaired) {
					callbacks.onRejectedProviderReplayRepaired();
					return;
				}
				log$7.warn(`[session-recovery] provider rejected ${kind} replay but transcript repair made no changes: sessionId=${session.sessionId} reason=${repair.reason ?? "unknown"}`);
			});
		} catch (error) {
			log$7.warn(`[session-recovery] unable to repair rejected ${kind} replay: sessionId=${session.sessionId} error=${String(error)}`);
		}
	};
	const providerPromptState = getProviderPromptState(attempt.runId);
	const turnFacts = `trigger=${attempt.trigger ?? "unknown"} provenance=${attempt.inputProvenance?.kind ?? "none"}${attempt.inputProvenance?.sourceTool ? `:${attempt.inputProvenance.sourceTool}` : ""} replyMode=${attempt.sourceReplyDeliveryMode ?? "unset"} senderIsOwner=${attempt.senderIsOwner ?? "unset"}`;
	const cacheObserver = createPromptCacheRequestObserver({
		turn: turnFacts,
		sessionId: attempt.sessionId,
		sessionKey: attempt.sessionKey,
		promptCacheKey: attempt.promptCacheKey,
		cacheRetention: effectivePromptCacheRetention,
		streamStrategy,
		transport: effectiveAgentTransport
	}, (observation, snapshot) => {
		if (observation.broke) {
			const changes = observation.changes?.map((change) => `${change.code}(${change.detail})`).join(", ") ?? observation.dropCause;
			log$7.warn(`[prompt-cache] cache read dropped ${observation.previousCacheRead} -> ${observation.cacheRead} runId=${attempt.runId} request=${observation.requestIndex} for ${snapshot.provider}/${snapshot.modelId} via ${streamStrategy}; ${changes}; requestGapMs=${observation.requestGapMs ?? "unknown"} promptTokens=${observation.promptTokens ?? "unknown"} responseId=${observation.responseId ?? "unknown"} sessionId=${attempt.sessionId} ${turnFacts} providerPrefix=${observation.providerPrefix ?? "unavailable"} requests=${JSON.stringify(observation.requests)}`);
		}
		cacheTrace?.recordStage("cache:result", { options: { ...observation } });
	}, (request) => {
		cacheTrace?.recordStage("cache:state", { options: {
			...request,
			previousCacheRead: request.previousCacheRead ?? void 0
		} });
	});
	if (cacheTrace) {
		cacheTrace.recordStage("session:loaded", {
			messages: session.messages,
			system: systemPromptText,
			note: "after session create"
		});
		session.agent.streamFn = cacheTrace.wrapStreamFn(session.agent.streamFn);
	}
	if (transcriptPolicy.dropThinkingBlocks || transcriptPolicy.dropReasoningFromHistory) installStreamWrapper(wrapStreamFnWithMessageTransform, (messages) => {
		const reasoningSanitized = transcriptPolicy.dropReasoningFromHistory ? dropReasoningFromHistory(messages) : messages;
		return transcriptPolicy.dropThinkingBlocks ? dropThinkingBlocks(reasoningSanitized) : reasoningSanitized;
	});
	if (transcriptPolicy.preserveSignatures || transcriptPolicy.dropThinkingBlocks || transcriptPolicy.dropReasoningFromHistory) installStreamWrapper(wrapAnthropicStreamWithRecovery, {
		id: session.sessionId,
		onRecoveredAnthropicThinking: () => repairRejectedReplay("thinking")
	});
	const replayToolCallIdSanitizerDecision = {
		sanitizeToolCallIds: transcriptPolicy.sanitizeToolCallIds,
		toolCallIdMode: transcriptPolicy.toolCallIdMode,
		isOpenAIResponsesApi
	};
	if (shouldApplyReplayToolCallIdSanitizer(replayToolCallIdSanitizerDecision)) {
		const mode = replayToolCallIdSanitizerDecision.toolCallIdMode;
		installStreamWrapper(wrapStreamFnWithMessageTransform, (messages, model) => sanitizeReplayToolCallIdsForStream({
			messages,
			mode,
			allowedToolNames: replayAllowedToolNames,
			preserveNativeAnthropicToolUseIds: transcriptPolicy.preserveNativeAnthropicToolUseIds,
			duplicateToolCallIdStyle: transcriptPolicy.duplicateToolCallIdStyle,
			preserveReplaySafeThinkingToolCallIds: shouldAllowProviderOwnedThinkingReplay({
				modelApi: model.api,
				provider: attempt.provider,
				policy: transcriptPolicy
			}),
			repairToolUseResultPairing: transcriptPolicy.repairToolUseResultPairing
		}));
	}
	if (isOpenAIResponsesApi || compactionReplayEnabled) installStreamWrapper(wrapStreamFnWithCompactionReplayRepair, (checkpoint) => repairRejectedReplay("compaction", checkpoint));
	if (isOpenAIResponsesApi) installStreamWrapper(wrapStreamFnWithMessageTransform, sanitizeOpenAIResponsesReplayForStream);
	const innerStreamFn = session.agent.streamFn;
	session.agent.streamFn = (model, context, options) => {
		if (input.lifecycle.readYieldState().yieldDetected && abortSignal.aborted && isSessionsYieldAbortReason(abortSignal.reason)) return createYieldAbortedResponse(model);
		return innerStreamFn(model, context, options);
	};
	installStreamWrapper(wrapStreamFnSanitizeMalformedToolCalls, replayAllowedToolNames, transcriptPolicy, attempt.provider);
	installStreamWrapper(wrapStreamFnPromoteStandaloneTextToolCalls, liveAllowedToolNames);
	installStreamWrapper(wrapStreamFnTrimToolCallNames, liveAllowedToolNames, { unknownToolThreshold: 10 });
	if (shouldRepairMalformedToolCallArguments({
		provider: attempt.provider,
		modelApi: attempt.model.api
	})) installStreamWrapper(wrapStreamFnRepairMalformedToolCallArguments);
	if (resolveToolCallArgumentsEncoding(attempt.model) === "html-entities") installStreamWrapper(createHtmlEntityToolCallArgumentDecodingWrapper);
	if (providerTextTransforms?.output?.length) session.agent.streamFn = wrapStreamFnTextTransforms({
		streamFn: session.agent.streamFn,
		output: providerTextTransforms.output
	});
	if (anthropicPayloadLogger) session.agent.streamFn = anthropicPayloadLogger.wrapStreamFn(session.agent.streamFn);
	installStreamWrapper(wrapStreamFnHandleSensitiveStopReason);
	const configuredRunTimeoutMs = resolveAgentTimeoutMs({ cfg: attempt.config });
	const resolvedRunTimeoutMs = attempt.runTimeoutOverrideMs ?? (attempt.timeoutMs !== configuredRunTimeoutMs ? attempt.timeoutMs : void 0);
	const timeoutOptions = {
		cfg: attempt.config,
		runTimeoutMs: resolvedRunTimeoutMs,
		modelRequestTimeoutMs: attempt.model.requestTimeoutMs,
		model: {
			baseUrl: attempt.model.baseUrl,
			id: attempt.modelId,
			provider: attempt.provider
		}
	};
	const idleTimeoutMs = resolveLlmIdleTimeoutMs({
		...timeoutOptions,
		trigger: attempt.trigger
	});
	const firstEventTimeoutMs = resolveLlmFirstEventTimeoutMs(timeoutOptions);
	if (idleTimeoutMs > 0 || firstEventTimeoutMs > 0) installStreamWrapper(streamWithIdleTimeout, idleTimeoutMs > 0 ? idleTimeoutMs : firstEventTimeoutMs, (error) => callbacks.onIdleTimeout(error), idleTimeoutMs > 0 ? { runId: attempt.runId } : {
		runId: attempt.runId,
		scope: "creation-only"
	});
	if (firstEventTimeoutMs > 0) {
		const baseStreamFn = session.agent.streamFn;
		session.agent.streamFn = (model, context, options) => {
			const optionsWithFirstEvent = options;
			return baseStreamFn(model, context, {
				...options,
				firstEventTimeoutMs: optionsWithFirstEvent?.firstEventTimeoutMs ?? firstEventTimeoutMs,
				onFirstEventTimeout: optionsWithFirstEvent?.onFirstEventTimeout ?? callbacks.onIdleTimeout
			});
		};
	}
	const modelCallSequence = attempt.modelCallSequence ??= { value: 0 };
	const firstModelCallNumber = modelCallSequence.value + 1;
	let modelResponseTerminal = false;
	let activeModelCallId;
	installStreamWrapper(wrapStreamFnWithDiagnosticModelCallEvents, {
		config: attempt.config,
		runId: attempt.runId,
		agentId: sessionAgentId,
		...attempt.sessionKey && { sessionKey: attempt.sessionKey },
		...attempt.sessionId && { sessionId: attempt.sessionId },
		provider: attempt.provider,
		model: attempt.modelId,
		api: attempt.model.api,
		transport: effectiveAgentTransport,
		requestTimeoutMs: idleTimeoutMs || Math.min(attempt.timeoutMs, 18e5),
		...attempt.contextWindowInfo?.tokens ? { contextTokenBudget: attempt.contextWindowInfo.tokens } : {},
		...attempt.contextWindowInfo?.source ? { contextWindowSource: attempt.contextWindowInfo.source } : {},
		...attempt.contextWindowInfo?.referenceTokens ? { contextWindowReferenceTokens: attempt.contextWindowInfo.referenceTokens } : {},
		trace: input.diagnostics.runTrace,
		contentCapture: resolveDiagnosticModelContentCapturePolicy(attempt.config),
		nextCallId: () => `${attempt.runId}:model:${modelCallSequence.value += 1}`,
		ownerGeneration: callbacks.diagnosticOwner.generation,
		onSucceeded: contextGuards.recordCacheTouch,
		onTerminal: () => {
			modelResponseTerminal = true;
		},
		onFinished: (callId) => {
			if (activeModelCallId === callId) activeModelCallId = void 0;
		},
		onStarted: (callId) => {
			activeModelCallId = callId;
			modelResponseTerminal = false;
			if (modelCallSequence.value === firstModelCallNumber) {
				input.setup.prepStages.mark("model-dispatch");
				input.setup.emitPrepStageSummary("model-dispatch");
			}
			attempt.onExecutionPhase?.({
				phase: "model_call_started",
				provider: attempt.provider,
				model: attempt.modelId,
				firstModelCallStarted: true
			});
		},
		suppressPluginHooks: attempt.operation === "settled-tool-finalization"
	});
	return {
		/** Returns the measured predecessor that may anchor this exact request's pressure. */
		onModelRequest: (...args) => {
			const previous = cacheObserver.getContextUsage();
			const request = cacheObserver.onModelRequest(...args);
			const previousRequest = previous?.requestIndex === request.requestIndex - 1 && request.prefixUnchanged && (request.changes ?? []).every(({ code }) => code === "pruning" || code === "aggregateToolResultTruncation") ? previous : void 0;
			if (input.activeContextEngine?.info.ownsCompaction || request.requestIndex > 1) contextGuards.checkMidTurnPrecheck({
				context: args[1],
				previousRequest
			});
			return previousRequest;
		},
		onModelUsage: (usage, identity) => {
			if (modelResponseTerminal) {
				modelResponseTerminal = false;
				cacheObserver.onModelUsage(usage, providerPromptState.lastAttempt, identity);
			}
		},
		getPromptCacheObservation: cacheObserver.getObservation,
		isModelCallActive: () => activeModelCallId !== void 0
	};
}
//#endregion
//#region src/agents/embedded-agent-runner/run/attempt-timeout-prepare.ts
/** Owns the execution deadline, approval pauses, and one compaction grace. */
function prepareEmbeddedAttemptTimeout(input) {
	const { activeSession, attempt, runAbortSignal } = input;
	let deadline = { kind: "unlimited" };
	let abortTimer;
	let abortWarnTimer;
	const approvalWait = observeAgentRunApprovalWait(attempt);
	const clearTimers = () => {
		deadline = { kind: "closed" };
		approvalWait.dispose();
		runAbortSignal.removeEventListener("abort", clearTimers);
		clearTimeout(abortTimer);
		clearTimeout(abortWarnTimer);
	};
	const timeout = {
		getRunAbortDeadlineAtMs: () => deadline.kind === "bounded" ? deadline.deadlineAtMs : void 0,
		clearTimers
	};
	if (runAbortSignal.aborted) {
		clearTimers();
		return timeout;
	}
	runAbortSignal.addEventListener("abort", clearTimers, { once: true });
	const scheduleAbortTimer = (delayMs, compactionGraceUsed) => {
		const armed = {
			kind: "bounded",
			deadlineAtMs: Date.now() + Math.max(1, delayMs),
			compactionGraceUsed
		};
		deadline = armed;
		abortTimer = setTimeout(() => {
			if (deadline !== armed) return;
			const compaction = {
				isCompactionPendingOrRetrying: input.compactionState.isCompacting(),
				isCompactionInFlight: activeSession.isCompacting
			};
			if (resolveRunTimeoutDuringCompaction({
				...compaction,
				graceAlreadyUsed: armed.compactionGraceUsed
			}) === "extend") {
				if (!input.isProbeSession) log$7.warn(`embedded run timeout reached during compaction; extending deadline: runId=${attempt.runId} sessionId=${attempt.sessionId} extraMs=${input.compactionTimeoutMs}`);
				scheduleAbortTimer(input.compactionTimeoutMs, true);
				return;
			}
			clearTimers();
			abortWarnTimer = setTimeout(() => {
				if (activeSession.isStreaming && !input.isProbeSession) log$7.warn(`embedded run abort still streaming: runId=${attempt.runId} sessionId=${attempt.sessionId}`);
			}, 1e4);
			if (!input.isProbeSession) log$7.warn(armed.compactionGraceUsed ? `embedded run timeout after compaction grace: runId=${attempt.runId} sessionId=${attempt.sessionId} timeoutMs=${attempt.timeoutMs} compactionGraceMs=${input.compactionTimeoutMs}` : `embedded run timeout: runId=${attempt.runId} sessionId=${attempt.sessionId} timeoutMs=${attempt.timeoutMs}`);
			if (shouldFlagCompactionTimeout({
				isTimeout: true,
				...compaction
			})) input.markTimedOutDuringCompaction();
			input.markTimedOutByRunBudget();
			input.abortRun(true);
		}, Math.max(1, delayMs));
		attempt.onAttemptDeadlineChanged?.({
			kind: "bounded",
			deadlineAtMs: armed.deadlineAtMs
		});
	};
	approvalWait.onChange = (pending) => {
		if (pending && deadline.kind === "bounded") {
			deadline = {
				kind: "paused",
				remainingMs: Math.max(1, deadline.deadlineAtMs - Date.now()),
				compactionGraceUsed: deadline.compactionGraceUsed
			};
			clearTimeout(abortTimer);
			attempt.onAttemptDeadlineChanged?.({ kind: "unlimited" });
		} else if (!pending && deadline.kind === "paused") scheduleAbortTimer(deadline.remainingMs, deadline.compactionGraceUsed);
	};
	if (attempt.timeoutMs >= 2147e6) attempt.onAttemptDeadlineChanged?.({ kind: "unlimited" });
	else scheduleAbortTimer(attempt.timeoutMs, false);
	if (!runAbortSignal.aborted) attempt.onAttemptTimeoutArmed?.();
	return timeout;
}
//#endregion
//#region src/agents/embedded-agent-runner/run/attempt-execution-phase.ts
async function runEmbeddedAttemptExecutionPhase(input) {
	const { attempt, state } = input;
	const { sessionRuntime, systemPrompt, toolBase } = input.prepared;
	const { agentSession: { activeSession, replaySafeTools }, settleTracker: { abortActiveSession, trackPromptSettlePromise } } = sessionRuntime;
	const assertActive = resolveAdmittedRunActiveAssertion(attempt.admittedRunContext, input.runAbortController.signal);
	if (!assertActive) {
		input.runAbortController.signal.throwIfAborted();
		throw new Error("embedded attempt requires an active admitted run");
	}
	activeSession[agentSessionSetContextReplacementHook]((tokensAfter) => {
		declarePromptHistoryRewrite({
			...attempt,
			reason: "compaction"
		});
		toolBase.skillInstructionDeliveryCache.clear();
		attempt.onContextAccountingEvent?.({
			kind: "compaction",
			tokensAfter
		});
	}, assertActive);
	let repairedRejectedProviderReplay = false;
	const diagnosticOwner = createDiagnosticEmbeddedRunOwner({
		sessionId: attempt.sessionId,
		sessionKey: attempt.sessionKey,
		runId: attempt.runId
	});
	const mergeTerminal = (incoming) => {
		state.terminal = mergeAgentRunAttemptTerminal(state.terminal, incoming);
	};
	const idleTimeoutTriggerRef = {};
	const { onModelRequest, onModelUsage, getPromptCacheObservation, isModelCallActive } = installEmbeddedAttemptStreamGuards(input, {
		onRejectedProviderReplayRepaired: () => {
			repairedRejectedProviderReplay = true;
		},
		onIdleTimeout: (error) => idleTimeoutTriggerRef.current?.(error),
		diagnosticOwner
	});
	input.setup.prepStages.mark("stream-setup");
	input.setup.emitPrepStageSummary("stream-ready");
	let preparedHistory;
	try {
		preparedHistory = await prepareEmbeddedAttemptHistory(input, assertActive);
	} catch (error) {
		await cleanupEmbeddedAttemptResources({
			flushPendingToolResultsAfterIdle,
			session: activeSession,
			sessionManager: sessionRuntime.sessionManager,
			aborted: attempt.abortSignal?.aborted,
			abortSignal: attempt.abortSignal
		});
		throw error;
	}
	const isProbeSession = attempt.sessionId?.startsWith("probe-") ?? false;
	const queueHandleRef = {};
	const abortRun = createEmbeddedAttemptRunAbort({
		abortActiveSession,
		activeSession,
		attempt,
		getQueueHandle: () => queueHandleRef.current,
		isProbeSession,
		log: log$7,
		runAbortController: input.runAbortController,
		state: input.state
	});
	input.externalAbortController.setRunAbort(abortRun);
	const interruptIdleRequest = createEmbeddedAttemptIdleInterruption({
		runAbortController: input.runAbortController,
		activeSession,
		state,
		abortRun
	});
	idleTimeoutTriggerRef.current = interruptIdleRequest;
	const abortable$1 = (promise) => abortable(input.runAbortController.signal, promise);
	const promptActiveSession = (prompt, options) => withOwnedSessionTranscriptWrites(input.sessionLock.ownedTranscriptWriteContext, async () => {
		if (input.runAbortController.signal.aborted) return abortable$1(Promise.resolve());
		const runPrompt = () => activeSession.prompt(prompt, options);
		return abortable$1(trackPromptSettlePromise(input.sessionLock.assertCronRootCurrent ? withGuardedFetchRequestAuthority(input.sessionLock.assertCronRootCurrent, runPrompt) : runPrompt()));
	});
	const bindTranscriptCallback = (callback) => callback ? bindOwnedSessionTranscriptWrites(input.sessionLock.ownedTranscriptWriteContext, callback) : void 0;
	const onBlockReply = bindTranscriptCallback(attempt.onBlockReply);
	const onBlockReplyFlush = bindTranscriptCallback(attempt.onBlockReplyFlush);
	const preparedStream = prepareEmbeddedAttemptStream({
		attempt,
		agentSession: sessionRuntime.agentSession,
		onModelUsage,
		applyPermissionMode: input.lifecycle.applyPermissionMode,
		runAbortController: input.runAbortController,
		abortRun,
		markExternalAbort: () => mergeTerminal({
			kind: "aborted",
			source: "external"
		}),
		recoverStalledModelCall: () => isModelCallActive() && interruptIdleRequest(Object.assign(/* @__PURE__ */ new Error("LLM idle timeout (diagnostic stuck recovery): no response from model"), { code: "OPENCLAW_SESSION_WATCHDOG" })),
		getRunState: () => {
			const terminal = projectAgentRunAttemptTerminal(state.terminal);
			return {
				aborted: terminal.aborted,
				promptError: terminal.promptError,
				timedOut: terminal.timedOut,
				yieldDetected: input.lifecycle.readYieldState().yieldDetected
			};
		},
		onBlockReply,
		onBlockReplyFlush,
		runtimeChannel: systemPrompt.runtimeChannel,
		hookAgentId: input.setup.sessionAgentId,
		diagnosticTrace: input.diagnostics.diagnosticTrace,
		nestedToolActivityState: toolBase.nestedToolActivityState,
		isReplaySafeTool: (tool) => replaySafeTools.has(tool),
		diagnosticOwner,
		trajectoryRecorder: sessionRuntime.trajectoryRecorder
	});
	state.deferredLifecycleOwner = preparedStream.deferredLifecycleOwner;
	input.lifecycle.setToolSearchCatalogExecutor(preparedStream.toolSearchCatalogExecutor);
	input.externalAbortController.setCompactionState({
		isPendingOrRetrying: preparedStream.subscription.isCompacting,
		isInFlight: () => activeSession.isCompacting
	});
	queueHandleRef.current = preparedStream.queueHandle;
	const attemptTimeout = prepareEmbeddedAttemptTimeout({
		attempt,
		activeSession,
		runAbortSignal: input.runAbortController.signal,
		compactionState: preparedStream.subscription,
		compactionTimeoutMs: input.sessionLock.compactionTimeoutMs,
		isProbeSession,
		abortRun,
		markTimedOutDuringCompaction: () => mergeTerminal({
			kind: "timeout",
			phase: "compaction",
			source: "observation"
		}),
		markTimedOutByRunBudget: () => mergeTerminal({
			kind: "timeout",
			phase: "prompt",
			source: "run_budget"
		})
	});
	const preparedStreamRuntime = {
		abortable: abortable$1,
		cache: {
			onModelRequest,
			getObservation: getPromptCacheObservation
		},
		history: preparedHistory,
		isProbeSession,
		onBlockReplyFlush,
		promptActiveSession,
		stream: preparedStream,
		timeout: attemptTimeout
	};
	return await runEmbeddedAttemptSettledPhase({
		...input,
		preparedStreamRuntime,
		getRepairedRejectedProviderReplay: () => repairedRejectedProviderReplay
	});
}
//#endregion
//#region src/agents/embedded-agent-runner/run/attempt-preparation.ts
let nextPreparationStart = Promise.resolve();
const MAX_PREPARATION_STARTS_PER_SLICE = 16;
const PREPARATION_SLICE_MS = 8;
let preparationStarts = MAX_PREPARATION_STARTS_PER_SLICE;
let preparationSyncMs = 0;
/** Dispatches attempt stages without letting concurrent starts monopolize the event loop. */
function createEmbeddedAttemptPreparation(options) {
	return async (stage, run) => {
		nextPreparationStart = nextPreparationStart.then(async () => {
			if (preparationStarts >= MAX_PREPARATION_STARTS_PER_SLICE || preparationSyncMs >= PREPARATION_SLICE_MS) {
				await setImmediate();
				preparationStarts = 0;
				preparationSyncMs = 0;
			}
			preparationStarts++;
		});
		await nextPreparationStart;
		const startedAt = performance.now();
		try {
			options.assertCurrent();
			return measureEmbeddedAgentPreparation(stage, run, { config: options.config });
		} finally {
			preparationSyncMs += performance.now() - startedAt;
		}
	};
}
//#endregion
//#region src/agents/queued-file-writer.ts
/** Per-path ordered append writer for diagnostic logs. */
const log$5 = createSubsystemLogger("agents/diagnostic-writer");
/** Returns the cached writer for a path or creates a new ordered append queue. */
function getQueuedFileWriter(writers, filePath) {
	const existing = writers.get(filePath);
	if (existing) return existing;
	const dir = path.dirname(filePath);
	let reportedFailure = false;
	const reportFailure = (error) => {
		if (!reportedFailure) {
			reportedFailure = true;
			log$5.warn("Diagnostic log write failed; check the configured log path", {
				filePath,
				error
			});
		}
	};
	let queue = fs$1.mkdir(dir, {
		recursive: true,
		mode: 448
	}).catch(reportFailure);
	const writer = {
		filePath,
		write: (line) => {
			queue = queue.then(() => appendRegularFile({
				filePath,
				content: line,
				rejectSymlinkParents: true
			})).catch(reportFailure);
			return "queued";
		},
		flush: async () => {
			await queue;
		}
	};
	writers.set(filePath, writer);
	return writer;
}
//#endregion
//#region src/agents/trace-base.ts
/** Build a trace base object while preserving undefined optional fields. */
function buildAgentTraceBase(params) {
	return {
		runId: params.runId,
		sessionId: params.sessionId,
		sessionKey: params.sessionKey,
		provider: params.provider,
		modelId: params.modelId,
		modelApi: params.modelApi,
		workspaceDir: params.workspaceDir
	};
}
//#endregion
//#region src/agents/anthropic-payload-log.ts
/**
* Optional Anthropic request/usage JSONL diagnostics.
* Redacts payload content before writing and stores digests for correlation
* without persisting raw secret-bearing request bodies.
*/
const writers$1 = /* @__PURE__ */ new Map();
const log$4 = createSubsystemLogger("agent/anthropic-payload");
function formatError(error) {
	const message = error instanceof Error ? error.message : typeof error === "string" ? error : void 0;
	if (message !== void 0) {
		const redacted = redactAgentDiagnosticPayload(message);
		return typeof redacted === "string" ? redacted : message;
	}
	if (typeof error === "number" || typeof error === "boolean" || typeof error === "bigint") return String(error);
	if (error && typeof error === "object") return safeJsonStringify(redactAgentDiagnosticPayload(error)) ?? "unknown error";
}
function digest$1(value) {
	const serialized = safeJsonStringify(value);
	if (!serialized) return;
	return crypto$1.createHash("sha256").update(serialized).digest("hex");
}
function findLastAssistantUsage(messages) {
	for (let i = messages.length - 1; i >= 0; i -= 1) {
		const msg = messages[i];
		if (msg?.role === "assistant" && msg.usage && typeof msg.usage === "object") return msg.usage;
	}
	return null;
}
function createAnthropicPayloadLogger(params) {
	const env = params.env ?? process.env;
	const enabled = parseBooleanValue(env.OPENCLAW_ANTHROPIC_PAYLOAD_LOG) ?? false;
	const fileOverride = env.OPENCLAW_ANTHROPIC_PAYLOAD_LOG_FILE?.trim();
	const filePath = fileOverride ? resolveUserPath(fileOverride) : path.join(resolveStateDir(env), "logs", "anthropic-payload.jsonl");
	if (!enabled || isIncognitoSessionKey(params.sessionKey)) return null;
	const writer = params.writer ?? getQueuedFileWriter(writers$1, filePath);
	const base = buildAgentTraceBase(params);
	const record = (event) => {
		const line = safeJsonStringify(event);
		if (!line) return;
		writer.write(`${line}\n`);
	};
	const wrapStreamFn = (streamFn) => (model, context, options) => {
		if (model?.api !== "anthropic-messages") return streamFn(model, context, options);
		const nextOnPayload = (payload) => {
			const redactedPayload = redactAgentDiagnosticPayload(payload);
			record({
				...base,
				ts: (/* @__PURE__ */ new Date()).toISOString(),
				stage: "request",
				payload: redactedPayload,
				payloadDigest: digest$1(redactedPayload)
			});
			return options?.onPayload?.(payload, model);
		};
		return streamFn(model, context, {
			...options,
			onPayload: nextOnPayload
		});
	};
	const recordUsage = (messages, error) => {
		const usage = findLastAssistantUsage(messages);
		const errorMessage = formatError(error);
		if (!usage && !errorMessage) return;
		record({
			...base,
			ts: (/* @__PURE__ */ new Date()).toISOString(),
			stage: "usage",
			...usage ? { usage: redactAgentDiagnosticPayload(usage) } : {},
			error: errorMessage
		});
		if (usage) log$4.info("anthropic usage", {
			runId: params.runId,
			sessionId: params.sessionId,
			usage
		});
	};
	log$4.info("anthropic payload logger enabled", { filePath: writer.filePath });
	return {
		wrapStreamFn,
		recordUsage
	};
}
//#endregion
//#region src/agents/cache-trace.ts
const writers = /* @__PURE__ */ new Map();
function digest(value) {
	const serialized = stableStringify(value, sanitizeSurrogates);
	return crypto$1.createHash("sha256").update(serialized).digest("hex");
}
function summarizeMessages(messages) {
	const messageFingerprints = messages.map(digest);
	return {
		messageCount: messages.length,
		messageRoles: messages.map((msg) => msg.role),
		messageFingerprints,
		messagesDigest: digest(messageFingerprints.join("|"))
	};
}
function createCacheTrace(params) {
	const env = params.env ?? process.env;
	const enabled = parseBooleanValue(env.OPENCLAW_CACHE_TRACE) ?? params.cfg?.diagnostics?.cacheTrace?.enabled ?? false;
	const fileOverride = env.OPENCLAW_CACHE_TRACE_FILE?.trim();
	const filePath = fileOverride ? resolveUserPath(fileOverride) : path.join(resolveStateDir(env), "logs", "cache-trace.jsonl");
	const includeMessages = parseBooleanValue(env.OPENCLAW_CACHE_TRACE_MESSAGES) ?? true;
	const includePrompt = parseBooleanValue(env.OPENCLAW_CACHE_TRACE_PROMPT) ?? true;
	const includeSystem = parseBooleanValue(env.OPENCLAW_CACHE_TRACE_SYSTEM) ?? true;
	if (!enabled || isIncognitoSessionKey(params.sessionKey)) return null;
	const writer = params.writer ?? getQueuedFileWriter(writers, filePath);
	let seq = 0;
	const base = buildAgentTraceBase(params);
	const recordStage = (stage, payload = {}) => {
		const event = {
			...base,
			ts: (/* @__PURE__ */ new Date()).toISOString(),
			seq: seq += 1,
			stage
		};
		if (payload.prompt !== void 0 && includePrompt) event.prompt = redactAgentDiagnosticPayload(payload.prompt);
		if (payload.system !== void 0 && includeSystem) {
			event.system = redactAgentDiagnosticPayload(payload.system);
			event.systemDigest = digest(payload.system);
		}
		if (payload.options) event.options = redactAgentDiagnosticPayload(payload.options);
		if (payload.model) event.model = redactAgentDiagnosticPayload(payload.model);
		const messages = payload.messages;
		if (Array.isArray(messages)) {
			Object.assign(event, summarizeMessages(messages));
			if (includeMessages) event.messages = redactAgentDiagnosticPayload(messages);
		}
		if (payload.note) event.note = redactAgentDiagnosticPayload(payload.note);
		if (payload.error) event.error = redactAgentDiagnosticPayload(payload.error);
		const line = safeJsonStringify(event);
		if (!line) return;
		writer.write(`${line}\n`);
	};
	const wrapStreamFn = (streamFn) => (model, context, options) => {
		const traceContext = context;
		recordStage("stream:context", {
			model: {
				id: model?.id,
				provider: model?.provider,
				api: model?.api
			},
			system: traceContext.systemPrompt ?? traceContext.system,
			messages: traceContext.messages ?? [],
			options: options ?? {}
		});
		return streamFn(model, context, options);
	};
	return {
		filePath,
		recordStage,
		wrapStreamFn
	};
}
//#endregion
//#region src/agents/agent-hooks/compaction-safeguard-runtime.ts
const registry = createSessionManagerRuntimeRegistry();
const setCompactionSafeguardRuntime = registry.set;
const getCompactionSafeguardRuntime = registry.get;
/** Records cancellation atomically; intentional declines carry no provider error. */
function setCompactionSafeguardCancellation(sessionManager, reason, error) {
	const current = getCompactionSafeguardRuntime(sessionManager);
	const trimmed = reason?.trim();
	if (!current && !trimmed) return;
	const next = { ...current };
	if (trimmed) next.cancellation = {
		reason: trimmed,
		...error !== void 0 ? { error } : {}
	};
	else delete next.cancellation;
	setCompactionSafeguardRuntime(sessionManager, Object.keys(next).length > 0 ? next : null);
}
/** Consumes this attempt's cancellation without clearing session configuration. */
function consumeCompactionSafeguardCancellation(sessionManager) {
	const cancellation = getCompactionSafeguardRuntime(sessionManager)?.cancellation;
	if (cancellation) setCompactionSafeguardCancellation(sessionManager, void 0);
	return cancellation ?? null;
}
//#endregion
//#region src/plugins/compaction-provider.ts
function getCompactionProvider(id) {
	const registry = requireActivePluginRegistry();
	const registration = registry.compactionProviders.find((entry) => entry.provider.id === id);
	if (!registration) return;
	const record = registry.plugins.find((entry) => entry.id === registration.ownerPluginId);
	return (record && getPluginInstance(record))?.wrap(registration.provider) ?? registration.provider;
}
//#endregion
//#region src/agents/compaction-real-conversation.ts
/**
* Classifies transcript messages that contain real user-visible conversation
* for compaction and history pruning.
*/
const TOOL_RESULT_REAL_CONVERSATION_LOOKBACK = 20;
const NON_CONVERSATION_BLOCK_TYPES = /* @__PURE__ */ new Set(["thinking", "reasoning"]);
const CONVERSATION_ANCHOR_ROLES = /* @__PURE__ */ new Set([
	"user",
	"custom",
	"bashExecution",
	"branchSummary",
	"compactionSummary"
]);
function hasMeaningfulText(text) {
	const trimmed = text.trim();
	if (!trimmed || isSilentReplyText(trimmed)) return false;
	const heartbeat = stripHeartbeatToken(trimmed, { mode: "message" });
	return !heartbeat.didStrip || heartbeat.text.trim().length > 0;
}
/** Returns whether a message has content worth preserving as conversation. */
function hasMeaningfulConversationContent(message) {
	if ("excludeFromContext" in message && message.excludeFromContext === true) return false;
	if (message.role === "custom") {
		const custom = message;
		return custom.display !== false && hasMeaningfulMessageContent(custom.content);
	}
	if (message.role === "bashExecution") return hasMeaningfulText(`${typeof message.command === "string" ? message.command : ""}\n${typeof message.output === "string" ? message.output : ""}`);
	if (message.role === "branchSummary" || message.role === "compactionSummary") {
		const summary = message.summary;
		return typeof summary === "string" && hasMeaningfulText(summary);
	}
	const content = message.content;
	return hasMeaningfulMessageContent(content);
}
function hasMeaningfulMessageContent(content) {
	if (typeof content === "string") return hasMeaningfulText(content);
	if (!Array.isArray(content)) return false;
	let sawMeaningfulNonTextBlock = false;
	for (const block of content) {
		if (!block || typeof block !== "object") continue;
		const { type, text } = block;
		if (type === "text") {
			if (typeof text === "string" && hasMeaningfulText(text)) return true;
		} else if (!isToolCallBlockType(type) && !NON_CONVERSATION_BLOCK_TYPES.has(String(type))) sawMeaningfulNonTextBlock = true;
	}
	return sawMeaningfulNonTextBlock;
}
function isToolResultConversationAnchor(message) {
	return CONVERSATION_ANCHOR_ROLES.has(message.role) && hasMeaningfulConversationContent(message);
}
/** Returns whether a transcript message should count as real conversation. */
function isRealConversationMessage(message, messages, index) {
	if (message.role === "assistant" || CONVERSATION_ANCHOR_ROLES.has(message.role)) return hasMeaningfulConversationContent(message);
	if (message.role !== "toolResult") return false;
	const start = Math.max(0, index - TOOL_RESULT_REAL_CONVERSATION_LOOKBACK);
	for (let i = index - 1; i >= start; i -= 1) {
		const candidate = messages[i];
		if (candidate && isToolResultConversationAnchor(candidate)) return true;
	}
	return false;
}
/** Classifies an ordered transcript without retaining earlier pages. */
function createRealConversationClassifier() {
	let anchorLookback = 0;
	return (message) => {
		const real = message.role === "toolResult" ? anchorLookback > 0 : isRealConversationMessage(message, [], 0);
		anchorLookback = isToolResultConversationAnchor(message) ? TOOL_RESULT_REAL_CONVERSATION_LOOKBACK : Math.max(0, anchorLookback - 1);
		return real;
	};
}
//#endregion
//#region src/agents/compaction.ts
const log$3 = createSubsystemLogger("compaction");
const DEFAULT_SUMMARY_FALLBACK = "No prior history.";
const IDENTIFIER_PRESERVATION_INSTRUCTIONS = "Preserve all opaque identifiers exactly as written (no shortening or reconstruction), including UUIDs, hashes, IDs, hostnames, IPs, ports, URLs, and file names.";
function buildCompactionSummarizationInstructions(customInstructions, instructions) {
	const custom = customInstructions?.trim();
	return [instructions?.identifierPolicy === "off" ? void 0 : instructions?.identifierPolicy === "custom" ? instructions.identifierInstructions?.trim() || IDENTIFIER_PRESERVATION_INSTRUCTIONS : IDENTIFIER_PRESERVATION_INSTRUCTIONS, custom && `Additional focus:\n${custom}`].filter(Boolean).join("\n\n") || void 0;
}
/**
* Summarizes compaction history in one model request. The request serializer
* bounds its input (see serializeConversationWithinBudget), so latency and cost
* do not grow with the session or the context window.
*/
async function summarizeCompactionHistory(params) {
	const messages = sanitizeCompactionMessages(params.messages);
	if (messages.length === 0) return params.previousSummary ?? DEFAULT_SUMMARY_FALLBACK;
	const instructions = buildCompactionSummarizationInstructions(params.customInstructions, params.summarizationInstructions);
	try {
		return await retryAsync(() => generateSummary(messages, params.model, params.reserveTokens, params.apiKey, params.headers, params.signal, instructions, params.previousSummary, params.thinkingLevel, params.streamFn, params.usageSink, params.summaryPrompt), {
			attempts: 3,
			minDelayMs: 500,
			maxDelayMs: 5e3,
			jitter: .2,
			label: "compaction/generateSummary",
			sleep: (ms) => sleepWithAbort$1(ms, params.signal),
			shouldRetry: (err) => !params.signal.aborted && !(err instanceof SummaryOutputBudgetError) && (isAbortError(err) || !isTimeoutError(err))
		});
	} catch (err) {
		if (params.signal.aborted) throw err;
		log$3.warn(`Summarization failed: ${formatErrorMessage(err)}`);
		throw new CompactionError("summarization_failed", `Summarization failed for ${messages.length} messages: ${formatErrorMessage(err)}`, err instanceof Error ? err : void 0);
	}
}
//#endregion
//#region src/agents/agent-hooks/compaction-preserved-turns.ts
function splitPreservedRecentTurns(params) {
	const preserveTurns = params.recentTurnsPreserve;
	if (preserveTurns <= 0) return {
		summarizableMessages: params.messages,
		preservedMessages: []
	};
	const conversationIndexes = params.messages.flatMap((message, index) => message.role === "user" || message.role === "assistant" ? [index] : []);
	if (conversationIndexes.length === 0) return {
		summarizableMessages: params.messages,
		preservedMessages: []
	};
	const userIndexes = conversationIndexes.filter((index) => params.messages[index]?.role === "user");
	const boundaryStartIndex = userIndexes.at(-preserveTurns);
	const preservedIndexSet = new Set(boundaryStartIndex === void 0 ? userIndexes : conversationIndexes.filter((index) => index >= boundaryStartIndex));
	if (boundaryStartIndex === void 0) for (const index of conversationIndexes.toReversed()) {
		preservedIndexSet.add(index);
		if (preservedIndexSet.size >= preserveTurns * 2) break;
	}
	const preservedToolCallIds = /* @__PURE__ */ new Set();
	for (const index of preservedIndexSet) {
		const message = params.messages[index];
		if (message?.role === "assistant") for (const toolCall of extractToolCallsFromAssistant(message)) preservedToolCallIds.add(toolCall.id);
	}
	if (preservedToolCallIds.size > 0) {
		const preservedStartIndex = conversationIndexes.find((index) => preservedIndexSet.has(index));
		for (let index = preservedStartIndex; index < params.messages.length; index += 1) {
			const message = params.messages[index];
			if (message?.role !== "toolResult") continue;
			const toolResultId = extractToolResultId(message);
			if (toolResultId && preservedToolCallIds.has(toolResultId)) preservedIndexSet.add(index);
		}
	}
	const summarizableMessages = [];
	const preservedMessages = [];
	for (const [index, message] of params.messages.entries()) (preservedIndexSet.has(index) ? preservedMessages : summarizableMessages).push(message);
	return {
		summarizableMessages: sanitizeToolUseResultPairing(summarizableMessages),
		preservedMessages
	};
}
//#endregion
//#region src/agents/agent-hooks/compaction-safeguard-quality.ts
/** Quality contract, fallback, and audit helpers for compaction safeguard summaries. */
const MAX_EXTRACTED_IDENTIFIERS = 12;
const MAX_UNTRUSTED_INSTRUCTION_CHARS = 4e3;
const MAX_MISSING_IDENTIFIER_REASON_CHARS = 3400;
const MAX_ASK_OVERLAP_TOKENS = 12;
const MIN_ASK_OVERLAP_TOKENS_FOR_DOUBLE_MATCH = 3;
const REQUIRED_SUMMARY_SECTIONS = [
	"## Decisions",
	"## Open TODOs",
	"## Constraints/Rules",
	"## Pending user asks",
	"## Exact identifiers"
];
const QUALITY_PROTECTED_SECTION_START = 3;
const PENDING_ASK_SECTION_INDEX = 3;
const EXACT_IDENTIFIERS_SECTION_INDEX = 4;
const MAX_PROTECTED_SECTION_CONTENT_SHARE = .25;
const LATEST_USER_REQUEST_CONTEXT_LABEL = "Latest user request context:";
const STRICT_EXACT_IDENTIFIERS_INSTRUCTION = "For ## Exact identifiers, preserve literal values exactly as seen (IDs, URLs, file paths, ports, hashes, dates, times).";
const POLICY_OFF_EXACT_IDENTIFIERS_INSTRUCTION = "For ## Exact identifiers, include identifiers only when needed for continuity; do not enforce literal-preservation rules.";
function resolveSummaryReserveTokens(requestedReserveTokens, model) {
	const requested = Math.max(1, Math.floor(requestedReserveTokens));
	const modelMaxTokens = model.maxTokens;
	if (typeof modelMaxTokens !== "number" || !Number.isFinite(modelMaxTokens) || modelMaxTokens <= 0) return requested;
	return Math.max(1, Math.min(requested, Math.floor(modelMaxTokens)));
}
/** Demotes canonical headings when a summary is embedded as supporting context. */
function nestRequiredSummaryHeadings(text) {
	return text.replace(/^##[ \t]+\S.*$/gmu, (heading) => REQUIRED_SUMMARY_SECTIONS.some((required) => required === heading.trim()) ? heading.replace("##", "###") : heading);
}
/** Wraps operator-provided compaction instruction text as untrusted prompt data. */
function wrapUntrustedInstructionBlock(label, text) {
	return wrapUntrustedPromptDataBlock({
		label,
		text,
		maxChars: MAX_UNTRUSTED_INSTRUCTION_CHARS
	});
}
function resolveExactIdentifierSectionInstruction(summarizationInstructions) {
	const policy = summarizationInstructions?.identifierPolicy ?? "strict";
	if (policy === "off") return POLICY_OFF_EXACT_IDENTIFIERS_INSTRUCTION;
	const custom = policy === "custom" ? summarizationInstructions?.identifierInstructions?.trim() : void 0;
	if (custom) return wrapUntrustedInstructionBlock("For ## Exact identifiers, apply this operator-defined policy text", custom) || STRICT_EXACT_IDENTIFIERS_INSTRUCTION;
	return STRICT_EXACT_IDENTIFIERS_INSTRUCTION;
}
/** Build the required structured summary instructions for compaction. */
function buildCompactionStructureInstructions(customInstructions, summarizationInstructions, latestUnresolvedUserRequest) {
	const identifierSectionInstruction = resolveExactIdentifierSectionInstruction(summarizationInstructions);
	const sectionsTemplate = [
		"Produce a compact, factual summary with these exact section headings:",
		...REQUIRED_SUMMARY_SECTIONS,
		identifierSectionInstruction,
		"Do not omit unresolved asks from the user.",
		"Record completed requests outside ## Pending user asks; list only unresolved user requests there.",
		"Use tool results to update task status: a check that ran and returned a failing result is completed, not an open TODO. Record its result under ## Decisions and keep only the remaining remediation in ## Open TODOs (e.g. failing tests -> fix the failures, not run the same tests again).",
		"Treat prior summaries as drafts to update: reconcile them with all supplied messages, including preserved turns and split-turn progress, and remove stale duplicate detail.",
		"Apply explicit corrections and observed results in the main sections. Preserve unaffected facts; retain superseded values only as clearly labeled history, never as competing current decisions.",
		"A factual correction is not a pending task unless the user requested work that remains undone. Distinguish requested, attempted, completed, and failed actions without inferring overall success from a completed check.",
		"Before returning, check that all sections agree on current facts and status. Appending a correction in context is insufficient if the main summary still asserts the old state. If evidence does not resolve a conflict, record the uncertainty."
	].join("\n");
	const latestRequestBlock = latestUnresolvedUserRequest ? wrapUntrustedInstructionBlock("Latest unresolved user request", latestUnresolvedUserRequest) : "";
	const latestRequestInstruction = latestRequestBlock ? [
		"Make the exact request below the first item in ## Pending user asks.",
		"Its run owner will resume it after compaction, so summary prose cannot mark it complete.",
		latestRequestBlock
	].join("\n") : "";
	const custom = customInstructions?.trim();
	return [
		sectionsTemplate,
		latestRequestInstruction,
		custom && wrapUntrustedInstructionBlock("Additional context from /compact", custom)
	].filter(Boolean).join("\n\n");
}
function normalizedSummaryLines(summary) {
	return summary.split(/\r?\n/u).map((line) => line.trim()).filter((line) => line.length > 0);
}
function parseRequiredSummarySectionContents(summary) {
	const contents = REQUIRED_SUMMARY_SECTIONS.map(() => new Array());
	const preamble = [];
	let sectionIndex = -1;
	for (const line of summary.split(/\r?\n/u)) {
		const nextHeading = REQUIRED_SUMMARY_SECTIONS[sectionIndex + 1];
		if (nextHeading && line.trim() === nextHeading) {
			sectionIndex += 1;
			continue;
		}
		(sectionIndex < 0 ? preamble : contents[sectionIndex])?.push(line);
	}
	if (sectionIndex !== REQUIRED_SUMMARY_SECTIONS.length - 1) return null;
	contents[0]?.unshift(...preamble);
	return contents.map((lines) => lines.join("\n").trim());
}
function extractPendingAskSection(summary) {
	return summary.split(/^## Pending user asks[ \t]*$/mu, 2)[1]?.split(/^##[ \t]+\S.*$/mu, 1)[0]?.trim() ?? "";
}
function formatLatestUserRequestContext(request) {
	return `${LATEST_USER_REQUEST_CONTEXT_LABEL} ${JSON.stringify(request)}`;
}
function extractLeadingPendingAsk(summary) {
	return normalizedSummaryLines(extractPendingAskSection(summary))[0] ?? "";
}
function isEmptyPendingAsk(value) {
	return /^(?:none|none captured|no pending asks)[.!]?$/iu.test(value);
}
/**
* Plan truncation that keeps the audit facts and lets everything else shrink.
* Only the headings, the bounded latest-ask context, and the audited source
* identifiers are untrimmable. Model-written section text — including the
* "## Exact identifiers" list — is optional content; protecting it verbatim let
* a re-distilled identifier dump grow past the whole artifact budget while the
* real sections were starved to empty headings.
*/
function createSummaryQualityRetentionPlan(summary, truncatedMarker, params) {
	const requiredAskContext = params.requiredAskContext?.trim() ?? "";
	const latestUnresolvedUserRequest = params.latestUnresolvedUserRequest?.trim() ?? "";
	const bodyHasLatestAsk = hasAskOverlap(params.auditSummary ?? summary, params.latestAsk);
	const requiredContextBlock = !latestUnresolvedUserRequest && (bodyHasLatestAsk || params.latestAskInRetainedTurn) && requiredAskContext ? `## Latest user request context\n${JSON.stringify(requiredAskContext)}` : "";
	const parsedSummary = requiredContextBlock && summary.startsWith(`${requiredContextBlock}\n\n`) ? summary.slice(requiredContextBlock.length + 2) : summary;
	const contents = parseRequiredSummarySectionContents(parsedSummary);
	if (!contents) return null;
	const auditedIdentifiers = (params.identifierPolicy ?? "strict") === "strict" ? params.identifiers : [];
	const marker = truncatedMarker.trim();
	const pendingAsk = contents[PENDING_ASK_SECTION_INDEX] ?? "";
	const protectedAskContext = latestUnresolvedUserRequest ? formatLatestUserRequestContext(latestUnresolvedUserRequest) : !params.latestAskInRetainedTurn && requiredAskContext && (!bodyHasLatestAsk || hasAskOverlap(pendingAsk, params.latestAsk) && !pendingAsk.includes(requiredAskContext)) ? `${LATEST_USER_REQUEST_CONTEXT_LABEL}\n${JSON.stringify(requiredAskContext)}` : "";
	const protectedTails = REQUIRED_SUMMARY_SECTIONS.map(() => "");
	protectedTails[PENDING_ASK_SECTION_INDEX] = protectedAskContext;
	protectedTails[EXACT_IDENTIFIERS_SECTION_INDEX] = auditedIdentifiers.join("\n");
	const bodyHasIdentifiers = auditedIdentifiers.every((identifier) => summaryIncludesIdentifier(summary, identifier));
	const bodyHasRequiredAskContext = latestUnresolvedUserRequest ? extractLeadingPendingAsk(parsedSummary) === protectedAskContext : !requiredAskContext ? true : requiredContextBlock ? summary.startsWith(requiredContextBlock) : contents[PENDING_ASK_SECTION_INDEX]?.includes(protectedAskContext);
	const renderSections = (sectionContents) => REQUIRED_SUMMARY_SECTIONS.map((heading, index) => {
		const content = sectionContents[index];
		return content ? `${heading}\n${content}` : heading;
	});
	const joinSectionContent = (index, optional) => {
		const tail = protectedTails[index];
		if (!tail) return optional;
		if (index === EXACT_IDENTIFIERS_SECTION_INDEX) return [optional, ...auditedIdentifiers.filter((identifier) => !summaryIncludesIdentifier(optional, identifier))].filter(Boolean).join("\n");
		const leading = normalizedSummaryLines(optional)[0] ?? "";
		if (leading === tail) return optional;
		return latestUnresolvedUserRequest ? [tail, isEmptyPendingAsk(leading) ? "" : optional].filter(Boolean).join("\n") : [isEmptyPendingAsk(optional) ? "" : optional, tail].filter(Boolean).join("\n");
	};
	const joinBlocks = (blocks, includeMarker) => [
		...requiredContextBlock ? [requiredContextBlock] : [],
		...blocks.slice(0, QUALITY_PROTECTED_SECTION_START),
		...includeMarker ? [marker] : [],
		...blocks.slice(QUALITY_PROTECTED_SECTION_START)
	].join("\n\n");
	const minimumSummary = joinBlocks(REQUIRED_SUMMARY_SECTIONS.map((heading, index) => `${heading}\n\n${protectedTails[index] ?? ""}`), true);
	const protectedCapFor = (maxChars) => Math.floor(Math.max(0, maxChars - minimumSummary.length) * MAX_PROTECTED_SECTION_CONTENT_SHARE);
	const protectedWithinCap = (maxChars) => contents.slice(QUALITY_PROTECTED_SECTION_START).every((content) => content.length <= protectedCapFor(maxChars));
	return {
		minimumChars: minimumSummary.length,
		needsRebuild: (maxChars) => !latestUnresolvedUserRequest && !bodyHasLatestAsk || !bodyHasRequiredAskContext || !bodyHasIdentifiers || !protectedWithinCap(maxChars),
		render(maxChars) {
			if (summary.length <= maxChars && bodyHasRequiredAskContext && bodyHasIdentifiers && protectedWithinCap(maxChars)) return {
				text: summary,
				trimmed: false
			};
			if (maxChars < minimumSummary.length) return null;
			const contentBudget = maxChars - minimumSummary.length;
			const protectedCap = protectedCapFor(maxChars);
			const allocations = contents.map((content, index) => index >= QUALITY_PROTECTED_SECTION_START ? Math.min(content.length, protectedCap) : 0);
			const optionalBudget = Math.max(0, contentBudget - allocations.reduce((total, chars) => total + chars, 0));
			const optionalContents = contents.slice(0, QUALITY_PROTECTED_SECTION_START);
			const optionalTotal = optionalContents.reduce((total, content) => total + content.length, 0);
			for (const [index, content] of optionalContents.entries()) allocations[index] = optionalTotal > 0 ? Math.floor(optionalBudget * content.length / optionalTotal) : 0;
			let remainder = optionalBudget - allocations.slice(0, QUALITY_PROTECTED_SECTION_START).reduce((total, chars) => total + chars, 0);
			for (const [index, content] of optionalContents.entries()) {
				const allocation = allocations[index] ?? 0;
				const extra = Math.min(remainder, Math.max(0, content.length - allocation));
				allocations[index] = allocation + extra;
				remainder -= extra;
			}
			const trimmed = contents.some((content, index) => content.length > (allocations[index] ?? 0));
			const sectionContents = contents.map((content, index) => joinSectionContent(index, truncateUtf16Safe(content, allocations[index] ?? 0)));
			const blocks = renderSections(sectionContents);
			return {
				text: joinBlocks(blocks, trimmed),
				trimmed
			};
		}
	};
}
/** Return a structured fallback summary when model output is missing/invalid. */
function buildStructuredFallbackSummary(previousSummary) {
	const trimmedPreviousSummary = previousSummary?.trim() ?? "";
	if (trimmedPreviousSummary && parseRequiredSummarySectionContents(trimmedPreviousSummary)) return trimmedPreviousSummary;
	const values = [
		nestRequiredSummaryHeadings(trimmedPreviousSummary) || "No prior history.",
		"None.",
		"None.",
		"None.",
		"None captured."
	];
	return REQUIRED_SUMMARY_SECTIONS.map((heading, index) => `${heading}\n${values[index]}`).join("\n\n");
}
/** Appends a bounded post-compaction section to an existing summary. */
function appendSummarySection(summary, section) {
	if (!section) return summary;
	if (!summary.trim()) return section.trimStart();
	return `${summary}${section}`;
}
function sanitizeExtractedIdentifier(value) {
	return value.trim().replace(/^[("'`[{<]+/, "").replace(/[)\]"'`,;:.!?<>]+$/, "");
}
function isPureHexIdentifier(value) {
	return /^[A-Fa-f0-9]{8,}$/.test(value);
}
function normalizeOpaqueIdentifier(value) {
	return isPureHexIdentifier(value) ? value.toUpperCase() : value;
}
function summaryIncludesIdentifier(summary, identifier) {
	if (isPureHexIdentifier(identifier)) return summary.toUpperCase().includes(identifier.toUpperCase());
	return summary.includes(identifier);
}
/** Extracts likely exact identifiers that summaries should preserve literally. */
function extractOpaqueIdentifiers(text) {
	return uniqueStrings(Array.from(text.matchAll(/(https?:\/\/\S+|(?<![A-Za-z0-9._-])\/[\w.-]{2,}(?:\/[\w.-]+)+|[A-Za-z]:\\[\w\\.-]+|(?<![A-Za-z0-9._-])[A-Za-z0-9._-]+\.[A-Za-z0-9._/-]+:\d{1,5})|(?:(?:(?:\d+\.\d+|\.\d+)(?:[eE][+-]?\d+)?|\d+\.[eE][+-]?\d+|\d+\.?[eE][+-]\d+|(?![A-Fa-f0-9]{8,}(?![A-Fa-f0-9]))\d+\.?[eE]\d+)(?:(?=[A-Za-z]+(?![A-Za-z0-9]))(?=[A-Za-z]*[G-Zg-z])[A-Za-z]+)?(?![A-Za-z0-9])|(?<![A-Za-z0-9_-])(?=[A-Za-z0-9_-]*(?:[A-Fa-f0-9]{8,}|\d{6,}))([A-Za-z0-9_-]+))/g), (match) => match[1] ?? match[2] ?? "").map((value) => normalizeOpaqueIdentifier(sanitizeExtractedIdentifier(value))).filter((value) => value.length >= 4)).slice(0, MAX_EXTRACTED_IDENTIFIERS);
}
function tokenizeAskOverlapText(text, includeFallbackTokens = false) {
	const normalized = localeLowercasePreservingWhitespace(text.normalize("NFKC")).trim();
	if (!normalized) return [];
	const keywords = extractKeywords(normalized);
	if (keywords.length > 0 && !includeFallbackTokens) return keywords;
	const tokens = normalized.split(/[^\p{L}\p{N}]+/u).map((token) => token.trim()).filter((token) => token.length > 0);
	return uniqueStrings([...keywords, ...tokens]);
}
function resolveAskOverlapRequirement(latestAsk) {
	if (!latestAsk) return null;
	const askTokens = tokenizeAskOverlapText(latestAsk).slice(0, MAX_ASK_OVERLAP_TOKENS);
	if (askTokens.length === 0) return null;
	const meaningfulAskTokens = askTokens.filter((token) => token.length > 1 && !isQueryStopWordToken(token));
	const tokensToCheck = meaningfulAskTokens.length > 0 ? meaningfulAskTokens : askTokens;
	return {
		tokens: tokensToCheck,
		requiredMatches: tokensToCheck.length >= MIN_ASK_OVERLAP_TOKENS_FOR_DOUBLE_MATCH ? 2 : 1
	};
}
function hasAskOverlap(summary, latestAsk) {
	const requirement = resolveAskOverlapRequirement(latestAsk);
	if (!requirement) return true;
	const summaryTokens = new Set(tokenizeAskOverlapText(summary, true));
	return requirement.tokens.filter((token) => summaryTokens.has(token)).length >= requirement.requiredMatches;
}
/** Preserve whole identifiers; count values that cannot fit in the corrective request. */
function missingIdentifierAuditReasons(missing) {
	const named = [];
	let used = 0;
	for (const identifier of missing) {
		const cost = named.length === 0 ? identifier.length : identifier.length + 1;
		if (used + cost > MAX_MISSING_IDENTIFIER_REASON_CHARS) continue;
		used += cost;
		named.push(identifier);
	}
	const omitted = missing.length - named.length;
	return [...named.length > 0 ? [`missing_identifiers:${named.join(",")}`] : [], ...omitted > 0 ? [`missing_identifiers_omitted:${omitted}`] : []];
}
/** Audits a candidate summary for required sections, pending asks, and identifier preservation. */
function auditSummaryQuality(params) {
	const reasons = [];
	const lines = new Set(normalizedSummaryLines(params.structuralSummary));
	for (const section of REQUIRED_SUMMARY_SECTIONS) {
		if (!lines.has(section)) reasons.push(`missing_section:${section}`);
		if (params.sourceSummaries?.some((source) => normalizedSummaryLines(source).filter((line) => line === section).length > 1)) reasons.push(`duplicate_section:${section}`);
	}
	if ((params.identifierPolicy ?? "strict") === "strict") {
		const missingIdentifiers = params.identifiers.filter((identifier) => !summaryIncludesIdentifier(params.summary, identifier));
		reasons.push(...missingIdentifierAuditReasons(missingIdentifiers));
	}
	const leadingPendingAsk = extractLeadingPendingAsk(params.structuralSummary);
	if (params.latestUnresolvedUserRequest && leadingPendingAsk !== formatLatestUserRequestContext(params.latestUnresolvedUserRequest)) reasons.push("latest_user_ask_not_foregrounded");
	else if (!params.latestUnresolvedUserRequest && !hasAskOverlap(params.summary, params.latestAsk)) reasons.push("latest_user_ask_not_reflected");
	const retainedPendingAsk = extractLeadingPendingAsk(params.retainedTurnSummary ?? "");
	if (params.latestUnresolvedUserRequest ? retainedPendingAsk && !isEmptyPendingAsk(retainedPendingAsk) : params.retainedTurnSummary !== void 0 && resolveAskOverlapRequirement(params.latestAsk) && hasAskOverlap(extractPendingAskSection(params.retainedTurnSummary), params.latestAsk)) reasons.push("retained_turn_ask_marked_pending");
	return {
		ok: reasons.length === 0,
		reasons
	};
}
//#endregion
//#region src/agents/agent-hooks/compaction-safeguard-budget.ts
/** Fits a generated summary body and its suffix sections into one bounded compaction artifact. */
const CONTEXT_TRUNCATED_MARKER = "\n\n[Earlier compaction context truncated to fit budget]\n\n";
function resolveSuffixTailStart(suffix, tailBudget) {
	const desiredStart = Math.max(0, suffix.text.length - tailBudget);
	const containingRange = suffix.contextRanges.find((range) => desiredStart > range.start && desiredStart < range.end);
	if (!containingRange) return desiredStart;
	return containingRange.segmentStarts.find((segmentStart) => segmentStart >= desiredStart) ?? containingRange.end;
}
function capCompactionSuffix(suffix, maxChars) {
	if (suffix.text.length <= maxChars) return suffix.text;
	if (maxChars <= 0) return "";
	if (maxChars < 56) {
		const start = resolveSuffixTailStart(suffix, maxChars);
		return sliceUtf16Safe(suffix.text, start);
	}
	const tailBudget = maxChars - 56;
	const start = resolveSuffixTailStart(suffix, tailBudget);
	const cutRange = suffix.contextRanges.find((range) => start > range.start && start < range.end && (range.segmentStarts[0] ?? range.end) <= start);
	if (cutRange) {
		const heading = `\n\n${suffix.text.slice(cutRange.start, cutRange.segmentStarts[0]).trim()}`;
		const headedStart = resolveSuffixTailStart(suffix, tailBudget - heading.length);
		if (tailBudget > heading.length && headedStart < cutRange.end) return `${heading}${CONTEXT_TRUNCATED_MARKER}${sliceUtf16Safe(suffix.text, headedStart)}`;
	}
	return tailBudget > 0 ? `${CONTEXT_TRUNCATED_MARKER}${sliceUtf16Safe(suffix.text, start)}` : CONTEXT_TRUNCATED_MARKER;
}
function budgetCompactionSummary(summaryBody, suffix, maxChars, qualityRetention) {
	const joined = `${summaryBody}${suffix.text}`;
	const retentionPlan = qualityRetention ? createSummaryQualityRetentionPlan(summaryBody, SUMMARY_TRUNCATED_MARKER, qualityRetention) : null;
	if (maxChars <= 0 || joined.length <= maxChars && !retentionPlan?.needsRebuild(maxChars)) return {
		summary: joined,
		structuralSummary: summaryBody,
		bodyBudget: maxChars,
		bodyTrimmed: false,
		suffixTrimmed: false
	};
	if (retentionPlan && retentionPlan.minimumChars > maxChars) return;
	const bodyCapacity = retentionPlan ? maxChars : summaryBody.length;
	const bodyFloor = Math.min(bodyCapacity, maxChars, Math.max(1, Math.ceil(maxChars / 2), retentionPlan?.minimumChars ?? 0));
	const contextChars = suffix.contextRanges.reduce((sum, range) => sum + range.end - range.start, 0);
	const suffixReservation = Math.min(suffix.text.length - contextChars, maxChars);
	const bodySlot = Math.min(bodyCapacity, Math.max(bodyFloor, maxChars - suffixReservation));
	const rendered = retentionPlan?.render(bodySlot);
	const cappedBody = rendered?.text ?? capCompactionSummary(summaryBody, bodySlot);
	const cappedSuffix = capCompactionSuffix(suffix, Math.max(0, maxChars - cappedBody.length));
	return {
		summary: `${cappedBody}${cappedSuffix}`,
		structuralSummary: cappedBody,
		bodyBudget: bodySlot,
		bodyTrimmed: rendered ? rendered.trimmed : cappedBody.length < summaryBody.length,
		suffixTrimmed: cappedSuffix.length < suffix.text.length
	};
}
//#endregion
//#region src/agents/agent-hooks/compaction-safeguard-tool-failures.ts
/** Collects failed tool results and renders the bounded Tool Failures summary section. */
const MAX_TOOL_FAILURES = 8;
const MAX_TOOL_FAILURE_CHARS = 240;
function formatToolFailureMeta(details) {
	if (!details || typeof details !== "object") return;
	const record = details;
	return [typeof record.status === "string" && record.status ? `status=${record.status}` : "", typeof record.exitCode === "number" && Number.isFinite(record.exitCode) ? `exitCode=${record.exitCode}` : ""].filter(Boolean).join(" ") || void 0;
}
function collectToolFailures(messages) {
	const failures = [];
	const seen = /* @__PURE__ */ new Set();
	for (const message of messages) {
		if (message.role !== "toolResult" || !message.isError) continue;
		const toolResult = message;
		if (typeof toolResult.toolName === "string" && toolResult.toolName.trim() === "sessions_spawn" && normalizeAcceptedSessionSpawnResult(toolResult)) continue;
		const toolCallId = typeof toolResult.toolCallId === "string" ? toolResult.toolCallId : "";
		if (!toolCallId || seen.has(toolCallId)) continue;
		seen.add(toolCallId);
		const toolName = typeof toolResult.toolName === "string" && toolResult.toolName.trim() ? toolResult.toolName : "tool";
		const meta = formatToolFailureMeta(toolResult.details);
		const failureText = collectTextContentBlocks(toolResult.content).join("\n").replace(/\s+/g, " ").trim() || (meta ? "failed" : "failed (no output)");
		const summary = failureText.length > MAX_TOOL_FAILURE_CHARS ? `${truncateUtf16Safe(failureText, 237)}...` : failureText;
		failures.push({
			toolCallId,
			toolName,
			summary,
			meta
		});
	}
	return failures;
}
function formatToolFailuresSection(failures) {
	if (failures.length === 0) return "";
	const lines = failures.slice(0, MAX_TOOL_FAILURES).map((failure) => {
		const meta = failure.meta ? ` (${failure.meta})` : "";
		return `- ${failure.toolName}${meta}: ${failure.summary}`;
	});
	if (failures.length > MAX_TOOL_FAILURES) lines.push(`- ...and ${failures.length - MAX_TOOL_FAILURES} more`);
	return `\n\n## Tool Failures\n${lines.join("\n")}`;
}
//#endregion
//#region src/auto-reply/reply/post-compaction-context.ts
const log$2 = createSubsystemLogger("post-compaction-context");
const MAX_CONTEXT_CHARS = 1800;
const DEFAULT_POST_COMPACTION_SECTIONS = ["Session Startup", "Red Lines"];
const LEGACY_POST_COMPACTION_SECTIONS = ["Every Session", "Safety"];
function matchesSectionSet(sectionNames, expectedSections) {
	if (sectionNames.length !== expectedSections.length) return false;
	const actual = sectionNames.map(normalizeLowercaseStringOrEmpty).toSorted();
	const expected = expectedSections.map(normalizeLowercaseStringOrEmpty).toSorted();
	return actual.every((name, index) => name === expected[index]);
}
async function readPostCompactionContext(workspaceDir, options) {
	const { cfg, agentId, nowMs } = options ?? {};
	const configuredSections = cfg?.agents?.defaults?.compaction?.postCompactionSections;
	if (!Array.isArray(configuredSections) || configuredSections.length === 0) return null;
	const agentsPath = path.join(workspaceDir, "AGENTS.md");
	try {
		let content;
		const access = getAgentWorkspaceAccess(workspaceDir);
		if (access) {
			const data = await access.bridge.readFile({
				filePath: "AGENTS.md",
				maxBytes: MAX_WORKSPACE_BOOTSTRAP_FILE_BYTES
			});
			if (data.length > 2097152) return null;
			content = new TextDecoder("utf-8", { fatal: true }).decode(data);
		} else {
			const opened = await openRootFile({
				absolutePath: agentsPath,
				rootPath: workspaceDir,
				boundaryLabel: "workspace root"
			});
			if (!opened.ok) return null;
			try {
				content = await readWorkspaceBootstrapFile(opened.fd);
			} catch (err) {
				if (err instanceof RangeError) {
					log$2.warn(`Ignoring oversized AGENTS.md ${agentsPath}: file exceeds the ${MAX_WORKSPACE_BOOTSTRAP_FILE_BYTES}-byte limit`);
					return null;
				}
				throw err;
			} finally {
				fs.closeSync(opened.fd);
			}
		}
		const foundSectionNames = [];
		let sections = extractSections(content, configuredSections, foundSectionNames);
		const isDefaultSections = matchesSectionSet(configuredSections, DEFAULT_POST_COMPACTION_SECTIONS);
		if (sections.length === 0 && isDefaultSections) sections = extractSections(content, LEGACY_POST_COMPACTION_SECTIONS, foundSectionNames);
		if (sections.length === 0) return null;
		const resolvedNowMs = nowMs ?? Date.now();
		const timezone = resolveUserTimezone(cfg?.agents?.defaults?.userTimezone);
		const dateStamp = formatDateStamp(resolvedNowMs, timezone);
		const maxContextChars = resolveAgentContextLimits(cfg, agentId)?.postCompactionMaxChars ?? MAX_CONTEXT_CHARS;
		const { timeLine } = resolveCronStyleNow(cfg ?? {}, resolvedNowMs);
		const combined = sections.join("\n\n").replaceAll("YYYY-MM-DD", dateStamp);
		const safeContent = combined.length > maxContextChars ? truncateUtf16Safe(combined, maxContextChars) + "\n...[truncated]..." : combined;
		return `[Post-compaction context refresh]\n\n${isDefaultSections ? "Session was just compacted. The conversation summary above is a hint, NOT a substitute for your startup sequence. Run your Session Startup sequence - read the required files before responding to the user." : `Session was just compacted. The conversation summary above is a hint, NOT a substitute for your full startup sequence. Re-read the sections injected below (${foundSectionNames.join(", ")}) and follow your configured startup procedure before responding to the user.`}\n\n${isDefaultSections ? "Critical rules from AGENTS.md:" : `Injected sections from AGENTS.md (${foundSectionNames.join(", ")}):`}\n\n${safeContent}\n\n${timeLine}`;
	} catch {
		return null;
	}
}
/**
* Extract named sections from markdown content.
* Matches H2 (##) or H3 (###) headings case-insensitively.
* Skips content inside fenced code blocks.
* Captures until the next heading of same or higher level (including H1), or end of string.
*/
function extractSections(content, sectionNames, foundNames) {
	const results = [];
	const fenceSpans = parseFenceSpans(content);
	const headings = [];
	let lineStart = 0;
	for (const line of content.split("\n")) {
		const match = findFenceSpanAt(fenceSpans, lineStart) ? null : line.match(/^(#{1,3})\s+(.+?)\s*$/);
		if (match) headings.push({
			start: lineStart,
			level: expectDefined(match[1], "heading match capture group 1").length,
			name: normalizeLowercaseStringOrEmpty(match[2])
		});
		lineStart += line.length + 1;
	}
	for (const name of sectionNames) {
		const normalizedName = normalizeLowercaseStringOrEmpty(name);
		const start = headings.find((heading) => heading.level >= 2 && heading.name === normalizedName);
		if (!start) continue;
		const end = headings.find((heading) => heading.start > start.start && heading.level <= start.level);
		results.push(content.slice(start.start, end?.start).trim());
		foundNames?.push(name);
	}
	return results;
}
async function appendPostCompactionRefreshPrompt(params) {
	const refreshPrompt = await readPostCompactionContext(params.followupRun.run.workspaceDir, {
		cfg: params.cfg,
		agentId: params.followupRun.run.agentId
	});
	if (!refreshPrompt) return;
	const existingPrompt = params.followupRun.run.extraSystemPrompt;
	if (existingPrompt?.includes(refreshPrompt)) return;
	params.followupRun.run.extraSystemPrompt = [existingPrompt, refreshPrompt].filter(Boolean).join("\n\n");
}
//#endregion
//#region src/agents/agent-hooks/compaction-workspace-context.ts
const log$1 = createSubsystemLogger("compaction-safeguard");
async function readWorkspaceContextForSummary(sectionNames, workspaceDir) {
	const MAX_SUMMARY_CONTEXT_CHARS = 2e3;
	if (!Array.isArray(sectionNames) || sectionNames.length === 0) return "";
	if (!workspaceDir) {
		log$1.warn("Compaction safeguard: workspace rules skipped; no agent workspace was provided.");
		return "";
	}
	const agentsPath = path.join(workspaceDir, "AGENTS.md");
	try {
		const opened = await openRootFile({
			absolutePath: agentsPath,
			rootPath: workspaceDir,
			boundaryLabel: "workspace root"
		});
		if (!opened.ok) {
			log$1.warn(`Compaction safeguard: cannot open ${agentsPath} (${opened.reason}); workspace rules skipped.`);
			return "";
		}
		let content;
		try {
			content = await readWorkspaceBootstrapFile(opened.fd);
		} finally {
			fs.closeSync(opened.fd);
		}
		let sections = extractSections(content, sectionNames);
		if (sections.length === 0 && sectionNames.length === 2 && sectionNames.some((name) => name.trim().toLowerCase() === "session startup") && sectionNames.some((name) => name.trim().toLowerCase() === "red lines")) sections = extractSections(content, ["Every Session", "Safety"]);
		if (sections.length < sectionNames.length) log$1.warn(`Compaction safeguard: found ${sections.length} of ${sectionNames.length} configured sections in ${agentsPath}; check postCompactionSections.`);
		if (sections.length === 0) return "";
		const combined = sections.join("\n\n");
		return `\n\n<workspace-critical-rules>\n${combined.length > MAX_SUMMARY_CONTEXT_CHARS ? `${truncateUtf16Safe(combined, MAX_SUMMARY_CONTEXT_CHARS)}\n...[truncated]...` : combined}\n</workspace-critical-rules>`;
	} catch (err) {
		log$1.warn(`Compaction safeguard: cannot read ${agentsPath}; workspace rules skipped: ${formatErrorMessage(err)}`);
		return "";
	}
}
//#endregion
//#region src/agents/agent-hooks/compaction-safeguard.ts
/** Extension that safeguards compaction with structured summaries and quality repair. */
const log = createSubsystemLogger("compaction-safeguard");
const missedModelWarningSessions = /* @__PURE__ */ new WeakSet();
const SPLIT_TURN_SECTION_HEADING = "**Turn Context (split turn):**";
const MAX_SPLIT_TURN_CONTEXT_CHARS = Math.floor(MAX_COMPACTION_SUMMARY_CHARS / 2);
const SPLIT_TURN_TRUNCATED_MARKER = "[Earlier split-turn messages truncated]\n";
const PRESERVED_TURNS_TRUNCATED_MARKER = "[Earlier preserved messages truncated]\n";
const DEFAULT_RECENT_TURNS_PRESERVE = 3;
const DEFAULT_QUALITY_GUARD_MAX_RETRIES = 1;
const MAX_RECENT_TURNS_PRESERVE = 12;
const MAX_QUALITY_GUARD_MAX_RETRIES = 3;
const MAX_RECENT_TURN_TEXT_CHARS = 600;
const MAX_PRESERVED_TOOL_RESULT_CHARS = 160;
const compactionSafeguardDeps = { summarizeCompactionHistory };
function nestMarkdownHeadings(text) {
	return text.replace(/^##(?=[ \t]+\S)/gmu, "###");
}
function normalizeLegacySplitTurnSummary(summary) {
	const splitTurnStart = summary?.indexOf(SPLIT_TURN_SECTION_HEADING) ?? -1;
	if (!summary || splitTurnStart < 0) return summary;
	const splitTurnContentStart = splitTurnStart + 30;
	return `${summary.slice(0, splitTurnContentStart)}${nestRequiredSummaryHeadings(summary.slice(splitTurnContentStart))}`;
}
/**
* The boundary-scoped range a preparation was meant to cover: everything the
* current context holds before its kept tail, minus the prior summary message
* (that is re-distilled separately). Bounded by construction — it can never
* reach behind the last reset/compaction boundary.
*/
function collectPreparationRangeMessages(sessionManager, firstKeptEntryId) {
	const entries = readSessionBranch(sessionManager);
	const firstKeptIndex = entries.findIndex((entry) => entry.id === firstKeptEntryId);
	if (firstKeptIndex < 0) return [];
	return projectBranchEntries(entries.filter((entry, index) => index < firstKeptIndex || entry.type === "compaction" || entry.type === "reset")).filter((message) => message.role !== "compactionSummary");
}
function readSessionBranch(sessionManager) {
	try {
		return sessionManager.getBranch();
	} catch {
		return [];
	}
}
function projectBranchEntries(entries) {
	try {
		return buildSessionContext(entries).messages;
	} catch {
		return [];
	}
}
function containsRealConversation(messages) {
	return messages.some((message, index, allMessages) => isRealConversationMessage(message, allMessages, index));
}
function assembleSuffix(parts) {
	let text = "";
	const contextRanges = [];
	for (const part of Object.values(parts)) {
		const section = typeof part === "string" ? part : part?.text;
		if (!section) continue;
		const leadingTrim = text ? 0 : section.length - section.trimStart().length;
		const appended = leadingTrim > 0 ? section.slice(leadingTrim) : section;
		const start = text.length;
		text = appendSummarySection(text, section);
		if (typeof part !== "string") contextRanges.push({
			start,
			end: start + appended.length,
			segmentStarts: part.segmentStarts.filter((segmentStart) => segmentStart >= leadingTrim).map((segmentStart) => start + segmentStart - leadingTrim)
		});
	}
	if (text && !/^\s/.test(text)) {
		text = `\n\n${text}`;
		for (const range of contextRanges) {
			range.start += 2;
			range.end += 2;
			range.segmentStarts = range.segmentStarts.map((segmentStart) => segmentStart + 2);
		}
	}
	return {
		text,
		contextRanges
	};
}
async function resolveModelAuth(ctx, model) {
	let requestAuth;
	try {
		requestAuth = await ctx.modelRegistry.getApiKeyAndHeaders(model);
	} catch (err) {
		const error = formatErrorMessage(err);
		log.warn(`Compaction safeguard: request credentials unavailable; cancelling compaction. ${error}`);
		return {
			ok: false,
			reason: `Compaction safeguard could not resolve request credentials for ${model.provider}/${model.id}: ${error}`
		};
	}
	if (!requestAuth.ok) {
		log.warn(`Compaction safeguard: request credential resolution failed for ${model.provider}/${model.id}: ${requestAuth.error}`);
		return {
			ok: false,
			reason: `Compaction safeguard could not resolve request credentials for ${model.provider}/${model.id}: ${requestAuth.error}`
		};
	}
	return {
		ok: true,
		apiKey: requestAuth.apiKey,
		headers: requestAuth.headers
	};
}
function buildCompactionSummaryHeaders(params) {
	if (params.model.provider !== "github-copilot") return params.headers;
	const messages = params.messages;
	return {
		...buildCopilotDynamicHeaders({
			messages,
			hasImages: hasCopilotVisionInput(messages)
		}),
		...params.headers
	};
}
function clampNonNegativeInt(value, fallback, max) {
	return Math.min(max, Math.max(0, Math.floor(typeof value === "number" && Number.isFinite(value) ? value : fallback)));
}
function resolveRecentTurnsPreserve(value) {
	return clampNonNegativeInt(value, DEFAULT_RECENT_TURNS_PRESERVE, MAX_RECENT_TURNS_PRESERVE);
}
function resolveQualityGuardMaxRetries(value) {
	return clampNonNegativeInt(value, DEFAULT_QUALITY_GUARD_MAX_RETRIES, MAX_QUALITY_GUARD_MAX_RETRIES);
}
function formatNonTextPlaceholder(content) {
	if (content == null || typeof content === "string") return null;
	if (!Array.isArray(content)) return "[non-text content]";
	const typeCounts = /* @__PURE__ */ new Map();
	for (const block of content) {
		if (!block || typeof block !== "object") continue;
		const typeRaw = block.type;
		const type = typeof typeRaw === "string" && typeRaw.trim().length > 0 ? typeRaw : "unknown";
		if (type === "text") continue;
		typeCounts.set(type, (typeCounts.get(type) ?? 0) + 1);
	}
	return typeCounts.size > 0 ? `[non-text content: ${Array.from(typeCounts, ([type, count]) => count > 1 ? `${type} x${count}` : type).join(", ")}]` : null;
}
function formatContextMessage(message) {
	let roleLabel;
	if (message.role === "assistant") roleLabel = "Assistant";
	else if (message.role === "user") roleLabel = formatCompactionUserLabel(message);
	else if (message.role === "toolResult") {
		const toolName = message.toolName;
		roleLabel = `Tool result (${typeof toolName === "string" && toolName.trim() ? toolName : "tool"})`;
	} else return null;
	const rendered = [extractCompactionMessageText(message), formatNonTextPlaceholder(message.content)].filter(Boolean).join("\n");
	if (!rendered) return null;
	const limit = message.role === "toolResult" ? MAX_PRESERVED_TOOL_RESULT_CHARS : MAX_RECENT_TURN_TEXT_CHARS;
	const trimmed = rendered.length <= limit ? rendered : message.role === "toolResult" ? `${truncateUtf16Safe(rendered, limit)} [${rendered.length - limit} more chars omitted at compaction]` : `${truncateUtf16Safe(rendered, limit)}...`;
	return `- ${roleLabel}: ${trimmed}`;
}
function formatContextSegments(messages) {
	const pairing = classifyToolUseResultPairing(messages);
	const toolSegments = new Map(pairing.frames.map((frame) => [frame.assistant, [frame.assistant, ...frame.occurrences.flatMap((occurrence) => occurrence.sourceResult ? [occurrence.sourceResult] : [])]]));
	return messages.flatMap((message) => {
		if (message.role === "toolResult") return [];
		const lines = (toolSegments.get(message) ?? [message]).map(formatContextMessage).filter((line) => Boolean(line));
		return lines.length > 0 ? [lines.join("\n")] : [];
	});
}
function formatBoundedContextSection(params) {
	const segments = formatContextSegments(params.messages);
	if (segments.length === 0) return {
		text: "",
		segmentStarts: []
	};
	let prefix = `${params.heading}\n`;
	let retained = segments;
	const truncated = !(prefix.length + segments.join("\n").length <= MAX_SPLIT_TURN_CONTEXT_CHARS);
	if (truncated) {
		prefix += params.truncatedMarker;
		retained = [];
		let usedChars = prefix.length;
		for (const segment of segments.toReversed()) {
			const segmentChars = segment.length + (retained.length > 0 ? 1 : 0);
			if (usedChars + segmentChars > MAX_SPLIT_TURN_CONTEXT_CHARS) break;
			retained.unshift(segment);
			usedChars += segmentChars;
		}
	}
	let offset = prefix.length;
	return {
		text: `${prefix}${retained.join("\n")}`,
		segmentStarts: retained.map((segment) => {
			const start = offset;
			offset += segment.length + 1;
			return start;
		}),
		...truncated ? { truncatedLoss: params.truncatedLoss } : {}
	};
}
function buildPreservedTurnsSection(messages) {
	return formatBoundedContextSection({
		messages,
		heading: "\n\n## Recent turns preserved verbatim",
		truncatedMarker: PRESERVED_TURNS_TRUNCATED_MARKER,
		truncatedLoss: "preserved-turn-head"
	});
}
function buildSplitTurnContextSection(messages) {
	return formatBoundedContextSection({
		messages,
		heading: "**Turn Context (split turn):**\n",
		truncatedMarker: SPLIT_TURN_TRUNCATED_MARKER,
		truncatedLoss: "split-turn-head"
	});
}
function formatGeneratedSplitTurnSection(summary, onTruncated) {
	const heading = `${SPLIT_TURN_SECTION_HEADING}\n\n`;
	const summaryBudget = MAX_SPLIT_TURN_CONTEXT_CHARS - heading.length;
	const nestedSummary = nestMarkdownHeadings(summary);
	const cappedSummary = capCompactionSummary(nestedSummary, summaryBudget);
	if (cappedSummary.length < nestedSummary.length) onTruncated();
	return `${heading}${cappedSummary}`;
}
/** Registers compaction hooks that summarize, preserve recent turns, and audit output quality. */
function compactionSafeguardExtension(api) {
	api.on("session_before_compact", async (event, ctx) => {
		const { preparation, customInstructions: eventInstructions, signal, thinkingLevel, streamFn } = event;
		const previousSummary = normalizeLegacySplitTurnSummary(preparation.previousSummary?.trim());
		let baseMessagesToSummarize = stripRuntimeContextCustomMessages(preparation.messagesToSummarize);
		let baseTurnPrefixMessages = stripRuntimeContextCustomMessages(preparation.turnPrefixMessages ?? []);
		const latestUnresolvedUserRequest = preparation.latestUnresolvedUserRequest;
		const reconcileRequestSelection = (summary) => preparation.requestState !== void 0 && !latestUnresolvedUserRequest ? clearCompactionPendingAskSection(summary) : summary;
		if (!containsRealConversation([...baseMessagesToSummarize, ...baseTurnPrefixMessages])) {
			const rangeMessages = stripRuntimeContextCustomMessages(collectPreparationRangeMessages(ctx.sessionManager, preparation.firstKeptEntryId));
			if (containsRealConversation(rangeMessages)) {
				log.info("Compaction safeguard: summarizing the boundary-scoped preparation range after compaction preparation omitted real conversation content.");
				baseMessagesToSummarize = rangeMessages;
				baseTurnPrefixMessages = [];
			}
		}
		const hasRealConversation = containsRealConversation([...baseMessagesToSummarize, ...baseTurnPrefixMessages]) || containsRealConversation(stripRuntimeContextCustomMessages(projectBranchEntries(readSessionBranch(ctx.sessionManager))));
		setCompactionSafeguardCancellation(ctx.sessionManager, void 0);
		const cancelCompaction = (reason, error) => {
			setCompactionSafeguardCancellation(ctx.sessionManager, reason, error);
			return { cancel: true };
		};
		if (!hasRealConversation) {
			log.info("Compaction safeguard: no real conversation messages to summarize; writing compaction boundary to suppress re-trigger loop.");
			return { compaction: {
				summary: buildStructuredFallbackSummary(previousSummary),
				firstKeptEntryId: preparation.firstKeptEntryId,
				tokensBefore: preparation.tokensBefore
			} };
		}
		const { readFiles, modifiedFiles } = computeFileLists(preparation.fileOps);
		const fileOpsSummary = formatFileOperations(readFiles, modifiedFiles);
		const toolFailureSection = formatToolFailuresSection(collectToolFailures([...baseMessagesToSummarize, ...baseTurnPrefixMessages]));
		const runtime = getCompactionSafeguardRuntime(ctx.sessionManager);
		const customInstructions = resolveCompactionInstructions(eventInstructions, runtime?.customInstructions);
		const summarizationInstructions = {
			identifierPolicy: runtime?.identifierPolicy,
			identifierInstructions: runtime?.identifierInstructions
		};
		const identifierPolicy = runtime?.identifierPolicy ?? "strict";
		const qualityGuardEnabled = runtime?.qualityGuardEnabled ?? false;
		const providerId = runtime?.provider;
		const turnPrefixMessages = baseTurnPrefixMessages;
		const recentTurnsPreserve = resolveRecentTurnsPreserve(runtime?.recentTurnsPreserve);
		const structuredInstructions = buildCompactionStructureInstructions(customInstructions, summarizationInstructions, latestUnresolvedUserRequest ?? void 0);
		let workspaceContextPromise;
		const finalizeSummaryText = async (body, sections, producerLosses = /* @__PURE__ */ new Set(), qualityRetention) => {
			workspaceContextPromise ??= readWorkspaceContextForSummary(runtime?.postCompactionSections, runtime?.workspaceDir);
			const suffix = assembleSuffix({
				preservedTurnsSection: sections.preservedTurnsSection,
				splitTurnSection: sections.splitTurnSection,
				generatedSplitTurnSection: sections.generatedSplitTurnSection,
				toolFailureSection,
				fileOpsSummary,
				workspaceContext: await workspaceContextPromise
			});
			const fit = (retention) => fitCompactionSummary(preparation.summaryTokenBudget, (maxChars) => budgetCompactionSummary(body, suffix, maxChars, retention));
			let fitted = fit(qualityRetention);
			const losses = new Set(producerLosses);
			const qualityRetentionInfeasible = !fitted.ok && Boolean(qualityRetention);
			if (qualityRetention && !fitted.ok) {
				const { identifiers } = qualityRetention;
				const byLength = identifiers.toSorted((left, right) => left.length - right.length);
				for (let kept = byLength.length - 1; kept >= 0 && !fitted.ok; kept -= 1) {
					const keep = new Set(byLength.slice(0, kept));
					fitted = fit({
						...qualityRetention,
						identifiers: identifiers.filter((identifier) => keep.has(identifier))
					});
				}
				losses.add(fitted.ok ? "identifier-retention" : "quality-retention");
				if (!fitted.ok) fitted = fit();
			}
			if (!fitted.ok) throw fitted.error;
			const finalized = fitted.value;
			for (const section of Object.values(sections)) if (typeof section !== "string" && section?.truncatedLoss) losses.add(section.truncatedLoss);
			if (finalized.bodyTrimmed) losses.add("summary-tail");
			if (finalized.suffixTrimmed) losses.add("suffix-head");
			if (losses.size > 0) log.warn(`Compaction safeguard: finalized artifact truncated; loss=${[...losses].join(",")}`);
			return {
				...finalized,
				qualityRetentionInfeasible
			};
		};
		const compactionResult = (summary, provenance) => ({ compaction: {
			summary,
			firstKeptEntryId: preparation.firstKeptEntryId,
			tokensBefore: preparation.tokensBefore,
			details: {
				readFiles,
				modifiedFiles,
				...latestUnresolvedUserRequest ? { latestUnresolvedUserRequest } : {},
				...provenance
			}
		} });
		if (providerId) {
			const compactionProvider = getCompactionProvider(providerId);
			if (compactionProvider) try {
				const providerResult = await compactionProvider.summarize({
					messages: [...baseMessagesToSummarize, ...turnPrefixMessages],
					signal,
					customInstructions: structuredInstructions,
					summarizationInstructions,
					previousSummary
				});
				if (typeof providerResult === "string" && providerResult.trim()) {
					const { preservedMessages } = splitPreservedRecentTurns({
						messages: baseMessagesToSummarize,
						recentTurnsPreserve
					});
					return compactionResult((await finalizeSummaryText(reconcileRequestSelection(providerResult), {
						splitTurnSection: preparation.isSplitTurn ? buildSplitTurnContextSection(turnPrefixMessages) : void 0,
						preservedTurnsSection: buildPreservedTurnsSection(preservedMessages)
					})).summary);
				}
				log.warn(`Compaction provider "${compactionProvider.id}" returned empty result, falling back to LLM.`);
			} catch (err) {
				if (signal?.aborted) throw err;
				log.warn(`Compaction provider "${compactionProvider.id}" failed, falling back to LLM: ${formatErrorMessage(err)}`);
			}
			else log.warn(`Compaction provider "${providerId}" is configured but not registered. Falling back to LLM.`);
		}
		const model = ctx.model ?? runtime?.model;
		if (!model) {
			if (!missedModelWarningSessions.has(ctx.sessionManager)) {
				missedModelWarningSessions.add(ctx.sessionManager);
				log.warn("[compaction-safeguard] Both ctx.model and runtime.model are undefined. Compaction summarization will not run. This indicates extensionRunner.initialize() was not called and model was not passed through runtime registry.");
			}
			return cancelCompaction("Compaction safeguard could not resolve a summarization model.");
		}
		const authResult = await resolveModelAuth(ctx, model);
		if (!authResult.ok) return cancelCompaction(authResult.reason);
		try {
			const headers = buildCompactionSummaryHeaders({
				model,
				messages: baseMessagesToSummarize,
				headers: authResult.headers
			});
			const usageSink = (usage) => recordSessionModelUsage(ctx.sessionManager, usage);
			const llmSummaryParams = {
				model,
				apiKey: authResult.apiKey ?? "",
				headers,
				signal,
				reserveTokens: resolveSummaryReserveTokens(preparation.settings.reserveTokens, model),
				summarizationInstructions,
				thinkingLevel,
				streamFn,
				usageSink
			};
			const qualityGuardMaxRetries = resolveQualityGuardMaxRetries(runtime?.qualityGuardMaxRetries);
			const oracleMessages = [...baseMessagesToSummarize, ...turnPrefixMessages];
			const splitUserAsk = preparation.isSplitTurn ? extractCurrentCompactionUserRequest(turnPrefixMessages, extractCompactionMessageText) : null;
			const latestUserAsk = preparation.requestState !== void 0 ? latestUnresolvedUserRequest ?? null : extractCurrentCompactionUserRequest(oracleMessages, extractCompactionMessageText);
			const latestAskInRetainedTurn = splitUserAsk !== null && splitUserAsk === latestUserAsk;
			const identifiers = extractOpaqueIdentifiers(oracleMessages.slice(-10).map(extractCompactionMessageText).filter(Boolean).join("\n"));
			const { summarizableMessages: summaryTargetMessages, preservedMessages: preservedRecentMessages } = splitPreservedRecentTurns({
				messages: baseMessagesToSummarize,
				recentTurnsPreserve
			});
			const preservedTurnsSectionLocal = buildPreservedTurnsSection(preservedRecentMessages);
			const latestPreparedAsk = extractCurrentCompactionUserRequest(baseMessagesToSummarize, extractCompactionMessageText);
			const requiredAskContext = formatRequiredAskContext(latestUserAsk ?? "");
			const includePreservedContext = !latestUnresolvedUserRequest && qualityGuardEnabled && latestPreparedAsk === latestUserAsk && !preservedTurnsSectionLocal.text.includes(requiredAskContext);
			const reconciliationMessages = previousSummary || includePreservedContext || summaryTargetMessages.length > 0 || turnPrefixMessages.length > 0 ? oracleMessages : [];
			let correctiveInstructions = "";
			const totalAttempts = qualityGuardEnabled ? qualityGuardMaxRetries + 1 : 1;
			let bestSummary;
			const degrade = (summary, diagnostic) => {
				log.warn(`Compaction safeguard: ${diagnostic}; using degraded summary; reasonCode=quality_guard_degraded_fallback`);
				return compactionResult(summary, { qualityDegraded: true });
			};
			for (let attempt = 0; attempt < totalAttempts; attempt += 1) {
				let splitTurnSectionLocal = "";
				let splitTurnSummaryLocal = "";
				let historySummary = "";
				const producerLosses = /* @__PURE__ */ new Set();
				try {
					historySummary = reconciliationMessages.length > 0 ? await compactionSafeguardDeps.summarizeCompactionHistory({
						...llmSummaryParams,
						messages: reconciliationMessages,
						summaryPrompt: {
							kind: "custom",
							instructions: structuredInstructions
						},
						customInstructions: correctiveInstructions,
						previousSummary
					}) : buildStructuredFallbackSummary(previousSummary);
					historySummary = reconcileRequestSelection(historySummary);
					if (preparation.isSplitTurn && turnPrefixMessages.length > 0) {
						const splitTurnFocus = wrapUntrustedInstructionBlock("Additional context from /compact", customInstructions);
						const prefixSummary = await compactionSafeguardDeps.summarizeCompactionHistory({
							...llmSummaryParams,
							messages: turnPrefixMessages,
							summaryPrompt: { kind: "turn-prefix" },
							customInstructions: [splitTurnFocus, correctiveInstructions].filter(Boolean).join("\n\n"),
							previousSummary: void 0
						});
						splitTurnSummaryLocal = prefixSummary;
						splitTurnSectionLocal = formatGeneratedSplitTurnSection(prefixSummary, () => {
							producerLosses.add("split-turn-tail");
						});
					}
				} catch (attemptError) {
					if (signal?.aborted) signal.throwIfAborted();
					if (bestSummary) return degrade(bestSummary.summary, `corrective generation failed; attempt=${attempt + 1}`);
					throw attemptError;
				}
				const unbudgetedSummary = appendSummarySection(historySummary, splitTurnSectionLocal ? `\n\n${splitTurnSectionLocal}` : "");
				const finalized = await finalizeSummaryText(qualityGuardEnabled ? historySummary : unbudgetedSummary, {
					generatedSplitTurnSection: qualityGuardEnabled && splitTurnSectionLocal ? `\n\n${splitTurnSectionLocal}` : void 0,
					preservedTurnsSection: preservedTurnsSectionLocal
				}, producerLosses, qualityGuardEnabled ? {
					auditSummary: unbudgetedSummary,
					identifiers,
					latestAsk: latestUserAsk,
					latestAskInRetainedTurn,
					latestUnresolvedUserRequest,
					requiredAskContext,
					identifierPolicy
				} : void 0);
				if (!qualityGuardEnabled) return compactionResult(finalized.summary);
				const quality = auditSummaryQuality({
					summary: finalized.summary,
					structuralSummary: finalized.structuralSummary,
					sourceSummaries: [historySummary, splitTurnSummaryLocal].filter(Boolean),
					identifiers,
					latestAsk: latestUserAsk,
					latestUnresolvedUserRequest,
					retainedTurnSummary: latestAskInRetainedTurn ? splitTurnSummaryLocal : void 0,
					identifierPolicy
				});
				if (quality.ok && !finalized.qualityRetentionInfeasible) return compactionResult(finalized.summary);
				const reasonCount = quality.reasons.length + Number(finalized.qualityRetentionInfeasible);
				if (!bestSummary || reasonCount < bestSummary.reasonCount) bestSummary = {
					summary: (await finalizeSummaryText(buildStructuredFallbackSummary(historySummary.trim() || previousSummary), {
						generatedSplitTurnSection: splitTurnSectionLocal ? `\n\n${splitTurnSectionLocal}` : void 0,
						preservedTurnsSection: preservedTurnsSectionLocal
					}, producerLosses, {
						identifiers,
						latestAsk: latestUserAsk,
						latestAskInRetainedTurn,
						latestUnresolvedUserRequest,
						requiredAskContext,
						identifierPolicy
					})).summary,
					reasonCount
				};
				if (finalized.qualityRetentionInfeasible) return degrade(bestSummary.summary, "required quality facts exceed finalized artifact budget");
				if (reconciliationMessages.length === 0 || attempt >= totalAttempts - 1) {
					const reasonCodes = [...new Set(quality.reasons.map((reason) => reason.split(":", 1)[0]))];
					return degrade(bestSummary.summary, `final quality attempt failed; reasonCodes=${reasonCodes.join(",")} reasonCount=${quality.reasons.length}`);
				}
				const reasons = quality.reasons.join(", ");
				const qualityFeedbackInstruction = identifierPolicy === "strict" ? "Fix all issues and include every required section with exact identifiers preserved." : "Fix all issues and include every required section while following the configured identifier policy.";
				const budgetInstruction = `Keep the complete summary body within ${finalized.bodyBudget} UTF-16 code units so the finalized artifact remains valid after required suffixes.`;
				const qualityFeedbackReasons = wrapUntrustedInstructionBlock("Quality check feedback", `Previous summary failed quality checks (${reasons}).`);
				correctiveInstructions = qualityFeedbackReasons ? `${qualityFeedbackInstruction}\n${budgetInstruction}\n\n${qualityFeedbackReasons}` : `${qualityFeedbackInstruction}\n${budgetInstruction}`;
			}
			throw new Error("Compaction safeguard exhausted summary attempts without a decision.");
		} catch (error) {
			if (signal?.aborted) signal.throwIfAborted();
			const message = formatErrorMessage(error);
			log.warn(`Compaction summarization failed; cancelling compaction to preserve history: ${message}`);
			return cancelCompaction(`Compaction safeguard could not summarize the session: ${message}`, error);
		}
	});
}
const testing = {
	setSummarizeCompactionHistoryForTest(next) {
		compactionSafeguardDeps.summarizeCompactionHistory = next ?? summarizeCompactionHistory;
	},
	splitPreservedRecentTurns,
	buildPreservedTurnsSection,
	buildCompactionStructureInstructions,
	resolveRecentTurnsPreserve,
	resolveQualityGuardMaxRetries,
	extractOpaqueIdentifiers,
	auditSummaryQuality,
	capCompactionSummary,
	budgetCompactionSummary,
	formatFileOperations,
	MAX_FILE_OPS_SECTION_CHARS,
	MAX_COMPACTION_SUMMARY_CHARS,
	SUMMARY_TRUNCATED_MARKER,
	CONTEXT_TRUNCATED_MARKER,
	MAX_SPLIT_TURN_CONTEXT_CHARS
};
if (process.env.VITEST || false) globalThis[Symbol.for("openclaw.compactionSafeguardTestApi")] = testing;
//#endregion
//#region src/agents/embedded-agent-runner/extensions.ts
function buildEmbeddedExtensionFactories(params) {
	const factories = [];
	if (resolveEffectiveCompactionMode(params.cfg) === "safeguard") {
		const compactionCfg = params.cfg?.agents?.defaults?.compaction;
		const qualityGuardCfg = compactionCfg?.qualityGuard;
		setCompactionSafeguardRuntime(params.sessionManager, {
			identifierPolicy: compactionCfg?.identifierPolicy,
			qualityGuardEnabled: qualityGuardCfg?.enabled ?? true,
			qualityGuardMaxRetries: qualityGuardCfg?.maxRetries,
			model: params.model,
			recentTurnsPreserve: compactionCfg?.recentTurnsPreserve,
			workspaceDir: params.workspaceDir,
			postCompactionSections: compactionCfg?.postCompactionSections,
			provider: compactionCfg?.provider
		});
		factories.push(compactionSafeguardExtension);
	}
	const { agentId, sessionKey, runId, sessionManager } = params;
	const sessionId = params.sessionId ?? sessionManager.getSessionId?.();
	const runner = createAgentToolResultMiddlewareRunner({
		runtime: "openclaw",
		...agentId ? { agentId } : {},
		...sessionId ? { sessionId } : {},
		...sessionKey ? { sessionKey } : {},
		...runId ? { runId } : {}
	});
	factories.push((agent) => {
		agent.on("tool_result", async (rawEvent, ctx) => {
			const event = asOptionalRecord(rawEvent) ?? {};
			if (!event.toolName) return;
			const eventToolCallId = typeof event.toolCallId === "string" && event.toolCallId.trim() ? event.toolCallId : void 0;
			const toolCallId = eventToolCallId ?? `openclaw-${randomUUID()}`;
			const current = {
				content: Array.isArray(event.content) ? event.content : [],
				details: event.details
			};
			if (eventToolCallId) recordEmbeddedToolReceipt(sessionManager, eventToolCallId, current.details, event.toolName === "message");
			const inputHadErrorStatus = isToolResultError(current);
			const adjustedInput = eventToolCallId ? peekAdjustedParamsForToolCall(eventToolCallId, runId) : void 0;
			const result = await runner.applyToolResultMiddleware({
				threadId: event.threadId,
				turnId: event.turnId,
				toolCallId,
				toolName: event.toolName,
				args: asOptionalRecord(adjustedInput ?? event.input) ?? {},
				cwd: ctx.cwd,
				isError: event.isError,
				result: current
			});
			const isAcceptedSessionSpawn = event.toolName === "sessions_spawn" && normalizeAcceptedSessionSpawnResult(result) !== null;
			const hasError = event.isError === true || inputHadErrorStatus || isToolResultError(result);
			const isError = !isAcceptedSessionSpawn && hasError;
			if (eventToolCallId) finalizeToolTerminalPresentation({
				toolCallId: eventToolCallId,
				runId,
				result,
				isError
			});
			return {
				content: result.content,
				details: result.details,
				...result.terminate !== void 0 ? { terminate: result.terminate } : {},
				...hasError ? { isError } : {}
			};
		});
	});
	return factories;
}
//#endregion
//#region src/agents/embedded-agent-runner/tool-name-allowlist.ts
/**
* OpenClaw built-in tools that remain present in the embedded runtime even when
* OpenClaw routes execution through custom tool definitions.
*/
const AGENT_RESERVED_TOOL_NAMES = [
	"bash",
	"edit",
	"find",
	"grep",
	"ls",
	"read",
	"write"
];
function collectAllowedToolNames(params) {
	return /* @__PURE__ */ new Set([...collectRegisteredToolNames(params.tools), ...normalizeTrimmedStringList(params.clientTools?.map((tool) => tool.function?.name))]);
}
function collectRegisteredToolNames(tools) {
	return new Set(normalizeTrimmedStringList(tools.map((tool) => tool.name)));
}
function toSessionToolAllowlist(allowedToolNames) {
	return [...new Set(allowedToolNames)].toSorted((a, b) => a.localeCompare(b));
}
//#endregion
//#region src/agents/embedded-agent-runner/run/attempt-client-tools.ts
function prepareEmbeddedAttemptClientTools(params) {
	const clientToolCallSlots = [];
	const clientToolCallSlotsById = /* @__PURE__ */ new Map();
	const clientToolCallSlotKey = (toolCallId) => `${getAgentToolAssistantTurnId() ?? ""}\u0000${toolCallId}`;
	const reserveClientToolCallSlot = (toolCallId, toolName) => {
		const slotKey = clientToolCallSlotKey(toolCallId);
		let slot = clientToolCallSlotsById.get(slotKey);
		if (!slot) {
			slot = {
				toolCallId,
				name: toolName,
				completed: false
			};
			clientToolCallSlotsById.set(slotKey, slot);
			clientToolCallSlots.push(slot);
		}
		return slot;
	};
	const clientToolLoopDetection = resolveToolLoopDetectionConfig({
		cfg: params.attempt.config,
		agentId: params.sessionAgentId
	});
	const sourceClientToolDefs = params.clientTools ? toClientToolDefinitions(params.clientTools, {
		reserve: reserveClientToolCallSlot,
		complete: (toolCallId, toolName, toolParams) => {
			const slot = reserveClientToolCallSlot(toolCallId, toolName);
			slot.name = toolName;
			slot.params = toolParams;
			slot.completed = true;
		},
		discard: (toolCallId) => {
			const slot = clientToolCallSlotsById.get(clientToolCallSlotKey(toolCallId));
			if (slot) {
				slot.completed = false;
				slot.params = void 0;
			}
		}
	}, {
		agentId: params.sessionAgentId,
		sessionKey: params.sandboxSessionKey,
		config: params.toolSearchRuntimeConfig,
		sessionId: params.attempt.sessionId,
		runId: params.attempt.runId,
		loopDetection: clientToolLoopDetection,
		onToolOutcome: params.attempt.onToolOutcome,
		allocateToolOutcomeOrdinal: params.attempt.allocateToolOutcomeOrdinal
	}) : [];
	const buildSurface = () => {
		const effectiveTools = params.pinTools?.(params.effectiveTools) ?? params.effectiveTools;
		const builtinToolNames = /* @__PURE__ */ new Set();
		const trustedLocalMediaToolNames = /* @__PURE__ */ new Set();
		for (const tool of params.uncompactedEffectiveTools) {
			const name = (tool.name ?? "").trim();
			if (!name) continue;
			builtinToolNames.add(name);
			const pluginMeta = getPluginToolMeta(tool);
			if (pluginMeta?.trustedLocalMedia === true || !pluginMeta && isCoreToolResultMediaTrustedName(name)) trustedLocalMediaToolNames.add(name);
		}
		const coreBuiltinToolNames = collectRegisteredToolNames(params.uncompactedEffectiveTools.filter((tool) => !getPluginToolMeta(tool)));
		const isReplaySafeTool = (tool) => isAgentToolReplaySafe(tool, params.replaySafetyOptions);
		const replaySafeTools = new Set(params.uncompactedEffectiveTools.filter(isReplaySafeTool));
		const replaySafeToolNames = collectReplaySafeToolNames(params.uncompactedEffectiveTools, params.replaySafetyOptions);
		const codeModeExecToolNames = new Set(effectiveTools.filter((tool) => isCodeModeExecTool(tool)).map((tool) => tool.name));
		const sourceReplyCapableToolNames = new Set(params.uncompactedEffectiveTools.filter((tool) => "canDeliverSourceReply" in tool && tool.canDeliverSourceReply === true).map((tool) => normalizeToolPolicyName(tool.name ?? "")).filter((name) => name.length > 0));
		const clientConflictToolNames = params.deferredDirectoryToolsCallable ? builtinToolNames : coreBuiltinToolNames;
		const clientToolNameConflicts = findClientToolNameConflicts({
			tools: params.clientTools ?? [],
			existingToolNames: [...clientConflictToolNames, ...AGENT_RESERVED_TOOL_NAMES]
		});
		if (clientToolNameConflicts.length > 0) throw createClientToolNameConflictError(clientToolNameConflicts);
		let clientToolDefs = sourceClientToolDefs.map((definition) => createToolDefinitionFromAgentTool(wrapToolWithAbortSignal(wrapToolDefinition(definition), params.getToolAbortSignal?.())));
		const sideEffectToolOwners = collectSideEffectToolOwners([...params.uncompactedEffectiveTools, ...clientToolDefs], { declaredOwner: (tool) => getPluginToolSideEffectOwnerKey(tool) });
		const search = resolveToolSearchConfig(params.toolSearchRuntimeConfig);
		const clientToolSearch = addClientToolsToToolCatalog({
			tools: clientToolDefs,
			enabled: params.codeModeControlsEnabledForRun || search.enabled && search.mode !== "directory",
			catalogRef: params.toolSearchCatalogRef
		});
		clientToolDefs = clientToolSearch.tools;
		if (clientToolSearch.compacted) {
			emitTrustedDiagnosticEvent({
				type: "tool.catalog",
				source: "client",
				mode: params.codeModeControlsEnabledForRun ? "code-mode" : "tool-search",
				toolCount: clientToolSearch.catalogToolCount
			});
			log$7.debug(params.codeModeControlsEnabledForRun ? `code-mode: cataloged ${clientToolSearch.catalogToolCount} client tools behind exec/wait` : `tool-search: cataloged ${clientToolSearch.catalogToolCount} client tools behind compact prompt surface`);
		}
		const allCustomTools = [...toToolDefinitions(effectiveTools, params.catalogToolHookContext, params.getToolAbortSignal?.()), ...clientToolDefs];
		const sessionToolAllowlist = toSessionToolAllowlist(collectRegisteredToolNames(allCustomTools));
		return {
			allCustomTools,
			builtinToolNames,
			coreBuiltinToolNames,
			clientToolCallSlots,
			clientToolDefs,
			replaySafeToolNames,
			replaySafeTools,
			codeModeExecToolNames,
			sourceReplyCapableToolNames,
			sideEffectToolOwners,
			sessionToolAllowlist,
			trustedLocalMediaToolNames
		};
	};
	const current = buildSurface();
	return {
		...current,
		refreshTools: () => {
			const next = buildSurface();
			const replaceItems = (target, source) => target.splice(0, target.length, ...source);
			replaceItems(current.allCustomTools, next.allCustomTools);
			replaceItems(current.clientToolDefs, next.clientToolDefs);
			replaceItems(current.sessionToolAllowlist, next.sessionToolAllowlist);
			const replaceSet = (target, source) => {
				target.clear();
				for (const item of source) target.add(item);
			};
			for (const key of [
				"builtinToolNames",
				"coreBuiltinToolNames",
				"replaySafeToolNames",
				"codeModeExecToolNames",
				"sourceReplyCapableToolNames",
				"trustedLocalMediaToolNames"
			]) replaceSet(current[key], next[key]);
			replaceSet(current.replaySafeTools, next.replaySafeTools);
			current.sideEffectToolOwners.clear();
			for (const [name, owner] of next.sideEffectToolOwners) current.sideEffectToolOwners.set(name, owner);
		}
	};
}
//#endregion
//#region src/agents/embedded-agent-runner/run/attempt-compaction-thinking.ts
/** Keep summary policy bound to the run's config while rechecking the active model and session level. */
function createAttemptCompactionThinkingResolver(attempt, agentId) {
	return (model, inheritedLevel) => {
		const compat = projectModelThinkingCompat(model.compat);
		const catalog = [{
			provider: model.provider,
			id: model.id,
			api: model.api,
			reasoning: model.reasoning,
			...model.thinkingLevelMap ? { thinkingLevelMap: model.thinkingLevelMap } : {},
			...model.params ? { params: model.params } : {},
			...compat ? { compat } : {}
		}];
		const route = {
			provider: model.provider,
			catalog,
			agentRuntime: "openclaw"
		};
		const level = resolveEmbeddedCompactionThinkingLevel({
			...route,
			config: attempt.config,
			modelId: model.id,
			inheritedLevel,
			compactionThinkingDefault: model.compactionThinkingDefault,
			agentId,
			sessionKey: attempt.sessionKey ?? attempt.sandboxSessionKey
		});
		const providerLevel = resolveProviderThinkingLevel({
			...route,
			model: model.id,
			level
		});
		return mapThinkingLevel(providerLevel);
	};
}
//#endregion
//#region src/agents/embedded-agent-runner/run/attempt-orphan-repair.ts
function findTrailingMessageEntryForOrphanRepair(sessionManager) {
	const visited = /* @__PURE__ */ new Set();
	const trailingEntries = [];
	let entry = sessionManager.getLeafEntry();
	while (entry && isSessionContextMetadataEntry(entry)) {
		if (visited.has(entry.id)) return;
		visited.add(entry.id);
		trailingEntries.push(entry);
		entry = entry.parentId ? sessionManager.getEntry(entry.parentId) : void 0;
	}
	return entry?.type === "message" ? {
		messageEntry: entry,
		trailingEntries: trailingEntries.toReversed()
	} : void 0;
}
async function replayTrailingEntriesForOrphanRepair(sessionManager, trailingEntries) {
	const replayedEntryIds = /* @__PURE__ */ new Map();
	for (const entry of trailingEntries) {
		let replayedId;
		switch (entry.type) {
			case "thinking_level_change":
				replayedId = await sessionManager.appendThinkingLevelChange(entry.thinkingLevel);
				break;
			case "model_change":
				replayedId = await sessionManager.appendModelChange(entry.provider, entry.modelId);
				break;
			case "custom":
				replayedId = await sessionManager.appendCustomEntryAsync(entry.customType, entry.data);
				break;
			case "session_info":
				replayedId = await sessionManager.appendSessionInfoAsync(entry.name ?? "");
				break;
			case "label": {
				const replayedTargetId = replayedEntryIds.get(entry.targetId);
				if (!replayedTargetId && !sessionManager.getEntry(entry.targetId)) continue;
				replayedId = await sessionManager.appendLabelChangeAsync(replayedTargetId ?? entry.targetId, entry.label);
				break;
			}
			default: continue;
		}
		replayedEntryIds.set(entry.id, replayedId);
	}
}
function isUserSessionMessageEntry(entry) {
	return entry.message.role === "user";
}
function resolveOrphanRepairPlan(params) {
	const candidate = findTrailingMessageEntryForOrphanRepair(params.sessionManager);
	if (!candidate || !isUserSessionMessageEntry(candidate.messageEntry)) return;
	const merge = mergeOrphanedTrailingUserPrompt({
		prompt: params.prompt,
		leafMessage: candidate.messageEntry.message
	});
	return {
		contextEnginePrompt: merge.prompt,
		messageEntry: candidate.messageEntry,
		trailingEntries: candidate.trailingEntries,
		removeLeaf: merge.removeLeaf || !params.preserveLeaf
	};
}
//#endregion
//#region src/agents/embedded-agent-runner/run/attempt-permission-prompt.ts
/** Owns permission generations and their initial/continuing prompt admission. */
function installAttemptPermissionPrompt(input) {
	const { activeSession, attempt, prepareSystemPromptUpdate, setActiveSessionSystemPrompt } = input;
	let permissionPreparation;
	const refreshPermissionPrompt = async (prompt, signal, prepareReplay, deferPromptAdmission = false) => {
		const runSignal = signal ? AbortSignal.any([signal, input.runAbortSignal]) : input.runAbortSignal;
		while (true) {
			runSignal.throwIfAborted();
			const preparation = permissionPreparation;
			try {
				const preparationSignal = preparation ? AbortSignal.any([runSignal, preparation.controller.signal]) : runSignal;
				const refresh = preparation ? await raceWithAbortSignal(preparation.prepare(), preparationSignal) : void 0;
				runSignal.throwIfAborted();
				if (preparation !== permissionPreparation) continue;
				let systemPrompt;
				let prepared;
				if (refresh || prepareSystemPromptUpdate) {
					const currentPrompt = prompt ?? activeSession.agent.state.systemPrompt;
					const freshPrompt = refresh ? refresh(currentPrompt) : currentPrompt;
					prepared = prepareSystemPromptUpdate ? await prepareSystemPromptUpdate(freshPrompt, refresh?.freshlyRendered === true) : void 0;
					runSignal.throwIfAborted();
					if (preparation !== permissionPreparation) continue;
					systemPrompt = prepared?.systemPrompt ?? setActiveSessionSystemPrompt(freshPrompt);
				}
				const admitReplay = prepareReplay ? await raceWithAbortSignal(prepareReplay(preparationSignal), preparationSignal) : void 0;
				runSignal.throwIfAborted();
				if (preparation !== permissionPreparation) continue;
				const admit = async (onAdmitted) => {
					const commit = () => {
						preparationSignal.throwIfAborted();
						if (preparation !== permissionPreparation) throw new Error("Session prompt preparation is stale after permission replacement.");
						if (prepared) {
							prepared.commit?.();
							setActiveSessionSystemPrompt(prepared.systemPrompt);
							if (prepared.update) activeSession[agentSessionQueuePromptContext](prepared.update);
						}
					};
					if (admitReplay) await admitReplay(() => onAdmitted(commit));
					else onAdmitted(commit);
				};
				if (prepared && !deferPromptAdmission) {
					await admit((commit) => commit());
					return { systemPrompt };
				}
				return {
					systemPrompt,
					admitReplay: admit
				};
			} catch (error) {
				runSignal.throwIfAborted();
				if (preparation !== permissionPreparation) continue;
				throw error;
			}
		}
	};
	activeSession[agentSessionSetPromptPreparation](async () => {
		const prepared = await refreshPermissionPrompt(void 0, void 0, input.prepareInitialUserTurnReplay, true);
		return async (onAdmitted) => {
			input.runAbortSignal.throwIfAborted();
			if (prepared.admitReplay) await prepared.admitReplay(onAdmitted);
			else onAdmitted();
		};
	});
	const previousPrepareNextTurn = activeSession.agent.prepareNextTurn;
	const prepareNextTurn = async (signal) => {
		if (attempt.pluginRuntimeRefreshPending?.()) return { stop: true };
		const snapshot = await previousPrepareNextTurn?.call(activeSession.agent, signal);
		if (prepareSystemPromptUpdate) return {
			...snapshot,
			prepareContinuation: async (context) => {
				const inherited = await snapshot?.prepareContinuation?.(context);
				const { systemPrompt } = await refreshPermissionPrompt(inherited?.systemPrompt ?? context.systemPrompt, signal);
				if (attempt.model.api === "anthropic-messages") {
					let runtimeContextCleared = false;
					for (let index = context.messages.length - 1; index >= 0; index--) {
						const message = context.messages[index];
						if (message.role === "user") break;
						if (message.role === "toolResult") runtimeContextCleared = true;
						else if (message.role === "custom" && !message.excludeFromContext) {
							if (!isOpenClawSystemUpdateMessage(message)) {
								runtimeContextCleared = true;
								continue;
							}
							const details = asOptionalRecord(message.details);
							if (details?.kind === "runtime-context" && details.turnScoped === true) {
								if (runtimeContextCleared) {
									input.runAbortSignal.throwIfAborted();
									signal?.throwIfAborted();
									activeSession[agentSessionQueuePromptContext]({
										...message,
										timestamp: Date.now()
									});
								}
								break;
							}
						}
					}
				}
				return {
					systemPrompt: systemPrompt ?? inherited?.systemPrompt ?? context.systemPrompt,
					tools: activeSession.agent.state.tools.slice()
				};
			}
		};
		const { systemPrompt: refreshedPrompt } = await refreshPermissionPrompt(snapshot?.context?.systemPrompt, signal);
		return snapshot?.context && refreshedPrompt !== void 0 ? {
			...snapshot,
			context: {
				...snapshot.context,
				systemPrompt: refreshedPrompt,
				tools: activeSession.agent.state.tools.slice()
			}
		} : snapshot;
	};
	activeSession.agent.prepareNextTurn = prepareNextTurn;
	attempt.registerPluginRuntimeRefreshConsumer?.(() => activeSession.agent.prepareNextTurn === prepareNextTurn && activeSession.agent.state.isStreaming && !input.runAbortSignal.aborted);
	return (prepare) => {
		const previous = permissionPreparation;
		permissionPreparation = prepare ? {
			prepare,
			controller: new AbortController()
		} : void 0;
		previous?.controller.abort();
	};
}
//#endregion
//#region src/agents/embedded-agent-runner/run/execution-capacity.ts
const capacityOwner = new AsyncLocalStorage();
/** Keep one task and its owners alive across separately admitted capacity tickets. */
async function withReleasableExecutionCapacity(enqueue, task) {
	let suspended = createDeferredCore();
	let pending;
	let running;
	const owner = {
		active: false,
		outside: async (operation) => {
			if (!owner.active) throw new Error("Execution capacity is not held");
			owner.active = false;
			const continuation = createDeferredCore();
			const context = AsyncLocalStorage.snapshot();
			let resume;
			suspended.resolve({
				run: async () => {
					try {
						const value = await context(operation);
						resume = () => continuation.resolve(value);
					} catch (error) {
						resume = () => continuation.reject(error);
					}
				},
				resume: () => resume(),
				reject: continuation.reject
			});
			return continuation.promise;
		}
	};
	try {
		for (;;) {
			const result = await enqueue(async () => {
				suspended = createDeferredCore();
				owner.active = true;
				running ??= capacityOwner.run(owner, async () => task());
				const resuming = pending;
				pending = void 0;
				resuming?.resume();
				return await Promise.race([running.then((value) => ({
					kind: "complete",
					value
				})), suspended.promise.then((wait) => ({
					kind: "suspended",
					wait
				}))]);
			});
			if (result.kind === "complete") return result.value;
			pending = result.wait;
			await pending.run();
		}
	} catch (error) {
		owner.active = false;
		if (pending) {
			pending.reject(error);
			await running?.catch(() => {});
		} else running?.catch(() => {});
		throw error;
	} finally {
		owner.active = false;
	}
}
/** Suspend only the designated wait; continuation and cleanup reacquire capacity. */
function outsideExecutionCapacity(operation) {
	const owner = capacityOwner.getStore();
	return owner ? owner.outside(operation) : operation();
}
//#endregion
//#region src/agents/embedded-agent-runner/run/attempt-session-projection-recovery.ts
/** Retry one admitted open after its projection rebuild, outside transcript write custody. */
async function openSessionAfterProjectionRecovery(input) {
	input.signal.throwIfAborted();
	try {
		return await input.open();
	} catch (error) {
		if (!isSessionTranscriptProjectionUnavailableError(error) || error.reason !== "rebuilding" || error.sessionId !== input.target.sessionId) throw error;
		input.assertCurrent();
		input.signal.throwIfAborted();
		input.replyOperation?.markWaitingForDeferredMaintenance();
		try {
			await outsideExecutionCapacity(async () => {
				const deadline = new AbortController();
				const recoveryBudgetMs = input.timeoutMs >= 2147e6 ? DEFAULT_AGENT_TIMEOUT_MS : Math.max(1, input.timeoutMs);
				const timer = setTimeout(() => deadline.abort(error), recoveryBudgetMs);
				timer.unref();
				try {
					await recoverSessionTranscriptProjection(input.target, AbortSignal.any([input.signal, deadline.signal]), input.assertCurrent);
				} finally {
					clearTimeout(timer);
				}
			});
		} catch (waitError) {
			input.assertCurrent();
			input.signal.throwIfAborted();
			if (waitError === error || waitError instanceof Error && waitError.name === "AbortError" && waitError.cause === error) throw error;
			throw waitError;
		} finally {
			input.replyOperation?.markDeferredMaintenanceWaitEnded();
		}
		input.assertCurrent();
		input.signal.throwIfAborted();
		return await input.open();
	}
}
//#endregion
//#region src/agents/embedded-agent-runner/run/attempt-user-transcript-context-registry.ts
/** Retains attempt-local runtime-to-transcript pairs across queued user turns. */
function createUserTranscriptContextRegistry() {
	const contexts = [];
	const upsert = (runtimeMessage, transcriptMessage) => {
		const context = {
			runtimeMessage,
			transcriptMessage
		};
		const existingIndex = contexts.findIndex((candidate) => candidate.runtimeMessage === runtimeMessage);
		if (existingIndex === -1) contexts.push(context);
		else contexts[existingIndex] = context;
	};
	return {
		clear: () => {
			contexts.length = 0;
		},
		list: (latestRuntimeMessage, latestTranscriptMessage) => {
			if (latestRuntimeMessage && latestTranscriptMessage) upsert(latestRuntimeMessage, latestTranscriptMessage);
			return contexts;
		},
		record: upsert
	};
}
//#endregion
//#region src/agents/embedded-agent-runner/run/session-context-limits.ts
/** Attempts and recovery must hydrate the same bounded model-context view. */
function resolveEmbeddedSessionContextLimits(contextTokenBudget) {
	return {
		maxBytes: Math.min(67108864, Math.max(1024, (contextTokenBudget ?? 128e3) * 8)),
		maxEvents: 1e4
	};
}
//#endregion
//#region src/agents/embedded-agent-runner/run/tool-activity-heartbeat.ts
async function withEmbeddedAttemptToolActivity(runId, operation) {
	const interval = setInterval(() => notifyToolActivity(runId), 6e4);
	interval.unref?.();
	try {
		notifyToolActivity(runId);
		return await operation();
	} finally {
		clearInterval(interval);
		notifyToolActivity(runId);
	}
}
function wrapEmbeddedAttemptToolWithActivity(tool, runId) {
	const originalExecute = tool.execute;
	const wrappedTool = {
		...tool,
		execute: ((...args) => withEmbeddedAttemptToolActivity(runId, () => originalExecute(...args)))
	};
	copyAgentToolMetadata(tool, wrappedTool, (source) => wrapEmbeddedAttemptToolWithActivity(source, runId));
	const sourcePreparer = getInternalToolExecutionPreparer(tool);
	if (sourcePreparer) attachInternalToolExecutionPreparer(wrappedTool, async (params) => {
		const prepared = await withEmbeddedAttemptToolActivity(runId, () => sourcePreparer(params));
		return prepared.kind === "ready" ? {
			...prepared,
			execute: (start) => withEmbeddedAttemptToolActivity(runId, () => prepared.execute(start))
		} : prepared;
	});
	return wrappedTool;
}
//#endregion
//#region src/agents/embedded-agent-runner/run/tool-loop-recovery.ts
/** Build the embedded-runner's private bridge into agent-core loop recovery. */
function createToolLoopBatchAdmission(ctx) {
	return async ({ calls }) => {
		const canonicalCalls = calls.map((call) => ({
			...call,
			args: call.tool ? normalizeCodeModeExecBeforeHookParams({
				tool: call.tool,
				params: call.args
			}) : call.args
		}));
		try {
			const { commitReadyCalls, releaseSkippedCalls, ...result } = await admitToolCallBatch(canonicalCalls, ctx);
			return attachInternalToolBatchLifecycle(result, {
				commitReadyCalls,
				releaseSkippedCalls,
				observeOutcome(outcome, state) {
					const tool = canonicalCalls.find((call) => call.toolCall.id === outcome.toolCall.id)?.tool;
					return observeRepeatedToolError({
						...outcome,
						args: tool ? normalizeCodeModeExecBeforeHookParams({
							tool,
							params: outcome.args
						}) : outcome.args
					}, state);
				}
			});
		} catch (error) {
			const first = canonicalCalls[0];
			log$7.error(`tool-loop batch admission failed: ${String(error)}`);
			return first ? { intervention: {
				kind: "critical-tool-loop",
				toolCallId: first.toolCall.id,
				toolName: first.toolCall.name,
				actionKey: hashToolCall(first.toolCall.name, first.args),
				detector: "loop_admission_failure",
				count: 1,
				reason: "Tool execution was blocked because loop safety checks failed."
			} } : void 0;
		}
	};
}
/** Ensure calls blocked by later policies cannot leave run-scoped admission markers behind. */
function installToolLoopRecoveryCleanup(params) {
	params.agent.subscribe((event) => {
		if (event.type === "agent_end") clearBatchAdmittedToolCallsForRun(params.runId);
	});
}
//#endregion
//#region src/agents/embedded-agent-runner/run/attempt-session-prepare.ts
async function prepareEmbeddedAttemptAgentSession(input) {
	const { attempt, prepareSystemPromptUpdate } = input;
	const settingsManager = createPreparedEmbeddedAgentSettingsManager({
		sessionId: attempt.sessionId,
		cwd: input.effectiveCwd,
		agentDir: input.agentDir,
		cfg: attempt.config,
		pluginMetadataSnapshot: input.getCurrentAttemptPluginMetadataSnapshot(),
		contextTokenBudget: attempt.contextTokenBudget
	});
	const compactionEnabled = settingsManager.getCompactionEnabled();
	applyAgentAutoCompactionGuard({
		settingsManager,
		contextEngineInfo: input.activeContextEngineInfo,
		compactionMode: resolveEffectiveCompactionMode(attempt.config),
		silentOverflowProneProvider: isSilentOverflowProneModel({
			provider: attempt.provider,
			modelId: attempt.modelId,
			baseUrl: attempt.model.baseUrl ?? void 0
		}),
		compactionForbidden: attempt.operation === "settled-tool-finalization"
	});
	const extensionFactories = buildEmbeddedExtensionFactories({
		cfg: attempt.config,
		sessionManager: input.sessionManager,
		workspaceDir: input.effectiveWorkspace,
		model: attempt.model,
		agentId: input.sessionAgentId,
		sessionId: attempt.sessionId,
		sessionKey: attempt.sessionKey ?? attempt.sandboxSessionKey,
		runId: attempt.runId
	});
	const resourceLoader = new DefaultResourceLoader({
		cwd: input.effectiveCwd,
		agentDir: input.agentDir,
		extensionFactories
	});
	await resourceLoader.reload();
	input.markStage("session-resource-loader");
	const hookRunner = getGlobalHookRunner();
	const preparedClientTools = prepareEmbeddedAttemptClientTools({
		attempt,
		...input.clientToolPreparation
	});
	const { allCustomTools, sessionToolAllowlist, ...clientToolRuntime } = preparedClientTools;
	const { session: activeSession } = await createAgentSession({
		systemPrompt: input.initialSystemPrompt.trim(),
		cwd: input.effectiveCwd,
		modelRegistry: attempt.modelRegistry,
		model: attempt.model,
		thinkingLevel: input.agentCoreThinkingLevel,
		thinkingExplicit: attempt.thinkingExplicit,
		tools: sessionToolAllowlist,
		customTools: allCustomTools,
		sessionManager: input.sessionManager,
		settingsManager,
		resourceLoader,
		resolveDeferredTool: input.clientToolPreparation.deferredDirectoryToolsCallable ? ({ toolCall }) => {
			const toolAbortSignal = input.clientToolPreparation.getToolAbortSignal?.() ?? input.runAbortSignal;
			const tool = resolveToolSearchCatalogTool({
				config: attempt.config,
				runtimeConfig: attempt.config,
				agentId: input.sessionAgentId,
				sessionKey: input.clientToolPreparation.sandboxSessionKey,
				sessionId: attempt.sessionId,
				runId: attempt.runId,
				catalogRef: input.clientToolPreparation.toolSearchCatalogRef,
				abortSignal: toolAbortSignal
			}, toolCall.name);
			const definition = tool ? toToolDefinitions([tool], input.clientToolPreparation.catalogToolHookContext, toolAbortSignal)[0] : void 0;
			const hydratedTool = definition ? wrapToolDefinition(definition) : void 0;
			if (hydratedTool) {
				log$7.info(`tool-search: hydrated deferred directory tool ${toolCall.name}`);
				const originalExecute = hydratedTool.execute;
				hydratedTool.execute = (...args) => withEmbeddedAttemptToolActivity(attempt.runId, () => originalExecute(...args));
			}
			return hydratedTool;
		} : void 0,
		withSessionWriteSettlement: (operation) => input.transcriptLifecycle.withTranscriptWrite(operation),
		cleanupProviderSessionResourcesOnDispose: false,
		contextOverflowRecoveryOwner: attempt.contextTokenBudget === void 0 ? "session" : "caller",
		resolveCompactionThinkingLevel: createAttemptCompactionThinkingResolver(attempt, input.sessionAgentId),
		beforeToolBatch: input.clientToolPreparation.catalogToolHookContext ? createToolLoopBatchAdmission(input.clientToolPreparation.catalogToolHookContext) : void 0
	});
	input.onSessionCreated(activeSession);
	installToolLoopRecoveryCleanup({
		agent: activeSession.agent,
		runId: attempt.runId
	});
	const setActiveSessionSystemPrompt = (nextSystemPrompt) => {
		input.onSystemPromptChanged(nextSystemPrompt);
		activeSession.setBaseSystemPrompt(nextSystemPrompt.trim());
		return nextSystemPrompt;
	};
	const setPermissionPromptPreparation = installAttemptPermissionPrompt({
		activeSession,
		attempt,
		runAbortSignal: input.runAbortSignal,
		setActiveSessionSystemPrompt,
		prepareInitialUserTurnReplay: input.prepareInitialUserTurnReplay,
		prepareSystemPromptUpdate
	});
	input.onSystemPromptChanged(input.initialSystemPrompt);
	let didDeliverSourceReplyViaMessageTool = false;
	const markSourceReplyDelivered = () => {
		didDeliverSourceReplyViaMessageTool = true;
	};
	installMessageToolTerminalHook({
		agent: activeSession.agent,
		sourceReplyDeliveryMode: attempt.sourceReplyDeliveryMode,
		onDeliveredSourceReply: markSourceReplyDelivered,
		config: attempt.config,
		currentProvider: attempt.messageChannel ?? attempt.messageProvider,
		currentAccountId: attempt.agentAccountId,
		currentChannelId: attempt.currentChannelId,
		currentMessagingTarget: attempt.currentMessagingTarget,
		currentThreadId: attempt.currentThreadTs,
		currentMessageId: attempt.currentMessageId,
		replyToMode: attempt.replyToMode,
		hasRepliedRef: attempt.hasRepliedRef,
		sessionKey: attempt.sessionKey
	});
	input.markStage("agent-session");
	return {
		activeSession,
		compactionEnabled,
		allCustomTools,
		...clientToolRuntime,
		hasDeliveredSourceReply: () => didDeliverSourceReplyViaMessageTool,
		hookRunner,
		markSourceReplyDelivered,
		setActiveSessionSystemPrompt,
		settingsManager,
		refreshTools: () => {
			const currentPrompt = activeSession.agent.state.systemPrompt;
			preparedClientTools.refreshTools();
			activeSession.replaceCustomTools(allCustomTools, sessionToolAllowlist);
			setActiveSessionSystemPrompt(currentPrompt);
		},
		setPermissionPromptPreparation
	};
}
async function prepareEmbeddedAttemptSessionBoundary(input) {
	const { activeSession, attempt, isRawModelRun, sessionManager } = input;
	setSteeringRuntimeContextRetention(activeSession, input.appendOnlyRuntimeContext === true);
	const preserveExactPrompt = isRawModelRun || attempt.operation === "settled-tool-finalization";
	if (isRawModelRun) {
		activeSession.agent.reset();
		input.setActiveSessionSystemPrompt("");
	}
	let repairedTarget;
	const orphanRepair = preserveExactPrompt ? void 0 : await withSessionManagerAppend(sessionManager, async () => {
		input.abortSignal?.throwIfAborted();
		const target = sessionManager.getSessionTarget();
		const reader = target && getOwnedSessionTranscriptReader(target);
		reader?.assertCurrent();
		if (reader && reconcilePrePersistedCurrentUserTurn({
			activeSession,
			currentUserTurnMessage: attempt.skipPreparedUserTurnMessage ? void 0 : attempt.userTurnTranscriptRecorder?.getPersistedMessage?.() ?? input.preparedUserTurnMessage,
			durableUserTurnMessage: void 0,
			userTurnAlreadyPersisted: attempt.userTurnTranscriptRecorder?.hasPersisted() === true
		})) return;
		await sessionManager.reloadPersistedTranscriptAsync(input.abortSignal);
		input.abortSignal?.throwIfAborted();
		const candidate = resolveOrphanRepairPlan({
			sessionManager,
			prompt: attempt.prompt,
			preserveLeaf: attempt.skipPreparedUserTurnMessage === true || isMainSessionRestartRecoveryInputProvenance(attempt.inputProvenance)
		});
		const currentUserTurnMessage = attempt.skipPreparedUserTurnMessage ? void 0 : attempt.userTurnTranscriptRecorder?.getPersistedMessage?.() ?? input.preparedUserTurnMessage;
		const reconciledCurrentUser = reconcilePrePersistedCurrentUserTurn({
			activeSession,
			currentUserTurnMessage,
			durableUserTurnMessage: candidate?.messageEntry.message,
			userTurnAlreadyPersisted: attempt.userTurnTranscriptRecorder?.hasPersisted() === true
		});
		const orphanProvenance = normalizeInputProvenance(candidate?.messageEntry.message.provenance);
		const preserveUnansweredUser = shouldPreserveUserFacingSessionStateForInputProvenance(attempt.inputProvenance) && (!orphanProvenance || orphanProvenance.kind === "external_user");
		if (reconciledCurrentUser || preserveUnansweredUser) return;
		if (candidate?.removeLeaf) {
			if (candidate.messageEntry.parentId) await sessionManager.branchAsync(candidate.messageEntry.parentId);
			else await sessionManager.resetLeafAsync();
			repairedTarget = sessionManager.getSessionTarget();
			if (repairedTarget) await sessionManager.appendLeafControlAsync({
				targetId: sessionManager.getLeafId(),
				appendParentId: sessionManager.getAppendParentId()
			});
			await replayTrailingEntriesForOrphanRepair(sessionManager, candidate.trailingEntries);
		}
		return candidate;
	});
	if (orphanRepair?.removeLeaf) {
		if (repairedTarget) {
			const { waitForSessionTranscriptProjection } = await import("./config/sessions/session-transcript-reconcile.js");
			await waitForSessionTranscriptProjection(repairedTarget, input.abortSignal);
			input.abortSignal?.throwIfAborted();
		}
		sessionManager.setNextUserMessagePersistence?.("normal");
		attempt.onUserMessagePersistenceInvalidated?.();
	}
	if (orphanRepair) {
		const repairedMessages = sanitizeCompactionReplayMessages(sessionManager.buildSessionContext().messages);
		activeSession.agent.state.messages = orphanRepair.removeLeaf ? repairedMessages : repairedMessages.slice(0, -1);
	}
	const boundaryTimezone = preserveExactPrompt ? void 0 : resolveUserTimezone(attempt.config?.agents?.defaults?.userTimezone);
	let currentUserTimestampOverride;
	const buildBoundaryOptions = () => {
		if (preserveExactPrompt) return {
			appendOnlyRuntimeContext: input.appendOnlyRuntimeContext,
			inHistorySystemUpdates: input.inHistorySystemUpdates,
			projectPersistedSenderContext: false
		};
		const userTranscriptContexts = input.getUserTranscriptContexts();
		return {
			sessionVersion: sessionManager.getHeader()?.version,
			appendOnlyRuntimeContext: input.appendOnlyRuntimeContext,
			inHistorySystemUpdates: input.inHistorySystemUpdates,
			...boundaryTimezone ? { timezone: boundaryTimezone } : {},
			...userTranscriptContexts?.length ? { userTranscriptContexts } : {},
			...currentUserTimestampOverride ? { currentUserTimestampOverride } : {}
		};
	};
	const baseConvertToLlm = activeSession.agent.convertToLlm.bind(activeSession.agent);
	activeSession.agent.convertToLlm = async (messages) => {
		let removedRuntimeContext;
		const normalized = normalizeMessagesForLlmBoundary(messages, {
			...buildBoundaryOptions(),
			onRuntimeContextCarrierRemoved: (removed) => {
				removedRuntimeContext = removed;
			}
		});
		const converted = await baseConvertToLlm(input.appendOnlyRuntimeContext ? normalized : relocateCurrentRuntimeContextCarrierToTail(normalized));
		applyRuntimeContextCarrierRetention(converted, input.appendOnlyRuntimeContext);
		if (!input.appendOnlyRuntimeContext && recordRuntimeContextProjection(attempt.sessionId, removedRuntimeContext, converted)) declarePromptHistoryRewrite({
			...attempt,
			reason: "runtimeContextCarrier"
		});
		return converted;
	};
	return {
		getUserTranscriptContexts: input.getUserTranscriptContexts,
		boundaryTimezone,
		includeBoundaryTimestamp: !preserveExactPrompt,
		orphanRepair,
		setCurrentUserTimestampOverride: (override) => {
			currentUserTimestampOverride = override;
		}
	};
}
async function prepareEmbeddedAttemptSessionManager(input) {
	const { attempt } = input;
	const transcriptStateParams = {
		sessionManager: attempt.sessionManager,
		agentId: input.sessionAgentId,
		config: attempt.config,
		sessionFile: attempt.sessionFile,
		sessionId: attempt.sessionId,
		sessionKey: attempt.sessionKey,
		sessionTarget: attempt.sessionTarget
	};
	let transcriptState = attempt.sessionManager ? await resolveExistingAttemptTranscriptState(transcriptStateParams) : void 0;
	const apiKey = attempt.model.api === "anthropic-messages" && isDirectAnthropicModel(attempt.model) && supportsClaudeInHistorySystemMessages(attempt.model) ? await resolveEmbeddedAgentApiKey(attempt) : void 0;
	const transcriptPolicy = resolveAttemptTranscriptPolicy({
		runtimePlan: attempt.runtimePlan,
		runtimePlanModelContext: {
			workspaceDir: input.effectiveWorkspace,
			modelApi: attempt.model.api,
			model: attempt.model,
			directApiKey: Boolean(apiKey) && !isAnthropicOAuthApiKey(apiKey)
		},
		provider: attempt.provider,
		modelId: attempt.modelId,
		config: attempt.config,
		env: process.env
	});
	const isOpenAIResponsesApi = attempt.model.api === "openai-responses" || attempt.model.api === "azure-openai-responses" || attempt.model.api === "openai-chatgpt-responses";
	const preparedUserTurnMessage = attempt.skipPreparedUserTurnMessage ? void 0 : await attempt.userTurnTranscriptRecorder?.resolveMessage();
	let latestPersistedUserMessage;
	let latestRuntimeUserMessage;
	let latestUserTurnTranscriptRecorder = attempt.userTurnTranscriptRecorder;
	const userTranscriptContextRegistry = createUserTranscriptContextRegistry();
	let publishedSessionManager;
	let initialReplay;
	let messagePresence;
	const openSignal = attempt.abortSignal ? AbortSignal.any([attempt.abortSignal, input.runAbortSignal]) : input.runAbortSignal;
	const openSessionManager = (target) => input.withOwnedTranscriptWrite(async () => {
		const limits = resolveEmbeddedSessionContextLimits(attempt.contextTokenBudget);
		const initial = prepareInitialPersistedUserTurnCohort({
			target,
			message: preparedUserTurnMessage,
			recorder: attempt.userTurnTranscriptRecorder,
			runId: attempt.runId
		});
		if (initial || getOwnedSessionTranscriptReader(target)) {
			const manager = await SessionManager[sessionManagerOpenTranscriptCohort](target, {
				...limits,
				cwd: input.effectiveCwd,
				signal: openSignal
			}, initial?.selection ?? {
				sessionKey: target.sessionKey,
				entryIds: [],
				includeMessagePresence: true
			}, (opened, prepared, assertView) => {
				try {
					initial?.consume(opened, prepared, assertView);
					messagePresence = prepared.kind === "bounded" ? prepared.transcript?.messagePresence : void 0;
				} finally {
					publishedSessionManager = opened;
					input.onSessionManagerCreated(opened);
				}
			});
			initialReplay = initial?.readInitial();
			return manager;
		}
		return SessionManager.openAsync(target, input.effectiveCwd, limits, openSignal);
	});
	const sessionTarget = attempt.sessionTarget;
	const openedSessionManager = !attempt.sessionManager && sessionTarget ? await openSessionAfterProjectionRecovery({
		open: () => openSessionManager(sessionTarget),
		target: sessionTarget,
		timeoutMs: attempt.timeoutMs,
		signal: openSignal,
		assertCurrent: input.assertCurrent,
		replyOperation: attempt.replyOperation
	}) : void 0;
	const unguardedSessionManager = attempt.sessionManager ?? openedSessionManager ?? SessionManager.inMemory(input.effectiveCwd);
	if (publishedSessionManager !== unguardedSessionManager) input.onSessionManagerCreated(unguardedSessionManager);
	transcriptState ??= messagePresence === void 0 ? await resolveExistingAttemptTranscriptState(transcriptStateParams) : { hasBootstrapTranscriptState: messagePresence };
	const preparedReplay = await input.withOwnedTranscriptWrite(() => preparePersistedCurrentUserTurn({
		sessionManager: unguardedSessionManager,
		message: preparedUserTurnMessage,
		recorder: attempt.userTurnTranscriptRecorder,
		runId: attempt.runId,
		signal: attempt.abortSignal,
		initial: initialReplay
	}));
	const prepareInitialUserTurnReplay = preparedReplay && (async (signal) => {
		const consume = await input.withOwnedTranscriptWrite(() => preparedReplay(signal));
		return consume && ((onAdmitted) => input.withOwnedTranscriptWrite(() => consume(onAdmitted)));
	});
	const sessionManager = guardSessionManager(unguardedSessionManager, {
		agentId: input.sessionAgentId,
		runId: attempt.runId,
		sessionKey: attempt.sessionKey,
		config: attempt.config,
		contextWindowTokens: attempt.contextTokenBudget,
		inputProvenance: attempt.inputProvenance,
		preparedUserTurnMessage,
		preparedUserTurnTranscriptRecorder: preparedUserTurnMessage ? attempt.userTurnTranscriptRecorder : void 0,
		allowSyntheticToolResults: transcriptPolicy.allowSyntheticToolResults,
		missingToolResultText: isOpenAIResponsesApi ? "aborted" : void 0,
		allowedToolNames: input.replayAllowedToolNames,
		trigger: attempt.trigger,
		suppressNextUserMessagePersistence: prepareInitialUserTurnReplay !== void 0 || attempt.suppressNextUserMessagePersistence,
		suppressTranscriptOnlyAssistantPersistence: attempt.suppressTranscriptOnlyAssistantPersistence,
		assistantErrorTranscript: attempt.assistantErrorTranscript,
		skipBeforeMessageWriteHooks: attempt.operation === "settled-tool-finalization",
		prepareAssistantTranscriptMessage: attempt.prepareAssistantTranscriptMessage,
		onUserMessagePreparingForPersistence: (_message, recorder) => {
			latestPersistedUserMessage = void 0;
			latestUserTurnTranscriptRecorder = recorder;
		},
		onUserMessagePersisted: (message, runtimeMessage) => {
			latestPersistedUserMessage = message;
			latestRuntimeUserMessage = runtimeMessage;
			if (runtimeMessage) {
				const media = readPersistedMediaFacts(message);
				if (media?.length) attachRuntimePromptMediaFacts(runtimeMessage, applyRunHydrationSuppression(media, attempt.media));
				userTranscriptContextRegistry.record(runtimeMessage, message);
			}
			attempt.onUserMessagePersisted?.(message);
		},
		onUserMessagePersistenceSuppressed: (message, runtimeMessage) => {
			latestRuntimeUserMessage = runtimeMessage;
			const media = runtimeMessage ? readPersistedMediaFacts(message) : void 0;
			if (runtimeMessage && media?.length) attachRuntimePromptMediaFacts(runtimeMessage, applyRunHydrationSuppression(media, attempt.media));
			if (prepareInitialUserTurnReplay !== void 0 && !attempt.suppressNextUserMessagePersistence && attempt.userTurnTranscriptRecorder?.hasPersisted() === true) attempt.onUserMessagePersisted?.(message);
		},
		onUserMessageBlocked: () => {
			attempt.userTurnTranscriptRecorder?.markBlocked();
		}
	});
	attempt.promptCacheKey = resolveSessionBoundaryPromptCacheKey({
		api: attempt.model.api,
		boundaryCount: sessionManager.getBoundaryCount(),
		promptCacheKey: attempt.promptCacheKey,
		sessionId: attempt.sessionPersistence === "detached" && attempt.sessionManager && !attempt.sessionManager.getSessionTarget() ? attempt.sessionManager.getSessionId() : attempt.sessionId
	});
	await input.withOwnedTranscriptWrite(async () => {
		await bootstrapHarnessContextEngine({
			admittedRunContext: attempt.admittedRunContext,
			hadSessionFile: transcriptState.hasBootstrapTranscriptState,
			contextEngine: input.activeContextEngine,
			sessionId: attempt.sessionId,
			sessionKey: attempt.sessionKey,
			sessionTarget: attempt.sessionTarget,
			sessionFile: attempt.sessionFile,
			sessionManager,
			transcriptReadFence: attempt.userTurnTranscriptRecorder?.getAdmissionReceipt(),
			runtimeContext: buildAfterTurnRuntimeContext({
				attempt,
				workspaceDir: input.effectiveWorkspace,
				cwd: input.effectiveCwd,
				agentDir: input.agentDir,
				tokenBudget: attempt.contextTokenBudget,
				activeAgentId: input.sessionAgentId,
				contextEnginePluginId: input.resolveActiveContextEnginePluginId()
			}),
			contextEngineHostSupport: OPENCLAW_EMBEDDED_CONTEXT_ENGINE_HOST,
			providerId: attempt.provider,
			requestedModelId: attempt.requestedModelId,
			modelId: attempt.modelId,
			fallbackReason: attempt.fallbackReason,
			degradedReason: attempt.degradedReason,
			runMaintenance: async (contextParams) => await runContextEngineMaintenance({
				...contextParams,
				sessionManager: contextParams.sessionManager,
				config: attempt.config,
				agentId: input.sessionAgentId,
				contextEngineAgentId: attempt.contextEngineAgentId
			}),
			warn: (message) => log$7.warn(message)
		});
	});
	latestPersistedUserMessage = void 0;
	latestRuntimeUserMessage = void 0;
	userTranscriptContextRegistry.clear();
	return {
		prepareInitialUserTurnReplay,
		userMessageBoundary: {
			getUserTranscriptContexts: () => {
				const transcriptMessage = latestPersistedUserMessage ?? latestUserTurnTranscriptRecorder?.getPersistedMessage?.();
				const runtimeMessage = latestRuntimeUserMessage ?? (attempt.suppressNextUserMessagePersistence ? transcriptMessage : void 0);
				return userTranscriptContextRegistry.list(runtimeMessage, transcriptMessage);
			},
			preparedUserTurnMessage
		},
		isOpenAIResponsesApi,
		preparedUserTurnMessage,
		sessionManager,
		transcriptPolicy
	};
}
//#endregion
//#region src/agents/exec-auto-review-transcript.ts
const DEFAULT_LIMITS = {
	userAssistantChars: 4e3,
	toolChars: 1e3,
	nonUserEntries: 40,
	totalChars: 24e3
};
const OMITTED_FIELD = /^(?:details|media|(?:input_|output_)?(?:images?|image_url|audio|video)|(?:input_|output_)(?:file|document)|(?:image|audio|video|file|document)[_-]?(?:base64|bytes|data)|inline[_-]?data|base64|b64_json|blob|buffer|bytes|(?:source)?session[_-]?key|(?:origin)?session[_-]?id|(?:sender|peer|profile)[_-]?id)$/i;
function omitPayloads(key, value) {
	if (OMITTED_FIELD.test(key)) return;
	if (typeof value === "string" && /^data:[^\s,]*,/i.test(value.trimStart())) return "[media omitted]";
	const record = asOptionalRecord(value);
	return record && (/^(?:(?:input_|output_)?(?:image|image_url|audio|video|file|document)|media|base64|buffer)$/i.test(String(record.type)) || record.encoding === "base64" || [
		"mimeType",
		"mime_type",
		"mediaType",
		"media_type",
		"contentType",
		"content_type"
	].some((field) => typeof record[field] === "string") && (record.data !== void 0 || record.content !== void 0)) ? void 0 : value;
}
function textOnly(value) {
	let text = value;
	if (/^\s*[[{]/.test(text)) try {
		text = JSON.stringify(JSON.parse(text), omitPayloads) ?? "[media omitted]";
	} catch {}
	return text.replace(/\bdata:[^\s,]*,[^\s"'<>]*/gi, "[media omitted]");
}
function userOrigin(message) {
	const provenance = normalizeInputProvenance(Reflect.get(message, "provenance"));
	if (provenance?.kind === "inter_session" || provenance?.kind === "internal_system") return provenance.kind;
	const metadata = asOptionalRecord(Reflect.get(message, "__openclaw"));
	const identity = readTranscriptSenderIdentity(metadata?.senderIdentity);
	if (metadata?.senderIsOwner === true || identity?.type === "profile") return "operator";
	return identity?.type === "observation" ? "channel" : "unknown";
}
/** Projects current live messages into bounded reviewer evidence. */
function buildExecAutoReviewTranscript(params) {
	const limit = (key, minimum = 0) => {
		const value = params.limits?.[key];
		return value === void 0 || !Number.isFinite(value) ? DEFAULT_LIMITS[key] : Math.max(minimum, Math.min(DEFAULT_LIMITS[key], Math.floor(value)));
	};
	const limits = {
		userAssistantChars: limit("userAssistantChars"),
		toolChars: limit("toolChars"),
		nonUserEntries: limit("nonUserEntries"),
		totalChars: limit("totalChars", 256)
	};
	const messages = params.messages.map((message) => message.role === "user" ? params.userTurnOrigins?.get(message) ?? message : message);
	const identifiers = /* @__PURE__ */ new Set();
	for (const message of messages) {
		if (message.role !== "user") continue;
		const metadata = asOptionalRecord(Reflect.get(message, "__openclaw"));
		const identity = readTranscriptSenderIdentity(metadata?.senderIdentity);
		const provenance = normalizeInputProvenance(Reflect.get(message, "provenance"));
		for (const identifier of [
			metadata?.senderId,
			identity?.id,
			provenance?.sourceSessionKey,
			provenance?.originSessionId
		]) if (typeof identifier === "string" && identifier) {
			identifiers.add(identifier);
			identifiers.add(JSON.stringify(identifier).slice(1, -1));
		}
	}
	const privateIdentifiers = [...identifiers].toSorted((a, b) => b.length - a.length);
	const scrubIdentifiers = (text) => privateIdentifiers.reduce((result, identifier) => result.replaceAll(identifier, "[identity omitted]"), text);
	const entries = [];
	const toolIds = /* @__PURE__ */ new Map();
	const add = (entry) => {
		const cap = entry.kind === "user" || entry.kind === "assistant" ? limits.userAssistantChars : limits.toolChars;
		const text = scrubIdentifiers(textOnly(entry.text));
		if (entry.toolCallId) {
			let alias = toolIds.get(entry.toolCallId);
			if (!alias) {
				alias = `tool-${toolIds.size + 1}`;
				toolIds.set(entry.toolCallId, alias);
			}
			entry.toolCallId = alias;
		}
		const toolName = entry.toolName && scrubIdentifiers(entry.toolName);
		entries.push({
			...entry,
			text: truncateUtf16Safe(text, cap),
			...toolName === void 0 ? {} : { toolName: truncateUtf16Safe(toolName, 256) },
			...text.length > cap || (toolName?.length ?? 0) > 256 ? { truncated: true } : {}
		});
	};
	for (const source of messages) {
		const message = sanitizeTranscriptMessage(source);
		if (message.role === "user" || message.role === "toolResult") {
			const text = typeof message.content === "string" ? message.content : message.content.flatMap((block) => block.type === "text" ? [textOnly(block.text)] : []).join("\n");
			if (text) add(message.role === "user" ? {
				kind: "user",
				text,
				origin: userOrigin(source)
			} : {
				kind: "tool_result",
				text,
				toolName: message.toolName,
				toolCallId: message.toolCallId
			});
		} else if (message.role === "assistant") {
			for (const block of message.content) if (block.type === "text" && block.text) add({
				kind: "assistant",
				text: block.text
			});
			else if (block.type === "toolCall") add({
				kind: "tool_call",
				text: JSON.stringify(block.arguments, omitPayloads) ?? "[media omitted]",
				toolName: block.name,
				toolCallId: block.id
			});
		}
	}
	const envelopeChars = estimateStringChars(JSON.stringify({
		entries: [],
		omittedEntries: entries.length,
		truncated: false
	}));
	const budget = Math.max(0, limits.totalChars - envelopeChars);
	const candidates = entries.map((entry) => ({
		entry,
		cost: estimateStringChars(JSON.stringify(entry)) + 1
	}));
	const selected = /* @__PURE__ */ new Set();
	let used = 0;
	let nonUsers = 0;
	const anchors = [.../* @__PURE__ */ new Set([candidates.find(({ entry }) => entry.kind === "user"), candidates.findLast(({ entry }) => entry.kind === "user")])].filter((candidate) => candidate !== void 0);
	for (const candidate of anchors) {
		const { entry } = candidate;
		const allowance = Math.floor(budget / anchors.length);
		if (candidate.cost > allowance) {
			const original = entry.text;
			entry.truncated = true;
			let low = 0;
			let high = original.length;
			while (low < high) {
				const mid = Math.ceil((low + high) / 2);
				entry.text = truncateUtf16Safe(original, mid);
				if (estimateStringChars(JSON.stringify(entry)) + 1 <= allowance) low = mid;
				else high = mid - 1;
			}
			entry.text = truncateUtf16Safe(original, low);
			candidate.cost = estimateStringChars(JSON.stringify(entry)) + 1;
		}
		selected.add(candidate);
		used += candidate.cost;
	}
	const pendingCalls = /* @__PURE__ */ new Map();
	const pairs = /* @__PURE__ */ new Map();
	for (const candidate of candidates) {
		const { entry } = candidate;
		if (entry.toolCallId && entry.kind === "tool_call") pendingCalls.set(entry.toolCallId, candidate);
		else if (entry.toolCallId && entry.kind === "tool_result") {
			const call = pendingCalls.get(entry.toolCallId);
			if (call !== void 0) {
				pairs.set(candidate, call);
				pairs.set(call, candidate);
				pendingCalls.delete(entry.toolCallId);
			}
		}
	}
	const visited = /* @__PURE__ */ new Set();
	for (const candidate of candidates.toReversed()) {
		if (selected.has(candidate) || visited.has(candidate)) continue;
		const pair = pairs.get(candidate);
		const group = pair === void 0 ? [candidate] : [candidate, pair];
		group.forEach((member) => visited.add(member));
		const nonUserCount = group.filter(({ entry }) => entry.kind !== "user").length;
		const cost = group.reduce((sum, member) => sum + member.cost, 0);
		if (used + cost > budget || nonUsers + nonUserCount > limits.nonUserEntries) continue;
		group.forEach((member) => selected.add(member));
		used += cost;
		nonUsers += nonUserCount;
	}
	const retained = candidates.filter((candidate) => selected.has(candidate)).map(({ entry }) => entry);
	const omittedEntries = entries.length - retained.length;
	return {
		entries: retained,
		omittedEntries,
		truncated: omittedEntries > 0 || retained.some((entry) => entry.truncated === true)
	};
}
//#endregion
//#region src/agents/embedded-agent-runner/run/attempt-session-settle.ts
function createEmbeddedAttemptSessionSettleTracker(activeSession) {
	const inFlight = /* @__PURE__ */ new Set();
	let abortCleanupFailed = false;
	const recordAbortCleanupFailure = () => {
		if (abortCleanupFailed) recordAgentCleanupFailure();
	};
	const trackSettlePromise = (promise) => {
		inFlight.add(promise);
		const settled = () => {
			inFlight.delete(promise);
		};
		promise.then(settled, settled);
		return promise;
	};
	return {
		abortActiveSession: (reason) => trackSettlePromise(Promise.resolve(activeSession.abort(reason)).catch((error) => {
			abortCleanupFailed = true;
			throw error;
		})),
		buildAbortSettlePromise: () => {
			recordAbortCleanupFailure();
			return inFlight.size === 0 ? null : Promise.allSettled(inFlight).then(recordAbortCleanupFailure);
		},
		trackPromptSettlePromise: trackSettlePromise
	};
}
/** Keep retained review callbacks outside the attempt's tool-execution closure scope. */
function createEmbeddedAttemptSessionResources(signal) {
	const resources = {
		trajectoryRecorder: null,
		buildAbortSettlePromise: () => null
	};
	let live = resources;
	return {
		resources,
		reviewTranscript: () => {
			if (!live?.session || signal.aborted) return;
			return buildExecAutoReviewTranscript({
				messages: live.session.messages,
				userTurnOrigins: new Map(live.getUserTranscriptContexts?.()?.map(({ runtimeMessage, transcriptMessage }) => [runtimeMessage, transcriptMessage]))
			});
		},
		releaseReview: () => {
			live = void 0;
		}
	};
}
async function cleanupEmbeddedAttemptSessionPhase(input) {
	try {
		var _usingCtx$1 = _usingCtx();
		_usingCtx$1.u(input.promptStateLease);
		const { attempt } = input;
		const initialState = projectAgentRunAttemptTerminal(input.state.terminal);
		if (input.trajectoryRecorder && !input.trajectoryEndRecorded) {
			const sessionEndData = {
				status: initialState.promptError ? "error" : initialState.aborted || initialState.timedOut ? "interrupted" : "cleanup",
				aborted: initialState.aborted,
				externalAbort: initialState.externalAbort,
				timedOut: initialState.timedOut,
				idleTimedOut: initialState.idleTimedOut,
				timedOutDuringCompaction: initialState.timedOutDuringCompaction,
				timedOutDuringToolExecution: initialState.timedOutDuringToolExecution,
				timedOutByRunBudget: initialState.timedOutByRunBudget,
				promptError: initialState.promptError ? formatErrorMessage(initialState.promptError) : void 0
			};
			if (input.deferredLifecycleOwner) input.deferredLifecycleOwner.recordSessionEnd(sessionEndData);
			else input.trajectoryRecorder.recordEvent("session.ended", sessionEndData);
		}
		if (!input.deferredLifecycleOwner || input.state.terminal.kind !== "ok" || input.state.terminal.settlementWarning || attempt.abortSignal?.aborted || input.state.beforeAgentRunBlockedBy !== void 0) await flushEmbeddedAttemptTrajectoryRecorder({
			runId: attempt.runId,
			sessionId: attempt.sessionId,
			log: log$7,
			trajectoryRecorder: input.trajectoryRecorder
		});
		let cleanupError;
		try {
			clearToolSearchCatalog({ catalogRef: input.toolSearchCatalogRef });
			await input.transcriptLifecycle.beginCleanup();
			const cleanupState = projectAgentRunAttemptTerminal(input.state.terminal);
			const cleanupAborted = Boolean(attempt.abortSignal?.aborted) || cleanupState.aborted || cleanupState.timedOut || cleanupState.idleTimedOut || cleanupState.timedOutDuringCompaction;
			const cleanupAbortLike = cleanupAborted || initialState.cleanupYieldAborted;
			await cleanupEmbeddedAttemptResources({
				...input,
				sessionManager: input.sessionManager,
				flushPendingToolResultsAfterIdle,
				aborted: cleanupAbortLike,
				abortSignal: attempt.abortSignal,
				abortSettlePromise: cleanupAborted ? input.buildAbortSettlePromise() : null,
				runId: attempt.runId,
				sessionId: attempt.sessionId
			});
		} catch (err) {
			recordAgentCleanupFailure();
			cleanupError = err;
		} finally {
			try {
				await input.transcriptLifecycle.dispose();
			} catch (err) {
				recordAgentCleanupFailure();
				cleanupError ??= err;
			}
		}
		const finalState = projectAgentRunAttemptTerminal(input.state.terminal);
		const beforeAgentRunBlocked = input.state.beforeAgentRunBlockedBy !== void 0;
		const diagnosticTerminalAborted = finalState.aborted || finalState.timedOut || finalState.idleTimedOut;
		input.emitDiagnosticRunCompleted?.(cleanupError ? "error" : beforeAgentRunBlocked ? "blocked" : finalState.promptError ? "error" : diagnosticTerminalAborted ? "aborted" : "completed", cleanupError ?? finalState.promptError, beforeAgentRunBlocked ? { blockedBy: input.state.beforeAgentRunBlockedBy } : input.state.diagnosticFinalResponse ? { finalResponse: input.state.diagnosticFinalResponse } : void 0);
		if (cleanupError) await Promise.reject(toErrorObject(cleanupError, "Non-Error rejection"));
	} catch (_) {
		_usingCtx$1.e = _;
	} finally {
		_usingCtx$1.d();
	}
}
//#endregion
//#region src/agents/embedded-agent-runner/run/attempt-trajectory.ts
async function prepareEmbeddedAttemptTrajectory(input) {
	const { activeSession, attempt } = input;
	const candidate = input.transcriptOwner?.sessionTarget;
	const sessionKey = candidate?.sessionKey;
	const assertCommitAllowed = input.transcriptOwner?.assertCommitAllowed;
	const initialWriter = input.transcriptOwner?.initialWriter;
	const retained = candidate && sessionKey && assertCommitAllowed && candidate.agentId === input.sessionAgentId && candidate.sessionId === activeSession.sessionId && sessionKey === attempt.sessionKey && candidate.storePath && candidate.storePath === attempt.sessionTarget?.storePath ? {
		sessionKey,
		assertCurrent() {
			assertCommitAllowed();
			initialWriter?.assertActive();
		}
	} : void 0;
	retained?.assertCurrent();
	const trajectorySessionFile = retained ? retained.sessionKey : await resolveAttemptTrajectorySessionFile({
		agentId: input.sessionAgentId,
		config: attempt.config,
		sessionFile: attempt.sessionFile,
		sessionId: activeSession.sessionId,
		sessionKey: attempt.sessionKey,
		sessionTarget: attempt.sessionTarget
	});
	if (attempt.disableTrajectory || attempt.sessionPersistence === "detached") return null;
	const assertActive = resolveAdmittedRunActiveAssertion(attempt.admittedRunContext, attempt.abortSignal);
	if (!assertActive) throw new Error("trajectory preparation requires an active admitted run");
	assertActive();
	retained?.assertCurrent();
	const { sessionTarget } = projectTrajectorySessionTarget(attempt.sessionTarget);
	const recorder = await createTrajectoryRuntimeRecorder({
		cfg: attempt.config,
		env: process.env,
		runId: attempt.runId,
		sessionId: activeSession.sessionId,
		sessionKey: attempt.sessionKey,
		sessionFile: trajectorySessionFile,
		sessionTarget,
		provider: attempt.provider,
		modelId: attempt.modelId,
		modelApi: attempt.model.api,
		workspaceDir: attempt.workspaceDir
	});
	assertActive();
	retained?.assertCurrent();
	recorder?.recordEvent("session.started", {
		trigger: attempt.trigger,
		sessionFile: attempt.sessionFile,
		workspaceDir: input.effectiveWorkspace,
		agentId: input.sessionAgentId,
		messageProvider: attempt.messageProvider,
		messageChannel: attempt.messageChannel,
		localModelLean: input.localModelLeanEnabled,
		toolCount: input.effectiveToolCount,
		clientToolCount: input.clientToolCount
	});
	const fastMode = typeof attempt.fastMode === "boolean" ? attempt.fastMode : void 0;
	recorder?.recordEvent("trace.metadata", buildTrajectoryRunMetadata({
		env: process.env,
		config: attempt.config,
		...attempt.preparedModelRuntime?.metadataSnapshot ? { pluginMetadataSnapshot: attempt.preparedModelRuntime.metadataSnapshot } : {},
		workspaceDir: input.effectiveWorkspace,
		sessionFile: attempt.sessionFile,
		sessionKey: attempt.sessionKey,
		agentId: input.sessionAgentId,
		trigger: attempt.trigger,
		messageProvider: attempt.messageProvider,
		messageChannel: attempt.messageChannel,
		provider: attempt.provider,
		modelId: attempt.modelId,
		modelApi: attempt.model.api,
		timeoutMs: attempt.timeoutMs,
		fastMode,
		thinkLevel: attempt.thinkLevel,
		reasoningLevel: attempt.reasoningLevel,
		toolResultFormat: attempt.toolResultFormat,
		disableTools: attempt.disableTools,
		toolsAllow: attempt.toolsAllow,
		skillsSnapshot: attempt.skillsSnapshot,
		systemPromptReport: input.systemPromptReport
	}));
	return recorder;
}
//#endregion
//#region src/agents/embedded-agent-runner/run/attempt-session-runtime-prepare.ts
async function prepareEmbeddedAttemptSessionRuntime(input) {
	const { attempt, resources, runAbortSignal, sessionLock, toolBase } = input;
	const { agentCoreThinkingLevel, effectiveCwd, effectiveFsWorkspaceOnly, effectiveWorkspace, getCurrentAttemptPluginMetadataSnapshot, getProviderRuntimeHandle, prepStages, providerThinkingLevel, sandbox, sandboxSessionKey, sessionAgentId } = input.setup;
	const { catalogToolHookContext, deferredDirectoryToolsCallable, effectiveTools, toolSearchRunPlan } = input.toolCatalog;
	const { clientTools, uncompactedEffectiveTools } = input.bundleTools;
	const { codeModeControlsEnabledForRun, computerContextEpoch, localModelLeanEnabled, replaySafetyOptions, toolSearchCatalogRef, toolSearchRuntimeConfig } = toolBase;
	const { systemPromptReport, systemPromptText } = input.systemPrompt;
	const effectiveToolCount = effectiveTools.length;
	const sessionPreparation = {
		attempt,
		...input.activeContextEngine ? { activeContextEngine: input.activeContextEngine } : {},
		agentDir: input.agentDir,
		effectiveCwd,
		effectiveWorkspace,
		sessionAgentId
	};
	const preparedSessionManager = await measureEmbeddedAgentPreparation("attempt.history", () => prepareEmbeddedAttemptSessionManager({
		...sessionPreparation,
		assertCurrent: () => {
			runAbortSignal.throwIfAborted();
			sessionLock.ownedTranscriptWriteContext.assertCommitAllowed?.();
			sessionLock.ownedTranscriptWriteContext.initialWriter?.assertActive();
		},
		runAbortSignal,
		onSessionManagerCreated: (manager) => {
			resources.sessionManager = manager;
		},
		replayAllowedToolNames: toolSearchRunPlan.replayAllowedToolNames,
		resolveActiveContextEnginePluginId: input.resolveActiveContextEnginePluginId,
		withOwnedTranscriptWrite: sessionLock.withOwnedTranscriptWrite
	}), { config: attempt.config });
	const { isOpenAIResponsesApi, preparedUserTurnMessage, sessionManager, transcriptPolicy } = preparedSessionManager;
	if (codeModeControlsEnabledForRun && toolSearchCatalogRef) bindCodeModeSessionStore(toolSearchCatalogRef, sessionManager, sessionLock.withOwnedTranscriptWrite);
	const promptStateLease = retainEmbeddedSessionPromptState(attempt.sessionId);
	resources.promptStateLease = promptStateLease;
	const sessionPromptState = promptStateLease.state;
	const usesSystemPromptSeries = !input.isRawModelRun && attempt.operation !== "settled-tool-finalization";
	const promptRouteKey = JSON.stringify([
		attempt.provider,
		attempt.modelId,
		attempt.model.api,
		attempt.model.baseUrl,
		transcriptPolicy.inHistorySystemUpdates === true,
		attempt.bootstrapUserProfileId
	]);
	const retireSystemPromptUpdates = () => sessionLock.withOwnedTranscriptWrite(() => withSessionManagerAppend(sessionManager, async () => {
		runAbortSignal.throwIfAborted();
		await retireSessionSystemPrompt(sessionPromptState, promptRouteKey, (customType, data) => sessionManager.appendCustomEntryAsync(customType, data));
	}));
	if (usesSystemPromptSeries && beginSessionSystemPrompt({
		state: sessionPromptState,
		routeKey: promptRouteKey,
		enabled: transcriptPolicy.inHistorySystemUpdates === true,
		entries: sessionManager.getBranch()
	})) await retireSystemPromptUpdates();
	let freshSystemPrompt = systemPromptText;
	let projectedSystemPrompt;
	const prepareSystemPromptUpdate = usesSystemPromptSeries && transcriptPolicy.inHistorySystemUpdates ? async (systemPrompt, freshlyRendered = false) => {
		if (freshlyRendered || systemPrompt !== projectedSystemPrompt) freshSystemPrompt = systemPrompt;
		const prepared = prepareSessionSystemPrompt({
			state: sessionPromptState,
			routeKey: promptRouteKey,
			systemPrompt: freshSystemPrompt,
			entries: sessionManager.getBranch()
		});
		let restartRecorded = false;
		if (prepared.restart && resources.session) {
			await retireSystemPromptUpdates();
			restartRecorded = true;
			resources.session.agent.state.messages = resources.session.messages.filter((message) => getOpenClawSystemUpdateKind(message) !== "prompt-update");
		}
		projectedSystemPrompt = prepared.systemPrompt;
		return {
			...prepared,
			commit: () => prepared.commit(restartRecorded)
		};
	} : void 0;
	resources.getUserTranscriptContexts = preparedSessionManager.userMessageBoundary.getUserTranscriptContexts;
	const toolPolicyDigest = sha256Hex(stableStringify([attempt.config?.tools, attempt.config?.agents?.entries?.[sessionAgentId]?.tools]));
	const pinTools = usesSystemPromptSeries ? (tools) => {
		const pending = sessionPromptState.pendingToolSurface;
		const pinned = prepareSessionToolSurface({
			state: sessionPromptState,
			routeKey: promptRouteKey,
			toolPolicy: toolPolicyDigest,
			entries: sessionManager.getBranch(),
			tools
		});
		if (sessionPromptState.pendingToolSurface !== pending) declarePromptToolPin(attempt);
		return pinned;
	} : void 0;
	const state = {
		currentTurnImageFailureCount: 0,
		prePromptMessageCount: 0,
		promptCache: void 0,
		systemPromptText
	};
	const preparedAgentSession = await withOwnedSessionTranscriptWrites(sessionLock.ownedTranscriptWriteContext, async () => measureEmbeddedAgentPreparation("attempt.actor", () => prepareEmbeddedAttemptAgentSession({
		...sessionPreparation,
		...input.activeContextEngine ? { activeContextEngineInfo: input.activeContextEngine.info } : {},
		agentCoreThinkingLevel,
		clientToolPreparation: {
			catalogToolHookContext,
			clientTools,
			codeModeControlsEnabledForRun,
			deferredDirectoryToolsCallable,
			effectiveTools,
			pinTools,
			replaySafetyOptions,
			sandboxSessionKey,
			sessionAgentId,
			toolSearchCatalogRef,
			toolSearchRuntimeConfig,
			uncompactedEffectiveTools,
			getToolAbortSignal: () => toolBase.toolAbortSignal
		},
		getCurrentAttemptPluginMetadataSnapshot,
		initialSystemPrompt: state.systemPromptText,
		prepareSystemPromptUpdate,
		markStage: (stage) => prepStages.mark(stage),
		onSessionCreated: (session) => {
			resources.session = session;
		},
		onSystemPromptChanged: (nextSystemPrompt) => {
			state.systemPromptText = nextSystemPrompt;
		},
		runAbortSignal,
		transcriptLifecycle: sessionLock.transcriptLifecycle,
		sessionManager,
		prepareInitialUserTurnReplay: preparedSessionManager.prepareInitialUserTurnReplay
	}), { config: attempt.config }));
	const { activeSession, setActiveSessionSystemPrompt, settingsManager } = preparedAgentSession;
	const recordCurrentTurnImageFailure = (count) => {
		state.currentTurnImageFailureCount = Math.max(state.currentTurnImageFailureCount, count);
	};
	await attempt.userTurnTranscriptRecorder?.waitForRuntimePersistence();
	const boundary = await measureEmbeddedAgentPreparation("attempt.history-boundary", () => sessionLock.withOwnedTranscriptWrite(() => prepareEmbeddedAttemptSessionBoundary({
		abortSignal: runAbortSignal,
		activeSession,
		appendOnlyRuntimeContext: transcriptPolicy.appendOnlyRuntimeContext,
		inHistorySystemUpdates: transcriptPolicy.inHistorySystemUpdates,
		attempt,
		...preparedSessionManager.userMessageBoundary,
		isRawModelRun: input.isRawModelRun,
		sessionManager,
		setActiveSessionSystemPrompt
	})), { config: attempt.config });
	state.prePromptMessageCount = activeSession.messages.length;
	const toolResultPromptProjectionState = sessionPromptState.toolResults;
	if (!input.isRawModelRun) restoreCacheTtlToolResultProjections(toolResultPromptProjectionState, sessionManager.getToolResultProjectionEntries());
	const settleTracker = createEmbeddedAttemptSessionSettleTracker(activeSession);
	input.externalAbortController.setActiveSessionAbort(settleTracker.abortActiveSession);
	resources.buildAbortSettlePromise = settleTracker.buildAbortSettlePromise;
	input.onSessionYieldReady({
		abortActiveSession: settleTracker.abortActiveSession,
		activeSession
	});
	const contextGuards = installEmbeddedAttemptContextGuards({
		...sessionPreparation,
		activeSession,
		computerContextEpoch,
		dropThinkingBlocksForEstimate: transcriptPolicy.dropThinkingBlocks,
		effectiveFsWorkspaceOnly,
		getPrePromptMessageCount: () => state.prePromptMessageCount,
		getPromptCache: () => state.promptCache,
		onCurrentTurnImageFailure: recordCurrentTurnImageFailure,
		getPromptCacheRetention: () => transport.effectivePromptCacheRetention,
		getCompactionReplayEnabled: () => transport.compactionReplayEnabled,
		getServerToolClearingEnabled: () => transport.serverToolClearingEnabled,
		toolResultPromptProjectionState,
		getSystemPrompt: () => state.systemPromptText,
		isOpenAIResponsesApi,
		repairToolUseResultPairing: transcriptPolicy.repairToolUseResultPairing,
		sessionManager,
		settingsManager,
		sandbox
	});
	resources.removeToolResultContextGuard = contextGuards.remove;
	const traceContext = {
		env: process.env,
		runId: attempt.runId,
		sessionId: activeSession.sessionId,
		sessionKey: attempt.sessionKey,
		provider: attempt.provider,
		modelId: attempt.modelId,
		modelApi: attempt.model.api,
		workspaceDir: attempt.workspaceDir
	};
	const cacheTrace = createCacheTrace({
		cfg: attempt.config,
		...traceContext
	});
	const anthropicPayloadLogger = createAnthropicPayloadLogger(traceContext);
	const trajectoryRecorder = await prepareEmbeddedAttemptTrajectory({
		...sessionPreparation,
		activeSession,
		transcriptOwner: sessionLock.ownedTranscriptWriteContext,
		clientToolCount: preparedAgentSession.clientToolDefs.length,
		effectiveToolCount,
		localModelLeanEnabled,
		...systemPromptReport ? { systemPromptReport } : {}
	});
	resources.trajectoryRecorder = trajectoryRecorder;
	const transport = await prepareEmbeddedAttemptTransport({
		attempt,
		assertCronRootCurrent: sessionLock.assertCronRootCurrent,
		session: activeSession,
		settingsManager,
		providerThinkingLevel,
		sessionAgentId,
		workspaceDir: effectiveWorkspace,
		workspaceOnly: effectiveFsWorkspaceOnly,
		agentDir: input.agentDir,
		abortSignal: runAbortSignal,
		getProviderRuntimeHandle,
		onCurrentTurnImageFailure: recordCurrentTurnImageFailure,
		sandboxSessionKey,
		...sandbox !== void 0 ? { sandbox } : {},
		codeModeControlsEnabled: codeModeControlsEnabledForRun,
		providerPromptState: {
			state: getProviderPromptState(attempt.runId),
			effectiveContextTokenBudget: Math.max(1, Math.floor(attempt.contextTokenBudget ?? attempt.model.contextWindow ?? 2e5)),
			...trajectoryRecorder ? { recordEvent: trajectoryRecorder.recordEvent } : {}
		}
	});
	return {
		agentSession: preparedAgentSession,
		anthropicPayloadLogger,
		boundary,
		cacheTrace,
		contextGuards,
		isOpenAIResponsesApi,
		preparedUserTurnMessage,
		prepareSystemPromptUpdate,
		sessionManager,
		sessionPromptState,
		settleTracker,
		state,
		toolResultPromptProjectionState,
		trajectoryRecorder,
		transcriptPolicy,
		transport
	};
}
//#endregion
//#region src/agents/tool-allowlist-guard.ts
/**
* Explicit tool allowlist guard.
*
* Collects operator/user allowlist sources and explains when no callable tools remain.
*/
/** Normalize explicit allowlist sources, dropping empty source entries. */
function collectExplicitToolAllowlistSources(sources) {
	return sources.flatMap((source) => {
		const entries = normalizeStringEntries(source.allow);
		if (entries.length === 0) return [];
		return [{
			label: source.label,
			entries,
			...source.enforceWhenToolsDisabled === true ? { enforceWhenToolsDisabled: true } : {}
		}];
	});
}
/** Build an actionable error when explicit allowlists remove every callable tool. */
function buildEmptyExplicitToolAllowlistError(params) {
	const toolsIntentionallyDisabled = params.disableTools === true || params.toolsAllowExplicitlyEmpty === true;
	const sources = toolsIntentionallyDisabled ? params.sources.filter((source) => source.enforceWhenToolsDisabled === true) : params.sources;
	if (sources.length === 0 || params.hasCallableTools) return null;
	const requested = sources.map((source) => `${source.label}: ${source.entries.map(normalizeToolPolicyName).join(", ")}`).join("; ");
	const workshopBlock = params.skillWorkshop && sources.every((source) => isToolAllowedByPolicyName("skill_workshop", { allow: source.entries })) ? resolveSkillWorkshopToolConstructionBlock(params.skillWorkshop) : void 0;
	if (params.toolsEnabled && !toolsIntentionallyDisabled && workshopBlock) return /* @__PURE__ */ new Error(`No callable tools remain after resolving explicit tool allowlist (${requested}); ${workshopBlock.detail} ${workshopBlock.fix}`);
	const reason = params.disableTools === true ? "tools are disabled for this run" : params.toolsEnabled ? "no registered tools matched" : "the selected model does not support tools";
	return /* @__PURE__ */ new Error(`No callable tools remain after resolving explicit tool allowlist (${requested}); ${reason}. Fix the allowlist or enable the plugin that registers the requested tool.`);
}
//#endregion
//#region src/agents/embedded-agent-runner/run/attempt-tool-search-run-plan.ts
function hasExplicitlyAllowedClientTool(params) {
	const names = (params.clientTools ?? []).map((tool) => tool.function?.name).filter((name) => Boolean(name?.trim()));
	if (names.length === 0) return false;
	const matchers = params.explicitAllowlistSources.map((source) => createToolPolicyMatcher({ allow: source.entries }));
	return names.some((name) => matchers.some((matches) => matches(name)));
}
/**
* Builds the complete tool-search allowlist plan for one run. Visible tools use
* compacted prompt state, while replay tools use uncompacted state.
*/
function buildToolSearchRunPlan(params) {
	const controlNames = params.controlNames ?? [...TOOL_SEARCH_CONTROL_TOOL_NAMES];
	const visibleAllowedToolNames = collectAllowedToolNames({
		tools: params.visibleTools,
		clientTools: params.clientToolsCataloged ? void 0 : params.clientTools
	});
	const replayAllowedToolNames = collectAllowedToolNames({
		tools: params.uncompactedTools,
		clientTools: params.clientTools
	});
	const capabilityToolNames = collectAllowedToolNames({ tools: [...params.deferredToolsCallable ? params.uncompactedTools : params.visibleTools, ...params.catalogCapabilityTools ?? []].filter((tool) => getPluginToolMeta(tool)?.pluginId !== "bundle-mcp") });
	if (params.controlsEnabled) {
		for (const controlName of controlNames) if (visibleAllowedToolNames.has(controlName)) replayAllowedToolNames.add(controlName);
	}
	const liveAllowedToolNames = params.deferredToolsCallable ? collectUniqueCatalogToolNames(params.uncompactedTools) : visibleAllowedToolNames;
	if (params.deferredToolsCallable) {
		for (const controlName of TOOL_SEARCH_CONTROL_TOOL_NAMES) if (!visibleAllowedToolNames.has(controlName)) {
			liveAllowedToolNames.delete(controlName);
			capabilityToolNames.delete(controlName);
		}
		for (const visibleName of visibleAllowedToolNames) liveAllowedToolNames.add(visibleName);
	}
	const explicitControlAllowlistNames = new Set(params.explicitAllowlistSources.flatMap((source) => source.entries.map((entry) => normalizeToolPolicyName(entry))));
	const autoAddedControlNames = new Set((params.controlsEnabled ? controlNames : []).filter((controlName) => !explicitControlAllowlistNames.has(normalizeToolPolicyName(controlName))));
	const explicitlyAllowedClientTool = hasExplicitlyAllowedClientTool(params);
	const emptyAllowlistVisibleToolNames = params.deferredToolsCallable ? collectAllowedToolNames({ tools: params.visibleTools }) : visibleAllowedToolNames;
	return {
		visibleAllowedToolNames,
		replayAllowedToolNames,
		liveAllowedToolNames,
		capabilityToolNames,
		hasCallableTools: params.catalogToolCount > 0 || (params.clientToolsCataloged || params.deferredToolsCallable === true) && explicitlyAllowedClientTool || [...emptyAllowlistVisibleToolNames].some((toolName) => !autoAddedControlNames.has(toolName))
	};
}
//#endregion
//#region src/agents/embedded-agent-runner/run/attempt-tool-catalog.ts
async function prepareEmbeddedAttemptToolCatalog(input) {
	const buildCatalog = (recordQuarantine) => {
		const { attempt, preparedToolBase } = input;
		const { codeModeControlsEnabledForRun, codeModeSkills, localModelLeanPreserveToolNames, runtimeCapabilityProfile, toolSearchConfig, toolSearchControlsEnabledForRun, toolsEnabled } = preparedToolBase;
		const { clientTools, uncompactedEffectiveTools } = input.bundleTools;
		const abortSignal = preparedToolBase.toolAbortSignal ?? input.abortSignal;
		let effectiveTools = attempt.toolExecutionAllow ? gateToolExecution(uncompactedEffectiveTools, attempt.toolExecutionAllow) : uncompactedEffectiveTools;
		const catalogToolHookContext = preparedToolBase.toolHookContext;
		const compacted = preparedToolBase.toolSurfaceRuntime.compactTools(effectiveTools, {
			hookContext: catalogToolHookContext,
			prepared: {
				abortSignal,
				forceRestartSafeTools: attempt.forceRestartSafeTools,
				toolExecutionAllow: attempt.toolExecutionAllow,
				executeTool: input.executeCodeModeTool,
				codeModeSkills,
				preserveToolNames: localModelLeanPreserveToolNames
			}
		});
		const toolSearch = compacted.catalog;
		recordQuarantine({
			diagnostics: compacted.diagnostics,
			tools: compacted.projectedTools,
			runId: attempt.runId,
			agentId: input.setup.sessionAgentId,
			sessionKey: attempt.sessionKey,
			sessionId: attempt.sessionId
		});
		effectiveTools = compacted.tools.map((tool) => wrapEmbeddedAttemptToolWithActivity(wrapToolWithAbortSignal(tool, abortSignal), attempt.runId));
		if (codeModeControlsEnabledForRun && isCodeModeDiagnosticEnabled()) logCodeModeDiagnostic(log$7, "final-surface", {
			runId: attempt.runId,
			fallbackActive: attempt.fallbackActive === true,
			catalogToolCount: toolSearch.catalogToolCount,
			visibleToolNames: effectiveTools.map((tool) => tool.name)
		});
		if (toolSearch.compacted && !toolSearch.catalogReused) {
			emitTrustedDiagnosticEvent({
				type: "tool.catalog",
				source: "builtin",
				mode: codeModeControlsEnabledForRun ? "code-mode" : "tool-search",
				toolCount: toolSearch.catalogToolCount
			});
			log$7.debug(codeModeControlsEnabledForRun ? `code-mode: cataloged ${toolSearch.catalogToolCount} tools behind exec/wait` : toolSearchConfig.mode === "directory" ? `tool-search: cataloged ${toolSearch.catalogToolCount} tools behind compact directory surface` : `tool-search: cataloged ${toolSearch.catalogToolCount} tools behind compact prompt surface`);
		}
		const deferredDirectoryToolsCallable = toolSearchControlsEnabledForRun && toolSearchConfig.mode === "directory" && toolSearch.catalogRegistered;
		const { agentId, globalPolicy, globalProviderPolicy, agentPolicy, agentProviderPolicy, groupPolicy, sandboxPolicy, subagentPolicy, inheritedToolPolicy } = runtimeCapabilityProfile.policy;
		const agentToolLabel = agentId ? `agents.${agentId}.tools` : "agent tools";
		const explicitToolAllowlistSources = collectExplicitToolAllowlistSources([
			{
				label: "tools.allow",
				allow: globalPolicy?.allow
			},
			{
				label: "tools.byProvider.allow",
				allow: globalProviderPolicy?.allow
			},
			{
				label: `${agentToolLabel}.allow`,
				allow: agentPolicy?.allow
			},
			{
				label: `${agentToolLabel}.byProvider.allow`,
				allow: agentProviderPolicy?.allow
			},
			{
				label: "group tools.allow",
				allow: groupPolicy?.allow
			},
			{
				label: "sandbox tools.allow",
				allow: sandboxPolicy?.allow
			},
			{
				label: "subagent tools.allow",
				allow: subagentPolicy?.allow
			},
			{
				label: "inherited tools.allow",
				allow: inheritedToolPolicy?.allow
			},
			{
				label: "runtime toolsAllow",
				allow: attempt.toolsAllow,
				enforceWhenToolsDisabled: true
			}
		]);
		const toolSearchRunPlan = buildToolSearchRunPlan({
			visibleTools: effectiveTools,
			uncompactedTools: uncompactedEffectiveTools,
			catalogCapabilityTools: toolSearch.catalogRegistered ? uncompactedEffectiveTools : void 0,
			clientTools,
			clientToolsCataloged: toolSearch.catalogRegistered && (codeModeControlsEnabledForRun || toolSearchConfig.mode !== "directory"),
			catalogToolCount: toolSearch.catalogToolCount,
			controlsEnabled: toolSearchControlsEnabledForRun || codeModeControlsEnabledForRun,
			deferredToolsCallable: deferredDirectoryToolsCallable,
			controlNames: codeModeControlsEnabledForRun ? [CODE_MODE_EXEC_TOOL_NAME, CODE_MODE_WAIT_TOOL_NAME] : toolSearchConfig.mode === "directory" ? [
				TOOL_SEARCH_RAW_TOOL_NAME,
				TOOL_DESCRIBE_RAW_TOOL_NAME,
				TOOL_CALL_RAW_TOOL_NAME
			] : void 0,
			explicitAllowlistSources: explicitToolAllowlistSources
		});
		const emptyExplicitToolAllowlistError = attempt.forceRestartSafeTools ? null : buildEmptyExplicitToolAllowlistError({
			sources: explicitToolAllowlistSources,
			hasCallableTools: toolSearchRunPlan.hasCallableTools,
			toolsEnabled,
			disableTools: attempt.disableTools,
			toolsAllowExplicitlyEmpty: preparedToolBase.effectiveToolsAllow?.length === 0,
			skillWorkshop: {
				sandboxed: input.setup.sandbox?.enabled,
				libraryAuthoring: attempt.skillLibraryAuthoring
			}
		});
		logAgentRuntimeToolDiagnostics({
			runtimePlan: attempt.runtimePlan,
			tools: effectiveTools,
			provider: attempt.provider,
			config: attempt.config,
			workspaceDir: input.setup.effectiveWorkspace,
			env: process.env,
			modelId: attempt.modelId,
			modelApi: attempt.model.api,
			model: attempt.model,
			runtimeHandle: input.setup.getProviderRuntimeHandle()
		});
		return {
			catalogToolHookContext,
			deferredDirectoryToolsCallable,
			effectiveTools,
			emptyExplicitToolAllowlistError,
			toolSearch,
			toolSearchRunPlan
		};
	};
	const current = await withRuntimeToolSchemaQuarantine(buildCatalog);
	const promptPlanKeys = [
		"visibleAllowedToolNames",
		"liveAllowedToolNames",
		"capabilityToolNames"
	];
	const hostPromptPlan = {
		visibleAllowedToolNames: new Set(current.toolSearchRunPlan.visibleAllowedToolNames),
		liveAllowedToolNames: new Set(current.toolSearchRunPlan.liveAllowedToolNames),
		capabilityToolNames: new Set(current.toolSearchRunPlan.capabilityToolNames)
	};
	return Object.assign(current, {
		applyPromptToolPolicy: (allowedNames) => {
			if (!current.toolSearch.catalogRegistered) finalizeAgentToolAvailability(current.effectiveTools, { toolExecutionAllow: [...allowedNames] });
			for (const key of promptPlanKeys) {
				const names = current.toolSearchRunPlan[key];
				names.clear();
				for (const name of hostPromptPlan[key]) if (allowedNames.has(name)) names.add(name);
			}
		},
		refreshTools: (recordQuarantine) => {
			const next = buildCatalog(recordQuarantine);
			current.effectiveTools.splice(0, current.effectiveTools.length, ...next.effectiveTools);
			for (const key of [...promptPlanKeys, "replayAllowedToolNames"]) {
				const target = current.toolSearchRunPlan[key];
				if (key !== "replayAllowedToolNames") target.clear();
				for (const name of next.toolSearchRunPlan[key]) target.add(name);
			}
			Object.assign(current.toolSearch, next.toolSearch);
			for (const key of promptPlanKeys) hostPromptPlan[key] = new Set(next.toolSearchRunPlan[key]);
			current.emptyExplicitToolAllowlistError = next.emptyExplicitToolAllowlistError;
			current.toolSearchRunPlan.hasCallableTools = next.toolSearchRunPlan.hasCallableTools;
		}
	});
}
function gateToolExecution(tools, allowNames) {
	const executionAllowed = createToolExecutionMatcher(allowNames);
	return tools.map((tool) => executionAllowed(tool.name) || TOOL_SEARCH_CONTROL_TOOL_NAMES.has(tool.name) ? tool : gateAgentToolExecution(tool, formatToolExecutionGatedMessage(tool.name, allowNames)));
}
//#endregion
//#region src/agents/embedded-agent-runner/run/attempt-tool-prepare.ts
async function prepareEmbeddedAttemptToolBase(params) {
	const { attempt } = params;
	const workspaceReadiness = captureAgentWorkspaceReadiness(attempt.sessionKey);
	const captureBaseline = attempt.awaitSessionDiffBaseline;
	const assertBaselineSource = captureBaseline ? resolveAdmittedRunActiveAssertion(attempt.admittedRunContext, params.runAbortController.signal) : void 0;
	const awaitSessionDiffBaseline = captureBaseline ? async () => {
		try {
			if (!assertBaselineSource) throw new Error("session attribution requires active admitted run authority");
			assertBaselineSource();
			await captureBaseline();
			assertBaselineSource();
		} catch (error) {
			params.runAbortController.abort(error);
			throw error;
		}
	} : void 0;
	const completionCheck = attempt.completionCheck;
	const requireExplicitMessageTarget = attempt.requireExplicitMessageTarget ?? isSubagentSessionKey(attempt.sessionKey);
	const forceDirectMessageTool = messageToolOwnsVisibleReply(attempt);
	const toolRunContext = buildEmbeddedAttemptToolRunContext({
		...attempt,
		forceMessageTool: forceDirectMessageTool,
		trace: params.runTrace
	});
	const toolsAllowWithForcedRuntimeTools = toolRunContext.runtimeToolAllowlist;
	const toolsEnabled = supportsModelTools(attempt.model);
	const isRawModelRun = attempt.modelRun === true || attempt.promptMode === "none";
	const toolConstructionPlan = resolveEmbeddedAttemptToolConstructionPlan({
		disableTools: attempt.disableTools,
		isRawModelRun,
		toolsEnabled,
		toolsAllow: toolsAllowWithForcedRuntimeTools
	});
	const toolSurfaceRuntime = createAgentHarnessToolSurfaceRuntimeCore({
		config: attempt.config,
		trigger: attempt.trigger,
		agentId: params.setup.sessionAgentId,
		sessionKey: params.setup.sandboxSessionKey,
		forceMessageTool: forceDirectMessageTool,
		model: attempt.model,
		modelProvider: attempt.provider,
		modelId: attempt.modelId,
		codeModeOverride: attempt.codeModeOverride,
		disableToolSearch: attempt.disableToolSearch,
		modelToolsEnabled: toolsEnabled,
		disableTools: attempt.disableTools,
		isRawModelRun,
		toolsAllow: attempt.toolsAllow,
		forceCodeModeControls: attempt.forceCodeModeTools,
		runtimeToolAllowlist: toolsAllowWithForcedRuntimeTools,
		sessionId: attempt.sessionId,
		runId: attempt.runId,
		contextTokenBudget: attempt.contextTokenBudget,
		executeTool: params.toolSearchCatalogExecutor
	});
	const { codeModeControlsEnabled: codeModeControlsEnabledForRun, toolSearchConfig, toolSearchControlsEnabled: toolSearchControlsEnabledForRun, toolSearchRuntimeConfig } = toolSurfaceRuntime.plan;
	if (isCodeModeDiagnosticEnabled()) logCodeModeDiagnostic(log$7, "activation", {
		runId: attempt.runId,
		active: codeModeControlsEnabledForRun,
		toolsEnabled,
		rawRun: isRawModelRun,
		toolsDisabled: attempt.disableTools === true,
		fallbackActive: attempt.fallbackActive === true,
		allowlist: attempt.toolsAllow === void 0 ? "unset" : attempt.toolsAllow.length === 0 ? "empty" : "nonempty"
	});
	const effectiveToolsAllow = mergeForcedEmbeddedAttemptToolsAllow(toolsAllowWithForcedRuntimeTools, { forceToolNames: toolSearchControlsEnabledForRun ? [...TOOL_SEARCH_CONTROL_TOOL_NAMES] : [] });
	const shouldConstructTools = toolConstructionPlan.constructTools || toolSearchControlsEnabledForRun || codeModeControlsEnabledForRun;
	const computerContextEpoch = { value: 0 };
	const skillInstructionDeliveryCache = createSkillInstructionDeliveryCache();
	const toolSearchCatalogRef = toolSurfaceRuntime.toolSearchCatalogRef;
	const nestedToolActivityState = createAttemptNestedToolActivityState();
	const codeModeSkills = toolPolicyRestrictsTools({ allow: attempt.toolsAllow }) ? [] : params.codeModeSkills;
	const cronCreatorToolAllowlist = [];
	const cronCreatorToolAllowlistCaptureRef = {};
	const inheritedToolAllowlist = [];
	const inheritedPublicationToolRef = {};
	const generationCleanups = [];
	const retiringGenerations = /* @__PURE__ */ new Set();
	let retiredCleanupFailed = false;
	const retireToolGeneration = (reason) => {
		const cleanups = generationCleanups.splice(0);
		const settled = Promise.allSettled(cleanups.map(async (cleanup) => await cleanup(reason))).then((results) => {
			retiredCleanupFailed ||= results.some((result) => result.status === "rejected");
		});
		retiringGenerations.add(settled);
		settled.then(() => retiringGenerations.delete(settled));
	};
	const spawnWorkspaceDir = params.setup.effectiveCwd !== params.setup.effectiveWorkspace ? params.setup.resolvedWorkspace : resolveAttemptSpawnWorkspaceDir({
		sandbox: params.setup.sandbox,
		resolvedWorkspace: params.setup.resolvedWorkspace
	});
	const buildConversationContext = () => ({
		...toolRunContext,
		requireExplicitMessageTarget,
		config: toolSearchRuntimeConfig,
		sessionKey: params.setup.sandboxSessionKey,
		runSessionKey: attempt.sessionKey?.trim() || attempt.sessionId,
		sessionId: attempt.sessionId,
		runId: attempt.runId,
		agentDir: params.agentDir,
		messageProvider: attempt.messageProvider ?? attempt.messageChannel,
		messageChannel: attempt.messageChannel,
		modelProvider: attempt.provider,
		modelId: attempt.modelId,
		modelApi: attempt.model.api,
		modelBaseUrl: attempt.model.baseUrl,
		modelContextWindowTokens: attempt.contextTokenBudget ?? attempt.model.contextWindow,
		modelHasVision: attempt.model.input?.includes("image") ?? false,
		workspaceDir: params.setup.effectiveWorkspace,
		cwd: params.setup.effectiveCwd,
		spawnWorkspaceDir,
		skillsSnapshot: params.skillsSnapshot,
		runtimeToolAllowlist: effectiveToolsAllow
	});
	const runtimeCapabilityProfile = await prepareConversationCapabilityProfile({
		...buildConversationContext(),
		agentId: attempt.sandboxAgentId ?? params.setup.sessionAgentId,
		conversationToolPolicy: attempt.conversationToolPolicy,
		sandboxToolPolicy: params.setup.sandbox?.tools,
		inheritRuntimeToolAllowlist: true,
		runtimePluginToolGrant: attempt.runtimePluginToolGrant,
		inputProvenance: attempt.inputProvenance,
		trustedInternalHandoff: attempt.trustedInternalHandoff,
		pluginMetadataSnapshot: attempt.preparedModelRuntime?.metadataSnapshot
	});
	const computerTransport = resolveSessionPlacementComputer(attempt.admittedRunContext.operationalRunInstance);
	const allowsConversationTool = (name) => projectConversationToolNames({
		capabilityProfile: runtimeCapabilityProfile,
		toolNames: [name],
		warn: () => void 0
	}).length === 1;
	const computerAllowed = shouldConstructTools && allowsConversationTool("computer");
	const pairedNodeComputerUse = (await loadPairedComputerUseAvailabilityForSurface({
		computerAllowed,
		modelHasVision: attempt.model.input?.includes("image") ?? true,
		computerTransport,
		embeddedMode: isEmbeddedMode(),
		signal: params.runAbortController.signal
	}))?.prepared;
	const localModelLeanEnabled = isLocalModelLeanEnabled({
		config: attempt.config,
		agentId: params.setup.sessionAgentId,
		sessionKey: attempt.sessionKey
	});
	const localModelLeanPreserveToolNames = resolveLocalModelLeanPreserveToolNames({
		toolNames: runtimeCapabilityProfile.policy.explicitToolOverrideAllowlist,
		forceMessageTool: attempt.forceMessageTool,
		sourceReplyDeliveryMode: attempt.sourceReplyDeliveryMode
	});
	const replaySafetyOptions = { declaredReplaySafe: (candidate) => {
		const pluginMeta = getPluginToolMeta(candidate);
		if (pluginMeta) return pluginMeta.replaySafe === true;
		return getChannelAgentToolMeta(candidate) ? false : void 0;
	} };
	const restartSafetyOptions = { declaredReplaySafe: (candidate) => {
		if (getPluginToolMeta(candidate)?.mcp) return false;
		return replaySafetyOptions.declaredReplaySafe(candidate);
	} };
	let webSearchUnconfigured = false;
	const constructTools = async (sessionPermissionPolicy, abortSignal) => {
		webSearchUnconfigured = false;
		inheritedPublicationToolRef.current = void 0;
		let constructedToolsRaw = [];
		if (shouldConstructTools) {
			const codingToolOptions = {
				awaitSessionDiffBaseline,
				agentId: params.setup.sessionAgentId,
				...buildConversationContext(),
				exec: {
					...attempt.execOverrides,
					...sessionPermissionPolicy ? { mode: resolveSessionPermissionExecMode(sessionPermissionPolicy) } : {},
					config: attempt.config,
					elevated: attempt.bashElevated,
					reviewTranscript: params.reviewTranscript
				},
				sandbox: params.setup.sandbox,
				stagedMediaPaths: resolveStagedInputMediaPaths(attempt.media),
				sessionPermissionPolicy,
				channelContext: attempt.channelContext,
				allowGatewaySubagentBinding: attempt.allowGatewaySubagentBinding,
				operationalRunInstance: attempt.admittedRunContext.operationalRunInstance,
				computerTransport,
				pairedNodeComputerUse,
				conversationRecall: attempt.conversationRecall,
				memoryAudience: attempt.memoryAudience,
				oneShotCliRun: attempt.oneShotCliRun,
				toolSearchCatalogRef,
				codeModeSkills,
				installedSkills: params.installedSkills,
				preparedModelRuntime: attempt.preparedModelRuntime,
				requireWorkspaceOnly: attempt.requireWorkspaceOnly,
				sessionReadScopeKey: attempt.sessionReadScopeKey,
				sessionConfigSource: attempt.oneShotCliRun ? "pinned" : "runtime",
				webSearchEnabled: attempt.toolOverrides?.webSearch !== false,
				onWebSearchConfiguration: (configured) => {
					webSearchUnconfigured = !configured && allowsConversationTool("web_search") && resolveNativeWebSearchRoute({
						...buildConversationContext(),
						agentId: params.setup.sessionAgentId,
						webSearchEnabled: attempt.toolOverrides?.webSearch !== false,
						sandboxToolPolicy: params.setup.sandbox?.tools,
						authStore: attempt.authProfileStore,
						preparedRequesterPolicy: runtimeCapabilityProfile.policy,
						pluginMetadataSnapshot: attempt.preparedModelRuntime?.metadataSnapshot
					}).kind === "managed";
				},
				githubPublicationAvailable: attempt.githubPublicationAvailable,
				abortSignal,
				skillWorkshop: {
					...attempt.skillWorkshopReviewOf ? { reviewOf: attempt.skillWorkshopReviewOf } : {},
					libraryAuthoring: attempt.skillLibraryAuthoring
				},
				modelCompat: extractModelCompat(attempt.model),
				delegationCapability: attempt.delegationCapability,
				modelAuthMode: await resolveModelAuthModeAsync(attempt.model.provider, attempt.config, attempt.authProfileStore, { workspaceDir: params.setup.effectiveWorkspace }),
				includeCoreTools: toolConstructionPlan.includeCoreTools,
				includeToolSearchControls: toolSearchControlsEnabledForRun,
				toolSearchCatalogExecutor: params.toolSearchCatalogExecutor,
				toolConstructionPlan: toolConstructionPlan.codingToolConstructionPlan,
				computerContextEpoch,
				skillInstructionDeliveryCache,
				registerRunCleanup: (cleanup) => generationCleanups.push(cleanup),
				inboundEventKind: attempt.currentInboundEventKind,
				inputProvenance: attempt.inputProvenance,
				disableMessageTool: attempt.disableMessageTool,
				forceMessageTool: attempt.forceMessageTool,
				enableHeartbeatTool: attempt.enableHeartbeatTool,
				forceHeartbeatTool: attempt.forceHeartbeatTool,
				inheritedToolAllowlistRef: inheritedToolAllowlist,
				inheritedPublicationToolRef,
				cronCreatorToolAllowlistRef: cronCreatorToolAllowlist,
				cronCreatorToolAllowlistCaptureRef,
				authProfileStore: attempt.authProfileStore,
				recordToolPrepStage: params.markCoreToolStage,
				onToolOutcome: attempt.onToolOutcome,
				isTurnTainted: attempt.isTurnTainted,
				allocateToolOutcomeOrdinal: attempt.allocateToolOutcomeOrdinal,
				skillUsagePaths: params.skillUsagePaths,
				conversationCapabilityProfile: runtimeCapabilityProfile,
				onProgressCardPlanSaved: completionCheck ? (unfinished) => {
					completionCheck.unfinishedPlan = unfinished;
				} : void 0,
				onYield: params.onYield
			};
			const assertActive = resolveAdmittedRunActiveAssertion(attempt.admittedRunContext, abortSignal);
			const allTools = await createOpenClawCodingToolsInternalAsync(codingToolOptions, params.skillReadResources, void 0, void 0, {
				reader: getReplyOperationSessionReader(attempt.replyOperation),
				assertCurrent: assertActive
			});
			let boundTools = allTools;
			if (attempt.hostCapabilities) boundTools = attempt.hostCapabilities.bindToolSurface(allTools);
			else if (workspaceReadiness) {
				if (!assertActive) throw new Error("Workspace tools require active run authority");
				boundTools = allTools.map((tool) => isWorkspaceTool(tool) ? gateBoundTool(tool, assertActive, () => {}, workspaceReadiness) : tool);
			}
			params.markCoreToolStage("attempt:create-openclaw-coding-tools");
			constructedToolsRaw = applyEmbeddedAttemptToolsAllow(boundTools, effectiveToolsAllow, { toolMeta: (tool) => getPluginToolMeta(tool) });
			params.markCoreToolStage("attempt:tools-allow");
		}
		const toolsRaw = attempt.forceRestartSafeTools ? constructedToolsRaw.filter((tool) => isAgentToolRestartSafe(tool, restartSafetyOptions)) : constructedToolsRaw;
		assertMemoryFlushPersistenceToolAvailable(toolsRaw, attempt.memoryFlushTools);
		if (attempt.forceRestartSafeTools) log$7.info(`restart-safe recovery tool policy retained ${toolsRaw.length}/${constructedToolsRaw.length} concrete tools`);
		return toolsRaw;
	};
	let toolAbortController = new AbortController();
	let toolAbortSignal = AbortSignal.any([params.runAbortController.signal, toolAbortController.signal]);
	const baseExecOverrides = { ...attempt.permissionChange?.baseExecOverrides ?? attempt.execOverrides };
	const releaseTools = async (reason) => {
		toolAbortController.abort();
		retireToolGeneration(reason);
		await Promise.all(retiringGenerations);
		if (retiredCleanupFailed) recordAgentCleanupFailure();
	};
	try {
		const toolsRaw = await constructTools(params.setup.sessionPermissionPolicy, toolAbortSignal);
		return {
			toolHookContext: {
				awaitSessionDiffBaseline,
				agentId: params.setup.sessionAgentId,
				config: attempt.config,
				cwd: params.setup.effectiveCwd,
				sessionKey: params.setup.sandboxSessionKey,
				sessionId: attempt.sessionId,
				runId: attempt.runId,
				approvalReviewerDeviceId: attempt.approvalReviewerDeviceId,
				channelId: attempt.currentChannelId,
				trace: params.runTrace,
				loopDetection: resolveToolLoopDetectionConfig({
					cfg: attempt.config,
					agentId: params.setup.sessionAgentId
				}),
				onToolOutcome: attempt.onToolOutcome,
				allocateToolOutcomeOrdinal: attempt.allocateToolOutcomeOrdinal
			},
			get toolAbortSignal() {
				return toolAbortSignal;
			},
			refreshPermissionMode: async (mode, revokeApprovals) => {
				toolAbortController.abort(createCodeModePermissionChangeReason());
				revokeApprovals();
				retireToolGeneration("cancel");
				params.runAbortController.signal.throwIfAborted();
				toolAbortController = new AbortController();
				toolAbortSignal = AbortSignal.any([params.runAbortController.signal, toolAbortController.signal]);
				attempt.permissionMode = mode ?? void 0;
				attempt.execOverrides = { ...baseExecOverrides };
				const policy = mode ? {
					root: params.setup.sessionPermissionRoot,
					mode
				} : void 0;
				const nextTools = await constructTools(policy, toolAbortSignal);
				toolsRaw.splice(0, toolsRaw.length, ...nextTools);
			},
			get webSearchUnconfigured() {
				return webSearchUnconfigured;
			},
			codeModeControlsEnabledForRun,
			codeModeSkills,
			computerContextEpoch,
			skillInstructionDeliveryCache,
			cronCreatorToolAllowlist,
			cronCreatorToolAllowlistCaptureRef,
			effectiveToolsAllow,
			forceDirectMessageTool,
			requireExplicitMessageTarget,
			inheritedToolAllowlist,
			inheritedPublicationToolRef,
			localModelLeanEnabled,
			localModelLeanPreserveToolNames,
			replaySafetyOptions,
			runtimeCapabilityProfile,
			releaseTools,
			toolSearchCatalogRef,
			toolSurfaceRuntime,
			toolSearchConfig,
			toolSearchControlsEnabledForRun,
			toolSearchRuntimeConfig,
			nestedToolActivityState,
			toolsEnabled,
			toolsRaw
		};
	} catch (error) {
		try {
			await runOwnedAgentCleanup({
				...attempt,
				step: "embedded-tool-preparation",
				cleanup: () => releaseTools("error"),
				log: log$7
			});
		} catch {
			recordAgentCleanupFailure();
		}
		throw error;
	}
}
//#endregion
//#region src/agents/run-session-target.ts
var AgentRunSessionTargetResolutionError = class extends Error {
	constructor(sessionId) {
		super(`Cannot resolve a session key for existing session: ${sessionId}`);
		this.code = "session-key-missing";
		this.name = "AgentRunSessionTargetResolutionError";
	}
};
/** Resolves the active runtime target used by current run/session internals. */
async function resolveAgentRunSessionTarget(input, prepareTarget) {
	const params = {
		...input,
		sessionTarget: input.sessionTarget ? { ...input.sessionTarget } : void 0
	};
	const config = params.config ?? readRuntimeConfig();
	const sessionTarget = params.sessionTarget;
	const targetAgentId = normalizeOptionalString(sessionTarget?.agentId);
	const targetSessionId = normalizeOptionalString(sessionTarget?.sessionId);
	const targetSessionKey = normalizeOptionalString(sessionTarget?.sessionKey);
	const targetStorePath = normalizeOptionalString(sessionTarget?.storePath);
	const hasCompleteTypedTarget = Boolean(targetAgentId && targetSessionId && targetSessionKey && targetStorePath);
	const legacySessionFile = normalizeOptionalString(params.sessionFile);
	const suppliedSessionKey = normalizeOptionalString(params.sessionKey);
	const legacyMarker = parseSqliteSessionFileMarker(legacySessionFile);
	const recognizedCompatibilityKey = Boolean(legacySessionFile?.startsWith("agent:") || legacySessionFile?.startsWith("in-memory:"));
	const fileBackedCompatibilityValue = Boolean(legacySessionFile && !recognizedCompatibilityKey && (path.isAbsolute(legacySessionFile) || legacySessionFile.includes("/") || legacySessionFile.includes("\\") || legacySessionFile.endsWith(".jsonl")));
	const plainCompatibilitySessionKey = !fileBackedCompatibilityValue && legacySessionFile === (targetSessionId ?? params.sessionId) ? legacySessionFile : void 0;
	if (!hasCompleteTypedTarget && legacySessionFile && !legacyMarker && (fileBackedCompatibilityValue || !plainCompatibilitySessionKey && !recognizedCompatibilityKey && legacySessionFile !== suppliedSessionKey && legacySessionFile !== targetSessionKey)) throw new Error("File-backed transcript targets are unsupported; migrate the session to SQLite first");
	const agentId = targetAgentId ?? legacyMarker?.agentId ?? params.agentId;
	const sessionId = targetSessionId ?? legacyMarker?.sessionId ?? params.sessionId;
	const compatibilitySessionKey = (recognizedCompatibilityKey ? legacySessionFile : void 0) ?? (params.missingSessionKey === "create" ? plainCompatibilitySessionKey : void 0);
	const activeMarker = hasCompleteTypedTarget ? void 0 : legacyMarker;
	const markerSource = activeMarker ? captureSessionActorStorageOwner(activeMarker, {
		assertCurrent() {},
		authorize() {}
	}) : void 0;
	const markerEntries = activeMarker ? markerSource ? readCapturedSessionActorEntries(markerSource) : await readSessionEntrySummariesInWorker({
		agentId: activeMarker.agentId,
		storePath: activeMarker.storePath
	}) : [];
	const markerMatches = activeMarker ? markerEntries.filter(({ entry }) => entry.sessionId === activeMarker.sessionId) : [];
	const markerSessionKey = activeMarker ? resolvePreferredSessionKeyForSessionIdMatches(markerMatches.map(({ sessionKey, entry }) => [sessionKey, entry]), activeMarker.sessionId) : void 0;
	if (activeMarker && !targetSessionKey && !suppliedSessionKey && markerMatches.length > 0 && !markerSessionKey) throw new Error("Legacy SQLite transcript marker session key is ambiguous");
	const preliminarySessionKey = targetSessionKey ?? suppliedSessionKey ?? compatibilitySessionKey ?? markerSessionKey;
	const preliminaryCompatibilityKeyAgentId = parseAgentSessionKey(compatibilitySessionKey)?.agentId;
	if (!targetSessionKey && !suppliedSessionKey && preliminarySessionKey === compatibilitySessionKey && preliminaryCompatibilityKeyAgentId && agentId && preliminaryCompatibilityKeyAgentId !== agentId) throw new Error("Compatibility session key conflicts with the supplied agent identity");
	const targetStoreOwner = resolvePersistedSessionStoreOwnerForTarget({
		config,
		sessionKey: preliminarySessionKey,
		storePath: targetStorePath
	});
	const trustExplicitAlternateStoreAgent = Boolean(targetAgentId && targetStorePath && !parseAgentSessionKey(preliminarySessionKey)?.agentId && targetStoreOwner.kind === "none");
	const shouldResolveConfiguredStoreRow = params.missingSessionKey === "resolve-existing" && !preliminarySessionKey && !targetStorePath && !legacyMarker;
	const configuredStoreResolution = shouldResolveConfiguredStoreRow ? agentId ? await resolveStoredSessionKeyForSessionId({
		cfg: config,
		sessionId,
		agentId
	}) : await resolveExistingSessionKeyForRequest({
		cfg: config,
		sessionId
	}) : void 0;
	const fixedAgentId = (hasCompleteTypedTarget || trustExplicitAlternateStoreAgent ? targetAgentId : void 0) ?? legacyMarker?.agentId ?? configuredStoreResolution?.agentId;
	const lookupAgentId = fixedAgentId ?? resolveSessionAgentId({
		agentId: targetAgentId ?? params.agentId,
		config,
		sessionKey: preliminarySessionKey ?? (params.missingSessionKey === "create" ? sessionId : void 0)
	});
	const lookupStorePath = targetStorePath ?? legacyMarker?.storePath ?? configuredStoreResolution?.storePath ?? resolveSessionStorePathCore(config.session?.store, { agentId: lookupAgentId });
	const storedSessionKey = configuredStoreResolution?.sessionKey ?? (params.missingSessionKey === "resolve-existing" && !preliminarySessionKey && !shouldResolveConfiguredStoreRow ? await resolveSessionKeyBySessionIdAsync({
		agentId: lookupAgentId,
		sessionId,
		storePath: lookupStorePath
	}) : void 0);
	const createdSessionKey = params.missingSessionKey === "create" ? toAgentStoreSessionKey({
		agentId: lookupAgentId,
		requestKey: sessionId
	}) : void 0;
	const sessionKey = preliminarySessionKey ?? storedSessionKey ?? createdSessionKey;
	const suppliedKeyAgentId = parseAgentSessionKey(suppliedSessionKey)?.agentId;
	const targetKeyAgentId = parseAgentSessionKey(targetSessionKey)?.agentId;
	const candidateMarkerKey = targetSessionKey ?? suppliedSessionKey;
	const candidateMarkerEntry = candidateMarkerKey ? markerEntries.find(({ sessionKey: candidateKey }) => candidateKey === candidateMarkerKey)?.entry : void 0;
	if (activeMarker && (targetAgentId && targetAgentId !== activeMarker.agentId || targetSessionId && targetSessionId !== activeMarker.sessionId || params.agentId && params.agentId !== activeMarker.agentId || targetKeyAgentId && targetKeyAgentId !== activeMarker.agentId || suppliedKeyAgentId && suppliedKeyAgentId !== activeMarker.agentId || targetStorePath && path.resolve(targetStorePath) !== path.resolve(activeMarker.storePath))) throw new Error("Legacy SQLite transcript marker conflicts with the supplied session identity");
	if (activeMarker && candidateMarkerKey && candidateMarkerEntry && candidateMarkerEntry.sessionId !== activeMarker.sessionId) throw new Error("Legacy SQLite transcript marker conflicts with the supplied session key");
	if (!sessionKey) throw new AgentRunSessionTargetResolutionError(sessionId);
	const effectiveAgentId = fixedAgentId ?? resolveSessionAgentId({
		agentId: targetAgentId ?? params.agentId,
		config,
		fallbackAgentId: lookupAgentId,
		sessionKey
	});
	const storePath = targetStorePath ?? legacyMarker?.storePath ?? resolveSessionStorePathCore(config.session?.store, { agentId: effectiveAgentId });
	const scope = {
		...effectiveAgentId ? { agentId: effectiveAgentId } : {},
		sessionId,
		sessionKey,
		storePath,
		...sessionTarget?.threadId !== void 0 ? { threadId: sessionTarget.threadId } : {}
	};
	const prepared = prepareTarget ? await prepareTarget(scope) : void 0;
	const target = prepared?.target ?? await resolveSessionTranscriptRuntimeTarget(scope);
	prepared?.assertCurrent();
	return target;
}
/** Applies identity fields from the explicit target before legacy backfills run. */
function applyAgentRunSessionTargetIdentity(params) {
	const target = params.sessionTarget;
	if (!target) return params;
	return {
		...params,
		agentId: normalizeOptionalString(target.agentId) ?? params.agentId,
		sessionId: normalizeOptionalString(target.sessionId) ?? params.sessionId,
		sessionKey: normalizeOptionalString(target.sessionKey) ?? params.sessionKey
	};
}
//#endregion
//#region src/agents/embedded-agent-runner/run/attempt-transcript-lifecycle.ts
/** Serializes run-owned transcript callbacks and bounds teardown settlement. */
const TRANSCRIPT_TEARDOWN_BUDGET_MS = 3e4;
function createEmbeddedAttemptTranscriptLifecycle(params, deps = {}) {
	let disposed = false;
	let lifecycle = Promise.resolve();
	let cleanupDrain;
	let disposePromise;
	let pendingWrites = 0;
	const lifecycleOwner = deps.createLifecycleStore?.() ?? new AsyncLocalStorage();
	const createLifecycleOwner = () => ({
		active: true,
		nestedTail: Promise.resolve(),
		pendingOperations: /* @__PURE__ */ new Set()
	});
	const drainLifecycleOwner = async (owner) => {
		let firstError;
		while (owner.pendingOperations.size > 0) {
			const pending = [...owner.pendingOperations];
			owner.pendingOperations.clear();
			const rejected = (await Promise.allSettled(pending)).find((result) => result.status === "rejected");
			if (firstError === void 0 && rejected?.status === "rejected") firstError = toErrorObject(rejected.reason, "nested transcript write failed");
		}
		if (firstError !== void 0) throw firstError;
	};
	const runLifecycleOwner = async (owner, run) => {
		let value;
		let primaryError;
		try {
			value = await lifecycleOwner.run(owner, async () => await run());
		} catch (error) {
			primaryError = toErrorObject(error, "transcript write failed");
		}
		let drainError;
		try {
			await drainLifecycleOwner(owner);
		} catch (error) {
			drainError = toErrorObject(error, "nested transcript drain failed");
		} finally {
			owner.active = false;
		}
		if (primaryError !== void 0 && drainError !== void 0 && drainError !== primaryError && primaryError.cause === void 0) try {
			primaryError.cause = drainError;
		} catch {}
		const failure = primaryError ?? drainError;
		if (failure !== void 0) throw failure;
		return value;
	};
	const serializeLifecycle = async (run) => {
		const inheritedOwner = lifecycleOwner.getStore();
		if (inheritedOwner?.active) {
			const operation = inheritedOwner.nestedTail.then(async () => await runLifecycleOwner(createLifecycleOwner(), run));
			inheritedOwner.nestedTail = operation.then(() => void 0, () => void 0);
			const propagated = operation.then(() => void 0);
			propagated.catch(() => {});
			inheritedOwner.pendingOperations.add(propagated);
			return await operation;
		}
		const previous = lifecycle;
		const { promise, resolve: release } = createDeferredCore();
		lifecycle = promise;
		await previous;
		const owner = createLifecycleOwner();
		try {
			return await runLifecycleOwner(owner, run);
		} finally {
			release();
		}
	};
	const settleWithinTeardownBudget = async (operation) => {
		if (!await settlesWithin(operation, TRANSCRIPT_TEARDOWN_BUDGET_MS)) log$7.error(`transcript teardown budget expired: runId=${params.runId ?? "unknown"} sessionId=${params.sessionId ?? "unknown"} pendingWrites=${pendingWrites} timeoutMs=${TRANSCRIPT_TEARDOWN_BUDGET_MS}`);
	};
	const beginCleanup = async () => {
		if (lifecycleOwner.getStore()?.active) throw new Error("cannot start attempt cleanup inside a transcript write callback");
		cleanupDrain ??= settleWithinTeardownBudget(serializeLifecycle(() => {
			lifecycleOwner.disable();
			return params.onDrained?.();
		}));
		await cleanupDrain;
	};
	return {
		withTranscriptWrite: (run) => {
			const activeDescendant = lifecycleOwner.getStore()?.active === true;
			if ((cleanupDrain || disposed) && !activeDescendant) {
				const rejected = Promise.reject(/* @__PURE__ */ new Error(disposed ? "attempt disposed before transcript write" : "attempt cleanup started before transcript write"));
				rejected.catch(() => {});
				return rejected;
			}
			pendingWrites += 1;
			const operation = serializeLifecycle(run);
			operation.finally(() => {
				pendingWrites -= 1;
			}).catch(() => {});
			return operation;
		},
		beginCleanup,
		dispose: async () => {
			if (lifecycleOwner.getStore()?.active) throw new Error("cannot dispose an attempt from inside a transcript write callback");
			disposePromise ??= (async () => {
				await beginCleanup();
				disposed = true;
			})();
			await disposePromise;
		}
	};
}
//#endregion
//#region src/agents/embedded-agent-runner/run/attempt-transcript-lifecycle-prepare.ts
/** Prepares the admitted writer context and teardown tracker for one attempt. */
async function prepareEmbeddedAttemptTranscriptLifecycle(input) {
	const { attempt, externalAbortController } = input;
	const preparedTarget = attempt.preparedSessionTarget;
	preparedTarget?.assertCurrent();
	const initialWriter = getOwnedSessionTranscriptInitialWriter({
		sessionFile: attempt.sessionFile,
		sessionKey: attempt.sessionKey,
		sessionTarget: attempt.sessionManager?.getSessionTarget() ?? attempt.sessionTarget
	});
	const sessionTarget = preparedTarget?.target ?? await resolveAgentRunSessionTarget({
		agentId: attempt.sessionTarget?.agentId,
		config: attempt.config,
		missingSessionKey: "resolve-existing",
		sessionFile: attempt.sessionFile,
		sessionId: attempt.sessionId,
		sessionKey: attempt.sessionKey,
		sessionTarget: attempt.sessionTarget
	});
	await externalAbortController.throwIfFiredAfterPrepCleanup();
	preparedTarget?.assertCurrent();
	initialWriter?.assertActive();
	const fencedSessionTarget = {
		...sessionTarget,
		expectedLifecycleRevision: attempt.sessionTarget?.expectedLifecycleRevision,
		expectedWriterRunId: attempt.sessionTarget?.expectedWriterRunId
	};
	const generation = await prepareCronRootSessionGeneration({
		...sessionTarget,
		sessionKey: attempt.sessionKey ?? sessionTarget.sessionKey,
		lifecycleRevision: fencedSessionTarget.expectedLifecycleRevision
	}, input.runAbortController ? (reason) => input.runAbortController?.abort(reason) : void 0);
	const transcriptLifecycle = createEmbeddedAttemptTranscriptLifecycle({
		runId: attempt.runId,
		sessionId: attempt.sessionId,
		onDrained: async () => {
			try {
				await ownedTranscriptWriteContext.sessionActor?.actor.release();
			} finally {
				generation?.release();
			}
		}
	});
	const assertAdmittedActive = attempt.admittedRunContext ? resolveAdmittedRunActiveAssertion(attempt.admittedRunContext, attempt.abortSignal) : void 0;
	const { writeContext: terminalWriter } = captureAgentRunTerminalPersistence(attempt.runId);
	const assertTerminalCurrent = composeSessionSourceAssertion([terminalWriter?.assertCurrent, generation?.assertCurrent]);
	const withTranscriptWrite = (operation) => initialWriter ? initialWriter.withTranscriptWrite(() => transcriptLifecycle.withTranscriptWrite(operation)) : transcriptLifecycle.withTranscriptWrite(operation);
	const ownedTranscriptWriteContext = {
		sessionFile: attempt.sessionFile,
		sessionKey: attempt.sessionKey,
		sessionTarget: fencedSessionTarget,
		sessionReader: getReplyOperationSessionReader(attempt.replyOperation),
		...initialWriter ? { initialWriter } : {},
		assertCommitAllowed: composeSessionSourceAssertion([assertAdmittedActive, generation?.assertCurrent], (assertSources) => {
			attempt.abortSignal?.throwIfAborted();
			preparedTarget?.assertCurrent();
			assertSources();
		}),
		withTranscriptWrite,
		withRestartAbortWrite: terminalWriter ? async (write) => {
			if (!isAgentRunRestartAbortReason(attempt.abortSignal?.reason) && !isAgentRunRestartAbortReason(input.runAbortController?.signal.reason)) throw new Error("Interrupted transcript write requires a restart abort");
			const fence = initialWriter?.committedFence ?? fencedSessionTarget;
			if (!fence.expectedWriterRunId || initialWriter && !initialWriter.committedFence) throw new SessionTranscriptWriterClaimReboundError();
			return await transcriptLifecycle.withTranscriptWrite(() => terminalWriter.run(() => withOwnedSessionTranscriptWrites({
				...ownedTranscriptWriteContext,
				sessionTarget: {
					...fencedSessionTarget,
					...fence
				},
				initialWriter: void 0,
				settledInitialWriter: initialWriter,
				sessionReader: void 0,
				assertCommitAllowed: assertTerminalCurrent,
				withTranscriptWrite: (operation) => transcriptLifecycle.withTranscriptWrite(operation),
				withRestartAbortWrite: void 0
			}, write)));
		} : void 0
	};
	try {
		const assertCurrent = () => {
			initialWriter?.assertActive();
			ownedTranscriptWriteContext.assertCommitAllowed?.();
		};
		assertCurrent();
		if (attempt.sessionPersistence !== "detached") {
			const reader = ownedTranscriptWriteContext.sessionReader;
			if (reader) assertSessionEntryCohortScope(reader, fencedSessionTarget);
			const assertActorCurrent = terminalWriter ? assertTerminalCurrent : assertCurrent;
			const lifetime = {
				assertCurrent: assertActorCurrent,
				assertReadable: assertActorCurrent
			};
			const incognito = captureSessionManagerIncognitoBinding(fencedSessionTarget, attempt.sessionManager);
			if (incognito) {
				const actor = await incognito.acquire(false, lifetime);
				if (!actor) throw new IncognitoSessionMissingError();
				ownedTranscriptWriteContext.sessionActor = {
					actor,
					database: incognito.database
				};
			} else {
				const options = reader?.database ?? toDatabaseOptions(resolveSqliteReadScope(fencedSessionTarget));
				const database = {
					...options,
					env: Object.freeze({ ...options.env ?? process.env }),
					path: resolveOpenClawAgentSqlitePath(options)
				};
				let identity = readDatabasePathIdentitySync(database.path);
				if (identity.key.startsWith("path:")) {
					await prepareSessionEntryReplacementDatabase(database, assertCurrent);
					assertCurrent();
					identity = readDatabasePathIdentitySync(database.path);
				}
				const actor = await createSessionActorFactory(database).acquire({
					database: {
						kind: "file",
						physicalIdentity: identity.key.slice(5),
						birthtime: identity.birthtime,
						nativeLocation: identity.canonicalPath
					},
					sessionKey: sessionTarget.sessionKey
				}, lifetime);
				if ("kind" in actor) throw new Error("Durable session actor acquisition was declined");
				ownedTranscriptWriteContext.sessionActor = {
					actor,
					database
				};
			}
		}
		externalAbortController.arm();
		await externalAbortController.throwIfFiredAfterPrepCleanup();
		preparedTarget?.assertCurrent();
	} catch (error) {
		await transcriptLifecycle.dispose();
		throw error;
	}
	return {
		compactionTimeoutMs: resolveCompactionTimeoutMs(attempt.config),
		assertCronRootCurrent: generation ? ownedTranscriptWriteContext.assertCommitAllowed : void 0,
		ownedTranscriptWriteContext,
		transcriptLifecycle,
		withOwnedTranscriptWrite: (operation) => withOwnedSessionTranscriptWrites(ownedTranscriptWriteContext, async () => withTranscriptWrite(operation))
	};
}
//#endregion
//#region src/agents/embedded-agent-runner/run/attempt.ts
async function runEmbeddedAttempt(input) {
	const modelExecution = bindOperatorModelExecution(readRunOperatorAuthority(input), {
		provider: input.provider,
		model: input.modelId
	});
	try {
		const attempt = modelExecution ? {
			...input,
			abortSignal: input.abortSignal ? AbortSignal.any([input.abortSignal, modelExecution.signal]) : modelExecution.signal
		} : input;
		const parentSignal = getAsyncWorkSignal();
		const resourceAbortSignal = parentSignal ? attempt.abortSignal ? AbortSignal.any([attempt.abortSignal, parentSignal]) : parentSignal : attempt.abortSignal;
		const result = await runWithAsyncWorkResources((onAcquired) => runEmbeddedAttemptOwned(attempt, (release) => onAcquired({
			release,
			releaseBeforeResultWhenIdle: true
		}), resourceAbortSignal));
		modelExecution?.assertCurrent();
		return result;
	} finally {
		modelExecution?.release();
	}
}
async function runEmbeddedAttemptOwned(input, retainToolCleanup, resourceAbortSignal) {
	let params = input;
	const runAbortController = new AbortController();
	const setup = await measureEmbeddedAgentPreparation("attempt.setup", () => prepareEmbeddedAttemptSetup(params), { config: params.config });
	const { effectiveWorkspace, emitCorePluginToolStageSummary, prepStages, sandbox, sessionAgentId } = setup;
	let restoreSkillEnv;
	const executionState = {
		beforeAgentRunBlockedBy: void 0,
		terminal: params.abortSignal?.aborted ? {
			kind: "aborted",
			source: "external"
		} : { kind: "ok" },
		trajectoryEndRecorded: false
	};
	let emitDiagnosticRunCompleted;
	const bundleRuntimes = {
		bundleMcpRuntime: void 0,
		bundleLspRuntime: void 0
	};
	let toolSearchCatalogRef;
	let toolSearchCatalogApplied = false;
	let releasePreparedTools;
	let unsubscribeYieldTurnEnd;
	const sessionResources = createEmbeddedAttemptSessionResources(runAbortController.signal);
	const cleanupStep = (step, cleanup) => runOwnedAgentCleanup({
		...params,
		step,
		cleanup,
		log: log$7
	});
	const cleanupEmbeddedPrepResourcesAfterEarlyExit = async () => {
		if (toolSearchCatalogApplied) {
			clearToolSearchCatalog({ catalogRef: toolSearchCatalogRef });
			toolSearchCatalogApplied = false;
		}
		for (const key of ["bundleMcpRuntime", "bundleLspRuntime"]) try {
			await bundleRuntimes[key]?.dispose();
		} catch {
			recordAgentCleanupFailure();
		} finally {
			bundleRuntimes[key] = void 0;
		}
	};
	const externalAbortController = createEmbeddedAttemptExternalAbortController({
		abortSignal: resourceAbortSignal,
		cleanupAfterEarlyAbort: cleanupEmbeddedPrepResourcesAfterEarlyExit,
		runAbortController,
		runId: params.runId,
		state: executionState
	});
	const prepare = createEmbeddedAttemptPreparation({
		config: params.config,
		assertCurrent: externalAbortController.throwIfFired
	});
	const assertActiveRun = resolveAdmittedRunActiveAssertion(params.admittedRunContext, params.abortSignal);
	try {
		const preparedSkills = await prepare("attempt.skills", () => prepareEmbeddedSkills({
			assertCurrent: () => {
				externalAbortController.throwIfFired();
				assertActiveRun?.();
			},
			includeCodeModeSkills: true,
			attempt: params,
			effectiveWorkspace,
			sandbox,
			sessionAgentId
		}));
		restoreSkillEnv = preparedSkills.restoreSkillEnv;
		const { codeModeSkills, installedSkills, skillReadResources, skillUsagePaths, skillsPrompt, skillsSnapshotForRun } = preparedSkills;
		if (params.skillsSnapshot?.librarySelections?.length && sandbox?.enabled) {
			const remapped = remapSkillReferencePaths(params.prompt, skillUsagePaths);
			if (remapped !== params.prompt) params = {
				...params,
				prompt: remapped,
				transcriptPrompt: params.transcriptPrompt ?? params.prompt
			};
		}
		prepStages.mark("skills");
		const isRawModelRun = params.modelRun === true || params.promptMode === "none";
		if (isRawModelRun && log$7.isEnabled("debug")) log$7.debug(`raw model run enabled: modelRun=${params.modelRun === true} promptMode=${params.promptMode ?? "unset"}`);
		const activeContextEngine = isRawModelRun ? void 0 : params.contextEngine;
		if (activeContextEngine && activeContextEngine.info.id !== "legacy") assertContextEngineHostSupport({
			contextEngine: activeContextEngine,
			operation: "agent-run",
			host: OPENCLAW_EMBEDDED_CONTEXT_ENGINE_HOST
		});
		const resolveActiveContextEnginePluginId = () => resolveContextEngineOwnerPluginId(activeContextEngine);
		const agentDir = params.agentDir ?? resolveAgentDir(params.config ?? {}, sessionAgentId);
		const { diagnosticTrace, runTrace, emitCompleted } = startEmbeddedAttemptDiagnostics(params);
		emitDiagnosticRunCompleted = emitCompleted;
		const corePluginToolStages = createStageTimingTracker(Date.now);
		let toolSearchCatalogExecutor;
		const executeCatalogTool = (toolParams, surface) => {
			if (!toolSearchCatalogExecutor) throw new Error(`${surface} catalog executor is unavailable for this run.`);
			return toolSearchCatalogExecutor(toolParams);
		};
		const preparedToolBase = await prepare("attempt.tool-base", () => prepareEmbeddedAttemptToolBase({
			agentDir,
			attempt: params,
			setup,
			markCoreToolStage: (name) => corePluginToolStages.mark(name),
			onYield: (message, acknowledgment, messageWaitRegistered) => {
				yieldDetected = true;
				yieldMessage = message;
				yieldAcknowledgment = acknowledgment;
				yieldMessageWaitRegistered = messageWaitRegistered;
			},
			runAbortController,
			runTrace,
			skillUsagePaths,
			skillReadResources,
			skillsSnapshot: skillsSnapshotForRun,
			codeModeSkills,
			installedSkills,
			reviewTranscript: sessionResources.reviewTranscript,
			toolSearchCatalogExecutor: (toolParams) => executeCatalogTool(toolParams, "Tool Search")
		}));
		toolSearchCatalogRef = preparedToolBase.toolSearchCatalogRef;
		const { codeModeControlsEnabledForRun, toolSearchControlsEnabledForRun, toolSearchRuntimeConfig, toolsEnabled, toolsRaw } = preparedToolBase;
		releasePreparedTools = preparedToolBase.releaseTools;
		prepStages.mark("core-plugin-tools");
		emitCorePluginToolStageSummary("core-plugin-tools", corePluginToolStages.snapshot());
		const preparedBootstrap = await prepare("attempt.bootstrap", () => prepareEmbeddedAttemptBootstrap({
			attempt: params,
			setup,
			hasReadTool: toolsEnabled && toolsRaw.some((tool) => tool.name === "read"),
			isRawModelRun
		}));
		let yieldDetected = false;
		let yieldMessage = null;
		let yieldAcknowledgment;
		let yieldMessageWaitRegistered;
		let yieldAbortSettled = null;
		const preparedBundleTools = await prepare("attempt.bundle-tools", () => prepStages.measure("bundle-tools", () => prepareEmbeddedAttemptBundleTools({
			agentDir,
			attempt: params,
			setup,
			isRawModelRun,
			preparedToolBase
		})));
		bundleRuntimes.bundleMcpRuntime = preparedBundleTools.bundleMcpRuntime;
		bundleRuntimes.bundleLspRuntime = preparedBundleTools.bundleLspRuntime;
		const { clientTools, uncompactedEffectiveTools } = preparedBundleTools;
		toolSearchCatalogApplied = toolSearchCatalogRef !== void 0;
		const preparedToolCatalog = await prepare("attempt.tool-catalog", () => prepStages.measure("tool-catalog", () => prepareEmbeddedAttemptToolCatalog({
			attempt: params,
			setup,
			preparedToolBase,
			bundleTools: {
				clientTools,
				uncompactedEffectiveTools
			},
			abortSignal: runAbortController.signal,
			executeCodeModeTool: (toolParams) => executeCatalogTool(toolParams, "Code Mode")
		})));
		prepStages.mark("tool-preparation");
		const { effectiveTools, toolSearch, toolSearchRunPlan } = preparedToolCatalog;
		toolSearchCatalogApplied = toolSearch.catalogRegistered;
		const preparedSystemPrompt = await prepare("attempt.system-prompt", () => prepareEmbeddedAttemptSystemPrompt({
			activeContextEngine,
			attempt: params,
			setup,
			bootstrap: preparedBootstrap,
			capabilityToolNames: toolSearchRunPlan.capabilityToolNames,
			effectiveTools,
			isRawModelRun,
			modelToolsEnabled: toolsEnabled,
			skillsPrompt,
			codeModeActive: codeModeControlsEnabledForRun,
			webSearchUnconfigured: () => preparedToolBase.webSearchUnconfigured,
			toolSearchCatalogRef,
			toolSearchDirectoryEnabled: toolSearchControlsEnabledForRun && toolSearch.catalogRegistered,
			toolSearchRuntimeConfig
		}));
		const sessionLock = await prepare("attempt.transcript-lifecycle", () => prepareEmbeddedAttemptTranscriptLifecycle({
			attempt: params,
			runAbortController,
			externalAbortController
		}));
		try {
			const preparedSessionRuntime = await prepare("attempt.session-runtime", () => prepareEmbeddedAttemptSessionRuntime({
				attempt: params,
				...activeContextEngine ? { activeContextEngine } : {},
				agentDir,
				isRawModelRun,
				resolveActiveContextEnginePluginId,
				setup,
				toolBase: preparedToolBase,
				toolCatalog: preparedToolCatalog,
				bundleTools: preparedBundleTools,
				systemPrompt: preparedSystemPrompt,
				sessionLock,
				runAbortSignal: runAbortController.signal,
				externalAbortController,
				resources: sessionResources.resources,
				onSessionYieldReady: ({ abortActiveSession, activeSession }) => {
					unsubscribeYieldTurnEnd = activeSession.agent.subscribe((event) => {
						if (event.type !== "turn_end" || !yieldDetected || runAbortController.signal.aborted) return;
						queueSessionsYieldInterruptMessage(activeSession);
						runAbortController.abort(SESSIONS_YIELD_ABORT_REASON);
						yieldAbortSettled = abortActiveSession(SESSIONS_YIELD_ABORT_REASON);
					});
				}
			}));
			const promptToolPolicy = createPromptBuildToolPolicy({
				session: preparedSessionRuntime.agentSession.activeSession,
				readModelTools: () => preparedSessionRuntime.agentSession.activeSession.agent.state.tools,
				effectiveTools,
				uncompactedEffectiveTools,
				tools: preparedBundleTools.tools,
				catalogRef: preparedToolBase.toolSearchCatalogRef,
				codeModeControlsEnabled: preparedToolBase.codeModeControlsEnabledForRun,
				onApplied: (surface) => {
					const allowedNames = /* @__PURE__ */ new Set([...surface.activeToolNames, ...surface.uncompactedEffectiveTools.map((tool) => tool.name)]);
					preparedToolCatalog.applyPromptToolPolicy(allowedNames);
				},
				forceToolNames: [...preparedToolBase.forceDirectMessageTool ? ["message"] : [], ...params.swarmCollector && params.swarmOutputSchema ? ["structured_output"] : []]
			});
			const executionResult = await runEmbeddedAttemptExecutionPhase({
				attempt: params,
				...activeContextEngine ? { activeContextEngine } : {},
				agentDir,
				isRawModelRun,
				resolveActiveContextEnginePluginId,
				runAbortController,
				externalAbortController,
				prepared: {
					bootstrap: preparedBootstrap,
					bundleTools: preparedBundleTools,
					sessionRuntime: preparedSessionRuntime,
					systemPrompt: preparedSystemPrompt,
					toolBase: preparedToolBase,
					toolCatalog: preparedToolCatalog,
					promptToolPolicy
				},
				sessionLock,
				setup,
				diagnostics: {
					diagnosticTrace,
					runTrace
				},
				state: executionState,
				lifecycle: {
					applyPermissionMode: (mode, revokeApprovals) => withRuntimeToolSchemaQuarantine(async (recordQuarantine) => {
						await preparedToolBase.refreshPermissionMode(mode, revokeApprovals);
						preparedBundleTools.refreshTools(recordQuarantine);
						preparedToolCatalog.refreshTools(recordQuarantine);
						preparedSessionRuntime.agentSession.refreshTools();
						promptToolPolicy.refresh();
						const prepareToolPrompt = preparedSystemPrompt.prepareToolPrompt;
						preparedSessionRuntime.agentSession.setPermissionPromptPreparation(prepareToolPrompt ? () => prepareToolPrompt(promptToolPolicy.current.effectiveTools, { permissionChanged: true }) : void 0);
						params.permissionChange?.recordApplied(mode);
					}),
					readYieldState: () => ({
						yieldAbortSettled,
						yieldDetected,
						yieldMessage,
						yieldAcknowledgment,
						yieldMessageWaitRegistered
					}),
					setToolSearchCatalogExecutor: (executor) => {
						toolSearchCatalogExecutor = executor;
					}
				}
			});
			executionState.diagnosticFinalResponse = resolveDiagnosticModelContentCapturePolicy(getRuntimeConfigSnapshot()).outputMessages ? resolveFinalMessageRawText(executionResult.currentAttemptAssistant ?? executionResult.currentAttemptCompletedAssistant) : void 0;
			const catalogSession = toolSearchCatalogRef?.current;
			const providerRetry = preparedSessionRuntime.agentSession.settingsManager.getProviderRetrySettings();
			return {
				...executionResult,
				codeModeEngaged: codeModeControlsEnabledForRun,
				providerRetryMaxRetries: providerRetry.maxRetries,
				providerRetryMaxDelayMs: providerRetry.maxRetryDelayMs,
				...catalogSession ? { bridgeCalls: {
					search: catalogSession.searchCount,
					describe: catalogSession.describeCount,
					call: catalogSession.callCount
				} } : {}
			};
		} finally {
			unsubscribeYieldTurnEnd?.();
			unsubscribeYieldTurnEnd = void 0;
			sessionResources.releaseReview();
			const sessionBundleRuntimes = { ...bundleRuntimes };
			bundleRuntimes.bundleMcpRuntime = void 0;
			bundleRuntimes.bundleLspRuntime = void 0;
			toolSearchCatalogApplied = false;
			await cleanupStep("embedded-session", () => cleanupEmbeddedAttemptSessionPhase({
				attempt: params,
				...sessionResources.resources,
				transcriptLifecycle: sessionLock.transcriptLifecycle,
				...sessionBundleRuntimes,
				toolSearchCatalogRef,
				trajectoryEndRecorded: executionState.trajectoryEndRecorded,
				deferredLifecycleOwner: executionState.deferredLifecycleOwner,
				emitDiagnosticRunCompleted,
				state: executionState
			}));
		}
	} catch (cause) {
		let error = cause;
		try {
			externalAbortController.throwIfFired();
		} catch (abortError) {
			error = abortError;
		}
		const terminalOutcome = buildAgentRunTerminalOutcomeFromAttempt({
			terminal: executionState.terminal,
			abortSignal: params.abortSignal
		});
		if (terminalOutcome.status === "timeout") throw new AgentRunTerminalOutcomeError(error, terminalOutcome);
		throw error;
	} finally {
		const resolveCleanupReason = () => {
			const terminal = projectAgentRunAttemptTerminal(executionState.terminal);
			return terminal.timedOut || terminal.timedOutDuringCompaction || terminal.timedOutDuringToolExecution ? "timeout" : terminal.aborted ? "cancel" : terminal.failed ? "error" : "completion";
		};
		const releaseTools = async () => {
			const cleanupReason = resolveCleanupReason();
			try {
				await cleanupStep("embedded-registered-resources", async () => {
					try {
						await releasePreparedTools?.(cleanupReason);
					} catch {
						recordAgentCleanupFailure();
					}
				});
			} finally {
				setup[Symbol.dispose]();
				externalAbortController.dispose();
			}
		};
		if (resolveCleanupReason() === "completion") retainToolCleanup(releaseTools);
		else await releaseTools();
		clearToolActivityRun(params.runId);
		try {
			await cleanupStep("embedded-preparation", cleanupEmbeddedPrepResourcesAfterEarlyExit);
		} catch (cleanupErr) {
			recordAgentCleanupFailure();
			log$7.warn(`failed to clean up embedded prep resources after early attempt exit: runId=${params.runId} ${String(cleanupErr)}`);
		}
		const terminal = projectAgentRunAttemptTerminal(executionState.terminal);
		emitDiagnosticRunCompleted?.(terminal.aborted ? "aborted" : "error", terminal.promptError ?? /* @__PURE__ */ new Error("run exited before diagnostic completion"));
		restoreSkillEnv?.();
	}
}
//#endregion
//#region src/agents/harness/types.ts
/**
* Checks whether an agent harness explicitly declares support for turn-scoped
* tool restrictions (such as dynamic tool prefiltering).
*/
function harnessSupportsTurnScopedToolRestrictions(harness) {
	return harness?.supportsTurnScopedToolRestrictions === true;
}
//#endregion
//#region src/agents/harness/builtin-openclaw.ts
const builtInOpenClawHarnesses = /* @__PURE__ */ new WeakSet();
function buildRestrictedFinalizationAttempt(attempt) {
	return {
		admittedRunContext: attempt.admittedRunContext,
		sessionId: attempt.sessionId,
		sessionKey: attempt.sessionKey,
		sessionTarget: attempt.sessionTarget,
		lifecycleGeneration: attempt.lifecycleGeneration,
		promptCacheKey: attempt.promptCacheKey,
		sandboxSessionKey: attempt.sandboxSessionKey,
		agentId: attempt.agentId,
		workspaceDir: attempt.workspaceDir,
		cwd: attempt.cwd,
		agentDir: attempt.agentDir,
		config: attempt.config,
		prompt: attempt.prompt,
		timeoutMs: attempt.timeoutMs,
		runTimeoutOverrideMs: attempt.runTimeoutOverrideMs,
		runId: attempt.runId,
		abortSignal: attempt.abortSignal,
		onExecutionStarted: attempt.onExecutionStarted,
		onExecutionPhase: attempt.onExecutionPhase,
		onLaneWait: attempt.onLaneWait,
		onRunProgress: attempt.onRunProgress,
		onAgentEvent: attempt.onAgentEvent,
		deferTerminalLifecycle: attempt.deferTerminalLifecycle,
		onAttemptTimeoutArmed: attempt.onAttemptTimeoutArmed,
		onAttemptDeadlineChanged: attempt.onAttemptDeadlineChanged,
		onAttemptTimeout: attempt.onAttemptTimeout,
		onAttemptAbort: attempt.onAttemptAbort,
		preparedModelRuntime: attempt.preparedModelRuntime,
		sessionFile: attempt.sessionFile,
		sessionManager: attempt.sessionManager,
		sessionPersistence: attempt.sessionPersistence,
		prepareAssistantTranscriptMessage: attempt.prepareAssistantTranscriptMessage,
		contextTokenBudget: attempt.contextTokenBudget,
		contextWindowInfo: attempt.contextWindowInfo,
		resolvedApiKey: attempt.resolvedApiKey,
		authProfileId: attempt.authProfileId,
		authProfileIdSource: attempt.authProfileIdSource,
		provider: attempt.provider,
		modelId: attempt.modelId,
		requestedModelId: attempt.requestedModelId,
		agentHarnessId: attempt.agentHarnessId,
		runtimePlan: attempt.runtimePlan,
		model: attempt.model,
		authStorage: attempt.authStorage,
		authProfileStore: attempt.authProfileStore,
		toolAuthProfileStore: attempt.toolAuthProfileStore,
		modelRegistry: attempt.modelRegistry,
		thinkLevel: attempt.thinkLevel,
		fastMode: attempt.fastMode,
		fastModeAuto: attempt.fastModeAuto,
		operation: "settled-tool-finalization",
		disableTools: true,
		disableTrajectory: true,
		skipPreparedUserTurnMessage: true,
		suppressNextUserMessagePersistence: true,
		initialReplayState: {
			replayInvalid: false,
			hadPotentialSideEffects: false
		}
	};
}
function createOpenClawAgentHarness() {
	const harness = {
		...BUILTIN_AGENT_HARNESS_METADATA,
		supportsTurnScopedToolRestrictions: true,
		runAttempt: (params) => runEmbeddedAttempt({
			...params,
			supportsTurnScopedToolRestrictions: harnessSupportsTurnScopedToolRestrictions(harness)
		}),
		runIsolatedCompletionV2: runHostPreparedIsolatedCompletion,
		finalizeSettledTurn: async ({ attempt }) => {
			const result = await runEmbeddedAttempt(buildRestrictedFinalizationAttempt(attempt));
			return projectSettledTurnFinalizationAttemptResult(result);
		}
	};
	builtInOpenClawHarnesses.add(harness);
	return harness;
}
/** Distinguishes the internal runtime from an untrusted harness that copies its public id. */
function isBuiltInOpenClawAgentHarness(harness) {
	return builtInOpenClawHarnesses.has(harness);
}
//#endregion
export { resolveRunLivenessState as A, resolveEmbeddedRunAttemptTerminalOutcome as B, createAttemptCarryover as C, hasYieldContinuationEvidence as D, hasRunContinuationEvidence as E, limitHistoryTurns as F, flushPendingToolResultsAfterIdle as H, isEmbeddedRunTerminalAbort as I, isEmbeddedRunTerminalInterrupted as L, shouldRetryMissingAssistantTurn as M, prepareEmbeddedAttemptPromptExecution as N, resolveIncompleteTurnPayloadText as O, getHistoryLimitFromSessionKey as P, isEmbeddedRunTerminalTimeout as R, markLastProviderPromptContextRejected as S, YIELD_DIAGNOSTIC_TEXT as T, prepareEmbeddedSkills as U, resolveEmbeddedRunAttemptTerminalState as V, logRuntimeToolSchemaQuarantine as W, setCompactionSafeguardCancellation as _, resolveEmbeddedSessionContextLimits as a, clearProviderPromptState as b, collectRegisteredToolNames as c, appendPostCompactionRefreshPrompt as d, readPostCompactionContext as f, getCompactionSafeguardRuntime as g, consumeCompactionSafeguardCancellation as h, resolveAgentRunSessionTarget as i, resolveSilentToolResultReplyPayload as j, resolveReplayInvalidFlag as k, toSessionToolAllowlist as l, isRealConversationMessage as m, isBuiltInOpenClawAgentHarness as n, withReleasableExecutionCapacity as o, createRealConversationClassifier as p, applyAgentRunSessionTargetIdentity as r, collectAllowedToolNames as s, createOpenClawAgentHarness as t, buildEmbeddedExtensionFactories as u, resolveProviderRefusal as v, TRUNCATED_REPLY_NOTICE_TEXT as w, getProviderPromptState as x, createDeferredEmbeddedRunLifecycleManager as y, isEmbeddedRunTimeoutFinal as z };
