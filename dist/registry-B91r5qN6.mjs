import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { o as getPluginRuntimeGatewayRequestScope } from "./gateway-request-scope-1BXD1G3l.mjs";
import "./registry-DqsL4UWB.mjs";
import { a as listLoadedChannelPlugins, n as getLoadedChannelPluginById, r as getLoadedChannelPluginEntryById } from "./registry-loaded-B-WQB-l0.mjs";
import { n as getBundledChannelPlugin } from "./bundled-CEh6W_x7.mjs";
//#region src/channels/plugins/registry.ts
/** Active channel plugin registry with bundled fallback. */
const listChannelPlugins = () => listLoadedChannelPlugins();
/**
* Returns a loaded channel plugin without falling back to bundled metadata.
*/
function getLoadedChannelPlugin(id) {
	return getLoadedChannelPluginById(id);
}
/**
* Resolves the active channel implementation together with host-owned provenance.
*/
function resolveChannelPluginRegistration(id, options = {}) {
	const resolvedId = normalizeOptionalString(id) ?? "";
	if (!resolvedId) return;
	const scopedRegistry = getPluginRuntimeGatewayRequestScope()?.pluginRegistry;
	const scopedEntry = scopedRegistry ? getLoadedChannelPluginEntryById(resolvedId, scopedRegistry) : void 0;
	const loadedEntry = scopedEntry ?? getLoadedChannelPluginEntryById(resolvedId);
	if (loadedEntry) {
		const origin = normalizeOptionalString(loadedEntry.origin) ?? void 0;
		return {
			plugin: loadedEntry.plugin,
			...loadedEntry.resolveChannelRuntime ? { resolveChannelRuntime: loadedEntry.resolveChannelRuntime } : {},
			...origin ? { origin } : {},
			...(!scopedRegistry || scopedEntry) && loadedEntry.captureReadAuthority ? { captureReadAuthority: loadedEntry.captureReadAuthority } : {}
		};
	}
	if (options.loadedOnly) return;
	const plugin = getBundledChannelPlugin(resolvedId);
	return plugin ? {
		plugin,
		origin: "bundled"
	} : void 0;
}
/**
* Returns the active channel plugin, with bundled fallback for built-in channels.
*/
function getChannelPlugin(id) {
	return resolveChannelPluginRegistration(id)?.plugin;
}
//#endregion
export { resolveChannelPluginRegistration as i, getLoadedChannelPlugin as n, listChannelPlugins as r, getChannelPlugin as t };
