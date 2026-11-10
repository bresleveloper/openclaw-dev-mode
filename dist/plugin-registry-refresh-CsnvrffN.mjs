import { s as resolveControlPlaneRegistryParams } from "./plugin-registry-snapshot-CR0J8rf8.mjs";
import { n as refreshPersistedInstalledPluginIndex } from "./installed-plugin-index-store-write-DkjTb01T.mjs";
//#region src/plugins/plugin-registry-refresh.ts
/** Refreshes the persisted plugin registry for mutation and doctor flows. */
async function refreshPluginRegistry(params) {
	return await refreshPersistedInstalledPluginIndex(resolveControlPlaneRegistryParams(params));
}
//#endregion
export { refreshPluginRegistry as t };
