import { createPluginRuntimeStore } from "openclaw/plugin-sdk/runtime-store";
// extensions/signal/src/runtime.ts
const { setRuntime: setSignalRuntime, getRuntime: getSignalRuntime, tryGetRuntime: getOptionalSignalRuntime } = createPluginRuntimeStore({
	pluginId: "signal",
	errorMessage: "Signal runtime not initialized"
});
export { getSignalRuntime as n, setSignalRuntime as r, getOptionalSignalRuntime as t };
