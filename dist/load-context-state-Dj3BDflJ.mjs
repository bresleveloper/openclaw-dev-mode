//#region src/plugins/runtime/load-context-state.ts
const pluginRuntimeLoadContext = Symbol.for("openclaw.pluginRuntimeLoadContext");
function bindPluginRuntimeLoadContextState(registry, context) {
	Object.defineProperty(registry, pluginRuntimeLoadContext, {
		value: () => context,
		configurable: true,
		writable: true,
		enumerable: true
	});
}
function getPluginRuntimeLoadContextState(registry) {
	return registry?.[pluginRuntimeLoadContext]?.();
}
//#endregion
export { getPluginRuntimeLoadContextState as n, bindPluginRuntimeLoadContextState as t };
