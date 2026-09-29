import { n as getPluginRegistryForContext } from "./gateway-request-scope-BLBH-Gpf.mjs";
import { h as isPluginRegistryRetired } from "./registry-lifecycle-BhTDZAHB.mjs";
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
