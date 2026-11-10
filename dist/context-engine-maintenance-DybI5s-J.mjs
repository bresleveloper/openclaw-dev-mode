import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { s as asFiniteNumber } from "./number-coercion-CkhMiRw8.mjs";
import { t as pruneMapToMaxSize } from "./map-size-BlrH_CnE.mjs";
import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { s as trackAsyncWork, t as AsyncWorkScope } from "./async-work-scope-BH2yUdBz.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import "./utils-gjJ-tD2q.mjs";
import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { t as createSubsystemLogger } from "./subsystem-mStysHHC.mjs";
import { S as isCronSessionKey, w as isSubagentSessionKey } from "./session-key-CSDERtm3.mjs";
import { q as buildPluginAgentTurnPrepareContext } from "./runtime-DkPagH0y.mjs";
import { h as isGatewayWorkAdmissionClosed, l as getGatewayRestartDrainSignal, t as GatewayDrainingError } from "./gateway-work-admission-FWbk4b3p.mjs";
import { c as resolveSessionStorePathCore } from "./paths-YgcBNLgG.mjs";
import "./defaults-Bg930vxE.mjs";
import { t as splitTrailingAuthProfile } from "./model-ref-profile-BNjB2hED.mjs";
import { a as normalizeOptionalAgentRuntimeId, r as isDefaultAgentRuntimeId } from "./agent-runtime-id-BZLMe-UU.mjs";
import { c as inferUniqueProviderFromConfiguredModels, i as buildModelAliasIndex, u as listModelAliasCandidates } from "./model-selection-shared-CVU_V2PQ.mjs";
import { d as resolveSelectedOpenAIRuntimeProvider } from "./openai-routing-Bm7d8DH8.mjs";
import { n as deriveContextPromptTokens } from "./usage-BqbJmOEZ.mjs";
import { h as normalizeInputProvenance, v as shouldPreserveUserFacingSessionStateForInputProvenance } from "./input-provenance-D1LHo5Qj.mjs";
import "./session-accessor-Czw4l8kI.mjs";
import { n as publishTranscriptUpdate } from "./session-accessor.sqlite-events-B20eyHIG.mjs";
import { o as resolveSessionTranscriptRuntimeTarget } from "./session-accessor.transcript-target-DDngfM5X.mjs";
import { s as resolveProviderThinkingLevel } from "./thinking-BCNoGfZ5.mjs";
import { a as resolveCandidateThinkingLevel } from "./thinking-runtime-DuxsJR5q.mjs";
import { r as hasSameContextEngineInstance, s as resolveContextEngineOwnerPluginId, v as isContextEngineAbortRejection } from "./registry-BNFZRyO5.mjs";
import { d as joinPresentTextSegments } from "./hooks-CU2qx9-T.mjs";
import { t as drainPluginNextTurnInjectionContext } from "./host-hook-state-CBArMttW.mjs";
import { i as enqueueCommandInLane } from "./command-queue-Dvag6gVL.mjs";
import { n as resolveEffectiveToolFsWorkspaceOnly } from "./tool-fs-policy-C65zBDHN.mjs";
import { n as createSessionMaintenanceOwner, r as waitForSessionMaintenance } from "./coordinator-CAtNkN-G.mjs";
import { t as resolveBoundAgentIdForSession } from "./session-agent-binding-B4xaFezN.mjs";
import { t as agentRuntimeAuthPlanMatchesTarget } from "./prepare-auth-B180a1GD.mjs";
import { t as resolveProcessToolScopeKey } from "./bash-process-scope-2cvMG8cQ.mjs";
import { t as log$1 } from "./logger-BpVUgEyL.mjs";
import { t as rewriteTranscriptEntriesInSessionManager } from "./transcript-rewrite-exk4oVrD.mjs";
import { t as listActiveProcessSessionReferences } from "./bash-process-references-By_k1Nsh.mjs";
import { a as resolveContextWindowInfo } from "./context-window-guard-y7ROXMY6.mjs";
import { t as SessionManager } from "./session-manager-Mve5HWCW.mjs";
import { i as withSessionManagerWrite } from "./session-manager-write-admission-Ca7jiEvG.mjs";
import "./sessions-DcS9dd33.mjs";
import { AsyncLocalStorage } from "node:async_hooks";
import { normalizeStructuredPromptSection } from "@openclaw/ai/internal/shared";
//#region src/agents/embedded-agent-runner/utils.ts
function normalizeContextTokenBudget(value) {
	return typeof value === "number" && Number.isFinite(value) && value > 0 ? Math.floor(value) : void 0;
}
/** Converts logical product modes into provider-facing effort values. */
function mapThinkingLevelForProvider(level, model) {
	return resolveProviderThinkingLevel({
		provider: model.provider,
		model: model.id,
		catalog: [model],
		agentRuntime: "openclaw",
		level
	});
}
function mapThinkingLevel(providerLevel) {
	return providerLevel === "adaptive" ? "high" : providerLevel || "off";
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
//#region src/agents/plugin-turn-context.ts
const log = createSubsystemLogger("agents/plugin-turn-context");
const promptBuildDrainCache = /* @__PURE__ */ new Map();
/** Release at run termination so active retries retain cache headroom. */
function forgetPromptBuildDrainCacheForRun(runId) {
	if (runId) promptBuildDrainCache.delete(runId);
}
/** Collect queued context before prepare, heartbeat, and prompt-build hooks. */
async function resolvePluginTurnContext(params) {
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
	if (runId && !cachedInjections) {
		promptBuildDrainCache.delete(runId);
		pruneMapToMaxSize(promptBuildDrainCache, 255);
		promptBuildDrainCache.set(runId, queuedContext.queuedInjections);
	}
	const turnPrepareResult = params.hookRunner?.runAgentTurnPrepare && params.hookRunner.hasHooks("agent_turn_prepare") ? await params.hookRunner.runAgentTurnPrepare({
		prompt: params.prompt,
		messages: params.messages,
		queuedInjections: queuedContext.queuedInjections
	}, params.hookCtx).catch((error) => {
		log.warn(`agent_turn_prepare hook failed: ${String(error)}`);
	}) : void 0;
	return {
		prependContext: joinPresentTextSegments([queuedContext.prependContext, turnPrepareResult?.prependContext]),
		appendContext: joinPresentTextSegments([queuedContext.appendContext, turnPrepareResult?.appendContext])
	};
}
//#endregion
//#region src/agents/run-trigger.ts
function resolveModelCallUrgency(provenance) {
	const backgroundRunKind = provenance.bootstrapContextRunKind === "cron" || provenance.bootstrapContextRunKind === "heartbeat";
	const backgroundTrigger = provenance.trigger === "cron" || provenance.trigger === "heartbeat" || provenance.trigger === "memory";
	if (backgroundRunKind || backgroundTrigger) return "background";
	if (provenance.spawnedBy || Boolean(provenance.trustedInternalHandoff) || provenance.inputProvenance?.kind === "inter_session" || provenance.inputProvenance?.kind === "internal_system") return "normal";
	if (provenance.currentInboundEventKind === "user_request" || provenance.inputProvenance?.kind === "external_user" || provenance.trigger === "user") return "foreground";
	return "normal";
}
//#endregion
//#region src/agents/embedded-agent-runner/compaction-runtime-context.ts
/** Resolve the configured compaction override against the actual model/runtime candidate. */
function resolveEmbeddedCompactionThinkingLevel(params) {
	const configuredLevel = params.config?.agents?.defaults?.compaction?.thinkingLevel;
	const requestedLevel = configuredLevel === "inherit" ? params.inheritedLevel : configuredLevel ?? params.compactionThinkingDefault ?? "low";
	if (!requestedLevel) return "off";
	return resolveCandidateThinkingLevel({
		...params,
		cfg: params.config,
		level: requestedLevel
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
	return assembleTarget(alias?.ref.provider ?? provider, alias?.ref.model ?? override);
}
/** Binds harness ownership without repeating model or alias selection. */
function resolveCompactionTargetRuntime(provider, harnessRuntime) {
	if (!provider) return {};
	const selectedHarnessRuntime = normalizeOptionalAgentRuntimeId(harnessRuntime);
	const useNativeHarnessRuntime = selectedHarnessRuntime !== "openclaw" && !isDefaultAgentRuntimeId(selectedHarnessRuntime);
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
		if (normalizeLowercaseStringOrEmpty(rawRef.slice(0, slashIdx)) === providerKey && normalizeLowercaseStringOrEmpty(rawRef.slice(slashIdx + 1)) === modelKey) return true;
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
function buildEmbeddedCompactionRuntimeContext(params, profile = "full") {
	const afterTurn = profile === "after-turn";
	const resolved = resolveEmbeddedCompactionTarget(params);
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
		clientCaps: afterTurn ? void 0 : params.clientCaps,
		pinnedWidgetAuthoring: afterTurn ? void 0 : params.pinnedWidgetAuthoring,
		chatType: afterTurn ? void 0 : params.chatType ?? void 0,
		agentAccountId: params.agentAccountId ?? void 0,
		conversationRoutePeerId: afterTurn ? void 0 : params.conversationRoutePeerId,
		currentChannelId: params.currentChannelId ?? void 0,
		currentThreadTs: params.currentThreadTs ?? void 0,
		currentMessageId: params.currentMessageId ?? void 0,
		authProfileId: resolved.authProfileId,
		authProfileIdSource: params.authProfileIdSource,
		runtimeAuthPlan,
		agentHarnessId,
		modelSelectionLocked: params.modelSelectionLocked,
		workspaceDir: params.workspaceDir,
		bootstrapWorkspaceDir: afterTurn ? void 0 : params.bootstrapWorkspaceDir,
		cwd: profile === "recovery" ? void 0 : params.cwd ?? void 0,
		permissionMode: afterTurn ? void 0 : params.permissionMode,
		sessionRoot: afterTurn ? void 0 : params.sessionRoot,
		requireWorkspaceOnly: afterTurn ? void 0 : params.requireWorkspaceOnly,
		agentDir: params.agentDir,
		config: params.config,
		toolOverrides: afterTurn ? void 0 : params.toolOverrides,
		toolsAllow: params.toolsAllow,
		skillsSnapshot: params.skillsSnapshot,
		senderIsOwner: profile === "full" ? params.senderIsOwner : void 0,
		senderId: params.senderId ?? void 0,
		provider: resolved.provider,
		runtimeProvider: resolved.runtimeProvider,
		model: resolved.model,
		modelCallUrgency: params.modelCallUrgency,
		modelFallbacksOverride: afterTurn ? void 0 : params.modelFallbacksOverride,
		thinkLevel: params.thinkLevel,
		reasoningLevel: params.reasoningLevel,
		execOverrides: afterTurn ? void 0 : params.execOverrides,
		bashElevated: params.bashElevated,
		extraSystemPrompt: params.extraSystemPrompt,
		sourceReplyDeliveryMode: afterTurn ? void 0 : params.sourceReplyDeliveryMode,
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
async function resolvePromptBuildHookResult(params) {
	const turnContext = await resolvePluginTurnContext(params);
	const logHookFailure = (hookName) => (hookErr) => {
		log$1.warn(`${hookName} hook failed: ${String(hookErr)}`);
	};
	const heartbeatContribution = params.hookCtx.trigger === "heartbeat" && params.hookRunner?.runHeartbeatPromptContribution && params.hookRunner.hasHooks("heartbeat_prompt_contribution") ? await params.hookRunner.runHeartbeatPromptContribution({
		sessionKey: params.hookCtx.sessionKey,
		agentId: params.hookCtx.agentId,
		heartbeatName: "heartbeat"
	}, params.hookCtx).catch(logHookFailure("heartbeat_prompt_contribution")) : void 0;
	const promptBuildResult = params.hookRunner?.hasHooks("before_prompt_build") ? await params.hookRunner.runBeforePromptBuild({
		prompt: params.prompt,
		messages: params.messages
	}, params.hookCtx).catch(logHookFailure("before_prompt_build")) : void 0;
	const decisionPromptBuildFields = promptBuildResult ? Object.fromEntries([
		"systemPrompt",
		"prependContext",
		"appendContext",
		"prependSystemContext",
		"appendSystemContext"
	].flatMap((field) => typeof promptBuildResult[field] === "string" ? [[field, promptBuildResult[field]]] : [])) : void 0;
	const pendingContext = [turnContext, heartbeatContribution];
	const joinContext = (key) => joinPresentTextSegments([...pendingContext, promptBuildResult].map((source) => source?.[key]));
	return {
		hasPendingNonPromptBuildContext: pendingContext.some((source) => source?.prependContext?.trim() || source?.appendContext?.trim()),
		...decisionPromptBuildFields && Object.keys(decisionPromptBuildFields).length > 0 ? { decisionPromptBuildFields } : {},
		systemPrompt: promptBuildResult?.systemPrompt,
		...promptBuildResult?.toolsAllow !== void 0 ? { toolsAllow: promptBuildResult.toolsAllow } : {},
		prependContext: joinContext("prependContext"),
		appendContext: joinContext("appendContext"),
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
const QUEUED_USER_MESSAGE_MARKER = "[Earlier unanswered user message. Address this request alongside the current input; follow the latest user instruction if they conflict.]";
const QUEUED_INTER_SESSION_MESSAGE_MARKER = "[Queued user message from a previous active turn; preserved as context only. Continue with the active prompt below.]";
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
	let keyCount = 0;
	for (const key in value) {
		if (!Object.hasOwn(value, key)) continue;
		keyCount += 1;
		if (keyCount <= MAX_STRUCTURED_JSON_OBJECT_KEYS) output[key] = sanitizeStructuredJsonValue(value[key], depth + 1, seen);
	}
	if (keyCount > MAX_STRUCTURED_JSON_OBJECT_KEYS) output["__truncated"] = `${keyCount - MAX_STRUCTURED_JSON_OBJECT_KEYS} more keys`;
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
* External user leaves are eligible to remain canonical (`removeLeaf: false`);
* the session boundary owns whether the prompt replaces their transcript leaf.
* Empty or stale internal leaves are always detached.
*/
function mergeOrphanedTrailingUserPrompt(params) {
	const orphanText = extractUserMessagePromptText(params.leafMessage.content);
	if (!orphanText || params.prompt.trim().length > 0 && shouldPreserveUserFacingSessionStateForInputProvenance(params.leafMessage.provenance)) return {
		prompt: params.prompt,
		merged: false,
		removeLeaf: true
	};
	if (promptAlreadyIncludesQueuedUserMessage(params.prompt, orphanText)) return {
		prompt: params.prompt,
		merged: false,
		removeLeaf: false
	};
	const provenance = normalizeInputProvenance(params.leafMessage.provenance);
	return {
		prompt: [
			!provenance || provenance.kind === "external_user" ? QUEUED_USER_MESSAGE_MARKER : QUEUED_INTER_SESSION_MESSAGE_MARKER,
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
function buildAfterTurnRuntimeContext(params) {
	const target = params.attempt.sessionTarget;
	const agentId = target?.agentId ?? params.activeAgentId;
	const sessionId = target?.sessionId ?? params.attempt.sessionId;
	const sessionKey = target?.sessionKey ?? params.attempt.sessionKey;
	const sessionTarget = agentId || sessionId || sessionKey || target?.storePath || target?.threadId !== void 0 ? {
		...agentId ? { agentId } : {},
		...sessionId ? { sessionId } : {},
		...sessionKey ? { sessionKey } : {},
		...target?.storePath ? { storePath: target.storePath } : {},
		...target?.threadId !== void 0 ? { threadId: target.threadId } : {}
	} : void 0;
	const tokenBudget = normalizeContextTokenBudget(params.tokenBudget);
	const currentTokenCount = normalizeContextTokenBudget(params.currentTokenCount);
	return {
		...buildEmbeddedCompactionRuntimeContext({
			...params.attempt,
			modelCallUrgency: resolveModelCallUrgency(params.attempt),
			runtimeAuthPlan: params.attempt.runtimePlan?.auth,
			workspaceDir: params.workspaceDir,
			cwd: params.cwd,
			agentDir: params.agentDir,
			harnessRuntime: params.attempt.agentHarnessId,
			activeProcessSessions: listActiveProcessSessionReferences({ scopeKey: resolveProcessToolScopeKey({
				sessionKey: params.attempt.sessionKey,
				sessionId: params.attempt.sessionId,
				agentId: params.activeAgentId
			}) })
		}, "after-turn"),
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
//#region src/agents/embedded-agent-runner/context-engine-maintenance-execution.ts
function buildContextEngineMaintenanceRuntimeContext(params) {
	const { abortSignal, assertActive } = params;
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
			assertActive?.();
			const runtimeAgentId = params.sessionTarget?.agentId ?? params.agentId;
			const runtimeSessionKey = normalizeOptionalString(params.sessionTarget?.sessionKey ?? params.sessionKey);
			if (!runtimeSessionKey) throw new Error("Context-engine transcript rewrite requires a session key");
			const runtimeStorePath = params.sessionTarget?.storePath ?? (runtimeAgentId ? resolveSessionStorePathCore(params.config?.session?.store, { agentId: runtimeAgentId }) : void 0);
			let runtimeTarget;
			const rewriteSessionManagerEntries = async () => {
				let sessionManager = params.sessionManager;
				runtimeTarget = sessionManager?.getSessionTarget();
				if (!sessionManager) {
					runtimeTarget = await resolveSessionTranscriptRuntimeTarget({
						sessionId: params.sessionTarget?.sessionId ?? params.sessionId,
						sessionKey: runtimeSessionKey,
						sessionFile: params.sessionFile,
						...runtimeAgentId ? { agentId: runtimeAgentId } : {},
						...runtimeStorePath ? { storePath: runtimeStorePath } : {}
					});
					const { restoreSessionColdTranscript } = await import("./session-cold-storage-Doo7Aerf.mjs");
					await restoreSessionColdTranscript(runtimeTarget, assertActive, void 0, void 0, abortSignal);
					sessionManager = await SessionManager.openAsync(runtimeTarget, void 0, void 0, abortSignal);
				}
				const manager = sessionManager;
				return await withSessionManagerWrite(manager, () => {
					abortSignal?.throwIfAborted();
					assertActive?.();
					return rewriteTranscriptEntriesInSessionManager({
						sessionManager: manager,
						replacements: request.replacements
					});
				});
			};
			const result = await (params.withSessionManagerRewriteLock ? params.withSessionManagerRewriteLock(rewriteSessionManagerEntries) : rewriteSessionManagerEntries());
			if (result.changed && runtimeTarget) await publishTranscriptUpdate(runtimeTarget);
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
	if (result.changed) log$1.info(`[context-engine] maintenance(${params.reason}) changed transcript rewrittenEntries=${result.rewrittenEntries} bytesFreed=${result.bytesFreed} sessionKey=${params.sessionKey ?? params.sessionId ?? "unknown"}`);
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
	const settle = async (work) => {
		for (const outcome of await Promise.allSettled(work)) if (outcome.status === "rejected") failures.push(outcome.reason);
	};
	const resources = [...params.factoryResourceOwners ?? []];
	let releasing;
	const releaseResources = () => releasing ??= settle(resources.map(async (owner) => await owner.release()));
	try {
		await params.runInContext(() => maintenance.run(() => runContextEngineMaintenanceWork(async () => {
			const disposal = (async () => {
				await params.contextEngine.dispose?.();
			})();
			const factoryWork = resources.map(({ closeFactoryWork }) => trackAsyncWork(closeFactoryWork));
			await settle([disposal, ...factoryWork]);
		}, maintenance.signal, releaseResources)));
	} catch (error) {
		failures.push(error);
	}
	await releaseResources();
	for (const error of failures) log$1.warn("context engine dispose failed after deferred maintenance", { errorMessage: formatErrorMessage(error) });
}
//#endregion
//#region src/agents/embedded-agent-runner/context-engine-maintenance.ts
const TURN_MAINTENANCE_LANE_PREFIX = "context-engine-turn-maintenance:";
const activeDeferredTurnMaintenanceRuns = /* @__PURE__ */ new Map();
const maintenanceAbortControllers = /* @__PURE__ */ new Set();
const maintenanceSignalHandlers = {
	SIGINT: () => abortDeferredMaintenance("SIGINT"),
	SIGTERM: () => abortDeferredMaintenance("SIGTERM")
};
function unregisterDeferredTurnMaintenanceAbortSignalHandlers() {
	for (const [signal, handler] of Object.entries(maintenanceSignalHandlers)) process.off(signal, handler);
}
function abortDeferredMaintenance(signal) {
	const shouldReraise = process.listenerCount(signal) === 1;
	for (const controller of maintenanceAbortControllers) controller.abort(/* @__PURE__ */ new Error(`received ${signal} while waiting for deferred maintenance`));
	maintenanceAbortControllers.clear();
	unregisterDeferredTurnMaintenanceAbortSignalHandlers();
	if (shouldReraise) process.kill(process.pid, signal);
}
function createDeferredTurnMaintenanceAbortSignal() {
	if (maintenanceAbortControllers.size === 0) for (const [signal, handler] of Object.entries(maintenanceSignalHandlers)) process.on(signal, handler);
	const controller = new AbortController();
	const abortSignal = AbortSignal.any([controller.signal, getGatewayRestartDrainSignal()]);
	maintenanceAbortControllers.add(controller);
	return {
		abortSignal,
		dispose: () => {
			maintenanceAbortControllers.delete(controller);
			if (maintenanceAbortControllers.size === 0) unregisterDeferredTurnMaintenanceAbortSignalHandlers();
		}
	};
}
function resetDeferredTurnMaintenanceStateForTest() {
	activeDeferredTurnMaintenanceRuns.clear();
	maintenanceAbortControllers.clear();
	unregisterDeferredTurnMaintenanceAbortSignalHandlers();
}
if (process.env.VITEST || false) globalThis[Symbol.for("openclaw.contextEngineMaintenanceTestApi")] = { resetDeferredTurnMaintenanceStateForTest };
async function waitForDeferredTurnMaintenanceForSession(sessionKey) {
	await waitForSessionMaintenance(sessionKey);
}
function scheduleDeferredTurnMaintenance(params) {
	const { sessionKey } = params;
	if (isGatewayWorkAdmissionClosed()) {
		params.onDeferredMaintenanceFailure?.(new GatewayDrainingError());
		return;
	}
	const activeRun = activeDeferredTurnMaintenanceRuns.get(sessionKey);
	if (activeRun) {
		if (activeRun.closing) {
			params.onDeferredMaintenanceFailure?.(/* @__PURE__ */ new Error("Deferred maintenance is finishing cleanup; try again on the next turn"));
			return;
		}
		activeRun.disposedEngines = activeRun.disposedEngines.filter((ref) => ref.deref() !== void 0);
		if (activeRun.disposedEngines.some((ref) => {
			const engine = ref.deref();
			return engine !== void 0 && hasSameContextEngineInstance(engine, params.contextEngine);
		})) {
			params.onDeferredMaintenanceFailure?.(/* @__PURE__ */ new Error("Context engine was disposed before deferred maintenance could be scheduled"));
			return;
		}
		const superseded = activeRun.pendingParams;
		activeRun.pendingParams = params;
		retainEngine(activeRun, params);
		if (superseded && !hasSameContextEngineInstance(superseded.contextEngine, activeRun.activeEngine) && !hasSameContextEngineInstance(superseded.contextEngine, params.contextEngine)) {
			const disposal = disposeRetainedEngine(activeRun, superseded.contextEngine);
			activeRun.disposals.add(disposal);
			disposal.finally(() => activeRun.disposals.delete(disposal));
		}
		return activeRun.promise;
	}
	const schedulerAbort = createDeferredTurnMaintenanceAbortSignal();
	const maintenance = createSessionMaintenanceOwner({
		sessionKey,
		abortSignal: schedulerAbort.abortSignal
	});
	const completion = createDeferredCore();
	const state = {
		maintenance,
		promise: maintenance.track(completion.promise),
		activeEngine: params.contextEngine,
		engines: [params],
		disposedEngines: [],
		disposals: /* @__PURE__ */ new Set(),
		closing: false
	};
	activeDeferredTurnMaintenanceRuns.set(sessionKey, state);
	const run = async () => {
		try {
			const lane = `${TURN_MAINTENANCE_LANE_PREFIX}${sessionKey}`;
			await enqueueCommandInLane(lane, () => params.runInContext(() => maintenance.run(async () => {
				let current = params;
				while (current && !maintenance.signal.aborted) {
					const request = current;
					state.activeEngine = request.contextEngine;
					await request.runInContext(() => maintenance.run(() => runContextEngineMaintenanceWork(async () => {
						const workerParams = {
							...request,
							abortSignal: maintenance.signal,
							assertActive: () => {
								maintenance.assertCurrent();
								request.assertActive?.();
							},
							sessionKey
						};
						try {
							await executeContextEngineMaintenance({
								...workerParams,
								executionMode: "background"
							});
						} catch (error) {
							if (!isContextEngineAbortRejection(error, workerParams.abortSignal)) {
								workerParams.onDeferredMaintenanceFailure?.(error);
								log$1.warn("Deferred context engine maintenance failed: " + formatErrorMessage(error));
							}
						}
					}, maintenance.signal)));
					current = state.pendingParams;
					state.pendingParams = void 0;
					state.activeEngine = current?.contextEngine ?? request.contextEngine;
					if (!current || !hasSameContextEngineInstance(request.contextEngine, current.contextEngine)) await disposeRetainedEngine(state, request.contextEngine);
					current = state.pendingParams ?? current;
					state.pendingParams = void 0;
				}
			})));
		} catch (error) {
			params.onDeferredMaintenanceFailure?.(error);
			log$1.warn("Failed to schedule deferred context engine maintenance: " + formatErrorMessage(error));
		}
	};
	(async () => {
		try {
			await params.runInContext(() => runContextEngineMaintenanceWork(run, maintenance.signal));
		} finally {
			try {
				state.closing = true;
				while (state.engines.length > 0) {
					const engine = state.engines[0];
					await disposeRetainedEngine(state, engine.contextEngine);
				}
				await Promise.all(state.disposals);
			} finally {
				activeDeferredTurnMaintenanceRuns.delete(sessionKey);
				schedulerAbort.dispose();
			}
		}
	})().then(completion.resolve, completion.reject);
	return state.promise;
}
async function disposeRetainedEngine(state, contextEngine) {
	const index = state.engines.findIndex((entry) => hasSameContextEngineInstance(entry.contextEngine, contextEngine));
	if (index < 0) return;
	const [entry] = state.engines.splice(index, 1);
	if (entry?.disposeContextEngineAfterMaintenance) {
		state.disposedEngines = state.disposedEngines.filter((ref) => ref.deref() !== void 0);
		state.disposedEngines.push(new WeakRef(entry.contextEngine));
		await disposeDeferredMaintenanceContextEngine(entry, state.maintenance);
	}
}
function retainEngine(state, params) {
	const existing = state.engines.find((entry) => hasSameContextEngineInstance(entry.contextEngine, params.contextEngine));
	if (!existing) {
		state.engines.push(params);
		return;
	}
	existing.disposeContextEngineAfterMaintenance ||= params.disposeContextEngineAfterMaintenance;
	for (const resources of params.factoryResourceOwners) existing.factoryResourceOwners.add(resources);
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
			log$1.warn(`failed to schedule deferred context engine maintenance: ${String(err)}`);
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
		log$1.warn(`context engine maintain failed (${params.reason}): ${String(err)}`);
		return;
	}
}
//#endregion
export { normalizeContextTokenBudget as C, mapThinkingLevelForProvider as S, resolveModelCallUrgency as _, mergeOrphanedTrailingUserPrompt as a, wrapPluginSystemContextSection as b, resolvePromptModeForSession as c, buildEmbeddedCompactionRuntimeContext as d, resolveCompactionContextTokenBudget as f, resolveEmbeddedCompactionThinkingLevel as g, resolveEmbeddedCompactionTarget as h, buildAfterTurnRuntimeContextFromUsage as i, shouldWarnOnOrphanedUserRepair as l, resolveCompactionTargetRuntime as m, waitForDeferredTurnMaintenanceForSession as n, resolveAttemptFsWorkspaceOnly as o, resolveCompactionHarnessRuntime as p, buildAfterTurnRuntimeContext as r, resolvePromptBuildHookResult as s, runContextEngineMaintenance as t, resolveContextEngineCapabilities as u, forgetPromptBuildDrainCacheForRun as v, mapThinkingLevel as x, resolvePluginTurnContext as y };
