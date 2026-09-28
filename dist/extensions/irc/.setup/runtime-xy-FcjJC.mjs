import { createPluginRuntimeStore } from "openclaw/plugin-sdk/runtime-store";
//#region extensions/irc/src/runtime.ts
const { setRuntime: setIrcRuntime, getRuntime: getIrcRuntime } = createPluginRuntimeStore({
	pluginId: "irc",
	errorMessage: "IRC runtime not initialized"
});
//#endregion
export { setIrcRuntime as n, getIrcRuntime as t };
