//#region src/plugins/runtime-state-key.ts
/** Process-global symbol shared by every plugin registry runtime projection. */
const PLUGIN_REGISTRY_STATE = Symbol.for("openclaw.pluginRegistryState");
//#endregion
//#region src/plugins/runtime-state.ts
function getPluginRegistryState() {
	return globalThis[PLUGIN_REGISTRY_STATE];
}
//#endregion
export { getPluginRegistryState as t };
