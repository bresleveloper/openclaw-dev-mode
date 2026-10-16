import { createPluginRuntimeStore } from "openclaw/plugin-sdk/runtime-store";
//#region extensions/tlon/src/runtime.ts
const { setRuntime: setTlonRuntime, getRuntime: getTlonRuntime } = createPluginRuntimeStore({
	pluginId: "tlon",
	errorMessage: "Tlon runtime not initialized"
});
//#endregion
export { setTlonRuntime as n, getTlonRuntime as t };
