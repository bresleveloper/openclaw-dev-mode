import { a as normalizeLowercaseStringOrEmpty, s as normalizeOptionalLowercaseString } from "./string-coerce-DW4mBlAt.js";
import { r as resolveAgentModelFallbackValues } from "./model-input-BHKiDwaq.js";
import { s as resolveThinkingDefaultForModel } from "./thinking-DxaN427I.js";
import { f as normalizeModelSelection, i as buildModelAliasIndex, m as resolveAllowedModelRefFromAliasIndex, r as buildConfiguredModelCatalog, s as getModelRefStatusWithFallbackModels } from "./model-selection-shared-CKMggJal.js";
import { i as modelKey, o as normalizeProviderId, r as legacyModelKey } from "./model-selection-normalize-Df7baLev.js";
//#region src/agents/model-selection-resolve.ts
/**
* Model selection resolution facade.
*
* This module exposes model-selection helpers that need default fallback model
* handling before checking aliases, allowlists, catalogs, and plugin manifests.
*/
function resolveDefaultFallbackModels(cfg) {
	return resolveAgentModelFallbackValues(cfg.agents?.defaults?.model);
}
/** Returns whether a normalized model ref is available, allowed, or fallback-backed. */
function getModelRefStatus(params) {
	const { cfg, catalog, ref, defaultProvider, defaultModel, manifestPlugins } = params;
	return getModelRefStatusWithFallbackModels({
		cfg,
		catalog,
		ref,
		defaultProvider,
		defaultModel,
		fallbackModels: resolveDefaultFallbackModels(cfg),
		manifestPlugins
	});
}
/** Resolves a raw model string into an allowed model ref or an explanatory error. */
function resolveAllowedModelRef(params) {
	const aliasIndex = buildModelAliasIndex({
		cfg: params.cfg,
		defaultProvider: params.defaultProvider,
		manifestPlugins: params.manifestPlugins
	});
	return resolveAllowedModelRefFromAliasIndex({
		cfg: params.cfg,
		raw: params.raw,
		defaultProvider: params.defaultProvider,
		aliasIndex,
		manifestPlugins: params.manifestPlugins,
		getStatus: (ref) => getModelRefStatus({
			cfg: params.cfg,
			catalog: params.catalog,
			ref,
			defaultProvider: params.defaultProvider,
			defaultModel: params.defaultModel,
			manifestPlugins: params.manifestPlugins
		})
	});
}
//#endregion
//#region src/agents/model-thinking-default.ts
/**
* Resolves default thinking levels for provider/model pairs. It combines
* explicit per-model config, global defaults, catalog metadata, and model
* family fallbacks.
*/
/** Resolves the default thinking level for a provider/model pair. */
function resolveThinkingDefault(params) {
	const normalizedProvider = normalizeProviderId(params.provider);
	const normalizedModel = normalizeLowercaseStringOrEmpty(params.model).replace(/\./g, "-");
	const catalog = Array.isArray(params.catalog) ? params.catalog : buildConfiguredModelCatalog({ cfg: params.cfg });
	const catalogCandidate = catalog.find((entry) => entry.provider === params.provider && entry.id === params.model);
	const configuredModels = params.cfg.agents?.defaults?.models;
	const canonicalKey = modelKey(params.provider, params.model);
	const legacyKey = legacyModelKey(params.provider, params.model);
	const normalizedCanonicalKey = normalizeLowercaseStringOrEmpty(canonicalKey);
	const normalizedLegacyKey = normalizeOptionalLowercaseString(legacyKey);
	const normalizedPrimarySelection = normalizeOptionalLowercaseString(normalizeModelSelection(params.cfg.agents?.defaults?.model));
	const explicitModelConfigured = (configuredModels ? canonicalKey in configuredModels : false) || Boolean(legacyKey && configuredModels && legacyKey in configuredModels) || normalizedPrimarySelection === normalizedCanonicalKey || Boolean(normalizedLegacyKey && normalizedPrimarySelection === normalizedLegacyKey) || normalizedPrimarySelection === normalizeLowercaseStringOrEmpty(params.model);
	const perModelThinking = configuredModels?.[canonicalKey]?.params?.thinking ?? (legacyKey ? configuredModels?.[legacyKey]?.params?.thinking : void 0);
	if (perModelThinking === false || perModelThinking === "disabled" || perModelThinking === "none") return "off";
	if (perModelThinking === "off" || perModelThinking === "minimal" || perModelThinking === "low" || perModelThinking === "medium" || perModelThinking === "high" || perModelThinking === "xhigh" || perModelThinking === "adaptive" || perModelThinking === "max") return perModelThinking;
	const configured = params.cfg.agents?.defaults?.thinkingDefault;
	if (configured) return configured;
	const isClaudeProvider = normalizedProvider === "anthropic" || normalizedProvider === "anthropic-vertex" || normalizedProvider === "claude-cli";
	if (isClaudeProvider && (normalizedModel.startsWith("claude-opus-4-8") || normalizedModel.startsWith("claude-opus-4.8"))) return "off";
	if (isClaudeProvider && (normalizedModel.startsWith("claude-opus-4-7") || normalizedModel.startsWith("claude-opus-4.7"))) return "off";
	if (normalizedProvider === "anthropic" && explicitModelConfigured && typeof catalogCandidate?.name === "string" && /4\.6\b/.test(catalogCandidate.name) && (normalizedModel.startsWith("claude-opus-4-6") || normalizedModel.startsWith("claude-sonnet-4-6"))) return "adaptive";
	return resolveThinkingDefaultForModel({
		provider: params.provider,
		model: params.model,
		catalog
	});
}
/** Resolves thinking default after loading runtime catalog only when needed. */
async function resolveThinkingDefaultWithRuntimeCatalog(params) {
	const configuredCatalog = buildConfiguredModelCatalog({ cfg: params.cfg });
	const configuredSelectedEntry = configuredCatalog.find((entry) => entry.provider === params.provider && entry.id === params.model);
	const runtimeCatalog = configuredCatalog.length === 0 || !configuredSelectedEntry || configuredSelectedEntry.reasoning === void 0 ? await params.loadModelCatalog() : void 0;
	const catalog = runtimeCatalog?.find((entry) => entry.provider === params.provider && entry.id === params.model) || configuredCatalog.length === 0 ? runtimeCatalog ?? configuredCatalog : configuredCatalog;
	return resolveThinkingDefault({
		cfg: params.cfg,
		provider: params.provider,
		model: params.model,
		catalog
	});
}
//#endregion
export { resolveAllowedModelRef as i, resolveThinkingDefaultWithRuntimeCatalog as n, getModelRefStatus as r, resolveThinkingDefault as t };
