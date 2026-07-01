import { c as isRecord } from "./utils-BApvfmPs.js";
import { i as normalizeProviderId } from "./provider-id-Dq06Bcx6.js";
import { a as normalizeOptionalAgentRuntimeId, r as isDefaultAgentRuntimeId, t as AUTO_AGENT_RUNTIME_ID } from "./agent-runtime-id-DiL2DId7.js";
import { t as resolveModelRuntimePolicy } from "./model-runtime-policy-BS47zw0g.js";
import { o as openAIProviderUsesCodexRuntimeByDefault } from "./openai-routing-DXJmS9CT.js";
//#region src/agents/harness/policy.ts
/** Resolves model/provider/runtime config into the canonical harness runtime id. */
function resolveAgentHarnessPolicy(params) {
	const configured = resolveModelRuntimePolicy({
		config: params.config,
		provider: params.provider,
		modelId: params.modelId,
		agentId: params.agentId,
		sessionKey: params.sessionKey
	});
	const configuredRuntime = normalizeOptionalAgentRuntimeId(configured.policy?.id);
	const runtimeSource = configured.source ?? "implicit";
	const runtime = configuredRuntime && configuredRuntime !== "default" ? configuredRuntime : AUTO_AGENT_RUNTIME_ID;
	if (openAIProviderUsesCodexRuntimeByDefault({
		provider: params.provider,
		config: params.config
	})) {
		if (runtime === "auto") return {
			runtime: "codex",
			runtimeSource
		};
		return {
			runtime,
			runtimeSource
		};
	}
	return {
		runtime,
		runtimeSource
	};
}
//#endregion
//#region src/agents/harness-runtimes.ts
/**
* Collects configured native harness runtime ids from model provider config.
*/
function normalizeConfiguredRuntimeId(value) {
	return normalizeOptionalAgentRuntimeId(value);
}
function isSelectablePluginRuntime(runtime) {
	return Boolean(runtime) && !isDefaultAgentRuntimeId(runtime) && normalizeOptionalAgentRuntimeId(runtime) !== "openclaw";
}
function listAgentModelRefs(value) {
	if (typeof value === "string") return [value];
	if (!isRecord(value)) return [];
	const refs = [];
	if (typeof value.primary === "string") refs.push(value.primary);
	if (Array.isArray(value.fallbacks)) {
		for (const fallback of value.fallbacks) if (typeof fallback === "string") refs.push(fallback);
	}
	return refs;
}
function pushAgentModelRefs(refs, value) {
	for (const ref of listAgentModelRefs(value)) refs.push(ref);
}
function parseConfiguredModelRef(value) {
	if (typeof value !== "string") return;
	const trimmed = value.trim();
	const slash = trimmed.indexOf("/");
	if (slash <= 0 || slash >= trimmed.length - 1) return;
	return {
		provider: normalizeProviderId(trimmed.slice(0, slash)),
		modelId: trimmed.slice(slash + 1).trim()
	};
}
function resolveConfiguredModelHarnessRuntime(params) {
	const parsed = parseConfiguredModelRef(params.modelRef);
	if (!parsed) return;
	const policy = resolveAgentHarnessPolicy({
		config: params.config,
		provider: parsed.provider,
		modelId: parsed.modelId,
		agentId: params.agentId
	});
	if (!params.includeImplicitRuntimePreferences && policy.runtimeSource === "implicit") return;
	const runtime = normalizeConfiguredRuntimeId(policy.runtime);
	return isSelectablePluginRuntime(runtime) ? runtime : void 0;
}
function pushConfiguredModelRuntimeIds(config, runtimes) {
	for (const providerConfig of Object.values(config.models?.providers ?? {})) {
		const providerRuntime = normalizeConfiguredRuntimeId(providerConfig?.agentRuntime?.id);
		if (isSelectablePluginRuntime(providerRuntime)) runtimes.add(providerRuntime);
		for (const modelConfig of providerConfig?.models ?? []) {
			const modelRuntime = normalizeConfiguredRuntimeId(modelConfig?.agentRuntime?.id);
			if (isSelectablePluginRuntime(modelRuntime)) runtimes.add(modelRuntime);
		}
	}
	const pushModelMapRuntimeIds = (models) => {
		if (!isRecord(models)) return;
		for (const entry of Object.values(models)) {
			if (!isRecord(entry)) continue;
			const runtime = normalizeConfiguredRuntimeId(isRecord(entry.agentRuntime) ? entry.agentRuntime.id : void 0);
			if (isSelectablePluginRuntime(runtime)) runtimes.add(runtime);
		}
	};
	pushModelMapRuntimeIds(config.agents?.defaults?.models);
	const agents = Array.isArray(config.agents?.list) ? config.agents.list : [];
	for (const agent of agents) pushModelMapRuntimeIds(isRecord(agent) ? agent.models : void 0);
}
function pushConfiguredAgentModelRuntimeIds(config, runtimes, includeImplicitRuntimePreferences) {
	const pushModelRefs = (modelRefs, agentId) => {
		for (const modelRef of modelRefs) {
			const runtime = resolveConfiguredModelHarnessRuntime({
				config,
				includeImplicitRuntimePreferences,
				modelRef,
				agentId
			});
			if (runtime) runtimes.add(runtime);
		}
	};
	const pushModelMapRefs = (models, agentId) => {
		if (!isRecord(models)) return;
		pushModelRefs(Object.keys(models), agentId);
	};
	const defaultsModel = config.agents?.defaults?.model;
	const defaultsModelRefs = [];
	pushAgentModelRefs(defaultsModelRefs, defaultsModel);
	pushModelRefs(defaultsModelRefs);
	pushModelMapRefs(config.agents?.defaults?.models);
	if (!Array.isArray(config.agents?.list)) return;
	for (const agent of config.agents.list) {
		if (!isRecord(agent)) continue;
		const agentId = typeof agent.id === "string" ? agent.id : void 0;
		const selectedModelRefs = [];
		pushAgentModelRefs(selectedModelRefs, agent.model ?? defaultsModel);
		pushModelRefs(selectedModelRefs, agentId);
		pushModelMapRefs(agent.models, agentId);
	}
}
/** Lists configured plugin harness runtime ids referenced by agent/model config. */
function collectConfiguredAgentHarnessRuntimes(config, options = {}) {
	const runtimes = /* @__PURE__ */ new Set();
	const includeImplicitRuntimePreferences = options.includeImplicitRuntimePreferences ?? true;
	pushConfiguredModelRuntimeIds(config, runtimes);
	pushConfiguredAgentModelRuntimeIds(config, runtimes, includeImplicitRuntimePreferences);
	return [...runtimes].toSorted((left, right) => left.localeCompare(right));
}
//#endregion
export { resolveAgentHarnessPolicy as n, collectConfiguredAgentHarnessRuntimes as t };
