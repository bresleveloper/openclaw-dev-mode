import { a as normalizeOptionalAgentRuntimeId } from "./agent-runtime-id-DiL2DId7.js";
import { o as openAIProviderUsesCodexRuntimeByDefault, u as resolveSelectedOpenAIRuntimeProvider } from "./openai-routing-DXJmS9CT.js";
import "./defaults-mDjiWzE5.js";
import { b as resolveModelRefFromString, i as buildModelAliasIndex, u as inferUniqueProviderFromConfiguredModels } from "./model-selection-shared-CKMggJal.js";
import { o as deriveSessionName } from "./bash-tools.shared-BjhIYZci.js";
import { l as listRunningSessions } from "./bash-process-registry-DRLW8NyW.js";
//#region src/agents/bash-process-references.ts
/**
* Compact references for active background bash sessions.
* These references are surfaced in agent context so follow-up turns can
* reconnect to prior long-running work.
*/
const DEFAULT_ACTIVE_PROCESS_LIMIT = 8;
const MAX_COMMAND_LABEL_CHARS = 140;
function truncate(value, maxChars) {
	if (value.length <= maxChars) return value;
	if (maxChars <= 1) return value.slice(0, maxChars);
	return `${value.slice(0, Math.max(0, maxChars - 3))}...`;
}
/** List active background process sessions for one scope key, newest first. */
function listActiveProcessSessionReferences(params) {
	const scopeKey = params.scopeKey?.trim();
	if (!scopeKey) return [];
	const now = params.now ?? Date.now();
	const limit = typeof params.limit === "number" && Number.isFinite(params.limit) && params.limit > 0 ? Math.floor(params.limit) : DEFAULT_ACTIVE_PROCESS_LIMIT;
	return listRunningSessions().filter((session) => session.backgrounded).filter((session) => session.scopeKey === scopeKey).toSorted((left, right) => right.startedAt - left.startedAt).slice(0, limit).map((session) => ({
		sessionId: session.id,
		status: "running",
		pid: session.pid ?? session.child?.pid,
		startedAt: session.startedAt,
		runtimeMs: Math.max(0, now - session.startedAt),
		cwd: session.cwd,
		command: session.command,
		name: truncate(deriveSessionName(session.command) || session.command, MAX_COMMAND_LABEL_CHARS),
		tail: session.tail,
		truncated: session.truncated
	}));
}
//#endregion
//#region src/agents/embedded-agent-runner/compaction-runtime-context.ts
/**
* Resolve the effective compaction target from config, falling back to the
* caller-supplied provider/model and optionally applying runtime defaults.
*/
function resolveEmbeddedCompactionTarget(params) {
	const provider = params.provider?.trim() || params.defaultProvider;
	const model = params.modelId?.trim() || params.defaultModel;
	const override = params.config?.agents?.defaults?.compaction?.model?.trim();
	const resolveTargetProviders = (targetProvider, authProfileId) => {
		if (!targetProvider) return {};
		const useCodexHarnessRuntime = shouldUseCodexRuntimeProviderForCompaction({
			config: params.config,
			provider: targetProvider,
			harnessRuntime: params.harnessRuntime
		});
		const runtimeProvider = resolveSelectedOpenAIRuntimeProvider({
			provider: targetProvider,
			harnessRuntime: (useCodexHarnessRuntime ? params.harnessRuntime : "openclaw") ?? void 0,
			authProfileId,
			config: params.config
		});
		const routedRuntimeProvider = runtimeProvider === targetProvider ? void 0 : runtimeProvider;
		return {
			runtimeProvider: routedRuntimeProvider,
			contextProvider: useCodexHarnessRuntime ? routedRuntimeProvider : void 0,
			...useCodexHarnessRuntime ? { nativeHarnessCompaction: true } : {}
		};
	};
	if (!override) {
		const authProfileId = params.authProfileId ?? void 0;
		return {
			provider,
			...resolveTargetProviders(provider, authProfileId),
			model,
			authProfileId
		};
	}
	const slashIdx = override.indexOf("/");
	if (slashIdx > 0) {
		const overrideProvider = override.slice(0, slashIdx).trim();
		const overrideModel = override.slice(slashIdx + 1).trim() || params.defaultModel;
		const authProfileId = overrideProvider !== provider ? void 0 : params.authProfileId ?? void 0;
		return {
			provider: overrideProvider,
			...resolveTargetProviders(overrideProvider, authProfileId),
			model: overrideModel,
			authProfileId
		};
	}
	const config = params.config ?? {};
	const currentProvider = provider?.trim();
	if (currentProvider && hasBareConfiguredModelForProvider({
		cfg: config,
		provider: currentProvider,
		model: override
	})) {
		const authProfileId = params.authProfileId ?? void 0;
		return {
			provider: currentProvider,
			...resolveTargetProviders(currentProvider, authProfileId),
			model: override,
			authProfileId
		};
	}
	const inferredLiteralProvider = inferUniqueProviderFromConfiguredModels({
		cfg: config,
		model: override
	});
	if (inferredLiteralProvider) {
		const authProfileId = inferredLiteralProvider !== provider ? void 0 : params.authProfileId ?? void 0;
		return {
			provider: inferredLiteralProvider,
			...resolveTargetProviders(inferredLiteralProvider, authProfileId),
			model: override,
			authProfileId
		};
	}
	const defaultProvider = provider || "openai";
	const aliasResolution = resolveModelRefFromString({
		cfg: config,
		raw: override,
		defaultProvider,
		aliasIndex: buildModelAliasIndex({
			cfg: config,
			defaultProvider
		})
	});
	if (aliasResolution?.alias) {
		const resolvedProvider = aliasResolution.ref.provider;
		const authProfileId = resolvedProvider !== provider ? void 0 : params.authProfileId ?? void 0;
		return {
			provider: resolvedProvider,
			...resolveTargetProviders(resolvedProvider, authProfileId),
			model: aliasResolution.ref.model,
			authProfileId
		};
	}
	const authProfileId = params.authProfileId ?? void 0;
	return {
		provider,
		...resolveTargetProviders(provider, authProfileId),
		model: override,
		authProfileId
	};
}
function normalizeCompactionConfigKey(value) {
	return value.trim().toLowerCase();
}
function hasBareConfiguredModelForProvider(params) {
	const providerKey = normalizeCompactionConfigKey(params.provider);
	const modelKey = normalizeCompactionConfigKey(params.model);
	if (!providerKey || !modelKey || params.model.includes("/")) return false;
	for (const rawRef of Object.keys(params.cfg.agents?.defaults?.models ?? {})) {
		const slashIdx = rawRef.indexOf("/");
		if (slashIdx <= 0 || rawRef.endsWith("/*")) continue;
		const rawProvider = rawRef.slice(0, slashIdx);
		const rawModel = rawRef.slice(slashIdx + 1);
		if (normalizeCompactionConfigKey(rawProvider) === providerKey && normalizeCompactionConfigKey(rawModel) === modelKey) return true;
	}
	return ((Object.entries(params.cfg.models?.providers ?? {}).find(([key]) => {
		return normalizeCompactionConfigKey(key) === providerKey;
	})?.[1])?.models ?? []).some((entry) => {
		return normalizeCompactionConfigKey(entry?.id ?? "") === modelKey;
	});
}
function shouldUseCodexRuntimeProviderForCompaction(params) {
	if (normalizeOptionalAgentRuntimeId(params.harnessRuntime) !== "codex") return false;
	if (!openAIProviderUsesCodexRuntimeByDefault(params)) return false;
	return true;
}
function buildEmbeddedCompactionRuntimeContext(params) {
	const resolved = resolveEmbeddedCompactionTarget({
		config: params.config,
		provider: params.provider,
		modelId: params.modelId,
		authProfileId: params.authProfileId,
		harnessRuntime: params.harnessRuntime
	});
	const agentHarnessId = params.harnessRuntime?.trim() || void 0;
	const processScopeKey = params.sessionKey?.trim();
	const activeProcessSessions = params.activeProcessSessions ?? listActiveProcessSessionReferences({ scopeKey: processScopeKey });
	return {
		sessionKey: params.sessionKey ?? void 0,
		messageChannel: params.messageChannel ?? void 0,
		messageProvider: params.messageProvider ?? void 0,
		chatType: params.chatType ?? void 0,
		agentAccountId: params.agentAccountId ?? void 0,
		currentChannelId: params.currentChannelId ?? void 0,
		currentThreadTs: params.currentThreadTs ?? void 0,
		currentMessageId: params.currentMessageId ?? void 0,
		authProfileId: resolved.authProfileId,
		agentHarnessId,
		workspaceDir: params.workspaceDir,
		cwd: params.cwd ?? void 0,
		agentDir: params.agentDir,
		config: params.config,
		skillsSnapshot: params.skillsSnapshot,
		senderIsOwner: params.senderIsOwner,
		senderId: params.senderId ?? void 0,
		provider: resolved.provider,
		runtimeProvider: resolved.runtimeProvider,
		model: resolved.model,
		modelFallbacksOverride: params.modelFallbacksOverride,
		thinkLevel: params.thinkLevel,
		reasoningLevel: params.reasoningLevel,
		bashElevated: params.bashElevated,
		extraSystemPrompt: params.extraSystemPrompt,
		sourceReplyDeliveryMode: params.sourceReplyDeliveryMode,
		ownerNumbers: params.ownerNumbers,
		...activeProcessSessions.length > 0 ? { activeProcessSessions } : {}
	};
}
//#endregion
export { resolveEmbeddedCompactionTarget as n, listActiveProcessSessionReferences as r, buildEmbeddedCompactionRuntimeContext as t };
