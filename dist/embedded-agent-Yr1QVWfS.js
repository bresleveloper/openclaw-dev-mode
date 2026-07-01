import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
import { t as sanitizeForLog } from "./ansi-zQGMgESZ.js";
import { i as formatErrorMessage, u as toErrorObject } from "./errors-DCRXIYSQ.js";
import { m as resolveUserPath } from "./utils-BApvfmPs.js";
import { C as freezeDiagnosticTraceContext } from "./diagnostic-events-CLCyIzm6.js";
import { t as createSubsystemLogger } from "./subsystem-yNfG7O3v.js";
import { r as hasConfiguredModelFallbacks, y as resolveSessionAgentIds } from "./agent-scope-CDZXADgT.js";
import { c as parseAgentSessionKey } from "./session-key-utils-C7uT9A4s.js";
import { a as resolveAgentDir, o as resolveAgentWorkspaceDir } from "./agent-scope-config-C3ijpoNo.js";
import { r as resolveProviderIdForAuth } from "./provider-auth-aliases-CNlVI3wV.js";
import { a as normalizeOptionalAgentRuntimeId, r as isDefaultAgentRuntimeId } from "./agent-runtime-id-DiL2DId7.js";
import { c as resolveContextConfigProviderForRuntime, i as listOpenAIAuthProfileProvidersForAgentRuntime, n as OPENAI_PROVIDER_ID, r as isOpenAIProvider, u as resolveSelectedOpenAIRuntimeProvider } from "./openai-routing-DXJmS9CT.js";
import { n as resolveAgentHarnessPolicy } from "./harness-runtimes--3bc5qch.js";
import { n as DEFAULT_MODEL, r as DEFAULT_PROVIDER, t as DEFAULT_CONTEXT_TOKENS } from "./defaults-mDjiWzE5.js";
import { i as getRuntimeConfigSnapshot } from "./runtime-snapshot-D93_HOsR.js";
import "./config-A41fTHlt.js";
import { o as resolveSafeTimeoutDelayMs } from "./timeouts-DdTImbzl.js";
import { i as ensureAuthProfileStoreWithoutExternalProfiles, n as ensureAuthProfileStore } from "./store-SfOB_T2S.js";
import { c as emitAgentItemEvent, d as getAgentRunContext, m as registerAgentRunContext, n as captureAgentRunLifecycleGeneration, r as claimAgentRunContext, t as assertAgentRunLifecycleGenerationCurrent, u as getAgentEventLifecycleGeneration, y as withAgentRunLifecycleGeneration } from "./agent-events-7y1r8HOP.js";
import { t as getGlobalHookRunner } from "./hook-runner-global-D4fQSLSV.js";
import { a as getReplyPayloadMetadata, i as copyReplyPayloadMetadata, t as FAST_MODE_AUTO_PROGRESS_KIND } from "./reply-payload-HLWc9ssO.js";
import { o as resolveContextEngine, s as resolveContextEngineOwnerPluginId } from "./registry-BLZQzICr.js";
import { d as resolveStorePath } from "./paths-CHZBIGhF.js";
import { i as isMarkdownCapableMessageChannel } from "./message-channel-B4LS2Kcc.js";
import { P as updateSessionEntry } from "./session-accessor-Dx6KDG0K.js";
import { a as resolveProviderAuthProfileId } from "./provider-hook-runtime-C6uU9bTJ.js";
import { y as prepareProviderRuntimeAuth } from "./provider-runtime-D4NEMgBr.js";
import "./auth-profiles-DWHvUh-t.js";
import { n as markAuthProfileSuccess } from "./profiles-DswMRdru.js";
import { r as resolveSubscriptionAuthModeForProfiles } from "./profile-list-CtT2BW_g.js";
import { o as isProfileInCooldown } from "./usage-state-BFMjBJsu.js";
import { i as resolveAuthProfileOrder, r as resolveAuthProfileEligibility } from "./order-DO7M8GzY.js";
import { t as applyPreparedRuntimeAuthToModel } from "./provider-request-config-B7N9imAw.js";
import { t as redactIdentifier } from "./redact-identifier-DB2Y_vWY.js";
import { t as sanitizeForConsole } from "./console-sanitize-Bf1BpkZq.js";
import { a as markAuthProfileFailure, s as resolveProfilesUnavailableReason } from "./usage-C-fcEbGX.js";
import { b as resolveModelRefFromString, i as buildModelAliasIndex } from "./model-selection-shared-CKMggJal.js";
import { r as ensureOpenClawModelsJson } from "./models-config-ChaTzZG5.js";
import { t as resolveThinkingDefault } from "./model-thinking-default-GwbGGXiw.js";
import { c as resolveDefaultModelForAgent } from "./model-selection-i8V2iTdL.js";
import { t as MissingProviderAuthError } from "./model-auth-runtime-shared-D8fFlbsz.js";
import { a as getApiKeyForModel, g as shouldPreferExplicitConfigApiKeyAuth, n as applyLocalNoAuthHeaderOverride, t as applyAuthHeaderOverride } from "./model-auth-Bvz14MtI.js";
import { n as formatFastModeAutoProgressText, u as resolveFastModeForElapsed } from "./fast-mode-BhVbWk_p.js";
import { n as formatBillingErrorMessage, y as isTimeoutErrorMessage } from "./sanitize-user-facing-text-CRgdQ8Wr.js";
import "./runs-DXoQzrw0.js";
import { n as SILENT_REPLY_TOKEN } from "./tokens-Zsy11rTo.js";
import "./sessions-gBZPP61K.js";
import { n as derivePromptTokens, o as normalizeUsage } from "./usage-C67Kbb7n.js";
import { n as sleepWithAbort } from "./backoff-DPz-g2bN.js";
import "./fast-mode-BHYJgNkm.js";
import { i as enqueueCommandInLane, s as getCommandLaneSnapshot } from "./command-queue-JAuVCy9E.js";
import { D as parseImageSizeError, E as parseImageDimensionError, S as isRateLimitAssistantError, _ as isFailoverErrorMessage, c as formatAssistantErrorText, d as isAuthAssistantError, f as isBillingAssistantError, g as isFailoverAssistantError, m as isCompactionFailureError, n as classifyAssistantFailoverReason, r as classifyFailoverReason, s as extractObservedOverflowTokenCount, v as isGenericUnknownStreamErrorMessage, x as isLikelyContextOverflowError } from "./errors-C4-qHiKh.js";
import { a as describeFailoverError, d as resolveFailoverStatus, i as coerceToFailoverError, t as FailoverError } from "./failover-error-CZc6_Wx_.js";
import { n as OPENCLAW_EMBEDDED_CONTEXT_ENGINE_HOST } from "./host-compat-BibWlia2.js";
import { A as shouldWarnEmbeddedRunStageSummary, B as shouldRetrySilentErrorAssistantTurn, C as createUsageAccumulator, D as EMBEDDED_RUN_ATTEMPT_DISPATCH_STAGE, F as resolveReasoningOnlyRetryInstruction, H as createEmbeddedRunReplayState, I as resolveReplayInvalidFlag, L as resolveRunLivenessState, M as resolveAttemptReplayMetadata, N as resolveEmptyResponseRetryInstruction, O as createEmbeddedRunStageTracker, P as resolveIncompleteTurnPayloadText, R as resolveSilentToolResultReplyPayload, S as scrubAnthropicRefusalMagic, U as observeReplayMetadata, V as shouldTreatEmptyAssistantReplyAsSilent, _ as resolveOverloadFailoverBackoffMs, a as RUNTIME_AUTH_REFRESH_MARGIN_MS, b as resolveReportedModelRef, c as buildErrorAgentMeta, d as isAssistantForModelRef, f as resolveActiveErrorContext, g as resolveNextSameModelRateLimitRetryCount, h as resolveMaxRunRetryIterations, i as selectAgentHarness, j as hasAttemptTerminalState, k as formatEmbeddedRunStageSummary, l as buildUsageAgentMetaFields, m as resolveFinalAssistantVisibleText, o as RUNTIME_AUTH_REFRESH_MIN_DELAY_MS, p as resolveFinalAssistantRawText, r as runAgentHarnessAttempt, s as RUNTIME_AUTH_REFRESH_RETRY_MS, u as createCompactionDiagId, v as resolveOverloadProfileRotationLimit, w as mergeUsageIntoAccumulator, x as resolveSameModelRateLimitRetryDelayMs, y as resolveRateLimitProfileRotationLimit, z as shouldRetryMissingAssistantTurn } from "./selection-AYWRDx3X.js";
import { c as runContextEngineMaintenance, f as buildContextEngineRuntimeSettings, l as waitForDeferredTurnMaintenanceForSession } from "./context-engine-lifecycle-DtOZmi-k.js";
import { f as isStrictAgenticExecutionContractActive } from "./openclaw-tools-CUg87Oi7.js";
import { m as hasOnlyAssistantReasoningContent } from "./openai-transport-stream-CKFLti3C.js";
import { t as log$1 } from "./logger-DibNup0x.js";
import { t as buildAgentHookContextChannelFields } from "./hook-agent-context-ugCMMoT5.js";
import { l as retireSessionMcpRuntime, u as retireSessionMcpRuntimeForSessionKey } from "./agent-bundle-mcp-runtime-BkUYqKo5.js";
import "./agent-bundle-mcp-tools-CJT5lUbs.js";
import { M as shouldRotateCompactionTranscript, i as normalizeContextTokenBudget, j as rotateTranscriptFileAfterCompaction } from "./attempt.model-diagnostic-events-DLRFJ0nE.js";
import "./tool-split-DuZXJ6oO.js";
import { n as resolveProcessToolScopeKey } from "./agent-tools-CeeIc_fl.js";
import { t as resolveToolLoopDetectionConfig } from "./tool-loop-detection-config-Bmiuaekf.js";
import { d as hasMessagingToolDeliveryEvidence, f as hasOutboundDeliveryEvidence } from "./subagent-announce-origin-BvLj7uiM.js";
import { n as resolveGlobalLane, r as resolveSessionLane } from "./lanes-CVttd5qX.js";
import { i as pickFallbackThinkingLevel } from "./embedded-agent-helpers-D_zioqUQ.js";
import { c as resolveSessionSuspensionTarget, f as shouldSuppressRawErrorConsoleSuffix, h as shouldAllowCooldownProbeForReason, l as suspendSession, p as LiveSessionModelSwitchError, s as resolveSessionSuspensionReason, u as buildApiErrorObservationFields } from "./model-fallback-xjR_RHVQ.js";
import { i as resolveStoredSessionKeyForSessionId, r as resolveSessionKeyForRequest } from "./session-DzIpXXzY.js";
import { n as resolveModelAsync } from "./model-Cc001htM.js";
import { t as ensureContextEnginesInitialized } from "./init-BQb7wvth.js";
import { n as resolveEmbeddedCompactionTarget, r as listActiveProcessSessionReferences, t as buildEmbeddedCompactionRuntimeContext } from "./compaction-runtime-context-DiDns5g3.js";
import { l as truncateOversizedToolResultsInSession, o as resolveLiveToolResultMaxChars, s as sessionLikelyHasOversizedToolResults } from "./tool-result-truncation-C_2NT8o3.js";
import { n as runAgentCleanupStep } from "./attempt.tool-run-context-BsQZrex8.js";
import { i as resolveCompactionTimeoutMs, n as compactContextEngineWithSafetyTimeout, r as compactWithSafetyTimeout } from "./tool-result-middleware-DsdFDvXD.js";
import "./extra-params-s21PGVlz.js";
import { m as resolveContextEngineCapabilities, r as forgetPromptBuildDrainCacheForRun } from "./attempt.prompt-helpers-BbRZcTqi.js";
import { a as resolveContextWindowInfo, i as formatContextWindowWarningMessage, n as evaluateContextWindowGuard, r as formatContextWindowBlockMessage } from "./context-window-guard-D9hRipzD.js";
import "./sandbox-info-PP6dNxyz.js";
import { t as buildProviderAuthRecoveryHint } from "./provider-auth-recovery-hint-vNAgIP1r.js";
import { h as resolveSessionCompactionCheckpointReason, i as asCompactionHookRunner, l as runPostCompactionSideEffects, m as resolveCompactionCheckpointTranscriptPosition, n as resolveAgentRunSessionTarget, p as readSessionLeafStateFromTranscriptAsync, r as readAgentModelContextTokens, t as applyAgentRunSessionTargetIdentity, u as createFileBackedCompactionCheckpointStore } from "./run-session-target-B3BxXQMM.js";
import { n as isRecoverableNativeHarnessBindingFailure, t as maybeCompactAgentHarnessSession } from "./compaction-DO6hWc1b.js";
import { t as ensureSelectedAgentHarnessPlugin } from "./runtime-plugin-D4UDhDQN.js";
import { t as ensureRuntimePluginsLoaded } from "./runtime-plugins-FIVhMF4I.js";
import { t as DEFERRED_CONTEXT_ENGINE_COMPACTION_REASON } from "./compact-reasons-CQeEUOxn.js";
import { n as createAgentHarnessTaskRuntimeScope } from "./agent-harness-task-runtime-scope-Bi2NS72l.js";
import { t as resolveExternalCliAuthOverlayScopeFromSelection } from "./external-cli-auth-selection-Dz_VivHS.js";
import { n as shouldSwitchToLiveModel, t as clearLiveModelSwitchPending } from "./live-model-switch-B0n1Z93Y.js";
import { t as buildAgentRuntimeAuthPlan } from "./auth-V0O1HaUL.js";
import { r as buildAgentRuntimePlan } from "./build-BLu1XXI7.js";
import { n as resolveRunWorkspaceDir, t as redactRunIdentifier } from "./workspace-run-D4VtuyKe.js";
import { n as isExecLikeToolName, t as buildEmbeddedRunPayloads } from "./payloads-C8eo2QCG.js";
import fs from "node:fs/promises";
import { randomBytes } from "node:crypto";
//#region src/agents/auth-profiles/failure-copy.ts
function describeReason(reason, provider, allInCooldown) {
	if (allInCooldown) switch (reason) {
		case "auth":
		case "session_expired": return `Couldn't sign in to ${provider}. Your saved login looks expired or no longer works.`;
		case "auth_permanent": return `${provider} isn't accepting your saved login anymore.`;
		case "billing": return `${provider} rejected the request — looks like a billing issue on the account.`;
		case "rate_limit": return `${provider} is asking us to slow down. Please wait a moment before trying again.`;
		case "overloaded": return `${provider} is overloaded right now. Please wait a moment before trying again.`;
		case "timeout": return `${provider} hasn't been responding. Please wait a moment before trying again.`;
		case "model_not_found": return `${provider} can't find the model you're using right now.`;
		case "server_error": return `${provider} is having issues right now. Please wait a moment before trying again.`;
		default: return `Couldn't reach ${provider} with any of your saved logins right now.`;
	}
	switch (reason) {
		case "auth":
		case "session_expired": return `Couldn't sign in to ${provider}. Your saved login looks expired or no longer works.`;
		case "auth_permanent": return `${provider} isn't accepting your saved login.`;
		case "billing": return `${provider} rejected the request — looks like a billing issue on the account.`;
		default: return null;
	}
}
function shouldIncludeRecoveryHint(reason) {
	switch (reason) {
		case "auth":
		case "auth_permanent":
		case "session_expired":
		case "billing": return true;
		case "rate_limit":
		case "overloaded":
		case "timeout":
		case "server_error":
		case "model_not_found": return false;
		default: return true;
	}
}
function diagnosticSuffix(cause, primary) {
	if (cause === void 0 || cause === null) return null;
	const text = formatErrorMessage(cause).trim();
	if (!text || primary.includes(text)) return null;
	return ` (${text})`;
}
/**
* Single source of truth for user-facing copy when an auth-profile rotation
* fails. Composes a reason-specific sentence with an actionable next-step
* derived from the provider's plugin manifest (`buildProviderAuthRecoveryHint`).
*
* Falls back to the underlying error's text when the reason maps to nothing
* actionable, so we never produce worse copy than the raw error.
*/
function formatAuthProfileFailureMessage(params) {
	const description = describeReason(params.reason, params.provider, params.allInCooldown);
	if (!description) {
		const causeText = params.cause ? formatErrorMessage(params.cause).trim() : "";
		if (causeText) return causeText;
		return `Couldn't reach ${params.provider} with any of your saved logins right now.`;
	}
	const hint = shouldIncludeRecoveryHint(params.reason) ? buildProviderAuthRecoveryHint({
		provider: params.provider,
		config: params.config,
		workspaceDir: params.workspaceDir,
		env: params.env
	}) : null;
	const suffix = diagnosticSuffix(params.cause, description);
	const parts = [description];
	if (hint) parts.push(hint);
	const message = parts.join(" ");
	return suffix ? `${message}${suffix}` : message;
}
//#endregion
//#region src/agents/embedded-agent-runner/compact.queued.ts
/**
* Queues embedded-agent session compaction onto the correct command lane.
*/
const compactionCheckpointStore = createFileBackedCompactionCheckpointStore();
function shouldFallbackAfterHarnessCompaction(result) {
	return isRecoverableNativeHarnessBindingFailure(result);
}
const DEFERRED_CONTEXT_ENGINE_COMPACTION_SCHEDULE_FAILURE_REASON = "failed to schedule background context-engine maintenance";
function shouldDeferOwningContextEngineBudgetCompaction(params) {
	return params.compactParams.deferOwningContextEngineCompaction === true && params.compactParams.trigger === "budget" && params.contextEngine.info.ownsCompaction === true && params.contextEngine.info.turnMaintenanceMode === "background" && typeof params.contextEngine.maintain === "function";
}
async function disposeContextEngine(contextEngine) {
	try {
		await contextEngine.dispose?.();
	} catch (err) {
		log$1.warn("context engine dispose failed after deferred maintenance", { errorMessage: formatErrorMessage(err) });
	}
}
async function deferOwningContextEngineBudgetCompaction(params) {
	let deferredScheduled = false;
	let deferredScheduleFailure;
	try {
		await runContextEngineMaintenance({
			contextEngine: params.contextEngine,
			sessionId: params.compactParams.sessionId,
			sessionKey: params.compactParams.sessionKey,
			sessionFile: params.compactParams.sessionFile,
			reason: "turn",
			runtimeContext: params.contextEngineRuntimeContext,
			runtimeSettings: params.contextEngineRuntimeSettings,
			config: params.compactParams.config,
			disposeDeferredContextEngineAfterMaintenance: true,
			onDeferredMaintenance: () => {
				deferredScheduled = true;
			},
			onDeferredMaintenanceFailure: (error) => {
				deferredScheduleFailure = error;
			}
		});
	} catch (err) {
		log$1.warn("failed to defer context-engine budget compaction", { errorMessage: formatErrorMessage(err) });
	}
	if (!deferredScheduled || deferredScheduleFailure) {
		await disposeContextEngine(params.contextEngine);
		log$1.warn(`[compaction] failed to schedule context-engine-owned budget compaction background maintenance (sessionKey=${params.compactParams.sessionKey ?? params.compactParams.sessionId}${deferredScheduleFailure ? ` error=${formatErrorMessage(deferredScheduleFailure)}` : ""})`);
		return {
			ok: false,
			compacted: false,
			reason: DEFERRED_CONTEXT_ENGINE_COMPACTION_SCHEDULE_FAILURE_REASON,
			failure: { reason: "deferred_compaction_not_scheduled" }
		};
	}
	log$1.info(`[compaction] deferred context-engine-owned budget compaction to background maintenance (sessionKey=${params.compactParams.sessionKey ?? params.compactParams.sessionId} scheduled=${String(deferredScheduled)})`);
	return {
		ok: true,
		compacted: false,
		reason: DEFERRED_CONTEXT_ENGINE_COMPACTION_REASON
	};
}
function mergeSecondaryNativeHarnessCompactionDetails(params) {
	if (!params.nativeResult) return params.details;
	if (params.details && typeof params.details === "object" && !Array.isArray(params.details)) return {
		...params.details,
		[params.detailsKey]: params.nativeResult
	};
	if (params.details !== void 0) return {
		contextEngine: params.details,
		[params.detailsKey]: params.nativeResult
	};
	return { [params.detailsKey]: params.nativeResult };
}
/**
* Compacts a session with lane queueing (session lane + global lane).
* Use this from outside a lane context. If already inside a lane, use
* `compactEmbeddedAgentSessionDirect` to avoid deadlocks.
*/
async function compactEmbeddedAgentSession(params) {
	ensureRuntimePluginsLoaded({
		config: params.config,
		workspaceDir: params.workspaceDir,
		allowGatewaySubagentBinding: params.allowGatewaySubagentBinding
	});
	ensureContextEnginesInitialized();
	const agentIds = resolveSessionAgentIds({
		sessionKey: params.sessionKey,
		config: params.config,
		agentId: params.agentId
	});
	const agentDir = params.agentDir ?? resolveAgentDir(params.config ?? {}, agentIds.sessionAgentId);
	const resolvedWorkspaceDir = resolveUserPath(params.workspaceDir);
	const contextEngine = await resolveContextEngine(params.config, {
		agentDir,
		workspaceDir: resolvedWorkspaceDir
	});
	const runtimePolicySessionKey = params.sandboxSessionKey ?? params.sessionKey;
	const runtimePolicyAgentId = params.sandboxSessionKey && parseAgentSessionKey(params.sandboxSessionKey) ? void 0 : params.agentId;
	const policyCompactionTarget = resolveEmbeddedCompactionTarget({
		config: params.config,
		provider: params.provider,
		modelId: params.model,
		authProfileId: params.authProfileId,
		defaultProvider: DEFAULT_PROVIDER,
		defaultModel: DEFAULT_MODEL
	});
	const configuredHarnessPolicy = resolveAgentHarnessPolicy({
		provider: policyCompactionTarget.provider ?? "openai",
		modelId: policyCompactionTarget.model ?? "gpt-5.5",
		config: params.config,
		agentId: runtimePolicyAgentId,
		sessionKey: runtimePolicySessionKey
	});
	const configuredHarnessRuntime = configuredHarnessPolicy.runtimeSource && configuredHarnessPolicy.runtimeSource !== "implicit" && !isDefaultAgentRuntimeId(configuredHarnessPolicy.runtime) ? configuredHarnessPolicy.runtime : void 0;
	const selectedHarnessRuntime = params.agentHarnessId ?? configuredHarnessRuntime;
	const resolvedCompactionTarget = resolveEmbeddedCompactionTarget({
		config: params.config,
		provider: params.provider,
		modelId: params.model,
		authProfileId: params.authProfileId,
		harnessRuntime: selectedHarnessRuntime,
		defaultProvider: DEFAULT_PROVIDER,
		defaultModel: DEFAULT_MODEL
	});
	const ceProvider = resolvedCompactionTarget.provider ?? "openai";
	const ceRuntimeProvider = resolvedCompactionTarget.runtimeProvider ?? ceProvider;
	const ceContextConfigProvider = resolvedCompactionTarget.contextProvider ?? ceProvider;
	const ceModelId = resolvedCompactionTarget.model ?? "gpt-5.5";
	const attemptNativeHarnessCompaction = shouldAttemptNativeHarnessCompaction({
		provider: ceProvider,
		nativeHarnessCompaction: resolvedCompactionTarget.nativeHarnessCompaction,
		selectedHarnessRuntime
	});
	if (attemptNativeHarnessCompaction) await ensureSelectedAgentHarnessPlugin({
		config: params.config,
		provider: ceProvider,
		modelId: ceModelId,
		agentId: runtimePolicyAgentId,
		sessionKey: runtimePolicySessionKey,
		agentHarnessRuntimeOverride: selectedHarnessRuntime,
		workspaceDir: resolvedWorkspaceDir
	});
	const { model: ceModel } = await resolveModelAsync(ceRuntimeProvider, ceModelId, agentDir, params.config);
	const ceRuntimeModel = ceModel;
	const resolvedContextTokenBudget = normalizeContextTokenBudget(resolveContextWindowInfo({
		cfg: params.config,
		provider: ceContextConfigProvider,
		modelId: ceModelId,
		modelContextTokens: readAgentModelContextTokens(ceModel),
		modelContextWindow: ceRuntimeModel?.contextWindow,
		defaultTokens: 2e5
	}).tokens) ?? 2e5;
	const requestedContextTokenBudget = normalizeContextTokenBudget(params.contextTokenBudget);
	const contextTokenBudget = Math.min(requestedContextTokenBudget ?? resolvedContextTokenBudget, resolvedContextTokenBudget);
	const contextEngineRuntimeContext = buildCompactionContextEngineRuntimeContext({
		params,
		agentDir,
		harnessRuntime: selectedHarnessRuntime,
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
	const harnessResult = attemptNativeHarnessCompaction && !contextEngineOwnsCompaction ? await maybeCompactAgentHarnessSession({
		...params,
		contextEngine,
		contextTokenBudget,
		contextEngineRuntimeContext
	}) : void 0;
	if (harnessResult) {
		if (!shouldFallbackAfterHarnessCompaction(harnessResult)) {
			await contextEngine.dispose?.();
			return harnessResult;
		}
		log$1.warn(`native harness compaction could not use its session binding; falling back to context engine: ${harnessResult.reason ?? "unknown"}`);
	}
	if (shouldDeferOwningContextEngineBudgetCompaction({
		compactParams: params,
		contextEngine
	})) return await deferOwningContextEngineBudgetCompaction({
		compactParams: params,
		contextEngine,
		contextEngineRuntimeContext,
		contextEngineRuntimeSettings
	});
	const sessionLane = resolveSessionLane(params.sessionKey?.trim() || params.sessionId);
	const globalLane = resolveGlobalLane(params.lane);
	const enqueueGlobal = params.enqueue ?? ((task, opts) => enqueueCommandInLane(globalLane, task, opts));
	return enqueueCommandInLane(sessionLane, () => enqueueGlobal(async () => {
		let checkpointSnapshot;
		let checkpointSnapshotRetained = false;
		try {
			const engineOwnsCompaction = contextEngine.info.ownsCompaction === true;
			checkpointSnapshot = engineOwnsCompaction ? await compactionCheckpointStore.captureSnapshot({ sessionFile: params.sessionFile }) : null;
			const hookRunner = engineOwnsCompaction ? asCompactionHookRunner(getGlobalHookRunner()) : null;
			const hookSessionKey = params.sessionKey?.trim() || params.sessionId;
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
				log$1.warn("before_compaction hook failed", { errorMessage: formatErrorMessage(err) });
			}
			let result;
			try {
				result = await compactContextEngineWithSafetyTimeout(contextEngine, {
					sessionId: params.sessionId,
					sessionKey: params.sessionKey,
					sessionFile: params.sessionFile,
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
				log$1.warn("context-engine compaction failed", { errorMessage: formatErrorMessage(compactErr) });
				result = {
					ok: false,
					compacted: false,
					reason: formatErrorMessage(compactErr)
				};
			}
			const delegatedSessionId = result.result?.sessionId;
			const delegatedSessionFile = result.result?.sessionFile;
			const delegatedRotatedTranscript = typeof delegatedSessionId === "string" && delegatedSessionId !== params.sessionId || typeof delegatedSessionFile === "string" && delegatedSessionFile !== params.sessionFile;
			let postCompactionSessionId = delegatedSessionId ?? params.sessionId;
			let postCompactionSessionFile = delegatedSessionFile ?? params.sessionFile;
			let postCompactionLeafId;
			if (result.ok && result.compacted) {
				if (shouldRotateCompactionTranscript(params.config) && !delegatedRotatedTranscript) try {
					const rotation = await rotateTranscriptFileAfterCompaction({ sessionFile: params.sessionFile });
					if (rotation.rotated) {
						postCompactionSessionId = rotation.sessionId ?? postCompactionSessionId;
						postCompactionSessionFile = rotation.sessionFile ?? postCompactionSessionFile;
						postCompactionLeafId = rotation.leafId;
						log$1.info(`[compaction] rotated active transcript after context-engine compaction (sessionKey=${params.sessionKey ?? params.sessionId})`);
					}
				} catch (err) {
					log$1.warn("failed to rotate compacted transcript", { errorMessage: formatErrorMessage(err) });
				}
				if (params.config && params.sessionKey && checkpointSnapshot) try {
					const transcriptState = await readSessionLeafStateFromTranscriptAsync(postCompactionSessionFile);
					const checkpointPosition = resolveCompactionCheckpointTranscriptPosition({
						preferredLeafId: postCompactionLeafId,
						transcriptState
					});
					checkpointSnapshotRetained = await compactionCheckpointStore.persistCheckpoint({
						cfg: params.config,
						sessionKey: params.sessionKey,
						sessionId: postCompactionSessionId,
						reason: resolveSessionCompactionCheckpointReason({ trigger: params.trigger }),
						snapshot: checkpointSnapshot,
						summary: result.result?.summary,
						firstKeptEntryId: result.result?.firstKeptEntryId,
						tokensBefore: result.result?.tokensBefore,
						tokensAfter: result.result?.tokensAfter,
						postSessionFile: postCompactionSessionFile,
						postLeafId: checkpointPosition.leafId,
						postEntryId: checkpointPosition.entryId
					}) !== null;
				} catch (err) {
					log$1.warn("failed to persist compaction checkpoint", { errorMessage: formatErrorMessage(err) });
				}
				await runContextEngineMaintenance({
					contextEngine,
					sessionId: postCompactionSessionId,
					sessionKey: params.sessionKey,
					sessionFile: postCompactionSessionFile,
					reason: "compaction",
					runtimeContext,
					runtimeSettings: contextEngineRuntimeSettings,
					config: params.config
				});
			}
			if (engineOwnsCompaction && result.ok && result.compacted) await runPostCompactionSideEffects({
				config: params.config,
				sessionKey: params.sessionKey,
				agentId: sessionAgentId,
				sessionFile: postCompactionSessionFile
			});
			if (result.ok && result.compacted && hookRunner?.hasHooks?.("after_compaction") && hookRunner.runAfterCompaction) try {
				const afterHookCtx = {
					...hookCtx,
					sessionId: postCompactionSessionId
				};
				await hookRunner.runAfterCompaction({
					messageCount: -1,
					compactedCount: -1,
					tokenCount: result.result?.tokensAfter,
					sessionFile: postCompactionSessionFile
				}, afterHookCtx);
			} catch (err) {
				log$1.warn("after_compaction hook failed", { errorMessage: formatErrorMessage(err) });
			}
			let secondaryNativeHarnessCompaction;
			if (engineOwnsCompaction && result.ok && result.compacted && attemptNativeHarnessCompaction) try {
				secondaryNativeHarnessCompaction = await compactWithSafetyTimeout((compactAbortSignal) => maybeCompactAgentHarnessSession({
					...params,
					sessionId: postCompactionSessionId,
					sessionFile: postCompactionSessionFile,
					contextEngine,
					contextTokenBudget,
					contextEngineRuntimeContext,
					abortSignal: compactAbortSignal
				}, { nativeCompactionRequest: "after_context_engine" }), resolveCompactionTimeoutMs(params.config), params.abortSignal ? { abortSignal: params.abortSignal } : void 0);
				if (secondaryNativeHarnessCompaction && !secondaryNativeHarnessCompaction.ok) log$1.warn("secondary native harness compaction failed after context-engine compaction", { reason: secondaryNativeHarnessCompaction.reason });
			} catch (err) {
				secondaryNativeHarnessCompaction = {
					ok: false,
					compacted: false,
					reason: formatErrorMessage(err)
				};
				log$1.warn("secondary native harness compaction threw after context-engine compaction", { errorMessage: formatErrorMessage(err) });
			}
			const secondaryNativeDetailsKey = normalizeOptionalAgentRuntimeId(selectedHarnessRuntime) === "codex" ? "codexNativeCompaction" : "nativeHarnessCompaction";
			return {
				ok: result.ok,
				compacted: result.compacted,
				reason: result.reason,
				result: result.result ? {
					summary: result.result.summary ?? "",
					firstKeptEntryId: result.result.firstKeptEntryId ?? "",
					tokensBefore: result.result.tokensBefore,
					tokensAfter: result.result.tokensAfter,
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
			if (!checkpointSnapshotRetained) await compactionCheckpointStore.cleanupSnapshot(checkpointSnapshot);
			await contextEngine.dispose?.();
		}
	}));
}
function shouldAttemptNativeHarnessCompaction(params) {
	const selectedRuntime = normalizeOptionalAgentRuntimeId(params.selectedHarnessRuntime);
	if (!selectedRuntime || selectedRuntime === "auto" || selectedRuntime === "openclaw") return false;
	return isOpenAIProvider(params.provider) ? params.nativeHarnessCompaction === true : true;
}
function buildCompactionContextEngineRuntimeContext(params) {
	const { sessionAgentId } = resolveSessionAgentIds({
		sessionKey: params.params.sessionKey,
		config: params.params.config,
		agentId: params.params.agentId
	});
	return {
		...params.params,
		...buildEmbeddedCompactionRuntimeContext({
			sessionKey: params.params.sessionKey,
			messageChannel: params.params.messageChannel,
			messageProvider: params.params.messageProvider,
			agentAccountId: params.params.agentAccountId,
			currentChannelId: params.params.currentChannelId,
			currentThreadTs: params.params.currentThreadTs,
			currentMessageId: params.params.currentMessageId,
			authProfileId: params.params.authProfileId,
			workspaceDir: params.params.workspaceDir,
			cwd: params.params.cwd,
			agentDir: params.agentDir,
			config: params.params.config,
			skillsSnapshot: params.params.skillsSnapshot,
			senderIsOwner: params.params.senderIsOwner,
			senderId: params.params.senderId,
			provider: params.params.provider,
			modelId: params.params.model,
			harnessRuntime: params.harnessRuntime,
			modelFallbacksOverride: params.params.modelFallbacksOverride,
			thinkLevel: params.params.thinkLevel,
			reasoningLevel: params.params.reasoningLevel,
			bashElevated: params.params.bashElevated,
			extraSystemPrompt: params.params.extraSystemPrompt,
			sourceReplyDeliveryMode: params.params.sourceReplyDeliveryMode,
			ownerNumbers: params.params.ownerNumbers
		}),
		...resolveContextEngineCapabilities({
			config: params.params.config,
			sessionKey: params.params.sessionKey,
			agentId: sessionAgentId,
			authProfileId: params.params.authProfileId,
			contextEnginePluginId: params.contextEnginePluginId,
			purpose: "context-engine.compaction"
		}),
		tokenBudget: params.contextTokenBudget,
		currentTokenCount: params.params.currentTokenCount
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
//#region src/agents/embedded-agent-runner/post-compaction-loop-guard.ts
/**
* Detects identical tool-call loops immediately after automatic compaction.
*
* The guard only observes a small post-compaction window; if compaction failed to break an
* identical args/result loop, the runner aborts before spending unbounded tokens.
*/
const log = createSubsystemLogger("agents/post-compaction-guard");
const DEFAULT_WINDOW_SIZE = 3;
function asPositiveInt(value, fallback) {
	if (typeof value !== "number" || !Number.isInteger(value) || value <= 0) return fallback;
	return value;
}
/** Creates a stateful post-compaction loop detector for one embedded run. */
function createPostCompactionLoopGuard(config, options) {
	const state = {
		enabled: options?.enabled ?? true,
		windowSize: asPositiveInt(config?.windowSize, DEFAULT_WINDOW_SIZE),
		remainingAttempts: 0,
		history: []
	};
	const armPostCompaction = () => {
		state.remainingAttempts = state.windowSize;
		state.history = [];
		if (state.enabled) log.info(`post-compaction guard armed for ${state.windowSize} attempts`);
	};
	const observe = (call) => {
		if (!state.enabled) return {
			shouldAbort: false,
			armed: false,
			remainingAttempts: 0
		};
		if (state.remainingAttempts <= 0) return {
			shouldAbort: false,
			armed: false,
			remainingAttempts: 0
		};
		state.remainingAttempts -= 1;
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
//#region src/agents/embedded-agent-runner/run/failover-policy.ts
function shouldEscalateRetryLimit(reason) {
	return Boolean(reason && reason !== "timeout" && reason !== "model_not_found" && reason !== "format" && reason !== "session_expired");
}
function isTerminalFormatFailure(params) {
	return params.failoverFailure && params.failoverReason === "format" && params.allowFormatRetry !== true;
}
function shouldRotatePrompt(params) {
	return params.failoverFailure && params.failoverReason !== "timeout" && !isTerminalFormatFailure(params);
}
function isAssistantTimeoutFailure(params) {
	return params.idleTimedOut || params.timedOut && !params.timedOutDuringCompaction && !params.timedOutDuringToolExecution;
}
function isConcreteNonTimeoutAssistantFailure(params) {
	return params.failoverFailure && Boolean(params.failoverReason) && params.failoverReason !== "timeout";
}
function shouldRotateAssistant(params) {
	if (isTerminalFormatFailure(params)) return false;
	const timeoutFailure = isAssistantTimeoutFailure(params);
	if (params.harnessOwnsTransport && (timeoutFailure || params.failoverReason === "timeout") && !isConcreteNonTimeoutAssistantFailure(params)) return false;
	return !params.aborted && params.failoverFailure || timeoutFailure;
}
function assistantFallbackReason(params) {
	const failoverReason = params.failoverReason;
	if (params.failoverFailure && failoverReason && failoverReason !== "timeout") return failoverReason;
	return isAssistantTimeoutFailure(params) ? "timeout" : failoverReason ?? "unknown";
}
/** Preserves an existing retry reason unless the current attempt produced a stronger signal. */
function mergeRetryFailoverReason(params) {
	return params.failoverReason ?? (params.timedOut ? "timeout" : null) ?? params.previous;
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
		if (params.externalAbort) return {
			action: "surface_error",
			reason: params.failoverReason
		};
		if (params.harnessOwnsTransport && params.failoverReason === "timeout") return {
			action: "surface_error",
			reason: params.failoverReason
		};
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
	if (params.externalAbort) return {
		action: "surface_error",
		reason: params.failoverReason
	};
	if (isTerminalFormatFailure(params)) return {
		action: "surface_error",
		reason: params.failoverReason
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
//#region src/agents/embedded-agent-runner/run/assistant-failover.ts
/**
* Handles assistant-stage failover decisions during embedded-agent attempts.
*/
const LONG_WINDOW_RATE_LIMIT_RE = /\b(?:daily|weekly|monthly|tokens per day|requests per day|usage limit|subscription|insufficient[_ -]?quota|current quota|quota[_ -]?exceeded|quota exceeded)\b/i;
const SHORT_RATE_LIMIT_WINDOW_RE = /\b(?:requests per minute|tokens per minute|per-minute|rpm|tpm)\b/i;
const SHORT_WINDOW_RATE_LIMIT_RE = /\b(?:requests per minute|tokens per minute|per-minute|rpm|tpm|model_cooldown)\b|请求过于频繁|调用频率|频率限制/i;
const RETRY_AFTER_VALUE_RE = /\bretry[- ]after\b\s*:?\s*(?:in\s*)?([^\r\n;]+)/i;
const RETRY_AFTER_SECONDS_RE = /^(\d+(?:\.\d+)?)(?:\s*(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m))?\b/i;
const MAX_SHORT_WINDOW_RETRY_AFTER_SECONDS = 60;
function parseRetryAfterSeconds(message) {
	const valueText = RETRY_AFTER_VALUE_RE.exec(message)?.[1]?.trim();
	if (!valueText) return null;
	const secondsMatch = RETRY_AFTER_SECONDS_RE.exec(valueText);
	if (secondsMatch?.[1]) {
		const value = Number(secondsMatch[1]);
		if (!Number.isFinite(value) || value < 0) return null;
		const unit = secondsMatch[2]?.toLowerCase();
		if (unit?.startsWith("m") && unit !== "ms" && !unit.startsWith("msec") && !unit.startsWith("millisecond")) return value * 60;
		if (unit === "ms" || unit?.startsWith("msec") || unit?.startsWith("millisecond")) return value / 1e3;
		return value;
	}
	const retryAtMs = Date.parse(valueText);
	if (!Number.isFinite(retryAtMs)) return null;
	return Math.max(0, (retryAtMs - Date.now()) / 1e3);
}
function resolveShortWindowRateLimitRetry(message) {
	const raw = message?.trim();
	if (!raw) return null;
	const retryAfterSeconds = parseRetryAfterSeconds(raw);
	if (retryAfterSeconds !== null && retryAfterSeconds > MAX_SHORT_WINDOW_RETRY_AFTER_SECONDS) return null;
	const shortRetryAfter = retryAfterSeconds !== null && retryAfterSeconds <= MAX_SHORT_WINDOW_RETRY_AFTER_SECONDS;
	const hasShortWindowSignal = SHORT_RATE_LIMIT_WINDOW_RE.test(raw);
	if (RETRY_AFTER_VALUE_RE.test(raw) && retryAfterSeconds === null && !hasShortWindowSignal) return null;
	if (LONG_WINDOW_RATE_LIMIT_RE.test(raw) && !hasShortWindowSignal && !shortRetryAfter) return null;
	if (!SHORT_WINDOW_RATE_LIMIT_RE.test(raw) && !shortRetryAfter) return null;
	return retryAfterSeconds !== null ? { retryAfterSeconds } : {};
}
function isShortWindowRateLimitMessage(message) {
	return resolveShortWindowRateLimitRetry(message) !== null;
}
/**
* Applies an assistant-stage failover decision and returns the next run action.
* It owns auth-profile rotation, overload/rate-limit escalation, same-model
* idle-timeout retry, and FailoverError construction for outer model fallback.
*/
async function handleAssistantFailover(params) {
	let overloadProfileRotations = params.overloadProfileRotations;
	let decision = params.initialDecision;
	const sameModelIdleTimeoutRetry = () => {
		params.warn(`[llm-idle-timeout] ${sanitizeForLog(params.provider)}/${sanitizeForLog(params.modelId)} produced no reply before the idle watchdog; retrying same model`);
		return {
			action: "retry",
			overloadProfileRotations,
			retryKind: "same_model_idle_timeout",
			lastRetryFailoverReason: mergeRetryFailoverReason({
				previous: params.previousRetryFailoverReason,
				failoverReason: params.failoverReason,
				timedOut: true
			})
		};
	};
	const sameModelRateLimitRetry = () => ({
		action: "retry",
		overloadProfileRotations,
		retryKind: "same_model_rate_limit",
		lastRetryFailoverReason: mergeRetryFailoverReason({
			previous: params.previousRetryFailoverReason,
			failoverReason: params.failoverReason,
			timedOut: params.timedOut || params.idleTimedOut
		})
	});
	if (decision.action === "rotate_profile") {
		const failedProfileId = params.lastProfileId;
		const timeoutFailure = params.timedOut || params.idleTimedOut;
		const failureReason = params.assistantProfileFailureReason;
		const markFailedProfile = async () => {
			if (!failedProfileId || !failureReason) return;
			try {
				await params.maybeMarkAuthProfileFailure({
					profileId: failedProfileId,
					reason: failureReason,
					modelId: params.modelId
				});
			} catch (err) {
				params.warn(`profile failure mark failed: ${String(err)}`);
			}
		};
		if (params.failoverReason === "overloaded") {
			overloadProfileRotations += 1;
			if (overloadProfileRotations > params.overloadProfileRotationLimit && params.fallbackConfigured) {
				const status = resolveFailoverStatus("overloaded");
				params.warn(`overload profile rotation cap reached for ${sanitizeForLog(params.provider)}/${sanitizeForLog(params.modelId)} after ${overloadProfileRotations} rotations; escalating to model fallback`);
				await markFailedProfile();
				params.logAssistantFailoverDecision("fallback_model", { status });
				return {
					action: "throw",
					overloadProfileRotations,
					error: new FailoverError("The AI service is temporarily overloaded. Please try again in a moment.", {
						reason: "overloaded",
						provider: params.activeErrorContext.provider,
						model: params.activeErrorContext.model,
						profileId: params.lastProfileId,
						status,
						rawError: params.lastAssistant?.errorMessage?.trim()
					})
				};
			}
		}
		if (params.failoverReason === "rate_limit") {
			const shortWindowRetry = resolveShortWindowRateLimitRetry(params.lastAssistant?.errorMessage);
			if (params.allowSameModelRateLimitRetry && shortWindowRetry && await params.maybeRetrySameModelRateLimit(shortWindowRetry)) return sameModelRateLimitRetry();
			params.maybeEscalateRateLimitProfileFallback({
				failoverProvider: params.activeErrorContext.provider,
				failoverModel: params.activeErrorContext.model,
				logFallbackDecision: params.logAssistantFailoverDecision
			});
		}
		const rotated = await params.advanceAuthProfile();
		const markFailedProfilePromise = markFailedProfile();
		if (timeoutFailure && !params.isProbeSession && failedProfileId) {
			const timeoutLabel = params.idleTimedOut ? "idle timeout (model silent)" : "timed out";
			params.warn(`Profile ${failedProfileId} ${timeoutLabel}. Trying next account...`);
		}
		if (params.cloudCodeAssistFormatError && failedProfileId) params.warn(`Profile ${failedProfileId} hit Cloud Code Assist format error. Tool calls will be sanitized on retry.`);
		if (rotated) {
			params.logAssistantFailoverDecision("rotate_profile");
			await params.maybeBackoffBeforeOverloadFailover(params.failoverReason);
			return {
				action: "retry",
				overloadProfileRotations,
				lastRetryFailoverReason: mergeRetryFailoverReason({
					previous: params.previousRetryFailoverReason,
					failoverReason: params.failoverReason,
					timedOut: params.timedOut || params.idleTimedOut
				})
			};
		}
		await markFailedProfilePromise;
		if (params.idleTimedOut && params.allowSameModelIdleTimeoutRetry) return sameModelIdleTimeoutRetry();
		decision = resolveRunFailoverDecision({
			stage: "assistant",
			allowFormatRetry: params.cloudCodeAssistFormatError,
			aborted: params.aborted,
			externalAbort: params.externalAbort,
			fallbackConfigured: params.fallbackConfigured,
			failoverFailure: params.failoverFailure,
			failoverReason: params.failoverReason,
			timedOut: params.timedOut,
			idleTimedOut: params.idleTimedOut,
			timedOutDuringCompaction: params.timedOutDuringCompaction,
			timedOutDuringToolExecution: params.timedOutDuringToolExecution,
			profileRotated: true
		});
	}
	if (decision.action === "fallback_model") {
		await params.maybeBackoffBeforeOverloadFailover(params.failoverReason);
		const message = resolveAssistantFailoverErrorMessage(params);
		const status = resolveFailoverStatus(decision.reason) ?? (isTimeoutErrorMessage(message) ? 408 : void 0);
		params.logAssistantFailoverDecision("fallback_model", { status });
		const shouldSuspend = Boolean(params.sessionKey) && (decision.reason === "rate_limit" || decision.reason === "billing");
		return {
			action: "throw",
			overloadProfileRotations,
			error: new FailoverError(message, {
				reason: decision.reason,
				provider: params.activeErrorContext.provider,
				model: params.activeErrorContext.model,
				profileId: params.lastProfileId,
				authMode: params.authMode,
				status,
				rawError: params.lastAssistant?.errorMessage?.trim(),
				suspend: shouldSuspend
			})
		};
	}
	if (decision.action === "surface_error") {
		if (!params.externalAbort && params.idleTimedOut && params.allowSameModelIdleTimeoutRetry) return sameModelIdleTimeoutRetry();
		params.logAssistantFailoverDecision("surface_error");
		if (!params.externalAbort && !params.timedOut && params.failoverFailure) {
			const message = resolveAssistantFailoverErrorMessage(params);
			const reason = resolveSurfaceErrorReason(decision.reason, params);
			const status = resolveFailoverStatus(reason) ?? (isTimeoutErrorMessage(message) ? 408 : void 0);
			const shouldSuspend = Boolean(params.sessionKey) && (reason === "rate_limit" || reason === "billing");
			return {
				action: "throw",
				overloadProfileRotations,
				error: new FailoverError(message, {
					reason,
					provider: params.activeErrorContext.provider,
					model: params.activeErrorContext.model,
					profileId: params.lastProfileId,
					authMode: params.authMode,
					status,
					rawError: params.lastAssistant?.errorMessage?.trim(),
					suspend: shouldSuspend
				})
			};
		}
	}
	return {
		action: "continue_normal",
		overloadProfileRotations
	};
}
function resolveAssistantFailoverErrorMessage(params) {
	const timeoutFailure = params.timedOut || params.idleTimedOut;
	return (params.lastAssistant ? formatAssistantErrorText(params.lastAssistant, {
		cfg: params.config,
		sessionKey: params.sessionKey,
		provider: params.activeErrorContext.provider,
		model: params.activeErrorContext.model,
		authMode: params.authMode
	}) : void 0) || params.lastAssistant?.errorMessage?.trim() || (timeoutFailure ? "LLM request timed out." : params.rateLimitFailure ? "LLM request rate limited." : params.billingFailure ? formatBillingErrorMessage(params.activeErrorContext.provider, params.activeErrorContext.model, params.authMode) : params.authFailure ? "LLM request unauthorized." : "LLM request failed.");
}
function resolveSurfaceErrorReason(declared, params) {
	if (declared) return declared;
	if (params.billingFailure) return "billing";
	if (params.authFailure) return "auth";
	if (params.rateLimitFailure) return "rate_limit";
	return "unknown";
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
/**
* Coordinates auth profile selection, runtime auth preparation/refresh, and
* profile failover for one embedded run. State is injected through accessors so
* the runner can keep provider/model/auth snapshots in sync across retries.
*/
function createEmbeddedRunAuthController(params) {
	const applyPreparedRuntimeRequestOverrides = (paramsForApply) => {
		const runtimeModel = applyPreparedRuntimeAuthToModel(paramsForApply.runtimeModel, paramsForApply.preparedAuth);
		if (runtimeModel === paramsForApply.runtimeModel) return;
		params.setRuntimeModel(runtimeModel);
		params.setEffectiveModel(applyPreparedRuntimeAuthToModel(params.getEffectiveModel(), paramsForApply.preparedAuth));
	};
	const hasRefreshableRuntimeAuth = () => Boolean(params.getRuntimeAuthState()?.sourceApiKey.trim());
	const nextRuntimeAuthGeneration = () => (params.getRuntimeAuthState()?.generation ?? 0) + 1;
	const prepareRuntimeAuthForModel = async (prepareParams) => prepareProviderRuntimeAuth({
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
			modelId: params.getModelId(),
			model: prepareParams.runtimeModel,
			apiKey: prepareParams.apiKey,
			authMode: prepareParams.authMode,
			profileId: prepareParams.profileId
		}
	});
	const clearRuntimeAuthRefreshTimer = () => {
		const runtimeAuthState = params.getRuntimeAuthState();
		if (!runtimeAuthState?.refreshTimer) return;
		clearTimeout(runtimeAuthState.refreshTimer);
		runtimeAuthState.refreshTimer = void 0;
	};
	const stopRuntimeAuthRefreshTimer = () => {
		if (!params.getRuntimeAuthState()) return;
		params.setRuntimeAuthRefreshCancelled(true);
		clearRuntimeAuthRefreshTimer();
	};
	const refreshRuntimeAuth = async (reason) => {
		const runtimeAuthState = params.getRuntimeAuthState();
		if (!runtimeAuthState) return;
		if (runtimeAuthState.refreshInFlight) {
			await runtimeAuthState.refreshInFlight;
			return;
		}
		const refreshGeneration = runtimeAuthState.generation;
		const refreshProfileId = runtimeAuthState.profileId;
		const refreshPromise = (async () => {
			const currentRuntimeAuthState = params.getRuntimeAuthState();
			const sourceApiKey = currentRuntimeAuthState?.sourceApiKey.trim() ?? "";
			if (!sourceApiKey) throw new Error(`Runtime auth refresh requires a source credential.`);
			const runtimeModel = params.getRuntimeModel();
			params.log.debug(`Refreshing runtime auth for ${runtimeModel.provider} (${reason})...`);
			const preparedAuth = await prepareRuntimeAuthForModel({
				runtimeModel,
				apiKey: sourceApiKey,
				authMode: currentRuntimeAuthState?.authMode ?? "unknown",
				profileId: currentRuntimeAuthState?.profileId
			});
			if (!preparedAuth?.apiKey) throw new Error(`Provider "${runtimeModel.provider}" does not support runtime auth refresh.`);
			const activeRuntimeAuthState = params.getRuntimeAuthState();
			if (!activeRuntimeAuthState || activeRuntimeAuthState.generation !== refreshGeneration || activeRuntimeAuthState.profileId !== refreshProfileId || activeRuntimeAuthState.sourceApiKey.trim() !== sourceApiKey) {
				params.log.debug(`Ignoring stale runtime auth refresh for ${runtimeModel.provider}; auth state advanced before ${reason} refresh completed.`);
				return;
			}
			params.authStorage.setRuntimeApiKey(runtimeModel.provider, preparedAuth.apiKey);
			applyPreparedRuntimeRequestOverrides({
				runtimeModel,
				preparedAuth
			});
			params.setRuntimeAuthState({
				...activeRuntimeAuthState,
				expiresAt: preparedAuth.expiresAt
			});
			if (preparedAuth.expiresAt) {
				const remaining = preparedAuth.expiresAt - Date.now();
				params.log.debug(`Runtime auth refreshed for ${runtimeModel.provider}; expires in ${Math.max(0, Math.floor(remaining / 1e3))}s.`);
			}
		})().catch((err) => {
			const runtimeModel = params.getRuntimeModel();
			params.log.warn(`Runtime auth refresh failed for ${runtimeModel.provider}: ${formatErrorMessage(err)}`);
			throw err;
		}).finally(() => {
			const activeState = params.getRuntimeAuthState();
			if (activeState && activeState.generation === refreshGeneration && activeState.refreshInFlight === refreshPromise) activeState.refreshInFlight = void 0;
		});
		runtimeAuthState.refreshInFlight = refreshPromise;
		await refreshPromise;
	};
	const scheduleRuntimeAuthRefresh = () => {
		const runtimeAuthState = params.getRuntimeAuthState();
		if (!runtimeAuthState || params.getRuntimeAuthRefreshCancelled()) return;
		const runtimeModel = params.getRuntimeModel();
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
			if (params.getRuntimeAuthRefreshCancelled()) return;
			refreshRuntimeAuth("scheduled").then(() => scheduleRuntimeAuthRefresh()).catch(() => {
				if (params.getRuntimeAuthRefreshCancelled()) return;
				const retryTimer = setTimeout(() => {
					if (params.getRuntimeAuthRefreshCancelled()) return;
					refreshRuntimeAuth("scheduled-retry").then(() => scheduleRuntimeAuthRefresh()).catch(() => void 0);
				}, RUNTIME_AUTH_REFRESH_RETRY_MS);
				const activeRuntimeAuthState = params.getRuntimeAuthState();
				if (activeRuntimeAuthState) activeRuntimeAuthState.refreshTimer = retryTimer;
				if (params.getRuntimeAuthRefreshCancelled() && activeRuntimeAuthState) {
					clearTimeout(retryTimer);
					activeRuntimeAuthState.refreshTimer = void 0;
				}
			});
		}, delayMs);
		runtimeAuthState.refreshTimer = timer;
		if (params.getRuntimeAuthRefreshCancelled()) {
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
		return classifyFailoverReason(failoverParams.message, { provider: params.getProvider() }) ?? "auth";
	};
	const throwAuthProfileFailover = (failoverParams) => {
		const provider = params.getProvider();
		const modelId = params.getModelId();
		const messageForReason = failoverParams.message?.trim() || (failoverParams.error ? formatErrorMessage(failoverParams.error).trim() : "");
		const reason = resolveAuthProfileFailoverReason({
			allInCooldown: failoverParams.allInCooldown,
			message: messageForReason,
			profileIds: params.profileCandidates
		});
		const message = failoverParams.message?.trim() || formatAuthProfileFailureMessage({
			reason,
			provider,
			allInCooldown: failoverParams.allInCooldown,
			cause: failoverParams.error,
			config: params.config,
			workspaceDir: params.workspaceDir,
			env: process.env
		});
		if (params.fallbackConfigured) throw new FailoverError(message, {
			reason,
			provider,
			model: modelId,
			authMode: reason === "billing" ? resolveSubscriptionAuthModeForProfiles({
				store: params.authStore,
				profileIds: failoverParams.allInCooldown ? params.profileCandidates : [params.profileCandidates[params.getProfileIndex()]]
			}) : void 0,
			status: resolveFailoverStatus(reason),
			authProfileFailure: { allInCooldown: failoverParams.allInCooldown },
			cause: failoverParams.error
		});
		if (failoverParams.error instanceof Error) throw failoverParams.error;
		throw new Error(message);
	};
	const resolveApiKeyForCandidate = async (candidate) => {
		return getApiKeyForModel({
			model: params.getRuntimeModel(),
			cfg: params.config,
			profileId: candidate,
			store: params.authStore,
			agentDir: params.agentDir,
			workspaceDir: params.workspaceDir,
			lockedProfile: candidate != null && candidate === params.lockedProfileId
		});
	};
	const applyApiKeyInfo = async (candidate) => {
		const apiKeyInfo = await resolveApiKeyForCandidate(candidate);
		params.setApiKeyInfo(apiKeyInfo);
		const resolvedProfileId = apiKeyInfo.profileId ?? candidate;
		if (!apiKeyInfo.apiKey) {
			if (apiKeyInfo.mode !== "aws-sdk") throw new MissingProviderAuthError(params.getRuntimeModel().provider, apiKeyInfo);
			const runtimeModel = params.getRuntimeModel();
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
					params.setRuntimeAuthState({
						generation: nextRuntimeAuthGeneration(),
						sourceApiKey: AWS_SDK_AUTH_SENTINEL,
						authMode: apiKeyInfo.mode,
						profileId: resolvedProfileId,
						expiresAt: preparedAuth.expiresAt
					});
					if (preparedAuth.expiresAt) scheduleRuntimeAuthRefresh();
					params.setLastProfileId(resolvedProfileId);
					return;
				}
			} catch (error) {
				params.log.warn(`prepareProviderRuntimeAuth failed for ${runtimeModel.provider}, falling back to sentinel: ${formatErrorMessage(error)}`);
			}
			clearRuntimeAuthRefreshTimer();
			params.authStorage.setRuntimeApiKey(runtimeModel.provider, AWS_SDK_AUTH_SENTINEL);
			params.setRuntimeAuthState(null);
			params.setLastProfileId(resolvedProfileId);
			return;
		}
		let runtimeAuthHandled = false;
		const runtimeModel = params.getRuntimeModel();
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
			params.setRuntimeAuthState({
				generation: nextRuntimeAuthGeneration(),
				sourceApiKey: apiKeyInfo.apiKey,
				authMode: apiKeyInfo.mode,
				profileId: apiKeyInfo.profileId,
				expiresAt: preparedAuth.expiresAt
			});
			if (preparedAuth.expiresAt) scheduleRuntimeAuthRefresh();
			runtimeAuthHandled = true;
		}
		if (!runtimeAuthHandled) {
			clearRuntimeAuthRefreshTimer();
			params.authStorage.setRuntimeApiKey(runtimeModel.provider, apiKeyInfo.apiKey);
			params.setRuntimeAuthState(null);
		}
		params.setLastProfileId(apiKeyInfo.profileId);
	};
	const advanceAuthProfile = async () => {
		if (params.lockedProfileId) return false;
		let nextIndex = params.getProfileIndex() + 1;
		while (nextIndex < params.profileCandidates.length) {
			const candidate = params.profileCandidates[nextIndex];
			if (candidate && isProfileInCooldown(params.authStore, candidate, void 0, params.getModelId())) {
				nextIndex += 1;
				continue;
			}
			try {
				await applyApiKeyInfo(candidate);
				params.setProfileIndex(nextIndex);
				params.setThinkLevel(params.initialThinkLevel);
				params.attemptedThinking.clear();
				return true;
			} catch (err) {
				if (candidate && candidate === params.lockedProfileId) throw err;
				nextIndex += 1;
			}
		}
		return false;
	};
	const initializeAuthProfile = async () => {
		try {
			const autoProfileCandidates = params.profileCandidates.filter((candidate) => typeof candidate === "string" && candidate.length > 0 && candidate !== params.lockedProfileId);
			const modelId = params.getModelId();
			const allAutoProfilesInCooldown = autoProfileCandidates.length > 0 && autoProfileCandidates.every((candidate) => isProfileInCooldown(params.authStore, candidate, void 0, modelId));
			const unavailableReason = allAutoProfilesInCooldown ? resolveProfilesUnavailableReason({
				store: params.authStore,
				profileIds: autoProfileCandidates
			}) ?? "unknown" : null;
			const allowTransientCooldownProbe = params.allowTransientCooldownProbe && allAutoProfilesInCooldown && shouldAllowCooldownProbeForReason(unavailableReason);
			let didTransientCooldownProbe = false;
			while (params.getProfileIndex() < params.profileCandidates.length) {
				const candidate = params.profileCandidates[params.getProfileIndex()];
				if (candidate && candidate !== params.lockedProfileId && isProfileInCooldown(params.authStore, candidate, void 0, modelId)) if (allowTransientCooldownProbe && !didTransientCooldownProbe) {
					didTransientCooldownProbe = true;
					params.log.warn(`probing cooldowned auth profile for ${params.getProvider()}/${modelId} due to ${unavailableReason ?? "transient"} unavailability`);
				} else {
					params.setProfileIndex(params.getProfileIndex() + 1);
					continue;
				}
				await applyApiKeyInfo(params.profileCandidates[params.getProfileIndex()]);
				break;
			}
			if (params.getProfileIndex() >= params.profileCandidates.length) throwAuthProfileFailover({ allInCooldown: true });
		} catch (err) {
			if (err instanceof FailoverError) throw err;
			if (params.profileCandidates[params.getProfileIndex()] === params.lockedProfileId) throwAuthProfileFailover({
				allInCooldown: false,
				error: err
			});
			if (!await advanceAuthProfile()) throwAuthProfileFailover({
				allInCooldown: false,
				error: err
			});
		}
	};
	const maybeRefreshRuntimeAuthForAuthError = async (errorText, retried) => {
		if (!params.getRuntimeAuthState() || retried) return false;
		if (!isFailoverErrorMessage(errorText, { provider: params.getProvider() })) return false;
		if (classifyFailoverReason(errorText, { provider: params.getProvider() }) !== "auth") return false;
		try {
			await refreshRuntimeAuth("auth-error");
			scheduleRuntimeAuthRefresh();
			return true;
		} catch {
			return false;
		}
	};
	return {
		advanceAuthProfile,
		initializeAuthProfile,
		maybeRefreshRuntimeAuthForAuthError,
		stopRuntimeAuthRefreshTimer
	};
}
//#endregion
//#region src/agents/embedded-agent-runner/run/auth-profile-failure-policy.ts
/**
* Returns the subset of failover reasons that should affect shared auth-profile
* health. Local helper failures and request-shape/transport outcomes stay
* session-local so one bad transcript or connection does not cool down an
* otherwise healthy provider profile.
*/
function resolveAuthProfileFailureReason(params) {
	if (params.policy === "local" || !params.failoverReason || params.policy === "local_transient" && (params.failoverReason === "overloaded" || params.failoverReason === "rate_limit" && params.transientRateLimit === true) || params.failoverReason === "server_error" || params.failoverReason === "empty_response" || params.failoverReason === "format") return null;
	if (params.failoverReason === "timeout" && params.providerStarted !== true) return null;
	return params.failoverReason;
}
//#endregion
//#region src/agents/embedded-agent-runner/run/backend.ts
/**
* Dispatches embedded attempts to native harness or OpenClaw backend execution.
*/
/**
* Backend bridge for executing one embedded-agent attempt through the selected harness.
*/
async function runEmbeddedAttemptWithBackend(params) {
	return runAgentHarnessAttempt(params);
}
//#endregion
//#region src/agents/embedded-agent-runner/run/codex-app-server-recovery.ts
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
	if (params.alreadyRetried) return {
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
//#region src/agents/embedded-agent-runner/run/failover-observation.ts
/**
* Logs redacted failover decisions for embedded-agent attempts.
*/
/**
* Derives timeout failure reasons for logs that were built from timeout state
* before the normal provider error classifier had a raw error to inspect.
*/
function normalizeFailoverDecisionObservationBase(base) {
	return {
		...base,
		failoverReason: base.failoverReason ?? (base.timedOut ? "timeout" : null),
		profileFailureReason: base.profileFailureReason ?? (base.timedOut ? "timeout" : null)
	};
}
/**
* Captures sanitized failover context and returns a decision logger. The closure
* keeps prompt/assistant failover branches consistent while still allowing the
* final decision and HTTP status to be supplied at the action point.
*/
function createFailoverDecisionLogger(base) {
	const normalizedBase = normalizeFailoverDecisionObservationBase(base);
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
		const observedError = buildApiErrorObservationFields(normalizedBase.rawError);
		const safeRawErrorPreview = sanitizeForConsole(observedError.rawErrorPreview);
		const rawErrorConsoleSuffix = safeRawErrorPreview && !shouldSuppressRawErrorConsoleSuffix(observedError.providerRuntimeFailureKind) ? ` rawError=${safeRawErrorPreview}` : "";
		log$1.warn("embedded run failover decision", {
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
			...observedError,
			consoleMessage: `embedded run failover decision: runId=${safeRunId} stage=${normalizedBase.stage} decision=${decision} reason=${reasonText} from=${safeSourceProvider}/${safeSourceModel}${sourceChanged ? ` to=${safeProvider}/${safeModel}` : ""} profile=${profileText}${rawErrorConsoleSuffix}`
		});
	};
}
//#endregion
//#region src/agents/embedded-agent-runner/run/fallbacks.ts
/**
* Resolves whether this embedded run has any model fallback path available.
* Per-run overrides are authoritative so compaction/replay callers can force
* either a fallback lane or a no-fallback lane independent of agent defaults.
*/
function hasEmbeddedRunConfiguredModelFallbacks(params) {
	if (params.modelFallbacksOverride !== void 0) return params.modelFallbacksOverride.length > 0;
	return hasConfiguredModelFallbacks({
		cfg: params.cfg,
		agentId: params.agentId,
		sessionKey: params.sessionKey
	});
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
//#region src/agents/embedded-agent-runner/run/retry-limit.ts
/**
* Converts retry-limit exhaustion into failover errors or terminal replies.
*/
/**
* Converts retry-limit exhaustion into either a failover escalation or a local
* user-visible error payload. Replay-safe provider failures throw FailoverError
* so the outer run loop can switch models; non-escalating reasons preserve
* retry metadata on the returned run result.
*/
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
//#region src/agents/embedded-agent-runner/run/setup.ts
/**
* Runs model-selection hooks before resolving the runtime model. The dedicated
* `before_model_resolve` hook wins over legacy `before_agent_start` overrides
* when both provide provider/model changes.
*/
async function resolveHookModelSelection(params) {
	let provider = params.provider;
	let modelId = params.modelId;
	let modelResolveOverride;
	let beforeAgentStartResult;
	const hookRunner = params.hookRunner;
	if (hookRunner?.hasHooks("before_model_resolve")) try {
		const event = params.attachments ? {
			prompt: params.prompt,
			attachments: params.attachments
		} : { prompt: params.prompt };
		modelResolveOverride = await hookRunner.runBeforeModelResolve(event, params.hookContext);
	} catch (hookErr) {
		log$1.warn(`before_model_resolve hook failed: ${String(hookErr)}`);
	}
	if (hookRunner?.hasHooks("before_agent_start")) try {
		beforeAgentStartResult = await hookRunner.runBeforeAgentStart({ prompt: params.prompt }, params.hookContext);
		modelResolveOverride = {
			providerOverride: modelResolveOverride?.providerOverride ?? beforeAgentStartResult?.providerOverride,
			modelOverride: modelResolveOverride?.modelOverride ?? beforeAgentStartResult?.modelOverride
		};
	} catch (hookErr) {
		log$1.warn(`deprecated before_agent_start hook failed during model resolve: ${String(hookErr)}`);
	}
	if (modelResolveOverride?.providerOverride) {
		provider = modelResolveOverride.providerOverride;
		log$1.info(`[hooks] provider overridden to ${provider}`);
	}
	if (modelResolveOverride?.modelOverride) {
		modelId = modelResolveOverride.modelOverride;
		log$1.info(`[hooks] model overridden to ${modelId}`);
	}
	return {
		provider,
		modelId,
		beforeAgentStartResult
	};
}
/**
* Converts prompt image refs into the minimal attachment shape exposed to
* before-model-resolve hooks. Empty image lists stay undefined so hook payloads
* do not grow a meaningless attachments field.
*/
function buildBeforeModelResolveAttachments(images) {
	if (!images?.length) return;
	return images.map((img) => ({
		kind: "image",
		mimeType: img.mimeType
	}));
}
/**
* Resolves context-window policy for the selected runtime model and returns the
* model shape the session runtime should see. Configured context caps are
* reflected in `effectiveModel.contextWindow` so auto-compaction uses the same
* limit as the guard.
*/
function resolveEffectiveRuntimeModel(params) {
	const ctxInfo = resolveContextWindowInfo({
		cfg: params.cfg,
		provider: params.contextConfigProvider ?? params.provider,
		modelId: params.modelId,
		modelContextTokens: readAgentModelContextTokens(params.runtimeModel),
		modelContextWindow: params.runtimeModel.contextWindow,
		defaultTokens: DEFAULT_CONTEXT_TOKENS
	});
	const effectiveModel = ctxInfo.tokens < (params.runtimeModel.contextWindow ?? Infinity) ? {
		...params.runtimeModel,
		contextWindow: ctxInfo.tokens
	} : params.runtimeModel;
	const ctxGuard = evaluateContextWindowGuard({ info: ctxInfo });
	const runtimeBaseUrl = typeof params.runtimeModel.baseUrl === "string" ? params.runtimeModel.baseUrl : void 0;
	if (ctxGuard.shouldWarn) log$1.warn(formatContextWindowWarningMessage({
		provider: params.provider,
		modelId: params.modelId,
		guard: ctxGuard,
		runtimeBaseUrl
	}));
	if (ctxGuard.shouldBlock) {
		const message = formatContextWindowBlockMessage({
			guard: ctxGuard,
			runtimeBaseUrl
		});
		log$1.error(`blocked model (context window too small): ${params.provider}/${params.modelId} ctx=${ctxGuard.tokens} (min=${ctxGuard.hardMinTokens}) source=${ctxGuard.source}; ${message}`);
		throw new FailoverError(message, {
			reason: "unknown",
			provider: params.provider,
			model: params.modelId
		});
	}
	return {
		ctxInfo,
		effectiveModel
	};
}
//#endregion
//#region src/agents/embedded-agent-runner/run/tool-media-payloads.ts
/**
* Merges media emitted by tools into the channel payloads produced by the
* assistant turn. The first non-reasoning reply owns the media so text and
* attachments stay together; metadata is preserved for delivery bookkeeping.
*/
function mergeAttemptToolMediaPayloads(params) {
	const mediaUrls = Array.from(new Set(params.toolMediaUrls?.map((url) => url.trim()).filter(Boolean) ?? []));
	if (mediaUrls.length === 0 && !params.toolAudioAsVoice && !params.toolTrustedLocalMedia) return params.payloads;
	const payloads = params.payloads?.length ? [...params.payloads] : [];
	const payloadIndex = payloads.findIndex((payload) => !payload.isReasoning);
	if (payloadIndex >= 0) {
		const payload = payloads[payloadIndex];
		if (params.sourceReplyDeliveryMode === "message_tool_only" && getReplyPayloadMetadata(payload)?.sourceReplyTranscriptMirror) return payloads;
		const mergedMediaUrls = Array.from(new Set([...payload.mediaUrls ?? [], ...mediaUrls]));
		payloads[payloadIndex] = copyReplyPayloadMetadata(payload, {
			...payload,
			mediaUrls: mergedMediaUrls.length ? mergedMediaUrls : void 0,
			mediaUrl: payload.mediaUrl ?? mergedMediaUrls[0],
			audioAsVoice: payload.audioAsVoice || params.toolAudioAsVoice || void 0,
			trustedLocalMedia: payload.trustedLocalMedia || params.toolTrustedLocalMedia || void 0
		});
		return payloads;
	}
	return [...payloads, {
		mediaUrls: mediaUrls.length ? mediaUrls : void 0,
		mediaUrl: mediaUrls[0],
		audioAsVoice: params.toolAudioAsVoice || void 0,
		trustedLocalMedia: params.toolTrustedLocalMedia || void 0
	}];
}
//#endregion
//#region src/agents/embedded-agent-runner/run.ts
/**
* Top-level embedded-agent run orchestration entrypoint.
*/
const MAX_SAME_MODEL_IDLE_TIMEOUT_RETRIES = 1;
const EMBEDDED_RUN_LANE_TIMEOUT_GRACE_MS = 3e4;
const EMBEDDED_RUN_LANE_HEARTBEAT_MS = EMBEDDED_RUN_LANE_TIMEOUT_GRACE_MS / 2;
const MID_TURN_PRECHECK_CONTINUATION_PROMPT = "Continue from the current transcript after the latest tool result. Do not repeat the original user request, and do not rerun completed tools unless the transcript shows they are still needed.";
const COMPACTION_CONTINUATION_RETRY_INSTRUCTION = "The previous attempt compacted the conversation context before producing a final user-visible answer. Continue from the compacted transcript and produce the final answer now. Do not restart from scratch, do not repeat completed work, and do not rerun tools unless the transcript clearly lacks required evidence.";
const NO_REAL_CONVERSATION_MESSAGES_REASON = "no real conversation messages";
const BEFORE_AGENT_FINALIZE_RETRY_PROMPT_PREFIX = "Before accepting the previous final answer, apply this revision request and produce the revised final answer. Do not repeat completed work or rerun tools unless the request explicitly requires it.";
const MAX_BEFORE_AGENT_FINALIZE_REVISIONS = 3;
function isNoRealConversationCompactionNoop(params) {
	return params.ok === true && params.compacted === false && params.reason === NO_REAL_CONVERSATION_MESSAGES_REASON;
}
function resolveInitialThinkLevel(params) {
	if (params.requested) return params.requested;
	return resolveThinkingDefault({
		cfg: params.config ?? {},
		provider: params.provider,
		model: params.modelId,
		catalog: [{
			provider: params.provider,
			id: params.modelId,
			name: params.modelId,
			reasoning: params.model.reasoning
		}]
	});
}
async function resetNoRealConversationTokenSnapshot(params) {
	if (!params.sessionKey) return;
	const storePath = resolveStorePath(params.config?.session?.store, { agentId: params.agentId });
	try {
		await updateSessionEntry({
			storePath,
			sessionKey: params.sessionKey
		}, async () => ({
			totalTokens: 0,
			totalTokensFresh: true,
			inputTokens: void 0,
			outputTokens: void 0,
			cacheRead: void 0,
			cacheWrite: void 0,
			contextBudgetStatus: void 0,
			updatedAt: Date.now()
		}), {
			skipMaintenance: true,
			takeCacheOwnership: true
		});
	} catch (err) {
		log$1.warn(`[context-overflow-precheck] failed to reset stale context snapshot for ${params.sessionKey}: ${String(err)}`);
	}
}
function resolveAttemptDispatchApiKey(params) {
	if (params.runtimeAuthState) return;
	return params.apiKeyInfo?.apiKey;
}
function buildBeforeAgentFinalizeRetryPrompt(reason) {
	return `${BEFORE_AGENT_FINALIZE_RETRY_PROMPT_PREFIX}\n\n${reason}`;
}
function resolveEmbeddedRunLaneTimeoutMs(timeoutMs) {
	if (!Number.isFinite(timeoutMs) || timeoutMs <= 0) return;
	return Math.floor(timeoutMs) + EMBEDDED_RUN_LANE_TIMEOUT_GRACE_MS;
}
function withEmbeddedRunLaneTimeout(opts, laneTaskTimeoutMs) {
	if (laneTaskTimeoutMs === void 0 || opts?.taskTimeoutMs !== void 0) return opts;
	return {
		...opts,
		taskTimeoutMs: laneTaskTimeoutMs
	};
}
function resolveEmbeddedRunSessionQueuePriority(trigger) {
	switch (trigger) {
		case "user":
		case "manual": return "foreground";
		case "cron":
		case "heartbeat":
		case "memory":
		case "overflow": return "background";
		default: return "normal";
	}
}
function normalizeEmbeddedRunAttemptResult(attempt) {
	const raw = attempt;
	return {
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
		replayMetadata: resolveAttemptReplayMetadata(raw)
	};
}
function hasCompletedModelProgressForIdleBreaker(attempt) {
	return attempt.assistantTexts.some((text) => text.trim().length > 0) || attempt.toolMetas.length > 0 || (attempt.clientToolCalls?.length ?? 0) > 0 || hasOutboundDeliveryEvidence(attempt) || attempt.itemLifecycle.completedCount > 0;
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
	return {
		calls: params.toolMetas?.length ?? 0,
		tools,
		failures: params.hadFailure ? 1 : 0
	};
}
/**
* Best-effort backfill of sessionKey from sessionId when not explicitly provided.
* The return value is normalized: whitespace-only inputs collapse to undefined, and
* successful resolution returns a trimmed session key. This is a read-only lookup
* with no side effects.
* See: https://github.com/openclaw/openclaw/issues/60552
*/
function backfillSessionKey(params) {
	const trimmed = normalizeOptionalString(params.sessionKey);
	if (trimmed) return trimmed;
	if (!params.config || !params.sessionId) return;
	try {
		return normalizeOptionalString((normalizeOptionalString(params.agentId) ? resolveStoredSessionKeyForSessionId({
			cfg: params.config,
			sessionId: params.sessionId,
			agentId: params.agentId
		}) : resolveSessionKeyForRequest({
			cfg: params.config,
			sessionId: params.sessionId,
			clone: false
		})).sessionKey);
	} catch (err) {
		log$1.warn(`[backfillSessionKey] Failed to resolve sessionKey for sessionId=${redactRunIdentifier(sanitizeForLog(params.sessionId))}: ${formatErrorMessage(err)}`);
		return;
	}
}
function buildHandledReplyPayloads(reply) {
	const normalized = reply ?? { text: "NO_REPLY" };
	return [{
		text: normalized.text,
		mediaUrl: normalized.mediaUrl,
		mediaUrls: normalized.mediaUrls,
		replyToId: normalized.replyToId,
		audioAsVoice: normalized.audioAsVoice,
		isError: normalized.isError,
		isReasoning: normalized.isReasoning
	}];
}
function resolveInitialEmbeddedRunModel(params) {
	const cfg = params.config ?? {};
	const configuredDefault = resolveDefaultModelForAgent({
		cfg,
		agentId: params.agentId
	});
	const explicitProvider = normalizeOptionalString(params.provider);
	const explicitModel = normalizeOptionalString(params.model);
	const defaultProvider = configuredDefault.provider || "openai";
	if (explicitProvider && explicitModel) return {
		provider: explicitProvider,
		modelId: explicitModel
	};
	if (explicitModel) {
		const provider = explicitProvider ?? defaultProvider;
		const resolved = resolveModelRefFromString({
			cfg,
			raw: explicitModel,
			defaultProvider: provider,
			aliasIndex: buildModelAliasIndex({
				cfg,
				defaultProvider: provider
			})
		});
		return {
			provider: explicitProvider ?? resolved?.ref.provider ?? provider,
			modelId: resolved?.ref.model ?? explicitModel
		};
	}
	return {
		provider: explicitProvider ?? defaultProvider,
		modelId: configuredDefault.model || "gpt-5.5"
	};
}
function runEmbeddedAgent(paramsInput) {
	const requestedProvider = normalizeOptionalString(paramsInput.provider);
	const requestedModel = normalizeOptionalString(paramsInput.model);
	const needsConfiguredDefault = !paramsInput.config && !requestedProvider && !requestedModel;
	const config = paramsInput.config ?? (needsConfiguredDefault ? getRuntimeConfigSnapshot() ?? void 0 : void 0);
	const lifecycleGeneration = paramsInput.lifecycleGeneration ?? captureAgentRunLifecycleGeneration(paramsInput.runId);
	return withAgentRunLifecycleGeneration(lifecycleGeneration, () => runEmbeddedAgentInternal({
		...paramsInput,
		config,
		lifecycleGeneration
	}));
}
async function runEmbeddedAgentInternal(paramsInput) {
	const paramsBase = applyAgentRunSessionTargetIdentity(paramsInput);
	let lifecycleGeneration = paramsBase.lifecycleGeneration;
	const queuedLifecycleGeneration = getAgentEventLifecycleGeneration();
	const effectiveSessionKey = backfillSessionKey({
		config: paramsBase.config,
		sessionId: paramsBase.sessionId,
		sessionKey: paramsBase.sessionKey,
		agentId: paramsBase.agentId
	});
	const runSessionTarget = await resolveAgentRunSessionTarget({
		...paramsBase,
		sessionKey: effectiveSessionKey
	});
	let params = {
		...paramsBase,
		agentId: paramsBase.agentId ?? runSessionTarget.agentId,
		sessionId: runSessionTarget.sessionId,
		sessionKey: normalizeOptionalString(effectiveSessionKey ?? runSessionTarget.sessionKey),
		sessionFile: runSessionTarget.sessionFile
	};
	const sessionLane = resolveSessionLane(params.sessionKey?.trim() || params.sessionId);
	const globalLane = resolveGlobalLane(params.lane);
	const failureSuspension = resolveSessionSuspensionTarget();
	const suspendForFailure = (suspensionParams) => {
		const suspension = {
			...suspensionParams,
			laneId: globalLane
		};
		if (failureSuspension.mode === "defer") {
			failureSuspension.defer(suspension);
			return;
		}
		suspendSession(suspension);
	};
	const sessionQueuePriority = resolveEmbeddedRunSessionQueuePriority(params.trigger);
	const laneTaskTimeoutMs = resolveEmbeddedRunLaneTimeoutMs(params.timeoutMs);
	const laneTaskAbortController = new AbortController();
	const laneTaskReleaseController = new AbortController();
	let laneTaskProgressAtMs = Date.now();
	const noteLaneTaskProgress = () => {
		laneTaskProgressAtMs = Date.now();
	};
	const throwIfAborted = () => {
		if (!params.abortSignal?.aborted) return;
		const reason = params.abortSignal.reason;
		if (reason instanceof Error) throw reason;
		const abortErr = reason !== void 0 ? new Error("Operation aborted", { cause: reason }) : /* @__PURE__ */ new Error("Operation aborted");
		abortErr.name = "AbortError";
		throw abortErr;
	};
	const withLaneTimeout = (opts) => withEmbeddedRunLaneTimeout({
		...opts,
		taskTimeoutProgressAtMs: () => laneTaskProgressAtMs,
		taskTimeoutAbortSignal: laneTaskAbortController.signal,
		taskTimeoutAbortGraceMs: EMBEDDED_RUN_LANE_TIMEOUT_GRACE_MS,
		taskTimeoutReleaseSignal: laneTaskReleaseController.signal
	}, laneTaskTimeoutMs);
	const withRunLaneWait = (opts) => {
		if (!opts?.onWait && !params.onLaneWait) return opts;
		return {
			...opts,
			onWait: (waitMs, queuedAhead) => {
				opts?.onWait?.(waitMs, queuedAhead);
				params.onLaneWait?.({
					waitMs,
					queuedAhead,
					waiting: true
				});
			}
		};
	};
	const noteLaneWaitIfBusy = (lane) => {
		if (!params.onLaneWait) return;
		const snapshot = getCommandLaneSnapshot(lane);
		if (snapshot.queuedCount > 0 || snapshot.activeCount >= snapshot.maxConcurrent) params.onLaneWait({
			waitMs: 0,
			queuedAhead: snapshot.queuedCount + snapshot.activeCount,
			waiting: true
		});
	};
	const enqueueGlobal = (task, opts) => {
		const globalOpts = {
			...opts,
			priority: sessionQueuePriority
		};
		const taskWithCurrentLifecycle = () => {
			params.onLaneWait?.({
				waitMs: 0,
				queuedAhead: 0,
				waiting: false
			});
			throwIfAborted();
			const currentLifecycleGeneration = getAgentEventLifecycleGeneration();
			const existingContext = getAgentRunContext(params.runId);
			if (lifecycleGeneration !== currentLifecycleGeneration) {
				const wasQueuedBeforeRotation = queuedLifecycleGeneration === lifecycleGeneration;
				const canResumeAcrossRotation = sessionQueuePriority === "foreground";
				const newerSameIdExecutionOwnsContext = existingContext?.lifecycleGeneration === currentLifecycleGeneration;
				if (!wasQueuedBeforeRotation || !canResumeAcrossRotation || newerSameIdExecutionOwnsContext) assertAgentRunLifecycleGenerationCurrent(lifecycleGeneration);
				lifecycleGeneration = currentLifecycleGeneration;
				params = {
					...params,
					lifecycleGeneration
				};
			}
			claimAgentRunContext(params.runId, {
				...existingContext,
				sessionKey: params.sessionKey ?? existingContext?.sessionKey,
				sessionId: params.sessionId ?? existingContext?.sessionId,
				lifecycleGeneration
			});
			return withAgentRunLifecycleGeneration(lifecycleGeneration, task);
		};
		if (params.enqueue) return params.enqueue(taskWithCurrentLifecycle, withLaneTimeout(withRunLaneWait(globalOpts)));
		noteLaneWaitIfBusy(globalLane);
		return enqueueCommandInLane(globalLane, taskWithCurrentLifecycle, withLaneTimeout(withRunLaneWait(globalOpts)));
	};
	const enqueueSession = (task, opts) => {
		const sessionOpts = {
			...opts,
			priority: sessionQueuePriority
		};
		const taskWithLaneAdmission = () => {
			params.onLaneWait?.({
				waitMs: 0,
				queuedAhead: 0,
				waiting: false
			});
			return task();
		};
		if (params.enqueue) return params.enqueue(taskWithLaneAdmission, withRunLaneWait(sessionOpts));
		noteLaneWaitIfBusy(sessionLane);
		return enqueueCommandInLane(sessionLane, taskWithLaneAdmission, withRunLaneWait(sessionOpts));
	};
	const channelHint = params.messageChannel ?? params.messageProvider;
	const resolvedToolResultFormat = params.toolResultFormat ?? (channelHint ? isMarkdownCapableMessageChannel(channelHint) ? "markdown" : "plain" : "markdown");
	const isProbeSession = params.sessionId?.startsWith("probe-") ?? false;
	throwIfAborted();
	return enqueueSession(async () => {
		throwIfAborted();
		await waitForDeferredTurnMaintenanceForSession(params.sessionKey);
		throwIfAborted();
		return enqueueGlobal(async () => {
			throwIfAborted();
			const started = Date.now();
			const fastModeStarted = params.fastModeStartedAtMs ?? started;
			const fastModeAutoOnSeconds = params.fastModeAutoOnSeconds ?? 60;
			const fastModeAutoProgressState = params.fastModeAutoProgressState ?? {
				offAnnounced: false,
				resetAnnounced: false
			};
			const startupStages = createEmbeddedRunStageTracker();
			let startupStagesEmitted = false;
			const notifyExecutionPhase = (phase, extra) => {
				noteLaneTaskProgress();
				params.onExecutionPhase?.({
					phase,
					...extra
				});
			};
			const notifyRunProgress = (info) => {
				noteLaneTaskProgress();
				params.onRunProgress?.(info);
			};
			const emitFastModeAutoProgress = async (payload) => {
				const summary = formatFastModeAutoProgressText(payload);
				try {
					emitAgentItemEvent({
						runId: params.runId,
						...params.sessionKey ? { sessionKey: params.sessionKey } : {},
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
					log$1.debug(`embedded run fast mode auto global event failed: ${formatErrorMessage(error)}`);
				}
				try {
					await params.onAgentEvent?.({
						stream: "item",
						data: {
							kind: "status",
							title: "Fast",
							phase: "update",
							summary
						},
						...params.sessionKey ? { sessionKey: params.sessionKey } : {}
					});
				} catch (error) {
					log$1.debug(`embedded run fast mode auto event failed: ${formatErrorMessage(error)}`);
				}
				try {
					await params.onToolResult?.({
						text: summary,
						channelData: { openclawProgressKind: FAST_MODE_AUTO_PROGRESS_KIND }
					});
				} catch (error) {
					log$1.debug(`embedded run fast mode auto progress failed: ${formatErrorMessage(error)}`);
				}
			};
			const maybeAnnounceFastModeAutoOff = async () => {
				if (params.fastMode !== "auto" || fastModeAutoProgressState.offAnnounced) return;
				const next = resolveFastModeForElapsed({
					mode: "auto",
					startedAtMs: fastModeStarted,
					fastAutoOnSeconds: fastModeAutoOnSeconds
				});
				if (next.enabled) return;
				fastModeAutoProgressState.offAnnounced = true;
				await emitFastModeAutoProgress(next);
			};
			const notifyToolResult = async (payload) => {
				await params.onToolResult?.(payload);
			};
			const notifyAgentEvent = async (event) => {
				await params.onAgentEvent?.(event);
			};
			const resolveAttemptFastMode = () => {
				const resolved = resolveFastModeForElapsed({
					mode: params.fastMode,
					startedAtMs: fastModeStarted,
					fastAutoOnSeconds: fastModeAutoOnSeconds
				});
				return resolved.mode === void 0 ? void 0 : resolved.enabled;
			};
			const resolveAttemptFastModeParam = () => {
				if (params.fastMode === "auto") return resolveAttemptFastMode;
				return resolveAttemptFastMode();
			};
			const maybeEmitFastModeAutoReset = async () => {
				if (params.fastMode !== "auto" || !fastModeAutoProgressState.offAnnounced || fastModeAutoProgressState.resetAnnounced) return;
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
					log$1.warn(`embedded run fast mode auto reset progress failed: ${formatErrorMessage(error)}`);
				}
			};
			const emitStartupStageSummary = (phase) => {
				const summary = startupStages.snapshot();
				const shouldWarn = shouldWarnEmbeddedRunStageSummary(summary);
				if (!shouldWarn && !log$1.isEnabled("trace")) return;
				const message = formatEmbeddedRunStageSummary(`[trace:embedded-run] startup stages: runId=${params.runId} sessionId=${params.sessionId} phase=${phase}`, summary);
				if (shouldWarn) log$1.warn(message);
				else log$1.trace(message);
			};
			params.onExecutionStarted?.({ lifecycleGeneration });
			notifyExecutionPhase("runner_entered");
			const workspaceResolution = resolveRunWorkspaceDir({
				workspaceDir: params.workspaceDir,
				sessionKey: params.sessionKey,
				agentId: params.agentId,
				config: params.config
			});
			const resolvedWorkspace = workspaceResolution.workspaceDir;
			const isCanonicalWorkspace = resolveUserPath(resolveAgentWorkspaceDir(params.config ?? {}, workspaceResolution.agentId)) === resolvedWorkspace;
			const redactedSessionId = redactRunIdentifier(params.sessionId);
			const redactedSessionKey = redactRunIdentifier(params.sessionKey);
			const redactedWorkspace = redactRunIdentifier(resolvedWorkspace);
			if (workspaceResolution.usedFallback) log$1.warn(`[workspace-fallback] caller=runEmbeddedAgent reason=${workspaceResolution.fallbackReason} run=${params.runId} session=${redactedSessionId} sessionKey=${redactedSessionKey} agent=${workspaceResolution.agentId} workspace=${redactedWorkspace}`);
			startupStages.mark("workspace");
			notifyExecutionPhase("workspace");
			ensureRuntimePluginsLoaded({
				config: params.config,
				workspaceDir: resolvedWorkspace,
				allowGatewaySubagentBinding: params.allowGatewaySubagentBinding
			});
			startupStages.mark("runtime-plugins");
			notifyExecutionPhase("runtime_plugins");
			let { provider, modelId } = resolveInitialEmbeddedRunModel({
				config: params.config,
				agentId: workspaceResolution.agentId,
				provider: params.provider,
				model: params.model
			});
			const agentDir = params.agentDir ?? resolveAgentDir(params.config ?? {}, workspaceResolution.agentId);
			const normalizedSessionKey = params.sessionKey?.trim();
			const fallbackConfigured = hasEmbeddedRunConfiguredModelFallbacks({
				cfg: params.config,
				agentId: params.agentId,
				sessionKey: normalizedSessionKey,
				modelFallbacksOverride: params.modelFallbacksOverride
			});
			const resolvedSessionKey = normalizedSessionKey;
			const hookRunner = getGlobalHookRunner();
			const hookCtx = {
				runId: params.runId,
				jobId: params.jobId,
				agentId: workspaceResolution.agentId,
				sessionKey: resolvedSessionKey,
				sessionId: params.sessionId,
				workspaceDir: resolvedWorkspace,
				modelProviderId: provider,
				modelId,
				trigger: params.trigger,
				...buildAgentHookContextChannelFields(params)
			};
			if (params.trigger === "cron" && hookRunner?.hasHooks("before_agent_reply")) {
				notifyExecutionPhase("before_agent_reply", {
					provider,
					model: modelId
				});
				const hookResult = await hookRunner.runBeforeAgentReply({ cleanedBody: params.prompt }, hookCtx);
				if (hookResult?.handled) return {
					payloads: buildHandledReplyPayloads(hookResult.reply),
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
				notifyExecutionPhase("runtime_plugins", {
					provider,
					model: modelId
				});
			}
			const hookSelection = await resolveHookModelSelection({
				prompt: params.prompt,
				attachments: buildBeforeModelResolveAttachments(params.images),
				provider,
				modelId,
				hookRunner,
				hookContext: hookCtx
			});
			provider = hookSelection.provider;
			modelId = hookSelection.modelId;
			const requestedModelId = modelId;
			const beforeAgentStartResult = hookSelection.beforeAgentStartResult;
			startupStages.mark("hooks");
			await ensureSelectedAgentHarnessPlugin({
				provider,
				modelId,
				config: params.config,
				agentId: params.agentId,
				sessionKey: params.sessionKey,
				agentHarnessRuntimeOverride: params.agentHarnessRuntimeOverride,
				workspaceDir: resolvedWorkspace
			});
			const agentHarness = selectAgentHarness({
				provider,
				modelId,
				config: params.config,
				agentId: params.agentId,
				sessionKey: params.sessionKey,
				agentHarnessId: params.agentHarnessId,
				agentHarnessRuntimeOverride: params.agentHarnessRuntimeOverride
			});
			const pluginHarnessOwnsTransport = agentHarness.id !== "openclaw";
			const modelConfigProvider = provider;
			const selectedRuntimeProvider = resolveSelectedOpenAIRuntimeProvider({
				provider,
				harnessRuntime: agentHarness.id,
				agentHarnessId: agentHarness.id,
				authProfileProvider: params.authProfileId?.split(":", 1)[0],
				authProfileId: params.authProfileId,
				config: params.config,
				workspaceDir: resolvedWorkspace
			});
			const modelResolutionProviders = selectedRuntimeProvider !== provider ? [selectedRuntimeProvider, provider] : [provider];
			let resolvedModelProvider = provider;
			let firstModelResolution;
			let modelResolution;
			for (const candidateProvider of modelResolutionProviders) {
				const candidateResolution = await resolveModelAsync(candidateProvider, modelId, agentDir, params.config, {
					skipAgentDiscovery: true,
					allowBundledStaticCatalogFallback: pluginHarnessOwnsTransport,
					preferBundledStaticCatalogTransport: pluginHarnessOwnsTransport,
					workspaceDir: resolvedWorkspace,
					authProfileId: params.authProfileId
				});
				firstModelResolution ??= candidateResolution;
				if (candidateResolution.model) {
					resolvedModelProvider = candidateProvider;
					modelResolution = candidateResolution;
					break;
				}
			}
			if (!modelResolution && pluginHarnessOwnsTransport) modelResolution ??= firstModelResolution;
			if (!modelResolution) {
				await ensureOpenClawModelsJson(params.config, agentDir, { workspaceDir: resolvedWorkspace });
				for (const candidateProvider of modelResolutionProviders) {
					const candidateResolution = await resolveModelAsync(candidateProvider, modelId, agentDir, params.config, {
						workspaceDir: resolvedWorkspace,
						authProfileId: params.authProfileId
					});
					firstModelResolution ??= candidateResolution;
					if (candidateResolution.model) {
						resolvedModelProvider = candidateProvider;
						modelResolution = candidateResolution;
						break;
					}
				}
			}
			modelResolution ??= firstModelResolution;
			if (!modelResolution) throw new FailoverError(`Unknown model: ${provider}/${modelId}`, {
				reason: "model_not_found",
				provider,
				model: modelId,
				sessionId: params.sessionId,
				lane: globalLane
			});
			provider = resolvedModelProvider;
			const { model, error, authStorage, modelRegistry } = modelResolution;
			if (!model) throw new FailoverError(error ?? `Unknown model: ${provider}/${modelId}`, {
				reason: "model_not_found",
				provider,
				model: modelId,
				sessionId: params.sessionId,
				lane: globalLane
			});
			let runtimeModel = model;
			const resolvedRuntimeModel = resolveEffectiveRuntimeModel({
				cfg: params.config,
				provider,
				contextConfigProvider: resolveContextConfigProviderForRuntime({
					provider: modelConfigProvider,
					runtimeId: agentHarness.id,
					config: params.config
				}),
				modelId,
				runtimeModel
			});
			const ctxInfo = resolvedRuntimeModel.ctxInfo;
			let effectiveModel = resolvedRuntimeModel.effectiveModel;
			startupStages.mark("model-resolution");
			notifyExecutionPhase("model_resolution", {
				provider,
				model: modelId
			});
			const pluginHarnessNeedsOpenClawAuthBootstrap = pluginHarnessOwnsTransport && provider === "openai" && effectiveModel.api === "openai-chatgpt-responses";
			const openClawNativeCodexResponsesNeedsAuthBootstrap = !pluginHarnessOwnsTransport && provider === "openai" && effectiveModel.api === "openai-chatgpt-responses";
			let piExternalCliAuthScope = pluginHarnessOwnsTransport ? { ignoreAutoPreferredProfile: false } : openClawNativeCodexResponsesNeedsAuthBootstrap ? {
				providerIds: [OPENAI_PROVIDER_ID],
				ignoreAutoPreferredProfile: false
			} : resolveExternalCliAuthOverlayScopeFromSelection({
				provider,
				cfg: params.config,
				agentId: params.agentId,
				modelId,
				workspaceDir: resolvedWorkspace,
				userLockedAuthProfileId: params.authProfileIdSource === "user" ? params.authProfileId : void 0
			});
			let noExternalAuthStore;
			if (!pluginHarnessOwnsTransport && !pluginHarnessNeedsOpenClawAuthBootstrap && !piExternalCliAuthScope.providerIds) {
				noExternalAuthStore = ensureAuthProfileStoreWithoutExternalProfiles(agentDir, { allowKeychainPrompt: false });
				piExternalCliAuthScope = resolveExternalCliAuthOverlayScopeFromSelection({
					provider,
					cfg: params.config,
					agentId: params.agentId,
					modelId,
					workspaceDir: resolvedWorkspace,
					store: noExternalAuthStore,
					userLockedAuthProfileId: params.authProfileIdSource === "user" ? params.authProfileId : void 0
				});
			}
			const authStore = pluginHarnessOwnsTransport && !pluginHarnessNeedsOpenClawAuthBootstrap ? createEmptyAuthProfileStore() : pluginHarnessNeedsOpenClawAuthBootstrap ? ensureAuthProfileStore(agentDir, {
				externalCliProviderIds: [OPENAI_PROVIDER_ID],
				allowKeychainPrompt: false
			}) : piExternalCliAuthScope.providerIds ? ensureAuthProfileStore(agentDir, {
				externalCliProviderIds: piExternalCliAuthScope.providerIds,
				allowKeychainPrompt: false
			}) : noExternalAuthStore ?? ensureAuthProfileStoreWithoutExternalProfiles(agentDir, { allowKeychainPrompt: false });
			const attemptAuthProfileStore = pluginHarnessOwnsTransport && !pluginHarnessNeedsOpenClawAuthBootstrap ? ensureAuthProfileStoreWithoutExternalProfiles(agentDir, { allowKeychainPrompt: false }) : authStore;
			const requestedProfileId = params.authProfileId?.trim();
			const requestedProfileIsUserLocked = params.authProfileIdSource === "user";
			const isForwardablePluginHarnessAuthProfile = (profileId) => {
				if (!pluginHarnessOwnsTransport || !profileId) return false;
				const credential = attemptAuthProfileStore.profiles?.[profileId];
				return buildAgentRuntimeAuthPlan({
					provider,
					authProfileProvider: credential?.provider ?? profileId.split(":", 1)[0],
					authProfileMode: credential?.type,
					sessionAuthProfileId: profileId,
					config: params.config,
					workspaceDir: resolvedWorkspace,
					harnessId: agentHarness.id,
					harnessRuntime: agentHarness.id,
					allowHarnessAuthProfileForwarding: true
				}).forwardedAuthProfileId === profileId;
			};
			const resolvePluginHarnessProfileOrder = () => {
				if (requestedProfileId && requestedProfileIsUserLocked) return isForwardablePluginHarnessAuthProfile(requestedProfileId) ? [requestedProfileId] : [];
				if (!pluginHarnessOwnsTransport) return [];
				const harnessAuthProvider = buildAgentRuntimeAuthPlan({
					provider,
					config: params.config,
					workspaceDir: resolvedWorkspace,
					harnessId: agentHarness.id,
					harnessRuntime: agentHarness.id,
					allowHarnessAuthProfileForwarding: true
				}).harnessAuthProvider;
				if (!harnessAuthProvider) return [];
				const resolvedOrder = resolveAuthProfileOrder({
					cfg: params.config,
					store: attemptAuthProfileStore,
					provider: harnessAuthProvider
				}).filter(isForwardablePluginHarnessAuthProfile);
				if (resolvedOrder.length > 0) return resolvedOrder;
				if (requestedProfileId && isForwardablePluginHarnessAuthProfile(requestedProfileId)) return [requestedProfileId];
				return [];
			};
			const pluginHarnessProfileOrder = pluginHarnessOwnsTransport ? resolvePluginHarnessProfileOrder() : [];
			const resolvePluginHarnessPreferredProfileId = () => pluginHarnessProfileOrder[0];
			const preferredProfileId = pluginHarnessOwnsTransport ? resolvePluginHarnessPreferredProfileId() : piExternalCliAuthScope.ignoreAutoPreferredProfile && !requestedProfileIsUserLocked ? void 0 : requestedProfileId;
			let lockedProfileId = requestedProfileIsUserLocked ? preferredProfileId : void 0;
			if (lockedProfileId) if (pluginHarnessOwnsTransport) {
				if (!isForwardablePluginHarnessAuthProfile(lockedProfileId)) lockedProfileId = void 0;
			} else {
				const lockedProfile = authStore.profiles[lockedProfileId];
				const lockedProfileProvider = lockedProfile ? resolveProviderIdForAuth(lockedProfile.provider, {
					config: params.config,
					workspaceDir: resolvedWorkspace
				}) : void 0;
				const runProvider = resolveProviderIdForAuth(provider, {
					config: params.config,
					workspaceDir: resolvedWorkspace
				});
				if (!lockedProfile || !lockedProfileProvider || lockedProfileProvider !== runProvider) lockedProfileId = void 0;
			}
			const forwardedPluginHarnessProfileId = pluginHarnessOwnsTransport && !lockedProfileId && isForwardablePluginHarnessAuthProfile(preferredProfileId) ? preferredProfileId : void 0;
			if (lockedProfileId && !pluginHarnessOwnsTransport) {
				if (!resolveAuthProfileEligibility({
					cfg: params.config,
					store: authStore,
					provider,
					profileId: lockedProfileId
				}).eligible) throw new Error(`Auth profile "${lockedProfileId}" is not configured for ${provider}.`);
			}
			const profileOrder = shouldPreferExplicitConfigApiKeyAuth(params.config, provider) ? [] : [...new Set(listOpenAIAuthProfileProvidersForAgentRuntime({
				provider,
				harnessRuntime: agentHarness.id,
				agentHarnessId: agentHarness.id,
				config: params.config
			}).flatMap((authProvider) => resolveAuthProfileOrder({
				cfg: params.config,
				store: authStore,
				provider: authProvider,
				preferredProfile: preferredProfileId
			})))];
			const providerPreferredProfileId = lockedProfileId ? void 0 : resolveProviderAuthProfileId({
				provider,
				config: params.config,
				workspaceDir: resolvedWorkspace,
				context: {
					config: params.config,
					agentDir,
					workspaceDir: resolvedWorkspace,
					provider,
					modelId,
					preferredProfileId,
					lockedProfileId,
					profileOrder,
					authStore
				}
			});
			const providerOrderedProfiles = providerPreferredProfileId && profileOrder.includes(providerPreferredProfileId) ? [providerPreferredProfileId, ...profileOrder.filter((profileId) => profileId !== providerPreferredProfileId)] : profileOrder;
			const profileCandidates = pluginHarnessOwnsTransport ? lockedProfileId ? [lockedProfileId] : pluginHarnessProfileOrder.length > 0 ? pluginHarnessProfileOrder : [void 0] : lockedProfileId ? [lockedProfileId] : providerOrderedProfiles.length > 0 ? providerOrderedProfiles : [void 0];
			const pluginHarnessForwardedProfileCandidates = pluginHarnessOwnsTransport ? profileCandidates.filter(isForwardablePluginHarnessAuthProfile) : [];
			const profileFailureStore = pluginHarnessOwnsTransport ? attemptAuthProfileStore : authStore;
			let profileIndex = 0;
			const traceAttempts = [];
			const traceAttemptUsesFallback = (attempt) => attempt.result === "rotate_profile" || attempt.result === "fallback_model";
			const resolveRuntimeFallbackReason = () => {
				return traceAttempts.findLast((attempt) => attempt.result === "fallback_model" && typeof attempt.reason === "string")?.reason ?? lastRetryFailoverReason ?? null;
			};
			const buildEmbeddedContextEngineRuntimeSettings = (settingsParams) => {
				const fallbackReason = resolveRuntimeFallbackReason();
				return buildContextEngineRuntimeSettings({
					contextEngineHost: OPENCLAW_EMBEDDED_CONTEXT_ENGINE_HOST,
					provider,
					requestedModel: requestedModelId,
					resolvedModel: modelId,
					selectedContextEngineId: contextEngine.info.id,
					contextEngineSelectionSource: contextEngine.info.id === "legacy" ? "default" : "configured",
					promptTokenBudget: settingsParams.tokenBudget,
					maxOutputTokens: settingsParams.maxOutputTokens,
					fallbackReason,
					degradedReason: settingsParams.degradedReason
				});
			};
			const initialThinkLevel = resolveInitialThinkLevel({
				requested: params.thinkLevel,
				config: params.config,
				provider,
				modelId,
				model: effectiveModel
			});
			let thinkLevel = initialThinkLevel;
			const attemptedThinking = /* @__PURE__ */ new Set();
			let apiKeyInfo = null;
			let lastProfileId;
			let runtimeAuthState = null;
			let runtimeAuthRefreshCancelled = false;
			const { advanceAuthProfile, initializeAuthProfile, maybeRefreshRuntimeAuthForAuthError, stopRuntimeAuthRefreshTimer } = createEmbeddedRunAuthController({
				config: params.config,
				agentDir,
				workspaceDir: resolvedWorkspace,
				authStore,
				authStorage,
				profileCandidates,
				lockedProfileId,
				initialThinkLevel,
				attemptedThinking,
				fallbackConfigured,
				allowTransientCooldownProbe: params.allowTransientCooldownProbe === true,
				getProvider: () => provider,
				getModelId: () => modelId,
				getRuntimeModel: () => runtimeModel,
				setRuntimeModel: (next) => {
					runtimeModel = next;
				},
				getEffectiveModel: () => effectiveModel,
				setEffectiveModel: (next) => {
					effectiveModel = next;
				},
				getApiKeyInfo: () => apiKeyInfo,
				setApiKeyInfo: (next) => {
					apiKeyInfo = next;
				},
				getLastProfileId: () => lastProfileId,
				setLastProfileId: (next) => {
					lastProfileId = next;
				},
				getRuntimeAuthState: () => runtimeAuthState,
				setRuntimeAuthState: (next) => {
					runtimeAuthState = next;
				},
				getRuntimeAuthRefreshCancelled: () => runtimeAuthRefreshCancelled,
				setRuntimeAuthRefreshCancelled: (next) => {
					runtimeAuthRefreshCancelled = next;
				},
				getProfileIndex: () => profileIndex,
				setProfileIndex: (next) => {
					profileIndex = next;
				},
				setThinkLevel: (next) => {
					thinkLevel = next;
				},
				log: log$1
			});
			const advancePluginHarnessAuthProfile = async () => {
				if (!pluginHarnessOwnsTransport || lockedProfileId) return false;
				let nextIndex = profileIndex + 1;
				while (nextIndex < profileCandidates.length) {
					const candidate = profileCandidates[nextIndex];
					if (!candidate || !isForwardablePluginHarnessAuthProfile(candidate)) {
						nextIndex += 1;
						continue;
					}
					if (isProfileInCooldown(attemptAuthProfileStore, candidate, void 0, modelId)) {
						nextIndex += 1;
						continue;
					}
					profileIndex = nextIndex;
					lastProfileId = candidate;
					thinkLevel = initialThinkLevel;
					attemptedThinking.clear();
					return true;
				}
				return false;
			};
			const advanceAttemptAuthProfile = pluginHarnessOwnsTransport && !pluginHarnessNeedsOpenClawAuthBootstrap ? advancePluginHarnessAuthProfile : advanceAuthProfile;
			if (!pluginHarnessOwnsTransport || pluginHarnessNeedsOpenClawAuthBootstrap) await initializeAuthProfile();
			else if (lockedProfileId) lastProfileId = lockedProfileId;
			else if (forwardedPluginHarnessProfileId) lastProfileId = forwardedPluginHarnessProfileId;
			startupStages.mark("auth");
			notifyExecutionPhase("auth", {
				provider,
				model: modelId
			});
			const runAttemptAuthProfileStore = pluginHarnessOwnsTransport ? createScopedAuthProfileStore(attemptAuthProfileStore, pluginHarnessForwardedProfileCandidates.length > 0 ? pluginHarnessForwardedProfileCandidates : lastProfileId) : attemptAuthProfileStore;
			const harnessBuildsOpenClawTools = agentHarness.id === "codex" || agentHarness.id === "copilot";
			const { sessionAgentId } = resolveSessionAgentIds({
				sessionKey: params.sessionKey,
				config: params.config,
				agentId: params.agentId
			});
			const executionContract = isStrictAgenticExecutionContractActive({
				config: params.config,
				sessionKey: params.sessionKey,
				agentId: params.agentId,
				provider,
				modelId
			}) ? "strict-agentic" : "default";
			const maxReasoningOnlyRetryAttempts = 2;
			const maxEmptyResponseRetryAttempts = 1;
			const MAX_TIMEOUT_COMPACTION_ATTEMPTS = 2;
			const MAX_OVERFLOW_COMPACTION_ATTEMPTS = 3;
			const MAX_RUN_LOOP_ITERATIONS = resolveMaxRunRetryIterations(profileCandidates.length, params.config, sessionAgentId);
			let overflowCompactionAttempts = 0;
			let toolResultTruncationAttempted = false;
			let bootstrapPromptWarningSignaturesSeen = params.bootstrapPromptWarningSignaturesSeen ?? (params.bootstrapPromptWarningSignature ? [params.bootstrapPromptWarningSignature] : []);
			const usageAccumulator = createUsageAccumulator();
			let lastRunPromptUsage;
			let autoCompactionCount = 0;
			let lastCompactionTokensAfter;
			let lastContextBudgetStatus;
			let runLoopIterations = 0;
			let overloadProfileRotations = 0;
			let consecutiveSameModelRateLimitRetries = 0;
			let reasoningOnlyRetryAttempts = 0;
			let emptyResponseRetryAttempts = 0;
			let compactionContinuationRetryAttempts = 0;
			let beforeAgentFinalizeRevisionAttempts = 0;
			let sameModelIdleTimeoutRetries = 0;
			const idleTimeoutBreakerState = createIdleTimeoutBreakerState();
			const resolvedLoopDetectionConfig = resolveToolLoopDetectionConfig({
				cfg: params.config,
				agentId: sessionAgentId
			});
			const postCompactionGuard = createPostCompactionLoopGuard(resolvedLoopDetectionConfig?.postCompactionGuard, { enabled: resolvedLoopDetectionConfig?.enabled !== false });
			let postCompactionAbortController;
			let postCompactionAbortError;
			const attemptTerminalToolPresentation = {
				ordinal: -1,
				value: void 0
			};
			let nextToolOutcomeOrdinal = 0;
			const allocateToolOutcomeOrdinal = () => nextToolOutcomeOrdinal++;
			const readAttemptTerminalToolPresentation = () => attemptTerminalToolPresentation.value;
			const observeToolOutcome = (observation) => {
				const observationOrdinal = observation.toolCallOrdinal ?? attemptTerminalToolPresentation.ordinal + 1;
				if (observationOrdinal >= attemptTerminalToolPresentation.ordinal) {
					attemptTerminalToolPresentation.ordinal = observationOrdinal;
					attemptTerminalToolPresentation.value = observation.terminalPresentation;
				}
				if (observation.presentationOnly) return;
				const verdict = postCompactionGuard.observe(observation);
				if (verdict.shouldAbort) {
					postCompactionAbortError ??= PostCompactionLoopPersistedError.fromVerdict(verdict);
					laneTaskAbortController.abort(postCompactionAbortError);
					postCompactionAbortController?.abort(postCompactionAbortError);
				}
			};
			let lastRetryFailoverReason = null;
			let reasoningOnlyRetryInstruction = null;
			let emptyResponseRetryInstruction = null;
			let compactionContinuationRetryInstruction = null;
			let nextAttemptPromptOverride = null;
			let rateLimitProfileRotations = 0;
			let timeoutCompactionAttempts = 0;
			let codexAppServerRecoveryRetries = 0;
			const MAX_EMPTY_ERROR_RETRIES = 3;
			let emptyErrorRetries = 0;
			const MAX_MISSING_ASSISTANT_RETRIES = 1;
			let missingAssistantRetryAttempts = 0;
			const overloadFailoverBackoffMs = resolveOverloadFailoverBackoffMs(params.config);
			const overloadProfileRotationLimit = resolveOverloadProfileRotationLimit(params.config);
			const rateLimitProfileRotationLimit = resolveRateLimitProfileRotationLimit(params.config);
			let activeSessionId = params.sessionId;
			let activeSessionFile = params.sessionFile;
			const adoptActiveSessionId = (nextSessionId) => {
				if (!nextSessionId || nextSessionId === activeSessionId) return;
				activeSessionId = nextSessionId;
				params.replyOperation?.updateSessionId(activeSessionId);
				params.onSessionIdChanged?.(activeSessionId);
				registerAgentRunContext(params.runId, {
					sessionId: activeSessionId,
					lifecycleGeneration
				});
			};
			let suppressNextUserMessagePersistence = params.suppressNextUserMessagePersistence ?? false;
			let lastPersistedCurrentMessageId;
			const onUserMessagePersisted = (message) => {
				if (params.currentMessageId !== void 0) lastPersistedCurrentMessageId = params.currentMessageId;
				params.userTurnTranscriptRecorder?.markRuntimePersisted(message);
				params.onUserMessagePersisted?.(message);
			};
			const continueFromCurrentTranscript = () => {
				nextAttemptPromptOverride = MID_TURN_PRECHECK_CONTINUATION_PROMPT;
				suppressNextUserMessagePersistence = true;
			};
			const maybeEscalateRateLimitProfileFallback = (paramsLocal) => {
				rateLimitProfileRotations += 1;
				if (rateLimitProfileRotations <= rateLimitProfileRotationLimit || !fallbackConfigured) return;
				const status = resolveFailoverStatus("rate_limit");
				log$1.warn(`rate-limit profile rotation cap reached for ${sanitizeForLog(provider)}/${sanitizeForLog(modelId)} after ${rateLimitProfileRotations} rotations; escalating to model fallback`);
				paramsLocal.logFallbackDecision("fallback_model", { status });
				throw new FailoverError("The AI service is temporarily rate-limited. Please try again in a moment.", {
					reason: "rate_limit",
					provider: paramsLocal.failoverProvider,
					model: paramsLocal.failoverModel,
					profileId: lastProfileId,
					sessionId: activeSessionId,
					lane: globalLane,
					status
				});
			};
			const maybeMarkAuthProfileFailure = async (failure) => {
				const { profileId, reason } = failure;
				if (!profileId || !reason) return;
				if (pluginHarnessOwnsTransport && reason === "timeout") return;
				await markAuthProfileFailure({
					store: profileFailureStore,
					profileId,
					reason,
					cfg: params.config,
					agentDir,
					runId: params.runId,
					modelId: failure.modelId
				});
			};
			const resolveRunAuthProfileFailureReason = (failoverReason, opts) => resolveAuthProfileFailureReason({
				failoverReason,
				providerStarted: opts?.providerStarted,
				transientRateLimit: opts?.transientRateLimit,
				policy: params.authProfileFailurePolicy
			});
			const maybeBackoffBeforeOverloadFailover = async (reason) => {
				if (reason !== "overloaded" || overloadFailoverBackoffMs <= 0) return;
				log$1.warn(`overload backoff before failover for ${provider}/${modelId}: delayMs=${overloadFailoverBackoffMs}`);
				try {
					await sleepWithAbort(overloadFailoverBackoffMs, params.abortSignal);
				} catch (err) {
					if (params.abortSignal?.aborted) {
						const abortErr = new Error("Operation aborted", { cause: err });
						abortErr.name = "AbortError";
						throw abortErr;
					}
					throw err;
				}
			};
			const maybeRetrySameModelRateLimit = async (retry) => {
				if (consecutiveSameModelRateLimitRetries >= 3) return false;
				const delayMs = resolveSameModelRateLimitRetryDelayMs({
					retriesSoFar: consecutiveSameModelRateLimitRetries,
					retryAfterSeconds: retry?.retryAfterSeconds
				});
				log$1.warn(`rate-limit same-model retry ${consecutiveSameModelRateLimitRetries + 1}/3 for ${sanitizeForLog(provider)}/${sanitizeForLog(modelId)}: delayMs=${delayMs}`);
				try {
					await sleepWithAbort(delayMs, params.abortSignal);
				} catch (err) {
					if (params.abortSignal?.aborted) {
						const abortErr = new Error("Operation aborted", { cause: err });
						abortErr.name = "AbortError";
						throw abortErr;
					}
					throw err;
				}
				consecutiveSameModelRateLimitRetries = resolveNextSameModelRateLimitRetryCount({
					retriesSoFar: consecutiveSameModelRateLimitRetries,
					retriedSameModelRateLimit: true
				});
				return true;
			};
			ensureContextEnginesInitialized();
			const contextEngine = await resolveContextEngine(params.config, {
				agentDir,
				workspaceDir: resolvedWorkspace
			});
			const resolveContextEnginePluginId = () => resolveContextEngineOwnerPluginId(contextEngine);
			startupStages.mark("context-engine");
			notifyExecutionPhase("context_engine", {
				provider,
				model: modelId
			});
			try {
				const resolveActiveHookContext = () => ({
					...hookCtx,
					sessionId: activeSessionId
				});
				const adoptCompactionTranscript = (compactResult) => {
					const nextSessionId = compactResult.result?.sessionId;
					const nextSessionFile = compactResult.result?.sessionFile;
					adoptActiveSessionId(nextSessionId);
					if (nextSessionFile && nextSessionFile !== activeSessionFile) activeSessionFile = nextSessionFile;
				};
				const onCompactionHookMessages = async (payload) => {
					const messages = payload.messages.filter((message) => message.trim().length > 0);
					if (messages.length === 0) return;
					await params.onAgentEvent?.({
						stream: "compaction",
						data: {
							phase: payload.phase === "before" ? "start" : "end",
							...payload.phase === "after" ? { completed: true } : {},
							messages
						},
						...params.sessionKey ? { sessionKey: params.sessionKey } : {}
					});
				};
				const runOwnsCompactionBeforeHook = async (reason) => {
					if (contextEngine.info.ownsCompaction !== true || !hookRunner?.hasHooks("before_compaction")) return;
					try {
						await hookRunner.runBeforeCompaction({
							messageCount: -1,
							sessionFile: activeSessionFile
						}, resolveActiveHookContext());
					} catch (hookErr) {
						log$1.warn(`before_compaction hook failed during ${reason}: ${String(hookErr)}`);
					}
				};
				const runOwnsCompactionAfterHook = async (reason, compactResult) => {
					if (contextEngine.info.ownsCompaction !== true || !compactResult.ok || !compactResult.compacted || !hookRunner?.hasHooks("after_compaction")) return;
					try {
						await hookRunner.runAfterCompaction({
							messageCount: -1,
							compactedCount: -1,
							tokenCount: compactResult.result?.tokensAfter,
							sessionFile: compactResult.result?.sessionFile ?? activeSessionFile
						}, resolveActiveHookContext());
					} catch (hookErr) {
						log$1.warn(`after_compaction hook failed during ${reason}: ${String(hookErr)}`);
					}
				};
				let authRetryPending = false;
				let accumulatedReplayState = createEmbeddedRunReplayState();
				let lastTurnTotal;
				while (true) {
					if (runLoopIterations >= MAX_RUN_LOOP_ITERATIONS) {
						const message = `Exceeded retry limit after ${runLoopIterations} attempts (max=${MAX_RUN_LOOP_ITERATIONS}).`;
						log$1.error(`[run-retry-limit] sessionKey=${params.sessionKey ?? params.sessionId} provider=${provider}/${modelId} attempts=${runLoopIterations} maxAttempts=${MAX_RUN_LOOP_ITERATIONS}`);
						return handleRetryLimitExhaustion({
							message,
							decision: resolveRunFailoverDecision({
								stage: "retry_limit",
								fallbackConfigured,
								failoverReason: lastRetryFailoverReason
							}),
							provider,
							model: modelId,
							profileId: lastProfileId,
							durationMs: Date.now() - started,
							agentMeta: buildErrorAgentMeta({
								sessionId: activeSessionId,
								sessionFile: activeSessionFile,
								provider,
								model: model.id,
								contextTokens: ctxInfo.tokens,
								usageAccumulator,
								lastRunPromptUsage,
								lastTurnTotal
							}),
							replayInvalid: accumulatedReplayState.replayInvalid ? true : void 0,
							livenessState: "blocked"
						});
					}
					runLoopIterations += 1;
					const runtimeAuthRetry = authRetryPending;
					authRetryPending = false;
					attemptedThinking.add(thinkLevel);
					await fs.mkdir(resolvedWorkspace, { recursive: true });
					if (!startupStagesEmitted) startupStages.mark(EMBEDDED_RUN_ATTEMPT_DISPATCH_STAGE.workspace);
					const basePrompt = nextAttemptPromptOverride ?? (provider === "anthropic" ? scrubAnthropicRefusalMagic(params.prompt) : params.prompt);
					nextAttemptPromptOverride = null;
					const promptAdditions = [
						reasoningOnlyRetryInstruction,
						emptyResponseRetryInstruction,
						compactionContinuationRetryInstruction
					].filter((value) => typeof value === "string" && value.trim().length > 0);
					const prompt = promptAdditions.length > 0 ? `${basePrompt}\n\n${promptAdditions.join("\n\n")}` : basePrompt;
					const resolvedStreamApiKey = resolveAttemptDispatchApiKey({
						apiKeyInfo,
						runtimeAuthState
					});
					const attemptFastMode = resolveAttemptFastModeParam();
					if (!startupStagesEmitted) startupStages.mark(EMBEDDED_RUN_ATTEMPT_DISPATCH_STAGE.prompt);
					const runtimePlan = buildAgentRuntimePlan({
						provider,
						modelId,
						model: effectiveModel,
						modelApi: effectiveModel.api,
						harnessId: agentHarness.id,
						harnessRuntime: agentHarness.id,
						allowHarnessAuthProfileForwarding: pluginHarnessOwnsTransport,
						authProfileProvider: (lastProfileId ? attemptAuthProfileStore.profiles?.[lastProfileId]?.provider : void 0) ?? lastProfileId?.split(":", 1)[0],
						authProfileMode: lastProfileId ? attemptAuthProfileStore.profiles?.[lastProfileId]?.type : void 0,
						sessionAuthProfileId: lastProfileId,
						sessionAuthProfileCandidateIds: pluginHarnessOwnsTransport ? pluginHarnessForwardedProfileCandidates : void 0,
						config: params.config,
						workspaceDir: resolvedWorkspace,
						agentDir,
						agentId: workspaceResolution.agentId,
						thinkingLevel: thinkLevel,
						extraParamsOverride: {
							...params.streamParams,
							fastMode: attemptFastMode
						}
					});
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
					const attemptAbortController = new AbortController();
					postCompactionAbortController = attemptAbortController;
					const parentAbortSignal = params.abortSignal;
					const relayParentAbort = () => {
						laneTaskAbortController.abort(parentAbortSignal?.reason);
						attemptAbortController.abort(parentAbortSignal?.reason);
					};
					if (parentAbortSignal?.aborted) relayParentAbort();
					else parentAbortSignal?.addEventListener("abort", relayParentAbort, { once: true });
					let progressInterval;
					const stopLaneProgressHeartbeat = () => {
						if (progressInterval) {
							clearInterval(progressInterval);
							progressInterval = void 0;
						}
						attemptAbortController.signal.removeEventListener("abort", stopLaneProgressHeartbeat);
					};
					const startLaneProgressHeartbeat = () => {
						if (progressInterval || attemptAbortController.signal.aborted) return;
						progressInterval = setInterval(() => noteLaneTaskProgress(), EMBEDDED_RUN_LANE_HEARTBEAT_MS);
						progressInterval.unref?.();
						attemptAbortController.signal.addEventListener("abort", stopLaneProgressHeartbeat, { once: true });
					};
					let timeoutReleaseTimer;
					const clearAttemptTimeoutRelease = () => {
						if (timeoutReleaseTimer) {
							clearTimeout(timeoutReleaseTimer);
							timeoutReleaseTimer = void 0;
						}
					};
					const armAttemptTimeoutRelease = (reason) => {
						if (timeoutReleaseTimer) return;
						timeoutReleaseTimer = setTimeout(() => laneTaskReleaseController.abort(reason), EMBEDDED_RUN_LANE_TIMEOUT_GRACE_MS);
						timeoutReleaseTimer.unref?.();
					};
					const rawAttempt = await runEmbeddedAttemptWithBackend({
						sessionId: activeSessionId,
						sessionKey: resolvedSessionKey,
						promptCacheKey: params.promptCacheKey,
						sandboxSessionKey: params.sandboxSessionKey,
						trigger: params.trigger,
						memoryFlushWritePath: params.memoryFlushWritePath,
						messageChannel: params.messageChannel,
						messageProvider: params.messageProvider,
						chatType: params.chatType,
						agentAccountId: params.agentAccountId,
						messageTo: params.messageTo,
						messageThreadId: params.messageThreadId,
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
						sessionFile: activeSessionFile,
						workspaceDir: resolvedWorkspace,
						cwd: params.cwd,
						agentDir,
						config: params.config,
						allowGatewaySubagentBinding: params.allowGatewaySubagentBinding,
						contextEngine,
						contextTokenBudget: ctxInfo.tokens,
						contextWindowInfo: ctxInfo,
						skillsSnapshot: params.skillsSnapshot,
						prompt,
						transcriptPrompt: params.transcriptPrompt,
						userTurnTranscriptRecorder: params.userTurnTranscriptRecorder,
						currentInboundEventKind: params.currentInboundEventKind,
						currentInboundContext: params.currentInboundContext,
						images: params.images,
						imageOrder: params.imageOrder,
						clientTools: params.clientTools,
						disableTools: params.disableTools,
						provider,
						modelId,
						requestedModelId,
						fallbackActive: modelId !== requestedModelId || Boolean(resolveRuntimeFallbackReason()),
						fallbackReason: resolveRuntimeFallbackReason(),
						agentHarnessId: agentHarness.id,
						...params.sessionKey ? { agentHarnessTaskRuntimeScope: createAgentHarnessTaskRuntimeScope({ requesterSessionKey: params.sessionKey }) } : {},
						runtimePlan,
						model: applyAuthHeaderOverride(applyLocalNoAuthHeaderOverride(effectiveModel, apiKeyInfo), runtimeAuthState ? null : apiKeyInfo, params.config),
						resolvedApiKey: resolvedStreamApiKey,
						authProfileId: lastProfileId,
						authProfileIdSource: lockedProfileId ? "user" : "auto",
						initialReplayState: accumulatedReplayState,
						authStorage,
						authProfileStore: runAttemptAuthProfileStore,
						toolAuthProfileStore: harnessBuildsOpenClawTools ? attemptAuthProfileStore : void 0,
						modelRegistry,
						agentId: workspaceResolution.agentId,
						beforeAgentStartResult,
						thinkLevel,
						onToolOutcome: observeToolOutcome,
						allocateToolOutcomeOrdinal,
						onToolStreamBoundary: maybeAnnounceFastModeAutoOff,
						onRunProgress: notifyRunProgress,
						fastMode: attemptFastMode,
						fastModeAuto: params.fastMode === "auto",
						...params.fastMode === "auto" ? {
							fastModeStartedAtMs: fastModeStarted,
							fastModeAutoOnSeconds,
							fastModeAutoProgressState
						} : {},
						verboseLevel: params.verboseLevel,
						reasoningLevel: params.reasoningLevel,
						toolResultFormat: resolvedToolResultFormat,
						toolProgressDetail: params.toolProgressDetail,
						execOverrides: params.execOverrides,
						bashElevated: params.bashElevated,
						timeoutMs: params.timeoutMs,
						runTimeoutOverrideMs: params.runTimeoutOverrideMs,
						runId: params.runId,
						lifecycleGeneration,
						abortSignal: attemptAbortController.signal,
						onAttemptTimeoutArmed: pluginHarnessOwnsTransport ? void 0 : startLaneProgressHeartbeat,
						onAttemptTimeout: pluginHarnessOwnsTransport ? void 0 : armAttemptTimeoutRelease,
						onAttemptAbort: pluginHarnessOwnsTransport ? void 0 : () => {
							stopLaneProgressHeartbeat();
							laneTaskAbortController.abort();
						},
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
						onReasoningEnd: params.onReasoningEnd,
						onToolResult: notifyToolResult,
						onAgentToolResult: params.onAgentToolResult,
						onAgentEvent: notifyAgentEvent,
						deferTerminalLifecycle: params.deferTerminalLifecycle ?? params.deferTerminalLifecycleEnd,
						deferTerminalLifecycleEnd: params.deferTerminalLifecycle ?? params.deferTerminalLifecycleEnd,
						onExecutionPhase: params.onExecutionPhase,
						extraSystemPrompt: params.extraSystemPrompt,
						sourceReplyDeliveryMode: params.sourceReplyDeliveryMode,
						inputProvenance: params.inputProvenance,
						streamParams: params.streamParams,
						modelRun: params.modelRun,
						promptMode: params.promptMode,
						ownerNumbers: params.ownerNumbers,
						enforceFinalTag: params.enforceFinalTag,
						silentExpected: params.silentExpected,
						suppressLiveStreamOutput: params.suppressLiveStreamOutput,
						bootstrapContextMode: params.bootstrapContextMode,
						bootstrapContextRunKind: params.bootstrapContextRunKind,
						jobId: params.jobId,
						toolsAllow: params.toolsAllow,
						cleanupBundleMcpOnRunEnd: params.cleanupBundleMcpOnRunEnd,
						disableMessageTool: params.disableMessageTool,
						forceMessageTool: params.forceMessageTool,
						enableHeartbeatTool: params.enableHeartbeatTool,
						forceHeartbeatTool: params.forceHeartbeatTool,
						requireExplicitMessageTarget: params.requireExplicitMessageTarget,
						internalEvents: params.internalEvents,
						bootstrapPromptWarningSignaturesSeen,
						bootstrapPromptWarningSignature: bootstrapPromptWarningSignaturesSeen[bootstrapPromptWarningSignaturesSeen.length - 1],
						suppressNextUserMessagePersistence,
						beforeAgentFinalizeRevisionAttempts,
						maxBeforeAgentFinalizeRevisions: MAX_BEFORE_AGENT_FINALIZE_REVISIONS,
						suppressTranscriptOnlyAssistantPersistence: params.suppressTranscriptOnlyAssistantPersistence,
						suppressAssistantErrorPersistence: params.suppressAssistantErrorPersistence,
						onUserMessagePersisted,
						onAssistantErrorMessagePersisted: params.onAssistantErrorMessagePersisted
					}).catch((err) => {
						throw postCompactionAbortError ?? err;
					}).finally(() => {
						clearAttemptTimeoutRelease();
						stopLaneProgressHeartbeat();
						parentAbortSignal?.removeEventListener?.("abort", relayParentAbort);
						if (postCompactionAbortController === attemptAbortController) postCompactionAbortController = void 0;
					});
					if (postCompactionAbortError) throw postCompactionAbortError;
					const attempt = normalizeEmbeddedRunAttemptResult(rawAttempt);
					const { aborted, externalAbort, promptError, promptErrorSource, preflightRecovery, timedOut, idleTimedOut, timedOutDuringCompaction, sessionIdUsed, sessionFileUsed, lastAssistant: sessionLastAssistant, currentAttemptAssistant } = attempt;
					const setTerminalLifecycleMeta = (meta) => {
						attempt.setTerminalLifecycleMeta?.({
							...meta,
							aborted
						});
					};
					const timedOutDuringToolExecution = attempt.timedOutDuringToolExecution ?? false;
					adoptActiveSessionId(sessionIdUsed);
					if (sessionFileUsed && sessionFileUsed !== activeSessionFile) activeSessionFile = sessionFileUsed;
					bootstrapPromptWarningSignaturesSeen = attempt.bootstrapPromptWarningSignaturesSeen ?? (attempt.bootstrapPromptWarningSignature ? Array.from(new Set([...bootstrapPromptWarningSignaturesSeen, attempt.bootstrapPromptWarningSignature])) : bootstrapPromptWarningSignaturesSeen);
					const lastAssistantUsage = normalizeUsage(sessionLastAssistant?.usage);
					const attemptUsage = attempt.attemptUsage ?? lastAssistantUsage;
					mergeUsageIntoAccumulator(usageAccumulator, attemptUsage);
					lastRunPromptUsage = lastAssistantUsage ?? attemptUsage;
					lastTurnTotal = lastAssistantUsage?.total ?? attemptUsage?.total;
					const breakerStep = stepIdleTimeoutBreaker(idleTimeoutBreakerState, {
						idleTimedOut,
						completedModelProgress: hasCompletedModelProgressForIdleBreaker(attempt),
						outputTokens: attemptUsage?.output
					});
					if (breakerStep.tripped) {
						const breakerMessage = `Idle-timeout cost-runaway breaker tripped: ${breakerStep.consecutive} consecutive idle timeouts without completed model progress (cap=5). Halting further attempts to bound paid model calls. See issue #76293.`;
						log$1.error(`[idle-timeout-circuit-breaker-tripped] sessionKey=${params.sessionKey ?? params.sessionId} provider=${provider}/${modelId} consecutive=${breakerStep.consecutive} cap=5`);
						return handleRetryLimitExhaustion({
							message: breakerMessage,
							decision: resolveRunFailoverDecision({
								stage: "retry_limit",
								fallbackConfigured,
								failoverReason: lastRetryFailoverReason
							}),
							provider,
							model: modelId,
							profileId: lastProfileId,
							durationMs: Date.now() - started,
							agentMeta: buildErrorAgentMeta({
								sessionId: activeSessionId,
								sessionFile: activeSessionFile,
								provider,
								model: model.id,
								contextTokens: ctxInfo.tokens,
								usageAccumulator,
								lastRunPromptUsage,
								lastTurnTotal
							}),
							replayInvalid: accumulatedReplayState.replayInvalid ? true : void 0,
							livenessState: "blocked"
						});
					}
					const attemptCompactionCount = Math.max(0, attempt.compactionCount ?? 0);
					autoCompactionCount += attemptCompactionCount;
					if (typeof attempt.compactionTokensAfter === "number" && Number.isFinite(attempt.compactionTokensAfter) && attempt.compactionTokensAfter >= 0) lastCompactionTokensAfter = Math.floor(attempt.compactionTokensAfter);
					if (attempt.contextBudgetStatus) lastContextBudgetStatus = attempt.contextBudgetStatus;
					const sessionAssistantForCandidate = !currentAttemptAssistant && !isAssistantForModelRef(sessionLastAssistant, {
						provider: effectiveModel.provider,
						model: effectiveModel.id
					}) ? void 0 : sessionLastAssistant;
					const activeErrorContext = resolveActiveErrorContext({
						provider,
						model: modelId,
						assistant: currentAttemptAssistant ?? sessionAssistantForCandidate
					});
					const resolveReplayInvalidForAttempt = (incompleteTurnText) => accumulatedReplayState.replayInvalid || resolveReplayInvalidFlag({
						attempt,
						incompleteTurnText
					});
					if (resolveReplayInvalidForAttempt(null)) accumulatedReplayState.replayInvalid = true;
					accumulatedReplayState = observeReplayMetadata(accumulatedReplayState, attempt.replayMetadata);
					const formattedAssistantErrorText = sessionAssistantForCandidate ? formatAssistantErrorText(sessionAssistantForCandidate, {
						cfg: params.config,
						sessionKey: resolvedSessionKey ?? params.sessionId,
						provider: activeErrorContext.provider,
						model: activeErrorContext.model,
						authMode: lastProfileId ? attemptAuthProfileStore.profiles?.[lastProfileId]?.type : void 0
					}) : void 0;
					const assistantErrorText = sessionAssistantForCandidate?.stopReason === "error" ? sessionAssistantForCandidate.errorMessage?.trim() || formattedAssistantErrorText : void 0;
					const canRestartForLiveSwitch = !hasOutboundDeliveryEvidence(attempt) && !attempt.didSendDeterministicApprovalPrompt && !attempt.lastToolError && (attempt.toolMetas?.length ?? 0) === 0 && (attempt.assistantTexts?.length ?? 0) === 0;
					if (preflightRecovery?.handled) {
						const retryingFromTranscript = preflightRecovery.source === "mid-turn";
						log$1.info(`[context-overflow-precheck] early recovery route=${preflightRecovery.route} completed for ${provider}/${modelId}; ` + (retryingFromTranscript ? "retrying from current transcript" : "retrying prompt"));
						if (retryingFromTranscript) continueFromCurrentTranscript();
						continue;
					}
					const requestedSelection = shouldSwitchToLiveModel({
						cfg: params.config,
						sessionKey: resolvedSessionKey,
						agentId: params.agentId,
						defaultProvider: DEFAULT_PROVIDER,
						defaultModel: DEFAULT_MODEL,
						currentProvider: provider,
						currentModel: modelId,
						currentAuthProfileId: preferredProfileId,
						currentAuthProfileIdSource: params.authProfileIdSource
					});
					if (requestedSelection && canRestartForLiveSwitch) {
						await clearLiveModelSwitchPending({
							cfg: params.config,
							sessionKey: resolvedSessionKey,
							agentId: params.agentId
						});
						log$1.info(`live session model switch requested during active attempt for ${params.sessionId}: ${provider}/${modelId} -> ${requestedSelection.provider}/${requestedSelection.model}`);
						throw new LiveSessionModelSwitchError(requestedSelection);
					}
					if (timedOut && !timedOutDuringCompaction && !timedOutDuringToolExecution) {
						const lastTurnPromptTokens = derivePromptTokens(lastRunPromptUsage);
						const tokenUsedRatio = lastTurnPromptTokens != null && ctxInfo.tokens > 0 ? lastTurnPromptTokens / ctxInfo.tokens : 0;
						if (timeoutCompactionAttempts >= MAX_TIMEOUT_COMPACTION_ATTEMPTS) log$1.warn(`[timeout-compaction] already attempted timeout compaction ${timeoutCompactionAttempts} time(s); falling through to failover rotation`);
						else if (tokenUsedRatio > .65) {
							const timeoutDiagId = createCompactionDiagId();
							timeoutCompactionAttempts++;
							log$1.warn(`[timeout-compaction] LLM timed out with high prompt token usage (${Math.round(tokenUsedRatio * 100)}%); attempting compaction before retry (attempt ${timeoutCompactionAttempts}/${MAX_TIMEOUT_COMPACTION_ATTEMPTS}) diagId=${timeoutDiagId}`);
							let timeoutCompactResult;
							await runOwnsCompactionBeforeHook("timeout recovery");
							try {
								const timeoutCompactionRuntimeContext = {
									...buildEmbeddedCompactionRuntimeContext({
										sessionKey: params.sessionKey,
										messageChannel: params.messageChannel,
										messageProvider: params.messageProvider,
										chatType: params.chatType,
										agentAccountId: params.agentAccountId,
										currentChannelId: params.currentChannelId,
										currentThreadTs: params.currentThreadTs,
										currentMessageId: params.currentMessageId,
										authProfileId: lastProfileId,
										workspaceDir: resolvedWorkspace,
										agentDir,
										config: params.config,
										skillsSnapshot: params.skillsSnapshot,
										senderId: params.senderId,
										provider,
										modelId,
										harnessRuntime: agentHarness.id,
										modelFallbacksOverride: params.modelFallbacksOverride,
										thinkLevel,
										reasoningLevel: params.reasoningLevel,
										bashElevated: params.bashElevated,
										extraSystemPrompt: params.extraSystemPrompt,
										sourceReplyDeliveryMode: params.sourceReplyDeliveryMode,
										ownerNumbers: params.ownerNumbers,
										activeProcessSessions: listActiveProcessSessionReferences({ scopeKey: resolveProcessToolScopeKey({
											sessionKey: params.sandboxSessionKey?.trim() || params.sessionKey,
											sessionId: activeSessionId,
											agentId: sessionAgentId
										}) })
									}),
									...resolveContextEngineCapabilities({
										config: params.config,
										sessionKey: params.sessionKey,
										agentId: sessionAgentId,
										contextEnginePluginId: resolveContextEnginePluginId(),
										purpose: "context-engine.timeout-compaction"
									}),
									onCompactionHookMessages,
									...attempt.promptCache ? { promptCache: attempt.promptCache } : {},
									runId: params.runId,
									trigger: "timeout_recovery",
									diagId: timeoutDiagId,
									attempt: timeoutCompactionAttempts,
									maxAttempts: MAX_TIMEOUT_COMPACTION_ATTEMPTS
								};
								timeoutCompactResult = await compactContextEngineWithSafetyTimeout(contextEngine, {
									sessionId: activeSessionId,
									sessionKey: params.sessionKey,
									sessionFile: activeSessionFile,
									tokenBudget: ctxInfo.tokens,
									force: true,
									compactionTarget: "budget",
									runtimeContext: timeoutCompactionRuntimeContext,
									runtimeSettings: buildEmbeddedContextEngineRuntimeSettings({ tokenBudget: ctxInfo.tokens })
								}, resolveCompactionTimeoutMs(params.config), params.abortSignal);
							} catch (compactErr) {
								log$1.warn(`[timeout-compaction] contextEngine.compact() threw during timeout recovery for ${provider}/${modelId}: ${String(compactErr)}`);
								timeoutCompactResult = {
									ok: false,
									compacted: false,
									reason: String(compactErr)
								};
							}
							if (timeoutCompactResult.compacted) adoptCompactionTranscript(timeoutCompactResult);
							await runOwnsCompactionAfterHook("timeout recovery", timeoutCompactResult);
							if (timeoutCompactResult.compacted) {
								autoCompactionCount += 1;
								if (typeof timeoutCompactResult.result?.tokensAfter === "number" && Number.isFinite(timeoutCompactResult.result.tokensAfter) && timeoutCompactResult.result.tokensAfter >= 0) lastCompactionTokensAfter = Math.floor(timeoutCompactResult.result.tokensAfter);
								if (contextEngine.info.ownsCompaction === true) await runPostCompactionSideEffects({
									config: params.config,
									sessionKey: params.sessionKey,
									agentId: sessionAgentId,
									sessionFile: activeSessionFile
								});
								log$1.info(`[timeout-compaction] compaction succeeded for ${provider}/${modelId}; retrying prompt`);
								postCompactionGuard.armPostCompaction();
								continue;
							} else log$1.warn(`[timeout-compaction] compaction did not reduce context for ${provider}/${modelId}; falling through to normal handling`);
						}
					}
					const contextOverflowError = !aborted ? (() => {
						if (promptError) {
							const errorText = formatErrorMessage(promptError);
							if (isLikelyContextOverflowError(errorText)) return {
								text: errorText,
								source: "promptError"
							};
							return null;
						}
						if (assistantErrorText && isLikelyContextOverflowError(assistantErrorText)) return {
							text: assistantErrorText,
							source: "assistantError"
						};
						return null;
					})() : null;
					if (contextOverflowError) {
						const overflowDiagId = createCompactionDiagId();
						const errorText = contextOverflowError.text;
						const msgCount = attempt.messagesSnapshot?.length ?? 0;
						const observedOverflowTokens = extractObservedOverflowTokenCount(errorText);
						const overflowTokenCountForCompaction = observedOverflowTokens ?? (ctxInfo.tokens > 0 ? ctxInfo.tokens + 1 : void 0);
						log$1.warn(`[context-overflow-diag] sessionKey=${params.sessionKey ?? params.sessionId} provider=${provider}/${modelId} source=${contextOverflowError.source} messages=${msgCount} sessionFile=${activeSessionFile} diagId=${overflowDiagId} compactionAttempts=${overflowCompactionAttempts} observedTokens=${observedOverflowTokens ?? "unknown"} compactionTokens=${overflowTokenCountForCompaction ?? "unknown"} error=${errorText.slice(0, 200)}`);
						const isCompactionFailure = isCompactionFailureError(errorText);
						const hadAttemptLevelCompaction = attemptCompactionCount > 0;
						if (!isCompactionFailure && hadAttemptLevelCompaction && overflowCompactionAttempts < MAX_OVERFLOW_COMPACTION_ATTEMPTS) {
							overflowCompactionAttempts++;
							log$1.warn(`context overflow persisted after in-attempt compaction (attempt ${overflowCompactionAttempts}/${MAX_OVERFLOW_COMPACTION_ATTEMPTS}); retrying prompt without additional compaction for ${provider}/${modelId}`);
							if (preflightRecovery?.source === "mid-turn") continueFromCurrentTranscript();
							continue;
						}
						if (!isCompactionFailure && !hadAttemptLevelCompaction && overflowCompactionAttempts < MAX_OVERFLOW_COMPACTION_ATTEMPTS) {
							if (log$1.isEnabled("debug")) log$1.debug(`[compaction-diag] decision diagId=${overflowDiagId} branch=compact isCompactionFailure=${isCompactionFailure} hasOversizedToolResults=unknown attempt=${overflowCompactionAttempts + 1} maxAttempts=${MAX_OVERFLOW_COMPACTION_ATTEMPTS}`);
							overflowCompactionAttempts++;
							log$1.warn(`context overflow detected (attempt ${overflowCompactionAttempts}/${MAX_OVERFLOW_COMPACTION_ATTEMPTS}); attempting auto-compaction for ${provider}/${modelId}`);
							let compactResult;
							await runOwnsCompactionBeforeHook("overflow recovery");
							try {
								const overflowCompactionRuntimeContext = {
									...buildEmbeddedCompactionRuntimeContext({
										sessionKey: params.sessionKey,
										messageChannel: params.messageChannel,
										messageProvider: params.messageProvider,
										chatType: params.chatType,
										agentAccountId: params.agentAccountId,
										currentChannelId: params.currentChannelId,
										currentThreadTs: params.currentThreadTs,
										currentMessageId: params.currentMessageId,
										authProfileId: lastProfileId,
										workspaceDir: resolvedWorkspace,
										agentDir,
										config: params.config,
										skillsSnapshot: params.skillsSnapshot,
										senderId: params.senderId,
										provider,
										modelId,
										harnessRuntime: agentHarness.id,
										thinkLevel,
										reasoningLevel: params.reasoningLevel,
										bashElevated: params.bashElevated,
										extraSystemPrompt: params.extraSystemPrompt,
										sourceReplyDeliveryMode: params.sourceReplyDeliveryMode,
										ownerNumbers: params.ownerNumbers,
										activeProcessSessions: listActiveProcessSessionReferences({ scopeKey: resolveProcessToolScopeKey({
											sessionKey: params.sandboxSessionKey?.trim() || params.sessionKey,
											sessionId: activeSessionId,
											agentId: sessionAgentId
										}) })
									}),
									...resolveContextEngineCapabilities({
										config: params.config,
										sessionKey: params.sessionKey,
										agentId: sessionAgentId,
										contextEnginePluginId: resolveContextEnginePluginId(),
										purpose: "context-engine.overflow-compaction"
									}),
									onCompactionHookMessages,
									...attempt.promptCache ? { promptCache: attempt.promptCache } : {},
									runId: params.runId,
									trigger: "overflow",
									...overflowTokenCountForCompaction !== void 0 ? { currentTokenCount: overflowTokenCountForCompaction } : {},
									diagId: overflowDiagId,
									attempt: overflowCompactionAttempts,
									maxAttempts: MAX_OVERFLOW_COMPACTION_ATTEMPTS
								};
								const overflowCompactionRuntimeSettings = buildEmbeddedContextEngineRuntimeSettings({
									tokenBudget: ctxInfo.tokens,
									degradedReason: "context_overflow"
								});
								compactResult = await compactContextEngineWithSafetyTimeout(contextEngine, {
									sessionId: activeSessionId,
									sessionKey: params.sessionKey,
									sessionFile: activeSessionFile,
									tokenBudget: ctxInfo.tokens,
									...overflowTokenCountForCompaction !== void 0 ? { currentTokenCount: overflowTokenCountForCompaction } : {},
									force: true,
									compactionTarget: "budget",
									runtimeContext: overflowCompactionRuntimeContext,
									runtimeSettings: overflowCompactionRuntimeSettings
								}, resolveCompactionTimeoutMs(params.config), params.abortSignal);
								if (compactResult.ok && compactResult.compacted) {
									adoptCompactionTranscript(compactResult);
									await runContextEngineMaintenance({
										contextEngine,
										sessionId: activeSessionId,
										sessionKey: params.sessionKey,
										sessionFile: activeSessionFile,
										reason: "compaction",
										runtimeContext: overflowCompactionRuntimeContext,
										runtimeSettings: overflowCompactionRuntimeSettings,
										config: params.config,
										agentId: sessionAgentId
									});
								}
							} catch (compactErr) {
								log$1.warn(`contextEngine.compact() threw during overflow recovery for ${provider}/${modelId}: ${String(compactErr)}`);
								compactResult = {
									ok: false,
									compacted: false,
									reason: String(compactErr)
								};
							}
							await runOwnsCompactionAfterHook("overflow recovery", compactResult);
							if (preflightRecovery && isNoRealConversationCompactionNoop(compactResult)) {
								lastCompactionTokensAfter = void 0;
								lastContextBudgetStatus = void 0;
								await resetNoRealConversationTokenSnapshot({
									config: params.config,
									sessionKey: params.sessionKey,
									agentId: sessionAgentId
								});
								log$1.info(`[context-overflow-precheck] stale token state had no real conversation messages for ${provider}/${modelId}; resetting the context snapshot and retrying prompt`);
								if (preflightRecovery.source === "mid-turn") continueFromCurrentTranscript();
								continue;
							}
							if (compactResult.compacted) {
								adoptCompactionTranscript(compactResult);
								if (typeof compactResult.result?.tokensAfter === "number" && Number.isFinite(compactResult.result.tokensAfter) && compactResult.result.tokensAfter >= 0) lastCompactionTokensAfter = Math.floor(compactResult.result.tokensAfter);
								if (preflightRecovery?.route === "compact_then_truncate") {
									const truncResult = await truncateOversizedToolResultsInSession({
										sessionFile: activeSessionFile,
										contextWindowTokens: ctxInfo.tokens,
										maxCharsOverride: resolveLiveToolResultMaxChars({
											contextWindowTokens: ctxInfo.tokens,
											cfg: params.config,
											agentId: sessionAgentId
										}),
										sessionId: activeSessionId,
										sessionKey: params.sessionKey,
										agentId: sessionAgentId,
										config: params.config
									});
									if (truncResult.truncated) log$1.info(`[context-overflow-precheck] post-compaction tool-result truncation succeeded for ${provider}/${modelId}; truncated ${truncResult.truncatedCount} tool result(s)`);
									else log$1.warn(`[context-overflow-precheck] post-compaction tool-result truncation did not help for ${provider}/${modelId}: ${truncResult.reason ?? "unknown"}`);
								}
								autoCompactionCount += 1;
								log$1.info(`auto-compaction succeeded for ${provider}/${modelId}; retrying prompt`);
								postCompactionGuard.armPostCompaction();
								if (preflightRecovery?.source === "mid-turn") continueFromCurrentTranscript();
								else if (params.currentMessageId !== void 0 && params.currentMessageId === lastPersistedCurrentMessageId) {
									nextAttemptPromptOverride = MID_TURN_PRECHECK_CONTINUATION_PROMPT;
									suppressNextUserMessagePersistence = true;
								}
								continue;
							}
							log$1.warn(`auto-compaction failed for ${provider}/${modelId}: ${compactResult.reason ?? "nothing to compact"}`);
						}
						if (!toolResultTruncationAttempted) {
							const contextWindowTokens = ctxInfo.tokens;
							const toolResultMaxChars = resolveLiveToolResultMaxChars({
								contextWindowTokens,
								cfg: params.config,
								agentId: sessionAgentId
							});
							if (attempt.messagesSnapshot ? sessionLikelyHasOversizedToolResults({
								messages: attempt.messagesSnapshot,
								contextWindowTokens,
								maxCharsOverride: toolResultMaxChars
							}) : false) {
								toolResultTruncationAttempted = true;
								log$1.warn(`[context-overflow-recovery] Attempting tool result truncation for ${provider}/${modelId} (contextWindow=${contextWindowTokens} tokens)`);
								const truncResult = await truncateOversizedToolResultsInSession({
									sessionFile: activeSessionFile,
									contextWindowTokens,
									maxCharsOverride: toolResultMaxChars,
									sessionId: activeSessionId,
									sessionKey: params.sessionKey,
									agentId: sessionAgentId,
									config: params.config
								});
								if (truncResult.truncated) {
									log$1.info(`[context-overflow-recovery] Truncated ${truncResult.truncatedCount} tool result(s); retrying prompt`);
									if (preflightRecovery?.source === "mid-turn") continueFromCurrentTranscript();
									continue;
								}
								log$1.warn(`[context-overflow-recovery] Tool result truncation did not help: ${truncResult.reason ?? "unknown"}`);
							}
						}
						if ((isCompactionFailure || overflowCompactionAttempts >= MAX_OVERFLOW_COMPACTION_ATTEMPTS) && log$1.isEnabled("debug")) log$1.debug(`[compaction-diag] decision diagId=${overflowDiagId} branch=give_up isCompactionFailure=${isCompactionFailure} hasOversizedToolResults=unknown attempt=${overflowCompactionAttempts} maxAttempts=${MAX_OVERFLOW_COMPACTION_ATTEMPTS}`);
						const kind = isCompactionFailure ? "compaction_failure" : "context_overflow";
						const overflowRecoveryText = "Context overflow: prompt too large for the model. Try /reset (or /new) to start a fresh session, or use a larger-context model.";
						log$1.warn(`[context-overflow-recovery] exhausted provider overflow recovery for ${provider}/${modelId}; livenessState=blocked suggestedAction=reset_or_new kind=${kind}`);
						setTerminalLifecycleMeta({
							replayInvalid: resolveReplayInvalidForAttempt(),
							livenessState: "blocked"
						});
						return {
							payloads: [{
								text: overflowRecoveryText,
								isError: true
							}],
							meta: {
								durationMs: Date.now() - started,
								agentMeta: buildErrorAgentMeta({
									sessionId: sessionIdUsed,
									sessionFile: activeSessionFile,
									provider,
									model: model.id,
									contextTokens: ctxInfo.tokens,
									usageAccumulator,
									lastRunPromptUsage,
									lastAssistant: sessionLastAssistant,
									lastTurnTotal
								}),
								systemPromptReport: attempt.systemPromptReport,
								finalAssistantVisibleText: overflowRecoveryText,
								finalAssistantRawText: overflowRecoveryText,
								finalPromptText: attempt.finalPromptText,
								replayInvalid: resolveReplayInvalidForAttempt(),
								livenessState: "blocked",
								error: {
									kind,
									message: errorText
								}
							}
						};
					}
					if (promptErrorSource === "hook:before_agent_run" && !aborted) {
						const errorText = formatErrorMessage(promptError);
						const replayInvalid = resolveReplayInvalidForAttempt();
						setTerminalLifecycleMeta({
							replayInvalid,
							livenessState: "blocked"
						});
						return {
							payloads: [{
								text: errorText,
								isError: true
							}],
							meta: {
								durationMs: Date.now() - started,
								agentMeta: buildErrorAgentMeta({
									sessionId: sessionIdUsed,
									sessionFile: activeSessionFile,
									provider,
									model: model.id,
									contextTokens: ctxInfo.tokens,
									usageAccumulator,
									lastRunPromptUsage,
									lastAssistant: sessionLastAssistant,
									lastTurnTotal
								}),
								systemPromptReport: attempt.systemPromptReport,
								finalAssistantVisibleText: errorText,
								finalAssistantRawText: errorText,
								finalPromptText: void 0,
								replayInvalid,
								livenessState: "blocked",
								error: {
									kind: "hook_block",
									message: errorText
								}
							}
						};
					}
					const hasRecoverableCodexAppServerTimeoutOutcome = Boolean(attempt.codexAppServerFailure && attempt.promptTimeoutOutcome);
					let shouldSurfaceCodexCompletionTimeout = false;
					if (promptError && promptErrorSource !== "compaction" && attempt.codexAppServerFailure) {
						if (resolveCodexAppServerRecoveryRetry({
							attempt,
							alreadyRetried: codexAppServerRecoveryRetries > 0
						}).retry) {
							codexAppServerRecoveryRetries += 1;
							suppressNextUserMessagePersistence = true;
							log$1.warn(`codex app-server replay-safe failure; retrying once failureKind=${attempt.codexAppServerFailure?.kind} runId=${params.runId} sessionId=${params.sessionId}`);
							continue;
						}
						shouldSurfaceCodexCompletionTimeout = attempt.codexAppServerFailure?.kind === "turn_completion_idle_timeout" && attempt.timedOut;
						if (attempt.codexAppServerFailure && !hasRecoverableCodexAppServerTimeoutOutcome && !shouldSurfaceCodexCompletionTimeout) throw toErrorObject(promptError, "Prompt failed");
					}
					if (promptError && !aborted && promptErrorSource !== "compaction" && !hasRecoverableCodexAppServerTimeoutOutcome && !shouldSurfaceCodexCompletionTimeout) {
						const promptAuthMode = lastProfileId ? attemptAuthProfileStore.profiles?.[lastProfileId]?.type : void 0;
						const normalizedPromptFailover = coerceToFailoverError(promptError, {
							provider: activeErrorContext.provider,
							model: activeErrorContext.model,
							profileId: lastProfileId,
							authMode: promptAuthMode,
							sessionId: sessionIdUsed,
							lane: globalLane
						});
						const promptErrorDetails = normalizedPromptFailover ? describeFailoverError(normalizedPromptFailover) : describeFailoverError(promptError);
						if (normalizedPromptFailover?.suspend) suspendForFailure({
							cfg: params.config,
							agentDir,
							sessionId: activeSessionId ?? params.sessionId,
							reason: resolveSessionSuspensionReason(normalizedPromptFailover.reason),
							failedProvider: normalizedPromptFailover.provider ?? provider,
							failedModel: normalizedPromptFailover.model ?? modelId
						});
						const errorText = promptErrorDetails.message || formatErrorMessage(promptError);
						if (await maybeRefreshRuntimeAuthForAuthError(errorText, runtimeAuthRetry)) {
							authRetryPending = true;
							continue;
						}
						if (/incorrect role information|roles must alternate/i.test(errorText)) {
							setTerminalLifecycleMeta({
								replayInvalid: resolveReplayInvalidForAttempt(),
								livenessState: "blocked"
							});
							return {
								payloads: [{
									text: "Message ordering conflict - please try again. If this persists, use /new to start a fresh session.",
									isError: true
								}],
								meta: {
									durationMs: Date.now() - started,
									agentMeta: buildErrorAgentMeta({
										sessionId: sessionIdUsed,
										sessionFile: activeSessionFile,
										provider,
										model: model.id,
										contextTokens: ctxInfo.tokens,
										usageAccumulator,
										lastRunPromptUsage,
										lastAssistant: sessionLastAssistant,
										lastTurnTotal
									}),
									systemPromptReport: attempt.systemPromptReport,
									finalPromptText: attempt.finalPromptText,
									replayInvalid: resolveReplayInvalidForAttempt(),
									livenessState: "blocked",
									error: {
										kind: "role_ordering",
										message: errorText
									}
								}
							};
						}
						const imageSizeError = parseImageSizeError(errorText);
						if (imageSizeError) {
							const maxMb = imageSizeError.maxMb;
							const maxMbLabel = typeof maxMb === "number" && Number.isFinite(maxMb) ? `${maxMb}` : null;
							const maxBytesHint = maxMbLabel ? ` (max ${maxMbLabel}MB)` : "";
							setTerminalLifecycleMeta({
								replayInvalid: resolveReplayInvalidForAttempt(),
								livenessState: "blocked"
							});
							return {
								payloads: [{
									text: `Image too large for the model${maxBytesHint}. Please compress or resize the image and try again.`,
									isError: true
								}],
								meta: {
									durationMs: Date.now() - started,
									agentMeta: buildErrorAgentMeta({
										sessionId: sessionIdUsed,
										sessionFile: activeSessionFile,
										provider,
										model: model.id,
										contextTokens: ctxInfo.tokens,
										usageAccumulator,
										lastRunPromptUsage,
										lastAssistant: sessionLastAssistant,
										lastTurnTotal
									}),
									systemPromptReport: attempt.systemPromptReport,
									finalPromptText: attempt.finalPromptText,
									replayInvalid: resolveReplayInvalidForAttempt(),
									livenessState: "blocked",
									error: {
										kind: "image_size",
										message: errorText
									}
								}
							};
						}
						const promptFailoverReason = promptErrorDetails.reason ?? classifyFailoverReason(errorText, { provider });
						const promptProfileFailureReason = resolveRunAuthProfileFailureReason(promptFailoverReason, {
							providerStarted: promptErrorSource === "prompt",
							transientRateLimit: promptFailoverReason === "rate_limit" && isShortWindowRateLimitMessage(errorText)
						});
						const promptFailoverFailure = promptFailoverReason !== null || isFailoverErrorMessage(errorText, { provider });
						const failedPromptProfileId = lastProfileId;
						const logPromptFailoverDecision = createFailoverDecisionLogger({
							stage: "prompt",
							runId: params.runId,
							rawError: errorText,
							failoverReason: promptFailoverReason,
							profileFailureReason: promptProfileFailureReason,
							provider,
							model: modelId,
							sourceProvider: provider,
							sourceModel: modelId,
							profileId: failedPromptProfileId,
							fallbackConfigured,
							aborted
						});
						if (promptFailoverReason === "rate_limit") maybeEscalateRateLimitProfileFallback({
							failoverProvider: provider,
							failoverModel: modelId,
							logFallbackDecision: logPromptFailoverDecision
						});
						let promptFailoverDecision = resolveRunFailoverDecision({
							stage: "prompt",
							aborted,
							externalAbort,
							fallbackConfigured,
							failoverFailure: promptFailoverFailure,
							failoverReason: promptFailoverReason,
							harnessOwnsTransport: pluginHarnessOwnsTransport,
							profileRotated: false
						});
						if (promptFailoverDecision.action === "rotate_profile" && await advanceAttemptAuthProfile()) {
							if (failedPromptProfileId && promptProfileFailureReason) maybeMarkAuthProfileFailure({
								profileId: failedPromptProfileId,
								reason: promptProfileFailureReason,
								modelId
							}).catch((err) => {
								log$1.warn(`prompt profile failure mark failed: ${String(err)}`);
							});
							traceAttempts.push({
								provider,
								model: modelId,
								result: promptFailoverReason === "timeout" ? "timeout" : "rotate_profile",
								...promptFailoverReason ? { reason: promptFailoverReason } : {},
								stage: "prompt"
							});
							lastRetryFailoverReason = mergeRetryFailoverReason({
								previous: lastRetryFailoverReason,
								failoverReason: promptFailoverReason
							});
							logPromptFailoverDecision("rotate_profile");
							await maybeBackoffBeforeOverloadFailover(promptFailoverReason);
							continue;
						}
						if (promptFailoverDecision.action === "rotate_profile") promptFailoverDecision = resolveRunFailoverDecision({
							stage: "prompt",
							aborted,
							externalAbort,
							fallbackConfigured,
							failoverFailure: promptFailoverFailure,
							failoverReason: promptFailoverReason,
							harnessOwnsTransport: pluginHarnessOwnsTransport,
							profileRotated: true
						});
						if (failedPromptProfileId && promptProfileFailureReason) try {
							await maybeMarkAuthProfileFailure({
								profileId: failedPromptProfileId,
								reason: promptProfileFailureReason,
								modelId
							});
						} catch (err) {
							log$1.warn(`prompt profile failure mark failed: ${String(err)}`);
						}
						const fallbackThinking = pickFallbackThinkingLevel({
							message: errorText,
							attempted: attemptedThinking
						});
						if (fallbackThinking) {
							log$1.warn(`unsupported thinking level for ${provider}/${modelId}; retrying with ${fallbackThinking}`);
							thinkLevel = fallbackThinking;
							continue;
						}
						if (promptFailoverDecision.action === "fallback_model") {
							const fallbackReason = promptFailoverDecision.reason ?? "unknown";
							const status = resolveFailoverStatus(fallbackReason);
							traceAttempts.push({
								provider,
								model: modelId,
								result: promptFailoverReason === "timeout" ? "timeout" : "fallback_model",
								reason: fallbackReason,
								stage: "prompt",
								...typeof status === "number" ? { status } : {}
							});
							logPromptFailoverDecision("fallback_model", { status });
							await maybeBackoffBeforeOverloadFailover(promptFailoverReason);
							throw normalizedPromptFailover ?? new FailoverError(errorText, {
								reason: fallbackReason,
								provider,
								model: modelId,
								profileId: lastProfileId,
								authMode: promptAuthMode,
								sessionId: sessionIdUsed,
								lane: globalLane,
								status
							});
						}
						if (promptFailoverDecision.action === "surface_error") {
							traceAttempts.push({
								provider,
								model: modelId,
								result: promptFailoverReason === "timeout" ? "timeout" : "surface_error",
								...promptFailoverReason ? { reason: promptFailoverReason } : {},
								stage: "prompt"
							});
							logPromptFailoverDecision("surface_error");
						}
						throw toErrorObject(promptError, "Prompt failed");
					}
					const assistantForFailover = currentAttemptAssistant ?? sessionAssistantForCandidate;
					const fallbackThinking = pickFallbackThinkingLevel({
						message: assistantForFailover?.errorMessage,
						attempted: attemptedThinking
					});
					if (fallbackThinking && !aborted) {
						log$1.warn(`unsupported thinking level for ${provider}/${modelId}; retrying with ${fallbackThinking}`);
						thinkLevel = fallbackThinking;
						continue;
					}
					const authFailure = isAuthAssistantError(assistantForFailover);
					const rateLimitFailure = isRateLimitAssistantError(assistantForFailover);
					const billingFailure = isBillingAssistantError(assistantForFailover);
					const failoverFailure = isFailoverAssistantError(assistantForFailover);
					const assistantFailoverReason = classifyAssistantFailoverReason(assistantForFailover);
					const assistantProviderStarted = Boolean(currentAttemptAssistant?.provider) || idleTimedOut || timedOut && !timedOutDuringCompaction && !timedOutDuringToolExecution;
					const assistantProfileFailoverReason = assistantFailoverReason ?? (assistantProviderStarted && (timedOut || idleTimedOut) ? "timeout" : null);
					const assistantProfileFailureReason = resolveRunAuthProfileFailureReason(assistantProfileFailoverReason, {
						providerStarted: assistantProviderStarted,
						transientRateLimit: assistantProfileFailoverReason === "rate_limit" && isShortWindowRateLimitMessage(assistantForFailover?.errorMessage)
					});
					const cloudCodeAssistFormatError = attempt.cloudCodeAssistFormatError;
					const imageDimensionError = parseImageDimensionError(assistantForFailover?.errorMessage ?? "");
					const genericUnknownReasoningError = assistantFailoverReason === "timeout" && isGenericUnknownStreamErrorMessage(assistantForFailover?.errorMessage ?? "") && Boolean(assistantForFailover && hasOnlyAssistantReasoningContent(assistantForFailover));
					if (!authFailure && !rateLimitFailure && !billingFailure && !cloudCodeAssistFormatError && !imageDimensionError && !aborted && !promptError && !timedOut && (assistantFailoverReason === null || genericUnknownReasoningError || assistantFailoverReason === "no_error_details" || assistantFailoverReason === "unclassified" || assistantFailoverReason === "unknown") && shouldRetrySilentErrorAssistantTurn({
						attempt,
						assistant: assistantForFailover
					}) && emptyErrorRetries < MAX_EMPTY_ERROR_RETRIES) {
						emptyErrorRetries += 1;
						log$1.warn(`[empty-error-retry] stopReason=error non-visible-output; resubmitting attempt=${emptyErrorRetries}/${MAX_EMPTY_ERROR_RETRIES} provider=${assistantForFailover?.provider ?? provider} model=${assistantForFailover?.model ?? model.id} sessionKey=${params.sessionKey ?? params.sessionId}`);
						continue;
					}
					const failedAssistantProfileId = lastProfileId;
					const logAssistantFailoverDecision = createFailoverDecisionLogger({
						stage: "assistant",
						runId: params.runId,
						rawError: assistantForFailover?.errorMessage?.trim(),
						failoverReason: assistantFailoverReason,
						profileFailureReason: assistantProfileFailureReason,
						provider: activeErrorContext.provider,
						model: activeErrorContext.model,
						sourceProvider: assistantForFailover?.provider ?? provider,
						sourceModel: assistantForFailover?.model ?? modelId,
						profileId: failedAssistantProfileId,
						fallbackConfigured,
						timedOut,
						aborted
					});
					if (authFailure && await maybeRefreshRuntimeAuthForAuthError(assistantForFailover?.errorMessage ?? "", runtimeAuthRetry)) {
						authRetryPending = true;
						continue;
					}
					if (imageDimensionError && lastProfileId) {
						const details = [
							imageDimensionError.messageIndex !== void 0 ? `message=${imageDimensionError.messageIndex}` : null,
							imageDimensionError.contentIndex !== void 0 ? `content=${imageDimensionError.contentIndex}` : null,
							imageDimensionError.maxDimensionPx !== void 0 ? `limit=${imageDimensionError.maxDimensionPx}px` : null
						].filter(Boolean).join(" ");
						log$1.warn(`Profile ${lastProfileId} rejected image payload${details ? ` (${details})` : ""}.`);
					}
					const assistantFailoverDecision = resolveRunFailoverDecision({
						stage: "assistant",
						allowFormatRetry: cloudCodeAssistFormatError,
						aborted,
						externalAbort,
						fallbackConfigured,
						failoverFailure,
						failoverReason: assistantFailoverReason,
						timedOut,
						idleTimedOut,
						timedOutDuringCompaction,
						timedOutDuringToolExecution,
						harnessOwnsTransport: pluginHarnessOwnsTransport,
						profileRotated: false
					});
					const assistantFailoverOutcome = await handleAssistantFailover({
						initialDecision: assistantFailoverDecision,
						aborted,
						externalAbort,
						fallbackConfigured,
						failoverFailure,
						failoverReason: assistantFailoverReason,
						timedOut,
						idleTimedOut,
						timedOutDuringCompaction,
						timedOutDuringToolExecution,
						allowSameModelIdleTimeoutRetry: timedOut && idleTimedOut && !timedOutDuringCompaction && !fallbackConfigured && canRestartForLiveSwitch && sameModelIdleTimeoutRetries < MAX_SAME_MODEL_IDLE_TIMEOUT_RETRIES,
						allowSameModelRateLimitRetry: rateLimitProfileRotations < rateLimitProfileRotationLimit,
						assistantProfileFailureReason,
						lastProfileId,
						modelId,
						provider,
						activeErrorContext,
						lastAssistant: assistantForFailover,
						config: params.config,
						sessionKey: params.sessionKey ?? params.sessionId,
						authFailure,
						rateLimitFailure,
						billingFailure,
						authMode: lastProfileId ? attemptAuthProfileStore.profiles?.[lastProfileId]?.type : void 0,
						cloudCodeAssistFormatError,
						isProbeSession,
						overloadProfileRotations,
						overloadProfileRotationLimit,
						previousRetryFailoverReason: lastRetryFailoverReason,
						logAssistantFailoverDecision,
						warn: (message) => log$1.warn(message),
						maybeMarkAuthProfileFailure,
						maybeEscalateRateLimitProfileFallback,
						maybeRetrySameModelRateLimit,
						maybeBackoffBeforeOverloadFailover,
						advanceAuthProfile: advanceAttemptAuthProfile
					});
					overloadProfileRotations = assistantFailoverOutcome.overloadProfileRotations;
					if (assistantFailoverOutcome.action === "retry") {
						const retryTraceResult = assistantFailoverOutcome.retryKind === "same_model_rate_limit" ? "same_model_rate_limit" : assistantFailoverOutcome.retryKind === "same_model_idle_timeout" || assistantFailoverReason === "timeout" ? "timeout" : "rotate_profile";
						traceAttempts.push({
							provider: activeErrorContext.provider,
							model: activeErrorContext.model,
							result: retryTraceResult,
							...assistantFailoverReason ? { reason: assistantFailoverReason } : {},
							stage: "assistant"
						});
						if (assistantFailoverOutcome.retryKind === "same_model_idle_timeout") sameModelIdleTimeoutRetries += 1;
						if (assistantFailoverOutcome.retryKind !== "same_model_rate_limit") consecutiveSameModelRateLimitRetries = resolveNextSameModelRateLimitRetryCount({
							retriesSoFar: consecutiveSameModelRateLimitRetries,
							retriedSameModelRateLimit: false
						});
						lastRetryFailoverReason = assistantFailoverOutcome.lastRetryFailoverReason;
						continue;
					}
					consecutiveSameModelRateLimitRetries = resolveNextSameModelRateLimitRetryCount({
						retriesSoFar: consecutiveSameModelRateLimitRetries,
						retriedSameModelRateLimit: false
					});
					if (assistantFailoverOutcome.action === "throw") {
						traceAttempts.push({
							provider: activeErrorContext.provider,
							model: activeErrorContext.model,
							result: assistantFailoverReason === "timeout" ? "timeout" : assistantFailoverDecision.action === "fallback_model" ? "fallback_model" : "error",
							...assistantFailoverReason ? { reason: assistantFailoverReason } : {},
							stage: "assistant",
							...typeof assistantFailoverOutcome.error.status === "number" ? { status: assistantFailoverOutcome.error.status } : {}
						});
						if (assistantFailoverOutcome.error.suspend) suspendForFailure({
							cfg: params.config,
							agentDir,
							sessionId: activeSessionId ?? params.sessionId,
							reason: resolveSessionSuspensionReason(assistantFailoverOutcome.error.reason),
							failedProvider: assistantFailoverOutcome.error.provider ?? provider,
							failedModel: assistantFailoverOutcome.error.model ?? modelId
						});
						throw assistantFailoverOutcome.error;
					}
					const usageMeta = buildUsageAgentMetaFields({
						usageAccumulator,
						lastAssistantUsage: sessionLastAssistant?.usage,
						lastRunPromptUsage,
						lastTurnTotal
					});
					const reportedModelRef = resolveReportedModelRef({
						provider,
						model: model.id,
						assistant: sessionLastAssistant
					});
					const agentMeta = {
						sessionId: sessionIdUsed,
						sessionFile: sessionFileUsed,
						provider: reportedModelRef.provider,
						model: reportedModelRef.model,
						contextTokens: ctxInfo.tokens,
						agentHarnessId: attempt.agentHarnessId,
						usage: usageMeta.usage,
						lastCallUsage: usageMeta.lastCallUsage,
						promptTokens: usageMeta.promptTokens,
						...lastContextBudgetStatus ? { contextBudgetStatus: lastContextBudgetStatus } : {},
						compactionCount: autoCompactionCount > 0 ? autoCompactionCount : void 0,
						compactionTokensAfter: lastCompactionTokensAfter
					};
					const finalAssistantVisibleText = resolveFinalAssistantVisibleText(sessionLastAssistant);
					const finalAssistantRawText = resolveFinalAssistantRawText(sessionLastAssistant);
					const payloads = buildEmbeddedRunPayloads({
						assistantTexts: attempt.assistantTexts,
						assistantMessageIndex: attempt.lastAssistantTextMessageIndex,
						toolMetas: attempt.toolMetas,
						lastAssistant: attempt.lastAssistant,
						currentAssistant: currentAttemptAssistant ?? null,
						lastToolError: attempt.lastToolError,
						config: params.config,
						isCronTrigger: params.trigger === "cron",
						isHeartbeatTrigger: params.trigger === "heartbeat",
						sessionKey: params.sessionKey ?? params.sessionId,
						provider: activeErrorContext.provider,
						model: activeErrorContext.model,
						authMode: lastProfileId ? attemptAuthProfileStore.profiles?.[lastProfileId]?.type : void 0,
						verboseLevel: params.verboseLevel,
						reasoningLevel: params.reasoningLevel,
						thinkingLevel: params.thinkLevel,
						toolResultFormat: resolvedToolResultFormat,
						suppressToolErrorWarnings: params.suppressToolErrorWarnings,
						inlineToolResultsAllowed: false,
						didSendViaMessagingTool: attempt.didSendViaMessagingTool,
						didDeliverSourceReplyViaMessageTool: attempt.didDeliverSourceReplyViaMessageTool === true,
						messagingToolSourceReplyPayloads: attempt.messagingToolSourceReplyPayloads,
						sourceReplyDeliveryMode: params.sourceReplyDeliveryMode,
						agentId: params.agentId,
						runId: params.runId,
						runAborted: aborted,
						didSendDeterministicApprovalPrompt: attempt.didSendDeterministicApprovalPrompt,
						heartbeatToolResponse: attempt.heartbeatToolResponse
					});
					const payloadsWithToolMedia = mergeAttemptToolMediaPayloads({
						payloads,
						toolMediaUrls: attempt.toolMediaUrls,
						toolAudioAsVoice: attempt.toolAudioAsVoice,
						toolTrustedLocalMedia: attempt.toolTrustedLocalMedia,
						sourceReplyDeliveryMode: params.sourceReplyDeliveryMode
					});
					const timedOutDuringPrompt = timedOut && !timedOutDuringCompaction && !timedOutDuringToolExecution;
					const finalAssistantStopReason = (sessionLastAssistant?.stopReason ?? "").trim().toLowerCase();
					const recoveredFinalAssistantTextAfterPromptTimeout = timedOutDuringPrompt && [
						"completed",
						"end_turn",
						"stop"
					].includes(finalAssistantStopReason) ? (finalAssistantVisibleText ?? finalAssistantRawText)?.trim() : void 0;
					const payloadAlreadyContainsRecoveredFinalAssistant = recoveredFinalAssistantTextAfterPromptTimeout ? (payloadsWithToolMedia ?? []).some((payload) => payload?.isError !== true && payload?.isReasoning !== true && typeof payload.text === "string" && payload.text.trim() === recoveredFinalAssistantTextAfterPromptTimeout) : false;
					const recoveredFinalAssistantPayloadsAfterPromptTimeout = recoveredFinalAssistantTextAfterPromptTimeout && !payloadAlreadyContainsRecoveredFinalAssistant ? [{ text: recoveredFinalAssistantTextAfterPromptTimeout }] : void 0;
					const hasSuccessfulFinalAssistantAfterPromptTimeout = timedOutDuringPrompt && Boolean(payloadAlreadyContainsRecoveredFinalAssistant || recoveredFinalAssistantPayloadsAfterPromptTimeout?.length);
					const hasPartialAssistantTextAfterPromptTimeout = timedOutDuringPrompt && (attempt.assistantTexts ?? []).some((text) => text.trim().length > 0) && !attempt.clientToolCalls && !attempt.yieldDetected && !attempt.didSendViaMessagingTool && !attempt.didSendDeterministicApprovalPrompt && !attempt.lastToolError && (attempt.toolMetas?.length ?? 0) === 0;
					const attemptToolSummary = buildTraceToolSummary({
						toolMetas: attempt.toolMetas,
						hadFailure: Boolean(attempt.lastToolError)
					});
					const failureSignal = resolveEmbeddedRunFailureSignal({
						trigger: params.trigger,
						lastToolError: attempt.lastToolError
					});
					if (timedOutDuringPrompt && !hasSuccessfulFinalAssistantAfterPromptTimeout && (shouldSurfaceCodexCompletionTimeout || !hasMessagingToolDeliveryEvidence(attempt))) {
						const defaultTimeoutText = idleTimedOut ? "The model did not produce a response before the model idle timeout. Please try again, or increase `models.providers.<id>.timeoutSeconds` for slow local or self-hosted providers. If `agents.defaults.timeoutSeconds` or a run-specific timeout is lower, raise that ceiling too; provider timeouts cannot extend the whole agent run." : "Request timed out before a response was generated. Please try again, or increase `agents.defaults.timeoutSeconds` in your config.";
						const timeoutText = attempt.promptTimeoutOutcome?.message?.trim() || defaultTimeoutText;
						const replayInvalid = attempt.promptTimeoutOutcome?.replayInvalid ?? resolveReplayInvalidForAttempt(null);
						const livenessState = attempt.promptTimeoutOutcome?.livenessState ?? resolveRunLivenessState({
							payloadCount: hasPartialAssistantTextAfterPromptTimeout ? 0 : payloads.length,
							aborted,
							timedOut,
							attempt,
							incompleteTurnText: null
						});
						const timeoutPhase = attempt.promptTimeoutOutcome?.timeoutPhase ?? "provider";
						const providerStarted = attempt.promptTimeoutOutcome?.providerStarted ?? true;
						setTerminalLifecycleMeta({
							replayInvalid,
							livenessState,
							timeoutPhase,
							providerStarted
						});
						return {
							payloads: [...hasPartialAssistantTextAfterPromptTimeout ? [] : payloadsWithToolMedia || [], {
								text: timeoutText,
								isError: true
							}],
							meta: {
								durationMs: Date.now() - started,
								agentMeta,
								aborted,
								systemPromptReport: attempt.systemPromptReport,
								finalPromptText: attempt.finalPromptText,
								finalAssistantVisibleText,
								finalAssistantRawText,
								replayInvalid,
								livenessState,
								timeoutPhase,
								providerStarted,
								...shouldSurfaceCodexCompletionTimeout ? { error: {
									kind: "incomplete_turn",
									message: timeoutText,
									fallbackSafe: false
								} } : {},
								toolSummary: attemptToolSummary,
								...failureSignal ? { failureSignal } : {},
								agentHarnessResultClassification: attempt.agentHarnessResultClassification
							},
							didSendViaMessagingTool: attempt.didSendViaMessagingTool,
							didDeliverSourceReplyViaMessageTool: attempt.didDeliverSourceReplyViaMessageTool === true,
							didSendDeterministicApprovalPrompt: attempt.didSendDeterministicApprovalPrompt,
							messagingToolSentTexts: attempt.messagingToolSentTexts,
							messagingToolSentMediaUrls: attempt.messagingToolSentMediaUrls,
							messagingToolSentTargets: attempt.messagingToolSentTargets,
							messagingToolSourceReplyPayloads: attempt.messagingToolSourceReplyPayloads,
							heartbeatToolResponse: attempt.heartbeatToolResponse,
							successfulCronAdds: attempt.successfulCronAdds,
							acceptedSessionSpawns: attempt.acceptedSessionSpawns
						};
					}
					const silentToolResultReplyPayload = resolveSilentToolResultReplyPayload({
						isCronTrigger: params.trigger === "cron",
						payloadCount: payloadsWithToolMedia?.length ?? 0,
						aborted,
						timedOut,
						attempt
					});
					const payloadsForTerminalPath = recoveredFinalAssistantPayloadsAfterPromptTimeout ? recoveredFinalAssistantPayloadsAfterPromptTimeout : payloadsWithToolMedia?.length ? payloadsWithToolMedia : silentToolResultReplyPayload ? [silentToolResultReplyPayload] : payloadsWithToolMedia;
					const payloadCount = payloadsForTerminalPath?.length ?? 0;
					const emptyAssistantReplyIsSilent = shouldTreatEmptyAssistantReplyAsSilent({
						allowEmptyAssistantReplyAsSilent: params.allowEmptyAssistantReplyAsSilent,
						payloadCount,
						aborted,
						timedOut,
						attempt
					});
					const nextReasoningOnlyRetryInstruction = emptyAssistantReplyIsSilent ? null : resolveReasoningOnlyRetryInstruction({
						provider: activeErrorContext.provider,
						modelId: activeErrorContext.model,
						modelApi: effectiveModel.api,
						executionContract,
						aborted,
						timedOut,
						attempt
					});
					const nextEmptyResponseRetryInstruction = emptyAssistantReplyIsSilent ? null : resolveEmptyResponseRetryInstruction({
						provider: activeErrorContext.provider,
						modelId: activeErrorContext.model,
						modelApi: effectiveModel.api,
						executionContract,
						payloadCount,
						aborted,
						timedOut,
						attempt
					});
					if (nextReasoningOnlyRetryInstruction && reasoningOnlyRetryAttempts < maxReasoningOnlyRetryAttempts) {
						reasoningOnlyRetryAttempts += 1;
						reasoningOnlyRetryInstruction = nextReasoningOnlyRetryInstruction;
						log$1.warn(`reasoning-only assistant turn detected: runId=${params.runId} sessionId=${params.sessionId} provider=${activeErrorContext.provider}/${activeErrorContext.model} — retrying ${reasoningOnlyRetryAttempts}/${maxReasoningOnlyRetryAttempts} with visible-answer continuation`);
						continue;
					}
					const reasoningOnlyRetriesExhausted = nextReasoningOnlyRetryInstruction && reasoningOnlyRetryAttempts >= maxReasoningOnlyRetryAttempts;
					if (!emptyAssistantReplyIsSilent && shouldRetryMissingAssistantTurn({
						payloadCount,
						aborted,
						promptError,
						timedOut,
						attempt
					}) && missingAssistantRetryAttempts < MAX_MISSING_ASSISTANT_RETRIES) {
						missingAssistantRetryAttempts += 1;
						log$1.warn(`missing assistant terminal message detected: runId=${params.runId} sessionId=${params.sessionId} provider=${activeErrorContext.provider}/${activeErrorContext.model} — retrying ${missingAssistantRetryAttempts}/${MAX_MISSING_ASSISTANT_RETRIES} with same prompt`);
						continue;
					}
					if (!nextReasoningOnlyRetryInstruction && nextEmptyResponseRetryInstruction && emptyResponseRetryAttempts < maxEmptyResponseRetryAttempts) {
						emptyResponseRetryAttempts += 1;
						emptyResponseRetryInstruction = nextEmptyResponseRetryInstruction;
						log$1.warn(`empty response detected: runId=${params.runId} sessionId=${params.sessionId} provider=${activeErrorContext.provider}/${activeErrorContext.model} — retrying ${emptyResponseRetryAttempts}/${maxEmptyResponseRetryAttempts} with visible-answer continuation`);
						continue;
					}
					const incompleteTurnText = emptyAssistantReplyIsSilent ? null : resolveIncompleteTurnPayloadText({
						payloadCount,
						aborted,
						externalAbort,
						timedOut,
						attempt
					});
					const incompleteTurnFallbackSafe = Boolean(incompleteTurnText && !aborted && !timedOut && !promptError && !attempt.lastToolError && !hasAttemptTerminalState(attempt) && !accumulatedReplayState.hadPotentialSideEffects);
					const terminalToolPresentation = incompleteTurnFallbackSafe ? readAttemptTerminalToolPresentation() : void 0;
					if (!emptyAssistantReplyIsSilent && attemptCompactionCount > 0 && payloadCount === 0 && !aborted && !promptError && !timedOut && !attempt.clientToolCalls && !attempt.yieldDetected && !attempt.didSendDeterministicApprovalPrompt && !attempt.lastToolError && !accumulatedReplayState.hadPotentialSideEffects && compactionContinuationRetryAttempts < 1) {
						compactionContinuationRetryAttempts += 1;
						compactionContinuationRetryInstruction = COMPACTION_CONTINUATION_RETRY_INSTRUCTION;
						log$1.warn(`compaction interrupted visible final answer: runId=${params.runId} sessionId=${params.sessionId} compactions=${attemptCompactionCount} — retrying ${compactionContinuationRetryAttempts}/1 with compacted-transcript continuation`);
						postCompactionGuard.armPostCompaction();
						continue;
					}
					compactionContinuationRetryInstruction = null;
					if (reasoningOnlyRetriesExhausted && !finalAssistantVisibleText) log$1.warn(`reasoning-only retries exhausted: runId=${params.runId} sessionId=${params.sessionId} provider=${activeErrorContext.provider}/${activeErrorContext.model} attempts=${reasoningOnlyRetryAttempts}/${maxReasoningOnlyRetryAttempts} — surfacing incomplete-turn error`);
					if (reasoningOnlyRetriesExhausted && !finalAssistantVisibleText) {
						const incompletePayloadText = terminalToolPresentation ? terminalToolPresentation.concat("\n\n", "⚠️ Agent couldn't generate a response. Please try again.") : "⚠️ Agent couldn't generate a response. Please try again.";
						const replayInvalid = resolveReplayInvalidForAttempt(incompletePayloadText);
						const livenessState = resolveRunLivenessState({
							payloadCount: 0,
							aborted,
							timedOut,
							attempt,
							incompleteTurnText: incompletePayloadText
						});
						setTerminalLifecycleMeta({
							replayInvalid,
							livenessState
						});
						if (lastProfileId) await maybeMarkAuthProfileFailure({
							profileId: lastProfileId,
							reason: assistantProfileFailureReason,
							modelId
						});
						return {
							payloads: [{
								text: incompletePayloadText,
								isError: true
							}],
							meta: {
								durationMs: Date.now() - started,
								agentMeta,
								aborted,
								systemPromptReport: attempt.systemPromptReport,
								finalPromptText: attempt.finalPromptText,
								finalAssistantVisibleText,
								finalAssistantRawText,
								replayInvalid,
								livenessState,
								error: {
									kind: "incomplete_turn",
									message: "Agent couldn't generate a response.",
									fallbackSafe: incompleteTurnFallbackSafe,
									terminalPresentation: terminalToolPresentation !== void 0
								},
								toolSummary: attemptToolSummary,
								...failureSignal ? { failureSignal } : {},
								agentHarnessResultClassification: attempt.agentHarnessResultClassification
							},
							didSendViaMessagingTool: attempt.didSendViaMessagingTool,
							didDeliverSourceReplyViaMessageTool: attempt.didDeliverSourceReplyViaMessageTool === true,
							didSendDeterministicApprovalPrompt: attempt.didSendDeterministicApprovalPrompt,
							messagingToolSentTexts: attempt.messagingToolSentTexts,
							messagingToolSentMediaUrls: attempt.messagingToolSentMediaUrls,
							messagingToolSentTargets: attempt.messagingToolSentTargets,
							messagingToolSourceReplyPayloads: attempt.messagingToolSourceReplyPayloads,
							heartbeatToolResponse: attempt.heartbeatToolResponse,
							successfulCronAdds: attempt.successfulCronAdds,
							acceptedSessionSpawns: attempt.acceptedSessionSpawns
						};
					}
					if (!nextReasoningOnlyRetryInstruction && nextEmptyResponseRetryInstruction && emptyResponseRetryAttempts >= maxEmptyResponseRetryAttempts) log$1.warn(`empty response retries exhausted: runId=${params.runId} sessionId=${params.sessionId} provider=${activeErrorContext.provider}/${activeErrorContext.model} attempts=${emptyResponseRetryAttempts}/${maxEmptyResponseRetryAttempts} — surfacing incomplete-turn error`);
					if (incompleteTurnText) {
						const replayInvalid = resolveReplayInvalidForAttempt(incompleteTurnText);
						const livenessState = resolveRunLivenessState({
							payloadCount,
							aborted,
							timedOut,
							attempt,
							incompleteTurnText
						});
						setTerminalLifecycleMeta({
							replayInvalid,
							livenessState
						});
						const incompleteStopReason = attempt.lastAssistant?.stopReason;
						const replayMetadata = resolveAttemptReplayMetadata(attempt);
						log$1.warn(`incomplete turn detected: runId=${params.runId} sessionId=${params.sessionId} provider=${activeErrorContext.provider}/${activeErrorContext.model} stopReason=${incompleteStopReason ?? "missing"} hasLastAssistant=${attempt.lastAssistant ? "yes" : "no"} hasCurrentAttemptAssistant=${attempt.currentAttemptAssistant ? "yes" : "no"} payloads=${payloadCount} tools=${attempt.toolMetas?.length ?? 0} replaySafe=${replayMetadata.replaySafe ? "yes" : "no"} compactions=${attemptCompactionCount} reasoningRetries=${reasoningOnlyRetryAttempts}/${maxReasoningOnlyRetryAttempts} emptyRetries=${emptyResponseRetryAttempts}/${maxEmptyResponseRetryAttempts} missingAssistantRetries=${missingAssistantRetryAttempts}/${MAX_MISSING_ASSISTANT_RETRIES} — ` + (terminalToolPresentation ? "surfacing tool-authored terminal presentation" : "surfacing error to user"));
						if (lastProfileId) await maybeMarkAuthProfileFailure({
							profileId: lastProfileId,
							reason: assistantProfileFailureReason,
							modelId
						});
						return {
							payloads: [{
								text: terminalToolPresentation ? terminalToolPresentation.concat("\n\n", incompleteTurnText) : incompleteTurnText,
								isError: true
							}],
							meta: {
								durationMs: Date.now() - started,
								agentMeta,
								aborted,
								systemPromptReport: attempt.systemPromptReport,
								finalPromptText: attempt.finalPromptText,
								finalAssistantVisibleText,
								finalAssistantRawText,
								replayInvalid,
								livenessState,
								error: {
									kind: "incomplete_turn",
									message: "Agent couldn't generate a response.",
									fallbackSafe: incompleteTurnFallbackSafe,
									terminalPresentation: terminalToolPresentation !== void 0
								},
								toolSummary: attemptToolSummary,
								...failureSignal ? { failureSignal } : {},
								agentHarnessResultClassification: attempt.agentHarnessResultClassification
							},
							didSendViaMessagingTool: attempt.didSendViaMessagingTool,
							didDeliverSourceReplyViaMessageTool: attempt.didDeliverSourceReplyViaMessageTool === true,
							didSendDeterministicApprovalPrompt: attempt.didSendDeterministicApprovalPrompt,
							messagingToolSentTexts: attempt.messagingToolSentTexts,
							messagingToolSentMediaUrls: attempt.messagingToolSentMediaUrls,
							messagingToolSentTargets: attempt.messagingToolSentTargets,
							messagingToolSourceReplyPayloads: attempt.messagingToolSourceReplyPayloads,
							heartbeatToolResponse: attempt.heartbeatToolResponse,
							successfulCronAdds: attempt.successfulCronAdds,
							acceptedSessionSpawns: attempt.acceptedSessionSpawns
						};
					}
					const beforeAgentFinalizeRevisionReason = attempt.beforeAgentFinalizeRevisionReason;
					const shouldHonorBeforeAgentFinalizeRevision = !aborted && !promptError && !timedOut && !attempt.clientToolCalls && !attempt.yieldDetected && !emptyAssistantReplyIsSilent;
					if (beforeAgentFinalizeRevisionReason && shouldHonorBeforeAgentFinalizeRevision) {
						beforeAgentFinalizeRevisionAttempts += 1;
						nextAttemptPromptOverride = buildBeforeAgentFinalizeRetryPrompt(beforeAgentFinalizeRevisionReason);
						suppressNextUserMessagePersistence = true;
						reasoningOnlyRetryInstruction = null;
						emptyResponseRetryInstruction = null;
						compactionContinuationRetryInstruction = null;
						log$1.warn(`before_agent_finalize requested one more pass: runId=${params.runId} sessionId=${params.sessionId} attempt=${beforeAgentFinalizeRevisionAttempts}/${MAX_BEFORE_AGENT_FINALIZE_REVISIONS}`);
						continue;
					}
					log$1.debug(`embedded run done: runId=${params.runId} sessionId=${params.sessionId} durationMs=${Date.now() - started} aborted=${aborted}`);
					if (lastProfileId) await markAuthProfileSuccess({
						store: profileFailureStore,
						provider: resolveAuthProfileStateProvider(profileFailureStore, lastProfileId, provider),
						profileId: lastProfileId,
						agentDir: params.agentDir
					});
					const replayInvalid = resolveReplayInvalidForAttempt(null);
					const livenessState = attempt.yieldDetected ? "paused" : resolveRunLivenessState({
						payloadCount,
						aborted,
						timedOut,
						attempt,
						incompleteTurnText: null
					});
					const stopReason = attempt.clientToolCalls ? "tool_calls" : attempt.yieldDetected ? "end_turn" : sessionLastAssistant?.stopReason;
					const terminalPayloads = emptyAssistantReplyIsSilent ? [{ text: SILENT_REPLY_TOKEN }] : payloadsForTerminalPath;
					setTerminalLifecycleMeta({
						replayInvalid,
						livenessState,
						stopReason,
						yielded: attempt.yieldDetected === true
					});
					return {
						payloads: terminalPayloads?.length ? terminalPayloads : void 0,
						...attempt.diagnosticTrace ? { diagnosticTrace: freezeDiagnosticTraceContext(attempt.diagnosticTrace) } : {},
						meta: {
							durationMs: Date.now() - started,
							agentMeta,
							aborted,
							systemPromptReport: attempt.systemPromptReport,
							finalPromptText: attempt.finalPromptText,
							finalAssistantVisibleText,
							finalAssistantRawText,
							replayInvalid,
							livenessState,
							agentHarnessResultClassification: attempt.agentHarnessResultClassification,
							...attempt.yieldDetected ? { yielded: true } : {},
							...emptyAssistantReplyIsSilent ? { terminalReplyKind: "silent-empty" } : {},
							stopReason,
							pendingToolCalls: attempt.clientToolCalls?.map((call) => ({
								id: randomBytes(5).toString("hex").slice(0, 9),
								name: call.name,
								arguments: JSON.stringify(call.params)
							})),
							executionTrace: {
								winnerProvider: reportedModelRef.provider,
								winnerModel: reportedModelRef.model,
								attempts: traceAttempts.length > 0 || sessionLastAssistant?.provider || sessionLastAssistant?.model ? [...traceAttempts, {
									provider: reportedModelRef.provider,
									model: reportedModelRef.model,
									result: "success",
									stage: "assistant"
								}] : void 0,
								fallbackUsed: traceAttempts.some(traceAttemptUsesFallback),
								runner: "embedded"
							},
							requestShaping: {
								...lastProfileId ? { authMode: "auth-profile" } : {},
								...thinkLevel ? { thinking: thinkLevel } : {},
								...params.reasoningLevel ? { reasoning: params.reasoningLevel } : {},
								...params.verboseLevel ? { verbose: params.verboseLevel } : {},
								...params.blockReplyBreak ? { blockStreaming: params.blockReplyBreak } : {}
							},
							toolSummary: attemptToolSummary,
							...failureSignal ? { failureSignal } : {},
							completion: {
								...stopReason ? { stopReason } : {},
								...stopReason ? { finishReason: stopReason } : {},
								...stopReason?.toLowerCase().includes("refusal") ? { refusal: true } : {}
							},
							contextManagement: autoCompactionCount > 0 ? { lastTurnCompactions: autoCompactionCount } : void 0
						},
						didSendViaMessagingTool: attempt.didSendViaMessagingTool,
						didDeliverSourceReplyViaMessageTool: attempt.didDeliverSourceReplyViaMessageTool === true,
						didSendDeterministicApprovalPrompt: attempt.didSendDeterministicApprovalPrompt,
						messagingToolSentTexts: attempt.messagingToolSentTexts,
						messagingToolSentMediaUrls: attempt.messagingToolSentMediaUrls,
						messagingToolSentTargets: attempt.messagingToolSentTargets,
						messagingToolSourceReplyPayloads: attempt.messagingToolSourceReplyPayloads,
						heartbeatToolResponse: attempt.heartbeatToolResponse,
						successfulCronAdds: attempt.successfulCronAdds,
						acceptedSessionSpawns: attempt.acceptedSessionSpawns
					};
				}
			} finally {
				if (params.isFinalFallbackAttempt !== false) await maybeEmitFastModeAutoResetBestEffort();
				forgetPromptBuildDrainCacheForRun(params.runId);
				stopRuntimeAuthRefreshTimer();
				await runAgentCleanupStep({
					runId: params.runId,
					sessionId: params.sessionId,
					step: "context-engine-dispose",
					log: log$1,
					cleanup: async () => {
						await contextEngine.dispose?.();
					}
				});
				if (params.cleanupBundleMcpOnRunEnd === true) await runAgentCleanupStep({
					runId: params.runId,
					sessionId: params.sessionId,
					step: "bundle-mcp-retire",
					log: log$1,
					cleanup: async () => {
						const onError = (errorLocal, sessionId) => {
							log$1.warn(`bundle-mcp cleanup failed after run for ${sessionId}: ${formatErrorMessage(errorLocal)}`);
						};
						if (!await retireSessionMcpRuntimeForSessionKey({
							sessionKey: params.sessionKey,
							reason: "embedded-run-end",
							onError
						})) await retireSessionMcpRuntime({
							sessionId: params.sessionId,
							reason: "embedded-run-end",
							onError
						});
					}
				});
			}
		});
	});
}
function resolveAuthProfileStateProvider(store, profileId, fallbackProvider) {
	const profileProvider = store.profiles?.[profileId]?.provider?.trim();
	if (profileProvider) return profileProvider;
	return profileId.split(":", 1)[0]?.trim() || fallbackProvider;
}
//#endregion
export { compactEmbeddedAgentSession as n, formatAuthProfileFailureMessage as r, runEmbeddedAgent as t };
