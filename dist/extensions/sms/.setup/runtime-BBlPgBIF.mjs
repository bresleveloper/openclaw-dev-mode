import { createPluginRuntimeStore } from "openclaw/plugin-sdk/runtime-store";
//#region extensions/sms/src/runtime.ts
const { setRuntime: setSmsRuntime, getRuntime: getSmsRuntime } = createPluginRuntimeStore({
	pluginId: "sms",
	errorMessage: "SMS runtime not initialized - plugin not registered"
});
//#endregion
export { setSmsRuntime as n, getSmsRuntime as t };
