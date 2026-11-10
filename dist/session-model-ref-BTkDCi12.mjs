import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import "./session-key-CSDERtm3.mjs";
import { i as DEFAULT_PROVIDER } from "./defaults-Bg930vxE.mjs";
import { a as resolveSessionModelOverrideRouteResolution } from "./model-override-provenance-ByJqxWxk.mjs";
import { c as inferUniqueProviderFromConfiguredModels } from "./model-selection-shared-CVU_V2PQ.mjs";
import { n as parseModelRef } from "./model-selection-normalize-DulZGI4S.mjs";
import { t as resolveDefaultModelForAgent } from "./model-selection-config-CrboVKXT.mjs";
import { o as normalizeStoredOverrideModel, r as resolvePersistedSelectedModelRef } from "./model-selection-DdQ-ffuG.mjs";
//#region src/agents/session-model-ref.ts
/** Keep prepared host metadata outside the published session-model resolver contract. */
function resolveSessionModelRef(cfg, entry, agentId, options) {
	return resolveSessionModelRefCore(cfg, entry, agentId, { allowPluginNormalization: options?.allowPluginNormalization });
}
function resolveSessionConfiguredDefault(cfg, agentId, options) {
	const defaults = options?.configuredDefaultModelByAgent;
	const defaultKey = defaults && `${agentId ? normalizeAgentId(agentId) : ""}\0${options?.allowPluginNormalization !== false}`;
	let resolved = defaultKey ? defaults?.get(defaultKey) : void 0;
	if (!resolved) {
		resolved = resolveDefaultModelForAgent({
			cfg,
			agentId,
			allowPluginNormalization: options?.allowPluginNormalization,
			manifestPlugins: options?.manifestPlugins
		});
		if (defaultKey) defaults?.set(defaultKey, resolved);
	}
	return resolved;
}
function resolveSessionModelRefCore(cfg, entry, agentId, options) {
	const overrideRouteResolution = resolveSessionModelOverrideRouteResolution(entry);
	const normalizedOverride = normalizeStoredOverrideModel({
		providerOverride: entry?.providerOverride,
		modelOverride: entry?.modelOverride,
		routeResolution: overrideRouteResolution
	});
	if (normalizedOverride.providerOverride && normalizedOverride.modelOverride) return resolvePersistedSelectedModelRef({
		defaultProvider: normalizedOverride.providerOverride,
		overrideProvider: normalizedOverride.providerOverride,
		overrideModel: normalizedOverride.modelOverride,
		overrideRouteResolution,
		allowPluginNormalization: options?.allowPluginNormalization,
		manifestPlugins: options?.manifestPlugins
	});
	const resolved = resolveSessionConfiguredDefault(cfg, agentId, options);
	return resolvePersistedSelectedModelRef({
		defaultProvider: resolved.provider || "openai",
		runtimeProvider: agentId ? void 0 : entry?.modelProvider,
		runtimeModel: agentId ? void 0 : entry?.model,
		overrideProvider: normalizedOverride.providerOverride,
		overrideModel: normalizedOverride.modelOverride,
		overrideRouteResolution,
		allowPluginNormalization: options?.allowPluginNormalization,
		manifestPlugins: options?.manifestPlugins
	}) ?? resolved;
}
function resolveSessionModelIdentityRef(cfg, entry, agentId, fallbackModelRef, options) {
	const runtimeModel = entry?.model?.trim();
	const runtimeProvider = entry?.modelProvider?.trim();
	if (runtimeModel && runtimeProvider) return {
		provider: runtimeProvider,
		model: runtimeModel
	};
	const model = runtimeModel || fallbackModelRef?.trim();
	if (model) {
		const inferConfigured = () => {
			const provider = inferUniqueProviderFromConfiguredModels({
				cfg,
				model,
				agentId,
				manifestPlugins: options?.manifestPlugins
			});
			return provider ? {
				provider,
				model
			} : void 0;
		};
		const parseSelected = () => {
			const parsed = parseModelRef(model, DEFAULT_PROVIDER, {
				allowPluginNormalization: options?.allowPluginNormalization,
				manifestPlugins: options?.manifestPlugins
			});
			return parsed ? {
				provider: parsed.provider,
				model: parsed.model
			} : void 0;
		};
		return (runtimeModel ? inferConfigured() ?? (model.includes("/") ? parseSelected() : void 0) : parseSelected() ?? inferConfigured()) ?? { model };
	}
	const resolved = resolveSessionModelRefCore(cfg, entry, agentId, options);
	return {
		provider: resolved.provider,
		model: resolved.model
	};
}
//#endregion
export { resolveSessionModelIdentityRef as n, resolveSessionModelRef as r, resolveSessionConfiguredDefault as t };
