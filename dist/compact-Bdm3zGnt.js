import { i as formatErrorMessage } from "./errors-DCRXIYSQ.js";
import { m as resolveUserPath } from "./utils-BApvfmPs.js";
import { C as freezeDiagnosticTraceContext, b as createDiagnosticTraceContext, w as getActiveDiagnosticTraceContext } from "./diagnostic-events-CLCyIzm6.js";
import { r as resolveAgentModelFallbackValues } from "./model-input-BHKiDwaq.js";
import { _ as resolveRunModelFallbacksOverride, y as resolveSessionAgentIds } from "./agent-scope-CDZXADgT.js";
import { a as isSubagentSessionKey, c as parseAgentSessionKey, i as isCronSessionKey } from "./session-key-utils-C7uT9A4s.js";
import { a as resolveAgentDir } from "./agent-scope-config-C3ijpoNo.js";
import { r as getCurrentPluginMetadataSnapshot } from "./current-plugin-metadata-snapshot-BcIVzXmF.js";
import { r as isDefaultAgentRuntimeId } from "./agent-runtime-id-DiL2DId7.js";
import { n as resolveAgentHarnessPolicy } from "./harness-runtimes--3bc5qch.js";
import { n as DEFAULT_MODEL, r as DEFAULT_PROVIDER } from "./defaults-mDjiWzE5.js";
import { i as wrapStreamFnTextTransforms } from "./text-transforms.runtime-CL4fWOoA.js";
import { N as listRegisteredPluginAgentPromptGuidance } from "./command-registration-DbqkNaUv.js";
import { t as getGlobalHookRunner } from "./hook-runner-global-D4fQSLSV.js";
import { i as normalizeMessageChannel } from "./message-channel-normalize-DleKV4yQ.js";
import "./message-channel-B4LS2Kcc.js";
import { a as resolveSessionLockMaxHoldFromTimeout, s as resolveSessionWriteLockOptions, t as acquireSessionWriteLock } from "./session-write-lock-B7bsl0mX.js";
import { M as resolveProviderTextTransforms, U as transformProviderSystemPrompt, y as prepareProviderRuntimeAuth } from "./provider-runtime-D4NEMgBr.js";
import { t as applyPreparedRuntimeAuthToModel } from "./provider-request-config-B7N9imAw.js";
import { r as ensureOpenClawModelsJson } from "./models-config-ChaTzZG5.js";
import { t as MissingProviderAuthError } from "./model-auth-runtime-shared-D8fFlbsz.js";
import { i as sanitizeToolUseResultPairing } from "./session-transcript-repair-CzUOZPU5.js";
import { o as createAgentSession } from "./sessions-DP0wANEo.js";
import { E as estimateTokens } from "./proxy-CoylXPU6.js";
import { t as SessionManager, u as repairSessionFileIfNeeded } from "./session-manager-D5YeJxMM.js";
import { t as detectRuntimeShell } from "./shell-utils-DKmnHE0C.js";
import { a as getApiKeyForModel, f as resolveModelAuthMode, n as applyLocalNoAuthHeaderOverride, t as applyAuthHeaderOverride } from "./model-auth-Bvz14MtI.js";
import { a as describeFailoverError, i as coerceToFailoverError } from "./failover-error-CZc6_Wx_.js";
import { n as resolveDiagnosticModelContentCapturePolicy } from "./diagnostic-llm-content-DEyCVA3H.js";
import { A as resolveChannelReactionGuidance, D as listChannelSupportedActions, O as resolveChannelMessageToolHints } from "./agent-tools.before-tool-call-CP6dTokt.js";
import { t as isAcpRuntimeSpawnAvailable } from "./availability-Nofb8bX9.js";
import { t as getMachineDisplayName } from "./machine-name-DaF-eeRE.js";
import { _ as supportsModelTools } from "./openai-transport-stream-CKFLti3C.js";
import { t as log } from "./logger-DibNup0x.js";
import { n as extractModelCompat } from "./provider-model-compat-DAJmt9jr.js";
import { c as resolveSkillsPromptForRun } from "./workspace-CD16JXyF.js";
import { n as resolveSandboxSkillRuntimeInputs, r as resolveEmbeddedRunSkillEntries, t as mapSandboxSkillEntriesForPrompt } from "./sandbox-skills-BtkGHoiR.js";
import { n as applySkillEnvOverridesFromSnapshot, t as applySkillEnvOverrides } from "./env-overrides-BEzLoYKL.js";
import { t as isReasoningTagProvider } from "./provider-utils-mz_98gfU.js";
import { t as createBundleLspToolRuntime } from "./agent-bundle-lsp-runtime-Dt4J2nOu.js";
import { n as createBundleMcpToolRuntime } from "./agent-bundle-mcp-materialize-j71Gu8hU.js";
import "./agent-bundle-mcp-tools-CJT5lUbs.js";
import { A as rotateTranscriptAfterCompaction, C as getHistoryLimitFromSessionKey, D as isRealConversationMessage, E as hasMeaningfulConversationContent, I as logRuntimeToolSchemaQuarantine, K as createPreparedEmbeddedAgentSettingsManager, L as guardSessionManager, M as shouldRotateCompactionTranscript, N as dedupeDuplicateUserMessagesForCompaction, O as consumeCompactionSafeguardCancelReason, S as buildEmbeddedMessageActionDiscoveryInput, T as buildEmbeddedExtensionFactories, _ as trackSessionManagerAccess, b as sanitizeSessionHistory, c as collectRegisteredToolNames, d as buildEmbeddedSystemPrompt, g as prewarmSessionFile, h as resolveEmbeddedAgentStreamFn, i as normalizeContextTokenBudget, k as setCompactionSafeguardCancelReason, l as toSessionToolAllowlist, m as resolveEmbeddedAgentBaseStreamFn, n as flushPendingToolResultsAfterIdle, o as collectAllowedToolNames, r as mapThinkingLevel, t as wrapStreamFnWithDiagnosticModelCallEvents, u as applySystemPromptToSession, v as createEmbeddedAgentResourceLoader, w as limitHistoryTurns, x as validateReplayTurns } from "./attempt.model-diagnostic-events-DLRFJ0nE.js";
import { i as isSilentOverflowProneModel, n as applyAgentAutoCompactionGuard, r as applyAgentCompactionSettingsFromConfig } from "./agent-settings-CYvHv2Dg.js";
import { t as splitSdkTools } from "./tool-split-DuZXJ6oO.js";
import { n as resolveProcessToolScopeKey, t as createOpenClawCodingTools } from "./agent-tools-9Ug2y1RD.js";
import { i as generateSecureToken } from "./secure-random-Ds4AFLgz.js";
import { _ as ensureSessionHeader, i as pickFallbackThinkingLevel } from "./embedded-agent-helpers-D_zioqUQ.js";
import { o as runWithModelFallback, t as isFallbackSummaryError } from "./model-fallback-xjR_RHVQ.js";
import { n as resolveModelAsync } from "./model-Cc001htM.js";
import { t as registerProviderStreamForModel } from "./provider-stream-BSVCqT_P.js";
import { o as resolveSandboxContext } from "./sandbox-yDmlXhAz.js";
import { n as resolveEmbeddedCompactionTarget, r as listActiveProcessSessionReferences } from "./compaction-runtime-context-DiDns5g3.js";
import { a as resolveBootstrapContextForRun, i as makeBootstrapWarn, s as resolveContextInjectionMode } from "./bootstrap-files-CAlSvEMW.js";
import { t as resolveHeartbeatPromptForSystemPrompt } from "./heartbeat-system-prompt-QFOE5bY3.js";
import { a as resolveUserTimezone, i as resolveUserTimeFormat, n as formatUserTime } from "./date-time-CcWivhrg.js";
import { r as resolveOpenClawReferencePaths } from "./docs-path-BFx8pgV0.js";
import { i as resolveAgentPromptSurfaceForSessionKey } from "./system-prompt-config-B-qy6WRv.js";
import { t as collectRuntimeChannelCapabilities } from "./runtime-capabilities-DCktltnb.js";
import { n as filterRuntimeCompatibleTools, t as filterProviderNormalizableTools } from "./tool-schema-projection-Bld_BaX8.js";
import { c as readTranscriptFileState, l as writeTranscriptFileAtomic, o as TranscriptFileState } from "./transcript-rewrite-CO2KuAHs.js";
import { i as resolveCompactionTimeoutMs, r as compactWithSafetyTimeout } from "./tool-result-middleware-DsdFDvXD.js";
import { t as applyExtraParamsToAgent } from "./extra-params-s21PGVlz.js";
import { t as applyFinalEffectiveToolPolicy } from "./effective-tool-policy-BEhny3Cc.js";
import { a as resolveContextWindowInfo } from "./context-window-guard-D9hRipzD.js";
import { r as resolveEmbeddedSandboxInfoExecPolicy, t as buildEmbeddedSandboxInfo } from "./sandbox-info-PP6dNxyz.js";
import { r as resolveAttemptSpawnWorkspaceDir } from "./attempt.thread-helpers-C6oRA5x8.js";
import { a as buildBeforeCompactionHookMetrics, c as runBeforeCompactionHooks, h as resolveSessionCompactionCheckpointReason, i as asCompactionHookRunner, l as runPostCompactionSideEffects, m as resolveCompactionCheckpointTranscriptPosition, n as resolveAgentRunSessionTarget, o as estimateTokensAfterCompaction, p as readSessionLeafStateFromTranscriptAsync, r as readAgentModelContextTokens, s as runAfterCompactionHooks, t as applyAgentRunSessionTargetIdentity, u as createFileBackedCompactionCheckpointStore } from "./run-session-target-B3BxXQMM.js";
import { t as ensureSelectedAgentHarnessPlugin } from "./runtime-plugin-D4UDhDQN.js";
import { t as ensureRuntimePluginsLoaded } from "./runtime-plugins-FIVhMF4I.js";
import { i as resolveCompactionFailureReason, n as classifyCompactionReason, r as formatUnknownCompactionReasonDetail } from "./compact-reasons-CQeEUOxn.js";
import { r as buildAgentRuntimePlan } from "./build-CpRbl8NM.js";
import fs from "node:fs/promises";
import os from "node:os";
//#region src/agents/embedded-agent-runner/manual-compaction-boundary.ts
function replaceLatestCompactionBoundary(params) {
	return params.entries.map((entry) => {
		if (entry.type !== "compaction" || entry.id !== params.compactionEntryId) return entry;
		return {
			...entry,
			firstKeptEntryId: entry.id
		};
	});
}
function entryCreatesCompactionInputMessage(entry) {
	return entry.type === "message" || entry.type === "custom_message" || entry.type === "branch_summary";
}
function hasMessagesToSummarizeBeforeKeptTail(params) {
	const compactionIndex = params.branch.findIndex((entry) => entry.id === params.compaction.id);
	const firstKeptIndex = params.branch.findIndex((entry) => entry.id === params.compaction.firstKeptEntryId);
	if (compactionIndex <= 0 || firstKeptIndex < 0 || firstKeptIndex >= compactionIndex) return false;
	let boundaryStartIndex = 0;
	for (let i = compactionIndex - 1; i >= 0; i -= 1) {
		const entry = params.branch[i];
		if (entry?.type !== "compaction") continue;
		const previousFirstKeptIndex = params.branch.findIndex((candidate) => candidate.id === entry.firstKeptEntryId);
		boundaryStartIndex = previousFirstKeptIndex >= 0 ? previousFirstKeptIndex : i + 1;
		break;
	}
	return params.branch.slice(boundaryStartIndex, firstKeptIndex).some((entry) => entryCreatesCompactionInputMessage(entry));
}
/** Rewrite the latest manual compaction leaf so replay starts from its summary. */
async function hardenManualCompactionBoundary(params) {
	const state = await readTranscriptFileState(params.sessionFile);
	const header = state.getHeader();
	if (!header) return {
		applied: false,
		messages: []
	};
	const leaf = state.getLeafEntry();
	if (leaf?.type !== "compaction") {
		const sessionContext = state.buildSessionContext();
		return {
			applied: false,
			leafId: state.getLeafId() ?? void 0,
			messages: sessionContext.messages
		};
	}
	const sessionContext = state.buildSessionContext();
	if (params.preserveRecentTail) return {
		applied: false,
		firstKeptEntryId: leaf.firstKeptEntryId,
		leafId: state.getLeafId() ?? void 0,
		messages: sessionContext.messages
	};
	if (leaf.firstKeptEntryId === leaf.id) return {
		applied: false,
		firstKeptEntryId: leaf.id,
		leafId: state.getLeafId() ?? void 0,
		messages: sessionContext.messages
	};
	if (!leaf.summary.trim() || !hasMessagesToSummarizeBeforeKeptTail({
		branch: state.getBranch(leaf.id),
		compaction: leaf
	})) return {
		applied: false,
		firstKeptEntryId: leaf.firstKeptEntryId,
		leafId: state.getLeafId() ?? void 0,
		messages: sessionContext.messages
	};
	const replacedEntries = replaceLatestCompactionBoundary({
		entries: state.getEntries(),
		compactionEntryId: leaf.id
	});
	const replacedState = new TranscriptFileState({
		header,
		entries: replacedEntries
	});
	await writeTranscriptFileAtomic(params.sessionFile, [header, ...replacedEntries]);
	const replacedSessionContext = replacedState.buildSessionContext();
	return {
		applied: true,
		firstKeptEntryId: leaf.id,
		leafId: replacedState.getLeafId() ?? void 0,
		messages: replacedSessionContext.messages
	};
}
//#endregion
//#region src/agents/embedded-agent-runner/compact.ts
/**
* Implements embedded-agent transcript compaction and runtime handoff.
*/
const compactionCheckpointStore = createFileBackedCompactionCheckpointStore();
function hasRealConversationContent(msg, messages, index) {
	return isRealConversationMessage(msg, messages, index);
}
function createCompactionDiagId() {
	return `cmp-${Date.now().toString(36)}-${generateSecureToken(4)}`;
}
function prepareCompactionSessionAgent(params) {
	params.session.agent.streamFn = resolveEmbeddedAgentStreamFn({
		currentStreamFn: resolveEmbeddedAgentBaseStreamFn({ session: params.session }),
		providerStreamFn: params.providerStreamFn,
		sessionId: params.sessionId,
		signal: params.signal,
		model: params.effectiveModel,
		resolvedApiKey: params.resolvedApiKey,
		authProfileId: params.runtimePlan?.auth.forwardedAuthProfileId,
		authStorage: params.authStorage
	});
	const providerTextTransforms = resolveProviderTextTransforms({
		provider: params.provider,
		config: params.config,
		workspaceDir: params.effectiveWorkspace
	});
	if (providerTextTransforms) params.session.agent.streamFn = wrapStreamFnTextTransforms({
		streamFn: params.session.agent.streamFn,
		input: providerTextTransforms.input,
		output: providerTextTransforms.output,
		transformSystemPrompt: false
	});
	const preparedRuntimeExtraParams = params.runtimePlan?.transport.resolveExtraParams({
		thinkingLevel: params.thinkLevel,
		agentId: params.sessionAgentId,
		workspaceDir: params.effectiveWorkspace,
		model: params.effectiveModel
	});
	return applyExtraParamsToAgent(params.session.agent, params.config, params.provider, params.modelId, void 0, params.thinkLevel, params.sessionAgentId, params.effectiveWorkspace, params.effectiveModel, params.agentDir, void 0, {
		...preparedRuntimeExtraParams ? { preparedExtraParams: preparedRuntimeExtraParams } : {},
		nativeWebSearchPolicyContext: {
			sessionKey: params.sessionKey,
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
	});
}
function resolveCompactionProviderStream(params) {
	return registerProviderStreamForModel({
		model: params.effectiveModel,
		cfg: params.config,
		agentDir: params.agentDir,
		workspaceDir: params.effectiveWorkspace
	});
}
function normalizeObservedTokenCount(value) {
	return typeof value === "number" && Number.isFinite(value) && value > 0 ? Math.floor(value) : void 0;
}
function getMessageTextChars(msg) {
	const content = msg.content;
	if (typeof content === "string") return content.length;
	if (!Array.isArray(content)) return 0;
	let total = 0;
	for (const block of content) {
		if (!block || typeof block !== "object") continue;
		const text = block.text;
		if (typeof text === "string") total += text.length;
	}
	return total;
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
		contributors: selectTopContributors(contributors)
	};
}
function selectTopContributors(contributors) {
	const selected = [];
	for (const contributor of contributors) {
		let insertAt = selected.length;
		for (let index = 0; index < selected.length; index += 1) if (contributor.chars > selected[index].chars) {
			insertAt = index;
			break;
		}
		if (insertAt < 3) {
			selected.splice(insertAt, 0, contributor);
			if (selected.length > 3) selected.pop();
		} else if (selected.length < 3) selected.push(contributor);
	}
	return selected;
}
function containsRealConversationMessages(messages) {
	return messages.some((message, index, allMessages) => hasRealConversationContent(message, allMessages, index));
}
function hasExplicitCompactionModel(params) {
	return Boolean(params.config?.agents?.defaults?.compaction?.model?.trim());
}
function resolveCompactionFallbacksOverride(params) {
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
	const failoverError = coerceToFailoverError(Object.assign(new Error(result.failure?.rawError ?? reason), {
		status: result.failure?.status,
		code: result.failure?.code
	}), {
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
	const runSessionTarget = await resolveAgentRunSessionTarget(paramsBase);
	const params = {
		...paramsBase,
		agentId: paramsBase.agentId ?? runSessionTarget.agentId,
		sessionId: runSessionTarget.sessionId,
		sessionKey: paramsBase.sessionKey ?? runSessionTarget.sessionKey,
		sessionFile: runSessionTarget.sessionFile
	};
	if (hasExplicitCompactionModel(params) || !hasCompactionModelFallbackCandidates(params)) return await compactEmbeddedAgentSessionDirectOnce(params);
	const resolvedCompactionTarget = resolveEmbeddedCompactionTarget({
		config: params.config,
		provider: params.provider,
		modelId: params.model,
		authProfileId: params.authProfileId,
		defaultProvider: DEFAULT_PROVIDER,
		defaultModel: DEFAULT_MODEL
	});
	const primaryProvider = resolvedCompactionTarget.provider ?? "openai";
	const primaryModel = resolvedCompactionTarget.model ?? "gpt-5.5";
	const requestedPrimaryProvider = params.provider?.trim() || "openai";
	const fallbacksOverride = resolveCompactionFallbacksOverride(params);
	const fallbackAgentId = resolveSessionAgentIds({
		sessionKey: params.sandboxSessionKey ?? params.sessionKey,
		config: params.config,
		agentId: params.agentId
	}).sessionAgentId;
	const fallbackSessionKey = params.sandboxSessionKey ?? params.sessionKey ?? params.sessionId;
	try {
		return (await runWithModelFallback({
			cfg: params.config,
			provider: primaryProvider,
			model: primaryModel,
			runId: params.runId ?? params.sessionId,
			agentDir: params.agentDir,
			agentId: fallbackAgentId,
			sessionId: params.sessionId,
			sessionKey: fallbackSessionKey,
			prepareAgentHarnessRuntime: async ({ provider, model, agentHarnessRuntimeOverride }) => {
				await ensureSelectedAgentHarnessPlugin({
					config: params.config,
					provider,
					modelId: model,
					agentId: fallbackAgentId,
					sessionKey: fallbackSessionKey,
					agentHarnessRuntimeOverride,
					workspaceDir: params.workspaceDir
				});
			},
			fallbacksOverride,
			classifyResult: ({ result, provider, model }) => classifyCompactionFallbackResult(result, provider, model),
			run: async (provider, model) => {
				const authProfileId = provider === primaryProvider || provider === requestedPrimaryProvider ? params.authProfileId : void 0;
				return await compactEmbeddedAgentSessionDirectOnce({
					...params,
					provider,
					model,
					authProfileId
				});
			}
		})).result;
	} catch (err) {
		return fallbackFailureToCompactionResult(err);
	}
}
async function compactEmbeddedAgentSessionDirectOnce(params) {
	const startedAt = Date.now();
	const diagId = params.diagId?.trim() || createCompactionDiagId();
	const trigger = params.trigger ?? "manual";
	const attempt = params.attempt ?? 1;
	const maxAttempts = params.maxAttempts ?? 1;
	const runId = params.runId ?? params.sessionId;
	const compactionModelCallTrace = freezeDiagnosticTraceContext(getActiveDiagnosticTraceContext() ?? createDiagnosticTraceContext());
	const diagnosticCompactionRunId = `${runId}:compaction:${diagId}`;
	let diagnosticModelCallSeq = 0;
	const resolvedWorkspace = resolveUserPath(params.workspaceDir);
	ensureRuntimePluginsLoaded({
		config: params.config,
		workspaceDir: resolvedWorkspace,
		allowGatewaySubagentBinding: params.allowGatewaySubagentBinding
	});
	const earlyAgentIds = resolveSessionAgentIds({
		sessionKey: params.sessionKey,
		config: params.config,
		agentId: params.agentId
	});
	const agentDir = params.agentDir ?? resolveAgentDir(params.config ?? {}, earlyAgentIds.sessionAgentId);
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
	const provider = resolvedCompactionTarget.provider ?? "openai";
	const runtimeProvider = resolvedCompactionTarget.runtimeProvider ?? provider;
	const contextConfigProvider = resolvedCompactionTarget.contextProvider ?? provider;
	const modelId = resolvedCompactionTarget.model ?? "gpt-5.5";
	const authProfileId = resolvedCompactionTarget.authProfileId;
	if (runtimeProvider !== provider || selectedHarnessRuntime) await ensureSelectedAgentHarnessPlugin({
		config: params.config,
		provider,
		modelId,
		agentId: runtimePolicyAgentId,
		sessionKey: runtimePolicySessionKey,
		agentHarnessRuntimeOverride: selectedHarnessRuntime,
		workspaceDir: resolvedWorkspace
	});
	let thinkLevel = params.thinkLevel ?? "off";
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
	await ensureOpenClawModelsJson(params.config, agentDir, { workspaceDir: resolvedWorkspace });
	const { model, error, authStorage, modelRegistry } = await resolveModelAsync(runtimeProvider, modelId, agentDir, params.config);
	if (!model) return fail(error ?? `Unknown model: ${runtimeProvider}/${modelId}`);
	let runtimeModel = model;
	let apiKeyInfo;
	let hasRuntimeAuthExchange = false;
	try {
		apiKeyInfo = await getApiKeyForModel({
			model: runtimeModel,
			cfg: params.config,
			profileId: authProfileId,
			agentDir,
			workspaceDir: resolvedWorkspace
		});
		if (!apiKeyInfo.apiKey) {
			if (apiKeyInfo.mode !== "aws-sdk") throw new MissingProviderAuthError(runtimeModel.provider, apiKeyInfo);
		} else {
			const preparedAuth = await prepareProviderRuntimeAuth({
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
					apiKey: apiKeyInfo.apiKey,
					authMode: apiKeyInfo.mode,
					profileId: apiKeyInfo.profileId
				}
			});
			runtimeModel = applyPreparedRuntimeAuthToModel(runtimeModel, preparedAuth);
			const runtimeApiKey = preparedAuth?.apiKey ?? apiKeyInfo.apiKey;
			hasRuntimeAuthExchange = Boolean(preparedAuth?.apiKey);
			if (!runtimeApiKey) throw new Error(`Provider "${runtimeModel.provider}" runtime auth returned no apiKey.`);
			authStorage.setRuntimeApiKey(runtimeModel.provider, runtimeApiKey);
		}
	} catch (err) {
		return fail(formatErrorMessage(err), err);
	}
	await fs.mkdir(resolvedWorkspace, { recursive: true });
	const sandboxSessionKey = params.sandboxSessionKey?.trim() || params.sessionKey?.trim() || params.sessionId;
	const sandbox = await resolveSandboxContext({
		config: params.config,
		sessionKey: sandboxSessionKey,
		workspaceDir: resolvedWorkspace
	});
	const effectiveWorkspace = sandbox?.enabled ? sandbox.workspaceAccess === "rw" ? resolvedWorkspace : sandbox.workspaceDir : resolvedWorkspace;
	const requestedCwd = params.cwd ? resolveUserPath(params.cwd) : void 0;
	if (sandbox?.enabled && requestedCwd && requestedCwd !== resolvedWorkspace) throw new Error("cwd override is not supported for sandboxed embedded compaction runs; omit cwd or use the agent workspace as cwd");
	const effectiveCwd = sandbox?.enabled ? effectiveWorkspace : requestedCwd ?? effectiveWorkspace;
	await fs.mkdir(effectiveWorkspace, { recursive: true });
	await ensureSessionHeader({
		sessionFile: params.sessionFile,
		sessionId: params.sessionId,
		cwd: effectiveCwd
	});
	const { sessionAgentId: effectiveSkillAgentId } = earlyAgentIds;
	let restoreSkillEnv;
	let compactionSessionManager = null;
	let checkpointSnapshot = null;
	let checkpointSnapshotRetained = false;
	try {
		const { skillsEligibility, skillsPromptWorkspaceDir: effectiveSkillsPromptWorkspace, skillsSnapshot: skillsSnapshotForRun, skillsWorkspaceDir: effectiveSkillsWorkspace, workspaceOnly: loadSkillsWorkspaceOnly } = resolveSandboxSkillRuntimeInputs({
			sandbox,
			effectiveWorkspace,
			skillsSnapshot: params.skillsSnapshot
		});
		const { shouldLoadSkillEntries, skillEntries } = resolveEmbeddedRunSkillEntries({
			workspaceDir: effectiveSkillsWorkspace,
			config: params.config,
			agentId: effectiveSkillAgentId,
			eligibility: skillsEligibility,
			skillsSnapshot: skillsSnapshotForRun,
			workspaceOnly: loadSkillsWorkspaceOnly
		});
		restoreSkillEnv = skillsSnapshotForRun ? applySkillEnvOverridesFromSnapshot({
			snapshot: skillsSnapshotForRun,
			config: params.config
		}) : applySkillEnvOverrides({
			skills: skillEntries ?? [],
			config: params.config
		});
		const skillsPrompt = resolveSkillsPromptForRun({
			skillsSnapshot: skillsSnapshotForRun,
			entries: mapSandboxSkillEntriesForPrompt({
				entries: shouldLoadSkillEntries ? skillEntries : void 0,
				skillsWorkspaceDir: effectiveSkillsWorkspace,
				skillsPromptWorkspaceDir: effectiveSkillsPromptWorkspace
			}),
			config: params.config,
			workspaceDir: effectiveSkillsPromptWorkspace,
			agentId: effectiveSkillAgentId,
			eligibility: skillsEligibility
		});
		const sessionLabel = params.sessionKey ?? params.sessionId;
		const resolvedMessageProvider = params.messageChannel ?? params.messageProvider;
		const { contextFiles } = resolveContextInjectionMode(params.config, effectiveSkillAgentId) === "never" ? { contextFiles: [] } : await resolveBootstrapContextForRun({
			workspaceDir: effectiveWorkspace,
			config: params.config,
			sessionKey: params.sessionKey,
			sessionId: params.sessionId,
			agentId: effectiveSkillAgentId,
			warn: makeBootstrapWarn({
				sessionLabel,
				warn: (message) => log.warn(message)
			})
		});
		const runtimeModelWithContext = runtimeModel;
		const resolvedContextTokenBudget = normalizeContextTokenBudget(resolveContextWindowInfo({
			cfg: params.config,
			provider: contextConfigProvider,
			modelId,
			modelContextTokens: readAgentModelContextTokens(runtimeModel),
			modelContextWindow: runtimeModelWithContext.contextWindow,
			defaultTokens: 2e5
		}).tokens) ?? 2e5;
		const requestedContextTokenBudget = normalizeContextTokenBudget(params.contextTokenBudget) ?? normalizeContextTokenBudget(params.tokenBudget);
		const contextTokenBudget = Math.min(requestedContextTokenBudget ?? resolvedContextTokenBudget, resolvedContextTokenBudget);
		const effectiveModel = applyAuthHeaderOverride(applyLocalNoAuthHeaderOverride(contextTokenBudget < (runtimeModelWithContext.contextWindow ?? Infinity) ? {
			...runtimeModelWithContext,
			contextWindow: contextTokenBudget
		} : runtimeModelWithContext, apiKeyInfo), hasRuntimeAuthExchange ? null : apiKeyInfo, params.config);
		const runtimePlan = params.runtimePlan ?? buildAgentRuntimePlan({
			provider,
			modelId,
			model: effectiveModel,
			modelApi: effectiveModel.api,
			harnessId: params.agentHarnessId,
			harnessRuntime: selectedHarnessRuntime,
			authProfileProvider: authProfileId?.split(":", 1)[0],
			sessionAuthProfileId: authProfileId,
			config: params.config,
			workspaceDir: effectiveWorkspace,
			agentDir,
			agentId: effectiveSkillAgentId,
			thinkingLevel: thinkLevel
		});
		const runAbortController = new AbortController();
		const toolsRaw = createOpenClawCodingTools({
			exec: {
				...params.execOverrides,
				config: params.config,
				elevated: params.bashElevated
			},
			sandbox,
			messageProvider: resolvedMessageProvider,
			agentAccountId: params.agentAccountId,
			sessionKey: sandboxSessionKey,
			runSessionKey: params.sessionKey && params.sessionKey !== sandboxSessionKey ? params.sessionKey : void 0,
			sessionId: params.sessionId,
			runId: params.runId,
			oneShotCliRun: params.oneShotCliRun,
			groupId: params.groupId,
			groupChannel: params.groupChannel,
			groupSpace: params.groupSpace,
			spawnedBy: params.spawnedBy,
			senderId: params.senderId,
			senderName: params.senderName,
			senderUsername: params.senderUsername,
			senderE164: params.senderE164,
			allowGatewaySubagentBinding: params.allowGatewaySubagentBinding,
			agentDir,
			cwd: effectiveCwd,
			workspaceDir: effectiveWorkspace,
			spawnWorkspaceDir: effectiveCwd !== effectiveWorkspace ? resolvedWorkspace : resolveAttemptSpawnWorkspaceDir({
				sandbox,
				resolvedWorkspace
			}),
			config: params.config,
			abortSignal: runAbortController.signal,
			sourceReplyDeliveryMode: params.sourceReplyDeliveryMode,
			modelProvider: model.provider,
			modelId,
			modelCompat: extractModelCompat(effectiveModel),
			modelApi: model.api,
			modelContextWindowTokens: contextTokenBudget,
			skillsSnapshot: skillsSnapshotForRun,
			modelAuthMode: resolveModelAuthMode(model.provider, params.config, void 0, { workspaceDir: effectiveWorkspace })
		});
		const toolsEnabled = supportsModelTools(runtimeModel);
		const runtimePlanModelContext = {
			workspaceDir: effectiveWorkspace,
			modelApi: model.api,
			model
		};
		const normalizableToolProjection = filterProviderNormalizableTools(toolsEnabled ? toolsRaw : []);
		logRuntimeToolSchemaQuarantine({
			diagnostics: normalizableToolProjection.diagnostics,
			tools: toolsEnabled ? toolsRaw : [],
			runId,
			sessionKey: params.sessionKey,
			sessionId: params.sessionId
		});
		const tools = runtimePlan.tools.normalize([...normalizableToolProjection.tools], runtimePlanModelContext);
		const bundleMcpRuntime = toolsEnabled ? await createBundleMcpToolRuntime({
			workspaceDir: effectiveWorkspace,
			cfg: params.config,
			reservedToolNames: tools.map((tool) => tool.name)
		}) : void 0;
		const bundleLspRuntime = toolsEnabled ? await createBundleLspToolRuntime({
			workspaceDir: effectiveWorkspace,
			cfg: params.config,
			reservedToolNames: [...tools.map((tool) => tool.name), ...bundleMcpRuntime?.tools.map((tool) => tool.name) ?? []]
		}) : void 0;
		const filteredBundledTools = applyFinalEffectiveToolPolicy({
			bundledTools: [...bundleMcpRuntime?.tools ?? [], ...bundleLspRuntime?.tools ?? []],
			config: params.config,
			sandboxToolPolicy: sandbox?.tools,
			sessionKey: sandboxSessionKey,
			modelProvider: model.provider,
			modelId,
			messageProvider: resolvedMessageProvider,
			agentAccountId: params.agentAccountId,
			groupId: params.groupId,
			groupChannel: params.groupChannel,
			groupSpace: params.groupSpace,
			spawnedBy: params.spawnedBy,
			senderId: params.senderId,
			senderName: params.senderName,
			senderUsername: params.senderUsername,
			senderE164: params.senderE164,
			warn: (message) => log.warn(message)
		});
		const normalizableBundledToolProjection = filterProviderNormalizableTools(filteredBundledTools);
		if (normalizableBundledToolProjection.diagnostics.length > 0) logRuntimeToolSchemaQuarantine({
			diagnostics: normalizableBundledToolProjection.diagnostics,
			tools: filteredBundledTools,
			runId,
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
			sessionKey: params.sessionKey,
			sessionId: params.sessionId
		});
		const effectiveTools = [...toolSchemaProjection.tools];
		const allowedToolNames = collectAllowedToolNames({ tools: effectiveTools });
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
		const { defaultAgentId, sessionAgentId } = resolveSessionAgentIds({
			sessionKey: params.sessionKey,
			config: params.config,
			agentId: params.agentId
		});
		const channelActions = runtimeChannel ? listChannelSupportedActions(buildEmbeddedMessageActionDiscoveryInput({
			cfg: params.config,
			channel: runtimeChannel,
			currentChannelId: params.currentChannelId,
			currentThreadTs: params.currentThreadTs,
			currentMessageId: params.currentMessageId,
			accountId: params.agentAccountId,
			sessionKey: params.sessionKey,
			sessionId: params.sessionId,
			agentId: sessionAgentId,
			senderId: params.senderId
		})) : void 0;
		const messageToolHints = runtimeChannel ? resolveChannelMessageToolHints({
			cfg: params.config,
			channel: runtimeChannel,
			accountId: params.agentAccountId
		}) : void 0;
		const runtimeInfo = {
			host: machineName,
			os: `${os.type()} ${os.release()}`,
			arch: os.arch(),
			node: process.version,
			model: `${provider}/${modelId}`,
			shell: detectRuntimeShell(),
			channel: runtimeChannel,
			chatType: params.chatType,
			capabilities: runtimeCapabilities,
			channelActions,
			activeProcessSessions: listActiveProcessSessionReferences({ scopeKey: resolveProcessToolScopeKey({
				sessionKey: sandboxSessionKey,
				agentId: sessionAgentId
			}) })
		};
		const sandboxInfoExecPolicy = resolveEmbeddedSandboxInfoExecPolicy({
			config: params.config,
			agentId: sessionAgentId,
			sessionKey: params.sessionKey,
			sandboxAvailable: sandbox?.enabled === true,
			execOverrides: params.execOverrides
		});
		const sandboxInfo = buildEmbeddedSandboxInfo(sandbox, params.bashElevated, sandboxInfoExecPolicy);
		const reasoningTagHint = isReasoningTagProvider(provider, {
			config: params.config,
			workspaceDir: effectiveWorkspace,
			env: process.env,
			modelId,
			modelApi: model.api,
			model
		});
		const userTimezone = resolveUserTimezone(params.config?.agents?.defaults?.userTimezone);
		const userTimeFormat = resolveUserTimeFormat(params.config?.agents?.defaults?.timeFormat);
		const userTime = formatUserTime(/* @__PURE__ */ new Date(), userTimezone, userTimeFormat);
		const promptSurface = resolveAgentPromptSurfaceForSessionKey(params.sessionKey);
		const promptMode = isSubagentSessionKey(params.sessionKey) || isCronSessionKey(params.sessionKey) ? "minimal" : "full";
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
		const buildSystemPromptText = (defaultThinkLevel) => {
			const builtSystemPrompt = buildEmbeddedSystemPrompt({
				config: params.config,
				agentId: sessionAgentId,
				workspaceDir: effectiveWorkspace,
				defaultThinkLevel,
				reasoningLevel: params.reasoningLevel ?? "off",
				extraSystemPrompt: params.extraSystemPrompt,
				ownerNumbers: params.ownerNumbers,
				reasoningTagHint,
				heartbeatPrompt: resolveHeartbeatPromptForSystemPrompt({
					config: params.config,
					agentId: sessionAgentId,
					defaultAgentId
				}),
				skillsPrompt,
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
				tools: effectiveTools,
				userTimezone,
				userTime,
				userTimeFormat,
				contextFiles,
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
		const compactionTimeoutMs = resolveCompactionTimeoutMs(params.config);
		const sessionLock = await acquireSessionWriteLock({
			sessionFile: params.sessionFile,
			...resolveSessionWriteLockOptions(params.config, { maxHoldMsFallback: resolveSessionLockMaxHoldFromTimeout({ timeoutMs: compactionTimeoutMs }) })
		});
		try {
			await repairSessionFileIfNeeded({
				sessionFile: params.sessionFile,
				debug: (message) => log.debug(message),
				warn: (message) => log.warn(message)
			});
			await prewarmSessionFile(params.sessionFile);
			const transcriptPolicy = runtimePlan.transcript.resolvePolicy(runtimePlanModelContext);
			const sessionManager = guardSessionManager(SessionManager.open(params.sessionFile), {
				agentId: sessionAgentId,
				sessionKey: params.sessionKey,
				config: params.config,
				contextWindowTokens: contextTokenBudget,
				allowSyntheticToolResults: transcriptPolicy.allowSyntheticToolResults,
				missingToolResultText: model.api === "openai-responses" || model.api === "azure-openai-responses" || model.api === "openai-chatgpt-responses" ? "aborted" : void 0,
				allowedToolNames
			});
			checkpointSnapshot = await compactionCheckpointStore.captureSnapshot({
				sessionManager,
				sessionFile: params.sessionFile
			});
			compactionSessionManager = sessionManager;
			trackSessionManagerAccess(params.sessionFile);
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
			const resourceLoader = createEmbeddedAgentResourceLoader({
				cwd: effectiveCwd,
				agentDir,
				settingsManager,
				extensionFactories: buildEmbeddedExtensionFactories({
					cfg: params.config,
					sessionManager,
					provider,
					modelId,
					model
				})
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
				effectiveWorkspace
			});
			while (true) {
				attemptedThinking.add(thinkLevel);
				const systemPromptText = buildSystemPromptText(thinkLevel);
				let session;
				try {
					session = (await createAgentSession({
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
					})).session;
					session.setActiveToolsByName(sessionToolAllowlist);
					applySystemPromptToSession(session, systemPromptText);
					prepareCompactionSessionAgent({
						session,
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
					session.agent.streamFn = wrapStreamFnWithDiagnosticModelCallEvents(session.agent.streamFn, {
						runId: diagnosticCompactionRunId,
						...params.sessionKey && { sessionKey: params.sessionKey },
						sessionId: params.sessionId,
						provider,
						model: modelId,
						api: effectiveModel.api,
						transport: session.agent.transport,
						contextTokenBudget,
						trace: compactionModelCallTrace,
						contentCapture: resolveDiagnosticModelContentCapturePolicy(params.config),
						nextCallId: () => `${diagnosticCompactionRunId}:model:${diagnosticModelCallSeq += 1}`
					});
					const dedupedValidated = dedupeDuplicateUserMessagesForCompaction(await validateReplayTurns({
						messages: await sanitizeSessionHistory({
							messages: session.messages,
							modelApi: model.api,
							modelId,
							provider,
							allowedToolNames,
							config: params.config,
							workspaceDir: effectiveWorkspace,
							env: process.env,
							model,
							sessionManager,
							sessionId: params.sessionId,
							policy: transcriptPolicy,
							preserveLatestAssistantThinking: false
						}),
						modelApi: model.api,
						modelId,
						provider,
						config: params.config,
						workspaceDir: effectiveWorkspace,
						env: process.env,
						model,
						sessionId: params.sessionId,
						policy: transcriptPolicy
					}));
					session.agent.state.messages = dedupedValidated;
					const originalMessages = session.messages.slice();
					const truncated = limitHistoryTurns(session.messages, getHistoryLimitFromSessionKey(params.sessionKey, params.config));
					const limited = transcriptPolicy.repairToolUseResultPairing ? sanitizeToolUseResultPairing(truncated, {
						erroredAssistantResultPolicy: "drop",
						...model.api === "openai-responses" || model.api === "azure-openai-responses" || model.api === "openai-chatgpt-responses" ? { missingToolResultText: "aborted" } : {}
					}) : truncated;
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
						sessionKey: params.sessionKey,
						sessionAgentId,
						workspaceDir: effectiveWorkspace,
						messageProvider: resolvedMessageProvider,
						metrics: beforeHookMetrics,
						onHookMessages: params.onCompactionHookMessages
					});
					const { messageCountOriginal } = beforeHookMetrics;
					const diagEnabled = log.isEnabled("debug");
					const preMetrics = diagEnabled ? summarizeCompactionMessages(session.messages) : void 0;
					if (diagEnabled && preMetrics) {
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
					const messageCountCompactionInput = messageCountOriginal;
					let fullSessionTokensBefore = 0;
					try {
						fullSessionTokensBefore = limited.reduce((sum, msg) => sum + estimateTokens(msg), 0);
					} catch {}
					const activeSession = session;
					const result = await compactWithSafetyTimeout(() => {
						setCompactionSafeguardCancelReason(compactionSessionManager, void 0);
						return activeSession.compact(params.customInstructions);
					}, compactionTimeoutMs, {
						abortSignal: params.abortSignal,
						onCancel: () => {
							activeSession.abortCompaction();
						}
					});
					let effectiveFirstKeptEntryId = result.firstKeptEntryId;
					let postCompactionLeafId = typeof sessionManager.getLeafId === "function" ? sessionManager.getLeafId() ?? void 0 : void 0;
					let transcriptRotationSessionManager = sessionManager;
					if (params.trigger === "manual") try {
						const hardenedBoundary = await hardenManualCompactionBoundary({
							sessionFile: params.sessionFile,
							preserveRecentTail: typeof params.config?.agents?.defaults?.compaction?.keepRecentTokens === "number"
						});
						if (hardenedBoundary.applied) {
							effectiveFirstKeptEntryId = hardenedBoundary.firstKeptEntryId ?? effectiveFirstKeptEntryId;
							postCompactionLeafId = hardenedBoundary.leafId ?? postCompactionLeafId;
							session.agent.state.messages = hardenedBoundary.messages;
							transcriptRotationSessionManager = await readTranscriptFileState(params.sessionFile);
						}
					} catch (err) {
						log.warn("[compaction] failed to harden manual compaction boundary", { errorMessage: formatErrorMessage(err) });
					}
					const tokensAfter = estimateTokensAfterCompaction({
						messagesAfter: session.messages,
						observedTokenCount,
						fullSessionTokensBefore,
						estimateTokensFn: estimateTokens
					});
					const messageCountAfter = session.messages.length;
					const compactedCount = Math.max(0, messageCountCompactionInput - messageCountAfter);
					let transcriptRotation = { rotated: false };
					if (shouldRotateCompactionTranscript(params.config)) try {
						transcriptRotation = await rotateTranscriptAfterCompaction({
							sessionManager: transcriptRotationSessionManager,
							sessionFile: params.sessionFile
						});
					} catch (err) {
						log.warn("[compaction] post-compaction transcript rotation failed", {
							errorMessage: formatErrorMessage(err),
							errorStack: err instanceof Error ? err.stack : void 0
						});
					}
					const activeSessionId = transcriptRotation.sessionId ?? params.sessionId;
					const activeSessionFile = transcriptRotation.sessionFile ?? params.sessionFile;
					const activePostLeafId = transcriptRotation.leafId ?? postCompactionLeafId;
					if (transcriptRotation.rotated) log.info(`[compaction] rotated active transcript after compaction (sessionKey=${params.sessionKey ?? params.sessionId})`);
					await runPostCompactionSideEffects({
						config: params.config,
						sessionKey: params.sessionKey,
						agentId: sessionAgentId,
						sessionFile: activeSessionFile
					});
					if (params.config && params.sessionKey && checkpointSnapshot) try {
						const checkpointPosition = resolveCompactionCheckpointTranscriptPosition({
							preferredLeafId: activePostLeafId,
							transcriptState: await readSessionLeafStateFromTranscriptAsync(activeSessionFile)
						});
						checkpointSnapshotRetained = await compactionCheckpointStore.persistCheckpoint({
							cfg: params.config,
							sessionKey: params.sessionKey,
							sessionId: activeSessionId,
							reason: resolveSessionCompactionCheckpointReason({ trigger: params.trigger }),
							snapshot: checkpointSnapshot,
							summary: result.summary,
							firstKeptEntryId: effectiveFirstKeptEntryId,
							tokensBefore: observedTokenCount ?? result.tokensBefore,
							tokensAfter,
							postSessionFile: activeSessionFile,
							postLeafId: checkpointPosition.leafId,
							postEntryId: checkpointPosition.entryId,
							createdAt: compactStartedAt
						}) !== null;
					} catch (err) {
						log.warn("failed to persist compaction checkpoint", { errorMessage: formatErrorMessage(err) });
					}
					const postMetrics = diagEnabled ? summarizeCompactionMessages(session.messages) : void 0;
					if (diagEnabled && preMetrics && postMetrics) log.debug(`[compaction-diag] end runId=${runId} sessionKey=${params.sessionKey ?? params.sessionId} diagId=${diagId} trigger=${trigger} provider=${provider}/${modelId} attempt=${attempt} maxAttempts=${maxAttempts} outcome=compacted reason=none durationMs=${Date.now() - compactStartedAt} retrying=false post.messages=${postMetrics.messages} post.historyTextChars=${postMetrics.historyTextChars} post.toolResultChars=${postMetrics.toolResultChars} post.estTokens=${postMetrics.estTokens ?? "unknown"} delta.messages=${postMetrics.messages - preMetrics.messages} delta.historyTextChars=${postMetrics.historyTextChars - preMetrics.historyTextChars} delta.toolResultChars=${postMetrics.toolResultChars - preMetrics.toolResultChars} delta.estTokens=${typeof preMetrics.estTokens === "number" && typeof postMetrics.estTokens === "number" ? postMetrics.estTokens - preMetrics.estTokens : "unknown"}`);
					await runAfterCompactionHooks({
						hookRunner,
						sessionId: activeSessionId,
						sessionAgentId,
						hookSessionKey,
						missingSessionKey,
						workspaceDir: effectiveWorkspace,
						messageProvider: resolvedMessageProvider,
						messageCountAfter,
						tokensAfter,
						compactedCount,
						sessionFile: activeSessionFile,
						summaryLength: typeof result.summary === "string" ? result.summary.length : void 0,
						tokensBefore: result.tokensBefore,
						firstKeptEntryId: effectiveFirstKeptEntryId,
						onHookMessages: params.onCompactionHookMessages
					});
					return {
						ok: true,
						compacted: true,
						result: {
							summary: result.summary,
							firstKeptEntryId: effectiveFirstKeptEntryId,
							tokensBefore: observedTokenCount ?? result.tokensBefore,
							tokensAfter,
							details: result.details,
							sessionId: transcriptRotation.sessionId,
							sessionFile: transcriptRotation.sessionFile
						}
					};
				} catch (err) {
					const fallbackThinking = pickFallbackThinkingLevel({
						message: formatErrorMessage(err),
						attempted: attemptedThinking
					});
					if (fallbackThinking) {
						log.warn(`[compaction] request rejected for ${provider}/${modelId}; retrying with ${fallbackThinking}`);
						thinkLevel = fallbackThinking;
						continue;
					}
					throw err;
				} finally {
					try {
						await flushPendingToolResultsAfterIdle({
							agent: session?.agent,
							sessionManager
						});
					} catch {}
					try {
						session?.dispose();
					} catch {}
				}
			}
		} finally {
			try {
				await bundleMcpRuntime?.dispose();
			} catch {}
			try {
				await bundleLspRuntime?.dispose();
			} catch {}
			await sessionLock.release();
		}
	} catch (err) {
		return fail(resolveCompactionFailureReason({
			reason: formatErrorMessage(err),
			safeguardCancelReason: consumeCompactionSafeguardCancelReason(compactionSessionManager)
		}), err);
	} finally {
		if (!checkpointSnapshotRetained) await compactionCheckpointStore.cleanupSnapshot(checkpointSnapshot);
		restoreSkillEnv?.();
	}
}
const testing = {
	hasRealConversationContent,
	hasMeaningfulConversationContent,
	containsRealConversationMessages,
	estimateTokensAfterCompaction,
	buildBeforeCompactionHookMetrics,
	hardenManualCompactionBoundary,
	resolveCompactionProviderStream,
	prepareCompactionSessionAgent,
	runBeforeCompactionHooks,
	runAfterCompactionHooks,
	runPostCompactionSideEffects
};
//#endregion
export { testing as __testing, testing, compactEmbeddedAgentSessionDirect };
