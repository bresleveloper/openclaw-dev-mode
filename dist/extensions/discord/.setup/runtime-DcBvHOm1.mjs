import { createPluginRuntimeStore } from "openclaw/plugin-sdk/runtime-store";
// extensions/discord/src/runtime.ts
const { setRuntime: setDiscordRuntime, tryGetRuntime: getOptionalDiscordRuntime, getRuntime: getDiscordRuntime } = createPluginRuntimeStore({
	pluginId: "discord",
	errorMessage: "Discord runtime not initialized"
});
export { getOptionalDiscordRuntime as n, setDiscordRuntime as r, getDiscordRuntime as t };
