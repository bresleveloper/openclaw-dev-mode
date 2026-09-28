import { s as resolveControlPlaneRegistryParams } from "./plugin-registry-snapshot-BAw04cGV.mjs";
import { t as refreshPersistedInstalledPluginIndex } from "./installed-plugin-index-store-write-9YyZuTlI.mjs";
//#region src/plugins/plugin-registry-refresh.ts
/** Refreshes the persisted plugin registry for mutation and doctor flows. */
async function refreshPluginRegistry(params) {
	return refreshPersistedInstalledPluginIndex(params.config ? resolveControlPlaneRegistryParams(params) : params);
}
//#endregion
export { refreshPluginRegistry as t };
