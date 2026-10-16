import { n as resolveInstalledPluginIndexStateDatabaseOptions } from "./installed-plugin-index-store-path-vGDuKHrq.mjs";
import { s as resolveControlPlaneRegistryParams } from "./plugin-registry-snapshot-CMOJTUWl.mjs";
import { i as withPluginLifecycleLease } from "./plugin-lifecycle-lease-DHQMWweY.mjs";
import { n as refreshPersistedInstalledPluginIndex } from "./installed-plugin-index-store-write-5ACUs2E_.mjs";
//#region src/plugins/plugin-registry-refresh.ts
/** Refreshes the persisted plugin registry for mutation and doctor flows. */
async function refreshPluginRegistry(params) {
	return await withPluginLifecycleLease(resolveInstalledPluginIndexStateDatabaseOptions(params), async () => refreshPersistedInstalledPluginIndex(resolveControlPlaneRegistryParams(params)));
}
//#endregion
export { refreshPluginRegistry as t };
