import { t as createPluginRuntimeStore } from "./runtime-store-Mt8Rbmwz.mjs";
//#region extensions/a2a/src/runtime.ts
const { setRuntime: setA2aChannelRuntime, getRuntime: getA2aChannelRuntime } = createPluginRuntimeStore({
	pluginId: "a2a",
	errorMessage: "A2A channel runtime not initialized"
});
//#endregion
export { setA2aChannelRuntime as n, getA2aChannelRuntime as t };
