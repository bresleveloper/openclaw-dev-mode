import { createPluginRuntimeStore } from "openclaw/plugin-sdk/runtime-store";
// extensions/zalo/src/runtime.ts
const { setRuntime: setZaloRuntime, getRuntime: getZaloRuntime } = createPluginRuntimeStore({
	pluginId: "zalo",
	errorMessage: "Zalo runtime not initialized"
});
export { setZaloRuntime as n, getZaloRuntime as t };
