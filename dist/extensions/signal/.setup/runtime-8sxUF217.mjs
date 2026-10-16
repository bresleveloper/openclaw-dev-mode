import { createPluginRuntimeStore } from "openclaw/plugin-sdk/runtime-store";
//#region extensions/signal/src/runtime.ts
const { setRuntime: setSignalRuntime, getRuntime: getSignalRuntime, tryGetRuntime: getOptionalSignalRuntime } = createPluginRuntimeStore({
	pluginId: "signal",
	errorMessage: "Signal runtime not initialized"
});
//#endregion
export { getSignalRuntime as n, setSignalRuntime as r, getOptionalSignalRuntime as t };
