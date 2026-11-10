import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { u as asPositiveFiniteNumber } from "./number-coercion-CkhMiRw8.mjs";
import { t as isAbortError } from "./abort-signal-C9DFO3n5.mjs";
import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { s as normalizeStaticProviderModelId } from "./model-ref-shared-BRJ3VRZV.mjs";
import { t as createSubsystemLogger } from "./subsystem-mStysHHC.mjs";
import { r as normalizeProviderId } from "./provider-id-D1VImdKk.mjs";
import { t as SessionTranscriptReadFenceError } from "./session-transcript-read-fence-error-DoYPfzaJ.mjs";
import { t as createLazyImportLoader } from "./lazy-promise-DGqyc4Y4.mjs";
import { b as registerAgentRunContext, o as clearAgentRunContext } from "./agent-run-registry-gmaPgO-n.mjs";
import { i as isIncognitoSessionKey } from "./incognito-session-key-BWpn88lo.mjs";
import { l as resolveAgentIdFromSessionKey, s as isUnscopedSessionKeySentinel } from "./session-key-CSDERtm3.mjs";
import { a as resolveMergedModelProviderConfig, r as findConfiguredProviderModel } from "./model-provider-config-wdC9jpCz.mjs";
import { _ as resolveDefaultAgentId } from "./agent-scope-config-fjA2T9Gz.mjs";
import { c as resolveSessionStorePathCore } from "./paths-YgcBNLgG.mjs";
import "./defaults-Bg930vxE.mjs";
import { n as findModelInCatalog } from "./model-catalog-lookup-BJKolYfz.mjs";
import { i as resolveModelExtraParamSources } from "./model-extra-params-HwiZgNCH.mjs";
import { c as resolveContextConfigProviderForRuntime } from "./openai-routing-Bm7d8DH8.mjs";
import { o as resolveSessionStorePathForScope } from "./session-store-path-BQkYPc4_.mjs";
import { m as isRenderablePayload } from "./reply-payload-BLX_BF2U.mjs";
import { o as resolveFreshSessionTotalTokens } from "./types-BGDhC4_W.mjs";
import "./session-transcript-read-fence-CgUG4J4j.mjs";
import { d as persistCompactionBoundaryWithSessionEntryAsync } from "./session-accessor-Czw4l8kI.mjs";
import { h as resolveSessionPinnedHarnessId } from "./agent-harness-session-key-zbrcLVpT.mjs";
import { l as updateSessionEntry } from "./session-accessor.entry-mutation-DgCGNicZ.mjs";
import "./sessions-CnzPI1yx.mjs";
import { n as resolveProjectedSessionContextTokens } from "./context-token-provenance-1ZLJbdqW.mjs";
import "./lanes-D7a4ntDu.mjs";
import "./model-selection-DdQ-ffuG.mjs";
import { t as isCliProvider } from "./model-selection-cli-CxV7VRIV.mjs";
import { a as resolveCliBackendConfig } from "./cli-backends-BzVT3JSM.mjs";
import { i as isCliRuntimeAliasForProvider } from "./model-runtime-aliases-DJRpB3Nd.mjs";
import { i as resolveSessionRuntimeOverrideForProvider, r as resolvePersistedSessionRuntimeId } from "./session-runtime-compat-BQN27lQg.mjs";
import { o as resolveModelContextTokenProjection } from "./context-XynHJtne.mjs";
import { t as resolveModelContextWindowProfile } from "./model-context-window-CoR3Uyg1.mjs";
import { o as resolveEffectiveAgentRuntime } from "./thinking-runtime-DuxsJR5q.mjs";
import { i as logVerbose } from "./globals-XVSoVbNQ.mjs";
import { d as resolveMaxActiveTranscriptBytes, u as refreshTranscriptByteCompactionLatch } from "./registry-BNFZRyO5.mjs";
import { S as resolveFollowupAbortSignal, _ as startFollowupRunPreAdoptionHeartbeat, u as refreshQueuedFollowupSession } from "./state-DNPW_vEt.mjs";
import { r as resolveSandboxConfigForAgent } from "./config-Bf089UPS.mjs";
import { s as withSandboxRuntimeStatusInWorker } from "./runtime-status-DWm-5zUj.mjs";
import { n as acknowledgeReplySessionTransition } from "./reply-run-registry.state-Hn_UqZjq.mjs";
import { l as isMemoryFlushPlanNativeProviderOwned } from "./memory-state-CrbG6eAa.mjs";
import { o as isBenignCompactionSkipResult } from "./compact-reasons-DEvuk_7a.mjs";
import { n as truncateUtf16WithEllipsis } from "./text-truncate-DrDnz8rI.mjs";
import { l as readSessionMessagesAsync, m as readSessionTranscriptAccountingAsync } from "./session-transcript-readers-ChK_-oGN.mjs";
import { n as MemoryFlushToolsUnavailableError } from "./core-coding-tools-htyTOKJv.mjs";
import "./queue-Cz-W2oxX.mjs";
import { a as resolveEmbeddedSessionContextLimits, d as appendPostCompactionRefreshPrompt, y as createDeferredEmbeddedRunLifecycleManager } from "./builtin-openclaw-CMvbELtK.mjs";
import { o as resolveBootstrapWarningSignaturesSeen } from "./bootstrap-budget-96UImSUD.mjs";
import "./sandbox-4O9XYRNc.mjs";
import { c as estimateMessagesTokens } from "./context-token-pressure-II9nRGTn.mjs";
import { t as resolveEffectiveCompactionReserveTokens } from "./agent-compaction-constants-DmXQuPyL.mjs";
import { r as createToolResultPromptProjectionState } from "./session-prompt-state-tij27tsD.mjs";
import { _ as resolveModelCallUrgency } from "./context-engine-maintenance-DybI5s-J.mjs";
import { t as SessionManager } from "./session-manager-Mve5HWCW.mjs";
import { n as incrementCompactionCount } from "./session-updates-gu7HvAu8.mjs";
import { i as buildRunEntrySelection } from "./agent-runner-run-params-BV7fcOwA.mjs";
import { t as runEmbeddedAgentEntry } from "./run-entry-Bh1g2wCR.mjs";
import { t as emitAgentRunStatusEvent } from "./agent-run-status-events-5OyxJInq.mjs";
import { n as buildModelResolveContext, t as buildEmbeddedRunExecutionParams, u as resolveRunThinkingLevelForFallbackCandidate } from "./agent-runner-utils-Bt2Yubym.mjs";
import { a as resolveCompactionCompletionNotice } from "./compaction-notice-BOmn1Ybv.mjs";
import { n as memoryFlushResultIsSilent, r as resolveMemoryFlushPlanForRun, t as isToolsMemoryFlushPlan } from "./memory-flush-plan-6cLd2wvw.mjs";
import crypto from "node:crypto";
import { resolveOpenAIResponsesServerCompactionPlan } from "@openclaw/ai/internal/openai-responses-payload-policy";
import { resolveAnthropicServerCompactionPlan } from "@openclaw/ai/internal/anthropic";
//#region src/auto-reply/reply/agent-runner-memory-runtime.ts
function followupUsesCliRuntime(params, runtimeId) {
	const provider = params.followupRun.run.provider;
	if (params.agentHarnessId) return isCliRuntimeAliasForProvider({
		provider,
		runtime: params.agentHarnessId,
		cfg: params.cfg
	});
	if (isCliProvider(provider, params.cfg)) return true;
	return [resolvePersistedSessionRuntimeId(params.sessionEntry), runtimeId].some((runtime) => isCliRuntimeAliasForProvider({
		provider,
		runtime,
		cfg: params.cfg
	}));
}
function resolveFollowupAgentRuntimeId(params) {
	if (params.agentHarnessId) return params.agentHarnessId;
	const matchingSessionEntry = params.sessionEntry?.sessionId === params.followupRun.run.sessionId ? params.sessionEntry : void 0;
	return resolveEffectiveAgentRuntime({
		cfg: params.cfg,
		provider: params.followupRun.run.provider,
		modelId: params.followupRun.run.model,
		agentId: params.followupRun.run.agentId ?? resolveDefaultAgentId(params.cfg),
		sessionKey: params.sessionKey ?? params.followupRun.run.sessionKey,
		sessionEntry: matchingSessionEntry
	});
}
function followupOwnsNativeCompaction(params, runtimeId) {
	return resolveCliBackendConfig(runtimeId, params.cfg, { agentId: params.followupRun.run.agentId })?.ownsNativeCompaction === true;
}
function resolveFollowupContextTokens({ cfg, followupRun, defaultModel, sessionEntry }, runtimeId) {
	const { provider } = followupRun.run;
	const model = followupRun.run.model ?? defaultModel;
	const catalogModel = findModelInCatalog((followupRun.run.thinkingCatalog ?? []).filter((entry) => runtimeId === "openclaw" ? !entry.nativeRuntime : entry.nativeRuntime === runtimeId), provider, model);
	const matchingSessionEntry = sessionEntry?.sessionId === followupRun.run.sessionId ? sessionEntry : void 0;
	const profile = resolveModelContextWindowProfile({
		catalogEntry: catalogModel,
		selected: matchingSessionEntry?.contextWindow
	});
	const projection = resolveModelContextTokenProjection({
		cfg,
		provider: resolveContextConfigProviderForRuntime({
			provider,
			runtimeId,
			config: cfg
		}),
		modelProvider: provider,
		model,
		modelContextWindow: profile.contextWindow || catalogModel?.contextWindowSource !== "synthetic" ? profile.contextTokens : void 0,
		modelContextTokens: catalogModel?.contextTokens,
		fallbackContextTokens: catalogModel?.contextWindow,
		allowAsyncLoad: false,
		allowCacheLookup: false
	});
	const projected = resolveProjectedSessionContextTokens({
		entry: matchingSessionEntry?.authProfileOverride === followupRun.run.authProfileId ? matchingSessionEntry : void 0,
		provider,
		model,
		agentHarnessId: runtimeId,
		authoredContextTokens: projection.authoredContextTokens,
		resolvedContextTokens: projection.contextTokens
	}) ?? 2e5;
	return profile.contextWindow && profile.contextTokens ? Math.min(projected, profile.contextTokens) : projected;
}
async function defersTokenCompactionToChatGPTBoundary(run) {
	const [{ getPreparedRuntimeAuthProfileStoreSnapshot }, { prepareAgentRuntimeAuth }, { resolvePreparedExtraParams }, { isChatGPTV2CompactionEligible }] = await Promise.all([
		import("./auth-profiles-Ci7Cc0l7.mjs"),
		import("./prepare-auth-B7skPlcR.mjs"),
		import("./extra-params-BfOPEciR.mjs"),
		import("./chatgpt-v2-compaction-PXeuVAFa.mjs")
	]);
	let route;
	try {
		route = prepareAgentRuntimeAuth({
			provider: run.provider,
			modelId: run.model,
			config: run.config,
			agentId: run.agentId,
			agentDir: run.agentDir,
			workspaceDir: run.workspaceDir,
			authProfileStore: getPreparedRuntimeAuthProfileStoreSnapshot(run.agentDir),
			sessionAuthProfileId: run.authProfileId,
			sessionAuthProfileSource: run.authProfileIdSource,
			harnessId: "openclaw"
		}).plan.modelRoute;
	} catch {
		return false;
	}
	return route !== void 0 && isChatGPTV2CompactionEligible({
		config: run.config,
		model: route,
		extraParams: resolvePreparedExtraParams({
			cfg: run.config,
			provider: run.provider,
			modelId: run.model,
			agentId: run.agentId,
			agentDir: run.agentDir,
			workspaceDir: run.workspaceDir
		}),
		compactionEnabled: run.config.agents?.defaults?.compaction?.enabled !== false,
		compactionReplayEnabled: true
	});
}
//#endregion
//#region src/auto-reply/reply/agent-runner-memory-transcript-context.ts
const toolResultTruncationRuntimeLoader = createLazyImportLoader(() => import("./tool-result-truncation-1V14VF2h.mjs"));
async function readPreflightTranscriptContextMessages(scope, signal) {
	const limits = resolveEmbeddedSessionContextLimits(scope.contextWindowTokens);
	const readLegacyProjection = async () => {
		signal?.throwIfAborted();
		const messages = await readSessionMessagesAsync(scope, {
			mode: "recent",
			maxMessages: limits.maxEvents,
			maxLines: limits.maxEvents,
			maxBytes: limits.maxBytes
		});
		signal?.throwIfAborted();
		return messages.filter((message) => !("excludeFromContext" in message && message.excludeFromContext === true));
	};
	if (!scope.storePath || !scope.sessionKey) return await readLegacyProjection();
	const target = {
		...scope,
		sessionKey: scope.sessionKey,
		storePath: scope.storePath
	};
	try {
		const context = await SessionManager.openModelContextAsync(target, {
			signal,
			limits
		});
		const messages = context.buildSessionContext().messages;
		if (messages.length > 0 || context.getEntries().length > 0) return messages;
		return await readLegacyProjection();
	} catch (error) {
		if (!(error instanceof Error) || error.message !== "Persisted legacy session transcripts require doctor/import migration before runtime use") throw error;
		return await readLegacyProjection();
	}
}
async function readSessionLogSnapshot(params) {
	params.abortSignal?.throwIfAborted();
	const agentId = params.agentId ?? resolveAgentIdFromSessionKey(params.sessionKey);
	if (!params.sessionId || !params.storePath || !agentId) return params.includeTurnTaint ? { turnTainted: true } : {};
	const scope = {
		agentId,
		sessionId: params.sessionId,
		...params.sessionKey ? { sessionKey: params.sessionKey } : {},
		storePath: params.storePath
	};
	try {
		const snapshot = await readSessionTranscriptAccountingAsync(scope, {
			includeByteSize: params.includeByteSize,
			includeTurnTaint: params.includeTurnTaint,
			includeUsage: params.includeUsage
		}, params.abortSignal);
		params.abortSignal?.throwIfAborted();
		return snapshot;
	} catch {
		params.abortSignal?.throwIfAborted();
		return params.includeTurnTaint ? { turnTainted: true } : {};
	}
}
function hasUsableProviderPromptUsage(usage) {
	return typeof usage?.promptTokens === "number" && Number.isFinite(usage.promptTokens) && usage.promptTokens > 0;
}
async function estimateProviderPromptTokens(messages, contextWindowTokens, priorPromptTokens = 0) {
	if (messages.length === 0) return Math.ceil(priorPromptTokens);
	const { truncateOversizedToolResultsInMessages } = await toolResultTruncationRuntimeLoader.load();
	const projected = truncateOversizedToolResultsInMessages(messages, contextWindowTokens, void 0, void 0, createToolResultPromptProjectionState()).messages;
	const tokens = estimateMessagesTokens(projected);
	return Number.isFinite(tokens) && tokens >= 0 ? Math.ceil(priorPromptTokens) + Math.ceil(tokens) : void 0;
}
async function estimatePromptTokensFromSessionTranscript({ abortSignal, ...params }, initialSnapshot) {
	const sessionId = normalizeOptionalString(params.sessionId);
	if (!sessionId) return;
	try {
		const snapshot = initialSnapshot ?? await readSessionLogSnapshot({
			agentId: params.agentId,
			sessionId,
			sessionKey: params.sessionKey,
			storePath: params.storePath,
			includeByteSize: true,
			includeUsage: true,
			abortSignal
		});
		const usage = snapshot.usage;
		const normalizedOutputTokens = usage?.outputTokens === void 0 ? void 0 : Math.ceil(usage.outputTokens);
		const providerUsage = hasUsableProviderPromptUsage(usage) ? usage : void 0;
		const messages = providerUsage ? providerUsage.trailingMessages : await readPreflightTranscriptContextMessages({
			...params,
			sessionId
		}, abortSignal);
		const promptTokens = await estimateProviderPromptTokens(messages, params.contextWindowTokens, providerUsage?.promptTokens);
		if (promptTokens === void 0) return;
		return {
			promptTokens,
			promptTokenSource: providerUsage ? messages.length > 0 ? "provider_usage_plus_prompt_projection" : "provider_usage" : "prompt_projection",
			...!providerUsage ? { promptIncludesOutput: true } : {},
			outputTokens: normalizedOutputTokens,
			transcriptByteSize: snapshot.byteSize
		};
	} catch (error) {
		abortSignal?.throwIfAborted();
		return error instanceof SessionTranscriptReadFenceError ? Promise.reject(error) : void 0;
	}
}
//#endregion
//#region src/auto-reply/reply/memory-flush-errors.ts
const MAX_FLUSH_ERROR_LENGTH = 200;
function resolveVisibleMemoryFlushErrorPayloads(payloads) {
	return (payloads ?? []).filter((payload) => payload.isError === true && isRenderablePayload(payload));
}
function buildVisibleMemoryFlushFailure(payloads) {
	const message = payloads.map((payload) => normalizeOptionalString(payload.text)).filter((text) => Boolean(text)).join("\n");
	return new Error(message || "Memory flush returned an error response");
}
function truncateMemoryFlushErrorMessage(err) {
	const message = normalizeOptionalString(formatErrorMessage(err)) || String(err);
	return truncateUtf16WithEllipsis(message, MAX_FLUSH_ERROR_LENGTH);
}
//#endregion
//#region src/auto-reply/reply/memory-flush.ts
function resolveEffectivePromptTokens(basePromptTokens, lastOutputTokens, promptTokenEstimate) {
	const base = Math.max(0, basePromptTokens ?? 0);
	const output = Math.max(0, lastOutputTokens ?? 0);
	const estimate = Math.max(0, promptTokenEstimate ?? 0);
	return base + output + estimate;
}
function resolveProjectedPromptTokens(persistedPromptTokens, promptTokenEstimate, transcript) {
	const project = (promptTokens, outputTokens) => typeof promptTokens === "number" ? resolveEffectivePromptTokens(promptTokens, outputTokens, promptTokenEstimate) : 0;
	return Math.max(project(persistedPromptTokens, transcript?.outputTokens), project(transcript?.promptTokens, transcript?.promptIncludesOutput ? void 0 : transcript?.outputTokens));
}
function estimatePromptTokensForMemoryFlush(prompt) {
	const trimmed = normalizeOptionalString(prompt);
	if (!trimmed) return;
	const tokens = asPositiveFiniteNumber(estimateMessagesTokens([{
		role: "user",
		content: trimmed,
		timestamp: Date.now()
	}]));
	return tokens === void 0 ? void 0 : Math.ceil(tokens);
}
function resolveCompactionThreshold(params) {
	const contextWindow = Math.max(1, Math.floor(params.contextWindowTokens));
	const reserveTokens = Math.max(0, Math.floor(params.reserveTokensFloor));
	return Math.max(0, contextWindow - reserveTokens, Math.floor(params.minimumThresholdTokens ?? 0));
}
function resolveResponsesServerCompactionThreshold(params) {
	const provider = params.provider?.trim();
	const modelId = params.modelId?.trim();
	if (!provider || !modelId) return;
	const normalizedProvider = normalizeProviderId(provider);
	const normalizeModelId = (value) => normalizeStaticProviderModelId(normalizedProvider, value).trim().toLowerCase();
	const providerConfig = resolveMergedModelProviderConfig(params.cfg, provider);
	const configuredModel = findConfiguredProviderModel(providerConfig, provider, modelId, normalizeModelId);
	const { defaultParams, modelParams } = resolveModelExtraParamSources({
		config: params.cfg,
		provider,
		modelId
	});
	const extraParams = {
		...defaultParams,
		...modelParams
	};
	const compactionModel = {
		provider,
		api: configuredModel?.api ?? providerConfig?.api,
		baseUrl: configuredModel?.baseUrl ?? providerConfig?.baseUrl,
		contextWindow: configuredModel?.contextWindow ?? params.contextWindowTokens
	};
	if (normalizedProvider === "anthropic") {
		if (extraParams.anthropicServerCompaction !== true) return;
		return resolveAnthropicServerCompactionPlan({
			...compactionModel,
			api: compactionModel.api ?? "anthropic-messages"
		}, extraParams).threshold;
	}
	return resolveOpenAIResponsesServerCompactionPlan({
		...compactionModel,
		api: compactionModel.api ?? (normalizedProvider === "openai" ? "openai-responses" : void 0),
		baseUrl: compactionModel.baseUrl ?? (normalizedProvider === "openai" ? "https://api.openai.com/v1" : void 0),
		compat: configuredModel?.compat,
		contextTokens: configuredModel?.contextTokens ?? params.contextWindowTokens
	}, extraParams).threshold;
}
function shouldRunMemoryFlush(params) {
	return Boolean(shouldRunPreflightCompaction(params) && params.entry && !hasAlreadyFlushedForCurrentCompaction(params.entry));
}
function shouldRunPreflightCompaction(params) {
	if (!params.entry) return false;
	const projectedTokens = asPositiveFiniteNumber(params.tokenCount);
	const totalTokens = projectedTokens === void 0 ? resolveFreshSessionTotalTokens(params.entry) : Math.floor(projectedTokens);
	return typeof totalTokens === "number" && totalTokens > 0 && params.threshold > 0 && totalTokens >= params.threshold;
}
/** One flush per compaction cycle, regardless of token or transcript-size trigger. */
function hasAlreadyFlushedForCurrentCompaction(entry) {
	const compactionCount = entry.compactionCount ?? 0;
	const lastFlushAt = entry.memoryFlush?.compactionCount;
	return typeof lastFlushAt === "number" && lastFlushAt === compactionCount;
}
//#endregion
//#region src/auto-reply/reply/agent-runner-memory.ts
const MAX_FLUSH_FAILURES = 3;
const preflightCompactionLog = createSubsystemLogger("auto-reply/preflight-compaction");
const memoryFlushLog = createSubsystemLogger("auto-reply/memory-flush");
const embeddedAgentRuntimeLoader = createLazyImportLoader(() => import("./embedded-agent-DyhWQz5W.mjs"));
const memoryFlushPreparationLoader = createLazyImportLoader(() => import("./memory-flush-prepare-C2H7-oTr.mjs"));
const TRANSCRIPT_OUTPUT_READ_BUFFER_TOKENS = 8192;
/** Compacts session context before a reply or after a completed direct command. */
async function runSessionCompactionIfNeeded(params) {
	const operatorAuthority = params.followupRun.operatorAuthority;
	const assertActive = () => {
		params.abortSignal?.throwIfAborted();
		operatorAuthority?.assertCurrent();
		if (params.authorize?.() === false) throw new Error("Session compaction maintenance is no longer active");
	};
	if (!params.sessionKey) return params.sessionEntry;
	let entry = params.sessionEntry ?? params.sessionStore?.[params.sessionKey];
	if (!entry?.sessionId) return entry;
	const runtimeParams = {
		...params,
		sessionEntry: entry
	};
	assertActive();
	const runtimeId = resolveFollowupAgentRuntimeId(runtimeParams);
	const isCli = followupUsesCliRuntime(runtimeParams, runtimeId);
	const ownsNativeCompaction = followupOwnsNativeCompaction(runtimeParams, runtimeId);
	if (isCli || ownsNativeCompaction) return entry;
	const isCodexRuntime = normalizeLowercaseStringOrEmpty(runtimeId) === "codex";
	const compactionSessionKey = params.sessionKey;
	const configuredAgentId = params.followupRun.run.agentId ?? resolveDefaultAgentId(params.cfg);
	const compactionAgentId = isUnscopedSessionKeySentinel(compactionSessionKey) ? configuredAgentId : resolveAgentIdFromSessionKey(compactionSessionKey, configuredAgentId);
	const compactionStorePath = resolveSessionStorePathForScope({
		agentId: compactionAgentId,
		sessionKey: compactionSessionKey,
		storePath: params.storePath ?? resolveSessionStorePathCore(params.cfg.session?.store, { agentId: compactionAgentId })
	});
	const compactionStore = params.sessionStore ?? { [compactionSessionKey]: entry };
	const compactionTarget = {
		agentId: compactionAgentId,
		sessionKey: compactionSessionKey,
		storePath: compactionStorePath
	};
	const readTranscriptSize = (sessionId) => readSessionLogSnapshot({
		...compactionTarget,
		sessionId,
		includeByteSize: true,
		includeUsage: false,
		abortSignal: params.abortSignal
	});
	const contextWindowTokens = resolveFollowupContextTokens(runtimeParams, runtimeId);
	const reserveTokensFloor = (resolveMemoryFlushPlanForRun({
		cfg: params.cfg,
		contextWindowTokens
	})?.plan)?.reserveTokensFloor ?? resolveEffectiveCompactionReserveTokens({
		contextTokenBudget: contextWindowTokens,
		reserveTokens: 2e4
	});
	const freshPersistedTokens = resolveFreshSessionTotalTokens(entry);
	const promptTokenEstimate = estimatePromptTokensForMemoryFlush(params.promptForEstimate ?? params.followupRun.prompt);
	const responsesServerCompactionThreshold = resolveResponsesServerCompactionThreshold({
		contextWindowTokens,
		cfg: params.cfg,
		provider: params.followupRun.run.provider,
		modelId: params.followupRun.run.model ?? params.defaultModel
	});
	const threshold = resolveCompactionThreshold({
		contextWindowTokens,
		reserveTokensFloor,
		minimumThresholdTokens: responsesServerCompactionThreshold
	});
	const freshNeedsOutputRead = typeof freshPersistedTokens === "number" && typeof promptTokenEstimate === "number" && threshold > 0 && freshPersistedTokens + promptTokenEstimate >= threshold - TRANSCRIPT_OUTPUT_READ_BUFFER_TOKENS;
	const maxActiveTranscriptBytes = resolveMaxActiveTranscriptBytes(params.cfg);
	const shouldCheckActiveTranscriptBytes = typeof maxActiveTranscriptBytes === "number";
	const transcriptUsageTokens = params.isHeartbeat || isCodexRuntime || typeof freshPersistedTokens === "number" && !freshNeedsOutputRead ? void 0 : await estimatePromptTokensFromSessionTranscript({
		...compactionTarget,
		abortSignal: params.abortSignal,
		sessionId: entry.sessionId,
		contextWindowTokens
	});
	const transcriptSizeSnapshot = shouldCheckActiveTranscriptBytes && transcriptUsageTokens?.transcriptByteSize === void 0 ? await readTranscriptSize(entry.sessionId) : void 0;
	assertActive();
	const activeTranscriptBytes = transcriptUsageTokens?.transcriptByteSize ?? transcriptSizeSnapshot?.byteSize;
	const exceedsTranscriptByteThreshold = typeof activeTranscriptBytes === "number" && typeof maxActiveTranscriptBytes === "number" && activeTranscriptBytes >= maxActiveTranscriptBytes;
	let terminalCompactionNoticeSent = false;
	const notifyCompaction = async (phase, text) => {
		terminalCompactionNoticeSent = phase !== "start";
		try {
			await params.onCompactionNotice?.(phase, text);
		} catch (err) {
			logVerbose(`preflightCompaction notice delivery failed: ${String(err)}`);
		}
	};
	const latch = entry.transcriptByteCompactionLatch;
	const refreshedTranscriptByteCompactionLatch = refreshTranscriptByteCompactionLatch(latch, entry.sessionId, maxActiveTranscriptBytes, activeTranscriptBytes);
	const transcriptByteCompactionLatched = exceedsTranscriptByteThreshold && refreshedTranscriptByteCompactionLatch !== void 0;
	if (refreshedTranscriptByteCompactionLatch !== latch) {
		const compactionCount = await incrementCompactionCount({
			...compactionTarget,
			amount: 0,
			expectedSession: entry,
			sessionStore: compactionStore,
			transcriptByteCompactionLatch: refreshedTranscriptByteCompactionLatch ?? null
		});
		assertActive();
		if (compactionCount === void 0) throw new Error("Session changed before byte-compaction progress could be cleared");
		entry = compactionStore[compactionSessionKey] ?? entry;
	}
	const shouldCompactByTranscriptBytes = exceedsTranscriptByteThreshold && !transcriptByteCompactionLatched;
	if (transcriptByteCompactionLatched) {
		await notifyCompaction("context_bounded");
		assertActive();
	}
	if (isCodexRuntime && !shouldCompactByTranscriptBytes) {
		logVerbose(`preflightCompaction skipped: sessionKey=${params.sessionKey} runtime=codex reason=codex_native_auto_compaction activeTranscriptBytes=${activeTranscriptBytes ?? "undefined"} maxActiveTranscriptBytes=${maxActiveTranscriptBytes ?? "undefined"}`);
		return entry;
	}
	const transcriptPromptTokens = transcriptUsageTokens?.promptTokens;
	const projectedTokenCount = resolveProjectedPromptTokens(freshPersistedTokens, promptTokenEstimate, transcriptUsageTokens);
	const tokenCountForCompaction = asPositiveFiniteNumber(projectedTokenCount);
	logVerbose(`preflightCompaction check: sessionKey=${params.sessionKey} tokenCount=${tokenCountForCompaction ?? freshPersistedTokens ?? "undefined"} contextWindow=${contextWindowTokens} threshold=${threshold} responsesServerCompactionThreshold=${responsesServerCompactionThreshold ?? "undefined"} isHeartbeat=${params.isHeartbeat} isCli=${isCli} persistedFresh=${entry?.totalTokensFresh === true} transcriptPromptTokens=${transcriptPromptTokens ?? "undefined"} transcriptPromptSource=${transcriptUsageTokens?.promptTokenSource ?? "undefined"} promptTokensEst=${promptTokenEstimate ?? "undefined"} activeTranscriptBytes=${activeTranscriptBytes ?? "undefined"} maxActiveTranscriptBytes=${maxActiveTranscriptBytes ?? "undefined"} sizeTrigger=${shouldCompactByTranscriptBytes} sizeTriggerLatched=${transcriptByteCompactionLatched}`);
	const shouldCompactByTokens = !params.isHeartbeat && shouldRunPreflightCompaction({
		entry,
		tokenCount: tokenCountForCompaction,
		threshold
	});
	if (!shouldCompactByTokens && !shouldCompactByTranscriptBytes) return entry;
	if (params.beforeCompaction) {
		const refreshed = await params.beforeCompaction(entry);
		assertActive();
		return runSessionCompactionIfNeeded({
			...params,
			sessionEntry: refreshed,
			beforeCompaction: void 0
		});
	}
	if (shouldCompactByTokens && !shouldCompactByTranscriptBytes && await defersTokenCompactionToChatGPTBoundary(params.followupRun.run)) {
		assertActive();
		return entry;
	}
	const compactionTrigger = shouldCompactByTranscriptBytes ? "transcript_bytes" : "tokens";
	logVerbose(`preflightCompaction triggered: sessionKey=${params.sessionKey} tokenCount=${tokenCountForCompaction ?? freshPersistedTokens ?? "undefined"} threshold=${threshold} trigger=${compactionTrigger} activeTranscriptBytes=${activeTranscriptBytes ?? "undefined"} maxActiveTranscriptBytes=${maxActiveTranscriptBytes ?? "undefined"}`);
	assertActive();
	params.onCompactionStart?.();
	let expectedSession = entry;
	let admissionTransition;
	let hostAccountingCommitted = false;
	const recordCompactionAccounting = async (acceptedEntry, tokensAfter, compactionKind, amount = 1) => {
		const postCompactionBytes = exceedsTranscriptByteThreshold ? (await readTranscriptSize(acceptedEntry.sessionId)).byteSize : void 0;
		assertActive();
		const transcriptByteCompactionLatch = typeof postCompactionBytes === "number" && typeof maxActiveTranscriptBytes === "number" && postCompactionBytes >= maxActiveTranscriptBytes ? {
			activeBytes: postCompactionBytes,
			sessionId: acceptedEntry.sessionId,
			maxBytes: maxActiveTranscriptBytes
		} : void 0;
		if (await incrementCompactionCount({
			...compactionTarget,
			sessionStore: compactionStore,
			amount,
			tokensAfter,
			compactionKind,
			expectedSession: acceptedEntry,
			transcriptByteCompactionLatch: transcriptByteCompactionLatch ?? null,
			authorize: () => {
				assertActive();
				return true;
			}
		}) === void 0) throw new Error("Session changed before compaction maintenance could be recorded");
	};
	const stopHeartbeat = startFollowupRunPreAdoptionHeartbeat(params.followupRun.turnAdoptionLifecycle, params.abortSignal);
	try {
		await notifyCompaction("start");
		assertActive();
		const result = await (await embeddedAgentRuntimeLoader.load()).compactEmbeddedAgentSession({
			sessionId: entry.sessionId,
			sessionKey: compactionSessionKey,
			sessionTarget: {
				...compactionTarget,
				sessionId: entry.sessionId
			},
			sandboxSessionKey: params.runtimePolicySessionKey,
			allowGatewaySubagentBinding: true,
			messageChannel: params.followupRun.run.messageProvider,
			clientCaps: params.followupRun.run.clientCaps,
			conversationToolPolicy: params.followupRun.run.conversationToolPolicy,
			groupId: entry.groupId ?? params.followupRun.run.groupId,
			groupChannel: entry.groupChannel ?? params.followupRun.run.groupChannel,
			groupSpace: entry.space ?? params.followupRun.run.groupSpace,
			senderId: params.followupRun.run.senderId,
			senderName: params.followupRun.run.senderName,
			senderUsername: params.followupRun.run.senderUsername,
			senderE164: params.followupRun.run.senderE164,
			inputProvenance: params.followupRun.run.inputProvenance,
			sessionFile: compactionSessionKey,
			workspaceDir: params.followupRun.run.workspaceDir,
			cwd: params.followupRun.run.cwd,
			agentDir: params.followupRun.run.agentDir,
			config: params.cfg,
			agentAccountId: params.followupRun.run.agentAccountId,
			conversationRoutePeerId: params.followupRun.run.conversationRoutePeerId,
			chatType: params.followupRun.run.chatType,
			skillsSnapshot: entry.skillsSnapshot ?? params.followupRun.run.skillsSnapshot,
			provider: params.followupRun.run.provider,
			model: params.followupRun.run.model,
			authProfileId: params.followupRun.run.authProfileId,
			authProfileIdSource: params.followupRun.run.authProfileIdSource,
			sessionEntry: entry,
			agentHarnessId: params.agentHarnessId ?? (entry.sessionId === params.followupRun.run.sessionId ? entry.modelSelectionLocked === true ? resolvePersistedSessionRuntimeId(entry) : runtimeId : void 0),
			modelSelectionLocked: entry.modelSelectionLocked === true,
			thinkLevel: params.followupRun.run.thinkLevel,
			bashElevated: params.followupRun.run.bashElevated,
			trigger: "budget",
			modelCallUrgency: resolveModelCallUrgency({
				...params.followupRun.run,
				trigger: params.isHeartbeat ? "heartbeat" : "user",
				currentInboundEventKind: params.followupRun.currentInboundEventKind
			}),
			force: true,
			forcePreflight: true,
			preflightRequired: true,
			preflightCompactionTrigger: compactionTrigger,
			deferOwningContextEngineCompaction: false,
			contextTokenBudget: contextWindowTokens,
			currentTokenCount: tokenCountForCompaction ?? freshPersistedTokens,
			ownerNumbers: params.followupRun.run.ownerNumbers,
			abortSignal: params.abortSignal
		}, {
			assertActive,
			sourceAuthority: {
				assertActive,
				operatorAuthority
			},
			requestBudget: params.compactionRequestBudget,
			pendingUserEntryId: params.pendingUserEntryId,
			...compactionTrigger === "transcript_bytes" && isCodexRuntime ? {
				transcriptBytePreflightHarness: "codex",
				...compactionTarget.storePath && typeof activeTranscriptBytes === "number" && typeof maxActiveTranscriptBytes === "number" ? { withCompactionPersistenceAsync: async (prepared) => {
					const committed = await persistCompactionBoundaryWithSessionEntryAsync({
						...compactionTarget,
						expectedLifecycleRevision: expectedSession.lifecycleRevision,
						expectedWriterRunId: expectedSession.activeWriterRunId,
						sessionId: expectedSession.sessionId
					}, {
						prepared,
						transcriptByteCompactionLatch: {
							activeBytes: activeTranscriptBytes,
							sessionId: expectedSession.sessionId,
							maxBytes: maxActiveTranscriptBytes
						}
					}, assertActive);
					hostAccountingCommitted = true;
					return committed;
				} } : {},
				onHostCompactionTranscriptSettled: async (commit) => {
					await recordCompactionAccounting(commit.entry, void 0, void 0, 0);
				}
			} : {},
			onHostCompactionCommitted: async (commit) => {
				await recordCompactionAccounting(commit.entry, commit.tokensAfter, commit.compactionKind, hostAccountingCommitted ? 0 : 1);
				hostAccountingCommitted = true;
			},
			onCommitted: (accepted) => {
				admissionTransition = accepted.admissionTransition;
				expectedSession = accepted.entry;
				entry = accepted.entry;
				compactionStore[compactionSessionKey] = accepted.entry;
				params.onCompactionCommitted?.(accepted);
			}
		});
		if (!result?.ok || !result.compacted) {
			assertActive();
			const reason = (result?.ok ? normalizeOptionalString(result.reason) : result?.reason) ?? "not_compacted";
			if (!exceedsTranscriptByteThreshold && result && isBenignCompactionSkipResult(result)) {
				await notifyCompaction("skipped");
				logVerbose(`preflightCompaction skipped: sessionKey=${params.sessionKey} reason=${reason}`);
				return entry;
			}
			preflightCompactionLog.warn(`preflight compaction failed: ${reason}`);
			if (exceedsTranscriptByteThreshold) {
				await recordCompactionAccounting(expectedSession, void 0, void 0, 0);
				assertActive();
				await notifyCompaction("context_bounded");
				return compactionStore[compactionSessionKey] ?? entry;
			}
			await notifyCompaction("incomplete");
			throw new Error(`Preflight compaction required but failed: ${reason}`);
		}
		if (params.replyOperation && admissionTransition) {
			await acknowledgeReplySessionTransition(params.replyOperation, admissionTransition);
			assertActive();
		}
		if (!hostAccountingCommitted) await recordCompactionAccounting(expectedSession, result.result?.tokensAfter, result.compactionKind);
		assertActive();
		entry = compactionStore[compactionSessionKey] ?? entry;
		const transcriptByteCompactionLatch = entry.transcriptByteCompactionLatch;
		if (transcriptByteCompactionLatch) preflightCompactionLog.warn("byte-triggered compaction left oversized history; continuing with bounded context", {
			sessionKey: compactionSessionKey,
			activeTranscriptBytes: transcriptByteCompactionLatch.activeBytes,
			maxActiveTranscriptBytes: transcriptByteCompactionLatch.maxBytes
		});
		await appendPostCompactionRefreshPrompt({
			cfg: params.cfg,
			followupRun: params.followupRun
		});
		assertActive();
		const notice = resolveCompactionCompletionNotice(result, Boolean(transcriptByteCompactionLatch));
		await notifyCompaction(notice.phase, notice.text);
		assertActive();
		entry = compactionStore[compactionSessionKey] ?? entry;
		const previousSessionId = params.followupRun.run.sessionId;
		params.followupRun.run.sessionId = entry.sessionId;
		params.onSessionIdChanged?.(entry.sessionId);
		const queueKey = params.followupRun.run.sessionKey ?? params.sessionKey;
		if (queueKey) {
			params.followupRun.run.sessionFile = queueKey;
			refreshQueuedFollowupSession({
				key: queueKey,
				previousSessionId,
				nextSessionId: entry.sessionId,
				nextSessionFile: queueKey
			});
		}
		return entry;
	} catch (err) {
		if (!terminalCompactionNoticeSent && !params.abortSignal?.aborted) await notifyCompaction("incomplete");
		throw err;
	} finally {
		stopHeartbeat?.();
	}
}
/** Runs pre-compaction memory flush when transcript state warrants it. */
async function runMemoryFlushIfNeeded(params) {
	const abortSignal = resolveFollowupAbortSignal({
		abortSignal: params.replyOperation?.abortSignal ?? params.abortSignal,
		operatorAuthority: params.followupRun.operatorAuthority
	});
	const assertMemoryFlushCurrent = () => {
		abortSignal?.throwIfAborted();
		params.followupRun.operatorAuthority?.assertCurrent();
	};
	const memoryFlushWritable = !params.sessionKey || await withSandboxRuntimeStatusInWorker({
		cfg: params.cfg,
		agentId: params.followupRun.run.agentId,
		sessionKey: params.sessionKey,
		classificationSessionKey: params.runtimePolicySessionKey
	}, {
		env: process.env,
		cwd: process.cwd(),
		assertCurrent: assertMemoryFlushCurrent
	}, async ({ sandboxed, workspaceAccess: access, classificationAgentId: agentId }) => !sandboxed || (access ?? resolveSandboxConfigForAgent(params.cfg, agentId).workspaceAccess) === "rw");
	let entry = params.sessionEntry ?? (params.sessionKey ? params.sessionStore?.[params.sessionKey] : void 0);
	if (entry?.incognito === true || isIncognitoSessionKey(params.sessionKey)) return {
		sessionEntry: entry,
		outcome: "skipped"
	};
	const runtimeParams = {
		...params,
		sessionEntry: entry
	};
	const runtimeId = resolveFollowupAgentRuntimeId(runtimeParams);
	const isCli = followupUsesCliRuntime(runtimeParams, runtimeId) || followupOwnsNativeCompaction(runtimeParams, runtimeId);
	if (!((memoryFlushWritable || isMemoryFlushPlanNativeProviderOwned()) && !params.isHeartbeat && !isCli)) return {
		sessionEntry: entry,
		outcome: "skipped"
	};
	const flushRunId = crypto.randomUUID();
	let flushRunRegistered = false;
	const recordFailure = (error) => recordMemoryFlushFailure(error, params, entry);
	const contextWindowTokens = resolveFollowupContextTokens(runtimeParams, runtimeId);
	let memoryFlushResolution;
	try {
		memoryFlushResolution = resolveMemoryFlushPlanForRun({
			cfg: params.cfg,
			contextWindowTokens
		});
	} catch (error) {
		return await recordFailure(error);
	}
	if (!memoryFlushResolution) return {
		sessionEntry: entry,
		outcome: "skipped"
	};
	const memoryFlushPlan = memoryFlushResolution.plan;
	if (!isToolsMemoryFlushPlan(memoryFlushPlan) && !memoryFlushWritable) return {
		sessionEntry: entry,
		outcome: "skipped"
	};
	const promptTokenEstimate = estimatePromptTokensForMemoryFlush(params.promptForEstimate ?? params.followupRun.prompt);
	const persistedPromptTokens = resolveFreshSessionTotalTokens(entry);
	const hasFreshPersistedPromptTokens = persistedPromptTokens !== void 0;
	const flushThreshold = Math.max(0, resolveCompactionThreshold({
		contextWindowTokens,
		reserveTokensFloor: memoryFlushPlan.reserveTokensFloor
	}) - Math.max(0, Math.floor(memoryFlushPlan.softThresholdTokens)));
	const shouldReadTranscriptForOutput = entry && hasFreshPersistedPromptTokens && typeof promptTokenEstimate === "number" && flushThreshold > 0 && persistedPromptTokens + promptTokenEstimate >= flushThreshold - TRANSCRIPT_OUTPUT_READ_BUFFER_TOKENS;
	const shouldReadTranscript = Boolean(entry && (!hasFreshPersistedPromptTokens || shouldReadTranscriptForOutput));
	const forceFlushTranscriptBytes = memoryFlushPlan.forceFlushTranscriptBytes;
	const sessionLogSnapshot = entry ? await readSessionLogSnapshot({
		agentId: params.followupRun.run.agentId,
		sessionId: params.followupRun.run.sessionId,
		sessionKey: params.sessionKey ?? params.followupRun.run.sessionKey,
		storePath: params.storePath,
		includeByteSize: asPositiveFiniteNumber(forceFlushTranscriptBytes) !== void 0,
		includeTurnTaint: true,
		includeUsage: shouldReadTranscript,
		abortSignal
	}) : void 0;
	assertMemoryFlushCurrent();
	const transcriptByteSize = sessionLogSnapshot?.byteSize;
	const shouldForceFlushByTranscriptSize = typeof transcriptByteSize === "number" && transcriptByteSize >= forceFlushTranscriptBytes;
	const transcriptUsageTokens = shouldReadTranscript && entry ? await estimatePromptTokensFromSessionTranscript({
		agentId: params.followupRun.run.agentId ?? resolveAgentIdFromSessionKey(params.sessionKey ?? params.followupRun.run.sessionKey),
		sessionId: entry.sessionId,
		sessionKey: params.sessionKey ?? params.followupRun.run.sessionKey,
		storePath: params.storePath,
		contextWindowTokens,
		abortSignal
	}, sessionLogSnapshot) : void 0;
	const transcriptPromptTokens = transcriptUsageTokens?.promptTokens;
	const transcriptOutputTokens = transcriptUsageTokens?.outputTokens;
	const shouldPersistTranscriptPromptTokens = transcriptPromptTokens !== void 0 && transcriptUsageTokens?.promptTokenSource !== "prompt_projection" && (persistedPromptTokens === void 0 || transcriptPromptTokens > persistedPromptTokens);
	assertMemoryFlushCurrent();
	if (entry && shouldPersistTranscriptPromptTokens) {
		const usageUpdate = {
			totalTokens: transcriptPromptTokens,
			totalTokensFresh: true,
			totalTokensVersion: 1
		};
		entry = {
			...entry,
			...usageUpdate
		};
		if (params.sessionKey && params.sessionStore) params.sessionStore[params.sessionKey] = entry;
		if (params.storePath && params.sessionKey) try {
			const updatedEntry = await updateSessionEntry({
				storePath: params.storePath,
				sessionKey: params.sessionKey
			}, () => usageUpdate, {
				skipMaintenance: true,
				takeCacheOwnership: true
			});
			if (updatedEntry) {
				entry = updatedEntry;
				if (params.sessionStore) params.sessionStore[params.sessionKey] = updatedEntry;
			}
		} catch (err) {
			logVerbose(`failed to persist derived prompt totalTokens: ${String(err)}`);
		}
	}
	const projectedTokenCount = resolveProjectedPromptTokens(asPositiveFiniteNumber(persistedPromptTokens), promptTokenEstimate, transcriptPromptTokens === 0 ? void 0 : transcriptUsageTokens);
	const tokenCountForFlush = asPositiveFiniteNumber(projectedTokenCount);
	logVerbose(`memoryFlush check: sessionKey=${params.sessionKey} tokenCount=${tokenCountForFlush ?? "undefined"} contextWindow=${contextWindowTokens} threshold=${flushThreshold} isHeartbeat=${params.isHeartbeat} isCli=${isCli} memoryFlushWritable=${memoryFlushWritable} compactionCount=${entry?.compactionCount ?? 0} memoryFlushCompactionCount=${entry?.memoryFlush?.compactionCount ?? "undefined"} persistedPromptTokens=${persistedPromptTokens ?? "undefined"} persistedFresh=${entry?.totalTokensFresh === true} promptTokensEst=${promptTokenEstimate ?? "undefined"} transcriptPromptTokens=${transcriptPromptTokens ?? "undefined"} transcriptOutputTokens=${transcriptOutputTokens ?? "undefined"} projectedTokenCount=${projectedTokenCount ?? "undefined"} transcriptBytes=${transcriptByteSize ?? "undefined"} forceFlushTranscriptBytes=${forceFlushTranscriptBytes} forceFlushByTranscriptSize=${shouldForceFlushByTranscriptSize}`);
	if (!(shouldRunMemoryFlush({
		entry,
		tokenCount: tokenCountForFlush,
		threshold: flushThreshold
	}) || shouldForceFlushByTranscriptSize && entry != null && !hasAlreadyFlushedForCurrentCompaction(entry))) return {
		sessionEntry: entry,
		outcome: "skipped"
	};
	logVerbose(`memoryFlush triggered: sessionKey=${params.sessionKey} tokenCount=${tokenCountForFlush ?? "undefined"} threshold=${flushThreshold}`);
	params.replyOperation?.setPhase("memory_flushing");
	let bootstrapPromptWarningSignaturesSeen = resolveBootstrapWarningSignaturesSeen(entry?.systemPromptReport ?? (params.sessionKey ? params.sessionStore?.[params.sessionKey]?.systemPromptReport : void 0));
	let persistenceToolCallSucceeded = false;
	let preparedAttempt;
	try {
		assertMemoryFlushCurrent();
		preparedAttempt = await (await memoryFlushPreparationLoader.load()).prepareMemoryFlushAttempt({
			...params,
			sessionEntry: entry,
			flushRunId,
			contextWindowTokens,
			memoryFlushWritable,
			abortSignal,
			assertCurrent: assertMemoryFlushCurrent,
			recordPersistenceToolSuccess: () => {
				persistenceToolCallSucceeded = true;
			}
		});
	} catch (error) {
		return await recordFailure(error);
	}
	if (!preparedAttempt) return {
		sessionEntry: entry,
		outcome: "skipped"
	};
	const { plan: activeMemoryFlushPlan, writePath: memoryFlushWritePath, systemPrompt: flushSystemPrompt, selection, preparedRunAdmission, memorySession, memoryAudience: flushMemoryAudience, memoryFlushTools, maintenanceRun, sourcePolicySessionKey } = preparedAttempt;
	const deferredLifecycle = createDeferredEmbeddedRunLifecycleManager({
		runId: flushRunId,
		sessionId: memorySession.sessionId,
		sessionKey: memorySession.sessionKey,
		sessionFile: memorySession.sessionFile,
		abortSignal
	});
	const flushedCompactionCount = entry?.compactionCount ?? 0;
	let visibleErrorPayloads = [];
	const parentRunId = params.opts?.runId;
	if (parentRunId) emitAgentRunStatusEvent({
		runId: parentRunId,
		sessionKey: params.sessionKey,
		phase: "memory_flushing"
	});
	const { turnAdoptionLifecycle } = params.followupRun;
	const stopHeartbeat = startFollowupRunPreAdoptionHeartbeat(turnAdoptionLifecycle, abortSignal);
	try {
		if (params.sessionKey) {
			registerAgentRunContext(flushRunId, {
				sessionKey: memorySession.sessionKey,
				sessionId: memorySession.sessionId,
				verboseLevel: params.resolvedVerboseLevel,
				isControlUiVisible: false,
				projectSessionActive: false,
				projectSessionLifecycle: false,
				projectSessionMessages: false
			});
			flushRunRegistered = true;
		}
		memoryFlushLog.debug("memory flush dispatched", {
			event: "memory_flush_dispatched",
			runId: flushRunId,
			sessionKey: memorySession.sessionKey,
			sessionId: memorySession.sessionId,
			sourceSessionKey: params.sessionKey,
			sourceSessionId: entry?.sessionId
		});
		const flushExecution = await runEmbeddedAgentEntry({
			preparedRunAdmission,
			modelResolve: {
				prompt: activeMemoryFlushPlan.prompt,
				awaitSessionDiffBaseline: params.followupRun.runObservers?.awaitSessionDiffBaseline,
				cwd: maintenanceRun.cwd,
				modelSelectionLocked: maintenanceRun.modelSelectionLocked,
				context: buildModelResolveContext({
					run: maintenanceRun,
					sessionCtx: {},
					hasRepliedRef: void 0,
					trigger: "memory"
				})
			},
			selection: buildRunEntrySelection(selection, params.followupRun.run),
			identity: {
				runId: flushRunId,
				agentId: params.followupRun.run.agentId,
				sessionId: memorySession.sessionId,
				sessionKey: memorySession.sessionKey,
				lane: "main"
			},
			harness: {
				workspaceDir: params.followupRun.run.workspaceDir,
				sessionKey: sourcePolicySessionKey,
				preparation: { kind: "direct" },
				resolveRuntimeOverride: (provider) => resolveSessionRuntimeOverrideForProvider({
					provider,
					entry,
					cfg: params.cfg
				})
			},
			behavior: { kind: "maintenance" },
			sessionOverride: { kind: "preserve" },
			abortSignal: deferredLifecycle.signal,
			runCandidate: async (provider, model, runOptions) => {
				const sessionRuntimeOverride = runOptions.agentHarnessRuntimeOverride;
				const candidateThinkLevel = resolveRunThinkingLevelForFallbackCandidate({
					cfg: params.cfg,
					provider,
					modelId: model,
					run: params.followupRun.run,
					catalog: params.followupRun.run.thinkingCatalog,
					agentId: params.followupRun.run.agentId,
					sessionKey: sourcePolicySessionKey,
					sessionEntry: entry,
					agentRuntime: sessionRuntimeOverride
				});
				const runBaseParams = await buildEmbeddedRunExecutionParams({
					run: {
						...maintenanceRun,
						thinkLevel: candidateThinkLevel
					},
					sessionCtx: {},
					hasRepliedRef: void 0,
					provider,
					model,
					runId: flushRunId,
					promptCacheKey: params.opts?.promptCacheKey,
					allowTransientCooldownProbe: runOptions.allowTransientCooldownProbe
				});
				const result = await (await embeddedAgentRuntimeLoader.load()).runEmbeddedAgent({
					preparedRunAdmission,
					...runBaseParams,
					awaitSessionDiffBaseline: params.followupRun.runObservers?.awaitSessionDiffBaseline,
					...memorySession,
					agentHarnessId: resolveSessionPinnedHarnessId(entry),
					agentHarnessRuntimeOverride: sessionRuntimeOverride,
					sandboxSessionKey: sourcePolicySessionKey,
					memoryAudience: flushMemoryAudience,
					allowGatewaySubagentBinding: true,
					silentExpected: true,
					allowEmptyAssistantReplyAsSilent: true,
					terminalReplyExpectation: "optional",
					trigger: "memory",
					contextTokenBudget: contextWindowTokens,
					memoryFlushWritePath,
					memoryFlushTools,
					initialTurnTainted: !params.followupRun.run.senderIsOwner || sessionLogSnapshot?.turnTainted === true,
					prompt: activeMemoryFlushPlan.prompt,
					transcriptPrompt: "",
					extraSystemPrompt: flushSystemPrompt,
					isFinalFallbackAttempt: runOptions.isFinalFallbackAttempt,
					resolvedModelSelection: runOptions.resolvedModelSelection,
					modelFallbacksOverride: runOptions.modelFallbacksOverride,
					bootstrapPromptWarningSignaturesSeen,
					bootstrapPromptWarningSignature: bootstrapPromptWarningSignaturesSeen.at(-1),
					abortSignal: deferredLifecycle.signal,
					onDeferredLifecycleOwner: deferredLifecycle.adopt,
					onDeferredLifecycleAbort: deferredLifecycle.abort,
					onRetryWait: deferredLifecycle.beginRetryWait,
					assistantErrorTranscript: runOptions.assistantErrorTranscript,
					authProfileFailurePolicy: runOptions.authProfileFailurePolicy,
					contextEngineLogicalTurnLease: runOptions.contextEngineLogicalTurnLease,
					onContextEngineTurnCandidate: runOptions.onContextEngineTurnCandidate
				});
				visibleErrorPayloads = resolveVisibleMemoryFlushErrorPayloads(result.payloads);
				bootstrapPromptWarningSignaturesSeen = resolveBootstrapWarningSignaturesSeen(result.meta?.systemPromptReport);
				return result;
			}
		});
		deferredLifecycle.signal.throwIfAborted();
		if (visibleErrorPayloads.length > 0) throw buildVisibleMemoryFlushFailure(visibleErrorPayloads);
		if (memoryFlushTools && !persistenceToolCallSucceeded && !memoryFlushResultIsSilent(flushExecution.result)) throw new Error("no persistence tool call succeeded");
		if (params.storePath && params.sessionKey) try {
			const updatedEntry = await updateSessionEntry({
				storePath: params.storePath,
				sessionKey: params.sessionKey
			}, async () => ({ memoryFlush: {
				kind: "succeeded",
				compactionCount: flushedCompactionCount
			} }), {
				skipMaintenance: true,
				takeCacheOwnership: true
			});
			if (updatedEntry) entry = updatedEntry;
		} catch (err) {
			logVerbose(`failed to persist memory flush metadata: ${String(err)}`);
		}
		return {
			sessionEntry: entry,
			outcome: "completed"
		};
	} catch (error) {
		if (error instanceof MemoryFlushToolsUnavailableError) {
			memoryFlushLog.warn(error.message);
			return {
				sessionEntry: entry,
				outcome: "skipped"
			};
		}
		return await recordFailure(error);
	} finally {
		stopHeartbeat?.();
		if (parentRunId && !abortSignal?.aborted) emitAgentRunStatusEvent({
			runId: parentRunId,
			sessionKey: params.sessionKey,
			phase: "preparing_context"
		});
		await deferredLifecycle.complete();
		if (flushRunRegistered) clearAgentRunContext(flushRunId);
		preparedRunAdmission.close();
		preparedAttempt.release();
	}
}
async function recordMemoryFlushFailure(error, run, initialSessionEntry) {
	let sessionEntry = initialSessionEntry;
	let outcome = "failed";
	if ((run.replyOperation?.abortSignal ?? run.abortSignal)?.aborted) {
		logVerbose("memory flush cancelled by its owner");
		return {
			sessionEntry,
			outcome
		};
	}
	const truncatedError = truncateMemoryFlushErrorMessage(error);
	const { sessionKey, storePath } = run;
	if (!isAbortError(error) && storePath && sessionKey) try {
		let failureCount = 0;
		const updatedEntry = await updateSessionEntry({
			storePath,
			sessionKey
		}, (currentEntry) => {
			failureCount = (currentEntry.memoryFlush?.kind === "failed" ? currentEntry.memoryFlush.failureCount : 0) + 1;
			return { memoryFlush: failureCount >= MAX_FLUSH_FAILURES ? {
				kind: "succeeded",
				compactionCount: currentEntry.compactionCount ?? 0
			} : {
				kind: "failed",
				...currentEntry.memoryFlush?.compactionCount !== void 0 ? { compactionCount: currentEntry.memoryFlush.compactionCount } : {},
				failureCount
			} };
		}, {
			skipMaintenance: true,
			takeCacheOwnership: true
		});
		if (updatedEntry) {
			sessionEntry = updatedEntry;
			if (run.sessionStore) run.sessionStore[sessionKey] = updatedEntry;
		} else failureCount = 0;
		logVerbose(`memory flush failed (attempt ${failureCount}/${MAX_FLUSH_FAILURES}): ${truncatedError}`);
		if (updatedEntry && failureCount >= MAX_FLUSH_FAILURES) {
			outcome = "exhausted";
			logVerbose(`memory flush exhausted: skipping flush for this compaction cycle after ${failureCount} consecutive failures`);
		}
	} catch (persistError) {
		logVerbose(`failed to persist memory flush failure metadata: ${String(persistError)}`);
	}
	else logVerbose(`memory flush run failed: ${String(error)}`);
	return {
		sessionEntry,
		outcome
	};
}
//#endregion
export { runSessionCompactionIfNeeded as n, runMemoryFlushIfNeeded as t };
