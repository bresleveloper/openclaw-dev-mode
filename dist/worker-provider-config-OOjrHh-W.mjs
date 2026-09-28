import { i as normalizeCapabilityProviderId } from "./provider-registry-shared-CGngP_UC.mjs";
//#region src/plugins/worker-provider-id.ts
const compareText = (left, right) => left < right ? -1 : left > right ? 1 : 0;
function normalizeWorkerProviderIds(providerIds) {
	const normalized = providerIds.map(normalizeCapabilityProviderId).filter((id) => id !== void 0);
	return [...new Set(normalized)].toSorted(compareText);
}
//#endregion
//#region src/plugins/worker-provider-config.ts
function collectConfiguredWorkerProviderIds(config) {
	return normalizeWorkerProviderIds(Object.values(config.cloudWorkers?.profiles ?? {}).map((profile) => profile.provider));
}
//#endregion
export { normalizeWorkerProviderIds as n, collectConfiguredWorkerProviderIds as t };
