import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { n as CHAT_CHANNEL_ORDER } from "./ids-NACrHrny.mjs";
import { a as getActivePluginChannelRegistrySnapshotFromState } from "./registry-lookup-CHpIYnmq.mjs";
import "./registry-BKdVEB34.mjs";
//#region src/channels/plugins/registry-loaded.ts
/**
* Loaded channel plugin registry view.
*
* Normalizes and sorts active plugin runtime state for channel registry callers.
*/
let cachedChannelPluginView;
function coerceLoadedChannelPlugin(plugin) {
	const id = normalizeOptionalString(plugin?.id) ?? "";
	if (!plugin || !id) return null;
	return plugin;
}
function resolveChannelPlugins(registry) {
	const snapshot = getActivePluginChannelRegistrySnapshotFromState();
	const currentRegistry = registry === void 0 || registry === snapshot.registry;
	if (currentRegistry && cachedChannelPluginView?.snapshot === snapshot) return cachedChannelPluginView;
	const selectedRegistry = registry ?? snapshot.registry;
	const seen = /* @__PURE__ */ new Set();
	const byId = /* @__PURE__ */ new Map();
	const entriesById = /* @__PURE__ */ new Map();
	if (selectedRegistry && Array.isArray(selectedRegistry.channels)) for (const entry of selectedRegistry.channels) {
		const plugin = coerceLoadedChannelPlugin(entry?.plugin);
		if (!plugin) continue;
		const id = normalizeOptionalString(plugin.id) ?? "";
		if (!id || seen.has(id)) continue;
		seen.add(id);
		byId.set(plugin.id, plugin);
		entriesById.set(plugin.id, {
			...entry,
			plugin
		});
	}
	const sorted = [...byId.values()].toSorted((a, b) => {
		const indexA = CHAT_CHANNEL_ORDER.indexOf(a.id);
		const indexB = CHAT_CHANNEL_ORDER.indexOf(b.id);
		const orderA = a.meta.order ?? (indexA === -1 ? 999 : indexA);
		const orderB = b.meta.order ?? (indexB === -1 ? 999 : indexB);
		if (orderA !== orderB) return orderA - orderB;
		return a.id.localeCompare(b.id);
	});
	const view = {
		snapshot: currentRegistry ? snapshot : {
			registry: selectedRegistry,
			version: 0
		},
		sorted,
		byId,
		entriesById
	};
	if (currentRegistry) cachedChannelPluginView = view;
	return view;
}
/**
* Lists loaded channel plugins in deterministic display/runtime order.
*/
function listLoadedChannelPlugins() {
	return resolveChannelPlugins().sorted.slice();
}
/** Lists one exact registry without substituting a pinned or active registry. */
function listLoadedChannelPluginsForRegistry(registry) {
	return resolveChannelPlugins(registry).sorted.slice();
}
/**
* Returns a loaded channel plugin by normalized id.
*/
function getLoadedChannelPluginById(id) {
	const resolvedId = normalizeOptionalString(id) ?? "";
	if (!resolvedId) return;
	return resolveChannelPlugins().byId.get(resolvedId);
}
/** Returns one loaded channel plugin without triggering bundled discovery. */
function getLoadedChannelPluginForRead(id) {
	return getLoadedChannelPluginById(id);
}
/**
* Returns the loaded channel registry entry by normalized plugin id.
*/
function getLoadedChannelPluginEntryById(id, registry) {
	const resolvedId = normalizeOptionalString(id) ?? "";
	if (!resolvedId) return;
	return resolveChannelPlugins(registry).entriesById.get(resolvedId);
}
//#endregion
export { listLoadedChannelPluginsForRegistry as a, listLoadedChannelPlugins as i, getLoadedChannelPluginEntryById as n, getLoadedChannelPluginForRead as r, getLoadedChannelPluginById as t };
