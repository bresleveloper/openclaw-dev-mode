import { createPluginRuntimeStore } from "openclaw/plugin-sdk/runtime-store";
// extensions/feishu/src/runtime.ts
const { setRuntime: setFeishuRuntime, getRuntime: getFeishuRuntime } = createPluginRuntimeStore({
	pluginId: "feishu",
	errorMessage: "Feishu runtime not initialized"
});
export { setFeishuRuntime as n, getFeishuRuntime as t };
