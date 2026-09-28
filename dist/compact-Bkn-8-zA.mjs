import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { i as resolveGlobalSingleton } from "./global-singleton-Dc_stLtU.mjs";
import { n as captureAsyncWorkTracker, r as getAsyncWorkSignal, t as AsyncWorkScope } from "./async-work-scope-CWk2dk1h.mjs";
import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { o as resolveUserPath } from "./home-dir-BKwhAL2c.mjs";
import "./utils-aKqR_F_U.mjs";
import { n as isAbortError } from "./abort-signal-Z3A36sLL.mjs";
import { a as resolveAgentDir, l as resolveAgentWorkspaceDir } from "./agent-scope-config-IQKOEtZ4.mjs";
import { A as parseAgentSessionKey } from "./session-key-CBvmC8zz.mjs";
import { t as pruneMapToMaxSize } from "./map-size-CNcWiFKu.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { D as freezeDiagnosticTraceContext, O as getActiveDiagnosticTraceContext, w as createDiagnosticTraceContext } from "./diagnostic-events-CVabF32H.mjs";
import { f as withSqliteReadOnlyWorkerScope } from "./sqlite-readonly-worker-CmkAsqCm.mjs";
import { i as getCurrentPluginMetadataSnapshot } from "./current-plugin-metadata-snapshot-BU2mC0-C.mjs";
import { n as withPluginRuntimeGenerationScope, t as runOutsidePluginRuntimeGenerationScope } from "./generation-scope-DkeaMJw8.mjs";
import { d as toolPolicyRestrictsTools } from "./tool-policy-YDdaK0oX.mjs";
import { n as DEFAULT_MODEL, r as DEFAULT_PROVIDER } from "./defaults-BbU4k6fu.mjs";
import { o as resolveAgentModelFallbackValues } from "./model-input-DKxKaZGG.mjs";
import { a as normalizeOptionalAgentRuntimeId, r as isDefaultAgentRuntimeId } from "./agent-runtime-id-9mBje111.mjs";
import { _ as resolveSessionAgentId, g as resolveRunModelFallbacksOverride, y as resolveSessionAgentIds } from "./agent-scope-CTuYDtny.mjs";
import { a as projectModelThinkingCompat } from "./model-catalog-lookup-C3iQmurZ.mjs";
import { i as isOpenAIProvider } from "./openai-routing-BspGC-O6.mjs";
import { i as resolveProviderIdForAuth } from "./provider-auth-aliases-DKt99_dy.mjs";
import { n as parseGitUrl } from "./cloud-worker-project-profiles-DJ5jtY5M.mjs";
import { i as runCommandWithTimeout } from "./exec-shcN2-sN.mjs";
import { i as generateSecureToken } from "./secure-random-BJtJxP9Y.mjs";
import { n as normalizeMessageChannel } from "./message-channel-core-CxyiAx1U.mjs";
import "./message-channel-DDcHHhpX.mjs";
import { n as emitSessionTranscriptUpdate } from "./transcript-events-DukKauix.mjs";
import { t as applyPreparedRuntimeAuthToModel } from "./provider-request-config-DOrVD029.mjs";
import { I as MissingProviderAuthError } from "./loader-runtime-load-DitY2Htf.mjs";
import { t as getGlobalHookRunner } from "./hook-runner-global-tOGjxVvH.mjs";
import { i as captureOwnedTranscriptWriteAssertion } from "./transcript-write-context-MlBhwaKa.mjs";
import { t as resolveAgentHarnessPolicy } from "./policy-DYrfsfP0.mjs";
import { s as listRegisteredPluginAgentPromptGuidance } from "./command-registration-CddDTMHE.mjs";
import { i as ensureAuthProfileStoreWithoutExternalProfiles, n as ensureAuthProfileStore } from "./store-runtime-CzCVI_rv.mjs";
import { o as resolveCodexAgentHarnessNativeCompaction } from "./registry-1lXXOteg.mjs";
import { r as wrapStreamFnTextTransforms } from "./plugin-text-transforms-CuF3jf1R.mjs";
import { i as unwrapSecretSentinelsForProviderEgress } from "./provider-secret-egress-BkXZF4dA.mjs";
import { r as getModelProviderRuntimePluginHandle, t as attachModelProviderRuntimePluginHandle } from "./provider-hook-runtime-Czh46tAs.mjs";
import { _ as prepareProviderRuntimeAuth, j as resolveProviderTextTransforms, z as transformProviderSystemPrompt } from "./provider-runtime-DTb_RnE4.mjs";
import { n as getModelRegistryRuntime } from "./model-registry-BYbYxzIC.mjs";
import { n as extractModelCompat } from "./provider-model-compat-D1iLDbYW.mjs";
import { r as detectRuntimeShell } from "./shell-utils-D_gDHHBQ.mjs";
import { n as applyLocalNoAuthHeaderOverride, o as resolveModelAuthMode, t as applyAuthHeaderOverride } from "./model-auth-D3hh0-wa.mjs";
import { n as resolveModelCandidateChain } from "./model-fallback-candidates-NQwHPvez.mjs";
import { o as projectPreparedModelProvider } from "./availability-q42mVdu4.mjs";
import { h as resolveSessionPinnedHarnessId } from "./agent-harness-session-key-CQ6tTBOH.mjs";
import { i as resolveCliBackendConfig } from "./cli-backends-CNff5-1q.mjs";
import { f as prepareModelRuntimeSnapshot, t as acquireAgentRunPreparedModelRuntime } from "./prepared-model-runtime-DwKkPNoF.mjs";
import { l as estimateTokens } from "./compaction-CAzwgOuQ.mjs";
import { a as sanitizeToolUseResultPairingForModel } from "./session-transcript-repair-rV_-0RVP.mjs";
import { t as formatSqliteSessionFileMarker } from "./legacy-sqlite-marker-COPKCuIN.mjs";
import { v as projectPublicSessionEntry } from "./session-accessor.sqlite-transcript-write-CM5480eZ.mjs";
import { t as redactTranscriptMessage } from "./transcript-redact-CcOcbRyc.mjs";
import { o as resolveUserTimezone, r as formatDateStamp } from "./date-time-CaOYkXPL.mjs";
import { a as resolveEffectiveCompactionMode, i as isSilentOverflowProneModel, n as applyAgentAutoCompactionGuard, r as applyAgentCompactionSettingsFromConfig } from "./openclaw-runtime-agent-C9en88xH.mjs";
import { n as resolveMemorySearchIndexConfig } from "./memory-search-D02aykS-.mjs";
import { l as loadSessionEntryReadOnly } from "./session-accessor.sqlite-entry-BTkJgNr-.mjs";
import "./session-accessor-C05KQ5A3.mjs";
import { u as normalizeUsage } from "./usage-XXLoqJQC.mjs";
import { l as prepareSystemAgentRunAdmission } from "./admitted-run-context-BNasoszr.mjs";
import { l as markDiagnosticEmbeddedRunStarted, n as closeDiagnosticEmbeddedRunOwner, r as createDiagnosticEmbeddedRunOwner } from "./diagnostic-run-activity-DTzzZJ-S.mjs";
import { b as compactWithSafetyTimeout, x as resolveCompactionTimeoutMs } from "./diagnostic-DMwhUN76.mjs";
import { r as getPluginToolMeta } from "./tool-metadata-DpaqT_qU.mjs";
import { i as resolveSessionPermissionExecMode, t as SESSION_PERMISSION_BY_EXEC_MODE } from "./session-permission-exec-mode-Bn0mEuts.mjs";
import { n as createInternalHookEvent, u as triggerInternalHook } from "./internal-hooks-CUWGd3wf.mjs";
import { i as describeFailoverError, r as coerceToFailoverError, s as hasModelFallbackStop } from "./failover-error-BwAkMLuL.mjs";
import { t as runWithModelFallback } from "./model-fallback-runner-Bv3pAARh.mjs";
import { s as pickFallbackThinkingLevel } from "./embedded-agent-helpers-DyKvGnUW.mjs";
import { r as isFallbackSummaryError } from "./model-fallback-attempt-rvxNyI_a.mjs";
import { n as classifyCompactionReason, o as resolveCompactionFailure, r as formatUnknownCompactionReasonDetail } from "./compact-reasons-CCyMv9fF.mjs";
import { n as resolveDiagnosticModelContentCapturePolicy } from "./diagnostic-llm-content-pAJxJAOh.mjs";
import { n as createBundleMcpToolRuntime } from "./agent-bundle-mcp-materialize-Cvwg99KJ.mjs";
import "./agent-bundle-mcp-tools-Bu8LOH7I.mjs";
import { i as resolveRuntimeOsLabel } from "./os-summary-B-12bRQs.mjs";
import { n as resolveModelAsync } from "./model-4g7Pq9YZ.mjs";
import { t as materializePreparedRuntimeModel } from "./materialize-model-BGTV6m9x.mjs";
import { r as prepareAgentRuntimeAuth } from "./prepare-auth-nxMgGv-P.mjs";
import { a as resolveReusableRuntimeModelAuth, r as providerUsesCredentialScopedModelMetadata } from "./credential-scoped-model-DVaVEG-N.mjs";
import { n as resolvePreparedRuntimeModelAuth, t as resolvePreparedRuntimeAuthAttempts } from "./resolve-auth-DYdN4zpG.mjs";
import { t as resolveConversationCapabilityProfile } from "./conversation-capability-profile-DHYohf4q.mjs";
import { i as prepareActiveNodeContext, n as formatActiveNodeContextLabel, r as getCurrentActiveNodeContext } from "./active-node-context-Chc0tKJ6.mjs";
import { t as createBundleLspToolRuntime } from "./agent-bundle-lsp-runtime-D7VzeFdN.mjs";
import { $ as getHistoryLimitFromSessionKey, Q as validateReplayTurns, Z as sanitizeSessionHistory, _ as getCompactionSafeguardRuntime, a as prepareAgentMemoryPrompt, c as collectRegisteredToolNames, d as buildEmbeddedSystemPrompt, dt as flushPendingToolResultsAfterIdle, et as limitHistoryTurns, f as buildEmbeddedExtensionFactories, ft as logRuntimeToolSchemaQuarantine, g as consumeCompactionSafeguardCancellation, i as resolveAgentRunSessionTarget, l as toSessionToolAllowlist, p as isRealConversationMessage, r as applyAgentRunSessionTargetIdentity, s as collectAllowedToolNames, u as applySystemPromptToSession, v as setCompactionSafeguardCancellation, y as createPreparedEmbeddedAgentSettingsManager, yt as prepareEmbeddedSkills } from "./builtin-openclaw-BPzZzoTo.mjs";
import { n as filterRuntimeCompatibleTools, t as filterProviderNormalizableTools } from "./tool-schema-projection-D9z9oa3w.mjs";
import { t as log } from "./logger-Cp6WXSpQ.mjs";
import { t as collectRuntimeChannelCapabilities } from "./runtime-capabilities-CJ-I3wZ8.mjs";
import { t as isAcpRuntimeSpawnAvailable } from "./availability-DLM4e556.mjs";
import { i as buildBootstrapPromptWarningNotice, n as buildBootstrapBudgetState, r as buildBootstrapInjectionStats } from "./bootstrap-budget-DZWwd3xP.mjs";
import { a as getActiveMemorySearchManagerCore } from "./memory-runtime-Dxg3qwYx.mjs";
import { a as resolveBootstrapContextForRun, i as makeBootstrapWarn, l as resolveContextInjectionMode } from "./bootstrap-files-Cueaawuk.mjs";
import { n as resolveSandboxContext } from "./context-Csq-w9NQ.mjs";
import "./sandbox-wz8zRGj4.mjs";
import { t as applyExtraParamsToAgent } from "./extra-params-BreiVwuo.mjs";
import { f as estimateCompactedRequestTokens, i as agentSessionSetContextReplacementHook, o as setSessionModelUsageSink, r as agentSessionAutomaticCompaction } from "./resource-loader-y1fV7Six.mjs";
import { i as guardSessionManager, r as createAgentSessionForEmbeddedRunner, t as createEmbeddedAgentResourceLoader } from "./resource-loader-BLitxBy5.mjs";
import { l as prepareEmbeddedSessionActiveProjectKeys } from "./session-prompt-state-C1pwD4fu.mjs";
import { t as rewriteTranscriptEntriesInSessionManager } from "./transcript-rewrite-V8RsMN8_.mjs";
import { t as SessionManager } from "./session-manager-Bb7qQp5M.mjs";
import { t as withSessionManagerWrite } from "./session-manager-write-admission-Dwxoskt2.mjs";
import { u as estimateLlmBoundaryTokenPressure } from "./settled-turn-finalization-result-hbaaHyP7.mjs";
import { n as mapThinkingLevelForProvider, t as mapThinkingLevel } from "./utils-CefVZRZM.mjs";
import { _ as resolveEmbeddedCompactionTarget, b as listActiveProcessSessionReferences, g as resolveCompactionTargetRuntime, h as resolveCompactionHarnessRuntime, m as resolveCompactionContextTokenBudget, u as resolvePromptModeForSession, v as resolveEmbeddedCompactionThinkingLevel } from "./context-engine-maintenance-DR58exyi.mjs";
import { t as resolveProcessToolScopeKey } from "./bash-process-scope-Bmw8_ghL.mjs";
import { t as applyFinalEffectiveToolPolicy } from "./effective-tool-policy-DOxCMP7W.mjs";
import { t as applyEmbeddedAttemptToolsAllow } from "./attempt-tool-construction-plan-DN-5OrUy.mjs";
import "./sessions-CqHZpIlO.mjs";
import { r as resolveAttemptSpawnWorkspaceDir } from "./attempt-thread-helpers-4QItXoFy.mjs";
import { r as hasPersistedMedia, t as isReasoningTagProvider } from "./provider-utils-B4V4yYub.mjs";
import { i as resolveEmbeddedAgentStream, n as resolveEmbeddedAgentApiKey, r as resolveEmbeddedAgentBaseStreamFn, t as wrapStreamFnWithDiagnosticModelCallEvents } from "./attempt.model-diagnostic-events-C7HiErEO.mjs";
import { c as resolveAgentPromptSurfaceForSessionKey, n as resolveRuntimeAgentName, r as resolveSystemPromptRepoRoot } from "./system-prompt-params-CQI69lAx.mjs";
import { n as prepareWatchedSessionsPrompt } from "./watched-sessions-prompt-8YN9ml2q.mjs";
import { t as registerProviderStreamForModel } from "./provider-stream-BpwkO0uA.mjs";
import { n as createOpenClawCodingToolsInternal } from "./agent-tools-Dp5LthCP.mjs";
import { s as createSkillInstructionDeliveryCache } from "./agent-tools.read-C0ZS55lg.mjs";
import { i as resolveChannelMessageToolHints, o as resolveChannelReactionGuidance } from "./channel-tools-Brx-Bt2o.mjs";
import { n as supportsModelTools } from "./model-tool-support-DIQSEumC.mjs";
import { t as splitSdkTools } from "./tool-split-DNI0xbmV.mjs";
import { r as resolveOpenClawReferencePaths } from "./docs-path-Cq1F-2do.mjs";
import { t as getMachineDisplayName } from "./machine-name-BYeXMPA1.mjs";
import { r as resolveEmbeddedSandboxInfoExecPolicy, t as buildEmbeddedSandboxInfo } from "./sandbox-info-BqSLKjR2.mjs";
import { i as selectAgentHarnessForPreparedModelProviders, r as selectAgentHarness } from "./selection-D7izV5RM.mjs";
import { t as ensureSelectedAgentHarnessPlugin } from "./runtime-plugin-BHs2PfXW.mjs";
import { t as protectPreparedProviderRuntimeAuth } from "./provider-runtime-auth-protection-DFvzygMB.mjs";
import { n as buildAgentRuntimePlan, r as resolvePreparedProviderRuntimeHandle } from "./build-DNMKbvPh.mjs";
import { isDeepStrictEqual } from "node:util";
import path from "node:path";
import { AsyncLocalStorage } from "node:async_hooks";
import fs from "node:fs/promises";
import os from "node:os";
import { captureOpenAIResponsesCompaction, preserveCompactionReplayWindow, requestPreparedOpenAIResponsesCompaction, requiresCompactionReplayRefresh, resolveCompactionReplayEligibility, resolveOpenAIResponsesCompactEndpointPlan } from "@openclaw/ai/transports";
//#region src/agents/project-memory-scope.ts
const MAX_PROJECT_KEY_CACHE_ENTRIES = 128;
const GIT_CONFIG_TIMEOUT_MS = 4e3;
const projectKeyByRepoRoot = /* @__PURE__ */ new Map();
function escapeProjectKeyForAnnotation(value) {
	return value.replaceAll("%", "%25").replaceAll(";", "%3b").replaceAll("<", "%3c").replaceAll(">", "%3e").replaceAll("\r", "%0d").replaceAll("\n", "%0a");
}
async function resolveUncachedProjectKey(repoRoot) {
	try {
		const result = await runCommandWithTimeout([
			"git",
			"-C",
			repoRoot,
			"config",
			"--get",
			"remote.origin.url"
		], { timeoutMs: GIT_CONFIG_TIMEOUT_MS });
		if (result.code === 0) {
			const source = parseGitUrl(`git:${result.stdout.trim()}`);
			if (source) return escapeProjectKeyForAnnotation(`${source.host.toLowerCase()}/${source.path}`);
		}
	} catch {}
	return `path:${escapeProjectKeyForAnnotation(repoRoot)}`;
}
/** Resolve one stable repository identity without spawning Git again for the same root. */
function resolveProjectKey(repoRoot) {
	const canonicalRoot = path.resolve(repoRoot);
	const cached = projectKeyByRepoRoot.get(canonicalRoot);
	if (cached) {
		projectKeyByRepoRoot.delete(canonicalRoot);
		projectKeyByRepoRoot.set(canonicalRoot, cached);
		return cached;
	}
	const pending = resolveUncachedProjectKey(canonicalRoot);
	projectKeyByRepoRoot.set(canonicalRoot, pending);
	pruneMapToMaxSize(projectKeyByRepoRoot, MAX_PROJECT_KEY_CACHE_ENTRIES);
	return pending;
}
//#endregion
//#region src/agents/embedded-agent-runner/compaction-diagnostics.ts
function createDirectCompactionDiagId() {
	return `cmp-${Date.now().toString(36)}-${generateSecureToken(4)}`;
}
function resolveCompactionProviderStream(params) {
	return registerProviderStreamForModel({
		model: params.effectiveModel,
		cfg: params.config,
		agentDir: params.agentDir,
		workspaceDir: params.effectiveWorkspace,
		apiRegistry: params.apiRegistry
	});
}
function normalizeObservedTokenCount(value) {
	return typeof value === "number" && Number.isFinite(value) && value > 0 ? Math.floor(value) : void 0;
}
function getMessageTextChars(msg) {
	const content = msg.content;
	if (typeof content === "string") return content.length;
	return Array.isArray(content) ? content.reduce((total, block) => {
		const text = block && typeof block === "object" ? block.text : void 0;
		return total + (typeof text === "string" ? text.length : 0);
	}, 0) : 0;
}
function resolveMessageToolLabel(msg) {
	const candidate = msg.toolName ?? msg.name ?? msg.tool;
	return typeof candidate === "string" && candidate.trim().length > 0 ? candidate : void 0;
}
function summarizeCompactionMessages(messages) {
	let historyTextChars = 0;
	let toolResultChars = 0;
	const contributors = [];
	let estTokens = 0;
	let tokenEstimationFailed = false;
	for (const msg of messages) {
		const role = typeof msg.role === "string" ? msg.role : "unknown";
		const chars = getMessageTextChars(msg);
		historyTextChars += chars;
		if (role === "toolResult") toolResultChars += chars;
		contributors.push({
			role,
			chars,
			tool: resolveMessageToolLabel(msg)
		});
		if (!tokenEstimationFailed) try {
			estTokens += estimateTokens(msg);
		} catch {
			tokenEstimationFailed = true;
		}
	}
	return {
		messages: messages.length,
		historyTextChars,
		toolResultChars,
		estTokens: tokenEstimationFailed ? void 0 : estTokens,
		contributors: contributors.toSorted((left, right) => right.chars - left.chars).slice(0, 3)
	};
}
function containsRealConversationMessages(messages) {
	return messages.some((message, index, allMessages) => isRealConversationMessage(message, allMessages, index));
}
//#endregion
//#region src/agents/embedded-agent-runner/compaction-hooks.ts
function resolvePostCompactionIndexSyncMode(config) {
	const mode = config?.agents?.defaults?.compaction?.postIndexSync;
	if (mode === "off" || mode === "async" || mode === "await") return mode;
	return "async";
}
async function runPostCompactionSessionMemorySync(params) {
	if (!params.config) return;
	try {
		const sessionFile = params.sessionFile.trim();
		if (!sessionFile) return;
		const agentId = resolveSessionAgentId({
			sessionKey: params.sessionKey,
			config: params.config,
			agentId: params.agentId
		});
		const resolvedMemory = resolveMemorySearchIndexConfig(params.config, agentId);
		if (!resolvedMemory || !resolvedMemory.sources.includes("sessions")) return;
		if (!resolvedMemory.sync.sessions.postCompactionForce) return;
		params.assertActive?.();
		const { manager } = await getActiveMemorySearchManagerCore({
			cfg: params.config,
			agentId
		});
		params.assertActive?.();
		if (!manager?.sync) return;
		const sessionId = params.sessionId?.trim();
		await manager.sync({
			reason: "post-compaction",
			...sessionId ? { sessions: [{
				agentId,
				sessionId,
				...params.sessionKey ? { sessionKey: params.sessionKey } : {}
			}] } : { archiveFiles: [sessionFile] }
		});
	} catch (err) {
		params.assertActive?.();
		log.warn(`memory sync skipped (post-compaction): ${formatErrorMessage(err)}`);
	}
}
function syncPostCompactionSessionMemory(params) {
	if (params.mode === "off" || !params.config) return Promise.resolve();
	const syncTask = runPostCompactionSessionMemorySync(params);
	if (params.mode === "await") return syncTask;
	syncTask.catch((error) => {
		log.debug(`memory sync cancelled (post-compaction): ${formatErrorMessage(error)}`);
	});
	return Promise.resolve();
}
/** Emits post-compaction transcript and memory-index side effects for a compacted session file. */
async function runPostCompactionSideEffects(params) {
	params.assertActive?.();
	const sessionFile = params.sessionFile.trim();
	if (!sessionFile) return;
	emitSessionTranscriptUpdate({
		sessionFile,
		sessionKey: params.sessionKey,
		...params.sessionId ? { sessionId: params.sessionId } : {},
		...params.agentId ? { agentId: params.agentId } : {}
	});
	params.assertActive?.();
	await syncPostCompactionSessionMemory({
		...params,
		sessionFile,
		mode: resolvePostCompactionIndexSyncMode(params.config)
	});
	params.assertActive?.();
}
/** Converts the global hook runner into the compaction-specific hook shape. */
function asCompactionHookRunner(hookRunner) {
	if (!hookRunner) return null;
	return {
		hasHooks: (hookName) => hookRunner.hasHooks?.(hookName) ?? false,
		runBeforeCompaction: hookRunner.runBeforeCompaction?.bind(hookRunner),
		runAfterCompaction: hookRunner.runAfterCompaction?.bind(hookRunner)
	};
}
function estimateTokenCountSafe(messages, estimateTokensFn) {
	try {
		let total = 0;
		for (const message of messages) total += estimateTokensFn(message);
		return total;
	} catch {
		return;
	}
}
/** Builds before-hook metrics while tolerating providers that cannot estimate all messages. */
function buildBeforeCompactionHookMetrics(params) {
	return {
		messageCountOriginal: params.originalMessages.length,
		tokenCountOriginal: estimateTokenCountSafe(params.originalMessages, params.estimateTokensFn),
		messageCountBefore: params.currentMessages.length,
		tokenCountBefore: params.observedTokenCount ?? estimateTokenCountSafe(params.currentMessages, params.estimateTokensFn)
	};
}
/** Runs internal and plugin before-compaction hooks, forwarding hook-produced messages. */
async function runBeforeCompactionHooks(params) {
	const missingSessionKey = false;
	const hookSessionKey = params.sessionKey;
	params.assertActive?.();
	try {
		const hookEvent = createInternalHookEvent("session", "compact:before", hookSessionKey, {
			sessionId: params.sessionId,
			missingSessionKey,
			messageCount: params.metrics.messageCountBefore,
			tokenCount: params.metrics.tokenCountBefore,
			messageCountOriginal: params.metrics.messageCountOriginal,
			tokenCountOriginal: params.metrics.tokenCountOriginal
		});
		await triggerInternalHook(hookEvent);
		params.assertActive?.();
		if (hookEvent.messages.length > 0) await params.onHookMessages?.({
			phase: "before",
			messages: hookEvent.messages.slice(),
			sessionId: params.sessionId,
			sessionKey: hookSessionKey
		});
	} catch (err) {
		params.assertActive?.();
		log.warn("session:compact:before hook failed", {
			errorMessage: formatErrorMessage(err),
			errorStack: err instanceof Error ? err.stack : void 0
		});
	}
	params.assertActive?.();
	if (params.hookRunner?.hasHooks?.("before_compaction")) try {
		await params.hookRunner.runBeforeCompaction?.({
			messageCount: params.metrics.messageCountBefore,
			tokenCount: params.metrics.tokenCountBefore
		}, {
			sessionId: params.sessionId,
			agentId: params.sessionAgentId,
			sessionKey: hookSessionKey,
			workspaceDir: params.workspaceDir,
			messageProvider: params.messageProvider
		});
	} catch (err) {
		params.assertActive?.();
		log.warn("before_compaction hook failed", {
			errorMessage: formatErrorMessage(err),
			errorStack: err instanceof Error ? err.stack : void 0
		});
	}
	params.assertActive?.();
	return {
		hookSessionKey,
		missingSessionKey
	};
}
/** Estimates compacted-session token count and rejects impossible growth from stale estimates. */
function estimateTokensAfterCompaction(params) {
	if (params.requestBudget) return estimateCompactedRequestTokens(params.messagesAfter, {
		...params.requestBudget,
		pendingTokens: 0
	});
	const tokensAfter = estimateTokenCountSafe(params.messagesAfter, params.estimateTokensFn);
	if (tokensAfter === void 0) return;
	const sanityCheckBaseline = params.observedTokenCount ?? params.fullSessionTokensBefore;
	if (sanityCheckBaseline > 0 && tokensAfter > (params.observedTokenCount !== void 0 ? sanityCheckBaseline : sanityCheckBaseline * 1.1)) return;
	return tokensAfter;
}
/** Runs internal and plugin after-compaction hooks with the final compacted metrics. */
async function runAfterCompactionHooks(params) {
	params.assertActive?.();
	try {
		const hookEvent = createInternalHookEvent("session", "compact:after", params.hookSessionKey, {
			sessionId: params.sessionId,
			missingSessionKey: params.missingSessionKey,
			messageCount: params.messageCountAfter,
			tokenCount: params.tokensAfter,
			compactedCount: params.compactedCount,
			summaryLength: params.summaryLength,
			tokensBefore: params.tokensBefore,
			tokensAfter: params.tokensAfter,
			firstKeptEntryId: params.firstKeptEntryId
		});
		await triggerInternalHook(hookEvent);
		params.assertActive?.();
		if (hookEvent.messages.length > 0) await params.onHookMessages?.({
			phase: "after",
			messages: hookEvent.messages.slice(),
			sessionId: params.sessionId,
			sessionKey: params.hookSessionKey
		});
	} catch (err) {
		params.assertActive?.();
		log.warn("session:compact:after hook failed", {
			errorMessage: formatErrorMessage(err),
			errorStack: err instanceof Error ? err.stack : void 0
		});
	}
	params.assertActive?.();
	if (params.hookRunner?.hasHooks?.("after_compaction")) try {
		await params.hookRunner.runAfterCompaction?.({
			messageCount: params.messageCountAfter,
			tokenCount: params.tokensAfter,
			compactedCount: params.compactedCount,
			sessionFile: params.sessionFile,
			...params.previousSessionId ? { previousSessionId: params.previousSessionId } : {}
		}, {
			sessionId: params.sessionId,
			agentId: params.sessionAgentId,
			sessionKey: params.hookSessionKey,
			workspaceDir: params.workspaceDir,
			messageProvider: params.messageProvider
		});
	} catch (err) {
		params.assertActive?.();
		log.warn("after_compaction hook failed", {
			errorMessage: formatErrorMessage(err),
			errorStack: err instanceof Error ? err.stack : void 0
		});
	}
	params.assertActive?.();
}
//#endregion
//#region src/agents/embedded-agent-runner/compaction-runtime-preparation.ts
function projectCodexHostTranscriptBytePreflightConfig(config, active) {
	const compaction = config?.agents?.defaults?.compaction;
	if (!active || !compaction || !Object.hasOwn(compaction, "model") && !Object.hasOwn(compaction, "provider")) return config;
	const { model: _model, provider: _provider, ...projectedCompaction } = compaction;
	return {
		...config,
		agents: {
			...config.agents,
			defaults: {
				...config.agents?.defaults,
				compaction: projectedCompaction
			}
		}
	};
}
/** Resolves the shared policy, target, and harness ownership for either compaction entry point. */
function resolveCompactionRuntimeSelection(params) {
	const runtimePolicySessionKey = params.sandboxSessionKey ?? params.sessionKey ?? void 0;
	const runtimePolicyAgentId = params.sandboxAgentId ?? (params.sandboxSessionKey && parseAgentSessionKey(params.sandboxSessionKey) ? void 0 : params.agentId);
	const policyTarget = resolveEmbeddedCompactionTarget({
		config: params.config,
		provider: params.provider,
		modelId: params.modelId,
		authProfileId: params.authProfileId,
		modelSelectionLocked: params.modelSelectionLocked,
		defaultProvider: DEFAULT_PROVIDER,
		defaultModel: DEFAULT_MODEL,
		allowPluginNormalization: params.allowPluginNormalization,
		manifestPlugins: params.manifestPlugins
	});
	const policyProvider = policyTarget.provider ?? "openai";
	const policyModelId = policyTarget.model ?? "gpt-6-astra";
	const policy = resolveAgentHarnessPolicy({
		provider: policyProvider,
		modelId: policyModelId,
		config: params.config,
		agentId: runtimePolicyAgentId,
		sessionKey: runtimePolicySessionKey
	});
	const configuredHarnessRuntime = policy.runtimeSource && policy.runtimeSource !== "implicit" && !isDefaultAgentRuntimeId(policy.runtime) ? policy.runtime : void 0;
	const boundHarnessRuntime = normalizeOptionalAgentRuntimeId(params.boundHarnessRuntime);
	const selectedHarnessRuntime = params.selectedHarnessRuntime ?? resolveCompactionHarnessRuntime({
		boundHarnessRuntime,
		preparedRuntimePlan: params.preparedRuntimePlan,
		configuredHarnessRuntime,
		provider: policyProvider,
		modelId: policyModelId
	});
	const target = {
		...policyTarget,
		...resolveCompactionTargetRuntime(policyTarget.provider, selectedHarnessRuntime)
	};
	const provider = target.provider ?? "openai";
	const modelId = target.model ?? "gpt-6-astra";
	const selectedRuntime = normalizeOptionalAgentRuntimeId(selectedHarnessRuntime);
	return {
		attemptNativeHarnessCompaction: Boolean(selectedRuntime && selectedRuntime !== "auto" && selectedRuntime !== "openclaw" && (!isOpenAIProvider(provider) || target.nativeHarnessCompaction === true)),
		runtimePolicySessionKey,
		runtimePolicyAgentId,
		boundHarnessRuntime,
		selectedHarnessRuntime,
		selectedHarnessRuntimeOverride: boundHarnessRuntime ? void 0 : selectedHarnessRuntime,
		target,
		runtimeModelAuth: resolveReusableRuntimeModelAuth({
			plan: params.runtimeAuthPlan ?? params.preparedRuntimePlan?.auth,
			provider,
			modelId,
			authProfileId: target.authProfileId
		}),
		provider,
		runtimeProvider: target.runtimeProvider ?? provider,
		contextConfigProvider: target.contextProvider ?? provider,
		modelId
	};
}
/** Prepares one ordered auth-attempt set and converges it on a single compaction harness. */
async function prepareCompactionHarnessAuth(params) {
	const runtimeAuthProfileStore = isOpenAIProvider(params.provider) ? ensureAuthProfileStore(params.agentDir, {
		profileId: params.authProfileId ?? params.reusableRuntimeAuthPlan?.forwardedAuthProfileId,
		externalCliProviderIds: ["openai"],
		allowKeychainPrompt: false
	}) : ensureAuthProfileStoreWithoutExternalProfiles(params.agentDir, {
		profileId: params.authProfileId ?? params.reusableRuntimeAuthPlan?.forwardedAuthProfileId,
		allowKeychainPrompt: false
	});
	const harnessSelectionParams = {
		provider: params.provider,
		modelId: params.modelId,
		config: params.config,
		agentId: params.runtimePolicyAgentId,
		sessionKey: params.runtimePolicySessionKey ?? void 0,
		agentHarnessId: params.agentHarnessId,
		agentHarnessRuntimeOverride: params.agentHarnessRuntimeOverride
	};
	const selectPreparedHarness = (attempts) => selectAgentHarnessForPreparedModelProviders({
		...harnessSelectionParams,
		modelProviders: attempts.map((attempt) => projectPreparedModelProvider({
			model: params.model,
			plan: attempt.plan,
			attemptKind: attempt.kind
		}))
	});
	const initialHarness = params.reusableRuntimeAuthPlan ? void 0 : selectAgentHarness({
		...harnessSelectionParams,
		modelProvider: projectPreparedModelProvider({ model: params.model })
	});
	const prepare = (harness) => {
		try {
			return {
				ok: true,
				auth: prepareAgentRuntimeAuth({
					provider: params.provider,
					modelId: params.modelId,
					modelApi: params.model?.api,
					modelBaseUrl: params.model?.baseUrl,
					config: params.config,
					agentId: params.runtimePolicyAgentId,
					env: process.env,
					agentDir: params.agentDir,
					workspaceDir: params.workspaceDir,
					authProfileStore: runtimeAuthProfileStore,
					sessionAuthProfileId: params.authProfileId,
					sessionAuthProfileSource: params.authProfileIdSource,
					harnessId: harness.id,
					harnessRuntime: harness.id,
					harnessAuthBootstrap: harness.authBootstrap
				})
			};
		} catch (error) {
			if (isAbortError(error)) throw error;
			return {
				ok: false,
				error
			};
		}
	};
	const initialAuth = params.reusableRuntimeAuthPlan ? {
		ok: true,
		auth: {
			plan: params.reusableRuntimeAuthPlan,
			attempts: [{
				kind: "implicit",
				plan: params.reusableRuntimeAuthPlan
			}]
		}
	} : prepare(initialHarness);
	if (!initialAuth.ok) return initialAuth;
	let runtimeAuthPreparation = initialAuth.auth;
	let selectedPreparedHarness = selectPreparedHarness(runtimeAuthPreparation.attempts);
	if (!params.reusableRuntimeAuthPlan && selectedPreparedHarness.id !== initialHarness?.id) {
		const preparedAuth = prepare(selectedPreparedHarness);
		if (!preparedAuth.ok) return preparedAuth;
		runtimeAuthPreparation = preparedAuth.auth;
		const confirmedHarness = selectPreparedHarness(runtimeAuthPreparation.attempts);
		if (confirmedHarness.id !== selectedPreparedHarness.id) throw new Error(`${params.convergenceErrorPrefix ?? "Prepared compaction"} auth routes did not converge on one agent harness for ${params.provider}/${params.modelId}.`);
		selectedPreparedHarness = confirmedHarness;
	}
	return {
		ok: true,
		runtimeAuthProfileStore,
		runtimeAuthPreparation,
		selectedPreparedHarness,
		providerUsesProfileScopedModelMetadata: providerUsesCredentialScopedModelMetadata({
			provider: params.metadataProvider ?? params.provider,
			modelId: params.modelId,
			config: params.config,
			agentDir: params.agentDir,
			workspaceDir: params.workspaceDir
		})
	};
}
//#endregion
//#region src/agents/embedded-agent-runner/compaction-session-agent.ts
async function prepareCompactionSessionAgent(params) {
	const authStorage = params.authStorage && typeof params.authStorage === "object" && "getApiKey" in params.authStorage && typeof params.authStorage.getApiKey === "function" ? params.authStorage : void 0;
	const transportApiKey = authStorage ? await resolveEmbeddedAgentApiKey({
		provider: params.effectiveModel.provider,
		resolvedApiKey: params.resolvedApiKey,
		authStorage
	}) : params.resolvedApiKey;
	params.session.agent.streamFn = resolveEmbeddedAgentStream({
		llmRuntime: params.llmRuntime,
		currentStreamFn: resolveEmbeddedAgentBaseStreamFn({ session: params.session }),
		providerStreamFn: params.providerStreamFn,
		sessionId: params.sessionId,
		signal: params.signal,
		model: params.effectiveModel,
		resolvedApiKey: params.resolvedApiKey,
		transportAuthAvailable: Boolean(transportApiKey?.trim()),
		authProfileId: params.runtimePlan?.auth.forwardedAuthProfileId,
		authStorage: params.authStorage
	}).streamFn;
	const providerTextTransforms = resolveProviderTextTransforms({
		provider: params.provider,
		config: params.config,
		workspaceDir: params.effectiveWorkspace,
		runtimeHandle: getModelProviderRuntimePluginHandle(params.effectiveModel)
	});
	if (providerTextTransforms) params.session.agent.streamFn = wrapStreamFnTextTransforms({
		streamFn: params.session.agent.streamFn,
		input: providerTextTransforms.input,
		output: providerTextTransforms.output,
		transformSystemPrompt: false
	});
	const providerThinkingLevel = mapThinkingLevelForProvider(params.thinkLevel);
	const preparedRuntimeExtraParams = params.runtimePlan?.transport.resolveExtraParams({
		thinkingLevel: providerThinkingLevel,
		agentId: params.sessionAgentId,
		workspaceDir: params.effectiveWorkspace,
		model: params.effectiveModel
	});
	return {
		...applyExtraParamsToAgent(params.session.agent, params.config, params.provider, params.modelId, void 0, providerThinkingLevel, params.sessionAgentId, params.effectiveWorkspace, params.effectiveModel, params.agentDir, void 0, {
			...preparedRuntimeExtraParams ? { preparedExtraParams: preparedRuntimeExtraParams } : {},
			nativeWebSearchPolicyContext: {
				sessionKey: params.sessionKey,
				webSearchEnabled: false,
				runtimeToolAllowlist: [],
				sandboxToolPolicy: params.sandboxToolPolicy,
				messageProvider: params.messageProvider,
				agentAccountId: params.agentAccountId,
				groupId: params.groupId,
				groupChannel: params.groupChannel,
				groupSpace: params.groupSpace,
				spawnedBy: params.spawnedBy,
				senderId: params.senderId,
				senderName: params.senderName,
				senderUsername: params.senderUsername,
				senderE164: params.senderE164
			}
		}),
		transportApiKey
	};
}
//#endregion
//#region src/agents/embedded-agent-runner/compaction-duplicate-user-messages.ts
/**
* Removes short-window duplicate user turns from compaction summaries.
*/
const DEFAULT_DUPLICATE_USER_MESSAGE_WINDOW_MS = 6e4;
const MIN_DUPLICATE_USER_MESSAGE_CHARS = 24;
function normalizeUserMessageContent(content) {
	if (typeof content === "string") return content.replace(/\s+/g, " ").trim();
	if (!Array.isArray(content)) return;
	const textParts = [];
	for (const block of content) {
		if (!isRecord(block)) return;
		if (block.type === "image") return;
		if (block.type === "text" && typeof block.text === "string") textParts.push(block.text);
	}
	return textParts.join("\n").replace(/\s+/g, " ").trim();
}
function duplicateSignature(message) {
	if (!isRecord(message) || message.role !== "user" || typeof message.timestamp !== "number") return;
	const text = normalizeUserMessageContent(message.content);
	if (!text || text.length < MIN_DUPLICATE_USER_MESSAGE_CHARS || hasPersistedMedia(message)) return;
	const metadata = message["__openclaw"];
	const senderId = isRecord(metadata) && typeof metadata.senderId === "string" ? metadata.senderId : "";
	return {
		key: JSON.stringify([senderId, text.normalize("NFC")]),
		timestamp: message.timestamp
	};
}
/** Drop later duplicate user messages while preserving the first prompt. */
function dedupeDuplicateUserMessagesForCompaction(messages, options = {}) {
	const windowMs = options.windowMs ?? DEFAULT_DUPLICATE_USER_MESSAGE_WINDOW_MS;
	const lastSeenAtByKey = /* @__PURE__ */ new Map();
	let removed = 0;
	const result = [];
	for (const message of messages) {
		const signature = duplicateSignature(message);
		if (!signature) {
			if (message.role === "assistant") lastSeenAtByKey.clear();
			result.push(message);
			continue;
		}
		const lastSeenAt = lastSeenAtByKey.get(signature.key);
		const newestTimestamp = Math.max(lastSeenAt ?? signature.timestamp, signature.timestamp);
		lastSeenAtByKey.set(signature.key, newestTimestamp);
		if (typeof lastSeenAt === "number" && signature.timestamp >= lastSeenAt && signature.timestamp - lastSeenAt <= windowMs) {
			removed += 1;
			continue;
		}
		result.push(message);
	}
	return removed > 0 ? result : [...messages];
}
//#endregion
//#region src/agents/embedded-agent-runner/run/compaction-accounting-bridge.ts
const recorderByRuntimeContext = /* @__PURE__ */ new WeakMap();
function attachCompactionAccountingRecorder(runtimeContext, recorder) {
	recorderByRuntimeContext.set(runtimeContext, recorder);
}
function readCompactionAccountingRecorder(runtimeContext) {
	return runtimeContext ? recorderByRuntimeContext.get(runtimeContext) : void 0;
}
//#endregion
//#region src/agents/embedded-agent-runner/server-endpoint-compaction.ts
/** Try provider-owned compaction and persist its replay checkpoint on the session owner. */
async function attemptServerEndpointCompaction(params) {
	if (params.trigger === "overflow" || params.customInstructions?.trim() || !resolveOpenAIResponsesCompactEndpointPlan(params.model, params.extraParams, params.trigger).enabled) return;
	params.assertActive?.();
	let compacted;
	let compactionCommitted = false;
	try {
		const messages = params.context.messages.filter((message) => message.role === "user" || message.role === "assistant" || message.role === "toolResult");
		if (messages.at(-1)?.role !== "assistant") return;
		if (requiresCompactionReplayRefresh(messages, params.model, params.requestOptions)) return;
		const owner = params.sessionManager.getBranch().findLast((entry) => entry.type === "message" && entry.message.role === "assistant");
		if (!owner || owner.type !== "message" || owner.message.role !== "assistant") throw new Error("Responses compact endpoint requires a persisted assistant owner");
		compacted = await compactWithSafetyTimeout((signal) => requestPreparedOpenAIResponsesCompaction(params.streamFn, params.model, {
			systemPrompt: params.context.systemPrompt,
			messages
		}, {
			...params.requestOptions,
			signal
		}), params.requestOptions.timeoutMs, params.requestOptions.signal ? { abortSignal: params.requestOptions.signal } : void 0);
		params.onUsage?.(compacted.usage);
		params.assertActive?.();
		const replacement = structuredClone(owner.message);
		captureOpenAIResponsesCompaction(replacement, compacted.item, compacted.historyMode === "retained-users" ? "retained-users" : replacement.content.length, compacted.model, compacted.replayMetadata, compacted.output);
		const redacted = redactTranscriptMessage(replacement, params.config);
		if (redacted.role !== "assistant" || !isDeepStrictEqual(redacted.providerReplay, replacement.providerReplay)) throw new Error("Responses compact endpoint window requires transcript redaction");
		await withSessionManagerWrite(params.sessionManager, async () => {
			params.requestOptions.signal?.throwIfAborted();
			params.assertActive?.();
			const rewritten = await rewriteTranscriptEntriesInSessionManager({
				sessionManager: params.sessionManager,
				replacements: [{
					entryId: owner.id,
					message: redacted
				}],
				preserveReplacementCompactionReplay: true
			});
			if (replacement.providerReplay?.data !== compacted.item.encrypted_content || !rewritten.changed) throw new Error(`Responses compact endpoint checkpoint was not persisted: ${rewritten.reason}`);
			compactionCommitted = true;
			params.onCompactionCommitted?.(compacted.usage.input_tokens);
		});
	} catch (err) {
		if (compactionCommitted) throw err;
		params.assertActive?.();
		log.debug(`Responses compact endpoint failed; falling back to client compaction: ${formatErrorMessage(err)}`);
		return;
	}
	return compacted;
}
//#endregion
//#region src/agents/embedded-agent-runner/compaction-session-execution.ts
/**
* Executes compaction while owning the transcript lock, session lifecycle,
* hooks and optional successor transcript rotation.
*/
async function executePreparedCompactionSession(runtime) {
	const { params, diagId, trigger, attempt, maxAttempts, runId, compactionModelCallTrace, diagnosticCompactionRunId, nextDiagnosticModelCallId, agentDir, provider, modelId, attemptedThinking, fail, authStorage, modelRegistry, apiKeyInfo, hasRuntimeAuthExchange, sandboxSessionKey, sandbox, effectiveWorkspace, effectiveCwd, contextTokenBudget, effectiveModel, runtimePlan, runtimePlanModelContext, runAbortController, effectiveTools, allowedToolNames, buildSystemPromptText, resolvedMessageProvider, sessionAgentId } = runtime;
	let thinkLevel = runtime.thinkLevel;
	let compactionSessionManager = null;
	try {
		const compactionTimeoutMs = resolveCompactionTimeoutMs(params.config);
		const accountingRecorder = readCompactionAccountingRecorder(params.contextEngineRuntimeContext);
		const recordCompaction = accountingRecorder?.recordCompaction;
		const memoryTranscript = accountingRecorder?.memoryTranscript;
		const sessionTarget = memoryTranscript?.sessionTarget ?? await resolveAgentRunSessionTarget({
			agentId: sessionAgentId,
			config: params.config,
			missingSessionKey: "resolve-existing",
			sessionFile: params.sessionFile,
			sessionId: params.sessionId,
			sessionKey: params.sessionKey,
			sessionTarget: params.sessionTarget
		});
		const assertActive = memoryTranscript?.assertActive ?? captureOwnedTranscriptWriteAssertion(sessionTarget);
		assertActive();
		const transcriptPolicy = runtimePlan.transcript.resolvePolicy(runtimePlanModelContext);
		const sessionManager = guardSessionManager(memoryTranscript?.sessionManager ?? SessionManager.open(sessionTarget), {
			agentId: sessionAgentId,
			runId: params.runId,
			sessionKey: params.sessionKey,
			config: params.config,
			contextWindowTokens: contextTokenBudget,
			allowSyntheticToolResults: transcriptPolicy.allowSyntheticToolResults,
			missingToolResultText: effectiveModel.api === "openai-responses" || effectiveModel.api === "azure-openai-responses" || effectiveModel.api === "openai-chatgpt-responses" ? "aborted" : void 0,
			allowedToolNames,
			withCompactionPersistence: params.transcriptByteCompactionPersistence
		});
		compactionSessionManager = sessionManager;
		const recordUsage = accountingRecorder?.recordUsage ? (usage) => {
			const normalized = normalizeUsage(usage);
			if (normalized) accountingRecorder.recordUsage?.(normalized);
		} : void 0;
		if (recordUsage) setSessionModelUsageSink(sessionManager, recordUsage);
		const settingsManager = createPreparedEmbeddedAgentSettingsManager({
			cwd: effectiveCwd,
			agentDir,
			cfg: params.config,
			pluginMetadataSnapshot: getCurrentPluginMetadataSnapshot({
				config: params.config,
				env: process.env,
				workspaceDir: effectiveWorkspace
			}),
			contextTokenBudget
		});
		const extensionFactories = buildEmbeddedExtensionFactories({
			cfg: params.config,
			sessionManager,
			provider,
			modelId,
			model: effectiveModel,
			contextTokenBudget,
			agentId: sessionAgentId,
			sessionId: params.sessionId,
			sessionKey: params.sessionKey ?? sandboxSessionKey,
			runId
		});
		const resourceLoader = createEmbeddedAgentResourceLoader({
			cwd: effectiveCwd,
			agentDir,
			settingsManager,
			extensionFactories
		});
		await resourceLoader.reload();
		applyAgentCompactionSettingsFromConfig({
			settingsManager,
			cfg: params.config,
			contextTokenBudget
		});
		applyAgentAutoCompactionGuard({
			settingsManager,
			silentOverflowProneProvider: isSilentOverflowProneModel({
				provider,
				modelId,
				baseUrl: effectiveModel.baseUrl ?? void 0
			})
		});
		const { customTools } = splitSdkTools({
			tools: effectiveTools,
			sandboxEnabled: Boolean(sandbox?.enabled),
			toolHookContext: {
				agentId: sessionAgentId,
				config: params.config,
				cwd: effectiveCwd,
				sessionKey: sandboxSessionKey,
				sessionId: params.sessionId,
				runId: params.runId,
				channelId: params.currentChannelId
			}
		});
		const sessionToolAllowlist = toSessionToolAllowlist(collectRegisteredToolNames(customTools));
		const providerStreamFn = resolveCompactionProviderStream({
			effectiveModel,
			config: params.config,
			agentDir,
			effectiveWorkspace,
			apiRegistry: getModelRegistryRuntime(modelRegistry).apiRegistry
		});
		while (true) {
			setCompactionSafeguardCancellation(sessionManager, void 0);
			attemptedThinking.add(thinkLevel);
			const systemPromptText = buildSystemPromptText();
			let session;
			let diagnosticOwner;
			let resetCompactionTimeout;
			try {
				session = (await createAgentSessionForEmbeddedRunner({
					cwd: effectiveCwd,
					agentDir,
					authStorage,
					modelRegistry,
					model: effectiveModel,
					thinkingLevel: mapThinkingLevel(thinkLevel),
					tools: sessionToolAllowlist,
					customTools,
					sessionManager,
					settingsManager,
					resourceLoader
				}, {})).session;
				session[agentSessionSetContextReplacementHook](recordCompaction ? (tokensAfter, tokensBefore) => recordCompaction({
					tokensBefore,
					tokensAfter,
					compactionKind: "context-engine"
				}) : void 0, assertActive);
				session.setActiveToolsByName(sessionToolAllowlist);
				applySystemPromptToSession(session, systemPromptText);
				const { effectiveExtraParams, transportApiKey } = await prepareCompactionSessionAgent({
					session,
					llmRuntime: getModelRegistryRuntime(modelRegistry).llmRuntime,
					providerStreamFn,
					sessionId: params.sessionId,
					signal: runAbortController.signal,
					effectiveModel,
					resolvedApiKey: hasRuntimeAuthExchange ? void 0 : apiKeyInfo?.apiKey,
					authStorage,
					config: params.config,
					provider,
					modelId,
					thinkLevel,
					sessionAgentId,
					effectiveWorkspace,
					agentDir,
					runtimePlan,
					sessionKey: sandboxSessionKey,
					sandboxToolPolicy: sandbox?.tools,
					messageProvider: resolvedMessageProvider,
					agentAccountId: params.agentAccountId,
					groupId: params.groupId,
					groupChannel: params.groupChannel,
					groupSpace: params.groupSpace,
					spawnedBy: params.spawnedBy,
					senderId: params.senderId,
					senderName: params.senderName,
					senderUsername: params.senderUsername,
					senderE164: params.senderE164
				});
				const compactionReplayEnabled = resolveCompactionReplayEligibility(effectiveModel, {
					extraParams: effectiveExtraParams,
					apiKey: transportApiKey
				});
				diagnosticOwner = createDiagnosticEmbeddedRunOwner({
					sessionId: params.sessionId,
					...params.sessionKey ? { sessionKey: params.sessionKey } : {},
					runId: diagnosticCompactionRunId,
					workKey: diagnosticCompactionRunId
				});
				markDiagnosticEmbeddedRunStarted({
					sessionId: params.sessionId,
					...params.sessionKey ? { sessionKey: params.sessionKey } : {},
					runId: diagnosticCompactionRunId,
					workKey: diagnosticCompactionRunId,
					owner: diagnosticOwner
				});
				session.agent.streamFn = wrapStreamFnWithDiagnosticModelCallEvents(session.agent.streamFn, {
					config: params.config,
					runId: diagnosticCompactionRunId,
					...params.sessionKey && { sessionKey: params.sessionKey },
					sessionId: params.sessionId,
					provider,
					model: modelId,
					api: effectiveModel.api,
					transport: session.agent.transport,
					requestTimeoutMs: compactionTimeoutMs,
					contextTokenBudget,
					trace: compactionModelCallTrace,
					contentCapture: resolveDiagnosticModelContentCapturePolicy(params.config),
					nextCallId: nextDiagnosticModelCallId,
					ownerGeneration: diagnosticOwner.generation,
					onStarted: () => {
						resetCompactionTimeout?.();
						params.compactionTimeoutReset?.();
					}
				});
				const prior = await sanitizeSessionHistory({
					messages: session.messages,
					modelApi: effectiveModel.api,
					modelId,
					provider,
					allowedToolNames,
					config: params.config,
					workspaceDir: effectiveWorkspace,
					env: process.env,
					model: effectiveModel,
					sessionManager,
					sessionId: params.sessionId,
					policy: transcriptPolicy,
					preserveLatestAssistantThinking: false
				});
				const dedupedValidated = dedupeDuplicateUserMessagesForCompaction(await validateReplayTurns({
					messages: prior,
					modelApi: effectiveModel.api,
					modelId,
					provider,
					config: params.config,
					workspaceDir: effectiveWorkspace,
					env: process.env,
					model: effectiveModel,
					sessionId: params.sessionId,
					policy: transcriptPolicy
				}));
				session.agent.state.messages = dedupedValidated;
				const originalMessages = session.messages.slice();
				const truncated = preserveCompactionReplayWindow(originalMessages, limitHistoryTurns(session.messages, getHistoryLimitFromSessionKey(params.sessionKey, params.config, {
					accountId: params.agentAccountId,
					peerId: params.conversationRoutePeerId,
					chatType: params.chatType
				})), effectiveModel, {
					sessionId: params.sessionId,
					authProfileId: runtimePlan.auth.forwardedAuthProfileId,
					enabled: compactionReplayEnabled
				});
				const limited = transcriptPolicy.repairToolUseResultPairing ? sanitizeToolUseResultPairingForModel(truncated, effectiveModel.api === "openai-responses" || effectiveModel.api === "azure-openai-responses" || effectiveModel.api === "openai-chatgpt-responses") : truncated;
				if (limited.length > 0) session.agent.state.messages = limited;
				const hookRunner = asCompactionHookRunner(getGlobalHookRunner());
				const observedTokenCount = normalizeObservedTokenCount(params.currentTokenCount);
				const beforeHookMetrics = buildBeforeCompactionHookMetrics({
					originalMessages,
					currentMessages: session.messages,
					observedTokenCount,
					estimateTokensFn: estimateTokens
				});
				const { hookSessionKey, missingSessionKey } = await runBeforeCompactionHooks({
					hookRunner,
					sessionId: params.sessionId,
					sessionKey: sessionTarget.sessionKey,
					sessionAgentId,
					workspaceDir: effectiveWorkspace,
					messageProvider: resolvedMessageProvider,
					metrics: beforeHookMetrics,
					assertActive,
					onHookMessages: params.onCompactionHookMessages
				});
				const { messageCountOriginal, tokenCountBefore: limitedTranscriptTokensBefore } = beforeHookMetrics;
				const diagEnabled = log.isEnabled("debug");
				const preMetrics = diagEnabled ? summarizeCompactionMessages(session.messages) : void 0;
				if (preMetrics) {
					log.debug(`[compaction-diag] start runId=${runId} sessionKey=${params.sessionKey ?? params.sessionId} diagId=${diagId} trigger=${trigger} provider=${provider}/${modelId} attempt=${attempt} maxAttempts=${maxAttempts} pre.messages=${preMetrics.messages} pre.historyTextChars=${preMetrics.historyTextChars} pre.toolResultChars=${preMetrics.toolResultChars} pre.estTokens=${preMetrics.estTokens ?? "unknown"}`);
					log.debug(`[compaction-diag] contributors diagId=${diagId} top=${JSON.stringify(preMetrics.contributors)}`);
				}
				if (!containsRealConversationMessages(session.messages)) {
					log.info(`[compaction] skipping — no real conversation messages (sessionKey=${params.sessionKey ?? params.sessionId})`);
					return {
						ok: true,
						compacted: false,
						reason: "no real conversation messages"
					};
				}
				const compactStartedAt = Date.now();
				params.compactionTimeoutReset?.();
				let serverTokensAfter;
				const recordServerCompaction = (tokensBefore) => {
					serverTokensAfter = estimateLlmBoundaryTokenPressure({
						messages: sessionManager.buildSessionContext().messages,
						systemPrompt: systemPromptText,
						prompt: "",
						replay: {
							model: effectiveModel,
							sessionId: params.sessionId,
							authProfileId: runtimePlan.auth.forwardedAuthProfileId,
							enabled: compactionReplayEnabled
						}
					});
					recordCompaction?.({
						tokensBefore,
						tokensAfter: serverTokensAfter,
						compactionKind: "server-endpoint"
					});
				};
				const serverResult = params.transcriptBytePreflightAuthority ? void 0 : await attemptServerEndpointCompaction({
					trigger,
					streamFn: session.agent.streamFn,
					model: effectiveModel,
					context: {
						systemPrompt: systemPromptText,
						messages: session.messages
					},
					sessionManager,
					extraParams: effectiveExtraParams,
					customInstructions: params.customInstructions,
					config: params.config,
					onUsage: recordUsage,
					onCompactionCommitted: recordServerCompaction,
					assertActive,
					requestOptions: {
						apiKey: transportApiKey,
						sessionId: params.sessionId,
						authProfileId: runtimePlan.auth.forwardedAuthProfileId,
						timeoutMs: compactionTimeoutMs,
						signal: params.abortSignal
					}
				});
				const activeSession = session;
				let clientResult;
				if (!serverResult) try {
					params.compactionTimeoutReset?.();
					const outcome = await compactWithSafetyTimeout(async (_signal, resetTimeout) => {
						resetCompactionTimeout = resetTimeout;
						setCompactionSafeguardCancellation(compactionSessionManager, void 0);
						const requestState = accountingRecorder?.pendingRequestState ?? (trigger === "overflow" ? "unresolved" : void 0);
						if (trigger === "manual") return {
							status: "completed",
							result: await activeSession.compact(params.customInstructions)
						};
						return activeSession[agentSessionAutomaticCompaction](params.customInstructions, requestState, resolveEffectiveCompactionMode(params.config) === "default" ? void 0 : "none", {
							requestBudget: accountingRecorder?.requestBudget,
							pendingUserEntryId: accountingRecorder?.pendingUserEntryId
						});
					}, compactionTimeoutMs, {
						abortSignal: params.abortSignal,
						onCancel: () => activeSession.abortCompaction()
					});
					if (outcome.status === "skipped") {
						assertActive();
						return {
							ok: true,
							compacted: false,
							reason: outcome.reason
						};
					}
					clientResult = outcome.result;
				} finally {
					resetCompactionTimeout = void 0;
				}
				params.compactionTimeoutReset?.();
				const effectiveFirstKeptEntryId = clientResult?.firstKeptEntryId;
				const tokensBefore = serverResult?.usage.input_tokens ?? clientResult.tokensBefore;
				const tokensAfter = serverResult ? serverTokensAfter : estimateTokensAfterCompaction({
					messagesAfter: session.messages,
					observedTokenCount,
					fullSessionTokensBefore: limitedTranscriptTokensBefore ?? 0,
					estimateTokensFn: estimateTokens,
					requestBudget: accountingRecorder?.requestBudget
				});
				const messageCountAfter = session.messages.length;
				const compactedCount = Math.max(0, messageCountOriginal - messageCountAfter);
				const activeSessionFile = memoryTranscript ? params.sessionFile : formatSqliteSessionFileMarker({
					...sessionTarget,
					sessionId: params.sessionId
				});
				if (!memoryTranscript) await runPostCompactionSideEffects({
					config: params.config,
					sessionKey: params.sessionKey,
					sessionId: params.sessionId,
					agentId: sessionAgentId,
					sessionFile: activeSessionFile,
					assertActive
				});
				const postMetrics = diagEnabled ? summarizeCompactionMessages(session.messages) : void 0;
				if (preMetrics && postMetrics) log.debug(`[compaction-diag] end runId=${runId} sessionKey=${params.sessionKey ?? params.sessionId} diagId=${diagId} trigger=${trigger} provider=${provider}/${modelId} attempt=${attempt} maxAttempts=${maxAttempts} outcome=compacted reason=none durationMs=${Date.now() - compactStartedAt} retrying=false post.messages=${postMetrics.messages} post.historyTextChars=${postMetrics.historyTextChars} post.toolResultChars=${postMetrics.toolResultChars} post.estTokens=${postMetrics.estTokens ?? "unknown"} delta.messages=${postMetrics.messages - preMetrics.messages} delta.historyTextChars=${postMetrics.historyTextChars - preMetrics.historyTextChars} delta.toolResultChars=${postMetrics.toolResultChars - preMetrics.toolResultChars} delta.estTokens=${typeof preMetrics.estTokens === "number" && typeof postMetrics.estTokens === "number" ? postMetrics.estTokens - preMetrics.estTokens : "unknown"}`);
				await runAfterCompactionHooks({
					hookRunner,
					sessionId: params.sessionId,
					sessionAgentId,
					hookSessionKey,
					missingSessionKey,
					workspaceDir: effectiveWorkspace,
					messageProvider: resolvedMessageProvider,
					messageCountAfter,
					tokensAfter,
					compactedCount,
					sessionFile: activeSessionFile,
					summaryLength: clientResult?.summary.length,
					tokensBefore,
					firstKeptEntryId: effectiveFirstKeptEntryId,
					assertActive,
					onHookMessages: params.onCompactionHookMessages
				});
				const resultSessionTarget = {
					agentId: sessionTarget.agentId,
					sessionId: sessionTarget.sessionId,
					sessionKey: sessionTarget.sessionKey,
					storePath: sessionTarget.storePath
				};
				if (params.sessionTarget?.threadId !== void 0) resultSessionTarget.threadId = params.sessionTarget.threadId;
				return {
					ok: true,
					compacted: true,
					...serverResult ? { compactionKind: "server-endpoint" } : {},
					result: {
						sessionTarget: resultSessionTarget,
						...clientResult ? {
							summary: clientResult.summary,
							firstKeptEntryId: clientResult.firstKeptEntryId
						} : { kind: "server-endpoint" },
						tokensBefore: serverResult ? tokensBefore : observedTokenCount ?? clientResult.tokensBefore,
						tokensAfter,
						details: serverResult ? {
							compactionKind: "server-endpoint",
							droppedMessageCount: serverResult.usage.dropped_message_count
						} : clientResult.details
					}
				};
			} catch (err) {
				const failure = resolveCompactionFailure({
					error: err,
					safeguardCancellation: getCompactionSafeguardRuntime(sessionManager)?.cancellation,
					abortSignal: params.abortSignal
				});
				assertActive();
				const fallbackThinking = pickFallbackThinkingLevel({
					message: formatErrorMessage(failure.error),
					attempted: attemptedThinking
				});
				if (fallbackThinking) {
					log.warn(`[compaction] request rejected for ${provider}/${modelId}; retrying with ${fallbackThinking}`);
					thinkLevel = fallbackThinking;
					params.compactionTimeoutReset?.();
					continue;
				}
				throw err;
			} finally {
				if (diagnosticOwner) closeDiagnosticEmbeddedRunOwner(diagnosticOwner);
				try {
					await flushPendingToolResultsAfterIdle({
						agent: session?.agent,
						sessionManager,
						abortSignal: params.abortSignal
					});
				} catch {}
				try {
					session?.dispose();
				} catch {}
			}
		}
	} catch (err) {
		const failure = resolveCompactionFailure({
			error: err,
			safeguardCancellation: consumeCompactionSafeguardCancellation(compactionSessionManager),
			abortSignal: params.abortSignal
		});
		return fail(failure.reason, failure.error);
	} finally {
		setSessionModelUsageSink(compactionSessionManager, null);
	}
}
//#endregion
//#region src/agents/embedded-agent-runner/model-resolution.ts
/** Resolves embedded-run models through discovery first, then the prepared static catalog. */
async function resolveTieredModel(params) {
	const result = await withSqliteReadOnlyWorkerScope(async () => {
		const providers = params.fallbackProvider && params.fallbackProvider !== params.provider ? [params.provider, params.fallbackProvider] : [params.provider];
		const resolveCandidates = async (options) => {
			const modelOptions = {
				...options,
				abortSignal: params.abortSignal,
				assertCurrent: params.assertCurrent,
				workspaceDir: params.workspaceDir,
				authProfileId: params.authProfileId,
				authProfileMode: params.authProfileMode,
				modelIdSource: params.requestedRouteResolution === "resolved" ? "selected" : "input"
			};
			let firstFailure;
			for (const provider of providers) {
				const resolution = await resolveModelAsync(provider, params.modelId, params.agentDir, params.config, modelOptions);
				if (resolution.model) return {
					provider: resolution.logicalRef.provider,
					resolution
				};
				firstFailure ??= {
					provider,
					resolution
				};
			}
			return firstFailure;
		};
		const firstTier = await resolveCandidates({
			skipAgentDiscovery: true,
			allowBundledStaticCatalogFallback: params.staticCatalogOwnsTransport,
			preferBundledStaticCatalogTransport: params.staticCatalogOwnsTransport,
			preparedModelRuntime: params.preparedModelRuntime
		});
		if (firstTier.resolution.model || params.staticCatalogOwnsTransport) return firstTier;
		const config = params.config ?? {};
		const preparedModelRuntime = params.preparedModelRuntime ?? await prepareModelRuntimeSnapshot({
			config,
			agentDir: params.agentDir,
			workspaceDir: params.workspaceDir
		});
		return await resolveCandidates({
			...preparedModelRuntime.createStores(),
			allowBundledStaticCatalogFallback: true,
			preparedModelRuntime
		});
	});
	params.abortSignal?.throwIfAborted();
	params.assertCurrent?.();
	return result;
}
//#endregion
//#region src/agents/embedded-agent-runner/direct-compaction-preparation.ts
/**
* Prepares one direct embedded-agent compaction attempt through model, auth,
* workspace, and sandbox resolution.
*/
async function prepareDirectCompactionAttempt(params) {
	const startedAt = Date.now();
	const diagId = params.diagId?.trim() || createDirectCompactionDiagId();
	const trigger = params.trigger ?? "manual";
	const attempt = params.attempt ?? 1;
	const maxAttempts = params.maxAttempts ?? 1;
	const runId = params.runId ?? params.sessionId;
	const compactionModelCallTrace = freezeDiagnosticTraceContext(getActiveDiagnosticTraceContext() ?? createDiagnosticTraceContext());
	const diagnosticCompactionRunId = `${runId}:compaction:${diagId}`;
	let diagnosticModelCallSeq = 0;
	const resolvedWorkspace = resolveUserPath(params.workspaceDir);
	const earlyAgentIds = resolveSessionAgentIds({
		sessionKey: params.sessionKey,
		config: params.config,
		agentId: params.agentId
	});
	const agentDir = params.agentDir ?? resolveAgentDir(params.config ?? {}, earlyAgentIds.sessionAgentId);
	const { runtimePolicySessionKey, runtimePolicyAgentId, boundHarnessRuntime, selectedHarnessRuntimeOverride, runtimeModelAuth: { plan: reusableRuntimeAuthPlan, authProfileId, modelAuth: initialModelAuth }, provider, runtimeProvider, contextConfigProvider, modelId } = resolveCompactionRuntimeSelection({
		...params,
		modelId: params.model,
		boundHarnessRuntime: params.agentHarnessId,
		preparedRuntimePlan: params.runtimePlan
	});
	await ensureSelectedAgentHarnessPlugin({
		config: params.config,
		provider,
		modelId,
		agentId: runtimePolicyAgentId,
		sessionKey: runtimePolicySessionKey,
		agentHarnessId: boundHarnessRuntime,
		agentHarnessRuntimeOverride: selectedHarnessRuntimeOverride,
		workspaceDir: resolvedWorkspace,
		pluginRegistry: params.preparedModelRuntime.pluginRegistry
	});
	const attemptedThinking = /* @__PURE__ */ new Set();
	const fail = (reason, err) => {
		const failureReason = classifyCompactionReason(reason);
		const failure = err ? describeFailoverError(err) : void 0;
		const detail = failureReason === "unknown" ? formatUnknownCompactionReasonDetail(reason) : void 0;
		const detailSuffix = detail ? ` detail=${detail}` : "";
		log.warn(`[compaction-diag] end runId=${runId} sessionKey=${params.sessionKey ?? params.sessionId} diagId=${diagId} trigger=${trigger} provider=${provider}/${modelId} attempt=${attempt} maxAttempts=${maxAttempts} outcome=failed reason=${failureReason}${detailSuffix} durationMs=${Date.now() - startedAt}`);
		return {
			ok: false,
			compacted: false,
			reason,
			failure: failure ? {
				reason: failure.reason,
				status: failure.status,
				code: failure.code,
				rawError: failure.rawError ?? failure.message
			} : void 0
		};
	};
	const preparedModelRuntime = params.preparedModelRuntime;
	const { resolution: modelResolution } = await resolveTieredModel({
		abortSignal: params.abortSignal,
		provider: runtimeProvider,
		modelId,
		requestedRouteResolution: params.requestedRouteResolution,
		agentDir,
		config: params.config,
		workspaceDir: resolvedWorkspace,
		...initialModelAuth,
		preparedModelRuntime
	});
	const { model, error, authStorage, modelRegistry } = modelResolution;
	if (!model) return {
		ok: false,
		result: fail(error ?? `Unknown model: ${runtimeProvider}/${modelId}`)
	};
	const modelResolutionOptions = {
		authStorage,
		modelRegistry,
		preparedModelRuntime,
		workspaceDir: resolvedWorkspace
	};
	const harnessAuth = await prepareCompactionHarnessAuth({
		...params,
		provider,
		metadataProvider: runtimeProvider,
		modelId,
		model,
		reusableRuntimeAuthPlan,
		agentDir,
		workspaceDir: resolvedWorkspace,
		authProfileId,
		runtimePolicyAgentId,
		runtimePolicySessionKey,
		agentHarnessId: boundHarnessRuntime,
		agentHarnessRuntimeOverride: selectedHarnessRuntimeOverride
	});
	if (!harnessAuth.ok) {
		params.abortSignal?.throwIfAborted();
		return {
			ok: false,
			result: fail(formatErrorMessage(harnessAuth.error), harnessAuth.error)
		};
	}
	const { runtimeAuthProfileStore, runtimeAuthPreparation, selectedPreparedHarness, providerUsesProfileScopedModelMetadata } = harnessAuth;
	const preparedHarnessRuntime = selectedPreparedHarness.id;
	const resolvePreparedModel = ({ config, authProfileId: profileId, authProfileMode: resolvedAuthProfileMode }) => resolveModelAsync(runtimeProvider, modelId, agentDir, config, {
		abortSignal: params.abortSignal,
		...modelResolutionOptions,
		modelIdSource: params.requestedRouteResolution === "resolved" ? "selected" : "input",
		skipAgentDiscovery: true,
		allowBundledStaticCatalogFallback: true,
		authProfileId: profileId,
		authProfileMode: resolvedAuthProfileMode
	});
	const materializeAuthAttemptModel = async (materializeParams) => await materializePreparedRuntimeModel({
		plan: materializeParams.plan,
		provider,
		modelId,
		config: params.config,
		workspaceDir: resolvedWorkspace,
		metadataSnapshot: preparedModelRuntime.metadataSnapshot,
		model: materializeParams.model,
		forceResolve: materializeParams.forceResolve,
		resolveModel: resolvePreparedModel
	}) ?? materializeParams.model;
	const resolveRuntimeAuthAttempt = () => resolvePreparedRuntimeAuthAttempts({
		attempts: runtimeAuthPreparation.attempts,
		store: runtimeAuthProfileStore,
		modelId,
		model,
		materializeModel: materializeAuthAttemptModel,
		forceCredentialScopedDirectModelResolve: providerUsesProfileScopedModelMetadata,
		resolveAuth: async ({ attempt: preparedAttempt, model: attemptModel }) => await resolvePreparedRuntimeModelAuth({
			plan: preparedAttempt.plan,
			model: attemptModel,
			cfg: params.config,
			store: runtimeAuthProfileStore,
			agentDir,
			workspaceDir: resolvedWorkspace,
			...preparedAttempt.allowAuthProfileFallback !== void 0 ? { allowAuthProfileFallback: preparedAttempt.allowAuthProfileFallback } : {},
			secretSentinels: true
		}),
		errorMessage: `Prepared compaction auth attempts could not be resolved for ${provider}/${modelId}.`
	});
	let resolvedAuthAttempt;
	try {
		resolvedAuthAttempt = await resolveRuntimeAuthAttempt();
		params.abortSignal?.throwIfAborted();
	} catch (err) {
		return {
			ok: false,
			result: fail(formatErrorMessage(err), err)
		};
	}
	let runtimeModel = resolvedAuthAttempt.model;
	const apiKeyInfo = resolvedAuthAttempt.auth;
	const resolvedRuntimeAuthPlan = resolvedAuthAttempt.plan;
	let hasRuntimeAuthExchange = false;
	try {
		if (!apiKeyInfo.apiKey) {
			if (apiKeyInfo.mode !== "aws-sdk") throw new MissingProviderAuthError(runtimeModel.provider, apiKeyInfo);
		} else {
			const runtimeAuth = await prepareProviderRuntimeAuth({
				provider: runtimeModel.provider,
				config: params.config,
				workspaceDir: resolvedWorkspace,
				env: process.env,
				context: {
					config: params.config,
					agentDir,
					workspaceDir: resolvedWorkspace,
					env: process.env,
					provider: runtimeModel.provider,
					modelId,
					model: runtimeModel,
					apiKey: unwrapSecretSentinelsForProviderEgress(apiKeyInfo.apiKey, "provider runtime auth exchange"),
					authMode: apiKeyInfo.mode,
					profileId: apiKeyInfo.profileId
				}
			});
			params.abortSignal?.throwIfAborted();
			const preparedAuth = protectPreparedProviderRuntimeAuth({
				provider: runtimeModel.provider,
				preparedAuth: runtimeAuth
			});
			runtimeModel = applyPreparedRuntimeAuthToModel(runtimeModel, preparedAuth);
			const runtimeApiKey = preparedAuth?.apiKey ?? apiKeyInfo.apiKey;
			hasRuntimeAuthExchange = Boolean(preparedAuth?.apiKey);
			if (!runtimeApiKey) throw new Error(`Provider "${runtimeModel.provider}" runtime auth returned no apiKey.`);
			authStorage.setRuntimeApiKey(runtimeModel.provider, runtimeApiKey);
		}
	} catch (err) {
		return {
			ok: false,
			result: fail(formatErrorMessage(err), err)
		};
	}
	const thinkingCompat = projectModelThinkingCompat(runtimeModel.compat);
	const thinkingCatalogEntry = {
		provider: runtimeModel.provider,
		id: runtimeModel.id,
		api: runtimeModel.api,
		reasoning: runtimeModel.reasoning,
		...runtimeModel.thinkingLevelMap ? { thinkingLevelMap: runtimeModel.thinkingLevelMap } : {},
		params: runtimeModel.params,
		...thinkingCompat ? { compat: thinkingCompat } : {}
	};
	const thinkLevel = resolveEmbeddedCompactionThinkingLevel({
		config: params.config,
		provider: runtimeModel.provider,
		modelId: runtimeModel.id,
		inheritedLevel: params.thinkLevel,
		compactionThinkingDefault: runtimeModel.compactionThinkingDefault,
		catalog: [thinkingCatalogEntry],
		agentId: runtimePolicyAgentId,
		sessionKey: runtimePolicySessionKey,
		agentRuntime: preparedHarnessRuntime
	});
	await fs.mkdir(resolvedWorkspace, { recursive: true });
	const sessionKey = params.sessionKey?.trim() || params.sessionId;
	const sandboxSessionKey = params.sandboxSessionKey?.trim() || sessionKey;
	const sandboxAgentId = params.sandboxAgentId ?? (sandboxSessionKey === sessionKey ? earlyAgentIds.sessionAgentId : void 0);
	const placementParams = params;
	const sandbox = placementParams.sandbox === void 0 ? await resolveSandboxContext({
		config: params.config,
		agentId: sandboxAgentId,
		execOverrides: params.execOverrides,
		sessionKey: sandboxSessionKey,
		workspaceDir: resolvedWorkspace
	}) : placementParams.sandbox;
	if (params.requireWritableSandbox && sandbox?.enabled && sandbox.workspaceAccess !== "rw") throw new Error("sandbox workspace is not read-write; collection review skipped");
	const effectiveWorkspace = sandbox?.enabled ? sandbox.workspaceAccess === "rw" ? resolvedWorkspace : sandbox.workspaceDir : resolvedWorkspace;
	const requestedCwd = params.cwd ? resolveUserPath(params.cwd) : void 0;
	if (sandbox?.enabled && requestedCwd && requestedCwd !== resolvedWorkspace) throw new Error("cwd override is not supported for sandboxed embedded compaction runs; omit cwd or use the agent workspace as cwd");
	const effectiveCwd = sandbox?.enabled ? effectiveWorkspace : requestedCwd ?? effectiveWorkspace;
	await fs.mkdir(effectiveWorkspace, { recursive: true });
	const isSqliteSessionTranscript = true;
	const { sessionAgentId: effectiveSkillAgentId } = earlyAgentIds;
	return {
		ok: true,
		value: {
			params,
			startedAt,
			diagId,
			trigger,
			attempt,
			maxAttempts,
			runId,
			compactionModelCallTrace,
			diagnosticCompactionRunId,
			nextDiagnosticModelCallId: () => `${diagnosticCompactionRunId}:model:${diagnosticModelCallSeq += 1}`,
			earlyAgentIds,
			agentDir,
			provider,
			contextConfigProvider,
			modelId,
			preparedHarnessRuntime,
			thinkLevel,
			attemptedThinking,
			fail,
			authStorage,
			modelRegistry,
			runtimeModel,
			apiKeyInfo,
			resolvedRuntimeAuthPlan,
			hasRuntimeAuthExchange,
			resolvedWorkspace,
			sandboxSessionKey,
			sandboxAgentId,
			sandbox,
			effectiveWorkspace,
			effectiveCwd,
			isSqliteSessionTranscript,
			effectiveSkillAgentId
		}
	};
}
//#endregion
//#region src/agents/embedded-agent-runner/prepared-compaction-runtime.ts
/**
* Builds the skills, tools, capability profile, and system prompt used by one
* prepared direct compaction attempt.
*/
async function buildPreparedCompactionRuntime(prepared, onCleanupReady) {
	const { params, runId, agentDir, provider, contextConfigProvider, modelId, preparedHarnessRuntime, thinkLevel, runtimeModel, apiKeyInfo, resolvedRuntimeAuthPlan, hasRuntimeAuthExchange, resolvedWorkspace, sandboxSessionKey, sandboxAgentId, sandbox, effectiveWorkspace, effectiveCwd, effectiveSkillAgentId: sessionAgentId } = prepared;
	const mode = params.execOverrides?.mode ? SESSION_PERMISSION_BY_EXEC_MODE[params.execOverrides.mode] : params.permissionMode ?? params.sessionEntry?.permissionMode;
	const root = params.sessionRoot ?? params.sessionEntry?.sessionRoot;
	const sessionPermissionPolicy = mode ? {
		mode,
		root: root ?? await fs.realpath(resolvedWorkspace)
	} : void 0;
	const execOverrides = sessionPermissionPolicy ? {
		...params.execOverrides,
		mode: resolveSessionPermissionExecMode(sessionPermissionPolicy)
	} : params.execOverrides;
	let restoreSkillEnv;
	let bundleMcpRuntime;
	let bundleLspRuntime;
	let toolRuntimesDisposed = false;
	let skillEnvironmentRestored = false;
	const disposeToolRuntimes = async () => {
		if (toolRuntimesDisposed) return;
		toolRuntimesDisposed = true;
		try {
			await bundleMcpRuntime?.dispose();
		} catch {}
		try {
			await bundleLspRuntime?.dispose();
		} catch {}
	};
	const restoreSkillEnvironment = () => {
		if (skillEnvironmentRestored) return;
		skillEnvironmentRestored = true;
		restoreSkillEnv?.();
	};
	onCleanupReady({
		disposeToolRuntimes,
		restoreSkillEnvironment
	});
	try {
		const preparedSkills = await prepareEmbeddedSkills({
			assertCurrent: () => params.abortSignal?.throwIfAborted(),
			attempt: {
				config: params.config,
				bootstrapWorkspaceDir: params.bootstrapWorkspaceDir,
				skillsSnapshot: params.skillsSnapshot
			},
			effectiveWorkspace,
			sandbox,
			sessionAgentId,
			includeCodeModeSkills: false
		});
		restoreSkillEnv = preparedSkills.restoreSkillEnv;
		const { skillsSnapshotForRun, skillReadResources, skillUsagePaths, skillsPrompt } = preparedSkills;
		const sessionLabel = params.sessionKey ?? params.sessionId;
		const resolvedMessageProvider = params.messageChannel ?? params.messageProvider;
		const { bootstrapFiles, contextFiles } = resolveContextInjectionMode(params.config, sessionAgentId) === "never" ? {
			bootstrapFiles: [],
			contextFiles: []
		} : await resolveBootstrapContextForRun({
			workspaceDir: effectiveWorkspace,
			config: params.config,
			sessionKey: params.sessionKey,
			sessionId: params.sessionId,
			chatType: params.chatType,
			agentId: sessionAgentId,
			warn: makeBootstrapWarn({
				sessionLabel,
				warn: (message) => log.warn(message)
			})
		});
		const bootstrapInjectionStats = buildBootstrapInjectionStats({
			bootstrapFiles,
			injectedFiles: contextFiles
		});
		const bootstrapBudget = buildBootstrapBudgetState({
			config: params.config,
			agentId: sessionAgentId,
			files: bootstrapInjectionStats
		});
		const bootstrapTruncationNotice = buildBootstrapPromptWarningNotice(bootstrapBudget.bootstrapPromptWarning.lines);
		const runtimeModelWithContext = runtimeModel;
		const contextTokenBudget = resolveCompactionContextTokenBudget({
			config: params.config,
			provider: contextConfigProvider,
			modelId,
			model: runtimeModelWithContext,
			agentId: sessionAgentId,
			requestedTokenBudget: params.contextTokenBudget,
			fallbackTokenBudget: params.tokenBudget
		});
		const modelWithAuth = applyAuthHeaderOverride(applyLocalNoAuthHeaderOverride(contextTokenBudget < (runtimeModelWithContext.contextWindow ?? Infinity) ? {
			...runtimeModelWithContext,
			contextWindow: contextTokenBudget
		} : runtimeModelWithContext, apiKeyInfo), hasRuntimeAuthExchange ? null : apiKeyInfo, params.config);
		const providerRuntimeHandle = resolvePreparedProviderRuntimeHandle({
			provider,
			modelId,
			config: params.config,
			workspaceDir: effectiveWorkspace,
			providerRuntimeHandle: params.runtimePlan?.providerRuntimeHandle,
			metadataSnapshot: params.preparedModelRuntime.metadataSnapshot
		});
		const effectiveModel = attachModelProviderRuntimePluginHandle(modelWithAuth, providerRuntimeHandle);
		const reuseFullRuntimePlan = params.runtimePlan?.auth === resolvedRuntimeAuthPlan;
		const preparedRuntimePlan = (reuseFullRuntimePlan ? params.runtimePlan : void 0) ?? buildAgentRuntimePlan({
			provider,
			modelId,
			model: effectiveModel,
			modelApi: effectiveModel.api,
			providerRuntimeHandle,
			harnessId: preparedHarnessRuntime,
			harnessRuntime: preparedHarnessRuntime,
			authProfileMode: resolvedRuntimeAuthPlan.selectedAuthMode,
			sessionAuthProfileId: resolvedRuntimeAuthPlan.forwardedAuthProfileId,
			sessionAuthProfileSource: resolvedRuntimeAuthPlan.forwardedAuthProfileSource,
			sessionAuthProfileCandidateIds: resolvedRuntimeAuthPlan.forwardedAuthProfileCandidateIds,
			modelRoute: resolvedRuntimeAuthPlan.modelRoute,
			config: params.config,
			workspaceDir: effectiveWorkspace,
			agentDir,
			agentId: sessionAgentId,
			thinkingLevel: mapThinkingLevelForProvider(thinkLevel)
		});
		const runtimePlan = reuseFullRuntimePlan ? preparedRuntimePlan : {
			...preparedRuntimePlan,
			auth: resolvedRuntimeAuthPlan
		};
		const runAbortController = new AbortController();
		const spawnWorkspaceDir = effectiveCwd !== effectiveWorkspace ? resolvedWorkspace : resolveAttemptSpawnWorkspaceDir({
			sandbox,
			resolvedWorkspace
		});
		const conversationContext = {
			config: params.config,
			sessionKey: sandboxSessionKey,
			runSessionKey: params.sessionKey?.trim() || params.sessionId,
			sessionId: params.sessionId,
			runId: params.runId,
			agentDir,
			agentAccountId: params.agentAccountId,
			messageProvider: resolvedMessageProvider,
			chatType: params.chatType,
			groupId: params.groupId,
			groupChannel: params.groupChannel,
			groupSpace: params.groupSpace,
			spawnedBy: params.spawnedBy,
			senderId: params.senderId,
			senderName: params.senderName,
			senderUsername: params.senderUsername,
			senderE164: params.senderE164,
			modelProvider: effectiveModel.provider,
			modelId,
			modelApi: effectiveModel.api,
			modelContextWindowTokens: contextTokenBudget,
			workspaceDir: effectiveWorkspace,
			cwd: effectiveCwd,
			spawnWorkspaceDir,
			skillsSnapshot: skillsSnapshotForRun
		};
		const runtimeCapabilityProfile = resolveConversationCapabilityProfile({
			...conversationContext,
			agentId: sandboxAgentId,
			conversationToolPolicy: params.conversationToolPolicy,
			senderIsOwner: params.senderIsOwner,
			sandboxToolPolicy: sandbox?.tools,
			inputProvenance: params.inputProvenance,
			trustedInternalHandoff: params.trustedInternalHandoff,
			pluginMetadataSnapshot: params.preparedModelRuntime.metadataSnapshot
		});
		const toolsEnabled = supportsModelTools(effectiveModel);
		const skillInstructionDeliveryCache = createSkillInstructionDeliveryCache();
		const toolsRaw = toolsEnabled ? createOpenClawCodingToolsInternal({
			...conversationContext,
			agentId: sessionAgentId,
			exec: {
				...execOverrides,
				config: params.config,
				elevated: params.bashElevated
			},
			sandbox,
			sessionPermissionPolicy,
			requireWorkspaceOnly: params.requireWorkspaceOnly,
			clientCaps: params.clientCaps,
			pinnedWidgetAuthoring: params.pinnedWidgetAuthoring,
			oneShotCliRun: params.oneShotCliRun,
			allowGatewaySubagentBinding: params.allowGatewaySubagentBinding,
			webSearchEnabled: params.toolOverrides?.webSearch !== false,
			abortSignal: runAbortController.signal,
			sourceReplyDeliveryMode: params.sourceReplyDeliveryMode,
			modelHasVision: effectiveModel.input?.includes("image") ?? false,
			modelCompat: extractModelCompat(effectiveModel),
			skillUsagePaths,
			skillInstructionDeliveryCache,
			conversationCapabilityProfile: runtimeCapabilityProfile,
			preparedModelRuntime: params.preparedModelRuntime,
			modelAuthMode: resolveModelAuthMode(effectiveModel.provider, params.config, void 0, { workspaceDir: effectiveWorkspace })
		}, skillReadResources) : [];
		const runtimePlanModelContext = {
			workspaceDir: effectiveWorkspace,
			modelApi: effectiveModel.api,
			model: effectiveModel
		};
		const normalizableToolProjection = filterProviderNormalizableTools(toolsEnabled ? toolsRaw : []);
		logRuntimeToolSchemaQuarantine({
			diagnostics: normalizableToolProjection.diagnostics,
			tools: toolsEnabled ? toolsRaw : [],
			runId,
			agentId: sessionAgentId,
			sessionKey: params.sessionKey,
			sessionId: params.sessionId
		});
		const tools = runtimePlan.tools.normalize([...normalizableToolProjection.tools], runtimePlanModelContext);
		bundleMcpRuntime = toolsEnabled ? await createBundleMcpToolRuntime({
			workspaceDir: effectiveWorkspace,
			cfg: params.config,
			reservedToolNames: tools.map((tool) => tool.name)
		}) : void 0;
		bundleLspRuntime = toolsEnabled ? await createBundleLspToolRuntime({
			workspaceDir: effectiveWorkspace,
			cfg: params.config,
			abortSignal: params.abortSignal,
			reservedToolNames: [...tools.map((tool) => tool.name), ...bundleMcpRuntime?.tools.map((tool) => tool.name) ?? []]
		}) : void 0;
		const filteredBundledTools = applyFinalEffectiveToolPolicy({
			bundledTools: [...bundleMcpRuntime?.tools ?? [], ...bundleLspRuntime?.tools ?? []],
			config: params.config,
			conversationCapabilityProfile: runtimeCapabilityProfile,
			warn: (message) => log.warn(message)
		});
		const normalizableBundledToolProjection = filterProviderNormalizableTools(filteredBundledTools);
		if (normalizableBundledToolProjection.diagnostics.length > 0) logRuntimeToolSchemaQuarantine({
			diagnostics: normalizableBundledToolProjection.diagnostics,
			tools: filteredBundledTools,
			runId,
			agentId: sessionAgentId,
			sessionKey: params.sessionKey,
			sessionId: params.sessionId
		});
		const normalizedBundledTools = filteredBundledTools.length > 0 ? runtimePlan.tools.normalize([...normalizableBundledToolProjection.tools], runtimePlanModelContext) : filteredBundledTools;
		const projectedEffectiveTools = [...tools, ...normalizedBundledTools];
		const toolSchemaProjection = filterRuntimeCompatibleTools(projectedEffectiveTools);
		logRuntimeToolSchemaQuarantine({
			diagnostics: toolSchemaProjection.diagnostics,
			tools: projectedEffectiveTools,
			runId,
			agentId: sessionAgentId,
			sessionKey: params.sessionKey,
			sessionId: params.sessionId
		});
		const effectiveTools = [...toolSchemaProjection.tools];
		const allowedToolNames = collectAllowedToolNames({ tools: effectiveTools });
		const promptPolicyRestricted = toolPolicyRestrictsTools({ allow: params.toolsAllow });
		const promptTools = applyEmbeddedAttemptToolsAllow(effectiveTools, params.toolsAllow, { toolMeta: (tool) => getPluginToolMeta(tool) });
		const promptAllowedToolNames = collectAllowedToolNames({ tools: promptTools });
		runtimePlan.tools.logDiagnostics(effectiveTools, runtimePlanModelContext);
		const machineName = await getMachineDisplayName();
		const runtimeChannel = normalizeMessageChannel(params.messageChannel ?? params.messageProvider);
		const runtimeCapabilities = collectRuntimeChannelCapabilities({
			cfg: params.config,
			channel: runtimeChannel,
			accountId: params.agentAccountId
		});
		const reactionGuidance = runtimeChannel && params.config ? resolveChannelReactionGuidance({
			cfg: params.config,
			channel: runtimeChannel,
			accountId: params.agentAccountId
		}) : void 0;
		const messageToolHints = runtimeChannel ? resolveChannelMessageToolHints({
			cfg: params.config,
			channel: runtimeChannel,
			accountId: params.agentAccountId
		}) : void 0;
		await prepareActiveNodeContext();
		const runtimeInfo = {
			agentId: sessionAgentId,
			agentName: params.config ? resolveRuntimeAgentName(params.config, sessionAgentId) : void 0,
			sessionKey: params.sessionKey,
			host: machineName,
			os: resolveRuntimeOsLabel(),
			arch: os.arch(),
			node: process.version,
			model: `${provider}/${modelId}`,
			shell: detectRuntimeShell(),
			channel: runtimeChannel,
			chatType: params.chatType,
			capabilities: runtimeCapabilities,
			activeProcessSessions: listActiveProcessSessionReferences({ scopeKey: resolveProcessToolScopeKey({
				sessionKey: params.sessionKey,
				sessionId: params.sessionId,
				agentId: sessionAgentId
			}) }),
			activeNode: formatActiveNodeContextLabel(getCurrentActiveNodeContext())
		};
		const sandboxInfoExecPolicy = resolveEmbeddedSandboxInfoExecPolicy({
			config: params.config,
			agentId: sessionAgentId,
			sessionKey: params.sessionKey,
			permissionMode: sessionPermissionPolicy?.mode,
			sandboxAvailable: sandbox?.enabled === true,
			execOverrides
		});
		const sandboxInfo = buildEmbeddedSandboxInfo(sandbox, params.bashElevated, sandboxInfoExecPolicy);
		const reasoningTagHint = isReasoningTagProvider(provider, {
			config: params.config,
			workspaceDir: effectiveWorkspace,
			env: process.env,
			modelId,
			modelApi: effectiveModel.api,
			model: effectiveModel
		});
		const userTimezone = resolveUserTimezone(params.config?.agents?.defaults?.userTimezone);
		const userDate = formatDateStamp(Date.now(), userTimezone);
		const promptSurface = resolveAgentPromptSurfaceForSessionKey(params.sessionKey);
		const promptMode = promptPolicyRestricted ? "minimal" : resolvePromptModeForSession(params.sessionKey);
		const nativeCommandGuidanceLines = listRegisteredPluginAgentPromptGuidance({ surface: promptSurface });
		const openClawReferences = await resolveOpenClawReferencePaths({
			workspaceDir: effectiveWorkspace,
			argv1: process.argv[1],
			cwd: effectiveCwd,
			moduleUrl: import.meta.url
		});
		const promptContributionContext = {
			config: params.config,
			agentDir,
			workspaceDir: effectiveWorkspace,
			provider,
			modelId,
			promptMode,
			runtimeChannel,
			runtimeCapabilities,
			agentId: sessionAgentId
		};
		const promptContribution = runtimePlan.prompt.resolveSystemPromptContribution(promptContributionContext);
		const preparedMemoryPrompt = await prepareAgentMemoryPrompt({
			enabled: promptMode === "full",
			toolNames: promptTools.map((tool) => tool.name),
			citationsMode: params.config?.memory?.citations,
			agentId: runtimeInfo.agentId,
			agentSessionKey: runtimeInfo.sessionKey,
			sandboxed: sandboxInfo?.enabled === true
		});
		const preparedWatchedSessions = prepareWatchedSessionsPrompt({
			enabled: promptMode === "full",
			config: params.config,
			sessionKey: params.sessionKey,
			sandboxed: sandboxInfo?.enabled === true,
			toolNames: promptTools.map((tool) => tool.name),
			capabilityToolNames: promptAllowedToolNames
		});
		const activeProjectKeys = params.preparedModelRuntime?.activeProjectKeys ?? [];
		const buildSystemPromptText = () => {
			const builtSystemPrompt = buildEmbeddedSystemPrompt({
				config: params.config,
				preparedModelRuntime: params.preparedModelRuntime,
				agentId: sessionAgentId,
				workspaceDir: effectiveWorkspace,
				runtimeCwd: effectiveCwd,
				reasoningLevel: params.reasoningLevel ?? "off",
				extraSystemPrompt: params.extraSystemPrompt,
				ownerNumbers: params.ownerNumbers,
				reasoningTagHint,
				skillsPrompt: promptPolicyRestricted ? void 0 : skillsPrompt,
				docsPath: openClawReferences.docsPath ?? void 0,
				sourcePath: openClawReferences.sourcePath ?? void 0,
				promptMode,
				promptSurface,
				sourceReplyDeliveryMode: params.sourceReplyDeliveryMode,
				acpEnabled: isAcpRuntimeSpawnAvailable({
					config: params.config,
					sandboxed: sandboxInfo?.enabled === true
				}),
				runtimeInfo,
				reactionGuidance,
				messageToolHints,
				sandboxInfo,
				tools: promptTools,
				userTimezone,
				userDate,
				contextFiles,
				bootstrapTruncationNotice,
				activeProjectKeys,
				preparedMemoryPrompt,
				preparedWatchedSessions,
				promptContribution,
				nativeCommandGuidanceLines
			});
			return transformProviderSystemPrompt({
				provider,
				config: params.config,
				workspaceDir: effectiveWorkspace,
				context: {
					config: params.config,
					agentDir,
					workspaceDir: effectiveWorkspace,
					provider,
					modelId,
					promptMode,
					runtimeChannel,
					runtimeCapabilities,
					agentId: sessionAgentId,
					systemPrompt: builtSystemPrompt
				}
			});
		};
		return {
			...prepared,
			contextTokenBudget,
			effectiveModel,
			runtimePlan,
			runtimePlanModelContext,
			runAbortController,
			effectiveTools,
			allowedToolNames,
			buildSystemPromptText,
			resolvedMessageProvider,
			sessionAgentId
		};
	} catch (err) {
		restoreSkillEnvironment();
		throw err;
	}
}
//#endregion
//#region src/agents/embedded-agent-runner/direct-compaction.ts
/** Coordinates one direct compaction attempt through explicit lifecycle phases. */
async function compactEmbeddedAgentSessionDirectOnce(params) {
	const callerResult = createDeferredCore();
	const trackOwner = captureAsyncWorkTracker();
	const parentSignal = getAsyncWorkSignal();
	const cancellationSignal = params.abortSignal && parentSignal ? AbortSignal.any([params.abortSignal, parentSignal]) : params.abortSignal ?? parentSignal;
	const work = new AsyncWorkScope();
	const context = work.run(() => AsyncLocalStorage.snapshot());
	const cleanupWork = new AsyncWorkScope();
	const cleanupContext = cleanupWork.run(() => AsyncLocalStorage.snapshot());
	let cleanup;
	const runAttempt = async () => {
		const preparation = await prepareDirectCompactionAttempt({
			...params,
			abortSignal: work.signal
		});
		if (!preparation.ok) return preparation.result;
		try {
			return await executePreparedCompactionSession(await buildPreparedCompactionRuntime(preparation.value, (preparedCleanup) => {
				cleanup = preparedCleanup;
			}));
		} catch (err) {
			if (hasModelFallbackStop(err)) throw err;
			return preparation.value.fail(formatErrorMessage(err), err);
		} finally {
			cleanup?.restoreSkillEnvironment();
		}
	};
	trackOwner(async () => {
		const closeWork = () => {
			context(() => work.beginClose(cancellationSignal?.reason));
			cleanupContext(() => cleanupWork.beginClose(cancellationSignal?.reason));
		};
		cancellationSignal?.addEventListener("abort", closeWork, { once: true });
		if (cancellationSignal?.aborted) closeWork();
		try {
			callerResult.resolve(await work.track(runAttempt));
		} catch (error) {
			callerResult.reject(error);
		} finally {
			try {
				await AsyncWorkScope.runWhenAllIdle(() => [work], () => context(() => work.beginClose()));
				await AsyncWorkScope.runWhenAllIdle(() => [work], () => cleanupWork.track(() => cleanupContext(() => cleanup?.disposeToolRuntimes())));
			} finally {
				try {
					await AsyncWorkScope.runWhenAllIdle(() => [work, cleanupWork], () => cleanupContext(() => cleanupWork.beginClose()));
					await AsyncWorkScope.runWhenAllIdle(() => [work, cleanupWork], () => Promise.all([context(() => work.drain()), cleanupContext(() => cleanupWork.drain())]));
				} finally {
					cancellationSignal?.removeEventListener("abort", closeWork);
				}
			}
		}
	}).catch(callerResult.reject);
	return await callerResult.promise;
}
//#endregion
//#region src/agents/embedded-agent-runner/transcript-byte-preflight-authority.ts
const claims = resolveGlobalSingleton(Symbol.for("openclaw.transcriptBytePreflightClaims"), () => /* @__PURE__ */ new WeakMap());
function resolveTranscriptBytePreflightAuthority(harness) {
	try {
		return resolveCodexAgentHarnessNativeCompaction(harness) ? harness : void 0;
	} catch {
		return;
	}
}
function setTranscriptBytePreflightClaim(runtimeContext, authority, withCompactionPersistence) {
	if (!runtimeContext || !authority) return () => {};
	const target = runtimeContext.sessionTarget;
	const claim = {
		authority,
		...withCompactionPersistence ? { withCompactionPersistence } : {},
		sessionTarget: {
			agentId: target?.agentId,
			sessionId: target?.sessionId,
			sessionKey: target?.sessionKey,
			storePath: target?.storePath
		}
	};
	claims.set(runtimeContext, claim);
	return () => {
		if (claims.get(runtimeContext) === claim) claims.delete(runtimeContext);
	};
}
function consumeTranscriptBytePreflightClaim(params, sessionTarget, lockedHarnessRuntime) {
	const runtimeContext = params.contextEngineRuntimeContext;
	const claim = runtimeContext ? claims.get(runtimeContext) : void 0;
	if (!runtimeContext || !claim) return;
	const { authority, sessionTarget: expected } = claim;
	const active = resolveTranscriptBytePreflightAuthority(authority);
	claims.delete(runtimeContext);
	return (lockedHarnessRuntime ?? params.agentHarnessId) === authority.id && params.preflightRequired === true && params.preflightCompactionTrigger === "transcript_bytes" && params.trigger === "budget" && expected?.agentId === sessionTarget.agentId && expected.sessionId === sessionTarget.sessionId && expected.sessionKey === sessionTarget.sessionKey && expected.storePath === sessionTarget.storePath && active === authority ? claim : void 0;
}
//#endregion
//#region src/agents/embedded-agent-runner/compact.ts
/**
* Public facade and fallback coordinator for embedded-agent compaction.
*/
function lockedHarnessCompactionFailure(runtime) {
	return {
		ok: false,
		compacted: false,
		reason: `Model selection is locked to native agent harness "${runtime}"; generic compaction is unavailable.`,
		failure: { reason: "model_selection_locked" }
	};
}
async function compactNativeCliSession(params) {
	const runtime = normalizeOptionalAgentRuntimeId(params.runtime);
	if (!runtime || params.compactParams.trigger !== "manual") return;
	const backend = resolveCliBackendConfig(runtime, params.compactParams.config, { agentId: params.compactParams.agentId });
	if (!backend?.ownsNativeCompaction) return;
	const manualCompaction = backend.manualCompaction;
	if (!manualCompaction) return {
		ok: false,
		compacted: false,
		reason: `CLI backend "${runtime}" owns compaction but does not support manual compaction.`
	};
	const cliSessionBinding = params.compactParams.cliSessionBinding;
	const cliSessionId = (cliSessionBinding?.sessionId ?? params.compactParams.cliSessionId)?.trim();
	if (!cliSessionId) return {
		ok: false,
		compacted: false,
		reason: `CLI backend "${runtime}" cannot manually compact without a resumable native session.`
	};
	const { runCliAgent } = await import("./cli-runner-Cdn3Hc4D.mjs");
	const runId = `${params.compactParams.runId ?? params.compactParams.sessionId}:native-compact`;
	const sessionAgentId = resolveSessionAgentIds({
		sessionKey: params.compactParams.sessionKey,
		config: params.compactParams.config,
		agentId: params.compactParams.agentId
	}).sessionAgentId;
	const preparedRunAdmission = prepareSystemAgentRunAdmission(params.compactParams.config ?? {}, runId, sessionAgentId, "agents.native-compaction");
	try {
		const runControlOperation = async () => {
			await runCliAgent({
				preparedRunAdmission,
				sessionId: params.compactParams.sessionId,
				sessionKey: params.compactParams.sessionKey,
				sessionFile: params.compactParams.sessionFile,
				agentId: params.compactParams.agentId,
				workspaceDir: params.compactParams.workspaceDir,
				cwd: params.compactParams.cwd,
				agentDir: params.compactParams.agentDir,
				config: params.compactParams.config,
				prompt: manualCompaction.buildPrompt(params.compactParams.customInstructions),
				provider: runtime,
				modelProvider: params.compactParams.provider,
				model: params.compactParams.model,
				thinkLevel: params.compactParams.thinkLevel,
				timeoutMs: resolveCompactionTimeoutMs(params.compactParams.config),
				runId,
				cliSessionId,
				...cliSessionBinding ? { cliSessionBinding } : {},
				...cliSessionBinding?.authProfileId ? { authProfileId: cliSessionBinding.authProfileId } : params.compactParams.authProfileId ? { authProfileId: params.compactParams.authProfileId } : {},
				...params.compactParams.sessionEntry ? { sessionEntry: params.compactParams.sessionEntry } : {},
				contextWindow: params.compactParams.sessionEntry?.contextWindow,
				trigger: "manual",
				controlOperation: "compact",
				disableCliLiveSession: true,
				cleanupCliLiveSessionOnRunEnd: true,
				allowEmptyAssistantReplyAsSilent: true,
				abortSignal: params.compactParams.abortSignal
			});
		};
		if (params.runControlOperation) await params.runControlOperation(runControlOperation);
		else await runControlOperation();
	} catch (err) {
		const signal = params.compactParams.abortSignal;
		if (signal?.aborted && (isAbortError(err) || err === signal.reason)) throw err;
		return {
			ok: false,
			compacted: false,
			reason: `CLI backend "${runtime}" failed to compact its native session: ${formatErrorMessage(err)}`
		};
	} finally {
		preparedRunAdmission.close();
	}
	return {
		ok: true,
		compacted: true,
		reason: `CLI backend "${runtime}" compacted its native session.`
	};
}
function hasExplicitCompactionModel(params) {
	return Boolean(params.config?.agents?.defaults?.compaction?.model?.trim());
}
function resolveCompactionFallbacksOverride(params) {
	if (params.modelSelectionLocked) return [];
	return params.modelFallbacksOverride ?? resolveRunModelFallbacksOverride({
		cfg: params.config,
		sessionKey: params.sessionKey
	});
}
function hasCompactionModelFallbackCandidates(params) {
	const fallbacksOverride = resolveCompactionFallbacksOverride(params);
	const defaultFallbacks = resolveAgentModelFallbackValues(params.config?.agents?.defaults?.model);
	return (fallbacksOverride ?? defaultFallbacks).length > 0;
}
function classifyCompactionFallbackResult(result, provider, model) {
	if (result.ok) return null;
	const reason = result.reason?.trim();
	if (!reason) return null;
	const failureError = Object.assign(new Error(result.failure?.rawError ?? reason), {
		status: result.failure?.status,
		code: result.failure?.code
	});
	const failoverError = coerceToFailoverError(failureError, {
		provider,
		model
	});
	return failoverError ? { error: failoverError } : null;
}
function fallbackFailureToCompactionResult(err) {
	return {
		ok: false,
		compacted: false,
		reason: isFallbackSummaryError(err) ? err.message : formatErrorMessage(err)
	};
}
/**
* Core compaction logic without lane queueing.
* Use this when already inside a session/global lane to avoid deadlocks.
*/
async function compactEmbeddedAgentSessionDirect(paramsInput) {
	const paramsBase = applyAgentRunSessionTargetIdentity(paramsInput);
	const memoryTranscript = readCompactionAccountingRecorder(paramsBase.contextEngineRuntimeContext)?.memoryTranscript;
	memoryTranscript?.assertActive();
	const runSessionTarget = memoryTranscript?.sessionTarget ?? await resolveAgentRunSessionTarget({
		...paramsBase,
		missingSessionKey: "resolve-existing"
	});
	const entry = loadSessionEntryReadOnly({
		...runSessionTarget,
		readConsistency: "latest"
	});
	const lockedHarnessRuntime = resolveSessionPinnedHarnessId(entry);
	const transcriptBytePreflightClaim = consumeTranscriptBytePreflightClaim(paramsBase, runSessionTarget, lockedHarnessRuntime);
	const transcriptBytePreflightAuthority = transcriptBytePreflightClaim?.authority;
	const requestedParams = {
		...paramsBase,
		config: projectCodexHostTranscriptBytePreflightConfig(paramsBase.config, Boolean(transcriptBytePreflightAuthority)),
		sessionEntry: entry ? projectPublicSessionEntry(entry) : void 0,
		agentHarnessId: lockedHarnessRuntime ?? paramsBase.agentHarnessId,
		modelSelectionLocked: entry?.modelSelectionLocked ?? paramsBase.modelSelectionLocked,
		agentId: runSessionTarget.agentId,
		sessionId: runSessionTarget.sessionId,
		sessionKey: runSessionTarget.sessionKey,
		sessionTarget: {
			agentId: runSessionTarget.agentId,
			sessionId: runSessionTarget.sessionId,
			sessionKey: runSessionTarget.sessionKey,
			storePath: runSessionTarget.storePath,
			...paramsBase.sessionTarget?.threadId !== void 0 ? { threadId: paramsBase.sessionTarget.threadId } : {}
		},
		sessionFile: runSessionTarget.sessionKey
	};
	const requestedAgentIds = resolveSessionAgentIds({
		sessionKey: requestedParams.sessionKey,
		config: requestedParams.config,
		agentId: requestedParams.agentId
	});
	const requestedAgentDir = requestedParams.agentDir ?? resolveAgentDir(requestedParams.config ?? {}, requestedAgentIds.sessionAgentId);
	const requestedWorkspaceDir = resolveUserPath(requestedParams.workspaceDir);
	const canonicalWorkspaceDir = resolveUserPath(resolveAgentWorkspaceDir(requestedParams.config ?? {}, requestedAgentIds.sessionAgentId));
	const nativeCliResult = await compactNativeCliSession({
		runtime: resolveCompactionRuntimeSelection({
			...requestedParams,
			modelId: requestedParams.model,
			boundHarnessRuntime: requestedParams.agentHarnessId,
			preparedRuntimePlan: requestedParams.runtimePlan
		}).selectedHarnessRuntime,
		compactParams: {
			...requestedParams,
			agentDir: requestedAgentDir,
			workspaceDir: requestedWorkspaceDir
		}
	});
	if (nativeCliResult) return nativeCliResult;
	if (lockedHarnessRuntime && lockedHarnessRuntime !== "openclaw" && !transcriptBytePreflightAuthority) return lockedHarnessCompactionFailure(lockedHarnessRuntime);
	const callerResult = createDeferredCore();
	const trackOwner = captureAsyncWorkTracker();
	const parentSignal = getAsyncWorkSignal();
	const cancellationSignal = requestedParams.abortSignal && parentSignal ? AbortSignal.any([requestedParams.abortSignal, parentSignal]) : requestedParams.abortSignal ?? parentSignal;
	const work = new AsyncWorkScope();
	let context = work.run(() => AsyncLocalStorage.snapshot());
	let releasePreparedRuntime;
	const runPreparedCompaction = async () => {
		const preparedModelRuntimeLease = await runOutsidePluginRuntimeGenerationScope(() => acquireAgentRunPreparedModelRuntime({
			config: requestedParams.config ?? {},
			agentId: requestedAgentIds.sessionAgentId,
			agentDir: requestedAgentDir,
			workspaceDir: requestedWorkspaceDir,
			preserveWorkspaceDirOnRefresh: requestedWorkspaceDir !== canonicalWorkspaceDir,
			...requestedParams.allowGatewaySubagentBinding ? { allowGatewaySubagentBinding: true } : {}
		}, {
			abortSignal: requestedParams.abortSignal,
			deriveRuntimePluginSelections: ({ config: admittedConfig, metadataSnapshot }) => {
				const config = projectCodexHostTranscriptBytePreflightConfig(admittedConfig, Boolean(transcriptBytePreflightAuthority));
				const selected = resolveCompactionRuntimeSelection({
					...requestedParams,
					config,
					modelId: requestedParams.model,
					boundHarnessRuntime: requestedParams.agentHarnessId,
					preparedRuntimePlan: requestedParams.runtimePlan,
					manifestPlugins: metadataSnapshot,
					allowPluginNormalization: false
				});
				const pluginPlanCandidates = resolveModelCandidateChain({
					cfg: config,
					agentId: requestedAgentIds.sessionAgentId,
					manifestPlugins: metadataSnapshot,
					allowPluginNormalization: false,
					provider: selected.provider,
					model: selected.modelId,
					requestedRouteResolution: "resolved",
					fallbacksOverride: transcriptBytePreflightAuthority ? [] : resolveCompactionFallbacksOverride({
						...requestedParams,
						config
					})
				});
				return [{
					provider: selected.provider,
					modelId: selected.modelId,
					...selected.selectedHarnessRuntime ? { runtime: selected.selectedHarnessRuntime } : {},
					agentId: requestedAgentIds.sessionAgentId
				}, ...pluginPlanCandidates.filter((candidate) => candidate.provider !== selected.provider || candidate.model !== selected.modelId).map((candidate) => ({
					provider: candidate.provider,
					modelId: candidate.model,
					runtime: selected.boundHarnessRuntime,
					agentId: requestedAgentIds.sessionAgentId
				}))];
			}
		}));
		releasePreparedRuntime = () => preparedModelRuntimeLease[Symbol.asyncDispose]();
		try {
			const preparedModelRuntimeOwnerSnapshot = preparedModelRuntimeLease.snapshot;
			const preparedConfig = projectCodexHostTranscriptBytePreflightConfig(preparedModelRuntimeOwnerSnapshot.config, Boolean(transcriptBytePreflightAuthority)) ?? preparedModelRuntimeOwnerSnapshot.config;
			const preparedWorkspaceDir = preparedModelRuntimeOwnerSnapshot.workspaceDir ?? requestedWorkspaceDir;
			const repoRoot = resolveSystemPromptRepoRoot({
				config: preparedConfig,
				workspaceDir: preparedWorkspaceDir,
				cwd: requestedParams.cwd
			}) ?? null;
			const projectKey = repoRoot ? await resolveProjectKey(repoRoot) : null;
			const activeProjectKeys = prepareEmbeddedSessionActiveProjectKeys(requestedParams.sessionId, projectKey);
			const preparedModelRuntime = Object.freeze({
				...preparedModelRuntimeOwnerSnapshot,
				config: preparedConfig,
				repoRoot,
				projectKey,
				activeProjectKeys
			});
			const params = {
				...requestedParams,
				config: preparedConfig,
				agentId: preparedModelRuntime.agentId ?? requestedAgentIds.sessionAgentId,
				agentDir: preparedModelRuntime.agentDir,
				workspaceDir: preparedWorkspaceDir,
				preparedModelRuntime,
				...transcriptBytePreflightClaim ? {
					transcriptBytePreflightAuthority: true,
					...transcriptBytePreflightClaim.withCompactionPersistence ? { transcriptByteCompactionPersistence: transcriptBytePreflightClaim.withCompactionPersistence } : {}
				} : {}
			};
			const compactPrepared = async () => {
				if (transcriptBytePreflightAuthority || hasExplicitCompactionModel(params) || !hasCompactionModelFallbackCandidates(params)) return await compactEmbeddedAgentSessionDirectOnce(params);
				const resolvedCompactionTarget = resolveEmbeddedCompactionTarget({
					config: params.config,
					provider: params.provider,
					modelId: params.model,
					authProfileId: params.authProfileId,
					modelSelectionLocked: params.modelSelectionLocked,
					defaultProvider: DEFAULT_PROVIDER,
					defaultModel: DEFAULT_MODEL
				});
				const primaryProvider = resolvedCompactionTarget.provider ?? "openai";
				const primaryModel = resolvedCompactionTarget.model ?? "gpt-6-astra";
				const requestedPrimaryProvider = params.provider?.trim() || "openai";
				const resolveAuthProvider = (provider) => resolveProviderIdForAuth(provider, {
					config: params.config,
					metadataSnapshot: preparedModelRuntime.metadataSnapshot
				});
				const primaryAuthProviders = new Set([primaryProvider, requestedPrimaryProvider].map(resolveAuthProvider));
				const fallbacksOverride = resolveCompactionFallbacksOverride(params);
				const fallbackAgentId = resolveSessionAgentIds({
					sessionKey: params.sandboxSessionKey ?? params.sessionKey,
					config: params.config,
					agentId: params.sandboxAgentId ?? params.agentId
				}).sessionAgentId;
				const resolvedPrimaryCandidate = resolveModelCandidateChain({
					cfg: params.config,
					agentId: fallbackAgentId,
					manifestPlugins: preparedModelRuntime.metadataSnapshot,
					provider: primaryProvider,
					model: primaryModel,
					requestedRouteResolution: "resolved",
					fallbacksOverride
				})[0];
				const fallbackSessionKey = params.sandboxSessionKey ?? params.sessionKey ?? params.sessionId;
				return (await runWithModelFallback({
					cfg: params.config,
					manifestPlugins: preparedModelRuntime.metadataSnapshot,
					provider: primaryProvider,
					model: primaryModel,
					requestedRouteResolution: "resolved",
					runId: params.runId ?? params.sessionId,
					agentDir: params.agentDir,
					agentId: fallbackAgentId,
					sessionId: params.sessionId,
					sessionKey: fallbackSessionKey,
					userLockedAuthProfileId: params.authProfileIdSource === "user" ? params.authProfileId : void 0,
					abortSignal: params.abortSignal,
					prepareAgentHarnessRuntime: async ({ provider, model, agentHarnessRuntimeOverride }) => {
						await ensureSelectedAgentHarnessPlugin({
							config: params.config,
							provider,
							modelId: model,
							agentId: fallbackAgentId,
							sessionKey: fallbackSessionKey,
							agentHarnessRuntimeOverride,
							workspaceDir: params.workspaceDir,
							pluginRegistry: preparedModelRuntime.pluginRegistry
						});
					},
					fallbacksOverride,
					classifyResult: ({ result, provider, model }) => classifyCompactionFallbackResult(result, provider, model),
					run: async (provider, model) => {
						const isPrimaryCandidate = provider === resolvedPrimaryCandidate?.provider && model === resolvedPrimaryCandidate.model;
						const preservesPrimaryAuth = isPrimaryCandidate || primaryAuthProviders.has(resolveAuthProvider(provider));
						const authProfileId = preservesPrimaryAuth ? params.authProfileId : void 0;
						return await compactEmbeddedAgentSessionDirectOnce({
							...params,
							provider,
							model,
							requestedRouteResolution: isPrimaryCandidate ? void 0 : "resolved",
							authProfileId,
							authProfileIdSource: preservesPrimaryAuth ? params.authProfileIdSource : void 0,
							runtimeAuthPlan: isPrimaryCandidate ? params.runtimeAuthPlan : void 0,
							runtimePlan: isPrimaryCandidate ? params.runtimePlan : void 0
						});
					}
				})).result;
			};
			return await withPluginRuntimeGenerationScope(preparedModelRuntime, () => {
				context = AsyncLocalStorage.snapshot();
				return compactPrepared();
			});
		} catch (err) {
			return fallbackFailureToCompactionResult(err);
		}
	};
	trackOwner(async () => {
		const closeWork = () => context(() => work.beginClose(cancellationSignal?.reason));
		cancellationSignal?.addEventListener("abort", closeWork, { once: true });
		if (cancellationSignal?.aborted) closeWork();
		try {
			callerResult.resolve(await work.track(runPreparedCompaction));
		} catch (error) {
			callerResult.reject(error);
		} finally {
			try {
				await AsyncWorkScope.runWhenAllIdle(() => [work], () => context(() => work.drain()));
			} finally {
				try {
					await releasePreparedRuntime?.();
				} finally {
					cancellationSignal?.removeEventListener("abort", closeWork);
				}
			}
		}
	}).catch(callerResult.reject);
	return await callerResult.promise;
}
const testing = {
	compactNativeCliSession,
	containsRealConversationMessages,
	estimateTokensAfterCompaction,
	buildBeforeCompactionHookMetrics,
	prepareCompactionSessionAgent,
	runBeforeCompactionHooks,
	runAfterCompactionHooks,
	runPostCompactionSideEffects
};
//#endregion
export { setTranscriptBytePreflightClaim as a, prepareCompactionHarnessAuth as c, asCompactionHookRunner as d, runPostCompactionSideEffects as f, resolveTranscriptBytePreflightAuthority as i, projectCodexHostTranscriptBytePreflightConfig as l, compactNativeCliSession as n, resolveTieredModel as o, resolveProjectKey as p, testing as r, attachCompactionAccountingRecorder as s, compactEmbeddedAgentSessionDirect as t, resolveCompactionRuntimeSelection as u };
