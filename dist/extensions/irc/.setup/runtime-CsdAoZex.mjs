import { createPluginRuntimeStore } from "openclaw/plugin-sdk/runtime-store";
// extensions/irc/src/runtime.ts
const { setRuntime: setIrcRuntime, getRuntime: getIrcRuntime, tryGetRuntime: getOptionalIrcRuntime } = createPluginRuntimeStore({
	pluginId: "irc",
	errorMessage: "IRC runtime not initialized"
});
export { getOptionalIrcRuntime as n, setIrcRuntime as r, getIrcRuntime as t };
