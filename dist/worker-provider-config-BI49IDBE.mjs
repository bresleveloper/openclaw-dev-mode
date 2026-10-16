import { i as normalizeCapabilityProviderId } from "./provider-registry-shared-Cov0065J.mjs";
//#region src/plugins/worker-provider-id.ts
function normalizeWorkerProviderIds(providerIds) {
	const normalized = providerIds.map(normalizeCapabilityProviderId).filter((id) => id !== void 0);
	return [...new Set(normalized)].toSorted();
}
//#endregion
//#region src/plugins/worker-provider-config.ts
function collectConfiguredWorkerProviderIds(config) {
	return normalizeWorkerProviderIds(Object.values(config.cloudWorkers?.profiles ?? {}).map((profile) => profile.provider));
}
//#endregion
export { normalizeWorkerProviderIds as n, collectConfiguredWorkerProviderIds as t };
