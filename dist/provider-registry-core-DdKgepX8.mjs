import { i as normalizeCapabilityProviderId, t as buildCapabilityProviderIndex } from "./provider-registry-shared-CGngP_UC.mjs";
//#region src/tts/provider-registry-core.ts
/** Normalize user/provider IDs into the canonical speech provider ID shape. */
function normalizeSpeechProviderId(providerId) {
	return normalizeCapabilityProviderId(providerId);
}
/** Order speech providers by priority and provider ID for deterministic equal-priority fallback. */
function compareSpeechProviderOrder(left, right) {
	const leftOrder = left.autoSelectOrder ?? Number.MAX_SAFE_INTEGER;
	const rightOrder = right.autoSelectOrder ?? Number.MAX_SAFE_INTEGER;
	if (leftOrder !== rightOrder) return leftOrder - rightOrder;
	return left.id.localeCompare(right.id);
}
/** Create a registry facade with canonical listing, alias lookup, and ID canonicalization. */
function createSpeechProviderRegistry(resolver) {
	const buildAliasIndex = (cfg) => buildCapabilityProviderIndex(resolver.listProviders(cfg), "aliases");
	const listProviders = (cfg) => [...buildCapabilityProviderIndex(resolver.listProviders(cfg), "canonical").values()];
	const getProvider = (providerId, cfg) => {
		const normalized = normalizeSpeechProviderId(providerId);
		if (!normalized) return;
		return resolver.getProvider(normalized, cfg) ?? buildAliasIndex(cfg).get(normalized);
	};
	const canonicalizeProviderId = (providerId, cfg) => {
		const normalized = normalizeSpeechProviderId(providerId);
		if (!normalized) return;
		return getProvider(normalized, cfg)?.id ?? normalized;
	};
	return {
		canonicalizeSpeechProviderId: canonicalizeProviderId,
		getSpeechProvider: getProvider,
		listSpeechProviders: listProviders
	};
}
//#endregion
export { createSpeechProviderRegistry as n, normalizeSpeechProviderId as r, compareSpeechProviderOrder as t };
