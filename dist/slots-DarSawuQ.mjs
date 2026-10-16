import { c as normalizeOptionalLowercaseString, l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
//#region src/plugins/slots.ts
/** Applies mutually exclusive plugin slot selection for memory and context-engine plugins. */
const SLOT_BY_KIND = {
	memory: "memory",
	"context-engine": "contextEngine"
};
const DEFAULT_SLOT_BY_KEY = {
	memory: "memory-core",
	contextEngine: "legacy"
};
const PLUGIN_SLOT_KEYS = Object.keys(DEFAULT_SLOT_BY_KEY);
/** Normalize a kind field to an array for uniform iteration. */
function normalizeKinds(kind) {
	if (!kind) return [];
	return Array.isArray(kind) ? kind : [kind];
}
/** Check whether a plugin's kind field includes a specific kind. */
function hasKind(kind, target) {
	if (!kind) return false;
	return Array.isArray(kind) ? kind.includes(target) : kind === target;
}
/** Order-insensitive equality check for two kind values (string or array). */
function kindsEqual(a, b) {
	const aN = normalizeKinds(a).toSorted();
	const bN = normalizeKinds(b).toSorted();
	return aN.length === bN.length && aN.every((k, i) => k === bN[i]);
}
/** Return all slot keys that a plugin's kind field maps to. */
function slotKeysForPluginKind(kind) {
	return normalizeKinds(kind).map((k) => SLOT_BY_KIND[k]).filter((k) => k != null);
}
/** Returns the implicit plugin id that owns a slot before config overrides it. */
function defaultSlotIdForKey(slotKey) {
	return DEFAULT_SLOT_BY_KEY[slotKey];
}
/** Raw `plugins.slots[key]`: `none` turns the slot off, blank leaves it unset. */
function normalizeSlotValue(value) {
	const trimmed = normalizeOptionalString(value);
	if (!trimmed) return;
	if (normalizeOptionalLowercaseString(trimmed) === "none") return null;
	return trimmed;
}
function resolveSlotSelection(slotKey, value) {
	const normalized = normalizeSlotValue(value);
	if (normalized === void 0) return {
		kind: "default",
		pluginId: defaultSlotIdForKey(slotKey)
	};
	return normalized === null ? { kind: "off" } : {
		kind: "pinned",
		pluginId: normalized
	};
}
/** Resets every slot currently owned by a plugin to its implicit default. */
function resetPluginSlotsToDefaults(slots, pluginId) {
	if (!slots) return slots;
	const next = { ...slots };
	let changed = false;
	for (const slotKey of PLUGIN_SLOT_KEYS) {
		if (slots[slotKey] !== pluginId) continue;
		delete next[slotKey];
		changed = true;
	}
	return changed ? Object.keys(next).length === 0 ? void 0 : next : slots;
}
/** Updates config so the selected plugin owns all slots implied by its kind. */
function applyExclusiveSlotSelection(params) {
	const slotKeys = slotKeysForPluginKind(params.selectedKind);
	if (slotKeys.length === 0) return params.config;
	const pluginsConfig = params.config.plugins ?? {};
	let anyChanged = false;
	const entries = { ...pluginsConfig.entries };
	const slots = { ...pluginsConfig.slots };
	for (const slotKey of slotKeys) {
		const prevSlot = slots[slotKey];
		const nextSlot = params.selectedId === defaultSlotIdForKey(slotKey) ? void 0 : params.selectedId;
		if (nextSlot === void 0) delete slots[slotKey];
		else slots[slotKey] = nextSlot;
		if (prevSlot !== nextSlot) anyChanged = true;
	}
	if (!anyChanged) return params.config;
	const { slots: _previousSlots, ...pluginsWithoutSlots } = pluginsConfig;
	return {
		...params.config,
		plugins: {
			...pluginsWithoutSlots,
			...Object.keys(slots).length > 0 ? { slots } : {},
			entries
		}
	};
}
//#endregion
export { normalizeSlotValue as a, kindsEqual as i, defaultSlotIdForKey as n, resetPluginSlotsToDefaults as o, hasKind as r, resolveSlotSelection as s, applyExclusiveSlotSelection as t };
