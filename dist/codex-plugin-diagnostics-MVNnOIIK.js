import { a as normalizeLowercaseStringOrEmpty } from "./string-coerce-DW4mBlAt.js";
import { i as normalizeProviderId } from "./provider-id-Dq06Bcx6.js";
import { a as normalizeOptionalAgentRuntimeId } from "./agent-runtime-id-DiL2DId7.js";
import { t as resolveModelRuntimePolicy } from "./model-runtime-policy-BS47zw0g.js";
import { o as openAIProviderUsesCodexRuntimeByDefault } from "./openai-routing-DXJmS9CT.js";
//#region src/config/codex-plugin-diagnostics.ts
const CODEX_PLUGIN_ID = "codex";
const OPENAI_PROVIDER_ID = "openai";
function normalizeRuntimeId(raw) {
	return normalizeOptionalAgentRuntimeId(raw);
}
function isCodexRuntimeSelection(raw) {
	return normalizeRuntimeId(raw) === CODEX_PLUGIN_ID;
}
function isOpenAiCodexDefaultRuntimeSelection(params) {
	const runtime = normalizeRuntimeId(params.raw);
	if (runtime === CODEX_PLUGIN_ID) return true;
	if (runtime !== "auto" && runtime !== "default") return false;
	return openAIProviderUsesCodexRuntimeByDefault({
		provider: OPENAI_PROVIDER_ID,
		config: params.cfg
	});
}
function parseProviderModelRef(raw) {
	const slashIndex = raw.indexOf("/");
	if (slashIndex <= 0 || slashIndex >= raw.length - 1) return null;
	const provider = normalizeProviderId(raw.slice(0, slashIndex));
	const model = raw.slice(slashIndex + 1).trim();
	return provider && model ? {
		provider,
		model
	} : null;
}
function codexPluginEntryEnabled(cfg) {
	for (const [pluginId, entry] of Object.entries(cfg.plugins?.entries ?? {})) if (normalizeLowercaseStringOrEmpty(pluginId) === CODEX_PLUGIN_ID) return entry?.enabled;
}
function openAiProviderRuntimePolicy(cfg) {
	for (const [providerId, providerConfig] of Object.entries(cfg.models?.providers ?? {})) if (normalizeProviderId(providerId) === OPENAI_PROVIDER_ID) return providerConfig?.agentRuntime?.id?.trim() ? providerConfig.agentRuntime : void 0;
}
function listConfiguredAgentIds(cfg) {
	const ids = [void 0];
	for (const agent of cfg.agents?.list ?? []) if (typeof agent.id === "string" && agent.id.trim()) ids.push(agent.id);
	return ids;
}
function openAiProviderModelCanResolveToCodexDefault(params) {
	return listConfiguredAgentIds(params.cfg).some((agentId) => isOpenAiCodexDefaultRuntimeSelection({
		cfg: params.cfg,
		raw: resolveModelRuntimePolicy({
			config: params.cfg,
			provider: OPENAI_PROVIDER_ID,
			modelId: params.modelId,
			agentId
		}).policy?.id
	}));
}
function openAiHasCodexDefaultRuntimePolicy(cfg) {
	for (const [providerId, providerConfig] of Object.entries(cfg.models?.providers ?? {})) {
		if (normalizeProviderId(providerId) !== OPENAI_PROVIDER_ID) continue;
		if (isCodexRuntimeSelection(providerConfig?.agentRuntime?.id)) return true;
		if (providerConfig?.models?.some((model) => model.agentRuntime?.id?.trim() && openAiProviderModelCanResolveToCodexDefault({
			cfg,
			modelId: model.id
		}))) return true;
	}
	if (agentModelsHaveCodexDefaultRuntimePolicy(cfg, cfg.agents?.defaults?.models)) return true;
	return cfg.agents?.list?.some((agent) => agentModelsHaveCodexDefaultRuntimePolicy(cfg, agent.models)) ?? false;
}
function agentModelsHaveCodexDefaultRuntimePolicy(cfg, models) {
	for (const [modelRef, modelConfig] of Object.entries(models ?? {})) if (parseProviderModelRef(modelRef)?.provider === OPENAI_PROVIDER_ID && isOpenAiCodexDefaultRuntimeSelection({
		cfg,
		raw: modelConfig?.agentRuntime?.id
	})) return true;
	return false;
}
function openAiWildcardRuntimePolicy(models) {
	for (const [modelRef, modelConfig] of Object.entries(models ?? {})) {
		const parsed = parseProviderModelRef(modelRef);
		if (parsed?.provider === OPENAI_PROVIDER_ID && parsed.model === "*" && modelConfig?.agentRuntime?.id?.trim()) return modelConfig.agentRuntime;
	}
}
function openAiDefaultRouteRuntimePolicy(cfg) {
	return openAiWildcardRuntimePolicy(cfg.agents?.defaults?.models) ?? openAiProviderRuntimePolicy(cfg);
}
function openAiDefaultRouteKeepsCodexUnavailable(cfg) {
	const policy = openAiDefaultRouteRuntimePolicy(cfg);
	if (!policy?.id?.trim()) return !openAIProviderUsesCodexRuntimeByDefault({
		provider: OPENAI_PROVIDER_ID,
		config: cfg
	});
	return !isOpenAiCodexDefaultRuntimeSelection({
		cfg,
		raw: policy.id
	});
}
/**
* Reports whether the default OpenAI route intentionally avoids the Codex plugin.
*
* Route-specific Codex selections still win; this only answers the missing-plugin
* diagnostic question for OpenAI defaults and OpenAI-compatible proxy configs.
*/
function configExplicitlyKeepsCodexUnavailableForOpenAi(cfg) {
	if (openAiHasCodexDefaultRuntimePolicy(cfg)) return false;
	return openAiDefaultRouteKeepsCodexUnavailable(cfg);
}
/**
* Suppresses missing Codex plugin diagnostics when config makes Codex optional.
*
* Explicitly enabled entries still warn so operator intent is honored even when
* all default routes would otherwise stay on the OpenClaw runtime.
*/
function shouldSuppressMissingCodexPluginDiagnostics(cfg) {
	const entryEnabled = codexPluginEntryEnabled(cfg);
	if (entryEnabled === true) return false;
	return entryEnabled === false || configExplicitlyKeepsCodexUnavailableForOpenAi(cfg);
}
//#endregion
export { shouldSuppressMissingCodexPluginDiagnostics as t };
