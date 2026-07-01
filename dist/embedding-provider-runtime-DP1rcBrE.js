import { v as resolveConfiguredGenericEmbeddingProviderId } from "./gateway-startup-plugin-ids-DvFtK64_.js";
import { M as listRegisteredEmbeddingProviders, j as getRegisteredEmbeddingProvider } from "./registry-yozg2pVI.js";
import { n as listRuntimeEmbeddingProviderAdapters, r as resolveRuntimeEmbeddingProviderLookupIds, t as getRuntimeEmbeddingProviderAdapter } from "./embedding-provider-runtime-shared-BNSfmJR8.js";
//#region src/plugins/embedding-provider-runtime.ts
/** Lists embedding provider adapters registered directly with the process registry. */
function listRegisteredEmbeddingProviderAdapters() {
	return listRegisteredEmbeddingProviders().map((entry) => entry.adapter);
}
/** Lists embedding providers from registered adapters and plugin capabilities. */
function listEmbeddingProviders(cfg) {
	return listRuntimeEmbeddingProviderAdapters({
		key: "embeddingProviders",
		cfg,
		registered: listRegisteredEmbeddingProviderAdapters()
	});
}
function resolveConfiguredEmbeddingProviderId(providerId, cfg) {
	return resolveConfiguredGenericEmbeddingProviderId(providerId, cfg);
}
function resolveEmbeddingProviderLookupIds(id, cfg) {
	return resolveRuntimeEmbeddingProviderLookupIds({
		id,
		cfg,
		resolveConfiguredProviderId: resolveConfiguredEmbeddingProviderId
	});
}
/** Resolves one embedding provider adapter by id, including configured API aliases. */
function getEmbeddingProvider(id, cfg) {
	return getRuntimeEmbeddingProviderAdapter({
		key: "embeddingProviders",
		cfg,
		lookupIds: resolveEmbeddingProviderLookupIds(id, cfg),
		getRegisteredProvider: getRegisteredEmbeddingProvider
	});
}
//#endregion
export { listEmbeddingProviders as n, getEmbeddingProvider as t };
