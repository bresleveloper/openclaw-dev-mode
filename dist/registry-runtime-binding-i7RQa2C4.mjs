//#region src/plugins/registry-runtime-binding.ts
const PLUGIN_REGISTRY_RUNTIME = Symbol.for("openclaw.pluginRegistryRuntime");
function bindPluginRegistryRuntime(registry, runtime) {
	Object.defineProperty(registry, PLUGIN_REGISTRY_RUNTIME, {
		configurable: false,
		enumerable: false,
		value: runtime,
		writable: false
	});
}
function getPluginRegistryRuntime(registry) {
	return registry[PLUGIN_REGISTRY_RUNTIME];
}
//#endregion
export { getPluginRegistryRuntime as n, bindPluginRegistryRuntime as t };
