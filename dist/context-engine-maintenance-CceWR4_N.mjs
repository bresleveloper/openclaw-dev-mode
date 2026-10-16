import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { s as asFiniteNumber } from "./number-coercion-CuVhdCBs.mjs";
import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { c as trackAsyncWork, t as AsyncWorkScope } from "./async-work-scope-BYeX3gh6.mjs";
import { i as truncateWithMarker, r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { t as pruneMapToMaxSize } from "./map-size-BlrH_CnE.mjs";
import "./utils-DgZn2dLu.mjs";
import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { S as isCronSessionKey, w as isSubagentSessionKey } from "./session-key-C09ow4h0.mjs";
import { l as resolveSessionStorePathCore } from "./paths-dpReqUI8.mjs";
import "./defaults-Jag53zwP.mjs";
import { t as splitTrailingAuthProfile } from "./model-ref-profile-BNjB2hED.mjs";
import { a as normalizeOptionalAgentRuntimeId, r as isDefaultAgentRuntimeId } from "./agent-runtime-id-BZLMe-UU.mjs";
import { q as buildPluginAgentTurnPrepareContext } from "./runtime-D4MkflNJ.mjs";
import { c as inferUniqueProviderFromConfiguredModels, i as buildModelAliasIndex, u as listModelAliasCandidates } from "./model-selection-shared-BZeDVoch.mjs";
import { d as resolveSelectedOpenAIRuntimeProvider } from "./openai-routing-8cBNhOzI.mjs";
import { h as isContextEngineAbortRejection, r as hasSameContextEngineInstance, s as resolveContextEngineOwnerPluginId } from "./registry-DLLqqQAy.mjs";
import { d as joinPresentTextSegments } from "./hooks-ADSXph0M.mjs";
import { f as isGatewayWorkAdmissionClosed, s as getGatewayRestartDrainSignal, t as GatewayDrainingError } from "./gateway-work-admission-rc4ZgKq_.mjs";
import { o as resolveCandidateThinkingLevel } from "./thinking-runtime-BwS3HC5I.mjs";
import { p as publishTranscriptUpdate } from "./session-history-eviction-Cj2-Mfrh.mjs";
import { v as shouldPreserveUserFacingSessionStateForInputProvenance } from "./input-provenance-D1LHo5Qj.mjs";
import "./session-accessor-cUVSaeKy.mjs";
import { n as deriveContextPromptTokens } from "./usage-XmAH1cfG.mjs";
import { a as resolveSessionTranscriptRuntimeTarget } from "./session-accessor.transcript-target-CpxKGy_2.mjs";
import { E as deriveSessionName, a as compareProcessSessionStartOrder, p as listRunningSessions } from "./bash-process-registry-BsL_e5bm.mjs";
import { i as enqueueCommandInLane } from "./command-queue-CFE60Avj.mjs";
import { n as resolveEffectiveToolFsWorkspaceOnly } from "./tool-fs-policy-DAGJ2iyt.mjs";
import { t as drainPluginNextTurnInjectionContext } from "./host-hook-state-DNZGd1ok.mjs";
import { n as createSessionMaintenanceOwner, r as waitForSessionMaintenance } from "./coordinator-j2tQL3v9.mjs";
import { t as resolveBoundAgentIdForSession } from "./session-agent-binding-CMaQ0qvE.mjs";
import { t as agentRuntimeAuthPlanMatchesTarget } from "./prepare-auth-CySXPvY1.mjs";
import { t as resolveProcessToolScopeKey } from "./bash-process-scope-2cvMG8cQ.mjs";
import { t as log } from "./logger-BpegRAAz.mjs";
import { t as rewriteTranscriptEntriesInSessionManager } from "./transcript-rewrite-CgS3Ob1g.mjs";
import { r as normalizeContextTokenBudget } from "./utils-CEEdg_Og.mjs";
import { a as resolveContextWindowInfo } from "./context-window-guard-CdJSElvf.mjs";
import { t as SessionManager } from "./session-manager-B2n0aSnK.mjs";
import { n as withSessionManagerWrite } from "./session-manager-write-admission-B0F76kpn.mjs";
import "./sessions-DVbpm5GD.mjs";
import { AsyncLocalStorage } from "node:async_hooks";
import { normalizeStructuredPromptSection } from "@openclaw/ai/internal/shared";
//#region src/agents/bash-process-references.ts
/**
* Compact references for active background bash sessions.
* These references are surfaced in agent context so follow-up turns can
* reconnect to prior long-running work.
*/
const DEFAULT_ACTIVE_PROCESS_LIMIT = 8;
const MAX_COMMAND_LABEL_CHARS = 140;
/** List active background process sessions for one scope key, newest first. */
function listActiveProcessSessionReferences(params) {
	const scopeKey = params.scopeKey?.trim();
	if (!scopeKey) return [];
	const now = params.now ?? Date.now();
	const limit = typeof params.limit === "number" && Number.isFinite(params.limit) && params.limit > 0 ? Math.floor(params.limit) : DEFAULT_ACTIVE_PROCESS_LIMIT;
	return listRunningSessions().filter((session) => session.scopeKey === scopeKey).toSorted(compareProcessSessionStartOrder).slice(0, limit).map((session) => ({
		sessionId: session.id,
		status: "running",
		pid: session.pid,
		startedAt: session.startedAt,
		runtimeMs: Math.max(0, now - session.startedAt),
		cwd: session.cwd,
		command: session.command,
		name: truncateWithMarker(deriveSessionName(session.command) || session.command, MAX_COMMAND_LABEL_CHARS, {
			marker: "...",
			reserve: 3,
			trimEnd: false
		}),
		tail: session.tail,
		truncated: session.truncated
	}));
}
//#endregion
//#region src/agents/hook-system-context-boundary.ts
/**
* Wraps plugin-provided system context in stable prompt-cache boundaries.
*/
const HOOK_SYSTEM_CONTEXT_HEADER = "OpenClaw plugin-injected system context. This block is not workspace file content.";
/** Normalizes and fences plugin-injected system context before it enters prompts. */
function wrapPluginSystemContextSection(value) {
	if (typeof value !== "string") return;
	const normalized = normalizeStructuredPromptSection(value);
	if (!normalized) return;
	return `---\n\n${HOOK_SYSTEM_CONTEXT_HEADER}\n\n${normalized}\n\n---`;
}
//#endregion
//#region src/agents/embedded-agent-runner/compaction-runtime-context.ts
/** Resolve the configured compaction override against the actual model/runtime candidate. */
function resolveEmbeddedCompactionThinkingLevel(params) {
	const configuredLevel = params.config?.agents?.defaults?.compaction?.thinkingLevel;
	const requestedLevel = configuredLevel === "inherit" ? params.inheritedLevel : configuredLevel ?? params.compactionThinkingDefault ?? "low";
	if (!requestedLevel) return "off";
	return resolveCandidateThinkingLevel({
		cfg: params.config,
		provider: params.provider,
		modelId: params.modelId,
		level: requestedLevel,
		catalog: params.catalog,
		agentId: params.agentId,
		sessionKey: params.sessionKey,
		agentRuntime: params.agentRuntime
	}) ?? "off";
}
/**
* Resolve the effective compaction target from config, falling back to the
* caller-supplied provider/model and optionally applying runtime defaults.
*/
function resolveEmbeddedCompactionTarget(params) {
	const provider = params.provider?.trim() || params.defaultProvider;
	const model = params.modelId?.trim() || params.defaultModel;
	const override = params.modelSelectionLocked ? void 0 : params.config?.agents?.defaults?.compaction?.model?.trim();
	const assembleTarget = (targetProvider, targetModel) => {
		const authProfileId = targetProvider !== provider ? void 0 : params.authProfileId ?? void 0;
		return {
			provider: targetProvider,
			...resolveCompactionTargetRuntime(targetProvider, params.harnessRuntime),
			model: targetModel,
			authProfileId
		};
	};
	if (!override) return assembleTarget(provider, model);
	const slashIdx = override.indexOf("/");
	if (slashIdx > 0) return assembleTarget(override.slice(0, slashIdx).trim(), override.slice(slashIdx + 1).trim() || params.defaultModel);
	const config = params.config ?? {};
	const currentProvider = provider?.trim();
	if (currentProvider && hasBareConfiguredModelForProvider({
		cfg: config,
		provider: currentProvider,
		model: override
	})) return assembleTarget(currentProvider, override);
	const inferredLiteralProvider = inferUniqueProviderFromConfiguredModels({
		cfg: config,
		model: override,
		allowManifestNormalization: false
	});
	if (inferredLiteralProvider) return assembleTarget(inferredLiteralProvider, override);
	const defaultProvider = provider || "openai";
	const aliasKey = normalizeLowercaseStringOrEmpty(splitTrailingAuthProfile(override).model);
	const alias = listModelAliasCandidates(config).some(({ alias: candidate }) => normalizeLowercaseStringOrEmpty(candidate) === aliasKey) ? buildModelAliasIndex({
		cfg: config,
		defaultProvider,
		allowPluginNormalization: params.allowPluginNormalization,
		manifestPlugins: params.manifestPlugins
	}).byAlias.get(aliasKey) : void 0;
	if (alias) return assembleTarget(alias.ref.provider, alias.ref.model);
	return assembleTarget(provider, override);
}
/** Binds harness ownership without repeating model or alias selection. */
function resolveCompactionTargetRuntime(provider, harnessRuntime) {
	if (!provider) return {};
	const selectedHarnessRuntime = normalizeOptionalAgentRuntimeId(harnessRuntime);
	const useNativeHarnessRuntime = selectedHarnessRuntime !== void 0 && selectedHarnessRuntime !== "openclaw" && !isDefaultAgentRuntimeId(selectedHarnessRuntime);
	const runtimeProvider = resolveSelectedOpenAIRuntimeProvider({ provider });
	const routedRuntimeProvider = runtimeProvider === provider ? void 0 : runtimeProvider;
	return {
		runtimeProvider: routedRuntimeProvider,
		contextProvider: useNativeHarnessRuntime ? routedRuntimeProvider : void 0,
		...useNativeHarnessRuntime ? { nativeHarnessCompaction: true } : {}
	};
}
function hasBareConfiguredModelForProvider(params) {
	const providerKey = normalizeLowercaseStringOrEmpty(params.provider);
	const modelKey = normalizeLowercaseStringOrEmpty(params.model);
	if (!providerKey || !modelKey || params.model.includes("/")) return false;
	for (const rawRef of Object.keys(params.cfg.agents?.defaults?.models ?? {})) {
		const slashIdx = rawRef.indexOf("/");
		if (slashIdx <= 0 || rawRef.endsWith("/*")) continue;
		const rawProvider = rawRef.slice(0, slashIdx);
		const rawModel = rawRef.slice(slashIdx + 1);
		if (normalizeLowercaseStringOrEmpty(rawProvider) === providerKey && normalizeLowercaseStringOrEmpty(rawModel) === modelKey) return true;
	}
	return ((Object.entries(params.cfg.models?.providers ?? {}).find(([key]) => normalizeLowercaseStringOrEmpty(key) === providerKey)?.[1])?.models ?? []).some((entry) => normalizeLowercaseStringOrEmpty(entry?.id ?? "") === modelKey);
}
/** Resolves the concrete harness already bound to this exact compaction target. */
function resolveCompactionHarnessRuntime(params) {
	const boundHarnessRuntime = normalizeOptionalAgentRuntimeId(params.boundHarnessRuntime);
	if (boundHarnessRuntime) return boundHarnessRuntime;
	const preparedRuntimePlan = params.preparedRuntimePlan;
	if (preparedRuntimePlan && agentRuntimeAuthPlanMatchesTarget(preparedRuntimePlan.auth, {
		provider: params.provider,
		modelId: params.modelId
	})) {
		const preparedHarnessRuntime = normalizeOptionalAgentRuntimeId(preparedRuntimePlan.resolvedRef.harnessId);
		if (preparedHarnessRuntime) return preparedHarnessRuntime;
	}
	return normalizeOptionalAgentRuntimeId(params.configuredHarnessRuntime);
}
function resolveCompactionContextTokenBudget(params) {
	const resolvedBudget = normalizeContextTokenBudget(resolveContextWindowInfo({
		cfg: params.config,
		provider: params.provider,
		modelId: params.modelId,
		modelContextTokens: asFiniteNumber(params.model?.contextTokens),
		modelContextWindow: params.model?.contextWindow,
		defaultTokens: 2e5
	}).tokens) ?? 2e5;
	return Math.min(normalizeContextTokenBudget(params.requestedTokenBudget) ?? normalizeContextTokenBudget(params.fallbackTokenBudget) ?? resolvedBudget, resolvedBudget);
}
function buildEmbeddedCompactionRuntimeContext(params) {
	const resolved = resolveEmbeddedCompactionTarget({
		config: params.config,
		provider: params.provider,
		modelId: params.modelId,
		authProfileId: params.authProfileId,
		harnessRuntime: params.harnessRuntime,
		modelSelectionLocked: params.modelSelectionLocked
	});
	const agentHarnessId = params.harnessRuntime?.trim() || void 0;
	const runtimeAuthPlan = params.runtimeAuthPlan && resolved.provider && resolved.model && agentRuntimeAuthPlanMatchesTarget(params.runtimeAuthPlan, {
		provider: resolved.provider,
		modelId: resolved.model
	}) ? params.runtimeAuthPlan : void 0;
	const processScopeKey = params.sessionKey?.trim();
	const activeProcessSessions = params.activeProcessSessions ?? listActiveProcessSessionReferences({ scopeKey: processScopeKey });
	return {
		sessionKey: params.sessionKey ?? void 0,
		sandboxSessionKey: params.sandboxSessionKey,
		sandboxAgentId: params.sandboxAgentId,
		messageChannel: params.messageChannel ?? void 0,
		messageProvider: params.messageProvider ?? void 0,
		clientCaps: params.clientCaps,
		pinnedWidgetAuthoring: params.pinnedWidgetAuthoring,
		chatType: params.chatType ?? void 0,
		agentAccountId: params.agentAccountId ?? void 0,
		conversationRoutePeerId: params.conversationRoutePeerId,
		currentChannelId: params.currentChannelId ?? void 0,
		currentThreadTs: params.currentThreadTs ?? void 0,
		currentMessageId: params.currentMessageId ?? void 0,
		authProfileId: resolved.authProfileId,
		authProfileIdSource: params.authProfileIdSource,
		runtimeAuthPlan,
		agentHarnessId,
		modelSelectionLocked: params.modelSelectionLocked,
		workspaceDir: params.workspaceDir,
		bootstrapWorkspaceDir: params.bootstrapWorkspaceDir,
		cwd: params.cwd ?? void 0,
		permissionMode: params.permissionMode,
		sessionRoot: params.sessionRoot,
		requireWorkspaceOnly: params.requireWorkspaceOnly,
		requireWritableSandbox: params.requireWritableSandbox,
		agentDir: params.agentDir,
		config: params.config,
		toolOverrides: params.toolOverrides,
		toolsAllow: params.toolsAllow,
		skillsSnapshot: params.skillsSnapshot,
		senderIsOwner: params.senderIsOwner,
		senderId: params.senderId ?? void 0,
		provider: resolved.provider,
		runtimeProvider: resolved.runtimeProvider,
		model: resolved.model,
		modelFallbacksOverride: params.modelFallbacksOverride,
		thinkLevel: params.thinkLevel,
		reasoningLevel: params.reasoningLevel,
		execOverrides: params.execOverrides,
		bashElevated: params.bashElevated,
		extraSystemPrompt: params.extraSystemPrompt,
		sourceReplyDeliveryMode: params.sourceReplyDeliveryMode,
		ownerNumbers: params.ownerNumbers,
		...activeProcessSessions.length > 0 ? { activeProcessSessions } : {}
	};
}
//#endregion
//#region src/agents/embedded-agent-runner/context-engine-capabilities.ts
function resolveContextEngineCapabilities(params) {
	const sessionKey = normalizeOptionalString(params.sessionKey);
	const agentId = resolveBoundAgentIdForSession({
		config: params.config,
		sessionKey,
		agentId: params.explicitAgentId
	});
	const contextEnginePluginId = normalizeOptionalString(params.contextEnginePluginId);
	return { llm: { complete: async (request) => {
		const { createRuntimeLlm } = await import("./runtime-llm.runtime.js");
		return await createRuntimeLlm({
			getConfig: () => params.config,
			authority: {
				caller: {
					kind: "context-engine",
					id: params.purpose
				},
				requiresBoundAgent: true,
				...sessionKey ? { sessionKey } : {},
				...agentId ? { agentId } : {},
				...params.authProfileId ? { preferredProfile: params.authProfileId } : {},
				...contextEnginePluginId ? { pluginIdForPolicy: contextEnginePluginId } : {},
				allowAgentIdOverride: false,
				allowModelOverride: false,
				allowComplete: true
			}
		}).complete(request);
	} } };
}
//#endregion
//#region src/agents/embedded-agent-runner/run/attempt-prompt-helpers.ts
const PROMPT_BUILD_DRAIN_CACHE_MAX = 256;
const promptBuildDrainCache = /* @__PURE__ */ new Map();
function rememberDrainedInjections(runId, injections) {
	if (promptBuildDrainCache.has(runId)) promptBuildDrainCache.delete(runId);
	else if (promptBuildDrainCache.size >= PROMPT_BUILD_DRAIN_CACHE_MAX) pruneMapToMaxSize(promptBuildDrainCache, 255);
	promptBuildDrainCache.set(runId, injections);
}
/** Release at run termination so active retries retain cache headroom. */
function forgetPromptBuildDrainCacheForRun(runId) {
	if (runId) promptBuildDrainCache.delete(runId);
}
async function resolvePromptBuildHookResult(params) {
	const runId = params.hookCtx.runId;
	const cachedInjections = runId ? promptBuildDrainCache.get(runId) : void 0;
	const queuedContext = cachedInjections ? {
		queuedInjections: cachedInjections,
		...buildPluginAgentTurnPrepareContext({ queuedInjections: cachedInjections })
	} : await drainPluginNextTurnInjectionContext({
		cfg: params.config,
		sessionKey: params.hookCtx.sessionKey,
		agentId: params.hookCtx.agentId
	});
	if (runId && !cachedInjections) rememberDrainedInjections(runId, queuedContext.queuedInjections);
	const turnPrepareResult = params.hookRunner?.runAgentTurnPrepare && params.hookRunner.hasHooks("agent_turn_prepare") ? await params.hookRunner.runAgentTurnPrepare({
		prompt: params.prompt,
		messages: params.messages,
		queuedInjections: queuedContext.queuedInjections
	}, params.hookCtx).catch((hookErr) => {
		log.warn(`agent_turn_prepare hook failed: ${String(hookErr)}`);
	}) : void 0;
	const heartbeatContribution = params.hookCtx.trigger === "heartbeat" && params.hookRunner?.runHeartbeatPromptContribution && params.hookRunner.hasHooks("heartbeat_prompt_contribution") ? await params.hookRunner.runHeartbeatPromptContribution({
		sessionKey: params.hookCtx.sessionKey,
		agentId: params.hookCtx.agentId,
		heartbeatName: "heartbeat"
	}, params.hookCtx).catch((hookErr) => {
		log.warn(`heartbeat_prompt_contribution hook failed: ${String(hookErr)}`);
	}) : void 0;
	const promptBuildResult = params.hookRunner?.hasHooks("before_prompt_build") ? await params.hookRunner.runBeforePromptBuild({
		prompt: params.prompt,
		messages: params.messages
	}, params.hookCtx).catch((hookErr) => {
		log.warn(`before_prompt_build hook failed: ${String(hookErr)}`);
	}) : void 0;
	const decisionPromptBuildFields = promptBuildResult ? Object.fromEntries([
		"systemPrompt",
		"prependContext",
		"appendContext",
		"prependSystemContext",
		"appendSystemContext"
	].flatMap((field) => typeof promptBuildResult[field] === "string" ? [[field, promptBuildResult[field]]] : [])) : void 0;
	return {
		hasPendingNonPromptBuildContext: Boolean(queuedContext.prependContext?.trim() || queuedContext.appendContext?.trim() || turnPrepareResult?.prependContext?.trim() || turnPrepareResult?.appendContext?.trim() || heartbeatContribution?.prependContext?.trim() || heartbeatContribution?.appendContext?.trim()),
		...decisionPromptBuildFields && Object.keys(decisionPromptBuildFields).length > 0 ? { decisionPromptBuildFields } : {},
		systemPrompt: promptBuildResult?.systemPrompt,
		...promptBuildResult?.toolsAllow !== void 0 ? { toolsAllow: promptBuildResult.toolsAllow } : {},
		prependContext: joinPresentTextSegments([
			queuedContext.prependContext,
			turnPrepareResult?.prependContext,
			heartbeatContribution?.prependContext,
			promptBuildResult?.prependContext
		]),
		appendContext: joinPresentTextSegments([
			queuedContext.appendContext,
			turnPrepareResult?.appendContext,
			heartbeatContribution?.appendContext,
			promptBuildResult?.appendContext
		]),
		prependSystemContext: wrapPluginSystemContextSection(promptBuildResult?.prependSystemContext),
		appendSystemContext: wrapPluginSystemContextSection(promptBuildResult?.appendSystemContext)
	};
}
function resolvePromptModeForSession(sessionKey) {
	return isSubagentSessionKey(sessionKey) || isCronSessionKey(sessionKey) ? "minimal" : "full";
}
/** User-visible runs warn when transcript repair had to merge an orphaned user turn. */
function shouldWarnOnOrphanedUserRepair(trigger) {
	return trigger === "user" || trigger === "manual";
}
const QUEUED_USER_MESSAGE_MARKER = "[Queued user message from a previous active turn; preserved as context only. Continue with the active prompt below.]";
const MAX_STRUCTURED_MEDIA_REF_CHARS = 300;
const MAX_STRUCTURED_JSON_STRING_CHARS = 300;
const MAX_STRUCTURED_JSON_DEPTH = 4;
const MAX_STRUCTURED_JSON_ARRAY_ITEMS = 16;
const MAX_STRUCTURED_JSON_OBJECT_KEYS = 32;
function summarizeStructuredMediaRef(label, value) {
	if (typeof value !== "string") return;
	const trimmed = value.trim();
	if (!trimmed) return;
	const dataUriMatch = trimmed.match(/^data:([^;,]+)?(?:;[^,]*)?,/i);
	if (dataUriMatch) return `[${label}] inline data URI (${dataUriMatch[1]?.trim() || "unknown"}, ${trimmed.length} chars)`;
	if (trimmed.length > MAX_STRUCTURED_MEDIA_REF_CHARS) return `[${label}] ${truncateUtf16Safe(trimmed, MAX_STRUCTURED_MEDIA_REF_CHARS)}... (${trimmed.length} chars)`;
	return `[${label}] ${trimmed}`;
}
function summarizeStructuredJsonString(value) {
	const mediaSummary = summarizeStructuredMediaRef("value", value);
	if (mediaSummary?.includes("inline data URI")) return mediaSummary;
	const trimmed = value.trim();
	if (trimmed.length > MAX_STRUCTURED_JSON_STRING_CHARS) return `${truncateUtf16Safe(trimmed, MAX_STRUCTURED_JSON_STRING_CHARS)}... (${trimmed.length} chars)`;
	return value;
}
function sanitizeStructuredJsonValue(value, depth = 0, seen = /* @__PURE__ */ new WeakSet()) {
	if (typeof value === "string") return summarizeStructuredJsonString(value);
	if (!value || typeof value !== "object") return value;
	if (seen.has(value)) return "[circular]";
	if (depth >= MAX_STRUCTURED_JSON_DEPTH) return "[max depth]";
	seen.add(value);
	if (Array.isArray(value)) {
		const limited = value.slice(0, MAX_STRUCTURED_JSON_ARRAY_ITEMS).map((item) => sanitizeStructuredJsonValue(item, depth + 1, seen));
		if (value.length > MAX_STRUCTURED_JSON_ARRAY_ITEMS) limited.push(`[${value.length - MAX_STRUCTURED_JSON_ARRAY_ITEMS} more items]`);
		seen.delete(value);
		return limited;
	}
	const output = {};
	let copied = 0;
	let skipped = 0;
	for (const key in value) {
		if (!Object.hasOwn(value, key)) continue;
		if (copied >= MAX_STRUCTURED_JSON_OBJECT_KEYS) {
			skipped += 1;
			continue;
		}
		output[key] = sanitizeStructuredJsonValue(value[key], depth + 1, seen);
		copied += 1;
	}
	if (skipped > 0) output["__truncated"] = `${skipped} more keys`;
	seen.delete(value);
	return output;
}
function stringifyStructuredJsonFallback(part) {
	try {
		const serialized = JSON.stringify(sanitizeStructuredJsonValue(part));
		if (!serialized || serialized === "{}") return;
		const withoutInlineData = serialized.replace(/data:[^"'\\\s]+/gi, (match) => `[inline data URI: ${match.length} chars]`);
		return withoutInlineData.length > 1e3 ? `${truncateUtf16Safe(withoutInlineData, 1e3)}... (${withoutInlineData.length} chars)` : withoutInlineData;
	} catch {
		return;
	}
}
function stringifyStructuredContentPart(part) {
	if (!part || typeof part !== "object") return;
	const record = part;
	if (record.type === "text") return (typeof record.text === "string" ? record.text.trim() : "") || void 0;
	if (record.type === "image_url") {
		const imageUrl = record.image_url;
		return summarizeStructuredMediaRef("image_url", typeof imageUrl === "string" ? imageUrl : imageUrl && typeof imageUrl === "object" ? imageUrl.url : void 0);
	}
	if (record.type === "image" || record.type === "input_image") return summarizeStructuredMediaRef(record.type, record.url) ?? summarizeStructuredMediaRef(record.type, record.source);
	if (typeof record.type === "string") {
		const typedRef = summarizeStructuredMediaRef(record.type, record.audio_url) ?? summarizeStructuredMediaRef(record.type, record.media_url) ?? summarizeStructuredMediaRef(record.type, record.url) ?? summarizeStructuredMediaRef(record.type, record.source);
		if (typedRef) return typedRef;
	}
	return stringifyStructuredJsonFallback(part);
}
function extractUserMessagePromptText(content) {
	if (typeof content === "string") return content.trim() || void 0;
	if (!Array.isArray(content)) return;
	return content.flatMap((part) => {
		const textLocal = stringifyStructuredContentPart(part);
		return textLocal ? [textLocal] : [];
	}).join("\n").trim() || void 0;
}
function promptAlreadyIncludesQueuedUserMessage(prompt, orphanText) {
	const normalizedPrompt = prompt.replace(/\r\n/g, "\n");
	const normalizedOrphanText = orphanText.replace(/\r\n/g, "\n").trim();
	return normalizedOrphanText.length > 0 && `\n${normalizedPrompt}\n`.includes(`\n${normalizedOrphanText}\n`);
}
/**
* Merges a trailing user message that was queued in transcript history but not
* present in the active prompt.
*
* External user leaves are eligible to remain canonical (`removeLeaf: false`).
* Session repair preserves them only for producer-tagged main-session restart
* recovery; ordinary repair replaces them with the merged prompt. Empty or stale
* internal leaves are always detached.
*/
function mergeOrphanedTrailingUserPrompt(params) {
	const orphanText = extractUserMessagePromptText(params.leafMessage.content);
	if (!orphanText) return {
		prompt: params.prompt,
		merged: false,
		removeLeaf: true
	};
	if (params.prompt.trim().length > 0 && shouldPreserveUserFacingSessionStateForInputProvenance(params.leafMessage.provenance)) return {
		prompt: params.prompt,
		merged: false,
		removeLeaf: true
	};
	if (promptAlreadyIncludesQueuedUserMessage(params.prompt, orphanText)) return {
		prompt: params.prompt,
		merged: false,
		removeLeaf: false
	};
	return {
		prompt: [
			QUEUED_USER_MESSAGE_MARKER,
			orphanText,
			"",
			params.prompt
		].join("\n"),
		merged: true,
		removeLeaf: false
	};
}
function resolveAttemptFsWorkspaceOnly(params) {
	return resolveEffectiveToolFsWorkspaceOnly({
		cfg: params.config,
		agentId: params.sessionAgentId
	});
}
function resolveRuntimeContextSessionTarget(params) {
	const sessionTarget = params.attempt.sessionTarget;
	const agentId = sessionTarget?.agentId ?? params.activeAgentId;
	const sessionId = sessionTarget?.sessionId ?? params.attempt.sessionId;
	const sessionKey = sessionTarget?.sessionKey ?? params.attempt.sessionKey;
	if (!agentId && !sessionId && !sessionKey && !sessionTarget?.storePath && sessionTarget?.threadId === void 0) return;
	return {
		...agentId ? { agentId } : {},
		...sessionId ? { sessionId } : {},
		...sessionKey ? { sessionKey } : {},
		...sessionTarget?.storePath ? { storePath: sessionTarget.storePath } : {},
		...sessionTarget?.threadId !== void 0 ? { threadId: sessionTarget.threadId } : {}
	};
}
function buildAfterTurnRuntimeContext(params) {
	const sessionTarget = resolveRuntimeContextSessionTarget({
		attempt: params.attempt,
		activeAgentId: params.activeAgentId
	});
	const tokenBudget = normalizeContextTokenBudget(params.tokenBudget);
	const currentTokenCount = normalizeContextTokenBudget(params.currentTokenCount);
	return {
		...buildEmbeddedCompactionRuntimeContext({
			sessionKey: params.attempt.sessionKey,
			sandboxSessionKey: params.attempt.sandboxSessionKey,
			sandboxAgentId: params.attempt.sandboxAgentId,
			messageChannel: params.attempt.messageChannel,
			messageProvider: params.attempt.messageProvider,
			agentAccountId: params.attempt.agentAccountId,
			currentChannelId: params.attempt.currentChannelId,
			currentThreadTs: params.attempt.currentThreadTs,
			currentMessageId: params.attempt.currentMessageId,
			authProfileId: params.attempt.authProfileId,
			authProfileIdSource: params.attempt.authProfileIdSource,
			runtimeAuthPlan: params.attempt.runtimePlan?.auth,
			workspaceDir: params.workspaceDir,
			cwd: params.cwd,
			agentDir: params.agentDir,
			config: params.attempt.config,
			toolsAllow: params.attempt.toolsAllow,
			skillsSnapshot: params.attempt.skillsSnapshot,
			senderId: params.attempt.senderId,
			provider: params.attempt.provider,
			modelId: params.attempt.modelId,
			harnessRuntime: params.attempt.agentHarnessId,
			modelSelectionLocked: params.attempt.modelSelectionLocked,
			thinkLevel: params.attempt.thinkLevel,
			reasoningLevel: params.attempt.reasoningLevel,
			bashElevated: params.attempt.bashElevated,
			extraSystemPrompt: params.attempt.extraSystemPrompt,
			ownerNumbers: params.attempt.ownerNumbers,
			activeProcessSessions: listActiveProcessSessionReferences({ scopeKey: resolveProcessToolScopeKey({
				sessionKey: params.attempt.sessionKey,
				sessionId: params.attempt.sessionId,
				agentId: params.activeAgentId
			}) })
		}),
		...resolveContextEngineCapabilities({
			config: params.attempt.config,
			sessionKey: params.attempt.sessionKey,
			explicitAgentId: params.attempt.contextEngineAgentId,
			authProfileId: params.attempt.authProfileId,
			contextEnginePluginId: params.contextEnginePluginId,
			purpose: "context-engine.after-turn"
		}),
		...tokenBudget !== void 0 ? { tokenBudget } : {},
		...currentTokenCount !== void 0 ? { currentTokenCount } : {},
		...params.promptCache ? { promptCache: params.promptCache } : {},
		transcriptStorage: { kind: "sqlite" },
		...sessionTarget ? { sessionTarget } : {}
	};
}
function buildAfterTurnRuntimeContextFromUsage(params) {
	return buildAfterTurnRuntimeContext({
		...params,
		currentTokenCount: deriveContextPromptTokens({ lastCallUsage: params.lastCallUsage })
	});
}
//#endregion
//#region src/agents/embedded-agent-runner/transcript-runtime-state.ts
/**
* Resolves the runtime transcript target for read/probe operations without
* linking missing file-backed metadata into the session store.
*/
async function resolveRuntimeTranscriptReadTarget(scope) {
	const target = await resolveSessionTranscriptRuntimeTarget(scope);
	const { restoreSessionColdTranscript } = await import("./session-cold-storage-DmgpAWjS.mjs");
	await restoreSessionColdTranscript({
		...target,
		...scope.env ? { env: scope.env } : {}
	});
	return target;
}
//#endregion
//#region src/agents/embedded-agent-runner/context-engine-maintenance-execution.ts
function buildContextEngineMaintenanceRuntimeContext(params) {
	return {
		...params.runtimeContext,
		...resolveContextEngineCapabilities({
			config: params.config,
			sessionKey: params.sessionKey,
			explicitAgentId: params.contextEngineAgentId,
			authProfileId: normalizeOptionalString(params.runtimeContext?.authProfileId),
			contextEnginePluginId: resolveContextEngineOwnerPluginId(params.contextEngine),
			purpose: `context-engine.${params.reason}.maintenance`
		}),
		...params.sessionTarget ? { sessionTarget: params.sessionTarget } : {},
		...params.allowDeferredCompactionExecution ? { allowDeferredCompactionExecution: true } : {},
		rewriteTranscriptEntries: async (request) => {
			params.assertActive?.();
			const runtimeAgentId = params.sessionTarget?.agentId ?? params.agentId;
			const runtimeSessionKey = normalizeOptionalString(params.sessionTarget?.sessionKey ?? params.sessionKey);
			if (!runtimeSessionKey) throw new Error("Context-engine transcript rewrite requires a session key");
			const runtimeStorePath = params.sessionTarget?.storePath ?? (runtimeAgentId ? resolveSessionStorePathCore(params.config?.session?.store, { agentId: runtimeAgentId }) : void 0);
			let runtimeTarget;
			const rewriteSessionManagerEntries = async () => {
				let sessionManager = params.sessionManager;
				runtimeTarget = sessionManager?.getSessionTarget();
				if (!sessionManager) {
					runtimeTarget = await resolveRuntimeTranscriptReadTarget({
						sessionId: params.sessionTarget?.sessionId ?? params.sessionId,
						sessionKey: runtimeSessionKey,
						sessionFile: params.sessionFile,
						...runtimeAgentId ? { agentId: runtimeAgentId } : {},
						...runtimeStorePath ? { storePath: runtimeStorePath } : {}
					});
					params.assertActive?.();
					sessionManager = await SessionManager.openAsync(runtimeTarget);
					params.assertActive?.();
				}
				const manager = sessionManager;
				return await withSessionManagerWrite(manager, () => {
					params.abortSignal?.throwIfAborted();
					params.assertActive?.();
					return rewriteTranscriptEntriesInSessionManager({
						sessionManager: manager,
						replacements: request.replacements
					});
				});
			};
			const result = await (params.withSessionManagerRewriteLock ? params.withSessionManagerRewriteLock(rewriteSessionManagerEntries) : rewriteSessionManagerEntries());
			params.assertActive?.();
			if (result.changed && runtimeTarget) {
				await publishTranscriptUpdate(runtimeTarget);
				params.assertActive?.();
			}
			return result;
		}
	};
}
async function executeContextEngineMaintenance(params) {
	if (typeof params.contextEngine.maintain !== "function") return;
	params.abortSignal?.throwIfAborted();
	params.assertActive?.();
	const result = await params.contextEngine.maintain({
		sessionId: params.sessionId,
		sessionKey: params.sessionKey,
		sessionTarget: params.sessionTarget,
		sessionFile: params.sessionFile,
		runtimeSettings: params.runtimeSettings,
		runtimeContext: buildContextEngineMaintenanceRuntimeContext({
			...params,
			sessionManager: params.executionMode === "background" ? void 0 : params.sessionManager,
			withSessionManagerRewriteLock: params.executionMode === "background" ? void 0 : params.withSessionManagerRewriteLock,
			allowDeferredCompactionExecution: params.executionMode === "background"
		}),
		...params.abortSignal ? { abortSignal: params.abortSignal } : {}
	});
	params.abortSignal?.throwIfAborted();
	params.assertActive?.();
	if (result.changed) log.info(`[context-engine] maintenance(${params.reason}) changed transcript rewrittenEntries=${result.rewrittenEntries} bytesFreed=${result.bytesFreed} sessionKey=${params.sessionKey ?? params.sessionId ?? "unknown"}`);
	return result;
}
//#endregion
//#region src/agents/embedded-agent-runner/context-engine-maintenance-work.ts
/** Maintenance owns cooperating descendants through the operation's actual settlement. */
async function runContextEngineMaintenanceWork(run, signal, releaseResources) {
	const work = new AsyncWorkScope();
	const context = work.run(() => AsyncLocalStorage.snapshot());
	const cancel = () => context(() => work.beginClose(signal.reason));
	signal.addEventListener("abort", cancel, { once: true });
	if (signal.aborted) cancel();
	try {
		await work.track(run);
	} finally {
		try {
			await AsyncWorkScope.runWhenAllIdle(() => [work], () => context(() => work.beginClose()));
			await AsyncWorkScope.runWhenAllIdle(() => [work], () => context(async () => {
				try {
					await releaseResources?.();
				} finally {
					await work.drain();
				}
			}));
		} finally {
			signal.removeEventListener("abort", cancel);
		}
	}
}
async function disposeDeferredMaintenanceContextEngine(params, maintenance) {
	const failures = [];
	const resources = [...params.factoryResourceOwners ?? []];
	let releasing;
	const releaseResources = () => releasing ??= Promise.allSettled(resources.map(async (owner) => await owner.release())).then((outcomes) => {
		for (const outcome of outcomes) if (outcome.status === "rejected") failures.push(outcome.reason);
	});
	try {
		await params.runInContext(() => maintenance.run(() => runContextEngineMaintenanceWork(async () => {
			const disposal = (async () => {
				await params.contextEngine.dispose?.();
			})();
			const factoryWork = resources.map(({ closeFactoryWork }) => trackAsyncWork(closeFactoryWork));
			const outcomes = await Promise.allSettled([disposal, ...factoryWork]);
			for (const outcome of outcomes) if (outcome.status === "rejected") failures.push(outcome.reason);
		}, maintenance.signal, releaseResources)));
	} catch (error) {
		failures.push(error);
	}
	await releaseResources();
	for (const error of failures) log.warn("context engine dispose failed after deferred maintenance", { errorMessage: formatErrorMessage(error) });
}
/** Shared engine instances retain every factory lifetime until their final disposer starts. */
function mergeContextEngineFactoryWork(params, activeEngine, activeResources, superseded) {
	if (superseded && hasSameContextEngineInstance(superseded.contextEngine, params.contextEngine)) for (const resources of superseded.factoryResourceOwners) params.factoryResourceOwners.add(resources);
	if (hasSameContextEngineInstance(params.contextEngine, activeEngine)) {
		for (const resources of params.factoryResourceOwners) activeResources.add(resources);
		return activeResources;
	}
	return params.factoryResourceOwners;
}
//#endregion
//#region src/agents/embedded-agent-runner/context-engine-maintenance.ts
const TURN_MAINTENANCE_LANE_PREFIX = "context-engine-turn-maintenance:";
const DEFERRED_TURN_MAINTENANCE_ABORT_STATE_KEY = Symbol.for("openclaw.contextEngineTurnMaintenanceAbortState");
const activeDeferredTurnMaintenanceRuns = /* @__PURE__ */ new Map();
function unregisterDeferredTurnMaintenanceAbortSignalHandlers(processLike, state) {
	for (const [signal, handler] of state.cleanupHandlers) processLike.off(signal, handler);
	state.cleanupHandlers.clear();
}
function createDeferredTurnMaintenanceAbortSignal(params) {
	const processLike = params?.processLike ?? process;
	const state = processLike[DEFERRED_TURN_MAINTENANCE_ABORT_STATE_KEY] ??= {
		controllers: /* @__PURE__ */ new Set(),
		cleanupHandlers: /* @__PURE__ */ new Map()
	};
	const handleTerminationSignal = (signalName) => {
		const shouldReraise = processLike.listenerCount?.(signalName) === 1;
		for (const activeController of state.controllers) if (!activeController.signal.aborted) activeController.abort(/* @__PURE__ */ new Error(`received ${signalName} while waiting for deferred maintenance`));
		state.controllers.clear();
		unregisterDeferredTurnMaintenanceAbortSignalHandlers(processLike, state);
		if (shouldReraise && typeof processLike.kill === "function") try {
			processLike.kill(processLike.pid ?? process.pid, signalName);
		} catch {}
	};
	if (state.cleanupHandlers.size === 0) for (const signal of ["SIGINT", "SIGTERM"]) {
		const handler = () => handleTerminationSignal(signal);
		state.cleanupHandlers.set(signal, handler);
		processLike.on(signal, handler);
	}
	const controller = new AbortController();
	const abortSignal = AbortSignal.any([controller.signal, getGatewayRestartDrainSignal()]);
	state.controllers.add(controller);
	return {
		abortSignal,
		dispose: () => {
			state.controllers.delete(controller);
			if (state.controllers.size === 0) unregisterDeferredTurnMaintenanceAbortSignalHandlers(processLike, state);
		}
	};
}
function resetDeferredTurnMaintenanceStateForTest() {
	activeDeferredTurnMaintenanceRuns.clear();
	const processLike = process;
	const state = processLike[DEFERRED_TURN_MAINTENANCE_ABORT_STATE_KEY];
	if (!state) return;
	state.controllers.clear();
	unregisterDeferredTurnMaintenanceAbortSignalHandlers(processLike, state);
	delete processLike[DEFERRED_TURN_MAINTENANCE_ABORT_STATE_KEY];
}
if (process.env.VITEST || false) globalThis[Symbol.for("openclaw.contextEngineMaintenanceTestApi")] = {
	createDeferredTurnMaintenanceAbortSignal,
	resetDeferredTurnMaintenanceStateForTest
};
async function waitForDeferredTurnMaintenanceForSession(sessionKey) {
	await waitForSessionMaintenance(sessionKey);
}
async function runDeferredTurnMaintenanceWorker(params) {
	try {
		await executeContextEngineMaintenance({
			...params,
			executionMode: "background"
		});
	} catch (error) {
		if (!isContextEngineAbortRejection(error, params.abortSignal)) {
			params.onDeferredMaintenanceFailure?.(error);
			log.warn("Deferred context engine maintenance failed: " + formatErrorMessage(error));
		}
	}
}
function scheduleDeferredTurnMaintenance(params) {
	const { sessionKey } = params;
	if (isGatewayWorkAdmissionClosed()) {
		params.onDeferredMaintenanceFailure?.(new GatewayDrainingError());
		return;
	}
	const activeRun = activeDeferredTurnMaintenanceRuns.get(sessionKey);
	if (activeRun) {
		const supersededParams = activeRun.pendingParams;
		const latestParams = {
			...params,
			sessionKey
		};
		const activeParams = activeRun.activeParams;
		latestParams.factoryResourceOwners = mergeContextEngineFactoryWork(latestParams, activeParams.contextEngine, activeParams.factoryResourceOwners, supersededParams);
		if (supersededParams?.disposeContextEngineAfterMaintenance && hasSameContextEngineInstance(supersededParams.contextEngine, latestParams.contextEngine)) latestParams.disposeContextEngineAfterMaintenance = true;
		if (latestParams.disposeContextEngineAfterMaintenance && hasSameContextEngineInstance(latestParams.contextEngine, activeParams.contextEngine)) activeParams.disposeContextEngineAfterMaintenance = true;
		activeRun.pendingParams = latestParams;
		if (supersededParams?.disposeContextEngineAfterMaintenance && !hasSameContextEngineInstance(supersededParams.contextEngine, activeParams.contextEngine) && !hasSameContextEngineInstance(supersededParams.contextEngine, latestParams.contextEngine)) {
			const disposal = disposeDeferredMaintenanceContextEngine(supersededParams, activeRun.maintenance);
			activeRun.pendingDisposals.add(disposal);
			disposal.finally(() => activeRun.pendingDisposals.delete(disposal));
		}
		return activeRun.promise;
	}
	const schedulerAbort = createDeferredTurnMaintenanceAbortSignal();
	const maintenance = createSessionMaintenanceOwner({
		sessionKey,
		abortSignal: schedulerAbort.abortSignal
	});
	const completion = createDeferredCore();
	const pendingDisposals = /* @__PURE__ */ new Set();
	const state = {
		maintenance,
		pendingDisposals,
		promise: maintenance.track(completion.promise),
		activeParams: params
	};
	activeDeferredTurnMaintenanceRuns.set(sessionKey, state);
	const cleanupDeferredTurnMaintenance = () => maintenance.run(async () => {
		const current = activeDeferredTurnMaintenanceRuns.get(sessionKey);
		if (current !== state) return;
		const shutdownTriggered = maintenance.signal.aborted;
		const rerunParams = shutdownTriggered ? void 0 : current.pendingParams;
		const discardedRerunParams = shutdownTriggered ? current.pendingParams : void 0;
		activeDeferredTurnMaintenanceRuns.delete(sessionKey);
		if (rerunParams) {
			const rerunSharesActiveEngine = hasSameContextEngineInstance(rerunParams.contextEngine, params.contextEngine);
			if (!rerunSharesActiveEngine && params.disposeContextEngineAfterMaintenance) await disposeDeferredMaintenanceContextEngine(params, maintenance);
			const nextParams = rerunSharesActiveEngine && params.disposeContextEngineAfterMaintenance ? {
				...rerunParams,
				disposeContextEngineAfterMaintenance: true
			} : rerunParams;
			if (maintenance.signal.aborted) {
				if (nextParams.disposeContextEngineAfterMaintenance) await disposeDeferredMaintenanceContextEngine(nextParams, maintenance);
				return;
			}
			maintenance.releaseWrites();
			const scheduledRerun = scheduleDeferredTurnMaintenance(nextParams);
			if (!scheduledRerun && nextParams.disposeContextEngineAfterMaintenance) await disposeDeferredMaintenanceContextEngine(nextParams, maintenance);
			else await scheduledRerun;
			return;
		}
		if (params.disposeContextEngineAfterMaintenance) await disposeDeferredMaintenanceContextEngine(params, maintenance);
		if (discardedRerunParams?.disposeContextEngineAfterMaintenance && !hasSameContextEngineInstance(discardedRerunParams.contextEngine, params.contextEngine)) await disposeDeferredMaintenanceContextEngine(discardedRerunParams, maintenance);
	});
	const run = async () => {
		try {
			const lane = `${TURN_MAINTENANCE_LANE_PREFIX}${sessionKey}`;
			await enqueueCommandInLane(lane, () => params.runInContext(() => maintenance.run(() => runContextEngineMaintenanceWork(() => runDeferredTurnMaintenanceWorker({
				...params,
				abortSignal: maintenance.signal,
				assertActive: () => {
					maintenance.assertCurrent();
					params.assertActive?.();
				},
				sessionKey
			}), maintenance.signal))));
		} catch (error) {
			params.onDeferredMaintenanceFailure?.(error);
			log.warn("Failed to schedule deferred context engine maintenance: " + formatErrorMessage(error));
		}
	};
	(async () => {
		try {
			await params.runInContext(() => runContextEngineMaintenanceWork(run, maintenance.signal));
		} finally {
			try {
				await cleanupDeferredTurnMaintenance();
			} finally {
				try {
					while (pendingDisposals.size > 0) await Promise.all(pendingDisposals);
				} finally {
					schedulerAbort.dispose();
				}
			}
		}
	})().then(completion.resolve, completion.reject);
	return state.promise;
}
async function runContextEngineMaintenance(params) {
	const contextEngine = params.contextEngine;
	if (typeof contextEngine?.maintain !== "function") return;
	const ownsMemoryTranscript = params.sessionManager !== void 0 && params.sessionManager.getSessionTarget() === void 0;
	const executionMode = ownsMemoryTranscript ? "foreground" : params.executionMode ?? "foreground";
	if (!ownsMemoryTranscript && params.reason === "turn" && executionMode !== "background" && contextEngine.info.turnMaintenanceMode === "background") {
		try {
			const sessionKey = normalizeOptionalString(params.sessionKey);
			if (!sessionKey) {
				params.onDeferredMaintenanceFailure?.(/* @__PURE__ */ new Error("Deferred context-engine maintenance requires a session key"));
				return;
			}
			const deferred = scheduleDeferredTurnMaintenance({
				...params,
				contextEngine,
				sessionKey,
				runInContext: AsyncLocalStorage.snapshot(),
				factoryResourceOwners: new Set(params.factoryResources ? [params.factoryResources] : []),
				disposeContextEngineAfterMaintenance: params.disposeDeferredContextEngineAfterMaintenance
			});
			if (deferred) params.onDeferredMaintenance?.(deferred);
		} catch (err) {
			log.warn(`failed to schedule deferred context engine maintenance: ${String(err)}`);
		}
		return;
	}
	try {
		return await executeContextEngineMaintenance({
			...params,
			contextEngine,
			executionMode
		});
	} catch (err) {
		params.abortSignal?.throwIfAborted();
		params.assertActive?.();
		log.warn(`context engine maintain failed (${params.reason}): ${String(err)}`);
		return;
	}
}
//#endregion
export { resolveEmbeddedCompactionThinkingLevel as _, forgetPromptBuildDrainCacheForRun as a, resolvePromptBuildHookResult as c, resolveContextEngineCapabilities as d, buildEmbeddedCompactionRuntimeContext as f, resolveEmbeddedCompactionTarget as g, resolveCompactionTargetRuntime as h, buildAfterTurnRuntimeContextFromUsage as i, resolvePromptModeForSession as l, resolveCompactionHarnessRuntime as m, waitForDeferredTurnMaintenanceForSession as n, mergeOrphanedTrailingUserPrompt as o, resolveCompactionContextTokenBudget as p, buildAfterTurnRuntimeContext as r, resolveAttemptFsWorkspaceOnly as s, runContextEngineMaintenance as t, shouldWarnOnOrphanedUserRepair as u, wrapPluginSystemContextSection as v, listActiveProcessSessionReferences as y };
