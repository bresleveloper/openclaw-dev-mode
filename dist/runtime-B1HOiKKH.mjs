import { t as createPluginRuntimeStore } from "./runtime-store-pFaG-6b2.mjs";
//#region extensions/x/src/runtime.ts
const store = createPluginRuntimeStore({
	pluginId: "x",
	errorMessage: "X runtime not initialized"
});
const getXRuntime = store.getRuntime;
const setXRuntime = store.setRuntime;
//#endregion
export { setXRuntime as n, getXRuntime as t };
