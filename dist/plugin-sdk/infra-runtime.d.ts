import { $o as DeliverOutboundPayloadsParams, Bo as enqueueSystemEventEntryFromSdk, Go as peekSystemEventsFromSdk, Gr as generateSecureHex, Ho as hasSystemEventsFromSdk, Jo as resolveSystemEventDeliveryContext, Jr as generateSecureUuid, Ko as SystemEvent, Kr as generateSecureInt, Lo as consumeSelectedSystemEventEntriesFromSdk, Qr as resolveGlobalDedupeCache, Ro as drainSystemEventEntriesFromSdk, Uo as isSystemEventContextChangedFromSdk, Vo as enqueueSystemEventFromSdk, Wo as peekSystemEventEntriesFromSdk, Wr as generateSecureFraction, Xr as DedupeCacheOptions, Yr as DedupeCache, Zr as createDedupeCache, aa as ChannelDirection, cn as formatApprovalDisplayPath, ds as resolveAgentOutboundIdentity, fs as DeliveryQueueStateContext, oa as getChannelActivity, qo as resetSystemEventsForTest, qr as generateSecureToken, sa as recordChannelActivity, ss as QueuedDelivery, us as normalizeOutboundIdentity, zo as drainSystemEventsFromSdk } from "../agent-harness-runtime-CWL0fcg5.js";
import { G as AgentDefaultsConfig, r as OpenClawConfig } from "../types.openclaw-LzSbb55e.js";
import { n as RuntimeEnv } from "../runtime-DlqUc5_p.js";
import { r as sanitizeUntrustedFileName } from "../fs-safe-advanced-CgWxxJBc.js";
import { A as ExecApprovalRequest, B as ExecHost, C as resolvePluginApprovalTimeoutMs, D as EXEC_TARGET_VALUES, E as DEFAULT_EXEC_APPROVAL_TIMEOUT_MS, F as ExecApprovalsDefaults, G as SystemRunApprovalFileOperand, H as ExecSecurity, I as ExecApprovalsFile, J as normalizeExecHost, K as SystemRunApprovalPlan, L as ExecApprovalsResolved, M as ExecApprovalResolved, N as ExecApprovalUnavailableDecision, O as ExecApprovalCommandSpan, P as ExecApprovalsAgent, Q as requireValidExecTarget, R as ExecApprovalsSnapshot, S as resolvePluginApprovalRequestAllowedDecisions, U as ExecTarget, V as ExecMode, W as SystemRunApprovalBinding, X as normalizeExecSecurity, Y as normalizeExecMode, Z as normalizeExecTarget, _ as PluginApprovalResolved, b as buildPluginApprovalRequestMessage, c as DEFAULT_PLUGIN_APPROVAL_DECISIONS, d as PLUGIN_APPROVAL_DESCRIPTION_MAX_LENGTH, et as ExecAllowlistEntry, f as PLUGIN_APPROVAL_DETAIL_MAX_LENGTH, g as PluginApprovalRequestPayload, h as PluginApprovalRequest, j as ExecApprovalRequestPayload, k as ExecApprovalDecision, l as DEFAULT_PLUGIN_APPROVAL_TIMEOUT_MS, m as PluginApprovalActionView, p as PLUGIN_APPROVAL_TITLE_MAX_LENGTH, q as normalizeExecAsk, u as MAX_PLUGIN_APPROVAL_TIMEOUT_MS, v as approvalDecisionLabel, w as truncatePluginApprovalDetail, x as buildPluginApprovalResolvedMessage, y as buildPluginApprovalExpiredMessage, z as ExecAsk } from "../approval-types-DIxuby8L.js";
import { A as OutboundSendDeps, M as resolveLegacyOutboundSendDepKeys, N as resolveOutboundSendDep, j as ResolveOutboundSendDepOptions } from "../types-DOAIO5Ze.js";
import { a as resolveRequiredOsHomeDir, i as resolveRequiredHomeDir, n as resolveHomeRelativePath, o as resolveUserPath, r as resolveOsHomeRelativePath, t as expandHomePrefix } from "../home-dir-zeNXGRsP.js";
import { D as ChannelApprovalNativeDeliveryPlan, E as PreparedChannelNativeApprovalTarget, O as ChannelApprovalNativePlannedTarget, k as resolveChannelNativeApprovalDeliveryPlan } from "../approval-handler-runtime-types-DuldNTAV.js";
import "../deliver-types-CDKM8xJ_.js";
import { o as OutboundIdentity } from "../outbound.types-HYq1MKG1.js";
import { C as resolveSsrFPolicyForUrl, E as ssrfPolicyFromHttpBaseUrlFakeIpHostnameAllowlist, S as resolvePinnedHostnameWithPolicy, T as ssrfPolicyFromHttpBaseUrlAllowedOrigin, _ as isSameSsrFPolicy, a as SsrFBlockedError, b as normalizeHostnameAllowlist, c as assertPublicHostname, d as createPinnedLookup, f as isBlockedHostname, g as isPrivateNetworkAllowedByPolicy, h as isPrivateIpAddress, i as PinnedHostnameOverride, l as closeDispatcher, m as isHostnameAllowedByPattern, n as PinnedDispatcherPolicy, o as SsrFPolicy, p as isBlockedHostnameOrIp, r as PinnedHostname, s as assertHostnameAllowedWithPolicy, t as LookupFn, u as createPinnedDispatcher, v as matchesHostnameAllowlist, w as ssrfPolicyFromHttpBaseUrlAllowedHostname, x as resolvePinnedHostname, y as mergeSsrFPolicies } from "../ssrf-CkjpArdF.js";
import { $ as DiagnosticSessionRecoveryCompletedEvent, A as DiagnosticMessageQueuedEvent, At as emitFailoverEvent, B as DiagnosticRunAttemptEvent, Bt as onDiagnosticEvent, C as DiagnosticMessageDeliveryCompletedEvent, Ct as DiagnosticWebhookErrorEvent, D as DiagnosticMessageDispatchCompletedEvent, Dt as areDiagnosticsEnabledForProcess, E as DiagnosticMessageDeliveryStartedEvent, Et as TrustedToolExecutionEvent, F as DiagnosticModelCallStartedEvent, Ft as emitTrustedSkillUsedDiagnosticEvent, G as DiagnosticSecurityEventActor, Gt as setDiagnosticsEnabledForProcess, H as DiagnosticRunProgressEvent, Ht as onTrustedInternalDiagnosticEvent, I as DiagnosticPayloadLargeEvent, It as getInternalDiagnosticEventSequence, J as DiagnosticSecurityEventPolicy, K as DiagnosticSecurityEventControl, Kt as waitForDiagnosticEventsDrained, L as DiagnosticPhaseCompletedEvent, Lt as hasPendingInternalDiagnosticEvent, M as DiagnosticModelCallCompletedEvent, Mt as emitTrustedDiagnosticEvent, N as DiagnosticModelCallContent, Nt as emitTrustedDiagnosticEventWithPrivateData, O as DiagnosticMessageDispatchStartedEvent, Ot as emitDiagnosticEvent, P as DiagnosticModelCallErrorEvent, Pt as emitTrustedSecurityEvent, Q as DiagnosticSessionLongRunningEvent, R as DiagnosticPhaseDetails, Rt as isDiagnosticsEnabled, S as DiagnosticMemorySampleEvent, St as DiagnosticUsageEvent, T as DiagnosticMessageDeliveryKind, Tt as DiagnosticWebhookReceivedEvent, U as DiagnosticRunStartedEvent, Ut as onTrustedToolExecutionEvent, V as DiagnosticRunCompletedEvent, Vt as onInternalDiagnosticEvent, W as DiagnosticSecurityEvent, Wt as resetDiagnosticEventsForTest, X as DiagnosticSessionActiveWorkKind, Y as DiagnosticSecurityEventTarget, Z as DiagnosticSessionAttentionClassification, _ as DiagnosticLaneEnqueueEvent, _t as DiagnosticToolExecutionStartedEvent, a as DiagnosticEventPayload, at as DiagnosticSessionStuckEvent, b as DiagnosticLogRecordEvent, bt as DiagnosticToolSource, c as DiagnosticExecProcessCompletedEvent, ct as DiagnosticSkillTelemetrySource, d as DiagnosticHarnessRunErrorEvent, dt as DiagnosticTalkEvent, et as DiagnosticSessionRecoveryRequestedEvent, f as DiagnosticHarnessRunOutcome, ft as DiagnosticTelemetryExporterEvent, g as DiagnosticLaneDequeueEvent, gt as DiagnosticToolExecutionErrorEvent, h as DiagnosticHeartbeatEvent, ht as DiagnosticToolExecutionCompletedEvent, i as DiagnosticEventMetadata, it as DiagnosticSessionStateEvent, j as DiagnosticMessageReceivedEvent, jt as emitInternalDiagnosticEvent, k as DiagnosticMessageProcessedEvent, kt as emitDiagnosticEventWithTrustedTraceContext, l as DiagnosticFailoverEvent, lt as DiagnosticSkillUsagePrivateData, m as DiagnosticHarnessRunStartedEvent, mt as DiagnosticToolExecutionBlockedEvent, n as DiagnosticContextAssembledEvent, nt as DiagnosticSessionStalledEvent, o as DiagnosticEventPrivateData, ot as DiagnosticSessionTurnCreatedEvent, p as DiagnosticHarnessRunPhase, pt as DiagnosticToolCallContent, q as DiagnosticSecurityEventInput, qt as DiagnosticMemoryUsage, r as DiagnosticEventInput, rt as DiagnosticSessionState, s as DiagnosticExecApprovalFollowupSuppressedEvent, st as DiagnosticSkillActivation, t as DiagnosticAsyncQueueDroppedEvent, tt as DiagnosticSessionRecoveryStatus, u as DiagnosticHarnessRunCompletedEvent, ut as DiagnosticSkillUsedEvent, v as DiagnosticLivenessWarningEvent, vt as DiagnosticToolLoopEvent, w as DiagnosticMessageDeliveryErrorEvent, wt as DiagnosticWebhookProcessedEvent, x as DiagnosticMemoryPressureEvent, xt as DiagnosticToolTerminalReason, y as DiagnosticLivenessWarningReason, yt as DiagnosticToolParamsSummary, z as DiagnosticPhaseSnapshot, zt as isInternalDiagnosticEventMetadata } from "../diagnostic-events-Bs1JVD6b.js";
import { A as readFileWithinRoot, B as resolveRegularFileAppendFlags, C as ensureAbsoluteDirectory, D as openLocalFileSafely, E as movePathToTrash, F as readSecureFile, G as walkDirectorySync, H as statRegularFile, I as resolveAbsolutePathForRead, J as writeFileWithinRoot, K as withTimeout, L as resolveAbsolutePathForWrite, M as readLocalFileSafely, N as readRegularFile, O as pathExists, P as readRegularFileSync, R as resolveLocalPathFromRootsSync, S as canonicalPathFromExistingAncestor, T as isPathInside, U as statRegularFileSync, V as root, W as walkDirectory, _ as WalkDirectoryOptions, a as ExternalFileWriteResult, b as appendRegularFileSync, c as MovePathToTrashOptions, d as ResolvedAbsolutePath, f as ResolvedWritableAbsolutePath, g as WalkDirectoryEntry, h as SecureFileReadResult, i as ExternalFileWriteOptions, j as readLocalFileFromRoots, k as pathExistsSync, l as OpenResult, m as SecureFileReadOptions, n as EnsureAbsoluteDirectoryOptions, o as FsSafeError, p as Root, q as writeExternalFileWithinRoot, r as EnsureAbsoluteDirectoryResult, s as FsSafeErrorCode, t as AbsolutePathSymlinkPolicy, u as ReadResult, v as WalkDirectoryResult, w as findExistingAncestor, x as assertAbsolutePathInput, y as appendRegularFile, z as resolveOpenedFileRealPathForHandle } from "../fs-safe-DBBalKLY.js";
import { a as stringifyNonErrorCause, i as readErrorName, n as collectErrorGraphCandidates, o as toErrorObject, r as extractErrorCode } from "../error-coercion-vrFGEpI-.js";
import { A as positiveSecondsToSafeMilliseconds, C as finiteSecondsToTimerSafeMilliseconds, D as parseStrictInteger, E as parseStrictFiniteNumber, M as resolveExpiresAtMsFromDurationSeconds, N as resolveExpiresAtMsFromEpochSeconds, O as parseStrictNonNegativeInteger, P as resolveNonNegativeIntegerOption, S as clampTimerTimeoutMs, T as parseFiniteNumber, g as MAX_TIMER_TIMEOUT_SECONDS, h as MAX_TIMER_TIMEOUT_MS, j as resolveExpiresAtMsFromDurationOrEpoch, k as parseStrictPositiveInteger, w as nonNegativeSecondsToSafeMilliseconds } from "../string-normalization-DRTeWkJT.js";
import { c as RetryConfig, d as computeBackoff, f as resolveRetryConfig, l as RetryInfo, p as sleepWithAbort, s as BackoffPolicy, u as RetryOptions } from "../globals-BkKO3lYj.js";
import { a as ReadRequestBodyOptions, c as RequestBodyLimitGuard, d as isRequestBodyLimitError, f as readJsonBodyWithLimit, h as testApi, i as ReadJsonBodyResult, l as RequestBodyLimitGuardOptions, m as requestBodyErrorToText, n as DEFAULT_WEBHOOK_MAX_BODY_BYTES, o as RequestBodyLimitError, p as readRequestBodyWithLimit, r as ReadJsonBodyOptions, s as RequestBodyLimitErrorCode, t as DEFAULT_WEBHOOK_BODY_TIMEOUT_MS, u as installRequestBodyLimitGuard } from "../http-body-BodHsDOM.js";
import { a as GUARDED_FETCH_MODE, d as retainSafeHeadersForCrossOriginRedirectHeaders, f as withStrictGuardedFetchMode, h as fetchWithRuntimeDispatcher, l as GuardedFetchResult, m as withTrustedExplicitProxyGuardedFetchMode, o as GuardedFetchMode, p as withTrustedEnvProxyGuardedFetchMode, s as GuardedFetchOptions, u as fetchWithSsrFGuard } from "../net-BcWp0lhu.js";
import { a as isWindowsNetworkPath, c as EnvHttpProxyAgentProxyOptions, d as hasEnvHttpProxyConfigured, f as hasProxyEnvConfigured, g as shouldUseEnvHttpProxyForUrl, h as resolveEnvHttpProxyUrl, i as hasEncodedFileUrlSeparator, l as PROXY_ENV_KEYS, m as resolveEnvHttpProxyAgentOptions, n as assertNoWindowsNetworkPath, o as safeFileURLToPath, p as matchesNoProxy, r as basenameFromMediaSource, s as trySafeFileURLToPath, t as normalizeHostname, u as hasEnvHttpProxyAgentConfigured } from "../hostname-x0B--rdn.js";
import { $ as resolveAllowAlwaysPatterns, A as restoreExecApprovalsSnapshot, B as ExecApprovalsDefaultOverrides, C as requiresExecApproval, D as ensureExecApprovals, E as resolveExecApprovalUnavailableDecisions, F as resolveExecApprovalsPath, G as SkillBinTrustEntry, H as ExecAllowlistAnalysis, I as resolveExecApprovalsSocketPath, J as evaluateShellAllowlist, K as evaluateExecAllowlist, L as resolveExecApprovalsTranscriptPath, M as DEFAULT_EXEC_APPROVAL_ASK_FALLBACK, N as mergeExecApprovalsSocketDefaults, O as loadExecApprovals, P as resolveExecApprovalsDisplayPath, Q as resolveAllowAlwaysPatternEntries, R as AllowAlwaysPersistenceDecision, S as normalizeExecApprovalUnavailableDecisions, T as resolveExecApprovalRequestAllowedDecisions, U as ExecAllowlistEvaluation, V as AllowAlwaysPattern, W as ExecSegmentSatisfiedBy, X as isSafeBinUsage, Y as evaluateShellAllowlistWithAuthorization, Z as normalizeSafeBins, _ as OPTIONAL_EXEC_APPROVAL_DECISIONS, _t as resolveExecutionTargetTrustPath, a as recordAllowlistMatchesUse, at as ExecArgvToken, bt as resolvePolicyTargetResolution, c as addDurableCommandApproval, ct as parseExecArgvToken, d as hasNodeCommandAllowAlwaysMarker, dt as resolveApprovalAuditTrustPath, et as resolveSafeBins, f as persistAllowAlwaysDecision, ft as resolveCommandResolution, g as DEFAULT_EXEC_APPROVAL_DECISIONS, gt as resolveExecutionTargetResolution, h as resolveAllowAlwaysPersistenceDecision, ht as resolveExecutionTargetCandidatePath, i as requestExecApprovalViaSocket, it as CommandResolution, j as saveExecApprovals, k as readExecApprovalsSnapshot, l as hasDurableExecApproval, lt as resolveAllowlistCandidatePath, m as resolveAllowAlwaysPatternCoverage, mt as resolveExecutableTrustPath, n as resolveExecApprovals, nt as ExecCommandSegment, o as recordAllowlistUse, ot as ExecutableResolution, p as persistAllowAlwaysPatterns, pt as resolveCommandResolutionFromArgv, q as evaluateExecAllowlistWithAuthorization, r as resolveExecApprovalsFromFile, rt as ShellChainOperator, s as addAllowlistEntry, st as matchAllowlist, t as normalizeExecApprovals, tt as ExecCommandAnalysis, u as hasExactCommandDurableExecApproval, ut as resolveApprovalAuditCandidatePath, v as commandRequiresSecurityAuditSuppressionApproval, vt as resolvePolicyAllowlistCandidatePath, w as resolveExecApprovalAllowedDecisions, xt as resolvePolicyTargetTrustPath, y as isExecApprovalDecisionAllowed, yt as resolvePolicyTargetCandidatePath, z as AllowAlwaysPersistenceReason } from "../exec-approvals-BN7bizpP.js";
import { n as formatUncaughtError, t as formatErrorMessage } from "../errors-D-udqO7F.js";
import { C as normalizeZaiEnv, S as normalizeEnv, T as retryAsync, _ as formatDurationPrecise, a as resetWSLStateForTests, b as isTruthyEnvValue, c as ensureGlobalUndiciEnvProxyDispatcher, d as globalUndiciStreamTimeoutMs, f as resetGlobalUndiciStreamTimeoutsForTests, g as formatDurationHuman, h as formatDurationCompact, i as isWSLSync, l as ensureGlobalUndiciStreamTimeouts, m as FormatDurationSecondsOptions, n as isWSL2Sync, o as DEFAULT_UNDICI_STREAM_TIMEOUT_MS, p as FormatDurationCompactOptions, r as isWSLEnv, s as ensureGlobalUndiciDispatcherStreamTimeouts, t as isWSL, u as forceResetGlobalDispatcher, v as formatDurationSeconds, w as resolveEnvNormalizationKeys, x as logAcceptedEnvOption, y as expandEnvNormalizationKeys } from "../wsl-DFRn_LY6.js";
import { a as SecretFileReadResult, d as writePrivateSecretFileAtomic, i as SecretFileReadOptions, l as readSecretFileSync, n as PRIVATE_SECRET_DIR_MODE, r as PRIVATE_SECRET_FILE_MODE, s as loadSecretFileSync, t as DEFAULT_SECRET_FILE_MAX_BYTES, u as tryReadSecretFileSync } from "../secret-file-DwypAJjM.js";
import { S as parseExecApprovalCommandText, _ as buildTypedExecApprovalPendingReplyPayload, a as ExecApprovalUnavailableReason, b as getExecApprovalApproverDmNoticeText, c as buildApprovalButtonPresentation, d as buildExecApprovalCommandText, f as buildExecApprovalPendingReplyPayload, g as buildTypedApprovalPresentation, h as buildTypedApprovalActionDescriptors, i as ExecApprovalReplyMetadata, l as buildApprovalPresentationFromActionDescriptors, m as buildExecApprovalUnavailableReplyPayload, n as ExecApprovalPendingReplyParams, o as ExecApprovalUnavailableReplyParams, p as buildExecApprovalPresentation, r as ExecApprovalReplyDecision, s as TypedApprovalActionDescriptor, t as ExecApprovalActionDescriptor, u as buildExecApprovalActionDescriptors, v as buildTypedExecApprovalPresentation, x as getExecApprovalReplyMetadata, y as formatExecApprovalExpiresIn } from "../exec-approval-reply-ZUfh_LBI.js";
import { a as resolveApprovalRequestSessionTarget, i as resolveApprovalRequestSessionConversation, n as ExecApprovalSessionTarget, o as resolveExecApprovalSessionTarget, r as resolveApprovalRequestOriginTarget, t as ApprovalRequestSessionConversation } from "../exec-approval-session-target-D8fbKOxi.js";
import { a as ExecApprovalChannelRuntimeAdapter, i as ExecApprovalChannelRuntime, n as createExecApprovalChannelRuntime, r as isExecApprovalChannelRuntimeTerminalStartError, t as ExecApprovalChannelRuntimeTerminalStartError } from "../exec-approval-channel-runtime-BUGbkn7z.js";
import { t as resolveExecApprovalCommandDisplay } from "../exec-approval-command-display-O6-bJw3K.js";
import { n as deliverApprovalRequestViaChannelNativePlan, t as createChannelNativeApprovalRuntime } from "../approval-native-runtime-D_j-xIVB.js";
import { i as normalizeScpRemotePath, n as isSafeScpRemotePath, r as normalizeScpRemoteHost, t as isSafeScpRemoteHost } from "../scp-host-yP_sSiFf.js";
import { n as createRuntimeOutboundDelegates } from "../runtime-forwarders-B1YzHLS2.js";
import { t as sanitizeForPlainText } from "../sanitize-text-CVPN3pRC.js";
import { t as pruneMapToMaxSize } from "../map-size-Cxg6PuCO.js";
import { n as matchesDiagnosticFlag, r as resolveDiagnosticFlags, t as isDiagnosticFlagEnabled } from "../diagnostic-flags-Coc74pfh.js";
import { n as buildTimeoutAbortSignal, r as fetchWithTimeout, t as bindAbortRelay } from "../fetch-timeout-D2yvPshT.js";
import { a as acquireFileLock, c as withFileLock, i as FileLockTimeoutError, n as FileLockHandle, o as drainFileLockStateForTest, r as FileLockOptions, s as resetFileLockStateForTest, t as FILE_LOCK_TIMEOUT_ERROR_CODE } from "../file-lock-xrL5_hu3.js";
import { _ as writeJsonAtomic, a as readJson, c as readJsonFileSync, d as readRootJsonObjectSync, f as readRootJsonSync, g as writeJson, h as tryReadJsonSync, i as readDurableJsonFile, l as readJsonIfExists, m as tryReadJson, n as WriteTextAtomicOptions, o as readJsonFile, p as readRootStructuredFileSync, r as createAsyncLock, s as readJsonFileStrict, t as JsonFileReadError, u as readJsonSync, v as writeJsonSync, y as writeTextAtomic } from "../json-files-6Aff0MDp.js";
import { n as hasSystemMark, r as prefixSystemMessage, t as SYSTEM_MARK } from "../system-message-CItK8lzT.js";
import { n as ResolvePreferredOpenClawTmpDirOptions, r as resolvePreferredOpenClawTmpDir, t as DEFAULT_POSIX_TMP_ROOT } from "../tmp-openclaw-dir-BVXh5Mbm.js";
import { a as isPrivateNetworkOptInEnabled, c as ssrfPolicyFromDangerouslyAllowPrivateNetwork, d as hasLegacyFlatAllowPrivateNetworkAlias, f as migrateLegacyFlatAllowPrivateNetworkAlias, i as isHttpsUrlAllowedByHostnameSuffixAllowlist, l as ssrfPolicyFromPrivateNetworkOptIn, n as assertHttpUrlTargetsPrivateNetwork, o as normalizeHostnameSuffixAllowlist, r as buildHostnameAllowlistPolicyFromSuffixAllowlist, s as ssrfPolicyFromAllowPrivateNetwork, t as PrivateNetworkOptInInput, u as createLegacyPrivateNetworkDoctorContract } from "../ssrf-policy-DYIXA4OO.js";
//#region packages/normalization-core/src/home-dir.d.ts
export declare function resolveOsHomeDir(env?: NodeJS.ProcessEnv, homedir?: () => string): string | undefined;
export declare function resolveEffectiveHomeDir(env?: NodeJS.ProcessEnv, homedir?: () => string, options?: {
  preserveUnresolvedTilde?: boolean;
}): string | undefined;
//#endregion
//#region src/infra/exec-argv-analysis.d.ts
export declare function analyzeArgvCommand(params: {
  argv: string[];
  cwd?: string;
  env?: NodeJS.ProcessEnv;
  platform?: string | null;
}): ExecCommandAnalysis;
//#endregion
//#region src/infra/windows-shell-command.d.ts
export declare function tokenizeWindowsSegment(segment: string): string[] | null;
export declare function analyzeWindowsShellCommand(params: {
  command: string;
  cwd?: string;
  env?: NodeJS.ProcessEnv;
  platform?: string | null;
}): ExecCommandAnalysis;
export declare function isWindowsPlatform(platform?: string | null): boolean;
export declare function windowsEscapeArg(value: string): {
  ok: true;
  escaped: string;
} | {
  ok: false;
};
//#endregion
//#region src/infra/exec-approvals-analysis.d.ts
export declare function resolvePlannedSegmentArgv(segment: ExecCommandSegment): string[] | null;
export declare function buildEnforcedShellCommand(params: {
  command: string;
  segments: ExecCommandSegment[];
  platform?: string | null;
}): {
  ok: boolean;
  command?: string;
  reason?: string;
};
//#endregion
//#region src/infra/errno.d.ts
/** Type guard for NodeJS.ErrnoException (any object with a `code` property). */
export declare function isErrno(err: unknown): err is NodeJS.ErrnoException;
/** Checks whether an errno-shaped value has the exact code. */
export declare function hasErrnoCode(err: unknown, code: string): boolean;
//#endregion
//#region src/infra/outbound/protocol-scaffolding.d.ts
export declare function stripInternalRuntimeScaffolding(text: string): string;
//#endregion
//#region src/infra/delivery-recovery.shared.d.ts
type DeliveryRecoveryDrainDecision = {
  match: boolean;
  bypassBackoff?: boolean;
};
//#endregion
//#region src/infra/outbound/delivery-queue-recovery.d.ts
type DeliverFn = (params: DeliverOutboundPayloadsParams) => Promise<unknown>;
type InternalRecoveryDeliver = (params: DeliverOutboundPayloadsParams, context: DeliveryQueueStateContext) => Promise<unknown>;
interface RecoveryLogger {
  info(msg: string): void;
  warn(msg: string): void;
  error(msg: string): void;
}
declare function drainPendingDeliveriesCore(params: {
  drainKey: string;
  logLabel: string;
  cfg: OpenClawConfig;
  log: RecoveryLogger;
  stateDir?: string;
  deliver: DeliverFn;
  selectEntry: (entry: QueuedDelivery, now: number) => DeliveryRecoveryDrainDecision;
  shouldContinue?: () => boolean;
}, internalDeliver?: InternalRecoveryDeliver, stateContext?: DeliveryQueueStateContext): Promise<void>;
//#endregion
//#region src/plugin-sdk/delivery-queue-runtime.d.ts
type DrainPendingDeliveriesOptions = Omit<Parameters<typeof drainPendingDeliveriesCore>[0], "deliver"> & {
  /** Optional delivery implementation for tests or plugin-owned send paths. */
  deliver?: DeliverFn;
};
/**
 * Drain queued outbound payloads after a channel reconnect or transport recovery.
 * When no deliver function is provided, the heavy outbound delivery runtime is
 * loaded lazily so importing this SDK subpath does not eagerly bind send internals.
 */
