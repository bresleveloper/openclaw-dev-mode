import { i as normalizeCapabilityProviderId, t as buildCapabilityProviderIndex } from "./provider-registry-shared-CGngP_UC.mjs";
import { a as resolvePluginCapabilityProviders, i as resolvePluginCapabilityProvider } from "./capability-provider-runtime-BdPCG__9.mjs";
//#region src/media-generation/provider-registry.ts
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
export { createMediaProviderRegistry as t };
