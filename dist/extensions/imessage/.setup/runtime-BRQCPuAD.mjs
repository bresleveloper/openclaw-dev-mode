import { createPluginRuntimeStore } from "openclaw/plugin-sdk/runtime-store";
// extensions/imessage/src/runtime.ts
const { getRuntime: getIMessageRuntime, setRuntime: setIMessageRuntime, tryGetRuntime: getOptionalIMessageRuntime } = createPluginRuntimeStore({
	pluginId: "imessage",
	errorMessage: "iMessage runtime not initialized"
});
export { getOptionalIMessageRuntime as n, setIMessageRuntime as r, getIMessageRuntime as t };
