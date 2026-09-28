import { r as normalizeProviderId } from "./provider-id-DCtsDflE.mjs";
import { t as resolveConfiguredGenericEmbeddingProviderId } from "./embedding-provider-config-CcgUkcEv.mjs";
import { D as listRegisteredEmbeddingProviders, E as getRegisteredEmbeddingProvider } from "./gateway-startup-plugin-config-XCCRUavD.mjs";
import { a as resolvePluginCapabilityProviders, i as resolvePluginCapabilityProvider } from "./capability-provider-runtime-BdPCG__9.mjs";
//#region src/plugins/embedding-provider-runtime-shared.ts
/** Shared runtime helpers for embedding provider lookup across core and plugin capabilities. */
/** Builds lookup ids for embedding providers, including configured API aliases. */
function resolveRuntimeEmbeddingProviderLookupIds(params) {
	const ids = [params.id];
	const configuredProviderId = params.resolveConfiguredProviderId(params.id, params.cfg);
	if (configuredProviderId && !ids.some((candidate) => normalizeProviderId(candidate) === configuredProviderId)) ids.push(configuredProviderId);
	return ids;
}
/** Lists registered and plugin-contributed embedding provider adapters for a capability key. */
function listRuntimeEmbeddingProviderAdapters(params) {
	const merged = new Map(params.registered.map((adapter) => [adapter.id, adapter]));
	const capabilityAdapters = resolvePluginCapabilityProviders({
		key: params.key,
		cfg: params.cfg
	});
	for (const adapter of capabilityAdapters) if (!merged.has(adapter.id)) merged.set(adapter.id, adapter);
	return [...merged.values()];
}
/** Resolves one embedding provider adapter from registered providers before plugin capabilities. */
function getRuntimeEmbeddingProviderAdapter(params) {
	for (const candidateId of params.lookupIds) {
		const registered = params.getRegisteredProvider(candidateId);
		if (registered) return registered.adapter;
		const provider = resolvePluginCapabilityProvider({
			key: params.key,
			providerId: candidateId,
			cfg: params.cfg
		});
		if (provider) return provider;
	}
}
//#endregion
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
