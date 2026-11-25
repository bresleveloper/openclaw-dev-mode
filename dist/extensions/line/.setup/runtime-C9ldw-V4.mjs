import { createPluginRuntimeStore } from "openclaw/plugin-sdk/runtime-store";
// extensions/line/src/runtime.ts
const { setRuntime: setLineRuntime, getRuntime: getLineRuntime } = createPluginRuntimeStore({
	pluginId: "line",
	errorMessage: "LINE runtime not initialized - plugin not registered"
});
export { setLineRuntime as n, getLineRuntime as t };
