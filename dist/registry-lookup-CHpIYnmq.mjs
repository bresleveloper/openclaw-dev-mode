import { c as normalizeOptionalLowercaseString } from "./string-coerce-CIXf7egm.mjs";
import { t as PLUGIN_REGISTRY_STATE } from "./runtime-state-key-Cno8k69C.mjs";
//#region src/plugins/runtime-channel-state.ts
let activePluginChannelRegistrySnapshot;
/** Returns a snapshot of the process-root plugin registry. */
function getActivePluginChannelRegistrySnapshotFromState() {
	const state = globalThis[PLUGIN_REGISTRY_STATE];
	const registry = state?.activeRegistry ?? null;
	const version = state?.activeVersion ?? 0;
	const cached = activePluginChannelRegistrySnapshot;
	if (cached && cached.registry === registry && cached.version === version) return cached;
	const snapshot = {
		registry,
		version
	};
	activePluginChannelRegistrySnapshot = snapshot;
	return snapshot;
}
/** Returns the active plugin channel registry from global runtime state. */
function getActivePluginChannelRegistryFromState() {
	return getActivePluginChannelRegistrySnapshotFromState().registry;
}
//#endregion
//#region src/channels/registry-lookup.ts
let registeredChannelPluginLookup;
function setLookupEntry(map, key, entry) {
	if (key && !map.has(key)) map.set(key, entry);
}
function buildRegisteredChannelPluginLookup() {
	const { registry, version } = getActivePluginChannelRegistrySnapshotFromState();
	const channels = Array.isArray(registry?.channels) ? registry.channels : void 0;
	const channelCount = channels?.length ?? 0;
	const cached = registeredChannelPluginLookup;
	if (cached && cached.registry === registry && cached.channels === channels && cached.channelCount === channelCount && cached.version === version) return cached;
	const entries = channelCount > 0 ? channels : [];
	const byKey = /* @__PURE__ */ new Map();
	const byId = /* @__PURE__ */ new Map();
	for (const entry of entries) {
		const id = normalizeOptionalLowercaseString(entry.plugin.id ?? "");
		setLookupEntry(byKey, id, entry);
		setLookupEntry(byId, id, entry);
	}
	for (const entry of entries) for (const alias of entry.plugin.meta?.aliases ?? []) setLookupEntry(byKey, normalizeOptionalLowercaseString(alias), entry);
	registeredChannelPluginLookup = {
		registry,
		channels,
		channelCount,
		version,
		entries,
		byKey,
		byId
	};
	return registeredChannelPluginLookup;
}
/** Lists active channel plugin registrations from the current registry snapshot. */
function listRegisteredChannelPluginEntries() {
	return buildRegisteredChannelPluginLookup().entries;
}
/** Finds an active channel plugin registration by normalized id or alias. */
function findRegisteredChannelPluginEntry(normalizedKey) {
	return buildRegisteredChannelPluginLookup().byKey.get(normalizedKey);
}
/** Finds an active channel plugin registration by its canonical plugin id. */
function findRegisteredChannelPluginEntryById(id) {
	const normalizedId = normalizeOptionalLowercaseString(id);
	if (!normalizedId) return;
	return buildRegisteredChannelPluginLookup().byId.get(normalizedId);
}
//#endregion
export { getActivePluginChannelRegistrySnapshotFromState as a, getActivePluginChannelRegistryFromState as i, findRegisteredChannelPluginEntryById as n, listRegisteredChannelPluginEntries as r, findRegisteredChannelPluginEntry as t };