export declare function drainPendingDeliveries(opts: DrainPendingDeliveriesOptions): Promise<void>;
//#endregion
//#region src/infra/test-runtime-env.d.ts
/** Detects Vitest/test execution from the env shape used by local and worker processes. */
export declare function isVitestRuntimeEnv(env?: NodeJS.ProcessEnv): boolean;
/** Enables the shared fast-test shortcuts only inside a detected test runtime. */
export declare function isFastTestRuntimeEnv(env?: NodeJS.ProcessEnv): boolean;
//#endregion
//#region src/infra/fetch.d.ts
/**
 * Wraps fetch so Node-compatible duplex bodies, normalized headers, and foreign
 * AbortSignal implementations work against runtimes expecting native signals.
 */
export declare function wrapFetchWithAbortSignal(fetchImpl: typeof fetch): typeof fetch;
/** Resolves an optional fetch implementation, wrapping it when fetch is available. */
export declare function resolveFetch(fetchImpl?: typeof fetch): typeof fetch | undefined;
//#endregion
//#region src/infra/heartbeat-events.d.ts
export type HeartbeatIndicatorType = "ok" | "alert" | "error";
export type HeartbeatEventPayload = {
  ts: number;
  status: "sent" | "ok-empty" | "ok-token" | "skipped" | "failed";
  to?: string;
  accountId?: string;
  preview?: string;
  durationMs?: number;
  hasMedia?: boolean;
  reason?: string;
  /** Operator-facing companion to the machine-stable reason code. */
  message?: string;
  /** The channel this heartbeat was sent to. */
  channel?: string;
  /** Whether the message was silently suppressed (showOk: false). */
  silent?: boolean;
  /** Indicator type for UI status display. */
  indicatorType?: HeartbeatIndicatorType;
};
export declare function resolveIndicatorType(status: HeartbeatEventPayload["status"]): HeartbeatIndicatorType | undefined;
export declare function emitHeartbeatEvent(evt: Omit<HeartbeatEventPayload, "ts">): void;
export declare function onHeartbeatEvent(listener: (evt: HeartbeatEventPayload) => void): () => void;
export declare function getLastHeartbeatEvent(): HeartbeatEventPayload | null;
export declare function resetHeartbeatEventsForTest(): void;
//#endregion
//#region src/infra/heartbeat-config.d.ts
type HeartbeatConfig = AgentDefaultsConfig["heartbeat"];
/** Resolve the cadence owned by the effective heartbeat configuration. */
export declare function resolveHeartbeatIntervalMs(cfg: OpenClawConfig, overrideEvery?: string, heartbeat?: HeartbeatConfig): number | null;
//#endregion
//#region src/infra/heartbeat-summary-projection.d.ts
/** Normalized heartbeat configuration for one agent. */
type HeartbeatSummary = {
  enabled: boolean;
  every: string;
  everyMs: number | null;
  prompt: string;
  target: string;
  model?: string;
  session?: string;
  ackMaxChars: number;
};
//#endregion
//#region src/infra/heartbeat-summary.d.ts
/** Return whether heartbeat scheduling applies to an agent. */
export declare function isHeartbeatEnabledForAgent(cfg: OpenClawConfig, agentId?: string): boolean;
/** Resolve display-ready heartbeat settings for an agent. */
export declare function resolveHeartbeatSummaryForAgent(cfg: OpenClawConfig, agentId?: string): HeartbeatSummary;
//#endregion
//#region src/infra/heartbeat-visibility.d.ts
/** Resolved heartbeat presentation toggles after defaults/channel/account precedence. */
export type ResolvedHeartbeatVisibility = {
  /** Whether successful heartbeat content should be sent as visible chat text. */
  showOk: boolean;
  /** Whether warning/error heartbeat content should be sent as visible chat text. */
  showAlerts: boolean;
  /** Whether heartbeat status should emit indicator events for UI surfaces. */
  useIndicator: boolean;
};
/** Resolves heartbeat visibility for a channel, applying account > channel > defaults precedence. */
export declare function resolveHeartbeatVisibility(params: {
  cfg: OpenClawConfig;
  channel: string;
  accountId?: string;
}): ResolvedHeartbeatVisibility;
//#endregion
//#region src/infra/net/proxy-fetch.d.ts
/** Non-enumerable marker used to recover the explicit proxy URL from proxy fetch wrappers. */
export declare const PROXY_FETCH_PROXY_URL: unique symbol;
/**
 * Create a fetch function that routes requests through the given HTTP proxy.
 * Uses undici's ProxyAgent under the hood.
 */
