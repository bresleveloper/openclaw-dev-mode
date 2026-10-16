import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { n as DEFAULT_MODEL, r as DEFAULT_PROVIDER } from "./defaults-Jag53zwP.mjs";
import { O as resolveSessionModelOverrideRouteResolution } from "./agent-scope-CG17uXFn.mjs";
import { c as inferUniqueProviderFromConfiguredModels, h as resolveConfiguredModelRef } from "./model-selection-shared-BZeDVoch.mjs";
import { n as parseModelRef } from "./model-selection-normalize-AjjSfI-g.mjs";
import { t as resolveDefaultModelForAgent } from "./model-selection-config-DYd_ufXT.mjs";
import { o as normalizeStoredOverrideModel, r as resolvePersistedSelectedModelRef } from "./model-selection-C1qxt1eY.mjs";
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
