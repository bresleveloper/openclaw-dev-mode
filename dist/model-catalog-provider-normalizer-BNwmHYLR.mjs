import { r as normalizeProviderId } from "./provider-id-DCtsDflE.mjs";
import { l as normalizePluginsConfig } from "./config-state-BEAL5gWH.mjs";
import { t as buildModelCatalogProviderAliasTargets } from "./manifest-planner-LLbsmVKX.mjs";
import { n as isManifestPluginAvailableForControlPlane } from "./manifest-contract-eligibility-D2rgNcZS.mjs";
//#region src/agents/model-catalog-provider-normalizer.ts
/** Prepares provider aliases once for one captured catalog metadata generation. */
function createPreparedModelCatalogProviderNormalizer(metadataSnapshot, config, env) {
	const aliases = /* @__PURE__ */ new Map();
	let normalizedConfig;
	for (const plugin of metadataSnapshot.plugins) {
		if (!isManifestPluginAvailableForControlPlane({
			snapshot: metadataSnapshot,
			plugin,
			config,
			normalizedConfig: config.plugins && (normalizedConfig ??= normalizePluginsConfig(config.plugins)),
			env
		})) continue;
		for (const [target, providerAliases] of buildModelCatalogProviderAliasTargets(plugin)) {
			const canonicalProvider = normalizeProviderId(target);
			for (const alias of providerAliases) {
				const key = normalizeProviderId(alias);
				if (!aliases.has(key)) aliases.set(key, canonicalProvider);
			}
		}
	}
	return (provider) => {
		const normalizedProvider = normalizeProviderId(provider);
		return aliases.get(normalizedProvider) ?? normalizedProvider;
	};
}
//#endregion
export { createPreparedModelCatalogProviderNormalizer as t };