export declare function makeProxyFetch(proxyUrl: string): typeof fetch;
/** Return the explicit proxy URL attached by {@link makeProxyFetch}, if present. */
export declare function getProxyUrlFromFetch(fetchImpl?: typeof fetch): string | undefined;
/**
 * Resolve a proxy-aware fetch from standard environment variables.
 * Respects NO_PROXY / no_proxy exclusions via undici's EnvHttpProxyAgent.
 * Returns undefined when no proxy is configured.
 * Gracefully returns undefined if the proxy URL is malformed.
 */
export declare function resolveProxyFetchFromEnv(env?: NodeJS.ProcessEnv): typeof fetch | undefined;
//#endregion
//#region src/infra/retry-policy.d.ts
/** Runs an async operation with a policy-specific retry wrapper and optional log label. */
export type RetryRunner = <T>(fn: () => Promise<T>, label?: string) => Promise<T>;
/** Default retry envelope for channel API operations that hit transient network edges. */
export declare const CHANNEL_API_RETRY_DEFAULTS: {
  attempts: number;
  minDelayMs: number;
  maxDelayMs: number;
  jitter: number;
};
/** Creates a generic rate-limit-aware retry runner from explicit retry policy pieces. */
export declare function createRateLimitRetryRunner(params: {
  retry?: RetryConfig;
  configRetry?: RetryConfig;
  verbose?: boolean;
  defaults: Required<RetryConfig>;
  logLabel: string;
  shouldRetry: (err: unknown) => boolean;
  retryAfterMs?: (err: unknown) => number | undefined;
}): RetryRunner;
/** Creates the channel API retry runner used by outbound messaging integrations. */
export declare function createChannelApiRetryRunner(params: {
  retry?: RetryConfig;
  configRetry?: RetryConfig;
  verbose?: boolean;
  retryAfterMaxDelayMs?: number;
  shouldRetry?: RetryOptions["shouldRetry"];
  retryAfterMs?: RetryOptions["retryAfterMs"];
  /**
   * When true, the custom shouldRetry predicate is used exclusively —
   * the default channel API fallback regex is NOT OR'd in.
   * Use this for non-idempotent operations (e.g. sendMessage) where
   * the regex fallback would cause duplicate message delivery.
   */
  strictShouldRetry?: boolean;
}): RetryRunner;
//#endregion
//#region src/infra/transport-ready.d.ts
/** Result returned by one transport readiness probe attempt. */
export type TransportReadyResult = {
  ok: boolean;
  error?: string | null;
};
/** Parameters for polling a channel transport until it can accept runtime work. */
export type WaitForTransportReadyParams = {
  label: string;
  timeoutMs: number;
  logAfterMs?: number;
  logIntervalMs?: number;
  pollIntervalMs?: number;
  abortSignal?: AbortSignal;
  runtime: RuntimeEnv;
  check: () => Promise<TransportReadyResult>;
};
/**
 * Polls a channel transport readiness probe until it succeeds, times out, or aborts.
 *
 * Used by channel plugins that start external daemons or subscribe to local transports before
 * processing inbound events, with bounded retry logging through the caller's runtime sink.
 */
