import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { i as getPluginRuntimeGatewayRequestScope } from "./gateway-request-scope-BLBH-Gpf.mjs";
import { n as getBundledChannelPlugin } from "./bundled-D8dZgG2d.mjs";
import { t as normalizeAnyChannelId } from "./registry-normalize-X0yNhfFZ.mjs";
import "./registry-BKdVEB34.mjs";
import { i as listLoadedChannelPlugins, n as getLoadedChannelPluginEntryById, t as getLoadedChannelPluginById } from "./registry-loaded-CYq2sa_C.mjs";
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
/**
* Normalizes user-facing channel aliases to canonical channel ids.
*/
function normalizeChannelId(raw) {
	return normalizeAnyChannelId(raw);
}
//#endregion
export { resolveChannelPluginRegistration as a, normalizeChannelId as i, getLoadedChannelPlugin as n, listChannelPlugins as r, getChannelPlugin as t };
