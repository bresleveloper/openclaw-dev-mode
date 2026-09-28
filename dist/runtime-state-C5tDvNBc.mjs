import { t as PLUGIN_REGISTRY_STATE } from "./runtime-state-key-Cno8k69C.mjs";
//#region src/plugins/runtime-workspace-state.ts
/** Reads the active plugin registry workspace directory from global runtime state. */
function getActivePluginRegistryWorkspaceDirFromStateCore() {
	return globalThis[PLUGIN_REGISTRY_STATE]?.workspaceDir ?? void 0;
}
//#endregion
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
function getActivePluginRegistryWorkspaceDirFromState() {
	return getActivePluginRegistryWorkspaceDirFromStateCore();
}
//#endregion
export { getActivePluginRegistryWorkspaceDirFromStateCore as a, getPluginRegistryVersion as i, getActivePluginRegistryWorkspaceDirFromState as n, getPluginRegistryState as r, getActivePluginGatewayNodePolicyRegistry as t };