export declare function waitForTransportReady(params: WaitForTransportReadyParams): Promise<void>;
//#endregion
//#region src/utils/run-with-concurrency.d.ts
/** Controls whether the worker pool keeps scheduling after a task failure. */
export type ConcurrencyErrorMode = "continue" | "stop";
/** Options for running a fixed list of promise factories through a bounded worker pool. */
export type RunTasksWithConcurrencyOptions<T> = {
  /** Task factories are started lazily so the helper can enforce `limit`. */
  tasks: Array<() => Promise<T>>;
  /** Maximum number of tasks allowed to run at the same time; clamped to at least one. */
  limit: number;
  /** `stop` prevents new work after the first failure; in-flight workers still settle. */
  errorMode?: ConcurrencyErrorMode;
  /** Reject immediately on a task failure instead of returning aggregate error state. */
  throwOnError?: boolean;
  /** Called once per failed task with the original task index. */
  onTaskError?: (error: unknown, index: number) => void;
};
/** Ordered task results plus aggregate error state for callers that keep partial success. */
export type RunTasksWithConcurrencyResult<T> = {
  /** Results are written at their original task indexes; failed or unscheduled indexes stay empty. */
  results: T[];
  /** First task error observed by the worker pool, if any. */
  firstError: unknown;
  /** True when at least one task rejected. */
  hasError: boolean;
};
/** Runs async tasks with bounded concurrency while preserving result indexes. */
export declare function runTasksWithConcurrency<T>(params: RunTasksWithConcurrencyOptions<T>): Promise<RunTasksWithConcurrencyResult<T>>;
//#endregion
//#region src/plugin-sdk/infra-runtime.d.ts
/** @deprecated Shipped compat only (removed from core in #104546); no core caller. Removal with the next plugin-SDK major. */
export type ErrorKind = "refusal" | "timeout" | "rate_limit" | "context_length" | "unknown";
/**
 * @deprecated Shipped compat only; preserves the old substring semantics for
 * external plugins. Core chat classification now maps canonical failover
 * reasons (see gateway resolveChatErrorKindFromError). Removal with the next
 * plugin-SDK major.
 */
