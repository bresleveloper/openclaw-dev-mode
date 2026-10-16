import { r as getPluginRegistryForContext } from "./gateway-request-scope-BSmCVVpP.mjs";
import { b as isPluginRegistryRetired } from "./registry-lifecycle-Dekhrk9Y.mjs";
//#region src/plugins/cli-backends.runtime.ts
function resolveRuntimeCliBackends(mode) {
	const registry = getPluginRegistryForContext();
	return (registry && !isPluginRegistryRetired(registry) ? registry.cliBackends : []).map((entry) => mode === "metadata" ? {
		id: entry.backend.id,
		modelProvider: entry.backend.modelProvider,
		subscriptionAuthDispatch: entry.backend.subscriptionAuthDispatch,
		pluginId: entry.pluginId
	} : Object.assign({}, entry.backend, {
		pluginId: entry.pluginId,
		builtWithOpenClawVersion: entry.builtWithOpenClawVersion
	}));
}
//#endregion
export { resolveRuntimeCliBackends as t };
