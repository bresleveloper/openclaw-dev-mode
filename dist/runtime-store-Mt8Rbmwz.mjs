import { r as getPluginInstanceRuntimeSlot } from "./plugin-instance-scope-C9hxyH_A.mjs";
//#region src/plugin-sdk/runtime-store-registry.ts
const pluginRuntimeStoreRegistryKey = Symbol.for("openclaw.plugin-sdk.runtime-store-registry");
function getNamedPluginRuntimeStoreRegistry() {
	const globalRecord = globalThis;
	globalRecord[pluginRuntimeStoreRegistryKey] ??= /* @__PURE__ */ new Map();
	return globalRecord[pluginRuntimeStoreRegistryKey];
}
function getNamedPluginRuntimeStoreSlot(key) {
	const registry = getNamedPluginRuntimeStoreRegistry();
	let slot = registry.get(key);
	if (!slot) {
		slot = { runtime: null };
		registry.set(key, slot);
	}
	return slot;
}
//#endregion
//#region src/plugin-sdk/runtime-store.ts
function pluginRuntimeStoreKeyForPluginId(pluginId) {
	const normalizedPluginId = pluginId.trim();
	if (!normalizedPluginId) throw new Error("createPluginRuntimeStore: pluginId must not be empty");
	return `plugin-runtime:${normalizedPluginId}`;
}
function resolvePluginRuntimeStoreOptions(options) {
	if (typeof options === "string") return {
		key: options,
		errorMessage: options
	};
	if ("pluginId" in options) return {
		key: pluginRuntimeStoreKeyForPluginId(options.pluginId),
		errorMessage: options.errorMessage
	};
	return options;
}
/** Implementation overload accepting either legacy error-message strings or structured options. */
function createPluginRuntimeStore(options) {
	const resolved = resolvePluginRuntimeStoreOptions(options);
	const defaultSlot = typeof options === "string" ? { runtime: null } : (() => {
		return getNamedPluginRuntimeStoreSlot(resolved.key);
	})();
	const instanceKey = typeof options === "string" ? Symbol(resolved.key) : resolved.key;
	const resolveSlot = () => getPluginInstanceRuntimeSlot(instanceKey) ?? defaultSlot;
	return {
		setRuntime(next) {
			resolveSlot().runtime = next;
		},
		clearRuntime() {
			resolveSlot().runtime = null;
		},
		tryGetRuntime() {
			return resolveSlot().runtime ?? null;
		},
		getRuntime() {
			const slot = resolveSlot();
			if (slot.runtime == null) throw new Error(resolved.errorMessage);
			return slot.runtime;
		}
	};
}
//#endregion
export { createPluginRuntimeStore as t };
