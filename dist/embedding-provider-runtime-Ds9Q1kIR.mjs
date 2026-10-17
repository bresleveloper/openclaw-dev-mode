import { t as resolveConfiguredGenericEmbeddingProviderId } from "./embedding-provider-config-DW81XCVx.mjs";
import { T as listRegisteredEmbeddingProviders, w as getRegisteredEmbeddingProvider } from "./gateway-startup-plugin-config-ClZKV71m.mjs";
import { a as resolvePluginCapabilityProviders, i as resolvePluginCapabilityProvider } from "./capability-provider-runtime-BUYIpbkx.mjs";
//#region src/plugins/embedding-provider-runtime.ts
/** Lists embedding providers from registered adapters and plugin capabilities. */
function listEmbeddingProviders(cfg) {
	const merged = new Map(listRegisteredEmbeddingProviders().map(({ adapter }) => [adapter.id, adapter]));
	const capabilityAdapters = resolvePluginCapabilityProviders({
		key: "embeddingProviders",
		cfg
	});
	for (const adapter of capabilityAdapters) if (!merged.has(adapter.id)) merged.set(adapter.id, adapter);
	return [...merged.values()];
}
/** Resolves one embedding provider adapter by id, including configured API aliases. */
function getEmbeddingProvider(id, cfg) {
	const lookupIds = [id];
	const configuredProviderId = resolveConfiguredGenericEmbeddingProviderId(id, cfg);
	if (configuredProviderId) lookupIds.push(configuredProviderId);
	for (const providerId of lookupIds) {
		const registered = getRegisteredEmbeddingProvider(providerId);
		if (registered) return registered.adapter;
		const provider = resolvePluginCapabilityProvider({
			key: "embeddingProviders",
			providerId,
			cfg
		});
		if (provider) return provider;
	}
}
//#endregion
export { listEmbeddingProviders as n, getEmbeddingProvider as t };
