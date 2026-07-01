import { a as normalizeLowercaseStringOrEmpty } from "./string-coerce-DW4mBlAt.js";
import { o as normalizeProviderId } from "./model-selection-normalize-Df7baLev.js";
import "./model-selection-i8V2iTdL.js";
//#region src/agents/context-cache.ts
/** Process-local model context window cache keyed by model id. */
const MODEL_CONTEXT_TOKEN_CACHE = /* @__PURE__ */ new Map();
const MODEL_CONFIGURED_CONTEXT_TOKEN_CACHE = /* @__PURE__ */ new Map();
const MODEL_CONTEXT_WINDOW_CACHE = /* @__PURE__ */ new Map();
const PROVIDER_CONTEXT_TOKEN_CACHE_PREFIX = "\0provider:";
/** Internal cache key for discovery metadata with verified provider ownership. */
function providerContextTokenCacheKey(provider, modelId) {
	return `${PROVIDER_CONTEXT_TOKEN_CACHE_PREFIX}${provider}\0${modelId}`;
}
/** Looks up cached context-token count for a model id. */
function lookupCachedContextTokens(modelId) {
	if (!modelId) return;
	return MODEL_CONFIGURED_CONTEXT_TOKEN_CACHE.get(modelId) ?? MODEL_CONTEXT_TOKEN_CACHE.get(modelId);
}
/** Looks up a configured native context window without treating it as an effective runtime cap. */
function lookupCachedContextWindow(modelId) {
	if (!modelId) return;
	return MODEL_CONTEXT_WINDOW_CACHE.get(modelId);
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
const ANTHROPIC_GA_1M_MODEL_PREFIXES = [
	"claude-opus-4-8",
	"claude-opus-4.8",
	"claude-opus-4-6",
	"claude-opus-4.6",
	"claude-opus-4-7",
	"claude-opus-4.7",
	"claude-sonnet-4-6",
	"claude-sonnet-4.6"
];
const ANTHROPIC_CONTEXT_1M_TOKENS = 1048576;
const ANTHROPIC_VERTEX_CONTEXT_1M_TOKENS = 1e6;
const ANTHROPIC_FABLE_CONTEXT_TOKENS = 1e6;
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
function resolveConfiguredProviderContextTokens(cfg, provider, model) {
	const providers = (cfg?.models)?.providers;
	if (!providers) return;
	function readProviderContextTokens(providerConfig) {
		if (typeof providerConfig?.contextTokens === "number" && providerConfig.contextTokens > 0) return {
			value: providerConfig.contextTokens,
			source: "contextTokens"
		};
		if (typeof providerConfig?.contextWindow === "number" && providerConfig.contextWindow > 0) return {
			value: providerConfig.contextWindow,
			source: "contextWindow"
		};
	}
	function findContextTokens(matchProviderId) {
		for (const [providerId, providerConfig] of Object.entries(providers)) {
			if (!matchProviderId(providerId)) continue;
			if (Array.isArray(providerConfig?.models)) for (const entry of providerConfig.models) {
				const entryId = typeof entry?.id === "string" ? entry.id : "";
				const slash = entryId.indexOf("/");
				const prefixedProvider = slash > 0 ? normalizeProviderId(entryId.slice(0, slash)) : "";
				const bareEntryId = slash > 0 ? entryId.slice(slash + 1).trim() : "";
				const modelMatches = entryId === model || prefixedProvider === normalizeProviderId(providerId) && bareEntryId === model;
				if (modelMatches && typeof entry.contextTokens === "number" && entry.contextTokens > 0) return {
					value: entry.contextTokens,
					source: "contextTokens"
				};
				if (modelMatches && typeof entry.contextWindow === "number" && entry.contextWindow > 0) return {
					value: entry.contextWindow,
					source: "contextWindow"
				};
			}
			const providerContextTokens = readProviderContextTokens(providerConfig);
			if (providerContextTokens) return providerContextTokens;
		}
	}
	const exactResult = findContextTokens((id) => normalizeLowercaseStringOrEmpty(id) === normalizeLowercaseStringOrEmpty(provider));
	if (exactResult !== void 0) return exactResult;
	const normalizedProvider = normalizeProviderId(provider);
	return findContextTokens((id) => normalizeProviderId(id) === normalizedProvider);
}
function resolveModelFamilyId(modelId) {
	const normalized = normalizeLowercaseStringOrEmpty(modelId);
	return normalized.includes("/") ? normalized.split("/").at(-1) ?? normalized : normalized;
}
function resolveAnthropicFixedContextWindow(provider, model) {
	const modelId = resolveModelFamilyId(model);
	if ((provider === "anthropic" || provider === "anthropic-vertex") && modelId.startsWith("claude-fable-5")) return ANTHROPIC_FABLE_CONTEXT_TOKENS;
	if (provider !== "anthropic" && provider !== "anthropic-vertex" && provider !== "claude-cli") return;
	if (!ANTHROPIC_GA_1M_MODEL_PREFIXES.some((prefix) => modelId.startsWith(prefix))) return;
	return provider === "anthropic-vertex" ? ANTHROPIC_VERTEX_CONTEXT_1M_TOKENS : ANTHROPIC_CONTEXT_1M_TOKENS;
}
function resolveContextTokensForModelFromCache(params, lookupContextTokens = lookupCachedContextTokens, lookupContextWindow = lookupCachedContextWindow) {
	const ref = resolveProviderModelRef(params);
	const override = typeof params.contextTokensOverride === "number" && params.contextTokensOverride > 0 ? params.contextTokensOverride : void 0;
	const capOverride = (contextTokens) => override !== void 0 ? Math.min(override, contextTokens) : contextTokens;
	const explicitProvider = params.provider?.trim();
	if (ref && explicitProvider) {
		const configuredWindow = resolveConfiguredProviderContextTokens(params.cfg, explicitProvider, ref.model);
		const sourceConfiguredWindow = resolveConfiguredProviderContextTokens(params.sourceCfg === void 0 ? params.cfg : params.sourceCfg, explicitProvider, ref.model);
		const fixedContextWindow = resolveAnthropicFixedContextWindow(ref.provider, ref.model);
		const providerResult = lookupContextTokens(providerContextTokenCacheKey(normalizeProviderId(ref.provider), ref.model));
		const providerWindow = lookupContextWindow(providerContextTokenCacheKey(normalizeProviderId(ref.provider), ref.model));
		const modelContextTokens = typeof params.modelContextTokens === "number" && params.modelContextTokens > 0 ? params.modelContextTokens : void 0;
		const modelContextWindow = typeof params.modelContextWindow === "number" && params.modelContextWindow > 0 ? params.modelContextWindow : void 0;
		const runtimeCap = minPositiveContextTokens(providerResult, modelContextTokens, fixedContextWindow === void 0 ? providerWindow : void 0, fixedContextWindow === void 0 ? modelContextWindow : void 0);
		if (configuredWindow) {
			if (configuredWindow.source === "contextTokens") return capOverride(fixedContextWindow === void 0 ? configuredWindow.value : Math.min(configuredWindow.value, fixedContextWindow));
			const authoredContextWindow = sourceConfiguredWindow?.source === "contextWindow" ? sourceConfiguredWindow.value : void 0;
			if (fixedContextWindow !== void 0 && authoredContextWindow === void 0) return capOverride(runtimeCap === void 0 ? fixedContextWindow : Math.min(runtimeCap, fixedContextWindow));
			if (fixedContextWindow !== void 0) {
				const effectiveCap = minPositiveContextTokens(authoredContextWindow, fixedContextWindow, runtimeCap);
				return effectiveCap === void 0 ? void 0 : capOverride(effectiveCap);
			}
			if (runtimeCap !== void 0) return capOverride(Math.min(configuredWindow.value, runtimeCap));
			return capOverride(configuredWindow.value);
		}
		if (runtimeCap !== void 0) return capOverride(fixedContextWindow === void 0 ? runtimeCap : Math.min(runtimeCap, fixedContextWindow));
		if (fixedContextWindow !== void 0) return capOverride(fixedContextWindow);
	}
	const bareCap = minPositiveContextTokens(lookupContextTokens(params.model), lookupContextWindow(params.model));
	if (bareCap !== void 0) return Boolean(explicitProvider && ref?.model.includes("/")) && override !== void 0 ? override : capOverride(bareCap);
	return override ?? params.fallbackContextTokens;
}
//#endregion
export { resolveContextTokensForModelFromCache as a, MODEL_CONTEXT_WINDOW_CACHE as c, minPositiveContextTokens as d, providerContextTokenCacheKey as f, resolveAnthropicFixedContextWindow as i, lookupCachedContextTokens as l, ANTHROPIC_FABLE_CONTEXT_TOKENS as n, MODEL_CONFIGURED_CONTEXT_TOKEN_CACHE as o, ANTHROPIC_VERTEX_CONTEXT_1M_TOKENS as r, MODEL_CONTEXT_TOKEN_CACHE as s, ANTHROPIC_CONTEXT_1M_TOKENS as t, lookupCachedContextWindow as u };
