import { i as normalizeCapabilityProviderId } from "./provider-registry-shared-Cov0065J.mjs";
//#region src/plugins/storage-provider-manifest.ts
function normalizeStorageProviderIds(ids) {
	return [...new Set(ids.map(normalizeCapabilityProviderId).filter((id) => Boolean(id)))].toSorted();
}
function collectConfiguredStorageProviderIds(config) {
	return normalizeStorageProviderIds(Object.values(config.storage?.locations ?? {}).map((location) => location.provider)).filter((id) => id !== "filesystem");
}
function manifestOwnsStorageProvider(manifest, providerIds) {
	return normalizeStorageProviderIds(manifest?.contracts?.storageProviders ?? []).some((id) => providerIds.has(id));
}
function listBundledStorageProviderOwners(registry, providerIds) {
	const selected = new Set(normalizeStorageProviderIds(providerIds));
	return registry.plugins.filter((plugin) => plugin.origin === "bundled").flatMap((plugin) => normalizeStorageProviderIds(plugin.contracts?.storageProviders ?? []).filter((providerId) => selected.has(providerId)).map((providerId) => ({
		pluginId: plugin.id,
		providerId
	}))).toSorted((left, right) => left.pluginId.localeCompare(right.pluginId) || left.providerId.localeCompare(right.providerId));
}
//#endregion
export { listBundledStorageProviderOwners as n, manifestOwnsStorageProvider as r, collectConfiguredStorageProviderIds as t };
