import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
import { r as getBundledChannelPlugin } from "./bundled-rTRi0B0q.js";
import { a as normalizeAnyChannelId } from "./registry-B5Y8tTE-.js";
import { n as getLoadedChannelPluginEntryById, r as listLoadedChannelPlugins, t as getLoadedChannelPluginById } from "./registry-loaded-qqZxicAD.js";
//#region src/channels/plugins/registry.ts
/**
* Runtime channel plugin registry facade.
*
* Lists, resolves, and normalizes active channel plugins with bundled fallback.
*/
/**
* Lists currently loaded channel plugins in registry order.
*/
function listChannelPlugins() {
	return listLoadedChannelPlugins();
}
/**
* Returns a loaded channel plugin without falling back to bundled metadata.
*/
function getLoadedChannelPlugin(id) {
	const resolvedId = normalizeOptionalString(id) ?? "";
	if (!resolvedId) return;
	return getLoadedChannelPluginById(resolvedId);
}
/**
* Returns the package/install origin for a loaded channel plugin.
*/
function getLoadedChannelPluginOrigin(id) {
	const resolvedId = normalizeOptionalString(id) ?? "";
	if (!resolvedId) return;
	return normalizeOptionalString(getLoadedChannelPluginEntryById(resolvedId)?.origin) ?? void 0;
}
/**
* Returns the active channel plugin, with bundled fallback for built-in channels.
*/
function getChannelPlugin(id) {
	const resolvedId = normalizeOptionalString(id) ?? "";
	if (!resolvedId) return;
	return getLoadedChannelPlugin(resolvedId) ?? getBundledChannelPlugin(resolvedId);
}
/**
* Normalizes user-facing channel aliases to canonical channel ids.
*/
function normalizeChannelId(raw) {
	return normalizeAnyChannelId(raw);
}
//#endregion
export { normalizeChannelId as a, listChannelPlugins as i, getLoadedChannelPlugin as n, getLoadedChannelPluginOrigin as r, getChannelPlugin as t };
