import { a as resolveGlobalSingleton } from "./global-singleton-DrXvEBww.mjs";
//#region src/plugin-state/plugin-state-store.native-binding.ts
const stores = resolveGlobalSingleton(Symbol.for("openclaw.pluginStateNativeBindingStores"), () => /* @__PURE__ */ new WeakMap());
function bindPluginStateNativeBindingStore(store, options, assertReadable, assertCurrent, sessionEntryCurrent, moduleSource) {
	stores.set(store, {
		options,
		assertReadable,
		assertCurrent,
		sessionEntryCurrent,
		moduleSource
	});
	return store;
}
function capturePluginStateNativeBindingStore(store) {
	return stores.get(store);
}
//#endregion
export { capturePluginStateNativeBindingStore as n, bindPluginStateNativeBindingStore as t };
