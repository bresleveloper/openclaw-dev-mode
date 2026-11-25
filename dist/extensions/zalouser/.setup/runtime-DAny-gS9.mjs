import { createPluginRuntimeStore } from "openclaw/plugin-sdk/runtime-store";
// extensions/zalouser/src/runtime.ts
const { setRuntime: setZalouserRuntime, getRuntime: getZalouserRuntime } = createPluginRuntimeStore({
	pluginId: "zalouser",
	errorMessage: "Zalouser runtime not initialized"
});
export { setZalouserRuntime as n, getZalouserRuntime as t };
