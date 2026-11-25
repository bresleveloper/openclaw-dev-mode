import { createPluginRuntimeStore } from "openclaw/plugin-sdk/runtime-store";
// extensions/sms/src/runtime.ts
const { setRuntime: setSmsRuntime, getRuntime: getSmsRuntime } = createPluginRuntimeStore({
	pluginId: "sms",
	errorMessage: "SMS runtime not initialized - plugin not registered"
});
export { setSmsRuntime as n, getSmsRuntime as t };