export declare function detectErrorKind(err: unknown): ErrorKind | undefined;
//#endregion
export { type AbsolutePathSymlinkPolicy, type AllowAlwaysPattern, type AllowAlwaysPersistenceDecision, type AllowAlwaysPersistenceReason, ApprovalRequestSessionConversation, type BackoffPolicy, ChannelApprovalNativeDeliveryPlan, ChannelApprovalNativePlannedTarget, ChannelDirection, type CommandResolution, DEFAULT_EXEC_APPROVAL_ASK_FALLBACK, DEFAULT_EXEC_APPROVAL_DECISIONS, DEFAULT_EXEC_APPROVAL_TIMEOUT_MS, DEFAULT_PLUGIN_APPROVAL_DECISIONS, DEFAULT_PLUGIN_APPROVAL_TIMEOUT_MS, DEFAULT_POSIX_TMP_ROOT, DEFAULT_SECRET_FILE_MAX_BYTES, DEFAULT_UNDICI_STREAM_TIMEOUT_MS, DEFAULT_WEBHOOK_BODY_TIMEOUT_MS, DEFAULT_WEBHOOK_MAX_BODY_BYTES, DedupeCache, DedupeCacheOptions, type DiagnosticAsyncQueueDroppedEvent, type DiagnosticContextAssembledEvent, type DiagnosticEventInput, type DiagnosticEventMetadata, type DiagnosticEventPayload, type DiagnosticEventPrivateData, type DiagnosticExecApprovalFollowupSuppressedEvent, type DiagnosticExecProcessCompletedEvent, type DiagnosticFailoverEvent, type DiagnosticHarnessRunCompletedEvent, type DiagnosticHarnessRunErrorEvent, type DiagnosticHarnessRunOutcome, type DiagnosticHarnessRunPhase, type DiagnosticHarnessRunStartedEvent, type DiagnosticHeartbeatEvent, type DiagnosticLaneDequeueEvent, type DiagnosticLaneEnqueueEvent, type DiagnosticLivenessWarningEvent, type DiagnosticLivenessWarningReason, type DiagnosticLogRecordEvent, type DiagnosticMemoryPressureEvent, type DiagnosticMemorySampleEvent, type DiagnosticMemoryUsage, type DiagnosticMessageDeliveryCompletedEvent, type DiagnosticMessageDeliveryErrorEvent, type DiagnosticMessageDeliveryKind, type DiagnosticMessageDeliveryStartedEvent, type DiagnosticMessageDispatchCompletedEvent, type DiagnosticMessageDispatchStartedEvent, type DiagnosticMessageProcessedEvent, type DiagnosticMessageQueuedEvent, type DiagnosticMessageReceivedEvent, type DiagnosticModelCallCompletedEvent, type DiagnosticModelCallContent, type DiagnosticModelCallErrorEvent, type DiagnosticModelCallStartedEvent, type DiagnosticPayloadLargeEvent, type DiagnosticPhaseCompletedEvent, type DiagnosticPhaseDetails, type DiagnosticPhaseSnapshot, type DiagnosticRunAttemptEvent, type DiagnosticRunCompletedEvent, type DiagnosticRunProgressEvent, type DiagnosticRunStartedEvent, type DiagnosticSecurityEvent, type DiagnosticSecurityEventActor, type DiagnosticSecurityEventControl, type DiagnosticSecurityEventInput, type DiagnosticSecurityEventPolicy, type DiagnosticSecurityEventTarget, type DiagnosticSessionActiveWorkKind, type DiagnosticSessionAttentionClassification, type DiagnosticSessionLongRunningEvent, type DiagnosticSessionRecoveryCompletedEvent, type DiagnosticSessionRecoveryRequestedEvent, type DiagnosticSessionRecoveryStatus, type DiagnosticSessionStalledEvent, type DiagnosticSessionState, type DiagnosticSessionStateEvent, type DiagnosticSessionStuckEvent, type DiagnosticSessionTurnCreatedEvent, type DiagnosticSkillActivation, type DiagnosticSkillTelemetrySource, type DiagnosticSkillUsagePrivateData, type DiagnosticSkillUsedEvent, type DiagnosticTalkEvent, type DiagnosticTelemetryExporterEvent, type DiagnosticToolCallContent, type DiagnosticToolExecutionBlockedEvent, type DiagnosticToolExecutionCompletedEvent, type DiagnosticToolExecutionErrorEvent, type DiagnosticToolExecutionStartedEvent, type DiagnosticToolLoopEvent, type DiagnosticToolParamsSummary, type DiagnosticToolSource, type DiagnosticToolTerminalReason, type DiagnosticUsageEvent, type DiagnosticWebhookErrorEvent, type DiagnosticWebhookProcessedEvent, type DiagnosticWebhookReceivedEvent, EXEC_TARGET_VALUES, type EnsureAbsoluteDirectoryOptions, type EnsureAbsoluteDirectoryResult, EnvHttpProxyAgentProxyOptions, type ExecAllowlistAnalysis, type ExecAllowlistEntry, type ExecAllowlistEvaluation, ExecApprovalActionDescriptor, type ExecApprovalChannelRuntime, type ExecApprovalChannelRuntimeAdapter, ExecApprovalChannelRuntimeTerminalStartError, type ExecApprovalCommandSpan, type ExecApprovalDecision, ExecApprovalPendingReplyParams, ExecApprovalReplyDecision, ExecApprovalReplyMetadata, type ExecApprovalRequest, type ExecApprovalRequestPayload, type ExecApprovalResolved, ExecApprovalSessionTarget, type ExecApprovalUnavailableDecision, ExecApprovalUnavailableReason, ExecApprovalUnavailableReplyParams, type ExecApprovalsAgent, type ExecApprovalsDefaultOverrides, type ExecApprovalsDefaults, type ExecApprovalsFile, type ExecApprovalsResolved, type ExecApprovalsSnapshot, type ExecArgvToken, type ExecAsk, type ExecCommandAnalysis, type ExecCommandSegment, type ExecHost, type ExecMode, type ExecSecurity, type ExecSegmentSatisfiedBy, type ExecTarget, type ExecutableResolution, ExternalFileWriteOptions, ExternalFileWriteResult, FILE_LOCK_TIMEOUT_ERROR_CODE, type FileLockHandle, type FileLockOptions, type FileLockTimeoutError, FormatDurationCompactOptions, FormatDurationSecondsOptions, FsSafeError, type FsSafeErrorCode, GUARDED_FETCH_MODE, type GuardedFetchMode, type GuardedFetchOptions, type GuardedFetchResult, type HeartbeatSummary, JsonFileReadError, LookupFn, MAX_PLUGIN_APPROVAL_TIMEOUT_MS, MAX_TIMER_TIMEOUT_MS, MAX_TIMER_TIMEOUT_SECONDS, type MovePathToTrashOptions, OPTIONAL_EXEC_APPROVAL_DECISIONS, type OpenResult, type OutboundIdentity, OutboundSendDeps, PLUGIN_APPROVAL_DESCRIPTION_MAX_LENGTH, PLUGIN_APPROVAL_DETAIL_MAX_LENGTH, PLUGIN_APPROVAL_TITLE_MAX_LENGTH, PRIVATE_SECRET_DIR_MODE, PRIVATE_SECRET_FILE_MODE, PROXY_ENV_KEYS, PinnedDispatcherPolicy, PinnedHostname, PinnedHostnameOverride, PluginApprovalActionView, PluginApprovalRequest, PluginApprovalRequestPayload, PluginApprovalResolved, type PreparedChannelNativeApprovalTarget, PrivateNetworkOptInInput, type ReadJsonBodyOptions, type ReadJsonBodyResult, type ReadRequestBodyOptions, type ReadResult, RequestBodyLimitError, type RequestBodyLimitErrorCode, type RequestBodyLimitGuard, type RequestBodyLimitGuardOptions, ResolveOutboundSendDepOptions, ResolvePreferredOpenClawTmpDirOptions, type ResolvedAbsolutePath, type ResolvedWritableAbsolutePath, type RetryConfig, type RetryInfo, type RetryOptions, Root, SYSTEM_MARK, type SecretFileReadOptions, type SecretFileReadResult, type SecureFileReadOptions, type SecureFileReadResult, type ShellChainOperator, type SkillBinTrustEntry, SsrFBlockedError, SsrFPolicy, type SystemEvent, type SystemRunApprovalBinding, type SystemRunApprovalFileOperand, type SystemRunApprovalPlan, type TrustedToolExecutionEvent, TypedApprovalActionDescriptor, type WalkDirectoryEntry, type WalkDirectoryOptions, type WalkDirectoryResult, WriteTextAtomicOptions, testApi as __test__, testApi, acquireFileLock, addAllowlistEntry, addDurableCommandApproval, appendRegularFile, appendRegularFileSync, approvalDecisionLabel, areDiagnosticsEnabledForProcess, assertAbsolutePathInput, assertHostnameAllowedWithPolicy, assertHttpUrlTargetsPrivateNetwork, assertNoWindowsNetworkPath, assertPublicHostname, basenameFromMediaSource, bindAbortRelay, buildApprovalButtonPresentation, buildApprovalPresentationFromActionDescriptors, buildExecApprovalActionDescriptors, buildExecApprovalCommandText, buildExecApprovalPendingReplyPayload, buildExecApprovalPresentation, buildExecApprovalUnavailableReplyPayload, buildHostnameAllowlistPolicyFromSuffixAllowlist, buildPluginApprovalExpiredMessage, buildPluginApprovalRequestMessage, buildPluginApprovalResolvedMessage, buildTimeoutAbortSignal, buildTypedApprovalActionDescriptors, buildTypedApprovalPresentation, buildTypedExecApprovalPendingReplyPayload, buildTypedExecApprovalPresentation, canonicalPathFromExistingAncestor, clampTimerTimeoutMs, closeDispatcher, collectErrorGraphCandidates, commandRequiresSecurityAuditSuppressionApproval, computeBackoff, consumeSelectedSystemEventEntriesFromSdk as consumeSelectedSystemEventEntries, consumeSelectedSystemEventEntriesFromSdk as consumeSystemEventEntries, createAsyncLock, createChannelNativeApprovalRuntime, createDedupeCache, createExecApprovalChannelRuntime, createLegacyPrivateNetworkDoctorContract, createPinnedDispatcher, createPinnedLookup, createRuntimeOutboundDelegates, deliverApprovalRequestViaChannelNativePlan, drainFileLockStateForTest, drainSystemEventEntriesFromSdk as drainSystemEventEntries, drainSystemEventsFromSdk as drainSystemEvents, emitDiagnosticEvent, type emitDiagnosticEventWithTrustedTraceContext, type emitFailoverEvent, type emitInternalDiagnosticEvent, type emitTrustedDiagnosticEvent, type emitTrustedDiagnosticEventWithPrivateData, type emitTrustedSecurityEvent, type emitTrustedSkillUsedDiagnosticEvent, enqueueSystemEventFromSdk as enqueueSystemEvent, enqueueSystemEventEntryFromSdk as enqueueSystemEventEntry, ensureAbsoluteDirectory, ensureExecApprovals, ensureGlobalUndiciDispatcherStreamTimeouts, ensureGlobalUndiciEnvProxyDispatcher, ensureGlobalUndiciStreamTimeouts, evaluateExecAllowlist, evaluateExecAllowlistWithAuthorization, evaluateShellAllowlist, evaluateShellAllowlistWithAuthorization, expandEnvNormalizationKeys, expandHomePrefix, extractErrorCode, fetchWithRuntimeDispatcher, fetchWithSsrFGuard, fetchWithTimeout, findExistingAncestor, finiteSecondsToTimerSafeMilliseconds, forceResetGlobalDispatcher, formatApprovalDisplayPath, formatDurationCompact, formatDurationHuman, formatDurationPrecise, formatDurationSeconds, formatErrorMessage, formatExecApprovalExpiresIn, formatUncaughtError, generateSecureFraction, generateSecureHex, generateSecureInt, generateSecureToken, generateSecureUuid, getChannelActivity, getExecApprovalApproverDmNoticeText, getExecApprovalReplyMetadata, type getInternalDiagnosticEventSequence, globalUndiciStreamTimeoutMs, hasDurableExecApproval, hasEncodedFileUrlSeparator, hasEnvHttpProxyAgentConfigured, hasEnvHttpProxyConfigured, hasExactCommandDurableExecApproval, hasLegacyFlatAllowPrivateNetworkAlias, hasNodeCommandAllowAlwaysMarker, type hasPendingInternalDiagnosticEvent, hasProxyEnvConfigured, hasSystemEventsFromSdk as hasSystemEvents, hasSystemMark, installRequestBodyLimitGuard, isBlockedHostname, isBlockedHostnameOrIp, isDiagnosticFlagEnabled, isDiagnosticsEnabled, isExecApprovalChannelRuntimeTerminalStartError, isExecApprovalDecisionAllowed, isHostnameAllowedByPattern, isHttpsUrlAllowedByHostnameSuffixAllowlist, type isInternalDiagnosticEventMetadata, isPathInside, isPrivateIpAddress, isPrivateNetworkAllowedByPolicy, isPrivateNetworkOptInEnabled, isRequestBodyLimitError, isSafeBinUsage, isSafeScpRemoteHost, isSafeScpRemotePath, isSameSsrFPolicy, isSystemEventContextChangedFromSdk as isSystemEventContextChanged, isTruthyEnvValue, isWSL, isWSL2Sync, isWSLEnv, isWSLSync, isWindowsNetworkPath, loadExecApprovals, loadSecretFileSync, logAcceptedEnvOption, matchAllowlist, matchesDiagnosticFlag, matchesHostnameAllowlist, matchesNoProxy, mergeExecApprovalsSocketDefaults, mergeSsrFPolicies, migrateLegacyFlatAllowPrivateNetworkAlias, movePathToTrash, nonNegativeSecondsToSafeMilliseconds, normalizeEnv, normalizeExecApprovalUnavailableDecisions, normalizeExecApprovals, normalizeExecAsk, normalizeExecHost, normalizeExecMode, normalizeExecSecurity, normalizeExecTarget, normalizeHostname, normalizeHostnameAllowlist, normalizeHostnameSuffixAllowlist, normalizeOutboundIdentity, normalizeSafeBins, normalizeScpRemoteHost, normalizeScpRemotePath, normalizeZaiEnv, onDiagnosticEvent, type onInternalDiagnosticEvent, type onTrustedInternalDiagnosticEvent, type onTrustedToolExecutionEvent, openLocalFileSafely, parseExecApprovalCommandText, parseExecArgvToken, parseFiniteNumber, parseStrictFiniteNumber, parseStrictInteger, parseStrictNonNegativeInteger, parseStrictPositiveInteger, pathExists, pathExistsSync, peekSystemEventEntriesFromSdk as peekSystemEventEntries, peekSystemEventsFromSdk as peekSystemEvents, persistAllowAlwaysDecision, persistAllowAlwaysPatterns, positiveSecondsToSafeMilliseconds, prefixSystemMessage, pruneMapToMaxSize, readDurableJsonFile, readErrorName, readExecApprovalsSnapshot, readFileWithinRoot, readJson, readJsonBodyWithLimit, readJsonFile, readJsonFileStrict, readJsonFileSync, readJsonIfExists, readJsonSync, readLocalFileFromRoots, readLocalFileSafely, readRegularFile, readRegularFileSync, readRequestBodyWithLimit, readRootJsonObjectSync, readRootJsonSync, readRootStructuredFileSync, readSecretFileSync, readSecureFile, recordAllowlistMatchesUse, recordAllowlistUse, recordChannelActivity, requestBodyErrorToText, requestExecApprovalViaSocket, requireValidExecTarget, requiresExecApproval, type resetDiagnosticEventsForTest, resetFileLockStateForTest, resetGlobalUndiciStreamTimeoutsForTests, resetSystemEventsForTest, resetWSLStateForTests, resolveAbsolutePathForRead, resolveAbsolutePathForWrite, resolveAgentOutboundIdentity, resolveAllowAlwaysPatternCoverage, resolveAllowAlwaysPatternEntries, resolveAllowAlwaysPatterns, resolveAllowAlwaysPersistenceDecision, resolveAllowlistCandidatePath, resolveApprovalAuditCandidatePath, resolveApprovalAuditTrustPath, resolveApprovalRequestOriginTarget, resolveApprovalRequestSessionConversation, resolveApprovalRequestSessionTarget, resolveChannelNativeApprovalDeliveryPlan, resolveCommandResolution, resolveCommandResolutionFromArgv, resolveNonNegativeIntegerOption as resolveDedupeNonNegativeInteger, resolveDiagnosticFlags, resolveEnvHttpProxyAgentOptions, resolveEnvHttpProxyUrl, resolveEnvNormalizationKeys, resolveExecApprovalAllowedDecisions, resolveExecApprovalCommandDisplay, resolveExecApprovalRequestAllowedDecisions, resolveExecApprovalSessionTarget, resolveExecApprovalUnavailableDecisions, resolveExecApprovals, resolveExecApprovalsDisplayPath, resolveExecApprovalsFromFile, resolveExecApprovalsPath, resolveExecApprovalsSocketPath, resolveExecApprovalsTranscriptPath, resolveExecutableTrustPath, resolveExecutionTargetCandidatePath, resolveExecutionTargetResolution, resolveExecutionTargetTrustPath, resolveExpiresAtMsFromDurationOrEpoch, resolveExpiresAtMsFromDurationSeconds, resolveExpiresAtMsFromEpochSeconds, resolveGlobalDedupeCache, resolveHomeRelativePath, resolveLegacyOutboundSendDepKeys, resolveLocalPathFromRootsSync, resolveOpenedFileRealPathForHandle, resolveOsHomeRelativePath, resolveOutboundSendDep, resolvePinnedHostname, resolvePinnedHostnameWithPolicy, resolvePluginApprovalRequestAllowedDecisions, resolvePluginApprovalTimeoutMs, resolvePolicyAllowlistCandidatePath, resolvePolicyTargetCandidatePath, resolvePolicyTargetResolution, resolvePolicyTargetTrustPath, resolvePreferredOpenClawTmpDir, resolveRegularFileAppendFlags, resolveRequiredHomeDir, resolveRequiredOsHomeDir, resolveRetryConfig, resolveSafeBins, resolveSsrFPolicyForUrl, resolveSystemEventDeliveryContext, resolveUserPath, restoreExecApprovalsSnapshot, retainSafeHeadersForCrossOriginRedirectHeaders, retryAsync, root, safeFileURLToPath, sanitizeForPlainText, sanitizeUntrustedFileName, saveExecApprovals, type setDiagnosticsEnabledForProcess, shouldUseEnvHttpProxyForUrl, sleepWithAbort, ssrfPolicyFromAllowPrivateNetwork, ssrfPolicyFromDangerouslyAllowPrivateNetwork, ssrfPolicyFromHttpBaseUrlAllowedHostname, ssrfPolicyFromHttpBaseUrlAllowedOrigin, ssrfPolicyFromHttpBaseUrlFakeIpHostnameAllowlist, ssrfPolicyFromPrivateNetworkOptIn, statRegularFile, statRegularFileSync, stringifyNonErrorCause, toErrorObject, truncatePluginApprovalDetail, tryReadJson, tryReadJsonSync, tryReadSecretFileSync, trySafeFileURLToPath, type waitForDiagnosticEventsDrained, walkDirectory, walkDirectorySync, withFileLock, withStrictGuardedFetchMode, withTimeout, withTrustedEnvProxyGuardedFetchMode, withTrustedExplicitProxyGuardedFetchMode, writeExternalFileWithinRoot, writeFileWithinRoot, writeJson, writeJsonAtomic, writeJsonSync, writePrivateSecretFileAtomic, writeTextAtomic };