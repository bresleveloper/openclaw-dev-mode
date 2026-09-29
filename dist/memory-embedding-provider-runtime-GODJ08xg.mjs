import { D as listRegisteredEmbeddingProviders } from "./gateway-startup-plugin-config-AVh0bjkO.mjs";
import { n as listEmbeddingProviders, t as getEmbeddingProvider } from "./embedding-provider-runtime-CDBrS5R4.mjs";
//#region src/plugins/memory-embedding-provider-runtime.ts
/** Lists registered memory embedding provider adapters without registry metadata. */
function listRegisteredMemoryEmbeddingProviderAdapters() {
	return listRegisteredEmbeddingProviders().map((entry) => entry.adapter);
}
/** Lists memory embedding providers from runtime config and registered adapters. */
function listMemoryEmbeddingProviders(cfg) {
	return listEmbeddingProviders(cfg);
}
/** Resolves one memory embedding provider by id, alias, or configured API owner. */
function getMemoryEmbeddingProvider(id, cfg) {
	return getEmbeddingProvider(id, cfg);
}
//#endregion
export { listMemoryEmbeddingProviders as n, listRegisteredMemoryEmbeddingProviderAdapters as r, getMemoryEmbeddingProvider as t };
