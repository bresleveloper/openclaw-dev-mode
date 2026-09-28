import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
import { r as normalizeProviderId } from "./provider-id-DCtsDflE.mjs";
import { r as normalizeConfiguredProviderCatalogModelId, s as stripSelfProviderModelPrefix } from "./provider-model-id-normalization-CO2R6uEC.mjs";
import { a as resolveMergedModelProviderConfig, t as createConfiguredProviderModelResolver } from "./model-provider-config-BbSyhfVf.mjs";
import { r as resolveModelExtraParamSources } from "./model-extra-params-BJQs6MZV.mjs";
import { h as supportsClaude1MContext, m as resolveClaudeSonnet5ModelIdentity, p as resolveClaudeOpus5ModelIdentity } from "./anthropic-Cy4mTngV.mjs";
import "./src-BpANEEBH.mjs";
//#region src/agents/context-cache.ts
const CONTEXT_WINDOW_CACHE_STATE_KEY = Symbol.for("openclaw.contextWindowCacheState");
const contextWindowCacheGlobal = globalThis;
const REUSED_CONTEXT_WINDOW_CACHE_STATE = contextWindowCacheGlobal[CONTEXT_WINDOW_CACHE_STATE_KEY] !== void 0;
const CONTEXT_WINDOW_CACHE_STATE = contextWindowCacheGlobal[CONTEXT_WINDOW_CACHE_STATE_KEY] ??= {
	configuredTokenCache: /* @__PURE__ */ new Map(),
	discoveredTokenCache: /* @__PURE__ */ new Map(),
	contextWindowCache: /* @__PURE__ */ new Map()
};
/** Returns the current process-global cache generation. */
function getContextWindowCaches() {
	return CONTEXT_WINDOW_CACHE_STATE;
}
/** Publish one complete context generation without copying it on the gateway thread. */
function replaceContextWindowCaches(params) {
	CONTEXT_WINDOW_CACHE_STATE.configuredTokenCache = params.configuredTokenCache;
	CONTEXT_WINDOW_CACHE_STATE.discoveredTokenCache = params.discoveredTokenCache;
	CONTEXT_WINDOW_CACHE_STATE.contextWindowCache = params.contextWindowCache;
}
/** Publish one complete discovered-metadata generation. */
function replaceDiscoveredContextTokenCache(cache) {
	CONTEXT_WINDOW_CACHE_STATE.discoveredTokenCache = cache;
}
/** Clear the current process-global cache generation. */
function clearContextWindowCaches() {
	CONTEXT_WINDOW_CACHE_STATE.configuredTokenCache.clear();
	CONTEXT_WINDOW_CACHE_STATE.discoveredTokenCache.clear();
	CONTEXT_WINDOW_CACHE_STATE.contextWindowCache.clear();
}
const PROVIDER_CONTEXT_TOKEN_CACHE_PREFIX = "\0provider:";
/** Internal cache key for discovery metadata with verified provider ownership. */
function providerContextTokenCacheKey(provider, modelId) {
	return `${PROVIDER_CONTEXT_TOKEN_CACHE_PREFIX}${provider}\0${modelId}`;
}
/** Looks up cached context-token count for a model id. */
function lookupCachedContextTokens(modelId) {
	if (!modelId) return;
	return CONTEXT_WINDOW_CACHE_STATE.configuredTokenCache.get(modelId) ?? CONTEXT_WINDOW_CACHE_STATE.discoveredTokenCache.get(modelId);
}
/** Looks up a configured native context window without treating it as an effective runtime cap. */
function lookupCachedContextWindow(modelId) {
	if (!modelId) return;
	return CONTEXT_WINDOW_CACHE_STATE.contextWindowCache.get(modelId);
}
/** Returns the lowest positive context limit from independently sourced metadata. */
function minPositiveContextTokens(...values) {
	let result;
	for (const value of values) {
		if (typeof value !== "number" || value <= 0) continue;
		result = result === void 0 ? value : Math.min(result, value);
	}
	return result;
}
//#endregion
//#region src/agents/context-resolution.ts
const normalizePositiveContextTokens = (value) => typeof value === "number" && value > 0 ? value : void 0;
const ANTHROPIC_CONTEXT_1M_TOKENS = 1e6;
const ANTHROPIC_VERTEX_CONTEXT_1M_TOKENS = 1e6;
const ANTHROPIC_FABLE_CONTEXT_TOKENS = 1e6;
const ANTHROPIC_MYTHOS_5_CONTEXT_TOKENS = 1e6;
const ANTHROPIC_OPUS_5_CONTEXT_TOKENS = 1e6;
const ANTHROPIC_SONNET_5_CONTEXT_TOKENS = 1e6;
function resolveProviderModelRef(params) {
	const modelRaw = params.model?.trim();
	if (!modelRaw) return;
	const providerRaw = params.provider?.trim();
	if (providerRaw) {
		const provider = normalizeProviderId(providerRaw);
		return provider ? {
			provider,
			model: modelRaw
		} : void 0;
	}
	const slash = modelRaw.indexOf("/");
	if (slash <= 0) return;
	const provider = normalizeProviderId(modelRaw.slice(0, slash));
	const model = modelRaw.slice(slash + 1).trim();
	return provider && model ? {
		provider,
		model
	} : void 0;
}
/** Preserve shipped self-prefixed context refs after exact configured-row selection. */
function resolveConfiguredProviderModel(cfg, provider, model) {
	const providerConfig = resolveMergedModelProviderConfig(cfg ?? void 0, provider);
	const bareModel = stripSelfProviderModelPrefix(provider, model);
	const spellings = bareModel === model ? [model] : [model, bareModel];
	const findModel = createConfiguredProviderModelResolver(providerConfig, provider, (id) => normalizeConfiguredProviderCatalogModelId(provider, id));
	for (const spelling of spellings) {
		const match = findModel(spelling);
		if (match) return match;
	}
}
function resolveConfiguredRuntimeModel(cfg, provider, modelProvider, model) {
	const explicitResult = resolveConfiguredProviderModel(cfg, provider, model);
	if (explicitResult) return explicitResult;
	const canonicalProvider = modelProvider?.trim();
	if (!canonicalProvider || normalizeProviderId(canonicalProvider) === normalizeProviderId(provider)) return;
	return resolveConfiguredProviderModel(cfg, canonicalProvider, model);
}
function readAuthoredModelContextTokens(model) {
	return typeof model?.contextTokens === "number" && model.contextTokens > 0 ? model.contextTokens : void 0;
}
/** Returns only the per-model contextTokens value authored in OpenClaw config. */
function resolveAuthoredModelContextTokens(params) {
	const ref = resolveProviderModelRef(params);
	const explicitProvider = params.provider?.trim();
	if (!ref || !explicitProvider) return;
	return readAuthoredModelContextTokens(resolveConfiguredRuntimeModel(params.cfg, explicitProvider, params.modelProvider, ref.model));
}
function resolveModelFamilyId(modelId) {
	const normalized = normalizeLowercaseStringOrEmpty(modelId);
	return normalized.includes("/") ? normalized.split("/").at(-1) ?? normalized : normalized;
}
function resolveAnthropicFixedContextWindow(provider, model, options) {
	const modelId = resolveModelFamilyId(model);
	if (!(provider === "anthropic" || provider === "anthropic-vertex" || provider === "claude-cli")) return;
	if (/^claude-fable-5(?=$|[^a-z0-9])/.test(modelId)) return ANTHROPIC_FABLE_CONTEXT_TOKENS;
	if ((provider === "anthropic" || provider === "anthropic-vertex") && /^claude-mythos-5(?=$|[^a-z0-9])/.test(modelId)) return ANTHROPIC_MYTHOS_5_CONTEXT_TOKENS;
	if (resolveClaudeOpus5ModelIdentity({ id: modelId })) return ANTHROPIC_OPUS_5_CONTEXT_TOKENS;
	if (resolveClaudeSonnet5ModelIdentity({ id: modelId })) return ANTHROPIC_SONNET_5_CONTEXT_TOKENS;
	if (!supportsClaude1MContext({ id: modelId })) return;
	if (provider === "claude-cli" && !modelId.endsWith("[1m]") && options?.claudeCli1M !== true) return;
	return provider === "anthropic-vertex" ? ANTHROPIC_VERTEX_CONTEXT_1M_TOKENS : ANTHROPIC_CONTEXT_1M_TOKENS;
}
/** Resolves an authored cap without lowering it to discovered model metadata. */
function resolveConfiguredContextTokenLimits(params, normalize = normalizePositiveContextTokens) {
	const provider = params.provider.trim();
	const model = params.model.trim();
	const configuredModel = resolveConfiguredRuntimeModel(params.cfg, provider, params.modelProvider, model);
	return resolveConfiguredContextTokenLimitsForModel({
		cfg: params.cfg,
		provider,
		model
	}, configuredModel, normalize);
}
function resolveConfiguredContextTokenLimitsForModel(params, configuredModel, normalize) {
	const { provider, model } = params;
	const extraParamSources = resolveModelExtraParamSources({
		config: params.cfg,
		provider: normalizeProviderId(provider),
		modelId: model
	});
	const effectiveContext1M = extraParamSources.modelParams && Object.hasOwn(extraParamSources.modelParams, "context1m") ? extraParamSources.modelParams.context1m : extraParamSources.defaultParams?.context1m;
	const fixedContextWindow = resolveAnthropicFixedContextWindow(normalizeProviderId(provider), model, { claudeCli1M: effectiveContext1M === true });
	const configuredContextTokens = normalize(configuredModel?.contextTokens) ?? void 0;
	const configuredContextWindow = normalize(configuredModel?.contextWindow) ?? void 0;
	const configuredTokenLimit = fixedContextWindow ?? configuredContextWindow;
	return {
		configuredContextWindow,
		fixedContextWindow,
		effectiveConfiguredTokens: configuredContextTokens === void 0 ? void 0 : configuredTokenLimit === void 0 ? configuredContextTokens : Math.min(configuredContextTokens, configuredTokenLimit)
	};
}
function resolveContextTokensForModelFromCache(params, lookupContextTokens = lookupCachedContextTokens, lookupContextWindow = lookupCachedContextWindow) {
	return resolveModelContextTokenProjectionFromCache(params, lookupContextTokens, lookupContextWindow).contextTokens;
}
function resolveModelContextTokenProjectionFromCache(params, lookupContextTokens = lookupCachedContextTokens, lookupContextWindow = lookupCachedContextWindow) {
	const ref = resolveProviderModelRef(params);
	const explicitProvider = params.provider?.trim();
	let authoredContextTokens;
	if (ref && explicitProvider) {
		const configuredModel = resolveConfiguredRuntimeModel(params.cfg, explicitProvider, params.modelProvider, ref.model);
		authoredContextTokens = readAuthoredModelContextTokens(configuredModel);
		const { effectiveConfiguredTokens, configuredContextWindow, fixedContextWindow } = resolveConfiguredContextTokenLimitsForModel({
			cfg: params.cfg,
			provider: explicitProvider,
			model: ref.model
		}, configuredModel, normalizePositiveContextTokens);
		if (effectiveConfiguredTokens !== void 0) return {
			contextTokens: effectiveConfiguredTokens,
			authoredContextTokens
		};
		if (fixedContextWindow !== void 0) return {
			contextTokens: fixedContextWindow,
			authoredContextTokens
		};
		const providerResult = lookupContextTokens(providerContextTokenCacheKey(normalizeProviderId(ref.provider), ref.model));
		const providerWindow = lookupContextWindow(providerContextTokenCacheKey(normalizeProviderId(ref.provider), ref.model));
		const discoveredCap = minPositiveContextTokens(providerResult, typeof params.modelContextTokens === "number" && params.modelContextTokens > 0 ? params.modelContextTokens : void 0, providerWindow, typeof params.modelContextWindow === "number" && params.modelContextWindow > 0 ? params.modelContextWindow : void 0);
		if (discoveredCap !== void 0) return {
			contextTokens: configuredContextWindow === void 0 ? discoveredCap : Math.min(discoveredCap, configuredContextWindow),
			authoredContextTokens
		};
		if (configuredContextWindow !== void 0) return {
			contextTokens: configuredContextWindow,
			authoredContextTokens
		};
	}
	if (params.allowUnscopedModelLookup === false) return {
		contextTokens: params.fallbackContextTokens,
		authoredContextTokens
	};
	const bareCap = minPositiveContextTokens(lookupContextTokens(params.model), lookupContextWindow(params.model));
	if (bareCap !== void 0) return {
		contextTokens: bareCap,
		authoredContextTokens
	};
	return {
		contextTokens: params.fallbackContextTokens,
		authoredContextTokens
	};
}
//#endregion
export { minPositiveContextTokens as _, ANTHROPIC_SONNET_5_CONTEXT_TOKENS as a, replaceDiscoveredContextTokenCache as b, resolveAuthoredModelContextTokens as c, resolveModelContextTokenProjectionFromCache as d, REUSED_CONTEXT_WINDOW_CACHE_STATE as f, lookupCachedContextWindow as g, lookupCachedContextTokens as h, ANTHROPIC_OPUS_5_CONTEXT_TOKENS as i, resolveConfiguredContextTokenLimits as l, getContextWindowCaches as m, ANTHROPIC_FABLE_CONTEXT_TOKENS as n, ANTHROPIC_VERTEX_CONTEXT_1M_TOKENS as o, clearContextWindowCaches as p, ANTHROPIC_MYTHOS_5_CONTEXT_TOKENS as r, resolveAnthropicFixedContextWindow as s, ANTHROPIC_CONTEXT_1M_TOKENS as t, resolveContextTokensForModelFromCache as u, providerContextTokenCacheKey as v, replaceContextWindowCaches as y };
