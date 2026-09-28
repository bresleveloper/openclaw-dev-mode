import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { n as DEFAULT_MODEL, r as DEFAULT_PROVIDER } from "./defaults-BbU4k6fu.mjs";
import { c as inferUniqueProviderFromConfiguredModels, h as resolveConfiguredModelRef } from "./model-selection-shared-0uvJbX1M.mjs";
import { k as resolveSessionModelOverrideRouteResolution } from "./agent-scope-CTuYDtny.mjs";
import { n as parseModelRef } from "./model-selection-normalize-Dij_chYC.mjs";
import { t as resolveDefaultModelForAgent } from "./model-selection-config-DZ4sk4C2.mjs";
import { i as resolvePersistedSelectedModelRef, l as normalizeStoredOverrideModel } from "./model-selection-CFnUi6iD.mjs";
//#region src/agents/session-model-ref.ts
/** Keep prepared host metadata outside the published session-model resolver contract. */
function resolveSessionModelRef(cfg, entry, agentId, options) {
	return resolveSessionModelRefCore(cfg, entry, agentId, { allowPluginNormalization: options?.allowPluginNormalization });
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
	const runtimeProvider = normalizeOptionalString(entry?.modelProvider);
	const runtimeModel = normalizeOptionalString(entry?.model);
	const resolved = agentId ? resolveDefaultModelForAgent({
		cfg,
		agentId,
		allowPluginNormalization: options?.allowPluginNormalization,
		manifestPlugins: options?.manifestPlugins
	}) : resolveConfiguredModelRef({
		cfg,
		defaultProvider: DEFAULT_PROVIDER,
		defaultModel: DEFAULT_MODEL,
		allowPluginNormalization: options?.allowPluginNormalization,
		manifestPlugins: options?.manifestPlugins
	});
	return resolvePersistedSelectedModelRef({
		defaultProvider: resolved.provider || "openai",
		runtimeProvider: agentId ? void 0 : runtimeProvider,
		runtimeModel: agentId ? void 0 : runtimeModel,
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
	if (runtimeModel) {
		if (runtimeProvider) return {
			provider: runtimeProvider,
			model: runtimeModel
		};
		const inferredProvider = inferUniqueProviderFromConfiguredModels({
			cfg,
			model: runtimeModel,
			agentId,
			manifestPlugins: options?.manifestPlugins
		});
		if (inferredProvider) return {
			provider: inferredProvider,
			model: runtimeModel
		};
		if (runtimeModel.includes("/")) {
			const parsedRuntime = parseModelRef(runtimeModel, DEFAULT_PROVIDER, {
				allowPluginNormalization: options?.allowPluginNormalization,
				manifestPlugins: options?.manifestPlugins
			});
			if (parsedRuntime) return {
				provider: parsedRuntime.provider,
				model: parsedRuntime.model
			};
			return { model: runtimeModel };
		}
		return { model: runtimeModel };
	}
	const fallbackRef = fallbackModelRef?.trim();
	if (fallbackRef) {
		const parsedFallback = parseModelRef(fallbackRef, DEFAULT_PROVIDER, {
			allowPluginNormalization: options?.allowPluginNormalization,
			manifestPlugins: options?.manifestPlugins
		});
		if (parsedFallback) return {
			provider: parsedFallback.provider,
			model: parsedFallback.model
		};
		const inferredProvider = inferUniqueProviderFromConfiguredModels({
			cfg,
			model: fallbackRef,
			agentId,
			manifestPlugins: options?.manifestPlugins
		});
		if (inferredProvider) return {
			provider: inferredProvider,
			model: fallbackRef
		};
		return { model: fallbackRef };
	}
	const resolved = resolveSessionModelRefCore(cfg, entry, agentId, {
		allowPluginNormalization: options?.allowPluginNormalization,
		manifestPlugins: options?.manifestPlugins
	});
	return {
		provider: resolved.provider,
		model: resolved.model
	};
}
//#endregion
export { resolveSessionModelRef as n, resolveSessionModelRefCore as r, resolveSessionModelIdentityRef as t };
