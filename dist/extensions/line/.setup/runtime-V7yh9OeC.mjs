import { createPluginRuntimeStore } from "openclaw/plugin-sdk/runtime-store";
//#region extensions/line/src/runtime.ts
const { setRuntime: setLineRuntime, getRuntime: getLineRuntime } = createPluginRuntimeStore({
	pluginId: "line",
	errorMessage: "LINE runtime not initialized - plugin not registered"
});
//#endregion
export { setLineRuntime as n, getLineRuntime as t };
