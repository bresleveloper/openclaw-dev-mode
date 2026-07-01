import { a as normalizeLowercaseStringOrEmpty } from "./string-coerce-DW4mBlAt.js";
import { o as isRecord } from "./record-coerce-DHZ4bFlT.js";
import { j as resolveTimerTimeoutMs, p as finiteSecondsToTimerSafeMilliseconds } from "./number-coercion-CJQ8TR--.js";
import { i as formatErrorMessage, u as toErrorObject } from "./errors-DCRXIYSQ.js";
import { n as isAbortError } from "./unhandled-rejections-QMGVkiWd.js";
import { n as createLazyPromiseLoader } from "./lazy-promise-BONnzNfb.js";
import { b as truncateUtf16Safe } from "./utils-BApvfmPs.js";
import { t as createSubsystemLogger } from "./subsystem-yNfG7O3v.js";
import { p as resolvePluginControlPlaneFingerprint } from "./current-plugin-metadata-snapshot-BcIVzXmF.js";
import "./defaults-mDjiWzE5.js";
import { u as resolveProviderRuntimePlugin } from "./provider-hook-runtime-C6uU9bTJ.js";
import { o as normalizeProviderId } from "./model-selection-normalize-Df7baLev.js";
import "./model-selection-i8V2iTdL.js";
import { ht as generateSummary$1 } from "./sessions-DP0wANEo.js";
import { a as buildStageSplitPlan, i as buildOversizedFallbackPlan, l as sanitizeCompactionMessages, o as buildSummaryChunks, r as buildHistoryPrunePlan, s as computeAdaptiveChunkRatio } from "./compaction-planning-ls7_woPy.js";
import { l as isTimeoutError } from "./failover-error-CZc6_Wx_.js";
import { n as retryAsync } from "./retry-DmzIk3Nv.js";
import { f as isGoogleModelApi } from "./embedded-agent-helpers-D_zioqUQ.js";
import { a as isMessagingToolSendAction } from "./embedded-agent-messaging-C11imqyu.js";
import { r as isDeliveredMessagingToolResult, t as hasMessagingDeliveryReceipt, v as isToolResultError } from "./embedded-agent-message-tool-source-reply-Bv3rRzLe.js";
import { u as shouldPreserveThinkingBlocks } from "./provider-replay-helpers-DtVD32X4.js";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";
import { Worker } from "node:worker_threads";
//#region src/agents/transcript-policy.ts
/**
* Transcript replay policy resolution.
* Combines provider plugin replay hooks with core transport fallbacks so chat
* history sanitization, tool IDs, thinking blocks, and turn validation align.
*/
const SIGNED_THINKING_PROVIDERS = new Set([
	"anthropic",
	"amazon-bedrock",
	"anthropic-vertex"
]);
/** Return true when a provider family owns signed thinking blocks. */
function providerRequiresSignedThinking(provider) {
	return SIGNED_THINKING_PROVIDERS.has(normalizeProviderId(provider ?? ""));
}
/** Decide whether signed thinking can be replayed under the current provider policy. */
function shouldAllowProviderOwnedThinkingReplay(params) {
	const hasProviderOwnedSignedThinking = params.policy.preserveSignatures || providerRequiresSignedThinking(params.provider);
	return isAnthropicApi(params.modelApi) && params.policy.validateAnthropicTurns && hasProviderOwnedSignedThinking && !params.policy.dropThinkingBlocks;
}
const DEFAULT_TRANSCRIPT_POLICY = {
	sanitizeMode: "images-only",
	sanitizeToolCallIds: false,
	toolCallIdMode: void 0,
	duplicateToolCallIdStyle: void 0,
	preserveNativeAnthropicToolUseIds: false,
	repairToolUseResultPairing: true,
	preserveSignatures: false,
	sanitizeThoughtSignatures: void 0,
	sanitizeThinkingSignatures: false,
	dropThinkingBlocks: false,
	dropReasoningFromHistory: false,
	applyGoogleTurnOrdering: false,
	validateGeminiTurns: false,
	validateAnthropicTurns: false,
	allowSyntheticToolResults: false
};
function isAnthropicApi(modelApi) {
	return modelApi === "anthropic-messages" || modelApi === "bedrock-converse-stream";
}
function isOpenAiResponsesCompatibleApi(modelApi) {
	return modelApi === "openai-responses" || modelApi === "openai-chatgpt-responses" || modelApi === "azure-openai-responses";
}
function isClaudeFamilyModelId(modelId) {
	const id = normalizeLowercaseStringOrEmpty(modelId);
	return /(?:^|[./:_-])claude(?:$|[./:_-])/.test(id);
}
function modelDisablesReasoningEffort(model) {
	return (model?.compat)?.supportsReasoningEffort === false;
}
function shouldPreserveReasoningContentReplay(params) {
	return params.model?.reasoning === true || requiresReasoningContentReplay(params.modelId);
}
/**
* Provides a narrow replay-policy fallback for providers that do not have an
* owning runtime plugin.
*
* This exists to preserve generic custom-provider behavior. Bundled providers
* should express replay ownership through `buildReplayPolicy` instead.
*/
function buildUnownedProviderTransportReplayFallback(params) {
	const isGoogle = isGoogleModelApi(params.modelApi);
	const isAnthropic = isAnthropicApi(params.modelApi);
	const isStrictOpenAiCompatible = params.modelApi === "openai-completions";
	const requiresOpenAiCompatibleToolIdSanitization = params.modelApi === "openai-completions" || params.modelApi === "openai-responses" || params.modelApi === "openai-chatgpt-responses" || params.modelApi === "azure-openai-responses";
	if (!isGoogle && !isAnthropic && !isStrictOpenAiCompatible && !requiresOpenAiCompatibleToolIdSanitization) return;
	const modelId = normalizeLowercaseStringOrEmpty(params.modelId);
	const isClaudeOpenAiResponses = isOpenAiResponsesCompatibleApi(params.modelApi) ? isClaudeFamilyModelId(modelId) : false;
	return {
		...isGoogle || isAnthropic ? { sanitizeMode: "full" } : {},
		...isGoogle || isAnthropic || requiresOpenAiCompatibleToolIdSanitization ? {
			sanitizeToolCallIds: true,
			toolCallIdMode: "strict"
		} : {},
		...isAnthropic ? { preserveSignatures: true } : {},
		...isGoogle ? { sanitizeThoughtSignatures: {
			allowBase64Only: true,
			includeCamelCase: true
		} } : {},
		...isAnthropic && modelId.includes("claude") ? { dropThinkingBlocks: !shouldPreserveThinkingBlocks(modelId) } : {},
		...isAnthropic && modelDisablesReasoningEffort(params.model) ? { dropThinkingBlocks: true } : {},
		...isStrictOpenAiCompatible ? { dropReasoningFromHistory: !shouldPreserveReasoningContentReplay(params) } : {},
		...isGoogle || isStrictOpenAiCompatible ? { applyAssistantFirstOrderingFix: true } : {},
		...isGoogle || isStrictOpenAiCompatible ? { validateGeminiTurns: true } : {},
		...isAnthropic || isStrictOpenAiCompatible || isClaudeOpenAiResponses ? { validateAnthropicTurns: true } : {},
		...isGoogle || isAnthropic || isOpenAiResponsesCompatibleApi(params.modelApi) ? { allowSyntheticToolResults: true } : {}
	};
}
const REASONING_CONTENT_REPLAY_MODEL_IDS = new Set([
	"kimi-for-coding",
	"kimi-k2.5",
	"kimi-k2.6",
	"kimi-k2.7-code",
	"kimi-k2-thinking",
	"kimi-k2-thinking-turbo",
	"mimo-v2-pro",
	"mimo-v2-omni",
	"mimo-v2.5",
	"mimo-v2.5-pro",
	"mimo-v2.6-pro"
]);
function requiresReasoningContentReplay(modelId) {
	const normalized = normalizeLowercaseStringOrEmpty(modelId);
	if (!normalized) return false;
	const parts = normalized.split("/").filter(Boolean);
	const finalPart = parts[parts.length - 1] ?? normalized;
	const candidates = [finalPart];
	const colonParts = finalPart.split(":").filter(Boolean);
	if (colonParts.length > 1) candidates.push(colonParts[0] ?? "", colonParts[colonParts.length - 1] ?? "");
	return candidates.some((candidate) => REASONING_CONTENT_REPLAY_MODEL_IDS.has(candidate));
}
function mergeTranscriptPolicy(policy, basePolicy = DEFAULT_TRANSCRIPT_POLICY) {
	if (!policy) return basePolicy;
	return {
		...basePolicy,
		...policy.sanitizeMode != null ? { sanitizeMode: policy.sanitizeMode } : {},
		...typeof policy.sanitizeToolCallIds === "boolean" ? { sanitizeToolCallIds: policy.sanitizeToolCallIds } : {},
		...policy.toolCallIdMode ? { toolCallIdMode: policy.toolCallIdMode } : {},
		...policy.duplicateToolCallIdStyle ? { duplicateToolCallIdStyle: policy.duplicateToolCallIdStyle } : {},
		...typeof policy.preserveNativeAnthropicToolUseIds === "boolean" ? { preserveNativeAnthropicToolUseIds: policy.preserveNativeAnthropicToolUseIds } : {},
		...typeof policy.repairToolUseResultPairing === "boolean" ? { repairToolUseResultPairing: policy.repairToolUseResultPairing } : {},
		...typeof policy.preserveSignatures === "boolean" ? { preserveSignatures: policy.preserveSignatures } : {},
		...policy.sanitizeThoughtSignatures ? { sanitizeThoughtSignatures: policy.sanitizeThoughtSignatures } : {},
		...typeof policy.dropThinkingBlocks === "boolean" ? { dropThinkingBlocks: policy.dropThinkingBlocks } : {},
		...typeof policy.dropReasoningFromHistory === "boolean" ? { dropReasoningFromHistory: policy.dropReasoningFromHistory } : {},
		...typeof policy.applyAssistantFirstOrderingFix === "boolean" ? { applyGoogleTurnOrdering: policy.applyAssistantFirstOrderingFix } : {},
		...typeof policy.validateGeminiTurns === "boolean" ? { validateGeminiTurns: policy.validateGeminiTurns } : {},
		...typeof policy.validateAnthropicTurns === "boolean" ? { validateAnthropicTurns: policy.validateAnthropicTurns } : {},
		...typeof policy.allowSyntheticToolResults === "boolean" ? { allowSyntheticToolResults: policy.allowSyntheticToolResults } : {}
	};
}
const transcriptPolicyCache = /* @__PURE__ */ new WeakMap();
function canCacheTranscriptPolicy(params) {
	if (!params.config) return false;
	return !params.env || params.env === process.env;
}
function resolveTranscriptPolicyCacheKey(params) {
	return JSON.stringify({
		provider: params.provider,
		modelApi: params.modelApi ?? "",
		modelId: params.modelId ?? "",
		dropsThinkingForReasoningCompat: modelDisablesReasoningEffort(params.model),
		preservesReasoningContentReplay: params.model?.reasoning === true,
		workspaceDir: params.workspaceDir ?? "",
		pluginControlPlane: resolvePluginControlPlaneFingerprint({
			config: params.config,
			workspaceDir: params.workspaceDir,
			env: params.env
		})
	});
}
/** Resolve and cache the effective replay policy for a provider/model/config tuple. */
function resolveTranscriptPolicy(params) {
	const provider = normalizeProviderId(params.provider ?? "");
	const cacheConfig = canCacheTranscriptPolicy(params) ? params.config : void 0;
	const cacheKey = cacheConfig ? resolveTranscriptPolicyCacheKey({
		...params,
		provider,
		config: cacheConfig
	}) : void 0;
	if (cacheConfig && cacheKey) {
		const cached = transcriptPolicyCache.get(cacheConfig)?.get(cacheKey);
		if (cached) return cached;
	}
	const runtimePlugin = params.runtimeHandle?.plugin ?? (provider ? resolveProviderRuntimePlugin({
		provider,
		modelId: params.modelId,
		config: params.config,
		workspaceDir: params.workspaceDir,
		env: params.env
	}) : void 0);
	const context = {
		config: params.config,
		workspaceDir: params.workspaceDir,
		env: params.env,
		provider,
		modelId: params.modelId ?? "",
		modelApi: params.modelApi,
		model: params.model
	};
	const buildReplayPolicy = runtimePlugin?.buildReplayPolicy;
	const policy = buildReplayPolicy ? mergeTranscriptPolicy(buildReplayPolicy(context) ?? void 0) : mergeTranscriptPolicy(buildUnownedProviderTransportReplayFallback({
		modelApi: params.modelApi,
		modelId: params.modelId,
		model: params.model
	}));
	if (cacheConfig && cacheKey) {
		let configCache = transcriptPolicyCache.get(cacheConfig);
		if (!configCache) {
			configCache = /* @__PURE__ */ new Map();
			transcriptPolicyCache.set(cacheConfig, configCache);
		}
		configCache.set(cacheKey, policy);
	}
	return policy;
}
//#endregion
//#region src/node-host/with-timeout.ts
/** Timeout wrapper for node-host operations using AbortSignal cancellation. */
/**
* AbortSignal-based timeout wrapper for node-host operations.
*
* The wrapper races work against an abort promise, clears timers/listeners on
* completion, and preserves object-shaped abort reasons as Error properties.
*/
/** Run work with an optional timeout and AbortSignal. */
async function withTimeout(work, timeoutMs, label) {
	const resolved = timeoutMs === void 0 ? void 0 : resolveTimerTimeoutMs(timeoutMs, 1);
	if (!resolved) return await work(void 0);
	const abortCtrl = new AbortController();
	const timeoutError = /* @__PURE__ */ new Error(`${label ?? "request"} timed out`);
	const timer = setTimeout(() => abortCtrl.abort(timeoutError), resolved);
	timer.unref?.();
	let abortListener;
	const abortPromise = abortCtrl.signal.aborted ? Promise.reject(toErrorObject(abortCtrl.signal.reason ?? timeoutError, "Non-Error rejection")) : new Promise((_, reject) => {
		abortListener = () => reject(toErrorObject(abortCtrl.signal.reason ?? timeoutError, "Non-Error rejection"));
		abortCtrl.signal.addEventListener("abort", abortListener, { once: true });
	});
	try {
		return await Promise.race([work(abortCtrl.signal), abortPromise]);
	} finally {
		clearTimeout(timer);
		if (abortListener) abortCtrl.signal.removeEventListener("abort", abortListener);
	}
}
//#endregion
//#region src/agents/embedded-agent-runner/compaction-safety-timeout.ts
/**
* Wraps compaction calls with a safety timeout and abort cleanup.
*/
const EMBEDDED_COMPACTION_TIMEOUT_MS = 18e4;
function createAbortError(signal) {
	const reason = "reason" in signal ? signal.reason : void 0;
	if (reason instanceof Error) return reason;
	const err = reason ? new Error("aborted", { cause: reason }) : /* @__PURE__ */ new Error("aborted");
	err.name = "AbortError";
	return err;
}
function composeAbortSignals(...signals) {
	const activeSignals = signals.filter((signal) => Boolean(signal));
	if (activeSignals.length <= 1) return {
		signal: activeSignals[0],
		cleanup: () => {}
	};
	const controller = new AbortController();
	const removers = [];
	const abortFrom = (signal) => {
		if (!controller.signal.aborted) controller.abort("reason" in signal ? signal.reason : void 0);
	};
	for (const signal of activeSignals) {
		if (signal.aborted) {
			abortFrom(signal);
			break;
		}
		const onAbort = () => abortFrom(signal);
		signal.addEventListener("abort", onAbort, { once: true });
		removers.push(() => signal.removeEventListener("abort", onAbort));
	}
	return {
		signal: controller.signal,
		cleanup: () => {
			for (const remove of removers) remove();
		}
	};
}
function resolveCompactionTimeoutMs(cfg) {
	return finiteSecondsToTimerSafeMilliseconds(cfg?.agents?.defaults?.compaction?.timeoutSeconds, { floorSeconds: true }) ?? EMBEDDED_COMPACTION_TIMEOUT_MS;
}
async function compactWithSafetyTimeout(compact, timeoutMs = EMBEDDED_COMPACTION_TIMEOUT_MS, opts) {
	let canceled = false;
	const cancel = () => {
		if (canceled) return;
		canceled = true;
		try {
			opts?.onCancel?.();
		} catch {}
	};
	return await withTimeout(async (timeoutSignal) => {
		let timeoutListener;
		let externalAbortListener;
		let externalAbortPromise;
		const abortSignal = opts?.abortSignal;
		const composedAbortSignal = composeAbortSignals(timeoutSignal, abortSignal);
		if (timeoutSignal) {
			timeoutListener = () => {
				cancel();
			};
			timeoutSignal.addEventListener("abort", timeoutListener, { once: true });
		}
		if (abortSignal) {
			if (abortSignal.aborted) {
				cancel();
				throw createAbortError(abortSignal);
			}
			externalAbortPromise = new Promise((_, reject) => {
				externalAbortListener = () => {
					cancel();
					reject(createAbortError(abortSignal));
				};
				abortSignal.addEventListener("abort", externalAbortListener, { once: true });
			});
		}
		try {
			const compactPromise = compact(composedAbortSignal.signal);
			if (externalAbortPromise) return await Promise.race([compactPromise, externalAbortPromise]);
			return await compactPromise;
		} finally {
			composedAbortSignal.cleanup();
			if (timeoutListener) timeoutSignal?.removeEventListener("abort", timeoutListener);
			if (externalAbortListener) abortSignal?.removeEventListener("abort", externalAbortListener);
		}
	}, timeoutMs, "Compaction");
}
/**
* Invoke a plugin-owned {@link ContextEngine.compact} bounded by the same
* finite safety timeout that protects native runtime compaction.
*
* Plugin context engines that advertise `ownsCompaction` previously had their
* `compact()` awaited with no timeout, no watchdog, and no abort signal — a
* slow or hung plugin compaction would hang the agent turn indefinitely. This
* wrapper closes that gap:
*  - the call is bounded by `timeoutMs` (host-resolved, default
*    {@link EMBEDDED_COMPACTION_TIMEOUT_MS}); on timeout it rejects with a
*    "Compaction timed out" error so the caller's existing failure handling
*    runs instead of hanging;
*  - the timeout signal and caller `abortSignal` are both raced against the
*    call (so a non-cooperating engine is still bounded) and threaded into the
*    `compact()` params (so cooperating engines can cancel their own in-flight
*    work).
*
* Callers keep their existing try/catch — a timeout or abort surfaces as a
* thrown error, never a silent hang.
*/
function compactContextEngineWithSafetyTimeout(contextEngine, params, timeoutMs = EMBEDDED_COMPACTION_TIMEOUT_MS, abortSignal) {
	return compactWithSafetyTimeout((compactAbortSignal) => contextEngine.compact(compactAbortSignal ? {
		...params,
		abortSignal: compactAbortSignal
	} : params), timeoutMs, abortSignal ? { abortSignal } : void 0);
}
//#endregion
//#region src/agents/compaction-planning-worker.ts
/**
* Runs CPU-heavy compaction planning in a worker thread when histories are
* large enough to risk starving the main event loop.
*/
const COMPACTION_PLANNING_WORKER_TIMEOUT_MS = 6e4;
const COMPACTION_PLANNING_WORKER_MIN_MESSAGES = 64;
var CompactionPlanningWorkerError = class extends Error {
	constructor(message, code) {
		super(message);
		this.code = code;
		this.name = "CompactionPlanningWorkerError";
	}
};
function resolveCompactionPlanningWorkerUrl(currentModuleUrl = import.meta.url) {
	const currentPath = fileURLToPath(currentModuleUrl);
	const distIndex = currentPath.replaceAll(path.sep, "/").lastIndexOf("/dist/");
	if (distIndex >= 0) {
		const distRoot = currentPath.slice(0, distIndex + 6);
		return pathToFileURL(path.join(distRoot, "agents", "compaction-planning.worker.js"));
	}
	const extension = path.extname(currentPath) || ".js";
	return new URL(`./compaction-planning.worker${extension}`, currentModuleUrl);
}
function runCompactionPlanningWorker(params) {
	if (params.signal?.aborted) return Promise.reject(toErrorObject(params.signal.reason ?? /* @__PURE__ */ new Error("compaction planning aborted"), "Non-Error rejection"));
	const workerUrl = params.workerUrl ?? resolveCompactionPlanningWorkerUrl();
	const sourceWorkerExecArgv = workerUrl.pathname.endsWith(".ts") ? ["--import", "tsx"] : void 0;
	let worker;
	try {
		worker = new Worker(workerUrl, {
			workerData: params.input,
			execArgv: sourceWorkerExecArgv
		});
	} catch (error) {
		return Promise.reject(new CompactionPlanningWorkerError(error instanceof Error ? error.message : String(error), "unavailable"));
	}
	worker.unref?.();
	return new Promise((resolve, reject) => {
		let settled = false;
		const timeout = setTimeout(() => {
			settle(() => reject(new CompactionPlanningWorkerError("compaction planning worker timed out", "timeout")), true);
		}, resolveTimerTimeoutMs(params.timeoutMs, COMPACTION_PLANNING_WORKER_TIMEOUT_MS));
		const abort = () => {
			settle(() => reject(toErrorObject(params.signal?.reason ?? /* @__PURE__ */ new Error("compaction planning aborted"), "Non-Error rejection")), true);
		};
		const settle = (finish, terminate) => {
			if (settled) return;
			settled = true;
			clearTimeout(timeout);
			params.signal?.removeEventListener("abort", abort);
			worker.removeAllListeners();
			if (terminate) worker.terminate();
			finish();
		};
		params.signal?.addEventListener("abort", abort, { once: true });
		worker.once("message", (message) => {
			settle(() => {
				if (message.status === "ok") {
					resolve(message.value);
					return;
				}
				reject(new CompactionPlanningWorkerError(message.error, "failed"));
			}, false);
		});
		worker.once("error", (error) => {
			const message = error instanceof Error ? error.message : String(error);
			settle(() => reject(new CompactionPlanningWorkerError(message, "unavailable")), true);
		});
		worker.once("exit", (code) => {
			if (code === 0) return;
			settle(() => reject(new CompactionPlanningWorkerError(`compaction planning worker exited with code ${code}`, "unavailable")), false);
		});
	});
}
function shouldFallbackToMainThread(error) {
	return error instanceof CompactionPlanningWorkerError && error.code === "unavailable";
}
function shouldUsePlanningWorker(messageCount) {
	return messageCount >= COMPACTION_PLANNING_WORKER_MIN_MESSAGES;
}
async function runWithUnavailableFallback(params) {
	try {
		const value = await runCompactionPlanningWorker({
			input: params.input,
			signal: params.signal
		});
		if (params.isExpected(value)) return value;
		throw new CompactionPlanningWorkerError("unexpected compaction planning worker result", "failed");
	} catch (error) {
		if (shouldFallbackToMainThread(error)) return params.fallback();
		throw error;
	}
}
/** Builds summary chunks, offloading large histories to the planning worker. */
async function buildSummaryChunksWithWorker(params) {
	const messages = sanitizeCompactionMessages(params.messages);
	if (!shouldUsePlanningWorker(messages.length)) return buildSummaryChunks(params);
	return (await runWithUnavailableFallback({
		input: {
			kind: "summaryChunks",
			messages,
			maxChunkTokens: params.maxChunkTokens
		},
		signal: params.signal,
		fallback: () => ({
			kind: "summaryChunks",
			chunks: buildSummaryChunks(params)
		}),
		isExpected: (valueCandidate) => valueCandidate.kind === "summaryChunks"
	})).chunks;
}
/** Builds an oversized-message fallback plan, using the worker when worthwhile. */
async function buildOversizedFallbackPlanWithWorker(params) {
	const messages = sanitizeCompactionMessages(params.messages);
	if (!shouldUsePlanningWorker(messages.length)) return buildOversizedFallbackPlan(params);
	const value = await runWithUnavailableFallback({
		input: {
			kind: "oversizedFallback",
			messages,
			contextWindow: params.contextWindow
		},
		signal: params.signal,
		fallback: () => ({
			kind: "oversizedFallback",
			...buildOversizedFallbackPlan(params)
		}),
		isExpected: (valueEntry) => valueEntry.kind === "oversizedFallback"
	});
	return {
		smallMessages: value.smallMessages,
		oversizedNotes: value.oversizedNotes
	};
}
/** Builds a staged summarization split plan with worker fallback. */
async function buildStageSplitPlanWithWorker(params) {
	const messages = sanitizeCompactionMessages(params.messages);
	if (!shouldUsePlanningWorker(messages.length)) return buildStageSplitPlan(params);
	const value = await runWithUnavailableFallback({
		input: {
			kind: "stageSplit",
			messages,
			maxChunkTokens: params.maxChunkTokens,
			parts: params.parts,
			minMessagesForSplit: params.minMessagesForSplit
		},
		signal: params.signal,
		fallback: () => ({
			kind: "stageSplit",
			...buildStageSplitPlan(params)
		}),
		isExpected: (valueResult) => valueResult.kind === "stageSplit"
	});
	return value.mode === "split" ? {
		mode: "split",
		chunks: value.chunks
	} : { mode: "single" };
}
/** Builds a history-pruning plan with worker fallback for large transcripts. */
async function buildHistoryPrunePlanWithWorker(params) {
	const messagesToSummarize = sanitizeCompactionMessages(params.messagesToSummarize);
	const turnPrefixMessages = sanitizeCompactionMessages(params.turnPrefixMessages);
	if (!shouldUsePlanningWorker(messagesToSummarize.length + turnPrefixMessages.length)) return buildHistoryPrunePlan(params);
	const value = await runWithUnavailableFallback({
		input: {
			kind: "historyPrune",
			messagesToSummarize,
			turnPrefixMessages,
			tokensBefore: params.tokensBefore,
			contextWindowTokens: params.contextWindowTokens,
			maxHistoryShare: params.maxHistoryShare,
			parts: params.parts
		},
		signal: params.signal,
		fallback: () => ({
			kind: "historyPrune",
			...buildHistoryPrunePlan(params)
		}),
		isExpected: (valueValue) => valueValue.kind === "historyPrune"
	});
	return {
		summarizableTokens: value.summarizableTokens,
		newContentTokens: value.newContentTokens,
		maxHistoryTokens: value.maxHistoryTokens,
		pruned: value.pruned
	};
}
/** Computes the adaptive compaction chunk ratio with worker fallback. */
async function computeAdaptiveChunkRatioWithWorker(params) {
	const messages = sanitizeCompactionMessages(params.messages);
	if (!shouldUsePlanningWorker(messages.length)) return computeAdaptiveChunkRatio(params.messages, params.contextWindow);
	return (await runWithUnavailableFallback({
		input: {
			kind: "adaptiveChunkRatio",
			messages,
			contextWindow: params.contextWindow
		},
		signal: params.signal,
		fallback: () => ({
			kind: "adaptiveChunkRatio",
			ratio: computeAdaptiveChunkRatio(params.messages, params.contextWindow)
		}),
		isExpected: (valueLocal) => valueLocal.kind === "adaptiveChunkRatio"
	})).ratio;
}
//#endregion
//#region src/agents/compaction.ts
const log$1 = createSubsystemLogger("compaction");
const DEFAULT_SUMMARY_FALLBACK = "No prior history.";
const MERGE_SUMMARIES_INSTRUCTIONS = [
	"Merge these partial summaries into a single cohesive summary.",
	"",
	"MUST PRESERVE:",
	"- Active tasks and their current status (in-progress, blocked, pending)",
	"- Batch operation progress (e.g., '5/17 items completed')",
	"- The last thing the user requested and what was being done about it",
	"- Decisions made and their rationale",
	"- TODOs, open questions, and constraints",
	"- Any commitments or follow-ups promised",
	"",
	"PRIORITIZE recent context over older history. The agent needs to know",
	"what it was doing, not just what was discussed."
].join("\n");
const IDENTIFIER_PRESERVATION_INSTRUCTIONS = "Preserve all opaque identifiers exactly as written (no shortening or reconstruction), including UUIDs, hashes, IDs, hostnames, IPs, ports, URLs, and file names.";
const generateSummaryCompat = generateSummary$1;
function resolveIdentifierPreservationInstructions(instructions) {
	const policy = instructions?.identifierPolicy ?? "strict";
	if (policy === "off") return;
	if (policy === "custom") {
		const custom = instructions?.identifierInstructions?.trim();
		return custom && custom.length > 0 ? custom : IDENTIFIER_PRESERVATION_INSTRUCTIONS;
	}
	return IDENTIFIER_PRESERVATION_INSTRUCTIONS;
}
/** Combines identifier-preservation and caller-provided compaction instructions. */
function buildCompactionSummarizationInstructions(customInstructions, instructions) {
	const custom = customInstructions?.trim();
	const identifierPreservation = resolveIdentifierPreservationInstructions(instructions);
	if (!identifierPreservation && !custom) return;
	if (!custom) return identifierPreservation;
	if (!identifierPreservation) return `Additional focus:\n${custom}`;
	return `${identifierPreservation}\n\nAdditional focus:\n${custom}`;
}
async function summarizeChunks(params) {
	if (params.messages.length === 0) return params.previousSummary ?? DEFAULT_SUMMARY_FALLBACK;
	const chunks = await buildSummaryChunksWithWorker({
		messages: params.messages,
		maxChunkTokens: params.maxChunkTokens,
		signal: params.signal
	});
	let summary = params.previousSummary;
	const effectiveInstructions = buildCompactionSummarizationInstructions(params.customInstructions, params.summarizationInstructions);
	let hasGeneratedChunk = false;
	for (const chunk of chunks) try {
		summary = await retryAsync(() => generateSummary(chunk, params.model, params.reserveTokens, params.apiKey, params.headers, params.signal, effectiveInstructions, summary), {
			attempts: 3,
			minDelayMs: 500,
			maxDelayMs: 5e3,
			jitter: .2,
			label: "compaction/generateSummary",
			shouldRetry: (err) => !isAbortError(err) && !isTimeoutError(err)
		});
		hasGeneratedChunk = true;
	} catch (err) {
		if (isAbortError(err) || isTimeoutError(err)) throw err;
		if (!hasGeneratedChunk) throw err;
		const completedChunks = chunks.indexOf(chunk);
		log$1.warn("chunk summarization failed after retries; partial summary available", {
			err,
			completedChunks,
			totalChunks: chunks.length
		});
		const partial = /* @__PURE__ */ new Error("partial summarization failure");
		partial.partialSummary = `${summary}\n\n[Partial summary: chunks 1-${completedChunks} of ${chunks.length} were summarized. Chunks ${completedChunks + 1}-${chunks.length} could not be processed.]`;
		throw partial;
	}
	return summary ?? DEFAULT_SUMMARY_FALLBACK;
}
function generateSummary(currentMessages, model, reserveTokens, apiKey, headers, signal, customInstructions, previousSummary) {
	if (generateSummary$1.length >= 8) return generateSummaryCompat(currentMessages, model, reserveTokens, apiKey, headers, signal, customInstructions, previousSummary);
	return generateSummaryCompat(currentMessages, model, reserveTokens, apiKey, signal, customInstructions, previousSummary);
}
/**
* Summarize with progressive fallback for handling oversized messages.
* If full summarization fails, tries partial summarization excluding oversized messages.
*/
async function summarizeWithFallback(params) {
	const { messages, contextWindow } = params;
	if (messages.length === 0) return params.previousSummary ?? DEFAULT_SUMMARY_FALLBACK;
	let partialSummaryFallback;
	try {
		return await summarizeChunks(params);
	} catch (fullError) {
		log$1.warn(`Full summarization failed: ${formatErrorMessage(fullError)}`);
		partialSummaryFallback = fullError.partialSummary;
	}
	const { smallMessages, oversizedNotes } = await buildOversizedFallbackPlanWithWorker({
		messages,
		contextWindow,
		signal: params.signal
	});
	if (smallMessages.length > 0 && smallMessages.length !== messages.length) try {
		return await summarizeChunks({
			...params,
			messages: smallMessages
		}) + (oversizedNotes.length > 0 ? `\n\n${oversizedNotes.join("\n")}` : "");
	} catch (partialError) {
		log$1.warn(`Partial summarization also failed: ${formatErrorMessage(partialError)}`);
		const retryPartial = partialError.partialSummary;
		if (retryPartial) partialSummaryFallback = retryPartial + (oversizedNotes.length > 0 ? `\n\n${oversizedNotes.join("\n")}` : "");
	}
	if (partialSummaryFallback) return partialSummaryFallback;
	return `Context contained ${messages.length} messages (${oversizedNotes.length} oversized). Summary unavailable due to size limits.`;
}
/** Summarizes history in multiple stages when a single pass would be too large. */
async function summarizeInStages(params) {
	const { messages } = params;
	if (messages.length === 0) return params.previousSummary ?? DEFAULT_SUMMARY_FALLBACK;
	const plan = await buildStageSplitPlanWithWorker({
		messages,
		maxChunkTokens: params.maxChunkTokens,
		parts: params.parts,
		minMessagesForSplit: params.minMessagesForSplit,
		signal: params.signal
	});
	if (plan.mode === "single") return summarizeWithFallback(params);
	const partialSummaries = [];
	for (const chunk of plan.chunks) partialSummaries.push(await summarizeWithFallback({
		...params,
		messages: chunk,
		previousSummary: void 0
	}));
	if (partialSummaries.length === 1) return partialSummaries[0];
	const summaryMessages = partialSummaries.map((summary) => ({
		role: "user",
		content: summary,
		timestamp: Date.now()
	}));
	const custom = params.customInstructions?.trim();
	const mergeInstructions = custom ? `${MERGE_SUMMARIES_INSTRUCTIONS}\n\n${custom}` : MERGE_SUMMARIES_INSTRUCTIONS;
	return summarizeWithFallback({
		...params,
		messages: summaryMessages,
		customInstructions: mergeInstructions
	});
}
/** Resolves a positive context-window token count from model metadata. */
function resolveContextWindowTokens(model) {
	const effective = model?.contextTokens ?? model?.contextWindow;
	return Math.max(1, Math.floor(effective ?? 2e5));
}
//#endregion
//#region src/agents/harness/tool-result-middleware.ts
/**
* Runs native harness tool-result middleware around tool execution results.
*/
const log = createSubsystemLogger("agents/harness");
const MAX_MIDDLEWARE_CONTENT_BLOCKS = 200;
const MAX_MIDDLEWARE_TEXT_CHARS = 1e5;
const MAX_MIDDLEWARE_IMAGE_DATA_CHARS = 5e6;
const MAX_MIDDLEWARE_CONTENT_DEPTH = 20;
const MAX_MIDDLEWARE_DETAILS_BYTES = 1e5;
const MAX_MIDDLEWARE_DETAILS_DEPTH = 20;
const MAX_MIDDLEWARE_DETAILS_KEYS = 1e3;
const NESTED_TOOL_RESULT_BLOCK_TYPES = new Set(["toolresult", "tool_result"]);
function isValidMiddlewareContentBlock(value) {
	if (!isRecord(value) || typeof value.type !== "string") return false;
	if (value.type === "text") return typeof value.text === "string" && value.text.length <= MAX_MIDDLEWARE_TEXT_CHARS;
	if (value.type === "image") return typeof value.mimeType === "string" && value.mimeType.trim().length > 0 && typeof value.data === "string" && value.data.length <= MAX_MIDDLEWARE_IMAGE_DATA_CHARS;
	return false;
}
function isValidMiddlewareDetails(value, state = {
	keys: 0,
	bytes: 0,
	seen: /* @__PURE__ */ new WeakSet()
}, depth = 0) {
	if (value === void 0 || value === null) return true;
	if (depth > MAX_MIDDLEWARE_DETAILS_DEPTH) return false;
	if (typeof value === "string") {
		state.bytes += value.length;
		return state.bytes <= MAX_MIDDLEWARE_DETAILS_BYTES;
	}
	if (typeof value === "number" || typeof value === "boolean") {
		state.bytes += String(value).length;
		return state.bytes <= MAX_MIDDLEWARE_DETAILS_BYTES;
	}
	if (typeof value !== "object") return false;
	if (state.seen.has(value)) return false;
	state.seen.add(value);
	if (Array.isArray(value)) {
		state.keys += value.length;
		if (state.keys > MAX_MIDDLEWARE_DETAILS_KEYS) return false;
		for (const entry of value) if (!isValidMiddlewareDetails(entry, state, depth + 1)) return false;
		return true;
	}
	for (const [key, entry] of Object.entries(value)) {
		state.keys += 1;
		state.bytes += key.length;
		if (state.keys > MAX_MIDDLEWARE_DETAILS_KEYS || state.bytes > MAX_MIDDLEWARE_DETAILS_BYTES) return false;
		if (!isValidMiddlewareDetails(entry, state, depth + 1)) return false;
	}
	return true;
}
function isValidMiddlewareToolResult(value) {
	if (!isRecord(value) || !Array.isArray(value.content)) return false;
	if (value.content.length > MAX_MIDDLEWARE_CONTENT_BLOCKS) return false;
	return value.content.every(isValidMiddlewareContentBlock) && isValidMiddlewareDetails(value.details);
}
function createMiddlewareContentCoerceState() {
	return {
		depth: 0,
		seen: /* @__PURE__ */ new Set()
	};
}
function descendMiddlewareContentCoerceState(value, state) {
	if (state.depth >= MAX_MIDDLEWARE_CONTENT_DEPTH) return;
	if (value !== null && typeof value === "object") {
		if (state.seen.has(value)) return;
		const seen = new Set(state.seen);
		seen.add(value);
		return {
			depth: state.depth + 1,
			seen
		};
	}
	return {
		depth: state.depth + 1,
		seen: state.seen
	};
}
function stringifyMiddlewareTextPayload(value) {
	const seen = /* @__PURE__ */ new WeakSet();
	try {
		return JSON.stringify(value, (_key, val) => {
			if (typeof val === "bigint") return val.toString();
			if (typeof val === "function" || typeof val === "symbol" || val === void 0) return;
			if (val !== null && typeof val === "object") {
				if (seen.has(val)) return;
				seen.add(val);
			}
			return val;
		});
	} catch {
		return;
	}
}
function coerceMiddlewareText(value, state = createMiddlewareContentCoerceState(), options = {}) {
	if (typeof value === "string") return value;
	if (typeof value === "number" || typeof value === "boolean" || typeof value === "bigint") return String(value);
	if (!isRecord(value)) return;
	const nextState = descendMiddlewareContentCoerceState(value, state);
	if (!nextState) return;
	for (const key of [
		"text",
		"output",
		"result",
		"message"
	]) {
		const text = coerceMiddlewareText(value[key], nextState, options);
		if (text !== void 0) return text;
	}
	const content = value.content;
	if (Array.isArray(content)) {
		const chunks = coerceMiddlewareContentArray(content, nextState, options).filter((block) => block.type === "text").map((block) => block.text).filter((text) => text.length > 0);
		return chunks.length > 0 ? chunks.join("\n") : void 0;
	}
	return stringifyMiddlewareTextPayload(value);
}
function appendMiddlewareContentBlock(blocks, block) {
	if (blocks.length >= MAX_MIDDLEWARE_CONTENT_BLOCKS) return;
	if (block.type !== "text") {
		blocks.push(block);
		return;
	}
	if (!block.text) return;
	const previous = blocks.at(-1);
	if (previous?.type !== "text") {
		blocks.push({
			type: "text",
			text: truncateUtf16Safe(block.text, MAX_MIDDLEWARE_TEXT_CHARS)
		});
		return;
	}
	const remainingChars = MAX_MIDDLEWARE_TEXT_CHARS - previous.text.length - 1;
	if (remainingChars <= 0) return;
	previous.text = `${previous.text}\n${truncateUtf16Safe(block.text, remainingChars)}`;
}
function coerceMiddlewareContentArray(content, state, options = {}) {
	const blocks = [];
	let inspectedBlocks = 0;
	for (const entry of content) {
		inspectedBlocks += 1;
		if (inspectedBlocks > MAX_MIDDLEWARE_CONTENT_BLOCKS || blocks.length >= MAX_MIDDLEWARE_CONTENT_BLOCKS) break;
		const coercedBlocks = coerceMiddlewareContentBlocks(entry, state, options);
		if (coercedBlocks.length > 0) {
			for (const block of coercedBlocks) {
				appendMiddlewareContentBlock(blocks, block);
				if (blocks.length >= MAX_MIDDLEWARE_CONTENT_BLOCKS) break;
			}
			continue;
		}
		const text = coerceMiddlewareText(entry, state, options);
		if (text) appendMiddlewareContentBlock(blocks, {
			type: "text",
			text: truncateUtf16Safe(text, MAX_MIDDLEWARE_TEXT_CHARS)
		});
	}
	return blocks;
}
function coerceMiddlewareContentBlocks(value, state = createMiddlewareContentCoerceState(), options = {}) {
	if (isValidMiddlewareContentBlock(value)) return [value];
	if (options.sanitizeContent === true && isRecord(value) && value.type === "text" && typeof value.text === "string") return [{
		type: "text",
		text: truncateUtf16Safe(value.text, MAX_MIDDLEWARE_TEXT_CHARS)
	}];
	if (!isRecord(value) || typeof value.type !== "string") return [];
	const normalizedType = value.type.toLowerCase();
	if (!NESTED_TOOL_RESULT_BLOCK_TYPES.has(normalizedType)) return [];
	const content = value.content;
	if (Array.isArray(content) && content.length > 0) {
		const nextState = descendMiddlewareContentCoerceState(value, state);
		return nextState ? coerceMiddlewareContentArray(content, nextState, options) : [];
	}
	const text = coerceMiddlewareText(content, state, options) ?? coerceMiddlewareText(value, state, options);
	if (!text) return [];
	return [{
		type: "text",
		text: truncateUtf16Safe(text, MAX_MIDDLEWARE_TEXT_CHARS)
	}];
}
function coerceMiddlewareToolResult(value, options = {}) {
	if (isValidMiddlewareToolResult(value)) return value;
	if (!isRecord(value) || !Array.isArray(value.content)) return;
	const content = [];
	const state = createMiddlewareContentCoerceState();
	let inspectedBlocks = 0;
	for (const block of value.content) {
		inspectedBlocks += 1;
		if (inspectedBlocks > MAX_MIDDLEWARE_CONTENT_BLOCKS) break;
		for (const coerced of coerceMiddlewareContentBlocks(block, state, options)) {
			content.push(coerced);
			if (content.length >= MAX_MIDDLEWARE_CONTENT_BLOCKS) break;
		}
		if (content.length >= MAX_MIDDLEWARE_CONTENT_BLOCKS) break;
	}
	if (content.length === 0) return;
	const details = isValidMiddlewareDetails(value.details) ? value.details : options.sanitizeDetails === true ? sanitizeMiddlewareDetailsValue(value.details) : void 0;
	if (details === void 0 && !isValidMiddlewareDetails(value.details)) return;
	const result = {
		...value,
		content,
		details
	};
	return isValidMiddlewareToolResult(result) ? result : void 0;
}
/**
* Coerce an arbitrary value into a JSON-safe shape that satisfies
* `isValidMiddlewareDetails`. Round-trips through `JSON.stringify` with a
* WeakSet replacer that drops functions, symbols, and `undefined`; coerces
* bigints to their decimal string form; breaks cycles at the offending
* reference; and collapses payloads larger than the validator byte cap to a
* `{ truncated, originalSizeBytes }` marker. Returns `null` for inputs that
* cannot be represented at all (top-level function/symbol/undefined).
*/
function sanitizeMiddlewareDetailsValue(value) {
	const seen = /* @__PURE__ */ new WeakSet();
	try {
		const serialized = JSON.stringify(value, (_key, val) => {
			if (typeof val === "bigint") return val.toString();
			if (val !== null && typeof val === "object") {
				if (seen.has(val)) return;
				seen.add(val);
			}
			return val;
		});
		if (serialized === void 0) return null;
		if (serialized.length > MAX_MIDDLEWARE_DETAILS_BYTES) return {
			truncated: true,
			originalSizeBytes: serialized.length
		};
		return JSON.parse(serialized);
	} catch {
		return null;
	}
}
/**
* Coerce an incoming tool result into a shape the validator will accept,
* before any middleware runs. Tool emitters legitimately produce raw
* dependency payloads on `details` (channel SDK objects with methods, exec
* traces with cycles back to the runner, large attachment metadata). The
* harness owes a registered middleware a JSON-safe view of that payload;
* subsequent middleware-side mutations are still validated strictly.
*/
function sanitizeToolResultForMiddleware(result) {
	const coerced = coerceMiddlewareToolResult(result, {
		sanitizeContent: true,
		sanitizeDetails: true
	});
	if (coerced) return coerced;
	if (result.details === void 0 || result.details === null) return result;
	if (isValidMiddlewareDetails(result.details)) return result;
	return {
		...result,
		details: sanitizeMiddlewareDetailsValue(result.details)
	};
}
function buildMiddlewareFailureResult() {
	return {
		content: [{
			type: "text",
			text: "Tool output unavailable due to post-processing error."
		}],
		details: {
			status: "error",
			middlewareError: true
		}
	};
}
function buildDeliveredMessagingFailureFallback(event, result) {
	if (event.isError === true || isToolResultError(result) || !isMessagingToolSendAction(event.toolName, event.args) || !isDeliveredMessagingToolResult({
		toolName: event.toolName,
		args: event.args,
		result
	}) || !hasMessagingDeliveryReceipt(result)) return;
	return {
		content: [{
			type: "text",
			text: "Message delivered, but result post-processing failed."
		}],
		details: {
			ok: true,
			deliveryStatus: "sent",
			middlewareWarning: "post-processing failed"
		}
	};
}
function reconcileDeliveredMessagingFailure(result, fallback) {
	return fallback && isRecord(result.details) && result.details.middlewareError === true ? fallback : result;
}
function createAgentToolResultMiddlewareRunner(ctx, handlers) {
	const middlewareContext = {
		...ctx,
		harness: ctx.harness ?? ctx.runtime
	};
	let resolvedHandlers = handlers;
	const resolvedHandlersLoader = createLazyPromiseLoader(async () => {
		const { loadAgentToolResultMiddlewaresForRuntime } = await import("./agent-tool-result-middleware-loader-DPPoam8O.js");
		return loadAgentToolResultMiddlewaresForRuntime({ runtime: ctx.runtime });
	});
	const resolveHandlers = async () => {
		if (resolvedHandlers) return resolvedHandlers;
		resolvedHandlers = await resolvedHandlersLoader.load();
		return resolvedHandlers;
	};
	return { async applyToolResultMiddleware(event) {
		const handlersForRun = await resolveHandlers();
		if (handlersForRun.length === 0) return event.result;
		const deliveredMessagingFallback = buildDeliveredMessagingFailureFallback(event, event.result);
		let current = sanitizeToolResultForMiddleware(event.result);
		for (const handler of handlersForRun) try {
			const coercedCandidate = coerceMiddlewareToolResult((await handler({
				...event,
				result: current
			}, middlewareContext))?.result ?? current);
			if (coercedCandidate) current = coercedCandidate;
			else {
				log.warn(`[${ctx.runtime}] discarded invalid tool result middleware output for ${truncateUtf16Safe(event.toolName, 120)}`);
				return reconcileDeliveredMessagingFailure(buildMiddlewareFailureResult(), deliveredMessagingFallback);
			}
		} catch {
			log.warn(`[${ctx.runtime}] tool result middleware failed for ${truncateUtf16Safe(event.toolName, 120)}`);
			return reconcileDeliveredMessagingFailure(buildMiddlewareFailureResult(), deliveredMessagingFallback);
		}
		return reconcileDeliveredMessagingFailure(current, deliveredMessagingFallback);
	} };
}
//#endregion
export { computeAdaptiveChunkRatioWithWorker as a, resolveCompactionTimeoutMs as c, shouldAllowProviderOwnedThinkingReplay as d, buildHistoryPrunePlanWithWorker as i, providerRequiresSignedThinking as l, resolveContextWindowTokens as n, compactContextEngineWithSafetyTimeout as o, summarizeInStages as r, compactWithSafetyTimeout as s, createAgentToolResultMiddlewareRunner as t, resolveTranscriptPolicy as u };
