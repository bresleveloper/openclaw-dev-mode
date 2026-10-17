import { i as normalizeCapabilityProviderId, t as buildCapabilityProviderIndex } from "./provider-registry-shared-Cov0065J.mjs";
import { a as resolvePluginCapabilityProviders, i as resolvePluginCapabilityProvider } from "./capability-provider-runtime-BUYIpbkx.mjs";
//#region src/media-generation/provider-registry.ts
/** Keeps provider lookups within one already-acquired operation scope. */
function createMediaProviderLookup(providers) {
	const canonical = buildCapabilityProviderIndex(providers, "canonical");
	const aliases = buildCapabilityProviderIndex(providers, "aliases");
	return {
		getProvider: (id) => {
			const normalized = normalizeCapabilityProviderId(id);
			return normalized ? aliases.get(normalized) : void 0;
		},
		listProviders: () => [...canonical.values()]
	};
}
/** Shares normalized provider listing while preserving targeted transcription lookup. */
function createMediaProviderRegistry(key, options = {}) {
	const buildProviderIndex = (mode, cfg, additionalProviderIds) => buildCapabilityProviderIndex(resolvePluginCapabilityProviders({
		key,
		cfg,
		additionalProviderIds
	}), mode);
	return {
		listProviders: (cfg, additionalProviderIds) => [...buildProviderIndex("canonical", cfg, additionalProviderIds).values()],
		getProvider: (providerId, cfg) => {
			const normalized = normalizeCapabilityProviderId(providerId);
			if (!normalized) return;
			return options.directLookup ? resolvePluginCapabilityProvider({
				key,
				providerId: normalized,
				cfg
			}) : buildProviderIndex("aliases", cfg).get(normalized);
		}
	};
}
//#endregion
export { createMediaProviderRegistry as n, createMediaProviderLookup as t };
