import { t as PLUGIN_REGISTRY_STATE } from "./runtime-state-key-Cno8k69C.mjs";
//#region src/plugins/runtime-state.ts
function getPluginRegistryState() {
	return globalThis[PLUGIN_REGISTRY_STATE];
}
/** Publication provenance follows the selected registry, including retained request snapshots. */
function getPluginRegistryVersion(registry) {
	return registry ? getPluginRegistryState()?.registryVersions?.get(registry) : void 0;
}
/** Policy reads the process-active registry, independently of request or registration scopes. */
function getActivePluginGatewayNodePolicyRegistry() {
	return getPluginRegistryState()?.activeRegistry ?? null;
}
//#endregion
export { getPluginRegistryState as n, getPluginRegistryVersion as r, getActivePluginGatewayNodePolicyRegistry as t };
