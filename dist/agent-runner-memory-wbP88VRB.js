import { a as normalizeLowercaseStringOrEmpty, c as normalizeOptionalString, s as normalizeOptionalLowercaseString } from "./string-coerce-DW4mBlAt.js";
import { t as createLazyImportLoader } from "./lazy-promise-10KxeiYV.js";
import { i as formatErrorMessage } from "./errors-sMD712F3.js";
import { n as isAbortError } from "./abort-signal-BWW6Tk6w.js";
import { h as resolveEffectiveModelFallbacks } from "./agent-scope-B2Pk_xhT.js";
import { p as resolveAgentIdFromSessionKey } from "./session-key-VWT_xzM9.js";
import { i as logVerbose, r as isDevMode } from "./globals-BElpud1m.js";
import { r as resolveProviderIdForAuth } from "./provider-auth-aliases-BMy8GnRz.js";
import { c as resolveContextConfigProviderForRuntime } from "./openai-routing-DXJmS9CT.js";
import "./defaults-mDjiWzE5.js";
import { _ as selectApplicableRuntimeConfig, i as getRuntimeConfigSnapshot, s as getRuntimeConfigSourceSnapshot } from "./runtime-snapshot-DOvWRYVz.js";
import { n as parseNonNegativeByteSize } from "./zod-schema-O9ml_nmo.js";
import "./config-Cc93keN1.js";
import { a as normalizeAnyChannelId, o as normalizeChannelId } from "./registry-BUWrOy2m.js";
import { c as emitAgentEvent, g as registerAgentRunContext } from "./agent-events-CRggPZCM.js";
import { v as resolveMemoryFlushPlan } from "./memory-state-DefveORB.js";
import { a as resolveSessionFilePath, o as resolveSessionFilePathOptions } from "./paths-C2C4lJH6.js";
import { t as getChannelPlugin } from "./registry-CWdFCyWd.js";
import { t as normalizeChatType } from "./chat-type-BARlA53h.js";
import "./plugins-Cgf2sDSU.js";
import { s as resolveFreshSessionTotalTokens } from "./types-CoDcFuoc.js";
import { W as updateSessionEntry } from "./session-accessor-CwhXEUId.js";
import { i as modelKey, r as legacyModelKey } from "./model-selection-normalize-Cj03z3tC.js";
import { t as isCliProvider } from "./model-selection-cli-DB4l0L04.js";
import "./model-selection-CFL1kjzt.js";
import { c as estimateMessagesTokens } from "./compaction-planning-BpV11_gP.js";
import { i as resolveSandboxConfigForAgent } from "./config-Dy4vED5-.js";
import { n as resolveSandboxRuntimeStatus } from "./runtime-status-BRnZ3ffr.js";
import { u as readSessionMessagesAsync } from "./session-utils.fs-CR-Ydxz0.js";
import "./sessions-BIAJdhW6.js";
import { i as hasNonzeroUsage, o as normalizeUsage, t as deriveContextPromptTokens } from "./usage-BJjt0RVM.js";
import { o as resolveContextTokensForModel } from "./context-BDO_A4uo.js";
import { t as resolveFastModeState } from "./fast-mode-DhLzHuCP.js";
import { r as isCliRuntimeAliasForProvider } from "./model-runtime-aliases-B1-PRucg.js";
import { n as resolveSessionRuntimeOverrideForProvider } from "./session-runtime-compat-Dg3upVEO.js";
import { n as resolveCandidateThinkingLevel, r as resolveEffectiveAgentRuntime } from "./thinking-runtime-DHKmmAgL.js";
import { t as isReasoningTagProvider } from "./provider-utils-CCyoGl1Y.js";
import { s as refreshQueuedFollowupSession } from "./queue-D4SO3sXg.js";
import { i as isRenderablePayload } from "./reply-payloads-DOhoWRu9.js";
import { o as runWithModelFallback } from "./model-fallback-DCdP137c.js";
import { t as resolveCommandSecretRefsViaGateway } from "./command-secret-gateway-bOND9VJZ.js";
import { d as getScopedChannelsCommandSecretTargets, t as getAgentRuntimeCommandSecretTargetIds } from "./command-secret-targets-D69jAQ1Z.js";
import { t as resolveMessageSecretScope } from "./message-secret-scope-ChySUOBS.js";
import "./sandbox-B46ddR1c.js";
import { s as resolveBootstrapWarningSignaturesSeen } from "./bootstrap-budget-DFC5I5_X.js";
import { n as readPostCompactionContext } from "./post-compaction-context-B9tRRHpp.js";
import "./compaction-DYXLgBV6.js";
import { t as ensureSelectedAgentHarnessPlugin } from "./runtime-plugin-B7s-CsKk.js";
import { n as classifyCompactionReason } from "./compact-reasons-ByJlIe1a.js";
import { t as hasInboundAudio } from "./inbound-media-BABB4m9T.js";
import { n as resolveOriginMessageProvider, r as resolveOriginMessageTo } from "./origin-routing-DR55bzxd.js";
import { n as incrementCompactionCount } from "./session-updates-BQz43l7D.js";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
//#region src/auto-reply/reply/agent-runner-auth-profile.ts
/** Keeps an auth profile only when the current provider shares the primary auth scope. */
function resolveProviderScopedAuthProfile(params) {
	const aliasParams = {
		config: params.config,
		workspaceDir: params.workspaceDir
	};
	const authProfileId = resolveProviderIdForAuth(params.provider, aliasParams) === resolveProviderIdForAuth(params.primaryProvider, aliasParams) ? params.authProfileId : void 0;
	return {
		authProfileId,
		authProfileIdSource: authProfileId ? params.authProfileIdSource : void 0
	};
}
/** Resolves the auth profile override for a queued follow-up run. */
function resolveRunAuthProfile(run, provider, params) {
	return resolveProviderScopedAuthProfile({
		provider,
		primaryProvider: run.provider,
		authProfileId: run.authProfileId,
		authProfileIdSource: run.authProfileIdSource,
		config: params?.config ?? run.config,
		workspaceDir: run.workspaceDir
	});
}
//#endregion
//#region src/auto-reply/reply/agent-runner-run-params.ts
/** Builds embedded-agent run parameters from queued follow-up run state. */
/** Builds model fallback options for an embedded follow-up run. */
function resolveModelFallbackOptions(run, configOverride = run.config) {
	const config = configOverride;
	const fallbacksOverride = resolveEffectiveModelFallbacks({
		cfg: config,
		agentId: run.agentId,
		sessionKey: run.sessionKey,
		hasSessionModelOverride: run.hasSessionModelOverride === true,
		modelOverrideSource: run.modelOverrideSource,
		hasAutoFallbackProvenance: run.hasAutoFallbackProvenance === true
	});
	return {
		cfg: config,
		provider: run.provider,
		model: run.model,
		agentDir: run.agentDir,
		agentId: run.agentId,
		sessionKey: run.runtimePolicySessionKey ?? run.sessionKey,
		fallbacksOverride
	};
}
/** Resolves whether final-answer tags should be enforced for an embedded follow-up run. */
function resolveEnforceFinalTagWithResolver(run, provider, model, isReasoningTagProvider) {
	return (run.skipProviderRuntimeHints ? false : void 0) ?? (run.enforceFinalTag || isReasoningTagProvider?.(provider, {
		config: run.config,
		workspaceDir: run.workspaceDir,
		modelId: model
	}) || false);
}
/** Builds the shared embedded-agent run params from a queued follow-up run. */
function buildEmbeddedRunBaseParams$1(params) {
	const config = params.run.config;
	const modelFallbacksOverride = resolveEffectiveModelFallbacks({
		cfg: config,
		agentId: params.run.agentId,
		sessionKey: params.run.sessionKey,
		hasSessionModelOverride: params.run.hasSessionModelOverride === true,
		modelOverrideSource: params.run.modelOverrideSource,
		hasAutoFallbackProvenance: params.run.hasAutoFallbackProvenance === true
	});
	const enforceFinalTag = resolveEnforceFinalTagWithResolver(params.run, params.provider, params.model, params.isReasoningTagProvider);
	return {
		sessionFile: params.run.sessionFile,
		workspaceDir: params.run.workspaceDir,
		cwd: params.run.cwd,
		agentDir: params.run.agentDir,
		config,
		skillsSnapshot: params.run.skillsSnapshot,
		ownerNumbers: params.run.ownerNumbers,
		inputProvenance: params.run.inputProvenance,
		senderIsOwner: params.run.senderIsOwner,
		channelContext: params.run.channelContext,
		approvalReviewerDeviceId: params.run.approvalReviewerDeviceId,
		enforceFinalTag,
		silentExpected: params.run.silentExpected,
		allowEmptyAssistantReplyAsSilent: params.run.allowEmptyAssistantReplyAsSilent,
		silentReplyPromptMode: params.run.silentReplyPromptMode,
		sourceReplyDeliveryMode: params.run.sourceReplyDeliveryMode,
		provider: params.provider,
		model: params.model,
		modelFallbacksOverride,
		...params.authProfile,
		thinkLevel: params.run.thinkLevel,
		fastMode: params.run.fastMode,
		fastModeAutoOnSeconds: params.run.fastModeAutoOnSeconds,
		verboseLevel: params.run.verboseLevel,
		reasoningLevel: params.run.reasoningLevel,
		execOverrides: params.run.execOverrides,
		bashElevated: params.run.bashElevated,
		timeoutMs: params.run.timeoutMs,
		runId: params.runId,
		promptCacheKey: params.promptCacheKey,
		allowTransientCooldownProbe: params.allowTransientCooldownProbe
	};
}
//#endregion
//#region src/auto-reply/reply/agent-runner-utils.ts
/** Utilities for queued reply runtime config, auth, threading, and embedded run params. */
const BUN_FETCH_SOCKET_ERROR_RE = /socket connection was closed unexpectedly/i;
/** Selects the freshest runtime config usable by queued reply execution. */
function resolveQueuedReplyRuntimeConfig(config) {
	return selectApplicableRuntimeConfig({
		inputConfig: config,
		runtimeConfig: typeof getRuntimeConfigSnapshot === "function" ? getRuntimeConfigSnapshot() : null,
		runtimeSourceConfig: typeof getRuntimeConfigSourceSnapshot === "function" ? getRuntimeConfigSourceSnapshot() : null
	}) ?? config;
}
/** Resolves command secrets for queued reply execution, scoped to the origin route. */
async function resolveQueuedReplyExecutionConfig(config, params) {
	const runtimeConfig = resolveQueuedReplyRuntimeConfig(config);
	const { resolvedConfig } = await resolveCommandSecretRefsViaGateway({
		config: runtimeConfig,
		commandName: "reply",
		targetIds: getAgentRuntimeCommandSecretTargetIds()
	});
	const baseResolvedConfig = resolvedConfig ?? runtimeConfig;
	const scope = resolveMessageSecretScope({
		channel: params?.originatingChannel,
		fallbackChannel: params?.messageProvider,
		accountId: params?.originatingAccountId,
		fallbackAccountId: params?.agentAccountId
	});
	if (!scope.channel) return baseResolvedConfig;
	const scopedTargets = getScopedChannelsCommandSecretTargets({
		config: baseResolvedConfig,
		channel: scope.channel,
		accountId: scope.accountId
	});
	if (scopedTargets.targetIds.size === 0) return baseResolvedConfig;
	return (await resolveCommandSecretRefsViaGateway({
		config: baseResolvedConfig,
		commandName: "reply",
		targetIds: scopedTargets.targetIds,
		...scopedTargets.allowedPaths ? { allowedPaths: scopedTargets.allowedPaths } : {}
	})).resolvedConfig ?? baseResolvedConfig;
}
/**
* Build provider-specific threading context for tool auto-injection.
*/
/** Builds channel threading context for message-tool replies. */
function buildThreadingToolContext(params) {
	const { sessionCtx, config, hasRepliedRef } = params;
	const currentMessageId = sessionCtx.InputProvenance?.kind === "internal_system" && sessionCtx.InputProvenance.sourceTool === "restart-sentinel" ? sessionCtx.ReplyToId : sessionCtx.MessageSidFull ?? sessionCtx.MessageSid;
	const originProvider = resolveOriginMessageProvider({
		originatingChannel: sessionCtx.OriginatingChannel,
		provider: sessionCtx.Provider
	});
	const originTo = resolveOriginMessageTo({
		originatingTo: sessionCtx.OriginatingTo,
		to: sessionCtx.To
	});
	if (!config) return { currentMessageId };
	const rawProvider = normalizeOptionalLowercaseString(originProvider);
	if (!rawProvider) return { currentMessageId };
	const provider = normalizeChannelId(rawProvider) ?? normalizeAnyChannelId(rawProvider);
	const threading = provider ? getChannelPlugin(provider)?.threading : void 0;
	if (!threading?.buildToolContext) return {
		currentChannelId: normalizeOptionalString(originTo),
		currentChannelProvider: provider ?? rawProvider,
		currentMessageId,
		hasRepliedRef
	};
	const context = threading.buildToolContext({
		cfg: config,
		accountId: sessionCtx.AccountId,
		context: {
			Channel: originProvider,
			From: sessionCtx.From,
			To: originTo,
			ChatType: sessionCtx.ChatType,
			CurrentMessageId: currentMessageId,
			ReplyToMode: sessionCtx.ReplyToMode,
			ReplyToId: sessionCtx.ReplyToId,
			ReplyToIdFull: sessionCtx.ReplyToIdFull,
			ThreadLabel: sessionCtx.ThreadLabel,
			MessageThreadId: sessionCtx.MessageThreadId,
			TransportThreadId: sessionCtx.TransportThreadId,
			NativeChannelId: sessionCtx.NativeChannelId
		},
		hasRepliedRef
	}) ?? {};
	const hasAdapterCurrentMessageId = Object.hasOwn(context, "currentMessageId");
	return {
		...context,
		currentChannelProvider: provider,
		currentMessageId: hasAdapterCurrentMessageId ? context.currentMessageId : currentMessageId
	};
}
/** Detects Bun socket-close errors that should be formatted more clearly. */
const isBunFetchSocketError = (message) => message ? BUN_FETCH_SOCKET_ERROR_RE.test(message) : false;
/** Formats Bun socket-close errors for user-facing reply output. */
const formatBunFetchSocketError = (message) => {
	return [
		"⚠️ LLM connection failed. This could be due to server issues, network problems, or context length exceeded (e.g., with local LLMs like LM Studio). Original error:",
		"```",
		message.trim() || "Unknown error",
		"```"
	].join("\n");
};
/** Resolves candidate-scoped fast mode after model fallback changes provider/model. */
function resolveRunFastModeForFallbackCandidate(params) {
	const state = resolveFastModeState({
		cfg: params.config,
		provider: params.provider,
		model: params.model,
		agentId: params.run.agentId,
		sessionEntry: params.sessionEntry
	});
	if (params.run.fastModeOverride) return {
		fastMode: params.run.fastMode,
		fastModeAutoOnSeconds: params.run.fastModeAutoOnSecondsOverride ? params.run.fastModeAutoOnSeconds : state.fastAutoOnSeconds
	};
	return {
		fastMode: state.mode,
		fastModeAutoOnSeconds: params.run.fastModeAutoOnSecondsOverride ? params.run.fastModeAutoOnSeconds : state.fastAutoOnSeconds
	};
}
/** Builds base embedded run params with auth and provider runtime hints. */
function buildEmbeddedRunBaseParams(params) {
	return buildEmbeddedRunBaseParams$1({
		...params,
		isReasoningTagProvider
	});
}
function buildEmbeddedContextFromTemplate(params) {
	const config = params.run.config;
	const sessionCtx = {
		...params.sessionCtx,
		OriginatingChannel: params.replyRoute?.originatingChannel ?? params.sessionCtx.OriginatingChannel,
		OriginatingTo: params.replyRoute?.originatingTo ?? params.sessionCtx.OriginatingTo,
		AccountId: params.replyRoute?.originatingAccountId ?? params.sessionCtx.AccountId ?? params.run.agentAccountId,
		ChatType: normalizeChatType(params.replyRoute?.originatingChatType) ?? normalizeChatType(params.sessionCtx.ChatType) ?? params.run.chatType,
		MessageThreadId: params.replyRoute?.originatingThreadId ?? params.sessionCtx.MessageThreadId,
		ReplyToId: params.replyRoute?.originatingReplyToId ?? params.sessionCtx.ReplyToId
	};
	return {
		sessionId: params.run.sessionId,
		sessionKey: params.run.sessionKey,
		sandboxSessionKey: params.run.runtimePolicySessionKey,
		agentId: params.run.agentId,
		messageProvider: resolveOriginMessageProvider({
			originatingChannel: sessionCtx.OriginatingChannel,
			provider: sessionCtx.Provider
		}),
		...sessionCtx.ChatType ? { chatType: sessionCtx.ChatType } : {},
		agentAccountId: sessionCtx.AccountId,
		messageTo: resolveOriginMessageTo({
			originatingTo: sessionCtx.OriginatingTo,
			to: sessionCtx.To
		}),
		messageThreadId: sessionCtx.MessageThreadId ?? void 0,
		chatId: normalizeOptionalString(sessionCtx.NativeChannelId) ?? normalizeOptionalString(sessionCtx.ChatId),
		memberRoleIds: normalizeMemberRoleIds(sessionCtx.MemberRoleIds),
		...buildThreadingToolContext({
			sessionCtx,
			config,
			hasRepliedRef: params.hasRepliedRef
		}),
		currentInboundAudio: hasInboundAudio(sessionCtx)
	};
}
function normalizeMemberRoleIds(value) {
	const roles = Array.isArray(value) ? value.map((roleId) => normalizeOptionalString(roleId)).filter((roleId) => Boolean(roleId)) : [];
	return roles.length > 0 ? roles : void 0;
}
function buildTemplateSenderContext(sessionCtx) {
	return {
		senderId: normalizeOptionalString(sessionCtx.SenderId),
		channelContext: sessionCtx.ChannelContext,
		senderName: normalizeOptionalString(sessionCtx.SenderName),
		senderUsername: normalizeOptionalString(sessionCtx.SenderUsername),
		senderE164: normalizeOptionalString(sessionCtx.SenderE164)
	};
}
/** Builds execution-specific embedded run params for queued reply dispatch. */
function buildEmbeddedRunExecutionParams(params) {
	const authProfile = resolveRunAuthProfile(params.run, params.provider);
	return {
		embeddedContext: buildEmbeddedContextFromTemplate({
			run: params.run,
			replyRoute: params.replyRoute,
			sessionCtx: params.sessionCtx,
			hasRepliedRef: params.hasRepliedRef
		}),
		senderContext: buildTemplateSenderContext(params.sessionCtx),
		runBaseParams: buildEmbeddedRunBaseParams({
			run: params.run,
			provider: params.provider,
			model: params.model,
			runId: params.runId,
			promptCacheKey: params.promptCacheKey,
			authProfile,
			allowTransientCooldownProbe: params.allowTransientCooldownProbe
		})
	};
}
//#endregion
//#region src/auto-reply/reply/memory-flush.ts
function resolveMemoryFlushContextWindowTokens(params) {
	return resolveContextTokensForModel({
		cfg: params.cfg,
		provider: params.provider,
		model: params.modelId,
		contextTokensOverride: params.agentCfgContextTokens,
		allowAsyncLoad: false
	}) ?? 2e5;
}
function resolveMaxActiveTranscriptBytes(cfg) {
	const compaction = cfg?.agents?.defaults?.compaction;
	if (compaction?.truncateAfterCompaction !== true) return;
	const parsed = parseNonNegativeByteSize(compaction.maxActiveTranscriptBytes);
	return typeof parsed === "number" && parsed > 0 ? parsed : void 0;
}
function resolvePositiveTokenCount(value) {
	return typeof value === "number" && Number.isFinite(value) && value > 0 ? Math.floor(value) : void 0;
}
function asRecord(value) {
	return value && typeof value === "object" && !Array.isArray(value) ? value : void 0;
}
function resolveBooleanParam(sources, key) {
	for (const source of sources.toReversed()) {
		const value = source?.[key];
		if (typeof value === "boolean") return value;
	}
}
function resolvePositiveIntegerParam(sources, key) {
	for (const source of sources.toReversed()) {
		const value = source?.[key];
		if (typeof value === "number" && Number.isFinite(value) && value > 0) return Math.floor(value);
	}
}
function resolveResponsesServerCompactionThreshold(params) {
	const provider = params.provider?.trim();
	const modelId = params.modelId?.trim();
	if (!provider || !modelId) return;
	const legacyKey = legacyModelKey(provider, modelId);
	const providerConfig = params.cfg?.models?.providers?.[provider];
	const modelConfig = params.cfg?.agents?.defaults?.models?.[modelKey(provider, modelId)] ?? (legacyKey ? params.cfg?.agents?.defaults?.models?.[legacyKey] : void 0);
	const providerModelConfig = providerConfig?.models?.find((entry) => entry.id === modelId);
	const sources = [
		asRecord(providerConfig?.params),
		asRecord(providerModelConfig?.params),
		asRecord(params.cfg?.agents?.defaults?.params),
		asRecord(modelConfig?.params)
	];
	const serverCompaction = resolveBooleanParam(sources, "responsesServerCompaction");
	if (!(provider === "openai" ? serverCompaction !== false : serverCompaction === true)) return;
	return resolvePositiveIntegerParam(sources, "responsesCompactThreshold");
}
function resolveMemoryFlushGateState(params) {
	if (!params.entry) return null;
	const totalTokens = resolvePositiveTokenCount(params.tokenCount) ?? resolveFreshSessionTotalTokens(params.entry);
	if (!totalTokens || totalTokens <= 0) return null;
	const contextWindow = Math.max(1, Math.floor(params.contextWindowTokens));
	const reserveTokens = Math.max(0, Math.floor(params.reserveTokensFloor));
	const softThreshold = Math.max(0, Math.floor(params.softThresholdTokens));
	const threshold = Math.max(0, contextWindow - reserveTokens - softThreshold, Math.floor(params.minimumThresholdTokens ?? 0));
	if (threshold <= 0) return null;
	return {
		entry: params.entry,
		totalTokens,
		threshold
	};
}
function shouldRunMemoryFlush(params) {
	const state = resolveMemoryFlushGateState(params);
	if (!state || state.totalTokens < state.threshold) return false;
	if (hasAlreadyFlushedForCurrentCompaction(state.entry)) return false;
	return true;
}
function shouldRunPreflightCompaction(params) {
	const state = resolveMemoryFlushGateState(params);
	return Boolean(state && state.totalTokens >= state.threshold);
}
/**
* Returns true when a memory flush has already been performed for the current
* compaction cycle. This prevents repeated flush runs within the same cycle —
* important for both the token-based and transcript-size–based trigger paths.
*/
function hasAlreadyFlushedForCurrentCompaction(entry) {
	const compactionCount = entry.compactionCount ?? 0;
	const lastFlushAt = entry.memoryFlushCompactionCount;
	return typeof lastFlushAt === "number" && lastFlushAt === compactionCount;
}
//#endregion
//#region src/auto-reply/reply/agent-runner-memory.ts
/** Preflight compaction and memory flush helpers for agent runner sessions. */
const MAX_VISIBLE_MEMORY_FLUSH_ERROR_CHARS = 600;
const MAX_FLUSH_FAILURES = 3;
const MAX_FLUSH_ERROR_LENGTH = 200;
const embeddedAgentRuntimeLoader = createLazyImportLoader(() => import("./embedded-agent-75K82y9l.js"));
function loadEmbeddedAgentRuntime() {
	return embeddedAgentRuntimeLoader.load();
}
async function compactEmbeddedAgentSessionDefault(...args) {
	const { compactEmbeddedAgentSession } = await loadEmbeddedAgentRuntime();
	return await compactEmbeddedAgentSession(...args);
}
async function runEmbeddedAgentDefault(...args) {
	const { runEmbeddedAgent } = await loadEmbeddedAgentRuntime();
	return await runEmbeddedAgent(...args);
}
async function updateSessionEntryDefault(params) {
	return await updateSessionEntry({
		storePath: params.storePath,
		sessionKey: params.sessionKey
	}, params.update, {
		skipMaintenance: params.skipMaintenance,
		takeCacheOwnership: params.takeCacheOwnership
	});
}
async function ensureMemoryFlushTargetFile(params) {
	const workspaceDir = normalizeOptionalString(params.workspaceDir);
	const relativePath = normalizeOptionalString(params.relativePath);
	if (!workspaceDir || !relativePath || path.isAbsolute(relativePath)) throw new Error("Invalid memory flush target path");
	const workspaceRoot = path.resolve(workspaceDir);
	const targetPath = path.resolve(workspaceRoot, relativePath);
	const targetRelativePath = path.relative(workspaceRoot, targetPath);
	if (!targetRelativePath || targetRelativePath.startsWith("..") || path.isAbsolute(targetRelativePath)) throw new Error("Memory flush target path must stay inside the workspace");
	await fs.promises.mkdir(path.dirname(targetPath), { recursive: true });
	await (await fs.promises.open(targetPath, "a")).close();
}
const memoryDeps = {
	compactEmbeddedAgentSession: compactEmbeddedAgentSessionDefault,
	runWithModelFallback,
	ensureSelectedAgentHarnessPlugin,
	runEmbeddedAgent: runEmbeddedAgentDefault,
	ensureMemoryFlushTargetFile,
	registerAgentRunContext,
	refreshQueuedFollowupSession,
	incrementCompactionCount,
	updateSessionEntry: updateSessionEntryDefault,
	emitAgentEvent,
	randomUUID: () => crypto.randomUUID(),
	now: () => Date.now()
};
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
function resolveEffectivePromptTokens(basePromptTokens, lastOutputTokens, promptTokenEstimate) {
	const base = Math.max(0, basePromptTokens ?? 0);
	const output = Math.max(0, lastOutputTokens ?? 0);
	const estimate = Math.max(0, promptTokenEstimate ?? 0);
	return base + output + estimate;
}
function isPreflightCompactionSkipReason(reason) {
	const classification = classifyCompactionReason(reason);
	return classification === "below_threshold" || classification === "no_compactable_entries" || classification === "already_compacted_recently";
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
			fallbacksOverride: []
		};
	}
	return {
		...options,
		model: override,
		fallbacksOverride: []
	};
}
function followupUsesCliRuntime(params) {
	const provider = params.followupRun.run.provider;
	if (isCliProvider(provider, params.cfg)) return true;
	return isCliRuntimeAliasForProvider({
		provider,
		runtime: params.sessionEntry?.agentRuntimeOverride,
		cfg: params.cfg
	});
}
function resolveFollowupContextConfigProvider(params) {
	const provider = params.followupRun.run.provider;
	return resolveContextConfigProviderForRuntime({
		provider,
		runtimeId: resolveFollowupAgentRuntimeId(params),
		config: params.cfg
	});
}
function resolveFollowupAgentRuntimeId(params) {
	const matchingSessionEntry = params.sessionEntry?.sessionId === params.followupRun.run.sessionId ? params.sessionEntry : void 0;
	return resolveEffectiveAgentRuntime({
		cfg: params.cfg,
		provider: params.followupRun.run.provider,
		modelId: params.followupRun.run.model,
		agentId: params.followupRun.run.agentId,
		sessionKey: params.runtimePolicySessionKey ?? params.sessionKey ?? params.followupRun.run.runtimePolicySessionKey ?? params.followupRun.run.sessionKey,
		sessionEntry: matchingSessionEntry
	});
}
function followupUsesCodexRuntime(params) {
	return normalizeLowercaseStringOrEmpty(resolveFollowupAgentRuntimeId(params)) === "codex";
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
		text: visibleText.length > MAX_VISIBLE_MEMORY_FLUSH_ERROR_CHARS ? `${visibleText.slice(0, MAX_VISIBLE_MEMORY_FLUSH_ERROR_CHARS - 1)}…` : visibleText,
		isError: true
	};
}
function truncateMemoryFlushErrorMessage(err) {
	const message = normalizeOptionalString(formatErrorMessage(err)) || String(err);
	return message.length > MAX_FLUSH_ERROR_LENGTH ? `${message.slice(0, MAX_FLUSH_ERROR_LENGTH - 1)}…` : message;
}
const TRANSCRIPT_OUTPUT_READ_BUFFER_TOKENS = 8192;
const TRANSCRIPT_TAIL_CHUNK_BYTES = 64 * 1024;
const FALLBACK_TRANSCRIPT_BYTES_PER_TOKEN = 4;
function parseUsageFromTranscriptLine(line) {
	const trimmed = line.trim();
	if (!trimmed) return;
	try {
		const parsed = JSON.parse(trimmed);
		const usage = normalizeUsage(parsed.message?.usage ?? parsed.usage);
		if (usage && hasNonzeroUsage(usage)) return usage;
	} catch {}
}
function resolveSessionLogPath(sessionId, sessionEntry, sessionKey, opts) {
	if (!sessionId) return;
	try {
		const transcriptPath = normalizeOptionalString(sessionEntry?.transcriptPath);
		const sessionFile = normalizeOptionalString(sessionEntry?.sessionFile) || transcriptPath;
		const pathOpts = resolveSessionFilePathOptions({
			agentId: resolveAgentIdFromSessionKey(sessionKey),
			storePath: opts?.storePath
		});
		return resolveSessionFilePath(sessionId, sessionFile ? { sessionFile } : sessionEntry, pathOpts);
	} catch {
		return;
	}
}
function deriveTranscriptUsageSnapshot(snapshot) {
	const usage = snapshot?.usage;
	if (!usage) return;
	const promptTokens = deriveContextPromptTokens({ lastCallUsage: usage });
	const outputRaw = usage.output;
	const outputTokens = typeof outputRaw === "number" && Number.isFinite(outputRaw) && outputRaw > 0 ? outputRaw : void 0;
	if (!(typeof promptTokens === "number") && !(typeof outputTokens === "number")) return;
	return {
		promptTokens,
		outputTokens,
		trailingBytesTokens: typeof snapshot.trailingBytes === "number" && Number.isFinite(snapshot.trailingBytes) && snapshot.trailingBytes >= 0 ? Math.ceil(snapshot.trailingBytes / FALLBACK_TRANSCRIPT_BYTES_PER_TOKEN) : void 0
	};
}
async function appendPostCompactionRefreshPrompt(params) {
	const refreshPrompt = await readPostCompactionContext(params.followupRun.run.workspaceDir, {
		cfg: params.cfg,
		agentId: params.followupRun.run.agentId
	});
	if (!refreshPrompt) return;
	const existingPrompt = normalizeOptionalString(params.followupRun.run.extraSystemPrompt);
	if (existingPrompt?.includes(refreshPrompt)) return;
	params.followupRun.run.extraSystemPrompt = [existingPrompt, refreshPrompt].filter(Boolean).join("\n\n");
}
async function readSessionLogSnapshot(params) {
	const logPath = resolveSessionLogPath(params.sessionId, params.sessionEntry, params.sessionKey, params.opts);
	if (!logPath) return {};
	const snapshot = {};
	let usageScan;
	if (params.includeUsage) try {
		usageScan = await readLastNonzeroUsageFromSessionLog(logPath);
		snapshot.usage = deriveTranscriptUsageSnapshot(usageScan);
	} catch {
		snapshot.usage = void 0;
	}
	if (params.includeByteSize) {
		const scannedSize = usageScan?.byteSize;
		if (typeof scannedSize === "number" && Number.isFinite(scannedSize) && scannedSize >= 0) {
			snapshot.byteSize = Math.floor(scannedSize);
			return snapshot;
		}
		snapshot.byteSize = await readSessionLogByteSize(logPath);
	}
	return snapshot;
}
async function readSessionLogByteSize(logPath) {
	let handle;
	try {
		handle = await fs.promises.open(logPath, "r");
		const stat = await handle.stat();
		const size = Math.floor(stat.size);
		return Number.isFinite(size) && size >= 0 ? size : void 0;
	} catch {
		return;
	} finally {
		await handle?.close();
	}
}
async function readLastNonzeroUsageFromSessionLog(logPath) {
	const handle = await fs.promises.open(logPath, "r");
	try {
		const stat = await handle.stat();
		let position = stat.size;
		let leadingPartial = "";
		while (position > 0) {
			const chunkSize = Math.min(TRANSCRIPT_TAIL_CHUNK_BYTES, position);
			const start = position - chunkSize;
			const buffer = Buffer.allocUnsafe(chunkSize);
			const { bytesRead } = await handle.read(buffer, 0, chunkSize, start);
			if (bytesRead <= 0) break;
			const chunk = buffer.toString("utf-8", 0, bytesRead);
			const appendedPartialBytes = Buffer.byteLength(leadingPartial, "utf8");
			const lines = `${chunk}${leadingPartial}`.split(/\n+/);
			const firstLine = lines.shift() ?? "";
			if (start > 0) leadingPartial = firstLine;
			else {
				leadingPartial = "";
				lines.unshift(firstLine);
			}
			const suffixBytesBeforeChunk = stat.size - position;
			const suffixBytesOutsideCombined = Math.max(0, suffixBytesBeforeChunk - appendedPartialBytes);
			for (let i = lines.length - 1; i >= 0; i -= 1) {
				const usage = parseUsageFromTranscriptLine(lines[i] ?? "");
				if (usage) return {
					usage,
					trailingBytes: suffixBytesOutsideCombined + estimatePostUsageTrailingBytes(lines.slice(i + 1)),
					byteSize: stat.size
				};
			}
			position = start;
		}
		const usage = parseUsageFromTranscriptLine(leadingPartial);
		return usage ? {
			usage,
			trailingBytes: Math.max(0, stat.size - Buffer.byteLength(leadingPartial, "utf8")),
			byteSize: stat.size
		} : { byteSize: stat.size };
	} finally {
		await handle.close();
	}
}
function estimatePostUsageTrailingBytes(lines) {
	if (!lines.some((line) => line.trim())) return 0;
	return Buffer.byteLength(lines.join("\n"), "utf8") + lines.length;
}
async function estimatePromptTokensFromSessionTranscript(params) {
	const sessionId = normalizeOptionalString(params.sessionId);
	if (!sessionId) return;
	const fallbackSessionFile = normalizeOptionalString(params.sessionFile);
	const sessionEntryForTranscript = params.sessionEntry?.sessionFile || !fallbackSessionFile ? params.sessionEntry : {
		...params.sessionEntry,
		sessionFile: fallbackSessionFile
	};
	try {
		const snapshot = await readSessionLogSnapshot({
			sessionId,
			sessionEntry: sessionEntryForTranscript,
			sessionKey: params.sessionKey,
			opts: { storePath: params.storePath },
			includeByteSize: true,
			includeUsage: true
		});
		const transcriptBytesTokens = typeof snapshot.byteSize === "number" && Number.isFinite(snapshot.byteSize) && snapshot.byteSize > 0 ? Math.ceil(snapshot.byteSize / FALLBACK_TRANSCRIPT_BYTES_PER_TOKEN) : void 0;
		const promptTokens = snapshot.usage?.promptTokens;
		const trailingBytesTokens = snapshot.usage?.trailingBytesTokens;
		const outputTokens = snapshot.usage?.outputTokens;
		if (typeof promptTokens === "number" && Number.isFinite(promptTokens) && promptTokens > 0 && trailingBytesTokens === 0 && typeof outputTokens === "number" && Number.isFinite(outputTokens) && outputTokens > 0) return {
			promptTokens: Math.ceil(promptTokens),
			outputTokens: Math.ceil(outputTokens),
			transcriptByteSize: snapshot.byteSize,
			transcriptBytesTokens
		};
		const messages = await readSessionMessagesAsync(sessionId, params.storePath, sessionEntryForTranscript?.sessionFile, {
			mode: "recent",
			maxMessages: 200,
			maxBytes: 1024 * 1024
		});
		const estimatedMessageTokens = (() => {
			if (messages.length === 0) return;
			const tokens = estimateMessagesTokens(messages);
			return Number.isFinite(tokens) && tokens > 0 ? Math.ceil(tokens) : void 0;
		})();
		if (typeof promptTokens === "number" && Number.isFinite(promptTokens) && promptTokens > 0) {
			const usagePromptTokens = Math.ceil(promptTokens) + (trailingBytesTokens ?? 0);
			return {
				promptTokens: Math.max(usagePromptTokens, estimatedMessageTokens ?? 0),
				outputTokens: typeof outputTokens === "number" && Number.isFinite(outputTokens) && outputTokens > 0 ? Math.ceil(outputTokens) : void 0,
				transcriptByteSize: snapshot.byteSize,
				transcriptBytesTokens
			};
		}
		const estimatedTokens = estimatedMessageTokens ?? transcriptBytesTokens;
		if (estimatedTokens === void 0) return;
		return {
			promptTokens: Math.ceil(estimatedTokens),
			transcriptByteSize: snapshot.byteSize,
			transcriptBytesTokens
		};
	} catch {
		return;
	}
}
/** Runs preflight compaction when session state exceeds configured thresholds. */
async function runPreflightCompactionIfNeeded(params) {
	const deps = {
		compactEmbeddedAgentSession: memoryDeps.compactEmbeddedAgentSession,
		incrementCompactionCount: memoryDeps.incrementCompactionCount,
		refreshQueuedFollowupSession: memoryDeps.refreshQueuedFollowupSession
	};
	if (!params.sessionKey) return params.sessionEntry;
	let entry = params.sessionEntry ?? (params.sessionKey ? params.sessionStore?.[params.sessionKey] : void 0);
	if (!entry?.sessionId) return entry ?? params.sessionEntry;
	const isCli = followupUsesCliRuntime({
		cfg: params.cfg,
		followupRun: params.followupRun,
		sessionEntry: entry
	});
	if (params.isHeartbeat || isCli) return entry ?? params.sessionEntry;
	if (followupUsesCodexRuntime({
		cfg: params.cfg,
		followupRun: params.followupRun,
		sessionEntry: entry,
		sessionKey: params.sessionKey,
		runtimePolicySessionKey: params.runtimePolicySessionKey
	})) {
		logVerbose(`preflightCompaction skipped: sessionKey=${params.sessionKey} runtime=codex reason=codex_native_auto_compaction`);
		return entry ?? params.sessionEntry;
	}
	const contextWindowTokens = resolveMemoryFlushContextWindowTokens({
		cfg: params.cfg,
		provider: resolveFollowupContextConfigProvider({
			cfg: params.cfg,
			followupRun: params.followupRun,
			sessionEntry: entry,
			sessionKey: params.sessionKey,
			runtimePolicySessionKey: params.runtimePolicySessionKey
		}),
		modelId: params.followupRun.run.model ?? params.defaultModel,
		agentCfgContextTokens: params.agentCfgContextTokens
	});
	const memoryFlushPlan = resolveMemoryFlushPlan({ cfg: params.cfg });
	const reserveTokensFloor = memoryFlushPlan?.reserveTokensFloor ?? params.cfg.agents?.defaults?.compaction?.reserveTokensFloor ?? 2e4;
	const softThresholdTokens = memoryFlushPlan?.softThresholdTokens ?? 4e3;
	const freshPersistedTokens = resolveFreshSessionTotalTokens(entry);
	const persistedTotalTokens = entry.totalTokens;
	const hasPersistedTotalTokens = typeof persistedTotalTokens === "number" && Number.isFinite(persistedTotalTokens) && persistedTotalTokens > 0;
	const promptTokenEstimate = estimatePromptTokensForMemoryFlush(params.promptForEstimate ?? params.followupRun.prompt);
	const serverCompactionThreshold = resolveResponsesServerCompactionThreshold({
		cfg: params.cfg,
		provider: params.followupRun.run.provider,
		modelId: params.followupRun.run.model ?? params.defaultModel
	});
	const threshold = Math.max(contextWindowTokens - reserveTokensFloor - softThresholdTokens, serverCompactionThreshold ?? 0);
	const freshNeedsOutputRead = typeof freshPersistedTokens === "number" && typeof promptTokenEstimate === "number" && threshold > 0 && freshPersistedTokens + promptTokenEstimate >= threshold - TRANSCRIPT_OUTPUT_READ_BUFFER_TOKENS;
	const maxActiveTranscriptBytes = resolveMaxActiveTranscriptBytes(params.cfg);
	const shouldCheckActiveTranscriptBytes = typeof maxActiveTranscriptBytes === "number";
	const transcriptUsageTokens = typeof freshPersistedTokens === "number" && !freshNeedsOutputRead ? void 0 : await estimatePromptTokensFromSessionTranscript({
		sessionId: entry.sessionId,
		sessionEntry: entry,
		sessionKey: params.sessionKey ?? params.followupRun.run.sessionKey,
		sessionFile: entry.sessionFile ?? params.followupRun.run.sessionFile,
		storePath: params.storePath
	});
	const transcriptSizeSnapshot = shouldCheckActiveTranscriptBytes && transcriptUsageTokens?.transcriptByteSize === void 0 ? await readSessionLogSnapshot({
		sessionId: entry.sessionId,
		sessionEntry: entry.sessionFile || !params.followupRun.run.sessionFile ? entry : {
			...entry,
			sessionFile: params.followupRun.run.sessionFile
		},
		sessionKey: params.sessionKey ?? params.followupRun.run.sessionKey,
		opts: { storePath: params.storePath },
		includeByteSize: true,
		includeUsage: false
	}) : void 0;
	const activeTranscriptBytes = transcriptUsageTokens?.transcriptByteSize ?? transcriptSizeSnapshot?.byteSize;
	const shouldCompactByTranscriptBytes = typeof activeTranscriptBytes === "number" && typeof maxActiveTranscriptBytes === "number" && activeTranscriptBytes >= maxActiveTranscriptBytes;
	const stalePersistedPromptTokens = hasPersistedTotalTokens && entry.totalTokensFresh !== false ? Math.floor(persistedTotalTokens) : void 0;
	const transcriptPromptTokens = transcriptUsageTokens?.promptTokens;
	const transcriptOutputTokens = transcriptUsageTokens?.outputTokens;
	const usageProjectedTokenCount = typeof transcriptPromptTokens === "number" ? resolveEffectivePromptTokens(transcriptPromptTokens, transcriptOutputTokens, promptTokenEstimate) : void 0;
	const freshProjectedTokenCount = typeof freshPersistedTokens === "number" ? resolveEffectivePromptTokens(freshPersistedTokens, transcriptOutputTokens, promptTokenEstimate) : void 0;
	const projectedTokenCount = Math.max(usageProjectedTokenCount ?? 0, freshProjectedTokenCount ?? 0, stalePersistedPromptTokens ?? 0);
	const tokenCountForCompaction = Number.isFinite(projectedTokenCount) && projectedTokenCount > 0 ? projectedTokenCount : void 0;
	logVerbose(`preflightCompaction check: sessionKey=${params.sessionKey} tokenCount=${tokenCountForCompaction ?? freshPersistedTokens ?? "undefined"} contextWindow=${contextWindowTokens} threshold=${threshold} serverCompactionThreshold=${serverCompactionThreshold ?? "undefined"} isHeartbeat=${params.isHeartbeat} isCli=${isCli} persistedFresh=${entry?.totalTokensFresh === true} transcriptPromptTokens=${transcriptPromptTokens ?? "undefined"} promptTokensEst=${promptTokenEstimate ?? "undefined"} activeTranscriptBytes=${activeTranscriptBytes ?? "undefined"} maxActiveTranscriptBytes=${maxActiveTranscriptBytes ?? "undefined"} sizeTrigger=${shouldCompactByTranscriptBytes}`);
	if (!(shouldRunPreflightCompaction({
		entry,
		tokenCount: tokenCountForCompaction,
		contextWindowTokens,
		reserveTokensFloor,
		softThresholdTokens,
		minimumThresholdTokens: serverCompactionThreshold
	}) || shouldCompactByTranscriptBytes)) return entry ?? params.sessionEntry;
	const compactionTrigger = shouldCompactByTranscriptBytes ? "transcript_bytes" : "tokens";
	logVerbose(`preflightCompaction triggered: sessionKey=${params.sessionKey} tokenCount=${tokenCountForCompaction ?? freshPersistedTokens ?? "undefined"} threshold=${threshold} trigger=${compactionTrigger} activeTranscriptBytes=${activeTranscriptBytes ?? "undefined"} maxActiveTranscriptBytes=${maxActiveTranscriptBytes ?? "undefined"}`);
	params.replyOperation.setPhase("preflight_compacting");
	const notifyCompaction = async (phase) => {
		try {
			await params.onCompactionNotice?.(phase);
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
	const notifyTerminalCompaction = async (phase) => {
		terminalCompactionNoticeSent = true;
		await notifyCompaction(phase);
	};
	try {
		await notifyStartCompaction();
		const sessionFile = resolveSessionLogPath(entry.sessionId, entry.sessionFile ? entry : {
			...entry,
			sessionFile: params.followupRun.run.sessionFile
		}, params.sessionKey ?? params.followupRun.run.sessionKey, { storePath: params.storePath });
		const result = await deps.compactEmbeddedAgentSession({
			sessionId: entry.sessionId,
			sessionKey: params.sessionKey,
			sandboxSessionKey: params.runtimePolicySessionKey,
			allowGatewaySubagentBinding: true,
			messageChannel: params.followupRun.run.messageProvider,
			groupId: entry.groupId ?? params.followupRun.run.groupId,
			groupChannel: entry.groupChannel ?? params.followupRun.run.groupChannel,
			groupSpace: entry.space ?? params.followupRun.run.groupSpace,
			senderId: params.followupRun.run.senderId,
			senderName: params.followupRun.run.senderName,
			senderUsername: params.followupRun.run.senderUsername,
			senderE164: params.followupRun.run.senderE164,
			sessionFile: sessionFile ?? params.followupRun.run.sessionFile,
			workspaceDir: params.followupRun.run.workspaceDir,
			cwd: params.followupRun.run.cwd,
			agentDir: params.followupRun.run.agentDir,
			config: params.cfg,
			skillsSnapshot: entry.skillsSnapshot ?? params.followupRun.run.skillsSnapshot,
			provider: params.followupRun.run.provider,
			model: params.followupRun.run.model,
			authProfileId: params.followupRun.run.authProfileId,
			agentHarnessId: entry.sessionId === params.followupRun.run.sessionId ? entry.agentHarnessId : void 0,
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
			abortSignal: params.replyOperation.abortSignal
		});
		if (!result?.ok) {
			const reason = result?.reason ?? "not_compacted";
			if (isPreflightCompactionSkipReason(reason)) {
				await notifyTerminalCompaction("skipped");
				logVerbose(`preflightCompaction skipped: sessionKey=${params.sessionKey} reason=${reason}`);
				return entry ?? params.sessionEntry;
			}
			await notifyTerminalCompaction("incomplete");
			logVerbose(`preflightCompaction failed: sessionKey=${params.sessionKey} reason=${reason}`);
			throw new Error(`Preflight compaction required but failed: ${reason}`);
		}
		if (!result.compacted) {
			const reason = normalizeOptionalString(result.reason) ?? "not_compacted";
			if (isPreflightCompactionSkipReason(reason)) {
				await notifyTerminalCompaction("skipped");
				logVerbose(`preflightCompaction skipped: sessionKey=${params.sessionKey} reason=${reason}`);
				return entry ?? params.sessionEntry;
			}
			await notifyTerminalCompaction("incomplete");
			logVerbose(`preflightCompaction failed: sessionKey=${params.sessionKey} reason=${reason}`);
			throw new Error(`Preflight compaction required but failed: ${reason}`);
		}
		await deps.incrementCompactionCount({
			cfg: params.cfg,
			sessionEntry: entry,
			sessionStore: params.sessionStore,
			sessionKey: params.sessionKey,
			storePath: params.storePath,
			tokensAfter: result.result?.tokensAfter,
			newSessionId: result.result?.sessionId,
			newSessionFile: result.result?.sessionFile
		});
		await appendPostCompactionRefreshPrompt({
			cfg: params.cfg,
			followupRun: params.followupRun
		});
		await notifyTerminalCompaction("end");
		entry = params.sessionStore?.[params.sessionKey] ?? entry;
		if (entry) {
			const previousSessionId = params.followupRun.run.sessionId;
			params.followupRun.run.sessionId = entry.sessionId;
			params.replyOperation.updateSessionId(entry.sessionId);
			if (entry.sessionFile) params.followupRun.run.sessionFile = entry.sessionFile;
			const queueKey = params.followupRun.run.sessionKey ?? params.sessionKey;
			if (queueKey) deps.refreshQueuedFollowupSession({
				key: queueKey,
				previousSessionId,
				nextSessionId: entry.sessionId,
				nextSessionFile: entry.sessionFile
			});
		}
		return entry ?? params.sessionEntry;
	} catch (err) {
		if (startedCompactionNotice && !terminalCompactionNoticeSent) await notifyCompaction("incomplete");
		throw err;
	}
}
/** Runs pre-compaction memory flush when transcript state warrants it. */
async function runMemoryFlushIfNeeded(params) {
	const memoryFlushPlan = resolveMemoryFlushPlan({ cfg: params.cfg });
	if (!memoryFlushPlan) return {
		sessionEntry: params.sessionEntry,
		outcome: "skipped"
	};
	const memoryFlushWritable = (() => {
		if (!params.sessionKey) return true;
		const runtime = resolveSandboxRuntimeStatus({
			cfg: params.cfg,
			sessionKey: params.runtimePolicySessionKey ?? params.sessionKey
		});
		if (!runtime.sandboxed) return true;
		return resolveSandboxConfigForAgent(params.cfg, runtime.agentId).workspaceAccess === "rw";
	})();
	let entry = params.sessionEntry ?? (params.sessionKey ? params.sessionStore?.[params.sessionKey] : void 0);
	const isCli = followupUsesCliRuntime({
		cfg: params.cfg,
		followupRun: params.followupRun,
		sessionEntry: entry
	});
	const canAttemptFlush = memoryFlushWritable && !params.isHeartbeat && !isCli;
	const contextWindowTokens = resolveMemoryFlushContextWindowTokens({
		cfg: params.cfg,
		provider: resolveFollowupContextConfigProvider({
			cfg: params.cfg,
			followupRun: params.followupRun,
			sessionEntry: entry,
			sessionKey: params.sessionKey,
			runtimePolicySessionKey: params.runtimePolicySessionKey
		}),
		modelId: params.followupRun.run.model ?? params.defaultModel,
		agentCfgContextTokens: params.agentCfgContextTokens
	});
	const promptTokenEstimate = estimatePromptTokensForMemoryFlush(params.promptForEstimate ?? params.followupRun.prompt);
	const persistedPromptTokensRaw = entry?.totalTokens;
	const persistedPromptTokens = typeof persistedPromptTokensRaw === "number" && Number.isFinite(persistedPromptTokensRaw) && persistedPromptTokensRaw > 0 ? persistedPromptTokensRaw : void 0;
	const hasFreshPersistedPromptTokens = typeof persistedPromptTokens === "number" && entry?.totalTokensFresh === true;
	const flushThreshold = contextWindowTokens - memoryFlushPlan.reserveTokensFloor - memoryFlushPlan.softThresholdTokens;
	const shouldReadTranscriptForOutput = canAttemptFlush && entry && hasFreshPersistedPromptTokens && typeof promptTokenEstimate === "number" && Number.isFinite(promptTokenEstimate) && flushThreshold > 0 && (persistedPromptTokens ?? 0) + promptTokenEstimate >= flushThreshold - TRANSCRIPT_OUTPUT_READ_BUFFER_TOKENS;
	const shouldReadTranscript = Boolean(canAttemptFlush && entry && (!hasFreshPersistedPromptTokens || shouldReadTranscriptForOutput));
	const forceFlushTranscriptBytes = memoryFlushPlan.forceFlushTranscriptBytes;
	const shouldCheckTranscriptSizeForForcedFlush = Boolean(canAttemptFlush && entry && Number.isFinite(forceFlushTranscriptBytes) && forceFlushTranscriptBytes > 0);
	const sessionLogSnapshot = shouldReadTranscript || shouldCheckTranscriptSizeForForcedFlush ? await readSessionLogSnapshot({
		sessionId: params.followupRun.run.sessionId,
		sessionEntry: entry,
		sessionKey: params.sessionKey ?? params.followupRun.run.sessionKey,
		opts: { storePath: params.storePath },
		includeByteSize: shouldCheckTranscriptSizeForForcedFlush,
		includeUsage: shouldReadTranscript
	}) : void 0;
	const transcriptByteSize = sessionLogSnapshot?.byteSize;
	const shouldForceFlushByTranscriptSize = typeof transcriptByteSize === "number" && transcriptByteSize >= forceFlushTranscriptBytes;
	const transcriptUsageSnapshot = sessionLogSnapshot?.usage;
	const transcriptPromptTokens = transcriptUsageSnapshot?.promptTokens;
	const transcriptOutputTokens = transcriptUsageSnapshot?.outputTokens;
	const hasReliableTranscriptPromptTokens = typeof transcriptPromptTokens === "number" && Number.isFinite(transcriptPromptTokens) && transcriptPromptTokens > 0;
	if (entry && hasReliableTranscriptPromptTokens && (!hasFreshPersistedPromptTokens || (transcriptPromptTokens ?? 0) > (persistedPromptTokens ?? 0))) {
		const nextEntry = {
			...entry,
			totalTokens: transcriptPromptTokens,
			totalTokensFresh: true
		};
		entry = nextEntry;
		if (params.sessionKey && params.sessionStore) params.sessionStore[params.sessionKey] = nextEntry;
		if (params.storePath && params.sessionKey) try {
			const updatedEntry = await updateSessionEntry({
				storePath: params.storePath,
				sessionKey: params.sessionKey
			}, () => ({
				totalTokens: transcriptPromptTokens,
				totalTokensFresh: true
			}), {
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
	const projectedTokenCount = promptTokensSnapshot > 0 && (hasFreshPersistedPromptTokens || hasReliableTranscriptPromptTokens) ? resolveEffectivePromptTokens(promptTokensSnapshot, transcriptOutputTokens, promptTokenEstimate) : void 0;
	const tokenCountForFlush = typeof projectedTokenCount === "number" && Number.isFinite(projectedTokenCount) && projectedTokenCount > 0 ? projectedTokenCount : void 0;
	logVerbose(`memoryFlush check: sessionKey=${params.sessionKey} tokenCount=${tokenCountForFlush ?? "undefined"} contextWindow=${contextWindowTokens} threshold=${flushThreshold} isHeartbeat=${params.isHeartbeat} isCli=${isCli} memoryFlushWritable=${memoryFlushWritable} compactionCount=${entry?.compactionCount ?? 0} memoryFlushCompactionCount=${entry?.memoryFlushCompactionCount ?? "undefined"} persistedPromptTokens=${persistedPromptTokens ?? "undefined"} persistedFresh=${entry?.totalTokensFresh === true} promptTokensEst=${promptTokenEstimate ?? "undefined"} transcriptPromptTokens=${transcriptPromptTokens ?? "undefined"} transcriptOutputTokens=${transcriptOutputTokens ?? "undefined"} projectedTokenCount=${projectedTokenCount ?? "undefined"} transcriptBytes=${transcriptByteSize ?? "undefined"} forceFlushTranscriptBytes=${forceFlushTranscriptBytes} forceFlushByTranscriptSize=${shouldForceFlushByTranscriptSize}`);
	if (!(memoryFlushWritable && !params.isHeartbeat && !isCli && shouldRunMemoryFlush({
		entry,
		tokenCount: tokenCountForFlush,
		contextWindowTokens,
		reserveTokensFloor: memoryFlushPlan.reserveTokensFloor,
		softThresholdTokens: memoryFlushPlan.softThresholdTokens
	}) || (shouldForceFlushByTranscriptSize || isDevMode()) && entry != null && !hasAlreadyFlushedForCurrentCompaction(entry))) return {
		sessionEntry: entry ?? params.sessionEntry,
		outcome: "skipped"
	};
	logVerbose(`memoryFlush triggered: sessionKey=${params.sessionKey} tokenCount=${tokenCountForFlush ?? "undefined"} threshold=${flushThreshold}`);
	params.replyOperation.setPhase("memory_flushing");
	let activeSessionEntry = entry ?? params.sessionEntry;
	const activeSessionStore = params.sessionStore;
	let bootstrapPromptWarningSignaturesSeen = resolveBootstrapWarningSignaturesSeen(activeSessionEntry?.systemPromptReport ?? (params.sessionKey ? activeSessionStore?.[params.sessionKey]?.systemPromptReport : void 0));
	const flushRunId = memoryDeps.randomUUID();
	if (params.sessionKey) memoryDeps.registerAgentRunContext(flushRunId, {
		sessionKey: params.sessionKey,
		...activeSessionEntry?.sessionId ? { sessionId: activeSessionEntry.sessionId } : {},
		verboseLevel: params.resolvedVerboseLevel
	});
	let memoryCompactionCompleted = false;
	let outcome = "completed";
	let visibleErrorPayloads = [];
	const memoryFlushNowMs = memoryDeps.now();
	const activeMemoryFlushPlan = resolveMemoryFlushPlan({
		cfg: params.cfg,
		nowMs: memoryFlushNowMs
	}) ?? memoryFlushPlan;
	const memoryFlushWritePath = activeMemoryFlushPlan.relativePath;
	await memoryDeps.ensureMemoryFlushTargetFile({
		workspaceDir: params.followupRun.run.workspaceDir,
		relativePath: memoryFlushWritePath
	});
	const flushSystemPrompt = [params.followupRun.run.extraSystemPrompt, activeMemoryFlushPlan.systemPrompt].filter(Boolean).join("\n\n");
	let postCompactionSessionId;
	let postCompactionSessionFile;
	try {
		await memoryDeps.runWithModelFallback({
			...resolveMemoryFlushModelFallbackOptions(params.followupRun.run, activeMemoryFlushPlan.model, params.cfg),
			runId: flushRunId,
			sessionId: activeSessionEntry?.sessionId ?? params.followupRun.run.sessionId,
			lane: "main",
			abortSignal: params.replyOperation.abortSignal,
			resolveAgentHarnessRuntimeOverride: (provider) => resolveSessionRuntimeOverrideForProvider({
				provider,
				entry: activeSessionEntry,
				cfg: params.cfg
			}),
			prepareAgentHarnessRuntime: async ({ provider, model, agentHarnessRuntimeOverride }) => {
				await memoryDeps.ensureSelectedAgentHarnessPlugin({
					config: params.cfg,
					provider,
					modelId: model,
					agentId: params.followupRun.run.agentId,
					sessionKey: params.runtimePolicySessionKey ?? params.followupRun.run.runtimePolicySessionKey ?? params.sessionKey,
					agentHarnessRuntimeOverride,
					workspaceDir: params.followupRun.run.workspaceDir
				});
			},
			run: async (provider, model, runOptions) => {
				const candidateThinkLevel = resolveCandidateThinkingLevel({
					cfg: params.cfg,
					provider,
					modelId: model,
					level: params.followupRun.run.thinkLevel,
					agentId: params.followupRun.run.agentId,
					sessionKey: params.runtimePolicySessionKey ?? params.followupRun.run.runtimePolicySessionKey ?? params.sessionKey,
					sessionEntry: activeSessionEntry
				});
				const { embeddedContext, senderContext, runBaseParams } = buildEmbeddedRunExecutionParams({
					run: {
						...params.followupRun.run,
						thinkLevel: candidateThinkLevel
					},
					replyRoute: params.followupRun,
					sessionCtx: params.sessionCtx,
					hasRepliedRef: params.opts?.hasRepliedRef,
					provider,
					model,
					runId: flushRunId,
					allowTransientCooldownProbe: runOptions?.allowTransientCooldownProbe
				});
				const result = await memoryDeps.runEmbeddedAgent({
					...embeddedContext,
					...senderContext,
					...runBaseParams,
					sandboxSessionKey: params.runtimePolicySessionKey,
					allowGatewaySubagentBinding: true,
					silentExpected: true,
					trigger: "memory",
					memoryFlushWritePath,
					prompt: activeMemoryFlushPlan.prompt,
					transcriptPrompt: "",
					extraSystemPrompt: flushSystemPrompt,
					isFinalFallbackAttempt: runOptions?.isFinalFallbackAttempt,
					bootstrapPromptWarningSignaturesSeen,
					bootstrapPromptWarningSignature: bootstrapPromptWarningSignaturesSeen[bootstrapPromptWarningSignaturesSeen.length - 1],
					abortSignal: params.replyOperation.abortSignal,
					replyOperation: params.replyOperation,
					onAgentEvent: (evt) => {
						if (evt.stream === "compaction") {
							if ((typeof evt.data.phase === "string" ? evt.data.phase : "") === "end") memoryCompactionCompleted = true;
						}
					}
				});
				visibleErrorPayloads = resolveVisibleMemoryFlushErrorPayloads(result.payloads);
				if (result.meta?.agentMeta?.sessionId) postCompactionSessionId = result.meta.agentMeta.sessionId;
				if (result.meta?.agentMeta?.sessionFile) postCompactionSessionFile = result.meta.agentMeta.sessionFile;
				bootstrapPromptWarningSignaturesSeen = resolveBootstrapWarningSignaturesSeen(result.meta?.systemPromptReport);
				return result;
			}
		});
		const flushedCompactionCount = activeSessionEntry?.compactionCount ?? (params.sessionKey ? activeSessionStore?.[params.sessionKey]?.compactionCount : 0) ?? 0;
		if (memoryCompactionCompleted) {
			const previousSessionId = activeSessionEntry?.sessionId ?? params.followupRun.run.sessionId;
			await memoryDeps.incrementCompactionCount({
				cfg: params.cfg,
				sessionEntry: activeSessionEntry,
				sessionStore: activeSessionStore,
				sessionKey: params.sessionKey,
				storePath: params.storePath,
				newSessionId: postCompactionSessionId,
				newSessionFile: postCompactionSessionFile
			});
			const updatedEntry = params.sessionKey ? activeSessionStore?.[params.sessionKey] : void 0;
			if (updatedEntry) {
				activeSessionEntry = updatedEntry;
				params.followupRun.run.sessionId = updatedEntry.sessionId;
				params.replyOperation.updateSessionId(updatedEntry.sessionId);
				if (updatedEntry.sessionFile) params.followupRun.run.sessionFile = updatedEntry.sessionFile;
				const queueKey = params.followupRun.run.sessionKey ?? params.sessionKey;
				if (queueKey) memoryDeps.refreshQueuedFollowupSession({
					key: queueKey,
					previousSessionId,
					nextSessionId: updatedEntry.sessionId,
					nextSessionFile: updatedEntry.sessionFile
				});
			}
		}
		if (visibleErrorPayloads.length > 0) throw buildVisibleMemoryFlushFailure(visibleErrorPayloads);
		if (params.storePath && params.sessionKey) try {
			const updatedEntry = await memoryDeps.updateSessionEntry({
				storePath: params.storePath,
				sessionKey: params.sessionKey,
				skipMaintenance: true,
				takeCacheOwnership: true,
				update: async () => ({
					memoryFlushAt: memoryDeps.now(),
					memoryFlushCompactionCount: flushedCompactionCount,
					memoryFlushFailureCount: 0,
					memoryFlushLastFailedAt: void 0,
					memoryFlushLastFailureError: void 0
				})
			});
			if (updatedEntry) {
				activeSessionEntry = updatedEntry;
				params.followupRun.run.sessionId = updatedEntry.sessionId;
				params.replyOperation.updateSessionId(updatedEntry.sessionId);
				if (updatedEntry.sessionFile) params.followupRun.run.sessionFile = updatedEntry.sessionFile;
			}
		} catch (err) {
			logVerbose(`failed to persist memory flush metadata: ${String(err)}`);
		}
	} catch (err) {
		outcome = "failed";
		const truncatedError = truncateMemoryFlushErrorMessage(err);
		if (!isAbortError(err) && params.storePath && params.sessionKey) try {
			const failedAt = memoryDeps.now();
			const failedEntry = await memoryDeps.updateSessionEntry({
				storePath: params.storePath,
				sessionKey: params.sessionKey,
				skipMaintenance: true,
				takeCacheOwnership: true,
				update: async (sessionEntry) => ({
					memoryFlushFailureCount: Math.max(0, sessionEntry.memoryFlushFailureCount ?? 0) + 1,
					memoryFlushLastFailedAt: failedAt,
					memoryFlushLastFailureError: truncatedError
				})
			});
			if (failedEntry) {
				activeSessionEntry = failedEntry;
				if (activeSessionStore) activeSessionStore[params.sessionKey] = failedEntry;
			}
			const failureCount = Math.max(0, failedEntry?.memoryFlushFailureCount ?? 0);
			logVerbose(`memory flush failed (attempt ${failureCount}/${MAX_FLUSH_FAILURES}): ${truncatedError}`);
			memoryDeps.emitAgentEvent({
				runId: flushRunId,
				stream: "lifecycle",
				sessionKey: params.sessionKey,
				sessionId: activeSessionEntry?.sessionId,
				data: {
					phase: "memory_flush_failed",
					attempt: failureCount,
					maxAttempts: MAX_FLUSH_FAILURES,
					error: truncatedError
				}
			});
			if (failedEntry && failureCount >= MAX_FLUSH_FAILURES) {
				outcome = "exhausted";
				logVerbose(`memory flush exhausted: skipping flush for this compaction cycle after ${failureCount} consecutive failures`);
				memoryDeps.emitAgentEvent({
					runId: flushRunId,
					stream: "lifecycle",
					sessionKey: params.sessionKey,
					sessionId: failedEntry.sessionId,
					data: {
						phase: "memory_flush_exhausted",
						attempt: failureCount,
						maxAttempts: MAX_FLUSH_FAILURES
					}
				});
				const exhaustedEntry = await memoryDeps.updateSessionEntry({
					storePath: params.storePath,
					sessionKey: params.sessionKey,
					skipMaintenance: true,
					takeCacheOwnership: true,
					update: async (sessionEntry) => ({
						memoryFlushAt: memoryDeps.now(),
						memoryFlushCompactionCount: sessionEntry.compactionCount ?? 0
					})
				});
				if (exhaustedEntry) {
					activeSessionEntry = exhaustedEntry;
					if (activeSessionStore) activeSessionStore[params.sessionKey] = exhaustedEntry;
				}
				params.onVisibleErrorPayloads?.([{
					text: `⚠️ Memory flush failed after ${MAX_FLUSH_FAILURES} attempts; skipping for this cycle. It will retry after the next compaction.`,
					isError: true
				}]);
			}
		} catch (persistErr) {
			logVerbose(`failed to persist memory flush failure metadata: ${String(persistErr)}`);
		}
		else logVerbose(`memory flush run failed: ${String(err)}`);
		const visibleErrorPayload = buildMemoryFlushErrorPayload(err);
		if (visibleErrorPayload) params.onVisibleErrorPayloads?.([visibleErrorPayload]);
	}
	return {
		sessionEntry: activeSessionEntry,
		outcome
	};
}
//#endregion
export { formatBunFetchSocketError as a, resolveQueuedReplyRuntimeConfig as c, resolveRunAuthProfile as d, buildThreadingToolContext as i, resolveRunFastModeForFallbackCandidate as l, runPreflightCompactionIfNeeded as n, isBunFetchSocketError as o, buildEmbeddedRunExecutionParams as r, resolveQueuedReplyExecutionConfig as s, runMemoryFlushIfNeeded as t, resolveModelFallbackOptions as u };
