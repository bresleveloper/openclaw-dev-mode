import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { t as createLazyImportLoader } from "./lazy-promise-DGqyc4Y4.mjs";
import { n as isAbortError } from "./abort-signal-Z3A36sLL.mjs";
import { r as normalizeProviderId } from "./provider-id-DCtsDflE.mjs";
import { m as resolveDefaultAgentId } from "./agent-scope-config-IQKOEtZ4.mjs";
import { r as isIncognitoSessionKey } from "./session-key-CUi_tcgF.mjs";
import { l as resolveAgentIdFromSessionKey, s as isUnscopedSessionKeySentinel } from "./session-key-CBvmC8zz.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { t as createSubsystemLogger } from "./subsystem-DleLyu58.mjs";
import { s as normalizeStaticProviderModelId } from "./model-ref-shared-BgRrSHjn.mjs";
import { l as resolveSessionStorePathCore } from "./paths-CcMbq5NY.mjs";
import { a as resolveMergedModelProviderConfig, r as findConfiguredProviderModel } from "./model-provider-config-BbSyhfVf.mjs";
import { n as findModelInCatalog } from "./model-catalog-lookup-C3iQmurZ.mjs";
import { r as resolveModelExtraParamSources } from "./model-extra-params-BJQs6MZV.mjs";
import { c as resolveContextConfigProviderForRuntime } from "./openai-routing-BspGC-O6.mjs";
import { i as logVerbose } from "./globals-QODkv80i.mjs";
import { v as parseNonNegativeByteSize } from "./zod-schema-B-u3AXjg.mjs";
import { _ as registerAgentRunContext, a as clearAgentRunContext } from "./agent-run-registry-DO6Dg2r0.mjs";
import { f as isRenderablePayload } from "./reply-payload-B2ZQhznY.mjs";
import { s as isCliProvider } from "./model-selection-CaFyCMqp.mjs";
import { h as resolveSessionPinnedHarnessId } from "./agent-harness-session-key-CQ6tTBOH.mjs";
import { i as resolveCliBackendConfig } from "./cli-backends-SxX34tmf.mjs";
import { i as isCliRuntimeAliasForProvider } from "./model-runtime-aliases-CJA2j26Y.mjs";
import { i as resolveSessionRuntimeOverrideForProvider, r as resolvePersistedSessionRuntimeId } from "./session-runtime-compat-DmCrQjUt.mjs";
import { o as resolveEffectiveAgentRuntime } from "./thinking-runtime-Dvszh-e-.mjs";
import { v as resolveMemoryFlushPlan } from "./memory-state-D4zZpGOe.mjs";
import { u as estimateMessagesTokens } from "./compaction-planning-Cn8w0Co8.mjs";
import { d as selectSessionTranscriptLeafControlledPath, n as isSessionTranscriptLeafControl } from "./transcript-tree-3xvvNd9-.mjs";
import { o as resolveFreshSessionTotalTokens } from "./types-ByCc34Vn.mjs";
import { t as resolveEffectiveCompactionReserveTokens } from "./agent-compaction-constants-DmXQuPyL.mjs";
import { T as resolveSessionStorePathForScope } from "./session-accessor.sqlite-entry-BB2Zsfho.mjs";
import { j as persistCompactionBoundaryWithSessionEntrySync } from "./session-accessor-l-4ZHvKn.mjs";
import { l as updateSessionEntry } from "./session-accessor.reset-0gTJAhVB.mjs";
import { n as deriveContextPromptTokens, o as hasNonzeroUsage, u as normalizeUsage } from "./usage-XXLoqJQC.mjs";
import { f as withRecentSessionTranscriptActiveEvents, o as readSessionTranscriptActiveStats } from "./session-accessor.sqlite-active-events-Cnt-hBim.mjs";
import { l as prepareSystemAgentRunAdmission } from "./admitted-run-context-BNasoszr.mjs";
import { t as formatTokenCount } from "./token-format-o0FIe7MV.mjs";
import "./sessions-DE4llkPV.mjs";
import { i as resolveSandboxConfigForAgent } from "./config-B2J3OrFT.mjs";
import { n as resolveSandboxRuntimeStatus } from "./runtime-status-GvZUbuy9.mjs";
import { a as isBenignCompactionSkipResult } from "./compact-reasons-DQwVyt53.mjs";
import { p as startFollowupRunPreAdoptionHeartbeat, s as refreshQueuedFollowupSession } from "./state-B1aZH2hx.mjs";
import { a as readSessionMessagesAsync } from "./session-transcript-readers-Bmg2Zjrq.mjs";
import { m as appendPostCompactionRefreshPrompt, x as createDeferredEmbeddedRunLifecycleManager } from "./builtin-openclaw-CzzhJmXX.mjs";
import { s as resolveBootstrapWarningSignaturesSeen } from "./bootstrap-budget-DZWwd3xP.mjs";
import "./sandbox-BnX1IPPh.mjs";
import { r as createToolResultPromptProjectionState } from "./session-prompt-state-C1pwD4fu.mjs";
import { l as resolveFollowupAbortSignal } from "./drain-DGjQsdif.mjs";
import "./queue-BpCLKp2c.mjs";
import { n as incrementCompactionCount } from "./session-updates-CAatLhCF.mjs";
import { t as resolveContextTokens } from "./model-selection-context-BeRvhcDh.mjs";
import { t as createSessionMaintenanceFollowup } from "./run-M3H_q3MI.mjs";
import { t as runEmbeddedAgentEntry } from "./run-entry-DT0ooTWY.mjs";
import { t as emitAgentRunStatusEvent } from "./agent-run-status-events-CxQDXWoO.mjs";
import { l as resolveRunThinkingLevelForFallbackCandidate, t as buildEmbeddedRunExecutionParams, u as resolveModelFallbackOptions } from "./agent-runner-utils-zLJTnwL-.mjs";
import crypto from "node:crypto";
import { resolveOpenAIResponsesServerCompactionPlan } from "@openclaw/ai/internal/openai-responses-payload-policy";
import { resolveAnthropicServerCompactionPlan } from "@openclaw/ai/internal/anthropic";
//#region src/auto-reply/reply/memory-flush.ts
function resolveMaxActiveTranscriptBytes(cfg) {
	const parsed = parseNonNegativeByteSize(cfg?.agents?.defaults?.compaction?.maxActiveTranscriptBytes);
	return typeof parsed === "number" && parsed > 0 ? parsed : void 0;
}
function resolvePositiveTokenCount(value) {
	return typeof value === "number" && Number.isFinite(value) && value > 0 ? Math.floor(value) : void 0;
}
function resolveEffectivePromptTokens(basePromptTokens, lastOutputTokens, promptTokenEstimate) {
	const base = Math.max(0, basePromptTokens ?? 0);
	const output = Math.max(0, lastOutputTokens ?? 0);
	const estimate = Math.max(0, promptTokenEstimate ?? 0);
	return base + output + estimate;
}
/** Resolves the blocking threshold using the selected reserve and server floor. */
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
	if (normalizedProvider === "anthropic") return resolveAnthropicServerCompactionPlan({
		provider,
		api: configuredModel?.api ?? providerConfig?.api ?? "anthropic-messages",
		baseUrl: configuredModel?.baseUrl ?? providerConfig?.baseUrl,
		contextWindow: configuredModel?.contextWindow ?? params.contextWindowTokens
	}, extraParams).threshold;
	const defaultOpenAIBaseUrl = normalizedProvider === "openai" ? "https://api.openai.com/v1" : void 0;
	return resolveOpenAIResponsesServerCompactionPlan({
		provider,
		api: configuredModel?.api ?? providerConfig?.api ?? (normalizedProvider === "openai" ? "openai-responses" : void 0),
		baseUrl: configuredModel?.baseUrl ?? providerConfig?.baseUrl ?? defaultOpenAIBaseUrl,
		compat: configuredModel?.compat,
		contextTokens: configuredModel?.contextTokens ?? params.contextWindowTokens,
		contextWindow: configuredModel?.contextWindow ?? params.contextWindowTokens
	}, extraParams).threshold;
}
function shouldRunMemoryFlush(params) {
	return Boolean(shouldRunPreflightCompaction(params) && params.entry && !hasAlreadyFlushedForCurrentCompaction(params.entry));
}
function shouldRunPreflightCompaction(params) {
	if (!params.entry) return false;
	const totalTokens = resolvePositiveTokenCount(params.tokenCount) ?? resolveFreshSessionTotalTokens(params.entry);
	return typeof totalTokens === "number" && totalTokens > 0 && params.threshold > 0 && totalTokens >= params.threshold;
}
/**
* Returns true when a memory flush has already been performed for the current
* compaction cycle. This prevents repeated flush runs within the same cycle —
* important for both the token-based and transcript-size–based trigger paths.
*/
function hasAlreadyFlushedForCurrentCompaction(entry) {
	const compactionCount = entry.compactionCount ?? 0;
	const lastFlushAt = entry.memoryFlush?.compactionCount;
	return typeof lastFlushAt === "number" && lastFlushAt === compactionCount;
}
//#endregion
//#region src/auto-reply/reply/agent-runner-memory.ts
const MAX_VISIBLE_MEMORY_FLUSH_ERROR_CHARS = 600;
const MAX_FLUSH_FAILURES = 3;
const MAX_FLUSH_ERROR_LENGTH = 200;
const preflightCompactionLog = createSubsystemLogger("auto-reply/preflight-compaction");
const memoryFlushLog = createSubsystemLogger("auto-reply/memory-flush");
const embeddedAgentRuntimeLoader = createLazyImportLoader(() => import("./embedded-agent-BakffRTS.mjs"));
const memoryFlushSessionRuntimeLoader = createLazyImportLoader(() => import("./memory-flush-session-BWY96Owb.mjs"));
const toolResultTruncationRuntimeLoader = createLazyImportLoader(() => import("./tool-result-truncation-CdYzZ_wX.mjs"));
async function compactEmbeddedAgentSession(...args) {
	return await (await embeddedAgentRuntimeLoader.load()).compactEmbeddedAgentSession(...args);
}
async function runEmbeddedAgent(params) {
	return await (await embeddedAgentRuntimeLoader.load()).runEmbeddedAgent(params);
}
function hasMatchingTranscriptByteCompactionLatch(entry, activeBytes, maxBytes) {
	const latch = entry.transcriptByteCompactionLatch;
	return latch?.sessionId === entry.sessionId && latch.maxBytes === maxBytes && activeBytes >= maxBytes && activeBytes - latch.activeBytes < maxBytes;
}
function estimatePromptTokensForMemoryFlush(prompt) {
	const trimmed = normalizeOptionalString(prompt);
	if (!trimmed) return;
	const tokens = estimateMessagesTokens([{
		role: "user",
		content: trimmed,
		timestamp: Date.now()
	}]);
	if (!Number.isFinite(tokens) || tokens <= 0) return;
	return Math.ceil(tokens);
}
function resolveMemoryFlushModelFallbackOptions(run, model, configOverride = run.config) {
	const options = resolveModelFallbackOptions(run, configOverride);
	const override = normalizeOptionalString(model);
	if (!override) return options;
	const slashIdx = override.indexOf("/");
	if (slashIdx > 0) {
		const overrideProvider = override.slice(0, slashIdx).trim();
		const overrideModel = override.slice(slashIdx + 1).trim();
		if (overrideProvider && overrideModel) return {
			...options,
			provider: overrideProvider,
			model: overrideModel,
			requestedRouteResolution: "raw",
			fallbacksOverride: []
		};
	}
	return {
		...options,
		model: override,
		requestedRouteResolution: "raw",
		fallbacksOverride: []
	};
}
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
function resolveFollowupContextTokens({ cfg, followupRun, defaultModel }, runtimeId) {
	const { provider } = followupRun.run;
	const model = followupRun.run.model ?? defaultModel;
	const catalogModel = findModelInCatalog(followupRun.run.thinkingCatalog ?? [], provider, model);
	return resolveContextTokens({
		cfg,
		provider: resolveContextConfigProviderForRuntime({
			provider,
			runtimeId,
			config: cfg
		}),
		model,
		modelContextWindow: catalogModel?.contextWindow,
		modelContextTokens: catalogModel?.contextTokens
	});
}
function resolveVisibleMemoryFlushErrorPayloads(payloads) {
	return (payloads ?? []).filter((payload) => payload.isError === true && isRenderablePayload(payload));
}
function buildVisibleMemoryFlushFailure(payloads) {
	const message = payloads.map((payload) => normalizeOptionalString(payload.text)).filter((text) => Boolean(text)).join("\n");
	return new Error(message || "Memory flush returned an error response");
}
function buildMemoryFlushErrorPayload(err) {
	if (isAbortError(err)) return;
	const message = normalizeOptionalString(formatErrorMessage(err));
	if (!message) return;
	const visibleText = message.startsWith("⚠️") ? message : `⚠️ ${message}`;
	return {
		text: visibleText.length > MAX_VISIBLE_MEMORY_FLUSH_ERROR_CHARS ? `${truncateUtf16Safe(visibleText, 599)}…` : visibleText,
		isError: true
	};
}
function truncateMemoryFlushErrorMessage(err) {
	const message = normalizeOptionalString(formatErrorMessage(err)) || String(err);
	return message.length > MAX_FLUSH_ERROR_LENGTH ? `${truncateUtf16Safe(message, 199)}…` : message;
}
function hasUsableProviderPromptUsage(usage) {
	return typeof usage?.promptTokens === "number" && Number.isFinite(usage.promptTokens) && usage.promptTokens > 0;
}
function isUnavailableContextBarrier(usage) {
	if (usage.contextUsage?.state !== "unavailable") return false;
	return [
		usage.input,
		usage.output,
		usage.cacheRead,
		usage.cacheWrite,
		usage.total
	].every((value) => !(typeof value === "number" && value > 0));
}
const TRANSCRIPT_OUTPUT_READ_BUFFER_TOKENS = 8192;
const SQLITE_USAGE_TAIL_MAX_EVENTS = 512;
function deriveTranscriptUsageSnapshot(usage, trailingMessages) {
	const promptTokens = deriveContextPromptTokens({ lastCallUsage: usage });
	const outputRaw = usage.output;
	const outputTokens = typeof outputRaw === "number" && Number.isFinite(outputRaw) && outputRaw > 0 ? outputRaw : void 0;
	if (!(typeof promptTokens === "number") && !(typeof outputTokens === "number")) return;
	return {
		promptTokens,
		outputTokens,
		trailingMessages
	};
}
function readTranscriptAccountingSnapshot(visit, options) {
	let scanUsage = options.includeUsage;
	let scanTaint = options.includeTurnTaint === true;
	let latestUsage;
	const trailingMessages = [];
	let boundaryFound = false;
	let tainted = false;
	let eventCount = 0;
	let hasLeafControl = false;
	visit((event) => {
		eventCount += 1;
		hasLeafControl ||= isSessionTranscriptLeafControl(event);
		if (!event || typeof event !== "object" || Array.isArray(event)) return;
		const record = event;
		const message = record.message && typeof record.message === "object" && !Array.isArray(record.message) ? record.message : void 0;
		if (scanUsage) {
			const rawUsage = message?.usage ?? record.usage;
			if (record.type === "compaction" || record.type === "reset" || message?.api === "cli" && rawUsage && rawUsage.contextUsage === void 0) {
				scanUsage = false;
				trailingMessages.length = 0;
			} else {
				const usage = normalizeUsage(rawUsage);
				if (usage && isUnavailableContextBarrier(usage)) {
					scanUsage = false;
					trailingMessages.length = 0;
				} else if (usage && hasNonzeroUsage(usage)) {
					latestUsage = usage;
					scanUsage = false;
				} else if (message) trailingMessages.push(message);
			}
		}
		if (scanTaint && message) {
			if (message.role === "user") {
				boundaryFound = true;
				scanTaint = false;
			} else {
				const metadata = message["__openclaw"];
				if (metadata && typeof metadata === "object" && !Array.isArray(metadata)) {
					const openClaw = metadata;
					if (openClaw.turnTainted === true || openClaw.resultContentSource === "network") {
						tainted = true;
						scanTaint = false;
					}
				}
			}
		}
	});
	return {
		boundaryFound,
		eventCount,
		hasLeafControl,
		tainted,
		usage: latestUsage ? deriveTranscriptUsageSnapshot(latestUsage, trailingMessages.toReversed()) : void 0
	};
}
function readSessionLogSnapshot(params) {
	const agentId = params.agentId ?? resolveAgentIdFromSessionKey(params.sessionKey);
	if (!params.sessionId || !params.storePath || !agentId) return params.includeTurnTaint ? { turnTainted: true } : {};
	const scope = {
		agentId,
		sessionId: params.sessionId,
		...params.sessionKey ? { sessionKey: params.sessionKey } : {},
		storePath: params.storePath
	};
	const snapshot = {};
	try {
		if (params.includeByteSize) {
			const stats = readSessionTranscriptActiveStats(scope);
			snapshot.byteSize = stats.sizeBytes;
			snapshot.eventCount = stats.eventCount;
		}
		if (params.includeUsage || params.includeTurnTaint) {
			const accounting = withRecentSessionTranscriptActiveEvents(scope, params.usageEventLimit ?? SQLITE_USAGE_TAIL_MAX_EVENTS, (visit) => {
				const result = readTranscriptAccountingSnapshot(visit, params);
				if (!result.hasLeafControl) return result;
				const events = [];
				visit((event) => events.push(event));
				events.reverse();
				const activeEvents = selectSessionTranscriptLeafControlledPath(events) ?? events;
				return {
					...readTranscriptAccountingSnapshot((visitor) => {
						for (let index = activeEvents.length - 1; index >= 0; index -= 1) visitor(activeEvents[index]);
					}, params),
					eventCount: result.eventCount
				};
			});
			if (params.includeUsage) snapshot.usage = accounting.usage;
			if (params.includeTurnTaint) snapshot.turnTainted = accounting.tainted || !accounting.boundaryFound && accounting.eventCount >= SQLITE_USAGE_TAIL_MAX_EVENTS;
		}
	} catch {
		if (params.includeTurnTaint) snapshot.turnTainted = true;
	}
	return snapshot;
}
async function estimateProviderPromptTokens(messages, contextWindowTokens, priorPromptTokens = 0) {
	if (messages.length === 0) return Math.ceil(priorPromptTokens);
	const { truncateOversizedToolResultsInMessages } = await toolResultTruncationRuntimeLoader.load();
	const projected = truncateOversizedToolResultsInMessages(messages, contextWindowTokens, void 0, void 0, createToolResultPromptProjectionState()).messages;
	const tokens = estimateMessagesTokens(projected);
	return Number.isFinite(tokens) && tokens >= 0 ? Math.ceil(priorPromptTokens) + Math.ceil(tokens) : void 0;
}
async function estimatePromptTokensFromSessionTranscript(params) {
	const sessionId = normalizeOptionalString(params.sessionId);
	if (!sessionId) return;
	try {
		const snapshot = readSessionLogSnapshot({
			agentId: params.agentId,
			sessionId,
			sessionKey: params.sessionKey,
			storePath: params.storePath,
			includeByteSize: true,
			includeUsage: true
		});
		let usage = snapshot.usage;
		if (!hasUsableProviderPromptUsage(usage) && typeof snapshot.eventCount === "number" && snapshot.eventCount > SQLITE_USAGE_TAIL_MAX_EVENTS) usage = readSessionLogSnapshot({
			agentId: params.agentId,
			sessionId,
			sessionKey: params.sessionKey,
			storePath: params.storePath,
			includeByteSize: false,
			includeUsage: true,
			usageEventLimit: snapshot.eventCount
		}).usage;
		const normalizedOutputTokens = usage?.outputTokens === void 0 ? void 0 : Math.ceil(usage.outputTokens);
		if (hasUsableProviderPromptUsage(usage)) {
			const promptTokens = await estimateProviderPromptTokens(usage.trailingMessages, params.contextWindowTokens, usage.promptTokens);
			if (promptTokens === void 0) return;
			return {
				promptTokens,
				promptTokenSource: usage.trailingMessages.length > 0 ? "provider_usage_plus_prompt_projection" : "provider_usage",
				outputTokens: normalizedOutputTokens,
				transcriptByteSize: snapshot.byteSize
			};
		}
		const estimatedTokens = await estimateProviderPromptTokens(await readSessionMessagesAsync({
			agentId: params.agentId ?? resolveAgentIdFromSessionKey(params.sessionKey),
			sessionId,
			sessionKey: params.sessionKey,
			storePath: params.storePath
		}, {
			mode: "full",
			reason: "preflight-compaction-estimate"
		}), params.contextWindowTokens);
		if (estimatedTokens === void 0) return;
		return {
			promptTokens: estimatedTokens,
			promptTokenSource: "prompt_projection",
			promptIncludesOutput: true,
			outputTokens: normalizedOutputTokens,
			transcriptByteSize: snapshot.byteSize
		};
	} catch {
		return;
	}
}
/** Compacts session context before a reply or after a completed direct command. */
async function runSessionCompactionIfNeeded(params) {
	const assertActive = () => {
		params.abortSignal?.throwIfAborted();
		params.followupRun.operatorAuthority?.assertCurrent();
		if (params.authorize?.() === false) throw new Error("Session compaction maintenance is no longer active");
	};
	if (!params.sessionKey) return params.sessionEntry;
	let entry = params.sessionEntry ?? params.sessionStore?.[params.sessionKey];
	if (!entry?.sessionId) return entry ?? params.sessionEntry;
	const runtimeParams = {
		cfg: params.cfg,
		followupRun: params.followupRun,
		sessionEntry: entry,
		sessionKey: params.sessionKey,
		agentHarnessId: params.agentHarnessId
	};
	assertActive();
	const runtimeId = resolveFollowupAgentRuntimeId(runtimeParams);
	const isCli = followupUsesCliRuntime(runtimeParams, runtimeId);
	const ownsNativeCompaction = followupOwnsNativeCompaction(runtimeParams, runtimeId);
	if (isCli || ownsNativeCompaction) return entry ?? params.sessionEntry;
	const isCodexRuntime = normalizeLowercaseStringOrEmpty(runtimeId) === "codex";
	const compactionSessionKey = params.sessionKey ?? params.followupRun.run.sessionKey;
	if (!compactionSessionKey) return entry ?? params.sessionEntry;
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
	const contextWindowTokens = resolveFollowupContextTokens(params, runtimeId);
	const reserveTokensFloor = resolveMemoryFlushPlan({
		cfg: params.cfg,
		contextWindowTokens
	})?.reserveTokensFloor ?? resolveEffectiveCompactionReserveTokens({
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
		sessionId: entry.sessionId,
		contextWindowTokens
	});
	const transcriptSizeSnapshot = shouldCheckActiveTranscriptBytes && transcriptUsageTokens?.transcriptByteSize === void 0 ? readSessionLogSnapshot({
		...compactionTarget,
		sessionId: entry.sessionId,
		includeByteSize: true,
		includeUsage: false
	}) : void 0;
	const activeTranscriptBytes = transcriptUsageTokens?.transcriptByteSize ?? transcriptSizeSnapshot?.byteSize;
	const exceedsTranscriptByteThreshold = typeof activeTranscriptBytes === "number" && typeof maxActiveTranscriptBytes === "number" && activeTranscriptBytes >= maxActiveTranscriptBytes;
	let transcriptByteCompactionLatched = exceedsTranscriptByteThreshold && hasMatchingTranscriptByteCompactionLatch(entry, activeTranscriptBytes, maxActiveTranscriptBytes);
	const latch = entry.transcriptByteCompactionLatch;
	const refreshedTranscriptByteCompactionLatch = transcriptByteCompactionLatched && typeof activeTranscriptBytes === "number" && activeTranscriptBytes < (latch?.activeBytes ?? 0) ? {
		activeBytes: activeTranscriptBytes,
		sessionId: entry.sessionId,
		maxBytes: maxActiveTranscriptBytes
	} : void 0;
	const shouldClearTranscriptByteCompactionLatch = latch !== void 0 && (typeof maxActiveTranscriptBytes !== "number" || latch.sessionId !== entry.sessionId || latch.maxBytes !== maxActiveTranscriptBytes || typeof activeTranscriptBytes === "number" && !transcriptByteCompactionLatched);
	if (refreshedTranscriptByteCompactionLatch || shouldClearTranscriptByteCompactionLatch) {
		const compactionCount = await incrementCompactionCount({
			...compactionTarget,
			amount: 0,
			expectedSession: entry,
			sessionStore: compactionStore,
			transcriptByteCompactionLatch: refreshedTranscriptByteCompactionLatch
		});
		assertActive();
		if (compactionCount === void 0) throw new Error("Session changed before byte-compaction progress could be cleared");
		entry = compactionStore[compactionSessionKey] ?? entry;
		transcriptByteCompactionLatched = refreshedTranscriptByteCompactionLatch !== void 0;
	}
	const shouldCompactByTranscriptBytes = exceedsTranscriptByteThreshold && !transcriptByteCompactionLatched;
	if (isCodexRuntime && !shouldCompactByTranscriptBytes) {
		logVerbose(`preflightCompaction skipped: sessionKey=${params.sessionKey} runtime=codex reason=codex_native_auto_compaction activeTranscriptBytes=${activeTranscriptBytes ?? "undefined"} maxActiveTranscriptBytes=${maxActiveTranscriptBytes ?? "undefined"}`);
		return entry ?? params.sessionEntry;
	}
	const transcriptPromptTokens = transcriptUsageTokens?.promptTokens;
	const transcriptOutputTokens = transcriptUsageTokens?.outputTokens;
	const transcriptEstimateOutputTokens = transcriptUsageTokens?.promptIncludesOutput ? void 0 : transcriptOutputTokens;
	const usageProjectedTokenCount = typeof transcriptPromptTokens === "number" ? resolveEffectivePromptTokens(transcriptPromptTokens, transcriptEstimateOutputTokens, promptTokenEstimate) : void 0;
	const freshProjectedTokenCount = typeof freshPersistedTokens === "number" ? resolveEffectivePromptTokens(freshPersistedTokens, transcriptOutputTokens, promptTokenEstimate) : void 0;
	const projectedTokenCount = Math.max(usageProjectedTokenCount ?? 0, freshProjectedTokenCount ?? 0);
	const tokenCountForCompaction = Number.isFinite(projectedTokenCount) && projectedTokenCount > 0 ? projectedTokenCount : void 0;
	logVerbose(`preflightCompaction check: sessionKey=${params.sessionKey} tokenCount=${tokenCountForCompaction ?? freshPersistedTokens ?? "undefined"} contextWindow=${contextWindowTokens} threshold=${threshold} responsesServerCompactionThreshold=${responsesServerCompactionThreshold ?? "undefined"} isHeartbeat=${params.isHeartbeat} isCli=${isCli} persistedFresh=${entry?.totalTokensFresh === true} transcriptPromptTokens=${transcriptPromptTokens ?? "undefined"} transcriptPromptSource=${transcriptUsageTokens?.promptTokenSource ?? "undefined"} promptTokensEst=${promptTokenEstimate ?? "undefined"} activeTranscriptBytes=${activeTranscriptBytes ?? "undefined"} maxActiveTranscriptBytes=${maxActiveTranscriptBytes ?? "undefined"} sizeTrigger=${shouldCompactByTranscriptBytes} sizeTriggerLatched=${transcriptByteCompactionLatched}`);
	if (!(!params.isHeartbeat && shouldRunPreflightCompaction({
		entry,
		tokenCount: tokenCountForCompaction,
		threshold
	}) || shouldCompactByTranscriptBytes)) return entry ?? params.sessionEntry;
	if (params.beforeCompaction) {
		const refreshed = await params.beforeCompaction(entry);
		assertActive();
		return runSessionCompactionIfNeeded({
			...params,
			sessionEntry: refreshed,
			beforeCompaction: void 0
		});
	}
	const compactionTrigger = shouldCompactByTranscriptBytes ? "transcript_bytes" : "tokens";
	logVerbose(`preflightCompaction triggered: sessionKey=${params.sessionKey} tokenCount=${tokenCountForCompaction ?? freshPersistedTokens ?? "undefined"} threshold=${threshold} trigger=${compactionTrigger} activeTranscriptBytes=${activeTranscriptBytes ?? "undefined"} maxActiveTranscriptBytes=${maxActiveTranscriptBytes ?? "undefined"}`);
	assertActive();
	params.onCompactionStart?.();
	const notifyCompaction = async (phase, text) => {
		try {
			if (text) await params.onCompactionNotice?.(phase, text);
			else await params.onCompactionNotice?.(phase);
		} catch (err) {
			logVerbose(`preflightCompaction notice delivery failed: ${String(err)}`);
		}
	};
	let startedCompactionNotice = false;
	let terminalCompactionNoticeSent = false;
	const notifyStartCompaction = async () => {
		startedCompactionNotice = true;
		await notifyCompaction("start");
	};
	const notifyTerminalCompaction = async (phase, text) => {
		terminalCompactionNoticeSent = true;
		await notifyCompaction(phase, text);
	};
	let expectedSession = entry;
	let hostAccountingCommitted = false;
	const recordCompactionAccounting = async (acceptedEntry, tokensAfter, compactionKind, amount = 1) => {
		const postCompactionBytes = compactionTrigger === "transcript_bytes" && typeof maxActiveTranscriptBytes === "number" ? readSessionLogSnapshot({
			...compactionTarget,
			sessionId: acceptedEntry.sessionId,
			includeByteSize: true,
			includeUsage: false
		}).byteSize : void 0;
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
			transcriptByteCompactionLatch
		}) === void 0) throw new Error("Session changed before compaction maintenance could be recorded");
	};
	const stopHeartbeat = startFollowupRunPreAdoptionHeartbeat(params.followupRun.turnAdoptionLifecycle, params.abortSignal);
	try {
		await notifyStartCompaction();
		assertActive();
		const result = await compactEmbeddedAgentSession({
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
			requestBudget: params.compactionRequestBudget,
			pendingUserEntryId: params.pendingUserEntryId,
			...compactionTrigger === "transcript_bytes" && isCodexRuntime ? {
				transcriptBytePreflightHarness: "codex",
				...compactionTarget.storePath && typeof activeTranscriptBytes === "number" && typeof maxActiveTranscriptBytes === "number" ? { withCompactionPersistence: (prepared) => {
					assertActive();
					const committed = persistCompactionBoundaryWithSessionEntrySync({
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
					});
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
				expectedSession = accepted.entry;
				entry = accepted.entry;
				compactionStore[compactionSessionKey] = accepted.entry;
				params.onCompactionCommitted?.(accepted);
			}
		});
		if (!result?.ok || !result.compacted) {
			assertActive();
			const reason = (result?.ok ? normalizeOptionalString(result.reason) : result?.reason) ?? "not_compacted";
			if (result && isBenignCompactionSkipResult(result)) {
				await notifyTerminalCompaction("skipped");
				logVerbose(`preflightCompaction skipped: sessionKey=${params.sessionKey} reason=${reason}`);
				return entry ?? params.sessionEntry;
			}
			await notifyTerminalCompaction("incomplete");
			logVerbose(`preflightCompaction failed: sessionKey=${params.sessionKey} reason=${reason}`);
			throw new Error(`Preflight compaction required but failed: ${reason}`);
		}
		if (!hostAccountingCommitted) await recordCompactionAccounting(expectedSession, result.result?.tokensAfter, result.compactionKind);
		assertActive();
		entry = compactionStore[compactionSessionKey] ?? entry;
		const transcriptByteCompactionLatch = entry.transcriptByteCompactionLatch;
		if (transcriptByteCompactionLatch) preflightCompactionLog.warn("byte-triggered compaction left the active transcript above its limit; suppressing repeats until it grows by another threshold", {
			sessionKey: compactionSessionKey,
			activeTranscriptBytes: transcriptByteCompactionLatch.activeBytes,
			maxActiveTranscriptBytes: transcriptByteCompactionLatch.maxBytes
		});
		await appendPostCompactionRefreshPrompt({
			cfg: params.cfg,
			followupRun: params.followupRun
		});
		assertActive();
		await notifyTerminalCompaction("end", result.compactionKind === "server-endpoint" && typeof result.result?.tokensBefore === "number" && typeof result.result.tokensAfter === "number" ? `🧹 Server-side compaction complete (${formatTokenCount(result.result.tokensBefore)} → ${formatTokenCount(result.result.tokensAfter)})` : void 0);
		assertActive();
		entry = compactionStore[compactionSessionKey] ?? entry;
		if (entry) {
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
		}
		return entry ?? params.sessionEntry;
	} catch (err) {
		if (startedCompactionNotice && !terminalCompactionNoticeSent && !params.abortSignal?.aborted) await notifyCompaction("incomplete");
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
	const memoryFlushWritable = (() => {
		if (!params.sessionKey) return true;
		const runtime = resolveSandboxRuntimeStatus({
			cfg: params.cfg,
			agentId: params.followupRun.run.agentId,
			sessionKey: params.sessionKey,
			classificationSessionKey: params.runtimePolicySessionKey
		});
		const workspaceAccess = runtime.workspaceAccess ?? resolveSandboxConfigForAgent(params.cfg, runtime.classificationAgentId).workspaceAccess;
		return !runtime.sandboxed || workspaceAccess === "rw";
	})();
	let entry = params.sessionEntry ?? (params.sessionKey ? params.sessionStore?.[params.sessionKey] : void 0);
	if (entry?.incognito === true || isIncognitoSessionKey(params.sessionKey)) return {
		sessionEntry: entry,
		outcome: "skipped"
	};
	const runtimeParams = {
		cfg: params.cfg,
		followupRun: params.followupRun,
		sessionEntry: entry,
		sessionKey: params.sessionKey
	};
	const runtimeId = resolveFollowupAgentRuntimeId(runtimeParams);
	const isCli = followupUsesCliRuntime(runtimeParams, runtimeId) || followupOwnsNativeCompaction(runtimeParams, runtimeId);
	if (!(memoryFlushWritable && !params.isHeartbeat && !isCli)) return {
		sessionEntry: entry ?? params.sessionEntry,
		outcome: "skipped"
	};
	const flushRunId = crypto.randomUUID();
	let flushRunRegistered = false;
	let activeSessionEntry = entry ?? params.sessionEntry;
	const recordFailure = (error) => recordMemoryFlushFailure(error, params, activeSessionEntry);
	const contextWindowTokens = resolveFollowupContextTokens(params, runtimeId);
	let memoryFlushPlan;
	try {
		memoryFlushPlan = resolveMemoryFlushPlan({
			cfg: params.cfg,
			contextWindowTokens
		});
	} catch (error) {
		return await recordFailure(error);
	}
	if (!memoryFlushPlan) return {
		sessionEntry: activeSessionEntry,
		outcome: "skipped"
	};
	const promptTokenEstimate = estimatePromptTokensForMemoryFlush(params.promptForEstimate ?? params.followupRun.prompt);
	const persistedPromptTokens = resolveFreshSessionTotalTokens(entry);
	const hasFreshPersistedPromptTokens = persistedPromptTokens !== void 0;
	const flushThreshold = Math.max(0, resolveCompactionThreshold({
		contextWindowTokens,
		reserveTokensFloor: memoryFlushPlan.reserveTokensFloor
	}) - Math.max(0, Math.floor(memoryFlushPlan.softThresholdTokens)));
	const shouldReadTranscriptForOutput = entry && hasFreshPersistedPromptTokens && typeof promptTokenEstimate === "number" && Number.isFinite(promptTokenEstimate) && flushThreshold > 0 && (persistedPromptTokens ?? 0) + promptTokenEstimate >= flushThreshold - TRANSCRIPT_OUTPUT_READ_BUFFER_TOKENS;
	const shouldReadTranscript = Boolean(entry && (!hasFreshPersistedPromptTokens || shouldReadTranscriptForOutput));
	const forceFlushTranscriptBytes = memoryFlushPlan.forceFlushTranscriptBytes;
	const shouldCheckTranscriptSizeForForcedFlush = Boolean(entry && Number.isFinite(forceFlushTranscriptBytes) && forceFlushTranscriptBytes > 0);
	const shouldReadTurnTaint = Boolean(entry);
	const sessionLogSnapshot = shouldReadTranscript || shouldCheckTranscriptSizeForForcedFlush || shouldReadTurnTaint ? readSessionLogSnapshot({
		agentId: params.followupRun.run.agentId,
		sessionId: params.followupRun.run.sessionId,
		sessionKey: params.sessionKey ?? params.followupRun.run.sessionKey,
		storePath: params.storePath,
		includeByteSize: shouldCheckTranscriptSizeForForcedFlush,
		includeTurnTaint: shouldReadTurnTaint,
		includeUsage: shouldReadTranscript
	}) : void 0;
	const transcriptByteSize = sessionLogSnapshot?.byteSize;
	const shouldForceFlushByTranscriptSize = typeof transcriptByteSize === "number" && transcriptByteSize >= forceFlushTranscriptBytes;
	const transcriptUsageSnapshot = sessionLogSnapshot?.usage;
	const transcriptOutputTokens = transcriptUsageSnapshot?.outputTokens;
	const transcriptPromptTokens = hasUsableProviderPromptUsage(transcriptUsageSnapshot) ? await estimateProviderPromptTokens(transcriptUsageSnapshot.trailingMessages, contextWindowTokens, transcriptUsageSnapshot.promptTokens) : void 0;
	const hasReliableTranscriptPromptTokens = typeof transcriptPromptTokens === "number";
	if (entry && hasReliableTranscriptPromptTokens && (!hasFreshPersistedPromptTokens || (transcriptPromptTokens ?? 0) > (persistedPromptTokens ?? 0))) {
		const usageUpdate = {
			totalTokens: transcriptPromptTokens,
			totalTokensFresh: true,
			totalTokensVersion: 1
		};
		const nextEntry = {
			...entry,
			...usageUpdate
		};
		entry = nextEntry;
		if (params.sessionKey && params.sessionStore) params.sessionStore[params.sessionKey] = nextEntry;
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
	const promptTokensSnapshot = Math.max(hasFreshPersistedPromptTokens ? persistedPromptTokens ?? 0 : 0, hasReliableTranscriptPromptTokens ? transcriptPromptTokens ?? 0 : 0);
	const projectedTokenCount = promptTokensSnapshot > 0 ? resolveEffectivePromptTokens(promptTokensSnapshot, transcriptOutputTokens, promptTokenEstimate) : void 0;
	const tokenCountForFlush = typeof projectedTokenCount === "number" && Number.isFinite(projectedTokenCount) && projectedTokenCount > 0 ? projectedTokenCount : void 0;
	logVerbose(`memoryFlush check: sessionKey=${params.sessionKey} tokenCount=${tokenCountForFlush ?? "undefined"} contextWindow=${contextWindowTokens} threshold=${flushThreshold} isHeartbeat=${params.isHeartbeat} isCli=${isCli} memoryFlushWritable=${memoryFlushWritable} compactionCount=${entry?.compactionCount ?? 0} memoryFlushCompactionCount=${entry?.memoryFlush?.compactionCount ?? "undefined"} persistedPromptTokens=${persistedPromptTokens ?? "undefined"} persistedFresh=${entry?.totalTokensFresh === true} promptTokensEst=${promptTokenEstimate ?? "undefined"} transcriptPromptTokens=${transcriptPromptTokens ?? "undefined"} transcriptOutputTokens=${transcriptOutputTokens ?? "undefined"} projectedTokenCount=${projectedTokenCount ?? "undefined"} transcriptBytes=${transcriptByteSize ?? "undefined"} forceFlushTranscriptBytes=${forceFlushTranscriptBytes} forceFlushByTranscriptSize=${shouldForceFlushByTranscriptSize}`);
	if (!(shouldRunMemoryFlush({
		entry,
		tokenCount: tokenCountForFlush,
		threshold: flushThreshold
	}) || shouldForceFlushByTranscriptSize && entry != null && !hasAlreadyFlushedForCurrentCompaction(entry))) return {
		sessionEntry: entry ?? params.sessionEntry,
		outcome: "skipped"
	};
	logVerbose(`memoryFlush triggered: sessionKey=${params.sessionKey} tokenCount=${tokenCountForFlush ?? "undefined"} threshold=${flushThreshold}`);
	activeSessionEntry = entry ?? params.sessionEntry;
	params.replyOperation?.setPhase("memory_flushing");
	let bootstrapPromptWarningSignaturesSeen = resolveBootstrapWarningSignaturesSeen(activeSessionEntry?.systemPromptReport ?? (params.sessionKey ? params.sessionStore?.[params.sessionKey]?.systemPromptReport : void 0));
	const assertMemoryFlushCurrent = () => {
		abortSignal?.throwIfAborted();
		params.followupRun.operatorAuthority?.assertCurrent();
	};
	const prepareMemoryFlushAttempt = async () => {
		assertMemoryFlushCurrent();
		const plan = resolveMemoryFlushPlan({
			cfg: params.cfg,
			nowMs: Date.now(),
			contextWindowTokens
		});
		if (!plan) return null;
		const writePath = plan.relativePath;
		if (!params.sessionKey || !activeSessionEntry) throw new Error("Memory flush has no current transcript target.");
		const agentId = params.followupRun.run.agentId ?? resolveDefaultAgentId(params.cfg);
		const runtime = await memoryFlushSessionRuntimeLoader.load();
		assertMemoryFlushCurrent();
		const memorySession = await runtime.prepareMemoryFlushSession({
			admission: params.preflightAdmission,
			source: {
				agentId,
				sessionId: activeSessionEntry.sessionId,
				sessionKey: params.sessionKey,
				storePath: resolveSessionStorePathForScope({
					agentId,
					sessionKey: params.sessionKey,
					storePath: params.storePath
				}, params.cfg)
			},
			runId: flushRunId,
			workspaceDir: params.followupRun.run.workspaceDir,
			signal: abortSignal
		});
		await runtime.ensureMemoryFlushTargetFile({
			workspaceDir: params.followupRun.run.workspaceDir,
			relativePath: writePath,
			assertCurrent: assertMemoryFlushCurrent
		});
		const systemPrompt = [params.followupRun.run.extraSystemPrompt, plan.systemPrompt].filter(Boolean).join("\n\n");
		const selection = resolveMemoryFlushModelFallbackOptions(params.followupRun.run, plan.model, params.cfg);
		abortSignal?.throwIfAborted();
		return {
			plan,
			writePath,
			systemPrompt,
			selection,
			preparedRunAdmission: prepareSystemAgentRunAdmission(params.cfg, flushRunId, params.followupRun.run.agentId, "auto-reply.memory-flush", void 0, params.followupRun.operatorAuthority),
			memorySession
		};
	};
	let preparedAttempt;
	try {
		preparedAttempt = await prepareMemoryFlushAttempt();
	} catch (error) {
		return await recordFailure(error);
	}
	if (!preparedAttempt) return {
		sessionEntry: activeSessionEntry,
		outcome: "skipped"
	};
	const { plan: activeMemoryFlushPlan, writePath: memoryFlushWritePath, systemPrompt: flushSystemPrompt, selection, preparedRunAdmission, memorySession } = preparedAttempt;
	const sourcePolicySessionKey = params.runtimePolicySessionKey ?? params.followupRun.run.runtimePolicySessionKey ?? params.sessionKey ?? params.followupRun.run.sessionKey;
	const maintenanceRun = createSessionMaintenanceFollowup({
		run: params.followupRun.run,
		sessionEntry: {
			sessionId: memorySession.sessionId,
			updatedAt: Date.now()
		},
		cfg: params.cfg,
		sessionKey: memorySession.sessionKey,
		runtimePolicySessionKey: sourcePolicySessionKey,
		provider: selection.provider,
		model: selection.model,
		auth: params.followupRun.run
	}).run;
	const deferredLifecycle = createDeferredEmbeddedRunLifecycleManager({
		runId: flushRunId,
		sessionId: memorySession.sessionId,
		sessionKey: memorySession.sessionKey,
		sessionFile: memorySession.sessionFile,
		abortSignal
	});
	const flushedCompactionCount = activeSessionEntry?.compactionCount ?? 0;
	let visibleErrorPayloads = [];
	const parentRunId = params.opts?.runId;
	if (parentRunId) emitAgentRunStatusEvent({
		runId: parentRunId,
		sessionKey: params.sessionKey,
		phase: "memory_flushing"
	});
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
			sourceSessionId: activeSessionEntry?.sessionId
		});
		await runEmbeddedAgentEntry({
			preparedRunAdmission,
			selection: {
				cfg: selection.cfg,
				provider: selection.provider,
				model: selection.model,
				requestedRouteResolution: selection.requestedRouteResolution,
				agentDir: selection.agentDir,
				fallbacksOverride: selection.fallbacksOverride,
				userLockedAuthProfileId: params.followupRun.run.authProfileIdSource === "user" ? params.followupRun.run.authProfileId : void 0
			},
			identity: {
				runId: flushRunId,
				agentId: params.followupRun.run.agentId,
				sessionId: memorySession.sessionId,
				sessionKey: memorySession.sessionKey,
				lane: "main"
			},
			harness: {
				workspaceDir: params.followupRun.run.workspaceDir,
				sessionKey: params.runtimePolicySessionKey ?? params.followupRun.run.runtimePolicySessionKey ?? params.sessionKey,
				preparation: { kind: "direct" },
				resolveRuntimeOverride: (provider) => resolveSessionRuntimeOverrideForProvider({
					provider,
					entry: activeSessionEntry,
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
					sessionKey: params.runtimePolicySessionKey ?? params.followupRun.run.runtimePolicySessionKey ?? params.sessionKey,
					sessionEntry: activeSessionEntry,
					agentRuntime: sessionRuntimeOverride
				});
				const { embeddedContext, senderContext, runBaseParams } = await buildEmbeddedRunExecutionParams({
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
				const result = await runEmbeddedAgent({
					preparedRunAdmission,
					...embeddedContext,
					...senderContext,
					...runBaseParams,
					...memorySession,
					agentHarnessId: resolveSessionPinnedHarnessId(activeSessionEntry),
					agentHarnessRuntimeOverride: sessionRuntimeOverride,
					sandboxSessionKey: sourcePolicySessionKey,
					allowGatewaySubagentBinding: true,
					silentExpected: true,
					allowEmptyAssistantReplyAsSilent: true,
					terminalReplyExpectation: "optional",
					trigger: "memory",
					contextTokenBudget: contextWindowTokens,
					memoryFlushWritePath,
					initialTurnTainted: !params.followupRun.run.senderIsOwner || sessionLogSnapshot?.turnTainted === true,
					prompt: activeMemoryFlushPlan.prompt,
					transcriptPrompt: "",
					extraSystemPrompt: flushSystemPrompt,
					isFinalFallbackAttempt: runOptions.isFinalFallbackAttempt,
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
			if (updatedEntry) activeSessionEntry = updatedEntry;
		} catch (err) {
			logVerbose(`failed to persist memory flush metadata: ${String(err)}`);
		}
		return {
			sessionEntry: activeSessionEntry,
			outcome: "completed"
		};
	} catch (error) {
		return await recordFailure(error);
	} finally {
		if (parentRunId && !abortSignal?.aborted) emitAgentRunStatusEvent({
			runId: parentRunId,
			sessionKey: params.sessionKey,
			phase: "preparing_context"
		});
		await deferredLifecycle.complete();
		if (flushRunRegistered) clearAgentRunContext(flushRunId);
		preparedRunAdmission.close();
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
		const adoptEntry = (entry) => {
			if (entry) {
				sessionEntry = entry;
				if (run.sessionStore) run.sessionStore[sessionKey] = entry;
			}
		};
		const updateEntry = (update) => updateSessionEntry({
			storePath,
			sessionKey
		}, update, {
			skipMaintenance: true,
			takeCacheOwnership: true
		});
		const failedEntry = await updateEntry(async (currentEntry) => ({ memoryFlush: {
			kind: "failed",
			...currentEntry.memoryFlush?.compactionCount !== void 0 ? { compactionCount: currentEntry.memoryFlush.compactionCount } : {},
			failureCount: (currentEntry.memoryFlush?.kind === "failed" ? currentEntry.memoryFlush.failureCount : 0) + 1
		} }));
		adoptEntry(failedEntry);
		const failureCount = failedEntry?.memoryFlush?.kind === "failed" ? failedEntry.memoryFlush.failureCount : 0;
		logVerbose(`memory flush failed (attempt ${failureCount}/${MAX_FLUSH_FAILURES}): ${truncatedError}`);
		if (failedEntry && failureCount >= MAX_FLUSH_FAILURES) {
			outcome = "exhausted";
			logVerbose(`memory flush exhausted: skipping flush for this compaction cycle after ${failureCount} consecutive failures`);
			adoptEntry(await updateEntry(async (currentEntry) => ({ memoryFlush: {
				kind: "succeeded",
				compactionCount: currentEntry.compactionCount ?? 0
			} })));
			run.onVisibleErrorPayloads?.([{
				text: `⚠️ Memory flush failed after ${MAX_FLUSH_FAILURES} attempts; skipping for this cycle. It will retry after the next compaction.`,
				isError: true
			}]);
		}
	} catch (persistError) {
		logVerbose(`failed to persist memory flush failure metadata: ${String(persistError)}`);
	}
	else logVerbose(`memory flush run failed: ${String(error)}`);
	const visibleErrorPayload = buildMemoryFlushErrorPayload(error);
	if (visibleErrorPayload) run.onVisibleErrorPayloads?.([visibleErrorPayload]);
	return {
		sessionEntry,
		outcome
	};
}
//#endregion
export { runSessionCompactionIfNeeded as n, runMemoryFlushIfNeeded as t };
