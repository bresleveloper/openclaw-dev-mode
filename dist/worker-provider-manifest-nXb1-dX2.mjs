import { n as normalizeWorkerProviderIds } from "./worker-provider-config-OOjrHh-W.mjs";
//#region src/plugins/worker-provider-manifest.ts
const compareText = (left, right) => left < right ? -1 : left > right ? 1 : 0;
function manifestOwnsWorkerProvider(manifest, providerIds) {
	return normalizeWorkerProviderIds(manifest?.contracts?.workerProviders ?? []).some((id) => providerIds.has(id));
}
function listBundledWorkerProviderOwners(registry, providerIds) {
	const selected = new Set(normalizeWorkerProviderIds(providerIds));
	return registry.plugins.filter((plugin) => plugin.origin === "bundled").flatMap((plugin) => normalizeWorkerProviderIds(plugin.contracts?.workerProviders ?? []).filter((providerId) => selected.has(providerId)).map((providerId) => ({
		pluginId: plugin.id,
		providerId
	}))).toSorted((left, right) => compareText(left.pluginId, right.pluginId) || compareText(left.providerId, right.providerId));
}
/** Auto-enable bundled owners needed to reconcile leases after profile removal. */
function resolveDurableWorkerProviderAutoEnabledReasons(registry, providerIds) {
	const reasons = Object.create(null);
	for (const { pluginId, providerId } of listBundledWorkerProviderOwners(registry, providerIds)) (reasons[pluginId] ??= []).push(`${providerId} durable worker lease`);
	return reasons;
}
//#endregion
export { manifestOwnsWorkerProvider as n, resolveDurableWorkerProviderAutoEnabledReasons as r, listBundledWorkerProviderOwners as t };
