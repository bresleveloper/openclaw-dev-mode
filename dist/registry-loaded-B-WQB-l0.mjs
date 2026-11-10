import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { n as CHAT_CHANNEL_ORDER } from "./ids-DhLNdNuz.mjs";
import { a as getActivePluginChannelRegistrySnapshotFromState } from "./registry-lookup-88y6FuGR.mjs";
import "./registry-DqsL4UWB.mjs";
//#region src/channels/plugins/registry-loaded.ts
let cachedChannelPluginView;
function compareChannelPlugins(a, b) {
	const indexA = CHAT_CHANNEL_ORDER.indexOf(a.id);
	const indexB = CHAT_CHANNEL_ORDER.indexOf(b.id);
	const orderA = a.meta.order ?? (indexA === -1 ? 999 : indexA);
	const orderB = b.meta.order ?? (indexB === -1 ? 999 : indexB);
	return orderA !== orderB ? orderA - orderB : a.id.localeCompare(b.id);
}
function resolveChannelPlugins(registry) {
	const snapshot = getActivePluginChannelRegistrySnapshotFromState();
	const currentRegistry = registry === void 0 || registry === snapshot.registry;
	if (currentRegistry && cachedChannelPluginView?.snapshot === snapshot) return cachedChannelPluginView;
	const selectedRegistry = registry ?? snapshot.registry;
	const seen = /* @__PURE__ */ new Set();
	const entriesById = /* @__PURE__ */ new Map();
	if (selectedRegistry && Array.isArray(selectedRegistry.channels)) for (const entry of selectedRegistry.channels) {
		const plugin = entry?.plugin;
		const id = normalizeOptionalString(plugin?.id);
		if (!plugin || !id || seen.has(id)) continue;
		seen.add(id);
		entriesById.set(plugin.id, {
			...entry,
			plugin
		});
	}
	const sorted = [...entriesById.values()].map((entry) => entry.plugin).toSorted(compareChannelPlugins);
	const view = {
		snapshot: currentRegistry ? snapshot : {
			registry: selectedRegistry,
			version: 0
		},
		sorted,
		entriesById
	};
	if (currentRegistry) cachedChannelPluginView = view;
	return view;
}
function listLoadedChannelPlugins() {
	return resolveChannelPlugins().sorted.slice();
}
/** Lists one exact registry without substituting a pinned or active registry. */
function listLoadedChannelPluginsForRegistry(registry) {
	return resolveChannelPlugins(registry).sorted.slice();
}
function getLoadedChannelPluginById(id) {
	return getLoadedChannelPluginEntryById(id)?.plugin;
}
/** Returns one loaded channel plugin without triggering bundled discovery. */
function getLoadedChannelPluginForRead(id) {
	return getLoadedChannelPluginById(id);
}
function getLoadedChannelPluginEntryById(id, registry) {
	const resolvedId = normalizeOptionalString(id) ?? "";
	if (!resolvedId) return;
	return resolveChannelPlugins(registry).entriesById.get(resolvedId);
}
//#endregion
export { listLoadedChannelPlugins as a, getLoadedChannelPluginForRead as i, getLoadedChannelPluginById as n, listLoadedChannelPluginsForRegistry as o, getLoadedChannelPluginEntryById as r, compareChannelPlugins as t };
