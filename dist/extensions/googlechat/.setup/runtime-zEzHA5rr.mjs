import { createPluginRuntimeStore } from "openclaw/plugin-sdk/runtime-store";
// extensions/googlechat/src/runtime.ts
const { setRuntime: setGoogleChatRuntime, getRuntime: getGoogleChatRuntime } = createPluginRuntimeStore({
	pluginId: "googlechat",
	errorMessage: "Google Chat runtime not initialized"
});
export { setGoogleChatRuntime as n, getGoogleChatRuntime as t };
