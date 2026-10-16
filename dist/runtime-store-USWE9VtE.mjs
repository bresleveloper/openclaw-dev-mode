import { r as resolveGlobalMap } from "./global-singleton-0m-JziJW.mjs";
import { i as getPluginInstanceRuntimeSlot } from "./plugin-instance-scope-DEzoxqBj.mjs";
//#region src/plugin-sdk/runtime-store-registry.ts
const pluginRuntimeStoreRegistryKey = Symbol.for("openclaw.plugin-sdk.runtime-store-registry");
function getNamedPluginRuntimeStoreRegistry() {
	return resolveGlobalMap(pluginRuntimeStoreRegistryKey);
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
function resolvePluginRuntimeStoreOptions(options) {
	if (typeof options === "string") return {
		key: options,
		errorMessage: options
	};
	if ("pluginId" in options) {
		const normalizedPluginId = options.pluginId.trim();
		if (!normalizedPluginId) throw new Error("createPluginRuntimeStore: pluginId must not be empty");
		return {
			key: `plugin-runtime:${normalizedPluginId}`,
			errorMessage: options.errorMessage
		};
	}
	return options;
}
/** Implementation overload accepting either legacy error-message strings or structured options. */
function createPluginRuntimeStore(options) {
	const resolved = resolvePluginRuntimeStoreOptions(options);
	const defaultSlot = typeof options === "string" ? { runtime: null } : getNamedPluginRuntimeStoreSlot(resolved.key);
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
