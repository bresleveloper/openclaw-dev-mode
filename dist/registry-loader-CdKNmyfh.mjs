import { o as getPluginRuntimeGatewayRequestScope } from "./gateway-request-scope-1BXD1G3l.mjs";
import { l as getActivePluginRegistry } from "./runtime-DkPagH0y.mjs";
//#region src/channels/plugins/registry-loader.ts
/**
* Creates a lazy loader that resolves one value from the authoritative channel registry.
*/
function createChannelRegistryLoader(resolveValue) {
	return async (id) => {
		const pluginEntry = (getPluginRuntimeGatewayRequestScope()?.pluginRegistry ?? getActivePluginRegistry())?.channels.find((entry) => entry.plugin.id === id);
		return pluginEntry ? resolveValue(pluginEntry) : void 0;
	};
}
//#endregion
export { createChannelRegistryLoader as t };
