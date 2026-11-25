import { createPluginRuntimeStore } from "openclaw/plugin-sdk/runtime-store";
// extensions/slack/src/runtime.ts
const { setRuntime: setSlackRuntime, tryGetRuntime: getOptionalSlackRuntime, getRuntime: getSlackRuntime } = createPluginRuntimeStore({
	pluginId: "slack",
	errorMessage: "Slack runtime not initialized"
});
export { getSlackRuntime as n, setSlackRuntime as r, getOptionalSlackRuntime as t };
