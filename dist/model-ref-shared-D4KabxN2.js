import { a as normalizeLowercaseStringOrEmpty } from "./string-coerce-DW4mBlAt.js";
import { i as normalizeProviderId } from "./provider-id-Dq06Bcx6.js";
import { t as modelKey } from "./model-key-BaNhQShd.js";
import { _ as normalizeConfiguredProviderCatalogModelId$1, b as normalizeStaticProviderModelIdWithPolicies, g as normalizeBuiltInProviderModelId, h as collectManifestModelIdNormalizationPolicies, v as normalizeConfiguredProviderCatalogModelRef } from "./current-plugin-metadata-snapshot-BcIVzXmF.js";
import { t as normalizeProviderModelIdWithManifest } from "./manifest-model-id-normalization-Dgqb50kw.js";
//#region src/agents/model-ref-shared.ts
/**
* Shared provider/model reference normalization for static catalogs,
* allowlists, and display paths. Manifest policies are optional so tests can
* isolate built-in normalization behavior.
*/
/** Normalize a static provider model ID with built-in and optional manifest policy. */
function normalizeStaticProviderModelId(provider, model, options = {}) {
	const normalizedProvider = normalizeProviderId(provider);
	if (options.allowManifestNormalization === false) return normalizeBuiltInProviderModelId(normalizedProvider, model);
	if (options.manifestPlugins) return normalizeStaticProviderModelIdWithPolicies(normalizedProvider, model, collectManifestModelIdNormalizationPolicies(options.manifestPlugins));
	return normalizeBuiltInProviderModelId(normalizedProvider, normalizeProviderModelIdWithManifest({
		provider: normalizedProvider,
		context: {
			provider: normalizedProvider,
			modelId: model
		}
	}) ?? model);
}
/** Normalize a configured catalog model ID for comparisons against provider catalogs. */
function normalizeConfiguredProviderCatalogModelId(provider, model, options = {}) {
	if (options.allowManifestNormalization === false) return normalizeConfiguredProviderCatalogModelId$1(provider, model, /* @__PURE__ */ new Map());
	if (options.manifestPlugins) return normalizeConfiguredProviderCatalogModelId$1(provider, model, collectManifestModelIdNormalizationPolicies(options.manifestPlugins));
	return normalizeConfiguredProviderCatalogModelRef(normalizeStaticProviderModelId(provider, model, options));
}
function parseStaticModelRef(raw, defaultProvider) {
	const trimmed = raw.trim();
	if (!trimmed) return null;
	const slash = trimmed.indexOf("/");
	const providerRaw = slash === -1 ? defaultProvider : trimmed.slice(0, slash).trim();
	const modelRaw = slash === -1 ? trimmed : trimmed.slice(slash + 1).trim();
	if (!providerRaw || !modelRaw) return null;
	const provider = normalizeProviderId(providerRaw);
	return {
		provider,
		model: normalizeStaticProviderModelId(provider, modelRaw)
	};
}
/** Resolve an allowlist entry to a canonical provider/model key. */
function resolveStaticAllowlistModelKey(raw, defaultProvider) {
	const parsed = parseStaticModelRef(raw, defaultProvider);
	if (!parsed) return null;
	return modelKey(parsed.provider, parsed.model);
}
/** Preserve literal provider/model refs that already include a provider prefix twice. */
function formatLiteralProviderPrefixedModelRef(provider, modelRef) {
	const providerId = normalizeProviderId(provider);
	const trimmedRef = modelRef.trim();
	if (!providerId || !trimmedRef) return trimmedRef;
	const normalizedRef = normalizeLowercaseStringOrEmpty(trimmedRef);
	const literalPrefix = `${providerId}/${providerId}/`;
	if (normalizedRef.startsWith(literalPrefix)) return trimmedRef;
	return normalizedRef.startsWith(`${providerId}/`) ? `${providerId}/${trimmedRef}` : trimmedRef;
}
//#endregion
export { resolveStaticAllowlistModelKey as i, normalizeConfiguredProviderCatalogModelId as n, normalizeStaticProviderModelId as r, formatLiteralProviderPrefixedModelRef as t };
